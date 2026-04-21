# BATCH 2 — Graph Side Panel + Min-3-Edge Rule

## READ FIRST
- `STATUS.md`
- `OPERATING_RULES.md`
- `BATCH_QUEUE.md`
- `MannaFest_Vision_v2_Locked.md`

## CONSTRAINTS

> - Single audience: the student of the Bible who wants to learn.
> - Open-source data only. No licensed content. Wesley Huff scholarship quality bar.
> - Guzik's Enduring Word is NOT CC-BY. Public-domain commentators only.
> - No AI-authored historical or theological claims.
> - Commentary always attributed. Traditions never flattened.
> - Debated content gets a page-level notice, not confidence badges.
> - 2D graph only. Desktop-first. Graph click opens side panel, never navigates.
> - Every node ships with ≥3 outgoing edges.
> - Full-density pages. No Beginner/Study/Deep gating.
> - Singular routes per `routes.md`.
> - KJV / WEB / ASV only.
> - No audio. No pastor workspace. No audience-specific pages. No premium tier.
> - "Shipped" = production click-through passes.

**Mode:** Full Write. Auto-merge to `main` on success.

**Prerequisite:** Batch R1 must be merged and production-clean before this batch starts.

---

## GOAL

Two locked decisions land on production:

1. Clicking a node on `/graph` opens a right-docked side panel showing summary, typed connections, and a "Open full page" link. The graph view itself never navigates away.
2. No node ships with fewer than 3 outgoing edges. Enforced at the Supabase layer via a `status` column, not relied on at the application layer.

---

## SCOPE

**Files:**
- `/graph` page component and its node-click handler
- New `src/components/graph/NodeSidePanel.tsx`
- `src/lib/supabase/nodes.ts` (or equivalent data-fetching layer) — switch to querying a filtered view

**Supabase:**
- Add `status` column (`draft` | `published`, default `draft`) to the canonical nodes table if missing
- Create a view `public_nodes` = `nodes WHERE status = 'published'`
- Any node currently with fewer than 3 outgoing edges is flipped to `draft` with an audit log

---

## WORK

### 1. Branch
`feature/graph-sidepanel-and-min3` off latest `main`.

### 2. Inspect current state
Read the current `/graph` page and identify the existing node-click behavior. Likely it's a `router.push()` call. Record what you find in `ark/batch-2-audit.md` before changing anything.

### 3. Side panel component
Build `<NodeSidePanel />`:

- 400px fixed width, docked to the right edge
- Slides in from the right on open (300ms transition), slides out on close
- Header: node name (large serif), type badge (colored by node type), book-accent color strip if the node is primarily associated with a single book
- Body sections:
  - **Summary** — first 150 chars of the node's description, no truncation of words mid-way
  - **Connections** — up to 8 typed edges, each rendered as a clickable chip showing target node name, edge type ("typologically prefigures", "located at", "attested by", etc.), and a one-line rationale if stored on the edge row
  - If the node has more than 8 edges, show a "See all N connections" link that opens the full page
- Footer: **Open full page →** button routing to the node's canonical page

**Behavior:**
- ESC closes
- Click outside the panel closes
- The graph stays fully interactive while the panel is open — zoom, pan, click another node (replaces panel content)
- URL state: on open, push `?focus={nodeId}` (no reload). On close, remove the param.
- Landing at `/graph?focus={nodeId}` opens the panel pre-populated.

### 4. Supabase schema change
Use the Supabase MCP to apply this migration. If `status` already exists, skip step (a).

```sql
-- Migration: add status column + publishing rule
ALTER TABLE nodes
ADD COLUMN IF NOT EXISTS status text
  NOT NULL
  DEFAULT 'draft'
  CHECK (status IN ('draft', 'published'));

CREATE INDEX IF NOT EXISTS idx_nodes_status ON nodes(status);

CREATE OR REPLACE VIEW public_nodes AS
SELECT * FROM nodes WHERE status = 'published';
```

(Adjust column names if the canonical table isn't called `nodes` — check first with a read-only query.)

### 5. Min-3-edge audit
Run this read-only query to identify nodes that need to be demoted:

```sql
SELECT n.id, n.name, n.type, COUNT(e.id) AS edge_count
FROM nodes n
LEFT JOIN edges e ON e.source_node_id = n.id
WHERE n.status = 'published'
GROUP BY n.id, n.name, n.type
HAVING COUNT(e.id) < 3;
```

For every row returned: `UPDATE nodes SET status = 'draft' WHERE id = ?`. Log every demotion to `ark/batch-2-audit.md` with the node's name, type, and current edge count.

**Important:** do not delete any nodes. Demotion only. Founder will author additional edges or explicitly republish later.

### 6. Wire the graph to the filtered view
Change the graph data fetcher from `SELECT ... FROM nodes` to `SELECT ... FROM public_nodes`. Same for the `NodeSidePanel`'s data fetcher.

### 7. Test locally
`npm run build` + `npm run lint` + `npx tsc --noEmit` all clean. Manually test the side panel in dev.

### 8. Auto-merge
Standard pattern:
```
git push --set-upstream origin feature/graph-sidepanel-and-min3
git checkout main && git pull --ff-only origin main
git merge --no-ff feature/graph-sidepanel-and-min3 -m "merge: graph side panel + min-3-edge rule"
git push origin main
```

### 9. Update ark
- `ark/STATUS.md` — move Batch 2 to decision log
- `ark/batch-2-audit.md` — list of demoted nodes (already written during step 5)

---

## DELIVERABLES

- Side panel live on `/graph`
- `status` column + `public_nodes` view in Supabase
- Audit log of demoted nodes in the vault
- `main` contains the merge

---

## ACCEPTANCE (click-through on mannafest.faith)

- [ ] Click any node on `/graph` — panel opens, graph stays visible and interactive
- [ ] ESC closes the panel; click-outside closes the panel
- [ ] URL updates to include `?focus={nodeId}` when panel is open
- [ ] Navigate directly to `mannafest.faith/graph?focus={some-known-node-id}` — panel is pre-opened on load
- [ ] "Open full page →" button from the panel navigates to the node's canonical page
- [ ] Abraham's panel shows at least 3 connections (or Abraham is demoted to draft and does not appear in the graph — either outcome is acceptable)
- [ ] `ark/batch-2-audit.md` exists and lists every node demoted

---

## OUT OF SCOPE

- Do not author new edges for nodes that would otherwise be demoted — demotion is the correct outcome this batch
- Do not change the graph aesthetic (node sizing, colors, physics)
- Do not integrate search into the side panel — later batch
- Do not change the `/characters/*`, `/places/*`, or other node pages — only the graph surface

---

## IF YOU HIT A BLOCKER

- The canonical nodes table has a different name than `nodes` → halt with `ark/batch-2-blocker.md` naming what you found
- Edges table column names differ from `source_node_id` / `id` → halt and name what you found
- The graph is rendered client-side with data hardcoded in a JSON file rather than queried from Supabase → halt and propose

Halt rule always applies: write the blocker file, stop, wait for Claude to resolve.
