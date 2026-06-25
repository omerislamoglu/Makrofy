import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarDays, Camera, CheckCircle2, ChevronDown, Crown, Dumbbell, Flame, Loader2, Salad, ShieldCheck, Sparkles, Upload, X } from 'lucide-react'
import type { UserProfile } from '../../types/user'
import type { AIProgram, AIProgramGoal, AIProgramProfileInputs } from '../../types/aiProgram'
import { generateAIProgram } from '../../services/aiProgramService'
import { MACRO_COLORS } from '../../constants/macroColors'
import { useLocale } from '../../contexts/LocaleContext'

const GOAL_ICONS: Record<AIProgramGoal, string> = {
  fat_loss: '🔥',
  muscle_gain: '💪',
  fit_look: '✨',
  weight_gain: '📈',
  strength: '🏋️',
  healthy_eating: '🥗',
}

const GOAL_KEYS: AIProgramGoal[] = ['fat_loss', 'muscle_gain', 'fit_look', 'weight_gain', 'strength', 'healthy_eating']

const MAX_PHOTO_BYTES = 10 * 1024 * 1024
const DEFAULT_PROGRAM_CYCLE_DAYS = 28
const DEFAULT_EVALUATION_INTERVAL_DAYS = 14

interface AIProgramBuilderProps {
  user: UserProfile | null
  locale: string
  initialProgram: AIProgram | null
  canUsePhoto: boolean
  onProgramReady: (program: AIProgram) => void
}

