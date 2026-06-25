import type { FoodCatalogItem, FoodServingOption } from '../types/food'
import type { MacroNutrients, NutritionPer100g } from '../types/nutrition'
import type { MealType } from '../types/meal'
import { calculateMacrosForWeight, sumMacros } from '../types/nutrition'
import { matchFoodToCatalog, normalizeFoodText, searchFoodCatalog } from './foodSearch'
import { getServingBaseAmount } from './foodCalculation'
import type { AppLocale } from '../i18n'
import { getStrings } from '../i18n'

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ParsedFoodToken {
  rawText: string
  quantity: number
  quantityExplicit: boolean
  unit: string | null // raw unit text, e.g. 'gram', 'adet', 'porsiyon', 'dilim'...
  unitExplicit: boolean
  unitGramMultiplier: number | null // for kg → 1000, for gram → 1
  foodQuery: string // normalized food name for catalog lookup
  confidence: number // 0-1
}

export interface ResolvedFoodItem {
  token: ParsedFoodToken
  match: FoodCatalogItem | null
  alternativeMatches: FoodCatalogItem[]
  serving: FoodServingOption | null
  totalGrams: number
  macros: MacroNutrients
}

export interface ParseResult {
  items: ResolvedFoodItem[]
  totalMacros: MacroNutrients
  suggestedMealType: MealType | null
  unparsedText: string
  /** True when all segments failed to match and input looks like nonsense/greeting */
  hasNonsenseInput?: boolean
  /** User-facing message when nonsense is detected */
  nonsenseMessage?: string
}

// ─── Number words (Turkish + English) ───────────────────────────────────────

const TURKISH_NUMBERS: Record<string, number> = {
  yarim: 0.5,
  ceyrek: 0.25,
  bir: 1,
  iki: 2,
  uc: 3,
  dort: 4,
  bes: 5,
  alti: 6,
  yedi: 7,
  sekiz: 8,
  dokuz: 9,
  on: 10,
}

const ENGLISH_NUMBERS: Record<string, number> = {
  half: 0.5,
  quarter: 0.25,
  a: 1,
  an: 1,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
}

const NUMBER_WORDS = [...Object.keys(TURKISH_NUMBERS), ...Object.keys(ENGLISH_NUMBERS)]

const TOKEN_CORRECTIONS: Record<string, string> = {
  // Turkish foods
  yuurta: 'yumurta',
  yumrta: 'yumurta',
  yumurtda: 'yumurta',
  yumurt: 'yumurta',
  ekmke: 'ekmek',
  emek: 'ekmek',
  tavk: 'tavuk',
  tauk: 'tavuk',
  pilw: 'pilav',
  pilaw: 'pilav',
  pirnc: 'pirinc',
  pirinc: 'pirinc',
  makrna: 'makarna',
  yogrt: 'yogurt',
  yogurt: 'yogurt',
  yogurtlu: 'yogurtlu',
  peynr: 'peynir',
  peynri: 'peynir',
  kofe: 'kofte',
  kofte: 'kofte',
  corbasi: 'corba',
  corba: 'corba',
  lahmcun: 'lahmacun',
  lahmacn: 'lahmacun',
  donr: 'doner',
  durum: 'durum',
  manti: 'manti',
  borek: 'borek',
  cips: 'cips',
  cikolata: 'cikolata',
  biskvi: 'biskuvi',
  sniker: 'snickers',
  snikers: 'snickers',
  snikrs: 'snickers',
  snickerss: 'snickers',
  kitkat: 'kitkat',
  kitkattt: 'kitkat',
  oreo: 'oreo',
  dorito: 'doritos',
  doritos: 'doritos',
  layss: 'lays',
  cheetos: 'cheetos',
  citos: 'cheetos',
  pringls: 'pringles',
  // English foods
  chiken: 'chicken',
  chickn: 'chicken',
  chikn: 'chicken',
  brest: 'breast',
  rise: 'rice',
  bred: 'bread',
  breda: 'bread',
  tost: 'toast',
  omlt: 'omelet',
  omlette: 'omelet',
  yogurtt: 'yogurt',
  bananna: 'banana',
  bannana: 'banana',
  appel: 'apple',
  sandwitch: 'sandwich',
  burgerr: 'burger',
  hambuger: 'hamburger',
  protien: 'protein',
  califonia: 'california',
  californiaa: 'california',
  calfornia: 'california',
  clifornia: 'california',
  sushy: 'sushi',
  sushii: 'sushi',
  // Units
  grm: 'gram',
  garam: 'gram',
  giram: 'gram',
  adt: 'adet',
  tanee: 'tane',
  porsyn: 'porsiyon',
  porsiyonluk: 'porsiyon',
  dlim: 'dilim',
  dilmm: 'dilim',
  kasik: 'kasik',
  bardk: 'bardak',
  bardagi: 'bardagi',
  bardaği: 'bardagi',
  pakett: 'paket',
  kutuu: 'kutu',
  sise: 'sise',
  sisee: 'sise',
}

