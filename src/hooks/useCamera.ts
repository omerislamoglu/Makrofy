/**
 * useCamera — Capacitor Camera plugin hook
 *
 * Native platformda Capacitor Camera API kullanır (iOS kamera + galeri).
 * Web'de fallback olarak HTML file input kullanır.
 */

import { useCallback, useRef } from 'react'
import { Capacitor } from '@capacitor/core'

interface CameraResult {
  dataUrl: string // base64 data URL (preview icin)
  webPath?: string // web-accessible path (Capacitor)
  file?: File // File nesnesi (web fallback)
}

const isNative = Capacitor.isNativePlatform()

export function useCamera() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  /**
   * Kamera ile fotoğraf çek.
   * Native: Capacitor Camera.getPhoto()
   * Web: file input ile capture="environment"
   */
  const takePhoto = useCallback(async (): Promise<CameraResult | null> => {
    if (isNative) {
      try {
        const { Camera, CameraResultType, CameraSource } = await import(
          '@capacitor/camera'
        )
        const photo = await Camera.getPhoto({
          quality: 85,
          allowEditing: false,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Camera,
          width: 1920,
          height: 1920,
          correctOrientation: true,
          presentationStyle: 'fullscreen',
        })

        if (!photo.dataUrl) return null

        return {
          dataUrl: photo.dataUrl,
          webPath: photo.webPath,
        }
      } catch (err: unknown) {
        // Kullanıcı iptal ettiyse null dön
        const msg = err instanceof Error ? err.message : String(err)
        if (msg.includes('cancel') || msg.includes('Cancel') || msg.includes('User cancelled')) {
          return null
        }
        throw err
      }
    }

    // Web fallback: file input
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.capture = 'environment'
      input.onchange = async () => {
        const file = input.files?.[0]
        if (!file) {
          resolve(null)
          return
        }
        const dataUrl = await fileToDataUrl(file)
        resolve({ dataUrl, file })
      }
      // Kullanıcı iptal ederse
      input.oncancel = () => resolve(null)
      input.click()
    })
  }, [])

  /**
   * Galeriden fotoğraf seç.
   * Native: Capacitor Camera.getPhoto() with Photos source
   * Web: file input (capture olmadan)
   */
  const pickFromGallery = useCallback(async (): Promise<CameraResult | null> => {
    if (isNative) {
      try {
        const { Camera, CameraResultType, CameraSource } = await import(
          '@capacitor/camera'
        )
        const photo = await Camera.getPhoto({
          quality: 85,
          allowEditing: false,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Photos,
          width: 1920,
          height: 1920,
          correctOrientation: true,
          presentationStyle: 'popover',
        })

        if (!photo.dataUrl) return null

        return {
          dataUrl: photo.dataUrl,
          webPath: photo.webPath,
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err)
        if (msg.includes('cancel') || msg.includes('Cancel') || msg.includes('User cancelled')) {
          return null
        }
        throw err
      }
    }

    // Web fallback
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = async () => {
        const file = input.files?.[0]
        if (!file) {
          resolve(null)
          return
        }
        const dataUrl = await fileToDataUrl(file)
        resolve({ dataUrl, file })
      }
      input.oncancel = () => resolve(null)
      input.click()
    })
  }, [])

  return {
    takePhoto,
    pickFromGallery,
    fileInputRef,
  }
}

// ── Yardımcı ──────────────────────────────────────────────────────────────

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.onerror = () => reject(new Error('Dosya okunamadı'))
    reader.readAsDataURL(file)
  })
}

export type { CameraResult }
