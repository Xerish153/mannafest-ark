---
batch: F1 — Wave F Typology Threads (6 feature pages)
status: HALTED
halted_at: 2026-04-23
halted_by: Cowork (Full Write mode)
resolver: Claude (per OPERATING_RULES §6)
prompt: [[batch_F1_typology_threads]] (not yet persisted to `_ark/prompts/` — see §Ambient ambiguity)
---

# Batch F1 — HALT: primary source-brief blocker + three ambient concerns

Cowork read `STATUS.md`, `OPERATING_RULES.md`, `BATCH_QUEUE.md`, verified each source brief's existence, audited current route state and migration numbering, and inspected every relevant brief. **No branch was created, no files were edited, no Supabase writes were attempted, no vault commits beyond this blocker file.** Repo and ark state are otherwise unchanged from when the batch started.

Halting per the prompt's "IF YOU HIT A BLOCKER" clause and OPERATING_RULES §6. The Taw source brief is missing — an explicit blocker trigger in the prompt. I'm also flagging three ambient ambiguities so the resolver can fold them into the addendum rather than hitting them mid-batch.

---

## Blocker 1 — `_ark/source-briefs/taw.md` does not exist (primary halt)

**What I found**

- Prompt's `READ FIRST` §3 requires six source briefs:
  - `taw.md`  → **MISSING**
  - `bronze-serpent.md` → present (227 lines)
  - `suffering-servant.md` → present (270 lines)
  - `genealogies-of-christ.md` → present as `genealogies.md` (372 lines — renamed 2026-04-22 per decision log commit `1ac25f5`; naming divergence, not missing)
  - `seed-promise.md` → present (158 lines)
  - `scarlet-thread.md` → present (215 lines)
- STATUS.md (April 22) explicitly lists Taw as a deferred brief: *"Pending: Taw / Trees / Mazzaroth source briefs missing (deferred)."* That deferral was never resolved.
- Prompt's specific blocker-trigger list, first entry: *"Any of the 6 source briefs missing from `_ark/source-briefs/`."*
- Prompt's Page 1 spec for Taw references design decisions (paleo-Hebrew letterform dimensions, the four ray destinations, the §7.3 founder-editorial-slot framing of "the cross as final taw") that a brief would normally lock. Inventing those mid-batch would violate the OPERATING_RULES §3 rule against AI-authored theological claims, even for framing choices.

**What I propose**

Pick one:

- **A — Author the Taw brief, then resume.** Recommended. The prompt's Page 1 body has enough spec that the brief itself could be ~180 lines tracking the scarlet-thread brief's shape: page intent, hero/tagline, depth-1 visual spec (paleo-Hebrew taw + four rays), depth-2 framework section outline, depth-3 drilldown list, sourcing caveats (PD paleography only — Gesenius, BDB, Kelley's *Biblical Hebrew* in the public domain; Wilson's OT Word Studies; avoid Missler direct quotes beyond 50-word fair use). An hour of Claude authoring, then F1 resumes full-scope.
- **B — Drop Taw from F1 scope; ship the remaining five as Batch F1, rescope Taw into F1.5 or F2.** Clean scope boundary, but breaks the batch's front-loaded primitive pattern (Taw is the only page using `<RaysFromGlyph />`, so that primitive wouldn't ship this batch — fine, defers). Cost: F1 drops from 6 pages to 5, and the Wave F push discipline rolls up only five pages in batch 1 of 3.
- **C — Ship the five + a stub Taw page with "under construction" banner at `/featured/taw` so the Wave F push still carries all six routes, and deep-link from the homepage tile. I don't recommend this — Marcus has been consistent about not shipping stubs to production (batch 2.5 graph demotion proved the footer-link-only pattern is the only acceptable under-construction treatment, per memory `project_mannafest_graph_demotion.md`).

**Why I can't proceed without a resolution**

The prompt is categorical: "Any of the 6 source briefs missing … write `_ark/batch-F1-blocker.md` and halt. Do not guess." Authoring the brief myself would be a guess; so would shipping Taw with invented framing.

---

