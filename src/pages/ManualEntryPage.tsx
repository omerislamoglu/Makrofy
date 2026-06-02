import { useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check,
  ChevronDown,
  Bookmark,
  AlertCircle,
  Utensils,
  Flame,
  Beef,
  Wheat,
  Droplets,
  Scale,
  Leaf,
  Hash,
} from 'lucide-react'
import type { MealType } from '../types/meal'
import type { MacroNutrients } from '../types/nutrition'
import { calculateMacrosForWeight } from '../types/nutrition'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'
import { useAuth } from '../hooks/useAuth'
import { useLocale } from '../contexts/LocaleContext'
import { createMeal } from '../services/mealService'

// ─── Birim tipleri ──────────────────────────────────────────────────────────

type EntryUnit = 'gram' | 'adet'

// ─── Form tipleri ───────────────────────────────────────────────────────────

interface ManualEntryForm {
  foodName: string
  mealType: MealType
  entryUnit: EntryUnit
  quantity: string          // adet sayısı veya gram miktarı
  gramsPerPiece: string     // 1 adetin gram karşılığı (adet modunda)
  caloriesPer100g: string
  proteinPer100g: string
  carbsPer100g: string
  fatPer100g: string
  fiberPer100g: string
  saveAsCustomFood: boolean
}

interface FormErrors {
  form?: string
  foodName?: string
  quantity?: string
  gramsPerPiece?: string
  caloriesPer100g?: string
  proteinPer100g?: string
  carbsPer100g?: string
  fatPer100g?: string
  fiberPer100g?: string
}

const INITIAL_FORM: ManualEntryForm = {
  foodName: '',
  mealType: 'lunch',
  entryUnit: 'gram',
  quantity: '',
  gramsPerPiece: '',
  caloriesPer100g: '',
  proteinPer100g: '',
  carbsPer100g: '',
  fatPer100g: '',
  fiberPer100g: '',
  saveAsCustomFood: false,
}

const MEAL_TYPE_VALUES: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack']

// Popüler yiyecekler için hızlı doldurma (USDA kaynaklı doğru değerler)
const QUICK_FOODS: {
  name: string
  caloriesPer100g: number
  proteinPer100g: number
  carbsPer100g: number
  fatPer100g: number
  fiberPer100g: number
  gramsPerPiece?: number
  suggestUnit?: EntryUnit
}[] = [
  { name: 'Haşlanmış Yumurta', caloriesPer100g: 155, proteinPer100g: 12.6, carbsPer100g: 1.1, fatPer100g: 10.6, fiberPer100g: 0, gramsPerPiece: 50, suggestUnit: 'adet' },
  { name: 'Tavuk Göğsü (Izgara)', caloriesPer100g: 165, proteinPer100g: 31, carbsPer100g: 0, fatPer100g: 3.6, fiberPer100g: 0 },
  { name: 'Bulgur Pilavı', caloriesPer100g: 83, proteinPer100g: 3.1, carbsPer100g: 18.6, fatPer100g: 0.2, fiberPer100g: 4.5 },
  { name: 'Beyaz Pirinç Pilavı', caloriesPer100g: 130, proteinPer100g: 2.7, carbsPer100g: 28, fatPer100g: 0.3, fiberPer100g: 0.4 },
  { name: 'Tam Buğday Ekmeği', caloriesPer100g: 247, proteinPer100g: 13, carbsPer100g: 43, fatPer100g: 3.4, fiberPer100g: 6.8, gramsPerPiece: 30, suggestUnit: 'adet' },
  { name: 'Muz', caloriesPer100g: 89, proteinPer100g: 1.1, carbsPer100g: 22.8, fatPer100g: 0.3, fiberPer100g: 2.6, gramsPerPiece: 118, suggestUnit: 'adet' },
  { name: 'Elma', caloriesPer100g: 52, proteinPer100g: 0.3, carbsPer100g: 13.8, fatPer100g: 0.2, fiberPer100g: 2.4, gramsPerPiece: 182, suggestUnit: 'adet' },
  { name: 'Süzme Yoğurt (%0)', caloriesPer100g: 59, proteinPer100g: 10, carbsPer100g: 3.6, fatPer100g: 0.4, fiberPer100g: 0 },
  { name: 'Badem', caloriesPer100g: 579, proteinPer100g: 21, carbsPer100g: 22, fatPer100g: 50, fiberPer100g: 12.5 },
  { name: 'Ceviz', caloriesPer100g: 654, proteinPer100g: 15, carbsPer100g: 14, fatPer100g: 65, fiberPer100g: 6.7 },
  { name: 'Avokado', caloriesPer100g: 160, proteinPer100g: 2, carbsPer100g: 8.5, fatPer100g: 14.7, fiberPer100g: 6.7, gramsPerPiece: 150, suggestUnit: 'adet' },
  { name: 'Somon Fileto', caloriesPer100g: 208, proteinPer100g: 20, carbsPer100g: 0, fatPer100g: 13, fiberPer100g: 0 },
]

