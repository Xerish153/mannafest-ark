import { supabase } from "@/lib/supabase";
import { FEATURED_EXCERPT_WORD_CAP } from "@/lib/supabase/schemas/commentaries";
import type {
  Commentary,
  CommentaryWithScholar,
} from "@/lib/supabase/schemas/commentaries";
import type { ScholarMini } from "@/lib/supabase/schemas/scholars";
import { FeaturedExcerpt, truncateWords } from "./FeaturedExcerpt";
import { OtherVoicesDisclosure } from "./OtherVoicesDisclosure";

/**
 * <CommentarySection /> — Doctrine A render spec (Vision v2 §4.4).
 *
 * Replaces the prior <CommentaryVoices /> component on verse pages.
 *
 * Contract:
 *  - Featured excerpt block at the top. Either the curator-selected featured
 *    row, or an auto-rank fallback (lowest scholars.default_rank among
 *    published entries). Featured excerpt is ≤50 words at render time.
 *  - "Show other voices (N)" disclosure reveals remaining published entries.
 *    Hidden entirely if there are no other published voices.
 *  - Pruned (status='hidden') entries do not render on the public surface.
 *    Admin curation panel queries these separately.
 *  - Founder ("Editor"-tradition) entries are cards like any other — no
 *    visual flattening, no special collapsing.
 *
 * Storage note: commentaries are chapter-level today (one row per
 * (book_id, chapter), verse_start=1). Per-verse founder notes set verse_start
 * to the specific verse. This component fetches by (book_id, chapter) and
 * shows everything that applies to the chapter. Verse-scoped filtering lives
 * in a later batch if needed.
 */
export type CommentarySectionProps = {
  bookId: number;
  chapter: number;
  /**
   * If provided, only shows commentary rows whose verse_start is either 1
   * (chapter-level) or equals this verse. Use on verse pages; omit on
   * chapter hubs.
   */
  verseStart?: number;
};

type CommentaryRow = Commentary & {
  scholar: ScholarMini | null;
};

export default async function CommentarySection({
  bookId,
  chapter,
  verseStart,
}: CommentarySectionProps) {
  const query = supabase
    .from("commentaries")
    .select(
      `id, verse_reference, book_id, chapter, verse_start, verse_end,
       author, source, commentary_text, created_at,
       scholar_id, featured, featured_excerpt, founder_curated, author_type,
       status, curator_note, curated_at, curated_by,
       scholar:scholars!commentaries_scholar_id_fkey(id, slug, name, tradition_key, default_rank, is_founder)`,
    )
    .eq("book_id", bookId)
    .eq("chapter", chapter)
    .eq("status", "published");

  if (typeof verseStart === "number") {
    query.in("verse_start", [1, verseStart]);
  }

  const { data, error } = await query;

  if (error) {
    // Fail quiet on the public surface — don't error-boundary the whole page.
    // Server logs capture the error; production returns an empty-state.
    console.error("[CommentarySection] fetch error:", error.message);
    return null;
  }

  const rows = (data ?? []) as unknown as CommentaryRow[];
  if (rows.length === 0) return null;

  // Filter to rows with a resolvable scholar. Any row missing the join is a
  // data anomaly — skip rather than render unattributed commentary.
  const attributed: CommentaryWithScholar[] = rows
    .filter((r): r is CommentaryRow & { scholar: ScholarMini } => r.scholar !== null)
    .map((r) => ({ ...r, scholar: r.scholar }));

  if (attributed.length === 0) return null;

  // Featured selection: explicit featured > lowest default_rank.
  const explicitFeatured = attributed.find((r) => r.featured);
  const sortedByRank = [...attributed].sort(
    (a, b) => a.scholar.default_rank - b.scholar.default_rank,
  );
  const featured = explicitFeatured ?? sortedByRank[0];

  const others = attributed.filter((r) => r.id !== featured.id);

  const featuredBody =
    featured.featured_excerpt ??
    truncateWords(featured.commentary_text, FEATURED_EXCERPT_WORD_CAP);
  const featuredIsTruncated =
    featured.commentary_text.length > featuredBody.length ||
    featured.featured_excerpt !== null;

  return (
    <div data-commentary-section="true" className="space-y-6">
      <FeaturedExcerpt
        entry={featured}
        excerpt={featuredBody}
        truncated={featuredIsTruncated}
      />
      {others.length > 0 && <OtherVoicesDisclosure voices={others} />}
    </div>
  );
}
