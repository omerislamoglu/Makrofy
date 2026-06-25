import { FoodItem, ConfidenceLevel, MealType } from './meal'
import { MacroNutrients } from './nutrition'
import { FirestoreTimestamp } from './user'

// ─── Clarification Questions ────────────────────────────────────────────────
export interface ClarificationQuestion {
  id: string
  question: string
  options: string[]
  relatedItemId?: string // which food item this question is about
}

// ─── AI Scan Analysis ───────────────────────────────────────────────────────
export interface AIScanResult {
  mealId?: string
  mealName?: string
  items: AIScanFoodItem[]
  totalMacros: MacroNutrients
  confidence: ConfidenceLevel
  confidenceScore: number // 0.0 - 1.0
  suggestedMealType: MealType
  processingTimeMs: number
  modelVersion?: string
  clarificationQuestions?: ClarificationQuestion[]
  warnings?: string[]
  accuracyNote?: string
}

export interface AIScanFoodItem extends FoodItem {
  confidence: ConfidenceLevel
  alternatives?: AlternativeFoodSuggestion[]
  estimatedPortionRange?: PortionRange
  reasoning?: string
  cookingMethod?: string
  portionDescription?: string
  matchedCatalogId?: string
}

export interface AlternativeFoodSuggestion {
  name: string
  grams: number
  macros: MacroNutrients
  confidence: ConfidenceLevel
}

export interface PortionRange {
  min: number
  max: number
  unit: string
}

// ─── Scan Session (tracks a single scan attempt) ────────────────────────────
export interface ScanSession {
  id: string
  userId: string
  imageUrl: string
  thumbnailUrl?: string
  status: ScanStatus
  result?: AIScanResult
  error?: ScanError
  mealId?: string // linked meal after user confirms
  dateKey: string
  createdAt: FirestoreTimestamp
  completedAt?: FirestoreTimestamp
}

export type ScanStatus =
  | 'uploading'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'

export interface ScanError {
  code: ScanErrorCode
  message: string
}

export type ScanErrorCode =
  | 'upload_failed'
  | 'image_too_large'
  | 'unsupported_format'
  | 'analysis_failed'
  | 'network_error'
  | 'timeout'
  | 'rate_limited'
  | 'no_food_detected'

// ─── Scan Request (sent to Cloud Function / AI backend) ─────────────────────
export interface ScanRequest {
  imageBase64?: string
  imageUrl?: string
  userId: string
  preferredLanguage?: string
  mealTypeHint?: MealType
}

export interface ScanResponse {
  success: boolean
  result?: AIScanResult
  error?: ScanError
  requestId: string
}
