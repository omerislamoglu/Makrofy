import { Timestamp } from 'firebase/firestore'

// ─── Firestore timestamp helper ─────────────────────────────────────────────
export type FirestoreTimestamp = Timestamp | string

// ─── Body Metrics ────────────────────────────────────────────────────────────
export type Gender = 'male' | 'female'
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
export type FitnessGoal = 'lose_weight' | 'maintain' | 'gain_weight'

export interface BodyMetrics {
  gender: Gender
  age: number       // years
  heightCm: number  // centimetres
  weightKg: number  // kilograms
  activityLevel: ActivityLevel
  goal: FitnessGoal
}

// ─── User ───────────────────────────────────────────────────────────────────
export interface User {
  uid: string
  email: string
  displayName: string | null
  photoURL: string | null
  createdAt: FirestoreTimestamp
  updatedAt: FirestoreTimestamp
}

export interface UserProfile extends User {
  dailyGoal: DailyGoal
  scanCount: number
  isPro: boolean
  onboardingCompleted: boolean
  goalSetupCompleted: boolean   // new: true after multi-step goal onboarding
  preferredUnits: UnitSystem
  mealReminders: boolean
  dateKey: string // "YYYY-MM-DD" of last activity — useful for daily reset logic
  bodyMetrics?: BodyMetrics
  hasExistingPlan?: boolean      // did user say they already have a diet plan?
}

export interface DailyGoal {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export type UnitSystem = 'metric' | 'imperial'

// ���── Auth ───────────────────────────────────────────────────────────────────
export interface AuthCredentials {
  email: string
  password: string
}

export type AuthProvider = 'email' | 'google' | 'apple'

export interface AuthState {
  user: UserProfile | null
  loading: boolean
  error: string | null
}
