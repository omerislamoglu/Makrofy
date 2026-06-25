import { getFunctions, httpsCallable } from 'firebase/functions'
import { Capacitor } from '@capacitor/core'
import { app, auth, isDemoMode } from './firebase'
import { getCurrentRevenueCatAppUserId } from './revenueCatService'
import type { AIProgram, AIProgramProfileInputs } from '../types/aiProgram'

const FUNCTIONS_REGION = import.meta.env.VITE_FIREBASE_FUNCTIONS_REGION || 'us-central1'
const TIMEOUT_MS = 180_000
const MAX_ORIGINAL_IMAGE_BYTES = 10 * 1024 * 1024
const MAX_UNCOMPRESSED_IMAGE_BYTES = 4 * 1024 * 1024
const MAX_IMAGE_DIMENSION = 1280
const COMPRESSED_IMAGE_QUALITY = 0.78

export class AIProgramServiceError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AIProgramServiceError'
  }
}

interface GenerateProgramPayload {
  imageData?: string
  profileInputs: AIProgramProfileInputs
  revenueCatAppUserId?: string | null
  mode?: 'initial' | 'progress_evaluation'
  progressNotes?: string
}

interface GenerateProgramResponse {
  success: boolean
  programId: string
  program: AIProgram
}

export async function generateAIProgram(
  profileInputs: AIProgramProfileInputs,
  imageFile?: File,
  options: { mode?: 'initial' | 'progress_evaluation'; progressNotes?: string } = {}
): Promise<AIProgram> {
  if (isDemoMode) {
    throw new AIProgramServiceError('Firebase yapılandırması eksik. AI program oluşturma kullanılamıyor.')
  }

  const isLoggedIn = await (async () => {
    if (Capacitor.isNativePlatform()) {
      const { FirebaseAuthentication } = await import('@capacitor-firebase/authentication')
      const { user } = await FirebaseAuthentication.getCurrentUser()
      return !!user
    }
    return !!auth.currentUser
  })()

  if (!isLoggedIn) {
    throw new AIProgramServiceError('Program oluşturmak için giriş yapmalısın.')
  }

  const [imageData, revenueCatAppUserId] = await Promise.all([
    imageFile ? fileToCompressedDataUrl(imageFile) : Promise.resolve(undefined),
    getCurrentRevenueCatAppUserId().catch(() => null),
  ])
  const payload: GenerateProgramPayload = {
    profileInputs,
    ...(imageData && { imageData }),
    ...(revenueCatAppUserId && { revenueCatAppUserId }),
    ...(options.mode && { mode: options.mode }),
    ...(options.progressNotes?.trim() && { progressNotes: options.progressNotes.trim() }),
  }

  try {
    if (Capacitor.isNativePlatform()) {
      return generateNative(payload)
    }

    const fn = httpsCallable<GenerateProgramPayload, GenerateProgramResponse>(
      getFunctions(app, FUNCTIONS_REGION),
      'generatePersonalProgram'
    )
    const response = await fn(payload)
    return response.data.program
  } catch (err) {
    if (err instanceof AIProgramServiceError) throw err
    if (err && typeof err === 'object' && 'code' in err) {
      const fbErr = err as { code: string; message?: string }
      throw new AIProgramServiceError(toUserMessage(fbErr.code, fbErr.message))
    }
    throw new AIProgramServiceError(
      err instanceof Error && err.message ? err.message : 'Program oluşturulamadı. Lütfen tekrar dene.'
    )
  }
}

/**
 * Fetch the user's current active AI program from the server (Cloud Function).
 * Returns the program, or null when the server confirms there is no active
 * program. THROWS on network/auth errors so the caller can distinguish
 * "confirmed empty" (safe to clear local cache) from "couldn't reach server"
 * (keep the cache).
 */
export async function fetchActiveProgram(): Promise<AIProgram | null> {
  if (isDemoMode) return null

  if (Capacitor.isNativePlatform()) {
    const { FirebaseAuthentication } = await import('@capacitor-firebase/authentication')
    const [{ user }, { token }] = await Promise.all([
      FirebaseAuthentication.getCurrentUser(),
      FirebaseAuthentication.getIdToken({ forceRefresh: false }),
    ])
    if (!user || !token) throw new AIProgramServiceError('Not authenticated')

    const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID
    if (!projectId) throw new AIProgramServiceError('Firebase project ID missing')

    const response = await fetch(
      `https://${FUNCTIONS_REGION}-${projectId}.cloudfunctions.net/getActiveProgram`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: {} }),
      }
    )
    const json = (await response.json().catch(() => null)) as
      | { result?: { program: AIProgram | null }; error?: unknown }
      | null
    if (!response.ok || json?.error) {
      throw new AIProgramServiceError('Failed to fetch active program')
    }
    return json?.result?.program ?? null
  }

  const fn = httpsCallable<void, { success: boolean; program: AIProgram | null }>(
    getFunctions(app, FUNCTIONS_REGION),
    'getActiveProgram'
  )
  const response = await fn()
  return response.data.program ?? null
}

