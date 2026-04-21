# Session — 2026-04-20 — Batch 3.5 Phase 1 Amendment

**Cowork session running the Phase 1 amendment.** Branch `feature/graph-redesign-phase-1` already has two commits (`6da965d` Phase 1 + `322192d` auto-promote ≥100). Amendment goes on top as a third commit.

## Why this amendment

Vercel preview of `322192d` revealed six preview-only problems. Four regressions (visual / UX), one data-loader architecture issue, one pre-existing limitation made visible at full scale. No schema problems. The Phase 1 data layer (3,513 `public_nodes`, 70,524 internal edges) is healthy.

## Order of work

1. Read amendment prompt, STATUS, OPERATING_RULES. Noted the referenced `ark/01-architecture/graph-redesign-design-spec.md` is still absent from the vault — same paperwork gap as Phase 1; all amendment decisions are inlined in the prompt.
2. Verified edge count with the Supabase MCP: `SELECT COUNT(*) FROM graph_edges e WHERE EXISTS ... AND EXISTS ...` returned 70,524 — matches the figure the amendment prompt cites.
3. Added `layer=all` branch to `src/app/api/graph/edges/route.ts`. Loads the full `public_nodes` set first, then chunks `graph_edges` on `source_node_id` (1000 per chunk) with in-memory target-membership filter. Dedupe by edge id. Skips the legacy node-hydration block via a `nodesAlreadyLoaded` flag. Caching header aligned with `core`.
4. `src/app/graph/GraphClient.tsx` — retired the core + lazy-commentary loader pattern. One `fetch("/api/graph/edges?layer=all")` on mount. Dropped `commentaryNodes` / `commentaryEdges` state and the merged-node memo branch. `INITIAL_NODE_CAP` 2000 → 6000. Total-count readout simplified.
5. `src/components/graph/NodeSidePanel.tsx` — switched outside-click listener from `mousedown` to `click`. The prior mousedown was closing the panel before react-force-graph-2d's onNodeClick had a chance to set a new selection; `click` fires on mouseup and the parent's state updates converge in the same React batch.
6. `src/lib/graph/graphTheme.ts` — rewrote `labelVisibleForTier` to drop the "Tier 1/2 always-on" rule. New rule: hover / selected / search-match only, plus the existing k<0.3 bail-out. Tier argument kept as `_tier` for signature stability so Phase 2 can re-elevate Tier 1 cleanly.
7. `src/components/graph/NebulaGraph.tsx` — rewrote `paintLink` to the Obsidian-reference palette: base `rgba(220,220,220,0.22)` @ width 1, active `rgba(245,208,111,0.85)` @ width 1.5 for edges touching the hovered neighborhood or the selected node. Line width still `/ globalScale` to keep pixel-width constant across zoom. Non-neighborhood edges dim during hover (DIMMED_OPACITY carried forward).
8. Verified `paintNode` does NOT divide `r` by `globalScale` (per fix #6 requirement). Added a defensive inline comment so the property is preserved through future refactoring. No code change to the radius path.
9. Removed the region-label painter: dropped the `regionLabelFn` useMemo, removed the `onRenderFramePre` prop, pruned `REGION_ANCHORS` / `regionForBook` / `RegionAnchor` imports from `NebulaGraph.tsx`. The exports remain in `graphTheme.ts` for Phase 2 when chapter nodes exist. Also removed the `edgeColorFromSource` import from `nodeColors.ts` — no longer used in the renderer.
10. `npx tsc --noEmit` — 0 errors. `npx eslint` on the five touched files — 0 errors. `npm run build` still not runnable in the Cowork sandbox (known virtiofs/mmap limit; Marcus builds on Windows).
11. Appended an "AMENDMENT SHIPPED" section to `ark/batch-3-5-audit.md`, wrote this session record, will append a one-line decision-log entry to `STATUS.md`, then commit via plumbing.

## Diagnostic notes — what was really happening

**Fix #1 root cause.** The old core/commentary/crossref split was a Chunk 1.3 LOD pattern that made sense when the graph had 32,605 nodes and hundreds of thousands of edges. At that scale, loading only ~169 `typology | prophecy_fulfillment | thematic` edges on first paint was a good defaults-for-perf choice. After Phase 1 tiering cut public_nodes to 3,513 the split became pure loss: most of the content was architecturally unreachable because nodes were derived from edges, and `commentary` edges were only fetched when the user toggled that filter. Amendment's `layer=all` reverses the dependency — nodes first, then every edge with both endpoints in the node set.

**Fix #3 root cause.** The NodeSidePanel's outside-close handler was attached to `mousedown` in Batch 2. On a canvas click, mousedown fires before mouseup; react-force-graph-2d's onNodeClick resolves on mouseup. So the panel's close ran FIRST, clearing `selectedNodeId` to null, and then onNodeClick set it to the new node. The net React batch should have converged on the new node id, but the interleaving with the URL sync useEffect was racing enough that the panel frequently failed to re-open. Switching to `click` serializes the order cleanly.

**Fix #6 no-op.** The amendment prompt anticipated a `/ globalScale` bug in `paintNode`. Turns out Phase 1 already got the radius right (world-units, no division). Only the lineWidth and fontSize divide — both intentionally, to keep stroke pixel-width and label pixel-size constant across zoom. Added a defensive comment so a future refactor doesn't add the wrong division.

**Fix #7 root cause.** The Phase 1 `regionLabelFn` computed centroids from visible book-associated nodes. With no chapter nodes in the data, the eight regions' point clouds all had roughly the same centroid (the graph's overall center), so all eight labels stacked. The Phase 1 prompt's escape hatch ("you may use fixed placeholder positions") was taken — and on a crowded preview it looked worse than no labels. Drop for now; Phase 2 restores with chapter-node anchors.

## Files touched this session

Repo (`C:\Users\marcd\Downloads\MannaFest`):
- `src/app/api/graph/edges/route.ts`
- `src/app/graph/GraphClient.tsx`
- `src/components/graph/NebulaGraph.tsx`
- `src/components/graph/NodeSidePanel.tsx`
- `src/lib/graph/graphTheme.ts`

Vault (`C:\Users\marcd\Documents\MannaFest\ark`):
- `ark/batch-3-5-audit.md` (appended AMENDMENT SHIPPED section)
- **NEW** `ark/03-sessions/2026-04-20-batch-3-5-amendment.md`
- `ark/STATUS.md` (decision-log entry appended)

Supabase:
- **No migrations.** Data layer is healthy.

## Open items for Marcus

- Push `feature/graph-redesign-phase-1` from Windows — three commits now sit ahead of `main`: `6da965d`, `322192d`, plus the amendment.
- Vercel preview click-through against the amendment acceptance criteria. If any of the six check items miss, halt — Phase 2 is out of scope here.
- Phase 2 batch queue: search modes, evolved side panel, feature-page seed nodes, region-label restoration (chapter-node centroids), 66-book palette (Batch 3).
- `ark/01-architecture/graph-redesign-design-spec.md` still missing from the vault — paperwork gap carried over from Phase 1.
