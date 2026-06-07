// ─── Macro & Micro Nutrients ────────────────────────────────────────────────
export interface MacroNutrients {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
}

export interface MicroNutrients {
  fiber?: number
  sugar?: number
  sodium?: number
  cholesterol?: number
  saturatedFat?: number
  transFat?: number
  iron?: number
  calcium?: number
  vitaminA?: number
  vitaminC?: number
}

export interface FullNutrition {
  macros: MacroNutrients
  micros?: MicroNutrients
}

// ─── Per-serving / per-100g models ──────────────────────────────────────────
export type ServingUnit = 'g' | 'ml' | 'oz' | 'cup' | 'tbsp' | 'tsp' | 'piece' | 'slice'

export interface NutritionPer100g {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber?: number
  sugar?: number
}

export interface ServingInfo {
  size: number
  unit: ServingUnit
  label?: string // e.g. "1 medium banana"
}

// ─── Utility functions ──────────────────────────────────────────────────────

/** Safely parse a potentially NaN/undefined/negative number to a non-negative finite value. */
function safeNum(n: number | undefined | null, fallback = 0): number {
  if (n == null || !Number.isFinite(n) || isNaN(n)) return fallback
  return Math.max(0, n)
}

export function calculateMacrosForWeight(
  per100g: NutritionPer100g,
  grams: number
): MacroNutrients {
  const safeGrams = safeNum(grams)
  const ratio = safeGrams / 100
  return {
    calories: Math.round(safeNum(per100g.calories) * ratio),
    protein: Math.round(safeNum(per100g.protein) * ratio),
    carbs: Math.round(safeNum(per100g.carbs) * ratio),
    fat: Math.round(safeNum(per100g.fat) * ratio),
    fiber: Math.round(safeNum(per100g.fiber) * ratio),
  }
}

export function sumMacros(items: MacroNutrients[]): MacroNutrients {
  return items.reduce(
    (acc, m) => ({
      calories: acc.calories + (m?.calories || 0),
      protein: acc.protein + (m?.protein || 0),
      carbs: acc.carbs + (m?.carbs || 0),
      fat: acc.fat + (m?.fat || 0),
      fiber: acc.fiber + (m?.fiber || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  )
}

export function scaleMacros(macros: MacroNutrients, factor: number): MacroNutrients {
  return {
    calories: Math.round(macros.calories * factor),
    protein: Math.round(macros.protein * factor),
    carbs: Math.round(macros.carbs * factor),
    fat: Math.round(macros.fat * factor),
    fiber: Math.round(macros.fiber * factor),
  }
}

export const EMPTY_MACROS: MacroNutrients = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  fiber: 0,
}
