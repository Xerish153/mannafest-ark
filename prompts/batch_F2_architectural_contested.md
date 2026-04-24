---
batch: F2 — Wave F Architectural + Contested (4 feature pages)
owner: Cowork (Full Write mode)
branch: feat/batch-F1-typology-threads (Wave F branch; continues per addendum Item 1)
wave: F — Feature Pages (consolidated batch 2 of 3)
blocks_on: Batch F1 (shipped to feature branch; Wave F not yet pushed)
unblocks: Batch F3
addendum: [[batch_F2_addendum_01]]
status: Code-complete 2026-04-23 — see [[session_F2_2026-04-23]]
session: [[session_F2_2026-04-23]]
persisted_to_vault: 2026-04-23 (during F2 ark-sync step, per [[batch_F2_addendum_01]] Item 3)
---

# Batch F2 — Wave F Architectural + Contested (4 feature pages)

## READ FIRST

1. `STATUS.md`, `OPERATING_RULES.md`, `BATCH_QUEUE.md`.
2. `MannaFest_Vision_v2_Locked.md` — §7 (three-depth doctrine, especially §7.2 topic-responsive worked examples — Tabernacle floor plan and Trees three-tree arc are called out explicitly), §7.3 invitation rule, §7.9 opposing views, §7.10 ELS depth-1 invitation rule (applies to Trees' ELS subsection), §4.5 apologetics both-sides rule, §4.3 Editor's Notes drawer.
3. Source briefs:
   - `_ark/source-briefs/trees.md`
   - `_ark/source-briefs/tabernacle.md`
   - `_ark/source-briefs/mazzaroth.md`
   - `_ark/source-briefs/creation-to-new-creation.md` (canonical name per [[batch_F2_addendum_01]] Item 2; prompt originally referenced `creation-new-creation.md`)
4. Batch F1 shipped the shared primitives in `src/components/featured/primitives/`. This batch builds bespoke visuals per §7.2 and does NOT reuse the F1 primitives heavily.

## GOAL

Ship 4 Wave F feature pages with bespoke spatial visuals and heavy §7.9 opposing-view / founder-editorial-framing discipline. Interpretively heaviest of Wave F — Mazzaroth carries the most contested material on the site, Trees includes the ELS introduction per §7.10, and Tabernacle has the Project 314 Mercy Seat question to handle carefully.

Pages:

1. Trees (Eden → Cross → New Jerusalem) — `/featured/trees`, includes ELS introduction subsection
2. Tabernacle — `/featured/tabernacle`, top-down floor plan
3. Mazzaroth — `/featured/mazzaroth`, most interpretively contested page on the site
4. Creation to New Creation — `/featured/creation-to-new-creation`, Gen 1–2 / Rev 21–22 paired brackets

## SCOPE

Routes: `/featured/{slug}` + `/featured/{slug}/:drilldown` for all 4 pages. Drilldown counts: Trees 6 (including ELS intro), Tabernacle 9 (8 furniture elements + Hebrews 8–10 hub), Mazzaroth 15 (12 constellations + patristic reception + Bullinger/Seiss primary-source survey + critical-objections-and-responses), Creation to New Creation 7 (one per echo). Total 37 drilldowns.

Supabase tables: unchanged from F1 (schema established in migration 070). Use migration slot 073 (and next sequential) per [[batch_F2_addendum_01]] Item 4.

## COMPONENTS OWNED BY THIS BATCH

- `src/components/featured/trees/TreesArcHero.tsx` — three-tree arc (two Eden trees left, cross center, Rev tree of life right)
- `src/components/featured/trees/ELSIntroduction.tsx` — §7.10 subsection with three pinned ELS demonstration patterns
- `src/components/featured/tabernacle/TabernacleFloorPlan.tsx` — top-down SVG floor plan, 8 furniture clickable, scarlet curtain accent
- `src/components/featured/mazzaroth/MazzarothChart.tsx` — zodiacal wheel with 12 constellations + Bullinger/Seiss annotations (legend-labeled as not-site-endorsed)
- `src/components/featured/creation-to-new-creation/CreationBracketHero.tsx` — paired-bracket visual, Gen 1-2 left + Rev 21-22 right with 7 connecting arcs

Must reuse from F1: `<Cite />`, Doctrine A commentary components, `<EditorsNotesDrawer />` (auto-registered by pathname).

## WORK

(See prompt body in full — condensed in this vault copy; canonical source is the session's chat transcript + the source briefs.)

For every page: verify the source brief exists before starting. If any missing, halt and write blocker naming which.

**Page 1 — Trees.** Depth-1 three-tree arc. Depth-2 framework sections: Gen 2–3 two trees, cross as tree language, Rev 2:7 / 22:2 tree of life restored, tree-types encyclopedia, ELS introduction per §7.10. Depth-3 drilldowns: `tree-of-life`, `tree-of-knowledge` (with "did they die that day?" steelmanned), `the-cross-as-tree` (founder editorial primary), `tree-of-life-in-revelation`, `tree-types-encyclopedia`, `els-introduction` (full scholarly debate with Witztum-Rips-Rosenberg 1994 + McKay et al. 1999).

**Page 2 — Tabernacle.** Depth-1 top-down floor plan. Depth-2 framework sections: three zones, colors and materials, Hebrews 8–10 inspired commentary, **Project 314 / contested Mercy Seat interpretations** (per F2 prompt §4; brief was silent here — prompt wins per [[feedback_mannafest_brief_vs_prompt]]), cube continuity to New Jerusalem, Day of Atonement, pattern shown on the mountain. Depth-3 drilldowns: 8 furniture + `hebrews-8-10-inspired-commentary` hub.

**Page 3 — Mazzaroth.** Depth-1 zodiacal wheel starting at Virgo (Bullinger's sequence). Depth-2 framework sections: biblical references to heavens, Bullinger and Seiss as primary-source defenders, ancient Jewish constellation traditions, patristic reception (bifurcated), critical objections (load-bearing — Albumazar dependency per Faulkner 2015; astrology association; textual minimalism; hermeneutical retrojection; ancient-reader awareness), defenders' responses (without confessional stance). Depth-3 drilldowns: 12 constellations + `patristic-reception` + `bullinger-seiss-primary-sources` + `critical-objections-and-responses` (founder editorial primary).

**Page 4 — Creation to New Creation.** Depth-1 paired-bracket visual with 7 echoes. Depth-2 framework sections: Eden as sanctuary, set-apart-from/to grammar of holiness, progressive re-joining of heaven and earth, the seven Gen 1–2 / Rev 21–22 echoes, kainos grammar of renewal (with "no more sea" steelmanned). Depth-3 drilldowns: 7 echoes.

## DELIVERABLES

- Four feature pages live.
- Tabernacle top-down floor plan renders cleanly on desktop and mobile.
- Mazzaroth critical-objections section substantive at depth 2 (Albumazar dependency named).
- Trees ELS subsection renders three demonstration patterns with source captions per §7.10.
- 60+ featured_page_refs rows registered (actual: ~78).
- Ark sync artifacts complete.
- Push is Marcus's job — commit accumulates on the Wave F branch; F3 continues; push once F3 closes.

## ACCEPTANCE

(See session record [[session_F2_2026-04-23]] for the full click-through checklist.)

## OUT OF SCOPE

- Batch F3 pages (Names, Covenants, Messianic Psalms, Armor, Fruit, Seven Churches).
- Eschatology feature pages — parking lot.
- Any living-author content reproduction.
- Editor's Notes authoring — post-ship founder work.

## IF YOU HIT A BLOCKER

Write `_ark/batch-F2-blocker.md`, halt.
