import { useState, useCallback, useMemo } from 'react'
import { PLUS_DAILY_SCAN_LIMIT, ScanLimit } from '../types/subscription'
import {
  getScanLimit,
  incrementScanCount,
  getDailyScansRemaining,
  isProUserSync,
  decrementExtraScanCredit,
} from '../services/subscriptionService'

/**
 * Manages scan-limit state for a user.
 *
 * Key invariant: `consumeScan()` must only be called **after** a successful
 * AI analysis. Never call it speculatively or before the result is confirmed.
 *
 * AI photo scanning is gated by subscription:
 * free users get 0 scans, Pro users get 5 scans per day.
 */
export function useScanLimit(userId: string | undefined, profileIsPro = false) {
  const [refreshVersion, setRefreshVersion] = useState(0)
  const isPro = userId ? (profileIsPro || isProUserSync(userId)) : false

  const limit = useMemo<ScanLimit>(() => {
    void refreshVersion
    if (!userId) return { used: 0, total: Infinity, remaining: Infinity, isLimited: false }
    const next = getScanLimit(userId)
    // Bridge window: the profile flag says paid but the local subscription
    // record hasn't synced yet, so the tier is unknown. Default to the LOWER
    // paid tier (Plus = 3), never Pro (5) — over-granting Pro scans to a Plus
    // (or stale) user is exactly the "5/5 tarama" bug. Resolves to the real
    // tier once the subscription syncs.
    if (profileIsPro && !isProUserSync(userId)) {
      const remaining = Math.max(0, PLUS_DAILY_SCAN_LIMIT - next.used)
      return {
        ...next,
        total: PLUS_DAILY_SCAN_LIMIT,
        remaining,
        isLimited: remaining <= 0,
      }
    }
    return next
  }, [profileIsPro, refreshVersion, userId])

  const freeScansRemaining = useMemo(() => {
    if (isPro) return 0
    return limit.remaining
  }, [isPro, limit.remaining])

  const dailyScansRemaining = useMemo(() => {
    if (!userId) return Infinity
    if (profileIsPro && !isProUserSync(userId)) {
      return Math.max(0, PLUS_DAILY_SCAN_LIMIT - limit.used)
    }
    return getDailyScansRemaining(userId)
  }, [limit.used, profileIsPro, userId])

  const canScan = useMemo(
    () => limit.remaining > 0 || dailyScansRemaining > 0,
    [dailyScansRemaining, limit.remaining]
  )

  const showPaywall = useMemo(
    () => !isPro && limit.remaining <= 0,
    [isPro, limit.remaining]
  )

  const refresh = useCallback(() => {
    setRefreshVersion((version) => version + 1)
  }, [])

  /**
   * Record one successful analysis for local analytics only.
   */
  const consumeScan = useCallback((): boolean => {
    if (!userId) return false
    if (dailyScansRemaining <= 0 && (limit.extraCredits ?? 0) > 0) {
      decrementExtraScanCredit(userId)
    } else {
      incrementScanCount(userId)
    }
    refresh()
    return true
  }, [dailyScansRemaining, limit.extraCredits, userId, refresh])

  return {
    limit,
    isPro,
    canScan,
    showPaywall,
    freeScansRemaining,
    dailyScansRemaining,
    consumeScan,
    refresh,
  }
}
