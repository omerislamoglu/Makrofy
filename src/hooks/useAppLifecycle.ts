/**
 * useAppLifecycle — Capacitor App lifecycle yönetimi
 *
 * - iOS back swipe / Android back button
 * - App pause/resume (arka plana gitme / geri gelme)
 * - URL açma (deep link)
 */

import { useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Capacitor } from '@capacitor/core'
import { showPendingStoreMessages } from '../services/revenueCatService'

const isNative = Capacitor.isNativePlatform()

export function useAppLifecycle() {
  const navigate = useNavigate()
  const location = useLocation()
  const navigateRef = useRef(navigate)
  const pathnameRef = useRef(location.pathname)

  useEffect(() => {
    navigateRef.current = navigate
  }, [navigate])

  useEffect(() => {
    pathnameRef.current = location.pathname
  }, [location.pathname])

  useEffect(() => {
    if (!isNative) return

    let mounted = true
    let cleanup: (() => void) | undefined

    async function init() {
      try {
        const { App } = await import('@capacitor/app')

        // Bileşen dynamic import tamamlanmadan unmount olduysa çık
        if (!mounted) return

        // Android geri tuşu — ana sayfadaysa uygulamayı minimize et, değilse geri git
        const backHandler = await App.addListener('backButton', () => {
          if (pathnameRef.current === '/') {
            App.minimizeApp()
          } else {
            navigateRef.current(-1)
          }
        })

        // App resume — state yenileme için event dispatch
        // isActive === true iken bekleyen StoreKit mesajlarını göster
        // (shouldShowInAppMessagesAutomatically: false olduğundan manuel çağrı gerekir)
        const resumeHandler = await App.addListener('appStateChange', ({ isActive }) => {
          if (isActive) {
            window.dispatchEvent(new CustomEvent('app:resume'))
            showPendingStoreMessages()
          } else {
            window.dispatchEvent(new CustomEvent('app:pause'))
          }
        })

        // Deep link / URL scheme
        const urlHandler = await App.addListener('appUrlOpen', ({ url }) => {
          // makrofy://add → /add gibi
          try {
            const parsed = new URL(url)
            const path = parsed.pathname || parsed.hostname
            if (path) {
              const normalized = path.replace(/^\/+/, '')
              navigateRef.current(normalized === 'home' ? '/' : '/' + normalized)
            }
          } catch {
            // Geçersiz URL, sessizce geç
          }
        })

        // Listener'lar kaydedilirken unmount olduysa hepsini hemen temizle
        if (!mounted) {
          backHandler.remove()
          resumeHandler.remove()
          urlHandler.remove()
          return
        }

        cleanup = () => {
          backHandler.remove()
          resumeHandler.remove()
          urlHandler.remove()
        }
      } catch {
        // Init hatası — native ortamda değilsek veya Capacitor yüklenmediyse sessizce geç
      }
    }

    init()

    return () => {
      mounted = false
      cleanup?.()
    }
  }, [])
}
