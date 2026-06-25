/**
 * messages.ts — Localized, user-facing strings emitted by the AI pipeline.
 *
 * These never come from the model; they are produced by our server-side
 * validation/correction logic (scan warnings, fallback names, fallback
 * programs). They MUST be localized so no Turkish leaks into a German,
 * French, Spanish, Italian, or English user's results.
 */

export type Loc = "tr" | "en" | "de" | "fr" | "es" | "it";

function pick(locale: string | undefined): Loc {
  const l = (locale ?? "tr") as Loc;
  return (["tr", "en", "de", "fr", "es", "it"] as const).includes(l) ? l : "en";
}

// ─── Scan (meal image analysis) messages ────────────────────────────────────

export interface ScanMessages {
  caloriesRecalculated: (food: string) => string;
  extremeDensityFixed: (food: string) => string;
  singlePieceChickenReduced: (food: string) => string;
  totalRecalculated: string;
  refValuesCorrected: (food: string, from: number, to: number) => string;
  defaultFoodName: string;
  defaultMealName: string;
  genericItem: string;
  chickenWord: string;
}

const SCAN: Record<Loc, ScanMessages> = {
  tr: {
    caloriesRecalculated: (f) => `${f} kalorisi makrolardan yeniden hesaplandı.`,
    extremeDensityFixed: (f) => `${f} için uç kalori yoğunluğu düzeltildi.`,
    singlePieceChickenReduced: (f) =>
      `${f} tek parça göründüğü için yenebilir porsiyon 180g'a çekildi.`,
    totalRecalculated: "Toplam besin değeri öğe toplamları baz alınarak düzeltildi.",
    refValuesCorrected: (f, from, to) =>
      `${f} besin değeri referans verilerle düzeltildi (${from} → ${to} kcal/100g).`,
    defaultFoodName: "Yemek",
    defaultMealName: "Öğün",
    genericItem: "Bir öğe",
    chickenWord: "Tavuk",
  },
  en: {
    caloriesRecalculated: (f) => `${f} calories were recalculated from its macros.`,
    extremeDensityFixed: (f) => `An extreme calorie density was corrected for ${f}.`,
    singlePieceChickenReduced: (f) =>
      `${f} looked like a single piece, so the edible portion was set to 180g.`,
    totalRecalculated: "Total nutrition was recalculated based on item sums.",
    refValuesCorrected: (f, from, to) =>
      `${f} nutrition was corrected using reference data (${from} → ${to} kcal/100g).`,
    defaultFoodName: "Food",
    defaultMealName: "Meal",
    genericItem: "An item",
    chickenWord: "Chicken",
  },
  de: {
    caloriesRecalculated: (f) => `Die Kalorien von ${f} wurden aus den Makros neu berechnet.`,
    extremeDensityFixed: (f) => `Eine extreme Kaloriendichte wurde für ${f} korrigiert.`,
    singlePieceChickenReduced: (f) =>
      `${f} sah wie ein einzelnes Stück aus, daher wurde die essbare Portion auf 180g gesetzt.`,
    totalRecalculated: "Die Gesamtnährwerte wurden anhand der Einzelwerte neu berechnet.",
    refValuesCorrected: (f, from, to) =>
      `Die Nährwerte von ${f} wurden mit Referenzdaten korrigiert (${from} → ${to} kcal/100g).`,
    defaultFoodName: "Gericht",
    defaultMealName: "Mahlzeit",
    genericItem: "Ein Eintrag",
    chickenWord: "Hähnchen",
  },
  fr: {
    caloriesRecalculated: (f) => `Les calories de ${f} ont été recalculées à partir des macros.`,
    extremeDensityFixed: (f) => `Une densité calorique extrême a été corrigée pour ${f}.`,
    singlePieceChickenReduced: (f) =>
      `${f} semblait être un seul morceau ; la portion comestible a été fixée à 180g.`,
    totalRecalculated: "La valeur nutritionnelle totale a été recalculée à partir des éléments.",
    refValuesCorrected: (f, from, to) =>
      `La valeur nutritionnelle de ${f} a été corrigée avec des données de référence (${from} → ${to} kcal/100g).`,
    defaultFoodName: "Aliment",
    defaultMealName: "Repas",
    genericItem: "Un élément",
    chickenWord: "Poulet",
  },
  es: {
    caloriesRecalculated: (f) => `Las calorías de ${f} se recalcularon a partir de sus macros.`,
    extremeDensityFixed: (f) => `Se corrigió una densidad calórica extrema para ${f}.`,
    singlePieceChickenReduced: (f) =>
      `${f} parecía una sola pieza, por lo que la porción comestible se fijó en 180g.`,
    totalRecalculated: "El valor nutricional total se recalculó según la suma de los elementos.",
    refValuesCorrected: (f, from, to) =>
      `El valor nutricional de ${f} se corrigió con datos de referencia (${from} → ${to} kcal/100g).`,
    defaultFoodName: "Alimento",
    defaultMealName: "Comida",
    genericItem: "Un elemento",
    chickenWord: "Pollo",
  },
  it: {
    caloriesRecalculated: (f) => `Le calorie di ${f} sono state ricalcolate dai macro.`,
    extremeDensityFixed: (f) => `È stata corretta una densità calorica estrema per ${f}.`,
    singlePieceChickenReduced: (f) =>
      `${f} sembrava un solo pezzo, quindi la porzione commestibile è stata impostata a 180g.`,
    totalRecalculated: "Il valore nutrizionale totale è stato ricalcolato in base alla somma degli elementi.",
    refValuesCorrected: (f, from, to) =>
      `Il valore nutrizionale di ${f} è stato corretto con dati di riferimento (${from} → ${to} kcal/100g).`,
    defaultFoodName: "Alimento",
    defaultMealName: "Pasto",
    genericItem: "Un elemento",
    chickenWord: "Pollo",
  },
};

