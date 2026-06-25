import * as admin from "firebase-admin";
import { defineSecret } from "firebase-functions/params";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { analyzeWithAI, generateProgramWithAI, aiApiKey } from "./ai";
import { validateRequest } from "./validation";
import type {
  MealDocument,
  AnalyzeMealRequest,
  AnalyzeMealResponse,
  GrantScanPackRequest,
  GrantScanPackResponse,
  GeneratePersonalProgramRequest,
  GeneratePersonalProgramResponse,
  ProgramGenerationContext,
  ProgramMacros,
  ProgramProfileInputs,
  SaveAnalyzedMealRequest,
  SaveAnalyzedMealResponse,
} from "./types";

// ─── Firebase init ─────────────────────────────────────────────────────────

admin.initializeApp();

const db = admin.firestore();
// Firestore'a yazarken undefined opsiyonel alanları (ör. profileInputs.goalText
// boş bırakıldığında) sessizce atla — aksi halde batch.set "internal" hatası verir.
db.settings({ ignoreUndefinedProperties: true });
const FREE_DAILY_AI_SCAN_LIMIT = 0;
const PLUS_DAILY_AI_SCAN_LIMIT = 3;
const PRO_DAILY_AI_SCAN_LIMIT = 5;
const AI_PROGRAM_CYCLE_DAYS = 28;
const AI_PROGRAM_EVALUATION_INTERVAL_DAYS = 14;
const AI_PROGRAM_EVALUATION_INTERVAL_MS = AI_PROGRAM_EVALUATION_INTERVAL_DAYS * 24 * 60 * 60 * 1000;
const AI_PROGRAM_CYCLE_MS = AI_PROGRAM_CYCLE_DAYS * 24 * 60 * 60 * 1000;
const REVENUECAT_PRO_ENTITLEMENT_ID = "Makrofy Pro";
const REVENUECAT_PLUS_ENTITLEMENT_ID = "makrofy_plus";
const REVENUECAT_PRODUCT_IDS = new Set([
  "com.makrofy.plus.aylik",
  "com.makrofy.plus.ucaylik",
  "com.makrofy.plus.yillik",
  "makrofy_pro_monthly",
  "makrofy_pro_quarterly",
  "makrofy_pro_yearly",
]);
const SCAN_PACK_CREDITS: Record<string, number> = {
  makrofy_scan_10: 10,
  makrofy_scan_25: 25,
  makrofy_scan_60: 60,
};
const revenueCatApiKey = defineSecret("REVENUECAT_API_KEY");
const revenueCatSecretKey = defineSecret("REVENUECAT_SECRET_KEY");
const MAX_REVENUECAT_LOOKUP_IDS = 3;

