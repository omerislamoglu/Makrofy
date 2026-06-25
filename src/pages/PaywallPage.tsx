import { useMemo, useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Crown, Sparkles, Zap, X, Camera, Dumbbell, Brain, TrendingUp } from 'lucide-react'
import { isNative } from '../hooks/useCapacitor'
import { useAuth } from '../hooks/useAuth'
import { useSubscription } from '../hooks/useSubscription'
import { useScanLimit } from '../hooks/useScanLimit'
import Badge from '../components/ui/Badge'
import { useLocale } from '../contexts/LocaleContext'
import { formatCurrencyAmount } from '../i18n'
import type { AppStrings } from '../i18n/locales/types'
import { getScanCreditsForProduct, isScanPackProduct, type RCPackage } from '../services/revenueCatService'

/** Yasal sayfaları aç — native'de in-app Safari, web'de yeni sekme. */
function openExternalUrl(url: string) {
  if (isNative) {
    import('@capacitor/browser')
      .then(({ Browser }) => Browser.open({ url, presentationStyle: 'popover' }))
      .catch(() => window.open(url, '_blank'))
  } else {
    window.open(url, '_blank')
  }
}

/* ─── Types ─────────────────────────────────────────────────────────────── */

type Tier = 'plus' | 'pro'
type Period = 'P1M' | 'P3M' | 'P1Y'

type PlanProduct = {
  id: string
  productId: string
  tier: Tier
  period: Period
  price: string
  priceAmount: number
  currencyCode: string
  perMonth?: string
  savings?: number
  package?: RCPackage
}

type ScanProduct = {
  id: string
  productId: string
  credits: number
  price: string
  priceAmount: number
  perScan?: string
  highlight?: boolean
  package?: RCPackage
}

type Selection =
  | { type: 'plan'; tier: Tier; period: Period; productId: string }
  | { type: 'scan'; productId: string }

/* ─── Helpers ───────────────────────────────────────────────────────────── */

function monthsForPeriod(p: Period): number {
  return p === 'P1Y' ? 12 : p === 'P3M' ? 3 : 1
}

function periodKey(raw: string): Period {
  if (raw === 'P1Y') return 'P1Y'
  if (raw === 'P3M') return 'P3M'
  return 'P1M'
}

function buildPlanProducts(packages: RCPackage[], perMonthShort: string): PlanProduct[] {
  const subs = packages.filter((p) => !isScanPackProduct(p.productId))

  const monthlyPriceByTier: Record<Tier, number> = { plus: 0, pro: 0 }
  for (const pkg of subs) {
    const tier: Tier = pkg.productId.includes('plus') ? 'plus' : 'pro'
    if (pkg.period === 'P1M') monthlyPriceByTier[tier] = pkg.priceAmount
  }

  return subs.map((pkg) => {
    const tier: Tier = pkg.productId.includes('plus') ? 'plus' : 'pro'
    const period = periodKey(pkg.period)
    const months = monthsForPeriod(period)
    const monthly = monthlyPriceByTier[tier]
    const perMonth = months > 1
      ? `${formatCurrencyAmount(pkg.priceAmount / months, pkg.currencyCode)}${perMonthShort}`
      : undefined
    const savings = months > 1 && monthly > 0
      ? Math.round((1 - (pkg.priceAmount / months) / monthly) * 100)
      : 0

    return {
      id: pkg.identifier || pkg.productId,
      productId: pkg.productId,
      tier,
      period,
      price: pkg.price,
      priceAmount: pkg.priceAmount,
      currencyCode: pkg.currencyCode,
      perMonth,
      savings: savings > 0 ? savings : undefined,
      package: pkg,
    }
  })
}

