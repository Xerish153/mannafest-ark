# Batch 2 — BLOCKER

**Batch:** 2 — Graph Side Panel + Min-3-Edge Rule
**Branch:** `feature/graph-sidepanel-and-min3` (created locally off `main` @ `1bf0a72`, no commits yet)
**Halted at:** Step 5 — Min-3-edge audit
**Halted by:** Cowork, per user instruction "if the audit would demote more than 20 nodes, halt with ark/batch-2-blocker.md and ask Marcus to confirm scope before bulk-updating status."
**Date:** 2026-04-20

---

## Why halted

The audit rule as written — "every node must have ≥3 outgoing edges, else demote to draft" — would flip **3,161 of 32,605 nodes (9.7 %)** to `draft` on apply. That's 158× the 20-node safety threshold.

No migration has been applied. No commit has been made. The branch is empty, `main` is untouched, Supabase is untouched.

---

## The numbers

```sql
SELECT count(*) FROM (
  SELECT n.id FROM graph_nodes n
  LEFT JOIN graph_edges e ON e.source_node_id = n.id
  GROUP BY n.id HAVING COUNT(e.id) < 3
) x;
-- → 3,161
```

### Breakdown by type (outgoing-edge rule, as prompt specifies)

| Type        | Total | Would demote | % demoted |
|-------------|------:|-------------:|----------:|
| commentary  | 1,190 |        1,190 |  **100 %** |
| theme       |   184 |          184 |  **100 %** |
| event       |     4 |            4 |  **100 %** |
| place       |     4 |            4 |  **100 %** |
| manuscript  |     1 |            1 |  **100 %** |
| person      |    58 |           33 |    57 %   |
| verse       | 31,107 |       1,744 |     5.6 % |
| prophecy    |    41 |            1 |     2.4 % |
| topic       |    15 |            0 |     0 %   |
| scholar     |     1 |            0 |     0 %   |
| **Total**   | 32,605 |       3,161 |     9.7 % |

### Same audit, but counting undirected edges (source OR target) — for comparison

| Type        | Total | Would demote | % demoted |
|-------------|------:|-------------:|----------:|
| commentary  | 1,190 |        1,190 |  **100 %** |
| theme       |   184 |          180 |    98 %   |
| event       |     4 |            4 |  **100 %** |
| place       |     4 |            4 |  **100 %** |
| manuscript  |     1 |            1 |  **100 %** |
| person      |    58 |           33 |    57 %   |
| verse       | 31,107 |         566 |     1.8 % |
| prophecy    |    41 |            1 |     2.4 % |
| **Total**   | 32,605 |       1,979 |     6.1 % |

Undirected counting doesn't save us either — the `commentary` and `theme` categories are still 100 % on the chopping block.

---

## What this is telling us

The audit rule assumes a graph model where every node has three outgoing typed edges to others. That fits **person**, **event**, **place**, **theme**, **prophecy** — nodes authored as hubs. It does **not** fit:

1. **Commentary nodes** — by data model, commentary is a *target* of an edge (book/chapter/verse → commentary) almost never a *source*. Every single one of the 1,190 commentary rows would vanish from the graph. Verified: Treasury of David, Matthew Henry, Calvin, Gill, and other PD commentary sets live here.
2. **Verse nodes with sparse outgoing cross-refs** — 1,744 of 31,107 verse rows have <3 outgoing edges. Obscure verses (genealogies, narrow OT passages) have 0–2 outgoing cross-references authored. They'd be demoted and disappear from `/graph`.
3. **Theme nodes** — 184 of 184 have <3 outgoing edges. Themes are usually the *target* of "thematic" edges from verses and events, not the source. Same structural problem as commentary.
4. **Recently-seeded types** (event 4/4, place 4/4, manuscript 1/1) — these were seeded in Chunk 2.1 with template pages but before any hand-authored edges land. Demoting them pre-authoring is cheap and reversible.

The **person** and **verse** categories are the only ones where the rule catches what it's intended to catch: nodes that haven't earned their place.

---

## Scope options for Marcus

### Option A — Per-type rule (recommended)
Keep the ≥3-outgoing invariant, but only enforce it on types the rule was authored for:

- **person**, **verse**, **prophecy**, **topic** — enforce ≥3 outgoing edges
- **commentary**, **theme**, **event**, **place**, **manuscript**, **scholar** — exempt from the outgoing rule; any invariant for these types gets a separate pass (likely "≥3 *incoming* edges" for commentary/theme and "has a ≥150-char description + 1 edge" for event/place/manuscript seeds).

Estimated demotion set under Option A: **~1,778** (1,744 verses + 33 persons + 1 prophecy). Still >>20, but the cut matches the rule's intent.

### Option B — Undirected ≥3 edges
Change the rule to "≥3 total edges (source OR target)" and enforce universally. Commentary still falls entirely — so this doesn't materially help without also carving out commentary/theme.

Estimated demotion set: **~1,979**. Not a good deal vs. A.

### Option C — Count threshold instead of flat ≥3
Demote only nodes with **0 outgoing edges**. Catches the "exists on paper, doesn't connect to anything" failure mode without touching nodes with 1–2 edges.

```sql
-- dry run
SELECT count(*) FROM (
  SELECT n.id FROM graph_nodes n
  LEFT JOIN graph_edges e ON e.source_node_id = n.id
  GROUP BY n.id HAVING COUNT(e.id) = 0
) x;
```
Not run yet — Cowork held off pending scope decision. Can run on request.

### Option D — Split the batch
Ship the schema change (`status` column + `public_nodes` view, all rows backfilled to `published`) and the side panel this week. Ship the audit/demotion rule as a separate Batch 2.1 once the per-type policy is decided.

### Option E — Author the rule out of scope entirely
Cap the batch at side panel + URL-focus state. Enforce min-3 at the application layer (hide nodes with <3 edges from the graph render) instead of at the data layer. Reversible, no destructive UPDATE.

---

## Recommendation

Option **A + D**: adopt a per-type rule, land the schema and side panel first, then run the demotion pass as Batch 2.1 with the per-type policy locked. That keeps this week's deliverable (the panel + URL state) on production and gives the audit the precision it needs.

If Marcus prefers a single-batch landing, Option A alone is fine — just confirm the ~1,778 demotion set is acceptable and Cowork resumes.

---

## What Cowork has NOT done (in case of rollback)

- No migration applied in Supabase (no `status` column, no `public_nodes` view, no index).
- No UPDATE statements issued on `graph_nodes`.
- No file changes in the repo — `NodeSidePanel.tsx` doesn't exist, `GraphClient.tsx` is untouched.
- No commits on `feature/graph-sidepanel-and-min3` — the branch ref points at `main`'s tip (`1bf0a72`) with zero diff.
- No pushes.

Rollback == no-op. Cowork is stopped cold.

---

## Ask

Marcus: pick A / B / C / D / E (or combo) and re-queue. Cowork will resume from the top of step 4 (Supabase migration) once the rule is locked.
