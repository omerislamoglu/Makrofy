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
import { detectCurrencyInfo, formatCurrencyAmount } from '../i18n'

// ─── Product IDs ────────────────────────────────────────────────────────────
// These must match your App Store Connect / Play Store & RevenueCat setup.
export const PRODUCT_IDS = {
  pro_monthly: 'makrofy_pro_monthly',
  pro_quarterly: 'makrofy_pro_quarterly',
  pro_yearly: 'makrofy_pro_yearly',
} as const

// RevenueCat Entitlement ID (must match RevenueCat dashboard)
const ENTITLEMENT_ID = 'Makrofy Pro'

// ─── State ──────────────────────────────────────────────────────────────────

let rcInitialized = false
let rcConfigured = false
let rcDisabledWarningShown = false
let rcInitPromise: Promise<void> | null = null
let rcIdentifiedUserId: string | null = null
let rcIdentifyPromise: Promise<void> | null = null
let rcOfferingsCache: RCPackage[] | null = null
let rcOfferingsPromise: Promise<RCPackage[]> | null = null

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
  return active[ENTITLEMENT_ID] ?? Object.values(active)[0] ?? null
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
    const { customerInfo } = await Purchases.getCustomerInfo()
    const entitlement = getActiveEntitlement(customerInfo)
    return !!entitlement
  } catch (err) {
    console.warn('[RevenueCat] checkProStatus error:', err)
    return false
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
}

interface RevenueCatProduct {
  identifier: string
  title: string
  priceString: string
  price: number
  currencyCode: string
  subscriptionPeriod?: string | null
}

interface RevenueCatPackage {
  identifier: string
  product: RevenueCatProduct
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback
}

function isPurchaseCancelled(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  const record = error as { code?: unknown; message?: unknown }
  const message = typeof record.message === 'string' ? record.message.toLowerCase() : ''
  return record.code === 1 || message.includes('cancelled') || message.includes('canceled')
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
    const offerings = await Purchases.getOfferings()
    const current = offerings.current

    if (!current) {
      console.warn('[RevenueCat] No current offering')
      return []
    }

    const packages = (current.availablePackages as RevenueCatPackage[]).map((pkg) => ({
      identifier: pkg.identifier,
      productId: pkg.product.identifier,
      title: pkg.product.title,
      price: pkg.product.priceString,
      priceAmount: pkg.product.price,
      currencyCode: pkg.product.currencyCode,
      period: pkg.product.subscriptionPeriod ?? '',
    }))
    rcOfferingsCache = packages
    return packages
  } catch (err) {
    console.warn('[RevenueCat] getOfferings error:', err)
    return []
  }
}

// ─── Purchase ────────────────────────────────────────────────────────────────

export interface PurchaseResult {
  success: boolean
  isPro: boolean
  subscription?: Subscription
  error?: string
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
    const offerings = await Purchases.getOfferings()
    const current = offerings.current
    if (!current) throw new Error('No offering available')

    const pkg = current.availablePackages?.find(
      (p: RevenueCatPackage) => p.identifier === packageId || p.product.identifier === packageId
    )
    if (!pkg) throw new Error(`Package not found: ${packageId}`)

    const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg })
    const entitlement = getActiveEntitlement(customerInfo)
    const isPro = !!entitlement

    const subscription: Subscription = {
      id: entitlement?.identifier ?? createId(),
      userId: customerInfo.originalAppUserId,
      plan: productIdToPlan(pkg.product.identifier),
      status: 'active',
      platform: 'ios',
      productId: pkg.product.identifier,
      startedAt: entitlement?.originalPurchaseDate ?? new Date().toISOString(),
      expiresAt: entitlement?.expirationDate ?? null,
      cancelledAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return { success: true, isPro, subscription }
  } catch (err: unknown) {
    // User cancelled purchase
    if (isPurchaseCancelled(err)) {
      return { success: false, isPro: false, error: 'cancelled' }
    }
    console.error('[RevenueCat] Purchase error:', err)
    return {
      success: false,
      isPro: false,
      error: getErrorMessage(err, 'Purchase failed'),
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
    const { customerInfo } = await Purchases.restorePurchases()
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
  if (productId.includes('yearly')) return 'pro_yearly'
  if (productId.includes('quarterly')) return 'pro_quarterly'
  if (productId.includes('monthly')) return 'pro_monthly'
  return 'pro_yearly'
}

// ─── Mock / Web fallbacks ────────────────────────────────────────────────────
// For web/demo mode, we simulate RevenueCat with localStorage.

const MOCK_STORAGE_KEY = 'makrofy_rc_subscription'

function getMockPackages(): RCPackage[] {
  const rawLocale = navigator.language || 'en-US'
  const { currencyCode, monthly, quarterly, yearly } = detectCurrencyInfo(rawLocale)

  return [
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
  ]
}

async function purchaseMock(packageId: string): Promise<PurchaseResult> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 1500))

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

  const stored = localStorage.getItem(MOCK_STORAGE_KEY)
  if (stored) {
    const sub = JSON.parse(stored) as Subscription
    if (sub.status === 'active') {
      return { success: true, isPro: true, subscription: sub }
    }
  }
  return { success: false, isPro: false, error: 'No active subscription found' }
}

function checkProStatusLocal(): boolean {
  const stored = localStorage.getItem(MOCK_STORAGE_KEY)
  if (!stored) return false
  const sub = JSON.parse(stored) as Subscription
  return sub.status === 'active'
}