const CONTEXT_WORDS = new Set([
  'yedim', 'yemek', 'yiyorum', 'yendi', 'tukettim', 'tukettik', 'tuketildi',
  'aldim', 'alindi', 'içtim', 'ictim', 'ictik', 'yicek', 'yiyecek',
  'kahvaltida', 'oglede', 'oglende', 'aksam', 'aksama', 'ara', 'ogun',
  'for', 'ate', 'eaten', 'had', 'have', 'having', 'consumed', 'drank',
  'breakfast', 'lunch', 'dinner', 'snack', 'meal',
])

const GARBAGE_INPUTS = new Set([
  'merhaba', 'selam', 'slm', 'hello', 'hi', 'hey', 'test', 'deneme',
  'naber', 'nasilsin', 'ok', 'okay', 'tamam',
])

function correctKnownTokens(text: string): string {
  return text
    .split(/\s+/)
    .map((token) => TOKEN_CORRECTIONS[token] ?? token)
    .join(' ')
}

function isLikelyGarbageSegment(text: string): boolean {
  const normalized = normalizeFoodText(text)
  if (!normalized) return true
  if (GARBAGE_INPUTS.has(normalized)) return true
  const words = normalized.split(/\s+/).filter((word) => !CONTEXT_WORDS.has(word))
  return words.length === 0
}

function stripContextWords(text: string): string {
  return text
    .split(/\s+/)
    .filter((word) => !CONTEXT_WORDS.has(word))
    .join(' ')
}

// ─── Unit synonyms ──────────────────────────────────────────────────────────

interface UnitInfo {
  canonical: string
  gramMultiplier?: number // for weight units: gram=1, kg=1000
  isMl?: boolean
}

