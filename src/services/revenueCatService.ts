/**
 * RevenueCat Integration for Makrofy
 *
 * Handles in-app subscriptions via RevenueCat on native (iOS/Android).
 * Falls back to mock/localStorage for web/demo mode.
 *
 * Setup:
 *   1. Add VITE_REVENUECAT_API_KEY to .env (Apple API key)
 *   2. Create products in App Store Connect with IDs matching PRODUCT_IDS below
 *   3. Configure the same product IDs in RevenueCat dashboard
 */

import { Capacitor } from '@capacitor/core'
import type { Subscription, SubscriptionPlan, SubscriptionStatus } from '../types/subscription'
import { createId } from '../utils/id'
import { detectCurrencyInfo, formatCurrencyAmount, getLocaleOverride } from '../i18n'

// Mock/fallback fiyatlar için para birimi locale'i. Kullanıcı uygulama içinde
// bir dil seçtiyse (örn. cihazı İngilizce olsa bile Türkçe), fiyat para birimini
// o dile göre belirle. Aksi halde cihaz dilini kullan. (İngilizce bölge açısından
// belirsiz olduğu için cihaz diline bırakılır.)
const PRICING_LOCALE_BY_OVERRIDE: Record<string, string> = {
  tr: 'tr-TR',
  de: 'de-DE',
  fr: 'fr-FR',
  es: 'es-ES',
  it: 'it-IT',
}
function getPricingLocale(): string {
  const override = getLocaleOverride()
  if (override && PRICING_LOCALE_BY_OVERRIDE[override]) {
    return PRICING_LOCALE_BY_OVERRIDE[override]
  }
  return navigator.language || 'en-US'
}

// ─── Product IDs ────────────────────────────────────────────────────────────
// These must match your App Store Connect / Play Store & RevenueCat setup.
export const PRODUCT_IDS = {
  plus_monthly: 'com.makrofy.plus.aylik',
  plus_quarterly: 'com.makrofy.plus.ucaylik',
  plus_yearly: 'com.makrofy.plus.yillik',
  pro_monthly: 'makrofy_pro_monthly',
  pro_quarterly: 'makrofy_pro_quarterly',
  pro_yearly: 'makrofy_pro_yearly',
  scan_10: 'makrofy_scan_10',
  scan_25: 'makrofy_scan_25',
  scan_60: 'makrofy_scan_60',
} as const

// RevenueCat Entitlement IDs (must match RevenueCat dashboard)
const PRO_ENTITLEMENT_ID = 'Makrofy Pro'
const PLUS_ENTITLEMENT_ID = 'makrofy_plus'

// ─── State ──────────────────────────────────────────────────────────────────

let rcInitialized = false
let rcConfigured = false
let rcDisabledWarningShown = false
let rcInitPromise: Promise<void> | null = null
let rcIdentifiedUserId: string | null = null
let rcIdentifyPromise: Promise<void> | null = null
let rcOfferingsCache: RCPackage[] | null = null
let rcOfferingsPromise: Promise<RCPackage[]> | null = null
let rcNativePackagesCache: unknown[] | null = null
let rcLastKnownProStatus: boolean | null = null

export function getRevenueCatApiKey(): string {
  return import.meta.env.VITE_REVENUECAT_API_KEY ?? ''
}

export function isRevenueCatProductionConfigured(): boolean {
  const apiKey = getRevenueCatApiKey().trim()
  return apiKey.length > 0 && !apiKey.startsWith('test_')
}

export function isRevenueCatConfigured(): boolean {
  return rcConfigured
}

function warnRevenueCatDisabled(message = 'RevenueCat not configured, subscription features disabled'): void {
  if (rcDisabledWarningShown) return
  rcDisabledWarningShown = true
  console.warn(`[RevenueCat] ${message}`)
}

function getActiveEntitlement(customerInfo: {
  entitlements?: { active?: Record<string, {
    identifier?: string
    productIdentifier?: string
    originalPurchaseDate?: string
    expirationDate?: string | null
  }> }
}) {
  const active = customerInfo.entitlements?.active ?? {}
  return active[PRO_ENTITLEMENT_ID] ?? active[PLUS_ENTITLEMENT_ID] ?? Object.values(active)[0] ?? null
}

