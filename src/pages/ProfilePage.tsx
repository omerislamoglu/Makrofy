import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LogOut,
  Crown,
  ChevronRight,
  Settings,
  User,
  Bell,
  Shield,
  FileText,
  Trash2,
  AlertTriangle,
  ExternalLink,
  Info,
  RotateCcw,
  Lock,
  Heart,
  Star,
  Mail,
  X,
  Check,
  Pencil,
  Target,
  Activity,
  Flame,
  Dumbbell,
  Zap,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useSubscription } from '../hooks/useSubscription'
import { useScanLimit } from '../hooks/useScanLimit'
import { useHaptics, isNative } from '../hooks/useCapacitor'
import { Capacitor } from '@capacitor/core'
import { useLocale } from '../contexts/LocaleContext'
import { SUPPORTED_LOCALES } from '../i18n'
import { ensurePermission } from '../services/notificationService'
import type { BodyMetrics, ActivityLevel, FitnessGoal, Gender, UserProfile } from '../types/user'
import {
  calculateDailyGoalFromMetrics,
  calculateBMR,
  calculateTDEE,
  calculateBMI,
} from '../utils/goalCalc'
import { MACRO_COLORS } from '../constants/macroColors'

// ─── Tab Types ──────────────────────────────────────────────────────────────

type ProfileTab = 'profile' | 'settings'

// ─── Settings Row Bileşeni ──────────────────────────────────────────────────

interface SettingsRowProps {
  icon: React.ReactNode
  label: string
  sublabel?: string
  onPress?: () => void
  destructive?: boolean
  trailing?: React.ReactNode
  disabled?: boolean
}

function SettingsRow({
  icon,
  label,
  sublabel,
  onPress,
  destructive = false,
  trailing,
  disabled = false,
}: SettingsRowProps) {
  // Bir satır <div> olarak render edilir (motion.button DEĞİL) çünkü `trailing`
  // içinde sıkça bir <button> (toggle) bulunur ve buton-içinde-buton geçersiz
  // HTML'dir. Tıklanabilir olduğunda erişilebilirlik için role/tabIndex/klavye
  // davranışı eklenir.
  const interactive = !!onPress && !disabled
  return (
    <motion.div
      onClick={interactive ? onPress : undefined}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onPress?.()
              }
            }
          : undefined
      }
      aria-disabled={disabled || undefined}
      whileTap={interactive ? { scale: 0.97 } : undefined}
      whileHover={interactive ? { backgroundColor: 'rgba(39,39,42,0.4)' } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`
        w-full flex items-center gap-3.5 px-4 py-3.5
        text-left ${disabled ? 'opacity-40' : ''}
        ${interactive ? 'cursor-pointer' : 'cursor-default'}
        ${destructive ? 'text-red-400' : 'text-zinc-100'}
      `}
    >
      <motion.div
        whileTap={interactive ? { scale: 1.15, rotate: -8 } : undefined}
        transition={{ type: 'spring', stiffness: 500, damping: 15 }}
        className={`
          w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
          ${destructive ? 'bg-red-500/10' : 'bg-zinc-800'}
        `}
      >
        {icon}
      </motion.div>
      <div className="flex-1 min-w-0">
        <p className={`text-[14px] font-medium ${destructive ? 'text-red-400' : 'text-zinc-100'}`}>
          {label}
        </p>
        {sublabel && (
          <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">{sublabel}</p>
        )}
      </div>
      {trailing ? (
        trailing
      ) : onPress && !destructive ? (
        <motion.div
          whileTap={{ x: 3 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
        >
          <ChevronRight size={15} className="text-zinc-600 flex-shrink-0" />
        </motion.div>
      ) : null}
    </motion.div>
  )
}

// ─── Toggle Row ─────────────────────────────────────────────────────────────

function ToggleRow({
  icon,
  label,
  sublabel,
  value,
  onChange,
}: {
  icon: React.ReactNode
  label: string
  sublabel?: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <SettingsRow
      icon={icon}
      label={label}
      sublabel={sublabel}
      trailing={
        <button type="button"
          onClick={() => onChange(!value)}
          className={`
            relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0
            ${value ? 'bg-white' : 'bg-zinc-700'}
          `}
        >
          <motion.div
            layout
            className={`
              absolute top-0.5 w-5 h-5 rounded-full shadow-sm
              ${value ? 'bg-black left-[22px]' : 'bg-zinc-400 left-0.5'}
            `}
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          />
        </button>
      }
    />
  )
}

// ─── Section ────────────────────────────────────────────────────────────────

function Section({
  title,
  children,
  delay = 0,
}: {
  title?: string
  children: React.ReactNode
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="mb-5"
    >
      {title && (
        <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest px-1 mb-2">
          {title}
        </p>
      )}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800/50 overflow-hidden divide-y divide-zinc-800/40">
        {children}
      </div>
    </motion.div>
  )
}

