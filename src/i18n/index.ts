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
  symbol: string
  monthly: number
  quarterly: number
  yearly: number
}

const CURRENCY_MAP: Record<string, CurrencyPricing> = {
  // Türkiye — App Store Connect fiyatları
  tr: { symbol: '₺', monthly: 149.99, quarterly: 349.99, yearly: 999.99 },
  // AB ülkeleri
  de: { symbol: '€', monthly: 4.99, quarterly: 11.99, yearly: 29.99 },
  fr: { symbol: '€', monthly: 4.99, quarterly: 11.99, yearly: 29.99 },
  it: { symbol: '€', monthly: 4.99, quarterly: 11.99, yearly: 29.99 },
  es: { symbol: '€', monthly: 4.99, quarterly: 11.99, yearly: 29.99 },
  nl: { symbol: '€', monthly: 4.99, quarterly: 11.99, yearly: 29.99 },
  pt: { symbol: '€', monthly: 4.99, quarterly: 11.99, yearly: 29.99 },
  pl: { symbol: '€', monthly: 4.99, quarterly: 11.99, yearly: 29.99 },
  ro: { symbol: '€', monthly: 4.99, quarterly: 11.99, yearly: 29.99 },
  el: { symbol: '€', monthly: 4.99, quarterly: 11.99, yearly: 29.99 },
  // İngiltere
  'en-gb': { symbol: '£', monthly: 3.99, quarterly: 9.99, yearly: 24.99 },
  // Diğer / ABD
  default: { symbol: '$', monthly: 4.99, quarterly: 11.99, yearly: 29.99 },
}

export function detectCurrencyInfo(rawLocale: string): CurrencyPricing {
  const lower = rawLocale.toLowerCase()
  // Tam eşleşme önce (örn. en-GB)
  if (CURRENCY_MAP[lower]) return CURRENCY_MAP[lower]
  // Dil kodu eşleşmesi (örn. "de-AT" → "de")
  const lang = lower.split('-')[0]
  return CURRENCY_MAP[lang] ?? CURRENCY_MAP['default']
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
function formatPrice(symbol: string, amount: number, locale: AppLocale): string {
  const isInt = Number.isInteger(amount)
  const nf = new Intl.NumberFormat(locale === 'tr' ? 'tr-TR' : 'en-US', {
    minimumFractionDigits: isInt ? 0 : 2,
    maximumFractionDigits: 2,
  })
  return `${symbol}${nf.format(amount)}`
}

export function buildLocaleConfig(locale: AppLocale): LocaleConfig {
  const rawLocale = navigator.language || 'en'
  const pricing = detectCurrencyInfo(rawLocale)
  const { symbol, monthly, quarterly, yearly } = pricing

  const strings = locale === 'tr' ? tr : en
  const isTr = locale === 'tr'

  const fmt = (n: number) => formatPrice(symbol, n, locale)

  // İndirim oranlarını App Store Connect fiyatlarından hesapla
  const quarterlyPerMonth = quarterly / 3
  const quarterlyPct = Math.round((1 - quarterlyPerMonth / monthly) * 100)

  const yearlyPerMonth = yearly / 12
  const yearlyPct = Math.round((1 - yearlyPerMonth / monthly) * 100)

  return {
    locale,
    currency: symbol,
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
