import { scaleMacros } from '../types/nutrition'
import type { AIScanResult, ScanErrorCode } from '../types/scan'
import type { FoodItem } from '../types/meal'
import type { MealType } from '../types/meal'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { app, auth, isDemoMode } from './firebase'
import { Capacitor } from '@capacitor/core'
import { getToday } from '../utils/date'
import { getCurrentRevenueCatAppUserId } from './revenueCatService'

// ─── Constants ────────────────────────────────────────────────────────────

const FUNCTIONS_REGION = import.meta.env.VITE_FIREBASE_FUNCTIONS_REGION || 'us-central1'
const NATIVE_TIMEOUT_MS = 120_000
const DEBUG_SCAN = import.meta.env.DEV

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

type AnalyzeMealRequestPayload = {
  imageUrl?: string
  imageData?: string
  mealTypeHint?: MealType
  gramNotes?: string
  dateKey?: string
  locale?: string
  revenueCatAppUserId?: string | null
}

// ─── Public API ────────────────────────────────────────────────────────────

/**
 * Analyze a meal image and return detected food items with macros.
 *
 * Web and native send the already-compressed image directly to the Cloud
 * Function. This avoids a Storage upload/download roundtrip before AI analysis.
 */
export async function analyzeMealImage(
  file: File,
  options: { mealTypeHint?: MealType; gramNotes?: string; locale?: string } = {}
): Promise<AIScanResult> {
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

    // ── Web path: direct compressed image + httpsCallable ──
    const user = auth.currentUser
    if (!user) {
      throw new ScanServiceError('analysis_failed', 'Please sign in to use AI analysis.')
    }

    const analyze = httpsCallable<AnalyzeMealRequestPayload, AnalyzeMealFunctionResponse>(
      getFunctions(app, FUNCTIONS_REGION),
      'analyzeMealImage'
    )
    const [dataUrl, revenueCatAppUserId] = await Promise.all([
      fileToDataUrl(file),
      getCurrentRevenueCatAppUserId().catch(() => null),
    ])

    const response = await analyze({
      imageData: dataUrl,
      dateKey: getToday(),
      ...(revenueCatAppUserId && { revenueCatAppUserId }),
      ...(options.mealTypeHint && { mealTypeHint: options.mealTypeHint }),
      ...(options.gramNotes?.trim() && { gramNotes: options.gramNotes.trim() }),
      ...(options.locale && { locale: options.locale }),
    })

    return mapFunctionAnalysis(response.data)
  } catch (err) {
    if (err instanceof ScanServiceError) throw err

    if (err && typeof err === 'object' && 'code' in err) {
      const fbErr = err as { code: string; message?: string }

      switch (fbErr.code) {
        case 'functions/resource-exhausted':
          throw new ScanServiceError('rate_limited', fbErr.message || 'Daily AI scan limit reached.')
        case 'functions/not-found':
          throw new ScanServiceError('no_food_detected', fbErr.message || 'No food detected in the photo.')
        case 'functions/deadline-exceeded':
          throw new ScanServiceError('timeout', 'Analysis timed out. Please try again.')
        case 'functions/unauthenticated':
          throw new ScanServiceError('analysis_failed', 'Please sign in to use AI analysis.')
        case 'functions/failed-precondition':
        case 'functions/permission-denied':
          throw new ScanServiceError('analysis_failed', fbErr.message || 'AI analysis is available for Pro users only.')
        case 'functions/invalid-argument':
          throw new ScanServiceError('upload_failed', fbErr.message || 'Invalid request. Please try again.')
        case 'functions/unavailable':
          throw new ScanServiceError('analysis_failed', 'Service temporarily unavailable. Please try again in a moment.')
        case 'functions/internal':
          throw new ScanServiceError('analysis_failed', 'An internal error occurred. Please try again.')
        default:
          throw new ScanServiceError('analysis_failed', fbErr.message || 'Analysis failed. Please try again.')
      }
    }

    throw new ScanServiceError(
      'analysis_failed',
      err instanceof Error && err.message ? err.message : 'Analysis failed. Please try again.'
    )
  }
}

// ─── Native iOS path: base64 direct to Cloud Function ─────────────────────

