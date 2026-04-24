-- 047_commentaries_curation_columns.sql
-- Doctrine A render spec: add curation columns to the existing `commentaries` table
-- (1189 Matthew Henry rows today, chapter-level — one row per chapter, verse_start=1
-- and verse_end=null across the board) so the verse-page CommentarySection can
-- render featured excerpts, "show other voices" disclosure, editor-curator notes,
-- and hide pruned entries without deleting them.
--
-- Verse addressing stays on the existing (book_id, chapter, verse_start) tuple —
-- introducing a verse_id FK is deferred to a future hygiene batch so this batch
-- doesn't fan out into verse-table cleanup. Pastor Marc's future per-verse founder
-- notes simply use verse_start=N for the specific verse (instead of verse_start=1
-- that sourced rows use for chapter-level commentary).
--
-- Applied to production 2026-04-22 via Supabase MCP.

-- FK to scholars. NULL-first so the backfill runs.
ALTER TABLE commentaries ADD COLUMN IF NOT EXISTS scholar_id UUID REFERENCES scholars(id);

-- Curation columns.
ALTER TABLE commentaries ADD COLUMN IF NOT EXISTS featured         BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE commentaries ADD COLUMN IF NOT EXISTS featured_excerpt TEXT
  CONSTRAINT commentaries_featured_excerpt_chk CHECK (featured_excerpt IS NULL OR char_length(featured_excerpt) <= 400);
ALTER TABLE commentaries ADD COLUMN IF NOT EXISTS founder_curated  BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE commentaries ADD COLUMN IF NOT EXISTS author_type      TEXT NOT NULL DEFAULT 'sourced'
  CONSTRAINT commentaries_author_type_chk CHECK (author_type IN ('sourced','founder'));
ALTER TABLE commentaries ADD COLUMN IF NOT EXISTS status           TEXT NOT NULL DEFAULT 'published'
  CONSTRAINT commentaries_status_chk CHECK (status IN ('published','hidden'));
ALTER TABLE commentaries ADD COLUMN IF NOT EXISTS curator_note     TEXT;
ALTER TABLE commentaries ADD COLUMN IF NOT EXISTS curated_at       TIMESTAMPTZ;
ALTER TABLE commentaries ADD COLUMN IF NOT EXISTS curated_by       UUID REFERENCES auth.users(id);

-- Backfill scholar_id from the existing free-text author column.
-- Verified: all 1189 rows have author='Matthew Henry' exactly.
UPDATE commentaries c
SET scholar_id = (SELECT id FROM scholars WHERE slug = 'matthew-henry')
WHERE c.scholar_id IS NULL AND c.author = 'Matthew Henry';

-- Require scholar_id going forward.
ALTER TABLE commentaries ALTER COLUMN scholar_id SET NOT NULL;

-- Indexes for verse-page queries + curation filters.
CREATE INDEX IF NOT EXISTS idx_commentaries_verse_status
  ON commentaries (book_id, chapter, verse_start, status);
CREATE INDEX IF NOT EXISTS idx_commentaries_scholar
  ON commentaries (scholar_id);
CREATE INDEX IF NOT EXISTS idx_commentaries_featured
  ON commentaries (book_id, chapter, verse_start) WHERE featured = TRUE;
