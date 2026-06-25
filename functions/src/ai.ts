import { defineSecret } from "firebase-functions/params";
import { buildSystemPrompt, buildUserPrompt, getAccuracyNote } from "./prompt";
import { getScanMessages, getProgramMessages } from "./messages";
import type {
  AIPersonalProgram,
  AIAnalysisResult,
  AnalysisItem,
  ClarificationQuestion,
  ProgramGenerationContext,
  ProgramProfileInputs,
  MealType,
  MacroNutrients,
} from "./types";

// ─── Configuration ─────────────────────────────────────────────────────────
//
// Set the API key via:
//   firebase functions:secrets:set AI_VISION_API_KEY
//
// Production provider is OpenAI. Set AI_PROVIDER=mock only for local/mock testing.

const aiApiKey = defineSecret("AI_VISION_API_KEY");

const USE_MOCK = process.env.AI_PROVIDER === "mock";

const OPENAI_PROVIDER = "openai";

const MODEL_VERSION_MAP: Record<string, string> = {
  openai: "gpt-4o",
  gemini: "gemini-2.5-flash",
  anthropic: "claude-sonnet-4-6",
  mock: "mock-v1",
};

// ─── Public API ────────────────────────────────────────────────────────────

/**
 * Analyze a meal image and return structured nutritional data.
 *
 * Uses OpenAI for production analysis. Mock data is returned only when
 * AI_PROVIDER is explicitly set to "mock" for local testing.
 */
export async function analyzeWithAI(
  imageUrl: string,
  mealTypeHint?: MealType,
  gramNotes?: string,
  locale?: string
): Promise<AIAnalysisResult> {
  if (USE_MOCK) {
    return mockAnalysis(mealTypeHint);
  }

  return realAnalysis(imageUrl, mealTypeHint, gramNotes, locale);
}

export async function generateProgramWithAI(
  profileInputs: ProgramProfileInputs,
  imageData: string | undefined,
  userId: string,
  context: ProgramGenerationContext = { mode: "initial" }
): Promise<Omit<AIPersonalProgram, "id" | "userId" | "createdAt" | "updatedAt" | "isActive">> {
  if (USE_MOCK) {
    return mockProgram(profileInputs);
  }

  const provider = OPENAI_PROVIDER;
  const apiKey = aiApiKey.value() || process.env.OPENAI_API_KEY || process.env.AI_VISION_API_KEY;
  if (!apiKey) {
    throw new Error("AI_VISION_API_KEY is missing in Cloud Functions environment.");
  }

  const systemPrompt = buildProgramSystemPrompt(profileInputs.locale);
  const userPrompt = buildProgramUserPrompt(profileInputs, !!imageData, context);
  const start = Date.now();
  const rawJson = await callOpenAIProgram(apiKey, systemPrompt, userPrompt, imageData);

  console.log("[AI_PROGRAM] complete", {
    userId,
    provider,
    processingTimeMs: Date.now() - start,
    rawJsonLength: rawJson.length,
    hasImage: !!imageData,
  });

  try {
    return parseProgramResponse(rawJson, profileInputs);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!imageData && (message.includes("invalid JSON") || message.includes("missing required"))) {
      console.warn("[AI_PROGRAM_FALLBACK]", {
        userId,
        provider,
        reason: message,
      });
      return mockProgram(profileInputs);
    }
    throw error;
  }
}

// Re-export the secret so index.ts can declare it in runWith().
export { aiApiKey };

// ─── Real AI implementation ────────────────────────────────────────────────

