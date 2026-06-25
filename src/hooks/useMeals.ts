import { useState, useEffect, useCallback, useRef } from 'react'
import type { Meal, FoodItem, DailySummary, MealFormData, MealType } from '../types/meal'
import type { MacroNutrients } from '../types/nutrition'
import { sumMacros, EMPTY_MACROS } from '../types/nutrition'
import {
  getMealsByDate,
  getMealHistory,
  createMeal,
  deleteMeal as removeMeal,
  buildDailySummaries,
  drainOfflineQueueMeals,
} from '../services/mealService'
import { getToday } from '../utils/date'
import { getOptimisticMeals } from '../services/optimisticMeals'
import { getQueuedMealsForDate } from '../services/offlineQueue'

const HISTORY_WINDOW_DAYS = 14
const HISTORY_CACHE_TTL_MS = 60_000

// ─── Today meals cache ──────────────────────────────────────────────────────
// Keyed by `${userId}:${dateKey}`. Avoids the flash-of-zero on app open when
// the Cloud Function fetch hasn't resolved yet (native iOS has no Firestore
// offline cache because it uses HTTP calls instead of the Web SDK).
const todayCache = new Map<string, { meals: Meal[]; macros: MacroNutrients; fetchedAt: number }>()

// ─── Persistent localStorage cache ─────────────────────────────────────────
// Survives app restarts — used as the initial state when the module cache is
// empty and the network hasn't responded yet (i.e. first render while offline).
const PERSIST_KEY = (cacheKey: string) => `makrofy_today_v2_${cacheKey}`

function loadPersistedMeals(cacheKey: string): Meal[] | null {
  try {
    const raw = localStorage.getItem(PERSIST_KEY(cacheKey))
    return raw ? (JSON.parse(raw) as Meal[]) : null
  } catch {
    return null
  }
}

function persistTodayMeals(cacheKey: string, meals: Meal[]): void {
  try {
    localStorage.setItem(PERSIST_KEY(cacheKey), JSON.stringify(meals))
  } catch {
    // localStorage quota exceeded — ignore
  }
}

/**
 * Merge two meal lists by id, with `overlay` winning on duplicate ids, then
 * sort newest-first by `createdAt` to match `getMealsByDate`'s ordering.
 * Used to surface optimistic (in-flight) meals on top of fetched/cached ones.
 */
function mergeMealsById(base: Meal[], overlay: Meal[]): Meal[] {
  if (overlay.length === 0) return base
  const byId = new Map<string, Meal>()
  for (const m of base) byId.set(m.id, m)
  for (const m of overlay) byId.set(m.id, m)
  return Array.from(byId.values()).sort((a, b) =>
    String(b.createdAt).localeCompare(String(a.createdAt))
  )
}

const historyCache = new Map<string, {
  meals: Meal[]
  summaries: DailySummary[]
  fetchedAt: number
}>()

