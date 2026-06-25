export type AIProgramGoal =
  | 'fat_loss'
  | 'muscle_gain'
  | 'fit_look'
  | 'weight_gain'
  | 'strength'
  | 'healthy_eating'

export type AITrainingLevel = 'beginner' | 'intermediate' | 'advanced'
export type AITrainingLocation = 'home' | 'gym'
export type AIGender = 'male' | 'female' | 'other'

export interface AIProgramProfileInputs {
  goal: AIProgramGoal
  goalText?: string
  heightCm: number
  weightKg: number
  age: number
  gender: AIGender
  trainingLevel: AITrainingLevel
  trainingDaysPerWeek: number
  trainingLocation: AITrainingLocation
  injuries?: string
  nutritionPreference: string
  mealsPerDay: number
  allergiesDislikes?: string
  locale?: string
}

export interface AIProgramExercise {
  name: string
  sets: string
  reps: string
  rest: string
  notes?: string
}

export interface AIProgramWorkoutDay {
  day: string
  focus: string
  exercises: AIProgramExercise[]
  cardio?: string
}

export interface AIProgramMealOption {
  meal: string
  options: string[]
}

export interface AIProgram {
  id: string
  userId: string
  goal: AIProgramGoal
  profileInputs: AIProgramProfileInputs
  targetSummary: string
  photoAnalysisSummary?: string
  workoutPlan: {
    overview: string
    daysPerWeek: number
    weeklyPlan: AIProgramWorkoutDay[]
    warmup: string
    cooldown: string
    cardio: string
    fourWeekProgression: string[]
  }
  nutritionPlan: {
    strategy: string
    sampleDay: AIProgramMealOption[]
    alternatives: AIProgramMealOption[]
    water: string
  }
  macros: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
  progressTracking: string[]
  safetyNotes: string[]
  cycleDays?: number
  evaluationIntervalDays?: number
  nextEvaluationAt?: unknown
  nextUpdateAt?: unknown
  generationMode?: 'initial' | 'progress_evaluation'
  progressNotes?: string
  createdAt?: unknown
  updatedAt?: unknown
  isActive: boolean
}
