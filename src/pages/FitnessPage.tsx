import { useState, useEffect, useMemo } from 'react'
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
  Target,
  ArrowRight,
  ClipboardList,
  CalendarDays,
  Trophy,
} from 'lucide-react'
import type { FitnessGoal } from '../types/user'
import { getWorkoutPrograms, getProgramForGoal, type WorkoutProgram, type ProgramGoal } from '../data/workoutPrograms'
import type { Diet } from '../data/dietGenerator'
import AIProgramBuilder, { AIProgramLockedPreview } from '../components/fitness/AIProgramBuilder'
import type { AIProgram } from '../types/aiProgram'
import { fetchActiveProgram } from '../services/aiProgramService'

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
// German categories (same internal order)
const EXERCISE_CATEGORIES_DE = ['Cardio', 'Rumpf', 'Brust', 'Arme & Handgelenke'] as const
// French categories (same internal order)
const EXERCISE_CATEGORIES_FR = ['Cardio', 'Gainage', 'Pectoraux', 'Bras & Poignets'] as const
// Spanish categories (same internal order)
const EXERCISE_CATEGORIES_ES = ['Cardio', 'Core', 'Pecho', 'Brazos y Muñecas'] as const
// Italian categories (same internal order)
const EXERCISE_CATEGORIES_IT = ['Cardio', 'Core', 'Petto', 'Braccia e Polsi'] as const

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
  // German
  Rumpf: { emoji: '⚡', colorClass: 'text-yellow-400' },
  Brust: { emoji: '💪', colorClass: 'text-blue-400' },
  'Arme & Handgelenke': { emoji: '🦾', colorClass: 'text-purple-400' },
  // French
  Gainage: { emoji: '⚡', colorClass: 'text-yellow-400' },
  Pectoraux: { emoji: '💪', colorClass: 'text-blue-400' },
  'Bras & Poignets': { emoji: '🦾', colorClass: 'text-purple-400' },
  // Spanish
  Pecho: { emoji: '💪', colorClass: 'text-blue-400' },
  'Brazos y Muñecas': { emoji: '🦾', colorClass: 'text-purple-400' },
  // Italian
  Petto: { emoji: '💪', colorClass: 'text-blue-400' },
  'Braccia e Polsi': { emoji: '🦾', colorClass: 'text-purple-400' },
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

const EXERCISES_DE: Exercise[] = [
  // ── CARDIO ───────────────────────────────────────────────────────────────
  {
    id: 'jumping-jack',
    name: 'Hampelmänner',
    category: 'Cardio',
    difficulty: 'Beginner',
    targetMuscles: ['Herz-Kreislauf', 'Beine', 'Schultern'],
    caloriesBurned: '80–120 kcal / 10 Min',
    icon: '⭐',
    description: 'Beginne mit geschlossenen Füßen und den Armen seitlich am Körper. Springe und spreize die Beine, während du die Arme über den Kopf führst, dann zurück in die Ausgangsposition. Ideal zum Aufwärmen und um den Puls hochzutreiben.',
    sets: [
      { duration: '30 Sek', rest: '15 Sek' },
      { duration: '40 Sek', rest: '15 Sek' },
      { duration: '45 Sek', rest: '20 Sek' },
    ],
    tips: [
      'Lande weich auf den Fußballen',
      'Öffne und schließe die Arme vollständig',
      'Halte das Tempo hoch, aber opfere nicht die Form',
      'In einer Wohnung statt zu springen seitlich ausschreiten',
    ],
    videoQuery: 'jumping jacks exercise tutorial',
  },
  {
    id: 'high-knees',
    name: 'Knieheben',
    category: 'Cardio',
    difficulty: 'Intermediate',
    targetMuscles: ['Herz-Kreislauf', 'Hüftbeuger', 'Quadrizeps', 'Rumpf'],
    caloriesBurned: '100–140 kcal / 10 Min',
    icon: '🏃',
    description: 'Laufe auf der Stelle und ziehe die Knie bis auf Hüfthöhe hoch. Pumpe die Arme aktiv im Laufrhythmus und ziele auf kurze Intervalle bei hohem Tempo.',
    sets: [
      { duration: '20 Sek', rest: '15 Sek' },
      { duration: '30 Sek', rest: '15 Sek' },
      { duration: '30 Sek', rest: '20 Sek' },
      { duration: '30 Sek', rest: '30 Sek' },
    ],
    tips: [
      'Ziehe die Knie bis auf Taillenhöhe',
      'Halte die Brust offen, Blick nach vorn',
      'Lass die Arme den Rhythmus unterstützen',
      'Werde langsamer, wenn dir die Puste ausgeht',
    ],
    videoQuery: 'high knees exercise tutorial',
  },
  {
    id: 'mountain-climber-cardio',
    name: 'Mountain Climbers',
    category: 'Cardio',
    difficulty: 'Intermediate',
    targetMuscles: ['Herz-Kreislauf', 'Rumpf', 'Hüftbeuger', 'Schultern'],
    caloriesBurned: '120–160 kcal / 10 Min',
    icon: '🧗',
    description: 'Beginne im hohen Stütz. Ziehe abwechselnd schnell ein Knie zur Brust. Halte die Hüfte stabil und den Rumpf durchgehend angespannt.',
    sets: [
      { duration: '20 Sek', rest: '20 Sek' },
      { duration: '30 Sek', rest: '20 Sek' },
      { duration: '30 Sek', rest: '20 Sek' },
      { duration: '40 Sek', rest: '30 Sek' },
    ],
    tips: [
      'Halte die Hüfte flach – kein Wippen',
      'Schultern direkt über den Handgelenken',
      'Je schneller, desto besser der Cardio-Effekt',
      'Werde langsamer und konzentrierter, wenn die Form leidet',
    ],
    videoQuery: 'mountain climbers exercise tutorial',
  },
  {
    id: 'burpee',
    name: 'Burpee',
    category: 'Cardio',
    difficulty: 'Advanced',
    targetMuscles: ['Ganzkörper', 'Herz-Kreislauf', 'Brust', 'Rumpf', 'Beine'],
    caloriesBurned: '150–200 kcal / 10 Min',
    icon: '💥',
    description: 'Aus dem Stand in den Stütz, ein Liegestütz, Füße nach vorn springen, dann explosiv mit den Händen über dem Kopf hochspringen. Eine der kalorienintensivsten Eigengewichtsübungen.',
    sets: [
      { duration: '20 Sek', rest: '30 Sek' },
      { duration: '25 Sek', rest: '30 Sek' },
      { duration: '30 Sek', rest: '40 Sek' },
    ],
    tips: [
      'Als Anfänger zurücktreten statt springen',
      'Weiche Landung beim Sprung – über die Beine abfedern',
      'Beim Liegestütz und Sprung ausatmen',
      'Kontrolliere das Tempo – Qualität vor Quantität',
    ],
    videoQuery: 'burpee exercise tutorial for beginners',
  },
  {
    id: 'skater-step',
    name: 'Skater-Sprünge',
    category: 'Cardio',
    difficulty: 'Intermediate',
    targetMuscles: ['Gesäß', 'Quadrizeps', 'Adduktoren', 'Herz-Kreislauf'],
    caloriesBurned: '90–130 kcal / 10 Min',
    icon: '⛸️',
    description: 'Springe seitlich von einem Fuß auf den anderen und lande weich in einer leichten Kniebeuge. Ahme den Schritt eines Eisschnellläufers nach. Tolles gelenkschonendes Cardio für die äußere Gesäßmuskulatur.',
    sets: [
      { duration: '30 Sek', rest: '15 Sek' },
      { duration: '40 Sek', rest: '20 Sek' },
      { duration: '45 Sek', rest: '20 Sek' },
    ],
    tips: [
      'Lande bei jedem Sprung weich – über das Knie abfedern',
      'Halte den Oberkörper leicht nach vorn geneigt',
      'Die Arme schwingen gegengleich zum Sprungbein',
      'Blick geradeaus, nicht auf den Boden',
    ],
    videoQuery: 'skater steps cardio exercise tutorial',
  },
  // ── RUMPF ─────────────────────────────────────────────────────────────────
  {
    id: 'crunch',
    name: 'Crunch',
    category: 'Rumpf',
    difficulty: 'Beginner',
    targetMuscles: ['Obere Bauchmuskeln', 'Gerader Bauchmuskel'],
    caloriesBurned: '40–60 kcal / 10 Min',
    icon: '🔥',
    description: 'Lege dich auf den Rücken, Knie angewinkelt, Hände hinter dem Kopf. Rolle die Schultern mit den Bauchmuskeln – nicht mit dem Nacken – vom Boden und senke sie langsam wieder ab.',
    sets: [
      { reps: '15', rest: '30 Sek' },
      { reps: '20', rest: '30 Sek' },
      { reps: '20', rest: '30 Sek' },
    ],
    tips: [
      'Zieh nicht am Nacken – stütze ihn nur leicht',
      'Atme beim Hochrollen aus',
      'Senke langsam ab – die exzentrische Phase zählt',
      'Halte den unteren Rücken am Boden',
    ],
    videoQuery: 'crunch abs exercise tutorial',
  },
  {
    id: 'leg-raise',
    name: 'Beinheben',
    category: 'Rumpf',
    difficulty: 'Intermediate',
    targetMuscles: ['Untere Bauchmuskeln', 'Hüftbeuger', 'Rumpf'],
    caloriesBurned: '45–65 kcal / 10 Min',
    icon: '⬆️',
    description: 'Lege dich flach auf den Rücken, Beine gestreckt. Hebe die gestreckten Beine langsam auf 90° an, dann senke sie ab, ohne den Boden zu berühren. Trainiert die untere Bauchmuskulatur.',
    sets: [
      { reps: '10', rest: '30 Sek' },
      { reps: '12', rest: '30 Sek' },
      { reps: '15', rest: '30 Sek' },
    ],
    tips: [
      'Drücke den unteren Rücken durchgehend in den Boden',
      'Bewege dich langsam – vermeide Schwung',
      'Bei Bedarf die Knie beugen, um es zu erleichtern',
      'Halte nicht die Luft an',
    ],
    videoQuery: 'leg raise abs exercise tutorial',
  },
  {
    id: 'plank',
    name: 'Unterarmstütz',
    category: 'Rumpf',
    difficulty: 'Beginner',
    targetMuscles: ['Rumpf', 'Schultern', 'Gesäß', 'Rücken'],
    caloriesBurned: '30–50 kcal / 10 Min',
    icon: '🧱',
    description: 'Halte eine Liegestützposition auf den Unterarmen oder Händen. Halte den Körper in einer geraden Linie von Kopf bis Ferse. Spanne alles an und atme gleichmäßig.',
    sets: [
      { duration: '20 Sek', rest: '30 Sek' },
      { duration: '30 Sek', rest: '30 Sek' },
      { duration: '40 Sek', rest: '40 Sek' },
    ],
    tips: [
      'Lass die Hüfte weder durchhängen noch hochschieben',
      'Spanne Gesäß und Bauch an',
      'Blick auf den Boden, neutraler Nacken',
      'Steigere die Zeit Woche für Woche',
    ],
    videoQuery: 'plank exercise tutorial proper form',
  },
  {
    id: 'bicycle-crunch',
    name: 'Fahrrad-Crunch',
    category: 'Rumpf',
    difficulty: 'Intermediate',
    targetMuscles: ['Schräge Bauchmuskeln', 'Gerader Bauchmuskel', 'Hüftbeuger'],
    caloriesBurned: '50–70 kcal / 10 Min',
    icon: '🚴',
    description: 'Lege dich auf den Rücken, Hände hinter dem Kopf. Führe abwechselnd den gegenüberliegenden Ellbogen zum gegenüberliegenden Knie in einer Radfahrbewegung, während das andere Bein gestreckt bleibt.',
    sets: [
      { reps: '20 (10 pro Seite)', rest: '30 Sek' },
      { reps: '24 (12 pro Seite)', rest: '30 Sek' },
      { reps: '30 (15 pro Seite)', rest: '30 Sek' },
    ],
    tips: [
      'Überstürze nichts – Kontrolle schlägt Tempo',
      'Strecke das nicht arbeitende Bein vollständig',
      'Zieh nicht mit den Händen am Nacken',
      'Drehe aus den Rippen, nicht nur aus den Ellbogen',
    ],
    videoQuery: 'bicycle crunch abs exercise tutorial',
  },
  {
    id: 'hollow-hold',
    name: 'Hollow Hold',
    category: 'Rumpf',
    difficulty: 'Advanced',
    targetMuscles: ['Rumpf', 'Untere Bauchmuskeln', 'Hüftbeuger', 'Latissimus'],
    caloriesBurned: '40–60 kcal / 10 Min',
    icon: '🌙',
    description: 'Lege dich auf den Rücken, Arme über dem Kopf, Beine gestreckt und leicht vom Boden abgehoben. Bilde eine hohle Bananenform. Das ist die Grundlage der Rumpfkraft im Turnen.',
    sets: [
      { duration: '15 Sek', rest: '30 Sek' },
      { duration: '20 Sek', rest: '30 Sek' },
      { duration: '25 Sek', rest: '40 Sek' },
    ],
    tips: [
      'Drücke den unteren Rücken fest in den Boden',
      'Presse die Innenschenkel zusammen',
      'Arme lang über den Kopf strecken – Latissimus aktivieren',
      'Bei abhebendem Rücken die Knie beugen',
    ],
    videoQuery: 'hollow hold exercise tutorial core strength',
  },
  // ── BRUST ────────────────────────────────────────────────────────────────
  {
    id: 'pushup',
    name: 'Liegestütz',
    category: 'Brust',
    difficulty: 'Beginner',
    targetMuscles: ['Brust', 'Trizeps', 'Vordere Schulter', 'Rumpf'],
    caloriesBurned: '50–80 kcal / 10 Min',
    icon: '💪',
    description: 'Hände schulterbreit, Körper in einer geraden Linie. Senke die Brust zum Boden, dann drücke dich wieder hoch. Der König der Oberkörper-Eigengewichtsübungen.',
    sets: [
      { reps: '10', rest: '45 Sek' },
      { reps: '12', rest: '45 Sek' },
      { reps: '15', rest: '60 Sek' },
    ],
    tips: [
      'Halte die Ellbogen in ca. 45° zum Oberkörper – nicht weit abgespreizt',
      'Spanne den Rumpf durchgehend an',
      'Volle Bewegung: Brust berührt fast den Boden',
      'Bei Bedarf auf den Knien – trotzdem effektiv',
    ],
    videoQuery: 'push up proper form tutorial',
  },
  {
    id: 'wide-pushup',
    name: 'Breiter Liegestütz',
    category: 'Brust',
    difficulty: 'Intermediate',
    targetMuscles: ['Äußere Brust', 'Vordere Schulter', 'Trizeps'],
    caloriesBurned: '55–85 kcal / 10 Min',
    icon: '↔️',
    description: 'Wie ein Liegestütz, aber mit Händen weiter als schulterbreit. Die breitere Stellung verlagert mehr Last auf die Brust. Halte die Ellbogen nach hinten gerichtet, nicht zur Seite.',
    sets: [
      { reps: '10', rest: '45 Sek' },
      { reps: '12', rest: '45 Sek' },
      { reps: '12', rest: '60 Sek' },
    ],
    tips: [
      'Lass die Ellbogen nicht seitlich abspreizen',
      'Denke an „Brust zum Boden“',
      'Halte die Schultern unten, nicht hochgezogen',
      'Für mehr Reiz unten 1 Sekunde pausieren',
    ],
    videoQuery: 'wide grip push up chest exercise tutorial',
  },
  {
    id: 'diamond-pushup',
    name: 'Diamant-Liegestütz',
    category: 'Brust',
    difficulty: 'Advanced',
    targetMuscles: ['Trizeps', 'Innere Brust', 'Vordere Schulter'],
    caloriesBurned: '55–90 kcal / 10 Min',
    icon: '💎',
    description: 'Hände eng zusammen unter dem Brustbein, sodass eine Rautenform entsteht. Verlagert die Last stark auf Trizeps und innere Brust. Halte die Ellbogen nah am Körper.',
    sets: [
      { reps: '8', rest: '60 Sek' },
      { reps: '10', rest: '60 Sek' },
      { reps: '10', rest: '60 Sek' },
    ],
    tips: [
      'Ellbogen bleiben nah – lass sie nicht abspreizen',
      'Rautenhände direkt unter der Brust',
      'Senke langsam ab für maximale Muskelspannung',
      'Starker Rumpf – keine durchhängende Hüfte',
    ],
    videoQuery: 'diamond push up triceps exercise tutorial',
  },
  {
    id: 'archer-pushup',
    name: 'Archer-Liegestütz',
    category: 'Brust',
    difficulty: 'Advanced',
    targetMuscles: ['Brust (einseitig)', 'Trizeps', 'Stabilisatoren'],
    caloriesBurned: '60–95 kcal / 10 Min',
    icon: '🏹',
    description: 'Breiter Liegestütz, bei dem ein Arm gestreckt bleibt, während du dich zur Gegenseite absenkst. Praktisch ein assistierter einarmiger Liegestütz – baut enorme einseitige Brustkraft auf.',
    sets: [
      { reps: '5 pro Seite', rest: '60 Sek' },
      { reps: '6 pro Seite', rest: '60 Sek' },
      { reps: '8 pro Seite', rest: '75 Sek' },
    ],
    tips: [
      'Halte den gestreckten Arm fixiert – drücke in den Boden',
      'Senke langsam und kontrolliert ab',
      'Hüfte bleibt gerade – keine Rotation',
      'Steigere dich zuerst über breite Liegestütze',
    ],
    videoQuery: 'archer push up exercise tutorial one arm progression',
  },
  {
    id: 'pushup-hold',
    name: 'Liegestütz-Halt (unten)',
    category: 'Brust',
    difficulty: 'Intermediate',
    targetMuscles: ['Brust', 'Trizeps', 'Rumpf', 'Stabilisatoren'],
    caloriesBurned: '40–70 kcal / 10 Min',
    icon: '⏸️',
    description: 'Senke dich in die untere Position eines Liegestützes und halte. Die isometrische Spannung baut enorme Kraft und Gelenkstabilität auf. Wichtige Vorbereitung für fortgeschrittene Druckbewegungen.',
    sets: [
      { duration: '15 Sek', rest: '45 Sek' },
      { duration: '20 Sek', rest: '45 Sek' },
      { duration: '25 Sek', rest: '60 Sek' },
    ],
    tips: [
      'Ellbogen in 45° – nicht weiter',
      'Spanne alles an: Brust, Rumpf, Gesäß',
      'Atme gleichmäßig – halte nicht die Luft an',
      'Häng es an deine regulären Liegestützsätze an',
    ],
    videoQuery: 'push up hold isometric chest exercise tutorial',
  },
  // ── ARME & HANDGELENKE ─────────────────────────────────────────────────────
  {
    id: 'triceps-pushup',
    name: 'Trizeps-Liegestütz',
    category: 'Arme & Handgelenke',
    difficulty: 'Intermediate',
    targetMuscles: ['Trizeps', 'Brust', 'Rumpf'],
    caloriesBurned: '50–80 kcal / 10 Min',
    icon: '🦾',
    description: 'Normaler Liegestütz mit eng zusammenstehenden Händen direkt unter den Schultern. Die Ellbogen bleiben beim Absenken am Körper. Maximale Trizeps-Isolation aus einer Eigengewichtsübung.',
    sets: [
      { reps: '10', rest: '45 Sek' },
      { reps: '12', rest: '45 Sek' },
      { reps: '15', rest: '60 Sek' },
    ],
    tips: [
      'Halte die Ellbogen an den Rippen – nicht abspreizen',
      'Volle Bewegungsamplitude: Brust nah am Boden',
      'Bewege dich beim Absenken langsam',
      'Für mehr Tiefe Hände auf Bücher (Defizit)',
    ],
    videoQuery: 'triceps push up close grip tutorial',
  },
  {
    id: 'plank-shoulder-tap',
    name: 'Plank Shoulder Tap',
    category: 'Arme & Handgelenke',
    difficulty: 'Intermediate',
    targetMuscles: ['Rumpf', 'Schultern', 'Trizeps', 'Anti-Rotation'],
    caloriesBurned: '45–70 kcal / 10 Min',
    icon: '👆',
    description: 'Halte einen hohen Stütz und tippe abwechselnd mit der gegenüberliegenden Hand auf die Schulter. Fordert die Anti-Rotations-Stabilität des Rumpfes – die Hüfte muss durchgehend gerade bleiben.',
    sets: [
      { reps: '10 pro Seite', rest: '30 Sek' },
      { reps: '12 pro Seite', rest: '30 Sek' },
      { reps: '15 pro Seite', rest: '45 Sek' },
    ],
    tips: [
      'Stelle die Füße breiter, um das Hüftwippen zu reduzieren',
      'Tippe leicht und schnell – minimiere die Rotation',
      'Atme durchgehend gleichmäßig',
      'Blick auf den Boden, neutraler Nacken',
    ],
    videoQuery: 'plank shoulder tap core stability exercise',
  },
  {
    id: 'wrist-circles',
    name: 'Handgelenkkreisen',
    category: 'Arme & Handgelenke',
    difficulty: 'Beginner',
    targetMuscles: ['Handgelenk', 'Unterarm'],
    caloriesBurned: '10–20 kcal / 10 Min',
    icon: '🔄',
    description: 'Mit gestreckten Armen die Handgelenke langsam in vollen Kreisen drehen – in beide Richtungen. Wichtiges Aufwärmen für jede Druck- oder handgelenkbelastende Übung.',
    sets: [
      { duration: '30 Sek pro Richtung', rest: '10 Sek' },
      { duration: '30 Sek pro Richtung', rest: '10 Sek' },
    ],
    tips: [
      'Bewege dich langsam und durch den vollen Bewegungsbereich',
      'Bei Knirschen das Tempo verringern',
      'Mache das vor jeder Liegestütz-Einheit',
      'Steigere die Geschwindigkeit mit der Zeit allmählich',
    ],
    videoQuery: 'wrist mobility warm up exercise',
  },
  {
    id: 'wrist-rocks',
    name: 'Handgelenk-Wippen',
    category: 'Arme & Handgelenke',
    difficulty: 'Beginner',
    targetMuscles: ['Handgelenk', 'Unterarm', 'Schulterstabilität'],
    caloriesBurned: '15–25 kcal / 10 Min',
    icon: '🪨',
    description: 'Im Vierfüßlerstand das Körpergewicht langsam über die Handgelenke nach vorn und zurück verlagern. Konditioniert das Gelenk fürs Belasten und verbessert die Streckbeweglichkeit.',
    sets: [
      { duration: '20 Sek', rest: '20 Sek' },
      { duration: '25 Sek', rest: '20 Sek' },
      { duration: '30 Sek', rest: '30 Sek' },
    ],
    tips: [
      'Beginne sanft – erhöhe den Druck langsam',
      'Höre bei stechendem Schmerz auf',
      'Spreize die Finger weit',
      'Ideale tägliche Prävention für Push-Athleten',
    ],
    videoQuery: 'wrist rocks mobility exercise for push ups',
  },
  {
    id: 'forearm-plank-shift',
    name: 'Unterarmstütz-Pendeln',
    category: 'Arme & Handgelenke',
    difficulty: 'Intermediate',
    targetMuscles: ['Unterarme', 'Trizeps', 'Rumpf', 'Schultern'],
    caloriesBurned: '45–75 kcal / 10 Min',
    icon: '🧱',
    description: 'Im Unterarmstütz den Körper kontrolliert in einem Bogen vor und zurück wippen. Unterarme, Schultern und Rumpf arbeiten unter konstanter Spannung zusammen.',
    sets: [
      { duration: '20 Sek', rest: '30 Sek' },
      { duration: '25 Sek', rest: '30 Sek' },
      { duration: '30 Sek', rest: '45 Sek' },
    ],
    tips: [
      'Halte die Ellbogen direkt unter den Schultern',
      'Hüfte bleibt gerade – kein Absinken',
      'Kleine kontrollierte Bewegung – kein großes Schwingen',
      'Atme durchgehend rhythmisch',
    ],
    videoQuery: 'forearm plank shift exercise core tutorial',
  },
]

