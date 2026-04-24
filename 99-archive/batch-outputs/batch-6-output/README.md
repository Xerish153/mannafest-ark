# Batch 6 — Cowork scratchpad output

Same Windows-direct merge pattern as Batch 5.5 (sandbox git still broken,
same `.git/packed-refs` quirk). Cowork wrote files here + applied the
migrations via Supabase MCP; Marcus pulls Windows-direct, runs build
locally, commits file-explicit, merges. Vercel auto-deploys `main` on push.

## Already applied to production Supabase

Project `ufrmssiqjtqfywthgpte`, via MCP:

- `051_votd_reflections.sql` — new `votd_reflections` table (date PK,
  verse_id FK to graph_nodes, markdown body, status draft/published,
  scholar-quote fallback columns, set_updated_at trigger, RLS).
- `052_featured_page_refs.sql` — new `featured_page_refs` table (slug,
  title, route_prefix, book_id + chapter + verse range, note, indexes,
  RLS).
- `053_seed_featured_page_refs.sql` — 24 seed rows across 7 slugs:
  isaiah-mini-bible, suffering-servant, bronze-serpent, genealogies,
  messianic-psalms, seed-promise, tabernacle. (`bible-codes` not seeded —
  ELS is a visual demo with no single-verse anchor.)

Archive copies of all three migrations live under `supabase/migrations/`
for repo history parity.

## Files to copy into the code repo

File-explicit `git add` only (per OPERATING_RULES §1). Robocopy `src/**`
and `supabase/migrations/**` 1-for-1.

### New files

- `src/lib/features/flags.ts` — `GRAPH_ENABLED` feature flag, read from
  `NEXT_PUBLIC_GRAPH_ENABLED`.
- `src/lib/votd/canonical-verses.ts` — 60-entry day-of-year rotation +
  `canonicalVotdForDay`, `getDayOfYear`, `formatIsoDate`.
- `src/lib/votd/loader.ts` — unified VOTD loader returning the
  `VotdPayload` used by Layer 1, Layer 2, and the public JSON API.
- `src/components/votd/VotdHero.tsx` — verse + reflection / fallback card.
- `src/components/votd/VotdCommentaryHighlights.tsx` — 1–3 chapter-context
  cards (Layer 2).
- `src/components/votd/VotdConnections.tsx` — 3-column connections grid
  (Layer 2).
- `src/components/votd/VotdLayer1Card.tsx` — homepage wrapper + CTA.
- `src/components/votd/VotdLayer2Page.tsx` — dedicated-page wrapper.
- `src/components/verses/FeaturedStudiesOnVerse.tsx` — featured-studies
  cluster on the verse page.
- `src/components/verses/OriginalLanguageTable.tsx` — biblehub-style
  interlinear; returns `null` for verses without `verse_strongs` data.
- `src/app/verse-of-the-day/[date]/page.tsx` — historical permalink.
- `src/app/api/votd/route.ts` — public VOTD JSON endpoint.
- `src/app/admin/verse-of-the-day/page.tsx` — 365-day calendar queue.
- `src/app/admin/verse-of-the-day/[date]/page.tsx` — single-day editor
  server page.
- `src/app/admin/verse-of-the-day/[date]/ReflectionEditor.tsx` — client
  editor component.
- `src/app/api/admin/votd/[date]/route.ts` — PATCH, super-admin gated.

### Replaces existing files

- `src/app/page.tsx` — homepage with VOTD lead + 4-tile grid.
- `src/components/home/FeatureGrid.tsx` — 4 tiles (VerseOfDayTile removed).
- `src/app/verse-of-the-day/page.tsx` — rebuilt as Layer 2 today's page.
- `src/app/verse/[book]/[chapter]/[verse]/page.tsx` — adds
  FeaturedStudiesOnVerse, swaps OriginalLanguage for OriginalLanguageTable,
  gates ConnectedGraph on `GRAPH_ENABLED`.
