-- 059_chapter_summaries.sql
-- Batch 7 — per-chapter summaries table. AI-drafted or pastor-marc-authored;
-- drafts stay private to the admin queue, published rows render at top of the
-- chapter reader. Matches the Doctrine D "no under construction" rule:
-- public never sees drafts (the summary block simply doesn't render).
--
-- Numbering note: prompt spec said 053 but 053 is the shipped
-- seed_featured_page_refs migration. Using next-consecutive-after-shipped
-- (058 was last shipped in Batch 7-B).
--
-- Applied to production 2026-04-22 via Supabase MCP.

CREATE TABLE chapter_summaries (
  id          BIGSERIAL PRIMARY KEY,
  book_id     BIGINT NOT NULL REFERENCES books(id),
  chapter     INTEGER NOT NULL CHECK (chapter >= 1),
  body        TEXT,
  status      TEXT NOT NULL DEFAULT 'draft'
    CONSTRAINT chapter_summaries_status_chk
    CHECK (status IN ('draft','published')),
  drafted_by  TEXT, -- e.g., 'ai', 'pastor_marc', 'ai+pastor_marc'
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (book_id, chapter)
);

CREATE INDEX idx_chapter_summaries_book_chapter
  ON chapter_summaries(book_id, chapter);

CREATE INDEX idx_chapter_summaries_status
  ON chapter_summaries(status);

-- RLS: published rows are publicly readable; no direct writes.
-- Admin surfaces hit /api/admin/chapter-summaries/[summaryId] which bypasses
-- RLS via service-role and enforces requireSuperAdmin().
ALTER TABLE chapter_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY chapter_summaries_public_read_published
  ON chapter_summaries
  FOR SELECT
  USING (status = 'published');

CREATE POLICY chapter_summaries_no_direct_write
  ON chapter_summaries
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

CREATE OR REPLACE TRIGGER set_chapter_summaries_updated_at
  BEFORE UPDATE ON chapter_summaries
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE chapter_summaries IS
  'Batch 7 — Per-chapter summaries. Drafts populated by AI synthesis from PD commentators (Matthew Henry, Calvin, Gill, Clarke, JFB, Barnes) for Pastor Marc review; published rows render at top of chapter reader via <ChapterSummaryBlock />. Empty-state rule: public never sees drafts.';
