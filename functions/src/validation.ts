import { HttpsError } from "firebase-functions/v2/https";
import type { MealType } from "./types";

const VALID_MEAL_TYPES = new Set<MealType>([
  "breakfast",
  "lunch",
  "dinner",
  "snack",
]);

export interface ValidatedRequest {
  /** Resolved image source — either an HTTPS/gs URL or a data:image base64 URI */
  imageUrl: string;
  /** True when imageUrl is a base64 data URI (should NOT be saved to Firestore) */
  isDataUrl: boolean;
  mealTypeHint: MealType | undefined;
  gramNotes: string | undefined;
  dateKey: string | undefined;
}

/**
 * Validate the incoming request payload.
 * Accepts either `imageUrl` (web path) or `imageData` (native iOS base64).
 * Throws HttpsError on any invalid input — never trust the client.
 */
export function validateRequest(data: unknown): ValidatedRequest {
  if (!data || typeof data !== "object") {
    throw new HttpsError(
      "invalid-argument",
      "Request body must be a JSON object."
    );
  }

  const body = data as Record<string, unknown>;

  // ── Resolve image source: imageData (native) or imageUrl (web) ──────
  let imageUrl: string;

  if (typeof body.imageData === "string" && body.imageData.trim().length > 0) {
    // Native iOS path: base64 data URL
    const trimmed = body.imageData.trim();
    if (!/^data:image\/(jpeg|jpg|png|webp|heic|heif);base64,/i.test(trimmed)) {
      throw new HttpsError(
        "invalid-argument",
        "imageData must be a data:image/... base64 URI."
      );
    }
    if (trimmed.length > 15 * 1024 * 1024) {
      throw new HttpsError(
        "invalid-argument",
        "imageData exceeds the maximum allowed length (15 MB)."
      );
    }
    imageUrl = trimmed;
  } else if (typeof body.imageUrl === "string" && body.imageUrl.trim().length > 0) {
    // Web path: HTTPS or gs:// URL
    const trimmed = body.imageUrl.trim();
    const isHttpsOrStorage = trimmed.startsWith("https://") || trimmed.startsWith("gs://");
    const isDataImage = /^data:image\/(jpeg|jpg|png|webp|heic|heif);base64,/i.test(trimmed);

    if (!isHttpsOrStorage && !isDataImage) {
      throw new HttpsError(
        "invalid-argument",
        "imageUrl must be an https://, gs://, or data:image base64 URI."
      );
    }
    if (isHttpsOrStorage && trimmed.length > 2048) {
      throw new HttpsError(
        "invalid-argument",
        "imageUrl exceeds the maximum allowed length."
      );
    }
    if (isDataImage && trimmed.length > 15 * 1024 * 1024) {
      throw new HttpsError(
        "invalid-argument",
        "imageUrl data exceeds the maximum allowed length."
      );
    }
    imageUrl = trimmed;
  } else {
    throw new HttpsError(
      "invalid-argument",
      "imageUrl or imageData is required."
    );
  }

  // ── mealTypeHint (optional) ──────────────────────────────────────────
  let mealTypeHint: MealType | undefined;

  if (body.mealTypeHint !== undefined) {
    if (
      typeof body.mealTypeHint !== "string" ||
      !VALID_MEAL_TYPES.has(body.mealTypeHint as MealType)
    ) {
      throw new HttpsError(
        "invalid-argument",
        `mealTypeHint must be one of: ${[...VALID_MEAL_TYPES].join(", ")}.`
      );
    }
    mealTypeHint = body.mealTypeHint as MealType;
  }

  // ── gramNotes (optional) ──────────────────────────────────────────────
  let gramNotes: string | undefined;

  if (body.gramNotes !== undefined) {
    if (typeof body.gramNotes !== "string") {
      throw new HttpsError(
        "invalid-argument",
        "gramNotes must be a string."
      );
    }
    if (body.gramNotes.length > 1500) {
      throw new HttpsError(
        "invalid-argument",
        "gramNotes exceeds the maximum allowed length (1500 chars)."
      );
    }
    gramNotes = body.gramNotes.trim() || undefined;
  }

  let dateKey: string | undefined;
  if (body.dateKey !== undefined) {
    if (typeof body.dateKey !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(body.dateKey)) {
      throw new HttpsError(
        "invalid-argument",
        "dateKey must be in YYYY-MM-DD format."
      );
    }
    dateKey = body.dateKey;
  }

  return { imageUrl, isDataUrl: imageUrl.startsWith("data:image/"), mealTypeHint, gramNotes, dateKey };
}
