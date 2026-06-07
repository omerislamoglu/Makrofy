import type { CustomFoodInput, FoodCatalogCategory, FoodCatalogItem, FoodServingOption } from '../types/food'
import { createServing } from './foodCalculation'
import { createId } from './id'

const FAVORITES_KEY = 'makrofy_food_favorites'
const RECENTS_KEY = 'makrofy_recent_foods'
const CUSTOM_FOODS_KEY = 'makrofy_custom_foods'

// ─── Common misspellings → correct form (normalized, no diacritics) ────────
const COMMON_MISSPELLINGS: Record<string, string> = {
  // Turkish food typos
  yuurta: 'yumurta', yumuta: 'yumurta', yumruta: 'yumurta', yuurmta: 'yumurta', yumurt: 'yumurta', yumrota: 'yumurta',
  ekmk: 'ekmek', ekemk: 'ekmek', ekmke: 'ekmek', ekmekk: 'ekmek',
  peyir: 'peynir', peynr: 'peynir', peynri: 'peynir', peyinr: 'peynir',
  tavk: 'tavuk', tvuk: 'tavuk', tavuuk: 'tavuk', tauvk: 'tavuk', tavku: 'tavuk',
  makrna: 'makarna', maakrna: 'makarna', makrana: 'makarna', makarrna: 'makarna',
  plav: 'pilav', pilavv: 'pilav', pialv: 'pilav', piilav: 'pilav',
  yourt: 'yogurt', yogrt: 'yogurt', yogutr: 'yogurt', yoourt: 'yogurt',
  cikoata: 'cikolata', cioklata: 'cikolata', cikoalat: 'cikolata', ciklata: 'cikolata',
  somn: 'somon', smoon: 'somon', somoon: 'somon',
  baklva: 'baklava', baklavaa: 'baklava', baklav: 'baklava',
  donr: 'doner', donerr: 'doner', donre: 'doner', dooner: 'doner',
  hambrger: 'hamburger', hambuger: 'hamburger', hamburgr: 'hamburger', haamburger: 'hamburger',
  lahmcun: 'lahmacun', lahmajun: 'lahmacun', lahamcun: 'lahmacun',
  kofte: 'kofte', koft: 'kofte', koftee: 'kofte',
  ispnak: 'ispanak', ispanakk: 'ispanak',
  manti: 'manti', mantii: 'manti',
  borek: 'borek', borekk: 'borek', bork: 'borek',
  corba: 'corba', corb: 'corba', coorba: 'corba',
  patats: 'patates', pataes: 'patates', patattes: 'patates',
  simit: 'simit', simitt: 'simit', simt: 'simit',
  pogca: 'pogaca', pogacaa: 'pogaca',
  sucuk: 'sucuk', scuk: 'sucuk', sucukk: 'sucuk',
  pastirma: 'pastirma', pastrma: 'pastirma',
  kunfe: 'kunefe', kunefee: 'kunefe', kuenfe: 'kunefe',
  sutlc: 'sutlac', sutlacv: 'sutlac', sutlacc: 'sutlac',
  menenm: 'menemen', menemn: 'menemen',
  // English food typos
  chiken: 'chicken', chcken: 'chicken', chicke: 'chicken', chikcen: 'chicken',
  salomon: 'salmon', salmn: 'salmon', samon: 'salmon',
  brocoli: 'broccoli', brocolli: 'broccoli', broccolli: 'broccoli',
  avacado: 'avocado', avocdo: 'avocado', avacodo: 'avocado',
  banan: 'banana', bananna: 'banana', bannana: 'banana',
  tomatoe: 'tomato', tomto: 'tomato', tomatoo: 'tomato',
  cucmber: 'cucumber', cucumbr: 'cucumber',
  sandwch: 'sandwich', sandwhich: 'sandwich', sanwich: 'sandwich',
  omlette: 'omlet', omeltte: 'omlet',
  piza: 'pizza', pizzaa: 'pizza', pzza: 'pizza',
  burgr: 'burger', buger: 'burger', brger: 'burger',
  cofee: 'coffee', coffie: 'coffee', coffe: 'coffee',
  chocolte: 'chocolate', choclate: 'chocolate', chocolat: 'chocolate',
  yougurt: 'yogurt', youghurt: 'yogurt', yoghrt: 'yogurt',
  protien: 'protein', protin: 'protein', protine: 'protein',
  straberry: 'strawberry', stawberry: 'strawberry',
  bluberry: 'blueberry', bluebarry: 'blueberry',
}

