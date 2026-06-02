import type { CustomFoodInput, FoodCatalogCategory, FoodCatalogItem, FoodServingOption } from '../types/food'
import { createServing } from './foodCalculation'
import { createId } from './id'

const FAVORITES_KEY = 'makrofy_food_favorites'
const RECENTS_KEY = 'makrofy_recent_foods'
const CUSTOM_FOODS_KEY = 'makrofy_custom_foods'

const SYNONYMS: Record<string, string[]> = {
  // Protein — bilingual
  tavuk: ['chicken', 'kanat', 'but', 'gogus'],
  chicken: ['tavuk', 'poultry'],
  yumurta: ['egg', 'haslama', 'sahanda', 'omlet'],
  egg: ['yumurta', 'eggs'],
  eggs: ['egg', 'yumurta'],
  balik: ['fish', 'somon', 'levrek'],
  fish: ['balik', 'seafood'],
  salmon: ['somon'],
  somon: ['salmon'],
  tuna: ['ton baligi', 'ton'],
  shrimp: ['karides'],
  steak: ['biftek', 'antrikot', 'bonfile'],
  turkey: ['hindi'],
  beef: ['dana', 'et', 'sigir'],
  pork: ['domuz'],
  tofu: ['tofu', 'soy'],
  // Carbs
  pirinc: ['rice', 'pilav'],
  rice: ['pirinc', 'pilav'],
  pilav: ['pirinc', 'rice'],
  bulgur: ['bulgur pilav', 'bulgur pilavi'],
  ekmek: ['bread', 'dilim'],
  bread: ['ekmek', 'toast', 'loaf'],
  pasta: ['makarna', 'spaghetti', 'noodle'],
  makarna: ['pasta', 'spaghetti'],
  oatmeal: ['yulaf', 'porridge', 'oats'],
  yulaf: ['oatmeal', 'oats'],
  quinoa: ['kinoa'],
  potato: ['patates'],
  patates: ['potato'],
  // Fruits
  muz: ['banana'],
  banana: ['muz'],
  apple: ['elma'],
  elma: ['apple'],
  orange: ['portakal'],
  portakal: ['orange'],
  strawberry: ['cilek', 'strawberries'],
  blueberry: ['yaban mersini', 'blueberries'],
  // Dairy
  yogurt: ['yoğurt', 'suzme', 'kefir', 'greek yogurt'],
  'greek yogurt': ['yogurt', 'suzme yogurt'],
  cheese: ['peynir', 'cheddar', 'mozzarella'],
  peynir: ['cheese'],
  milk: ['sut'],
  sut: ['milk'],
  butter: ['tereyagi'],
  // Drinks
  ayran: ['yogurt drink', 'ayran', 'sutlu icecek'],
  kahve: ['coffee', 'latte', 'espresso', 'americano'],
  coffee: ['kahve', 'latte', 'espresso', 'americano'],
  latte: ['coffee', 'kahve'],
  kola: ['cola', 'coke'],
  cola: ['kola', 'coke'],
  coke: ['cola', 'kola'],
  juice: ['meyve suyu'],
  smoothie: ['smoothie'],
  // Nuts
  badem: ['almond'],
  almond: ['badem', 'almonds'],
  ceviz: ['walnut'],
  walnut: ['ceviz', 'walnuts'],
  findik: ['hazelnut'],
  hazelnut: ['findik'],
  'peanut butter': ['fistik ezmesi'],
  // Sweets
  cikolata: ['chocolate'],
  chocolate: ['cikolata'],
  cips: ['chips'],
  chips: ['cips', 'crisps'],
  // Turkish dishes
  doner: ['doner kebab', 'kebab', 'tavuk doner', 'et doner'],
  kebab: ['doner', 'kebap', 'sis', 'adana'],
  kebap: ['kebab', 'doner', 'sis', 'adana'],
  corba: ['soup', 'corbasi', 'mercimek', 'yayla'],
  soup: ['corba'],
  // Fast food
  bigmac: ['big mac', 'hamburger'],
  'big mac': ['bigmac', 'hamburger', 'mcdonalds'],
  whopper: ['burger', 'hamburger', 'burger king'],
  burger: ['hamburger', 'cheeseburger'],
  pizza: ['pizza'],
  burrito: ['burrito'],
  taco: ['taco'],
  sushi: ['sushi', 'nigiri', 'roll'],
  // Meals
  salad: ['salata'],
  salata: ['salad'],
  sandwich: ['sandvic', 'tost'],
  wrap: ['dürüm', 'wrap'],
  bowl: ['bowl'],
  // Supplements
  whey: ['whey protein', 'protein shake'],
  'protein shake': ['whey', 'protein'],
  'protein bar': ['protein bar'],
}

export function normalizeFoodText(text: string): string {
  return text
    .replace(/İ/g, 'i')
    .toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function editDistance(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 2) return 99
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i])
  for (let j = 1; j <= b.length; j += 1) dp[0][j] = j
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      )
    }
  }
  return dp[a.length][b.length]
}

