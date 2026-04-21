# Graph Redesign — Design Spec

> **Status:** Locked. Decisions made April 20, 2026.
> **Consumed by:** Batch 3.5 (Graph Redesign) — to run after Batch 3 ships the 66-book palette + `<Cite />` + diagram library.
> **Location:** `ark/01-architecture/graph-redesign-design-spec.md`
>
> **Purpose of this doc:** freeze six cross-cutting decisions about the graph's structure, visual language, and interaction model so the redesign batch can be built without re-litigating anything. When the redesign batch is queued, the prompt references this doc as READ FIRST material.
>
> **Why this was needed:** the current graph has 32,605 nodes, most of them single-edge verse nodes. As the founder put it: *"this just reveals the lack of information density on my site, not the interconnectedness of scripture."* The redesign fixes that — fewer nodes, meaningful density, visible organization.

---

## Decision 1 — Node granularity (5-tier hybrid)

Not every verse is a node. The graph shows **what the student needs to see**, not what the database has.

| Tier | What | Count at maturity | Rule |
|------|------|---|---|
| 1 | **Feature pages** | 20–50 | Curated founder-authored pages. Each one is a graph node. Examples: Jesus Quoting Scripture, Isaiah as Mini-Bible, Bronze Serpent Thread, Suffering Servant, Seed Promise. |
| 2 | **First-class content nodes** | 500–1,500 | Persons, Places, Events, Manuscripts, Artifacts, Doctrines/Concepts, Prophecies, Voices (scholars/authors). Anything with a dedicated page. |
| 3 | **Chapter nodes** | 1,189 | Every Bible chapter. The default grain for Scripture itself. |
| 4 | **Significant verses** | ~500 | The famous ones only. John 3:16, Isaiah 53:5, Genesis 1:1, Psalm 22:1, Romans 8:28, etc. These promote to node status because they carry enough gravity alone. |
| 5 | **Key Strong's words** | 50–150 | Theologically weighted words only — agape, logos, shalom, covenant, atonement, grace. Not every Strong's entry. |

**Total at maturity: ~3,000–5,000 nodes.** Dense enough to feel connected, small enough to render cleanly and not become visual soup.

**Explicitly not nodes:** most verses (the long tail). A verse with 0–2 cross-references lives on its chapter's page, reachable via drill-down and site-wide search, but not visible in the graph.

**Implication for content batches downstream:** content batches should create first-class content nodes (Tier 2) and curate significant-verse promotions (Tier 4) as needed. They should **not** create new raw verse nodes for every verse referenced.

---

## Decision 2 — Visual clustering (emergent + color + shape + size)

### Physical clustering is emergent, not designed

Don't script positions. Wire the edges correctly and force-directed physics handles the layout: nodes with mutual edges pull together, disconnected nodes drift apart. Natural clusters emerge:

- Torah (Genesis–Deuteronomy) forms a tight cluster — chapters reference each other heavily.
- Gospels cluster internally; Paul's letters cluster internally; Hebrews bridges Torah and Gospels because it quotes Leviticus/Exodus constantly.
- Psalms + Isaiah + Jesus-cluster feature pages sit in the middle because they're cited by both testaments.

The cross-testament spine (OT prophecy ↔ NT fulfillment) appears automatically as feature pages like **Bronze Serpent Thread** tug Numbers 21 toward John 3. That spine **is** the thesis of MannaFest made visible.

### Visual clustering — three independent channels

- **Color = book / testament.** Start with **testament tones** (OT amber, NT teal, intertestamental gold). Upgrade to the full 66-book palette from Batch 3 once that ships. Chapter and verse nodes inherit their book's color; content nodes use their type's accent; feature pages use a distinct "curated" color (white or gold with glow, TBD at implementation).
- **Shape = node type.** Feature pages = large circle (with ring/glow). Chapters = rounded square. Persons = pentagon. Places = hexagon. Concepts/doctrines = diamond. Words = small circle. Manuscripts = rectangle. Voices (scholars) = small outlined circle. Eye learns the vocabulary in a minute.
- **Size = tier + log(connection count).** Tier sets the floor/ceiling; connection count scales within the tier. Isaiah 53 is the biggest chapter but never bigger than the smallest feature page. Log scale (not linear) prevents mega-hubs from visually dominating everything else.

