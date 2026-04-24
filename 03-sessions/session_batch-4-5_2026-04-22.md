---
session: batch-4-5
date: 2026-04-22
tool: Cowork
execution_mode: MCP-migrations + vault-scratchpad + local plumbing-commit (sandbox git creds absent; push deferred to Windows-direct)
blocker: batch-4-5-blocker.md (resolved — Path A)
amendment: batch-4-5-amendment.md (executed)
feature_branch: feat/batch-4-5-commentary-editorial
commit: f4e1b96810f40f957b42aedc42bdc7b33eb68ecb
parent: c409eaf761dc46fa81327ea0a9138b19c434f7d3 (origin/main)
merge_status: commit + ref staged locally in code repo .git; push + merge pending Marcus Windows-direct
---

# Session — Batch 4 + 5: Schema (Doctrine A + C) + Super-Admin Editor + Editor's Notes Drawer

[[batch_4-5_commentary_editorial]]
[[batch-4-5-blocker]]
[[batch-4-5-amendment]]
[[session_batch-3_2026-04-22]]
[[Doctrine A]] [[Doctrine C]]

## Summary

Batch 4+5 ships the schema + curation surface for Doctrine A commentary presentation and Doctrine C editorial-notes drawer. Production Supabase now carries four new DDL migrations (045–048): `scholars` extended with `default_rank` / `is_founder` / `tradition_key` and seeded with the 14 missing PD commentator rows + Pastor Marc — MannaFest; `commentaries` (plural) extended with `scholar_id` FK / `featured` / `featured_excerpt` / `founder_curated` / `author_type` / `status` / `curator_note` / `curated_at` / `curated_by` + backfilled (all 1189 Matthew Henry rows linked); `editorial_notes` + `editorial_notes_revisions` created with RLS (public-read of `status='published'`, service-role-only writes) + `updated_at` trigger. Auto-rank fallback surfaces the founder voice first by giving `marc-mannafest` `default_rank=50` below every sourced voice. Application-layer ships as vault scratchpad at `_ark/batch-4-5-output/` mirroring the target repo paths — sandbox git is corrupted so auto-merge is impossible from Cowork; Marcus pulls Windows-direct and merges. The `<CommentarySection />` render replaces the inline Cite loop in `CommentaryVoices.tsx` with the Doctrine A featured-excerpt + "Show other voices (N)" disclosure. The `<EditorialNotesDrawer />` tab + expanded panel ride on every non-excluded route via `EditorialNotesDrawerProvider` wrapping `app/layout.tsx`. Super-admin affordances — curation panel at `/admin/commentary/[bookSlug]/[chapter]`, global list at `/admin/editorial-notes`, inline `+ Add editor's note` inside the drawer — gate server-side on `profiles.is_admin=true` via a new `requireSuperAdmin()` helper that mirrors the existing `requireAdmin()` but throws HTTP-status errors for API routes.

## Files changed — Supabase (production, applied via MCP)

Migration versions as tracked by Supabase `migrations` table:

1. **045_scholars_commentary_columns** — `ALTER TABLE scholars` adds `default_rank INTEGER NOT NULL DEFAULT 1000`, `is_founder BOOLEAN NOT NULL DEFAULT FALSE`, `tradition_key TEXT CHECK (10 enum values)`. Indexes on `default_rank` and `slug`.
2. **046_scholars_seed_commentators** — promotes `scholars.slug` to UNIQUE index, then upserts 15 commentator rows (14 new: calvin / spurgeon / jfb / clarke / barnes / gill / wesley / geneva / owen / chrysostom / augustine / bullinger / seiss / marc-mannafest; 1 existing: matthew-henry updated non-destructively). `marc-mannafest` gets `default_rank=50` + `is_founder=true` + `is_author_profile=true`.
3. **047_commentaries_curation_columns** — `ALTER TABLE commentaries` (plural) adds `scholar_id UUID REFERENCES scholars(id)`, `featured BOOLEAN`, `featured_excerpt TEXT CHECK (≤400)`, `founder_curated BOOLEAN`, `author_type TEXT CHECK IN ('sourced','founder')`, `status TEXT CHECK IN ('published','hidden')`, `curator_note TEXT`, `curated_at TIMESTAMPTZ`, `curated_by UUID REFERENCES auth.users(id)`. Backfills all 1189 rows (100% `author='Matthew Henry'` verified) to `scholar_id=(matthew-henry)`, then tightens `scholar_id` to NOT NULL. Three indexes: `(book_id, chapter, verse_start, status)`, `(scholar_id)`, partial `(book_id, chapter, verse_start) WHERE featured=TRUE`.
4. **048_editorial_notes** — creates `editorial_notes` (id, surface_type, surface_id, title, body_md, display_order, status, created_by, created_at, updated_at) + `editorial_notes_revisions` (id, note_id, title, body_md, saved_at, saved_by). Indexes on `(surface_type, surface_id, status)`, `(surface_type, surface_id, display_order)`, `(note_id, saved_at DESC)`. RLS: public SELECT where `status='published'`, deny-all for anon/authenticated otherwise; revisions deny all anon/authenticated. `set_updated_at()` trigger.

