# Batch 1.5 — Pre-change Audit

Date: 2026-04-20
Branch base: main @ 16a39b1
Scope file: `src/app/page.tsx` (+ `src/components/home/HomeDonate.tsx`)

## Current homepage layout (before this batch)

`src/app/page.tsx` renders, top to bottom:

1. **Hero search block** (lines ~121-154)
   - Eyebrow "The whole counsel of God · interconnected"
   - H1 "Study the Word. Follow the thread."
   - Centered search input → `/search?q=…`
   - Hint line "Try: John 3:16 · agape · the scarlet thread · Isaiah as a Mini-Bible"

2. **Verse of the Day showcase panel** (lines ~156-272)
   - Fetches today's VotD from Supabase `verse_of_the_day` table (by `day_of_year`)
   - Reference + theme chip
   - Verse text blockquote
   - Three hard-coded demo cross-reference chips (Rom 5:8, 1 Jn 4:9, Jn 17:3) with hover previews
   - Optional reflection
   - Three CTAs: "Open the study page", "See this verse in the graph", "Past verses"

3. **Section-routing cards** — 4-card grid (lines ~274-337):
   - /graph "Graph"
   - /study "Feature Pages"
   - /apologetics "Apologetics"
   - /graph/topics "Explore by Topic"

4. **HomeDonate** (line 340) — currently placed *between* the section cards and the footer, not between the hero and cards. This is the R1 placement. It is a boxed panel (`max-w-3xl`), not full-width.

5. **Site footer** (lines ~343-365) — inline nav with MANNAFEST wordmark, Feature Pages / Apologetics / About / Support / GitHub links.

Note: there is no `src/components/layout/` directory and no `SiteFooter` component. The footer is inlined inside `page.tsx`. The site header is inherited from `src/app/layout.tsx`.

## Route verification (the six tile destinations)

| Tile | Target route | Resolves to | Status |
|---|---|---|---|
| The Graph | `/graph` | `src/app/graph/page.tsx` | ✅ live |
| Isaiah as Mini-Bible | `/study/isaiah-mini-bible` | `src/app/study/isaiah-mini-bible/page.tsx` | ✅ live |
| Kings of Israel and Judah | `/characters/kings` | `src/app/characters/kings/page.tsx` | ✅ live |
| Apologetics | `/apologetics` | `src/app/apologetics/page.tsx` | ✅ live |
| Strong's Concordance | `/concordance` (canonical) — no `/strongs` route exists | `src/app/concordance/page.tsx` | ✅ live, substituted from `/strongs` |
| Verse of the Day | today's VotD permalink via `refToVerseUrl(…)` → `/verse/<slug>/<c>/<v>` | `src/app/verse/[book]/[chapter]/[verse]/page.tsx` | ✅ live |

About page (`/about`) also exists — mission section will link directly, no "coming soon" text needed.

## Implementation plan

1. Build feature branch `feature/homepage-launchpad` off main.
2. Create `src/components/home/`:
   - `HomeHero.tsx` (extracted search + tagline)
   - `FeatureTile.tsx` (generic tile shell + hover)
   - `FeatureGrid.tsx` (3×2 responsive grid)
   - `VerseOfDayTile.tsx` (VotD demoted to tile peer — fetches, shows ref + 80-char truncated text, navigates to verse page on click)
   - Six tile visuals live as pure-SVG snippets inside `FeatureGrid.tsx` (or individual small components).
3. Rewrite `HomeDonate.tsx` as full-width band: full-bleed section, inner `max-w-3xl`, 80px vertical padding, Venmo + Cash App buttons, single-sentence body.
4. Rewrite `src/app/page.tsx` to the five-section launchpad:
   - `<HomeHero />`
   - `<FeatureGrid />`
   - `<MissionBlurb />` (inline, 2-3 sentences + `/about` link)
   - `<HomeDonate />` (now full-width footer row)
   - existing inline footer (unchanged markup)
5. Remove old code paths from `page.tsx`: CROSSREF_DEMO, hoveredRef state, the big VoD panel, the 4-card SectionCard grid and its helper. `VerseOfDayTile` absorbs the VotD fetch + display responsibilities.

## Things confirmed out of scope

- Graph renderer, graph data, `/graph` route (Batch 2)
- New fonts or palette system (Batch 3) — reuse existing vars
- New /about page (Batch 13 — already exists, we just link)
- Routing changes or redirects
- Supabase schema changes (read-only fetch of today's VotD)
