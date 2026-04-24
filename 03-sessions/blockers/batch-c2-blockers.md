# Batch C.2 — Feature Page Retrofit (14 pages) — HALTED on first instruction

**Date:** 2026-04-22
**Author:** Cowork (per OPERATING_RULES §6 — halt resolution stays in this file until Marcus rules)
**Status:** Halted before any code or schema work. Vault-only deliverables shipped (see "What was shipped anyway" below).
**Brief reference:** the in-chat Batch C.2 prompt dated 2026-04-21, "no approval gates, run end-to-end."

---

## Why this halt is the first action

The Batch C.2 prompt's own READ FIRST block instructs:

> If any of these files indicate a state that contradicts this prompt, stop and log the contradiction as the first entry in `_ark/batch-c2-blockers.md`. Do not override vision documents on your own authority.

After reading STATUS.md, OPERATING_RULES.md, BATCH_QUEUE.md, and `MannaFest_Vision_v2_Locked.md` in that order, multiple irreconcilable contradictions surfaced. Per the brief's own rule and per OPERATING_RULES §6 ("the resolution happens in Claude, not in Cowork… Don't let Cowork improvise its way past a halt"), I halted the implementation and wrote this file. Marcus's "no approval gates" framing in the brief was overridden by the brief itself naming a halt condition — the contradictions are exactly what that halt clause is for.

Because Marcus is away from keyboard, I did the safest, lowest-risk vault-only work that *does not preempt any unbuilt batch* (see the closing section). All code, all schema, and all commit work stay halted until Marcus rules.

---

## The contradictions, in priority order

### 1. Batch 3 (typography + Source Serif 4 + 66-book accent palette + 10 tradition-tag colors + `<Cite />` + 8-component diagram library) has NOT shipped — but Batch C.2 builds on it

**Brief assumption (Phase 1, "Common component library"):**
> "Build or verify these common components. Most exist already from Batch 3; verify and extend."
> Components named: `<FeaturedCommentaryCard />`, `<TraditionTagChip />`, `<Cite />`, `<GreekTermCard />`, `<HebrewNameCard />`, `<ComparisonCard />`, `<PredictionPair />`, `<TalmudQuoteCard />`, `<DepthOneCard />`, `<DepthTwoFramework />`, `<DepthThreeStub />`, `<HeroTagline />`, `<HeroSubtitle />`, `<ThreeStatStrip />`, `<RelatedPagesNote />`.

**Reality (verified via `ls src/components/`):**

- `src/components/common/` — does not exist.
- Of the 15 common components named, exactly **one** exists: `Cite.tsx` (located at `src/components/Cite.tsx`, not `common/`).
- The other 14 — `FeaturedCommentaryCard`, `TraditionTagChip`, `GreekTermCard`, `HebrewNameCard`, `ComparisonCard`, `PredictionPair`, `TalmudQuoteCard`, `DepthOneCard`, `DepthTwoFramework`, `DepthThreeStub`, `HeroTagline`, `HeroSubtitle`, `ThreeStatStrip`, `RelatedPagesNote` — are not present anywhere in the repo.
- BATCH_QUEUE.md, Wave 0, lists Batch 3 as "Site-wide serif (Source Serif 4), 66-book accent palette, 10 tradition-tag colors, `<Cite />` component, 8-component diagram library at `/components/diagrams`" with status: queued behind Doctrine B.
- `MannaFest_Vision_v2_Locked.md` §7.7 explicitly says: *"Both pages [Isaiah Mini-Bible, Kings of Israel and Judah] are retrofit targets after Batch 3 ships the typography + diagram library."*

