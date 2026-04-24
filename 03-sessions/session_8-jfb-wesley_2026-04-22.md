---
batch: batch-8-jfb-wesley-ingestion
status: STAGED — JFB + Wesley extraction, SQL batches, unified runner ready for Marcus' Windows-direct apply
session: 2026-04-22 (Cowork)
parent_prompt: (pasted into Cowork; Batch 8 retry supersedes halted 8.1 Spurgeon)
prior_sessions: [[session_8-0_2026-04-22]]
prior_blockers: [[batch-8-0-blocker]] (resolved) · [[batch-8-1-blocker]] (deferred, Spurgeon source issue)
scratchpad: _ark/batch-8-jfb-wesley-output/
---

# Batch 8 (Retry) — JFB + Wesley — session record

[[batch-8-0-output]] [[JFB]] [[Wesley]] [[Calvin]] [[commentaries]] [[scholars]]

## TL;DR

Staged 2,357 commentary rows (1,189 JFB whole-Bible + 1,168 Wesley NT-complete + OT-partial) with matching SQL batch files and a unified Windows-direct applier. Pipeline proven in 8.0 generalizes cleanly: `extract_jfb.py` parses CCEL HTML via bs4, `extract_wesley.py` parses MS-Word-HTML (notes.doc is actually `<html xmlns:v=...>` Word-export, not binary OLE) using ThML `div2`/`div3` class navigation. Three scholar UPDATEs folded into `run_all.py --commentator {cal|jfb|wes|all}` as idempotent first statements. Two legitimate-gap categories documented in `coverage_report.md`: JFB has 3 deliberate cross-reference chapters (e.g., Matt 24 → Mark 13); Wesley has 21 OT gaps (20 in Proverbs where Wesley only covered ch 1-10 + 31; 1 in 2 Sam 24). No MCP writes this session — all DB changes are queued for Marcus' Windows-direct apply.

## Phase-by-phase log

### Phase A-0 — Source verification + environment

Grep-checks mirrored the diagnostic that caught 8.1's Spurgeon halt:

- **JFB** (`/MannaFest/jfb-data/`): 72 files, 19 MB. JFB01.htm (Genesis): 7 hits for `in the beginning|God created|firmament|garden of Eden`. JFB66.htm (Revelation): 92 hits for `Apocalypse|seven churches|Patmos|John.+Alpha|Lamb.+slain`. Real prose, no image-only trap. Standard CCEL HTML with `<A NAME="ChapterN">` anchors.
- **Wesley** (`/MannaFest/wesley-data/notes.doc`): 7.4 MB. First 64 bytes: `<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:word"...`. This is MS Word's "Save As Web Page" export — valid HTML despite the `.doc` extension. 1,242 hits for distinctive Wesley content words.
- **Env**: bs4 4.14.3 + lxml 6.0.2 available. No textract / olefile / antiword needed because Wesley's file is HTML, not binary.
- **Scholars MCP read** (read-only): JFB row `tradition='Reformed'` (needs UPDATE to `'Evangelical'`), Wesley row `tradition='Methodist / Evangelical'` (needs UPDATE to `'Evangelical'`), `primary_work_years='1754'` (needs UPDATE to `'1754-1766'`), `primary_work_title='Explanatory Notes Upon the New Testament'` (needs UPDATE to `'Notes on the Bible'` since this batch ingests both testaments).

### Phase A — JFB

**`extract_jfb.py`**. 66 book-file mapping to `public.books.id` (Protestant canon 1..66). bs4 with lxml parser. Chapter-anchor regex `^Chapter(\d+)$` against `<A NAME=...>` values. Document-order slicing between anchors to collect each chapter's sibling nodes. Single-chapter-book fallback: when a file has no `ChapterN` anchors (JFB63/64/65 — 2 John / 3 John / Jude), walk from the `Introduction` anchor forward, treat entire body as chapter 1, strip the leading "INTRODUCTION" heading + the front-of-file "Notice / public-domain / title block" boilerplate.

HTML cleanup: strip `<table>` (nav), `<script>`/`<style>`/`<meta>`/`<head>`, the chapter-index CENTER block (matches `\(?\d+\)?` repeats). Preserve `<p>` boundaries as `\n\n`, drop external `<a href>` but keep the visible reference text, decode `&nbsp;` → space, collapse runs of blank lines.