// ─── Initialize RevenueCat ──────────────────────────────────────────────────

export async function initRevenueCat(userId?: string): Promise<void> {
  if (rcInitialized) return
  if (rcInitPromise) return rcInitPromise

  rcInitPromise = initRevenueCatOnce(userId).finally(() => {
    rcInitPromise = null
  })
  return rcInitPromise
}

async function initRevenueCatOnce(userId?: string): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    rcInitialized = true
    rcConfigured = false
    return // Web mode — no RC needed
  }

  const apiKey = getRevenueCatApiKey().trim()
  if (!apiKey) {
    warnRevenueCatDisabled('VITE_REVENUECAT_API_KEY missing, subscription features disabled')
    rcInitialized = true
    rcConfigured = false
    return
  }
  if (apiKey.startsWith('test_')) {
    warnRevenueCatDisabled('Test Store API key detected, native billing disabled for App Store safety')
    rcInitialized = true
    rcConfigured = false
    return
  }

  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor')

    await Purchases.configure({
      apiKey,
      appUserID: userId || undefined,
      shouldShowInAppMessagesAutomatically: false,
    })

    rcInitialized = true
    rcConfigured = true
  } catch (err) {
    console.error('[RevenueCat] Init failed:', err)
    rcInitialized = true // prevent retry loop
    rcConfigured = false
  }
}

// ─── Identify user (call after login) ────────────────────────────────────────

export async function identifyUser(userId: string): Promise<void> {
  if (!Capacitor.isNativePlatform()) return
  if (rcIdentifiedUserId === userId) return
  if (rcIdentifyPromise) return rcIdentifyPromise

  rcIdentifyPromise = identifyUserOnce(userId).finally(() => {
    rcIdentifyPromise = null
  })
  return rcIdentifyPromise
}

export async function getCurrentRevenueCatAppUserId(): Promise<string | null> {
  if (!Capacitor.isNativePlatform()) return null
  if (!rcInitialized) await initRevenueCat()
  if (!rcConfigured) return null

  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor')
    const result = await (Purchases as unknown as {
      getAppUserID?: () => Promise<{ appUserID?: string }>
    }).getAppUserID?.()
    return result?.appUserID ?? null
  } catch (err) {
    console.warn('[RevenueCat] getAppUserID error:', err)
    return null
  }
}

async function identifyUserOnce(userId: string): Promise<void> {
  if (!rcInitialized) await initRevenueCat(userId)
  if (!rcConfigured) {
    warnRevenueCatDisabled('RevenueCat not configured, skipping identifyUser')
    return
  }

  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor')
    await Purchases.logIn({ appUserID: userId })
    rcIdentifiedUserId = userId
  } catch (err) {
    console.warn('[RevenueCat] identifyUser error:', err)
  }
}

// ─── Logout from RevenueCat ──────────────────────────────────────────────────

export async function logOutRevenueCat(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return
  if (!rcInitialized) await initRevenueCat()
  if (!rcConfigured) {
    warnRevenueCatDisabled('RevenueCat not configured, skipping logOut')
    return
  }

  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor')
    await Purchases.logOut()
    rcIdentifiedUserId = null
    rcOfferingsCache = null
    rcNativePackagesCache = null
    // Önbellekteki Pro durumunu sıfırla: farklı kullanıcı giriş yapınca
    // önceki kullanıcının Pro cache'i okunabilir.
    rcLastKnownProStatus = null
  } catch (err) {
    console.warn('[RevenueCat] logOut error:', err)
  }
}

// ─── Check pro status ────────────────────────────────────────────────────────

export async function checkProStatus(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) {
    return checkProStatusLocal()
  }
  if (!rcInitialized) await initRevenueCat()
  if (!rcConfigured) return false

  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor')
    const { customerInfo } = await withTimeout(
      Purchases.getCustomerInfo(),
      10_000,
      'checkProStatus',
    )
    const entitlement = getActiveEntitlement(customerInfo)
    rcLastKnownProStatus = !!entitlement
    return rcLastKnownProStatus
  } catch (err) {
    console.warn('[RevenueCat] checkProStatus error:', err)
    // Ağ hatası veya timeout: son bilinen durumu döndür (Pro kullanıcı
    // geçici bağlantı kopması yüzünden downgrade olmasın).
    return rcLastKnownProStatus ?? false
  }
}