// ─── Hesap Silme Modalı ─────────────────────────────────────────────────────

function DeleteAccountModal({
  onClose,
  onConfirm,
  loading = false,
  error,
}: {
  onClose: () => void
  onConfirm: () => void
  loading?: boolean
  error?: string | null
}) {
  const [inputValue, setInputValue] = useState('')
  const [step, setStep] = useState<'warn' | 'confirm'>('warn')
  const { strings } = useLocale()
  const s = strings.profile

  const canDelete = inputValue.trim().toLowerCase() === s.confirmWord

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-end justify-center px-4 pb-8"
      onClick={loading ? undefined : onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="w-full max-w-sm bg-zinc-900 rounded-3xl border border-zinc-800/50 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {step === 'warn' ? (
            <>
              <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={22} className="text-red-400" />
              </div>
              <h2 className="text-[18px] font-bold text-center text-zinc-100 mb-2">
                {s.deleteTitle}
              </h2>
              <p className="text-[13px] text-zinc-400 text-center leading-relaxed mb-6">
                {s.deleteWarning.split(s.deleteIrreversible).map((part, i, arr) =>
                  i < arr.length - 1 ? (
                    <span key={i}>{part}<span className="text-zinc-200 font-medium">{s.deleteIrreversible}</span></span>
                  ) : <span key={i}>{part}</span>
                )}
              </p>
              <div className="space-y-3">
                <ul className="bg-zinc-800/50 rounded-xl p-3.5 space-y-2">
                  {s.deleteItems.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <X size={12} className="text-red-400 flex-shrink-0" />
                      <p className="text-[12px] text-zinc-400">{item}</p>
                    </li>
                  ))}
                </ul>
                <button type="button"
                  onClick={() => setStep('confirm')}
                  className="w-full bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl py-3 text-[14px] font-medium active:scale-[0.98] transition-all"
                >
                  {s.continueButton}
                </button>
                <button type="button"
                  onClick={onClose}
                  className="w-full bg-zinc-800 text-zinc-200 rounded-xl py-3 text-[14px] font-medium active:scale-[0.98] transition-all"
                >
                  {s.cancelButton}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trash2 size={22} className="text-red-400" />
              </div>
              <h2 className="text-[18px] font-bold text-center text-zinc-100 mb-2">
                {s.confirmTitle}
              </h2>
              <p className="text-[13px] text-zinc-400 text-center leading-relaxed mb-4">
                {s.confirmHint}
              </p>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={s.confirmPlaceholder}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-[14px] text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-red-500/50 mb-4"
                autoCapitalize="none"
                autoCorrect="off"
              />
              <div className="space-y-3">
                {error && (
                  <p className="rounded-xl bg-red-500/10 border border-red-500/20 px-3 py-2 text-[12px] text-red-300 text-center">
                    {error}
                  </p>
                )}
                <button type="button"
                  onClick={onConfirm}
                  disabled={!canDelete || loading}
                  className="w-full bg-red-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-xl py-3 text-[14px] font-bold active:scale-[0.98] transition-all disabled:cursor-not-allowed"
                >
                  {loading ? s.deleting : s.deleteForever}
                </button>
                <button type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="w-full bg-zinc-800 text-zinc-200 rounded-xl py-3 text-[14px] font-medium active:scale-[0.98] transition-all"
                >
                  {s.giveUp}
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Tab Switcher ────────────────────────────────────────────────────────────

function ProfileTabSwitcher({
  tab,
  onChange,
}: {
  tab: ProfileTab
  onChange: (t: ProfileTab) => void
}) {
  const { strings } = useLocale()
  const s = strings.profile
  return (
    <div className="flex bg-zinc-900 rounded-2xl p-1 border border-zinc-800/50 mb-6">
      {([
        { value: 'profile' as ProfileTab, label: s.profileTab, icon: User },
        { value: 'settings' as ProfileTab, label: s.settingsTab, icon: Settings },
      ] as const).map((t) => {
        const isActive = tab === t.value
        const Icon = t.icon
        return (
          <button type="button"
            key={t.value}
            id={`profile-tab-${t.value}`}
            onClick={() => onChange(t.value)}
            className={`
              flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-medium
              transition-all duration-200 active:scale-[0.98]
              ${isActive ? 'bg-white text-black shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}
            `}
          >
            <Icon size={15} />
            {t.label}
          </button>
        )
      })}
    </div>
  )
}

// ─── Stepper bileşeni (sayı artır/azalt) ─────────────────────────────────────