## Ambient ambiguity 1 — migration number 068 is taken

**What I found**

Prompt scope says *"migration `068_feature_page_infrastructure.sql` creates it."* Actual supabase/migrations state:

- `068_jesus_resurrection_appearances.sql` — already shipped
- `069_jesus_apostolic_figures.sql` — already shipped
- No `feature_pages` table anywhere in the migration tree (grepped; zero hits)

**My read:** Renumber to `070_feature_page_infrastructure.sql`. The prompt's "068" is a stale slot left over from when the batch was first drafted; the schema still needs to exist. Flagging rather than deciding unilaterally, since migration ordering is the kind of thing where "I'll just do the obvious thing" bites later.

**Proposed resolution:** "Use `070_feature_page_infrastructure.sql`" as a one-line amendment to the prompt. Zero blocker risk once confirmed.

---

## Ambient ambiguity 2 — four of the six pages already exist at `/study/{slug}`

**What I found**

`/study/bronze-serpent`, `/study/genealogies`, `/study/seed-promise`, `/study/suffering-servant` all have live `page.tsx` files. `/study/scarlet-thread` and `/study/taw` do not. Per the 2026-04-22 morning decision log: *"Feature pages ship at `/featured/{slug}` with `/study/{slug}` redirects."*

**Ambiguities:**

1. **Rebuild vs. migrate.** Does F1 treat `/study/*` as throwaway scaffolding and author fresh three-depth content at `/featured/*`, or does it lift-and-shift the existing `/study/*` page.tsx content, restructure to Doctrine B three-depth, and replace? The prompt says "build at `/featured/{slug}`" but is silent on whether the `/study/*` routes are ancestor work to mine or prior scaffolding to replace.
2. **Redirect mechanism.** Next 16 supports redirects in `next.config.ts` (`redirects()` async) and via middleware. The prompt doesn't specify. Consistent with R1 Production Repair's `/sign-in` → `/auth/signin` fix (next.config.ts `redirects()`), the `next.config.ts` route is cheaper.
3. **Slug naming divergence.** The existing `/study/genealogies` doesn't match the prompt's target `/featured/genealogies-of-christ`. If the redirect is auto-generated from `(existing-study-slug → same-slug-at-featured)`, the genealogies page needs an explicit slug-rename entry rather than a straight path swap.

**My read:** (1) lift-and-shift, then restructure — don't waste existing authored content; (2) `next.config.ts` `redirects()`; (3) `/study/genealogies` → `/featured/genealogies-of-christ` explicit rewrite, no same-slug assumption. Each of these is a ~5-minute decision that could take an hour to reverse if I guess wrong.

**Proposed resolution:** One-paragraph amendment covering all three.

---

## Ambient ambiguity 3 — Scarlet Thread depth-1 visual spec mismatch

**What I found**

- Prompt Page 6 depth-1 visual: *"Eight-thread vertical visual per source brief — each of the eight literal scarlet/crimson occurrences gets a clickable entry."*
- Source brief §Depth 1 — Invitation: *"Bento grid with the scarlet ribbon as the visual connector. Eight tiles arranged in approximate chronological flow. One featured tile (Yom Kippur / Yoma 39b) rendered larger, with distinct treatment."*

The brief is bento-grid-with-ribbon, not vertical. The brief is authored later than the prompt body and carries visual detail (scroll-reveal ribbon, Yom Kippur tile 2× size, gradient scarlet-to-white background, mobile stack-to-single-column behavior) that a "vertical visual" interpretation would throw away.

**My read:** Follow the source brief. Briefs are source-of-truth for page-level visual design (per the prompt's own instruction to "verify the source brief exists before starting"). The prompt body's "vertical visual" is either shorthand for "vertically-flowing eight-anchor visual" or an outdated draft. Either way the brief wins.

**Consequence for the shared-primitive plan:** `<RibbonTimeline />` no longer applies to Scarlet Thread (it applies cleanly to Seed Promise per the brief). Scarlet Thread gets its own `<ScarletRibbonBento />` page-level component — still built with Batch 3's diagram library primitives (SVG path for the ribbon, grid layout from Batch 3's layout utilities), but not a Wave F shared primitive. So the batch's shared-primitive count drops from 4 to 3 actual Wave-F shared primitives plus 1 Scarlet-specific bespoke component. No shared-primitive cost; just reclassification.

