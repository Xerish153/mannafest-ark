/**
 * Commentaries schema (Batch 4+5 — extended).
 *
 * Existing columns: id, verse_reference, book_id, chapter, verse_start,
 * verse_end, author, source, commentary_text, created_at.
 *
 * Added by migration 047:
 * - scholar_id       UUID, REFERENCES scholars(id), NOT NULL
 * - featured         BOOLEAN DEFAULT FALSE
 * - featured_excerpt TEXT, CHECK length ≤ 400
 * - founder_curated  BOOLEAN DEFAULT FALSE
 * - author_type      'sourced' | 'founder'
 * - status           'published' | 'hidden'
 * - curator_note     TEXT
 * - curated_at       TIMESTAMPTZ
 * - curated_by       UUID, REFERENCES auth.users(id)
 *
 * Storage granularity: one row per chapter for sourced commentators
 * (verse_start=1, verse_end=null). Founder rows may be per-verse
 * (verse_start=N for the specific verse) — this is how Pastor Marc's
 * per-verse founder notes enter the commentary surface.
 */

import type { ScholarMini } from "./scholars";

export type CommentaryAuthorType = "sourced" | "founder";
export type CommentaryStatus = "published" | "hidden";

export type Commentary = {
  id: string;
  verse_reference: string;
  book_id: number | null;
  chapter: number;
  verse_start: number;
  verse_end: number | null;

  // Pre-existing narrative columns (kept alongside the new FK so nothing
  // breaks — drop in a future hygiene batch once all callers use scholar_id).
  author: string;
  source: string;
  commentary_text: string;
  created_at: string | null;

  // Batch 4+5 columns.
  scholar_id: string;
  featured: boolean;
  featured_excerpt: string | null;
  founder_curated: boolean;
  author_type: CommentaryAuthorType;
  status: CommentaryStatus;
  curator_note: string | null;
  curated_at: string | null;
  curated_by: string | null;
};

/** Commentary row with the scholar joined in. Shape returned by CommentarySection queries. */
export type CommentaryWithScholar = Commentary & {
  scholar: ScholarMini;
};

/** PATCH body actions accepted by /api/commentary/[id] (server-enforced super-admin). */
export type CommentaryPatchAction =
  | {
      action: "feature";
      payload: { featured_excerpt: string };
    }
  | {
      action: "unfeature";
      payload?: Record<string, never>;
    }
  | {
      action: "set_excerpt";
      payload: { featured_excerpt: string };
    }
  | {
      action: "add_curator_note";
      payload: { curator_note: string };
    }
  | {
      action: "set_status";
      payload: { status: CommentaryStatus };
    };

/**
 * Word-count the excerpt. Used server-side to reject excerpts that exceed the
 * 50-word cap before writing. Matches the render-time truncation in
 * FeaturedExcerpt.tsx so authors can't sneak past it by bloating whitespace.
 */
export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export const FEATURED_EXCERPT_WORD_CAP = 50;
