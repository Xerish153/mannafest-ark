-- Migration 059 — Add per-scholar attribution columns
-- Per Batch 8 blocker resolution: attribution lives once per scholar,
-- not per row. Mirrors existing scholars.tradition denormalization.
--
-- NOTE: This migration was applied to production Supabase via MCP
-- prior to Batch 8.0's Cowork session (applied_at = 2026-04-23 01:01:04 UTC,
-- migration version 20260423010104). This .sql file is the repo archive
-- so the code repo's migrations folder matches production state. No
-- additional DB action is needed from this file; it exists so Marcus's
-- Windows-direct pull can commit it alongside the rest of Batch 8.0.

ALTER TABLE scholars
  ADD COLUMN primary_work_title TEXT,
  ADD COLUMN primary_work_years TEXT;

-- Populate Calvin's row (ingestion target for Batch 8.0)
UPDATE scholars
SET primary_work_title = 'Commentaries (Calvin Translation Society edition)',
    primary_work_years = '1843–1855'
WHERE slug = 'calvin';

-- Populate other PD commentator rows for completeness
-- (subsequent 8.x batches will use these values via JOIN; populating now
--  is cheap and keeps schema work in one migration)
UPDATE scholars
SET primary_work_title = 'Treasury of David',
    primary_work_years = '1870–1885'
WHERE slug = 'spurgeon';

UPDATE scholars
SET primary_work_title = 'Exposition of the Old and New Testaments',
    primary_work_years = '1748–1766'
WHERE slug = 'gill';

UPDATE scholars
SET primary_work_title = 'The Holy Bible with a Commentary and Critical Notes',
    primary_work_years = '1810–1826'
WHERE slug = 'clarke';

UPDATE scholars
SET primary_work_title = 'Notes on the New Testament + Notes on the Old Testament (partial)',
    primary_work_years = '1832–1851'
WHERE slug = 'barnes';

UPDATE scholars
SET primary_work_title = 'Commentary Critical and Explanatory on the Whole Bible',
    primary_work_years = '1871'
WHERE slug = 'jfb';

UPDATE scholars
SET primary_work_title = 'Explanatory Notes Upon the New Testament',
    primary_work_years = '1754'
WHERE slug = 'wesley';

UPDATE scholars
SET primary_work_title = 'Geneva Bible marginal notes',
    primary_work_years = '1599'
WHERE slug = 'geneva';

-- Henry already has populated source per Batch 4+5; populate the new columns
-- for consistency
UPDATE scholars
SET primary_work_title = 'Matthew Henry''s Commentary on the Whole Bible',
    primary_work_years = '1708–1714'
WHERE slug = 'matthew-henry';
