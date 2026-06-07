import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Dumbbell,
  Check,
  Loader2,
  Pencil,
  Play,
  Sparkles,
  ClipboardList,
  ArrowLeft,
} from 'lucide-react'
import { useLocale } from '../contexts/LocaleContext'
import { useAuth } from '../hooks/useAuth'
import { useHaptics } from '../hooks/useCapacitor'
import EmptyState from '../components/ui/EmptyState'
import {
  type WorkoutProgram,
  type ProgramDay,
  type ProgramExercise,
  type WorkoutWeek,
  type WeekDay,
  type WeekExercise,
  mondayOfWeek,
  shiftWeek,
  weekIdFromDate,
  weekFromProgram,
  mergePrevWeights,
  formatWeekRange,
  uid,
} from '../types/workout'
import {
  getProgram,
  saveProgram as saveProgramService,
  deleteProgram as deleteProgramService,
  getWeek,
  saveWeek,
} from '../services/workoutService'
import { createDefaultProgram } from '../data/defaultWorkoutProgram'

type AppStrings = ReturnType<typeof useLocale>['strings']
type WStrings = AppStrings['workout']

// ═══════════════════════════════════════════════════════════════════════════
// Shared: Number Input Helper
// ═══════════════════════════════════════════════════════════════════════════

/** Clamp & guard against NaN for number inputs */
function safeNum(val: string, min: number, max: number): number {
  const n = Number(val)
  if (Number.isNaN(n)) return min
  return Math.min(max, Math.max(min, n))
}

// ═══════════════════════════════════════════════════════════════════════════
// Program Editor Sub-Components
// ═══════════════════════════════════════════════════════════════════════════

function ProgramExerciseRow({
  exercise,
  t,
  onChange,
  onDelete,
}: {
  exercise: ProgramExercise
  t: WStrings
  onChange: (e: ProgramExercise) => void
  onDelete: () => void
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className="bg-zinc-800/60 rounded-xl p-3 space-y-2"
    >
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={exercise.name}
          onChange={(e) => onChange({ ...exercise, name: e.target.value })}
          placeholder={t.exercisePlaceholder}
          className="flex-1 bg-transparent text-white text-sm font-medium placeholder:text-zinc-500 outline-none"
        />
        <button type="button" onClick={onDelete} className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors">
          <Trash2 size={14} />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-[10px] text-zinc-500 uppercase tracking-wider">{t.sets}</label>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={99}
            value={exercise.sets ?? ''}
            onChange={(e) => onChange({ ...exercise, sets: safeNum(e.target.value, 0, 99) })}
            className="w-full bg-zinc-900/60 rounded-lg px-2.5 py-1.5 text-white text-sm text-center outline-none mt-0.5"
          />
        </div>
        <div>
          <label className="text-[10px] text-zinc-500 uppercase tracking-wider">{t.reps}</label>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={999}
            value={exercise.reps ?? ''}
            onChange={(e) => onChange({ ...exercise, reps: safeNum(e.target.value, 0, 999) })}
            className="w-full bg-zinc-900/60 rounded-lg px-2.5 py-1.5 text-white text-sm text-center outline-none mt-0.5"
          />
        </div>
        <div>
          <label className="text-[10px] text-zinc-500 uppercase tracking-wider">{t.defaultWeight}</label>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            max={9999}
            step={0.5}
            value={exercise.defaultWeight ?? ''}
            onChange={(e) => onChange({ ...exercise, defaultWeight: safeNum(e.target.value, 0, 9999) })}
            className="w-full bg-zinc-900/60 rounded-lg px-2.5 py-1.5 text-white text-sm text-center outline-none mt-0.5"
          />
        </div>
      </div>
      <input
        type="text"
        value={exercise.note}
        onChange={(e) => onChange({ ...exercise, note: e.target.value })}
        placeholder={t.notesPlaceholder}
        className="w-full bg-transparent text-zinc-400 text-xs placeholder:text-zinc-600 outline-none"
      />
    </motion.div>
  )
}

