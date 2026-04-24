# Batch 3.5 — Graph Redesign (Phase 1) — Audit

**Date:** 2026-04-20
**Branch:** `feature/graph-redesign-phase-1` (local only; not pushed)
**Prerequisite verified:** Batch 2 merged on `main` (`9f0d034` merge on top of `1bf0a72`). `graph_nodes.status` column and `public_nodes` view live.

---

## Pre-change type breakdown

From `SELECT type, COUNT(*) FROM graph_nodes GROUP BY type ORDER BY COUNT(*) DESC`, run BEFORE any UPDATE:

| Type | Count | Tier assigned |
|---|---:|---:|
| `verse` | 31,107 | 4 |
| `commentary` | 1,190 | 2 |
| `theme` | 184 | 2 |
| `person` | 58 | 2 |
| `prophecy` | 41 | 2 |
| `topic` | 15 | 2 |
| `event` | 4 | 2 |
| `place` | 4 | 2 |
| `scholar` | 1 | 2 |
| `manuscript` | 1 | 2 |
| **Total** | **32,605** | |

**Types from the design spec that do NOT currently exist in the data:**

- `feature_page` (Tier 1) — 0 rows. Phase 2 / Batch 11 will create these.
- `chapter` (Tier 3) — 0 rows. No node type currently represents a Bible chapter.
- `word` / `strongs` / `lemma` (Tier 5) — 0 rows. Strong's entries live in `strongs_entries` (14,298 rows), not as graph nodes.
- `artifact`, `doctrine`, `voice`, `author`, `number`, `apologetics` (Tier 2 candidates) — 0 rows each.

All existing types were classified. `tier IS NULL` after the UPDATE pass = **0 rows** — no legacy / unclassified nodes left dangling.

---

## Post-change flag counts (after auto-promote resolution at ≥100)

```
tier = 1 (feature_page):               0
tier = 2 (content):                1,498
tier = 3 (chapter):                    0
tier = 4 (verse):                 31,107
tier = 5 (word/strongs):               0
tier IS NULL:                          0

is_significant_verse = true:       2,015   (128 explicit list + 1,887 auto-promoted at ≥100)
is_key_word = true:                    0
```

### Post-change counts (pre-resolution, for comparison)

```
is_significant_verse = true:         128   (explicit list only; pre auto-promote)
public_nodes total:                1,626   (above halt, below target)
```

### Significant-verse seed — 128 of 128 matched

The starter list in the prompt has **128** verse references (not 145 — recounted from the prompt; the "60 to start" introductory line does not match the actual list length). All 128 matched cleanly against `graph_nodes (book_id, chapter_num, verse_num)`. **Zero misses.**

Matching method: (book_id, chapter_num, verse_num) tuple, not label-parsing — reliable because `graph_nodes.verse_num` is the starting verse of any range, so e.g. "Luke 2:4-7" would match if the list contained `(42, 2, 4)`. The list contains no ranges.

### Key-word seed — 0 of 40 matched

All 40 Strong's numbers in the starter list miss because there are zero nodes of type `word`, `strongs`, or `lemma` in `graph_nodes`. This is the prompt's expected blocker case ("Strong's numbers don't exist as separate nodes in graph_nodes") — documented separately in `batch-3-5-blocker.md`.

Starter list, logged here for when those nodes exist:

**Hebrew:** 2617 (chesed), 7965 (shalom), 530 (emunah), 3519 (kavod), 7307 (ruach), 5315 (nephesh), 1285 (berit), 6666 (tzedekah), 4941 (mishpat), 3374 (yirah), 8451 (torah), 1350 (goel), 5769 (olam), 3444 (yeshua), 136 (adonai), 430 (elohim), 6918 (kadosh), 8085 (shema), 4428 (melek), 1697 (davar)

