import { useState, useMemo, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check,
  RotateCcw,
  PenLine,
  Trash2,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Shield,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  AlertTriangle,
  Info,
  PlusCircle,
  Flame,
  X,
} from 'lucide-react'
import type { MacroNutrients } from '../types/nutrition'
import type { ConfidenceLevel, MealType } from '../types/meal'
import { sumMacros } from '../types/nutrition'
import { useAuth } from '../hooks/useAuth'
import { useLocale } from '../contexts/LocaleContext'
import { getSaveErrorMessage, saveAIScanMeal, serializeError } from '../services/mealService'
import { getToday } from '../utils/date'
import { createId } from '../utils/id'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

// ─── Meal type labels are now resolved at render time via useLocale() ────────

// ─── Page-level types ───────────────────────────────────────────────────────

interface AIAnalysisItem {
  id: string
  foodName: string
  grams: number
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  confidence: ConfidenceLevel
  reasoning?: string
  cookingMethod?: string
  portionDescription?: string
}

interface AIAnalysisResult {
  mealId?: string
  mealName: string
  totalCalories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  confidence: ConfidenceLevel
  confidenceScore: number
  items: AIAnalysisItem[]
  imagePreview: string | null
  warnings?: string[]
  accuracyNote?: string
}

// ─── Utility: recalculate item macros proportionally ────────────────────────

function recalcItemForGrams(
  original: AIAnalysisItem,
  newGrams: number
): AIAnalysisItem {
  if (newGrams <= 0 || original.grams === 0) return { ...original, grams: Math.max(0, newGrams) }
  const ratio = newGrams / original.grams
  return {
    ...original,
    grams: newGrams,
    calories: Math.round(original.calories * ratio),
    protein: Math.round(original.protein * ratio),
    carbs: Math.round(original.carbs * ratio),
    fat: Math.round(original.fat * ratio),
    fiber: Math.round(original.fiber * ratio),
  }
}

function sumFromItems(items: AIAnalysisItem[]): MacroNutrients {
  return sumMacros(
    items.map((i) => ({
      calories: i.calories,
      protein: i.protein,
      carbs: i.carbs,
      fat: i.fat,
      fiber: i.fiber,
    }))
  )
}

// ─── Mock data (used when no router state is present) ───────────────────────

const MOCK_RESULT: AIAnalysisResult = {
  mealName: 'Tavuk Pilav Tabağı',
  totalCalories: 648,
  protein: 53,
  carbs: 59,
  fat: 20,
  fiber: 2,
  confidence: 'medium',
  confidenceScore: 0.78,
  imagePreview: null,
  warnings: [
    'Pilavdaki tereyağı miktarı net görünmediği için yaklaşık hesaplandı.',
    'Salata sosu miktarı tahminidir.',
  ],
  items: [
    {
      id: createId(),
      foodName: 'Izgara Tavuk Göğsü (derisiz)',
      grams: 150,
      calories: 248,
      protein: 47,
      carbs: 0,
      fat: 5,
      fiber: 0,
      confidence: 'high',
      reasoning: 'Tabakta ızgara izleri belirgin, orta-büyük boy derisiz göğüs parçası.',
      cookingMethod: 'ızgara',
      portionDescription: 'Yaklaşık 1 büyük porsiyon',
    },
    {
      id: createId(),
      foodName: 'Tereyağlı Beyaz Pirinç Pilavı',
      grams: 200,
      calories: 260,
      protein: 5,
      carbs: 56,
      fat: 1,
      fiber: 1,
      confidence: 'medium',
      reasoning: 'Tabağın yarısını kaplayan pirinç yığını, şehriye taneleri görülüyor.',
      cookingMethod: 'sade',
      portionDescription: 'Yaklaşık 1 normal porsiyon',
    },
    {
      id: createId(),
      foodName: 'Mevsim Salatası',
      grams: 80,
      calories: 16,
      protein: 1,
      carbs: 3,
      fat: 0,
      fiber: 1,
      confidence: 'medium',
      reasoning: 'Tabağın kenarında küçük yeşillik porsiyon.',
      cookingMethod: 'çiğ',
      portionDescription: 'Küçük porsiyon',
    },
    {
      id: createId(),
      foodName: 'Zeytinyağı (salata sosu)',
      grams: 14,
      calories: 124,
      protein: 0,
      carbs: 0,
      fat: 14,
      fiber: 0,
      confidence: 'low',
      reasoning: 'Salata üzerinde yağ parlaklığı görülüyor.',
      portionDescription: '~1 yemek kaşığı',
    },
  ],
}

