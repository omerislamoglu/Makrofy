// ─── Custom Diet Plan Generator ─────────────────────────────────────────────

export interface DietMeal {
  time: string
  label: string
  foods: string[]
  macros: { cal: number; p: number; c: number; f: number }
}

export interface Diet {
  id: string
  name: string
  goal: 'gain' | 'lose' | 'maintain'
  duration: string
  dailyCalories: string
  description: string
  keyPoints: string[]
  sampleDay: DietMeal[]
  macroSplit: { protein: string; carbs: string; fat: string }
}

export type DietGoal = 'lose' | 'gain' | 'maintain'
export type DietStyle = 'balanced' | 'highProtein' | 'lowCarb'
export type Restriction = 'none' | 'vegetarian' | 'lactoseFree' | 'glutenFree'

export interface DietSurveyAnswers {
  goal: DietGoal
  style: DietStyle
  meals: 3 | 4 | 5
  restriction: Restriction
  locale?: string
}

const STYLE_RATIO: Record<DietStyle, { p: number; c: number; f: number }> = {
  balanced: { p: 0.3, c: 0.4, f: 0.3 },
  highProtein: { p: 0.4, c: 0.3, f: 0.3 },
  lowCarb: { p: 0.35, c: 0.2, f: 0.45 },
}

interface Food {
  tr: string
  en: string
  avoid?: Restriction[]
}

const ANIMAL_PROTEIN: Food[] = [
  { tr: 'Izgara tavuk göğsü', en: 'Grilled chicken breast', avoid: ['vegetarian'] },
  { tr: 'Izgara köfte', en: 'Grilled meatballs', avoid: ['vegetarian'] },
  { tr: 'Fırın somon', en: 'Baked salmon', avoid: ['vegetarian'] },
  { tr: 'Hindi göğüs', en: 'Turkey breast', avoid: ['vegetarian'] },
  { tr: 'Ton balığı (suda)', en: 'Tuna (in water)', avoid: ['vegetarian'] },
]
const VEG_PROTEIN: Food[] = [
  { tr: 'Mercimek', en: 'Lentils' },
  { tr: 'Nohut', en: 'Chickpeas' },
  { tr: 'Tofu', en: 'Tofu' },
  { tr: 'Haşlanmış yumurta', en: 'Boiled eggs' },
]
const DAIRY_PROTEIN: Food[] = [
  { tr: 'Süzme yoğurt', en: 'Greek yogurt', avoid: ['lactoseFree'] },
  { tr: 'Lor peyniri', en: 'Cottage cheese', avoid: ['lactoseFree'] },
  { tr: 'Beyaz peynir', en: 'White cheese', avoid: ['lactoseFree'] },
]
const EGG: Food = { tr: 'Yumurta', en: 'Eggs' }
const CARBS: Food[] = [
  { tr: 'Yulaf ezmesi', en: 'Oatmeal', avoid: ['glutenFree'] },
  { tr: 'Tam buğday ekmek', en: 'Whole wheat bread', avoid: ['glutenFree'] },
  { tr: 'Bulgur pilavı', en: 'Bulgur pilaf', avoid: ['glutenFree'] },
  { tr: 'Pirinç pilavı', en: 'Rice' },
  { tr: 'Kinoa', en: 'Quinoa' },
  { tr: 'Tatlı patates', en: 'Sweet potato' },
  { tr: 'Glutensiz ekmek', en: 'Gluten-free bread' },
]
const VEG: Food[] = [
  { tr: 'Mevsim salata (zeytinyağlı)', en: 'Seasonal salad (with olive oil)' },
  { tr: 'Buharda brokoli', en: 'Steamed broccoli' },
  { tr: 'Izgara sebze', en: 'Grilled vegetables' },
  { tr: 'Ispanak sote', en: 'Sautéed spinach' },
]
const FATS: Food[] = [
  { tr: 'Zeytinyağı 1 yk', en: '1 tbsp olive oil' },
  { tr: 'Avokado', en: 'Avocado' },
  { tr: 'Bir avuç badem', en: 'A handful of almonds' },
  { tr: 'Ceviz', en: 'Walnuts' },
]
const FRUITS: Food[] = [
  { tr: 'Muz', en: 'Banana' },
  { tr: 'Elma', en: 'Apple' },
  { tr: 'Yaban mersini', en: 'Blueberries' },
  { tr: 'Çilek', en: 'Strawberries' },
]

function ok(food: Food, r: Restriction): boolean {
  return r === 'none' || !food.avoid?.includes(r)
}

function pickFrom(pool: Food[], r: Restriction, variant: number, isEN: boolean): string {
  const allowed = pool.filter((f) => ok(f, r))
  const list = allowed.length > 0 ? allowed : pool
  const entry = list[variant % list.length]
  return isEN ? entry.en : entry.tr
}