function correctMisspelling(text: string): string {
  // Try full text first
  if (COMMON_MISSPELLINGS[text]) return COMMON_MISSPELLINGS[text]
  // Try each word
  const words = text.split(' ')
  let changed = false
  const corrected = words.map(w => {
    if (COMMON_MISSPELLINGS[w]) { changed = true; return COMMON_MISSPELLINGS[w] }
    return w
  })
  return changed ? corrected.join(' ') : text
}

const SYNONYMS: Record<string, string[]> = {
  // ── Protein — bilingual ──
  tavuk: ['chicken', 'kanat', 'but', 'gogus', 'piliç', 'pilic'],
  chicken: ['tavuk', 'poultry', 'pilic'],
  yumurta: ['egg', 'haslama', 'sahanda', 'omlet'],
  egg: ['yumurta', 'eggs'],
  eggs: ['egg', 'yumurta'],
  balik: ['fish', 'somon', 'levrek', 'hamsi', 'cipura'],
  fish: ['balik', 'seafood'],
  salmon: ['somon'],
  somon: ['salmon'],
  tuna: ['ton baligi', 'ton'],
  shrimp: ['karides'],
  karides: ['shrimp', 'prawn'],
  steak: ['biftek', 'antrikot', 'bonfile'],
  turkey: ['hindi'],
  hindi: ['turkey'],
  beef: ['dana', 'et', 'sigir'],
  dana: ['beef', 'sigir', 'et'],
  kuzu: ['lamb', 'mutton'],
  lamb: ['kuzu'],
  pork: ['domuz'],
  tofu: ['tofu', 'soy'],
  et: ['meat', 'dana', 'sigir', 'kuzu'],
  meat: ['et', 'beef', 'dana'],
  // ── Carbs ──
  pirinc: ['rice', 'pilav'],
  rice: ['pirinc', 'pilav'],
  pilav: ['pirinc', 'rice'],
  bulgur: ['bulgur pilav', 'bulgur pilavi'],
  ekmek: ['beyaz ekmek', 'tam bugday ekmek', 'bread', 'dilim'],
  bread: ['white bread', 'whole wheat bread', 'ekmek', 'toast', 'loaf'],
  pasta: ['makarna', 'spaghetti', 'noodle'],
  makarna: ['pasta', 'spaghetti', 'noodle'],
  noodle: ['makarna', 'noodles', 'eriste'],
  oatmeal: ['yulaf', 'porridge', 'oats'],
  yulaf: ['oatmeal', 'oats'],
  quinoa: ['kinoa'],
  kinoa: ['quinoa'],
  potato: ['patates'],
  patates: ['potato'],
  simit: ['simit', 'gevrek', 'turkish bagel'],
  // ── Fruits ──
  muz: ['banana'],
  banana: ['muz'],
  apple: ['elma'],
  elma: ['apple'],
  orange: ['portakal'],
  portakal: ['orange'],
  strawberry: ['cilek', 'strawberries'],
  cilek: ['strawberry'],
  blueberry: ['yaban mersini', 'blueberries'],
  pear: ['armut'],
  armut: ['pear'],
  peach: ['seftali'],
  seftali: ['peach'],
  cherry: ['kiraz', 'visne'],
  kiraz: ['cherry'],
  visne: ['sour cherry', 'cherry'],
  grape: ['uzum', 'grapes'],
  uzum: ['grape'],
  watermelon: ['karpuz'],
  karpuz: ['watermelon'],
  kavun: ['melon', 'cantaloupe'],
  melon: ['kavun'],
  apricot: ['kayisi'],
  kayisi: ['apricot'],
  fig: ['incir'],
  incir: ['fig'],
  pomegranate: ['nar'],
  nar: ['pomegranate'],
  lemon: ['limon'],
  limon: ['lemon'],
  mango: ['mango'],
  ananas: ['pineapple'],
  pineapple: ['ananas'],
  avokado: ['avocado'],
  avocado: ['avokado'],
  kivi: ['kiwi'],
  kiwi: ['kivi'],
  // ── Vegetables ──
  sebze: ['vegetable', 'vegetables', 'veggie'],
  vegetable: ['sebze'],
  domates: ['tomato'],
  tomato: ['domates'],
  salatalik: ['cucumber'],
  cucumber: ['salatalik'],
  havuc: ['carrot'],
  carrot: ['havuc'],
  brokoli: ['broccoli'],
  broccoli: ['brokoli'],
  ispanak: ['spinach'],
  spinach: ['ispanak'],
  biber: ['pepper', 'capsicum'],
  pepper: ['biber'],
  sogan: ['onion'],
  onion: ['sogan'],
  mantar: ['mushroom'],
  mushroom: ['mantar'],
  patlican: ['eggplant', 'aubergine'],
  eggplant: ['patlican'],
  kabak: ['zucchini', 'squash'],
  zucchini: ['kabak'],
  marul: ['lettuce'],
  lettuce: ['marul'],
  // ── Dairy ──
  yogurt: ['yogurt', 'suzme', 'kefir', 'greek yogurt'],
  'greek yogurt': ['yogurt', 'suzme yogurt'],
  cheese: ['peynir', 'cheddar', 'mozzarella'],
  peynir: ['cheese', 'beyaz peynir', 'kasar'],
  kasar: ['cheddar', 'cheese', 'kasar peynir'],
  milk: ['sut'],
  sut: ['milk'],
  butter: ['tereyagi'],
  tereyagi: ['butter'],
  kaymak: ['cream', 'clotted cream'],
  cream: ['kaymak', 'krema'],
  // ── Drinks ──
  ayran: ['yogurt drink', 'ayran', 'sutlu icecek'],
  kahve: ['coffee', 'latte', 'espresso', 'americano'],
  coffee: ['kahve', 'latte', 'espresso', 'americano'],
  latte: ['coffee', 'kahve'],
  kola: ['cola', 'coke'],
  cola: ['kola', 'coke'],
  coke: ['cola', 'kola'],
  juice: ['meyve suyu', 'su'],
  smoothie: ['smoothie'],
  cay: ['tea', 'cay'],
  tea: ['cay'],
  su: ['water'],
  water: ['su'],
  bira: ['beer'],
  beer: ['bira'],
  sarap: ['wine'],
  wine: ['sarap'],
  // ── Nuts ──
  badem: ['almond'],
  almond: ['badem', 'almonds'],
  ceviz: ['walnut'],
  walnut: ['ceviz', 'walnuts'],
  findik: ['hazelnut'],
  hazelnut: ['findik'],
  'peanut butter': ['fistik ezmesi'],
  'fistik ezmesi': ['peanut butter'],
  fistik: ['peanut', 'yer fistigi'],
  peanut: ['fistik', 'yer fistigi'],
  kaju: ['cashew'],
  cashew: ['kaju'],
  // ── Sweets ──
  cikolata: ['chocolate', 'cacao'],
  chocolate: ['cikolata'],
  cips: ['chips'],
  chips: ['cips', 'crisps'],
  dondurma: ['ice cream', 'gelato'],
  'ice cream': ['dondurma'],
  kek: ['cake'],
  cake: ['kek', 'pasta'],
  kurabiye: ['cookie', 'biscuit'],
  cookie: ['kurabiye', 'biskuvi'],
  // ── Turkish dishes ──
  doner: ['doner kebab', 'kebab', 'tavuk doner', 'et doner'],
  kebab: ['doner', 'kebap', 'sis', 'adana'],
  kebap: ['kebab', 'doner', 'sis', 'adana'],
  corba: ['soup', 'corbasi', 'mercimek', 'yayla'],
  soup: ['corba'],
  lahmacun: ['lahmacun', 'turkish pizza'],
  pide: ['pide', 'turkish flatbread'],
  gozleme: ['gozleme', 'turkish crepe'],
  borek: ['borek', 'pastry'],
  manti: ['manti', 'turkish dumpling', 'ravioli'],
  dolma: ['dolma', 'sarma', 'stuffed'],
  sarma: ['dolma', 'wrap', 'roll'],
  baklava: ['baklava'],
  kunefe: ['kunefe', 'kanafeh'],
  sutlac: ['rice pudding', 'sutlac'],
  'rice pudding': ['sutlac'],
  lokma: ['lokma', 'fried dough'],
  // ── Fast food ──
  bigmac: ['big mac', 'hamburger'],
  'big mac': ['bigmac', 'hamburger', 'mcdonalds'],
  whopper: ['burger', 'hamburger', 'burger king'],
  burger: ['hamburger', 'cheeseburger'],
  hamburger: ['burger', 'cheeseburger'],
  pizza: ['pizza'],
  burrito: ['burrito'],
  taco: ['taco'],
  sushi: ['sushi', 'nigiri', 'roll'],
  nugget: ['nuggets', 'chicken nugget'],
  nuggets: ['nugget', 'chicken nuggets'],
  // ── Meals ──
  salad: ['salata'],
  salata: ['salad', 'coban salata'],
  sandwich: ['sandvic', 'tost'],
  sandvic: ['sandwich', 'tost'],
  tost: ['toast', 'sandwich', 'sandvic'],
  wrap: ['durum', 'wrap'],
  durum: ['wrap', 'durum'],
  bowl: ['bowl', 'kase'],
  // ── Cooking methods (cross-reference) ──
  izgara: ['grilled', 'grill'],
  grilled: ['izgara'],
  haslama: ['boiled'],
  boiled: ['haslama'],
  kizartma: ['fried'],
  fried: ['kizartma', 'tava'],
  tava: ['pan fried', 'fried', 'kizartma'],
  firin: ['baked', 'oven', 'firinda'],
  baked: ['firin', 'firinda'],
  buharda: ['steamed'],
  steamed: ['buharda'],
  // ── Supplements ──
  whey: ['whey protein', 'protein shake'],
  'protein shake': ['whey', 'protein'],
  'protein bar': ['protein bar'],
  protein: ['protein', 'whey'],
  // ── Brand shortcuts ──
  mc: ['mcdonalds', 'big mac', 'mcchicken'],
  mcdonalds: ['big mac', 'mcchicken', 'mc'],
  bk: ['burger king', 'whopper'],
  'burger king': ['whopper', 'bk'],
  sbux: ['starbucks', 'latte', 'frappuccino'],
  starbucks: ['sbux', 'latte', 'frappuccino'],
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
  if (Math.abs(a.length - b.length) > 3) return 99
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
  // Try misspelling correction first
  const correctedQuery = correctMisspelling(query)
  const expandedTerms = [query, ...(SYNONYMS[query] ?? [])]
  // Also expand corrected form if different
  if (correctedQuery !== query) {
    expandedTerms.push(correctedQuery, ...(SYNONYMS[correctedQuery] ?? []))
  }
  const haystack = food.searchableText
  const name = normalizeFoodText(food.name)
  const brand = normalizeFoodText(food.brand ?? '')
  const aliases = food.aliases.map(normalizeFoodText)
  const compact = (value: string) => value.replace(/\s+/g, '')
  const compactQuery = compact(query)
  const compactName = compact(name)
  const compactBrand = compact(brand)
  const compactAliases = aliases.map(compact)
  let score = 0

  for (const term of expandedTerms) {
    const compactTerm = compact(term)
    if (name === term) score = Math.max(score, 100)
    if (brand === term) score = Math.max(score, 98)
    if (aliases.some((alias) => alias === term)) score = Math.max(score, 96)
    if (compactBrand === compactTerm || compactBrand === compactQuery) score = Math.max(score, 98)
    if (compactName === compactTerm || compactName.startsWith(compactTerm)) score = Math.max(score, 92)
    if (compactAliases.some((alias) => alias === compactTerm)) score = Math.max(score, 96)
    if (aliases.some((alias) => alias.startsWith(`${term} `) || alias.endsWith(` ${term}`))) score = Math.max(score, 88)
    if (name.startsWith(term)) score = Math.max(score, 85)
    if (haystack.includes(term)) score = Math.max(score, 70)
  }

  const queryTokens = query.split(' ').filter(Boolean)
  const hayTokens = haystack.split(' ').filter(Boolean)
  const tokenHits = queryTokens.filter((token) =>
    hayTokens.some((hayToken) => hayToken.includes(token) || editDistance(token, hayToken) <= (token.length > 5 ? 3 : 2))
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

  // If no match, try misspelling correction as separate query
  if (bestScore < threshold) {
    const corrected = correctMisspelling(normalized)
    if (corrected !== normalized) {
      for (const food of catalog) {
        const score = scoreFood(food, corrected)
        if (score > bestScore) {
          bestScore = score
          best = food
        }
      }
    }
  }

  return bestScore >= threshold ? best : null
}