const EXERCISES_FR: Exercise[] = [
  // ── CARDIO ───────────────────────────────────────────────────────────────
  {
    id: 'jumping-jack',
    name: 'Jumping Jacks',
    category: 'Cardio',
    difficulty: 'Beginner',
    targetMuscles: ['Cardiovasculaire', 'Jambes', 'Épaules'],
    caloriesBurned: '80–120 kcal / 10 min',
    icon: '⭐',
    description: 'Commencez pieds joints, bras le long du corps. Sautez en écartant les jambes tout en levant les bras au-dessus de la tête, puis revenez à la position de départ. Idéal pour s\'échauffer et faire monter le rythme cardiaque.',
    sets: [
      { duration: '30 sec', rest: '15 sec' },
      { duration: '40 sec', rest: '15 sec' },
      { duration: '45 sec', rest: '20 sec' },
    ],
    tips: [
      'Atterrissez en douceur sur la pointe des pieds',
      'Ouvrez et fermez complètement les bras',
      'Gardez le rythme sans sacrifier la forme',
      'En appartement, faites des pas latéraux plutôt que des sauts',
    ],
    videoQuery: 'jumping jacks exercise tutorial',
  },
  {
    id: 'high-knees',
    name: 'Montées de genoux',
    category: 'Cardio',
    difficulty: 'Intermediate',
    targetMuscles: ['Cardiovasculaire', 'Fléchisseurs de la hanche', 'Quadriceps', 'Sangle abdominale'],
    caloriesBurned: '100–140 kcal / 10 min',
    icon: '🏃',
    description: 'Courez sur place en montant les genoux au niveau des hanches. Pompez activement les bras au rythme de la course et visez de courtes séquences à allure soutenue.',
    sets: [
      { duration: '20 sec', rest: '15 sec' },
      { duration: '30 sec', rest: '15 sec' },
      { duration: '30 sec', rest: '20 sec' },
      { duration: '30 sec', rest: '30 sec' },
    ],
    tips: [
      'Montez les genoux à hauteur de la taille',
      'Gardez la poitrine ouverte, le regard devant',
      'Laissez les bras soutenir le rythme',
      'Ralentissez si vous êtes essoufflé',
    ],
    videoQuery: 'high knees exercise tutorial',
  },
  {
    id: 'mountain-climber-cardio',
    name: 'Mountain Climbers',
    category: 'Cardio',
    difficulty: 'Intermediate',
    targetMuscles: ['Cardiovasculaire', 'Sangle abdominale', 'Fléchisseurs de la hanche', 'Épaules'],
    caloriesBurned: '120–160 kcal / 10 min',
    icon: '🧗',
    description: 'Partez en position de planche haute. Ramenez rapidement et alternativement un genou vers la poitrine. Gardez les hanches stables et la sangle abdominale gainée tout du long.',
    sets: [
      { duration: '20 sec', rest: '20 sec' },
      { duration: '30 sec', rest: '20 sec' },
      { duration: '30 sec', rest: '20 sec' },
      { duration: '40 sec', rest: '30 sec' },
    ],
    tips: [
      'Gardez les hanches à plat — pas de rebond',
      'Épaules directement au-dessus des poignets',
      'Plus vous allez vite, meilleur est l\'effet cardio',
      'Ralentissez avec attention si la forme se dégrade',
    ],
    videoQuery: 'mountain climbers exercise tutorial',
  },
  {
    id: 'burpee',
    name: 'Burpee',
    category: 'Cardio',
    difficulty: 'Advanced',
    targetMuscles: ['Corps entier', 'Cardiovasculaire', 'Pectoraux', 'Sangle abdominale', 'Jambes'],
    caloriesBurned: '150–200 kcal / 10 min',
    icon: '💥',
    description: 'Depuis la position debout, descendez en planche, faites une pompe, ramenez les pieds par un saut, puis détendez-vous vers le haut, mains au-dessus de la tête. L\'un des mouvements au poids du corps les plus caloriques.',
    sets: [
      { duration: '20 sec', rest: '30 sec' },
      { duration: '25 sec', rest: '30 sec' },
      { duration: '30 sec', rest: '40 sec' },
    ],
    tips: [
      'Reculez les pieds au lieu de sauter si vous débutez',
      'Atterrissage souple à la réception — amortissez avec les jambes',
      'Expirez pendant la pompe et le saut',
      'Maîtrisez le rythme — la qualité avant la quantité',
    ],
    videoQuery: 'burpee exercise tutorial for beginners',
  },
  {
    id: 'skater-step',
    name: 'Pas du patineur',
    category: 'Cardio',
    difficulty: 'Intermediate',
    targetMuscles: ['Fessiers', 'Quadriceps', 'Adducteurs', 'Cardiovasculaire'],
    caloriesBurned: '90–130 kcal / 10 min',
    icon: '⛸️',
    description: 'Bondissez latéralement d\'un pied sur l\'autre, en atterrissant en douceur dans un léger squat. Imitez la foulée d\'un patineur de vitesse. Excellent cardio à faible impact qui cible les fessiers externes.',
    sets: [
      { duration: '30 sec', rest: '15 sec' },
      { duration: '40 sec', rest: '20 sec' },
      { duration: '45 sec', rest: '20 sec' },
    ],
    tips: [
      'Atterrissez en douceur à chaque bond — amortissez avec le genou',
      'Gardez le torse légèrement penché en avant',
      'Les bras oscillent à l\'opposé de la jambe d\'appui',
      'Regardez droit devant, pas le sol',
    ],
    videoQuery: 'skater steps cardio exercise tutorial',
  },
  // ── GAINAGE ────────────────────────────────────────────────────────────────
  {
    id: 'crunch',
    name: 'Crunch',
    category: 'Gainage',
    difficulty: 'Beginner',
    targetMuscles: ['Abdominaux supérieurs', 'Grand droit'],
    caloriesBurned: '40–60 kcal / 10 min',
    icon: '🔥',
    description: 'Allongé sur le dos, genoux pliés, mains derrière la tête. Décollez les épaules du sol en utilisant les abdominaux — pas le cou — puis redescendez lentement.',
    sets: [
      { reps: '15', rest: '30 sec' },
      { reps: '20', rest: '30 sec' },
      { reps: '20', rest: '30 sec' },
    ],
    tips: [
      'Ne tirez pas sur le cou — soutenez-le légèrement',
      'Expirez en remontant',
      'Redescendez lentement — la phase excentrique compte',
      'Gardez le bas du dos plaqué au sol',
    ],
    videoQuery: 'crunch abs exercise tutorial',
  },
  {
    id: 'leg-raise',
    name: 'Levés de jambes',
    category: 'Gainage',
    difficulty: 'Intermediate',
    targetMuscles: ['Abdominaux inférieurs', 'Fléchisseurs de la hanche', 'Sangle abdominale'],
    caloriesBurned: '45–65 kcal / 10 min',
    icon: '⬆️',
    description: 'Allongé à plat sur le dos, jambes tendues. Levez lentement les jambes à 90° en les gardant tendues, puis redescendez sans toucher le sol. Cible le bas des abdominaux.',
    sets: [
      { reps: '10', rest: '30 sec' },
      { reps: '12', rest: '30 sec' },
      { reps: '15', rest: '30 sec' },
    ],
    tips: [
      'Plaquez le bas du dos au sol tout du long',
      'Bougez lentement — évitez l\'élan',
      'Pliez les genoux pour adapter si besoin',
      'Ne retenez pas votre respiration',
    ],
    videoQuery: 'leg raise abs exercise tutorial',
  },
  {
    id: 'plank',
    name: 'Planche',
    category: 'Gainage',
    difficulty: 'Beginner',
    targetMuscles: ['Sangle abdominale', 'Épaules', 'Fessiers', 'Dos'],
    caloriesBurned: '30–50 kcal / 10 min',
    icon: '🧱',
    description: 'Tenez une position de pompe sur les avant-bras ou les mains. Gardez le corps en ligne droite de la tête aux talons. Gainez tout le corps et respirez régulièrement.',
    sets: [
      { duration: '20 sec', rest: '30 sec' },
      { duration: '30 sec', rest: '30 sec' },
      { duration: '40 sec', rest: '40 sec' },
    ],
    tips: [
      'Ne laissez pas les hanches s\'affaisser ou se relever',
      'Contractez les fessiers et les abdominaux',
      'Regardez le sol, nuque neutre',
      'Augmentez la durée progressivement semaine après semaine',
    ],
    videoQuery: 'plank exercise tutorial proper form',
  },
  {
    id: 'bicycle-crunch',
    name: 'Crunch bicyclette',
    category: 'Gainage',
    difficulty: 'Intermediate',
    targetMuscles: ['Obliques', 'Grand droit', 'Fléchisseurs de la hanche'],
    caloriesBurned: '50–70 kcal / 10 min',
    icon: '🚴',
    description: 'Allongé sur le dos, mains derrière la tête. Amenez alternativement le coude opposé vers le genou opposé dans un mouvement de pédalage, en gardant l\'autre jambe tendue.',
    sets: [
      { reps: '20 (10 par côté)', rest: '30 sec' },
      { reps: '24 (12 par côté)', rest: '30 sec' },
      { reps: '30 (15 par côté)', rest: '30 sec' },
    ],
    tips: [
      'Ne précipitez rien — le contrôle prime sur la vitesse',
      'Tendez complètement la jambe non sollicitée',
      'Ne tirez pas sur le cou avec les mains',
      'Tournez à partir des côtes, pas seulement des coudes',
    ],
    videoQuery: 'bicycle crunch abs exercise tutorial',
  },
  {
    id: 'hollow-hold',
    name: 'Hollow Hold',
    category: 'Gainage',
    difficulty: 'Advanced',
    targetMuscles: ['Sangle abdominale', 'Abdominaux inférieurs', 'Fléchisseurs de la hanche', 'Grand dorsal'],
    caloriesBurned: '40–60 kcal / 10 min',
    icon: '🌙',
    description: 'Allongé sur le dos, bras au-dessus de la tête, jambes tendues et légèrement décollées du sol. Formez une banane creuse. C\'est la base du gainage en gymnastique.',
    sets: [
      { duration: '15 sec', rest: '30 sec' },
      { duration: '20 sec', rest: '30 sec' },
      { duration: '25 sec', rest: '40 sec' },
    ],
    tips: [
      'Plaquez fermement le bas du dos au sol',
      'Serrez l\'intérieur des cuisses',
      'Tendez les bras loin au-dessus de la tête — engagez le grand dorsal',
      'Pliez les genoux si le bas du dos se décolle',
    ],
    videoQuery: 'hollow hold exercise tutorial core strength',
  },
  // ── PECTORAUX ──────────────────────────────────────────────────────────────
  {
    id: 'pushup',
    name: 'Pompe',
    category: 'Pectoraux',
    difficulty: 'Beginner',
    targetMuscles: ['Pectoraux', 'Triceps', 'Deltoïde antérieur', 'Sangle abdominale'],
    caloriesBurned: '50–80 kcal / 10 min',
    icon: '💪',
    description: 'Mains à largeur d\'épaules, corps en ligne droite. Descendez la poitrine vers le sol, puis remontez en poussant. Le roi des exercices du haut du corps au poids du corps.',
    sets: [
      { reps: '10', rest: '45 sec' },
      { reps: '12', rest: '45 sec' },
      { reps: '15', rest: '60 sec' },
    ],
    tips: [
      'Gardez les coudes à ~45° du torse — pas écartés largement',
      'Gainez la sangle abdominale tout du long',
      'Amplitude complète : la poitrine frôle le sol',
      'Adaptez sur les genoux si besoin — toujours efficace',
    ],
    videoQuery: 'push up proper form tutorial',
  },
  {
    id: 'wide-pushup',
    name: 'Pompe écartée',
    category: 'Pectoraux',
    difficulty: 'Intermediate',
    targetMuscles: ['Pectoraux externes', 'Deltoïde antérieur', 'Triceps'],
    caloriesBurned: '55–85 kcal / 10 min',
    icon: '↔️',
    description: 'Comme une pompe, mais avec les mains plus larges que les épaules. La position élargie reporte davantage de charge sur les pectoraux. Gardez les coudes orientés vers l\'arrière, pas vers l\'extérieur.',
    sets: [
      { reps: '10', rest: '45 sec' },
      { reps: '12', rest: '45 sec' },
      { reps: '12', rest: '60 sec' },
    ],
    tips: [
      'Ne laissez pas les coudes s\'écarter sur les côtés',
      'Pensez « poitrine vers le sol »',
      'Gardez les épaules basses, pas remontées',
      'Ajoutez une pause d\'1 seconde en bas pour plus de difficulté',
    ],
    videoQuery: 'wide grip push up chest exercise tutorial',
  },
  {
    id: 'diamond-pushup',
    name: 'Pompe diamant',
    category: 'Pectoraux',
    difficulty: 'Advanced',
    targetMuscles: ['Triceps', 'Pectoraux internes', 'Deltoïde antérieur'],
    caloriesBurned: '55–90 kcal / 10 min',
    icon: '💎',
    description: 'Mains rapprochées sous le sternum, formant un losange. Reporte fortement la charge sur les triceps et les pectoraux internes. Gardez les coudes près du corps.',
    sets: [
      { reps: '8', rest: '60 sec' },
      { reps: '10', rest: '60 sec' },
      { reps: '10', rest: '60 sec' },
    ],
    tips: [
      'Les coudes restent proches — ne les écartez pas',
      'Mains en losange directement sous la poitrine',
      'Descendez lentement pour une tension musculaire maximale',
      'Sangle abdominale solide — pas de hanches affaissées',
    ],
    videoQuery: 'diamond push up triceps exercise tutorial',
  },
  {
    id: 'archer-pushup',
    name: 'Pompe archer',
    category: 'Pectoraux',
    difficulty: 'Advanced',
    targetMuscles: ['Pectoraux (unilatéral)', 'Triceps', 'Stabilisateurs'],
    caloriesBurned: '60–95 kcal / 10 min',
    icon: '🏹',
    description: 'Pompe en position large où un bras reste tendu pendant que vous descendez vers le côté opposé. Pratiquement une pompe à un bras assistée — développe une force pectorale unilatérale considérable.',
    sets: [
      { reps: '5 par côté', rest: '60 sec' },
      { reps: '6 par côté', rest: '60 sec' },
      { reps: '8 par côté', rest: '75 sec' },
    ],
    tips: [
      'Gardez le bras tendu verrouillé — poussez dans le sol',
      'Descendez lentement et en contrôle',
      'Les hanches restent de niveau — aucune rotation',
      'Progressez d\'abord avec les pompes écartées',
    ],
    videoQuery: 'archer push up exercise tutorial one arm progression',
  },
  {
    id: 'pushup-hold',
    name: 'Maintien de pompe (bas)',
    category: 'Pectoraux',
    difficulty: 'Intermediate',
    targetMuscles: ['Pectoraux', 'Triceps', 'Sangle abdominale', 'Stabilisateurs'],
    caloriesBurned: '40–70 kcal / 10 min',
    icon: '⏸️',
    description: 'Descendez en bas d\'une pompe et maintenez. La tension isométrique développe une force et une stabilité articulaire remarquables. Préparation essentielle aux mouvements de poussée avancés.',
    sets: [
      { duration: '15 sec', rest: '45 sec' },
      { duration: '20 sec', rest: '45 sec' },
      { duration: '25 sec', rest: '60 sec' },
    ],
    tips: [
      'Coudes à 45° — pas plus larges',
      'Contractez tout : pectoraux, abdominaux, fessiers',
      'Respirez régulièrement — ne bloquez pas la respiration',
      'Ajoutez-le à vos séries de pompes habituelles',
    ],
    videoQuery: 'push up hold isometric chest exercise tutorial',
  },
  // ── BRAS & POIGNETS ─────────────────────────────────────────────────────────
  {
    id: 'triceps-pushup',
    name: 'Pompe triceps',
    category: 'Bras & Poignets',
    difficulty: 'Intermediate',
    targetMuscles: ['Triceps', 'Pectoraux', 'Sangle abdominale'],
    caloriesBurned: '50–80 kcal / 10 min',
    icon: '🦾',
    description: 'Pompe classique avec les mains rapprochées directement sous les épaules. Les coudes restent collés au corps à la descente. Isolation maximale des triceps au poids du corps.',
    sets: [
      { reps: '10', rest: '45 sec' },
      { reps: '12', rest: '45 sec' },
      { reps: '15', rest: '60 sec' },
    ],
    tips: [
      'Gardez les coudes serrés contre les côtes — ne les écartez pas',
      'Amplitude complète : poitrine près du sol',
      'Descendez lentement',
      'Essayez un déficit (mains sur des livres) pour plus d\'amplitude',
    ],
    videoQuery: 'triceps push up close grip tutorial',
  },
  {
    id: 'plank-shoulder-tap',
    name: 'Touches d\'épaule en planche',
    category: 'Bras & Poignets',
    difficulty: 'Intermediate',
    targetMuscles: ['Sangle abdominale', 'Épaules', 'Triceps', 'Anti-rotation'],
    caloriesBurned: '45–70 kcal / 10 min',
    icon: '👆',
    description: 'Tenez une planche haute, puis touchez alternativement chaque épaule avec la main opposée. Sollicite la stabilité anti-rotation de la sangle abdominale — les hanches doivent rester de niveau tout du long.',
    sets: [
      { reps: '10 par côté', rest: '30 sec' },
      { reps: '12 par côté', rest: '30 sec' },
      { reps: '15 par côté', rest: '45 sec' },
    ],
    tips: [
      'Écartez davantage les pieds pour réduire le balancement des hanches',
      'Touchez légèrement et rapidement — minimisez la rotation',
      'Respirez régulièrement tout du long',
      'Regardez le sol, nuque neutre',
    ],
    videoQuery: 'plank shoulder tap core stability exercise',
  },
  {
    id: 'wrist-circles',
    name: 'Cercles des poignets',
    category: 'Bras & Poignets',
    difficulty: 'Beginner',
    targetMuscles: ['Poignet', 'Avant-bras'],
    caloriesBurned: '10–20 kcal / 10 min',
    icon: '🔄',
    description: 'Bras tendus, faites lentement tourner les poignets en cercles complets — dans les deux sens. Échauffement essentiel avant tout exercice de poussée ou sollicitant les poignets.',
    sets: [
      { duration: '30 sec par sens', rest: '10 sec' },
      { duration: '30 sec par sens', rest: '10 sec' },
    ],
    tips: [
      'Bougez lentement et sur toute l\'amplitude',
      'Si vous sentez des frottements, ralentissez',
      'Faites-le avant chaque séance de pompes',
      'Augmentez la vitesse progressivement avec le temps',
    ],
    videoQuery: 'wrist mobility warm up exercise',
  },
  {
    id: 'wrist-rocks',
    name: 'Bascules des poignets',
    category: 'Bras & Poignets',
    difficulty: 'Beginner',
    targetMuscles: ['Poignet', 'Avant-bras', 'Stabilité de l\'épaule'],
    caloriesBurned: '15–25 kcal / 10 min',
    icon: '🪨',
    description: 'À quatre pattes, basculez lentement le poids du corps d\'avant en arrière au-dessus des poignets. Conditionne l\'articulation à supporter du poids et améliore la souplesse en extension.',
    sets: [
      { duration: '20 sec', rest: '20 sec' },
      { duration: '25 sec', rest: '20 sec' },
      { duration: '30 sec', rest: '30 sec' },
    ],
    tips: [
      'Commencez doucement — augmentez la pression lentement',
      'Arrêtez si vous ressentez une douleur vive',
      'Écartez bien les doigts',
      'Prévention quotidienne idéale pour les athlètes de poussée',
    ],
    videoQuery: 'wrist rocks mobility exercise for push ups',
  },
  {
    id: 'forearm-plank-shift',
    name: 'Bascule en planche sur avant-bras',
    category: 'Bras & Poignets',
    difficulty: 'Intermediate',
    targetMuscles: ['Avant-bras', 'Triceps', 'Sangle abdominale', 'Épaules'],
    caloriesBurned: '45–75 kcal / 10 min',
    icon: '🧱',
    description: 'En planche sur les avant-bras, basculez le corps d\'avant en arrière selon un arc contrôlé. Avant-bras, épaules et sangle abdominale travaillent ensemble sous tension constante.',
    sets: [
      { duration: '20 sec', rest: '30 sec' },
      { duration: '25 sec', rest: '30 sec' },
      { duration: '30 sec', rest: '45 sec' },
    ],
    tips: [
      'Gardez les coudes directement sous les épaules',
      'Les hanches restent de niveau — pas d\'affaissement',
      'Petit mouvement contrôlé — pas de grand balancement',
      'Respirez de façon rythmée tout du long',
    ],
    videoQuery: 'forearm plank shift exercise core tutorial',
  },
]

