-- 048_editorial_notes.sql
-- Doctrine C §4.3: per-page Editor's Notes drawer. Markdown notes authored by
-- the founder (and only the founder) render on book hubs, chapter pages,
-- node pages, feature pages, apologetics/topic/apocrypha/extra-biblical hubs.
-- Notes are NOT rendered on verse pages (per-verse editor input flows through
-- the commentary surface as Editor-tradition entries instead).
--
-- Revisions snapshot the previous title+body on every explicit content save
-- (not auto-save, not unchanged saves) — handled in the API route.
--
-- Applied to production 2026-04-22 via Supabase MCP.

CREATE TABLE editorial_notes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  surface_type  TEXT NOT NULL
    CONSTRAINT editorial_notes_surface_type_chk CHECK (surface_type IN ('node','route')),
  surface_id    TEXT NOT NULL,
  title         TEXT,
  body_md       TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  status        TEXT NOT NULL DEFAULT 'published'
    CONSTRAINT editorial_notes_status_chk CHECK (status IN ('published','draft','hidden')),
  created_by    UUID NOT NULL REFERENCES auth.users(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_editorial_notes_surface ON editorial_notes(surface_type, surface_id, status);
CREATE INDEX idx_editorial_notes_order   ON editorial_notes(surface_type, surface_id, display_order);

CREATE TABLE editorial_notes_revisions (
  id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id  UUID NOT NULL REFERENCES editorial_notes(id) ON DELETE CASCADE,
  title    TEXT,
  body_md  TEXT NOT NULL,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  saved_by UUID NOT NULL REFERENCES auth.users(id)
);

CREATE INDEX idx_editorial_notes_revisions_note ON editorial_notes_revisions(note_id, saved_at DESC);

-- RLS policy matches the rest of the schema (search_log, trails, etc.).
-- Public reads published notes directly via the anon client.
-- All writes bypass RLS via server-side service-role (API routes enforce
-- requireSuperAdmin() against profiles.is_admin).
ALTER TABLE editorial_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY editorial_notes_public_read
  ON editorial_notes
  FOR SELECT
  USING (status = 'published');

CREATE POLICY editorial_notes_no_direct_write
  ON editorial_notes
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

-- Revisions: service-role only. No public read or write paths at all.
ALTER TABLE editorial_notes_revisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY editorial_notes_revisions_lockdown
  ON editorial_notes_revisions
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

-- updated_at trigger (set_updated_at() already exists in the schema).
CREATE OR REPLACE TRIGGER set_editorial_notes_updated_at
  BEFORE UPDATE ON editorial_notes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
