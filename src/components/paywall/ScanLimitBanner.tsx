import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Zap, ChevronRight } from 'lucide-react'
import { ScanLimit } from '../../types/subscription'
import Badge from '../ui/Badge'
import { useLocale } from '../../contexts/LocaleContext'

interface ScanLimitBannerProps {
  limit: ScanLimit
  isPro?: boolean
}

export default function ScanLimitBanner({ limit, isPro = false }: ScanLimitBannerProps) {
  const navigate = useNavigate()
  const { strings } = useLocale()
  const s = strings.scanBanner

  if (limit.remaining === Infinity) return null

  if (limit.isLimited) {
    if (isPro) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full bg-zinc-900 border border-zinc-800/50 rounded-2xl p-5 text-center"
        >
          <Lock size={24} className="mx-auto mb-3 text-zinc-500" />
          <p className="text-[14px] font-semibold text-zinc-200 mb-1">
            {s.proUsedTitle}
          </p>
          <p className="text-[12px] text-zinc-500">
            {s.proUsedSubtitle}
          </p>
        </motion.div>
      )
    }

    return (
      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => navigate('/paywall')}
        className="w-full bg-zinc-900 border border-zinc-800/50 rounded-2xl p-5 text-center hover:bg-zinc-800/80 active:scale-[0.99] transition-all duration-200"
      >
        <Lock size={24} className="mx-auto mb-3 text-zinc-500" />
        <p className="text-[14px] font-semibold text-zinc-200 mb-1">
          {s.usedTitle}
        </p>
        <p className="text-[12px] text-zinc-500 mb-4">
          {s.usedSubtitle}
        </p>
        <div className="inline-flex items-center gap-1.5 text-[12px] text-zinc-400 font-medium">
          {s.upgradeLink}
          <ChevronRight size={14} />
        </div>
      </motion.button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => navigate('/paywall')}
      className="bg-zinc-900/70 rounded-xl px-4 py-3 border border-zinc-800/40 flex items-center justify-between cursor-pointer hover:bg-zinc-800/60 active:scale-[0.99] transition-all duration-200"
    >
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
          <Zap size={13} className="text-white" />
        </div>
        <span className="text-[13px] text-zinc-300">
          {isPro ? s.proRemaining(limit.remaining, limit.total) : s.remaining(limit.remaining)}
        </span>
      </div>

      <Badge variant="outline" size="sm">
        {limit.remaining}/{limit.total}
      </Badge>
    </motion.div>
  )
}