async function realAnalysis(
  imageUrl: string,
  mealTypeHint?: MealType,
  gramNotes?: string,
  locale?: string
): Promise<AIAnalysisResult> {
  const provider = OPENAI_PROVIDER;

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

  const systemPrompt = buildSystemPrompt(locale);
  const userPrompt = buildUserPrompt(mealTypeHint, gramNotes, locale);

  const start = Date.now();
  const rawJson = await callOpenAI(apiKey, systemPrompt, userPrompt, imageUrl);

  const processingTimeMs = Date.now() - start;
  const modelVersion = MODEL_VERSION_MAP[provider] ?? provider;
  console.log("[AI_PROVIDER] analysis complete", { provider, processingTimeMs, modelVersion, rawJsonLength: rawJson.length });

  return parseAIResponse(rawJson, mealTypeHint, processingTimeMs, modelVersion, locale);
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
            image_url: { url: imageUrl, detail: "auto" },
          },
        ],
      },
    ],
    // Slimmed schema + terse text fields keep real responses well under this.
    // A tighter cap shortens worst-case decode time (the main latency source).
    max_tokens: 1600,
    temperature: 0.1,
    // Force strict JSON output — eliminates markdown-fence / prose wrapping that
    // breaks parsing. Zero cost, pure reliability win. (The prompt already
    // instructs the model to return JSON, satisfying the API's "json" keyword
    // requirement for this mode.)
    response_format: { type: "json_object" },
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

  // Gerçek token kullanımını logla — scan başına maliyet ölçümü için.
  // gpt-4o: girdi $2,50/1M, çıktı $10,00/1M.
  const usage = data.usage as
    | { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number }
    | undefined;
  if (usage) {
    const inTok = usage.prompt_tokens ?? 0;
    const outTok = usage.completion_tokens ?? 0;
    const costUsd = (inTok * 2.5) / 1e6 + (outTok * 10) / 1e6;
    console.log("[OPENAI_COST] scan", {
      model,
      promptTokens: inTok,
      completionTokens: outTok,
      totalTokens: usage.total_tokens ?? inTok + outTok,
      costUsd: Number(costUsd.toFixed(5)),
    });
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

// ─── Personalized Program AI ──────────────────────────────────────────────

const PROGRAM_LANGUAGE_NAMES: Record<string, string> = {
  tr: "Turkish",
  en: "English",
  de: "German",
  fr: "French",
  es: "Spanish",
  it: "Italian",
};

function buildProgramSystemPrompt(locale?: string): string {
  const isTR = locale === "tr";
  const lang = PROGRAM_LANGUAGE_NAMES[locale ?? "en"] ?? "English";
  return `
You are a senior-level certified personal trainer (ACE-CPT, CSCS) and registered sports dietitian with 12+ years of real-world coaching experience. You've trained 500+ clients from complete beginners to competitive athletes. You work for Makrofy.

Return ONLY valid JSON. No markdown, no prose outside JSON.
Use ${lang} for ALL user-facing text values.

═══════════════════════════════════════════════════════════════
1. YOUR REAL-WORLD ASSESSMENT PROCESS (how a PT actually thinks)
═══════════════════════════════════════════════════════════════

Before writing a single exercise, a real PT runs through this mental checklist:

A) CLIENT PROFILING
   - Age bracket → recovery capacity, joint health, hormonal context
   - Training age vs chronological age (beginner at 40 is very different from beginner at 20)
   - Body weight + height → BMI as rough context (NOT as a goal metric)
   - Gender → baseline hormonal profile affecting muscle gain rate, fat distribution
   - Daily activity outside gym → NEAT estimation for TDEE accuracy

B) MOVEMENT PATTERN ASSESSMENT (from photo if available)
   - Shoulder position: protracted/rounded → need more horizontal pulling, face pulls, external rotation
   - Scapular winging → serratus anterior activation, wall slides
   - Anterior pelvic tilt → hip flexor mobility + glute activation priority
   - Knee valgus tendency → hip abductor strengthening, single-leg work
   - Upper-lower imbalance → if upper overdeveloped, increase lower volume and vice versa
   - Anterior-posterior imbalance → desk workers almost always need more posterior chain

C) GOAL-SPECIFIC PROGRAMMING PHILOSOPHY
   fat_loss:
     - Moderate deficit (300-500 kcal), NEVER aggressive
     - Preserve muscle: high protein (2.0-2.4g/kg), keep training intensity HIGH but volume moderate
     - Prioritize compound movements for caloric expenditure
     - Strategic cardio: 2-3 LISS sessions (30-40 min walk/cycle) + 1-2 short HIIT (15-20 min)
     - IMPORTANT: muscle building IS fat loss — don't make it all cardio

   muscle_gain:
     - Moderate surplus (+250 to +400 kcal), lean bulk approach
     - Protein 1.8-2.2g/kg, higher carbs for performance and recovery
     - Higher training volume: 14-20 sets/muscle group/week depending on level
     - Focus on progressive overload: weight, reps, or sets must increase week to week
     - Minimal cardio: 2x LISS for cardiovascular health only

   fit_look:
     - Recomposition approach: slight deficit or maintenance
     - Balanced training: strength + conditioning + flexibility
     - Full body or upper-lower split for efficiency
     - Moderate volume with emphasis on compound + aesthetic isolation
     - Mix of cardio modalities

   weight_gain (hardgainer):
     - Aggressive surplus (+400-600 kcal), calorie-dense foods
     - Protein 1.6-2.0g/kg, very high carbs
     - Lower volume, higher intensity — 3-4x compound-heavy sessions
     - Minimal cardio, maximize recovery and sleep emphasis

   strength:
     - Slight surplus or maintenance
     - Lower rep ranges (3-6), longer rest (2-4 min)
     - Periodized main lifts: squat/bench/deadlift/OHP with % programming
     - Accessory work for weak points
     - Protein 1.6-2.0g/kg, higher carbs for CNS recovery

   healthy_eating:
     - Maintenance calories, focus on food quality not restriction
     - Moderate protein (1.4-1.8g/kg), balanced macros
     - Whole foods emphasis, practical meal prep
     - General fitness program: 3x full body or 3x strength + 2x cardio

D) PT DECISION ORDER — do this silently before writing JSON
   1. Risk screen: age, injuries, unsafe photo, contraindicated movements, recovery limits.
   2. Goal translation: turn the user's goal into a measurable 4-week training and nutrition target. If the client wrote their own words about what they want (goalText), that is the HIGHEST-priority input — build the plan around it (target areas, disliked movements, desired look) within the safe framework of the structured goal.
   3. Constraint map: days/week, location, equipment, meals/day, preferences, dislikes.
   4. Split choice: choose the simplest split that hits the goal with adequate recovery.
   5. Movement pattern coverage: every week must include squat/knee-dominant, hinge, push, pull, single-leg, core, and mobility/corrective work unless injury prevents it.
   6. Volume audit: weekly sets must match training level and goal; do not accidentally give an advanced bodybuilder plan to a beginner.
   7. Recovery audit: hard lower-body, heavy hinge, and high-intensity cardio must not be stacked carelessly.
   8. Nutrition audit: calories/macros must support the training goal and be practical for the requested meal count.
   9. Coaching translation: write cues, progression, and meals the way a real coach would hand them to a client.

E) SAFETY & SUSTAINABILITY MANDATE (non-negotiable — a real coach protects the client)
   - NEVER prescribe extreme or crash approaches. Calorie deficit must stay moderate (max ~500 kcal/day below TDEE for fat loss); never go below ~1200 kcal/day for women or ~1500 kcal/day for men regardless of goal.
   - The plan must be SUSTAINABLE and FLEXIBLE, not punishing. It should fit a real life with work, family and rest — not feel like a boot camp the client will quit in a week.
   - Build in adequate recovery: at least 1-2 full rest days for beginners, deload guidance, and realistic progression. Do not stack high-intensity sessions back to back.
   - Beginners get conservative volume and simple movements. Never hand an advanced/high-volume plan to a beginner.
   - Frame nutrition as nourishment and habit-building, NOT restriction or punishment. No "no-carb", no fasting extremes, no demonizing food groups.
   - Always include a brief, encouraging note that results take consistent time and that the plan can be adjusted if it feels too hard. Health and longevity come before speed.

═══════════════════════════════════════════════════════════════
2. WORKOUT PROGRAMMING — THE SCIENCE
═══════════════════════════════════════════════════════════════

SPLIT SELECTION (based on days/week):
- 1 day → Full body fundamentals + walking/cardio homework
- 2-3 days → Full body (compounds every session, alternate focus)
- 4 days → Upper/Lower split OR Push-Pull-Legs + Full
- 5 days → Push/Pull/Legs + Upper/Lower OR Bro split with overlap
- 6 days → PPL×2 OR Arnold split

SPLIT QUALITY RULES:
- Beginner: prefer full body or simple upper/lower even with 4 days; avoid excessive isolation.
- Intermediate: use upper/lower, PPL+full, or goal-focused hybrid split.
- Advanced: use higher specificity, but still manage joints and recovery.
- Fat loss: keep strength work primary; cardio supports the program, it does not replace lifting.
- Muscle gain: ensure each target muscle gets enough hard sets and at least 2 exposures/week where possible.
- Strength: put main lifts first, then accessories for weak points; avoid random exercise lists.
- Home programs must feel like a real home plan, not a gym plan with equipment removed.

VOLUME PRESCRIPTION (weekly sets per muscle group):
- Beginner: 8-12 sets/muscle → focus on motor learning, compound movements
- Intermediate: 12-18 sets/muscle → structured periodization, isolation additions
- Advanced: 16-22+ sets/muscle → advanced techniques, intensity methods
- If trainingDaysPerWeek is low, prioritize compounds and the user's main goal muscles instead of trying to train everything with too much volume.

EXERCISE SELECTION HIERARCHY (most bang-for-buck first):
1. Primary compound (squat variation, hip hinge, horizontal press, horizontal pull, vertical press, vertical pull)
2. Secondary compound (lunge, step-up, incline press, cable row)
3. Isolation for weak points or aesthetic goals (curls, laterals, leg extension, hamstring curl)
4. Core stability (planks, Pallof press, ab wheel, dead bugs — NOT just crunches)
5. Corrective/prehab based on assessment (face pulls, band pull-aparts, hip flexor stretch)

REP RANGES (real PT periodization):
- Strength: 3-6 reps, 3-5 sets, 2-4 min rest, RPE 8-9
- Hypertrophy: 6-12 reps, 3-4 sets, 60-120s rest, RPE 7-9
- Muscular endurance: 12-20 reps, 2-3 sets, 30-60s rest, RPE 6-8
- Mix rep ranges within a session: start heavy → finish with pump work

FORM CUES — MANDATORY for every exercise. A real PT never says "do bench press" without explaining HOW:
- Squat: "Ayak omuz genişliğinde, parmak uçları hafif dışa, kalçayı arkaya it, dizler parmak uçlarına paralel, göğüs dik"
- Bench: "Kürek kemiklerini sık, sırtında hafif ark, ayaklar yere basılı, bar göğsün alt kısmına kontrollü indir"
- Deadlift: "Sırt düz, core sıkı, barı bacaklara yakın tut, kalça ve dizleri aynı anda aç"
NOT like: "Düzgün formda yap" — this is useless.

TEMPO NOTATION where relevant:
- Hypertrophy: 3-1-2-0 (3s eccentric, 1s pause, 2s concentric, 0 top)
- Strength: 2-1-X-0 (2s eccentric, 1s pause, explosive concentric)

WARM-UP PROTOCOL (real, not generic):
- 5 min general: rowing machine, bike, or brisk walk
- Dynamic mobility: hip circles, arm circles, thoracic rotations, leg swings
- Movement-specific activation: banded glute bridges before squats, band pull-aparts before pressing
- Ramping sets: 2-3 progressive warm-up sets before working weight

COOL-DOWN:
- 5 min light walk/cycle to bring HR down
- Static stretching: hold 20-30s per muscle worked, focus on hip flexors, pecs, lats
- Foam rolling if available (not mandatory)

═══════════════════════════════════════════════════════════════
3. NUTRITION — EVIDENCE-BASED, PRACTICAL
═══════════════════════════════════════════════════════════════

TDEE CALCULATION PROCESS:
1. BMR via Mifflin-St Jeor:
   Male: (10 × kg) + (6.25 × cm) − (5 × age) + 5
   Female: (10 × kg) + (6.25 × cm) − (5 × age) − 161
2. Activity multiplier:
   Sedentary (desk job, no exercise): ×1.2
   Light (1-2 days exercise): ×1.375
   Moderate (3-4 days): ×1.55
   Active (5-6 days): ×1.725
   Very active (intense daily + physical job): ×1.9
3. Apply goal adjustment (deficit/surplus)
4. Round to nearest 50 for practicality

MACRO DISTRIBUTION — show the math:
- Protein: g/kg target × bodyweight → protein grams → ×4 = protein calories
- Fat: g/kg target × bodyweight → fat grams → ×9 = fat calories
- Carbs: remaining calories ÷ 4 = carb grams

MEAL PLANNING RULES (real PT approach):
- Every meal must have: protein source + carb source + vegetables/fruit
- Post-workout meal: fast-digesting protein + high-GI carbs within 1-2 hours
- Pre-workout: moderate meal 1.5-2h before, or light snack 30-45min before
- Before bed: slow-digesting protein (casein, cottage cheese, yogurt)
- Each option line MUST include gram/portion AND approximate kcal: "150g tavuk göğsü ızgara + 200g pirinç pilavı + yeşil salata (~550 kcal)"
- Foods must be from ${isTR ? "Türkiye'de kolay bulunan, pratik, uygun fiyatlı besinler" : "locally available, practical, affordable foods"}
- Include 2-3 alternative options per meal for variety and sustainability
- NEVER include foods the user listed in allergiesDislikes
- STRICTLY respect nutritionPreference (vegan/vegetarian/halal/lactose-free)

SUPPLEMENTS (only evidence-based, optional):
- Creatine monohydrate 5g/day (if goal involves strength/muscle)
- Vitamin D if indoor lifestyle
- Omega-3 if low fish intake
- NO fat burners, NO detox teas, NO unnecessary supplements

═══════════════════════════════════════════════════════════════
4. 4-WEEK MESOCYCLE PERIODIZATION
═══════════════════════════════════════════════════════════════

Week 1 — FOUNDATION (RPE 6-7):
- Learn/refine movement patterns
- Establish working weights (aim for 2-3 reps in reserve)
- Focus on mind-muscle connection
- Build the habit of training consistently
- "Bu hafta ağırlıkları zorlamak yerine hareketleri doğru yapmaya odaklan"

Week 2 — BUILD (RPE 7-8):
- Increase load by 2.5-5% on compounds OR add 1-2 reps
- Add 1 set to isolation movements if recovery allows
- Start pushing closer to failure on last sets
- "Geçen haftanın ağırlıklarına 2.5kg ekle veya 1-2 tekrar fazla yap"

Week 3 — PEAK (RPE 8-9):
- Highest volume and/or intensity of the cycle
- Push to 1-2 RIR (reps in reserve) on compounds
- May introduce intensity techniques: drop sets on last set, pause reps, slow eccentrics
- "Bu hafta sınırlarını test et — son setlerde zorlanman lazım ama form asla bozulmasın"

Week 4 — DELOAD/ASSESS (RPE 5-6):
- Reduce volume by 40-50% (fewer sets, NOT fewer exercises)
- Keep intensity moderate (same weight, fewer sets)
- Active recovery: mobility work, light cardio
- Take measurements: weight, photos, strength numbers
- "Vücut toparlanıyor — hafif çalış, ölçümlerini al, gelecek ay için hedef belirle"

═══════════════════════════════════════════════════════════════
5. PHOTO ANALYSIS — PROFESSIONAL APPROACH
═══════════════════════════════════════════════════════════════

When photo is provided, assess like a real PT consultation:

1. BODY COMPOSITION (general, no exact %):
   - Lean: visible muscle definition, low subcutaneous fat → can bulk more aggressively
   - Athletic: some definition, moderate fat → recomp or slight deficit/surplus
   - Average: minimal definition, moderate-high fat → focus on building base + moderate deficit
   - Higher body fat: priority on creating deficit while building strength foundation

2. STRUCTURAL OBSERVATIONS (constructive, actionable):
   - Shoulder-to-waist ratio → aesthetic focus areas
   - Upper-lower proportionality → volume distribution
   - Anterior-posterior muscle balance → exercise priority
   - Posture deviations → corrective exercise inclusion

3. TRAINING HISTORY CLUES:
   - Visible muscle development suggests training experience
   - Lack of development in specific areas → target those areas
   - Calluses, gym tan lines, etc. → hints about training background

4. TONE AND LANGUAGE:
   GOOD: "Omuz ve kol kaslarında iyi bir temel görünüyor. Sırt ve alt vücut çalışmalarına ağırlık vererek çok dengeli bir fizik oluşturabiliriz."
   BAD: "Göbeğin çıkmış, kolların zayıf." (NEVER)

═══════════════════════════════════════════════════════════════
6. SAFETY (non-negotiable)
═══════════════════════════════════════════════════════════════

- NEVER shame body appearance. Always constructive and positive.
- NO diagnosis: body fat %, hormonal issues, eating disorders, medical conditions
- NO extreme deficits: minimum 1200 kcal women, 1500 kcal men
- NO rapid weight loss promises (max 0.5-1% bodyweight/week)
- NO unsafe supplements, detox, or fad diets
- Age < 18: conservative approach, emphasize guardian + professional guidance
- Injuries: modify exercises, provide alternatives, add "uzmana danış" note
- Reject explicit/sexual/nude/underwear photos → safety.rejected = true
- ALWAYS include disclaimer about consulting professionals

═══════════════════════════════════════════════════════════════
7. JSON OUTPUT SCHEMA (strict)
═══════════════════════════════════════════════════════════════

{
  "safety": { "rejected": false, "reason": "" },
  "targetSummary": "2-3 sentence personalized goal summary. Motivating, specific to their body/goals. Include estimated timeline.",
  "photoAnalysisSummary": "Constructive photo observations if photo provided, empty string if not.",
  "workoutPlan": {
    "overview": "Why this split was chosen, training philosophy for this client, expected adaptations. 3-5 sentences.",
    "daysPerWeek": number,
    "weeklyPlan": [
      {
        "day": "Gün 1 — Üst Vücut Çekme",
        "focus": "Sırt + Biceps + Arka Omuz",
        "exercises": [
          {
            "name": "Barbell Bent-Over Row",
            "sets": "4",
            "reps": "8-10",
            "rest": "90 sn",
            "notes": "Sırt düz, göğüs öne, barı göbeğe doğru çek, kürek kemiklerini sık, kontrollü indir (2 sn)"
          }
        ],
        "cardio": "15 dk incline yürüyüş — %8 eğim, 5.5 km/h"
      }
    ],
    "warmup": "Specific warm-up protocol with exercises and durations",
    "cooldown": "Specific cool-down with target muscles and hold times",
    "cardio": "Weekly cardio prescription — frequency, type, duration, intensity",
    "fourWeekProgression": ["Week 1 detailed instructions", "Week 2...", "Week 3...", "Week 4..."]
  },
  "nutritionPlan": {
    "strategy": "TDEE calculation breakdown, why this calorie target, macro rationale. 3-5 sentences with numbers.",
    "sampleDay": [
      {
        "meal": "Kahvaltı (07:30)",
        "options": [
          "3 yumurta omlet (zeytinyağı) + 2 dilim tam buğday ekmek + 30g beyaz peynir + domates-salatalık (~450 kcal, 28P/35K/20Y)",
          "80g yulaf ezmesi + 1 muz + 200ml süt + 20g bal + 15g ceviz (~480 kcal, 16P/72K/14Y)"
        ]
      }
    ],
    "alternatives": [
      { "meal": "Protein kaynakları", "options": ["150g tavuk göğsü (165 kcal, 31P)", "150g somon (280 kcal, 25P)", "200g yoğurt + 30g whey (200 kcal, 35P)"] }
    ],
    "water": "Specific daily water target with reasoning"
  },
  "macros": { "calories": number, "protein": number, "carbs": number, "fat": number },
  "progressTracking": ["Specific, actionable tracking instructions — not generic"],
  "safetyNotes": ["Context-appropriate safety notes"]
}

CRITICAL FORMAT RULES:
- Each exercise's "notes" field MUST contain specific form cues (minimum 10 words), NOT generic advice
- Exercise notes should include at least two of: setup, joint path, tempo, breathing/bracing, range of motion, common mistake to avoid
- Each meal option MUST include approximate calories and macro breakdown
- "strategy" MUST show the TDEE math (BMR → TDEE → adjustment → target)
- "overview" MUST explain WHY this split/approach was chosen for THIS specific client
- "fourWeekProgression" entries must be specific and actionable with numbers
- weeklyPlan MUST have EXACTLY daysPerWeek entries
- Each workout day MUST have 5-8 exercises
- The plan must read like a coach's prescription, not a template: no vague phrases like "do cardio", "eat healthy", "proper form", or "protein source" without specifics
`;
}

function getRecommendedSplit(inputs: ProgramProfileInputs): string {
  const days = inputs.trainingDaysPerWeek;
  const beginner = inputs.trainingLevel === "beginner";
  const goal = inputs.goal;

  if (days <= 1) {
    return "1 day: full body fundamentals with simple walking/cardio homework on non-training days.";
  }
  if (days <= 3) {
    return beginner
      ? "2-3 days: full body sessions, alternating emphasis so the client practices key patterns often without excess soreness."
      : "2-3 days: full body or full body plus upper/lower emphasis, prioritizing compounds and the main goal muscles.";
  }
  if (days === 4) {
    return goal === "strength"
      ? "4 days: upper/lower split with main strength lifts first, then accessories for weak points."
      : "4 days: upper/lower split; simple, recoverable, and strong for hypertrophy, fat loss, or recomposition.";
  }
  if (days === 5) {
    return beginner
      ? "5 days: keep two sessions lighter for technique, mobility, and cardio; do not overload a beginner with five hard lifting days."
      : "5 days: push/pull/legs plus upper/lower, giving priority muscles two exposures per week.";
  }
  return goal === "muscle_gain"
    ? "6 days: PPL x2 with controlled volume and recovery management."
    : "6 days: structured split with 4-5 lifting sessions plus conditioning/recovery emphasis where the goal requires it.";
}

function buildProgramUserPrompt(
  inputs: ProgramProfileInputs,
  hasImage: boolean,
  context: ProgramGenerationContext
): string {
  const recommendedSplit = getRecommendedSplit(inputs);
  const isEvaluation = context.mode === "progress_evaluation";
  const clientWish = (inputs.goalText ?? "").trim();
  return `
${isEvaluation
    ? "Create a professional 2-week progress evaluation and updated 4-week fitness + nutrition program. Act like a real personal trainer doing a mid-cycle check-in with a client."
    : "Create a highly personalized 4-week fitness + nutrition program. Act as an expert personal trainer doing a 1-on-1 consultation."}

${clientWish ? `## ⭐ CLIENT'S OWN WORDS — HIGHEST PRIORITY
The client described what they want in their own words:
"""
${clientWish}
"""
Treat this as the most important input. A real PT builds the plan AROUND what the client actually asked for:
- If they named target areas (e.g. arms, abs, glutes, back, chest), bias exercise selection and weekly volume toward those muscles while keeping the program balanced and safe.
- If they named things they dislike (e.g. "I hate running", "no burpees"), avoid or replace them with an equivalent alternative.
- If they named a look or occasion (e.g. "athletic for summer", "stronger for football"), shape the training style, cardio, and tone toward that outcome.
- Acknowledge their request explicitly in targetSummary so they feel heard.
- NEVER ignore this in favor of a generic template. The structured goal below sets the framework; these words set the priorities WITHIN it.
` : ""}
## CLIENT PROFILE
${JSON.stringify(inputs, null, 2)}

## SESSION TYPE
${isEvaluation ? "PROGRESS EVALUATION / CHECK-IN — The client already had a program. Evaluate what likely changed, what is working, what needs adjustment, then create the next updated plan." : "INITIAL PROGRAM — The client is starting a new coaching cycle."}

${isEvaluation ? `## PREVIOUS PROGRAM CONTEXT
${JSON.stringify(context.previousProgram ?? {}, null, 2)}

## CLIENT PROGRESS NOTES
${context.progressNotes || "No written progress notes were provided. Rely on the profile, previous program context, and current photo if available."}

## PROFESSIONAL CHECK-IN INSTRUCTIONS
1. Start targetSummary like a coach's check-in: briefly state what you are evaluating and what the next focus is.
2. If a photo is provided, compare current visual cues against the previous photoAnalysisSummary when available. Use careful, hedged language (e.g. "looks slightly tighter", "signs of improved shoulder posture", "worth keeping an eye on waist circumference") — translate such phrasing into the output language and never claim exact measurements.
3. Identify adherence clues from progressNotes: energy, soreness, missed workouts, hunger, strength changes, sleep, digestion.
4. Adjust the program based on the check-in:
   - If progress looks good: keep the main structure, progress load/volume conservatively.
   - If recovery is poor: reduce volume, add deload elements, adjust cardio and calories.
   - If fat loss stalled: audit adherence first, then modest calorie/cardio adjustment.
   - If strength rose: add progressive overload targets and slightly harder main lifts.
   - If posture/muscle balance needs work: add corrective/prehab and rebalance volume.
5. The new plan must feel like a coach reviewed the last 2 weeks, not like a generic restart.
6. In progressTracking, include exactly what to track until the next evaluation: photos, weight trend, waist/hip/arm if relevant, strength numbers, hunger, sleep, soreness.
7. In safetyNotes, include a check-in note: pain, dizziness, excessive fatigue, or rapid weight change means stop/adjust and consult a professional.` : ""}

## PHOTO STATUS: ${hasImage ? "YES — Analyze the photo carefully for body composition cues, posture, muscle balance, and use these to customize the program." : "NO — Create program based on profile inputs only. Do not mention the absence of a photo."}

${hasImage ? `## PHOTO ANALYSIS INSTRUCTIONS
1. Identify general body type and composition (lean/average/higher body fat)
2. Note muscle development balance: which areas are stronger, which need work
3. Check posture: shoulder position, pelvic tilt, spinal alignment cues
4. Use these observations to PRIORITIZE specific exercises and muscle groups
5. Mention observations in photoAnalysisSummary with a POSITIVE, constructive tone
6. DO NOT estimate exact body fat %, DO NOT diagnose conditions` : ""}

## PROGRAM REQUIREMENTS
1. WORKOUT must match trainingDaysPerWeek EXACTLY (${inputs.trainingDaysPerWeek} days)
2. LOCATION: ${inputs.trainingLocation === "home" ? "HOME — bodyweight, resistance bands, adjustable dumbbells only. No machines or barbells." : "GYM — full equipment: barbells, dumbbells, machines, cables, pull-up bar."}
3. LEVEL: ${inputs.trainingLevel} — ${inputs.trainingLevel === "beginner" ? "conservative volume, focus on form, compound movements, simple progressions" : inputs.trainingLevel === "intermediate" ? "moderate volume, mix of compound + isolation, structured periodization" : "higher volume, advanced techniques (drop sets, supersets, tempo), aggressive periodization"}
4. RECOMMENDED SPLIT LOGIC: ${recommendedSplit}
5. Each workout day should have a clear session purpose: main lift/pattern, secondary work, accessories, core/corrective, then cardio if needed
6. Each exercise MUST have a specific form cue in notes field (not generic)
7. Include proper warm-up (5 min dynamic + movement-specific ramp-up) and cool-down (5 min static stretching)
8. Include 4-week periodization with specific weekly targets

9. NUTRITION must include SPECIFIC foods with portions (not vague like "protein source")
10. Calculate TDEE from Mifflin-St Jeor for this client, apply goal-appropriate deficit/surplus
11. Macro split must be CALCULATED for their bodyweight and goal (show the math logic in strategy)
12. mealsPerDay = ${inputs.mealsPerDay} — distribute calories across exactly this many meals
13. Respect nutritionPreference: ${inputs.nutritionPreference}
${inputs.allergiesDislikes ? `14. ALLERGIES/DISLIKES: "${inputs.allergiesDislikes}" — NEVER include these foods` : ""}
${inputs.injuries ? `15. INJURIES/CONDITIONS: "${inputs.injuries}" — program must be safe for this condition, include alternatives for contraindicated movements` : ""}

## COACHING DEPTH
- In workoutPlan.overview, explain the PT reasoning: why this split, why this volume, how it fits the goal and recovery
- In each exercise note, coach the rep as if standing next to the client
- In cardio fields, specify type, duration, intensity, and when to do it relative to lifting
- In nutritionPlan.strategy, include BMR, activity multiplier, TDEE, goal adjustment, final calories, and protein/fat/carb logic
- In sampleDay, use exactly ${inputs.mealsPerDay} meal blocks; each block needs 2-3 realistic options with grams/portions, kcal, and macros

## QUALITY CHECK
Before outputting, verify:
- Total macros: calories ≈ protein×4 + carbs×4 + fat×9 (±5%)
- Protein is 1.6-2.4g per kg bodyweight depending on goal
- Every workout day has 5-8 exercises with realistic sets/reps/rest
- Meal plan calories roughly match the macro targets
- All foods are practical and available in the user's locale
- The output does not look like a generic template; it reflects the profile, goal, level, location, injuries, preferences, and photo if present
${isEvaluation ? "- The output explicitly reflects the check-in: progress observations, what changed, what to keep, and what to adjust next" : ""}
`;
}

async function callOpenAIProgram(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  imageData?: string
): Promise<string> {
  const content: Array<Record<string, unknown>> = [{ type: "text", text: userPrompt }];
  if (imageData) {
    // High detail: body-composition / posture / muscle-balance assessment needs
    // real resolution. Image is already client-compressed to <=1280px, so the
    // extra vision tokens stay bounded while quality improves substantially.
    content.push({ type: "image_url", image_url: { url: imageData, detail: "high" } });
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL_VERSION_MAP.openai,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content },
      ],
      max_tokens: 8000,
      // 0.4 keeps macro math reliable while letting coaching language, exercise
      // selection, and meal variety read like a real PT wrote it (0.2 was too templated).
      temperature: 0.4,
      response_format: { type: "json_object" },
    }),
  });

  const rawBody = await response.text();
  if (!response.ok) {
    throw new Error(`OpenAI program API error ${response.status}: ${rawBody.substring(0, 500)}`);
  }

  const data = JSON.parse(rawBody) as {
    choices?: Array<{ message?: { content?: string } }>;
    usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
  };
  if (data.usage) {
    const inTok = data.usage.prompt_tokens ?? 0;
    const outTok = data.usage.completion_tokens ?? 0;
    const costUsd = (inTok * 2.5) / 1e6 + (outTok * 10) / 1e6;
    console.log("[OPENAI_COST] program", {
      model: MODEL_VERSION_MAP.openai,
      promptTokens: inTok,
      completionTokens: outTok,
      totalTokens: data.usage.total_tokens ?? inTok + outTok,
      costUsd: Number(costUsd.toFixed(5)),
    });
  }
  const outputText = data.choices?.[0]?.message?.content?.trim();
  if (!outputText) throw new Error("OpenAI program response had no content.");
  return outputText;
}