// ─── Get available packages ──────────────────────────────────────────────────

export interface RCPackage {
  identifier: string
  productId: string
  title: string
  price: string
  priceAmount: number
  currencyCode: string
  period: string // "P1M", "P3M", "P1Y"
  /** Introductory offer (free trial or discounted intro), if the store has one. */
  introPriceString?: string
  introPriceAmount?: number
  /** "DAY" | "WEEK" | "MONTH" | "YEAR" */
  introPeriodUnit?: string
  introPeriodCount?: number
  /** True when the intro offer is a free trial (intro price == 0). */
  isFreeTrial?: boolean
}

interface RevenueCatIntroPrice {
  price: number
  priceString: string
  cycles: number
  period: string
  periodUnit: string
  periodNumberOfUnits: number
}

interface RevenueCatProduct {
  identifier: string
  title: string
  priceString: string
  price: number
  currencyCode: string
  subscriptionPeriod?: string | null
  introPrice?: RevenueCatIntroPrice | null
}

interface RevenueCatPackage {
  identifier: string
  product: RevenueCatProduct
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback
}

// RevenueCat SDK çağrıları ağ bağlantısı yoksa süresiz bloklanabilir.
// Bu yardımcı, belirlenen süre geçince promise'i reddeder.
function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`[RevenueCat] ${label} timed out after ${ms}ms`)), ms)
    ),
  ])
}

// localStorage içeriği bozulmuşsa JSON.parse exception fırlatır; güvenli parse.
function safeJsonParse<T>(str: string | null): T | null {
  if (!str) return null
  try { return JSON.parse(str) as T } catch { return null }
}

function isPurchaseCancelled(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  const record = error as { code?: unknown; message?: unknown; underlyingErrorMessage?: unknown }
  const message = typeof record.message === 'string' ? record.message.toLowerCase() : ''
  const underlying =
    typeof record.underlyingErrorMessage === 'string'
      ? record.underlyingErrorMessage.toLowerCase()
      : ''
  // PurchasesErrorCode.PurchaseCancelledError = 1
  return (
    record.code === 1 ||
    message.includes('cancelled') ||
    message.includes('canceled') ||
    underlying.includes('cancelled') ||
    underlying.includes('canceled')
  )
}

/**
 * Ebeveyn kontrolü veya satın alma kısıtlaması (PurchasesErrorCode.PurchaseNotAllowedError = 7).
 * "cancelled" değil — ayrı bir hata mesajı gösterilmeli.
 */
function isPurchaseNotAllowed(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  const record = error as { code?: unknown; message?: unknown }
  const message = typeof record.message === 'string' ? record.message.toLowerCase() : ''
  return (
    record.code === 7 ||
    message.includes('not allowed') ||
    message.includes('purchase not allowed') ||
    message.includes('parental')
  )
}

/**
 * Ağ hatası veya RevenueCat timeout → kullanıcı ücretlendirilmiş olabilir.
 * UI'da "Satın alımı geri yükle" önerisi gösterilmeli.
 */
function isNetworkRelatedError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  const record = error as { message?: unknown; code?: unknown }
  const message = typeof record.message === 'string' ? record.message.toLowerCase() : ''
  return (
    message.includes('timed out') ||
    message.includes('network') ||
    message.includes('internet') ||
    message.includes('connection') ||
    // PurchasesErrorCode.NetworkError = 5
    record.code === 5
  )
}

export async function getOfferings(): Promise<RCPackage[]> {
  if (!Capacitor.isNativePlatform()) {
    return getMockPackages()
  }
  if (rcOfferingsCache) return rcOfferingsCache
  if (rcOfferingsPromise) return rcOfferingsPromise

  rcOfferingsPromise = getOfferingsOnce().finally(() => {
    rcOfferingsPromise = null
  })
  return rcOfferingsPromise
}