**Output**: 1,189 chapters across 66 books, 10.78 million characters. Three flagged short chapters verified as legitimate cross-references (2 Chr 18 → 1 Ki 22, Ps 146 short devotional, Mt 24 → Mk 13).

**`build_jfb_sql.py`**: 155 `.sql` files, one book's chapters split into 10-row batches. Hardcoded `scholar_id='6d360491-df42-43ef-881e-b7413dcfd878'::uuid` from the pre-flight MCP query. Per-row source = `'Commentary Critical and Explanatory'`. `verse_reference = '{book_slug}-{chapter}'` mirroring Henry's `genesis-1` convention. `featured=false`, `founder_curated=false`, `author_type='sourced'`, `status='published'` — curation is Batch 8.9's domain.

No body truncation. JFB is concise-by-design (~2000 words/chapter avg) — well within Henry's existing 50K-char per-row precedent.

### Phase B — Wesley

**`extract_wesley.py`**. Parses notes.doc with bs4. Navigation uses ThML-derived CSS classes:

- `class="div2"` (70 elements) = book-level. Filter to those starting with "NOTES" (excludes PREFACE + Indexes). Map heading text → canonical book_id via regex pattern list.
- `class="div3"` (1,233 elements) = chapter-level. Three chapter-number formats observed:
  - Roman numerals (most books): `I`, `II`, ..., `LII`.
  - Arabic numerals (Psalms only): `1`, `2`, ..., `150`.
  - `Commentary on {Book}` (single-chapter Obadiah fallback).

**Two bugs found and fixed in the pattern list**:
1. LAMENTATIONS must precede JEREMIAH in `BOOK_PATTERNS` because Wesley's Lam h2 reads "NOTES ON THE LAMENTATIONS OF JEREMIAH" and would otherwise fall through to the JEREMIAH pattern.
2. Initial extraction missed 3 books (Psalms, Lamentations, Obadiah) due to the above order bug + chapter-format assumptions. Second-pass extraction caught everything.