export function useTodayMeals(userId: string | undefined) {
  const today = getToday()
  const cacheKey = userId ? `${userId}:${today}` : null
  const initialCache = cacheKey ? todayCache.get(cacheKey) : undefined

  // Initial meals: memory cache → localStorage → offline queue → empty
  const [meals, setMeals] = useState<Meal[]>(() => {
    if (initialCache?.meals) return initialCache.meals
    const persisted = cacheKey ? loadPersistedMeals(cacheKey) : null
    const queued = cacheKey ? getQueuedMealsForDate(today) : []
    const base = persisted ?? []
    return queued.length > 0 ? mergeMealsById(base, queued) : base
  })
  const [todayMacros, setTodayMacros] = useState<MacroNutrients>(() => {
    if (initialCache?.macros) return initialCache.macros
    const persisted = cacheKey ? loadPersistedMeals(cacheKey) : null
    const queued = cacheKey ? getQueuedMealsForDate(today) : []
    const base = persisted ?? []
    const all = queued.length > 0 ? mergeMealsById(base, queued) : base
    return all.length > 0 ? sumMacros(all.map((m) => m.totalMacros)) : EMPTY_MACROS
  })
  const [loading, setLoading] = useState(!initialCache)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)
  const mealsRef = useRef<Meal[]>(initialCache?.meals ?? [])

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  // Keep a live ref of the current meals so `refresh` can merge optimistic
  // meals on top of whatever is already on screen without re-creating itself.
  useEffect(() => {
    mealsRef.current = meals
  }, [meals])

  const refresh = useCallback(async () => {
    if (!userId) {
      if (!mountedRef.current) return
      setMeals([])
      setTodayMacros(EMPTY_MACROS)
      setError(null)
      setLoading(false)
      return
    }
    const key = `${userId}:${today}`
    // Show any optimistic (in-flight) meals immediately, before the network
    // fetch resolves — this is what makes a saved meal appear single-tap fast.
    const pending = getOptimisticMeals(today)
    if (pending.length > 0) {
      const merged = mergeMealsById(mealsRef.current, pending)
      setMeals(merged)
      setTodayMacros(sumMacros(merged.map((m) => m.totalMacros)))
    }
    // Only show the full-screen loading state when there is nothing to display
    // yet (no cache, no optimistic meals). A background refresh must never hide
    // already-visible content.
    const hasCachedData = (todayCache.get(key)?.meals.length ?? 0) > 0
    if (mealsRef.current.length === 0 && pending.length === 0 && !hasCachedData) {
      setLoading(true)
    }
    setError(null)
    try {
      const todayMeals = await getMealsByDate(userId, today)
      if (!mountedRef.current) return
      // Reconcile fetched (real) meals with any still-pending optimistic / queued ones.
      const stillPending = getOptimisticMeals(today)
      const queued = getQueuedMealsForDate(today)
      const merged = mergeMealsById(todayMeals, [...queued, ...stillPending])
      const macros = sumMacros(merged.map((m) => m.totalMacros))
      setMeals(merged)
      setTodayMacros(macros)
      todayCache.set(key, { meals: merged, macros, fetchedAt: Date.now() })
      // Persist to localStorage so the list is available on the next cold start
      persistTodayMeals(key, merged)
    } catch (err) {
      if (!mountedRef.current) return
      console.error('[useTodayMeals] fetch failed', err)
      // Keep cached / persisted / offline-queued meals visible when offline.
      const stillPending = getOptimisticMeals(today)
      const queued = getQueuedMealsForDate(today)
      const persisted = loadPersistedMeals(key) ?? []
      const visible = mergeMealsById(persisted, [...queued, ...stillPending])
      setMeals(visible)
      setTodayMacros(sumMacros(visible.map((m) => m.totalMacros)))
      setError(err instanceof Error ? err.message : 'Could not load meals.')
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [userId, today])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    const handleRefresh = () => {
      void refresh()
    }
    const handleResume = () => {
      // On app resume, drain any queued offline saves if we're now online
      if (userId && navigator.onLine) {
        drainOfflineQueueMeals(userId).catch(() => {})
      }
      void refresh()
    }
    // When connectivity returns: drain the offline queue then refresh the list.
    const handleOnline = () => {
      if (userId) {
        drainOfflineQueueMeals(userId).catch(() => {})
      }
      void refresh()
    }
    window.addEventListener('makrofy:meals-updated', handleRefresh)
    window.addEventListener('focus', handleRefresh)
    window.addEventListener('app:resume', handleResume)
    window.addEventListener('app:online', handleOnline)
    return () => {
      window.removeEventListener('makrofy:meals-updated', handleRefresh)
      window.removeEventListener('focus', handleRefresh)
      window.removeEventListener('app:resume', handleResume)
      window.removeEventListener('app:online', handleOnline)
    }
  }, [refresh, userId])

  const addManualMeal = useCallback(
    async (data: MealFormData) => {
      if (!userId) return null
      const meal = await createMeal(userId, data)
      await refresh()
      return meal
    },
    [userId, refresh]
  )

  const addScanMeal = useCallback(
    async (
      items: FoodItem[],
      mealType: MealType = 'lunch',
      imageUrl?: string
    ) => {
      if (!userId) return null
      const meal = await createMeal(userId, {
        items,
        totalMacros: sumMacros(items.map((i) => i.macros)),
        mealType,
        source: 'ai_scan',
        dateKey: getToday(),
        ...(imageUrl && { imageUrl }),
      })
      await refresh()
      return meal
    },
    [userId, refresh]
  )

  const deleteMeal = useCallback(
    async (mealId: string) => {
      if (!userId) return
      await removeMeal(userId, mealId)
      await refresh()
    },
    [userId, refresh]
  )

  return {
    meals,
    todayMacros,
    loading,
    error,
    addManualMeal,
    addScanMeal,
    deleteMeal,
    refresh,
  }
}