### Region labels

- **Zoomed out (macro view):** faint region labels render in the background — "Torah," "Wisdom Literature," "Major Prophets," "Gospels," "Pauline Epistles," "General Epistles," "Apocalyptic." No boxes, no outlines — just soft text in the space where those clusters naturally form.
- **Zoomed in (close view):** region labels hide. Only node labels visible.

---

## Decision 3 — Node labeling

Labels are information density. Too many = illegible wall of text; too few = useless.

- **Always labeled:** feature pages, heavily-connected chapters (e.g., Genesis 3, Isaiah 53, Psalm 22, John 3), major content nodes (Abraham, Moses, Jesus-cluster titles).
- **Hover to reveal:** everything else. User moves cursor over a node, its label appears.
- **At the smallest zoom level:** even the "always labeled" set drops labels. Only region labels remain. Full macro view.

---

## Decision 4 — Feature pages as graph nodes (emergent gravity)

Feature pages are the centerpiece of this model. They're curated, founder-authored anchors that visibly pull the graph into meaningful shapes.

### How they work mechanically

- Feature pages are **regular graph nodes** — no special physics, no custom rendering mode.
- **Emphasized visually:** largest tier, distinct shape (large circle with ring/glow), brighter saturation than surrounding nodes.
- **Their edges carry the gravity.** When a feature page has edges to 15 chapters across both testaments, force physics pulls those chapters toward each other through the feature page. A student zooms out and sees: *something* is binding Deuteronomy to Matthew. That something is the feature page sitting between them.

### Edge granularity rule

Feature page edges target **chapters and significant verses**. Specifically:

- Most connections go to **chapters** — e.g., "Jesus Quoting Scripture" edges to Matthew 4, Matthew 22, Mark 12 (chapters where Jesus quotes) and to Deuteronomy 6, Deuteronomy 8, Leviticus 19 (chapters he quotes from).
- **Significant verses** get direct edges where verse-level precision matters theologically — Isaiah 53:5 → 1 Peter 2:24, Psalm 22:1 → Matthew 27:46, Genesis 3:15 → Revelation 12:5. Never flatten dying-words-of-Christ style connections to the chapter level.
- **No full citation dumps.** If a feature page cites 60 verses, most of those become chapter-level edges; only the ones that carry theological weight on their own promote to verse-level.

**Typical feature page: 10–20 edges.** Enough gravity to visibly pull its cluster; not so many tentacles that the node becomes a hairball.

---

## Decision 5 — Search (local to graph, filter-not-jump)

The graph's search bar is scoped to graph-visible nodes and filters by dimming + highlighting. It does not teleport the viewport.

### Behavior

- User types "Isaiah 53" → matching node(s) brighten, neighbors brighten at lower intensity, non-matching nodes dim to ~15% opacity.
- If the match is off-screen, it's pulled toward the viewport center with a smooth animation. If it's on-screen, it pulses once.
- User clears search → graph returns to full density.

### Three search modes (small selector next to the search box)

- **Node** (default) — typing matches individual node names, types, or book names. "Isaiah" alone highlights every Isaiah chapter; "persons" highlights every person; "feature" highlights every feature page.
- **Path** — enter two node names, graph lights up any multi-hop path connecting them. "Genesis 3:15 → Revelation 12:5" visualizes the Seed Promise spine through the whole canon. This mode *is* the "oh" moment for skeptical students.
- **Type** — filter to just persons, just feature pages, just chapters, etc. Everything else dims.

### Global site search stays separate

Top-nav search on every page goes to `/search` and returns documents. Graph search is local, scoped, and visual. Two different things, intentionally.

---

## Decision 6 — Side panel ("half-card")

