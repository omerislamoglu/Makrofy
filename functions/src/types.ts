import { Timestamp } from "firebase-admin/firestore";

// ─── Nutrition ──────────────────────────────────────────────────────────────

export interface MacroNutrients {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

// ─── Meal / Food ────────────────────────────────────────────────────────────

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";
export type MealSource = "ai_scan" | "manual";
export type ConfidenceLevel = "low" | "medium" | "high";

export interface FoodItem {
  id: string;
  name: string;
  grams: number;
  macros: MacroNutrients;
  confidence?: ConfidenceLevel;
}

// ─── AI Analysis ────────────────────────────────────────────────────────────

export interface ClarificationQuestion {
  id: string;
  question: string;
  options: string[];
  relatedItemId?: string;
}

export interface AnalysisItem extends FoodItem {
  confidence: ConfidenceLevel;
  reasoning?: string;
  cookingMethod?: string;
  portionDescription?: string;
  matchedCatalogId?: string;
}

export interface AIAnalysisResult {
  mealName: string;
  items: AnalysisItem[];
  totalCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  confidence: ConfidenceLevel;
  confidenceScore: number;
  suggestedMealType: MealType;
  clarificationQuestions: ClarificationQuestion[];
  warnings: string[];
  portionNotes?: string;
  accuracyNote: string;
  processingTimeMs: number;
  modelVersion: string;
}

// ─── Firestore: user document ───────────────────────────────────────────────

export interface UserDocument {
  isPro: boolean;
  scanCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── Firestore: saved meal document ─────────────────────────────────────────

export interface MealDocument {
  userId: string;
  name?: string;
  items: FoodItem[];
  totalMacros: MacroNutrients;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  quantity?: number;
  mealType: MealType;
  source: MealSource;
  imageUrl?: string;
  confidence?: ConfidenceLevel;
  dateKey: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── Request / Response ─────────────────────────────────────────────────────

export interface AnalyzeMealRequest {
  imageUrl: string;
  mealTypeHint?: MealType;
  gramNotes?: string;
  dateKey?: string;
}

export interface AnalyzeMealResponse {
  success: boolean;
  mealId: string;
  analysis: AIAnalysisResult;
}

export interface SaveAnalyzedMealRequest {
  mealId?: string;
  meal: {
    name?: string;
    items: FoodItem[];
    totalMacros: MacroNutrients;
    mealType: MealType;
    source: MealSource;
    imageUrl?: string;
    notes?: string;
    confidence?: ConfidenceLevel;
    dateKey: string;
  };
}

export interface SaveAnalyzedMealResponse {
  success: boolean;
  mealId: string;
}
