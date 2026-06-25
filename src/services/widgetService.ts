import { Capacitor, registerPlugin } from '@capacitor/core'
import type { MacroNutrients } from '../types/nutrition'
import { getToday } from '../utils/date'
import { getProgram } from './workoutService'
import type { WorkoutProgram, ProgramDay } from '../types/workout'
import type { AIProgram, AIProgramWorkoutDay } from '../types/aiProgram'

interface WidgetGoal {
  calories: number
  protein: number
  carbs: number
  fat: number
}

interface WidgetUpdatePayload {
  isPro: boolean
  calories: number
  protein: number
  carbs: number
  fat: number
  steps: number
  burnedCalories: number
  calorieGoal: number
  proteinGoal: number
  carbsGoal: number
  fatGoal: number
  remainingCalories: number
  workoutNote?: string
  updatedAt: string
  /** Local day key (YYYY-MM-DD) these totals belong to, so the widget can
   *  detect a rolled-over day and avoid showing yesterday's stale numbers. */
  dateKey: string
}

interface MakrofyWidgetPlugin {
  update(data: WidgetUpdatePayload): Promise<void>
}

const MakrofyWidget = registerPlugin<MakrofyWidgetPlugin>('MakrofyWidget')

export async function syncMakrofyWidget(
  isPro: boolean,
  macros: MacroNutrients,
  goal: WidgetGoal,
  activity?: { steps: number; caloriesBurned: number },
  workoutNote?: string
): Promise<void> {
  if (!Capacitor.isNativePlatform()) return

  const calories = Math.round(macros.calories)
  const protein = Math.round(macros.protein)
  const carbs = Math.round(macros.carbs)
  const fat = Math.round(macros.fat)
  const calorieGoal = Math.round(goal.calories)

  try {
    await MakrofyWidget.update({
      isPro,
      calories,
      protein,
      carbs,
      fat,
      steps: Math.max(0, Math.round(activity?.steps ?? 0)),
      burnedCalories: Math.max(0, Math.round(activity?.caloriesBurned ?? 0)),
      calorieGoal,
      proteinGoal: Math.round(goal.protein),
      carbsGoal: Math.round(goal.carbs),
      fatGoal: Math.round(goal.fat),
      remainingCalories: Math.max(0, calorieGoal - calories),
      ...(workoutNote && { workoutNote }),
      updatedAt: new Date().toISOString(),
      dateKey: getToday(),
    })
  } catch (err) {
    console.warn('[Widget] sync failed:', err)
  }
}

export async function getTodayWorkoutWidgetNote(userId: string | undefined): Promise<string> {
  if (!userId) return ''

  const [trackerProgram, aiProgram] = await Promise.all([
    getProgram(userId).catch(() => null),
    Promise.resolve(readCachedAIProgram(userId)),
  ])

  const trackerLabel = trackerProgram ? labelFromWorkoutProgram(trackerProgram) : ''
  if (trackerLabel) return `Bugün: ${trackerLabel}`

  const aiLabel = aiProgram?.isActive ? labelFromAIProgram(aiProgram) : ''
  return aiLabel ? `Bugün: ${aiLabel}` : ''
}

function readCachedAIProgram(userId: string): AIProgram | null {
  try {
    const raw = localStorage.getItem(`makrofy_ai_program_${userId}`)
    return raw ? (JSON.parse(raw) as AIProgram) : null
  } catch {
    return null
  }
}

function todayIndex(): number {
  const day = new Date().getDay()
  return day === 0 ? 6 : day - 1
}

function pickToday<T>(days: T[]): T | null {
  if (days.length === 0) return null
  return days[todayIndex() % days.length] ?? null
}

function labelFromWorkoutProgram(program: WorkoutProgram): string {
  const day = pickToday<ProgramDay>(program.days)
  if (!day) return ''
  return normalizeWorkoutLabel(day.dayName || day.exercises[0]?.name || program.name)
}

function labelFromAIProgram(program: AIProgram): string {
  const day = pickToday<AIProgramWorkoutDay>(program.workoutPlan?.weeklyPlan ?? [])
  if (!day) return ''
  return normalizeWorkoutLabel(day.focus || day.day || day.exercises[0]?.name || program.targetSummary)
}

function normalizeWorkoutLabel(raw: string | undefined): string {
  const text = (raw ?? '').replace(/\s+/g, ' ').trim()
  if (!text) return ''

  const lower = text.toLocaleLowerCase('tr-TR')
  if (/\b(push|itiş|gogus|göğüs|chest|press)\b/.test(lower)) return 'İtiş günü'
  if (/\b(pull|çekiş|cekis|sırt|back|row)\b/.test(lower)) return 'Çekiş günü'
  if (/\b(leg|legs|bacak|alt vücut|lower)\b/.test(lower)) return 'Bacak günü'
  if (/\b(rest|dinlenme|recovery|aktif dinlenme)\b/.test(lower)) return 'Dinlenme günü'
  if (/\b(cardio|kardiyo)\b/.test(lower)) return 'Kardiyo günü'
  if (/\b(full body|tüm vücut|tum vucut)\b/.test(lower)) return 'Tüm vücut'

  return text.length > 34 ? `${text.slice(0, 33).trim()}…` : text
}
