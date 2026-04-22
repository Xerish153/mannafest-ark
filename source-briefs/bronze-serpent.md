# Source Brief — The Bronze Serpent
**Route:** `/study/bronze-serpent` (existing feature page; retrofit per Batch C.2)
**Status:** Locked for retrofit
**Sourcing pass:** 2026-04-21, Claude + Pastor Marc
**Scripture anchor:** Numbers 21:4–9 · 2 Kings 18:4 · John 3:14–15

---

## Page intent

The cleanest, most explicitly Jesus-declared type of Christ in the Old Testament. A short, dense, four-moment story traced across 1,400+ years: sin and plague → command and cure → idolatry and destruction → crucifixion and fulfillment.

The aesthetic thesis: the pole itself becomes the page's visual spine. No other feature page renders as a vertical pole. Bronze Serpent owns that visual identity.

Editorial weight: Christ himself named this event as prefiguring his death (John 3:14–15). No other OT event — apart from Jonah's three days — receives that explicit identification. The page should feel weighty with that fact from the first scroll.

## Hero

**Tagline:** *"Look, and live."*

**3-stat strip:**
- 4 moments across 1,400+ years
- 1 symbol, first a cure then an idol
- 1 explicit identification by Jesus himself

**Hero visual:** A tall vertical pole rendered as an SVG element, stretching from the top of depth 1 to its bottom. Four tile-moments are positioned along the pole like signs mounted at different heights. The pole itself is the visual spine of the invitation.

## Depth 1 — Invitation

**Layout:** Vertical pole visual (center-aligned on desktop, edge-aligned on mobile). Four moment-tiles arranged along the pole's length in chronological order. Each tile connects to the pole with a short visual tie.

