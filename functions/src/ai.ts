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
// Set the provider via the AI_PROVIDER environment variable when needed.
//
// Supported providers: "openai" | "gemini" | "anthropic" | "mock"

const aiApiKey = defineSecret("AI_VISION_API_KEY");

const USE_MOCK = process.env.AI_PROVIDER === "mock";

const MODEL_VERSION_MAP: Record<string, string> = {
  openai: "gpt-4o-mini",
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
  const apiKey = aiApiKey.value();

  if (!apiKey) {
    throw new Error(
      "AI_VISION_API_KEY secret is not set. " +
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

  return parseAIResponse(rawJson, mealTypeHint, processingTimeMs, modelVersion);
}

// ─── Provider implementations ──────────────────────────────────────────────

async function callOpenAI(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  imageUrl: string
): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL_VERSION_MAP.openai,
      instructions: systemPrompt,
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: userPrompt },
            { type: "input_image", image_url: imageUrl, detail: "high" },
          ],
        },
      ],
      max_output_tokens: 12000,
      reasoning: { effort: "low" },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${body}`);
  }

  const data = (await response.json()) as Record<string, unknown>;
  const outputText = extractOpenAIText(data);

  if (!outputText) {
    const status = typeof data.status === "string" ? data.status : "unknown";
    const details = JSON.stringify(data).slice(0, 1000);
    throw new Error(
      `OpenAI API response did not include output text. status=${status} body=${details}`
    );
  }

  return outputText;
}

function extractOpenAIText(value: unknown): string {
  const parts: string[] = [];

  const walk = (node: unknown, key?: string): void => {
    if (!node) return;

    if (typeof node === "string") {
      if (key === "output_text" || key === "text") {
        parts.push(node);
      }
      return;
    }

    if (Array.isArray(node)) {
      node.forEach((item) => walk(item));
      return;
    }

    if (typeof node === "object") {
      for (const [childKey, childValue] of Object.entries(node)) {
        walk(childValue, childKey);
      }
    }
  };

  walk(value);
  return parts.join("\n").trim();
}

async function callGemini(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  imageUrl: string
): Promise<string> {
  const model = MODEL_VERSION_MAP.gemini;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const dataUrlMatch = imageUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  const mimeType = dataUrlMatch?.[1] ?? "image/jpeg";
  const imageData = dataUrlMatch?.[2] ?? imageUrl;

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
    candidates: { content: { parts: { text: string }[] } }[];
  };
  return data.candidates[0].content.parts[0].text;
}

async function callAnthropic(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  imageUrl: string
): Promise<string> {
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
              source: { type: "url", url: imageUrl },
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
    content: { text: string }[];
  };
  return data.content[0].text;
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
