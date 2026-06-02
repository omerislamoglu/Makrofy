import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ClipboardList, ChevronLeft, Sparkles, ListChecks, ArrowRight, Check } from 'lucide-react'
import { useHaptics } from '../../hooks/useCapacitor'
import { useLocale } from '../../contexts/LocaleContext'
import type { SurveyAnswers } from '../../data/programGenerator'

interface Option {
  label: string
  value: string | number
  desc?: string
}
interface Question {
  key: keyof SurveyAnswers
  title: string
  subtitle?: string
  options: Option[]
}

function getQuestions(locale: string): Question[] {
  if (locale === 'en') {
    return [
      {
        key: 'goal',
        title: 'What is your primary goal?',
        subtitle: 'The entire logic of your program is built around this.',
        options: [
          { label: 'Fat loss', value: 'lose', desc: 'Lose fat while keeping muscle' },
          { label: 'Muscle gain', value: 'gain', desc: 'Build volume and strength' },
          { label: 'Maintain form', value: 'maintain', desc: 'Keep your current fitness' },
        ],
      },
      {
        key: 'experience',
        title: 'What is your training experience?',
        options: [
          { label: 'Beginner', value: 'Beginner', desc: '0–6 months' },
          { label: 'Intermediate', value: 'Intermediate', desc: '6 months – 2 years' },
          { label: 'Advanced', value: 'Advanced', desc: '2+ years consistent' },
        ],
      },
      {
        key: 'days',
        title: 'How many days per week can you train?',
        options: [
          { label: '2 days', value: 2 },
          { label: '3 days', value: 3 },
          { label: '4 days', value: 4 },
          { label: '5+ days', value: 5 },
        ],
      },
      {
        key: 'equipment',
        title: 'Where will you be working out?',
        options: [
          { label: 'Gym', value: 'gym', desc: 'Full equipment access' },
          { label: 'Home', value: 'home', desc: 'Dumbbells & resistance bands' },
          { label: 'Bodyweight only', value: 'body', desc: 'No equipment' },
        ],
      },
      {
        key: 'minutes',
        title: 'How much time do you have per session?',
        options: [
          { label: '30 minutes', value: 30 },
          { label: '45 minutes', value: 45 },
          { label: '60+ minutes', value: 60 },
        ],
      },
      {
        key: 'injury',
        title: 'Do you have any injuries I should be aware of?',
        subtitle: "I'll choose safe movements accordingly.",
        options: [
          { label: 'None', value: 'none' },
          { label: 'Knee', value: 'knee' },
          { label: 'Lower back', value: 'back' },
          { label: 'Shoulder', value: 'shoulder' },
        ],
      },
    ]
  }
  return [
    {
      key: 'goal',
      title: 'Birincil hedefin nedir?',
      subtitle: 'Programın tüm mantığı bunun üzerine kurulur.',
      options: [
        { label: 'Yağ yakımı', value: 'lose', desc: 'Kası koruyarak yağ ver' },
        { label: 'Kas kazanımı', value: 'gain', desc: 'Hacim ve kuvvet artışı' },
        { label: 'Form & güç koruma', value: 'maintain', desc: 'Mevcut formu sürdür' },
      ],
    },
    {
      key: 'experience',
      title: 'Antrenman deneyimin?',
      options: [
        { label: 'Yeni başlıyorum', value: 'Başlangıç', desc: '0-6 ay' },
        { label: 'Orta seviye', value: 'Orta', desc: '6 ay - 2 yıl' },
        { label: 'İleri', value: 'İleri', desc: '2+ yıl düzenli' },
      ],
    },
    {
      key: 'days',
      title: 'Haftada kaç gün antrenman yapabilirsin?',
      options: [
        { label: '2 gün', value: 2 },
        { label: '3 gün', value: 3 },
        { label: '4 gün', value: 4 },
        { label: '5+ gün', value: 5 },
      ],
    },
    {
      key: 'equipment',
      title: 'Nerede çalışacaksın?',
      options: [
        { label: 'Spor salonu', value: 'gym', desc: 'Tam ekipman' },
        { label: 'Ev', value: 'home', desc: 'Dambıl & direnç bandı' },
        { label: 'Sadece vücut ağırlığı', value: 'body', desc: 'Ekipmansız' },
      ],
    },
    {
      key: 'minutes',
      title: 'Seans başına ne kadar vaktin var?',
      options: [
        { label: '30 dakika', value: 30 },
        { label: '45 dakika', value: 45 },
        { label: '60+ dakika', value: 60 },
      ],
    },
    {
      key: 'injury',
      title: 'Dikkat etmem gereken bir sakatlık var mı?',
      subtitle: 'Hareketleri buna göre güvenli seçerim.',
      options: [
        { label: 'Yok', value: 'none' },
        { label: 'Diz', value: 'knee' },
        { label: 'Bel', value: 'back' },
        { label: 'Omuz', value: 'shoulder' },
      ],
    },
  ]
}

