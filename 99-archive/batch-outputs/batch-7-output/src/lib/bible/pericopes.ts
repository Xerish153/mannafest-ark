/**
 * Batch 7 — Pericope (section) resolution for the sectioned-layer reader.
 *
 * Fallback chain:
 *   1. pericope_overrides rows for (book, chapter) if any exist
 *   2. featured_page_refs anchors in this chapter as implicit breaks
 *   3. single whole-chapter section
 */

export type Pericope = {
  verse_start: number;
  verse_end: number;
  title: string | null;
};

export type PericopeOverrideRow = {
  verse_start: number;
  verse_end: number;
  title: string | null;
  display_order: number;
};

export type FeaturedRefRow = {
  verse_start: number;
  verse_end: number | null;
  featured_page_slug: string;
  featured_page_title: string;
};

/**
 * Build the ordered pericope list for a chapter given:
 *   - an array of pericope_overrides rows (may be empty)
 *   - an array of featured_page_refs rows (may be empty)
 *   - the chapter's last verse number (from the loaded verses)
 */
export function resolvePericopes(
  overrides: readonly PericopeOverrideRow[],
  featured: readonly FeaturedRefRow[],
  lastVerse: number,
): Pericope[] {
  if (overrides.length > 0) {
    const sorted = [...overrides].sort(
      (a, b) =>
        a.display_order - b.display_order ||
        a.verse_start - b.verse_start,
    );
    return sorted.map((o) => ({
      verse_start: o.verse_start,
      verse_end: o.verse_end,
      title: o.title,
    }));
  }

  if (featured.length > 0) {
    // Use distinct anchor starts as implicit break points. Sort, dedupe,
    // guarantee coverage from verse 1 to lastVerse.
    const anchors = Array.from(
      new Set(
        featured
          .map((f) => f.verse_start)
          .filter((n) => Number.isFinite(n) && n >= 1 && n <= lastVerse),
      ),
    ).sort((a, b) => a - b);

    // Ensure we start at 1.
    if (anchors[0] !== 1) anchors.unshift(1);

    const result: Pericope[] = [];
    for (let i = 0; i < anchors.length; i += 1) {
      const start = anchors[i];
      const end = i + 1 < anchors.length ? anchors[i + 1] - 1 : lastVerse;
      if (end < start) continue;
      // Title the section by the first featured anchor that starts in it,
      // if any. Otherwise untitled.
      const titleHit = featured.find((f) => f.verse_start === start);
      result.push({
        verse_start: start,
        verse_end: end,
        title: titleHit?.featured_page_title ?? null,
      });
    }
    if (result.length > 0) return result;
  }

  return [{ verse_start: 1, verse_end: lastVerse, title: null }];
}
