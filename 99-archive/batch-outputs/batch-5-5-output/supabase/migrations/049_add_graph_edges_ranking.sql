-- Batch 5.5 — Cross-reference ranking + founder override.
--
-- No dedicated cross_references table exists in this project; cross-references
-- live on graph_edges between graph_nodes of type='verse'. The Batch 5.5 prompt
-- explicitly anticipates this case ("Cross-references table named something
-- else — not a blocker; adjust and proceed"). Ranking columns go on graph_edges
-- and are meaningful for verse-to-verse edges; other edge types are unaffected
-- by leaving display_rank NULL for them. The backfill (migration 050) populates
-- display_rank for ALL edges by (source_node_id) partition ordered by weight,
-- which is harmless for non-verse edges and sets up the ranking signal for any
-- future reuse (VOTD related-verses, Batch 4.5).

ALTER TABLE graph_edges
  ADD COLUMN IF NOT EXISTS display_rank INT;

ALTER TABLE graph_edges
  ADD COLUMN IF NOT EXISTS founder_override BOOLEAN NOT NULL DEFAULT false;

-- Partial index for ranked lookups by source verse. The verse page's
-- "top-5 cross-references" query hits graph_edges WHERE source_node_id = X
-- AND display_rank IS NOT NULL, ordered by (founder_override DESC, display_rank ASC).
CREATE INDEX IF NOT EXISTS graph_edges_source_rank_idx
  ON graph_edges (source_node_id, display_rank)
  WHERE display_rank IS NOT NULL;

-- Secondary index for override lookups (admin panel lists overrides across the site).
CREATE INDEX IF NOT EXISTS graph_edges_founder_override_idx
  ON graph_edges (source_node_id)
  WHERE founder_override = true;

COMMENT ON COLUMN graph_edges.display_rank IS
  'Per-source-node ranking position (1 = top). NULL means never ranked. Backfilled from weight (migration 050). Admin UI rewrites this for founder_override=true rows.';

COMMENT ON COLUMN graph_edges.founder_override IS
  'When true, this edge has been pinned/reordered by the founder via /admin/cross-references/[verseId]. Sort order: founder_override DESC, display_rank ASC.';