function scoreFood(food: FoodCatalogItem, query: string): number {
  if (!query) return 1
  const expandedTerms = [query, ...(SYNONYMS[query] ?? [])]
  const haystack = food.searchableText
  const name = normalizeFoodText(food.name)
  let score = 0

  for (const term of expandedTerms) {
    if (name === term) score = Math.max(score, 100)
    if (name.startsWith(term)) score = Math.max(score, 85)
    if (haystack.includes(term)) score = Math.max(score, 70)
  }

  const queryTokens = query.split(' ').filter(Boolean)
  const hayTokens = haystack.split(' ').filter(Boolean)
  const tokenHits = queryTokens.filter((token) =>
    hayTokens.some((hayToken) => hayToken.includes(token) || editDistance(token, hayToken) <= (token.length > 5 ? 2 : 1))
  ).length

  if (queryTokens.length > 0 && tokenHits === queryTokens.length) score = Math.max(score, 55 + tokenHits * 5)
  return score
}

export interface SearchBoostOptions {
  favoriteIds?: string[]
  recentIds?: string[]
  popularIds?: string[]
}

export function searchFoodCatalog(
  foods: FoodCatalogItem[],
  query: string,
  category?: FoodCatalogCategory | 'Tümü' | 'All',
  limit = 50,
  boosts?: SearchBoostOptions
): FoodCatalogItem[] {
  const normalizedQuery = normalizeFoodText(query)
  const favSet = boosts?.favoriteIds ? new Set(boosts.favoriteIds) : null
  const recSet = boosts?.recentIds ? new Set(boosts.recentIds) : null
  const popSet = boosts?.popularIds ? new Set(boosts.popularIds) : null

  return foods
    .filter((food) => !category || category === 'Tümü' || category === 'All' || food.category === category)
    .map((food) => {
      let score = scoreFood(food, normalizedQuery)
      if (score > 0 || !normalizedQuery) {
        if (favSet?.has(food.id)) score += 15
        if (recSet?.has(food.id)) score += 10
        if (popSet?.has(food.id)) score += 5
      }
      return { food, score }
    })
    .filter(({ score }) => !normalizedQuery || score > 0)
    .sort((a, b) => b.score - a.score || a.food.name.localeCompare(b.food.name))
    .slice(0, limit)
    .map(({ food }) => food)
}

function readIds(key: string): string[] {
  try {
    return JSON.parse(localStorage.getItem(key) ?? '[]') as string[]
  } catch {
    return []
  }
}

function writeIds(key: string, ids: string[]): void {
  localStorage.setItem(key, JSON.stringify(ids.slice(0, 30)))
}

export function getFavoriteFoodIds(): string[] {
  return readIds(FAVORITES_KEY)
}

export function toggleFavoriteFood(foodId: string): string[] {
  const ids = getFavoriteFoodIds()
  const next = ids.includes(foodId) ? ids.filter((id) => id !== foodId) : [foodId, ...ids]
  writeIds(FAVORITES_KEY, next)
  return next
}

export function getRecentFoodIds(): string[] {
  return readIds(RECENTS_KEY)
}

export function rememberRecentFood(foodId: string): void {
  writeIds(RECENTS_KEY, [foodId, ...getRecentFoodIds().filter((id) => id !== foodId)])
}

export function getCustomCatalogFoods(): FoodCatalogItem[] {
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_FOODS_KEY) ?? '[]') as FoodCatalogItem[]
  } catch {
    return []
  }
}

export function saveCustomCatalogFood(input: CustomFoodInput): FoodCatalogItem {
  const now = new Date().toISOString()
  const amount = input.defaultAmount > 0 ? input.defaultAmount : 100
  const serving = createServing(
    input.defaultUnitType === 'ml' ? `${amount} ml` : `${amount} g`,
    input.defaultUnitType,
    amount,
    'default'
  )
  const hundred = createServing(input.defaultUnitType === 'ml' ? '100 ml' : '100 g', input.defaultUnitType, 100, '100')
  const servingOptions: FoodServingOption[] = serving.id === hundred.id ? [serving] : [serving, hundred]
  const food: FoodCatalogItem = {
    id: `custom-${createId()}`,
    name: input.name,
    ...(input.brand && { brand: input.brand }),
    category: input.category,
    subcategory: input.subcategory ?? 'Özel',
    servingOptions,
    defaultServing: serving,
    calories: input.calories,
    protein: input.protein,
    carbs: input.carbs,
    fat: input.fat,
    fiber: input.fiber,
    ...(input.sugar !== undefined && { sugar: input.sugar }),
    ...(input.saturatedFat !== undefined && { saturatedFat: input.saturatedFat }),
    ...(input.sodium !== undefined && { sodium: input.sodium }),
    unitTypes: [...new Set(servingOptions.map((option) => option.unitType))],
    aliases: input.note ? [input.note] : [],
    searchableText: normalizeFoodText([input.name, input.brand, input.category, input.subcategory, input.note].filter(Boolean).join(' ')),
    isCustom: true,
    createdAt: now,
    updatedAt: now,
  }
  localStorage.setItem(CUSTOM_FOODS_KEY, JSON.stringify([food, ...getCustomCatalogFoods()]))
  return food
}

export function matchFoodToCatalog(
  foodName: string,
  catalog: FoodCatalogItem[],
  threshold = 40
): FoodCatalogItem | null {
  const normalized = normalizeFoodText(foodName)
  if (!normalized) return null

  let best: FoodCatalogItem | null = null
  let bestScore = 0

  for (const food of catalog) {
    const score = scoreFood(food, normalized)
    if (score > bestScore) {
      bestScore = score
      best = food
    }
  }

  return bestScore >= threshold ? best : null
}
