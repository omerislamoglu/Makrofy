/**
 * useNetworkStatus — real-time online / offline detection
 *
 * Uses the standard `window` `online` / `offline` events which are reliably
 * forwarded by WKWebView (Capacitor iOS) and all modern browsers.
 *
 * Side-effect: dispatches `app:online` and `app:offline` custom events on
 * every transition so other parts of the app (e.g. offline queue drain,
 * meal refresh) can react without coupling to this hook directly.
 */

import { useState, useEffect } from 'react'

export function useNetworkStatus(): boolean {
  const [isOnline, setIsOnline] = useState<boolean>(() => navigator.onLine)

  useEffect(() => {
    const update = (online: boolean) => {
      setIsOnline(online)
      window.dispatchEvent(new CustomEvent(online ? 'app:online' : 'app:offline'))
    }

    const onOnline = () => update(true)
    const onOffline = () => update(false)

    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)

    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  return isOnline
}
