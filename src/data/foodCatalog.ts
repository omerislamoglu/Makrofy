import { TURKISH_FOODS, type FoodCategory as LegacyFoodCategory, type TurkishFood } from './turkishFoods'
import type { FoodCatalogCategory, FoodCatalogItem, FoodServingOption, FoodUnitType } from '../types/food'
import { createServing } from '../utils/foodCalculation'
import { getCustomCatalogFoods, normalizeFoodText } from '../utils/foodSearch'
import { CATALOG_FOODS } from './catalog'
import { GLOBAL_FOODS } from './globalFoods'
import { GLOBAL_MARKET_PRODUCTS } from './globalMarketProducts'
import { GLOBAL_RESTAURANT_ITEMS } from './globalRestaurantItems'
import { MASSIVE_GLOBAL_EXPANSION } from './massiveGlobalExpansion'
import type { AppLocale } from '../i18n'

const GLOBAL_CATALOG: FoodCatalogItem[] = [
  ...GLOBAL_FOODS,
  ...GLOBAL_MARKET_PRODUCTS,
  ...GLOBAL_RESTAURANT_ITEMS,
  ...MASSIVE_GLOBAL_EXPANSION,
]

export const FOOD_CATEGORIES: Array<FoodCatalogCategory | 'Tümü'> = [
  'Tümü',
  'Kahvaltı',
  'Ana Yemek',
  'Ev Yemekleri',
  'Fast Food',
  'Dünya Mutfağı',
  'Sushi & Asya Mutfağı',
  'Et & Tavuk',
  'Balık & Deniz Ürünleri',
  'Pilav & Makarna',
  'Meyve',
  'Sebze',
  'Süt Ürünleri',
  'Atıştırmalık',
  'Tatlı & Çikolata',
  'Cips & Paketli Gıda',
  'İçecek',
  'Kahve',
  'Sporcu Besinleri',
  'Kuruyemiş',
  'Bakliyat',
  'Ekmek & Unlu Mamuller',
  'Soslar',
]

/** English category labels mapped to the same internal FoodCatalogCategory values */
export const FOOD_CATEGORIES_EN: Array<{ label: string; value: FoodCatalogCategory | 'All' }> = [
  { label: 'All', value: 'All' as FoodCatalogCategory | 'All' },
  { label: 'Breakfast', value: 'Kahvaltı' },
  { label: 'Main Dish', value: 'Ana Yemek' },
  { label: 'Home Cooking', value: 'Ev Yemekleri' },
  { label: 'Fast Food', value: 'Fast Food' },
  { label: 'World Cuisine', value: 'Dünya Mutfağı' },
  { label: 'Sushi & Asian', value: 'Sushi & Asya Mutfağı' },
  { label: 'Meat & Poultry', value: 'Et & Tavuk' },
  { label: 'Fish & Seafood', value: 'Balık & Deniz Ürünleri' },
  { label: 'Rice & Pasta', value: 'Pilav & Makarna' },
  { label: 'Fruit', value: 'Meyve' },
  { label: 'Vegetables', value: 'Sebze' },
  { label: 'Dairy', value: 'Süt Ürünleri' },
  { label: 'Snacks', value: 'Atıştırmalık' },
  { label: 'Sweets & Chocolate', value: 'Tatlı & Çikolata' },
  { label: 'Chips & Packaged', value: 'Cips & Paketli Gıda' },
  { label: 'Beverages', value: 'İçecek' },
  { label: 'Coffee', value: 'Kahve' },
  { label: 'Sports Nutrition', value: 'Sporcu Besinleri' },
  { label: 'Nuts', value: 'Kuruyemiş' },
  { label: 'Legumes', value: 'Bakliyat' },
  { label: 'Bread & Bakery', value: 'Ekmek & Unlu Mamuller' },
  { label: 'Sauces', value: 'Soslar' },
]

const TURKISH_CATEGORY_MAP: Record<LegacyFoodCategory, FoodCatalogCategory> = {
  protein: 'Et & Tavuk',
  tahıl: 'Pilav & Makarna',
  meyve: 'Meyve',
  'süt-ürünü': 'Süt Ürünleri',
  sebze: 'Sebze',
  kuruyemiş: 'Kuruyemiş',
  içecek: 'İçecek',
  ekmek: 'Ekmek & Unlu Mamuller',
  çorba: 'Ev Yemekleri',
  market: 'Cips & Paketli Gıda',
  atıştırmalık: 'Atıştırmalık',
  tatlı: 'Tatlı & Çikolata',
  bakliyat: 'Bakliyat',
  şarküteri: 'Kahvaltı',
  'hazır-yemek': 'Ana Yemek',
  takviye: 'Sporcu Besinleri',
  diğer: 'Soslar',
}