type ServerProStatus = {
  isPro: boolean;
  planTier: "free" | "plus" | "pro";
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

function formatDateTR(date: Date): string {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function isKnownProProduct(productId: unknown): boolean {
  const normalized = normalizeProductId(productId);
  return REVENUECAT_PRODUCT_IDS.has(normalized) || normalized.includes("makrofy_pro");
}

function planTierFromProductId(productId: unknown): ServerProStatus["planTier"] {
  const normalized = normalizeProductId(productId);
  // Pro: makrofy_pro_*  Plus (TR ASC): com.makrofy.plus.* veya makrofy_plus_*
  if (normalized.includes("makrofy_pro") || normalized.includes("makrofy.pro")) return "pro";
  if (normalized.includes("makrofy_plus") || normalized.includes("makrofy.plus")) return "plus";
  return "free";
}

function planTierRank(tier: ServerProStatus["planTier"]): number {
  if (tier === "pro") return 2;
  if (tier === "plus") return 1;
  return 0;
}

function maxPlanTier(...tiers: ServerProStatus["planTier"][]): ServerProStatus["planTier"] {
  return tiers.reduce<ServerProStatus["planTier"]>(
    (best, tier) => planTierRank(tier) > planTierRank(best) ? tier : best,
    "free"
  );
}

function normalizePlanTier(value: unknown): ServerProStatus["planTier"] {
  return value === "pro" || value === "plus" || value === "free" ? value : "free";
}

function dailyScanLimitForTier(tier: ServerProStatus["planTier"]): number {
  if (tier === "pro") return PRO_DAILY_AI_SCAN_LIMIT;
  if (tier === "plus") return PLUS_DAILY_AI_SCAN_LIMIT;
  return FREE_DAILY_AI_SCAN_LIMIT;
}

function scanCreditsForProductId(productId: unknown): number {
  const normalized = normalizeProductId(productId);
  return SCAN_PACK_CREDITS[normalized] ?? 0;
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
  if (!snap.exists) return { isPro: false, planTier: "free", source: "none" };

  const data = snap.data() ?? {};
  const isPro = isActiveSubscriptionStatus(data.status) && hasNotExpired(data.expiresAt);
  const detectedTier = maxPlanTier(
      planTierFromProductId(data.productId),
      typeof data.plan === "string" && data.plan.includes("plus") ? "plus" : "free",
      typeof data.plan === "string" && data.plan.includes("pro") ? "pro" : "free"
  );
  // Unknown-but-paid → "plus" (the lower paid tier), never "pro": defaulting to
  // "pro" would grant Pro-only perks to a Plus subscriber.
  const planTier = isPro ? (detectedTier === "free" ? "plus" : detectedTier) : "free";

  return {
    isPro,
    planTier,
    source: isPro ? "subscriptions" : "none",
    expiresAt: typeof data.expiresAt === "string" ? data.expiresAt : null,
  };
}

function getRevenueCatV1ApiKey(): string | null {
  const apiKey = (
    revenueCatApiKey.value() ||
    process.env.REVENUECAT_API_KEY ||
    ""
  ).trim();
  if (!apiKey) return null;

  if (!apiKey.startsWith("appl_")) {
    console.error("[REVENUECAT_V1_PUBLIC_KEY_REQUIRED]", {
      configuredPrefix: apiKey.substring(0, 5),
    });
    return null;
  }

  return apiKey;
}

async function getRevenueCatProStatus(userId: string): Promise<ServerProStatus> {
  // RevenueCat API v1 subscriber lookup requires the public SDK/API key.
  // V2 secret keys are rejected by this endpoint with code 7723.
  const apiKey = getRevenueCatV1ApiKey();
  if (!apiKey) return { isPro: false, planTier: "free", source: "none" };

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
    return { isPro: false, planTier: "free", source: "none" };
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
  const proEntitlement = entitlements[REVENUECAT_PRO_ENTITLEMENT_ID];
  const plusEntitlement = entitlements[REVENUECAT_PLUS_ENTITLEMENT_ID];
  const entitlement =
    proEntitlement ??
    plusEntitlement ??
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
    return { isPro: false, planTier: "free", source: "none" };
  }

  const expiresAt = entitlement?.expires_date ??
    data.subscriber?.subscriptions?.[activeProductId ?? ""]?.expires_date ??
    null;
  const expiresAtMs = timestampLikeToMillis(expiresAt);
  const isPro = expiresAtMs === null || expiresAtMs > Date.now();
  const planTier = isPro
    ? maxPlanTier(
      proEntitlement && hasNotExpired(proEntitlement.expires_date) ? "pro" : "free",
      plusEntitlement && hasNotExpired(plusEntitlement.expires_date) ? "plus" : "free",
      planTierFromProductId(activeProductId),
      planTierFromProductId(entitlement?.product_identifier)
    )
    : "free";

  return {
    isPro,
    planTier,
    source: isPro ? "revenuecat" : "none",
    expiresAt,
    revenueCatUserId: data.subscriber?.original_app_user_id ?? userId,
  };
}

async function getRevenueCatProStatusForAnyId(userId: string, lookupIds: string[] = []): Promise<ServerProStatus> {
  const ids = uniqueLookupIds(userId, lookupIds);
  let lastStatus: ServerProStatus = { isPro: false, planTier: "free", source: "none" };

  for (const id of ids) {
    const status = await getRevenueCatProStatus(id);
    if (status.isPro) return status;
    lastStatus = status;
  }

  return lastStatus;
}

async function resolveServerProStatus(
  userId: string,
  revenueCatLookupIds: string[] = [],
  forceRevalidate = false
): Promise<ServerProStatus> {
  const userRef = db.collection("users").doc(userId);
  const userSnap = await userRef.get();
  const userData = userSnap.exists ? userSnap.data() ?? {} : {};
  const userIsPro = userData.isPro === true;
  const userProHasNotExpired = hasNotExpired(userData.proExpiresAt);
  const storedPlanTier = userIsPro && userProHasNotExpired
    ? maxPlanTier(
      normalizePlanTier(userData.planTier),
      normalizePlanTier(userData.subscriptionTier),
      planTierFromProductId(userData.productId)
    )
    : "free";

  // Cached fast path. Skipped when `forceRevalidate` is set (an explicit
  // subscription sync) so a stale users-doc tier — e.g. a leftover "pro" from an
  // earlier sandbox purchase — can be downgraded to the user's real tier.
  // NB: never default an unknown-but-paid tier to "pro"; that hands Pro-only
  // perks to Plus subscribers. Fall back to the lower paid tier ("plus").
  if (!forceRevalidate && userIsPro && userProHasNotExpired) {
    return {
      isPro: true,
      planTier: storedPlanTier === "free" ? "plus" : storedPlanTier,
      source: "users",
      expiresAt: typeof userData.proExpiresAt === "string" ? userData.proExpiresAt : null,
    };
  }

  const subscriptionStatus = await getFirestoreSubscriptionProStatus(userId);
  if (subscriptionStatus.isPro) {
    await userRef.set({
      isPro: true,
      planTier: subscriptionStatus.planTier,
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
      planTier: revenueCatStatus.planTier,
      proSource: revenueCatStatus.source,
      proExpiresAt: revenueCatStatus.expiresAt ?? null,
      revenueCatAppUserId: revenueCatStatus.revenueCatUserId ?? storedRevenueCatId ?? userId,
      updatedAt: admin.firestore.Timestamp.now(),
    }, { merge: true });
    return revenueCatStatus;
  }

  // Live sources found nothing active. If the cached users-doc still marks the
  // user as paid (and unexpired), keep honoring it — a transient RevenueCat
  // lookup miss must never downgrade a genuinely paid user, even when
  // revalidating. (Still never elevate an unknown tier to "pro".)
  if (userIsPro && userProHasNotExpired) {
    return {
      isPro: true,
      planTier: storedPlanTier === "free" ? "plus" : storedPlanTier,
      source: "users",
      expiresAt: typeof userData.proExpiresAt === "string" ? userData.proExpiresAt : null,
    };
  }

  if (userIsPro && !userProHasNotExpired) {
    await userRef.set({
      isPro: false,
      planTier: "free",
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

  return { isPro: false, planTier: "free", source: "none" };
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

async function reserveAiScanQuota(
  userId: string,
  revenueCatLookupIds: string[] = []
): Promise<{ dateKey: string; creditUsed: boolean }> {
  const userRef = db.collection("users").doc(userId);
  const dateKey = getTodayKey();
  const serverProStatus = await resolveServerProStatus(userId, revenueCatLookupIds);
  let creditUsed = false;

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(userRef);
    const data = snap.exists ? snap.data() ?? {} : {};
    const storedTier = data.isPro === true && hasNotExpired(data.proExpiresAt)
      ? (normalizePlanTier(data.planTier) === "free" ? "plus" : normalizePlanTier(data.planTier))
      : "free";
    const planTier = maxPlanTier(serverProStatus.planTier, storedTier);
    const limit = dailyScanLimitForTier(planTier);
    const credits = typeof data.aiScanCredits === "number" && Number.isFinite(data.aiScanCredits)
      ? Math.max(0, Math.floor(data.aiScanCredits))
      : 0;

    if (limit <= 0 && credits <= 0) {
      throw new HttpsError(
        "failed-precondition",
        "AI photo analysis requires Makrofy Plus, Makrofy Pro, or an active scan pack."
      );
    }

    const storedDate = typeof data.aiScanDate === "string" ? data.aiScanDate : "";
    const used = storedDate === dateKey && typeof data.aiScanDailyCount === "number"
      ? data.aiScanDailyCount
      : 0;

    if (used >= limit) {
      if (credits <= 0) {
        throw new HttpsError(
          "resource-exhausted",
          `Daily AI scan limit reached. Makrofy ${planTier === "pro" ? "Pro" : "Plus"} users can scan ${limit} meals per day. You can use a scan pack for extra scans.`
        );
      }

      creditUsed = true;
      tx.set(userRef, {
        aiScanCredits: credits - 1,
        aiScanCreditsUsed: admin.firestore.FieldValue.increment(1),
        aiScanLastCreditUsedAt: admin.firestore.Timestamp.now(),
        aiScanDailyLimit: limit,
        planTier,
        updatedAt: admin.firestore.Timestamp.now(),
      }, { merge: true });
      return;
    }

    tx.set(userRef, {
      aiScanDate: dateKey,
      aiScanDailyCount: used + 1,
      aiScanDailyLimit: limit,
      planTier,
      updatedAt: admin.firestore.Timestamp.now(),
    }, { merge: true });
  });

  return { dateKey, creditUsed };
}

async function refundAiScanQuota(userId: string, quota: { dateKey: string; creditUsed: boolean }): Promise<void> {
  const userRef = db.collection("users").doc(userId);
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(userRef);
    if (!snap.exists) return;
    const data = snap.data() ?? {};
    if (quota.creditUsed) {
      tx.set(userRef, {
        aiScanCredits: admin.firestore.FieldValue.increment(1),
        updatedAt: admin.firestore.Timestamp.now(),
      }, { merge: true });
      return;
    }
    if (data.aiScanDate !== quota.dateKey || typeof data.aiScanDailyCount !== "number") return;
    tx.set(userRef, {
      aiScanDailyCount: Math.max(0, data.aiScanDailyCount - 1),
      updatedAt: admin.firestore.Timestamp.now(),
    }, { merge: true });
  });
}

// ─── Cloud Function: grantScanPack ─────────────────────────────────────────

export const grantScanPack = onCall<GrantScanPackRequest>(
  {
    enforceAppCheck: false,
    invoker: "public",
    maxInstances: 20,
    timeoutSeconds: 20,
    memory: "256MiB",
  },
  async (request): Promise<GrantScanPackResponse> => {
    const auth = request.auth;
    if (!auth) {
      throw new HttpsError("unauthenticated", "You must be signed in to add scan credits.");
    }

    const productId = normalizeProductId(request.data?.productId);
    const creditsAdded = scanCreditsForProductId(productId);
    if (creditsAdded <= 0) {
      throw new HttpsError("invalid-argument", "Unknown scan pack product.");
    }

    const purchaseId = typeof request.data?.purchaseId === "string" && request.data.purchaseId.trim()
      ? request.data.purchaseId.trim().slice(0, 160)
      : `${productId}_${Date.now()}`;
    const userRef = db.collection("users").doc(auth.uid);
    const purchaseRef = userRef.collection("scanCreditPurchases").doc(purchaseId);
    let totalCredits = 0;

    await db.runTransaction(async (tx) => {
      const existingPurchase = await tx.get(purchaseRef);
      const userSnap = await tx.get(userRef);
      const data = userSnap.exists ? userSnap.data() ?? {} : {};
      const currentCredits = typeof data.aiScanCredits === "number" && Number.isFinite(data.aiScanCredits)
        ? Math.max(0, Math.floor(data.aiScanCredits))
        : 0;

      if (existingPurchase.exists) {
        totalCredits = currentCredits;
        return;
      }

      totalCredits = currentCredits + creditsAdded;
      tx.set(purchaseRef, {
        productId,
        creditsAdded,
        createdAt: admin.firestore.Timestamp.now(),
      });
      tx.set(userRef, {
        aiScanCredits: totalCredits,
        aiScanCreditsPurchased: admin.firestore.FieldValue.increment(creditsAdded),
        updatedAt: admin.firestore.Timestamp.now(),
      }, { merge: true });
    });

    return {
      success: true,
      productId,
      creditsAdded,
      totalCredits,
    };
  }
);

// ─── Program validation ───────────────────────────────────────────────────

const PROGRAM_GOALS = new Set(["fat_loss", "muscle_gain", "fit_look", "weight_gain", "strength", "healthy_eating"]);
const TRAINING_LEVELS = new Set(["beginner", "intermediate", "advanced"]);
const TRAINING_LOCATIONS = new Set(["home", "gym"]);
const GENDERS = new Set(["male", "female", "other"]);

function cleanOptionalText(value: unknown, max = 500): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string") {
    throw new HttpsError("invalid-argument", "Text fields must be strings.");
  }
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : undefined;
}