// ─── Yardımcılar ────────────────────────────────────────────────────────────

function parseNum(value: string): number {
  const n = parseFloat(value)
  return isNaN(n) ? 0 : Math.max(0, n)
}

function getNumericError(value: string, label: string): string | null {
  if (!value.trim()) return `${label} gerekli.`
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed < 0) return `${label} 0 veya daha büyük olmalı.`
  return null
}

function validate(form: ManualEntryForm): FormErrors {
  const errors: FormErrors = {}

  if (!form.foodName.trim()) {
    errors.foodName = 'Besin adı gerekli.'
  }

  const qty = Number(form.quantity)
  if (!form.quantity.trim() || !Number.isFinite(qty) || qty <= 0) {
    errors.quantity = form.entryUnit === 'adet' ? 'Adet sayısını girin.' : 'Geçerli bir gram miktarı girin.'
  }

  if (form.entryUnit === 'adet') {
    const gpp = Number(form.gramsPerPiece)
    if (!form.gramsPerPiece.trim() || !Number.isFinite(gpp) || gpp <= 0) {
      errors.gramsPerPiece = '1 adetin gram karşılığını girin.'
    }
  }

  const calErr = getNumericError(form.caloriesPer100g, 'Kalori')
  const proErr = getNumericError(form.proteinPer100g, 'Protein')
  const carbErr = getNumericError(form.carbsPer100g, 'Karbonhidrat')
  const fatErr = getNumericError(form.fatPer100g, 'Yağ')
  const fibErr = getNumericError(form.fiberPer100g, 'Lif')

  if (calErr) errors.caloriesPer100g = calErr
  if (proErr) errors.proteinPer100g = proErr
  if (carbErr) errors.carbsPer100g = carbErr
  if (fatErr) errors.fatPer100g = fatErr
  if (fibErr) errors.fiberPer100g = fibErr

  return errors
}

/** Toplam gramı hesapla (adet × gram/adet veya doğrudan gram) */
function computeTotalGrams(form: ManualEntryForm): number {
  if (form.entryUnit === 'adet') {
    return parseNum(form.quantity) * parseNum(form.gramsPerPiece)
  }
  return parseNum(form.quantity)
}

// ─── Alt bileşenler ─────────────────────────────────────────────────────────

function MealTypeSelector({ value, onChange }: { value: MealType; onChange: (v: MealType) => void }) {
  const { strings } = useLocale()
  const mealTypes = MEAL_TYPE_VALUES.map((v) => ({ value: v, label: strings.mealType[v] }))
  return (
    <div className="grid grid-cols-4 gap-2">
      {mealTypes.map((type) => {
        const isActive = value === type.value
        return (
          <button
            key={type.value}
            id={`meal-type-${type.value}`}
            type="button"
            onClick={() => onChange(type.value)}
            className={`
              h-11 rounded-xl text-[12px] font-medium
              transition-all duration-200 active:scale-[0.97]
              ${isActive
                ? 'bg-white text-black shadow-[0_0_0_1px_rgba(255,255,255,0.1)]'
                : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200'
              }
            `}
          >
            {type.label}
          </button>
        )
      })}
    </div>
  )
}

