// ─── Profesyonel Antrenman Programları ──────────────────────────────────────
// Bir kuvvet & kondisyon antrenörü mantığıyla hazırlanmış, hedefe göre
// yapılandırılmış haftalık programlar. Pro üyeler için detaylı egzersiz reçetesi
// (set × tekrar, dinlenme, tempo) ve ilerleme (progressive overload) notları içerir.
// Not: Bilgilendirme amaçlıdır; sağlık sorunu olanlar hekim/uzmana danışmalıdır.

export type ProgramGoal = 'lose' | 'gain' | 'maintain'
export type ProgramLevel = 'Başlangıç' | 'Orta' | 'İleri' | 'Beginner' | 'Intermediate' | 'Advanced'

export interface ProgramExercise {
  name: string
  sets: string
  reps: string
  rest: string
  /** Kaldırma temposu (eksantrik-bekleme-konsantrik), örn. "3-1-1" */
  tempo?: string
  /** Antrenörün kısa tekniği/uyarısı */
  note?: string
}

export interface ProgramDay {
  title: string
  focus: string
  exercises: ProgramExercise[]
}

export interface WorkoutProgram {
  id: string
  name: string
  goal: ProgramGoal
  level: ProgramLevel
  daysPerWeek: number
  duration: string
  split: string
  description: string
  /** Haftalık takvim, örn. "Pzt · İtiş" */
  weeklySchedule: string[]
  warmup: string
  days: ProgramDay[]
  /** Progressive overload / ilerleme stratejisi */
  progression: string[]
  /** Antrenörden kritik notlar */
  coachTips: string[]
}

