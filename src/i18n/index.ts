import tr from './locales/tr'
import type { AppStrings } from './locales/types'
import en from './locales/en'
import de from './locales/de'
import fr from './locales/fr'
import es from './locales/es'
import it from './locales/it'

export type AppLocale = 'tr' | 'en' | 'de' | 'fr' | 'es' | 'it'

const STRINGS_BY_LOCALE: Record<AppLocale, AppStrings> = {
  tr,
  en,
  de,
  fr,
  es,
  it,
}

/** İlk açılış dil ekranında ve ayarlarda gösterilen dil listesi. */
export const SUPPORTED_LOCALES: { code: AppLocale; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🌐' },
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
]

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
const LANGUAGE_CHOSEN_KEY = 'makrofy_language_chosen'

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
  TR: { currencyCode: 'TRY', monthly: 199.99, quarterly: 499.99, yearly: 1299.99 },
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
const SUPPORTED_LOCALE_CODES: AppLocale[] = ['tr', 'en', 'de', 'fr', 'es', 'it']

function isSupportedLocale(value: string | null): value is AppLocale {
  return value !== null && (SUPPORTED_LOCALE_CODES as string[]).includes(value)
}

export function detectLocale(): AppLocale {
  // Manuel override (ilk açılış dil ekranı veya ayarlar). Desteklenen tüm diller
  // kalıcıdır — böylece cihaz diliyle eşleşmeyen bir dil seçen kullanıcı uygulamayı
  // yeniden açınca seçtiği dili korur.
  const override = localStorage.getItem(LOCALE_OVERRIDE_KEY)
  if (isSupportedLocale(override)) return override

  // Cihaz dili: desteklenen bir dile eşleşirse onu, yoksa İngilizce'yi kullan.
  const raw = navigator.language || 'en'
  const lang = raw.toLowerCase().split('-')[0]
  return isSupportedLocale(lang) ? lang : 'en'
}

/** İlk açılış dil ekranı daha önce gösterilip seçim yapıldı mı? */
export function hasChosenLanguage(): boolean {
  return localStorage.getItem(LANGUAGE_CHOSEN_KEY) === '1'
}