const UNIT_MAP: Record<string, UnitInfo> = {
  // ── Weight (universal) ──
  g: { canonical: 'gram', gramMultiplier: 1 },
  gr: { canonical: 'gram', gramMultiplier: 1 },
  gram: { canonical: 'gram', gramMultiplier: 1 },
  grams: { canonical: 'gram', gramMultiplier: 1 },
  kg: { canonical: 'gram', gramMultiplier: 1000 },
  kilo: { canonical: 'gram', gramMultiplier: 1000 },
  oz: { canonical: 'gram', gramMultiplier: 28.35 },
  ounce: { canonical: 'gram', gramMultiplier: 28.35 },
  ounces: { canonical: 'gram', gramMultiplier: 28.35 },
  lb: { canonical: 'gram', gramMultiplier: 453.6 },
  lbs: { canonical: 'gram', gramMultiplier: 453.6 },
  pound: { canonical: 'gram', gramMultiplier: 453.6 },
  pounds: { canonical: 'gram', gramMultiplier: 453.6 },

  // ── Volume ──
  ml: { canonical: 'ml', isMl: true },
  litre: { canonical: 'ml', gramMultiplier: 1000, isMl: true },
  liter: { canonical: 'ml', gramMultiplier: 1000, isMl: true },
  lt: { canonical: 'ml', gramMultiplier: 1000, isMl: true },
  // Turkish volume
  bardak: { canonical: 'ml', gramMultiplier: 200, isMl: true },
  fincan: { canonical: 'ml', gramMultiplier: 60, isMl: true },
  'su bardagi': { canonical: 'ml', gramMultiplier: 200, isMl: true },
  'cay bardagi': { canonical: 'ml', gramMultiplier: 100, isMl: true },
  // English volume
  cup: { canonical: 'ml', gramMultiplier: 240, isMl: true },
  cups: { canonical: 'ml', gramMultiplier: 240, isMl: true },
  glass: { canonical: 'ml', gramMultiplier: 250, isMl: true },
  glasses: { canonical: 'ml', gramMultiplier: 250, isMl: true },
  tbsp: { canonical: 'porsiyon', gramMultiplier: 15 },
  tablespoon: { canonical: 'porsiyon', gramMultiplier: 15 },
  tablespoons: { canonical: 'porsiyon', gramMultiplier: 15 },
  tsp: { canonical: 'porsiyon', gramMultiplier: 5 },
  teaspoon: { canonical: 'porsiyon', gramMultiplier: 5 },
  teaspoons: { canonical: 'porsiyon', gramMultiplier: 5 },

  // ── Count / piece ──
  adet: { canonical: 'adet' },
  tane: { canonical: 'adet' },
  parca: { canonical: 'adet' },
  piece: { canonical: 'adet' },
  pieces: { canonical: 'adet' },
  pc: { canonical: 'adet' },
  pcs: { canonical: 'adet' },

  // ── Serving ──
  porsiyon: { canonical: 'porsiyon' },
  kase: { canonical: 'porsiyon' },
  tabak: { canonical: 'porsiyon' },
  serving: { canonical: 'porsiyon' },
  servings: { canonical: 'porsiyon' },
  bowl: { canonical: 'porsiyon' },
  bowls: { canonical: 'porsiyon' },
  plate: { canonical: 'porsiyon' },

  // ── Specific ──
  dilim: { canonical: 'dilim' },
  slice: { canonical: 'dilim' },
  slices: { canonical: 'dilim' },
  paket: { canonical: 'paket' },
  pack: { canonical: 'paket' },
  packs: { canonical: 'paket' },
  packet: { canonical: 'paket' },
  kutu: { canonical: 'kutu' },
  can: { canonical: 'kutu' },
  cans: { canonical: 'kutu' },
  sise: { canonical: 'sise' },
  bottle: { canonical: 'sise' },
  bottles: { canonical: 'sise' },
  bar: { canonical: 'bar' },
  bars: { canonical: 'bar' },
  scoop: { canonical: 'porsiyon' },
  scoops: { canonical: 'porsiyon' },
  sandwich: { canonical: 'adet' },
  sandwiches: { canonical: 'adet' },
  burger: { canonical: 'adet' },
  burgers: { canonical: 'adet' },
  wrap: { canonical: 'adet' },
  wraps: { canonical: 'adet' },
  fillet: { canonical: 'adet' },
  // Turkish specific
  kasik: { canonical: 'porsiyon' },
  'yemek kasigi': { canonical: 'porsiyon' },
  'tatli kasigi': { canonical: 'porsiyon' },
  avuc: { canonical: 'porsiyon' },
  top: { canonical: 'adet' },
  sis: { canonical: 'adet' },
  boy: { canonical: 'porsiyon' },
}

// ─── Meal type detection ────────────────────────────────────────────────────

const MEAL_TYPE_KEYWORDS: Record<string, MealType> = {
  // Turkish
  kahvalti: 'breakfast',
  kahvaltida: 'breakfast',
  sabah: 'breakfast',
  oglen: 'lunch',
  ogle: 'lunch',
  ogleyin: 'lunch',
  aksam: 'dinner',
  aksama: 'dinner',
  yemekte: 'dinner',
  ara: 'snack',
  atistirmalik: 'snack',
  // English
  breakfast: 'breakfast',
  brunch: 'breakfast',
  morning: 'breakfast',
  lunch: 'lunch',
  midday: 'lunch',
  dinner: 'dinner',
  supper: 'dinner',
  evening: 'dinner',
  snack: 'snack',
  snacking: 'snack',
}

// ─── Turkish suffix stripping for better matching ───────────────────────────

