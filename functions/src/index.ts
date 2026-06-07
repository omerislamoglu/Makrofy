import * as admin from "firebase-admin";
import { defineSecret } from "firebase-functions/params";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { analyzeWithAI, aiApiKey } from "./ai";
import { validateRequest } from "./validation";
import type {
  MealDocument,
  AnalyzeMealRequest,
  AnalyzeMealResponse,
  SaveAnalyzedMealRequest,
  SaveAnalyzedMealResponse,
} from "./types";

// ─── Firebase init ─────────────────────────────────────────────────────────

admin.initializeApp();

const db = admin.firestore();
const FREE_DAILY_AI_SCAN_LIMIT = 0;
const PRO_DAILY_AI_SCAN_LIMIT = 5;
const REVENUECAT_ENTITLEMENT_ID = "Makrofy Pro";
const REVENUECAT_PRODUCT_IDS = new Set([
  "makrofy_pro_monthly",
  "makrofy_pro_quarterly",
  "makrofy_pro_yearly",
]);
const revenueCatApiKey = defineSecret("REVENUECAT_API_KEY");
const revenueCatSecretKey = defineSecret("REVENUECAT_SECRET_KEY");
const MAX_REVENUECAT_LOOKUP_IDS = 3;

type ServerProStatus = {
  isPro: boolean;
  source: "users" | "subscriptions" | "revenuecat" | "none";
  expiresAt?: string | null;
  revenueCatUserId?: string | null;
};

function timestampLikeToMillis(value: unknown): number | null {
  if (!value) return null;
  if (value instanceof admin.firestore.Timestamp) return value.toMillis();
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? null : parsed;
  }
  if (typeof value === "number") return value;
  if (typeof value === "object" && "toDate" in value && typeof value.toDate === "function") {
    const date = value.toDate() as Date;
    return date instanceof Date && !Number.isNaN(date.getTime()) ? date.getTime() : null;
  }
  return null;
}

function isActiveSubscriptionStatus(status: unknown): boolean {
  return status === "active" || status === "trialing" || status === "intro";
}

function hasNotExpired(expiresAt: unknown): boolean {
  const expiresAtMs = timestampLikeToMillis(expiresAt);
  return expiresAtMs === null || expiresAtMs > Date.now();
}

function normalizeProductId(productId: unknown): string {
  return typeof productId === "string" ? productId.trim().toLowerCase() : "";
}

function isKnownProProduct(productId: unknown): boolean {
  const normalized = normalizeProductId(productId);
  return REVENUECAT_PRODUCT_IDS.has(normalized) || normalized.includes("makrofy_pro");
}

function isRevenueCatAppUserId(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.trim().length <= 256;
}

function uniqueLookupIds(userId: string, extraIds: string[] = []): string[] {
  const ids = [userId, ...extraIds]
    .map((id) => id.trim())
    .filter((id) => id.length > 0);
  return [...new Set(ids)].slice(0, MAX_REVENUECAT_LOOKUP_IDS);
}

async function getFirestoreSubscriptionProStatus(userId: string): Promise<ServerProStatus> {
  const snap = await db.collection("subscriptions").doc(userId).get();
  if (!snap.exists) return { isPro: false, source: "none" };

  const data = snap.data() ?? {};
  const isPro = isActiveSubscriptionStatus(data.status) && hasNotExpired(data.expiresAt);

  return {
    isPro,
    source: isPro ? "subscriptions" : "none",
    expiresAt: typeof data.expiresAt === "string" ? data.expiresAt : null,
  };
}

