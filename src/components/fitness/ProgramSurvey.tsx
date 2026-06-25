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

// Western languages share the SAME option values (the program generator only
// understands the English/Turkish value set — see programGenerator.setsFor).
// Only the visible text is localised; values stay constant.
type SLang = 'en' | 'de' | 'fr' | 'es' | 'it'

const SKELETON: { key: keyof SurveyAnswers; values: (string | number)[] }[] = [
  { key: 'goal', values: ['lose', 'gain', 'maintain'] },
  { key: 'experience', values: ['Beginner', 'Intermediate', 'Advanced'] },
  { key: 'days', values: [2, 3, 4, 5, 6] },
  { key: 'equipment', values: ['gym', 'home', 'body'] },
  { key: 'minutes', values: [30, 45, 60, 90] },
  { key: 'focus', values: ['balanced', 'upper', 'lower'] },
  { key: 'intensity', values: ['moderate', 'high', 'max'] },
  { key: 'cardio', values: ['none', 'light', 'hiit'] },
  { key: 'injury', values: ['none', 'knee', 'back', 'shoulder', 'wrist', 'hip'] },
]

interface QText {
  title: string
  subtitle?: string
  opts: Record<string, { label: string; desc?: string }>
}

const QUESTIONS_TEXT: Record<SLang, Record<string, QText>> = {
  en: {
    goal: {
      title: 'What is your primary goal?',
      subtitle: 'The entire logic of your program is built around this.',
      opts: {
        lose: { label: 'Fat loss', desc: 'Lose fat while keeping muscle' },
        gain: { label: 'Muscle gain', desc: 'Build volume and strength' },
        maintain: { label: 'Maintain form', desc: 'Keep your current fitness' },
      },
    },
    experience: {
      title: 'What is your training experience?',
      opts: {
        Beginner: { label: 'Beginner', desc: '0–6 months' },
        Intermediate: { label: 'Intermediate', desc: '6 months – 2 years' },
        Advanced: { label: 'Advanced', desc: '2+ years consistent' },
      },
    },
    days: {
      title: 'How many days per week can you train?',
      opts: {
        '2': { label: '2 days' }, '3': { label: '3 days' }, '4': { label: '4 days' },
        '5': { label: '5 days' }, '6': { label: '6 days', desc: 'Advanced only' },
      },
    },
    equipment: {
      title: 'Where will you be working out?',
      opts: {
        gym: { label: 'Gym', desc: 'Full equipment access' },
        home: { label: 'Home', desc: 'Dumbbells & resistance bands' },
        body: { label: 'Bodyweight only', desc: 'No equipment' },
      },
    },
    minutes: {
      title: 'How much time do you have per session?',
      opts: {
        '30': { label: '30 minutes', desc: 'Quick & effective' }, '45': { label: '45 minutes' },
        '60': { label: '60 minutes' }, '90': { label: '90 minutes', desc: 'Full session with extras' },
      },
    },
    focus: {
      title: 'Which area do you want to emphasize?',
      subtitle: 'This adjusts volume distribution across body parts.',
      opts: {
        balanced: { label: 'Balanced', desc: 'Even upper/lower split' },
        upper: { label: 'Upper body', desc: 'More chest, back, arms' },
        lower: { label: 'Lower body', desc: 'More legs, glutes' },
      },
    },
    intensity: {
      title: 'How intense should the sessions be?',
      subtitle: 'This affects rest times, rep ranges, and tempo.',
      opts: {
        moderate: { label: 'Moderate', desc: 'Comfortable — good for beginners' },
        high: { label: 'High', desc: 'Standard for most lifters' },
        max: { label: 'Maximum', desc: 'Very demanding — advanced only' },
      },
    },
    cardio: {
      title: 'What kind of cardio do you prefer?',
      opts: {
        none: { label: 'None', desc: 'Strength only' },
        light: { label: 'Light (LISS)', desc: 'Walking, cycling, elliptical' },
        hiit: { label: 'HIIT', desc: 'Intervals, sprints, circuits' },
      },
    },
    injury: {
      title: 'Any injuries I should be aware of?',
      subtitle: "I'll choose safe movements accordingly.",
      opts: {
        none: { label: 'None' }, knee: { label: 'Knee' }, back: { label: 'Lower back' },
        shoulder: { label: 'Shoulder' }, wrist: { label: 'Wrist' }, hip: { label: 'Hip' },
      },
    },
  },
  de: {
    goal: {
      title: 'Was ist dein Hauptziel?',
      subtitle: 'Die gesamte Logik deines Programms basiert darauf.',
      opts: {
        lose: { label: 'Fettabbau', desc: 'Fett verlieren, Muskeln behalten' },
        gain: { label: 'Muskelaufbau', desc: 'Volumen und Kraft aufbauen' },
        maintain: { label: 'Form halten', desc: 'Aktuelle Fitness beibehalten' },
      },
    },
    experience: {
      title: 'Wie viel Trainingserfahrung hast du?',
      opts: {
        Beginner: { label: 'Anfänger', desc: '0–6 Monate' },
        Intermediate: { label: 'Mittelstufe', desc: '6 Monate – 2 Jahre' },
        Advanced: { label: 'Fortgeschritten', desc: '2+ Jahre konstant' },
      },
    },
    days: {
      title: 'Wie viele Tage pro Woche kannst du trainieren?',
      opts: {
        '2': { label: '2 Tage' }, '3': { label: '3 Tage' }, '4': { label: '4 Tage' },
        '5': { label: '5 Tage' }, '6': { label: '6 Tage', desc: 'Nur für Fortgeschrittene' },
      },
    },
    equipment: {
      title: 'Wo wirst du trainieren?',
      opts: {
        gym: { label: 'Fitnessstudio', desc: 'Volle Ausstattung' },
        home: { label: 'Zuhause', desc: 'Kurzhanteln & Bänder' },
        body: { label: 'Nur Körpergewicht', desc: 'Keine Ausrüstung' },
      },
    },
    minutes: {
      title: 'Wie viel Zeit hast du pro Einheit?',
      opts: {
        '30': { label: '30 Minuten', desc: 'Schnell & effektiv' }, '45': { label: '45 Minuten' },
        '60': { label: '60 Minuten' }, '90': { label: '90 Minuten', desc: 'Volle Einheit mit Extras' },
      },
    },
    focus: {
      title: 'Welchen Bereich möchtest du betonen?',
      subtitle: 'Passt die Volumenverteilung über die Körperpartien an.',
      opts: {
        balanced: { label: 'Ausgewogen', desc: 'Gleichmäßig oben/unten' },
        upper: { label: 'Oberkörper', desc: 'Mehr Brust, Rücken, Arme' },
        lower: { label: 'Unterkörper', desc: 'Mehr Beine, Gesäß' },
      },
    },
    intensity: {
      title: 'Wie intensiv sollen die Einheiten sein?',
      subtitle: 'Beeinflusst Pausen, Wiederholungsbereiche und Tempo.',
      opts: {
        moderate: { label: 'Moderat', desc: 'Angenehm — gut für Anfänger' },
        high: { label: 'Hoch', desc: 'Standard für die meisten' },
        max: { label: 'Maximal', desc: 'Sehr fordernd — nur Fortgeschrittene' },
      },
    },
    cardio: {
      title: 'Welche Art von Cardio bevorzugst du?',
      opts: {
        none: { label: 'Keins', desc: 'Nur Kraft' },
        light: { label: 'Leicht (LISS)', desc: 'Gehen, Radfahren, Crosstrainer' },
        hiit: { label: 'HIIT', desc: 'Intervalle, Sprints, Zirkel' },
      },
    },
    injury: {
      title: 'Gibt es Verletzungen, die ich kennen sollte?',
      subtitle: 'Ich wähle entsprechend sichere Übungen.',
      opts: {
        none: { label: 'Keine' }, knee: { label: 'Knie' }, back: { label: 'Unterer Rücken' },
        shoulder: { label: 'Schulter' }, wrist: { label: 'Handgelenk' }, hip: { label: 'Hüfte' },
      },
    },
  },
  fr: {
    goal: {
      title: 'Quel est ton objectif principal ?',
      subtitle: 'Toute la logique de ton programme repose là-dessus.',
      opts: {
        lose: { label: 'Perte de graisse', desc: 'Perdre du gras en gardant le muscle' },
        gain: { label: 'Prise de muscle', desc: 'Développer volume et force' },
        maintain: { label: 'Maintenir la forme', desc: 'Conserver ta forme actuelle' },
      },
    },
    experience: {
      title: "Quelle est ton expérience d'entraînement ?",
      opts: {
        Beginner: { label: 'Débutant', desc: '0–6 mois' },
        Intermediate: { label: 'Intermédiaire', desc: '6 mois – 2 ans' },
        Advanced: { label: 'Avancé', desc: '2+ ans réguliers' },
      },
    },
    days: {
      title: "Combien de jours par semaine peux-tu t'entraîner ?",
      opts: {
        '2': { label: '2 jours' }, '3': { label: '3 jours' }, '4': { label: '4 jours' },
        '5': { label: '5 jours' }, '6': { label: '6 jours', desc: 'Avancés uniquement' },
      },
    },
    equipment: {
      title: "Où vas-tu t'entraîner ?",
      opts: {
        gym: { label: 'Salle de sport', desc: 'Équipement complet' },
        home: { label: 'Maison', desc: 'Haltères & élastiques' },
        body: { label: 'Poids du corps', desc: 'Sans matériel' },
      },
    },
    minutes: {
      title: 'Combien de temps as-tu par séance ?',
      opts: {
        '30': { label: '30 minutes', desc: 'Rapide et efficace' }, '45': { label: '45 minutes' },
        '60': { label: '60 minutes' }, '90': { label: '90 minutes', desc: 'Séance complète avec extras' },
      },
    },
    focus: {
      title: 'Quelle zone veux-tu privilégier ?',
      subtitle: 'Cela ajuste la répartition du volume entre les groupes.',
      opts: {
        balanced: { label: 'Équilibré', desc: 'Répartition haut/bas égale' },
        upper: { label: 'Haut du corps', desc: 'Plus de pecs, dos, bras' },
        lower: { label: 'Bas du corps', desc: 'Plus de jambes, fessiers' },
      },
    },
    intensity: {
      title: 'Quelle intensité pour les séances ?',
      subtitle: 'Cela influe sur les repos, les répétitions et le tempo.',
      opts: {
        moderate: { label: 'Modérée', desc: 'Confortable — idéal débutants' },
        high: { label: 'Élevée', desc: 'Standard pour la plupart' },
        max: { label: 'Maximale', desc: 'Très exigeant — avancés uniquement' },
      },
    },
    cardio: {
      title: 'Quel type de cardio préfères-tu ?',
      opts: {
        none: { label: 'Aucun', desc: 'Force uniquement' },
        light: { label: 'Léger (LISS)', desc: 'Marche, vélo, elliptique' },
        hiit: { label: 'HIIT', desc: 'Intervalles, sprints, circuits' },
      },
    },
    injury: {
      title: 'Des blessures dont je dois tenir compte ?',
      subtitle: 'Je choisirai des mouvements sûrs en conséquence.',
      opts: {
        none: { label: 'Aucune' }, knee: { label: 'Genou' }, back: { label: 'Bas du dos' },
        shoulder: { label: 'Épaule' }, wrist: { label: 'Poignet' }, hip: { label: 'Hanche' },
      },
    },
  },
  es: {
    goal: {
      title: '¿Cuál es tu objetivo principal?',
      subtitle: 'Toda la lógica de tu programa se basa en esto.',
      opts: {
        lose: { label: 'Pérdida de grasa', desc: 'Perder grasa manteniendo músculo' },
        gain: { label: 'Ganancia muscular', desc: 'Ganar volumen y fuerza' },
        maintain: { label: 'Mantener la forma', desc: 'Conservar tu estado actual' },
      },
    },
    experience: {
      title: '¿Cuál es tu experiencia de entrenamiento?',
      opts: {
        Beginner: { label: 'Principiante', desc: '0–6 meses' },
        Intermediate: { label: 'Intermedio', desc: '6 meses – 2 años' },
        Advanced: { label: 'Avanzado', desc: '2+ años constante' },
      },
    },
    days: {
      title: '¿Cuántos días por semana puedes entrenar?',
      opts: {
        '2': { label: '2 días' }, '3': { label: '3 días' }, '4': { label: '4 días' },
        '5': { label: '5 días' }, '6': { label: '6 días', desc: 'Solo avanzados' },
      },
    },
    equipment: {
      title: '¿Dónde vas a entrenar?',
      opts: {
        gym: { label: 'Gimnasio', desc: 'Equipo completo' },
        home: { label: 'Casa', desc: 'Mancuernas y bandas' },
        body: { label: 'Solo peso corporal', desc: 'Sin equipo' },
      },
    },
    minutes: {
      title: '¿Cuánto tiempo tienes por sesión?',
      opts: {
        '30': { label: '30 minutos', desc: 'Rápido y eficaz' }, '45': { label: '45 minutos' },
        '60': { label: '60 minutos' }, '90': { label: '90 minutos', desc: 'Sesión completa con extras' },
      },
    },
    focus: {
      title: '¿Qué zona quieres enfatizar?',
      subtitle: 'Ajusta la distribución del volumen entre grupos.',
      opts: {
        balanced: { label: 'Equilibrado', desc: 'Reparto superior/inferior igual' },
        upper: { label: 'Tren superior', desc: 'Más pecho, espalda, brazos' },
        lower: { label: 'Tren inferior', desc: 'Más piernas, glúteos' },
      },
    },
    intensity: {
      title: '¿Qué intensidad deben tener las sesiones?',
      subtitle: 'Afecta a descansos, repeticiones y tempo.',
      opts: {
        moderate: { label: 'Moderada', desc: 'Cómoda — ideal para principiantes' },
        high: { label: 'Alta', desc: 'Estándar para la mayoría' },
        max: { label: 'Máxima', desc: 'Muy exigente — solo avanzados' },
      },
    },
    cardio: {
      title: '¿Qué tipo de cardio prefieres?',
      opts: {
        none: { label: 'Ninguno', desc: 'Solo fuerza' },
        light: { label: 'Ligero (LISS)', desc: 'Caminar, bici, elíptica' },
        hiit: { label: 'HIIT', desc: 'Intervalos, sprints, circuitos' },
      },
    },
    injury: {
      title: '¿Alguna lesión que deba tener en cuenta?',
      subtitle: 'Elegiré movimientos seguros acordes.',
      opts: {
        none: { label: 'Ninguna' }, knee: { label: 'Rodilla' }, back: { label: 'Zona lumbar' },
        shoulder: { label: 'Hombro' }, wrist: { label: 'Muñeca' }, hip: { label: 'Cadera' },
      },
    },
  },
  it: {
    goal: {
      title: 'Qual è il tuo obiettivo principale?',
      subtitle: 'Tutta la logica del programma si basa su questo.',
      opts: {
        lose: { label: 'Perdita di grasso', desc: 'Perdere grasso mantenendo i muscoli' },
        gain: { label: 'Aumento muscolare', desc: 'Costruire volume e forza' },
        maintain: { label: 'Mantenere la forma', desc: 'Conservare la forma attuale' },
      },
    },
    experience: {
      title: 'Qual è la tua esperienza di allenamento?',
      opts: {
        Beginner: { label: 'Principiante', desc: '0–6 mesi' },
        Intermediate: { label: 'Intermedio', desc: '6 mesi – 2 anni' },
        Advanced: { label: 'Avanzato', desc: '2+ anni costanti' },
      },
    },
    days: {
      title: 'Quanti giorni a settimana puoi allenarti?',
      opts: {
        '2': { label: '2 giorni' }, '3': { label: '3 giorni' }, '4': { label: '4 giorni' },
        '5': { label: '5 giorni' }, '6': { label: '6 giorni', desc: 'Solo avanzati' },
      },
    },
    equipment: {
      title: 'Dove ti allenerai?',
      opts: {
        gym: { label: 'Palestra', desc: 'Attrezzatura completa' },
        home: { label: 'Casa', desc: 'Manubri ed elastici' },
        body: { label: 'Solo corpo libero', desc: 'Senza attrezzi' },
      },
    },
    minutes: {
      title: 'Quanto tempo hai per sessione?',
      opts: {
        '30': { label: '30 minuti', desc: 'Rapido ed efficace' }, '45': { label: '45 minuti' },
        '60': { label: '60 minuti' }, '90': { label: '90 minuti', desc: 'Sessione completa con extra' },
      },
    },
    focus: {
      title: 'Quale zona vuoi enfatizzare?',
      subtitle: 'Regola la distribuzione del volume tra i gruppi.',
      opts: {
        balanced: { label: 'Bilanciato', desc: 'Distribuzione alto/basso uguale' },
        upper: { label: 'Parte superiore', desc: 'Più petto, schiena, braccia' },
        lower: { label: 'Parte inferiore', desc: 'Più gambe, glutei' },
      },
    },
    intensity: {
      title: 'Quanto intense devono essere le sessioni?',
      subtitle: 'Influisce su recuperi, ripetizioni e tempo.',
      opts: {
        moderate: { label: 'Moderata', desc: 'Comoda — ideale per principianti' },
        high: { label: 'Alta', desc: 'Standard per la maggior parte' },
        max: { label: 'Massima', desc: 'Molto impegnativa — solo avanzati' },
      },
    },
    cardio: {
      title: 'Che tipo di cardio preferisci?',
      opts: {
        none: { label: 'Nessuno', desc: 'Solo forza' },
        light: { label: 'Leggero (LISS)', desc: 'Camminata, bici, ellittica' },
        hiit: { label: 'HIIT', desc: 'Intervalli, sprint, circuiti' },
      },
    },
    injury: {
      title: 'Ci sono infortuni di cui tenere conto?',
      subtitle: 'Sceglierò movimenti sicuri di conseguenza.',
      opts: {
        none: { label: 'Nessuno' }, knee: { label: 'Ginocchio' }, back: { label: 'Zona lombare' },
        shoulder: { label: 'Spalla' }, wrist: { label: 'Polso' }, hip: { label: 'Anca' },
      },
    },
  },
}

