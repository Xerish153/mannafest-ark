# Source Brief — The Scarlet Thread
**Route:** `/study/scarlet-thread` (retire trail, promote to feature page per Doctrine D.7)
**Status:** Locked for retrofit (Batch C.2 consumable)
**Sourcing pass:** 2026-04-21, Claude + Pastor Marc
**Scripture anchor:** Genesis 38 → Revelation 5 (thread visible); Genesis 3:21 → Revelation 7:14 (blood continuity)

---

## Page intent

Trace the literal scarlet thread through its eight appearances across scripture and through one striking extra-biblical historical anchor (Talmud Yoma 39b). The literal object is the spine; the blood-redemption theology frames it. The most surprising evidence on the page is the Jewish rabbinic admission that the Yom Kippur scarlet thread stopped turning white in AD 30 — the year of the crucifixion.

Distinct from Seed Promise: Seed Promise answers *which person* is the Messiah; Scarlet Thread answers *how* the Messiah saves. Cross-linked, never duplicated.

## Hero

**Tagline:** *"Cut the Bible anywhere, and it bleeds."* — William Evans

**3-stat strip:**
- 8 literal scarlet threads
- 2,000+ years of ritual sacrifice
- 1 final offering

**Hero visual:** The ScarletRibbon component (see §Visual requirements) — a literal scarlet ribbon drawn as a continuous SVG path that snakes through the depth-1 bento grid, connecting the eight anchor tiles. Visually unifies the page.

## Depth 1 — Invitation

**Layout:** Bento grid with the scarlet ribbon as the visual connector. Eight tiles arranged in approximate chronological flow. One featured tile (Yom Kippur / Yoma 39b) rendered larger, with distinct treatment.

**Style notes:**
- Warm palette — parchment cream backgrounds, deep scarlet/crimson accents, gold trim on featured Yom Kippur card
- Each anchor tile has a small scarlet ribbon icon and scripture chip
- Hover state reveals one-line clue; click → depth-3 drilldown
- Scroll-reveal: ribbon draws across the grid as user scrolls into view
- Featured Yom Kippur card: ~2x size of standard tile, distinct gradient background (scarlet fading to white, visualizing the thread-turning-white ritual), larger type
- Mobile: grid stacks to single column; ribbon redraws vertically

### The 8 anchors (in order)

| # | Anchor | Scripture | One-line clue |
|---|---|---|---|
| 1 | **Tamar's twins — the scarlet mark and the reversal** | Gen 38:27–30 | *"A thread marks the firstborn — but the promise goes to the brother without it."* |
| 2 | **The Tabernacle textiles** | Ex 25:4; 26:1, 31, 36; 28:5 | *"Scarlet thread woven through every curtain, every veil, every priestly garment."* |
| 3 | **The cleansing of the leper** | Lev 14:4, 6, 51 | *"Scarlet wool, hyssop, and cedar — the healed are cleansed with the sign of blood."* |
| 4 | **Rahab's cord in the window** | Josh 2:18–21; 6:25 | *"One red cord saves an entire household when Jericho falls."* |
| 5 | **The Yom Kippur scarlet thread** ⭐ featured | Lev 16 + Mishnah Yoma 4:2, 6:8; Talmud Yoma 39b | *"The thread turned white when Israel's sins were forgiven. Until AD 30, when it stopped."* |
| 6 | **Isaiah's invitation** | Isa 1:18 | *"Though your sins be as scarlet, they shall be white as snow."* |
| 7 | **The scarlet robe of mockery** | Matt 27:28 | *"Roman soldiers clothe the Lamb in scarlet — accidentally telling the truth."* |
| 8 | **The Lamb on the throne** | Rev 5:6–12; 7:14 | *"Robes washed white in the blood of the Lamb — the thread's final transformation."* |

### Closing tile

Directly below anchor 8:
> **From Tamar's wrist to the throne of God, one scarlet thread — and it turns white only once, forever.**

## Depth 2 — Framework