async function getOfferingsOnce(): Promise<RCPackage[]> {

  if (!isRevenueCatProductionConfigured()) {
    warnRevenueCatDisabled('RevenueCat API key missing, offerings disabled')
    return []
  }
  if (!rcInitialized) await initRevenueCat()
  if (!rcConfigured) {
    warnRevenueCatDisabled('RevenueCat not configured, skipping getOfferings')
    return []
  }

  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor')
    const offerings = await withTimeout(
      Purchases.getOfferings(),
      15_000,
      'getOfferings',
    )
    const current = offerings.current

    const nativePackages = current ? (current.availablePackages as unknown[]) : []
    rcNativePackagesCache = nativePackages

    const realPackages: RCPackage[] = nativePackages
      ? nativePackages.map((nativePkg) => {
          const pkg = nativePkg as RevenueCatPackage
          const intro = pkg.product.introPrice
          return {
            identifier: pkg.identifier,
            productId: pkg.product.identifier,
            title: pkg.product.title,
            price: pkg.product.priceString,
            priceAmount: pkg.product.price,
            currencyCode: pkg.product.currencyCode,
            period: pkg.product.subscriptionPeriod ?? '',
            ...(intro
              ? {
                  introPriceString: intro.priceString,
                  introPriceAmount: intro.price,
                  introPeriodUnit: intro.periodUnit,
                  introPeriodCount: intro.periodNumberOfUnits,
                  isFreeTrial: intro.price === 0,
                }
              : {}),
          }
        })
      : []

    if (!current) {
      console.warn('[RevenueCat] No current offering')
    }

    // App Store kuralı (3.1.1 / 3.1.2): yalnızca gerçekten satın alınabilen,
    // mağazada tanımlı ürünleri ve gerçek fiyatlarını göster. RevenueCat'ten
    // dönen paketlerin dışında türetilmiş/yer tutucu fiyatlı kart GÖSTERME —
    // aksi halde kullanıcı satın alamayacağı sahte fiyatlı ürün görür.
    rcOfferingsCache = realPackages
    return realPackages
  } catch (err) {
    console.warn('[RevenueCat] getOfferings error:', err)
    // Hata durumunda native'de boş liste döndür ki paywall "ürünler şu an
    // yüklenemedi" durumunu gösterebilsin (sahte fiyat gösterme).
    return []
  }
}

// ─── Purchase ────────────────────────────────────────────────────────────────

export interface PurchaseResult {
  success: boolean
  isPro: boolean
  subscription?: Subscription
  productId?: string
  scanCredits?: number
  error?: string
  /**
   * Ödeme işlemi Apple'da onaylanmış olabilir, ancak ağ hatası nedeniyle
   * RevenueCat doğrulaması tamamlanamadı. UI, kullanıcıya "Satın alımı
   * geri yükle" seçeneği sunmalıdır.
   */
  shouldRestore?: boolean
}

export function getScanCreditsForProduct(productId: string): number {
  if (productId.includes('scan_60')) return 60
  if (productId.includes('scan_25')) return 25
  if (productId.includes('scan_10')) return 10
  return 0
}

export function isScanPackProduct(productId: string): boolean {
  return getScanCreditsForProduct(productId) > 0
}