export default function AIProgramBuilder({ user, locale, initialProgram, canUsePhoto, onProgramReady }: AIProgramBuilderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [photoFile, setPhotoFile] = useState<File | undefined>()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [program, setProgram] = useState<AIProgram | null>(initialProgram)
  const [loading, setLoading] = useState(false)
  const [loadingIndex, setLoadingIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const { strings } = useLocale()
  const t = strings.aiProgram
  const [error, setError] = useState<string | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [builderMode, setBuilderMode] = useState<'initial' | 'progress_evaluation'>('initial')
  const [progressNotes, setProgressNotes] = useState('')

  const body = user?.bodyMetrics

  // Profildeki FitnessGoal → AIProgramGoal eşlemesi
  const inferGoal = (goal?: string): AIProgramGoal => {
    switch (goal) {
      case 'lose_weight': return 'fat_loss'
      case 'gain_weight': return 'muscle_gain'
      case 'maintain': return 'fit_look'
      default: return 'fit_look'
    }
  }

  // Profildeki ActivityLevel → TrainingLevel eşlemesi
  const inferTrainingLevel = (level?: string): AIProgramProfileInputs['trainingLevel'] => {
    switch (level) {
      case 'sedentary':
      case 'light': return 'beginner'
      case 'moderate': return 'intermediate'
      case 'active':
      case 'very_active': return 'advanced'
      default: return 'beginner'
    }
  }

  // Aktivite seviyesinden haftalık gün önerisi
  const inferDaysPerWeek = (level?: string): number => {
    switch (level) {
      case 'sedentary': return 3
      case 'light': return 3
      case 'moderate': return 4
      case 'active': return 5
      case 'very_active': return 6
      default: return 3
    }
  }

  const [inputs, setInputs] = useState<AIProgramProfileInputs>({
    goal: inferGoal(body?.goal),
    goalText: '',
    heightCm: body?.heightCm ?? 175,
    weightKg: body?.weightKg ?? 75,
    age: body?.age ?? 28,
    gender: body?.gender ?? 'male',
    trainingLevel: inferTrainingLevel(body?.activityLevel),
    trainingDaysPerWeek: inferDaysPerWeek(body?.activityLevel),
    trainingLocation: 'gym',
    injuries: '',
    nutritionPreference: 'normal',
    mealsPerDay: 3,
    allergiesDislikes: '',
    locale: locale as string,
  })

  const loadingSteps = useMemo(() => [
    t.loadingPhoto, t.loadingPhysique, t.loadingWorkout, t.loadingNutrition, t.loadingFinishing,
  ], [t])

  const goalLabels = useMemo(() => ({
    fat_loss: { label: t.goalFatLoss, sub: t.goalFatLossSub },
    muscle_gain: { label: t.goalMuscleGain, sub: t.goalMuscleGainSub },
    fit_look: { label: t.goalFitLook, sub: t.goalFitLookSub },
    weight_gain: { label: t.goalWeightGain, sub: t.goalWeightGainSub },
    strength: { label: t.goalStrength, sub: t.goalStrengthSub },
    healthy_eating: { label: t.goalHealthyEating, sub: t.goalHealthyEatingSub },
  }), [t])

  // Honest, continuous loading progress: ease smoothly toward ~95% over the
  // expected ~50s window so the bar never freezes at a fixed step. The step
  // label advances in step with the progress fraction.
  useEffect(() => {
    if (!loading) {
      setProgress(0)
      setLoadingIndex(0)
      return
    }
    const stepCount = loadingSteps.length
    const start = Date.now()
    const timer = window.setInterval(() => {
      const elapsedSec = (Date.now() - start) / 1000
      const pct = 95 * (1 - Math.exp(-elapsedSec / 22))
      setProgress(pct)
      setLoadingIndex(Math.min(stepCount - 1, Math.floor((pct / 95) * stepCount)))
    }, 180)
    return () => window.clearInterval(timer)
  }, [loading, loadingSteps])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  useEffect(() => {
    if (canUsePhoto) return
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setPhotoFile(undefined)
  }, [canUsePhoto, previewUrl])

  const canSubmit = useMemo(() => (
    inputs.heightCm >= 120 &&
    inputs.weightKg >= 30 &&
    inputs.age >= 13 &&
    inputs.trainingDaysPerWeek >= 1 &&
    inputs.mealsPerDay >= 2
  ), [inputs])

  const visibleProgram = program ?? initialProgram
  const updateInfo = visibleProgram ? getProgramUpdateInfo(visibleProgram, locale) : null

  const update = <K extends keyof AIProgramProfileInputs>(key: K, value: AIProgramProfileInputs[K]) => {
    setInputs((current) => ({ ...current, [key]: value }))
  }

  const handleFile = (file?: File) => {
    if (!file) return
    const imageMimeType = getImageMimeType(file)
    if (!imageMimeType) {
      setError(t.errUnsupportedFormat)
      return
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setError(t.errPhotoTooLarge)
      return
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPhotoFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setError(null)
  }

  const submit = async () => {
    if (!canSubmit || loading) return
    setLoading(true)
    setLoadingIndex(0)
    setError(null)
    try {
      const next = await generateAIProgram(
        { ...inputs, locale: locale as string },
        canUsePhoto ? photoFile : undefined,
        {
          mode: builderMode,
          progressNotes: builderMode === 'progress_evaluation' ? progressNotes : undefined,
        }
      )
      setProgram(next)
      setBuilderMode('initial')
      setProgressNotes('')
      onProgramReady(next)
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errGeneric)
    } finally {
      setLoading(false)
    }
  }

  // If a program already exists, show results first
  if (visibleProgram && !loading) {
    return (
      <div className="space-y-4">
        <ProgramResult program={visibleProgram} />
        {updateInfo && (
          <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/70 p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
              <CalendarDays size={17} className="text-amber-300" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-bold text-zinc-100">{t.evaluationWeek}</p>
              <p className="text-[11px] text-zinc-500 leading-relaxed mt-1">
                {updateInfo.canEvaluate
                  ? canUsePhoto
                    ? t.evaluationReadyWithPhoto
                    : t.evaluationReadyNoPhoto
                  : t.evaluationWaiting(updateInfo.evaluationIntervalDays, updateInfo.nextEvaluationLabel, updateInfo.remainingDays)}
              </p>
            </div>
          </div>
        )}
        <button
          type="button"
          disabled={!updateInfo?.canEvaluate}
          onClick={() => {
            setBuilderMode('progress_evaluation')
            setDetailsOpen(true)
            setProgram(null)
          }}
          className="w-full h-11 rounded-xl border border-zinc-800 bg-zinc-900/60 text-[12px] font-semibold text-zinc-300 flex items-center justify-center gap-2 active:scale-[0.99] transition-transform disabled:opacity-45 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          <Sparkles size={14} className="text-amber-300" />
          {updateInfo?.canEvaluate ? t.evaluateNow : t.evaluationWaitingBtn}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* ── Photo Upload — Hero Section ── */}
      <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-b from-amber-500/[0.06] to-zinc-900/80 p-5">
        <div className="text-center mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 flex items-center justify-center mx-auto mb-3">
            <Sparkles size={22} className="text-amber-300" />
          </div>
          <h2 className="text-[17px] font-bold text-zinc-100">
            {builderMode === 'progress_evaluation' ? t.twoWeekEvaluation : t.personalAIProgram}
          </h2>
          <p className="text-[12px] text-zinc-500 mt-1 leading-relaxed max-w-[280px] mx-auto">
            {builderMode === 'progress_evaluation'
              ? canUsePhoto
                ? t.evalDescWithPhoto
                : t.evalDescNoPhoto
              : canUsePhoto
                ? t.builderDescWithPhoto
                : t.builderDescNoPhoto}
          </p>
        </div>

        {canUsePhoto ? (
          <>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-2xl border-2 border-dashed border-zinc-700/80 bg-black/30 flex items-center justify-center overflow-hidden active:scale-[0.99] transition-all"
              style={{ minHeight: previewUrl ? 'auto' : '160px' }}
            >
              {previewUrl ? (
                <div className="relative w-full">
                  <img src={previewUrl} alt="" className="w-full max-h-56 object-cover rounded-xl" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <Camera size={14} className="text-white" />
                    <span className="text-[11px] font-semibold text-white/90">{t.tapToChange}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 px-5">
                  <div className="w-14 h-14 rounded-2xl bg-zinc-800/60 flex items-center justify-center mx-auto mb-3">
                    <Upload size={22} className="text-zinc-400" />
                  </div>
                  <p className="text-[14px] font-semibold text-zinc-200">
                    {builderMode === 'progress_evaluation' ? t.progressPhoto : t.bodyPhoto}
                  </p>
                  <p className="text-[11px] text-zinc-600 mt-1 leading-relaxed">
                    {t.photoHint}
                  </p>
                </div>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif"
              className="hidden"
              onChange={(event) => handleFile(event.target.files?.[0])}
            />
          </>
        ) : (
          <div className="rounded-2xl border border-zinc-800 bg-black/30 px-4 py-5 text-center">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800/70 flex items-center justify-center mx-auto mb-3">
              <Crown size={20} className="text-amber-300" />
            </div>
            <p className="text-[13px] font-bold text-zinc-200">{t.photoProOnly}</p>
            <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
              {t.photoProOnlyDesc}
            </p>
          </div>
        )}
        {canUsePhoto && photoFile && (
          <button
            type="button"
            onClick={() => {
              if (previewUrl) URL.revokeObjectURL(previewUrl)
              setPreviewUrl(null)
              setPhotoFile(undefined)
            }}
            className="mt-2 text-[11px] text-zinc-500 flex items-center gap-1 mx-auto"
          >
            <X size={12} /> {t.removePhoto}
          </button>
        )}
      </div>

      {/* ── Goal Selection ── */}
      <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/70 p-4">
        <FieldLabel label={t.selectGoal} />
        <div className="grid grid-cols-2 gap-2 mt-2">
          {GOAL_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => update('goal', key)}
              className={`rounded-xl border p-3 text-left transition-all active:scale-[0.98] ${
                inputs.goal === key
                  ? 'bg-amber-500/10 border-amber-500/40 ring-1 ring-amber-500/20'
                  : 'bg-zinc-950/40 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <span className="text-[16px]">{GOAL_ICONS[key]}</span>
              <p className={`text-[12px] font-bold mt-1 ${inputs.goal === key ? 'text-amber-200' : 'text-zinc-200'}`}>
                {goalLabels[key].label}
              </p>
              <p className="text-[10px] text-zinc-500 mt-0.5">{goalLabels[key].sub}</p>
            </button>
          ))}
        </div>
        <div className="mt-3">
          <TextArea
            label={t.goalDetail}
            value={inputs.goalText ?? ''}
            placeholder={t.goalDetailPlaceholder}
            onChange={(v) => update('goalText', v)}
          />
        </div>
      </div>

      {/* ── Core Info (from profile, editable) ── */}
      <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/70 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <FieldLabel label={t.coreInfo} />
          {body?.heightCm && (
            <span className="text-[10px] text-zinc-600">{t.fromProfile}</span>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2">
          <NumberInput label={t.height} value={inputs.heightCm} min={120} max={230} unit="cm" onChange={(v) => update('heightCm', v)} />
          <NumberInput label={t.weight} value={inputs.weightKg} min={30} max={300} unit="kg" onChange={(v) => update('weightKg', v)} />
          <NumberInput label={t.age} value={inputs.age} min={13} max={90} unit="" onChange={(v) => update('age', v)} />
          <Select label={t.gender} value={inputs.gender} onChange={(v) => update('gender', v as AIProgramProfileInputs['gender'])} options={[
            ['male', t.male],
            ['female', t.female],
            ['other', t.other],
          ]} />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Select label={t.level} value={inputs.trainingLevel} onChange={(v) => update('trainingLevel', v as AIProgramProfileInputs['trainingLevel'])} options={[
            ['beginner', t.beginner],
            ['intermediate', t.intermediate],
            ['advanced', t.advanced],
          ]} />
          <Select label={t.location} value={inputs.trainingLocation} onChange={(v) => update('trainingLocation', v as AIProgramProfileInputs['trainingLocation'])} options={[
            ['gym', t.gym],
            ['home', t.home],
          ]} />
          <NumberInput label={t.daysPerWeek} value={inputs.trainingDaysPerWeek} min={1} max={6} unit="" onChange={(v) => update('trainingDaysPerWeek', v)} />
        </div>
      </div>

      {/* ── Advanced Options (collapsed) ── */}
      <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/70 overflow-hidden">
        <button
          type="button"
          onClick={() => setDetailsOpen(!detailsOpen)}
          className="w-full p-4 flex items-center justify-between text-left"
        >
          <span className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider">{t.advancedPrefs}</span>
          <ChevronDown size={14} className={`text-zinc-500 transition-transform ${detailsOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {detailsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Select label={t.nutrition} value={inputs.nutritionPreference} onChange={(v) => update('nutritionPreference', v)} options={[
                    ['normal', t.normal],
                    ['vegetarian', t.vegetarian],
                    ['vegan', t.vegan],
                    ['halal', t.halal],
                    ['lactose_free', t.lactoseFree],
                  ]} />
                  <NumberInput label={t.mealsPerDay} value={inputs.mealsPerDay} min={2} max={6} unit="" onChange={(v) => update('mealsPerDay', v)} />
                </div>
                <TextArea label={t.injuries} value={inputs.injuries ?? ''} placeholder={t.injuriesPlaceholder} onChange={(v) => update('injuries', v)} />
                <TextArea label={t.allergies} value={inputs.allergiesDislikes ?? ''} placeholder={t.allergiesPlaceholder} onChange={(v) => update('allergiesDislikes', v)} />
                {builderMode === 'progress_evaluation' && (
                  <TextArea
                    label={t.progressNotes}
                    value={progressNotes}
                    placeholder={t.progressNotesPlaceholder}
                    onChange={setProgressNotes}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-[12px] text-red-200">
          {error}
        </div>
      )}

      {/* ── Submit ── */}
      <button
        type="button"
        disabled={!canSubmit || loading}
        onClick={submit}
        className="w-full h-14 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black text-[14px] font-bold flex items-center justify-center gap-2.5 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.99] transition-transform shadow-lg shadow-amber-500/20"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>{loadingSteps[loadingIndex]}</span>
          </>
        ) : (
          <>
            <Sparkles size={18} />
            {builderMode === 'progress_evaluation' ? t.ctaEvaluate : t.ctaCreate}
          </>
        )}
      </button>

      {loading && (
        <div className="space-y-2">
          <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
            <motion.div
              className="h-full bg-amber-500 rounded-full"
              initial={{ width: '5%' }}
              animate={{ width: `${Math.max(5, progress)}%` }}
              transition={{ duration: 0.25, ease: 'linear' }}
            />
          </div>
          <p className="text-center text-[10px] text-zinc-600">
            {t.loadingHint}
          </p>
        </div>
      )}

      {/* ── Disclaimer ── */}
      <p className="text-center text-[10px] text-zinc-700 leading-relaxed px-4">
        {t.disclaimer}
      </p>
    </div>
  )
}

function ProgramResult({ program }: { program: AIProgram }) {
  const { strings } = useLocale()
  const t = strings.aiProgram
  const macros = program.macros ?? { calories: 0, protein: 0, carbs: 0, fat: 0 }
  const workoutPlan = program.workoutPlan ?? {
    overview: t.overviewFallback,
    weeklyPlan: [],
    fourWeekProgression: [],
    warmup: '',
    cooldown: '',
    cardio: '',
    daysPerWeek: 0,
  }
  const nutritionPlan = program.nutritionPlan ?? {
    strategy: t.strategyFallback,
    sampleDay: [],
    alternatives: [],
    water: '',
  }
  const weeklyPlan = Array.isArray(workoutPlan.weeklyPlan) ? workoutPlan.weeklyPlan : []
  const sampleDay = Array.isArray(nutritionPlan.sampleDay) ? nutritionPlan.sampleDay : []
  const alternatives = Array.isArray(nutritionPlan.alternatives) ? nutritionPlan.alternatives : []
  const notes = [
    ...(Array.isArray(workoutPlan.fourWeekProgression) ? workoutPlan.fourWeekProgression : []),
    ...(Array.isArray(program.progressTracking) ? program.progressTracking : []),
    ...(Array.isArray(program.safetyNotes) ? program.safetyNotes : []),
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
      {/* Header */}
      <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-b from-amber-500/[0.06] to-zinc-900/80 p-5 text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/15 flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 size={22} className="text-amber-300" />
        </div>
        <h2 className="text-[17px] font-bold text-zinc-100">{t.programReady}</h2>
        <p className="text-[12px] text-zinc-400 mt-1 leading-relaxed">
          {program.targetSummary || t.programReadyDefault}
        </p>
        {program.photoAnalysisSummary && (
          <p className="text-[11px] text-zinc-500 mt-2 italic">{program.photoAnalysisSummary}</p>
        )}
      </div>

      {/* Macros */}
      <ResultCard icon={<Flame size={16} />} title={t.dailyTargetMacros}>
        <div className="grid grid-cols-4 gap-2">
          <MacroBox label={t.calories} value={macros.calories || '-'} unit="kcal" color="text-white" />
          <MacroBox label={t.protein} value={macros.protein ? `${macros.protein}` : '-'} unit="g" color={MACRO_COLORS.protein.text} />
          <MacroBox label={t.carbs} value={macros.carbs ? `${macros.carbs}` : '-'} unit="g" color={MACRO_COLORS.carbs.text} />
          <MacroBox label={t.fat} value={macros.fat ? `${macros.fat}` : '-'} unit="g" color={MACRO_COLORS.fat.text} />
        </div>
      </ResultCard>

      {/* Workout Plan */}
      <ResultCard icon={<Dumbbell size={16} />} title={t.workoutProgram}>
        <p className="mb-3">{workoutPlan.overview}</p>
        {workoutPlan.warmup && (
          <div className="rounded-lg bg-black/20 border border-zinc-800/40 p-2.5 mb-3">
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">{t.warmup}</p>
            <p className="text-[11px] text-zinc-400">{workoutPlan.warmup}</p>
          </div>
        )}
        <div className="space-y-2">
          {weeklyPlan.length === 0 && <p className="text-zinc-500">{t.weeklyPlanMissing}</p>}
          {weeklyPlan.map((day, index) => (
            <details key={`${day.day}-${index}`} className="rounded-xl bg-black/30 border border-zinc-800/60 group">
              <summary className="cursor-pointer p-3 flex items-center justify-between">
                <div>
                  <span className="text-[13px] font-semibold text-zinc-100">{day.day || t.dayLabel(index + 1)}</span>
                  <span className="text-[11px] text-zinc-500 ml-2">{day.focus || t.workout}</span>
                </div>
                <ChevronDown size={14} className="text-zinc-600 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-3 pb-3 space-y-2 border-t border-zinc-800/40 pt-2">
                {(Array.isArray(day.exercises) ? day.exercises : []).map((ex, i) => (
                  <div key={`${ex.name}-${i}`} className="flex items-start gap-2 text-[12px]">
                    <span className="text-zinc-600 font-bold tabular-nums w-4 shrink-0">{i + 1}</span>
                    <div className="flex-1">
                      <span className="text-zinc-200 font-medium">{ex.name || 'Egzersiz'}</span>
                      <span className="text-zinc-500 ml-1.5">{ex.sets || '-'}×{ex.reps || '-'}</span>
                      <span className="text-zinc-600 ml-1.5">({ex.rest || '-'})</span>
                      {ex.notes && <p className="text-[10px] text-zinc-600 mt-0.5">{ex.notes}</p>}
                    </div>
                  </div>
                ))}
                {day.cardio && <p className="text-[11px] text-zinc-500 pt-1 border-t border-zinc-800/30">🏃 {day.cardio}</p>}
              </div>
            </details>
          ))}
        </div>
        {workoutPlan.cooldown && (
          <div className="rounded-lg bg-black/20 border border-zinc-800/40 p-2.5 mt-3">
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">{t.cooldown}</p>
            <p className="text-[11px] text-zinc-400">{workoutPlan.cooldown}</p>
          </div>
        )}
        {workoutPlan.cardio && (
          <div className="rounded-lg bg-black/20 border border-zinc-800/40 p-2.5 mt-2">
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">{t.cardioSuggestion}</p>
            <p className="text-[11px] text-zinc-400">{workoutPlan.cardio}</p>
          </div>
        )}
      </ResultCard>

      {/* Nutrition Plan */}
      <ResultCard icon={<Salad size={16} />} title={t.nutritionProgram}>
        <p className="mb-3">{nutritionPlan.strategy}</p>
        <div className="space-y-2">
          {sampleDay.length === 0 && <p className="text-zinc-500">{t.sampleMealsMissing}</p>}
          {sampleDay.map((meal, index) => (
            <div key={`${meal.meal}-${index}`} className="rounded-xl bg-black/25 border border-zinc-800/50 p-3">
              <p className="text-[12px] font-semibold text-zinc-200 mb-1.5">{meal.meal || t.mealLabel(index + 1)}</p>
              <ul className="space-y-1">
                {(Array.isArray(meal.options) ? meal.options : []).map((option, i) => (
                  <li key={i} className="text-[11px] text-zinc-400 flex items-start gap-1.5">
                    <span className="text-zinc-600 mt-0.5">•</span>
                    <span>{option}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {alternatives.length > 0 && (
          <details className="mt-3 rounded-xl bg-black/20 border border-zinc-800/40">
            <summary className="cursor-pointer p-3 text-[12px] font-semibold text-zinc-300">
              Alternatif Besinler
            </summary>
            <div className="px-3 pb-3 space-y-2">
              {alternatives.map((alt, index) => (
                <div key={`alt-${index}`}>
                  <p className="text-[11px] font-medium text-zinc-400 mb-1">{alt.meal}</p>
                  <ul className="space-y-0.5">
                    {(Array.isArray(alt.options) ? alt.options : []).map((opt, i) => (
                      <li key={i} className="text-[10px] text-zinc-500">• {opt}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </details>
        )}
        {nutritionPlan.water && (
          <p className="text-[11px] text-zinc-500 mt-3">💧 {nutritionPlan.water}</p>
        )}
      </ResultCard>

      {/* Progression & Notes */}
      {notes.length > 0 && (
        <ResultCard icon={<ShieldCheck size={16} />} title={t.progressAndNotes}>
          <ul className="space-y-1.5">
            {notes.map((note, index) => (
              <li key={index} className="text-[11px] text-zinc-500 flex items-start gap-2">
                <span className="text-zinc-600 mt-0.5 shrink-0">→</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </ResultCard>
      )}
    </motion.div>
  )
}

function getImageMimeType(file: File): string | null {
  if (file.type.startsWith('image/')) return file.type.toLowerCase()
  const extension = file.name.split('.').pop()?.toLowerCase()
  if (extension === 'jpg' || extension === 'jpeg') return 'image/jpeg'
  if (extension === 'png') return 'image/png'
  if (extension === 'webp') return 'image/webp'
  if (extension === 'heic') return 'image/heic'
  if (extension === 'heif') return 'image/heif'
  return null
}

function getTimestampMs(value: unknown): number | null {
  if (!value) return null
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = Date.parse(value)
    return Number.isNaN(parsed) ? null : parsed
  }
  if (typeof value === 'object') {
    const record = value as Record<string, unknown>
    const seconds = record.seconds ?? record._seconds
    if (typeof seconds === 'number') {
      return seconds * 1000
    }
    if (record.toDate && typeof record.toDate === 'function') {
      const date = record.toDate() as Date
      return Number.isNaN(date.getTime()) ? null : date.getTime()
    }
  }
  return null
}

const PROGRAM_DATE_LOCALE: Record<string, string> = {
  tr: 'tr-TR', en: 'en-US', de: 'de-DE', fr: 'fr-FR', es: 'es-ES', it: 'it-IT',
}

function formatProgramDate(ms: number, locale?: string): string {
  return new Intl.DateTimeFormat(PROGRAM_DATE_LOCALE[locale ?? 'en'] ?? 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(ms))
}

function getProgramUpdateInfo(program: AIProgram, locale?: string) {
  const cycleDays = program.cycleDays ?? DEFAULT_PROGRAM_CYCLE_DAYS
  const evaluationIntervalDays = program.evaluationIntervalDays ?? DEFAULT_EVALUATION_INTERVAL_DAYS
  const createdAtMs = getTimestampMs(program.createdAt) ?? getTimestampMs(program.updatedAt)
  if (!createdAtMs && !program.nextEvaluationAt && !program.nextUpdateAt) {
    return {
      cycleDays,
      evaluationIntervalDays,
      canEvaluate: true,
      remainingDays: 0,
      nextEvaluationLabel: '',
      nextUpdateLabel: '',
    }
  }
  const nextEvaluationMs = getTimestampMs(program.nextEvaluationAt) ?? (createdAtMs ?? Date.now()) + evaluationIntervalDays * 24 * 60 * 60 * 1000
  const nextUpdateMs = getTimestampMs(program.nextUpdateAt) ?? (createdAtMs ?? Date.now()) + cycleDays * 24 * 60 * 60 * 1000
  const remainingEvaluationMs = nextEvaluationMs - Date.now()
  return {
    cycleDays,
    evaluationIntervalDays,
    canEvaluate: remainingEvaluationMs <= 0,
    remainingDays: Math.max(1, Math.ceil(remainingEvaluationMs / (24 * 60 * 60 * 1000))),
    nextEvaluationLabel: formatProgramDate(nextEvaluationMs, locale),
    nextUpdateLabel: formatProgramDate(nextUpdateMs, locale),
  }
}

export function AIProgramLockedPreview({ onUpgrade }: { onUpgrade: () => void }) {
  const { strings } = useLocale()
  const t = strings.aiProgram
  return (
    <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-b from-amber-500/[0.06] to-zinc-900/80 p-5 mb-4">
      <div className="text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/15 flex items-center justify-center mx-auto mb-3">
          <Sparkles size={22} className="text-amber-300" />
        </div>
        <h2 className="text-[17px] font-bold text-zinc-100">{t.lockedTitle}</h2>
        <p className="text-[12px] text-zinc-500 mt-1 leading-relaxed max-w-[280px] mx-auto">
          {t.lockedDesc}
        </p>
      </div>
      <button
        type="button"
        onClick={onUpgrade}
        className="mt-4 w-full h-12 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black text-[13px] font-bold flex items-center justify-center gap-2 active:scale-[0.99] transition-transform"
      >
        <Crown size={15} />
        {t.unlockPro}
      </button>
    </div>
  )
}

function ResultCard({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-zinc-800/60 bg-zinc-900/70 p-4 text-[12px] text-zinc-400 leading-relaxed">
      <div className="flex items-center gap-2 mb-3 text-zinc-100">
        {icon}
        <h3 className="text-[14px] font-bold">{title}</h3>
      </div>
      {children}
    </section>
  )
}

function MacroBox({ label, value, unit, color }: { label: string; value: number | string; unit: string; color: string }) {
  return (
    <div className="rounded-xl bg-black/30 border border-zinc-800/60 p-2.5 text-center">
      <p className="text-[10px] text-zinc-600 mb-0.5">{label}</p>
      <p className={`text-[16px] font-bold tabular-nums ${color}`}>{value}</p>
      <p className="text-[9px] text-zinc-700">{unit}</p>
    </div>
  )
}

function FieldLabel({ label }: { label: string }) {
  return <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">{label}</p>
}

function NumberInput({ label, value, min, max, unit, onChange }: { label: string; value: number; min: number; max: number; unit: string; onChange: (value: number) => void }) {
  return (
    <label className="block">
      <FieldLabel label={label} />
      <div className="mt-1 flex items-center gap-1 rounded-xl border border-zinc-800 bg-black/30 px-3 h-10">
        <input
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full bg-transparent text-[13px] font-semibold text-zinc-100 outline-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        {unit && <span className="text-[9px] text-zinc-600 shrink-0">{unit}</span>}
      </div>
    </label>
  )
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: Array<[string, string]>; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <FieldLabel label={label} />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full h-10 rounded-xl border border-zinc-800 bg-black/30 px-2 text-[12px] font-semibold text-zinc-100 outline-none"
      >
        {options.map(([optionValue, labelText]) => <option key={optionValue} value={optionValue}>{labelText}</option>)}
      </select>
    </label>
  )
}

function TextArea({ label, value, placeholder, onChange }: { label: string; value: string; placeholder: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <FieldLabel label={label} />
      <textarea
        value={value}
        maxLength={500}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full min-h-16 rounded-xl border border-zinc-800 bg-black/30 px-3 py-2.5 text-[12px] text-zinc-100 placeholder:text-zinc-700 outline-none resize-none"
      />
    </label>
  )
}
