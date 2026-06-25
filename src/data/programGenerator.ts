// ─── Kişiye Özel Antrenman Programı Üretici ─────────────────────────────────
// Bir kuvvet & kondisyon antrenörünün (PT) intake mantığıyla çalışır: kullanıcının
// anket cevaplarına göre uygun bölünme (split), hacim, tekrar aralığı ve egzersiz
// seçimini yaparak tamamen kişiye özel bir program üretir.

import type { WorkoutProgram, ProgramDay, ProgramExercise, ProgramGoal, ProgramLevel } from './workoutPrograms'

export type Equipment = 'gym' | 'home' | 'body'
export type Injury = 'none' | 'knee' | 'back' | 'shoulder' | 'wrist' | 'hip'
export type BodyFocus = 'balanced' | 'upper' | 'lower'
export type CardioPreference = 'none' | 'light' | 'hiit'
export type Intensity = 'moderate' | 'high' | 'max'

export interface SurveyAnswers {
  goal: ProgramGoal
  experience: ProgramLevel
  days: 2 | 3 | 4 | 5 | 6
  equipment: Equipment
  minutes: 30 | 45 | 60 | 90
  injury: Injury
  focus: BodyFocus
  cardio: CardioPreference
  intensity: Intensity
  locale?: string
}

type Pattern = 'squat' | 'hinge' | 'lunge' | 'legCurl' | 'calfRaise' |
  'hpush' | 'vpush' | 'hpull' | 'vpull' |
  'arms' | 'biceps' | 'triceps' | 'rearDelt' |
  'core' | 'coreAntiRot' |
  'cardio' | 'liss'

interface LibEntry2 {
  tr: string
  en: string
  equip: Equipment[]
  avoid?: Exclude<Injury, 'none'>[]
}

