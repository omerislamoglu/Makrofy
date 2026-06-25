import {
  Subscription,
  SubscriptionPlan,
  ScanLimit,
  FREE_DAILY_SCAN_LIMIT,
  getDailyScanLimitForTier,
  getPlanTier,
} from '../types/subscription'
import { getFunctions, httpsCallable } from 'firebase/functions'
import {
  initRevenueCat,
  identifyUser,
  checkProStatus,
  purchasePackage,
  restorePurchases,
  getOfferings,
  getCurrentRevenueCatAppUserId,
  isRevenueCatProductionConfigured,
  type RCPackage,
  type PurchaseResult,
} from './revenueCatService'
import { app, auth, isDemoMode } from './firebase'
import { createId } from '../utils/id'
import { Capacitor } from '@capacitor/core'
import { getToday } from '../utils/date'

// ─── Re-export RevenueCat helpers ──────────────────────────────────────────
export { initRevenueCat, identifyUser, getOfferings }
export type { RCPackage, PurchaseResult }

// ─── Storage keys ───────────────────────────────────────────────────────────

const STORAGE_KEY = 'makrofy_subscription'
const DAILY_SCAN_KEY = 'makrofy_daily_scans'
const EXTRA_SCAN_CREDITS_KEY = 'makrofy_extra_scan_credits'
const FUNCTIONS_REGION = import.meta.env.VITE_FIREBASE_FUNCTIONS_REGION || 'us-central1'

type SyncSubscriptionStatusResponse = {
  success: boolean
  isPro: boolean
  planTier?: 'free' | 'plus' | 'pro'
  dailyScanLimit?: number
  source: 'users' | 'subscriptions' | 'revenuecat' | 'none'
  expiresAt?: string | null
}

type SyncSubscriptionStatusRequest = {
  revenueCatAppUserId?: string | null
}

type GrantScanPackRequest = {
  productId: string
  purchaseId?: string
}

type GrantScanPackResponse = {
  success: boolean
  productId: string
  creditsAdded: number
  totalCredits: number
}

// ─── Subscription CRUD ──────────────────────────────────────────────────────

export function getSubscription(userId: string): Subscription | null {
  const stored = localStorage.getItem(`${STORAGE_KEY}_${userId}`)
  if (!stored) return null
  try {
    return JSON.parse(stored) as Subscription
  } catch {
    return null
  }
}

export function saveSubscription(userId: string, subscription: Subscription): void {
  localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(subscription))
}

/**
 * Hard-remove the locally cached subscription. Used when the authoritative
 * server sync reports the user has NO active entitlement, so a stale Pro/Plus
 * record (e.g. left over from prior sandbox testing or another account on the
 * same device) can never keep showing a paid tier the user no longer holds.
 */
export function clearLocalSubscription(userId: string): void {
  localStorage.removeItem(`${STORAGE_KEY}_${userId}`)
}

export async function syncSubscriptionStatus(userId: string): Promise<SyncSubscriptionStatusResponse> {
  if (isDemoMode || !isRevenueCatProductionConfigured()) {
    return { success: true, isPro: getSubscription(userId)?.status === 'active', source: 'none' }
  }

  if (Capacitor.isNativePlatform()) {
    return syncSubscriptionStatusNative()
  }

  if (!auth.currentUser) {
    throw new Error('Please sign in to sync subscription status.')
  }

  const revenueCatAppUserId = await getCurrentRevenueCatAppUserId()
  const sync = httpsCallable<SyncSubscriptionStatusRequest, SyncSubscriptionStatusResponse>(
    getFunctions(app, FUNCTIONS_REGION),
    'syncSubscriptionStatus'
  )
  const response = await sync({ revenueCatAppUserId })
  return response.data
}

