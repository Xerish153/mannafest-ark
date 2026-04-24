---
batch: batch-4-5-commentary-editorial
status: AMENDMENT DRAFT — awaiting greenlight
supersedes: original prompt in Cowork Batch 4+5 run
blocker-record: batch-4-5-blocker.md
path-chosen: A — rewrite to real schema (2026-04-22)
---

# Batch 4 + 5 — Amendment (Path A)

This rewrites the original Batch 4+5 prompt against actual production schema (`ufrmssiqjtqfywthgpte`). Where the original step still stands as-written, this amendment says "unchanged." Where it doesn't, this amendment spells out the replacement. Read this side-by-side with the original prompt; when they disagree, this doc wins.

## Execution pattern (recommended)

The Cowork sandbox git is broken (documented in `batch-4-5-blocker.md` §1). Rather than try to repair and auto-merge from inside the sandbox, use the tooling pattern locked 2026-04-21:

- **Supabase DDL**: Cowork runs the 4 migrations via MCP `apply_migration` (no git in critical path).
- **Code files** (components, API routes, admin pages, schema types): Cowork writes them into the vault scratchpad folder (a new `_ark/batch-4-5-output/` tree that mirrors the target repo paths). Marcus pulls them Windows-direct, runs lint + tsc + build locally, commits file-explicit, and merges.
- **Vault records** (session record, STATUS updates, prompt status): Cowork writes direct to the vault.

That avoids the sandbox git issue entirely while still getting Cowork the long-batch work it does well. If Marcus would prefer Cowork repair the sandbox git first and do auto-merge, say so and the pattern flips.

## High-level diff from original prompt