const LIB2: Record<Pattern, LibEntry2[]> = {
  squat: [
    { tr: 'Barbell Squat', en: 'Barbell Squat', equip: ['gym'], avoid: ['knee'] },
    { tr: 'Goblet Squat', en: 'Goblet Squat', equip: ['gym', 'home'] },
    { tr: 'Leg Press', en: 'Leg Press', equip: ['gym'] },
    { tr: 'Box Squat (kontrollü)', en: 'Box Squat (controlled)', equip: ['gym', 'home', 'body'] },
    { tr: 'Vücut Ağırlığı Squat', en: 'Bodyweight Squat', equip: ['body', 'home'] },
    { tr: 'Front Squat', en: 'Front Squat', equip: ['gym'], avoid: ['wrist'] },
    { tr: 'Hack Squat', en: 'Hack Squat', equip: ['gym'] },
    { tr: 'Smith Machine Squat', en: 'Smith Machine Squat', equip: ['gym'] },
  ],
  hinge: [
    { tr: 'Romanian Deadlift', en: 'Romanian Deadlift', equip: ['gym', 'home'], avoid: ['back'] },
    { tr: 'Hip Thrust', en: 'Hip Thrust', equip: ['gym', 'home'] },
    { tr: 'Dumbbell Deadlift', en: 'Dumbbell Deadlift', equip: ['gym', 'home'], avoid: ['back'] },
    { tr: 'Glute Bridge', en: 'Glute Bridge', equip: ['home', 'body'] },
    { tr: 'Bird Dog (stabilizasyon)', en: 'Bird Dog (stabilisation)', equip: ['body', 'home'] },
    { tr: 'Kettlebell Swing', en: 'Kettlebell Swing', equip: ['gym', 'home'], avoid: ['back'] },
    { tr: 'Single-Leg RDL', en: 'Single-Leg RDL', equip: ['gym', 'home'] },
    { tr: 'Cable Pull-Through', en: 'Cable Pull-Through', equip: ['gym'] },
  ],
  lunge: [
    { tr: 'Reverse Lunge', en: 'Reverse Lunge', equip: ['gym', 'home', 'body'] },
    { tr: 'Walking Lunge', en: 'Walking Lunge', equip: ['gym', 'home', 'body'], avoid: ['knee'] },
    { tr: 'Step-up', en: 'Step-up', equip: ['gym', 'home', 'body'], avoid: ['knee'] },
    { tr: 'Bulgar Split Squat', en: 'Bulgarian Split Squat', equip: ['gym', 'home'], avoid: ['knee'] },
    { tr: 'Lateral Lunge', en: 'Lateral Lunge', equip: ['gym', 'home', 'body'], avoid: ['hip'] },
  ],
  legCurl: [
    { tr: 'Lying Leg Curl', en: 'Lying Leg Curl', equip: ['gym'] },
    { tr: 'Nordic Curl', en: 'Nordic Curl', equip: ['gym', 'home', 'body'], avoid: ['knee'] },
    { tr: 'Slider Leg Curl', en: 'Slider Leg Curl', equip: ['home', 'body'] },
    { tr: 'Swiss Ball Leg Curl', en: 'Swiss Ball Leg Curl', equip: ['gym', 'home'] },
  ],
  calfRaise: [
    { tr: 'Standing Calf Raise', en: 'Standing Calf Raise', equip: ['gym', 'home', 'body'] },
    { tr: 'Seated Calf Raise', en: 'Seated Calf Raise', equip: ['gym'] },
    { tr: 'Single-Leg Calf Raise', en: 'Single-Leg Calf Raise', equip: ['home', 'body'] },
  ],
  hpush: [
    { tr: 'Bench Press', en: 'Bench Press', equip: ['gym'], avoid: ['wrist'] },
    { tr: 'Incline Dumbbell Press', en: 'Incline Dumbbell Press', equip: ['gym', 'home'] },
    { tr: 'Dumbbell Bench Press', en: 'Dumbbell Bench Press', equip: ['gym', 'home'] },
    { tr: 'Şınav (Push-up)', en: 'Push-up', equip: ['body', 'home', 'gym'], avoid: ['wrist'] },
    { tr: 'Cable Chest Fly', en: 'Cable Chest Fly', equip: ['gym'] },
    { tr: 'Dumbbell Fly', en: 'Dumbbell Fly', equip: ['gym', 'home'] },
    { tr: 'Decline Push-up', en: 'Decline Push-up', equip: ['body', 'home'] },
  ],
  vpush: [
    { tr: 'Overhead Press', en: 'Overhead Press', equip: ['gym'], avoid: ['shoulder', 'wrist'] },
    { tr: 'Dumbbell Shoulder Press', en: 'Dumbbell Shoulder Press', equip: ['gym', 'home'], avoid: ['shoulder'] },
    { tr: 'Landmine Press (omuz dostu)', en: 'Landmine Press (shoulder-friendly)', equip: ['gym'] },
    { tr: 'Lateral Raise', en: 'Lateral Raise', equip: ['gym', 'home'] },
    { tr: 'Pike Push-up', en: 'Pike Push-up', equip: ['body', 'home'], avoid: ['shoulder', 'wrist'] },
    { tr: 'Arnold Press', en: 'Arnold Press', equip: ['gym', 'home'], avoid: ['shoulder'] },
    { tr: 'Cable Lateral Raise', en: 'Cable Lateral Raise', equip: ['gym'] },
    { tr: 'Face Pull', en: 'Face Pull', equip: ['gym'] },
  ],
  hpull: [
    { tr: 'Chest-Supported Row', en: 'Chest-Supported Row', equip: ['gym'] },
    { tr: 'Dumbbell Row', en: 'Dumbbell Row', equip: ['gym', 'home'] },
    { tr: 'Barbell Row', en: 'Barbell Row', equip: ['gym'], avoid: ['back'] },
    { tr: 'Ters Row (Inverted Row)', en: 'Inverted Row', equip: ['body', 'home', 'gym'] },
    { tr: 'Direnç Bandı Row', en: 'Resistance Band Row', equip: ['home', 'body'] },
    { tr: 'Seated Cable Row', en: 'Seated Cable Row', equip: ['gym'] },
    { tr: 'T-Bar Row', en: 'T-Bar Row', equip: ['gym'], avoid: ['back'] },
    { tr: 'Meadows Row', en: 'Meadows Row', equip: ['gym'] },
  ],
  vpull: [
    { tr: 'Lat Pulldown', en: 'Lat Pulldown', equip: ['gym'] },
    { tr: 'Barfiks (Pull-up)', en: 'Pull-up', equip: ['gym', 'home'] },
    { tr: 'Direnç Bandı Lat Çekiş', en: 'Resistance Band Lat Pull', equip: ['home', 'body'] },
    { tr: 'Chin-up', en: 'Chin-up', equip: ['gym', 'home'] },
    { tr: 'Straight-Arm Pulldown', en: 'Straight-Arm Pulldown', equip: ['gym'] },
    { tr: 'Negatif Barfiks', en: 'Negative Pull-up', equip: ['gym', 'home'] },
  ],
  arms: [
    { tr: 'Dumbbell Curl', en: 'Dumbbell Curl', equip: ['gym', 'home'] },
    { tr: 'Triceps Pushdown', en: 'Triceps Pushdown', equip: ['gym'] },
    { tr: 'Bench Dips', en: 'Bench Dips', equip: ['home', 'body', 'gym'], avoid: ['shoulder', 'wrist'] },
    { tr: 'Bant Curl', en: 'Band Curl', equip: ['home', 'body'] },
    { tr: 'Hammer Curl', en: 'Hammer Curl', equip: ['gym', 'home'] },
  ],
  biceps: [
    { tr: 'Barbell Curl', en: 'Barbell Curl', equip: ['gym'], avoid: ['wrist'] },
    { tr: 'Incline Dumbbell Curl', en: 'Incline Dumbbell Curl', equip: ['gym', 'home'] },
    { tr: 'Concentration Curl', en: 'Concentration Curl', equip: ['gym', 'home'] },
    { tr: 'Cable Curl', en: 'Cable Curl', equip: ['gym'] },
    { tr: 'Hammer Curl', en: 'Hammer Curl', equip: ['gym', 'home'] },
    { tr: 'Bant Curl', en: 'Band Curl', equip: ['home', 'body'] },
  ],
  triceps: [
    { tr: 'Triceps Pushdown', en: 'Triceps Pushdown', equip: ['gym'] },
    { tr: 'Overhead Triceps Extension', en: 'Overhead Triceps Extension', equip: ['gym', 'home'] },
    { tr: 'Close-Grip Push-up', en: 'Close-Grip Push-up', equip: ['body', 'home'], avoid: ['wrist'] },
    { tr: 'Skull Crusher', en: 'Skull Crusher', equip: ['gym'], avoid: ['wrist'] },
    { tr: 'Diamond Push-up', en: 'Diamond Push-up', equip: ['body', 'home'], avoid: ['wrist'] },
    { tr: 'Kickback', en: 'Kickback', equip: ['gym', 'home'] },
  ],
  rearDelt: [
    { tr: 'Face Pull', en: 'Face Pull', equip: ['gym'] },
    { tr: 'Reverse Fly', en: 'Reverse Fly', equip: ['gym', 'home'] },
    { tr: 'Band Pull-Apart', en: 'Band Pull-Apart', equip: ['home', 'body'] },
    { tr: 'Prone Y Raise', en: 'Prone Y Raise', equip: ['home', 'body', 'gym'] },
  ],
  core: [
    { tr: 'Plank', en: 'Plank', equip: ['gym', 'home', 'body'] },
    { tr: 'Dead Bug (bel dostu)', en: 'Dead Bug (back-friendly)', equip: ['gym', 'home', 'body'] },
    { tr: 'Bacak Kaldırma', en: 'Leg Raise', equip: ['gym', 'home', 'body'] },
    { tr: 'Side Plank', en: 'Side Plank', equip: ['gym', 'home', 'body'] },
    { tr: 'Bisiklet Crunch', en: 'Bicycle Crunch', equip: ['gym', 'home', 'body'] },
    { tr: 'Ab Wheel Rollout', en: 'Ab Wheel Rollout', equip: ['gym', 'home'], avoid: ['back'] },
    { tr: 'Hanging Knee Raise', en: 'Hanging Knee Raise', equip: ['gym'] },
  ],
  coreAntiRot: [
    { tr: 'Pallof Press', en: 'Pallof Press', equip: ['gym'] },
    { tr: 'Suitcase Carry', en: 'Suitcase Carry', equip: ['gym', 'home'] },
    { tr: 'Bird Dog', en: 'Bird Dog', equip: ['body', 'home', 'gym'] },
    { tr: 'Single-Arm Farmer Walk', en: 'Single-Arm Farmer Walk', equip: ['gym', 'home'] },
  ],
  cardio: [
    { tr: 'HIIT İnterval (30 sn hızlı / 60 sn yavaş)', en: 'HIIT Interval (30s fast / 60s easy)', equip: ['gym', 'home', 'body'] },
    { tr: 'Burpee Devresi', en: 'Burpee Circuit', equip: ['home', 'body', 'gym'], avoid: ['knee', 'wrist'] },
    { tr: 'Battle Rope Tabata', en: 'Battle Rope Tabata', equip: ['gym'] },
    { tr: 'Rowing HIIT', en: 'Rowing HIIT', equip: ['gym'] },
    { tr: 'Mountain Climber Devresi', en: 'Mountain Climber Circuit', equip: ['home', 'body', 'gym'], avoid: ['wrist'] },
    { tr: 'Jump Squat Devresi', en: 'Jump Squat Circuit', equip: ['home', 'body', 'gym'], avoid: ['knee', 'hip'] },
  ],
  liss: [
    { tr: 'Tempolu Yürüyüş (6 km/h)', en: 'Brisk Walk (6 km/h)', equip: ['gym', 'home', 'body'] },
    { tr: 'Bisiklet (düşük tempo)', en: 'Cycling (low tempo)', equip: ['gym', 'home', 'body'] },
    { tr: 'Eliptik (orta tempo)', en: 'Elliptical (moderate)', equip: ['gym'] },
    { tr: 'İncline Yürüyüş', en: 'Incline Walk', equip: ['gym'] },
  ],
}


