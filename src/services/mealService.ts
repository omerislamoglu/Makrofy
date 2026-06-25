import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  DocumentReference,
  QueryConstraint,
} from 'firebase/firestore'
import { Capacitor } from '@capacitor/core'
import { db, isDemoMode } from './firebase'
import type {
  Meal,
  FoodItem,
  MealFormData,
  MealType,
  DailySummary,
} from '../types/meal'
import {
  calculateMacrosForWeight,
  sumMacros,
} from '../types/nutrition'
import { getToday } from '../utils/date'
import { createId } from '../utils/id'
import { pushOptimisticMeal, resolveOptimisticMeal, failOptimisticMeal, queueOptimisticMeal } from './optimisticMeals'
import { enqueueMeal, dequeueMeal, getQueueEntries } from './offlineQueue'
import type { OfflineQueueEntry } from './offlineQueue'

// ─── Demo persistence (localStorage) ─────────────────────────────────────────
// Without Firebase credentials the app runs in demo mode; persist meals locally
// so saving, the daily counter, and the meal list all work end-to-end.

const DEMO_MEALS_KEY = (userId: string) => `makrofy_meals_${userId}`
const DEBUG_MEALS = import.meta.env.DEV

export type SerializedError = {
  name?: string
  message?: string
  code?: string
  stack?: string
  status?: string
  details?: unknown
  json?: string
  rawType: string
}

export function serializeError(error: unknown): SerializedError {
  const rawType = Object.prototype.toString.call(error)
  const record = error && typeof error === 'object' ? error as Record<string, unknown> : null
  let json: string | undefined
  try {
    json = JSON.stringify(error)
  } catch {
    json = '[unserializable]'
  }

  const details: SerializedError = { rawType }
  if (error instanceof Error) {
    details.name = error.name
    details.message = error.message
    details.stack = error.stack
  }
  if (record?.name) details.name = String(record.name)
  if (record?.message) details.message = String(record.message)
  if (record?.code) details.code = String(record.code)
  if (record?.status) details.status = String(record.status)
  if (record?.details !== undefined) details.details = record.details
  if (json) details.json = json
  return details
}

export function getSaveErrorMessage(error: unknown): string {
  const details = serializeError(error)
  const text = `${details.code ?? ''} ${details.status ?? ''} ${details.message ?? ''}`.toLowerCase()

  if (text.includes('unauth') || text.includes('permission-denied') || text.includes('permission_denied')) {
    return 'Save permission denied. Please sign in again.'
  }
  if (text.includes('invalid') || text.includes('argument') || text.includes('malformed')) {
    return 'Analysis result could not be saved.'
  }
  return 'Could not save meal. Check your connection and try again.'
}

function demoReadMeals(userId: string): Meal[] {
  try {
    const raw = localStorage.getItem(DEMO_MEALS_KEY(userId))
    return raw ? (JSON.parse(raw) as Meal[]) : []
  } catch {
    return []
  }
}

function demoWriteMeals(userId: string, meals: Meal[]): void {
  localStorage.setItem(DEMO_MEALS_KEY(userId), JSON.stringify(meals))
}

function emitMealsUpdated(): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent('makrofy:meals-updated'))
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Returns the `users/{userId}/meals` collection reference. */
function mealsCollection(userId: string) {
  return collection(db, 'users', userId, 'meals')
}

/** Returns a single meal document reference. */
function mealDoc(userId: string, mealId: string): DocumentReference {
  return doc(db, 'users', userId, 'meals', mealId)
}

/** Guard: every public function must have a userId. */
function assertUserId(userId: string): void {
  if (!userId) {
    throw new Error('mealService: userId is required')
  }
}

/** Today's date key in YYYY-MM-DD format. */
function todayKey(): string {
  return getToday()
}

function safeNumber(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : 0
}

/**
 * Normalize a raw meal object from Cloud Function response.
 * Ensures `totalMacros` is always a valid MacroNutrients object,
 * falling back to flat fields (calories, protein, etc.) if needed.
 */
function normalizeCFMeal(raw: Record<string, unknown>): Meal {
  const meal = raw as unknown as Meal
  const tm = meal.totalMacros
  // If totalMacros is missing or has invalid values, rebuild from flat fields
  if (!tm || typeof tm.calories !== 'number') {
    meal.totalMacros = {
      calories: safeNumber(meal.calories),
      protein: safeNumber(meal.protein),
      carbs: safeNumber(meal.carbs),
      fat: safeNumber(meal.fat),
      fiber: safeNumber(meal.fiber),
    }
  }
  // Ensure flat fields match totalMacros
  meal.calories = meal.totalMacros.calories
  meal.protein = meal.totalMacros.protein
  meal.carbs = meal.totalMacros.carbs
  meal.fat = meal.totalMacros.fat
  meal.fiber = meal.totalMacros.fiber
  return meal
}

