# BATCH 1.5a — Homepage Amendment (hero copy + Isaiah tile visual)

## READ FIRST
- `C:\Users\marcd\Documents\MannaFest\ark\prompts\batch_1-5_homepage_launchpad.md` (the parent batch you already executed)
- `C:\Users\marcd\Documents\MannaFest\ark\OPERATING_RULES.md`
- `C:\Users\marcd\Documents\MannaFest\ark\03-sessions\2026-04-20-batch-1-5.md` (your own session record from the prior run)

## CONSTRAINTS

Same non-negotiables block as the parent batch. Nothing changes.

**Mode:** Full Write on repo. Your sandbox has NO GitHub credentials. Commit on top of the existing `feature/homepage-launchpad` branch (parent commit `96262c8`) and STOP. Marcus pushes from Windows.

---

## GOAL

Two small copy/visual changes to the homepage launchpad that shipped as commit `96262c8` on `feature/homepage-launchpad`. Branch has not been pushed yet — this amendment goes on top as a second commit, then Marcus pushes the branch.

---

## SCOPE

**Two files, that's it:**
- `src/components/home/HomeHero.tsx` — replace the tagline
- `src/components/home/FeatureGrid.tsx` — replace the Isaiah Mini-Bible tile visual (tile #2 of 6)

**Do NOT touch** any other homepage component. Do NOT touch the mission blurb (it links to /about, which is correct). Do NOT touch the 5 other tile visuals. Do NOT touch HomeDonate.tsx. Do NOT touch page.tsx unless it contains the hero copy directly — if hero copy is inside HomeHero.tsx, leave page.tsx alone.

---

## WORK

### 1. You are already on `feature/homepage-launchpad` with parent `96262c8`

Verify with `git log --oneline -1` before starting. You should see commit `96262c8` as HEAD. Working tree should be clean (`git status --short` empty).

If not, halt and report — don't guess.

### 2. Hero copy change (HomeHero.tsx)

The current tagline (from Vision v2 §2) is: *"The Bible's data, so clear that the truth argues for itself."*

Replace it with this two-part hero structure:

**Primary heading** (large serif, same size class as the current tagline):

> Explore the whole counsel of God.

**Subtitle** (one size smaller, serif, no italic, slightly dimmed color vs. primary — use the existing tagline's sibling text styling if any; otherwise a `text-neutral-400`-class equivalent):

> Sixty-six books. Forty authors. Three continents. Fifteen hundred years. One unbroken witness, woven together with a coherence no human hand could orchestrate.

**Layout requirements:**
- Primary heading and subtitle stay above the fold on a 1440×900 desktop viewport
- Subtitle wraps to 2–3 lines naturally at that viewport; don't force-break it with `<br />` tags
- Subtitle max-width tighter than the primary heading — roughly 72ch so the lines feel calm
- Spacing between primary and subtitle: comfortable but not cavernous (~24–32px)
- No drop caps, no italic on the subtitle, no decorative quote marks

Reference — Acts 20:27 KJV, from which "whole counsel of God" comes: *"For I have not shunned to declare unto you all the counsel of God."* You don't need to cite this on the page. The phrase earns its weight on its own.

### 3. Isaiah Mini-Bible tile visual change (FeatureGrid.tsx)

The current visual for tile #2 ("Isaiah as Mini-Bible") is a large "66" split by a dashed vertical line with "39 · 27" underneath. Marcus's feedback: *"a large 66 doesn't communicate the idea well enough."*

**Replace with:** an open Bible SVG, viewed from above, with connection arcs arcing across from the left page to the right page.

**Design spec:**
- Open-book silhouette, roughly horizontal orientation. Left page and right page clearly separated by a center binding seam that curves gently (pages aren't flat — they bow up slightly along the spine).
- Both pages subtly tinted with the existing tile-accent color at low opacity so the Bible reads as present but not garish. The binding/spine is slightly darker.
- Each page has a few faint horizontal "text lines" at the top to signal "this is pages of a book," not heavy — just 4–6 thin lines across each page, highly translucent.
- **Connection arcs:** 5 to 8 smooth bezier curves arcing from points on the left page to points on the right page. Arcs rise above the plane of the pages (curve up), thin strokes, same accent color family at moderate opacity.
- Arc endpoints sit at varied heights on each page — not a uniform grid — so the pattern feels organic, like real cross-references, not a data visualization.
- The visual reads within one second as: "open Bible, many things on the left connecting to many things on the right."
- No text inside the visual. No numbers. No "39 · 27" caption.
- Same SVG `viewBox` / overall aspect ratio as the other 5 tile visuals — match what `FeatureTile.tsx` expects so the grid stays uniform.
- `role="img"` and an `aria-label="An open Bible with connections arcing from Old Testament to New Testament chapters"` on the SVG.

**Keep unchanged:**
- Tile title: "Isaiah as Mini-Bible"
- Tile subtitle: "66 chapters mirror 66 books. The pattern is real."
- Link destination: `/study/isaiah-mini-bible`
- Tile frame, hover behavior, everything else about the tile

Purely an inner-visual swap.

### 4. Verification

- `npx tsc --noEmit` — clean
- `npm run lint` — no new errors in the two files you touched (pre-existing warnings from April 17 stay untouched)
- `npm run build` — same Bus-error sandbox quirk as the parent batch; Marcus handles build-verification on Windows before pushing. Note this in your report.

### 5. Commit

File-explicit git add. Never `-A` or `.`. Commit message:

> `feat(homepage): amend hero copy + Isaiah tile visual`
>
> Hero: replace "truth argues for itself" tagline with "Explore the whole counsel of God" invitation + evidence subtitle (sixty-six books, forty authors, three continents, fifteen hundred years).
>
> Isaiah Mini-Bible tile: replace stylized "66" numeric with open-Bible SVG + cross-page connection arcs, communicating interconnection visually rather than numerically.

Both changes apply to work in `96262c8` on the same feature branch. No new files. Two files modified.

Leave the working tree clean after commit — do NOT run `npm run lint --fix` or any auto-formatter that retouches files post-commit. Final `git status --short` must be empty.

### 6. Update ark

Append a short note to `ark/03-sessions/2026-04-20-batch-1-5.md` recording the amendment commit SHA and the two changes. Do NOT create a new session file — this is an amendment to the existing session.

---

## DELIVERABLES

- New commit on `feature/homepage-launchpad` with the two changes
- Parent of new commit: `96262c8`
- Files changed: exactly two (`HomeHero.tsx` and `FeatureGrid.tsx`)
- Working tree clean
- Ark session record amended

---

## ACCEPTANCE (after Marcus pushes + Vercel preview deploys green)

- [ ] Hero reads "Explore the whole counsel of God." as primary heading
- [ ] Subtitle reads exactly as specified
- [ ] Primary + subtitle fit above the fold on desktop
- [ ] Isaiah Mini-Bible tile shows an open Bible with cross-page connection arcs
- [ ] Isaiah tile no longer shows "66" or "39 · 27"
- [ ] All other homepage elements (search, 5 other tiles, mission blurb, donation footer) unchanged
- [ ] Mobile: hero subtitle wraps cleanly, Isaiah tile SVG scales without distortion

---

## OUT OF SCOPE

- Mission blurb copy — already correct, do not touch
- Other 5 tile visuals — leave as-is
- Donation footer — leave as-is
- Any new routes, new components, or Supabase changes
- Typography system overhaul (Batch 3)
- Color palette system (Batch 3)

---

## IF YOU HIT A BLOCKER

Write `ark/batch-1-5a-blocker.md` and halt. Standard rule.

Expected blockers:
- The SVG viewBox / aspect ratio convention the other 5 tiles use isn't consistent → halt, propose a consistent ratio and deviate only with Marcus's OK
- `HomeHero.tsx` places the tagline via a prop from `page.tsx` rather than in the component itself → report where the string actually lives and wait for an amendment
- The `.git/index` corruption issue that affected the parent batch recurs → use the same plumbing workaround you used last time; note it in the report