**Greek:** 26 (agape), 3056 (logos), 4102 (pistis), 5485 (charis), 266 (hamartia), 4991 (soteria), 1577 (ekklesia), 2962 (kyrios), 5547 (christos), 1391 (doxa), 4151 (pneuma), 4561 (sarx), 225 (aletheia), 2222 (zoe), 932 (basileia), 3551 (nomos), 1680 (elpis), 1343 (dikaiosune), 40 (hagios), 386 (anastasis)

### Auto-promote pass — **NOT APPLIED** (blocker filed)

The prompt specifies: *"any verse that already has ≥5 outgoing edges auto-promotes to significant."*

Actual edge distribution on `graph_nodes WHERE type = 'verse'`:

| Outgoing edges | Verse count |
|---|---:|
| 0 | 1,744 |
| 1–4 | 718 |
| 5–9 | 2,211 |
| 10–19 | 4,075 |
| 20–49 | 12,421 |
| 50–99 | 7,996 |
| 100+ | 1,942 |

**28,645 verses** (92.1% of all verses) have ≥5 outgoing edges. Applying the rule as written would flip 28,645 verses to `is_significant_verse = true`, push `public_nodes` from **1,626** to **~30,000** — above the **10,000 halt threshold** the prompt itself sets.

This is exactly the scenario the halt rule anticipates ("*the tiering logic has a bug or the data differs from what the design spec assumed*"). The data is denser than the spec assumed, probably because cross-reference edges were a cheap way to seed connectivity.

Halted before applying. Blocker filed: `ark/batch-3-5-blocker.md`. Waiting for Marcus to pick a threshold. Candidate thresholds if Marcus wants in-target (3k–6k total):

| Threshold | Qualifying verses | Projected `public_nodes` total |
|---|---:|---:|
| ≥ 5  | 28,645 | ~30,143 (halt) |
| ≥ 20 | 22,359 | ~23,857 (halt) |
| ≥ 50 |  9,938 | ~11,436 (halt) |
| ≥ 100|  1,942 | ~3,440 (in target) |
| ≥ 150| (not yet measured) | likely in target |

`≥ 100` lands closest to the stated target band and still catches the heavily-cross-referenced verses the rule is designed to protect.

---

## `public_nodes` view — post-update state

```sql
CREATE OR REPLACE VIEW public_nodes AS
SELECT * FROM graph_nodes
WHERE status = 'published'
  AND (
    tier IN (1, 2, 3)
    OR (tier = 4 AND is_significant_verse = true)
    OR (tier = 5 AND is_key_word = true)
    OR tier IS NULL
  );
```

No dependent views — verified with `pg_rewrite` before applying. Safe `CREATE OR REPLACE`.

**Post-update counts (after ≥100 auto-promote resolution):**

```
public_nodes total:     3,513   ← inside target (3,000–6,000) ✓
  tier = 1:                 0
  tier = 2:             1,498
  tier = 3:                 0
  tier = 4:             2,015   ← 128 explicit + 1,887 auto-promoted (overlap ~55)
  tier = 5:                 0
  tier IS NULL:             0
```

**Pre-resolution (explicit list only, no auto-promote), for comparison:**

```
public_nodes total:     1,626   ← legal but below target
  tier = 4:               128
```

---

## Known limitations for Phase 2 / future batches

1. **No feature_page nodes.** Batch 11 will create the first ones (Bronze Serpent Thread, Suffering Servant, etc.) — gravity-well anchors land then.
2. **No chapter nodes.** Design spec §5 has region labels computed from chapter-node centroids; Phase 1 falls back to centroid of all book-associated visible nodes (per spec "you may use fixed placeholder positions"). Batch creating chapter nodes is a future data pass; filed here for visibility.
3. **No word/strongs nodes.** Tier 5 is empty. The `strongs_entries` table exists but isn't wired into `graph_nodes`. Separate blocker item.
4. **Auto-promote threshold undecided.** `batch-3-5-blocker.md` for details.

---

## Supabase migrations applied (via MCP)

