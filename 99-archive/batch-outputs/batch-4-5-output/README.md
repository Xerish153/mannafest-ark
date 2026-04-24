# Batch 4 + 5 — Pickup instructions (Windows-direct)

Cowork already applied the 4 DDL migrations to production Supabase.
The application code (components, API routes, admin pages, schema types,
patches) lives under this folder, mirroring the target repo paths.

Pull them into `C:\Users\marcd\Downloads\MannaFest` Windows-direct,
install the new deps, run lint/tsc/build locally, click through, then
commit + merge.

Feature branch suggestion: `feat/batch-4-5-commentary-editorial`.

---

## 0. (Once, if not already) Fix the sandbox git state in the code repo

Cowork could not operate on git (sandbox mount had a corrupted `.git/index`
— documented quirk). The fix on Windows, per `STATUS.md` §Known quirks:

```powershell
cd C:\Users\marcd\Downloads\MannaFest
git reset --mixed HEAD
# If HEAD.lock or index.lock block you:
Remove-Item -Force .git\HEAD.lock, .git\index.lock -ErrorAction SilentlyContinue
```

This is idempotent — safe to run whether or not the index is actually bad.

## 1. Install new dependencies

```powershell
cd C:\Users\marcd\Downloads\MannaFest
npm install react-markdown@^9 remark-gfm@^4 rehype-sanitize@^6
```

Verify `package.json`'s dependencies block picks up the three new entries.
See `_patches/package-json.md` for the exact diff.

## 2. Create a feature branch

```powershell
git checkout -b feat/batch-4-5-commentary-editorial
```

## 3. Copy application files into the repo

From this scratchpad, copy each file to the matching path under the code
repo. The tree under `_ark/batch-4-5-output/src/**/*` mirrors
`C:\Users\marcd\Downloads\MannaFest\src\**/*` one-to-one; same with
`_ark/batch-4-5-output/supabase/migrations/**/*`.

PowerShell one-shot:

```powershell
$src = "C:\Users\marcd\Documents\MannaFest\ark\batch-4-5-output"
$dst = "C:\Users\marcd\Downloads\MannaFest"
robocopy "$src\src" "$dst\src" /E /XO /XF README.md
robocopy "$src\supabase\migrations" "$dst\supabase\migrations" /XO
```

`/XO` preserves any local edits newer than the scratchpad. Double-check
that no new admin or verse-page files were touched mid-batch before
running.

### Patches (not drop-in copies — review each)

These live under `_patches/`:

- `app-layout-tsx-replacement.tsx` → replaces `src/app/layout.tsx` in
  full. The only substantive change is wrapping `{children}` in
  `<EditorialNotesDrawerProvider initialSuperAdmin={…}>`. `RootLayout`
  becomes `async` so it can `await isSuperAdmin()`.
- `verse-commentary-voices-replacement.tsx` → replaces
  `src/app/verse/[book]/[chapter]/[verse]/CommentaryVoices.tsx`. Same
  prop signature (`{ bookName, chapterNum }`) so no caller change.
  Internally resolves `bookId` + counts voices for Section meta, then
  delegates to `<CommentarySection />`.
- `package-json.md` → the dependency diff.

Open each, eyeball the change, and paste. Don't blind-copy — if you've
made any unrelated local edits to `layout.tsx` or `CommentaryVoices.tsx`
since your last push, you'll lose them.

## 4. Local sanity checks

```powershell
npm run lint
npx tsc --noEmit
npm run build
```

All three must be clean before committing. If `tsc` complains about any
new import, confirm the `react-markdown` / `remark-gfm` / `rehype-sanitize`
packages are installed and compatible — run `npm list react-markdown` to
verify the resolved version (expect 9.x).

## 5. Click-through acceptance (production)

With the build clean, deploy to a preview or directly to main per your
usual flow. Then on production:

- [ ] Open `/verse/genesis/1/1`. Commentary section renders with
      Matthew Henry as the featured voice (tradition chip "Puritan"),
      first 50 words of commentary_text as excerpt, attribution line.
      No "Show other voices" disclosure today (Henry is the only voice
      per chapter) — this is the expected state until Batch 6 ingests
      other PD commentators.
- [ ] Open the Isaiah Mini-Bible hub. Editor's Notes drawer tab renders
      on the right edge, muted (~30% opacity) because no notes exist.
