-- 045_scholars_commentary_columns.sql
-- Doctrine A / C prereq: add ranking + founder + tradition-key columns to scholars
-- so commentary auto-rank fallback and <TraditionChip /> have a clean source.
--
-- Keeps the existing free-text `tradition` column untouched (used by /authors/[slug]
-- author-profile copy). Introduces `tradition_key` as the enumerated tradition
-- mapped to the 10 Vision-v2 tradition tokens.
--
-- Applied to production 2026-04-22 via Supabase MCP.

ALTER TABLE scholars ADD COLUMN IF NOT EXISTS default_rank INTEGER NOT NULL DEFAULT 1000;
ALTER TABLE scholars ADD COLUMN IF NOT EXISTS is_founder   BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE scholars ADD COLUMN IF NOT EXISTS tradition_key TEXT
  CONSTRAINT scholars_tradition_key_chk CHECK (
    tradition_key IS NULL OR tradition_key IN
      ('reformed','patristic','jewish','evangelical','puritan','anglican','charismatic','academic','editor','modern-scholar')
  );

CREATE INDEX IF NOT EXISTS idx_scholars_default_rank ON scholars(default_rank);
CREATE INDEX IF NOT EXISTS idx_scholars_slug         ON scholars(slug);
