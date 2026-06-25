import type { MealType } from "./types";

const LANGUAGE_NAMES: Record<string, string> = {
  tr: "Turkish",
  en: "English",
  de: "German",
  fr: "French",
  es: "Spanish",
  it: "Italian",
};

interface SchemaLabels {
  mealName: string;
  foodName: string;
  reasoning: string;
  cookingMethod: string;
  portionDescription: string;
  portionNotes: string;
  questionText: string;
  warning: string;
  overallPortion: string;
  accuracyNote: string;
  noFoodMessage: string;
}

interface LocaleHints {
  /** Full language name used in "Use X for all user-facing strings". */
  language: string;
  /** Portion-norm phrase injected into both prompts (cuisine context). */
  portionNorms: string;
  /** Count-first portion examples, tuned to the locale's cuisine. */
  countExamples: string;
  /** Local market/grocery + regional dish context so the model recognizes
   *  the foods and packaged products the user actually buys and eats. */
  marketContext: string;
  /** Native-language JSON schema hint labels. */
  labels: SchemaLabels;
}

// Per-locale guidance so every language gets the same depth Turkish has:
// native schema labels, native cooking-method vocabulary, and cuisine-specific
// portion norms. Zero extra API cost — it only shapes the single prompt we
// already send.
const LOCALE_HINTS: Record<string, LocaleHints> = {
  tr: {
    language: "Turkish",
    portionNorms: "Turkish and international portion norms",
    countExamples:
      "yumurta ~50g, köfte ~50-70g, dolma/sarma ~35-50g, ekmek dilimi ~25-35g, simit ~100-120g, baklava dilimi ~50-70g, pide dilimi ~60-90g, mantı porsiyonu ~250-350g, lahmacun ~120-150g, döner porsiyon ~150-250g, menemen ~250-300g, ayran ~200-300ml, çiğ köfte ~40-60g/top, pilav porsiyonu ~150-200g",
    marketContext:
      "Türk marketleri (BİM, A101, ŞOK, Migros, CarrefourSA) ve yerel ürünler: Pınar/Sütaş/İçim süt-yoğurt-ayran, beyaz peynir/kaşar, sucuk/pastırma, simit, poğaça, börek, lahmacun, pide, döner, mantı, menemen, çiğ köfte, mercimek çorbası, baklava/künefe, Türk kahvesi, Eti/Ülker bisküvi ve çikolataları, tahin-pekmez.",
    labels: {
      mealName: "Kısa öğün adı",
      foodName: "Pişirme yöntemiyle spesifik besin adı",
      reasoning: "Kısa görsel kanıt ve porsiyon gerekçesi",
      cookingMethod: "ızgara|tava|fırın|haşlama|kızartma|çiğ|buharda|kavurma|sade",
      portionDescription: "Doğal porsiyon açıklaması",
      portionNotes: "Yenebilir kısım/yağ/etiket varsayımları",
      questionText: "Soru metni",
      warning: "Kısa belirsizlik uyarısı",
      overallPortion: "Genel porsiyon varsayımları",
      accuracyNote: "AI tahminidir; gramajı düzenleyerek doğruluğu artırabilirsiniz.",
      noFoodMessage:
        "Bu görselde yiyecek tespit edilemedi. Lütfen öğününüzün net bir fotoğrafını çekin.",
    },
  },
  en: {
    language: "English",
    portionNorms: "international/Western (US/UK) portion norms",
    countExamples:
      "egg ~50g, bread slice ~25-35g, burger patty ~110-150g, sandwich ~150-250g, cookie ~25-35g, bacon strip ~8-12g, chicken breast ~150-200g, pancake ~40-60g, bagel ~95-110g, slice of pizza ~110-140g, fries serving ~115-150g, oatmeal bowl ~250g, protein bar ~50-60g",
    marketContext:
      "Western supermarkets (Walmart, Kroger, Costco, Tesco, Sainsbury's) and common products: peanut butter, breakfast cereal, deli/sliced meats, cheddar, Greek yogurt, granola bars, bagels, burgers, fries, mac & cheese, smoothies, rotisserie chicken, ranch/BBQ sauces, brands like Quaker, Kellogg's, Heinz, Chobani.",
    labels: {
      mealName: "Short meal name",
      foodName: "Specific food name with cooking method",
      reasoning: "Brief visual evidence and portion rationale",
      cookingMethod: "grilled|pan-fried|baked|boiled|deep-fried|raw|steamed|sauteed|plain",
      portionDescription: "Natural portion description",
      portionNotes: "Important edible/oil/label assumptions",
      questionText: "Question text",
      warning: "Short uncertainty warning",
      overallPortion: "Overall portion assumptions",
      accuracyNote: "AI estimate; edit grams for better accuracy.",
      noFoodMessage:
        "No food was detected in this image. Please take a clear photo of your meal.",
    },
  },
  de: {
    language: "German",
    portionNorms: "German and Central-European portion norms",
    countExamples:
      "Ei ~50g, Brotscheibe ~40-50g, Schnitzel ~120-180g, Bratwurst ~100-150g, Brötchen ~50-60g, Brezel ~80-120g, Frikadelle ~60-90g, Currywurst ~150g, Spätzle-Portion ~200-250g, Leberkäse-Scheibe ~120-150g, Kartoffelsalat ~200g, Müsli-Schale ~60-80g, Quark ~150-250g, Döner ~350-450g",
    marketContext:
      "Deutsche Supermärkte (Aldi, Lidl, Edeka, Rewe, Kaufland) und typische Produkte: Vollkornbrot/Brötchen, Wurst (Bratwurst, Leberkäse, Currywurst), Quark, Müsli, Schnitzel, Brezel, Spätzle, Kartoffelsalat, Käse (Gouda, Emmentaler), Müller-Milchprodukte, Haribo, Marken wie Dr. Oetker, Milka, Knorr.",
    labels: {
      mealName: "Kurzer Mahlzeitname",
      foodName: "Spezifischer Lebensmittelname mit Zubereitungsart",
      reasoning: "Kurze visuelle Belege und Portionsbegründung",
      cookingMethod: "gegrillt|gebraten|gebacken|gekocht|frittiert|roh|gedämpft|sautiert|natur",
      portionDescription: "Natürliche Portionsbeschreibung",
      portionNotes: "Wichtige Annahmen zu essbarem Anteil/Öl/Etikett",
      questionText: "Fragetext",
      warning: "Kurze Unsicherheitswarnung",
      overallPortion: "Allgemeine Portionsannahmen",
      accuracyNote: "KI-Schätzung; bearbeite die Gramm für mehr Genauigkeit.",
      noFoodMessage:
        "Auf diesem Bild wurde kein Essen erkannt. Bitte mach ein klares Foto deiner Mahlzeit.",
    },
  },
  fr: {
    language: "French",
    portionNorms: "French and Western-European portion norms",
    countExamples:
      "œuf ~50g, tranche de baguette ~25-30g, croissant ~55-70g, steak ~150g, crêpe ~70-90g, portion de fromage ~30-40g, quiche part ~120-150g",
    marketContext:
      "Supermarchés français (Carrefour, Leclerc, Auchan, Intermarché, Lidl) et produits typiques: baguette, croissant, pain au chocolat, fromages (camembert, brie, comté, roquefort), yaourt, charcuterie (jambon, saucisson), quiche, ratatouille, steak-frites, croque-monsieur, crêpes, marques comme Danone, Président, Bonne Maman.",
    labels: {
      mealName: "Nom court du repas",
      foodName: "Nom précis de l'aliment avec mode de cuisson",
      reasoning: "Brèves preuves visuelles et justification de la portion",
      cookingMethod: "grillé|poêlé|au four|bouilli|frit|cru|vapeur|sauté|nature",
      portionDescription: "Description naturelle de la portion",
      portionNotes: "Hypothèses importantes sur la partie comestible/l'huile/l'étiquette",
      questionText: "Texte de la question",
      warning: "Bref avertissement d'incertitude",
      overallPortion: "Hypothèses générales sur les portions",
      accuracyNote: "Estimation IA ; modifiez les grammes pour plus de précision.",
      noFoodMessage:
        "Aucun aliment n'a été détecté sur cette image. Veuillez prendre une photo nette de votre repas.",
    },
  },
  es: {
    language: "Spanish",
    portionNorms: "Spanish and Mediterranean portion norms",
    countExamples:
      "huevo ~50g, rebanada de pan ~25-35g, porción de tortilla de patatas ~120g, croqueta ~30-40g, loncha de jamón ~20-30g, tapa ~60-100g, paella ración ~250g",
    marketContext:
      "Supermercados españoles (Mercadona, Carrefour, Día, Lidl, Alcampo) y productos típicos: jamón serrano/ibérico, tortilla de patatas, pan, aceite de oliva, queso manchego, paella, croquetas, gazpacho, churros, embutidos (chorizo, salchichón), bocadillo, marcas como Hacendado, Central Lechera Asturiana, Gallo.",
    labels: {
      mealName: "Nombre corto de la comida",
      foodName: "Nombre específico del alimento con método de cocción",
      reasoning: "Breve evidencia visual y justificación de la porción",
      cookingMethod: "a la parrilla|salteado|al horno|hervido|frito|crudo|al vapor|rehogado|natural",
      portionDescription: "Descripción natural de la porción",
      portionNotes: "Suposiciones importantes sobre parte comestible/aceite/etiqueta",
      questionText: "Texto de la pregunta",
      warning: "Breve advertencia de incertidumbre",
      overallPortion: "Suposiciones generales sobre las porciones",
      accuracyNote: "Estimación de IA; edita los gramos para mayor precisión.",
      noFoodMessage:
        "No se detectó ningún alimento en esta imagen. Toma una foto clara de tu comida.",
    },
  },
  it: {
    language: "Italian",
    portionNorms: "Italian and Mediterranean portion norms",
    countExamples:
      "uovo ~50g, fetta di pane ~25-35g, fetta di pizza ~120-150g, porzione di pasta ~200-250g cotta, mozzarella ~50-125g, risotto ~200g, panino ~150-250g",
    marketContext:
      "Supermercati italiani (Esselunga, Coop, Conad, Lidl, Carrefour) e prodotti tipici: pasta, pane, mozzarella, parmigiano, prosciutto (crudo/cotto), pizza, risotto, pesto, espresso, olio d'oliva, salumi, focaccia, lasagne, marche come Barilla, Mulino Bianco, Galbani, Mutti.",
    labels: {
      mealName: "Nome breve del pasto",
      foodName: "Nome specifico dell'alimento con metodo di cottura",
      reasoning: "Breve evidenza visiva e motivazione della porzione",
      cookingMethod: "alla griglia|in padella|al forno|bollito|fritto|crudo|al vapore|saltato|naturale",
      portionDescription: "Descrizione naturale della porzione",
      portionNotes: "Ipotesi importanti su parte commestibile/olio/etichetta",
      questionText: "Testo della domanda",
      warning: "Breve avviso di incertezza",
      overallPortion: "Ipotesi generali sulle porzioni",
      accuracyNote: "Stima IA; modifica i grammi per maggiore precisione.",
      noFoodMessage:
        "Nessun alimento rilevato in questa immagine. Scatta una foto nitida del tuo pasto.",
    },
  },
};

