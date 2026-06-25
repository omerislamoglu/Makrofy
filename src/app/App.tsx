import { useEffect, useState, useCallback } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Capacitor } from '@capacitor/core'
import AppRoutes from './routes'
import { useAppLifecycle } from '../hooks/useAppLifecycle'
import { useNetworkStatus } from '../hooks/useNetworkStatus'
import { useNotificationScheduler } from '../hooks/useNotificationScheduler'
import SplashScreen from '../components/SplashScreen'
import ToastHost from '../components/ToastHost'
import LanguageGate from '../components/LanguageGate'
import { LocaleProvider } from '../contexts/LocaleContext'

// Lazy import Capacitor plugins (only when running native)
async function initCapacitor() {
  if (!Capacitor.isNativePlatform()) return

  try {
    const [
      { StatusBar, Style },
      { SplashScreen },
      { Keyboard, KeyboardResize },
    ] = await Promise.all([
      import('@capacitor/status-bar'),
      import('@capacitor/splash-screen'),
      import('@capacitor/keyboard'),
    ])

    // StatusBar — siyah arka plan, beyaz ikonlar (dark content)
    await StatusBar.setStyle({ style: Style.Dark })
    await StatusBar.setBackgroundColor({ color: '#000000' })
    await StatusBar.setOverlaysWebView({ overlay: true })

    // Keyboard — body resize modu, klavye açılınca body küçülür
    await Keyboard.setResizeMode({ mode: KeyboardResize.Body })
    await Keyboard.setAccessoryBarVisible({ isVisible: false })

    // SplashScreen — React mount olunca splash'i gizle
    await SplashScreen.hide({ fadeOutDuration: 300 })
  } catch (err) {
    console.warn('[Capacitor] Init error:', err)
  }
}

/** Router içinde çalışan lifecycle wrapper */
function AppShell() {
  // Native lifecycle: back button, app pause/resume, deep links
  useAppLifecycle()
  // Real-time network status — dispatches app:online / app:offline events
  useNetworkStatus()
  // Yerel bildirimleri planla (kalori, seri, motivasyon, antrenman, vb.)
  useNotificationScheduler()
  return <AppRoutes />
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true)
  const handleSplashFinish = useCallback(() => setShowSplash(false), [])

  useEffect(() => {
    initCapacitor()
  }, [])

  return (
    <LocaleProvider>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
      <LanguageGate>
        <BrowserRouter>
          <AppShell />
        </BrowserRouter>
        <ToastHost />
      </LanguageGate>
    </LocaleProvider>
  )
}

