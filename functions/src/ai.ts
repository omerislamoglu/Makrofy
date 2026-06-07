import { defineSecret } from "firebase-functions/params";
import { buildSystemPrompt, buildUserPrompt } from "./prompt";
import type {
  AIAnalysisResult,
  AnalysisItem,
  ClarificationQuestion,
  MealType,
  MacroNutrients,
} from "./types";

// ─── Configuration ─────────────────────────────────────────────────────────
//
// Set the API key via:
//   firebase functions:secrets:set AI_VISION_API_KEY
//
// Supported providers: "openai" | "gemini" | "anthropic" | "mock"

const aiApiKey = defineSecret("AI_VISION_API_KEY");

const USE_MOCK = process.env.AI_PROVIDER === "mock";

const MODEL_VERSION_MAP: Record<string, string> = {
  openai: "gpt-4o",
  gemini: "gemini-2.5-flash",
  anthropic: "claude-sonnet-4-5",
  mock: "mock-v1",
};

// ─── Public API ────────────────────────────────────────────────────────────

/**
 * Analyze a meal image and return structured nutritional data.
 *
 * Uses the configured AI provider. Mock data is returned only when
 * AI_PROVIDER is explicitly set to "mock".
 */
export async function analyzeWithAI(
  imageUrl: string,
  mealTypeHint?: MealType,
  gramNotes?: string
): Promise<AIAnalysisResult> {
  if (USE_MOCK) {
    return mockAnalysis(mealTypeHint);
  }

  return realAnalysis(imageUrl, mealTypeHint, gramNotes);
}

// Re-export the secret so index.ts can declare it in runWith().
export { aiApiKey };

// ─── Real AI implementation ────────────────────────────────────────────────

async function realAnalysis(
  imageUrl: string,
  mealTypeHint?: MealType,
  gramNotes?: string
): Promise<AIAnalysisResult> {
  const provider = process.env.AI_PROVIDER ?? "openai";

  // Resolve API key: prefer AI_VISION_API_KEY secret, fallback to env
  const apiKey = aiApiKey.value() || process.env.OPENAI_API_KEY || process.env.AI_VISION_API_KEY;

  console.log("[AI_PROVIDER]", {
    provider,
    hasApiKey: !!apiKey,
    keyPrefix: apiKey ? apiKey.slice(0, 7) : null,
    imageIsDataUrl: imageUrl.startsWith("data:"),
    imageLength: imageUrl.length,
  });

  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY or AI_VISION_API_KEY is missing in Cloud Functions environment. " +
      "Run: firebase functions:secrets:set AI_VISION_API_KEY"
    );
  }

  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(mealTypeHint, gramNotes);

  const start = Date.now();
  let rawJson: string;

  switch (provider) {
    case "openai":
      rawJson = await callOpenAI(apiKey, systemPrompt, userPrompt, imageUrl);
      break;
    case "gemini":
      rawJson = await callGemini(apiKey, systemPrompt, userPrompt, imageUrl);
      break;
    case "anthropic":
      rawJson = await callAnthropic(apiKey, systemPrompt, userPrompt, imageUrl);
      break;
    default:
      throw new Error(`Unknown AI provider: ${provider}`);
  }

  const processingTimeMs = Date.now() - start;
  const modelVersion = MODEL_VERSION_MAP[provider] ?? provider;
  console.log("[AI_PROVIDER] analysis complete", { provider, processingTimeMs, modelVersion, rawJsonLength: rawJson.length });

  return parseAIResponse(rawJson, mealTypeHint, processingTimeMs, modelVersion);
}

// ─── Provider implementations ──────────────────────────────────────────────