function pickProtein(r: Restriction, variant: number, isEN: boolean, preferDairy = false): string {
  if (preferDairy) {
    const dairy = DAIRY_PROTEIN.filter((f) => ok(f, r))
    if (dairy.length > 0) { const e = dairy[variant % dairy.length]; return isEN ? e.en : e.tr }
  }
  if (r === 'vegetarian') {
    const pool = [...VEG_PROTEIN, ...DAIRY_PROTEIN.filter((f) => ok(f, r))]
    const e = pool[variant % pool.length]; return isEN ? e.en : e.tr
  }
  const pool = [...ANIMAL_PROTEIN, EGG]
  const e = pool[variant % pool.length]; return isEN ? e.en : e.tr
}

interface MealSlot {
  time: string
  label: string
  fraction: number
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
}

function mealSlots(count: number, isEN: boolean): MealSlot[] {
  const l = isEN
    ? { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Snack' }
    : { breakfast: 'Kahvaltı', lunch: 'Öğle', dinner: 'Akşam', snack: 'Ara Öğün' }

  if (count === 3) {
    return [
      { time: '08:00', label: l.breakfast, fraction: 0.3, type: 'breakfast' },
      { time: '13:00', label: l.lunch, fraction: 0.4, type: 'lunch' },
      { time: '19:00', label: l.dinner, fraction: 0.3, type: 'dinner' },
    ]
  }
  if (count === 4) {
    return [
      { time: '08:00', label: l.breakfast, fraction: 0.25, type: 'breakfast' },
      { time: '13:00', label: l.lunch, fraction: 0.3, type: 'lunch' },
      { time: '16:30', label: l.snack, fraction: 0.15, type: 'snack' },
      { time: '20:00', label: l.dinner, fraction: 0.3, type: 'dinner' },
    ]
  }
  return [
    { time: '08:00', label: l.breakfast, fraction: 0.25, type: 'breakfast' },
    { time: '10:30', label: l.snack, fraction: 0.1, type: 'snack' },
    { time: '13:00', label: l.lunch, fraction: 0.3, type: 'lunch' },
    { time: '16:30', label: l.snack, fraction: 0.1, type: 'snack' },
    { time: '19:30', label: l.dinner, fraction: 0.25, type: 'dinner' },
  ]
}

function buildFoods(slot: MealSlot, a: DietSurveyAnswers, i: number, isEN: boolean): string[] {
  const r = a.restriction
  const lowCarb = a.style === 'lowCarb'
  const foods: string[] = []
  const eggLabel = isEN ? `${EGG.en} (2-3)` : `${EGG.tr} (2-3 adet)`
  switch (slot.type) {
    case 'breakfast':
      foods.push(eggLabel)
      if (!lowCarb) foods.push(pickFrom(CARBS, r, i, isEN))
      foods.push(pickFrom(FRUITS, r, i, isEN))
      foods.push(pickFrom(FATS, r, i + 1, isEN))
      break
    case 'lunch':
      foods.push(pickProtein(r, i, isEN))
      foods.push(lowCarb ? pickFrom(VEG, r, i + 1, isEN) : pickFrom(CARBS, r, i + 1, isEN))
      foods.push(pickFrom(VEG, r, i, isEN))
      foods.push(pickFrom(FATS, r, i, isEN))
      break
    case 'dinner':
      foods.push(pickProtein(r, i + 1, isEN))
      foods.push(pickFrom(VEG, r, i + 2, isEN))
      if (!lowCarb) foods.push(pickFrom(CARBS, r, i + 2, isEN))
      foods.push(pickFrom(FATS, r, i + 2, isEN))
      break
    case 'snack':
      foods.push(pickProtein(r, i, isEN, true))
      foods.push(pickFrom(FRUITS, r, i + 2, isEN))
      break
  }
  return foods
}

const GOAL_LABEL: Record<string, Record<DietGoal, string>> = {
  tr: { lose: 'Yağ Yakım', gain: 'Kas Kazanım', maintain: 'Form Koruma' },
  en: { lose: 'Fat Loss', gain: 'Muscle Gain', maintain: 'Maintenance' },
}
const STYLE_LABEL: Record<string, Record<DietStyle, string>> = {
  tr: { balanced: 'Dengeli', highProtein: 'Yüksek Protein', lowCarb: 'Düşük Karbonhidrat' },
  en: { balanced: 'Balanced', highProtein: 'High Protein', lowCarb: 'Low Carb' },
}
const RESTRICTION_NOTE: Record<string, Record<Exclude<Restriction, 'none'>, string>> = {
  tr: {
    vegetarian: 'Tüm protein kaynakları vejetaryen seçildi (baklagil, yumurta, süt ürünleri).',
    lactoseFree: 'Süt ürünleri laktozsuz/bitkisel alternatiflerle değiştirildi.',
    glutenFree: 'Glutenli tahıllar pirinç, kinoa ve glutensiz ekmekle değiştirildi.',
  },
  en: {
    vegetarian: 'All protein sources are vegetarian (legumes, eggs, dairy).',
    lactoseFree: 'Dairy has been replaced with lactose-free/plant-based alternatives.',
    glutenFree: 'Gluten-containing grains replaced with rice, quinoa, and gluten-free bread.',
  },
}

export function generateDiet(
  a: DietSurveyAnswers,
  target: { calories: number; protein: number; carbs: number; fat: number }
): Diet {
  const isEN = a.locale === 'en'
  const lang = isEN ? 'en' : 'tr'
  const cal = target.calories
  const ratio = STYLE_RATIO[a.style]
  const dailyP = Math.round((cal * ratio.p) / 4)
  const dailyC = Math.round((cal * ratio.c) / 4)
  const dailyF = Math.round((cal * ratio.f) / 9)

  const slots = mealSlots(a.meals, isEN)
  const sampleDay: DietMeal[] = slots.map((slot, i) => ({
    time: slot.time,
    label: slot.label,
    foods: buildFoods(slot, a, i, isEN),
    macros: {
      cal: Math.round(cal * slot.fraction),
      p: Math.round(dailyP * slot.fraction),
      c: Math.round(dailyC * slot.fraction),
      f: Math.round(dailyF * slot.fraction),
    },
  }))

  const styleLabel = STYLE_LABEL[lang][a.style]

  const keyPoints: string[] = isEN
    ? [
        `Target ~${cal} kcal daily; use ${styleLabel.toLowerCase()} macro distribution.`,
        `Get ~${dailyP}g protein daily — include a protein source in every meal.`,
        a.goal === 'lose'
          ? 'High-fibre foods (vegetables, legumes) keep you full; cut sugary drinks.'
          : a.goal === 'gain'
            ? 'Load carbs around workouts (pre/post); maintain calorie surplus.'
            : 'Keep meal times regular; stay away from processed foods.',
        'Drink at least 2.5–3 litres of water daily.',
      ]
    : [
        `Günlük ~${cal} kcal hedefle; ${styleLabel.toLowerCase()} makro dağılımı uygula.`,
        `Her gün ~${dailyP}g protein al — her öğüne protein kaynağı koy.`,
        a.goal === 'lose'
          ? 'Lifli gıdalar (sebze, baklagil) tok tutar; şekerli içecekleri kes.'
          : a.goal === 'gain'
            ? 'Antrenman öncesi/sonrası karbonhidratı yükle; kalori fazlasını koru.'
            : 'Öğün saatlerini düzenli tut; işlenmiş gıdadan uzak dur.',
        'Günde en az 2.5-3 litre su iç.',
      ]
  if (a.restriction !== 'none') keyPoints.unshift(RESTRICTION_NOTE[lang][a.restriction])

  const description = isEN
    ? `${a.meals}-meal, ${styleLabel.toLowerCase()} custom nutrition plan. ` +
      (a.goal === 'lose'
        ? 'Fat loss through a controlled calorie deficit, with high protein to preserve muscle.'
        : a.goal === 'gain'
          ? 'Clean muscle gain through a controlled calorie surplus and high protein.'
          : 'A balanced macro plan to maintain your current fitness and energy.')
    : `${a.meals} öğünlük, ${styleLabel.toLowerCase()} tarzında kişiye özel beslenme planı. ` +
      (a.goal === 'lose'
        ? 'Kontrollü kalori açığıyla yağ yakımı, protein yüksek tutularak kas korunur.'
        : a.goal === 'gain'
          ? 'Kontrollü kalori fazlası ve yüksek proteinle temiz kas kazanımı.'
          : 'Dengeli makrolarla mevcut formu ve enerjiyi koruma planı.')

  return {
    id: 'custom-diet',
    name: isEN
      ? `Your Custom · ${GOAL_LABEL[lang][a.goal]} Diet`
      : `Sana Özel · ${GOAL_LABEL[lang][a.goal]} Beslenme`,
    goal: a.goal,
    duration: isEN
      ? (a.goal === 'maintain' ? 'Ongoing' : '8–12 weeks')
      : (a.goal === 'maintain' ? 'Süresiz' : '8-12 hafta'),
    dailyCalories: `≈${cal} kcal`,
    description,
    keyPoints,
    sampleDay,
    macroSplit: {
      protein: `${Math.round(ratio.p * 100)}%`,
      carbs: `${Math.round(ratio.c * 100)}%`,
      fat: `${Math.round(ratio.f * 100)}%`,
    },
  }
}
