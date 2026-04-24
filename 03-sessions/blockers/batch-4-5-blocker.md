---
batch: batch-4-5-commentary-editorial
status: HALTED — no migrations applied, no code files written
session: 2026-04-22 (Cowork)
author: Cowork (pre-flight diagnostic only)
---

# Batch 4 + 5 — Blocker

**Halt reason.** Pre-flight diagnostic found three independent blockers, any one of which would be sufficient to stop this batch. Combined, they require Marcus's direction before Cowork (or any tool) can proceed.

No migrations were applied to production. No code files were written to the repo. No commits, no merges, no vault mutations beyond this blocker record.

---

## 1. Git in the Cowork sandbox is broken — auto-merge is not possible from here

Inside the Cowork sandbox mount of `MannaFest`:

- `git status` reports `your current branch appears to be broken`
- `git log --oneline -15` returns `fatal: ... No commits yet`
- The working tree shows every file as untracked; no HEAD, no refs

This matches the known quirk in `STATUS.md` under "Cowork sandbox `.git/index` corruption." The documented fix is **Windows-direct** — `git reset --mixed HEAD` on the actual filesystem — not something Cowork can perform from inside the sandbox.

Consequence: the batch prompt's "Mode: Full Write. Auto-merge on lint + tsc + build green" cannot complete. Even if the code were produced correctly, the sandbox cannot push, merge, or deploy. The moment Cowork tries to stage or commit, it fails.

This blocker alone would warrant a halt.

---

## 2. STATUS.md vs. code-repo drift on Batch 3

`STATUS.md` and `BATCH_QUEUE.md` both state (as of 2026-04-22):

> **In flight:** Nothing. Ready for Batch 3.
> **Queue — Wave 0:** Batch 3 — Typography + Color + Citations + Diagram Library ← NEXT

But the code repo already contains every Batch 3 dependency this prompt's Step 1 asks Cowork to verify:

| Dep                                           | Repo state                                              |
| --------------------------------------------- | ------------------------------------------------------- |
| `src/components/Cite/Cite.tsx`                | present                                                 |
| `src/components/Cite/TraditionChip.tsx`       | present (via `src/components/Cite/` directory)          |
| `src/lib/citations/traditions.ts`             | present, exports `TraditionKey` + `TRADITIONS`          |
| `src/lib/citations/scholars.ts`               | present, 15 scholar entries incl. `marc-mannafest`      |
| `src/components/motion/FadeIn.tsx`            | present, plus `useInViewOnce.ts`                        |
| Source Serif 4 in `src/app/layout.tsx`        | present (`Source_Serif_4` imported line 2)              |
| 10 tradition CSS custom properties in `globals.css` | present (lines 73–82 + aliases 129–138)           |
| `/admin/diagram-preview` page                 | present                                                 |
| `/admin/motion-preview` page                  | present                                                 |
| `src/lib/traditionPalette.ts`                 | present                                                 |

