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
export type DietStyle = 'balanced' | 'highProtein' | 'lowCarb' | 'keto' | 'mediterranean'
export type Restriction = 'none' | 'vegetarian' | 'vegan' | 'lactoseFree' | 'glutenFree'
export type Budget = 'economic' | 'moderate' | 'flexible'
export type CookingLevel = 'minimal' | 'moderate' | 'advanced'

export interface DietSurveyAnswers {
  goal: DietGoal
  style: DietStyle
  meals: 3 | 4 | 5 | 6
  restriction: Restriction
  budget: Budget
  cooking: CookingLevel
  locale?: string
}

const STYLE_RATIO: Record<DietStyle, { p: number; c: number; f: number }> = {
  balanced: { p: 0.3, c: 0.4, f: 0.3 },
  highProtein: { p: 0.4, c: 0.3, f: 0.3 },
  lowCarb: { p: 0.35, c: 0.2, f: 0.45 },
  keto: { p: 0.3, c: 0.05, f: 0.65 },
  mediterranean: { p: 0.25, c: 0.45, f: 0.3 },
}

interface Food {
  tr: string
  en: string
  avoid?: Restriction[]
  budget?: 'flexible'  // only available with flexible budget
}

// ─── Protein kaynakları ──────────────────────────────────────────────────────

const ANIMAL_PROTEIN: Food[] = [
  { tr: 'Izgara tavuk göğsü', en: 'Grilled chicken breast', avoid: ['vegetarian', 'vegan'] },
  { tr: 'Izgara köfte', en: 'Grilled meatballs', avoid: ['vegetarian', 'vegan'] },
  { tr: 'Fırın somon', en: 'Baked salmon', avoid: ['vegetarian', 'vegan'], budget: 'flexible' },
  { tr: 'Hindi göğüs', en: 'Turkey breast', avoid: ['vegetarian', 'vegan'] },
  { tr: 'Ton balığı (suda)', en: 'Tuna (in water)', avoid: ['vegetarian', 'vegan'] },
  { tr: 'Tavuk but (derisiz)', en: 'Chicken thigh (skinless)', avoid: ['vegetarian', 'vegan'] },
  { tr: 'Dana bonfile', en: 'Beef tenderloin', avoid: ['vegetarian', 'vegan'], budget: 'flexible' },
  { tr: 'Kuzu pirzola', en: 'Lamb chops', avoid: ['vegetarian', 'vegan'], budget: 'flexible' },
  { tr: 'Sardalya (ızgara)', en: 'Grilled sardines', avoid: ['vegetarian', 'vegan'] },
  { tr: 'Hamsi buğulama', en: 'Steamed anchovies', avoid: ['vegetarian', 'vegan'] },
]
const VEG_PROTEIN: Food[] = [
  { tr: 'Mercimek', en: 'Lentils' },
  { tr: 'Nohut', en: 'Chickpeas' },
  { tr: 'Tofu', en: 'Tofu' },
  { tr: 'Haşlanmış yumurta', en: 'Boiled eggs', avoid: ['vegan'] },
  { tr: 'Kuru fasulye', en: 'White beans' },
  { tr: 'Edamame', en: 'Edamame' },
  { tr: 'Tempeh', en: 'Tempeh', avoid: ['glutenFree'] },
  { tr: 'Bezelye proteini', en: 'Pea protein', avoid: [] },
]
const DAIRY_PROTEIN: Food[] = [
  { tr: 'Süzme yoğurt', en: 'Greek yogurt', avoid: ['lactoseFree', 'vegan'] },
  { tr: 'Lor peyniri', en: 'Cottage cheese', avoid: ['lactoseFree', 'vegan'] },
  { tr: 'Beyaz peynir', en: 'White cheese', avoid: ['lactoseFree', 'vegan'] },
  { tr: 'Protein shake (whey)', en: 'Whey protein shake', avoid: ['lactoseFree', 'vegan'] },
  { tr: 'Kefir', en: 'Kefir', avoid: ['lactoseFree', 'vegan'] },
  { tr: 'Laktozsuz yoğurt', en: 'Lactose-free yogurt', avoid: ['vegan'] },
  { tr: 'Badem sütü yoğurt', en: 'Almond milk yogurt' },
]
const EGG: Food = { tr: 'Yumurta', en: 'Eggs', avoid: ['vegan'] }
const VEGAN_EGG: Food = { tr: 'Tofu scramble', en: 'Tofu scramble' }