const TURKISH_SUFFIXES = [
  // Longer suffixes first for greedy matching
  'lari', 'leri', 'larin', 'lerin',
  'lardan', 'lerden',
  'yla', 'yle',
  'dan', 'den', 'tan', 'ten',
  'nda', 'nde',
  'nin', 'nun',
  'lik', 'luk',
  'lar', 'ler',
  'ini', 'unu', 'inu',
  'la', 'le',
  'da', 'de', 'ta', 'te',
  'ya', 'ye', 'na', 'ne',
  'si', 'su',
  'in', 'un',
  'i', 'u',
]

function stemTurkish(word: string): string {
  let result = word
  // Try up to 2 passes of suffix stripping
  for (let pass = 0; pass < 2; pass++) {
    let stripped = false
    for (const suffix of TURKISH_SUFFIXES) {
      if (result.length > suffix.length + 2 && result.endsWith(suffix)) {
        result = result.slice(0, -suffix.length)
        stripped = true
        break
      }
    }
    if (!stripped) break
  }
  return result
}

// ─── Nonsense / greeting detection ─────────────────────────────────────────

const NONSENSE_WORDS = new Set([
  'merhaba', 'selam', 'nasilsin', 'nasilsiniz', 'iyi', 'gunaydin', 'iyi gunler',
  'hosgeldin', 'hosgeldiniz', 'gunaydın', 'tesekkur', 'tesekkurler', 'sagol',
  'tamam', 'evet', 'hayir', 'belki', 'naber', 'nbr', 'slm', 'mrb',
  'hello', 'hi', 'hey', 'good morning', 'good night', 'thanks', 'thank you',
  'yes', 'no', 'ok', 'okay', 'bye', 'goodbye', 'sup', 'yo', 'lol', 'haha',
  'test', 'asdf', 'qwerty', 'aaa', 'bbb', 'xxx', 'zzz', 'abc', 'deneme',
  'helo', 'hola', 'bonjour', 'ciao',
])

function isNonsenseInput(text: string): boolean {
  const normalized = normalizeFoodText(text).trim()
  if (!normalized) return true
  // Direct nonsense match
  if (NONSENSE_WORDS.has(normalized)) return true
  // All words are nonsense
  const words = normalized.split(' ').filter(w => w.length > 0)
  if (words.length <= 3 && words.every(w => NONSENSE_WORDS.has(w) || w.length <= 1)) return true
  // Only consonants or only vowels (gibberish)
  if (normalized.length >= 3 && /^[bcdfghjklmnpqrstvwxyz]+$/.test(normalized)) return true
  // Repeated single char
  if (/^(.)\1+$/.test(normalized)) return true
  return false
}

// ─── Splitter ───────────────────────────────────────────────────────────────

function splitIntoSegments(text: string): string[] {
  // Split on commas, Turkish/English conjunctions, newlines
  const normalized = text
    .replace(/\n/g, ', ')
    // Turkish
    .replace(/\bve\b/gi, ',')
    .replace(/\bile\b/gi, ',')
    .replace(/\bberaber\b/gi, ',')
    .replace(/\bartı\b/gi, ',')
    // English
    .replace(/\band\b/gi, ',')
    .replace(/\bwith\b/gi, ',')
    .replace(/\bplus\b/gi, ',')
    .replace(/\balso\b/gi, ',')
    .replace(/\+/g, ',')

  const quantityBoundary = new RegExp(
    String.raw`\s+(?=(?:\d+(?:[.,]\d+)?|${NUMBER_WORDS.join('|')})\s+)`,
    'gi'
  )

  return normalized
    .split(',')
    .flatMap((part) => part.trim().replace(quantityBoundary, ',').split(','))
    .map(s => s.trim())
    .filter(s => s.length > 0)
}

// ─── Token parser ───────────────────────────────────────────────────────────

