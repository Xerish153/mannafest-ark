# MannaFest — Build Plan v3: Scripture-First Restructure

> **Supersedes Build Plan v2 sequencing.** Pin alongside `Vision_v2_Locked.md` and `STATUS.md`. This document restructures Phases 3+ around the founder's refocus: Jesus first, Scripture itself second, connectivity third, featured pages fourth. Fringe and reference material moves to later phases. The Vision v2 editorial rules stand unchanged.
>
> **Written:** April 17, 2026. **Framework phases (2.4–2.8) run before any content chunk ships.**

---

## 0 — What Changed From v2

This version reorders Phase 3+. The v2 sequencing treated content batches as roughly co-equal. The v3 sequencing reflects the founder's explicit priority order: **Jesus → Scripture → Connectivity → Featured Pages → Everything Else.**

Summary of moves:

- **Promoted to Phase 3A (first):** Jesus cluster, four Gospel hubs, parables, miracles, Sermon on the Mount.
- **Promoted to Phase 3B (scripture spine):** Expositional hubs for every book of the Bible (66 canonical + Apocrypha, minus 2 & 3 Enoch), plus a dedicated hub page and route for each book *collection* (Torah, Historical, Wisdom, Major Prophets, Minor Prophets, Gospels, Acts, Pauline, General Epistles, Revelation, Apocrypha).
- **Phase 3C (connectivity):** Hebrew Feasts, Tabernacle, Sacrificial System, Strong's deep dives on top theological words, Names of God, Messianic prophecy full catalog, Typology (Types of Christ), Covenant framework.
- **Phase 3D (the unseen realm — new in v3):** Satan character analysis, angelology, demonology, spiritual warfare, afterlife vocabulary (Sheol, Hades, Abyss, Tartarus, Gehenna), Heaven in depth. Each as a featured section with multiple depth layers.
- **Phase 3E (character + lineage):** Character profiles, place profiles, manuscripts, plus the new **family tree / genealogy visualization framework** including the Jeconiah blood-curse page.
- **Phase 3F:** Study trails.
- **Phase 4 (deprioritized from v2 Phase 3):** Apologetics sections, canon/textual criticism, intertestamental period, Pauline journeys as a separate track, Twelve Disciples and Twelve Tribes profiles, systematic theology populated entries, Pharisees/Sadducees/Essenes.
- **Phase 5 (pushed from v2 Phase 3C):** Church history, revivals, martyrs, creeds/councils, hermeneutics, ANE comparative, archaeology pillar, Mazzaroth, hymns/prayer sections, Shroud of Turin.

Nothing from v2 is deleted. The lock decisions (§1–§20 of Vision v2) are unchanged. This is pure resequencing around Scripture-first priority.

---

## 1 — Infrastructure Reality Check (Vercel + Supabase)

