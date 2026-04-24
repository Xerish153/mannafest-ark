# Batch 8 (Retry) — JFB + Wesley Ingestion

**Branch:** `feat/batch-8-commentator-ingestion` (continue from 8.0 + halted 8.1) **Status:** staged; Cowork's work is done. Marcus applies Windows-direct. **Current prod baseline:** Matthew Henry 1,189 rows · Calvin 50 rows (Gen 1-50) **After this batch:** +1,189 JFB rows · +1,168 Wesley rows · 3 scholar UPDATEs

---

## What's staged here

```
batch-8-jfb-wesley-output/
├── tools/
│   ├── extract_jfb.py            (bs4, parses 66 JFB*.htm; → 1,189 chapters)
│   ├── build_jfb_sql.py          (→ 155 SQL batches, 10.78 MB)
│   ├── extract_wesley.py         (parses notes.doc / MS-Word-HTML; → 1,168 ch)
│   └── build_wesley_sql.py       (→ 153 SQL batches, 5.57 MB)
├── supabase/
│   ├── jfb-inserts/              (155 .sql files)
│   └── wesley-inserts/           (153 .sql files)
├── run_all.py                    (unified applier: --commentator cal|jfb|wes|all)
├── coverage_report.md            (per-book extraction audit + gaps)
└── README.md                     (this file)
```

## Prereqs on the Windows machine

```powershell
pip install "psycopg[binary]"

# Supabase Dashboard → Settings → Database → Connection string (Session mode, 6543)
$env:SUPABASE_DB_URL = "postgresql://postgres.ufrmssiqjtqfywthgpte:<PASSWORD>@<HOST>:6543/postgres"
```

## Apply sequence

### 1. Dry-run preview

```powershell
cd _ark\batch-8-jfb-wesley-output
python run_all.py --commentator jfb --dry-run
python run_all.py --commentator wesley --dry-run
```

Expected preview output (per commentator):
```
=== jfb ===
  SQL batch files to consider: 155
  [dry-run] would run scholar UPDATE:
    UPDATE scholars SET tradition = 'Evangelical', ...
  already-present rows in DB for jfb: 0
  [  1/155] 000_jfb_01_genesis_1_10.sql: would apply 10 rows (skip 0)
  ... 
  summary: kept=1189, skipped=0, batches_executed=0
```

### 2. Apply for real

```powershell
python run_all.py --commentator jfb
python run_all.py --commentator wesley
```

Idempotent: re-running skips rows already present. Runtime ~1 min for JFB, ~30 sec for Wesley over the pooler.

### 3. Optional — one-shot for everything (including any leftover Calvin)

```powershell
python run_all.py --commentator all
```

This also re-applies Calvin's scholar UPDATE (same corrections as 8.0), and processes any remaining Calvin batches still staged in `_ark/batch-8-0-output/supabase/calvin-inserts/` (skipping the 4 files already applied during the 8.0 MCP session).

## Post-apply verification (via Supabase MCP or SQL editor)

```sql
-- 1. Row counts per scholar
SELECT s.slug, s.name, s.tradition, s.primary_work_title,
       s.primary_work_years, COUNT(c.id) AS rows
FROM scholars s LEFT JOIN commentaries c ON c.scholar_id = s.id
WHERE s.slug IN ('matthew-henry', 'calvin', 'jfb', 'wesley')
GROUP BY s.id ORDER BY s.default_rank;

-- Expected:
--   calvin          Reformed                 817
--   jfb             Evangelical             1189  (was 0)
--   matthew-henry   Puritan / Presbyterian  1189
--   wesley          Evangelical             1168  (was 0)
```

```sql
-- 2. Multi-voice coverage summary
SELECT b.name, COUNT(DISTINCT s.slug) AS voices
FROM commentaries c
JOIN scholars s ON s.id = c.scholar_id
JOIN books b ON b.id = c.book_id
WHERE s.slug IN ('matthew-henry', 'calvin', 'jfb', 'wesley')
GROUP BY b.id, b.name
ORDER BY b.id;

-- Genesis-Revelation: each canonical book should show 3-4 voices
-- (3 where Calvin or Wesley or both skipped; 4 where all four wrote).
```

```sql
-- 3. NULL-body check
SELECT COUNT(*) FROM commentaries
WHERE scholar_id IN (
  SELECT id FROM scholars WHERE slug IN ('jfb', 'wesley')
) AND (commentary_text IS NULL OR length(commentary_text) < 50);
-- Should return 0
```

