/**
 * Batch 7 — shared book hub types.
 */

import type { BookMeta, BookSlug } from "@/lib/bible/book-slugs";
import type { ReaderCommentary, ReaderFeaturedRef } from "@/components/reader/types";

export type BookHubTier = 1 | 2;

export type StatStripEntry = { value: string; label: string };

export type BookStructureOutline = {
  kind: "outline";
  sections: Array<{
    label: string;
    chapters: string; // display form, e.g. "1–4" or "5–7"
    startChapter: number;
    blurb?: string;
  }>;
};

export type BookStructureGrid = {
  kind: "grid";
  chapters: number[];
};

export type BookStructure = BookStructureOutline | BookStructureGrid;

export type ThemeCard = {
  id: string;
  title: string;
  body: string;
};

export type KeyChapter = {
  chapter: number;
  label: string;
  blurb?: string;
};

export type RelatedNode = {
  id: number | string;
  type: "person" | "place" | "concept" | "theme" | "prophecy" | "topic";
  name: string;
  href: string;
};

export type BookHubData = {
  tier: BookHubTier;
  meta: BookMeta;
  signatureVerse: {
    label: string; // e.g., "Matthew 28:18–20"
    text: string;
  } | null;
  introOverride: string | null;
  hero: {
    tagline: string;
    statStrip: StatStripEntry[];
  };
  metadata: {
    author: string | null;
    date: string | null;
    audience: string | null;
    canonicalPosition: string;
  };
  structure: BookStructure;
  themes: ThemeCard[];
  keyChapters: KeyChapter[];
  featuredCommentary: ReaderCommentary | null;
  featuredStudies: ReaderFeaturedRef[];
  relatedNodes: RelatedNode[];
  // Bespoke depth-1 visual payload (Phase 6 component lookup key). Null
  // means the layout falls through to the generic structured outline.
  bespokeVisual: "matthew" | "mark" | "luke" | "john" | "acts" | null;
  chapterIndex: readonly number[];
};

export type { BookSlug };
