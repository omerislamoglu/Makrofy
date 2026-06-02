import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react'
import {
  type AppLocale,
  type LocaleConfig,
  detectLocale,
  setLocaleOverride,
  getLocaleOverride,
  buildLocaleConfig,
} from '../i18n'

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
  const isEnglishOverride = getLocaleOverride() === 'en'

  return (
    <LocaleContext.Provider value={{ ...config, changeLocale, isEnglishOverride }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used inside <LocaleProvider>')
  return ctx
}
