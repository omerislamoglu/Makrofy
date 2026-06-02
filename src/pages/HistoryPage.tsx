import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Sparkles, PenLine, CalendarDays, X, ChevronDown, ChevronUp, Trash2, AlertCircle } from 'lucide-react'
import type { Meal } from '../types/meal'
import type { MacroNutrients } from '../types/nutrition'
import { sumMacros, EMPTY_MACROS } from '../types/nutrition'
import { formatTime } from '../utils/date'
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
      className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide"
    >
      {dates.map((d) => {
        const isActive = d.dateKey === selected
        return (
          <button
            key={d.dateKey}
            ref={isActive ? selectedRef : undefined}
            onClick={() => { haptics.selectionChanged(); onSelect(d.dateKey) }}
            className={[
              'flex flex-col items-center flex-shrink-0 w-[52px] py-2.5 rounded-2xl transition-all duration-200',
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
  const { strings, locale } = useLocale()
  const filters: { key: SourceFilter; label: string }[] = [
    { key: 'all', label: locale === 'tr' ? 'Tümü' : 'All' },
    { key: 'ai_scan', label: strings.add.tabScan },
    { key: 'manual', label: strings.add.tabManual },
  ]

  return (
    <div className="flex gap-2">
      {filters.map(({ key, label }) => (
        <button
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
        <button
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
  const { strings, locale } = useLocale()
  const mealWord = locale === 'tr' ? 'öğün' : (mealCount === 1 ? 'meal' : 'meals')
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
          <MacroStat label="C" value={totals.carbs} />
          <MacroStat label="F" value={Math.round(totals.fat)} />
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
  delay,
  onDelete,
}: {
  meal: Meal
  delay: number
  onDelete: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const haptics = useHaptics()
  const { strings } = useLocale()
  const time = formatTime(resolveTimestamp(meal.createdAt))
  const mealLabel = strings.mealType[meal.mealType]

  const handleDeletePress = (e: React.MouseEvent) => {
    e.stopPropagation()
    haptics.impactMedium()
    if (confirmDelete) {
      onDelete(meal.id)
    } else {
      setConfirmDelete(true)
      // Otomatik iptal — 3 saniye sonra onay ekranı kapanır
      setTimeout(() => setConfirmDelete(false), 3000)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
      transition={{
        duration: 0.25,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="bg-zinc-900 rounded-2xl border border-zinc-800/50 overflow-hidden"
    >
      <div
        className="p-4 cursor-pointer active:bg-zinc-800/40 transition-colors"
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
                {meal.totalMacros.calories}
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
            <MacroLabel label="P" value={meal.totalMacros.protein} />
            <MacroLabel label="C" value={meal.totalMacros.carbs} />
            <MacroLabel label="F" value={Math.round(meal.totalMacros.fat)} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-600 tabular-nums">{time}</span>
            <button
              type="button"
              onClick={handleDeletePress}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-all duration-200 ${
                confirmDelete
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'text-zinc-600 hover:text-red-400 hover:bg-red-500/10'
              }`}
            >
              <Trash2 size={11} />
              {confirmDelete && <span>Sil?</span>}
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
            transition={{ duration: 0.25 }}
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
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-[10px] text-zinc-400 tabular-nums">
                      <span className="text-zinc-500 font-medium">P</span> {item.macros.protein}g
                    </span>
                    <span className="text-[10px] text-zinc-400 tabular-nums">
                      <span className="text-zinc-500 font-medium">C</span> {item.macros.carbs}g
                    </span>
                    <span className="text-[10px] text-zinc-400 tabular-nums">
                      <span className="text-zinc-500 font-medium">F</span> {Math.round(item.macros.fat)}g
                    </span>
                    <span className="text-[11px] font-semibold tabular-nums text-zinc-300">
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

function MacroLabel({ label, value }: { label: string; value: number }) {
  return (
    <span className="text-[11px] text-zinc-400 tabular-nums">
      <span className="text-zinc-500 font-medium">{label}</span> {value}g
    </span>
  )
}

// ─── Main Page ──────────────────────────────────────────────────────────────

function generateDateRange(days: number): DateItem[] {
  const items: DateItem[] = []
  const todayStr = new Date().toISOString().split('T')[0]

  for (let i = 0; i < days; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateKey = d.toISOString().split('T')[0]
    items.push({
      dateKey,
      dayNum: d.getDate(),
      dayName: d.toLocaleDateString(undefined, { weekday: 'short' }),
      monthShort: d.toLocaleDateString(undefined, { month: 'short' }),
      isToday: dateKey === todayStr,
    })
  }
  return items
}

const DATE_RANGE = generateDateRange(14)

export default function HistoryPage() {
  const [selectedDate, setSelectedDate] = useState<string>(DATE_RANGE[0].dateKey)
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const { strings } = useLocale()
  const { user } = useAuth()
  const { allMeals, loading, error, deleteMeal } = useMealHistory(user?.uid)

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
    <div className="px-5 pt-14 pb-6 max-w-lg mx-auto">
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
          transition={{ duration: 0.35, delay: 0.05 }}
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
            transition={{ duration: 0.3, delay: 0.08 }}
            className="mb-4"
          >
            <DaySummaryCard totals={dayTotals} mealCount={dayMeals.length} />
          </motion.div>
        )}

        {/* ── Filters + Search ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
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
              {filteredMeals.map((meal, i) => (
                <HistoryMealCard
                  key={meal.id}
                  meal={meal}
                  delay={0.05 + i * 0.05}
                  onDelete={deleteMeal}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
