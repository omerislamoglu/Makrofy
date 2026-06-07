import { motion } from 'framer-motion'
import { Trash2, PenLine, Sparkles } from 'lucide-react'
import { Meal, ConfidenceLevel } from '../../types/meal'
import { formatTime } from '../../utils/date'
import Badge from '../ui/Badge'

function resolveTimestamp(ts: unknown): string {
  if (typeof ts === 'string') return ts
  if (ts && typeof ts === 'object' && 'toDate' in ts) {
    return (ts as { toDate(): Date }).toDate().toISOString()
  }
  return new Date().toISOString()
}

export interface MealCardProps {
  meal: Meal
  onDelete?: (id: string) => void
  onTap?: (meal: Meal) => void
  animationDelay?: number
}

export default function MealCard({ meal, onDelete, onTap, animationDelay = 0 }: MealCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{
        duration: 0.35,
        delay: animationDelay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      onClick={() => onTap?.(meal)}
      className={`
        bg-zinc-900 rounded-2xl p-4 border border-zinc-800/50
        transition-all duration-200
        ${onTap ? 'cursor-pointer hover:bg-zinc-800/80 hover:border-zinc-700/50 active:scale-[0.99]' : ''}
      `}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {meal.source === 'ai_scan' ? (
            <Sparkles size={13} className="text-zinc-400" />
          ) : (
            <PenLine size={13} className="text-zinc-400" />
          )}
          <span className="text-[11px] text-zinc-500 font-medium">
            {formatTime(resolveTimestamp(meal.createdAt))}
          </span>
          {meal.confidence && (
            <ConfidenceBadge level={meal.confidence} />
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-lg font-bold tabular-nums">
            {meal.totalMacros.calories}
          </span>
          <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-medium">
            kcal
          </span>
        </div>
      </div>

      {/* Food items */}
      <div className="space-y-1 mb-3">
        {meal.items.slice(0, 4).map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <p className="text-[13px] text-zinc-200 truncate flex-1 mr-3">
              {item.name}
            </p>
            <span className="text-[11px] text-zinc-500 tabular-nums flex-shrink-0">
              {item.grams}g
            </span>
          </div>
        ))}
        {meal.items.length > 4 && (
          <p className="text-[11px] text-zinc-500">
            +{meal.items.length - 4} more
          </p>
        )}
      </div>

      {/* Macro footer */}
      <div className="flex items-center justify-between pt-3 border-t border-zinc-800/40">
        <div className="flex gap-4">
          <MacroLabel label="P" value={meal.totalMacros.protein} />
          <MacroLabel label="C" value={meal.totalMacros.carbs} />
          <MacroLabel label="F" value={meal.totalMacros.fat} />
        </div>

        {onDelete && (
          <button type="button"
            onClick={(e) => { e.stopPropagation(); onDelete(meal.id) }}
            className="p-1.5 -mr-1 rounded-lg hover:bg-zinc-800 active:bg-zinc-700 transition-colors"
          >
            <Trash2 size={14} className="text-zinc-600 hover:text-zinc-400 transition-colors" />
          </button>
        )}
      </div>
    </motion.div>
  )
}

function MacroLabel({ label, value }: { label: string; value: number }) {
  return (
    <span className="text-[11px] text-zinc-400 tabular-nums">
      <span className="text-zinc-500 font-medium">{label}</span> {value}g
    </span>
  )
}

function ConfidenceBadge({ level }: { level: ConfidenceLevel }) {
  return (
    <Badge variant="outline" size="sm">
      {level}
    </Badge>
  )
}
