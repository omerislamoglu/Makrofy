/**
 * notificationService — Yerel bildirim zamanlama servisi
 *
 * @capacitor/local-notifications üzerinden 6 bildirim türünü yönetir:
 *   A  (calorieReminder)    — Günlük kalori bütçesi hatırlatması (akşam)
 *   B2 (streakReminder)     — Seri hatırlatması (bugün öğün girilmediyse)
 *   B4 (dailyMotivation)    — Sabah motivasyonu + günlük hedef
 *   C6 (weeklySummary)      — Haftalık özet (Pazar akşamı)
 *   D7 (workoutReminder)    — Antrenman günü hatırlatması
 *   D8 (evaluationReminder) — 2 haftalık değerlendirme hatırlatması
 *
 * Model: "reschedule-on-foreground". Uygulama her öne geldiğinde / veriler
 * değiştiğinde tüm bildirimlerimiz iptal edilip yeniden planlanır. Her tür
 * sabit ID aralığı kullanır; böylece çakışma olmaz ve tekrar planlama
 * idempotent kalır.
 *
 * Web ortamında tüm çağrılar güvenle no-op yapar.
 */

import { Capacitor } from '@capacitor/core'
import { getStrings, type AppLocale } from '../i18n'
import type { AIProgram } from '../types/aiProgram'
import type { FitnessGoal } from '../types/user'

const isNative = Capacitor.isNativePlatform()

// ─── Sabit ID aralıkları (tür başına 7 gün) ──────────────────────────────────
const ID = {
  calorie: 1000,    // A  : 1000–1006
  streak: 1100,     // B2 : 1100–1106
  motivation: 1200, // B4 : 1200–1206
  weekly: 1300,     // C6 : 1300
  workout: 1400,    // D7 : 1400–1406
  evaluation: 1500, // D8 : 1500
  mealLunch: 1600,  // E  : 1600–1606 (öğle öğün hatırlatması)
  mealDinner: 1700, // E  : 1700–1706 (akşam öğün hatırlatması)
}

// Yönettiğimiz tüm olası ID'ler — iptal için kullanılır.
const ALL_MANAGED_IDS: number[] = (() => {
  const ids: number[] = []
  for (let i = 0; i < 7; i++) {
    ids.push(
      ID.calorie + i, ID.streak + i, ID.motivation + i, ID.workout + i,
      ID.mealLunch + i, ID.mealDinner + i
    )
  }
  ids.push(ID.weekly, ID.evaluation)
  return ids
})()

const DAY_MS = 24 * 60 * 60 * 1000
const SCHEDULE_DAYS = 7

// ─── Bağlam ──────────────────────────────────────────────────────────────────
export interface NotificationPrefs {
  calorieReminder?: boolean
  streakReminder?: boolean
  dailyMotivation?: boolean
  workoutReminder?: boolean
  evaluationReminder?: boolean
  mealReminders?: boolean
}

export interface NotificationContext {
  locale: AppLocale
  prefs: NotificationPrefs
  goal: FitnessGoal             // lose_weight | maintain | gain_weight
  dailyCalories: number         // günlük kalori hedefi
  remainingToday: number        // bugün kalan kalori (canlı)
  mealsLoggedToday: boolean     // bugün en az bir öğün girildi mi
  program: AIProgram | null     // aktif AI programı (D7/D8 için)
}

// ─── Plugin yükleyici ────────────────────────────────────────────────────────
type LocalNotificationsPlugin =
  typeof import('@capacitor/local-notifications')['LocalNotifications']

let pluginPromise: Promise<LocalNotificationsPlugin | null> | null = null

async function getPlugin(): Promise<LocalNotificationsPlugin | null> {
  if (!isNative) return null
  if (!pluginPromise) {
    pluginPromise = import('@capacitor/local-notifications')
      .then((m) => m.LocalNotifications)
      .catch((err) => {
        console.warn('[notif] plugin import failed:', err)
        return null
      })
  }
  return pluginPromise
}

// ─── İzin ────────────────────────────────────────────────────────────────────
export async function checkPermission(): Promise<boolean> {
  const plugin = await getPlugin()
  if (!plugin) return false
  try {
    const res = await plugin.checkPermissions()
    return res.display === 'granted'
  } catch {
    return false
  }
}

/** İzin iste (kullanıcı bir toggle'ı açtığında). Verildi mi döner. */
export async function ensurePermission(): Promise<boolean> {
  const plugin = await getPlugin()
  if (!plugin) return false
  try {
    const current = await plugin.checkPermissions()
    if (current.display === 'granted') return true
    if (current.display === 'denied') return false
    const req = await plugin.requestPermissions()
    return req.display === 'granted'
  } catch {
    return false
  }
}

