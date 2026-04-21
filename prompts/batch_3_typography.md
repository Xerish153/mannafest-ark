# BATCH 3 — Typography + Color + Citations + Diagram Library

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

**Mode:** Full Write. Auto-merge to `main` on success.

**Prerequisite:** Batch R1 merged. Batch 2 does not block this batch — safe to run in parallel with Batch 2 because the file sets don't overlap.

---

## GOAL

The site-wide visual and citation foundation every downstream batch consumes: one typeface family, a 66-book accent palette, a 10-tradition tag palette, a `<Cite />` popover component, and a library of 8 reusable SVG diagram components.

---

## SCOPE

**Files:**
- Root layout + global CSS — typography reset
- `src/lib/colors/bookAccents.ts`
- `src/lib/colors/traditionTags.ts`
- `src/components/cite/Cite.tsx` + usage retrofit on ≥20 pages
- `src/components/diagrams/` — 8 components + barrel export
- `src/app/components/diagrams/page.tsx` — demo page
- `src/components/shared/TraditionChip.tsx`
- `docs/design-system/palette-alignment.md`

**Supabase:** no schema changes.

---

## WORK

### 1. Branch
`feature/typography-and-design-system` off latest `main`.

### 2. Typography reset

Use `next/font/google` to load **Source Serif 4** with the subsets you need. Keep the existing CSS variables `--font-cinzel` and `--font-inter` but alias them to Source Serif 4 so existing class names like `font-[family-name:var(--font-cinzel)]` absorb the reset without per-file changes.

Three-size hierarchy, globally:
- `h1` — page title
- `h2` — section header
- `body` — default prose

Body prose capped at ~70ch max width.

Class utilities:
- `.scripture` — slightly larger, subtle left rule or indent, applies to every verse quotation sitewide
- `.commentary` — italic lead-in, attribution line beneath, small tradition-tag slot
- `.pull-quote` — oversize serif, indented, no quote marks needed

No mid-page font changes. Hierarchy is global.

### 3. Color system

**`src/lib/colors/bookAccents.ts`** — a map from each of the 66 book slugs to a hex color. Put the full map in the merge commit body so it's reviewable in git history. Text contrast remains WCAG AA wherever the accent appears.

**`src/lib/colors/traditionTags.ts`** — map from tradition name to hex:

- Reformed — deep blue
- Patristic — gold
- Jewish — olive
- Catholic — deep red
- Lutheran — forest
- Wesleyan — warm orange
- Anabaptist — slate
- Evangelical — rust
- Charismatic — magenta
- Academic — grey

**`<TraditionChip tradition="reformed" />`** — helper component rendering a small colored pill with tradition name.

**`docs/design-system/palette-alignment.md`** — short doc explaining how book accents and tradition tags coexist with the graph's node-type color palette. Where hues adjoin, differentiate by saturation/value. Do not modify the graph renderer in this batch; just document the reconciliation.

### 4. `<Cite />` component

`src/components/cite/Cite.tsx`. Typed props:

```ts
interface CiteProps {
  author: string;        // "Charles Spurgeon"
  work: string;          // "Treasury of David, Psalm 23"
  year: number;          // 1870
  page?: number;         // optional
  tradition: TraditionKey;
  chicago: string;       // pre-formatted Chicago author-date line
  voiceSlug: string;     // for routing to /scholars/[voiceSlug]
}
```

Render as an inline superscript number. On hover (desktop) or click (mobile), show a popover with:
- Author, work, year, page
- `<TraditionChip />` for the tradition
- The Chicago-formatted citation
- "View full bibliography →" link to `/scholars/[voiceSlug]` (or `/authors/[voiceSlug]` — use whichever exists; if both, prefer `/scholars/`)

### 5. `<Cite />` retrofit — 20 pages minimum

Apply `<Cite />` to existing pages. Target these surfaces:

- 8 existing study pages (whichever exist — Isaiah Mini-Bible for sure)
- Scholar/author detail pages' commentary sections
- Apologetics pillar entries
- Verse-page commentary tabs (where commentary attributions already exist)