const EXERCISES_ES: Exercise[] = [
  // ── CARDIO ───────────────────────────────────────────────────────────────
  {
    id: 'jumping-jack',
    name: 'Saltos de tijera',
    category: 'Cardio',
    difficulty: 'Beginner',
    targetMuscles: ['Cardiovascular', 'Piernas', 'Hombros'],
    caloriesBurned: '80–120 kcal / 10 min',
    icon: '⭐',
    description: 'Empieza con los pies juntos y los brazos a los lados. Salta abriendo las piernas mientras levantas los brazos por encima de la cabeza, luego vuelve a la posición inicial. Ideal para calentar y elevar las pulsaciones.',
    sets: [
      { duration: '30 seg', rest: '15 seg' },
      { duration: '40 seg', rest: '15 seg' },
      { duration: '45 seg', rest: '20 seg' },
    ],
    tips: [
      'Aterriza suavemente sobre las puntas de los pies',
      'Abre y cierra los brazos por completo',
      'Mantén el ritmo sin sacrificar la técnica',
      'En un piso, da pasos laterales en lugar de saltar',
    ],
    videoQuery: 'jumping jacks exercise tutorial',
  },
  {
    id: 'high-knees',
    name: 'Rodillas altas',
    category: 'Cardio',
    difficulty: 'Intermediate',
    targetMuscles: ['Cardiovascular', 'Flexores de la cadera', 'Cuádriceps', 'Core'],
    caloriesBurned: '100–140 kcal / 10 min',
    icon: '🏃',
    description: 'Corre en el sitio llevando las rodillas hasta la altura de la cadera. Bombea los brazos activamente al ritmo de la carrera y busca ráfagas cortas a alta velocidad.',
    sets: [
      { duration: '20 seg', rest: '15 seg' },
      { duration: '30 seg', rest: '15 seg' },
      { duration: '30 seg', rest: '20 seg' },
      { duration: '30 seg', rest: '30 seg' },
    ],
    tips: [
      'Lleva las rodillas a la altura de la cintura',
      'Mantén el pecho abierto y la mirada al frente',
      'Deja que los brazos acompañen el ritmo',
      'Reduce el ritmo si te quedas sin aire',
    ],
    videoQuery: 'high knees exercise tutorial',
  },
  {
    id: 'mountain-climber-cardio',
    name: 'Escaladores',
    category: 'Cardio',
    difficulty: 'Intermediate',
    targetMuscles: ['Cardiovascular', 'Core', 'Flexores de la cadera', 'Hombros'],
    caloriesBurned: '120–160 kcal / 10 min',
    icon: '🧗',
    description: 'Empieza en plancha alta. Lleva rápidamente y de forma alternada una rodilla hacia el pecho. Mantén las caderas estables y el core activado en todo momento.',
    sets: [
      { duration: '20 seg', rest: '20 seg' },
      { duration: '30 seg', rest: '20 seg' },
      { duration: '30 seg', rest: '20 seg' },
      { duration: '40 seg', rest: '30 seg' },
    ],
    tips: [
      'Mantén las caderas planas — sin rebotes',
      'Hombros directamente sobre las muñecas',
      'Cuanto más rápido, mejor el efecto cardiovascular',
      'Ve más lento y con foco si pierdes la técnica',
    ],
    videoQuery: 'mountain climbers exercise tutorial',
  },
  {
    id: 'burpee',
    name: 'Burpee',
    category: 'Cardio',
    difficulty: 'Advanced',
    targetMuscles: ['Cuerpo completo', 'Cardiovascular', 'Pecho', 'Core', 'Piernas'],
    caloriesBurned: '150–200 kcal / 10 min',
    icon: '💥',
    description: 'Desde de pie, baja a plancha, haz una flexión, lleva los pies adelante con un salto y luego salta explosivamente con las manos por encima de la cabeza. Uno de los movimientos con peso corporal que más calorías quema.',
    sets: [
      { duration: '20 seg', rest: '30 seg' },
      { duration: '25 seg', rest: '30 seg' },
      { duration: '30 seg', rest: '40 seg' },
    ],
    tips: [
      'Da un paso atrás en lugar de saltar si eres principiante',
      'Aterrizaje suave en el salto — amortigua con las piernas',
      'Exhala durante la flexión y el salto',
      'Controla el ritmo — calidad antes que cantidad',
    ],
    videoQuery: 'burpee exercise tutorial for beginners',
  },
  {
    id: 'skater-step',
    name: 'Pasos de patinador',
    category: 'Cardio',
    difficulty: 'Intermediate',
    targetMuscles: ['Glúteos', 'Cuádriceps', 'Aductores', 'Cardiovascular'],
    caloriesBurned: '90–130 kcal / 10 min',
    icon: '⛸️',
    description: 'Salta lateralmente de un pie al otro, aterrizando suavemente en una ligera sentadilla. Imita la zancada de un patinador de velocidad. Excelente cardio de bajo impacto que trabaja los glúteos externos.',
    sets: [
      { duration: '30 seg', rest: '15 seg' },
      { duration: '40 seg', rest: '20 seg' },
      { duration: '45 seg', rest: '20 seg' },
    ],
    tips: [
      'Aterriza suave en cada salto — amortigua con la rodilla',
      'Mantén el torso ligeramente inclinado hacia delante',
      'Los brazos oscilan en sentido opuesto a la pierna de salto',
      'Mira al frente, no al suelo',
    ],
    videoQuery: 'skater steps cardio exercise tutorial',
  },
  // ── CORE ─────────────────────────────────────────────────────────────────
  {
    id: 'crunch',
    name: 'Crunch',
    category: 'Core',
    difficulty: 'Beginner',
    targetMuscles: ['Abdominales superiores', 'Recto abdominal'],
    caloriesBurned: '40–60 kcal / 10 min',
    icon: '🔥',
    description: 'Túmbate boca arriba, rodillas flexionadas, manos detrás de la cabeza. Despega los hombros del suelo usando los abdominales — no el cuello — y baja despacio.',
    sets: [
      { reps: '15', rest: '30 seg' },
      { reps: '20', rest: '30 seg' },
      { reps: '20', rest: '30 seg' },
    ],
    tips: [
      'No tires del cuello — sosténlo ligeramente',
      'Exhala al subir',
      'Baja despacio — la fase excéntrica importa',
      'Mantén la zona lumbar pegada al suelo',
    ],
    videoQuery: 'crunch abs exercise tutorial',
  },
  {
    id: 'leg-raise',
    name: 'Elevación de piernas',
    category: 'Core',
    difficulty: 'Intermediate',
    targetMuscles: ['Abdominales inferiores', 'Flexores de la cadera', 'Core'],
    caloriesBurned: '45–65 kcal / 10 min',
    icon: '⬆️',
    description: 'Túmbate boca arriba con las piernas estiradas. Eleva las piernas despacio hasta 90° manteniéndolas rectas, luego bájalas sin tocar el suelo. Trabaja los abdominales inferiores.',
    sets: [
      { reps: '10', rest: '30 seg' },
      { reps: '12', rest: '30 seg' },
      { reps: '15', rest: '30 seg' },
    ],
    tips: [
      'Presiona la zona lumbar contra el suelo en todo momento',
      'Muévete despacio — evita el impulso',
      'Flexiona las rodillas para adaptarlo si hace falta',
      'No contengas la respiración',
    ],
    videoQuery: 'leg raise abs exercise tutorial',
  },
  {
    id: 'plank',
    name: 'Plancha',
    category: 'Core',
    difficulty: 'Beginner',
    targetMuscles: ['Core', 'Hombros', 'Glúteos', 'Espalda'],
    caloriesBurned: '30–50 kcal / 10 min',
    icon: '🧱',
    description: 'Mantén una posición de flexión sobre los antebrazos o las manos. Conserva el cuerpo en línea recta de la cabeza a los talones. Activa todo el cuerpo y respira de forma constante.',
    sets: [
      { duration: '20 seg', rest: '30 seg' },
      { duration: '30 seg', rest: '30 seg' },
      { duration: '40 seg', rest: '40 seg' },
    ],
    tips: [
      'No dejes que las caderas caigan ni se eleven',
      'Aprieta glúteos y abdominales',
      'Mira al suelo, cuello neutro',
      'Aumenta el tiempo de forma gradual semana a semana',
    ],
    videoQuery: 'plank exercise tutorial proper form',
  },
  {
    id: 'bicycle-crunch',
    name: 'Crunch bicicleta',
    category: 'Core',
    difficulty: 'Intermediate',
    targetMuscles: ['Oblicuos', 'Recto abdominal', 'Flexores de la cadera'],
    caloriesBurned: '50–70 kcal / 10 min',
    icon: '🚴',
    description: 'Túmbate boca arriba con las manos detrás de la cabeza. Lleva alternadamente el codo opuesto hacia la rodilla opuesta en un movimiento de pedaleo, manteniendo la otra pierna estirada.',
    sets: [
      { reps: '20 (10 por lado)', rest: '30 seg' },
      { reps: '24 (12 por lado)', rest: '30 seg' },
      { reps: '30 (15 por lado)', rest: '30 seg' },
    ],
    tips: [
      'No te apresures — el control supera a la velocidad',
      'Estira por completo la pierna que no trabaja',
      'No tires del cuello con las manos',
      'Gira desde las costillas, no solo desde los codos',
    ],
    videoQuery: 'bicycle crunch abs exercise tutorial',
  },
  {
    id: 'hollow-hold',
    name: 'Hollow Hold',
    category: 'Core',
    difficulty: 'Advanced',
    targetMuscles: ['Core', 'Abdominales inferiores', 'Flexores de la cadera', 'Dorsales'],
    caloriesBurned: '40–60 kcal / 10 min',
    icon: '🌙',
    description: 'Túmbate boca arriba, brazos por encima de la cabeza, piernas estiradas y ligeramente despegadas del suelo. Forma una banana hueca. Es la base de la fuerza del core en gimnasia.',
    sets: [
      { duration: '15 seg', rest: '30 seg' },
      { duration: '20 seg', rest: '30 seg' },
      { duration: '25 seg', rest: '40 seg' },
    ],
    tips: [
      'Presiona con firmeza la zona lumbar contra el suelo',
      'Aprieta la cara interna de los muslos',
      'Estira los brazos largos por encima de la cabeza — activa los dorsales',
      'Flexiona las rodillas si la zona lumbar se despega',
    ],
    videoQuery: 'hollow hold exercise tutorial core strength',
  },
  // ── PECHO ────────────────────────────────────────────────────────────────
  {
    id: 'pushup',
    name: 'Flexión',
    category: 'Pecho',
    difficulty: 'Beginner',
    targetMuscles: ['Pecho', 'Tríceps', 'Deltoides anterior', 'Core'],
    caloriesBurned: '50–80 kcal / 10 min',
    icon: '💪',
    description: 'Manos a la anchura de los hombros, cuerpo en línea recta. Baja el pecho hacia el suelo y luego empuja para subir. El rey de los ejercicios de tren superior con peso corporal.',
    sets: [
      { reps: '10', rest: '45 seg' },
      { reps: '12', rest: '45 seg' },
      { reps: '15', rest: '60 seg' },
    ],
    tips: [
      'Mantén los codos a ~45° del torso — no muy abiertos',
      'Activa el core en todo momento',
      'Rango completo: el pecho casi toca el suelo',
      'Adáptalo de rodillas si hace falta — sigue siendo eficaz',
    ],
    videoQuery: 'push up proper form tutorial',
  },
  {
    id: 'wide-pushup',
    name: 'Flexión abierta',
    category: 'Pecho',
    difficulty: 'Intermediate',
    targetMuscles: ['Pecho externo', 'Deltoides anterior', 'Tríceps'],
    caloriesBurned: '55–85 kcal / 10 min',
    icon: '↔️',
    description: 'Igual que una flexión, pero con las manos más anchas que los hombros. La posición más abierta traslada más carga al pecho. Mantén los codos apuntando hacia atrás, no hacia fuera.',
    sets: [
      { reps: '10', rest: '45 seg' },
      { reps: '12', rest: '45 seg' },
      { reps: '12', rest: '60 seg' },
    ],
    tips: [
      'No dejes que los codos se abran hacia los lados',
      'Piensa "pecho al suelo"',
      'Mantén los hombros bajos, no encogidos',
      'Añade una pausa de 1 segundo abajo para más reto',
    ],
    videoQuery: 'wide grip push up chest exercise tutorial',
  },
  {
    id: 'diamond-pushup',
    name: 'Flexión diamante',
    category: 'Pecho',
    difficulty: 'Advanced',
    targetMuscles: ['Tríceps', 'Pecho interno', 'Deltoides anterior'],
    caloriesBurned: '55–90 kcal / 10 min',
    icon: '💎',
    description: 'Manos juntas bajo el esternón, formando un rombo. Traslada mucha carga al tríceps y al pecho interno. Mantén los codos cerca del cuerpo.',
    sets: [
      { reps: '8', rest: '60 seg' },
      { reps: '10', rest: '60 seg' },
      { reps: '10', rest: '60 seg' },
    ],
    tips: [
      'Los codos cerca — no dejes que se abran',
      'Manos en rombo directamente bajo el pecho',
      'Baja despacio para máxima tensión muscular',
      'Core fuerte — sin caderas caídas',
    ],
    videoQuery: 'diamond push up triceps exercise tutorial',
  },
  {
    id: 'archer-pushup',
    name: 'Flexión arquero',
    category: 'Pecho',
    difficulty: 'Advanced',
    targetMuscles: ['Pecho (unilateral)', 'Tríceps', 'Estabilizadores'],
    caloriesBurned: '60–95 kcal / 10 min',
    icon: '🏹',
    description: 'Flexión en posición abierta donde un brazo permanece estirado mientras bajas hacia el lado opuesto. Prácticamente una flexión a un brazo asistida — desarrolla una notable fuerza unilateral de pecho.',
    sets: [
      { reps: '5 por lado', rest: '60 seg' },
      { reps: '6 por lado', rest: '60 seg' },
      { reps: '8 por lado', rest: '75 seg' },
    ],
    tips: [
      'Mantén el brazo estirado bloqueado — empuja contra el suelo',
      'Baja despacio y con control',
      'Las caderas permanecen niveladas — sin rotación',
      'Progresa primero desde las flexiones abiertas',
    ],
    videoQuery: 'archer push up exercise tutorial one arm progression',
  },
  {
    id: 'pushup-hold',
    name: 'Sostén de flexión (abajo)',
    category: 'Pecho',
    difficulty: 'Intermediate',
    targetMuscles: ['Pecho', 'Tríceps', 'Core', 'Estabilizadores'],
    caloriesBurned: '40–70 kcal / 10 min',
    icon: '⏸️',
    description: 'Baja hasta la parte inferior de una flexión y mantén. La tensión isométrica desarrolla una fuerza y una estabilidad articular increíbles. Preparación esencial para movimientos de empuje avanzados.',
    sets: [
      { duration: '15 seg', rest: '45 seg' },
      { duration: '20 seg', rest: '45 seg' },
      { duration: '25 seg', rest: '60 seg' },
    ],
    tips: [
      'Codos a 45° — no más abiertos',
      'Aprieta todo: pecho, core, glúteos',
      'Respira de forma constante — no contengas la respiración',
      'Súmalo a tus series habituales de flexiones',
    ],
    videoQuery: 'push up hold isometric chest exercise tutorial',
  },
  // ── BRAZOS Y MUÑECAS ────────────────────────────────────────────────────────
  {
    id: 'triceps-pushup',
    name: 'Flexión de tríceps',
    category: 'Brazos y Muñecas',
    difficulty: 'Intermediate',
    targetMuscles: ['Tríceps', 'Pecho', 'Core'],
    caloriesBurned: '50–80 kcal / 10 min',
    icon: '🦾',
    description: 'Flexión estándar con las manos juntas directamente bajo los hombros. Los codos permanecen pegados al cuerpo al bajar. Máximo aislamiento del tríceps con peso corporal.',
    sets: [
      { reps: '10', rest: '45 seg' },
      { reps: '12', rest: '45 seg' },
      { reps: '15', rest: '60 seg' },
    ],
    tips: [
      'Mantén los codos pegados a las costillas — no los abras',
      'Rango de movimiento completo: pecho cerca del suelo',
      'Baja despacio',
      'Prueba un déficit (manos sobre libros) para más rango',
    ],
    videoQuery: 'triceps push up close grip tutorial',
  },
  {
    id: 'plank-shoulder-tap',
    name: 'Toque de hombro en plancha',
    category: 'Brazos y Muñecas',
    difficulty: 'Intermediate',
    targetMuscles: ['Core', 'Hombros', 'Tríceps', 'Antirrotación'],
    caloriesBurned: '45–70 kcal / 10 min',
    icon: '👆',
    description: 'Mantén una plancha alta y toca alternadamente cada hombro con la mano opuesta. Desafía la estabilidad antirrotación del core — las caderas deben permanecer niveladas en todo momento.',
    sets: [
      { reps: '10 por lado', rest: '30 seg' },
      { reps: '12 por lado', rest: '30 seg' },
      { reps: '15 por lado', rest: '45 seg' },
    ],
    tips: [
      'Separa más los pies para reducir el balanceo de la cadera',
      'Toca ligero y rápido — minimiza la rotación',
      'Respira de forma constante en todo momento',
      'Mira al suelo, cuello neutro',
    ],
    videoQuery: 'plank shoulder tap core stability exercise',
  },
  {
    id: 'wrist-circles',
    name: 'Círculos de muñeca',
    category: 'Brazos y Muñecas',
    difficulty: 'Beginner',
    targetMuscles: ['Muñeca', 'Antebrazo'],
    caloriesBurned: '10–20 kcal / 10 min',
    icon: '🔄',
    description: 'Con los brazos estirados, gira despacio las muñecas en círculos completos — en ambos sentidos. Calentamiento esencial antes de cualquier ejercicio de empuje o que cargue las muñecas.',
    sets: [
      { duration: '30 seg por sentido', rest: '10 seg' },
      { duration: '30 seg por sentido', rest: '10 seg' },
    ],
    tips: [
      'Muévete despacio y por todo el rango',
      'Si notas roces, ve más lento',
      'Hazlo antes de cualquier sesión de flexiones',
      'Aumenta la velocidad de forma gradual con el tiempo',
    ],
    videoQuery: 'wrist mobility warm up exercise',
  },
  {
    id: 'wrist-rocks',
    name: 'Balanceos de muñeca',
    category: 'Brazos y Muñecas',
    difficulty: 'Beginner',
    targetMuscles: ['Muñeca', 'Antebrazo', 'Estabilidad del hombro'],
    caloriesBurned: '15–25 kcal / 10 min',
    icon: '🪨',
    description: 'A cuatro patas, balancea despacio el peso del cuerpo hacia delante y atrás sobre las muñecas. Acondiciona la articulación para soportar carga y mejora la flexibilidad en extensión.',
    sets: [
      { duration: '20 seg', rest: '20 seg' },
      { duration: '25 seg', rest: '20 seg' },
      { duration: '30 seg', rest: '30 seg' },
    ],
    tips: [
      'Empieza con suavidad — aumenta la presión despacio',
      'Detente si sientes un dolor agudo',
      'Separa bien los dedos',
      'Prevención diaria ideal para atletas de empuje',
    ],
    videoQuery: 'wrist rocks mobility exercise for push ups',
  },
  {
    id: 'forearm-plank-shift',
    name: 'Balanceo en plancha de antebrazos',
    category: 'Brazos y Muñecas',
    difficulty: 'Intermediate',
    targetMuscles: ['Antebrazos', 'Tríceps', 'Core', 'Hombros'],
    caloriesBurned: '45–75 kcal / 10 min',
    icon: '🧱',
    description: 'En plancha de antebrazos, balancea el cuerpo hacia delante y atrás en un arco controlado. Antebrazos, hombros y core trabajan juntos bajo tensión constante.',
    sets: [
      { duration: '20 seg', rest: '30 seg' },
      { duration: '25 seg', rest: '30 seg' },
      { duration: '30 seg', rest: '45 seg' },
    ],
    tips: [
      'Mantén los codos directamente bajo los hombros',
      'Las caderas permanecen niveladas — sin hundimiento',
      'Movimiento pequeño y controlado — sin grandes balanceos',
      'Respira de forma rítmica en todo momento',
    ],
    videoQuery: 'forearm plank shift exercise core tutorial',
  },
]

