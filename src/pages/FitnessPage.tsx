import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useHaptics } from '../hooks/useCapacitor'
import { useLocale } from '../contexts/LocaleContext'
import { useAuth } from '../hooks/useAuth'
import { useSubscription } from '../hooks/useSubscription'
import {
  Dumbbell,
  Salad,
  Timer,
  Flame,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  Zap,
  Repeat,
  Clock,
  CheckCircle2,
  Apple,
  Beef,
  Wheat,
  Droplets,
  Coffee,
  Moon,
  Sun,
  Sunset,
  Play,
  ExternalLink,
  Crown,
  Sparkles,
  Target,
  ArrowRight,
  ClipboardList,
  CalendarDays,
  Trophy,
} from 'lucide-react'
import type { UserProfile, FitnessGoal } from '../types/user'
import { getWorkoutPrograms, getProgramForGoal, type WorkoutProgram, type ProgramGoal } from '../data/workoutPrograms'
import { generateProgram, type SurveyAnswers } from '../data/programGenerator'
import ProgramSurvey from '../components/fitness/ProgramSurvey'
import { generateDiet, type Diet, type DietSurveyAnswers } from '../data/dietGenerator'
import DietSurvey from '../components/fitness/DietSurvey'

// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════

type FitnessTab = 'programs' | 'exercises' | 'diets'

interface ExerciseSet {
  reps?: number | string
  duration?: string
  rest: string
}

interface Exercise {
  id: string
  name: string
  category: string
  difficulty: 'Başlangıç' | 'Orta' | 'İleri' | 'Beginner' | 'Intermediate' | 'Advanced'
  targetMuscles: string[]
  caloriesBurned: string
  description: string
  sets: ExerciseSet[]
  tips: string[]
  icon: string
  /** YouTube / search query for the exercise tutorial */
  videoQuery: string
}


// ═══════════════════════════════════════════════════════════════════════════
// Exercise Data
// ═══════════════════════════════════════════════════════════════════════════

// Turkish categories
const EXERCISE_CATEGORIES_TR = ['Kardiyo', 'Karın', 'Göğüs', 'Kol & Bilek'] as const
// English categories (same internal order)
const EXERCISE_CATEGORIES_EN = ['Cardio', 'Core', 'Chest', 'Arms & Wrists'] as const

const CATEGORY_META: Record<string, { emoji: string; colorClass: string }> = {
  // Turkish
  Kardiyo: { emoji: '🔥', colorClass: 'text-orange-400' },
  Karın: { emoji: '⚡', colorClass: 'text-yellow-400' },
  Göğüs: { emoji: '💪', colorClass: 'text-blue-400' },
  'Kol & Bilek': { emoji: '🦾', colorClass: 'text-purple-400' },
  // English (same style)
  Cardio: { emoji: '🔥', colorClass: 'text-orange-400' },
  Core: { emoji: '⚡', colorClass: 'text-yellow-400' },
  Chest: { emoji: '💪', colorClass: 'text-blue-400' },
  'Arms & Wrists': { emoji: '🦾', colorClass: 'text-purple-400' },
}


const EXERCISES: Exercise[] = [
  // ── KARDİYO ───────────────────────────────────────────────────────────────
  {
    id: 'jumping-jack',
    name: 'Jumping Jack',
    category: 'Kardiyo',
    difficulty: 'Başlangıç',
    targetMuscles: ['Kardiyovasküler', 'Bacaklar', 'Omuzlar'],
    caloriesBurned: '80-120 kcal / 10 dk',
    icon: '⭐',
    description: 'Ayaklar bitişik, kollar yanda. Zıplayarak ayakları açın ve kolları baş üstünde birleştirin, sonra başlangıca dönün. Isınma ve nabız yükseltme için idealdir.',
    sets: [
      { duration: '30 sn', rest: '15 sn' },
      { duration: '40 sn', rest: '15 sn' },
      { duration: '45 sn', rest: '20 sn' },
    ],
    tips: [
      'Parmak uçlarına yumuşak inin',
      'Kolları tam açıp kapatın',
      'Tempolu gidin ama formu bozmayın',
      'Apartmanda yaşıyorsanız zıplamadan step jack yapın',
    ],
    videoQuery: 'jumping jack nasıl yapılır',
  },
  {
    id: 'high-knees',
    name: 'Yüksek Diz',
    category: 'Kardiyo',
    difficulty: 'Orta',
    targetMuscles: ['Kardiyovasküler', 'Kalça Fleksörleri', 'Quadriceps', 'Core'],
    caloriesBurned: '100-140 kcal / 10 dk',
    icon: '🏃',
    description: 'Yerinde koşarken dizleri kalça hizasına doğru çekin. Kolları koşu ritminde aktif kullanın ve kısa süreli yüksek tempo hedefleyin.',
    sets: [
      { duration: '20 sn', rest: '15 sn' },
      { duration: '30 sn', rest: '15 sn' },
      { duration: '30 sn', rest: '20 sn' },
      { duration: '30 sn', rest: '30 sn' },
    ],
    tips: [
      'Dizler bel hizasına yaklaşsın',
      'Göğüs açık, bakış karşıda olsun',
      'Kollar ritmi desteklesin',
      'Nefesiniz çok dağılırsa tempoyu düşürün',
    ],
    videoQuery: 'high knees egzersizi nasıl yapılır',
  },
  {
    id: 'mountain-climber-cardio',
    name: 'Dağcı',
    category: 'Kardiyo',
    difficulty: 'Orta',
    targetMuscles: ['Core', 'Kalça Fleksörleri', 'Omuzlar', 'Kardiyovasküler'],
    caloriesBurned: '80-120 kcal / 10 dk',
    icon: '⛰️',
    description: 'Şınav pozisyonunda başlayın. Dizleri sırayla göğse çekerek koşu temposu oluşturun. Hem nabzı yükseltir hem core kontrolünü geliştirir.',
    sets: [
      { duration: '20 sn', rest: '15 sn' },
      { duration: '25 sn', rest: '15 sn' },
      { duration: '30 sn', rest: '20 sn' },
      { duration: '30 sn', rest: '30 sn' },
    ],
    tips: [
      'Kalça çok yükselmesin',
      'Omuzlar ellerin üstünde kalsın',
      'Hız arttıkça karın sıkılı kalsın',
      'Bilek hassassa yumruk üstünde veya yavaş yapın',
    ],
    videoQuery: 'mountain climber nasıl yapılır',
  },
  {
    id: 'burpee',
    name: 'Burpee',
    category: 'Kardiyo',
    difficulty: 'İleri',
    targetMuscles: ['Tüm Vücut', 'Kardiyovasküler'],
    caloriesBurned: '120-180 kcal / 10 dk',
    icon: '💥',
    description: 'Ayakta başlayın, çömelip şınav pozisyonuna geçin, tekrar ayağa gelip zıplayın. Ekipmansız kondisyon için en yoğun seçeneklerden biridir.',
    sets: [
      { reps: 8, rest: '60 sn' },
      { reps: 10, rest: '60 sn' },
      { reps: 10, rest: '75 sn' },
    ],
    tips: [
      'Yeni başlıyorsanız zıplamayı çıkarın',
      'Bel çökmeden plank pozisyonuna geçin',
      'Form bozulursa tekrar sayısını azaltın',
      'Mutlaka ısındıktan sonra yapın',
    ],
    videoQuery: 'burpee egzersizi nasıl yapılır',
  },
  {
    id: 'skater-step',
    name: 'Yan Sıçrama',
    category: 'Kardiyo',
    difficulty: 'Orta',
    targetMuscles: ['Kardiyovasküler', 'Kalça', 'Bacaklar', 'Core'],
    caloriesBurned: '90-130 kcal / 10 dk',
    icon: '↔️',
    description: 'Sağa ve sola ritmik şekilde adım atıp hafif sıçrayın. İnişlerde dizleri yumuşak tutarak dengeyi koruyun.',
    sets: [
      { duration: '30 sn', rest: '20 sn' },
      { duration: '40 sn', rest: '20 sn' },
      { duration: '45 sn', rest: '30 sn' },
    ],
    tips: [
      'Dizler içe çökmesin',
      'Sessiz ve kontrollü inin',
      'Kollar denge için aktif çalışsın',
      'Zıplamak istemezseniz yana adım versiyonunu yapın',
    ],
    videoQuery: 'skater jump lateral cardio nasıl yapılır',
  },

  // ── KARIN ─────────────────────────────────────────────────────────────────
  {
    id: 'crunch',
    name: 'Crunch',
    category: 'Karın',
    difficulty: 'Başlangıç',
    targetMuscles: ['Rectus Abdominis', 'Obliques'],
    caloriesBurned: '50-80 kcal / 10 dk',
    icon: '🔥',
    description: 'Sırt üstü yatın, dizleri bükün. Omuzları yerden kaldırıp karın kaslarını sıkın, kontrollü şekilde geri inin.',
    sets: [
      { reps: 15, rest: '30 sn' },
      { reps: 15, rest: '30 sn' },
      { reps: 20, rest: '45 sn' },
    ],
    tips: [
      'Boynu çekmeyin',
      'Yukarı çıkarken nefes verin',
      'Bel yerde kalsın',
      'Hareketi hızlı değil kontrollü yapın',
    ],
    videoQuery: 'crunch mekik nasıl yapılır',
  },
  {
    id: 'leg-raise',
    name: 'Bacak Kaldırma',
    category: 'Karın',
    difficulty: 'Orta',
    targetMuscles: ['Alt Karın', 'Kalça Fleksörleri'],
    caloriesBurned: '60-100 kcal / 10 dk',
    icon: '🦵',
    description: 'Sırt üstü yatın, bacakları düz veya hafif bükülü tutun. Bacakları 90 dereceye kaldırıp bel boşluğu oluşmadan indirin.',
    sets: [
      { reps: 12, rest: '30 sn' },
      { reps: 12, rest: '30 sn' },
      { reps: 15, rest: '45 sn' },
    ],
    tips: [
      'Bel yere yapışık kalsın',
      'Bacakları yere çarpmayın',
      'Zorlanırsanız dizleri bükün',
      'İnişi daha yavaş yapın',
    ],
    videoQuery: 'leg raise bacak kaldırma nasıl yapılır',
  },
  {
    id: 'plank',
    name: 'Plank',
    category: 'Karın',
    difficulty: 'Başlangıç',
    targetMuscles: ['Core', 'Omuzlar', 'Alt Sırt'],
    caloriesBurned: '40-70 kcal / 10 dk',
    icon: '💪',
    description: 'Dirsekler ve ayak parmakları üzerinde durun. Vücudu baştan topuğa düz çizgide tutup karın kaslarını sıkın.',
    sets: [
      { duration: '30 sn', rest: '20 sn' },
      { duration: '40 sn', rest: '20 sn' },
      { duration: '45 sn', rest: '30 sn' },
    ],
    tips: [
      'Kalça düşmesin veya yükselmesin',
      'Omuzlar dirseklerin üstünde olsun',
      'Nefesi tutmayın',
      'Bakışı yere sabitleyin',
    ],
    videoQuery: 'plank nasıl yapılır',
  },
  {
    id: 'bicycle-crunch',
    name: 'Bisiklet Crunch',
    category: 'Karın',
    difficulty: 'Orta',
    targetMuscles: ['Obliques', 'Rectus Abdominis', 'Kalça Fleksörleri'],
    caloriesBurned: '60-100 kcal / 10 dk',
    icon: '🚴',
    description: 'Sırt üstü yatın. Karşı dirsek ve karşı dizi birbirine yaklaştırarak kontrollü şekilde taraf değiştirin.',
    sets: [
      { reps: 20, rest: '30 sn' },
      { reps: 20, rest: '30 sn' },
      { reps: 24, rest: '45 sn' },
    ],
    tips: [
      'Her sağ-sol bir tekrar sayılır',
      'Omuzlar yerden kalksın',
      'Bel kontrolünü kaybetmeyin',
      'Dirseği değil gövdeyi çevirin',
    ],
    videoQuery: 'bisiklet crunch bicycle crunch nasıl yapılır',
  },
  {
    id: 'hollow-hold',
    name: 'Hollow Hold',
    category: 'Karın',
    difficulty: 'İleri',
    targetMuscles: ['Rectus Abdominis', 'Transversus Abdominis', 'Kalça Fleksörleri'],
    caloriesBurned: '50-80 kcal / 10 dk',
    icon: '🎯',
    description: 'Sırt üstü yatın, kolları ve bacakları yerden kaldırın. Bel yere basılı kalırken vücudu gergin pozisyonda tutun.',
    sets: [
      { duration: '20 sn', rest: '30 sn' },
      { duration: '25 sn', rest: '30 sn' },
      { duration: '30 sn', rest: '45 sn' },
    ],
    tips: [
      'Bel ile yer arasında boşluk kalmasın',
      'Zorlanırsanız dizleri bükün',
      'Omuzları hafif kaldırın',
      'Nefesi kısa ve düzenli tutun',
    ],
    videoQuery: 'hollow hold core egzersizi',
  },

  // ── GÖĞÜS ─────────────────────────────────────────────────────────────────
  {
    id: 'pushup',
    name: 'Şınav',
    category: 'Göğüs',
    difficulty: 'Başlangıç',
    targetMuscles: ['Pectoralis Major', 'Triceps', 'Ön Omuz'],
    caloriesBurned: '70-110 kcal / 10 dk',
    icon: '🏋️',
    description: 'Eller omuz genişliğinden biraz açık, vücut düz çizgide. Göğsü yere yaklaştırıp güçlü şekilde başlangıca itin.',
    sets: [
      { reps: 8, rest: '45 sn' },
      { reps: 10, rest: '45 sn' },
      { reps: 12, rest: '60 sn' },
    ],
    tips: [
      'Dirsekler gövdeye yaklaşık 45 derece açıyla dursun',
      'Kalça düşmesin',
      'Göğüs aşağı insin, baş değil',
      'Zorlanırsanız diz üstü başlayın',
    ],
    videoQuery: 'şınav push up nasıl yapılır',
  },
  {
    id: 'wide-pushup',
    name: 'Geniş Şınav',
    category: 'Göğüs',
    difficulty: 'Orta',
    targetMuscles: ['Pectoralis Major', 'Triceps', 'Ön Omuz'],
    caloriesBurned: '70-100 kcal / 10 dk',
    icon: '🤲',
    description: 'Eller omuz genişliğinden daha açık. Göğüs kasına daha fazla yük bindirmek için kontrollü inip kalkın.',
    sets: [
      { reps: 8, rest: '45 sn' },
      { reps: 10, rest: '45 sn' },
      { reps: 12, rest: '60 sn' },
    ],
    tips: [
      'Omuzları kulaklara çekmeyin',
      'İnişi yavaşlatın',
      'Bilekleri omuz çizgisinde tutun',
      'Ağrı olursa el açıklığını azaltın',
    ],
    videoQuery: 'wide push up geniş şınav nasıl yapılır',
  },
  {
    id: 'diamond-pushup',
    name: 'Elmas Şınav',
    category: 'Göğüs',
    difficulty: 'İleri',
    targetMuscles: ['Triceps', 'İç Göğüs', 'Ön Omuz'],
    caloriesBurned: '75-110 kcal / 10 dk',
    icon: '💎',
    description: 'Ellerle elmas şekli oluşturun. Göğsü ellerin üzerine doğru indirip triceps ve iç göğüs odağıyla itin.',
    sets: [
      { reps: 6, rest: '60 sn' },
      { reps: 8, rest: '60 sn' },
      { reps: 10, rest: '75 sn' },
    ],
    tips: [
      'Dirsekler çok dışa açılmasın',
      'Bilekleri zorlamayın',
      'Tekrar sayısı düşük kalabilir',
      'Diz üstü versiyonla ölçekleyebilirsiniz',
    ],
    videoQuery: 'diamond push up elmas şınav nasıl yapılır',
  },
  {
    id: 'archer-pushup',
    name: 'Okçu Şınav',
    category: 'Göğüs',
    difficulty: 'İleri',
    targetMuscles: ['Pectoralis Major', 'Triceps', 'Core'],
    caloriesBurned: '80-120 kcal / 10 dk',
    icon: '🎯',
    description: 'Eller geniş açıkken gövdeyi bir kola doğru indirip diğer kolu daha düz bırakın. Taraf değiştirerek ilerleyin.',
    sets: [
      { reps: 6, rest: '60 sn' },
      { reps: 8, rest: '60 sn' },
      { reps: 8, rest: '75 sn' },
    ],
    tips: [
      'Her sağ-sol bir tekrar sayılır',
      'Core sıkı kalsın',
      'Derinliği kontrollü artırın',
      'Omuz rahatsızlığında klasik şınava dönün',
    ],
    videoQuery: 'archer push up okçu şınav nasıl yapılır',
  },
  {
    id: 'pushup-hold',
    name: 'Alt Pozisyon Şınav Bekleme',
    category: 'Göğüs',
    difficulty: 'Orta',
    targetMuscles: ['Göğüs', 'Triceps', 'Ön Omuz', 'Core'],
    caloriesBurned: '55-85 kcal / 10 dk',
    icon: '⏱️',
    description: 'Şınavın alt pozisyonuna kontrollü inin ve göğüs yere yaklaşmışken kısa süre bekleyin. Sonra başlangıç pozisyonuna itin.',
    sets: [
      { duration: '15 sn', rest: '45 sn' },
      { duration: '20 sn', rest: '45 sn' },
      { duration: '25 sn', rest: '60 sn' },
    ],
    tips: [
      'Bel çökmesin',
      'Dirsek açısını koruyun',
      'Nefesi tutmayın',
      'Süreyi form bozulmadan artırın',
    ],
    videoQuery: 'push up hold isometric chest egzersizi',
  },

  // ── KOL & BİLEK ───────────────────────────────────────────────────────────
  {
    id: 'triceps-pushup',
    name: 'Dar Şınav',
    category: 'Kol & Bilek',
    difficulty: 'Orta',
    targetMuscles: ['Triceps', 'Göğüs', 'Ön Omuz'],
    caloriesBurned: '65-95 kcal / 10 dk',
    icon: '💪',
    description: 'Eller omuz genişliğinde veya biraz daha dar. Dirsekleri gövdeye yakın tutarak inip kalkın; triceps odağı artar.',
    sets: [
      { reps: 8, rest: '45 sn' },
      { reps: 10, rest: '45 sn' },
      { reps: 12, rest: '60 sn' },
    ],
    tips: [
      'Dirsekler geriye doğru gitsin',
      'Omuzları sıkıştırmayın',
      'Bilek rahatsızsa yumruk üstünde deneyin',
      'Diz üstü versiyonla başlayabilirsiniz',
    ],
    videoQuery: 'dar şınav tricep pushup nasıl yapılır',
  },
  {
    id: 'plank-shoulder-tap',
    name: 'Plank Omuz Dokunuşu',
    category: 'Kol & Bilek',
    difficulty: 'Orta',
    targetMuscles: ['Triceps', 'Omuzlar', 'Core', 'Bilek Stabilitesi'],
    caloriesBurned: '60-90 kcal / 10 dk',
    icon: '✋',
    description: 'Yüksek plank pozisyonunda sırayla sağ eli sol omza, sol eli sağ omza dokundurun. Kalçayı mümkün olduğunca sabit tutun.',
    sets: [
      { reps: 20, rest: '30 sn' },
      { reps: 20, rest: '30 sn' },
      { reps: 24, rest: '45 sn' },
    ],
    tips: [
      'Ayakları biraz açmak dengeyi kolaylaştırır',
      'Kalça sağa sola sallanmasın',
      'Eller omuzların altında kalsın',
      'Her dokunuş bir tekrar sayılır',
    ],
    videoQuery: 'plank shoulder tap omuz dokunuşu',
  },
  {
    id: 'wrist-circles',
    name: 'Bilek Çevirme',
    category: 'Kol & Bilek',
    difficulty: 'Başlangıç',
    targetMuscles: ['Bilek', 'Ön Kol'],
    caloriesBurned: '15-30 kcal / 10 dk',
    icon: '🔄',
    description: 'Kolları öne uzatın. Bilekleri kontrollü şekilde içe ve dışa daire çizerek çevirin. Şınav öncesi hazırlık için uygundur.',
    sets: [
      { duration: '30 sn', rest: '15 sn' },
      { duration: '30 sn', rest: '15 sn' },
      { duration: '40 sn', rest: '20 sn' },
    ],
    tips: [
      'Hareketi küçük ve kontrollü başlatın',
      'Ağrı değil hafif gerginlik hissedilmeli',
      'İki yöne eşit süre ayırın',
      'Şınav günlerinde ısınmaya ekleyin',
    ],
    videoQuery: 'wrist circles bilek ısınma egzersizi',
  },
  {
    id: 'wrist-rocks',
    name: 'Bilek Esnetme Sallanışı',
    category: 'Kol & Bilek',
    difficulty: 'Başlangıç',
    targetMuscles: ['Bilek', 'Ön Kol', 'Avuç İçi'],
    caloriesBurned: '20-35 kcal / 10 dk',
    icon: '↕️',
    description: 'Dört ayak pozisyonunda elleri yere koyun. Omuzları hafifçe ileri geri taşıyarak bilekleri kontrollü şekilde yükleyin.',
    sets: [
      { duration: '25 sn', rest: '15 sn' },
      { duration: '30 sn', rest: '15 sn' },
      { duration: '35 sn', rest: '20 sn' },
    ],
    tips: [
      'Avuç içi yerden kalkmasın',
      'Yükü yavaş artırın',
      'Keskin ağrı olursa durun',
      'Parmakları geniş açın',
    ],
    videoQuery: 'wrist mobility bilek hareketlilik egzersizi',
  },
  {
    id: 'forearm-plank-shift',
    name: 'Ön Kol Plank Kaydırma',
    category: 'Kol & Bilek',
    difficulty: 'Orta',
    targetMuscles: ['Ön Kol', 'Triceps', 'Core', 'Omuzlar'],
    caloriesBurned: '45-75 kcal / 10 dk',
    icon: '🧱',
    description: 'Dirsek plank pozisyonunda gövdeyi kontrollü şekilde öne ve arkaya taşıyın. Ön kol, omuz ve core birlikte çalışır.',
    sets: [
      { duration: '20 sn', rest: '30 sn' },
      { duration: '25 sn', rest: '30 sn' },
      { duration: '30 sn', rest: '45 sn' },
    ],
    tips: [
      'Dirsekler omuzların altında kalsın',
      'Kalça yüksekliği sabit olsun',
      'Hareket küçük ama kontrollü olsun',
      'Nefesi düzenli tutun',
    ],
    videoQuery: 'forearm plank ön kol egzersizi',
  },
]