async function syncSubscriptionStatusNative(): Promise<SyncSubscriptionStatusResponse> {
  const { FirebaseAuthentication } = await import('@capacitor-firebase/authentication')
  const [{ user }, { token }] = await Promise.all([
    FirebaseAuthentication.getCurrentUser(),
    FirebaseAuthentication.getIdToken({ forceRefresh: true }),
  ])

  if (!user || !token) {
    throw new Error('Please sign in to sync subscription status.')
  }

  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID
  if (!projectId) {
    throw new Error('Firebase project ID not configured.')
  }

  const endpoint = `https://${FUNCTIONS_REGION}-${projectId}.cloudfunctions.net/syncSubscriptionStatus`
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: { revenueCatAppUserId: await getCurrentRevenueCatAppUserId() } }),
  })

  const rawText = await response.text()
  let payload: {
    result?: SyncSubscriptionStatusResponse
    error?: { message?: string; status?: string }
  }

  try {
    payload = JSON.parse(rawText)
  } catch {
    throw new Error(`Subscription sync returned invalid JSON (HTTP ${response.status}).`)
  }

  // Only throw on a genuine transport/server error. A successful response that
  // reports isPro:false is NOT an error — it's the authoritative signal the
  // caller uses to downgrade a stale local subscription. Throwing on not-pro
  // (the old behavior) meant the client could never clear a leftover Pro/Plus
  // record on device, so a wrong tier kept showing forever.
  if (!response.ok || payload.error || !payload.result) {
    throw new Error(payload.error?.message || `Subscription sync failed (HTTP ${response.status}).`)
  }

  return payload.result
}

async function requireServerSubscriptionSync(userId: string): Promise<void> {
  if (!Capacitor.isNativePlatform() || !isRevenueCatProductionConfigured()) return

  const status = await syncSubscriptionStatus(userId)
  if (!status.isPro) {
    throw new Error('Active Pro subscription could not be verified on the server.')
  }
}

async function grantScanPackCredits(userId: string, productId: string): Promise<GrantScanPackResponse | null> {
  if (isDemoMode) return null

  if (Capacitor.isNativePlatform()) {
    const { FirebaseAuthentication } = await import('@capacitor-firebase/authentication')
    const [{ user }, { token }] = await Promise.all([
      FirebaseAuthentication.getCurrentUser(),
      FirebaseAuthentication.getIdToken({ forceRefresh: true }),
    ])

    if (!user || !token) {
      throw new Error('Please sign in to add scan credits.')
    }

    const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID
    if (!projectId) {
      throw new Error('Firebase project ID not configured.')
    }

    const endpoint = `https://${FUNCTIONS_REGION}-${projectId}.cloudfunctions.net/grantScanPack`
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          productId,
          purchaseId: `${productId}_${Date.now()}`,
        },
      }),
    })
    const rawText = await response.text()
    let payload: { result?: GrantScanPackResponse; error?: { message?: string } }
    try {
      payload = JSON.parse(rawText) as typeof payload
    } catch {
      throw new Error(`Scan credits grant returned invalid response (HTTP ${response.status}).`)
    }
    if (!response.ok || payload.error || !payload.result?.success) {
      throw new Error(payload.error?.message || 'Scan credits could not be added.')
    }
    return payload.result
  }

  if (!auth.currentUser) {
    throw new Error('Please sign in to add scan credits.')
  }

  const grantScanPack = httpsCallable<GrantScanPackRequest, GrantScanPackResponse>(
    getFunctions(app, FUNCTIONS_REGION),
    'grantScanPack'
  )
  const response = await grantScanPack({
    productId,
    purchaseId: `${productId}_${userId}_${Date.now()}`,
  })
  return response.data
}

export async function isProUser(userId: string): Promise<boolean> {
  if (!isRevenueCatProductionConfigured()) {
    if (Capacitor.isNativePlatform()) return false
    return getSubscription(userId)?.status === 'active'
  }

  // Check RevenueCat first (native), fall back to local
  const rcPro = await checkProStatus()
  if (rcPro) return true

  const subscription = getSubscription(userId)
  return subscription?.status === 'active'
}

export function isProUserSync(userId: string): boolean {
  if (!isRevenueCatProductionConfigured()) {
    if (Capacitor.isNativePlatform()) return false
    return getSubscription(userId)?.status === 'active'
  }

  const subscription = getSubscription(userId)
  return subscription?.status === 'active'
}

