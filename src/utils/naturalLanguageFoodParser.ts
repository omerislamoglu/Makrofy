import type { FoodCatalogItem, FoodServingOption } from '../types/food'
import type { MacroNutrients, NutritionPer100g } from '../types/nutrition'
import type { MealType } from '../types/meal'
import { calculateMacrosForWeight, sumMacros } from '../types/nutrition'
import { matchFoodToCatalog, normalizeFoodText, searchFoodCatalog } from './foodSearch'
import { getServingBaseAmount } from './foodCalculation'

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ParsedFoodToken {
  rawText: string
  quantity: number
  unit: string | null // raw unit text, e.g. 'gram', 'adet', 'porsiyon', 'dilim'...
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
  'dan', 'den', 'tan', 'ten',
  'la', 'le', 'yla', 'yle',
  'si', 'su', 'i', 'u',
  'nda', 'nde',
  'nin', 'nun', 'nun', 'nin',
  'lik', 'luk', 'lik', 'luk',
]

function stemTurkish(word: string): string {
  let result = word
  for (const suffix of TURKISH_SUFFIXES) {
    if (result.length > suffix.length + 2 && result.endsWith(suffix)) {
      result = result.slice(0, -suffix.length)
      break
    }
  }
  return result
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

  return normalized
    .split(',')
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
  const normalized = normalizeFoodText(text)
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

  return null
}

function parseSegment(segment: string): ParsedFoodToken {
  const normalized = normalizeFoodText(segment)

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
  const foodQuery = remaining
    // Turkish cooking methods
    .replace(/\b(haslanmis|haslama|izgara|kizartma|tava|firin|firinda|közlenmis|buharda|kavurma|sote|pismis|cig)\b/g, ' ')
    // English cooking methods & articles
    .replace(/\b(boiled|grilled|fried|baked|roasted|steamed|sauteed|raw|smoked|poached|scrambled|mashed|stuffed)\b/g, ' ')
    .replace(/\b(of|the)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  // Keep cooking method in rawText for display
  const confidence = numResult ? 0.7 : 0.5 // Higher confidence if we found a number

  return {
    rawText: segment.trim(),
    quantity,
    unit,
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
  }

  // No unit specified → check if food has a piece/adet serving (for countable items)
  if (!unit) {
    const adetServing = food.servingOptions.find(s => s.unitType === 'adet')
    if (adetServing) return adetServing

    const porsiyonServing = food.servingOptions.find(s => s.unitType === 'porsiyon')
    if (porsiyonServing) return porsiyonServing
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
  catalog: FoodCatalogItem[]
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
    token: newToken,
    totalGrams,
    macros,
  }
}