// ─── Confidence helpers ─────────────────────────────────────────────────────

function confidenceVariant(level: ConfidenceLevel): 'success' | 'warning' | 'default' {
  switch (level) {
    case 'high':
      return 'success'
    case 'medium':
      return 'warning'
    default:
      return 'default'
  }
}

function ConfidenceIcon({ level, size = 12 }: { level: ConfidenceLevel; size?: number }) {
  switch (level) {
    case 'high':
      return <ShieldCheck size={size} />
    case 'medium':
      return <ShieldAlert size={size} />
    default:
      return <Shield size={size} />
  }
}

// Cooking method labels are now resolved at render time via useLocale()

// ─── Sub-components ─────────────────────────────────────────────────────────

function MacroStatBlock({
  label,
  value,
  unit,
  delay,
}: {
  label: string
  value: number
  unit: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="text-center"
    >
      <p className="text-2xl font-bold tabular-nums">{value}</p>
      <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-medium mt-0.5">
        {label}
        {unit && (
          <span className="text-zinc-500 ml-0.5">{unit}</span>
        )}
      </p>
    </motion.div>
  )
}

function WarningsBanner({ warnings }: { warnings: string[] }) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed || warnings.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.08 }}
      className="bg-amber-500/5 rounded-xl px-4 py-3 mb-5 border border-amber-500/15"
    >
      <div className="flex items-start gap-2.5">
        <AlertTriangle size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          {warnings.map((w, i) => (
            <p key={i} className="text-[11px] text-amber-200/80 leading-relaxed">
              {w}
            </p>
          ))}
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-zinc-500 hover:text-zinc-300 transition-colors flex-shrink-0"
        >
          <X size={14} />
        </button>
      </div>
    </motion.div>
  )
}