export function getScanMessages(locale?: string): ScanMessages {
  return SCAN[pick(locale)];
}

// ─── Program (fallback workout/nutrition) messages ──────────────────────────

type Goal =
  | "fat_loss"
  | "muscle_gain"
  | "fit_look"
  | "weight_gain"
  | "strength"
  | "healthy_eating";

export interface ProgramMessages {
  dayLabel: (n: number) => string;
  mealLabel: (n: number) => string;
  breakfast: string;
  lunch: string;
  dinner: string;
  fullBodyStrength: string;
  conditioningCore: string;
  exerciseDefault: string;
  secAbbr: string;
  perFoot: string;
  goalOverview: Record<Goal, string>;
  goalCardio: Record<Goal, string>;
  warmup: string;
  cooldown: string;
  cardioGeneric: string;
  fourWeekProgression: string[];
  targetSummaryDefault: string;
  overviewDefault: string;
  strategyDefault: string;
  waterDefault: string;
  genericMealOption: string;
  progressTracking: string[];
  safetyNotes: string[];
  exerciseNotes: {
    squat: string;
    row: string;
    push: string;
    rdl: string;
    lunge: string;
    plank: string;
  };
  nutritionStrategy: string;
  nutritionWater: string;
  sampleBreakfast: string;
  sampleLunch: string;
  sampleDinner: string;
  proteinAlternativesLabel: string;
  carbAlternativesLabel: string;
  proteinAlternatives: string[];
  carbAlternatives: string[];
}

