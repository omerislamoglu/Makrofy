import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { isNative } from '../hooks/useCapacitor'
import { useAuth } from '../hooks/useAuth'
import { useSubscription } from '../hooks/useSubscription'
import { useScanLimit } from '../hooks/useScanLimit'
import type { SubscriptionPlan } from '../types/subscription'
import PageHeader from '../components/ui/PageHeader'
import PaywallCard from '../components/paywall/PaywallCard'
import { useLocale } from '../contexts/LocaleContext'
import { formatCurrencyAmount } from '../i18n'

export default function PaywallPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { strings, plans: localePlans } = useLocale()
  const s = strings.paywall
  const commonPerMonth = strings.common.perMonth
  const { user, updateProfile } = useAuth()
  const {
    packages,
    loadingPackages,
    purchase,
    restore,
    refresh: refreshSubscription,
  } = useSubscription(user?.uid)
  const { refresh: refreshScanLimit } = useScanLimit(user?.uid, user?.isPro)

  const [loading, setLoading] = useState(false)
  const [restoring, setRestoring] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | string>(
    localePlans.yearly.id
  )

  // Native must use real RevenueCat/App Store products. Web can use locale fallback.
  const monthlyPkg = packages.find((p) => p.period === 'P1M')
  const monthlyPrice = monthlyPkg?.priceAmount ?? 0
  const canUseFallbackPlans = !isNative

  const planOptions = useMemo(
    () => packages.length > 0
      ? packages.map((pkg) => {
          const months = pkg.period === 'P1Y' ? 12 : pkg.period === 'P3M' ? 3 : 1
          const perMonth = months > 1 ? pkg.priceAmount / months : undefined
          const savingsPct = months > 1 && monthlyPrice > 0
            ? Math.round((1 - (pkg.priceAmount / months) / monthlyPrice) * 100)
            : undefined

          return {
            id: pkg.identifier || pkg.productId,
            title:
              pkg.period === 'P1Y' ? s.yearly
                : pkg.period === 'P3M' ? s.quarterly
                : s.monthly,
            price: pkg.price,
            period:
              pkg.period === 'P1Y' ? s.perYear
                : pkg.period === 'P3M' ? s.per3Months
                : s.perMonthShort,
            perMonth: perMonth != null
              ? `${formatCurrencyAmount(perMonth, pkg.currencyCode)}${commonPerMonth}`
              : undefined,
            note:
              pkg.period === 'P1Y' ? s.mostPopular
                : pkg.period === 'P3M' ? s.quarterlyAccess
                : s.monthlyAccess,
            savings: savingsPct && savingsPct > 0
              ? s.savings(savingsPct)
              : undefined,
            highlight: pkg.period === 'P1Y',
          }
        })
      : canUseFallbackPlans
        ? [localePlans.yearly, localePlans.quarterly, localePlans.monthly]
        : [],
    [canUseFallbackPlans, commonPerMonth, localePlans.monthly, localePlans.quarterly, localePlans.yearly, monthlyPrice, packages, s]
  )

  const selectedPlanExists = planOptions.some((plan) => plan.id === selectedPlan)
  const defaultPlan = planOptions.find((plan) => plan.id.toLowerCase().includes('year')) ?? planOptions[0]
  const effectiveSelectedPlan = selectedPlanExists ? selectedPlan : defaultPlan?.id ?? selectedPlan
  const hasPurchasablePlan = planOptions.some((plan) => plan.id === effectiveSelectedPlan)
  const productsUnavailable = isNative && !loadingPackages && planOptions.length === 0

  const handleUpgrade = async () => {
    if (!user) return
    if (!hasPurchasablePlan) {
      setError(productsUnavailable ? s.productsUnavailable : s.selectPlan)
      return
    }
    setLoading(true)
    setError(null)

    try {
      const result = await purchase(effectiveSelectedPlan)

      if (result.success) {
        updateProfile({ isPro: true })
        void refreshSubscription()
        void refreshScanLimit()
        navigate('/add', { replace: true, state: { tab: 'scan', proReady: true } })
      } else if (result.error && result.error !== 'cancelled') {
        setError(result.error)
      }
    } catch {
      setError(s.errorGeneric)
    } finally {
      setLoading(false)
    }
  }

  const handleRestore = async () => {
    if (!user) return
    setRestoring(true)
    setError(null)

    try {
      const result = await restore()

      if (result.success) {
        updateProfile({ isPro: true })
        void refreshSubscription()
        void refreshScanLimit()
        navigate('/add', { replace: true, state: { tab: 'scan', proReady: true } })
      } else {
        setError(result.error || s.noActiveSubscription)
      }
    } catch {
      setError(s.restoreFailed)
    } finally {
      setRestoring(false)
    }
  }

  const handleDismiss = () => {
    if (location.key === 'default') {
      navigate('/', { replace: true })
    } else {
      navigate(-1)
    }
  }

  return (
    <div className="bg-black px-5 pt-14 pb-6 max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PageHeader
          showBack
          title={s.title}
          subtitle={s.subtitle}
          size="large"
        />

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        {productsUnavailable && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 mb-4">
            <p className="text-zinc-400 text-sm text-center">{s.productsUnavailable}</p>
          </div>
        )}

        {isNative && loadingPackages && planOptions.length === 0 && (
          <div className="flex items-center justify-center gap-2 py-6 mb-4">
            <div className="w-4 h-4 border-2 border-zinc-600 border-t-white rounded-full animate-spin" />
            <p className="text-zinc-400 text-sm">{s.loadingPlans}</p>
          </div>
        )}

        <PaywallCard
          features={s.features as { label: string; highlighted?: boolean }[]}
          plans={planOptions}
          selectedPlanId={effectiveSelectedPlan}
          onSelectPlan={(id) => setSelectedPlan(id as SubscriptionPlan)}
          upgradeLabel={s.upgrade}
          restoreLabel={s.restore}
          dismissLabel={s.dismiss}
          disclaimer={s.disclaimer}
          proFeaturesLabel={s.proFeatures}
          onUpgrade={handleUpgrade}
          onRestore={handleRestore}
          onDismiss={handleDismiss}
          loading={loading}
          restoring={restoring}
          upgradeDisabled={productsUnavailable || !hasPurchasablePlan}
        />
      </motion.div>
    </div>
  )
}