function FoodItemCard({
  item,
  index,
  onGramsChange,
  onRemove,
  onNameChange,
}: {
  item: AIAnalysisItem
  index: number
  onGramsChange: (index: number, grams: number) => void
  onRemove: (index: number) => void
  onNameChange: (index: number, name: string) => void
}) {
  const { strings } = useLocale()
  const an = strings.analysis
  const [expanded, setExpanded] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [nameValue, setNameValue] = useState(item.foodName)

  const adjustGrams = (delta: number) => {
    const newGrams = Math.max(1, item.grams + delta)
    onGramsChange(index, newGrams)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    const parsed = parseInt(raw, 10)
    if (!isNaN(parsed) && parsed >= 0) {
      onGramsChange(index, parsed)
    }
  }

  const confirmNameEdit = () => {
    const trimmed = nameValue.trim()
    if (trimmed && trimmed !== item.foodName) {
      onNameChange(index, trimmed)
    }
    setEditingName(false)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.06,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="bg-zinc-900 rounded-2xl border border-zinc-800/50 overflow-hidden"
    >
      {/* Main row */}
      <div
        className="p-4 flex items-center gap-3 cursor-pointer active:bg-zinc-800/40 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Confidence dot */}
        <div
          className={`w-2 h-2 rounded-full flex-shrink-0 ${
            item.confidence === 'high'
              ? 'bg-white'
              : item.confidence === 'medium'
                ? 'bg-zinc-400'
                : 'bg-zinc-600'
          }`}
        />

        {/* Name + portion info */}
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-medium text-zinc-100 truncate">
            {item.foodName}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[11px] text-zinc-500 tabular-nums">
              {item.grams}g
            </span>
            {item.portionDescription && (
              <>
                <span className="text-zinc-700">·</span>
                <span className="text-[10px] text-zinc-500">{item.portionDescription}</span>
              </>
            )}
            {item.cookingMethod && an.cookingMethods[item.cookingMethod] && (
              <>
                <span className="text-zinc-700">·</span>
                <span className="text-[10px] text-zinc-600 flex items-center gap-0.5">
                  <Flame size={9} />
                  {an.cookingMethods[item.cookingMethod]}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Calories */}
        <div className="text-right flex-shrink-0 mr-1">
          <span className="text-[15px] font-bold tabular-nums">
            {item.calories}
          </span>
          <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-medium ml-1">
            kcal
          </span>
        </div>

        {/* Expand toggle */}
        <div className="flex-shrink-0 text-zinc-500">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-zinc-800/40">
              {/* AI reasoning */}
              {item.reasoning && (
                <div className="flex items-start gap-2 mb-3 bg-zinc-800/30 rounded-lg px-3 py-2">
                  <Info size={12} className="text-zinc-500 mt-0.5 flex-shrink-0" />
                  <p className="text-[10px] text-zinc-400 leading-relaxed">{item.reasoning}</p>
                </div>
              )}

              {/* Macro chips */}
              <div className="flex gap-3 mb-4">
                <MacroChip label="P" value={item.protein} />
                <MacroChip label="K" value={item.carbs} />
                <MacroChip label="Y" value={item.fat} />
                <MacroChip label="L" value={item.fiber} />
                <div className="ml-auto">
                  <Badge
                    variant={confidenceVariant(item.confidence)}
                    size="sm"
                    icon={<ConfidenceIcon level={item.confidence} />}
                  >
                    {item.confidence}
                  </Badge>
                </div>
              </div>

              {/* Name editor */}
              <div className="mb-3">
                <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-medium block mb-1.5">
                  {an.foodNameLabel}
                </span>
                {editingName ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={nameValue}
                      onChange={(e) => setNameValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') confirmNameEdit()
                        if (e.key === 'Escape') { setEditingName(false); setNameValue(item.foodName) }
                      }}
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                      className="flex-1 h-8 px-2.5 bg-zinc-800 rounded-lg text-sm text-zinc-100 border border-zinc-600 focus:outline-none focus:border-zinc-400 transition-colors"
                    />
                    <button
                      onClick={(e) => { e.stopPropagation(); confirmNameEdit() }}
                      className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
                    >
                      <Check size={14} className="text-zinc-200" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditingName(true) }}
                    className="w-full h-8 px-2.5 bg-zinc-800/50 rounded-lg text-sm text-left text-zinc-300 border border-zinc-800/60 hover:border-zinc-700 flex items-center justify-between transition-colors"
                  >
                    <span className="truncate">{item.foodName}</span>
                    <PenLine size={12} className="text-zinc-500 flex-shrink-0" />
                  </button>
                )}
              </div>

              {/* Grams editor */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-medium">
                  {an.estimatedGrams}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    id={`decrease-grams-${index}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      adjustGrams(-10)
                    }}
                    className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/50 flex items-center justify-center hover:bg-zinc-700 active:scale-95 transition-all"
                  >
                    <Minus size={14} className="text-zinc-300" />
                  </button>
                  <input
                    id={`grams-input-${index}`}
                    type="number"
                    value={item.grams}
                    onChange={handleInputChange}
                    onClick={(e) => e.stopPropagation()}
                    className="w-16 h-8 px-2 bg-zinc-800 rounded-lg text-sm text-center font-medium tabular-nums border border-zinc-700/50 focus:outline-none focus:border-zinc-500 transition-colors"
                    min={1}
                  />
                  <button
                    id={`increase-grams-${index}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      adjustGrams(10)
                    }}
                    className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/50 flex items-center justify-center hover:bg-zinc-700 active:scale-95 transition-all"
                  >
                    <Plus size={14} className="text-zinc-300" />
                  </button>
                </div>
              </div>

              {/* Remove button */}
              <button
                id={`remove-item-${index}`}
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove(index)
                }}
                className="mt-3 w-full h-9 rounded-xl flex items-center justify-center gap-1.5 text-[12px] text-zinc-500 hover:text-red-400 hover:bg-red-500/5 border border-zinc-800/40 hover:border-red-500/20 transition-all duration-200"
              >
                <Trash2 size={13} />
                {an.removeItem}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function MacroChip({ label, value }: { label: string; value: number }) {
  return (
    <span className="text-[11px] text-zinc-400 tabular-nums bg-zinc-800/60 rounded-lg px-2.5 py-1">
      <span className="text-zinc-500 font-semibold">{label}</span> {value}g
    </span>
  )
}

