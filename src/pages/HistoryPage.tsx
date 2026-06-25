import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Sparkles, PenLine, CalendarDays, X, ChevronDown, ChevronUp, Trash2, AlertCircle } from 'lucide-react'
import type { Meal } from '../types/meal'
import type { MacroNutrients } from '../types/nutrition'
import { sumMacros, EMPTY_MACROS } from '../types/nutrition'
import { formatTime, BCP47_BY_LOCALE } from '../utils/date'
import { useHaptics } from '../hooks/useCapacitor'
import { useAuth } from '../hooks/useAuth'
import { useMealHistory } from '../hooks/useMeals'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'
import { useLocale } from '../contexts/LocaleContext'

// ─── Types ──────────────────────────────────────────────────────────────────

type SourceFilter = 'all' | 'ai_scan' | 'manual'

interface DateItem {
  dateKey: string
  dayNum: number
  dayName: string
  monthShort: string
  isToday: boolean
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function resolveTimestamp(ts: unknown): string {
  if (typeof ts === 'string') return ts
  if (ts && typeof ts === 'object' && 'toDate' in ts) {
    return (ts as { toDate(): Date }).toDate().toISOString()
  }
  return new Date().toISOString()
}


// ─── Sub-components ─────────────────────────────────────────────────────────

function DateSelector({
  dates,
  selected,
  onSelect,
}: {
  dates: DateItem[]
  selected: string
  onSelect: (dateKey: string) => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const selectedRef = useRef<HTMLButtonElement>(null)
  const haptics = useHaptics()
  const { strings } = useLocale()

  useEffect(() => {
    if (selectedRef.current && scrollRef.current) {
      const container = scrollRef.current
      const el = selectedRef.current
      const scrollLeft = el.offsetLeft - container.offsetWidth / 2 + el.offsetWidth / 2
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' })
    }
  }, [selected])

  return (
    <div
      ref={scrollRef}
      className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide smooth-scroll-area"
    >
      {dates.map((d) => {
        const isActive = d.dateKey === selected
        return (
          <button type="button"
            key={d.dateKey}
            ref={isActive ? selectedRef : undefined}
            onClick={() => { haptics.selectionChanged(); onSelect(d.dateKey) }}
            className={[
              'flex flex-col items-center flex-shrink-0 w-[52px] py-2.5 rounded-2xl transition-colors duration-75 touch-manipulation',
              isActive
                ? 'bg-white text-black'
                : 'bg-zinc-900 text-zinc-400 border border-zinc-800/50 hover:bg-zinc-800/80',
            ].join(' ')}
          >
            <span className={[
              'text-[10px] uppercase tracking-wider font-medium',
              isActive ? 'text-black/60' : 'text-zinc-600',
            ].join(' ')}>
              {d.isToday ? strings.history.today : d.dayName}
            </span>
            <span className={[
              'text-lg font-bold tabular-nums leading-tight mt-0.5',
              isActive ? 'text-black' : 'text-zinc-300',
            ].join(' ')}>
              {d.dayNum}
            </span>
            <span className={[
              'text-[9px] uppercase tracking-widest font-medium',
              isActive ? 'text-black/50' : 'text-zinc-600',
            ].join(' ')}>
              {d.monthShort}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function FilterBar({
  active,
  onChange,
}: {
  active: SourceFilter
  onChange: (f: SourceFilter) => void
}) {
  const { strings } = useLocale()
  const filters: { key: SourceFilter; label: string }[] = [
    { key: 'all', label: strings.history.filterAll },
    { key: 'ai_scan', label: strings.add.tabScan },
    { key: 'manual', label: strings.add.tabManual },
  ]

  return (
    <div className="flex gap-2">
      {filters.map(({ key, label }) => (
        <button type="button"
          key={key}
          onClick={() => onChange(key)}
          className={[
            'h-8 px-3.5 rounded-xl text-xs font-medium transition-all duration-150',
            active === key
              ? 'bg-white text-black'
              : 'bg-zinc-900 text-zinc-400 border border-zinc-800/50 hover:bg-zinc-800/80',
          ].join(' ')}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

function SearchBar({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const { strings } = useLocale()
  return (
    <div className="relative">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
        <Search size={15} />
      </div>
      <input
        type="text"
        placeholder={strings.add.searchPlaceholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-zinc-900 border border-zinc-800/50 rounded-xl pl-10 pr-9 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600/30 transition-all duration-200"
      />
      {value && (
        <button type="button"
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}

function DaySummaryCard({ totals, mealCount }: { totals: MacroNutrients; mealCount: number }) {
  const { strings } = useLocale()
  const mealWord = strings.history.mealWord(mealCount)
  return (
    <Card variant="subtle" padding="md" animated={false}>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tabular-nums tracking-tight">
              {totals.calories}
            </span>
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-medium">
              {strings.common.kcal}
            </span>
          </div>
          <p className="text-[10px] text-zinc-600 mt-0.5">
            {mealCount} {mealWord}
          </p>
        </div>
        <div className="flex gap-5">
          <MacroStat label="P" value={totals.protein} />
          <MacroStat label="K" value={totals.carbs} />
          <MacroStat label="Y" value={Math.round(totals.fat)} />
        </div>
      </div>
    </Card>
  )
}

function MacroStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-sm font-bold tabular-nums">{value}</span>
      <span className="text-[9px] text-zinc-500 font-medium">{label}</span>
    </div>
  )
}

function HistoryMealCard({
  meal,
  deletingId,
  onDeleteRequest,
}: {
  meal: Meal
  deletingId: string | null
  onDeleteRequest: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const haptics = useHaptics()
  const { strings } = useLocale()
  const time = formatTime(resolveTimestamp(meal.createdAt))
  const mealLabel = strings.mealType[meal.mealType]
  const isDeleting = deletingId === meal.id

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isDeleting ? 0.5 : 1, y: 0 }}
      exit={{ opacity: 0, x: -12, transition: { duration: 0.1 } }}
      transition={{
        duration: 0.12,
        ease: 'easeOut',
      }}
      className="bg-zinc-900 rounded-2xl border border-zinc-800/50 overflow-hidden"
    >
      <div
        className="p-4 cursor-pointer active:bg-zinc-800/40 transition-colors duration-75 touch-manipulation"
        onClick={() => { haptics.impactLight(); setExpanded((v) => !v) }}
      >
        {/* Top row: type + source, time + calories */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-medium text-zinc-200">
              {mealLabel}
            </span>
            <Badge
              variant={meal.source === 'ai_scan' ? 'pro' : 'outline'}
              size="sm"
              icon={meal.source === 'ai_scan'
                ? <Sparkles size={8} />
                : <PenLine size={8} />
              }
            >
              {meal.source === 'ai_scan' ? 'AI' : strings.meals.manualSource}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tabular-nums">
                {meal.totalMacros?.calories ?? 0}
              </span>
              <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-medium">
                kcal
              </span>
            </div>
            <div className="text-zinc-500">
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </div>
          </div>
        </div>

        {/* Food items preview */}
        {!expanded && (
          <div className="mb-2.5">
            <p className="text-[11px] text-zinc-400 truncate">
              {meal.items.map((item) => item.name).join(' · ')}
            </p>
          </div>
        )}

        {/* Footer: macros + time + delete */}
        <div className="flex items-center justify-between pt-2.5 border-t border-zinc-800/40">
          <div className="flex gap-4">
            <MacroLabel label="P" value={meal.totalMacros?.protein ?? 0} />
            <MacroLabel label="K" value={meal.totalMacros?.carbs ?? 0} />
            <MacroLabel label="Y" value={Math.round(meal.totalMacros?.fat ?? 0)} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-600 tabular-nums">{time}</span>
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
              className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-red-500/10 active:bg-red-500/20 transition-colors duration-75 disabled:opacity-30 disabled:cursor-not-allowed touch-manipulation"
            >
              {isDeleting ? (
                <div className="w-4 h-4 border-2 border-zinc-600 border-t-red-400 rounded-full animate-spin" />
              ) : (
                <Trash2 size={16} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded: individual item details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-zinc-800/40 space-y-2">
              {meal.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-zinc-800/40 rounded-xl px-3 py-2.5"
                >
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="text-[12px] font-medium text-zinc-200 truncate">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-zinc-500 tabular-nums">
                      {item.grams}g
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] text-zinc-400 tabular-nums">
                      <span className="text-zinc-500 font-medium">P</span>{item.macros.protein}g
                    </span>
                    <span className="text-[10px] text-zinc-400 tabular-nums">
                      <span className="text-zinc-500 font-medium">C</span>{item.macros.carbs}g
                    </span>
                    <span className="text-[10px] text-zinc-400 tabular-nums">
                      <span className="text-zinc-500 font-medium">F</span>{Math.round(item.macros.fat)}g
                    </span>
                    <span className="text-[10px] font-semibold tabular-nums text-zinc-300">
                      {item.macros.calories}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/** Confirmation modal for meal deletion */
function DeleteConfirmModal({
  open,
  loading,
  onCancel,
  onConfirm,
}: {
  open: boolean
  loading: boolean
  onCancel: () => void
  onConfirm: () => void
}) {
  const { strings } = useLocale()
  const ml = strings.meals

  if (!open) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-8"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={loading ? undefined : onCancel} />
      {/* Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.2 }}
        className="relative bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 w-full max-w-xs shadow-xl"
      >
        <p className="text-[15px] font-semibold text-zinc-100 text-center mb-5">
          {ml.deleteConfirmTitle}
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="flex-1 h-11 rounded-xl text-[13px] font-medium text-zinc-300 bg-zinc-800 border border-zinc-700/50 hover:bg-zinc-700 transition-all disabled:opacity-40"
          >
            {ml.deleteCancel}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="flex-1 h-11 rounded-xl text-[13px] font-medium text-white bg-red-600 hover:bg-red-500 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {ml.deleting}
              </>
            ) : (
              <>
                <Trash2 size={14} />
                {ml.deleteConfirm}
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

/** Success toast for meal deletion */
function DeleteToast({ visible }: { visible: boolean }) {
  const { strings } = useLocale()
  return (
    <AnimatePresence>
      {visible && (
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
    </AnimatePresence>
  )
}

function MacroLabel({ label, value }: { label: string; value: number }) {
  return (
    <span className="text-[11px] text-zinc-400 tabular-nums">
      <span className="text-zinc-500 font-medium">{label}</span> {value}g
    </span>
  )
}

// ─── Main Page ──────────────────────────────────────────────────────────────

function generateDateRange(days: number, bcp47 = 'en-US'): DateItem[] {
  const items: DateItem[] = []
  const todayStr = new Date().toISOString().split('T')[0]

  for (let i = 0; i < days; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateKey = d.toISOString().split('T')[0]
    items.push({
      dateKey,
      dayNum: d.getDate(),
      dayName: d.toLocaleDateString(bcp47, { weekday: 'short' }),
      monthShort: d.toLocaleDateString(bcp47, { month: 'short' }),
      isToday: dateKey === todayStr,
    })
  }
  return items
}

export default function HistoryPage() {
  // Regenerate date range based on current day (refreshes after midnight)
  const todayKey = new Date().toISOString().slice(0, 10)
  const { strings, locale } = useLocale()
  const bcp47 = BCP47_BY_LOCALE[locale] ?? 'en-US'
  const DATE_RANGE = useMemo(() => generateDateRange(14, bcp47), [todayKey, bcp47])
  const [selectedDate, setSelectedDate] = useState<string>(() => generateDateRange(1)[0].dateKey)
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showDeleteToast, setShowDeleteToast] = useState(false)
  const [showDeleteError, setShowDeleteError] = useState(false)
  const { user } = useAuth()
  const { allMeals, loading, error, deleteMeal } = useMealHistory(user?.uid)

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
      setShowDeleteError(true)
      setTimeout(() => setShowDeleteError(false), 3000)
    } finally {
      setDeletingId(null)
    }
  }

  // Filter meals for selected date
  const dayMeals = useMemo(
    () => allMeals.filter((m) => m.dateKey === selectedDate),
    [allMeals, selectedDate]
  )

  // Apply source filter
  const sourceFiltered = useMemo(() => {
    if (sourceFilter === 'all') return dayMeals
    return dayMeals.filter((m) => m.source === sourceFilter)
  }, [dayMeals, sourceFilter])

  // Apply search filter
  const filteredMeals = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return sourceFiltered
    return sourceFiltered.filter((meal) =>
      meal.items.some((item) => item.name.toLowerCase().includes(q))
    )
  }, [sourceFiltered, searchQuery])

  // Day totals (from all meals on that day, before filters)
  const dayTotals = useMemo<MacroNutrients>(
    () => (dayMeals.length > 0 ? sumMacros(dayMeals.map((m) => m.totalMacros)) : EMPTY_MACROS),
    [dayMeals]
  )

  const hasFilters = sourceFilter !== 'all' || searchQuery.trim() !== ''

  return (
    <div className="px-5 pt-14 pb-6 max-w-lg md:max-w-2xl md:px-8 mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <PageHeader title={strings.history.title} />

        {/* ── Date Selector ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.12 }}
          className="mb-5"
        >
          <DateSelector
            dates={DATE_RANGE}
            selected={selectedDate}
            onSelect={setSelectedDate}
          />
        </motion.div>

        {/* ── Day Summary ────────────────────────────────────── */}
        {dayMeals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.12 }}
            className="mb-4"
          >
            <DaySummaryCard totals={dayTotals} mealCount={dayMeals.length} />
          </motion.div>
        )}

        {/* ── Filters + Search ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.12 }}
          className="space-y-3 mb-5"
        >
          <FilterBar active={sourceFilter} onChange={setSourceFilter} />
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </motion.div>

        {/* ── Meals List ─────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center py-12"
            >
              <div className="w-6 h-6 border-2 border-zinc-700 border-t-white rounded-full animate-spin" />
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
            >
              <EmptyState
                icon={<AlertCircle size={28} />}
                title="History could not load"
                description={error}
              />
            </motion.div>
          ) : filteredMeals.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
            >
              <EmptyState
                icon={<CalendarDays size={28} />}
                title={hasFilters ? strings.add.noResults : strings.history.empty}
                description={hasFilters ? strings.history.filteredEmpty : strings.history.emptySubtitle}
              />
            </motion.div>
          ) : (
            <motion.div
              key={selectedDate + sourceFilter + searchQuery}
              className="space-y-3"
            >
              {filteredMeals.map((meal) => (
                <HistoryMealCard
                  key={meal.id}
                  meal={meal}
                  deletingId={deletingId}
                  onDeleteRequest={handleDeleteRequest}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <DeleteConfirmModal
        open={deleteTarget !== null}
        loading={deletingId !== null}
        onCancel={() => !deletingId && setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
      <DeleteToast visible={showDeleteToast} />
      <AnimatePresence>
        {showDeleteError && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-24 inset-x-0 z-50 flex justify-center pointer-events-none"
          >
            <p className="bg-red-600 text-white text-[13px] font-medium px-4 py-2.5 rounded-xl shadow-lg">
              {strings.meals.deleteError}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
