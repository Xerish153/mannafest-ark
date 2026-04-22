# Batch 3.7 — Storage Discovery

**Date:** 2026-04-21
**Supabase project:** `ufrmssiqjtqfywthgpte` (MannaFest, us-west-2, Postgres 17.6)

## Where Bible text lives

Bible verse text is stored in Supabase in three related tables. No JSON or seed-file copy of the full Bible lives in the repo — seeds are streamed from scrollmapper/bible_databases at seed time.

### `public.translations` (5 rows)

| id | name | abbreviation | language | is_public_domain |
|---:|---|---|---|---|
| 1 | King James Version | KJV | en | true |
| 2 | American Standard Version | ASV | en | true |
| 3 | World English Bible | WEB | en | true |
| 4 | Young's Literal Translation | YLT | en | true |
| 5 | Darby Bible Translation | DBT | en | true |

The batch-locked translations are rows 1 (KJV), 2 (ASV), and 3 (WEB). Rows 4–5 (YLT, DBT) also have full verse text seeded but are outside the Vision v2 §3 row-7 policy (KJV/WEB/ASV only). This audit ignores them.

### `public.books` (66 rows)

Columns: `id` (bigint PK), `name` (text), `abbreviation` (text, 3-letter), `testament` (text: `OT`/`NT`), `order_num` (int 1–66), `genre`, `author`, `approximate_date`, `created_at`. All 66 Protestant canonical books present with `order_num` 1 (Genesis) through 66 (Revelation). Book names match the spellings used in the canonical reference JSON (e.g. `Song of Solomon`, `1 Samuel`). No Apocrypha rows in this table — those live in a separate `apocrypha_works` table (27 rows, out of scope for this batch).

### `public.verses` (155,510 rows)

Columns: `id` (bigint PK), `translation_id` (bigint FK → `translations.id`), `book_id` (bigint FK → `books.id`), `chapter_num` (int), `verse_num` (int), `text` (text), `word_count` (int, nullable), `created_at` (timestamptz). Row count = 31,102 × 5 — i.e. every translation has every verse.

## What's not in the repo

- No `*.json` or `*.sql` file under `data/`, `public/`, `scripts/`, or `supabase/migrations/` carries the Bible text itself.
- `scripts/seed-translation-verses.ts` is the ingestion script — it pulls `ASV.json`, `WEB.json`, `YLT.json`, `Darby.json` from `scrollmapper/bible_databases` on GitHub and writes directly to `public.verses`. KJV was seeded earlier via `scripts/seed-verses.ts` (same source family).
- `scripts/seed-books.ts` and `scripts/seed-translations.ts` handle the two lookup tables.

Because the Bible text lives only in Supabase, the audit operates entirely against the DB via MCP `execute_sql`. No repo-side verse file needs to be re-generated.

## Integrity constraints currently in place

- `verses` has RLS enabled.
- No UNIQUE constraint on `(translation_id, book_id, chapter_num, verse_num)` is advertised in migrations up through 042. Step 6 of this batch checks this and adds one if missing.

## Row counts going in

| Translation | `COUNT(*)` | Distinct chapters | Expected (canonical) |
|---|---:|---:|---:|
| KJV | 31,102 | 1,189 | 31,102 / 1,189 |
| WEB | 31,102 | 1,189 | 31,102 / 1,189 |
| ASV | 31,102 | 1,189 | 31,102 / 1,189 |

At the grand-total and chapter-count level, every translation matches the Protestant canonical structure before any per-chapter drilldown. The per-chapter audit (`batch-3-7-audit.md`) confirms.
