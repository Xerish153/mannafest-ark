---
batch: F1 — Wave F Typology Threads (6 feature pages)
owner: Cowork (Full Write mode)
branch: feat/batch-F1-typology-threads
wave: F — Feature Pages (consolidated batch 1 of 3)
blocks_on: Batch 11 Torah, Batch 10 Pauline, Batch 3 typography + diagram library (all shipped)
unblocks: Batches F2, F3
addendum: [[F1_addendum_01]]
persisted_to_vault: 2026-04-23 (during blocker resolution)
status: Code-complete 2026-04-23 — see [[session_F1_2026-04-23]]. Awaiting Marcus Windows-direct push + merge. Wave F push is single-push; accumulate F1 + F2 + F3 before pushing.
session: [[session_F1_2026-04-23]]
---

# Batch F1 — Wave F Typology Threads (6 feature pages)

## READ FIRST

1. `STATUS.md`, `OPERATING_RULES.md`, `BATCH_QUEUE.md`.
2. `MannaFest_Vision_v2_Locked.md` — §7 (three-depth feature page doctrine; especially §7.3 invitation rule), §4.2–§4.4 (Doctrine A commentary render), §4.3 (Editor's Notes drawer), §7.9 (opposing views in framework + founder editorial framing), §4.5 (apologetics both-sides rule).
3. Source briefs (verify each exists before starting that page):
   - `_ark/source-briefs/taw.md`
   - `_ark/source-briefs/bronze-serpent.md`
   - `_ark/source-briefs/suffering-servant.md`
   - `_ark/source-briefs/genealogies-of-christ.md`
   - `_ark/source-briefs/seed-promise.md`
   - `_ark/source-briefs/scarlet-thread.md`
4. Isaiah Mini-Bible (`/isaiah-mini-bible`) and Kings of Israel and Judah (`/kings-of-israel-and-judah`) in production — quality bar for every page in this batch.

## CONSTRAINTS (verbatim from OPERATING_RULES §3)

- Single audience: the student of the Bible who wants to learn. Judge every feature against "does this deepen a serious student's study?"
- Open-source data only. No licensed content. The Wesley Huff scholarship quality bar applies.
- Guzik's Enduring Word is NOT CC-BY. Do not ingest Enduring Word content. Public-domain commentators only: Calvin, Matthew Henry, Spurgeon (Treasury of David for Psalms), Gill, Clarke, Barnes, Jamieson/Fausset/Brown, Wesley NT notes, Geneva Bible marginal notes, Owen, Chrysostom, Augustine, Bullinger, Seiss.
- Living authors (Missler, Brewer, Huff) — cite only, never reproduce text.
- No AI-authored historical or theological claims. AI synthesizes cited human sources only. Every substantive claim traces to a cited source.
- Commentary is curated, not exhaustive. Featured excerpt ≤50 words, attributed, tradition-tagged. "Show other voices" expansion reveals the rest. Founder-authored notes styled identically to sourced voices with "Editor" tradition tag.
- Commentary always attributed. Tradition of origin visible (Reformed / Patristic / Jewish / Evangelical / Puritan / Anglican / Charismatic / Academic / Editor). Traditions never flattened.
- Debated content gets a page-level notice, not confidence badges. No "high / medium / speculative" labels.
- 2D graph only. Graph is exploratory, not a pillar — accessed via footer link with under-construction banner. Do not build toward the graph until the content density justifies revival.
- Every node ships with ≥3 outgoing edges. Nodes with fewer stay in `draft` status.
- Full-density pages. No Beginner/Study/Deep gating. Density managed by tabs, accordions, and collapsibles — not by omission.
- Singular routes per `routes.md`.
- KJV / WEB / ASV translations only. No licensed translations.
- No audio of any kind. No pastor workspace. No audience-specific pages. No premium tier. No community editing.
- Founder is sole content author for revelation-note-style insight. Build the framework; don't author the founder's voice.
- "Shipped" means a production click-through of every affected link returns 200. Not "deploy succeeded."

## GOAL

Ship 6 Wave F feature pages at Doctrine B's three-depth structure (§7), all sharing the "typology thread traced across the canon" shape. This batch front-loads the shared primitives (thread/ribbon/tree visuals) that Batches F2 and F3 will reuse.

Pages:

1. Taw as the Mark of God — `/featured/taw`
2. Bronze Serpent Thread — `/featured/bronze-serpent`
3. Suffering Servant — `/featured/suffering-servant`
4. Genealogies of Christ — `/featured/genealogies-of-christ`
5. Seed Promise — `/featured/seed-promise`
6. Scarlet Thread — `/featured/scarlet-thread`

## SCOPE

Routes: `/featured/{slug}` + `/featured/{slug}/:drilldown` for each of the six pages. Expected drilldown counts: Taw 4, Bronze Serpent 4, Suffering Servant 5, Genealogies 5, Seed Promise 4, Scarlet Thread 8. Roughly 30 drilldown pages.

Supabase tables:

- `feature_pages`, `feature_page_sections`, `feature_page_drilldowns`, `featured_page_refs`, `editorial_notes`.
- If the `feature_pages` family doesn't exist, migration `070_feature_page_infrastructure.sql` (renumbered from 068 per [[F1_addendum_01]] Item 2) creates it:
  - `feature_pages`: id, slug (unique), title, subtitle, hero_visual_component, status, timestamps
  - `feature_page_sections`: id, feature_page_id (fk), ordinal, title, body_markdown, layout_variant, timestamps
  - `feature_page_drilldowns`: id, feature_page_id (fk), slug (unique within parent), title, body_markdown, ordinal, timestamps
- If it exists from prior work, inspect shape and adapt inserts. Do not alter existing columns.

Components owned by this batch:

- Shared primitives (built once, reused across all 6 pages):
  - `src/components/featured/primitives/ThreadTimeline.tsx` — vertical thread with clickable nodes
  - `src/components/featured/primitives/RibbonTimeline.tsx` — horizontal ribbon with inflection points
  - `src/components/featured/primitives/DualTreeVisual.tsx` — two branching trees from shared root
  - `src/components/featured/primitives/RaysFromGlyph.tsx` — central SVG glyph with connection rays to cards
- Per-page depth-1 + depth-2 components under `src/components/featured/{slug}/`.

Must reuse (do not rebuild):

- `<Cite />` citation (Batch 3)
- Diagram library primitives (Batch 3)
- `<FeaturedExcerpt />`, `<CommentarySection />`, `<CommentaryCard />` (Doctrine A — Batch 4+5 + 8.5)
- `<EditorsNotesDrawer />` on every eligible route (Doctrine C §4.3.4)
- `<FeaturedStudiesOnVerse />` — register into it, do not modify (slug-dedupe fix is Batch 23 Hygiene)

## WORK

### Preamble — shared primitives first

Before writing any feature page, scaffold the four shared primitives in `src/components/featured/primitives/`. Each primitive takes typed props (no string-based configuration), supports a `variant` prop for per-page styling differences, and renders responsively from desktop to mobile per the Batch 3 layout conventions. Unit-test each primitive with `node --experimental-strip-types --test` against a mock props set before wiring into any feature page. This front-loads the component work and ensures all six pages compose from tested building blocks.

### Per-page specs

For every page: verify the source brief exists before starting. If missing, write `_ark/batch-F1-blocker.md` naming which page(s) lack briefs and halt. Do not invent content.

#### Page 1 — Taw as the Mark of God

- Route: `/featured/taw`
- Depth 1 visual: Paleo-Hebrew taw letterform (cross-shaped) rendered large via `<RaysFromGlyph />`. Four rays to clickable cards: Ezekiel 9:4 / Passover blood / Revelation sealing / the cross. No verse text at depth 1.
- Depth 2 framework sections:
  1. Origin of taw in paleo-Hebrew (cross-shaped letterform, source: PD Hebrew paleography)
  2. Ezekiel 9 seal in historical context (Babylonian siege, remnant identification)
  3. Passover blood-on-doorposts as typological anchor (Ex 12 + Heb 11:28)
  4. Revelation 7:3 and 14:1 sealing as eschatological fulfillment
  5. The cross as final taw — surface as interpretive possibility with founder editorial slot (John 19:30 "it is finished" + the taw-shaped crucifix symbolism)
- Depth 3 drilldowns: `ezekiel-9-seal`, `passover-blood`, `revelation-sealing`, `the-cross-as-taw`. Each carries full verse text, Doctrine A commentary (featured excerpt + "Show other voices"), cross-references, Editor's Notes drawer.
- Sourcing caveats: PD paleography only. Any claim about the paleo-Hebrew letterform's shape cites a PD source.

#### Page 2 — Bronze Serpent Thread

- Route: `/featured/bronze-serpent`
- Depth 1 visual: `<ThreadTimeline />` — vertical thread from Num 21 (top) through John 3:14–15 (middle) to atonement nodes (bottom: Rom 5 substitution, 2 Kgs 18:4 Nehushtan correction). Clickable.
- Depth 2 framework sections:
  1. Num 21 wilderness incident in historical/literary context
  2. Jesus' own interpretation in John 3 as the canonical interpretive key
  3. The "lifted up" motif across John (3:14, 8:28, 12:32)
  4. Atonement-theology threads — substitution, propitiation, look-and-live (Rom 5 parallels)
  5. The 2 Kgs 18:4 Nehushtan correction — when typology risks becoming veneration. Founder editorial slot on the interpretive care required.
- Depth 3 drilldowns: `numbers-21-wilderness`, `john-3-lifted-up`, `atonement-thread`, `nehushtan-correction`. Doctrine A commentary stack on each.

#### Page 3 — Suffering Servant

- Route: `/featured/suffering-servant`
- Depth 1 visual: Manuscript-witness timeline — Isaiah 53 composition (pre-exilic on traditional reading) → DSS 1QIsa-a (1st c. BC, Qumran Cave 1) → NT quotation (Acts 8) → modern critical text. DSS 1QIsa-a is the visual anchor — a copy of Isaiah 53 that predates Christ by ~100 years, settling the composition-vs-prophecy question. No block quotes of Isaiah 53 at depth 1 — that lives at depth 3.
- Depth 2 framework sections:
  1. The four Servant Songs as a literary unit (Isa 42 / 49 / 50 / 52–53)
  2. Acts 8:26–40 as the canonical NT interpretive template — Philip explains this passage from Isaiah 53; a pattern for every subsequent Christian reading
  3. NT epistolary echoes — 1 Pet 2:21–25, Rom 10:16, Heb 9:28
  4. The Deutero-Isaiah hypothesis steelmanned per §4.5 — with internal-evidence response anchored in John 12:38–41 (Jesus quotes both "first" Isaiah 6:10 and "second" Isaiah 53:1 in immediate succession, attributing both to one prophet). Founder editorial slot on the response.
  5. DSS 1QIsa-a as external textual witness — 1947 discovery, Shrine of the Book provenance, Masoretic variants noted at item level
- Depth 3 drilldowns: `isaiah-53-exposition` (verse-by-verse walk with Doctrine A per verse), `acts-8-philip-and-eunuch`, `epistle-echoes`, `1qisa-a-manuscript-witness`, `objections-and-responses`.
- Sourcing caveats: DSS 1QIsa-a imagery is not licensed-friendly; cite text and metadata, do not reproduce manuscript photography. Reference the Shrine of the Book's public scholarly publications only.
- Cross-link discipline: This page's depth 2 section 4 thematically twins with the Isaiah Mini-Bible's "two-Isaiahs" framework section (§7.7 retrofit scheduled for Batch 18). If that section hasn't landed on `/isaiah-mini-bible` yet, add a forward-link placeholder in the session record — do not block.

#### Page 4 — Genealogies of Christ

- Route: `/featured/genealogies-of-christ`
- Depth 1 visual: `<DualTreeVisual />` — two branches from David. Matthew's kingly line (David → Solomon → Rehoboam → … → Jeconiah → Joseph) left; Luke's line (David → Nathan → … → Heli → Mary, traditional reconciliation) right. Jeconiah visually flagged. Clickable ancestors link to their character profiles where present (tie into existing 97 seeded characters).
- Depth 2 framework sections:
  1. Matthew's 14-14-14 literary structure + gematria significance (Hebrew "David" = 14, using values dalet-vav-dalet = 4+6+4)
  2. Luke's reverse-chronological form and Adamic terminus (Luke 3:38)
  3. The Jeconiah problem — Jer 22:30's curse + the legal-father-vs-biological-father resolution via Joseph-as-legal / Mary-as-biological
  4. Shared names across branches (multiple Matthats, Levis, Jesuses) — why name collisions don't falsify the reconciliation
  5. Messianic implications of Davidic descent through both branches
  6. Alternative reconciliations (levirate marriage hypothesis — Africanus) steelmanned with response
- Depth 3 drilldowns: `matthean-kingly-line`, `lukan-natural-line`, `jeconiah-problem`, `virgin-birth-and-davidic-descent`, `shared-names-differing-branches`.

#### Page 5 — Seed Promise

- Route: `/featured/seed-promise`
- Depth 1 visual: `<RibbonTimeline />` — four inflection points: Gen 3:15 → Gen 12:3 → Gal 3:16 → Rev 12. Each inflection is a clickable card with ≤2 sentences of framing. No verse text at depth 1.
- Depth 2 framework sections:
  1. Gen 3:15 as protoevangelium ("first gospel") with grammatical note on the singular seed (Hebrew `zera`)
  2. The Abrahamic seed of Gen 12:3 / 22:18 and its narrowing through Isaac, Jacob, Judah
  3. Paul's grammatical argument in Gal 3:16 — `sperma` singular refers to Christ
  4. Rev 12 woman-child-dragon as final resolution of the 3:15 enmity
  5. Jewish interpretive traditions on Gen 3:15 (Targum Neofiti, Targum Jonathan) as corroborating witnesses
- Depth 3 drilldowns: `gen-3-15-protoevangelium`, `gen-12-abrahamic-seed`, `galatians-3-singular-seed`, `revelation-12-woman-and-dragon`.

#### Page 6 — Scarlet Thread

- Route: `/featured/scarlet-thread`
- Depth 1 visual: Per source brief and [[F1_addendum_01]] Item 4 — bento grid with scarlet ribbon connector, Yom Kippur / Yoma 39b tile 2× size with scarlet-to-white gradient, mobile stacks vertically. Each of the eight literal scarlet/crimson occurrences gets a clickable entry. No block quotes at depth 1. This page does NOT use `<ThreadTimeline />`; composes a bespoke `<ScarletRibbonBento />` from Batch 3 diagram-library primitives + Tailwind grid + SVG ribbon overlay.
- Depth 2 framework sections:
  1. Literal threads surveyed — Rahab's cord (Josh 2), Tamar's thread (Gen 38), Passover blood (Ex 12), crimson worm of Ps 22, scarlet in the Tabernacle curtains and priestly garments, scapegoat's horn per Mishnaic tradition
  2. Yoma 39b — Mishnaic/Talmudic source citation with plain-text translation of the relevant passage (the scarlet cord at the Temple ceasing to turn white forty years before the Temple's destruction, ~AD 30). Framed as external Jewish witness to the cessation of atonement's sign at the AD 30 threshold. Founder editorial slot reserved.
  3. Isaiah 1:18's scarlet-to-white cleansing
  4. Revelation's blood-of-the-Lamb motif as eschatological fulfillment
- Depth 3 drilldowns: `rahab-scarlet-cord`, `tamar-scarlet-thread`, `passover-blood`, `crimson-worm-psalm-22`, `scarlet-in-tabernacle` (forward-links to Batch F2's Tabernacle page once shipped), `yoma-39b-second-temple-account`, `isaiah-1-18-scarlet-to-white`, `revelation-blood-of-lamb`.
- Sourcing caveats for Yoma 39b: Soncino Talmud English is copyrighted. Use Rodkinson's 1903 PD English translation or equivalent. ≤50 words direct quote, attribution visible.
- Entomological note for crimson worm (`tola'at shani`): source-cited, not AI-generated.

### Finishing work (applies to all 6 pages)

1. **Cross-surface registration.** For every verse referenced at any depth on any of the six pages, add a row to `featured_page_refs` with `route_prefix='/featured'` and slug pointing to the feature page. Batch count target: 100+ rows.
2. **Editor's Notes drawer render check.** Drawer renders on every top-level + drilldown route. Reduced weight at ship (all drawers empty — founder populates later).
3. **Forward-registration for unshipped features.** Scarlet Thread's Tabernacle drilldown, Seed Promise's Rev 12 card, etc. — register refs to `/featured/tabernacle` and `/featured/creation-to-new-creation` even though those ship in Batch F2. `<FeaturedStudiesOnVerse />` silently skips unregistered feature pages.
4. **Slug collision watch.** Suffering Servant cross-links into Isaiah Mini-Bible (which lives at `/study/*` until §7.7 migration) — don't collide slugs with `/title/*` or `/study/*` registrations. If a collision surfaces, document in session record; Batch 23 Hygiene owns the `(route_prefix, slug)` dedupe fix.
5. **Legacy `/study/*` retirement (per [[F1_addendum_01]] Item 3).** Delete `src/app/study/{bronze-serpent,genealogies,seed-promise,suffering-servant}/page.tsx` (and co-located files that only serve those routes). Add 308 redirects in `next.config.js`:
   - `/study/bronze-serpent` → `/featured/bronze-serpent`
   - `/study/genealogies` → `/featured/genealogies-of-christ`
   - `/study/seed-promise` → `/featured/seed-promise`
   - `/study/suffering-servant` → `/featured/suffering-servant`
   Grep codebase for inbound internal links to the four old slugs; update to the new slugs in the same commit. Do NOT lift-and-shift content — old trails predate Doctrine B three-depth + Doctrine A tradition tags.
6. **Ark sync per §8.3 — complete in order:**
   - Session record at `_ark/03-sessions/session_F1_{date}.md` with one-paragraph summary, file changes list, migrations list. WikiLinks: this batch prompt, `[[ThreadTimeline]]`, `[[RibbonTimeline]]`, `[[DualTreeVisual]]`, `[[RaysFromGlyph]]`, and all six feature page slugs as concept nodes.
   - Update `_ark/prompts/batch_F1_typology_threads.md` status + session WikiLink.
   - New nodes for concept entries: Jeconiah's curse, DSS 1QIsa-a (as manuscript node), Nehushtan, crimson worm / `tola'at shani`, Yoma 39b (as source node), Targum Neofiti (as source node). Each with minimum 2 outbound WikiLinks.
   - Note BATCH_QUEUE.md drift for post-F3 reconciliation (per [[F1_addendum_01]] Item 5).
7. **Report back to Marcus with per-page production-walk URLs** so he can verify before pushing Wave F.

## DELIVERABLES

- Six feature pages live at their `/featured/{slug}` routes, all three depths present, every drilldown reachable.
- One (or at most two) migrations — the feature-pages schema + a combined seed migration for all six pages' sections and drilldowns.
- 100+ `featured_page_refs` rows registered.
- Four shared primitive components built, tested, and reused across all six pages.
- Ark sync artifacts: one session record, six feature-node vault files, up to six concept-node vault files.
- Push is Marcus's job per Wave F push discipline — Cowork does NOT push. Commit to feature branch, accumulate F1 + F2 + F3, Marcus pushes Wave F as a single push.

## ACCEPTANCE

Production click-through by Marcus (after Marcus pushes the full Wave F):

1. `/featured/taw` — paleo-Hebrew taw with 4 rays; 4 drilldowns reachable; ten-second test passes.
2. `/featured/bronze-serpent` — vertical thread Num 21 → John 3 → atonement; 4 drilldowns; Nehushtan correction surfaced in framework.
3. `/featured/suffering-servant` — manuscript-witness timeline with DSS 1QIsa-a as anchor; Isaiah 53 drilldown renders verse-by-verse Doctrine A commentary; Deutero-Isaiah response section present.
4. `/featured/genealogies-of-christ` — dual-tree with Matthean + Lukan branches; Jeconiah flagged; 5 drilldowns reachable.
5. `/featured/seed-promise` — ribbon timeline with 4 inflection points; 4 drilldowns.
6. `/featured/scarlet-thread` — 8-tile bento grid with ribbon connector + Yoma 39b tile at 2× weight; 8 drilldowns; Yoma citation ≤50 words with PD attribution visible.
7. Verse pages for anchor verses show correct feature pages in Featured Studies: Num 21, John 3:14–15, Isa 52:13–53:12, Acts 8:26–40, Matt 1, Luke 3, Gen 3:15, Gen 12:3, Gal 3:16, Rev 12, Josh 2, Gen 38, Ex 12, Ps 22, Isa 1:18, Rev 7:14.
8. Editor's Notes drawer renders at reduced weight on all top-level + drilldown routes.
9. No 404s anywhere in the Wave F1 route tree.
10. No living-author reproduction anywhere on any page (Missler, Brewer, Huff — cite only).
11. `/study/{bronze-serpent,genealogies,seed-promise,suffering-servant}` return 308 redirects to their `/featured/*` counterparts.

## OUT OF SCOPE

- Batch F2 pages (Trees, Tabernacle, Mazzaroth, Creation to New Creation).
- Batch F3 pages (Names, Covenants, Messianic Psalms, Armor, Fruit, Seven Churches).
- Types of Christ typology index — parking lot.
- Isaiah Mini-Bible §7.7 light retrofit — Batch 18 owns it.
- Editor's Notes authoring — Pastor Marc populates post-ship.
- `<FeaturedStudiesOnVerse />` slug-dedupe fix — Batch 23 Hygiene owns it.
- Graph revival — graph stays gated.
- `/study/{tabernacle,isaiah-mini-bible,messianic-psalms,bible-codes}` retirement — those migrate in F2 / F3 / Batch 18 / absorbed into F2 Trees ELS subsection respectively.

## IF YOU HIT A BLOCKER

Write `_ark/batch-F1-blocker.md` with:

- What you were doing when you hit the blocker.
- The specific page + ambiguity or missing input.
- Two or three paths forward and your recommendation.
- WikiLink to this batch prompt.

Then halt. Do not guess. Marcus resolves blockers in Claude; Cowork resumes after an addendum.

Specific blocker triggers:

- Any of the 6 source briefs missing from `_ark/source-briefs/`.
- Source brief underspecified on a depth-1 visual (no resolvable component design).
- Schema conflict on `feature_pages` family tables vs. prior work.
- Any verse reference in any brief that doesn't exist in the `verses` table.
- Any requirement that would need a living-author direct quote exceeding 50 words or more than one quote per source.
- Any Yoma 39b translation option that is copyrighted (Soncino is copyrighted — must use Rodkinson PD 1903 or equivalent).
