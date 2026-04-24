---
slug: wesley
display_name: "John Wesley (NT Notes)"
dates: 1703–1791
tradition: Evangelical
default_rank: 800
primary_work: Notes on the Bible
primary_work_years: 1754-1766
ingested: 2026-04-22 (Batch 8 retry — staged, apply pending)
rows_in_commentaries: 1168 (staged; 0 live until Marcus applies)
coverage: 260 NT (complete) + 908 OT (selective)
---

# John Wesley (1703–1791)

Anglican priest; founder of Methodism; field preacher; hymn-writer (with brother Charles); theologian of Christian perfection. His **Explanatory Notes Upon the New Testament** (1754) and **Explanatory Notes Upon the Old Testament** (published 1765-1766) are the most widely-used Methodist-Arminian verse-by-verse commentary in the PD canon.

## Tradition

`tradition = 'Evangelical'` (canonical per Doctrine A tag list). Migration 046 seeded the row as `'Methodist / Evangelical'` — not canonical; this batch's scholar UPDATE corrects it. Wesley's theology is Arminian rather than Reformed; his commentary foregrounds free will, sanctification, and Christian perfection in ways that diverge from Calvin's determinism and Henry's moderate Calvinism. "Evangelical" captures the common-ground register.

## Style

Wesley's Notes are **terse and pastoral**. He writes not as a critical scholar but as a field preacher composing concise verse-notes for lay readers. His NT Notes often echo Bengel's *Gnomon*; his OT Notes lean more on Matthew Henry's own work. Wesley famously said of the OT Notes:

> "I have attended throughout to the plain literal meaning... and, where there are several good senses, I have generally preferred the most obvious."

Short chapters in the ingested file (Ps 117, 100, 128, 1 Chr 14) reflect Wesley's deliberate brevity, not parse errors.

## Coverage

**1,168 chapters / 66 books** — NT complete, OT selective:

- **NT (260/260)** — complete coverage, every canonical chapter.
- **OT (908/929)** — 21 chapters omitted:
  - **Proverbs 11-30** (20 chapters) — Wesley's published OT Notes covered Proverbs 1-10 + chapter 31 (the famous virtuous-wife chapter) only.
  - **2 Samuel 24** (1 chapter) — not present in the staged notes.doc source; possibly a staging gap, worth verifying against a second PD edition.

## Source acquisition

CCEL Public-Domain release of Wesley's Notes, staged at `C:\Users\marcd\Downloads\MannaFest\wesley-data\notes.doc`. Despite the `.doc` extension the file is actually **MS Word saved-as-HTML** — valid HTML with `<html xmlns:v="urn:schemas-microsoft-com:vml"...>` header and ThML-derived CSS classes (`div1`..`div5`). Parsed with bs4 using `class="div2"` for book-level headers and `class="div3"` for chapter markers. Chapter numbering uses:
- **Roman numerals** for most books (I, II, ..., LII)
- **Arabic numerals** for Psalms (1, 2, ..., 150)
- **"Commentary on {Book}"** for single-chapter Obadiah

Extraction tool: `_ark/batch-8-jfb-wesley-output/tools/extract_wesley.py`.

## Role in MannaFest's commentary stack

At `default_rank=800` Wesley sits near the bottom of the Doctrine A priority list — his entries appear under "Show other voices" rather than featured. But he's the ONLY Arminian/Methodist voice in the PD ingest set: without Wesley, Doctrine A's "traditions never flattened" promise reads as "Reformed + Puritan + Reformed + Puritan." Wesley's presence is what makes the multi-voice render genuinely multi-tradition.

## Work title

Scholar row currently holds `primary_work_title = 'Explanatory Notes Upon the New Testament'` — misleading once OT Notes are ingested. This batch's scholar UPDATE sets `primary_work_title = 'Notes on the Bible'` (the contemporary summary label for the combined work). Per-row `source` is split by testament: NT rows cite `'Explanatory Notes Upon the New Testament'`, OT rows cite `'Notes on the Old Testament'`. The display name `"John Wesley (NT Notes)"` in the `scholars.name` column is retained as-is for this batch — changing the display name can be folded into a later hygiene pass if desired.

## Related

[[session_8-jfb-wesley_2026-04-22]] · [[Calvin]] · [[JFB]] · [[Matthew Henry]] · [[commentaries]] · [[scholars]]
