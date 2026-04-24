/**
 * Auto-rank + founder-override resolution pattern.
 *
 * This pattern ships first for cross-references (Batch 5.5) and is reused
 * for VOTD related-verses + explore-more links (Batch 4.5).
 *
 * Underlying data model: ranking lives as two columns on graph_edges
 * (`display_rank INT`, `founder_override BOOLEAN`). No dedicated
 * cross_references table exists in this project — the Batch 5.5 entry audit
 * confirmed cross-refs are graph_edges between graph_nodes of type='verse'.
 *
 * Resolution order:
 *   1. Rows with founder_override=true, sorted by display_rank (pinned)
 *   2. Rows with founder_override=false, sorted by display_rank (auto)
 *
 * The admin surface at /admin/cross-references/[verseId] sets
 * founder_override=true and rewrites display_rank for the pinned subset;
 * auto rows keep their original rank from backfill.
 *
 * Keep this file generic. Batch 4.5 VOTD will import `resolveRankedList`
 * unmodified and pass rows of a different concrete type — any type with
 * `display_rank: number | null` and `founder_override: boolean` satisfies
 * the constraint.
 */

export type Ranked = {
  display_rank: number | null;
  founder_override: boolean;
};

/**
 * Stable sort: overrides first (by rank), then auto rows (by rank).
 * Does not mutate its input.
 *
 * NULL display_rank sorts last within each override partition — an edge that
 * was never backfilled (unlikely in production; see migration 050) falls to
 * the bottom rather than poisoning the top.
 */
export function resolveRankedList<T extends Ranked>(rows: readonly T[]): T[] {
  return [...rows].sort((a, b) => {
    if (a.founder_override !== b.founder_override) {
      return a.founder_override ? -1 : 1;
    }
    const aRank = a.display_rank ?? Number.MAX_SAFE_INTEGER;
    const bRank = b.display_rank ?? Number.MAX_SAFE_INTEGER;
    return aRank - bRank;
  });
}

/**
 * Default top-N for surface rendering. Batch 5.5 verse-page cross-references
 * section renders this many inline; the remainder lives behind a "Show all N"
 * disclosure. Batch 4.5 VOTD related-verses is expected to use the same N.
 */
export const DEFAULT_TOP_N = 5;

/**
 * Convenience: take the top N, then split into "shown" and "rest" so the
 * caller can render the disclosure without repeating the slice.
 */
export function partitionRanked<T extends Ranked>(
  rows: readonly T[],
  topN: number = DEFAULT_TOP_N,
): { shown: T[]; rest: T[] } {
  const sorted = resolveRankedList(rows);
  return {
    shown: sorted.slice(0, topN),
    rest: sorted.slice(topN),
  };
}
