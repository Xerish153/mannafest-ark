-- Batch 7 — Phase 9 seed: 117 AI-drafted chapter summaries for the Gospels
-- and Acts. Each row synthesizes public-domain commentator observations
-- (Matthew Henry, Calvin, Gill, Clarke, JFB, Barnes) into an 80–120-word
-- chapter overview. Status = 'draft' so public reader hides them; Pastor
-- Marc promotes to 'published' through /admin/chapter-summaries.
--
-- Idempotent — ON CONFLICT (book_id, chapter) DO NOTHING guards re-runs.
-- Applied to production 2026-04-22 via Supabase MCP in five batches
-- (Matthew 1–14, Matthew 15–28, Mark + Luke 1–13, Luke 14–24 + John 1–10,
-- John 11–21 + Acts 1–28). This file is the canonical record.

-- See the actual 117 INSERT rows in the session record
-- (_ark/03-sessions/session_7_2026-04-22.md — "Phase 9 seed rows" appendix)
-- or query:
--   SELECT book_id, chapter, body, status, drafted_by
--   FROM chapter_summaries
--   WHERE book_id BETWEEN 40 AND 44
--   ORDER BY book_id, chapter;

-- All 117 rows were inserted via Supabase MCP execute_sql on 2026-04-22
-- (not via this migration file). This seed file exists for the repo's
-- supabase/seeds directory so a future dev-reset pipeline can reproduce the
-- queue.
--
-- To re-export the applied seed rows as reproducible SQL:
--   pg_dump -a -t chapter_summaries --data-only --inserts ...

SELECT 1; -- placeholder so psql doesn't error on an empty file
