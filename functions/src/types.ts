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
  /** HTTPS or gs:// URL — used by web path */
  imageUrl?: string;
  /** Base64 data URL (data:image/jpeg;base64,...) — used by native iOS path */
  imageData?: string;
  mealTypeHint?: MealType;
  gramNotes?: string;
  dateKey?: string;
  /** User locale — 'en' or 'tr'. Defaults to 'tr' for backward compat */
  locale?: string;
  /** RevenueCat App User ID, used to verify purchases linked outside Firebase UID. */
  revenueCatAppUserId?: string;
}

export interface AnalyzeMealResponse {
  success: boolean;
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

export interface GrantScanPackRequest {
  productId: string;
  purchaseId?: string;
}

export interface GrantScanPackResponse {
  success: boolean;
  productId: string;
  creditsAdded: number;
  totalCredits: number;
}

// ─── AI Personalized Program ──────────────────────────────────────────────

export type ProgramGoal =
  | "fat_loss"
  | "muscle_gain"
  | "fit_look"
  | "weight_gain"
  | "strength"
  | "healthy_eating";

export type TrainingLevel = "beginner" | "intermediate" | "advanced";
export type TrainingLocation = "home" | "gym";
export type Gender = "male" | "female" | "other";

export interface ProgramProfileInputs {
  goal: ProgramGoal;
  goalText?: string;
  heightCm: number;
  weightKg: number;
  age: number;
  gender: Gender;
  trainingLevel: TrainingLevel;
  trainingDaysPerWeek: number;
  trainingLocation: TrainingLocation;
  injuries?: string;
  nutritionPreference: string;
  mealsPerDay: number;
  allergiesDislikes?: string;
  locale?: string;
}

export interface ProgramExercisePrescription {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  notes?: string;
}

export interface ProgramWorkoutDay {
  day: string;
  focus: string;
  exercises: ProgramExercisePrescription[];
  cardio?: string;
}

export interface ProgramMacros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface NutritionMealOption {
  meal: string;
  options: string[];
}

export interface AIPersonalProgram {
  id: string;
  userId: string;
  goal: ProgramGoal;
  profileInputs: ProgramProfileInputs;
  targetSummary: string;
  photoAnalysisSummary?: string;
  workoutPlan: {
    overview: string;
    daysPerWeek: number;
    weeklyPlan: ProgramWorkoutDay[];
    warmup: string;
    cooldown: string;
    cardio: string;
    fourWeekProgression: string[];
  };
  nutritionPlan: {
    strategy: string;
    sampleDay: NutritionMealOption[];
    alternatives: NutritionMealOption[];
    water: string;
  };
  macros: ProgramMacros;
  progressTracking: string[];
  safetyNotes: string[];
  cycleDays?: number;
  evaluationIntervalDays?: number;
  nextEvaluationAt?: Timestamp;
  nextUpdateAt?: Timestamp;
  generationMode?: ProgramGenerationMode;
  progressNotes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isActive: boolean;
}

export type ProgramGenerationMode = "initial" | "progress_evaluation";

export interface ProgramGenerationContext {
  mode: ProgramGenerationMode;
  progressNotes?: string;
  previousProgram?: {
    goal?: ProgramGoal;
    targetSummary?: string;
    photoAnalysisSummary?: string;
    workoutOverview?: string;
    cardio?: string;
    macros?: ProgramMacros;
    progressTracking?: string[];
    createdAtMs?: number;
  };
}

export interface GeneratePersonalProgramRequest {
  imageData?: string;
  profileInputs: ProgramProfileInputs;
  revenueCatAppUserId?: string;
  mode?: ProgramGenerationMode;
  progressNotes?: string;
}

export interface GeneratePersonalProgramResponse {
  success: boolean;
  programId: string;
  program: AIPersonalProgram;
}