export function activateSubscription(
  userId: string,
  plan: SubscriptionPlan
): Subscription {
  const now = new Date().toISOString()
  const expiresAt = new Date()
  const planMonths = plan.endsWith('_yearly') ? 12 : plan.endsWith('_quarterly') ? 3 : 1
  expiresAt.setMonth(expiresAt.getMonth() + planMonths)

  const subscription: Subscription = {
    id: createId(),
    userId,
    plan,
    status: 'active',
    platform: 'web',
    startedAt: now,
    expiresAt: expiresAt.toISOString(),
    cancelledAt: null,
    createdAt: now,
    updatedAt: now,
  }

  localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(subscription))
  return subscription
}

export function cancelSubscription(userId: string): void {
  const subscription = getSubscription(userId)
  if (!subscription) return

  const now = new Date().toISOString()
  const updated: Subscription = {
    ...subscription,
    status: 'cancelled',
    cancelledAt: now,
    updatedAt: now,
  }

  localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(updated))
}

/**
 * Reconcile the backend subscription mirror in the background, retrying a few
 * times with backoff. Used after a successful RevenueCat purchase/restore: the
 * client-side StoreKit receipt (validated by RevenueCat) is authoritative, but
 * the Firebase mirror can lag a few seconds behind RevenueCat's webhook. We must
 * never block the unlock or show a "failed" screen on that lag — so this runs
 * fire-and-forget and just keeps trying until the server agrees.
 */
function reconcileServerSubscriptionInBackground(userId: string, maxAttempts = 4): void {
  let attempt = 0
  const run = () => {
    attempt += 1
    requireServerSubscriptionSync(userId)
      .then(() => {
        if (import.meta.env.DEV) console.log('[Subscription] Server sync reconciled', { attempt })
      })
      .catch((err) => {
        if (attempt < maxAttempts) {
          setTimeout(run, Math.min(2000 * attempt, 8000))
        } else {
          console.warn('[Subscription] Server sync still pending after purchase/restore:', err)
        }
      })
  }
  run()
}

function grantScanPackCreditsInBackground(userId: string, productId: string, optimisticCredits: number): void {
  grantScanPackCredits(userId, productId)
    .then((grant) => {
      const confirmedCredits = grant?.creditsAdded ?? optimisticCredits
      const delta = confirmedCredits - optimisticCredits
      if (delta !== 0) addExtraScanCredits(userId, delta)
    })
    .catch((err) => {
      console.warn('[Subscription] Scan pack server grant still pending after purchase:', err)
    })
}

/**
 * Purchase a subscription via RevenueCat (native) or mock (web).
 * This is the primary purchase method — it replaces the old mock-only flow.
 */
export async function purchaseSubscription(
  userId: string,
  planOrPackageId: SubscriptionPlan | string
): Promise<PurchaseResult> {
  const result = await purchasePackage(planOrPackageId)

  if (result.success && result.scanCredits && result.productId) {
    if (Capacitor.isNativePlatform()) {
      addExtraScanCredits(userId, result.scanCredits)
      grantScanPackCreditsInBackground(userId, result.productId, result.scanCredits)
      return result
    }

    const grant = await grantScanPackCredits(userId, result.productId)
    addExtraScanCredits(userId, grant?.creditsAdded ?? result.scanCredits)
    return {
      ...result,
      scanCredits: grant?.creditsAdded ?? result.scanCredits,
    }
  }

  if (result.success && result.subscription) {
    // Persist locally for offline / quick access
    saveSubscription(userId, result.subscription)
    // RevenueCat has already confirmed the StoreKit purchase. Do not block the
    // UI on the Firebase mirror; it can lag behind the webhook/API by seconds.
    reconcileServerSubscriptionInBackground(userId)
  }

  return result
}

/**
 * Restore purchases via RevenueCat (native) or mock (web).
 */
export async function restorePurchase(userId: string): Promise<PurchaseResult> {
  const result = await restorePurchases()

  if (result.success && result.subscription) {
    saveSubscription(userId, result.subscription)
    reconcileServerSubscriptionInBackground(userId)
  }

  return result
}

// ─── Scan count tracking ────────────────────────────────────────────────────
// All users tracked via daily counter. Free = 0/day, Pro = 5/day.

