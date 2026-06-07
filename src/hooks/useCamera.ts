/**
 * useCamera — Capacitor Camera plugin hook
 *
 * Native platformda Capacitor Camera API kullanır (iOS kamera + galeri).
 * Web'de fallback olarak HTML file input kullanır.
 *
 * Memory fix: resultType CameraResultType.Uri kullanılır.
 * Tam çözünürlüklü base64 JS memory'ye asla yüklenmez.
 * Preview için Capacitor.convertFileSrc(webPath) kullanılır.
 */

import { useCallback, useRef } from 'react'
import { Capacitor } from '@capacitor/core'

export interface CameraResult {
  /** Küçük URL — yalnızca UI preview için (objectURL veya convertFileSrc). */
  previewUrl: string
  /** Capacitor native webPath — fetch() ile blob almak için. */
  webPath?: string
  /** Web fallback: orijinal File nesnesi. */
  file?: File
}

const isNative = Capacitor.isNativePlatform()

export function useCamera() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  /**
   * Kamera ile fotoğraf çek.
   * Native: CameraResultType.Uri — büyük base64 JS'e yüklenmez.
   * Web: file input ile capture="environment" + objectURL.
   */
  const takePhoto = useCallback(async (): Promise<CameraResult | null> => {
    if (isNative) {
      try {
        const { Camera, CameraResultType, CameraSource } = await import(
          '@capacitor/camera'
        )
        const photo = await Camera.getPhoto({
          quality: 80,
          allowEditing: false,
          resultType: CameraResultType.Uri,
          source: CameraSource.Camera,
          correctOrientation: true,
          presentationStyle: 'fullscreen',
        })

        if (!photo.webPath) return null

        // photo.webPath is already "capacitor://localhost/_capacitor_file_/..." — use directly.
        // Capacitor.convertFileSrc is for native file:// paths, not for webPath.
        const previewUrl = photo.webPath
        if (import.meta.env.DEV) {
          console.debug('[useCamera] takePhoto native', {
            resultType: 'Uri',
            webPath: photo.webPath,
            previewUrl,
          })
        }
        return { previewUrl, webPath: photo.webPath }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err)
        if (
          msg.includes('cancel') ||
          msg.includes('Cancel') ||
          msg.includes('User cancelled')
        ) {
          return null
        }
        throw err
      }
    }

    // Web fallback: file input + objectURL (base64 yok)
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.capture = 'environment'
      input.onchange = () => {
        const file = input.files?.[0]
        if (!file) { resolve(null); return }
        const previewUrl = URL.createObjectURL(file)
        resolve({ previewUrl, file })
      }
      input.oncancel = () => resolve(null)
      input.click()
    })
  }, [])

  /**
   * Galeriden fotoğraf seç.
   * Native: CameraResultType.Uri — büyük base64 JS'e yüklenmez.
   * Web: file input + objectURL.
   */
  const pickFromGallery = useCallback(async (): Promise<CameraResult | null> => {
    if (isNative) {
      try {
        const { Camera, CameraResultType, CameraSource } = await import(
          '@capacitor/camera'
        )
        const photo = await Camera.getPhoto({
          quality: 80,
          allowEditing: false,
          resultType: CameraResultType.Uri,
          source: CameraSource.Photos,
          correctOrientation: true,
          presentationStyle: 'popover',
        })

        if (!photo.webPath) return null

        const previewUrl = photo.webPath
        if (import.meta.env.DEV) {
          console.debug('[useCamera] pickFromGallery native', {
            resultType: 'Uri',
            webPath: photo.webPath,
            previewUrl,
          })
        }
        return { previewUrl, webPath: photo.webPath }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err)
        if (
          msg.includes('cancel') ||
          msg.includes('Cancel') ||
          msg.includes('User cancelled')
        ) {
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
      input.onchange = () => {
        const file = input.files?.[0]
        if (!file) { resolve(null); return }
        const previewUrl = URL.createObjectURL(file)
        resolve({ previewUrl, file })
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