function buildScanProducts(packages: RCPackage[]): ScanProduct[] {
  return packages
    .filter((p) => isScanPackProduct(p.productId))
    .map((pkg) => {
      const credits = getScanCreditsForProduct(pkg.productId)
      return {
        id: pkg.identifier || pkg.productId,
        productId: pkg.productId,
        credits,
        price: pkg.price,
        priceAmount: pkg.priceAmount,
        perScan: formatCurrencyAmount(pkg.priceAmount / credits, pkg.currencyCode),
        highlight: credits >= 60,
        package: pkg,
      }
    })
    .sort((a, b) => a.credits - b.credits)
}

/* ─── Feature lists ─────────────────────────────────────────────────────── */

function getFeatures(s: AppStrings['paywall']) {
  return {
    plus: [
      { icon: Camera, label: s.plusScansPerDay },
      { icon: Dumbbell, label: s.programsUnlocked },
      { icon: Brain, label: s.surveyAIProgram },
    ],
    pro: [
      { icon: Camera, label: s.proScansPerDay },
      { icon: Dumbbell, label: s.programsUnlocked },
      { icon: Brain, label: s.photoAIProgram },
      { icon: TrendingUp, label: s.biweeklyEvaluation },
    ],
  }
}

/* ─── Compact period option (for side-by-side columns) ──────────────────── */