async function generateNative(payload: GenerateProgramPayload): Promise<AIProgram> {
  const { FirebaseAuthentication } = await import('@capacitor-firebase/authentication')
  const [{ user }, { token }] = await Promise.all([
    FirebaseAuthentication.getCurrentUser(),
    FirebaseAuthentication.getIdToken({ forceRefresh: false }),
  ])

  if (!user || !token) {
    throw new AIProgramServiceError('Program oluşturmak için giriş yapmalısın.')
  }

  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID
  if (!projectId) {
    throw new AIProgramServiceError('Firebase project ID yapılandırması eksik.')
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const response = await fetch(`https://${FUNCTIONS_REGION}-${projectId}.cloudfunctions.net/generatePersonalProgram`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: payload }),
      signal: controller.signal,
    })
    clearTimeout(timer)
    const json = await response.json().catch(() => null) as { result?: GenerateProgramResponse; error?: { status?: string; message?: string } } | null
    if (!response.ok || json?.error) {
      throw new AIProgramServiceError(toUserMessage(json?.error?.status ?? '', json?.error?.message))
    }
    if (!json?.result?.program) {
      throw new AIProgramServiceError('AI program yanıtı eksik geldi. Lütfen tekrar dene.')
    }
    return json.result.program
  } catch (err) {
    clearTimeout(timer)
    if (err instanceof AIProgramServiceError) throw err
    if ((err as Error)?.name === 'AbortError') {
      throw new AIProgramServiceError('Program oluşturma zaman aşımına uğradı. Lütfen tekrar dene.')
    }
    throw err
  }
}

function toUserMessage(code: string, message?: string): string {
  if (code.includes('failed-precondition')) {
    return message || 'Bu özellik Pro kullanıcılar içindir veya fotoğraf uygun değil.'
  }
  if (code.includes('resource-exhausted')) {
    return 'AI servisi şu an yoğun. Lütfen biraz sonra tekrar dene.'
  }
  if (code.includes('invalid-argument')) {
    return message || 'Bilgiler eksik veya hatalı. Lütfen formu kontrol et.'
  }
  if (code.includes('unauthenticated')) {
    return 'Program oluşturmak için giriş yapmalısın.'
  }
  return message || 'Program oluşturulamadı. Lütfen tekrar dene.'
}

async function fileToCompressedDataUrl(file: File): Promise<string> {
  const sourceMimeType = getImageMimeType(file)
  if (!sourceMimeType) {
    throw new AIProgramServiceError('Fotoğraf formatı desteklenmiyor.')
  }
  if (file.size > MAX_ORIGINAL_IMAGE_BYTES) {
    throw new AIProgramServiceError('Fotoğraf çok büyük. Lütfen 10 MB altında bir görsel seç.')
  }

  const canCompress = /^image\/(jpeg|jpg|png|webp|heic|heif)$/i.test(sourceMimeType)
  if (!canCompress) {
    if (file.size > MAX_UNCOMPRESSED_IMAGE_BYTES) {
      throw new AIProgramServiceError('Bu fotoğraf formatı sıkıştırılamadı. Lütfen daha küçük bir JPEG veya PNG seç.')
    }
    return fileToDataUrl(file, sourceMimeType)
  }

  try {
    return await compressImageFile(file)
  } catch (err) {
    console.warn('[AIProgram] Image compression skipped:', err)
    if (file.size > MAX_UNCOMPRESSED_IMAGE_BYTES) {
      throw new AIProgramServiceError('Fotoğraf hazırlanırken zorlandı. Lütfen daha küçük bir fotoğraf seç.')
    }
    return fileToDataUrl(file, sourceMimeType)
  }
}

function fileToDataUrl(file: File, mimeType = getImageMimeType(file)): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      if (mimeType && result.startsWith('data:application/octet-stream')) {
        resolve(result.replace(/^data:application\/octet-stream/i, `data:${mimeType}`))
        return
      }
      if (!result.startsWith('data:image/')) {
        reject(new AIProgramServiceError('Fotoğraf formatı desteklenmiyor.'))
        return
      }
      resolve(result)
    }
    reader.onerror = () => reject(new AIProgramServiceError('Fotoğraf okunamadı.'))
    reader.readAsDataURL(file)
  })
}

async function compressImageFile(file: File): Promise<string> {
  const sourceMimeType = getImageMimeType(file) || 'image/jpeg'
  const imageUrl = URL.createObjectURL(file)
  try {
    const image = await loadImage(imageUrl)
    const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight))
    const width = Math.max(1, Math.round(image.naturalWidth * scale))
    const height = Math.max(1, Math.round(image.naturalHeight * scale))
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    if (!context) {
      throw new Error('Canvas context unavailable')
    }
    context.drawImage(image, 0, 0, width, height)
    const mimeType = /^image\/(png|heic|heif)$/i.test(sourceMimeType) ? 'image/jpeg' : sourceMimeType
    const dataUrl = canvas.toDataURL(mimeType, COMPRESSED_IMAGE_QUALITY)
    if (!dataUrl.startsWith('data:image/')) {
      throw new Error('Compressed data URL invalid')
    }
    return dataUrl
  } finally {
    URL.revokeObjectURL(imageUrl)
  }
}

function getImageMimeType(file: File): string | null {
  if (file.type.startsWith('image/')) return file.type.toLowerCase()
  const extension = file.name.split('.').pop()?.toLowerCase()
  if (extension === 'jpg' || extension === 'jpeg') return 'image/jpeg'
  if (extension === 'png') return 'image/png'
  if (extension === 'webp') return 'image/webp'
  if (extension === 'heic') return 'image/heic'
  if (extension === 'heif') return 'image/heif'
  return null
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Image decode failed'))
    image.src = src
  })
}
