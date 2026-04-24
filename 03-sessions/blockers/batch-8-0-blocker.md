---
batch: batch-8-0-calvin-pilot
status: HALTED — Phase 2 acquisition blocked by network egress; pre-flight + Phase 1 archive complete
session: 2026-04-22 (Cowork)
halted_before: any commentaries INSERT for Calvin; any source text stored outside workspace
parent_prompt: (pasted into Cowork directly; no copy in _ark/04-prompts/batch_8_0_calvin_pilot.md — flagged per Ark sync gap)
prior_blocker: [[batch-8-blocker]]
---

# Batch 8.0 — Calvin pilot — Phase 2 BLOCKER

## Why this halted

All PD archives the amended prompt names as sources — and every fallback I tested — return `EGRESS_BLOCKED` through the WebFetch tool. My environment's `<web_content_restrictions>` policy explicitly forbids working around WebFetch failures with `bash curl`, `wget`, `python requests`, or any other HTTP client. There is no way to acquire Calvin's commentary text under the current tool access.

WebSearch **does** work — it confirms the content exists at the expected URLs — but WebSearch returns link summaries, not retrievable source text.

Halted before any `commentaries` row was inserted. The 059 migration file was archived to scratchpad (not actually re-applied — it was already live in production before this session started; see §Pre-flight findings #1).

## Domains tested, all blocked

Each returned `{"error_type":"EGRESS_BLOCKED","domain":"<host>"}`:

- `https://ccel.org/ccel/calvin/calcom01.toc.html` — CCEL primary (the prompt's §2.1 default)
- `https://www.ccel.org/ccel/calvin/calcom01.html` — CCEL alternate form
- `https://archive.org/details/commentariesonb01calv` — Internet Archive (the prompt's §2.3 secondary)
- `https://www.gutenberg.org/ebooks/search/?query=calvin+commentaries` — Project Gutenberg (the prompt's §2.3 tertiary)
- `https://biblehub.com/commentaries/calvin/genesis/1.htm` — Biblehub (mentioned in OPERATING_RULES §3 as PD-approved)
- `https://www.sacred-texts.com/chr/calvin/index.htm` — Sacred Texts Archive
- `https://www.reformation.org/calvin-genesis.html` — reformation.org (named in original Batch 8 prompt for Geneva)
- `https://en.wikisource.org/wiki/Commentary_on_the_Whole_Bible_Volume_I_(Henry)` — Wikisource (included as a wildcard)

WebSearch against Calvin's Genesis commentary returned 10 results spanning `archive.org`, `sacred-texts.com`, `ccel.org`, `btsfreeccm.org`, `christian.net` — confirming the content exists in PD form at the domains the prompt names, just none reachable via WebFetch in this environment.

## Pre-flight findings (safe to act on, no decision needed)

1. **Migration 059 is already live in production.** Supabase `migrations` table has version `20260423010104` = `059_scholars_attribution_columns`, applied 2026-04-23 01:01:04 UTC (before this Cowork session opened). All 9 scholars have `primary_work_title` + `primary_work_years` populated per the prompt's §Phase 1 SQL. Calvin specifically: `primary_work_title = 'Commentaries (Calvin Translation Society edition)'`, `primary_work_years = '1843–1855'`. The migration file does not exist in the code repo — the repo's `supabase/migrations/` ends at 058. Archive copy written this session to `_ark/batch-8-0-output/supabase/migrations/059_scholars_attribution_columns.sql`. Marcus' Windows-direct pull should commit this file so the repo matches production. No DB-side action needed — Phase 1 is a no-op.

2. **commentaries schema confirmed matches the amended prompt.** Body column = `commentary_text` (not `body`). `verse_reference` is populated like `"genesis-1"` (slug-chapter slug). Chapter-level rows use `verse_start=1, verse_end=NULL`. Henry's existing `source` = `'Complete Commentary'` (short abbreviation). Per the amended prompt's §Constraints instruction to "mirror Henry's format," Calvin's `source` should be `'Commentaries'` — **not** the verbose `'Commentaries (Calvin Translation Society edition, 1843-1855)'` string the prompt's §3.1 example SQL shows. The verbose citation lives in `scholars.primary_work_title` + `primary_work_years` now; duplicating it in every `commentaries.source` would violate the §Constraints mirror rule. This is a 1-line drift between §Constraints (authoritative) and §3.1 (example) — resolve by using the short form. I flag here rather than deciding mid-ingestion.

3. **Books table has no `slug` column.** Lookup happens via `books.id` (bigint) or `books.name`. Book ID mapping for verse_reference formatting will use `(SELECT id FROM books WHERE name = 'Genesis')`. Non-issue for INSERT, just worth noting.

4. **Sandbox git is broken (same pattern as Batches 4+5 / 6 / 7b.2).** `/sessions/zealous-wonderful-fermi/mnt/MannaFest/.git/index` does not exist; `git status` from the mount returns "not a git repository." This means no feature-branch creation, no commits, no pushes from Cowork. Scratchpad-to-`_ark/batch-8-0-output/` pattern required, Windows-direct pull by Marcus as per precedent. Prompt's "Branch persistence (do NOT push or merge)" section is moot — we can't push even if we wanted to.

5. **No Calvin (or other commentator) source staged locally.** `/sessions/zealous-wonderful-fermi/mnt/MannaFest/` has `matthew_henry.zip` + `mhc-data/*.HTM` (how Henry got ingested), but no `calvin-data/`, no `spurgeon-data/`, nothing comparable for the 8 commentators this wave covers.

## Proposed resolutions (Marcus picks one)

### Option A — Local staging (mirrors the Henry pattern)

Marcus stages Calvin's Commentaries PD text under `/MannaFest/calvin-data/` (or similar) the way he staged `mhc-data/`. Simplest source: download CCEL's plain-text ZIP bundle from ccel.org once on his Windows machine, unpack into the workspace folder. Cowork then iterates over local files, extracts per-chapter text, INSERTs. No egress needed. Proven to work for Henry.

Cost: Marcus does one CCEL-download-and-stage step per commentator. Eight commentators across Wave A = eight stage steps. Roughly an hour of one-time manual work up front, then each 8.x sub-batch runs without egress.

This is what I'd pick. It's the pattern already proven in the repo and sidesteps every egress-proxy issue for the whole wave.

### Option B — Egress whitelist

Marcus requests that `ccel.org`, `archive.org`, and `gutenberg.org` be whitelisted in his Cowork environment (if that's a user-level setting) or in whichever Anthropic/Cowork control panel governs it. Once whitelisted, Cowork's WebFetch can pull chapter-by-chapter from CCEL per the original Batch 8.0 §2.1 plan.

Cost: one config change + unknown complexity depending on whether network-egress whitelist is user-editable. Cowork then runs ~750 WebFetch calls for Calvin plus thousands more for subsequent 8.x commentators, with the fragility risks the original Batch 8 blocker already documented (CCEL rate-limit behavior, model-processed output, per-chapter URL enumeration).

### Option C — Different source, different format

Marcus supplies Calvin's text through a different channel: copy-paste into Claude Project knowledge, drop into the ark vault as `_ark/pd-sources/calvin-genesis.md`, whatever works. Functionally a variant of Option A but without the ZIP-unpack step.

### What I will NOT do

- Manually compose Calvin's commentary text from training knowledge. Would violate OPERATING_RULES §3 ("No AI-authored historical or theological claims. Every substantive claim traces to a cited source"). The prompt's §Constraints restates this verbatim. Halting is correct.
- Paraphrase, summarize, or "write in Calvin's style." Same reason.
- Use Bash/Python to bypass the egress proxy. My environment's `<web_content_restrictions>` policy forbids this categorically; WebFetch failure means halt, not workaround.
- Substitute Henry's text for Calvin's or pad rows with placeholders.

## What I did do this session (safe, auditable)

- Read STATUS.md, OPERATING_RULES.md, BATCH_QUEUE.md, session_batch-4-5, session_6, session_7b_2, batch-4-5-output/README.md, _ark/batch-8-blocker.md (prior halt).
- Queried production Supabase (read-only): commentaries schema, scholars schema, scholars roster filter, books table schema, Henry's `commentaries` sample for source-format mirror, migrations list.
- Confirmed migration 059 is already live and attribution is populated.
- Checked sandbox git state across `/MannaFest/` and `/MannaFest DEV/` mounts — both non-git.
- Tested WebFetch against 8 PD archive domains — all blocked.
- Confirmed via WebSearch that content exists but is unreachable in this environment.
- Searched the workspace for locally-staged Calvin text — none exists.
- Wrote the 059 migration archive file to `_ark/batch-8-0-output/supabase/migrations/059_scholars_attribution_columns.sql` with a prominent note that production was already migrated out-of-session.
- Wrote this blocker.

No INSERT into `commentaries`. No UPDATE of `scholars`. No DDL applied (migration 059 was already applied before this session). No branch created. No commits. No pushes.

## What Marcus' next move should be

Short path:

1. Pick A / B / C.
2. If A: stage `/MannaFest/calvin-data/` (CCEL plain-text ZIP works; it's how Henry got in), then ping Cowork to resume Batch 8.0 with §Phase 2 rewritten as "iterate over local files" instead of "WebFetch from CCEL."
3. If B: whitelist `ccel.org` + `archive.org` + `gutenberg.org`, then re-run the existing Batch 8.0 prompt as written.
4. If C: drop the text wherever, tell Cowork where to find it.

Either way: commit the 059 archive file (already written to scratchpad) during Wave A's eventual Windows-direct pull — that work isn't wasted regardless of which option Marcus picks for acquisition.

Finally: Marcus should also commit the amended Batch 8.0 prompt to `_ark/04-prompts/batch_8_0_calvin_pilot.md` once the resolution is locked. Current prompt location is Cowork-paste-only; prior session records expect a file there for `[[batch_8_0_calvin_pilot]]` wikilinks.

## Side notes (non-blockers, flag-only)

- **commentaries.source format drift between §Constraints and §3.1.** §Constraints says "mirror Henry's format" (Henry = `'Complete Commentary'`, short). §3.1 example SQL says `'Commentaries (Calvin Translation Society edition, 1843-1855)'` (verbose). Using the short form per §Constraints is correct; flagging so a future revision picks one.
- **Push/no-push clarity in the prompt.** §"Branch persistence" says "Cowork does NOT push to origin from this batch," but §5.4 blocker-class says "feature branch IS pushed during Phase 3 commits" and §"IF YOU HIT A BLOCKER" → "Vercel preview doesn't update with new commentary — verify the Phase 3 commits actually pushed to origin." Moot this session because sandbox git is broken anyway, but worth reconciling for the next 8.x sub-batch.
- **`_ark/04-prompts/batch_8_0_calvin_pilot.md` does not exist yet.** Sync gap — the prompt was pasted into Cowork directly rather than landed in prompts/ first. Same pattern as the prior Batch 8 halt noted.