async function getRevenueCatProStatus(userId: string): Promise<ServerProStatus> {
  // Prefer secret key for server-side API calls (higher privileges)
  const apiKey =
    revenueCatSecretKey.value() ||
    process.env.REVENUECAT_SECRET_KEY ||
    revenueCatApiKey.value() ||
    process.env.REVENUECAT_API_KEY;
  if (!apiKey) return { isPro: false, source: "none" };

  const endpoint = `https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(userId)}`;
  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    const body = await response.text();
    console.error("[REVENUECAT_STATUS_ERROR]", {
      userId,
      status: response.status,
      body: body.substring(0, 500),
    });
    return { isPro: false, source: "none" };
  }

  const data = await response.json() as {
    subscriber?: {
      entitlements?: Record<string, {
        expires_date?: string | null;
        product_identifier?: string;
      }>;
      subscriptions?: Record<string, {
        expires_date?: string | null;
        product_identifier?: string;
      }>;
      original_app_user_id?: string;
    };
  };
  const entitlements = data.subscriber?.entitlements ?? {};
  const entitlement =
    entitlements[REVENUECAT_ENTITLEMENT_ID] ??
    Object.values(entitlements).find((item) => hasNotExpired(item.expires_date));
  const activeProductId = Object.entries(data.subscriber?.subscriptions ?? {}).find(
    ([productId, subscription]) =>
      hasNotExpired(subscription.expires_date) &&
      (isKnownProProduct(productId) || isKnownProProduct(subscription.product_identifier))
  )?.[0];

  if (!entitlement && !activeProductId) {
    console.warn("[REVENUECAT_NO_ACTIVE_PRO]", {
      userId,
      entitlementKeys: Object.keys(data.subscriber?.entitlements ?? {}),
      subscriptionProductIds: Object.keys(data.subscriber?.subscriptions ?? {}),
    });
    return { isPro: false, source: "none" };
  }

  const expiresAt = entitlement?.expires_date ??
    data.subscriber?.subscriptions?.[activeProductId ?? ""]?.expires_date ??
    null;
  const expiresAtMs = timestampLikeToMillis(expiresAt);
  const isPro = expiresAtMs === null || expiresAtMs > Date.now();

  return {
    isPro,
    source: isPro ? "revenuecat" : "none",
    expiresAt,
    revenueCatUserId: data.subscriber?.original_app_user_id ?? userId,
  };
}

async function getRevenueCatProStatusForAnyId(userId: string, lookupIds: string[] = []): Promise<ServerProStatus> {
  const ids = uniqueLookupIds(userId, lookupIds);
  let lastStatus: ServerProStatus = { isPro: false, source: "none" };

  for (const id of ids) {
    const status = await getRevenueCatProStatus(id);
    if (status.isPro) return status;
    lastStatus = status;
  }

  return lastStatus;
}

async function resolveServerProStatus(userId: string, revenueCatLookupIds: string[] = []): Promise<ServerProStatus> {
  const userRef = db.collection("users").doc(userId);
  const userSnap = await userRef.get();
  const userData = userSnap.exists ? userSnap.data() ?? {} : {};
  const userIsPro = userData.isPro === true;
  const userProHasNotExpired = hasNotExpired(userData.proExpiresAt);

  if (userIsPro && userProHasNotExpired) {
    return {
      isPro: true,
      source: "users",
      expiresAt: typeof userData.proExpiresAt === "string" ? userData.proExpiresAt : null,
    };
  }

  const subscriptionStatus = await getFirestoreSubscriptionProStatus(userId);
  if (subscriptionStatus.isPro) {
    await userRef.set({
      isPro: true,
      proSource: subscriptionStatus.source,
      proExpiresAt: subscriptionStatus.expiresAt ?? null,
      updatedAt: admin.firestore.Timestamp.now(),
    }, { merge: true });
    return subscriptionStatus;
  }

  const storedRevenueCatId = isRevenueCatAppUserId(userData.revenueCatAppUserId)
    ? userData.revenueCatAppUserId
    : null;
  const revenueCatStatus = await getRevenueCatProStatusForAnyId(
    userId,
    [...revenueCatLookupIds, ...(storedRevenueCatId ? [storedRevenueCatId] : [])]
  );
  if (revenueCatStatus.isPro) {
    await userRef.set({
      isPro: true,
      proSource: revenueCatStatus.source,
      proExpiresAt: revenueCatStatus.expiresAt ?? null,
      revenueCatAppUserId: revenueCatStatus.revenueCatUserId ?? storedRevenueCatId ?? userId,
      updatedAt: admin.firestore.Timestamp.now(),
    }, { merge: true });
    return revenueCatStatus;
  }

  if (userIsPro && !userProHasNotExpired) {
    await userRef.set({
      isPro: false,
      proSource: "none",
      updatedAt: admin.firestore.Timestamp.now(),
    }, { merge: true });
  }

  console.warn("[SERVER_PRO_STATUS_DENIED]", {
    userId,
    userIsPro,
    userProHasNotExpired,
    subscriptionSource: subscriptionStatus.source,
    revenueCatSource: revenueCatStatus.source,
    revenueCatLookupIds: uniqueLookupIds(userId, revenueCatLookupIds),
  });

  return { isPro: false, source: "none" };
}