async function callOpenAI(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  imageUrl: string
): Promise<string> {
  const model = MODEL_VERSION_MAP.openai;
  console.log("[OPENAI] calling", { model, imageIsDataUrl: imageUrl.startsWith("data:"), imageUrlLength: imageUrl.length });

  // OpenAI Chat Completions vision accepts data URLs directly in image_url.url
  const requestBody = {
    model,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: [
          { type: "text", text: userPrompt },
          {
            type: "image_url",
            image_url: { url: imageUrl, detail: "high" },
          },
        ],
      },
    ],
    max_tokens: 4096,
    temperature: 0.1,
  };

  let response: Response;
  try {
    response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });
  } catch (fetchErr) {
    console.error("[OPENAI_FETCH_ERROR]", {
      name: fetchErr instanceof Error ? fetchErr.name : "unknown",
      message: fetchErr instanceof Error ? fetchErr.message : String(fetchErr),
    });
    throw fetchErr;
  }

  const rawBody = await response.text();
  console.log("[OPENAI] response", { status: response.status, ok: response.ok, bodyPreview: rawBody.substring(0, 500) });

  if (!response.ok) {
    // Map OpenAI HTTP errors to descriptive messages
    const errPrefix = `OpenAI API error ${response.status}`;
    if (response.status === 401) {
      throw new Error(`${errPrefix}: API key invalid. ${rawBody.substring(0, 300)}`);
    }
    if (response.status === 429) {
      throw new Error(`${errPrefix}: Rate limited / quota exceeded. ${rawBody.substring(0, 300)}`);
    }
    throw new Error(`${errPrefix}: ${rawBody.substring(0, 500)}`);
  }

  let data: Record<string, unknown>;
  try {
    data = JSON.parse(rawBody);
  } catch {
    throw new Error(`OpenAI returned invalid JSON: ${rawBody.substring(0, 500)}`);
  }

  // Extract text from Chat Completions response
  const choices = data.choices as Array<{ message?: { content?: string } }> | undefined;
  const outputText = choices?.[0]?.message?.content?.trim();

  if (!outputText) {
    const details = JSON.stringify(data).slice(0, 1000);
    throw new Error(`OpenAI response had no content. body=${details}`);
  }

  console.log("[OPENAI] extracted text", { length: outputText.length });
  return outputText;
}

async function callGemini(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  imageUrl: string
): Promise<string> {
  const model = MODEL_VERSION_MAP.gemini;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  // Extract base64 from data URL, or fetch HTTPS URL and convert to base64
  let mimeType: string;
  let imageData: string;
  const dataUrlMatch = imageUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (dataUrlMatch) {
    mimeType = dataUrlMatch[1];
    imageData = dataUrlMatch[2];
  } else {
    // HTTPS URL → fetch and convert to base64 (Gemini requires inlineData)
    console.log("[GEMINI] fetching image URL to convert to base64", { urlLength: imageUrl.length });
    const imgResponse = await fetch(imageUrl);
    if (!imgResponse.ok) {
      throw new Error(`Failed to fetch image for Gemini: HTTP ${imgResponse.status}`);
    }
    mimeType = imgResponse.headers.get("content-type") || "image/jpeg";
    const buffer = await imgResponse.arrayBuffer();
    imageData = Buffer.from(buffer).toString("base64");
    console.log("[GEMINI] converted image to base64", { mimeType, base64Length: imageData.length });
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [
        {
          parts: [
            { text: userPrompt },
            { inlineData: { mimeType, data: imageData } },
          ],
        },
      ],
      generationConfig: { temperature: 0.1, maxOutputTokens: 4096 },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${body}`);
  }

  const data = (await response.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const outputText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!outputText) {
    const details = JSON.stringify(data).slice(0, 1000);
    throw new Error(`Gemini returned no content. Response: ${details}`);
  }
  return outputText;
}

async function callAnthropic(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  imageUrl: string
): Promise<string> {
  // Anthropic: prefer base64 for reliability; fetch HTTPS URLs to base64
  const dataUrlMatch = imageUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  let imageSource: { type: "base64"; media_type: string; data: string };
  if (dataUrlMatch) {
    imageSource = { type: "base64", media_type: dataUrlMatch[1], data: dataUrlMatch[2] };
  } else {
    // Fetch HTTPS URL and convert to base64 for max compatibility
    console.log("[ANTHROPIC] fetching image URL to convert to base64");
    const imgResponse = await fetch(imageUrl);
    if (!imgResponse.ok) {
      throw new Error(`Failed to fetch image for Anthropic: HTTP ${imgResponse.status}`);
    }
    const mediaType = imgResponse.headers.get("content-type") || "image/jpeg";
    const buffer = await imgResponse.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString("base64");
    imageSource = { type: "base64", media_type: mediaType, data: base64Data };
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL_VERSION_MAP.anthropic,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: imageSource,
            },
            { type: "text", text: userPrompt },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Anthropic API error ${response.status}: ${body}`);
  }

  const data = (await response.json()) as {
    content?: { text?: string }[];
  };
  const outputText = data.content?.[0]?.text;
  if (!outputText) {
    const details = JSON.stringify(data).slice(0, 1000);
    throw new Error(`Anthropic returned no content. Response: ${details}`);
  }
  return outputText;
}

