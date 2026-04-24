# MannaFest — Vision, Analysis & Open Questions

> **Purpose.** Capture the founder's full stated intent, stress-test it honestly, and surface every question that needs a decision before the next wave of build work. Pin in the Claude Project alongside `STATUS.md` as foundational context. Update when vision shifts.

---

## 1. The Vision, Restated

MannaFest is being built to become **the definitive free, interconnected Bible study platform** — combining:

- **Enduring Word's commentary depth** (top-tier verse-by-verse exposition on every passage)
- **Logos's information density** (scholarly apparatus, lexicons, apparatus, cross-disciplinary evidence)
- **Bible Hub's tool breadth** (maps, interlinear Hebrew/Greek, parallel passages, parallel gospels, interwoven narratives)
- **Its own native superpower** — a live knowledge graph where every verse, word root, character, location, artifact, and concept is a first-class node with rich bidirectional connections

…all delivered so that **six distinct audiences** each get exactly the entry surface they need:

1. **The stumbler** — searches a verse, lands on MannaFest, walks away stunned by the complexity of Scripture.
2. **The student** — bookmarks it as non-optional for serious study.
3. **The scholar** — finds the full breadth of public-domain scholarship, plus curated pointers into the private-domain literature (book recommendations, academic sources).
4. **The pastor** — has a personal workspace for sermon prep, mapping verses, saving trails.
5. **The sufferer** — finds verses curated to trial types (depression, grief, sorrow, fear, doubt).
6. **The outsider** — scientist, mathematician, atheist, historian, agnostic, Buddhist, Muslim — each is met in language they can engage with.

The **neural nebula graph** isn't ornamental. It's meant to *prove by display* that Scripture is the most densely interconnected document in history, and that every trail eventually points to the person of Jesus of Nazareth as Messiah.

**The apologetic mission is explicit:** prove the Bible by surfacing its complexity, manuscript attestation, prophetic fulfillment, historical anchoring, and typological unity.

**The UX mission is equally explicit:** *do not overwhelm*. Every page must be navigable by a curious teenager and exhaustively deep for a seminary professor — at the same time.

---

## 2. Current State → Aspiration: Honest Gap Analysis

### What's strong already
- Core graph infrastructure exists (nodes + edges in Postgres — good call, portable, cheap)
- Strong's Hebrew and Greek fully seeded
- 340K cross-references seeded
- Matthew Henry commentary live (one commentary voice in place, tradition-attributed)
- Scholar profiles, typology map, messianic prophecies, biblical numbers all exist as scaffolding
- Auth, donations, Obsidian export — the infrastructure plumbing is done

### What's missing to reach the vision
- **Per-page richness is uneven.** A verse page today ≠ what the vision demands (location, timeline, character movements, manuscript data, apologetic evidences, multiple commentary voices, interlinear, parallel passages, trial-topic tagging, worldview-specific framing).
- **Top-tier commentary comparable to Enduring Word is not yet present.** Matthew Henry is 300 years old and devotional. David Guzik's Enduring Word is the modern gold standard and is licensed CC-BY — that's a potential acquisition, not an authoring task.
- **Interlinear view doesn't exist yet** (listed in Near Horizon).
- **Maps, timelines, archaeological evidence, manuscript counts per book** — not yet structured.
- **Character profiles, place profiles** — not built.
- **Trial/topic curation** ("verses for grief") — not built.
- **Audience-specific framing layers** — not built and genuinely hard.
- **UI coherence** — the navigation is inconsistent across screens. This is the UX foundation issue everything else sits on.

### The gap is mostly content + UX, not infrastructure
Claude Code agents can scaffold the structure. **The bottleneck is authored content** — revelation points, apologetic arguments, trial-topic curation, worldview-specific framings. These require human judgment at scale.

---

## 3. Realistic Expectancy

### What's achievable in 6 months (one person + agents)
- **UI/navigation overhaul** — single persistent nav, consistent across screens, mobile-solid.
- **Verse-page richness template** — define one canonical verse page layout and apply to ~100 priority verses (all messianic prophecies, all Christ-alluding OT passages, core NT theology verses). This becomes the showcase.
- **Enduring Word commentary ingestion** (if licensing permits) — instant 10x in commentary quality.
- **Interlinear view for key passages.**
- **Character profiles for 40 major figures** (already scoped as Option 3).
- **Place profiles for 30–50 major locations with maps.**
- **Trial-topic curation** for the 15 most common human struggles.
- **2D nebula with rich hover/click surfacing** (replacing or supplementing 3D).

### What's achievable in 12–18 months
- Full per-verse richness across the NT and priority OT books (Genesis, Exodus, Psalms, Isaiah, Daniel).
- Exhaustive prophecy catalog (already scoped).
- Apologetics section live with ~100 entries.
- Pastor sermon-prep workspace.
- AI-powered personalization for logged-in users.
- First audience-specific entry page (pick one — e.g., "For the skeptic").