async function deleteCollection(path: string, batchSize = 100): Promise<number> {
  let deleted = 0;

  while (true) {
    const snap = await db.collection(path).limit(batchSize).get();
    if (snap.empty) break;

    const batch = db.batch();
    snap.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
    deleted += snap.size;

    if (snap.size < batchSize) break;
  }

  return deleted;
}

function getTodayKey(): string {
  // Use Turkey timezone (UTC+3) to match the client-side getToday()
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Istanbul" });
}

async function reserveAiScanQuota(userId: string): Promise<{ dateKey: string }> {
  const userRef = db.collection("users").doc(userId);
  const dateKey = getTodayKey();
  const serverProStatus = await resolveServerProStatus(userId);

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(userRef);
    const data = snap.exists ? snap.data() ?? {} : {};
    const isPro = serverProStatus.isPro || data.isPro === true;
    const limit = isPro ? PRO_DAILY_AI_SCAN_LIMIT : FREE_DAILY_AI_SCAN_LIMIT;

    if (limit <= 0) {
      throw new HttpsError(
        "failed-precondition",
        "AI photo analysis is available for Pro users only."
      );
    }

    const storedDate = typeof data.aiScanDate === "string" ? data.aiScanDate : "";
    const used = storedDate === dateKey && typeof data.aiScanDailyCount === "number"
      ? data.aiScanDailyCount
      : 0;

    if (used >= limit) {
      throw new HttpsError(
        "resource-exhausted",
        `Daily AI scan limit reached. Pro users can scan ${PRO_DAILY_AI_SCAN_LIMIT} meals per day.`
      );
    }

    tx.set(userRef, {
      aiScanDate: dateKey,
      aiScanDailyCount: used + 1,
      updatedAt: admin.firestore.Timestamp.now(),
    }, { merge: true });
  });

  return { dateKey };
}

async function refundAiScanQuota(userId: string, dateKey: string): Promise<void> {
  const userRef = db.collection("users").doc(userId);
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(userRef);
    if (!snap.exists) return;
    const data = snap.data() ?? {};
    if (data.aiScanDate !== dateKey || typeof data.aiScanDailyCount !== "number") return;
    tx.set(userRef, {
      aiScanDailyCount: Math.max(0, data.aiScanDailyCount - 1),
      updatedAt: admin.firestore.Timestamp.now(),
    }, { merge: true });
  });
}

// ─── Cloud Function: analyzeMealImage ──────────────────────────────────────

