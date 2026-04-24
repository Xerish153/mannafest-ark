# Batch 5.5 — Cowork scratchpad output

Pattern mirrors Batch 4+5: sandbox git is broken (same `.git/packed-refs`
NUL-padding quirk Marcus hit before), so Cowork wrote files into this
scratchpad and the migrations ran via Supabase MCP. Marcus pulls
Windows-direct, runs lint + tsc + build locally, commits file-explicit,
and merges. Vercel auto-deploys main on push.

## What's already applied to production

Both migrations ran via Supabase MCP against project `ufrmssiqjtqfywthgpte`:

- `049_add_graph_edges_ranking.sql` — added `display_rank INT`,
  `founder_override BOOLEAN DEFAULT false`, plus two partial indexes on
  `graph_edges`. Column adjustment from the prompt's original
  `cross_references` table: there is no such table in this project;
  cross-references live as `graph_edges` between `graph_nodes` of
  `type='verse'`. The prompt explicitly anticipates this case
  ("Cross-references table named something else — not a blocker; adjust
  and proceed").
- `050_backfill_graph_edges_display_rank.sql` — ran `ROW_NUMBER() OVER
  (PARTITION BY source_node_id ORDER BY weight DESC, target_node_id ASC)`
  across all 1,301,311 rows. MCP call timed out at 60s but the UPDATE
  committed (post-check: 1,301,311 / 1,301,311 rows have `display_rank`
  populated; 0 unranked).

SQL copies of both migrations live under `supabase/migrations/` in this
scratchpad; copy them into `MannaFest/supabase/migrations/` for repo
history parity.

## Files to copy into the code repo

Mirror the paths 1-for-1 from `src/` and `supabase/migrations/` below into
the code repo. File-explicit `git add`, not `git add .` (per
OPERATING_RULES §1).

### Replaces existing files

- `src/app/verse/[book]/[chapter]/[verse]/page.tsx` — full rewrite for
  the verse-page redesign (section order, dedupe action bar, overflow
  menu, collapsed notes affordance, paper/ink chrome).
- `src/app/verse/[book]/[chapter]/[verse]/Section.tsx` — drops the
  numbered eyebrow render, flips chrome to paper/ink tokens.

**Deleted imports** in the new `page.tsx`: `SaveVerseButton` and
`CrossReferences` are no longer imported. `SaveVerseButton` stays in the
codebase (other surfaces use it); we just stopped using it on the verse
action bar, since `BookmarkButton` supersedes it as the single "come back
to this" affordance. `CrossReferences.tsx` inside the verse route is now
dead code — safe to `git rm` in the same commit; no other caller imports
it (grep confirms).

### New files

- `src/lib/cross-references/ranking.ts` — generic `resolveRankedList<T>`
  + `DEFAULT_TOP_N` + `partitionRanked<T>`. Reusable for Batch 4.5 VOTD
  related-verses without modification.
- `src/components/verses/CrossReferenceSection.tsx` — top-5 + "Show all N"
  disclosure. Dedupes by target verse (graph_edges has duplicates across
  source ingests; see Session record for data quality note).
- `src/components/verses/VerseActionOverflow.tsx` — three-dot overflow
  menu, native `<details>` (no JS dep). Renders children + "View in graph
  (beta)" link.
- `src/app/admin/cross-references/[verseId]/page.tsx` — super-admin
  override surface. `[verseId]` is the `graph_nodes.id` of the verse.
- `src/app/admin/cross-references/[verseId]/OverrideEditor.tsx` — client
  component, button-based reorder (move up / down / reset).
- `src/app/api/admin/cross-references/[verseId]/route.ts` — PATCH
  endpoint, gated on `requireSuperAdmin()` from Batch 4+5.

## Verification URLs for acceptance click-through

### Public verse pages (post-merge + deploy)

- `/verse/romans/8/31` — Romans 8:31 (node 29253). 81 outgoing + 291
  incoming verse edges. 5 inline cards visible; "Show all N" disclosure
  for the rest.
- `/verse/genesis/1/1` — Genesis 1:1 (node 1086). 204 + 108.
- `/verse/john/3/16` — John 3:16 (node 27236). 81 + 261.

### Admin override surface

- `/admin/cross-references/29253` — Romans 8:31 reorder UI.
- `/admin/cross-references/1086` — Genesis 1:1 reorder UI.
- `/admin/cross-references/27236` — John 3:16 reorder UI.

### Round-trip test

1. Visit `/admin/cross-references/29253`.
2. Move the current top row down to position 6.
3. Save. (PATCH `/api/admin/cross-references/29253` returns `{ updated: N }`.)
4. Open `/verse/romans/8/31` in a fresh tab. The new top-5 should reflect
   the move, with the newly-promoted row showing a "Pinned" chip.
5. Return to the admin page. Click "Reset" on the moved row. Save.
6. Reload the verse page. The row returns toward its original position
   (not guaranteed to be identical since other Save events may have shifted
   ranks, but `founder_override` is now false so the row sorts with the
   auto pool).

### Feature pages + book hubs preserved

Confirm these still render numbered section eyebrows (the verse-page
removal must NOT leak site-wide):

- `/study/isaiah-mini-bible`
- `/kings-of-israel-and-judah`
- One apologetics page (e.g., `/apologetics` index — confirm if
  `/apologetics/scientific` exists in repo)

`Section.tsx` in this scratchpad is scoped to the verse route only; book
hubs and feature pages use their own wrappers. Grep confirms no other
file imports from
`src/app/verse/[book]/[chapter]/[verse]/Section.tsx`.

## What Cowork did NOT do

- Did not touch commentary table, commentaries rows, editorial_notes,
  scholars, profiles, or any other table.
- Did not run tsc / build / lint (no dev server in the sandbox).
- Did not push or merge (sandbox git broken; Marcus merges
  Windows-direct per the anticipated fallback in the batch prompt §7.2).
- Did not create a feature branch in the sandbox for the same reason.
  Marcus can create `feat/batch-5-5-verse-page-crossref` locally and PR
  it in, or merge direct to main per the Full Write auto-merge posture.

## Out of scope

- Data-quality cleanup of duplicate `graph_edges` rows (Genesis 15:1
  appears 3x in Romans 8:31's outgoing edges). Render-layer dedup
  suppresses this in the top-5 card display. A dedicated hygiene batch
  can later collapse duplicates at the DB level.
- Per-verse ranking for incoming edges. The batch design uses a single
  `display_rank` on the edge partitioned by source_node_id; for incoming
  edges, the rank is computed from the OTHER side's partition. This is
  an acceptable heuristic for v1 — founder overrides trump it.
- Full paper/ink palette flip across deep section internals (each verse
  section component still uses legacy dark tokens in its interior). The
  visible chrome (Section wrapper, cross-ref cards, overflow menu, notes
  affordance) uses paper/ink tokens per the batch's §4.6 scoped flip
  allowance. The deep flip stays parking-lot Batch 3.6.
