import type { Meal } from '../types/meal'

// ─── Optimistic meal buffer ──────────────────────────────────────────────────
// Meals that have been shown in the UI immediately (single-tap save) but whose
// network persistence is still in flight — or has just failed. Keyed by the
// optimistic meal id. `useTodayMeals` merges these on top of fetched meals so a
// saved meal appears instantly, before any Firestore round-trip completes.

const optimisticBuffer = new Map<string, Meal>()

function emitMealsUpdated(): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent('makrofy:meals-updated'))
}

export type ToastDetail = {
  type: 'error' | 'success' | 'info'
  message: string
}

function emitToast(detail: ToastDetail): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent('makrofy:toast', { detail }))
}

/** Show a meal in the UI immediately, before the network write completes. */
export function pushOptimisticMeal(meal: Meal): void {
  optimisticBuffer.set(meal.id, meal)
  emitMealsUpdated()
}

/**
 * The background write succeeded — drop the optimistic copy so the freshly
 * fetched (real) document takes over. Emits after removal so the reconciling
 * refresh never shows the optimistic and the real meal at the same time.
 */
export function resolveOptimisticMeal(id: string): void {
  if (optimisticBuffer.delete(id)) emitMealsUpdated()
}

/** The background write failed — drop the optimistic copy and surface a toast. */
export function failOptimisticMeal(id: string, message: string): void {
  if (optimisticBuffer.delete(id)) emitMealsUpdated()
  emitToast({ type: 'error', message })
}

/**
 * The save failed because the device is offline — keep the meal visible in the
 * UI (do NOT remove from buffer) and show an informational toast instead of an
 * error. The offline queue will retry when connectivity returns, at which point
 * `resolveOptimisticMeal` will be called normally.
 */
export function queueOptimisticMeal(id: string): void {
  // Intentionally do NOT delete from buffer — meal must stay visible.
  // We still emit so any macros / list counts stay consistent.
  if (optimisticBuffer.has(id)) emitMealsUpdated()
  emitToast({ type: 'info', message: 'No internet. Meal saved locally and will sync when back online.' })
}

/**
 * Drop every buffered optimistic meal. Called on sign-out so an in-flight (or
 * just-failed) save from one account can never bleed into the next account's
 * session. The buffer is keyed by meal id and shared module-wide, so without
 * this a leftover entry would surface for whoever logs in next.
 */
export function clearOptimisticMeals(): void {
  if (optimisticBuffer.size === 0) return
  optimisticBuffer.clear()
  emitMealsUpdated()
}

/** Optimistic meals for a given date (insertion order = oldest first). */
export function getOptimisticMeals(dateKey: string): Meal[] {
  const out: Meal[] = []
  for (const meal of optimisticBuffer.values()) {
    if (meal.dateKey === dateKey) out.push(meal)
  }
  return out
}