The panel is already partially shipping in Batch 2 under the current graph model. This spec locks what it should evolve into during the redesign.

### What Batch 2 ships (foundation — already correct)

- Right-docked, 400px wide, slides in on click
- Header: node name (large serif), type badge (colored), book-accent color strip
- Summary: first 150 chars of description
- Connections: up to 8 typed edges as clickable chips showing target + edge type + one-line rationale
- Footer: **Open full page →** button routing to the node's canonical page
- ESC closes, click-outside closes, URL-synced via `?focus={nodeId}` for deep-linking

### What the graph redesign batch adds

- **Grouped connections.** When a feature page has 20+ edges, group them: *"Old Testament sources (7)"*, *"New Testament fulfillments (5)"*, *"Related commentary (4)"*, *"See also (4)"*. Groups expand/collapse. Single flat list of 20 is a wall of text; grouped is scannable.
- **Inline mini-visual.** A tiny version of the graph centered on *just this node and its immediate neighbors*, rendered at the top of the panel. Lets you preview the neighborhood before committing.
- **Breadcrumb trail.** As you click node → chip → click into another node's panel, a small trail renders at the top of the panel: "Isaiah 53 → Psalm 22 → Matthew 27:46." Click any crumb to jump back. Also doubles as seed data for the study-history ledger (Vision v2 §6.4).
- **Two-click chip expansion.** Each connection chip, on its first click, expands to show the edge rationale + any founder insight note. Second click navigates to the target node's panel. Two-click depth: chip → edge explanation → target.

---

## In scope for Batch 3.5 (Graph Redesign)

1. New node-tier schema in Supabase (tier column, significant-verse flag, key-word flag)
2. Data migration: demote non-significant verses from the graph's `public_nodes` view. No actual deletion. Keep their data; just don't render them.
3. New graph renderer: testament-tone color, node-type shape, tier+log-count sizing, region labels with zoom-responsive visibility, label rules per Decision 3
4. Graph-local search with three modes (Node / Path / Type)
5. Side panel evolution per Decision 6 (grouped connections, mini-visual, breadcrumb trail, two-click chip expansion)
6. Feature page node styling — large, ringed, glowing, emergent gravity via correctly-wired edges
7. Seeds: at least 3 feature pages wired with proper edges to demonstrate the gravity effect (Isaiah as Mini-Bible already exists; add Bronze Serpent Thread + Suffering Servant as seed feature-page-as-node examples)

## Out of scope for Batch 3.5

- Authoring new feature pages beyond the 3 seeds — that's a separate content batch (Batch 11 covers feature pages 2–5)
- Voices/scholars unification — Batch 10
- Super-admin CRUD panel — Batch 9
- Full 66-book palette — must ship in Batch 3 first; this batch just uses testament tones with a clean upgrade path

## Acceptance criteria (to pass, every item must be true)

- [ ] Graph renders ≤5,000 visible nodes on production
- [ ] OT/NT testament tones visible at macro zoom; node-type shapes distinguishable at mid zoom
- [ ] Region labels appear at macro zoom and hide at close zoom
- [ ] Feature pages visibly larger than content nodes, which are larger than chapters
- [ ] Clicking the Bronze Serpent Thread feature page pulls Numbers 21 and John 3 visibly closer together
- [ ] Graph search Node mode filters + highlights
- [ ] Graph search Path mode visualizes a path between any two findable nodes
- [ ] Side panel: clicking a chip on a feature page shows grouped connections
- [ ] Side panel: breadcrumb trail grows as user traverses node → chip → node
- [ ] No node in the published view has fewer than 3 outgoing edges (the forward-looking rule, locked April 20)
- [ ] All rules comply with OPERATING_RULES — no licensed content, no AI-authored theological claims, commentary always attributed

---

## Design sign-off

Conversation session: April 20, 2026 (evening, following Batch 1.5 ship).
Founder: Marcus — locked all 6 decisions.
Next action: queue Batch 3.5 after Batch 3 ships. Reference this spec in the batch prompt's READ FIRST.
