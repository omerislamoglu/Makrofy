import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Salad, ChevronLeft, Sparkles, ListChecks, ArrowRight, Check } from 'lucide-react'
import { useHaptics } from '../../hooks/useCapacitor'
import { useLocale } from '../../contexts/LocaleContext'
import type { DietSurveyAnswers } from '../../data/dietGenerator'

interface Option {
  label: string
  value: string | number
  desc?: string
}
interface Question {
  key: keyof DietSurveyAnswers
  title: string
  subtitle?: string
  options: Option[]
}

function getQuestions(locale: string): Question[] {
  if (locale !== 'tr') {
    return [
      {
        key: 'goal',
        title: 'What is your nutrition goal?',
        subtitle: 'Your calorie and macro balance will be built around this.',
        options: [
          { label: 'Fat loss', value: 'lose', desc: 'Controlled calorie deficit' },
          { label: 'Muscle gain', value: 'gain', desc: 'Controlled calorie surplus' },
          { label: 'Maintain form', value: 'maintain', desc: 'Calorie balance' },
        ],
      },
      {
        key: 'style',
        title: 'Which nutrition style do you prefer?',
        options: [
          { label: 'Balanced', value: 'balanced', desc: 'P30 / C40 / F30' },
          { label: 'High Protein', value: 'highProtein', desc: 'P40 / C30 / F30' },
          { label: 'Low Carb', value: 'lowCarb', desc: 'P35 / C20 / F45' },
          { label: 'Ketogenic', value: 'keto', desc: 'P30 / C5 / F65 — very low carb' },
          { label: 'Mediterranean', value: 'mediterranean', desc: 'P25 / C45 / F30 — olive oil & fish' },
        ],
      },
      {
        key: 'meals',
        title: 'How many meals per day?',
        options: [
          { label: '3 meals', value: 3, desc: 'Classic structure' },
          { label: '4 meals', value: 4, desc: '+1 snack' },
          { label: '5 meals', value: 5, desc: 'Frequent small meals' },
          { label: '6 meals', value: 6, desc: 'Bodybuilder / high metabolism' },
        ],
      },
      {
        key: 'restriction',
        title: 'Do you have any dietary restrictions?',
        subtitle: "I'll select foods accordingly.",
        options: [
          { label: 'None', value: 'none' },
          { label: 'Vegetarian', value: 'vegetarian', desc: 'No meat or fish' },
          { label: 'Vegan', value: 'vegan', desc: 'No animal products at all' },
          { label: 'Lactose-free', value: 'lactoseFree' },
          { label: 'Gluten-free', value: 'glutenFree' },
        ],
      },
      {
        key: 'budget',
        title: 'What is your food budget?',
        subtitle: 'This affects ingredient selection — premium vs. budget-friendly.',
        options: [
          { label: 'Economic', value: 'economic', desc: 'Legumes, eggs, chicken, seasonal veg' },
          { label: 'Moderate', value: 'moderate', desc: 'Standard grocery shopping' },
          { label: 'Flexible', value: 'flexible', desc: 'Salmon, beef, superfoods included' },
        ],
      },
      {
        key: 'cooking',
        title: 'How much cooking are you willing to do?',
        options: [
          { label: 'Minimal', value: 'minimal', desc: 'Quick prep, no recipes' },
          { label: 'Moderate', value: 'moderate', desc: 'Some cooking required' },
          { label: 'Advanced', value: 'advanced', desc: 'Full recipe-based meals' },
        ],
      },
    ]
  }
  return [
    {
      key: 'goal',
      title: 'Beslenme hedefin nedir?',
      subtitle: 'Kalori ve makro dengen buna göre kurulur.',
      options: [
        { label: 'Yağ yakımı', value: 'lose', desc: 'Kontrollü kalori açığı' },
        { label: 'Kas kazanımı', value: 'gain', desc: 'Kontrollü kalori fazlası' },
        { label: 'Form koruma', value: 'maintain', desc: 'Kalori dengesi' },
      ],
    },
    {
      key: 'style',
      title: 'Hangi beslenme tarzını tercih edersin?',
      options: [
        { label: 'Dengeli', value: 'balanced', desc: 'P30 / K40 / Y30' },
        { label: 'Yüksek Protein', value: 'highProtein', desc: 'P40 / K30 / Y30' },
        { label: 'Düşük Karbonhidrat', value: 'lowCarb', desc: 'P35 / K20 / Y45' },
        { label: 'Ketojenik', value: 'keto', desc: 'P30 / K5 / Y65 — çok düşük karbonhidrat' },
        { label: 'Akdeniz', value: 'mediterranean', desc: 'P25 / K45 / Y30 — zeytinyağı & balık' },
      ],
    },
    {
      key: 'meals',
      title: 'Günde kaç öğün yemek istersin?',
      options: [
        { label: '3 öğün', value: 3, desc: 'Klasik düzen' },
        { label: '4 öğün', value: 4, desc: '+1 ara öğün' },
        { label: '5 öğün', value: 5, desc: 'Sık ve küçük öğünler' },
        { label: '6 öğün', value: 6, desc: 'Vücut geliştirme / yüksek metabolizma' },
      ],
    },
    {
      key: 'restriction',
      title: 'Beslenme kısıtlaman var mı?',
      subtitle: 'Besinleri buna göre seçerim.',
      options: [
        { label: 'Yok', value: 'none' },
        { label: 'Vejetaryen', value: 'vegetarian', desc: 'Et ve balık yok' },
        { label: 'Vegan', value: 'vegan', desc: 'Hiçbir hayvansal ürün yok' },
        { label: 'Laktozsuz', value: 'lactoseFree' },
        { label: 'Glutensiz', value: 'glutenFree' },
      ],
    },
    {
      key: 'budget',
      title: 'Besin bütçen nasıl?',
      subtitle: 'Bu, içerik seçimini etkiler — premium mi ekonomik mi.',
      options: [
        { label: 'Ekonomik', value: 'economic', desc: 'Baklagil, yumurta, tavuk, mevsim sebzesi' },
        { label: 'Orta', value: 'moderate', desc: 'Standart market alışverişi' },
        { label: 'Esnek', value: 'flexible', desc: 'Somon, dana, süper besinler dahil' },
      ],
    },
    {
      key: 'cooking',
      title: 'Ne kadar yemek yapmaya isteklisin?',
      options: [
        { label: 'Minimum', value: 'minimal', desc: 'Hızlı hazırlık, tarif yok' },
        { label: 'Orta', value: 'moderate', desc: 'Biraz pişirme gerekir' },
        { label: 'İleri', value: 'advanced', desc: 'Tarif bazlı zengin yemekler' },
      ],
    },
  ]
}