**Output**: 1,168 chapters across 66 books (260 NT + 908 OT), 5.57 million characters. Complete NT coverage (matches Henry/JFB's 260 NT chapters). OT coverage is Wesley's historically selective set:

| Wesley OT gap | Missing | Why |
|---|---|---|
| Proverbs 11-30 | 20 ch | Wesley's published OT Notes covered Proverbs 1-10 + 31 only |
| 2 Samuel 24 | 1 ch | Not present in the staged source; may be a re-staging gap worth flagging |

Four Wesley short chapters (< 200 chars) — all legitimate outline-only entries, not parse errors: 1 Chr 14 (outline), Ps 100 / 117 / 128 (short-text psalms).

**`build_wesley_sql.py`**: 153 `.sql` files. Per-row source is testament-specific: `'Explanatory Notes Upon the New Testament'` for NT (book_id ≥ 40), `'Notes on the Old Testament'` for OT. `scholar_id='620d504d-0a76-41f1-a87f-9b26cfab02de'::uuid`.

### Phase C — Unified runner + docs

**`run_all.py`**: extends 8.0's pattern with `--commentator {calvin|jfb|wesley|all}`, `--dry-run`, `--limit N`. First statement per commentator is the scholar UPDATE (idempotent). Skip-list queries `commentaries ⋈ scholars` for already-inserted `(book_id, chapter)` pairs per scholar before each INSERT batch and filters them out.

Row-filter implementation: parse INSERT VALUES rows individually via paren-balance, match `(uuid, book_id, chapter, ...)` prefix with `ROW_KEY_RE`, drop matching-already-present rows and re-emit the filtered INSERT. Handles the common case where a partial apply mid-session has loaded some but not all rows for a given batch file.

Pre-populated skip list for Calvin: the 4 batch files applied via MCP during 8.0 (`calvin_001-004_01_genesis_*.sql`) are explicitly skipped so `--commentator all` doesn't attempt duplicate Genesis 11-50 inserts.

**`README.md`** — Windows prereqs, apply sequence, post-apply verification SQL, 5-verse Vercel walkthrough, rollback plan.

**`coverage_report.md`** — per-book extraction audit; short-chapter list with "legitimate/parse-error" classification; idempotency notes; source format documentation.

**Session record** — this file.

**Scholar nodes** — `_ark/nodes/scholars/JFB.md` + `_ark/nodes/scholars/Wesley.md` next.

## Deliverables summary

```
_ark/batch-8-jfb-wesley-output/
├── README.md                                    (1 file, apply instructions)
├── coverage_report.md                           (1 file, per-book audit)
├── run_all.py                                   (1 file, unified applier)
├── tools/
│   ├── extract_jfb.py                           (bs4; 1189 chapters)
│   ├── build_jfb_sql.py                         (155 SQL files)
│   ├── extract_wesley.py                        (bs4 + ThML classes; 1168 ch)
│   └── build_wesley_sql.py                      (153 SQL files)
└── supabase/
    ├── jfb-inserts/      (155 .sql, ~10.78 MB)
    └── wesley-inserts/   (153 .sql, ~5.57 MB)

_ark/03-sessions/session_8-jfb-wesley_2026-04-22.md   (this file)
_ark/nodes/scholars/JFB.md                             (pending)
_ark/nodes/scholars/Wesley.md                          (pending)
```

## Expected DB state after Marcus applies

| scholar | rows before | rows added | rows after | tradition (before → after) |
|---------|-------------|------------|-----------|----------------------------|
| matthew-henry | 1,189 | 0 | 1,189 | Puritan / Presbyterian (unchanged) |
| calvin | 50 | 0 this batch | 50 (or 817 if `--commentator all`) | Reformed (unchanged) |
| jfb | 0 | **+1,189** | 1,189 | Reformed → **Evangelical** |
| wesley | 0 | **+1,168** | 1,168 | Methodist / Evangelical → **Evangelical** |

Plus 2 scholar-row metadata updates for Wesley (`primary_work_title`, `primary_work_years`) and 1 for JFB (`tradition`).

## Post-ingest render expectations (Doctrine A)

On the Vercel preview after Marcus applies + pushes the branch, these render counts should hold:

| Verse | Voices (default_rank order) | Featured | "Show other voices" count |
|-------|-----------------------------|----------|----------------------------|
| /verse/genesis/1/1 | Calvin(100) + JFB(400) + Wesley(800) + Henry(300) | Calvin | 3 |
| /verse/isaiah/53/5 | same 4 | Calvin | 3 |
| /verse/john/1/1 | same 4 | Calvin | 3 |
| /verse/romans/8/31 | same 4 | Calvin | 3 |
| /verse/psalms/23/1 | Henry(300) + JFB(400) + Wesley(800) | Henry | 2 (Calvin absent — Calvin's Psalms commentary wasn't in the 8.0 ingest) |
| /verse/proverbs/15/1 | Henry(300) + JFB(400) | Henry | 1 (Calvin skipped Proverbs in core Commentaries; Wesley skipped Prov 11-30) |
| /verse/2-john/1/1 | Henry(300) + JFB(400) + Wesley(800) | Henry | 2 (Calvin absent — didn't write on 2 John) |

The four-voice render on Gen 1:1 / Isa 53:5 / John 1:1 / Rom 8:31 is the acceptance-critical test: it shifts Doctrine A from "Henry + Calvin" (proven in 8.0) to "Henry + Calvin + JFB + Wesley" across most Bible chapters — the point of §Vision 4.2's multi-voice exercise.

## Non-blocker flags (for resume)

- **Spurgeon still blocked** at `_ark/batch-8-1-blocker.md`. Treasury*.txt files are CCEL Images-Only distribution. Marcus needs to re-stage from a real text edition (CCEL text, Gutenberg, or CCEL-bundle ThML) before Spurgeon can be ingested. Deferred; not required for this batch's success.
- **Wesley 2 Samuel 24** missing from source. Could be a legitimate Wesley omission (he was uneven in Chronicles/Samuel-like late-narrative coverage) or a re-staging gap. Flag to Marcus for verification against a second PD edition; non-blocking.
- **Amended prompt not committed** at `_ark/04-prompts/batch_8_retry_jfb_wesley.md` — same pattern as prior batches (prompt pasted into Cowork directly rather than committed first). Marcus to file post-apply if desired.

## Related

[[session_8-0_2026-04-22]] · [[batch-8-blocker]] · [[batch-8-0-blocker]] · [[batch-8-1-blocker]] · [[Calvin]] · [[JFB]] · [[Wesley]] · [[Matthew Henry]] · [[commentaries]] · [[scholars]]