function ConfirmDialog({ open, message, onCancel, onConfirm }: {
  open: boolean; message: string
  onCancel: () => void; onConfirm: () => void
}) {
  const { strings } = useLocale()
  if (!open) return null
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center px-8">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" onClick={onCancel} />
        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }} className="relative bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 w-full max-w-xs shadow-xl">
          <p className="text-[15px] font-semibold text-zinc-100 text-center mb-5">{message}</p>
          <div className="flex gap-3">
            <button type="button" onClick={onCancel} className="flex-1 h-11 rounded-xl text-[13px] font-medium text-zinc-300 bg-zinc-800 border border-zinc-700/50 hover:bg-zinc-700 transition-all">
              {strings.common.cancel}
            </button>
            <button type="button" onClick={onConfirm} className="flex-1 h-11 rounded-xl text-[13px] font-medium text-white bg-red-600 hover:bg-red-500 transition-all flex items-center justify-center gap-2">
              <Trash2 size={14} />
              {strings.common.delete}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function ProgramDayCard({
  day,
  t,
  onChange,
  onDelete,
  onConfirm,
}: {
  day: ProgramDay
  t: WStrings
  onChange: (d: ProgramDay) => void
  onDelete: () => void
  onConfirm: (message: string, action: () => void) => void
}) {
  const [collapsed, setCollapsed] = useState(false)
  const haptics = useHaptics()

  const handleDelete = () => {
    onConfirm(t.confirmDeleteDay, () => {
      haptics.impactMedium()
      onDelete()
    })
  }

  const addExercise = () => {
    haptics.impactLight()
    onChange({
      ...day,
      exercises: [...day.exercises, { id: uid(), name: '', sets: 3, reps: 10, defaultWeight: 0, note: '' }],
    })
  }

  const updateExercise = (idx: number, ex: ProgramExercise) => {
    const next = [...day.exercises]
    next[idx] = ex
    onChange({ ...day, exercises: next })
  }

  const removeExercise = (idx: number) => {
    onConfirm(t.confirmDeleteExercise, () => {
      haptics.impactLight()
      onChange({ ...day, exercises: day.exercises.filter((_, i) => i !== idx) })
    })
  }

  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="bg-zinc-900/50 rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => { setCollapsed(!collapsed); haptics.impactLight() }} className="flex-1 flex items-center gap-2">
          <ChevronRight size={14} className={`text-zinc-500 transition-transform ${collapsed ? '' : 'rotate-90'}`} />
          <input
            type="text"
            value={day.dayName}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onChange({ ...day, dayName: e.target.value })}
            placeholder={t.dayPlaceholder}
            className="bg-transparent text-white font-semibold text-sm outline-none flex-1 placeholder:text-zinc-500"
          />
        </button>
        <span className="text-[11px] text-zinc-500">{day.exercises.length} {t.noExercises}</span>
        <button type="button" onClick={handleDelete} className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors">
          <Trash2 size={14} />
        </button>
      </div>

      <AnimatePresence mode="popLayout">
        {!collapsed && (
          <motion.div key="ex" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-2 overflow-hidden">
            {day.exercises.map((ex, idx) => (
              <ProgramExerciseRow
                key={ex.id}
                exercise={ex}
                t={t}
                onChange={(upd) => updateExercise(idx, upd)}
                onDelete={() => removeExercise(idx)}
              />
            ))}
            <button type="button" onClick={addExercise} className="flex items-center gap-1.5 text-zinc-400 hover:text-white text-xs transition-colors py-1">
              <Plus size={12} />
              {t.addExercise}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// Weekly Log Sub-Components
// ═══════════════════════════════════════════════════════════════════════════

function WeekExerciseRow({
  exercise,
  t,
  onChange,
}: {
  exercise: WeekExercise
  t: WStrings
  onChange: (e: WeekExercise) => void
}) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-800/60 rounded-xl p-3 space-y-2">
      <div className="flex items-center gap-2">
        <span className="flex-1 text-white text-sm font-medium truncate">{exercise.name || '—'}</span>
        {exercise.prevWeight != null && exercise.prevWeight > 0 && (
          <span className="text-[10px] text-zinc-500 shrink-0">{t.prevWeight}: {exercise.prevWeight} {t.kg}</span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-[10px] text-zinc-500 uppercase tracking-wider">{t.sets}</label>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={99}
            value={exercise.sets ?? ''}
            onChange={(e) => onChange({ ...exercise, sets: safeNum(e.target.value, 0, 99) })}
            className="w-full bg-zinc-900/60 rounded-lg px-2.5 py-1.5 text-white text-sm text-center outline-none mt-0.5"
          />
        </div>
        <div>
          <label className="text-[10px] text-zinc-500 uppercase tracking-wider">{t.reps}</label>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={999}
            value={exercise.reps ?? ''}
            onChange={(e) => onChange({ ...exercise, reps: safeNum(e.target.value, 0, 999) })}
            className="w-full bg-zinc-900/60 rounded-lg px-2.5 py-1.5 text-white text-sm text-center outline-none mt-0.5"
          />
        </div>
        <div>
          <label className="text-[10px] text-zinc-500 uppercase tracking-wider">{t.weight} ({t.kg})</label>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            max={9999}
            step={0.5}
            value={exercise.weight ?? ''}
            onChange={(e) => onChange({ ...exercise, weight: safeNum(e.target.value, 0, 9999) })}
            className="w-full bg-zinc-900/60 rounded-lg px-2.5 py-1.5 text-white text-sm text-center outline-none mt-0.5"
          />
        </div>
      </div>

      <input
        type="text"
        value={exercise.note}
        onChange={(e) => onChange({ ...exercise, note: e.target.value })}
        placeholder={t.notesPlaceholder}
        className="w-full bg-transparent text-zinc-400 text-xs placeholder:text-zinc-600 outline-none"
      />
    </motion.div>
  )
}

function WeekDayCard({
  day,
  t,
  onChange,
}: {
  day: WeekDay
  t: WStrings
  onChange: (d: WeekDay) => void
}) {
  const [collapsed, setCollapsed] = useState(false)
  const haptics = useHaptics()

  const updateExercise = (idx: number, ex: WeekExercise) => {
    const next = [...day.exercises]
    next[idx] = ex
    onChange({ ...day, exercises: next })
  }

  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900/50 rounded-2xl p-4 space-y-3">
      <button type="button" onClick={() => { setCollapsed(!collapsed); haptics.impactLight() }} className="w-full flex items-center gap-2">
        <ChevronRight size={14} className={`text-zinc-500 transition-transform ${collapsed ? '' : 'rotate-90'}`} />
        <span className="text-white font-semibold text-sm flex-1 text-left">{day.dayName || '—'}</span>
        <span className="text-[11px] text-zinc-500">{day.exercises.length} {t.noExercises}</span>
      </button>

      <AnimatePresence mode="popLayout">
        {!collapsed && (
          <motion.div key="ex" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-2 overflow-hidden">
            {day.exercises.map((ex, idx) => (
              <WeekExerciseRow
                key={ex.id}
                exercise={ex}
                t={t}
                onChange={(upd) => updateExercise(idx, upd)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// Views
// ═══════════════════════════════════════════════════════════════════════════

/** No-program state — create or pick Makrofy starter */
function NoProgramView({
  t,
  onCreateCustom,
  onUseMakrofy,
}: {
  t: WStrings
  onCreateCustom: () => void
  onUseMakrofy: () => void
}) {
  return (
    <div className="space-y-4 mt-6">
      <EmptyState
        icon={<Dumbbell size={40} className="text-zinc-600" />}
        title={t.noProgramTitle}
        description={t.noProgramSubtitle}
      />

      <div className="space-y-3 mt-6">
        {/* Create custom */}
        <button type="button"
          onClick={onCreateCustom}
          className="w-full flex items-center gap-3 bg-white text-black rounded-2xl p-4 text-left active:scale-[0.98] transition-transform"
        >
          <div className="w-10 h-10 rounded-xl bg-black/10 flex items-center justify-center shrink-0">
            <Pencil size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold">{t.createCustom}</div>
            <div className="text-[12px] text-black/60 mt-0.5">{t.createCustomSub}</div>
          </div>
        </button>

        {/* Use Makrofy */}
        <button type="button"
          onClick={onUseMakrofy}
          className="w-full flex items-center gap-3 bg-zinc-800 text-white rounded-2xl p-4 text-left active:scale-[0.98] transition-transform"
        >
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <Sparkles size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold">{t.useMakrofy}</div>
            <div className="text-[12px] text-zinc-400 mt-0.5">{t.useMakrofySub}</div>
          </div>
        </button>

        {/* Disabled: generate from program */}
        <div className="w-full flex items-center gap-3 bg-zinc-900/40 text-zinc-600 rounded-2xl p-4 opacity-50 cursor-not-allowed">
          <div className="w-10 h-10 rounded-xl bg-zinc-800/60 flex items-center justify-center shrink-0">
            <Play size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold">{t.generateFromProgram}</div>
            <div className="text-[11px] text-zinc-600 mt-0.5">{t.generateFromProgramDisabled}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Program editor view */
function ProgramEditorView({
  program,
  t,
  onSave,
  onBack,
  onDelete,
}: {
  program: WorkoutProgram
  t: WStrings
  onSave: (p: WorkoutProgram) => void
  onBack: () => void
  onDelete: () => void
}) {
  const [draft, setDraft] = useState<WorkoutProgram>(() => JSON.parse(JSON.stringify(program)))
  const [saving, setSaving] = useState(false)
  const [confirmState, setConfirmState] = useState<{ message: string; action: () => void } | null>(null)
  const haptics = useHaptics()

  const requestConfirm = (message: string, action: () => void) => {
    setConfirmState({ message, action })
  }

  const addDay = () => {
    haptics.impactLight()
    setDraft((d) => ({ ...d, days: [...d.days, { id: uid(), dayName: '', exercises: [] }] }))
  }

  const updateDay = (idx: number, day: ProgramDay) => {
    setDraft((d) => {
      const days = [...d.days]
      days[idx] = day
      return { ...d, days }
    })
  }

  const removeDay = (idx: number) => {
    setDraft((d) => ({ ...d, days: d.days.filter((_, i) => i !== idx) }))
  }

  const handleSave = async () => {
    // Validate: remove exercises with empty names
    const cleaned: WorkoutProgram = {
      ...draft,
      days: draft.days.map((day) => ({
        ...day,
        exercises: day.exercises.filter((ex) => ex.name.trim() !== ''),
      })),
    }
    setSaving(true)
    haptics.impactMedium()
    onSave(cleaned)
    setSaving(false)
  }

  const handleDelete = () => {
    requestConfirm(t.confirmDeleteProgram, () => {
      haptics.impactMedium()
      onDelete()
    })
  }

  return (
    <div className="space-y-4">
      {/* Back button */}
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-zinc-400 hover:text-white text-sm transition-colors">
        <ArrowLeft size={16} />
        {t.backToTracker}
      </button>

      {/* Header */}
      <div>
        <h2 className="text-lg font-bold">{t.programTitle}</h2>
        <p className="text-zinc-400 text-xs mt-0.5">{t.programSubtitle}</p>
      </div>

      {/* Source badge */}
      <div className="flex items-center gap-2">
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
          draft.source === 'makrofy' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'
        }`}>
          {draft.source === 'makrofy' ? t.makrofyBadge : t.customBadge}
        </span>
        {draft.source === 'makrofy' && (
          <span className="text-[10px] text-zinc-500">{t.makrofyDisclaimer}</span>
        )}
      </div>

      {/* Days */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {draft.days.map((day, idx) => (
            <ProgramDayCard
              key={day.id}
              day={day}
              t={t}
              onChange={(upd) => updateDay(idx, upd)}
              onDelete={() => removeDay(idx)}
              onConfirm={requestConfirm}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Add day */}
      <button type="button"
        onClick={addDay}
        className="w-full flex items-center justify-center gap-2 bg-zinc-800 text-zinc-300 font-medium text-sm rounded-xl py-3 active:scale-[0.97] transition-transform"
      >
        <Plus size={16} />
        {t.addDay}
      </button>

      {/* Save */}
      <button type="button"
        onClick={handleSave}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 bg-white text-black font-semibold text-sm rounded-xl py-3 active:scale-[0.97] transition-transform disabled:opacity-50"
      >
        {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
        {t.saveProgram}
      </button>

      {/* Delete program */}
      <button type="button"
        onClick={handleDelete}
        className="w-full flex items-center justify-center gap-2 text-red-400/70 hover:text-red-400 text-xs py-2 transition-colors"
      >
        <Trash2 size={12} />
        {t.deleteProgram}
      </button>

      <ConfirmDialog
        open={confirmState !== null}
        message={confirmState?.message ?? ''}
        onCancel={() => setConfirmState(null)}
        onConfirm={() => { confirmState?.action(); setConfirmState(null) }}
      />
    </div>
  )
}

/** Weekly log view — with week navigation and exercise editing */
function WeeklyLogView({
  program,
  t,
  userId,
  onEditProgram,
  showToast,
}: {
  program: WorkoutProgram
  t: WStrings
  userId: string
  onEditProgram: () => void
  showToast: (msg: string) => void
}) {
  const haptics = useHaptics()
  const [currentMonday, setCurrentMonday] = useState(() => mondayOfWeek(new Date()))
  const [week, setWeek] = useState<WorkoutWeek | null>(null)
  const [loading, setLoading] = useState(true)
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle')
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dirtyRef = useRef<boolean>(false)
  const [creating, setCreating] = useState(false)

  const weekId = weekIdFromDate(currentMonday)
  const isThisWeek = weekIdFromDate(mondayOfWeek(new Date())) === weekId

  // ── Load week ────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    setLoading(true)

    ;(async () => {
      try {
        const fetched = await getWeek(userId, weekId)
        if (cancelled) return

        if (fetched) {
          const prevMonday = shiftWeek(currentMonday, -1)
          const prevWeek = await getWeek(userId, weekIdFromDate(prevMonday)).catch(() => null)
          setWeek(mergePrevWeights(fetched, prevWeek))
        } else {
          setWeek(null)
        }
      } catch (err) {
        console.warn('[WorkoutTracker] Failed to load week:', err)
        if (!cancelled) setWeek(null)
      } finally {
        if (!cancelled) { setLoading(false); dirtyRef.current = false }
      }
    })()

    return () => { cancelled = true }
  }, [userId, weekId, currentMonday])

  // ── Auto-save ────────────────────────────────────────────────────────
  const autoSave = useCallback(async (data: WorkoutWeek) => {
    setSaveState('saving')
    try {
      await saveWeek(userId, data)
      setSaveState('saved')
      dirtyRef.current = false
      setTimeout(() => setSaveState('idle'), 1500)
    } catch {
      setSaveState('idle')
    }
  }, [userId])

  const scheduleAutoSave = useCallback((data: WorkoutWeek) => {
    dirtyRef.current = true
    if (saveTimeout.current) clearTimeout(saveTimeout.current)
    saveTimeout.current = setTimeout(() => autoSave(data), 1200)
  }, [autoSave])

  // ── Week mutations ───────────────────────────────────────────────────
  const updateDay = (idx: number, day: WeekDay) => {
    setWeek((prev) => {
      if (!prev) return prev
      const days = [...prev.days]
      days[idx] = day
      const next = { ...prev, days }
      scheduleAutoSave(next)
      return next
    })
  }

  // ── Create week from program ─────────────────────────────────────────
  const createWeekFromProgram = async () => {
    if (creating) return // guard against double-tap
    setCreating(true)
    haptics.impactMedium()
    const newWeek = weekFromProgram(program, currentMonday)
    // Merge prev weights
    try {
      const prevMonday = shiftWeek(currentMonday, -1)
      const prevWeek = await getWeek(userId, weekIdFromDate(prevMonday)).catch(() => null)
      const merged = mergePrevWeights(newWeek, prevWeek)
      setWeek(merged)
      await saveWeek(userId, merged)
    } catch {
      setWeek(newWeek)
      await saveWeek(userId, newWeek).catch(() => {})
    }
    setCreating(false)
    showToast(t.weekCreated)
  }

  // ── Navigation ───────────────────────────────────────────────────────
  const goWeek = (offset: number) => {
    haptics.impactLight()
    if (dirtyRef.current && week) { autoSave(week) }
    setCurrentMonday((m) => shiftWeek(m, offset))
  }

  const hasDays = week && week.days.length > 0

  return (
    <div className="space-y-4">
      {/* Program summary + edit button */}
      <div className="bg-zinc-900/50 rounded-2xl px-4 py-3 space-y-1.5">
        <div className="flex items-center gap-2">
          <ClipboardList size={16} className="text-zinc-400 shrink-0" />
          <span className="text-sm text-white font-medium">{program.name || t.programTitle}</span>
          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium shrink-0 ${
            program.source === 'makrofy' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'
          }`}>
            {program.source === 'makrofy' ? t.makrofyBadge : t.customBadge}
          </span>
        </div>
        <button type="button" onClick={onEditProgram} className="flex items-center gap-1 text-zinc-400 hover:text-white text-xs transition-colors">
          <Pencil size={12} />
          {t.editProgram}
        </button>
      </div>

      {/* Week navigator */}
      <div className="flex items-center justify-between bg-zinc-900/60 rounded-2xl px-4 py-3">
        <button type="button" onClick={() => goWeek(-1)} className="p-1.5 text-zinc-400 hover:text-white transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <div className="text-sm font-semibold text-white">
            {isThisWeek ? t.thisWeek : `${t.weekLabel} ${weekId.split('-W')[1]}`}
          </div>
          <div className="text-[11px] text-zinc-500 mt-0.5">
            {formatWeekRange(currentMonday.toISOString().slice(0, 10))}
          </div>
        </div>
        <button type="button" onClick={() => goWeek(1)} className="p-1.5 text-zinc-400 hover:text-white transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Save indicator */}
      <AnimatePresence>
        {saveState !== 'idle' && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-1.5">
            {saveState === 'saving' ? (
              <><Loader2 size={12} className="text-zinc-500 animate-spin" /><span className="text-[11px] text-zinc-500">{t.saving}</span></>
            ) : (
              <><Check size={12} className="text-emerald-400" /><span className="text-[11px] text-emerald-400">{t.saved}</span></>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={24} className="text-zinc-500 animate-spin" />
        </div>
      )}

      {/* Week not created yet */}
      {!loading && !hasDays && (
        <div className="mt-4 space-y-4">
          <EmptyState
            icon={<Dumbbell size={36} className="text-zinc-600" />}
            title={t.emptyWeekTitle}
            description={t.emptyWeekSubtitle}
          />
          <button type="button"
            onClick={createWeekFromProgram}
            disabled={creating}
            className="w-full flex items-center justify-center gap-2 bg-white text-black font-semibold text-sm rounded-xl py-3 active:scale-[0.97] transition-transform disabled:opacity-50"
          >
            {creating ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
            {t.startWeek}
          </button>
        </div>
      )}

      {/* Week days */}
      {!loading && hasDays && (
        <div className="space-y-3">
          {week!.days.map((day, idx) => (
            <WeekDayCard
              key={day.id}
              day={day}
              t={t}
              onChange={(upd) => updateDay(idx, upd)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// Main Page
// ═══════════════════════════════════════════════════════════════════════════

type PageMode = 'tracker' | 'editor'

export default function WorkoutTrackerPage() {
  const { strings, locale } = useLocale()
  const t = strings.workout
  const { user } = useAuth()
  const haptics = useHaptics()

  const [program, setProgram] = useState<WorkoutProgram | null>(null)
  const [programLoading, setProgramLoading] = useState(true)
  const [mode, setMode] = useState<PageMode>('tracker')
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2000)
  }

  // ── Load program ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!user?.uid) return
    let cancelled = false
    setProgramLoading(true)
    ;(async () => {
      try {
        const p = await getProgram(user.uid)
        if (!cancelled) setProgram(p)
      } catch (err) {
        console.warn('[WorkoutTracker] Failed to load program:', err)
        if (!cancelled) setProgram(null)
      } finally {
        if (!cancelled) setProgramLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [user?.uid])

  // ── Actions ──────────────────────────────────────────────────────────
  const handleCreateCustom = () => {
    haptics.impactLight()
    const now = new Date().toISOString()
    const blank: WorkoutProgram = {
      id: 'main',
      name: '',
      source: 'custom',
      days: [],
      createdAt: now,
      updatedAt: now,
    }
    setProgram(blank)
    setMode('editor')
  }

  const handleUseMakrofy = async () => {
    if (!user?.uid) return
    haptics.impactMedium()
    const defaultProg = createDefaultProgram(locale)
    await saveProgramService(user.uid, defaultProg).catch(() => {})
    setProgram(defaultProg)
    showToast(t.programSaved)
  }

  const handleSaveProgram = async (p: WorkoutProgram) => {
    if (!user?.uid) return
    await saveProgramService(user.uid, p).catch(() => {})
    setProgram(p)
    setMode('tracker')
    showToast(t.programSaved)
  }

  const handleDeleteProgram = async () => {
    if (!user?.uid) return
    await deleteProgramService(user.uid).catch(() => {})
    setProgram(null)
    setMode('tracker')
  }

  // ── Render ───────────────────────────────────────────────────────────
  return (
    <div className="px-5 pt-14 pb-8 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-[26px] font-bold tracking-tight">{t.title}</h1>
          <p className="text-zinc-400 text-sm mt-1">{t.subtitle}</p>
        </div>

        {/* Loading */}
        {programLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="text-zinc-500 animate-spin" />
          </div>
        )}

        {/* No program */}
        {!programLoading && !program && mode === 'tracker' && (
          <NoProgramView t={t} onCreateCustom={handleCreateCustom} onUseMakrofy={handleUseMakrofy} />
        )}

        {/* Program editor */}
        {!programLoading && program && mode === 'editor' && (
          <ProgramEditorView
            program={program}
            t={t}
            onSave={handleSaveProgram}
            onBack={() => setMode('tracker')}
            onDelete={handleDeleteProgram}
          />
        )}

        {/* Weekly log (has program, tracker mode) */}
        {!programLoading && program && mode === 'tracker' && user?.uid && (
          <WeeklyLogView
            program={program}
            t={t}
            userId={user.uid}
            onEditProgram={() => { haptics.impactLight(); setMode('editor') }}
            showToast={showToast}
          />
        )}
      </motion.div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-sm px-4 py-2 rounded-full shadow-lg z-50"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