function getHints(locale?: string): LocaleHints {
  return LOCALE_HINTS[locale ?? "tr"] ?? LOCALE_HINTS.en;
}

/**
 * Localized accuracy disclaimer. Supplied server-side instead of asking the
 * model to echo a constant string — saves output tokens (faster scans).
 */
export function getAccuracyNote(locale?: string): string {
  return getHints(locale).labels.accuracyNote;
}

export function buildSystemPrompt(locale?: string): string {
  // Output language follows the user's locale; default Turkish (legacy default).
  const h = getHints(locale);
  const language = LANGUAGE_NAMES[locale ?? "tr"] ?? h.language;
  const L = h.labels;

  return `You are CalorAI, Makrofy's visual nutrition estimator.

Return ONLY valid JSON. No markdown, no extra text.
Use ${language} for all user-facing strings.

Mission:
- Identify visible foods and estimate edible grams, calories, protein, carbs, fat, fiber.
- Be useful but conservative: visual nutrition is approximate. Prefer a 10-20% under-estimate over an over-estimate.
- Never invent foods that are not visually clear.

Core workflow:
1. Scene: detect camera angle, plate/bowl size, reference objects, lighting, hidden/partial foods.
2. Food ID: name foods specifically, including cooking method when visible.
3. Portion: estimate edible grams using plate coverage, count, bowl/plate size, and known household portions.
4. Nutrition: scale realistic per-100g nutrition values to grams.
5. Validate: item calories must roughly equal protein*4 + carbs*4 + fat*9. Totals must equal item sums.

Anti-hallucination:
- Do not call white/beige food rice/chicken unless grains/meat texture is visible.
- Creamy bowls may be yogurt, pudding, overnight oats, chia, dessert, or smoothie bowls.
- If unsure, choose the visible texture category, lower confidence, and ask a clarification question.
- If no food, package, or nutrition label is visible, return no_food_detected JSON.

Packaged food / label mode:
- If a package, wrapper, bottle, can, yogurt cup, protein bar, or nutrition table is visible, treat it as valid food.
- If nutrition facts are readable, OCR the label and use label values, not memory.
- Read whether values are per 100g/ml, per serving, or per package.
- If per 100g/ml and net weight is visible, multiply by package grams/ml.
- Set confidence high only when label values are actually read.
- If front label is visible but nutrition facts are not, use exact brand + product + flavor/variant/fat% when readable; confidence medium/low and warn that label photo improves accuracy.
- Never claim "label values used" unless you read them.

Portion rules:
- Use edible grams for macros. Exclude bone, shell, peel, pits.
- Apply conservative caps unless clear visual evidence exceeds them:
  rice/pasta 100-150g, chicken 100-150g edible, meat 120-180g, soup 200-300ml, salad 60-150g, bread 25-80g.
- For bone-in chicken, one normal piece is usually 100-140g edible; 180g+ needs clear size evidence or multiple pieces.
- Assume ${h.portionNorms}. Count items first when possible: ${h.countExamples}.
- If no reliable reference object is visible, reduce visual gram estimate by about 25%.
- Restaurant portions can be larger only if the scene clearly looks commercial/restaurant.

Local market & cuisine context (use to recognize regional foods, brands, and packaged products):
- ${h.marketContext}
- Prefer locally common dish/brand names when identifying foods so the output feels native to the user's region.

Oil, sauce, and hidden calories:
- Count visible oil, butter, sauces, bread, drinks, cheese, nuts, toppings, and dressing.
- If oil is visible: slight sheen 1-3g fat, glistening 5-10g, pooling 10-20g.
- If oil/sauce is not visible, do not add it silently. Add a warning if it may exist.
- Composite dishes should be estimated as components when helpful: e.g. manti = dough + meat + yogurt + butter sauce.

Realistic nutrition anchors:
- Plain cooked rice/pasta: 1.1-1.6 kcal/g. Oily rice/pasta: 1.5-2.1 kcal/g.
- Grilled lean chicken/fish: 1.3-1.9 kcal/g. Fatty/fried meat: 2.0-3.2 kcal/g.
- Bread/pastry: 2.4-4.0 kcal/g. Nuts/oils: very calorie dense.
- Raw vegetables/salad without dressing: low calorie. Dressing/oil changes it heavily.
- Milk/yogurt desserts and creamy bowls are often 1.0-2.2 kcal/g depending on sugar/nuts.
- If any item's kcal/g is implausible for its category, recalculate.

Confidence:
- high: clear food + reliable portion/reference or user-provided grams/label.
- medium: likely food but portion/cooking method uncertain.
- low: ambiguous food, hidden ingredients likely, or poor image.

Clarification questions when useful:
- ambiguous food/cooking method, uncertain portion, hidden sauce/oil/cheese, sweetened drink, partial package consumed.

JSON schema — return COMPACT, MINIFIED JSON (one line, no indentation, no extra spaces):
{
  "mealName": "${L.mealName}",
  "totalNutrition": { "calories": 0, "protein": 0, "carbs": 0, "fat": 0, "fiber": 0 },
  "confidence": "low|medium|high",
  "confidenceScore": 0.0,
  "suggestedMealType": "breakfast|lunch|dinner|snack",
  "items": [
    {
      "foodName": "${L.foodName}",
      "grams": 0,
      "calories": 0,
      "protein": 0,
      "carbs": 0,
      "fat": 0,
      "fiber": 0,
      "confidence": "low|medium|high",
      "reasoning": "${L.reasoning}",
      "cookingMethod": "${L.cookingMethod}",
      "portionDescription": "${L.portionDescription}"
    }
  ],
  "warnings": ["${L.warning}"]
}

Field rules (speed matters — be terse, do NOT pad text):
- grams is the edible/trackable amount used for macros (exclude bone, shell, peel, pits).
- reasoning: max 8 words. portionDescription: max 6 words. No filler, no restating the food name.
- cookingMethod: one word from the list. Omit if plain/unknown.
- totalNutrition must equal rounded item sums.
- warnings: only include real ones (hidden oil/sauce, big uncertainty). Return [] if none. Each ≤ 10 words.
- Output the minified JSON object only — nothing before or after it.

No food JSON:
{
  "error": "no_food_detected",
  "message": "${L.noFoodMessage}"
}`;
}

export function buildUserPrompt(
  mealTypeHint?: MealType,
  gramNotes?: string,
  locale?: string
): string {
  const h = getHints(locale);
  let msg = `Analyze this meal photo and return only the required minified JSON.

Checklist:
- Identify every visible food, drink, sauce, oil, bread, topping, and package/label.
- Use conservative edible grams and realistic ${h.portionNorms}.
- If a nutrition label is visible, OCR and use label values exactly.
- Do not add invisible oil/sauce; warn instead.
- Validate item calories with macros and make totals equal item sums.
- Keep all text fields terse. Output compact JSON only.`;

  if (gramNotes && gramNotes.trim()) {
    msg += `

User portion/label notes: "${gramNotes.trim()}"
- Use user-provided grams/portions exactly for mentioned items.
- If user provides label macros, use those values over generic estimates.
- Set confidence high for items with clear user grams or label values.`;
  }

  if (mealTypeHint) {
    msg += `\nMeal type hint: ${mealTypeHint}.`;
  }

  return msg;
}