function Stepper({
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
}: {
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step?: number
  unit?: string
}) {
  const dec = () => onChange(Math.max(min, value - step))
  const inc = () => onChange(Math.min(max, value + step))
  return (
    <div className="flex items-center gap-3">
      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={dec}
        className="w-9 h-9 rounded-xl bg-zinc-800 text-zinc-200 text-xl font-light flex items-center justify-center active:bg-zinc-700"
      >
        −
      </motion.button>
      <span className="min-w-[52px] text-center text-[15px] font-semibold text-zinc-100 tabular-nums">
        {value}{unit ? <span className="text-[11px] text-zinc-500 ml-0.5">{unit}</span> : null}
      </span>
      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={inc}
        className="w-9 h-9 rounded-xl bg-zinc-800 text-zinc-200 text-xl font-light flex items-center justify-center active:bg-zinc-700"
      >
        +
      </motion.button>
    </div>
  )
}

// ─── GoalSetupSheet ───────────────────────────────────────────────────────────

function GoalSetupSheet({
  initial,
  onSave,
  onClose,
}: {
  initial?: BodyMetrics
  onSave: (m: BodyMetrics) => void
  onClose: () => void
}) {
  const { strings } = useLocale()
  const g = strings.goals
  const haptics = useHaptics()

  const [gender, setGender]     = useState<Gender>(initial?.gender ?? 'male')
  const [age, setAge]           = useState(initial?.age ?? 25)
  const [heightCm, setHeight]   = useState(initial?.heightCm ?? 175)
  const [weightKg, setWeight]   = useState(initial?.weightKg ?? 75)
  const [activity, setActivity] = useState<ActivityLevel>(initial?.activityLevel ?? 'moderate')
  const [goal, setGoal]         = useState<FitnessGoal>(initial?.goal ?? 'maintain')
  const [saved, setSaved]       = useState(false)

  const activityOptions: { value: ActivityLevel; label: string; desc: string }[] = [
    { value: 'sedentary',   label: g.sedentary,  desc: g.sedentaryDesc },
    { value: 'light',       label: g.light,      desc: g.lightDesc },
    { value: 'moderate',    label: g.moderate,   desc: g.moderateDesc },
    { value: 'active',      label: g.active,     desc: g.activeDesc },
    { value: 'very_active', label: g.veryActive, desc: g.veryActiveDesc },
  ]

  const goalOptions: { value: FitnessGoal; label: string; desc: string; emoji: string }[] = [
    { value: 'lose_weight', label: g.loseWeight, desc: g.loseWeightDesc, emoji: '🔥' },
    { value: 'maintain',    label: g.maintain,   desc: g.maintainDesc,   emoji: '⚖️' },
    { value: 'gain_weight', label: g.gainWeight, desc: g.gainWeightDesc, emoji: '💪' },
  ]

  const handleSave = () => {
    haptics.notificationSuccess()
    const metrics: BodyMetrics = { gender, age, heightCm, weightKg, activityLevel: activity, goal }
    setSaved(true)
    setTimeout(() => {
      onSave(metrics)
    }, 600)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-end justify-center px-0"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        className="w-full max-w-lg bg-zinc-950 rounded-t-3xl border-t border-zinc-800/60 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '92dvh' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-zinc-700" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800/40">
          <h2 className="text-[17px] font-bold text-zinc-100">{g.sheetTitle}</h2>
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center"
          >
            <X size={14} className="text-zinc-400" />
          </motion.button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto smooth-scroll-area" style={{ maxHeight: 'calc(92dvh - 130px)' }}>
          <div className="px-5 py-4 space-y-6">

            {/* Gender */}
            <div>
              <p className="text-[12px] font-semibold text-zinc-500 uppercase tracking-widest mb-3">{g.gender}</p>
              <div className="grid grid-cols-2 gap-2.5">
                {(['male', 'female'] as Gender[]).map((v) => (
                  <motion.button
                    key={v}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => { haptics.selectionChanged(); setGender(v) }}
                    className={`
                      py-3 rounded-2xl border text-[14px] font-semibold transition-all
                      ${gender === v
                        ? 'bg-white text-black border-white'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800'}
                    `}
                  >
                    {v === 'male' ? `♂ ${g.male}` : `♀ ${g.female}`}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Age / Height / Weight steppers */}
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800/50 divide-y divide-zinc-800/40">
              {[
                { label: g.age,    value: age,      onChange: setAge,    min: 10, max: 100, unit: g.years },
                { label: g.height, value: heightCm, onChange: setHeight, min: 100, max: 250, unit: g.cmUnit },
                { label: g.weight, value: weightKg, onChange: setWeight, min: 30, max: 300, unit: g.kgUnit },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between px-4 py-3.5">
                  <span className="text-[14px] text-zinc-300 font-medium">{row.label}</span>
                  <Stepper
                    value={row.value}
                    onChange={(v) => { haptics.selectionChanged(); row.onChange(v) }}
                    min={row.min}
                    max={row.max}
                    unit={row.unit}
                  />
                </div>
              ))}
            </div>

            {/* Activity level */}
            <div>
              <p className="text-[12px] font-semibold text-zinc-500 uppercase tracking-widest mb-3">{g.activityLevel}</p>
              <div className="space-y-2">
                {activityOptions.map((opt) => (
                  <motion.button
                    key={opt.value}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { haptics.selectionChanged(); setActivity(opt.value) }}
                    className={`
                      w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all
                      ${activity === opt.value
                        ? 'bg-zinc-100 border-zinc-100 text-black'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-300'}
                    `}
                  >
                    <div>
                      <p className="text-[13px] font-semibold">{opt.label}</p>
                      <p className={`text-[11px] mt-0.5 ${activity === opt.value ? 'text-zinc-500' : 'text-zinc-600'}`}>
                        {opt.desc}
                      </p>
                    </div>
                    {activity === opt.value && <Check size={15} className="text-black flex-shrink-0" />}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Goal */}
            <div>
              <p className="text-[12px] font-semibold text-zinc-500 uppercase tracking-widest mb-3">{g.fitnessGoal}</p>
              <div className="grid grid-cols-3 gap-2">
                {goalOptions.map((opt) => (
                  <motion.button
                    key={opt.value}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => { haptics.selectionChanged(); setGoal(opt.value) }}
                    className={`
                      flex flex-col items-center gap-1.5 py-3.5 rounded-2xl border text-center transition-all
                      ${goal === opt.value
                        ? 'bg-white border-white text-black'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400'}
                    `}
                  >
                    <span className="text-xl">{opt.emoji}</span>
                    <p className={`text-[11px] font-semibold leading-tight ${goal === opt.value ? 'text-black' : 'text-zinc-300'}`}>
                      {opt.label}
                    </p>
                    <p className={`text-[10px] leading-tight ${goal === opt.value ? 'text-zinc-500' : 'text-zinc-600'}`}>
                      {opt.desc}
                    </p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Save button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSave}
              disabled={saved}
              className={`
                w-full py-4 rounded-2xl text-[15px] font-bold transition-all
                ${saved
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-black active:bg-zinc-100'}
              `}
            >
              <AnimatePresence mode="wait">
                {saved ? (
                  <motion.span
                    key="saved"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <Check size={16} /> {g.savedLabel}
                  </motion.span>
                ) : (
                  <motion.span key="calc" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {g.calculateButton}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <div style={{ height: 'calc(2rem + env(safe-area-inset-bottom, 0px))' }} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── BodyMetricsCard (profil tabında gösterilen özet kart) ─────────────────────

function BodyMetricsCard({
  metrics,
  onEdit,
}: {
  metrics: BodyMetrics
  onEdit: () => void
}) {
  const { strings } = useLocale()
  const g = strings.goals
  const haptics = useHaptics()

  const dailyGoal = calculateDailyGoalFromMetrics(metrics)
  const bmr = calculateBMR(metrics.gender, metrics.weightKg, metrics.heightCm, metrics.age)
  const tdee = calculateTDEE(bmr, metrics.activityLevel)
  const { value: bmiValue, category: bmiCat } = calculateBMI(metrics.weightKg, metrics.heightCm)

  const bmiCatLabel: Record<string, string> = {
    underweight: g.underweight,
    normal: g.normal,
    overweight: g.overweight,
    obese: g.obese,
  }
  const bmiCatColor: Record<string, string> = {
    underweight: 'text-blue-400',
    normal: 'text-green-400',
    overweight: 'text-yellow-400',
    obese: 'text-red-400',
  }

  const goalEmoji: Record<FitnessGoal, string> = {
    lose_weight: '🔥',
    maintain: '⚖️',
    gain_weight: '💪',
  }
  const goalLabel: Record<FitnessGoal, string> = {
    lose_weight: g.loseWeight,
    maintain: g.maintain,
    gain_weight: g.gainWeight,
  }

  return (
    <div className="space-y-3">
      {/* Bio row */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800/50 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-zinc-800 rounded-lg flex items-center justify-center">
              <User size={14} className="text-zinc-400" />
            </div>
            <span className="text-[13px] font-semibold text-zinc-200">{g.sectionTitle}</span>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => { haptics.impactLight(); onEdit() }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 text-zinc-300 text-[12px] font-medium"
          >
            <Pencil size={11} />
            {g.editButton}
          </motion.button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: g.gender, value: metrics.gender === 'male' ? '♂' : '♀' },
            { label: g.age,    value: `${metrics.age} ${g.years}` },
            { label: g.height, value: `${metrics.heightCm} ${g.cmUnit}` },
            { label: g.weight, value: `${metrics.weightKg} ${g.kgUnit}` },
          ].map((item) => (
            <div key={item.label} className="bg-zinc-800/50 rounded-xl p-2 text-center min-w-0">
              <p className="text-[15px] font-bold text-zinc-100 truncate">{item.value}</p>
              <p className="text-[9px] text-zinc-500 mt-0.5 truncate">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Goal + BMR/TDEE row */}
      <div className="grid grid-cols-2 gap-3">
        {/* Goal card */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800/50 p-3.5">
          <div className="flex items-center gap-2 mb-2">
            <Target size={13} className="text-zinc-500" />
            <span className="text-[11px] text-zinc-500 font-medium uppercase tracking-widest">{g.fitnessGoal}</span>
          </div>
          <p className="text-[22px] mb-0.5">{goalEmoji[metrics.goal]}</p>
          <p className="text-[13px] font-semibold text-zinc-200">{goalLabel[metrics.goal]}</p>
        </div>

        {/* BMI card */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800/50 p-3.5">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={13} className="text-zinc-500" />
            <span className="text-[11px] text-zinc-500 font-medium uppercase tracking-widest">{g.bmiLabel.split(' ')[0]}</span>
          </div>
          <p className="text-[22px] font-bold text-zinc-100 tabular-nums">{bmiValue}</p>
          <p className={`text-[13px] font-semibold ${bmiCatColor[bmiCat]}`}>{bmiCatLabel[bmiCat]}</p>
        </div>
      </div>

      {/* Daily calorie goal */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800/50 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Flame size={14} className="text-zinc-500" />
          <span className="text-[12px] font-semibold text-zinc-500 uppercase tracking-widest">{g.dailyCalories}</span>
        </div>
        <div className="flex items-end gap-1.5 mb-3">
          <span className="text-[36px] font-bold text-white tabular-nums leading-none">
            {dailyGoal.calories}
          </span>
          <span className="text-[14px] text-zinc-500 mb-1">kcal</span>
        </div>
        {/* Macro bars */}
        <div className="space-y-2">
          {[
            { label: strings.common.protein, value: dailyGoal.protein,  color: MACRO_COLORS.protein.bg, kcal: dailyGoal.protein * 4 },
            { label: strings.common.carbs,   value: dailyGoal.carbs,    color: MACRO_COLORS.carbs.bg,   kcal: dailyGoal.carbs * 4 },
            { label: strings.common.fat,     value: dailyGoal.fat,      color: MACRO_COLORS.fat.bg,     kcal: dailyGoal.fat * 9 },
          ].map((m) => {
            const pct = Math.round((m.kcal / dailyGoal.calories) * 100)
            return (
              <div key={m.label} className="flex items-center gap-2">
                <span className="text-[11px] text-zinc-500 w-16 flex-shrink-0 truncate">{m.label}</span>
                <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className={`h-full rounded-full ${m.color}`}
                  />
                </div>
                <span className="text-[10px] text-zinc-300 tabular-nums w-16 text-right flex-shrink-0">
                  {m.value}g · {pct}%
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* BMR / TDEE info */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800/50 p-3.5">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Dumbbell size={12} className="text-zinc-600" />
            <span className="text-[10px] text-zinc-600 uppercase tracking-widest">{g.bmrLabel.split(' ')[0]}</span>
          </div>
          <p className="text-[20px] font-bold text-zinc-200 tabular-nums">{bmr}</p>
          <p className="text-[10px] text-zinc-600 mt-0.5">{strings.fitness.perDay}</p>
        </div>
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800/50 p-3.5">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Flame size={12} className="text-zinc-600" />
            <span className="text-[10px] text-zinc-600 uppercase tracking-widest">TDEE</span>
          </div>
          <p className="text-[20px] font-bold text-zinc-200 tabular-nums">{tdee}</p>
          <p className="text-[10px] text-zinc-600 mt-0.5">{strings.fitness.perDay}</p>
        </div>
      </div>
    </div>
  )
}

// ─── Ana Sayfa ───────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { user, signOut, deleteAccount, updateProfile } = useAuth()
  const { isPro, planTier, restore } = useSubscription(user?.uid)
  const { limit } = useScanLimit(user?.uid, user?.isPro)
  const navigate = useNavigate()
  const haptics = useHaptics()

  const { strings, locale, changeLocale } = useLocale()
  const s = strings.profile
  const g = strings.goals

  const [tab, setTab] = useState<ProfileTab>('profile')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showGoalSheet, setShowGoalSheet] = useState(false)
  const [restoringPurchase, setRestoringPurchase] = useState(false)
  const [deletingAccount, setDeletingAccount] = useState(false)
  const [deleteAccountError, setDeleteAccountError] = useState<string | null>(null)
  const [restoreMessage, setRestoreMessage] = useState<{ text: string; success: boolean } | null>(null)

  // Bildirim tercihleri
  const mealReminders = user?.mealReminders ?? false
  const promoNotifs = user?.promoNotifs ?? false
  const updatePreference = (updates: Partial<UserProfile>) => {
    updateProfile(updates)
  }

  const handleTabChange = (t: ProfileTab) => {
    haptics.selectionChanged()
    setTab(t)
  }

  const handleSignOut = async () => {
    haptics.impactMedium()
    await signOut()
    navigate('/auth')
  }

  const handleDeleteAccount = useCallback(async () => {
    if (deletingAccount) return
    haptics.notificationError()
    setDeletingAccount(true)
    setDeleteAccountError(null)
    try {
      await deleteAccount()
      setShowDeleteModal(false)
      navigate('/auth', { replace: true })
    } catch (error) {
      console.error('[Account] delete failed', error)
      setDeleteAccountError(s.deleteError)
      haptics.notificationError()
    } finally {
      setDeletingAccount(false)
    }
  }, [deleteAccount, deletingAccount, haptics, navigate, s.deleteError])

  const openURL = (url: string) => {
    if (isNative) {
      // Capacitor Browser plugin ile aç (native in-app browser)
      import('@capacitor/browser').then(({ Browser }) => {
        Browser.open({ url, presentationStyle: 'popover' })
      }).catch(() => {
        window.open(url, '_blank')
      })
    } else {
      window.open(url, '_blank')
    }
  }

  const openSubscriptionManagement = async () => {
    haptics.impactLight()
    if (isNative && Capacitor.getPlatform() === 'ios') {
      // iOS: App Store abonelik yönetim sayfasını aç
      openURL('https://apps.apple.com/account/subscriptions')
    } else {
      navigate('/paywall')
    }
  }

  const openNotificationSettings = async () => {
    haptics.impactLight()
    if (isNative) {
      // iOS sistem bildirim ayarlarını aç — deep link
      try {
        window.location.href = 'app-settings:'
      } catch {
        // Fallback: deep link çalışmadıysa sessizce devam et
      }
    }
  }

  const appVersion = '1.0.0'
  const buildNumber = '2'

  return (
    <div className="px-5 pt-14 pb-28 max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* ── Başlık ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <h1 className="text-[26px] font-bold tracking-tight">{s.myAccount}</h1>
        </motion.div>

        {/* ── Kullanıcı Kartı ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800/50 mb-5"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-zinc-800 rounded-full flex items-center justify-center text-xl font-bold text-zinc-200 flex-shrink-0">
              {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-zinc-100 truncate">
                {user?.displayName || strings.profile.defaultUserName}
              </p>
              <p className="text-[12px] text-zinc-500 truncate">{user?.email}</p>
              {isPro && (
                <div className="flex items-center gap-1 mt-1">
                  <Crown size={11} className="text-white" />
                  <span className="text-[11px] font-semibold text-white">{planTier === 'plus' ? s.plusMemberBadge : s.proMemberBadge}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Tab Switcher ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <ProfileTabSwitcher tab={tab} onChange={handleTabChange} />
        </motion.div>

        {/* ── İçerik ─────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {tab === 'profile' ? (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.25 }}
            >
              {/* ── Vücut & Hedef ── */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.15 }}
                className="mb-5"
              >
                <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest px-1 mb-2">
                  {g.sectionTitle}
                </p>
                {user?.bodyMetrics ? (
                  <BodyMetricsCard
                    metrics={user.bodyMetrics}
                    onEdit={() => setShowGoalSheet(true)}
                  />
                ) : (
                  /* Setup CTA */
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { haptics.impactLight(); setShowGoalSheet(true) }}
                    className="w-full bg-zinc-900 rounded-2xl border border-zinc-800/50 p-5 text-left"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-zinc-800 rounded-2xl flex items-center justify-center">
                        <Target size={18} className="text-zinc-400" />
                      </div>
                      <div>
                        <p className="text-[15px] font-semibold text-zinc-200">{g.notSetup}</p>
                        <p className="text-[12px] text-zinc-500 leading-snug mt-0.5">{g.notSetupDesc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-white bg-zinc-800 rounded-xl px-4 py-2.5 w-fit">
                      <span className="text-[13px] font-semibold">{g.setupButton}</span>
                      <ChevronRight size={14} />
                    </div>
                  </motion.button>
                )}
              </motion.div>

              {/* Abonelik */}
              <Section title={s.subscription} delay={0.2}>
                {!isPro ? (
                  <SettingsRow
                    icon={<Crown size={16} className="text-zinc-300" />}
                    label={s.goPro}
                    sublabel={s.goProSub}
                    onPress={() => { haptics.impactLight(); navigate('/paywall') }}
                  />
                ) : (
                  <SettingsRow
                    icon={<Crown size={16} className="text-white" />}
                    label={s.proMember}
                    sublabel={s.proMemberSub}
                    trailing={
                      <span className="text-[10px] font-semibold text-white bg-zinc-700 px-2 py-0.5 rounded-full">
                        {s.active}
                      </span>
                    }
                  />
                )}
                <SettingsRow
                  icon={<RotateCcw size={16} className="text-zinc-400" />}
                  label={s.manageSubscription}
                  sublabel={s.manageSubscriptionSub}
                  onPress={openSubscriptionManagement}
                />
                <SettingsRow
                  icon={<Star size={16} className="text-zinc-400" />}
                  label={s.restorePurchase}
                  sublabel={restoringPurchase ? s.restoring : s.restorePurchaseSub}
                  onPress={async () => {
                    if (!user || restoringPurchase) return
                    haptics.impactLight()
                    setRestoreMessage(null)
                    setRestoringPurchase(true)
                    try {
                      const result = await restore()
                      if (result.success) {
                        updateProfile({ isPro: true })
                        setRestoreMessage({ text: s.active, success: true })
                        haptics.notificationSuccess()
                      } else {
                        haptics.notificationError()
                        // RevenueCat geri-yükleme hataları İngilizce literal döndürür
                        // (ör. "No active subscription found"). TR/EN kullanıcıya
                        // her zaman yerelleştirilmiş metin göster — İngilizce sızmasın.
                        const isNoActiveSub = !result.error || result.error === 'No active subscription found'
                        setRestoreMessage({
                          text: isNoActiveSub ? s.noActiveFound : s.restoreError,
                          success: false,
                        })
                      }
                    } catch {
                      haptics.notificationError()
                      setRestoreMessage({ text: s.restoreError, success: false })
                    } finally {
                      setRestoringPurchase(false)
                      setTimeout(() => setRestoreMessage(null), 5000)
                    }
                  }}
                />
                {restoreMessage && (
                  <div className={`px-4 py-3 ${restoreMessage.success ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                    <p className={`text-[12px] ${restoreMessage.success ? 'text-emerald-400' : 'text-red-400'}`}>
                      {restoreMessage.text}
                    </p>
                  </div>
                )}
              </Section>

              {/* Market — scan paketi al + (Plus ise) Pro'ya yükselt.
                  Aboneler dahil herkesin scan paketine erişebilmesi için
                  ayrı, görünür bir giriş noktası. */}
              <Section title={s.marketSection} delay={0.22}>
                <SettingsRow
                  icon={<Zap size={16} className="text-emerald-400" />}
                  label={s.buyScanPack}
                  sublabel={s.buyScanPackSub}
                  onPress={() => { haptics.impactLight(); navigate('/paywall', { state: { focus: 'scan' } }) }}
                />
                {planTier === 'plus' && (
                  <SettingsRow
                    icon={<Crown size={16} className="text-amber-400" />}
                    label={s.upgradeToPro}
                    sublabel={s.upgradeToProSub}
                    onPress={() => { haptics.impactLight(); navigate('/paywall', { state: { focus: 'pro' } }) }}
                  />
                )}
              </Section>

              {/* Kullanım */}
              <Section title={s.usageSection} delay={0.25}>
                <SettingsRow
                  icon={<Check size={16} className="text-zinc-400" />}
                  label={s.aiScansUsed}
                  trailing={
                    <span className="text-[14px] font-semibold text-zinc-300 tabular-nums">
                      {limit.used}{!isPro && <span className="text-zinc-600 text-[12px]"> / {limit.total}</span>}
                    </span>
                  }
                />
              </Section>

              {/* Hesap */}
              <Section title={s.accountSection} delay={0.3}>
                <SettingsRow
                  icon={<LogOut size={16} className="text-zinc-400" />}
                  label={s.signOut}
                  onPress={handleSignOut}
                />
              </Section>
            </motion.div>
          ) : (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25 }}
            >
              {/* ── Dil ve Bölge ── */}
              <Section title={s.languageSection} delay={0.05}>
                {SUPPORTED_LOCALES.map((opt) => (
                  <SettingsRow
                    key={opt.code}
                    icon={<span className="text-base">{opt.flag}</span>}
                    label={opt.label}
                    onPress={() => {
                      haptics.selectionChanged()
                      changeLocale(opt.code)
                    }}
                    trailing={
                      locale === opt.code
                        ? <Check size={16} className="text-emerald-400" />
                        : undefined
                    }
                  />
                ))}
              </Section>

              {/* ── Bildirimler ── Apple zorunlu: bildirim tercihleri */}
              <Section title={s.notifications} delay={0.1}>
                <ToggleRow
                  icon={<Bell size={16} className="text-zinc-400" />}
                  label={s.mealReminders}
                  sublabel={s.mealRemindersSub}
                  value={mealReminders}
                  onChange={async (v) => {
                    haptics.selectionChanged()
                    if (v && isNative) {
                      const granted = await ensurePermission()
                      if (!granted) { openNotificationSettings(); return }
                    }
                    updatePreference({ mealReminders: v })
                  }}
                />
                <ToggleRow
                  icon={<Mail size={16} className="text-zinc-400" />}
                  label={s.promoNotifs}
                  sublabel={s.promoNotifsSub}
                  value={promoNotifs}
                  onChange={(v) => { haptics.selectionChanged(); updatePreference({ promoNotifs: v }) }}
                />
                <SettingsRow
                  icon={<Settings size={16} className="text-zinc-400" />}
                  label={s.systemNotifs}
                  sublabel={s.systemNotifsSub}
                  onPress={openNotificationSettings}
                />
              </Section>

              {/* ── Privacy */}
              <Section title={s.privacySection} delay={0.15}>
                <SettingsRow
                  icon={<Shield size={16} className="text-zinc-400" />}
                  label={s.privacyPolicy}
                  sublabel={s.privacyPolicySub}
                  onPress={() => {
                    haptics.impactLight()
                    openURL('https://makrofy-26820.web.app/privacy')
                  }}
                  trailing={<ExternalLink size={13} className="text-zinc-600" />}
                />
                <SettingsRow
                  icon={<Lock size={16} className="text-zinc-400" />}
                  label={s.dataPreferences}
                  sublabel={s.dataPreferencesSub}
                  onPress={() => {
                    haptics.impactLight()
                    openURL('https://makrofy-26820.web.app/data-preferences')
                  }}
                  trailing={<ExternalLink size={13} className="text-zinc-600" />}
                />
              </Section>

              {/* ── Yasal — Apple zorunlu: Terms of Service */}
              <Section title={s.legalSection} delay={0.2}>
                <SettingsRow
                  icon={<FileText size={16} className="text-zinc-400" />}
                  label={s.terms}
                  onPress={() => {
                    haptics.impactLight()
                    openURL('https://makrofy-26820.web.app/terms')
                  }}
                  trailing={<ExternalLink size={13} className="text-zinc-600" />}
                />
                <SettingsRow
                  icon={<Heart size={16} className="text-zinc-400" />}
                  label={s.openSource}
                  onPress={() => {
                    haptics.impactLight()
                    openURL('https://makrofy-26820.web.app/licenses')
                  }}
                  trailing={<ExternalLink size={13} className="text-zinc-600" />}
                />
              </Section>

              {/* ── Destek ── */}
              <Section title={s.support} delay={0.25}>
                <SettingsRow
                  icon={<Mail size={16} className="text-zinc-400" />}
                  label={s.contactUs}
                  sublabel={s.contactEmail}
                  onPress={() => {
                    haptics.impactLight()
                    // Prefill subject + diagnostics so support can act fast.
                    const platform = Capacitor.getPlatform()
                    const subject = s.supportEmailSubject
                    const diag = s.supportEmailBody({
                      version: `${appVersion} (${buildNumber})`,
                      platform,
                      locale,
                      plan: planTier ?? 'free',
                      userId: user?.uid ?? '-',
                    })
                    openURL(
                      `mailto:support@makrofy.app?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(diag)}`
                    )
                  }}
                  trailing={<ExternalLink size={13} className="text-zinc-600" />}
                />
              </Section>

              {/* ── Hesap Silme — Apple zorunlu (App Store Review §5.1.1) */}
              <Section title={s.accountSection} delay={0.3}>
                <SettingsRow
                  icon={<Trash2 size={16} className="text-red-400" />}
                  label={s.deleteAccount}
                  sublabel={s.deleteAccountSub}
                  onPress={() => {
                    haptics.notificationWarning()
                    setDeleteAccountError(null)
                    setShowDeleteModal(true)
                  }}
                  destructive
                />
              </Section>

              {/* ── Uygulama Bilgisi ── */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.35 }}
                className="flex flex-col items-center gap-1 mt-2 mb-6"
              >
                <div className="flex items-center gap-1.5">
                  <Info size={12} className="text-zinc-700" />
                  <p className="text-[11px] text-zinc-600">
                    Makrofy v{appVersion} ({buildNumber})
                  </p>
                </div>
                <p className="text-[10px] text-zinc-700">
                  {s.nutritionDisclaimer}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Hesap Silme Modalı ─────────────────────────────────────── */}
      <AnimatePresence>
        {showDeleteModal && (
          <DeleteAccountModal
            onClose={() => { haptics.impactLight(); setDeleteAccountError(null); setShowDeleteModal(false) }}
            onConfirm={handleDeleteAccount}
            loading={deletingAccount}
            error={deleteAccountError}
          />
        )}
      </AnimatePresence>

      {/* ── Hedef Kurma Sheet ───────────────────────────────────────── */}
      <AnimatePresence>
        {showGoalSheet && (
          <GoalSetupSheet
            initial={user?.bodyMetrics}
            onSave={(metrics) => {
              const newDailyGoal = calculateDailyGoalFromMetrics(metrics)
              updateProfile({ bodyMetrics: metrics, dailyGoal: newDailyGoal })
              setShowGoalSheet(false)
            }}
            onClose={() => setShowGoalSheet(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
