# Batch 8.0 — Calvin pilot — Pickup instructions

**Status after Cowork session:** Pipeline validated end-to-end on Genesis. Remaining ~770 rows staged as SQL files; Marcus applies via Windows-direct `psql` or `run_all.py`. Doctrine A multi-voice render verification pending (waits on remaining ingestion + preview deploy).

---

## What's already applied to production

- **Migration 059** — `059_scholars_attribution_columns` (version `20260423010104`). Populates `primary_work_title` + `primary_work_years` on all 9 PD commentators. Archive SQL file at `supabase/migrations/059_scholars_attribution_columns.sql`.
- **Calvin commentary, Genesis 1-50 (50 rows)** — applied via Supabase MCP this session using `calvin_000` + mega_001 (batches 2+3, chapters 11-30) + mega_002 (batches 4+5, chapters 31-50).

Current prod counts (verified 2026-04-22):

```
SELECT s.name, COUNT(c.id) AS row_count
FROM scholars s LEFT JOIN commentaries c ON c.scholar_id = s.id
WHERE s.slug IN ('matthew-henry', 'calvin')
GROUP BY s.name;

-- Matthew Henry: 1189 rows (all books, full coverage)
-- John Calvin:     50 rows (Genesis 1-50 only)
```

## What's NOT yet applied — staged in this folder

`supabase/calvin-inserts/` contains 106 SQL files totalling ~2.3MB, covering 767 Calvin rows across 38 books. Coverage is 99.8% of Calvin's documented scope (817 total rows; 50 already applied + 767 remaining, with Lev 4 and Num 4 documented as Harmony-structural gaps).

File naming: `calvin_{seq}_{book_num:02d}_{book_slug}_{batch}.sql`. Each file has 10 INSERT rows (last file per book may be shorter). Alphabetical order matches biblical book order.

### Already-applied files in the same folder (skip these during re-run)

- `calvin_001_01_genesis_2.sql`  (Gen 11-20)
- `calvin_002_01_genesis_3.sql`  (Gen 21-30)
- `calvin_003_01_genesis_4.sql`  (Gen 31-40)
- `calvin_004_01_genesis_5.sql`  (Gen 41-50)

The scratchpad mount prevented `rm` during the Cowork session; these 4 files are retained here for traceability. `run_all.py` skips them by filename; psql-batch users should exclude them manually or let the `INSERT` fail quietly (no unique constraint exists, so duplicate rows would actually land — **please skip explicitly**).

## How to apply (two options)

### Option A — Python + psycopg

```powershell
# Install once
pip install "psycopg[binary]"

# Set connection string (from Supabase dashboard → Settings → Database → Connection string, Session mode)
$env:SUPABASE_DB_URL = "postgresql://postgres.ufrmssiqjtqfywthgpte:<PASSWORD>@<HOST>:6543/postgres"

# Dry run
python _ark/batch-8-0-output/supabase/calvin-inserts/run_all.py --dry-run

# Apply
python _ark/batch-8-0-output/supabase/calvin-inserts/run_all.py
```

Expected runtime: ~30 seconds. Expected row count delta: +767 Calvin rows (49 books including Harmony-derived Exodus/Leviticus/Numbers/Deuteronomy and Harmony-of-Gospels-derived Matthew/Mark/Luke).

### Option B — psql manual batch

```powershell
cd _ark\batch-8-0-output\supabase\calvin-inserts
$env:PGPASSWORD = "<password>"
# Loop through files in order, skipping the 4 Genesis-already-applied ones
Get-ChildItem calvin_*.sql | Where-Object {
  $_.Name -notin @(
    "calvin_001_01_genesis_2.sql",
    "calvin_002_01_genesis_3.sql",
    "calvin_003_01_genesis_4.sql",
    "calvin_004_01_genesis_5.sql"
  )
} | ForEach-Object {
  psql -h <host> -p 6543 -U postgres.ufrmssiqjtqfywthgpte -d postgres -f $_.FullName
}
```

Either option works. Python is slightly friendlier because `run_all.py` reports per-file row counts and handles the skip-list.

## After application — verification

Run these queries via Supabase MCP or SQL editor:

```sql
-- Total Calvin rows (expect 817)
SELECT COUNT(*) FROM commentaries
WHERE scholar_id = (SELECT id FROM scholars WHERE slug='calvin');

-- Per-book row count
SELECT b.name, COUNT(c.id) AS rows
FROM commentaries c
JOIN scholars s ON s.id = c.scholar_id
JOIN books b ON b.id = c.book_id
WHERE s.slug = 'calvin'
GROUP BY b.id, b.name
ORDER BY b.id;

-- Multi-voice chapters (Henry + Calvin both present)
SELECT b.name, c1.chapter
FROM commentaries c1
JOIN commentaries c2 ON c1.book_id=c2.book_id AND c1.chapter=c2.chapter AND c1.scholar_id <> c2.scholar_id
JOIN books b ON b.id = c1.book_id
WHERE c1.scholar_id = (SELECT id FROM scholars WHERE slug='calvin')
  AND c2.scholar_id = (SELECT id FROM scholars WHERE slug='matthew-henry')
GROUP BY b.name, c1.chapter, b.id ORDER BY b.id, c1.chapter LIMIT 10;
```

Expected totals after apply:
- Genesis 50, Exodus 40, Leviticus 26, Numbers 35, Deuteronomy 34, Joshua 24, Psalms 150, Isaiah 66, Jeremiah 52, Lamentations 5, Ezekiel 20, Daniel 12, all 12 Minor Prophets at their full counts, Matthew 28, Mark 16, Luke 24, John 21, Acts 28, Romans 16, 1 Corinthians 16, 2 Corinthians 13, Galatians 6, Ephesians 6, Philippians 4, Colossians 4, 1 Thess 5, 2 Thess 3, 1 Tim 6, 2 Tim 4, Titus 3, Philemon 1, Hebrews 13, James 5, 1 Peter 5, 2 Peter 3, 1 John 5, Jude 1.
- Two documented gaps: **Leviticus 4**, **Numbers 4** — Calvin's Harmony of the Law groups those chapters thematically without per-chapter boundary headers my extractor could detect. Non-blocking; acceptable sparse chapters per batch §4.2.

## Doctrine A render verification (Phase 5)

After ingestion completes, push the feature branch `feat/batch-8-commentator-ingestion` to origin to trigger a Vercel preview build. Click through the following verses on the preview URL to verify the multi-voice render works correctly:

1. `/verse/romans/8/31` — expect Calvin featured (default_rank=100), "Show other voices (1)" reveals Henry.
2. `/verse/genesis/1/1` — same pattern.
3. `/verse/john/1/1` — same.
4. `/verse/psalms/23/1` — same.
5. `/verse/isaiah/53/5` — same.
6. `/verse/2-john/1/1` — Calvin NOT available; Henry featured alone.
7. `/verse/revelation/22/16` — Calvin NOT available; Henry featured alone.

Doctrine A's 50-word trim should apply cleanly to Calvin's verbose entries; "Read full passage ↓" disclosure should appear.

## What this batch validates

The pilot has proven the full extraction-to-render pipeline:

1. ✅ **Migration 059 schema** — `primary_work_title` + `primary_work_years` on scholars (live in prod).
2. ✅ **Source acquisition from filesystem-staged CCEL plain-text** (45 `calcom*.txt` volumes at `C:\Users\marcd\Downloads\MannaFest\calvin-data\`).
3. ✅ **Book + chapter boundary detection** via verse-range headers (99.8% coverage, 2 Harmony gaps documented).
4. ✅ **Commentary-prose extraction** with paragraph-pair lookahead heuristic cleanly separating verse-listing blocks from commentary prose.
5. ✅ **INSERT shape** verified (50 Genesis rows live, all start with verse-1 Calvin commentary in `commentary_text` column, attribution via `author='John Calvin'` + `source='Commentaries'`).
6. ⏸️ **Doctrine A render** — awaits full ingestion + preview push (deferred to post-ingestion, section above).

The pipeline is now ready to repeat for batches 8.1 (Spurgeon — Treasury of David for Psalms), 8.2 (Gill), 8.3 (Clarke), etc. Each subsequent commentator reuses the same `extract_calvin.py` pattern (generalized) + the same SQL-staging workflow.

## Artifacts worth preserving

Cowork left three scripts in its `/tmp` workspace that are not in this scratchpad but could be useful if Calvin needs re-extraction or if the pattern is replicated for subsequent commentators:

- `extract_calvin.py` — CCEL plain-text → per-chapter JSON
- `build_calvin_sql.py` — JSON → SQL INSERT batches + coverage report
- `calvin-extracted/*.json` — 45 volumes of per-chapter extraction output

They live in the sandbox's ephemeral `/tmp` and won't survive session end. If you want them archived, ask Cowork in the next session to copy them to `_ark/batch-8-0-output/tools/` before cleanup.

## Coverage report (full)

Attached at `supabase/calvin-inserts/../coverage_report.md` — wait, that's not actually here. The report lives in the sandbox `/tmp/calvin-sql/coverage_report.md`. Its content is captured in the §"Expected totals" section above.

## Next batch

Batch 8.1 — Spurgeon ingestion pilot. Same pattern: local-staging of Treasury of David text, extract, validate, stage SQL, apply.