export const WORKOUT_PROGRAMS: WorkoutProgram[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // YAĞ YAKIM — Kilo verme hedefi
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'fat-loss-cut',
    name: 'Yağ Yakım & Sıkılaşma',
    goal: 'lose',
    level: 'Orta',
    daysPerWeek: 4,
    duration: '8 hafta',
    split: 'Üst / Alt + Metabolik',
    description:
      'Kalori açığında kas kütlesini korurken yağ yakmaya odaklanan program. Ağır bileşik hareketlerle kası uyarıp, metabolik kondisyon günleriyle kalori harcamasını yükseltiriz. Hedef: haftada 0.5-0.7 kg yağ kaybı, gücü koruyarak.',
    weeklySchedule: ['Pzt · Üst Vücut', 'Sal · Alt Vücut', 'Per · HIIT + Core', 'Cmt · Tüm Vücut Devre', 'Diğer günler · 8-10 bin adım'],
    warmup: '5 dk hafif kardiyo + dinamik esneme (kol çevirme, kalça açma, bodyweight squat ×10). Çalışacağın bölgeye 1 hafif ısınma seti ekle.',
    days: [
      {
        title: 'Gün 1 · Üst Vücut',
        focus: 'Göğüs · Sırt · Omuz · Kol',
        exercises: [
          { name: 'Şınav veya Bench Press', sets: '4', reps: '8-10', rest: '90 sn', tempo: '3-0-1', note: 'Son set zorlanana kadar (RPE 8).' },
          { name: 'Tek Kol Dumbbell Row', sets: '4', reps: '10-12', rest: '75 sn', note: 'Sırtı sıkıştır, omuzla değil sırtla çek.' },
          { name: 'Omuz Press (Dumbbell)', sets: '3', reps: '10-12', rest: '75 sn' },
          { name: 'Lat Pulldown / Ters Row', sets: '3', reps: '12', rest: '60 sn' },
          { name: 'Plank', sets: '3', reps: '40 sn', rest: '45 sn', note: 'Kalça düşmesin, karın sıkı.' },
        ],
      },
      {
        title: 'Gün 2 · Alt Vücut',
        focus: 'Bacak · Kalça · Core',
        exercises: [
          { name: 'Goblet / Barbell Squat', sets: '4', reps: '8-10', rest: '120 sn', tempo: '3-1-1', note: 'Dizler parmak ucu hizasında, derinliği koru.' },
          { name: 'Romanian Deadlift', sets: '4', reps: '10', rest: '90 sn', note: 'Hamstringde gerilim hisset, bel nötr.' },
          { name: 'Bulgar Split Squat', sets: '3', reps: '10 (her bacak)', rest: '75 sn' },
          { name: 'Hip Thrust', sets: '3', reps: '12-15', rest: '75 sn', note: 'Tepe noktada kalçayı 1 sn sık.' },
          { name: 'Calf Raise', sets: '3', reps: '15-20', rest: '45 sn' },
        ],
      },
      {
        title: 'Gün 3 · HIIT + Core',
        focus: 'Kardiyovasküler · Karın',
        exercises: [
          { name: 'Interval Koşu/Bisiklet', sets: '8', reps: '30 sn hızlı / 60 sn yavaş', rest: '—', note: 'Hızlı bölümde nefesin kesilmeli.' },
          { name: 'Burpee', sets: '3', reps: '10', rest: '60 sn' },
          { name: 'Mountain Climber', sets: '3', reps: '40 sn', rest: '45 sn' },
          { name: 'Bisiklet Crunch', sets: '3', reps: '20', rest: '45 sn' },
        ],
      },
      {
        title: 'Gün 4 · Tüm Vücut Devre',
        focus: 'Metabolik · Tüm Vücut',
        exercises: [
          { name: 'Devre: 5 hareket ×3 tur', sets: '3 tur', reps: '40 sn iş / 20 sn dinlen', rest: '90 sn (turlar arası)', note: 'Squat → Şınav → Row → Lunge → Plank sırayla.' },
          { name: 'Bitirici: Jumping Jack', sets: '2', reps: '45 sn', rest: '30 sn' },
        ],
      },
    ],
    progression: [
      '1-2. hafta: formu oturt, RPE 7 (2-3 tekrar yedek kalsın).',
      '3-5. hafta: her hafta bir set veya 2 tekrar ekle; ağırlık artırabiliyorsan %2.5 artır.',
      '6-8. hafta: tempoyu koru, dinlenmeyi 10-15 sn kısaltarak yoğunluğu yükselt.',
      'Tekrarların üst sınırını rahat tamamlıyorsan ağırlığı artır, alt sınıra dön.',
    ],
    coachTips: [
      'Kalori açığında protein yüksek kalsın (2.0-2.4 g/kg) — kas kaybını bu engeller.',
      'Haftada en az 1 tam dinlenme günü; uyku 7-8 saat.',
      'Kardiyoyu kuvvetin yerine değil, üstüne ekle. Önce ağırlık, sonra HIIT.',
      'Tartı dalgalanır; haftalık ortalama ve ayna/ölçü daha güvenilir.',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // KAS KAZANIM — Kilo/kas alma hedefi
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'hypertrophy-ppl',
    name: 'Kas Kütlesi · Push/Pull/Legs',
    goal: 'gain',
    level: 'İleri',
    daysPerWeek: 6,
    duration: '10-12 hafta',
    split: 'İtiş / Çekiş / Bacak (×2)',
    description:
      'Hipertrofi (kas büyümesi) için klasik ve kanıtlanmış PPL bölünmesi. Her kas grubu haftada 2 kez, yüksek hacimle çalışılır. Kontrollü kalori fazlasıyla birleştiğinde temiz kas kazanımı için idealdir.',
    weeklySchedule: ['Pzt · İtiş', 'Sal · Çekiş', 'Çar · Bacak', 'Per · İtiş', 'Cum · Çekiş', 'Cmt · Bacak', 'Paz · Dinlenme'],
    warmup: 'İlk bileşik harekette 2 kademeli ısınma seti (boş bar/hafif → %60). Omuz ve kalça mobilitesine 3-4 dk ayır.',
    days: [
      {
        title: 'İtiş (Push)',
        focus: 'Göğüs · Omuz · Triceps',
        exercises: [
          { name: 'Bench Press', sets: '4', reps: '6-8', rest: '120 sn', tempo: '3-1-1', note: 'Ana güç hareketi, ağır ama formu bozma.' },
          { name: 'Incline Dumbbell Press', sets: '3', reps: '8-12', rest: '90 sn' },
          { name: 'Overhead Shoulder Press', sets: '3', reps: '8-10', rest: '90 sn' },
          { name: 'Lateral Raise', sets: '4', reps: '12-15', rest: '60 sn', note: 'Hafif ağırlık, omuzları yormadan dirsekle yönlendir.' },
          { name: 'Triceps Pushdown', sets: '3', reps: '10-12', rest: '60 sn' },
          { name: 'Dips / Diamond Şınav', sets: '3', reps: 'Maks (RPE 9)', rest: '75 sn' },
        ],
      },
      {
        title: 'Çekiş (Pull)',
        focus: 'Sırt · Biceps · Arka Omuz',
        exercises: [
          { name: 'Barbell Row / Pull-up', sets: '4', reps: '6-10', rest: '120 sn', note: 'Sırt genişliği ve kalınlığının temeli.' },
          { name: 'Lat Pulldown', sets: '3', reps: '10-12', rest: '90 sn' },
          { name: 'Seated Cable Row', sets: '3', reps: '10-12', rest: '90 sn' },
          { name: 'Face Pull', sets: '3', reps: '15', rest: '60 sn', note: 'Omuz sağlığı için ihmal etme.' },
          { name: 'Barbell / Dumbbell Curl', sets: '3', reps: '10-12', rest: '60 sn' },
          { name: 'Hammer Curl', sets: '3', reps: '12', rest: '60 sn' },
        ],
      },
      {
        title: 'Bacak (Legs)',
        focus: 'Quadriceps · Hamstring · Kalça · Calf',
        exercises: [
          { name: 'Barbell Squat', sets: '4', reps: '6-8', rest: '150 sn', tempo: '3-1-1', note: 'Programın en zorlu hareketi — toparlanmaya dikkat.' },
          { name: 'Romanian Deadlift', sets: '4', reps: '8-10', rest: '120 sn' },
          { name: 'Leg Press', sets: '3', reps: '10-12', rest: '90 sn' },
          { name: 'Leg Curl', sets: '3', reps: '12', rest: '60 sn' },
          { name: 'Walking Lunge', sets: '3', reps: '12 (her bacak)', rest: '75 sn' },
          { name: 'Standing Calf Raise', sets: '4', reps: '15-20', rest: '45 sn' },
        ],
      },
    ],
    progression: [
      'Çift ilerleme (double progression): tekrar aralığının üstüne ulaşınca ağırlığı %2.5-5 artır, alt sınıra dön.',
      'Her hafta ana hareketlerde 1 tekrar veya küçük ağırlık ekleme hedefle.',
      '4 haftada bir "deload": hacmi %40 düşür, toparlan.',
      'Form bozuluyorsa ağırlığı düşür — ego liftingi sakatlık demektir.',
    ],
    coachTips: [
      'Kas için günde 1.8-2.2 g/kg protein ve +250-400 kcal kontrollü fazla şart.',
      'Antrenman süresi 60-75 dk; daha uzunu toparlanmayı zorlar.',
      'Bileşik hareketleri (squat, bench, row, deadlift) önce yap, izolasyonu sona bırak.',
      'İlerlemeyi not al — kayıt tutmayan ilerleyemez.',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // FORM KORUMA — Kiloyu koruma hedefi
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'maintain-full-body',
    name: 'Atletik Form Koruma',
    goal: 'maintain',
    level: 'Başlangıç',
    daysPerWeek: 3,
    duration: 'Süresiz (sürdürülebilir)',
    split: 'Tüm Vücut ×3',
    description:
      'Mevcut formu ve gücü korumak, genel sağlık ve hareketliliği sürdürmek için zaman-verimli tüm vücut programı. Haftada 3 antrenmanla tüm büyük kas gruplarını dengeli çalıştırır. Yeni başlayanlar ve yoğun program isteyenler için ideal.',
    weeklySchedule: ['Pzt · Antrenman A', 'Çar · Antrenman B', 'Cum · Antrenman C', 'Hafta sonu · Aktif dinlenme (yürüyüş/yüzme)'],
    warmup: '5 dk tempolu yürüyüş + eklem rotasyonları. İlk harekette 1 hafif ısınma seti.',
    days: [
      {
        title: 'Antrenman A',
        focus: 'İtiş ağırlıklı tüm vücut',
        exercises: [
          { name: 'Goblet Squat', sets: '3', reps: '10-12', rest: '75 sn' },
          { name: 'Şınav (diz üstü opsiyonel)', sets: '3', reps: '8-12', rest: '75 sn' },
          { name: 'Dumbbell Shoulder Press', sets: '3', reps: '10-12', rest: '60 sn' },
          { name: 'Dumbbell Row', sets: '3', reps: '10-12', rest: '60 sn' },
          { name: 'Plank', sets: '3', reps: '30-40 sn', rest: '45 sn' },
        ],
      },
      {
        title: 'Antrenman B',
        focus: 'Çekiş & arka zincir',
        exercises: [
          { name: 'Romanian Deadlift', sets: '3', reps: '10-12', rest: '90 sn', note: 'Bel nötr, kalçadan menteşe yap.' },
          { name: 'Lat Pulldown / Ters Row', sets: '3', reps: '10-12', rest: '75 sn' },
          { name: 'Hip Thrust / Glute Bridge', sets: '3', reps: '12-15', rest: '60 sn' },
          { name: 'Lateral Raise', sets: '3', reps: '12-15', rest: '45 sn' },
          { name: 'Dead Bug', sets: '3', reps: '10 (her taraf)', rest: '45 sn' },
        ],
      },
      {
        title: 'Antrenman C',
        focus: 'Bacak & core dengesi',
        exercises: [
          { name: 'Bulgar Split Squat', sets: '3', reps: '10 (her bacak)', rest: '75 sn' },
          { name: 'Incline / Klasik Şınav', sets: '3', reps: '10-12', rest: '60 sn' },
          { name: 'Seated / Cable Row', sets: '3', reps: '10-12', rest: '60 sn' },
          { name: 'Calf Raise', sets: '3', reps: '15-20', rest: '45 sn' },
          { name: 'Side Plank', sets: '3', reps: '25-30 sn (her taraf)', rest: '45 sn' },
        ],
      },
    ],
    progression: [
      'Önce tekniği oturt; ilk 2 hafta rahat ağırlıklarla çalış.',
      'Form sağlamsa her 1-2 haftada bir küçük ağırlık veya 1-2 tekrar ekle.',
      'Tekrar aralığının üstünü zorlanmadan tamamlıyorsan ağırlığı artır.',
      'Sıkıldıysan hareketleri benzerleriyle değiştirip çeşitlilik kat.',
    ],
    coachTips: [
      'Korumada amaç kalori dengesi (TDEE) — protein 1.6-2.0 g/kg yeterli.',
      'Haftada 3 antrenman + 8-10 bin günlük adım sağlığı korur.',
      'Tutarlılık yoğunluktan önemlidir; kaçırdığın günü dert etme, devam et.',
      'Ağrı (sakatlık) ile yanma (kas yorgunluğu) farklıdır — ağrıda dur.',
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════
// English Workout Programs
// ═══════════════════════════════════════════════════════════════════════════

export const WORKOUT_PROGRAMS_EN: WorkoutProgram[] = [
  {
    id: 'fat-loss-cut',
    name: 'Fat Loss & Toning',
    goal: 'lose',
    level: 'Intermediate',
    daysPerWeek: 4,
    duration: '8 weeks',
    split: 'Upper / Lower + Metabolic',
    description:
      'A program focused on burning fat while preserving muscle mass during a calorie deficit. Heavy compound lifts stimulate muscle, and metabolic conditioning days boost calorie expenditure. Goal: 0.5–0.7 kg fat loss per week while maintaining strength.',
    weeklySchedule: ['Mon · Upper Body', 'Tue · Lower Body', 'Thu · HIIT + Core', 'Sat · Full Body Circuit', 'Other days · 8–10k steps'],
    warmup: '5 min light cardio + dynamic stretching (arm circles, hip openers, bodyweight squat ×10). Add 1 light warm-up set for the target area.',
    days: [
      {
        title: 'Day 1 · Upper Body',
        focus: 'Chest · Back · Shoulders · Arms',
        exercises: [
          { name: 'Push-up or Bench Press', sets: '4', reps: '8-10', rest: '90 sec', tempo: '3-0-1', note: 'Last set to near failure (RPE 8).' },
          { name: 'Single-Arm Dumbbell Row', sets: '4', reps: '10-12', rest: '75 sec', note: 'Squeeze the back — pull with your lats, not shoulders.' },
          { name: 'Dumbbell Shoulder Press', sets: '3', reps: '10-12', rest: '75 sec' },
          { name: 'Lat Pulldown / Inverted Row', sets: '3', reps: '12', rest: '60 sec' },
          { name: 'Plank', sets: '3', reps: '40 sec', rest: '45 sec', note: 'Don\'t let hips drop; keep core tight.' },
        ],
      },
      {
        title: 'Day 2 · Lower Body',
        focus: 'Legs · Glutes · Core',
        exercises: [
          { name: 'Goblet / Barbell Squat', sets: '4', reps: '8-10', rest: '120 sec', tempo: '3-1-1', note: 'Knees track over toes, maintain depth.' },
          { name: 'Romanian Deadlift', sets: '4', reps: '10', rest: '90 sec', note: 'Feel the hamstring stretch; keep back neutral.' },
          { name: 'Bulgarian Split Squat', sets: '3', reps: '10 (each leg)', rest: '75 sec' },
          { name: 'Hip Thrust', sets: '3', reps: '12-15', rest: '75 sec', note: 'Squeeze glutes for 1 sec at the top.' },
          { name: 'Calf Raise', sets: '3', reps: '15-20', rest: '45 sec' },
        ],
      },
      {
        title: 'Day 3 · HIIT + Core',
        focus: 'Cardiovascular · Abs',
        exercises: [
          { name: 'Interval Run/Bike', sets: '8', reps: '30 sec fast / 60 sec easy', rest: '—', note: 'Fast intervals should be breathless.' },
          { name: 'Burpee', sets: '3', reps: '10', rest: '60 sec' },
          { name: 'Mountain Climber', sets: '3', reps: '40 sec', rest: '45 sec' },
          { name: 'Bicycle Crunch', sets: '3', reps: '20', rest: '45 sec' },
        ],
      },
      {
        title: 'Day 4 · Full Body Circuit',
        focus: 'Metabolic · Full Body',
        exercises: [
          { name: 'Circuit: 5 moves ×3 rounds', sets: '3 rounds', reps: '40 sec work / 20 sec rest', rest: '90 sec (between rounds)', note: 'Squat → Push-up → Row → Lunge → Plank in order.' },
          { name: 'Finisher: Jumping Jack', sets: '2', reps: '45 sec', rest: '30 sec' },
        ],
      },
    ],
    progression: [
      'Weeks 1–2: nail the form, RPE 7 (keep 2–3 reps in reserve).',
      'Weeks 3–5: add one set or 2 reps per week; increase weight by 2.5% if possible.',
      'Weeks 6–8: maintain tempo, shorten rest by 10–15 sec to raise intensity.',
      'When you comfortably hit the top of the rep range, increase weight and drop to the bottom.',
    ],
    coachTips: [
      'Keep protein high in a deficit (2.0–2.4 g/kg) — this is what prevents muscle loss.',
      'At least 1 full rest day per week; sleep 7–8 hours.',
      'Add cardio on top of strength, not instead of it. Weights first, then HIIT.',
      'Scale fluctuates; weekly average and mirror/measurements are more reliable.',
    ],
  },
  {
    id: 'hypertrophy-ppl',
    name: 'Muscle Mass · Push/Pull/Legs',
    goal: 'gain',
    level: 'Advanced',
    daysPerWeek: 6,
    duration: '10–12 weeks',
    split: 'Push / Pull / Legs (×2)',
    description:
      'The classic, evidence-based PPL split for hypertrophy (muscle growth). Each muscle group is trained twice per week with high volume. Combined with a controlled calorie surplus, this is ideal for clean muscle gain.',
    weeklySchedule: ['Mon · Push', 'Tue · Pull', 'Wed · Legs', 'Thu · Push', 'Fri · Pull', 'Sat · Legs', 'Sun · Rest'],
    warmup: '2 ramped warm-up sets on the first compound lift (empty bar/light → 60%). Spend 3–4 min on shoulder and hip mobility.',
    days: [
      {
        title: 'Push',
        focus: 'Chest · Shoulders · Triceps',
        exercises: [
          { name: 'Bench Press', sets: '4', reps: '6-8', rest: '120 sec', tempo: '3-1-1', note: 'Main strength move — heavy but maintain form.' },
          { name: 'Incline Dumbbell Press', sets: '3', reps: '8-12', rest: '90 sec' },
          { name: 'Overhead Shoulder Press', sets: '3', reps: '8-10', rest: '90 sec' },
          { name: 'Lateral Raise', sets: '4', reps: '12-15', rest: '60 sec', note: 'Light weight, lead with elbows — don\'t shrug.' },
          { name: 'Triceps Pushdown', sets: '3', reps: '10-12', rest: '60 sec' },
          { name: 'Dips / Diamond Push-up', sets: '3', reps: 'Max (RPE 9)', rest: '75 sec' },
        ],
      },
      {
        title: 'Pull',
        focus: 'Back · Biceps · Rear Delts',
        exercises: [
          { name: 'Barbell Row / Pull-up', sets: '4', reps: '6-10', rest: '120 sec', note: 'Foundation for back width and thickness.' },
          { name: 'Lat Pulldown', sets: '3', reps: '10-12', rest: '90 sec' },
          { name: 'Seated Cable Row', sets: '3', reps: '10-12', rest: '90 sec' },
          { name: 'Face Pull', sets: '3', reps: '15', rest: '60 sec', note: 'Don\'t skip this — it\'s key for shoulder health.' },
          { name: 'Barbell / Dumbbell Curl', sets: '3', reps: '10-12', rest: '60 sec' },
          { name: 'Hammer Curl', sets: '3', reps: '12', rest: '60 sec' },
        ],
      },
      {
        title: 'Legs',
        focus: 'Quadriceps · Hamstrings · Glutes · Calves',
        exercises: [
          { name: 'Barbell Squat', sets: '4', reps: '6-8', rest: '150 sec', tempo: '3-1-1', note: 'The hardest lift in the program — prioritise recovery.' },
          { name: 'Romanian Deadlift', sets: '4', reps: '8-10', rest: '120 sec' },
          { name: 'Leg Press', sets: '3', reps: '10-12', rest: '90 sec' },
          { name: 'Leg Curl', sets: '3', reps: '12', rest: '60 sec' },
          { name: 'Walking Lunge', sets: '3', reps: '12 (each leg)', rest: '75 sec' },
          { name: 'Standing Calf Raise', sets: '4', reps: '15-20', rest: '45 sec' },
        ],
      },
    ],
    progression: [
      'Double progression: once you hit the top of the rep range, increase weight by 2.5–5% and drop to the bottom.',
      'Aim to add 1 rep or a small weight increment on main lifts each week.',
      'Every 4 weeks, deload: drop volume by 40% and recover.',
      'If form breaks down, lower the weight — ego lifting leads to injury.',
    ],
    coachTips: [
      'For muscle: 1.8–2.2 g/kg protein daily and a controlled +250–400 kcal surplus.',
      'Session length: 60–75 min; longer sessions strain recovery.',
      'Do compound lifts first (squat, bench, row, deadlift), isolation last.',
      'Log your progress — what you don\'t track, you can\'t manage.',
    ],
  },
  {
    id: 'maintain-full-body',
    name: 'Athletic Maintenance',
    goal: 'maintain',
    level: 'Beginner',
    daysPerWeek: 3,
    duration: 'Ongoing (sustainable)',
    split: 'Full Body ×3',
    description:
      'A time-efficient full-body program to maintain current fitness and strength, and support overall health and mobility. Trains all major muscle groups in a balanced way with just 3 sessions per week. Ideal for beginners and those with busy schedules.',
    weeklySchedule: ['Mon · Workout A', 'Wed · Workout B', 'Fri · Workout C', 'Weekends · Active rest (walk/swim)'],
    warmup: '5 min brisk walk + joint rotations. 1 light warm-up set on the first exercise.',
    days: [
      {
        title: 'Workout A',
        focus: 'Push-dominant full body',
        exercises: [
          { name: 'Goblet Squat', sets: '3', reps: '10-12', rest: '75 sec' },
          { name: 'Push-up (knee option)', sets: '3', reps: '8-12', rest: '75 sec' },
          { name: 'Dumbbell Shoulder Press', sets: '3', reps: '10-12', rest: '60 sec' },
          { name: 'Dumbbell Row', sets: '3', reps: '10-12', rest: '60 sec' },
          { name: 'Plank', sets: '3', reps: '30-40 sec', rest: '45 sec' },
        ],
      },
      {
        title: 'Workout B',
        focus: 'Pull & posterior chain',
        exercises: [
          { name: 'Romanian Deadlift', sets: '3', reps: '10-12', rest: '90 sec', note: 'Keep back neutral, hinge from the hips.' },
          { name: 'Lat Pulldown / Inverted Row', sets: '3', reps: '10-12', rest: '75 sec' },
          { name: 'Hip Thrust / Glute Bridge', sets: '3', reps: '12-15', rest: '60 sec' },
          { name: 'Lateral Raise', sets: '3', reps: '12-15', rest: '45 sec' },
          { name: 'Dead Bug', sets: '3', reps: '10 (each side)', rest: '45 sec' },
        ],
      },
      {
        title: 'Workout C',
        focus: 'Legs & core balance',
        exercises: [
          { name: 'Bulgarian Split Squat', sets: '3', reps: '10 (each leg)', rest: '75 sec' },
          { name: 'Incline / Standard Push-up', sets: '3', reps: '10-12', rest: '60 sec' },
          { name: 'Seated / Cable Row', sets: '3', reps: '10-12', rest: '60 sec' },
          { name: 'Calf Raise', sets: '3', reps: '15-20', rest: '45 sec' },
          { name: 'Side Plank', sets: '3', reps: '25-30 sec (each side)', rest: '45 sec' },
        ],
      },
    ],
    progression: [
      'First, nail the technique; work with comfortable weights for the first 2 weeks.',
      'If form is solid, add a small weight or 1–2 reps every 1–2 weeks.',
      'When you comfortably hit the top of the rep range, increase the weight.',
      'If you get bored, swap exercises for similar variations to add variety.',
    ],
    coachTips: [
      'For maintenance, aim for calorie balance (TDEE) — 1.6–2.0 g/kg protein is sufficient.',
      '3 workouts per week + 8–10k daily steps will maintain your health.',
      'Consistency beats intensity; don\'t stress about missed days, just keep going.',
      'Pain (injury) and burn (muscle fatigue) are different — stop if it\'s pain.',
    ],
  },
]

/** Returns workout programs for the given locale. */
export function getWorkoutPrograms(locale: string): WorkoutProgram[] {
  return locale === 'en' ? WORKOUT_PROGRAMS_EN : WORKOUT_PROGRAMS
}

/** Returns the recommended program for the user's goal. */
export function getProgramForGoal(goal: ProgramGoal, locale = 'tr'): WorkoutProgram {
  const programs = getWorkoutPrograms(locale)
  return programs.find((p) => p.goal === goal) ?? programs[0]
}