function pick(pattern: Pattern, eq: Equipment, injury: Injury, variant = 0, isEN = false): string {
  const lib = LIB2[pattern]
  const pool = lib.filter(
    (e) => e.equip.includes(eq) && (injury === 'none' || !e.avoid?.includes(injury))
  )
  const safe = pool.length > 0 ? pool : lib.filter((e) => e.equip.includes('body'))
  const final = safe.length > 0 ? safe : lib
  const entry = final[variant % final.length]
  return isEN ? entry.en : entry.tr
}

// ─── Hacim / tekrar / dinlenme şeması ───────────────────────────────────────

function setsFor(exp: ProgramLevel, intensity: Intensity): string {
  const base = (exp === 'Başlangıç' || exp === 'Beginner') ? 3
    : (exp === 'Orta' || exp === 'Intermediate') ? 3
    : 4
  if (intensity === 'max') return `${base + 1}`
  if (intensity === 'moderate') return `${base}`
  return `${base}-${base + 1}`
}

interface Scheme {
  compoundReps: string
  accessoryReps: string
  rest: string
  tempo?: string
}

function schemeFor(goal: ProgramGoal, intensity: Intensity, isEN: boolean): Scheme {
  const s = isEN ? 'sec' : 'sn'
  if (goal === 'lose') {
    if (intensity === 'max') return { compoundReps: '8-10', accessoryReps: '12-15', rest: `30-45 ${s}`, tempo: '2-0-1' }
    if (intensity === 'high') return { compoundReps: '10-12', accessoryReps: '12-15', rest: `45-60 ${s}` }
    return { compoundReps: '10-12', accessoryReps: '15-20', rest: `60 ${s}` }
  }
  if (goal === 'gain') {
    if (intensity === 'max') return { compoundReps: '4-6', accessoryReps: '6-10', rest: `120-180 ${s}`, tempo: '4-1-1' }
    if (intensity === 'high') return { compoundReps: '6-8', accessoryReps: '8-12', rest: `90-120 ${s}`, tempo: '3-1-1' }
    return { compoundReps: '8-10', accessoryReps: '10-12', rest: `90 ${s}`, tempo: '3-1-1' }
  }
  // maintain
  if (intensity === 'max') return { compoundReps: '5-8', accessoryReps: '8-10', rest: `90-120 ${s}`, tempo: '3-1-1' }
  if (intensity === 'high') return { compoundReps: '6-8', accessoryReps: '10-12', rest: `90 ${s}` }
  return { compoundReps: '8-10', accessoryReps: '10-12', rest: `60-90 ${s}` }
}

