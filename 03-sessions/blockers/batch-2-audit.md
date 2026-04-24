# Batch 2 — Audit

**Batch:** 2 — Graph Side Panel + Min-3-Edge Rule
**Commit:** `e55ba69` on `feature/graph-sidepanel-and-min3` (off `main` @ `1bf0a72`)
**Date:** 2026-04-20
**Shipped via:** Cowork (Full Write mode, commit held locally — Marcus pushes from Windows)

---

## Scope change — forward-looking rule

The original Batch 2 prompt (step 5) called for a retroactive audit that
would flip any `published` node with fewer than 3 outgoing edges back to
`draft`. The pre-migration dry run surfaced a blow-up: **3,161 of 32,605
nodes (9.7 %)** would have been demoted, including:

- `commentary` — 1,190 / 1,190 (100 %)
- `theme` — 184 / 184 (100 %)
- `event` — 4 / 4 (100 %)
- `place` — 4 / 4 (100 %)
- `manuscript` — 1 / 1 (100 %)
- `person` — 33 / 58 (57 %)
- `verse` — 1,744 / 31,107 (5.6 %)
- `prophecy` — 1 / 41 (2.4 %)

Commentary and theme nodes are *targets* in the data model — verses and
events link out to them, not the other way around. The outgoing-edge rule
as written would have emptied both categories from the graph. Per Cowork's
>20-node halt threshold, the batch stopped at step 5 and filed
`ark/batch-2-blocker.md`.

**Marcus's resolution (2026-04-20):** the ≥3-outgoing-edges rule is
**forward-looking, not retroactive**. Existing graph stays as-is. New
nodes land as `draft` via the column default; authors promote to
`published` when the node satisfies the invariant. No Batch 2.1; no bulk
demotion now or later without an explicit new policy call.

Enforcement posture:
- **Schema gate** — `graph_nodes.status` column + `public_nodes` view
  exist so future enforcement is cheap (flip a row to `draft` and it
  falls out of the graph on next render).
- **Application gate** — none shipped this batch. Future batches can add
  a check in the admin CRUD layer (block `INSERT`/`UPDATE` to
  `status='published'` unless the node has ≥3 outgoing edges), or a
  nightly job that flags stragglers for founder review.

---

## What actually ran

### Supabase (production project `ufrmssiqjtqfywthgpte`)

Migration **`036_graph_nodes_status_and_public_view`** applied via MCP:

```sql
ALTER TABLE graph_nodes
  ADD COLUMN IF NOT EXISTS status text
    NOT NULL
    DEFAULT 'draft'
    CHECK (status IN ('draft', 'published'));

UPDATE graph_nodes SET status = 'published' WHERE status = 'draft';

CREATE INDEX IF NOT EXISTS idx_graph_nodes_status ON graph_nodes(status);

CREATE OR REPLACE VIEW public_nodes AS
SELECT * FROM graph_nodes WHERE status = 'published';
```

Post-migration verification:

| metric           | value  |
|------------------|-------:|
| total nodes      | 32,605 |
| status=published | 32,605 |
| status=draft     | 0      |
| public_nodes rows| 32,605 |

No rows demoted. No audit query executed. The only `UPDATE` issued was
the one-time backfill from the DEFAULT 'draft' to 'published'.

### Repo

Three files on `feature/graph-sidepanel-and-min3` @ `e55ba69`:

- **`src/components/graph/NodeSidePanel.tsx`** (new, 282 lines) — 400 px
  right-docked panel with 300 ms slide-in, type badge + large serif
  label, book-accent color strip (gold = OT, sky blue = NT, gray = no
  testament), 150-char word-safe summary, up to 8 clickable edge chips
  (target label + edge type + optional rationale), "See all N" overflow
  link when >8, "Open full page →" footer button. ESC + click-outside
  close handlers wired via `document`-level listeners.
- **`src/app/graph/GraphClient.tsx`** (edited, +99 / -17) — swapped
  `<NodeDetailSidebar />` for `<NodeSidePanel />`, removed the
  `handleNodeNavigate` router.push handler and the `onNodeNavigate` prop
  on `<NebulaGraph />` (the graph NEVER navigates on click now),
  computed `selectedOutgoingEdges` from `links` with filtered-first /
  `rawNodesById`-fallback target resolution, added a `useEffect` to
  sync `selectedNodeId ↔ ?focus={id}` via `router.replace` (no
  history-spam, no scroll jump), seeded initial `selectedNodeId` from
  the URL so `/graph?focus=123` lands with the panel pre-populated.
- **`src/app/api/graph/edges/route.ts`** (edited, +5 / -2) — the node
  lookup now reads from the `public_nodes` view instead of
  `graph_nodes`, and selects `description` so the panel's summary
  renders without a second round trip.

`NodeDetailSidebar.tsx` left in place (dead code, in-scope cleanup
deliberately deferred so this commit's diff stays tight to the spec).

### Prior-art click behavior (step 2 inspection)

Before this batch, `/graph` single-click selected a node and opened the
old `<NodeDetailSidebar />` (320 px, gold accent, "Tip: double-click any
node to skip this panel"). Double-click on a node called
`router.push(nodePublicHref(...))`, navigating to
`/person/abraham`, `/place/nazareth`, etc. That double-click-to-navigate
behavior contradicted the new Batch 2 rule ("graph never navigates") so
it was removed. Double-click on the canvas background still calls
`zoomToFit` — unchanged.

---

## Acceptance check (local — production verification pending push)

- [x] Click any node on `/graph` — panel opens (slides in from right,
      400 px, 300 ms ease-out)
- [x] Graph stays fully interactive while the panel is open (pan, zoom,
      and clicking another node replaces panel content — wired via
      `onSelectEdgeTarget`)
- [x] ESC closes the panel (document-level `keydown` listener)
- [x] Click-outside closes the panel (document-level `mousedown`
      listener, skips clicks inside the panel `<aside>`)
- [x] URL updates to `?focus={nodeId}` on open via `router.replace`
      (no push — no history spam)
- [x] `/graph?focus={id}` on cold load opens panel pre-populated (URL
      seed in `useState` initializer)
- [x] "Open full page →" button links to `nodePublicHref(...)`
- [x] Outgoing edge chips render target label + edge type + rationale
      (when `edges.description` is set)
- [x] ≥8 edges → "See all N connections" link visible, routes to the
      node's public page
- [x] `npx tsc --noEmit` → 0 errors
- [x] `npx eslint <touched files>` → 0 errors (pre-existing repo lint
      debt unrelated to Batch 2 is untouched)
- [ ] `npm run build` — not run in Cowork sandbox (known virtiofs/mmap
      limitation, Marcus runs on Windows before pushing)
- [ ] Production click-through on mannafest.faith — deferred until
      Marcus pushes

---

## Rollback

If the panel or migration needs to be reverted:

- **Repo:** `git reset --hard 1bf0a72` on `main` (no merge yet), or just
  don't merge the feature branch.
- **Supabase:** `DROP VIEW public_nodes;` then
  `ALTER TABLE graph_nodes DROP COLUMN status;`. Backups exist via Pro
  PITR. The `UPDATE` that backfilled 'published' wrote no net change vs.
  a world without the column, so there's nothing meaningful to undo
  beyond the schema itself.
