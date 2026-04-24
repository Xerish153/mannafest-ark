import type { TextualEvidenceData } from "../types";
import { MARK_16_TEXTUAL_EVIDENCE } from "./mark16";
import { JOHN_21_TEXTUAL_EVIDENCE } from "./john21";

/**
 * Batch 7 — textual-evidence registry keyed by book-slug + chapter.
 * Extend here when future passages get their own panel.
 */
export const TEXTUAL_EVIDENCE_BY_CHAPTER: Record<string, TextualEvidenceData> = {
  "mark:16": MARK_16_TEXTUAL_EVIDENCE,
  "john:21": JOHN_21_TEXTUAL_EVIDENCE,
};

export function textualEvidenceFor(
  bookSlug: string,
  chapter: number,
): TextualEvidenceData | null {
  return TEXTUAL_EVIDENCE_BY_CHAPTER[`${bookSlug}:${chapter}`] ?? null;
}
