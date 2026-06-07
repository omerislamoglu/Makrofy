import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLocale } from '../contexts/LocaleContext'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Camera,
  Upload,
  Image as ImageIcon,
  X,
  Sparkles,
  AlertCircle,
  Zap,
  ChevronRight,
  Check,
  Utensils,
  Flame,
  Beef,
  Wheat,
  Droplets,
  Scale,
  Leaf,
  Hash,
  // PenLine removed — replaced by Type icon for text tab
  ScanLine,
  MessageSquare,
  Store,
  Search,
  Plus,
  Minus,
  ChevronLeft,
  Type,
  ChevronDown,
  Trash2,
  RefreshCw,
  ShoppingCart,
  Crown,
  Lock,
} from 'lucide-react'
import { restaurants, type Restaurant, type RestaurantMenuItem } from '../data/restaurantMenus'
import { getFoodCatalog, getPopularFoodIds } from '../data/foodCatalog'
import type { FoodCatalogCategory, FoodCatalogItem, FoodServingOption, FoodUnitType } from '../types/food'
import { calculateFoodSelection } from '../utils/foodCalculation'
import {
  getRecentFoodIds,
  rememberRecentFood,
  searchFoodCatalog,
} from '../utils/foodSearch'
import { useCamera } from '../hooks/useCamera'
import { useHaptics } from '../hooks/useCapacitor'
import type { ScanLimit } from '../types/subscription'
import type { MealType } from '../types/meal'
import type { MacroNutrients } from '../types/nutrition'
import { calculateMacrosForWeight, sumMacros } from '../types/nutrition'
import { useAuth } from '../hooks/useAuth'
import { useScanLimit } from '../hooks/useScanLimit'
import { createId } from '../utils/id'
import { createMeal } from '../services/mealService'
import { analyzeMealImage, ScanServiceError } from '../services/scanService'
import { compressImageForAI } from '../utils/imageCompression'
import { getToday } from '../utils/date'
import {
  parseNaturalLanguageInput,
  suggestMealType,
  resolveWithFood,
  resolveWithQuantity,
  resolveWithServingAndQuantity,
  type ResolvedFoodItem,
} from '../utils/naturalLanguageFoodParser'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'
import { useSubscription } from '../hooks/useSubscription'

// ═══════════════════════════════════════════════════════════════════════════
// Tab type
// ═══════════════════════════════════════════════════════════════════════════

type AddMode = 'scan' | 'manual' | 'text' | 'restaurant'

// ═══════════════════════════════════════════════════════════════════════════
// SCAN TAB — file helpers
// ═══════════════════════════════════════════════════════════════════════════

const MAX_FILE_SIZE = 10 * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic']

function validateFile(file: File, ap: { unsupportedFormat: string; imageTooLarge: string }): string | null {
  if (!ACCEPTED_TYPES.includes(file.type) && !file.name.toLowerCase().endsWith('.heic')) {
    return ap.unsupportedFormat
  }
  if (file.size > MAX_FILE_SIZE) {
    return ap.imageTooLarge
  }
  return null
}


// ═══════════════════════════════════════════════════════════════════════════
// MANUAL TAB — types & helpers
// ═══════════════════════════════════════════════════════════════════════════

type EntryUnit = FoodUnitType

interface ManualEntryForm {
  foodName: string
  mealType: MealType
  entryUnit: EntryUnit
  quantity: string
  amountPerUnit: string
  caloriesPer100g: string
  proteinPer100g: string
  carbsPer100g: string
  fatPer100g: string
  fiberPer100g: string
  sugar: string
  saturatedFat: string
  sodium: string
  category: FoodCatalogCategory
  note: string
  saveAsCustomFood: boolean
}

interface FormErrors {
  form?: string
  foodName?: string
  quantity?: string
  amountPerUnit?: string
  caloriesPer100g?: string
  proteinPer100g?: string
  carbsPer100g?: string
  fatPer100g?: string
  fiberPer100g?: string
}

const INITIAL_FORM: ManualEntryForm = {
  foodName: '',
  mealType: suggestMealType(),
  entryUnit: 'gram',
  quantity: '',
  amountPerUnit: '',
  caloriesPer100g: '',
  proteinPer100g: '',
  carbsPer100g: '',
  fatPer100g: '',
  fiberPer100g: '',
  sugar: '',
  saturatedFat: '',
  sodium: '',
  category: 'Ana Yemek',
  note: '',
  saveAsCustomFood: false,
}

const MEAL_TYPE_VALUES: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack']

function servingAmount(serving: FoodServingOption): number {
  return serving.mlEquivalent ?? serving.gramEquivalent ?? 100
}

function servingToUnit(serving: FoodServingOption): {
  entryUnit: EntryUnit
  quantity: string
  amountPerUnit: string
} {
  const amount = servingAmount(serving)
  if (serving.unitType === 'gram' || serving.unitType === 'ml') {
    return {
      entryUnit: serving.unitType,
      quantity: String(amount),
      amountPerUnit: '',
    }
  }

  return {
    entryUnit: serving.unitType,
    quantity: '1',
    amountPerUnit: String(amount),
  }
}

function parseNum(value: string): number {
  const n = parseFloat(value)
  return isNaN(n) ? 0 : Math.max(0, n)
}

function validateManualForm(form: ManualEntryForm, ms: { foodNameRequired: string; enterPieceCount: string; enterValidGrams: string; enterPieceGrams: string; noNutrientData: string }): FormErrors {
  const errors: FormErrors = {}
  if (!form.foodName.trim()) errors.foodName = ms.foodNameRequired
  const qty = Number(form.quantity)
  if (!form.quantity.trim() || !Number.isFinite(qty) || qty <= 0) {
    errors.quantity = form.entryUnit === 'adet' ? ms.enterPieceCount : ms.enterValidGrams
  }
  if (form.entryUnit !== 'gram' && form.entryUnit !== 'ml') {
    const amount = Number(form.amountPerUnit)
    if (!form.amountPerUnit.trim() || !Number.isFinite(amount) || amount <= 0) {
      errors.amountPerUnit = ms.enterPieceGrams
    }
  }
  // Besin değerleri artık listeden seçilen besinden gelir; manuel girilmez.
  // Kalori bilgisi yoksa kullanıcıyı listeden seçmeye yönlendir.
  if (parseNum(form.caloriesPer100g) <= 0) {
    errors.form = ms.noNutrientData
  }
  return errors
}

function computeTotalGrams(form: ManualEntryForm): number {
  if (form.entryUnit === 'ml') return parseNum(form.quantity)
  if (form.entryUnit === 'gram') return parseNum(form.quantity)
  return parseNum(form.quantity) * parseNum(form.amountPerUnit)
}

function computeEquivalentAmount(form: ManualEntryForm): number {
  if (form.entryUnit === 'gram' || form.entryUnit === 'ml') return parseNum(form.quantity)
  return parseNum(form.quantity) * parseNum(form.amountPerUnit)
}

function formatServingAmount(amount: number, unit: EntryUnit): string {
  const suffix = unit === 'ml' || unit === 'kutu' || unit === 'sise' ? 'ml' : 'g'
  return `${Math.round(amount)}${suffix}`
}

function hasCatalogServingAmount(food: FoodCatalogItem | null, form: ManualEntryForm): boolean {
  if (!food || form.entryUnit === 'gram' || form.entryUnit === 'ml') return false
  const amount = parseNum(form.amountPerUnit)
  if (amount <= 0) return false
  return food.servingOptions.some((serving) =>
    serving.unitType === form.entryUnit && servingAmount(serving) === amount
  )
}

