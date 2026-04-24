/**
 * Scholars schema (Batch 4+5 — extended).
 *
 * Existing columns (migrations pre-025 + 025/026): id, slug, name, birth_year,
 * death_year, era, nationality, denomination, bio, known_for, key_works,
 * key_quotes, favorite_verses, image_url, wikipedia_url, created_at,
 * is_jewish_source, tradition (free-text narrative), beliefs_bullets,
 * notable_works, where_to_find, one_line_description, is_author_profile.
 *
 * Added by migration 045:
 * - default_rank  — sort key for auto-rank commentary fallback (Doctrine A)
 * - is_founder    — true only for marc-mannafest (founder voice surfaces first)
 * - tradition_key — one of the 10 enumerated tradition keys used by <TraditionChip />
 */

import type { TraditionKey } from "@/lib/citations/traditions";

export type Scholar = {
  id: string;
  slug: string;
  name: string;
  birth_year: number | null;
  death_year: number | null;
  era: string | null;
  nationality: string | null;
  denomination: string | null;
  bio: string;
  known_for: string[] | null;
  key_works: unknown;
  key_quotes: unknown;
  favorite_verses: unknown;
  image_url: string | null;
  wikipedia_url: string | null;
  created_at: string | null;
  is_jewish_source: boolean | null;

  // Author-profile columns (migration 025).
  tradition: string | null;
  beliefs_bullets: unknown;
  notable_works: unknown;
  where_to_find: unknown;
  one_line_description: string | null;
  is_author_profile: boolean;

  // Batch 4+5 columns (migration 045).
  default_rank: number;
  is_founder: boolean;
  tradition_key: TraditionKey | null;
};

/**
 * Compact shape sufficient for the commentary render path. Kept small so the
 * verse-page query can join without hauling the full scholar row.
 */
export type ScholarMini = Pick<
  Scholar,
  | "id"
  | "slug"
  | "name"
  | "tradition_key"
  | "default_rank"
  | "is_founder"
>;

/**
 * Slugs of the 15 commentators that Doctrine A expects. If you add more, keep
 * this in sync with src/lib/citations/scholars.ts — the TS list is the app-layer
 * source of record and the DB row must match.
 */
export const COMMENTATOR_SLUGS = [
  "calvin",
  "spurgeon",
  "matthew-henry",
  "jfb",
  "clarke",
  "barnes",
  "gill",
  "wesley",
  "geneva",
  "owen",
  "chrysostom",
  "augustine",
  "bullinger",
  "seiss",
  "marc-mannafest",
] as const;

export type CommentatorSlug = (typeof COMMENTATOR_SLUGS)[number];