- [ ] Homepage `/` — no drawer.
- [ ] `/graph` — no drawer.
- [ ] `/admin/commentary` — no drawer.
- [ ] `/verse/genesis/1/1` — no drawer.
- [ ] Sign in as Pastor Marc. Visit `/admin/commentary`, submit
      "genesis" + "1" — routes to `/admin/commentary/genesis/1`.
      Curation panel renders with the Matthew Henry row.
- [ ] Click "Feature this" with the default 50-word excerpt. Reload
      `/verse/genesis/1/1` — featured excerpt now matches the curated
      text (not auto-rank).
- [ ] On Isaiah Mini-Bible hub, open the drawer. Super-admin sees
      "+ Add editor's note" at top. Create a test note in markdown
      (try a link + code span), status=published. Drawer tab should
      flip to full opacity (editor-tradition green).
- [ ] Visit `/admin/editorial-notes`. The test note is in the list.
      Click Edit, change the body, save. Back on the Isaiah hub, the
      drawer reflects the edit.
- [ ] Click Hide on the note. Drawer stops showing it on the public
      surface; it remains at `/admin/editorial-notes` with status HIDDEN.

## 6. Commit + merge

File-explicit adds only (per OPERATING_RULES §1):

```powershell
git add `
  supabase/migrations/045_scholars_commentary_columns.sql `
  supabase/migrations/046_scholars_seed_commentators.sql `
  supabase/migrations/047_commentaries_curation_columns.sql `
  supabase/migrations/048_editorial_notes.sql `
  src/lib/supabase/schemas/scholars.ts `
  src/lib/supabase/schemas/commentaries.ts `
  src/lib/supabase/schemas/editorial_notes.ts `
  src/lib/supabase/server.ts `
  src/lib/auth/super-admin.ts `
  src/components/commentary `
  src/components/editorial-notes `
  src/components/markdown `
  src/app/api/commentary/[id]/route.ts `
  src/app/api/editorial-notes/route.ts `
  src/app/api/editorial-notes/[id]/route.ts `
  src/app/admin/commentary/page.tsx `
  src/app/admin/commentary/go/route.ts `
  src/app/admin/commentary/[bookSlug] `
  src/app/admin/editorial-notes `
  src/app/layout.tsx `
  src/app/verse/[book]/[chapter]/[verse]/CommentaryVoices.tsx `
  package.json `
  package-lock.json

git status   # sanity check
git commit -m "feat(batch-4-5): commentary curation + editorial notes drawer"
git push -u origin feat/batch-4-5-commentary-editorial
```

Then merge to main:

```powershell
git checkout main
git pull --ff-only
git merge --no-ff feat/batch-4-5-commentary-editorial -m "Merge batch 4+5: commentary curation + editorial notes"
git push origin main
```

Feature branch stays on origin as a rollback point per OPERATING_RULES §2.

## 7. Update the tracker

Add a decision-log entry to `STATUS.md` + `BATCH_QUEUE.md` in the Claude
Project:

```
- 2026-04-22 — Batch 4+5 shipped. Merge commit <hash> on main. Schema
  (migrations 045–048 applied live via MCP on 2026-04-22): scholars
  extended + 15 commentators seeded, commentaries + editorial_notes +
  revisions. Super-admin curation at /admin/commentary/[bookSlug]/[chapter],
  global editorial admin at /admin/editorial-notes, Editor's Notes drawer
  on every eligible page.
```

Mark Batch 4 + Batch 5 as shipped in BATCH_QUEUE.md.

## If something breaks

- **Migration needs rollback.** Use Supabase point-in-time recovery
  (OPERATING_RULES §2) — do NOT hand-write down-migrations.
- **`tsc` complains about server-only import from a client component.**
  The `requireSuperAdmin()` / `isSuperAdmin()` helpers are
  `import "server-only"`. If you see a client component pulling one in,
  that's a bug — replace with the `/api/me/is-admin`-style round-trip or
  move the check to a server-rendered parent.
- **Drawer appears on a page that shouldn't have it.** Update
  `isDrawerExcludedRoute(pathname)` in
  `src/lib/supabase/schemas/editorial_notes.ts`. The provider picks up
  the change on the next render.
- **`/admin/commentary/genesis/1` can't resolve the book.** The resolver
  is forgiving — lowercase + dash-to-space + ilike — but if you use a
  compound book slug the lookup may need tightening. The fallback logs
  to the server console.
- **Anything else unexpected.** Write `_ark/batch-4-5-blocker-2.md`
  before touching more of the codebase.
