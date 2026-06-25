import { Capacitor, registerPlugin } from '@capacitor/core'

export interface PedometerSummary {
  available: boolean
  steps: number
  distanceMeters: number
  caloriesBurned: number
  /** Which native source served the data — HealthKit is the accurate one. */
  source?: 'healthkit' | 'coremotion'
  errorMessage?: string
}

interface NativePedometerResult {
  available: boolean
  steps?: number
  distanceMeters?: number
  source?: 'healthkit' | 'coremotion'
  errorMessage?: string
}

interface MakrofyPedometerPlugin {
  getToday(): Promise<NativePedometerResult>
}

const MakrofyPedometer = registerPlugin<MakrofyPedometerPlugin>('MakrofyPedometer')

const DEFAULT_WEIGHT_KG = 75
const FALLBACK_STEP_LENGTH_METERS = 0.762
const WALKING_KCAL_PER_KG_PER_KM = 0.55

function estimateWalkingCalories(steps: number, distanceMeters: number, weightKg: number): number {
  const distanceKm = distanceMeters > 0
    ? distanceMeters / 1000
    : (steps * FALLBACK_STEP_LENGTH_METERS) / 1000

  return Math.max(0, Math.round(distanceKm * weightKg * WALKING_KCAL_PER_KG_PER_KM))
}

export async function getTodayPedometerSummary(weightKg = DEFAULT_WEIGHT_KG): Promise<PedometerSummary> {
  if (!Capacitor.isNativePlatform()) {
    return {
      available: false,
      steps: 0,
      distanceMeters: 0,
      caloriesBurned: 0,
      errorMessage: 'Pedometer is only available on device.',
    }
  }

  try {
    const result = await MakrofyPedometer.getToday()
    const steps = Math.max(0, Math.round(result.steps ?? 0))
    const distanceMeters = Math.max(0, Math.round(result.distanceMeters ?? 0))

    if (import.meta.env.DEV) {
      console.log('[pedometer] source:', result.source ?? 'unknown', 'steps:', steps)
    }

    return {
      available: result.available,
      steps,
      distanceMeters,
      caloriesBurned: estimateWalkingCalories(steps, distanceMeters, weightKg),
      source: result.source,
      errorMessage: result.errorMessage,
    }
  } catch (err) {
    return {
      available: false,
      steps: 0,
      distanceMeters: 0,
      caloriesBurned: 0,
      errorMessage: err instanceof Error ? err.message : 'Could not read pedometer data.',
    }
  }
}