export const analyzeMealImage = onCall<AnalyzeMealRequest>(
  {
    // Enforce that only authenticated users can call this function.
    // Unauthenticated requests are rejected before our code runs.
    enforceAppCheck: false, // enable when App Check is configured
    invoker: "public",
    secrets: [aiApiKey, revenueCatApiKey, revenueCatSecretKey],
    maxInstances: 20,
    timeoutSeconds: 120,
    memory: "512MiB",
  },
  async (request): Promise<AnalyzeMealResponse> => {
    // ── 1. Verify Firebase Auth token ──────────────────────────────────
    const auth = request.auth;
    if (!auth) {
      throw new HttpsError(
        "unauthenticated",
        "You must be signed in to scan meals."
      );
    }
    const userId = auth.uid;

    // ── 2. Validate request payload ────────────────────────────────────
    const { imageUrl, mealTypeHint, gramNotes } = validateRequest(request.data);

    // ── 3. Enforce subscription scan quota before calling AI ───────────
    const quota = await reserveAiScanQuota(userId);

    // ── 4. Call AI vision model ──────────────────────────────────────
    // Meal is NOT saved here. The client saves only when the user taps Save.
    let analysis: Awaited<ReturnType<typeof analyzeWithAI>>;
    try {
      analysis = await analyzeWithAI(imageUrl, mealTypeHint, gramNotes);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const lowerMessage = message.toLowerCase();

      // Log the full error for debugging
      console.error("[OPENAI_ANALYZE_ERROR]", {
        name: error instanceof Error ? error.name : "unknown",
        message,
        stack: error instanceof Error ? error.stack : undefined,
        status: (error as Record<string, unknown>)?.status,
        code: (error as Record<string, unknown>)?.code,
        type: (error as Record<string, unknown>)?.type,
      });

      // Determine if the error is transient (server-side / infra) → refund quota
      // vs user/config fault (no food, bad image, bad API key) → do NOT refund
      const isTransientError =
        lowerMessage.includes("timeout") ||
        lowerMessage.includes("deadline") ||
        lowerMessage.includes("timed out") ||
        lowerMessage.includes("rate limited") ||
        lowerMessage.includes("error 429") ||
        lowerMessage.includes("error 500") ||
        lowerMessage.includes("error 502") ||
        lowerMessage.includes("error 503") ||
        lowerMessage.includes("insufficient_quota") ||
        lowerMessage.includes("exceeded your current quota") ||
        lowerMessage.includes("invalid json") ||
        lowerMessage.includes("ai returned invalid json");

      if (isTransientError) {
        await refundAiScanQuota(userId, quota.dateKey).catch((refundError) => {
          console.error("[AI_SCAN_QUOTA_REFUND_ERROR]", refundError);
        });
      }

      // Missing API key
      if (message.includes("is missing in Cloud Functions")) {
        throw new HttpsError(
          "failed-precondition",
          "OpenAI API key is not configured. Set AI_VISION_API_KEY in Firebase secrets."
        );
      }

      // OpenAI 401 — invalid key
      if (
        message.includes("API key invalid") ||
        message.includes("API_KEY_INVALID") ||
        message.includes("API key not valid") ||
        message.includes("invalid API key") ||
        message.includes("error 401")
      ) {
        throw new HttpsError(
          "failed-precondition",
          "OpenAI API key is invalid. Update AI_VISION_API_KEY in Firebase secrets."
        );
      }

      // OpenAI 429 — rate limited / quota
      if (
        message.includes("insufficient_quota") ||
        message.includes("exceeded your current quota") ||
        message.includes("Rate limited") ||
        message.includes("error 429")
      ) {
        throw new HttpsError(
          "resource-exhausted",
          "OpenAI rate limited or quota exceeded. Check your billing at platform.openai.com."
        );
      }

      // OpenAI 400 — bad request
      if (message.includes("error 400")) {
        throw new HttpsError(
          "invalid-argument",
          `OpenAI rejected the request: ${message.substring(0, 300)}`
        );
      }

      // No food detected in image
      if (message.startsWith("no_food_detected:") || message.includes("no food items")) {
        const detail = message.replace(/^no_food_detected:\s*/, "").trim() ||
          "Fotoğrafta yiyecek tespit edilemedi.";
        throw new HttpsError("not-found", detail, { code: "no_food_detected" });
      }

      // AI returned invalid JSON
      if (message.includes("invalid JSON") || message.includes("AI returned invalid JSON")) {
        throw new HttpsError(
          "internal",
          "AI geçersiz yanıt döndürdü. Lütfen tekrar deneyin."
        );
      }

      // Provider timeout / deadline
      if (
        lowerMessage.includes("timeout") ||
        lowerMessage.includes("deadline") ||
        lowerMessage.includes("timed out")
      ) {
        throw new HttpsError(
          "deadline-exceeded",
          "Analiz zaman aşımına uğradı. Lütfen tekrar deneyin."
        );
      }

      // Generic fallback — no refund for unknown errors
      throw new HttpsError(
        "internal",
        `Analysis failed: ${message.substring(0, 200)}`
      );
    }

    // ── 5. Track scan count for analytics (fire-and-forget) ──────────
    const userRef = db.collection("users").doc(userId);
    const now = admin.firestore.Timestamp.now();
    userRef.set({
      scanCount: admin.firestore.FieldValue.increment(1),
      updatedAt: now,
    }, { merge: true }).catch((err) => {
      console.error("[SCAN_COUNT_UPDATE_ERROR]", err);
    });

    // ── 6. Return analysis only — no meal document created ───────────
    return {
      success: true,
      analysis,
    };
  }
);