// ─── Response parsing ──────────────────────────────────────────────────────

interface RawAIItem {
  foodName: string;
  grams: number;
  estimatedGrams?: number;
  edibleGrams?: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  confidence: string;
  reasoning?: string;
  cookingMethod?: string;
  portionDescription?: string;
  portionNotes?: string;
}

interface RawAIQuestion {
  question: string;
  options: string[];
  relatedItemIndex?: number;
}

interface RawAIResponse {
  error?: string;
  message?: string;
  mealName: string;
  totalNutrition?: Partial<MacroNutrients>;
  totalCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  confidence: string;
  confidenceScore: number;
  suggestedMealType: string;
  items: RawAIItem[];
  clarificationQuestions?: RawAIQuestion[];
  warnings?: string[];
  portionNotes?: string;
  accuracyNote: string;
}

function parseAIResponse(
  raw: string,
  mealTypeHint: MealType | undefined,
  processingTimeMs: number,
  modelVersion: string
): AIAnalysisResult {
  // Strip markdown code fences if the model wraps its output
  const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let parsed: RawAIResponse;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    // Fallback: extract first {...} block if the model added surrounding prose
    const jsonBlockMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonBlockMatch) {
      try {
        parsed = JSON.parse(jsonBlockMatch[0]);
      } catch {
        throw new Error("AI returned invalid JSON. Raw output: " + raw.slice(0, 500));
      }
    } else {
      throw new Error("AI returned invalid JSON. Raw output: " + raw.slice(0, 500));
    }
  }

  // Handle "no food detected" — use a tagged error message the caller can identify
  if (parsed.error === "no_food_detected") {
    throw new Error(
      "no_food_detected: " + (parsed.message ?? "Fotoğrafta yiyecek tespit edilemedi.")
    );
  }

  if (!parsed.items || !Array.isArray(parsed.items) || parsed.items.length === 0) {
    throw new Error(
      "no_food_detected: AI yanıtında besin öğesi bulunamadı."
    );
  }

  const warnings = Array.isArray(parsed.warnings)
    ? parsed.warnings.filter((w) => typeof w === "string")
    : [];

  // Map raw items → typed AnalysisItems with cross-validation
  const items: AnalysisItem[] = parsed.items.map((raw) => {
    let calories = clamp(raw.calories, 0, 5000);
    let protein = clamp(raw.protein, 0, 500);
    let carbs = clamp(raw.carbs, 0, 800);
    let fat = clamp(raw.fat, 0, 500);
    let fiber = clamp(raw.fiber ?? 0, 0, 150);

    // Cross-validate: calories ≈ 4P + 4C + 9F
    const expectedCal = protein * 4 + carbs * 4 + fat * 9;
    if (expectedCal > 0) {
      const deviation = Math.abs(calories - expectedCal) / expectedCal;
      if (deviation > 0.10) {
        calories = Math.round(expectedCal);
        warnings.push(`${raw.foodName || "Bir öğe"} kalorisi makrolardan yeniden hesaplandı.`);
      }
    }

    let grams = clamp(raw.edibleGrams ?? raw.grams, 1, 3000);
    const calPerGram = calories / grams;
    if (calories > 0 && (calPerGram > 9.5 || (calPerGram < 0.05 && grams > 10))) {
      calories = expectedCal > 0 ? Math.round(expectedCal) : 0;
      warnings.push(`${raw.foodName || "Bir öğe"} için uç kalori yoğunluğu düzeltildi.`);
    }

    let confidence = toConfidence(raw.confidence);
    if (isSingleBoneInChicken(raw) && grams > 220) {
      const targetGrams = 180;
      const ratio = targetGrams / grams;
      grams = targetGrams;
      calories = Math.round(calories * ratio);
      protein = Math.round(protein * ratio);
      carbs = Math.round(carbs * ratio);
      fat = Math.round(fat * ratio);
      fiber = Math.round(fiber * ratio);
      confidence = "low";
      warnings.push(`${raw.foodName || "Tavuk"} tek parça göründüğü için yenebilir porsiyon 180g'a çekildi.`);
    }

    return {
      id: randomId(),
      name: typeof raw.foodName === "string" && raw.foodName.trim() ? raw.foodName.trim() : "Yemek",
      grams,
      macros: { calories, protein, carbs, fat, fiber } as MacroNutrients,
      confidence,
      ...(raw.reasoning && { reasoning: raw.reasoning }),
      ...(raw.cookingMethod && { cookingMethod: raw.cookingMethod }),
      ...(raw.portionDescription || raw.portionNotes
        ? { portionDescription: [raw.portionDescription, raw.portionNotes].filter(Boolean).join(" ") }
        : {}),
    };
  });

  // ── Known-food sanity check: catch AI confusions like eggs↔yogurt ──
  for (let i = 0; i < items.length; i++) {
    items[i] = sanityCheckItem(items[i], warnings);
  }

  // Map clarification questions, linking by index → item ID
  const clarificationQuestions: ClarificationQuestion[] = (
    parsed.clarificationQuestions ?? []
  ).map((q) => ({
    id: randomId(),
    question: q.question,
    options: q.options.slice(0, 4),
    relatedItemId:
      q.relatedItemIndex !== undefined && items[q.relatedItemIndex]
        ? items[q.relatedItemIndex].id
        : undefined,
  }));

  const validMealTypes = new Set<string>(["breakfast", "lunch", "dinner", "snack"]);
  const suggestedMealType = (
    validMealTypes.has(parsed.suggestedMealType)
      ? parsed.suggestedMealType
      : mealTypeHint ?? "lunch"
  ) as MealType;

  const totalCalories = items.reduce((s, i) => s + i.macros.calories, 0);
  const protein = items.reduce((s, i) => s + i.macros.protein, 0);
  const carbs = items.reduce((s, i) => s + i.macros.carbs, 0);
  const fat = items.reduce((s, i) => s + i.macros.fat, 0);
  const fiber = items.reduce((s, i) => s + (i.macros.fiber ?? 0), 0);
  const aiTotalCalories = clamp(parsed.totalNutrition?.calories ?? parsed.totalCalories, 0, 20000);
  if (aiTotalCalories > 0 && Math.abs(aiTotalCalories - totalCalories) > Math.max(50, totalCalories * 0.12)) {
    warnings.push("Toplam besin değeri item toplamları baz alınarak düzeltildi.");
  }

  return {
    mealName: parsed.mealName || "Öğün",
    items,
    totalCalories,
    protein,
    carbs,
    fat,
    fiber,
    confidence: toConfidence(parsed.confidence),
    confidenceScore: clampFloat(parsed.confidenceScore ?? 0.5, 0, 1),
    suggestedMealType,
    clarificationQuestions,
    warnings: [...new Set(warnings)].slice(0, 8),
    ...(typeof parsed.portionNotes === "string" && parsed.portionNotes.trim()
      ? { portionNotes: parsed.portionNotes.trim() }
      : {}),
    accuracyNote:
      parsed.accuracyNote ||
      "Bu değerler görsel analize dayalı tahminlerdir. " +
      "Gerçek besin değerleri farklılık gösterebilir. Gramajları düzenleyerek doğruluğu artırabilirsiniz.",
    processingTimeMs,
    modelVersion,
  };
}