function normalizeFoodItem(item: FoodItem): FoodItem {
  const grams = Math.max(1, Math.round(safeNumber(item.grams)))
  return {
    ...item,
    id: item.id || createId(),
    name: item.name?.trim() || 'Food',
    grams,
    macros: {
      calories: Math.round(safeNumber(item.macros?.calories)),
      protein: Math.round(safeNumber(item.macros?.protein) * 10) / 10,
      carbs: Math.round(safeNumber(item.macros?.carbs) * 10) / 10,
      fat: Math.round(safeNumber(item.macros?.fat) * 10) / 10,
      fiber: Math.round(safeNumber(item.macros?.fiber) * 10) / 10,
    },
    servingUnit: item.servingUnit ?? 'g',
    servingLabel: item.servingLabel ?? `${grams} g`,
    selectedQuantity: item.selectedQuantity ?? grams,
    gramEquivalent: item.gramEquivalent ?? grams,
  }
}

// ─── Unified native save ────────────────────────────────────────────────────
// Single function for ALL meal saves on native iOS (AI scan, text, manual, restaurant).
// Uses the saveAnalyzedMeal Cloud Function with Capacitor auth token.

let _cachedFirebaseAuth: typeof import('@capacitor-firebase/authentication').FirebaseAuthentication | null = null
let _cachedCapacitorToken: { token: string; expiresAt: number } | null = null
// The uid the cached token was minted for. The native Firebase ID token is
// derived from whichever account is currently signed in, and the Cloud Functions
// resolve the uid FROM that token (not from any client-passed id). Caching the
// token across an account switch therefore leaks one user's meals into the
// next user's session. Binding the cache to the expected uid forces a refresh
// the instant the active account changes.
let _cachedTokenUserId: string | null = null

/**
 * Clear the cached native auth token. MUST be called on sign-out (and is also
 * self-healing via the uid check in `getCapacitorToken`) so the next account's
 * requests never reuse the previous account's still-valid token.
 */
export function clearNativeMealAuthCache(): void {
  _cachedCapacitorToken = null
  _cachedTokenUserId = null
}

async function getCapacitorToken(expectedUserId?: string): Promise<string> {
  // If the cached token was minted for a different account, drop it before the
  // freshness check so we never hand back the previous user's token.
  const userMismatch =
    !!expectedUserId && _cachedTokenUserId !== null && _cachedTokenUserId !== expectedUserId
  if (userMismatch) {
    _cachedCapacitorToken = null
  }
  if (_cachedCapacitorToken && _cachedCapacitorToken.expiresAt > Date.now()) {
    return _cachedCapacitorToken.token
  }
  if (!_cachedFirebaseAuth) {
    const mod = await import('@capacitor-firebase/authentication')
    _cachedFirebaseAuth = mod.FirebaseAuthentication
  }
  // Force a fresh token when the account just changed so the native SDK cannot
  // return the previous user's cached token.
  const { token } = await _cachedFirebaseAuth.getIdToken({ forceRefresh: userMismatch })
  if (!token) throw new Error('No auth token available on native')
  _cachedCapacitorToken = {
    token,
    expiresAt: Date.now() + 50 * 60 * 1000,
  }
  if (expectedUserId) _cachedTokenUserId = expectedUserId
  return token
}

function getCFEndpoint(fnName: string): string {
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID
  const region = import.meta.env.VITE_FIREBASE_FUNCTIONS_REGION || 'us-central1'
  return `https://${region}-${projectId}.cloudfunctions.net/${fnName}`
}