function exercisesPerDay(minutes: number): number {
  if (minutes <= 30) return 4
  if (minutes <= 45) return 5
  if (minutes <= 60) return 6
  return 8 // 90 min
}

// ─── Gün şablonları ────────────────────────────────────────────────────────

type Slot = { pattern: Pattern; compound?: boolean }

const TEMPLATES: Record<string, Slot[]> = {
  fullA: [
    { pattern: 'squat', compound: true },
    { pattern: 'hpush', compound: true },
    { pattern: 'hpull', compound: true },
    { pattern: 'vpush' },
    { pattern: 'lunge' },
    { pattern: 'core' },
    { pattern: 'coreAntiRot' },
    { pattern: 'cardio' },
  ],
  fullB: [
    { pattern: 'hinge', compound: true },
    { pattern: 'vpull', compound: true },
    { pattern: 'hpush', compound: true },
    { pattern: 'hpull' },
    { pattern: 'arms' },
    { pattern: 'core' },
    { pattern: 'coreAntiRot' },
    { pattern: 'liss' },
  ],
  fullC: [
    { pattern: 'squat', compound: true },
    { pattern: 'vpush', compound: true },
    { pattern: 'vpull', compound: true },
    { pattern: 'lunge' },
    { pattern: 'rearDelt' },
    { pattern: 'core' },
    { pattern: 'cardio' },
    { pattern: 'calfRaise' },
  ],
  upper: [
    { pattern: 'hpush', compound: true },
    { pattern: 'hpull', compound: true },
    { pattern: 'vpush' },
    { pattern: 'vpull' },
    { pattern: 'biceps' },
    { pattern: 'triceps' },
    { pattern: 'rearDelt' },
    { pattern: 'core' },
  ],
  upperStrength: [
    { pattern: 'hpush', compound: true },
    { pattern: 'vpull', compound: true },
    { pattern: 'vpush', compound: true },
    { pattern: 'hpull', compound: true },
    { pattern: 'arms' },
    { pattern: 'rearDelt' },
    { pattern: 'core' },
    { pattern: 'coreAntiRot' },
  ],
  lower: [
    { pattern: 'squat', compound: true },
    { pattern: 'hinge', compound: true },
    { pattern: 'lunge' },
    { pattern: 'legCurl' },
    { pattern: 'calfRaise' },
    { pattern: 'core' },
    { pattern: 'coreAntiRot' },
    { pattern: 'liss' },
  ],
  lowerStrength: [
    { pattern: 'squat', compound: true },
    { pattern: 'hinge', compound: true },
    { pattern: 'lunge', compound: true },
    { pattern: 'legCurl' },
    { pattern: 'calfRaise' },
    { pattern: 'core' },
    { pattern: 'coreAntiRot' },
    { pattern: 'cardio' },
  ],
  push: [
    { pattern: 'hpush', compound: true },
    { pattern: 'vpush', compound: true },
    { pattern: 'hpush' },
    { pattern: 'vpush' },
    { pattern: 'triceps' },
    { pattern: 'core' },
    { pattern: 'rearDelt' },
    { pattern: 'cardio' },
  ],
  pull: [
    { pattern: 'hpull', compound: true },
    { pattern: 'vpull', compound: true },
    { pattern: 'hpull' },
    { pattern: 'rearDelt' },
    { pattern: 'biceps' },
    { pattern: 'core' },
    { pattern: 'coreAntiRot' },
    { pattern: 'liss' },
  ],
  legs: [
    { pattern: 'squat', compound: true },
    { pattern: 'hinge', compound: true },
    { pattern: 'lunge' },
    { pattern: 'legCurl' },
    { pattern: 'calfRaise' },
    { pattern: 'core' },
    { pattern: 'coreAntiRot' },
    { pattern: 'cardio' },
  ],
  // 6-day PPL variant B days
  pushB: [
    { pattern: 'vpush', compound: true },
    { pattern: 'hpush', compound: true },
    { pattern: 'hpush' },
    { pattern: 'vpush' },
    { pattern: 'triceps' },
    { pattern: 'rearDelt' },
    { pattern: 'core' },
    { pattern: 'liss' },
  ],
  pullB: [
    { pattern: 'vpull', compound: true },
    { pattern: 'hpull', compound: true },
    { pattern: 'hpull' },
    { pattern: 'vpull' },
    { pattern: 'biceps' },
    { pattern: 'rearDelt' },
    { pattern: 'coreAntiRot' },
    { pattern: 'cardio' },
  ],
  legsB: [
    { pattern: 'hinge', compound: true },
    { pattern: 'squat', compound: true },
    { pattern: 'lunge' },
    { pattern: 'legCurl' },
    { pattern: 'calfRaise' },
    { pattern: 'core' },
    { pattern: 'coreAntiRot' },
    { pattern: 'liss' },
  ],
}