function AddItemInline({ onAdd }: { onAdd: (item: AIAnalysisItem) => void }) {
  const { strings } = useLocale()
  const an = strings.analysis
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [grams, setGrams] = useState(100)
  const [cal, setCal] = useState(0)
  const [prot, setProt] = useState(0)
  const [carb, setCarb] = useState(0)
  const [fat, setFat] = useState(0)

  const handleAdd = () => {
    if (!name.trim() || grams <= 0) return
    onAdd({
      id: createId(),
      foodName: name.trim(),
      grams,
      calories: cal,
      protein: prot,
      carbs: carb,
      fat,
      fiber: 0,
      confidence: 'high',
      reasoning: 'Kullanıcı tarafından manuel eklendi.',
      portionDescription: `${grams}g`,
    })
    setName('')
    setGrams(100)
    setCal(0)
    setProt(0)
    setCarb(0)
    setFat(0)
    setOpen(false)
  }

  if (!open) {
    return (
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => setOpen(true)}
        className="w-full h-11 rounded-2xl border border-dashed border-zinc-700/60 flex items-center justify-center gap-2 text-[12px] text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-all"
      >
        <PlusCircle size={15} />
        {an.addNewFood}
      </motion.button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="bg-zinc-900 rounded-2xl border border-zinc-800/50 p-4 space-y-3"
    >
      <div>
        <label className="text-[11px] text-zinc-400 uppercase tracking-wider font-medium block mb-1">
          {an.foodNameLabel}
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={an.foodNamePlaceholder}
          className="w-full h-9 px-3 bg-zinc-800 rounded-lg text-sm text-zinc-100 border border-zinc-700/50 focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-zinc-600"
        />
      </div>

      <div className="grid grid-cols-5 gap-2">
        <div>
          <label className="text-[10px] text-zinc-500 block mb-0.5">{an.gramLabel}</label>
          <input type="number" value={grams} onChange={(e) => setGrams(Math.max(0, +e.target.value))} min={0}
            className="w-full h-8 px-1.5 bg-zinc-800 rounded-lg text-xs text-center tabular-nums border border-zinc-700/50 focus:outline-none focus:border-zinc-500" />
        </div>
        <div>
          <label className="text-[10px] text-zinc-500 block mb-0.5">{an.kcalLabel}</label>
          <input type="number" value={cal} onChange={(e) => setCal(Math.max(0, +e.target.value))} min={0}
            className="w-full h-8 px-1.5 bg-zinc-800 rounded-lg text-xs text-center tabular-nums border border-zinc-700/50 focus:outline-none focus:border-zinc-500" />
        </div>
        <div>
          <label className="text-[10px] text-zinc-500 block mb-0.5">{an.protLabel}</label>
          <input type="number" value={prot} onChange={(e) => setProt(Math.max(0, +e.target.value))} min={0}
            className="w-full h-8 px-1.5 bg-zinc-800 rounded-lg text-xs text-center tabular-nums border border-zinc-700/50 focus:outline-none focus:border-zinc-500" />
        </div>
        <div>
          <label className="text-[10px] text-zinc-500 block mb-0.5">{an.carbLabel}</label>
          <input type="number" value={carb} onChange={(e) => setCarb(Math.max(0, +e.target.value))} min={0}
            className="w-full h-8 px-1.5 bg-zinc-800 rounded-lg text-xs text-center tabular-nums border border-zinc-700/50 focus:outline-none focus:border-zinc-500" />
        </div>
        <div>
          <label className="text-[10px] text-zinc-500 block mb-0.5">{an.fatLabel}</label>
          <input type="number" value={fat} onChange={(e) => setFat(Math.max(0, +e.target.value))} min={0}
            className="w-full h-8 px-1.5 bg-zinc-800 rounded-lg text-xs text-center tabular-nums border border-zinc-700/50 focus:outline-none focus:border-zinc-500" />
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setOpen(false)}
          className="flex-1 h-9 rounded-xl text-[12px] text-zinc-400 border border-zinc-800/40 hover:bg-zinc-800/40 transition-all">
          {an.cancel}
        </button>
        <button onClick={handleAdd} disabled={!name.trim()}
          className="flex-1 h-9 rounded-xl text-[12px] font-medium text-white bg-white/10 hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5">
          <PlusCircle size={13} />
          {an.addButton}
        </button>
      </div>
    </motion.div>
  )
}

