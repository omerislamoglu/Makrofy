/**
 * useNotificationScheduler — Yerel bildirimleri planlamayı yöneten hook
 *
 * AppShell içinde tek sefer mount edilir. Şu durumlarda tüm bildirimleri
 * yeniden planlar:
 *   - mount (uygulama açılışı)
 *   - app:resume (uygulama öne geldiğinde)
 *   - kullanıcı verileri değiştiğinde (öğünler, hedef, dil, tercihler)
 *
 * Web ortamında notificationService no-op yaptığı için zararsızdır.
 */

import { useEffect, useRef } from 'react'
import { useAuth } from './useAuth'
import { useTodayMeals } from './useMeals'
import { useLocale } from '../contexts/LocaleContext'
import { rescheduleAll, type NotificationContext } from '../services/notificationService'
import type { AIProgram } from '../types/aiProgram'

function loadProgram(uid: string | undefined): AIProgram | null {
  if (!uid) return null
  try {
    const raw = localStorage.getItem(`makrofy_ai_program_${uid}`)
    if (!raw) return null
    return JSON.parse(raw) as AIProgram
  } catch {
    return null
  }
}

export function useNotificationScheduler() {
  const { user } = useAuth()
  const { locale } = useLocale()
  const { meals, todayMacros } = useTodayMeals(user?.uid)

  // En güncel context'i ref'te tut; resume listener stale closure'a düşmesin.
  const ctxRef = useRef<NotificationContext | null>(null)

  useEffect(() => {
    if (!user) {
      ctxRef.current = null
      return
    }

    const program = loadProgram(user.uid)
    const dailyCalories = user.dailyGoal?.calories ?? 0
    const remainingToday = Math.max(0, dailyCalories - (todayMacros?.calories ?? 0))
    const goal = user.bodyMetrics?.goal ?? 'lose_weight'

    const ctx: NotificationContext = {
      locale,
      prefs: {
        calorieReminder: user.calorieReminder ?? true,
        streakReminder: user.streakReminder ?? true,
        dailyMotivation: user.dailyMotivation ?? true,
        workoutReminder: user.workoutReminder ?? true,
        evaluationReminder: user.evaluationReminder ?? true,
        mealReminders: user.mealReminders ?? false,
      },
      goal,
      dailyCalories,
      remainingToday,
      mealsLoggedToday: (meals?.length ?? 0) > 0,
      program,
    }
    ctxRef.current = ctx

    void rescheduleAll(ctx)
  }, [
    user,
    locale,
    meals?.length,
    todayMacros?.calories,
  ])

  // app:resume → en güncel context ile yeniden planla.
  useEffect(() => {
    const handler = () => {
      const cur = ctxRef.current
      if (cur) void rescheduleAll(cur)
    }
    window.addEventListener('app:resume', handler)
    return () => window.removeEventListener('app:resume', handler)
  }, [])
}
