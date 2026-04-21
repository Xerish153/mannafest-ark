# BATCH 3.5 Phase 1 — Amendment (preview fixes)

## READ FIRST

1. `C:\Users\marcd\Documents\MannaFest\ark\01-architecture\graph-redesign-design-spec.md`
2. `C:\Users\marcd\Documents\MannaFest\ark\STATUS.md`
3. `C:\Users\marcd\Documents\MannaFest\ark\OPERATING_RULES.md`
4. Batch 3.5 Phase 1 audit at `ark/batch-3-5-audit.md` — data layer is healthy: 3,513 nodes, 70,524 internal edges in `public_nodes`

## CONTEXT — what's on the feature branch

`feature/graph-redesign-phase-1` exists locally and on origin at commit `322192d`. Preview deployed on Vercel. **Preview revealed six problems:**

1. **Graph only shows 1,264 of 3,513 nodes and 250 of 70,524 edges.** Root cause: `/api/graph/edges` uses a legacy layer system. Default `layer=core` returns only `typology | prophecy_fulfillment | thematic` edges (~169). Nodes are derived from returned edges — so if core edges don't touch a node, that node never renders. Cross-references (~60K of the 70K edges) are architecturally unreachable globally.
2. **Side panel click doesn't open.** Batch 2's working behavior regressed during Batch 3.5 edits to `GraphClient.tsx`. This is a regression, not a new feature.
3. **Too many labels, too noisy.** Every Tier 2 node labels (including all "Matthew Henry on X" commentary nodes). Reference aesthetic is Obsidian — hover-to-reveal only, not always-on.
4. **Edges are invisible.** Either not drawn, drawn too thin, or drawn too transparent.
5. **Nodes don't scale with zoom.** Zooming in keeps nodes tiny. Custom `paintNode` likely ignores `globalScale`.
6. **Region labels all stacked at the same point.** Cowork used fallback fixed positions per the Phase 1 prompt's escape hatch, and they're collapsed. For Phase 1 we simply remove them.

**Mode:** Full Write. Sandbox has NO GitHub credentials. Commit on top of `322192d` on the existing `feature/graph-redesign-phase-1` branch. Marcus pushes from Windows.

## CONSTRAINTS

> - Single audience: the student of the Bible who wants to learn.
> - Open-source data only. No licensed content.
> - No DELETE statements against `graph_nodes` or `graph_edges`. Ever.
> - File-explicit `git add` only.
> - No `lint --fix` after commit.
> - Do not push; Marcus pushes.

---

## GOAL

Fix the six preview problems so the graph looks and behaves like the Obsidian-style reference (dots, thin visible lines everywhere, labels on hover, nodes scale with zoom). Node count should reach 3,513 and edge count should reach ~70K.

---

## WORK — do all six. Commit when done.

### 1. Add an `all` layer to `/api/graph/edges/route.ts`

Edit `src/app/api/graph/edges/route.ts`.

Add a new layer branch that loads nodes directly from `public_nodes` and then loads ALL edges where both endpoints are in that set. Do not limit edges. Do not derive nodes from edges.

Approach:

