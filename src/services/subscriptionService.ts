import { Subscription, SubscriptionPlan, ScanLimit, FREE_DAILY_SCAN_LIMIT, PRO_DAILY_SCAN_LIMIT } from '../types/subscription'
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
const FUNCTIONS_REGION = import.meta.env.VITE_FIREBASE_FUNCTIONS_REGION || 'us-central1'

type SyncSubscriptionStatusResponse = {
  success: boolean
  isPro: boolean
  source: 'users' | 'subscriptions' | 'revenuecat' | 'none'
  expiresAt?: string | null
}

type SyncSubscriptionStatusRequest = {
  revenueCatAppUserId?: string | null
}

// ─── Subscription CRUD ──────────────────────────────────────────────────────

export function getSubscription(userId: string): Subscription | null {
  const stored = localStorage.getItem(`${STORAGE_KEY}_${userId}`)
  return stored ? JSON.parse(stored) : null
}

export function saveSubscription(userId: string, subscription: Subscription): void {
  localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(subscription))
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

  if (!response.ok || payload.error || !payload.result?.isPro) {
    throw new Error(payload.error?.message || 'Active Pro subscription could not be verified.')
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
  const planMonths = plan === 'pro_yearly' ? 12 : plan === 'pro_quarterly' ? 3 : 1
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
 * Purchase a subscription via RevenueCat (native) or mock (web).
 * This is the primary purchase method — it replaces the old mock-only flow.
 */
export async function purchaseSubscription(
  userId: string,
  planOrPackageId: SubscriptionPlan | string
): Promise<PurchaseResult> {
  const result = await purchasePackage(planOrPackageId)

  if (result.success && result.subscription) {
    // Persist locally for offline / quick access
    saveSubscription(userId, result.subscription)
    try {
      await requireServerSubscriptionSync(userId)
    } catch (err) {
      console.error('[Subscription] Server sync failed after purchase:', err)
      return {
        success: false,
        isPro: false,
        subscription: result.subscription,
        error: err instanceof Error ? err.message : 'Pro subscription could not be verified on the server.',
      }
    }
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
    try {
      await requireServerSubscriptionSync(userId)
    } catch (err) {
      console.error('[Subscription] Server sync failed after restore:', err)
      return {
        success: false,
        isPro: false,
        subscription: result.subscription,
        error: err instanceof Error ? err.message : 'Pro subscription could not be verified on the server.',
      }
    }
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

  const data: DailyScanData = JSON.parse(stored)
  // Gün değiştiyse sıfırla
  if (data.date !== getTodayKey()) return 0
  return data.count
}

function incrementDailyScanCount(userId: string): number {
  const today = getTodayKey()
  const current = getDailyScanCount(userId)
  const updated = current + 1
  const data: DailyScanData = { date: today, count: updated }
  localStorage.setItem(`${DAILY_SCAN_KEY}_${userId}`, JSON.stringify(data))
  return updated
}

export function getDailyScansRemaining(userId: string): number {
  const isPro = isProUserSync(userId)
  const used = getDailyScanCount(userId)
  return Math.max(0, (isPro ? PRO_DAILY_SCAN_LIMIT : FREE_DAILY_SCAN_LIMIT) - used)
}

/** Get the number of free scans remaining for a user. */
export function getFreeScansRemaining(userId: string): number {
  const used = getDailyScanCount(userId)
  return Math.max(0, FREE_DAILY_SCAN_LIMIT - used)
}

// ─── Composite helpers ──────────────────────────────────────────────────────

export function getScanLimit(userId: string): ScanLimit {
  const isPro = isProUserSync(userId)
  const dailyUsed = getDailyScanCount(userId)

  if (isPro) {
    const remaining = Math.max(0, PRO_DAILY_SCAN_LIMIT - dailyUsed)
    return {
      used: dailyUsed,
      total: PRO_DAILY_SCAN_LIMIT,
      remaining,
      isLimited: remaining <= 0,
    }
  }

  const remaining = Math.max(0, FREE_DAILY_SCAN_LIMIT - dailyUsed)
  return {
    used: dailyUsed,
    total: FREE_DAILY_SCAN_LIMIT,
    remaining,
    isLimited: remaining <= 0,
  }
}

export function canPerformScan(userId: string): boolean {
  return !getScanLimit(userId).isLimited
}
