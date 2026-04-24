---
slug: calvin
name: John Calvin
dates: 1509–1564
tradition: Reformed
default_rank: 100
is_author_profile: false
primary_work: Commentaries (Calvin Translation Society edition)
primary_work_years: 1843–1855
ingested: 2026-04-22 (pilot — Batch 8.0)
rows_in_commentaries: 817 (50 live + 767 staged as of session end)
---

# John Calvin (1509–1564)

French-born Reformer, theologian, and exegete. Primary systematic-theology voice of the Reformed tradition; his *Institutes of the Christian Religion* (1536, revised 1559) and his **Commentaries** on most books of the Bible shaped Protestant biblical interpretation for five centuries.

## Coverage

Calvin wrote commentaries on most of the Bible. The Calvin Translation Society edition (1843–1855), translated into English by John King, John Owen, William Pringle, Thomas Myers, and others, is the authoritative PD text. MannaFest uses this edition as ingested from CCEL plain-text.

**Old Testament** — Pentateuch (Genesis as separate 2-volume commentary; Exodus–Deuteronomy as *Harmony of the Law* in 4 volumes), Joshua, Psalms, Isaiah, Jeremiah, Lamentations, Ezekiel chapters 1–20 (Calvin died before completing), Daniel, all 12 Minor Prophets.

**New Testament** — all books except 2 John, 3 John, and Revelation. The Gospels are presented as a *Harmony of Matthew, Mark, and Luke* (3 volumes) plus a separate commentary on John (2 volumes).

## Tradition

**Reformed** (tradition_key: `reformed`). Calvin's hermeneutic is grammatical-historical with a strong emphasis on authorial intent, covenantal continuity between Testaments, and the sovereignty of God in salvation (what later systematizers would call *monergism*). He writes in a terse, plain style that cuts against the allegorical excess of the medieval tradition while retaining reverence for the Fathers.

## Role in MannaFest's commentary stack

Calvin sits at `default_rank=100` — the highest-ranked non-founder voice, meaning the Doctrine A auto-ranked fallback will feature Calvin on any verse he covered when no founder curation exists for that locus. Matthew Henry (`default_rank=300`) becomes the secondary Puritan voice on those loci.

## Works beyond the Commentaries

Not ingested (out of scope for this batch): *Institutes of the Christian Religion* (systematic theology, not verse-keyed), his sermons (distinct corpus), and his correspondence. If MannaFest ever wants Calvin's *Institutes* as featured reference material, it would need a separate schema — probably a `systematic_works` table keyed by topic rather than verse.

## Source acquisition

CCEL plain-text files staged locally at `C:\Users\marcd\Downloads\MannaFest\calvin-data\calcom01.txt` through `calcom45.txt`. 45 volumes, ~60MB uncompressed. CCEL's public-domain notice: "The electronic texts of Calvin's Commentaries were prepared by volunteers for the OnLine Bible project and the Christian Classics Ethereal Library, and these files are in the public domain for any purpose."

Extraction tools in `_ark/batch-8-0-output/tools/`:
- `extract_calvin.py` — CCEL plain-text → per-chapter JSON
- `build_calvin_sql.py` — JSON → INSERT batches + coverage report

## Related

[[session_8-0_2026-04-22]] · [[batch_8_0_calvin_pilot]] · [[batch-8-blocker]] (prior halt, schema + batch-label issues resolved) · [[batch-8-0-blocker]] (prior halt, egress → resolved by local staging) · [[Matthew Henry]] (the other ingested voice in the commentary stack) · [[commentaries]] · [[scholars]]
