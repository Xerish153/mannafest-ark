---
batch: batch-5-5-verse-page-crossref
status: READY FOR MARCUS MERGE — migrations already applied to prod
session: 2026-04-22 (Cowork)
session_record: [[session_5-5_2026-04-22]]
scratchpad: _ark/batch-5-5-output/
---

# Batch 5.5 — handoff

All implementation done. Migrations 049 + 050 already applied to
production Supabase (MCP, project `ufrmssiqjtqfywthgpte`). Code lives in
`_ark/batch-5-5-output/` mirroring repo paths.

Sandbox git is broken (`refs/heads/main` NUL-padded; same class of
`.git/packed-refs` corruption Marcus has hit repeatedly). Cannot
auto-merge from here. Marcus merges Windows-direct; Vercel auto-deploys
main on push.

## Apply order (Marcus)

1. Robocopy `_ark/batch-5-5-output/src/**` → `Downloads/MannaFest/src/`
2. Robocopy `_ark/batch-5-5-output/supabase/migrations/**` →
   `Downloads/MannaFest/supabase/migrations/`
3. `git rm src/app/verse/\[book\]/\[chapter\]/\[verse\]/CrossReferences.tsx`
   (dead code; no remaining imports)
4. `git clean -fd` if robocopy leaves stray files
5. `npm run build` — confirm tsc + compilation green
6. File-explicit `git add`, commit, merge to `main`, push
7. Acceptance click-through per `_ark/batch-5-5-output/README.md`

## Verse node IDs for admin URL testing

- Romans 8:31 → 29253 → `/admin/cross-references/29253`
- Genesis 1:1 → 1086 → `/admin/cross-references/1086`
- John 3:16 → 27236 → `/admin/cross-references/27236`

## STATUS.md decision-log entry (template for Marcus)

Copy/paste the line below after merge, with `{SHA}` + timestamp
filled in:

```
- **2026-04-22 ({evening/night})** — Batch 5.5 shipped. Merge commit
  `{SHA}` on main. Cowork-built; Marcus Windows-direct merge per the
  known sandbox-git-broken fallback. ~10 files: migrations 049 + 050
  on `graph_edges` (display_rank + founder_override; 1.3M rows
  backfilled); generic `resolveRankedList<T>` library at
  `src/lib/cross-references/ranking.ts` (reusable for Batch 4.5 VOTD);
  `<CrossReferenceSection />` top-5 + "Show all N" disclosure replacing
  the 281-card wall on verse pages; verse page redesign (commentary +
  cross-refs inline above the fold; dedup'd action bar with overflow
  menu; "Your notes" collapsed; graph CTA demoted to overflow;
  numbered eyebrows removed verse-page-scoped; paper/ink chrome);
  super-admin override surface at `/admin/cross-references/[verseId]`
  + PATCH API. Cross-references live on `graph_edges` (no dedicated
  `cross_references` table) — prompt's anticipated adjustment. Known
  quirks surfaced: duplicate edges in graph_edges, all weights=1.0
  (ranking falls back to stable node-id order); both documented in
  session record for future hygiene batches.
```