function parseNumber(text: string): { value: number; rest: string } | null {
  const normalized = normalizeFoodText(text)
  const trimmed = normalized.trim()

  // Try decimal/integer at start with optional "buçuk": "200", "1.5", "1 bucuk", "1,5"
  // "1 bucuk" = 1.5, "2 bucuk" = 2.5 etc.
  const numBucukMatch = trimmed.match(/^(\d+(?:[.,]\d+)?)\s+bucuk(?:\s|$)/)
  if (numBucukMatch) {
    const value = parseFloat(numBucukMatch[1].replace(',', '.')) + 0.5
    const rest = trimmed.slice(numBucukMatch[0].trimEnd().length).trim()
    return { value, rest }
  }

  const numMatch = trimmed.match(/^(\d+(?:[.,]\d+)?)\s*(.*)$/)
  if (numMatch) {
    const value = parseFloat(numMatch[1].replace(',', '.'))
    return { value, rest: numMatch[2].trim() }
  }

  // Try Turkish word + "bucuk" FIRST (e.g. "bir bucuk", "iki bucuk") — must come before single-word check
  for (const [word, value] of Object.entries(TURKISH_NUMBERS)) {
    const pattern = word + ' bucuk'
    if (trimmed.startsWith(pattern + ' ') || trimmed === pattern) {
      return { value: value + 0.5, rest: trimmed.slice(pattern.length).trim() }
    }
  }

  // Try Turkish number words: "iki", "yarim", "uc"
  for (const [word, value] of Object.entries(TURKISH_NUMBERS)) {
    if (trimmed.startsWith(word + ' ') || trimmed === word) {
      return { value, rest: trimmed.slice(word.length).trim() }
    }
  }

  // Try English "X and a half" pattern (e.g. "one and a half")
  for (const [word, value] of Object.entries(ENGLISH_NUMBERS)) {
    const pattern = word + ' and a half'
    if (trimmed.startsWith(pattern + ' ') || trimmed === pattern) {
      return { value: value + 0.5, rest: trimmed.slice(pattern.length).trim() }
    }
  }

  // Try English number words: "one", "two", "a", "an"
  for (const [word, value] of Object.entries(ENGLISH_NUMBERS)) {
    if (trimmed.startsWith(word + ' ') || trimmed === word) {
      return { value, rest: trimmed.slice(word.length).trim() }
    }
  }

  return null
}

function parseUnit(text: string): { unit: string; unitInfo: UnitInfo; rest: string } | null {
  const normalized = correctKnownTokens(normalizeFoodText(text))
  const trimmed = normalized.trim()

  // Try multi-word units first (longest match first)
  const multiWordUnits = Object.entries(UNIT_MAP)
    .filter(([k]) => k.includes(' '))
    .sort((a, b) => b[0].length - a[0].length)

  for (const [key, info] of multiWordUnits) {
    if (trimmed.startsWith(key + ' ') || trimmed === key) {
      return { unit: key, unitInfo: info, rest: trimmed.slice(key.length).trim() }
    }
  }

  // Try single-word units
  const firstWord = trimmed.split(/\s+/)[0]
  if (firstWord && UNIT_MAP[firstWord]) {
    return { unit: firstWord, unitInfo: UNIT_MAP[firstWord], rest: trimmed.slice(firstWord.length).trim() }
  }

  if (firstWord) {
    const fuzzyUnit = Object.keys(UNIT_MAP).find((unit) => {
      if (unit.includes(' ')) return false
      if (Math.abs(unit.length - firstWord.length) > 2) return false
      let mismatches = 0
      const maxLen = Math.max(unit.length, firstWord.length)
      for (let i = 0; i < maxLen; i += 1) {
        if (unit[i] !== firstWord[i]) mismatches += 1
        if (mismatches > 1) return false
      }
      return true
    })
    if (fuzzyUnit) {
      return { unit: fuzzyUnit, unitInfo: UNIT_MAP[fuzzyUnit], rest: trimmed.slice(firstWord.length).trim() }
    }
  }

  return null
}