// ─── Main component ─────────────────────────────────────────────────────────

export default function AnalysisResultPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const { strings } = useLocale()
  const an = strings.analysis

  const routerState = location.state as {
    result?: {
      mealId?: string
      mealName?: string
      items: Array<{
        id: string
        name: string
        grams: number
        macros: MacroNutrients
        confidence?: ConfidenceLevel
        reasoning?: string
        cookingMethod?: string
        portionDescription?: string
      }>
      totalMacros: MacroNutrients
      confidence: ConfidenceLevel
      confidenceScore: number
      suggestedMealType: string
      processingTimeMs: number
      warnings?: string[]
      accuracyNote?: string
    }
    imagePreview?: string | null
  } | null

  const initialResult: AIAnalysisResult = useMemo(() => {
    if (routerState?.result) {
      const r = routerState.result
      return {
        mealId: r.mealId,
        mealName: r.mealName || strings.mealType[r.suggestedMealType as keyof typeof strings.mealType] || r.suggestedMealType,
        totalCalories: r.totalMacros.calories,
        protein: r.totalMacros.protein,
        carbs: r.totalMacros.carbs,
        fat: r.totalMacros.fat,
        fiber: r.totalMacros.fiber,
        confidence: r.confidence,
        confidenceScore: r.confidenceScore,
        imagePreview: routerState.imagePreview ?? null,
        warnings: r.warnings,
        accuracyNote: r.accuracyNote,
        items: r.items.map((item) => ({
          id: item.id,
          foodName: item.name,
          grams: item.grams,
          calories: item.macros.calories,
          protein: item.macros.protein,
          carbs: item.macros.carbs,
          fat: item.macros.fat,
          fiber: item.macros.fiber,
          confidence: item.confidence ?? 'medium',
          reasoning: item.reasoning,
          cookingMethod: item.cookingMethod,
          portionDescription: item.portionDescription,
        })),
      }
    }
    return MOCK_RESULT
  }, [routerState])

  // Map from item.id → original AI values for proportional recalculation.
  // Must be stable even after the user removes items (unlike an index-based array).
  const [originalItemsById] = useState<Map<string, AIAnalysisItem>>(
    () => new Map(initialResult.items.map((item) => [item.id, item]))
  )
  const [items, setItems] = useState<AIAnalysisItem[]>(initialResult.items)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const totals = useMemo(() => sumFromItems(items), [items])

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleGramsChange = useCallback(
    (index: number, newGrams: number) => {
      if (newGrams < 1) return
      setItems((prev) => {
        const updated = [...prev]
        const current = prev[index]
        // Look up original AI values by id so removal of other items doesn't
        // shift the wrong original into this slot.
        const orig = originalItemsById.get(current.id) ?? current
        updated[index] = recalcItemForGrams(orig, newGrams)
        return updated
      })
    },
    [originalItemsById]
  )

  const handleRemoveItem = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleNameChange = useCallback((index: number, newName: string) => {
    setItems((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], foodName: newName }
      return updated
    })
  }, [])

  const handleAddItem = useCallback((item: AIAnalysisItem) => {
    setItems((prev) => [...prev, item])
  }, [])

  const handleSaveMeal = useCallback(async () => {
    if (import.meta.env.DEV) console.debug('[AI_SAVE] clicked')
    if (!user?.uid) return
    if (saving || saved) return
    setSaving(true)
    setSaveError(null)
    try {
      if (import.meta.env.DEV) console.debug('[AI_SAVE] currentUser', { uid: user.uid })
      if (import.meta.env.DEV) console.debug('[AI_SAVE] raw analysis result', routerState?.result ?? initialResult)

      const normalizedMeal = {
        mealType: (routerState?.result?.suggestedMealType as MealType | undefined) ?? 'lunch',
        source: 'ai_scan' as const,
        ...(initialResult.imagePreview && { imageUrl: initialResult.imagePreview }),
        confidence: initialResult.confidence,
        items: items.map((item) => ({
          id: item.id,
          name: item.foodName,
          grams: item.grams,
          confidence: item.confidence,
          macros: {
            calories: item.calories,
            protein: item.protein,
            carbs: item.carbs,
            fat: item.fat,
            fiber: item.fiber,
          },
          servingUnit: 'g' as const,
          servingLabel: `${Math.round(item.grams)} g`,
          selectedQuantity: Math.round(item.grams),
          gramEquivalent: Math.round(item.grams),
        })),
        totalMacros: totals,
        dateKey: getToday(),
        notes: initialResult.mealName,
      }
      if (import.meta.env.DEV) console.debug('[AI_SAVE] normalizedMeal', normalizedMeal)
      if (import.meta.env.DEV) {
        console.debug('[AI_SAVE] firestore path', {
          path: initialResult.mealId
            ? `users/${user.uid}/meals/${initialResult.mealId}`
            : `users/${user.uid}/meals/{newMealId}`,
        })
      }
      const meal = await saveAIScanMeal(user.uid, normalizedMeal, initialResult.mealId)
      if (import.meta.env.DEV) {
        console.debug('[AI_SAVE] mealService result', meal)
        console.debug('[AI_SAVE] save success mealId', meal.id)
      }
      setSaved(true)
      if (import.meta.env.DEV) console.debug('[AI_SAVE] navigate home')
      setTimeout(() => navigate('/'), 800)
    } catch (error) {
      console.error('[AI_SAVE] save failed full error', serializeError(error))
      setSaveError(getSaveErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }, [initialResult.confidence, initialResult.imagePreview, initialResult.mealId, initialResult.mealName, items, navigate, routerState?.result?.suggestedMealType, saved, saving, totals, user?.uid])

  const handleReAnalyze = useCallback(() => {
    navigate('/add')
  }, [navigate])

  const handleManualEntry = useCallback(() => {
    navigate('/add')
  }, [navigate])

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="px-5 pt-14 pb-8 max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* ── Header ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-[26px] font-bold tracking-tight">
              {an.pageTitle}
            </h1>
            <p className="text-zinc-500 text-[12px] mt-0.5 flex items-center gap-1.5">
              <Sparkles size={12} />
              {an.aiSubtitle}
            </p>
          </div>
          <button
            id="re-analyze-button"
            onClick={handleReAnalyze}
            className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800/60 flex items-center justify-center hover:bg-zinc-800 active:scale-95 transition-all"
            title={an.reAnalyzeButton}
          >
            <RotateCcw size={17} className="text-zinc-400" />
          </button>
        </motion.div>

        {/* ── Confidence + estimated banner ────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="bg-zinc-900/50 rounded-xl px-4 py-2.5 mb-5 border border-zinc-800/30 flex items-center justify-between"
        >
          <p className="text-[11px] text-zinc-400">
            {an.estimatedResults}
          </p>
          <Badge
            variant={confidenceVariant(initialResult.confidence)}
            size="md"
            icon={<ConfidenceIcon level={initialResult.confidence} size={11} />}
          >
            {Math.round(initialResult.confidenceScore * 100)}%
          </Badge>
        </motion.div>

        {/* ── Warnings banner ────────────────────────────────── */}
        {initialResult.warnings && initialResult.warnings.length > 0 && (
          <WarningsBanner warnings={initialResult.warnings} />
        )}

        {/* ── Meal image preview ──────────────────────────────── */}
        {initialResult.imagePreview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-5"
          >
            <div className="relative rounded-2xl overflow-hidden border border-zinc-800/50">
              <img
                src={initialResult.imagePreview}
                alt="Meal photo"
                className="w-full h-44 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4">
                <p className="text-[15px] font-semibold text-white drop-shadow-lg">
                  {initialResult.mealName}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Meal name (when no image) ───────────────────────── */}
        {!initialResult.imagePreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-5"
          >
            <p className="text-lg font-semibold">{initialResult.mealName}</p>
          </motion.div>
        )}

        {/* ── Total calories & macros card ────────────────────── */}
        <Card variant="elevated" padding="lg" className="mb-5" animationDelay={0.12}>
          <div className="text-center mb-5">
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-5xl font-bold tabular-nums tracking-tight"
            >
              {totals.calories}
            </motion.p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium mt-1">
              {an.estimatedTotalKcal}
            </p>
          </div>

          <div className="flex justify-around pt-4 border-t border-zinc-800/40">
            <MacroStatBlock label={an.proteinLabel} value={totals.protein} unit="g" delay={0.22} />
            <MacroStatBlock label={an.carbsLabel} value={totals.carbs} unit="g" delay={0.28} />
            <MacroStatBlock label={an.fatMacroLabel} value={totals.fat} unit="g" delay={0.34} />
            <MacroStatBlock label={an.fiberLabel} value={totals.fiber} unit="g" delay={0.40} />
          </div>
        </Card>

        {/* ── Detected items ─────────────────────────────────── */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[15px] font-semibold tracking-tight">
              {an.detectedFoods}
            </h2>
            <span className="text-[11px] text-zinc-500 tabular-nums">
              {an.itemCount(items.length)}
            </span>
          </div>

          <AnimatePresence>
            {items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-zinc-900/40 rounded-2xl p-8 text-center border border-zinc-800/20"
              >
                <p className="text-zinc-400 text-sm mb-1">{an.noItemsLeft}</p>
                <p className="text-zinc-500 text-[12px]">
                  {an.noItemsHint}
                </p>
              </motion.div>
            ) : (
              <div className="space-y-2.5">
                {items.map((item, index) => (
                  <FoodItemCard
                    key={item.id}
                    item={item}
                    index={index}
                    onGramsChange={handleGramsChange}
                    onRemove={handleRemoveItem}
                    onNameChange={handleNameChange}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Add new item */}
          <div className="mt-3">
            <AddItemInline onAdd={handleAddItem} />
          </div>
        </div>

        {/* ── Action buttons ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.3 }}
          className="space-y-3"
        >
          <AnimatePresence mode="wait">
            {saved ? (
              <motion.div
                key="saved"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-[52px] rounded-2xl bg-white flex items-center justify-center gap-2"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <Check size={20} className="text-black" />
                </motion.div>
                <span className="text-black font-semibold">{an.mealAddedToLog}</span>
              </motion.div>
            ) : (
              <motion.div key="save-btn" exit={{ opacity: 0 }} className="space-y-3">
                {saveError && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
                  >
                    <X size={14} className="text-red-400 flex-shrink-0" />
                    <p className="text-[13px] text-red-400">{saveError}</p>
                    <button onClick={() => setSaveError(null)} className="ml-auto p-1 rounded-lg hover:bg-red-500/10">
                      <X size={12} className="text-red-400" />
                    </button>
                  </motion.div>
                )}
                <Button
                  id="save-meal-button"
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleSaveMeal}
                  disabled={saving || saved || items.length === 0}
                  loading={saving}
                  icon={<Check size={18} />}
                >
                  {an.addToTodayMeals}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-2 gap-3">
            <Button
              id="re-scan-button"
              variant="secondary"
              size="md"
              fullWidth
              onClick={handleReAnalyze}
              icon={<RotateCcw size={15} />}
            >
              {an.reAnalyzeButton}
            </Button>
            <Button
              id="manual-entry-button"
              variant="ghost"
              size="md"
              fullWidth
              onClick={handleManualEntry}
              icon={<PenLine size={15} />}
            >
              {an.manualAdd}
            </Button>
          </div>
        </motion.div>

        {/* ── Disclaimer ──────────────────────────────────────── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-[10px] text-zinc-600 mt-6 leading-relaxed"
        >
          {an.disclaimer.split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
        </motion.p>
      </motion.div>
    </div>
  )
}