async function saveMealNative(localMeal: Meal, existingMealId?: string, emit = true): Promise<Meal> {
  const endpoint = getCFEndpoint('saveAnalyzedMeal')

  // Sanitize items — only send fields the CF needs
  const cleanItems = localMeal.items.map(item => ({
    id: item.id || createId(),
    name: item.name || 'Food',
    grams: Math.max(1, Math.round(item.grams || 0)),
    macros: {
      calories: Math.round(safeNumber(item.macros?.calories)),
      protein: Math.round(safeNumber(item.macros?.protein)),
      carbs: Math.round(safeNumber(item.macros?.carbs)),
      fat: Math.round(safeNumber(item.macros?.fat)),
      fiber: Math.round(safeNumber(item.macros?.fiber)),
    },
    ...(item.confidence && { confidence: item.confidence }),
  }))

  const payload = {
    data: {
      ...(existingMealId && { mealId: existingMealId }),
      meal: {
        name: localMeal.name,
        items: cleanItems,
        totalMacros: localMeal.totalMacros,
        mealType: localMeal.mealType,
        source: localMeal.source || 'manual',
        ...(localMeal.imageUrl && { imageUrl: localMeal.imageUrl }),
        ...(localMeal.notes && { notes: localMeal.notes }),
        ...(localMeal.confidence && { confidence: localMeal.confidence }),
        dateKey: localMeal.dateKey,
      },
    },
  }

  if (DEBUG_MEALS) console.log('[MEAL_SAVE_NATIVE]', {
    source: localMeal.source,
    items: cleanItems.length,
    kcal: localMeal.totalMacros?.calories,
    dateKey: localMeal.dateKey,
  })

  // Try with cached token first, retry once with fresh token on 401
  let token = await getCapacitorToken(localMeal.userId)
  let response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  // If 401/403, clear cache and retry with a fresh token
  if (response.status === 401 || response.status === 403) {
    _cachedCapacitorToken = null
    token = await getCapacitorToken(localMeal.userId)
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  }

  const rawText = await response.text()
  if (!response.ok) {
    console.error('[MEAL_SAVE_NATIVE] failed', { status: response.status, body: rawText.substring(0, 300) })
    throw new Error(`Save failed: ${response.status} ${rawText.substring(0, 200)}`)
  }

  let result: { result?: { success?: boolean; mealId?: string } }
  try {
    result = JSON.parse(rawText)
  } catch {
    console.error('[MEAL_SAVE_NATIVE] JSON parse failed', { preview: rawText.substring(0, 300) })
    throw new Error('Save response parse failed')
  }

  const mealId = result.result?.mealId ?? localMeal.id
  if (DEBUG_MEALS) console.log('[MEAL_SAVE_NATIVE] success', { mealId, source: localMeal.source })
  if (emit) emitMealsUpdated()
  return { ...localMeal, id: mealId }
}

type SaveAIScanMealPayload = Omit<Meal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>

function buildNormalizedMeal(
  userId: string,
  data: SaveAIScanMealPayload,
  id = createId()
): Meal {
  const items = data.items.map(normalizeFoodItem)
  const totalMacros = sumMacros(items.map((i) => i.macros))
  const nowIso = new Date().toISOString()
  return {
    id,
    userId,
    name: data.name || data.notes || items.map((item) => item.name).join(' · ') || 'Meal',
    items,
    totalMacros,
    calories: totalMacros.calories,
    protein: totalMacros.protein,
    carbs: totalMacros.carbs,
    fat: totalMacros.fat,
    fiber: totalMacros.fiber,
    quantity: items.reduce((sum, item) => sum + item.grams, 0),
    mealType: data.mealType ?? 'lunch',
    source: 'ai_scan',
    dateKey: data.dateKey || todayKey(),
    createdAt: nowIso,
    updatedAt: nowIso,
    ...(data.imageUrl && { imageUrl: data.imageUrl }),
    ...(data.notes && { notes: data.notes }),
    ...(data.confidence && { confidence: data.confidence }),
  }
}

/**
 * Convert a Firestore document snapshot into a typed Meal.
 * Firestore Timestamps are kept as-is (the Meal type accepts both
 * `Timestamp` and `string` via `FirestoreTimestamp`).
 */
function docToMeal(docSnap: { id: string; data: () => Record<string, unknown> }): Meal {
  const data = docSnap.data()
  return {
    ...data,
    id: docSnap.id,
  } as Meal
}

// ─── Create ─────────────────────────────────────────────────────────────────

/**
 * Build the local `Meal` for a create — pure & synchronous, no I/O.
 * Shared by `createMeal` (persistence) and `createMealOptimistic` (instant UI),
 * so the optimistically-shown meal matches exactly what gets persisted.
 */
