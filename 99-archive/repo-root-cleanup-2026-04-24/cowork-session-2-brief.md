# Cowork Session 2 Brief — MannaFest Frontend Vision Completion

**Issued by:** Marcus Brown
**Date:** 2026-04-16 (or whenever Session 1 completes — Cowork should verify timing on start)
**Authorization:** Marcus has explicitly authorized credit spend; quality is the constraint, not cost. Opus default is fine. Run end-to-end. Push to GitHub and Vercel when ready.
**Mount:** Repo only — `C:\Users\marcd\Downloads\MannaFest`

---

## 0. Identity, scope, discipline

You are operating in **Cowork**. You have local filesystem access to the MannaFest Next.js repo and Supabase MCP access.

**Project ID:** `ufrmssiqjtqfywthgpte` ONLY. Never `becyawhjsibrbyzicqxt` (that's Xerish — a different project documented in a different vault called the Atrium, separate from this work).

**Repo path:** `C:\Users\marcd\Downloads\MannaFest`
**Repo origin:** `https://github.com/Xerish153/mannafest.git`
**Stack:** Next.js App Router (TypeScript), Supabase, Vercel
**Live site:** https://mannafest.faith

**Operating mode:**
- Work autonomously. Don't pause to ask Marcus questions unless something is genuinely blocked.
- Verify after every major step. Stream phase-level status updates to the chat.
- Commit to git after each completed phase. Push when explicitly noted.
- This session is repo-only mounted; the Ark vault is NOT accessible. Skip any instructions from the previous session brief that would write to the Ark. Document outcomes in the chat instead.

**Cost discipline:** Marcus has authorized full Opus spend. Use whatever model Cowork ships with. Quality > cost.

---

## 1. Pre-flight state audit

Before starting any phase, run these checks and report results:

```bash
# Repo cleanliness
cd C:\Users\marcd\Downloads\MannaFest
git status
git log --oneline -10
git branch --show-current

# Verify package.json
cat package.json | findstr "\"name\\|\"version\\|next\\|three\\|react-force-graph"

# Check for prior 3D graph work
dir components\explore 2>NUL
dir lib\featureFlags.ts 2>NUL
dir hooks\useGraphPreference.ts 2>NUL
```

**Supabase verifications:**
```sql
SELECT 'apocrypha_works' t, COUNT(*) FROM apocrypha_works
UNION ALL SELECT 'connection_explanations', COUNT(*) FROM connection_explanations
UNION ALL SELECT 'biblical_characters_prophets', COUNT(*) FROM biblical_characters WHERE category='Prophet'
UNION ALL SELECT 'translations', COUNT(*) FROM translations
UNION ALL SELECT 'apologetics', COUNT(*) FROM apologetics;
```

Report:
- Current branch + last 10 commits
- Whether 3D graph component files already exist (could indicate Session 1 actually did them — if so, Phase 1 is mostly done)
- Whether `react-force-graph-3d` is in package.json
- Database row counts (especially `connection_explanations` — if >50 it means Session 1's bulk batch ran)

If anything looks unexpected, pause and report before proceeding.

---

## 2. Phase sequence

Eight phases. Each has a clear goal, actions, verification, commit message, and failure handling. Run sequentially. After each phase, append a short status block to the chat.

---

### PHASE 1 — 3D Nebula Graph implementation

**Goal:** Implement feature-flagged 3D graph view in the existing Next.js app. Was deferred from Session 1.

**Pre-flight:**
- `git status` should be clean. If uncommitted changes exist, stash them with a comment first.
- Identify where the existing graph component lives (likely `app/explore/page.tsx` or `components/Graph*.tsx`). Read the current implementation and report what library is in use.

**Step 1A — Install dependencies:**
```bash
npm install react-force-graph-3d three
```

Verify versions in `package.json`. Note: `three` should be a pinned version; report what was installed.

**Step 1B — Feature flag plumbing:**

Create `lib/featureFlags.ts`:
```typescript
export const GRAPH_3D_ENABLED = process.env.NEXT_PUBLIC_GRAPH_3D_ENABLED === 'true';

export function getGraphMode(
  userPreference: '2d' | '3d' | null,
  isDesktop: boolean
): '2d' | '3d' {
  if (!isDesktop) return '2d';
  if (!GRAPH_3D_ENABLED) return '2d';
  if (userPreference === '2d') return '2d';
  return '3d';
}
```

Add to `.env.local`:
```
NEXT_PUBLIC_GRAPH_3D_ENABLED=true
```

Add to `.env.example`:
```
NEXT_PUBLIC_GRAPH_3D_ENABLED=false
```

**Step 1C — Create components:**

`components/explore/Graph3D.tsx`:
- Dynamic import of `react-force-graph-3d` with `ssr: false` (it's a WebGL component)
- Props: `nodes`, `links`, `onNodeClick`, `onLinkClick`, `width`, `height`
- Background: deep space gradient via CSS variable `--color-space-bg` with fallback `#0a0a1a`
- Node color by `node.type`:
  - `verse=#e8d4a2` (gold)
  - `prophecy=#10b981` (emerald)
  - `theme=#3b82f6` (sapphire)
  - `person=#a855f7` (amethyst)
  - `commentary=#94a3b8` (slate)
- Node radius capped 4–12 by edge degree count
- Link color by `link.relationship_type`:
  - `typology=#fbbf24`
  - `prophecy_fulfillment=#10b981`
  - `thematic=#60a5fa`
  - `cross_reference=rgba(148,163,184,0.15)`
  - `commentary=rgba(120,120,140,0.1)`
- Particle trails: `linkDirectionalParticles=2` for typology + prophecy_fulfillment, 0 for cross_reference
- Bloom post-processing via `three/examples/jsm/postprocessing/UnrealBloomPass`
- Camera: PerspectiveCamera with OrbitControls (smooth zoom + rotate)
- Loading state: show a skeleton with "Loading the cosmos..." text

`components/explore/Graph2D.tsx`:
- Extract existing 2D logic (or wrap existing component)
- Same props signature as Graph3D for swap-ability

`components/explore/ConnectionPanel.tsx`:
- Slides in from right when a link is clicked (use Framer Motion or CSS transitions)
- Fetches matching `connection_explanations` row by `(source_node_id, target_node_id, connection_type)` where `connection_type` maps from the link's `relationship_type`
- Renders: title, summary, full_explanation (markdown via `react-markdown`), scholarly_notes, hebrew_greek_analysis if present, key_verses, confidence badge
- Falls back to "No deep explanation available yet" with CTA: "Suggest a connection explanation" linking to a contact form or GitHub issue
- Mobile: renders as a bottom sheet (full-width, ~70vh) instead of right sidebar

`hooks/useGraphPreference.ts`:
```typescript
import { useState, useEffect } from 'react';

export function useGraphPreference(): [
  '2d' | '3d' | null,
  (mode: '2d' | '3d') => void
] {
  const [pref, setPref] = useState<'2d' | '3d' | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('mannafest:graph-mode');
    if (stored === '2d' || stored === '3d') setPref(stored);
  }, []);

  const update = (mode: '2d' | '3d') => {
    localStorage.setItem('mannafest:graph-mode', mode);
    setPref(mode);
  };

  return [pref, update];
}
```

**Step 1D — Modify `app/explore/page.tsx`:**

```typescript
'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { GRAPH_3D_ENABLED, getGraphMode } from '@/lib/featureFlags';
import { useGraphPreference } from '@/hooks/useGraphPreference';
import ConnectionPanel from '@/components/explore/ConnectionPanel';

const Graph2D = dynamic(() => import('@/components/explore/Graph2D'), { ssr: false });
const Graph3D = dynamic(() => import('@/components/explore/Graph3D'), { ssr: false });

export default function ExplorePage() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [userPref, setUserPref] = useGraphPreference();
  const [activeLink, setActiveLink] = useState(null);
  // ... fetch nodes + links from /api/graph/edges?layer=core ...

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mq.matches);
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const mode = getGraphMode(userPref, isDesktop);

  return (
    <div className="relative h-screen w-screen">
      {isDesktop && GRAPH_3D_ENABLED && (
        <button
          onClick={() => setUserPref(mode === '3d' ? '2d' : '3d')}
          className="absolute top-4 right-4 z-10 px-4 py-2 bg-slate-800/80 text-white rounded"
        >
          Switch to {mode === '3d' ? '2D' : '3D'}
        </button>
      )}
      {mode === '3d' ? (
        <Graph3D nodes={nodes} links={links} onLinkClick={setActiveLink} />
      ) : (
        <Graph2D nodes={nodes} links={links} onLinkClick={setActiveLink} />
      )}
      <ConnectionPanel link={activeLink} onClose={() => setActiveLink(null)} />
    </div>
  );
}
```

**Step 1E — Edge filtering API + LOD:**

Create or modify `app/api/graph/edges/route.ts`:
```typescript
export async function GET(request: Request) {
  const url = new URL(request.url);
  const layer = url.searchParams.get('layer') || 'core';
  const focusNodeId = url.searchParams.get('focus_node_id');
  const limit = parseInt(url.searchParams.get('limit') || '500', 10);

  // 'core' = typology + prophecy_fulfillment + thematic (~169 edges, always loaded)
  // 'commentary' = commentary edges (~1189)
  // 'crossref' = cross_reference edges within 1 hop of focus_node_id (paginated)

  let query = supabase.from('graph_edges').select('*');
  if (layer === 'core') {
    query = query.in('relationship_type', ['typology','prophecy_fulfillment','thematic']);
  } else if (layer === 'commentary') {
    query = query.eq('relationship_type', 'commentary');
  } else if (layer === 'crossref' && focusNodeId) {
    query = query.eq('relationship_type', 'cross_reference')
      .or(`source_node_id.eq.${focusNodeId},target_node_id.eq.${focusNodeId}`)
      .limit(limit);
  }
  const { data, error } = await query;
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ edges: data });
}
```

Add layer toggle UI in explore page header — checkboxes for "Typology / Prophecy / Themes / Commentary / Cross-references" — each calls the layer fetcher. Reset View button returns to core only.

LOD thresholds in Graph3D:
- <500 visible nodes → labels always shown
- 500–2000 → labels on hover only
- >2000 → no labels, just colored points

**Step 1F — Mobile polish:**
- Hide the 2D/3D toggle on mobile entirely (handled by `isDesktop` check above)
- ConnectionPanel renders as bottom sheet on `<lg` breakpoints — use Tailwind responsive classes like `fixed bottom-0 left-0 right-0 lg:top-0 lg:right-0 lg:bottom-0 lg:left-auto lg:w-96`

**Verification:**
1. `npm run build` — must succeed with no TypeScript errors. Report bundle size delta.
2. `npm run dev` and manually test:
   - `/explore` on desktop with flag ON → 3D nebula renders with ~169 edges
   - Click a link → ConnectionPanel slides in with content
   - Toggle to 2D → renders 2D graph; reload preserves preference
   - Layer checkbox: toggle Commentary on → ~1189 more edges appear
   - Mobile viewport (DevTools) → 2D only, no toggle visible, ConnectionPanel as bottom sheet
3. Take screenshots: desktop 3D, desktop 2D, mobile 2D, ConnectionPanel open. Save to `public/docs/screenshots/2026-04-16-3d-graph/`.

**Git commit:**
```bash
cd C:\Users\marcd\Downloads\MannaFest
git add app/ components/ lib/ hooks/ public/ package.json package-lock.json .env.example
git commit -m "feat(explore): 3D nebula graph with feature flag, LOD, and ConnectionPanel

- react-force-graph-3d for desktop (NEXT_PUBLIC_GRAPH_3D_ENABLED gated)
- 2D fallback on mobile and as user preference (localStorage)
- Progressive edge loading: core (~169) -> commentary -> cross-ref on focus
- ConnectionPanel reads from connection_explanations table
- LOD thresholds at 500 and 2000 visible nodes
- Mobile renders ConnectionPanel as bottom sheet"
git push origin main
```

**Vercel deploy:** Should auto-deploy from main push. Verify by checking https://mannafest.faith/explore and confirming the 3D graph renders.

**On failure:**
- Build error → stop, report exact errors, do not commit
- Visual quirks → commit what builds, document concerns in chat for Marcus to triage
- WebGL crash on his hardware → 2D path is the safety net; toggle should still work

---

### PHASE 2 — Translation Compare feature

**Goal:** Side-by-side verse view across translations. The Living Status doc lists this as in-flight and a closing-the-loop priority.

**Pre-flight:**
Run `SELECT name, abbreviation, COUNT(*) AS verse_count FROM translations t LEFT JOIN verses v ON v.translation_id = t.id GROUP BY t.id, name, abbreviation ORDER BY verse_count DESC;` to confirm which translations have verse content seeded. Report counts.

**Step 2A — Backend:**

Create `app/api/verses/compare/route.ts`:
```typescript
// GET /api/verses/compare?ref=John+3:16&translations=KJV,WEB,ASV
// Returns: { verses: [{ translation, text, footnotes }] }
```

Logic: parse the reference (book, chapter, verse), look up verses for each requested translation in the `verses` table, return aligned results.

Edge cases: handle multi-verse refs (`John 3:16-18`), handle missing translations gracefully (return empty text with note).

**Step 2B — Frontend component:**

Create `components/verses/TranslationCompare.tsx`:
- Verse reference input (with autocomplete on book names)
- Translation selector chips (multi-select, default to KJV+WEB)
- Side-by-side grid layout on desktop (2-3 columns based on selection count)
- Stacked single-column layout on mobile
- Synced scroll if verses are long passages
- Word-level diff highlighting for first selected vs others (use `diff-words` or similar) — optional, can defer if complex

**Step 2C — Integrate into verse pages:**

On every verse study page (`app/verse/[ref]/page.tsx` or wherever they live):
- Add a "Compare translations" button
- Clicking opens the TranslationCompare component pre-filled with the current verse and KJV+WEB+ASV selected
- On mobile: opens as a full-screen modal
- On desktop: opens as a slide-over panel

**Verification:**
1. Build succeeds
2. Manually test on `/verse/john-3-16`:
   - Click Compare → side-by-side renders
   - Add ASV chip → third column appears
   - Remove KJV → first column disappears
   - Mobile viewport → stacked layout
3. Test on a long passage like `Romans 8:1-39` — synced scroll behavior

**Git commit:**
```bash
git add app/ components/
git commit -m "feat(verses): translation compare side-by-side view

- /api/verses/compare endpoint
- TranslationCompare component with chip selector + responsive layout
- Integrated on every verse study page"
git push origin main
```

---

### PHASE 3 — Apologetics section architecture + scaffold

**Goal:** Build the apologetics section structure with 20 seed entries. Living Status doc lists this as a roadmap priority with zero structure built. Spec it now so content can parallelize later.

**Step 3A — Schema (Supabase MCP):**

Apply migration `apologetics_v2_categories`:
```sql
-- Existing apologetics table has 30 entries. Extend it with category structure.
ALTER TABLE apologetics ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE apologetics ADD COLUMN IF NOT EXISTS subcategory TEXT;
ALTER TABLE apologetics ADD COLUMN IF NOT EXISTS confidence_badge TEXT CHECK (confidence_badge IN ('high','medium','speculative'));
ALTER TABLE apologetics ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Lookup table for categories
CREATE TABLE IF NOT EXISTS apologetics_categories (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0
);

INSERT INTO apologetics_categories (slug, title, description, icon, sort_order) VALUES
  ('mathematical','Mathematical evidences','Equidistant letter sequences, numerical patterns, statistical signatures','calculator',1),
  ('historical','Historical evidences','Archaeological and historical corroboration of biblical accounts','scroll',2),
  ('archaeological','Archaeological evidences','Physical findings that intersect biblical narrative','pickaxe',3),
  ('prophetic','Prophetic fulfillment','Predicted events historically fulfilled with documentation','eye',4),
  ('manuscript','Manuscript tradition','Dead Sea Scrolls, Masoretic, Septuagint preservation evidence','book-open',5),
  ('philosophical','Philosophical arguments','Cosmological, teleological, moral, ontological frameworks','brain',6),
  ('scientific','Scientific intersections','Where Scripture and natural science align or interact','atom',7)
ON CONFLICT (slug) DO NOTHING;
```

Verify: `SELECT slug, title FROM apologetics_categories ORDER BY sort_order;`

**Step 3B — Categorize the existing 30 entries:**

Read existing `apologetics` rows and assign categories based on content. Use Supabase MCP to inspect a sample first:
```sql
SELECT id, title, LEFT(description, 200) AS preview FROM apologetics ORDER BY id LIMIT 30;
```

Then UPDATE each row with appropriate `category`, `subcategory`, and `confidence_badge`. Use Opus reasoning to classify intelligently — don't ask Marcus to do it row by row.

**Step 3C — Generate 20 seed entries** (additions, not replacements):

Categories should be reasonably balanced. Suggestions:
- **Mathematical (3):** Equidistant Letter Sequences (ELS) overview, the Genesis 1:1 numerical signature, the 153 fish of John 21
- **Historical (3):** Hezekiah's tunnel inscription, the Pilate stone, the Caiaphas ossuary
- **Archaeological (3):** Walls of Jericho stratigraphy debate, House of David inscription (Tel Dan stele), Hittite empire confirmation
- **Prophetic (3):** Tyre prophecy (Ezekiel 26), Cyrus prophecy (Isaiah 44-45), Daniel's 70 weeks
- **Manuscript (3):** Dead Sea Scrolls textual continuity with Masoretic, P52 (John fragment), the Septuagint's role in NT quotations
- **Philosophical (3):** Cosmological argument (Kalam), the moral argument, the resurrection minimal facts argument
- **Scientific (2):** Cosmic fine-tuning constants, the origin of biological information

Each entry needs: title, summary (1-2 sentences), description (3-5 paragraphs of substantive content), scholarly references, confidence_badge.

**Confidence badge philosophy** (per Living Status doc — "Speculative content is opt-in only with explicit confidence badges"): 
- `high` = mainstream scholarly consensus or strong primary-source documentation
- `medium` = reasonable scholarly support, some debate
- `speculative` = patterns or claims that are intriguing but not broadly endorsed; opt-in to view

Apply badges honestly. The Bible codes / ELS material should generally be `speculative`. Manuscript and archaeology can mostly be `high`. Some prophetic interpretations are `medium`.

**Step 3D — Apologetics UI:**

Create `app/apologetics/page.tsx`:
- Category grid landing page with icon + title + description per category
- Toggle: "Show speculative content" off by default

Create `app/apologetics/[category]/page.tsx`:
- List entries in that category
- Each entry shows confidence badge prominently
- Speculative entries hidden by default unless toggle is on

Create `app/apologetics/[category]/[slug]/page.tsx`:
- Full entry page with description, references, related Scripture links

**Verification:**
1. Schema migration succeeded; categories table populated
2. Existing 30 entries categorized
3. 20 new entries inserted
4. UI renders all three page levels
5. Speculative toggle works

**Git commit:**
```bash
git add app/apologetics/ supabase/migrations/
git commit -m "feat(apologetics): category architecture + 20 seed entries + UI

- 7 categories (mathematical, historical, archaeological, prophetic, manuscript, philosophical, scientific)
- Confidence badge system (high / medium / speculative)
- Existing 30 entries categorized; 20 new added
- Three-level UI (landing / category / entry)
- Speculative content opt-in toggle"
git push origin main
```

---

### PHASE 4 — Mobile responsive audit

**Goal:** Every page renders cleanly at 375px width. Living Status doc Option 5.

**Step 4A — Inventory:**
List all top-level routes:
```bash
dir /b /s app\*page.tsx
```
Report the count.

**Step 4B — Audit script:**

For each route, do the following:
1. Open in dev mode at 375px viewport (Chrome DevTools)
2. Check for horizontal scroll (any?)
3. Check tap targets are >=44px
4. Check text doesn't overflow
5. Check images scale properly
6. Check the new 3D graph forces 2D on mobile (regression check)
7. Check ConnectionPanel renders as bottom sheet
8. Check TranslationCompare stacks properly
9. Check apologetics pages render

**Step 4C — Fix:**

Use Tailwind responsive utilities. Common patterns:
- Add `overflow-x-hidden` to body if horizontal scroll persists
- Replace fixed widths with `max-w-` utilities
- Replace `flex-row` with `flex-col md:flex-row` where appropriate
- Replace `text-2xl` with `text-xl md:text-2xl` for headings
- Add `min-h-[44px]` to clickable elements

Document each change in commit message.

**Verification:**
- All routes render cleanly at 375px
- No horizontal scroll anywhere
- Screenshots saved to `public/docs/screenshots/2026-04-16-mobile-audit/`

**Git commit:**
```bash
git add app/ components/ public/
git commit -m "fix(mobile): responsive audit pass — 375px clean across all routes

- [list specific files changed]
- Screenshots in public/docs/screenshots/"
git push origin main
```

---

### PHASE 5 — Performance optimization

**Goal:** Page load times under 3s LCP, no jank on the 3D graph at 169 nodes, smooth interaction up to 2000 visible nodes.

**Step 5A — Measure baseline:**
```bash
npm run build
npm run start
```
Run Lighthouse on `/`, `/explore`, `/verse/john-3-16`, `/apologetics`. Report LCP, CLS, TBT, bundle size.

**Step 5B — Quick wins:**
- `next/image` for any `<img>` tags
- Add `loading="lazy"` to below-fold images
- Verify code-splitting on the 3D graph (already dynamic-imported in Phase 1, good)
- Add `Suspense` boundaries around heavy components
- Compress static assets if any are unoptimized

**Step 5C — Database query optimization:**

For `/api/graph/edges`:
- Add Postgres EXPLAIN ANALYZE on the core layer query
- If slow, consider creating a materialized view: `mv_core_graph_edges` containing pre-filtered typology+prophecy+thematic edges
- Add indexes if any are missing on `relationship_type` or `(source_node_id, target_node_id)`

For `connection_explanations` lookup on link click:
- Should be fast already (we have indexes from migration), but verify with EXPLAIN

**Step 5D — Frontend bundle analysis:**
```bash
npm install -D @next/bundle-analyzer
```
Add to `next.config.ts` and run `ANALYZE=true npm run build`. Identify any large packages and lazy-load them.

**Verification:**
- Lighthouse scores: Performance >85 on key pages, LCP <3s
- 3D graph stays >30 FPS at 169 edges
- No memory leaks during 5-min interaction test

**Git commit:**
```bash
git add app/ components/ next.config.ts package.json
git commit -m "perf: lighthouse pass + bundle optimization + edge query tuning

- [list optimizations applied]
- Lighthouse scores: [before/after]"
git push origin main
```

---

### PHASE 6 — AI Personalization framework (basic)

**Goal:** Two personalization surfaces on the dashboard for logged-in users. Living Status doc Option 4.

**Step 6A — Schema (Supabase MCP):**

Apply migration `user_study_history`:
```sql
CREATE TABLE IF NOT EXISTS user_study_history (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  node_id BIGINT REFERENCES graph_nodes(id) ON DELETE CASCADE,
  node_type TEXT NOT NULL,
  visited_at TIMESTAMPTZ DEFAULT NOW(),
  duration_seconds INTEGER,
  metadata JSONB DEFAULT '{}'::jsonb
);
CREATE INDEX IF NOT EXISTS idx_ush_user_visited ON user_study_history(user_id, visited_at DESC);
CREATE INDEX IF NOT EXISTS idx_ush_node ON user_study_history(node_id);

CREATE TABLE IF NOT EXISTS user_suggestions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  surface TEXT NOT NULL CHECK (surface IN ('continue_studying','because_you_studied','recommended_connections')),
  node_id BIGINT REFERENCES graph_nodes(id) ON DELETE CASCADE,
  reasoning TEXT,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  shown_count INTEGER DEFAULT 0,
  clicked BOOLEAN DEFAULT FALSE
);
CREATE INDEX IF NOT EXISTS idx_us_user_surface ON user_suggestions(user_id, surface);
```

**Step 6B — History tracking:**

Create middleware or page-level hook that records visits:
- On verse page mount: insert into `user_study_history` with node_id of that verse, node_type='verse'
- Track duration via beforeunload event or visibility change
- Throttle: don't insert duplicates within 60 seconds

`hooks/useStudyTracking.ts`:
```typescript
export function useStudyTracking(nodeId: number, nodeType: string) {
  const { user } = useUser();
  useEffect(() => {
    if (!user) return;
    const startTime = Date.now();
    fetch('/api/user/study-history', {
      method: 'POST',
      body: JSON.stringify({ node_id: nodeId, node_type: nodeType }),
    });
    return () => {
      const duration = Math.round((Date.now() - startTime) / 1000);
      // beacon-style update with duration
    };
  }, [nodeId, nodeType, user]);
}
```

Wire into verse pages, character pages, prophecy pages, apocrypha pages.

**Step 6C — Suggestion generation:**

Create a server action or scheduled job that, for each active user, generates suggestions:

`lib/personalization/generateSuggestions.ts`:
1. Read user's last 50 visits
2. Identify recurring themes (most-visited types, books, topics)
3. Build prompts to Claude API with that history + the connection_explanations / commentaries database, asking for 3 "you might explore" recommendations
4. Critically: respect the "commentary never flattened" rule — suggestions should surface specific sources (e.g., "Spurgeon on Psalm 23"), not paraphrase them
5. Insert into `user_suggestions`

Either trigger on login, or via a Vercel cron weekly. Cron is cleaner.

**Step 6D — Dashboard surfaces:**

In `app/dashboard/page.tsx` (or wherever logged-in landing is):
- "Continue studying" card: shows last 3 incomplete study sessions (verses visited but not "completed" — define a heuristic like "visited <2min")
- "You might explore" card: shows 3 from `user_suggestions` where `surface='because_you_studied'`
- Both with click-through tracking

**Verification:**
- Schema applied
- Visiting verse pages records to user_study_history
- Suggestion generation produces non-empty results for a test user
- Dashboard renders both surfaces

**Git commit:**
```bash
git add app/ components/ hooks/ lib/ supabase/migrations/
git commit -m "feat(personalization): user study history + AI suggestion surfaces

- user_study_history + user_suggestions tables
- Visit tracking on verse/character/prophecy/apocrypha pages
- Two dashboard surfaces: Continue studying, You might explore
- Suggestion generation respects 'commentary never flattened' rule"
git push origin main
```

**Note:** Full AI personalization is multi-iteration. This phase ships the framework. Quality of suggestions improves with usage data.

---

### PHASE 7 — Diagnostic spelunking

**Goal:** Resolve the three open questions Marcus has been carrying.

**7A — discovery_prompts gap:**
Marcus's status doc claims 497 entries from batches 1-5; DB shows 97. Investigate.

```sql
SELECT COUNT(*) FROM discovery_prompts;
SELECT MIN(created_at), MAX(created_at), COUNT(DISTINCT DATE(created_at)) AS distinct_days FROM discovery_prompts;
SELECT category, COUNT(*) FROM discovery_prompts GROUP BY category ORDER BY count DESC;
```

Look at the time distribution. If all 97 are clustered on one day, that's likely batch 1 only landing. If spread across 5 days, batches 2-5 partially failed. Report findings.

If the missing batches need regeneration, document what category targets they had in `_inbox/discovery-prompts-recovery.md` (in chat, since Ark isn't mounted). Marcus can decide to commission a recovery batch later.

**7B — bible_patterns table:**
Status doc claims 13 entries; table doesn't exist.

```sql
SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name ILIKE '%pattern%';
```

If truly absent, was it renamed? Check git history for any migration touching "patterns":
```bash
cd C:\Users\marcd\Downloads\MannaFest
git log --all --oneline -- supabase/migrations/ | findstr -i "pattern"
```

If genuinely never created and Marcus wants the feature, sketch the schema in chat for him to confirm before applying.

**7C — typology_maps → graph_edges propagation:**
DB shows 154 typology_maps but only 16 typology edges in graph_edges. Need a sync.

```sql
-- Find typology_maps not yet propagated
SELECT tm.id, tm.ot_node_id, tm.nt_node_id, tm.typology_type
FROM typology_maps tm
LEFT JOIN graph_edges ge
  ON ge.relationship_type='typology'
  AND ge.source_node_id=tm.ot_node_id
  AND ge.target_node_id=tm.nt_node_id
WHERE ge.id IS NULL;
```

Should return ~138 rows. INSERT them into graph_edges:
```sql
INSERT INTO graph_edges (source_node_id, target_node_id, relationship_type, weight, description, created_by)
SELECT tm.ot_node_id, tm.nt_node_id, 'typology', 0.9, COALESCE(tm.description, tm.typology_type), 'sync-from-typology_maps'
FROM typology_maps tm
LEFT JOIN graph_edges ge
  ON ge.relationship_type='typology'
  AND ge.source_node_id=tm.ot_node_id
  AND ge.target_node_id=tm.nt_node_id
WHERE ge.id IS NULL
AND tm.ot_node_id IS NOT NULL
AND tm.nt_node_id IS NOT NULL;
```

Verify count grew. Report final graph_edges typology count (should be 154 + the existing 16 = 170, give or take any duplicates).

**Git commit:** Diagnostic phase doesn't change repo files. DB changes are tracked via Supabase migrations (apply migration `sync_typology_maps_to_graph_edges`).

---

### PHASE 8 — Final integration, build, deploy, push

**Goal:** Verify everything still works together, deploy to production.

**Steps:**
1. `git status` — should be clean (everything committed in prior phases)
2. `npm run build` — must succeed
3. `npm run lint` — fix any new lint errors introduced
4. `git push origin main` — final push (most pushes happened per-phase, this catches stragglers)
5. Verify Vercel deploy succeeds (check deployment URL in Vercel dashboard or via `vercel ls` if CLI is configured)
6. Smoke test https://mannafest.faith :
   - Homepage loads
   - `/explore` renders 3D graph (desktop) or 2D (mobile)
   - Click a link → ConnectionPanel works
   - `/verse/john-3-16` → translation compare works
   - `/apologetics` → category landing renders
   - Dashboard (if logged in) → personalization surfaces appear

**Final summary message to Marcus:**

Produce one clean phase-by-phase status report:
1. ✅ / ⚠️ / ❌ status per phase
2. Key artifacts produced (files created, DB rows added, UI features shipped)
3. Vercel deployment URL and live status
4. Lighthouse scores before/after Phase 5
5. Anything that didn't land cleanly
6. Suggested follow-ups for Session 3 (which Marcus already has the plan for):
   - Bulk content batches in the Ark (apocrypha, connection_explanations, character bios) if Session 1 didn't finish them
   - Scholar profile depth audit
   - Bible codes section
   - Isaiah Mini-Bible study route
   - Interlinear Hebrew/Greek view
   - Audio/pronunciation
   - Community study groups (if scoped)
   - Public API for third-party Bible study apps (if scoped)

---

## 3. Failure handling

- **Single retry on transient errors.** Same error twice → stop the current phase, report, continue to next phase if not blocking.
- **Schema migration failure → STOP everything, report, do not proceed.** Database integrity is non-negotiable.
- **Frontend build failure → stop the current phase, report exact errors, do not commit broken code.**
- **Vercel deploy failure → push is fine, but flag the deploy issue to Marcus immediately. Don't keep building features on a broken deploy.**
- **`npm install` failure → stop, report, do not commit half-installed state.**

---

## 4. Identity reminder

This work is for **MannaFest** (Supabase project `ufrmssiqjtqfywthgpte`).
The Atrium and Xerish (`becyawhjsibrbyzicqxt`) are separate and not relevant to this brief.
If you ever find yourself about to query Xerish or write to the Atrium, you have made a serious mistake.

---

## End of brief

Begin with Phase 0 state audit, then proceed through Phases 1–8. Stream phase-level updates. Don't wait for permission between phases unless something genuinely fails.

When ready, respond: "Cowork ready. Starting Phase 0 state audit." Then begin.
