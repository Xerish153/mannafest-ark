# BATCH 3.5 — Graph Redesign (Phase 1 — the presentable graph)

## READ FIRST (in order)

1. `C:\Users\marcd\Documents\MannaFest\ark\01-architecture\graph-redesign-design-spec.md` — **authoritative**. All six design decisions are locked here. Do not re-litigate.
2. `C:\Users\marcd\Documents\MannaFest\ark\STATUS.md`
3. `C:\Users\marcd\Documents\MannaFest\ark\OPERATING_RULES.md`
4. `C:\Users\marcd\Documents\MannaFest\ark\BATCH_QUEUE.md`
5. The Batch 2 audit and session record — the graph already has a `status` column and a `public_nodes` view from Batch 2. You are building on that foundation.

## CONSTRAINTS

> - Single audience: the student of the Bible who wants to learn.
> - Open-source data only. No licensed content. Wesley Huff scholarship quality bar.
> - Guzik's Enduring Word is NOT CC-BY. Public-domain commentators only.
> - No AI-authored historical or theological claims.
> - Commentary always attributed. Traditions never flattened.
> - 2D graph only. Desktop-first. Graph click opens side panel, never navigates.
> - Every node ships with ≥3 outgoing edges (forward-looking; existing nodes unchanged).
> - KJV / WEB / ASV only.
> - **No DELETE statements against `graph_nodes` or `graph_edges`.** Ever. This batch filters via view/flag updates, never by destroying data.

**Mode:** Full Write for code, Supabase, and vault. Your sandbox has NO GitHub credentials. Commit to `feature/graph-redesign-phase-1` locally and STOP. Marcus pushes from Windows.

**Prerequisite:** Batch 2 merged. `graph_nodes.status` column and `public_nodes` view both live in production. All 32,605 nodes currently `status='published'`.

---

## GOAL

Ship a presentable graph: testament-tone color, node-type shapes, tier+log sizing, settled physics (no more constant drift), and a tiered node model that shows ~3,000–5,000 relevant nodes instead of 32,605. Graph loads, settles, and tells a story within 10 seconds of the student landing on it.

**This is Phase 1 of the redesign.** Phase 2 (search modes, evolved side panel with grouped connections + mini-visual + breadcrumb trail) ships as a separate batch after Marcus confirms Phase 1 feels right.

---

## MUST SHIP (Phase 1 of the redesign)

Five things, in order. Do all five. Halt only on blockers.

### 1. Data model — node tiering

Add to `graph_nodes` table (via Supabase MCP):

```sql
-- Migration: node tiering system per design spec
ALTER TABLE graph_nodes
ADD COLUMN IF NOT EXISTS tier smallint,
ADD COLUMN IF NOT EXISTS is_significant_verse boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_key_word boolean DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_graph_nodes_tier ON graph_nodes(tier);
CREATE INDEX IF NOT EXISTS idx_graph_nodes_significant ON graph_nodes(is_significant_verse) WHERE is_significant_verse = true;
CREATE INDEX IF NOT EXISTS idx_graph_nodes_keyword ON graph_nodes(is_key_word) WHERE is_key_word = true;
```

Populate `tier` based on existing `type` column. Per the design spec:

- Tier 1: any node with `type = 'feature_page'` (may be 0 currently — that's fine)
- Tier 2: `type IN ('person', 'place', 'event', 'manuscript', 'artifact', 'concept', 'doctrine', 'prophecy', 'voice', 'scholar', 'author', 'commentary', 'theme', 'topic', 'number', 'apologetics')`
- Tier 3: `type = 'chapter'` (if any exist) OR any node that represents a Bible chapter
- Tier 4: `type = 'verse'` AND `is_significant_verse = true`
- Tier 5: `type = 'word'` AND `is_key_word = true`

Run a read-only count per-type FIRST (`SELECT type, COUNT(*) FROM graph_nodes GROUP BY type ORDER BY COUNT(*) DESC`) so you can see what types actually exist. Some of the types above may not exist in the data; tier them only if they do. Log the actual type counts in `ark/batch-3-5-audit.md` before running any UPDATE.

Set `tier` per type via direct UPDATE. Anything not matching remains `tier = NULL` for now; flag these in the audit for Marcus's review.

### 2. Seed significant-verse and key-word flags

Two starter lists. These are curation decisions — you have explicit authorization to write the flags via UPDATE for exactly the items on these lists.

**Significant verses — 60 to start** (extend per auto-rule below):

Genesis 1:1, Genesis 1:27, Genesis 3:15, Genesis 12:3, Genesis 15:6, Genesis 22:18
Exodus 3:14, Exodus 12:13, Exodus 14:14, Exodus 20:3
Leviticus 17:11, Leviticus 19:18
Deuteronomy 6:4, Deuteronomy 6:5
Joshua 1:9, Joshua 24:15
Psalm 1:1, Psalm 19:1, Psalm 22:1, Psalm 23:1, Psalm 23:4, Psalm 46:10, Psalm 51:10, Psalm 91:1, Psalm 119:105, Psalm 139:14
Proverbs 3:5, Proverbs 3:6
Isaiah 7:14, Isaiah 9:6, Isaiah 40:31, Isaiah 53:5, Isaiah 53:6, Isaiah 55:8, Isaiah 55:11
Jeremiah 29:11, Jeremiah 31:31
Lamentations 3:22, Lamentations 3:23
Daniel 2:44, Daniel 9:24
Micah 5:2, Micah 6:8
Habakkuk 2:4
Matthew 4:4, Matthew 5:3, Matthew 6:33, Matthew 11:28, Matthew 16:16, Matthew 22:37, Matthew 28:19, Matthew 28:20
Mark 8:34, Mark 10:45
Luke 2:11, Luke 4:18, Luke 19:10
John 1:1, John 1:14, John 3:3, John 3:16, John 3:17, John 8:32, John 10:10, John 10:11, John 11:25, John 14:6, John 15:5, John 16:33, John 17:3
Acts 1:8, Acts 2:38, Acts 4:12, Acts 17:28
Romans 1:16, Romans 1:17, Romans 3:23, Romans 5:8, Romans 6:23, Romans 8:1, Romans 8:28, Romans 8:37, Romans 8:38, Romans 10:9, Romans 12:1, Romans 12:2
1 Corinthians 13:4, 1 Corinthians 13:13, 1 Corinthians 15:3, 1 Corinthians 15:4
2 Corinthians 5:17, 2 Corinthians 5:21
Galatians 2:20, Galatians 5:22, Galatians 5:23
Ephesians 2:8, Ephesians 2:9, Ephesians 2:10, Ephesians 6:11
Philippians 4:6, Philippians 4:7, Philippians 4:13, Philippians 4:19
Colossians 3:2
1 Thessalonians 5:16, 1 Thessalonians 5:17, 1 Thessalonians 5:18
2 Timothy 3:16, 2 Timothy 3:17
Hebrews 4:12, Hebrews 11:1, Hebrews 11:6, Hebrews 12:1, Hebrews 12:2, Hebrews 13:8
James 1:2, James 1:3, James 2:17
1 Peter 2:9, 1 Peter 2:24, 1 Peter 5:7
2 Peter 3:9
1 John 1:9, 1 John 4:8, 1 John 4:19
Revelation 3:20, Revelation 21:4, Revelation 22:13

UPDATE `is_significant_verse = true` for every verse in this list that exists in `graph_nodes`. Log any list entries that are NOT found (so Marcus can fix the verse ID format later). Don't invent — only flag verses that exist.

**Auto-promotion rule:** any verse that already has ≥5 outgoing edges auto-promotes to significant. Run the auto-promote pass AFTER the explicit list so we don't miss heavily-connected verses that aren't on the famous list.

**Key Strong's words — 40 to start:**

Hebrew: chesed (2617), shalom (7965), emunah (530), kavod (3519), ruach (7307), nephesh (5315), berit (1285), tzedekah (6666), mishpat (4941), yirah (3374), torah (8451), goel (1350), olam (5769), yeshua (3444), adonai (136), elohim (430), kadosh (6918), shema (8085), melek (4428), davar (1697)

Greek: agape (26), logos (3056), pistis (4102), charis (5485), hamartia (266), soteria (4991), ekklesia (1577), kyrios (2962), christos (5547), doxa (1391), pneuma (4151), sarx (4561), aletheia (225), zoe (2222), basileia (932), nomos (3551), elpis (1680), dikaiosune (1343), hagios (40), anastasis (386)

UPDATE `is_key_word = true` for each Strong's number listed that exists in `graph_nodes`. Same rule: log misses, don't invent.

### 3. Update `public_nodes` view to enforce tiering

```sql
CREATE OR REPLACE VIEW public_nodes AS
SELECT * FROM graph_nodes
WHERE status = 'published'
  AND (
    tier IN (1, 2, 3)              -- feature pages, content nodes, chapters
    OR (tier = 4 AND is_significant_verse = true)   -- significant verses only
    OR (tier = 5 AND is_key_word = true)            -- key words only
    OR tier IS NULL                -- legacy/unclassified stays visible; don't hide data we can't classify
  );
```

After creating the view, run `SELECT COUNT(*) FROM public_nodes`. Target: 3,000–6,000 rows. If the count is >10,000 or <500, halt and report — the tiering logic has a bug or the data differs from what the design spec assumed.

### 4. Graph renderer overhaul — colors, shapes, sizing, settled physics

Modify `src/app/graph/GraphClient.tsx` (and supporting files as needed). All visual changes follow the design spec §2–3.

**4a. Colors (testament tones only — Batch 3 will upgrade to full 66-book palette later):**

Define two base colors in a `graphTheme.ts`:
- OT: warm amber, hex `#D4A574` (or similar — use WCAG AA against dark background)
- NT: cool teal, hex `#5B9AA0`
- Intertestamental/cross-cutting (feature pages, global concepts): gold, hex `#F5D06F`

Apply based on the node's book-testament association. For nodes not tied to a specific book (words, generic concepts), use the intertestamental gold.

**4b. Node shapes by type:**

| Type | Shape |
|---|---|
| feature_page | large circle with outer ring |
| chapter | rounded square |
| person | pentagon |
| place | hexagon |
| concept / doctrine | diamond |
| word | small circle |
| manuscript | rectangle |
| voice / scholar / author | small outlined circle |
| verse (significant) | small rounded square (smaller than chapters) |
| event | triangle |
| prophecy | chevron |
| theme / topic | soft square (rounded, lighter fill) |
| other | default circle |

Use SVG custom node rendering via `nodeCanvasObject` (or the equivalent React pattern for `react-force-graph-2d`).

**4c. Sizing — tier + log(connection count):**

Per tier base size (radius in px):
- Tier 1 (feature_page): base 18
- Tier 2 (content): base 10
- Tier 3 (chapter): base 7
- Tier 4 (significant verse): base 5
- Tier 5 (key word): base 4

Within-tier scale: multiply base radius by `(1 + 0.3 * log10(max(1, outgoing_edge_count)))`. This keeps well-connected nodes visibly larger without letting hub nodes dominate.

Tier 1 is ALWAYS visually larger than Tier 2 at maximum. Clamp scaling to prevent crossover between tiers.

**4d. Settled physics — THIS IS THE #1 USER COMPLAINT.**

The current graph drifts indefinitely. Fix:

- Set `d3AlphaDecay` to `0.03` (current default is too low, layout never cools)
- Set `d3VelocityDecay` to `0.4` (adds friction, nodes come to rest)
- When `simulation.alpha()` drops below `0.01`, call `graphRef.current.pauseAnimation()`. This freezes the layout once it settles.
- On user interaction (click, drag, zoom), call `graphRef.current.resumeAnimation()` for 2 seconds then re-freeze.
- Link strength: `0.3` (stronger than default so connected nodes pull together visibly)
- Charge strength: `-30` (weaker repulsion than default so the graph doesn't explode outward)

These values are the starting point. If the settled layout looks too clumped, reduce link strength slightly. If it still drifts, increase alpha decay.

**4e. Node labels per design spec §3:**

- Tier 1 and Tier 2 nodes: label always visible
- Tier 3, 4, 5: label only on hover
- At very wide zoom-out (k < 0.3), drop ALL node labels — only region labels survive

### 5. Region labels (zoom-responsive)

Render faint text labels for Bible sections in the background, behind the node layer. Not clickable. Opacity scales inversely with zoom — fully visible when zoomed out, fades as user zooms in.

Define 7 region anchors (rough viewport positions, will drift with layout):

- Torah (Genesis–Deuteronomy)
- Historical Books (Joshua–Esther)
- Wisdom & Psalms (Job–Song of Songs)
- Major Prophets (Isaiah–Daniel)
- Minor Prophets (Hosea–Malachi)
- Gospels & Acts
- Pauline Epistles
- General Epistles & Revelation

On initial load, after the physics settle, compute the centroid of each section's chapter nodes and place the label at that centroid. Font: large serif, 30% opacity at base zoom, fades to 0 when zoomed in past k > 1.5.

If computing centroids on load is too expensive or causes layout jitter, you may use fixed placeholder positions and log this as a known limitation for Phase 2 to fix.

---

## HALT IF SCOPE CREEPS — defer to Phase 2 batch

If after shipping items 1–5 above you've been working more than ~60 minutes, STOP and report. Do NOT attempt the following in this batch:

- Graph-local search with Node/Path/Type modes (Phase 2)
- Evolved side panel: grouped connections, mini-visual, breadcrumb trail, two-click chip expansion (Phase 2)
- Feature-page seed nodes (Bronze Serpent Thread, Suffering Servant) — Phase 2 covers this, AND those need edge lists that Marcus hasn't provided yet
- 66-book palette — that's Batch 3's job, not this one
- Any new content nodes

Phase 2 gets its own batch prompt after Marcus confirms Phase 1 feels right.

---

## DELIVERABLES

- `feature/graph-redesign-phase-1` branch exists locally with work committed
- Supabase migrations applied:
  - `tier`, `is_significant_verse`, `is_key_word` columns on `graph_nodes`
  - Updated `public_nodes` view
  - Flags populated per the two starter lists + the auto-promote rule
- Graph renderer overhauled: testament tones, node shapes, tier+log sizing, settled physics, label rules
- Region labels rendering (even if rough)
- `ark/batch-3-5-audit.md` — type counts pre-change, flag counts post-change, any misses from the starter lists, per-tier node counts in `public_nodes`
- `ark/03-sessions/2026-04-20-batch-3-5.md` — session record
- `ark/STATUS.md` — appended decision log entry

---

## ACCEPTANCE CRITERIA (Marcus will click through on Vercel preview before merging)

- [ ] Graph renders ≤6,000 visible nodes on production (not 32,605)
- [ ] Testament tones visible: OT amber, NT teal, intertestamental gold
- [ ] Node shapes distinguishable: circle vs pentagon vs hexagon vs diamond clearly different at mid zoom
- [ ] Feature pages (if any exist in data) visibly larger than content nodes; content nodes larger than chapters
- [ ] Physics settle within ~5 seconds of load. Graph is STATIC at rest (no slow drift)
- [ ] Click a node → side panel opens (Batch 2 behavior preserved)
- [ ] Dragging a node reheats physics briefly, then re-freezes
- [ ] Region labels visible at zoomed-out view, fade on zoom-in
- [ ] Labels on Tier 1/2 nodes visible at normal zoom; chapter/verse labels hover-only
- [ ] `public_nodes` count between 3,000 and 6,000

---

## OUT OF SCOPE

- Writing feature page content (that's Batch 11)
- Full 66-book palette (Batch 3)
- Graph-local search modes (Phase 2 batch)
- Side panel evolution beyond what Batch 2 shipped (Phase 2 batch)
- Any DELETE against `graph_nodes` or `graph_edges`
- Typography overhaul (Batch 3)
- Touching content pages, character profiles, apologetics, Isaiah Mini-Bible content

---

## IF YOU HIT A BLOCKER

Standard rule per OPERATING_RULES §6. Write `ark/batch-3-5-blocker.md`, halt, wait for Marcus in Claude.

Likely blockers:

- `graph_nodes.type` values don't match what the design spec assumed (e.g., you find types like `biblical_event` and `biblical_place` instead of `event` and `place`) → halt with the actual type breakdown, propose mapping
- Verse IDs in the starter list don't match the format stored in `graph_nodes` (e.g., list has `John 3:16`, DB stores `john-3-16` or `JHN.3.16`) → halt with format mismatch, ask Marcus which format to use
- Strong's numbers don't exist as separate nodes in `graph_nodes` → halt, ask whether Strong's is a node type we should create or whether the data lives in a different table
- Performance: settled physics with 5,000 nodes is still too slow → halt with timings, propose downsizing the significant-verse list
- `public_nodes` view update would require dropping dependent views → halt, never drop cascade

Resume only after Marcus brings resolution back to you via Claude.

---

## GIT PROTOCOL (standard)

- File-explicit `git add` only. Never `-A` or `.`
- If sandbox `.git/index` is Windows-corrupt (has been every session), use plumbing workaround: `write-tree` + `commit-tree` + update packed-refs. Same pattern that worked on 1.5, 1.5a, and 2.
- Do NOT run `npm run lint --fix` or any auto-formatter after the commit
- Do NOT attempt to push — your sandbox has no GitHub credentials. Marcus pushes from Windows.

Final report must include:
- Commit SHA on `feature/graph-redesign-phase-1`
- `git log --oneline -3`
- Files changed (stat)
- Supabase migrations applied
- Pre/post counts: total graph_nodes, published, in public_nodes, per tier, significant verses flagged, key words flagged, starter list misses
- Final `git status --short`