function buildCreateMealLocal(
  userId: string,
  data: MealFormData | Omit<Meal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Meal {
  let items: FoodItem[]
  let mealType: MealType
  let source: Meal['source']
  let imageUrl: string | undefined
  let notes: string | undefined
  let confidence: Meal['confidence']

  // Distinguish MealFormData (has `items[].caloriesPer100g`) from a pre-built payload.
  if ('items' in data && data.items.length > 0 && 'caloriesPer100g' in data.items[0]) {
    // MealFormData path — compute macros from per-100 g nutrition values.
    const formData = data as MealFormData
    items = formData.items.map((entry) => ({
      id: createId(),
      ...(entry.foodId && { foodId: entry.foodId }),
      name: entry.name,
      grams: entry.grams,
      ...(entry.ml && { ml: entry.ml }),
      macros: calculateMacrosForWeight(
        {
          calories: entry.caloriesPer100g,
          protein: entry.proteinPer100g,
          carbs: entry.carbsPer100g,
          fat: entry.fatPer100g,
          fiber: entry.fiberPer100g ?? 0,
        },
        entry.grams
      ),
      ...(entry.servingLabel && { servingLabel: entry.servingLabel }),
      ...(entry.selectedQuantity && { selectedQuantity: entry.selectedQuantity }),
      ...(entry.gramEquivalent && { gramEquivalent: entry.gramEquivalent }),
      ...(entry.mlEquivalent && { mlEquivalent: entry.mlEquivalent }),
    }))
    mealType = formData.mealType
    source = formData.source
    imageUrl = formData.imageUrl
    notes = formData.notes
  } else {
    // Pre-built payload (e.g. from AI scan)
    const payload = data as Omit<Meal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
    items = payload.items.map(normalizeFoodItem)
    mealType = payload.mealType ?? 'lunch'
    source = payload.source ?? 'ai_scan'
    imageUrl = payload.imageUrl
    notes = payload.notes
    confidence = payload.confidence
  }

  const totalMacros = sumMacros(items.map((i) => i.macros))
  const dateKey = 'dateKey' in data && typeof data.dateKey === 'string' && data.dateKey
    ? data.dateKey
    : todayKey()

  const nowIso = new Date().toISOString()
  return {
    id: createId(),
    userId,
    name: notes || items.map((item) => item.name).join(' · ') || 'Meal',
    items,
    totalMacros,
    calories: totalMacros.calories,
    protein: totalMacros.protein,
    carbs: totalMacros.carbs,
    fat: totalMacros.fat,
    fiber: totalMacros.fiber,
    quantity: items.reduce((sum, item) => sum + item.grams, 0),
    mealType,
    source,
    dateKey,
    createdAt: nowIso,
    updatedAt: nowIso,
    ...(imageUrl && { imageUrl }),
    ...(notes && { notes }),
    ...(confidence && { confidence }),
  }
}

/**
 * Create a new meal document under `users/{userId}/meals`.
 *
 * Accepts either a `MealFormData` (from the manual-entry form, where macros
 * are computed from per-100 g values) or a pre-built partial `Meal` (from
 * AI scan results where items already carry computed macros).
 *
 * `emit` controls the `makrofy:meals-updated` dispatch on success. Optimistic
 * wrappers pass `false` and emit themselves once the optimistic copy has been
 * reconciled, so the UI never shows the optimistic and real meal at once.
 */
export async function createMeal(
  userId: string,
  data: MealFormData | Omit<Meal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>,
  emit = true
): Promise<Meal> {
  assertUserId(userId)

  const localMeal = buildCreateMealLocal(userId, data)
  const { items, totalMacros, mealType, source, dateKey, imageUrl, notes, confidence } = localMeal

  if (isDemoMode) {
    demoWriteMeals(userId, [localMeal, ...demoReadMeals(userId)])
    if (emit) emitMealsUpdated()
    return localMeal
  }

  if (DEBUG_MEALS) console.log('[MEAL_SAVE] createMeal start', {
    userId,
    itemCount: items.length,
    totalCalories: totalMacros.calories,
    mealType,
    source,
    dateKey,
    native: Capacitor.isNativePlatform(),
  })

  // On native iOS, use Cloud Function (Firestore Web SDK auth not synced)
  if (Capacitor.isNativePlatform()) {
    return saveMealNative(localMeal, undefined, emit)
  }

  // Web path: direct Firestore write
  const now = serverTimestamp()

  const mealData = {
    userId,
    name: localMeal.name,
    items,
    totalMacros,
    calories: totalMacros.calories,
    protein: totalMacros.protein,
    carbs: totalMacros.carbs,
    fat: totalMacros.fat,
    fiber: totalMacros.fiber,
    quantity: localMeal.quantity,
    mealType,
    source,
    dateKey,
    createdAt: now,
    updatedAt: now,
    ...(imageUrl && { imageUrl }),
    ...(notes && { notes }),
    ...(confidence && { confidence }),
  }

  try {
    const ref = await addDoc(mealsCollection(userId), mealData)
    const remoteMeal = {
      ...localMeal,
      id: ref.id,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }
    if (DEBUG_MEALS) console.log('[MEAL_SAVE] createMeal success', { mealId: ref.id })
    if (emit) emitMealsUpdated()
    return remoteMeal
  } catch (error) {
    console.error('[MEAL_SAVE] createMeal write error', {
      userId,
      error: serializeError(error),
    })
    throw error
  }
}


export async function saveAIScanMeal(
  userId: string,
  data: SaveAIScanMealPayload,
  existingMealId?: string,
  emit = true
): Promise<Meal> {
  assertUserId(userId)

  const localMeal = buildNormalizedMeal(userId, data, existingMealId || createId())

  if (isDemoMode) {
    const existingMeals = demoReadMeals(userId)
    const nextMeals = existingMealId
      ? [localMeal, ...existingMeals.filter((meal) => meal.id !== existingMealId)]
      : [localMeal, ...existingMeals]
    demoWriteMeals(userId, nextMeals)
    if (emit) emitMealsUpdated()
    return localMeal
  }

  if (DEBUG_MEALS) console.log('[AI_SAVE] saveAIScanMeal start', {
    userId,
    existingMealId: existingMealId ?? 'none',
    itemCount: localMeal.items.length,
    totalCalories: localMeal.totalMacros.calories,
    mealType: localMeal.mealType,
    dateKey: localMeal.dateKey,
    native: Capacitor.isNativePlatform(),
  })

  // On native iOS, use Cloud Function via manual fetch (Firestore Web SDK auth not synced)
  if (Capacitor.isNativePlatform()) {
    return saveMealNative(localMeal, existingMealId, emit)
  }

  // Web path: direct Firestore write
  const now = serverTimestamp()

  const mealData = {
    userId,
    name: localMeal.name,
    items: localMeal.items,
    totalMacros: localMeal.totalMacros,
    calories: localMeal.totalMacros.calories,
    protein: localMeal.totalMacros.protein,
    carbs: localMeal.totalMacros.carbs,
    fat: localMeal.totalMacros.fat,
    fiber: localMeal.totalMacros.fiber,
    quantity: localMeal.quantity,
    mealType: localMeal.mealType,
    source: 'ai_scan' as const,
    dateKey: localMeal.dateKey,
    updatedAt: now,
    ...(localMeal.confidence && { confidence: localMeal.confidence }),
    ...(localMeal.notes && { notes: localMeal.notes }),
  }

  try {
    let mealId: string

    if (existingMealId) {
      const ref = mealDoc(userId, existingMealId)
      const snap = await getDoc(ref)
      if (snap.exists()) {
        await updateDoc(ref, { ...mealData })
      } else {
        await setDoc(ref, { ...mealData, createdAt: now })
      }
      mealId = existingMealId
    } else {
      const ref = await addDoc(mealsCollection(userId), { ...mealData, createdAt: now })
      mealId = ref.id
    }

    if (DEBUG_MEALS) console.log('[AI_SAVE] saveAIScanMeal success', {
      documentId: mealId,
      writePath: `users/${userId}/meals/${mealId}`,
    })
    if (emit) emitMealsUpdated()
    return { ...localMeal, id: mealId, updatedAt: Timestamp.now() }
  } catch (error) {
    const details = serializeError(error)
    console.error('[AI_SAVE] save failed full error', details)
    throw error
  }
}


// ─── Optimistic save (instant, single-tap) ──────────────────────────────────
// Build the local Meal synchronously, show it in the UI immediately, then
// persist in the background. The caller navigates right away. On success the
// optimistic copy is dropped so the freshly-fetched real doc takes over; on
// failure it is removed and an error toast is dispatched (or queued if offline).

/** Returns true when the error is caused by a missing / dropped network connection. */
function isNetworkError(error: unknown): boolean {
  if (!navigator.onLine) return true
  const msg = (error instanceof Error ? error.message : String(error)).toLowerCase()
  return (
    msg.includes('failed to fetch') ||
    msg.includes('network') ||
    msg.includes('offline') ||
    msg.includes('connection') ||
    msg.includes('internet') ||
    msg.includes('host') ||
    msg.includes('unreachable') ||
    msg.includes('networkerror')
  )
}

type BackgroundSaveQueueMeta = {
  userId: string
  meal: Meal
  saveType: OfflineQueueEntry['saveType']
  existingMealId?: string
}

function runBackgroundSave(
  persist: () => Promise<Meal>,
  optimisticId: string,
  /** When provided, a network failure queues the meal instead of failing it. */
  offlineMeta?: BackgroundSaveQueueMeta
): void {
  persist()
    .then(() => resolveOptimisticMeal(optimisticId))
    .catch((error) => {
      console.error('[MEAL_SAVE] background save failed', serializeError(error))
      if (offlineMeta && isNetworkError(error)) {
        // Offline → queue for later, keep the meal visible in the UI
        enqueueMeal(offlineMeta.userId, offlineMeta.meal, offlineMeta.saveType, offlineMeta.existingMealId)
        queueOptimisticMeal(optimisticId)
      } else {
        failOptimisticMeal(optimisticId, getSaveErrorMessage(error))
      }
    })
}

/** Manual / text / restaurant saves — returns the local Meal immediately. */
export function createMealOptimistic(
  userId: string,
  data: MealFormData | Omit<Meal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Meal {
  assertUserId(userId)
  const localMeal = buildCreateMealLocal(userId, data)
  pushOptimisticMeal(localMeal)
  runBackgroundSave(
    () => createMeal(userId, data, false),
    localMeal.id,
    { userId, meal: localMeal, saveType: 'createMeal' }
  )
  return localMeal
}

/** AI-scan saves (and edits via `existingMealId`) — returns the local Meal immediately. */
export function saveAIScanMealOptimistic(
  userId: string,
  data: SaveAIScanMealPayload,
  existingMealId?: string
): Meal {
  assertUserId(userId)
  const localMeal = buildNormalizedMeal(userId, data, existingMealId || createId())
  pushOptimisticMeal(localMeal)
  runBackgroundSave(
    () => saveAIScanMeal(userId, data, existingMealId, false),
    localMeal.id,
    { userId, meal: localMeal, saveType: 'saveAIScanMeal', existingMealId }
  )
  return localMeal
}

/**
 * Retry all meals in the offline queue for the given user.
 * Safe to call repeatedly — skips if already online check fails or queue empty.
 * Call this when the network comes back (`app:online` event) or on `app:resume`.
 */
export async function drainOfflineQueueMeals(userId: string): Promise<void> {
  if (!navigator.onLine) return
  const entries = getQueueEntries(userId)
  if (entries.length === 0) return

  if (DEBUG_MEALS) console.log('[OFFLINE_QUEUE] draining', { count: entries.length })

  let anySaved = false
  for (const entry of entries) {
    try {
      if (entry.saveType === 'saveAIScanMeal') {
        await saveAIScanMeal(userId, entry.meal as SaveAIScanMealPayload, entry.existingMealId, false)
      } else {
        await createMeal(userId, entry.meal, false)
      }
      dequeueMeal(entry.meal.id)
      resolveOptimisticMeal(entry.meal.id)
      anySaved = true
      if (DEBUG_MEALS) console.log('[OFFLINE_QUEUE] synced', { mealId: entry.meal.id })
    } catch (err) {
      // Leave in queue — will retry on next drain attempt
      if (DEBUG_MEALS) console.log('[OFFLINE_QUEUE] retry later', { mealId: entry.meal.id, err })
    }
  }

  if (anySaved) emitMealsUpdated()
}


// ─── Read (single) ──────────────────────────────────────────────────────────

/** Fetch a single meal by its document ID. Returns `null` if not found. */
export async function getMealById(
  userId: string,
  mealId: string
): Promise<Meal | null> {
  assertUserId(userId)

  if (isDemoMode) {
    return demoReadMeals(userId).find((m) => m.id === mealId) ?? null
  }

  const snap = await getDoc(mealDoc(userId, mealId))
  if (!snap.exists()) return null
  return docToMeal(snap)
}

// ─── Read (by date) ─────────────────────────────────────────────────────────

/**
 * Fetch all meals for a specific day.
 * `dateKey` must be in YYYY-MM-DD format.
 */
export async function getMealsByDate(
  userId: string,
  dateKey: string
): Promise<Meal[]> {
  assertUserId(userId)

  if (isDemoMode) {
    return demoReadMeals(userId)
      .filter((m) => m.dateKey === dateKey)
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
  }

  if (DEBUG_MEALS) console.log('[HOME_MEALS] refresh start', { userId, dateKey, native: Capacitor.isNativePlatform() })

  // On native iOS, Firestore Web SDK auth is not synced with Capacitor.
  // Use Cloud Function callable via manual fetch with Capacitor ID token.
  if (Capacitor.isNativePlatform()) {
    return getMealsByDateNative(userId, dateKey)
  }

  // Web path: Firestore Web SDK
  const q = query(
    mealsCollection(userId),
    where('dateKey', '==', dateKey)
  )

  try {
    const snap = await getDocs(q)
    const meals = snap.docs.map(docToMeal)
    meals.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
    if (DEBUG_MEALS) console.log('[HOME_MEALS] fetched count', { count: meals.length, dateKey })
    return meals
  } catch (error) {
    console.error('[HOME_MEALS] error', {
      userId,
      dateKey,
      error: serializeError(error),
    })
    throw error
  }
}

/**
 * Native iOS: fetch meals via Cloud Function (getMealsForDate) using Capacitor auth token.
 * Firestore Web SDK doesn't work on native because JS Firebase Auth isn't synced.
 */
async function getMealsByDateNative(userId: string, dateKey: string): Promise<Meal[]> {
  try {
    let token = await getCapacitorToken(userId)
    const endpoint = getCFEndpoint('getMealsForDate')

    if (DEBUG_MEALS) console.log('[HOME_MEALS] native fetch', { dateKey })

    let response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: { dateKey } }),
    })

    // Retry once with fresh token on auth failure
    if (response.status === 401 || response.status === 403) {
      _cachedCapacitorToken = null
      token = await getCapacitorToken(userId)
      response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { dateKey } }),
      })
    }

    const rawText = await response.text()
    if (!response.ok) {
      console.error('[HOME_MEALS] native fetch failed', { status: response.status, body: rawText.substring(0, 300) })
      return []
    }

    let payload: { result?: { meals?: Meal[] } }
    try {
      payload = JSON.parse(rawText)
    } catch {
      console.error('[HOME_MEALS] native JSON parse failed', { preview: rawText.substring(0, 300) })
      return []
    }

    const rawMeals = (payload.result?.meals ?? []) as unknown as Record<string, unknown>[]
    const meals = rawMeals.map(normalizeCFMeal)
    if (DEBUG_MEALS) console.log('[HOME_MEALS] native fetched count', {
      count: meals.length,
      dateKey,
      ids: meals.map(m => m.id),
      firstMealCalories: meals[0]?.totalMacros?.calories,
    })
    return meals
  } catch (error) {
    console.error('[HOME_MEALS] native error', serializeError(error))
    return []
  }
}

