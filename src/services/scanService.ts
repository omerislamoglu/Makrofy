import { scaleMacros } from '../types/nutrition'
import type { AIScanResult, ScanErrorCode } from '../types/scan'
import type { FoodItem } from '../types/meal'
import type { MealType } from '../types/meal'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { auth, isDemoMode, storage } from './firebase'
import { Capacitor } from '@capacitor/core'
import { getToday } from '../utils/date'
import { createId } from '../utils/id'

// ─── File Validation ───────────────────────────────────────────────────────

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB
const ACCEPTED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
])

export class ScanServiceError extends Error {
  readonly code: ScanErrorCode
  constructor(code: ScanErrorCode, message: string) {
    super(message)
    this.code = code
    this.name = 'ScanServiceError'
  }
}

function validateImageFile(file: File): void {
  // Check MIME type (also accept HEIC by extension since some browsers
  // report an empty type for .heic files)
  const isHeic = file.name.toLowerCase().endsWith('.heic') ||
    file.name.toLowerCase().endsWith('.heif')

  if (!ACCEPTED_MIME_TYPES.has(file.type) && !isHeic) {
    throw new ScanServiceError(
      'unsupported_format',
      `Unsupported format "${file.type || 'unknown'}". Please use JPEG, PNG, WebP, or HEIC.`
    )
  }

  if (file.size > MAX_FILE_SIZE) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1)
    throw new ScanServiceError(
      'image_too_large',
      `Image too large (${sizeMb} MB). Maximum size is 10 MB.`
    )
  }

  if (file.size === 0) {
    throw new ScanServiceError(
      'upload_failed',
      'The selected file is empty or corrupted.'
    )
  }
}

type AnalyzeMealFunctionResponse = {
  success: boolean
  mealId: string
  analysis: {
    mealName?: string
    items: AIScanResult['items']
    totalCalories: number
    protein: number
    carbs: number
    fat: number
    fiber: number
    confidence: AIScanResult['confidence']
    confidenceScore: number
    suggestedMealType: MealType
    processingTimeMs: number
    modelVersion?: string
    clarificationQuestions?: AIScanResult['clarificationQuestions']
    warnings?: string[]
    accuracyNote?: string
  }
}

// ─── Public API ────────────────────────────────────────────────────────────

/**
 * Analyze a meal image and return detected food items with macros.
 *
 * Uploads the image to Firebase Storage, then calls the Cloud Function that
 * runs the real vision model. Server-side code may still protect against
 * provider abuse, but there is no free/pro scan entitlement gate.
 *
 * @throws {ScanServiceError} on validation or analysis failure
 */
export async function analyzeMealImage(
  file: File,
  options: { mealTypeHint?: MealType; gramNotes?: string } = {}
): Promise<AIScanResult> {
  // ── Step 1: validate ────────────────────────────────────────────────────
  validateImageFile(file)

  try {
    if (isDemoMode) {
      throw new ScanServiceError(
        'analysis_failed',
        'Firebase is not configured — real AI analysis unavailable.'
      )
    }

    if (Capacitor.isNativePlatform()) {
      return analyzeNativeWithIdToken(file, options)
    }

    const user = auth.currentUser
    if (!user) {
      throw new ScanServiceError('analysis_failed', 'Please sign in to use AI analysis.')
    }

    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const path = `scans/${user.uid}/${Date.now()}-${createId()}.${extension}`
    const imageRef = ref(storage, path)

    await uploadBytes(imageRef, file, {
      contentType: file.type || 'image/jpeg',
      customMetadata: { userId: user.uid },
    })

    const imageUrl = await getDownloadURL(imageRef)
    const analyze = httpsCallable<
      { imageUrl: string; mealTypeHint?: MealType; gramNotes?: string; dateKey?: string },
      AnalyzeMealFunctionResponse
    >(getFunctions(), 'analyzeMealImage')

    const response = await analyze({
      imageUrl,
      dateKey: getToday(),
      ...(options.mealTypeHint && { mealTypeHint: options.mealTypeHint }),
      ...(options.gramNotes?.trim() && { gramNotes: options.gramNotes.trim() }),
    })

    return mapFunctionAnalysis(response.data)
  } catch (err) {
    // ScanServiceError — rethrow as-is
    if (err instanceof ScanServiceError) throw err

    // Firebase callable function errors have a `code` string like "functions/not-found"
    if (err && typeof err === 'object' && 'code' in err) {
      const fbErr = err as { code: string; message?: string }

      switch (fbErr.code) {
        case 'functions/resource-exhausted': {
          throw new ScanServiceError(
            'rate_limited',
            'AI service is temporarily busy. Please wait and try again.'
          )
        }
        case 'functions/not-found':
          throw new ScanServiceError(
            'no_food_detected',
            fbErr.message || 'No food detected in the photo. Please take a clear photo of your meal.'
          )
        case 'functions/deadline-exceeded':
          throw new ScanServiceError(
            'timeout',
            'Analysis timed out. Please try again.'
          )
        case 'functions/unauthenticated':
          throw new ScanServiceError(
            'analysis_failed',
            'Please sign in to use AI analysis.'
          )
        case 'functions/failed-precondition':
          throw new ScanServiceError(
            'analysis_failed',
            'AI service configuration error. Please try again later.'
          )
        case 'functions/invalid-argument':
          throw new ScanServiceError(
            'upload_failed',
            fbErr.message || 'Invalid request. Please try again.'
          )
        default:
          throw new ScanServiceError(
            'analysis_failed',
            fbErr.message || 'Analysis failed. Please try again.'
          )
      }
    }

    throw new ScanServiceError(
      'analysis_failed',
      err instanceof Error && err.message
        ? err.message
        : 'Analysis failed. Please try again.'
    )
  }
}

