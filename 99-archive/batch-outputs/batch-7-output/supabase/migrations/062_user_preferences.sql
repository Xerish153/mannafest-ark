-- 062_user_preferences.sql
-- Batch 7 — per-user reader preferences. Logged-in users persist here;
-- anonymous users mirror the same shape in localStorage under
-- "mannafest:prefs". Distinct from profiles.favorite_translation which is an
-- identity attribute — user_preferences is scoped to the reader surface.
--
-- Applied to production 2026-04-22 via Supabase MCP.

CREATE TABLE user_preferences (
  user_id               UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  reading_layer         TEXT NOT NULL DEFAULT 'distraction_free'
    CONSTRAINT user_preferences_reading_layer_chk
    CHECK (reading_layer IN ('distraction_free','sectioned')),
  preferred_translation TEXT NOT NULL DEFAULT 'KJV'
    CONSTRAINT user_preferences_preferred_translation_chk
    CHECK (preferred_translation IN ('KJV','WEB','ASV')),
  commentary_compressed BOOLEAN NOT NULL DEFAULT true,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS: user reads and writes only their own row. Service-role bypasses for
-- server-side operations.
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_preferences_self_read
  ON user_preferences
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY user_preferences_self_insert
  ON user_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY user_preferences_self_update
  ON user_preferences
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY user_preferences_self_delete
  ON user_preferences
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Anon clients get nothing — they mirror the same shape in localStorage.
CREATE POLICY user_preferences_anon_lockdown
  ON user_preferences
  FOR ALL
  TO anon
  USING (false)
  WITH CHECK (false);

CREATE OR REPLACE TRIGGER set_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE user_preferences IS
  'Batch 7 — Per-user reader preferences (reading_layer, preferred_translation, commentary_compressed). Logged-in users persist here via /api/user-preferences; anonymous users mirror the same shape in localStorage under "mannafest:prefs". Distinct from profiles.favorite_translation (identity attribute).';