function parseSegment(segment: string): ParsedFoodToken {
  const normalized = stripContextWords(correctKnownTokens(normalizeFoodText(segment)))
  const hasExplicitSize = /\b(kucuk|orta|buyuk|small|medium|large)\b/.test(normalized)

  // Step 1: Extract number
  const numResult = parseNumber(normalized)
  let quantity = numResult ? numResult.value : 1
  let remaining = numResult ? numResult.rest : normalized

  // Step 2: Extract unit
  const unitResult = parseUnit(remaining)
  let unit: string | null = null
  let unitGramMultiplier: number | null = null

  if (unitResult) {
    unit = unitResult.unitInfo.canonical
    unitGramMultiplier = unitResult.unitInfo.gramMultiplier ?? null
    remaining = unitResult.rest

    // Apply multiplier for kg, litre, etc.
    if (unitGramMultiplier && unitResult.unitInfo.canonical === 'gram') {
      quantity = quantity * unitGramMultiplier
      unitGramMultiplier = 1
    }
    if (unitGramMultiplier && unitResult.unitInfo.isMl && unitResult.unitInfo.canonical === 'ml') {
      quantity = quantity * unitGramMultiplier
      unitGramMultiplier = 1
    }
  }

  // Step 3: Clean up food query
  // Remove cooking method adjectives (keep them for context but clean for matching)
  let foodQuery = remaining
    // Turkish cooking methods
    .replace(/\b(haslanmis|haslama|izgara|kizartma|tava|firin|firinda|közlenmis|buharda|kavurma|sote|pismis|cig)\b/g, ' ')
    // English cooking methods & articles
    .replace(/\b(boiled|grilled|fried|baked|roasted|steamed|sauteed|raw|smoked|poached|scrambled|mashed|stuffed)\b/g, ' ')
    .replace(/\b(of|the)\b/g, ' ')
    .replace(/\b(with|and|ve|ile)\b/g, ' ')
    .replace(/\b(kucuk|orta|buyuk|small|medium|large|boy)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (/(\b(kucuk|orta|buyuk|small|medium|large)\b).*\bpatates\b/.test(normalized) && foodQuery === 'patates') {
    foodQuery = 'patates kizartmasi'
  }

  // Keep cooking method in rawText for display
  const confidence = numResult ? 0.7 : 0.5 // Higher confidence if we found a number

  return {
    rawText: segment.trim(),
    quantity,
    quantityExplicit: Boolean(numResult),
    unit,
    unitExplicit: Boolean(unitResult) || hasExplicitSize,
    unitGramMultiplier,
    foodQuery: foodQuery || remaining,
    confidence,
  }
}

// ─── Resolver ───────────────────────────────────────────────────────────────

function resolveToken(token: ParsedFoodToken, catalog: FoodCatalogItem[]): ResolvedFoodItem {
  // Try to find the food in the catalog
  const match = matchFoodToCatalog(token.foodQuery, catalog, 35)

  // Also try with stemmed words
  const stemmedQuery = token.foodQuery.split(' ').map(stemTurkish).join(' ')
  const stemMatch = stemmedQuery !== token.foodQuery ? matchFoodToCatalog(stemmedQuery, catalog, 35) : null

  const bestMatch = match ?? stemMatch

  // Get alternatives for ambiguity resolution
  const alternatives = searchFoodCatalog(catalog, token.foodQuery, undefined, 5)
    .filter(f => f.id !== bestMatch?.id)

  if (!bestMatch) {
    return {
      token: { ...token, confidence: Math.min(token.confidence, 0.3) },
      match: null,
      alternativeMatches: alternatives,
      serving: null,
      totalGrams: 0,
      macros: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
    }
  }

  // Find the best serving option
  const serving = findBestServing(bestMatch, token)
  const totalGrams = calculateTotalGrams(token, serving, bestMatch)

  // Calculate macros
  const per100g: NutritionPer100g = {
    calories: bestMatch.calories,
    protein: bestMatch.protein,
    carbs: bestMatch.carbs,
    fat: bestMatch.fat,
    fiber: bestMatch.fiber,
  }
  const macros = calculateMacrosForWeight(per100g, totalGrams)

  // Adjust confidence based on match quality
  const confidence = match ? Math.max(token.confidence, 0.7) : Math.max(token.confidence, 0.5)

  return {
    token: { ...token, confidence },
    match: bestMatch,
    alternativeMatches: alternatives,
    serving,
    totalGrams,
    macros,
  }
}

function findBestServing(food: FoodCatalogItem, token: ParsedFoodToken): FoodServingOption {
  const { unit, quantity } = token
  const raw = normalizeFoodText(token.rawText)
  const preferServingByLabel = (patterns: string[]): FoodServingOption | undefined =>
    food.servingOptions.find((serving) => {
      const label = normalizeFoodText(serving.label)
      return patterns.some((pattern) => label.includes(pattern))
    })

  const sizedServing =
    (/\b(kucuk|small)\b/.test(raw) && preferServingByLabel(['kucuk', 'small'])) ||
    (/\b(orta|medium)\b/.test(raw) && preferServingByLabel(['orta', 'medium'])) ||
    (/\b(buyuk|large)\b/.test(raw) && preferServingByLabel(['buyuk', 'large']))

  if (sizedServing) return sizedServing

  // If user specified gram/ml, use a direct gram/ml serving
  if (unit === 'gram') {
    return { id: 'gram-direct', label: `${quantity} g`, unitType: 'gram', quantity: 1, gramEquivalent: quantity }
  }
  if (unit === 'ml') {
    return { id: 'ml-direct', label: `${quantity} ml`, unitType: 'ml', quantity: 1, mlEquivalent: quantity }
  }

  // Find a matching serving option by unit type
  if (unit) {
    const matchingServing = food.servingOptions.find(s => s.unitType === unit)
    if (matchingServing) return matchingServing

    if (unit === 'paket') {
      const packagedServing = food.servingOptions.find(s => ['bar', 'adet', 'kutu', 'sise', 'porsiyon'].includes(s.unitType))
      if (packagedServing) return packagedServing
    }

    if (unit === 'adet') {
      const countableServing = food.servingOptions.find(s => ['bar', 'paket', 'kutu', 'sise', 'dilim', 'porsiyon'].includes(s.unitType))
      if (countableServing) return countableServing
    }
  }

  // No unit specified → prefer natural countable/package servings before 100 g/ml.
  if (!unit) {
    for (const preferred of ['adet', 'bar', 'paket', 'kutu', 'sise', 'dilim', 'porsiyon'] as const) {
      const serving = food.servingOptions.find(s => s.unitType === preferred)
      if (serving) return serving
    }
  }

  // Fallback to default serving
  return food.defaultServing
}

function calculateTotalGrams(token: ParsedFoodToken, serving: FoodServingOption, food: FoodCatalogItem): number {
  const { unit, quantity } = token

  // Direct gram/ml input
  if (unit === 'gram' || unit === 'ml') {
    return quantity
  }

  // Use serving's gram equivalent
  const baseAmount = getServingBaseAmount(serving)
  if (baseAmount > 0) {
    return baseAmount * quantity
  }

  // Fallback: use default serving
  const defaultBase = getServingBaseAmount(food.defaultServing)
  return defaultBase * quantity
}

// ─── Meal type suggestion ───────────────────────────────────────────────────

export function suggestMealType(hour?: number): MealType {
  const h = hour ?? new Date().getHours()
  if (h >= 6 && h < 10) return 'breakfast'
  if (h >= 10 && h < 15) return 'lunch'
  if (h >= 15 && h < 18) return 'snack'
  return 'dinner'
}

function detectMealTypeFromText(text: string): MealType | null {
  const normalized = normalizeFoodText(text)
  const words = normalized.split(/\s+/)
  for (const word of words) {
    if (MEAL_TYPE_KEYWORDS[word]) return MEAL_TYPE_KEYWORDS[word]
  }
  return null
}

// ─── Main parser entry point ────────────────────────────────────────────────

export function parseNaturalLanguageInput(
  text: string,
  catalog: FoodCatalogItem[],
  locale?: AppLocale
): ParseResult {
  if (!text.trim()) {
    return {
      items: [],
      totalMacros: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
      suggestedMealType: null,
      unparsedText: '',
    }
  }

  // Detect meal type from text
  const suggestedMealType = detectMealTypeFromText(text)

  // Split into segments
  const segments = splitIntoSegments(text)

  // Parse and resolve each segment
  const items: ResolvedFoodItem[] = []
  const unparsedParts: string[] = []

  for (const segment of segments) {
    // Skip very short segments or pure meal type keywords
    const normalized = normalizeFoodText(segment)
    if (normalized.length < 2) continue
    if (MEAL_TYPE_KEYWORDS[normalized]) continue
    if (isLikelyGarbageSegment(segment)) {
      unparsedParts.push(segment)
      continue
    }

    const token = parseSegment(segment)

    // Skip if food query is empty after parsing
    if (!token.foodQuery.trim()) {
      unparsedParts.push(segment)
      continue
    }

    const resolved = resolveToken(token, catalog)
    items.push(resolved)
  }

  const totalMacros = sumMacros(items.map(i => i.macros))

  // Check for nonsense input: all segments failed to match
  const allFailed = items.length > 0 && items.every(i => i.match === null)
  const noItems = items.length === 0 && unparsedParts.length > 0
  const looksLikeNonsense = isNonsenseInput(text)

  const fp = getStrings((locale ?? 'en') as AppLocale).foodParser

  if ((allFailed || noItems) && looksLikeNonsense) {
    return {
      items,
      totalMacros,
      suggestedMealType,
      unparsedText: unparsedParts.join(', '),
      hasNonsenseInput: true,
      nonsenseMessage: fp.nonsense,
    }
  }

  // If all items failed to match but it's not obviously nonsense,
  // still hint that nothing was found
  if (allFailed && items.length > 0) {
    return {
      items,
      totalMacros,
      suggestedMealType,
      unparsedText: unparsedParts.join(', '),
      hasNonsenseInput: false,
      nonsenseMessage: fp.noMatch,
    }
  }

  return {
    items,
    totalMacros,
    suggestedMealType,
    unparsedText: unparsedParts.join(', '),
  }
}

// ─── Update a resolved item with a different food match ─────────────────────

export function resolveWithFood(
  token: ParsedFoodToken,
  food: FoodCatalogItem,
  catalog: FoodCatalogItem[]
): ResolvedFoodItem {
  const newToken = { ...token, confidence: 0.9 }
  const serving = findBestServing(food, newToken)
  const totalGrams = calculateTotalGrams(newToken, serving, food)

  const per100g: NutritionPer100g = {
    calories: food.calories,
    protein: food.protein,
    carbs: food.carbs,
    fat: food.fat,
    fiber: food.fiber,
  }
  const macros = calculateMacrosForWeight(per100g, totalGrams)
  const alternatives = searchFoodCatalog(catalog, token.foodQuery, undefined, 5)
    .filter(f => f.id !== food.id)

  return {
    token: newToken,
    match: food,
    alternativeMatches: alternatives,
    serving,
    totalGrams,
    macros,
  }
}

// ─── Update a resolved item with new quantity ───────────────────────────────

export function resolveWithQuantity(
  item: ResolvedFoodItem,
  newQuantity: number
): ResolvedFoodItem {
  if (!item.match) return item

  const newToken = { ...item.token, quantity: newQuantity }
  const serving = item.serving ?? item.match.defaultServing
  const totalGrams = calculateTotalGrams(newToken, serving, item.match)

  const per100g: NutritionPer100g = {
    calories: item.match.calories,
    protein: item.match.protein,
    carbs: item.match.carbs,
    fat: item.match.fat,
    fiber: item.match.fiber,
  }
  const macros = calculateMacrosForWeight(per100g, totalGrams)

  return {
    ...item,
    token: { ...newToken, quantityExplicit: true },
    totalGrams,
    macros,
  }
}

// ─── Update a resolved item with explicit serving + quantity ────────────────

export function resolveWithServingAndQuantity(
  item: ResolvedFoodItem,
  serving: FoodServingOption,
  newQuantity: number
): ResolvedFoodItem {
  if (!item.match) return item

  const newToken = {
    ...item.token,
    quantity: newQuantity,
    quantityExplicit: true,
    unit: serving.unitType,
    unitExplicit: true,
  }
  const totalGrams = calculateTotalGrams(newToken, serving, item.match)

  const per100g: NutritionPer100g = {
    calories: item.match.calories,
    protein: item.match.protein,
    carbs: item.match.carbs,
    fat: item.match.fat,
    fiber: item.match.fiber,
  }
  const macros = calculateMacrosForWeight(per100g, totalGrams)

  return {
    ...item,
    token: newToken,
    serving,
    totalGrams,
    macros,
  }
}