/** Kullanıcı ilk açılış ekranından dil seçtiğini işaretle. */
export function markLanguageChosen(): void {
  localStorage.setItem(LANGUAGE_CHOSEN_KEY, '1')
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

// Plan etiketleri her dil için. Fiyatlar RevenueCat/App Store'dan dinamik gelir;
// burada yalnızca metin etiketleri yerelleştirilir.
interface PlanLabels {
  proPeriod: string
  monthlyTitle: string
  monthlyPeriod: string
  monthlyNote: string
  quarterlyTitle: string
  quarterlyPeriod: string
  perMonthSuffix: string
  quarterlyNote: string
  yearlyTitle: string
  yearlyPeriod: string
  yearlyNote: string
  savings: (pct: number) => string
}

const PLAN_LABELS: Record<AppLocale, PlanLabels> = {
  tr: {
    proPeriod: 'aylık',
    monthlyTitle: 'Aylık', monthlyPeriod: '/ay', monthlyNote: 'Her ay yenilenir',
    quarterlyTitle: '3 Aylık', quarterlyPeriod: '/3 ay', perMonthSuffix: '/ay',
    quarterlyNote: '3 ayda bir ödenir',
    yearlyTitle: 'Yıllık', yearlyPeriod: '/yıl', yearlyNote: 'Yılda bir ödenir · 12 ay',
    savings: (pct) => `%${pct} indirim`,
  },
  en: {
    proPeriod: '/month',
    monthlyTitle: 'Monthly', monthlyPeriod: '/mo', monthlyNote: 'Billed monthly',
    quarterlyTitle: '3 Months', quarterlyPeriod: '/3mo', perMonthSuffix: '/mo',
    quarterlyNote: 'Billed every 3 months',
    yearlyTitle: 'Yearly', yearlyPeriod: '/yr', yearlyNote: 'Billed annually · 12 months',
    savings: (pct) => `Save ${pct}%`,
  },
  de: {
    proPeriod: '/Monat',
    monthlyTitle: 'Monatlich', monthlyPeriod: '/Mon', monthlyNote: 'Monatliche Abrechnung',
    quarterlyTitle: '3 Monate', quarterlyPeriod: '/3 Mon', perMonthSuffix: '/Mon',
    quarterlyNote: 'Abrechnung alle 3 Monate',
    yearlyTitle: 'Jährlich', yearlyPeriod: '/Jahr', yearlyNote: 'Jährliche Abrechnung · 12 Monate',
    savings: (pct) => `${pct}% sparen`,
  },
  fr: {
    proPeriod: '/mois',
    monthlyTitle: 'Mensuel', monthlyPeriod: '/mois', monthlyNote: 'Facturé chaque mois',
    quarterlyTitle: '3 mois', quarterlyPeriod: '/3 mois', perMonthSuffix: '/mois',
    quarterlyNote: 'Facturé tous les 3 mois',
    yearlyTitle: 'Annuel', yearlyPeriod: '/an', yearlyNote: 'Facturé chaque année · 12 mois',
    savings: (pct) => `-${pct} %`,
  },
  es: {
    proPeriod: '/mes',
    monthlyTitle: 'Mensual', monthlyPeriod: '/mes', monthlyNote: 'Facturación mensual',
    quarterlyTitle: '3 meses', quarterlyPeriod: '/3 meses', perMonthSuffix: '/mes',
    quarterlyNote: 'Facturación cada 3 meses',
    yearlyTitle: 'Anual', yearlyPeriod: '/año', yearlyNote: 'Facturación anual · 12 meses',
    savings: (pct) => `Ahorra ${pct}%`,
  },
  it: {
    proPeriod: '/mese',
    monthlyTitle: 'Mensile', monthlyPeriod: '/mese', monthlyNote: 'Fatturazione mensile',
    quarterlyTitle: '3 mesi', quarterlyPeriod: '/3 mesi', perMonthSuffix: '/mese',
    quarterlyNote: 'Fatturazione ogni 3 mesi',
    yearlyTitle: 'Annuale', yearlyPeriod: '/anno', yearlyNote: 'Fatturazione annuale · 12 mesi',
    savings: (pct) => `Risparmia ${pct}%`,
  },
}

export function buildLocaleConfig(locale: AppLocale): LocaleConfig {
  const rawLocale = navigator.language || 'en'
  const pricing = detectCurrencyInfo(rawLocale)
  const { currencyCode, monthly, quarterly, yearly } = pricing

  const strings = STRINGS_BY_LOCALE[locale] ?? en
  const L = PLAN_LABELS[locale] ?? PLAN_LABELS.en

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
    proPeriod: L.proPeriod,
    plans: {
      monthly: {
        id: 'pro_monthly',
        title: L.monthlyTitle,
        price: fmt(monthly),
        period: L.monthlyPeriod,
        note: L.monthlyNote,
      },
      quarterly: {
        id: 'pro_quarterly',
        title: L.quarterlyTitle,
        price: fmt(quarterly),
        period: L.quarterlyPeriod,
        perMonth: `${fmt(quarterlyPerMonth)}${L.perMonthSuffix}`,
        note: L.quarterlyNote,
        savings: L.savings(quarterlyPct),
      },
      yearly: {
        id: 'pro_yearly',
        title: L.yearlyTitle,
        price: fmt(yearly),
        period: L.yearlyPeriod,
        perMonth: `${fmt(yearlyPerMonth)}${L.perMonthSuffix}`,
        note: L.yearlyNote,
        savings: L.savings(yearlyPct),
        highlight: true,
      },
    },
    strings,
  }
}

/** React dışı bağlamlarda (ör. bildirim servisi) bir dilin metinlerini al. */
export function getStrings(locale: AppLocale): AppStrings {
  return STRINGS_BY_LOCALE[locale] ?? en
}

export { tr, en, de, fr, es, it }
