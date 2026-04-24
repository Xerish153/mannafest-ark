/**
 * Batch 7 — Canonical book-slug registry.
 *
 * The `books` table has no `slug` column, so the app resolves URL slugs via
 * this map. All 66 books registered; each entry tracks book_id, full name,
 * three-letter abbreviation (matching `books.abbreviation`), testament, and
 * chapter count. The slug is the URL form used in /read/:slug, /book/:slug,
 * and book_hub_config.book_slug.
 *
 * Chapter counts are seeded from the KJV verse store at audit time (Batch 7
 * entry audit) so the reader can compute "is this the last chapter?" without
 * another round-trip. A mismatch with the DB would mean a data regression
 * and should surface loudly, not silently.
 */

export type BookSlug =
  | "genesis" | "exodus" | "leviticus" | "numbers" | "deuteronomy"
  | "joshua" | "judges" | "ruth" | "1-samuel" | "2-samuel"
  | "1-kings" | "2-kings" | "1-chronicles" | "2-chronicles"
  | "ezra" | "nehemiah" | "esther" | "job" | "psalms" | "proverbs"
  | "ecclesiastes" | "song-of-solomon" | "isaiah" | "jeremiah"
  | "lamentations" | "ezekiel" | "daniel"
  | "hosea" | "joel" | "amos" | "obadiah" | "jonah" | "micah"
  | "nahum" | "habakkuk" | "zephaniah" | "haggai" | "zechariah" | "malachi"
  | "matthew" | "mark" | "luke" | "john" | "acts"
  | "romans" | "1-corinthians" | "2-corinthians" | "galatians"
  | "ephesians" | "philippians" | "colossians"
  | "1-thessalonians" | "2-thessalonians" | "1-timothy" | "2-timothy"
  | "titus" | "philemon" | "hebrews"
  | "james" | "1-peter" | "2-peter" | "1-john" | "2-john" | "3-john"
  | "jude" | "revelation";

export type BookMeta = {
  slug: BookSlug;
  bookId: number;
  name: string;
  abbreviation: string; // matches books.abbreviation exactly (title case, 3 chars)
  testament: "OT" | "NT";
  chapterCount: number;
  orderNum: number;
};