// ─── Read (history range) ───────────────────────────────────────────────────

/**
 * Fetch meals between two dates (inclusive).
 * Both `startDate` and `endDate` must be YYYY-MM-DD strings.
 */
export async function getMealHistory(
  userId: string,
  startDate: string,
  endDate: string
): Promise<Meal[]> {
  assertUserId(userId)

  if (isDemoMode) {
    return demoReadMeals(userId)
      .filter((m) => m.dateKey >= startDate && m.dateKey <= endDate)
      .sort((a, b) =>
        a.dateKey === b.dateKey
          ? String(b.createdAt).localeCompare(String(a.createdAt))
          : b.dateKey.localeCompare(a.dateKey)
      )
  }

  // On native iOS, use Cloud Function (Firestore Web SDK auth not synced)
  if (Capacitor.isNativePlatform()) {
    return getMealHistoryNative(userId, startDate, endDate)
  }

  // Web path: Firestore Web SDK
  const constraints: QueryConstraint[] = [
    where('dateKey', '>=', startDate),
    where('dateKey', '<=', endDate),
    orderBy('dateKey', 'desc'),
    orderBy('createdAt', 'desc'),
  ]

  const q = query(mealsCollection(userId), ...constraints)
  try {
    const snap = await getDocs(q)
    const meals = snap.docs.map(docToMeal).sort((a, b) =>
      a.dateKey === b.dateKey
        ? String(b.createdAt).localeCompare(String(a.createdAt))
        : b.dateKey.localeCompare(a.dateKey)
    )
    if (DEBUG_MEALS) console.log('[HISTORY] fetched count', { count: meals.length, startDate, endDate })
    return meals
  } catch (error) {
    console.error('[HISTORY] Firestore read failed', {
      currentUserUid: userId,
      where: { startDate, endDate },
      error: serializeError(error),
    })
    throw error
  }
}