**Do NOT touch these — owned by a future Jesus Cluster batch:**
- `/study/types-of-christ`
- `/study/judas`
- `/study/christology-convergence`
- `/titles/*`
- `/books/*`
- `/miracles/*`
- `/discourses/*`
- `/sayings/*`

### 6. Diagram component library

Eight SVG React components in `src/components/diagrams/`. Each is typed, data-driven, uses `bookAccents` and `traditionTags` palettes, includes `role="img"` + a descriptive `aria-label`. Barrel-export from `src/components/diagrams/index.ts`.

1. `<FloorPlan />` — Tabernacle, Temple layouts
2. `<ConcentricCircles />` — holy / holier / holiest zones
3. `<VennDiagram />` — 2 or 3 circles with labeled overlaps
4. `<Flowchart />` — DAG of nodes and directed edges
5. `<Fishbone />` — primary spine with branching causes
6. `<RibbonTimeline />` — NEW generic component. **Do NOT retrofit `/characters/kings` to use it in this batch — that's a later batch.**
7. `<GenealogyTree />` — descent chart with generational labels
8. `<ArcRainbow />` — decorative arcs preview of the future arc-diagram overview

Each component: SVG only, not Canvas. Typed props. No prop defaults that hide required data.

### 7. Diagram demo page

`/components/diagrams` — renders each of the 8 components with representative sample data. Used for design review and as a reference when downstream batches need to pick a diagram type.

### 8. Accessibility pass

Run a quick audit on the demo page and 20 retrofit pages: WCAG AA on all overlay text against book-accent and tradition-tag backgrounds. Fix contrast where it fails.

### 9. Test locally
`npm run build` + `npm run lint` + `npx tsc --noEmit` all clean.

### 10. Auto-merge
```
git push --set-upstream origin feature/typography-and-design-system
git checkout main && git pull --ff-only origin main
git merge --no-ff feature/typography-and-design-system -m "merge: typography + color + citations + diagram library"
git push origin main
```

### 11. Update ark
- `ark/STATUS.md` — move Batch 3 to decision log
- `ark/sessions/2026-04-XX-batch-3.md` — terse summary

---

## DELIVERABLES

- Source Serif 4 live on every page
- 66-book accent palette committed; visible on verse-reference hovers
- 10-tradition palette + `<TraditionChip />` shipped
- `<Cite />` component shipped and live on ≥20 pages
- 8 diagram components + `/components/diagrams` demo page shipped
- `docs/design-system/palette-alignment.md` committed
- Merge commit body contains the full 66-book color map for git-history review

---

## ACCEPTANCE (click-through on mannafest.faith)

- [ ] 20 random pages show the new serif body type
- [ ] Hover any verse reference → its book accent color is visible
- [ ] At least 20 pages show working `<Cite />` popovers (hover on desktop, click on mobile)
- [ ] `/components/diagrams` renders all 8 components with sample data
- [ ] `<TraditionChip />` appears on commentary attributions across the site
- [ ] No page exhibits WCAG AA contrast failures on sampled overlay text

---

## OUT OF SCOPE

- Do not retrofit every page in this batch — 20-page target is intentional
- Do not build the `/visualize` arc-diagram overview (future batch)
- Do not refactor `/characters/kings` to `<RibbonTimeline />`
- Do not touch the graph renderer or the side panel from Batch 2
- Do not touch any of the Jesus Cluster routes listed under §5
- Do not add audio

---

## IF YOU HIT A BLOCKER

Standard rule. Write `ark/batch-3-blocker.md`, halt, wait.

Likely blockers:
- `next/font` doesn't load Source Serif 4 subsets you need → fall back to Source Serif Pro (the older sibling with full Latin coverage) and note it in the blocker file for approval, but do not silently swap
- Existing CSS var names `--font-cinzel` / `--font-inter` don't match what's actually in the codebase → halt and name what you found
- Twenty pages worth of `<Cite />` retrofit targets don't have structured citation data in the DB yet → halt, report how many you could retrofit, propose a schema addition for the rest
