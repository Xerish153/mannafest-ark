# Batch 7-B — Jesus Titles Cluster — scratchpad

Mirrors repo paths under `src/` and `supabase/migrations/`. Marcus
robocopies into `Downloads/MannaFest/` and merges Windows-direct per the
known Cowork pattern.

## What's live in Supabase prod (applied 2026-04-22 via MCP)

- Migration **057_jesus_titles** — table + RLS + updated_at trigger
- Migration **058_jesus_title_refs** — table + indexes
- Seed: **2 rows** in `jesus_titles` (`christ-messiah`, `lamb-of-god`),
  both `status='published'`
- Seed: **33 rows** in `jesus_title_refs` (Christ 17, Lamb 16)
- Seed: **8 rows** in `featured_page_refs` with `route_prefix='/title'`
  (4 per title)

## Apply order (same pattern as batch-6-handoff)

1. Robocopy `_ark/batch-7b-output/src/**` → `Downloads/MannaFest/src/`.
2. Robocopy `_ark/batch-7b-output/supabase/migrations/**` →
   `Downloads/MannaFest/supabase/migrations/` (two new files: `057_*`,
   `058_*` — migrations already applied to prod; these are archive copies).
3. `git clean -fd` if robocopy leaves stray files.
4. `npm run build` — expect tsc + compilation green. Known gotcha: make
   sure `react-markdown` is already a dep (used by several shipped
   components). If not installed, run `npm i react-markdown`.
5. File-explicit `git add`, commit, merge, push. **This batch touches
   none of the files Batch 7 owns per the parallel-safety contract.**
6. Vercel auto-deploys.

## Files added

### Supabase migrations (archive copies — already applied to prod)
- `supabase/migrations/057_jesus_titles.sql`
- `supabase/migrations/058_jesus_title_refs.sql`

### Lib
- `src/lib/titles/types.ts`
- `src/lib/titles/loader.ts`

### Public components
- `src/components/titles/TitleHeader.tsx`
- `src/components/titles/OriginalLanguageOriginCard.tsx`
- `src/components/titles/TitleRefList.tsx`
- `src/components/titles/OriginSection.tsx`
- `src/components/titles/DeclarationSection.tsx`
- `src/components/titles/TheologicalMeaningSection.tsx`
- `src/components/titles/TitleCommentarySection.tsx`
- `src/components/titles/TitleCrossLinks.tsx`
- `src/components/titles/TitlePageLayout.tsx`
- `src/components/titles/TitleTileCard.tsx`
- `src/components/titles/ClusterVisual.tsx`
- `src/components/titles/ClusterHubLayout.tsx`

### Admin components
- `src/components/admin/TitleEditor.tsx`

### Routes
- `src/app/title/[slug]/page.tsx`
- `src/app/titles/page.tsx`
- `src/app/admin/titles/page.tsx`
- `src/app/admin/titles/[slug]/page.tsx`
- `src/app/api/admin/titles/[slug]/route.ts` (PATCH)
- `src/app/api/admin/titles/[slug]/refs/route.ts` (POST / DELETE / PATCH)

## Acceptance click-through (post-merge)

- `/titles` — cluster hub loads; two tiles render (Identity row has Christ,
  Sacrificial Office row has Lamb of God).
- `/title/christ-messiah` — full page renders with origin / declaration /
  theological meaning / commentary section / cross-links.
- `/title/lamb-of-god` — same.
- `/verse/matthew/1/1` — "Featured studies on this verse" cluster now
  includes the **Christ / Messiah** card.
- `/verse/john/1/29` — the cluster includes the **Lamb of God** card.
- `/verse/isaiah/53/7` — the cluster includes **Lamb of God** + the
  pre-existing **Suffering Servant** feature page.
- `/admin/titles` — super-admin index shows 2 rows. Non-admin gets
  redirected to `/` by the admin-layout `requireAdmin()` gate.
- `/admin/titles/christ-messiah` — editor loads with every field
  populated; save persists via PATCH.
- Batch 6 features preserved (nothing in Batch 6 output was touched).

## What's NOT in this scratchpad

- **15 of the 17 planned titles are not yet composed.** Only the anchor
  two (Christ, Lamb of God) have seeded content. See
  `_ark/batch-7b-checkpoint.md` for the decision path on how to finish.
- **Header nav integration** — deferred to a later micro-batch per the
  parallel-safety contract.
- **Session record + node files + ark status update** — these write after
  Marcus's merge, not from the scratchpad.
