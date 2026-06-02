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

    let cleanup: (() => void) | undefined

    async function init() {
      try {
        const { App } = await import('@capacitor/app')

        // Android geri tuşu — ana sayfadaysa uygulamayı minimize et, değilse geri git
        const backHandler = await App.addListener('backButton', () => {
          if (pathnameRef.current === '/') {
            App.minimizeApp()
          } else {
            navigateRef.current(-1)
          }
        })

        // App resume — state yenileme için event dispatch
        const resumeHandler = await App.addListener('appStateChange', ({ isActive }) => {
          if (isActive) {
            window.dispatchEvent(new CustomEvent('app:resume'))
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
              navigateRef.current('/' + path.replace(/^\/+/, ''))
            }
          } catch {
            // Geçersiz URL, sessizce geç
          }
        })

        cleanup = () => {
          backHandler.remove()
          resumeHandler.remove()
          urlHandler.remove()
        }
      } catch (err) {
        console.warn('[AppLifecycle] Init error:', err)
      }
    }

    init()

    return () => {
      cleanup?.()
    }
  }, [])
}