// ─── Karbonhidrat kaynakları ─────────────────────────────────────────────────

const CARBS: Food[] = [
  { tr: 'Yulaf ezmesi', en: 'Oatmeal', avoid: ['glutenFree'] },
  { tr: 'Tam buğday ekmek', en: 'Whole wheat bread', avoid: ['glutenFree'] },
  { tr: 'Bulgur pilavı', en: 'Bulgur pilaf', avoid: ['glutenFree'] },
  { tr: 'Pirinç pilavı', en: 'Rice' },
  { tr: 'Kinoa', en: 'Quinoa' },
  { tr: 'Tatlı patates', en: 'Sweet potato' },
  { tr: 'Glutensiz ekmek', en: 'Gluten-free bread' },
  { tr: 'Tam buğday makarna', en: 'Whole wheat pasta', avoid: ['glutenFree'] },
  { tr: 'Karabuğday', en: 'Buckwheat' },
  { tr: 'Chia puding', en: 'Chia pudding' },
  { tr: 'Patates (haşlanmış)', en: 'Boiled potatoes' },
  { tr: 'Mısır gevreği (şekersiz)', en: 'Unsweetened cereal' },
]

// ─── Keto-friendly karbonhidrat alternatifleri ────────────────────────────────

const KETO_CARB_ALT: Food[] = [
  { tr: 'Karnabahar pilavı', en: 'Cauliflower rice' },
  { tr: 'Kabak noodle', en: 'Zucchini noodles' },
  { tr: 'Avokado', en: 'Avocado' },
  { tr: 'Brokoli', en: 'Broccoli' },
]

// ─── Sebzeler ─────────────────────────────────────────────────────────────────

const VEG: Food[] = [
  { tr: 'Mevsim salata (zeytinyağlı)', en: 'Seasonal salad (with olive oil)' },
  { tr: 'Buharda brokoli', en: 'Steamed broccoli' },
  { tr: 'Izgara sebze', en: 'Grilled vegetables' },
  { tr: 'Ispanak sote', en: 'Sautéed spinach' },
  { tr: 'Kuşkonmaz', en: 'Asparagus', budget: 'flexible' },
  { tr: 'Domates-salatalık salatası', en: 'Tomato-cucumber salad' },
  { tr: 'Roka salatası', en: 'Arugula salad' },
  { tr: 'Havuç-kereviz salatası', en: 'Carrot-celery salad' },
]

// ─── Sağlıklı yağlar ──────────────────────────────────────────────────────────

const FATS: Food[] = [
  { tr: 'Zeytinyağı 1 yk', en: '1 tbsp olive oil' },
  { tr: 'Avokado', en: 'Avocado' },
  { tr: 'Bir avuç badem', en: 'A handful of almonds' },
  { tr: 'Ceviz', en: 'Walnuts' },
  { tr: 'Keten tohumu', en: 'Flaxseeds' },
  { tr: 'Fındık ezmesi', en: 'Hazelnut butter' },
  { tr: 'Hindistan cevizi yağı', en: 'Coconut oil' },
  { tr: 'Chia tohumu', en: 'Chia seeds' },
]

// ─── Meyveler ──────────────────────────────────────────────────────────────────

const FRUITS: Food[] = [
  { tr: 'Muz', en: 'Banana' },
  { tr: 'Elma', en: 'Apple' },
  { tr: 'Yaban mersini', en: 'Blueberries' },
  { tr: 'Çilek', en: 'Strawberries' },
  { tr: 'Portakal', en: 'Orange' },
  { tr: 'Kivi', en: 'Kiwi' },
  { tr: 'Nar', en: 'Pomegranate' },
  { tr: 'Armut', en: 'Pear' },
]

// ─── Gelişmiş yemek seçenekleri (cooking: advanced) ──────────────────────────

