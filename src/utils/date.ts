import type { AppLocale } from '../i18n'

/** AppLocale → BCP47 for Intl date/time formatting. */
export const BCP47_BY_LOCALE: Record<AppLocale, string> = {
  tr: 'tr-TR',
  en: 'en-US',
  de: 'de-DE',
  fr: 'fr-FR',
  es: 'es-ES',
  it: 'it-IT',
}

export function getToday(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getYesterday(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatTime(isoString: string, locale: AppLocale = 'tr'): string {
  const localeStr = BCP47_BY_LOCALE[locale] ?? 'en-US'
  return new Date(isoString).toLocaleTimeString(localeStr, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: locale === 'en',
  })
}

export function isToday(isoString: string): boolean {
  return isoString.startsWith(getToday())
}