function UnitSelector({ value, onChange }: { value: EntryUnit; onChange: (v: EntryUnit) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {([
        { value: 'gram' as EntryUnit, label: 'Gram', icon: Scale },
        { value: 'adet' as EntryUnit, label: 'Adet', icon: Hash },
      ]).map((opt) => {
        const isActive = value === opt.value
        const Icon = opt.icon
        return (
          <button
            key={opt.value}
            id={`unit-${opt.value}`}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`
              h-11 rounded-xl text-[12px] font-medium flex items-center justify-center gap-1.5
              transition-all duration-200 active:scale-[0.97]
              ${isActive
                ? 'bg-white text-black'
                : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800'
              }
            `}
          >
            <Icon size={14} />
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

function QuickFoodChips({
  onSelect,
}: {
  onSelect: (food: (typeof QUICK_FOODS)[number]) => void
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
      {QUICK_FOODS.map((food) => (
        <button
          key={food.name}
          type="button"
          onClick={() => onSelect(food)}
          className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800/50 text-[11px] text-zinc-300 hover:bg-zinc-800 hover:text-white active:scale-[0.97] transition-all"
        >
          {food.name}
        </button>
      ))}
    </div>
  )
}

function LivePreviewCard({ macros, totalGrams, unit, quantity }: {
  macros: MacroNutrients
  totalGrams: number
  unit: EntryUnit
  quantity: number
}) {
  const hasValues = macros.calories > 0 || macros.protein > 0 || macros.carbs > 0 || macros.fat > 0
  if (!hasValues) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      exit={{ opacity: 0, y: -8, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card variant="subtle" padding="md" className="mb-5" animated={false}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">
            Bu porsiyon için besin değerleri
          </p>
          {unit === 'adet' && quantity > 0 && (
            <span className="text-[10px] text-zinc-400 tabular-nums">
              {quantity} adet · {totalGrams}g
            </span>
          )}
        </div>
        <div className="flex justify-around text-center">
          <PreviewStat icon={Flame} label="Kal" value={macros.calories} unit="kcal" />
          <PreviewStat icon={Beef} label="Protein" value={macros.protein} unit="g" />
          <PreviewStat icon={Wheat} label="Karb" value={macros.carbs} unit="g" />
          <PreviewStat icon={Droplets} label="Yağ" value={macros.fat} unit="g" />
          <PreviewStat icon={Leaf} label="Lif" value={macros.fiber} unit="g" />
        </div>
      </Card>
    </motion.div>
  )
}

function PreviewStat({ icon: Icon, label, value, unit }: {
  icon: typeof Flame; label: string; value: number; unit: string
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <Icon size={13} className="text-zinc-500" />
      <p className="text-base font-bold tabular-nums">{value}</p>
      <p className="text-[8px] text-zinc-500 uppercase tracking-widest">
        {label}
        <span className="text-zinc-600 ml-0.5">{unit}</span>
      </p>
    </div>
  )
}

// ─── Ana bileşen ────────────────────────────────────────────────────────────

export default function ManualEntryPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { strings } = useLocale()
  const mn = strings.manual

  const [form, setForm] = useState<ManualEntryForm>(INITIAL_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // ── Alan güncelleyici (tip-güvenli) ─────────────────────────────────────
  const updateField = useCallback(
    <K extends keyof ManualEntryForm>(field: K, value: ManualEntryForm[K]) => {
      setForm((prev) => ({ ...prev, [field]: value }))
      if (submitted) {
        setErrors((prev) => {
          const next = { ...prev }
          delete next[field as keyof FormErrors]
          return next
        })
      }
    },
    [submitted]
  )

  // ── Hızlı besin seçimi ──────────────────────────────────────────────────
  const handleQuickFood = useCallback(
    (food: (typeof QUICK_FOODS)[number]) => {
      setForm((prev) => ({
        ...prev,
        foodName: food.name,
        caloriesPer100g: String(food.caloriesPer100g),
        proteinPer100g: String(food.proteinPer100g),
        carbsPer100g: String(food.carbsPer100g),
        fatPer100g: String(food.fatPer100g),
        fiberPer100g: String(food.fiberPer100g),
        entryUnit: food.suggestUnit ?? prev.entryUnit,
        gramsPerPiece: food.gramsPerPiece ? String(food.gramsPerPiece) : prev.gramsPerPiece,
      }))
      if (submitted) setErrors({})
    },
    [submitted]
  )

  // ── Toplam gram ve canlı makro önizleme ─────────────────────────────────
  const totalGrams = useMemo(() => computeTotalGrams(form), [form.quantity, form.gramsPerPiece, form.entryUnit])

  const liveMacros: MacroNutrients = useMemo(() => {
    if (totalGrams <= 0) return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    return calculateMacrosForWeight(
      {
        calories: parseNum(form.caloriesPer100g),
        protein: parseNum(form.proteinPer100g),
        carbs: parseNum(form.carbsPer100g),
        fat: parseNum(form.fatPer100g),
        fiber: parseNum(form.fiberPer100g),
      },
      totalGrams
    )
  }, [totalGrams, form.caloriesPer100g, form.proteinPer100g, form.carbsPer100g, form.fatPer100g, form.fiberPer100g])

  // ── Kaydet ──────────────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    setSubmitted(true)
    const validationErrors = validate(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    if (!user?.uid) {
      setErrors({ form: mn.loginRequired })
      return
    }

    setSaving(true)

    try {
      const foodName = form.entryUnit === 'adet'
        ? `${form.foodName} (${parseNum(form.quantity)} adet)`
        : form.foodName

      await createMeal(user.uid, {
        mealType: form.mealType,
        source: 'manual',
        items: [{
          name: foodName,
          grams: Math.round(totalGrams),
          caloriesPer100g: parseNum(form.caloriesPer100g),
          proteinPer100g: parseNum(form.proteinPer100g),
          carbsPer100g: parseNum(form.carbsPer100g),
          fatPer100g: parseNum(form.fatPer100g),
          fiberPer100g: parseNum(form.fiberPer100g),
        }],
      })

      setSaving(false)
      setSaved(true)
      setTimeout(() => navigate('/'), 1000)
    } catch (err) {
      setSaving(false)
      setErrors({ form: mn.saveFailed })
    }
  }, [form, navigate, totalGrams, user])

  const errorCount = Object.keys(errors).length

  return (
    <div className="px-5 pt-14 pb-8 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        {/* ── Başlık ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <h1 className="text-[26px] font-bold tracking-tight">{mn.title}</h1>
          <p className="text-zinc-400 text-sm mt-1.5 leading-relaxed">
            {mn.subtitle}
          </p>
        </motion.div>

        {/* ── Hızlı seçim ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.03 }}
          className="mb-5"
        >
          <label className="block text-[11px] text-zinc-400 uppercase tracking-wider font-medium mb-2">
            {mn.quickSelect}
          </label>
          <QuickFoodChips onSelect={handleQuickFood} />
        </motion.div>

        {/* ── Hata çubuğu ─────────────────────────────────────────── */}
        <AnimatePresence>
          {submitted && errorCount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-5 overflow-hidden"
            >
              <div className="bg-zinc-900 border border-red-500/20 rounded-xl px-4 py-3 flex items-center gap-3">
                <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                <p className="text-[13px] text-zinc-300">
                  {errors.form ?? mn.fixErrors(errorCount)}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Öğün tipi ───────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }} className="mb-6">
          <label className="block text-[11px] text-zinc-400 uppercase tracking-wider font-medium mb-2.5">{mn.mealTypeLabel}</label>
          <MealTypeSelector value={form.mealType} onChange={(v) => updateField('mealType', v)} />
        </motion.div>

        {/* ── Besin adı ───────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }} className="mb-5">
          <Input
            id="food-name-input"
            label={mn.foodNameLabel}
            placeholder={mn.foodNamePlaceholder}
            value={form.foodName}
            onChange={(e) => updateField('foodName', e.target.value)}
            error={errors.foodName}
            leftIcon={<Utensils size={16} />}
          />
        </motion.div>

        {/* ── Birim seçici (gram/adet) ─────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.13 }} className="mb-5">
          <label className="block text-[11px] text-zinc-400 uppercase tracking-wider font-medium mb-2.5">{mn.entryUnit}</label>
          <UnitSelector value={form.entryUnit} onChange={(v) => updateField('entryUnit', v)} />
        </motion.div>

        {/* ── Miktar girişi ────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.15 }} className="mb-5">
          {form.entryUnit === 'adet' ? (
            <div className="grid grid-cols-2 gap-3">
              <Input
                id="quantity-input"
                label={mn.pieceCount}
                type="number"
                placeholder="3"
                value={form.quantity}
                onChange={(e) => updateField('quantity', e.target.value)}
                error={errors.quantity}
                leftIcon={<Hash size={16} />}
                inputMode="decimal"
                min={0}
              />
              <Input
                id="grams-per-piece-input"
                label={mn.pieceGrams}
                type="number"
                placeholder="50"
                value={form.gramsPerPiece}
                onChange={(e) => updateField('gramsPerPiece', e.target.value)}
                error={errors.gramsPerPiece}
                hint={totalGrams > 0 ? `Toplam: ${Math.round(totalGrams)}g` : undefined}
                leftIcon={<Scale size={16} />}
                inputMode="decimal"
                min={0}
              />
            </div>
          ) : (
            <Input
              id="grams-input"
              label={mn.portionGrams}
              type="number"
              placeholder="150"
              value={form.quantity}
              onChange={(e) => updateField('quantity', e.target.value)}
              error={errors.quantity}
              hint={mn.gramsHint}
              leftIcon={<Scale size={16} />}
              inputMode="decimal"
              min={0}
            />
          )}
        </motion.div>

        {/* ── Besin değerleri (100g başına) ─────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.2 }} className="mb-2">
          <div className="flex items-center gap-2 mb-3">
            <label className="text-[11px] text-zinc-400 uppercase tracking-wider font-medium">{mn.nutrientsPer100g}</label>
            <ChevronDown size={12} className="text-zinc-600" />
          </div>

          <div className="mb-3">
            <Input
              id="calories-input"
              label={mn.calorieLabel}
              type="number"
              placeholder="155"
              value={form.caloriesPer100g}
              onChange={(e) => updateField('caloriesPer100g', e.target.value)}
              error={errors.caloriesPer100g}
              leftIcon={<Flame size={16} />}
              inputMode="decimal"
              min={0}
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5 mb-2.5">
            <Input
              id="protein-input"
              label={mn.proteinLabel}
              type="number"
              placeholder="12.6"
              value={form.proteinPer100g}
              onChange={(e) => updateField('proteinPer100g', e.target.value)}
              error={errors.proteinPer100g}
              hint="gram"
              inputMode="decimal"
              min={0}
            />
            <Input
              id="carbs-input"
              label={mn.carbsLabel}
              type="number"
              placeholder="1.1"
              value={form.carbsPer100g}
              onChange={(e) => updateField('carbsPer100g', e.target.value)}
              error={errors.carbsPer100g}
              hint="gram"
              inputMode="decimal"
              min={0}
            />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <Input
              id="fat-input"
              label={mn.fatLabel}
              type="number"
              placeholder="10.6"
              value={form.fatPer100g}
              onChange={(e) => updateField('fatPer100g', e.target.value)}
              error={errors.fatPer100g}
              hint="gram"
              inputMode="decimal"
              min={0}
            />
            <Input
              id="fiber-input"
              label={mn.fiberLabel}
              type="number"
              placeholder="0"
              value={form.fiberPer100g}
              onChange={(e) => updateField('fiberPer100g', e.target.value)}
              error={errors.fiberPer100g}
              hint="gram"
              inputMode="decimal"
              min={0}
            />
          </div>
        </motion.div>

        {/* ── Canlı önizleme ───────────────────────────────────────── */}
        <AnimatePresence>
          <LivePreviewCard
            macros={liveMacros}
            totalGrams={Math.round(totalGrams)}
            unit={form.entryUnit}
            quantity={parseNum(form.quantity)}
          />
        </AnimatePresence>

        {/* ── Özel besin olarak kaydet ─────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.25 }} className="mb-6">
          <button
            id="save-custom-food-toggle"
            type="button"
            onClick={() => updateField('saveAsCustomFood', !form.saveAsCustomFood)}
            className={`
              w-full rounded-xl px-4 py-3.5 flex items-center gap-3
              transition-all duration-200 active:scale-[0.99]
              ${form.saveAsCustomFood
                ? 'bg-white/5 border border-white/15'
                : 'bg-zinc-900 border border-zinc-800/50 hover:bg-zinc-800/60'
              }
            `}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${form.saveAsCustomFood ? 'bg-white/10' : 'bg-zinc-800'}`}>
              <Bookmark size={15} className={form.saveAsCustomFood ? 'text-white' : 'text-zinc-500'} fill={form.saveAsCustomFood ? 'currentColor' : 'none'} />
            </div>
            <div className="text-left flex-1">
              <p className="text-[13px] font-medium text-zinc-200">{mn.saveAsCustom}</p>
              <p className="text-[11px] text-zinc-500">{mn.saveAsCustomSub}</p>
            </div>
            <div className={`w-10 h-6 rounded-full transition-all duration-200 flex items-center px-0.5 ${form.saveAsCustomFood ? 'bg-white' : 'bg-zinc-700'}`}>
              <motion.div
                animate={{ x: form.saveAsCustomFood ? 16 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className={`w-5 h-5 rounded-full shadow-sm ${form.saveAsCustomFood ? 'bg-black' : 'bg-zinc-400'}`}
              />
            </div>
          </button>
        </motion.div>

        {/* ── Kaydet butonu ─────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.3 }}>
          <AnimatePresence mode="wait">
            {saved ? (
              <motion.div key="saved" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-[52px] rounded-2xl bg-white flex items-center justify-center gap-2">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
                  <Check size={20} className="text-black" />
                </motion.div>
                <span className="text-black font-semibold">{mn.mealSaved}</span>
              </motion.div>
            ) : (
              <motion.div key="save-btn" exit={{ opacity: 0 }}>
                <Button id="save-meal-button" variant="primary" size="lg" fullWidth onClick={handleSave} loading={saving} icon={<Check size={18} />}>
                  {mn.saveButton}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center text-[10px] text-zinc-600 mt-5 leading-relaxed">
          {mn.disclaimer}
        </motion.p>
      </motion.div>
    </div>
  )
}