const ADVANCED_MEALS: Record<string, Food[]> = {
  breakfast: [
    { tr: 'Menemen (zeytinyağlı)', en: 'Turkish menemen (olive oil)', avoid: ['vegan'] },
    { tr: 'Protein pancake', en: 'Protein pancake' },
    { tr: 'Shakshuka', en: 'Shakshuka', avoid: ['vegan'] },
    { tr: 'Smoothie bowl (protein + meyve)', en: 'Smoothie bowl (protein + fruit)' },
  ],
  lunch: [
    { tr: 'Tavuk fajita bowl', en: 'Chicken fajita bowl', avoid: ['vegetarian', 'vegan'] },
    { tr: 'Somon teriyaki', en: 'Salmon teriyaki', avoid: ['vegetarian', 'vegan'], budget: 'flexible' },
    { tr: 'Falafel tabağı', en: 'Falafel plate' },
    { tr: 'Poke bowl', en: 'Poke bowl', avoid: ['vegetarian', 'vegan'], budget: 'flexible' },
  ],
  dinner: [
    { tr: 'Sebzeli hindi güveç', en: 'Turkey vegetable stew', avoid: ['vegetarian', 'vegan'] },
    { tr: 'Fırında levrek', en: 'Baked sea bass', avoid: ['vegetarian', 'vegan'], budget: 'flexible' },
    { tr: 'Mercimek köftesi', en: 'Lentil kofte (Turkish)' },
    { tr: 'Zeytinyağlı enginar', en: 'Artichoke in olive oil' },
  ],
  snack: [
    { tr: 'Hurma + fıstık ezmesi', en: 'Dates + peanut butter' },
    { tr: 'Protein bar (ev yapımı)', en: 'Homemade protein bar' },
    { tr: 'Humus + havuç çubukları', en: 'Hummus + carrot sticks' },
    { tr: 'Energy ball (yulaf + kakao)', en: 'Energy ball (oat + cocoa)', avoid: ['glutenFree'] },
  ],
}

// ─── Yardımcı fonksiyonlar ──────────────────────────────────────────────────

function ok(food: Food, r: Restriction, b: Budget): boolean {
  if (r !== 'none' && food.avoid?.includes(r)) return false
  if (food.budget === 'flexible' && b === 'economic') return false
  return true
}

function pickFrom(pool: Food[], r: Restriction, b: Budget, variant: number, isEN: boolean): string {
  const allowed = pool.filter((f) => ok(f, r, b))
  const list = allowed.length > 0 ? allowed : pool.filter(f => !f.avoid?.includes(r))
  const final = list.length > 0 ? list : pool
  const entry = final[variant % final.length]
  return isEN ? entry.en : entry.tr
}

function pickProtein(r: Restriction, b: Budget, variant: number, isEN: boolean, preferDairy = false): string {
  if (preferDairy) {
    const dairy = DAIRY_PROTEIN.filter((f) => ok(f, r, b))
    if (dairy.length > 0) { const e = dairy[variant % dairy.length]; return isEN ? e.en : e.tr }
  }
  if (r === 'vegan') {
    const pool = VEG_PROTEIN.filter(f => ok(f, r, b))
    const e = pool[variant % pool.length]; return isEN ? e.en : e.tr
  }
  if (r === 'vegetarian') {
    const pool = [...VEG_PROTEIN, ...DAIRY_PROTEIN].filter((f) => ok(f, r, b))
    const e = pool[variant % pool.length]; return isEN ? e.en : e.tr
  }
  const pool = [...ANIMAL_PROTEIN, EGG].filter(f => ok(f, r, b))
  const final = pool.length > 0 ? pool : ANIMAL_PROTEIN
  const e = final[variant % final.length]; return isEN ? e.en : e.tr
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
  if (count === 5) {
    return [
      { time: '08:00', label: l.breakfast, fraction: 0.25, type: 'breakfast' },
      { time: '10:30', label: l.snack, fraction: 0.1, type: 'snack' },
      { time: '13:00', label: l.lunch, fraction: 0.3, type: 'lunch' },
      { time: '16:30', label: l.snack, fraction: 0.1, type: 'snack' },
      { time: '19:30', label: l.dinner, fraction: 0.25, type: 'dinner' },
    ]
  }
  // 6 meals — bodybuilder / high metabolic rate
  return [
    { time: '07:00', label: l.breakfast, fraction: 0.2, type: 'breakfast' },
    { time: '09:30', label: `${l.snack} 1`, fraction: 0.1, type: 'snack' },
    { time: '12:00', label: l.lunch, fraction: 0.25, type: 'lunch' },
    { time: '15:00', label: `${l.snack} 2`, fraction: 0.1, type: 'snack' },
    { time: '18:00', label: l.dinner, fraction: 0.25, type: 'dinner' },
    { time: '21:00', label: `${l.snack} 3`, fraction: 0.1, type: 'snack' },
  ]
}