**Why this matters:** Building 14 feature pages without the component library forces Cowork to either (a) invent the components inline (preempting Batch 3's locked scope), or (b) build the library as part of C.2 (silently absorbing two batches into one and locking in design choices Batch 3 was supposed to make deliberately).

### 2. Wave 1 commentary infrastructure (Batches 4–6) has NOT shipped — but `<FeaturedCommentaryCard />` per Doctrine A is named on every page

**Brief assumption (every page brief):**
- "Featured commentary excerpt per Doctrine A render spec, ≤50 words, attributed and tradition-tagged"
- `<FeaturedCommentaryCard />` rendered on every page

**Reality:**
- `commentary` table does not yet have the columns `display_rank`, `featured_excerpt`, `founder_curated`, `author_type`, `tradition_tag`, `curator_note`, `status` (Batch 4 in queue).
- `/admin/commentary` super-admin curation editor does not exist (Batch 5 in queue).
- Public-domain commentator ingestion is still Matthew Henry only — no Calvin, Spurgeon, Gill, Clarke, Barnes, JFB, Wesley NT, Geneva marginalia (Batch 6 in queue).
- BATCH_QUEUE: "Wave 1 — Commentary Infrastructure" entire wave is unshipped.

**Why this matters:** Every page brief features named voices on specific drilldowns (Owen on Hebrews 9:22, Spurgeon on bronze serpent, Hodge on the armor passage, Calvin on Gen 3:15). The data backing those FeaturedCommentaryCards isn't ingested. Render-time ≤50-word capping isn't implemented. There is no "Show other voices" expansion — that is Batch 5's UI deliverable.

### 3. Vision §7.7 says retrofits are *light* — Batch C.2 mandates structural rebuilds

**Vision v2 §7.7 (locked 2026-04-21):**
> "Both pages are retrofit targets after Batch 3 ships the typography + diagram library. The retrofits are **light** — confirm each depth is present and stylistically differentiated, polish depth 1 for invitation feel, make depth 2 framework sections explicit where they are currently implicit. **No structural rework.** The existing pages are exemplars; the retrofit is to make doctrine and exemplars agree."

**What Batch C.2 prompt does:** mandates full bespoke component builds (`VerticalPole`, `ScarletRibbon`, `TabernacleFloorPlan`, `LegionaryFigure`, `FruitTree`, `CovenantTimeline`, `DualGenealogyBanner`, `EdenNewJerusalemPanels`, `AsiaMinorMap`, `ManuscriptHero`, `PsalmLifeArcGrid`, `RevelationTimeline`, etc.), schema migration for `study_drilldown_content`, full content rewrites of pages that currently exist at 200–810 lines, etc.

This is structural rework, not light retrofit. If Vision §7.7's "light" is wrong, that needs to be amended in a dedicated session (OPERATING_RULES §7), not absorbed silently inside C.2. If Vision §7.7 is right, C.2's scope must be cut.

### 4. Eight of fourteen pages are outside the §7.8 locked Wave 2 roster

**Vision v2 §7.8 (locked) names exactly 8 Wave 2 feature pages:**

1. Taw as the Mark of God
2. Bronze Serpent Thread
3. Suffering Servant
4. Genealogies of Christ
5. Seed Promise
6. Types of Christ throughout Scripture
7. Mazzaroth
8. Trees (Eden → Cross → New Jerusalem)

**Batch C.2 names 14 pages. The intersection with §7.8 is six** (Bronze Serpent, Suffering Servant, Genealogies, Seed Promise, Typology of Christ, and arguably Scarlet Thread / Tabernacle as adjacent material).

**The eight pages in C.2 that are NOT in the §7.8 locked roster:**

1. The Covenants — not in §7.8, not in Wave 2 batch list, parking-lot at best
2. Scarlet Thread — promotes a retired trail; per BATCH_QUEUE the trail-to-feature migration is "Wave 2-or-later" follow-on, not pre-authorized
3. Tabernacle — already exists as a 702-line page; not in §7.8 (note: §7.8 says it is "an obvious next candidate once scheduled")
4. Creation to New Creation — not in §7.8 or the Wave 2 batch list
5. Messianic Psalms — already exists (810 lines); not in §7.8 or Wave 2 batch list (Wave 6+ parking lot)
6. Names of God — not in §7.8; Wave 6+ parking lot mentions "Strong's elevation to primary pillar (50 key Greek/Hebrew terms)"
7. Armor of God — not in §7.8; Wave 6+ parking lot
8. Fruit of the Spirit — not in §7.8; Wave 6+ parking lot
9. Seven Churches of Revelation — not in §7.8; Wave 6+ parking lot

(Mazzaroth and Trees, which §7.8 *does* lock for Wave 2, are absent from C.2.)

Adding eight pages to the Wave 2 roster — and dropping two locked ones — is a Vision amendment. OPERATING_RULES §7: "Amend only in a dedicated session. Never change a rule mid-batch."

### 5. Several pages C.2 calls "new" already exist on disk

| C.2 label | On-disk reality |
|---|---|
| `/study/covenants` — "new feature page" | Does not exist — actually new |
| `/study/typology-of-christ` — "new" | Does not exist — actually new |
| `/study/seed-promise` — "EXISTING" | ✓ Exists, 237 lines |
| `/study/scarlet-thread` — "retire trail, promote" | Does not exist on `/study/` (trail likely at `/trails/` — needs verification) |
| `/study/bronze-serpent` — "EXISTING" | ✓ Exists, 210 lines |
| `/study/suffering-servant` — "new feature page" | **Already exists, 375 lines.** Not new. |
| `/study/tabernacle` — "new feature page" | **Already exists, 702 lines.** Not new. |
| `/study/creation-to-new-creation` — "new" | Does not exist — actually new |
| `/study/messianic-psalms` — "new feature page" | **Already exists, 810 lines.** Not new. |
| `/study/genealogies-of-christ` — "new feature page" | **Already exists at `/study/genealogies/`, 230 lines.** The C.2 brief's slug `/study/genealogies-of-christ` does not match the existing slug `/study/genealogies`. Either rename (breaks inbound links + STATUS Fix 3 reference) or use existing slug. Pick one — Cowork won't pick. |
| `/study/names-of-god` — "new" | Does not exist — actually new |
| `/study/armor-of-god` — "new" | Does not exist — actually new |
| `/study/fruit-of-the-spirit` — "new" | Does not exist — actually new |
| `/study/seven-churches` — "new" | Does not exist — actually new |

The brief mislabels four existing pages as new. Treating them as new would either (a) overwrite shipped, founder-edited pages STATUS records as already touched (Fix 3 of D.FIX names seed-promise, tabernacle, suffering-servant, messianic-psalms, genealogies, bronze-serpent as sites where `[founder: write here]` was replaced 2026-04-21), or (b) leave the existing pages stranded while a parallel set ships at slightly different routes.

### 6. Marcus's project memory says "Evaluate Supabase MCP vs. scoped service-role key — decide deliberately, not mid-batch"

**Project custom instructions (this session):**
> "Evaluate Supabase MCP vs. scoped service-role key for Cowork data-layer work — decide deliberately, not mid-batch"

**Project memory (`project_mannafest_supabase_access.md`):** decision was made — scoped service-role key for personalization RPCs, MCP dev-only, anon+RLS for public reads. Decided Wave 12 per custom instruction.

**Batch C.2 brief authorizes:** "Schema changes in scope — adding `study_drilldown_content` table (or equivalent) is approved if needed. Any schema change beyond one new table requires a blocker log."

The brief's authorization is consistent with the locked decision (one new table is fine via the development MCP migration path), but the brief doesn't actually say *which* path. Cowork's interpretation: if a migration is genuinely needed, write the SQL file to `supabase/migrations/{timestamp}_{name}.sql` per the conventional pattern; do not invoke the MCP without explicit per-batch confirmation. The custom instruction's "decide deliberately, not mid-batch" weight is on Marcus's side, not Cowork's. Halt is the deliberate decision.

### 7. Mannafest_Vision §7.10 ELS depth-1 rule and Doctrine D.7 trail retirement need to thread into the C.2 work

**Vision §7.10 (locked 2026-04-21):** ELS feature pages have a special depth-1 rule. None of the 14 C.2 pages are ELS pages, but the existing `/study/bible-codes` page (touched in D.FIX Fix 5) is, and several C.2 pages cross-link to it.

**Doctrine D.7 (locked 2026-04-21):** Study Trails retired — migrated to Featured Pages. The Wave 2-or-later follow-on in BATCH_QUEUE specifies: "10 existing `study_trails` rows + 96 `trail_nodes` migrate to `/featured/*` routes with three-depth structure per §7. Redirects preserve `/study/*` inbound links."

The C.2 brief promotes Typology of Christ and Scarlet Thread as "retire trail, promote per Doctrine D.7" — but the brief targets `/study/typology-of-christ` and `/study/scarlet-thread`, while D.7 says the Featured Pages live at `/featured/*` with `/study/*` redirects preserved. Pick one routing convention. (The existing Bronze Serpent / Seed Promise / etc. pages are at `/study/*`, so the `/study/*` choice is more consistent with current state — but D.7's `/featured/*` is what shipped in the doctrine. Marcus rules.)

### 8. Brief assumes today's date is 2026-04-21; today is 2026-04-22

Minor but real. Every brief footer and the Phase 4 session record path (`session_c2_2026-04-21.md`) assume yesterday. Today is 2026-04-22 per `env`. The session record path is wrong as written. (Fixed in the vault-only work below — session record dated 2026-04-22.)

---

## What Marcus needs to rule on, in priority order

A → G are blockers. H is informational.

**A. Sequence vs. scope.** Three options:

1. **Park C.2.** Run Batch 3 (typography + diagram library) and Wave 1 (commentary infrastructure) first per the locked queue, then come back to C.2 with the actual component library and commentary backing in place. Lowest risk; highest fidelity to current vision and locked sequence.
2. **Run a scoped C.2 with stub backing.** Build the 14 pages but render `<FeaturedCommentaryCard />` from inline content (not the commentary table) and scaffold the component library inline. This lets the pages ship but creates two parallel implementations of every component when Batch 3 lands — Batch 3 then becomes a reconciliation refactor, not a build.
3. **Reshape C.2 around the Vision §7.8 roster.** Cut C.2 from 14 to the 6 pages already in §7.8's Wave 2 roster (Bronze Serpent, Suffering Servant, Genealogies, Seed Promise, Typology of Christ, Mazzaroth or Trees). Hold Covenants / Scarlet Thread / Tabernacle / Creation to New Creation / Messianic Psalms / Names of God / Armor of God / Fruit of the Spirit / Seven Churches for a Vision §7.8 amendment in a dedicated session.

**B. Vision §7.7 "light retrofit" rule.** Either C.2 IS light retrofit (no bespoke `VerticalPole` / `ScarletRibbon` / `TabernacleFloorPlan` / `LegionaryFigure` / `FruitTree` builds — just polish), or §7.7 is amended in a dedicated session to permit structural rework on retrofit. Pick.

**C. Existing pages.** For seed-promise (237 lines), bronze-serpent (210 lines), suffering-servant (375 lines), tabernacle (702 lines), messianic-psalms (810 lines), genealogies (230 lines): the brief's full-rewrite assumption discards founder edits documented in STATUS Fix 3 (D.FIX, 2026-04-21). Confirm: rewrite from brief, or extend existing in place?

**D. Slug conflict on genealogies.** Existing route is `/study/genealogies`; brief targets `/study/genealogies-of-christ`. Pick one. Note: STATUS Fix 3 explicitly references the existing `/study/genealogies` route — renaming breaks the decision-log reference.

**E. Routing convention for retired trails.** Doctrine D.7 says Featured Pages live at `/featured/*` with `/study/*` redirects. Brief targets `/study/typology-of-christ` and `/study/scarlet-thread` directly. Confirm: stay on `/study/*` (consistent with current pages) or migrate to `/featured/*` (consistent with D.7)?

**F. Wave 1 commentary backing.** Until Batches 4–6 ship, every `<FeaturedCommentaryCard />` on a C.2 page is rendering inline, not from `commentary.featured_excerpt`. When Wave 1 lands, every page needs a refactor pass to wire to the table. Acceptable as planned debt, or block C.2 on Wave 1?

**G. Eight pages outside §7.8 roster.** If Marcus wants to amend §7.8 to add the eight C.2-only pages (Covenants, Scarlet Thread as feature, Tabernacle as feature, Creation to New Creation, Messianic Psalms as feature, Names of God, Armor of God, Fruit of the Spirit, Seven Churches), the amendment session needs to land BEFORE the C.2 build — per OPERATING_RULES §7. Confirm path: amend then run, or hold those eight indefinitely?

**H (informational).** The 14 source briefs themselves are authoritative material Marcus has approved. They have been written to `_ark/source-briefs/{slug}.md` with `_index.md` already (vault-only, no preemption — see below). They are ready for Cowork to consume the moment A–G are resolved. No content work is wasted; only the implementation is paused.

---

## What was shipped anyway (vault-only, zero preemption)

Per OPERATING_RULES §6 (resolution stays in Claude, not Cowork) and §3 ("Founder is sole content author for revelation-note-style insight. Build the framework; don't author the founder's voice"), I avoided ALL of:

- ❌ Building any new common or diagram component
- ❌ Building or modifying any `/study/*` page
- ❌ Schema changes (no `study_drilldown_content` migration written)
- ❌ Any commits to MannaFest code repo
- ❌ Any Pastor Marc editorial content (the brief flagged "Pastor Marc editorial hook" sites repeatedly; those stay empty per Doctrine D.2's `<EditorialSlot />` pattern that already shipped in D.FIX Fix 3)

I DID ship the content-only, vault-only deliverables:

- ✓ `_ark/source-briefs/the-covenants.md`
- ✓ `_ark/source-briefs/typology-of-christ.md`
- ✓ `_ark/source-briefs/seed-promise.md`
- ✓ `_ark/source-briefs/scarlet-thread.md`
- ✓ `_ark/source-briefs/bronze-serpent.md`
- ✓ `_ark/source-briefs/suffering-servant.md`
- ✓ `_ark/source-briefs/tabernacle.md`
- ✓ `_ark/source-briefs/creation-to-new-creation.md`
- ✓ `_ark/source-briefs/messianic-psalms.md`
- ✓ `_ark/source-briefs/genealogies-of-christ.md`
- ✓ `_ark/source-briefs/names-of-god.md`
- ✓ `_ark/source-briefs/armor-of-god.md`
- ✓ `_ark/source-briefs/fruit-of-the-spirit.md`
- ✓ `_ark/source-briefs/seven-churches.md`
- ✓ `_ark/source-briefs/_index.md`
- ✓ This blocker file at `_ark/batch-c2-blockers.md`
- ✓ Session record at `_ark/03-sessions/session_c2_2026-04-22.md`
- ✓ STATUS.md decision log appended

These are pure markdown. They commit no code design choices, no schema choices, no routing choices. They preserve Marcus's authoritative approved briefs in the vault for the moment Marcus rules on A–G and the actual C.2 (or its replacement) executes.

The vault is not committed (no `git push` from this session — that requires Marcus's Windows machine per current convention, and OPERATING_RULES §1 forbids destructive ops without explicit prompt authorization). Files sit on the vault working tree.

---

## Why this is the right halt

The Batch C.2 prompt's tone ("end-to-end, no approval gates, run unattended") is real and Marcus's intent is clear: trust Cowork to execute. But the brief's own first instruction names exactly this case as a halt condition. OPERATING_RULES §6 reinforces: improvising past a halt is the failure mode, not stopping.

A 14-page bespoke-component build that silently absorbs Batch 3 and Wave 1, overwrites four already-shipped founder-edited pages, and adds 8 pages outside the locked Vision §7.8 roster is not a retrofit — it is a multi-batch sequence Marcus would not have approved as "no approval gates" if he'd had STATUS, BATCH_QUEUE, and Vision §7 in front of him while writing the brief.

The brief was approved 2026-04-21. STATUS Fix 3 (which touched four of the "new" pages with founder edits) also shipped 2026-04-21. The brief does not mention those founder edits. The most likely explanation is the brief was drafted before D.FIX landed and never reconciled. Marcus is the only person who can say.

Halt and log per the brief's own clause. Resume on Marcus's call.

— Cowork, 2026-04-22
