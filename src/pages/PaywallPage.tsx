import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { useSubscription } from '../hooks/useSubscription'
import { useScanLimit } from '../hooks/useScanLimit'
import type { SubscriptionPlan } from '../types/subscription'
import PageHeader from '../components/ui/PageHeader'
import PaywallCard from '../components/paywall/PaywallCard'
import { useLocale } from '../contexts/LocaleContext'

export default function PaywallPage() {
  const navigate = useNavigate()
  const { strings, plans: localePlans } = useLocale()
  const s = strings.paywall
  const { user, updateProfile } = useAuth()
  const {
    packages,
    purchase,
    restore,
    refresh: refreshSubscription,
  } = useSubscription(user?.uid)
  const { refresh: refreshScanLimit } = useScanLimit(user?.uid)

  const [loading, setLoading] = useState(false)
  const [restoring, setRestoring] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | string>(
    localePlans.yearly.id
  )

  // Use RevenueCat packages if available, otherwise fallback to locale-defined plans.
  // RevenueCat returns prices from App Store Connect in the user's local currency.
  const monthlyPkg = packages.find((p) => p.period === 'P1M')
  const monthlyPrice = monthlyPkg?.priceAmount ?? 0

  const planOptions =
    packages.length > 0
      ? packages.map((pkg) => {
          const months = pkg.period === 'P1Y' ? 12 : pkg.period === 'P3M' ? 3 : 1
          const perMonth = months > 1 ? pkg.priceAmount / months : undefined
          const savingsPct = months > 1 && monthlyPrice > 0
            ? Math.round((1 - (pkg.priceAmount / months) / monthlyPrice) * 100)
            : undefined

          return {
            id: pkg.identifier || pkg.productId,
            title:
              pkg.period === 'P1Y' ? 'Yıllık'
                : pkg.period === 'P3M' ? '3 Aylık'
                : 'Aylık',
            price: pkg.price,
            period:
              pkg.period === 'P1Y' ? '/yıl'
                : pkg.period === 'P3M' ? '/3ay'
                : '/ay',
            perMonth: perMonth != null
              ? `${perMonth.toFixed(2)} ${pkg.currencyCode}/ay`
              : undefined,
            note:
              pkg.period === 'P1Y' ? 'En popüler'
                : pkg.period === 'P3M' ? '3 aylık erişim'
                : 'Aylık erişim',
            savings: savingsPct && savingsPct > 0
              ? `%${savingsPct} Tasarruf`
              : undefined,
            highlight: pkg.period === 'P1Y',
          }
        })
      : [localePlans.yearly, localePlans.quarterly, localePlans.monthly]

  const handleUpgrade = async () => {
    if (!user) return
    setLoading(true)
    setError(null)

    try {
      const result = await purchase(selectedPlan)

      if (result.success) {
        updateProfile({ isPro: true })
        refreshSubscription()
        refreshScanLimit()
        navigate('/')
      } else if (result.error && result.error !== 'cancelled') {
        setError(result.error)
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
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
        refreshSubscription()
        refreshScanLimit()
        navigate('/')
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
    navigate(-1)
  }

  return (
    <div className="min-h-screen bg-black px-5 pt-14 pb-6 max-w-lg mx-auto">
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

        <PaywallCard
          features={s.features as { label: string; highlighted?: boolean }[]}
          plans={planOptions}
          selectedPlanId={selectedPlan}
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
        />
      </motion.div>
    </div>
  )
}
