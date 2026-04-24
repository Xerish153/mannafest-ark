-- Batch 6 — Verse of the Day reflections.
--
-- Doctrine D / Vision v2 §4.7 VOTD schema. The pre-existing
-- `verse_of_the_day` table (day_of_year keyed, verse_reference text) is
-- left in place non-destructively; the new code reads exclusively from
-- `votd_reflections`. A later hygiene batch may retire the old table.
--
-- verse_id references graph_nodes(id) — every verse is a graph_nodes row
-- with type='verse' in this project (Batch 5.5 audit).

CREATE TABLE IF NOT EXISTS votd_reflections (
  id BIGSERIAL PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  verse_id BIGINT NOT NULL REFERENCES graph_nodes(id),
  body TEXT,
  status TEXT NOT NULL DEFAULT 'draft'
    CONSTRAINT votd_reflections_status_chk CHECK (status IN ('draft', 'published')),
  fallback_scholar_id UUID REFERENCES scholars(id),
  fallback_quote TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS votd_reflections_status_date_idx
  ON votd_reflections (status, date);

DROP TRIGGER IF EXISTS votd_reflections_set_updated_at ON votd_reflections;
CREATE TRIGGER votd_reflections_set_updated_at
  BEFORE UPDATE ON votd_reflections
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE votd_reflections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS votd_reflections_public_read ON votd_reflections;
CREATE POLICY votd_reflections_public_read ON votd_reflections
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS votd_reflections_no_direct_write ON votd_reflections;
CREATE POLICY votd_reflections_no_direct_write ON votd_reflections
  FOR ALL USING (false) WITH CHECK (false);

COMMENT ON TABLE votd_reflections IS
  'Doctrine D / Vision v2 §4.7 Verse of the Day reflections. One row per calendar day. Public read when status=published; admin writes via /api/admin/votd/[date].';
COMMENT ON COLUMN votd_reflections.verse_id IS
  'graph_nodes.id of the verse node (type=verse).';
