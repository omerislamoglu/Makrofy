import * as admin from "firebase-admin";
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

// ─── Cloud Function: analyzeMealImage ──────────────────────────────────────

export const analyzeMealImage = onCall<AnalyzeMealRequest>(
  {
    // Enforce that only authenticated users can call this function.
    // Unauthenticated requests are rejected before our code runs.
    enforceAppCheck: false, // enable when App Check is configured
    invoker: "public",
    secrets: [aiApiKey],
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
    const { imageUrl, mealTypeHint, gramNotes, dateKey: requestDateKey } = validateRequest(request.data);

    // ── 3. Analyze and save. Authentication remains required, but AI scan
    // access is no longer limited by free/pro scan counters.
    const userRef = db.collection("users").doc(userId);

    const result = await db.runTransaction(async (tx) => {
      const userSnap = await tx.get(userRef);

      if (!userSnap.exists) {
        tx.set(userRef, {
          isPro: false,
          scanCount: 0,
          createdAt: admin.firestore.Timestamp.now(),
          updatedAt: admin.firestore.Timestamp.now(),
        });
      }

      // ── 4. Call AI vision model ──────────────────────────────────────
      let analysis: Awaited<ReturnType<typeof analyzeWithAI>>;
      try {
        analysis = await analyzeWithAI(imageUrl, mealTypeHint, gramNotes);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);

        // API quota / key errors
        if (
          message.includes("insufficient_quota") ||
          message.includes("exceeded your current quota")
        ) {
          throw new HttpsError(
            "resource-exhausted",
            "AI API kotası/kredisi yetersiz. API sağlayıcınızın kota/billing ayarlarını kontrol edip tekrar deneyin."
          );
        }
        if (
          message.includes("API_KEY_INVALID") ||
          message.includes("API key not valid") ||
          message.includes("invalid API key")
        ) {
          throw new HttpsError(
            "failed-precondition",
            "Gemini API anahtarı geçersiz. Google AI Studio'dan yeni key oluşturup Firebase secret'a kaydedin."
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
          message.toLowerCase().includes("timeout") ||
          message.toLowerCase().includes("deadline") ||
          message.toLowerCase().includes("timed out")
        ) {
          throw new HttpsError(
            "deadline-exceeded",
            "Analiz zaman aşımına uğradı. Lütfen tekrar deneyin."
          );
        }

        // Generic fallback — wrap raw Error so Firebase doesn't expose internal details
        throw new HttpsError(
          "internal",
          "Analiz sırasında beklenmeyen bir hata oluştu. Lütfen tekrar deneyin."
        );
      }

      // ── 5. Track scan count for analytics only. This never gates access.
      const now = admin.firestore.Timestamp.now();

      tx.set(userRef, {
        scanCount: admin.firestore.FieldValue.increment(1),
        updatedAt: now,
      }, { merge: true });

      // ── 6. Save the meal to Firestore ────────────────────────────────
      const dateKey = requestDateKey ?? now.toDate().toISOString().split("T")[0];
      const totalMacros = {
        calories: analysis.totalCalories,
        protein: analysis.protein,
        carbs: analysis.carbs,
        fat: analysis.fat,
        fiber: analysis.fiber,
      };
      const quantity = analysis.items.reduce((sum, item) => sum + item.grams, 0);

      const mealData: MealDocument = {
        userId,
        name: analysis.mealName,
        items: analysis.items,
        totalMacros,
        calories: totalMacros.calories,
        protein: totalMacros.protein,
        carbs: totalMacros.carbs,
        fat: totalMacros.fat,
        fiber: totalMacros.fiber,
        quantity,
        mealType: analysis.suggestedMealType,
        source: "ai_scan",
        imageUrl,
        confidence: analysis.confidence,
        dateKey,
        createdAt: now,
        updatedAt: now,
      };

      const mealRef = db
        .collection("users")
        .doc(userId)
        .collection("meals")
        .doc();

      tx.set(mealRef, mealData);

      return { mealId: mealRef.id, analysis };
    });

    // ── 7. Return the saved result ─────────────────────────────────────
    return {
      success: true,
      mealId: result.mealId,
      analysis: result.analysis,
    };
  }
);

export const saveAnalyzedMeal = onCall<SaveAnalyzedMealRequest>(
  {
    enforceAppCheck: false,
    invoker: "public",
    maxInstances: 20,
    timeoutSeconds: 30,
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
    if (!/^\d{4}-\d{2}-\d{2}$/.test(meal.dateKey)) {
      throw new HttpsError("invalid-argument", "dateKey must be in YYYY-MM-DD format.");
    }

    const validMealTypes = new Set(["breakfast", "lunch", "dinner", "snack"]);
    if (!validMealTypes.has(meal.mealType)) {
      throw new HttpsError("invalid-argument", "Invalid mealType.");
    }

    const totalMacros = {
      calories: Math.max(0, Math.round(meal.totalMacros?.calories ?? 0)),
      protein: Math.max(0, Math.round(meal.totalMacros?.protein ?? 0)),
      carbs: Math.max(0, Math.round(meal.totalMacros?.carbs ?? 0)),
      fat: Math.max(0, Math.round(meal.totalMacros?.fat ?? 0)),
      fiber: Math.max(0, Math.round(meal.totalMacros?.fiber ?? 0)),
    };
    const quantity = meal.items.reduce((sum, item) => sum + Math.max(0, Math.round(item.grams ?? 0)), 0);
    const now = admin.firestore.Timestamp.now();
    const mealRef = body.mealId
      ? db.collection("users").doc(userId).collection("meals").doc(body.mealId)
      : db.collection("users").doc(userId).collection("meals").doc();

    const existingSnap = await mealRef.get();
    const createdAt = existingSnap.exists
      ? ((existingSnap.data()?.createdAt as admin.firestore.Timestamp | undefined) ?? now)
      : now;

    const mealData: MealDocument = {
      userId,
      name: meal.name ?? meal.notes ?? (meal.items.map((item) => item.name).join(" · ") || "Öğün"),
      items: meal.items,
      totalMacros,
      calories: totalMacros.calories,
      protein: totalMacros.protein,
      carbs: totalMacros.carbs,
      fat: totalMacros.fat,
      fiber: totalMacros.fiber,
      quantity,
      mealType: meal.mealType,
      source: "ai_scan",
      ...(meal.imageUrl && { imageUrl: meal.imageUrl }),
      ...(meal.confidence && { confidence: meal.confidence }),
      dateKey: meal.dateKey,
      createdAt,
      updatedAt: now,
    };

    await mealRef.set(mealData, { merge: true });
    return { success: true, mealId: mealRef.id };
  }
);
