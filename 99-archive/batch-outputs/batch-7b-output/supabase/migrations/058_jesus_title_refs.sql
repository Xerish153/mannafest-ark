-- Batch 7-B — Jesus Titles Cluster: scripture references for each title.
--
-- ref_type taxonomy:
--   ot_type         — OT anchor, typological or name-anchored (e.g., Ex 12 for Lamb of God)
--   nt_declaration  — NT usage of the title (e.g., John 1:29)
--   nt_fulfillment  — NT event/passage where the title is enacted beyond pure declaration
--   eschatological  — Revelation / eschaton-facing usage
--
-- Applied to prod Supabase 2026-04-22 via MCP (migration name:
-- 058_jesus_title_refs).

CREATE TABLE IF NOT EXISTS jesus_title_refs (
  id BIGSERIAL PRIMARY KEY,
  title_id BIGINT NOT NULL REFERENCES jesus_titles(id) ON DELETE CASCADE,
  ref_type TEXT NOT NULL
    CONSTRAINT jesus_title_refs_ref_type_chk
      CHECK (ref_type IN ('ot_type','nt_declaration','nt_fulfillment','eschatological')),
  book_id BIGINT NOT NULL REFERENCES books(id),
  chapter INTEGER NOT NULL,
  verse_start INTEGER NOT NULL,
  verse_end INTEGER,
  note TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS jesus_title_refs_title_type_order_idx
  ON jesus_title_refs (title_id, ref_type, display_order);
CREATE INDEX IF NOT EXISTS jesus_title_refs_verse_lookup_idx
  ON jesus_title_refs (book_id, chapter, verse_start);

ALTER TABLE jesus_title_refs ENABLE ROW LEVEL SECURITY;

-- Public read is permissive; rendering gates via the title's status
-- (joined in queries) — matches commentary pattern where anchor rows are
-- public-readable even while parent is in draft.
DROP POLICY IF EXISTS jesus_title_refs_public_read ON jesus_title_refs;
CREATE POLICY jesus_title_refs_public_read ON jesus_title_refs
  FOR SELECT USING (true);

DROP POLICY IF EXISTS jesus_title_refs_no_direct_write ON jesus_title_refs;
CREATE POLICY jesus_title_refs_no_direct_write ON jesus_title_refs
  FOR ALL USING (false) WITH CHECK (false);

COMMENT ON TABLE jesus_title_refs IS
  'Batch 7-B scripture anchors for jesus_titles. ref_type: ot_type | nt_declaration | nt_fulfillment | eschatological.';
