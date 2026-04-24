-- 046_scholars_seed_commentators.sql
-- Seed the 15 commentator rows Doctrine A needs into the existing `scholars` table.
-- 14 of the 15 are new (calvin, spurgeon, jfb, clarke, barnes, gill, wesley,
-- geneva, owen, chrysostom, augustine, bullinger, seiss, marc-mannafest).
-- 1 already exists: matthew-henry (updated to pick up new rank/tradition_key columns
-- without touching narrative bio or existing is_author_profile state).
--
-- marc-mannafest gets default_rank=50 + is_founder=true so auto-rank fallback
-- surfaces the founder's voice above sourced voices per Doctrine C.
--
-- Slug choices match src/lib/citations/scholars.ts (the repo source of record):
--   jfb, wesley, geneva, marc-mannafest — NOT the longer originals from the
--   Batch 4+5 prompt draft. If that changes, both the TS file and this row
--   change together.
--
-- Applied to production 2026-04-22 via Supabase MCP.

-- Promote slug to UNIQUE. Current data is 32/32 distinct slugs; enforce going forward.
DROP INDEX IF EXISTS idx_scholars_slug;
CREATE UNIQUE INDEX IF NOT EXISTS idx_scholars_slug_unique ON scholars(slug);

-- Upsert commentator rows.
-- ON CONFLICT only updates the ranking/founder/tradition_key columns so this
-- migration never clobbers narrative bio or author-profile state on rows that
-- already exist (e.g. Matthew Henry).
INSERT INTO scholars (slug, name, tradition, tradition_key, default_rank, is_founder, is_author_profile, bio)
VALUES
  ('calvin',         'John Calvin',               'Reformed',                 'reformed',    100, FALSE, FALSE, '[founder: write here]'),
  ('spurgeon',       'Charles Spurgeon',          'Reformed Baptist',         'puritan',     200, FALSE, FALSE, '[founder: write here]'),
  ('matthew-henry',  'Matthew Henry',             'Puritan / Presbyterian',   'puritan',     300, FALSE, TRUE,  '[keep existing bio]'),
  ('jfb',            'Jamieson, Fausset & Brown', 'Reformed',                 'reformed',    400, FALSE, FALSE, '[founder: write here]'),
  ('clarke',         'Adam Clarke',               'Methodist / Evangelical',  'evangelical', 500, FALSE, FALSE, '[founder: write here]'),
  ('barnes',         'Albert Barnes',             'Presbyterian / Evangelical','evangelical',600, FALSE, FALSE, '[founder: write here]'),
  ('gill',           'John Gill',                 'Reformed Baptist',         'reformed',    700, FALSE, FALSE, '[founder: write here]'),
  ('wesley',         'John Wesley (NT Notes)',    'Methodist / Evangelical',  'evangelical', 800, FALSE, FALSE, '[founder: write here]'),
  ('geneva',         'Geneva Bible Marginalia',   'Reformed',                 'reformed',    900, FALSE, FALSE, '[founder: write here]'),
  ('owen',           'John Owen',                 'Puritan',                  'puritan',    1000, FALSE, FALSE, '[founder: write here]'),
  ('chrysostom',     'John Chrysostom',           'Patristic / Eastern',      'patristic',  1000, FALSE, FALSE, '[founder: write here]'),
  ('augustine',      'Augustine of Hippo',        'Patristic / Western',      'patristic',  1000, FALSE, FALSE, '[founder: write here]'),
  ('bullinger',      'E. W. Bullinger',           'Dispensational',           'evangelical',1000, FALSE, FALSE, '[founder: write here]'),
  ('seiss',          'Joseph A. Seiss',           'Lutheran / Dispensational','evangelical',1000, FALSE, FALSE, '[founder: write here]'),
  ('marc-mannafest', 'Pastor Marc — MannaFest',   'Editor (MannaFest)',       'editor',       50, TRUE,  TRUE,  'MannaFest founder; sole editorial voice of this site. All Editor-tradition commentary and Editor''s Notes carry this attribution.')
ON CONFLICT (slug) DO UPDATE SET
  default_rank  = EXCLUDED.default_rank,
  tradition_key = EXCLUDED.tradition_key,
  is_founder    = EXCLUDED.is_founder;
