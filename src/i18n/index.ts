import tr from './locales/tr'
import type { AppStrings } from './locales/types'
import en from './locales/en'

export type AppLocale = 'tr' | 'en'

export interface PlanDisplay {
  id: 'pro_monthly' | 'pro_quarterly' | 'pro_yearly'
  title: string        // "Aylık" / "Yıllık"
  price: string        // total price label, e.g. "₺149,99" or "₺899,99"
  period: string       // "/ay" / "/yıl"
  perMonth?: string    // quarterly/yearly only, e.g. "₺75/ay"
  note: string         // billing note
  savings?: string     // e.g. "%20 indirim"
  highlight?: boolean  // recommended plan
}

export interface LocaleConfig {
  locale: AppLocale
  currency: string
  proPrice: string      // e.g. "₺149,99" or "$4.99" (monthly, for backward compat)
  proPeriod: string     // e.g. "aylık" or "/month"
  plans: { monthly: PlanDisplay; quarterly: PlanDisplay; yearly: PlanDisplay }
  strings: AppStrings
}

const LOCALE_OVERRIDE_KEY = 'makrofy_locale_override'

// ─── Para birimi ve fiyat tespiti ────────────────────────────────────────────
// App Store Connect fiyatlarıyla birebir eşleşen sabit değerler.
// RevenueCat paketleri yüklendiğinde bunlar yerine gerçek fiyatlar gösterilir.
interface CurrencyPricing {
  currencyCode: string
  monthly: number
  quarterly: number
  yearly: number
}

const CURRENCY_MAP: Record<string, CurrencyPricing> = {
  TR: { currencyCode: 'TRY', monthly: 149.99, quarterly: 349.99, yearly: 999.99 },
  US: { currencyCode: 'USD', monthly: 4.99, quarterly: 11.99, yearly: 29.99 },
  CA: { currencyCode: 'CAD', monthly: 6.99, quarterly: 16.99, yearly: 39.99 },
  GB: { currencyCode: 'GBP', monthly: 3.99, quarterly: 9.99, yearly: 24.99 },
  AU: { currencyCode: 'AUD', monthly: 7.99, quarterly: 19.99, yearly: 49.99 },
  NZ: { currencyCode: 'NZD', monthly: 8.99, quarterly: 21.99, yearly: 54.99 },
  CH: { currencyCode: 'CHF', monthly: 4.99, quarterly: 11.99, yearly: 29.99 },
  SE: { currencyCode: 'SEK', monthly: 59, quarterly: 149, yearly: 349 },
  NO: { currencyCode: 'NOK', monthly: 59, quarterly: 149, yearly: 349 },
  DK: { currencyCode: 'DKK', monthly: 39, quarterly: 99, yearly: 249 },
  PL: { currencyCode: 'PLN', monthly: 24.99, quarterly: 59.99, yearly: 149.99 },
  CZ: { currencyCode: 'CZK', monthly: 129, quarterly: 299, yearly: 749 },
  HU: { currencyCode: 'HUF', monthly: 1990, quarterly: 4990, yearly: 11990 },
  RO: { currencyCode: 'RON', monthly: 24.99, quarterly: 59.99, yearly: 149.99 },
  BG: { currencyCode: 'BGN', monthly: 9.99, quarterly: 23.99, yearly: 59.99 },
  JP: { currencyCode: 'JPY', monthly: 700, quarterly: 1700, yearly: 4200 },
  KR: { currencyCode: 'KRW', monthly: 6900, quarterly: 16900, yearly: 39900 },
  IN: { currencyCode: 'INR', monthly: 399, quarterly: 999, yearly: 2499 },
  BR: { currencyCode: 'BRL', monthly: 24.90, quarterly: 59.90, yearly: 149.90 },
  MX: { currencyCode: 'MXN', monthly: 99, quarterly: 249, yearly: 599 },
  ZA: { currencyCode: 'ZAR', monthly: 89.99, quarterly: 219.99, yearly: 549.99 },
  SG: { currencyCode: 'SGD', monthly: 6.98, quarterly: 16.98, yearly: 39.98 },
  HK: { currencyCode: 'HKD', monthly: 38, quarterly: 98, yearly: 238 },
  AE: { currencyCode: 'AED', monthly: 19.99, quarterly: 49.99, yearly: 119.99 },
  SA: { currencyCode: 'SAR', monthly: 19.99, quarterly: 49.99, yearly: 119.99 },
  IL: { currencyCode: 'ILS', monthly: 17.90, quarterly: 44.90, yearly: 109.90 },
  UA: { currencyCode: 'UAH', monthly: 199, quarterly: 499, yearly: 1199 },
  default: { currencyCode: 'USD', monthly: 4.99, quarterly: 11.99, yearly: 29.99 },
}

const EURO_REGIONS = new Set([
  'AT', 'BE', 'CY', 'DE', 'EE', 'ES', 'FI', 'FR', 'GR', 'HR', 'IE', 'IT',
  'LT', 'LU', 'LV', 'MT', 'NL', 'PT', 'SI', 'SK',
])