// ─── Cloud Function: syncSubscriptionStatus ───────────────────────────────

interface SyncSubscriptionStatusResponse {
  success: boolean;
  isPro: boolean;
  source: ServerProStatus["source"];
  expiresAt?: string | null;
}

interface SyncSubscriptionStatusRequest {
  revenueCatAppUserId?: string;
}

export const syncSubscriptionStatus = onCall<SyncSubscriptionStatusRequest>(
  {
    enforceAppCheck: false,
    invoker: "public",
    secrets: [revenueCatApiKey, revenueCatSecretKey],
    maxInstances: 20,
    timeoutSeconds: 20,
    memory: "256MiB",
  },
  async (request): Promise<SyncSubscriptionStatusResponse> => {
    const auth = request.auth;
    if (!auth) {
      throw new HttpsError("unauthenticated", "You must be signed in.");
    }

    const revenueCatAppUserId = isRevenueCatAppUserId(request.data?.revenueCatAppUserId)
      ? request.data.revenueCatAppUserId.trim()
      : null;
    const status = await resolveServerProStatus(
      auth.uid,
      revenueCatAppUserId ? [revenueCatAppUserId] : []
    );
    if (!status.isPro) {
      throw new HttpsError(
        "failed-precondition",
        "Active Pro subscription could not be verified."
      );
    }

    return {
      success: true,
      isPro: true,
      source: status.source,
      expiresAt: status.expiresAt ?? null,
    };
  }
);

// ─── Cloud Function: getMealsForDate ──────────────────────────────────────

interface GetMealsRequest {
  dateKey: string;
}

interface GetMealsResponse {
  success: boolean;
  meals: Array<Record<string, unknown> & { id: string }>;
}

export const getMealsForDate = onCall<GetMealsRequest>(
  {
    enforceAppCheck: false,
    invoker: "public",
    maxInstances: 20,
    timeoutSeconds: 15,
    memory: "256MiB",
  },
  async (request): Promise<GetMealsResponse> => {
    const auth = request.auth;
    if (!auth) {
      throw new HttpsError("unauthenticated", "You must be signed in.");
    }
    const userId = auth.uid;
    const dateKey = request.data?.dateKey;

    if (!dateKey || typeof dateKey !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
      throw new HttpsError("invalid-argument", "dateKey must be YYYY-MM-DD.");
    }

    const snap = await db
      .collection("users")
      .doc(userId)
      .collection("meals")
      .where("dateKey", "==", dateKey)
      .get();

    const meals = snap.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        // Convert Timestamps to ISO strings for client
        createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() ?? data.updatedAt,
      };
    });

    // Sort by createdAt desc
    meals.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));

    console.log("[getMealsForDate]", { userId, dateKey, count: meals.length });

    return { success: true, meals };
  }
);

// ─── Cloud Function: saveAnalyzedMeal ─────────────────────────────────────
// Used by BOTH AI scan saves and manual/text/restaurant saves on native iOS.