// ═══════════════════════════════════════════════════════════════════════════
// Exercise Data — English
// ═══════════════════════════════════════════════════════════════════════════

const EXERCISES_EN: Exercise[] = [
  // ── CARDIO ───────────────────────────────────────────────────────────────
  {
    id: 'jumping-jack',
    name: 'Jumping Jacks',
    category: 'Cardio',
    difficulty: 'Beginner',
    targetMuscles: ['Cardiovascular', 'Legs', 'Shoulders'],
    caloriesBurned: '80–120 kcal / 10 min',
    icon: '⭐',
    description: 'Start with feet together, arms at sides. Jump and spread your legs while raising arms overhead, then return to start. Great for warm-ups and raising your heart rate.',
    sets: [
      { duration: '30 sec', rest: '15 sec' },
      { duration: '40 sec', rest: '15 sec' },
      { duration: '45 sec', rest: '20 sec' },
    ],
    tips: [
      'Land softly on the balls of your feet',
      'Fully open and close your arms',
      'Keep pace up but don\'t sacrifice form',
      'If in an apartment, do step jacks instead of jumping',
    ],
    videoQuery: 'jumping jacks exercise tutorial',
  },
  {
    id: 'high-knees',
    name: 'High Knees',
    category: 'Cardio',
    difficulty: 'Intermediate',
    targetMuscles: ['Cardiovascular', 'Hip Flexors', 'Quadriceps', 'Core'],
    caloriesBurned: '100–140 kcal / 10 min',
    icon: '🏃',
    description: 'Run in place, pulling your knees up toward hip level. Actively pump your arms in a running rhythm and aim for short bursts at high pace.',
    sets: [
      { duration: '20 sec', rest: '15 sec' },
      { duration: '30 sec', rest: '15 sec' },
      { duration: '30 sec', rest: '20 sec' },
      { duration: '30 sec', rest: '30 sec' },
    ],
    tips: [
      'Drive knees toward waist height',
      'Keep chest open, eyes forward',
      'Let arms support the rhythm',
      'Slow down if you lose your breath',
    ],
    videoQuery: 'high knees exercise tutorial',
  },
  {
    id: 'mountain-climber-cardio',
    name: 'Mountain Climbers',
    category: 'Cardio',
    difficulty: 'Intermediate',
    targetMuscles: ['Cardiovascular', 'Core', 'Hip Flexors', 'Shoulders'],
    caloriesBurned: '120–160 kcal / 10 min',
    icon: '🧗',
    description: 'Start in a high plank. Rapidly alternate drawing one knee toward your chest at a time. Keep hips level and core braced throughout.',
    sets: [
      { duration: '20 sec', rest: '20 sec' },
      { duration: '30 sec', rest: '20 sec' },
      { duration: '30 sec', rest: '20 sec' },
      { duration: '40 sec', rest: '30 sec' },
    ],
    tips: [
      'Keep your hips flat — no bouncing',
      'Shoulders directly over wrists',
      'The faster you go, the better the cardio effect',
      'Go slower with focus if your form breaks',
    ],
    videoQuery: 'mountain climbers exercise tutorial',
  },
  {
    id: 'burpee',
    name: 'Burpee',
    category: 'Cardio',
    difficulty: 'Advanced',
    targetMuscles: ['Full Body', 'Cardiovascular', 'Chest', 'Core', 'Legs'],
    caloriesBurned: '150–200 kcal / 10 min',
    icon: '💥',
    description: 'From standing, drop to a plank, do a push-up, jump feet forward, then explode up with hands overhead. One of the most calorie-burning bodyweight moves.',
    sets: [
      { duration: '20 sec', rest: '30 sec' },
      { duration: '25 sec', rest: '30 sec' },
      { duration: '30 sec', rest: '40 sec' },
    ],
    tips: [
      'Step back instead of jumping if you\'re a beginner',
      'Soft landing on the jump — absorb through your legs',
      'Breathe out during the push-up and jump',
      'Control the pace — quality over quantity',
    ],
    videoQuery: 'burpee exercise tutorial for beginners',
  },
  {
    id: 'skater-step',
    name: 'Skater Steps',
    category: 'Cardio',
    difficulty: 'Intermediate',
    targetMuscles: ['Glutes', 'Quadriceps', 'Adductors', 'Cardiovascular'],
    caloriesBurned: '90–130 kcal / 10 min',
    icon: '⛸️',
    description: 'Leap laterally from one foot to the other, landing softly in a slight squat. Mimic a speed skater\'s stride. Great low-impact cardio that targets the outer glutes.',
    sets: [
      { duration: '30 sec', rest: '15 sec' },
      { duration: '40 sec', rest: '20 sec' },
      { duration: '45 sec', rest: '20 sec' },
    ],
    tips: [
      'Land softly on each hop — absorb through your knee',
      'Keep your torso slightly hinged forward',
      'Arms swing opposite to the jumping leg',
      'Look straight ahead, not at the floor',
    ],
    videoQuery: 'skater steps cardio exercise tutorial',
  },
  // ── CORE ─────────────────────────────────────────────────────────────────
  {
    id: 'crunch',
    name: 'Crunch',
    category: 'Core',
    difficulty: 'Beginner',
    targetMuscles: ['Upper Abs', 'Rectus Abdominis'],
    caloriesBurned: '40–60 kcal / 10 min',
    icon: '🔥',
    description: 'Lie on your back, knees bent, hands behind your head. Curl your shoulders off the ground using your abs — not your neck — and lower slowly.',
    sets: [
      { reps: '15', rest: '30 sec' },
      { reps: '20', rest: '30 sec' },
      { reps: '20', rest: '30 sec' },
    ],
    tips: [
      'Don\'t pull your neck — support it lightly',
      'Exhale as you crunch up',
      'Lower slowly — the eccentric phase matters',
      'Keep lower back pressed to the floor',
    ],
    videoQuery: 'crunch abs exercise tutorial',
  },
  {
    id: 'leg-raise',
    name: 'Leg Raise',
    category: 'Core',
    difficulty: 'Intermediate',
    targetMuscles: ['Lower Abs', 'Hip Flexors', 'Core'],
    caloriesBurned: '45–65 kcal / 10 min',
    icon: '⬆️',
    description: 'Lie flat on your back, legs straight. Slowly raise your legs to 90° keeping them straight, then lower without touching the floor. Targets the lower abs.',
    sets: [
      { reps: '10', rest: '30 sec' },
      { reps: '12', rest: '30 sec' },
      { reps: '15', rest: '30 sec' },
    ],
    tips: [
      'Press your lower back into the floor throughout',
      'Move slowly — avoid momentum',
      'Modify by bending your knees if needed',
      'Don\'t hold your breath',
    ],
    videoQuery: 'leg raise abs exercise tutorial',
  },
  {
    id: 'plank',
    name: 'Plank',
    category: 'Core',
    difficulty: 'Beginner',
    targetMuscles: ['Core', 'Shoulders', 'Glutes', 'Back'],
    caloriesBurned: '30–50 kcal / 10 min',
    icon: '🧱',
    description: 'Hold a push-up position on your forearms or hands. Keep your body in a straight line from head to heels. Brace everything and breathe steadily.',
    sets: [
      { duration: '20 sec', rest: '30 sec' },
      { duration: '30 sec', rest: '30 sec' },
      { duration: '40 sec', rest: '40 sec' },
    ],
    tips: [
      'Don\'t let your hips sag or pike up',
      'Squeeze your glutes and abs',
      'Look at the floor, neutral neck',
      'Build time gradually week by week',
    ],
    videoQuery: 'plank exercise tutorial proper form',
  },
  {
    id: 'bicycle-crunch',
    name: 'Bicycle Crunch',
    category: 'Core',
    difficulty: 'Intermediate',
    targetMuscles: ['Obliques', 'Rectus Abdominis', 'Hip Flexors'],
    caloriesBurned: '50–70 kcal / 10 min',
    icon: '🚴',
    description: 'Lie on your back with hands behind your head. Alternate bringing opposite elbow to opposite knee in a cycling motion, keeping the other leg extended.',
    sets: [
      { reps: '20 (10 each side)', rest: '30 sec' },
      { reps: '24 (12 each side)', rest: '30 sec' },
      { reps: '30 (15 each side)', rest: '30 sec' },
    ],
    tips: [
      'Don\'t rush — control beats speed',
      'Fully extend the non-working leg',
      'Don\'t pull your neck with your hands',
      'Twist from your ribs, not just your elbows',
    ],
    videoQuery: 'bicycle crunch abs exercise tutorial',
  },
  {
    id: 'hollow-hold',
    name: 'Hollow Hold',
    category: 'Core',
    difficulty: 'Advanced',
    targetMuscles: ['Core', 'Lower Abs', 'Hip Flexors', 'Lats'],
    caloriesBurned: '40–60 kcal / 10 min',
    icon: '🌙',
    description: 'Lie on your back, arms overhead, legs straight and slightly off the floor. Create a hollowed-out banana shape. This is the foundation of gymnastics core strength.',
    sets: [
      { duration: '15 sec', rest: '30 sec' },
      { duration: '20 sec', rest: '30 sec' },
      { duration: '25 sec', rest: '40 sec' },
    ],
    tips: [
      'Press your lower back firmly into the floor',
      'Squeeze inner thighs together',
      'Arms reach long overhead — engage your lats',
      'Modify by bending your knees if lower back lifts',
    ],
    videoQuery: 'hollow hold exercise tutorial core strength',
  },
  // ── CHEST ────────────────────────────────────────────────────────────────
  {
    id: 'pushup',
    name: 'Push-up',
    category: 'Chest',
    difficulty: 'Beginner',
    targetMuscles: ['Chest', 'Triceps', 'Front Deltoid', 'Core'],
    caloriesBurned: '50–80 kcal / 10 min',
    icon: '💪',
    description: 'Hands shoulder-width apart, body in a straight line. Lower your chest to the floor, then push back up. The king of upper-body bodyweight exercises.',
    sets: [
      { reps: '10', rest: '45 sec' },
      { reps: '12', rest: '45 sec' },
      { reps: '15', rest: '60 sec' },
    ],
    tips: [
      'Keep elbows at ~45° to your torso — not flared wide',
      'Brace your core throughout',
      'Full range: chest nearly touches the floor',
      'Modify on knees if needed — still great',
    ],
    videoQuery: 'push up proper form tutorial',
  },
  {
    id: 'wide-pushup',
    name: 'Wide Push-up',
    category: 'Chest',
    difficulty: 'Intermediate',
    targetMuscles: ['Outer Chest', 'Anterior Deltoid', 'Triceps'],
    caloriesBurned: '55–85 kcal / 10 min',
    icon: '↔️',
    description: 'Same as a push-up but with hands wider than shoulder-width. The wider stance shifts more load onto the chest. Keep elbows pointed backward, not out.',
    sets: [
      { reps: '10', rest: '45 sec' },
      { reps: '12', rest: '45 sec' },
      { reps: '12', rest: '60 sec' },
    ],
    tips: [
      'Don\'t let elbows flare out sideways',
      'Think "chest to the floor"',
      'Keep shoulders down, not shrugged',
      'Add a 1-second pause at the bottom for extra challenge',
    ],
    videoQuery: 'wide grip push up chest exercise tutorial',
  },
  {
    id: 'diamond-pushup',
    name: 'Diamond Push-up',
    category: 'Chest',
    difficulty: 'Advanced',
    targetMuscles: ['Triceps', 'Inner Chest', 'Front Deltoid'],
    caloriesBurned: '55–90 kcal / 10 min',
    icon: '💎',
    description: 'Hands close together under your sternum, forming a diamond shape. Shifts the load heavily onto the triceps and inner chest. Keep elbows close to your body.',
    sets: [
      { reps: '8', rest: '60 sec' },
      { reps: '10', rest: '60 sec' },
      { reps: '10', rest: '60 sec' },
    ],
    tips: [
      'Elbows track close — don\'t let them flare',
      'Diamond hands directly under chest',
      'Lower slowly for maximum muscle tension',
      'Strong core — no sagging hips',
    ],
    videoQuery: 'diamond push up triceps exercise tutorial',
  },
  {
    id: 'archer-pushup',
    name: 'Archer Push-up',
    category: 'Chest',
    difficulty: 'Advanced',
    targetMuscles: ['Chest (unilateral)', 'Triceps', 'Stabilisers'],
    caloriesBurned: '60–95 kcal / 10 min',
    icon: '🏹',
    description: 'Wide stance push-up where one arm stays straight as you lower to the opposite side. Effectively a one-arm push-up assisted — builds serious unilateral chest strength.',
    sets: [
      { reps: '5 each side', rest: '60 sec' },
      { reps: '6 each side', rest: '60 sec' },
      { reps: '8 each side', rest: '75 sec' },
    ],
    tips: [
      'Keep the straight arm locked — push into the floor',
      'Lower slowly and with control',
      'Hips stay level — no rotation',
      'Progress from wide push-ups first',
    ],
    videoQuery: 'archer push up exercise tutorial one arm progression',
  },
  {
    id: 'pushup-hold',
    name: 'Push-up Hold (Bottom)',
    category: 'Chest',
    difficulty: 'Intermediate',
    targetMuscles: ['Chest', 'Triceps', 'Core', 'Stabilisers'],
    caloriesBurned: '40–70 kcal / 10 min',
    icon: '⏸️',
    description: 'Lower into the bottom of a push-up and hold. The isometric tension builds incredible strength and joint stability. Essential prep for advanced pushing movements.',
    sets: [
      { duration: '15 sec', rest: '45 sec' },
      { duration: '20 sec', rest: '45 sec' },
      { duration: '25 sec', rest: '60 sec' },
    ],
    tips: [
      'Elbows at 45° — no wider',
      'Squeeze everything: chest, core, glutes',
      'Breathe steadily — don\'t hold your breath',
      'Stack on top of your regular push-up sets',
    ],
    videoQuery: 'push up hold isometric chest exercise tutorial',
  },
  // ── ARMS & WRISTS ─────────────────────────────────────────────────────────
  {
    id: 'triceps-pushup',
    name: 'Triceps Push-up',
    category: 'Arms & Wrists',
    difficulty: 'Intermediate',
    targetMuscles: ['Triceps', 'Chest', 'Core'],
    caloriesBurned: '50–80 kcal / 10 min',
    icon: '🦾',
    description: 'Standard push-up with hands close together directly under your shoulders. Elbows stay pinned to your sides as you lower. Maximum triceps isolation from a bodyweight move.',
    sets: [
      { reps: '10', rest: '45 sec' },
      { reps: '12', rest: '45 sec' },
      { reps: '15', rest: '60 sec' },
    ],
    tips: [
      'Keep elbows hugging your ribs — don\'t flare',
      'Full range of motion: chest near floor',
      'Move slowly on the way down',
      'Try a deficit (hands on books) for extra range',
    ],
    videoQuery: 'triceps push up close grip tutorial',
  },
  {
    id: 'plank-shoulder-tap',
    name: 'Plank Shoulder Tap',
    category: 'Arms & Wrists',
    difficulty: 'Intermediate',
    targetMuscles: ['Core', 'Shoulders', 'Triceps', 'Anti-rotation'],
    caloriesBurned: '45–70 kcal / 10 min',
    icon: '👆',
    description: 'Hold a high plank, then alternately tap each shoulder with the opposite hand. Challenges anti-rotation core stability — the hips must stay square throughout.',
    sets: [
      { reps: '10 each side', rest: '30 sec' },
      { reps: '12 each side', rest: '30 sec' },
      { reps: '15 each side', rest: '45 sec' },
    ],
    tips: [
      'Widen your foot stance to reduce hip rocking',
      'Tap lightly and quickly — minimise rotation',
      'Breathe steadily throughout',
      'Look at the floor, neutral neck',
    ],
    videoQuery: 'plank shoulder tap core stability exercise',
  },
  {
    id: 'wrist-circles',
    name: 'Wrist Circles',
    category: 'Arms & Wrists',
    difficulty: 'Beginner',
    targetMuscles: ['Wrist', 'Forearm'],
    caloriesBurned: '10–20 kcal / 10 min',
    icon: '🔄',
    description: 'With arms extended, slowly rotate your wrists in full circles — both directions. Essential warm-up for any push or wrist-loading exercise.',
    sets: [
      { duration: '30 sec each direction', rest: '10 sec' },
      { duration: '30 sec each direction', rest: '10 sec' },
    ],
    tips: [
      'Move slowly and through full range',
      'If you feel grinding, slow down',
      'Do this before any push-up session',
      'Gradually increase speed over time',
    ],
    videoQuery: 'wrist mobility warm up exercise',
  },
  {
    id: 'wrist-rocks',
    name: 'Wrist Rocks',
    category: 'Arms & Wrists',
    difficulty: 'Beginner',
    targetMuscles: ['Wrist', 'Forearm', 'Shoulder Stability'],
    caloriesBurned: '15–25 kcal / 10 min',
    icon: '🪨',
    description: 'On all fours, slowly rock forward and back with your body weight over your wrists. Conditions the joint for weight-bearing and improves extension flexibility.',
    sets: [
      { duration: '20 sec', rest: '20 sec' },
      { duration: '25 sec', rest: '20 sec' },
      { duration: '30 sec', rest: '30 sec' },
    ],
    tips: [
      'Start gently — increase pressure slowly',
      'Stop if you feel sharp pain',
      'Spread your fingers wide',
      'Ideal daily prehab for push athletes',
    ],
    videoQuery: 'wrist rocks mobility exercise for push ups',
  },
  {
    id: 'forearm-plank-shift',
    name: 'Forearm Plank Shift',
    category: 'Arms & Wrists',
    difficulty: 'Intermediate',
    targetMuscles: ['Forearms', 'Triceps', 'Core', 'Shoulders'],
    caloriesBurned: '45–75 kcal / 10 min',
    icon: '🧱',
    description: 'In a forearm plank, rock your body forward and back in a controlled arc. Forearms, shoulders and core work together under constant tension.',
    sets: [
      { duration: '20 sec', rest: '30 sec' },
      { duration: '25 sec', rest: '30 sec' },
      { duration: '30 sec', rest: '45 sec' },
    ],
    tips: [
      'Keep elbows directly under your shoulders',
      'Hips stay level — no dipping',
      'Small controlled movement — not a big swing',
      'Breathe rhythmically throughout',
    ],
    videoQuery: 'forearm plank shift exercise core tutorial',
  },
]