export function getScanCount(userId: string): number {
  return getDailyScanCount(userId)
}

/**
 * Record one consumed scan. Call this ONLY after a successful AI analysis.
 * Returns the updated daily count.
 */
export function incrementScanCount(userId: string): number {
  return incrementDailyScanCount(userId)
}

/** Reset scan count to zero (e.g. for a new billing cycle). */
export function resetScanCount(userId: string): void {
  const today = getTodayKey()
  localStorage.setItem(`${DAILY_SCAN_KEY}_${userId}`, JSON.stringify({ date: today, count: 0 }))
}

// ─── Daily scan tracking ────────────────────────────────────────────────────

function getTodayKey(): string {
  return getToday()
}

interface DailyScanData {
  date: string
  count: number
}

export function getDailyScanCount(userId: string): number {
  const stored = localStorage.getItem(`${DAILY_SCAN_KEY}_${userId}`)
  if (!stored) return 0

  try {
    const data: DailyScanData = JSON.parse(stored)
    // Gün değiştiyse sıfırla
    if (data.date !== getTodayKey()) return 0
    return data.count
  } catch {
    return 0
  }
}

function incrementDailyScanCount(userId: string): number {
  const today = getTodayKey()
  const current = getDailyScanCount(userId)
  const updated = current + 1
  const data: DailyScanData = { date: today, count: updated }
  localStorage.setItem(`${DAILY_SCAN_KEY}_${userId}`, JSON.stringify(data))
  return updated
}

export function getExtraScanCredits(userId: string): number {
  const raw = localStorage.getItem(`${EXTRA_SCAN_CREDITS_KEY}_${userId}`)
  const value = raw ? Number.parseInt(raw, 10) : 0
  return Number.isFinite(value) ? Math.max(0, value) : 0
}

export function addExtraScanCredits(userId: string, credits: number): number {
  const next = getExtraScanCredits(userId) + Math.max(0, Math.floor(credits))
  localStorage.setItem(`${EXTRA_SCAN_CREDITS_KEY}_${userId}`, String(next))
  return next
}

export function decrementExtraScanCredit(userId: string): number {
  const next = Math.max(0, getExtraScanCredits(userId) - 1)
  localStorage.setItem(`${EXTRA_SCAN_CREDITS_KEY}_${userId}`, String(next))
  return next
}

export function getDailyScansRemaining(userId: string): number {
  const subscription = getSubscription(userId)
  const tier = getPlanTier(subscription?.plan)
  const used = getDailyScanCount(userId)
  return Math.max(0, getDailyScanLimitForTier(tier) - used)
}

/** Get the number of free scans remaining for a user. */
export function getFreeScansRemaining(userId: string): number {
  const used = getDailyScanCount(userId)
  return Math.max(0, FREE_DAILY_SCAN_LIMIT - used)
}

// ─── Composite helpers ──────────────────────────────────────────────────────

export function getScanLimit(userId: string): ScanLimit {
  const subscription = getSubscription(userId)
  // Unknown-but-paid → 'plus' (lower paid tier), never 'pro': a Plus subscriber
  // must not be granted the Pro 5/5 scan limit on an unresolved plan.
  const tier = isProUserSync(userId) ? getPlanTier(subscription?.plan || 'plus_monthly') : 'free'
  const dailyUsed = getDailyScanCount(userId)
  const total = getDailyScanLimitForTier(tier)
  const extraCredits = getExtraScanCredits(userId)

  if (tier !== 'free') {
    const dailyRemaining = Math.max(0, total - dailyUsed)
    const remaining = dailyRemaining + extraCredits
    return {
      used: dailyUsed,
      total: total + extraCredits,
      remaining,
      extraCredits,
      isLimited: remaining <= 0,
    }
  }

  const remaining = Math.max(0, FREE_DAILY_SCAN_LIMIT - dailyUsed) + extraCredits
  return {
    used: dailyUsed,
    total: FREE_DAILY_SCAN_LIMIT + extraCredits,
    remaining,
    extraCredits,
    isLimited: remaining <= 0,
  }
}

export function canPerformScan(userId: string): boolean {
  return !getScanLimit(userId).isLimited
}