**Proposed resolution:** Confirm "follow source brief, build `<ScarletRibbonBento />` bespoke to Scarlet Thread." One-line amendment.

---

## Ambient ambiguity 4 (informational, not halting) — BATCH_QUEUE.md drift

`BATCH_QUEUE.md` still shows Batches 4+5 as "in flight" and lists Batches 8–11 in Wave 2 with the pairing (Taw+Bronze Serpent, Suffering Servant + Genealogies, Seed Promise + Types of Christ, Mazzaroth + Trees). The F1 prompt presents a different wave structure (Wave F, six pages per batch, three batches F1/F2/F3). Memory confirms batches have shipped through ~Wave 12, so BATCH_QUEUE.md is behind — the known "drift between Project STATUS.md and vault state" described in STATUS.md §Known quirks.

Not a blocker for F1 itself — the prompt is self-contained. Flagging so the resolver knows that once F1 ships, BATCH_QUEUE.md needs a pass that reconciles Wave 2 → Wave F restructuring alongside the §7.8 17-page roster. I can fold that into F1's ark sync if the resolver confirms scope, or it can be a short hygiene batch after F3.

---

## What I did before halting

Precisely this, and nothing else:

1. Read `STATUS.md`, `OPERATING_RULES.md`, `BATCH_QUEUE.md`.
2. Listed `_ark/source-briefs/` — noticed Taw missing.
3. Opened an existing blocker (`batch-R1-blocker.md`) to match the established format.
4. Audited `src/app/featured/` (empty), `src/app/study/` (4 of 6 slugs present), `supabase/migrations/` (069 is the latest; `feature_pages` table absent), confirmed Next 16.2.3.
5. Spot-checked `scarlet-thread.md` §Depth 1 to confirm bento-vs-vertical divergence.
6. Wrote this blocker.

No edits outside this file. No Supabase calls of any kind. No branches created.

---

## How to resume

Resolution addendum should cover:

1. **Taw brief** — option A / B / C above. A recommended.
2. **Migration number** — confirm renumber to 070. Zero-risk amendment.
3. **`/study/*` handling** — lift-and-shift vs. fresh, redirect mechanism, slug renames.
4. **Scarlet Thread depth-1** — confirm brief wins.
5. **Optional** — fold BATCH_QUEUE.md reconciliation into F1's ark sync or punt to a post-F3 hygiene batch.

Once addendum lands, F1 runs clean: one branch (`feat/batch-F1-typology-threads`), schema migration `070`, seed migration, three shared primitives (`ThreadTimeline`, `RibbonTimeline`, `DualTreeVisual`) + one per-page bespoke (`RaysFromGlyph`) + one Scarlet-specific bespoke (`ScarletRibbonBento`), six feature pages with ~30 drilldowns, 100+ `featured_page_refs` rows, Editor's Notes drawer on every eligible route, ark sync. Per prompt: Cowork commits to the feature branch; Marcus pushes Wave F as a single push after F1+F2+F3.

Estimated time-to-green once addendum lands: two or three long-prompt Cowork sessions for F1 alone (6 pages × 3 depths × ~5 drilldowns is a lot of content, even with shared primitives).

## WikiLinks

- [[batch_F1_typology_threads]] — governing batch prompt (not yet persisted to `_ark/prompts/`; if the resolution keeps the prompt authoritative, drop it into the vault during the amendment so subsequent sessions have a stable link target)
- [[STATUS]]
- [[OPERATING_RULES]]
- [[BATCH_QUEUE]]
- [[source-briefs/bronze-serpent]] · [[source-briefs/suffering-servant]] · [[source-briefs/genealogies]] · [[source-briefs/seed-promise]] · [[source-briefs/scarlet-thread]]
- [[batch-R1-blocker]] — format precedent