function findServingForForm(food: FoodCatalogItem | null, form: ManualEntryForm): FoodServingOption {
  if (food) {
    const matched = food.servingOptions.find((serving) => serving.unitType === form.entryUnit && String(servingAmount(serving)) === String(parseNum(form.amountPerUnit)))
    if (matched) return matched
  }
  return {
    id: 'manual',
    label: form.entryUnit === 'gram' ? 'Gram' : form.entryUnit === 'ml' ? 'Mililitre' : form.entryUnit,
    unitType: form.entryUnit,
    quantity: 1,
    ...(form.entryUnit === 'ml' ? { mlEquivalent: 1 } : { gramEquivalent: form.entryUnit === 'gram' ? 1 : parseNum(form.amountPerUnit) }),
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SCAN SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

function UploadZone({
  onTakePhoto,
  onPickGallery,
  onDrop,
  isDragging,
  onDragEnter,
  onDragLeave,
}: {
  onTakePhoto: () => void
  onPickGallery: () => void
  onDrop: (e: React.DragEvent) => void
  isDragging: boolean
  onDragEnter: (e: React.DragEvent) => void
  onDragLeave: (e: React.DragEvent) => void
}) {
  const { strings } = useLocale()
  const ap = strings.addPage

  return (
    <>
      <motion.button
        id="take-photo-button"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        onClick={onTakePhoto}
        className="w-full bg-white text-black rounded-3xl p-5 flex items-center gap-4 hover:bg-zinc-100 active:scale-[0.98] transition-all duration-150 mb-3"
      >
        <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center flex-shrink-0">
          <Camera size={24} className="text-white" />
        </div>
        <div className="text-left flex-1">
          <p className="text-[16px] font-bold">{ap.takePhoto}</p>
          <p className="text-[12px] text-zinc-500">{ap.takePhotoSub}</p>
        </div>
        <div className="flex-shrink-0">
          <Sparkles size={18} className="text-zinc-400" />
        </div>
      </motion.button>

      <motion.button
        id="upload-gallery-button"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
        onClick={onPickGallery}
        className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-2xl p-4 flex items-center gap-3.5 hover:bg-zinc-800 active:scale-[0.98] transition-all duration-150 mb-4"
      >
        <div className="w-11 h-11 bg-zinc-800 rounded-xl flex items-center justify-center flex-shrink-0">
          <Upload size={18} className="text-zinc-300" />
        </div>
        <div className="text-left flex-1">
          <p className="text-[14px] font-semibold">{ap.uploadGallery}</p>
          <p className="text-[11px] text-zinc-500">{ap.uploadGallerySub}</p>
        </div>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={onPickGallery}
        className={`
          cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 ease-out
          flex items-center justify-center gap-3 py-6 px-4
          ${isDragging ? 'border-white/60 bg-white/5 scale-[1.01]' : 'border-zinc-800/50 bg-zinc-900/30 hover:border-zinc-600/50'}
        `}
      >
        <ImageIcon size={18} className="text-zinc-600" />
        <p className="text-[12px] text-zinc-500">
          {isDragging ? ap.dropHere : ap.dragHere}
        </p>
        <span className="text-[10px] text-zinc-600 bg-zinc-800/50 rounded-md px-2 py-0.5">JPG, PNG, WebP</span>
      </motion.div>
    </>
  )
}

function ImagePreview({
  src,
  onRemove,
  onAnalyze,
  analyzing,
  gramNotes,
  onGramNotesChange,
}: {
  src: string
  onRemove: () => void
  onAnalyze: () => void
  analyzing: boolean
  gramNotes: string
  onGramNotesChange: (v: string) => void
}) {
  const { strings } = useLocale()
  const ap = strings.addPage

  return (
    <motion.div
      key="preview"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35 }}
    >
      <div className="relative rounded-3xl overflow-hidden border border-zinc-800/50 mb-4">
        <img
          src={src}
          alt="Meal preview"
          className={`w-full aspect-[4/3] object-cover transition-all duration-500 ${
            analyzing ? 'brightness-50 blur-[2px] scale-[1.02]' : ''
          }`}
        />
        {!analyzing && (
          <button type="button"
            id="remove-image-button"
            onClick={onRemove}
            className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/80 active:scale-95 transition-all"
          >
            <X size={16} className="text-white" />
          </button>
        )}
        {analyzing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="mb-4">
              <div className="w-12 h-12 rounded-full border-2 border-white/20 border-t-white flex items-center justify-center">
                <Sparkles size={18} className="text-white" />
              </div>
            </motion.div>
            <p className="text-[15px] font-semibold text-white mb-1">{ap.analyzingMeal}</p>
            <p className="text-[12px] text-zinc-400">{ap.analyzingWait}</p>
            <div className="flex gap-1.5 mt-4">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                  className="w-1.5 h-1.5 rounded-full bg-white"
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Opsiyonel gram notu alanı */}
      {!analyzing && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare size={13} className="text-zinc-500" />
            <label className="text-[11px] text-zinc-400 uppercase tracking-wider font-medium">
              {ap.gramInfoLabel}
            </label>
          </div>
          <textarea
            id="gram-notes-input"
            value={gramNotes}
            onChange={(e) => onGramNotesChange(e.target.value)}
            placeholder={ap.gramInfoPlaceholder}
            rows={2}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-[13px] text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600/30 transition-all duration-200 resize-none"
          />
          <p className="mt-1.5 text-[10px] text-zinc-600">
            {ap.gramInfoHint}
          </p>
        </motion.div>
      )}

      {!analyzing && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }}>
          <Button id="analyze-meal-button" variant="primary" size="lg" fullWidth onClick={onAnalyze} icon={<Sparkles size={18} />}>
            {ap.analyzeMeal}
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}