export const saveAnalyzedMeal = onCall<SaveAnalyzedMealRequest>(
  {
    enforceAppCheck: false,
    invoker: "public",
    maxInstances: 40,
    timeoutSeconds: 15,
    memory: "256MiB",
  },
  async (request): Promise<SaveAnalyzedMealResponse> => {
    const auth = request.auth;
    if (!auth) {
      throw new HttpsError("unauthenticated", "You must be signed in to save meals.");
    }

    const userId = auth.uid;
    const body = request.data;
    const meal = body?.meal;

    if (!meal || !Array.isArray(meal.items) || meal.items.length === 0) {
      throw new HttpsError("invalid-argument", "Meal items are required.");
    }
    if (meal.items.length > 50) {
      throw new HttpsError("invalid-argument", "Too many items (max 50).");
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(meal.dateKey)) {
      throw new HttpsError("invalid-argument", "dateKey must be in YYYY-MM-DD format.");
    }

    const validMealTypes = new Set(["breakfast", "lunch", "dinner", "snack"]);
    if (!validMealTypes.has(meal.mealType)) {
      throw new HttpsError("invalid-argument", "Invalid mealType.");
    }

    // Sanitize individual items to prevent malicious data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sanitizedItems = (meal.items as any[]).map((item) => {
      const name = typeof item.name === "string" && item.name.trim() ? item.name.trim().slice(0, 200) : "Yemek";
      const grams = Math.max(0, Math.min(5000, Math.round(Number(item.grams) || 0)));
      const macros = item.macros && typeof item.macros === "object" ? item.macros : {};
      return {
        ...item,
        id: typeof item.id === "string" ? item.id : Math.random().toString(36).slice(2, 22),
        name,
        grams,
        macros: {
          calories: Math.max(0, Math.min(10000, Math.round(Number(macros.calories) || 0))),
          protein: Math.max(0, Math.min(1000, Math.round(Number(macros.protein) || 0))),
          carbs: Math.max(0, Math.min(2000, Math.round(Number(macros.carbs) || 0))),
          fat: Math.max(0, Math.min(1000, Math.round(Number(macros.fat) || 0))),
          fiber: Math.max(0, Math.min(500, Math.round(Number(macros.fiber) || 0))),
        },
      };
    });

    const totalMacros = {
      calories: Math.max(0, Math.round(meal.totalMacros?.calories ?? 0)),
      protein: Math.max(0, Math.round(meal.totalMacros?.protein ?? 0)),
      carbs: Math.max(0, Math.round(meal.totalMacros?.carbs ?? 0)),
      fat: Math.max(0, Math.round(meal.totalMacros?.fat ?? 0)),
      fiber: Math.max(0, Math.round(meal.totalMacros?.fiber ?? 0)),
    };
    const quantity = sanitizedItems.reduce(
      (sum: number, item: { grams: number }) => sum + item.grams,
      0
    );
    const now = admin.firestore.Timestamp.now();

    // For updates use existing doc; for new meals generate a fresh doc (skip read)
    const mealRef = body.mealId
      ? db.collection("users").doc(userId).collection("meals").doc(body.mealId)
      : db.collection("users").doc(userId).collection("meals").doc();

    const isUpdate = !!body.mealId;
    let createdAt = now;
    if (isUpdate) {
      const existingSnap = await mealRef.get();
      if (existingSnap.exists) {
        createdAt = (existingSnap.data()?.createdAt as admin.firestore.Timestamp | undefined) ?? now;
      }
    }

    const mealData: MealDocument = {
      userId,
      name: meal.name ?? meal.notes ?? (meal.items.map((item: { name?: string }) => item.name).join(" · ") || "Öğün"),
      items: sanitizedItems,
      totalMacros,
      calories: totalMacros.calories,
      protein: totalMacros.protein,
      carbs: totalMacros.carbs,
      fat: totalMacros.fat,
      fiber: totalMacros.fiber,
      quantity,
      mealType: meal.mealType,
      source: meal.source === "manual" ? "manual" : "ai_scan",
      ...(meal.imageUrl && { imageUrl: meal.imageUrl }),
      ...(meal.confidence && { confidence: meal.confidence }),
      dateKey: meal.dateKey,
      createdAt,
      updatedAt: now,
    };

    await mealRef.set(mealData, { merge: true });
    console.log("[saveMeal]", { userId, mealId: mealRef.id, source: mealData.source, items: meal.items.length });
    return { success: true, mealId: mealRef.id };
  }
);

// ─── Cloud Function: getMealsForRange ────────────────────────────────────

interface GetMealsForRangeRequest {
  startDateKey: string;
  endDateKey: string;
}

interface GetMealsForRangeResponse {
  success: boolean;
  meals: Array<Record<string, unknown> & { id: string }>;
}

