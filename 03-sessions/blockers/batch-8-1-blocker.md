---
batch: batch-8-1-spurgeon-ingestion
status: HALTED — Phase 1 discovery; staged treasury files contain no extractable Spurgeon text
session: 2026-04-22 (Cowork)
halted_before: any extract_spurgeon.py work, any SQL staging, any scholar UPDATE
parent_prompt: (pasted into Cowork; no committed file at _ark/04-prompts/batch_8_1_*.md)
prior_session: [[session_8-0_2026-04-22]]
related: [[batch-8-0-blocker]] [[Spurgeon]] [[Calvin]]
---

# Batch 8.1 — Spurgeon — Phase 1 BLOCKER

## Why this halted (minimum question needed to resume)

**The staged treasury files are CCEL's "Images Only" distribution, not the ThML text extraction.** They contain no Spurgeon commentary text to ingest — only page-image references, index entries, and footnote URLs.

**Smallest question for Marcus:** please re-stage from CCEL's *text* edition of Treasury of David (or from another PD text source). The Calvin-style plain-text ThML format is what the proven extractor pattern requires.

## What I was trying to do

§WORK Phase 1 step 4: "Open each of the 6 Spurgeon files and sample the first 200 lines of treasury1.txt and the last 200 of treasury6.txt." Then confirm Psalm boundary format, all 150 Psalms present, no front-matter issues.

## What I found

### The tell, right at the top of every file

```
     __________________________________________________________________

           Title: Treasury of David: Volume I
      Creator(s): Spurgeon, Charles Haddon (1834-1892)
     Print Basis: New York: Marshall Brothers, Ltd., (1869)
          Rights: Public Domain
   CCEL Subjects: All; Images Only;      ← this line
      LC Call no: BS1430
```

Compare the Calvin file header that the 8.0 pipeline successfully ingested:

```
     __________________________________________________________________

         Title: Commentary on Genesis - Volume 1
    Creator(s): Calvin, John (1509-1564)
```

Calvin's files are normal ThML text extractions. Spurgeon's are marked **`CCEL Subjects: All; Images Only;`** — CCEL's code for distributions that exclude the ThML text and distribute only page-image references.

### Contents of all 6 files, exhaustively

Across `treasury1.txt` through `treasury6.txt` (331,706 bytes total):

| File | Bytes | Image-of-page placeholders + index/URL noise lines | Non-noise content lines |
|---|---|---|---|
| treasury1.txt | 50,885 | 841 | 9 (metadata only) |
| treasury2.txt | 57,877 | 970 | 9 (metadata only) |
| treasury3.txt | 58,436 | 982 | 9 (metadata only) |
| treasury4.txt | 56,178 | 952 | 9 (metadata only) |
| treasury5.txt | 52,386 | 952 | 9 (metadata only) |
| treasury6.txt | 55,944 | 931 | 9 (metadata only) |

The 9 non-noise lines per file are just the title-block metadata (Title / Creator / Print Basis / Rights / CCEL Subjects / LC Call no / LC Subjects labels).

**Grep for classic Spurgeon phrases across all 6 files — zero matches:**

```
grep -cEi "(shepherd|blessed is|exposition|hints to the village|quaint sayings|selah|jehovah)" treasury*.txt
# → 0 / 0 / 0 / 0 / 0 / 0
```

Everything else in each file is one of:
- `   Image of page N` placeholders (e.g., `Image of page 367`, `Image of page 368`, ...)
- Index lines mapping image numbers to page numbers: `[1]i  [2]ii  [3]iii  [4]iv  ...`
- Footnote-style URL references back to CCEL HTML anchors: `400. file:///ccel/s/spurgeon/treasury1/cache/treasury1.html3#i.xxvii-Page_388`
- Horizontal-rule separator lines (`__________________________________________________________________`)

No verse commentary. No Psalm headings. No prose. Nothing for the extractor to detect.

### Reality check on file size

The prompt flagged 0.3 MB total as "~0.3 MB total" expected. Calvin's 45 plain-text volumes are 61 MB combined. Treasury of David in print is ~3,500 pages across 7 volumes — a comparable text extraction should land in the 5-10 MB range, not 0.3 MB. The 0.3 MB size is a signal that what was staged is the image-manifest edition, not the text edition.

## What I did NOT do

- Did not create `_ark/batch-8-1-output/` or any subdirectories.
- Did not write `extract_spurgeon.py`, `build_spurgeon_sql.py`, `run_all.py`, `README.md`, `coverage_report.md`.
- Did not execute any `INSERT` or `UPDATE` against Supabase (Cowork is staging-only per §Phase 7 anyway).
- Did not write any session record.
- Did not write the Spurgeon scholar node (nothing substantively new to add yet).
- Did not fabricate Spurgeon text from training knowledge to make a partial pipeline "work" — that would violate OPERATING_RULES §3 ("No AI-authored historical or theological claims. Every substantive claim traces to a cited source").
- Did not attempt WebFetch to CCEL for the text edition — CCEL is egress-blocked (confirmed in prior batch-8-0 blocker), and my environment forbids bash/python HTTP workarounds.

