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
    window.addEventListener('makrofy:meals-updated', refresh)
    window.addEventListener('focus', refresh)
    window.addEventListener('app:resume', refresh)
    return () => {
      window.removeEventListener('makrofy:meals-updated', refresh)
      window.removeEventListener('focus', refresh)
      window.removeEventListener('app:resume', refresh)
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
  const [summaries, setSummaries] = useState<DailySummary[]>([])
  const [allMeals, setAllMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const refresh = useCallback(async () => {
    if (!userId) {
      if (!mountedRef.current) return
      setSummaries([])
      setAllMeals([])
      setError(null)
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      // Fetch last 30 days of history by default
      const end = new Date().toISOString().split('T')[0]
      const start = new Date()
      start.setDate(start.getDate() - 30)
      const startKey = start.toISOString().split('T')[0]

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
      setAllMeals(meals)
      setSummaries(buildDailySummaries(userId, meals))
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
      if (mountedRef.current) setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    window.addEventListener('makrofy:meals-updated', refresh)
    window.addEventListener('focus', refresh)
    window.addEventListener('app:resume', refresh)
    return () => {
      window.removeEventListener('makrofy:meals-updated', refresh)
      window.removeEventListener('focus', refresh)
      window.removeEventListener('app:resume', refresh)
    }
  }, [refresh])

  const deleteMeal = useCallback(
    async (mealId: string) => {
      if (!userId) return
      await removeMeal(userId, mealId)
      await refresh()
    },
    [userId, refresh]
  )

  return { summaries, allMeals, loading, error, deleteMeal, refresh }
}