function requireNumber(value: unknown, name: string, min: number, max: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new HttpsError("invalid-argument", `${name} must be a number.`);
  }
  const rounded = Math.round(value);
  if (rounded < min || rounded > max) {
    throw new HttpsError("invalid-argument", `${name} is outside the allowed range.`);
  }
  return rounded;
}

function validateProgramRequest(data: unknown): {
  profileInputs: ProgramProfileInputs;
  imageData?: string;
  revenueCatAppUserId?: string | null;
  mode: "initial" | "progress_evaluation";
  progressNotes?: string;
} {
  if (!data || typeof data !== "object") {
    throw new HttpsError("invalid-argument", "Request body must be a JSON object.");
  }
  const body = data as GeneratePersonalProgramRequest;
  const raw = body.profileInputs as unknown as Record<string, unknown> | undefined;
  if (!raw || typeof raw !== "object") {
    throw new HttpsError("invalid-argument", "profileInputs is required.");
  }

  if (typeof raw.goal !== "string" || !PROGRAM_GOALS.has(raw.goal)) {
    throw new HttpsError("invalid-argument", "Invalid goal.");
  }
  if (typeof raw.trainingLevel !== "string" || !TRAINING_LEVELS.has(raw.trainingLevel)) {
    throw new HttpsError("invalid-argument", "Invalid training level.");
  }
  if (typeof raw.trainingLocation !== "string" || !TRAINING_LOCATIONS.has(raw.trainingLocation)) {
    throw new HttpsError("invalid-argument", "Invalid training location.");
  }
  if (typeof raw.gender !== "string" || !GENDERS.has(raw.gender)) {
    throw new HttpsError("invalid-argument", "Invalid gender.");
  }

  const imageData = typeof body.imageData === "string" && body.imageData.trim()
    ? body.imageData.trim()
    : undefined;
  if (imageData) {
    if (!/^data:image\/(jpeg|jpg|png|webp|heic|heif);base64,/i.test(imageData)) {
      throw new HttpsError("invalid-argument", "imageData must be a data:image base64 URI.");
    }
    if (imageData.length > 15 * 1024 * 1024) {
      throw new HttpsError("invalid-argument", "imageData exceeds the maximum allowed length (15 MB).");
    }
  }

  return {
    imageData,
    mode: body.mode === "progress_evaluation" ? "progress_evaluation" : "initial",
    progressNotes: cleanOptionalText(body.progressNotes, 1200),
    revenueCatAppUserId: isRevenueCatAppUserId(body.revenueCatAppUserId)
      ? body.revenueCatAppUserId.trim()
      : null,
    profileInputs: {
      goal: raw.goal as ProgramProfileInputs["goal"],
      goalText: cleanOptionalText(raw.goalText, 300),
      heightCm: requireNumber(raw.heightCm, "heightCm", 120, 230),
      weightKg: requireNumber(raw.weightKg, "weightKg", 30, 300),
      age: requireNumber(raw.age, "age", 13, 90),
      gender: raw.gender as ProgramProfileInputs["gender"],
      trainingLevel: raw.trainingLevel as ProgramProfileInputs["trainingLevel"],
      trainingDaysPerWeek: requireNumber(raw.trainingDaysPerWeek, "trainingDaysPerWeek", 1, 6),
      trainingLocation: raw.trainingLocation as ProgramProfileInputs["trainingLocation"],
      injuries: cleanOptionalText(raw.injuries, 500),
      nutritionPreference: cleanOptionalText(raw.nutritionPreference, 120) ?? "normal",
      mealsPerDay: requireNumber(raw.mealsPerDay, "mealsPerDay", 2, 6),
      allergiesDislikes: cleanOptionalText(raw.allergiesDislikes, 500),
      locale: typeof raw.locale === "string" && raw.locale === "en" ? "en" : "tr",
    },
  };
}