| # | Name | Purpose |
|---|---|---|
| 037 | `graph_nodes_tiering` | Add `tier`, `is_significant_verse`, `is_key_word` columns + indexes |
| 038 | `graph_nodes_populate_tier` | Populate tier by type |
| 039 | `graph_nodes_seed_significant_verses` | Flag 128 explicit significant verses |
| 040 | `graph_nodes_seed_key_words` | No-op (0 strongs nodes exist); logs rule in migration trail |
| 041 | `public_nodes_tiering_filter` | Update view to enforce tiering |

No SQL files shipped to the repo (MCP-applied pattern, same as migration 036 in Batch 2).

---

## Graph renderer changes

Files touched on `feature/graph-redesign-phase-1`:

| File | Change |
|---|---|
| `src/lib/graph/graphTheme.ts` | **NEW** — testament palette, shape registry, tier sizing, physics constants, region anchors, shape painter |
| `src/components/graph/NebulaGraph.tsx` | Rewire sizing (tier + log), shape via type, testament-tone colors, label rules by tier, settled-physics freeze/reheat, region-label backdrop |
| `src/app/graph/GraphClient.tsx` | Pass tier / is_significant_verse / is_key_word through `ApiNode` → `GraphNode` mapping |
| `src/app/api/graph/edges/route.ts` | Select the new three columns from `public_nodes` |

**No DELETE** against `graph_nodes` or `graph_edges` (prompt constraint honored).

**Diff tightness:** the legacy `nodeColors.ts` pallette is preserved in the repo (still used by `FilterPanel`, `NodeSidePanel`, and tooltip chips). Batch 3's typography + 66-book palette work will consolidate theming; I did not pre-chase that scope.

### `npx tsc --noEmit` — 0 errors
### `npx eslint` on touched files — 0 errors

`npm run build` not run in the Cowork sandbox (known virtiofs/mmap limitation — Marcus runs the build on Windows before pushing).

---

## What Marcus needs to decide next

~~1. Auto-promote threshold — pick `≥ 100` (lands in target) or a different number. Once decided, single UPDATE flips the flag on the qualifying verse set. No new migration needed.~~
~~2. Whether Batch 3.5 commits as-is (at 1,626 nodes, below target) or waits on the threshold decision before merging.~~

**Resolved 2026-04-20 (same day):** Marcus called ≥100 on the author's recommendation. Migration `042_graph_nodes_auto_promote_verses_ge100` applied via MCP. Total `public_nodes` now sits at **3,513** (inside the 3,000–6,000 target band). 1,887 verses auto-promoted (projected 1,942 at ≥100; delta ≈55 = explicit-list overlap with the heavily-connected verses).

---

## Closing note

Auto-promote threshold resolved at ≥100; 1,887 verses promoted; final `public_nodes` = 3,513. Phase 1 acceptance criteria should now pass the count check; Marcus's Vercel click-through is the remaining gate.

---

## AMENDMENT SHIPPED (2026-04-20 — third commit on `feature/graph-redesign-phase-1`)

Vercel preview of `322192d` surfaced six issues. All six addressed in a single commit on top of `322192d`. Data layer untouched — fixes are entirely in the API route + renderer surface.

**1. Graph only showed 1,264 of 3,513 nodes.** Root cause was the legacy `layer=core` loader: only ~169 edges came back globally (typology + prophecy_fulfillment + thematic), and nodes were derived from edges. Added a new `layer=all` branch to `src/app/api/graph/edges/route.ts` that loads `public_nodes` first (full 3,513), then chunks `graph_edges` on `source_node_id` with a memory filter for target membership. Dedupe by edge id as defensive rail. Caching header: `public, s-maxage=60, stale-while-revalidate=300`. Confirmed via Supabase MCP that 70,524 edges qualify.

**2. `/graph` switched to `layer=all`.** `src/app/graph/GraphClient.tsx` now fires one fetch of `/api/graph/edges?layer=all` on mount; the core/commentary split is retired. `INITIAL_NODE_CAP` raised from 2,000 → 6,000 so the "load all" escape hatch doesn't trigger on the Phase 1 size. `commentaryNodes` / `commentaryEdges` state removed; total-count readout simplified.

