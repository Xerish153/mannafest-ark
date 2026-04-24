/**
 * Canonical day-of-year verse rotation — the fallback floor so VOTD renders
 * something every day, even when `votd_reflections` has no row.
 *
 * Vision v2 §4.7 spec: when no founder reflection is queued for the day,
 * the site still shows the day's verse with a scholar-quote fallback. The
 * canonical rotation picks WHICH verse to show.
 *
 * Design: a curated base list of 60 well-known verses, rotated by
 * day-of-year. Small enough that Marcus can review + swap entries without
 * wading through 366 rows; evenly spread across comfort / doctrine /
 * commands / hope / Psalms so the devotional cadence stays varied. When
 * Pastor Marc fills in a `votd_reflections` row for a date, that entry
 * overrides the canonical pick for that date only.
 *
 * Not a DB table by design — this is curator intent, cheap to change in
 * code, and lives alongside the layout code that consumes it.
 */

export type CanonicalVerse = {
  book_abbr: string; // DB `books.abbreviation` value, e.g. "Gen", "Rom", "Psa"
  chapter: number;
  verse: number;
};

/**
 * Ordered list of 60 canonical verses. Day-of-year N resolves via
 * `CANONICAL_VOTD[(N - 1) % CANONICAL_VOTD.length]`. Zero bias — the list
 * starts with Genesis 1:1 on Jan 1 and loops.
 */
export const CANONICAL_VOTD: CanonicalVerse[] = [
  // Origins + identity
  { book_abbr: "Gen", chapter: 1, verse: 1 },
  { book_abbr: "Gen", chapter: 1, verse: 27 },
  { book_abbr: "Gen", chapter: 3, verse: 15 },
  { book_abbr: "Gen", chapter: 12, verse: 3 },
  { book_abbr: "Deu", chapter: 6, verse: 4 },
  { book_abbr: "Deu", chapter: 6, verse: 5 },
  { book_abbr: "Jos", chapter: 1, verse: 9 },

  // Psalms — devotional anchors
  { book_abbr: "Psa", chapter: 1, verse: 1 },
  { book_abbr: "Psa", chapter: 19, verse: 1 },
  { book_abbr: "Psa", chapter: 23, verse: 1 },
  { book_abbr: "Psa", chapter: 23, verse: 4 },
  { book_abbr: "Psa", chapter: 27, verse: 1 },
  { book_abbr: "Psa", chapter: 34, verse: 8 },
  { book_abbr: "Psa", chapter: 37, verse: 4 },
  { book_abbr: "Psa", chapter: 46, verse: 10 },
  { book_abbr: "Psa", chapter: 51, verse: 10 },
  { book_abbr: "Psa", chapter: 91, verse: 1 },
  { book_abbr: "Psa", chapter: 118, verse: 24 },
  { book_abbr: "Psa", chapter: 119, verse: 105 },
  { book_abbr: "Psa", chapter: 139, verse: 14 },

  // Wisdom
  { book_abbr: "Pro", chapter: 3, verse: 5 },
  { book_abbr: "Pro", chapter: 3, verse: 6 },
  { book_abbr: "Pro", chapter: 22, verse: 6 },
  { book_abbr: "Ecc", chapter: 3, verse: 1 },
  { book_abbr: "Ecc", chapter: 12, verse: 13 },

  // Prophets — hope + servant
  { book_abbr: "Isa", chapter: 7, verse: 14 },
  { book_abbr: "Isa", chapter: 9, verse: 6 },
  { book_abbr: "Isa", chapter: 40, verse: 31 },
  { book_abbr: "Isa", chapter: 41, verse: 10 },
  { book_abbr: "Isa", chapter: 53, verse: 5 },
  { book_abbr: "Isa", chapter: 55, verse: 8 },
  { book_abbr: "Jer", chapter: 29, verse: 11 },
  { book_abbr: "Mic", chapter: 6, verse: 8 },

  // Gospels — identity + commands
  { book_abbr: "Mat", chapter: 5, verse: 16 },
  { book_abbr: "Mat", chapter: 6, verse: 33 },
  { book_abbr: "Mat", chapter: 11, verse: 28 },
  { book_abbr: "Mat", chapter: 22, verse: 37 },
  { book_abbr: "Mat", chapter: 28, verse: 19 },
  { book_abbr: "Mar", chapter: 12, verse: 30 },
  { book_abbr: "Luk", chapter: 9, verse: 23 },
  { book_abbr: "Jhn", chapter: 1, verse: 1 },
  { book_abbr: "Jhn", chapter: 1, verse: 14 },
  { book_abbr: "Jhn", chapter: 3, verse: 16 },
  { book_abbr: "Jhn", chapter: 14, verse: 6 },
  { book_abbr: "Jhn", chapter: 14, verse: 27 },
  { book_abbr: "Jhn", chapter: 15, verse: 13 },

  // Epistles — doctrine + life
  { book_abbr: "Rom", chapter: 3, verse: 23 },
  { book_abbr: "Rom", chapter: 5, verse: 8 },
  { book_abbr: "Rom", chapter: 6, verse: 23 },
  { book_abbr: "Rom", chapter: 8, verse: 28 },
  { book_abbr: "Rom", chapter: 8, verse: 31 },
  { book_abbr: "Rom", chapter: 10, verse: 9 },
  { book_abbr: "1Co", chapter: 13, verse: 4 },
  { book_abbr: "2Co", chapter: 5, verse: 17 },
  { book_abbr: "Gal", chapter: 2, verse: 20 },
  { book_abbr: "Eph", chapter: 2, verse: 8 },
  { book_abbr: "Phi", chapter: 4, verse: 6 },
  { book_abbr: "Phi", chapter: 4, verse: 13 },
  { book_abbr: "2Ti", chapter: 1, verse: 7 },
  { book_abbr: "Heb", chapter: 11, verse: 1 },
  { book_abbr: "Heb", chapter: 12, verse: 2 },
  { book_abbr: "1Jn", chapter: 4, verse: 19 },
  { book_abbr: "Rev", chapter: 21, verse: 4 },
];

/**
 * Resolve the canonical verse for a given day-of-year (1..366).
 * Stable across years — the same day maps to the same verse unless
 * CANONICAL_VOTD is reordered.
 */
export function canonicalVotdForDay(dayOfYear: number): CanonicalVerse {
  const idx = ((dayOfYear - 1) % CANONICAL_VOTD.length + CANONICAL_VOTD.length)
    % CANONICAL_VOTD.length;
  return CANONICAL_VOTD[idx];
}

/** Day-of-year (1..366) for a given date in the local timezone. */
export function getDayOfYear(date: Date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/** ISO YYYY-MM-DD formatter — consistent with votd_reflections.date serialization. */
export function formatIsoDate(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
