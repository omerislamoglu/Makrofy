import type {
  CalculatedFoodSelection,
  FoodCatalogItem,
  FoodQuantitySelection,
  FoodServingOption,
  FoodUnitType,
} from '../types/food'
import type { MacroNutrients } from '../types/nutrition'

export function roundMacro(value: number): number {
  return Math.round(value * 10) / 10
}

export function getServingBaseAmount(serving: FoodServingOption): number {
  return serving.mlEquivalent ?? serving.gramEquivalent ?? 0
}

export function createServing(
  label: string,
  unitType: FoodUnitType,
  amount: number,
  id?: string
): FoodServingOption {
  const normalizedId = id ?? label
    .replace(/İ/g, 'i')
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return {
    id: normalizedId,
    label,
    unitType,
    quantity: 1,
    ...(unitType === 'ml' || unitType === 'kutu' || unitType === 'sise'
      ? { mlEquivalent: amount }
      : { gramEquivalent: amount }),
  }
}

export function calculateFoodSelection(
  food: FoodCatalogItem,
  selection: FoodQuantitySelection
): CalculatedFoodSelection {
  const baseAmount = getServingBaseAmount(selection.serving)
  const amount = baseAmount * selection.quantity
  const factor = amount / 100
  const macros: MacroNutrients = {
    calories: Math.round(food.calories * factor),
    protein: roundMacro(food.protein * factor),
    carbs: roundMacro(food.carbs * factor),
    fat: roundMacro(food.fat * factor),
    fiber: roundMacro(food.fiber * factor),
  }

  return {
    foodId: food.id,
    foodName: food.name,
    selectedServingName: selection.serving.label,
    selectedQuantity: selection.quantity,
    ...(selection.serving.mlEquivalent !== undefined ? { mlEquivalent: Math.round(amount) } : { gramEquivalent: Math.round(amount) }),
    macros,
  }
}
