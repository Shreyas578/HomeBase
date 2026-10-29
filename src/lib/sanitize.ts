import { z } from "zod";

/**
 * Robust input sanitizer to prevent Cross-Site Scripting (XSS), SQL injection vectors,
 * and command injection characters in user-entered strings.
 */
export function sanitizeString(input: string, maxLength: number = 250): string {
  if (!input || typeof input !== "string") return "";

  return input
    .slice(0, maxLength)
    // Strip dangerous HTML script and event tags
    .replace(/<[^>]*>/g, "")
    // Strip null bytes and control characters
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    // Normalize quotes and angle brackets
    .replace(/[<>"']/g, (char) => {
      switch (char) {
        case "<": return "&lt;";
        case ">": return "&gt;";
        case '"': return "&quot;";
        case "'": return "&#x27;";
        default: return char;
      }
    })
    .trim();
}

/**
 * Strict Zod Validation Schemas for student inputs
 */
export const StudentProfileInputSchema = z.object({
  display_name: z.string().min(1).max(60).transform((val) => sanitizeString(val, 60)),
  home_city: z.string().min(1).max(60).transform((val) => sanitizeString(val, 60)),
  home_country: z.string().min(1).max(60).transform((val) => sanitizeString(val, 60)),
  target_city: z.string().min(1).max(60).transform((val) => sanitizeString(val, 60)),
  target_university: z.string().min(1).max(100).transform((val) => sanitizeString(val, 100)),
  major: z.string().min(1).max(100).transform((val) => sanitizeString(val, 100)),
  is_public: z.boolean().default(true),
});

export const TasteEntityInputSchema = z.object({
  name: z.string().min(1).max(80).transform((val) => sanitizeString(val, 80)),
  domain: z.enum(["artist", "movie", "tv_show", "place", "brand", "video_game", "book", "podcast"]),
});
