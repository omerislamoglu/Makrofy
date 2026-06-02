import { motion } from 'framer-motion'

export interface NutritionStatProps {
  label: string
  value: number
  goal?: number
  unit?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'ring' | 'bar' | 'compact'
  animationDelay?: number
}

export default function NutritionStat({
  label,
  value,
  goal,
  unit = 'g',
  size = 'md',
  variant = 'ring',
  animationDelay = 0,
}: NutritionStatProps) {
  const progress = goal ? Math.min(value / goal, 1) : 0

  if (variant === 'compact') {
    return (
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-400">{label}</span>
        <span className="text-xs font-medium tabular-nums">
          {value}
          {goal && <span className="text-zinc-500">/{goal}</span>}
          <span className="text-zinc-500 ml-0.5">{unit}</span>
        </span>
      </div>
    )
  }

  if (variant === 'bar') {
    return (
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-medium">
            {label}
          </span>
          <span className="text-xs font-medium tabular-nums">
            {value}
            <span className="text-zinc-500">
              {goal ? `/${goal}` : ''} {unit}
            </span>
          </span>
        </div>
        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{
              duration: 0.8,
              delay: animationDelay,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="h-full bg-white rounded-full"
          />
        </div>
      </div>
    )
  }

  // Ring variant
  const dimensions = { sm: 64, md: 80, lg: 96 }
  const strokes = { sm: 4, md: 6, lg: 7 }
  const ringSize = dimensions[size]
  const strokeWidth = strokes[size]
  const radius = (ringSize - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - progress)

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: ringSize, height: ringSize }}>
        <svg width={ringSize} height={ringSize} className="-rotate-90">
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={radius}
            fill="none"
            stroke="#27272a"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={radius}
            fill="none"
            stroke="#ffffff"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{
              duration: 1,
              delay: animationDelay,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-semibold tabular-nums ${size === 'lg' ? 'text-lg' : size === 'md' ? 'text-sm' : 'text-xs'}`}>
            {value}
          </span>
        </div>
      </div>
      <span className="text-[10px] text-zinc-400 uppercase tracking-wider">
        {label}
        {unit && ` (${unit})`}
      </span>
    </div>
  )
}
