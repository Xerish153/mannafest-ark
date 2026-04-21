# Doctrine Session A — Commentary Curation & Multi-Voice Presentation

**Date:** 2026-04-21
**Type:** Doctrine session (amendments only, no code)

## Summary

Locked the commentary curation doctrine. Featured excerpt ≤50 words per node, "Show other voices" expansion, founder curates via super-admin editor, auto-ranked fallback when uncurated. Resolves the Matthew Henry overload problem by making curation the default posture.

## Decisions locked

- Featured excerpt is a real pull-quote ≤50 words from a sourced commentator
- Auto-fallback when uncurated: highest-ranked sourced commentary features unmodified
- Founder notes styled identically to other voices; "Editor" tradition tag; byline "Marcus Brown — MannaFest"
- Commentator ranking seeded: Calvin > Spurgeon > Matthew Henry > JFB > Clarke > Barnes > Gill > Wesley NT > Geneva marginalia > others
- Minimum voice coverage (3 traditions) is aspirational, not a publish gate
- Matthew Henry stays; his excerpts are subject to same cap and ranking as everyone else

## Files changed this session

1. [[MannaFest_Vision_v2_Locked]] — §3 rows 22–24, §4.2 rewritten, §4.4 added, §12 bullet
2. [[STATUS]] — decision log entry prepended
3. [[BATCH_QUEUE]] — restructured around waves; Wave 1 specified

## What this unlocks

- [[Batch 4]] — Commentary schema expansion (columns, CHECK constraint, rank seeding)
- [[Batch 5]] — Super-admin commentary editor at `/admin/commentary`
- [[Batch 6]] — PD commentator ingestion expansion
- [[Batch 7]] — Genesis curation reference pass (founder-led)

## Next doctrine session

Doctrine B — Feature Page Three-Depth Structure. Amends Vision v2 §7 with progressive-reveal depth + style differentiation per depth.
