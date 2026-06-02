// ─── Kişiye Özel Antrenman Programı Üretici ─────────────────────────────────
// Bir kuvvet & kondisyon antrenörünün (PT) intake mantığıyla çalışır: kullanıcının
// anket cevaplarına (hedef, deneyim, gün sayısı, ekipman, süre, sakatlık) göre
// uygun bölünme (split), hacim, tekrar aralığı ve egzersiz seçimini yaparak
// tamamen kişiye özel bir program üretir.

import type { WorkoutProgram, ProgramDay, ProgramExercise, ProgramGoal, ProgramLevel } from './workoutPrograms'

export type Equipment = 'gym' | 'home' | 'body'
export type Injury = 'none' | 'knee' | 'back' | 'shoulder'

export interface SurveyAnswers {
  goal: ProgramGoal
  experience: ProgramLevel
  days: 2 | 3 | 4 | 5
  equipment: Equipment
  minutes: 30 | 45 | 60
  injury: Injury
  locale?: string
}

type Pattern = 'squat' | 'hinge' | 'lunge' | 'hpush' | 'vpush' | 'hpull' | 'vpull' | 'arms' | 'core' | 'cardio'

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
  ],
  hinge: [
    { tr: 'Romanian Deadlift', en: 'Romanian Deadlift', equip: ['gym', 'home'], avoid: ['back'] },
    { tr: 'Hip Thrust', en: 'Hip Thrust', equip: ['gym', 'home'] },
    { tr: 'Dumbbell/Kettlebell Deadlift', en: 'Dumbbell/Kettlebell Deadlift', equip: ['gym', 'home'], avoid: ['back'] },
    { tr: 'Glute Bridge', en: 'Glute Bridge', equip: ['home', 'body'] },
    { tr: 'Bird Dog (stabilizasyon)', en: 'Bird Dog (stabilisation)', equip: ['body', 'home'] },
  ],
  lunge: [
    { tr: 'Reverse Lunge', en: 'Reverse Lunge', equip: ['gym', 'home', 'body'] },
    { tr: 'Walking Lunge', en: 'Walking Lunge', equip: ['gym', 'home', 'body'], avoid: ['knee'] },
    { tr: 'Step-up', en: 'Step-up', equip: ['gym', 'home', 'body'], avoid: ['knee'] },
    { tr: 'Bulgar Split Squat', en: 'Bulgarian Split Squat', equip: ['gym', 'home'], avoid: ['knee'] },
  ],
  hpush: [
    { tr: 'Bench Press', en: 'Bench Press', equip: ['gym'] },
    { tr: 'Incline Dumbbell Press', en: 'Incline Dumbbell Press', equip: ['gym', 'home'] },
    { tr: 'Dumbbell Bench Press', en: 'Dumbbell Bench Press', equip: ['gym', 'home'] },
    { tr: 'Şınav (Push-up)', en: 'Push-up', equip: ['body', 'home', 'gym'] },
  ],
  vpush: [
    { tr: 'Overhead Press', en: 'Overhead Press', equip: ['gym'], avoid: ['shoulder'] },
    { tr: 'Dumbbell Shoulder Press', en: 'Dumbbell Shoulder Press', equip: ['gym', 'home'], avoid: ['shoulder'] },
    { tr: 'Landmine Press (omuz dostu)', en: 'Landmine Press (shoulder-friendly)', equip: ['gym'] },
    { tr: 'Lateral Raise', en: 'Lateral Raise', equip: ['gym', 'home'] },
    { tr: 'Pike Push-up', en: 'Pike Push-up', equip: ['body', 'home'], avoid: ['shoulder'] },
  ],
  hpull: [
    { tr: 'Chest-Supported Row (bel dostu)', en: 'Chest-Supported Row (back-friendly)', equip: ['gym'] },
    { tr: 'Dumbbell Row', en: 'Dumbbell Row', equip: ['gym', 'home'] },
    { tr: 'Barbell Row', en: 'Barbell Row', equip: ['gym'], avoid: ['back'] },
    { tr: 'Ters Row (Inverted Row)', en: 'Inverted Row', equip: ['body', 'home', 'gym'] },
    { tr: 'Direnç Bandı Row', en: 'Resistance Band Row', equip: ['home', 'body'] },
  ],
  vpull: [
    { tr: 'Lat Pulldown', en: 'Lat Pulldown', equip: ['gym'] },
    { tr: 'Barfiks (Pull-up)', en: 'Pull-up', equip: ['gym', 'home'] },
    { tr: 'Direnç Bandı Lat Çekiş', en: 'Resistance Band Lat Pull', equip: ['home', 'body'] },
  ],
  arms: [
    { tr: 'Dumbbell Curl', en: 'Dumbbell Curl', equip: ['gym', 'home'] },
    { tr: 'Triceps Pushdown', en: 'Triceps Pushdown', equip: ['gym'] },
    { tr: 'Bench Dips', en: 'Bench Dips', equip: ['home', 'body', 'gym'], avoid: ['shoulder'] },
    { tr: 'Bant Curl', en: 'Band Curl', equip: ['home', 'body'] },
  ],
  core: [
    { tr: 'Plank', en: 'Plank', equip: ['gym', 'home', 'body'] },
    { tr: 'Dead Bug (bel dostu)', en: 'Dead Bug (back-friendly)', equip: ['gym', 'home', 'body'] },
    { tr: 'Bacak Kaldırma', en: 'Leg Raise', equip: ['gym', 'home', 'body'] },
    { tr: 'Side Plank', en: 'Side Plank', equip: ['gym', 'home', 'body'] },
    { tr: 'Bisiklet Crunch', en: 'Bicycle Crunch', equip: ['gym', 'home', 'body'] },
  ],
  cardio: [
    { tr: 'HIIT İnterval (30 sn hızlı / 60 sn yavaş)', en: 'HIIT Interval (30 sec fast / 60 sec easy)', equip: ['gym', 'home', 'body'] },
    { tr: 'Tempolu Yürüyüş / Bisiklet (LISS)', en: 'Brisk Walk / Bike (LISS)', equip: ['gym', 'home', 'body'] },
    { tr: 'Burpee Devresi', en: 'Burpee Circuit', equip: ['home', 'body', 'gym'], avoid: ['knee'] },
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

function setsFor(exp: ProgramLevel): string {
  return (exp === 'Başlangıç' || exp === 'Beginner') ? '3' : (exp === 'Orta' || exp === 'Intermediate') ? '3-4' : '4'
}

interface Scheme {
  compoundReps: string
  accessoryReps: string
  rest: string
}

function schemeFor(goal: ProgramGoal, isEN: boolean): Scheme {
  const s = isEN ? 'sec' : 'sn'
  if (goal === 'lose') return { compoundReps: '10-12', accessoryReps: '12-15', rest: `45-60 ${s}` }
  if (goal === 'gain') return { compoundReps: '6-8', accessoryReps: '8-12', rest: `90 ${s}` }
  return { compoundReps: '6-8', accessoryReps: '10-12', rest: `90 ${s}` }
}

function exercisesPerDay(minutes: number): number {
  return minutes <= 30 ? 4 : minutes <= 45 ? 5 : 6
}

// ─── Gün şablonları (patern dizileri) ───────────────────────────────────────
// compound = ağır bileşik (ilk sıralar), accessory = yardımcı/izolasyon

type Slot = { pattern: Pattern; compound?: boolean }

const TEMPLATES: Record<string, Slot[]> = {
  fullA: [
    { pattern: 'squat', compound: true },
    { pattern: 'hpush', compound: true },
    { pattern: 'hpull', compound: true },
    { pattern: 'vpush' },
    { pattern: 'lunge' },
    { pattern: 'core' },
  ],
  fullB: [
    { pattern: 'hinge', compound: true },
    { pattern: 'vpull', compound: true },
    { pattern: 'hpush', compound: true },
    { pattern: 'hpull' },
    { pattern: 'arms' },
    { pattern: 'core' },
  ],
  upper: [
    { pattern: 'hpush', compound: true },
    { pattern: 'hpull', compound: true },
    { pattern: 'vpush' },
    { pattern: 'vpull' },
    { pattern: 'arms' },
    { pattern: 'core' },
  ],
  lower: [
    { pattern: 'squat', compound: true },
    { pattern: 'hinge', compound: true },
    { pattern: 'lunge' },
    { pattern: 'hinge' },
    { pattern: 'core' },
    { pattern: 'core' },
  ],
  push: [
    { pattern: 'hpush', compound: true },
    { pattern: 'vpush', compound: true },
    { pattern: 'hpush' },
    { pattern: 'vpush' },
    { pattern: 'arms' },
    { pattern: 'core' },
  ],
  pull: [
    { pattern: 'hpull', compound: true },
    { pattern: 'vpull', compound: true },
    { pattern: 'hpull' },
    { pattern: 'arms' },
    { pattern: 'arms' },
    { pattern: 'core' },
  ],
  legs: [
    { pattern: 'squat', compound: true },
    { pattern: 'hinge', compound: true },
    { pattern: 'lunge' },
    { pattern: 'hinge' },
    { pattern: 'core' },
    { pattern: 'core' },
  ],
}

interface DayPlan {
  title: string
  focus: string
  template: keyof typeof TEMPLATES
}

function buildSplit(days: number, isEN: boolean): { split: string; dayPlans: DayPlan[]; schedule: string[] } {
  if (days <= 3) {
    const labels = isEN
      ? (days === 2 ? ['Mon', 'Thu'] : ['Mon', 'Wed', 'Fri'])
      : (days === 2 ? ['Pzt', 'Per'] : ['Pzt', 'Çar', 'Cum'])
    const tmpl: (keyof typeof TEMPLATES)[] = ['fullA', 'fullB', 'fullA']
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
    const order = isEN
      ? [
          { t: 'upper' as const, n: 'Upper Body', f: 'Chest · Back · Shoulders · Arms' },
          { t: 'lower' as const, n: 'Lower Body', f: 'Legs · Glutes · Core' },
          { t: 'upper' as const, n: 'Upper Body', f: 'Chest · Back · Shoulders · Arms' },
          { t: 'lower' as const, n: 'Lower Body', f: 'Legs · Glutes · Core' },
        ]
      : [
          { t: 'upper' as const, n: 'Üst Vücut', f: 'Göğüs · Sırt · Omuz · Kol' },
          { t: 'lower' as const, n: 'Alt Vücut', f: 'Bacak · Kalça · Core' },
          { t: 'upper' as const, n: 'Üst Vücut', f: 'Göğüs · Sırt · Omuz · Kol' },
          { t: 'lower' as const, n: 'Alt Vücut', f: 'Bacak · Kalça · Core' },
        ]
    return {
      split: isEN ? 'Upper / Lower ×2' : 'Üst / Alt ×2',
      dayPlans: order.map((o) => ({ title: o.n, focus: o.f, template: o.t })),
      schedule: labels.map((l, i) => `${l} · ${order[i].n}`),
    }
  }
  const labels = isEN ? ['Mon', 'Tue', 'Wed', 'Fri', 'Sat'] : ['Pzt', 'Sal', 'Çar', 'Cum', 'Cmt']
  const order = isEN
    ? [
        { t: 'push' as const, n: 'Push', f: 'Chest · Shoulders · Triceps' },
        { t: 'pull' as const, n: 'Pull', f: 'Back · Biceps' },
        { t: 'legs' as const, n: 'Legs', f: 'Quads · Hamstrings · Glutes' },
        { t: 'push' as const, n: 'Push', f: 'Chest · Shoulders · Triceps' },
        { t: 'pull' as const, n: 'Pull', f: 'Back · Biceps' },
      ]
    : [
        { t: 'push' as const, n: 'İtiş (Push)', f: 'Göğüs · Omuz · Triceps' },
        { t: 'pull' as const, n: 'Çekiş (Pull)', f: 'Sırt · Biceps' },
        { t: 'legs' as const, n: 'Bacak (Legs)', f: 'Quad · Hamstring · Kalça' },
        { t: 'push' as const, n: 'İtiş (Push)', f: 'Göğüs · Omuz · Triceps' },
        { t: 'pull' as const, n: 'Çekiş (Pull)', f: 'Sırt · Biceps' },
      ]
  return {
    split: isEN ? 'Push / Pull / Legs' : 'İtiş / Çekiş / Bacak',
    dayPlans: order.map((o) => ({ title: o.n, focus: o.f, template: o.t })),
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
  },
  en: {
    knee: 'Knee-friendly selections: controlled variations instead of deep/jumping movements.',
    back: 'Lower-back-friendly selections: supported/stabilisation moves instead of heavy free pulls.',
    shoulder: 'Shoulder-friendly selections: neutral-angle movements instead of overhead presses and dips.',
  },
}

// ─── Ana üretici ────────────────────────────────────────────────────────────

export function generateProgram(a: SurveyAnswers): WorkoutProgram {
  const isEN = a.locale === 'en'
  const lang = isEN ? 'en' : 'tr'
  const { split, dayPlans, schedule } = buildSplit(a.days, isEN)
  const scheme = schemeFor(a.goal, isEN)
  const sets = setsFor(a.experience)
  const cap = exercisesPerDay(a.minutes)
  const s = isEN ? 'sec' : 'sn'

  const days: ProgramDay[] = dayPlans.map((dp, di) => {
    const slots = TEMPLATES[dp.template].slice(0, cap)
    const exercises: ProgramExercise[] = slots.map((slot, si) => {
      const name = pick(slot.pattern, a.equipment, a.injury, di + si, isEN)
      const isCompound = !!slot.compound
      const reps = isCompound ? scheme.compoundReps : scheme.accessoryReps
      const ex: ProgramExercise = {
        name,
        sets,
        reps: slot.pattern === 'core' ? `30-45 ${s}` : reps,
        rest: slot.pattern === 'core' ? `45 ${s}` : scheme.rest,
      }
      if (isCompound && a.goal !== 'lose') ex.tempo = '3-1-1'
      if (isCompound) ex.note = isEN
        ? 'Heavy but maintain form; last set RPE 8 (2 reps in reserve).'
        : 'Ağır ama formu koruyarak; son set RPE 8 (2 tekrar yedek).'
      return ex
    })

    if (a.goal === 'lose') {
      exercises.push({
        name: pick('cardio', a.equipment, a.injury, di, isEN),
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

  const description = isEN
    ? `Custom-built for ${a.days} days/week, ${EQUIP_NAME[lang][a.equipment].toLowerCase()}, ${a.minutes}-minute sessions. ` +
      (a.goal === 'lose'
        ? 'Strength + metabolic cardio combination to accelerate fat loss while preserving muscle mass.'
        : a.goal === 'gain'
          ? 'A volume-focused split with progressive overload for muscle growth.'
          : 'A balanced, sustainable full-body approach to maintain strength and fitness.')
    : `${a.days} günlük, ${EQUIP_NAME[lang][a.equipment].toLowerCase()} ile ${a.minutes} dakikalık seanslara göre kişiye özel hazırlandı. ` +
      (a.goal === 'lose'
        ? 'Kas kütlesini korurken yağ yakımını hızlandırmak için kuvvet + metabolik kardiyo kombinasyonu.'
        : a.goal === 'gain'
          ? 'Kas büyümesi için yeterli hacim ve progresif yükleme odaklı bölünme.'
          : 'Gücü ve formu korumak için dengeli, sürdürülebilir tüm vücut yaklaşımı.')

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
      ]
    : [
        a.goal === 'lose'
          ? 'Kalori açığında protein yüksek tut (2.0-2.4 g/kg) — kas kaybını bu engeller.'
          : a.goal === 'gain'
            ? 'Kas için 1.8-2.2 g/kg protein ve +250-400 kcal kontrollü fazla şart.'
            : 'Korumada kalori dengesi (TDEE) ve 1.6-2.0 g/kg protein yeterli.',
        'Haftada en az 1 tam dinlenme; uyku 7-8 saat.',
        'Bileşik hareketleri başta, izolasyonu sonda yap.',
      ]
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
