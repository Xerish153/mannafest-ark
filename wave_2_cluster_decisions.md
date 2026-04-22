# Wave 2 — Cluster Decisions (locked 2026-04-22)

**Purpose:** Authoritative depth-1 spec, batch pairing, palette, stat strip, tagline, and component decisions for every Wave 2 page that has a brief and went through the question walk. Each Wave 2 batch prompt should consume the relevant cluster's section verbatim.

**Status:** 11 of 17 Wave 2 pages locked. 6 pages pending:
- **Briefs missing:** Taw, Trees, Mazzaroth — Wave 2a pages without source briefs in `_ark/source-briefs/`. Question walks deferred until briefs are written or surfaced.
- **Deferred by lock:** Typology of Christ — explicitly deferred to a post-Wave-2 capstone session because its depth-3 drilldowns delegate to most other Wave 2 pages.

**Source briefs:** `_ark/source-briefs/{slug}.md` for the 11 locked pages.

**Routing convention:** All Wave 2 pages ship at `/featured/{slug}` with `/study/{slug}` redirects per Doctrine D.7. Source briefs that specify `/study/*` routes are shorthand; implementation routes to `/featured/*`.

**Existing-page retrofit posture (Wave 2 default):** For every existing-page retrofit (Tabernacle, Bronze Serpent, Suffering Servant, Genealogies, Messianic Psalms, Seed Promise), Cowork's first step is to audit the existing page, flag salvageable content (verse refs, commentary excerpts, citations), then full-build per the brief. Existing URL fragments preserved where possible to avoid link rot.

---

## VerticalThread cluster

**Pages:** Bronze Serpent · Scarlet Thread · Covenants

### Component strategy
- `<VerticalPole />` — bespoke for Bronze Serpent. Bronze SVG pole as structural spine; 4 moments along its length. The pole IS the lifted-up object Christ identifies with — semantically distinct from a thread overlay.
- `<ScarletRibbon />` — shared by Scarlet Thread and Covenants. Reusable scarlet SVG path overlay; configurable for snaking-through-bento (Scarlet Thread) and along-vertical-timeline (Covenants).

### Wave 2 batch pairing
- **Pair: Scarlet Thread + Covenants** — share the `<ScarletRibbon />` primitive; Covenants is theologically dense, Scarlet Thread is fully locked (built-in stability)
- **Solo or cross-cluster: Bronze Serpent** — short, dense, self-contained. Currently parked for cross-cluster pairing. (Option floated: pair with Taw when its brief lands — both vertical-spine, both single-typology pages.)

### Visual coherence
**Strong sibling treatment** — shared parchment + scarlet palette family across all three. Cluster-level recognizable.

### Mobile behavior
- Scarlet Thread + Covenants: standardized (vertical thread on left edge, content stacked right)
- Bronze Serpent: bespoke (pole stays visible at reduced width, tiles stack beside)

### Stat strips (parallel cadence: Number-Plural / Number-Plural / Number-Singular)
- **Bronze Serpent:** 4 moments / 1,400 years / 1 cross
- **Scarlet Thread:** 8 threads / 2,000 years / 1 Lamb
- **Covenants:** 6 covenants / 300 references / 1 blood

### Taglines
- **Bronze Serpent:** "Look, and live." *(brief original — kept)*
- **Scarlet Thread:** "Cut the Bible anywhere, and it bleeds." — William Evans *(brief original — kept)*
- **Covenants:** "Without the shedding of blood there is no remission." (Heb 9:22) *(brief original — kept)*

---

## CorrespondenceGrid cluster (reduced)

**Pages:** Suffering Servant · Genealogies of Christ
**Deferred:** Typology of Christ (post-Wave-2 capstone)

### Component strategy
- `<ManuscriptHero />` — bespoke for Suffering Servant. Museum-frame treatment for the 1QIsa-a photographic hero.
- `<DualGenealogyBanner />` — bespoke for Genealogies. Two parallel ribbons descending from David, converging at Mary/Joseph, single line down to Jesus.
- **Shared primitives:** `<PredictionPair />` (Suffering Servant native; reused by Genealogies §2.4 Jeremiah-curse / Davidic-promise pairing), `<ComparisonCard />`, `<TalmudQuoteCard />`. Heroes stay bespoke.

### Suffering Servant hero specifics
- Museum-frame treatment (subtle drop shadow, off-white frame, caption beneath like a museum placard)
- Image: high-res column XLIV from 1QIsa-a, sourced from Israel Museum's Digital Dead Sea Scrolls archive (`dss.collections.imj.org.il/isaiah`)
- Cowork downloads to `public/images/manuscripts/`; do not hot-link from museum
- Stat strip + tagline render cleanly around the framed photo, not overlaid on it