Post-migration verification (live query):

- `scholars` commentator row count: 15/15 ✓
- `commentaries` rows with `scholar_id IS NULL`: 0/1189 ✓
- `editorial_notes` exists, `editorial_notes_revisions` exists ✓
- `get_advisors` (security) — 0 new findings; 14 pre-existing findings on other tables (apocrypha_*, apologetics_*, security_definer_view on `public_nodes`, function_search_path_mutable warnings) unrelated to this batch.

## Files changed — application (scratchpad at _ark/batch-4-5-output/)

### New files (27)

1. `supabase/migrations/045_scholars_commentary_columns.sql`
2. `supabase/migrations/046_scholars_seed_commentators.sql`
3. `supabase/migrations/047_commentaries_curation_columns.sql`
4. `supabase/migrations/048_editorial_notes.sql`
5. `src/lib/supabase/schemas/scholars.ts` — Scholar + ScholarMini types + COMMENTATOR_SLUGS
6. `src/lib/supabase/schemas/commentaries.ts` — Commentary + CommentaryWithScholar + CommentaryPatchAction + `wordCount()` + `FEATURED_EXCERPT_WORD_CAP`
7. `src/lib/supabase/schemas/editorial_notes.ts` — EditorialNote + revisions + create/update + `isDrawerExcludedRoute()`
8. `src/lib/supabase/server.ts` — `createSupabaseServerClient()` (SSR cookie-aware) + `createSupabaseServiceClient()`
9. `src/lib/auth/super-admin.ts` — `requireSuperAdmin()` throws `SuperAdminError(401|403)`; `isSuperAdmin()` non-throwing variant; `server-only`
10. `src/components/commentary/CommentarySection.tsx` — Doctrine A render, props `{ bookId, chapter, verseStart? }`
11. `src/components/commentary/FeaturedExcerpt.tsx` — featured card with chip + attribution + `truncateWords()` util
12. `src/components/commentary/OtherVoicesDisclosure.tsx` — `"use client"` — "Show other voices (N)" collapse
13. `src/components/commentary/CommentaryCard.tsx` — single-voice card rendered through `<Cite kind="commentary" />`
14. `src/components/commentary/index.ts` — barrel
15. `src/components/editorial-notes/EditorialNotesDrawerProvider.tsx` — `"use client"` — context + pathname detection + node-surface override hook (`useRegisterEditorialSurface`) + notes fetch
16. `src/components/editorial-notes/EditorialNotesDrawer.tsx` — tab (muted when empty, editor-tradition bg when populated) + slide-in panel (desktop) / bottom sheet (mobile); ESC + backdrop close; `aria-modal="false"` non-blocking dialog; prefers-reduced-motion aware
17. `src/components/editorial-notes/EditorialNoteCard.tsx` — markdown body + attribution + tradition chip; super-admin inline edit + hide
18. `src/components/editorial-notes/EditorialNoteEditor.tsx` — side-by-side textarea + live MarkdownPreview; Save / Save as draft / Cancel / Delete
19. `src/components/editorial-notes/AddEditorialNoteButton.tsx` — super-admin `+ Add editor's note` toggle; inline-expands into the editor
20. `src/components/editorial-notes/index.ts` — barrel
21. `src/components/markdown/MarkdownPreview.tsx` — react-markdown wrapper with remark-gfm + rehype-sanitize; internal links via next/link; external links `target="_blank" rel="noopener noreferrer"`
22. `src/app/api/commentary/[id]/route.ts` — PATCH handler; actions: feature / unfeature / set_excerpt / add_curator_note / set_status; enforces 50-word cap server-side; unfeatures sibling rows at same locus on feature action
23. `src/app/api/editorial-notes/route.ts` — GET (query by surface_type/surface_id/q; include_all requires super-admin) + POST (create note)
24. `src/app/api/editorial-notes/[id]/route.ts` — GET (super-admin, any status) + PATCH (inserts revision only if title or body_md changed) + DELETE (soft → status='hidden')
25. `src/app/admin/commentary/page.tsx` — landing: go-to-chapter form + recently-curated list
26. `src/app/admin/commentary/go/route.ts` — small `GET` redirect helper for the landing form (sanitizes slug + chapter, redirects to `/admin/commentary/{book}/{chapter}` or back to landing)
27. `src/app/admin/commentary/[bookSlug]/[chapter]/page.tsx` — server component, fetches curation rows + renders `<CurationPanel />`