- `src/components/verses/VerseActionOverflow.tsx` — gates "View in graph"
  on `GRAPH_ENABLED`.

### Left in the repo but no longer referenced

- `src/components/home/VerseOfDayTile.tsx` — no longer imported; delete
  or leave for quick revert. Not `git rm`'d in the commit by default so
  rollback is a one-liner.
- `src/app/verse/[book]/[chapter]/[verse]/OriginalLanguage.tsx` — the
  word-split fallback. Swapped out by the new table. Safe to `git rm` in
  the same commit; no other caller imports it.

## Post-merge Vercel dashboard step (Marcus)

Add production env var in the Vercel project settings:

```
NEXT_PUBLIC_GRAPH_ENABLED = false
```

Also add the same to `.env.example` and `.env.production` for consistency
(the flag reads from `process.env.NEXT_PUBLIC_GRAPH_ENABLED`; missing →
false, which is the safe default). Vercel auto-redeploys on env change.

## Verification URLs

### Public

- `/` — VOTD lead + 4-tile grid. Donation + graph footer link preserved.
- `/verse-of-the-day` — Layer 2 with hero + commentary highlights +
  connections.
- `/verse-of-the-day/2026-04-22` — historical permalink.
- `/verse-of-the-day/2100-01-01` — "no VOTD for this date" soft message.
- `/verse-of-the-day/not-a-date` — same soft message (invalid shape).
- `/verse/isaiah/53/5` — commentary trim (already working); featured-
  studies cluster should show Isaiah Mini-Bible + Suffering Servant;
  Original language table renders Hebrew RTL for Isaiah 53 if
  `verse_strongs` has data (today it doesn't — component returns null,
  which is correct per Doctrine D.2).
- `/verse/john/3/16` — featured-studies should show Bronze Serpent (if
  John 3:14–15 seed matches) — note: seed targets John 3:14–15, so 3:16
  is outside range. Expected: no featured studies on 3:16.
- `/verse/john/3/14` — featured-studies should show Bronze Serpent.
- `/verse/romans/8/31` — no graph link in the action bar overflow menu
  (flag off). Everything else from Batch 5.5 preserved.
- `/api/votd` — returns JSON payload.

### Admin (super-admin required)

- `/admin/verse-of-the-day` — 365-day calendar for the current year.
  Click any day to edit.
- `/admin/verse-of-the-day/2026-04-22` — single-day editor. Save, toggle
  status, then reload `/verse-of-the-day` to see the reflection render.
- `/admin/verse-of-the-day/not-a-date` — 404.

## What Cowork did NOT do

- Did not run tsc / npm build / lint (no dev server in the sandbox).
- Did not push or merge (sandbox git broken; Marcus merges Windows-direct).
- Did not set `NEXT_PUBLIC_GRAPH_ENABLED` in the Vercel dashboard — that
  is Marcus's post-merge step.
- Did not change Batch 4+5 commentary trim behavior — verified the trim
  is already working in `<FeaturedExcerpt />` at render time per
  Doctrine A. See session record §entry-audit.
- Did not drop or touch the legacy `verse_of_the_day` table. The new code
  reads only from `votd_reflections`; the old table is orphaned and can
  be dropped in a later hygiene batch.

## Out of scope

- Verse picker in the admin editor is currently an integer node-id input;
  a search-by-verse widget is a future polish.
- Broader graph-flag gating on non-core pages (person mini-graphs, theme
  mini-graphs, explore, etc.) — not touched. The acceptance-critical
  paths (verse page + homepage overflow) are gated. Other non-admin graph
  entry points retain their current behavior until a dedicated cleanup
  batch.
- Greek font: no additional font loaded — Source Serif 4 (already in
  layout.tsx) provides polytonic Greek glyph coverage that's adequate for
  OriginalLanguageTable's modest word list. A dedicated SBL BibLit Greek
  load can arrive in a future typography pass.