export async function purchasePackage(packageId: string): Promise<PurchaseResult> {
  if (!Capacitor.isNativePlatform()) {
    return purchaseMock(packageId)
  }

  if (!isRevenueCatProductionConfigured()) {
    return { success: false, isPro: false, error: 'Subscriptions are currently unavailable' }
  }
  if (!rcInitialized) await initRevenueCat()
  if (!rcConfigured) {
    return { success: false, isPro: false, error: 'Subscriptions are currently unavailable' }
  }

  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor')
    let availablePackages = rcNativePackagesCache
    if (!availablePackages) {
      const offerings = await withTimeout(
        Purchases.getOfferings(),
        15_000,
        'purchasePackage:fetchOfferings',
      )
      availablePackages = (offerings.current?.availablePackages as unknown[] | undefined) ?? []
      rcNativePackagesCache = availablePackages
    }
    if (availablePackages.length === 0) throw new Error('No offering available')

    const pkg = availablePackages.find(
      (nativePkg) => {
        const p = nativePkg as RevenueCatPackage
        return p.identifier === packageId || p.product.identifier === packageId
      }
    )
    if (!pkg) throw new Error(`Package not found: ${packageId}`)

    const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg as never })
    // Entitlements changed — drop the cached offerings so the next store view
    // reflects the new state instead of the pre-purchase snapshot.
    rcOfferingsCache = null
    const purchasedPackage = pkg as RevenueCatPackage
    const scanCredits = getScanCreditsForProduct(purchasedPackage.product.identifier)
    if (scanCredits > 0) {
      return {
        success: true,
        isPro: false,
        productId: purchasedPackage.product.identifier,
        scanCredits,
      }
    }

    const entitlement = getActiveEntitlement(customerInfo)
    const isPro = !!entitlement

    const subscription: Subscription = {
      id: entitlement?.identifier ?? createId(),
      userId: customerInfo.originalAppUserId,
      plan: productIdToPlan(purchasedPackage.product.identifier),
      status: 'active',
      platform: 'ios',
      productId: purchasedPackage.product.identifier,
      startedAt: entitlement?.originalPurchaseDate ?? new Date().toISOString(),
      expiresAt: entitlement?.expirationDate ?? null,
      cancelledAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return { success: true, isPro, subscription }
  } catch (err: unknown) {
    // Kullanıcı ödeme sayfasını kapattı — hata mesajı gösterme
    if (isPurchaseCancelled(err)) {
      return { success: false, isPro: false, error: 'cancelled' }
    }
    // Ebeveyn kontrolü / cihaz kısıtlaması
    if (isPurchaseNotAllowed(err)) {
      return { success: false, isPro: false, error: 'purchase_not_allowed' }
    }
    console.error('[RevenueCat] Purchase error:', err)
    // Ağ hatası: Apple ödemeyi onaylamış olabilir ama RevenueCat
    // doğrulaması tamamlanamadı → kullanıcıya restore öneri
    return {
      success: false,
      isPro: false,
      error: getErrorMessage(err, 'Purchase failed'),
      shouldRestore: isNetworkRelatedError(err),
    }
  }
}

// ─── Restore Purchases ───────────────────────────────────────────────────────