export const BOOKS: readonly BookMeta[] = [
  { slug: "genesis", bookId: 1, name: "Genesis", abbreviation: "Gen", testament: "OT", chapterCount: 50, orderNum: 1 },
  { slug: "exodus", bookId: 2, name: "Exodus", abbreviation: "Exo", testament: "OT", chapterCount: 40, orderNum: 2 },
  { slug: "leviticus", bookId: 3, name: "Leviticus", abbreviation: "Lev", testament: "OT", chapterCount: 27, orderNum: 3 },
  { slug: "numbers", bookId: 4, name: "Numbers", abbreviation: "Num", testament: "OT", chapterCount: 36, orderNum: 4 },
  { slug: "deuteronomy", bookId: 5, name: "Deuteronomy", abbreviation: "Deu", testament: "OT", chapterCount: 34, orderNum: 5 },
  { slug: "joshua", bookId: 6, name: "Joshua", abbreviation: "Jos", testament: "OT", chapterCount: 24, orderNum: 6 },
  { slug: "judges", bookId: 7, name: "Judges", abbreviation: "Jdg", testament: "OT", chapterCount: 21, orderNum: 7 },
  { slug: "ruth", bookId: 8, name: "Ruth", abbreviation: "Rut", testament: "OT", chapterCount: 4, orderNum: 8 },
  { slug: "1-samuel", bookId: 9, name: "1 Samuel", abbreviation: "1Sa", testament: "OT", chapterCount: 31, orderNum: 9 },
  { slug: "2-samuel", bookId: 10, name: "2 Samuel", abbreviation: "2Sa", testament: "OT", chapterCount: 24, orderNum: 10 },
  { slug: "1-kings", bookId: 11, name: "1 Kings", abbreviation: "1Ki", testament: "OT", chapterCount: 22, orderNum: 11 },
  { slug: "2-kings", bookId: 12, name: "2 Kings", abbreviation: "2Ki", testament: "OT", chapterCount: 25, orderNum: 12 },
  { slug: "1-chronicles", bookId: 13, name: "1 Chronicles", abbreviation: "1Ch", testament: "OT", chapterCount: 29, orderNum: 13 },
  { slug: "2-chronicles", bookId: 14, name: "2 Chronicles", abbreviation: "2Ch", testament: "OT", chapterCount: 36, orderNum: 14 },
  { slug: "ezra", bookId: 15, name: "Ezra", abbreviation: "Ezr", testament: "OT", chapterCount: 10, orderNum: 15 },
  { slug: "nehemiah", bookId: 16, name: "Nehemiah", abbreviation: "Neh", testament: "OT", chapterCount: 13, orderNum: 16 },
  { slug: "esther", bookId: 17, name: "Esther", abbreviation: "Est", testament: "OT", chapterCount: 10, orderNum: 17 },
  { slug: "job", bookId: 18, name: "Job", abbreviation: "Job", testament: "OT", chapterCount: 42, orderNum: 18 },
  { slug: "psalms", bookId: 19, name: "Psalms", abbreviation: "Psa", testament: "OT", chapterCount: 150, orderNum: 19 },
  { slug: "proverbs", bookId: 20, name: "Proverbs", abbreviation: "Pro", testament: "OT", chapterCount: 31, orderNum: 20 },
  { slug: "ecclesiastes", bookId: 21, name: "Ecclesiastes", abbreviation: "Ecc", testament: "OT", chapterCount: 12, orderNum: 21 },
  { slug: "song-of-solomon", bookId: 22, name: "Song of Solomon", abbreviation: "Sng", testament: "OT", chapterCount: 8, orderNum: 22 },
  { slug: "isaiah", bookId: 23, name: "Isaiah", abbreviation: "Isa", testament: "OT", chapterCount: 66, orderNum: 23 },
  { slug: "jeremiah", bookId: 24, name: "Jeremiah", abbreviation: "Jer", testament: "OT", chapterCount: 52, orderNum: 24 },
  { slug: "lamentations", bookId: 25, name: "Lamentations", abbreviation: "Lam", testament: "OT", chapterCount: 5, orderNum: 25 },
  { slug: "ezekiel", bookId: 26, name: "Ezekiel", abbreviation: "Eze", testament: "OT", chapterCount: 48, orderNum: 26 },
  { slug: "daniel", bookId: 27, name: "Daniel", abbreviation: "Dan", testament: "OT", chapterCount: 12, orderNum: 27 },
  { slug: "hosea", bookId: 28, name: "Hosea", abbreviation: "Hos", testament: "OT", chapterCount: 14, orderNum: 28 },
  { slug: "joel", bookId: 29, name: "Joel", abbreviation: "Joe", testament: "OT", chapterCount: 3, orderNum: 29 },
  { slug: "amos", bookId: 30, name: "Amos", abbreviation: "Amo", testament: "OT", chapterCount: 9, orderNum: 30 },
  { slug: "obadiah", bookId: 31, name: "Obadiah", abbreviation: "Oba", testament: "OT", chapterCount: 1, orderNum: 31 },
  { slug: "jonah", bookId: 32, name: "Jonah", abbreviation: "Jon", testament: "OT", chapterCount: 4, orderNum: 32 },
  { slug: "micah", bookId: 33, name: "Micah", abbreviation: "Mic", testament: "OT", chapterCount: 7, orderNum: 33 },
  { slug: "nahum", bookId: 34, name: "Nahum", abbreviation: "Nah", testament: "OT", chapterCount: 3, orderNum: 34 },
  { slug: "habakkuk", bookId: 35, name: "Habakkuk", abbreviation: "Hab", testament: "OT", chapterCount: 3, orderNum: 35 },
  { slug: "zephaniah", bookId: 36, name: "Zephaniah", abbreviation: "Zep", testament: "OT", chapterCount: 3, orderNum: 36 },
  { slug: "haggai", bookId: 37, name: "Haggai", abbreviation: "Hag", testament: "OT", chapterCount: 2, orderNum: 37 },
  { slug: "zechariah", bookId: 38, name: "Zechariah", abbreviation: "Zec", testament: "OT", chapterCount: 14, orderNum: 38 },
  { slug: "malachi", bookId: 39, name: "Malachi", abbreviation: "Mal", testament: "OT", chapterCount: 4, orderNum: 39 },
  { slug: "matthew", bookId: 40, name: "Matthew", abbreviation: "Mat", testament: "NT", chapterCount: 28, orderNum: 40 },
  { slug: "mark", bookId: 41, name: "Mark", abbreviation: "Mrk", testament: "NT", chapterCount: 16, orderNum: 41 },
  { slug: "luke", bookId: 42, name: "Luke", abbreviation: "Luk", testament: "NT", chapterCount: 24, orderNum: 42 },
  { slug: "john", bookId: 43, name: "John", abbreviation: "Jhn", testament: "NT", chapterCount: 21, orderNum: 43 },
  { slug: "acts", bookId: 44, name: "Acts", abbreviation: "Act", testament: "NT", chapterCount: 28, orderNum: 44 },
  { slug: "romans", bookId: 45, name: "Romans", abbreviation: "Rom", testament: "NT", chapterCount: 16, orderNum: 45 },
  { slug: "1-corinthians", bookId: 46, name: "1 Corinthians", abbreviation: "1Co", testament: "NT", chapterCount: 16, orderNum: 46 },
  { slug: "2-corinthians", bookId: 47, name: "2 Corinthians", abbreviation: "2Co", testament: "NT", chapterCount: 13, orderNum: 47 },
  { slug: "galatians", bookId: 48, name: "Galatians", abbreviation: "Gal", testament: "NT", chapterCount: 6, orderNum: 48 },
  { slug: "ephesians", bookId: 49, name: "Ephesians", abbreviation: "Eph", testament: "NT", chapterCount: 6, orderNum: 49 },
  { slug: "philippians", bookId: 50, name: "Philippians", abbreviation: "Php", testament: "NT", chapterCount: 4, orderNum: 50 },
  { slug: "colossians", bookId: 51, name: "Colossians", abbreviation: "Col", testament: "NT", chapterCount: 4, orderNum: 51 },
  { slug: "1-thessalonians", bookId: 52, name: "1 Thessalonians", abbreviation: "1Th", testament: "NT", chapterCount: 5, orderNum: 52 },
  { slug: "2-thessalonians", bookId: 53, name: "2 Thessalonians", abbreviation: "2Th", testament: "NT", chapterCount: 3, orderNum: 53 },
  { slug: "1-timothy", bookId: 54, name: "1 Timothy", abbreviation: "1Ti", testament: "NT", chapterCount: 6, orderNum: 54 },
  { slug: "2-timothy", bookId: 55, name: "2 Timothy", abbreviation: "2Ti", testament: "NT", chapterCount: 4, orderNum: 55 },
  { slug: "titus", bookId: 56, name: "Titus", abbreviation: "Tit", testament: "NT", chapterCount: 3, orderNum: 56 },
  { slug: "philemon", bookId: 57, name: "Philemon", abbreviation: "Phm", testament: "NT", chapterCount: 1, orderNum: 57 },
  { slug: "hebrews", bookId: 58, name: "Hebrews", abbreviation: "Heb", testament: "NT", chapterCount: 13, orderNum: 58 },
  { slug: "james", bookId: 59, name: "James", abbreviation: "Jas", testament: "NT", chapterCount: 5, orderNum: 59 },
  { slug: "1-peter", bookId: 60, name: "1 Peter", abbreviation: "1Pe", testament: "NT", chapterCount: 5, orderNum: 60 },
  { slug: "2-peter", bookId: 61, name: "2 Peter", abbreviation: "2Pe", testament: "NT", chapterCount: 3, orderNum: 61 },
  { slug: "1-john", bookId: 62, name: "1 John", abbreviation: "1Jn", testament: "NT", chapterCount: 5, orderNum: 62 },
  { slug: "2-john", bookId: 63, name: "2 John", abbreviation: "2Jn", testament: "NT", chapterCount: 1, orderNum: 63 },
  { slug: "3-john", bookId: 64, name: "3 John", abbreviation: "3Jn", testament: "NT", chapterCount: 1, orderNum: 64 },
  { slug: "jude", bookId: 65, name: "Jude", abbreviation: "Jud", testament: "NT", chapterCount: 1, orderNum: 65 },
  { slug: "revelation", bookId: 66, name: "Revelation", abbreviation: "Rev", testament: "NT", chapterCount: 22, orderNum: 66 },
] as const;