// ─── Mock implementation ───────────────────────────────────────────────────

async function mockAnalysis(mealTypeHint?: MealType): Promise<AIAnalysisResult> {
  const start = Date.now();
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const items: AnalysisItem[] = [
    {
      id: randomId(),
      name: "Izgara Tavuk Göğsü (derisiz)",
      grams: 150,
      macros: { calories: 248, protein: 47, carbs: 0, fat: 5, fiber: 0 },
      confidence: "high",
      reasoning: "Tabakta ızgara izleri belirgin, orta-büyük boy derisiz göğüs parçası. Tabak referansına göre ~150g.",
      cookingMethod: "ızgara",
      portionDescription: "Yaklaşık 1 büyük porsiyon",
    },
    {
      id: randomId(),
      name: "Tereyağlı Beyaz Pirinç Pilavı",
      grams: 200,
      macros: { calories: 320, protein: 6, carbs: 56, fat: 8, fiber: 1 },
      confidence: "medium",
      reasoning: "Tabağın yarısını kaplayan pirinç yığını, şehriye taneleri görülüyor. Tereyağı parlaklığı mevcut.",
      cookingMethod: "sade",
      portionDescription: "Yaklaşık 1 normal porsiyon",
    },
    {
      id: randomId(),
      name: "Mevsim Salatası",
      grams: 80,
      macros: { calories: 16, protein: 1, carbs: 3, fat: 0, fiber: 1 },
      confidence: "medium",
      reasoning: "Tabağın kenarında küçük yeşillik porsiyon, domates ve salatalık parçaları.",
      cookingMethod: "çiğ",
      portionDescription: "Küçük porsiyon",
    },
    {
      id: randomId(),
      name: "Zeytinyağı (salata sosu)",
      grams: 14,
      macros: { calories: 124, protein: 0, carbs: 0, fat: 14, fiber: 0 },
      confidence: "low",
      reasoning: "Salata üzerinde yağ parlaklığı görülüyor, yaklaşık 1 yemek kaşığı zeytinyağı tahmini.",
      portionDescription: "~1 yemek kaşığı",
    },
  ];

  const clarificationQuestions: ClarificationQuestion[] = [
    {
      id: randomId(),
      question: "Tavuk nasıl pişirilmiş?",
      options: ["Izgara", "Tava (yağlı)", "Fırın", "Kızartma"],
      relatedItemId: items[0].id,
    },
    {
      id: randomId(),
      question: "Pilavda tereyağı var mı?",
      options: ["Evet, tereyağlı", "Hayır, sade"],
      relatedItemId: items[1].id,
    },
  ];

  return {
    mealName: "Tavuk, Pilav & Salata Tabağı",
    items,
    totalCalories: 708,
    protein: 54,
    carbs: 59,
    fat: 27,
    fiber: 2,
    confidence: "medium",
    confidenceScore: 0.76,
    suggestedMealType: mealTypeHint ?? "lunch",
    clarificationQuestions,
    warnings: [
      "Pilavdaki tereyağı miktarı net görünmediği için yaklaşık hesaplandı.",
      "Salata sosu miktarı tahminidir.",
    ],
    accuracyNote:
      "Bu değerler görsel analiz ve standart porsiyon boyutlarına dayalı tahminlerdir. " +
      "Gramajları düzenleyerek doğruluğu artırabilirsiniz.",
    processingTimeMs: Date.now() - start,
    modelVersion: "mock-v1",
  };
}

