/**
 * useCapacitor — Merkezi Capacitor native API hook
 *
 * Tüm native API'ler bu hook üzerinden kullanılır.
 * Web ortamında tüm native çağrılar gracefully no-op yapar.
 */

import { useCallback, useMemo } from 'react'
import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'

// ── Platform ──────────────────────────────────────────────────────────────────

const isNative = Capacitor.isNativePlatform()
const platform = Capacitor.getPlatform() // 'ios' | 'android' | 'web'
const isIOS = platform === 'ios'
const isAndroid = platform === 'android'

export { isNative, isIOS, isAndroid, platform }

// ── Haptics ───────────────────────────────────────────────────────────────────

let lastHapticAt = 0

function runHaptic(action: () => Promise<void>) {
  if (!isNative) return
  const now = Date.now()
  if (now - lastHapticAt < 80) return
  lastHapticAt = now
  void action().catch(() => {
    // Haptics desteklenmiyor, sessizce devam et
  })
}

/**
 * Dokunsal geri bildirim (titreşim) fonksiyonları.
 * Web'de no-op, native'de Taptic Engine kullanır.
 */
export function useHaptics() {
  /** Hafif tıklama hissi — tab geçişi, kart genişletme */
  const impactLight = useCallback(() => {
    runHaptic(() => Haptics.impact({ style: ImpactStyle.Light }))
  }, [])

  /** Orta tıklama hissi — buton tıklama */
  const impactMedium = useCallback(() => {
    runHaptic(() => Haptics.impact({ style: ImpactStyle.Medium }))
  }, [])

  /** Güçlü tıklama — hata veya önemli aksiyon */
  const impactHeavy = useCallback(() => {
    runHaptic(() => Haptics.impact({ style: ImpactStyle.Heavy }))
  }, [])

  /** Başarı bildirimi — öğün kaydedildi, analiz tamamlandı */
  const notificationSuccess = useCallback(() => {
    runHaptic(() => Haptics.notification({ type: NotificationType.Success }))
  }, [])

  /** Hata bildirimi — form hatası, analiz başarısız */
  const notificationError = useCallback(() => {
    runHaptic(() => Haptics.notification({ type: NotificationType.Error }))
  }, [])

  /** Uyarı bildirimi */
  const notificationWarning = useCallback(() => {
    runHaptic(() => Haptics.notification({ type: NotificationType.Warning }))
  }, [])

  /** Seçim değişikliği — list scroll, toggle */
  const selectionChanged = useCallback(() => {
    runHaptic(() => Haptics.selectionChanged())
  }, [])

  return useMemo(() => ({
    impactLight,
    impactMedium,
    impactHeavy,
    notificationSuccess,
    notificationError,
    notificationWarning,
    selectionChanged,
  }), [impactLight, impactMedium, impactHeavy, notificationSuccess, notificationError, notificationWarning, selectionChanged])
}

// ── Default export ────────────────────────────────────────────────────────────

export default function useCapacitor() {
  const haptics = useHaptics()

  return useMemo(() => ({
    isNative,
    isIOS,
    isAndroid,
    platform,
    haptics,
  }), [haptics])
}
