import { HttpsError } from "firebase-functions/v2/https";
import type { AnalyzeMealRequest, MealType } from "./types";

const VALID_MEAL_TYPES = new Set<MealType>([
  "breakfast",
  "lunch",
  "dinner",
  "snack",
]);

/**
 * Validate the incoming request payload.
 * Throws HttpsError on any invalid input — never trust the client.
 */
export function validateRequest(
  data: unknown
): { imageUrl: string; mealTypeHint: MealType | undefined; gramNotes: string | undefined; dateKey: string | undefined } {
  if (!data || typeof data !== "object") {
    throw new HttpsError(
      "invalid-argument",
      "Request body must be a JSON object."
    );
  }

  const body = data as Record<string, unknown>;

  // ── imageUrl (required) ──────────────────────────────────────────────
  const imageUrl = body.imageUrl;

  if (typeof imageUrl !== "string" || imageUrl.trim().length === 0) {
    throw new HttpsError(
      "invalid-argument",
      "imageUrl is required and must be a non-empty string."
    );
  }

  const isHttpsOrStorageUrl = imageUrl.startsWith("https://") || imageUrl.startsWith("gs://");
  const isDataImageUrl = /^data:image\/(jpeg|jpg|png|webp|heic|heif);base64,/i.test(imageUrl);

  // Basic image source sanity. Native apps can send a data URL because the
  // Capacitor native auth session is not automatically shared with Web Storage.
  if (!isHttpsOrStorageUrl && !isDataImageUrl) {
    throw new HttpsError(
      "invalid-argument",
      "imageUrl must be an https://, gs://, or data:image base64 URI."
    );
  }

  if (isHttpsOrStorageUrl && imageUrl.length > 2048) {
    throw new HttpsError(
      "invalid-argument",
      "imageUrl exceeds the maximum allowed length."
    );
  }

  if (isDataImageUrl && imageUrl.length > 15 * 1024 * 1024) {
    throw new HttpsError(
      "invalid-argument",
      "imageUrl data exceeds the maximum allowed length."
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
    if (body.gramNotes.length > 500) {
      throw new HttpsError(
        "invalid-argument",
        "gramNotes exceeds the maximum allowed length (500 chars)."
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

  return { imageUrl: imageUrl.trim(), mealTypeHint, gramNotes, dateKey };
}