**Style notes:**
- Warm bronze/copper palette for the pole itself — subtle gradient suggesting weathered bronze
- Scarlet accent on tiles 1 and 4 (sin/plague at the start, crucifixion at the end) bookending the arc
- Muted gold on tile 2 (the cure)
- Ash/charcoal on tile 3 (Hezekiah's destruction)
- Scroll-reveal: the pole "grows" from top to bottom as user scrolls in; each tile fades in as the pole reaches its level
- Hover state on each tile reveals the one-line clue
- Click → depth-3 drilldown for that moment
- Mobile: pole stays visible but scales down; tiles stack to the right of the pole in single column

### The four moments

| # | Moment | Scripture | Location on pole | One-line clue |
|---|---|---|---|---|
| 1 | **The sin and the plague** | Num 21:4–6 | Top of pole | *"Israel grumbled in the wilderness. Fiery serpents came. Many died."* |
| 2 | **The command and the cure** | Num 21:7–9 | Upper-middle | *"God said: make a bronze serpent. Lift it up. Whoever looks, lives."* |
| 3 | **The idolatry and the smashing** | 2 Kings 18:4 | Lower-middle | *"Seven hundred years later, they were burning incense to it. Hezekiah broke it."* |
| 4 | **The fulfillment** | John 3:14–15 | Bottom of pole | *"'Just as Moses lifted up the serpent — so must the Son of Man be lifted up.'"* |

### Closing element below the pole

A simple line directly beneath the final tile, in scarlet:

> **Look, and live.**

## Depth 2 — Framework

Four framework sections, each a card or card cluster.

### 2.1 The paradox: sin's symbol becomes salvation

The theological heart of the page. A symbol of the curse (serpent — Eden, Satan, sin, judgment) becomes the means of healing when lifted up. Paul unfolds the logic:

- **Galatians 3:13** — "Christ became a curse for us"
- **2 Corinthians 5:21** — "He made him who knew no sin to be sin for us"
- **Romans 8:3** — "in the likeness of sinful flesh"

Card treatment: a single emphasized card with a short paragraph and the three verse citations as chips. The concept is simple enough that one card carries it.

Pastor Marc editorial hook: this is the natural place for a founder note on "Christ becoming the curse" — deep theological ground, rich for editorial voice.

### 2.2 The language of the sign

Short framework card on the Hebrew wordplay.

- **nahash** (נָחָשׁ, serpent) and **nehoshet** (נְחֹשֶׁת, bronze/copper) are near-homophones
- The object itself is a "bronze-serpent thing" — the sound of the word carries the meaning of the object
- When Hezekiah later strips the object of its sacred aura, he names it **Nehushtan** — "Bronze Thing" — using the wordplay mockingly

This isn't mystical; it's how Hebrew storytelling works. The wordplay is part of the text. Short card, one paragraph, Hebrew transliteration with the letter forms rendered in the Hebrew font Batch C ships.

### 2.3 Nehushtan — when a symbol becomes a shrine

Dedicated framework card on 2 Kings 18:4. This is the cautionary half of the story.

Content:
- ~700 years pass between Moses and Hezekiah
- The bronze serpent is preserved through the conquest, the judges, the united and divided monarchies
- By Hezekiah's reign (c. 715–686 BC), it's in or near the Temple; Israelites burn incense to it
- Hezekiah destroys it and gives it the mocking name Nehushtan
- The principle the story teaches: *a divinely-appointed symbol can become an idol when the symbol eclipses the reality it points to*
- Direct modern application: the cross itself is subject to the same danger

This is the strongest editorial hook on the page for Pastor Marc — the warning about symbol-worship in contemporary Christianity is the page's most uncomfortable-in-the-best-way moment.

Include the **Talmudic footnote** (Chullin 6b): earlier reforming kings Asa and Jehoshaphat deliberately left the bronze serpent alone so Hezekiah would have something worthy to break. Jewish tradition picks up the same theological beat.

### 2.4 Only Moses, Jonah, and this

Short framework card on the uniqueness of the typology.

Jesus explicitly identifies only two Old Testament events as prefiguring his own death and resurrection:
- **The bronze serpent** — John 3:14 ("as Moses lifted up the serpent… so must the Son of Man be lifted up")
- **Jonah's three days** — Matthew 12:40 ("as Jonah was three days in the belly of the fish, so shall the Son of Man be three days in the heart of the earth")

Every other Old Testament type of Christ is identified by the apostles, the writer of Hebrews, or the early Church — not Jesus himself. This puts the bronze serpent in a uniquely small category.

Cross-link card: "Jonah's three days →" (links to Typology of Christ hub, Jonah entry).

## Depth 3 — Evidence (per-moment drilldowns)

Each of the four moments gets its own drilldown with:

- Full passage text in KJV / WEB / ASV (selectable)
- Hebrew (moments 1–3) or Greek (moment 4) key terms with transliteration and short lexical notes
- Featured commentary excerpt per Doctrine A render spec (≤50 words), attributed and tradition-tagged
- "Show other voices" expansion with additional commentary
- Cross-references to related nodes
- Per-moment typological note

Featured voice on all four drilldowns: **Charles Spurgeon, "The Mysteries of the Brazen Serpent"** (sermon preached 1857, fully PD). Spurgeon's Puritan-evangelical voice fits the evangelistic thrust of the page. Calvin, Matthew Henry, Clarke, and Gill in the "Show other voices" expansion.

### Moment 1 drilldown extras

- Context: the Edom detour (Num 20:14–21) forcing the long way around
- The nature of "fiery serpents" (saraph serpents — linguistic note below)
- Cross-reference to Eden (Gen 3), the serpent as judgment-symbol
- Cross-reference to 1 Corinthians 10:9–11 — Paul's application of this event to the church

### Moment 2 drilldown extras

- Detailed note on the Hebrew wordplay (nahash / nehoshet)
- **Short aside on saraph / seraphim** (per your approval — depth 3 only): the fiery serpents of Num 21 share a Hebrew root with the six-winged seraphim of Isaiah 6. Isaiah 14:29 and 30:6 also use saraph for flying serpents. Linguistic-note treatment only; no doctrinal claims about the relationship between the two. Short paragraph.
- Rabbinic reading (Mishnah Rosh Hashanah 3:8): the Jewish understanding that the serpent didn't heal — God healed through the act of looking up. Not contradicted by the Christian reading; both agree that the efficacy is in turning toward God's provision.

### Moment 3 drilldown extras

- Full 2 Kings 18:1–8 context on Hezekiah's reforms
- The Rabshakeh irony (2 Kings 18:22) — an Assyrian official mistakes Hezekiah's destruction of idols for an attack on Yahweh-worship. Good illustration of how easily even observers conflate a sacred symbol with the God it points to.
- **Talmud Chullin 6b** note on Asa and Jehoshaphat leaving the serpent for Hezekiah to break
- Cross-reference to Isaiah 36–37 / 2 Kings 18–19 (the Assyrian crisis) — Hezekiah's broader reform context

### Moment 4 drilldown extras

- Full John 3:1–21 passage (Jesus and Nicodemus, the context of John 3:14–15 and John 3:16)
- Greek key term: **hypsoō** (ὑψόω, "to lift up") — John uses this verb for both exaltation and crucifixion. John 3:14, 8:28, 12:32–34 all use it; Jesus in each case points forward to his death as "lifting up."
- Cross-reference to Galatians 3:13, 2 Corinthians 5:21 (already in depth 2.1 but cited again here in full)
- Note: the most famous verse in the Bible (John 3:16) sits in the immediate context of Jesus' reference to the bronze serpent. The verse students know by heart is preceded by the verse students need to know to understand it.

## Sources for Cowork to cite

**Primary scripture sources:** KJV 1611, WEB, ASV 1901

**Featured commentary (full use, PD):**
- **Charles Spurgeon**, "The Mysteries of the Brazen Serpent" (sermon preached March 1857, *Metropolitan Tabernacle Pulpit*) — featured voice on all four drilldowns

**Public-domain commentary (Show other voices, full use):**
- Matthew Henry, *Commentary on the Whole Bible*
- John Calvin, *Commentaries*
- Adam Clarke, *Commentary* (1810–1825)
- Jamieson, Fausset & Brown
- John Gill, *Exposition of the Bible*
- E.W. Bullinger, *Companion Bible* — typology appendices

**Patristic sources (cite, limited quotation):**
- **Justin Martyr**, *Dialogue with Trypho* 94, 112 (c. 155 AD) — extensive bronze serpent typology
- **Irenaeus**, *Against Heresies* IV.2.7 (c. 180 AD) — the serpent defeated by the serpent
- **Tertullian**, *Against Marcion* III.18 (c. 207 AD)
- **Augustine**, *Tractates on John* 12 — on John 3:14

**Primary Jewish sources (cite, limited quotation):**
- **Mishnah Rosh Hashanah 3:8** — the rabbinic reading of Num 21:9 (God heals through the act of looking up, not the serpent itself)
- **Babylonian Talmud, Chullin 6b** — Asa and Jehoshaphat leaving the serpent for Hezekiah

**Scholarly / modern (citation only, no text reproduction):**
- M. G. Easton, *Easton's Bible Dictionary* (PD) — Nehushtan entry
- Baruch Levine, *Numbers 21–36* (Anchor Bible, 2000)

**Do NOT cite:** David Guzik / Enduring Word (copyrighted). Chuck Missler, Troy Brewer (living authors — citation only, no reproduction).

## Visual component requirements

1. **VerticalPole** component (new) — SVG pole element that forms the depth-1 spine. Accepts child tile positions. Scroll-reveal "grow" animation. Responsive; on mobile the pole stays visible at reduced width with tiles stacked beside it. One-time bespoke; unlikely to be reused but should be encapsulated cleanly.
2. **PoleTile** component (new) — variant of the generic feature tile, pinned to a position on VerticalPole. Supports scarlet/gold/ash color variants for the four moments.
3. Existing components reused:
   - `<ComparisonCard />` (from Seed Promise brief) — for the "Moses / Jesus" side-by-side at depth 2.4
   - `<TalmudQuoteCard />` (from Scarlet Thread brief) — for the Mishnah Rosh Hashanah 3:8 and Chullin 6b citations
   - `<FeaturedCommentaryCard />` (standard Doctrine A component) — for Spurgeon featured voice

## Connection points (cross-links)

- **Typology of Christ hub** — inbound delegation: Typology's Bronze Serpent drilldown is a short summary + "Read full feature page →" CTA pointing here
- **Seed Promise** — the Eden-serpent / Moses-serpent / Christ arc connects at depth 2.1 (the curse becoming cure); cross-link without duplication
- **Scarlet Thread** — both are "lifted up for salvation" typologies (serpent on pole, thread on scapegoat). Cross-link at depth 2.4
- **Kings of Israel and Judah** — Hezekiah's reforms cross-link outward from moment 3
- **Messianic Prophecies hub** — John 3:14 is Jesus' self-identification as the fulfillment; hub links inward
- **Person profiles** — Moses, Hezekiah, Nicodemus link outward when those retrofits land
- **Isaiah Mini-Bible** — Isaiah 6 seraphim cross-link from the saraph linguistic aside in moment 2

## Editorial posture

Page is a feature page under Vision v2 §7. Present the typology as found. Pastor Marc editorial notes welcomed via Doctrine C drawer and inline editorial cards.

Strongest editorial hooks for Pastor Marc:
- **Depth 2.1** — "Christ became the curse" — the theological paradox at the heart of the page, ground for a substantial founder note
- **Depth 2.3** — "When a symbol becomes a shrine" — the modern cautionary application (the cross as potential idol) is the page's most uncomfortable-in-the-best-way moment, natural for founder voice
- **Moment 4 drilldown** — the John 3:16 context insight (the famous verse preceded by the bronze-serpent reference) is a natural founder hook

## What's out of scope for this page

- Full treatment of Hezekiah's reforms (Kings of Israel and Judah feature page handles)
- Full treatment of Nicodemus (person profile eventually)
- Full treatment of John 3:16 as a standalone verse (verse page handles)
- Full Isaiah 6 / seraphim treatment (Isaiah Mini-Bible + eventual Isaiah 6 drilldown)
- Catholic Marian "New Eve / New Adam" framing (excluded per evangelical posture)
- Modern snake-handling traditions or Nehushtan revival movements (not relevant)

## Approval record

- Depth 1 structure: Option A — vertical pole visual with 4 tiles along it
- Nehushtan/Hezekiah: full depth-1 tile, equal weight with the other three moments
- Hebrew wordplay (nahash/nehoshet): included at depth 2
- saraph/seraphim connection: depth 3 only, as linguistic-note aside
- Featured commentary voice: Spurgeon's 1857 sermon, with Calvin/Henry/Clarke/Gill in "Show other voices"
- Tagline: "Look, and live."
- Approved 2026-04-21 by Pastor Marc, prior to Batch C.2 execution
