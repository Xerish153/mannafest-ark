-- Batch 6 — Featured-page verse anchors.

CREATE TABLE IF NOT EXISTS featured_page_refs (
  id BIGSERIAL PRIMARY KEY,
  featured_page_slug TEXT NOT NULL,
  featured_page_title TEXT NOT NULL,
  route_prefix TEXT NOT NULL DEFAULT '/study',
  book_id BIGINT NOT NULL REFERENCES books(id),
  chapter INTEGER NOT NULL,
  verse_start INTEGER NOT NULL,
  verse_end INTEGER,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS featured_page_refs_verse_lookup_idx
  ON featured_page_refs (book_id, chapter, verse_start);

CREATE INDEX IF NOT EXISTS featured_page_refs_slug_idx
  ON featured_page_refs (featured_page_slug);

ALTER TABLE featured_page_refs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS featured_page_refs_public_read ON featured_page_refs;
CREATE POLICY featured_page_refs_public_read ON featured_page_refs
  FOR SELECT USING (true);

DROP POLICY IF EXISTS featured_page_refs_no_direct_write ON featured_page_refs;
CREATE POLICY featured_page_refs_no_direct_write ON featured_page_refs
  FOR ALL USING (false) WITH CHECK (false);

COMMENT ON TABLE featured_page_refs IS
  'Verse anchors for shipped feature pages. <FeaturedStudiesOnVerse /> queries (book_id, chapter, verse_start <= N <= COALESCE(verse_end, verse_start)).';
