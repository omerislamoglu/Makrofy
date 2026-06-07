import { useState, useEffect, useMemo, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Plus, ChevronRight, Sparkles, Flame, Zap, Target, Trash2 } from 'lucide-react'
import { useHaptics } from '../hooks/useCapacitor'
import { useAuth } from '../hooks/useAuth'
import type { Meal, MealType } from '../types/meal'
import type { FitnessGoal } from '../types/user'
import { useTodayMeals } from '../hooks/useMeals'
import { useScanLimit } from '../hooks/useScanLimit'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import ProgressBar from '../components/ui/ProgressBar'
import { useLocale } from '../contexts/LocaleContext'

// ─── Tip tanımları ──────────────────────────────────────────────────────────

interface HomeDailyGoal {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
}

interface MacroCardProps {
  label: string
  current: number
  goal: number
  unit?: string
  color: string
  delay: number
}

// ─── Varsayılan hedef (henüz kişiselleştirilmemiş kullanıcılar için) ─────────

const DEFAULT_DAILY_GOAL: HomeDailyGoal = {
  calories: 2200,
  protein: 150,
  carbs: 250,
  fat: 70,
  fiber: 30,
}


// ─── Yardımcı bileşenler ────────────────────────────────────────────────────

function MacroRing({ label, current, goal, color, delay }: MacroCardProps) {
  const progress = Math.min(current / goal, 1)
  const size = 56
  const strokeWidth = 5
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - progress)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      className="flex flex-col items-center gap-1.5"
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#27272a" strokeWidth={strokeWidth} />
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.2, delay: delay + 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs font-bold tabular-nums">{current}</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-medium">{label}</p>
        <p className="text-[10px] text-zinc-600 tabular-nums">/ {goal}g</p>
      </div>
    </motion.div>
  )
}

function MealPreviewCard({
  meal,
  index,
  onClick,
  isDeleting,
  onDeleteRequest,
}: {
  meal: Meal
  index: number
  onClick: () => void
  isDeleting: boolean
  onDeleteRequest: (id: string) => void
}) {
  const { strings, locale } = useLocale()
  const haptics = useHaptics()
  const createdAt = typeof meal.createdAt === 'string'
    ? meal.createdAt
    : meal.createdAt?.toDate?.().toISOString() ?? new Date().toISOString()
  const time = new Date(createdAt).toLocaleTimeString(locale === 'tr' ? 'tr-TR' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const MEAL_LABELS: Record<MealType, string> = {
    breakfast: strings.mealType.breakfast,
    lunch: strings.mealType.lunch,
    dinner: strings.mealType.dinner,
    snack: strings.mealType.snack,
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: isDeleting ? 0.5 : 1, y: 0 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.35, delay: 0.4 + index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={onClick}
      className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800/50 hover:bg-zinc-800/60 transition-colors duration-200 cursor-pointer"
    >
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center">
            {meal.source === 'ai_scan' ? (
              <Sparkles size={13} className="text-zinc-400" />
            ) : (
              <Plus size={13} className="text-zinc-400" />
            )}
          </div>
          <div>
            <p className="text-[13px] font-medium text-zinc-100">{MEAL_LABELS[meal.mealType]}</p>
            <p className="text-[10px] text-zinc-500">{time}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="text-right">
            <span className="text-base font-bold tabular-nums">{meal.totalMacros?.calories ?? 0}</span>
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-medium ml-1">kcal</span>
          </div>
          <ChevronRight size={14} className="text-zinc-600" />
        </div>
      </div>

      <div className="mb-3">
        <p className="text-[11px] text-zinc-400 truncate">
          {meal.items.map((item) => item.name).join(' · ')}
        </p>
      </div>

      <div className="flex items-center justify-between pt-2.5 border-t border-zinc-800/40">
        <div className="flex gap-3">
          <MacroLabel label="P" value={meal.totalMacros?.protein ?? 0} />
          <MacroLabel label="K" value={meal.totalMacros?.carbs ?? 0} />
          <MacroLabel label="Y" value={Math.round(meal.totalMacros?.fat ?? 0)} />
          <MacroLabel label="L" value={meal.totalMacros?.fiber ?? 0} />
        </div>
        <button
          type="button"
          disabled={isDeleting}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            haptics.impactMedium()
            if (import.meta.env.DEV) console.log('[MEAL_DELETE] clicked', { mealId: meal.id })
            onDeleteRequest(meal.id)
          }}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-red-500/10 active:bg-red-500/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {isDeleting ? (
            <div className="w-4 h-4 border-2 border-zinc-600 border-t-red-400 rounded-full animate-spin" />
          ) : (
            <Trash2 size={16} />
          )}
        </button>
      </div>
    </motion.div>
  )
}