function ScanLimitBar({ limit, isPro, onUpgrade }: { limit: ScanLimit; isPro: boolean; onUpgrade: () => void }) {
  const { strings } = useLocale()
  const ap = strings.addPage

  if (limit.remaining === Infinity) return null

  if (limit.isLimited) {
    if (isPro) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="w-full bg-zinc-900 rounded-2xl px-4 py-4 border border-zinc-800/50 flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <div className="text-left">
            <p className="text-[13px] font-medium text-zinc-200">{ap.dailyQuotaExhausted}</p>
            <p className="text-[11px] text-zinc-500">{ap.scanAvailableAll}</p>
          </div>
        </motion.div>
      )
    }

  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      onClick={onUpgrade}
      className="w-full bg-zinc-900 rounded-2xl px-4 py-4 border border-zinc-800/50 flex items-center justify-between hover:bg-zinc-800/80 active:scale-[0.99] transition-all duration-200"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
          <Lock size={16} className="text-white" />
        </div>
        <div className="text-left">
          <p className="text-[13px] font-medium text-zinc-200">{ap.aiExclusivePro}</p>
          <p className="text-[11px] text-zinc-500">{ap.aiExclusiveProSub}</p>
        </div>
      </div>
      <ChevronRight size={16} className="text-zinc-600" />
    </motion.button>
  )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="bg-zinc-900/70 rounded-xl px-4 py-3 border border-zinc-800/40 flex items-center justify-between"
    >
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
          <Zap size={13} className="text-white" />
        </div>
        <span className="text-[13px] text-zinc-300">
          {isPro ? ap.aiQuotaRemaining(limit.remaining, limit.total) : strings.scanBanner.remaining(limit.remaining)}
        </span>
      </div>
      <Sparkles size={14} className="text-zinc-600" />
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MANUAL SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

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
              h-11 rounded-xl text-[12px] font-medium transition-all duration-200 active:scale-[0.97]
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
  const { strings } = useLocale()
  const ap = strings.addPage
  const primaryUnits: Array<{ value: EntryUnit; label: string; icon: typeof Scale }> = [
    { value: 'gram', label: ap.unitGram, icon: Scale },
    { value: 'adet', label: ap.unitPiece, icon: Hash },
    { value: 'porsiyon', label: ap.unitPortion, icon: Utensils },
    { value: 'ml', label: ap.unitMl, icon: Droplets },
  ]
  const secondaryUnits: Array<{ value: EntryUnit; label: string }> = [
    { value: 'paket', label: ap.unitPacket },
    { value: 'dilim', label: ap.unitSlice },
    { value: 'bar', label: ap.unitBar },
    { value: 'kutu', label: ap.unitBox },
    { value: 'sise', label: ap.unitBottle },
  ]
  const isSecondaryActive = secondaryUnits.some(u => u.value === value)
  const [showMore, setShowMore] = useState(isSecondaryActive)

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {primaryUnits.map((opt) => {
          const isActive = value === opt.value
          const Icon = opt.icon
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`
                flex-1 h-10 rounded-xl text-[12px] font-medium flex items-center justify-center gap-1.5
                transition-all duration-200 active:scale-[0.97]
                ${isActive ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'}
              `}
            >
              <Icon size={13} />
              {opt.label}
            </button>
          )
        })}
      </div>
      {!showMore && !isSecondaryActive && (
        <button type="button" onClick={() => setShowMore(true)}
          className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors">
          {ap.otherUnits}
        </button>
      )}
      {(showMore || isSecondaryActive) && (
        <div className="flex gap-2 flex-wrap">
          {secondaryUnits.map((opt) => {
            const isActive = value === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange(opt.value)}
                className={`
                  px-3 h-9 rounded-xl text-[11px] font-medium transition-all duration-200 active:scale-[0.97]
                  ${isActive ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'}
                `}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function FoodSearchResults({
  query,
  suggestions,
  onSelect,
}: {
  query: string
  suggestions: FoodCatalogItem[]
  onSelect: (food: FoodCatalogItem) => void
}) {
  const { strings, locale } = useLocale()
  const isEN = locale === 'en'
  if (query.trim().length < 2) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className="mt-2 max-h-[360px] overflow-y-auto smooth-scroll-area bg-zinc-900 border border-zinc-800/70 rounded-2xl divide-y divide-zinc-800/50"
      >
        {suggestions.length > 0 ? (
          suggestions.slice(0, 20).map((food) => (
            <button
              key={food.id}
              type="button"
              onClick={() => onSelect(food)}
              className="w-full px-4 py-3 flex items-center justify-between gap-3 text-left hover:bg-zinc-800/70 active:bg-zinc-800 transition-colors"
            >
              <div className="min-w-0">
                <p className="text-[13px] text-zinc-100 font-medium truncate">{food.name}</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">
                  {[food.brand, food.subcategory].filter(Boolean).join(' · ') || food.category}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[12px] text-zinc-200 font-semibold tabular-nums">{food.calories} kcal</p>
                <p className="text-[9px] text-zinc-500">
                  {isEN ? 'P' : 'P'} {food.protein} · {isEN ? 'C' : 'K'} {food.carbs} · {isEN ? 'F' : 'Y'} {food.fat}
                </p>
              </div>
            </button>
          ))
        ) : (
          <div className="px-4 py-3">
            <p className="text-[12px] text-zinc-500">{strings.addPage.manualEntryHint}</p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

function SelectedFoodPanel({
  food,
  activeServingLabel,
  onServingSelect,
  onClear,
}: {
  food: FoodCatalogItem
  activeServingLabel: string
  onServingSelect: (serving: FoodServingOption) => void
  onClear: () => void
}) {
  const servings = food.servingOptions

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="mt-3 bg-zinc-900 border border-zinc-800/70 rounded-2xl p-4"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <p className="text-[15px] font-semibold text-zinc-100 truncate">{food.name}</p>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            {[food.brand, food.subcategory].filter(Boolean).join(' · ') || food.category}
          </p>
        </div>
        <button type="button" onClick={onClear} className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0 hover:bg-zinc-700">
          <X size={14} className="text-zinc-400" />
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide smooth-scroll-area">
        {servings.map((serving) => {
          const isActive = activeServingLabel === serving.label
          return (
            <button
              key={`${serving.label}-${servingAmount(serving)}`}
              type="button"
              onClick={() => onServingSelect(serving)}
              className={`
                flex-shrink-0 px-3 py-2 rounded-xl border text-left active:scale-[0.97] transition-all
                ${isActive ? 'bg-white text-black border-white' : 'bg-black/20 text-zinc-300 border-zinc-800 hover:bg-zinc-800'}
              `}
            >
              <p className="text-[11px] font-semibold">{serving.label}</p>
              <p className={`text-[9px] tabular-nums ${isActive ? 'text-black/60' : 'text-zinc-500'}`}>{servingAmount(serving)}{serving.mlEquivalent !== undefined ? 'ml' : 'g'}</p>
            </button>
          )
        })}
      </div>
    </motion.div>
  )
}

function LivePreviewCard({ macros, totalAmount, unit, quantity }: {
  macros: MacroNutrients; totalAmount: number; unit: EntryUnit; quantity: number
}) {
  const { strings } = useLocale()
  const ap = strings.addPage
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
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">{ap.portionNutrients}</p>
          {quantity > 0 && (
            <span className="text-[10px] text-zinc-400 tabular-nums">
              {quantity} {unit} · {totalAmount}{unit === 'ml' || unit === 'kutu' || unit === 'sise' ? 'ml' : 'g'}
            </span>
          )}
        </div>
        <div className="flex justify-around text-center">
          <PreviewStat icon={Flame} label={ap.calShortLabel} value={macros.calories} unit="kcal" />
          <PreviewStat icon={Beef} label={ap.proteinShortLabel} value={macros.protein} unit="g" />
          <PreviewStat icon={Wheat} label={ap.carbShortLabel} value={macros.carbs} unit="g" />
          <PreviewStat icon={Droplets} label={ap.fatShortLabel} value={macros.fat} unit="g" />
          <PreviewStat icon={Leaf} label={ap.fiberShortLabel} value={macros.fiber} unit="g" />
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
        {label}<span className="text-zinc-600 ml-0.5">{unit}</span>
      </p>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB SWITCHER
// ═══════════════════════════════════════════════════════════════════════════

function TabSwitcher({ mode, onChange, isPro }: { mode: AddMode; onChange: (m: AddMode) => void; isPro?: boolean }) {
  const { strings } = useLocale()
  return (
    <div className="flex bg-zinc-900 rounded-2xl p-1 border border-zinc-800/50 mb-6">
      {([
        { value: 'scan' as AddMode, label: strings.add.tabScan, icon: ScanLine, isLocked: isPro === false },
        { value: 'text' as AddMode, label: strings.add.tabText, icon: Type },
        { value: 'manual' as AddMode, label: strings.add.tabSearch, icon: Search },
        { value: 'restaurant' as AddMode, label: strings.add.tabRestaurant, icon: Store },
      ]).map((tab) => {
        const isActive = mode === tab.value
        const Icon = tab.icon
        return (
          <button type="button"
            key={tab.value}
            id={`tab-${tab.value}`}
            onClick={() => onChange(tab.value)}
            className={`
              flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-[11px] font-medium relative
              transition-all duration-200 active:scale-[0.98]
              ${isActive
                ? 'bg-white text-black shadow-sm'
                : 'text-zinc-500 hover:text-zinc-300'
              }
            `}
          >
            <Icon size={14} />
            {tab.label}
            {tab.isLocked && (
              <span className="absolute top-1.5 right-1.5 text-zinc-400">
                <Lock size={10} />
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// RESTAURANT TAB
// ═══════════════════════════════════════════════════════════════════════════

interface RestaurantCartItem {
  item: RestaurantMenuItem
  restaurantName: string
  restaurantLogo?: string
  quantity: number
}

function RestaurantTab({
  onSaveCart,
  saving,
}: {
  onSaveCart: (items: RestaurantCartItem[]) => Promise<void>
  saving: boolean
}) {
  const { strings } = useLocale()
  const ap = strings.addPage
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [cart, setCart] = useState<Record<string, RestaurantCartItem>>({})
  const [saveError, setSaveError] = useState<string | null>(null)
  const haptics = useHaptics()

  const cartItems = useMemo(() => Object.values(cart), [cart])
  const cartCount = cartItems.reduce((sum, entry) => sum + entry.quantity, 0)
  const cartMacros = useMemo(() => sumMacros(cartItems.map(({ item, quantity }) => ({
    calories: item.calories * quantity,
    protein: item.protein * quantity,
    carbs: item.carbs * quantity,
    fat: item.fat * quantity,
    fiber: item.fiber * quantity,
  }))), [cartItems])

  const getCartKey = (restaurantName: string, item: RestaurantMenuItem) => `${restaurantName}:${item.id}`

  const handleAddItem = (item: RestaurantMenuItem, restaurantName: string, restaurantLogo?: string) => {
    haptics.impactMedium()
    setSaveError(null)
    const key = getCartKey(restaurantName, item)
    setCart((prev) => ({
      ...prev,
      [key]: {
        item,
        restaurantName,
        restaurantLogo,
        quantity: (prev[key]?.quantity ?? 0) + 1,
      },
    }))
  }

  const handleRemoveItem = (item: RestaurantMenuItem, restaurantName: string) => {
    haptics.impactLight()
    const key = getCartKey(restaurantName, item)
    setCart((prev) => {
      const current = prev[key]
      if (!current) return prev
      if (current.quantity <= 1) {
        const next = { ...prev }
        delete next[key]
        return next
      }
      return {
        ...prev,
        [key]: { ...current, quantity: current.quantity - 1 },
      }
    })
  }

  const handleSaveCart = async () => {
    if (cartItems.length === 0 || saving) return
    setSaveError(null)
    try {
      await onSaveCart(cartItems)
      setCart({})
    } catch (error) {
      console.error('[RESTAURANT_CART] save failed', error)
      setSaveError(ap.restaurantSaveFailed)
    }
  }

  const renderCart = () => (
    <AnimatePresence>
      {cartItems.length > 0 && (
        <motion.div
          key="restaurant-cart"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="fixed left-4 right-4 z-40 mx-auto max-w-lg bg-zinc-950/95 border border-zinc-800 rounded-2xl p-4 shadow-2xl shadow-black/40 backdrop-blur"
          style={{ bottom: 'calc(var(--bottom-nav-total) + 12px)' }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center">
              <ShoppingCart size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-zinc-100">{ap.cart}</p>
              <p className="text-[10px] text-zinc-500">
                {ap.cartSummary(cartCount, cartMacros.calories)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCart({})}
              className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {ap.clearCart}
            </button>
          </div>

          <div className="max-h-32 overflow-y-auto smooth-scroll-area space-y-2 mb-3">
            {cartItems.map(({ item, restaurantName, restaurantLogo, quantity }) => (
              <div key={getCartKey(restaurantName, item)} className="flex items-center gap-2 text-[12px]">
                {restaurantLogo && <span className="text-sm">{restaurantLogo}</span>}
                <span className="flex-1 min-w-0 truncate text-zinc-300">{item.name}</span>
                <span className="text-zinc-500 tabular-nums">x{quantity}</span>
              </div>
            ))}
          </div>

          {saveError && (
            <p className="text-[11px] text-red-400 mb-3">{saveError}</p>
          )}

          <Button
            id="save-restaurant-cart-button"
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleSaveCart}
            loading={saving}
            icon={<Check size={18} />}
          >
            {ap.saveCart}
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // Dynamic spacer: base cart height (~200px) + per-item row (~28px each, max visible ~5)
  const cartSpacerHeight = cartItems.length > 0
    ? 200 + Math.min(cartItems.length, 5) * 28
    : 0
  const renderCartSpacer = () => cartItems.length > 0
    ? <div style={{ height: cartSpacerHeight }} aria-hidden="true" />
    : null

  // Restoran seçilmemişse — restoran listesi
  if (!selectedRestaurant) {
    // Tüm restoranlarda arama
    const normalizedQuery = searchQuery.trim().toLowerCase()
    const isSearching = normalizedQuery.length >= 2

    const allResults = isSearching
      ? restaurants.flatMap((r) =>
          r.categories.flatMap((c) =>
            c.items
              .filter((item) => item.name.toLowerCase().includes(normalizedQuery))
              .map((item) => ({ item, restaurant: r, category: c.category }))
          )
        )
      : []

    // Restoran adıyla eşleşenler (ör. "komagene" → Komagene restoranı)
    const matchedRestaurants = isSearching
      ? restaurants.filter((r) => r.name.toLowerCase().includes(normalizedQuery))
      : []

    return (
      <motion.div
        key="restaurant-tab"
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 16 }}
        transition={{ duration: 0.25 }}
      >
        {/* Arama */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative mb-5"
        >
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder={ap.searchAllMenus}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-[13px] text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-all"
          />
          {searchQuery && (
            <button type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-zinc-800"
            >
              <X size={14} className="text-zinc-500" />
            </button>
          )}
        </motion.div>

        {/* Arama sonuçları */}
        {isSearching && (
          <AnimatePresence>
            {matchedRestaurants.length > 0 || allResults.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                {/* Eşleşen restoranlar */}
                {matchedRestaurants.length > 0 && (
                  <div className="mb-5">
                    <p className="text-[11px] text-zinc-500 uppercase tracking-widest font-medium mb-3">
                      {ap.restaurants}
                    </p>
                    <div className="space-y-2">
                      {matchedRestaurants.map((r) => (
                        <button type="button"
                          key={r.id}
                          onClick={() => {
                            haptics.impactLight()
                            setSearchQuery('')
                            setSelectedRestaurant(r)
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 bg-zinc-900 rounded-xl border border-zinc-800/50 hover:bg-zinc-800/60 transition-colors"
                        >
                          <span className="text-2xl">{r.logo}</span>
                          <div className="flex-1 min-w-0 text-left">
                            <p className="text-[13px] font-medium text-zinc-100 truncate">{r.name}</p>
                            <p className="text-[10px] text-zinc-500">
                              {ap.products(r.categories.reduce((acc, c) => acc + c.items.length, 0))}
                            </p>
                          </div>
                          <ChevronRight size={16} className="text-zinc-600 flex-shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Eşleşen menü ürünleri */}
                {allResults.length > 0 && (
                  <>
                    <p className="text-[11px] text-zinc-500 uppercase tracking-widest font-medium mb-3">
                      {ap.productsFound(allResults.length)}
                    </p>
                    <div className="space-y-2">
                      {allResults.slice(0, 20).map(({ item, restaurant }) => (
                        <RestaurantMenuItemRow
                          key={`${restaurant.id}-${item.id}`}
                          item={item}
                          restaurantName={restaurant.name}
                          restaurantLogo={restaurant.logo}
                          quantity={cart[getCartKey(restaurant.name, item)]?.quantity ?? 0}
                          onAdd={() => handleAddItem(item, restaurant.name, restaurant.logo)}
                          onRemove={() => handleRemoveItem(item, restaurant.name)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8 mb-6">
                <p className="text-zinc-500 text-sm">{ap.noResults}</p>
                <p className="text-zinc-600 text-[11px] mt-1">{ap.tryDifferent}</p>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Restoran kartları */}
        {searchQuery.trim().length < 2 && (
          <div className="grid grid-cols-2 gap-3">
            {restaurants.map((r, i) => (
              <motion.button
                key={r.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  haptics.impactLight()
                  setSelectedRestaurant(r)
                }}
                className="bg-zinc-900 rounded-2xl border border-zinc-800/50 p-4 flex flex-col items-center gap-2.5 hover:bg-zinc-800/60 transition-all"
              >
                <span className="text-3xl">{r.logo}</span>
                <span className="text-[13px] font-medium text-zinc-200">{r.name}</span>
                <span className="text-[10px] text-zinc-500">
                  {ap.products(r.categories.reduce((acc, c) => acc + c.items.length, 0))}
                </span>
              </motion.button>
            ))}
          </div>
        )}

        {renderCart()}
        {renderCartSpacer()}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-[10px] text-zinc-600 mt-5 leading-relaxed"
        >
          {ap.restaurantDisclaimer}
          <br />
          {ap.restaurantSubDisclaimer}
        </motion.p>
      </motion.div>
    )
  }

  // Restoran seçildiyse — menü listesi
  const filteredCategories = searchQuery.trim().length >= 2
    ? selectedRestaurant.categories
        .map((c) => ({
          ...c,
          items: c.items.filter((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((c) => c.items.length > 0)
    : selectedRestaurant.categories

  return (
    <motion.div
      key="restaurant-menu"
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.25 }}
    >
      {/* Geri butonu + Restoran adı */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-5"
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            haptics.impactLight()
            setSelectedRestaurant(null)
            setSearchQuery('')
          }}
          className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800/50 flex items-center justify-center"
        >
          <ChevronLeft size={16} className="text-zinc-400" />
        </motion.button>
        <div className="flex items-center gap-2">
          <span className="text-xl">{selectedRestaurant.logo}</span>
          <h2 className="text-lg font-semibold">{selectedRestaurant.name}</h2>
        </div>
      </motion.div>

      {/* Menüde arama */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="relative mb-5"
      >
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          placeholder={ap.searchMenuIn(selectedRestaurant.name)}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-[13px] text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-all"
        />
        {searchQuery && (
          <button type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-zinc-800"
          >
            <X size={14} className="text-zinc-500" />
          </button>
        )}
      </motion.div>

      {/* Kategoriler ve ürünler */}
      {filteredCategories.map((category, ci) => (
        <motion.div
          key={category.category}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: ci * 0.06 }}
          className="mb-5"
        >
          <p className="text-[11px] text-zinc-500 uppercase tracking-widest font-semibold px-1 mb-2.5">
            {category.category}
          </p>
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800/50 overflow-hidden divide-y divide-zinc-800/40">
            {category.items.map((item) => (
              <RestaurantMenuItemRow
                key={item.id}
                item={item}
                quantity={cart[getCartKey(selectedRestaurant.name, item)]?.quantity ?? 0}
                onAdd={() => handleAddItem(item, selectedRestaurant.name, selectedRestaurant.logo)}
                onRemove={() => handleRemoveItem(item, selectedRestaurant.name)}
              />
            ))}
          </div>
        </motion.div>
      ))}

      {renderCart()}
      {renderCartSpacer()}

      {filteredCategories.length === 0 && (
        <div className="text-center py-8">
          <p className="text-zinc-500 text-sm">{ap.noResults}</p>
        </div>
      )}
    </motion.div>
  )
}

function RestaurantMenuItemRow({
  item,
  restaurantName,
  restaurantLogo,
  quantity,
  onAdd,
  onRemove,
}: {
  item: RestaurantMenuItem
  restaurantName?: string
  restaurantLogo?: string
  quantity: number
  onAdd: () => void
  onRemove: () => void
}) {
  const { locale } = useLocale()
  const isEN = locale === 'en'
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          {restaurantLogo && <span className="text-sm">{restaurantLogo}</span>}
          <p className="text-[13px] font-medium text-zinc-100 truncate">{item.name}</p>
        </div>
        {restaurantName && (
          <p className="text-[10px] text-zinc-500 mt-0.5">{restaurantName}</p>
        )}
        <div className="flex gap-2.5 mt-1.5">
          <span className="text-[11px] text-zinc-300 font-semibold tabular-nums">{item.calories} kcal</span>
          <span className="text-[10px] text-zinc-500 tabular-nums">P {item.protein}g</span>
          <span className="text-[10px] text-zinc-500 tabular-nums">{isEN ? 'C' : 'K'} {item.carbs}g</span>
          <span className="text-[10px] text-zinc-500 tabular-nums">{isEN ? 'F' : 'Y'} {item.fat}g</span>
        </div>
      </div>
      <AnimatePresence mode="wait">
        {quantity > 0 ? (
          <motion.div
            key="quantity"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="flex items-center gap-1"
          >
            <button
              type="button"
              onClick={onRemove}
              className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700/50 flex items-center justify-center hover:bg-zinc-700 transition-colors"
            >
              <Minus size={14} className="text-zinc-300" />
            </button>
            <span className="w-6 text-center text-[12px] text-zinc-200 font-semibold tabular-nums">
              {quantity}
            </span>
            <button
              type="button"
              onClick={onAdd}
              className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center hover:bg-zinc-200 transition-colors"
            >
              <Plus size={14} />
            </button>
          </motion.div>
        ) : (
          <motion.button
            key="add"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileTap={{ scale: 0.85 }}
            onClick={onAdd}
            className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700/50 flex items-center justify-center hover:bg-zinc-700 transition-colors"
          >
            <Plus size={16} className="text-zinc-300" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// TEXT ENTRY TAB — Natural Language Parsing
// ═══════════════════════════════════════════════════════════════════════════

function ConfidenceDot({ confidence }: { confidence: number }) {
  const color = confidence >= 0.7 ? 'bg-emerald-400' : confidence >= 0.5 ? 'bg-amber-400' : 'bg-red-400'
  return <div className={`w-2 h-2 rounded-full ${color} flex-shrink-0`} />
}

function ParsedItemCard({
  item,
  index,
  catalog,
  onUpdate,
  onRemove,
}: {
  item: ResolvedFoodItem
  index: number
  catalog: FoodCatalogItem[]
  onUpdate: (index: number, updated: ResolvedFoodItem) => void
  onRemove: (index: number) => void
}) {
  const { strings, locale } = useLocale()
  const ap = strings.addPage
  const isEN = locale === 'en'
  const [expanded, setExpanded] = useState(false)
  const [editQty, setEditQty] = useState(String(item.token.quantity))

  const handleQuantityChange = (value: string) => {
    setEditQty(value)
    const n = parseFloat(value.replace(',', '.'))
    if (Number.isFinite(n) && n > 0) {
      onUpdate(index, resolveWithQuantity(item, n))
    }
  }

  const handleSelectAlternative = (food: FoodCatalogItem) => {
    onUpdate(index, resolveWithFood(item.token, food, catalog))
    setExpanded(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, height: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
      className="bg-zinc-900 border border-zinc-800/60 rounded-2xl overflow-hidden"
    >
      {/* Main row */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3.5 flex items-center gap-3 text-left hover:bg-zinc-800/40 transition-colors"
      >
        <ConfidenceDot confidence={item.token.confidence} />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-zinc-100 truncate">
            {item.match?.name ?? item.token.foodQuery}
          </p>
          <p className="text-[10px] text-zinc-500 mt-0.5">
            {item.token.quantity} {item.token.unit ?? ap.unitPiece.toLowerCase()} · {Math.round(item.totalGrams)}g
            {!item.match && <span className="text-amber-400/80 ml-1">— {ap.noMatch}</span>}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-[13px] text-zinc-200 font-semibold tabular-nums">{item.macros.calories} kcal</p>
          <p className="text-[9px] text-zinc-500 tabular-nums">
            {isEN ? 'P' : 'P'}{item.macros.protein} · {isEN ? 'C' : 'K'}{item.macros.carbs} · {isEN ? 'F' : 'Y'}{item.macros.fat}
          </p>
        </div>
        <ChevronDown size={14} className={`text-zinc-500 transition-transform duration-200 flex-shrink-0 ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {/* Expanded edit area */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-zinc-800/40 space-y-3">
              {/* Quantity editor */}
              <div className="flex items-center gap-3">
                <label className="text-[11px] text-zinc-400 w-14">{ap.quantity}</label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={editQty}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  className="flex-1 bg-zinc-800 border border-zinc-700/60 rounded-xl px-3 py-2 text-[13px] text-white focus:outline-none focus:border-zinc-500 transition-colors"
                  min={0}
                  step={0.5}
                />
                <span className="text-[11px] text-zinc-500 w-16">{item.token.unit ?? ap.unitPiece.toLowerCase()}</span>
              </div>

              {/* Alternative matches */}
              {item.alternativeMatches.length > 0 && (
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-medium mb-2">
                    {item.match ? ap.alternatives : ap.possibleMatches}
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide smooth-scroll-area">
                    {item.alternativeMatches.slice(0, 5).map((alt) => (
                      <button
                        key={alt.id}
                        type="button"
                        onClick={() => handleSelectAlternative(alt)}
                        className="flex-shrink-0 px-3 py-2 rounded-xl border border-zinc-700/60 bg-zinc-800/50 text-left hover:bg-zinc-700/50 active:scale-[0.97] transition-all"
                      >
                        <p className="text-[11px] text-zinc-200 font-medium whitespace-nowrap">{alt.name}</p>
                        <p className="text-[9px] text-zinc-500 tabular-nums">{alt.calories} kcal/100g</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Remove button */}
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="flex items-center gap-2 text-[11px] text-red-400/80 hover:text-red-400 transition-colors"
              >
                <Trash2 size={12} />
                {ap.remove}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function itemNeedsTextClarification(item: ResolvedFoodItem): boolean {
  if (!item.match || item.macros.calories <= 0) return false
  if (item.token.quantityExplicit || item.token.unitExplicit) return false
  const servingChoices = item.match.servingOptions.filter((serving) => serving.unitType !== 'gram' && serving.unitType !== 'ml')
  return servingChoices.length > 0 || item.match.servingOptions.length > 1
}

function preferredClarificationServings(item: ResolvedFoodItem): FoodServingOption[] {
  if (!item.match) return []
  const nonBase = item.match.servingOptions.filter((serving) => serving.unitType !== 'gram' && serving.unitType !== 'ml')
  const base = item.match.servingOptions.filter((serving) => serving.unitType === 'gram' || serving.unitType === 'ml')
  return [...nonBase, ...base].slice(0, 6)
}

function ClarifyTextFoodModal({
  item,
  open,
  onClose,
  onConfirm,
}: {
  item: ResolvedFoodItem | null
  open: boolean
  onClose: () => void
  onConfirm: (serving: FoodServingOption, quantity: number) => void
}) {
  const { locale } = useLocale()
  const [quantity, setQuantity] = useState('1')
  const servings = useMemo(() => item ? preferredClarificationServings(item) : [], [item])
  const [selectedServingId, setSelectedServingId] = useState<string | null>(null)

  useEffect(() => {
    setQuantity(item?.token.quantity ? String(item.token.quantity) : '1')
    setSelectedServingId(item?.serving?.id ?? servings[0]?.id ?? null)
  }, [item, servings])

  if (!item?.match) return null

  const selectedServing = servings.find((serving) => serving.id === selectedServingId) ?? servings[0] ?? item.match.defaultServing
  const parsedQuantity = parseFloat(quantity.replace(',', '.'))
  const canConfirm = Number.isFinite(parsedQuantity) && parsedQuantity > 0
  const title = locale === 'en'
    ? `How much ${item.match.name}?`
    : `${item.match.name} ne kadar?`
  const description = locale === 'en'
    ? 'Pick the serving and quantity so the calories are counted correctly.'
    : 'Kaloriyi doğru hesaplamak için servis ve miktarı seç.'

  return (
    <Modal open={open} onClose={onClose} title={title} description={description} size="md">
      <div className="space-y-4">
        <div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium mb-2">
            {locale === 'en' ? 'Serving' : 'Servis'}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {servings.map((serving) => {
              const active = selectedServing.id === serving.id
              const amount = serving.gramEquivalent ?? serving.mlEquivalent ?? 0
              return (
                <button
                  key={`${serving.id}-${serving.label}`}
                  type="button"
                  onClick={() => setSelectedServingId(serving.id)}
                  className={`px-3 py-2.5 rounded-xl border text-left transition-colors ${
                    active ? 'bg-white text-black border-white' : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
                  }`}
                >
                  <p className="text-[12px] font-semibold truncate">{serving.label}</p>
                  {amount > 0 && (
                    <p className={`text-[9px] tabular-nums ${active ? 'text-black/60' : 'text-zinc-500'}`}>
                      {amount}{serving.mlEquivalent !== undefined ? 'ml' : 'g'}
                    </p>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label className="block text-[10px] text-zinc-500 uppercase tracking-widest font-medium mb-2">
            {locale === 'en' ? 'Quantity' : 'Adet / miktar'}
          </label>
          <input
            type="number"
            inputMode="decimal"
            value={quantity}
            min={0.25}
            step={0.5}
            onChange={(event) => setQuantity(event.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-3 text-[14px] text-white focus:outline-none focus:border-zinc-600"
            autoFocus
          />
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-11 rounded-xl bg-zinc-800 text-zinc-300 text-[13px] font-semibold hover:bg-zinc-700 transition-colors"
          >
            {locale === 'en' ? 'Cancel' : 'Vazgeç'}
          </button>
          <button
            type="button"
            disabled={!canConfirm}
            onClick={() => {
              if (canConfirm) onConfirm(selectedServing, parsedQuantity)
            }}
            className="flex-1 h-11 rounded-xl bg-white text-black text-[13px] font-semibold disabled:opacity-50 transition-colors"
          >
            {locale === 'en' ? 'Apply' : 'Uygula'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

function TextEntryTab({
  catalog,
  mealType,
  onMealTypeChange,
  onSaved,
  userId,
}: {
  catalog: FoodCatalogItem[]
  mealType: MealType
  onMealTypeChange: (t: MealType) => void
  onSaved: () => void
  userId: string | undefined
}) {
  const { strings, locale } = useLocale()
  const haptics = useHaptics()

  const [inputText, setInputText] = useState('')
  const [items, setItems] = useState<ResolvedFoodItem[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [clarifyIndex, setClarifyIndex] = useState<number | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const textExamples = locale === 'en' ? [
    '2 boiled eggs, 1 slice of toast',
    '200g grilled chicken with rice',
    '1 Big Mac, medium fries',
    '3 pieces sushi and green tea',
    '1 protein shake',
  ] : [
    '2 haşlanmış yumurta, 1 dilim ekmek',
    '200 gram tavuk göğsü ve 150 gram pilav',
    '1 porsiyon mercimek çorbası, 1 ayran',
    '1 hamburger, orta boy patates kızartması',
    '3 parça sushi ve 1 bardak yeşil çay',
  ]

  // Auto-resize textarea
  const resizeTextarea = useCallback(() => {
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = Math.max(120, el.scrollHeight) + 'px'
    }
  }, [])

  // Debounced parsing
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!inputText.trim()) {
      setItems([])
      return
    }
    debounceRef.current = setTimeout(() => {
      const result = parseNaturalLanguageInput(inputText, catalog)
      setItems(result.items)
      const nextClarifyIndex = result.items.findIndex(itemNeedsTextClarification)
      setClarifyIndex(nextClarifyIndex >= 0 ? nextClarifyIndex : null)
      if (result.suggestedMealType) {
        onMealTypeChange(result.suggestedMealType)
      }
      // Show nonsense/no-match feedback
      if (result.nonsenseMessage) {
        setSaveError(result.nonsenseMessage)
      } else {
        setSaveError(null)
      }
    }, 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [inputText, catalog, onMealTypeChange])

  const totalMacros = useMemo(() => sumMacros(items.map(i => i.macros)), [items])
  const hasItems = items.length > 0
  const hasValidItems = items.some(i => i.match !== null && i.macros.calories > 0)

  const handleUpdateItem = useCallback((index: number, updated: ResolvedFoodItem) => {
    setItems(prev => prev.map((item, i) => i === index ? updated : item))
  }, [])

  const handleRemoveItem = useCallback((index: number) => {
    haptics.impactLight()
    setItems(prev => prev.filter((_, i) => i !== index))
  }, [haptics])

  const handleClear = useCallback(() => {
    setInputText('')
    setItems([])
    setSaveError(null)
    setSaved(false)
    setClarifyIndex(null)
    if (textareaRef.current) {
      textareaRef.current.style.height = '120px'
    }
  }, [])

  const handleSave = useCallback(async () => {
    if (!userId) {
      setSaveError(strings.addPage.sessionNotFound)
      return
    }
    const validItems = items.filter(i => i.match !== null && i.macros.calories > 0)
    if (validItems.length === 0) {
      setSaveError(strings.addPage.needMatchingFood)
      return
    }
    const unresolvedIndex = items.findIndex(itemNeedsTextClarification)
    if (unresolvedIndex >= 0) {
      setClarifyIndex(unresolvedIndex)
      setSaveError(null)
      return
    }

    setSaving(true)
    setSaveError(null)
    try {
      await createMeal(userId, {
        mealType,
        source: 'manual',
        notes: inputText.trim().slice(0, 200),
        items: validItems.map(item => ({
          foodId: item.match!.id,
          name: item.match!.name,
          grams: Math.round(item.totalGrams),
          caloriesPer100g: item.match!.calories,
          proteinPer100g: item.match!.protein,
          carbsPer100g: item.match!.carbs,
          fatPer100g: item.match!.fat,
          fiberPer100g: item.match!.fiber,
          servingLabel: item.serving?.label,
          selectedQuantity: item.token.quantity,
          gramEquivalent: Math.round(item.totalGrams),
        })),
      })

      // Remember foods for recents
      for (const item of validItems) {
        if (item.match) rememberRecentFood(item.match.id)
      }

      setSaved(true)
      haptics.notificationSuccess()
      onSaved()
    } catch {
      setSaveError(strings.addPage.mealSaveFailed)
      haptics.notificationError()
    } finally {
      setSaving(false)
    }
  }, [items, mealType, userId, inputText, haptics, onSaved])

  const clarifyItem = clarifyIndex !== null && clarifyIndex >= 0 ? items[clarifyIndex] ?? null : null

  const handleConfirmClarification = useCallback((serving: FoodServingOption, quantity: number) => {
    if (clarifyIndex === null || clarifyIndex < 0) return
    let nextClarifyIndex: number | null = null
    setItems((prev) => {
      const current = prev[clarifyIndex]
      if (!current) return prev
      const next = prev.map((item, index) =>
        index === clarifyIndex ? resolveWithServingAndQuantity(item, serving, quantity) : item
      )
      const foundIndex = next.findIndex(itemNeedsTextClarification)
      nextClarifyIndex = foundIndex >= 0 ? foundIndex : null
      return next
    })
    setClarifyIndex(nextClarifyIndex)
    setSaveError(null)
    haptics.selectionChanged()
  }, [clarifyIndex, haptics])

  return (
    <motion.div
      key="text-tab"
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.25 }}
    >
      {/* Header hint */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-4"
      >
        <div className="flex items-center gap-2 mb-1">
          <Type size={14} className="text-zinc-400" />
          <p className="text-[14px] font-semibold text-zinc-100">{strings.addPage.whatDidYouEat}</p>
        </div>
        <p className="text-[11px] text-zinc-500 leading-relaxed">
          {strings.add.textHint}
        </p>
      </motion.div>

      {/* Textarea */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="mb-5"
      >
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value)
              resizeTextarea()
            }}
            placeholder={strings.add.textPlaceholder}
            className="w-full min-h-[120px] bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-4 text-[14px] text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600/30 transition-all duration-200 resize-none leading-relaxed"
          />
          {inputText && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 transition-colors"
            >
              <X size={14} className="text-zinc-400" />
            </button>
          )}
        </div>
        <div className="flex items-center justify-between mt-2 px-1">
          <p className="text-[10px] text-zinc-600">
            {strings.addPage.separateHint}
          </p>
          {inputText && (
            <p className="text-[10px] text-zinc-500 tabular-nums">
              {strings.addPage.foodsDetected(items.length)}
            </p>
          )}
        </div>
      </motion.div>

      <ClarifyTextFoodModal
        item={clarifyItem}
        open={Boolean(clarifyItem && itemNeedsTextClarification(clarifyItem))}
        onClose={() => setClarifyIndex(null)}
        onConfirm={handleConfirmClarification}
      />

      {/* Quick examples */}
      {!inputText && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-6"
        >
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium mb-2.5 px-1">{strings.addPage.examples}</p>
          <div className="space-y-2">
            {textExamples.map((example, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setInputText(example)
                  haptics.selectionChanged()
                }}
                className="w-full text-left px-3.5 py-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800/40 text-[12px] text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-300 active:scale-[0.99] transition-all"
              >
                "{example}"
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Parsed items */}
      <AnimatePresence mode="popLayout">
        {hasItems && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2.5 mb-5"
          >
            <div className="flex items-center justify-between px-1 mb-1">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">
                {strings.addPage.detectedFoods}
              </p>
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-[10px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition-colors"
                >
                  <RefreshCw size={10} />
                  {strings.addPage.clear}
                </button>
              )}
            </div>
            {items.map((item, index) => (
              <ParsedItemCard
                key={`${item.token.rawText}-${index}`}
                item={item}
                index={index}
                catalog={catalog}
                onUpdate={handleUpdateItem}
                onRemove={handleRemoveItem}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Total macros summary */}
      <AnimatePresence>
        {hasItems && totalMacros.calories > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <Card variant="subtle" padding="md" className="mb-5" animated={false}>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium mb-3">{strings.addPage.totalNutrients}</p>
              <div className="flex justify-around text-center">
                <PreviewStat icon={Flame} label={strings.addPage.calShortLabel} value={totalMacros.calories} unit="kcal" />
                <PreviewStat icon={Beef} label={strings.addPage.proteinShortLabel} value={totalMacros.protein} unit="g" />
                <PreviewStat icon={Wheat} label={strings.addPage.carbShortLabel} value={totalMacros.carbs} unit="g" />
                <PreviewStat icon={Droplets} label={strings.addPage.fatShortLabel} value={totalMacros.fat} unit="g" />
                <PreviewStat icon={Leaf} label={strings.addPage.fiberShortLabel} value={totalMacros.fiber} unit="g" />
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Meal type selector */}
      {hasItems && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <label className="block text-[11px] text-zinc-400 uppercase tracking-wider font-medium mb-2.5">{strings.addPage.mealTypeLabel}</label>
          <MealTypeSelector value={mealType} onChange={onMealTypeChange} />
        </motion.div>
      )}

      {/* Error banner */}
      <AnimatePresence>
        {saveError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-5 overflow-hidden"
          >
            <div className="bg-zinc-900 border border-red-500/20 rounded-xl px-4 py-3 flex items-center gap-3">
              <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
              <p className="text-[13px] text-zinc-300 flex-1">{saveError}</p>
              <button type="button" onClick={() => setSaveError(null)} className="p-1 rounded-lg hover:bg-zinc-800 flex-shrink-0">
                <X size={14} className="text-zinc-500" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save button */}
      {hasItems && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
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
                <span className="text-black font-semibold">{strings.addPage.mealSaved}</span>
              </motion.div>
            ) : (
              <motion.div key="save-btn" exit={{ opacity: 0 }}>
                <Button
                  id="save-text-meal-button"
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleSave}
                  loading={saving}
                  disabled={!hasValidItems}
                  icon={<Check size={18} />}
                >
                  {strings.add.saveAll} ({strings.addPage.saveAllCount(items.filter(i => i.match !== null).length)})
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Footer disclaimer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center text-[10px] text-zinc-600 mt-5 leading-relaxed"
      >
        {strings.addPage.nutrientDisclaimer.split('\n')[0]}
        <br />
        {strings.addPage.nutrientDisclaimer.split('\n')[1]}
      </motion.p>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════

export default function AddMealPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { isPro } = useSubscription(user?.uid)
  const location = useLocation()
  const { strings, locale } = useLocale()
  const { limit, canScan, showPaywall, consumeScan } = useScanLimit(user?.uid, isPro)
  const camera = useCamera()
  const haptics = useHaptics()

  // ── Active tab ──
  const initialTab = (location.state as { tab?: AddMode } | null)?.tab
  const [mode, setMode] = useState<AddMode>(initialTab ?? 'scan')

  // ══════════════════════════════════════════════════════════════════════
  // TEXT TAB STATE
  // ══════════════════════════════════════════════════════════════════════
  const [textMealType, setTextMealType] = useState<MealType>(suggestMealType())

  // ══════════════════════════════════════════════════════════════════════
  // SCAN STATE
  // imagePreview: objectURL veya convertFileSrc — base64 DEĞİL
  // ══════════════════════════════════════════════════════════════════════
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [scanError, setScanError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [gramNotes, setGramNotes] = useState('')

  // Mevcut objectURL'yi takip eder (revoke için)
  const imageObjectUrlRef = useRef<string | null>(null)

  // Unmount'ta objectURL'yi temizle
  useEffect(() => {
    return () => {
      if (imageObjectUrlRef.current?.startsWith('blob:')) {
        URL.revokeObjectURL(imageObjectUrlRef.current)
        imageObjectUrlRef.current = null
      }
    }
  }, [])

  /** Preview URL'yi güvenli şekilde set eder, eskiyi revoke eder. */
  const setPreviewUrl = useCallback((url: string | null) => {
    if (imageObjectUrlRef.current?.startsWith('blob:')) {
      URL.revokeObjectURL(imageObjectUrlRef.current)
    }
    imageObjectUrlRef.current = url?.startsWith('blob:') ? url : null
    setImagePreview(url)
  }, [])

  const guardScan = useCallback((): boolean => {
    if (canScan) return true
    if (isPro) {
      setScanError(strings.addPage.quotaExhaustedSub)
    } else {
      navigate('/paywall')
    }
    return false
  }, [canScan, isPro, navigate, strings.addPage.quotaExhaustedSub])

  /** Capacitor Camera — fotoğraf çek */
  const handleTakePhoto = useCallback(async () => {
    if (!guardScan()) return
    setScanError(null)
    try {
      haptics.impactMedium()
      const result = await camera.takePhoto()
      if (!result) return // kullanıcı iptal etti
      // previewUrl: convertFileSrc(webPath) — büyük base64 yok
      setPreviewUrl(result.previewUrl)
    } catch {
      setScanError(strings.addPage.cameraFailed)
      haptics.notificationError()
    }
  }, [guardScan, camera, haptics, setPreviewUrl])

  /** Capacitor Camera — galeriden seç */
  const handlePickGallery = useCallback(async () => {
    if (!guardScan()) return
    setScanError(null)
    try {
      haptics.impactLight()
      const result = await camera.pickFromGallery()
      if (!result) return
      setPreviewUrl(result.previewUrl)
    } catch {
      setScanError(strings.addPage.galleryFailed)
      haptics.notificationError()
    }
  }, [guardScan, camera, haptics, setPreviewUrl])

  /** Web drag & drop fallback — dosya ile de çalışır */
  const processFile = useCallback(
    (file: File) => {
      setScanError(null)
      const validationError = validateFile(file, strings.addPage)
      if (validationError) { setScanError(validationError); return }
      if (!guardScan()) return
      // objectURL kullan — FileReader base64 yok
      const previewUrl = URL.createObjectURL(file)
      setPreviewUrl(previewUrl)
    },
    [guardScan, setPreviewUrl, strings.addPage]
  )

  const handleDragEnter = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true) }, [])
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false) }, [])
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }, [processFile])

  const removeImage = useCallback(() => {
    setPreviewUrl(null)
    setScanError(null)
  }, [setPreviewUrl])

  const handleAnalyze = useCallback(async () => {
    if (!imagePreview) return
    if (!guardScan()) return
    setScanError(null)
    setAnalyzing(true)
    haptics.impactMedium()
    try {
      // 1) Sıkıştır — orijinal büyük görüntü memory'den atılır
      const compressed = await compressImageForAI(imagePreview)

      if (import.meta.env.DEV) {
        console.debug('[handleAnalyze] image compression', {
          originalUrl: imagePreview.startsWith('blob:') ? 'objectURL' : 'dataUrl',
          compressedSizeBytes: compressed.sizeBytes,
          compressedWidth: compressed.width,
          compressedHeight: compressed.height,
          cameraResultType: 'Uri',
        })
      }

      // 2) Sıkıştırılmış File oluştur
      const file = new File([compressed.blob], 'scan.jpg', { type: 'image/jpeg' })

      // 3) AI analizi
      const result = await analyzeMealImage(file, { gramNotes })
      consumeScan()
      haptics.notificationSuccess()

      // 4) objectURL'yi temizle
      if (imageObjectUrlRef.current?.startsWith('blob:')) {
        URL.revokeObjectURL(imageObjectUrlRef.current)
        imageObjectUrlRef.current = null
      }

      // 5) Sıkıştırılmış dataUrl ile navigate (orijinal büyük görüntü DEĞİL)
      setAnalyzing(false)
      navigate('/analysis', {
        state: { result, imagePreview: compressed.dataUrl, gramNotes },
      })
    } catch (err) {
      const errMsg = err instanceof ScanServiceError
        ? err.message
        : err instanceof Error
          ? err.message
          : strings.addPage.analysisFailed
      console.error('[handleAnalyze] CATCH', {
        name: (err as Error)?.name,
        message: (err as Error)?.message,
        code: (err as ScanServiceError)?.code,
        stack: (err as Error)?.stack,
      })
      setScanError(errMsg)
      setAnalyzing(false)
      haptics.notificationError()
    }
  }, [imagePreview, guardScan, consumeScan, navigate, gramNotes, haptics, strings.addPage.analysisFailed])

  // ══════════════════════════════════════════════════════════════════════
  // MANUAL STATE
  // ══════════════════════════════════════════════════════════════════════
  const [form, setForm] = useState<ManualEntryForm>(INITIAL_FORM)
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [restaurantSaving, setRestaurantSaving] = useState(false)
  const foodCatalog = useMemo<FoodCatalogItem[]>(() => getFoodCatalog(locale), [locale])
  const [recentIds, setRecentIds] = useState<string[]>(() => getRecentFoodIds())
  const [selectedFood, setSelectedFood] = useState<FoodCatalogItem | null>(null)
  const [activeServingLabel, setActiveServingLabel] = useState('')

  const updateField = useCallback(
    <K extends keyof ManualEntryForm>(field: K, value: ManualEntryForm[K]) => {
      setForm((prev) => ({ ...prev, [field]: value }))
      if (submitted) {
        setFormErrors((prev) => { const next = { ...prev }; delete next[field as keyof FormErrors]; return next })
      }
    },
    [submitted]
  )

  const applyFoodToForm = useCallback(
    (food: FoodCatalogItem, serving = food.defaultServing) => {
      const unit = servingToUnit(serving)
      setForm((prev) => ({
        ...prev,
        foodName: food.name,
        caloriesPer100g: String(food.calories),
        proteinPer100g: String(food.protein),
        carbsPer100g: String(food.carbs),
        fatPer100g: String(food.fat),
        fiberPer100g: String(food.fiber),
        sugar: food.sugar !== undefined ? String(food.sugar) : prev.sugar,
        saturatedFat: food.saturatedFat !== undefined ? String(food.saturatedFat) : prev.saturatedFat,
        sodium: food.sodium !== undefined ? String(food.sodium) : prev.sodium,
        category: food.category,
        ...unit,
      }))
      setSelectedFood(food)
      setActiveServingLabel(serving.label)
      if (submitted) setFormErrors({})
    },
    [submitted]
  )

  const foodSuggestions = useMemo(() => {
    const query = form.foodName.trim()
    if (query.length < 2) return []
    return searchFoodCatalog(foodCatalog, query, locale === 'en' ? 'All' : 'Tümü', 30, {
      recentIds,
      popularIds: getPopularFoodIds(locale),
    })
  }, [foodCatalog, form.foodName, recentIds])

  const handleFoodSuggestion = useCallback(
    (food: FoodCatalogItem) => {
      haptics.selectionChanged()
      applyFoodToForm(food)
      rememberRecentFood(food.id)
      setRecentIds(getRecentFoodIds())
    },
    [applyFoodToForm, haptics]
  )

  const handleServingSelect = useCallback(
    (serving: FoodServingOption) => {
      if (!selectedFood) return
      haptics.selectionChanged()
      setActiveServingLabel(serving.label)
      setForm((prev) => ({ ...prev, ...servingToUnit(serving) }))
    },
    [haptics, selectedFood]
  )

  const totalEquivalentAmount = useMemo(() => computeEquivalentAmount(form), [form.amountPerUnit, form.entryUnit, form.quantity])
  const usingCatalogServingAmount = hasCatalogServingAmount(selectedFood, form)

  const liveMacros: MacroNutrients = useMemo(() => {
    if (totalEquivalentAmount <= 0) return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    if (selectedFood) {
      return calculateFoodSelection(selectedFood, {
        serving: findServingForForm(selectedFood, form),
        quantity: parseNum(form.quantity),
      }).macros
    }
    return calculateMacrosForWeight(
      {
        calories: parseNum(form.caloriesPer100g),
        protein: parseNum(form.proteinPer100g),
        carbs: parseNum(form.carbsPer100g),
        fat: parseNum(form.fatPer100g),
        fiber: parseNum(form.fiberPer100g),
      },
      totalEquivalentAmount
    )
  }, [form, selectedFood, totalEquivalentAmount])

  const handleSave = useCallback(async () => {
    setSubmitted(true)
    const fallbackFood = selectedFood ?? foodSuggestions[0] ?? null
    const formForSave: ManualEntryForm = fallbackFood && parseNum(form.caloriesPer100g) <= 0
      ? {
          ...form,
          foodName: fallbackFood.name,
          caloriesPer100g: String(fallbackFood.calories),
          proteinPer100g: String(fallbackFood.protein),
          carbsPer100g: String(fallbackFood.carbs),
          fatPer100g: String(fallbackFood.fat),
          fiberPer100g: String(fallbackFood.fiber),
          category: fallbackFood.category,
          ...servingToUnit(fallbackFood.defaultServing),
        }
      : form

    if (fallbackFood && fallbackFood !== selectedFood) {
      setSelectedFood(fallbackFood)
      setActiveServingLabel(fallbackFood.defaultServing.label)
      setForm(formForSave)
    }

    const validationErrors = validateManualForm(formForSave, strings.manual)
    setFormErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return
    if (!user?.uid) {
      setFormErrors({ form: strings.addPage.sessionNotFound })
      return
    }

    setSaving(true)
    try {
      const selectedServing = findServingForForm(fallbackFood, formForSave)
      const selectedQuantity = parseNum(formForSave.quantity)
      const equivalentAmount = computeEquivalentAmount(formForSave)
      const gramsForSave = computeTotalGrams(formForSave)
      await createMeal(user.uid, {
        mealType: formForSave.mealType,
        source: 'manual',
        items: [
          {
            ...(fallbackFood && { foodId: fallbackFood.id }),
            name: formForSave.foodName.trim(),
            grams: formForSave.entryUnit === 'ml' ? equivalentAmount : gramsForSave,
            ...(formForSave.entryUnit === 'ml' && { ml: equivalentAmount }),
            caloriesPer100g: parseNum(formForSave.caloriesPer100g),
            proteinPer100g: parseNum(formForSave.proteinPer100g),
            carbsPer100g: parseNum(formForSave.carbsPer100g),
            fatPer100g: parseNum(formForSave.fatPer100g),
            fiberPer100g: parseNum(formForSave.fiberPer100g),
            servingLabel: selectedServing.label,
            selectedQuantity,
            ...(formForSave.entryUnit === 'ml' ? { mlEquivalent: equivalentAmount } : { gramEquivalent: equivalentAmount }),
          },
        ],
      })

      if (fallbackFood) {
        rememberRecentFood(fallbackFood.id)
        setRecentIds(getRecentFoodIds())
      }
      setSaved(true)
      haptics.notificationSuccess()
      navigate('/', { replace: true })
    } catch {
      setFormErrors({ form: strings.addPage.mealSaveFailed })
      haptics.notificationError()
    } finally {
      setSaving(false)
    }
  }, [foodSuggestions, form, haptics, navigate, selectedFood, user?.uid])

  const handleSaveRestaurantCart = useCallback(
    async (cartItems: RestaurantCartItem[]) => {
      if (!user?.uid) {
        haptics.notificationError()
        return
      }
      if (cartItems.length === 0) return

      setRestaurantSaving(true)
      try {
        const expandedItems = cartItems.flatMap(({ item, restaurantName, quantity }) =>
          Array.from({ length: quantity }, (_, index) => ({
            id: createId(),
            name: quantity > 1 ? `${item.name} (${index + 1}/${quantity})` : item.name,
            grams: item.grams ?? 1,
            servingLabel: restaurantName,
            selectedQuantity: 1,
            macros: {
              calories: item.calories,
              protein: item.protein,
              carbs: item.carbs,
              fat: item.fat,
              fiber: item.fiber,
            },
          }))
        )
        const totalMacros = sumMacros(expandedItems.map((item) => item.macros))
        const restaurantNames = [...new Set(cartItems.map((entry) => entry.restaurantName))]

        await createMeal(user.uid, {
          mealType: suggestMealType(),
          source: 'manual',
          notes: restaurantNames.join(', '),
          items: expandedItems,
          totalMacros,
          dateKey: getToday(),
        })
        haptics.notificationSuccess()
        navigate('/', { replace: true })
      } catch (error) {
        console.error('[RESTAURANT_CART] save failed', error)
        haptics.notificationError()
        throw error
      } finally {
        setRestaurantSaving(false)
      }
    },
    [haptics, navigate, user?.uid]
  )

  const errorCount = Object.keys(formErrors).length

  // ══════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════

  return (
    <div className="px-5 pt-14 pb-24 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        {/* ── Header ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-5"
        >
          <h1 className="text-[26px] font-bold tracking-tight">{strings.add.title}</h1>
          <p className="text-zinc-400 text-sm mt-1 leading-relaxed">
            {strings.addPage.subtitle}
          </p>
        </motion.div>

        {/* ── Tab switcher ────────────────────────────────────────── */}
        <TabSwitcher mode={mode} onChange={setMode} isPro={isPro} />

        {/* ── SCAN TAB ────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {mode === 'scan' && (
            <motion.div
              key="scan-tab"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
            >
              {/* Scan limit */}
              <div className="mb-5">
                <ScanLimitBar limit={limit} isPro={isPro} onUpgrade={() => navigate('/paywall')} />
              </div>

              {/* Paywall state */}
              {showPaywall ? (
                <div className="bg-zinc-900/40 rounded-2xl p-8 text-center border border-zinc-800/20 flex flex-col items-center justify-center">
                  <div className="w-14 h-14 bg-zinc-800/50 rounded-2xl flex items-center justify-center mb-4 border border-zinc-700/50">
                    <Lock size={20} className="text-zinc-400" />
                  </div>
                  <h3 className="text-[15px] font-bold text-zinc-200 mb-2">{strings.addPage.paywallTitle}</h3>
                  <p className="text-[12px] text-zinc-500 mb-6 leading-relaxed">
                    {strings.addPage.paywallSub}
                  </p>
                  <Button variant="primary" onClick={() => navigate('/paywall')} icon={<Crown size={14} />}>
                    {strings.addPage.paywallButton}
                  </Button>
                </div>
              ) : (
                <>
                  {/* Error banner */}
                  <AnimatePresence>
                    {scanError && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-5 overflow-hidden"
                      >
                        <div className="bg-zinc-900 border border-red-500/20 rounded-xl px-4 py-3 flex items-start gap-3">
                          <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                          <p className="text-[13px] text-zinc-200 flex-1">{scanError}</p>
                          <button type="button" onClick={() => setScanError(null)} className="p-1 rounded-lg hover:bg-zinc-800 transition-colors flex-shrink-0">
                            <X size={14} className="text-zinc-500" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Upload or preview */}
                  <AnimatePresence mode="wait">
                    {imagePreview ? (
                      <ImagePreview
                        key="preview"
                        src={imagePreview}
                        onRemove={removeImage}
                        onAnalyze={handleAnalyze}
                        analyzing={analyzing}
                        gramNotes={gramNotes}
                        onGramNotesChange={setGramNotes}
                      />
                    ) : (
                      <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
                        <UploadZone
                          onTakePhoto={handleTakePhoto}
                          onPickGallery={handlePickGallery}
                          isDragging={isDragging}
                          onDragEnter={handleDragEnter}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Tip */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="mt-6 bg-zinc-900/50 rounded-xl px-4 py-3 border border-zinc-800/30"
                  >
                    <p className="text-[11px] text-zinc-500 text-center leading-relaxed">
                      <span className="text-zinc-400 font-medium">{strings.addPage.tipLabel}</span>{' '}
                      {strings.addPage.scanTip}
                    </p>
                  </motion.div>
                </>
              )}

              <p className="text-center text-[10px] text-zinc-600 mt-5">
                {strings.addPage.scanDisclaimer}
              </p>
            </motion.div>
          )}

          {/* ── TEXT TAB (Natural Language) ─────────────────────────── */}
          {mode === 'text' && (
            <TextEntryTab
              catalog={foodCatalog}
              mealType={textMealType}
              onMealTypeChange={setTextMealType}
              onSaved={() => navigate('/')}
              userId={user?.uid}
            />
          )}

          {/* ── RESTAURANT TAB ─────────────────────────────────────── */}
          {mode === 'restaurant' && (
            <RestaurantTab
              onSaveCart={handleSaveRestaurantCart}
              saving={restaurantSaving}
            />
          )}

          {/* ── MANUAL TAB (Search & Manual Entry) ────────────────── */}
          {mode === 'manual' && (
            <motion.div
              key="manual-tab"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              {/* 1. Search input + results */}
              <div>
                <Input
                  id="food-name-input"
                  label={strings.addPage.searchFoodLabel}
                  placeholder={strings.addPage.searchFoodPlaceholder}
                  value={form.foodName}
                  onChange={(e) => {
                    setSelectedFood(null)
                    setActiveServingLabel('')
                    updateField('foodName', e.target.value)
                  }}
                  error={formErrors.foodName}
                  leftIcon={<Search size={16} />}
                />
                {!selectedFood && (
                  <FoodSearchResults
                    query={form.foodName}
                    suggestions={foodSuggestions}
                    onSelect={handleFoodSuggestion}
                  />
                )}
              </div>

              {/* 2. Selected food panel (porsiyon seçenekleri dahil) */}
              <AnimatePresence>
                {selectedFood && (
                  <SelectedFoodPanel
                    food={selectedFood}
                    activeServingLabel={activeServingLabel}
                    onServingSelect={handleServingSelect}
                    onClear={() => {
                      setSelectedFood(null)
                      setActiveServingLabel('')
                    }}
                  />
                )}
              </AnimatePresence>

              {/* 3. Error bar */}
              <AnimatePresence>
                {submitted && errorCount > 0 && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="bg-zinc-900 border border-red-500/20 rounded-xl px-4 py-3 flex items-center gap-3">
                      <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                      <p className="text-[13px] text-zinc-300">
                        {formErrors.form ?? strings.addPage.fixErrors(errorCount)}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 4. Miktar + birim — tek satırda kompakt */}
              <div>
                {form.entryUnit !== 'gram' && form.entryUnit !== 'ml' ? (
                  usingCatalogServingAmount ? (
                    <div className="space-y-3">
                      <Input id="quantity-input" label={strings.addPage.amountInputLabel} type="number" placeholder="1" value={form.quantity}
                        onChange={(e) => updateField('quantity', e.target.value)} error={formErrors.quantity}
                        leftIcon={<Hash size={16} />} inputMode="decimal" min={0} />
                      <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-medium">{strings.addPage.portionLabel}</p>
                          <p className="text-[13px] text-zinc-200 mt-0.5">
                            1 {form.entryUnit} = {formatServingAmount(parseNum(form.amountPerUnit), form.entryUnit)}
                          </p>
                        </div>
                        {totalEquivalentAmount > 0 && (
                          <span className="text-[12px] text-zinc-300 tabular-nums flex-shrink-0">
                            {strings.addPage.totalPrefix} {formatServingAmount(totalEquivalentAmount, form.entryUnit)}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <Input id="quantity-input" label={strings.addPage.amountInputLabel} type="number" placeholder="2" value={form.quantity}
                        onChange={(e) => updateField('quantity', e.target.value)} error={formErrors.quantity}
                        leftIcon={<Hash size={16} />} inputMode="decimal" min={0} />
                      <Input id="amount-per-unit-input" label={strings.addPage.unitAmountLabel} type="number" placeholder="50"
                        value={form.amountPerUnit} onChange={(e) => updateField('amountPerUnit', e.target.value)}
                        error={formErrors.amountPerUnit}
                        hint={totalEquivalentAmount > 0 ? `${strings.addPage.totalPrefix}: ${formatServingAmount(totalEquivalentAmount, form.entryUnit)}` : undefined}
                        leftIcon={<Scale size={16} />} inputMode="decimal" min={0} />
                    </div>
                  )
                ) : (
                  <Input id="grams-input" label={form.entryUnit === 'ml' ? strings.addPage.mlLabel : strings.addPage.gramLabel} type="number" placeholder={form.entryUnit === 'ml' ? '250' : '150'}
                    value={form.quantity} onChange={(e) => updateField('quantity', e.target.value)}
                    error={formErrors.quantity}
                    leftIcon={form.entryUnit === 'ml' ? <Droplets size={16} /> : <Scale size={16} />} inputMode="decimal" min={0} />
                )}
              </div>

              {/* 5. Birim seçici — kompakt, varsayılan gizli */}
              <div>
                <label className="block text-[11px] text-zinc-500 uppercase tracking-wider font-medium mb-2">{strings.addPage.unitInputLabel}</label>
                <UnitSelector
                  value={form.entryUnit}
                  onChange={(v) => {
                    if (selectedFood) {
                      const matchingServing = selectedFood.servingOptions.find(s => s.unitType === v)
                      if (matchingServing) {
                        haptics.selectionChanged()
                        setActiveServingLabel(matchingServing.label)
                        setForm(prev => ({ ...prev, ...servingToUnit(matchingServing) }))
                        return
                      }
                    }
                    setForm(prev => ({
                      ...prev,
                      entryUnit: v,
                      quantity: v === 'gram' || v === 'ml' ? '' : '1',
                      amountPerUnit: '',
                    }))
                  }}
                />
              </div>

              {/* 6. Live preview — sadece değer girildiğinde */}
              <AnimatePresence>
                <LivePreviewCard macros={liveMacros} totalAmount={Math.round(totalEquivalentAmount)} unit={form.entryUnit} quantity={parseNum(form.quantity)} />
              </AnimatePresence>

              {/* 7. Öğün türü — altta kompakt */}
              <div>
                <label className="block text-[11px] text-zinc-500 uppercase tracking-wider font-medium mb-2">{strings.addPage.mealTypeLabel}</label>
                <MealTypeSelector value={form.mealType} onChange={(v) => updateField('mealType', v)} />
              </div>

              {/* 8. Kaydet */}
              <AnimatePresence mode="wait">
                {saved ? (
                  <motion.div key="saved" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-[52px] rounded-2xl bg-white flex items-center justify-center gap-2">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
                      <Check size={20} className="text-black" />
                    </motion.div>
                    <span className="text-black font-semibold">{strings.addPage.mealSaved}</span>
                  </motion.div>
                ) : (
                  <motion.div key="save-btn" exit={{ opacity: 0 }}>
                    <Button id="save-meal-button" variant="primary" size="lg" fullWidth onClick={handleSave} loading={saving} icon={<Check size={18} />}>
                      {strings.addPage.saveManual}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="text-center text-[10px] text-zinc-600 mt-2 leading-relaxed">
                {strings.addPage.manualDisclaimer}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