async function analyzeNativeWithIdToken(
  file: File,
  options: { mealTypeHint?: MealType; gramNotes?: string; locale?: string }
): Promise<AIScanResult> {
  if (DEBUG_SCAN) console.log('[AI_SCAN] native path started', { fileName: file.name, fileSize: file.size, fileType: file.type })

  // ── 1. Prepare auth, image payload, and subscription id in parallel ──
  const { FirebaseAuthentication } = await import('@capacitor-firebase/authentication')
  const [[{ user }, { token }], dataUrl, revenueCatAppUserId] = await Promise.all([
    Promise.all([
      FirebaseAuthentication.getCurrentUser(),
      FirebaseAuthentication.getIdToken({ forceRefresh: false }),
    ]),
    fileToDataUrl(file),
    getCurrentRevenueCatAppUserId().catch(() => null),
  ])

  if (!user || !token) {
    throw new ScanServiceError('analysis_failed', 'Please sign in to use AI analysis.')
  }
  if (DEBUG_SCAN) console.log('[AI_SCAN] token received', { uid: user.uid, tokenLength: token.length })
  if (DEBUG_SCAN) console.log('[AI_SCAN] dataUrl length', { length: dataUrl.length, sizeKB: Math.round(dataUrl.length / 1024) })

  // ── 2. Call Cloud Function with base64 payload ──
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID
  if (!projectId) {
    throw new ScanServiceError('analysis_failed', 'Firebase project ID not configured.')
  }
  const endpoint = `https://${FUNCTIONS_REGION}-${projectId}.cloudfunctions.net/analyzeMealImage`

  const requestBody: { data: AnalyzeMealRequestPayload } = {
    data: {
      imageData: dataUrl,
      dateKey: getToday(),
      ...(revenueCatAppUserId && { revenueCatAppUserId }),
      ...(options.mealTypeHint && { mealTypeHint: options.mealTypeHint }),
      ...(options.gramNotes?.trim() && { gramNotes: options.gramNotes.trim() }),
      ...(options.locale && { locale: options.locale }),
    },
  }

  if (DEBUG_SCAN) console.log('[AI_SCAN] function call starting', {
    endpoint,
    bodyKeys: Object.keys(requestBody.data),
    totalBodySizeKB: Math.round(JSON.stringify(requestBody).length / 1024),
  })

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), NATIVE_TIMEOUT_MS)

  let response: Response
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    })
    clearTimeout(timer)
  } catch (fetchErr) {
    clearTimeout(timer)
    const errName = (fetchErr as Error)?.name ?? 'unknown'
    const errMsg = fetchErr instanceof Error ? fetchErr.message : String(fetchErr)
    console.error('[AI_SCAN] fetch FAILED', {
      name: errName,
      message: errMsg,
      stack: (fetchErr as Error)?.stack,
    })
    if (errName === 'AbortError') {
      throw new ScanServiceError('timeout', 'Analysis timed out after 120s. Please try again.')
    }
    // İnternet yoksa (navigator.onLine = false) veya hata mesajı bunu
    // açıkça belirtiyorsa kullanıcıya özel "ağ yok" hatası göster.
    const isOffline =
      !navigator.onLine ||
      errMsg.toLowerCase().includes('offline') ||
      errMsg.toLowerCase().includes('network') ||
      errMsg.toLowerCase().includes('connection') ||
      errMsg.toLowerCase().includes('internet') ||
      errMsg.toLowerCase().includes('host') ||
      errMsg.toLowerCase().includes('unreachable')
    if (isOffline) {
      throw new ScanServiceError('network_error', 'No internet connection. Please check your network and try again.')
    }
    throw new ScanServiceError('analysis_failed', `Network error: ${errMsg}`)
  }

  // ── 4. Parse response safely ──
  const rawText = await response.text()
  if (DEBUG_SCAN) console.log('[AI_SCAN] response status', { status: response.status, ok: response.ok })
  if (DEBUG_SCAN) console.log('[AI_SCAN] raw response preview', { preview: rawText.substring(0, 1000) })

  let payload: { result?: AnalyzeMealFunctionResponse; error?: { message?: string; status?: string } } | null
  try {
    payload = JSON.parse(rawText)
  } catch {
    console.error('[AI_SCAN] JSON parse failed', { rawPreview: rawText.substring(0, 500) })
    throw new ScanServiceError(
      'analysis_failed',
      `Cloud Function returned invalid JSON (HTTP ${response.status}): ${rawText.substring(0, 200)}`
    )
  }

  if (DEBUG_SCAN) console.log('[AI_SCAN] parsed payload', {
    hasResult: !!payload?.result,
    hasAnalysis: !!payload?.result?.analysis,
    hasError: !!payload?.error,
    errorStatus: payload?.error?.status,
    errorMessage: payload?.error?.message?.substring(0, 200),
  })

  if (!response.ok || payload?.error || !payload?.result?.analysis) {
    const errorMsg = payload?.error?.message ?? ''
    const status = payload?.error?.status ?? ''

    if (status === 'NOT_FOUND' || errorMsg.includes('no_food_detected')) {
      throw new ScanServiceError('no_food_detected', 'No food detected in the photo. Please take a clear photo of your meal.')
    }
    if (status === 'RESOURCE_EXHAUSTED') {
      throw new ScanServiceError('rate_limited', errorMsg || 'Daily AI scan limit reached.')
    }
    if (status === 'FAILED_PRECONDITION') {
      throw new ScanServiceError('analysis_failed', errorMsg || 'AI analysis is available for Pro users only.')
    }
    if (status === 'DEADLINE_EXCEEDED') {
      throw new ScanServiceError('timeout', 'Analysis timed out. Please try again.')
    }
    throw new ScanServiceError(
      'analysis_failed',
      errorMsg || `AI analysis returned an error (HTTP ${response.status}).`
    )
  }

  if (DEBUG_SCAN) console.log('[AI_SCAN] SUCCESS - analysis complete')
  return mapFunctionAnalysis(payload.result)
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.onerror = () => reject(new ScanServiceError('upload_failed', 'Failed to read image file.'))
    reader.readAsDataURL(file)
  })
}

function mapFunctionAnalysis(response: AnalyzeMealFunctionResponse): AIScanResult {
  const analysis = response?.analysis

  // AI backend'in response şeması değişirse veya kısmi yanıt gelirse
  // AnalysisResultPage'de `.map()` crash'ini önle.
  if (!analysis || !Array.isArray(analysis.items)) {
    throw new ScanServiceError(
      'analysis_failed',
      'Unexpected response format from AI service. Please try again.'
    )
  }

  return {
    ...(analysis.mealName && { mealName: analysis.mealName }),
    items: analysis.items,
    totalMacros: {
      calories: analysis.totalCalories ?? 0,
      protein: analysis.protein ?? 0,
      carbs: analysis.carbs ?? 0,
      fat: analysis.fat ?? 0,
      fiber: analysis.fiber ?? 0,
    },
    confidence: analysis.confidence ?? 'low',
    confidenceScore: analysis.confidenceScore ?? 0,
    suggestedMealType: analysis.suggestedMealType ?? 'lunch',
    processingTimeMs: analysis.processingTimeMs ?? 0,
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
      'Could not read the selected photo.'
    ))
    reader.readAsDataURL(file)
  })
}

export type { AIScanResult } from '../types/scan'