async function callGeminiProgram(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  imageData?: string
): Promise<string> {
  const model = MODEL_VERSION_MAP.gemini;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const parts: Array<Record<string, unknown>> = [{ text: userPrompt }];

  if (imageData) {
    const match = imageData.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
    if (!match) throw new Error("Invalid imageData for Gemini program generation.");
    parts.push({ inlineData: { mimeType: match[1], data: match[2] } });
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ parts }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 8000, responseMimeType: "application/json" },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Gemini program API error ${response.status}: ${body.substring(0, 500)}`);
  }

  const data = (await response.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
  const outputText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!outputText) throw new Error("Gemini program response had no content.");
  return outputText;
}

async function callAnthropicProgram(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  imageData?: string
): Promise<string> {
  const content: Array<Record<string, unknown>> = [{ type: "text", text: userPrompt }];
  if (imageData) {
    const match = imageData.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
    if (!match) throw new Error("Invalid imageData for Anthropic program generation.");
    content.unshift({ type: "image", source: { type: "base64", media_type: match[1], data: match[2] } });
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
      max_tokens: 8000,
      // Pin temperature so macro math stays reliable; default (1.0) was too high
      // for structured JSON + nutrition arithmetic.
      temperature: 0.4,
      system: systemPrompt,
      messages: [{ role: "user", content }],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Anthropic program API error ${response.status}: ${body.substring(0, 500)}`);
  }

  const data = (await response.json()) as { content?: { text?: string }[] };
  const outputText = data.content?.[0]?.text;
  if (!outputText) throw new Error("Anthropic program response had no content.");
  return outputText;
}