Relevant because several new Phase 3 features (the family tree visualizer, the Strong's deep-dive pages, a fully-populated graph) raise "will this scale" questions.

### 1.1 What lives where

| Layer | What it holds | Scaling concern |
|---|---|---|
| **Vercel** | Next.js app, serverless functions, static assets in `/public` | Function bundle size (250 MB unzipped), response body size (4.5 MB), bandwidth |
| **Supabase Postgres** | Verses, Strong's, cross-references, nodes, edges, commentary, user data | Database size (500 MB free / 8 GB Pro with auto-scaling) |
| **Supabase Storage** | Open-licensed images (Tabernacle diagrams, artifact photos, maps) | 1 GB free / 100 GB Pro |

**Content lives in Supabase, not Vercel.** No amount of added content crashes Vercel. Vercel crashes only if your *code bundle* bloats or if a single *response* exceeds 4.5 MB.

### 1.2 Current and projected database size

Rough projections at full build:

- Existing seeded data (Bible text, Strong's, cross-references, Matthew Henry, messianic prophecies, biblical numbers, scholar profiles): ~150 MB
- Added in v3: book hubs (~80 books × 30 KB each = 2 MB), book collection pages (~12 × 50 KB = 1 MB), character profiles (40 × 50 KB = 2 MB), place profiles (30 × 50 KB = 1.5 MB), manuscripts (20 × 40 KB = 1 MB), featured pages (~50 × 80 KB = 4 MB), typed edges with explanations (estimated 500K edges × 250 bytes = 125 MB), commentary expansions (Spurgeon, Calvin, Wesley, Rashi added = ~100 MB)
- Total projected: **~400–600 MB** at full vision.

### 1.3 Plan consequences

1. **Stay on Supabase Free during development.** You have plenty of headroom until content batches start landing at volume in Phase 3B.
2. **Upgrade to Supabase Pro ($25/month) before Phase 3B content batches 3+ ship.** Free tier hits read-only mode at 500 MB. You don't want that mid-batch.
3. **Confirm Vercel Pro tier** (you're commercial, so you need it regardless of traffic). $20/month.
4. **Total infra cost at launch: ~$45/month.** Unchanged at 10K monthly users. Creeps to $60–80/month at 50K+ users with heavy graph usage.
5. **Enable Incremental Static Regeneration (ISR) on verse pages and book hubs.** Phase 2.8 (new) handles this.
6. **Never write a route that returns more than ~1000 rows without pagination.** Phase 2.5.B (citation viewer) and Phase 2.6.A (timeline) both need to enforce this.
7. **The graph's viewport-based loading is non-negotiable.** Never "fetch all nodes." Phase 1.3 (2D nebula migration, already prompted) should establish this pattern.
8. **Open-source images hosted in Supabase Storage, not bundled.** Tabernacle diagrams, Wikimedia Commons artifact photos, open-license maps — all uploaded to Supabase buckets, served via CDN.

### 1.4 What will actually break the site

- A single function returning more than 4.5 MB (e.g., "give me every verse that contains this Strong's number" without pagination).
- A Next.js dynamic import pulling a library >250 MB compressed (e.g., bundling a full Hebrew font family unnecessarily).
- An unbounded graph query on a viewport that doesn't exist (e.g., trying to render 100K nodes at once).
- Free-tier Supabase project pausing after 7 days of inactivity (not a crash — a wake-up delay of ~30s on first request after idle).

### 1.5 What will not break the site

- Volume of *content*. More verses, more commentary, more cross-references — database grows, auto-scales, fine.
- Number of pages. Next.js handles tens of thousands of routes comfortably with ISR.
- Number of users. Vercel and Supabase both auto-scale concurrency.

**Conclusion:** build what the vision calls for. The limits are on patterns, not on volume.

---

## 2 — Framework Phases (Run Before Content)

These three framework phases must complete before any Phase 3 content chunk begins. A content chunk run against missing framework is a content chunk that has to be redone.

### Phase 2.4 — Schema Expansion

Previously scoped in v2 (feast / tabernacle / sacrifice / divine_name / doctrine node types). Unchanged. See v2 chunks 2.4.A and 2.4.B.

### Phase 2.5 — Cross-Cutting Features

Previously scoped in v2 (compare mode, citation viewer). Unchanged. See v2 chunks 2.5.A and 2.5.B.

### Phase 2.6 — Primary Surfaces

Previously scoped in v2 (timeline, map). Unchanged. See v2 chunks 2.6.A and 2.6.B.

### Phase 2.7 — Family Tree / Genealogy Visualization Framework (NEW in v3)

Needed for Jeconiah's blood curse featured page, the Matthew vs. Luke genealogies, the Twelve Tribes from the twelve sons of Jacob, the Adamic genealogy, the high-priestly line, and many future lineage-based featured pages.

**Chunk 2.7.A — Genealogy data model + visualization component**

- **Type:** Blueprint + implementation.
- **Estimated effort:** Cowork batch, ~4 days.
- **Blocks on:** Phase 2.1 (Person node type must exist).
- **Goal:** Add a lineage layer on top of Person nodes, plus a reusable genealogy visualization component that can render any subset of the lineage data as an interactive family tree.
- **Deliverables:**
  - `Lineage_edge` table or extension to the edge table with types: `parent_of`, `spouse_of`, `sibling_of`, `adopted_parent_of`. Each edge carries a source field (genealogy section of the Bible cited).
  - Attributes on Person records: primary genealogy reference, kingly line membership, priestly line membership, tribal affiliation.
  - A `<GenealogyTree />` React component using a tree/DAG layout library (d3-dag or react-d3-tree — verify open source and active). Input: a root person + depth + filter. Output: rendered tree with hover-to-preview and click-to-open-side-panel.
  - A `<LineageHighlight />` overlay that can take two Person nodes and highlight the shortest lineage path between them.
  - Admin UI for the founder to author lineage edges with citations.
- **Out of scope:** content population beyond seed; full genealogy rendering for every biblical figure.
- **Acceptance:** founder can input "root: Adam, depth: 10" in the admin and see a correctly rendered tree; can input "root: David, highlight path to: Jesus (through Solomon)" and see the Matthean genealogy highlighted; can switch to "through Nathan" and see the Lukan genealogy highlighted.

### Phase 2.8 — ISR + Performance Optimization Pass (NEW in v3)

Preemptive. Runs before content volume hits its ceiling. Cheap now, expensive later.

**Chunk 2.8.A — ISR, pagination, and graph optimization**

- **Type:** Implementation (no new features — performance hardening).
- **Estimated effort:** Cowork batch, ~3 days.
- **Blocks on:** Phase 1 complete.
- **Goal:** Retrofit the existing app to scale gracefully through Phase 3.
- **Deliverables:**
  - All dynamic verse / chapter / book / node routes set up with ISR (`revalidate: 3600` default, configurable per route).
  - Every Supabase query that returns more than 100 potential rows wrapped in pagination (limit + offset or cursor-based).
  - Graph queries refactored to use viewport-based loading (fetch nodes and edges within visible bounds + depth, not the entire graph).
  - A server-side caching layer (Next.js built-in `unstable_cache` or equivalent) for Strong's lookups and cross-reference lookups, since those are read-heavy and rarely change.
  - Bundle analyzer run on the Vercel build; any dependency contributing >5 MB to the function bundle reviewed and either lazy-loaded or replaced.
  - Lighthouse audit against the homepage, a representative verse page, and the graph. Performance score target: 85+ on desktop.
- **Out of scope:** new UI or new features.
- **Acceptance:** verse page first-load under 1.5s, subsequent navigations under 500ms; graph loads the visible viewport under 2s; no single function response exceeds 1 MB in typical use.

---

## 3 — Phase 3A: Jesus Foundation

The first content phase. Everything in the vision flows toward Christ; building outward from the Jesus cluster first means every later connection has a home to point to.

### Chunk 3A.1 — Jesus Cluster (15+ title/role nodes)

- **Type:** Content.
- **Estimated effort:** Cowork batch, ~5 days.
- **Blocks on:** Phases 2.1–2.6 complete.
- **Goal:** Author richly-connected node entries for every major title and role of Christ. These are not brief labels — each is a full featured page with OT sources, NT fulfillments, theological weight, and a minimum of 8 outbound connections.
- **Roster (founder to confirm or adjust before running):**
  1. Lamb of God
  2. Son of David
  3. Son of Man
  4. The Word (Logos)
  5. High Priest (Melchizedek order)
  6. Prophet like Moses
  7. Suffering Servant
  8. Second Adam
  9. King of Kings
  10. True Vine
  11. Bread of Life
  12. Good Shepherd
  13. Light of the World
  14. I AM (with all seven "I AM" statements as sub-nodes)
  15. Firstborn
  16. The Rock (1 Cor 10:4 — Paul explicitly identifies the wilderness rock as Christ)
  17. The Cornerstone
  18. Alpha and Omega
  19. Bridegroom
  20. Emmanuel
- **Deliverables:** 20 richly-connected nodes + one "Jesus cluster" hub page that routes to all of them.
- **Acceptance:** each node has Hebrew/Greek original language, OT roots with passage citations, NT usage with passage citations, theological significance paragraph, connections to at least 8 other nodes with typed edges and written explanations. The cluster hub renders the whole group as a mini-graph.

### Chunk 3A.2 — Four Gospels Master Hubs

- **Type:** Content.
- **Estimated effort:** Cowork batch, ~5 days.
- **Blocks on:** 3A.1.
- **Goal:** Per Vision v2 §3.1, one master hub per gospel addressing "why four gospels."
- **Deliverables:** Matthew, Mark, Luke, John hub pages. Each covering:
  - Author, date, audience, occasion
  - Narrative shape and emphasis unique to this gospel
  - Why this gospel exists alongside the other three — distinct theological contribution
  - Matthew: Jesus as King, Jewish Messiah, new Moses, five teaching blocks mirroring the Torah
  - Mark: Jesus as Servant, action gospel, Peter behind it, written for Romans
  - Luke: Jesus as Son of Man, physician's eye, outsider included, women and poor
  - John: Jesus as Son of God, theological, I AM statements, fills synoptic gaps, begins before Genesis
  - Synoptic problem presented honestly (including the Q source debate with the debated-content notice)
  - The Gospel harmonies — how the four are harmonized, where harmonization is contested
- **Acceptance:** each gospel hub stands on its own; the four collectively answer "why four." Every claim cited.

### Chunk 3A.3 — Parables of Jesus (major focus)

- **Type:** Content.
- **Estimated effort:** Cowork batch, ~5 days.
- **Blocks on:** 3A.2.
- **Goal:** Dedicated featured section treating Jesus' parables as a first-class surface. The founder flagged this as a big focus.
- **Deliverables:**
  - Parables master hub page
  - One node per parable (40+ parables — full roster from the synoptic gospels and John)
  - Each parable node contains: the parable text (linked to its gospel passage), immediate audience and setting, interpretive key, OT background, theological weight, traditional interpretation history (how different traditions have read it), connections to kingdom theology and to other parables
  - Parable categories as sub-hubs: kingdom parables (Matthew 13 is the parable chapter — its own featured sub-page), judgment parables, grace parables, prayer parables, discipleship parables
  - The strategic question as its own featured page: "Why Jesus Spoke in Parables" — Matthew 13:10-17, Isaiah 6:9-10 connection, the revelation-and-concealment paradox
  - Luke's unique parables as a sub-section — Good Samaritan, Prodigal Son, Rich Man and Lazarus, Unjust Steward (the hardest one) — with depth
- **Acceptance:** every parable has a dedicated node with the template filled; every parable connects to at least 3 OT passages and 3 other parables or NT teachings; the "why parables" featured page handles the revelation-concealment tension without smoothing it over.

### Chunk 3A.4 — Miracles of Jesus (with messianic miracles featured)

- **Type:** Content.
- **Estimated effort:** Cowork batch, ~4 days.
- **Blocks on:** 3A.2.
- **Goal:** Per Vision v2 §3.2, all miracles of Jesus documented with the messianic miracles specifically flagged.
- **Deliverables:**
  - Miracles master hub
  - One node per miracle (approximately 35 miracles in the synoptics + 7 signs in John + the overlaps)
  - Each miracle node: what occurred, the original language of key words, spiritual representation, OT typological background, place in Jesus' messianic claim
  - **Messianic miracles** as its own featured sub-section — the three miracles the rabbis said only Messiah could perform:
    1. Healing a Jewish leper
    2. Casting out a mute/dumb demon
    3. Opening the eyes of a man born blind
  - The Pharisees' response to each messianic miracle documented (John 9 as the case study)
  - John's seven signs as a sub-hub
- **Acceptance:** every miracle has its node; messianic miracles are distinctly flagged with their rabbinic background cited; the Pharisees' responses are documented with passage references.

### Chunk 3A.5 — Sermon on the Mount Featured Section

- **Type:** Content.
- **Estimated effort:** Cowork batch, ~4 days.
- **Blocks on:** 3A.2, 3A.3 (kingdom theology from parables).
- **Goal:** Per Vision v2 §3.30, Matthew 5–7 as its own featured section.
- **Deliverables:**
  - Master Sermon on the Mount hub page
  - The Beatitudes as a sub-featured section with each beatitude a node linking to OT Psalms (Psalm 37 saturates this passage)
  - Salt and Light — covenant language, Isaiah 42 connection
  - Fulfillment statements — each "You have heard / but I say" pair linked to the specific Torah passage and the rabbinic tradition being engaged
  - Lord's Prayer featured sub-page — every phrase a node with OT and theological roots
  - Kingdom theology thread crossing into Daniel 2/7, Davidic covenant, Isaiah 9, Revelation 21–22
- **Acceptance:** every major unit of the Sermon has its own node with its OT roots; the Lord's Prayer is treated phrase-by-phrase.

---

## 4 — Phase 3B: Scripture Foundation (The Spine)

The single largest phase by volume. Every book of the Bible gets an expositional hub following a standardized template. Book collections get their own dedicated hub pages with proper routes. This is the scripture-first commitment made concrete.

### 4.1 Book Collection Hub Pages

Each collection gets a hub page at a clean route. Every book belonging to that collection is reachable from its collection's hub.

**Collection roster (Christian ordering):**

| # | Collection | Route | Books |
|---|---|---|---|
| 1 | The Torah / Pentateuch | `/bible/torah` | Genesis, Exodus, Leviticus, Numbers, Deuteronomy (5) |
| 2 | Historical Books | `/bible/historical` | Joshua, Judges, Ruth, 1–2 Samuel, 1–2 Kings, 1–2 Chronicles, Ezra, Nehemiah, Esther (12) |
| 3 | Wisdom & Poetical Books | `/bible/wisdom` | Job, Psalms, Proverbs, Ecclesiastes, Song of Songs (5) |
| 4 | Major Prophets | `/bible/major-prophets` | Isaiah, Jeremiah, Lamentations, Ezekiel, Daniel (5) |
| 5 | Minor Prophets | `/bible/minor-prophets` | Hosea, Joel, Amos, Obadiah, Jonah, Micah, Nahum, Habakkuk, Zephaniah, Haggai, Zechariah, Malachi (12) |
| 6 | The Gospels | `/bible/gospels` | Matthew, Mark, Luke, John (4) — note: Jesus-first material lives here, but the hubs were already built in Phase 3A |
| 7 | Acts | `/bible/acts` | Acts of the Apostles (1, bridge book) |
| 8 | Pauline Epistles | `/bible/pauline` | Romans, 1–2 Corinthians, Galatians, Ephesians, Philippians, Colossians, 1–2 Thessalonians, 1–2 Timothy, Titus, Philemon (13) |
| 9 | General Epistles | `/bible/general-epistles` | Hebrews, James, 1–2 Peter, 1–3 John, Jude (8) |
| 10 | Apocalyptic / Revelation | `/bible/revelation` | Revelation, with cross-links to apocalyptic passages in Daniel, Ezekiel, Isaiah (1 book, 1 featured collection) |
| 11 | Apocrypha / Deuterocanon | `/bible/apocrypha` | See §4.3 below |
| 12 | Hebrew Bible Ordering (alternative view) | `/bible/tanakh` | Torah / Nevi'im / Ketuvim re-grouping of the Protestant OT as an alternative entry — not new content, just a re-routed view |

**Each collection hub contains:**
- What this collection is and why the books were grouped together historically
- The distinctive literary genre(s) in the collection
- The theological contribution of the collection to the whole canon
- A list of all books in the collection with a one-paragraph summary each and a link to the full hub
- A timeline showing where the books in this collection fall in biblical chronology
- Key connections across books in the collection (e.g., the prophetic books that speak to one another; the gospels' four-voice harmony)
- Major featured pages that draw heavily from this collection

### 4.2 Book Hub Template

Every book of the Bible gets the same template. Predictability beats novelty. A student who learns to read one hub knows how to read them all.

**Fields (consistent across all hubs):**
- Book name (canonical, alternate names in other traditions, Hebrew/Greek name if applicable)
- Collection membership
- Author (including attribution debates where they exist — with debated-content notice)
- Date of composition (with scholarly range; debated-content notice where ranges are contested)
- Audience (original readers/hearers)
- Occasion (what historical moment or crisis prompted the writing)
- Historical and cultural context
- Literary structure / outline
- Key theological themes
- Key passages (linked nodes)
- Connection to the rest of the canon
- Messianic / typological significance (where applicable)
- Major interpretive traditions
- Recommended commentary voices (linked to commentary hubs)
- Study trails that pass through this book
- Featured pages that draw on this book

### 4.3 Apocrypha / Deuterocanon — Roster for Founder Confirmation

The founder said "include the apocrypha (do not include 2 & 3 Enoch)." The exclusion of 2 & 3 Enoch specifically implies 1 Enoch is *included*. Here is the proposed roster — please confirm or trim before Phase 3B.

**Catholic deuterocanon (canonical in Catholic, Orthodox, and Anglican traditions):**
1. Tobit
2. Judith
3. Additions to Esther (Greek)
4. Wisdom of Solomon
5. Sirach (Ecclesiasticus)
6. Baruch (including the Letter of Jeremiah)
7. Additions to Daniel (Prayer of Azariah / Song of Three Young Men, Susanna, Bel and the Dragon)
8. 1 Maccabees
9. 2 Maccabees

**Orthodox-only additions:**
10. 1 Esdras (also called 3 Esdras)
11. 2 Esdras / 4 Ezra (also called 4 Esdras)
12. Prayer of Manasseh
13. Psalm 151
14. 3 Maccabees
15. 4 Maccabees (sometimes an appendix)

**Ethiopian canon / pseudepigrapha with direct NT citation:**
16. 1 Enoch (quoted explicitly in Jude 14–15; excluded in Hebrew and Protestant canon but part of the Ethiopian Orthodox canon)
17. Jubilees (part of the Ethiopian Orthodox canon; influences Second Temple chronology)

**Explicitly excluded per founder:** 2 Enoch (Slavonic), 3 Enoch (Hebrew, mystical).

**Each apocryphal hub carries a prominent "Canonical Status" banner** at the top of the page making clear which traditions consider the book canonical and which do not. This is the debated-content pattern applied structurally.

### 4.4 Phase 3B Cowork Chunks

One chunk per collection, or two where volume demands it. Every chunk prepends the operating rules from §12 of Vision v2 and the v3 context block from below.

#### Chunk 3B.1 — Book Collection hub pages

- **Estimated effort:** Cowork batch, ~4 days.
- **Blocks on:** Phase 2 complete.
- **Goal:** Ship all 12 collection hub pages at their canonical routes.
- **Deliverables:** 12 collection hub pages per §4.1; each discoverable from the main menu under "Bible"; each with cross-links to every book in the collection (hubs may not exist yet — cross-links are placeholders until 3B.2+).
- **Acceptance:** user can navigate from the main menu to "Bible" and see all 12 collections listed with short descriptions; clicking any collection opens its hub page correctly.

#### Chunk 3B.2 — Torah Hubs (5 books)

- **Estimated effort:** Cowork batch, ~5 days.
- **Goal:** Full expositional hubs for Genesis, Exodus, Leviticus, Numbers, Deuteronomy.
- **Note on Leviticus:** this is the book most-skipped by Protestant readers and the book that decodes atonement theology. Give it the depth Vision v2 §3.21 calls for. Its hub should explicitly cross-reference Hebrews.
- **Note on Deuteronomy:** the Hittite suzerainty treaty structure should be presented (it argues for early dating against critical scholarly dating — with the debated-content notice on the dating question).

#### Chunk 3B.3 — Historical Books Hubs, batch 1 (6 books)

- **Estimated effort:** Cowork batch, ~5 days.
- **Goal:** Joshua, Judges, Ruth, 1 Samuel, 2 Samuel, 1 Kings.

#### Chunk 3B.4 — Historical Books Hubs, batch 2 (6 books)

- **Estimated effort:** Cowork batch, ~5 days.
- **Goal:** 2 Kings, 1 Chronicles, 2 Chronicles, Ezra, Nehemiah, Esther.

#### Chunk 3B.5 — Wisdom & Poetical Books Hubs (5 books, plus Job multi-level)

- **Estimated effort:** Cowork batch, ~5 days.
- **Blocks on:** none after Phase 2.
- **Goal:** Job, Psalms, Proverbs, Ecclesiastes, Song of Songs. **Job gets depth per founder flag** — see 3C.4 for the Job featured section; this chunk delivers the standard hub, 3C.4 delivers the multi-level featured treatment. Song of Songs carries the debated-content notice on allegorical vs. literal reading.
- **Psalms hub note:** Psalms gets a standard hub here; the dedicated Psalms featured section (five books structure, genres, Messianic Psalms catalog, Psalms of Ascent, imprecatory Psalms treatment) is chunk 3C.5.

#### Chunk 3B.6 — Major Prophets Hubs (5 books)

- **Estimated effort:** Cowork batch, ~5 days.
- **Goal:** Isaiah, Jeremiah, Lamentations, Ezekiel, Daniel.
- **Daniel note:** debated-content notice on the dating question (6th century vs. 2nd century Maccabean dating); steelman both views, let the student weigh.
- **Isaiah note:** the single-author vs. Deutero-Isaiah vs. Trito-Isaiah authorship debate with the debated-content notice. The Dead Sea Scroll 1QIsaᵃ is the crucial manuscript witness — cross-link it aggressively.

#### Chunk 3B.7 — Minor Prophets Hubs, batch 1 (6 books)

- **Estimated effort:** Cowork batch, ~4 days.
- **Goal:** Hosea, Joel, Amos, Obadiah, Jonah, Micah.

#### Chunk 3B.8 — Minor Prophets Hubs, batch 2 (6 books)

- **Estimated effort:** Cowork batch, ~4 days.
- **Goal:** Nahum, Habakkuk, Zephaniah, Haggai, Zechariah, Malachi.

#### Chunk 3B.9 — Acts Hub + Pauline Epistles, batch 1 (4 books)

- **Estimated effort:** Cowork batch, ~5 days.
- **Goal:** Acts (bridge), Romans, 1 Corinthians, 2 Corinthians, Galatians.
- **Note:** Romans, Corinthians, Galatians have the most complex contextual demands — give them the full treatment Vision v2 §3.13 calls for. Corinthian moral culture, Galatian Judaizer crisis, Roman Jewish-Gentile tension, Pauline defense of his apostleship.

#### Chunk 3B.10 — Pauline Epistles, batch 2 (5 books)

- **Estimated effort:** Cowork batch, ~5 days.
- **Goal:** Ephesians, Philippians, Colossians, 1 Thessalonians, 2 Thessalonians.
- **Note:** Ephesus-Artemis context for Ephesians. Proto-Gnostic context for Colossians. Eschatology foundation for Thessalonians.

#### Chunk 3B.11 — Pauline Epistles, batch 3 (Pastorals + Philemon, 4 books)

- **Estimated effort:** Cowork batch, ~4 days.
- **Goal:** 1 Timothy, 2 Timothy, Titus, Philemon.
- **Note:** authorship of the Pastorals carries the debated-content notice (traditional vs. critical scholarship).

#### Chunk 3B.12 — General Epistles Hubs (8 books)

- **Estimated effort:** Cowork batch, ~5 days.
- **Goal:** Hebrews, James, 1 Peter, 2 Peter, 1 John, 2 John, 3 John, Jude.
- **Note:** Hebrews authorship carries the debated-content notice. 2 Peter authenticity debate with the notice. Jude's citation of 1 Enoch treated honestly (this is an argument for taking 1 Enoch seriously as at least a culturally authoritative text in the first-century Jewish world).

#### Chunk 3B.13 — Revelation Hub + Apocalyptic Collection

- **Estimated effort:** Cowork batch, ~5 days.
- **Goal:** Revelation hub page (the most OT-saturated NT book — 400+ OT allusions), plus a cross-book "Apocalyptic" featured page that groups Daniel 7–12, Ezekiel 38–39, Isaiah 24–27, Zechariah 9–14, and Revelation.
- **Note:** the four interpretive frameworks (preterist, historicist, futurist, idealist) presented with the debated-content notice. Let the student weigh.

#### Chunk 3B.14 — Apocrypha hubs, batch 1 (5 books)

- **Estimated effort:** Cowork batch, ~5 days.
- **Goal:** Tobit, Judith, Additions to Esther (Greek), Wisdom of Solomon, Sirach.
- **Note:** canonical status banner on every page.

#### Chunk 3B.15 — Apocrypha hubs, batch 2 (4 books)

- **Estimated effort:** Cowork batch, ~4 days.
- **Goal:** Baruch, Additions to Daniel, 1 Maccabees, 2 Maccabees.
- **Note:** 1–2 Maccabees are crucial for the intertestamental context and for understanding Hanukkah — which Jesus observed (John 10:22).

#### Chunk 3B.16 — Apocrypha hubs, batch 3 (5 books — Orthodox additions)

- **Estimated effort:** Cowork batch, ~4 days.
- **Goal:** 1 Esdras, 2 Esdras, Prayer of Manasseh, Psalm 151, 3 Maccabees.
- **Note:** 4 Maccabees if founder confirms — defer to next chunk if not.

#### Chunk 3B.17 — Extra-canonical influences hubs (2 books)

- **Estimated effort:** Cowork batch, ~4 days.
- **Goal:** 1 Enoch (with special attention to the Jude 14–15 citation), Jubilees (with attention to Second Temple chronology influence).
- **Canonical status banner prominent.** These pages must clarify the student's relationship to this material: "quoted once in the NT" and "part of the Ethiopian canon" and "not canonical in any Western tradition" are three different claims, and the page has to distinguish them.

### 4.5 Phase 3B Summary

- **17 chunks**, roughly **one per week = four months.**
- Adds ~80 book hubs (66 canonical + ~14 apocryphal) and 12 collection hubs.
- This is the scripture-first spine of MannaFest. After 3B lands, the site has a defensible claim to being a serious study surface for every book of the Bible.

---

## 5 — Phase 3C: Scriptural Connectivity Depth

With the spine in place, this phase adds the richness that makes scripture come alive as an interconnected whole.

### Chunk 3C.1 — Hebrew Feasts Featured Section

- **Estimated effort:** Cowork batch, ~4 days.
- **Goal:** The feast system as a primary typological surface. Per Vision v2 §7 expanded.
- **Deliverables:**
  - Hebrew Feasts master hub
  - One featured page per feast: Passover, Unleavened Bread, Firstfruits, Pentecost (Shavuot), Trumpets (Rosh Hashanah), Day of Atonement (Yom Kippur), Tabernacles (Sukkot), plus Hanukkah and Purim
  - Each feast: Leviticus 23 (or equivalent) source, historical practice, current Jewish practice where relevant, Christological fulfillment with NT passages
  - The "spring feasts fulfilled / fall feasts awaited" framework presented clearly
  - Connections to the Tabernacle, sacrificial system, Jesus cluster, and the liturgical calendar

### Chunk 3C.2 — Tabernacle Featured Section

- **Estimated effort:** Cowork batch, ~4 days.
- **Goal:** Every piece of the Tabernacle as a node. Per Vision v2 gap analysis §1.3.
- **Deliverables:**
  - Tabernacle master page with open-licensed floor plan (or original SVG — have Cowork generate one rather than risk licensing)
  - Nodes for each element: bronze altar, laver, courtyard, tent structure, showbread table, menorah, altar of incense, veil, ark of the covenant, mercy seat, Holy Place, Holy of Holies
  - Each element: dimensions, materials, ritual use, Christological typology, Hebrews cross-references
  - The progression from courtyard → Holy Place → Holy of Holies as the gospel's shape

### Chunk 3C.3 — Sacrificial System Featured Section

- **Estimated effort:** Cowork batch, ~4 days.
- **Goal:** Every offering type as a node plus the Day of Atonement as its own deep-dive featured page.
- **Deliverables:**
  - Master hub for the sacrificial system
  - Nodes for each offering type: burnt, grain, peace, sin, trespass/guilt
  - Day of Atonement featured page (Leviticus 16) — the two goats, the scapegoat/azazel, the high priest entering the Holy of Holies, the blood theology
  - Full Hebrews cross-referencing (Hebrews is the book that reads Levitical ritual through Christ)

### Chunk 3C.4 — Job Featured Section (multi-level depth)

- **Estimated effort:** Cowork batch, ~5 days.
- **Blocks on:** 3B.5 (Job hub), 3D.1 (Satan — useful but not blocking; can run in parallel with cross-link placeholders).
- **Goal:** Founder flagged Job for definite focus. This treats Job across multiple levels of depth.
- **Deliverables:**
  - Job master featured page
  - **Prose prologue (Job 1–2)** sub-page: the divine council, Satan's role, the wager, the loss of everything. Cross-link to divine council featured page (3D.2).
  - **Poetic dialogue (Job 3–37)** sub-page: the three friends (Eliphaz, Bildad, Zophar) with each one's theological position treated fairly; Elihu's distinct contribution; the cycles of speech structure.
  - **The Lord's answer from the whirlwind (Job 38–41)** sub-page: Behemoth and Leviathan — both read literally and as cosmic symbols (the chaos creatures defeated), with the debated-content notice on literal-vs-symbolic reading.
  - **Epilogue (Job 42)** sub-page: Job's restoration, the rebuke of the friends.
  - **Theodicy across Scripture** cross-cutting page: how other books address suffering (Psalms of lament, Lamentations, Habakkuk, Romans 8, 1 Peter, Revelation).
  - **Ancient Near East parallels** optional sub-page: the Babylonian Job / Ludlul Bel Nemeqi / Sumerian "Man and his God" presented comparatively to show Job's distinctive theology. Debated-content notice where dating or influence is contested.
- **Acceptance:** Job is treated with the weight Vision v2 §3.7 implicitly demands but never made explicit — this chunk fills that gap.

### Chunk 3C.5 — Psalms Featured Section (multi-level depth)

- **Estimated effort:** Cowork batch, ~5 days.
- **Blocks on:** 3B.5 (Psalms hub).
- **Goal:** Founder flagged Psalms for study focus. Deep featured treatment across multiple dimensions.
- **Deliverables:**
  - Psalms master featured page
  - **Five Books of Psalms** sub-hub: Book I (1–41), Book II (42–72), Book III (73–89), Book IV (90–106), Book V (107–150). Each book's theme, authorship pattern, structural placement.
  - **Psalm genres** sub-hub with examples: lament (the largest category), praise, thanksgiving, imprecatory (honest treatment — psalms of cursing, why they're in Scripture, how Christians pray them), royal, wisdom, pilgrimage.
  - **Messianic Psalms catalog** — Psalm 2, 16, 22, 40, 45, 69, 72, 89, 102, 110, 118, 132 at minimum — each with NT usage.
  - **Psalms of Ascent featured sub-page** (Psalms 120–134) — the pilgrim songs sung going up to Jerusalem for the feasts.
  - **Key Psalms featured sub-pages** — Psalm 22 (the crucifixion psalm), Psalm 23 (the shepherd psalm), Psalm 51 (the repentance psalm), Psalm 110 (the most-quoted OT passage in the NT), Psalm 119 (the acrostic on Torah).
  - **Imprecatory Psalms** sub-page — the cursing psalms honestly treated. How Christians read them. The connection to Revelation 6:9-11.
  - **Psalms quoted by Jesus** sub-page (with Psalm 22 and Psalm 31 featured from the cross).

### Chunk 3C.6 — Strong's Deep-Dives (top theological words, batch 1)

- **Estimated effort:** Cowork batch, ~4 days.
- **Goal:** Per Vision v2 §3.4, the most theologically loaded Hebrew and Greek words get dedicated featured pages — not just Strong's entries.
- **Roster (first batch):**
  - Greek: ἀγάπη (agape — love), χάρις (charis — grace), πίστις (pistis — faith), δικαιοσύνη (dikaiosune — righteousness), ἱλαστήριον (hilasterion — propitiation/mercy seat)
  - Hebrew: חֶסֶד (chesed — covenant love), שָׁלוֹם (shalom — peace/wholeness), אֱמֶת (emet — truth/faithfulness), בְּרִית (berith — covenant)
- **Each deep-dive:** full semantic range with every translation variant, example verses, theological essay (citing sourced scholars — Wesley Huff bar), connections to related lemmas, connections to every featured page that draws on this word.

### Chunk 3C.7 — Strong's Deep-Dives, batch 2

- **Roster:** Greek: εἰρήνη (eirene), λόγος (logos), παράκλητος (parakletos), σωτηρία (soteria), ἐκκλησία (ekklesia). Hebrew: נָבִיא (navi — prophet), מָשִׁיחַ (mashiach — anointed/Messiah), צְדָקָה (tsedaqah — righteousness), קָדוֹשׁ (qadosh — holy), תּוֹרָה (torah).

### Chunk 3C.8 — Names of God Featured Section

- **Estimated effort:** Cowork batch, ~4 days.
- **Goal:** Per Vision v3 gap §1.13.
- **Deliverables:** Names of God master hub plus a page per name: YHWH, Elohim, Adonai, El Shaddai, El Elyon, El Roi, plus the compound YHWH names (Jehovah-Jireh, Jehovah-Rapha, Jehovah-Nissi, Jehovah-Shalom, Jehovah-Raah, Jehovah-Tsidkenu, Jehovah-Shammah).
- **Each name:** Hebrew script, transliteration, meaning, first mention, every verse where it's used (filterable), theological weight, connection to Jesus (the I AM statements explicitly claim YHWH's name).

### Chunk 3C.9 — Messianic Prophecy Full Catalog

- **Estimated effort:** Cowork batch, ~5 days.
- **Goal:** Per Vision v2 §3.6, exhaustive messianic prophecy treatment.
- **Deliverables:** master hub, one node per prophecy (~300+ if exhaustive), each with: OT source, NT fulfillment, manuscript attestation where relevant (especially DSS 1QIsaᵃ proving pre-Christ dating), near/far fulfillment labels where applicable, fulfillment tracker (fulfilled / disputed-how-fulfilled / still-future).

### Chunk 3C.10 — Types of Christ Featured Section

- **Estimated effort:** Cowork batch, ~5 days.
- **Goal:** Per Vision v2 §3.20, exhaustive Christological typology.
- **Deliverables:** master hub and featured pages for major types:
  - People: Adam (Second Adam), Abel, Melchizedek, Isaac, Joseph, Moses, Joshua, David, Solomon, Jonah, Boaz (kinsman-redeemer), Elisha (double portion)
  - Events: Flood, Exodus, Passover, Day of Atonement, the Bronze Serpent lifting
  - Objects: Ark of Noah, Ark of the Covenant, bronze serpent, manna, wilderness rock, tabernacle and temple
  - Institutions: priesthood, sacrificial system, kingship, Cities of Refuge, kinsman-redeemer, Jubilee

### Chunk 3C.11 — Covenant Framework Featured Section

- **Estimated effort:** Cowork batch, ~4 days.
- **Goal:** Per Vision v2 gap §1.12, covenant as a primary navigation surface.
- **Deliverables:** covenant master hub, pages per covenant (Edenic/Adamic, Noahic, Abrahamic, Mosaic, Davidic, New Covenant), plus a featured comparison page on Covenant Theology vs. Dispensational Theology with the debated-content notice.

---

## 6 — Phase 3D: The Unseen Realm

The founder explicitly called for deep treatment of Satan, demonology, angelology, spiritual warfare, afterlife (Sheol/Hades/etc.), and Heaven. This phase treats the unseen realm as a fully-navigable surface.

### Chunk 3D.1 — Satan Character Deep-Dive (multi-level featured)

- **Estimated effort:** Cowork batch, ~5 days.
- **Blocks on:** 3C.11 (covenant framework helpful for context) but can run in parallel.
- **Goal:** Founder flagged this for in-depth character analysis. Multi-level featured treatment.
- **Deliverables:**
  - **Satan master featured page** — overview, the theological stakes of getting this right
  - **The Names** sub-page: Satan (the adversary / accuser), Devil (slanderer), Serpent, Dragon, Prince of the Power of the Air, God of this World, Beelzebub, Belial, The Accuser, The Deceiver, The Tempter, Abaddon/Apollyon. **The Lucifer naming question** treated honestly — Isaiah 14 "heilel ben shachar" (morning star), how the Vulgate's "Lucifer" became a proper name, whether Isaiah 14 and Ezekiel 28 actually refer to Satan (some scholars say yes, some say no — debated-content notice).
  - **Origin** sub-page: the pre-fall angel passages (Ezekiel 28, Isaiah 14 — with the debated-content notice on whether these are about Satan or about the kings of Tyre/Babylon as the immediate referents); fallen angel theology; how evil originated in a created good being.
  - **Satan in the OT** sub-page: Genesis 3 (the serpent — is this Satan? Revelation 12:9 makes the identification explicit), Job 1–2 (the accuser in the divine council), 1 Chronicles 21 (inciting David's census — compare 2 Samuel 24 where God is said to incite; honest treatment), Zechariah 3 (accusing the high priest).
  - **The Second Temple development** sub-page: how Jewish thinking about Satan developed between the Testaments; the role of pseudepigrapha like 1 Enoch; the Watchers tradition.
  - **Satan in the NT** sub-page: the temptation of Christ (Matthew 4, Luke 4 — with the order variation), Jesus' confrontations with demons (Satan as their head), Paul's "messenger of Satan" and "thorn in the flesh," the "god of this world" (2 Cor 4:4), Revelation's final defeat.
  - **Powers and limits** sub-page: what Scripture says Satan can and cannot do. The binding and loosing question. The Job-model — Satan acts only within divine permission. Peter's "roaring lion" versus Paul's "schemes."
  - **Final judgment** sub-page: Revelation 20, the lake of fire, the theology of final cosmic defeat.
  - **Cross-links** to: divine council (3D.2), demonology (3D.3), spiritual warfare (3D.4), Job featured section (3C.4), Gehenna/afterlife (3D.5).
- **Acceptance:** every major text about Satan is in the network; the origin-of-evil theological problem is handled honestly (not dodged); the debated passages are flagged; the Christological victory is the arc.

### Chunk 3D.2 — Angelology Featured Section

- **Estimated effort:** Cowork batch, ~4 days.
- **Goal:** Per Vision v3 gap §1.11. Includes the divine council worldview.
- **Deliverables:**
  - Angelology master hub
  - **Types of angels** sub-page: cherubim (Genesis 3, Ezekiel 1 — four living creatures), seraphim (Isaiah 6), the named archangels (Michael, Gabriel), "the angel of YHWH" (the recurring OT figure who both is and is not YHWH — a major Christological question)
  - **The divine council** sub-page: Psalm 82 (God judging among the gods/elohim), Deuteronomy 32:8–9 (the Dead Sea Scroll reading — "sons of God" not "sons of Israel"), Job 1–2, 1 Kings 22 (the lying spirit). Heiser's work cited where appropriate.
  - **Named angels** sub-page: Michael (Daniel 10, 12; Jude 9; Revelation 12), Gabriel (Daniel 8, 9; Luke 1). Named angels in apocryphal literature (Raphael in Tobit, Uriel in 2 Esdras) noted with canonical-status clarity.
  - **The angel of YHWH** sub-page — the Christophany question: is the angel of YHWH in Genesis 16, 22; Exodus 3; Joshua 5; Judges 6, 13 pre-incarnate Christ? Present the Christophany view (historical evangelical position), the separate-angel view, and the manifestation view.
  - **Angels in Christian life** sub-page: guardian angels (Matthew 18:10, Acts 12:15), angels as ministers to believers (Hebrews 1:14), not-worshiping-angels (Colossians 2:18, Revelation 22:9).

### Chunk 3D.3 — Demonology Featured Section

- **Estimated effort:** Cowork batch, ~4 days.
- **Goal:** Per Vision v3 gap §1.11.
- **Deliverables:**
  - Demonology master hub
  - **Origin debates** sub-page: Fallen angels view (Augustine, most Protestant tradition). Nephilim spirits view (Enoch-influenced, some patristic, Heiser, growing evangelical revival). Pre-Adamic view (minority). Each presented with proponents, scriptural support claimed, and critiques — debated-content notice.
  - **The Watchers** sub-page: Genesis 6:1–4 (the sons of God and daughters of men — with the three interpretive views: angelic, Sethite, royal); the 1 Enoch / Jubilees Watchers tradition; how 2 Peter 2:4 and Jude 6 reference it.
  - **The Nephilim** sub-page: Genesis 6, Numbers 13 (the return of the giants), the Anakim/Rephaim/Zamzummim/Emim. Connection to the conquest narratives (why the total-destruction commands — debated-content notice).
  - **Demons in the Gospels** sub-page: the pattern of Jesus' exorcisms, what the demons know and say about Jesus, Legion, the man at the synagogue, the mute demoniac (messianic miracle), the Syrophoenician woman's daughter.
  - **Territorial spirits** sub-page: Daniel 10 (the Prince of Persia, the Prince of Greece), Paul's "principalities and powers," modern interpretive debates.

### Chunk 3D.4 — Spiritual Warfare Featured Section

- **Estimated effort:** Cowork batch, ~3 days.
- **Blocks on:** 3D.1, 3D.2, 3D.3.
- **Goal:** The practical theology of spiritual conflict.
- **Deliverables:**
  - Spiritual Warfare master hub
  - **The armor of God** sub-page (Ephesians 6:10–20) — each piece treated with its OT roots (Isaiah 11, Isaiah 59).
  - **Prayer as warfare** sub-page: the theology, Daniel 10 as a case study (prayer + angelic assistance), Paul's "praying in the Spirit."
  - **Fasting** sub-page: biblical practice, Jesus' "this kind comes out only by prayer and fasting" (Matthew 17 variant reading).
  - **The authority of the believer** sub-page: Luke 10:19, Mark 16:17, James 4:7.
  - **Discernment** sub-page: 1 John 4, testing the spirits.
  - **Victory at the cross** sub-page: Colossians 2:15, Hebrews 2:14. The decisive blow already struck.

### Chunk 3D.5 — Afterlife Vocabulary (Sheol, Hades, Abyss, Tartarus, Gehenna)

- **Estimated effort:** Cowork batch, ~4 days.
- **Goal:** Founder flagged for in-depth treatment. Every afterlife word in the biblical vocabulary disambiguated.
- **Deliverables:**
  - Afterlife master hub
  - **Sheol (שְׁאוֹל)** sub-page: Hebrew concept, the grave / the place of the dead, the OT's general ambiguity about what happens after death, the progressive revelation
  - **Hades (ᾅδης)** sub-page: Greek rough equivalent to Sheol in the LXX, NT usage, Jesus' "I hold the keys of Death and Hades" (Revelation 1:18), the rich man and Lazarus (Luke 16) — what it does and doesn't teach
  - **Abraham's Bosom / Paradise** sub-page: Luke 16, Luke 23:43 ("today you will be with me in paradise"), 2 Corinthians 12 (Paul caught up to paradise/third heaven), Revelation 2:7
  - **The Abyss (ἄβυσσος)** sub-page: Luke 8:31, Romans 10:7, Revelation 9:1–2, 11, 17:8, 20:1–3. The prison for certain kinds of spirits.
  - **Tartarus (ταρταρόω)** sub-page: 2 Peter 2:4 only — the deepest prison for the sinning angels. Connection to 1 Enoch's Watchers.
  - **Gehenna (γέεννα)** sub-page: Jesus' primary word for final judgment, distinct from Hades. The Valley of Hinnom historical background. Every Gehenna passage in the Gospels.
  - **The intermediate state** featured sub-page: what happens between death and resurrection. Presented across traditions: soul sleep (minority view), conscious presence with Christ (majority), purgatorial views (Catholic tradition with the debated-content notice).
  - **The lake of fire** sub-page: Revelation 19:20, 20:10, 20:14–15, 21:8. Distinct from Hades (Hades is cast into it).
  - **Death and the second death** sub-page: Revelation 2:11, 20:6, 20:14, 21:8. The theology of two deaths.

### Chunk 3D.6 — Heaven Featured Section (multi-level depth)

- **Estimated effort:** Cowork batch, ~5 days.
- **Goal:** Founder flagged for in-depth treatment.
- **Deliverables:**
  - Heaven master hub
  - **The three heavens** sub-page: Paul's "caught up to the third heaven" (2 Cor 12). The sky / the stars / the presence of God. Hebrew/Greek vocabulary.
  - **The throne room** sub-page: the major throne room visions unified — Isaiah 6, Ezekiel 1 and 10, Daniel 7, Revelation 4–5. The repeating features (living creatures, encircling worship, the rainbow, the sea of glass).
  - **The Heavenly Temple** sub-page: Hebrews' argument that the earthly tabernacle was a copy of the heavenly reality (Hebrews 8:5, 9:23–24); Revelation's temple imagery.
  - **The intermediate state in Heaven** sub-page: what the departed believers are doing before the resurrection. Revelation 6:9–11 (the souls under the altar), Revelation 7:9–17 (the great multitude).
  - **The New Heavens and New Earth** sub-page: Isaiah 65–66, 2 Peter 3, Revelation 21–22. The continuity and discontinuity with the present creation.
  - **The New Jerusalem** sub-page: Revelation 21–22 in detail — dimensions, gates (the twelve tribes), foundations (the twelve apostles), the river, the tree of life, no temple (God and the Lamb are the temple), no sun or moon.
  - **What believers will be and do** sub-page: the resurrection body (1 Cor 15), reigning with Christ, the judgment of angels (1 Cor 6:3), worship forever.
  - **Jesus' teaching on heaven** sub-page: the Sermon on the Mount references, the Beatitudes' "theirs is the kingdom of heaven," the Father's house with many rooms (John 14).

---

## 7 — Phase 3E: Character + Lineage + Place + Manuscript Content

### Chunk 3E.1 — Character Profiles (40 major figures)

As v2 Phase 3A.1. 40 character profiles following the existing template. Roster confirmed by founder.

### Chunk 3E.2 — Place Profiles (30 major locations)

As v2 Phase 3A.2. 30 place profiles with map integration.

### Chunk 3E.3 — Manuscript Profiles

As v2 Phase 3A.3. DSS, Sinaiticus, Vaticanus, Masoretic, LXX, Peshitta, major papyri.

### Chunk 3E.4 — Genealogies and Family Trees Featured Section

- **Estimated effort:** Cowork batch, ~5 days.
- **Blocks on:** Phase 2.7 (genealogy framework), 3E.1 (character profiles).
- **Goal:** Founder flagged genealogies and the Jeconiah blood curse specifically.
- **Deliverables:**
  - Genealogies master hub
  - **Adam to Noah** featured tree (Genesis 5) — the pre-flood patriarchs, the "walked with God / was no more" of Enoch, the Sethite line.
  - **Noah to Abraham** featured tree (Genesis 11) — Table of Nations (Genesis 10) as a side surface; the narrowing to Shem's line.
  - **Abrahamic family** featured tree — Ishmael and Isaac, Esau and Jacob, the Twelve Tribes from Jacob's sons.
  - **The Twelve Tribes** as a connected surface — each tribe as a node with its blessings (Genesis 49, Deuteronomy 33), its territory, its history, its ultimate presence on the New Jerusalem's gates.
  - **The Davidic line through Solomon (Matthew's genealogy, royal line)** — the kings of Judah, the exile, the return.
  - **The Davidic line through Nathan (Luke's genealogy, biological line)** — less-known, crucial for the Jeconiah question.
  - **The High Priestly line** — Aaron through Caiaphas, with the Zadokite priesthood arc.
  - **The Jeconiah Blood Curse** — its own featured sub-page:
    - The curse itself: Jeremiah 22:24–30 — "no man of his descendants shall prosper, sitting on the throne of David"
    - The problem: Matthew's genealogy traces Jesus through Jeconiah via Joseph
    - The resolution: Jesus is Joseph's *legal* heir (through adoption/legal fatherhood) but Mary's *biological* descendant via Nathan's line (Luke 3:31)
    - Why the virgin birth is genealogically necessary: it allows Jesus to hold legal kingship (through Joseph's line as adopted heir) while avoiding the biological curse (by descending from David through Nathan via Mary)
    - The apologetic weight: this is a feature, not a bug, of the genealogies — and it only works with the virgin birth
  - **Jesus at the intersection** — the featured visualization showing all the major genealogical lines converging on Christ
- **Acceptance:** the Jeconiah page is rigorous and clear; the genealogy visualizations render correctly using the Phase 2.7 framework; every genealogy ties into character profiles (3E.1) where they exist.

---

## 8 — Phase 3F: Study Trails

As Vision v2 §3.31. Builds on everything that precedes it.

- **Chunk 3F.1 — Lamb of God Trail** (the flagship — 2.5–3 hours of study)
- **Chunk 3F.2 — Covenant Thread Trail** (3 hrs)
- **Chunk 3F.3 — Atonement Trail** (2 hrs)
- **Chunk 3F.4 — Kingdom of God Trail** (3 hrs)
- **Chunk 3F.5 — Resurrection Trail** (2 hrs)
- **Chunk 3F.6 — Hall of Faith Trail** (2 hrs)
- **Chunk 3F.7 — Romans Road Trail** (1.5 hrs)
- **Chunk 3F.8 — The Just Shall Live By Faith Trail** (1.5 hrs)
- **Chunk 3F.9 — Suffering Servant Trail** (2 hrs)
- **Chunk 3F.10 — Seed Promise Trail** (1.5 hrs)

Each: Cowork batch of 3–4 days. Framework filled per §3.31 template; the founder authors revelation-point content at his own pace.

---

## 9 — Phase 4: Deferred from v2's Phase 3 (still important, just not scripture-first)

These all stand on the scripture foundation that Phases 3A–3F build. Each remains as scoped in Build Plan v2 — just sequenced later.

- **Chunk 4.1 — Apologetics Foundation (four-section structure)** — v2 3A.4
- **Chunk 4.2 — Six Initial Feature Pages** (Isaiah Mini-Bible, Bronze Serpent, Suffering Servant, Seed Promise, Genealogies of Christ, Bible Codes) — v2 3A.5
- **Chunk 4.3 — Intertestamental Period Featured Section** — v2 3C.1 and Vision v3 gap §1.2
- **Chunk 4.4 — Canon Formation and Textual Criticism** — Vision v3 gap §1.4
- **Chunk 4.5 — Pharisees, Sadducees, Essenes, Zealots** — v2 3B.22
- **Chunk 4.6 — The Twelve Disciples profiles + Judas featured page** — v2 3B.19
- **Chunk 4.7 — The Twelve Tribes** (already partially covered by 3E.4 genealogies; this is the expansion to individual tribe pages) — v2 3B.20
- **Chunk 4.8 — Paul's Path featured section** — v2 3B.21
- **Chunk 4.9 — About Me page** — v2 3A.6
- **Chunk 4.10–4.13 — Systematic Theology populated entries (4 batches)** — v2 3C.4 through 3C.6

---

## 10 — Phase 5: Deeper Reference / Historical / Fringe

Pushed from v2 Phase 3C. All still on the roadmap; none before Phase 4 is substantially complete.

- Hermeneutics featured section (gap §1.7)
- Ancient Near East comparative section (gap §1.8)
- Archaeology as a primary pillar (gap §1.10)
- Creeds and councils featured section (gap §1.5)
- Church history section (v2 §3.25)
- Revivals and moves of God (v2 §3.24)
- Hymns and Psalms sung (v2 §3.25)
- History of prayer (v2 §3.26)
- History of martyrs (v2 §3.27)
- Mazzaroth featured section (v2 §3.22)
- Troy Brewer numerology integration (v2 §3.23)
- Shroud of Turin featured page (v2 §3.15)
- Animal typology featured pages (v2 §3.16) — some overlap with 3C.10 Types of Christ; this is the expanded treatment
- Law of First Mention methodology (v2 §3.17)
- Consistent symbolism reference section (v2 §3.18)
- Biblical Numbers full expansion (v2 §3.5)
- End Times Prophecy section (v2 §3.7)
- Commentary Hub author pages (v2 §3.8)
- Gifts and Fruit of the Spirit (v2 §3.19)

---

## 11 — The Context Block to Prepend to Every Cowork Prompt

Unchanged from v2, plus two additions reflecting v3 priorities:

> **Read first and follow exactly:** `STATUS.md`, `Vision_v2_Locked.md`, `MannaFest_Build_Plan_v3_Scripture_First.md` (this document). They are authoritative.
>
> **Non-negotiable rules:**
> 1. Single audience: the student of the Bible who wants to learn.
> 2. Open-source data only. No licensed content.
> 3. Reputable sources only. Wesley Huff-tier quality bar.
> 4. No AI-authored historical or theological claims.
> 5. Commentary always attributed, never blended.
> 6. Every edge has a written explanation.
> 7. No isolated nodes (minimum 3 connections before ship).
> 8. Graph never navigates away — side panel only.
> 9. Jesus is the gravitational center.
> 10. Full-density pages (§14 amendment). No Beginner/Study/Deep gating.
> 11. Founder is sole author of revelation notes and trail insights.
> 12. **(v3 addition) Scripture-first priority.** If a proposed feature, page, or connection doesn't serve scripture-based study directly, defer it and note it in the parking lot.
> 13. **(v3 addition) Every content chunk assumes paginated Supabase queries.** No "SELECT *." Respect the 4.5 MB response ceiling. Use ISR on any page that can be cached.

---

## 12 — Decisions the Founder Needs to Make Before Phase 3A Starts

**Required before 3A runs:**

1. **Jesus cluster roster (3A.1).** I proposed 20 titles/roles. Confirm, adjust, or shorten.
2. **Go/no-go on the Synoptic Problem / Q source presentation in 3A.2.** Debated-content notice is the default posture; founder's theological comfort with this presentation is the question.

**Required before 3B starts:**

3. **Apocrypha roster (§4.3).** Confirm which apocryphal books get hubs. Proposed full list is 17; minimum (just Catholic deuterocanon) is 9.
4. **Hebrew Bible alternative ordering — ship it or defer?** The Tanakh-ordering view is a cosmetic addition on top of the Protestant-ordered book hubs. Low cost. Question is whether to include in 3B.1 or defer to Phase 4.
5. **Book hub template field confirmation.** §4.2 proposes the fields. Confirm or adjust before the Torah chunk (3B.2).
6. **Song of Songs allegorical/literal posture.** Debated-content notice is the default; founder's steelman of the allegorical tradition (Gregory of Nyssa, Bernard of Clairvaux, the entire pre-Reformation mainstream) is strong material.

**Required before 3D starts:**

7. **Lucifer-as-Satan posture in 3D.1.** The name "Lucifer" comes from the Vulgate's translation of Isaiah 14's "heilel ben shachar." Whether Isaiah 14 refers to Satan at all is a scholarly debate. The site should steelman the view that Isaiah 14 and Ezekiel 28 *are* about Satan's fall (historical evangelical view) while acknowledging the proximate referents (kings of Babylon and Tyre). Founder's comfort with this framing.
8. **Divine council content depth (3D.2).** Heiser's work is now widely circulated and increasingly uncontested, but historically some evangelical traditions have been cautious. Founder's posture.
9. **Nephilim origin (3D.3).** Angelic view, Sethite view, royal view. All three get presented. Founder's confirmation that all three *should* be presented fairly — even if one clearly has scholarly weight.
10. **Annihilationism / traditional hell (3D.5, 3D.6).** The intermediate state and final state pages will touch the traditional-eternal-torment vs. conditional-immortality/annihilationism debate. Founder's posture on what to present (default: traditional view primary, annihilationism presented with debated-content notice).

**Required before 3E.4 (Jeconiah chunk):**

11. **Virgin birth necessity framing.** The Jeconiah page makes the argument that the virgin birth is *genealogically necessary* for the Messiah to reconcile legal kingship (Matthew's line) with the biological avoidance of the curse (Luke's line). This is a specific argument with sourced proponents. Founder's comfort with leading with this framing.

**Required eventually (not urgent):**

12. **Phase 5 ordering.** Once Phases 3 and 4 land, Phase 5's ordering is a founder call.

---

## 13 — Cadence Note

At one Cowork batch per week:

- Phase 2 completion (2.4, 2.5, 2.6, 2.7, 2.8): **~7 weeks**
- Phase 3A (5 chunks): **~5 weeks**
- Phase 3B (17 chunks — the scripture spine): **~17 weeks / 4 months**
- Phase 3C (11 chunks): **~11 weeks / 2.5 months**
- Phase 3D (6 chunks — the unseen realm): **~6 weeks**
- Phase 3E (4 chunks): **~4 weeks**
- Phase 3F (10 trail chunks): **~10 weeks / 2.5 months**

**Total Phases 2 and 3: ~15 months at one-batch-per-week steady cadence.**

At that point, the site is scripturally comprehensive. Every canonical book has a hub. Every major Christological thread has a featured page. The graph has real density. The unseen realm is mapped. Genealogies visualize. The Jesus cluster is the visible gravitational center.

Phases 4 and 5 add another ~12 months to reach the full v2+v3 vision. Total: ~27 months from today.

At two batches per week (ambitious), cut those in half.

---

## 14 — Closing

The refocus is right. Scripture first, Jesus at the center, featured pages pouring light back onto the canon. Everything else — apologetics, church history, comparative religion, archaeology — stands on a scriptural foundation that will, by the end of Phase 3B, be genuinely comprehensive.

The infrastructure supports it. Vercel and Supabase will not crash. The cost is $45/month at launch.

The remaining discipline is review. Every Friday, for about 30 minutes, you're the bottleneck. Cowork writes, you approve. That rhythm is the whole difference between a 27-month ship and a project that stalls. Protect the Friday.

The student of the Bible who wants to learn will have a home on this site. That's the whole point.
