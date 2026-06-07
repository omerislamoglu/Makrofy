import { useState, useCallback, useMemo } from 'react'
import { PRO_DAILY_SCAN_LIMIT, ScanLimit } from '../types/subscription'
import {
  getScanLimit,
  incrementScanCount,
  getDailyScansRemaining,
  isProUserSync,
} from '../services/subscriptionService'
import { isScanAllowed, shouldShowPaywall } from '../utils/scanLimit'

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
    if (profileIsPro && !isProUserSync(userId)) {
      const remaining = Math.max(0, PRO_DAILY_SCAN_LIMIT - next.used)
      return {
        ...next,
        total: PRO_DAILY_SCAN_LIMIT,
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
      return Math.max(0, PRO_DAILY_SCAN_LIMIT - limit.used)
    }
    return getDailyScansRemaining(userId)
  }, [limit.used, profileIsPro, userId])

  const canScan = useMemo(
    () => isScanAllowed(isPro, freeScansRemaining, dailyScansRemaining),
    [isPro, freeScansRemaining, dailyScansRemaining]
  )

  const showPaywall = useMemo(
    () => shouldShowPaywall(isPro, freeScansRemaining),
    [isPro, freeScansRemaining]
  )

  const refresh = useCallback(() => {
    setRefreshVersion((version) => version + 1)
  }, [])

  /**
   * Record one successful analysis for local analytics only.
   */
  const consumeScan = useCallback((): boolean => {
    if (!userId) return false
    incrementScanCount(userId)
    refresh()
    return true
  }, [userId, refresh])

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