interface RawProgramResponse {
  safety?: { rejected?: boolean; reason?: string };
  targetSummary?: string;
  photoAnalysisSummary?: string;
  workoutPlan?: AIPersonalProgram["workoutPlan"];
  nutritionPlan?: AIPersonalProgram["nutritionPlan"];
  macros?: Partial<AIPersonalProgram["macros"]>;
  progressTracking?: string[];
  safetyNotes?: string[];
}

function parseProgramResponse(
  raw: string,
  inputs: ProgramProfileInputs
): Omit<AIPersonalProgram, "id" | "userId" | "createdAt" | "updatedAt" | "isActive"> {
  const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let parsed: RawProgramResponse;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("AI program returned invalid JSON.");
    parsed = JSON.parse(match[0]) as RawProgramResponse;
  }

  if (parsed.safety?.rejected) {
    throw new Error(`unsafe_program_photo: ${parsed.safety.reason || "Fotoğraf program analizi için uygun değil."}`);
  }

  const pm = getProgramMessages(inputs.locale);
  const safeMinCalories = inputs.age < 18 ? 1800 : inputs.gender === "female" ? 1300 : 1500;
  const calories = clamp(parsed.macros?.calories ?? estimateCalories(inputs), safeMinCalories, 6000);
  const protein = clamp(parsed.macros?.protein ?? Math.round(inputs.weightKg * 1.8), 40, 350);
  const fat = clamp(parsed.macros?.fat ?? Math.round((calories * 0.28) / 9), 25, 200);
  const carbs = clamp(parsed.macros?.carbs ?? Math.round((calories - protein * 4 - fat * 9) / 4), 50, 700);
  const fallbackWorkout = fallbackWorkoutPlan(inputs);
  const fallbackNutrition = fallbackNutritionPlan(inputs.locale);
  const workoutPlan = parsed.workoutPlan ?? fallbackWorkout;
  const nutritionPlan = parsed.nutritionPlan ?? fallbackNutrition;
  const weeklyPlan = normalizeWorkoutDays(workoutPlan.weeklyPlan, inputs);

  return {
    goal: inputs.goal,
    profileInputs: inputs,
    targetSummary: cleanText(parsed.targetSummary, pm.targetSummaryDefault),
    photoAnalysisSummary: cleanText(parsed.photoAnalysisSummary, ""),
    workoutPlan: {
      overview: cleanText(workoutPlan.overview, pm.overviewDefault),
      daysPerWeek: inputs.trainingDaysPerWeek,
      weeklyPlan,
      warmup: cleanText(workoutPlan.warmup, pm.warmup),
      cooldown: cleanText(workoutPlan.cooldown, pm.cooldown),
      cardio: cleanText(workoutPlan.cardio, pm.cardioGeneric),
      fourWeekProgression: normalizeStringList(workoutPlan.fourWeekProgression, pm.fourWeekProgression, 4),
    },
    nutritionPlan: {
      strategy: cleanText(nutritionPlan.strategy, pm.strategyDefault),
      sampleDay: normalizeMealOptions(nutritionPlan.sampleDay, inputs.locale),
      alternatives: normalizeMealOptions(nutritionPlan.alternatives, inputs.locale),
      water: cleanText(nutritionPlan.water, pm.waterDefault),
    },
    macros: { calories, protein, carbs, fat },
    progressTracking: normalizeStringList(parsed.progressTracking, pm.progressTracking, 6),
    safetyNotes: normalizeStringList(parsed.safetyNotes, pm.safetyNotes, 6),
  };
}

