// ─── Workout Types ──────────────────────────────────────────────────────────

// ── Program (Master Template) ───────────────────────────────────────────────

export interface ProgramExercise {
  id: string
  name: string
  sets: number
  reps: number
  defaultWeight: number  // kg — starting/target weight
  note: string
}

export interface ProgramDay {
  id: string
  dayName: string       // e.g. "Pazartesi", "Gün 1"
  exercises: ProgramExercise[]
}

export interface WorkoutProgram {
  id: string            // always "main" for now
  name: string
  source: 'custom' | 'makrofy'
  days: ProgramDay[]
  createdAt: string
  updatedAt: string
}

// ── Weekly Log (Instance) ───────────────────────────────────────────────────

export interface WeekExercise {
  id: string
  name: string
  sets: number
  reps: number
  weight: number        // kg — actual weight used this week
  note: string
  completed: boolean
  /** Previous week's weight for comparison */
  prevWeight?: number
}

export interface WeekDay {
  id: string
  dayName: string
  exercises: WeekExercise[]
}

export interface WorkoutWeek {
  id: string            // format "2026-W22"
  weekStartDate: string // ISO date of Monday
  sourceProgramId: string
  days: WeekDay[]
  createdAt: string
  updatedAt: string
}

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Generate a unique ID */
export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

/** ISO week ID from a Date */
export function weekIdFromDate(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`
}

/** Get the Monday of the ISO week containing `date` */
export function mondayOfWeek(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay() || 7
  d.setDate(d.getDate() - day + 1)
  d.setHours(0, 0, 0, 0)
  return d
}

/** Move a week date by +/- n weeks */
export function shiftWeek(monday: Date, n: number): Date {
  const d = new Date(monday)
  d.setDate(d.getDate() + n * 7)
  return d
}

/** Create a WorkoutWeek from a WorkoutProgram for the given Monday */
export function weekFromProgram(program: WorkoutProgram, monday: Date): WorkoutWeek {
  const now = new Date().toISOString()
  return {
    id: weekIdFromDate(monday),
    weekStartDate: monday.toISOString().slice(0, 10),
    sourceProgramId: program.id,
    days: program.days.map((day) => ({
      id: uid(),
      dayName: day.dayName,
      exercises: day.exercises.map((ex) => ({
        id: uid(),
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.defaultWeight,
        note: '',
        completed: false,
      })),
    })),
    createdAt: now,
    updatedAt: now,
  }
}

/** Merge previous week weights into current week for comparison display */
export function mergePrevWeights(current: WorkoutWeek, prev: WorkoutWeek | null): WorkoutWeek {
  if (!prev) return current
  const lookup = new Map<string, number>()
  for (const day of prev.days) {
    for (const ex of day.exercises) {
      lookup.set(`${day.dayName}::${ex.name}`, ex.weight)
    }
  }
  return {
    ...current,
    days: current.days.map((day) => ({
      ...day,
      exercises: day.exercises.map((ex) => ({
        ...ex,
        prevWeight: lookup.get(`${day.dayName}::${ex.name}`),
      })),
    })),
  }
}

/** Format week range "01.06 – 07.06" */
export function formatWeekRange(mondayISO: string): string {
  const mon = new Date(mondayISO + 'T00:00:00')
  const sun = new Date(mon)
  sun.setDate(sun.getDate() + 6)
  const fmt = (d: Date) =>
    `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}`
  return `${fmt(mon)} – ${fmt(sun)}`
}
