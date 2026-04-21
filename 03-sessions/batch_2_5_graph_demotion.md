# Batch 2.5 — Graph Demotion

> Session record for Cowork's execution of Batch 2.5 on 2026-04-21.
> Target of the wikilink `[[batch_2_5_graph_demotion]]` used in
> [[STATUS]].

## Outcome

Graph demoted from site pillar to exploratory feature. Reachable only
from a small muted footer link on the homepage; every other affordance
pointing at `/graph` or `/graph/topics` removed. `/graph` and
`/graph/topics` render a not-dismissible amber banner at the very top.
Planning docs updated to match. Design spec archived.

## Why this batch existed

Two prior Cowork batches tried to get the graph to production-quality:

- **Batch 2 — Graph Side Panel + Min-3-Edge Rule** (shipped on
  `feature/graph-sidepanel-and-min3` @ `e55ba69`). Panel + `?focus={id}`
  URL state + the `public_nodes` view + the forward-looking
  ≥3-outgoing-edges rule. Good work, but a side panel on top of the
  original 32,605-node cloud doesn't make the density legible.
- **Batch 3.5 Phase 1 + amendment** (built to spec on
  `feature/graph-redesign-phase-1`, commits `6da965d` → `322192d` →
  `fc54f0a`; pushed to origin but never merged). Five-tier hybrid,
  testament-tone palette, node-type shapes, settled physics, Obsidian
  edge palette, hover-only labels. Shipped through the full Phase 1
  scope including the auto-promote threshold amendment (≥100 outgoing
  edges, 1,887 verses auto-promoted, `public_nodes` at 3,513).

The Phase 1 preview revealed that no amount of spec-first tuning fixes
the underlying problem: **the graph's job depends on what else exists
on the site**. With the current content density — mostly verse nodes
and Matthew Henry commentary — the graph is a cloud. The design calls
it's supposed to surface (region structure, feature-page gravity wells,
typological threads) aren't load-bearing yet because the content
they'd surface doesn't exist in quantity.

Rather than keep iterating on the graph against a thin content layer,
the decision is to pull the graph out of the site's primary flow and
come back to it once 40+ pages meet the Isaiah-Mini-Bible depth bar.
Then its job — and its design — become obvious.

## What changed

### Next.js repo (`C:\Users\marcd\Downloads\MannaFest`)