async function analyzeNativeWithIdToken(
  file: File,
  options: { mealTypeHint?: MealType; gramNotes?: string }
): Promise<AIScanResult> {
  const { FirebaseAuthentication } = await import('@capacitor-firebase/authentication')
  const [{ user }, { token }] = await Promise.all([
    FirebaseAuthentication.getCurrentUser(),
    FirebaseAuthentication.getIdToken({ forceRefresh: false }),
  ])

  if (!user || !token) {
    throw new ScanServiceError('analysis_failed', 'Please sign in to use AI analysis.')
  }

  const imageUrl = await imageFileToDataUrl(file)
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID
  if (!projectId) {
    throw new ScanServiceError('analysis_failed', 'Firebase project ID not configured.')
  }
  const region = import.meta.env.VITE_FIREBASE_FUNCTIONS_REGION || 'us-central1'
  const endpoint = `https://${region}-${projectId}.cloudfunctions.net/analyzeMealImage`

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: {
        imageUrl,
        dateKey: getToday(),
        ...(options.mealTypeHint && { mealTypeHint: options.mealTypeHint }),
        ...(options.gramNotes?.trim() && { gramNotes: options.gramNotes.trim() }),
      },
    }),
  })

  const payload = await response.json().catch(() => null) as
    | { result?: AnalyzeMealFunctionResponse; error?: { message?: string; status?: string } }
    | null

  if (!response.ok || payload?.error || !payload?.result?.analysis) {
    const errorMsg = payload?.error?.message ?? ''
    const status = payload?.error?.status ?? ''

    if (status === 'NOT_FOUND' || errorMsg.includes('no_food_detected')) {
      throw new ScanServiceError(
        'no_food_detected',
        'No food detected in the photo. Please take a clear photo of your meal.'
      )
    }
    if (status === 'RESOURCE_EXHAUSTED') {
      throw new ScanServiceError('rate_limited', 'AI service is temporarily busy. Please wait and try again.')
    }
    if (status === 'DEADLINE_EXCEEDED') {
      throw new ScanServiceError('timeout', 'Analysis timed out. Please try again.')
    }
    throw new ScanServiceError(
      'analysis_failed',
      errorMsg || `AI analysis service returned an error (${response.status}).`
    )
  }

  return mapFunctionAnalysis(payload.result)
}

function mapFunctionAnalysis(response: AnalyzeMealFunctionResponse): AIScanResult {
  const analysis = response.analysis
  return {
    mealId: response.mealId,
    ...(analysis.mealName && { mealName: analysis.mealName }),
    items: analysis.items,
    totalMacros: {
      calories: analysis.totalCalories,
      protein: analysis.protein,
      carbs: analysis.carbs,
      fat: analysis.fat,
      fiber: analysis.fiber,
    },
    confidence: analysis.confidence,
    confidenceScore: analysis.confidenceScore,
    suggestedMealType: analysis.suggestedMealType,
    processingTimeMs: analysis.processingTimeMs,
    modelVersion: analysis.modelVersion,
    clarificationQuestions: analysis.clarificationQuestions,
    warnings: analysis.warnings,
    accuracyNote: analysis.accuracyNote,
  }
}

// ─── Utility helpers ───────────────────────────────────────────────────────

/** Recalculate an item's macros after the user changes the portion weight. */
export function recalculateItemMacros(
  originalItem: FoodItem,
  newGrams: number
): FoodItem {
  if (newGrams <= 0 || originalItem.grams === 0) return originalItem
  const ratio = newGrams / originalItem.grams
  return {
    ...originalItem,
    grams: newGrams,
    macros: scaleMacros(originalItem.macros, ratio),
  }
}

/** Convert a File to a base64 data URL for local preview. */
export function imageFileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.onerror = () => reject(new ScanServiceError(
      'upload_failed',
      'Seçilen fotoğraf okunamadı.'
    ))
    reader.readAsDataURL(file)
  })
}

export type { AIScanResult } from '../types/scan'