export default function DietSurvey({
  onComplete,
  onPickReady,
  onCancel,
}: {
  onComplete: (answers: DietSurveyAnswers) => void
  onPickReady: () => void
  onCancel: () => void
}) {
  const haptics = useHaptics()
  const { locale } = useLocale()
  const [step, setStep] = useState(-1)
  const [answers, setAnswers] = useState<Partial<DietSurveyAnswers>>({})

  const isEN = locale !== 'tr'
  const QUESTIONS = getQuestions(locale)

  const select = (q: Question, value: string | number) => {
    haptics.selectionChanged()
    const next = { ...answers, [q.key]: value }
    setAnswers(next)
    if (step >= QUESTIONS.length - 1) {
      haptics.notificationSuccess()
      onComplete(next as DietSurveyAnswers)
    } else {
      setStep((s) => s + 1)
    }
  }

  const back = () => {
    haptics.impactLight()
    setStep((s) => s - 1)
  }

  return (
    <div className="bg-zinc-900 rounded-2xl border border-zinc-800/50 overflow-hidden">
      <div className="px-4 pt-4 pb-3 flex items-center gap-2.5 border-b border-zinc-800/40">
        {step >= 0 ? (
          <button type="button" onClick={back} className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0">
            <ChevronLeft size={16} className="text-zinc-300" />
          </button>
        ) : (
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
            <Salad size={17} className="text-emerald-300" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-bold text-zinc-100">
            {isEN ? 'Nutrition Survey' : 'Beslenme Anketi'}
          </p>
          <p className="text-[11px] text-zinc-500">
            {step < 0
              ? (isEN ? "Let's find the best path for you" : 'Sana en uygun yolu seçelim')
              : (isEN
                  ? `Step ${step + 1} / ${QUESTIONS.length}`
                  : `Adım ${step + 1} / ${QUESTIONS.length}`)}
          </p>
        </div>
        <button type="button" onClick={onCancel} className="text-[11px] text-zinc-500 px-2 py-1">
          {isEN ? 'Close' : 'Kapat'}
        </button>
      </div>

      {step >= 0 && (
        <div className="px-4 pt-3">
          <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-emerald-400"
              initial={false}
              animate={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      <div className="p-4">
        <AnimatePresence mode="wait">
          {step < 0 ? (
            <motion.div
              key="intro"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <p className="text-[13px] text-zinc-400 leading-relaxed mb-1">
                {isEN
                  ? <>Answer a few questions and I’ll prepare a <span className="text-zinc-200 font-medium">personalized</span> meal plan based on your goal and calorie balance. If you're in a hurry, you can pick from ready-made plans.</>
                  : <>Bir diyetisyen gibi birkaç soru sorup hedefine ve kalori dengene uygun <span className="text-zinc-200 font-medium">kişiye özel</span> bir beslenme planı hazırlayabilirim. Acelen varsa hazır planlardan da seçebilirsin.</>
                }
              </p>
              <button type="button"
                onClick={() => { haptics.impactLight(); setStep(0) }}
                className="w-full bg-white text-black rounded-2xl p-4 flex items-center gap-3 active:scale-[0.99] transition-transform"
              >
                <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center flex-shrink-0">
                  <Sparkles size={18} className="text-emerald-300" />
                </div>
                <div className="text-left flex-1">
                  <p className="text-[14px] font-bold">
                    {isEN ? 'Build mine' : 'Bana özel hazırla'}
                  </p>
                  <p className="text-[11px] text-zinc-600">
                    {isEN ? `${QUESTIONS.length}-question survey · personalized plan` : `${QUESTIONS.length} soruluk anket · kişiye özel plan`}
                  </p>
                </div>
                <ArrowRight size={16} className="text-zinc-500" />
              </button>
              <button type="button"
                onClick={() => { haptics.impactLight(); onPickReady() }}
                className="w-full bg-zinc-800 border border-zinc-700/50 rounded-2xl p-4 flex items-center gap-3 active:scale-[0.99] transition-transform"
              >
                <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center flex-shrink-0">
                  <ListChecks size={18} className="text-zinc-300" />
                </div>
                <div className="text-left flex-1">
                  <p className="text-[14px] font-bold text-zinc-100">
                    {isEN ? 'Browse ready plans' : 'Hazır planlardan seç'}
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    {isEN ? 'Quick start' : 'Hızlı başlamak için'}
                  </p>
                </div>
                <ArrowRight size={16} className="text-zinc-600" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={`q-${step}`}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-[16px] font-bold text-zinc-100 mb-1">{QUESTIONS[step].title}</p>
              {QUESTIONS[step].subtitle && (
                <p className="text-[12px] text-zinc-500 mb-3 leading-relaxed">{QUESTIONS[step].subtitle}</p>
              )}
              <div className="space-y-2 mt-3">
                {QUESTIONS[step].options.map((opt) => {
                  const selected = answers[QUESTIONS[step].key] === opt.value
                  return (
                    <button type="button"
                      key={String(opt.value)}
                      onClick={() => select(QUESTIONS[step], opt.value)}
                      className={`w-full rounded-xl p-3.5 flex items-center gap-3 border text-left transition-all active:scale-[0.99]
                        ${selected ? 'bg-white/[0.06] border-white' : 'bg-zinc-800/50 border-zinc-700/40 hover:border-zinc-600'}`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-medium text-zinc-100">{opt.label}</p>
                        {opt.desc && <p className="text-[11px] text-zinc-500 mt-0.5">{opt.desc}</p>}
                      </div>
                      {selected && <Check size={16} className="text-white flex-shrink-0" />}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
