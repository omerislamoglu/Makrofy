import { useState, useCallback, useEffect } from 'react'
import { Subscription, SubscriptionPlan, getPlanTier } from '../types/subscription'
import {
  getSubscription,
  saveSubscription,
  clearLocalSubscription,
  cancelSubscription,
  isProUserSync,
  purchaseSubscription,
  restorePurchase,
  syncSubscriptionStatus,
  getOfferings,
  initRevenueCat,
  identifyUser,
  type RCPackage,
  type PurchaseResult,
} from '../services/subscriptionService'
import { getStorePlaceholder } from '../services/revenueCatService'
import { persistUserProfile } from '../services/authService'
import { createId } from '../utils/id'
import { Capacitor } from '@capacitor/core'

export function useSubscription(userId: string | undefined) {
  const [subscription, setSubscription] = useState<Subscription | null>(() => {
    if (!userId) return null
    return getSubscription(userId)
  })
  // Web'de mağazayı yer tutucu fiyatlarla anında doldur (demo amaçlı).
  // Native'de ASLA yer tutucu fiyat gösterme — gerçek App Store fiyatları
  // RevenueCat'ten gelene kadar boş kalır (loading), sonra gerçek paketler.
  const [packages, setPackages] = useState<RCPackage[]>(() =>
    Capacitor.isNativePlatform() ? [] : getStorePlaceholder()
  )
  const [loadingPackages, setLoadingPackages] = useState(() => Capacitor.isNativePlatform())

  const isPro = userId ? isProUserSync(userId) : false
  // Default an unknown-but-paid plan to the lower paid tier ('plus'), never
  // 'pro' — otherwise a Plus subscriber whose plan hasn't loaded yet would be
  // shown Pro and granted Pro-only features (photo program, 5/5 scans).
  const planTier = isPro ? getPlanTier(subscription?.plan || 'plus_monthly') : 'free'

  // Initialize RevenueCat & load offerings when userId is available
  useEffect(() => {
    if (!userId) return

    let cancelled = false

    async function init() {
      await initRevenueCat(userId!)
      await identifyUser(userId!)

      // Load store offerings and sync server status CONCURRENTLY — they are
      // independent, and gating real prices behind the 1-3s server sync made the
      // paywall show placeholder prices far longer than necessary.
      setLoadingPackages(true)

      const offeringsPromise = getOfferings()
        .then((offerings) => {
          if (!cancelled) setPackages(offerings)
        })
        .catch((err) => {
          console.warn('[useSubscription] Failed to load offerings:', err)
        })
        .finally(() => {
          if (!cancelled) setLoadingPackages(false)
        })

      const syncPromise = syncSubscriptionStatus(userId!)
        .then((sync) => {
          if (cancelled) return
          if (sync.isPro) {
            const syncedSubscription: Subscription = {
              id: `server_${userId}`,
              userId: userId!,
              plan: sync.planTier === 'plus' ? 'plus_yearly' : 'pro_yearly',
              status: 'active',
              platform: 'ios',
              startedAt: new Date().toISOString(),
              expiresAt: sync.expiresAt ?? null,
              cancelledAt: null,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
            saveSubscription(userId!, syncedSubscription)
            setSubscription(syncedSubscription)
          } else {
            // The server is authoritative: it reports NO active entitlement
            // (RevenueCat + Firestore checked, with a cached-paid fallback that
            // already protects real subscribers from transient misses). So any
            // local subscription is stale — clear it instead of leaving a Pro/
            // Plus tier the user no longer holds (the source of "still shows Pro
            // 5/5" after a sandbox/account change). Network failures throw and
            // are handled below, so we never downgrade on a failed sync.
            //
            // Grace window: a JUST-purchased subscription can briefly precede
            // RevenueCat's API propagation, so the server may momentarily miss
            // it. Never clear a subscription created in the last 10 minutes —
            // that protects a fresh purchase from a transient lookup lag. A
            // genuinely-stale record is always hours/days old.
            const local = getSubscription(userId!)
            const created = local?.createdAt
            const createdAtMs =
              typeof created === 'string'
                ? new Date(created).getTime()
                : created && typeof created.toMillis === 'function'
                  ? created.toMillis()
                  : 0
            const isRecentPurchase = createdAtMs > 0 && Date.now() - createdAtMs < 10 * 60 * 1000
            if (!isRecentPurchase) {
              clearLocalSubscription(userId!)
              // Also clear the legacy profile pro flag so useScanLimit's bridge
              // doesn't keep granting a paid scan limit to a now-free user.
              persistUserProfile({ uid: userId!, isPro: false })
              setSubscription(null)
            }
          }
        })
        .catch((err) => {
          console.warn('[useSubscription] Server subscription sync skipped:', err)
        })

      await Promise.allSettled([offeringsPromise, syncPromise])
    }

    init()
    return () => { cancelled = true }
  }, [userId])

  const purchase = useCallback(
    async (planOrPackageId: SubscriptionPlan | string): Promise<PurchaseResult> => {
      if (!userId) return { success: false, isPro: false, error: 'No user' }

      const result = await purchaseSubscription(userId, planOrPackageId)

      if (result.success && result.subscription) {
        setSubscription(result.subscription)
      }

      return result
    },
    [userId]
  )

  const restore = useCallback(async (): Promise<PurchaseResult> => {
    if (!userId) return { success: false, isPro: false, error: 'No user' }

    const result = await restorePurchase(userId)

    if (result.success && result.subscription) {
      setSubscription(result.subscription)
    }

    return result
  }, [userId])

  // Legacy activate (for backward compat)
  const activate = useCallback(
    (plan: SubscriptionPlan) => {
      if (!userId) return null
      const now = new Date().toISOString()
      const expiresAt = new Date()
      const months = plan.endsWith('_yearly') ? 12 : plan.endsWith('_quarterly') ? 3 : 1
      expiresAt.setMonth(expiresAt.getMonth() + months)

      const sub: Subscription = {
        id: createId(),
        userId,
        plan,
        status: 'active',
        platform: 'web',
        startedAt: now,
        expiresAt: expiresAt.toISOString(),
        cancelledAt: null,
        createdAt: now,
        updatedAt: now,
      }
      saveSubscription(userId, sub)
      setSubscription(sub)
      return sub
    },
    [userId]
  )

  const cancel = useCallback(() => {
    if (!userId) return
    cancelSubscription(userId)
    setSubscription(getSubscription(userId))
  }, [userId])

  const refresh = useCallback(() => {
    if (!userId) return
    setSubscription(getSubscription(userId))
  }, [userId])

  return {
    subscription,
    isPro,
    planTier,
    packages,
    loadingPackages,
    purchase,
    restore,
    activate,
    cancel,
    refresh,
  }
}
