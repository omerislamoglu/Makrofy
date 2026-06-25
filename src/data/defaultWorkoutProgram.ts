import type { WorkoutProgram } from '../types/workout'
import { uid } from '../types/workout'

interface ProgramLabels {
  name: string
  monday: string
  wednesday: string
  friday: string
}

const PROGRAM_LABELS: Record<string, ProgramLabels> = {
  tr: { name: 'Makrofy Başlangıç Programı', monday: 'Pazartesi', wednesday: 'Çarşamba', friday: 'Cuma' },
  en: { name: 'Makrofy Starter Program', monday: 'Monday', wednesday: 'Wednesday', friday: 'Friday' },
  de: { name: 'Makrofy Starterprogramm', monday: 'Montag', wednesday: 'Mittwoch', friday: 'Freitag' },
  fr: { name: 'Programme débutant Makrofy', monday: 'Lundi', wednesday: 'Mercredi', friday: 'Vendredi' },
  es: { name: 'Programa inicial de Makrofy', monday: 'Lunes', wednesday: 'Miércoles', friday: 'Viernes' },
  it: { name: 'Programma base Makrofy', monday: 'Lunedì', wednesday: 'Mercoledì', friday: 'Venerdì' },
}

export function createDefaultProgram(locale = 'tr'): WorkoutProgram {
  const now = new Date().toISOString()
  const L = PROGRAM_LABELS[locale] ?? PROGRAM_LABELS.en

  return {
    id: 'main',
    name: L.name,
    source: 'makrofy',
    days: [
      {
        id: uid(),
        dayName: L.monday,
        exercises: [
          { id: uid(), name: 'Squat', sets: 3, reps: 10, defaultWeight: 0, note: '' },
          { id: uid(), name: 'Bench Press', sets: 3, reps: 10, defaultWeight: 0, note: '' },
          { id: uid(), name: 'Lat Pulldown', sets: 3, reps: 10, defaultWeight: 0, note: '' },
          { id: uid(), name: 'Shoulder Press', sets: 3, reps: 10, defaultWeight: 0, note: '' },
        ],
      },
      {
        id: uid(),
        dayName: L.wednesday,
        exercises: [
          { id: uid(), name: 'Romanian Deadlift', sets: 3, reps: 10, defaultWeight: 0, note: '' },
          { id: uid(), name: 'Incline Dumbbell Press', sets: 3, reps: 10, defaultWeight: 0, note: '' },
          { id: uid(), name: 'Seated Row', sets: 3, reps: 10, defaultWeight: 0, note: '' },
          { id: uid(), name: 'Leg Press', sets: 3, reps: 12, defaultWeight: 0, note: '' },
        ],
      },
      {
        id: uid(),
        dayName: L.friday,
        exercises: [
          { id: uid(), name: 'Deadlift', sets: 3, reps: 6, defaultWeight: 0, note: '' },
          { id: uid(), name: 'Dumbbell Bench Press', sets: 3, reps: 10, defaultWeight: 0, note: '' },
          { id: uid(), name: 'Cable Row', sets: 3, reps: 10, defaultWeight: 0, note: '' },
          { id: uid(), name: 'Lateral Raise', sets: 3, reps: 12, defaultWeight: 0, note: '' },
        ],
      },
    ],
    createdAt: now,
    updatedAt: now,
  }
}
