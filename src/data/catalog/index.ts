import { PROTEIN_FOODS } from './proteinFoods'
import { CARB_FOODS } from './carbFoods'
import { TURKISH_DISHES } from './turkishDishes'
import { FAST_FOOD_ITEMS } from './fastFoodItems'
import { WORLD_CUISINE } from './worldCuisine'
import { SNACK_SWEETS } from './snackSweets'
import { DRINKS } from './drinks'
import { FRUITS_VEGETABLES } from './fruitsVegetables'
import { SAUCES_EXTRAS } from './saucesExtras'
import type { FoodCatalogItem } from '../../types/food'

export const CATALOG_FOODS: FoodCatalogItem[] = [
  ...PROTEIN_FOODS,
  ...CARB_FOODS,
  ...TURKISH_DISHES,
  ...FAST_FOOD_ITEMS,
  ...WORLD_CUISINE,
  ...SNACK_SWEETS,
  ...DRINKS,
  ...FRUITS_VEGETABLES,
  ...SAUCES_EXTRAS,
]