### What's realistically 2–5 year work
- Logos-level information density *across the entire Bible*. Logos is a 30-year company with a full-time content team. You will not match their volume; you can beat them on graph-nativeness, free access, and UX.
- Full worldview-specific framing for all six audience types.
- Mature academic credibility at scholar level (requires real scholars' involvement, not just public-domain scraping).

### The uncomfortable truth
The vision is ~5 years of serious work. That's fine — you're playing a long game. But every quarter you should ruthlessly pick **two or three audiences** to serve excellently, rather than all six adequately.

---

## 4. The Interconnection Strategy (Core Component)

This is the heart. If MannaFest's moat is "every node is richly connected," then the interconnection model is the actual product.

### Principle 1 — Entity-first architecture
Every noun worth naming is a first-class node:
- **Verses** (already nodes)
- **Words/lemmas** (Strong's entries — already nodes)
- **People** (characters — needs to be built)
- **Places** (locations — needs to be built)
- **Events** (battles, covenants, miracles, sermons, journeys — needs to be built)
- **Objects/artifacts** (the Ark, the Temple, the bronze serpent, the cross, specific archaeological artifacts — needs to be built)
- **Concepts/doctrines** (covenant, righteousness, atonement, shalom — needs to be built)
- **Prophecies** (already nodes, needs expansion)
- **Commentaries** (per-verse notes by specific scholars — partially present)
- **Manuscripts** (Dead Sea Scrolls, Codex Sinaiticus, etc. — needs to be built as nodes)
- **Trials/topics** ("grief," "doubt," "fear" — needs to be built)
- **Books/chapters** (already nodes)

### Principle 2 — Typed edges, not generic "related to"
Every connection has a *type* that carries meaning:

| Edge type | Example |
|---|---|
| `prophesies` | Isaiah 53 → Crucifixion |
| `fulfills` | Crucifixion → Isaiah 53 |
| `quotes` | Hebrews 1 → Psalm 110 |
| `alludes_to` | Revelation 12 → Genesis 3:15 |
| `typologically_prefigures` | Isaac on Moriah → Christ on Calvary |
| `parallels` | Matthew 5 → Luke 6 |
| `etymologically_derives_from` | Greek lemma → Hebrew root |
| `located_at` | Event → Place |
| `involves` | Event → Person |
| `attested_by` | Verse → Manuscript |
| `addressed_by` | Trial → Verse |
| `commentary_on` | Guzik note → Verse |
| `authored_by` | Commentary → Scholar |
| `archaeological_evidence_for` | Artifact → Place/Event |
| `historical_record_of` | Extra-biblical source → Event |

**This is the data model that unlocks everything else.** Every view on the site — verse page, character page, graph traversal, trail — is a query against this typed graph.

### Principle 3 — Revelation points
Most edges will be auto-generated or scraped (cross-references, Strong's links, etc.). These give you density. But the *experience* of insight requires **curated revelation points** — authored notes attached to specific edges explaining *why* a connection matters.

Example: the edge `Genesis 22 Isaac typologically_prefigures Christ crucifixion` deserves a revelation point: "Abraham took his only son, whom he loved, to the mountain God would show him, to be sacrificed on wood — the son carrying the wood of his own sacrifice. Moriah is the same mountain range as Calvary."

Revelation points are the product of a human mind. They can be AI-drafted but must be human-approved. They are **the voice of the site**.

### Principle 4 — Trails as curated paths
A trail is a hand-crafted sequence of nodes + edges + revelation points that tells a story. Examples:
- "The bronze serpent trail" — Numbers 21 → John 3 → Christology → atonement theology
- "The suffering servant trail" — Isaiah 52–53 → Acts 8 → Romans, 1 Peter
- "The seed promise trail" — Genesis 3:15 → Genesis 12 → Galatians 3 → Revelation 12

Trails are the difference between "here's a graph, good luck" and "let me walk you through something that will change how you read Scripture."

### Principle 5 — Progressive disclosure is an edge-filter
The Beginner / Study / Deep mode toggle doesn't hide *pages* — it filters *which edges surface* at a given depth:
- **Beginner** — shows only the 3–5 most important connections + a revelation point
- **Study** — shows all curated edges with commentary
- **Deep** — shows every edge including auto-generated Strong's / cross-reference density

Same data, three density views. This is the UX pattern that reconciles "don't overwhelm" with "show immense complexity."

---

## 5. Information / Content That Needs To Be Added

Grouped by priority:

**Tier 1 — unlocks the vision at all**
- Per-verse canonical template with slots for: commentary (multi-voice), Hebrew/Greek word links, parallel passages, cross-references, prophetic connections, location, characters involved, typological allusions, trial-topics addressed, manuscript attestation.
- Character node type + 40 major character profiles.
- Place node type + 50 major place profiles (with map coordinates, timeline, archaeological notes).
- Manuscript node type + entries for major manuscripts (Dead Sea Scrolls, Codex Sinaiticus, Codex Vaticanus, Masoretic, Septuagint, Peshitta).
- Commentary ingestion from Enduring Word (Guzik) — *licensing check required*.

**Tier 2 — depth**
- Artifact nodes + archaeological evidence linked to places/events.
- Trial-topic curation (15–25 topics with curated verse lists).
- Interlinear view for Hebrew/Greek.
- Apologetics section (already scoped as Option 6).
- Exhaustive prophecy catalog (already scoped as Option 2).

**Tier 3 — differentiation**
- Worldview-specific entry pages ("For the skeptic," "For the scientist," "For the person in grief").
- Pastor workspace with sermon outlining.
- Personalized suggestions (already scoped as Option 4).
- Audio pronunciation for Hebrew/Greek.

---

## 6. UI / UX Overhaul — Top-Level Plan

### Critical issue: inconsistent navigation
The changing top menu per screen is a **foundational bug**, not a styling issue. Fix before any new feature work. Recommended approach:

- **One persistent top nav** — logo, global search, mode toggle (Beginner/Study/Deep), account. Same everywhere.
- **Contextual sub-nav** — appears beneath based on section (Graph / Study Desk / Personal Workspace), but in a predictable place.
- **Breadcrumbs** — on every deep page. "Bible > Isaiah > Chapter 53 > Verse 5" — every segment clickable.
- **Persistent "connected nodes" sidebar** — on every study page, show the top connections with types, openable.

### 3D → 2D nebula decision
**Recommend: build the 2D version as primary, keep 3D as an opt-in "immersive" toggle.** Reasons:
- Bandwidth cost of 3D (Three.js + react-force-graph-3d) is real on mobile/slow connections.
- 2D force graphs (D3 or react-force-graph-2d) render faster, scale better, and are fully interactive.
- The *insight* the graph provides is connection density, not spatial beauty. 2D delivers that.
- 3D stays as a "wow" moment for desktop power users who want it.
- On mobile, default to 2D always.

### Progressive disclosure as a site-wide pattern
Every page respects the Beginner / Study / Deep toggle. No page becomes a wall of text at Beginner level. Every page becomes a wall of everything at Deep level. Same URL, same data, three views.

### Search must become the primary entry surface
- Single global search bar, always visible.
- Typed results: Verses / Words / People / Places / Topics / Commentaries / Trails.
- Autocomplete with type icons.
- "Go deeper" suggestion after each result.

---

## 7. Open Questions — Need Your Answers

### Strategic / scope
1. **Audience priority** — if you can only serve 2 of the 6 audiences excellently in the next 6 months, which 2? (My recommendation: *the stumbler* and *the student*, because they're the widest funnel and the cleanest progressive-disclosure targets. The scholar, pastor, sufferer, outsider flows each require bespoke work.)
2. **"Prove the Bible"** — overt apologetic framing on every page, or let the data do the arguing and keep the framing scholarly? (My recommendation: let the data argue by default; apologetics section becomes a dedicated pillar. This preserves credibility with the outsider audience.)
3. **Pastor workspace** — is this a feature, or effectively a second product inside MannaFest? Different scope.
4. **Book recommendations** — affiliate (Amazon links, revenue)? Cataloged only? Linked to scholar profiles?
5. **Free forever** — reaffirmed as current decision, but: is a "support tier" with extra personalization / saved trails / sermon prep tools on the table as a sustainability path?

### Content / authorship
6. **Enduring Word licensing** — David Guzik's Enduring Word is CC-BY (verify current license). Pursue formal ingestion. This could be the single biggest quality leap.
7. **Translation licensing** — KJV, WEB, ASV are PD. NASB, ESV, NIV are licensed ($$). Which do you want? What's the budget?
8. **Revelation points** — who writes them? You alone? Community contribution with editorial review? AI-drafted + human-approved? This is the voice question.
9. **Scholarly authority** — when you say "artifacts, historical evidence, manuscript count" — whose scholarly consensus do you follow? Evangelical (Kenneth Kitchen, Walter Kaiser)? Mainline (James Charlesworth)? Critical academic (Bart Ehrman, cited to show range)?
10. **Worldview-specific framing** — "For the Muslim" and "For the skeptic" pages — who writes these? This is sensitive work. A page that condescends fails instantly.

### UI / UX
11. **The menu bar bug** — is it a routing issue, a per-page nav component, or a deliberate (but wrong) contextual design? Root-cause first, fix second.
12. **Mobile 3D fallback** — confirmed: ship 2D on mobile always. But do you want feature parity (same graph, different renderer) or a different experience (different affordances optimized for touch)?
13. **Search as primary entry** — agree with making search the homepage's primary affordance, or does the landing page serve a different purpose (mission statement, audience routing)?
14. **Beginner / Study / Deep toggle** — global user preference (set once, persists) or per-page setting? (My recommendation: global default, per-page override.)

### Technical
15. **Nebula rendering library choice** — D3 force-directed? react-force-graph-2d? Cytoscape? Each has tradeoffs for scale.
16. **Graph query performance** — as you add character, place, artifact, manuscript nodes, query complexity explodes. Caching and indexing strategy?
17. **LLM-generated content** — any of the revelation points, apologetic arguments, trial-topic descriptions going to be AI-drafted? If so, what's the review workflow and the attribution disclosure?

### Philosophical
18. **"Present information in a language they can understand"** — does this mean literally separate entry pages per worldview, or inclusive writing that avoids jargon and in-group assumptions? These are very different implementation paths.
19. **Speculative content (codes, patterns)** — the opt-in + confidence-badge rule is already locked in. Good. But: where does "Isaiah as Mini-Bible" fall? Established tradition? Speculative?
20. **Presenting opposing views** — for apologetics, do you present skeptical counterarguments fairly (steelman + response), or stay one-sided? (Steelmanning dramatically increases credibility with the outsider audience. It's more work.)

---

## 8. Criticisms & Risk Flags

Delivered bluntly because that's the useful version.

1. **The vision is ~5 years of work.** Not a criticism of the vision — a criticism of any quarterly plan that treats it as shippable in 6 months. Pick 2 audiences per quarter. Ship them excellently. Rotate.

2. **Six audiences is five products.** Each audience has different navigation needs, different voice, different entry points. Serving all six simultaneously means serving none of them distinctively. Sequence them.

3. **"Prove the Bible" limits the outsider audience.** An atheist who senses they're being proselytized at will close the tab. The strongest apologetic is *showing the data and letting them find the coherence themselves*. Keep the mission; soften the framing on outsider-facing pages.

4. **Content authorship is the bottleneck, not agents.** Claude Code can scaffold infinite structure. But someone has to write "The bronze serpent trail" revelation point. That someone is you, or someone you hire. Agents don't substitute for authored voice.

5. **Logos-parity on information is unreachable solo.** Logos has 30 years and a full content team. Don't benchmark against their catalog. Benchmark against *the experience of using them* — which is often worse than it should be. You can win on UX and graph-nativeness, not volume.

6. **Licensing landmines** — commentary, translations, maps, artifact photographs. One lawsuit kills the project. Audit every piece of content for provenance before ingesting.

7. **The 3D nebula is a sunk-cost risk.** You've built it. You're tempted to keep it as primary because of effort invested. Don't. 2D serves the mission better. Keep 3D as opt-in.

8. **The changing nav bar signals structural debt.** Fix it before scaling content. Every new page built on a broken nav pattern compounds the problem.

9. **Single-operator risk.** Everything is in your head. STATUS.md helps. This document helps. But: what happens if you can't work on MannaFest for 3 months? Is there a successor plan? Worth thinking about even if the answer is "not yet."

10. **"Don't overwhelm" + "show infinite complexity" is the hardest design problem on the site.** Progressive disclosure is the right bet. Execute it ruthlessly. Every page must be judgeable by "would a curious 14-year-old keep reading."

---

## 9. Suggested Next Decisions

Before any more feature agents run, decide:

1. **Audience priority for the next two quarters.** (Recommend: stumbler + student first.)
2. **Nav overhaul** — scheduled as a dedicated isolated agent batch *before* next content batch.
3. **2D nebula as primary** — confirm and scope the migration.
4. **Enduring Word commentary licensing** — investigate. If CC-BY, schedule ingestion as agent work.
5. **Revelation point authorship model** — you alone? You + AI-draft? Community later? Pick.
6. **Apologetic framing stance** — data-forward vs. argument-forward. Pick.
7. **Worldview-specific pages** — sequenced for Year 2, not Year 1. Confirm.

Once these are answered, the next six-move rotation in `STATUS.md` has a much sharper edge.

---

## 10. Final Note

The vision is genuinely compelling. "The knowledge graph of biblical scholarship, free forever" is a thing the world doesn't have and should. The scope is also genuinely enormous. The difference between a five-year project that ships and a five-year project that stalls is almost always **ruthless sequencing** — the willingness to say *not yet* to real, good ideas for six months at a time so the current thing gets finished.

You have the infrastructure. You have the North Star. The next phase is pick-two-audiences + fix-the-nav + commit-to-2D + secure-top-commentary. If those four land in the next quarter, MannaFest will look fundamentally different to anyone who visits it.
