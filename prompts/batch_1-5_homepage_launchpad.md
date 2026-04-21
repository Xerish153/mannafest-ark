# BATCH 1.5 — Homepage Launchpad + Donation Demotion

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

**Mode:** Full Write for code and vault. No GitHub credentials in your sandbox — commit to a feature branch locally and stop. Marcus pushes from Windows.

**Prerequisite:** R1 shipped on commit `96279cc`. Proceed directly on top of main.

---

## GOAL

Reshape the homepage from `search + verse-of-the-day + donation-request` into a **launchpad** that previews the site's best features, with donation demoted to a full-width footer row.

A first-time visitor lands and feels within 5 seconds: "there's a lot to explore here, and these are the places worth starting."

---

## SCOPE

**Files this batch owns:**
- `src/app/page.tsx` — homepage layout
- `src/components/home/HomeHero.tsx` — NEW (search + tagline)
- `src/components/home/FeatureTile.tsx` — NEW (single tile component)
- `src/components/home/FeatureGrid.tsx` — NEW (the 3×2 grid)
- `src/components/home/VerseOfDayTile.tsx` — NEW (repurposed VotD fits the tile grid)
- `src/components/home/HomeDonate.tsx` — RELOCATE + REDESIGN (full-width footer row)
- `src/components/layout/SiteFooter.tsx` or equivalent — add donation row as sibling/child above existing footer, OR add as its own section directly above `<footer>` in page.tsx if no SiteFooter component exists yet

**Supabase:** no schema changes. Read-only introspection if you need to pull preview copy from existing records.

---

## WORK

### 1. Branch
`feature/homepage-launchpad` off latest `main`.

### 2. Audit current homepage
Open `src/app/page.tsx`. Note: the R1 repair added `HomeDonate.tsx` between the hero area and the section-routing cards, or similar placement. Identify:
- Where search lives now
- Where Verse of the Day lives now
- Where the donation surface lives now
- Where existing "where to start" tiles live (if any)

Record in `ark/batch-1-5-audit.md` before changing anything.

### 3. New layout structure

The homepage renders these five sections in order, top to bottom:

1. **Hero** — site logo or name, one-line tagline, centered search bar. No other CTAs.
2. **Feature grid** — 3×2 grid of tiles (responsive: 2×3 on tablet, 1×6 on mobile). Section heading: "Start exploring."
3. **Recent / secondary content** — (optional, only if we already have a sensible surface — e.g., "recently added feature pages" or "latest commentary". If no clean source exists, skip this section entirely rather than fabricate content.)
4. **About / mission blurb** — 2-3 sentences on what MannaFest is and who it's for. Pull from Vision v2 §1 and §2. Small link to About Me page with note "(coming soon)" if that page doesn't exist yet.
5. **Donation footer row** — full-width band directly above the standard site footer links.

### 4. Hero component (`HomeHero.tsx`)

- Logo/name centered
- Tagline directly below, one line, serif: *"The Bible's data, so clear that the truth argues for itself."* (pulled from Vision v2 §2)
- Search bar centered, large (~600px max width on desktop), primary affordance
- Everything above-the-fold on a 1440×900 desktop viewport — visitor lands, sees the pitch, has the search ready, and can scroll to discover

### 5. Feature grid (`FeatureGrid.tsx` + 6 `FeatureTile` instances)

Section heading: "Start exploring."

**Six tiles, in this order:**

| # | Tile | Links to | Visual (SVG/CSS, no stock photos) | Subtitle |
|---|---|---|---|---|
| 1 | **The Graph** | `/graph` | Small force-graph preview — 15–20 nodes with edges, static SVG render of the real graph structure | "Every verse, word, and idea connected." |
| 2 | **Isaiah as Mini-Bible** | `/study/isaiah-mini-bible` (verify exact route) | Stylized "66" with two halves colored differently, hinting at the 39+27 structure | "66 chapters mirror 66 books. The pattern is real." |
| 3 | **Kings of Israel and Judah** | `/characters/kings` (verify exact route) | Small ribbon-timeline motif — parallel reigns stacked | "Two kingdoms, one God, forty kings." |
| 4 | **Apologetics** | `/apologetics` | Four small interlocking shapes representing the 4 pillars (Scientific / Moral / Mathematical / Historical) | "Steelmanned arguments, sourced responses." |
| 5 | **Strong's Concordance** | `/strongs` or the canonical Strong's index (verify exact route) | Stylized Hebrew letter + Greek letter overlaid | "Every Greek and Hebrew word. Traceable." |
| 6 | **Verse of the Day** | Today's VotD permalink | The current VotD reference in large serif + translation dropdown / chip-preview | "Today's verse. Tomorrow a different one." |

**Tile behavior:**
- Hover: gentle lift (2-4px translate-y), shadow, subtle color shift on accent stripe
- Click: navigate to target route
- Each tile has: top visual (aspect-ratio 4:3), title (serif, h3 size), one-line subtitle
- No tile links to a non-existent route — if the destination is 404, replace with a "coming soon" tile or swap in a known-live alternative
- All six tiles uniform size; grid uses CSS grid not flexbox for alignment

**Tile visual implementation:**
- Pure SVG or CSS. No external images, no stock photos, no photographs.
- Each visual is decorative-but-meaningful — it hints at the content without replacing a screenshot.
- If generating a graph preview for tile #1 is too heavy for this batch, a stylized SVG node-edge cluster is acceptable as a stand-in (not a screenshot).

### 6. Verse of the Day tile behavior