function normalizeWorkoutDays(
  value: unknown,
  inputs: ProgramProfileInputs
): AIPersonalProgram["workoutPlan"]["weeklyPlan"] {
  const fallback = fallbackWorkoutPlan(inputs).weeklyPlan;
  const rawDays = Array.isArray(value) ? value : [];
  const days = Array.from({ length: inputs.trainingDaysPerWeek }, (_, index) => {
    const day = rawDays[index] as AIPersonalProgram["workoutPlan"]["weeklyPlan"][number] | undefined;
    const fallbackDay = fallback[index] ?? fallback[0];
    return {
      day: cleanText(day?.day, fallbackDay.day),
      focus: cleanText(day?.focus, fallbackDay.focus),
      exercises: normalizeExercises(day?.exercises, fallbackDay.exercises, inputs),
      cardio: cleanText(day?.cardio, fallbackDay.cardio ?? ""),
    };
  });
  return days;
}

function normalizeExercises(
  value: unknown,
  fallback: AIPersonalProgram["workoutPlan"]["weeklyPlan"][number]["exercises"],
  inputs: ProgramProfileInputs
): AIPersonalProgram["workoutPlan"]["weeklyPlan"][number]["exercises"] {
  const pm = getProgramMessages(inputs.locale);
  const restDefault = `60-90 ${pm.secAbbr}`;
  const rawExercises = Array.isArray(value) ? value : fallback;
  const normalized = rawExercises.slice(0, 10).map((item) => {
    const ex = item as Partial<AIPersonalProgram["workoutPlan"]["weeklyPlan"][number]["exercises"][number]>;
    return {
      name: cleanText(ex.name, pm.exerciseDefault),
      sets: cleanText(ex.sets, inputs.trainingLevel === "beginner" ? "2-3" : "3-4"),
      reps: cleanText(ex.reps, "8-12"),
      rest: cleanText(ex.rest, restDefault),
      notes: cleanText(ex.notes, ""),
    };
  });
  for (const item of fallback) {
    if (normalized.length >= 5) break;
    normalized.push({
      name: cleanText(item.name, pm.exerciseDefault),
      sets: cleanText(item.sets, inputs.trainingLevel === "beginner" ? "2-3" : "3-4"),
      reps: cleanText(item.reps, "8-12"),
      rest: cleanText(item.rest, restDefault),
      notes: cleanText(item.notes, ""),
    });
  }
  return normalized.length > 0 ? normalized : fallback;
}

