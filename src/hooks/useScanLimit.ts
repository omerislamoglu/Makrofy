import { useState, useCallback, useMemo } from 'react'
import { ScanLimit } from '../types/subscription'
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
 * AI photo scanning is available to signed-in users without a free/pro scan cap.
 */
export function useScanLimit(userId: string | undefined) {
  const [limit, setLimit] = useState<ScanLimit>(() => {
    if (!userId) return { used: 0, total: Infinity, remaining: Infinity, isLimited: false }
    return getScanLimit(userId)
  })

  const isPro = userId ? isProUserSync(userId) : false

  const freeScansRemaining = useMemo(() => {
    if (isPro) return Infinity
    return limit.remaining
  }, [isPro, limit.remaining])

  const dailyScansRemaining = useMemo(() => {
    if (!userId) return Infinity
    return getDailyScansRemaining(userId)
  }, [userId, limit])

  const canScan = useMemo(
    () => isScanAllowed(isPro, freeScansRemaining, dailyScansRemaining),
    [isPro, freeScansRemaining, dailyScansRemaining]
  )

  const showPaywall = useMemo(
    () => shouldShowPaywall(isPro, freeScansRemaining),
    [isPro, freeScansRemaining]
  )

  const refresh = useCallback(() => {
    if (!userId) return
    setLimit(getScanLimit(userId))
  }, [userId])

  /**
   * Record one successful analysis for local analytics only.
   */
  const consumeScan = useCallback((): boolean => {
    if (!userId) return false
    incrementScanCount(userId)
    refresh()
    return true
  }, [userId, canScan, refresh])

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