interface DayPlan {
  title: string
  focus: string
  template: keyof typeof TEMPLATES
}

function buildSplit(days: number, focus: BodyFocus, isEN: boolean): { split: string; dayPlans: DayPlan[]; schedule: string[] } {
  if (days <= 3) {
    const labels = isEN
      ? (days === 2 ? ['Mon', 'Thu'] : ['Mon', 'Wed', 'Fri'])
      : (days === 2 ? ['Pzt', 'Per'] : ['Pzt', 'Çar', 'Cum'])
    const tmpl: (keyof typeof TEMPLATES)[] = ['fullA', 'fullB', 'fullC']
    const wLabel = isEN ? 'Workout' : 'Antrenman'
    const fbLabel = isEN ? 'Full Body' : 'Tüm Vücut'
    const dayPlans: DayPlan[] = Array.from({ length: days }, (_, i) => ({
      title: `${wLabel} ${String.fromCharCode(65 + i)}`,
      focus: fbLabel,
      template: tmpl[i],
    }))
    return {
      split: `${fbLabel} ×${days}`,
      dayPlans,
      schedule: labels.map((l, i) => `${l} · ${wLabel} ${String.fromCharCode(65 + i)}`),
    }
  }
  if (days === 4) {
    const labels = isEN ? ['Mon', 'Tue', 'Thu', 'Fri'] : ['Pzt', 'Sal', 'Per', 'Cum']
    // Focus affects which template to use for upper/lower
    const upperTmpl = focus === 'upper' ? 'upperStrength' : 'upper'
    const lowerTmpl = focus === 'lower' ? 'lowerStrength' : 'lower'
    const order = isEN
      ? [
          { t: upperTmpl, n: 'Upper Body A', f: 'Chest · Back · Shoulders · Arms' },
          { t: lowerTmpl, n: 'Lower Body A', f: 'Legs · Glutes · Core' },
          { t: upperTmpl === 'upper' ? 'upperStrength' : 'upper', n: 'Upper Body B', f: 'Chest · Back · Shoulders · Arms' },
          { t: lowerTmpl === 'lower' ? 'lowerStrength' : 'lower', n: 'Lower Body B', f: 'Legs · Glutes · Core' },
        ]
      : [
          { t: upperTmpl, n: 'Üst Vücut A', f: 'Göğüs · Sırt · Omuz · Kol' },
          { t: lowerTmpl, n: 'Alt Vücut A', f: 'Bacak · Kalça · Core' },
          { t: upperTmpl === 'upper' ? 'upperStrength' : 'upper', n: 'Üst Vücut B', f: 'Göğüs · Sırt · Omuz · Kol' },
          { t: lowerTmpl === 'lower' ? 'lowerStrength' : 'lower', n: 'Alt Vücut B', f: 'Bacak · Kalça · Core' },
        ]
    return {
      split: isEN ? 'Upper / Lower ×2' : 'Üst / Alt ×2',
      dayPlans: order.map((o) => ({ title: o.n, focus: o.f, template: o.t as keyof typeof TEMPLATES })),
      schedule: labels.map((l, i) => `${l} · ${order[i].n}`),
    }
  }
  if (days === 5) {
    const labels = isEN ? ['Mon', 'Tue', 'Wed', 'Fri', 'Sat'] : ['Pzt', 'Sal', 'Çar', 'Cum', 'Cmt']
    const order = isEN
      ? [
          { t: 'push' as const, n: 'Push', f: 'Chest · Shoulders · Triceps' },
          { t: 'pull' as const, n: 'Pull', f: 'Back · Biceps' },
          { t: 'legs' as const, n: 'Legs', f: 'Quads · Hamstrings · Glutes' },
          { t: (focus === 'upper' ? 'upperStrength' : 'push') as keyof typeof TEMPLATES, n: focus === 'upper' ? 'Upper Strength' : 'Push B', f: focus === 'upper' ? 'Chest · Back · Shoulders' : 'Chest · Shoulders · Triceps' },
          { t: (focus === 'lower' ? 'lowerStrength' : 'pull') as keyof typeof TEMPLATES, n: focus === 'lower' ? 'Leg Strength' : 'Pull B', f: focus === 'lower' ? 'Quads · Hamstrings · Glutes' : 'Back · Biceps' },
        ]
      : [
          { t: 'push' as const, n: 'İtiş (Push)', f: 'Göğüs · Omuz · Triceps' },
          { t: 'pull' as const, n: 'Çekiş (Pull)', f: 'Sırt · Biceps' },
          { t: 'legs' as const, n: 'Bacak (Legs)', f: 'Quad · Hamstring · Kalça' },
          { t: (focus === 'upper' ? 'upperStrength' : 'push') as keyof typeof TEMPLATES, n: focus === 'upper' ? 'Üst Güç' : 'İtiş B', f: focus === 'upper' ? 'Göğüs · Sırt · Omuz' : 'Göğüs · Omuz · Triceps' },
          { t: (focus === 'lower' ? 'lowerStrength' : 'pull') as keyof typeof TEMPLATES, n: focus === 'lower' ? 'Bacak Güç' : 'Çekiş B', f: focus === 'lower' ? 'Quad · Hamstring · Kalça' : 'Sırt · Biceps' },
        ]
    return {
      split: isEN ? 'Push / Pull / Legs + Focus' : 'İtiş / Çekiş / Bacak + Odak',
      dayPlans: order.map((o) => ({ title: o.n, focus: o.f, template: o.t as keyof typeof TEMPLATES })),
      schedule: labels.map((l, i) => `${l} · ${order[i].n}`),
    }
  }
  // 6 days — PPL A/B
  const labels = isEN ? ['Mon', 'Tue', 'Wed', 'Fri', 'Sat', 'Sun'] : ['Pzt', 'Sal', 'Çar', 'Cum', 'Cmt', 'Paz']
  const order = isEN
    ? [
        { t: 'push' as const, n: 'Push A', f: 'Chest · Shoulders · Triceps' },
        { t: 'pull' as const, n: 'Pull A', f: 'Back · Biceps · Rear Delts' },
        { t: 'legs' as const, n: 'Legs A', f: 'Quads · Hamstrings · Glutes' },
        { t: 'pushB' as const, n: 'Push B', f: 'Shoulders · Chest · Triceps' },
        { t: 'pullB' as const, n: 'Pull B', f: 'Back · Biceps · Rear Delts' },
        { t: 'legsB' as const, n: 'Legs B', f: 'Hamstrings · Quads · Calves' },
      ]
    : [
        { t: 'push' as const, n: 'İtiş A', f: 'Göğüs · Omuz · Triceps' },
        { t: 'pull' as const, n: 'Çekiş A', f: 'Sırt · Biceps · Arka Omuz' },
        { t: 'legs' as const, n: 'Bacak A', f: 'Quad · Hamstring · Kalça' },
        { t: 'pushB' as const, n: 'İtiş B', f: 'Omuz · Göğüs · Triceps' },
        { t: 'pullB' as const, n: 'Çekiş B', f: 'Sırt · Biceps · Arka Omuz' },
        { t: 'legsB' as const, n: 'Bacak B', f: 'Hamstring · Quad · Baldır' },
      ]
  return {
    split: isEN ? 'Push / Pull / Legs ×2' : 'İtiş / Çekiş / Bacak ×2',
    dayPlans: order.map((o) => ({ title: o.n, focus: o.f, template: o.t as keyof typeof TEMPLATES })),
    schedule: labels.map((l, i) => `${l} · ${order[i].n}`),
  }
}

