import {
  collection,
  doc,
  addDoc,
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
import { getFunctions, httpsCallable } from 'firebase/functions'
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

// ─── Demo persistence (localStorage) ─────────────────────────────────────────
// Without Firebase credentials the app runs in demo mode; persist meals locally
// so saving, the daily counter, and the meal list all work end-to-end.

const DEMO_MEALS_KEY = (userId: string) => `makrofy_meals_${userId}`

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
 * Create a new meal document under `users/{userId}/meals`.
 *
 * Accepts either a `MealFormData` (from the manual-entry form, where macros
 * are computed from per-100 g values) or a pre-built partial `Meal` (from
 * AI scan results where items already carry computed macros).
 */
export async function createMeal(
  userId: string,
  data: MealFormData | Omit<Meal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<Meal> {
  assertUserId(userId)

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
  const localMeal: Meal = {
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

  if (isDemoMode) {
    if (import.meta.env.DEV) {
      console.debug('[mealService] saveMeal demo write', {
        userId,
        path: `localStorage:${DEMO_MEALS_KEY(userId)}`,
        payload: localMeal,
      })
    }
    demoWriteMeals(userId, [localMeal, ...demoReadMeals(userId)])
    emitMealsUpdated()
    return localMeal
  }

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

  if (import.meta.env.DEV) {
    console.debug('[mealService] saveMeal start', {
      currentUserUid: userId,
      writePath: `users/${userId}/meals/{newMealId}`,
      payload: mealData,
    })
  }

  try {
    const ref = await addDoc(mealsCollection(userId), mealData)
    const remoteMeal = {
      ...localMeal,
      id: ref.id,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }
    if (import.meta.env.DEV) {
      console.debug('[mealService] saveMeal success', {
        documentId: ref.id,
        writePath: `users/${userId}/meals/${ref.id}`,
      })
    }
    emitMealsUpdated()
    return remoteMeal
  } catch (error) {
    console.error('[mealService] saveMeal write error', {
      currentUserUid: userId,
      writePath: `users/${userId}/meals/{newMealId}`,
      error: serializeError(error),
    })
    throw error
  }
}

export async function saveAIScanMeal(
  userId: string,
  data: SaveAIScanMealPayload,
  existingMealId?: string
): Promise<Meal> {
  assertUserId(userId)

  const localMeal = buildNormalizedMeal(userId, data, existingMealId || createId())

  if (isDemoMode) {
    const existingMeals = demoReadMeals(userId)
    const nextMeals = existingMealId
      ? [localMeal, ...existingMeals.filter((meal) => meal.id !== existingMealId)]
      : [localMeal, ...existingMeals]
    if (import.meta.env.DEV) {
      console.debug('[mealService] saveAIScanMeal demo write', {
        userId,
        path: `localStorage:${DEMO_MEALS_KEY(userId)}`,
        payload: localMeal,
      })
    }
    demoWriteMeals(userId, nextMeals)
    emitMealsUpdated()
    return localMeal
  }

  const requestData = {
    mealId: existingMealId,
    meal: {
      name: localMeal.name,
      items: localMeal.items,
      totalMacros: localMeal.totalMacros,
      mealType: localMeal.mealType,
      source: localMeal.source,
      ...(localMeal.imageUrl && { imageUrl: localMeal.imageUrl }),
      ...(localMeal.notes && { notes: localMeal.notes }),
      ...(localMeal.confidence && { confidence: localMeal.confidence }),
      dateKey: localMeal.dateKey,
    },
  }

  try {
    if (import.meta.env.DEV) {
      console.debug('[mealService] saveAIScanMeal start', {
        currentUserUid: userId,
        writePath: existingMealId
          ? `users/${userId}/meals/${existingMealId}`
          : `users/${userId}/meals/{cloudFunctionMealId}`,
        payload: requestData,
      })
    }
    let result: { success: boolean; mealId: string }
    if (Capacitor.isNativePlatform()) {
      const { FirebaseAuthentication } = await import('@capacitor-firebase/authentication')
      const [{ user: nativeUser }, { token }] = await Promise.all([
        FirebaseAuthentication.getCurrentUser(),
        FirebaseAuthentication.getIdToken({ forceRefresh: false }),
      ])
      if (import.meta.env.DEV) {
        console.debug('[AI_SAVE] native auth', {
          nativeUid: nativeUser?.uid,
          hasToken: Boolean(token),
          tokenPrefix: token ? `${token.slice(0, 12)}...` : null,
        })
      }
      if (!token) throw new Error('Native auth token is missing.')

      const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID
      if (!projectId) throw new Error('Firebase proje ayarı bulunamadı.')
      const region = import.meta.env.VITE_FIREBASE_FUNCTIONS_REGION || 'us-central1'
      const endpoint = `https://${region}-${projectId}.cloudfunctions.net/saveAnalyzedMeal`
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: requestData }),
      })
      const payload = await response.json().catch(() => null) as
        | { result?: { success: boolean; mealId: string }; error?: { message?: string; status?: string; details?: unknown } }
        | null
      if (!response.ok || payload?.error || !payload?.result?.mealId) {
        const error = new Error(payload?.error?.message || `saveAnalyzedMeal failed (${response.status}).`) as Error & {
          code?: string
          status?: string
          details?: unknown
        }
        error.code = payload?.error?.status || `http-${response.status}`
        error.status = payload?.error?.status
        error.details = payload?.error?.details
        throw error
      }
      result = payload.result
    } else {
      const saveMeal = httpsCallable<typeof requestData, { success: boolean; mealId: string }>(
        getFunctions(),
        'saveAnalyzedMeal'
      )
      const response = await saveMeal(requestData)
      result = response.data
    }

    const remoteMeal = { ...localMeal, id: result.mealId, updatedAt: Timestamp.now() }
    if (import.meta.env.DEV) {
      console.debug('[mealService] saveAIScanMeal success', {
        documentId: result.mealId,
        writePath: `users/${userId}/meals/${result.mealId}`,
      })
    }
    emitMealsUpdated()
    return remoteMeal
  } catch (error) {
    const details = serializeError(error)
    console.error('[mealService] AI scan save failed full error', details)
    throw error
  }
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

  const q = query(
    mealsCollection(userId),
    where('dateKey', '==', dateKey),
    orderBy('createdAt', 'desc')
  )

  try {
    if (import.meta.env.DEV) {
      console.debug('[mealService] HomePage fetch query', {
        currentUserUid: userId,
        path: `users/${userId}/meals`,
        where: { dateKey },
        orderBy: 'createdAt desc',
      })
    }
    const snap = await getDocs(q)
    const meals = snap.docs.map(docToMeal)
    if (import.meta.env.DEV) {
      console.debug('[mealService] HomePage fetched meal count', {
        count: meals.length,
        path: `users/${userId}/meals`,
      })
    }
    return meals
  } catch (error) {
    console.error('[mealService] Firestore day read failed', {
      currentUserUid: userId,
      path: `users/${userId}/meals`,
      where: { dateKey },
      error: serializeError(error),
    })
    throw error
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

  const constraints: QueryConstraint[] = [
    where('dateKey', '>=', startDate),
    where('dateKey', '<=', endDate),
    orderBy('dateKey', 'desc'),
    orderBy('createdAt', 'desc'),
  ]

  const q = query(mealsCollection(userId), ...constraints)
  try {
    if (import.meta.env.DEV) {
      console.debug('[mealService] HistoryPage fetch query', {
        currentUserUid: userId,
        path: `users/${userId}/meals`,
        where: { startDate, endDate },
        orderBy: ['dateKey desc', 'createdAt desc'],
      })
    }
    const snap = await getDocs(q)
    const meals = snap.docs.map(docToMeal).sort((a, b) =>
      a.dateKey === b.dateKey
        ? String(b.createdAt).localeCompare(String(a.createdAt))
        : b.dateKey.localeCompare(a.dateKey)
    )
    if (import.meta.env.DEV) {
      console.debug('[mealService] HistoryPage fetched meal count', {
        count: meals.length,
        path: `users/${userId}/meals`,
      })
    }
    return meals
  } catch (error) {
    console.error('[mealService] Firestore history read failed', {
      currentUserUid: userId,
      path: `users/${userId}/meals`,
      where: { startDate, endDate },
      error: serializeError(error),
    })
    throw error
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

  await deleteDoc(mealDoc(userId, mealId))
  emitMealsUpdated()
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