function buildProgramGenerationContext(
  mode: "initial" | "progress_evaluation",
  progressNotes: string | undefined,
  latestActive: { doc: admin.firestore.QueryDocumentSnapshot; createdAtMs: number } | undefined
): ProgramGenerationContext {
  if (mode !== "progress_evaluation" || !latestActive) {
    return { mode: "initial" };
  }

  const previous = latestActive.doc.data();
  const workoutPlan = previous.workoutPlan as Record<string, unknown> | undefined;
  return {
    mode: "progress_evaluation",
    progressNotes,
    previousProgram: {
      goal: typeof previous.goal === "string" ? previous.goal as ProgramProfileInputs["goal"] : undefined,
      targetSummary: typeof previous.targetSummary === "string" ? previous.targetSummary.slice(0, 600) : undefined,
      photoAnalysisSummary: typeof previous.photoAnalysisSummary === "string" ? previous.photoAnalysisSummary.slice(0, 600) : undefined,
      workoutOverview: typeof workoutPlan?.overview === "string" ? workoutPlan.overview.slice(0, 700) : undefined,
      cardio: typeof workoutPlan?.cardio === "string" ? workoutPlan.cardio.slice(0, 400) : undefined,
      macros: previous.macros && typeof previous.macros === "object"
        ? previous.macros as ProgramMacros
        : undefined,
      progressTracking: Array.isArray(previous.progressTracking)
        ? previous.progressTracking.filter((item): item is string => typeof item === "string").slice(0, 6)
        : undefined,
      createdAtMs: latestActive.createdAtMs,
    },
  };
}