- **`src/components/home/FeatureGrid.tsx`** — removed the "The Graph"
  tile and its `<GraphVisual />` helper. Header text "Six places
  worth starting." → "Five places worth starting." Grid remains
  `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`, which naturally flows
  to 3+2 on desktop with 5 tiles. Remaining tiles (Isaiah Mini-Bible,
  Kings, Apologetics, Strong's Concordance, Verse of the Day) keep
  their existing styling untouched. Doc comment updated to record the
  Batch 2.5 rationale and point back to Vision v2 §5.1 (revised).
- **`src/lib/nav/menuSections.ts`** — removed the entire `graph`
  section (primary `/graph` + secondary `/graph/topics`). Rather than
  drop "Typology Map" (which pointed at `/typology`, not `/graph`), it
  was moved into the `study-desk` section where it belongs — a study
  tool, not a graph affordance. Comment block added noting the April
  21 demotion.
- **`src/app/page.tsx`** — added a small, muted, plain-text
  "Graph (under construction)" link at the bottom of the homepage
  footer. Lives on its own row below the main footer nav so it reads
  quieter than both the footer nav links above it and the donation
  buttons in `<HomeDonate />` above that. Color `#4B5563`
  (text-neutral-600, one step muted from the footer nav's
  `#6B7280`); font size 11px; `hover:text-[#6B7280]` only, no icon, no
  emphasis.
- **`src/components/graph/UnderConstructionBanner.tsx`** — new,
  ~40 lines. Full-width amber banner (`bg-amber-900/25` +
  `border-amber-500/30` + `text-amber-100` — the dark-palette
  translation of the spec's `bg-amber-50`, which would have read as a
  light-theme panel on the site's `#08090C` surface). Small padding
  (`px-4 py-3`), serif body text (Cinzel — the site's serif),
  not-dismissible. Text verbatim from the Batch 2.5 spec, with "Head
  back to the homepage" rendered as a `/` link.
- **`src/app/graph/page.tsx`** ([[graph-page]]) — `<UnderConstructionBanner />`
  rendered above the existing `<Suspense>`/`<GraphClient />` tree. No
  change to graph internals. Wrapped the return in a fragment.
- **`src/app/graph/topics/page.tsx`** ([[graph-topics-page]]) —
  `<UnderConstructionBanner />` rendered above `<main>` in both the
  error and normal branches. No change to data fetching or rendering.

No change to `graph_nodes`, `graph_edges`, or `public_nodes`. No change
to any API route. No change to `feature/graph-redesign-phase-1`. The
`NebulaGraph.tsx` / `NodeSidePanel.tsx` / `GraphClient.tsx` files were
not edited — their content is preserved for when the graph revival
decision is made.

### Vault (`C:\Users\marcd\Documents\MannaFest\ark`)

- **[[MannaFest_Vision_v2_Locked]]** — §3 Locked Decisions Summary
  gained row 21 ("Graph demoted from pillar to exploratory feature…").
  §5.1 rewritten from "Three pillars (confirmed)" to "Two pillars
  (revised April 21, 2026)" — Study Desk + Personal Workspace only,
  with a "Formerly a pillar: Graph" block explaining the demotion and
  the revival criteria. §6.3 prepended with a "**Status as of
  2026-04-21: deferred.**" note. §10 Non-Goals gained a new bullet
  locking further graph development until content density justifies
  it.
- **[[STATUS]]** — Decision log prepended with the 2026-04-21 entry.
  Recent wins section gained an "**Under construction (footer link
  only):**" subsection enumerating `/graph`, `/graph/topics`, and
  Chunk 1.3's 2D nebula as demoted-but-retained.
- **[[BATCH_QUEUE]]** — Batch 2 and Batch 2.5 added to Shipped
  (archive). New "Archived unbuilt" subsection added with Batch 3.5
  entry pointing at the origin branch and the archive folder. In
  flight now empty. Queue header renumbered to "next 14". Removed
  "Blocks on: 3.5" from Batch 4 and adjacent "(after 3.5)" notes from
  Batches 5 and 6. Removed "3.5 bonus" language from Batch 8.
  Stripped "3.5" from the block lists on Batches 11 and 15. Stripped
  "AND by Batch 3.5" and "per the redesign spec" language from the
  Batch 3 and Batch 11 descriptions. Reference to
  `graph-redesign-design-spec.md` at the bottom of the file updated to
  reflect the archive move.
- **Archive move** —
  `ark/01-architecture/graph-redesign-design-spec.md` →
  `ark/99-archive/2026-04-21-graph-demotion/graph-redesign-design-spec.md`.
  The ark repo's `.git/index.lock` was present from a prior session,
  so `git mv` failed and a plain `mv` was used instead. Git will
  detect the rename on Marcus's Windows machine when the index lock
  is cleared and the vault is committed.

### Session record

This file.

## Validation

- `npx tsc --noEmit` — clean on every file touched by this batch
  (FeatureGrid, page, menuSections, UnderConstructionBanner,
  graph/page, graph/topics/page). Pre-existing TS1127 "invalid
  character" errors in `NodeSidePanel.tsx`, `NebulaGraph.tsx`,
  `GraphClient.tsx`, and `api/graph/edges/route.ts` remain — these are
  null-byte padding tails from the Cowork sandbox's virtiofs/mmap
  issue documented in STATUS.md and are present on the branch before
  this batch started. Not in scope for Batch 2.5 and not introduced by
  it; they will correct themselves when Marcus next writes those
  files on Windows.
- `npx eslint` on the six touched source files — clean, zero errors,
  zero warnings.
- `npm run build` — not run in the Cowork sandbox per the standing
  virtiofs/mmap caveat; Marcus builds on Windows before pushing.

## Acceptance (post-merge, production click-through)

Per the prompt, acceptance is a production click-through after Marcus
merges. To verify:

1. `mannafest.faith/` — no graph tile in the feature grid (five tiles
   visible; Isaiah, Kings, Apologetics, Strong's, Verse of the Day).
2. `mannafest.faith/` — footer shows a muted "Graph (under
   construction)" link on its own row below the main footer nav.
3. Click the footer link → `/graph` loads with the amber banner at
   the very top.
4. Open the menu on any page → no graph entry under any section.
5. `/graph/topics` loads the same amber banner at the top.
6. View source on `/` → no `href="/graph"` outside the footer link.

## Out of scope (deliberately not touched)

- Graph internals (`NebulaGraph.tsx`, `NodeSidePanel.tsx`,
  `GraphClient.tsx`, `api/graph/edges/route.ts`,
  `FilterPanel.tsx`, `NodeDetailSidebar.tsx`).
- Supabase: `graph_nodes`, `graph_edges`, `public_nodes` — untouched.
- `/concordance`, the Isaiah page, the Kings page, any content page.
- The `feature/graph-redesign-phase-1` branch — preserved on origin
  as the future cold-start for graph revival.

## Links

- [[STATUS]]
- [[BATCH_QUEUE]]
- [[MannaFest_Vision_v2_Locked]]
- Modified route files: [[graph-page]] (`src/app/graph/page.tsx`),
  [[graph-topics-page]] (`src/app/graph/topics/page.tsx`).
- Prior session records: [[2026-04-20-batch-3-5]],
  [[2026-04-20-batch-3-5-amendment]], [[2026-04-20-batch-1-5]].
- Archived spec: `ark/99-archive/2026-04-21-graph-demotion/graph-redesign-design-spec.md`.
