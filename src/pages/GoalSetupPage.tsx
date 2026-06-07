/**
 * GoalSetupPage — 4-step onboarding shown once after first login.
 *
 * Step 1: Goal selection   (lose / maintain / gain)
 * Step 2: Body metrics     (gender, age, height, weight, activity)
 * Step 3: Plan preference  (existing plan vs. generate one)
 * Step 4: Summary          (calorie target + sample meal plan preview)
 */

import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Check, Crown, Lock, Flame, Beef, Wheat, Droplets } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useLocale } from '../contexts/LocaleContext'
import type { BodyMetrics, ActivityLevel, FitnessGoal, Gender } from '../types/user'
import { calculateDailyGoalFromMetrics, calculateBMR, calculateTDEE } from '../utils/goalCalc'
import { getPlanForGoal, scalePlanToCalories } from '../data/mealPlanTemplates'
import type { DailyMealPlan } from '../data/mealPlanTemplates'
import MakrofyLogo from '../components/ui/MakrofyLogo'

// ─── Constants ───────────────────────────────────────────────────────────────

const TOTAL_STEPS = 4

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepDots({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            width: i === current - 1 ? 20 : 6,
            backgroundColor: i < current ? '#ffffff' : '#3f3f46',
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="h-1.5 rounded-full"
        />
      ))}
    </div>
  )
}

// ─── Stepper for numbers ──────────────────────────────────────────────────────

function NumStepper({
  value,
  onChange,
  min,
  max,
  unit,
}: {
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  unit: string
}) {
  return (
    <div className="flex items-center gap-4">
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-10 h-10 rounded-2xl bg-zinc-800 text-zinc-200 text-xl flex items-center justify-center"
      >
        −
      </motion.button>
      <div className="min-w-[70px] text-center">
        <span className="text-[28px] font-bold text-white tabular-nums">{value}</span>
        <span className="text-[13px] text-zinc-500 ml-1.5">{unit}</span>
      </div>
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-10 h-10 rounded-2xl bg-zinc-800 text-zinc-200 text-xl flex items-center justify-center"
      >
        +
      </motion.button>
    </div>
  )
}

// ─── Macro pill ───────────────────────────────────────────────────────────────

function MacroPill({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: string
  color: string
}) {
  return (
    <div className={`flex-1 rounded-2xl p-3 border ${color} text-center`}>
      <div className="flex justify-center mb-1">{icon}</div>
      <p className="text-[15px] font-bold text-zinc-100 tabular-nums">{value}</p>
      <p className="text-[10px] text-zinc-500 mt-0.5">{label}</p>
    </div>
  )
}

// ─── Meal row for summary ─────────────────────────────────────────────────────

