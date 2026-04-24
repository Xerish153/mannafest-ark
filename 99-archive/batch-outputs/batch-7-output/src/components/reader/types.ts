/**
 * Batch 7 — shared reader types. Mirrors the bundle returned by
 * GET /api/reader/:book/:chapter so client components type-check without a
 * round-trip to the API route's internal types.
 */

export type ReaderTranslation = "KJV" | "WEB" | "ASV";

export type ReaderVerse = { verse_num: number; text: string };

export type ReaderCommentary = {
  id: string;
  author: string;
  source: string;
  commentary_text: string;
  featured_excerpt: string | null;
  featured: boolean;
  founder_curated: boolean;
  author_type: string;
  status: string;
  curator_note: string | null;
  verse_start: number;
  verse_end: number | null;
  display_rank: number | null;
  tradition_tag: string | null;
};

export type ReaderPericope = {
  verse_start: number;
  verse_end: number;
  title: string | null;
};

export type ReaderFeaturedRef = {
  verse_start: number;
  verse_end: number | null;
  featured_page_slug: string;
  featured_page_title: string;
};

export type ReaderCrossRef = {
  node_id: number;
  label: string;
  book_slug: string;
  chapter: number;
  verse: number;
  preview: string | null;
};

export type ReaderBundle = {
  book: {
    slug: string;
    name: string;
    abbreviation: string;
    testament: "OT" | "NT";
    chapter_count: number;
    chapter: number;
  };
  translation: ReaderTranslation;
  verses: ReaderVerse[];
  commentary: ReaderCommentary[];
  pericopes: ReaderPericope[];
  featured_refs: ReaderFeaturedRef[];
  summary: { body: string; drafted_by: string | null } | null;
  cross_refs_by_verse: Record<number, ReaderCrossRef[]>;
  navigation: {
    prev_chapter_url: string | null;
    next_chapter_url: string | null;
    end_of_gospels: boolean;
    end_of_book: boolean;
  };
  signature_verse_node_id: number | null;
};
