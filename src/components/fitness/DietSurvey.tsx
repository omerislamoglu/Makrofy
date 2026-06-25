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

// Diet survey option values are locale-independent identifiers understood by
// dietGenerator. Only the visible text is localised across all languages.
type DLang = 'tr' | 'en' | 'de' | 'fr' | 'es' | 'it'

const SKELETON: { key: keyof DietSurveyAnswers; values: (string | number)[] }[] = [
  { key: 'goal', values: ['lose', 'gain', 'maintain'] },
  { key: 'style', values: ['balanced', 'highProtein', 'lowCarb', 'keto', 'mediterranean'] },
  { key: 'meals', values: [3, 4, 5, 6] },
  { key: 'restriction', values: ['none', 'vegetarian', 'vegan', 'lactoseFree', 'glutenFree'] },
  { key: 'budget', values: ['economic', 'moderate', 'flexible'] },
  { key: 'cooking', values: ['minimal', 'moderate', 'advanced'] },
]

interface QText {
  title: string
  subtitle?: string
  opts: Record<string, { label: string; desc?: string }>
}

const QUESTIONS_TEXT: Record<DLang, Record<string, QText>> = {
  tr: {
    goal: {
      title: 'Beslenme hedefin nedir?',
      subtitle: 'Kalori ve makro dengen buna göre kurulur.',
      opts: {
        lose: { label: 'Yağ yakımı', desc: 'Kontrollü kalori açığı' },
        gain: { label: 'Kas kazanımı', desc: 'Kontrollü kalori fazlası' },
        maintain: { label: 'Form koruma', desc: 'Kalori dengesi' },
      },
    },
    style: {
      title: 'Hangi beslenme tarzını tercih edersin?',
      opts: {
        balanced: { label: 'Dengeli', desc: 'P30 / K40 / Y30' },
        highProtein: { label: 'Yüksek Protein', desc: 'P40 / K30 / Y30' },
        lowCarb: { label: 'Düşük Karbonhidrat', desc: 'P35 / K20 / Y45' },
        keto: { label: 'Ketojenik', desc: 'P30 / K5 / Y65 — çok düşük karbonhidrat' },
        mediterranean: { label: 'Akdeniz', desc: 'P25 / K45 / Y30 — zeytinyağı & balık' },
      },
    },
    meals: {
      title: 'Günde kaç öğün yemek istersin?',
      opts: {
        '3': { label: '3 öğün', desc: 'Klasik düzen' },
        '4': { label: '4 öğün', desc: '+1 ara öğün' },
        '5': { label: '5 öğün', desc: 'Sık ve küçük öğünler' },
        '6': { label: '6 öğün', desc: 'Vücut geliştirme / yüksek metabolizma' },
      },
    },
    restriction: {
      title: 'Beslenme kısıtlaman var mı?',
      subtitle: 'Besinleri buna göre seçerim.',
      opts: {
        none: { label: 'Yok' },
        vegetarian: { label: 'Vejetaryen', desc: 'Et ve balık yok' },
        vegan: { label: 'Vegan', desc: 'Hiçbir hayvansal ürün yok' },
        lactoseFree: { label: 'Laktozsuz' },
        glutenFree: { label: 'Glutensiz' },
      },
    },
    budget: {
      title: 'Besin bütçen nasıl?',
      subtitle: 'Bu, içerik seçimini etkiler — premium mi ekonomik mi.',
      opts: {
        economic: { label: 'Ekonomik', desc: 'Baklagil, yumurta, tavuk, mevsim sebzesi' },
        moderate: { label: 'Orta', desc: 'Standart market alışverişi' },
        flexible: { label: 'Esnek', desc: 'Somon, dana, süper besinler dahil' },
      },
    },
    cooking: {
      title: 'Ne kadar yemek yapmaya isteklisin?',
      opts: {
        minimal: { label: 'Minimum', desc: 'Hızlı hazırlık, tarif yok' },
        moderate: { label: 'Orta', desc: 'Biraz pişirme gerekir' },
        advanced: { label: 'İleri', desc: 'Tarif bazlı zengin yemekler' },
      },
    },
  },
  en: {
    goal: {
      title: 'What is your nutrition goal?',
      subtitle: 'Your calorie and macro balance will be built around this.',
      opts: {
        lose: { label: 'Fat loss', desc: 'Controlled calorie deficit' },
        gain: { label: 'Muscle gain', desc: 'Controlled calorie surplus' },
        maintain: { label: 'Maintain form', desc: 'Calorie balance' },
      },
    },
    style: {
      title: 'Which nutrition style do you prefer?',
      opts: {
        balanced: { label: 'Balanced', desc: 'P30 / C40 / F30' },
        highProtein: { label: 'High Protein', desc: 'P40 / C30 / F30' },
        lowCarb: { label: 'Low Carb', desc: 'P35 / C20 / F45' },
        keto: { label: 'Ketogenic', desc: 'P30 / C5 / F65 — very low carb' },
        mediterranean: { label: 'Mediterranean', desc: 'P25 / C45 / F30 — olive oil & fish' },
      },
    },
    meals: {
      title: 'How many meals per day?',
      opts: {
        '3': { label: '3 meals', desc: 'Classic structure' },
        '4': { label: '4 meals', desc: '+1 snack' },
        '5': { label: '5 meals', desc: 'Frequent small meals' },
        '6': { label: '6 meals', desc: 'Bodybuilder / high metabolism' },
      },
    },
    restriction: {
      title: 'Do you have any dietary restrictions?',
      subtitle: "I'll select foods accordingly.",
      opts: {
        none: { label: 'None' },
        vegetarian: { label: 'Vegetarian', desc: 'No meat or fish' },
        vegan: { label: 'Vegan', desc: 'No animal products at all' },
        lactoseFree: { label: 'Lactose-free' },
        glutenFree: { label: 'Gluten-free' },
      },
    },
    budget: {
      title: 'What is your food budget?',
      subtitle: 'This affects ingredient selection — premium vs. budget-friendly.',
      opts: {
        economic: { label: 'Economic', desc: 'Legumes, eggs, chicken, seasonal veg' },
        moderate: { label: 'Moderate', desc: 'Standard grocery shopping' },
        flexible: { label: 'Flexible', desc: 'Salmon, beef, superfoods included' },
      },
    },
    cooking: {
      title: 'How much cooking are you willing to do?',
      opts: {
        minimal: { label: 'Minimal', desc: 'Quick prep, no recipes' },
        moderate: { label: 'Moderate', desc: 'Some cooking required' },
        advanced: { label: 'Advanced', desc: 'Full recipe-based meals' },
      },
    },
  },
  de: {
    goal: {
      title: 'Was ist dein Ernährungsziel?',
      subtitle: 'Deine Kalorien- und Makrobalance wird darauf aufgebaut.',
      opts: {
        lose: { label: 'Fettabbau', desc: 'Kontrolliertes Kaloriendefizit' },
        gain: { label: 'Muskelaufbau', desc: 'Kontrollierter Kalorienüberschuss' },
        maintain: { label: 'Form halten', desc: 'Kalorienbalance' },
      },
    },
    style: {
      title: 'Welchen Ernährungsstil bevorzugst du?',
      opts: {
        balanced: { label: 'Ausgewogen', desc: 'P30 / C40 / F30' },
        highProtein: { label: 'High Protein', desc: 'P40 / C30 / F30' },
        lowCarb: { label: 'Low Carb', desc: 'P35 / C20 / F45' },
        keto: { label: 'Ketogen', desc: 'P30 / C5 / F65 — sehr wenig Kohlenhydrate' },
        mediterranean: { label: 'Mediterran', desc: 'P25 / C45 / F30 — Olivenöl & Fisch' },
      },
    },
    meals: {
      title: 'Wie viele Mahlzeiten pro Tag?',
      opts: {
        '3': { label: '3 Mahlzeiten', desc: 'Klassische Struktur' },
        '4': { label: '4 Mahlzeiten', desc: '+1 Snack' },
        '5': { label: '5 Mahlzeiten', desc: 'Häufige kleine Mahlzeiten' },
        '6': { label: '6 Mahlzeiten', desc: 'Bodybuilder / hoher Stoffwechsel' },
      },
    },
    restriction: {
      title: 'Hast du Ernährungseinschränkungen?',
      subtitle: 'Ich wähle die Lebensmittel entsprechend aus.',
      opts: {
        none: { label: 'Keine' },
        vegetarian: { label: 'Vegetarisch', desc: 'Kein Fleisch oder Fisch' },
        vegan: { label: 'Vegan', desc: 'Gar keine tierischen Produkte' },
        lactoseFree: { label: 'Laktosefrei' },
        glutenFree: { label: 'Glutenfrei' },
      },
    },
    budget: {
      title: 'Wie hoch ist dein Lebensmittelbudget?',
      subtitle: 'Beeinflusst die Zutatenwahl — Premium oder günstig.',
      opts: {
        economic: { label: 'Sparsam', desc: 'Hülsenfrüchte, Eier, Hähnchen, Saisongemüse' },
        moderate: { label: 'Mittel', desc: 'Normaler Lebensmitteleinkauf' },
        flexible: { label: 'Flexibel', desc: 'Lachs, Rind, Superfoods inklusive' },
      },
    },
    cooking: {
      title: 'Wie viel möchtest du kochen?',
      opts: {
        minimal: { label: 'Minimal', desc: 'Schnelle Zubereitung, keine Rezepte' },
        moderate: { label: 'Mittel', desc: 'Etwas Kochen nötig' },
        advanced: { label: 'Fortgeschritten', desc: 'Vollständige Rezeptgerichte' },
      },
    },
  },
  fr: {
    goal: {
      title: 'Quel est ton objectif nutritionnel ?',
      subtitle: 'Ton équilibre calorique et macro sera construit là-dessus.',
      opts: {
        lose: { label: 'Perte de graisse', desc: 'Déficit calorique contrôlé' },
        gain: { label: 'Prise de muscle', desc: 'Surplus calorique contrôlé' },
        maintain: { label: 'Maintenir la forme', desc: 'Équilibre calorique' },
      },
    },
    style: {
      title: 'Quel style alimentaire préfères-tu ?',
      opts: {
        balanced: { label: 'Équilibré', desc: 'P30 / C40 / F30' },
        highProtein: { label: 'Riche en protéines', desc: 'P40 / C30 / F30' },
        lowCarb: { label: 'Pauvre en glucides', desc: 'P35 / C20 / F45' },
        keto: { label: 'Cétogène', desc: 'P30 / C5 / F65 — très peu de glucides' },
        mediterranean: { label: 'Méditerranéen', desc: "P25 / C45 / F30 — huile d'olive & poisson" },
      },
    },
    meals: {
      title: 'Combien de repas par jour ?',
      opts: {
        '3': { label: '3 repas', desc: 'Structure classique' },
        '4': { label: '4 repas', desc: '+1 collation' },
        '5': { label: '5 repas', desc: 'Petits repas fréquents' },
        '6': { label: '6 repas', desc: 'Bodybuilder / métabolisme élevé' },
      },
    },
    restriction: {
      title: 'As-tu des restrictions alimentaires ?',
      subtitle: 'Je choisirai les aliments en conséquence.',
      opts: {
        none: { label: 'Aucune' },
        vegetarian: { label: 'Végétarien', desc: 'Ni viande ni poisson' },
        vegan: { label: 'Végan', desc: 'Aucun produit animal' },
        lactoseFree: { label: 'Sans lactose' },
        glutenFree: { label: 'Sans gluten' },
      },
    },
    budget: {
      title: 'Quel est ton budget alimentaire ?',
      subtitle: 'Cela influe sur le choix des ingrédients — premium ou économique.',
      opts: {
        economic: { label: 'Économique', desc: 'Légumineuses, œufs, poulet, légumes de saison' },
        moderate: { label: 'Modéré', desc: 'Courses standard' },
        flexible: { label: 'Flexible', desc: 'Saumon, bœuf, superaliments inclus' },
      },
    },
    cooking: {
      title: 'Combien veux-tu cuisiner ?',
      opts: {
        minimal: { label: 'Minimal', desc: 'Préparation rapide, sans recettes' },
        moderate: { label: 'Modéré', desc: 'Un peu de cuisine' },
        advanced: { label: 'Avancé', desc: 'Plats à base de recettes complètes' },
      },
    },
  },
  es: {
    goal: {
      title: '¿Cuál es tu objetivo nutricional?',
      subtitle: 'Tu equilibrio de calorías y macros se basará en esto.',
      opts: {
        lose: { label: 'Pérdida de grasa', desc: 'Déficit calórico controlado' },
        gain: { label: 'Ganancia muscular', desc: 'Superávit calórico controlado' },
        maintain: { label: 'Mantener la forma', desc: 'Equilibrio calórico' },
      },
    },
    style: {
      title: '¿Qué estilo de alimentación prefieres?',
      opts: {
        balanced: { label: 'Equilibrado', desc: 'P30 / C40 / F30' },
        highProtein: { label: 'Alto en proteínas', desc: 'P40 / C30 / F30' },
        lowCarb: { label: 'Bajo en carbohidratos', desc: 'P35 / C20 / F45' },
        keto: { label: 'Cetogénico', desc: 'P30 / C5 / F65 — muy bajo en carbohidratos' },
        mediterranean: { label: 'Mediterráneo', desc: 'P25 / C45 / F30 — aceite de oliva y pescado' },
      },
    },
    meals: {
      title: '¿Cuántas comidas al día?',
      opts: {
        '3': { label: '3 comidas', desc: 'Estructura clásica' },
        '4': { label: '4 comidas', desc: '+1 tentempié' },
        '5': { label: '5 comidas', desc: 'Comidas pequeñas frecuentes' },
        '6': { label: '6 comidas', desc: 'Culturista / metabolismo alto' },
      },
    },
    restriction: {
      title: '¿Tienes restricciones alimentarias?',
      subtitle: 'Seleccionaré los alimentos en consecuencia.',
      opts: {
        none: { label: 'Ninguna' },
        vegetarian: { label: 'Vegetariano', desc: 'Sin carne ni pescado' },
        vegan: { label: 'Vegano', desc: 'Sin productos animales' },
        lactoseFree: { label: 'Sin lactosa' },
        glutenFree: { label: 'Sin gluten' },
      },
    },
    budget: {
      title: '¿Cuál es tu presupuesto para comida?',
      subtitle: 'Afecta a la elección de ingredientes — premium o económico.',
      opts: {
        economic: { label: 'Económico', desc: 'Legumbres, huevos, pollo, verduras de temporada' },
        moderate: { label: 'Moderado', desc: 'Compra estándar' },
        flexible: { label: 'Flexible', desc: 'Salmón, ternera, superalimentos incluidos' },
      },
    },
    cooking: {
      title: '¿Cuánto estás dispuesto a cocinar?',
      opts: {
        minimal: { label: 'Mínimo', desc: 'Preparación rápida, sin recetas' },
        moderate: { label: 'Moderado', desc: 'Algo de cocina' },
        advanced: { label: 'Avanzado', desc: 'Comidas con recetas completas' },
      },
    },
  },
  it: {
    goal: {
      title: 'Qual è il tuo obiettivo nutrizionale?',
      subtitle: 'Il tuo bilancio calorico e dei macro si baserà su questo.',
      opts: {
        lose: { label: 'Perdita di grasso', desc: 'Deficit calorico controllato' },
        gain: { label: 'Aumento muscolare', desc: 'Surplus calorico controllato' },
        maintain: { label: 'Mantenere la forma', desc: 'Bilancio calorico' },
      },
    },
    style: {
      title: 'Quale stile alimentare preferisci?',
      opts: {
        balanced: { label: 'Bilanciato', desc: 'P30 / C40 / F30' },
        highProtein: { label: 'Iperproteico', desc: 'P40 / C30 / F30' },
        lowCarb: { label: 'Pochi carboidrati', desc: 'P35 / C20 / F45' },
        keto: { label: 'Chetogenico', desc: 'P30 / C5 / F65 — pochissimi carboidrati' },
        mediterranean: { label: 'Mediterraneo', desc: "P25 / C45 / F30 — olio d'oliva & pesce" },
      },
    },
    meals: {
      title: 'Quanti pasti al giorno?',
      opts: {
        '3': { label: '3 pasti', desc: 'Struttura classica' },
        '4': { label: '4 pasti', desc: '+1 spuntino' },
        '5': { label: '5 pasti', desc: 'Pasti piccoli frequenti' },
        '6': { label: '6 pasti', desc: 'Bodybuilder / metabolismo alto' },
      },
    },
    restriction: {
      title: 'Hai restrizioni alimentari?',
      subtitle: 'Selezionerò gli alimenti di conseguenza.',
      opts: {
        none: { label: 'Nessuna' },
        vegetarian: { label: 'Vegetariano', desc: 'Niente carne né pesce' },
        vegan: { label: 'Vegano', desc: 'Nessun prodotto animale' },
        lactoseFree: { label: 'Senza lattosio' },
        glutenFree: { label: 'Senza glutine' },
      },
    },
    budget: {
      title: 'Qual è il tuo budget alimentare?',
      subtitle: 'Influisce sulla scelta degli ingredienti — premium o economico.',
      opts: {
        economic: { label: 'Economico', desc: 'Legumi, uova, pollo, verdure di stagione' },
        moderate: { label: 'Medio', desc: 'Spesa standard' },
        flexible: { label: 'Flessibile', desc: 'Salmone, manzo, superfood inclusi' },
      },
    },
    cooking: {
      title: 'Quanto sei disposto a cucinare?',
      opts: {
        minimal: { label: 'Minimo', desc: 'Preparazione rapida, niente ricette' },
        moderate: { label: 'Medio', desc: 'Un po\' di cucina' },
        advanced: { label: 'Avanzato', desc: 'Pasti con ricette complete' },
      },
    },
  },
}