function CompactPeriodOption({
  product,
  selected,
  onSelect,
  s,
  accentColor,
}: {
  product: PlanProduct
  selected: boolean
  onSelect: () => void
  s: AppStrings['paywall']
  accentColor: 'cyan' | 'amber'
}) {
  const periodLabels: Record<Period, string> = {
    P1M: s.periodMonthly,
    P3M: s.period3Months,
    P1Y: s.periodYearly,
  }

  const borderClass = selected
    ? accentColor === 'amber' ? 'border-amber-400 bg-amber-400/[0.08]' : 'border-cyan-400 bg-cyan-400/[0.08]'
    : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'

  const savingsClass = accentColor === 'amber'
    ? 'bg-amber-400/15 text-amber-300'
    : 'bg-cyan-400/15 text-cyan-300'

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full min-w-0 rounded-xl border px-2.5 py-2.5 text-left transition-all active:scale-[0.98] ${borderClass}`}
    >
      <div className="flex min-w-0 items-center justify-between gap-1">
        <p className="min-w-0 truncate text-[12px] font-semibold text-zinc-100">{periodLabels[product.period]}</p>
        {product.savings && (
          <span className={`shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-md ${savingsClass}`}>
            %{product.savings}
          </span>
        )}
      </div>
      <p className="mt-1 min-w-0 truncate text-[14px] font-bold leading-tight text-white sm:text-[15px]">
        {product.price}
      </p>
      {product.perMonth && (
        <p className="mt-1 min-w-0 truncate text-[10px] text-zinc-500">{product.perMonth}</p>
      )}
    </button>
  )
}

/* ─── Tier column (Plus / Pro side by side) ─────────────────────────────── */

function TierColumn({
  tier,
  products,
  features,
  selection,
  onSelect,
  s,
  delay,
}: {
  tier: Tier
  products: PlanProduct[]
  features: { icon: typeof Camera; label: string }[]
  selection: Selection | null
  onSelect: (product: PlanProduct) => void
  s: AppStrings['paywall']
  delay: number
}) {
  const isPro = tier === 'pro'
  const accentColor: 'cyan' | 'amber' = isPro ? 'amber' : 'cyan'
  const accentText = isPro ? 'text-amber-300' : 'text-cyan-300'
  const accentBg = isPro ? 'bg-amber-400/10' : 'bg-cyan-400/10'
  const sectionBorder = isPro ? 'border-amber-500/30' : 'border-cyan-500/30'
  const headerGradient = isPro
    ? 'bg-gradient-to-b from-amber-400/[0.06] to-transparent'
    : 'bg-gradient-to-b from-cyan-400/[0.06] to-transparent'

  const sorted = [...products].sort((a, b) => monthsForPeriod(b.period) - monthsForPeriod(a.period))

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className={`relative flex min-w-0 flex-col rounded-2xl border ${sectionBorder} bg-zinc-950 overflow-hidden`}
    >
      {isPro && (
        <span className="absolute right-2.5 top-2.5 rounded-full bg-amber-400 px-2 py-0.5 text-[9px] font-bold text-black">
          {s.popular}
        </span>
      )}

      {/* Header */}
      <div className={`p-3 ${headerGradient}`}>
        <div className={`w-9 h-9 rounded-xl ${accentBg} flex items-center justify-center mb-2`}>
          {isPro
            ? <Crown size={17} className={accentText} />
            : <Sparkles size={17} className={accentText} />
          }
        </div>
        <h2 className="text-[16px] font-bold text-white leading-tight">
          {isPro ? 'Pro' : 'Plus'}
        </h2>

        {/* Features */}
        <div className="mt-2.5 space-y-1.5">
          {features.map((f) => (
            <div key={f.label} className="flex min-w-0 items-start gap-1.5">
              <f.icon size={11} className={`${accentText} mt-0.5 shrink-0`} />
              <span className="min-w-0 text-[11px] leading-tight text-zinc-400">{f.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Period options */}
      <div className="mt-auto p-2.5 pt-1 space-y-1.5">
        {sorted.map((product) => {
          const isSelected =
            selection?.type === 'plan' &&
            selection.tier === tier &&
            selection.period === product.period
          return (
            <CompactPeriodOption
              key={product.id}
              product={product}
              selected={isSelected}
              onSelect={() => onSelect(product)}
              s={s}
              accentColor={accentColor}
            />
          )
        })}
      </div>
    </motion.section>
  )
}

/* ─── Scan pack card ────────────────────────────────────────────────────── */

function ScanPackCard({
  product,
  selected,
  onSelect,
  s,
}: {
  product: ScanProduct
  selected: boolean
  onSelect: () => void
  s: AppStrings['paywall']
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full min-w-0 rounded-xl border p-3.5 text-left transition-all active:scale-[0.99] ${
        selected
          ? 'border-emerald-400 bg-emerald-400/[0.07]'
          : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        {/* Radio */}
        <div className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
          selected ? 'border-emerald-400' : 'border-zinc-600'
        }`}>
          {selected && <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <p className="min-w-0 truncate text-[13px] font-semibold text-zinc-100">{product.credits} AI Scan</p>
            {product.highlight && (
              <Badge variant="pro" size="sm">{s.bestValueBadge}</Badge>
            )}
          </div>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            {s.perScan(product.perScan ?? '')}
          </p>
        </div>

        {/* Price */}
        <div className="min-w-[72px] shrink-0 text-right">
          <p className="truncate text-[15px] font-bold text-white">{product.price}</p>
          <p className="text-[10px] text-zinc-500">{s.oneTime}</p>
        </div>
      </div>
    </button>
  )
}

/* ─── Main Page ─────────────────────────────────────────────────────────── */

