---
batch: F3 — Wave F Cluster Features (6 feature pages; Wave F closer)
owner: Cowork (Full Write mode)
branch: feat/batch-F1-typology-threads (Wave F accumulating branch; do NOT create new branch per F2 addendum Item 1)
wave: F — Feature Pages (consolidated batch 3 of 3)
blocks_on: Batch F2 shipped to branch
unblocks: Wave F push (single push after F3 closes)
status: Code-complete 2026-04-23 — see [[session_F3_2026-04-23]]. Wave F closed. Awaiting Marcus Windows-direct push.
session: [[session_F3_2026-04-23]]
persisted_to_vault: 2026-04-23 (per F2 addendum Item 3)
---

# Batch F3 — Wave F Cluster Features (Wave F closer)

## GOAL

Ship 6 Wave F cluster-style feature pages — all "list-of-things-with-drilldowns" pattern — to close Wave F.

Pages:

1. Names of God — `/featured/names-of-god` (14 OT names + I AM capstone)
2. The Covenants — `/featured/covenants` (6 covenants on conditional/unconditional axis)
3. Messianic Psalms — `/featured/messianic-psalms` (6 psalms life-of-Christ arc with §4.6 tri-fold taxonomy)
4. Armor of God — `/featured/armor-of-god` (Roman legionary + 6 pieces + prayer-as-posture)
5. Fruit of the Spirit — `/featured/fruit-of-the-spirit` (singular karpos with 9 facets in 3 triads)
6. Seven Churches of Revelation — `/featured/seven-churches` (Asia Minor postal route + Matt 13 parallel)

## SCOPE

Routes: `/featured/{slug}` + `/featured/{slug}/:drilldown` for all 6 pages. Drilldown counts: Names 14, Covenants 6, Messianic Psalms 6, Armor 7, Fruit 10, Seven Churches 8 = **51 drilldowns**.

Branch: continue on `feat/batch-F1-typology-threads`. No branch creation.

`/study/*` migration: delete `src/app/study/messianic-psalms/page.tsx` + add 308 redirect + grep inbound links.

## COMPONENTS OWNED

- **New primitive**: `src/components/featured/primitives/ClusterFeature.tsx` + constants.ts + __tests__/ClusterFeature.test.ts
- **Per-page bespoke heroes** (6): NamesOfGodTimeline, CovenantsAxis, MessianicPsalmsArc, ArmorOfGodFigure, FruitOfTheSpiritTree, SevenChurchesMap
- **Migrations**: 075 (seed), 076 (featured_page_refs; ~155 rows)

## FINISHING WORK (Wave F closer)

1. Cross-surface registration — Wave F aggregate ~341 rows.
2. Living-author audit — Missler / Brewer / Huff / Rambsel / Satinover / Faulkner grep.
3. Tri-fold taxonomy audit — every Messianic Psalms drilldown carries a category label.
4. Spurgeon coverage check — SQL query per F3 prompt (Marcus runs on Windows via MCP).
5. Editor's Notes drawer render check — all 16 Wave F top-level + all ~82 drilldowns.
6. Vault prompt persistence — 5 files (F1 prompt + addendum, F2 prompt + addendum, F3 prompt) under `_ark/prompts/` with canonical naming.
7. Ark sync — Wave F close-out session record with aggregate stats.
8. Wave F close-out report to Marcus.
9. STATUS.md + BATCH_QUEUE.md updates — Marcus's manual task per §9.3.

## DELIVERABLES

- 6 feature pages live at `/featured/{slug}`.
- 51 drilldown pages reachable.
- `<ClusterFeature />` primitive built, tested, reused.
- 150+ cross-surface refs registered.
- Messianic Psalms `/study/*` legacy deleted + 308 redirect in place.
- Vault prompt persistence complete.
- Wave F close-out session record.
- Wave F close-out report for Marcus.
- **Marcus pushes Wave F as single push.** Cowork does NOT push.

## ACCEPTANCE

See session record [[session_F3_2026-04-23]] for the full click-through checklist.

## OUT OF SCOPE

- Types of Christ typology index — parking lot.
- Isaiah Mini-Bible §7.7 light retrofit — Batch 18.
- Editor's Notes authoring — post-ship Pastor Marc work.
- `<FeaturedStudiesOnVerse />` (route_prefix, slug) dedupe — Batch 23 Hygiene.
- STATUS.md / BATCH_QUEUE.md updates — Marcus's manual task per §9.3.

## IF BLOCKER

Write `_ark/batch-F3-blocker.md`. Triggers per prompt.

## Wave F Closer

F3 is the final Wave F batch. After this executes cleanly and the accumulated Wave F branch is pushed:

- 16 of 17 Wave F pages live (Types of Christ parked)
- All three consolidated batches shipped (F1 typology threads, F2 architectural + contested, F3 cluster features)
- Deferred-brief queue emptied
- Wave F capstone session record in the vault
- Next wave up: Wave C (OT Prophets + NT Remainder)
