import { Subscription, SubscriptionPlan, ScanLimit, FREE_SCAN_LIMIT, PRO_DAILY_SCAN_LIMIT } from '../types/subscription'
import {
  initRevenueCat,
  identifyUser,
  checkProStatus,
  purchasePackage,
  restorePurchases,
  getOfferings,
  isRevenueCatProductionConfigured,
  type RCPackage,
  type PurchaseResult,
} from './revenueCatService'
import { createId } from '../utils/id'
import { Capacitor } from '@capacitor/core'

// ─── Re-export RevenueCat helpers ──────────────────────────────────────────
export { initRevenueCat, identifyUser, getOfferings }
export type { RCPackage, PurchaseResult }

// ─── Storage keys ───────────────────────────────────────────────────────────

const STORAGE_KEY = 'makrofy_subscription'
const SCAN_COUNT_KEY = 'makrofy_scan_count'
const DAILY_SCAN_KEY = 'makrofy_daily_scans'

// ─── Subscription CRUD ──────────────────────────────────────────────────────

export function getSubscription(userId: string): Subscription | null {
  const stored = localStorage.getItem(`${STORAGE_KEY}_${userId}`)
  return stored ? JSON.parse(stored) : null
}

export function saveSubscription(userId: string, subscription: Subscription): void {
  localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(subscription))
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
  const planMonths = plan === 'pro_yearly' ? 12 : plan === 'pro_quarterly' ? 6 : 1
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
  }

  return result
}

// ─── Scan count tracking ────────────────────────────────────────────────────
// Client-side bookkeeping only. Real enforcement must happen server-side.

export function getScanCount(userId: string): number {
  const stored = localStorage.getItem(`${SCAN_COUNT_KEY}_${userId}`)
  return stored ? parseInt(stored, 10) : 0
}

/**
 * Record one consumed scan. Call this ONLY after a successful AI analysis.
 * Returns the updated count.
 */
export function incrementScanCount(userId: string): number {
  const current = getScanCount(userId)
  const updated = current + 1
  localStorage.setItem(`${SCAN_COUNT_KEY}_${userId}`, String(updated))

  // Also increment daily counter for Pro users
  incrementDailyScanCount(userId)

  return updated
}

/** Reset scan count to zero (e.g. for a new billing cycle). */
export function resetScanCount(userId: string): void {
  localStorage.setItem(`${SCAN_COUNT_KEY}_${userId}`, '0')
}

// ─── Daily scan tracking (Pro users) ────────────────────────────────────────

function getTodayKey(): string {
  return new Date().toISOString().split('T')[0]
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

function incrementDailyScanCount(userId: string): void {
  const today = getTodayKey()
  const current = getDailyScanCount(userId)
  const data: DailyScanData = { date: today, count: current + 1 }
  localStorage.setItem(`${DAILY_SCAN_KEY}_${userId}`, JSON.stringify(data))
}

export function getDailyScansRemaining(userId: string): number {
  const isPro = isProUserSync(userId)
  if (!isPro) return Infinity
  const used = getDailyScanCount(userId)
  return Math.max(0, PRO_DAILY_SCAN_LIMIT - used)
}

/** Get the number of free scans remaining for a user. */
export function getFreeScansRemaining(userId: string): number {
  const isPro = isProUserSync(userId)
  if (isPro) return Infinity
  const used = getScanCount(userId)
  return Math.max(0, FREE_SCAN_LIMIT - used)
}

// ─── Composite helpers ──────────────────────────────────────────────────────

export function getScanLimit(userId: string): ScanLimit {
  const isPro = isProUserSync(userId)
  const used = getScanCount(userId)

  if (isPro) {
    const dailyUsed = getDailyScanCount(userId)
    const dailyRemaining = Math.max(0, PRO_DAILY_SCAN_LIMIT - dailyUsed)
    return {
      used: dailyUsed,
      total: PRO_DAILY_SCAN_LIMIT,
      remaining: dailyRemaining,
      isLimited: dailyRemaining <= 0,
    }
  }

  const remaining = Math.max(0, FREE_SCAN_LIMIT - used)
  return {
    used,
    total: FREE_SCAN_LIMIT,
    remaining,
    isLimited: remaining <= 0,
  }
}

export function canPerformScan(userId: string): boolean {
  return !getScanLimit(userId).isLimited
}