// ─── Cloud Function: analyzeMealImage ──────────────────────────────────────

export const analyzeMealImage = onCall<AnalyzeMealRequest>(
  {
    // Enforce that only authenticated users can call this function.
    // Unauthenticated requests are rejected before our code runs.
    enforceAppCheck: false, // enable when App Check is configured
    invoker: "public",
    secrets: [aiApiKey, revenueCatApiKey, revenueCatSecretKey],
    // Keep one warm instance so the most-used AI path (meal scan) skips the
    // ~3-8s cold start, which is the dominant non-model delay users feel.
    // Cost ≈ $3-5/mo. Model + prompts are unchanged → accuracy is identical.
    minInstances: 1,
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
    const locale = (request.data as { locale?: string }).locale || 'tr';

    // ── 3. Enforce subscription scan quota before calling AI ───────────
    const revenueCatAppUserId = isRevenueCatAppUserId(request.data?.revenueCatAppUserId)
      ? request.data.revenueCatAppUserId.trim()
      : null;
    const quota = await reserveAiScanQuota(
      userId,
      revenueCatAppUserId ? [revenueCatAppUserId] : []
    );

    // ── 4. Call AI vision model ──────────────────────────────────────
    // Meal is NOT saved here. The client saves only when the user taps Save.
    let analysis: Awaited<ReturnType<typeof analyzeWithAI>>;
    try {
      analysis = await analyzeWithAI(imageUrl, mealTypeHint, gramNotes, locale);
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
        await refundAiScanQuota(userId, quota).catch((refundError) => {
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
  planTier: ServerProStatus["planTier"];
  dailyScanLimit: number;
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
      revenueCatAppUserId ? [revenueCatAppUserId] : [],
      // Force a live re-check so an explicit sync corrects a stale users-doc
      // tier (e.g. a leftover "pro" cache) to the subscriber's real tier.
      true
    );

    // Return the authoritative status in BOTH directions — do not throw on
    // "not pro". The client relies on a resolved isPro:false to DOWNGRADE a
    // stale local Pro/Plus record (e.g. left over from sandbox testing or an
    // account switch). Throwing here would surface only as a generic sync error
    // and leave the stale paid tier showing forever.
    console.info("[SYNC_SUBSCRIPTION_RESULT]", {
      userId: auth.uid,
      isPro: status.isPro,
      planTier: status.planTier,
      source: status.source,
      revenueCatAppUserId,
    });

    return {
      success: true,
      isPro: status.isPro,
      planTier: status.planTier,
      dailyScanLimit: dailyScanLimitForTier(status.planTier),
      source: status.source,
      expiresAt: status.expiresAt ?? null,
    };
  }
);

// ─── Cloud Function: generatePersonalProgram ──────────────────────────────

export const generatePersonalProgram = onCall<GeneratePersonalProgramRequest>(
  {
    enforceAppCheck: false,
    invoker: "public",
    secrets: [aiApiKey, revenueCatApiKey, revenueCatSecretKey],
    // Keep one warm instance so the program generation call skips the
    // ~3-8s cold start (the single dominant non-AI delay). Cost ≈ $3-5/mo.
    minInstances: 1,
    maxInstances: 10,
    timeoutSeconds: 180,
    memory: "512MiB",
  },
  async (request): Promise<GeneratePersonalProgramResponse> => {
    const auth = request.auth;
    if (!auth) {
      throw new HttpsError("unauthenticated", "Program oluşturmak için giriş yapmalısın.");
    }

    const { profileInputs, imageData, revenueCatAppUserId, mode, progressNotes } = validateProgramRequest(request.data);
    const proStatus = await resolveServerProStatus(
      auth.uid,
      revenueCatAppUserId ? [revenueCatAppUserId] : []
    );
    if (!proStatus.isPro) {
      throw new HttpsError(
        "failed-precondition",
        "AI program oluşturma Makrofy Plus ve Makrofy Pro kullanıcıları içindir."
      );
    }
    if (imageData && proStatus.planTier !== "pro") {
      throw new HttpsError(
        "failed-precondition",
        "Fotoğraflı AI program oluşturma sadece Makrofy Pro kullanıcıları içindir."
      );
    }

    const now = admin.firestore.Timestamp.now();
    const userProgramsRef = db.collection("users").doc(auth.uid).collection("aiPrograms");
    const activeSnap = await userProgramsRef
      .where("isActive", "==", true)
      .limit(20)
      .get();
    const latestActive = activeSnap.docs
      .map((doc) => {
        const data = doc.data();
        const createdAtMs = timestampLikeToMillis(data.createdAt) ??
          timestampLikeToMillis(data.updatedAt) ??
          0;
        return { doc, createdAtMs };
      })
      .sort((a, b) => b.createdAtMs - a.createdAtMs)[0];

    if (latestActive?.createdAtMs) {
      const nextEvaluationMs = latestActive.createdAtMs + AI_PROGRAM_EVALUATION_INTERVAL_MS;
      if (Date.now() < nextEvaluationMs) {
        const nextEvaluationDate = new Date(nextEvaluationMs);
        const remainingDays = Math.max(1, Math.ceil((nextEvaluationMs - Date.now()) / (24 * 60 * 60 * 1000)));
        throw new HttpsError(
          "failed-precondition",
          `Değerlendirme haftası henüz açılmadı. İlerlemeni ${formatDateTR(nextEvaluationDate)} tarihinde fotoğrafla değerlendirebilirsin (${remainingDays} gün kaldı).`
        );
      }
    }

    const generationContext = buildProgramGenerationContext(mode, progressNotes, latestActive);
    let generated: Awaited<ReturnType<typeof generateProgramWithAI>>;
    try {
      generated = await generateProgramWithAI(profileInputs, imageData, auth.uid, generationContext);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("[AI_PROGRAM_ERROR]", {
        userId: auth.uid,
        message,
        stack: error instanceof Error ? error.stack : undefined,
      });

      if (message.startsWith("unsafe_program_photo:")) {
        throw new HttpsError(
          "failed-precondition",
          message.replace(/^unsafe_program_photo:\s*/, "") ||
            "Fotoğraf bu analiz için uygun değil. Lütfen daha nötr ve uygun bir fotoğraf kullan."
        );
      }
      if (message.includes("invalid JSON") || message.includes("missing required")) {
        throw new HttpsError("internal", "AI geçerli program yanıtı üretemedi. Lütfen tekrar deneyin.");
      }
      if (message.includes("401") || message.includes("API key")) {
        throw new HttpsError("failed-precondition", "AI servis anahtarı yapılandırması hatalı.");
      }
      if (message.includes("429") || message.toLowerCase().includes("quota")) {
        throw new HttpsError("resource-exhausted", "AI servisi yoğun veya kota dolu. Lütfen biraz sonra tekrar dene.");
      }
      throw new HttpsError("internal", "Program oluşturulamadı. Lütfen tekrar deneyin.");
    }

    const programRef = userProgramsRef.doc();
    const nextEvaluationAt = admin.firestore.Timestamp.fromMillis(now.toMillis() + AI_PROGRAM_EVALUATION_INTERVAL_MS);
    const nextUpdateAt = admin.firestore.Timestamp.fromMillis(now.toMillis() + AI_PROGRAM_CYCLE_MS);
    const program = {
      id: programRef.id,
      userId: auth.uid,
      ...generated,
      isActive: true,
      cycleDays: AI_PROGRAM_CYCLE_DAYS,
      evaluationIntervalDays: AI_PROGRAM_EVALUATION_INTERVAL_DAYS,
      nextEvaluationAt,
      nextUpdateAt,
      generationMode: generationContext.mode,
      ...(progressNotes && { progressNotes }),
      createdAt: now,
      updatedAt: now,
    };

    const batch = db.batch();
    activeSnap.docs.forEach((doc) => {
      batch.set(doc.ref, { isActive: false, updatedAt: now }, { merge: true });
    });
    batch.set(programRef, program);
    await batch.commit();

    return {
      success: true,
      programId: programRef.id,
      program,
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

// ─── Cloud Function: getActiveProgram ─────────────────────────────────────
// Returns the user's current active AI program (or null). Lets the client
// self-heal its local cache: if an admin/server removed the program, the app
// clears the stale local copy; after a reinstall the program is restored.

interface GetActiveProgramResponse {
  success: boolean;
  program: (Record<string, unknown> & { id: string }) | null;
}

export const getActiveProgram = onCall<void>(
  {
    enforceAppCheck: false,
    invoker: "public",
    maxInstances: 20,
    timeoutSeconds: 15,
    memory: "256MiB",
  },
  async (request): Promise<GetActiveProgramResponse> => {
    const auth = request.auth;
    if (!auth) {
      throw new HttpsError("unauthenticated", "You must be signed in.");
    }

    const userProgramsRef = db.collection("users").doc(auth.uid).collection("aiPrograms");
    const activeSnap = await userProgramsRef
      .where("isActive", "==", true)
      .limit(20)
      .get();

    if (activeSnap.empty) {
      return { success: true, program: null };
    }

    const latest = activeSnap.docs
      .map((doc) => {
        const data = doc.data();
        const createdAtMs = timestampLikeToMillis(data.createdAt) ??
          timestampLikeToMillis(data.updatedAt) ??
          0;
        return { doc, data, createdAtMs };
      })
      .sort((a, b) => b.createdAtMs - a.createdAtMs)[0];

    const data = latest.data;
    // Convert all Timestamp fields to millis so the client can JSON-cache them
    // and so getTimestampMs (which understands numbers) keeps working.
    const program = {
      ...data,
      id: latest.doc.id,
      createdAt: timestampLikeToMillis(data.createdAt) ?? data.createdAt ?? null,
      updatedAt: timestampLikeToMillis(data.updatedAt) ?? data.updatedAt ?? null,
      nextEvaluationAt: timestampLikeToMillis(data.nextEvaluationAt) ?? data.nextEvaluationAt ?? null,
      nextUpdateAt: timestampLikeToMillis(data.nextUpdateAt) ?? data.nextUpdateAt ?? null,
    };

    return { success: true, program };
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