/**
 * Native iOS: fetch meal history via getMealsForRange Cloud Function.
 */
async function getMealHistoryNative(userId: string, startDate: string, endDate: string): Promise<Meal[]> {
  try {
    let token = await getCapacitorToken(userId)
    const endpoint = getCFEndpoint('getMealsForRange')

    if (DEBUG_MEALS) console.log('[HISTORY] native fetch', { startDate, endDate })

    let response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: { startDateKey: startDate, endDateKey: endDate } }),
    })

    // Retry once with fresh token on auth failure
    if (response.status === 401 || response.status === 403) {
      _cachedCapacitorToken = null
      token = await getCapacitorToken(userId)
      response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { startDateKey: startDate, endDateKey: endDate } }),
      })
    }

    const rawText = await response.text()
    if (!response.ok) {
      console.error('[HISTORY] native fetch failed', { status: response.status, body: rawText.substring(0, 300) })
      return []
    }

    let payload: { result?: { meals?: Meal[] } }
    try {
      payload = JSON.parse(rawText)
    } catch {
      console.error('[HISTORY] native JSON parse failed', { preview: rawText.substring(0, 300) })
      return []
    }

    const rawMeals = (payload.result?.meals ?? []) as unknown as Record<string, unknown>[]
    const meals = rawMeals.map(normalizeCFMeal)
    if (DEBUG_MEALS) console.log('[HISTORY] native fetched count', { count: meals.length, startDate, endDate })
    return meals
  } catch (error) {
    console.error('[HISTORY] native error', serializeError(error))
    return []
  }
}

