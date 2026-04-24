-- Batch 7-B — Jesus Titles Cluster: core titles table.
--
-- 17 rows to seed: Christ/Messiah, Son of God, Son of Man, Son of David,
-- Lamb of God, Logos, Suffering Servant, Second Adam, Great High Priest,
-- Immanuel, Alpha and Omega, I AM, Good Shepherd, King of Kings,
-- Bridegroom, Root of David / Lion of Judah, Bright Morning Star.
--
-- cluster_group taxonomy: identity | sacrificial_office | cosmic |
-- relational | royal | incarnational | i-am
--
-- Public reads gated by status='published'; admin writes via
-- /admin/titles/* under requireAdmin() gate.
--
-- Applied to prod Supabase 2026-04-22 via MCP (migration name:
-- 057_jesus_titles).

CREATE TABLE IF NOT EXISTS jesus_titles (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  original_language TEXT
    CONSTRAINT jesus_titles_original_language_chk
      CHECK (original_language IS NULL
             OR original_language IN ('hebrew','greek','aramaic')),
  original_text TEXT,
  transliteration TEXT,
  pronunciation TEXT,
  summary TEXT,
  origin_body TEXT,
  declaration_body TEXT,
  theological_meaning_body TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  cluster_group TEXT
    CONSTRAINT jesus_titles_cluster_group_chk
      CHECK (cluster_group IS NULL
             OR cluster_group IN ('identity','sacrificial_office','cosmic',
                                  'relational','royal','incarnational','i-am')),
  status TEXT NOT NULL DEFAULT 'draft'
    CONSTRAINT jesus_titles_status_chk CHECK (status IN ('draft','published')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS jesus_titles_status_order_idx
  ON jesus_titles (status, display_order);
CREATE INDEX IF NOT EXISTS jesus_titles_cluster_group_idx
  ON jesus_titles (cluster_group);

DROP TRIGGER IF EXISTS jesus_titles_set_updated_at ON jesus_titles;
CREATE TRIGGER jesus_titles_set_updated_at
  BEFORE UPDATE ON jesus_titles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE jesus_titles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS jesus_titles_public_read ON jesus_titles;
CREATE POLICY jesus_titles_public_read ON jesus_titles
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS jesus_titles_no_direct_write ON jesus_titles;
CREATE POLICY jesus_titles_no_direct_write ON jesus_titles
  FOR ALL USING (false) WITH CHECK (false);

COMMENT ON TABLE jesus_titles IS
  'Batch 7-B Jesus Titles Cluster. 17 rows. Public read when status=published; admin writes via /api/admin/titles/[slug].';
COMMENT ON COLUMN jesus_titles.cluster_group IS
  'Grouping tag used by /titles cluster hub grid visual.';