### New files (continued)

28. `src/app/admin/commentary/[bookSlug]/[chapter]/CurationPanel.tsx` — `"use client"` — per-entry cards with Feature / Unfeature / Save excerpt / Save note / Hide buttons; 50-word counter on excerpt textarea
29. `src/app/admin/editorial-notes/page.tsx` — global admin list with surface_type/status/q filters
30. `src/app/admin/editorial-notes/[id]/edit/page.tsx` — standalone editor surface; fetches the note (any status via service-role) + renders the editor
31. `src/app/admin/editorial-notes/[id]/edit/EditorialNoteEditShell.tsx` — `"use client"` — wires the existing `<EditorialNoteEditor />` into standalone context; onSave/onClose navigate to `/admin/editorial-notes`

### Patches (delivered as full replacement files in `_patches/`)

32. `_patches/app-layout-tsx-replacement.tsx` — full replacement for `src/app/layout.tsx`. Adds `async` keyword, `await isSuperAdmin()`, wraps children with `<EditorialNotesDrawerProvider initialSuperAdmin={...}>…</EditorialNotesDrawerProvider>`. Everything else unchanged.
33. `_patches/verse-commentary-voices-replacement.tsx` — full replacement for `src/app/verse/[book]/[chapter]/[verse]/CommentaryVoices.tsx`. Keeps same `{ bookName, chapterNum }` prop signature (no change at caller). Internally resolves `bookId` + fetches a voice-count summary for the Section meta, then delegates render to `<CommentarySection bookId chapter />`. Keeps `<EditorialSlot />` for super-admin inline-note affordance unchanged (Doctrine D.2 stub; chapter-level authoring is on `/admin/commentary/...`).
34. `_patches/package-json.md` — diff + install command for `react-markdown@^9`, `remark-gfm@^4`, `rehype-sanitize@^6`.

## Decisions (deliberate deviations from the original Batch 4+5 prompt)

