import type { WorkoutProgram } from '../types/workout'
import { uid } from '../types/workout'

export function createDefaultProgram(locale = 'tr'): WorkoutProgram {
  const now = new Date().toISOString()
  const isEN = locale === 'en'

  return {
    id: 'main',
    name: isEN ? 'Makrofy Starter Program' : 'Makrofy Başlangıç Programı',
    source: 'makrofy',
    days: [
      {
        id: uid(),
        dayName: isEN ? 'Monday' : 'Pazartesi',
        exercises: [
          { id: uid(), name: 'Squat', sets: 3, reps: 10, defaultWeight: 0, note: '' },
          { id: uid(), name: 'Bench Press', sets: 3, reps: 10, defaultWeight: 0, note: '' },
          { id: uid(), name: 'Lat Pulldown', sets: 3, reps: 10, defaultWeight: 0, note: '' },
          { id: uid(), name: 'Shoulder Press', sets: 3, reps: 10, defaultWeight: 0, note: '' },
        ],
      },
      {
        id: uid(),
        dayName: isEN ? 'Wednesday' : 'Çarşamba',
        exercises: [
          { id: uid(), name: 'Romanian Deadlift', sets: 3, reps: 10, defaultWeight: 0, note: '' },
          { id: uid(), name: 'Incline Dumbbell Press', sets: 3, reps: 10, defaultWeight: 0, note: '' },
          { id: uid(), name: 'Seated Row', sets: 3, reps: 10, defaultWeight: 0, note: '' },
          { id: uid(), name: 'Leg Press', sets: 3, reps: 12, defaultWeight: 0, note: '' },
        ],
      },
      {
        id: uid(),
        dayName: isEN ? 'Friday' : 'Cuma',
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
