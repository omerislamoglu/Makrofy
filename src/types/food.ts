import type { MacroNutrients } from './nutrition'

export type FoodUnitType = 'gram' | 'adet' | 'porsiyon' | 'ml' | 'paket' | 'dilim' | 'bar' | 'kutu' | 'sise'

export type FoodCatalogCategory =
  | 'Kahvaltı'
  | 'Ana Yemek'
  | 'Ev Yemekleri'
  | 'Fast Food'
  | 'Dünya Mutfağı'
  | 'Sushi & Asya Mutfağı'
  | 'Et & Tavuk'
  | 'Balık & Deniz Ürünleri'
  | 'Pilav & Makarna'
  | 'Meyve'
  | 'Sebze'
  | 'Süt Ürünleri'
  | 'Atıştırmalık'
  | 'Tatlı & Çikolata'
  | 'Cips & Paketli Gıda'
  | 'İçecek'
  | 'Kahve'
  | 'Sporcu Besinleri'
  | 'Kuruyemiş'
  | 'Bakliyat'
  | 'Ekmek & Unlu Mamuller'
  | 'Soslar'

export interface FoodServingOption {
  id: string
  label: string
  unitType: FoodUnitType
  quantity: number
  gramEquivalent?: number
  mlEquivalent?: number
}

export interface FoodCatalogItem {
  id: string
  name: string
  brand?: string
  category: FoodCatalogCategory
  subcategory: string
  servingOptions: FoodServingOption[]
  defaultServing: FoodServingOption
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  sugar?: number
  saturatedFat?: number
  sodium?: number
  unitTypes: FoodUnitType[]
  aliases: string[]
  searchableText: string
  isCustom: boolean
  createdAt?: string
  updatedAt?: string
}

export interface FoodQuantitySelection {
  serving: FoodServingOption
  quantity: number
}

export interface CalculatedFoodSelection {
  foodId: string
  foodName: string
  selectedServingName: string
  selectedQuantity: number
  gramEquivalent?: number
  mlEquivalent?: number
  macros: MacroNutrients
}

export interface CustomFoodInput {
  name: string
  brand?: string
  category: FoodCatalogCategory
  subcategory?: string
  defaultAmount: number
  defaultUnitType: FoodUnitType
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  sugar?: number
  saturatedFat?: number
  sodium?: number
  note?: string
}
