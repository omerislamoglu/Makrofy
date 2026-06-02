import { MacroNutrients, scaleMacros, sumMacros, EMPTY_MACROS } from '../types/nutrition'
import type { FoodItem, Meal } from '../types/meal'
import type { DailyGoal } from '../types/user'

// ─── Types ──────────────────────────────────────────────────────────────────

/** Compact nutrition shape used across utility functions */
export interface NutritionValues {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
}

/** Result of a daily roll-up across multiple meals */
export interface DailyTotals extends NutritionValues {
  mealCount: number
}

// ─── 1. recalculateItemByGrams ──────────────────────────────────────────────

/**
 * Recalculate a food item's macros proportionally when grams change.
 *
 * How it works:
 *   ratio = newGrams / item.grams
 *   each macro = Math.round(original macro × ratio)
 *
 * Example:
 *   item = { grams: 100, macros: { calories: 200, protein: 20, carbs: 30, fat: 8 } }
 *   recalculateItemByGrams(item, 150)
 *   → { ...item, grams: 150, macros: { calories: 300, protein: 30, carbs: 45, fat: 12 } }
 *
 * Edge cases:
 *   - newGrams ≤ 0  → returns item unchanged (guards against division by zero)
 *   - item.grams = 0 → returns item unchanged (can't derive a ratio from zero)
 *   - newGrams = item.grams → returns a new object with identical values (no mutation)
 */
export function recalculateItemByGrams(item: FoodItem, newGrams: number): FoodItem {
  // Guard: invalid or unchanged grams
  if (newGrams <= 0 || item.grams <= 0) {
    return { ...item }
  }

  // Same grams — return a clean copy without rounding drift
  if (newGrams === item.grams) {
    return { ...item }
  }

  const ratio = newGrams / item.grams

  return {
    ...item,
    grams: newGrams,
    macros: scaleMacros(item.macros, ratio),
  }
}

// ─── 2. calculateMealTotals ─────────────────────────────────────────────────

/**
 * Sum calories, protein, carbs, and fat from all food items in a single meal.
 *
 * Returns a clean `MacroNutrients` object with `Math.round`-ed values
 * (rounding is handled by `sumMacros` since each item already stores integers,
 *  but we apply a final round to guard against any floating-point accumulation).
 *
 * Returns `EMPTY_MACROS` if the items array is empty.
 */
export function calculateMealTotals(items: FoodItem[]): MacroNutrients {
  if (items.length === 0) return { ...EMPTY_MACROS }

  const raw = sumMacros(items.map((i) => i.macros))

  return {
    calories: Math.round(raw.calories),
    protein: Math.round(raw.protein),
    carbs: Math.round(raw.carbs),
    fat: Math.round(raw.fat),
    fiber: Math.round(raw.fiber),
  }
}

// ─── 3. calculateDailyTotals ────────────────────────────────────────────────

/**
 * Sum all meals for a given day into a single totals object.
 *
 * Each `Meal` already carries a pre-computed `totalMacros`, so this rolls
 * them up rather than re-iterating every food item (O(meals) not O(items)).
 *
 * Returns `{ calories, protein, carbs, fat, mealCount }`.
 * Returns zeroes + mealCount 0 if the array is empty.
 */
export function calculateDailyTotals(meals: Meal[]): DailyTotals {
  if (meals.length === 0) {
    return { ...EMPTY_MACROS, mealCount: 0 }
  }

  const raw = sumMacros(meals.map((m) => m.totalMacros))

  return {
    calories: Math.round(raw.calories),
    protein: Math.round(raw.protein),
    carbs: Math.round(raw.carbs),
    fat: Math.round(raw.fat),
    fiber: Math.round(raw.fiber),
    mealCount: meals.length,
  }
}

// ─── 4. formatNutritionValue ────────────────────────────────────────────────

/**
 * Format a nutrition number for display.
 *
 * Rules:
 *   - Negative values are clamped to 0 (nutrition can't be negative).
 *   - Values ≥ 1 are rounded to the nearest integer (e.g. 124.7 → "125").
 *   - Values between 0 (exclusive) and 1 are shown as "<1" to avoid "0"
 *     for trace amounts.
 *   - Exactly 0 returns "0".
 *   - Large values (≥ 10 000) get a thousands separator for readability.
 *   - An optional `unit` suffix is appended when provided (e.g. "125g").
 *
 * This avoids messy floating-point output like "124.99999999997".
 */
export function formatNutritionValue(value: number, unit?: string): string {
  // Guard: NaN / non-finite
  if (!isFinite(value) || isNaN(value)) {
    return `0${unit ? unit : ''}`
  }

  // Clamp negatives
  const clamped = Math.max(0, value)

  let formatted: string

  if (clamped === 0) {
    formatted = '0'
  } else if (clamped < 1) {
    formatted = '<1'
  } else {
    const rounded = Math.round(clamped)
    formatted = rounded >= 10_000
      ? rounded.toLocaleString('en-US')
      : String(rounded)
  }

  return unit ? `${formatted}${unit}` : formatted
}

// ─── Existing helpers (preserved) ───────────────────────────────────────────

/**
 * Calculate progress ratios (0–1) for each macro against a daily goal.
 * Useful for progress rings and bars.
 */
export function macroProgress(
  current: MacroNutrients,
  goal: DailyGoal
): Record<'calories' | 'protein' | 'carbs' | 'fat', number> {
  return {
    calories: clampProgress(current.calories / goal.calories),
    protein: clampProgress(current.protein / goal.protein),
    carbs: clampProgress(current.carbs / goal.carbs),
    fat: clampProgress(current.fat / goal.fat),
  }
}

/**
 * How many calories remain before hitting the daily goal.
 * Never returns a negative number.
 */
export function remainingCalories(current: number, goal: number): number {
  return Math.max(0, goal - current)
}

/**
 * Quick formatting helper: value + unit (e.g. "45g", "120kcal").
 * For richer formatting with edge-case handling, use `formatNutritionValue`.
 */
export function formatMacro(value: number, unit: string = 'g'): string {
  return `${Math.round(value)}${unit}`
}

// ─── Internal ───────────────────────────────────────────────────────────────

function clampProgress(value: number): number {
  return Math.min(Math.max(value, 0), 1)
}
