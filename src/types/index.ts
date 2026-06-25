export type {
  User,
  UserProfile,
  DailyGoal,
  UnitSystem,
  AuthCredentials,
  AuthProvider,
  AuthState,
  FirestoreTimestamp,
} from './user'

export type {
  MacroNutrients,
  MicroNutrients,
  FullNutrition,
  ServingUnit,
  NutritionPer100g,
  ServingInfo,
} from './nutrition'
export {
  calculateMacrosForWeight,
  sumMacros,
  scaleMacros,
  EMPTY_MACROS,
} from './nutrition'

export type {
  Meal,
  MealType,
  MealSource,
  ConfidenceLevel,
  FoodItem,
  MealFormData,
  FoodItemFormData,
  DailySummary,
  CustomFood,
  FoodCategory,
} from './meal'
export {
  confidenceToNumeric,
  numericToConfidence,
} from './meal'

export type {
  AIScanResult,
  AIScanFoodItem,
  AlternativeFoodSuggestion,
  PortionRange,
  ScanSession,
  ScanStatus,
  ScanError,
  ScanErrorCode,
  ScanRequest,
  ScanResponse,
} from './scan'

export type {
  Subscription,
  SubscriptionPlan,
  SubscriptionStatus,
  SubscriptionPlatform,
  ScanLimit,
  PaywallConfig,
  PaywallFeature,
} from './subscription'
export {
  FREE_DAILY_SCAN_LIMIT,
} from './subscription'
