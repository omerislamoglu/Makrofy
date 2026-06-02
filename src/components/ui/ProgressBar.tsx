import { motion } from 'framer-motion'

export interface ProgressBarProps {
  value: number // 0 - 100
  max?: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  label?: string
  animated?: boolean
}

const sizeStyles: Record<string, string> = {
  sm: 'h-1',
  md: 'h-1.5',
  lg: 'h-2.5',
}

export default function ProgressBar({
  value,
  max = 100,
  size = 'md',
  showLabel = false,
  label,
  animated = true,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  const isOverflow = value > max

  return (
    <div className="w-full">
      {(showLabel || label) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-[11px] text-zinc-400 font-medium">{label}</span>
          )}
          {showLabel && (
            <span className="text-[11px] text-zinc-500 tabular-nums">
              {value}/{max}
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-zinc-800 rounded-full overflow-hidden ${sizeStyles[size]}`}>
        {animated ? (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`h-full rounded-full ${isOverflow ? 'bg-zinc-400' : 'bg-white'}`}
          />
        ) : (
          <div
            className={`h-full rounded-full transition-all duration-500 ${isOverflow ? 'bg-zinc-400' : 'bg-white'}`}
            style={{ width: `${percentage}%` }}
          />
        )}
      </div>
    </div>
  )
}