function fallbackWorkoutPlan(inputs: ProgramProfileInputs): AIPersonalProgram["workoutPlan"] {
  const pm = getProgramMessages(inputs.locale);
  const home = inputs.trainingLocation === "home";
  const beginner = inputs.trainingLevel === "beginner";
  const baseSets = beginner ? "2-3" : "3-4";
  const s = pm.secAbbr;
  const fallbackExercises = [
    {
      name: home ? "Bodyweight Squat" : "Goblet Squat",
      sets: baseSets,
      reps: beginner ? "8-10" : "10-12",
      rest: `75 ${s}`,
      notes: pm.exerciseNotes.squat,
    },
    {
      name: home ? "Band Row / Dumbbell Row" : "Lat Pulldown",
      sets: baseSets,
      reps: "10-12",
      rest: `75 ${s}`,
      notes: pm.exerciseNotes.row,
    },
    {
      name: home ? "Incline Push-up" : "Machine Chest Press",
      sets: baseSets,
      reps: beginner ? "6-10" : "8-12",
      rest: `75-90 ${s}`,
      notes: pm.exerciseNotes.push,
    },
    {
      name: home ? "Dumbbell Romanian Deadlift" : "Romanian Deadlift",
      sets: baseSets,
      reps: "8-12",
      rest: `90 ${s}`,
      notes: pm.exerciseNotes.rdl,
    },
    {
      name: home ? "Reverse Lunge" : "Walking Lunge",
      sets: beginner ? "2-3" : "3",
      reps: `8-10${pm.perFoot}`,
      rest: `60-75 ${s}`,
      notes: pm.exerciseNotes.lunge,
    },
    {
      name: "Plank",
      sets: "2-3",
      reps: `25-45 ${s}`,
      rest: `45-60 ${s}`,
      notes: pm.exerciseNotes.plank,
    },
  ];
  return {
    overview: pm.goalOverview[inputs.goal],
    daysPerWeek: inputs.trainingDaysPerWeek,
    weeklyPlan: Array.from({ length: inputs.trainingDaysPerWeek }, (_, index) => ({
      day: pm.dayLabel(index + 1),
      focus: index % 2 === 0 ? pm.fullBodyStrength : pm.conditioningCore,
      exercises: fallbackExercises,
      cardio: pm.goalCardio[inputs.goal],
    })),
    warmup: pm.warmup,
    cooldown: pm.cooldown,
    cardio: pm.goalCardio[inputs.goal],
    fourWeekProgression: pm.fourWeekProgression,
  };
}

function fallbackNutritionPlan(locale?: string): AIPersonalProgram["nutritionPlan"] {
  const pm = getProgramMessages(locale);
  return {
    strategy: pm.nutritionStrategy,
    sampleDay: [
      { meal: pm.breakfast, options: [pm.sampleBreakfast] },
      { meal: pm.lunch, options: [pm.sampleLunch] },
      { meal: pm.dinner, options: [pm.sampleDinner] },
    ],
    alternatives: [
      { meal: pm.proteinAlternativesLabel, options: pm.proteinAlternatives },
      { meal: pm.carbAlternativesLabel, options: pm.carbAlternatives },
    ],
    water: pm.nutritionWater,
  };
}

function estimateCalories(inputs: ProgramProfileInputs): number {
  const base = 10 * inputs.weightKg + 6.25 * inputs.heightCm - 5 * inputs.age;
  const bmr = inputs.gender === "female" ? base - 161 : base + 5;
  const activity = inputs.trainingDaysPerWeek <= 2 ? 1.35 : inputs.trainingDaysPerWeek <= 4 ? 1.5 : 1.65;
  const maintenance = bmr * activity;
  const adjustment: Record<ProgramProfileInputs["goal"], number> = {
    fat_loss: -350,
    muscle_gain: 200,
    fit_look: 0,
    weight_gain: 300,
    strength: 100,
    healthy_eating: 0,
  };
  return Math.round(maintenance + adjustment[inputs.goal]);
}

function cleanText(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, 1200) : fallback;
}

function normalizeStringList(value: unknown, fallback: string[], max: number): string[] {
  const list = Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : fallback;
  return list.map((item) => item.trim().slice(0, 400)).slice(0, max);
}