// ─── Known Food Sanity Check ──────────────────────────────────────────────
// When the AI identifies a food by name but returns wildly wrong per-100g
// values, we correct them using known reference data. This catches cases
// where the model confuses visually similar foods (e.g. eggs ↔ yogurt).

interface FoodRefRange {
  /** Patterns to match in the food name (lowercase Turkish-normalized) */
  patterns: string[];
  /** Exclude if these patterns are also present */
  exclude?: string[];
  /** Expected cal/100g range */
  calPer100g: [number, number];
  /** Reference per-100g values to use for correction */
  ref: { cal: number; p: number; c: number; f: number; fib: number };
}

const KNOWN_FOOD_REFS: FoodRefRange[] = [
  {
    patterns: ["yumurta", "haslama yumurta", "haslanmis yumurta"],
    exclude: ["omlet", "menemen", "sucuklu", "pastirmali", "sahanda", "kaygana"],
    calPer100g: [120, 200],
    ref: { cal: 155, p: 13, c: 1.1, f: 11, fib: 0 },
  },
  {
    patterns: ["sahanda yumurta"],
    calPer100g: [150, 250],
    ref: { cal: 196, p: 13.6, c: 0.7, f: 15.3, fib: 0 },
  },
  {
    patterns: ["omlet"],
    exclude: ["peynirli", "sebzeli"],
    calPer100g: [140, 220],
    ref: { cal: 185, p: 13, c: 1, f: 14, fib: 0 },
  },
  {
    patterns: ["beyaz pirinc pilav", "pirinc pilavi", "sade pilav"],
    calPer100g: [110, 200],
    ref: { cal: 130, p: 2.7, c: 28, f: 0.3, fib: 0 },
  },
  {
    patterns: ["tereyagli pilav", "sehriyeli pilav"],
    calPer100g: [140, 220],
    ref: { cal: 175, p: 3.5, c: 30, f: 5, fib: 0 },
  },
  {
    patterns: ["tavuk gogsu"],
    exclude: ["kizartma", "paneli", "tatli"],
    calPer100g: [130, 210],
    ref: { cal: 165, p: 31, c: 0, f: 3.6, fib: 0 },
  },
  {
    patterns: ["makarna"],
    exclude: ["kremali", "kiymali"],
    calPer100g: [110, 180],
    ref: { cal: 131, p: 5, c: 25, f: 1.1, fib: 0 },
  },
  {
    patterns: ["beyaz ekmek", "ekmek dilim"],
    calPer100g: [230, 300],
    ref: { cal: 265, p: 9, c: 49, f: 3.2, fib: 0 },
  },
];

