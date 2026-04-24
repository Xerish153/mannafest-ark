-- Batch 5.5 — Backfill graph_edges.display_rank.
--
-- Ranks every edge within its (source_node_id) partition by weight DESC,
-- then target_node_id ASC as a stable tiebreaker. Non-verse edges get ranks
-- too (cheap, consistent, harmless — the render layer only reads ranks from
-- verse-to-verse edges).
--
-- All rows remain founder_override=false per the default; no override rows
-- are created by this backfill.
--
-- Applied via MCP 2026-04-22. Production graph_edges count at backfill time:
-- 1,301,311 rows, all populated. Marcus can re-run by reverting to NULL on a
-- row first; the UPDATE is idempotent via IS DISTINCT FROM.

WITH ranked AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY source_node_id
      ORDER BY weight DESC NULLS LAST, target_node_id ASC
    ) AS rn
  FROM graph_edges
)
UPDATE graph_edges ge
SET display_rank = ranked.rn
FROM ranked
WHERE ge.id = ranked.id
  AND ge.display_rank IS DISTINCT FROM ranked.rn;
