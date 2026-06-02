import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, PenLine, Sparkles, UtensilsCrossed, X, Minus, Plus } from 'lucide-react'
import type { Meal, MealType, MealSource } from '../types/meal'
import type { MacroNutrients } from '../types/nutrition'
import { sumMacros } from '../types/nutrition'
import { formatTime } from '../utils/date'
import { useAuth } from '../hooks/useAuth'
import { useLocale } from '../contexts/LocaleContext'
import { useTodayMeals } from '../hooks/useMeals'
import { updateMeal } from '../services/mealService'
import type { FoodItem } from '../types/meal'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'

// ─── Sabitler ───────────────────────────────────────────────────────────────

const MEAL_TYPE_ORDER: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack']

// Meal type labels are resolved at render time via useLocale()

// ─── Yardımcı: Firestore timestamp / ISO string çözümle ────────────────────

function resolveTimestamp(ts: unknown): string {
  if (typeof ts === 'string') return ts
  if (ts && typeof ts === 'object' && 'toDate' in ts) {
    return (ts as { toDate(): Date }).toDate().toISOString()
  }
  return new Date().toISOString()
}

// ─── Alt bileşenler ────────────────────────────────────────────────────────

function MacroStat({ label, value, unit: _unit = 'g' }: { label: string; value: number; unit?: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-base font-bold tabular-nums">{Math.round(value)}</span>
      <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">
        {label}
      </span>
    </div>
  )
}

function SourceBadge({ source }: { source: MealSource }) {
  const { strings } = useLocale()
  const ml = strings.meals
  return (
    <Badge variant={source === 'ai_scan' ? 'pro' : 'outline'} size="sm">
      {source === 'ai_scan' ? (
        <>
          <Sparkles size={9} className="mr-0.5" />
          {ml.aiScan}
        </>
      ) : (
        <>
          <PenLine size={9} className="mr-0.5" />
          {ml.manualSource}
        </>
      )}
    </Badge>
  )
}

// ─── Öğün Kartı ─────────────────────────────────────────────────────────────

interface MealCardItemProps {
  meal: Meal
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  animationDelay?: number
}

function MealCardItem({ meal, onEdit, onDelete, animationDelay = 0 }: MealCardItemProps) {
  const { strings } = useLocale()
  const ml = strings.meals
  const time = formatTime(resolveTimestamp(meal.createdAt))

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -60, transition: { duration: 0.25 } }}
      transition={{
        duration: 0.35,
        delay: animationDelay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800/50"
    >
      {/* Üst satır: kaynak badge + saat + kalori */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <SourceBadge source={meal.source} />
          <span className="text-[11px] text-zinc-500 tabular-nums">{time}</span>
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

      {/* Besin öğeleri */}
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
            {ml.moreItems(meal.items.length - 4)}
          </p>
        )}
      </div>

      {/* Alt: makrolar + işlemler */}
      <div className="flex items-center justify-between pt-3 border-t border-zinc-800/40">
        <div className="flex gap-3">
          <MacroLabel label="P" value={meal.totalMacros.protein} />
          <MacroLabel label="C" value={meal.totalMacros.carbs} />
          <MacroLabel label="F" value={Math.round(meal.totalMacros.fat)} />
          <MacroLabel label="Fi" value={meal.totalMacros.fiber} />
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(meal.id)}
            className="p-1.5 rounded-lg hover:bg-zinc-800 active:bg-zinc-700 transition-colors"
            aria-label="Düzenle"
          >
            <PenLine size={14} className="text-zinc-600 hover:text-zinc-400 transition-colors" />
          </button>
          <button
            onClick={() => onDelete(meal.id)}
            className="p-1.5 rounded-lg hover:bg-zinc-800 active:bg-zinc-700 transition-colors"
            aria-label="Sil"
          >
            <Trash2 size={14} className="text-zinc-600 hover:text-zinc-400 transition-colors" />
          </button>
        </div>
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

// ─── Ana Sayfa ──────────────────────────────────────────────────────────────