const LANGUAGE_TO_REGION: Record<string, string> = {
  tr: 'TR',
  en: 'US',
  de: 'DE',
  fr: 'FR',
  it: 'IT',
  es: 'ES',
  nl: 'NL',
  pt: 'PT',
  pl: 'PL',
  ro: 'RO',
  el: 'GR',
  sv: 'SE',
  no: 'NO',
  nb: 'NO',
  da: 'DK',
  cs: 'CZ',
  hu: 'HU',
  bg: 'BG',
  ja: 'JP',
  ko: 'KR',
  hi: 'IN',
  pt_br: 'BR',
}

function getRegionFromLocale(rawLocale: string): string {
  const normalized = rawLocale.replace('_', '-')
  try {
    const parsed = new Intl.Locale(normalized)
    if (parsed.region) return parsed.region.toUpperCase()
    const language = parsed.language.toLowerCase()
    return LANGUAGE_TO_REGION[language] ?? 'US'
  } catch {
    const parts = normalized.split('-')
    if (parts[1]) return parts[1].toUpperCase()
    return LANGUAGE_TO_REGION[parts[0]?.toLowerCase() ?? ''] ?? 'US'
  }
}

export function detectCurrencyInfo(rawLocale: string): CurrencyPricing {
  const region = getRegionFromLocale(rawLocale)
  if (CURRENCY_MAP[region]) return CURRENCY_MAP[region]
  if (EURO_REGIONS.has(region)) {
    return { currencyCode: 'EUR', monthly: 4.99, quarterly: 11.99, yearly: 29.99 }
  }
  return CURRENCY_MAP.default
}

// ─── Locale tespiti ──────────────────────────────────────────────────────────
export function detectLocale(): AppLocale {
  // Manuel override (ayarlardan)
  const override = localStorage.getItem(LOCALE_OVERRIDE_KEY) as AppLocale | null
  if (override === 'en') return 'en'

  // Cihaz dili
  const raw = navigator.language || 'en'
  const lang = raw.toLowerCase().split('-')[0]
  return lang === 'tr' ? 'tr' : 'en'
}

export function setLocaleOverride(locale: AppLocale | null) {
  if (locale === null) {
    localStorage.removeItem(LOCALE_OVERRIDE_KEY)
  } else {
    localStorage.setItem(LOCALE_OVERRIDE_KEY, locale)
  }
}

export function getLocaleOverride(): AppLocale | null {
  return (localStorage.getItem(LOCALE_OVERRIDE_KEY) as AppLocale | null)
}

// ─── Locale config oluştur ───────────────────────────────────────────────────
export function formatCurrencyAmount(
  amount: number,
  currencyCode: string,
  rawLocale = navigator.language || 'en-US'
): string {
  const isInt = Number.isInteger(amount)
  return new Intl.NumberFormat(rawLocale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: isInt ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function buildLocaleConfig(locale: AppLocale): LocaleConfig {
  const rawLocale = navigator.language || 'en'
  const pricing = detectCurrencyInfo(rawLocale)
  const { currencyCode, monthly, quarterly, yearly } = pricing

  const strings = locale === 'tr' ? tr : en
  const isTr = locale === 'tr'

  const fmt = (n: number) => formatCurrencyAmount(n, currencyCode, rawLocale)

  // İndirim oranlarını App Store Connect fiyatlarından hesapla
  const quarterlyPerMonth = quarterly / 3
  const quarterlyPct = Math.round((1 - quarterlyPerMonth / monthly) * 100)

  const yearlyPerMonth = yearly / 12
  const yearlyPct = Math.round((1 - yearlyPerMonth / monthly) * 100)

  return {
    locale,
    currency: currencyCode,
    proPrice: fmt(monthly),
    proPeriod: isTr ? 'aylık' : '/month',
    plans: {
      monthly: {
        id: 'pro_monthly',
        title: isTr ? 'Aylık' : 'Monthly',
        price: fmt(monthly),
        period: isTr ? '/ay' : '/mo',
        note: isTr ? 'Her ay yenilenir' : 'Billed monthly',
      },
      quarterly: {
        id: 'pro_quarterly',
        title: isTr ? '3 Aylık' : '3 Months',
        price: fmt(quarterly),
        period: isTr ? '/3 ay' : '/3mo',
        perMonth: `${fmt(quarterlyPerMonth)}${isTr ? '/ay' : '/mo'}`,
        note: isTr ? '3 ayda bir ödenir' : 'Billed every 3 months',
        savings: isTr ? `%${quarterlyPct} indirim` : `Save ${quarterlyPct}%`,
      },
      yearly: {
        id: 'pro_yearly',
        title: isTr ? 'Yıllık' : 'Yearly',
        price: fmt(yearly),
        period: isTr ? '/yıl' : '/yr',
        perMonth: `${fmt(yearlyPerMonth)}${isTr ? '/ay' : '/mo'}`,
        note: isTr ? 'Yılda bir ödenir · 12 ay' : 'Billed annually · 12 months',
        savings: isTr ? `%${yearlyPct} indirim` : `Save ${yearlyPct}%`,
        highlight: true,
      },
    },
    strings,
  }
}

export { tr, en }