It's no longer the co-star. It's a peer to the other 5 tiles. BUT the VotD should still be functionally live:
- Displays today's verse reference and abbreviated text (first 80 chars)
- Clicking the tile navigates to the full verse page
- The existing cross-reference chip interaction is removed from the homepage (it belongs on the verse page itself)
- Translation switcher, if previously on homepage, is removed from homepage (belongs on verse page)

This demotion simplifies the hero significantly.

### 7. About / mission section

Short section below the feature grid, above the donation footer. One paragraph. Source wording from Vision v2 §1 and §2:

> MannaFest is built for the student of the Bible who wants to learn. Our mission is to present Scripture's data — manuscripts, prophecies, cross-references, archaeological anchors, linguistic roots, typological threads, commentary tradition — so clearly that the truth argues for itself. No polemics. No triumphalism. Just the data, interconnected, for anyone who wants to listen.

Link to `/about` if that page exists; otherwise render as plain text with a note "Full About page coming soon" (do NOT link to a 404).

### 8. Donation footer row (`HomeDonate.tsx` redesign)

**Placement:** full-width band, directly above the standard site footer links. Not a small corner link, not stuck on the first screen.

**Design:**
- Full-width container, distinct but subdued background (slightly darker than page, or a very soft accent tint — avoid aggressive colors)
- Center-aligned content, max-width ~900px
- Heading: "Support MannaFest" (h3, serif)
- Body: "MannaFest is free forever. If it's helped your study, consider a gift." (one sentence, no guilt-language)
- Two buttons side by side: **Venmo `@marc_brown11B`** and **Cash App `$MarcusBrownish`** (existing deep links from R1)
- Comfortable padding (~80px vertical on desktop)

**Remove** the current donation surface from its R1 placement (between hero and cards or wherever it currently is). It appears only once on the homepage, in the footer row.

### 9. Typography and spacing

- Use existing CSS vars. Do not introduce new typography — Batch 3 handles the Source Serif 4 rollout and we don't want overlap.
- Generous whitespace between sections (minimum 96px vertical on desktop, proportional on mobile).
- Max-width containers for prose and heading rows; full-width only for the donation band.

### 10. Responsive

- Desktop (≥1024px): 3×2 grid
- Tablet (640–1023px): 2×3 grid
- Mobile (<640px): 1×6 stacked
- Hero search bar stays centered and usable at all breakpoints
- Donation band stays readable, buttons stack on mobile

### 11. Acceptance (pre-push, local)
`npm run build` + `npm run lint` + `npx tsc --noEmit` all pass locally. Fix any issues introduced by this batch. Pre-existing lint warnings (the ~200 from April 17) are not in scope — leave them.

### 12. Commit and stop

Commit to `feature/homepage-launchpad`. Detailed commit message listing the feature tiles, the donation demotion, and any route verifications or substitutions you made. Do **not** attempt to push — your sandbox has no GitHub credentials.

Report back to Marcus with:
- Commit SHA
- List of files changed
- Any routes verified live vs any "coming soon" stand-ins
- Any deviations from this prompt (and why)

### 13. Update ark
- `ark/STATUS.md` — append to decision log: *"Batch 1.5 committed on `feature/homepage-launchpad`, awaiting push."*
- `ark/sessions/2026-04-XX-batch-1-5.md` — terse session record

---

## DELIVERABLES

- `feature/homepage-launchpad` branch exists locally with the work committed
- Homepage renders: hero → feature grid → mission blurb → donation footer row
- All 6 feature tiles link to live routes (or "coming soon" stand-ins for any 404s)
- Donation surface exists exactly once, in the footer row, full-width
- `ark/batch-1-5-audit.md` and `ark/sessions/...` updated

---

## ACCEPTANCE (click-through on mannafest.faith, AFTER Marcus pushes and Vercel deploys)

- [ ] Homepage loads
- [ ] Search bar centered, visible above-the-fold
- [ ] 6 feature tiles render as a 3×2 grid on desktop
- [ ] Each of the 6 tiles navigates to a live (200) page on click
- [ ] Verse of the Day tile shows today's verse and navigates to the full verse page
- [ ] Mission blurb is readable and sourced from Vision v2 language
- [ ] Donation footer row is full-width, immediately above the site footer, with working Venmo + Cash App buttons
- [ ] Donation does NOT appear anywhere else on the homepage
- [ ] Homepage renders cleanly on mobile (320px wide) with tiles stacked

---

## OUT OF SCOPE

- Do NOT touch the graph renderer, graph data, or `/graph` route (that's Batch 2)
- Do NOT introduce new fonts or the color/palette system (that's Batch 3)
- Do NOT create an About page (that's Batch 13)
- Do NOT change routing or add redirects
- Do NOT modify Supabase schemas
- Do NOT pre-build the Strong's page if it's not already live — link to whatever exists, or use a "coming soon" stand-in tile

---

## IF YOU HIT A BLOCKER

Standard rule. Write `ark/batch-1-5-blocker.md`, halt, wait.

Expected blockers:
- One or more of the 6 tile destination routes returns a 404 on current main → halt, list which ones, propose either (a) swap for a known-live route or (b) tile marked "coming soon" and not clickable. Don't fabricate.
- `HomeDonate.tsx` from R1 is structured in a way that makes relocation painful → halt, describe, propose deleting + rebuilding rather than relocating.
- The existing `page.tsx` layout has coupling that makes this batch grow beyond its scope → halt, describe, propose splitting into two passes.
