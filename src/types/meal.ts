import { MacroNutrients, NutritionPer100g, ServingUnit } from './nutrition'
import { FirestoreTimestamp } from './user'

// ─── Meal Types & Sources ───────────────────────────────────────────────────
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export type MealSource = 'ai_scan' | 'manual'

// ─── Confidence Level (AI scan accuracy) ────────────────────────────────────
export type ConfidenceLevel = 'low' | 'medium' | 'high'

export function confidenceToNumeric(level: ConfidenceLevel): number {
  const map: Record<ConfidenceLevel, number> = {
    low: 0.4,
    medium: 0.7,
    high: 0.9,
  }
  return map[level]
}

export function numericToConfidence(value: number): ConfidenceLevel {
  if (value >= 0.8) return 'high'
  if (value >= 0.6) return 'medium'
  return 'low'
}

// ─── Food Item (single item within a meal) ──────────────────────────────────
export interface FoodItem {
  id: string
  foodId?: string
  name: string
  grams: number
  ml?: number
  macros: MacroNutrients
  confidence?: ConfidenceLevel
  servingUnit?: ServingUnit
  servingLabel?: string // e.g. "1 cup cooked"
  selectedQuantity?: number
  gramEquivalent?: number
  mlEquivalent?: number
  imageRegionHint?: string // for future: bounding box or region in photo
}

// ─── Meal ───────────────────────────────────────────────────────────────────
export interface Meal {
  id: string
  userId: string
  name?: string
  items: FoodItem[]
  totalMacros: MacroNutrients
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  fiber?: number
  quantity?: number
  mealType: MealType
  source: MealSource
  imageUrl?: string
  thumbnailUrl?: string
  notes?: string
  confidence?: ConfidenceLevel
  dateKey: string // "YYYY-MM-DD" — for efficient Firestore queries
  createdAt: FirestoreTimestamp
  updatedAt: FirestoreTimestamp
}

// ─── Meal Form Data (for creating meals) ────────────────────────────────────
export interface MealFormData {
  items: FoodItemFormData[]
  mealType: MealType
  source: MealSource
  imageUrl?: string
  notes?: string
}

export interface FoodItemFormData {
  foodId?: string
  name: string
  grams: number
  ml?: number
  caloriesPer100g: number
  proteinPer100g: number
  carbsPer100g: number
  fatPer100g: number
  fiberPer100g: number
  servingLabel?: string
  selectedQuantity?: number
  gramEquivalent?: number
  mlEquivalent?: number
}

// ─── Daily Summary ──────────────────────────────────────────────────────────
export interface DailySummary {
  dateKey: string
  userId: string
  meals: Meal[]
  totalMacros: MacroNutrients
  mealCount: number
  mealTypes: MealType[]
}

// ─── Custom Food (user-saved foods for quick re-entry) ──────────────────────
export interface CustomFood {
  id: string
  userId: string
  name: string
  brand?: string
  category?: FoodCategory
  nutritionPer100g: NutritionPer100g
  defaultServingSize: number
  defaultServingUnit: ServingUnit
  barcode?: string
  isFavorite: boolean
  usageCount: number
  createdAt: FirestoreTimestamp
  updatedAt: FirestoreTimestamp
}

export type FoodCategory =
  | 'protein'
  | 'dairy'
  | 'grains'
  | 'vegetables'
  | 'fruits'
  | 'fats'
  | 'beverages'
  | 'snacks'
  | 'prepared'
  | 'other'