function MacroLabel({ label, value }: { label: string; value: number }) {
  return (
    <span className="text-[11px] text-zinc-400 tabular-nums">
      <span className="text-zinc-500 font-semibold">{label}</span>{' '}
      {value}g
    </span>
  )
}

// ─── Kişiselleştirilmiş hedef banner ─────────────────────────────────────────

function GoalBanner({ goal }: { goal: FitnessGoal }) {
  const { strings } = useLocale()
  const g = strings.goals
  const navigate = useNavigate()
  const haptics = useHaptics()

  const config: Record<FitnessGoal, { emoji: string; label: string; desc: string; color: string }> = {
    lose_weight: { emoji: '🔥', label: g.loseWeight, desc: g.loseWeightDesc, color: 'border-orange-500/20 bg-orange-500/5' },
    maintain:    { emoji: '⚖️', label: g.maintain,   desc: g.maintainDesc,   color: 'border-zinc-700/60 bg-zinc-900/60' },
    gain_weight: { emoji: '💪', label: g.gainWeight, desc: g.gainWeightDesc, color: 'border-blue-500/20 bg-blue-500/5' },
  }
  const c = config[goal]

  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.22 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => { haptics.impactLight(); navigate('/profile') }}
      className={`w-full rounded-xl px-4 py-3 border ${c.color} flex items-center justify-between mb-4`}
    >
      <div className="flex items-center gap-2.5">
        <span className="text-lg">{c.emoji}</span>
        <div className="text-left">
          <p className="text-[13px] font-semibold text-zinc-200">{c.label}</p>
          <p className="text-[11px] text-zinc-500">{c.desc}</p>
        </div>
      </div>
      <ChevronRight size={14} className="text-zinc-600 flex-shrink-0" />
    </motion.button>
  )
}

// ─── Ana bileşen ────────────────────────────────────────────────────────────

