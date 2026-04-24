/**
 * Batch 7 — word-count trim-at-render helper used by the reader's commentary
 * cards. Mirrors the Batch 4+5 `<CommentarySection />` trim but exported as
 * a pure helper so the reader components can compose it directly.
 */

export const FEATURED_EXCERPT_WORD_CAP = 50;

export function truncateWords(text: string, cap: number): {
  text: string;
  truncated: boolean;
} {
  if (!text) return { text: "", truncated: false };
  const words = text.trim().split(/\s+/);
  if (words.length <= cap) return { text: text.trim(), truncated: false };
  return { text: words.slice(0, cap).join(" ") + "…", truncated: true };
}