const TR_QUESTIONS: Question[] = [
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
      { label: '5 gün', value: 5 },
      { label: '6 gün', value: 6, desc: 'Sadece ileri seviye' },
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
      { label: '30 dakika', value: 30, desc: 'Hızlı & etkili' },
      { label: '45 dakika', value: 45 },
      { label: '60 dakika', value: 60 },
      { label: '90 dakika', value: 90, desc: 'Detaylı tam seans' },
    ],
  },
  {
    key: 'focus',
    title: 'Hangi bölgeyi öne çıkarmak istersin?',
    subtitle: 'Vücut bölgelerine göre hacim dağılımını ayarlar.',
    options: [
      { label: 'Dengeli', value: 'balanced', desc: 'Eşit üst/alt dağılım' },
      { label: 'Üst vücut', value: 'upper', desc: 'Daha fazla göğüs, sırt, kol' },
      { label: 'Alt vücut', value: 'lower', desc: 'Daha fazla bacak, kalça' },
    ],
  },
  {
    key: 'intensity',
    title: 'Antrenman yoğunluğu nasıl olsun?',
    subtitle: 'Dinlenme, tekrar aralığı ve tempoyu etkiler.',
    options: [
      { label: 'Orta', value: 'moderate', desc: 'Rahat — başlangıç için ideal' },
      { label: 'Yüksek', value: 'high', desc: 'Çoğu sporcu için standart' },
      { label: 'Maksimum', value: 'max', desc: 'Çok ağır — ileri seviye' },
    ],
  },
  {
    key: 'cardio',
    title: 'Kardiyo tercihin ne?',
    options: [
      { label: 'İstemiyorum', value: 'none', desc: 'Sadece kuvvet' },
      { label: 'Hafif (LISS)', value: 'light', desc: 'Yürüyüş, bisiklet, eliptik' },
      { label: 'HIIT', value: 'hiit', desc: 'İnterval, sprint, devre' },
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
      { label: 'Bilek', value: 'wrist' },
      { label: 'Kalça', value: 'hip' },
    ],
  },
]

