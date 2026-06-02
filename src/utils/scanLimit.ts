// ─── Pure helpers for scan-limit logic ──────────────────────────────────────

import { FREE_SCAN_LIMIT } from '../types/subscription'

export function isScanAllowed(isPro: boolean, freeScansRemaining: number, dailyScansRemaining?: number): boolean {
  if (isPro) return (dailyScansRemaining ?? 1) > 0
  return freeScansRemaining > 0
}

export function computeFreeScansRemaining(scansUsed: number): number {
  return Math.max(0, FREE_SCAN_LIMIT - scansUsed)
}

export function shouldShowPaywall(isPro: boolean, freeScansRemaining: number): boolean {
  if (isPro) return false
  return freeScansRemaining <= 0
}

export function decrementScans(freeScansRemaining: number): number {
  return Math.max(0, freeScansRemaining - 1)
}
