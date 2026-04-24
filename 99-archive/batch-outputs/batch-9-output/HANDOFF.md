# Batch 9 — HANDOFF

**Branch to push:** `feat/batch-9-jesus-multi-catalog`
**Merge-ready:** Yes — structural spine only (per scope decision with Marcus). Body content authoring is follow-up work.
**Production Supabase state:** Migrations 063–069 are NOT yet applied. Apply via MCP during the merge window, OR let them apply via the CLI on push to main if you have the CLI migration hook enabled.

---

## 1. Cowork sandbox state

Cowork worked from `/sessions/busy-admiring-gates/mnt/MannaFest` with the usual broken `.git/index`. All work is on-disk; no commits were made from sandbox. Standard post-Cowork Windows ritual:

```powershell
cd C:\Users\marcd\Downloads\MannaFest
Remove-Item -Force .git\HEAD.lock, .git\index.lock -ErrorAction SilentlyContinue
git reset --mixed HEAD
git status
```

Expect a mountain of new files (no modifications — this batch is additive).

---

## 2. Branch + file-explicit staging

Create the feature branch from current main, stage per-phase. Per §1 rule: **no `git add -A`** — every path is explicit.

```powershell
git checkout main
git pull --ff-only origin main
git checkout -b feat/batch-9-jesus-multi-catalog
```

### Phase 1 — Migrations (7)

```powershell
git add `
  supabase/migrations/063_jesus_miracles.sql `
  supabase/migrations/064_jesus_parables.sql `
  supabase/migrations/065_jesus_discourses.sql `
  supabase/migrations/066_jesus_sevens.sql `
  supabase/migrations/067_jesus_passion_week.sql `
  supabase/migrations/068_jesus_resurrection_appearances.sql `
  supabase/migrations/069_jesus_apostolic_figures.sql

git commit -m "feat(db): 7 Jesus cluster tables + refs tables + seven_items (Batch 9 Phase 1)"
```

### Phase 2 — Shared lib + components

```powershell
git add `
  src/lib/jesusClusters/types.ts `
  src/lib/jesusClusters/parseVerseRef.ts `
  src/lib/jesusClusters/loader.ts `
  src/lib/jesusClusters/adminConfig.ts `
  src/components/jesus/ClusterHub.tsx `
  src/components/jesus/ClusterPage.tsx `
  src/components/jesus/SynopticParallelsStrip.tsx `
  src/components/jesus/PassionWeekTimeline.tsx `
  src/components/jesus/ClusterPagePullQuotes.tsx `
  src/components/jesus/ClusterRefList.tsx

git commit -m "feat(jesus): shared cluster types + loaders + ClusterHub/ClusterPage templates + 8.9 pull-quote consumption (Batch 9 Phase 2)"
```

### Phase 3 — Public routes (7 hubs + 7 slug pages)

```powershell
git add `
  src/app/miracles/page.tsx `
  "src/app/miracles/[slug]/page.tsx" `
  src/app/parables/page.tsx `
  "src/app/parables/[slug]/page.tsx" `
  src/app/discourses/page.tsx `
  "src/app/discourses/[slug]/page.tsx" `
  src/app/sevens/page.tsx `
  "src/app/sevens/[slug]/page.tsx" `
  src/app/passion-week/page.tsx `
  "src/app/passion-week/[slug]/page.tsx" `
  src/app/resurrection-appearances/page.tsx `
  "src/app/resurrection-appearances/[slug]/page.tsx" `
  src/app/apostles/page.tsx `
  "src/app/apostles/[slug]/page.tsx"

git commit -m "feat(jesus): 7 cluster hub routes + 7 slug pages (Batch 9 Phase 3)"
```

### Phase 4 — Admin surfaces + API routes

```powershell
git add `
  src/app/admin/jesus/page.tsx `
  "src/app/admin/jesus/[cluster]/page.tsx" `
  "src/app/admin/jesus/[cluster]/[slug]/page.tsx" `
  src/components/admin/ClusterMemberEditor.tsx `
  "src/app/api/admin/jesus/[cluster]/[slug]/save/route.ts" `
  "src/app/api/admin/jesus/[cluster]/[slug]/publish/route.ts"

git commit -m "feat(admin): shared cluster editor + Publish API that enforces >=3 refs at write boundary (Batch 9 Phase 4)"
```

### Phase 5 — Seeds

```powershell
git add `
  scripts/jesus/_shared.ts `
  scripts/jesus/_runner.ts `
  scripts/jesus/seedMiracles.ts `
  scripts/jesus/seedParables.ts `
  scripts/jesus/seedDiscourses.ts `
  scripts/jesus/seedSevens.ts `
  scripts/jesus/seedPassionWeek.ts `
  scripts/jesus/seedResurrectionAppearances.ts `
  scripts/jesus/seedApostolicFigures.ts `
  scripts/jesus/seedAllFeaturedPageRefs.ts

