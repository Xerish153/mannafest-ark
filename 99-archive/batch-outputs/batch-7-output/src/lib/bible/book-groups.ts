/**
 * Batch 7 — 10-group book taxonomy used by the Read the Bible overlay and
 * the /group/:slug category landing pages. The split matches Vision v2
 * §7.8's Scripture-Reader-Pillar roster and the BATCH_QUEUE.md wave-3
 * category landings (Law / History / Wisdom / Major Prophets / Minor
 * Prophets / Gospels / Acts / Pauline / General Epistles / Apocalyptic).
 */

import type { BookSlug } from "./book-slugs";

export type BookGroupSlug =
  | "torah"
  | "history"
  | "wisdom"
  | "major-prophets"
  | "minor-prophets"
  | "gospels"
  | "acts"
  | "pauline-epistles"
  | "general-epistles"
  | "apocalyptic";

export type BookGroup = {
  slug: BookGroupSlug;
  label: string;
  books: readonly BookSlug[];
  // Short blurb surfaced on the category landing + overlay column header.
  blurb: string;
};

export const BOOK_GROUPS: readonly BookGroup[] = [
  {
    slug: "torah",
    label: "Torah",
    blurb: "The Law — covenant foundation.",
    books: ["genesis", "exodus", "leviticus", "numbers", "deuteronomy"],
  },
  {
    slug: "history",
    label: "History",
    blurb: "Conquest through exile.",
    books: [
      "joshua", "judges", "ruth",
      "1-samuel", "2-samuel",
      "1-kings", "2-kings",
      "1-chronicles", "2-chronicles",
      "ezra", "nehemiah", "esther",
    ],
  },
  {
    slug: "wisdom",
    label: "Wisdom",
    blurb: "Poetry, prayer, and the fear of the Lord.",
    books: ["job", "psalms", "proverbs", "ecclesiastes", "song-of-solomon"],
  },
  {
    slug: "major-prophets",
    label: "Major Prophets",
    blurb: "The long witnesses before the exile and after.",
    books: ["isaiah", "jeremiah", "lamentations", "ezekiel", "daniel"],
  },
  {
    slug: "minor-prophets",
    label: "Minor Prophets",
    blurb: "Twelve short oracles across three centuries.",
    books: [
      "hosea", "joel", "amos", "obadiah", "jonah", "micah",
      "nahum", "habakkuk", "zephaniah", "haggai", "zechariah", "malachi",
    ],
  },
  {
    slug: "gospels",
    label: "Gospels",
    blurb: "Four witnesses to one Christ.",
    books: ["matthew", "mark", "luke", "john"],
  },
  {
    slug: "acts",
    label: "Acts",
    blurb: "The Spirit poured out; the church in motion.",
    books: ["acts"],
  },
  {
    slug: "pauline-epistles",
    label: "Pauline Epistles",
    blurb: "Paul's letters — doctrine in ink.",
    books: [
      "romans",
      "1-corinthians", "2-corinthians",
      "galatians", "ephesians", "philippians", "colossians",
      "1-thessalonians", "2-thessalonians",
      "1-timothy", "2-timothy", "titus", "philemon",
      "hebrews",
    ],
  },
  {
    slug: "general-epistles",
    label: "General Epistles",
    blurb: "Letters to the whole church.",
    books: [
      "james",
      "1-peter", "2-peter",
      "1-john", "2-john", "3-john",
      "jude",
    ],
  },
  {
    slug: "apocalyptic",
    label: "Apocalyptic",
    blurb: "Revelation — the unveiling.",
    books: ["revelation"],
  },
] as const;

const BY_SLUG = new Map<string, BookGroup>(
  BOOK_GROUPS.map((g) => [g.slug, g]),
);

export function bookGroupBySlug(slug: string): BookGroup | null {
  return BY_SLUG.get(slug.toLowerCase()) ?? null;
}

export function groupForBook(bookSlug: BookSlug): BookGroup | null {
  return BOOK_GROUPS.find((g) => g.books.includes(bookSlug)) ?? null;
}