export default function HomePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const haptics = useHaptics()
  const { strings, locale } = useLocale()
  const { user } = useAuth()
  const { meals, todayMacros, refresh, deleteMeal } = useTodayMeals(user?.uid)
  const { limit, isPro } = useScanLimit(user?.uid, user?.isPro)
  const didMountRef = useRef(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showDeleteToast, setShowDeleteToast] = useState(false)
  const [deleteError, setDeleteError] = useState(false)

  const handleDeleteRequest = (mealId: string) => {
    if (deletingId) return
    setDeleteTarget(mealId)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget || deletingId) return
    if (import.meta.env.DEV) console.log('[MEAL_DELETE] confirm', { mealId: deleteTarget })
    setDeletingId(deleteTarget)
    setDeleteTarget(null)
    try {
      await deleteMeal(deleteTarget)
      if (import.meta.env.DEV) console.log('[MEAL_DELETE] success', { mealId: deleteTarget })
      setShowDeleteToast(true)
      setTimeout(() => setShowDeleteToast(false), 2000)
    } catch (err) {
      console.error('[MEAL_DELETE] error full', err)
      setDeleteError(true)
      setTimeout(() => setDeleteError(false), 3000)
    } finally {
      setDeletingId(null)
    }
  }

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true
      return
    }
    if (user?.uid) {
      void refresh()
    }
  }, [location.key, refresh, user?.uid])

  // Kullanıcının kişisel hedefi varsa onu kullan, yoksa varsayılan
  const DAILY_GOAL: HomeDailyGoal = useMemo(() => {
    if (!user?.dailyGoal) return DEFAULT_DAILY_GOAL
    return {
      calories: user.dailyGoal.calories,
      protein:  user.dailyGoal.protein,
      carbs:    user.dailyGoal.carbs,
      fat:      user.dailyGoal.fat,
      fiber:    25, // fiber DailyGoal tipinde yok, sabit tutuyoruz
    }
  }, [user?.dailyGoal])

  const displayedMeals = meals.slice(0, 3)

  const remaining = Math.max(0, DAILY_GOAL.calories - todayMacros.calories)
  const calorieProgress = (todayMacros.calories / DAILY_GOAL.calories) * 100

  return (
    <div className="px-5 pt-14 pb-8 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        {/* ── Başlık ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <p className="text-zinc-500 text-[11px] uppercase tracking-widest font-medium">
              {new Date().toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
            <h1 className="text-[26px] font-bold tracking-tight mt-0.5">{strings.history.today}</h1>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800/60 flex items-center justify-center"
          >
            <Flame size={18} className="text-zinc-400" />
          </motion.div>
        </motion.div>

        {/* ── Günlük Kalori Özeti ──────────────────────────────────── */}
        <Card variant="elevated" padding="lg" className="mb-4" animationDelay={0.05}>
          <div className="flex items-end justify-between mb-5">
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium mb-1">{strings.home.remaining}</p>
              <div className="flex items-baseline gap-1.5">
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-4xl font-bold tabular-nums tracking-tight"
                >
                  {remaining}
                </motion.span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">kcal</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium mb-0.5">{strings.home.consumed}</p>
              <p className="text-lg font-semibold tabular-nums">
                {todayMacros.calories}
                <span className="text-[10px] text-zinc-500 ml-1">/ {DAILY_GOAL.calories}</span>
              </p>
            </div>
          </div>

          <ProgressBar value={calorieProgress} max={100} size="lg" />

          <div className="flex justify-around mt-6 pt-5 border-t border-zinc-800/40">
            <MacroRing label={strings.common.protein} current={todayMacros.protein} goal={DAILY_GOAL.protein} unit="g" color="#ffffff" delay={0.15} />
            <MacroRing label={strings.common.carbs} current={todayMacros.carbs} goal={DAILY_GOAL.carbs} unit="g" color="#a1a1aa" delay={0.25} />
            <MacroRing label={strings.common.fat} current={Math.round(todayMacros.fat)} goal={DAILY_GOAL.fat} unit="g" color="#71717a" delay={0.35} />
            <MacroRing label={strings.common.fiber} current={todayMacros.fiber} goal={DAILY_GOAL.fiber} unit="g" color="#52525b" delay={0.45} />
          </div>
        </Card>

        {/* ── Aksiyon Butonları ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="grid grid-cols-2 gap-3 mb-4"
        >
          <Button id="scan-meal-button" variant="primary" size="lg" fullWidth icon={<Camera size={18} />} onClick={() => { haptics.impactMedium(); navigate('/add') }}>
            {strings.home.scanMeal}
          </Button>
          <Button id="add-manually-button" variant="secondary" size="lg" fullWidth icon={<Plus size={18} />} onClick={() => { haptics.impactLight(); navigate('/add', { state: { tab: 'manual' } }) }}>
            {strings.home.addMeal}
          </Button>
        </motion.div>

        {/* ── Kişisel Hedef Bannerı (varsa) veya ücretsiz tarama ── */}
        {user?.bodyMetrics?.goal ? (
          <GoalBanner goal={user.bodyMetrics.goal} />
        ) : (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.25 }}
            onClick={() => navigate('/paywall')}
            className="w-full bg-zinc-900/70 rounded-xl px-4 py-3 border border-zinc-800/40 flex items-center justify-between mb-4 cursor-pointer hover:bg-zinc-800/50 transition-all duration-200 active:scale-[0.99] text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                <Zap size={14} className="text-white" />
              </div>
              <div>
                <p className="text-[13px] font-medium text-zinc-100">
                  {isPro
                    ? strings.home.proScansBadge
                    : strings.home.freeScansBadge(limit?.remaining ?? 0)}
                </p>
                <p className="text-[10px] text-zinc-500">{strings.scanBanner.usedSubtitle}</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-zinc-600" />
          </motion.button>
        )}

        {/* ── Hedef Kur CTA (bodyMetrics yoksa) ─────────────────────── */}
        {!user?.bodyMetrics && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.3 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { haptics.impactLight(); navigate('/profile') }}
            className="w-full bg-zinc-900 rounded-xl px-4 py-3 border border-zinc-800/40 flex items-center gap-3 mb-8 text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0">
              <Target size={14} className="text-zinc-400" />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-medium text-zinc-200">{strings.goals.notSetup}</p>
              <p className="text-[11px] text-zinc-500 truncate">{strings.goals.notSetupDesc}</p>
            </div>
            <ChevronRight size={14} className="text-zinc-600 flex-shrink-0" />
          </motion.button>
        )}
        {user?.bodyMetrics && <div className="mb-4" />}

        {/* ── Son Öğünler ───────────────────────────────────────── */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <motion.button
              onClick={() => { haptics.selectionChanged(); navigate('/history') }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="flex items-center gap-1"
            >
              <h2 className="text-base font-semibold tracking-tight">{strings.home.recentMeals}</h2>
              <ChevronRight size={14} className="text-zinc-500 mt-px" />
            </motion.button>
            <motion.button
              onClick={() => { haptics.selectionChanged(); navigate('/history') }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="text-[11px] text-zinc-500 tabular-nums active:text-zinc-300 transition-colors"
            >
              {meals.length} {strings.home.records}
            </motion.button>
          </div>
          {displayedMeals.length > 0 ? (
            <div className="space-y-3">
              {displayedMeals.map((meal, i) => (
                <MealPreviewCard
                  key={meal.id}
                  meal={meal}
                  index={i}
                  onClick={() => { haptics.impactLight(); navigate('/history') }}
                  isDeleting={deletingId === meal.id}
                  onDeleteRequest={handleDeleteRequest}
                />
              ))}
            </div>
          ) : (
            <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800/40 px-4 py-6 text-center">
              <p className="text-[13px] text-zinc-400">{strings.home.noMeals}</p>
              <p className="text-[11px] text-zinc-600 mt-1">{strings.home.noMealsSubtitle}</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Delete confirmation modal */}
      {deleteTarget !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-8"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" onClick={() => !deletingId && setDeleteTarget(null)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="relative bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 w-full max-w-xs shadow-xl"
          >
            <p className="text-[15px] font-semibold text-zinc-100 text-center mb-5">
              {strings.meals.deleteConfirmTitle}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 h-11 rounded-xl text-[13px] font-medium text-zinc-300 bg-zinc-800 border border-zinc-700/50 hover:bg-zinc-700 transition-all"
              >
                {strings.meals.deleteCancel}
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="flex-1 h-11 rounded-xl text-[13px] font-medium text-white bg-red-600 hover:bg-red-500 transition-all flex items-center justify-center gap-2"
              >
                <Trash2 size={14} />
                {strings.meals.deleteConfirm}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Delete toasts */}
      <AnimatePresence>
        {showDeleteToast && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-zinc-800 border border-zinc-700/50 rounded-xl px-4 py-2.5 shadow-lg"
          >
            <p className="text-[13px] text-zinc-200 font-medium whitespace-nowrap">
              {strings.meals.deleteSuccess}
            </p>
          </motion.div>
        )}
        {deleteError && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2.5 shadow-lg"
          >
            <p className="text-[13px] text-red-400 font-medium whitespace-nowrap">
              {strings.meals.deleteError}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