export default function PaywallPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { strings } = useLocale()
  const s = strings.paywall
  const { user, updateProfile } = useAuth()
  const {
    packages,
    loadingPackages,
    purchase,
    restore,
    refresh: refreshSubscription,
  } = useSubscription(user?.uid)
  const { refresh: refreshScanLimit } = useScanLimit(user?.uid, user?.isPro)

  const [selection, setSelection] = useState<Selection | null>(null)
  const [loading, setLoading] = useState(false)
  // Synchronous in-flight guard: React's `loading` state updates async, so a
  // fast double-tap could fire two purchases before the re-render disables the
  // button. The ref blocks the second call immediately.
  const purchaseInFlight = useRef(false)
  const [restoring, setRestoring] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Ağ hatası sonrası ödeme onaylanamadıysa restore önerisi göster
  const [suggestRestore, setSuggestRestore] = useState(false)

  const planProducts = useMemo(() => buildPlanProducts(packages, s.perMonthShort), [packages, s.perMonthShort])
  const scanProducts = useMemo(() => buildScanProducts(packages), [packages])
  const features = useMemo(() => getFeatures(s), [s])

  const plusProducts = planProducts.filter((p) => p.tier === 'plus')
  const proProducts = planProducts.filter((p) => p.tier === 'pro')

  const productsUnavailable = isNative && !loadingPackages && packages.length === 0

  // Entry hint from the Profile "Market" section: 'scan' → scan packs only;
  // 'pro' → memberships only (preselect Pro); otherwise the full membership
  // paywall (preselect Pro yearly). Scan packs and memberships never show on
  // the same screen — each entry point is dedicated.
  const focusHint = (location.state as { focus?: 'scan' | 'pro' } | null)?.focus
  const mode: 'scan' | 'plans' = focusHint === 'scan' ? 'scan' : 'plans'

  const defaultSelection = useMemo<Selection | null>(() => {
    if (focusHint === 'scan' && scanProducts.length > 0) {
      const best = scanProducts.find((p) => p.highlight) ?? scanProducts[scanProducts.length - 1]
      return { type: 'scan', productId: best.id }
    }
    const yearly = (focusHint === 'pro' || focusHint === undefined
      ? proProducts.find((p) => p.period === 'P1Y') ?? proProducts[0]
      : undefined)
      ?? plusProducts.find((p) => p.period === 'P1Y')
      ?? plusProducts[0]
      ?? proProducts.find((p) => p.period === 'P1Y')
      ?? proProducts[0]
    return yearly ? { type: 'plan', tier: yearly.tier, period: yearly.period, productId: yearly.id } : null
  }, [focusHint, plusProducts, proProducts, scanProducts])

  const effectiveSelection = selection ?? defaultSelection

  // Resolve the currently selected product
  const selectedProduct = useMemo(() => {
    if (!effectiveSelection) return null
    if (effectiveSelection.type === 'scan') {
      return scanProducts.find((p) => p.id === effectiveSelection.productId) ?? null
    }
    return planProducts.find(
      (p) => p.tier === effectiveSelection.tier && p.period === effectiveSelection.period
    ) ?? null
  }, [effectiveSelection, planProducts, scanProducts])

  const handleSelectPlan = (product: PlanProduct) => {
    setSelection({ type: 'plan', tier: product.tier, period: product.period, productId: product.id })
  }

  const handleSelectScan = (product: ScanProduct) => {
    setSelection({ type: 'scan', productId: product.id })
  }

  const handlePurchase = async () => {
    if (!user || !selectedProduct) return
    if (purchaseInFlight.current) return // ignore double-taps
    purchaseInFlight.current = true
    setLoading(true)
    setError(null)
    setSuggestRestore(false)

    try {
      const result = await purchase(selectedProduct.id)

      if (result.success) {
        if (effectiveSelection?.type === 'scan') {
          void refreshScanLimit()
          navigate('/add', { replace: true, state: { tab: 'scan' } })
          return
        }

        updateProfile({ isPro: true })
        void refreshSubscription()
        void refreshScanLimit()
        navigate('/add', { replace: true, state: { tab: 'scan' } })
      } else if (result.error && result.error !== 'cancelled') {
        if (result.error === 'purchase_not_allowed') {
          setError(s.purchaseNotAllowed)
        } else if (result.shouldRestore) {
          setError(s.purchaseNetworkError)
          setSuggestRestore(true)
        } else {
          setError(result.error)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : s.errorGeneric)
    } finally {
      setLoading(false)
      purchaseInFlight.current = false
    }
  }

  const handleRestore = async () => {
    if (!user) return
    setRestoring(true)
    setError(null)
    setSuggestRestore(false)

    try {
      const result = await restore()
      if (result.success) {
        updateProfile({ isPro: true })
        void refreshSubscription()
        void refreshScanLimit()
        navigate('/add', { replace: true, state: { tab: 'scan' } })
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

  const ctaLabel = !effectiveSelection
    ? s.upgrade
    : effectiveSelection.type === 'scan'
      ? s.buyScanPack
      : effectiveSelection.tier === 'pro'
        ? s.upgradeToPro
        : s.upgradeToPlus

  const ctaAccent = !effectiveSelection || effectiveSelection.type === 'scan'
    ? ''
    : effectiveSelection.tier === 'pro'
      ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-black hover:from-amber-400 hover:to-amber-300'
      : 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-black hover:from-cyan-400 hover:to-cyan-300'

  // App Store 3.1.2: if the selected plan actually has an introductory offer
  // (free trial or discounted intro) configured in the store, show its exact
  // duration + what happens after, right next to the purchase button. Only
  // shown when the store really returns an intro — never fabricated.
  const trialNote = (() => {
    if (!selectedProduct || effectiveSelection?.type !== 'plan') return null
    const pkg = (selectedProduct as PlanProduct).package
    if (!pkg?.introPeriodUnit || !pkg.introPeriodCount) return null
    const unitMap: Record<string, 'day' | 'week' | 'month' | 'year'> = {
      DAY: 'day', WEEK: 'week', MONTH: 'month', YEAR: 'year',
    }
    const unit = unitMap[pkg.introPeriodUnit.toUpperCase()]
    if (!unit) return null
    return pkg.isFreeTrial
      ? s.freeTrialNote(pkg.introPeriodCount, unit)
      : s.introOfferNote(pkg.introPeriodCount, unit, pkg.introPriceString ?? pkg.price)
  })()

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-lg px-4 pb-[calc(var(--bottom-nav-total)+10rem)] pt-14 sm:px-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-5"
        >
          {/* ── Header ───────────────────────────────────────────────── */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[24px] font-extrabold text-white tracking-tight">
                {mode === 'scan' ? s.headerScanPacks : s.headerChoosePlan}
              </h1>
              <p className="text-[13px] text-zinc-500 mt-1">
                {mode === 'scan' ? s.subScanPacks : s.subChoosePlan}
              </p>
            </div>
            <button
              type="button"
              onClick={handleDismiss}
              className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center active:bg-zinc-800 transition-colors"
            >
              <X size={16} className="text-zinc-400" />
            </button>
          </div>

          {/* ── Alerts ───────────────────────────────────────────────── */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/10 border border-red-500/30 rounded-xl p-3"
            >
              <p className="text-red-400 text-sm text-center">{error}</p>
            </motion.div>
          )}
          {productsUnavailable && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
              <p className="text-zinc-400 text-sm text-center">{s.productsUnavailable}</p>
            </div>
          )}

          {isNative && loadingPackages && packages.length === 0 && (
            <div className="flex items-center justify-center gap-2 py-10">
              <div className="w-5 h-5 border-2 border-zinc-600 border-t-white rounded-full animate-spin" />
              <p className="text-zinc-400 text-sm">{s.loadingPlans}</p>
            </div>
          )}

          {/* ── Üyelikler: Plus ve Pro yan yana ──────────────────────── */}
          {mode === 'plans' && (plusProducts.length > 0 || proProducts.length > 0) && (
            <div>
              <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-2 px-1">
                {s.memberships}
              </p>
              <div className="grid grid-cols-2 items-stretch gap-2.5 sm:gap-3">
                {plusProducts.length > 0 && (
                  <TierColumn
                    tier="plus"
                    products={plusProducts}
                    features={features.plus}
                    selection={effectiveSelection}
                    onSelect={handleSelectPlan}
                    s={s}
                    delay={0}
                  />
                )}
                {proProducts.length > 0 && (
                  <TierColumn
                    tier="pro"
                    products={proProducts}
                    features={features.pro}
                    selection={effectiveSelection}
                    onSelect={handleSelectPlan}
                    s={s}
                    delay={0.08}
                  />
                )}
              </div>
            </div>
          )}

          {/* ── Scan Paketleri ───────────────────────────────────────── */}
          {mode === 'scan' && scanProducts.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
              className="rounded-2xl border border-emerald-500/25 bg-zinc-950 overflow-hidden"
            >
              <div className="p-4 pb-3 bg-gradient-to-r from-emerald-400/[0.04] to-transparent">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-400/10 flex items-center justify-center">
                    <Zap size={17} className="text-emerald-300" />
                  </div>
                  <div>
                    <h2 className="text-[17px] font-bold text-white">
                      {s.scanPacksTitle}
                    </h2>
                    <p className="text-[10px] text-emerald-400/60 font-medium">
                      {s.scanPacksSub}
                    </p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-zinc-800/60 mx-4" />

              <div className="p-3 space-y-2">
                {scanProducts.map((product) => (
                  <ScanPackCard
                    key={product.id}
                    product={product}
                    selected={effectiveSelection?.type === 'scan' && effectiveSelection.productId === product.id}
                    onSelect={() => handleSelectScan(product)}
                    s={s}
                  />
                ))}
              </div>
            </motion.section>
          )}

          {/* ── Footer info ──────────────────────────────────────────── */}
          <div className="text-center space-y-1.5 pt-1">
            <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500">
              <Check size={11} />
              <span>{s.cancelAnytime}</span>
            </div>
            <p className="text-[10px] text-zinc-600 leading-relaxed">{s.disclaimer}</p>
            {/* App Store Guideline 3.1.2: satın alma ekranında EULA + Gizlilik linkleri zorunlu. */}
            <p className="text-[10px] text-zinc-600">
              <button
                type="button"
                onClick={() => openExternalUrl('https://makrofy-26820.web.app/terms')}
                className="underline active:text-zinc-400"
              >
                {strings.profile.terms}
              </button>
              {' · '}
              <button
                type="button"
                onClick={() => openExternalUrl('https://makrofy-26820.web.app/privacy')}
                className="underline active:text-zinc-400"
              >
                {strings.profile.privacyPolicy}
              </button>
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── Sticky bottom CTA ──────────────────────────────────────── */}
      <div
        className="fixed left-0 right-0 z-[60] md:left-64"
        style={{ bottom: 'var(--bottom-nav-total)' }}
      >
        <div className="bg-gradient-to-t from-black via-black/98 to-transparent px-4 pb-3 pt-8 sm:px-5">
          <div className="mx-auto max-w-lg space-y-2.5">
            {trialNote && (
              <p className="text-[11px] text-zinc-300 text-center leading-relaxed px-2">{trialNote}</p>
            )}
            <button
              type="button"
              disabled={productsUnavailable || !selectedProduct || loading}
              onClick={handlePurchase}
              className={`flex min-h-[56px] w-full items-center justify-center rounded-2xl px-5 py-3.5 text-center text-[15px] font-bold leading-tight shadow-[0_12px_34px_rgba(0,0,0,0.35)] transition-all active:scale-[0.98] disabled:scale-100 disabled:opacity-40 ${
                ctaAccent || 'bg-white text-black hover:bg-zinc-200'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>{s.processing}</span>
                </div>
              ) : ctaLabel}
            </button>

            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                disabled={restoring}
                onClick={handleRestore}
                className={`min-h-9 px-1 text-[12px] font-medium transition-colors active:text-zinc-300 ${
                  suggestRestore
                    ? 'text-amber-400 underline underline-offset-2'
                    : 'text-zinc-500'
                }`}
              >
                {restoring ? s.restoringText : s.restore}
              </button>
              <span className="text-zinc-800">·</span>
              <button
                type="button"
                onClick={handleDismiss}
                className="min-h-9 px-1 text-[12px] font-medium text-zinc-500 transition-colors active:text-zinc-300"
              >
                {s.notNow}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
