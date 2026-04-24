-- 060_pericope_overrides.sql
-- Batch 7 — Pastor-Marc-authored section boundaries for sectioned-mode reader.
-- When rows exist for a chapter, <SectionedLayer /> uses them as the ordered
-- list of pericopes; when empty, the reader falls back to featured_page_refs
-- anchors as implicit section breaks, then to a single whole-chapter section.
--
-- Applied to production 2026-04-22 via Supabase MCP.

CREATE TABLE pericope_overrides (
  id          BIGSERIAL PRIMARY KEY,
  book_id     BIGINT NOT NULL REFERENCES books(id),
  chapter     INTEGER NOT NULL CHECK (chapter >= 1),
  verse_start INTEGER NOT NULL CHECK (verse_start >= 1),
  verse_end   INTEGER NOT NULL CHECK (verse_end >= verse_start),
  title       TEXT, -- optional section heading; null = untitled block
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_pericope_overrides_lookup
  ON pericope_overrides(book_id, chapter, display_order);

-- RLS: publicly readable (no status column — all rows are live edit authority).
-- Writes go through /api/admin/pericopes/[bookSlug]/[chapter] with service-role.
ALTER TABLE pericope_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY pericope_overrides_public_read
  ON pericope_overrides
  FOR SELECT
  USING (true);

CREATE POLICY pericope_overrides_no_direct_write
  ON pericope_overrides
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

CREATE OR REPLACE TRIGGER set_pericope_overrides_updated_at
  BEFORE UPDATE ON pericope_overrides
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE pericope_overrides IS
  'Batch 7 — Pastor-Marc-authored pericope (section) boundaries for sectioned-layer reader. Multiple rows per chapter form ordered sections via display_order. Fallback chain in <SectionedLayer />: overrides → featured_page_refs anchors → single whole-chapter section.';
