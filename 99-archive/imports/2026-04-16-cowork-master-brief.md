# Cowork Master Brief — MannaFest Session 1 Completion

**Issued by:** Marcus Brown
**Date:** 2026-04-16
**Authorization:** Marcus has explicitly authorized credit spend; quality is the constraint, not cost. Opus default is fine. Run end-to-end. Push to GitHub when steps complete.

---

## 0. Identity, scope, and discipline

You are operating in **Cowork**. You have local filesystem access and Supabase MCP access.

**Project identifier — burn this in:**
- **MannaFest** Supabase project ID is `ufrmssiqjtqfywthgpte`. Every `execute_sql` and `apply_migration` call MUST target this project. Never query, reference, or write to `becyawhjsibrbyzicqxt` (that is **Xerish**, a separate project documented in a separate vault called the Atrium — zero crossover, ever).
- The MannaFest repo is at `C:\Users\marcd\Downloads\MannaFest`.
- The Ark vault is at `C:\Users\marcd\Documents\MannaFest\ark`.
- Marcus's Downloads folder is `C:\Users\marcd\Downloads`.

**Naming discipline:**
- The vault for MannaFest is **the Ark**. Never call it the Atrium. The Atrium is for Xerish only.

**Operating mode:**
- Work autonomously. Do NOT pause to ask Marcus questions unless something is genuinely blocked (file truly missing, Supabase MCP error after retry, git push auth failure).
- Verify after every major step. Report verification results in your running log to Marcus.
- Commit to git after each completed phase. Push when explicitly noted.
- Update the Ark session log incrementally as you complete phases (don't wait until the end).

---

## 1. Files in Marcus's Downloads folder you must locate first

These four files were generated in a Claude.ai chat and downloaded to `C:\Users\marcd\Downloads`:

| Filename | Final destination |
|---|---|
| `CLAUDE.md` | `C:\Users\marcd\Documents\MannaFest\ark\00-meta\CLAUDE.md` |
| `apocrypha-exemplars-v1.json` | `C:\Users\marcd\Downloads\MannaFest\apocrypha-exemplars-v1.json` (project root, used by Phase 4) |
| `connection-explanations-exemplars-v1.json` | `C:\Users\marcd\Downloads\MannaFest\connection-explanations-exemplars-v1.json` (project root, used by Phase 5) |
| `ark-session-log-2026-04-16.md` | `C:\Users\marcd\Documents\MannaFest\ark\03-sessions\2026-04-16-handoff-1.md` (overwrite the placeholder) |

**Phase 0 first action:** Verify all four files are present in Downloads. If any are missing, stop and report to Marcus by name which ones are missing.

---

## 2. Current verified state (as of session start — do not redo these)

A state audit was completed in Claude.ai before handing this brief to you. Trust it but verify the most expensive checks if quick:

**Ark vault — already exists at `C:\Users\marcd\Documents\MannaFest\ark`:**
- 15 folders created (00-meta, 01-architecture, 02-content/{apocrypha,connections,prophecies,characters,scholars,typology}, 03-sessions, 04-prompts/{haiku,sonnet}, 05-decisions, 06-todos, _inbox, 99-archive)
- `00-meta/README.md` — exists
- `00-meta/conventions.md` — exists
- `06-todos/active.md` — exists (empty checklist)
- `05-decisions/0001-vault-naming.md` — exists
- `03-sessions/2026-04-16-handoff-1.md` — exists as placeholder (you will overwrite)
- `.gitignore` — exists
- Git initialized with one commit: "ark: initial vault structure for MannaFest"
- **Missing: `00-meta/CLAUDE.md`** — you will copy this from Downloads in Phase 1

**Database `ufrmssiqjtqfywthgpte` — three migrations already landed:**
- ✅ Migration `create_apocrypha_tables` — created `apocrypha_works`, `apocrypha_connections`, `intertestamental_period` (all empty, 0 rows each)
- ✅ Migration `create_connection_explanations` — created `connection_explanations` (empty, 0 rows)
- ✅ Migration `prophecy_status_normalization` — added `fulfillment_visual_indicator` to both `messianic_prophecies` and `prophecies`; normalized all status values to lowercase-hyphenated; populated visual indicators; CHECK constraints in place. Final counts:
  - `messianic_prophecies` (309 rows): 241 fulfilled, 17 partially-fulfilled, 50 unfulfilled, 1 debated
  - `prophecies` (40 rows): 33 fulfilled, 6 partially-fulfilled, 1 unfulfilled

**Do not re-run these migrations.** If you check `information_schema` and they are present, move on. If they are somehow not present, stop and report.

**Quick verification query you may run if you want to confirm before proceeding:**
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema='public'
AND table_name IN ('apocrypha_works','apocrypha_connections','intertestamental_period','connection_explanations');
-- Expected: 4 rows

SELECT 'mp' t, COUNT(*) c FROM messianic_prophecies WHERE fulfillment_visual_indicator IS NOT NULL
UNION ALL SELECT 'p', COUNT(*) FROM prophecies WHERE fulfillment_visual_indicator IS NOT NULL;
-- Expected: mp=309, p=40
```

---

## 3. Execution sequence — phases run in order

Each phase has: goal, actions, verification, commit message, and what to do if it fails.

After each phase, append a short status block to `Ark/03-sessions/2026-04-16-handoff-1.md` under a heading like `## Phase N status — [timestamp]`.

---

### PHASE 1 — File relocation + CLAUDE.md placement

**Goal:** Get all four downloaded files to their correct destinations.

**Actions:**
1. Move `C:\Users\marcd\Downloads\CLAUDE.md` → `C:\Users\marcd\Documents\MannaFest\ark\00-meta\CLAUDE.md`
2. Move `C:\Users\marcd\Downloads\apocrypha-exemplars-v1.json` → `C:\Users\marcd\Downloads\MannaFest\apocrypha-exemplars-v1.json`
3. Move `C:\Users\marcd\Downloads\connection-explanations-exemplars-v1.json` → `C:\Users\marcd\Downloads\MannaFest\connection-explanations-exemplars-v1.json`
4. Move `C:\Users\marcd\Downloads\ark-session-log-2026-04-16.md` → `C:\Users\marcd\Documents\MannaFest\ark\03-sessions\2026-04-16-handoff-1.md` (overwrite placeholder)
5. Create file `C:\Users\marcd\Documents\MannaFest\ark\00-meta\file-routing.md` with the contents from Appendix A at the bottom of this brief (so future downloaded files have a documented routing map).

**Verification:** All four destinations contain a non-empty file. CLAUDE.md is approximately 4KB. Both JSONs are >30KB each. Session log is approximately 4KB.

**Git commit (Ark only — repo doesn't change in this phase):**
```
cd C:\Users\marcd\Documents\MannaFest\ark
git add 00-meta/ 03-sessions/
git commit -m "ark: place CLAUDE.md, file-routing reference, and full session log"
```
Do not push yet.

**On failure:** If a Downloads file is missing, stop and tell Marcus by exact filename which one(s).

---

### PHASE 2 — Verify schema state matches expectations

**Goal:** Confirm the three already-applied migrations are intact before importing data.

**Actions:**
Run the two verification queries from Section 2 above. Report results in the session log.

**Expected output:**
- Four tables present
- 309 + 40 = 349 prophecy rows all have visual indicators

**On failure:** If migrations are NOT present (which would be very surprising given the audit), apply them from Appendix B at the bottom of this brief. If present but counts are off, stop and report — do not attempt to fix prophecy data without Marcus's direction.

**No commit.** No git changes happen here.

---

### PHASE 3 — Import apocrypha exemplars

**Goal:** Populate `apocrypha_works`, `apocrypha_connections`, and (where applicable) `intertestamental_period` from `apocrypha-exemplars-v1.json`.

**Actions:**
1. Read `C:\Users\marcd\Downloads\MannaFest\apocrypha-exemplars-v1.json`
2. The JSON contains a `works` array (5 entries) and a `connections` array (7 entries).
3. For each work: build an INSERT into `apocrypha_works` using all fields from the JSON. Use `ON CONFLICT (slug) DO NOTHING`. Use `RETURNING id` to capture the new id.
4. For each connection: look up its `apocrypha_work_id` from the inserted works (via the `apocrypha_work_slug` field in the JSON), then resolve `canonical_node_id` by querying `graph_nodes` for `(label LIKE '<book> <chapter>:<verse>%' OR (book_id matches AND chapter_num=X AND verse_num=Y))`. If no match, set `canonical_node_id = NULL` but populate `canonical_reference` text. Then INSERT into `apocrypha_connections`.
5. After all inserts, run:
   ```sql
   SELECT category, COUNT(*) FROM apocrypha_works GROUP BY category;
   SELECT connection_type, COUNT(*) FROM apocrypha_connections GROUP BY connection_type;
   SELECT COUNT(*) AS unresolved FROM apocrypha_connections WHERE canonical_node_id IS NULL;
   ```

**Verification:** 5 works inserted (categories: 3 deuterocanonical, 1 pseudepigrapha, 1 dead_sea_scrolls), 7 connections inserted, unresolved count reported (some unresolved is fine — Marcus can seed nodes later).

**Archive:** Move the JSON to `C:\Users\marcd\Documents\MannaFest\ark\99-archive\imports\2026-04-16-apocrypha-exemplars-v1.json`.

**Git commit (Ark only):**
```
cd C:\Users\marcd\Documents\MannaFest\ark
git add 99-archive/
git commit -m "ark: archive apocrypha exemplars JSON after import"
```

**On failure:** Report exactly which insert failed and the error message.

---

### PHASE 4 — Import connection_explanations exemplars

**Goal:** Populate `connection_explanations` from `connection-explanations-exemplars-v1.json`.

**Actions:**
1. Read `C:\Users\marcd\Downloads\MannaFest\connection-explanations-exemplars-v1.json`
2. The JSON contains an `explanations` array of 10 entries.
3. For each entry, resolve `source_node_id` and `target_node_id` from `graph_nodes`:
   - For `type: verse` resolution hints: match by `type='verse'` AND book label match AND `chapter_num=X` AND `verse_num=Y`
   - For `type: theme` resolution hints: match by `type='theme'` AND `label ILIKE '%<term>%'`
   - For `type: person` resolution hints: match by `type='person'` AND `label ILIKE '%<name>%'`
   - **If no match found, INSERT a new graph_nodes row first** (with the type, label, and any inferable book/chapter/verse) and use that returned id.
4. INSERT each entry into `connection_explanations` with the resolved IDs and ALL narrative fields verbatim from the JSON. Use `ON CONFLICT (source_node_id, target_node_id, connection_type) DO NOTHING` (the partial unique index already exists for non-null pairs).
5. Verification:
   ```sql
   SELECT connection_type, COUNT(*) FROM connection_explanations GROUP BY connection_type ORDER BY connection_type;
   SELECT COUNT(*) AS total FROM connection_explanations;
   ```

**Expected:** 10 entries inserted spanning typology / language / numerical / messianic-thread / chiasmus / quotation / allusion. Report any new graph_nodes you had to create.

**Archive:** Move JSON to `Ark/99-archive/imports/2026-04-16-connection-explanations-exemplars-v1.json`.

**Git commit (Ark only):**
```
cd C:\Users\marcd\Documents\MannaFest\ark
git add 99-archive/
git commit -m "ark: archive connection_explanations exemplars JSON after import"
```

---

### PHASE 5 — Prophecy audit reports

**Goal:** Generate two markdown reports inside the Ark documenting the post-normalization state.

**Actions:**
1. Run audit query for "fulfilled but undocumented":
   ```sql
   SELECT id, title, ot_reference, nt_reference, fulfillment_details
   FROM messianic_prophecies
   WHERE fulfillment_status = 'fulfilled'
   AND (nt_reference IS NULL OR nt_reference = '' OR fulfillment_details IS NULL OR fulfillment_details = '')
   ORDER BY id;
   ```
2. Save results as a markdown table to `Ark/02-content/prophecies/2026-04-16-fulfillment-audit.md`. Header: "# Fulfilled prophecies missing supporting NT data — 2026-04-16". Include column headers, then one row per result.
3. Sample 5 random rows from each fulfillment_status bucket:
   ```sql
   (SELECT 'fulfilled' bucket, id, title, ot_reference, nt_reference FROM messianic_prophecies WHERE fulfillment_status='fulfilled' ORDER BY RANDOM() LIMIT 5)
   UNION ALL
   (SELECT 'partially-fulfilled', id, title, ot_reference, nt_reference FROM messianic_prophecies WHERE fulfillment_status='partially-fulfilled' ORDER BY RANDOM() LIMIT 5)
   UNION ALL
   (SELECT 'unfulfilled', id, title, ot_reference, nt_reference FROM messianic_prophecies WHERE fulfillment_status='unfulfilled' ORDER BY RANDOM() LIMIT 5)
   UNION ALL
   (SELECT 'debated', id, title, ot_reference, nt_reference FROM messianic_prophecies WHERE fulfillment_status='debated' ORDER BY RANDOM() LIMIT 5);
   ```
4. Save as `Ark/02-content/prophecies/2026-04-16-spot-check.md`. Header: "# Visual indicator spot-check — 2026-04-16". Group by bucket.

**Do NOT auto-fill any missing fields.** Marcus will commission a separate batch later if he wants the audit gaps closed.

**Git commit (Ark only):**
```
cd C:\Users\marcd\Documents\MannaFest\ark
git add 02-content/prophecies/
git commit -m "ark: prophecy fulfillment audit + visual indicator spot-check"
```

---

### PHASE 6 — 3D nebula graph implementation

**Goal:** Implement feature-flagged 3D graph view in the MannaFest Next.js app. This is the single largest engineering phase. Take the time it needs.

**Pre-flight:**
- Working directory: `C:\Users\marcd\Downloads\MannaFest`
- Stack: Next.js App Router on Vercel, TypeScript, Tailwind (verify by reading `package.json`)
- Stage current `main` clean before starting. If there are uncommitted changes, stop and ask Marcus.

**Step 6A — Inspect & install:**
1. Read `app/explore/page.tsx` (or wherever the existing graph component lives). Report what library is currently used.
2. `npm install react-force-graph-3d three`
3. Read `package.json` to confirm versions installed.

**Step 6B — Feature flag plumbing:**
1. Create `lib/featureFlags.ts`:
   ```typescript
   export const GRAPH_3D_ENABLED = process.env.NEXT_PUBLIC_GRAPH_3D_ENABLED === 'true';
   export function getGraphMode(userPreference: '2d' | '3d' | null, isDesktop: boolean): '2d' | '3d' {
     if (!isDesktop) return '2d';
     if (!GRAPH_3D_ENABLED) return '2d';
     if (userPreference === '2d') return '2d';
     return '3d';
   }
   ```
2. Add `NEXT_PUBLIC_GRAPH_3D_ENABLED=true` to `.env.local` (create if not present). Add to `.env.example` as `NEXT_PUBLIC_GRAPH_3D_ENABLED=false` (default off).

**Step 6C — Components:**
1. Create `components/explore/Graph3D.tsx`:
   - Use `react-force-graph-3d` (dynamic import with `ssr: false`)
   - Props: `nodes`, `links`, `onNodeClick`, `onLinkClick`
   - Background: deep space gradient via CSS variable `--color-space-bg` with fallback `#0a0a1a`
   - Node color by `node.type`: `verse=#e8d4a2`, `prophecy=#10b981`, `theme=#3b82f6`, `person=#a855f7`, `commentary=#94a3b8`
   - Node sizing: capped between 4 and 12 by edge degree
   - Link color by `relationship_type`: `typology=#fbbf24`, `prophecy_fulfillment=#10b981`, `thematic=#60a5fa`, `cross_reference=rgba(148,163,184,0.15)`, `commentary=rgba(120,120,140,0.1)`
   - Particle trails: `linkDirectionalParticles=2` for typology + prophecy_fulfillment, 0 for cross_reference
   - Bloom post-processing via `three/examples/jsm/postprocessing/UnrealBloomPass`
   - Camera: PerspectiveCamera + OrbitControls
2. Create `components/explore/Graph2D.tsx` — extract existing 2D logic into its own component (or wrap the existing component if it's already isolated).
3. Create `components/explore/ConnectionPanel.tsx`:
   - Slides in from the right when a link is clicked
   - Fetches the matching `connection_explanations` row by `(source_node_id, target_node_id, connection_type)` (where `connection_type` maps from the link's `relationship_type`)
   - Renders title, summary, full_explanation (markdown), scholarly_notes, hebrew_greek_analysis if present
   - Falls back to "No deep explanation available yet" with a CTA link
4. Create `hooks/useGraphPreference.ts`:
   - Reads/writes user preference from localStorage key `mannafest:graph-mode`
5. Modify `app/explore/page.tsx`:
   - Detect desktop via `useMediaQuery('(min-width: 1024px)')` (or window.matchMedia in useEffect)
   - Read user preference via `useGraphPreference()`
   - Compute mode via `getGraphMode(userPref, isDesktop)`
   - Render `<Graph3D />` if mode is `3d`, else `<Graph2D />`
   - Toggle button (top-right) only renders when desktop AND flag enabled

**Step 6D — Initial edge filtering (NOT the full 1.3M):**
The graph has 1,299,669 edges total. Naive load will crash browsers. Initial render must use only the core ~169 edges:
- Modify the existing `/api/graph/edges` route (or create one if absent) to accept `?layer=core|commentary|crossref&focus_node_id=N&limit=500`
- `layer=core`: typology + prophecy_fulfillment + thematic only (~169 edges)
- `layer=commentary`: commentary edges (~1,189)
- `layer=crossref`: only cross_reference edges within 1 hop of `focus_node_id`, paginated to `limit=500`
- Default initial fetch from explore page: `layer=core`

**Step 6E — LOD (level of detail):**
- <500 visible nodes → show labels always
- 500–2000 → show labels only on hover
- >2000 → no labels, just colored points

**Step 6F — Layer toggle UI:**
Add checkboxes in the explore page header: "Typology / Prophecy fulfillment / Themes / Commentary / Cross-references" — each calls the layer fetcher. Reset View button returns to core layer.

**Step 6G — Mobile polish:**
- Force `window.innerWidth < 1024` to always render Graph2D
- Hide 2D/3D toggle on mobile
- ConnectionPanel renders as bottom sheet on mobile (use a media query or conditional className)

**Verification:**
1. `npm run build` succeeds. Report bundle size delta.
2. `npm run dev`, open `/explore`, confirm:
   - Desktop with flag ON → 3D renders with ~169 edges
   - Toggle to 2D works, persists across reload
   - Click a link → ConnectionPanel slides in
   - Layer checkbox toggles work
   - Mobile viewport (DevTools) → 2D only, no toggle visible
3. Take screenshots of: desktop 3D, desktop 2D, mobile 2D, ConnectionPanel open. Save them under `Ark/02-content/connections/screenshots/2026-04-16-3d-graph-screenshots/`.

**Git commit (repo):**
```
cd C:\Users\marcd\Downloads\MannaFest
git add app/ components/ lib/ hooks/ public/ package.json package-lock.json .env.example
git commit -m "feat(explore): 3D nebula graph with feature flag, LOD, ConnectionPanel

- react-force-graph-3d for desktop (NEXT_PUBLIC_GRAPH_3D_ENABLED gated)
- 2D fallback on mobile and as user preference
- progressive edge loading: core (~169) -> commentary -> cross-ref on focus
- ConnectionPanel reads connection_explanations table
- LOD thresholds at 500 and 2000 visible nodes
- Mobile renders ConnectionPanel as bottom sheet"
git push origin main
```

**On failure:**
- If npm install fails → report and stop
- If npm run build fails → report errors and stop, do NOT commit
- If anything else (visual quirks, perf concerns) → commit what works, document concerns in `Ark/06-todos/active.md`

---

### PHASE 7 — Bulk content generation (the big one)

**Goal:** Use the 5 apocrypha exemplars and 10 connection_explanations exemplars as style/depth references to generate the full content sweep Marcus committed to.

**Operating mode:** This phase will take significant time. Process in batches. After each batch, verify the inserts and commit. Do not try to generate everything in one request.

#### 7A — Apocrypha bulk fill

**Style reference:** Read the 5 entries already in `apocrypha_works` (slugs: `1-maccabees`, `sirach`, `tobit`, `1-enoch`, `community-rule-1qs`). Match their depth and structure exactly: 3-paragraph summary, full historical_context, intertestamental_significance, complete canon_status JSONB across catholic / eastern_orthodox / oriental_orthodox / anglican / protestant / jewish (add ethiopian_orthodox_tewahedo + eritrean_orthodox_tewahedo where relevant), populated themes/figures/related books, scholarly_notes 2-3 paragraphs naming specific commentators.

**Works to generate and INSERT (process in batches of 5):**

*Deuterocanonical (remaining):* 2 Maccabees, Judith, Wisdom of Solomon, Baruch, Letter of Jeremiah, Additions to Daniel (Susanna, Bel and the Dragon, Prayer of Azariah and Song of the Three Young Men), Additions to Esther, 1 Esdras, 2 Esdras, Prayer of Manasseh

*Pseudepigrapha:* Jubilees, Assumption of Moses, Testaments of the Twelve Patriarchs, 4 Ezra, 2 Baruch, Psalms of Solomon, Letter of Aristeas

*Dead Sea Scrolls:* War Scroll (1QM), Damascus Document (CD), Habakkuk Pesher (1QpHab), Temple Scroll (11QT), Hodayot / Thanksgiving Hymns (1QH)

*Intertestamental periods (INSERT into `intertestamental_period`, NOT `apocrypha_works`):* Persian period overview, Hellenistic period under the Ptolemies, Hellenistic period under the Seleucids, Maccabean revolt, Hasmonean dynasty, Roman conquest of Judea, "400 silent years" theological framing

For each apocrypha_work also INSERT at least 2 `apocrypha_connections` rows linking to canonical Scripture. Resolve `canonical_node_id` from `graph_nodes` (book label + chapter + verse). Leave NULL if no match.

**Per-batch verification:**
```sql
SELECT category, COUNT(*) FROM apocrypha_works GROUP BY category;
SELECT COUNT(*) FROM apocrypha_connections;
SELECT COUNT(*) FROM intertestamental_period;
```

**Per-batch commit (Ark — log progress):**
Append batch summary to `Ark/03-sessions/2026-04-16-handoff-1.md` with works added.

#### 7B — Connection_explanations bulk fill

**Target:** 90 additional entries to reach 100+ total.

**Style reference:** Read the 10 entries in `connection_explanations` and match their depth: title (evocative), summary (1-2 sentences for hover), full_explanation (3-5 paragraphs of theological/literary depth), scholarly_notes naming specific commentators (Spurgeon, Henry, Edwards, Calvin, Carson, Bauckham, Wright, Hays, Fitzmyer, etc.), hebrew_greek_analysis JSONB when language method, typological_pattern when typology.

**Distribution targets (90 entries total):**

- **Typology (25):** Adam/Christ, Joseph/Christ, Joshua/Jesus, Passover lamb, Bronze serpent (already have), Ark of Noah, Tabernacle elements (lampstand, ark of covenant, mercy seat, veil, bread of presence, brazen altar, laver) — that is 7 distinct entries, Manna, Rock at Horeb, David/Christ, Solomon/Christ, Melchizedek, Jonah, Boaz/Christ-redeemer, Hosea/Gomer, Cities of Refuge, Year of Jubilee, Sabbath rest, Day of Atonement scapegoat, Red Heifer
- **Language / original-word (20):** chesed (have), shalom, kavod, ruach, davar, emunah, tsedek, mishpat, yeshua, christos, agape, philia, kenosis, dikaiosyne, hilasterion, parousia, ekklesia, mysterion, koinonia, pneuma
- **Numerical (10):** 1, 3, 7, 10, 12, 40 (have), 70, 144, 666, 1000
- **Messianic-thread (8):** Suffering Servant (have), Bread of Life, Living Water, Good Shepherd, Light of the World, True Vine, Stone the builders rejected, Lion of Judah
- **Chiasmus (8):** Genesis flood (have), Genesis 17 covenant, Exodus 17 Amalek, Joshua's farewell, Psalm 67, Mark's gospel macro-chiasm, John 6 Bread of Life discourse, Revelation's seven-fold patterns
- **Quotation / allusion (12):** Hebrews 11:35→2 Macc 7 (have), Jude 14-15→1 Enoch (have), Jude 9→Assumption of Moses, Matthew's formula quotations (group treatment), Romans 9-11 OT chains, Revelation's Old Testament allusions, Acts 7's compressed OT survey, Hebrews 1's catena of OT messianic texts, Peter's Pentecost sermon (Acts 2) OT use, Hebrews' use of Psalm 110, Paul's use of Habakkuk 2:4, Matthew's use of Hosea 11:1
- **Narrative-parallel (7):** Elijah/Elisha and Jesus/disciples, Moses and Christ as deliverers, David and Christ as anointed-king-in-exile, Joseph and Daniel (faithful exiles in foreign courts), Hannah and Mary, Esther and the church, Ruth and the Gentile inclusion

(Where "have" is noted, do NOT regenerate. Cross-check the existing connection_explanations table before inserting to avoid duplicates.)

**Process in batches of 10.** After each batch:
1. Verify counts: `SELECT connection_type, COUNT(*) FROM connection_explanations GROUP BY connection_type ORDER BY connection_type;`
2. Spot-check one entry's `full_explanation` for theological accuracy (read it back to yourself; does it cite real commentators correctly, does it exegete the text reasonably?)
3. Append batch summary to session log
4. Commit Ark: `git add 03-sessions/ && git commit -m "ark: log connection_explanations batch N"`

#### 7C — Prophet character bios (side quest, but Marcus wants it)

`biblical_characters` currently has 0 prophet entries. Generate 27.

**Reference:** Read one of the 48 King entries (e.g., David, Solomon, Hezekiah) for depth template — full_biography paragraphs, key_events JSONB structure, relationship arrays.

**Major prophets (8-15 paragraphs each):** Isaiah, Jeremiah, Ezekiel, Daniel, Elijah, Elisha, Samuel, Moses (only INSERT Moses if not already present)

**Minor prophets (4-6 paragraphs each):** Hosea, Joel, Amos, Obadiah, Jonah, Micah, Nahum, Habakkuk, Zephaniah, Haggai, Zechariah, Malachi, Nathan, Gad, Iddo, Ahijah, Huldah, Anna, Agabus, John the Baptist

For each: spiritual_significance, typological_connection (where applicable), key_events JSONB, key_verses JSONB, related_characters JSONB, lessons_learned, strengths, weaknesses.

**Process in batches of 5.** Per-batch verification: `SELECT category, COUNT(*) FROM biblical_characters GROUP BY category;` (Prophet count should grow by batch size each round.)

#### Phase 7 final commit & push:

```
cd C:\Users\marcd\Documents\MannaFest\ark
git add 03-sessions/ 02-content/
git commit -m "ark: phase 7 bulk content generation complete"
git push origin main

cd C:\Users\marcd\Downloads\MannaFest
# (No app code changed in Phase 7 — only DB content. But push any uncommitted changes from Phase 6 if not yet pushed.)
git status
```

---

### PHASE 8 — Final wrap and push

**Goal:** Finalize session log, update active todos, push everything.

**Actions:**
1. Append final session summary to `Ark/03-sessions/2026-04-16-handoff-1.md`:
   - What landed (per phase, with counts)
   - Any phases that partially succeeded or failed
   - Any new TODOs generated for the next session
2. Update `Ark/06-todos/active.md` with anything Marcus needs to act on (e.g., investigating the discovery_prompts 97-vs-497 gap, the missing bible_patterns table, the typology_maps→graph_edges propagation gap)
3. Append decision records to `Ark/05-decisions/`:
   - `0002-apocrypha-scope-full-sweep.md`
   - `0003-connection-explanations-deep-seed.md`
   - `0004-3d-graph-progressive-enhancement.md`
   - `0005-cowork-as-execution-orchestrator.md`
4. Push the Ark to GitHub if a remote is configured. If no remote yet, leave a note in `Ark/06-todos/active.md` for Marcus to set one up.
5. Push the MannaFest repo (already done in Phase 6 if 3D graph completed).

**Final commit (Ark):**
```
cd C:\Users\marcd\Documents\MannaFest\ark
git add .
git commit -m "ark: session 1 complete — schema + seeds + 3D graph + bulk content + ADRs"
# Push only if remote exists:
git remote -v
# If origin shown: git push origin main
```

---

## 4. Reporting expectations

**During execution:** Stream brief status updates per phase. Don't narrate every line of SQL — just per-phase outcomes with verification counts.

**At end:** Produce one final summary message to Marcus listing:
1. ✅ Each phase that completed cleanly (with key counts)
2. ⚠️ Any phase that completed with warnings (and what they were)
3. ❌ Any phase that failed (and where it stopped)
4. 📊 Final DB state: row counts in all touched tables
5. 🌐 Live status: was the 3D graph successfully tested locally?
6. 📦 Git state: which repos got pushed, which commits are local-only
7. 📋 Next-session items now in `Ark/06-todos/active.md`

---

## 5. Failure handling philosophy

- **Single failure → retry once** with the same parameters.
- **Same failure twice → stop the current phase, report to Marcus, but continue subsequent phases that don't depend on the failed one.**
- **Schema migration failure → stop everything, report, do not proceed.** Schema integrity is non-negotiable.
- **Frontend build failure → stop Phase 6, do not commit broken code, report exact error.**
- **Bulk content quality concerns** (e.g., a connection_explanation references a verse that doesn't exist) → flag in session log but continue; quality review is a separate pass.

---

## 6. Final reminder on identity

This vault is **the Ark**. The MannaFest project is `ufrmssiqjtqfywthgpte`.
The Atrium and Xerish (`becyawhjsibrbyzicqxt`) do not exist for the purposes of this brief. If you ever find yourself about to query Xerish or write to the Atrium, you have made a serious mistake. Stop and re-read this section.

---

## Appendix A — `00-meta/file-routing.md` content

Create this file at `C:\Users\marcd\Documents\MannaFest\ark\00-meta\file-routing.md` in Phase 1, step 5:

```markdown
# File Routing Reference

When Marcus downloads files from a Claude.ai session, they land in `C:\Users\marcd\Downloads`. Their final destinations depend on type:

| File pattern | Destination |
|---|---|
| `CLAUDE.md` | `Ark\00-meta\CLAUDE.md` |
| `*-exemplars-*.json` (apocrypha, connections, scholars, etc.) | `MannaFest project root` (`C:\Users\marcd\Downloads\MannaFest\`) — these are import payloads for Claude Code or Cowork |
| `ark-session-log-*.md` | `Ark\03-sessions\` (overwrite or append based on date) |
| `*.sql` migration drafts | `MannaFest project supabase\migrations\` (after review) |
| Screenshots | `Ark\02-content\<topic>\screenshots\` |

## Conventions

- Session-dated files go in date-prefixed subfolders: `YYYY-MM-DD-<purpose>/`
- After import, archive payload JSONs to `Ark\99-archive\imports\` with date prefix
- Never leave files in Downloads after they've been routed — move, don't copy
```

---

## Appendix B — Migration SQL (only if Phase 2 verification fails)

These should already be applied. Do NOT run unless Phase 2 verification shows tables/columns missing.

**Migration 1 — `create_apocrypha_tables`:**
```sql
CREATE TABLE IF NOT EXISTS apocrypha_works (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  alternative_titles TEXT[],
  category TEXT NOT NULL CHECK (category IN ('deuterocanonical','pseudepigrapha','dead_sea_scrolls','intertestamental_history')),
  composition_period TEXT,
  language_original TEXT,
  summary TEXT NOT NULL,
  historical_context TEXT,
  intertestamental_significance TEXT,
  canon_status JSONB NOT NULL DEFAULT '{}'::jsonb,
  key_themes TEXT[],
  major_figures TEXT[],
  related_canonical_books TEXT[],
  scholarly_notes TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS apocrypha_connections (
  id BIGSERIAL PRIMARY KEY,
  apocrypha_work_id BIGINT REFERENCES apocrypha_works(id) ON DELETE CASCADE,
  apocrypha_reference TEXT NOT NULL,
  canonical_node_id BIGINT REFERENCES graph_nodes(id) ON DELETE SET NULL,
  canonical_reference TEXT NOT NULL,
  connection_type TEXT NOT NULL CHECK (connection_type IN ('allusion','quotation','thematic_parallel','historical_continuity','theological_development')),
  description TEXT NOT NULL,
  scholarly_notes TEXT,
  confidence_level TEXT CHECK (confidence_level IN ('high','medium','speculative')) DEFAULT 'medium',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS intertestamental_period (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  date_range TEXT,
  category TEXT,
  summary TEXT,
  key_events JSONB DEFAULT '[]'::jsonb,
  related_apocrypha_work_ids BIGINT[],
  related_canonical_node_ids BIGINT[],
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_apoc_conn_work ON apocrypha_connections(apocrypha_work_id);
CREATE INDEX IF NOT EXISTS idx_apoc_conn_node ON apocrypha_connections(canonical_node_id);
```

**Migration 2 — `create_connection_explanations`:**
```sql
CREATE TABLE IF NOT EXISTS connection_explanations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_node_id BIGINT REFERENCES graph_nodes(id) ON DELETE CASCADE,
  source_node_type TEXT,
  source_reference TEXT,
  target_node_id BIGINT REFERENCES graph_nodes(id) ON DELETE CASCADE,
  target_node_type TEXT,
  target_reference TEXT,
  connection_type TEXT NOT NULL CHECK (connection_type IN (
    'theme','typology','language','original-word','numerical',
    'narrative-parallel','prophecy-fulfillment','symbolic',
    'cross-reference','allusion','quotation','chiasmus','messianic-thread'
  )),
  connection_subtype TEXT,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  full_explanation TEXT NOT NULL,
  scholarly_notes TEXT,
  hebrew_greek_analysis JSONB,
  typological_pattern TEXT,
  confidence_level TEXT CHECK (confidence_level IN ('high','medium','speculative')) DEFAULT 'medium',
  related_connection_ids UUID[],
  key_verses JSONB DEFAULT '[]'::jsonb,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_conn_expl_source ON connection_explanations(source_node_id);
CREATE INDEX IF NOT EXISTS idx_conn_expl_target ON connection_explanations(target_node_id);
CREATE INDEX IF NOT EXISTS idx_conn_expl_type ON connection_explanations(connection_type);
CREATE UNIQUE INDEX IF NOT EXISTS uq_conn_expl_pair_type ON connection_explanations(source_node_id, target_node_id, connection_type) WHERE source_node_id IS NOT NULL AND target_node_id IS NOT NULL;
```

**Migration 3 — `prophecy_status_normalization`:**
```sql
ALTER TABLE messianic_prophecies ADD COLUMN IF NOT EXISTS fulfillment_visual_indicator TEXT;
ALTER TABLE prophecies ADD COLUMN IF NOT EXISTS fulfillment_visual_indicator TEXT;
UPDATE messianic_prophecies SET fulfillment_status = LOWER(REPLACE(fulfillment_status, ' ', '-'));
UPDATE prophecies SET fulfillment_status = LOWER(REPLACE(fulfillment_status, ' ', '-'));
UPDATE messianic_prophecies SET fulfillment_visual_indicator = CASE fulfillment_status
  WHEN 'fulfilled' THEN 'gold-checkmark-glow'
  WHEN 'partially-fulfilled' THEN 'amber-half-glow'
  WHEN 'unfulfilled' THEN 'sapphire-pending'
  WHEN 'debated' THEN 'gray-question'
  ELSE 'gray-question'
END;
UPDATE prophecies SET fulfillment_visual_indicator = CASE fulfillment_status
  WHEN 'fulfilled' THEN 'gold-checkmark-glow'
  WHEN 'partially-fulfilled' THEN 'amber-half-glow'
  WHEN 'unfulfilled' THEN 'sapphire-pending'
  ELSE 'gray-question'
END;
ALTER TABLE messianic_prophecies DROP CONSTRAINT IF EXISTS messianic_prophecies_fulfillment_status_check;
ALTER TABLE messianic_prophecies ADD CONSTRAINT messianic_prophecies_fulfillment_status_check
  CHECK (fulfillment_status IN ('fulfilled','partially-fulfilled','unfulfilled','debated'));
ALTER TABLE prophecies DROP CONSTRAINT IF EXISTS prophecies_fulfillment_status_check;
ALTER TABLE prophecies ADD CONSTRAINT prophecies_fulfillment_status_check
  CHECK (fulfillment_status IN ('fulfilled','partially-fulfilled','unfulfilled','debated'));
```

---

## End of brief

Begin with Phase 0 (file verification), then proceed through each phase in order. Update the session log as you go. The final summary message back to Marcus should be a clean phase-by-phase status report.

When you are ready to begin, respond to Marcus with: "Cowork ready. Starting Phase 0 file verification." Then begin.