// ─── Zaman yardımcıları ──────────────────────────────────────────────────────
/** Bugünden `offset` gün sonrasının verilen saat/dakikasını döner. */
function dayAt(offset: number, hour: number, minute: number): Date {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  d.setHours(hour, minute, 0, 0)
  return d
}

/** Verilen tarih geçmişte mi (artık planlanmamalı)? */
function isPast(date: Date): boolean {
  return date.getTime() <= Date.now() + 60 * 1000 // 1dk tampon
}

interface ScheduledItem {
  id: number
  title: string
  body: string
  at: Date
}

// ─── Antrenman günü haritalaması ─────────────────────────────────────────────
// AI programındaki gün metinleri yerelleştirilmiş olabildiğinden, haftalık
// antrenman günü sayısını standart bir hafta içi dağılımına eşliyoruz.
// 0 = Pazar … 6 = Cumartesi
const TRAINING_WEEKDAYS: Record<number, number[]> = {
  1: [1],
  2: [1, 4],
  3: [1, 3, 5],
  4: [1, 2, 4, 5],
  5: [1, 2, 3, 4, 5],
  6: [1, 2, 3, 4, 5, 6],
  7: [0, 1, 2, 3, 4, 5, 6],
}

function getTimestampMs(value: unknown): number | null {
  if (!value) return null
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const t = Date.parse(value)
    return Number.isNaN(t) ? null : t
  }
  if (typeof value === 'object') {
    const v = value as { seconds?: number; toMillis?: () => number; toDate?: () => Date }
    if (typeof v.toMillis === 'function') return v.toMillis()
    if (typeof v.toDate === 'function') return v.toDate().getTime()
    if (typeof v.seconds === 'number') return v.seconds * 1000
  }
  return null
}

// ─── Planlanacak bildirimleri hesapla ────────────────────────────────────────
function buildSchedule(ctx: NotificationContext): ScheduledItem[] {
  const t = getStrings(ctx.locale).notif
  const items: ScheduledItem[] = []

  // A — Kalori bütçesi hatırlatması (her akşam 18:00)
  if (ctx.prefs.calorieReminder) {
    const goalBody =
      ctx.goal === 'lose_weight' ? t.calorieBodyLose
        : ctx.goal === 'gain_weight' ? t.calorieBodyGain
          : t.calorieBodyMaintain
    for (let i = 0; i < SCHEDULE_DAYS; i++) {
      const at = dayAt(i, 18, 0)
      if (isPast(at)) continue
      // Bugünkü bildirimde canlı kalan kaloriyi kullan (anlamlıysa).
      const body =
        i === 0 && ctx.remainingToday > 0
          ? t.calorieBodyRemaining(Math.round(ctx.remainingToday))
          : goalBody
      items.push({ id: ID.calorie + i, title: t.calorieTitle, body, at })
    }
  }

  // B2 — Seri hatırlatması (her akşam 20:00). Bugün öğün girildiyse bugünü atla.
  if (ctx.prefs.streakReminder) {
    for (let i = 0; i < SCHEDULE_DAYS; i++) {
      if (i === 0 && ctx.mealsLoggedToday) continue
      const at = dayAt(i, 20, 0)
      if (isPast(at)) continue
      items.push({ id: ID.streak + i, title: t.streakTitle, body: t.streakBody, at })
    }
  }

  // B4 — Sabah motivasyonu (her sabah 08:00) + günlük hedef
  if (ctx.prefs.dailyMotivation) {
    for (let i = 0; i < SCHEDULE_DAYS; i++) {
      const at = dayAt(i, 8, 0)
      if (isPast(at)) continue
      items.push({
        id: ID.motivation + i,
        title: t.morningTitle,
        body: t.morningBody(Math.round(ctx.dailyCalories)),
        at,
      })
    }
  }

  // E — Öğün hatırlatması (öğle 12:30 + akşam 19:00). Bugün öğün girildiyse
  // o günün öğle hatırlatmasını atla (zaten kayıt yapmış).
  if (ctx.prefs.mealReminders) {
    for (let i = 0; i < SCHEDULE_DAYS; i++) {
      const lunch = dayAt(i, 12, 30)
      if (!isPast(lunch) && !(i === 0 && ctx.mealsLoggedToday)) {
        items.push({ id: ID.mealLunch + i, title: t.mealTitle, body: t.mealBody, at: lunch })
      }
      const dinner = dayAt(i, 19, 0)
      if (!isPast(dinner)) {
        items.push({ id: ID.mealDinner + i, title: t.mealTitle, body: t.mealBody, at: dinner })
      }
    }
  }

  // C6 (haftalık özet), D7 (antrenman) ve D8 (değerlendirme) ayrı build
  // fonksiyonlarında hesaplanır.
  return items
}

