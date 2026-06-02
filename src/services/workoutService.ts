import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore'
import { db, isDemoMode } from './firebase'
import type { WorkoutProgram, WorkoutWeek } from '../types/workout'

// ─── Demo persistence (localStorage) ─────────────────────────────────────────

const DEMO_PROGRAM_KEY = (uid: string) => `makrofy_workout_program_${uid}`
const DEMO_WEEKS_KEY = (uid: string) => `makrofy_workout_weeks_${uid}`

function lsGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function lsSet(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value))
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function assertUserId(uid: string): void {
  if (!uid) throw new Error('workoutService: userId is required')
}

function programDoc(userId: string) {
  return doc(db, 'users', userId, 'workoutProgram', 'main')
}

function weekDoc(userId: string, weekId: string) {
  return doc(db, 'users', userId, 'workoutWeeks', weekId)
}

// ═════════════════════════════════════════════════════════════════════════════
// Program CRUD
// ═════════════════════════════════════════════════════════════════════════════

export async function getProgram(userId: string): Promise<WorkoutProgram | null> {
  assertUserId(userId)

  if (isDemoMode) {
    return lsGet<WorkoutProgram>(DEMO_PROGRAM_KEY(userId))
  }

  const snap = await getDoc(programDoc(userId))
  return snap.exists() ? (snap.data() as WorkoutProgram) : null
}

export async function saveProgram(userId: string, program: WorkoutProgram): Promise<void> {
  assertUserId(userId)

  const data: WorkoutProgram = { ...program, updatedAt: new Date().toISOString() }

  if (isDemoMode) {
    lsSet(DEMO_PROGRAM_KEY(userId), data)
    return
  }

  await setDoc(programDoc(userId), data)
}

export async function deleteProgram(userId: string): Promise<void> {
  assertUserId(userId)

  if (isDemoMode) {
    localStorage.removeItem(DEMO_PROGRAM_KEY(userId))
    return
  }

  await deleteDoc(programDoc(userId))
}

// ═════════════════════════════════════════════════════════════════════════════
// Week CRUD
// ═════════════════════════════════════════════════════════════════════════════

export async function getWeek(userId: string, weekId: string): Promise<WorkoutWeek | null> {
  assertUserId(userId)

  if (isDemoMode) {
    const store = lsGet<Record<string, WorkoutWeek>>(DEMO_WEEKS_KEY(userId)) ?? {}
    return store[weekId] ?? null
  }

  const snap = await getDoc(weekDoc(userId, weekId))
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as WorkoutWeek) : null
}

export async function saveWeek(userId: string, week: WorkoutWeek): Promise<void> {
  assertUserId(userId)

  const data: WorkoutWeek = { ...week, updatedAt: new Date().toISOString() }

  if (isDemoMode) {
    const store = lsGet<Record<string, WorkoutWeek>>(DEMO_WEEKS_KEY(userId)) ?? {}
    store[week.id] = data
    lsSet(DEMO_WEEKS_KEY(userId), store)
    return
  }

  await setDoc(weekDoc(userId, week.id), data)
}

export async function deleteWeek(userId: string, weekId: string): Promise<void> {
  assertUserId(userId)

  if (isDemoMode) {
    const store = lsGet<Record<string, WorkoutWeek>>(DEMO_WEEKS_KEY(userId)) ?? {}
    delete store[weekId]
    lsSet(DEMO_WEEKS_KEY(userId), store)
    return
  }

  await deleteDoc(weekDoc(userId, weekId))
}