git commit -m "feat(jesus): 7 cluster seed scripts (status=draft, structural fields only) + featured_page_refs re-sync (Batch 9 Phase 5)"
```

---

## 3. Push + merge

```powershell
git push -u origin feat/batch-9-jesus-multi-catalog --force-with-lease
git checkout main
git pull --ff-only origin main
git merge --no-ff feat/batch-9-jesus-multi-catalog `
  -m "merge: Batch 9 — Jesus Multi-Catalog (7 clusters, 119 members, 7 hubs, structural spine)"
git push origin main
```

Vercel auto-deploys. Migrations 063–069 need to be applied in production Supabase — either via MCP (preferred — matches the 8.9 pattern) or via the Supabase CLI migration hook if you have one wired into CI.

---

## 4. Apply migrations to production Supabase

Two paths. Pick the one you've been running:

### Path A — MCP apply (matches Batch 8.9 pattern)

Use the Supabase MCP in a Cowork session:

```
apply_migration name='063_jesus_miracles' query='<contents of supabase/migrations/063_jesus_miracles.sql>'
apply_migration name='064_jesus_parables' ...
... through 069
```

### Path B — CLI push

```powershell
supabase db push
```

Verify either way:

```sql
SELECT version FROM supabase_migrations.schema_migrations
WHERE version IN ('063','064','065','066','067','068','069')
ORDER BY version;
```

Expected: all 7 rows.

---

## 5. Run seeds (on Windows, with `.env.local` populated)

```powershell
# In order:
npx tsx --env-file=.env.local scripts/jesus/seedMiracles.ts
npx tsx --env-file=.env.local scripts/jesus/seedParables.ts
npx tsx --env-file=.env.local scripts/jesus/seedDiscourses.ts
npx tsx --env-file=.env.local scripts/jesus/seedSevens.ts
npx tsx --env-file=.env.local scripts/jesus/seedPassionWeek.ts
npx tsx --env-file=.env.local scripts/jesus/seedResurrectionAppearances.ts
npx tsx --env-file=.env.local scripts/jesus/seedApostolicFigures.ts

# Optional belt-and-braces re-sync of featured_page_refs for every active/draft member:
npx tsx --env-file=.env.local scripts/jesus/seedAllFeaturedPageRefs.ts
```

Expected counts after all seeds run (all `status='draft'`):

```sql
SELECT 'miracles' AS cluster, COUNT(*) FROM jesus_miracles
UNION ALL SELECT 'parables',            COUNT(*) FROM jesus_parables
UNION ALL SELECT 'discourses',          COUNT(*) FROM jesus_discourses
UNION ALL SELECT 'sevens',              COUNT(*) FROM jesus_sevens
UNION ALL SELECT 'passion_week',        COUNT(*) FROM jesus_passion_week
UNION ALL SELECT 'resurrections',       COUNT(*) FROM jesus_resurrection_appearances
UNION ALL SELECT 'apostles',            COUNT(*) FROM jesus_apostolic_figures;
```

Expected:

| cluster         | count |
| --------------- | ----- |
| miracles        | 35    |
| parables        | 40    |
| discourses      | 7     |
| sevens          | 4     |
| passion_week    | 8     |
| resurrections   | 11    |
| apostles        | 14    |

Featured-page-refs row count:

```sql
SELECT route_prefix, COUNT(*)
FROM featured_page_refs
WHERE route_prefix IN ('/miracles','/parables','/discourses','/sevens',
                       '/passion-week','/resurrection-appearances','/apostles')
GROUP BY route_prefix ORDER BY 1;
```

Expected: one row per cluster member with a parseable primary_verse_ref (~119 total).

---

## 6. Pastor Marc's post-ship publish pass

1. Visit `/admin/jesus` — you'll see the 7 clusters with draft counts.
2. Click into each cluster. The list page shows draft-vs-active + slug.
3. For any page with ≥3 refs already (see session record §"Per-cluster counts"):
   - Click the row, fill in `body_markdown` / `spiritual_significance` / `editor_note` (and cluster-specific extras)
   - Click **Save**, then **Publish**. The API flips `status='active'` and the page goes live.
4. For pages with <3 refs, the Publish button stays disabled with "needs N more refs." Add refs via direct SQL or a future admin-refs UI (not in this batch).

The acceptance-checklist pages were bumped to ≥3 refs at seed time (see session record) — Pastor Marc can publish them immediately after authoring.

---

## 7. Acceptance checklist (production click-through)

After Vercel deploys + migrations apply + seeds run + Pastor Marc publishes at least the following pages (body_markdown can be short — the checklist only requires 200 OK + correct render shape):