export const getMealsForRange = onCall<GetMealsForRangeRequest>(
  {
    enforceAppCheck: false,
    invoker: "public",
    maxInstances: 20,
    timeoutSeconds: 15,
    memory: "256MiB",
  },
  async (request): Promise<GetMealsForRangeResponse> => {
    const auth = request.auth;
    if (!auth) {
      throw new HttpsError("unauthenticated", "You must be signed in.");
    }
    const userId = auth.uid;
    const startDateKey = request.data?.startDateKey;
    const endDateKey = request.data?.endDateKey;

    if (!startDateKey || typeof startDateKey !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(startDateKey)) {
      throw new HttpsError("invalid-argument", "startDateKey must be YYYY-MM-DD.");
    }
    if (!endDateKey || typeof endDateKey !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(endDateKey)) {
      throw new HttpsError("invalid-argument", "endDateKey must be YYYY-MM-DD.");
    }

    const snap = await db
      .collection("users")
      .doc(userId)
      .collection("meals")
      .where("dateKey", ">=", startDateKey)
      .where("dateKey", "<=", endDateKey)
      .orderBy("dateKey", "desc")
      .get();

    const meals = snap.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() ?? data.updatedAt,
      };
    });

    console.log("[getMealsForRange]", { userId, startDateKey, endDateKey, count: meals.length });

    return { success: true, meals };
  }
);

// ─── Cloud Function: deleteMeal ──────────────────────────────────────────

interface DeleteMealRequest {
  mealId: string;
}

interface DeleteMealResponse {
  success: boolean;
  mealId: string;
}

export const deleteMeal = onCall<DeleteMealRequest>(
  {
    enforceAppCheck: false,
    invoker: "public",
    maxInstances: 20,
    timeoutSeconds: 15,
    memory: "256MiB",
  },
  async (request): Promise<DeleteMealResponse> => {
    const auth = request.auth;
    if (!auth) {
      throw new HttpsError("unauthenticated", "You must be signed in.");
    }
    const userId = auth.uid;
    const mealId = request.data?.mealId;

    if (!mealId || typeof mealId !== "string" || mealId.trim().length === 0) {
      throw new HttpsError("invalid-argument", "mealId is required.");
    }

    const mealRef = db.collection("users").doc(userId).collection("meals").doc(mealId);
    const snap = await mealRef.get();

    if (!snap.exists) {
      throw new HttpsError("not-found", "Meal not found.");
    }

    // Verify ownership
    const data = snap.data();
    if (data?.userId && data.userId !== userId) {
      throw new HttpsError("permission-denied", "You can only delete your own meals.");
    }

    await mealRef.delete();

    console.log("[deleteMeal]", { userId, mealId });

    return { success: true, mealId };
  }
);

// ─── Cloud Function: deleteAccount ───────────────────────────────────────

interface DeleteAccountResponse {
  success: boolean;
}

export const deleteAccount = onCall<void>(
  {
    enforceAppCheck: false,
    invoker: "public",
    maxInstances: 10,
    timeoutSeconds: 60,
    memory: "256MiB",
  },
  async (request): Promise<DeleteAccountResponse> => {
    const auth = request.auth;
    if (!auth) {
      throw new HttpsError("unauthenticated", "You must be signed in.");
    }

    const userId = auth.uid;
    const userRef = db.collection("users").doc(userId);

    await Promise.all([
      deleteCollection(`users/${userId}/meals`),
      deleteCollection(`users/${userId}/customFoods`),
      deleteCollection(`users/${userId}/workoutProgram`),
      deleteCollection(`users/${userId}/workoutWeeks`),
    ]);

    await Promise.allSettled([
      userRef.delete(),
      db.collection("subscriptions").doc(userId).delete(),
    ]);

    try {
      await admin.auth().deleteUser(userId);
    } catch (error) {
      const code = (error as { code?: string })?.code;
      if (code !== "auth/user-not-found") {
        console.error("[deleteAccount] auth delete failed", { userId, error });
        throw new HttpsError("internal", "Account could not be deleted.");
      }
    }

    console.log("[deleteAccount]", { userId });
    return { success: true };
  }
);