export async function restorePurchases(): Promise<PurchaseResult> {
  if (!Capacitor.isNativePlatform()) {
    return restoreMock()
  }

  if (!isRevenueCatProductionConfigured()) {
    return { success: false, isPro: false, error: 'Subscriptions are currently unavailable' }
  }
  if (!rcInitialized) await initRevenueCat()
  if (!rcConfigured) {
    return { success: false, isPro: false, error: 'Subscriptions are currently unavailable' }
  }

  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor')
    const { customerInfo } = await withTimeout(
      Purchases.restorePurchases(),
      30_000,
      'restorePurchases',
    )
    const entitlement = getActiveEntitlement(customerInfo)
    const isPro = !!entitlement

    if (isPro) {
      const subscription: Subscription = {
        id: entitlement?.identifier ?? createId(),
        userId: customerInfo.originalAppUserId,
        plan: productIdToPlan(entitlement?.productIdentifier ?? ''),
        status: 'active',
        platform: 'ios',
        productId: entitlement?.productIdentifier ?? '',
        startedAt: entitlement?.originalPurchaseDate ?? new Date().toISOString(),
        expiresAt: entitlement?.expirationDate ?? null,
        cancelledAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      return { success: true, isPro: true, subscription }
    }

    return { success: false, isPro: false, error: 'No active subscription found' }
  } catch (err: unknown) {
    console.error('[RevenueCat] Restore error:', err)
    return {
      success: false,
      isPro: false,
      error: getErrorMessage(err, 'Restore failed'),
    }
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function productIdToPlan(productId: string): SubscriptionPlan {
  const id = productId.toLowerCase()
  const tier = id.includes('plus') ? 'plus' : 'pro'
  // Hem İngilizce (yearly/quarterly/monthly) hem Türkçe ASC eklerini (yillik/ucaylik/aylik) tanı
  if (id.includes('yearly') || id.includes('yillik')) return `${tier}_yearly` as SubscriptionPlan
  if (id.includes('quarterly') || id.includes('ucaylik')) return `${tier}_quarterly` as SubscriptionPlan
  if (id.includes('monthly') || id.includes('aylik')) return `${tier}_monthly` as SubscriptionPlan
  return 'pro_yearly'
}

// ─── Mock / Web fallbacks ────────────────────────────────────────────────────
// For web/demo mode, we simulate RevenueCat with localStorage.

const MOCK_STORAGE_KEY = 'makrofy_rc_subscription'

// ─── App Store Connect fiyat noktalarına yuvarlama ───────────────────────────
// Apple, her para birimi için sınırlı sayıda "fiyat noktası" sunar
// (ör. 229,99 TL var ama 230,00 TL yok). Türetilmiş Plus/scan fiyatlarını
// en yakın gerçek fiyat noktasına yuvarlayarak mağaza görünümünü gerçekçi tutar.
function buildPricePoints(useDecimals: boolean): number[] {
  const points: number[] = []
  if (!useDecimals) {
    // Ondalıksız para birimleri (JPY, KRW, HUF, vb.) — yuvarlak rakamlar
    for (let v = 50; v <= 900; v += 50) points.push(v)
    for (let v = 1000; v <= 9000; v += 100) points.push(v)
    for (let v = 10000; v <= 90000; v += 1000) points.push(v)
    return points
  }
  // Ondalıklı para birimleri — ",99" ile biten Apple fiyat noktaları
  for (let v = 0; v < 10; v += 1) points.push(v + 0.99) //  0,99 – 9,99
  for (let v = 10; v < 100; v += 1) points.push(v + 0.99) // 10,99 – 99,99
  for (let v = 100; v < 1000; v += 10) points.push(v + 0.99) // 109,99 – 999,99
  for (let v = 1000; v <= 10000; v += 100) points.push(v + 0.99)
  return points
}

function snapToAppStorePrice(amount: number, useDecimals: boolean): number {
  const points = buildPricePoints(useDecimals)
  let best = points[0]
  let bestDiff = Math.abs(amount - best)
  for (const p of points) {
    const diff = Math.abs(amount - p)
    if (diff < bestDiff) {
      best = p
      bestDiff = diff
    }
  }
  return best
}

// ─── StoreKit pending messages ───────────────────────────────────────────────
// shouldShowInAppMessagesAutomatically: false olduğunda StoreKit fiyat onayı
// ve fatura sorunu ekranlarını RevenueCat otomatik göstermez. Bu fonksiyonu
// uygulama ön plana geçişinde (appStateChange: isActive) çağır.
export async function showPendingStoreMessages(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return
  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor')
    await Purchases.showStoreMessages()
  } catch {
    // Kritik değil; StoreKit kendi içinde yeniden dener.
  }
}

// Mağaza yer tutucusu — paywall ekranının yüklenme beklemeden anında
// açılması için kullanılır (gerçek RevenueCat fiyatları geldiğinde değişir).
export function getStorePlaceholder(): RCPackage[] {
  return getMockPackages()
}

function getMockPackages(): RCPackage[] {
  const rawLocale = getPricingLocale()
  const { currencyCode, monthly, quarterly, yearly } = detectCurrencyInfo(rawLocale)
  const useDecimals = !Number.isInteger(monthly)
  const snap = (n: number) => snapToAppStorePrice(n, useDecimals)
  const scan10 = snap(monthly * 0.19)
  const scan25 = snap(monthly * 0.375)
  const scan60 = snap(monthly * 0.56)
  const plusYearly = snap(yearly * 0.70)
  const plusQuarterly = snap(quarterly * 0.70)
  const plusMonthly = snap(monthly * 0.70)

  return [
    {
      identifier: 'plus_yearly',
      productId: PRODUCT_IDS.plus_yearly,
      title: 'Makrofy Plus Yearly',
      price: `${formatCurrencyAmount(plusYearly, currencyCode, rawLocale)}/year`,
      priceAmount: plusYearly,
      currencyCode,
      period: 'P1Y',
    },
    {
      identifier: 'plus_quarterly',
      productId: PRODUCT_IDS.plus_quarterly,
      title: 'Makrofy Plus Quarterly',
      price: `${formatCurrencyAmount(plusQuarterly, currencyCode, rawLocale)}/3mo`,
      priceAmount: plusQuarterly,
      currencyCode,
      period: 'P3M',
    },
    {
      identifier: 'plus_monthly',
      productId: PRODUCT_IDS.plus_monthly,
      title: 'Makrofy Plus Monthly',
      price: `${formatCurrencyAmount(plusMonthly, currencyCode, rawLocale)}/mo`,
      priceAmount: plusMonthly,
      currencyCode,
      period: 'P1M',
    },
    {
      identifier: 'pro_yearly',
      productId: PRODUCT_IDS.pro_yearly,
      title: 'Makrofy Pro Yearly',
      price: `${formatCurrencyAmount(yearly, currencyCode, rawLocale)}/year`,
      priceAmount: yearly,
      currencyCode,
      period: 'P1Y',
    },
    {
      identifier: 'pro_quarterly',
      productId: PRODUCT_IDS.pro_quarterly,
      title: 'Makrofy Pro Quarterly',
      price: `${formatCurrencyAmount(quarterly, currencyCode, rawLocale)}/3mo`,
      priceAmount: quarterly,
      currencyCode,
      period: 'P3M',
    },
    {
      identifier: 'pro_monthly',
      productId: PRODUCT_IDS.pro_monthly,
      title: 'Makrofy Pro Monthly',
      price: `${formatCurrencyAmount(monthly, currencyCode, rawLocale)}/mo`,
      priceAmount: monthly,
      currencyCode,
      period: 'P1M',
    },
    {
      identifier: 'scan_10',
      productId: PRODUCT_IDS.scan_10,
      title: '10 AI Scans',
      price: formatCurrencyAmount(scan10, currencyCode, rawLocale),
      priceAmount: scan10,
      currencyCode,
      period: '',
    },
    {
      identifier: 'scan_25',
      productId: PRODUCT_IDS.scan_25,
      title: '25 AI Scans',
      price: formatCurrencyAmount(scan25, currencyCode, rawLocale),
      priceAmount: scan25,
      currencyCode,
      period: '',
    },
    {
      identifier: 'scan_60',
      productId: PRODUCT_IDS.scan_60,
      title: '60 AI Scans',
      price: formatCurrencyAmount(scan60, currencyCode, rawLocale),
      priceAmount: scan60,
      currencyCode,
      period: '',
    },
  ]
}

async function purchaseMock(packageId: string): Promise<PurchaseResult> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 1500))

  const scanCredits = getScanCreditsForProduct(packageId)
  if (scanCredits > 0) {
    return {
      success: true,
      isPro: false,
      productId: packageId,
      scanCredits,
    }
  }

  const plan = productIdToPlan(packageId)
  const now = new Date().toISOString()
  const expiresAt = new Date()
  const months = plan === 'pro_yearly' ? 12 : plan === 'pro_quarterly' ? 3 : 1
  expiresAt.setMonth(expiresAt.getMonth() + months)

  const subscription: Subscription = {
    id: createId(),
    userId: 'mock',
    plan,
    status: 'active' as SubscriptionStatus,
    platform: 'web',
    productId: packageId,
    startedAt: now,
    expiresAt: expiresAt.toISOString(),
    cancelledAt: null,
    createdAt: now,
    updatedAt: now,
  }

  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(subscription))
  return { success: true, isPro: true, subscription }
}

async function restoreMock(): Promise<PurchaseResult> {
  await new Promise((r) => setTimeout(r, 1000))

  const sub = safeJsonParse<Subscription>(localStorage.getItem(MOCK_STORAGE_KEY))
  if (sub?.status === 'active') {
    return { success: true, isPro: true, subscription: sub }
  }
  return { success: false, isPro: false, error: 'No active subscription found' }
}

function checkProStatusLocal(): boolean {
  const sub = safeJsonParse<Subscription>(localStorage.getItem(MOCK_STORAGE_KEY))
  return sub?.status === 'active'
}
