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
} from '../services/mealService'
import { getToday } from '../utils/date'

const HISTORY_WINDOW_DAYS = 14
const HISTORY_CACHE_TTL_MS = 60_000

const historyCache = new Map<string, {
  meals: Meal[]
  summaries: DailySummary[]
  fetchedAt: number
}>()

export function useTodayMeals(userId: string | undefined) {
  const [meals, setMeals] = useState<Meal[]>([])
  const [todayMacros, setTodayMacros] = useState<MacroNutrients>(EMPTY_MACROS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const today = getToday()

  const refresh = useCallback(async () => {
    if (!userId) {
      if (!mountedRef.current) return
      setMeals([])
      setTodayMacros(EMPTY_MACROS)
      setError(null)
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const todayMeals = await getMealsByDate(userId, today)
      if (!mountedRef.current) return
      setMeals(todayMeals)
      setTodayMacros(sumMacros(todayMeals.map((m) => m.totalMacros)))
    } catch (err) {
      if (!mountedRef.current) return
      console.error('[useTodayMeals] fetch failed', err)
      setMeals([])
      setTodayMacros(EMPTY_MACROS)
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
    window.addEventListener('makrofy:meals-updated', handleRefresh)
    window.addEventListener('focus', handleRefresh)
    window.addEventListener('app:resume', handleRefresh)
    return () => {
      window.removeEventListener('makrofy:meals-updated', handleRefresh)
      window.removeEventListener('focus', handleRefresh)
      window.removeEventListener('app:resume', handleRefresh)
    }
  }, [refresh])

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