export default function MealsPage() {
  const { user } = useAuth()
  const { strings } = useLocale()
  const ml = strings.meals
  const { meals, loading, deleteMeal, refresh } = useTodayMeals(user?.uid)

  const [editingMeal, setEditingMeal] = useState<Meal | null>(null)
  const [editItems, setEditItems] = useState<{ id: string; name: string; grams: number; originalGrams: number }[]>([])
  const [editSaving, setEditSaving] = useState(false)

  const handleDelete = async (id: string) => {
    await deleteMeal(id)
  }

  const handleEdit = (id: string) => {
    const meal = meals.find((m) => m.id === id)
    if (!meal) return
    setEditingMeal(meal)
    setEditItems(meal.items.map((item) => ({
      id: item.id,
      name: item.name,
      grams: item.grams,
      originalGrams: item.grams,
    })))
  }

  const handleEditSave = async () => {
    if (!editingMeal || !user?.uid) return
    setEditSaving(true)
    try {
      const updatedItems: FoodItem[] = editingMeal.items.map((item) => {
        const edited = editItems.find((e) => e.id === item.id)
        if (!edited || edited.grams === edited.originalGrams) return item
        const ratio = edited.grams / edited.originalGrams
        return {
          ...item,
          grams: Math.round(edited.grams),
          macros: {
            calories: Math.round(item.macros.calories * ratio),
            protein: Math.round(item.macros.protein * ratio * 10) / 10,
            carbs: Math.round(item.macros.carbs * ratio * 10) / 10,
            fat: Math.round(item.macros.fat * ratio * 10) / 10,
            fiber: Math.round(item.macros.fiber * ratio * 10) / 10,
          },
        }
      })
      await updateMeal(user.uid, editingMeal.id, { items: updatedItems })
      await refresh()
      setEditingMeal(null)
    } catch {
      alert(ml.updateFailed)
    } finally {
      setEditSaving(false)
    }
  }

  // Toplamları hesapla
  const totals: MacroNutrients = useMemo(
    () => sumMacros(meals.map((m) => m.totalMacros)),
    [meals]
  )

  // Öğünleri türe göre grupla
  const groupedMeals = useMemo(() => {
    const groups: Partial<Record<MealType, Meal[]>> = {}
    for (const meal of meals) {
      if (!groups[meal.mealType]) groups[meal.mealType] = []
      groups[meal.mealType]!.push(meal)
    }
    return groups
  }, [meals])

  return (
    <div className="px-5 pt-14 pb-6 max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <PageHeader
          title={ml.pageTitle}
          subtitle={ml.mealsRecorded(meals.length)}
        />

        {loading ? (
          <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800/40 px-4 py-8 text-center">
            <p className="text-[13px] text-zinc-500">{ml.loading}</p>
          </div>
        ) : meals.length === 0 ? (
          <EmptyState
            icon={<UtensilsCrossed size={32} />}
            title={ml.noMealsToday}
            description={ml.noMealsHint}
          />
        ) : (
          <>
            {/* ── Günlük Toplam Kartı ─────────────────────────────── */}
            <Card variant="elevated" padding="lg" className="mb-6" animationDelay={0.05}>
              <div className="flex items-center justify-center mb-4">
                <div className="text-center">
                  <motion.span
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-4xl font-bold tabular-nums tracking-tight"
                  >
                    {totals.calories}
                  </motion.span>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium mt-1">
                    {ml.totalCalories}
                  </p>
                </div>
              </div>

              <div className="flex justify-around pt-4 border-t border-zinc-800/40">
                <MacroStat label={strings.common.protein} value={totals.protein} />
                <div className="w-px bg-zinc-800/40" />
                <MacroStat label={strings.common.carbs} value={totals.carbs} />
                <div className="w-px bg-zinc-800/40" />
                <MacroStat label={strings.common.fat} value={totals.fat} />
                <div className="w-px bg-zinc-800/40" />
                <MacroStat label={strings.common.fiber} value={totals.fiber} />
              </div>
            </Card>

            {/* ── Gruplanmış Öğün Bölümleri ──────────────────────── */}
            <div className="space-y-6">
              {MEAL_TYPE_ORDER.filter((type) => groupedMeals[type]).map((type, groupIdx) => (
                <section key={type}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 + groupIdx * 0.05 }}
                    className="flex items-center justify-between mb-3"
                  >
                    <h2 className="text-sm font-semibold text-zinc-300 tracking-tight">
                      {strings.mealType[type]}
                    </h2>
                    <span className="text-[11px] text-zinc-600 tabular-nums">
                      {sumMacros(groupedMeals[type]!.map((m) => m.totalMacros)).calories} kcal
                    </span>
                  </motion.div>

                  <AnimatePresence mode="popLayout">
                    <div className="space-y-3">
                      {groupedMeals[type]!.map((meal, i) => (
                        <MealCardItem
                          key={meal.id}
                          meal={meal}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          animationDelay={0.15 + groupIdx * 0.05 + i * 0.06}
                        />
                      ))}
                    </div>
                  </AnimatePresence>
                </section>
              ))}
            </div>
          </>
        )}
      </motion.div>

      {/* ── Düzenleme Modalı ──────────────────────────────────── */}
      <AnimatePresence>
        {editingMeal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-end justify-center"
            onClick={() => setEditingMeal(null)}
          >
            <motion.div
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-zinc-900 rounded-t-3xl w-full max-w-lg border-t border-zinc-800 p-5 pb-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold">{ml.editMeal}</h3>
                <button
                  onClick={() => setEditingMeal(null)}
                  className="p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  <X size={18} className="text-zinc-400" />
                </button>
              </div>

              <div className="space-y-4 max-h-[50vh] overflow-y-auto">
                {editItems.map((item, idx) => (
                  <div key={item.id} className="bg-zinc-800/50 rounded-xl p-3">
                    <p className="text-[13px] text-zinc-200 mb-2 truncate">{item.name}</p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          const newItems = [...editItems]
                          newItems[idx] = { ...item, grams: Math.max(1, item.grams - 10) }
                          setEditItems(newItems)
                        }}
                        className="p-1.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition-colors"
                      >
                        <Minus size={14} className="text-zinc-300" />
                      </button>
                      <input
                        type="number"
                        value={item.grams}
                        onChange={(e) => {
                          const val = Math.max(1, parseInt(e.target.value) || 1)
                          const newItems = [...editItems]
                          newItems[idx] = { ...item, grams: val }
                          setEditItems(newItems)
                        }}
                        className="w-20 text-center bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-sm text-zinc-200 tabular-nums"
                      />
                      <span className="text-[12px] text-zinc-500">g</span>
                      <button
                        onClick={() => {
                          const newItems = [...editItems]
                          newItems[idx] = { ...item, grams: item.grams + 10 }
                          setEditItems(newItems)
                        }}
                        className="p-1.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition-colors"
                      >
                        <Plus size={14} className="text-zinc-300" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleEditSave}
                disabled={editSaving}
                className="w-full mt-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-sm transition-colors"
              >
                {editSaving ? ml.saving : ml.saveButton}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