```typescript
if (layer === "all") {
  // 1. Load all public_nodes
  const { data: allNodes, error: nodeErr } = await supabase
    .from("public_nodes")
    .select(
      "id, type, label, description, testament, book_id, chapter_num, verse_num, metadata, tier, is_significant_verse, is_key_word",
    );
  if (nodeErr) return NextResponse.json({ error: nodeErr.message }, { status: 500 });
  nodes = allNodes ?? [];

  // 2. Load edges with both endpoints in public_nodes (server-side filter via PostgREST)
  //    Using two .in() clauses against the node ID set.
  const nodeIds = nodes.map((n) => Number(n.id));
  const CHUNK = 1000;

  // Collect edges in chunks to avoid URL-length issues on the .in() clause.
  // We still need BOTH endpoints in nodeIds, so we do one side at a time
  // and then filter in memory.
  const allEdges: Record<string, unknown>[] = [];
  for (let i = 0; i < nodeIds.length; i += CHUNK) {
    const slice = nodeIds.slice(i, i + CHUNK);
    const { data, error } = await supabase
      .from("graph_edges")
      .select("id, source_node_id, target_node_id, relationship_type, weight, description")
      .in("source_node_id", slice);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (data) allEdges.push(...data);
  }

  const idSet = new Set(nodeIds);
  edges = allEdges.filter(
    (e) => idSet.has(Number(e.target_node_id)) && idSet.has(Number(e.source_node_id)),
  );

  // 3. Deduplicate edges (we may have fetched the same edge twice if both
  //    endpoints fell in different chunks, though source_node_id .in() prevents that here)
  //    Defensive only — leave in place.
  const seen = new Set<number>();
  edges = edges.filter((e) => {
    const id = Number(e.id);
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
  // Note: `includeNodes` is effectively true for this layer because we loaded nodes first.
  // Skip the later `if (includeNodes && edges.length > 0)` node-hydration block for this layer.
}
```

Then update the logic so that the node-hydration block at the bottom of the function is SKIPPED when `layer === "all"` (since nodes are already set). The caching header should be `"public, s-maxage=60, stale-while-revalidate=300"` for this layer, same as core.

Verify the endpoint by hitting it locally via curl or the browser with `?layer=all` after deploy; target counts: `{ edges: ~70000, nodes: 3513 }`.

### 2. Switch `/graph` to use `layer=all`

Edit `src/app/graph/GraphClient.tsx` (or its data-fetch helper). Find where `/api/graph/edges` is called. Change the `layer` query param from whatever it currently is (likely `core`) to `all`. Load ONCE on page mount. No progressive layer loading for `/graph`.

### 3. Restore side-panel click handler (Batch 2 regression)

Find the `handleNodeClick` (or similar) handler in `GraphClient.tsx`. The Batch 2 implementation opened `<NodeSidePanel />` with the clicked node ID and mirrored to `?focus={id}`. Batch 3.5 added node-drag reheat logic and likely overwrote or broke the click path.

Restoration intent:
- Clicking a node sets `selectedNodeId` state
- `<NodeSidePanel />` reads that state and opens with full node detail
- URL updates to `?focus={id}` via `router.replace`
- Batch 2 ESC and click-outside close behavior must still work
- Dragging still reheats physics per Phase 1 (both must coexist)

**Do not** simplify or remove the physics reheat logic. Integrate both onto the same event plumbing.

### 4. Labels: hover-only by default

Edit `src/lib/graph/graphTheme.ts` — `labelVisibleForTier` function. Current rule: tier 1 and 2 always visible. New rule:

- Always visible: none
- Hover OR selected OR search match: visible
- Everything else: hidden

Replace the function body:

```typescript
export function labelVisibleForTier(
  _tier: number | null | undefined,
  zoom: number,
  isHovered: boolean,
  isSelected: boolean,
  isSearchMatch: boolean,
): boolean {
  if (zoom < 0.3) return false;
  return isHovered || isSelected || isSearchMatch;
}
```

Tier argument kept for signature stability; unused for now. This is deliberate — when feature pages exist in data (Phase 2+), we may re-elevate Tier 1 to always-labeled. For now, clean Obsidian aesthetic wins.

### 5. Edges must be visible

Edit `src/components/graph/NebulaGraph.tsx`. Find the edge rendering section. Current state: edges either not drawn or drawn too transparent.

Target style (matching the Obsidian reference aesthetic):
- Base stroke: `rgba(220, 220, 220, 0.22)` (soft white, ~22% opacity)
- Stroke width: `1` at base zoom, scale with `globalScale`
- On edge hover or when either endpoint is hovered/selected: `rgba(245, 208, 111, 0.85)` (gold, same as feature-tone) at width `1.5`
- Do not draw edge labels by default