function buildQuestions(lang: DLang): Question[] {
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
  const lang: DLang = (['tr', 'de', 'fr', 'es', 'it'].includes(locale) ? locale : 'en') as DLang
  return buildQuestions(lang)
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
    survey: 'Beslenme Anketi',
    intro: 'Sana en uygun yolu seçelim',
    step: (a, b) => `Adım ${a} / ${b}`,
    close: 'Kapat',
    introPre: 'Bir diyetisyen gibi birkaç soru sorup hedefine ve kalori dengene uygun ',
    introBold: 'kişiye özel',
    introPost: ' bir beslenme planı hazırlayabilirim. Acelen varsa hazır planlardan da seçebilirsin.',
    buildMine: 'Bana özel hazırla',
    buildMineSub: (n) => `${n} soruluk anket · kişiye özel plan`,
    browseReady: 'Hazır planlardan seç',
    browseReadySub: 'Hızlı başlamak için',
  },
  en: {
    survey: 'Nutrition Survey',
    intro: "Let's find the best path for you",
    step: (a, b) => `Step ${a} / ${b}`,
    close: 'Close',
    introPre: "Answer a few questions and I'll prepare a ",
    introBold: 'personalized',
    introPost: " meal plan based on your goal and calorie balance. If you're in a hurry, you can pick from ready-made plans.",
    buildMine: 'Build mine',
    buildMineSub: (n) => `${n}-question survey · personalized plan`,
    browseReady: 'Browse ready plans',
    browseReadySub: 'Quick start',
  },
  de: {
    survey: 'Ernährungs-Umfrage',
    intro: 'Finden wir den besten Weg für dich',
    step: (a, b) => `Schritt ${a} / ${b}`,
    close: 'Schließen',
    introPre: 'Beantworte ein paar Fragen und ich erstelle dir einen ',
    introBold: 'personalisierten',
    introPost: ' Ernährungsplan basierend auf deinem Ziel und deiner Kalorienbalance. Wenn du es eilig hast, kannst du fertige Pläne wählen.',
    buildMine: 'Für mich erstellen',
    buildMineSub: (n) => `${n} Fragen · personalisierter Plan`,
    browseReady: 'Fertige Pläne ansehen',
    browseReadySub: 'Schnellstart',
  },
  fr: {
    survey: 'Questionnaire nutrition',
    intro: 'Trouvons le meilleur chemin pour toi',
    step: (a, b) => `Étape ${a} / ${b}`,
    close: 'Fermer',
    introPre: 'Réponds à quelques questions et je préparerai un plan alimentaire ',
    introBold: 'personnalisé',
    introPost: ' basé sur ton objectif et ton équilibre calorique. Si tu es pressé, tu peux choisir parmi des plans prêts.',
    buildMine: 'Créer le mien',
    buildMineSub: (n) => `${n} questions · plan personnalisé`,
    browseReady: 'Voir les plans prêts',
    browseReadySub: 'Démarrage rapide',
  },
  es: {
    survey: 'Encuesta de nutrición',
    intro: 'Encontremos el mejor camino para ti',
    step: (a, b) => `Paso ${a} / ${b}`,
    close: 'Cerrar',
    introPre: 'Responde unas preguntas y prepararé un plan de comidas ',
    introBold: 'personalizado',
    introPost: ' según tu objetivo y tu equilibrio calórico. Si tienes prisa, puedes elegir planes ya hechos.',
    buildMine: 'Crear el mío',
    buildMineSub: (n) => `${n} preguntas · plan personalizado`,
    browseReady: 'Ver planes listos',
    browseReadySub: 'Inicio rápido',
  },
  it: {
    survey: 'Questionario nutrizionale',
    intro: 'Troviamo il percorso migliore per te',
    step: (a, b) => `Passo ${a} / ${b}`,
    close: 'Chiudi',
    introPre: 'Rispondi a qualche domanda e preparerò un piano alimentare ',
    introBold: 'personalizzato',
    introPost: ' in base al tuo obiettivo e al bilancio calorico. Se hai fretta, puoi scegliere tra piani pronti.',
    buildMine: 'Crea il mio',
    buildMineSub: (n) => `${n} domande · piano personalizzato`,
    browseReady: 'Sfoglia i piani pronti',
    browseReadySub: 'Avvio rapido',
  },
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

  const ui = UI[locale] ?? UI.en
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
          <p className="text-[14px] font-bold text-zinc-100">{ui.survey}</p>
          <p className="text-[11px] text-zinc-500">
            {step < 0 ? ui.intro : ui.step(step + 1, QUESTIONS.length)}
          </p>
        </div>
        <button type="button" onClick={onCancel} className="text-[11px] text-zinc-500 px-2 py-1">
          {ui.close}
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
                {ui.introPre}
                <span className="text-zinc-200 font-medium">{ui.introBold}</span>
                {ui.introPost}
              </p>
              <button type="button"
                onClick={() => { haptics.impactLight(); setStep(0) }}
                className="w-full bg-white text-black rounded-2xl p-4 flex items-center gap-3 active:scale-[0.99] transition-transform"
              >
                <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center flex-shrink-0">
                  <Sparkles size={18} className="text-emerald-300" />
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