function buildFoods(slot: MealSlot, a: DietSurveyAnswers, i: number, isEN: boolean): string[] {
  const r = a.restriction
  const b = a.budget ?? 'moderate'
  const isKeto = a.style === 'keto'
  const isMed = a.style === 'mediterranean'
  const lowCarb = a.style === 'lowCarb' || isKeto
  const isAdvanced = (a.cooking ?? 'moderate') === 'advanced'
  const foods: string[] = []

  // If advanced cooking, try to use a recipe-style meal
  if (isAdvanced && ADVANCED_MEALS[slot.type]) {
    const advPool = ADVANCED_MEALS[slot.type].filter(f => ok(f, r, b))
    if (advPool.length > 0) {
      const advFood = advPool[i % advPool.length]
      foods.push(isEN ? advFood.en : advFood.tr)
      // Add a side
      if (slot.type !== 'snack') {
        foods.push(pickFrom(VEG, r, b, i + 1, isEN))
      }
      return foods
    }
  }

  const eggFood = r === 'vegan' ? VEGAN_EGG : EGG
  const eggLabel = isEN ? `${eggFood.en} (2-3)` : `${eggFood.tr} (2-3 adet)`

  switch (slot.type) {
    case 'breakfast':
      foods.push(eggLabel)
      if (!lowCarb) foods.push(pickFrom(CARBS, r, b, i, isEN))
      else if (isKeto) foods.push(pickFrom(FATS, r, b, i, isEN))
      foods.push(pickFrom(FRUITS, r, b, i, isEN))
      if (isMed) foods.push(isEN ? 'Olive oil + tomato' : 'Zeytinyağı + domates')
      else foods.push(pickFrom(FATS, r, b, i + 1, isEN))
      break
    case 'lunch':
      foods.push(pickProtein(r, b, i, isEN))
      if (isKeto) foods.push(pickFrom(KETO_CARB_ALT, r, b, i, isEN))
      else foods.push(lowCarb ? pickFrom(VEG, r, b, i + 1, isEN) : pickFrom(CARBS, r, b, i + 1, isEN))
      foods.push(pickFrom(VEG, r, b, i, isEN))
      foods.push(pickFrom(FATS, r, b, i, isEN))
      break
    case 'dinner':
      foods.push(pickProtein(r, b, i + 1, isEN))
      foods.push(pickFrom(VEG, r, b, i + 2, isEN))
      if (!lowCarb) foods.push(pickFrom(CARBS, r, b, i + 2, isEN))
      else if (isKeto) foods.push(pickFrom(KETO_CARB_ALT, r, b, i + 1, isEN))
      foods.push(pickFrom(FATS, r, b, i + 2, isEN))
      break
    case 'snack':
      foods.push(pickProtein(r, b, i, isEN, true))
      if (isKeto) foods.push(pickFrom(FATS, r, b, i + 1, isEN))
      else foods.push(pickFrom(FRUITS, r, b, i + 2, isEN))
      break
  }
  return foods
}

// ─── Label / açıklama tabloları ──────────────────────────────────────────────