const PROGRAM: Record<Loc, ProgramMessages> = {
  tr: {
    dayLabel: (n) => `Gün ${n}`,
    mealLabel: (n) => `Öğün ${n}`,
    breakfast: "Kahvaltı",
    lunch: "Öğle",
    dinner: "Akşam",
    fullBodyStrength: "Full body kuvvet",
    conditioningCore: "Kondisyon ve core",
    exerciseDefault: "Egzersiz",
    secAbbr: "sn",
    perFoot: "/ayak",
    goalOverview: {
      fat_loss: "Kası koruyarak yağ yakmaya yönelik; kuvvet antrenmanı önde, kardiyo destekleyici.",
      muscle_gain: "Bileşik hareketler ve progresif yüklenme odaklı, kas gelişimini önceleyen plan.",
      fit_look: "Kuvvet, kondisyon ve estetik dengesi için recomposition odaklı plan.",
      weight_gain: "Yüksek yoğunluklu, bileşik hareket ağırlıklı, toparlanmayı önceleyen kilo alma planı.",
      strength: "Ana kaldırışlar önde, düşük tekrar / yüksek dinlenme ile kuvvet odaklı plan.",
      healthy_eating: "Genel sağlık ve sürdürülebilirlik için dengeli full body planı.",
    },
    goalCardio: {
      fat_loss: "Haftada 3-4 kez 30-40 dk LISS + 1-2 kısa HIIT; antrenman sonrası veya ayrı günde.",
      muscle_gain: "Haftada 2 kez 20-30 dk düşük yoğunluklu kardiyo, sadece kalp sağlığı için.",
      fit_look: "Haftada 2-3 kez karışık tempoda 25-30 dk kardiyo.",
      weight_gain: "Minimum kardiyo; haftada 1-2 kez kısa, hafif tempo yürüyüş.",
      strength: "Haftada 1-2 kez hafif kardiyo; toparlanmayı bozmayacak şekilde.",
      healthy_eating: "Haftada 2-3 kez 25-35 dk orta tempo yürüyüş veya bisiklet.",
    },
    warmup: "5-8 dk hafif tempo + dinamik mobilite.",
    cooldown: "5 dk hafif yürüyüş ve esneme.",
    cardioGeneric: "Haftada 2-3 kez düşük-orta yoğunlukta kardiyo.",
    fourWeekProgression: [
      "1. hafta: adaptasyon ve teknik odak.",
      "2. hafta: uygun hareketlerde hafif hacim artışı.",
      "3. hafta: kontrollü zorlanma, form bozulmadan ilerleme.",
      "4. hafta: değerlendirme ve hafif toparlanma/deload.",
    ],
    targetSummaryDefault: "Hedefine uygun dengeli bir program hazırlandı.",
    overviewDefault: "Seviyene ve haftalık zamanına göre dengeli bir plan.",
    strategyDefault: "Dengeli, sürdürülebilir ve protein odaklı beslenme.",
    waterDefault: "Gün içinde düzenli su iç; idman günlerinde ihtiyaca göre artır.",
    genericMealOption: "Dengeli bir öğün seçeneği",
    progressTracking: [
      "Haftada 1 kez aynı koşullarda kilo ve ölçü takibi yap.",
      "Antrenmanda ağırlık/tekrarları not al.",
      "Enerji, uyku ve açlık seviyelerini takip et.",
    ],
    safetyNotes: [
      "Bu program genel bilgilendirme amaçlıdır.",
      "Sakatlık, kronik hastalık, hamilelik veya ağrı varsa uzmana danış.",
      "Aşırı kalori kısıtlamasından veya hızlı değişim hedeflemekten kaçın.",
    ],
    exerciseNotes: {
      squat: "Ayakları omuz genişliğinde aç, core'u sık, kalçayı geriye gönder ve dizleri parmak uçlarıyla aynı hizada tut.",
      row: "Omuzları kulaklardan uzak tut, kürek kemiklerini geriye çek, ağırlığı sallamadan kontrollü indir.",
      push: "Kürek kemiklerini sabitle, dirsekleri yaklaşık 45 derecede tut, göğsü kontrollü indirip nefes vererek it.",
      rdl: "Dizleri hafif kır, sırtı düz tut, kalçayı geriye gönder ve hamstring gerilimini hissedince yukarı kalk.",
      lunge: "Öndeki ayağı yere sağlam bas, diz içeri kaçmasın, gövdeyi dik tutarak kontrollü adım at.",
      plank: "Dirsekleri omuz altında tut, kalçayı düşürme, kaburgaları içeri al ve nefesi düzenli sürdür.",
    },
    nutritionStrategy: "Dengeli, sürdürülebilir ve protein odaklı beslenme; öğünleri kişisel tercihlere göre esnet.",
    nutritionWater: "Gün boyunca düzenli su iç; antrenman günlerinde terleme ve ihtiyaca göre artır.",
    sampleBreakfast: "Yumurta veya yoğurt + yulaf/tam tahıl + meyve",
    sampleLunch: "Tavuk/baklagil/tofu + bulgur/pirinç + salata",
    sampleDinner: "Balık/et/tofu + sebze + hedefe uygun karbonhidrat",
    proteinAlternativesLabel: "Protein alternatifleri",
    carbAlternativesLabel: "Karbonhidrat alternatifleri",
    proteinAlternatives: ["Tavuk", "Yoğurt", "Baklagil", "Tofu"],
    carbAlternatives: ["Bulgur", "Pirinç", "Patates", "Yulaf"],
  },
  en: {
    dayLabel: (n) => `Day ${n}`,
    mealLabel: (n) => `Meal ${n}`,
    breakfast: "Breakfast",
    lunch: "Lunch",
    dinner: "Dinner",
    fullBodyStrength: "Full-body strength",
    conditioningCore: "Conditioning & core",
    exerciseDefault: "Exercise",
    secAbbr: "sec",
    perFoot: "/leg",
    goalOverview: {
      fat_loss: "Fat loss while preserving muscle; strength training leads, cardio supports.",
      muscle_gain: "Compound-movement and progressive-overload focused plan that prioritizes muscle growth.",
      fit_look: "Recomposition-focused plan balancing strength, conditioning, and aesthetics.",
      weight_gain: "Higher-intensity, compound-heavy weight-gain plan that prioritizes recovery.",
      strength: "Strength-focused plan with the main lifts first, low reps and long rest.",
      healthy_eating: "Balanced full-body plan for general health and sustainability.",
    },
    goalCardio: {
      fat_loss: "3-4× per week 30-40 min LISS + 1-2 short HIIT; after training or on a separate day.",
      muscle_gain: "2× per week 20-30 min low-intensity cardio, for heart health only.",
      fit_look: "2-3× per week 25-30 min mixed-pace cardio.",
      weight_gain: "Minimal cardio; 1-2× per week a short, easy walk.",
      strength: "1-2× per week light cardio that won't hurt recovery.",
      healthy_eating: "2-3× per week 25-35 min moderate walk or cycling.",
    },
    warmup: "5-8 min easy pace + dynamic mobility.",
    cooldown: "5 min easy walk and stretching.",
    cardioGeneric: "2-3× per week low-to-moderate intensity cardio.",
    fourWeekProgression: [
      "Week 1: adaptation and technique focus.",
      "Week 2: slight volume increase on suitable movements.",
      "Week 3: controlled effort, progress without breaking form.",
      "Week 4: assessment and a light recovery/deload.",
    ],
    targetSummaryDefault: "A balanced program tailored to your goal has been prepared.",
    overviewDefault: "A balanced plan based on your level and weekly availability.",
    strategyDefault: "Balanced, sustainable, protein-focused nutrition.",
    waterDefault: "Drink water regularly through the day; increase on training days as needed.",
    genericMealOption: "A balanced meal option",
    progressTracking: [
      "Weigh and measure once a week under the same conditions.",
      "Log your weights/reps during training.",
      "Track energy, sleep, and hunger levels.",
    ],
    safetyNotes: [
      "This program is for general information only.",
      "Consult a professional if you have an injury, chronic condition, pregnancy, or pain.",
      "Avoid extreme calorie restriction or chasing rapid change.",
    ],
    exerciseNotes: {
      squat: "Feet shoulder-width, brace your core, push your hips back, and keep your knees tracking over your toes.",
      row: "Keep shoulders away from your ears, pull your shoulder blades back, and lower under control without swinging.",
      push: "Set your shoulder blades, keep elbows around 45°, lower your chest under control and press as you exhale.",
      rdl: "Slightly bend the knees, keep your back flat, push your hips back, and rise when you feel the hamstring stretch.",
      lunge: "Plant the front foot firmly, don't let the knee cave in, and step under control with an upright torso.",
      plank: "Keep elbows under shoulders, don't let your hips drop, tuck your ribs, and breathe steadily.",
    },
    nutritionStrategy: "Balanced, sustainable, protein-focused nutrition; flex meals to your personal preferences.",
    nutritionWater: "Drink water regularly through the day; increase on training days based on sweat and need.",
    sampleBreakfast: "Eggs or yogurt + oats/whole grains + fruit",
    sampleLunch: "Chicken/legumes/tofu + bulgur/rice + salad",
    sampleDinner: "Fish/meat/tofu + vegetables + goal-appropriate carbs",
    proteinAlternativesLabel: "Protein alternatives",
    carbAlternativesLabel: "Carb alternatives",
    proteinAlternatives: ["Chicken", "Yogurt", "Legumes", "Tofu"],
    carbAlternatives: ["Bulgur", "Rice", "Potato", "Oats"],
  },
  de: {
    dayLabel: (n) => `Tag ${n}`,
    mealLabel: (n) => `Mahlzeit ${n}`,
    breakfast: "Frühstück",
    lunch: "Mittagessen",
    dinner: "Abendessen",
    fullBodyStrength: "Ganzkörper-Kraft",
    conditioningCore: "Kondition & Core",
    exerciseDefault: "Übung",
    secAbbr: "Sek.",
    perFoot: "/Bein",
    goalOverview: {
      fat_loss: "Fettabbau bei Muskelerhalt; Krafttraining steht im Vordergrund, Cardio unterstützt.",
      muscle_gain: "Auf Grundübungen und progressive Überlastung ausgerichteter Plan mit Fokus auf Muskelaufbau.",
      fit_look: "Auf Rekomposition ausgerichteter Plan mit Balance aus Kraft, Kondition und Ästhetik.",
      weight_gain: "Intensiverer, grundübungslastiger Aufbauplan mit Fokus auf Regeneration.",
      strength: "Kraftorientierter Plan mit den Hauptübungen zuerst, niedrige Wiederholungen, lange Pausen.",
      healthy_eating: "Ausgewogener Ganzkörperplan für allgemeine Gesundheit und Nachhaltigkeit.",
    },
    goalCardio: {
      fat_loss: "3-4×/Woche 30-40 Min LISS + 1-2 kurze HIIT; nach dem Training oder an einem separaten Tag.",
      muscle_gain: "2×/Woche 20-30 Min Cardio geringer Intensität, nur für die Herzgesundheit.",
      fit_look: "2-3×/Woche 25-30 Min Cardio in gemischtem Tempo.",
      weight_gain: "Minimales Cardio; 1-2×/Woche ein kurzer, lockerer Spaziergang.",
      strength: "1-2×/Woche leichtes Cardio, das die Regeneration nicht stört.",
      healthy_eating: "2-3×/Woche 25-35 Min zügiger Spaziergang oder Radfahren.",
    },
    warmup: "5-8 Min lockeres Tempo + dynamische Mobilität.",
    cooldown: "5 Min lockeres Gehen und Dehnen.",
    cardioGeneric: "2-3×/Woche Cardio mit niedriger bis mittlerer Intensität.",
    fourWeekProgression: [
      "Woche 1: Anpassung und Technikfokus.",
      "Woche 2: leichte Volumensteigerung bei geeigneten Übungen.",
      "Woche 3: kontrollierte Belastung, Fortschritt ohne Formverlust.",
      "Woche 4: Auswertung und leichte Erholung/Deload.",
    ],
    targetSummaryDefault: "Ein ausgewogenes, auf dein Ziel zugeschnittenes Programm wurde erstellt.",
    overviewDefault: "Ein ausgewogener Plan nach deinem Niveau und deiner wöchentlichen Zeit.",
    strategyDefault: "Ausgewogene, nachhaltige, proteinbetonte Ernährung.",
    waterDefault: "Trinke über den Tag regelmäßig Wasser; an Trainingstagen nach Bedarf mehr.",
    genericMealOption: "Eine ausgewogene Mahlzeitoption",
    progressTracking: [
      "Wiege und miss dich einmal pro Woche unter gleichen Bedingungen.",
      "Notiere deine Gewichte/Wiederholungen im Training.",
      "Verfolge Energie, Schlaf und Hungergefühl.",
    ],
    safetyNotes: [
      "Dieses Programm dient nur der allgemeinen Information.",
      "Konsultiere bei Verletzung, chronischer Erkrankung, Schwangerschaft oder Schmerzen eine Fachkraft.",
      "Vermeide extreme Kalorienrestriktion oder das Anstreben schneller Veränderungen.",
    ],
    exerciseNotes: {
      squat: "Füße schulterbreit, Core anspannen, Hüfte nach hinten schieben und Knie über den Zehen führen.",
      row: "Schultern weg von den Ohren, Schulterblätter zurückziehen und das Gewicht kontrolliert ohne Schwung senken.",
      push: "Schulterblätter fixieren, Ellbogen etwa 45° halten, Brust kontrolliert senken und beim Ausatmen drücken.",
      rdl: "Knie leicht beugen, Rücken gerade, Hüfte nach hinten schieben und aufrichten, wenn du die Hamstrings spürst.",
      lunge: "Vorderen Fuß fest aufsetzen, Knie nicht nach innen fallen lassen und mit aufrechtem Oberkörper kontrolliert ausschreiten.",
      plank: "Ellbogen unter den Schultern, Hüfte nicht absinken lassen, Rippen einziehen und gleichmäßig atmen.",
    },
    nutritionStrategy: "Ausgewogene, nachhaltige, proteinbetonte Ernährung; passe die Mahlzeiten an deine Vorlieben an.",
    nutritionWater: "Trinke über den Tag regelmäßig Wasser; an Trainingstagen je nach Schwitzen und Bedarf mehr.",
    sampleBreakfast: "Eier oder Joghurt + Haferflocken/Vollkorn + Obst",
    sampleLunch: "Hähnchen/Hülsenfrüchte/Tofu + Bulgur/Reis + Salat",
    sampleDinner: "Fisch/Fleisch/Tofu + Gemüse + zielgerechte Kohlenhydrate",
    proteinAlternativesLabel: "Protein-Alternativen",
    carbAlternativesLabel: "Kohlenhydrat-Alternativen",
    proteinAlternatives: ["Hähnchen", "Joghurt", "Hülsenfrüchte", "Tofu"],
    carbAlternatives: ["Bulgur", "Reis", "Kartoffel", "Haferflocken"],
  },
  fr: {
    dayLabel: (n) => `Jour ${n}`,
    mealLabel: (n) => `Repas ${n}`,
    breakfast: "Petit-déjeuner",
    lunch: "Déjeuner",
    dinner: "Dîner",
    fullBodyStrength: "Force full-body",
    conditioningCore: "Cardio & gainage",
    exerciseDefault: "Exercice",
    secAbbr: "s",
    perFoot: "/jambe",
    goalOverview: {
      fat_loss: "Perte de gras en préservant le muscle ; la musculation prime, le cardio soutient.",
      muscle_gain: "Plan axé sur les mouvements composés et la surcharge progressive, priorisant la prise de muscle.",
      fit_look: "Plan axé recomposition, équilibrant force, condition et esthétique.",
      weight_gain: "Plan de prise de poids plus intense, riche en mouvements composés, priorisant la récupération.",
      strength: "Plan axé force avec les mouvements principaux d'abord, peu de répétitions, longue récupération.",
      healthy_eating: "Plan full-body équilibré pour la santé générale et la durabilité.",
    },
    goalCardio: {
      fat_loss: "3-4×/semaine 30-40 min LISS + 1-2 HIIT courts ; après l'entraînement ou un jour séparé.",
      muscle_gain: "2×/semaine 20-30 min de cardio léger, uniquement pour la santé cardiaque.",
      fit_look: "2-3×/semaine 25-30 min de cardio à allure variée.",
      weight_gain: "Cardio minimal ; 1-2×/semaine une marche courte et tranquille.",
      strength: "1-2×/semaine cardio léger sans nuire à la récupération.",
      healthy_eating: "2-3×/semaine 25-35 min de marche modérée ou vélo.",
    },
    warmup: "5-8 min d'allure légère + mobilité dynamique.",
    cooldown: "5 min de marche légère et d'étirements.",
    cardioGeneric: "2-3×/semaine cardio d'intensité faible à modérée.",
    fourWeekProgression: [
      "Semaine 1 : adaptation et focus technique.",
      "Semaine 2 : légère hausse de volume sur les mouvements adaptés.",
      "Semaine 3 : effort contrôlé, progresser sans casser la forme.",
      "Semaine 4 : évaluation et légère récupération/deload.",
    ],
    targetSummaryDefault: "Un programme équilibré adapté à ton objectif a été préparé.",
    overviewDefault: "Un plan équilibré selon ton niveau et ta disponibilité hebdomadaire.",
    strategyDefault: "Alimentation équilibrée, durable et axée sur les protéines.",
    waterDefault: "Bois de l'eau régulièrement dans la journée ; augmente les jours d'entraînement.",
    genericMealOption: "Une option de repas équilibrée",
    progressTracking: [
      "Pèse-toi et mesure-toi une fois par semaine dans les mêmes conditions.",
      "Note tes charges/répétitions à l'entraînement.",
      "Suis ton énergie, ton sommeil et ta faim.",
    ],
    safetyNotes: [
      "Ce programme est fourni à titre informatif uniquement.",
      "Consulte un professionnel en cas de blessure, maladie chronique, grossesse ou douleur.",
      "Évite une restriction calorique extrême ou la recherche de changements rapides.",
    ],
    exerciseNotes: {
      squat: "Pieds largeur d'épaules, gaine le tronc, pousse les hanches vers l'arrière et garde les genoux alignés avec les orteils.",
      row: "Garde les épaules loin des oreilles, ramène les omoplates et descends la charge sous contrôle sans balancer.",
      push: "Fixe les omoplates, garde les coudes vers 45°, descends la poitrine sous contrôle et pousse en expirant.",
      rdl: "Fléchis légèrement les genoux, dos plat, pousse les hanches en arrière et remonte en sentant l'étirement des ischios.",
      lunge: "Ancre bien le pied avant, ne laisse pas le genou rentrer et avance sous contrôle, buste droit.",
      plank: "Coudes sous les épaules, ne laisse pas tomber les hanches, rentre les côtes et respire régulièrement.",
    },
    nutritionStrategy: "Alimentation équilibrée, durable et axée protéines ; adapte les repas à tes préférences.",
    nutritionWater: "Bois de l'eau régulièrement ; augmente les jours d'entraînement selon la transpiration et le besoin.",
    sampleBreakfast: "Œufs ou yaourt + flocons d'avoine/céréales complètes + fruit",
    sampleLunch: "Poulet/légumineuses/tofu + boulgour/riz + salade",
    sampleDinner: "Poisson/viande/tofu + légumes + glucides adaptés à l'objectif",
    proteinAlternativesLabel: "Alternatives protéinées",
    carbAlternativesLabel: "Alternatives glucidiques",
    proteinAlternatives: ["Poulet", "Yaourt", "Légumineuses", "Tofu"],
    carbAlternatives: ["Boulgour", "Riz", "Pomme de terre", "Flocons d'avoine"],
  },
  es: {
    dayLabel: (n) => `Día ${n}`,
    mealLabel: (n) => `Comida ${n}`,
    breakfast: "Desayuno",
    lunch: "Almuerzo",
    dinner: "Cena",
    fullBodyStrength: "Fuerza full-body",
    conditioningCore: "Acondicionamiento y core",
    exerciseDefault: "Ejercicio",
    secAbbr: "s",
    perFoot: "/pierna",
    goalOverview: {
      fat_loss: "Pérdida de grasa preservando músculo; el entrenamiento de fuerza manda y el cardio apoya.",
      muscle_gain: "Plan centrado en movimientos compuestos y sobrecarga progresiva que prioriza la ganancia muscular.",
      fit_look: "Plan centrado en la recomposición que equilibra fuerza, acondicionamiento y estética.",
      weight_gain: "Plan de aumento de peso más intenso, con muchos compuestos, que prioriza la recuperación.",
      strength: "Plan centrado en la fuerza con los levantamientos principales primero, pocas reps y descanso largo.",
      healthy_eating: "Plan full-body equilibrado para la salud general y la sostenibilidad.",
    },
    goalCardio: {
      fat_loss: "3-4×/semana 30-40 min LISS + 1-2 HIIT cortos; tras entrenar o en un día aparte.",
      muscle_gain: "2×/semana 20-30 min de cardio de baja intensidad, solo por salud cardiaca.",
      fit_look: "2-3×/semana 25-30 min de cardio a ritmo variado.",
      weight_gain: "Cardio mínimo; 1-2×/semana una caminata corta y suave.",
      strength: "1-2×/semana cardio ligero que no perjudique la recuperación.",
      healthy_eating: "2-3×/semana 25-35 min de caminata moderada o bici.",
    },
    warmup: "5-8 min de ritmo suave + movilidad dinámica.",
    cooldown: "5 min de caminata ligera y estiramientos.",
    cardioGeneric: "2-3×/semana cardio de intensidad baja a moderada.",
    fourWeekProgression: [
      "Semana 1: adaptación y foco en la técnica.",
      "Semana 2: ligero aumento de volumen en los movimientos adecuados.",
      "Semana 3: esfuerzo controlado, progresar sin romper la forma.",
      "Semana 4: evaluación y una recuperación/deload ligera.",
    ],
    targetSummaryDefault: "Se ha preparado un programa equilibrado adaptado a tu objetivo.",
    overviewDefault: "Un plan equilibrado según tu nivel y tu disponibilidad semanal.",
    strategyDefault: "Alimentación equilibrada, sostenible y centrada en la proteína.",
    waterDefault: "Bebe agua con regularidad durante el día; auméntala los días de entrenamiento.",
    genericMealOption: "Una opción de comida equilibrada",
    progressTracking: [
      "Pésate y mídete una vez por semana en las mismas condiciones.",
      "Anota tus pesos/repeticiones en el entrenamiento.",
      "Controla la energía, el sueño y el hambre.",
    ],
    safetyNotes: [
      "Este programa es solo informativo.",
      "Consulta a un profesional si tienes una lesión, enfermedad crónica, embarazo o dolor.",
      "Evita la restricción calórica extrema o buscar cambios rápidos.",
    ],
    exerciseNotes: {
      squat: "Pies a la anchura de los hombros, aprieta el core, lleva la cadera atrás y mantén las rodillas alineadas con los dedos.",
      row: "Mantén los hombros lejos de las orejas, junta las escápulas y baja el peso controlado sin balanceo.",
      push: "Fija las escápulas, mantén los codos a unos 45°, baja el pecho controlado y empuja al exhalar.",
      rdl: "Flexiona un poco las rodillas, espalda recta, lleva la cadera atrás y sube al sentir el estiramiento del isquio.",
      lunge: "Apoya firme el pie adelantado, que la rodilla no se hunda y avanza controlado con el torso erguido.",
      plank: "Codos bajo los hombros, no dejes caer la cadera, mete las costillas y respira de forma constante.",
    },
    nutritionStrategy: "Alimentación equilibrada, sostenible y centrada en la proteína; adapta las comidas a tus gustos.",
    nutritionWater: "Bebe agua con regularidad; auméntala los días de entrenamiento según el sudor y la necesidad.",
    sampleBreakfast: "Huevos o yogur + avena/cereales integrales + fruta",
    sampleLunch: "Pollo/legumbres/tofu + bulgur/arroz + ensalada",
    sampleDinner: "Pescado/carne/tofu + verduras + carbohidratos según el objetivo",
    proteinAlternativesLabel: "Alternativas de proteína",
    carbAlternativesLabel: "Alternativas de carbohidrato",
    proteinAlternatives: ["Pollo", "Yogur", "Legumbres", "Tofu"],
    carbAlternatives: ["Bulgur", "Arroz", "Patata", "Avena"],
  },
  it: {
    dayLabel: (n) => `Giorno ${n}`,
    mealLabel: (n) => `Pasto ${n}`,
    breakfast: "Colazione",
    lunch: "Pranzo",
    dinner: "Cena",
    fullBodyStrength: "Forza full-body",
    conditioningCore: "Condizionamento e core",
    exerciseDefault: "Esercizio",
    secAbbr: "s",
    perFoot: "/gamba",
    goalOverview: {
      fat_loss: "Perdita di grasso preservando il muscolo; l'allenamento di forza guida, il cardio supporta.",
      muscle_gain: "Piano incentrato su movimenti composti e sovraccarico progressivo che prioritizza la crescita muscolare.",
      fit_look: "Piano incentrato sulla ricomposizione che bilancia forza, condizionamento ed estetica.",
      weight_gain: "Piano di aumento peso più intenso, ricco di composti, che prioritizza il recupero.",
      strength: "Piano incentrato sulla forza con i sollevamenti principali per primi, poche ripetizioni e recupero lungo.",
      healthy_eating: "Piano full-body equilibrato per la salute generale e la sostenibilità.",
    },
    goalCardio: {
      fat_loss: "3-4×/settimana 30-40 min LISS + 1-2 HIIT brevi; dopo l'allenamento o in un giorno separato.",
      muscle_gain: "2×/settimana 20-30 min di cardio a bassa intensità, solo per la salute del cuore.",
      fit_look: "2-3×/settimana 25-30 min di cardio a ritmo misto.",
      weight_gain: "Cardio minimo; 1-2×/settimana una camminata breve e tranquilla.",
      strength: "1-2×/settimana cardio leggero che non comprometta il recupero.",
      healthy_eating: "2-3×/settimana 25-35 min di camminata moderata o bici.",
    },
    warmup: "5-8 min di ritmo leggero + mobilità dinamica.",
    cooldown: "5 min di camminata leggera e stretching.",
    cardioGeneric: "2-3×/settimana cardio a intensità medio-bassa.",
    fourWeekProgression: [
      "Settimana 1: adattamento e focus sulla tecnica.",
      "Settimana 2: leggero aumento del volume sui movimenti adatti.",
      "Settimana 3: sforzo controllato, progredire senza rompere la forma.",
      "Settimana 4: valutazione e un leggero recupero/deload.",
    ],
    targetSummaryDefault: "È stato preparato un programma equilibrato adatto al tuo obiettivo.",
    overviewDefault: "Un piano equilibrato in base al tuo livello e al tempo settimanale.",
    strategyDefault: "Alimentazione equilibrata, sostenibile e incentrata sulle proteine.",
    waterDefault: "Bevi acqua regolarmente durante la giornata; aumenta nei giorni di allenamento.",
    genericMealOption: "Un'opzione di pasto equilibrata",
    progressTracking: [
      "Pesati e misurati una volta a settimana nelle stesse condizioni.",
      "Annota i carichi/ripetizioni durante l'allenamento.",
      "Monitora energia, sonno e fame.",
    ],
    safetyNotes: [
      "Questo programma è solo a scopo informativo.",
      "Consulta un professionista in caso di infortunio, malattia cronica, gravidanza o dolore.",
      "Evita restrizioni caloriche estreme o di puntare a cambiamenti rapidi.",
    ],
    exerciseNotes: {
      squat: "Piedi alla larghezza delle spalle, attiva il core, spingi i fianchi indietro e tieni le ginocchia allineate alle punte.",
      row: "Tieni le spalle lontane dalle orecchie, ritrai le scapole e abbassa il peso controllato senza slanci.",
      push: "Fissa le scapole, tieni i gomiti a circa 45°, abbassa il petto controllato e spingi espirando.",
      rdl: "Piega leggermente le ginocchia, schiena dritta, spingi i fianchi indietro e risali sentendo l'allungo dei femorali.",
      lunge: "Appoggia bene il piede avanti, non far cedere il ginocchio e avanza controllato col busto eretto.",
      plank: "Gomiti sotto le spalle, non far cadere i fianchi, ritrai le costole e respira in modo costante.",
    },
    nutritionStrategy: "Alimentazione equilibrata, sostenibile e proteica; adatta i pasti alle tue preferenze.",
    nutritionWater: "Bevi acqua regolarmente; aumenta nei giorni di allenamento in base a sudore ed esigenze.",
    sampleBreakfast: "Uova o yogurt + avena/cereali integrali + frutta",
    sampleLunch: "Pollo/legumi/tofu + bulgur/riso + insalata",
    sampleDinner: "Pesce/carne/tofu + verdure + carboidrati adatti all'obiettivo",
    proteinAlternativesLabel: "Alternative proteiche",
    carbAlternativesLabel: "Alternative di carboidrati",
    proteinAlternatives: ["Pollo", "Yogurt", "Legumi", "Tofu"],
    carbAlternatives: ["Bulgur", "Riso", "Patata", "Avena"],
  },
};

export function getProgramMessages(locale?: string): ProgramMessages {
  return PROGRAM[pick(locale)];
}