Only writes this session: this blocker file.

## What I verified as read-only-OK (still useful for when we resume)

MCP read-only queries confirmed pre-flight state for the scholar + book:

```sql
SELECT id, slug, name, tradition, tradition_key, default_rank,
       primary_work_title, primary_work_years
FROM scholars WHERE slug = 'spurgeon';
-- → id: 21b89dfb-ec6d-46dc-acc2-801835f7f2a8
--    name: Charles Spurgeon
--    tradition: 'Reformed Baptist'         ← prompt expects 'Puritan'; needs UPDATE
--    tradition_key: 'puritan'              ← already correct
--    default_rank: 200
--    primary_work_title: 'Treasury of David'  ← already correct
--    primary_work_years: '1870–1885'       ← prompt's §Scope says '1865-1885'

SELECT id, name FROM books WHERE name = 'Psalms';
-- → id: 19
```

Two small corrections Marcus's Phase 4 UPDATE will apply when the ingestion resumes:

1. `tradition = 'Puritan'` (currently `'Reformed Baptist'`) — prompt §WORK Phase 1 explicitly says to correct this.
2. `primary_work_years = '1865-1885'` (currently `'1870–1885'`) — prompt §Scope specifies `'1865-1885'` with ASCII hyphen; current DB value is an en-dash. Note: Treasury of David's publication span is historically ~1865–1885 (7 volumes over 20 years), so `'1865-1885'` is the more accurate value.

These aren't blockers — just heads-up for when the real text edition lands.

## Proposed resolutions (Marcus picks one)

### Option A — Re-stage from CCEL text edition (matches Calvin pattern)

CCEL distributes Treasury of David in both "Images Only" and text form. The text edition URLs follow the pattern `https://ccel.org/ccel/spurgeon/tod.xml` or similar (CCEL's `work > download > text formats`). Marcus downloads the plain-text version, unpacks into `C:\Users\marcd\Downloads\MannaFest\spurgeon-data\` (replacing the current image-only files), and Cowork resumes with no pipeline changes needed — the `extract_calvin.py` heuristic (verse-range header → chapter boundary, paragraph-pair lookahead for commentary-start detection) generalizes cleanly to Treasury's `PSALM I.` / `PSALM 1.` style headers.

**Expected text-edition size:** ~5-10 MB total. If the re-staged files are still under 1 MB, that's a signal they're still the image-only edition.

### Option B — Re-stage from Project Gutenberg or CCEL alternate

Project Gutenberg also hosts Treasury of David (search for author "Charles Haddon Spurgeon"). Gutenberg's plain-text format is different from CCEL ThML (less structured, more prose-flow) — the extractor pattern still works but may need a tweaked regex for the Psalm-header format. Acceptable fallback if CCEL text is unavailable.

### Option C — Skip Spurgeon; pick up with Batch 8.2 (Gill)

If Treasury of David text isn't recoverable quickly, advancing to Gill (8.2) keeps Wave A moving. Gill's *Exposition of the Old and New Testaments* is available on CCEL as text (not images-only), and covers Psalms plus every other book. Spurgeon returns as a later sub-batch when the source staging is fixed.

### What I would NOT do

- Fabricate Spurgeon exposition from training knowledge. Violates §3 non-negotiables and OPERATING_RULES. Halting is correct.
- Extract text from the image-page URLs (images aren't reachable, and even if they were I have no OCR pipeline and it would be out-of-scope).
- Substitute Henry's Psalm commentary under Spurgeon's name. Same reason.
- Stage empty/placeholder rows to make the pipeline appear to run. Misleading and wastes review cycles.

## What Marcus needs to decide

Short path:
1. Confirm where CCEL distributes the *text* Treasury (if it exists — some CCEL works only come as images).
2. Pick Option A (re-stage CCEL text), B (Gutenberg), or C (advance to Gill).
3. If A or B: drop the new files at the same path `/MannaFest/spurgeon-data/`, ping Cowork to resume.
4. If C: paste a Batch 8.2 Gill prompt whenever ready.

While you're investigating, nothing is broken on the live site — Calvin 50 Genesis rows are fine in prod, and no Spurgeon INSERT was even attempted.

## Related

[[session_8-0_2026-04-22]] · [[batch-8-blocker]] · [[batch-8-0-blocker]] · [[Calvin]] · [[Spurgeon]]