const CATEGORY_OVERRIDES: Array<[RegExp, FoodCatalogCategory, string]> = [
  [/sushi|nigiri|maki|sashimi|roll|ramen|noodle|pad thai|bibimbap|kimchi|teriyaki/i, 'Sushi & Asya Mutfağı', 'Asya'],
  [/pizza|burger|hamburger|cheeseburger|nugget|hot dog|patates kızartması|fast/i, 'Fast Food', 'Fast Food'],
  [/taco|burrito|quesadilla|lazanya|risotto|alfredo|naan|tikka|butter chicken|falafel/i, 'Dünya Mutfağı', 'Dünya Mutfağı'],
  [/kahve|latte|americano|espresso|cappuccino|mocha|frappuccino|flat white/i, 'Kahve', 'Kahve'],
  [/cips|chips|kraker|bisküvi|gofret|paket|bar|çubuk|popcorn|patlamış/i, 'Cips & Paketli Gıda', 'Paketli'],
  [/çikolata|cikolata|chocolate|baklava|dondurma|donut|puding|waffle|kek|kurabiye/i, 'Tatlı & Çikolata', 'Tatlı'],
  [/tavuk|hindi|dana|kuzu|köfte|kıyma|bonfile|antrikot|pirzola|ciğer/i, 'Et & Tavuk', 'Protein'],
  [/somon|ton balığı|levrek|çipura|hamsi|karides|kalamar|midye|balık/i, 'Balık & Deniz Ürünleri', 'Deniz Ürünü'],
  [/pirinç|pilav|makarna|spagetti|bulgur|kinoa|yulaf|patates/i, 'Pilav & Makarna', 'Karbonhidrat'],
  [/protein|whey|kreatin|bcaa|eaa|shake|gainer/i, 'Sporcu Besinleri', 'Sporcu'],
]

function inferCategory(food: TurkishFood): { category: FoodCatalogCategory; subcategory: string } {
  const haystack = [food.name, food.brand, ...(food.aliases ?? [])].join(' ')
  const override = CATEGORY_OVERRIDES.find(([regex]) => regex.test(haystack))
  if (override) return { category: override[1], subcategory: override[2] }
  return { category: TURKISH_CATEGORY_MAP[food.category], subcategory: food.category }
}

function inferServingUnit(label: string, defaultUnit: TurkishFood['defaultUnit']): FoodUnitType {
  const normalized = normalizeFoodText(label)
  if (normalized.includes('ml') || normalized.includes('bardak') || normalized.includes('fincan')) return 'ml'
  if (normalized.includes('porsiyon') || normalized.includes('kase') || normalized.includes('tabak')) return 'porsiyon'
  if (normalized.includes('paket')) return 'paket'
  if (normalized.includes('dilim')) return 'dilim'
  if (normalized.includes('bar')) return 'bar'
  if (normalized.includes('kutu')) return 'kutu'
  if (normalized.includes('sise')) return 'sise'
  if (normalized.includes('adet') || defaultUnit === 'piece') return 'adet'
  return 'gram'
}

function legacyServingToCatalog(serving: { label: string; grams: number }, defaultUnit: TurkishFood['defaultUnit']): FoodServingOption {
  const unitType = inferServingUnit(serving.label, defaultUnit)
  return {
    id: normalizeFoodText(serving.label).replace(/\s+/g, '-'),
    label: serving.label,
    unitType,
    quantity: 1,
    ...(unitType === 'ml' || unitType === 'kutu' || unitType === 'sise' ? { mlEquivalent: serving.grams } : { gramEquivalent: serving.grams }),
  }
}

function defaultServings(food: TurkishFood): FoodServingOption[] {
  const servings = food.servingOptions?.map((serving) => legacyServingToCatalog(serving, food.defaultUnit)) ?? []
  if (food.pieceWeightGrams && !servings.some((serving) => serving.unitType === 'adet')) {
    servings.unshift(createServing('1 adet', 'adet', food.pieceWeightGrams, '1-adet'))
  }
  if (!servings.some((serving) => serving.label === '100 g' || serving.label === '100 ml')) {
    servings.push(createServing(food.category === 'içecek' ? '100 ml' : '100 g', food.category === 'içecek' ? 'ml' : 'gram', 100, '100'))
  }
  return servings
}