function buildWestern(lang: SLang): Question[] {
  return SKELETON.map((s) => {
    const qt = QUESTIONS_TEXT[lang][s.key]
    return {
      key: s.key,
      title: qt.title,
      subtitle: qt.subtitle,
      options: s.values.map((v) => {
        const o = qt.opts[String(v)]
        return { value: v, label: o.label, desc: o.desc }
      }),
    }
  })
}

function getQuestions(locale: string): Question[] {
  if (locale === 'tr') return TR_QUESTIONS
  const lang: SLang = (['de', 'fr', 'es', 'it'].includes(locale) ? locale : 'en') as SLang
  return buildWestern(lang)
}

interface UIText {
  survey: string
  intro: string
  step: (a: number, b: number) => string
  close: string
  introPre: string
  introBold: string
  introPost: string
  buildMine: string
  buildMineSub: (n: number) => string
  browseReady: string
  browseReadySub: string
}

const UI: Record<string, UIText> = {
  tr: {
    survey: 'Antrenman Anketi',
    intro: 'Sana en uygun yolu seçelim',
    step: (a, b) => `Adım ${a} / ${b}`,
    close: 'Kapat',
    introPre: 'Gerçek bir antrenör gibi birkaç soru sorup sana ',
    introBold: 'tamamen özel',
    introPost: ' bir program hazırlayabilirim. Acelen varsa hazır programlardan da seçebilirsin.',
    buildMine: 'Bana özel hazırla',
    buildMineSub: (n) => `${n} soruluk anket · kişiye özel program`,
    browseReady: 'Hazır programlardan seç',
    browseReadySub: 'Yeni başlayanlar için en hızlısı',
  },
  en: {
    survey: 'Training Survey',
    intro: "Let's find the best path for you",
    step: (a, b) => `Step ${a} / ${b}`,
    close: 'Close',
    introPre: 'I can ask a few questions like a real coach and prepare a ',
    introBold: 'fully custom',
    introPost: " program for you. If you're in a hurry, you can pick from ready-made programs.",
    buildMine: 'Build mine',
    buildMineSub: (n) => `${n}-question survey · custom program`,
    browseReady: 'Browse ready programs',
    browseReadySub: 'Fastest for beginners',
  },
  de: {
    survey: 'Trainings-Umfrage',
    intro: 'Finden wir den besten Weg für dich',
    step: (a, b) => `Schritt ${a} / ${b}`,
    close: 'Schließen',
    introPre: 'Ich kann dir wie ein echter Coach ein paar Fragen stellen und ein ',
    introBold: 'komplett individuelles',
    introPost: ' Programm erstellen. Wenn du es eilig hast, kannst du auch fertige Programme wählen.',
    buildMine: 'Für mich erstellen',
    buildMineSub: (n) => `${n} Fragen · individuelles Programm`,
    browseReady: 'Fertige Programme ansehen',
    browseReadySub: 'Am schnellsten für Anfänger',
  },
  fr: {
    survey: "Questionnaire d'entraînement",
    intro: 'Trouvons le meilleur chemin pour toi',
    step: (a, b) => `Étape ${a} / ${b}`,
    close: 'Fermer',
    introPre: 'Je peux te poser quelques questions comme un vrai coach et préparer un programme ',
    introBold: 'entièrement personnalisé',
    introPost: '. Si tu es pressé, tu peux choisir parmi des programmes prêts.',
    buildMine: 'Créer le mien',
    buildMineSub: (n) => `${n} questions · programme personnalisé`,
    browseReady: 'Voir les programmes prêts',
    browseReadySub: 'Le plus rapide pour débuter',
  },
  es: {
    survey: 'Encuesta de entrenamiento',
    intro: 'Encontremos el mejor camino para ti',
    step: (a, b) => `Paso ${a} / ${b}`,
    close: 'Cerrar',
    introPre: 'Puedo hacerte unas preguntas como un entrenador de verdad y prepararte un programa ',
    introBold: 'totalmente personalizado',
    introPost: '. Si tienes prisa, puedes elegir programas ya hechos.',
    buildMine: 'Crear el mío',
    buildMineSub: (n) => `${n} preguntas · programa personalizado`,
    browseReady: 'Ver programas listos',
    browseReadySub: 'Lo más rápido para principiantes',
  },
  it: {
    survey: 'Questionario di allenamento',
    intro: 'Troviamo il percorso migliore per te',
    step: (a, b) => `Passo ${a} / ${b}`,
    close: 'Chiudi',
    introPre: 'Posso farti qualche domanda come un vero coach e preparare un programma ',
    introBold: 'completamente su misura',
    introPost: '. Se hai fretta, puoi scegliere tra programmi pronti.',
    buildMine: 'Crea il mio',
    buildMineSub: (n) => `${n} domande · programma su misura`,
    browseReady: 'Sfoglia i programmi pronti',
    browseReadySub: 'Il più veloce per iniziare',
  },
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

  const ui = UI[locale] ?? UI.en
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
          <button type="button" onClick={back} className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0">
            <ChevronLeft size={16} className="text-zinc-300" />
          </button>
        ) : (
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
            <ClipboardList size={17} className="text-amber-300" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-bold text-zinc-100">{ui.survey}</p>
          <p className="text-[11px] text-zinc-500">
            {step < 0 ? ui.intro : ui.step(step + 1, QUESTIONS.length)}
          </p>
        </div>
        <button type="button" onClick={onCancel} className="text-[11px] text-zinc-500 px-2 py-1">
          {ui.close}
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
                {ui.introPre}
                <span className="text-zinc-200 font-medium">{ui.introBold}</span>
                {ui.introPost}
              </p>
              <button type="button"
                onClick={() => { haptics.impactLight(); setStep(0) }}
                className="w-full bg-white text-black rounded-2xl p-4 flex items-center gap-3 active:scale-[0.99] transition-transform"
              >
                <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center flex-shrink-0">
                  <Sparkles size={18} className="text-amber-300" />
                </div>
                <div className="text-left flex-1">
                  <p className="text-[14px] font-bold">{ui.buildMine}</p>
                  <p className="text-[11px] text-zinc-600">{ui.buildMineSub(QUESTIONS.length)}</p>
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
                  <p className="text-[14px] font-bold text-zinc-100">{ui.browseReady}</p>
                  <p className="text-[11px] text-zinc-500">{ui.browseReadySub}</p>
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
