# BATCH R1 — Production Repair

## READ FIRST
- `STATUS.md`
- `OPERATING_RULES.md`
- `BATCH_QUEUE.md`
- `MannaFest_Vision_v2_Locked.md`

## CONSTRAINTS

> - Single audience: the student of the Bible who wants to learn.
> - Open-source data only. No licensed content. Wesley Huff scholarship quality bar.
> - Guzik's Enduring Word is NOT CC-BY. Public-domain commentators only.
> - No AI-authored historical or theological claims.
> - Commentary always attributed. Traditions never flattened.
> - Debated content gets a page-level notice, not confidence badges.
> - 2D graph only. Desktop-first. Graph click opens side panel, never navigates.
> - Every node ships with ≥3 outgoing edges.
> - Full-density pages. No Beginner/Study/Deep gating.
> - Singular routes per `routes.md`.
> - KJV / WEB / ASV only.
> - No audio. No pastor workspace. No audience-specific pages. No premium tier.
> - "Shipped" = production click-through passes.

**Mode:** Full Write. You have repo write at `C:\Users\marcd\Downloads\MannaFest`, Supabase write via MCP, vault write at `C:\Users\marcd\Documents\MannaFest\ark`. Auto-merge to `main` on success.

---

## GOAL

Fix the eight production regressions from the April 18 audit so the homepage stops linking to 404s and a first-time visitor's first click lands on a live page.

---

## SCOPE

**Routes this batch owns:**
- Verse routes (`/verse/[id]` or `/bible/[book]/[chapter]/[verse]` — whichever is deployed)
- `/characters/*` pages
- `/sign-in`, `/sign-up`, `/auth/*`
- Homepage donation section
- `sitemap.ts` / sitemap generation

**Config:**
- `next.config.ts` / `package.json` build script — replace Turbopack with the stable Next bundler

**Supabase:**
- Read-only inspection only. The regressions are routing and rendering bugs, not schema bugs. No migrations in this batch.

---

## WORK

### 1. Branch
Create `repair/r1-production` off latest `main`.

### 2. Verse page 404s
Open the homepage in the repo and identify the exact route the Verse of the Day cross-reference chips link to. Query Supabase (read-only) for one of those verse IDs — e.g., the `verse_id` for John 3:16 — and confirm the row exists.

Then trace from the URL chip to the route handler. The break is almost certainly one of: (a) `generateStaticParams` is filtering out verse IDs that exist, (b) the route is fetching from the wrong table name, (c) the slug format between chip and route doesn't match. Fix it.

**Test:** all 4 Verse-of-the-Day cross-reference chips load real pages.

### 3. `/characters/abraham` 500 error
Open the `/characters/[slug]` page component. Likely cause: a missing relation in the Supabase query for Abraham's node, or a null field dereferenced in JSX (e.g., `character.dates.birth` when `dates` is null). Guard the null case and/or fix the query.

`/characters/abijah-king` currently works — compare what's different between Abraham's row and Abijah's to identify the specific null.

**Test:** `/characters/abraham` and `/characters/adam` both return 200 with rendered content.

### 4. `/sign-in` and `/sign-up` 404s
Cheapest fix: add 301 redirects from `/sign-in` → `/auth/signin` and `/sign-up` → `/auth/signup`. Put the redirects in `next.config.ts` under `redirects()`.

**Test:** both URLs land on a working auth page.

### 5. Singular/plural route convention
Audit deployed routes against `routes.md`. Any plural variant (e.g., `/characters/` where `routes.md` says `/character/`) gets a 301 to the singular. Do not rename existing working routes — add redirects from the non-canonical variant.

**Test:** 10 random URLs pulled from `sitemap.xml` all return 200.

### 6. Donation section
Add a donation section to the homepage, below the existing section-routing cards. Use the Stripe integration that's already in place. Copy:

> **Support MannaFest**
> MannaFest is free forever. If it has helped your study, consider a one-time gift or monthly support.

One-time and recurring options, recurring emphasized. Cash App and Venmo handles — **if the handles aren't on file in the repo or vault, write `ark/batch-R1-blocker.md` with what you need and halt.** Do not fabricate handles.

**Test:** donation section visible on homepage; Stripe button opens working checkout in test mode.

### 7. Turbopack → stable bundler
In `next.config.ts` (or the `build` script in `package.json`), remove `--turbopack` and any experimental Turbopack flags. Confirm `npm run build` succeeds locally before pushing.

**Test:** Vercel build log shows the stable Next bundler.

### 8. Sitemap
Regenerate `sitemap.ts` so it reads live routes from the app router manifest (or from Supabase where routes are data-driven), not from a static list. Sitemap must list only URLs that return 200.

**Test:** `sitemap.xml` on production contains zero dead URLs. Spot-check 10.

### 9. Auto-merge
When steps 1–8 are complete and `npm run lint` + `npx tsc --noEmit` + `npm run build` all pass:

```
git push --set-upstream origin repair/r1-production
git checkout main
git pull --ff-only origin main
git merge --no-ff repair/r1-production -m "merge: R1 production repair"
git push origin main
```

Vercel deploys automatically.

### 10. Update ark
Write `ark/STATUS.md` updates:
- Move R1 from "in flight" to the decision log with deploy timestamp
- Set `Health: 🟢 Green` if the click-through passes
- Append to `ark/sessions/2026-04-XX-batch-R1.md` with a terse summary of what changed

---

## DELIVERABLES

- All 8 regressions fixed on production
- `main` contains the merge commit
- Vercel build is green
- `ark/STATUS.md` updated
- Feature branch `repair/r1-production` remains on origin as rollback point

---

## ACCEPTANCE (click-through on mannafest.faith)

- [ ] Homepage loads
- [ ] All 4 Verse-of-the-Day cross-reference chips return 200 with real content
- [ ] `/characters/abraham`, `/characters/adam`, `/characters/moses` all return 200
- [ ] `/sign-in` redirects to a working auth page
- [ ] `/sign-up` redirects to a working auth page
- [ ] 10 random URLs from `sitemap.xml` return 200
- [ ] Donation section visible on homepage with working Stripe button
- [ ] Vercel build log shows stable bundler, not Turbopack

---

## OUT OF SCOPE

- Do not add new features
- Do not touch the 2D graph renderer or node/edge data
- Do not change the commentary schema
- Do not ingest new content
- Do not modify auth implementation (redirects only)
- Do not write or reorder content on existing character pages beyond what's needed to fix the 500

---

## IF YOU HIT A BLOCKER

Write `ark/batch-R1-blocker.md` with (a) what you found, (b) what you propose, (c) why you can't proceed. Halt. Marcus resolves in Claude. Never guess on ambiguity.

Specific expected blockers:
- Cash App / Venmo handles not in the repo or vault → halt on step 6
- Verse schema has a column rename you weren't expecting → halt on step 2
- Redirects require middleware rather than `next.config.ts` → halt and propose

Every other blocker same rule: write the file, halt, wait.