// Haftalık özet ayrı çünkü UserProfile.weeklySummary alanını kullanıyor.
function buildWeekly(ctx: NotificationContext, weeklyEnabled: boolean): ScheduledItem[] {
  if (!weeklyEnabled) return []
  const t = getStrings(ctx.locale).notif
  // Önümüzdeki Pazar 19:00
  const now = new Date()
  const daysUntilSunday = (7 - now.getDay()) % 7
  const offset = daysUntilSunday === 0 ? (now.getHours() >= 19 ? 7 : 0) : daysUntilSunday
  const at = dayAt(offset, 19, 0)
  if (isPast(at)) return []
  return [{ id: ID.weekly, title: t.weeklyTitle, body: t.weeklyBody, at }]
}

function buildWorkout(ctx: NotificationContext): ScheduledItem[] {
  if (!ctx.prefs.workoutReminder || !ctx.program?.isActive) return []
  const weekly = ctx.program.workoutPlan?.weeklyPlan ?? []
  if (weekly.length === 0) return []
  const t = getStrings(ctx.locale).notif

  const daysPerWeek = Math.min(7, Math.max(1, weekly.length))
  const weekdays = TRAINING_WEEKDAYS[daysPerWeek] ?? TRAINING_WEEKDAYS[3]
  const items: ScheduledItem[] = []

  for (let i = 0; i < SCHEDULE_DAYS; i++) {
    const at = dayAt(i, 7, 30)
    if (isPast(at)) continue
    const weekdayIdx = weekdays.indexOf(at.getDay())
    if (weekdayIdx === -1) continue
    const focus = weekly[weekdayIdx % weekly.length]?.focus ?? ''
    items.push({ id: ID.workout + i, title: t.workoutTitle, body: t.workoutBody(focus), at })
  }
  return items
}

function buildEvaluation(ctx: NotificationContext): ScheduledItem[] {
  if (!ctx.prefs.evaluationReminder || !ctx.program?.isActive) return []
  const t = getStrings(ctx.locale).notif
  const createdAtMs = getTimestampMs(ctx.program.createdAt)
  const intervalDays = ctx.program.evaluationIntervalDays ?? 14
  const nextMs =
    getTimestampMs(ctx.program.nextEvaluationAt) ??
    (createdAtMs ?? Date.now()) + intervalDays * DAY_MS
  const at = new Date(nextMs)
  at.setHours(10, 0, 0, 0)
  if (isPast(at)) return []
  return [{ id: ID.evaluation, title: t.evaluationTitle, body: t.evaluationBody, at }]
}

// ─── Ana planlama ────────────────────────────────────────────────────────────
let scheduling = false

/**
 * Tüm yönetilen bildirimleri iptal edip context'e göre yeniden planla.
 * `weeklyEnabled` UserProfile.weeklySummary'den gelir (C6).
 */
export async function rescheduleAll(
  ctx: NotificationContext,
  weeklyEnabled: boolean
): Promise<void> {
  const plugin = await getPlugin()
  if (!plugin) return
  if (scheduling) return
  scheduling = true
  try {
    // İzin yoksa hiçbir şey planlama (ama eski olanları temizle).
    const granted = await checkPermission()

    // Önce yönettiğimiz tüm bildirimleri iptal et.
    try {
      await plugin.cancel({ notifications: ALL_MANAGED_IDS.map((id) => ({ id })) })
    } catch (err) {
      console.warn('[notif] cancel failed:', err)
    }

    if (!granted) return

    const items = [
      ...buildSchedule(ctx),
      ...buildWeekly(ctx, weeklyEnabled),
      ...buildWorkout(ctx),
      ...buildEvaluation(ctx),
    ]

    if (items.length === 0) return

    await plugin.schedule({
      notifications: items.map((it) => ({
        id: it.id,
        title: it.title,
        body: it.body,
        schedule: { at: it.at, allowWhileIdle: true },
      })),
    })
  } catch (err) {
    console.warn('[notif] reschedule failed:', err)
  } finally {
    scheduling = false
  }
}

/** Tüm yönetilen bildirimleri iptal et (ör. çıkış yapınca). */
export async function cancelAll(): Promise<void> {
  const plugin = await getPlugin()
  if (!plugin) return
  try {
    await plugin.cancel({ notifications: ALL_MANAGED_IDS.map((id) => ({ id })) })
  } catch {
    // sessizce geç
  }
}
