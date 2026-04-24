---
batch: batch-6-verse-surface
status: READY FOR MARCUS MERGE — migrations 051–053 applied to prod
session: 2026-04-22 (Cowork)
session_record: [[session_6_2026-04-22]]
scratchpad: _ark/batch-6-output/
---

# Batch 6 — handoff

All implementation done. Migrations 051 + 052 + 053 (seed) applied to
production Supabase via MCP. Code in `_ark/batch-6-output/` mirroring
repo paths.

Sandbox git broken (known quirk). Marcus merges Windows-direct.

## Apply order

1. Robocopy `_ark/batch-6-output/src/**` → `Downloads/MannaFest/src/`
2. Robocopy `_ark/batch-6-output/supabase/migrations/**` →
   `Downloads/MannaFest/supabase/migrations/`
3. (Optional) `git rm src/app/verse/\[book\]/\[chapter\]/\[verse\]/OriginalLanguage.tsx`
   — dead after swap.
4. (Optional) `git rm src/components/home/VerseOfDayTile.tsx` — dead
   after reshape.
5. `git clean -fd` if robocopy leaves stray files.
6. Update `.env.example` — add `NEXT_PUBLIC_GRAPH_ENABLED=false`.
7. `npm run build` — confirm tsc + compilation green.
8. File-explicit `git add`, commit, merge, push.
9. **Vercel dashboard**: set production env
   `NEXT_PUBLIC_GRAPH_ENABLED=false`. Triggers auto-redeploy.
10. Acceptance click-through per `_ark/batch-6-output/README.md`.

## First VOTD queue entry (recommended post-merge smoke test)

1. Visit `/admin/verse-of-the-day` — the current year's calendar loads.
2. Click today's date.
3. Author a 1–2 sentence reflection, toggle status to `published`, save.
4. Reload `/verse-of-the-day` — the reflection renders with Pastor Marc
   attribution instead of a scholar-quote fallback.
5. Reload `/` — the homepage Layer 1 card shows the same reflection with
   "Read full study →" CTA.

## STATUS.md decision-log template for Marcus

```
- **2026-04-22 ({evening/night})** — Batch 6 shipped. Merge commit
  `{SHA}` on main. Cowork-built; Marcus Windows-direct merge. ~24 files:
  migrations 051–053 (votd_reflections + featured_page_refs + 24 seed
  rows across 7 feature-page slugs); unified VOTD loader +
  `canonical-verses` 60-entry day-of-year rotation; 5 VOTD components
  (Hero / CommentaryHighlights / Connections / Layer1Card / Layer2Page);
  2 verse-page components (FeaturedStudiesOnVerse,
  OriginalLanguageTable); `NEXT_PUBLIC_GRAPH_ENABLED` flag gating verse-
  page graph UI; VOTD admin queue at `/admin/verse-of-the-day` +
  single-day editor + PATCH API; public `/verse-of-the-day` scrap +
  rebuild (Layer 2) + `/verse-of-the-day/[date]` historical permalinks +
  `/api/votd` JSON endpoint; homepage reshape with VOTD lead + 4-tile
  grid. Non-obvious findings: Doctrine A commentary trim-at-render was
  already working — the "cuts off mid-quote" suspicion was a false
  positive; verse_strongs is very sparse (231/31,102) so
  OriginalLanguageTable renders only where data exists;
  `_ark/batch_4_5_votd_decisions.md` referenced by the prompt doesn't
  exist in the vault, proceeded on Vision v2 §4.7 alone.
```

## What still needs Marcus's hand

- Vercel env var set (step 9 above).
- First VOTD queue entry (smoke test above).
- Future polish: search-by-verse widget in the admin editor; broader
  graph-flag coverage on person/place/theme mini-graphs (flagged in
  session record for a dedicated hygiene batch).
