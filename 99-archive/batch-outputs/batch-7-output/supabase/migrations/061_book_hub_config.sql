-- 061_book_hub_config.sql
-- Batch 7 — per-book hub overrides. book_slug is a TEXT identifier derived
-- from the book's URL form (e.g., "matthew", "mark") — not a FK because the
-- books table has no slug column today. The application resolves slug→book_id
-- via a static map in src/lib/bible/book-slugs.ts.
--
-- Defaults render without any rows in this table — an override row takes
-- precedence when present.
--
-- Applied to production 2026-04-22 via Supabase MCP.

CREATE TABLE book_hub_config (
  id                  BIGSERIAL PRIMARY KEY,
  book_slug           TEXT NOT NULL UNIQUE,
  signature_verse_id  BIGINT REFERENCES graph_nodes(id),
  intro_override      TEXT,
  featured_commentary_id UUID REFERENCES commentaries(id),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_book_hub_config_slug
  ON book_hub_config(book_slug);

-- RLS: publicly readable. Writes via /api/admin/book-hubs/[bookSlug] with
-- service-role.
ALTER TABLE book_hub_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY book_hub_config_public_read
  ON book_hub_config
  FOR SELECT
  USING (true);

CREATE POLICY book_hub_config_no_direct_write
  ON book_hub_config
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

CREATE OR REPLACE TRIGGER set_book_hub_config_updated_at
  BEFORE UPDATE ON book_hub_config
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE book_hub_config IS
  'Batch 7 — Per-book hub overrides for <BookHubLayout />. book_slug is the URL slug (e.g., "matthew"). signature_verse_id → graph_nodes(id) for the canonical verse rendered at hero scale; null falls through to book default (e.g., Matt 28:18-20 for Matthew). intro_override replaces default intro copy. featured_commentary_id overrides the default (chapter 1) for the book-level featured commentary.';
