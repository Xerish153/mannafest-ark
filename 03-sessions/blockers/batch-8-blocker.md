---
batch: batch-8-pd-commentator-ingestion
status: HALTED — blockers documented, no DB or repo writes performed
session: 2026-04-22 (Cowork)
halted_before: migration 059 write, any commentaries INSERT, any PD source fetch, any git branch creation
resolution_path: Marcus amends in Claude per OPERATING_RULES §6, then re-runs
parent_prompt: (pasted into Cowork directly; no copy in _ark/04-prompts/)
---

# Batch 8 — PD Commentator Ingestion — BLOCKER

## Why this halted

The batch prompt names itself "Batch 8 — PD Commentator Ingestion Mega-Batch." Two classes of blocker surfaced during entry-audit, either one sufficient to halt per OPERATING_RULES §3 and the prompt's own `IF YOU HIT A BLOCKER` protocol:

1. **Schema mismatch.** Several column names the prompt prescribes do not exist on the production `commentaries` or `scholars` tables. Writing migration 059 against the prompt's spec — or INSERTing rows with the prompt's column list — would either fail at DDL or silently omit attribution data in a way that violates OPERATING_RULES §3 ("Commentary always attributed. Tradition of origin visible").
2. **Batch-queue drift.** The prompt claims "Batch 8, Wave A, Batch 1 of 2, runs before Batch 9." Neither `BATCH_QUEUE.md` nor `STATUS.md` reflects this; the queue still lists Batch 8 as "Cross-typology pair: Taw + Bronze Serpent" and Batch 6 as "Public-domain commentator ingestion expansion" (which was then quietly repacked into the shipped Batch 6 Verse Surface Completion). Which batch label we're actually ingesting under, and what number the migration takes, need a deliberate decision before any write.

No destructive action has been taken. No migration applied. No branch created. No WebFetch to CCEL or any PD archive. No rows inserted. This file is the only write.

---

## Verified-safe context (what I read before halting)

Read, in order: `STATUS.md`, `OPERATING_RULES.md`, `BATCH_QUEUE.md`, `_ark/03-sessions/session_batch-4-5_2026-04-22.md`, `_ark/03-sessions/session_6_2026-04-22.md`, `_ark/03-sessions/session_7b_2_2026-04-22.md`, `_ark/batch-4-5-output/README.md`. Queried production Supabase (project `ufrmssiqjtqfywthgpte`): `information_schema.columns` for `scholars` + `commentaries`, `scholars` filtered to the PD commentator roster, `commentaries` row counts grouped by scholar, and the full `migrations` table.

Findings that shape the blockers:

- **Latest applied migration is `058_jesus_title_refs` (2026-04-22).** `059` is the next free numeric slot, which matches the prompt's target.
- **Migration `046_scholars_seed_commentators` already shipped (Batch 4+5, 2026-04-22).** It added 14 PD commentators + Pastor Marc with distinct slugs (`calvin`, `spurgeon`, `gill`, `clarke`, `barnes`, `jfb`, `wesley`, `geneva`, `owen`, `chrysostom`, `augustine`, `bullinger`, `seiss`, `marc-mannafest`) and tradition/rank already populated. Every commentator the prompt names as a Phase 1 INSERT target already exists. The prompt's Phase 1 is a no-op in its current form; its actual blocker is pre-existing author-profile rows with duplicate names but different slugs (see §Non-blocker below).
- **Only Matthew Henry has any commentary rows (1,189).** Every other scholar row has 0 commentaries. So the ingestion work itself is genuinely needed — just not Phase 1's scholar roster work.

---

## Blocker #1 — Schema mismatch between prompt and production

The prompt specifies `commentaries` as having columns `body`, `tradition`, `source_work`, `source_edition_year`, `display_rank` (row-level). Live schema:

| Prompt says column name | Actual column | Notes |
|---|---|---|
| `body` | `commentary_text` | body column is already populated for 1,189 Matthew Henry rows under this name |
| `tradition` | *(does not exist on commentaries)* | Lives on `scholars.tradition` + `scholars.tradition_key`. Render-time joins, not row-level duplication. |
| `source_work` | *(does not exist)* | Closest is freetext `commentaries.source` (NOT NULL) |
| `source_edition_year` | *(does not exist)* | Not modeled |
| `display_rank` (row) | *(does not exist)* | `scholars.default_rank` is the per-scholar fallback. Doctrine A curation uses `featured` / `featured_excerpt` / `founder_curated` — see §3 below. |