const BY_SLUG = new Map<string, BookMeta>(BOOKS.map((b) => [b.slug, b]));
const BY_ID = new Map<number, BookMeta>(BOOKS.map((b) => [b.bookId, b]));
const BY_ABBR_LOWER = new Map<string, BookMeta>(
  BOOKS.map((b) => [b.abbreviation.toLowerCase(), b]),
);

export function bookBySlug(slug: string): BookMeta | null {
  return BY_SLUG.get(slug.toLowerCase()) ?? null;
}

export function bookById(bookId: number): BookMeta | null {
  return BY_ID.get(bookId) ?? null;
}

/**
 * Back-compat with the legacy /read/:abbr routes — the existing chapter
 * reader linked via `book.abbreviation.toLowerCase()` ("mat", "jhn", ...).
 * When we swap the new slug form in, incoming `/read/mat/5` and similar
 * still need to resolve.
 */
export function bookByAbbrOrSlug(key: string): BookMeta | null {
  const lower = key.toLowerCase();
  return BY_SLUG.get(lower) ?? BY_ABBR_LOWER.get(lower) ?? null;
}

export function allBooks(): readonly BookMeta[] {
  return BOOKS;
}

export function nextBookOf(book: BookMeta): BookMeta | null {
  return BY_ID.get(book.bookId + 1) ?? null;
}

export function prevBookOf(book: BookMeta): BookMeta | null {
  return BY_ID.get(book.bookId - 1) ?? null;
}