So either Batch 3 shipped and the tracker wasn't updated, or Batch 3 is partially staged locally and hasn't been deployed. Step 1 of the Batch 4+5 prompt says "Halt if any are missing" — but the inverse case (they're present despite STATUS saying otherwise) is not covered, and it is the more alarming state because it suggests authoritative-source drift.

Resolution required from Marcus: **which is correct, STATUS.md or the code?** If Batch 3 shipped, STATUS + the decision log need the entry. If Batch 3 didn't ship, the code in the repo is local WIP that should not be built on top of until it lands on main and deploys.

---

## 3. Schema mismatch — the Batch 4 plan assumes tables that don't exist and misses tables that do

This is the largest blocker. The prompt's Steps 2–6 were written against assumed table + column names. Production (`ufrmssiqjtqfywthgpte` on supabase) tells a different story. Everything below is from live queries, not the repo.

### 3a. `commentators` vs `scholars`

| Plan assumes                                              | Production reality                                  |
| --------------------------------------------------------- | --------------------------------------------------- |
| Create new table `commentators` with 15 rows              | Table `commentators` does not exist                 |
| Pastor Marc — MannaFest is a commentator row              | `scholars` table has **32 rows**, including `marc-mannafest` |
| Tradition mapping lives on `commentators.default_tradition` | `scholars.tradition` column already exists (migration 025) |

The 32-row scholars table already holds all 15 of the commentator entries the prompt wants to seed, plus 17 more (Jewish-source scholars added by migration 007, authors expanded by 026). Creating `commentators` would split authority — same data in two places, different schemas, no link.

Doctrine C.1 ("Pastor Marc — MannaFest locked super-admin display name") is already satisfied via a `scholars` row with `slug='marc-mannafest'`. Migration 027 already links Matthew Henry's scholar row to commentary via `graph_nodes`/`graph_edges` typed `authored_by`.

### 3b. `commentary` vs `commentaries` — and the table's actual shape

The plan writes `ALTER TABLE commentary ADD COLUMN ...` throughout Step 4. The actual table is `commentaries` (plural), 1189 rows, with these columns:

```
id               uuid PK
verse_reference  text NOT NULL           -- e.g. "Gen.1.1"
book_id          bigint NULL             -- no FK to verses
chapter          integer NOT NULL
verse_start      integer NOT NULL
verse_end        integer NULL
author           text NOT NULL DEFAULT 'Matthew Henry'   -- plain text, NOT FK
source           text NOT NULL DEFAULT 'Complete Commentary'
commentary_text  text NOT NULL           -- NOT `body`, NOT `content`
created_at       timestamptz NULL
```

The plan's migration `2026_04_22_003_extend_commentary.sql` would fail on the first line (`ALTER TABLE commentary` — no such table) and its indexes reference columns that don't exist (`verse_id`, `status`). The "backfill Matthew Henry FK" step assumes there's a relational join with `commentators`; today it's a free-text `author` column.

Making the plan land correctly would require a larger schema rewrite than the prompt describes:

1. Add FK column `commentaries.scholar_id UUID REFERENCES scholars(id)`, backfill from `author` text (straightforward for Matthew Henry, trivial for the seeded set, brittle for any manual drift).
2. Add the curator columns (`featured`, `featured_excerpt`, `founder_curated`, `author_type`, `status`, `curator_note`, `curated_by`, `curated_at`, `display_rank`, `tradition_tag`).
3. Add a stable `verse_id` FK (currently verses are addressed as `verse_reference` string + `(book_id, chapter, verse_start)`) OR keep the current triple-key and adjust every index + query the prompt specifies.
4. Leave the `author` text column in place (or drop it in a later batch after app code has migrated).

### 3c. Super-admin — `profiles.is_admin` vs `user.user_metadata.role`

The plan's `requireSuperAdmin()` checks `user.user_metadata?.role === 'super_admin'` (Step 7). Production reality:

- `profiles.is_admin BOOLEAN NOT NULL DEFAULT false` exists today (from applied migration `011_add_profile_is_admin`).
- The locally-staged `024_super_admin_schema.sql` would add `profiles.role TEXT` with CHECK in `('user','super_admin')` — **but that migration is not applied to production** (not in the applied-migrations list).
- `auth.users.user_metadata` has no `role` key for Marcus's account (not verified, but it's never been set — documented as a known one-time setup in the prompt's own "IF YOU HIT A BLOCKER" section).

So the super-admin gate in the plan would 403 everyone, including Marcus, on day one. The correct production check is `profiles.is_admin = true` via a join from `auth.uid()`, until `024_super_admin_schema.sql` is applied; or it becomes `profiles.role = 'super_admin'` afterward.

### 3d. Migration numbering convention

The plan uses date-prefixed names: `2026_04_22_001_create_commentators.sql`. Production's applied migrations use Supabase-standard `YYYYMMDDHHmmss_NNN_name` (e.g. `20260418214340_025_authors_expand_scholars`). Dual conventions in the repo wouldn't fail, but they'd scramble ordering in Supabase dashboard + `list_migrations`. Existing prefixes go to `044`; continuing that sequence (`045`, `046`, `047`, `048`) is cleaner than introducing a new format.

### 3e. Local-only migrations that haven't been applied to production

From the production `list_migrations` vs. the repo's `supabase/migrations/`:

- **Applied in prod**: `004`–`011`, `016`–`020`, `025`–`027` (v2 + v3 of matthew_henry_authorship), `028`–`034`, `036`–`042`, `043`–`044`.
- **Local-only (not applied)**: `019_create_sacrifice_types`, `020_create_divine_names`, `021_create_book_collections`, `022_seed_expansion_types`, `023_account_features`, `023_enrich_node_schemas`, `024_seed_missing_nodes`, `024_super_admin_schema`, `025_search_fts`, `026_places_content_and_edges`, `027_greek_word_enrichment`, `029_enrich_ot_persons_edges` variants, `031_create_concepts`, `031_enrich_places_nt_plus_moriah`, `032_enrich_hebrew_word_nodes`, `032_seed_concepts`, `033_concept_edges`, `033_create_artifacts`, `034_concept_topic_cross_edges`, `035_trails_user_and_featured`.

Several numbered `023` and `024` and `031`/`032`/`033` collide — two files share the same prefix. Supabase resolves applied migrations by version string, not filename, so collisions don't corrupt applied state; but the local repo is confusing and some of those migrations look like they've been superseded without being pruned. This is a hygiene issue, not directly blocking Batch 4+5, but Marcus should decide whether to reconcile the local migrations directory before applying new DDL.

---

## What is safe to proceed with, once Marcus decides

Proposing three resolution paths. Marcus picks one (or amends); Cowork resumes under the amendment, per OPERATING_RULES §6 ("Don't let Cowork improvise its way past a halt").

### Path A — Rewrite the batch to match actual schema (recommended)

1. Drop the "create `commentators` table + seed 15 rows" steps. Use the existing `scholars` table; reference it by `scholar_id UUID` from `commentaries`.
2. Rewrite Step 4 against `commentaries` with real column names; plan for `verse_id` resolution separately.
3. Super-admin check becomes `profiles.is_admin = true` (or apply `024_super_admin_schema.sql` first, then use `profiles.role`).
4. Rename migrations to `045_..sql` → `048_..sql` to continue the established sequence.
5. Inspect the existing verse-page commentary render (grep showed `src/components/Cite.tsx`, `src/components/Cite/Cite.tsx`, and `VerseStudyTabs.tsx`) before rewiring; don't blindly replace.
6. Resolve the git sandbox issue before starting — otherwise auto-merge is impossible regardless.

Estimated scope reduction: -10 to -15 files (no `commentators` types, no redundant seed, no FK migration to a table that already exists). Estimated scope addition: +2 files (a clean `scholars` -> `commentaries` linking migration). Net: still ~45-65 files.

### Path B — Apply the staged local migrations first, then re-scope

1. Audit the 15-ish local-only migrations (Marcus + Claude), decide which are real and which are abandoned.
2. Apply the live ones to production via Windows-direct PowerShell (matches the pattern locked 2026-04-21).
3. Re-plan Batch 4+5 against the post-apply schema. `024_super_admin_schema.sql` in particular unlocks `profiles.role = 'super_admin'` which the plan's auth check was written for.
4. Fix the Cowork sandbox git state.
5. Resume.

This is the "get the tree healthy first" path. Higher upfront cost; removes a class of surprise.

### Path C — Ship schema-only today; editor + render in a follow-up

1. Land just the `editorial_notes` + `editorial_notes_revisions` tables (those don't touch existing tables and have zero pre-existing schema conflict).
2. Defer the `commentaries` rewrite and the whole Doctrine A render + super-admin editor to Batch 5 proper, once 4a has shipped.
3. Still requires the git sandbox fix before `apply_migration` pushes via Cowork MCP, OR Marcus applies the two new DDLs Windows-direct.

This keeps forward momentum, lands the cleanest slice, and buys time to resolve the scholars/commentaries entanglement deliberately.

---

## What Cowork verified in this session

Read-only, no side effects:

- `STATUS.md`, `OPERATING_RULES.md`, `BATCH_QUEUE.md` — current ark copies.
- `src/components/`, `src/lib/`, `src/app/admin/`, `src/app/api/`, `supabase/migrations/` — file listings only.
- Inspected repo contents of `024_super_admin_schema.sql`, `025_authors_expand_scholars.sql`, `027_matthew_henry_authorship.sql`.
- Supabase MCP: `list_projects`, `list_tables(public)`, `list_migrations`, one `execute_sql` against `information_schema.columns` for `commentaries`, `scholars`, `profiles`.
- No writes to Supabase, no DDL, no file mutations in the code repo, no git operations.

Per the Supabase-access memory (Wave 12 decision), MCP use here is dev-only / diagnostic — appropriate for pre-flight schema inspection. No runtime path touched.

---

## Next step

Marcus to pick a path (A / B / C / other) and either amend this batch prompt in Claude or draft a replacement. Cowork will not resume Batch 4+5 until (a) the sandbox git state is fixed, (b) STATUS.md and code are reconciled on Batch 3, and (c) the schema plan matches production table names + columns.