export default function ProgramSurvey({
  onComplete,
  onPickReady,
  onCancel,
}: {
  onComplete: (answers: SurveyAnswers) => void
  onPickReady: () => void
  onCancel: () => void
}) {
  const haptics = useHaptics()
  const { locale } = useLocale()
  const [step, setStep] = useState(-1)
  const [answers, setAnswers] = useState<Partial<SurveyAnswers>>({})

  const isEN = locale === 'en'
  const QUESTIONS = getQuestions(locale)

  const select = (q: Question, value: string | number) => {
    haptics.selectionChanged()
    const next = { ...answers, [q.key]: value }
    setAnswers(next)
    if (step >= QUESTIONS.length - 1) {
      haptics.notificationSuccess()
      onComplete(next as SurveyAnswers)
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
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-center gap-2.5 border-b border-zinc-800/40">
        {step >= 0 ? (
          <button onClick={back} className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0">
            <ChevronLeft size={16} className="text-zinc-300" />
          </button>
        ) : (
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
            <ClipboardList size={17} className="text-amber-300" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-bold text-zinc-100">
            {isEN ? 'Training Survey' : 'Antrenman Anketi'}
          </p>
          <p className="text-[11px] text-zinc-500">
            {step < 0
              ? (isEN ? "Let's find the best path for you" : 'Sana en uygun yolu seçelim')
              : (isEN
                  ? `Step ${step + 1} / ${QUESTIONS.length}`
                  : `Adım ${step + 1} / ${QUESTIONS.length}`)}
          </p>
        </div>
        <button onClick={onCancel} className="text-[11px] text-zinc-500 px-2 py-1">
          {isEN ? 'Close' : 'Kapat'}
        </button>
      </div>

      {/* Progress */}
      {step >= 0 && (
        <div className="px-4 pt-3">
          <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-amber-400"
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
                  ? <>I can ask a few questions like a real coach and prepare a <span className="text-zinc-200 font-medium">fully custom</span> program for you. If you're in a hurry, you can pick from ready-made programs.</>
                  : <>Gerçek bir antrenör gibi birkaç soru sorup sana <span className="text-zinc-200 font-medium">tamamen özel</span> bir program hazırlayabilirim. Acelen varsa hazır programlardan da seçebilirsin.</>
                }
              </p>
              <button
                onClick={() => { haptics.impactLight(); setStep(0) }}
                className="w-full bg-white text-black rounded-2xl p-4 flex items-center gap-3 active:scale-[0.99] transition-transform"
              >
                <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center flex-shrink-0">
                  <Sparkles size={18} className="text-amber-300" />
                </div>
                <div className="text-left flex-1">
                  <p className="text-[14px] font-bold">
                    {isEN ? 'Build mine' : 'Bana özel hazırla'}
                  </p>
                  <p className="text-[11px] text-zinc-600">
                    {isEN ? '6-question survey · custom program' : '6 soruluk anket · kişiye özel program'}
                  </p>
                </div>
                <ArrowRight size={16} className="text-zinc-500" />
              </button>
              <button
                onClick={() => { haptics.impactLight(); onPickReady() }}
                className="w-full bg-zinc-800 border border-zinc-700/50 rounded-2xl p-4 flex items-center gap-3 active:scale-[0.99] transition-transform"
              >
                <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center flex-shrink-0">
                  <ListChecks size={18} className="text-zinc-300" />
                </div>
                <div className="text-left flex-1">
                  <p className="text-[14px] font-bold text-zinc-100">
                    {isEN ? 'Browse ready programs' : 'Hazır programlardan seç'}
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    {isEN ? 'Fastest for beginners' : 'Yeni başlayanlar için en hızlısı'}
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
                    <button
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