function toCatalogFood(food: TurkishFood): FoodCatalogItem {
  const { category, subcategory } = inferCategory(food)
  const servingOptions = defaultServings(food)
  const defaultServing = servingOptions[0] ?? createServing('100 g', 'gram', 100, '100')
  const aliases = [
    ...(food.aliases ?? []),
    ...(normalizeFoodText(food.name).includes('tavuk') ? ['chicken'] : []),
    ...(normalizeFoodText(food.name).includes('pirinc') || normalizeFoodText(food.name).includes('pilav') ? ['rice'] : []),
    ...(normalizeFoodText(food.name).includes('cikolata') ? ['chocolate'] : []),
    ...(normalizeFoodText(food.name).includes('cips') ? ['chips'] : []),
    ...(normalizeFoodText(food.name).includes('yumurta') ? ['egg'] : []),
    ...(normalizeFoodText(food.name).includes('muz') ? ['banana'] : []),
    ...(normalizeFoodText(food.name).includes('kahve') ? ['coffee'] : []),
  ]
  return {
    id: food.id,
    name: food.name,
    ...(food.brand && { brand: food.brand }),
    category,
    subcategory,
    servingOptions,
    defaultServing,
    calories: food.caloriesPer100g,
    protein: food.proteinPer100g,
    carbs: food.carbsPer100g,
    fat: food.fatPer100g,
    fiber: food.fiberPer100g,
    unitTypes: [...new Set(servingOptions.map((serving) => serving.unitType))],
    aliases,
    searchableText: normalizeFoodText([food.name, food.brand, category, subcategory, ...aliases].filter(Boolean).join(' ')),
    isCustom: false,
  }
}

/**
 * Get the food catalog for a given locale.
 * - 'tr': Turkish foods + catalog foods + custom foods
 * - 'en': Global foods + custom foods (no Turkish-only items)
 * - undefined: defaults to Turkish for backward compatibility
 */
export function getFoodCatalog(locale?: AppLocale): FoodCatalogItem[] {
  const custom = getCustomCatalogFoods()

  if (locale === 'en') {
    const globalFoods = GLOBAL_CATALOG
    return [...globalFoods, ...custom]
  }

  // Turkish (default)
  const legacy = TURKISH_FOODS.map(toCatalogFood)
  const catalogIds = new Set(CATALOG_FOODS.map((f) => f.id))
  const catalogNames = new Set(CATALOG_FOODS.map((f) => normalizeFoodText(f.name)))
  const dedupedLegacy = legacy.filter(
    (f) =>
      !catalogIds.has(f.id) &&
      !catalogIds.has(`cat-${f.id}`) &&
      !catalogNames.has(normalizeFoodText(f.name)),
  )
  return [...CATALOG_FOODS, ...dedupedLegacy, ...custom]
}

export const POPULAR_FOOD_IDS_TR = [
  'tavuk-gogsu-izgara',
  'cmp-tavuk-gogsu-sade-pismis',
  'cmp-pirinc-pismis-sade',
  'pirinc-pilavi',
  'haslanmis-yumurta',
  'muz',
  'cmp-kola',
  'cmp-california-roll',
  'cmp-patates-cipsi',
  'cmp-sutlu-cikolata',
  'adana-kebap',
  'lahmacun',
]

export const POPULAR_FOOD_IDS_EN = [
  'gl-grilled-chicken-breast',
  'gl-boiled-egg',
  'gl-white-rice',
  'gl-banana',
  'gl-greek-yogurt',
  'gl-oatmeal',
  'gl-salmon-fillet',
  'gl-avocado-toast',
  'gr-big-mac',
  'gm-coca-cola',
  'gl-protein-bar',
  'gr-california-roll',
]

/** @deprecated Use getFoodCatalog(locale) and POPULAR_FOOD_IDS_TR/EN instead */
export const POPULAR_FOOD_IDS = POPULAR_FOOD_IDS_TR

export function getPopularFoodIds(locale?: AppLocale): string[] {
  return locale === 'en' ? POPULAR_FOOD_IDS_EN : POPULAR_FOOD_IDS_TR
}