- **Schema rewrite to match production, not create duplicates.** Original prompt specified a new `commentators` table; production has `scholars` (32 rows, 15 overlapping slugs — well 14 actually plus 1). Reused `scholars`; dropped the `commentators` table + separate seed migration from the plan. Documented in `batch-4-5-blocker.md` + `batch-4-5-amendment.md`.
- **Commentaries table is plural + uses `commentary_text`/`author`/`(book_id, chapter, verse_start)`**, not `commentary`/`body`/`verse_id`. All SQL + TypeScript + component queries use the real column names. Kept the free-text `author` column in place alongside the new `scholar_id` FK — drop in a future hygiene batch.
- **Commentary granularity is chapter-level for sourced rows.** 1189/1189 rows have `verse_start=1` + `verse_end=null` and `verse_reference='{book-slug}-{chapter}'`. `<CommentarySection />` accepts `{ bookId, chapter, verseStart? }` — chapter-level by default; verse-level filter for future founder notes that set `verse_start` to a specific verse. The render spec ("featured excerpt + show other voices") is unchanged but operates on chapter-scoped queries.
- **Super-admin is `profiles.is_admin=true`**, not `user.user_metadata.role='super_admin'`. Production has no `profiles.role` column (migration 024 is local but unapplied — noted in blocker). `requireSuperAdmin()` uses service-role client for the profile lookup to avoid RLS blocking admin's read of own flag, matching `src/lib/admin/requireAdmin.ts`.
- **Slug choice: `jfb`, `wesley`, `geneva`, `marc-mannafest`** matching the repo's existing `src/lib/citations/scholars.ts`. Prompt originally proposed `jamieson-fausset-brown`, `wesley-nt`, `geneva-bible`, `pastor-marc-mannafest`. If Marcus prefers the longer form both the TS file and the DB rows need to change together.
- **Migration naming: continues `045_...sql` … `048_...sql`** (the 3-digit sequence already on disk; also matches the human-readable part of production's `YYYYMMDDHHmmss_NNN_name` version strings). Did not introduce the `2026_04_22_NNN_` date format from the original prompt.
- **RLS on editorial_notes added explicitly.** Original prompt did not specify RLS; amendment added it for consistency with the rest of the schema (`search_log`, `trails`, `user_notes`). Public SELECT where `status='published'`; deny-all for anon/authenticated; service-role (API routes) bypass cleanly. Revisions are fully locked down except via service-role.
- **Execution mode: MCP migrations + vault scratchpad for code.** Cowork sandbox git was broken ("No commits yet"; matches documented `.git/index` corruption quirk in STATUS §Known quirks). Auto-merge from inside the sandbox is impossible. All application files landed in `_ark/batch-4-5-output/` mirroring the target repo paths; Marcus pulls Windows-direct. DDL went to production via Supabase MCP `apply_migration` — no git needed.
- **Admin layout already gates `requireAdmin()`.** Admin server pages (commentary landing + chapter + editorial-notes list + editor) DON'T re-call `requireAdmin()` — the layout handles it. API routes DO call `requireSuperAdmin()` because the layout gate doesn't apply to /api/* routes.
- **`EditorialSlot` kept as Doctrine D.2 stub.** The batch prompt's in-context super-admin affordance for commentaries (Step 12) landed as the full-curation surface at `/admin/commentary/[bookSlug]/[chapter]`, not as a verse-page inline flip-on of `EditorialSlot`. Rationale: chapter-level commentaries + sizeable edit surface makes more sense in a dedicated admin panel than inline on the public verse page. The `EditorialSlot` → inline-composer flip is a future small batch. Noted in the pickup README so Marcus can decide whether to schedule it immediately.

## Verification

Pre-execution diagnostic (documented in blocker + amendment):

- Batch 3 dependencies present in code. STATUS.md drift resolved by Marcus confirming Batch 3 shipped (STATUS.md entry still needs Windows-direct backfill).
- Production DB schema inspected via MCP; schema plan rewritten to match.
- `set_updated_at()` function exists in production (required by migration 048).
- Pastor Marc's `profiles.is_admin=true` confirmed — auth won't lock out on day one.

Post-execution:

- All 4 migrations applied successfully (`apply_migration` returned `{success: true}`).
- Row counts match acceptance: 15 commentators / 0 unattributed commentaries / 0 editorial notes.
- `get_advisors` (security) surfaced 14 findings, all pre-existing on unrelated tables.

Not yet verified (requires post-pickup Windows-direct work):

- [ ] `pnpm lint` (or `npm run lint`) clean after copy-in
- [ ] `pnpm tsc --noEmit` clean
- [ ] `pnpm build` succeeds
- [ ] Production click-through on Gen 1:1 verse page confirms featured-excerpt render
- [ ] Drawer renders on Isaiah Mini-Bible hub, does NOT render on `/`, `/graph`, `/admin/*`, verse pages
- [ ] Super-admin curation flow: feature a verse, edit excerpt, saved excerpt renders publicly
- [ ] Editorial-notes flow: create → edit → revision written → soft-delete

## Followups / known gaps

- **STATUS.md Batch 3 decision-log entry.** Not backfilled by Cowork; Marcus to Windows-direct with the real commit hash + deploy timestamp.
- **Git sandbox repair.** `git reset --mixed HEAD` on Windows, per STATUS quirks. Required before any future Cowork batch that needs commit/push/merge.
- **Local-only migration backlog in `supabase/migrations/`.** Multiple 021-035-range migrations are in the repo but unapplied to production (`023_account_features.sql`, `024_super_admin_schema.sql`, `025_search_fts.sql`, several 030/031/032/033 parallel files). Out of scope for Batch 4+5; schedule a hygiene pass.
- **EditorialSlot flip-on.** The stub stays. Wiring the verse-page `EditorialSlot` to call into the new commentaries POST flow (create founder note via `author_type='founder'`) is a small follow-up batch.
- **Auto-merge.** Marcus manually merges the feature branch into main after Windows-direct copy + lint/tsc/build green. Feature branch name suggestion: `feat/batch-4-5-commentary-editorial` per the original prompt.
- **Post-merge ark update.** This session record is written; STATUS.md + BATCH_QUEUE.md updates happen in the Claude Project after Marcus confirms production.

## Pickup README

See `_ark/batch-4-5-output/README.md` for step-by-step Windows-direct instructions (install deps, copy files, run migrations locally if desired — they're already applied to prod — run lint/tsc/build, click through, commit, merge).

## Addendum — plumbing-commit landed (2026-04-22, end of session)

Marcus asked Cowork to actually commit the staged files to a feature branch before closing the session. Done. Steps taken:

1. Copied every file from `_ark/batch-4-5-output/` into its matching path in the code repo (under `C:\Users\marcd\Downloads\MannaFest`, mounted as `/sessions/great-adoring-bell/mnt/MannaFest` in the sandbox). Both patches (`src/app/layout.tsx`, `src/app/verse/[book]/[chapter]/[verse]/CommentaryVoices.tsx`) overwritten in place.
2. Updated `package.json` with the three new dependencies (`react-markdown@^9.0.1`, `rehype-sanitize@^6.0.0`, `remark-gfm@^4.0.0`), alphabetized in the `dependencies` block.
3. Plumbing-commit using `GIT_INDEX_FILE=/tmp/batch-4-5-idx` so the sandbox's corrupt on-disk index was never touched:
   - `git read-tree origin/main` (parent `c409eaf`) into the temp index
   - file-explicit `git add -- <file>` for each of the 34 files (per OPERATING_RULES §1 — no `git add -A`)
   - `git write-tree` → tree `79bb382d813213bf55360373a85f514e88cab389`
   - `git commit-tree <tree> -p origin/main -m "feat(batch-4-5): commentary curation + editorial notes drawer"` (GIT_AUTHOR/COMMITTER = "Marcus (Cowork) <contact@xerish.com>" to match origin/main's style) → commit `f4e1b96810f40f957b42aedc42bdc7b33eb68ecb`
   - `git update-ref refs/heads/feat/batch-4-5-commentary-editorial f4e1b96…`
4. Verified:
   - `git cat-file -p <commit>` shows parent = `c409eaf`, message exact, author/committer correct.
   - `git diff --stat origin/main <commit>` reports **34 files changed, 3200 insertions(+), 173 deletions(-)**. The 173 deletions are the replaced `layout.tsx` + `CommentaryVoices.tsx` content.
   - Spot-check: `layout.tsx` blob is 3626 bytes, `tr -d '\0' | wc -c` = 3626 (no NUL-padding — the documented sandbox file-corruption quirk did not affect this commit).
   - Tree contains `src/components/commentary/*`, `src/components/editorial-notes/*`, `supabase/migrations/045-048`, etc.
5. `git push` from the sandbox fails — no GitHub credentials in the sandbox env (no `GH_TOKEN` / `GITHUB_TOKEN` / `~/.netrc` / `~/.git-credentials`; HTTPS auth prompt disabled). The commit + ref are written to the Windows-mounted `.git` directly, so Marcus's Windows shell sees them natively. Push proceeds Windows-direct.

Marcus's Windows-direct pickup sequence becomes:

```powershell
cd C:\Users\marcd\Downloads\MannaFest
# Rebuild the on-disk index from HEAD (HEAD is still pointing at refs/heads/main,
# which doesn't locally exist — safe to rewrite the index from origin/main):
git reset --mixed origin/main
# Verify the feature branch ref is intact:
git rev-parse feat/batch-4-5-commentary-editorial    # should return f4e1b968…
git log --oneline feat/batch-4-5-commentary-editorial -5
# Push it:
git push -u origin feat/batch-4-5-commentary-editorial
# Then: install the three new deps, lint/tsc/build, production click-through.
# Merge via:
git checkout main
git pull --ff-only origin main
git merge --no-ff feat/batch-4-5-commentary-editorial -m "Merge batch 4+5: commentary curation + editorial notes"
git push origin main
```

`.git/objects/**/tmp_obj_*` detritus (the sandbox-mount quirk) will be cleaned up by the next `git gc` on Windows — harmless.

The three things Marcus asked for at session close (chapter-level deviation documented; EditorialSlot flip-on deferred; `get_advisors` clean) were already captured in the Decisions + Followups + Verification sections above. Cross-references for ease of audit:

- **Chapter-level deviation** — Summary paragraph + "Decisions" bullet ("Commentary granularity is chapter-level for sourced rows…") + Files-changed entry for `CommentarySection.tsx` (props `{ bookId, chapter, verseStart? }`) + Files-changed entry for the admin `[bookSlug]/[chapter]` route.
- **EditorialSlot flip-on deferred** — "Decisions" bullet ("`EditorialSlot` kept as Doctrine D.2 stub") + Followups bullet ("EditorialSlot flip-on. The stub stays…").
- **`get_advisors` zero new findings** — "Files changed — Supabase" ("0 new findings; 14 pre-existing findings on other tables…") + "Verification" ("get_advisors (security) surfaced 14 findings, all pre-existing on unrelated tables.").

Session closed.
