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
    const entitlement = customerInfo.entitlements.active[ENTITLEMENT_ID]
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
      return getMockPackages()
    }

    const packages = current.availablePackages.map((pkg: any) => ({
      identifier: pkg.identifier as string,
      productId: pkg.product.identifier as string,
      title: pkg.product.title as string,
      price: pkg.product.priceString as string,
      priceAmount: pkg.product.price as number,
      currencyCode: pkg.product.currencyCode as string,
      period: (pkg.product.subscriptionPeriod ?? '') as string,
    }))
    rcOfferingsCache = packages
    return packages
  } catch (err) {
    console.warn('[RevenueCat] getOfferings error:', err)
    return getMockPackages()
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
    return { success: false, isPro: false, error: 'Abonelikler şu anda aktif değil' }
  }
  if (!rcInitialized) await initRevenueCat()
  if (!rcConfigured) {
    return { success: false, isPro: false, error: 'Abonelikler şu anda aktif değil' }
  }

  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor')
    const offerings = await Purchases.getOfferings()
    const current = offerings.current
    if (!current) throw new Error('No offering available')

    const pkg = current.availablePackages?.find(
      (p: any) => p.identifier === packageId || p.product.identifier === packageId
    )
    if (!pkg) throw new Error(`Package not found: ${packageId}`)

    const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg })
    const isPro = !!customerInfo.entitlements.active[ENTITLEMENT_ID]

    const entitlement = customerInfo.entitlements.active[ENTITLEMENT_ID]
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
  } catch (err: any) {
    // User cancelled purchase
    if (err?.code === 1 || err?.message?.includes('cancelled') || err?.message?.includes('canceled')) {
      return { success: false, isPro: false, error: 'cancelled' }
    }
    console.error('[RevenueCat] Purchase error:', err)
    return {
      success: false,
      isPro: false,
      error: err?.message || 'Satın alma başarısız',
    }
  }
}

// ─── Restore Purchases ───────────────────────────────────────────────────────

export async function restorePurchases(): Promise<PurchaseResult> {
  if (!Capacitor.isNativePlatform()) {
    return restoreMock()
  }

  if (!isRevenueCatProductionConfigured()) {
    return { success: false, isPro: false, error: 'Abonelikler şu anda aktif değil' }
  }
  if (!rcInitialized) await initRevenueCat()
  if (!rcConfigured) {
    return { success: false, isPro: false, error: 'Abonelikler şu anda aktif değil' }
  }

  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor')
    const { customerInfo } = await Purchases.restorePurchases()
    const isPro = !!customerInfo.entitlements.active[ENTITLEMENT_ID]

    if (isPro) {
      const entitlement = customerInfo.entitlements.active[ENTITLEMENT_ID]
      const subscription: Subscription = {
        id: entitlement?.identifier ?? createId(),
        userId: customerInfo.originalAppUserId,
        plan: 'pro_yearly', // best guess from restore
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

    return { success: false, isPro: false, error: 'Aktif abonelik bulunamadı' }
  } catch (err: any) {
    console.error('[RevenueCat] Restore error:', err)
    return {
      success: false,
      isPro: false,
      error: err?.message || 'Geri yükleme başarısız',
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
  return [
    {
      identifier: 'pro_yearly',
      productId: PRODUCT_IDS.pro_yearly,
      title: 'Makrofy Pro Yıllık',
      price: '₺899,99/yıl',
      priceAmount: 899.99,
      currencyCode: 'TRY',
      period: 'P1Y',
    },
    {
      identifier: 'pro_quarterly',
      productId: PRODUCT_IDS.pro_quarterly,
      title: 'Makrofy Pro 3 Aylık',
      price: '₺349,99/3ay',
      priceAmount: 349.99,
      currencyCode: 'TRY',
      period: 'P3M',
    },
    {
      identifier: 'pro_monthly',
      productId: PRODUCT_IDS.pro_monthly,
      title: 'Makrofy Pro Aylık',
      price: '₺149,99/ay',
      priceAmount: 149.99,
      currencyCode: 'TRY',
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
  return { success: false, isPro: false, error: 'Aktif abonelik bulunamadı' }
}

function checkProStatusLocal(): boolean {
  const stored = localStorage.getItem(MOCK_STORAGE_KEY)
  if (!stored) return false
  const sub = JSON.parse(stored) as Subscription
  return sub.status === 'active'
}