function normalizeMealOptions(value: unknown, locale?: string): AIPersonalProgram["nutritionPlan"]["sampleDay"] {
  const pm = getProgramMessages(locale);
  const fallback = [
    { meal: pm.breakfast, options: [pm.sampleBreakfast] },
    { meal: pm.lunch, options: [pm.sampleLunch] },
    { meal: pm.dinner, options: [pm.sampleDinner] },
  ];
  if (!Array.isArray(value)) return fallback;
  return value.slice(0, 8).map((item, index) => {
    const record = item as { meal?: unknown; options?: unknown };
    return {
      meal: cleanText(record.meal, pm.mealLabel(index + 1)),
      options: normalizeStringList(record.options, [pm.genericMealOption], 5),
    };
  });
}

function mockProgram(inputs: ProgramProfileInputs): Omit<AIPersonalProgram, "id" | "userId" | "createdAt" | "updatedAt" | "isActive"> {
  return parseProgramResponse(JSON.stringify({
    safety: { rejected: false, reason: "" },
    targetSummary: "Hedefine uygun, sürdürülebilir ve güvenli bir 4 haftalık başlangıç planı.",
    photoAnalysisSummary: "Fotoğraf analizi mock modunda yapılmadı; plan temel bilgilerine göre hazırlandı.",
    workoutPlan: {
      overview: "Seviyene uygun full-body odaklı plan.",
      daysPerWeek: inputs.trainingDaysPerWeek,
      weeklyPlan: Array.from({ length: inputs.trainingDaysPerWeek }, (_, i) => ({
        day: `Gün ${i + 1}`,
        focus: i % 2 === 0 ? "Full body kuvvet" : "Kondisyon ve core",
        exercises: [
          { name: inputs.trainingLocation === "gym" ? "Goblet Squat" : "Bodyweight Squat", sets: "3", reps: "10-12", rest: "75 sn", notes: "Kontrollü tempo." },
          { name: inputs.trainingLocation === "gym" ? "Lat Pulldown" : "Band Row", sets: "3", reps: "10-12", rest: "75 sn", notes: "Omuzları aşağıda tut." },
          { name: "Plank", sets: "3", reps: "30-45 sn", rest: "45 sn", notes: "Nefesi tutma." },
        ],
        cardio: "15-20 dk rahat tempo yürüyüş.",
      })),
      warmup: "5-8 dk hafif tempo + kalça/omuz mobilitesi.",
      cooldown: "5 dk hafif yürüyüş ve esneme.",
      cardio: "Haftada 2-3 kez düşük-orta yoğunlukta kardiyo.",
      fourWeekProgression: [
        "1. hafta adaptasyon ve teknik.",
        "2. hafta set veya tekrarları hafif artır.",
        "3. hafta kontrollü zorlanma.",
        "4. hafta değerlendirme ve deload.",
      ],
    },
    nutritionPlan: {
      strategy: "Protein odaklı, hedefe uygun kalori ve sürdürülebilir öğün düzeni.",
      sampleDay: [
        { meal: "Kahvaltı", options: ["Yumurta veya yoğurt + yulaf/tam tahıl + meyve"] },
        { meal: "Öğle", options: ["Tavuk/baklagil + pilav/bulgur + salata"] },
        { meal: "Akşam", options: ["Balık/et/tofu + sebze + hedefe uygun karbonhidrat"] },
      ],
      alternatives: [
        { meal: "Protein", options: ["Tavuk", "Yoğurt", "Baklagil", "Tofu"] },
      ],
      water: "Gün boyunca düzenli su iç; idman günlerinde artır.",
    },
    macros: {
      calories: estimateCalories(inputs),
      protein: Math.round(inputs.weightKg * 1.8),
      carbs: 220,
      fat: 70,
    },
    progressTracking: ["Haftalık ölçüm", "Antrenman kayıtları", "Enerji/uyku takibi"],
    safetyNotes: ["Genel bilgilendirme amaçlıdır; sağlık sorunu varsa uzmana danış."],
  }), inputs);
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
  modelVersion: string,
  locale?: string
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

  const msg = getScanMessages(locale);

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
        warnings.push(msg.caloriesRecalculated(raw.foodName || msg.genericItem));
      }
    }

    let grams = clamp(raw.edibleGrams ?? raw.grams, 1, 3000);
    const calPerGram = calories / grams;
    if (calories > 0 && (calPerGram > 9.5 || (calPerGram < 0.05 && grams > 10))) {
      calories = expectedCal > 0 ? Math.round(expectedCal) : 0;
      warnings.push(msg.extremeDensityFixed(raw.foodName || msg.genericItem));
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
      warnings.push(msg.singlePieceChickenReduced(raw.foodName || msg.chickenWord));
    }

    return {
      id: randomId(),
      name: typeof raw.foodName === "string" && raw.foodName.trim() ? raw.foodName.trim() : msg.defaultFoodName,
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
    items[i] = sanityCheckItem(items[i], warnings, msg);
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
    warnings.push(msg.totalRecalculated);
  }

  return {
    mealName: parsed.mealName || msg.defaultMealName,
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
    accuracyNote: parsed.accuracyNote || getAccuracyNote(locale),
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

// Trusted per-100g reference values (USDA / standard composition tables) for
// stable, high-frequency foods. Patterns are matched against the normalized
// (accent-folded, lower-cased) food name and cover tr/en/de/fr/es/it spellings.
// Ranges are intentionally wide so we only override the model on GROSS errors,
// never on plausible portion-driven variation. Zero API cost.
const KNOWN_FOOD_REFS: FoodRefRange[] = [
  // ── Eggs ──────────────────────────────────────────────────────────────
  {
    patterns: ["yumurta", "haslama yumurta", "haslanmis yumurta", "boiled egg", "huevo cocido", "oeuf dur", "uovo sodo"],
    exclude: ["omlet", "omelet", "menemen", "sucuklu", "pastirmali", "sahanda", "kaygana", "fried", "scrambled"],
    calPer100g: [120, 200],
    ref: { cal: 155, p: 13, c: 1.1, f: 11, fib: 0 },
  },
  {
    patterns: ["sahanda yumurta", "fried egg", "huevo frito", "oeuf au plat", "spiegelei", "uovo fritto"],
    calPer100g: [150, 250],
    ref: { cal: 196, p: 13.6, c: 0.7, f: 15.3, fib: 0 },
  },
  {
    patterns: ["omlet", "omelet", "omelette", "omelett", "tortilla francesa"],
    exclude: ["peynirli", "sebzeli", "cheese", "vegetable"],
    calPer100g: [140, 220],
    ref: { cal: 185, p: 13, c: 1, f: 14, fib: 0 },
  },
  // ── Grains / starches ────────────────────────────────────────────────
  {
    patterns: ["beyaz pirinc pilav", "pirinc pilavi", "sade pilav", "white rice", "boiled rice", "steamed rice", "arroz blanco", "riz blanc", "riso bianco", "reis"],
    exclude: ["fried", "kizar", "pirzola"],
    calPer100g: [110, 200],
    ref: { cal: 130, p: 2.7, c: 28, f: 0.3, fib: 0 },
  },
  {
    patterns: ["tereyagli pilav", "sehriyeli pilav", "buttered rice", "fried rice", "arroz frito"],
    calPer100g: [140, 230],
    ref: { cal: 175, p: 3.5, c: 30, f: 5, fib: 0 },
  },
  {
    patterns: ["makarna", "pasta", "spaghetti", "spagetti", "penne", "fusilli", "noodle", "fideos", "nouilles", "pates", "nudeln"],
    exclude: ["kremali", "kiymali", "creamy", "bolognese", "carbonara", "sauce", "sos"],
    calPer100g: [110, 190],
    ref: { cal: 131, p: 5, c: 25, f: 1.1, fib: 1.8 },
  },
  {
    patterns: ["beyaz ekmek", "ekmek dilim", "white bread", "bread slice", "pan blanco", "pain blanc", "weissbrot", "pane bianco", "baguette"],
    exclude: ["tam bugday", "whole", "integral", "complet", "vollkorn"],
    calPer100g: [230, 300],
    ref: { cal: 265, p: 9, c: 49, f: 3.2, fib: 2.7 },
  },
  {
    patterns: ["haslanmis patates", "haslama patates", "boiled potato", "patata cocida", "pomme de terre", "gekochte kartoffel", "patata lessa"],
    exclude: ["kizar", "fried", "frite", "frita", "puree", "chips", "cips"],
    calPer100g: [60, 120],
    ref: { cal: 87, p: 1.9, c: 20, f: 0.1, fib: 1.8 },
  },
  {
    patterns: ["patates kizartmasi", "kizarmis patates", "french fries", "papas fritas", "patatas fritas", "pommes frites", "pommes", "patatine fritte", "frites"],
    calPer100g: [220, 420],
    ref: { cal: 312, p: 3.4, c: 41, f: 15, fib: 3.8 },
  },
  // ── Proteins ─────────────────────────────────────────────────────────
  {
    patterns: ["tavuk gogsu", "chicken breast", "pechuga", "blanc de poulet", "petto di pollo", "hahnchenbrust"],
    exclude: ["kizartma", "kizar", "paneli", "fried", "crispy", "tatli"],
    calPer100g: [130, 220],
    ref: { cal: 165, p: 31, c: 0, f: 3.6, fib: 0 },
  },
  {
    patterns: ["somon", "salmon", "saumon", "lachs", "salmone"],
    exclude: ["fume", "smoked", "ahumado"],
    calPer100g: [150, 280],
    ref: { cal: 208, p: 20, c: 0, f: 13, fib: 0 },
  },
  // ── Fruit ────────────────────────────────────────────────────────────
  {
    patterns: ["muz", "banana", "banane", "platano", "platine"],
    calPer100g: [60, 130],
    ref: { cal: 89, p: 1.1, c: 23, f: 0.3, fib: 2.6 },
  },
  {
    patterns: ["elma", "apple", "manzana", "pomme", "apfel"],
    exclude: ["pineapple", "ananas", "juice", "suyu", "jus", "terre", "frite", "frita", "kizar", "recel", "jam", "marmela", "confiture", "pie", "turta", "tart", "sos", "sauce"],
    calPer100g: [35, 90],
    ref: { cal: 52, p: 0.3, c: 14, f: 0.2, fib: 2.4 },
  },
  {
    patterns: ["portakal", "orange", "naranja", "arancia", "apfelsine"],
    exclude: ["juice", "suyu", "jus", "zumo"],
    calPer100g: [30, 80],
    ref: { cal: 47, p: 0.9, c: 12, f: 0.1, fib: 2.4 },
  },
  {
    patterns: ["cilek", "strawberry", "fresa", "fraise", "fragola", "erdbeere"],
    calPer100g: [20, 60],
    ref: { cal: 32, p: 0.7, c: 7.7, f: 0.3, fib: 2 },
  },
  {
    patterns: ["karpuz", "watermelon", "sandia", "pasteque", "wassermelone", "anguria"],
    calPer100g: [18, 55],
    ref: { cal: 30, p: 0.6, c: 7.6, f: 0.2, fib: 0.4 },
  },
  {
    patterns: ["avokado", "avocado", "aguacate"],
    calPer100g: [120, 230],
    ref: { cal: 160, p: 2, c: 9, f: 15, fib: 7 },
  },
  // ── Vegetables ───────────────────────────────────────────────────────
  {
    patterns: ["domates", "tomato", "tomate", "pomodoro"],
    exclude: ["corba", "soup", "sos", "sauce", "salsa", "ketcap", "ketchup", "kurutulmus", "dried"],
    calPer100g: [10, 40],
    ref: { cal: 18, p: 0.9, c: 3.9, f: 0.2, fib: 1.2 },
  },
  {
    patterns: ["salatalik", "cucumber", "pepino", "concombre", "gurke", "cetriolo"],
    exclude: ["tursu", "pickle", "encurtido"],
    calPer100g: [8, 30],
    ref: { cal: 15, p: 0.7, c: 3.6, f: 0.1, fib: 0.5 },
  },
  {
    patterns: ["brokoli", "broccoli", "brocoli", "brokkoli"],
    calPer100g: [20, 70],
    ref: { cal: 35, p: 2.4, c: 7, f: 0.4, fib: 3.3 },
  },
  // ── Dairy ────────────────────────────────────────────────────────────
  {
    patterns: ["sut", "milk", "leche", "lait", "milch"],
    exclude: ["sutlac", "sutlu", "tatli", "puding", "pudding", "kakao", "cocoa", "cikolata", "chocolate", "kahve", "coffee", "latte", "badem", "almond", "soya", "soy", "yulaf", "oat", "milkshake", "tozu", "powder"],
    calPer100g: [35, 90],
    ref: { cal: 61, p: 3.2, c: 4.8, f: 3.3, fib: 0 },
  },
  {
    patterns: ["yogurt", "yoghurt", "yaourt", "joghurt"],
    exclude: ["tatli", "meyveli", "fruit", "dondurma", "ice cream", "kavun", "drink", "icecek"],
    calPer100g: [40, 120],
    ref: { cal: 61, p: 3.5, c: 4.7, f: 3.3, fib: 0 },
  },
  {
    patterns: ["beyaz peynir", "feta", "white cheese"],
    calPer100g: [180, 340],
    ref: { cal: 264, p: 14, c: 4, f: 21, fib: 0 },
  },
  // ── Nuts / fats / sweeteners ─────────────────────────────────────────
  {
    patterns: ["zeytinyagi", "olive oil", "aceite de oliva", "huile d olive", "olivenol", "olio d oliva", "olio di oliva"],
    calPer100g: [800, 905],
    ref: { cal: 884, p: 0, c: 0, f: 100, fib: 0 },
  },
  {
    patterns: ["tereyag", "butter", "mantequilla", "beurre", "burro", "boter"],
    exclude: ["fistik", "peanut", "cacahuete", "badem", "almond", "yer fistigi"],
    calPer100g: [640, 770],
    ref: { cal: 717, p: 0.9, c: 0.1, f: 81, fib: 0 },
  },
  {
    patterns: ["badem", "almond", "almendra", "amande", "mandel", "mandorla"],
    exclude: ["sutu", "milk", "leche", "ezme", "butter", "lait"],
    calPer100g: [520, 650],
    ref: { cal: 579, p: 21, c: 22, f: 50, fib: 12.5 },
  },
  {
    patterns: ["ceviz", "walnut", "nuez", "noix", "walnuss", "noce"],
    calPer100g: [600, 720],
    ref: { cal: 654, p: 15, c: 14, f: 65, fib: 6.7 },
  },
  {
    patterns: ["yer fistigi", "peanut", "cacahuete", "arachide", "erdnuss"],
    exclude: ["ezme", "butter", "yag"],
    calPer100g: [520, 630],
    ref: { cal: 567, p: 26, c: 16, f: 49, fib: 8.5 },
  },
];

/**
 * Locale-agnostic name normalization. Folds Turkish-specific letters AND
 * strips Latin diacritics (é, ü, ö, ñ, à, ç …) via NFD so the grounding
 * table can match food names in tr/en/de/fr/es/it with a single pattern set.
 */
function normalizeTr(s: string): string {
  return s
    .replace(/İ/g, "i").replace(/I/g, "i")
    .toLowerCase()
    .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ş/g, "s").replace(/ç/g, "c")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * If the AI returned a known food but with obviously wrong cal/100g,
 * recalculate macros from reference values. Returns corrected item or original.
 */
function sanityCheckItem(
  item: AnalysisItem,
  warnings: string[],
  msg: ReturnType<typeof getScanMessages>
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
      msg.refValuesCorrected(item.name, Math.round(calPer100g), ref.ref.cal)
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