function MealRow({
  emoji,
  time,
  label,
  calories,
  foods,
  delay,
}: {
  emoji: string
  time: string
  label: string
  calories: number
  foods: string[]
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay }}
      className="flex items-start gap-3 py-3 border-b border-zinc-800/40 last:border-0"
    >
      <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center text-base flex-shrink-0 mt-0.5">
        {emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <p className="text-[13px] font-semibold text-zinc-200">{label}</p>
          <span className="text-[12px] text-zinc-400 tabular-nums">{calories} kcal</span>
        </div>
        <p className="text-[11px] text-zinc-500 leading-relaxed truncate">
          {foods.slice(0, 3).join(' · ')}
          {foods.length > 3 && ` +${foods.length - 3}`}
        </p>
        <p className="text-[10px] text-zinc-700 mt-0.5">{time}</p>
      </div>
    </motion.div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function GoalSetupPage() {
  const navigate = useNavigate()
  const { updateProfile } = useAuth()
  const { strings } = useLocale()
  const s = strings.setup
  const g = strings.goals

  const [step, setStep]             = useState(1)
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>('maintain')
  const [gender, setGender]         = useState<Gender>('male')
  const [age, setAge]               = useState(25)
  const [heightCm, setHeight]       = useState(175)
  const [weightKg, setWeight]       = useState(75)
  const [activity, setActivity]     = useState<ActivityLevel>('moderate')
  const [hasPlan, setHasPlan]       = useState<boolean | null>(null)
  const [saving, setSaving]         = useState(false)

  // Computed
  const bodyMetrics: BodyMetrics = {
    gender, age, heightCm, weightKg, activityLevel: activity, goal: fitnessGoal,
  }
  const dailyGoal = calculateDailyGoalFromMetrics(bodyMetrics)
  const bmr  = calculateBMR(gender, weightKg, heightCm, age)
  const tdee = calculateTDEE(bmr, activity)
  const rawPlan  = getPlanForGoal(fitnessGoal)
  const mealPlan: DailyMealPlan = scalePlanToCalories(rawPlan, dailyGoal.calories)

  const next = () => setStep((s) => Math.min(TOTAL_STEPS, s + 1))
  const back = () => setStep((s) => Math.max(1, s - 1))

  const handleFinish = useCallback(async () => {
    setSaving(true)
    updateProfile({
      bodyMetrics,
      dailyGoal,
      goalSetupCompleted: true,
      onboardingCompleted: true,
      hasExistingPlan: hasPlan ?? false,
    })
    await new Promise((r) => setTimeout(r, 400)) // brief visual pause
    navigate('/', { replace: true })
  }, [bodyMetrics, dailyGoal, hasPlan, updateProfile, navigate])

  // Activity level options
  const activityOptions: { value: ActivityLevel; label: string; desc: string }[] = [
    { value: 'sedentary',    label: g.sedentary,  desc: g.sedentaryDesc },
    { value: 'light',        label: g.light,      desc: g.lightDesc },
    { value: 'moderate',     label: g.moderate,   desc: g.moderateDesc },
    { value: 'active',       label: g.active,     desc: g.activeDesc },
    { value: 'very_active',  label: g.veryActive, desc: g.veryActiveDesc },
  ]

  // Goal options
  const goalOptions: { value: FitnessGoal; label: string; desc: string; emoji: string; kcal: string }[] = [
    { value: 'lose_weight', label: s.loseWeight, desc: s.loseWeightDesc, emoji: '🔥', kcal: '−500 kcal' },
    { value: 'maintain',    label: s.maintain,   desc: s.maintainDesc,   emoji: '⚖️', kcal: '= TDEE' },
    { value: 'gain_weight', label: s.gainWeight, desc: s.gainWeightDesc, emoji: '💪', kcal: '+300 kcal' },
  ]

  const mealEmojis: Record<string, string> = {
    breakfast: '🥣',
    lunch:     '🥗',
    dinner:    '🍽️',
    snack:     '🍎',
  }
  const mealLabels: Record<string, string> = {
    breakfast: s.mealBreakfast,
    lunch:     s.mealLunch,
    dinner:    s.mealDinner,
    snack:     s.mealSnack,
  }

  // Slide transition variants
  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit:  (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
  }
  const [direction, setDirection] = useState(1)

  const goNext = () => { setDirection(1); next() }
  const goBack = () => { setDirection(-1); back() }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* ── Top bar ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 pt-14 pb-4">
        <div className="flex items-center gap-3">
          {step > 1 ? (
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={goBack}
              className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center"
            >
              <ChevronLeft size={18} className="text-zinc-400" />
            </motion.button>
          ) : (
            <MakrofyLogo size={28} variant="icon" />
          )}
        </div>
        <StepDots current={step} />
        <div className="w-9" />
      </div>

      {/* ── Step content ─────────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="h-full"
          >

            {/* ══ Step 1: Goal ════════════════════════════════════════════ */}
            {step === 1 && (
              <div className="px-5 pb-8">
                <div className="mb-8">
                  <h1 className="text-[28px] font-bold tracking-tight mb-2">{s.goalTitle}</h1>
                  <p className="text-[14px] text-zinc-400 leading-relaxed">{s.goalSubtitle}</p>
                </div>

                <div className="space-y-3 mb-8">
                  {goalOptions.map((opt) => {
                    const isSelected = fitnessGoal === opt.value
                    return (
                      <motion.button
                        key={opt.value}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setFitnessGoal(opt.value)}
                        className={`
                          w-full flex items-center gap-4 px-4 py-4 rounded-2xl border text-left transition-all
                          ${isSelected
                            ? 'bg-white border-white'
                            : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}
                        `}
                      >
                        <span className="text-3xl flex-shrink-0">{opt.emoji}</span>
                        <div className="flex-1">
                          <p className={`text-[16px] font-bold ${isSelected ? 'text-black' : 'text-zinc-100'}`}>
                            {opt.label}
                          </p>
                          <p className={`text-[12px] mt-0.5 ${isSelected ? 'text-zinc-600' : 'text-zinc-500'}`}>
                            {opt.desc}
                          </p>
                        </div>
                        <span className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg ${
                          isSelected ? 'bg-black/10 text-black' : 'bg-zinc-800 text-zinc-500'
                        }`}>
                          {opt.kcal}
                        </span>
                      </motion.button>
                    )
                  })}
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={goNext}
                  className="w-full bg-white text-black py-4 rounded-2xl text-[15px] font-bold"
                >
                  {s.continueButton} →
                </motion.button>
              </div>
            )}

            {/* ══ Step 2: Body metrics ════════════════════════════════════ */}
            {step === 2 && (
              <div className="px-5 pb-8 overflow-y-auto" style={{ maxHeight: 'calc(100dvh - 120px)' }}>
                <div className="mb-6">
                  <h1 className="text-[28px] font-bold tracking-tight mb-2">{s.bodyTitle}</h1>
                  <p className="text-[14px] text-zinc-400 leading-relaxed">{s.bodySubtitle}</p>
                </div>

                {/* Gender */}
                <div className="mb-5">
                  <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-2">{g.gender}</p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {(['male', 'female'] as Gender[]).map((v) => (
                      <motion.button
                        key={v}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setGender(v)}
                        className={`
                          py-3.5 rounded-2xl border text-[14px] font-semibold transition-all
                          ${gender === v ? 'bg-white text-black border-white' : 'bg-zinc-900 text-zinc-400 border-zinc-800'}
                        `}
                      >
                        {v === 'male' ? `♂ ${g.male}` : `♀ ${g.female}`}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Steppers */}
                <div className="bg-zinc-900 rounded-2xl border border-zinc-800/50 divide-y divide-zinc-800/40 mb-5">
                  {[
                    { label: g.age,    value: age,      onChange: setAge,    min: 10, max: 100, unit: g.years },
                    { label: g.height, value: heightCm, onChange: setHeight, min: 100, max: 250, unit: g.cmUnit },
                    { label: g.weight, value: weightKg, onChange: setWeight, min: 30, max: 300, unit: g.kgUnit },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between px-4 py-3.5">
                      <span className="text-[14px] text-zinc-300 font-medium">{row.label}</span>
                      <NumStepper value={row.value} onChange={row.onChange} min={row.min} max={row.max} unit={row.unit} />
                    </div>
                  ))}
                </div>

                {/* Activity level */}
                <div className="mb-6">
                  <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-2">{g.activityLevel}</p>
                  <div className="space-y-2">
                    {activityOptions.map((opt) => (
                      <motion.button
                        key={opt.value}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setActivity(opt.value)}
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

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={goNext}
                  className="w-full bg-white text-black py-4 rounded-2xl text-[15px] font-bold sticky bottom-4"
                >
                  {s.continueButton} →
                </motion.button>
              </div>
            )}

            {/* ══ Step 3: Existing plan? ══════════════════════════════════ */}
            {step === 3 && (
              <div className="px-5 pb-8">
                <div className="mb-8">
                  <h1 className="text-[28px] font-bold tracking-tight mb-2">{s.planTitle}</h1>
                  <p className="text-[14px] text-zinc-400 leading-relaxed">{s.planSubtitle}</p>
                </div>

                <div className="space-y-3 mb-8">
                  {[
                    {
                      value: true,
                      emoji: '📋',
                      label: s.hasPlanYes,
                      desc: s.hasPlanYesDesc,
                    },
                    {
                      value: false,
                      emoji: '✨',
                      label: s.hasPlanNo,
                      desc: s.hasPlanNoDesc,
                    },
                  ].map((opt) => {
                    const isSelected = hasPlan === opt.value
                    return (
                      <motion.button
                        key={String(opt.value)}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setHasPlan(opt.value)}
                        className={`
                          w-full flex items-center gap-4 px-5 py-5 rounded-2xl border text-left transition-all
                          ${isSelected
                            ? 'bg-white border-white'
                            : 'bg-zinc-900 border-zinc-800'}
                        `}
                      >
                        <span className="text-3xl">{opt.emoji}</span>
                        <div className="flex-1">
                          <p className={`text-[16px] font-bold mb-0.5 ${isSelected ? 'text-black' : 'text-zinc-100'}`}>
                            {opt.label}
                          </p>
                          <p className={`text-[13px] ${isSelected ? 'text-zinc-600' : 'text-zinc-500'}`}>
                            {opt.desc}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                            <Check size={13} className="text-white" />
                          </div>
                        )}
                      </motion.button>
                    )
                  })}
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={goNext}
                  disabled={hasPlan === null}
                  className="w-full bg-white disabled:bg-zinc-800 disabled:text-zinc-600 text-black py-4 rounded-2xl text-[15px] font-bold transition-all"
                >
                  {s.continueButton} →
                </motion.button>
              </div>
            )}

            {/* ══ Step 4: Summary ════════════════════════════════════════ */}
            {step === 4 && (
              <div
                className="px-5 pb-8 overflow-y-auto smooth-scroll-area"
                style={{ maxHeight: 'calc(100dvh - 120px)' }}
              >
                <div className="mb-6">
                  <h1 className="text-[28px] font-bold tracking-tight mb-2">{s.summaryTitle}</h1>
                  <p className="text-[14px] text-zinc-400 leading-relaxed">{s.summarySubtitle}</p>
                </div>

                {/* Calorie target card */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-zinc-900 rounded-2xl border border-zinc-800/50 p-4 mb-3"
                >
                  <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-3">
                    {s.dailyCalories}
                  </p>
                  <div className="flex items-end gap-1.5 mb-4">
                    <span className="text-[42px] font-bold tabular-nums leading-none">{dailyGoal.calories}</span>
                    <span className="text-[15px] text-zinc-500 mb-1.5">{strings.fitness.perDay}</span>
                  </div>
                  <div className="flex gap-2">
                    <MacroPill
                      icon={<Beef size={12} className="text-blue-400" />}
                      label={strings.common.protein}
                      value={`${dailyGoal.protein}g`}
                      color="border-blue-500/20 bg-blue-500/5"
                    />
                    <MacroPill
                      icon={<Wheat size={12} className="text-amber-400" />}
                      label={strings.common.carbs}
                      value={`${dailyGoal.carbs}g`}
                      color="border-amber-500/20 bg-amber-500/5"
                    />
                    <MacroPill
                      icon={<Droplets size={12} className="text-rose-400" />}
                      label={strings.common.fat}
                      value={`${dailyGoal.fat}g`}
                      color="border-rose-500/20 bg-rose-500/5"
                    />
                  </div>

                  {/* BMR/TDEE hint */}
                  <div className="flex gap-2 mt-3 pt-3 border-t border-zinc-800/40">
                    <div className="flex-1 text-center">
                      <p className="text-[11px] text-zinc-600">BMR</p>
                      <p className="text-[13px] font-semibold text-zinc-400 tabular-nums">{bmr}</p>
                    </div>
                    <div className="w-px bg-zinc-800" />
                    <div className="flex-1 text-center">
                      <p className="text-[11px] text-zinc-600">TDEE</p>
                      <p className="text-[13px] font-semibold text-zinc-400 tabular-nums">{tdee}</p>
                    </div>
                    <div className="w-px bg-zinc-800" />
                    <div className="flex-1 text-center">
                      <p className="text-[11px] text-zinc-600">{s.yourGoal}</p>
                      <p className="text-[13px] font-semibold text-zinc-400 tabular-nums">
                        {goalOptions.find((o) => o.value === fitnessGoal)?.emoji}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Existing plan note */}
                {hasPlan && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.1 }}
                    className="bg-zinc-900 rounded-2xl border border-zinc-800/50 p-4 mb-3 flex items-start gap-3"
                  >
                    <span className="text-xl">📋</span>
                    <p className="text-[13px] text-zinc-400 leading-relaxed">{s.existingPlanNote}</p>
                  </motion.div>
                )}

                {/* Sample daily meal plan */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="bg-zinc-900 rounded-2xl border border-zinc-800/50 overflow-hidden mb-3"
                >
                  <div className="px-4 pt-4 pb-2">
                    <p className="text-[13px] font-semibold text-zinc-200">{s.mealPlanTitle}</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">{s.mealPlanSubtitle}</p>
                  </div>
                  <div className="px-4 pb-2">
                    {mealPlan.meals.map((m, i) => (
                      <MealRow
                        key={m.type}
                        emoji={mealEmojis[m.type] ?? '🍽️'}
                        time={m.time}
                        label={mealLabels[m.type] ?? m.type}
                        calories={m.totalCalories}
                        foods={m.foods.map((f) => f.name)}
                        delay={0.2 + i * 0.06}
                      />
                    ))}
                  </div>

                  {/* Pro teaser banner */}
                  <div className="mx-4 mb-4 mt-1 bg-zinc-800/60 rounded-xl px-3.5 py-3 flex items-center gap-2.5">
                    <Crown size={14} className="text-zinc-400 flex-shrink-0" />
                    <p className="text-[11px] text-zinc-500 leading-relaxed flex-1">
                      {s.proMealPlanTeaser}
                    </p>
                    <Lock size={12} className="text-zinc-600 flex-shrink-0" />
                  </div>
                </motion.div>

                {/* Start button */}
                <motion.button
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleFinish}
                  disabled={saving}
                  className="w-full bg-white text-black py-4 rounded-2xl text-[15px] font-bold disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <Flame size={16} />
                      {s.startButton}
                    </>
                  )}
                </motion.button>

                <div className="h-6" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
