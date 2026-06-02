import { motion } from 'framer-motion'
import { Check, Crown } from 'lucide-react'
import Button from '../ui/Button'
import Badge from '../ui/Badge'

export interface PaywallFeature {
  label: string
  highlighted?: boolean
}

export interface PaywallPlan {
  id: string
  title: string
  price: string
  period: string
  perMonth?: string
  note: string
  savings?: string
  highlight?: boolean
}

export interface PaywallCardProps {
  features: PaywallFeature[]
  plans: PaywallPlan[]
  selectedPlanId: string
  onSelectPlan: (id: string) => void
  upgradeLabel?: string
  restoreLabel?: string
  dismissLabel?: string
  disclaimer?: string
  proFeaturesLabel?: string
  onUpgrade: () => void
  onRestore?: () => void
  onDismiss?: () => void
  loading?: boolean
  restoring?: boolean
}

export default function PaywallCard({
  features,
  plans,
  selectedPlanId,
  onSelectPlan,
  upgradeLabel = 'Start Pro',
  restoreLabel = 'Restore Purchase',
  dismissLabel = 'Maybe Later',
  disclaimer = 'Cancel anytime · No commitment · Billed through your platform',
  proFeaturesLabel = 'Pro Features',
  onUpgrade,
  onRestore,
  onDismiss,
  loading = false,
  restoring = false,
}: PaywallCardProps) {
  return (
    <div className="space-y-5">
      {/* Feature list */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800/50"
      >
        <div className="flex items-center gap-2 mb-5">
          <Crown size={16} className="text-white" />
          <span className="text-sm font-semibold">{proFeaturesLabel}</span>
        </div>
        <div className="space-y-3.5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + i * 0.06 }}
              className="flex items-center gap-3"
            >
              <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <Check size={11} className="text-black" strokeWidth={3} />
              </div>
              <span
                className={`text-sm ${
                  feature.highlighted ? 'text-white font-medium' : 'text-zinc-300'
                }`}
              >
                {feature.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Plan selector */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="space-y-2.5"
      >
        {plans.map((plan) => {
          const isSelected = plan.id === selectedPlanId
          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => onSelectPlan(plan.id)}
              className={`
                w-full rounded-2xl p-4 border text-left flex items-center gap-3
                transition-all duration-200 active:scale-[0.99]
                ${isSelected
                  ? 'bg-white/[0.06] border-white'
                  : 'bg-zinc-900 border-zinc-800/50 hover:border-zinc-700'
                }
              `}
            >
              {/* Radio */}
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  isSelected ? 'border-white' : 'border-zinc-600'
                }`}
              >
                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
              </div>

              {/* Plan info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-semibold text-zinc-100">{plan.title}</span>
                  {plan.savings && (
                    <Badge variant="pro" size="sm">{plan.savings}</Badge>
                  )}
                </div>
                <p className="text-[12px] text-zinc-500 mt-0.5">{plan.note}</p>
              </div>

              {/* Price */}
              <div className="text-right flex-shrink-0">
                <p className="text-[17px] font-bold tracking-tight text-zinc-100">
                  {plan.price}
                  <span className="text-[12px] font-medium text-zinc-500">{plan.period}</span>
                </p>
                {plan.perMonth && (
                  <p className="text-[11px] text-zinc-500">{plan.perMonth}</p>
                )}
              </div>
            </button>
          )
        })}
      </motion.div>

      {/* CTA buttons */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="space-y-3"
      >
        <Button
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          onClick={onUpgrade}
        >
          {upgradeLabel}
        </Button>

        {onRestore && (
          <Button
            variant="ghost"
            size="md"
            fullWidth
            loading={restoring}
            onClick={onRestore}
          >
            {restoreLabel}
          </Button>
        )}

        {onDismiss && (
          <Button
            variant="ghost"
            size="md"
            fullWidth
            onClick={onDismiss}
          >
            {dismissLabel}
          </Button>
        )}
      </motion.div>

      <p className="text-center text-[11px] text-zinc-600 leading-relaxed">
        {disclaimer}
      </p>
    </div>
  )
}