### Genealogies hero specifics
- Density: inflection points only (~12 names per side, not all 27/42). David at top of divergence; Solomon vs Nathan at split; key milestones (kings, exile via Shealtiel + Zerubbabel as convergence point); Joseph + Mary at final convergence; Jesus beneath
- Five women: italic gold treatment EVERYWHERE they appear (banner AND comparison columns)
- Royal purple ribbon (Matthew/legal/kingly); deep crimson ribbon (Luke/biological/blood)

### Wave 2 batch pairing
- **Pair: Suffering Servant + Genealogies** — both OT↔NT pairing pages; share `<PredictionPair />` and `<ComparisonCard />` and `<TalmudQuoteCard />`

### Visual coherence
**Loose family treatment** — shared parchment background + serif from site-wide design system; each page keeps its bespoke accent palette (Suffering Servant scarlet/gold; Genealogies royal purple/deep crimson)

### Stat strips
- **Suffering Servant:** 700 years / 125 BC / 15 fulfillments
- **Genealogies:** 2 genealogies, 1 Messiah / 5 women named — 3 of them Gentiles / 14 + 14 + 14 generations — the number of David's name in Hebrew *(brief original kept; the colon-clauses earn their length editorially)*

### Taglines
- **Suffering Servant:** "By his stripes we are healed." (Isaiah 53:5) *(brief original — kept)*
- **Genealogies:** "He came through the women Israel would have left out." *(Pastor Marc editorial fingerprint, tightened from original; replaces brief's "The genealogy God wrote includes the people Israel would have left out.")*

---

## RibbonTimeline cluster

**Pages:** Seed Promise · Messianic Psalms · Names of God · Creation to New Creation

### Component strategy
- `<ChronoSpine />` — single generalized primitive. Props: `orientation` (horizontal | vertical), `narrowing` (boolean), `node-shape` (card | point | scriptureChip), `count` (integer). Used by Seed Promise (horizontal narrowing), Names of God (vertical), Creation to New Creation (horizontal non-narrowing).
- `<PsalmLifeArcGrid />` — bespoke for Messianic Psalms. Bento grid in life-of-Christ chronological order with semantic-number color accents per psalm.
- `<VerseParallelHero />` — bespoke for Messianic Psalms. Two identical Ps 22:1 / Matt 27:46 verses with dual attribution chips.
- `<EdenNewJerusalemPanels />` — bespoke for Creation to New Creation. Two-panel architectural hero with seven echo-lines connecting Eden ↔ New Jerusalem.

### Hero treatment per page
- **Seed Promise:** hero IS the depth-1 narrowing ribbon (single `<ChronoSpine />` instance). No separate hero composition.
- **Names of God:** hero IS the depth-1 vertical revelation timeline (single `<ChronoSpine />` instance).
- **Creation to New Creation:** two distinct visuals stacked — `<EdenNewJerusalemPanels />` hero ABOVE the depth-1 nine-anchor `<ChronoSpine horizontal narrowing={false} />` arc.
- **Messianic Psalms:** `<VerseParallelHero />` — Ps 22:1 / Matt 27:46 dual-verse parallel.

### Wave 2 batch pairing
- **Pair: Names of God + Messianic Psalms** — both Hebrew/rabbinic-source-heavy; share `<HebrewNameCard />` and `<TalmudQuoteCard />` build cost
- **Pair: Seed Promise + Creation to New Creation** — both span Genesis → final fulfillment chronologically; both use `<ChronoSpine />` (Seed=narrowing, Creation=non-narrowing — exercises both modes in one batch)

### Visual coherence
**Two-tier coherence:**
- Three timeline pages (Seed Promise, Names of God, Creation to New Creation) share warm parchment + gold palette family
- Messianic Psalms keeps its per-psalm semantic color accents on the same shared parchment background

### Stat strips
- **Seed Promise:** 12 narrowings / 4,000 years / 1 person *(brief original — already parallel cadence)*
- **Messianic Psalms:** 75 NT citations / 25 quotes of Psalm 110:1 / 6 psalms, 1 life *(promotes the Psalm 110:1 stat from depth-2 trivia to hero)*
- **Names of God:** 14 Hebrew names / 6,800 uses of YHWH / 1 self-revealing God
- **Creation to New Creation:** 9 anchor moments / 7 echoes / 1 God rejoining heaven and earth *(brief original — already parallel cadence)*

### Taglines
- **Seed Promise:** "What God promised in the garden, Mary delivered in the manger." *(narrative arc; replaces brief's "The Bible's longest prophecy — told in one word.")*
- **Messianic Psalms:** Tagline "The book Jesus quoted on the cross." + Subtitle "The Son of David sounded just like him." *(brief original tagline kept; subtitle is new; replaces brief's longer subtitle)*
- **Names of God:** Tagline "Every name reveals. None contains." + Subtitle "I will be what I will be." *(brief original tagline kept; subtitle promoted from §2.2 spotlight)*
- **Creation to New Creation:** Tagline "Behold, I make all things new." + Subtitle "Heaven coming down, not us going up." *(brief original tagline kept; subtitle adds the §2.5 corrective)*

---

## Spatial cluster

**Pages:** Tabernacle · Seven Churches

### Component strategy
- `<TabernacleFloorPlan />` — specialization wrapper around Batch 3's generic `<FloorPlan />`. Wrapper owns the 8 furniture-piece SVG paths + zone color regions + scale legend; Batch 3 primitive handles clickable regions, hover/click handlers, accessibility.
- `<AsiaMinorMap />` — specialization wrapper around static SVG (NOT Batch 3's `<InteractiveMap />`). Override the brief's Leaflet call — static SVG matches the antique cartographic aesthetic the brief asks for and avoids dependency overhead. When a future page genuinely needs Leaflet (Pauline missionary journeys probably will), Batch 3's `<InteractiveMap />` supersets in.
- **Batch 3 primitive composition pattern:** Specialization wrappers own data + page-specific styling; Batch 3 primitives handle interaction/render. Future spatial pages compose without re-implementing interaction layer.

### Wave 2 batch pairing
- **Pair: Tabernacle + Seven Churches** — same architectural expertise, same Batch 3 spatial primitive testing, both involve "Christ in/among His space" theology
- If Tabernacle ends up too big given the existing-page audit + full-build pattern, Cowork can split mid-batch

### Tabernacle existing-page retrofit
- Audit existing 702-line page → identify salvageable content → full build per brief → preserve existing URL fragments where possible
- This pattern becomes the Wave 2 default for ALL existing-page retrofits

### Visual coherence
**Independent treatment** — Tabernacle's warm gold-against-parchment is content-meaningful (the actual Tabernacle's actual colors); Seven Churches' sepia cartographic is content-meaningful (antique-map aesthetic). Forcing visual unity erases what each page's spatial primitive does naturally. Shared parchment background and serif from site-wide design system; that's enough.

### Stat strips
- **Tabernacle:** 8 furniture pieces / 3 zones / 1 torn veil
- **Seven Churches:** 7 churches / 7-part template / 7 kingdom parables *(deliberate cadence break — the 7/7/7 IS the page's structural argument; first cadence break in Wave 2)*

### Taglines
- **Tabernacle:** "The Word tabernacled among us." (John 1:14) *(brief original — kept)*
- **Seven Churches:** "He that has an ear let him hear." *(tightened from brief's "He that hath an ear, let him hear what the Spirit saith unto the churches.")*

---

## AnnotatedFigure cluster

**Pages:** Armor of God

### Component strategy
- `<LegionaryFigure />` — specialization wrapper around Batch 3's generic `<AnnotatedFigure />`. Wrapper owns the SVG legionary figure + spiritual-meaning hover content; Batch 3 primitive handles generic hotspot interaction layer.

### Image sourcing
- Hand-drawn SVG legionary based on museum archaeological reconstructions
- Specific reference points: Lorica Segmentata reconstruction (Vindolanda Trust); Coolus-type galea reconstruction; Pompeii-pattern gladius
- Source citations live in a small "image source notes" footnote at bottom of depth-1

### Wave 2 batch pairing
- **Pair: Armor of God + Fruit of the Spirit** — both Pauline (Eph 6 vs Gal 5), both catalog-of-named-things lists, both use `<ComparisonCard />` heavily, share Greek-term-rendering patterns

### Stat strip
- **Armor of God:** 6 pieces + 1 prayer / 4 YHWH echoes / 1 verb: stand *(preserves the §2.4 insight that prayer is co-equal seventh element)*

### Tagline
- **Armor of God:** "Paul looked at a Roman soldier — and saw God's wardrobe." *(brief original — kept)*

---

## Bespoke one-offs cluster (partial)

**Pages locked:** Fruit of the Spirit
**Pages deferred (briefs missing):** Taw, Trees, Mazzaroth

### Fruit of the Spirit

#### Component strategy
- `<FruitTree />` — bespoke for this page. Single illustrated tree bearing nine pieces of fruit on three branches.

#### Image sourcing
- Public-domain botanical illustration, composed to show three branches with three fruits each
- Specific candidate sources: Köhler's *Medizinal-Pflanzen* (1887, fully PD); Wood's *The Illustrated Natural History* (1860s, PD)
- Modify or compose to achieve the three-branch / three-fruit-per-branch arrangement
- Fall back to commissioned hand-drawn SVG if no PD source adapts cleanly

#### Branch palette (reuse Batch 3 tradition tokens)
- Godward → `var(--tradition-reformed)` navy `#1E3A5F`
- Otherward → `var(--tradition-evangelical)` warm red `#A63C3C`
- Selfward → `var(--tradition-charismatic)` amber `#C67B2B`

#### Stat strip
- **Fruit of the Spirit:** 1 *karpos* / 3 triads (Godward, Otherward, Selfward) / 9 facets *(deliberate cadence break — second in Wave 2; the singular-to-plural inversion IS the page's argument)*

#### Tagline
- **Fruit of the Spirit:** "Against such there is no law." (Galatians 5:23b) *(brief original — kept)*

---

## Cross-cluster patterns and rules

### Cadence rule for stat strips
Default: Number-Plural / Number-Plural / Number-Singular (collapsing to a punchline).

**Deliberate cadence breaks allowed when the structural pattern IS the argument:**
1. Seven Churches' 7/7/7 (sevenfold pattern across Matthew 13 + Revelation 2-3)
2. Fruit of the Spirit's 1 → 9 inversion (singular *karpos* with multiple facets)

### Component composition pattern
Specialization wrappers own page-specific data + content; Batch 3 primitives own generic interaction/render. Future pages compose without re-implementing interaction layers.

### Existing-page retrofit pattern (Wave 2 default)
Audit existing content → salvage what's valuable (verse refs, commentary, citations) → full-build per brief → preserve URL fragments. Applies to: Tabernacle, Bronze Serpent, Suffering Servant, Genealogies, Messianic Psalms, Seed Promise.

### Hero treatment patterns
- Single-visual pages (Bronze Serpent, Names of God, Seed Promise, Tabernacle, Seven Churches, Armor of God, Fruit of the Spirit, Taw): hero IS depth-1 visual
- Two-visual pages (Creation to New Creation, Suffering Servant): bespoke hero ABOVE depth-1 visual
- Verse-parallel page (Messianic Psalms): bespoke `<VerseParallelHero />` above bento

### Visual coherence patterns
- Strong sibling treatment: cluster pages share palette family + visual language (VerticalThread)
- Two-tier coherence: most pages share, outlier preserves content-meaningful difference (RibbonTimeline)
- Loose family treatment: shared neutrals + serif, distinct accent palettes (CorrespondenceGrid)
- Independent treatment: each page's palette is content-meaningful, no cluster-level forcing (Spatial)

---

## What's still pending

Before Wave 2 execution begins:

1. **Briefs for Taw, Trees, Mazzaroth** — author or surface them; run their question walks
2. **BATCH_QUEUE.md Wave 2 batch restructure** — current structure batches 8 pages across 4 batches; needs reshape to absorb Wave 2b's additional 9 pages and reflect the lockings here. Should produce ~9 batches total based on the pairings above:
   - VerticalThread: 1 batch (Scarlet Thread + Covenants) + 1 cross-cluster batch (Bronze Serpent + ?)
   - CorrespondenceGrid: 1 batch (Suffering Servant + Genealogies)
   - RibbonTimeline: 2 batches (Names + Psalms; Seed + Creation)
   - Spatial: 1 batch (Tabernacle + Seven Churches)
   - AnnotatedFigure + bespoke: 1 batch (Armor + Fruit of the Spirit)
   - Bespoke one-offs: 2-ish batches once Taw/Trees/Mazzaroth briefs land
   - Typology of Christ: 1 capstone batch (post-Wave-2)
3. **Doctrine D.7 routing implementation** — `/featured/{slug}` with `/study/{slug}` redirects baked into the first Wave 2 batch
4. **Batch 3, Wave 1 execution** — Wave 2 cannot begin until Batch 3 (typography + diagrams) and Batches 4-7.5 (commentary + editorial infrastructure + Isaiah/Kings retrofit) ship

---

*Locked 2026-04-22. Drop in `_ark/` and reference per Wave 2 batch.*