// ─── Update ─────────────────────────────────────────────────────────────────

/**
 * Partially update a meal document. Only the fields present in `updates`
 * are written; everything else is left untouched. `updatedAt` is always
 * refreshed automatically.
 */
export async function updateMeal(
  userId: string,
  mealId: string,
  updates: Partial<Omit<Meal, 'id' | 'userId' | 'createdAt'>>
): Promise<void> {
  assertUserId(userId)

  if (isDemoMode) {
    const updatedAt = new Date().toISOString()
    const meals = demoReadMeals(userId).map((meal) => {
      if (meal.id !== mealId) return meal
      const updatedMeal = { ...meal, ...updates, updatedAt }
      if (updates.items) {
        updatedMeal.totalMacros = sumMacros(updates.items.map((i) => i.macros))
      }
      return updatedMeal
    })
    demoWriteMeals(userId, meals)
    emitMealsUpdated()
    return
  }

  // If items were changed, recalculate totalMacros automatically.
  const patch: Record<string, unknown> = { ...updates, updatedAt: serverTimestamp() }

  if (updates.items) {
    patch.totalMacros = sumMacros(updates.items.map((i) => i.macros))
  }

  await updateDoc(mealDoc(userId, mealId), patch)
  emitMealsUpdated()
}

// ─── Delete ─────────────────────────────────────────────────────────────────