const GOAL_LABEL: Record<string, Record<DietGoal, string>> = {
  tr: { lose: 'Yağ Yakım', gain: 'Kas Kazanım', maintain: 'Form Koruma' },
  en: { lose: 'Fat Loss', gain: 'Muscle Gain', maintain: 'Maintenance' },
}
const STYLE_LABEL: Record<string, Record<DietStyle, string>> = {
  tr: { balanced: 'Dengeli', highProtein: 'Yüksek Protein', lowCarb: 'Düşük Karbonhidrat', keto: 'Ketojenik', mediterranean: 'Akdeniz' },
  en: { balanced: 'Balanced', highProtein: 'High Protein', lowCarb: 'Low Carb', keto: 'Ketogenic', mediterranean: 'Mediterranean' },
}
const RESTRICTION_NOTE: Record<string, Record<Exclude<Restriction, 'none'>, string>> = {
  tr: {
    vegetarian: 'Tüm protein kaynakları vejetaryen seçildi (baklagil, yumurta, süt ürünleri).',
    vegan: 'Tüm hayvansal ürünler bitkisel alternatiflerle değiştirildi (tofu, tempeh, baklagil).',
    lactoseFree: 'Süt ürünleri laktozsuz/bitkisel alternatiflerle değiştirildi.',
    glutenFree: 'Glutenli tahıllar pirinç, kinoa ve glutensiz ekmekle değiştirildi.',
  },
  en: {
    vegetarian: 'All protein sources are vegetarian (legumes, eggs, dairy).',
    vegan: 'All animal products replaced with plant-based alternatives (tofu, tempeh, legumes).',
    lactoseFree: 'Dairy has been replaced with lactose-free/plant-based alternatives.',
    glutenFree: 'Gluten-containing grains replaced with rice, quinoa, and gluten-free bread.',
  },
}
const BUDGET_NOTE: Record<string, Record<Budget, string>> = {
  tr: {
    economic: 'Ekonomik besinler seçildi: baklagil, yumurta, tavuk, mevsim sebzeleri ağırlıklı.',
    moderate: 'Orta bütçeye uygun besinler seçildi.',
    flexible: 'Premium protein ve süper besinler dahil edildi (somon, dana, kuşkonmaz vb.).',
  },
  en: {
    economic: 'Budget-friendly foods selected: legumes, eggs, chicken, seasonal vegetables.',
    moderate: 'Moderate-budget food options selected.',
    flexible: 'Premium proteins and superfoods included (salmon, beef, asparagus etc.).',
  },
}
const COOKING_NOTE: Record<string, Record<CookingLevel, string>> = {
  tr: {
    minimal: 'Minimum hazırlık gerektiren basit yemekler seçildi.',
    moderate: 'Orta seviye pişirme gerektiren yemekler.',
    advanced: 'Tarif bazlı zengin yemekler dahil edildi.',
  },
  en: {
    minimal: 'Simple meals requiring minimal preparation selected.',
    moderate: 'Moderate cooking-level meals.',
    advanced: 'Recipe-based rich meals included.',
  },
}

// ─── Ana üretici ────────────────────────────────────────────────────────────

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
  const budget = a.budget ?? 'moderate'
  const cooking = a.cooking ?? 'moderate'

  const keyPoints: string[] = isEN
    ? [
        `Target ~${cal} kcal daily; use ${styleLabel.toLowerCase()} macro distribution.`,
        `Get ~${dailyP}g protein daily — include a protein source in every meal.`,
        a.goal === 'lose'
          ? 'High-fibre foods (vegetables, legumes) keep you full; cut sugary drinks.'
          : a.goal === 'gain'
            ? 'Load carbs around workouts (pre/post); maintain calorie surplus.'
            : 'Keep meal times regular; stay away from processed foods.',
        a.style === 'keto' ? 'Keep net carbs under 30g; avoid all grains, sugar, and starchy vegetables.' : '',
        a.style === 'mediterranean' ? 'Use olive oil as primary fat; prioritise fish 2-3× per week.' : '',
        'Drink at least 2.5–3 litres of water daily.',
      ].filter(Boolean)
    : [
        `Günlük ~${cal} kcal hedefle; ${styleLabel.toLowerCase()} makro dağılımı uygula.`,
        `Her gün ~${dailyP}g protein al — her öğüne protein kaynağı koy.`,
        a.goal === 'lose'
          ? 'Lifli gıdalar (sebze, baklagil) tok tutar; şekerli içecekleri kes.'
          : a.goal === 'gain'
            ? 'Antrenman öncesi/sonrası karbonhidratı yükle; kalori fazlasını koru.'
            : 'Öğün saatlerini düzenli tut; işlenmiş gıdadan uzak dur.',
        a.style === 'keto' ? 'Net karbonhidratı 30g altında tut; tahıl, şeker ve nişastalı sebzelerden kaçın.' : '',
        a.style === 'mediterranean' ? 'Birincil yağ kaynağı zeytinyağı olsun; haftada 2-3 kez balık ye.' : '',
        'Günde en az 2.5-3 litre su iç.',
      ].filter(Boolean)

  if (a.restriction !== 'none') keyPoints.unshift(RESTRICTION_NOTE[lang][a.restriction])
  if (budget !== 'moderate') keyPoints.push(BUDGET_NOTE[lang][budget])
  if (cooking !== 'moderate') keyPoints.push(COOKING_NOTE[lang][cooking])

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