// ═══════════════════════════════════════════════════════════════════════════
// Diet Data
// ═══════════════════════════════════════════════════════════════════════════

const DIETS: Diet[] = [
  {
    id: 'clean-bulk',
    name: 'Temiz Hacim (Clean Bulk)',
    goal: 'gain',
    duration: '8-12 hafta',
    dailyCalories: '2800-3200 kcal',
    description: 'Kaliteli besinlerle kas kütlesi kazanmaya yönelik diyet. Aşırı yağlanma olmadan, kontrollü kalori fazlası ile hacim artışı hedefler.',
    macroSplit: { protein: '%30', carbs: '%45', fat: '%25' },
    keyPoints: [
      'Günde 1.8-2.2g/kg protein al',
      'Her öğünde protein kaynağı olsun',
      'Antrenman öncesi ve sonrası karbonhidrat yükle',
      'Sağlıklı yağları ihmal etme (zeytinyağı, avokado, fındık)',
      'Haftada 0.3-0.5 kg artış hedefle',
      'Bol su iç — günde en az 3 litre',
    ],
    sampleDay: [
      {
        time: '07:00',
        label: 'Kahvaltı',
        foods: ['4 yumurta (2 bütün + 2 ak)', 'Yulaf ezmesi 80g + muz + bal', '1 bardak süt', '30g badem'],
        macros: { cal: 750, p: 42, c: 78, f: 28 },
      },
      {
        time: '10:00',
        label: 'Ara Öğün',
        foods: ['Süzme yoğurt 200g', '1 muz', '20g ceviz', '1 yemek kaşığı bal'],
        macros: { cal: 380, p: 22, c: 48, f: 14 },
      },
      {
        time: '13:00',
        label: 'Öğle',
        foods: ['Tavuk göğsü 200g (ızgara)', 'Bulgur pilavı 250g', 'Yeşil salata + zeytinyağı', '1 dilim ekmek'],
        macros: { cal: 720, p: 55, c: 80, f: 18 },
      },
      {
        time: '16:00',
        label: 'Antrenman Öncesi',
        foods: ['Tam buğday tost + peynir', '1 muz', 'Bir avuç kuru üzüm'],
        macros: { cal: 420, p: 16, c: 65, f: 12 },
      },
      {
        time: '19:00',
        label: 'Antrenman Sonrası / Akşam',
        foods: ['Somon 200g (fırın)', 'Beyaz pirinç pilavı 200g', 'Buharda brokoli 150g', 'Zeytinyağı 1 yk'],
        macros: { cal: 750, p: 48, c: 70, f: 28 },
      },
      {
        time: '22:00',
        label: 'Gece Atıştırma',
        foods: ['Lor peyniri 150g', '30g fındık', '1 yemek kaşığı tahin'],
        macros: { cal: 350, p: 24, c: 12, f: 22 },
      },
    ],
  },
  {
    id: 'lean-bulk',
    name: 'Yalın Hacim (Lean Bulk)',
    goal: 'gain',
    duration: '12-16 hafta',
    dailyCalories: '2500-2800 kcal',
    description: 'Minimum yağ artışıyla kas kazanımı. Kalori fazlası daha düşük tutulur ama protein yüksek kalır. Sabır gerektirir ama sonuç daha estetik olur.',
    macroSplit: { protein: '%35', carbs: '%40', fat: '%25' },
    keyPoints: [
      'Günde 2.0-2.4g/kg protein al',
      'Kalori fazlasını +200-300 kcal ile sınırla',
      'Karbonhidratları antrenman günlerine yığ',
      'Dinlenme günlerinde yağı artır, karbı azalt',
      'Haftada 0.2-0.3 kg artış ideal',
      'İşlenmiş gıdalardan uzak dur',
    ],
    sampleDay: [
      {
        time: '07:00',
        label: 'Kahvaltı',
        foods: ['3 yumurta omlet (sebzeli)', 'Tam buğday ekmek 2 dilim', 'Avokado yarım', '1 bardak ayran'],
        macros: { cal: 580, p: 32, c: 42, f: 30 },
      },
      {
        time: '10:00',
        label: 'Ara Öğün',
        foods: ['Süzme yoğurt 200g (%0)', 'Bir avuç yaban mersini', '20g badem'],
        macros: { cal: 280, p: 24, c: 22, f: 12 },
      },
      {
        time: '13:00',
        label: 'Öğle',
        foods: ['Izgara tavuk göğsü 200g', 'Kinoa 150g', 'Akdeniz salatası', '1 yk zeytinyağı'],
        macros: { cal: 620, p: 52, c: 52, f: 20 },
      },
      {
        time: '16:00',
        label: 'Antrenman Öncesi',
        foods: ['Pirinç patlağı + fıstık ezmesi 1 yk', '1 muz'],
        macros: { cal: 320, p: 10, c: 50, f: 10 },
      },
      {
        time: '19:00',
        label: 'Akşam',
        foods: ['Dana bonfile 180g (ızgara)', 'Tatlı patates 200g (fırın)', 'Buharda kabak + havuç'],
        macros: { cal: 580, p: 45, c: 55, f: 16 },
      },
      {
        time: '21:30',
        label: 'Gece',
        foods: ['Lor peyniri 100g', '10g ceviz'],
        macros: { cal: 160, p: 14, c: 5, f: 10 },
      },
    ],
  },
  {
    id: 'calorie-deficit',
    name: 'Kalori Açığı Diyeti',
    goal: 'lose',
    duration: '8-12 hafta',
    dailyCalories: '1600-1900 kcal',
    description: 'Kontrollü kalori açığı ile yağ yakımı. Protein yüksek tutularak kas kaybı minimize edilir. Sürdürülebilir ve sağlıklı bir kilo verme yaklaşımı.',
    macroSplit: { protein: '%40', carbs: '%30', fat: '%30' },
    keyPoints: [
      'Günde 2.0-2.5g/kg protein al — kas kaybını engelle',
      'Kalori açığını günde 400-600 kcal ile sınırla',
      'Lifli gıdalar tok tutar (sebze, baklagil, tam tahıl)',
      'Şekerli içecekleri tamamen kes',
      'Haftada 0.5-0.7 kg azalış hedefle',
      'Açlık hissedersen protein veya sebze at',
    ],
    sampleDay: [
      {
        time: '08:00',
        label: 'Kahvaltı',
        foods: ['3 yumurta akı + 1 bütün yumurta omlet', 'Domates + biber + yeşillik', '1 dilim tam buğday ekmek'],
        macros: { cal: 280, p: 26, c: 18, f: 12 },
      },
      {
        time: '10:30',
        label: 'Ara Öğün',
        foods: ['Süzme yoğurt 150g (%0)', '1 elma'],
        macros: { cal: 140, p: 16, c: 18, f: 1 },
      },
      {
        time: '13:00',
        label: 'Öğle',
        foods: ['Izgara tavuk göğsü 200g', 'Büyük yeşil salata', 'Bulgur 100g (pişmiş)', '1 çk zeytinyağı'],
        macros: { cal: 450, p: 50, c: 32, f: 12 },
      },
      {
        time: '16:00',
        label: 'Ara Öğün',
        foods: ['15g badem', '1 havuç (çiğ)'],
        macros: { cal: 130, p: 4, c: 10, f: 9 },
      },
      {
        time: '19:00',
        label: 'Akşam',
        foods: ['Fırında levrek 200g', 'Buharda brokoli + karnabahar 200g', 'Zeytinyağı 1 çk'],
        macros: { cal: 350, p: 46, c: 10, f: 12 },
      },
      {
        time: '21:00',
        label: 'Gece (opsiyonel)',
        foods: ['Lor peyniri 100g', 'Salatalık'],
        macros: { cal: 95, p: 13, c: 5, f: 2 },
      },
    ],
  },
  {
    id: 'low-carb',
    name: 'Düşük Karbonhidrat Diyeti',
    goal: 'lose',
    duration: '6-10 hafta',
    dailyCalories: '1500-1800 kcal',
    description: 'Karbonhidratı kısıtlayarak vücudu yağ yakmaya yönlendirir. İnsülin seviyesini düşük tutarak yağ depolanmasını azaltır.',
    macroSplit: { protein: '%40', carbs: '%15', fat: '%45' },
    keyPoints: [
      'Günlük karbı 50-80g ile sınırla',
      'Ekmek, pilav, makarna, şeker kaldır',
      'Protein ve sağlıklı yağ ağırlıklı beslen',
      'Sebze serbestçe ye (nişastalı olanlar hariç)',
      'İlk haftada su kaybı olur — gerçek yağ kaybı 2. haftadan itibaren',
      'Elektrolit dengesine dikkat et (tuz, potasyum, magnezyum)',
    ],
    sampleDay: [
      {
        time: '08:00',
        label: 'Kahvaltı',
        foods: ['3 yumurta (tereyağında)', 'Avokado yarım', 'Peynir 40g', 'Domates + salatalık'],
        macros: { cal: 520, p: 28, c: 10, f: 42 },
      },
      {
        time: '11:00',
        label: 'Ara Öğün',
        foods: ['30g ceviz', '1 dilim kaşar peyniri'],
        macros: { cal: 280, p: 12, c: 4, f: 25 },
      },
      {
        time: '13:30',
        label: 'Öğle',
        foods: ['Somon 200g (ızgara)', 'Ispanak sote (zeytinyağlı)', 'Yoğurt 100g'],
        macros: { cal: 520, p: 42, c: 8, f: 36 },
      },
      {
        time: '16:30',
        label: 'Ara Öğün',
        foods: ['Süzme yoğurt 150g', '10g fındık'],
        macros: { cal: 160, p: 16, c: 6, f: 8 },
      },
      {
        time: '19:30',
        label: 'Akşam',
        foods: ['Kuzu pirzola 150g (ızgara)', 'Karışık yeşil salata', 'Zeytinyağı + limon'],
        macros: { cal: 480, p: 38, c: 5, f: 34 },
      },
    ],
  },
  {
    id: 'intermittent-gain',
    name: 'Aralıklı Oruç + Hacim',
    goal: 'gain',
    duration: '8-12 hafta',
    dailyCalories: '2600-3000 kcal',
    description: '16:8 aralıklı oruç ile hacim. Yeme penceresi 12:00-20:00. Büyüme hormonu artışı + kontrollü kalori fazlası ile temiz kas kazanımı.',
    macroSplit: { protein: '%30', carbs: '%45', fat: '%25' },
    keyPoints: [
      '16 saat oruç, 8 saat yeme penceresi (12:00-20:00)',
      'İlk öğünü büyük tut — günlük kalorinin %35-40\'ı',
      'Antrenmanı yeme penceresinde yap',
      'Oruç sırasında su, sade çay/kahve serbest',
      'Protein her öğünde en az 40g',
      'Gece geç yeme — son öğün 20:00',
    ],
    sampleDay: [
      {
        time: '12:00',
        label: 'İlk Öğün (Büyük)',
        foods: ['4 yumurta + peynirli omlet', 'Yulaf ezmesi 80g + muz + bal', 'Tam buğday ekmek 2 dilim', '1 bardak süt'],
        macros: { cal: 950, p: 52, c: 100, f: 35 },
      },
      {
        time: '15:00',
        label: 'Ara Öğün',
        foods: ['Tavuk göğsü wrap (lavaş + tavuk + sebze)', '1 bardak ayran'],
        macros: { cal: 520, p: 40, c: 45, f: 18 },
      },
      {
        time: '17:00',
        label: 'Antrenman Öncesi',
        foods: ['1 muz', '30g kuru üzüm', '20g badem'],
        macros: { cal: 280, p: 6, c: 48, f: 10 },
      },
      {
        time: '19:30',
        label: 'Antrenman Sonrası',
        foods: ['Somon 200g (fırın)', 'Pirinç pilavı 250g', 'Brokoli 150g', 'Zeytinyağı 1 yk'],
        macros: { cal: 850, p: 50, c: 85, f: 30 },
      },
    ],
  },
  {
    id: 'high-protein-cut',
    name: 'Yüksek Protein Kesim Diyeti',
    goal: 'lose',
    duration: '6-8 hafta',
    dailyCalories: '1700-2000 kcal',
    description: 'Agresif yağ yakımı için yüksek protein, düşük kalori kombinasyonu. Kas kaybını en aza indirirken hızlı yağ kaybı sağlar. Antrenmanla birlikte uygulanmalı.',
    macroSplit: { protein: '%45', carbs: '%25', fat: '%30' },
    keyPoints: [
      'Günde 2.5-3.0g/kg protein — kas koruma öncelikli',
      'Her öğünde en az 35g protein',
      'Karbonhidratı antrenman öncesi/sonrasına yığ',
      'Yağ kaynağı olarak omega-3 ve zeytinyağı tercih et',
      'Haftada 0.7-1.0 kg azalış hedefle',
      'Refeeding günü: haftada 1 gün karbı artır (kas dolgunluğu için)',
    ],
    sampleDay: [
      {
        time: '07:30',
        label: 'Kahvaltı',
        foods: ['5 yumurta akı + 2 bütün yumurta omlet', 'Ispanak + domates', 'Lor peyniri 50g'],
        macros: { cal: 340, p: 42, c: 6, f: 16 },
      },
      {
        time: '10:00',
        label: 'Ara Öğün',
        foods: ['Tavuk göğsü 100g (soğuk, dilimlenmiş)', '1 salatalık'],
        macros: { cal: 180, p: 32, c: 4, f: 4 },
      },
      {
        time: '13:00',
        label: 'Öğle',
        foods: ['Izgara hindi göğsü 200g', 'Karışık salata (bol sebze)', 'Bulgur 80g (pişmiş)', 'Zeytinyağı 1 çk'],
        macros: { cal: 420, p: 52, c: 25, f: 12 },
      },
      {
        time: '16:00',
        label: 'Antrenman Öncesi',
        foods: ['Süzme yoğurt 200g (%0)', '1 elma'],
        macros: { cal: 170, p: 20, c: 22, f: 1 },
      },
      {
        time: '19:00',
        label: 'Akşam',
        foods: ['Ton balığı 200g (suda)', 'Buharda sebze 200g', 'Avokado 1/3'],
        macros: { cal: 340, p: 48, c: 10, f: 12 },
      },
      {
        time: '21:00',
        label: 'Gece',
        foods: ['Lor peyniri 100g', '5g fındık'],
        macros: { cal: 120, p: 13, c: 4, f: 5 },
      },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════
// Diet Data — English
// ═══════════════════════════════════════════════════════════════════════════

const DIETS_EN: Diet[] = [
  {
    id: 'clean-bulk',
    name: 'Clean Bulk',
    goal: 'gain',
    duration: '8–12 weeks',
    dailyCalories: '2800–3200 kcal',
    description: 'A diet focused on building muscle with quality foods. Targets lean mass gain with a controlled calorie surplus, minimising excess fat.',
    macroSplit: { protein: '30%', carbs: '45%', fat: '25%' },
    keyPoints: [
      'Take 1.8–2.2 g/kg protein daily',
      'Include a protein source in every meal',
      'Load carbs around workouts (pre and post)',
      'Don\'t skip healthy fats (olive oil, avocado, nuts)',
      'Aim for 0.3–0.5 kg gain per week',
      'Drink plenty of water — at least 3 litres a day',
    ],
    sampleDay: [
      { time: '07:00', label: 'Breakfast', foods: ['4 eggs (2 whole + 2 whites)', 'Oatmeal 80g + banana + honey', '1 glass of milk', '30g almonds'], macros: { cal: 750, p: 42, c: 78, f: 28 } },
      { time: '10:00', label: 'Snack', foods: ['Greek yogurt 200g', '1 banana', '20g walnuts', '1 tbsp honey'], macros: { cal: 380, p: 22, c: 48, f: 14 } },
      { time: '13:00', label: 'Lunch', foods: ['Grilled chicken breast 200g', 'Bulgur pilaf 250g', 'Green salad + olive oil', '1 slice bread'], macros: { cal: 720, p: 55, c: 80, f: 18 } },
      { time: '16:00', label: 'Pre-Workout', foods: ['Whole wheat toast + cheese', '1 banana', 'A handful of raisins'], macros: { cal: 420, p: 16, c: 65, f: 12 } },
      { time: '19:00', label: 'Post-Workout / Dinner', foods: ['Salmon 200g (baked)', 'White rice 200g', 'Steamed broccoli 150g', '1 tbsp olive oil'], macros: { cal: 750, p: 48, c: 70, f: 28 } },
      { time: '22:00', label: 'Night Snack', foods: ['Cottage cheese 150g', '30g hazelnuts', '1 tbsp tahini'], macros: { cal: 350, p: 24, c: 12, f: 22 } },
    ],
  },
  {
    id: 'lean-bulk',
    name: 'Lean Bulk',
    goal: 'gain',
    duration: '12–16 weeks',
    dailyCalories: '2500–2800 kcal',
    description: 'Muscle gain with minimal fat accumulation. A tighter calorie surplus with high protein. Takes patience, but produces a leaner result.',
    macroSplit: { protein: '35%', carbs: '40%', fat: '25%' },
    keyPoints: [
      'Take 2.0–2.4 g/kg protein daily',
      'Keep calorie surplus to +200–300 kcal',
      'Concentrate carbs on training days',
      'Increase fat and reduce carbs on rest days',
      'Target 0.2–0.3 kg gain per week',
      'Stay away from processed foods',
    ],
    sampleDay: [
      { time: '07:00', label: 'Breakfast', foods: ['3-egg omelette (with veggies)', '2 slices whole wheat bread', 'Half an avocado', '1 glass of ayran (yogurt drink)'], macros: { cal: 580, p: 32, c: 42, f: 30 } },
      { time: '10:00', label: 'Snack', foods: ['Greek yogurt 200g (0%)', 'A handful of blueberries', '20g almonds'], macros: { cal: 280, p: 24, c: 22, f: 12 } },
      { time: '13:00', label: 'Lunch', foods: ['Grilled chicken breast 200g', 'Quinoa 150g', 'Mediterranean salad', '1 tbsp olive oil'], macros: { cal: 620, p: 52, c: 52, f: 20 } },
      { time: '16:00', label: 'Pre-Workout', foods: ['Rice cake + 1 tbsp peanut butter', '1 banana'], macros: { cal: 320, p: 10, c: 50, f: 10 } },
      { time: '19:00', label: 'Dinner', foods: ['Sirloin steak 180g (grilled)', 'Sweet potato 200g (baked)', 'Steamed zucchini and carrots'], macros: { cal: 580, p: 45, c: 55, f: 16 } },
      { time: '21:30', label: 'Night', foods: ['Cottage cheese 100g', '10g walnuts'], macros: { cal: 160, p: 14, c: 5, f: 10 } },
    ],
  },
  {
    id: 'calorie-deficit',
    name: 'Calorie Deficit Diet',
    goal: 'lose',
    duration: '8–12 weeks',
    dailyCalories: '1600–1900 kcal',
    description: 'Fat loss through a controlled calorie deficit. High protein minimises muscle loss. A sustainable and healthy approach to weight reduction.',
    macroSplit: { protein: '40%', carbs: '30%', fat: '30%' },
    keyPoints: [
      'Take 2.0–2.5 g/kg protein — prevent muscle loss',
      'Keep the deficit to 400–600 kcal/day',
      'High-fibre foods keep you full (veg, legumes, wholegrains)',
      'Cut out sugary drinks completely',
      'Aim for 0.5–0.7 kg loss per week',
      'If hungry, reach for protein or vegetables',
    ],
    sampleDay: [
      { time: '08:00', label: 'Breakfast', foods: ['3 egg whites + 1 whole egg omelette', 'Tomato + pepper + greens', '1 slice whole wheat bread'], macros: { cal: 280, p: 26, c: 18, f: 12 } },
      { time: '10:30', label: 'Snack', foods: ['Low-fat Greek yogurt 150g', '1 apple'], macros: { cal: 140, p: 16, c: 18, f: 1 } },
      { time: '13:00', label: 'Lunch', foods: ['Grilled chicken breast 200g', 'Large green salad', 'Bulgur 100g (cooked)', '1 tsp olive oil'], macros: { cal: 450, p: 50, c: 32, f: 12 } },
      { time: '16:00', label: 'Snack', foods: ['15g almonds', '1 raw carrot'], macros: { cal: 130, p: 4, c: 10, f: 9 } },
      { time: '19:00', label: 'Dinner', foods: ['Oven-baked sea bass 200g', 'Steamed broccoli + cauliflower 200g', '1 tsp olive oil'], macros: { cal: 350, p: 46, c: 10, f: 12 } },
      { time: '21:00', label: 'Night (optional)', foods: ['Cottage cheese 100g', 'Cucumber'], macros: { cal: 95, p: 13, c: 5, f: 2 } },
    ],
  },
  {
    id: 'low-carb',
    name: 'Low Carb Diet',
    goal: 'lose',
    duration: '6–10 weeks',
    dailyCalories: '1500–1800 kcal',
    description: 'Restricting carbohydrates drives the body toward fat burning. Keeping insulin low reduces fat storage.',
    macroSplit: { protein: '40%', carbs: '15%', fat: '45%' },
    keyPoints: [
      'Limit daily carbs to 50–80 g',
      'Remove bread, rice, pasta, and sugar',
      'Focus on protein and healthy fats',
      'Eat vegetables freely (non-starchy)',
      'Expect water weight loss in week 1 — real fat loss starts in week 2',
      'Watch electrolyte balance (sodium, potassium, magnesium)',
    ],
    sampleDay: [
      { time: '08:00', label: 'Breakfast', foods: ['3 eggs (in butter)', 'Half an avocado', '40g cheese', 'Tomato + cucumber'], macros: { cal: 520, p: 28, c: 10, f: 42 } },
      { time: '11:00', label: 'Snack', foods: ['30g walnuts', '1 slice of kashar cheese'], macros: { cal: 280, p: 12, c: 4, f: 25 } },
      { time: '13:30', label: 'Lunch', foods: ['Salmon 200g (grilled)', 'Sautéed spinach (with olive oil)', 'Yogurt 100g'], macros: { cal: 520, p: 42, c: 8, f: 36 } },
      { time: '16:30', label: 'Snack', foods: ['Greek yogurt 150g', '10g hazelnuts'], macros: { cal: 160, p: 16, c: 6, f: 8 } },
      { time: '19:30', label: 'Dinner', foods: ['Lamb chop 150g (grilled)', 'Mixed green salad', 'Olive oil + lemon dressing'], macros: { cal: 480, p: 38, c: 5, f: 34 } },
    ],
  },
  {
    id: 'intermittent-gain',
    name: 'Intermittent Fasting + Bulk',
    goal: 'gain',
    duration: '8–12 weeks',
    dailyCalories: '2600–3000 kcal',
    description: '16:8 intermittent fasting with a muscle-building goal. Eating window 12:00–20:00. Growth hormone boost + controlled surplus for clean muscle gains.',
    macroSplit: { protein: '30%', carbs: '45%', fat: '25%' },
    keyPoints: [
      '16-hour fast, 8-hour eating window (12:00–20:00)',
      'Make the first meal large — 35–40% of daily calories',
      'Train within the eating window',
      'During fasting: water, black tea/coffee allowed',
      'At least 40g protein per meal',
      'Stop eating by 20:00',
    ],
    sampleDay: [
      { time: '12:00', label: 'First Meal (Large)', foods: ['4-egg + cheese omelette', 'Oatmeal 80g + banana + honey', '2 slices whole wheat bread', '1 glass of milk'], macros: { cal: 950, p: 52, c: 100, f: 35 } },
      { time: '15:00', label: 'Snack', foods: ['Chicken wrap (flatbread + chicken + veggies)', '1 glass of kefir'], macros: { cal: 520, p: 40, c: 45, f: 18 } },
      { time: '17:00', label: 'Pre-Workout', foods: ['1 banana', '30g raisins', '20g almonds'], macros: { cal: 280, p: 6, c: 48, f: 10 } },
      { time: '19:30', label: 'Post-Workout', foods: ['Salmon 200g (baked)', 'White rice 250g', 'Broccoli 150g', '1 tbsp olive oil'], macros: { cal: 850, p: 50, c: 85, f: 30 } },
    ],
  },
  {
    id: 'high-protein-cut',
    name: 'High Protein Cut',
    goal: 'lose',
    duration: '6–8 weeks',
    dailyCalories: '1700–2000 kcal',
    description: 'High protein + low calorie combination for aggressive fat loss. Minimises muscle loss while delivering rapid fat reduction. Best paired with resistance training.',
    macroSplit: { protein: '45%', carbs: '25%', fat: '30%' },
    keyPoints: [
      '2.5–3.0 g/kg protein — muscle preservation priority',
      'At least 35g protein per meal',
      'Concentrate carbs around workouts (pre/post)',
      'Prefer omega-3 and olive oil as fat sources',
      'Target 0.7–1.0 kg loss per week',
      'Refeeding day: increase carbs once a week (for muscle fullness)',
    ],
    sampleDay: [
      { time: '07:30', label: 'Breakfast', foods: ['5 egg whites + 2 whole egg omelette', 'Spinach + tomato', 'Cottage cheese 50g'], macros: { cal: 340, p: 42, c: 6, f: 16 } },
      { time: '10:00', label: 'Snack', foods: ['Chicken breast 100g (cold, sliced)', '1 cucumber'], macros: { cal: 180, p: 32, c: 4, f: 4 } },
      { time: '13:00', label: 'Lunch', foods: ['Grilled turkey breast 200g', 'Mixed salad (lots of veg)', 'Bulgur 80g (cooked)', '1 tsp olive oil'], macros: { cal: 420, p: 52, c: 25, f: 12 } },
      { time: '16:00', label: 'Pre-Workout', foods: ['Low-fat Greek yogurt 200g', '1 apple'], macros: { cal: 170, p: 20, c: 22, f: 1 } },
      { time: '19:00', label: 'Dinner', foods: ['Tuna 200g (in water)', 'Steamed vegetables 200g', '1/3 avocado'], macros: { cal: 340, p: 48, c: 10, f: 12 } },
      { time: '21:00', label: 'Night', foods: ['Cottage cheese 100g', '5g hazelnuts'], macros: { cal: 120, p: 13, c: 4, f: 5 } },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════
// Pro Lock Gate — blurred overlay with upgrade CTA
// ═══════════════════════════════════════════════════════════════════════════

function ProLockGate({ children, onUpgrade }: { children: React.ReactNode; onUpgrade: () => void }) {
  const { strings } = useLocale()
  const s = strings.setup

  return (
    <div className="relative">
      {/* Blurred content underneath */}
      <div className="pointer-events-none select-none" style={{ filter: 'blur(4px)', opacity: 0.35 }}>
        {children}
      </div>

      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="absolute inset-0 flex flex-col items-center justify-center px-6"
      >
        <div className="bg-zinc-950/95 border border-zinc-800/60 rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl backdrop-blur-sm">
          <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Crown size={24} className="text-zinc-300" />
          </div>
          <p className="text-[17px] font-bold text-zinc-100 mb-1.5">{s.proFeatureTitle}</p>
          <p className="text-[13px] text-zinc-500 leading-relaxed mb-5">
            {s.proFeatureSubtitle}
          </p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onUpgrade}
            className="w-full bg-white text-black py-3.5 rounded-2xl text-[14px] font-bold flex items-center justify-center gap-2"
          >
            <Crown size={15} />
            {s.unlockPro}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// Sub-components
// ═══════════════════════════════════════════════════════════════════════════

function TabSwitcher({ mode, onChange }: { mode: FitnessTab; onChange: (m: FitnessTab) => void }) {
  const haptics = useHaptics()
  const { strings } = useLocale()
  return (
    <div className="flex bg-zinc-900 rounded-2xl p-1 border border-zinc-800/50 mb-6">
      {([
        { value: 'programs' as FitnessTab, label: strings.fitness.tabPrograms, icon: ClipboardList },
        { value: 'exercises' as FitnessTab, label: strings.fitness.tabExercises, icon: Dumbbell },
        { value: 'diets' as FitnessTab, label: strings.fitness.tabDiets, icon: Salad },
      ]).map((tab) => {
        const isActive = mode === tab.value
        const Icon = tab.icon
        return (
          <button type="button"
            key={tab.value}
            id={`fitness-tab-${tab.value}`}
            onClick={() => { haptics.selectionChanged(); onChange(tab.value) }}
            className={`
              flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-medium
              transition-all duration-200 active:scale-[0.98]
              ${isActive ? 'bg-white text-black shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}
            `}
          >
            <Icon size={16} />
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

function openYoutube(query: string) {
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&sp=EgIQAQ%3D%3D`
  import('@capacitor/browser')
    .then(({ Browser }) => Browser.open({ url, presentationStyle: 'popover' }))
    .catch(() => window.open(url, '_blank'))
}

function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const [expanded, setExpanded] = useState(false)
  const haptics = useHaptics()
  const { strings } = useLocale()

  const diffColor =
    (exercise.difficulty === 'Başlangıç' || exercise.difficulty === 'Beginner')
      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
      : (exercise.difficulty === 'Orta' || exercise.difficulty === 'Intermediate')
        ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
        : 'text-red-400 bg-red-500/10 border-red-500/20'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900 rounded-2xl border border-zinc-800/50 overflow-hidden"
    >
      <button type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full p-4 flex items-center gap-3 active:bg-zinc-800/40 transition-colors text-left"
      >
        <div className="w-11 h-11 rounded-xl bg-zinc-800 flex items-center justify-center text-lg flex-shrink-0">
          {exercise.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-zinc-100">{exercise.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${diffColor}`}>
              {exercise.difficulty}
            </span>
            <span className="text-[11px] text-zinc-500">{exercise.category}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-zinc-500 flex-shrink-0">
          <Flame size={13} />
          <span className="text-[11px] tabular-nums">{exercise.caloriesBurned.split('/')[0].trim()}</span>
        </div>
        <div className="flex-shrink-0 text-zinc-500 ml-1">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-zinc-800/40 space-y-4">
              {/* Description */}
              <p className="text-[12px] text-zinc-400 leading-relaxed">{exercise.description}</p>

              {/* Target muscles */}
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium mb-1.5">{strings.fitness.targetMuscles}</p>
                <div className="flex flex-wrap gap-1.5">
                  {exercise.targetMuscles.map((m) => (
                    <span key={m} className="text-[10px] text-zinc-300 bg-zinc-800/80 rounded-lg px-2.5 py-1 border border-zinc-700/30">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sets */}
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium mb-2">{strings.fitness.setplan}</p>
                <div className="space-y-1.5">
                  {exercise.sets.map((set, i) => (
                    <div key={i} className="flex items-center gap-3 bg-zinc-800/40 rounded-xl px-3 py-2.5">
                      <span className="text-[11px] font-bold text-zinc-400 w-12">Set {i + 1}</span>
                      <div className="flex items-center gap-1.5 flex-1">
                        {set.reps ? (
                          <>
                            <Repeat size={12} className="text-zinc-500" />
                            <span className="text-[12px] text-zinc-200 font-medium">{set.reps} {strings.fitness.reps}</span>
                          </>
                        ) : (
                          <>
                            <Timer size={12} className="text-zinc-500" />
                            <span className="text-[12px] text-zinc-200 font-medium">{set.duration}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={11} className="text-zinc-600" />
                        <span className="text-[11px] text-zinc-500">{set.rest} {strings.fitness.rest}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium mb-2">{strings.fitness.tips}</p>
                <div className="space-y-1.5">
                  {exercise.tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 size={12} className="text-zinc-600 flex-shrink-0 mt-0.5" />
                      <p className="text-[11px] text-zinc-400 leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* YouTube Shorts */}
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium mb-2">{strings.fitness.howTo}</p>
                <motion.button
                  onClick={() => { haptics.impactLight(); openYoutube(exercise.videoQuery) }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="w-full rounded-2xl overflow-hidden border border-zinc-700/40 active:brightness-90"
                >
                  {/* Thumbnail area */}
                  <div className="relative h-[72px] bg-zinc-800/80 flex items-center justify-center gap-3">
                    {/* Red play button */}
                    <div className="w-10 h-10 bg-[#FF0000] rounded-xl flex items-center justify-center shadow-lg shadow-red-900/30">
                      <Play size={18} className="text-white ml-0.5" fill="white" />
                    </div>
                    <div className="text-left">
                      <p className="text-[13px] font-semibold text-zinc-100">{exercise.name}</p>
                      <p className="text-[10px] text-zinc-400">{strings.fitness.howTo} · YouTube Shorts</p>
                    </div>
                    {/* YT Shorts badge */}
                    <div className="absolute top-2.5 right-3 flex items-center gap-1">
                      <div className="w-3 h-3 bg-[#FF0000] rounded-sm" />
                      <span className="text-[9px] font-bold text-zinc-300 tracking-wide">Shorts</span>
                    </div>
                  </div>
                  {/* Bottom bar */}
                  <div className="bg-zinc-800/50 px-4 py-2.5 flex items-center justify-between">
                    <span className="text-[11px] text-zinc-400">{strings.fitness.watchOnYoutube}</span>
                    <ExternalLink size={12} className="text-zinc-500" />
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function DietCard({ diet }: { diet: Diet }) {
  const [expanded, setExpanded] = useState(false)
  const { strings } = useLocale()
  const f = strings.fitness
  const c = strings.common

  const goalColor = diet.goal === 'gain'
    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    : diet.goal === 'maintain'
      ? 'text-sky-400 bg-sky-500/10 border-sky-500/20'
      : 'text-orange-400 bg-orange-500/10 border-orange-500/20'
  const GoalIcon = diet.goal === 'gain' ? TrendingUp : diet.goal === 'maintain' ? Target : TrendingDown
  const goalText = diet.goal === 'gain' ? strings.goals.gainWeight : diet.goal === 'maintain' ? strings.goals.maintain : strings.goals.loseWeight

  const mealTimeIcon = (time: string) => {
    const hour = parseInt(time)
    if (hour < 10) return Sun
    if (hour < 14) return Coffee
    if (hour < 18) return Sunset
    return Moon
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900 rounded-2xl border border-zinc-800/50 overflow-hidden"
    >
      <button type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full p-4 flex items-center gap-3 active:bg-zinc-800/40 transition-colors text-left"
      >
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border ${goalColor}`}>
          <GoalIcon size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-zinc-100">{diet.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${goalColor}`}>
              {goalText}
            </span>
            <span className="text-[11px] text-zinc-500">{diet.duration}</span>
          </div>
        </div>
        <div className="text-right flex-shrink-0 mr-1">
          <p className="text-[12px] font-bold text-zinc-200 tabular-nums">{diet.dailyCalories.split('-')[0]}</p>
          <p className="text-[9px] text-zinc-500 uppercase">{f.perDay}</p>
        </div>
        <div className="flex-shrink-0 text-zinc-500 ml-1">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-zinc-800/40 space-y-4">
              {/* Description */}
              <p className="text-[12px] text-zinc-400 leading-relaxed">{diet.description}</p>

              {/* Macro split */}
              <div className="flex gap-2">
                <MacroBadge icon={Beef} label={c.protein} value={diet.macroSplit.protein} />
                <MacroBadge icon={Wheat} label={c.carbs} value={diet.macroSplit.carbs} />
                <MacroBadge icon={Droplets} label={c.fat} value={diet.macroSplit.fat} />
              </div>

              {/* Key points */}
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium mb-2">{f.tips}</p>
                <div className="space-y-1.5">
                  {diet.keyPoints.map((point, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Zap size={11} className="text-zinc-600 flex-shrink-0 mt-0.5" />
                      <p className="text-[11px] text-zinc-400 leading-relaxed">{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample day */}
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium mb-2">{f.weeklySchedule}</p>
                <div className="space-y-2">
                  {diet.sampleDay.map((meal, i) => {
                    const TimeIcon = mealTimeIcon(meal.time)
                    return (
                      <div key={i} className="bg-zinc-800/40 rounded-xl px-3 py-3">
                        <div className="flex items-center gap-2 mb-2">
                          <TimeIcon size={12} className="text-zinc-500" />
                          <span className="text-[11px] font-bold text-zinc-300">{meal.time}</span>
                          <span className="text-[11px] text-zinc-500">—</span>
                          <span className="text-[11px] font-medium text-zinc-300">{meal.label}</span>
                          <span className="ml-auto text-[10px] text-zinc-500 tabular-nums">
                            {meal.macros.cal} kcal
                          </span>
                        </div>
                        <div className="space-y-0.5 mb-2">
                          {meal.foods.map((food, j) => (
                            <div key={j} className="flex items-center gap-1.5">
                              <Apple size={10} className="text-zinc-600 flex-shrink-0" />
                              <p className="text-[11px] text-zinc-400">{food}</p>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-3 pt-1.5 border-t border-zinc-700/30">
                          <span className="text-[9px] text-zinc-500">P: <span className="text-zinc-400 font-medium">{meal.macros.p}g</span></span>
                          <span className="text-[9px] text-zinc-500">C: <span className="text-zinc-400 font-medium">{meal.macros.c}g</span></span>
                          <span className="text-[9px] text-zinc-500">F: <span className="text-zinc-400 font-medium">{meal.macros.f}g</span></span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Day total */}
                {(() => {
                  const totals = diet.sampleDay.reduce((acc, m) => ({
                    cal: acc.cal + m.macros.cal,
                    p: acc.p + m.macros.p,
                    c: acc.c + m.macros.c,
                    f: acc.f + m.macros.f,
                  }), { cal: 0, p: 0, c: 0, f: 0 })
                  return (
                    <div className="mt-2 bg-zinc-800/60 rounded-xl px-3 py-2.5 flex items-center justify-between">
                      <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">{f.yourTarget}</span>
                      <div className="flex gap-4">
                        <span className="text-[11px] font-bold text-zinc-200 tabular-nums">{totals.cal} kcal</span>
                        <span className="text-[10px] text-zinc-400 tabular-nums">P:{totals.p}g</span>
                        <span className="text-[10px] text-zinc-400 tabular-nums">C:{totals.c}g</span>
                        <span className="text-[10px] text-zinc-400 tabular-nums">F:{totals.f}g</span>
                      </div>
                    </div>
                  )
                })()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function MacroBadge({ icon: Icon, label, value }: { icon: typeof Beef; label: string; value: string }) {
  return (
    <div className="flex-1 flex items-center justify-center gap-1.5 bg-zinc-800/50 rounded-xl py-2 border border-zinc-700/20">
      <Icon size={12} className="text-zinc-500" />
      <span className="text-[10px] text-zinc-400">{label}</span>
      <span className="text-[11px] font-bold text-zinc-200">{value}</span>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// Workout Program Card — coach-written structured training plan
// ═══════════════════════════════════════════════════════════════════════════

const PROGRAM_GOAL_COLORS: Record<ProgramGoal, { color: string; Icon: typeof TrendingUp }> = {
  lose: { color: 'text-orange-400 bg-orange-500/10 border-orange-500/20', Icon: TrendingDown },
  gain: { color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', Icon: TrendingUp },
  maintain: { color: 'text-sky-400 bg-sky-500/10 border-sky-500/20', Icon: Target },
}

function ProgramCard({ program, recommended }: { program: WorkoutProgram; recommended?: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const { strings, locale } = useLocale()
  const f = strings.fitness
  const meta = PROGRAM_GOAL_COLORS[program.goal]
  const goalLabel = program.goal === 'gain' ? strings.goals.gainWeight : program.goal === 'maintain' ? strings.goals.maintain : strings.goals.loseWeight
  const GoalIcon = meta.Icon

  const isBeginnerLevel = program.level === 'Başlangıç' || program.level === 'Beginner'
  const isIntermediateLevel = program.level === 'Orta' || program.level === 'Intermediate'
  const diffColor =
    isBeginnerLevel ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
    isIntermediateLevel ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
    'text-red-400 bg-red-500/10 border-red-500/20'
  const levelLabel = locale === 'en'
    ? (isBeginnerLevel ? 'Beginner' : isIntermediateLevel ? 'Intermediate' : 'Advanced')
    : (program.level === 'Beginner' ? 'Başlangıç' : program.level === 'Intermediate' ? 'Orta' : program.level === 'Advanced' ? 'İleri' : program.level)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-zinc-900 rounded-2xl border overflow-hidden ${recommended ? 'border-amber-500/30' : 'border-zinc-800/50'}`}
    >
      <button type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full p-4 flex items-center gap-3 active:bg-zinc-800/40 transition-colors text-left"
      >
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border ${meta.color}`}>
          <GoalIcon size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-[14px] font-semibold text-zinc-100 truncate">{program.name}</p>
            {recommended && <Crown size={12} className="text-amber-400 flex-shrink-0" />}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${diffColor}`}>{levelLabel}</span>
            <span className="text-[11px] text-zinc-500">{program.daysPerWeek} {f.perWeek}</span>
          </div>
        </div>
        <div className="flex-shrink-0 text-zinc-500 ml-1">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-zinc-800/40 space-y-4">
              {/* Meta + description */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${meta.color}`}>{goalLabel}</span>
                <span className="text-[10px] text-zinc-300 bg-zinc-800/80 rounded-md px-2 py-0.5 border border-zinc-700/30">{program.split}</span>
                <span className="text-[10px] text-zinc-300 bg-zinc-800/80 rounded-md px-2 py-0.5 border border-zinc-700/30">{program.duration}</span>
              </div>
              <p className="text-[12px] text-zinc-400 leading-relaxed">{program.description}</p>

              {/* Weekly schedule */}
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium mb-2 flex items-center gap-1.5">
                  <CalendarDays size={11} /> {f.weeklySchedule}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {program.weeklySchedule.map((d, i) => (
                    <span key={i} className="text-[10px] text-zinc-300 bg-zinc-800/60 rounded-lg px-2.5 py-1 border border-zinc-700/30">{d}</span>
                  ))}
                </div>
              </div>

              {/* Warm-up */}
              <div className="bg-zinc-800/40 rounded-xl px-3 py-2.5">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium mb-1 flex items-center gap-1.5">
                  <Flame size={11} /> {f.warmup}
                </p>
                <p className="text-[11px] text-zinc-400 leading-relaxed">{program.warmup}</p>
              </div>

              {/* Days */}
              {program.days.map((day, di) => (
                <div key={di}>
                  <p className="text-[12px] font-semibold text-zinc-200">{day.title}</p>
                  <p className="text-[10px] text-zinc-500 mb-2">{day.focus}</p>
                  <div className="space-y-1.5">
                    {day.exercises.map((ex, ei) => (
                      <div key={ei} className="bg-zinc-800/40 rounded-xl px-3 py-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[12px] text-zinc-200 font-medium flex-1 min-w-0">{ex.name}</span>
                          <span className="text-[11px] text-zinc-400 tabular-nums flex-shrink-0">{ex.sets} × {ex.reps}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] text-zinc-500 flex items-center gap-1"><Clock size={9} /> {ex.rest}</span>
                          {ex.tempo && <span className="text-[10px] text-zinc-500">Tempo {ex.tempo}</span>}
                        </div>
                        {ex.note && <p className="text-[10px] text-zinc-500 mt-1 leading-snug">{ex.note}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Progression */}
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium mb-2 flex items-center gap-1.5">
                  <TrendingUp size={11} /> {f.progression}
                </p>
                <div className="space-y-1.5">
                  {program.progression.map((p, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Zap size={11} className="text-zinc-600 flex-shrink-0 mt-0.5" />
                      <p className="text-[11px] text-zinc-400 leading-relaxed">{p}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coach tips */}
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium mb-2 flex items-center gap-1.5">
                  <Trophy size={11} /> {f.coachTips}
                </p>
                <div className="space-y-1.5">
                  {program.coachTips.map((t, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 size={11} className="text-zinc-600 flex-shrink-0 mt-0.5" />
                      <p className="text-[11px] text-zinc-400 leading-relaxed">{t}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// Personalized recommendation — Pro feature driven by the user's profile
// ═══════════════════════════════════════════════════════════════════════════

// Midpoint of a "2800-3200 kcal" style range, used to match plans to the target.
function calorieMidpoint(range: string): number {
  const nums = range.match(/\d+/g)?.map(Number) ?? []
  if (nums.length >= 2) return (nums[0] + nums[1]) / 2
  return nums[0] ?? 0
}

function pickRecommendedDiet(goal: FitnessGoal, targetCalories: number, diets: Diet[] = DIETS): Diet {
  const dietGoal = goal === 'gain_weight' ? 'gain' : goal === 'lose_weight' ? 'lose' : null
  const pool = dietGoal ? diets.filter((d) => d.goal === dietGoal) : diets
  const candidates = pool.length > 0 ? pool : diets
  return candidates.reduce((best, d) =>
    Math.abs(calorieMidpoint(d.dailyCalories) - targetCalories) <
    Math.abs(calorieMidpoint(best.dailyCalories) - targetCalories)
      ? d
      : best
  )
}

function goalToProgramGoal(goal: FitnessGoal): ProgramGoal {
  return goal === 'gain_weight' ? 'gain' : goal === 'lose_weight' ? 'lose' : 'maintain'
}

function PersonalPlanCard({
  profile,
  customProgram,
  customDiet,
  onViewDiet,
  onViewProgram,
}: {
  profile: UserProfile
  customProgram?: WorkoutProgram | null
  customDiet?: Diet | null
  onViewDiet: () => void
  onViewProgram: () => void
}) {
  const haptics = useHaptics()
  const { strings, locale } = useLocale()
  const f = strings.fitness
  const metrics = profile.bodyMetrics
  if (!metrics) return null

  const goal = metrics.goal
  const goalLabel =
    goal === 'lose_weight' ? strings.setup.loseWeight :
    goal === 'gain_weight' ? strings.setup.gainWeight :
    strings.setup.maintain
  const target = profile.dailyGoal
  const activeDietsForPersonal = locale === 'en' ? DIETS_EN : DIETS
  const displayedDiet = customDiet ?? pickRecommendedDiet(goal, target.calories, activeDietsForPersonal)
  const displayedProgram = customProgram ?? getProgramForGoal(goalToProgramGoal(goal), locale)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-6 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.07] to-zinc-900 overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
          <Sparkles size={17} className="text-amber-300" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-[14px] font-bold text-zinc-100">{f.personalTitle}</p>
            <Crown size={12} className="text-amber-400" />
          </div>
          <p className="text-[11px] text-zinc-500">{f.personalSubtitle}</p>
        </div>
        <span className="text-[10px] font-medium text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-md px-2 py-0.5 flex-shrink-0">
          {goalLabel}
        </span>
      </div>

      {/* Daily target */}
      <div className="px-4 pb-3">
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium mb-2 flex items-center gap-1.5">
          <Target size={11} /> {f.yourTarget}
        </p>
        <div className="bg-zinc-900/70 rounded-xl px-3 py-2.5 flex items-center justify-between">
          <div>
            <p className="text-[18px] font-bold text-zinc-100 tabular-nums leading-none">{target.calories}</p>
            <p className="text-[9px] text-zinc-500 uppercase mt-0.5">{f.perDay}</p>
          </div>
          <div className="flex gap-3">
            <div className="text-center">
              <p className="text-[12px] font-bold text-zinc-200 tabular-nums">{target.protein}g</p>
              <p className="text-[9px] text-zinc-500">P</p>
            </div>
            <div className="text-center">
              <p className="text-[12px] font-bold text-zinc-200 tabular-nums">{target.carbs}g</p>
              <p className="text-[9px] text-zinc-500">K</p>
            </div>
            <div className="text-center">
              <p className="text-[12px] font-bold text-zinc-200 tabular-nums">{target.fat}g</p>
              <p className="text-[9px] text-zinc-500">Y</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended or Custom diet */}
      <button type="button"
        onClick={() => { haptics.selectionChanged(); onViewDiet() }}
        className="w-full px-4 pb-2.5 text-left active:opacity-80 transition-opacity"
      >
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium mb-2 flex items-center gap-1.5">
          <Salad size={11} /> {customDiet ? f.yourDietPlan : f.recommendedDiet}
        </p>
        <div className="bg-zinc-900/70 rounded-xl px-3 py-2.5 flex items-center gap-2.5">
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-zinc-100 truncate">{displayedDiet.name}</p>
            <p className="text-[11px] text-zinc-500 tabular-nums">{displayedDiet.dailyCalories} · {displayedDiet.duration}</p>
          </div>
          <span className="text-[11px] font-medium text-amber-300 flex items-center gap-1 flex-shrink-0">
            {f.viewPlan} <ArrowRight size={13} />
          </span>
        </div>
      </button>

      {/* Recommended or Custom training program */}
      <button type="button"
        onClick={() => { haptics.selectionChanged(); onViewProgram() }}
        className="w-full px-4 pb-4 text-left active:opacity-80 transition-opacity"
      >
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium mb-2 flex items-center gap-1.5">
          <ClipboardList size={11} /> {customProgram ? f.yourProgram : f.recommendedProgram}
        </p>
        <div className="bg-zinc-900/70 rounded-xl px-3 py-2.5 flex items-center gap-2.5">
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-zinc-100 truncate">{displayedProgram.name}</p>
            <p className="text-[11px] text-zinc-500">{displayedProgram.level} · {displayedProgram.daysPerWeek} {f.perWeek} · {displayedProgram.split}</p>
          </div>
          <span className="text-[11px] font-medium text-amber-300 flex items-center gap-1 flex-shrink-0">
            {f.viewProgram} <ArrowRight size={13} />
          </span>
        </div>
      </button>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// Main Page
// ═══════════════════════════════════════════════════════════════════════════

export default function FitnessPage() {
  const [mode, setMode] = useState<FitnessTab>('programs')
  const { strings, locale } = useLocale()
  const { user } = useAuth()
  const { isPro } = useSubscription(user?.uid)
  const navigate = useNavigate()

  const activeDiets = locale === 'en' ? DIETS_EN : DIETS
  const gainDiets = activeDiets.filter((d) => d.goal === 'gain')
  const loseDiets = activeDiets.filter((d) => d.goal === 'lose')

  const activeExercises = locale === 'en' ? EXERCISES_EN : EXERCISES
  const activeExerciseCategories = locale === 'en' ? EXERCISE_CATEGORIES_EN : EXERCISE_CATEGORIES_TR

  const activePrograms = getWorkoutPrograms(locale)

  const recommendedProgramId = user?.bodyMetrics
    ? getProgramForGoal(goalToProgramGoal(user.bodyMetrics.goal), locale).id
    : null
  const orderedPrograms = recommendedProgramId
    ? [...activePrograms].sort((a, b) =>
        a.id === recommendedProgramId ? -1 : b.id === recommendedProgramId ? 1 : 0
      )
    : activePrograms

  // Kişiye özel (anketle üretilen) program — kullanıcı başına localStorage'da saklanır.
  const customKey = user?.uid ? `makrofy_custom_program_${user.uid}` : null
  const [customProgram, setCustomProgram] = useState<WorkoutProgram | null>(() => {
    try {
      const raw = customKey ? localStorage.getItem(customKey) : null
      return raw ? (JSON.parse(raw) as WorkoutProgram) : null
    } catch {
      return null
    }
  })
  const [surveyOpen, setSurveyOpen] = useState(false)

  const handleSurveyComplete = (answers: SurveyAnswers) => {
    const program = generateProgram({ ...answers, locale })
    setCustomProgram(program)
    if (customKey) localStorage.setItem(customKey, JSON.stringify(program))
    setSurveyOpen(false)
  }

  // Kişiye özel (anketle üretilen) beslenme planı.
  const dietKey = user?.uid ? `makrofy_custom_diet_${user.uid}` : null
  const [customDiet, setCustomDiet] = useState<Diet | null>(() => {
    try {
      const raw = dietKey ? localStorage.getItem(dietKey) : null
      return raw ? (JSON.parse(raw) as Diet) : null
    } catch {
      return null
    }
  })
  const [dietSurveyOpen, setDietSurveyOpen] = useState(false)

  const handleDietComplete = (answers: DietSurveyAnswers) => {
    const target = user?.dailyGoal ?? { calories: 2000, protein: 150, carbs: 200, fat: 65 }
    const diet = generateDiet({ ...answers, locale }, target)
    setCustomDiet(diet)
    if (dietKey) localStorage.setItem(dietKey, JSON.stringify(diet))
    setDietSurveyOpen(false)
  }

  const handleUpgrade = () => navigate('/paywall')

  return (
    <div className="px-5 pt-14 pb-8 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-5"
        >
          <h1 className="text-[26px] font-bold tracking-tight">{strings.fitness.title}</h1>
          <p className="text-zinc-400 text-sm mt-1 leading-relaxed">
            {strings.fitness.subtitle}
          </p>
        </motion.div>

        {/* Workout Tracker entry card */}
        <motion.button
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          onClick={() => navigate('/workout')}
          className="w-full flex items-center gap-3 bg-zinc-900/60 rounded-2xl p-4 mb-4 text-left active:scale-[0.98] transition-transform"
        >
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <ClipboardList size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white">{strings.workout.entryCard}</div>
            <div className="text-[12px] text-zinc-400 mt-0.5 truncate">{strings.workout.entryCardSub}</div>
          </div>
          <ArrowRight size={16} className="text-zinc-500 shrink-0" />
        </motion.button>

        {/* Personalized recommendation — Pro only, built from the user's existing goal data */}
        {isPro && user?.bodyMetrics && (
          <PersonalPlanCard
            profile={user}
            customProgram={customProgram}
            customDiet={customDiet}
            onViewDiet={() => setMode('diets')}
            onViewProgram={() => setMode('programs')}
          />
        )}

        {/* Tab Switcher */}
        <TabSwitcher mode={mode} onChange={setMode} />

        {/* PROGRAMS TAB */}
        <AnimatePresence mode="wait">
          {mode === 'programs' && (
            <motion.div
              key="programs-tab"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
            >
              {isPro ? (
                surveyOpen ? (
                  <ProgramSurvey
                    onComplete={handleSurveyComplete}
                    onPickReady={() => setSurveyOpen(false)}
                    onCancel={() => setSurveyOpen(false)}
                  />
                ) : (
                  <div className="space-y-5">
                    {/* Kişiye özel program (varsa) veya oluşturma çağrısı */}
                    {customProgram ? (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles size={14} className="text-amber-300" />
                          <h2 className="text-[13px] font-semibold text-amber-300 uppercase tracking-wider">{strings.fitness.yourProgram}</h2>
                        </div>
                        <ProgramCard program={customProgram} recommended />
                        <button type="button"
                          onClick={() => setSurveyOpen(true)}
                          className="w-full mt-2.5 bg-zinc-900 border border-zinc-800/50 rounded-xl py-3 text-[12px] font-medium text-zinc-300 active:scale-[0.99] transition-transform flex items-center justify-center gap-2"
                        >
                          <ClipboardList size={13} /> {strings.fitness.retakeSurvey}
                        </button>
                      </div>
                    ) : (
                      <button type="button"
                        onClick={() => setSurveyOpen(true)}
                        className="w-full rounded-2xl border border-amber-500/25 bg-gradient-to-br from-amber-500/[0.08] to-zinc-900 p-4 flex items-center gap-3 text-left active:scale-[0.99] transition-transform"
                      >
                        <div className="w-11 h-11 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                          <Sparkles size={20} className="text-amber-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] font-bold text-zinc-100">{strings.fitness.buildCustom}</p>
                          <p className="text-[11px] text-zinc-500">{strings.fitness.buildCustomSub}</p>
                        </div>
                        <ArrowRight size={16} className="text-amber-300 flex-shrink-0" />
                      </button>
                    )}

                    {/* Hazır programlar */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <ClipboardList size={14} className="text-zinc-300" />
                        <h2 className="text-[13px] font-semibold text-zinc-300 uppercase tracking-wider">{strings.fitness.programsTitle}</h2>
                        <span className="text-[11px] text-zinc-600 tabular-nums">{activePrograms.length} {strings.fitness.programs}</span>
                      </div>
                      <div className="space-y-2.5">
                        {orderedPrograms.map((program, i) => (
                          <motion.div
                            key={program.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: i * 0.05 }}
                          >
                            <ProgramCard program={program} recommended={!customProgram && program.id === recommendedProgramId} />
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <p className="text-center text-[10px] text-zinc-600 leading-relaxed whitespace-pre-line">
                      {strings.fitness.disclaimer}
                    </p>
                  </div>
                )
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <ClipboardList size={14} className="text-zinc-300" />
                    <h2 className="text-[13px] font-semibold text-zinc-300 uppercase tracking-wider">{strings.fitness.programsTitle}</h2>
                  </div>
                  <ProLockGate onUpgrade={handleUpgrade}>
                    <div className="space-y-2.5" style={{ pointerEvents: 'none' }}>
                      {activePrograms.slice(0, 2).map((program) => (
                        <ProgramCard key={program.id} program={program} />
                      ))}
                    </div>
                  </ProLockGate>
                </>
              )}
            </motion.div>
          )}

          {/* EXERCISES TAB */}
          {mode === 'exercises' && (
            <motion.div
              key="exercises-tab"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
            >
              {/* Pro lock wrapper — free users see blurred teaser */}
              {isPro ? (
                <div className="space-y-6">
                  {activeExerciseCategories.map((category) => {
                    const exercises = activeExercises.filter((e) => e.category === category)
                    const meta = CATEGORY_META[category]
                    return (
                      <section key={category}>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-sm" aria-hidden="true">{meta.emoji}</span>
                          <h2 className={`text-[13px] font-semibold uppercase tracking-wider ${meta.colorClass}`}>
                            {category}
                          </h2>
                          <span className="text-[11px] text-zinc-600 tabular-nums">{exercises.length} {strings.fitness.exercises}</span>
                        </div>
                        <div className="space-y-2.5">
                          {exercises.map((exercise, i) => (
                            <motion.div
                              key={exercise.id}
                              initial={{ opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: i * 0.04 }}
                            >
                              <ExerciseCard exercise={exercise} />
                            </motion.div>
                          ))}
                        </div>
                      </section>
                    )
                  })}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center text-[10px] text-zinc-600 mt-6 leading-relaxed whitespace-pre-line"
                  >
                    {strings.fitness.disclaimer}
                  </motion.p>
                </div>
              ) : (
                <ProLockGate onUpgrade={handleUpgrade}>
                  <div className="space-y-6" style={{ pointerEvents: 'none' }}>
                    {activeExerciseCategories.slice(0, 2).map((category) => {
                      const exercises = activeExercises.filter((e) => e.category === category).slice(0, 2)
                      const meta = CATEGORY_META[category]
                      return (
                        <section key={category}>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm">{meta.emoji}</span>
                            <h2 className={`text-[13px] font-semibold uppercase tracking-wider ${meta.colorClass}`}>{category}</h2>
                          </div>
                          <div className="space-y-2.5">
                            {exercises.map((exercise) => (
                              <ExerciseCard key={exercise.id} exercise={exercise} />
                            ))}
                          </div>
                        </section>
                      )
                    })}
                  </div>
                </ProLockGate>
              )}
            </motion.div>
          )}

          {/* DIETS TAB */}
          {mode === 'diets' && (
            <motion.div
              key="diets-tab"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.25 }}
            >
              {isPro ? (
                dietSurveyOpen ? (
                  <DietSurvey
                    onComplete={handleDietComplete}
                    onPickReady={() => setDietSurveyOpen(false)}
                    onCancel={() => setDietSurveyOpen(false)}
                  />
                ) : (
                  <div className="space-y-6">
                    {/* Kişiye özel beslenme planı veya oluşturma çağrısı */}
                    {customDiet ? (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles size={14} className="text-emerald-300" />
                          <h2 className="text-[13px] font-semibold text-emerald-300 uppercase tracking-wider">{strings.fitness.yourDietPlan}</h2>
                        </div>
                        <DietCard diet={customDiet} />
                        <button type="button"
                          onClick={() => setDietSurveyOpen(true)}
                          className="w-full mt-2.5 bg-zinc-900 border border-zinc-800/50 rounded-xl py-3 text-[12px] font-medium text-zinc-300 active:scale-[0.99] transition-transform flex items-center justify-center gap-2"
                        >
                          <Salad size={13} /> {strings.fitness.retakeSurvey}
                        </button>
                      </div>
                    ) : (
                      <button type="button"
                        onClick={() => setDietSurveyOpen(true)}
                        className="w-full rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/[0.08] to-zinc-900 p-4 flex items-center gap-3 text-left active:scale-[0.99] transition-transform"
                      >
                        <div className="w-11 h-11 rounded-xl bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                          <Sparkles size={20} className="text-emerald-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] font-bold text-zinc-100">{strings.fitness.buildCustomDiet}</p>
                          <p className="text-[11px] text-zinc-500">{strings.fitness.buildCustomDietSub}</p>
                        </div>
                        <ArrowRight size={16} className="text-emerald-300 flex-shrink-0" />
                      </button>
                    )}

                    {/* Weight gain section */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingUp size={14} className="text-emerald-400" />
                        <h2 className="text-[13px] font-semibold text-zinc-300 uppercase tracking-wider">{strings.fitness.weightGain}</h2>
                        <span className="text-[11px] text-zinc-600 tabular-nums">{gainDiets.length} {strings.fitness.plans}</span>
                      </div>
                      <div className="space-y-2.5">
                        {gainDiets.map((diet, i) => (
                          <motion.div key={diet.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}>
                            <DietCard diet={diet} />
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Weight loss section */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingDown size={14} className="text-orange-400" />
                        <h2 className="text-[13px] font-semibold text-zinc-300 uppercase tracking-wider">{strings.fitness.weightLoss}</h2>
                        <span className="text-[11px] text-zinc-600 tabular-nums">{loseDiets.length} {strings.fitness.plans}</span>
                      </div>
                      <div className="space-y-2.5">
                        {loseDiets.map((diet, i) => (
                          <motion.div key={diet.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}>
                            <DietCard diet={diet} />
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <p className="text-center text-[10px] text-zinc-600 leading-relaxed whitespace-pre-line">
                      {strings.fitness.dietDisclaimer}
                    </p>
                  </div>
                )
              ) : (
                <ProLockGate onUpgrade={handleUpgrade}>
                  <div style={{ pointerEvents: 'none' }}>
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingUp size={14} className="text-emerald-400" />
                        <h2 className="text-[13px] font-semibold text-zinc-300 uppercase tracking-wider">{strings.fitness.weightGain}</h2>
                      </div>
                      <div className="space-y-2.5">
                        {gainDiets.slice(0, 1).map((diet) => <DietCard key={diet.id} diet={diet} />)}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingDown size={14} className="text-orange-400" />
                        <h2 className="text-[13px] font-semibold text-zinc-300 uppercase tracking-wider">{strings.fitness.weightLoss}</h2>
                      </div>
                      <div className="space-y-2.5">
                        {loseDiets.slice(0, 1).map((diet) => <DietCard key={diet.id} diet={diet} />)}
                      </div>
                    </div>
                  </div>
                </ProLockGate>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
