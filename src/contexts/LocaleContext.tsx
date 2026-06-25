import { createContext, useContext, useState, useCallback, useMemo, useEffect, ReactNode } from 'react'
import { Capacitor } from '@capacitor/core'
import { Device } from '@capacitor/device'
import {
  type AppLocale,
  type LocaleConfig,
  detectLocale,
  setLocaleOverride,
  getLocaleOverride,
  buildLocaleConfig,
} from '../i18n'

const SUPPORTED_LOCALE_CODES: AppLocale[] = ['tr', 'en', 'de', 'fr', 'es', 'it']

interface LocaleContextValue extends LocaleConfig {
  /** Ayarlardan dili değiştir. null = cihaz diline dön */
  changeLocale: (locale: AppLocale | null) => void
  /** İngilizce override aktif mi? */
  isEnglishOverride: boolean
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>(detectLocale)

  const changeLocale = useCallback((next: AppLocale | null) => {
    setLocaleOverride(next)
    setLocaleState(next ?? detectLocale())
  }, [])

  const config = useMemo(() => buildLocaleConfig(locale), [locale])
  // getLocaleOverride() localStorage'dan okur; sadece locale değişince
  // yeniden hesapla (değişiklik yalnızca changeLocale üzerinden gelir).
  const isEnglishOverride = useMemo(() => getLocaleOverride() === 'en', [locale])

  // Native platformda Device.getLanguageCode() ile sistem dilini senkronize et.
  // navigator.language WebView dilini yansıtır; sistem dili değişince uygulama
  // yeniden açılana kadar güncel olmayabilir.
  useEffect(() => {
    if (getLocaleOverride() !== null) return
    if (!Capacitor.isNativePlatform()) return

    Device.getLanguageCode()
      .then(({ value }) => {
        const lang = value.toLowerCase().split('-')[0] as AppLocale
        if (SUPPORTED_LOCALE_CODES.includes(lang)) {
          setLocaleState(lang)
        }
      })
      .catch(() => {})
  }, [])

  // <html lang> öğesini seçili dile senkronla. Aksi halde CSS `text-transform`
  // ve ekran okuyucular cihaz dilini (ör. Türkçe) kullanır ve Almanca "Mi"
  // "Mİ" olarak yanlış büyük harfe çevrilir.
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  // value nesnesi her render'da yeniden oluşturulursa tüm useLocale()
  // consumer'ları gereksiz re-render alır. useMemo ile referans sabit tutulur;
  // yalnızca locale, changeLocale veya isEnglishOverride değişince güncellenir.
  const value = useMemo<LocaleContextValue>(
    () => ({ ...config, changeLocale, isEnglishOverride }),
    [config, changeLocale, isEnglishOverride],
  )

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used inside <LocaleProvider>')
  return ctx
}