function normalizeTr(s: string): string {
  return s
    .replace(/İ/g, "i")
    .toLowerCase()
    .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u")
    .replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9\s]+/g, " ").trim();
}

/**
 * If the AI returned a known food but with obviously wrong cal/100g,
 * recalculate macros from reference values. Returns corrected item or original.
 */
function sanityCheckItem(
  item: AnalysisItem,
  warnings: string[]
): AnalysisItem {
  const normalized = normalizeTr(item.name);
  const calPer100g = (item.macros.calories / item.grams) * 100;

  for (const ref of KNOWN_FOOD_REFS) {
    const matches = ref.patterns.some((p) => normalized.includes(p));
    if (!matches) continue;
    const excluded = ref.exclude?.some((e) => normalized.includes(e));
    if (excluded) continue;

    // Check if AI's value is outside expected range
    if (calPer100g >= ref.calPer100g[0] && calPer100g <= ref.calPer100g[1]) {
      // Within range, no correction needed
      return item;
    }

    // AI value is wrong — recalculate from reference
    const ratio = item.grams / 100;
    const corrected = {
      ...item,
      macros: {
        calories: Math.round(ref.ref.cal * ratio),
        protein: Math.round(ref.ref.p * ratio * 10) / 10,
        carbs: Math.round(ref.ref.c * ratio * 10) / 10,
        fat: Math.round(ref.ref.f * ratio * 10) / 10,
        fiber: Math.round(ref.ref.fib * ratio * 10) / 10,
      },
      confidence: "medium" as const,
    };
    warnings.push(
      `${item.name} besin değeri referans verilerle düzeltildi (${Math.round(calPer100g)} → ${ref.ref.cal} kcal/100g).`
    );
    return corrected;
  }
  return item;
}

// ─── Utilities ─────────────────────────────────────────────────────────────

function randomId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < 20; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

function clamp(value: unknown, min: number, max: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, Math.round(value)));
}

function clampFloat(value: unknown, min: number, max: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}

function toConfidence(value: string): "low" | "medium" | "high" {
  if (value === "high" || value === "low") return value;
  return "medium";
}

function isSingleBoneInChicken(raw: RawAIItem): boolean {
  const text = [
    raw.foodName,
    raw.portionDescription,
    raw.portionNotes,
    raw.reasoning,
  ].filter(Boolean).join(" ").toLocaleLowerCase("tr-TR");

  const isBoneInChicken =
    text.includes("tavuk but") ||
    text.includes("tavuk baget") ||
    text.includes("baget") ||
    text.includes("drumstick") ||
    text.includes("chicken thigh");

  if (!isBoneInChicken) return false;

  const mentionsMultiple = /\b(2|3|4|5|iki|üç|uc|dört|dort|beş|bes|birden fazla|çoklu)\b/i.test(text);
  if (mentionsMultiple) return false;

  return /\b(1|tek|bir|adet)\b/i.test(text) || !/\b(2|3|4|5)\b/.test(text);
}
