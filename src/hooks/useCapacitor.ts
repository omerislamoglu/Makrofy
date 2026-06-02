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

/**
 * Dokunsal geri bildirim (titreşim) fonksiyonları.
 * Web'de no-op, native'de Taptic Engine kullanır.
 */
export function useHaptics() {
  /** Hafif tıklama hissi — tab geçişi, kart genişletme */
  const impactLight = useCallback(async () => {
    if (!isNative) return
    try {
      await Haptics.impact({ style: ImpactStyle.Light })
    } catch {
      // Haptics desteklenmiyor, sessizce devam et
    }
  }, [])

  /** Orta tıklama hissi — buton tıklama */
  const impactMedium = useCallback(async () => {
    if (!isNative) return
    try {
      await Haptics.impact({ style: ImpactStyle.Medium })
    } catch { /* intentional */ }
  }, [])

  /** Güçlü tıklama — hata veya önemli aksiyon */
  const impactHeavy = useCallback(async () => {
    if (!isNative) return
    try {
      await Haptics.impact({ style: ImpactStyle.Heavy })
    } catch { /* intentional */ }
  }, [])

  /** Başarı bildirimi — öğün kaydedildi, analiz tamamlandı */
  const notificationSuccess = useCallback(async () => {
    if (!isNative) return
    try {
      await Haptics.notification({ type: NotificationType.Success })
    } catch { /* intentional */ }
  }, [])

  /** Hata bildirimi — form hatası, analiz başarısız */
  const notificationError = useCallback(async () => {
    if (!isNative) return
    try {
      await Haptics.notification({ type: NotificationType.Error })
    } catch { /* intentional */ }
  }, [])

  /** Uyarı bildirimi */
  const notificationWarning = useCallback(async () => {
    if (!isNative) return
    try {
      await Haptics.notification({ type: NotificationType.Warning })
    } catch { /* intentional */ }
  }, [])

  /** Seçim değişikliği — list scroll, toggle */
  const selectionChanged = useCallback(async () => {
    if (!isNative) return
    try {
      await Haptics.selectionChanged()
    } catch { /* intentional */ }
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
