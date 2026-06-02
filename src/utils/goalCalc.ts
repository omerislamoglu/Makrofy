import type { BodyMetrics, DailyGoal, ActivityLevel, FitnessGoal } from '../types/user'

// ─── Activity multipliers (Mifflin-St Jeor / Harris-Benedict conventions) ───
const ACTIVITY_MULTIPLIER: Record<ActivityLevel, number> = {
  sedentary:  1.2,
  light:      1.375,
  moderate:   1.55,
  active:     1.725,
  very_active: 1.9,
}

// ─── Goal calorie adjustments ────────────────────────────────────────────────
const GOAL_ADJUSTMENT: Record<FitnessGoal, number> = {
  lose_weight:  -500,
  maintain:        0,
  gain_weight:  +300,
}

// ─── Protein targets per kg bodyweight (g/kg) ────────────────────────────────
const PROTEIN_PER_KG: Record<FitnessGoal, number> = {
  lose_weight:  2.2,   // high protein to preserve muscle on deficit
  maintain:     1.8,
  gain_weight:  2.0,
}

/**
 * Mifflin-St Jeor BMR (kcal/day)
 *   Male:   10w + 6.25h − 5a + 5
 *   Female: 10w + 6.25h − 5a − 161
 */
export function calculateBMR(
  gender: 'male' | 'female',
  weightKg: number,
  heightCm: number,
  age: number,
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age
  return Math.round(gender === 'male' ? base + 5 : base - 161)
}

/** Total Daily Energy Expenditure = BMR × activity multiplier */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return Math.round(bmr * ACTIVITY_MULTIPLIER[activityLevel])
}

/**
 * Full goal calculation from BodyMetrics.
 * Returns a DailyGoal with calories + protein + carbs + fat (all in kcal / g).
 *
 * Macro split logic:
 *  - Protein: PROTEIN_PER_KG × bodyweight (capped to max 40% of goal kcal)
 *  - Fat:     ~25-30% of goal kcal depending on goal
 *  - Carbs:   remainder
 */
export function calculateDailyGoalFromMetrics(metrics: BodyMetrics): DailyGoal {
  const { gender, age, heightCm, weightKg, activityLevel, goal } = metrics

  const bmr  = calculateBMR(gender, weightKg, heightCm, age)
  const tdee = calculateTDEE(bmr, activityLevel)
  const targetCalories = Math.max(1200, tdee + GOAL_ADJUSTMENT[goal])

  // Protein (g)
  const proteinG = Math.round(
    Math.min(
      weightKg * PROTEIN_PER_KG[goal],
      (targetCalories * 0.40) / 4,   // never exceed 40% of kcal as protein
    )
  )

  // Fat percentage: lose=28%, maintain=30%, gain=25%
  const fatPct = goal === 'lose_weight' ? 0.28 : goal === 'gain_weight' ? 0.25 : 0.30
  const fatG   = Math.round((targetCalories * fatPct) / 9)

  // Carbs from remainder
  const proteinKcal = proteinG * 4
  const fatKcal     = fatG * 9
  const carbsG      = Math.max(50, Math.round((targetCalories - proteinKcal - fatKcal) / 4))

  return {
    calories: targetCalories,
    protein:  proteinG,
    carbs:    carbsG,
    fat:      fatG,
  }
}

/**
 * BMI = weight(kg) / (height(m))²
 * Returns { value, category }
 */
export function calculateBMI(
  weightKg: number,
  heightCm: number,
): { value: number; category: 'underweight' | 'normal' | 'overweight' | 'obese' } {
  const heightM = heightCm / 100
  const bmi = weightKg / (heightM * heightM)
  const rounded = Math.round(bmi * 10) / 10

  let category: 'underweight' | 'normal' | 'overweight' | 'obese'
  if (bmi < 18.5)      category = 'underweight'
  else if (bmi < 25)   category = 'normal'
  else if (bmi < 30)   category = 'overweight'
  else                 category = 'obese'

  return { value: rounded, category }
}