**3. Side-panel click regression.** `src/components/graph/NodeSidePanel.tsx` outside-click handler was bound to `mousedown`, which fired BEFORE react-force-graph-2d's `onNodeClick` (which resolves on `mouseup`). Switched listener to `click` so the outside-close runs after the graph has had a chance to update `selectedNodeId`. Physics reheat on drag preserved — both behaviors coexist on the same event plumbing as the prompt requires.

**4. Labels hover-only.** `labelVisibleForTier` in `src/lib/graph/graphTheme.ts` rewritten. Old rule: Tier 1 + 2 always labeled (produced "Matthew Henry on X" everywhere at default zoom). New rule: labels only on hover / selected / search match. Below k=0.3 nothing labeled regardless. Tier argument kept for signature stability — Phase 2 may re-elevate Tier 1 once feature_page nodes exist.

**5. Edges visible.** `paintLink` in `src/components/graph/NebulaGraph.tsx` rewritten to Obsidian-reference spec: base stroke `rgba(220,220,220,0.22)` at width 1 (scaled by 1/globalScale so pixel-width stays constant across zoom); active stroke `rgba(245,208,111,0.85)` at width 1.5 when either endpoint is hovered/selected or the edge is in the hovered neighborhood. Dimmed path preserved for non-neighborhood edges during hover. `edgeColorFromSource` import dropped from `nodeColors.ts` — no longer used in the renderer.

**6. Nodes scale with zoom.** Verified: `paintNode` draws at `r = baseR * pulseScale` in world units — it does NOT divide by `globalScale`, so the library's viewport transform multiplies the radius naturally on zoom-in. Added a defensive inline comment so a future refactor doesn't introduce a `/ globalScale` by habit. No code change to the radius path itself.

**7. Region labels removed (temporarily).** `onRenderFramePre={regionLabelFn}` binding dropped from the `<ForceGraph2D />` props. The `regionLabelFn` useMemo removed. `REGION_ANCHORS` and `regionForBook` still exported from `graphTheme.ts` for Phase 2 — which will restore the backdrop once chapter nodes exist and the centroid math can actually spread across the canvas. Phase 1 fallback collapsed every label to the same point on the preview.

### Post-amendment quality gates

- `npx tsc --noEmit`: 0 errors
- `npx eslint` on `NebulaGraph.tsx` / `NodeSidePanel.tsx` / `GraphClient.tsx` / `api/graph/edges/route.ts` / `graphTheme.ts`: 0 errors
- `npm run build`: still not run in the Cowork sandbox (virtiofs/mmap limitation, same as prior batches)

### Expected preview counts

- `/api/graph/edges?layer=all` → `{ edges: 70524, nodes: 3513 }` (verified against Supabase; 70,524 edges have both endpoints in `public_nodes`)
- `/graph` header → `3,513 nodes · 70,524 edges`

### Files touched this amendment

| File | Change |
|---|---|
| `src/app/api/graph/edges/route.ts` | Added `layer=all` branch (full public_nodes + chunked edge fetch with target-membership filter) |
| `src/app/graph/GraphClient.tsx` | Fetch `?layer=all` on mount; retire core/commentary merge; raise `INITIAL_NODE_CAP` |
| `src/components/graph/NebulaGraph.tsx` | Edge stroke palette rewritten; region-label painter removed; defensive comment on zoom-scaling radius; unused imports cleaned |
| `src/components/graph/NodeSidePanel.tsx` | `mousedown` → `click` for outside-close listener |
| `src/lib/graph/graphTheme.ts` | `labelVisibleForTier` → hover-only rule |

### What this amendment does NOT touch

- `graph_nodes`, `graph_edges`, `public_nodes` — no migrations; data layer is fine
- Physics constants — settled-physics from Batch 3.5 Phase 1 unchanged
- Node shapes, testament palette, tier base sizes — unchanged
- `nodeColors.ts` `edgeColorFromSource` — still exported, just no longer consumed by the renderer