## Vercel preview click-through (5 verses)

Push the feature branch to trigger a preview deploy, then walk these:

1. **`/verse/genesis/1/1`** → Henry + Calvin + JFB + Wesley (four voices). Doctrine A featured = Calvin (rank 100), "Show other voices (3)" reveals Henry+JFB+Wesley. 50-word trim applies to all four.
2. **`/verse/isaiah/53/5`** → four voices. JFB + Calvin both feature OT's most-cited Christological chapter.
3. **`/verse/john/1/1`** → four voices. Wesley's NT notes on the Logos prologue is one of his stronger NT entries.
4. **`/verse/romans/8/31`** → four voices. Extends the 8.0 baseline test (was Henry+Calvin only).
5. **`/verse/psalms/23/1`** → Henry + JFB + Wesley (Calvin absent — Calvin's Psalms commentary was in a separate work, not the volumes ingested in 8.0). Good test that Doctrine A handles three-voice renders cleanly.

Also spot-check:
- **`/verse/2-john/1/1`** — Henry + Calvin absent + JFB + Wesley (3 voices). 2 John wasn't covered by Calvin; single-chapter render.
- **`/verse/proverbs/15/1`** — Henry + JFB (Wesley absent — he skipped Proverbs 11-30; Calvin didn't cover Proverbs in his core Commentaries). 2 voices. This is a legitimate 2-voice chapter.

## Known gaps (legitimate, NOT parse errors)

### JFB (3 short chapters)
JFB deliberately cross-referenced instead of writing fresh commentary:
- 2 Chronicles 18 (188c) — "See commentary on 1 Kings 22."
- Psalms 146 (171c) — short-and-direct exposition.
- Matthew 24 (184c) — "For the exposition, see on Mark 13."

### Wesley (21 chapters missing)
Wesley wrote selectively on parts of the OT:
- **Proverbs 11-30** (20 chapters) — Wesley's published OT Notes covered Proverbs 1-10 and 31 only.
- **2 Samuel 24** — not present in the source. Possibly a source-file omission; Wesley's full Notes should cover it, so this may be a re-staging gap.

Both are documented in `coverage_report.md` with evidence.

## Scholar UPDATEs applied

`run_all.py` runs these as idempotent first-statements (safe to re-run):

| slug | field | before | after |
|------|-------|--------|-------|
| calvin | primary_work_title | Commentaries (Calvin Translation Society edition) | same |
| calvin | primary_work_years | 1843–1855 | 1843-1855 (ASCII hyphen) |
| jfb | tradition | Reformed | **Evangelical** (canonical) |
| jfb | primary_work_title | Commentary Critical and Explanatory on the Whole Bible | same |
| jfb | primary_work_years | 1871 | same |
| wesley | tradition | Methodist / Evangelical | **Evangelical** (canonical) |
| wesley | primary_work_title | Explanatory Notes Upon the New Testament | **Notes on the Bible** |
| wesley | primary_work_years | 1754 | **1754-1766** |

(Prompt §Attribution model specifies these values. Corrections flagged in Batch 8.0 blocker for Calvin are already-aligned.)

## Artifacts archived for Spurgeon revisit (Batch 8.1, deferred)

None here. Spurgeon blocker still sits at `_ark/batch-8-1-blocker.md`; the treasury*.txt files staged at `/MannaFest/spurgeon-data/` are CCEL Images-Only distribution with zero prose. When Marcus re-stages from a text edition, the JFB/Wesley extraction pattern here generalizes (bs4 HTML parsing or plain-text verse-range detection depending on what Marcus lands).

## If something goes wrong

Rollback plan: the scholar UPDATEs and INSERT batches are independent. To remove either commentator's rows:

```sql
DELETE FROM commentaries WHERE scholar_id = (SELECT id FROM scholars WHERE slug = 'jfb');
DELETE FROM commentaries WHERE scholar_id = (SELECT id FROM scholars WHERE slug = 'wesley');
```

Scholar UPDATEs aren't destructive beyond changing display text — no data loss to worry about.

For a partial abort mid-apply: run_all.py's skip-list logic makes it safe to re-run. Any partial batch will leave DB in a consistent state because each INSERT batch is one `execute` call committed atomically.