const GOAL_NAME: Record<string, Record<ProgramGoal, string>> = {
  tr: { lose: 'Yağ Yakım', gain: 'Kas Kazanım', maintain: 'Form & Güç' },
  en: { lose: 'Fat Loss', gain: 'Muscle Gain', maintain: 'Fitness & Strength' },
}

const EQUIP_NAME: Record<string, Record<Equipment, string>> = {
  tr: { gym: 'Spor salonu', home: 'Ev (dambıl & bant)', body: 'Vücut ağırlığı' },
  en: { gym: 'Gym', home: 'Home (dumbbells & bands)', body: 'Bodyweight' },
}

const INJURY_NOTE: Record<string, Record<Exclude<Injury, 'none'>, string>> = {
  tr: {
    knee: 'Diz dostu seçimler yapıldı: derin/sıçramalı hareketler yerine kontrollü varyasyonlar.',
    back: 'Bel dostu seçimler yapıldı: ağır serbest çekişler yerine destekli/stabilizasyon hareketleri.',
    shoulder: 'Omuz dostu seçimler yapıldı: tepe baş üstü ve dips yerine nötr açılı hareketler.',
    wrist: 'Bilek dostu seçimler yapıldı: ağır kavrama gerektiren hareketler yerine nötr tutuş varyasyonları.',
    hip: 'Kalça dostu seçimler yapıldı: geniş açılı hareketler yerine düz düzlem varyasyonları.',
  },
  en: {
    knee: 'Knee-friendly selections: controlled variations instead of deep/jumping movements.',
    back: 'Lower-back-friendly selections: supported/stabilisation moves instead of heavy free pulls.',
    shoulder: 'Shoulder-friendly selections: neutral-angle movements instead of overhead presses and dips.',
    wrist: 'Wrist-friendly selections: neutral grip variations instead of heavy barbell movements.',
    hip: 'Hip-friendly selections: straight-plane variations instead of wide-angle movements.',
  },
}

