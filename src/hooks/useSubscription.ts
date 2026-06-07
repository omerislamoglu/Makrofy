import { useState, useCallback, useEffect } from 'react'
import { Subscription, SubscriptionPlan } from '../types/subscription'
import {
  getSubscription,
  saveSubscription,
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
import { createId } from '../utils/id'

export function useSubscription(userId: string | undefined) {
  const [subscription, setSubscription] = useState<Subscription | null>(() => {
    if (!userId) return null
    return getSubscription(userId)
  })
  const [packages, setPackages] = useState<RCPackage[]>([])
  const [loadingPackages, setLoadingPackages] = useState(false)

  const isPro = userId ? isProUserSync(userId) : false

  // Initialize RevenueCat & load offerings when userId is available
  useEffect(() => {
    if (!userId) return

    let cancelled = false

    async function init() {
      await initRevenueCat(userId!)
      await identifyUser(userId!)

      try {
        const sync = await syncSubscriptionStatus(userId!)
        if (!cancelled && sync.isPro) {
          const syncedSubscription: Subscription = {
            id: `server_${userId}`,
            userId: userId!,
            plan: 'pro_yearly',
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
        }
      } catch (err) {
        console.warn('[useSubscription] Server subscription sync skipped:', err)
      }

      setLoadingPackages(true)
      try {
        const offerings = await getOfferings()
        if (!cancelled) setPackages(offerings)
      } catch (err) {
        console.warn('[useSubscription] Failed to load offerings:', err)
      } finally {
        if (!cancelled) setLoadingPackages(false)
      }
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
      const months = plan === 'pro_yearly' ? 12 : plan === 'pro_quarterly' ? 3 : 1
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
    packages,
    loadingPackages,
    purchase,
    restore,
    activate,
    cancel,
    refresh,
  }
}