Four framework sections, each a card cluster:

### 2.1 The blood continuity

The broader theological spine that carries alongside the literal thread. Short treatment — the literal scarlet thread is the bright symbol; the underlying pattern is blood as the consistent currency of redemption.

Anchors to mention (without full stop-by-stop treatment, since these aren't literal scarlet threads):
- **Gen 3:21** — God clothes Adam and Eve in animal skins (the first implicit sacrifice)
- **Gen 4:4** — Abel's accepted blood offering
- **Gen 22:13** — the ram in Isaac's place
- **Ex 12** — Passover lamb blood on the doorposts
- **Lev 17:11** — "the life of the flesh is in the blood"
- **Heb 9:22** — "without the shedding of blood there is no forgiveness"
- **John 1:29** — "Behold the Lamb of God"

Card treatment: single card titled "Cut the Bible anywhere, and it bleeds" with a short list-visual of these moments along a timeline subordinate to the main ribbon.

Include William Evans's attribution ("the atonement is the scarlet cord running through every page in the entire Bible"). Evans is PD; use his language.

### 2.2 The Forty Years — the scarlet thread in the Talmud

Dedicated framework section for the Yom Kippur / Yoma 39b anchor. This is the single most startling piece of evidence on the page; it deserves its own room.

Content:
- Background on the Yom Kippur ritual (Lev 16) — two goats, one sacrificed, one sent into the wilderness as scapegoat (Azazel)
- Mishnaic tradition (Yoma 4:2, 6:8): a scarlet thread tied to the scapegoat's horns; a second strip on the Temple door
- The miraculous sign: the thread would turn white when the sacrifice was accepted — an answered echo of Isaiah 1:18
- Direct quote from **Babylonian Talmud, Yoma 39b** (Soncino translation, cite verbatim ≤15 words per OPERATING_RULES §3 quote limits). Paraphrase the full four-sign passage in Claude's own words:
    - Forty years before the Second Temple's destruction (AD 70):
        1. The lot for YHWH stopped coming up in the high priest's right hand
        2. The scarlet thread stopped turning white
        3. The westernmost lamp of the menorah stopped staying lit
        4. The Temple doors opened by themselves at night
- Rabbi Yohanan ben Zakkai's recorded rebuke to the Temple doors: cite source, paraphrase the rebuke, do not reproduce the Soncino text in full
- AD 70 minus 40 = AD 30 — the conventional dating of the crucifixion
- Cross-reference to **Rosh Hashanah 31b** where the same tradition appears

Editorial posture: present as found. No rebuttal card. Per our call, this is a feature page, not apologetics — Vision v2 §4.5 does not apply. Pastor Marc editorial note placeholder in the drawer for founder framing.

### 2.3 Typology of the scapegoat

Short framework card — the two goats of Yom Kippur (Lev 16) are both Christ in typology:
- The slain goat — atonement by blood (Christ's sacrifice)
- The scapegoat (Azazel) — bearing sins away (Christ taking the sin of the world)

Patristic citation: **Justin Martyr, *Dialogue with Trypho* 111.3–4** — explicitly identifies Rahab's scarlet cord as a type of Christ's blood. Pre-Christendom (c. 155 AD), cite only, no text reproduction.

Patristic citation: **Clement of Rome, *First Clement* 12** (c. 96 AD) — earliest non-NT source connecting Rahab's cord to redemption by the Lord's blood. Cite only.

### 2.4 The scarlet counterfeit

Brief mention (per our call, skip at depth 1, mention at depth 2). Revelation 17 — Babylon the Great clothed in scarlet, sitting on a scarlet beast. The counterfeit redemption-thread. Scripture itself signals that scarlet is not automatically redemptive — it's the blood behind the scarlet that redeems. Single small card; no elaborate treatment.

## Depth 3 — Evidence (drilldowns)

Each of the 8 depth-1 anchors gets a drilldown with:
- Full verse text (KJV / WEB / ASV selectable)
- Hebrew or Greek where relevant with transliteration
- Commentary excerpts — primary voices by anchor:
    - **Tamar** — Matthew Henry (extensive on Perez-Zerah reversal), Clarke, Gill
    - **Tabernacle** — Bullinger (*Companion Bible* appendices on Tabernacle typology), Henry
    - **Leper cleansing** — Clarke, JFB, Bullinger (numerology of hyssop + cedar + scarlet)
    - **Rahab** — Justin Martyr quotation, Clement of Rome quotation, Matthew Henry, Calvin
    - **Yom Kippur** — Talmud Yoma 39b (primary source), Mishnah Yoma 4:2 + 6:8, Alfred Edersheim *The Temple* (PD, strong on Second Temple ritual)
    - **Isaiah 1:18** — Matthew Henry, Calvin
    - **Matthew 27** — Clarke, Henry, JFB
    - **Revelation 5/7** — Seiss *Apocalypse* (PD), Bullinger's Revelation treatment
- Cross-references to related nodes
- Per-anchor typological note summarizing what this specific anchor contributes to the overall pattern

Special drilldown for **Yom Kippur / Yoma 39b** — extended treatment:
- Full Mishnah Yoma 4:2 + 6:8 context on the ceremony
- The three-stage history of the thread's reliability per the Talmud (every time → sometimes → never)
- Parallel miraculous signs in the four-sign cluster
- Cross-reference to: Red Heifer (Num 19), Isaiah 1:18, Hebrews 9–10 (Christ as eternal high priest)

## Sources for Cowork to cite (PD or citation-only)

**Primary scripture sources:** KJV 1611, WEB (public domain), ASV 1901 (public domain)

**Primary rabbinic sources (cite directly, limited quotation per §3 quote rules):**
- Mishnah Yoma 4:2, 6:8 (c. 200 AD)
- Babylonian Talmud, Yoma 39b (Soncino edition, public domain in the English translation by this point)
- Babylonian Talmud, Rosh Hashanah 31b
- Babylonian Talmud, Yoma 9b (for the "causeless hatred" theological background on the Second Temple's decline)

**Patristic sources (cite, limited quotation):**
- Justin Martyr, *Dialogue with Trypho* 111.3–4 (c. 155 AD) — Rahab's cord as Christ's blood
- Clement of Rome, *First Clement* 12 (c. 96 AD) — Rahab's cord as prophetic
- Origen, *Homilies on Joshua* — typological commentary

**Public-domain commentary (full use):**
- Matthew Henry, *Commentary on the Whole Bible*
- John Calvin, *Commentaries*
- Adam Clarke, *Commentary* (1810–1825)
- Jamieson, Fausset & Brown, *Commentary Critical and Explanatory* (1871)
- John Gill, *Exposition of the Bible* — strong on Hebrew sources and rabbinic parallels
- E.W. Bullinger, *Companion Bible* (1922) — extensive Tabernacle and typology appendices
- Alfred Edersheim, *The Temple: Its Ministry and Services* (1874, PD) — Second Temple ritual detail
- Joseph Seiss, *The Apocalypse* (1865, PD) — Revelation typology
- William Evans, attribution for "cut the Bible anywhere, and it bleeds" (PD)

**Scholarly / historical (citation only, no text reproduction):**
- James Hamilton, *Typology* (Zondervan, 2022) — modern typological framework
- Skip Heitzig, *Bloodline: Tracing God's Rescue Plan from Eden to Eternity* (2018) — modern treatment
- Richard Booker, *The Miracle of the Scarlet Thread* — canonical modern popular treatment
- Adrian Rogers sermons, "The Scarlet Thread Through the Bible" (copyrighted; cite only)

**Do NOT cite:** David Guzik / Enduring Word (copyrighted). Chuck Missler, Troy Brewer (living authors — citation only if unavoidable, no reproduction).

## Visual component requirements

1. **ScarletRibbon** component (new) — SVG path that renders a continuous scarlet ribbon snaking across the depth-1 bento grid, connecting tiles. Responsive; redraws vertically on mobile. Uses the existing moderate-motion scroll-reveal primitive to "draw" as user scrolls into view.
2. **AnchorTile** component — standard tile with scarlet ribbon icon, scripture chip, hover clue, click → drilldown. Variant: **FeaturedAnchorTile** for the Yom Kippur card (larger, gradient, scarlet-to-white visual nod).
3. **TimelineSubordinate** component (reusable) — the small timeline used in depth 2.1 for blood-continuity anchors. Should also be usable on Seed Promise retrofit if layout welcomes.
4. **TalmudQuoteCard** component — distinct treatment for rabbinic primary source quotes (Hebrew + English, attribution chip, tractate reference). Reusable on Isaiah Mini-Bible Two-Isaiahs section, Suffering Servant brief (future).

All four go into `src/components/diagrams/`. ScarletRibbon should also accept alternative color props so Seed Promise's NarrowingRibbon could reuse its geometry.

## Connection points (cross-links)

- **Seed Promise** — shares Genesis → Messiah arc; Seed Promise is *which person*, Scarlet Thread is *how*. Cross-link at depth 2.1 (blood continuity) and depth 2.2 (Rahab is in the messianic line per Matthew 1:5)
- **Typology of Christ** — Scarlet Thread is one of the largest typological arcs; this page is a prime spoke of that hub
- **Tabernacle** — anchor 2 (Tabernacle textiles) cross-links directly to the dedicated Tabernacle feature page
- **Suffering Servant** — Isa 1:18 (anchor 6) is proximate to the broader Isaiah suffering-servant scholarship; cross-link without duplicating
- **Messianic Prophecies hub** — several anchors are prophecies in themselves (Isa 1:18, Gen 3:15 echo in Rev 5)
- **Genealogies of Christ** — Rahab and Tamar both appear in Matthew 1; anchor 1 and anchor 4 cross-link to that page
- **Persons** — Tamar, Rahab, Perez, Zerah each link to their person profiles when those retrofits land
- **Yom Kippur** (future feature page) — deep dive on the Day of Atonement that depth 2.2 is drawing from
- **Red Heifer** (future feature page) — parallel cleansing ritual, scarlet wool appears in both

## Editorial posture

Page is a feature page under Vision v2 §7 (not apologetics under §4.5). Present the evidence as found. No rebuttal or counter-reading cards. Pastor Marc editorial notes welcomed via Doctrine C drawer and section-inline cards.

Strong editorial hooks for Pastor Marc:
- Tamar's wrist thread and the reversal (anchor 1) — "the thread marks, but the promise goes elsewhere first" is a rich editorial hook
- The forty years and the Temple signs (depth 2.2) — this is where founder framing carries the most weight given the Jewish/Christian interpretive divergence
- The Matthew 27 scarlet robe of mockery (anchor 7) — irony as truth-telling; a natural founder voice moment

## What's out of scope for this page

- Full treatment of Yom Kippur liturgy (dedicated Yom Kippur feature page, Wave 7+)
- Full treatment of the Tabernacle (dedicated Tabernacle feature page, upcoming in this same brief batch)
- Full Rahab biography (person profile retrofit)
- Full Tamar biography (person profile retrofit)
- Full treatment of Revelation 17 / Babylon (separate feature page eventually)
- The "crimson-to-white turns on repentance not sacrifice" rabbinic counter-reading (out of scope per feature-page posture)

## Approval record

- Spine: Option C — literal thread at depth 1, blood continuity at depth 2
- Yom Kippur / Yoma 39b: featured card at depth 1 AND dedicated depth 2 framework section
- Tamar anchor: include
- Matthew 27 scarlet robe: include
- Revelation 17 scarlet harlot: skip at depth 1, brief mention at depth 2
- Cross-link to Seed Promise without duplicating the genealogical narrowing
- Approved 2026-04-21 by Pastor Marc, prior to Batch C.2 execution
