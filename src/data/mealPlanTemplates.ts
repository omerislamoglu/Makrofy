import type { FitnessGoal } from '../types/user'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface MealPlanFood {
  name: string
  nameEn: string
  grams: number
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface MealPlanMeal {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  time: string
  foods: MealPlanFood[]
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
}

export interface DailyMealPlan {
  goal: FitnessGoal
  targetCalories: number
  meals: MealPlanMeal[]
}

// ─── Helper ──────────────────────────────────────────────────────────────────

function meal(
  type: MealPlanMeal['type'],
  time: string,
  foods: MealPlanFood[]
): MealPlanMeal {
  return {
    type,
    time,
    foods,
    totalCalories: foods.reduce((s, f) => s + f.calories, 0),
    totalProtein:  foods.reduce((s, f) => s + f.protein, 0),
    totalCarbs:    foods.reduce((s, f) => s + f.carbs, 0),
    totalFat:      foods.reduce((s, f) => s + f.fat, 0),
  }
}

function f(
  name: string,
  nameEn: string,
  grams: number,
  calories: number,
  protein: number,
  carbs: number,
  fat: number
): MealPlanFood {
  return { name, nameEn, grams, calories, protein, carbs, fat }
}

// ─── Kilo verme planı (~1600 kcal) ───────────────────────────────────────────

export const LOSE_WEIGHT_PLAN: DailyMealPlan = {
  goal: 'lose_weight',
  targetCalories: 1600,
  meals: [
    meal('breakfast', '08:00', [
      f('Yulaf Ezmesi', 'Oatmeal', 60, 216, 8, 38, 4),
      f('Süt (%1.5)', 'Low-fat milk', 150, 68, 5, 7, 2),
      f('Muz', 'Banana', 100, 89, 1, 23, 0),
    ]),
    meal('lunch', '13:00', [
      f('Izgara Tavuk Göğsü', 'Grilled chicken breast', 180, 297, 56, 0, 6),
      f('Kinoa', 'Quinoa', 150, 180, 7, 33, 3),
      f('Buharda Brokoli', 'Steamed broccoli', 120, 41, 4, 7, 0),
    ]),
    meal('snack', '16:30', [
      f('Süzme Yoğurt (%0)', 'Skyr / Greek yogurt', 170, 100, 17, 6, 1),
      f('Çilek', 'Strawberries', 80, 26, 1, 6, 0),
    ]),
    meal('dinner', '19:30', [
      f('Somon Fileto', 'Salmon fillet', 150, 280, 28, 0, 18),
      f('Fırın Tatlı Patates', 'Baked sweet potato', 120, 103, 2, 24, 0),
      f('Roka Salatası', 'Rocket salad', 50, 12, 1, 1, 0),
    ]),
  ],
}

// ─── Kilo koruma planı (~2100 kcal) ──────────────────────────────────────────

export const MAINTAIN_PLAN: DailyMealPlan = {
  goal: 'maintain',
  targetCalories: 2100,
  meals: [
    meal('breakfast', '08:00', [
      f('Tam Buğday Ekmeği', 'Whole wheat bread', 80, 196, 8, 36, 2),
      f('Haşlanmış Yumurta', 'Boiled eggs', 120, 187, 15, 1, 13),
      f('Domates + Salatalık', 'Tomato + cucumber', 120, 22, 1, 4, 0),
      f('Zeytin (10 adet)', 'Olives', 30, 52, 0, 1, 5),
    ]),
    meal('lunch', '13:00', [
      f('Bulgur Pilavı', 'Bulgur wheat', 200, 166, 6, 37, 0),
      f('Mercimek Çorbası', 'Lentil soup', 250, 150, 10, 22, 3),
      f('Tavuk Göğsü', 'Chicken breast', 130, 214, 40, 0, 5),
      f('Cacık', 'Tzatziki', 80, 48, 3, 4, 2),
    ]),
    meal('snack', '16:30', [
      f('Badem', 'Almonds', 30, 174, 6, 7, 15),
      f('Elma', 'Apple', 150, 78, 0, 21, 0),
    ]),
    meal('dinner', '19:30', [
      f('Fırın Somon', 'Baked salmon', 180, 336, 34, 0, 22),
      f('Buharda Sebze', 'Steamed vegetables', 200, 70, 4, 14, 0),
      f('Zeytinyağı (1 yemek kaşığı)', 'Olive oil (1 tbsp)', 10, 90, 0, 0, 10),
    ]),
  ],
}

// ─── Kilo alma / kas planı (~2800 kcal) ──────────────────────────────────────

export const GAIN_WEIGHT_PLAN: DailyMealPlan = {
  goal: 'gain_weight',
  targetCalories: 2800,
  meals: [
    meal('breakfast', '07:30', [
      f('Yulaf Ezmesi', 'Oatmeal', 100, 360, 13, 63, 7),
      f('Tam Süt', 'Whole milk', 250, 153, 8, 12, 9),
      f('Muz', 'Banana', 150, 133, 2, 34, 0),
      f('Fıstık Ezmesi', 'Peanut butter', 30, 188, 8, 6, 16),
    ]),
    meal('lunch', '12:30', [
      f('Pirinç Pilavı', 'White rice', 250, 325, 6, 71, 0),
      f('Izgara Et (Dana)', 'Grilled beef', 200, 430, 48, 0, 26),
      f('Yoğurt', 'Yogurt', 120, 85, 5, 9, 3),
      f('Salata', 'Side salad', 100, 30, 2, 5, 0),
    ]),
    meal('snack', '16:00', [
      f('Tam Yağlı Yoğurt', 'Full-fat yogurt', 200, 140, 10, 14, 5),
      f('Granola', 'Granola', 50, 224, 5, 37, 7),
      f('Karışık Kuruyemiş', 'Mixed nuts', 30, 185, 5, 7, 16),
    ]),
    meal('dinner', '20:00', [
      f('Makarna', 'Pasta', 200, 310, 11, 63, 1),
      f('Kıymalı Sos', 'Meat sauce', 180, 285, 20, 14, 18),
      f('Parmesan', 'Parmesan', 20, 83, 7, 1, 6),
    ]),
  ],
}

// ─── Plan seçici ─────────────────────────────────────────────────────────────

export function getPlanForGoal(goal: FitnessGoal): DailyMealPlan {
  switch (goal) {
    case 'lose_weight': return LOSE_WEIGHT_PLAN
    case 'gain_weight': return GAIN_WEIGHT_PLAN
    default:            return MAINTAIN_PLAN
  }
}

/**
 * Scale a meal plan's portions to match the user's actual target calories.
 * Keeps the food variety the same, adjusts gram amounts proportionally.
 */
export function scalePlanToCalories(
  plan: DailyMealPlan,
  targetCalories: number
): DailyMealPlan {
  const ratio = targetCalories / plan.targetCalories
  const meals = plan.meals.map((m): MealPlanMeal => {
    const foods = m.foods.map((f): MealPlanFood => ({
      ...f,
      grams:    Math.round(f.grams * ratio),
      calories: Math.round(f.calories * ratio),
      protein:  Math.round(f.protein * ratio),
      carbs:    Math.round(f.carbs * ratio),
      fat:      Math.round(f.fat * ratio),
    }))
    return {
      ...m,
      foods,
      totalCalories: foods.reduce((s, f) => s + f.calories, 0),
      totalProtein:  foods.reduce((s, f) => s + f.protein, 0),
      totalCarbs:    foods.reduce((s, f) => s + f.carbs, 0),
      totalFat:      foods.reduce((s, f) => s + f.fat, 0),
    }
  })
  return { ...plan, targetCalories, meals }
}