Additional shipped columns the prompt doesn't mention but any INSERT must satisfy: `verse_reference` (text, NOT NULL), `author` (text, NOT NULL — freetext attribution), `source` (text, NOT NULL — freetext source), `featured` (bool, NOT NULL), `founder_curated` (bool, NOT NULL), `author_type` (text, NOT NULL, CHECK in 'sourced'/'founder'), `status` (text, NOT NULL, CHECK in 'published'/'hidden'). `featured_excerpt` has a CHECK ≤400 chars per Doctrine A.

**Consequence:** Running migration 059 against the prompt's Phase 1 spec would either fail at DDL (columns don't exist to UPDATE) or — worse — the prompt's step 3.x INSERTs would fail on unknown column names. Even after column-name substitution, `source_work` / `source_edition_year` have nowhere to land.

**Proposed resolution:** The prompt's "per-row source_work + source_edition_year" requirement needs to either (a) live in `source` as a freetext citation like `"Commentaries (Calvin Translation Society, 1843–1855)"`, or (b) be added to `scholars` once since every row from one scholar uses the same primary work (Calvin → Commentaries 1843–1855; Spurgeon → Treasury of David 1870–1885; etc.). Option (b) is cleaner, requires one additive migration adding `scholars.primary_work_title TEXT` + `scholars.primary_work_years TEXT`, and matches how `scholars.tradition` already denormalizes once rather than per-row. Either way, Marcus chooses before any ingestion SQL runs.

## Blocker #2 — Batch-queue drift

- `BATCH_QUEUE.md` (current): **Batch 6** = Public-domain commentator ingestion expansion (the work this prompt wants to do); **Batch 8** = Cross-typology pair (Taw + Bronze Serpent).
- `session_6_2026-04-22.md` (shipped): Batch 6 = Verse Surface Completion (VOTD + featured-studies + interlinear + graph flag). **Commentator ingestion was quietly dropped from Batch 6.**
- The prompt pasted into Cowork: calls itself "Batch 8 — PD Commentator Ingestion, Wave A Batch 1 of 2, runs before Batch 9 (Jesus cluster content)".
- There is no prompt file at `_ark/04-prompts/batch_8_*.md`. Only `batch_7b_2_titles_finisher.md` sits there.

Three things are now unclear without Marcus' call:

1. Is this the real Batch 8 (queue repacked, Taw+Bronze Serpent pushed out)? Or is it the deferred Batch 6 work under a new label?
2. What does Wave 2 (Batch 8 Taw+Bronze Serpent, Batch 9 Suffering Servant+Genealogies per the queue) become if this absorbs the Batch 8 slot?
3. What's the Batch 9 the prompt references as "next in Wave A"? The queue's Batch 9 is Gospel-fulfillment feature pages — the prompt's references to "Jesus cluster content" better match Wave 4 Batch 21 ("Jesus Cluster first pass").

**Proposed resolution:** Marcus either (a) updates BATCH_QUEUE.md + STATUS.md to reflect a queue repack and commits the batch-8 prompt file to `_ark/04-prompts/` under the new label before re-running, or (b) relabels this ingestion as Batch 6.5 / Batch 5.9 / etc., keeping the Wave 2 feature-page batches in their original Batch 8/9 slots. Either is fine mechanically; both require the decision to be made explicitly, not mid-run.

## Blocker #3 — Scale realism

Prompt targets ~6,100 new `commentaries` rows across 8 commentators, 200–500 words per chapter-row, with an explicit rule that every row's body is PD source text fetched from CCEL / Project Gutenberg / archive.org / genevabible.org — **not AI-generated, not paraphrased, not summarized.**

At 200–500 words per row × 6,100 rows, that's 1.2M–3M words of source text to acquire, OCR-clean, and INSERT. Acquisition bottlenecks:

- CCEL ingestion at the chapter level requires enumeration (which books for each author have URL coverage) and per-chapter fetch. For Calvin's Commentaries alone that's ~750 chapter pages. Times 8 commentators ≈ 5,000+ WebFetch calls if each chapter is one page; that's optimistic because some commentators are laid out per-verse.
- WebFetch returns model-processed content, not raw HTML — fine for extracting a chapter's commentary prose but not deterministic across retries, and fragile on pages that embed commentary across multiple `<div>`s.
- CCEL rate-limit behavior is not documented. Hammering it with thousands of requests inside one session risks throttling that looks like partial-coverage rather than a fail-fast error.
- The prompt's per-commentator-commit pattern helps with recovery but does not reduce the upstream acquisition cost.

Realistically, this is a **multi-session** effort even at full tilt, not a single Cowork batch. The prompt acknowledges the risk ("Batch size stresses Cowork sandbox — legitimate risk") but still asks for one branch, one batch, one merge.

**Proposed resolution:** Split into pilot + per-commentator waves.

- **Batch 8.0 (pilot, this session or next):** Calvin only — acquire + ingest + verify. Single-commentator end-to-end pass validates the schema-corrected migration, the CCEL fetch/parse shape, the attribution format in the `source` column, and the Doctrine A multi-voice render with at least two voices (Henry + Calvin).
- **Batch 8.1 … 8.7:** one commentator per batch, each its own branch + merge. Spurgeon (Psalms only, smallest) is the natural second pilot; Gill / Clarke / JFB (complete-Bible, largest) get their own slots; Barnes / Wesley NT / Geneva marginalia finish.
- **Batch 8.8 (verification):** coverage query + sparse-chapter audit + Doctrine A render click-through. Matches prompt's Phase 4 + Phase 5 but runs once, after all ingestion waves.

This preserves the prompt's acceptance goal (≥95% of chapters have ≥3 distinct voices) while making each individual Cowork run finish.

## Non-blocker noted — Scholar-row duplicates

The `scholars` table has two rows with name `John Calvin`, two with `Charles Spurgeon`, two with `John Owen`, two with `Augustine of Hippo`, two with `John Chrysostom`, and a `John Wesley` + `John Wesley (NT Notes)` pair. This initially looked like roster pollution. It isn't: the older rows (created 2026-04-15 and 2026-04-18) have `is_author_profile=true` and are used by the Voices page for author-profile rendering; migration 046's rows (created 2026-04-22) have `is_author_profile=false` and are the commentator-source rows. They use different slugs (`john-calvin` vs `calvin`; `charles-spurgeon` vs `spurgeon`; etc.) so INSERTs by slug are unambiguous. Matthew Henry is the exception — one row only, `is_author_profile=true`, slug `matthew-henry`, `default_rank=300`, already linked to all 1,189 commentary rows. No action needed.

## What I did NOT do

- Did not create `feat/batch-8-commentator-ingestion` branch.
- Did not write or apply migration 059.
- Did not INSERT any rows into `commentaries`.
- Did not fetch any PD text from CCEL, archive.org, Gutenberg, or elsewhere.
- Did not modify any repo file.
- Did not update `STATUS.md` or `BATCH_QUEUE.md`.

Only write in this session is this blocker file at `_ark/batch-8-blocker.md`.

## What I propose for Marcus' next move

Short path:

1. Decide the batch label (queue repack vs. rename as Batch 6.5). Update `BATCH_QUEUE.md` + `STATUS.md` in one small edit.
2. Decide the source-attribution model: `source` freetext (cheapest) vs. adding `scholars.primary_work_title` + `scholars.primary_work_years` (cleaner denormalization).
3. Commit a corrected prompt to `_ark/04-prompts/batch_{label}_commentator_ingestion.md` that:
   - Uses `commentary_text` not `body`.
   - Drops row-level `tradition` / `source_work` / `source_edition_year` / `display_rank`.
   - Relies on joins against `scholars` for tradition/rank/attribution.
   - Scopes this first run to Calvin only (pilot), with explicit per-commentator batch splits named for the follow-ups.
4. Hand back.

I can draft the corrected prompt myself if that's cheaper than you writing it — say the word.