const FOCUS_NAME: Record<string, Record<BodyFocus, string>> = {
  tr: { balanced: 'Dengeli', upper: 'Üst vücut odaklı', lower: 'Alt vücut odaklı' },
  en: { balanced: 'Balanced', upper: 'Upper body focus', lower: 'Lower body focus' },
}

// ─── Ana üretici ────────────────────────────────────────────────────────────

export function generateProgram(a: SurveyAnswers): WorkoutProgram {
  const isEN = a.locale !== 'tr'
  const lang = isEN ? 'en' : 'tr'
  const { split, dayPlans, schedule } = buildSplit(a.days, a.focus ?? 'balanced', isEN)
  const scheme = schemeFor(a.goal, a.intensity ?? 'high', isEN)
  const sets = setsFor(a.experience, a.intensity ?? 'high')
  const cap = exercisesPerDay(a.minutes)
  const s = isEN ? 'sec' : 'sn'
  const cardioPreference = a.cardio ?? 'none'

  const days: ProgramDay[] = dayPlans.map((dp, di) => {
    let slots = TEMPLATES[dp.template].slice(0, cap)

    // Filter out cardio slots if user doesn't want cardio
    if (cardioPreference === 'none') {
      slots = slots.filter(sl => sl.pattern !== 'cardio' && sl.pattern !== 'liss')
    }
    // Replace HIIT with LISS if user prefers light cardio
    if (cardioPreference === 'light') {
      slots = slots.map(sl => sl.pattern === 'cardio' ? { ...sl, pattern: 'liss' as Pattern } : sl)
    }

    const exercises: ProgramExercise[] = slots.map((slot, si) => {
      const name = pick(slot.pattern, a.equipment, a.injury, di + si, isEN)
      const isCompound = !!slot.compound
      const isCardioSlot = slot.pattern === 'cardio' || slot.pattern === 'liss'
      const isCoreSlot = slot.pattern === 'core' || slot.pattern === 'coreAntiRot'

      const reps = isCardioSlot
        ? (slot.pattern === 'cardio'
          ? (a.minutes <= 30 ? (isEN ? '6 min' : '6 dk') : a.minutes <= 45 ? (isEN ? '8 min' : '8 dk') : (isEN ? '12 min' : '12 dk'))
          : (a.minutes <= 30 ? (isEN ? '10 min' : '10 dk') : (isEN ? '15 min' : '15 dk')))
        : isCoreSlot ? `30-45 ${s}`
        : isCompound ? scheme.compoundReps : scheme.accessoryReps

      const rest = isCardioSlot ? '—' : isCoreSlot ? `45 ${s}` : scheme.rest

      const ex: ProgramExercise = { name, sets: isCardioSlot ? '1' : sets, reps, rest }
      if (isCompound && scheme.tempo) ex.tempo = scheme.tempo
      if (isCompound && !isCardioSlot) ex.note = isEN
        ? 'Heavy but maintain form; last set RPE 8 (2 reps in reserve).'
        : 'Ağır ama formu koruyarak; son set RPE 8 (2 tekrar yedek).'
      if (isCardioSlot) ex.note = isEN
        ? (slot.pattern === 'cardio' ? 'End-of-session metabolic finisher.' : 'Low-intensity steady-state for recovery.')
        : (slot.pattern === 'cardio' ? 'Antrenman sonu metabolik bitirici.' : 'Düşük yoğunluklu kardiyo, toparlanma için.')
      return ex
    })

    // If goal is lose and no cardio slot exists, add one at the end
    if (a.goal === 'lose' && cardioPreference !== 'none' && !exercises.some(e => e.rest === '—')) {
      const cardioPattern: Pattern = cardioPreference === 'hiit' ? 'cardio' : 'liss'
      exercises.push({
        name: pick(cardioPattern, a.equipment, a.injury, di, isEN),
        sets: '1',
        reps: a.minutes <= 30 ? (isEN ? '6 min' : '6 dk') : (isEN ? '10 min' : '10 dk'),
        rest: '—',
        note: isEN ? 'End-of-session metabolic finisher.' : 'Antrenman sonu metabolik bitirici.',
      })
    }

    return { title: dp.title, focus: dp.focus, exercises }
  })

  const goalLabel = GOAL_NAME[lang][a.goal]
  const level: ProgramLevel = a.experience
  const focusLabel = FOCUS_NAME[lang][a.focus ?? 'balanced']

  const description = isEN
    ? `Custom-built for ${a.days} days/week, ${EQUIP_NAME[lang][a.equipment].toLowerCase()}, ${a.minutes}-minute sessions (${focusLabel.toLowerCase()}). ` +
      (a.goal === 'lose'
        ? 'Strength + metabolic cardio combination to accelerate fat loss while preserving muscle mass.'
        : a.goal === 'gain'
          ? 'A volume-focused split with progressive overload for muscle growth.'
          : 'A balanced, sustainable approach to maintain strength and fitness.')
    : `${a.days} günlük, ${EQUIP_NAME[lang][a.equipment].toLowerCase()} ile ${a.minutes} dk seans (${focusLabel.toLowerCase()}). ` +
      (a.goal === 'lose'
        ? 'Kas kütlesini korurken yağ yakımını hızlandırmak için kuvvet + metabolik kardiyo.'
        : a.goal === 'gain'
          ? 'Kas büyümesi için yeterli hacim ve progresif yükleme odaklı bölünme.'
          : 'Gücü ve formu korumak için dengeli, sürdürülebilir yaklaşım.')

  const isBeginner = a.experience === 'Başlangıç' || a.experience === 'Beginner'

  const progression: string[] = isEN
    ? [
        'Weeks 1–2: learn the movements, pick weights at RPE 7 (keep 2–3 reps in reserve).',
        isBeginner
          ? 'Each week, add 1–2 reps or a small weight on one exercise (double progression).'
          : 'Once you hit the top of the rep range, increase weight by 2.5–5% and drop to the bottom.',
        a.goal === 'gain' ? 'Every 4 weeks, deload: drop volume by 40% and recover.' : 'If you get bored, swap exercises for similar variations.',
        'Log your progress — you can\'t manage what you don\'t measure.',
      ]
    : [
        '1-2. hafta: hareketleri öğren, ağırlığı RPE 7 ile seç (2-3 tekrar yedek kalsın).',
        isBeginner
          ? 'Her hafta bir egzersizde ya 1-2 tekrar ya da küçük ağırlık ekle (çift ilerleme).'
          : 'Tekrar aralığının üstüne ulaşınca ağırlığı %2.5-5 artır, alt sınıra dön.',
        a.goal === 'gain' ? '4 haftada bir deload: hacmi %40 düşürüp toparlan.' : 'Sıkıldığında hareketleri benzerleriyle değiştir.',
        'İlerlemeni not al; ölçmediğini yönetemezsin.',
      ]

  const coachTips: string[] = isEN
    ? [
        a.goal === 'lose'
          ? 'Keep protein high in a deficit (2.0–2.4 g/kg) — this prevents muscle loss.'
          : a.goal === 'gain'
            ? 'For muscle: 1.8–2.2 g/kg protein and a controlled +250–400 kcal surplus.'
            : 'For maintenance: calorie balance (TDEE) and 1.6–2.0 g/kg protein is sufficient.',
        'At least 1 full rest day per week; sleep 7–8 hours.',
        'Do compound lifts first, isolation exercises last.',
        a.intensity === 'max' ? 'High intensity demands extra recovery — never skip sleep or nutrition.' : '',
        a.focus === 'upper' ? 'Upper focus means extra volume above the waist — don\'t neglect legs entirely.' : '',
        a.focus === 'lower' ? 'Lower focus adds leg volume — consider deload if knees feel fatigued.' : '',
      ].filter(Boolean)
    : [
        a.goal === 'lose'
          ? 'Kalori açığında protein yüksek tut (2.0-2.4 g/kg) — kas kaybını bu engeller.'
          : a.goal === 'gain'
            ? 'Kas için 1.8-2.2 g/kg protein ve +250-400 kcal kontrollü fazla şart.'
            : 'Korumada kalori dengesi (TDEE) ve 1.6-2.0 g/kg protein yeterli.',
        'Haftada en az 1 tam dinlenme; uyku 7-8 saat.',
        'Bileşik hareketleri başta, izolasyonu sonda yap.',
        a.intensity === 'max' ? 'Yüksek yoğunluk ekstra toparlanma gerektirir — uykuyu ve beslenmeyi asla atlama.' : '',
        a.focus === 'upper' ? 'Üst vücut odağı fazla hacim demek — bacakları tamamen ihmal etme.' : '',
        a.focus === 'lower' ? 'Alt vücut odağı fazla bacak hacmi ekler — dizlerin yorgunsa deload düşün.' : '',
      ].filter(Boolean)
  if (a.injury !== 'none') coachTips.unshift(INJURY_NOTE[lang][a.injury])

  const daysLabel = isEN ? 'Days' : 'Gün'

  return {
    id: 'custom-program',
    name: isEN
      ? `Your Custom · ${goalLabel} (${a.days} ${daysLabel})`
      : `Sana Özel · ${goalLabel} (${a.days} ${daysLabel})`,
    goal: a.goal,
    level,
    daysPerWeek: a.days,
    duration: isEN
      ? (a.goal === 'maintain' ? 'Ongoing (sustainable)' : '8–10 weeks')
      : (a.goal === 'maintain' ? 'Süresiz (sürdürülebilir)' : '8-10 hafta'),
    split,
    description,
    weeklySchedule: [...schedule, isEN ? 'Other days · 8–10k steps' : 'Diğer günler · 8-10 bin adım'],
    warmup: isEN
      ? '5 min light cardio + dynamic stretching (joint rotations, hip openers). Add 1–2 light warm-up sets on the first compound lift.'
      : '5 dk hafif kardiyo + dinamik esneme (eklem rotasyonları, kalça açma). İlk bileşik harekete 1-2 hafif ısınma seti ekle.',
    days,
    progression,
    coachTips,
  }
}