export function useMealHistory(userId: string | undefined) {
  const initialCache = userId ? historyCache.get(userId) : undefined
  const [summaries, setSummaries] = useState<DailySummary[]>(initialCache?.summaries ?? [])
  const [allMeals, setAllMeals] = useState<Meal[]>(initialCache?.meals ?? [])
  const [loading, setLoading] = useState(!initialCache)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)
  const inFlightRef = useRef(false)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const refresh = useCallback(async (force = false) => {
    if (!userId) {
      if (!mountedRef.current) return
      setSummaries([])
      setAllMeals([])
      setError(null)
      setLoading(false)
      return
    }

    if (inFlightRef.current) return

    const cached = historyCache.get(userId)
    const hasFreshCache = cached && Date.now() - cached.fetchedAt < HISTORY_CACHE_TTL_MS
    if (cached) {
      setAllMeals(cached.meals)
      setSummaries(cached.summaries)
      setLoading(false)
      if (hasFreshCache && !force) return
    }

    inFlightRef.current = true
    if (!cached) setLoading(true)
    setError(null)
    try {
      const end = getToday()
      const start = new Date()
      start.setDate(start.getDate() - HISTORY_WINDOW_DAYS)
      const startKey = [
        start.getFullYear(),
        String(start.getMonth() + 1).padStart(2, '0'),
        String(start.getDate()).padStart(2, '0'),
      ].join('-')

      if (import.meta.env.DEV) {
        console.debug('[useMealHistory] fetch start', {
          currentUid: userId,
          queryPath: `users/${userId}/meals`,
          startKey,
          end,
        })
      }
      const meals = await getMealHistory(userId, startKey, end)
      if (!mountedRef.current) return
      const nextSummaries = buildDailySummaries(userId, meals)
      historyCache.set(userId, {
        meals,
        summaries: nextSummaries,
        fetchedAt: Date.now(),
      })
      setAllMeals(meals)
      setSummaries(nextSummaries)
      if (import.meta.env.DEV) {
        console.debug('[useMealHistory] fetch success', {
          currentUid: userId,
          fetchedCount: meals.length,
        })
      }
    } catch (err) {
      if (!mountedRef.current) return
      console.error('[useMealHistory] fetch failed', {
        currentUid: userId,
        error: err,
      })
      setAllMeals([])
      setSummaries([])
      setError(err instanceof Error ? err.message : 'Could not load meal history.')
    } finally {
      inFlightRef.current = false
      if (mountedRef.current) setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    const forceRefresh = () => refresh(true)
    const softRefresh = () => refresh(false)
    window.addEventListener('makrofy:meals-updated', forceRefresh)
    window.addEventListener('focus', softRefresh)
    window.addEventListener('app:resume', softRefresh)
    return () => {
      window.removeEventListener('makrofy:meals-updated', forceRefresh)
      window.removeEventListener('focus', softRefresh)
      window.removeEventListener('app:resume', softRefresh)
    }
  }, [refresh])

  const deleteMeal = useCallback(
    async (mealId: string) => {
      if (!userId) return
      await removeMeal(userId, mealId)
      historyCache.delete(userId)
      await refresh(true)
    },
    [userId, refresh]
  )

  return { summaries, allMeals, loading, error, deleteMeal, refresh }
}
