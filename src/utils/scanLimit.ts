// ─── Pure helpers for scan-limit logic ──────────────────────────────────────

import { FREE_DAILY_SCAN_LIMIT, PRO_DAILY_SCAN_LIMIT } from '../types/subscription'

export function isScanAllowed(isPro: boolean, freeScansRemaining: number, dailyScansRemaining = 0): boolean {
  return isPro ? dailyScansRemaining > 0 : freeScansRemaining > 0
}

export function computeFreeScansRemaining(dailyUsed: number): number {
  return Math.max(0, FREE_DAILY_SCAN_LIMIT - dailyUsed)
}

export function shouldShowPaywall(isPro: boolean, freeScansRemaining: number): boolean {
  if (isPro) return false
  return freeScansRemaining <= 0
}

export function computeProScansRemaining(dailyUsed: number): number {
  return Math.max(0, PRO_DAILY_SCAN_LIMIT - dailyUsed)
}

export function decrementScans(freeScansRemaining: number): number {
  return Math.max(0, freeScansRemaining - 1)
}