| Area                     | Original                                                  | Amended                                                                                              |
| ------------------------ | --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Commentator registry     | New `commentators` table, 15 seed rows                    | Use existing `scholars` (32 rows). Add missing rank/founder columns. Seed the 14 missing PD slugs + `marc-mannafest`. |
| Commentary table name    | `commentary` (singular)                                   | `commentaries` (plural — already in production, 1189 rows)                                           |
| Commentary FK            | `commentator_id UUID NOT NULL`                            | `scholar_id UUID NOT NULL` referencing `scholars(id)`                                                |
| Commentary text column   | `body`                                                    | `commentary_text` (existing column, no rename)                                                       |
| Verse addressing         | `verse_id UUID`                                           | Keep current `(book_id, chapter, verse_start, verse_end, verse_reference)`. Defer `verse_id` FK to a dedicated hygiene batch. |
| Super-admin check        | `user.user_metadata.role === 'super_admin'`               | `profiles.is_admin = true` joined from `auth.uid()`                                                  |
| Migration naming         | `2026_04_22_NNN_...`                                      | `045_..sql` … `048_..sql` (continues sequence; matches prod migration table's `NNN_name` style)     |
| TypeScript types file    | `src/lib/supabase/database.types.ts`                      | Whatever the current pattern is — `src/lib/supabase.ts` + schema folder `src/lib/supabase/schemas/` (new). Confirm before writing. |
| Schema types path        | `src/lib/supabase/schemas/commentators.ts`                | `src/lib/supabase/schemas/scholars.ts` (extends existing scholars type)                              |
| Drawer exclusion list    | Verse pages excluded via pattern match                    | Unchanged — but verse route pattern needs confirmation from `src/app/study/[book]/[chapter]/` layout before the provider is wired. |

Everything else in the original prompt stands — components, drawer behavior, admin surfaces, in-context affordances, markdown sanitization, acceptance click-through.

## Amended steps

### Step 1 — Batch 3 deps

**Pass**. Verified 2026-04-22:

- `src/components/Cite/Cite.tsx`, `src/components/Cite/TraditionChip.tsx` — present
- `src/lib/citations/traditions.ts`, `src/lib/citations/scholars.ts` — present, 15 slugs
- `src/components/motion/FadeIn.tsx` — present
- Source Serif 4 loaded in `src/app/layout.tsx` line 2
- All 10 tradition CSS custom properties in `globals.css` lines 73–82 + 129–138

STATUS.md still needs the Batch 3 decision-log entry — Marcus to add Windows-direct, with the real commit hash + deploy timestamp. Cowork is not backfilling that line.

### Step 2 — Extend `scholars` table (NOT create `commentators`)

Migration `supabase/migrations/045_scholars_commentary_columns.sql`.

```sql
-- Add ranking + founder + default-tradition columns needed by Doctrine A auto-rank.
ALTER TABLE scholars ADD COLUMN IF NOT EXISTS default_rank INTEGER NOT NULL DEFAULT 1000;
ALTER TABLE scholars ADD COLUMN IF NOT EXISTS is_founder   BOOLEAN NOT NULL DEFAULT FALSE;

-- `tradition` already exists as a free-text column (migration 025). Introduce a second,
-- tradition-key column that maps cleanly to the 10 Vision-v2 tradition keys used by
-- <TraditionChip />. Keep the narrative `tradition` column for author profile copy.
ALTER TABLE scholars ADD COLUMN IF NOT EXISTS tradition_key TEXT
  CONSTRAINT scholars_tradition_key_chk CHECK (
    tradition_key IS NULL OR tradition_key IN
      ('reformed','patristic','jewish','evangelical','puritan','anglican','charismatic','academic','editor','modern-scholar')
  );

CREATE INDEX IF NOT EXISTS idx_scholars_default_rank ON scholars(default_rank);
CREATE INDEX IF NOT EXISTS idx_scholars_slug         ON scholars(slug);
```

The existing `tradition` text column stays untouched (used by `/authors/[slug]` pages). The new `tradition_key` column is what `CommentarySection` uses to pick chip color + label.

### Step 3 — Seed/upsert the 15 commentator rows in `scholars`

Migration `supabase/migrations/046_scholars_seed_commentators.sql`.

One `matthew-henry` row already exists — UPDATE rather than INSERT. 14 other slugs don't exist yet — INSERT. One `marc-mannafest` row needs to exist — check whether the app-layer `scholars.ts` slug matches any DB row first; INSERT if missing.

Upsert pattern (uses existing `scholars.slug` uniqueness):

```sql
INSERT INTO scholars (slug, name, tradition, tradition_key, default_rank, is_founder, is_author_profile, bio)
VALUES
  ('calvin',             'John Calvin',                'Reformed',              'reformed',   100,  FALSE, FALSE, '[founder: write here]'),
  ('spurgeon',           'Charles Spurgeon',           'Reformed Baptist',      'puritan',    200,  FALSE, FALSE, '[founder: write here]'),
  ('matthew-henry',      'Matthew Henry',              'Puritan / Presbyterian','puritan',    300,  FALSE, TRUE,  '[keep existing bio]'),
  ('jfb',                'Jamieson, Fausset & Brown',  'Reformed',              'reformed',   400,  FALSE, FALSE, '[founder: write here]'),
  ('clarke',             'Adam Clarke',                'Methodist / Evangelical','evangelical', 500, FALSE, FALSE, '[founder: write here]'),
  ('barnes',             'Albert Barnes',              'Presbyterian / Evangelical','evangelical', 600, FALSE, FALSE, '[founder: write here]'),
  ('gill',               'John Gill',                  'Reformed Baptist',      'reformed',   700,  FALSE, FALSE, '[founder: write here]'),
  ('wesley',             'John Wesley (NT Notes)',     'Methodist / Evangelical','evangelical', 800, FALSE, FALSE, '[founder: write here]'),
  ('geneva',             'Geneva Bible Marginalia',    'Reformed',              'reformed',   900,  FALSE, FALSE, '[founder: write here]'),
  ('owen',               'John Owen',                  'Puritan',               'puritan',    1000, FALSE, FALSE, '[founder: write here]'),
  ('chrysostom',         'John Chrysostom',            'Patristic / Eastern',   'patristic',  1000, FALSE, FALSE, '[founder: write here]'),
  ('augustine',          'Augustine of Hippo',         'Patristic / Western',   'patristic',  1000, FALSE, FALSE, '[founder: write here]'),
  ('bullinger',          'E. W. Bullinger',            'Dispensational',        'evangelical',1000, FALSE, FALSE, '[founder: write here]'),
  ('seiss',              'Joseph A. Seiss',            'Lutheran / Dispensational','evangelical', 1000, FALSE, FALSE, '[founder: write here]'),
  ('marc-mannafest',     'Pastor Marc — MannaFest',    'Editor (MannaFest)',    'editor',     50,   TRUE,  TRUE,  'MannaFest founder; sole editorial voice of this site.')
ON CONFLICT (slug) DO UPDATE SET
  default_rank  = EXCLUDED.default_rank,
  tradition_key = EXCLUDED.tradition_key,
  is_founder    = EXCLUDED.is_founder;
```

Notes on slug choices:

- Prompt originally specified `jamieson-fausset-brown`, `wesley-nt`, `geneva-bible`, `pastor-marc-mannafest`. The repo's `src/lib/citations/scholars.ts` uses `jfb`, `wesley`, `geneva`, `marc-mannafest`. The app is the consumer of record; amendment uses the repo's slugs. If Marcus wants the longer ones, say so and both sides get updated.
- `bio NOT NULL` in production. Rows without real bios get `'[founder: write here]'` — the placeholder pattern migration 025 comments call out. Matthew Henry keeps existing bio.

### Step 4 — Extend `commentaries` (plural)

Migration `supabase/migrations/047_commentaries_curation_columns.sql`.

```sql
-- FK to scholars. NULL-first so backfill can run, then tighten.
ALTER TABLE commentaries ADD COLUMN IF NOT EXISTS scholar_id UUID REFERENCES scholars(id);

-- Curation columns (Doctrine A).
ALTER TABLE commentaries ADD COLUMN IF NOT EXISTS featured         BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE commentaries ADD COLUMN IF NOT EXISTS featured_excerpt TEXT
  CONSTRAINT commentaries_featured_excerpt_chk CHECK (featured_excerpt IS NULL OR char_length(featured_excerpt) <= 400);
ALTER TABLE commentaries ADD COLUMN IF NOT EXISTS founder_curated  BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE commentaries ADD COLUMN IF NOT EXISTS author_type      TEXT NOT NULL DEFAULT 'sourced'
  CONSTRAINT commentaries_author_type_chk CHECK (author_type IN ('sourced','founder'));
ALTER TABLE commentaries ADD COLUMN IF NOT EXISTS status           TEXT NOT NULL DEFAULT 'published'
  CONSTRAINT commentaries_status_chk CHECK (status IN ('published','hidden'));
ALTER TABLE commentaries ADD COLUMN IF NOT EXISTS curator_note     TEXT;
ALTER TABLE commentaries ADD COLUMN IF NOT EXISTS curated_at       TIMESTAMPTZ;
ALTER TABLE commentaries ADD COLUMN IF NOT EXISTS curated_by       UUID REFERENCES auth.users(id);

-- Backfill scholar_id. All 1189 existing rows are Matthew Henry (verified).
UPDATE commentaries c
SET scholar_id = (SELECT id FROM scholars WHERE slug = 'matthew-henry')
WHERE c.scholar_id IS NULL AND c.author = 'Matthew Henry';

-- Tighten FK: required for future rows.
ALTER TABLE commentaries ALTER COLUMN scholar_id SET NOT NULL;

-- Indexes for verse-page query + curation filters.
-- Verse addressing uses (book_id, chapter, verse_start) — not verse_id.
CREATE INDEX IF NOT EXISTS idx_commentaries_verse_status
  ON commentaries (book_id, chapter, verse_start, status);
CREATE INDEX IF NOT EXISTS idx_commentaries_scholar
  ON commentaries (scholar_id);
CREATE INDEX IF NOT EXISTS idx_commentaries_featured
  ON commentaries (book_id, chapter, verse_start) WHERE featured = TRUE;
```

Two deliberate divergences from the original prompt:

1. **`author` text column stays.** Dropping it risks breaking existing code; leave for a future cleanup once `scholar_id` is proven out.
2. **`display_rank` per-row is NOT added.** Original prompt flagged this as a future enhancement; Step 9 reads rank from `scholars.default_rank` via join. If per-row override turns out to be needed in Batch 7 (Genesis curation), add in that batch's schema pass.

### Step 5 — `editorial_notes` + revisions

Migration `supabase/migrations/048_editorial_notes.sql`. **No changes from original prompt's SQL** except the filename prefix. Including the SQL here for completeness; the DDL is identical:

```sql
CREATE TABLE editorial_notes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  surface_type TEXT NOT NULL
    CONSTRAINT editorial_notes_surface_type_chk CHECK (surface_type IN ('node','route')),
  surface_id   TEXT NOT NULL,
  title        TEXT,
  body_md      TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  status       TEXT NOT NULL DEFAULT 'published'
    CONSTRAINT editorial_notes_status_chk CHECK (status IN ('published','draft','hidden')),
  created_by   UUID NOT NULL REFERENCES auth.users(id),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_editorial_notes_surface ON editorial_notes(surface_type, surface_id, status);
CREATE INDEX idx_editorial_notes_order   ON editorial_notes(surface_type, surface_id, display_order);

CREATE TABLE editorial_notes_revisions (
  id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id  UUID NOT NULL REFERENCES editorial_notes(id) ON DELETE CASCADE,
  title    TEXT,
  body_md  TEXT NOT NULL,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  saved_by UUID NOT NULL REFERENCES auth.users(id)
);

CREATE INDEX idx_editorial_notes_revisions_note ON editorial_notes_revisions(note_id, saved_at DESC);

-- RLS: public can read published notes; writes are service-role only (API routes enforce super-admin).
ALTER TABLE editorial_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY editorial_notes_public_read  ON editorial_notes  FOR SELECT USING (status = 'published');
CREATE POLICY editorial_notes_no_write     ON editorial_notes  USING (false);

ALTER TABLE editorial_notes_revisions ENABLE ROW LEVEL SECURITY;
CREATE POLICY editorial_notes_revisions_no_read  ON editorial_notes_revisions FOR SELECT USING (false);
CREATE POLICY editorial_notes_revisions_no_write ON editorial_notes_revisions USING (false);

CREATE OR REPLACE TRIGGER set_editorial_notes_updated_at
  BEFORE UPDATE ON editorial_notes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

Addition vs. original prompt: RLS enabled, consistent with the pattern on every other table in this project (search_log, trails, user_notes, etc.). Public read of `status='published'`; all writes routed through API routes that enforce super-admin + use service-role.

### Step 6 — TypeScript schema types

Repo currently has `src/lib/supabase.ts` as the client factory and no `src/lib/supabase/schemas/` directory. Create:

- `src/lib/supabase/schemas/scholars.ts` — `Scholar` type extended with `default_rank`, `is_founder`, `tradition_key`.
- `src/lib/supabase/schemas/commentaries.ts` — `Commentary` type including new curation columns + `scholar: Scholar` joined shape.
- `src/lib/supabase/schemas/editorial_notes.ts` — `EditorialNote`, `EditorialNoteRevision`, `SurfaceType`.
- `src/lib/citations/traditions.ts` already has `TraditionKey`. Re-export, don't redeclare.

If the repo uses generated `database.types.ts`, regenerate. Otherwise, hand-write — simpler for this batch.

### Step 7 — Server-side super-admin helper

`src/lib/auth/super-admin.ts`:

```ts
import { createServerClient } from "@/lib/supabase"; // confirm factory path

export async function requireSuperAdmin(): Promise<{ userId: string }> {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Response("Unauthorized", { status: 401 });

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (error || !profile?.is_admin) {
    throw new Response("Forbidden", { status: 403 });
  }
  return { userId: user.id };
}

export async function isSuperAdmin(): Promise<boolean> {
  try { await requireSuperAdmin(); return true; }
  catch { return false; }
}
```

Uses `profiles.is_admin` (confirmed `true` for Pastor Marc today). When migration 024 lands in a future batch, flip the query to `profiles.role` with a trivial one-line change.

### Steps 8–16

Mostly unchanged from the original prompt. Three substitutions:

- Everywhere the original prompt said "`commentary`" in SQL or the `<CommentarySection />` query, read "`commentaries`." Everywhere it said "`commentator_id`" read "`scholar_id`." Everywhere it said "`body`" (commentary body column) read "`commentary_text`."
- Verse queries use `(book_id, chapter, verse_start)` as the addressing tuple, not `verse_id`. `<CommentarySection />` receives `{ bookId, chapter, verseStart }` as props instead of `verseId`. Update the call site on verse pages accordingly.
- Drawer exclusion rule for verse pages: the repo's current verse route is `src/app/study/[book]/[chapter]/` (confirm `IsaiahMiniBibleClient.tsx` layout before wiring). The provider's `isExcluded(pathname)` check needs to match that pattern, plus the other exclusions unchanged.

## Open questions for Marcus

Answer these in chat before Cowork starts execution. Any ambiguity goes back into a blocker rather than an improvisation.

1. **Execution mode** — confirm: "Cowork runs DDLs via MCP, writes code to `_ark/batch-4-5-output/` scratchpad, you pull Windows-direct and merge yourself" — or do you want to fix the sandbox git first and let Cowork auto-merge as originally intended?
2. **Slug choice** — ok with `jfb`, `wesley`, `geneva`, `marc-mannafest` (matches repo) or prefer the longer `jamieson-fausset-brown`, `wesley-nt`, `geneva-bible`, `pastor-marc-mannafest` (matches original prompt)?
3. **Author text column** — keep `commentaries.author` TEXT alongside the new `scholar_id` FK (safer), or drop it once backfill is verified (cleaner, riskier)?
4. **RLS on editorial_notes** — ok with the public-read / no-direct-write policy I proposed, or do you want API writes to bypass via server-side service role explicitly rather than an `USING (false)` gate?
5. **STATUS.md Batch 3 entry** — do you want Cowork to append a placeholder line (no commit hash, flagged for you to backfill) or do you handle it entirely Windows-direct?

## Acceptance (amended where schema diverged)

Schema acceptance:

- [ ] `select count(*) from scholars where slug in (...15 slugs)` returns 15
- [ ] `select count(*) from commentaries where scholar_id is null` returns 0
- [ ] `select count(*) from editorial_notes` returns 0
- [ ] Migrations 045–048 visible in Supabase `migrations` table

Render acceptance (unchanged):

- Visit Gen 1:1. Featured excerpt = Henry's first 50 words, chip "Puritan", attribution "Matthew Henry."
- "Show other voices (N)" appears only if N > 0. For Gen 1:1 today (only Henry exists), N = 0 — the disclosure should NOT render. This is a deviation from the original acceptance ("disclosure appears if there are additional published entries") — the original wording is correct as stated; flagging because before Batch 6 ingests other commentators, no verse will have N > 0.
- Drawer tab renders on Isaiah Mini-Bible hub, muted/reduced opacity.
- Drawer tab does NOT render on `/`, `/graph`, `/admin/*`, verse pages.

Super-admin acceptance (unchanged in spirit):

- Sign in as Pastor Marc (profile id `9c6f1921-5fbf-4ab3-b204-1053002d9379`) — the auth check now reads `profiles.is_admin`, which is already `true`.
- Curate Gen 1:1, feature Henry with a 50-word excerpt, verify public render.
- Add a test editorial note on Isaiah Mini-Bible hub, verify card + revision behavior on edit + soft-delete.

Non-super-admin acceptance: unchanged.

Performance: unchanged (<300ms server-side).

## Out of scope (unchanged)

- Ingesting other PD commentators (Batch 6).
- Genesis curation pass (Batch 7).
- Isaiah + Kings retrofit (Batch 7.5).
- Migration 024 application (`profiles.role` column) — deferred; current auth against `is_admin` is sufficient.
- Dropping `commentaries.author` TEXT column — deferred; coexists with `scholar_id`.
- `verse_id` FK on `commentaries` — deferred to a dedicated hygiene batch.
- Reconciliation of the ~15 local-only migrations in `supabase/migrations/` that haven't been applied — separate hygiene pass; flag in BATCH_QUEUE parking lot.

## If this amendment itself hits a blocker

Same rule: write `_ark/batch-4-5-blocker-2.md`, halt, don't improvise. Specific pre-execution risks:

- `scholars.bio NOT NULL` — the 14 seed rows use `'[founder: write here]'`. If that string conflicts with some downstream validation, switch to a real short bio or make bio nullable in migration 045.
- `commentaries` has an existing unique or partial index that the new columns conflict with — MCP will report; halt and adapt.
- `set_updated_at` trigger function may not exist in production schema — verify before using in the `editorial_notes` migration. If absent, include its CREATE in migration 048 (pattern is standard: `CREATE FUNCTION set_updated_at() RETURNS trigger AS $$ BEGIN NEW.updated_at := now(); RETURN NEW; END; $$ LANGUAGE plpgsql;`).
- Running the migrations sequentially — each via MCP `apply_migration` — if 045 partial-fails halfway, use Supabase point-in-time recovery rather than hand-rollback.