const EXERCISES_IT: Exercise[] = [
  // ── CARDIO ───────────────────────────────────────────────────────────────
  {
    id: 'jumping-jack',
    name: 'Jumping Jacks',
    category: 'Cardio',
    difficulty: 'Beginner',
    targetMuscles: ['Cardiovascolare', 'Gambe', 'Spalle'],
    caloriesBurned: '80–120 kcal / 10 min',
    icon: '⭐',
    description: 'Parti con i piedi uniti e le braccia lungo i fianchi. Salta divaricando le gambe mentre alzi le braccia sopra la testa, poi torna alla posizione iniziale. Ottimo per il riscaldamento e per alzare il battito.',
    sets: [
      { duration: '30 sec', rest: '15 sec' },
      { duration: '40 sec', rest: '15 sec' },
      { duration: '45 sec', rest: '20 sec' },
    ],
    tips: [
      'Atterra delicatamente sugli avampiedi',
      'Apri e chiudi completamente le braccia',
      'Mantieni il ritmo senza sacrificare la tecnica',
      'In appartamento, fai passi laterali invece di saltare',
    ],
    videoQuery: 'jumping jacks exercise tutorial',
  },
  {
    id: 'high-knees',
    name: 'Ginocchia alte',
    category: 'Cardio',
    difficulty: 'Intermediate',
    targetMuscles: ['Cardiovascolare', 'Flessori dell\'anca', 'Quadricipiti', 'Core'],
    caloriesBurned: '100–140 kcal / 10 min',
    icon: '🏃',
    description: 'Corri sul posto portando le ginocchia all\'altezza dei fianchi. Pompa attivamente le braccia al ritmo della corsa e punta a brevi raffiche ad alta intensità.',
    sets: [
      { duration: '20 sec', rest: '15 sec' },
      { duration: '30 sec', rest: '15 sec' },
      { duration: '30 sec', rest: '20 sec' },
      { duration: '30 sec', rest: '30 sec' },
    ],
    tips: [
      'Porta le ginocchia all\'altezza della vita',
      'Tieni il petto aperto e lo sguardo avanti',
      'Lascia che le braccia accompagnino il ritmo',
      'Rallenta se ti manca il fiato',
    ],
    videoQuery: 'high knees exercise tutorial',
  },
  {
    id: 'mountain-climber-cardio',
    name: 'Mountain Climbers',
    category: 'Cardio',
    difficulty: 'Intermediate',
    targetMuscles: ['Cardiovascolare', 'Core', 'Flessori dell\'anca', 'Spalle'],
    caloriesBurned: '120–160 kcal / 10 min',
    icon: '🧗',
    description: 'Parti in plank alto. Porta rapidamente e in modo alternato un ginocchio verso il petto. Tieni i fianchi stabili e il core contratto per tutto il tempo.',
    sets: [
      { duration: '20 sec', rest: '20 sec' },
      { duration: '30 sec', rest: '20 sec' },
      { duration: '30 sec', rest: '20 sec' },
      { duration: '40 sec', rest: '30 sec' },
    ],
    tips: [
      'Tieni i fianchi bassi — niente rimbalzi',
      'Spalle direttamente sopra i polsi',
      'Più vai veloce, migliore è l\'effetto cardio',
      'Rallenta con attenzione se la tecnica si rompe',
    ],
    videoQuery: 'mountain climbers exercise tutorial',
  },
  {
    id: 'burpee',
    name: 'Burpee',
    category: 'Cardio',
    difficulty: 'Advanced',
    targetMuscles: ['Corpo intero', 'Cardiovascolare', 'Petto', 'Core', 'Gambe'],
    caloriesBurned: '150–200 kcal / 10 min',
    icon: '💥',
    description: 'Dalla posizione eretta scendi in plank, esegui un piegamento, riporta i piedi avanti con un salto, poi salta esplosivamente con le mani sopra la testa. Uno dei movimenti a corpo libero che brucia più calorie.',
    sets: [
      { duration: '20 sec', rest: '30 sec' },
      { duration: '25 sec', rest: '30 sec' },
      { duration: '30 sec', rest: '40 sec' },
    ],
    tips: [
      'Fai un passo indietro invece di saltare se sei principiante',
      'Atterraggio morbido sul salto — ammortizza con le gambe',
      'Espira durante il piegamento e il salto',
      'Controlla il ritmo — qualità prima della quantità',
    ],
    videoQuery: 'burpee exercise tutorial for beginners',
  },
  {
    id: 'skater-step',
    name: 'Passi del pattinatore',
    category: 'Cardio',
    difficulty: 'Intermediate',
    targetMuscles: ['Glutei', 'Quadricipiti', 'Adduttori', 'Cardiovascolare'],
    caloriesBurned: '90–130 kcal / 10 min',
    icon: '⛸️',
    description: 'Balza lateralmente da un piede all\'altro, atterrando dolcemente in un leggero squat. Imita la falcata di un pattinatore di velocità. Ottimo cardio a basso impatto che lavora i glutei esterni.',
    sets: [
      { duration: '30 sec', rest: '15 sec' },
      { duration: '40 sec', rest: '20 sec' },
      { duration: '45 sec', rest: '20 sec' },
    ],
    tips: [
      'Atterra dolcemente a ogni balzo — ammortizza con il ginocchio',
      'Tieni il busto leggermente inclinato in avanti',
      'Le braccia oscillano in senso opposto alla gamba di spinta',
      'Guarda dritto davanti a te, non il pavimento',
    ],
    videoQuery: 'skater steps cardio exercise tutorial',
  },
  // ── CORE ─────────────────────────────────────────────────────────────────
  {
    id: 'crunch',
    name: 'Crunch',
    category: 'Core',
    difficulty: 'Beginner',
    targetMuscles: ['Addominali alti', 'Retto addominale'],
    caloriesBurned: '40–60 kcal / 10 min',
    icon: '🔥',
    description: 'Sdraiati supino, ginocchia piegate, mani dietro la testa. Solleva le spalle dal pavimento usando gli addominali — non il collo — e abbassati lentamente.',
    sets: [
      { reps: '15', rest: '30 sec' },
      { reps: '20', rest: '30 sec' },
      { reps: '20', rest: '30 sec' },
    ],
    tips: [
      'Non tirare il collo — sostienilo leggermente',
      'Espira mentre sali',
      'Abbassati lentamente — la fase eccentrica conta',
      'Tieni la zona lombare aderente al pavimento',
    ],
    videoQuery: 'crunch abs exercise tutorial',
  },
  {
    id: 'leg-raise',
    name: 'Sollevamento gambe',
    category: 'Core',
    difficulty: 'Intermediate',
    targetMuscles: ['Addominali bassi', 'Flessori dell\'anca', 'Core'],
    caloriesBurned: '45–65 kcal / 10 min',
    icon: '⬆️',
    description: 'Sdraiati supino con le gambe distese. Solleva lentamente le gambe a 90° tenendole dritte, poi abbassale senza toccare il pavimento. Lavora gli addominali bassi.',
    sets: [
      { reps: '10', rest: '30 sec' },
      { reps: '12', rest: '30 sec' },
      { reps: '15', rest: '30 sec' },
    ],
    tips: [
      'Premi la zona lombare contro il pavimento per tutto il tempo',
      'Muoviti lentamente — evita lo slancio',
      'Piega le ginocchia per adattarlo se necessario',
      'Non trattenere il respiro',
    ],
    videoQuery: 'leg raise abs exercise tutorial',
  },
  {
    id: 'plank',
    name: 'Plank',
    category: 'Core',
    difficulty: 'Beginner',
    targetMuscles: ['Core', 'Spalle', 'Glutei', 'Schiena'],
    caloriesBurned: '30–50 kcal / 10 min',
    icon: '🧱',
    description: 'Mantieni una posizione di piegamento sugli avambracci o sulle mani. Tieni il corpo in linea retta dalla testa ai talloni. Contrai tutto e respira in modo regolare.',
    sets: [
      { duration: '20 sec', rest: '30 sec' },
      { duration: '30 sec', rest: '30 sec' },
      { duration: '40 sec', rest: '40 sec' },
    ],
    tips: [
      'Non lasciare che i fianchi si abbassino o si alzino',
      'Contrai glutei e addominali',
      'Guarda il pavimento, collo neutro',
      'Aumenta il tempo gradualmente settimana dopo settimana',
    ],
    videoQuery: 'plank exercise tutorial proper form',
  },
  {
    id: 'bicycle-crunch',
    name: 'Crunch bicicletta',
    category: 'Core',
    difficulty: 'Intermediate',
    targetMuscles: ['Obliqui', 'Retto addominale', 'Flessori dell\'anca'],
    caloriesBurned: '50–70 kcal / 10 min',
    icon: '🚴',
    description: 'Sdraiati supino con le mani dietro la testa. Porta in modo alternato il gomito opposto verso il ginocchio opposto in un movimento di pedalata, tenendo l\'altra gamba distesa.',
    sets: [
      { reps: '20 (10 per lato)', rest: '30 sec' },
      { reps: '24 (12 per lato)', rest: '30 sec' },
      { reps: '30 (15 per lato)', rest: '30 sec' },
    ],
    tips: [
      'Non avere fretta — il controllo batte la velocità',
      'Distendi completamente la gamba che non lavora',
      'Non tirare il collo con le mani',
      'Ruota dalle costole, non solo dai gomiti',
    ],
    videoQuery: 'bicycle crunch abs exercise tutorial',
  },
  {
    id: 'hollow-hold',
    name: 'Hollow Hold',
    category: 'Core',
    difficulty: 'Advanced',
    targetMuscles: ['Core', 'Addominali bassi', 'Flessori dell\'anca', 'Dorsali'],
    caloriesBurned: '40–60 kcal / 10 min',
    icon: '🌙',
    description: 'Sdraiati supino, braccia sopra la testa, gambe distese e leggermente sollevate dal pavimento. Crea una forma a banana incavata. È la base della forza del core in ginnastica.',
    sets: [
      { duration: '15 sec', rest: '30 sec' },
      { duration: '20 sec', rest: '30 sec' },
      { duration: '25 sec', rest: '40 sec' },
    ],
    tips: [
      'Premi con decisione la zona lombare contro il pavimento',
      'Stringi l\'interno coscia',
      'Allunga le braccia lontano sopra la testa — attiva i dorsali',
      'Piega le ginocchia se la zona lombare si solleva',
    ],
    videoQuery: 'hollow hold exercise tutorial core strength',
  },
  // ── PETTO ────────────────────────────────────────────────────────────────
  {
    id: 'pushup',
    name: 'Piegamento',
    category: 'Petto',
    difficulty: 'Beginner',
    targetMuscles: ['Petto', 'Tricipiti', 'Deltoide anteriore', 'Core'],
    caloriesBurned: '50–80 kcal / 10 min',
    icon: '💪',
    description: 'Mani alla larghezza delle spalle, corpo in linea retta. Abbassa il petto verso il pavimento, poi spingi per risalire. Il re degli esercizi per la parte alta a corpo libero.',
    sets: [
      { reps: '10', rest: '45 sec' },
      { reps: '12', rest: '45 sec' },
      { reps: '15', rest: '60 sec' },
    ],
    tips: [
      'Tieni i gomiti a ~45° dal busto — non troppo larghi',
      'Contrai il core per tutto il tempo',
      'Ampiezza completa: il petto sfiora il pavimento',
      'Adattalo sulle ginocchia se necessario — comunque efficace',
    ],
    videoQuery: 'push up proper form tutorial',
  },
  {
    id: 'wide-pushup',
    name: 'Piegamento largo',
    category: 'Petto',
    difficulty: 'Intermediate',
    targetMuscles: ['Petto esterno', 'Deltoide anteriore', 'Tricipiti'],
    caloriesBurned: '55–85 kcal / 10 min',
    icon: '↔️',
    description: 'Come un piegamento, ma con le mani più larghe delle spalle. La posizione più ampia sposta più carico sul petto. Tieni i gomiti rivolti all\'indietro, non verso l\'esterno.',
    sets: [
      { reps: '10', rest: '45 sec' },
      { reps: '12', rest: '45 sec' },
      { reps: '12', rest: '60 sec' },
    ],
    tips: [
      'Non lasciare che i gomiti si aprano di lato',
      'Pensa "petto al pavimento"',
      'Tieni le spalle basse, non sollevate',
      'Aggiungi una pausa di 1 secondo in basso per più sfida',
    ],
    videoQuery: 'wide grip push up chest exercise tutorial',
  },
  {
    id: 'diamond-pushup',
    name: 'Piegamento a diamante',
    category: 'Petto',
    difficulty: 'Advanced',
    targetMuscles: ['Tricipiti', 'Petto interno', 'Deltoide anteriore'],
    caloriesBurned: '55–90 kcal / 10 min',
    icon: '💎',
    description: 'Mani ravvicinate sotto lo sterno, a formare un rombo. Sposta molto carico su tricipiti e petto interno. Tieni i gomiti vicini al corpo.',
    sets: [
      { reps: '8', rest: '60 sec' },
      { reps: '10', rest: '60 sec' },
      { reps: '10', rest: '60 sec' },
    ],
    tips: [
      'I gomiti restano vicini — non lasciarli aprire',
      'Mani a rombo direttamente sotto il petto',
      'Abbassati lentamente per la massima tensione muscolare',
      'Core forte — niente fianchi cedevoli',
    ],
    videoQuery: 'diamond push up triceps exercise tutorial',
  },
  {
    id: 'archer-pushup',
    name: 'Piegamento arciere',
    category: 'Petto',
    difficulty: 'Advanced',
    targetMuscles: ['Petto (unilaterale)', 'Tricipiti', 'Stabilizzatori'],
    caloriesBurned: '60–95 kcal / 10 min',
    icon: '🏹',
    description: 'Piegamento in posizione larga in cui un braccio resta disteso mentre ti abbassi sul lato opposto. Di fatto un piegamento a un braccio assistito — sviluppa una notevole forza unilaterale del petto.',
    sets: [
      { reps: '5 per lato', rest: '60 sec' },
      { reps: '6 per lato', rest: '60 sec' },
      { reps: '8 per lato', rest: '75 sec' },
    ],
    tips: [
      'Tieni il braccio disteso bloccato — spingi nel pavimento',
      'Abbassati lentamente e con controllo',
      'I fianchi restano allineati — nessuna rotazione',
      'Progredisci prima dai piegamenti larghi',
    ],
    videoQuery: 'archer push up exercise tutorial one arm progression',
  },
  {
    id: 'pushup-hold',
    name: 'Tenuta del piegamento (basso)',
    category: 'Petto',
    difficulty: 'Intermediate',
    targetMuscles: ['Petto', 'Tricipiti', 'Core', 'Stabilizzatori'],
    caloriesBurned: '40–70 kcal / 10 min',
    icon: '⏸️',
    description: 'Abbassati nella parte bassa di un piegamento e mantieni. La tensione isometrica sviluppa una forza e una stabilità articolare straordinarie. Preparazione essenziale per i movimenti di spinta avanzati.',
    sets: [
      { duration: '15 sec', rest: '45 sec' },
      { duration: '20 sec', rest: '45 sec' },
      { duration: '25 sec', rest: '60 sec' },
    ],
    tips: [
      'Gomiti a 45° — non più larghi',
      'Contrai tutto: petto, core, glutei',
      'Respira in modo regolare — non trattenere il respiro',
      'Aggiungilo alle tue serie abituali di piegamenti',
    ],
    videoQuery: 'push up hold isometric chest exercise tutorial',
  },
  // ── BRACCIA E POLSI ─────────────────────────────────────────────────────────
  {
    id: 'triceps-pushup',
    name: 'Piegamento per tricipiti',
    category: 'Braccia e Polsi',
    difficulty: 'Intermediate',
    targetMuscles: ['Tricipiti', 'Petto', 'Core'],
    caloriesBurned: '50–80 kcal / 10 min',
    icon: '🦾',
    description: 'Piegamento standard con le mani ravvicinate direttamente sotto le spalle. I gomiti restano aderenti ai fianchi mentre ti abbassi. Massimo isolamento dei tricipiti a corpo libero.',
    sets: [
      { reps: '10', rest: '45 sec' },
      { reps: '12', rest: '45 sec' },
      { reps: '15', rest: '60 sec' },
    ],
    tips: [
      'Tieni i gomiti aderenti alle costole — non aprirli',
      'Ampiezza completa: petto vicino al pavimento',
      'Abbassati lentamente',
      'Prova un deficit (mani su libri) per più ampiezza',
    ],
    videoQuery: 'triceps push up close grip tutorial',
  },
  {
    id: 'plank-shoulder-tap',
    name: 'Tocco della spalla in plank',
    category: 'Braccia e Polsi',
    difficulty: 'Intermediate',
    targetMuscles: ['Core', 'Spalle', 'Tricipiti', 'Anti-rotazione'],
    caloriesBurned: '45–70 kcal / 10 min',
    icon: '👆',
    description: 'Mantieni un plank alto, poi tocca in modo alternato ogni spalla con la mano opposta. Sfida la stabilità anti-rotazione del core — i fianchi devono restare allineati per tutto il tempo.',
    sets: [
      { reps: '10 per lato', rest: '30 sec' },
      { reps: '12 per lato', rest: '30 sec' },
      { reps: '15 per lato', rest: '45 sec' },
    ],
    tips: [
      'Allarga la posizione dei piedi per ridurre il dondolio dei fianchi',
      'Tocca leggero e veloce — riduci al minimo la rotazione',
      'Respira in modo regolare per tutto il tempo',
      'Guarda il pavimento, collo neutro',
    ],
    videoQuery: 'plank shoulder tap core stability exercise',
  },
  {
    id: 'wrist-circles',
    name: 'Cerchi con i polsi',
    category: 'Braccia e Polsi',
    difficulty: 'Beginner',
    targetMuscles: ['Polso', 'Avambraccio'],
    caloriesBurned: '10–20 kcal / 10 min',
    icon: '🔄',
    description: 'Con le braccia distese, ruota lentamente i polsi in cerchi completi — in entrambi i sensi. Riscaldamento essenziale prima di qualsiasi esercizio di spinta o che carichi i polsi.',
    sets: [
      { duration: '30 sec per senso', rest: '10 sec' },
      { duration: '30 sec per senso', rest: '10 sec' },
    ],
    tips: [
      'Muoviti lentamente e per tutta l\'ampiezza',
      'Se senti attriti, rallenta',
      'Fallo prima di ogni sessione di piegamenti',
      'Aumenta la velocità gradualmente nel tempo',
    ],
    videoQuery: 'wrist mobility warm up exercise',
  },
  {
    id: 'wrist-rocks',
    name: 'Dondolii dei polsi',
    category: 'Braccia e Polsi',
    difficulty: 'Beginner',
    targetMuscles: ['Polso', 'Avambraccio', 'Stabilità della spalla'],
    caloriesBurned: '15–25 kcal / 10 min',
    icon: '🪨',
    description: 'A quattro zampe, dondola lentamente il peso del corpo avanti e indietro sopra i polsi. Condiziona l\'articolazione a sostenere il carico e migliora la flessibilità in estensione.',
    sets: [
      { duration: '20 sec', rest: '20 sec' },
      { duration: '25 sec', rest: '20 sec' },
      { duration: '30 sec', rest: '30 sec' },
    ],
    tips: [
      'Inizia con delicatezza — aumenta la pressione lentamente',
      'Fermati se senti un dolore acuto',
      'Allarga bene le dita',
      'Prevenzione quotidiana ideale per gli atleti di spinta',
    ],
    videoQuery: 'wrist rocks mobility exercise for push ups',
  },
  {
    id: 'forearm-plank-shift',
    name: 'Dondolio in plank sugli avambracci',
    category: 'Braccia e Polsi',
    difficulty: 'Intermediate',
    targetMuscles: ['Avambracci', 'Tricipiti', 'Core', 'Spalle'],
    caloriesBurned: '45–75 kcal / 10 min',
    icon: '🧱',
    description: 'In plank sugli avambracci, dondola il corpo avanti e indietro in un arco controllato. Avambracci, spalle e core lavorano insieme sotto tensione costante.',
    sets: [
      { duration: '20 sec', rest: '30 sec' },
      { duration: '25 sec', rest: '30 sec' },
      { duration: '30 sec', rest: '45 sec' },
    ],
    tips: [
      'Tieni i gomiti direttamente sotto le spalle',
      'I fianchi restano allineati — niente cedimenti',
      'Movimento piccolo e controllato — niente grandi oscillazioni',
      'Respira in modo ritmico per tutto il tempo',
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
    description: 'High protein + controlled calorie approach for gradual fat loss. Supports muscle retention while keeping the plan sustainable. Best paired with resistance training.',
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
// Diet Data — German
// ═══════════════════════════════════════════════════════════════════════════

const DIETS_DE: Diet[] = [
  {
    id: 'clean-bulk',
    name: 'Clean Bulk',
    goal: 'gain',
    duration: '8–12 Wochen',
    dailyCalories: '2800–3200 kcal',
    description: 'Eine Ernährung mit Fokus auf Muskelaufbau mit hochwertigen Lebensmitteln. Ziel ist der Aufbau fettarmer Muskelmasse mit einem kontrollierten Kalorienüberschuss bei minimalem Fettzuwachs.',
    macroSplit: { protein: '30%', carbs: '45%', fat: '25%' },
    keyPoints: [
      'Täglich 1,8–2,2 g/kg Eiweiß aufnehmen',
      'Eine Eiweißquelle in jeder Mahlzeit einplanen',
      'Kohlenhydrate rund ums Training timen (davor und danach)',
      'Gesunde Fette nicht weglassen (Olivenöl, Avocado, Nüsse)',
      '0,3–0,5 kg Zunahme pro Woche anstreben',
      'Viel Wasser trinken – mindestens 3 Liter am Tag',
    ],
    sampleDay: [
      { time: '07:00', label: 'Frühstück', foods: ['4 Eier (2 ganz + 2 Eiweiß)', 'Haferflocken 80 g + Banane + Honig', '1 Glas Milch', '30 g Mandeln'], macros: { cal: 750, p: 42, c: 78, f: 28 } },
      { time: '10:00', label: 'Snack', foods: ['Griechischer Joghurt 200 g', '1 Banane', '20 g Walnüsse', '1 EL Honig'], macros: { cal: 380, p: 22, c: 48, f: 14 } },
      { time: '13:00', label: 'Mittagessen', foods: ['Gegrillte Hähnchenbrust 200 g', 'Bulgur-Pilaw 250 g', 'Grüner Salat + Olivenöl', '1 Scheibe Brot'], macros: { cal: 720, p: 55, c: 80, f: 18 } },
      { time: '16:00', label: 'Vor dem Training', foods: ['Vollkorntoast + Käse', '1 Banane', 'Eine Handvoll Rosinen'], macros: { cal: 420, p: 16, c: 65, f: 12 } },
      { time: '19:00', label: 'Nach dem Training / Abendessen', foods: ['Lachs 200 g (im Ofen)', 'Weißer Reis 200 g', 'Gedämpfter Brokkoli 150 g', '1 EL Olivenöl'], macros: { cal: 750, p: 48, c: 70, f: 28 } },
      { time: '22:00', label: 'Snack am Abend', foods: ['Hüttenkäse 150 g', '30 g Haselnüsse', '1 EL Tahin'], macros: { cal: 350, p: 24, c: 12, f: 22 } },
    ],
  },
  {
    id: 'lean-bulk',
    name: 'Lean Bulk',
    goal: 'gain',
    duration: '12–16 Wochen',
    dailyCalories: '2500–2800 kcal',
    description: 'Muskelaufbau mit minimalem Fettzuwachs. Ein knapperer Kalorienüberschuss mit viel Eiweiß. Erfordert Geduld, liefert aber ein definierteres Ergebnis.',
    macroSplit: { protein: '35%', carbs: '40%', fat: '25%' },
    keyPoints: [
      'Täglich 2,0–2,4 g/kg Eiweiß aufnehmen',
      'Kalorienüberschuss auf +200–300 kcal begrenzen',
      'Kohlenhydrate auf die Trainingstage konzentrieren',
      'An Ruhetagen Fett erhöhen und Kohlenhydrate reduzieren',
      '0,2–0,3 kg Zunahme pro Woche anstreben',
      'Verarbeitete Lebensmittel meiden',
    ],
    sampleDay: [
      { time: '07:00', label: 'Frühstück', foods: ['Omelett aus 3 Eiern (mit Gemüse)', '2 Scheiben Vollkornbrot', 'Eine halbe Avocado', '1 Glas Ayran (Joghurtgetränk)'], macros: { cal: 580, p: 32, c: 42, f: 30 } },
      { time: '10:00', label: 'Snack', foods: ['Griechischer Joghurt 200 g (0 %)', 'Eine Handvoll Heidelbeeren', '20 g Mandeln'], macros: { cal: 280, p: 24, c: 22, f: 12 } },
      { time: '13:00', label: 'Mittagessen', foods: ['Gegrillte Hähnchenbrust 200 g', 'Quinoa 150 g', 'Mediterraner Salat', '1 EL Olivenöl'], macros: { cal: 620, p: 52, c: 52, f: 20 } },
      { time: '16:00', label: 'Vor dem Training', foods: ['Reiswaffel + 1 EL Erdnussbutter', '1 Banane'], macros: { cal: 320, p: 10, c: 50, f: 10 } },
      { time: '19:00', label: 'Abendessen', foods: ['Rinderhüftsteak 180 g (gegrillt)', 'Süßkartoffel 200 g (im Ofen)', 'Gedämpfte Zucchini und Karotten'], macros: { cal: 580, p: 45, c: 55, f: 16 } },
      { time: '21:30', label: 'Spätabends', foods: ['Hüttenkäse 100 g', '10 g Walnüsse'], macros: { cal: 160, p: 14, c: 5, f: 10 } },
    ],
  },
  {
    id: 'calorie-deficit',
    name: 'Kaloriendefizit-Diät',
    goal: 'lose',
    duration: '8–12 Wochen',
    dailyCalories: '1600–1900 kcal',
    description: 'Fettabbau durch ein kontrolliertes Kaloriendefizit. Viel Eiweiß minimiert den Muskelverlust. Ein nachhaltiger und gesunder Ansatz zur Gewichtsreduktion.',
    macroSplit: { protein: '40%', carbs: '30%', fat: '30%' },
    keyPoints: [
      '2,0–2,5 g/kg Eiweiß aufnehmen – Muskelverlust verhindern',
      'Defizit auf 400–600 kcal/Tag begrenzen',
      'Ballaststoffreiche Lebensmittel sättigen (Gemüse, Hülsenfrüchte, Vollkorn)',
      'Zuckerhaltige Getränke komplett streichen',
      '0,5–0,7 kg Abnahme pro Woche anstreben',
      'Bei Hunger zu Eiweiß oder Gemüse greifen',
    ],
    sampleDay: [
      { time: '08:00', label: 'Frühstück', foods: ['Omelett aus 3 Eiweiß + 1 ganzem Ei', 'Tomate + Paprika + Blattgemüse', '1 Scheibe Vollkornbrot'], macros: { cal: 280, p: 26, c: 18, f: 12 } },
      { time: '10:30', label: 'Snack', foods: ['Fettarmer griechischer Joghurt 150 g', '1 Apfel'], macros: { cal: 140, p: 16, c: 18, f: 1 } },
      { time: '13:00', label: 'Mittagessen', foods: ['Gegrillte Hähnchenbrust 200 g', 'Großer grüner Salat', 'Bulgur 100 g (gekocht)', '1 TL Olivenöl'], macros: { cal: 450, p: 50, c: 32, f: 12 } },
      { time: '16:00', label: 'Snack', foods: ['15 g Mandeln', '1 rohe Karotte'], macros: { cal: 130, p: 4, c: 10, f: 9 } },
      { time: '19:00', label: 'Abendessen', foods: ['Wolfsbarsch aus dem Ofen 200 g', 'Gedämpfter Brokkoli + Blumenkohl 200 g', '1 TL Olivenöl'], macros: { cal: 350, p: 46, c: 10, f: 12 } },
      { time: '21:00', label: 'Spätabends (optional)', foods: ['Hüttenkäse 100 g', 'Gurke'], macros: { cal: 95, p: 13, c: 5, f: 2 } },
    ],
  },
  {
    id: 'low-carb',
    name: 'Low-Carb-Diät',
    goal: 'lose',
    duration: '6–10 Wochen',
    dailyCalories: '1500–1800 kcal',
    description: 'Die Einschränkung von Kohlenhydraten bringt den Körper in die Fettverbrennung. Niedrige Insulinwerte verringern die Fetteinlagerung.',
    macroSplit: { protein: '40%', carbs: '15%', fat: '45%' },
    keyPoints: [
      'Kohlenhydrate auf 50–80 g pro Tag begrenzen',
      'Brot, Reis, Nudeln und Zucker weglassen',
      'Auf Eiweiß und gesunde Fette setzen',
      'Gemüse reichlich essen (stärkearm)',
      'In Woche 1 Wasserverlust erwarten – echter Fettabbau ab Woche 2',
      'Elektrolythaushalt beachten (Natrium, Kalium, Magnesium)',
    ],
    sampleDay: [
      { time: '08:00', label: 'Frühstück', foods: ['3 Eier (in Butter)', 'Eine halbe Avocado', '40 g Käse', 'Tomate + Gurke'], macros: { cal: 520, p: 28, c: 10, f: 42 } },
      { time: '11:00', label: 'Snack', foods: ['30 g Walnüsse', '1 Scheibe Kaschkaval-Käse'], macros: { cal: 280, p: 12, c: 4, f: 25 } },
      { time: '13:30', label: 'Mittagessen', foods: ['Lachs 200 g (gegrillt)', 'Gedünsteter Spinat (mit Olivenöl)', 'Joghurt 100 g'], macros: { cal: 520, p: 42, c: 8, f: 36 } },
      { time: '16:30', label: 'Snack', foods: ['Griechischer Joghurt 150 g', '10 g Haselnüsse'], macros: { cal: 160, p: 16, c: 6, f: 8 } },
      { time: '19:30', label: 'Abendessen', foods: ['Lammkotelett 150 g (gegrillt)', 'Gemischter grüner Salat', 'Dressing aus Olivenöl + Zitrone'], macros: { cal: 480, p: 38, c: 5, f: 34 } },
    ],
  },
  {
    id: 'intermittent-gain',
    name: 'Intervallfasten + Bulk',
    goal: 'gain',
    duration: '8–12 Wochen',
    dailyCalories: '2600–3000 kcal',
    description: '16:8-Intervallfasten mit dem Ziel Muskelaufbau. Essensfenster 12:00–20:00 Uhr. Wachstumshormon-Schub + kontrollierter Überschuss für sauberen Muskelaufbau.',
    macroSplit: { protein: '30%', carbs: '45%', fat: '25%' },
    keyPoints: [
      '16 Stunden Fasten, 8 Stunden Essensfenster (12:00–20:00 Uhr)',
      'Die erste Mahlzeit groß gestalten – 35–40 % der Tageskalorien',
      'Innerhalb des Essensfensters trainieren',
      'Während des Fastens: Wasser, schwarzer Tee/Kaffee erlaubt',
      'Mindestens 40 g Eiweiß pro Mahlzeit',
      'Bis 20:00 Uhr aufhören zu essen',
    ],
    sampleDay: [
      { time: '12:00', label: 'Erste Mahlzeit (groß)', foods: ['Omelett aus 4 Eiern + Käse', 'Haferflocken 80 g + Banane + Honig', '2 Scheiben Vollkornbrot', '1 Glas Milch'], macros: { cal: 950, p: 52, c: 100, f: 35 } },
      { time: '15:00', label: 'Snack', foods: ['Hähnchen-Wrap (Fladenbrot + Hähnchen + Gemüse)', '1 Glas Kefir'], macros: { cal: 520, p: 40, c: 45, f: 18 } },
      { time: '17:00', label: 'Vor dem Training', foods: ['1 Banane', '30 g Rosinen', '20 g Mandeln'], macros: { cal: 280, p: 6, c: 48, f: 10 } },
      { time: '19:30', label: 'Nach dem Training', foods: ['Lachs 200 g (im Ofen)', 'Weißer Reis 250 g', 'Brokkoli 150 g', '1 EL Olivenöl'], macros: { cal: 850, p: 50, c: 85, f: 30 } },
    ],
  },
  {
    id: 'high-protein-cut',
    name: 'High-Protein-Cut',
    goal: 'lose',
    duration: '6–8 Wochen',
    dailyCalories: '1700–2000 kcal',
    description: 'Viel Eiweiß + kontrollierte Kalorien für einen schrittweisen Fettabbau. Unterstützt den Muskelerhalt und bleibt dabei nachhaltig. Am besten in Kombination mit Krafttraining.',
    macroSplit: { protein: '45%', carbs: '25%', fat: '30%' },
    keyPoints: [
      '2,5–3,0 g/kg Eiweiß – Muskelerhalt hat Priorität',
      'Mindestens 35 g Eiweiß pro Mahlzeit',
      'Kohlenhydrate rund ums Training konzentrieren (davor/danach)',
      'Omega-3 und Olivenöl als Fettquellen bevorzugen',
      '0,7–1,0 kg Abnahme pro Woche anstreben',
      'Refeed-Tag: einmal pro Woche Kohlenhydrate erhöhen (für volle Muskeln)',
    ],
    sampleDay: [
      { time: '07:30', label: 'Frühstück', foods: ['Omelett aus 5 Eiweiß + 2 ganzen Eiern', 'Spinat + Tomate', 'Hüttenkäse 50 g'], macros: { cal: 340, p: 42, c: 6, f: 16 } },
      { time: '10:00', label: 'Snack', foods: ['Hähnchenbrust 100 g (kalt, in Scheiben)', '1 Gurke'], macros: { cal: 180, p: 32, c: 4, f: 4 } },
      { time: '13:00', label: 'Mittagessen', foods: ['Gegrillte Putenbrust 200 g', 'Gemischter Salat (viel Gemüse)', 'Bulgur 80 g (gekocht)', '1 TL Olivenöl'], macros: { cal: 420, p: 52, c: 25, f: 12 } },
      { time: '16:00', label: 'Vor dem Training', foods: ['Fettarmer griechischer Joghurt 200 g', '1 Apfel'], macros: { cal: 170, p: 20, c: 22, f: 1 } },
      { time: '19:00', label: 'Abendessen', foods: ['Thunfisch 200 g (im eigenen Saft)', 'Gedämpftes Gemüse 200 g', '1/3 Avocado'], macros: { cal: 340, p: 48, c: 10, f: 12 } },
      { time: '21:00', label: 'Spätabends', foods: ['Hüttenkäse 100 g', '5 g Haselnüsse'], macros: { cal: 120, p: 13, c: 4, f: 5 } },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════
// Diet Data — French
// ═══════════════════════════════════════════════════════════════════════════

const DIETS_FR: Diet[] = [
  {
    id: 'clean-bulk',
    name: 'Prise de masse propre',
    goal: 'gain',
    duration: '8–12 semaines',
    dailyCalories: '2800–3200 kcal',
    description: 'Une alimentation axée sur le développement musculaire avec des aliments de qualité. Vise une prise de masse maigre avec un surplus calorique contrôlé, en limitant l\'excès de gras.',
    macroSplit: { protein: '30%', carbs: '45%', fat: '25%' },
    keyPoints: [
      'Consommer 1,8–2,2 g/kg de protéines par jour',
      'Inclure une source de protéines à chaque repas',
      'Concentrer les glucides autour de l\'entraînement (avant et après)',
      'Ne pas négliger les bonnes graisses (huile d\'olive, avocat, fruits à coque)',
      'Viser une prise de 0,3–0,5 kg par semaine',
      'Boire beaucoup d\'eau – au moins 3 litres par jour',
    ],
    sampleDay: [
      { time: '07:00', label: 'Petit-déjeuner', foods: ['4 œufs (2 entiers + 2 blancs)', 'Flocons d\'avoine 80 g + banane + miel', '1 verre de lait', '30 g d\'amandes'], macros: { cal: 750, p: 42, c: 78, f: 28 } },
      { time: '10:00', label: 'Collation', foods: ['Yaourt grec 200 g', '1 banane', '20 g de noix', '1 c. à soupe de miel'], macros: { cal: 380, p: 22, c: 48, f: 14 } },
      { time: '13:00', label: 'Déjeuner', foods: ['Blanc de poulet grillé 200 g', 'Pilaf de boulgour 250 g', 'Salade verte + huile d\'olive', '1 tranche de pain'], macros: { cal: 720, p: 55, c: 80, f: 18 } },
      { time: '16:00', label: 'Avant l\'entraînement', foods: ['Pain complet grillé + fromage', '1 banane', 'Une poignée de raisins secs'], macros: { cal: 420, p: 16, c: 65, f: 12 } },
      { time: '19:00', label: 'Après l\'entraînement / Dîner', foods: ['Saumon 200 g (au four)', 'Riz blanc 200 g', 'Brocoli vapeur 150 g', '1 c. à soupe d\'huile d\'olive'], macros: { cal: 750, p: 48, c: 70, f: 28 } },
      { time: '22:00', label: 'Collation du soir', foods: ['Fromage blanc 150 g', '30 g de noisettes', '1 c. à soupe de tahin'], macros: { cal: 350, p: 24, c: 12, f: 22 } },
    ],
  },
  {
    id: 'lean-bulk',
    name: 'Prise de masse sèche',
    goal: 'gain',
    duration: '12–16 semaines',
    dailyCalories: '2500–2800 kcal',
    description: 'Prise de muscle avec un minimum de gras. Un surplus calorique plus serré avec beaucoup de protéines. Demande de la patience, mais donne un résultat plus sec.',
    macroSplit: { protein: '35%', carbs: '40%', fat: '25%' },
    keyPoints: [
      'Consommer 2,0–2,4 g/kg de protéines par jour',
      'Limiter le surplus calorique à +200–300 kcal',
      'Concentrer les glucides sur les jours d\'entraînement',
      'Augmenter les graisses et réduire les glucides les jours de repos',
      'Viser une prise de 0,2–0,3 kg par semaine',
      'Éviter les aliments transformés',
    ],
    sampleDay: [
      { time: '07:00', label: 'Petit-déjeuner', foods: ['Omelette de 3 œufs (aux légumes)', '2 tranches de pain complet', 'Un demi-avocat', '1 verre d\'ayran (boisson au yaourt)'], macros: { cal: 580, p: 32, c: 42, f: 30 } },
      { time: '10:00', label: 'Collation', foods: ['Yaourt grec 200 g (0 %)', 'Une poignée de myrtilles', '20 g d\'amandes'], macros: { cal: 280, p: 24, c: 22, f: 12 } },
      { time: '13:00', label: 'Déjeuner', foods: ['Blanc de poulet grillé 200 g', 'Quinoa 150 g', 'Salade méditerranéenne', '1 c. à soupe d\'huile d\'olive'], macros: { cal: 620, p: 52, c: 52, f: 20 } },
      { time: '16:00', label: 'Avant l\'entraînement', foods: ['Galette de riz + 1 c. à soupe de beurre de cacahuète', '1 banane'], macros: { cal: 320, p: 10, c: 50, f: 10 } },
      { time: '19:00', label: 'Dîner', foods: ['Bavette de bœuf 180 g (grillée)', 'Patate douce 200 g (au four)', 'Courgettes et carottes vapeur'], macros: { cal: 580, p: 45, c: 55, f: 16 } },
      { time: '21:30', label: 'Soir', foods: ['Fromage blanc 100 g', '10 g de noix'], macros: { cal: 160, p: 14, c: 5, f: 10 } },
    ],
  },
  {
    id: 'calorie-deficit',
    name: 'Régime déficit calorique',
    goal: 'lose',
    duration: '8–12 semaines',
    dailyCalories: '1600–1900 kcal',
    description: 'Perte de gras grâce à un déficit calorique contrôlé. Un apport protéique élevé limite la perte musculaire. Une approche durable et saine de la perte de poids.',
    macroSplit: { protein: '40%', carbs: '30%', fat: '30%' },
    keyPoints: [
      'Consommer 2,0–2,5 g/kg de protéines – éviter la perte musculaire',
      'Maintenir le déficit à 400–600 kcal/jour',
      'Les aliments riches en fibres rassasient (légumes, légumineuses, céréales complètes)',
      'Supprimer totalement les boissons sucrées',
      'Viser une perte de 0,5–0,7 kg par semaine',
      'En cas de faim, opter pour des protéines ou des légumes',
    ],
    sampleDay: [
      { time: '08:00', label: 'Petit-déjeuner', foods: ['Omelette de 3 blancs + 1 œuf entier', 'Tomate + poivron + verdure', '1 tranche de pain complet'], macros: { cal: 280, p: 26, c: 18, f: 12 } },
      { time: '10:30', label: 'Collation', foods: ['Yaourt grec allégé 150 g', '1 pomme'], macros: { cal: 140, p: 16, c: 18, f: 1 } },
      { time: '13:00', label: 'Déjeuner', foods: ['Blanc de poulet grillé 200 g', 'Grande salade verte', 'Boulgour 100 g (cuit)', '1 c. à café d\'huile d\'olive'], macros: { cal: 450, p: 50, c: 32, f: 12 } },
      { time: '16:00', label: 'Collation', foods: ['15 g d\'amandes', '1 carotte crue'], macros: { cal: 130, p: 4, c: 10, f: 9 } },
      { time: '19:00', label: 'Dîner', foods: ['Bar au four 200 g', 'Brocoli + chou-fleur vapeur 200 g', '1 c. à café d\'huile d\'olive'], macros: { cal: 350, p: 46, c: 10, f: 12 } },
      { time: '21:00', label: 'Soir (facultatif)', foods: ['Fromage blanc 100 g', 'Concombre'], macros: { cal: 95, p: 13, c: 5, f: 2 } },
    ],
  },
  {
    id: 'low-carb',
    name: 'Régime pauvre en glucides',
    goal: 'lose',
    duration: '6–10 semaines',
    dailyCalories: '1500–1800 kcal',
    description: 'Limiter les glucides oriente le corps vers la combustion des graisses. Maintenir un taux d\'insuline bas réduit le stockage des graisses.',
    macroSplit: { protein: '40%', carbs: '15%', fat: '45%' },
    keyPoints: [
      'Limiter les glucides à 50–80 g par jour',
      'Supprimer le pain, le riz, les pâtes et le sucre',
      'Privilégier les protéines et les bonnes graisses',
      'Manger des légumes à volonté (peu d\'amidon)',
      'Attendre une perte d\'eau en semaine 1 – la vraie perte de gras débute en semaine 2',
      'Surveiller l\'équilibre électrolytique (sodium, potassium, magnésium)',
    ],
    sampleDay: [
      { time: '08:00', label: 'Petit-déjeuner', foods: ['3 œufs (au beurre)', 'Un demi-avocat', '40 g de fromage', 'Tomate + concombre'], macros: { cal: 520, p: 28, c: 10, f: 42 } },
      { time: '11:00', label: 'Collation', foods: ['30 g de noix', '1 tranche de fromage kashkaval'], macros: { cal: 280, p: 12, c: 4, f: 25 } },
      { time: '13:30', label: 'Déjeuner', foods: ['Saumon 200 g (grillé)', 'Épinards sautés (à l\'huile d\'olive)', 'Yaourt 100 g'], macros: { cal: 520, p: 42, c: 8, f: 36 } },
      { time: '16:30', label: 'Collation', foods: ['Yaourt grec 150 g', '10 g de noisettes'], macros: { cal: 160, p: 16, c: 6, f: 8 } },
      { time: '19:30', label: 'Dîner', foods: ['Côtelette d\'agneau 150 g (grillée)', 'Salade verte mélangée', 'Vinaigrette huile d\'olive + citron'], macros: { cal: 480, p: 38, c: 5, f: 34 } },
    ],
  },
  {
    id: 'intermittent-gain',
    name: 'Jeûne intermittent + Prise de masse',
    goal: 'gain',
    duration: '8–12 semaines',
    dailyCalories: '2600–3000 kcal',
    description: 'Jeûne intermittent 16:8 avec objectif de développement musculaire. Fenêtre alimentaire de 12h00 à 20h00. Stimulation de l\'hormone de croissance + surplus contrôlé pour une prise de muscle propre.',
    macroSplit: { protein: '30%', carbs: '45%', fat: '25%' },
    keyPoints: [
      '16 heures de jeûne, fenêtre alimentaire de 8 heures (12h00–20h00)',
      'Faire du premier repas un gros repas – 35–40 % des calories quotidiennes',
      'S\'entraîner pendant la fenêtre alimentaire',
      'Pendant le jeûne : eau, thé noir/café autorisés',
      'Au moins 40 g de protéines par repas',
      'Arrêter de manger à 20h00',
    ],
    sampleDay: [
      { time: '12:00', label: 'Premier repas (copieux)', foods: ['Omelette de 4 œufs + fromage', 'Flocons d\'avoine 80 g + banane + miel', '2 tranches de pain complet', '1 verre de lait'], macros: { cal: 950, p: 52, c: 100, f: 35 } },
      { time: '15:00', label: 'Collation', foods: ['Wrap au poulet (galette + poulet + légumes)', '1 verre de kéfir'], macros: { cal: 520, p: 40, c: 45, f: 18 } },
      { time: '17:00', label: 'Avant l\'entraînement', foods: ['1 banane', '30 g de raisins secs', '20 g d\'amandes'], macros: { cal: 280, p: 6, c: 48, f: 10 } },
      { time: '19:30', label: 'Après l\'entraînement', foods: ['Saumon 200 g (au four)', 'Riz blanc 250 g', 'Brocoli 150 g', '1 c. à soupe d\'huile d\'olive'], macros: { cal: 850, p: 50, c: 85, f: 30 } },
    ],
  },
  {
    id: 'high-protein-cut',
    name: 'Sèche hyperprotéinée',
    goal: 'lose',
    duration: '6–8 semaines',
    dailyCalories: '1700–2000 kcal',
    description: 'Approche riche en protéines + calories contrôlées pour une perte de gras progressive. Favorise le maintien musculaire tout en restant tenable. Idéale associée à la musculation.',
    macroSplit: { protein: '45%', carbs: '25%', fat: '30%' },
    keyPoints: [
      '2,5–3,0 g/kg de protéines – priorité au maintien musculaire',
      'Au moins 35 g de protéines par repas',
      'Concentrer les glucides autour de l\'entraînement (avant/après)',
      'Privilégier l\'oméga-3 et l\'huile d\'olive comme sources de gras',
      'Viser une perte de 0,7–1,0 kg par semaine',
      'Jour de recharge : augmenter les glucides une fois par semaine (pour la plénitude musculaire)',
    ],
    sampleDay: [
      { time: '07:30', label: 'Petit-déjeuner', foods: ['Omelette de 5 blancs + 2 œufs entiers', 'Épinards + tomate', 'Fromage blanc 50 g'], macros: { cal: 340, p: 42, c: 6, f: 16 } },
      { time: '10:00', label: 'Collation', foods: ['Blanc de poulet 100 g (froid, en tranches)', '1 concombre'], macros: { cal: 180, p: 32, c: 4, f: 4 } },
      { time: '13:00', label: 'Déjeuner', foods: ['Blanc de dinde grillé 200 g', 'Salade mélangée (beaucoup de légumes)', 'Boulgour 80 g (cuit)', '1 c. à café d\'huile d\'olive'], macros: { cal: 420, p: 52, c: 25, f: 12 } },
      { time: '16:00', label: 'Avant l\'entraînement', foods: ['Yaourt grec allégé 200 g', '1 pomme'], macros: { cal: 170, p: 20, c: 22, f: 1 } },
      { time: '19:00', label: 'Dîner', foods: ['Thon 200 g (au naturel)', 'Légumes vapeur 200 g', '1/3 d\'avocat'], macros: { cal: 340, p: 48, c: 10, f: 12 } },
      { time: '21:00', label: 'Soir', foods: ['Fromage blanc 100 g', '5 g de noisettes'], macros: { cal: 120, p: 13, c: 4, f: 5 } },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════
// Diet Data — Spanish
// ═══════════════════════════════════════════════════════════════════════════

const DIETS_ES: Diet[] = [
  {
    id: 'clean-bulk',
    name: 'Volumen limpio',
    goal: 'gain',
    duration: '8–12 semanas',
    dailyCalories: '2800–3200 kcal',
    description: 'Una dieta centrada en ganar músculo con alimentos de calidad. Busca aumentar masa magra con un superávit calórico controlado, minimizando el exceso de grasa.',
    macroSplit: { protein: '30%', carbs: '45%', fat: '25%' },
    keyPoints: [
      'Tomar 1,8–2,2 g/kg de proteína al día',
      'Incluir una fuente de proteína en cada comida',
      'Concentrar los carbohidratos en torno al entrenamiento (antes y después)',
      'No omitir las grasas saludables (aceite de oliva, aguacate, frutos secos)',
      'Apuntar a 0,3–0,5 kg de aumento por semana',
      'Beber mucha agua: al menos 3 litros al día',
    ],
    sampleDay: [
      { time: '07:00', label: 'Desayuno', foods: ['4 huevos (2 enteros + 2 claras)', 'Avena 80 g + plátano + miel', '1 vaso de leche', '30 g de almendras'], macros: { cal: 750, p: 42, c: 78, f: 28 } },
      { time: '10:00', label: 'Tentempié', foods: ['Yogur griego 200 g', '1 plátano', '20 g de nueces', '1 cda. de miel'], macros: { cal: 380, p: 22, c: 48, f: 14 } },
      { time: '13:00', label: 'Almuerzo', foods: ['Pechuga de pollo a la plancha 200 g', 'Pilaf de bulgur 250 g', 'Ensalada verde + aceite de oliva', '1 rebanada de pan'], macros: { cal: 720, p: 55, c: 80, f: 18 } },
      { time: '16:00', label: 'Antes del entrenamiento', foods: ['Tostada integral + queso', '1 plátano', 'Un puñado de pasas'], macros: { cal: 420, p: 16, c: 65, f: 12 } },
      { time: '19:00', label: 'Después del entrenamiento / Cena', foods: ['Salmón 200 g (al horno)', 'Arroz blanco 200 g', 'Brócoli al vapor 150 g', '1 cda. de aceite de oliva'], macros: { cal: 750, p: 48, c: 70, f: 28 } },
      { time: '22:00', label: 'Tentempié nocturno', foods: ['Requesón 150 g', '30 g de avellanas', '1 cda. de tahini'], macros: { cal: 350, p: 24, c: 12, f: 22 } },
    ],
  },
  {
    id: 'lean-bulk',
    name: 'Volumen magro',
    goal: 'gain',
    duration: '12–16 semanas',
    dailyCalories: '2500–2800 kcal',
    description: 'Ganancia muscular con mínima acumulación de grasa. Un superávit calórico más ajustado con alta proteína. Requiere paciencia, pero da un resultado más definido.',
    macroSplit: { protein: '35%', carbs: '40%', fat: '25%' },
    keyPoints: [
      'Tomar 2,0–2,4 g/kg de proteína al día',
      'Mantener el superávit calórico en +200–300 kcal',
      'Concentrar los carbohidratos en los días de entrenamiento',
      'Aumentar la grasa y reducir los carbohidratos en los días de descanso',
      'Apuntar a 0,2–0,3 kg de aumento por semana',
      'Evitar los alimentos procesados',
    ],
    sampleDay: [
      { time: '07:00', label: 'Desayuno', foods: ['Tortilla de 3 huevos (con verduras)', '2 rebanadas de pan integral', 'Medio aguacate', '1 vaso de ayran (bebida de yogur)'], macros: { cal: 580, p: 32, c: 42, f: 30 } },
      { time: '10:00', label: 'Tentempié', foods: ['Yogur griego 200 g (0 %)', 'Un puñado de arándanos', '20 g de almendras'], macros: { cal: 280, p: 24, c: 22, f: 12 } },
      { time: '13:00', label: 'Almuerzo', foods: ['Pechuga de pollo a la plancha 200 g', 'Quinoa 150 g', 'Ensalada mediterránea', '1 cda. de aceite de oliva'], macros: { cal: 620, p: 52, c: 52, f: 20 } },
      { time: '16:00', label: 'Antes del entrenamiento', foods: ['Tortita de arroz + 1 cda. de crema de cacahuete', '1 plátano'], macros: { cal: 320, p: 10, c: 50, f: 10 } },
      { time: '19:00', label: 'Cena', foods: ['Solomillo de ternera 180 g (a la plancha)', 'Boniato 200 g (al horno)', 'Calabacín y zanahoria al vapor'], macros: { cal: 580, p: 45, c: 55, f: 16 } },
      { time: '21:30', label: 'Noche', foods: ['Requesón 100 g', '10 g de nueces'], macros: { cal: 160, p: 14, c: 5, f: 10 } },
    ],
  },
  {
    id: 'calorie-deficit',
    name: 'Dieta de déficit calórico',
    goal: 'lose',
    duration: '8–12 semanas',
    dailyCalories: '1600–1900 kcal',
    description: 'Pérdida de grasa mediante un déficit calórico controlado. La alta proteína minimiza la pérdida muscular. Un enfoque sostenible y saludable para reducir peso.',
    macroSplit: { protein: '40%', carbs: '30%', fat: '30%' },
    keyPoints: [
      'Tomar 2,0–2,5 g/kg de proteína: evita la pérdida muscular',
      'Mantener el déficit en 400–600 kcal/día',
      'Los alimentos ricos en fibra sacian (verduras, legumbres, integrales)',
      'Eliminar por completo las bebidas azucaradas',
      'Apuntar a 0,5–0,7 kg de pérdida por semana',
      'Si hay hambre, recurrir a proteína o verduras',
    ],
    sampleDay: [
      { time: '08:00', label: 'Desayuno', foods: ['Tortilla de 3 claras + 1 huevo entero', 'Tomate + pimiento + verduras de hoja', '1 rebanada de pan integral'], macros: { cal: 280, p: 26, c: 18, f: 12 } },
      { time: '10:30', label: 'Tentempié', foods: ['Yogur griego desnatado 150 g', '1 manzana'], macros: { cal: 140, p: 16, c: 18, f: 1 } },
      { time: '13:00', label: 'Almuerzo', foods: ['Pechuga de pollo a la plancha 200 g', 'Ensalada verde grande', 'Bulgur 100 g (cocido)', '1 cdta. de aceite de oliva'], macros: { cal: 450, p: 50, c: 32, f: 12 } },
      { time: '16:00', label: 'Tentempié', foods: ['15 g de almendras', '1 zanahoria cruda'], macros: { cal: 130, p: 4, c: 10, f: 9 } },
      { time: '19:00', label: 'Cena', foods: ['Lubina al horno 200 g', 'Brócoli + coliflor al vapor 200 g', '1 cdta. de aceite de oliva'], macros: { cal: 350, p: 46, c: 10, f: 12 } },
      { time: '21:00', label: 'Noche (opcional)', foods: ['Requesón 100 g', 'Pepino'], macros: { cal: 95, p: 13, c: 5, f: 2 } },
    ],
  },
  {
    id: 'low-carb',
    name: 'Dieta baja en carbohidratos',
    goal: 'lose',
    duration: '6–10 semanas',
    dailyCalories: '1500–1800 kcal',
    description: 'Restringir los carbohidratos lleva al cuerpo a quemar grasa. Mantener la insulina baja reduce el almacenamiento de grasa.',
    macroSplit: { protein: '40%', carbs: '15%', fat: '45%' },
    keyPoints: [
      'Limitar los carbohidratos diarios a 50–80 g',
      'Eliminar pan, arroz, pasta y azúcar',
      'Centrarse en proteína y grasas saludables',
      'Comer verduras libremente (sin almidón)',
      'Esperar pérdida de agua en la semana 1: la pérdida real de grasa empieza en la semana 2',
      'Vigilar el equilibrio de electrolitos (sodio, potasio, magnesio)',
    ],
    sampleDay: [
      { time: '08:00', label: 'Desayuno', foods: ['3 huevos (en mantequilla)', 'Medio aguacate', '40 g de queso', 'Tomate + pepino'], macros: { cal: 520, p: 28, c: 10, f: 42 } },
      { time: '11:00', label: 'Tentempié', foods: ['30 g de nueces', '1 loncha de queso kashkaval'], macros: { cal: 280, p: 12, c: 4, f: 25 } },
      { time: '13:30', label: 'Almuerzo', foods: ['Salmón 200 g (a la plancha)', 'Espinacas salteadas (con aceite de oliva)', 'Yogur 100 g'], macros: { cal: 520, p: 42, c: 8, f: 36 } },
      { time: '16:30', label: 'Tentempié', foods: ['Yogur griego 150 g', '10 g de avellanas'], macros: { cal: 160, p: 16, c: 6, f: 8 } },
      { time: '19:30', label: 'Cena', foods: ['Chuleta de cordero 150 g (a la plancha)', 'Ensalada verde mixta', 'Aliño de aceite de oliva + limón'], macros: { cal: 480, p: 38, c: 5, f: 34 } },
    ],
  },
  {
    id: 'intermittent-gain',
    name: 'Ayuno intermitente + Volumen',
    goal: 'gain',
    duration: '8–12 semanas',
    dailyCalories: '2600–3000 kcal',
    description: 'Ayuno intermitente 16:8 con objetivo de ganar músculo. Ventana de alimentación de 12:00 a 20:00. Impulso de la hormona del crecimiento + superávit controlado para una ganancia muscular limpia.',
    macroSplit: { protein: '30%', carbs: '45%', fat: '25%' },
    keyPoints: [
      '16 horas de ayuno, ventana de alimentación de 8 horas (12:00–20:00)',
      'Hacer la primera comida abundante: 35–40 % de las calorías diarias',
      'Entrenar dentro de la ventana de alimentación',
      'Durante el ayuno: agua, té negro/café permitidos',
      'Al menos 40 g de proteína por comida',
      'Dejar de comer a las 20:00',
    ],
    sampleDay: [
      { time: '12:00', label: 'Primera comida (abundante)', foods: ['Tortilla de 4 huevos + queso', 'Avena 80 g + plátano + miel', '2 rebanadas de pan integral', '1 vaso de leche'], macros: { cal: 950, p: 52, c: 100, f: 35 } },
      { time: '15:00', label: 'Tentempié', foods: ['Wrap de pollo (pan plano + pollo + verduras)', '1 vaso de kéfir'], macros: { cal: 520, p: 40, c: 45, f: 18 } },
      { time: '17:00', label: 'Antes del entrenamiento', foods: ['1 plátano', '30 g de pasas', '20 g de almendras'], macros: { cal: 280, p: 6, c: 48, f: 10 } },
      { time: '19:30', label: 'Después del entrenamiento', foods: ['Salmón 200 g (al horno)', 'Arroz blanco 250 g', 'Brócoli 150 g', '1 cda. de aceite de oliva'], macros: { cal: 850, p: 50, c: 85, f: 30 } },
    ],
  },
  {
    id: 'high-protein-cut',
    name: 'Definición hiperproteica',
    goal: 'lose',
    duration: '6–8 semanas',
    dailyCalories: '1700–2000 kcal',
    description: 'Enfoque alto en proteína + calorías controladas para una pérdida de grasa gradual. Favorece la retención muscular manteniéndolo sostenible. Ideal combinado con entrenamiento de fuerza.',
    macroSplit: { protein: '45%', carbs: '25%', fat: '30%' },
    keyPoints: [
      '2,5–3,0 g/kg de proteína: prioridad a la conservación muscular',
      'Al menos 35 g de proteína por comida',
      'Concentrar los carbohidratos en torno al entrenamiento (antes/después)',
      'Preferir omega-3 y aceite de oliva como fuentes de grasa',
      'Apuntar a 0,7–1,0 kg de pérdida por semana',
      'Día de recarga: aumentar los carbohidratos una vez por semana (para llenar el músculo)',
    ],
    sampleDay: [
      { time: '07:30', label: 'Desayuno', foods: ['Tortilla de 5 claras + 2 huevos enteros', 'Espinacas + tomate', 'Requesón 50 g'], macros: { cal: 340, p: 42, c: 6, f: 16 } },
      { time: '10:00', label: 'Tentempié', foods: ['Pechuga de pollo 100 g (fría, en lonchas)', '1 pepino'], macros: { cal: 180, p: 32, c: 4, f: 4 } },
      { time: '13:00', label: 'Almuerzo', foods: ['Pechuga de pavo a la plancha 200 g', 'Ensalada mixta (mucha verdura)', 'Bulgur 80 g (cocido)', '1 cdta. de aceite de oliva'], macros: { cal: 420, p: 52, c: 25, f: 12 } },
      { time: '16:00', label: 'Antes del entrenamiento', foods: ['Yogur griego desnatado 200 g', '1 manzana'], macros: { cal: 170, p: 20, c: 22, f: 1 } },
      { time: '19:00', label: 'Cena', foods: ['Atún 200 g (al natural)', 'Verduras al vapor 200 g', '1/3 de aguacate'], macros: { cal: 340, p: 48, c: 10, f: 12 } },
      { time: '21:00', label: 'Noche', foods: ['Requesón 100 g', '5 g de avellanas'], macros: { cal: 120, p: 13, c: 4, f: 5 } },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════
// Diet Data — Italian
// ═══════════════════════════════════════════════════════════════════════════

const DIETS_IT: Diet[] = [
  {
    id: 'clean-bulk',
    name: 'Massa pulita',
    goal: 'gain',
    duration: '8–12 settimane',
    dailyCalories: '2800–3200 kcal',
    description: 'Un\'alimentazione incentrata sulla costruzione muscolare con cibi di qualità. Punta all\'aumento di massa magra con un surplus calorico controllato, riducendo al minimo il grasso in eccesso.',
    macroSplit: { protein: '30%', carbs: '45%', fat: '25%' },
    keyPoints: [
      'Assumere 1,8–2,2 g/kg di proteine al giorno',
      'Includere una fonte proteica in ogni pasto',
      'Concentrare i carboidrati attorno all\'allenamento (prima e dopo)',
      'Non trascurare i grassi sani (olio d\'oliva, avocado, frutta secca)',
      'Puntare a 0,3–0,5 kg di aumento a settimana',
      'Bere molta acqua: almeno 3 litri al giorno',
    ],
    sampleDay: [
      { time: '07:00', label: 'Colazione', foods: ['4 uova (2 intere + 2 albumi)', 'Fiocchi d\'avena 80 g + banana + miele', '1 bicchiere di latte', '30 g di mandorle'], macros: { cal: 750, p: 42, c: 78, f: 28 } },
      { time: '10:00', label: 'Spuntino', foods: ['Yogurt greco 200 g', '1 banana', '20 g di noci', '1 cucchiaio di miele'], macros: { cal: 380, p: 22, c: 48, f: 14 } },
      { time: '13:00', label: 'Pranzo', foods: ['Petto di pollo alla griglia 200 g', 'Pilaf di bulgur 250 g', 'Insalata verde + olio d\'oliva', '1 fetta di pane'], macros: { cal: 720, p: 55, c: 80, f: 18 } },
      { time: '16:00', label: 'Pre-allenamento', foods: ['Toast integrale + formaggio', '1 banana', 'Una manciata di uvetta'], macros: { cal: 420, p: 16, c: 65, f: 12 } },
      { time: '19:00', label: 'Post-allenamento / Cena', foods: ['Salmone 200 g (al forno)', 'Riso bianco 200 g', 'Broccoli al vapore 150 g', '1 cucchiaio di olio d\'oliva'], macros: { cal: 750, p: 48, c: 70, f: 28 } },
      { time: '22:00', label: 'Spuntino serale', foods: ['Fiocchi di latte 150 g', '30 g di nocciole', '1 cucchiaio di tahin'], macros: { cal: 350, p: 24, c: 12, f: 22 } },
    ],
  },
  {
    id: 'lean-bulk',
    name: 'Massa magra',
    goal: 'gain',
    duration: '12–16 settimane',
    dailyCalories: '2500–2800 kcal',
    description: 'Aumento muscolare con il minimo accumulo di grasso. Un surplus calorico più contenuto con molte proteine. Richiede pazienza, ma offre un risultato più asciutto.',
    macroSplit: { protein: '35%', carbs: '40%', fat: '25%' },
    keyPoints: [
      'Assumere 2,0–2,4 g/kg di proteine al giorno',
      'Mantenere il surplus calorico a +200–300 kcal',
      'Concentrare i carboidrati nei giorni di allenamento',
      'Aumentare i grassi e ridurre i carboidrati nei giorni di riposo',
      'Puntare a 0,2–0,3 kg di aumento a settimana',
      'Evitare i cibi processati',
    ],
    sampleDay: [
      { time: '07:00', label: 'Colazione', foods: ['Omelette di 3 uova (con verdure)', '2 fette di pane integrale', 'Mezzo avocado', '1 bicchiere di ayran (bevanda allo yogurt)'], macros: { cal: 580, p: 32, c: 42, f: 30 } },
      { time: '10:00', label: 'Spuntino', foods: ['Yogurt greco 200 g (0 %)', 'Una manciata di mirtilli', '20 g di mandorle'], macros: { cal: 280, p: 24, c: 22, f: 12 } },
      { time: '13:00', label: 'Pranzo', foods: ['Petto di pollo alla griglia 200 g', 'Quinoa 150 g', 'Insalata mediterranea', '1 cucchiaio di olio d\'oliva'], macros: { cal: 620, p: 52, c: 52, f: 20 } },
      { time: '16:00', label: 'Pre-allenamento', foods: ['Galletta di riso + 1 cucchiaio di burro d\'arachidi', '1 banana'], macros: { cal: 320, p: 10, c: 50, f: 10 } },
      { time: '19:00', label: 'Cena', foods: ['Controfiletto di manzo 180 g (alla griglia)', 'Patata dolce 200 g (al forno)', 'Zucchine e carote al vapore'], macros: { cal: 580, p: 45, c: 55, f: 16 } },
      { time: '21:30', label: 'Sera', foods: ['Fiocchi di latte 100 g', '10 g di noci'], macros: { cal: 160, p: 14, c: 5, f: 10 } },
    ],
  },
  {
    id: 'calorie-deficit',
    name: 'Dieta a deficit calorico',
    goal: 'lose',
    duration: '8–12 settimane',
    dailyCalories: '1600–1900 kcal',
    description: 'Perdita di grasso tramite un deficit calorico controllato. Le proteine elevate riducono al minimo la perdita muscolare. Un approccio sostenibile e sano per ridurre il peso.',
    macroSplit: { protein: '40%', carbs: '30%', fat: '30%' },
    keyPoints: [
      'Assumere 2,0–2,5 g/kg di proteine: previene la perdita muscolare',
      'Mantenere il deficit a 400–600 kcal/giorno',
      'I cibi ricchi di fibre saziano (verdure, legumi, cereali integrali)',
      'Eliminare del tutto le bevande zuccherate',
      'Puntare a 0,5–0,7 kg di perdita a settimana',
      'Se hai fame, scegli proteine o verdure',
    ],
    sampleDay: [
      { time: '08:00', label: 'Colazione', foods: ['Omelette di 3 albumi + 1 uovo intero', 'Pomodoro + peperone + verdure a foglia', '1 fetta di pane integrale'], macros: { cal: 280, p: 26, c: 18, f: 12 } },
      { time: '10:30', label: 'Spuntino', foods: ['Yogurt greco magro 150 g', '1 mela'], macros: { cal: 140, p: 16, c: 18, f: 1 } },
      { time: '13:00', label: 'Pranzo', foods: ['Petto di pollo alla griglia 200 g', 'Insalata verde abbondante', 'Bulgur 100 g (cotto)', '1 cucchiaino di olio d\'oliva'], macros: { cal: 450, p: 50, c: 32, f: 12 } },
      { time: '16:00', label: 'Spuntino', foods: ['15 g di mandorle', '1 carota cruda'], macros: { cal: 130, p: 4, c: 10, f: 9 } },
      { time: '19:00', label: 'Cena', foods: ['Branzino al forno 200 g', 'Broccoli + cavolfiore al vapore 200 g', '1 cucchiaino di olio d\'oliva'], macros: { cal: 350, p: 46, c: 10, f: 12 } },
      { time: '21:00', label: 'Sera (facoltativo)', foods: ['Fiocchi di latte 100 g', 'Cetriolo'], macros: { cal: 95, p: 13, c: 5, f: 2 } },
    ],
  },
  {
    id: 'low-carb',
    name: 'Dieta a basso contenuto di carboidrati',
    goal: 'lose',
    duration: '6–10 settimane',
    dailyCalories: '1500–1800 kcal',
    description: 'Limitare i carboidrati spinge il corpo verso la combustione dei grassi. Mantenere bassa l\'insulina riduce l\'accumulo di grasso.',
    macroSplit: { protein: '40%', carbs: '15%', fat: '45%' },
    keyPoints: [
      'Limitare i carboidrati giornalieri a 50–80 g',
      'Eliminare pane, riso, pasta e zucchero',
      'Concentrarsi su proteine e grassi sani',
      'Mangiare verdure liberamente (non amidacee)',
      'Aspettarsi perdita di liquidi nella settimana 1: la vera perdita di grasso inizia nella settimana 2',
      'Tenere d\'occhio l\'equilibrio elettrolitico (sodio, potassio, magnesio)',
    ],
    sampleDay: [
      { time: '08:00', label: 'Colazione', foods: ['3 uova (nel burro)', 'Mezzo avocado', '40 g di formaggio', 'Pomodoro + cetriolo'], macros: { cal: 520, p: 28, c: 10, f: 42 } },
      { time: '11:00', label: 'Spuntino', foods: ['30 g di noci', '1 fetta di formaggio kashkaval'], macros: { cal: 280, p: 12, c: 4, f: 25 } },
      { time: '13:30', label: 'Pranzo', foods: ['Salmone 200 g (alla griglia)', 'Spinaci saltati (con olio d\'oliva)', 'Yogurt 100 g'], macros: { cal: 520, p: 42, c: 8, f: 36 } },
      { time: '16:30', label: 'Spuntino', foods: ['Yogurt greco 150 g', '10 g di nocciole'], macros: { cal: 160, p: 16, c: 6, f: 8 } },
      { time: '19:30', label: 'Cena', foods: ['Costoletta d\'agnello 150 g (alla griglia)', 'Insalata verde mista', 'Condimento olio d\'oliva + limone'], macros: { cal: 480, p: 38, c: 5, f: 34 } },
    ],
  },
  {
    id: 'intermittent-gain',
    name: 'Digiuno intermittente + Massa',
    goal: 'gain',
    duration: '8–12 settimane',
    dailyCalories: '2600–3000 kcal',
    description: 'Digiuno intermittente 16:8 con obiettivo di costruzione muscolare. Finestra alimentare 12:00–20:00. Stimolo dell\'ormone della crescita + surplus controllato per una crescita muscolare pulita.',
    macroSplit: { protein: '30%', carbs: '45%', fat: '25%' },
    keyPoints: [
      '16 ore di digiuno, finestra alimentare di 8 ore (12:00–20:00)',
      'Rendere il primo pasto abbondante: 35–40 % delle calorie giornaliere',
      'Allenarsi all\'interno della finestra alimentare',
      'Durante il digiuno: acqua, tè nero/caffè consentiti',
      'Almeno 40 g di proteine per pasto',
      'Smettere di mangiare entro le 20:00',
    ],
    sampleDay: [
      { time: '12:00', label: 'Primo pasto (abbondante)', foods: ['Omelette di 4 uova + formaggio', 'Fiocchi d\'avena 80 g + banana + miele', '2 fette di pane integrale', '1 bicchiere di latte'], macros: { cal: 950, p: 52, c: 100, f: 35 } },
      { time: '15:00', label: 'Spuntino', foods: ['Wrap di pollo (piadina + pollo + verdure)', '1 bicchiere di kefir'], macros: { cal: 520, p: 40, c: 45, f: 18 } },
      { time: '17:00', label: 'Pre-allenamento', foods: ['1 banana', '30 g di uvetta', '20 g di mandorle'], macros: { cal: 280, p: 6, c: 48, f: 10 } },
      { time: '19:30', label: 'Post-allenamento', foods: ['Salmone 200 g (al forno)', 'Riso bianco 250 g', 'Broccoli 150 g', '1 cucchiaio di olio d\'oliva'], macros: { cal: 850, p: 50, c: 85, f: 30 } },
    ],
  },
  {
    id: 'high-protein-cut',
    name: 'Definizione iperproteica',
    goal: 'lose',
    duration: '6–8 settimane',
    dailyCalories: '1700–2000 kcal',
    description: 'Approccio ricco di proteine + calorie controllate per una perdita di grasso graduale. Favorisce il mantenimento muscolare restando sostenibile. Ideale abbinato all\'allenamento con i pesi.',
    macroSplit: { protein: '45%', carbs: '25%', fat: '30%' },
    keyPoints: [
      '2,5–3,0 g/kg di proteine: priorità al mantenimento muscolare',
      'Almeno 35 g di proteine per pasto',
      'Concentrare i carboidrati attorno all\'allenamento (prima/dopo)',
      'Preferire omega-3 e olio d\'oliva come fonti di grassi',
      'Puntare a 0,7–1,0 kg di perdita a settimana',
      'Giorno di ricarica: aumentare i carboidrati una volta a settimana (per la pienezza muscolare)',
    ],
    sampleDay: [
      { time: '07:30', label: 'Colazione', foods: ['Omelette di 5 albumi + 2 uova intere', 'Spinaci + pomodoro', 'Fiocchi di latte 50 g'], macros: { cal: 340, p: 42, c: 6, f: 16 } },
      { time: '10:00', label: 'Spuntino', foods: ['Petto di pollo 100 g (freddo, a fette)', '1 cetriolo'], macros: { cal: 180, p: 32, c: 4, f: 4 } },
      { time: '13:00', label: 'Pranzo', foods: ['Petto di tacchino alla griglia 200 g', 'Insalata mista (molte verdure)', 'Bulgur 80 g (cotto)', '1 cucchiaino di olio d\'oliva'], macros: { cal: 420, p: 52, c: 25, f: 12 } },
      { time: '16:00', label: 'Pre-allenamento', foods: ['Yogurt greco magro 200 g', '1 mela'], macros: { cal: 170, p: 20, c: 22, f: 1 } },
      { time: '19:00', label: 'Cena', foods: ['Tonno 200 g (al naturale)', 'Verdure al vapore 200 g', '1/3 di avocado'], macros: { cal: 340, p: 48, c: 10, f: 12 } },
      { time: '21:00', label: 'Sera', foods: ['Fiocchi di latte 100 g', '5 g di nocciole'], macros: { cal: 120, p: 13, c: 4, f: 5 } },
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
    <div className="relative min-h-[300px]">
      {/* Blurred content underneath */}
      <div className="pointer-events-none select-none" style={{ filter: 'blur(4px)', opacity: 0.35 }}>
        {children}
      </div>

      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="absolute inset-0 flex flex-col items-center justify-center px-6 py-4"
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
              flex-1 min-w-0 flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl text-[11px] font-medium tracking-tight
              transition-all duration-200 active:scale-[0.98]
              ${isActive ? 'bg-white text-black shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}
            `}
          >
            <Icon size={16} className="shrink-0" />
            <span className="truncate max-w-full px-1">{tab.label}</span>
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
                    <div className="mt-2 bg-zinc-800/60 rounded-xl px-3 py-2.5 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider truncate flex-shrink-0">{f.yourTarget}</span>
                      <div className="flex gap-2">
                        <span className="text-[10px] font-bold text-zinc-200 tabular-nums">{totals.cal}kcal</span>
                        <span className="text-[10px] text-zinc-400 tabular-nums">P{totals.p}g</span>
                        <span className="text-[10px] text-zinc-400 tabular-nums">C{totals.c}g</span>
                        <span className="text-[10px] text-zinc-400 tabular-nums">F{totals.f}g</span>
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
  const levelLabel = locale === 'tr'
    ? (program.level === 'Beginner' ? 'Başlangıç' : program.level === 'Intermediate' ? 'Orta' : program.level === 'Advanced' ? 'İleri' : program.level)
    : locale === 'de'
    ? (isBeginnerLevel ? 'Anfänger' : isIntermediateLevel ? 'Fortgeschritten' : 'Profi')
    : locale === 'fr'
    ? (isBeginnerLevel ? 'Débutant' : isIntermediateLevel ? 'Intermédiaire' : 'Avancé')
    : locale === 'es'
    ? (isBeginnerLevel ? 'Principiante' : isIntermediateLevel ? 'Intermedio' : 'Avanzado')
    : locale === 'it'
    ? (isBeginnerLevel ? 'Principiante' : isIntermediateLevel ? 'Intermedio' : 'Avanzato')
    : (isBeginnerLevel ? 'Beginner' : isIntermediateLevel ? 'Intermediate' : 'Advanced')

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

function goalToProgramGoal(goal: FitnessGoal): ProgramGoal {
  return goal === 'gain_weight' ? 'gain' : goal === 'lose_weight' ? 'lose' : 'maintain'
}


// ═══════════════════════════════════════════════════════════════════════════
// Main Page
// ═══════════════════════════════════════════════════════════════════════════

export default function FitnessPage() {
  const [mode, setMode] = useState<FitnessTab>('programs')
  const { strings, locale } = useLocale()
  const { user } = useAuth()
  const { isPro, planTier } = useSubscription(user?.uid)
  const navigate = useNavigate()

  // Locale-bazlı veri setleri — locale değişmeden hiçbiri yeniden hesaplanmaz.
  // useMemo olmadan bu seçim/filter/sort zinciri her render'da (subscription
  // güncellemesi, tab geçişi, vb.) yeniden çalışırdı.
  const activeDiets = useMemo(
    () =>
      locale === 'tr' ? DIETS
      : locale === 'de' ? DIETS_DE
      : locale === 'fr' ? DIETS_FR
      : locale === 'es' ? DIETS_ES
      : locale === 'it' ? DIETS_IT
      : DIETS_EN,
    [locale],
  )
  const gainDiets = useMemo(() => activeDiets.filter((d) => d.goal === 'gain'), [activeDiets])
  const loseDiets = useMemo(() => activeDiets.filter((d) => d.goal === 'lose'), [activeDiets])

  const activeExercises = useMemo(
    () =>
      locale === 'tr' ? EXERCISES
      : locale === 'de' ? EXERCISES_DE
      : locale === 'fr' ? EXERCISES_FR
      : locale === 'es' ? EXERCISES_ES
      : locale === 'it' ? EXERCISES_IT
      : EXERCISES_EN,
    [locale],
  )
  const activeExerciseCategories = useMemo(
    () =>
      locale === 'tr' ? EXERCISE_CATEGORIES_TR
      : locale === 'de' ? EXERCISE_CATEGORIES_DE
      : locale === 'fr' ? EXERCISE_CATEGORIES_FR
      : locale === 'es' ? EXERCISE_CATEGORIES_ES
      : locale === 'it' ? EXERCISE_CATEGORIES_IT
      : EXERCISE_CATEGORIES_EN,
    [locale],
  )

  const activePrograms = useMemo(() => getWorkoutPrograms(locale), [locale])

  const recommendedProgramId = useMemo(
    () =>
      user?.bodyMetrics
        ? getProgramForGoal(goalToProgramGoal(user.bodyMetrics.goal), locale).id
        : null,
    [user?.bodyMetrics, locale],
  )
  const orderedPrograms = useMemo(
    () =>
      recommendedProgramId
        ? [...activePrograms].sort((a, b) =>
            a.id === recommendedProgramId ? -1 : b.id === recommendedProgramId ? 1 : 0
          )
        : activePrograms,
    [activePrograms, recommendedProgramId],
  )

  // JSX içindeki inline filter'dan kaçınmak için egzersizleri kategori bazlı
  // önceden grupluyoruz. activeExercises yalnızca locale değişince güncellenir.
  const exercisesByCategory = useMemo(
    () => {
      const map: Record<string, typeof activeExercises> = {}
      for (const ex of activeExercises) {
        ;(map[ex.category] ??= []).push(ex)
      }
      return map
    },
    [activeExercises],
  )

  const aiProgramKey = user?.uid ? `makrofy_ai_program_${user.uid}` : null
  const [aiProgram, setAiProgram] = useState<AIProgram | null>(() => {
    try {
      const raw = aiProgramKey ? localStorage.getItem(aiProgramKey) : null
      return raw ? (JSON.parse(raw) as AIProgram) : null
    } catch {
      return null
    }
  })

  const handleAIProgramReady = (program: AIProgram) => {
    setAiProgram(program)
    if (aiProgramKey) localStorage.setItem(aiProgramKey, JSON.stringify(program))
  }

  // Self-heal: sunucudaki aktif programı çekip yerel önbelleği eşitle.
  // - Sunucuda program varsa: yereli güncelle (uygulamayı silip kuran kullanıcı
  //   programını geri kazanır).
  // - Sunucu "aktif program yok" derse: bayat yerel önbelleği temizle (admin
  //   sıfırlaması telefonlara yansır, kullanıcı yeni program oluşturabilir).
  // - Ağ/oturum hatasında: dokunma (önbelleği koru).
  useEffect(() => {
    if (!user?.uid || !aiProgramKey) return
    let cancelled = false
    fetchActiveProgram()
      .then((server) => {
        if (cancelled) return
        if (server) {
          setAiProgram(server)
          localStorage.setItem(aiProgramKey, JSON.stringify(server))
        } else {
          setAiProgram(null)
          localStorage.removeItem(aiProgramKey)
        }
      })
      .catch((err) => {
        console.warn('[FitnessPage] active program sync skipped:', err)
      })
    return () => {
      cancelled = true
    }
  }, [user?.uid, aiProgramKey])

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
                  <div className="space-y-5">
                    <AIProgramBuilder
                      user={user}
                      locale={locale}
                      initialProgram={aiProgram}
                      canUsePhoto={planTier === 'pro'}
                      onProgramReady={handleAIProgramReady}
                    />

                    {/* Hazır programlar — ilham olarak */}
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
                            <ProgramCard program={program} recommended={program.id === recommendedProgramId} />
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <p className="text-center text-[10px] text-zinc-600 leading-relaxed whitespace-pre-line">
                      {strings.fitness.disclaimer}
                    </p>
                  </div>
              ) : (
                <>
                  <AIProgramLockedPreview onUpgrade={handleUpgrade} />
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
              {/* Egzersizler herkese açık — Pro/Plus kilidi yok (YouTube tutoriallarına herkes bakabilir) */}
              <div className="space-y-6">
                  {activeExerciseCategories.map((category) => {
                    const exercises = exercisesByCategory[category] ?? []
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
                  <div className="space-y-6">
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
