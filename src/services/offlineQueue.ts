/**
 * offlineQueue — localStorage-backed meal save queue
 *
 * When a meal save fails because the device is offline the caller can enqueue
 * the meal here instead of discarding it. The queue survives app restarts.
 * `drainOfflineQueue` (called from mealService) retries every entry when the
 * network comes back.
 */

import type { Meal } from '../types/meal'

const QUEUE_KEY = 'makrofy_offline_queue_v1'
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000 // purge entries older than 7 days

export type OfflineQueueEntry = {
  userId: string
  meal: Meal
  saveType: 'createMeal' | 'saveAIScanMeal'
  existingMealId?: string
  enqueuedAt: number
}

// ─── Internal helpers ──────────────────────────────────────────────────────

function readQueue(): OfflineQueueEntry[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as OfflineQueueEntry[]
    // Purge stale entries
    const now = Date.now()
    const fresh = parsed.filter((e) => now - e.enqueuedAt < MAX_AGE_MS)
    if (fresh.length !== parsed.length) writeQueue(fresh)
    return fresh
  } catch {
    return []
  }
}

function writeQueue(queue: OfflineQueueEntry[]): void {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
  } catch {
    // localStorage quota exceeded — silently ignore
  }
}

// ─── Public API ────────────────────────────────────────────────────────────

/** Persist a meal to the offline queue (idempotent by meal.id). */
export function enqueueMeal(
  userId: string,
  meal: Meal,
  saveType: OfflineQueueEntry['saveType'] = 'createMeal',
  existingMealId?: string
): void {
  const queue = readQueue()
  // Dedup: replace any existing entry for the same meal id
  const deduped = queue.filter((e) => e.meal.id !== meal.id)
  deduped.push({ userId, meal, saveType, existingMealId, enqueuedAt: Date.now() })
  writeQueue(deduped)
}

/** Remove one entry after a successful sync (identified by meal.id). */
export function dequeueMeal(mealId: string): void {
  writeQueue(readQueue().filter((e) => e.meal.id !== mealId))
}

/** Total number of meals waiting to be synced. */
export function getQueueCount(): number {
  return readQueue().length
}

/**
 * Meals in the queue for a given dateKey.
 * Used to merge pending offline meals into the today list after an app restart
 * (before the optimistic buffer has been restored).
 */
export function getQueuedMealsForDate(dateKey: string): Meal[] {
  return readQueue()
    .filter((e) => e.meal.dateKey === dateKey)
    .map((e) => e.meal)
}

/** All pending entries for a specific user (for drain iteration). */
export function getQueueEntries(userId: string): OfflineQueueEntry[] {
  return readQueue().filter((e) => e.userId === userId)
}

/** Drop the entire queue — call on sign-out to prevent cross-account leakage. */
export function clearOfflineQueue(): void {
  localStorage.removeItem(QUEUE_KEY)
}