Check that `linkColor` and `linkWidth` props on `<ForceGraph2D />` accept these values, and that the `onRenderFramePre` custom painter (if used for edges) matches.

### 6. Nodes scale with zoom

Also in `NebulaGraph.tsx` — the custom `nodeCanvasObject` function. Verify the radius passed to `paintShape` is divided by `globalScale` or that the painting respects the viewport transform.

`react-force-graph-2d` passes `globalScale` as a second argument to `nodeCanvasObject`. The painter should draw at `pixelRadius = baseRadius` without dividing (which would make the node shrink with zoom-in — we want the opposite). If the current code divides, remove the division. Test visually: zoom in → nodes should grow proportionally; zoom out → nodes should shrink.

### 7. Remove region labels (temporarily)

In `NebulaGraph.tsx`, the `onRenderFramePre` painter that draws the region label backdrop: remove or comment out the rendering call. Keep the `REGION_ANCHORS` data in `graphTheme.ts` — we'll bring labels back in Phase 2 with proper centroid computation.

Do not delete `REGION_ANCHORS` or `regionForBook` — future-Phase-2 will use them.

---

## DELIVERABLES

- Second commit on `feature/graph-redesign-phase-1` with message:
  `feat(graph): Phase 1 amendment — full edge network + hover labels + side panel fix`
- No new Supabase migrations required (data layer untouched)
- `ark/batch-3-5-audit.md` — append a section "AMENDMENT SHIPPED" with the six fixes noted
- `ark/03-sessions/2026-04-20-batch-3-5-amendment.md` — session record
- `ark/STATUS.md` — append decision log entry

---

## ACCEPTANCE (Marcus will verify on Vercel preview)

- [ ] `/api/graph/edges?layer=all` returns approximately `{ nodes: 3513, edges: ~70000 }`
- [ ] `/graph` header shows approximately `3,500 nodes · 70,000 edges`
- [ ] Edges visibly drawn everywhere — the graph looks connected like the Obsidian reference
- [ ] No labels visible by default. Hovering a node shows its label. Selecting a node (click) shows its label via the side panel
- [ ] Clicking a node opens the Batch 2 side panel with node content
- [ ] Dragging a node briefly reheats physics, then refreezes
- [ ] Zooming in makes nodes visibly larger; zooming out makes them smaller
- [ ] Region labels gone (no stacked text in the middle)
- [ ] Physics still settle within ~5 seconds (must not regress)

---

## OUT OF SCOPE

- New content, new feature pages, new node types
- Batch 3 typography or 66-book palette
- Region label centroid computation (Phase 2)
- Graph-local search modes (Phase 2)
- Evolved side panel (grouped connections, mini-visual, breadcrumb trail — Phase 2)
- Any DELETE against `graph_nodes` or `graph_edges`
- Merging to main (Marcus does this after Vercel preview passes)

---

## IF YOU HIT A BLOCKER

Standard rule. Write `ark/batch-3-5-amendment-blocker.md`, halt, wait for Marcus in Claude.

Likely blockers:

- Payload too large: if `?layer=all` response exceeds ~10MB uncompressed, halt with size measurements. We can add a server-side filter or drop edge `description` field to shrink it.
- Performance regression: if physics takes >15 seconds to settle with 3,513 nodes + 70K edges, halt with timings. We can tune alpha decay or pre-settle server-side.
- `NodeSidePanel` integration: if the Batch 2 click handler was deeply intertwined with state that Phase 1 removed, halt with the current shape — we'll untangle together rather than guess.

---

## GIT PROTOCOL

- Commit on top of `322192d` on `feature/graph-redesign-phase-1`.
- File-explicit adds only.
- Same plumbing workaround for `.git/index` corruption if needed.
- Do not push.

Final report must include:
- New commit SHA
- `git log --oneline -3 feature/graph-redesign-phase-1`
- Files changed (stat)
- Counts: `/api/graph/edges?layer=all` returns — nodes count, edges count
- `git status --short`