- [ ] `/miracles` — hub renders 4 cluster-group sections + messianic-signs featured row (⚡ badges on 4 miracle tiles)
- [ ] `/miracles/raising-of-lazarus` — hero, synoptic strip, editor drawer placeholder, refs list with 3 scripture anchors
- [ ] `/parables` — hub with 6 cluster-group sections
- [ ] `/parables/prodigal-son` — parable setting renders, `Jesus's interpretation` hidden (Jesus didn't explicitly interpret this one)
- [ ] `/discourses/sermon-on-the-mount` — hero + Matt 5-7 anchor list + key themes chips
- [ ] `/sevens/i-am-statements` — 7-item structured list with cross-refs (e.g., #5 links to `/miracles/raising-of-lazarus`)
- [ ] `/passion-week` — hub with 8 day tiles in order
- [ ] `/passion-week/good-friday` — timeline widget at top with Good Friday highlighted
- [ ] `/resurrection-appearances` — hub with 11 appearance tiles in canonical order
- [ ] `/resurrection-appearances/emmaus-road` — participants + location render
- [ ] `/apostles/peter` — birth-name + death-tradition + "Related book hub" link to `/book/1-peter`
- [ ] `/apostles/judas-iscariot` — `is_judas` editorial discipline surfaces via the editor-note placeholder hint ("multiple PD voices, no resolution sentence") — won't render publicly until Pastor Marc authors and publishes
- [ ] `/verse/john/2/1` — Featured Studies section shows water-into-wine-cana tile
- [ ] `/verse/luke/15/11` — Featured Studies section shows prodigal-son tile
- [ ] `/verse/matt/5/3` — Featured Studies section shows sermon-on-the-mount tile
- [ ] No page with `status='active'` has <3 outgoing refs (Publish API guarantees this)

---

## 8. Ark-side commits (separate repo)

```powershell
cd C:\Users\marcd\Documents\MannaFest\ark
git add 03-sessions/session_9_2026-04-23.md batch-9-output/HANDOFF.md
git commit -m "session: Batch 9 — Jesus multi-catalog structural spine"
git push origin mannafest-ark
```

---

## 9. What did NOT ship in Batch 9 (follow-up queue)

1. **Body authoring** — all 119 pages have `body_markdown`, `spiritual_significance`, `old_testament_type`, `editor_note` as NULL. Pastor Marc authors via `/admin/jesus/[cluster]/[slug]`. Target ~300 words per page from PD commentary corpus. Suggest a batch per cluster (9.1 miracles, 9.2 parables, etc.) — or one big Wave F pass.
2. **Long-tail ref augmentation** — 82 of 119 members have <3 refs. See session record §"Pages that fell short of 3 refs" for the Pastor Marc work list. Most fixes are ~10 seconds of reasoning per page.
3. **Reader-page cross-link** — `/read/[book]/[chapter]` could query `featured_page_refs` and surface Batch-9 cluster tiles alongside existing Batch-6 feature pages. Small batch.
4. **Drag-reorder display_order** — admin list currently shows `display_order` but doesn't let Pastor Marc reorder. Needs dnd-kit pickup from the 8.9 parking lot.
5. **Wave E `<FeaturedStudiesOnVerse />` dedupe fix** — still parked. Batch 9 registered cleanly on `(route_prefix, slug)` so the fix isn't blocked; it just has more surface now.
6. **Inter-cluster refs in the refs table** — current `ref_type` enum is scripture-anchor focused. A `cross_cluster` ref_type would let a miracle page explicitly point at a resurrection-appearance page. Not needed for MVP (SevenItems model covers the I AM → Lazarus case); re-evaluate after Pastor Marc's first curation pass.
7. **STATUS.md + BATCH_QUEUE.md update** — STATUS is still stale ("Ready for Batch 3"). When merging, also update STATUS to reflect 8.9 + 9 shipped and move Batch 9 in BATCH_QUEUE.md from pending to shipped archive.

---

## 10. Scope reconfirm

This batch ships **structure**, not content. Per Marcus's A/A/A + 3-additions decision:

- 7 cluster schemas
- Shared components (ClusterHub, ClusterPage, extras)
- 14 public routes (7 hubs + 7 slug pages)
- Pull-quote consumption from 8.9 on every cluster page
- Seed data with factual fields only (no theological AI-authored prose)
- Admin editor with Publish-guard enforcing ≥3 refs at the write boundary
- `status='draft'` on all 119 members — nothing renders publicly until Pastor Marc publishes

The "127 pages authored from PD commentary" in the spec is a much larger content-authoring batch. This HANDOFF gives Pastor Marc the workbench to do that authoring one page at a time.
