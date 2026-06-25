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

// ═══════════════════════════════════════════════════════════════════════════
// German Workout Programs
// ═══════════════════════════════════════════════════════════════════════════

export const WORKOUT_PROGRAMS_DE: WorkoutProgram[] = [
  {
    id: 'fat-loss-cut',
    name: 'Fettabbau & Definition',
    goal: 'lose',
    level: 'Intermediate',
    daysPerWeek: 4,
    duration: '8 Wochen',
    split: 'Oberkörper / Unterkörper + Metabolisch',
    description:
      'Ein Programm, das im Kaloriendefizit auf Fettverbrennung bei gleichzeitigem Erhalt der Muskelmasse abzielt. Schwere Grundübungen reizen die Muskulatur, und metabolische Konditionstage steigern den Kalorienverbrauch. Ziel: 0,5–0,7 kg Fettverlust pro Woche bei erhaltener Kraft.',
    weeklySchedule: ['Mo · Oberkörper', 'Di · Unterkörper', 'Do · HIIT + Core', 'Sa · Ganzkörper-Zirkel', 'Übrige Tage · 8–10k Schritte'],
    warmup: '5 Min lockeres Cardio + dynamisches Dehnen (Armkreisen, Hüftöffner, Körpergewicht-Kniebeugen ×10). Füge 1 leichten Aufwärmsatz für den Zielbereich hinzu.',
    days: [
      {
        title: 'Tag 1 · Oberkörper',
        focus: 'Brust · Rücken · Schultern · Arme',
        exercises: [
          { name: 'Liegestütz oder Bankdrücken', sets: '4', reps: '8-10', rest: '90 Sek', tempo: '3-0-1', note: 'Letzter Satz bis nahe Muskelversagen (RPE 8).' },
          { name: 'Einarmiges Kurzhantelrudern', sets: '4', reps: '10-12', rest: '75 Sek', note: 'Rücken anspannen — mit dem Lat ziehen, nicht mit den Schultern.' },
          { name: 'Schulterdrücken (Kurzhantel)', sets: '3', reps: '10-12', rest: '75 Sek' },
          { name: 'Latzug / Umgekehrtes Rudern', sets: '3', reps: '12', rest: '60 Sek' },
          { name: 'Plank', sets: '3', reps: '40 Sek', rest: '45 Sek', note: 'Hüfte nicht absinken lassen; Rumpf fest anspannen.' },
        ],
      },
      {
        title: 'Tag 2 · Unterkörper',
        focus: 'Beine · Gesäß · Core',
        exercises: [
          { name: 'Goblet- / Langhantel-Kniebeuge', sets: '4', reps: '8-10', rest: '120 Sek', tempo: '3-1-1', note: 'Knie über den Zehen führen, Tiefe halten.' },
          { name: 'Rumänisches Kreuzheben', sets: '4', reps: '10', rest: '90 Sek', note: 'Dehnung im Beinbizeps spüren; Rücken neutral halten.' },
          { name: 'Bulgarische Split-Kniebeuge', sets: '3', reps: '10 (pro Bein)', rest: '75 Sek' },
          { name: 'Hip Thrust', sets: '3', reps: '12-15', rest: '75 Sek', note: 'Gesäß am höchsten Punkt 1 Sek anspannen.' },
          { name: 'Wadenheben', sets: '3', reps: '15-20', rest: '45 Sek' },
        ],
      },
      {
        title: 'Tag 3 · HIIT + Core',
        focus: 'Herz-Kreislauf · Bauch',
        exercises: [
          { name: 'Intervall Laufen/Radfahren', sets: '8', reps: '30 Sek schnell / 60 Sek locker', rest: '—', note: 'Schnelle Intervalle sollten außer Atem bringen.' },
          { name: 'Burpee', sets: '3', reps: '10', rest: '60 Sek' },
          { name: 'Mountain Climber', sets: '3', reps: '40 Sek', rest: '45 Sek' },
          { name: 'Fahrrad-Crunch', sets: '3', reps: '20', rest: '45 Sek' },
        ],
      },
      {
        title: 'Tag 4 · Ganzkörper-Zirkel',
        focus: 'Metabolisch · Ganzkörper',
        exercises: [
          { name: 'Zirkel: 5 Übungen ×3 Runden', sets: '3 Runden', reps: '40 Sek Arbeit / 20 Sek Pause', rest: '90 Sek (zwischen Runden)', note: 'Kniebeuge → Liegestütz → Rudern → Ausfallschritt → Plank der Reihe nach.' },
          { name: 'Finisher: Hampelmann', sets: '2', reps: '45 Sek', rest: '30 Sek' },
        ],
      },
    ],
    progression: [
      'Woche 1–2: Technik festigen, RPE 7 (2–3 Wiederholungen in Reserve halten).',
      'Woche 3–5: pro Woche einen Satz oder 2 Wiederholungen hinzufügen; Gewicht wenn möglich um 2,5 % steigern.',
      'Woche 6–8: Tempo beibehalten, Pausen um 10–15 Sek verkürzen, um die Intensität zu erhöhen.',
      'Wenn du das obere Ende des Wiederholungsbereichs locker schaffst, erhöhe das Gewicht und beginne wieder am unteren Ende.',
    ],
    coachTips: [
      'Im Defizit den Proteingehalt hoch halten (2,0–2,4 g/kg) — das verhindert Muskelverlust.',
      'Mindestens 1 vollständiger Ruhetag pro Woche; 7–8 Stunden Schlaf.',
      'Cardio zusätzlich zum Krafttraining, nicht statt dessen. Erst Gewichte, dann HIIT.',
      'Die Waage schwankt; Wochendurchschnitt und Spiegel/Maßband sind verlässlicher.',
    ],
  },
  {
    id: 'hypertrophy-ppl',
    name: 'Muskelmasse · Push/Pull/Legs',
    goal: 'gain',
    level: 'Advanced',
    daysPerWeek: 6,
    duration: '10–12 Wochen',
    split: 'Push / Pull / Beine (×2)',
    description:
      'Der klassische, wissenschaftlich fundierte PPL-Split für Hypertrophie (Muskelaufbau). Jede Muskelgruppe wird zweimal pro Woche mit hohem Volumen trainiert. Kombiniert mit einem kontrollierten Kalorienüberschuss ist dies ideal für sauberen Muskelaufbau.',
    weeklySchedule: ['Mo · Push', 'Di · Pull', 'Mi · Beine', 'Do · Push', 'Fr · Pull', 'Sa · Beine', 'So · Ruhe'],
    warmup: '2 aufsteigende Aufwärmsätze bei der ersten Grundübung (leere Stange/leicht → 60 %). 3–4 Min für Schulter- und Hüftmobilität.',
    days: [
      {
        title: 'Push',
        focus: 'Brust · Schultern · Trizeps',
        exercises: [
          { name: 'Bankdrücken', sets: '4', reps: '6-8', rest: '120 Sek', tempo: '3-1-1', note: 'Hauptkraftübung — schwer, aber Technik halten.' },
          { name: 'Schrägbankdrücken (Kurzhantel)', sets: '3', reps: '8-12', rest: '90 Sek' },
          { name: 'Schulterdrücken über Kopf', sets: '3', reps: '8-10', rest: '90 Sek' },
          { name: 'Seitheben', sets: '4', reps: '12-15', rest: '60 Sek', note: 'Leichtes Gewicht, mit den Ellbogen führen — nicht zucken.' },
          { name: 'Trizepsdrücken am Kabel', sets: '3', reps: '10-12', rest: '60 Sek' },
          { name: 'Dips / Diamant-Liegestütz', sets: '3', reps: 'Max (RPE 9)', rest: '75 Sek' },
        ],
      },
      {
        title: 'Pull',
        focus: 'Rücken · Bizeps · hintere Schulter',
        exercises: [
          { name: 'Langhantelrudern / Klimmzug', sets: '4', reps: '6-10', rest: '120 Sek', note: 'Grundlage für Breite und Dicke des Rückens.' },
          { name: 'Latzug', sets: '3', reps: '10-12', rest: '90 Sek' },
          { name: 'Sitzendes Kabelrudern', sets: '3', reps: '10-12', rest: '90 Sek' },
          { name: 'Face Pull', sets: '3', reps: '15', rest: '60 Sek', note: 'Nicht auslassen — wichtig für die Schultergesundheit.' },
          { name: 'Langhantel- / Kurzhantel-Curl', sets: '3', reps: '10-12', rest: '60 Sek' },
          { name: 'Hammer-Curl', sets: '3', reps: '12', rest: '60 Sek' },
        ],
      },
      {
        title: 'Beine',
        focus: 'Quadrizeps · Beinbizeps · Gesäß · Waden',
        exercises: [
          { name: 'Langhantel-Kniebeuge', sets: '4', reps: '6-8', rest: '150 Sek', tempo: '3-1-1', note: 'Die schwerste Übung im Programm — Regeneration priorisieren.' },
          { name: 'Rumänisches Kreuzheben', sets: '4', reps: '8-10', rest: '120 Sek' },
          { name: 'Beinpresse', sets: '3', reps: '10-12', rest: '90 Sek' },
          { name: 'Beinbeuger', sets: '3', reps: '12', rest: '60 Sek' },
          { name: 'Gehender Ausfallschritt', sets: '3', reps: '12 (pro Bein)', rest: '75 Sek' },
          { name: 'Stehendes Wadenheben', sets: '4', reps: '15-20', rest: '45 Sek' },
        ],
      },
    ],
    progression: [
      'Doppelte Progression: sobald du das obere Ende des Wiederholungsbereichs erreichst, Gewicht um 2,5–5 % steigern und am unteren Ende neu beginnen.',
      'Versuche, bei den Hauptübungen jede Woche 1 Wiederholung oder eine kleine Gewichtssteigerung hinzuzufügen.',
      'Alle 4 Wochen ein Deload: Volumen um 40 % reduzieren und regenerieren.',
      'Wenn die Technik zusammenbricht, das Gewicht reduzieren — Ego-Lifting führt zu Verletzungen.',
    ],
    coachTips: [
      'Für Muskelaufbau: 1,8–2,2 g/kg Protein täglich und ein kontrollierter Überschuss von +250–400 kcal.',
      'Trainingsdauer: 60–75 Min; längere Einheiten belasten die Regeneration.',
      'Grundübungen zuerst (Kniebeuge, Bankdrücken, Rudern, Kreuzheben), Isolation zuletzt.',
      'Dokumentiere deinen Fortschritt — was du nicht erfasst, kannst du nicht steuern.',
    ],
  },
  {
    id: 'maintain-full-body',
    name: 'Athletischer Formerhalt',
    goal: 'maintain',
    level: 'Beginner',
    daysPerWeek: 3,
    duration: 'Dauerhaft (nachhaltig)',
    split: 'Ganzkörper ×3',
    description:
      'Ein zeiteffizientes Ganzkörperprogramm, um die aktuelle Fitness und Kraft zu erhalten sowie die allgemeine Gesundheit und Beweglichkeit zu fördern. Trainiert mit nur 3 Einheiten pro Woche alle großen Muskelgruppen ausgewogen. Ideal für Einsteiger und alle mit vollem Terminkalender.',
    weeklySchedule: ['Mo · Training A', 'Mi · Training B', 'Fr · Training C', 'Wochenende · Aktive Erholung (Gehen/Schwimmen)'],
    warmup: '5 Min zügiges Gehen + Gelenkrotationen. 1 leichter Aufwärmsatz bei der ersten Übung.',
    days: [
      {
        title: 'Training A',
        focus: 'Push-betonter Ganzkörper',
        exercises: [
          { name: 'Goblet-Kniebeuge', sets: '3', reps: '10-12', rest: '75 Sek' },
          { name: 'Liegestütz (Knie-Option)', sets: '3', reps: '8-12', rest: '75 Sek' },
          { name: 'Schulterdrücken (Kurzhantel)', sets: '3', reps: '10-12', rest: '60 Sek' },
          { name: 'Kurzhantelrudern', sets: '3', reps: '10-12', rest: '60 Sek' },
          { name: 'Plank', sets: '3', reps: '30-40 Sek', rest: '45 Sek' },
        ],
      },
      {
        title: 'Training B',
        focus: 'Pull & hintere Kette',
        exercises: [
          { name: 'Rumänisches Kreuzheben', sets: '3', reps: '10-12', rest: '90 Sek', note: 'Rücken neutral halten, aus der Hüfte beugen.' },
          { name: 'Latzug / Umgekehrtes Rudern', sets: '3', reps: '10-12', rest: '75 Sek' },
          { name: 'Hip Thrust / Glute Bridge', sets: '3', reps: '12-15', rest: '60 Sek' },
          { name: 'Seitheben', sets: '3', reps: '12-15', rest: '45 Sek' },
          { name: 'Dead Bug', sets: '3', reps: '10 (pro Seite)', rest: '45 Sek' },
        ],
      },
      {
        title: 'Training C',
        focus: 'Beine & Core-Gleichgewicht',
        exercises: [
          { name: 'Bulgarische Split-Kniebeuge', sets: '3', reps: '10 (pro Bein)', rest: '75 Sek' },
          { name: 'Schräger / Klassischer Liegestütz', sets: '3', reps: '10-12', rest: '60 Sek' },
          { name: 'Sitzendes / Kabelrudern', sets: '3', reps: '10-12', rest: '60 Sek' },
          { name: 'Wadenheben', sets: '3', reps: '15-20', rest: '45 Sek' },
          { name: 'Seitlicher Plank', sets: '3', reps: '25-30 Sek (pro Seite)', rest: '45 Sek' },
        ],
      },
    ],
    progression: [
      'Zuerst die Technik festigen; in den ersten 2 Wochen mit angenehmen Gewichten arbeiten.',
      'Bei sauberer Technik alle 1–2 Wochen ein kleines Gewicht oder 1–2 Wiederholungen hinzufügen.',
      'Wenn du das obere Ende des Wiederholungsbereichs locker schaffst, erhöhe das Gewicht.',
      'Bei Langeweile Übungen gegen ähnliche Varianten tauschen, um Abwechslung zu schaffen.',
    ],
    coachTips: [
      'Beim Erhalt das Ziel ist Kalorienbalance (TDEE) — 1,6–2,0 g/kg Protein reichen aus.',
      '3 Trainingseinheiten pro Woche + 8–10k Schritte täglich erhalten deine Gesundheit.',
      'Beständigkeit schlägt Intensität; ärgere dich nicht über verpasste Tage, mach einfach weiter.',
      'Schmerz (Verletzung) und Brennen (Muskelermüdung) sind verschieden — bei Schmerz aufhören.',
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════
// French Workout Programs
// ═══════════════════════════════════════════════════════════════════════════

export const WORKOUT_PROGRAMS_FR: WorkoutProgram[] = [
  {
    id: 'fat-loss-cut',
    name: 'Perte de gras & Tonification',
    goal: 'lose',
    level: 'Intermediate',
    daysPerWeek: 4,
    duration: '8 semaines',
    split: 'Haut / Bas + Métabolique',
    description:
      'Un programme axé sur la combustion des graisses tout en préservant la masse musculaire pendant un déficit calorique. Les mouvements composés lourds sollicitent les muscles, et les jours de conditionnement métabolique augmentent la dépense calorique. Objectif : 0,5–0,7 kg de gras perdu par semaine en conservant la force.',
    weeklySchedule: ['Lun · Haut du corps', 'Mar · Bas du corps', 'Jeu · HIIT + Gainage', 'Sam · Circuit full body', 'Autres jours · 8–10k pas'],
    warmup: '5 min de cardio léger + étirements dynamiques (cercles de bras, ouvertures de hanches, squats au poids du corps ×10). Ajoute 1 série d\'échauffement légère pour la zone ciblée.',
    days: [
      {
        title: 'Jour 1 · Haut du corps',
        focus: 'Pectoraux · Dos · Épaules · Bras',
        exercises: [
          { name: 'Pompes ou Développé couché', sets: '4', reps: '8-10', rest: '90 s', tempo: '3-0-1', note: 'Dernière série proche de l\'échec (RPE 8).' },
          { name: 'Rowing haltère un bras', sets: '4', reps: '10-12', rest: '75 s', note: 'Serre le dos — tire avec les dorsaux, pas les épaules.' },
          { name: 'Développé épaules (haltères)', sets: '3', reps: '10-12', rest: '75 s' },
          { name: 'Tirage vertical / Rowing inversé', sets: '3', reps: '12', rest: '60 s' },
          { name: 'Gainage (planche)', sets: '3', reps: '40 s', rest: '45 s', note: 'Ne laisse pas tomber les hanches ; gaine fort.' },
        ],
      },
      {
        title: 'Jour 2 · Bas du corps',
        focus: 'Jambes · Fessiers · Gainage',
        exercises: [
          { name: 'Squat goblet / barre', sets: '4', reps: '8-10', rest: '120 s', tempo: '3-1-1', note: 'Genoux alignés avec les orteils, garde la profondeur.' },
          { name: 'Soulevé de terre roumain', sets: '4', reps: '10', rest: '90 s', note: 'Sens l\'étirement des ischio-jambiers ; dos neutre.' },
          { name: 'Fente bulgare', sets: '3', reps: '10 (chaque jambe)', rest: '75 s' },
          { name: 'Hip thrust', sets: '3', reps: '12-15', rest: '75 s', note: 'Contracte les fessiers 1 s en haut.' },
          { name: 'Extension des mollets', sets: '3', reps: '15-20', rest: '45 s' },
        ],
      },
      {
        title: 'Jour 3 · HIIT + Gainage',
        focus: 'Cardiovasculaire · Abdominaux',
        exercises: [
          { name: 'Course/vélo par intervalles', sets: '8', reps: '30 s rapide / 60 s facile', rest: '—', note: 'Les intervalles rapides doivent couper le souffle.' },
          { name: 'Burpee', sets: '3', reps: '10', rest: '60 s' },
          { name: 'Mountain climber', sets: '3', reps: '40 s', rest: '45 s' },
          { name: 'Crunch bicyclette', sets: '3', reps: '20', rest: '45 s' },
        ],
      },
      {
        title: 'Jour 4 · Circuit full body',
        focus: 'Métabolique · Corps entier',
        exercises: [
          { name: 'Circuit : 5 mouvements ×3 tours', sets: '3 tours', reps: '40 s effort / 20 s repos', rest: '90 s (entre les tours)', note: 'Squat → Pompes → Rowing → Fente → Planche dans l\'ordre.' },
          { name: 'Finisher : Jumping jack', sets: '2', reps: '45 s', rest: '30 s' },
        ],
      },
    ],
    progression: [
      'Semaines 1–2 : maîtrise la technique, RPE 7 (garde 2–3 répétitions en réserve).',
      'Semaines 3–5 : ajoute une série ou 2 répétitions par semaine ; augmente la charge de 2,5 % si possible.',
      'Semaines 6–8 : maintiens le tempo, réduis le repos de 10–15 s pour augmenter l\'intensité.',
      'Quand tu atteins confortablement le haut de la fourchette de répétitions, augmente la charge et redescends au bas.',
    ],
    coachTips: [
      'Garde un apport en protéines élevé en déficit (2,0–2,4 g/kg) — c\'est ce qui évite la perte musculaire.',
      'Au moins 1 jour de repos complet par semaine ; 7–8 heures de sommeil.',
      'Ajoute le cardio en plus de la musculation, pas à la place. Les poids d\'abord, puis le HIIT.',
      'La balance fluctue ; la moyenne hebdomadaire et le miroir/les mesures sont plus fiables.',
    ],
  },
  {
    id: 'hypertrophy-ppl',
    name: 'Masse musculaire · Push/Pull/Legs',
    goal: 'gain',
    level: 'Advanced',
    daysPerWeek: 6,
    duration: '10–12 semaines',
    split: 'Push / Pull / Jambes (×2)',
    description:
      'Le split PPL classique et fondé sur des preuves pour l\'hypertrophie (croissance musculaire). Chaque groupe musculaire est travaillé deux fois par semaine avec un volume élevé. Combiné à un surplus calorique contrôlé, c\'est idéal pour une prise de muscle propre.',
    weeklySchedule: ['Lun · Push', 'Mar · Pull', 'Mer · Jambes', 'Jeu · Push', 'Ven · Pull', 'Sam · Jambes', 'Dim · Repos'],
    warmup: '2 séries d\'échauffement progressives sur le premier mouvement composé (barre vide/léger → 60 %). Consacre 3–4 min à la mobilité des épaules et des hanches.',
    days: [
      {
        title: 'Push',
        focus: 'Pectoraux · Épaules · Triceps',
        exercises: [
          { name: 'Développé couché', sets: '4', reps: '6-8', rest: '120 s', tempo: '3-1-1', note: 'Mouvement de force principal — lourd mais garde la technique.' },
          { name: 'Développé incliné haltères', sets: '3', reps: '8-12', rest: '90 s' },
          { name: 'Développé épaules au-dessus de la tête', sets: '3', reps: '8-10', rest: '90 s' },
          { name: 'Élévations latérales', sets: '4', reps: '12-15', rest: '60 s', note: 'Charge légère, guide avec les coudes — pas de haussement.' },
          { name: 'Extension triceps à la poulie', sets: '3', reps: '10-12', rest: '60 s' },
          { name: 'Dips / Pompes diamant', sets: '3', reps: 'Max (RPE 9)', rest: '75 s' },
        ],
      },
      {
        title: 'Pull',
        focus: 'Dos · Biceps · Deltoïdes postérieurs',
        exercises: [
          { name: 'Rowing barre / Tractions', sets: '4', reps: '6-10', rest: '120 s', note: 'Base de la largeur et de l\'épaisseur du dos.' },
          { name: 'Tirage vertical', sets: '3', reps: '10-12', rest: '90 s' },
          { name: 'Rowing assis à la poulie', sets: '3', reps: '10-12', rest: '90 s' },
          { name: 'Face pull', sets: '3', reps: '15', rest: '60 s', note: 'Ne le saute pas — essentiel pour la santé des épaules.' },
          { name: 'Curl barre / haltères', sets: '3', reps: '10-12', rest: '60 s' },
          { name: 'Curl marteau', sets: '3', reps: '12', rest: '60 s' },
        ],
      },
      {
        title: 'Jambes',
        focus: 'Quadriceps · Ischio-jambiers · Fessiers · Mollets',
        exercises: [
          { name: 'Squat à la barre', sets: '4', reps: '6-8', rest: '150 s', tempo: '3-1-1', note: 'Le mouvement le plus dur du programme — priorise la récupération.' },
          { name: 'Soulevé de terre roumain', sets: '4', reps: '8-10', rest: '120 s' },
          { name: 'Presse à cuisses', sets: '3', reps: '10-12', rest: '90 s' },
          { name: 'Leg curl', sets: '3', reps: '12', rest: '60 s' },
          { name: 'Fentes marchées', sets: '3', reps: '12 (chaque jambe)', rest: '75 s' },
          { name: 'Extension des mollets debout', sets: '4', reps: '15-20', rest: '45 s' },
        ],
      },
    ],
    progression: [
      'Double progression : une fois le haut de la fourchette atteint, augmente la charge de 2,5–5 % et redescends au bas.',
      'Vise à ajouter 1 répétition ou un petit incrément de charge sur les mouvements principaux chaque semaine.',
      'Toutes les 4 semaines, fais un deload : réduis le volume de 40 % et récupère.',
      'Si la technique se dégrade, baisse la charge — soulever par ego mène à la blessure.',
    ],
    coachTips: [
      'Pour le muscle : 1,8–2,2 g/kg de protéines par jour et un surplus contrôlé de +250–400 kcal.',
      'Durée de séance : 60–75 min ; des séances plus longues nuisent à la récupération.',
      'Fais les mouvements composés d\'abord (squat, développé, rowing, soulevé de terre), l\'isolation en dernier.',
      'Note tes progrès — ce que tu ne mesures pas, tu ne peux pas le gérer.',
    ],
  },
  {
    id: 'maintain-full-body',
    name: 'Maintien athlétique',
    goal: 'maintain',
    level: 'Beginner',
    daysPerWeek: 3,
    duration: 'En continu (durable)',
    split: 'Corps entier ×3',
    description:
      'Un programme full body efficace en temps pour maintenir la forme et la force actuelles, et soutenir la santé globale et la mobilité. Travaille tous les grands groupes musculaires de façon équilibrée en seulement 3 séances par semaine. Idéal pour les débutants et les emplois du temps chargés.',
    weeklySchedule: ['Lun · Séance A', 'Mer · Séance B', 'Ven · Séance C', 'Week-end · Repos actif (marche/natation)'],
    warmup: '5 min de marche rapide + rotations articulaires. 1 série d\'échauffement légère sur le premier exercice.',
    days: [
      {
        title: 'Séance A',
        focus: 'Full body à dominante push',
        exercises: [
          { name: 'Squat goblet', sets: '3', reps: '10-12', rest: '75 s' },
          { name: 'Pompes (option genoux)', sets: '3', reps: '8-12', rest: '75 s' },
          { name: 'Développé épaules (haltères)', sets: '3', reps: '10-12', rest: '60 s' },
          { name: 'Rowing haltère', sets: '3', reps: '10-12', rest: '60 s' },
          { name: 'Gainage (planche)', sets: '3', reps: '30-40 s', rest: '45 s' },
        ],
      },
      {
        title: 'Séance B',
        focus: 'Pull & chaîne postérieure',
        exercises: [
          { name: 'Soulevé de terre roumain', sets: '3', reps: '10-12', rest: '90 s', note: 'Garde le dos neutre, charnière à partir des hanches.' },
          { name: 'Tirage vertical / Rowing inversé', sets: '3', reps: '10-12', rest: '75 s' },
          { name: 'Hip thrust / Pont fessier', sets: '3', reps: '12-15', rest: '60 s' },
          { name: 'Élévations latérales', sets: '3', reps: '12-15', rest: '45 s' },
          { name: 'Dead bug', sets: '3', reps: '10 (chaque côté)', rest: '45 s' },
        ],
      },
      {
        title: 'Séance C',
        focus: 'Jambes & équilibre du gainage',
        exercises: [
          { name: 'Fente bulgare', sets: '3', reps: '10 (chaque jambe)', rest: '75 s' },
          { name: 'Pompes inclinées / standard', sets: '3', reps: '10-12', rest: '60 s' },
          { name: 'Rowing assis / à la poulie', sets: '3', reps: '10-12', rest: '60 s' },
          { name: 'Extension des mollets', sets: '3', reps: '15-20', rest: '45 s' },
          { name: 'Gainage latéral', sets: '3', reps: '25-30 s (chaque côté)', rest: '45 s' },
        ],
      },
    ],
    progression: [
      'D\'abord, maîtrise la technique ; travaille avec des charges confortables les 2 premières semaines.',
      'Si la technique est solide, ajoute une petite charge ou 1–2 répétitions toutes les 1–2 semaines.',
      'Quand tu atteins confortablement le haut de la fourchette de répétitions, augmente la charge.',
      'Si tu t\'ennuies, remplace les exercices par des variantes similaires pour varier.',
    ],
    coachTips: [
      'Pour le maintien, vise l\'équilibre calorique (TDEE) — 1,6–2,0 g/kg de protéines suffisent.',
      '3 séances par semaine + 8–10k pas quotidiens maintiendront ta santé.',
      'La régularité prime sur l\'intensité ; ne stresse pas pour les jours manqués, continue simplement.',
      'La douleur (blessure) et la brûlure (fatigue musculaire) sont différentes — arrête si c\'est une douleur.',
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════
// Spanish Workout Programs
// ═══════════════════════════════════════════════════════════════════════════

export const WORKOUT_PROGRAMS_ES: WorkoutProgram[] = [
  {
    id: 'fat-loss-cut',
    name: 'Pérdida de grasa y tonificación',
    goal: 'lose',
    level: 'Intermediate',
    daysPerWeek: 4,
    duration: '8 semanas',
    split: 'Tren superior / inferior + Metabólico',
    description:
      'Un programa centrado en quemar grasa mientras se preserva la masa muscular durante un déficit calórico. Los ejercicios compuestos pesados estimulan el músculo, y los días de acondicionamiento metabólico aumentan el gasto calórico. Objetivo: 0,5–0,7 kg de grasa perdida por semana manteniendo la fuerza.',
    weeklySchedule: ['Lun · Tren superior', 'Mar · Tren inferior', 'Jue · HIIT + Core', 'Sáb · Circuito full body', 'Otros días · 8–10k pasos'],
    warmup: '5 min de cardio suave + estiramientos dinámicos (círculos de brazos, aperturas de cadera, sentadillas con peso corporal ×10). Añade 1 serie de calentamiento ligera para la zona objetivo.',
    days: [
      {
        title: 'Día 1 · Tren superior',
        focus: 'Pecho · Espalda · Hombros · Brazos',
        exercises: [
          { name: 'Flexiones o Press de banca', sets: '4', reps: '8-10', rest: '90 s', tempo: '3-0-1', note: 'Última serie cerca del fallo (RPE 8).' },
          { name: 'Remo con mancuerna a una mano', sets: '4', reps: '10-12', rest: '75 s', note: 'Aprieta la espalda — tira con los dorsales, no con los hombros.' },
          { name: 'Press de hombros (mancuernas)', sets: '3', reps: '10-12', rest: '75 s' },
          { name: 'Jalón al pecho / Remo invertido', sets: '3', reps: '12', rest: '60 s' },
          { name: 'Plancha', sets: '3', reps: '40 s', rest: '45 s', note: 'No dejes caer las caderas; aprieta el core.' },
        ],
      },
      {
        title: 'Día 2 · Tren inferior',
        focus: 'Piernas · Glúteos · Core',
        exercises: [
          { name: 'Sentadilla goblet / barra', sets: '4', reps: '8-10', rest: '120 s', tempo: '3-1-1', note: 'Rodillas alineadas con los dedos del pie, mantén la profundidad.' },
          { name: 'Peso muerto rumano', sets: '4', reps: '10', rest: '90 s', note: 'Siente el estiramiento del femoral; espalda neutra.' },
          { name: 'Sentadilla búlgara', sets: '3', reps: '10 (cada pierna)', rest: '75 s' },
          { name: 'Hip thrust', sets: '3', reps: '12-15', rest: '75 s', note: 'Aprieta los glúteos 1 s arriba.' },
          { name: 'Elevación de gemelos', sets: '3', reps: '15-20', rest: '45 s' },
        ],
      },
      {
        title: 'Día 3 · HIIT + Core',
        focus: 'Cardiovascular · Abdominales',
        exercises: [
          { name: 'Carrera/bici por intervalos', sets: '8', reps: '30 s rápido / 60 s suave', rest: '—', note: 'Los intervalos rápidos deben dejarte sin aliento.' },
          { name: 'Burpee', sets: '3', reps: '10', rest: '60 s' },
          { name: 'Escalador (mountain climber)', sets: '3', reps: '40 s', rest: '45 s' },
          { name: 'Crunch bicicleta', sets: '3', reps: '20', rest: '45 s' },
        ],
      },
      {
        title: 'Día 4 · Circuito full body',
        focus: 'Metabólico · Cuerpo completo',
        exercises: [
          { name: 'Circuito: 5 ejercicios ×3 rondas', sets: '3 rondas', reps: '40 s trabajo / 20 s descanso', rest: '90 s (entre rondas)', note: 'Sentadilla → Flexión → Remo → Zancada → Plancha en orden.' },
          { name: 'Finalizador: Jumping jack', sets: '2', reps: '45 s', rest: '30 s' },
        ],
      },
    ],
    progression: [
      'Semanas 1–2: domina la técnica, RPE 7 (deja 2–3 repeticiones en reserva).',
      'Semanas 3–5: añade una serie o 2 repeticiones por semana; aumenta el peso un 2,5 % si puedes.',
      'Semanas 6–8: mantén el tempo, reduce el descanso 10–15 s para subir la intensidad.',
      'Cuando alcances cómodamente el tope del rango de repeticiones, aumenta el peso y baja al inicio del rango.',
    ],
    coachTips: [
      'Mantén la proteína alta en déficit (2,0–2,4 g/kg) — eso evita la pérdida muscular.',
      'Al menos 1 día de descanso completo por semana; duerme 7–8 horas.',
      'Añade el cardio sobre la fuerza, no en su lugar. Primero las pesas, luego el HIIT.',
      'La báscula fluctúa; la media semanal y el espejo/las medidas son más fiables.',
    ],
  },
  {
    id: 'hypertrophy-ppl',
    name: 'Masa muscular · Push/Pull/Legs',
    goal: 'gain',
    level: 'Advanced',
    daysPerWeek: 6,
    duration: '10–12 semanas',
    split: 'Push / Pull / Pierna (×2)',
    description:
      'El clásico split PPL respaldado por la evidencia para la hipertrofia (crecimiento muscular). Cada grupo muscular se entrena dos veces por semana con alto volumen. Combinado con un superávit calórico controlado, es ideal para una ganancia muscular limpia.',
    weeklySchedule: ['Lun · Push', 'Mar · Pull', 'Mié · Pierna', 'Jue · Push', 'Vie · Pull', 'Sáb · Pierna', 'Dom · Descanso'],
    warmup: '2 series de calentamiento progresivas en el primer ejercicio compuesto (barra vacía/ligero → 60 %). Dedica 3–4 min a la movilidad de hombros y caderas.',
    days: [
      {
        title: 'Push',
        focus: 'Pecho · Hombros · Tríceps',
        exercises: [
          { name: 'Press de banca', sets: '4', reps: '6-8', rest: '120 s', tempo: '3-1-1', note: 'Ejercicio principal de fuerza — pesado pero con buena técnica.' },
          { name: 'Press inclinado con mancuernas', sets: '3', reps: '8-12', rest: '90 s' },
          { name: 'Press militar por encima de la cabeza', sets: '3', reps: '8-10', rest: '90 s' },
          { name: 'Elevaciones laterales', sets: '4', reps: '12-15', rest: '60 s', note: 'Peso ligero, lidera con los codos — no encojas los hombros.' },
          { name: 'Extensión de tríceps en polea', sets: '3', reps: '10-12', rest: '60 s' },
          { name: 'Fondos / Flexiones diamante', sets: '3', reps: 'Máx (RPE 9)', rest: '75 s' },
        ],
      },
      {
        title: 'Pull',
        focus: 'Espalda · Bíceps · Deltoides posterior',
        exercises: [
          { name: 'Remo con barra / Dominadas', sets: '4', reps: '6-10', rest: '120 s', note: 'Base para la anchura y el grosor de la espalda.' },
          { name: 'Jalón al pecho', sets: '3', reps: '10-12', rest: '90 s' },
          { name: 'Remo sentado en polea', sets: '3', reps: '10-12', rest: '90 s' },
          { name: 'Face pull', sets: '3', reps: '15', rest: '60 s', note: 'No lo saltes — clave para la salud de los hombros.' },
          { name: 'Curl con barra / mancuernas', sets: '3', reps: '10-12', rest: '60 s' },
          { name: 'Curl martillo', sets: '3', reps: '12', rest: '60 s' },
        ],
      },
      {
        title: 'Pierna',
        focus: 'Cuádriceps · Femorales · Glúteos · Gemelos',
        exercises: [
          { name: 'Sentadilla con barra', sets: '4', reps: '6-8', rest: '150 s', tempo: '3-1-1', note: 'El ejercicio más duro del programa — prioriza la recuperación.' },
          { name: 'Peso muerto rumano', sets: '4', reps: '8-10', rest: '120 s' },
          { name: 'Prensa de piernas', sets: '3', reps: '10-12', rest: '90 s' },
          { name: 'Curl femoral', sets: '3', reps: '12', rest: '60 s' },
          { name: 'Zancadas caminando', sets: '3', reps: '12 (cada pierna)', rest: '75 s' },
          { name: 'Elevación de gemelos de pie', sets: '4', reps: '15-20', rest: '45 s' },
        ],
      },
    ],
    progression: [
      'Doble progresión: al alcanzar el tope del rango de repeticiones, aumenta el peso un 2,5–5 % y baja al inicio.',
      'Intenta añadir 1 repetición o un pequeño incremento de peso en los ejercicios principales cada semana.',
      'Cada 4 semanas, deload: reduce el volumen un 40 % y recupérate.',
      'Si la técnica se rompe, baja el peso — levantar por ego lleva a lesiones.',
    ],
    coachTips: [
      'Para músculo: 1,8–2,2 g/kg de proteína al día y un superávit controlado de +250–400 kcal.',
      'Duración de la sesión: 60–75 min; las sesiones más largas perjudican la recuperación.',
      'Haz primero los ejercicios compuestos (sentadilla, press, remo, peso muerto), el aislamiento al final.',
      'Registra tu progreso — lo que no mides, no lo puedes gestionar.',
    ],
  },
  {
    id: 'maintain-full-body',
    name: 'Mantenimiento atlético',
    goal: 'maintain',
    level: 'Beginner',
    daysPerWeek: 3,
    duration: 'Continuo (sostenible)',
    split: 'Cuerpo completo ×3',
    description:
      'Un programa full body eficiente en tiempo para mantener la forma física y la fuerza actuales, y favorecer la salud general y la movilidad. Entrena todos los grandes grupos musculares de forma equilibrada con solo 3 sesiones por semana. Ideal para principiantes y agendas ocupadas.',
    weeklySchedule: ['Lun · Entreno A', 'Mié · Entreno B', 'Vie · Entreno C', 'Fin de semana · Descanso activo (caminar/nadar)'],
    warmup: '5 min de caminata enérgica + rotaciones articulares. 1 serie de calentamiento ligera en el primer ejercicio.',
    days: [
      {
        title: 'Entreno A',
        focus: 'Full body con dominante de empuje',
        exercises: [
          { name: 'Sentadilla goblet', sets: '3', reps: '10-12', rest: '75 s' },
          { name: 'Flexiones (opción de rodillas)', sets: '3', reps: '8-12', rest: '75 s' },
          { name: 'Press de hombros (mancuernas)', sets: '3', reps: '10-12', rest: '60 s' },
          { name: 'Remo con mancuerna', sets: '3', reps: '10-12', rest: '60 s' },
          { name: 'Plancha', sets: '3', reps: '30-40 s', rest: '45 s' },
        ],
      },
      {
        title: 'Entreno B',
        focus: 'Tracción y cadena posterior',
        exercises: [
          { name: 'Peso muerto rumano', sets: '3', reps: '10-12', rest: '90 s', note: 'Mantén la espalda neutra, bisagra desde las caderas.' },
          { name: 'Jalón al pecho / Remo invertido', sets: '3', reps: '10-12', rest: '75 s' },
          { name: 'Hip thrust / Puente de glúteo', sets: '3', reps: '12-15', rest: '60 s' },
          { name: 'Elevaciones laterales', sets: '3', reps: '12-15', rest: '45 s' },
          { name: 'Dead bug', sets: '3', reps: '10 (cada lado)', rest: '45 s' },
        ],
      },
      {
        title: 'Entreno C',
        focus: 'Piernas y equilibrio del core',
        exercises: [
          { name: 'Sentadilla búlgara', sets: '3', reps: '10 (cada pierna)', rest: '75 s' },
          { name: 'Flexiones inclinadas / estándar', sets: '3', reps: '10-12', rest: '60 s' },
          { name: 'Remo sentado / en polea', sets: '3', reps: '10-12', rest: '60 s' },
          { name: 'Elevación de gemelos', sets: '3', reps: '15-20', rest: '45 s' },
          { name: 'Plancha lateral', sets: '3', reps: '25-30 s (cada lado)', rest: '45 s' },
        ],
      },
    ],
    progression: [
      'Primero, domina la técnica; trabaja con pesos cómodos las primeras 2 semanas.',
      'Si la técnica es sólida, añade un poco de peso o 1–2 repeticiones cada 1–2 semanas.',
      'Cuando alcances cómodamente el tope del rango de repeticiones, aumenta el peso.',
      'Si te aburres, cambia los ejercicios por variantes similares para añadir variedad.',
    ],
    coachTips: [
      'Para mantenimiento, busca el equilibrio calórico (TDEE) — 1,6–2,0 g/kg de proteína es suficiente.',
      '3 entrenos por semana + 8–10k pasos diarios mantendrán tu salud.',
      'La constancia supera a la intensidad; no te agobies por los días perdidos, sigue adelante.',
      'El dolor (lesión) y el ardor (fatiga muscular) son diferentes — para si es dolor.',
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════
// Italian Workout Programs
// ═══════════════════════════════════════════════════════════════════════════

export const WORKOUT_PROGRAMS_IT: WorkoutProgram[] = [
  {
    id: 'fat-loss-cut',
    name: 'Dimagrimento e tonificazione',
    goal: 'lose',
    level: 'Intermediate',
    daysPerWeek: 4,
    duration: '8 settimane',
    split: 'Parte alta / bassa + Metabolico',
    description:
      'Un programma incentrato sulla perdita di grasso preservando la massa muscolare durante un deficit calorico. Gli esercizi composti pesanti stimolano il muscolo, e i giorni di condizionamento metabolico aumentano il dispendio calorico. Obiettivo: 0,5–0,7 kg di grasso perso a settimana mantenendo la forza.',
    weeklySchedule: ['Lun · Parte alta', 'Mar · Parte bassa', 'Gio · HIIT + Core', 'Sab · Circuito full body', 'Altri giorni · 8–10k passi'],
    warmup: '5 min di cardio leggero + stretching dinamico (cerchi con le braccia, aperture dell\'anca, squat a corpo libero ×10). Aggiungi 1 serie di riscaldamento leggera per la zona target.',
    days: [
      {
        title: 'Giorno 1 · Parte alta',
        focus: 'Petto · Schiena · Spalle · Braccia',
        exercises: [
          { name: 'Piegamenti o Panca piana', sets: '4', reps: '8-10', rest: '90 sec', tempo: '3-0-1', note: 'Ultima serie vicino al cedimento (RPE 8).' },
          { name: 'Rematore con manubrio a un braccio', sets: '4', reps: '10-12', rest: '75 sec', note: 'Contrai la schiena — tira con i dorsali, non con le spalle.' },
          { name: 'Lento avanti con manubri', sets: '3', reps: '10-12', rest: '75 sec' },
          { name: 'Lat machine / Rematore inverso', sets: '3', reps: '12', rest: '60 sec' },
          { name: 'Plank', sets: '3', reps: '40 sec', rest: '45 sec', note: 'Non far cadere le anche; tieni il core contratto.' },
        ],
      },
      {
        title: 'Giorno 2 · Parte bassa',
        focus: 'Gambe · Glutei · Core',
        exercises: [
          { name: 'Squat goblet / bilanciere', sets: '4', reps: '8-10', rest: '120 sec', tempo: '3-1-1', note: 'Ginocchia in linea con le punte, mantieni la profondità.' },
          { name: 'Stacco rumeno', sets: '4', reps: '10', rest: '90 sec', note: 'Senti l\'allungamento dei femorali; schiena neutra.' },
          { name: 'Affondo bulgaro', sets: '3', reps: '10 (per gamba)', rest: '75 sec' },
          { name: 'Hip thrust', sets: '3', reps: '12-15', rest: '75 sec', note: 'Contrai i glutei per 1 sec in alto.' },
          { name: 'Calf raise', sets: '3', reps: '15-20', rest: '45 sec' },
        ],
      },
      {
        title: 'Giorno 3 · HIIT + Core',
        focus: 'Cardiovascolare · Addominali',
        exercises: [
          { name: 'Corsa/bici a intervalli', sets: '8', reps: '30 sec veloce / 60 sec lento', rest: '—', note: 'Gli intervalli veloci devono lasciarti senza fiato.' },
          { name: 'Burpee', sets: '3', reps: '10', rest: '60 sec' },
          { name: 'Mountain climber', sets: '3', reps: '40 sec', rest: '45 sec' },
          { name: 'Crunch bicicletta', sets: '3', reps: '20', rest: '45 sec' },
        ],
      },
      {
        title: 'Giorno 4 · Circuito full body',
        focus: 'Metabolico · Corpo intero',
        exercises: [
          { name: 'Circuito: 5 esercizi ×3 giri', sets: '3 giri', reps: '40 sec lavoro / 20 sec riposo', rest: '90 sec (tra i giri)', note: 'Squat → Piegamenti → Rematore → Affondo → Plank in ordine.' },
          { name: 'Finisher: Jumping jack', sets: '2', reps: '45 sec', rest: '30 sec' },
        ],
      },
    ],
    progression: [
      'Settimane 1–2: cura la tecnica, RPE 7 (lascia 2–3 ripetizioni di riserva).',
      'Settimane 3–5: aggiungi una serie o 2 ripetizioni a settimana; aumenta il carico del 2,5 % se possibile.',
      'Settimane 6–8: mantieni il tempo, riduci il recupero di 10–15 sec per alzare l\'intensità.',
      'Quando raggiungi comodamente il limite alto del range di ripetizioni, aumenta il carico e torna al limite basso.',
    ],
    coachTips: [
      'In deficit tieni alte le proteine (2,0–2,4 g/kg) — è ciò che previene la perdita muscolare.',
      'Almeno 1 giorno di riposo completo a settimana; dormi 7–8 ore.',
      'Aggiungi il cardio in più rispetto alla forza, non al suo posto. Prima i pesi, poi l\'HIIT.',
      'La bilancia oscilla; la media settimanale e lo specchio/le misure sono più affidabili.',
    ],
  },
  {
    id: 'hypertrophy-ppl',
    name: 'Massa muscolare · Push/Pull/Legs',
    goal: 'gain',
    level: 'Advanced',
    daysPerWeek: 6,
    duration: '10–12 settimane',
    split: 'Push / Pull / Gambe (×2)',
    description:
      'Il classico split PPL basato sull\'evidenza per l\'ipertrofia (crescita muscolare). Ogni gruppo muscolare viene allenato due volte a settimana con volume elevato. Combinato con un surplus calorico controllato, è ideale per una crescita muscolare pulita.',
    weeklySchedule: ['Lun · Push', 'Mar · Pull', 'Mer · Gambe', 'Gio · Push', 'Ven · Pull', 'Sab · Gambe', 'Dom · Riposo'],
    warmup: '2 serie di riscaldamento progressive sul primo esercizio composto (bilanciere vuoto/leggero → 60 %). Dedica 3–4 min alla mobilità di spalle e anche.',
    days: [
      {
        title: 'Push',
        focus: 'Petto · Spalle · Tricipiti',
        exercises: [
          { name: 'Panca piana', sets: '4', reps: '6-8', rest: '120 sec', tempo: '3-1-1', note: 'Esercizio di forza principale — pesante ma con tecnica corretta.' },
          { name: 'Panca inclinata con manubri', sets: '3', reps: '8-12', rest: '90 sec' },
          { name: 'Lento sopra la testa', sets: '3', reps: '8-10', rest: '90 sec' },
          { name: 'Alzate laterali', sets: '4', reps: '12-15', rest: '60 sec', note: 'Carico leggero, guida con i gomiti — non scrollare le spalle.' },
          { name: 'Pushdown ai tricipiti', sets: '3', reps: '10-12', rest: '60 sec' },
          { name: 'Dip / Piegamenti a diamante', sets: '3', reps: 'Max (RPE 9)', rest: '75 sec' },
        ],
      },
      {
        title: 'Pull',
        focus: 'Schiena · Bicipiti · Deltoidi posteriori',
        exercises: [
          { name: 'Rematore con bilanciere / Trazioni', sets: '4', reps: '6-10', rest: '120 sec', note: 'Base per larghezza e spessore della schiena.' },
          { name: 'Lat machine', sets: '3', reps: '10-12', rest: '90 sec' },
          { name: 'Rematore al cavo da seduto', sets: '3', reps: '10-12', rest: '90 sec' },
          { name: 'Face pull', sets: '3', reps: '15', rest: '60 sec', note: 'Non saltarlo — fondamentale per la salute delle spalle.' },
          { name: 'Curl con bilanciere / manubri', sets: '3', reps: '10-12', rest: '60 sec' },
          { name: 'Hammer curl', sets: '3', reps: '12', rest: '60 sec' },
        ],
      },
      {
        title: 'Gambe',
        focus: 'Quadricipiti · Femorali · Glutei · Polpacci',
        exercises: [
          { name: 'Squat con bilanciere', sets: '4', reps: '6-8', rest: '150 sec', tempo: '3-1-1', note: 'L\'esercizio più impegnativo del programma — dai priorità al recupero.' },
          { name: 'Stacco rumeno', sets: '4', reps: '8-10', rest: '120 sec' },
          { name: 'Leg press', sets: '3', reps: '10-12', rest: '90 sec' },
          { name: 'Leg curl', sets: '3', reps: '12', rest: '60 sec' },
          { name: 'Affondi camminati', sets: '3', reps: '12 (per gamba)', rest: '75 sec' },
          { name: 'Calf raise in piedi', sets: '4', reps: '15-20', rest: '45 sec' },
        ],
      },
    ],
    progression: [
      'Doppia progressione: una volta raggiunto il limite alto del range, aumenta il carico del 2,5–5 % e torna al limite basso.',
      'Punta ad aggiungere 1 ripetizione o un piccolo incremento di carico sugli esercizi principali ogni settimana.',
      'Ogni 4 settimane, fai un deload: riduci il volume del 40 % e recupera.',
      'Se la tecnica cede, abbassa il carico — allenarsi per ego porta a infortuni.',
    ],
    coachTips: [
      'Per il muscolo: 1,8–2,2 g/kg di proteine al giorno e un surplus controllato di +250–400 kcal.',
      'Durata della sessione: 60–75 min; sessioni più lunghe affaticano il recupero.',
      'Fai prima gli esercizi composti (squat, panca, rematore, stacco), l\'isolamento per ultimo.',
      'Annota i tuoi progressi — ciò che non misuri, non puoi gestirlo.',
    ],
  },
  {
    id: 'maintain-full-body',
    name: 'Mantenimento atletico',
    goal: 'maintain',
    level: 'Beginner',
    daysPerWeek: 3,
    duration: 'Continuativo (sostenibile)',
    split: 'Corpo intero ×3',
    description:
      'Un programma full body efficiente in termini di tempo per mantenere forma e forza attuali, e sostenere salute generale e mobilità. Allena tutti i grandi gruppi muscolari in modo equilibrato con sole 3 sessioni a settimana. Ideale per principianti e per chi ha poco tempo.',
    weeklySchedule: ['Lun · Allenamento A', 'Mer · Allenamento B', 'Ven · Allenamento C', 'Fine settimana · Riposo attivo (camminata/nuoto)'],
    warmup: '5 min di camminata veloce + rotazioni articolari. 1 serie di riscaldamento leggera sul primo esercizio.',
    days: [
      {
        title: 'Allenamento A',
        focus: 'Full body a dominanza di spinta',
        exercises: [
          { name: 'Squat goblet', sets: '3', reps: '10-12', rest: '75 sec' },
          { name: 'Piegamenti (opzione sulle ginocchia)', sets: '3', reps: '8-12', rest: '75 sec' },
          { name: 'Lento avanti con manubri', sets: '3', reps: '10-12', rest: '60 sec' },
          { name: 'Rematore con manubrio', sets: '3', reps: '10-12', rest: '60 sec' },
          { name: 'Plank', sets: '3', reps: '30-40 sec', rest: '45 sec' },
        ],
      },
      {
        title: 'Allenamento B',
        focus: 'Trazione e catena posteriore',
        exercises: [
          { name: 'Stacco rumeno', sets: '3', reps: '10-12', rest: '90 sec', note: 'Tieni la schiena neutra, cerniera dalle anche.' },
          { name: 'Lat machine / Rematore inverso', sets: '3', reps: '10-12', rest: '75 sec' },
          { name: 'Hip thrust / Ponte per glutei', sets: '3', reps: '12-15', rest: '60 sec' },
          { name: 'Alzate laterali', sets: '3', reps: '12-15', rest: '45 sec' },
          { name: 'Dead bug', sets: '3', reps: '10 (per lato)', rest: '45 sec' },
        ],
      },
      {
        title: 'Allenamento C',
        focus: 'Gambe ed equilibrio del core',
        exercises: [
          { name: 'Affondo bulgaro', sets: '3', reps: '10 (per gamba)', rest: '75 sec' },
          { name: 'Piegamenti inclinati / standard', sets: '3', reps: '10-12', rest: '60 sec' },
          { name: 'Rematore da seduto / al cavo', sets: '3', reps: '10-12', rest: '60 sec' },
          { name: 'Calf raise', sets: '3', reps: '15-20', rest: '45 sec' },
          { name: 'Plank laterale', sets: '3', reps: '25-30 sec (per lato)', rest: '45 sec' },
        ],
      },
    ],
    progression: [
      'Prima cura la tecnica; lavora con carichi comodi per le prime 2 settimane.',
      'Se la tecnica è solida, aggiungi un piccolo carico o 1–2 ripetizioni ogni 1–2 settimane.',
      'Quando raggiungi comodamente il limite alto del range di ripetizioni, aumenta il carico.',
      'Se ti annoi, sostituisci gli esercizi con varianti simili per aggiungere varietà.',
    ],
    coachTips: [
      'Per il mantenimento, punta all\'equilibrio calorico (TDEE) — 1,6–2,0 g/kg di proteine sono sufficienti.',
      '3 allenamenti a settimana + 8–10k passi al giorno manterranno la tua salute.',
      'La costanza batte l\'intensità; non stressarti per i giorni saltati, vai avanti.',
      'Il dolore (infortunio) e il bruciore (fatica muscolare) sono diversi — fermati se è dolore.',
    ],
  },
]

/** Returns workout programs for the given locale. */
export function getWorkoutPrograms(locale: string): WorkoutProgram[] {
  switch (locale) {
    case 'tr': return WORKOUT_PROGRAMS
    case 'de': return WORKOUT_PROGRAMS_DE
    case 'fr': return WORKOUT_PROGRAMS_FR
    case 'es': return WORKOUT_PROGRAMS_ES
    case 'it': return WORKOUT_PROGRAMS_IT
    default: return WORKOUT_PROGRAMS_EN
  }
}

/** Returns the recommended program for the user's goal. */
export function getProgramForGoal(goal: ProgramGoal, locale = 'tr'): WorkoutProgram {
  const programs = getWorkoutPrograms(locale)
  return programs.find((p) => p.goal === goal) ?? programs[0]
}