/** Permanently delete a meal document. */
export async function deleteMeal(
  userId: string,
  mealId: string
): Promise<void> {
  assertUserId(userId)

  if (isDemoMode) {
    demoWriteMeals(userId, demoReadMeals(userId).filter((m) => m.id !== mealId))
    emitMealsUpdated()
    return
  }

  if (DEBUG_MEALS) console.log('[MEAL_DELETE] starting', { userId, mealId, native: Capacitor.isNativePlatform() })

  if (Capacitor.isNativePlatform()) {
    await deleteMealNative(userId, mealId)
  } else {
    await deleteDoc(mealDoc(userId, mealId))
  }

  if (DEBUG_MEALS) console.log('[MEAL_DELETE] success', { mealId })
  emitMealsUpdated()
}

/**
 * Native iOS: delete meal via deleteMeal Cloud Function using Capacitor auth token.
 */
async function deleteMealNative(userId: string, mealId: string): Promise<void> {
  let token = await getCapacitorToken(userId)
  const endpoint = getCFEndpoint('deleteMeal')

  if (DEBUG_MEALS) console.log('[MEAL_DELETE] native call starting', { mealId })

  let response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: { mealId } }),
  })

  // Retry once with fresh token on auth failure
  if (response.status === 401 || response.status === 403) {
    _cachedCapacitorToken = null
    token = await getCapacitorToken(userId)
    response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { mealId } }),
    })
  }

  const rawText = await response.text()
  if (DEBUG_MEALS) console.log('[MEAL_DELETE] response', { status: response.status })

  if (!response.ok) {
    console.error('[MEAL_DELETE] error full', { status: response.status, body: rawText.substring(0, 300) })
    throw new Error(`Delete failed: ${response.status} ${rawText.substring(0, 200)}`)
  }

  let result: { result?: { success?: boolean } }
  try {
    result = JSON.parse(rawText)
  } catch {
    throw new Error('Delete response parse failed')
  }

  if (!result.result?.success) {
    throw new Error('Delete returned unsuccessful')
  }
}

// ─── Convenience helpers (used by hooks) ────────────────────────────────────

// ─── Custom Foods ──────────────────────────────────────────────────────────

/** Save a custom food to `users/{userId}/customFoods` for quick re-use. */
export async function saveCustomFood(
  userId: string,
  food: {
    name: string
    nutritionPer100g: { calories: number; protein: number; carbs: number; fat: number; fiber: number }
    defaultServingSize: number
  }
): Promise<void> {
  assertUserId(userId)

  if (isDemoMode) return

  const customFoodsRef = collection(db, 'users', userId, 'customFoods')
  await addDoc(customFoodsRef, {
    ...food,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

/** Build DailySummary objects from an array of meals, grouped by dateKey. */
export function buildDailySummaries(
  userId: string,
  meals: Meal[]
): DailySummary[] {
  const grouped: Record<string, Meal[]> = {}

  for (const meal of meals) {
    if (!grouped[meal.dateKey]) grouped[meal.dateKey] = []
    grouped[meal.dateKey].push(meal)
  }

  return Object.entries(grouped)
    .map(([dateKey, dateMeals]) => ({
      dateKey,
      userId,
      meals: dateMeals,
      totalMacros: sumMacros(dateMeals.map((m) => m.totalMacros)),
      mealCount: dateMeals.length,
      mealTypes: [...new Set(dateMeals.map((m) => m.mealType))],
    }))
    .sort((a, b) => b.dateKey.localeCompare(a.dateKey))
}
