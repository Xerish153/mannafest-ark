---
slug: jfb
display_name: "Jamieson, Fausset & Brown"
dates_active: 1871
tradition: Evangelical
default_rank: 400
primary_work: Commentary Critical and Explanatory on the Whole Bible
primary_work_years: 1871
ingested: 2026-04-22 (Batch 8 retry — staged, apply pending)
rows_in_commentaries: 1189 (staged; 0 live until Marcus applies)
---

# Jamieson, Fausset & Brown (1871)

Three-author Scottish Presbyterian/Anglican whole-Bible commentary, first published in 1871 as *A Commentary, Critical and Explanatory, on the Old and New Testaments*. Often called simply "JFB" or the "Commentary Critical and Explanatory." One of the most concise and citation-dense Public-Domain whole-Bible commentaries — which is why it lands at `default_rank=400` in Doctrine A's featured-excerpt ordering: after the Calvin + Spurgeon + Henry heavyweight-voice tier, JFB reliably offers a second Evangelical voice on almost every canonical chapter.

## The three authors

- **Robert Jamieson** (1802–1880) — Free Church of Scotland minister. Responsible for Genesis through Esther in the OT, and Matthew through Acts in the NT.
- **A. R. Fausset** (Andrew Robert, 1821–1910) — Anglican. Covered Job through the Minor Prophets in the OT, and the Catholic Epistles + Revelation in the NT.
- **David Brown** (1803–1897) — Free Church of Scotland. Responsible for Romans through Philemon.

## Tradition

`tradition = 'Evangelical'` (canonical per Doctrine A tag list). Migration 046 seeded the row as `'Reformed'` which is close but not canonical — this batch's scholar UPDATE corrects to `'Evangelical'`, the closest canonical match given the three authors' Free Church and Anglican affiliations. `tradition_key = 'reformed'` is left as-is in the migration 046 seed; it doesn't affect render.

## Style

JFB is **concise by design** — a whole-Bible commentary in four original volumes (compressed to one in modern reprints). Chapter entries average ~2,000 words. Theology is moderate-Reformed, citation-heavy, and pastoral-but-scholarly. Cross-references to parallel passages are JFB's signature move — the commentary on Matthew 24 just points to Mark 13, and 2 Chronicles 18 points to 1 Kings 22, because rewriting would be wasteful.

## Coverage

**1,189 chapters / 66 books** — complete Protestant canon, including:
- Single-chapter books: Obadiah, Philemon, 2 John, 3 John, Jude (all handled via Introduction-anchor fallback in the extractor since CCEL's single-chapter JFB files don't use `ChapterN` anchors).
- 3 legitimate short chapters (< 200 chars) that cross-reference parallel commentary: 2 Chronicles 18, Psalm 146, Matthew 24.

## Role in MannaFest's commentary stack

At `default_rank=400`, JFB is the third-priority non-founder voice on any verse it covers. Doctrine A render order on a verse where all four sources are present:

1. **Calvin** (100) — featured excerpt
2. **Henry** (300) — in "Show other voices"
3. **JFB** (400) — in "Show other voices"
4. **Wesley** (800) — in "Show other voices"

JFB's concision makes its entries render cleanly under Doctrine A's 50-word featured-excerpt trim — the "Read full passage" disclosure on JFB entries tends to feel natural rather than truncated, unlike Calvin's more verbose style.

## Source acquisition

CCEL Public Domain HTML distribution. 66 `JFB{NN}.htm` files + 6 intro/TOC files (JFB00*) staged at `C:\Users\marcd\Downloads\MannaFest\jfb-data\`. Total 19 MB. Standard CCEL markup: `<A NAME="ChapterN">` anchors for multi-chapter books, `<A NAME="Introduction">` + verse anchors for single-chapter books.

Extraction tool: `_ark/batch-8-jfb-wesley-output/tools/extract_jfb.py` (bs4 + lxml).

## Related

[[session_8-jfb-wesley_2026-04-22]] · [[Calvin]] · [[Wesley]] · [[Matthew Henry]] · [[commentaries]] · [[scholars]]
