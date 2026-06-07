import { useState, useEffect } from 'react'
import { isNative } from './useCapacitor'
import { Capacitor } from '@capacitor/core'

const IOS_REVIEW_URL = import.meta.env.VITE_APP_STORE_REVIEW_URL as string | undefined
const ANDROID_REVIEW_URL = import.meta.env.VITE_PLAY_STORE_REVIEW_URL as string | undefined

function getReviewUrl(): string | null {
  if (isNative && Capacitor.getPlatform() === 'android') return ANDROID_REVIEW_URL || null
  return IOS_REVIEW_URL || null
}

export function useAppRating() {
  const [showRating, setShowRating] = useState(false)

  useEffect(() => {
    if (!getReviewUrl()) return

    const hasRated = localStorage.getItem('makrofy_has_rated')
    if (hasRated === 'true') return

    const currentSessionTracked = sessionStorage.getItem('makrofy_session_tracked')
    let sessionCount = parseInt(localStorage.getItem('makrofy_session_count') || '0', 10)

    if (!currentSessionTracked) {
      sessionCount += 1
      localStorage.setItem('makrofy_session_count', sessionCount.toString())
      sessionStorage.setItem('makrofy_session_tracked', 'true')
    }

    // 3. girişte (session) göster, uygulamanın açılmasından 3 saniye sonra
    if (sessionCount === 3) {
      const timer = setTimeout(() => {
        setShowRating(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleRate = () => {
    const reviewUrl = getReviewUrl()
    if (!reviewUrl) {
      setShowRating(false)
      return
    }

    localStorage.setItem('makrofy_has_rated', 'true')
    setShowRating(false)
    window.open(reviewUrl, '_blank')
  }

  const handleDismiss = () => {
    localStorage.setItem('makrofy_has_rated', 'true')
    setShowRating(false)
  }

  const handleLater = () => {
    // If they say later, reset the session count to 0 so it asks again in 3 sessions
    localStorage.setItem('makrofy_session_count', '0')
    setShowRating(false)
  }

  return { showRating, handleRate, handleDismiss, handleLater }
}
