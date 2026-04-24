# Wave D Batch 20 — Consolidated Source Briefs (7 Tier 1 OT Historical Books)

**Covers:** Joshua, Judges, Ruth, 1 Samuel, 2 Samuel, 1 Kings, 2 Kings
**Pairs with:** `batch_20_ot_historical.md` (Cowork prompt)
**Authored:** 2026-04-23
**Tier 2 books (1 Chronicles, 2 Chronicles, Ezra, Nehemiah, Esther)** are template-driven inline in the prompt's Section C — no per-book brief.
**Visual posture:** No AI-rendered imagery. Rainbow-keyed accent colors from `globals.css`; structural data-graphics via the Batch 3 diagram library. See the prompt's "VISUAL DIRECTION" section for the full rule.

---

## Shared conventions

**Accent color per book (primary / secondary from `globals.css`):**

| Book | Primary accent | Secondary accent | Rationale |
|---|---|---|---|
| Joshua | `--accent-historical` | `--accent-law` | Historical narrative rooted in the Torah's promises |
| Judges | `--accent-historical` | `--accent-prophetic` | Historical narrative with proto-prophetic voice |
| Ruth | `--accent-historical` | `--accent-wisdom` | Historical narrative woven with chiastic wisdom structure |
| 1 Samuel | `--accent-historical` | `--accent-prophetic` | Samuel as prophet-judge transition |
| 2 Samuel | `--accent-historical` | `--accent-prophetic` | Nathan and Gad as prophetic conscience of the court |
| 1 Kings | `--accent-historical` | `--accent-prophetic` | Elijah's confrontation with Ahab anchors the second half |
| 2 Kings | `--accent-historical` | `--accent-apocalyptic` | Exile as apocalyptic judgment on the divided kingdom |

**Signature-verse rendering.** Each book's hub displays its signature verse in the hero using the `.scripture-text` class with the primary-accent border. This is the one place where verse text appears on a book hub (Doctrine B: depth-1 carries no extended verse text; signature verse is the single orientational exception per Pauline/Torah precedent).

**Stat strip (one row, four stats).** Chapters / Timespan / Major figures / Cross-references.

**Commentary spotlight.** Per Doctrine A: one featured excerpt ≤50 words + "Show other voices" disclosure. Matthew Henry expected as default anchor for all 7 books (complete Bible shipped Batch 4+5). JFB as secondary. Calvin where available. No per-book commentator selection — auto-rank fallback per Doctrine A handles it; Pastor Marc curates later.

**Editor's Notes drawer.** Reduced visual weight at ship on all hubs. Empty by design — Pastor Marc populates over time.

---

## 1. Joshua — `/book/joshua`

### Identity

24 chapters. The entry narrative — Israel crosses the Jordan, takes the Land, distributes the tribal inheritance, and renews covenant at Shechem. Joshua the successor to Moses ("be strong and courageous," Josh 1), the conquest campaigns (central, southern, northern — Josh 6-12), the tribal allotments (Josh 13-22), and the final covenant renewal with the great "as for me and my house" declaration (Josh 24:15). The book is the hinge between Torah's promises and the historical books' record of those promises unfolding (and unraveling) in the Land.

### Signature verse

**Joshua 24:15** — *"And if it seem evil unto you to serve the LORD, choose you this day whom ye will serve... but as for me and my house, we will serve the LORD."* (KJV)

### Bespoke depth-1 visual — `<JoshuaConquestMap />`

**Layout:** SVG map of Canaan showing the three conquest campaigns as color-coded arcs with numbered waypoints.

- **Base layer:** Stylized outline of Canaan — the Jordan River, the Dead Sea, the Mediterranean coast, the hill country spine. No photorealistic terrain. Flat, clean lines. Canaan's outline uses `--accent-historical` at low opacity as the background tint.
- **Central campaign (arc 1):** Yellow-orange stroke (derived from the `--accent-historical` primary). Waypoints 1-4: Jordan crossing → Jericho → Ai → Gibeon alliance.
- **Southern campaign (arc 2):** Red stroke (a warm secondary). Waypoints 5-9: Five-king coalition defeat at Beth-horon → Makkedah → Libnah → Lachish → Eglon → Hebron → Debir.
- **Northern campaign (arc 3):** Blue stroke (a cool secondary). Waypoints 10-12: Waters of Merom → Hazor (burned) → mop-up of the northern kings.
- **Overlay:** Twelve tribal allotment boundaries rendered as dashed lines after the conquest arcs. Each tribe's territory labeled. Levitical cities marked as small dots; cities of refuge distinctively marked.
- **Interactivity:** Hovering a waypoint surfaces a 1-sentence tooltip citing the chapter reference. Clicking a tribal allotment opens a side-panel with that tribe's territorial description (pulled from Josh 13-21). No navigation-away.

The visual communicates the book's shape at a glance: three campaigns in sequence, then the division of the Land. A student sees "entry → conquest → inheritance" before reading a verse.

### Framework sections (depth-2)

1. **From Moses to Joshua — the continuity question.** Commissioning in Deut 31 + Josh 1; "be strong and courageous" threefold repetition; the Law never leaving Joshua's mouth (Josh 1:8). Tradition comparison: rabbinic on Joshua as prophet (Talmud Bava Batra 14b); Reformed on Joshua as type of Christ entering the heavenly inheritance (Calvin on Joshua 1).
2. **The Conquest debate.** Four interpretive framings presented per Vision §7.9: maximalist historical (traditional evangelical — conquest as literal 7-year campaign c. 1400 BC), minimalist archaeological (Kenyon / Finkelstein — late-date and limited), social-conflict model (Mendenhall / Gottwald — internal peasant revolt), biblical-theological (the conquest as redemptive-historical, not a template for future warfare). Site does not adjudicate. Pastor Marc's drawer is load-bearing here.
3. **Cities of refuge + Levitical cities.** Six refuge cities (Josh 20), forty-eight Levitical cities (Josh 21); the distribution ensures Torah teaching and judicial protection saturates every tribal territory. Typological readings: Spurgeon on cities of refuge as type of Christ (Treasury of David Psalm 46).
4. **The Shechem covenant renewal (Josh 24).** Ancient Near Eastern treaty form (preamble / historical prologue / stipulations / witnesses); Joshua's charge; the people's response; the witness stone. Continuity with Deut 27-30 and forward-echo into the divided kingdom's failures.

### Anchor-verse drilldowns (likely)

- **Joshua 1:8** — "meditate therein day and night" — cross-links to Psalm 1:2, to the Doctrine A commentary spotlight on Psalm 1 (Spurgeon Treasury featured when Batch 21 ships).
- **Joshua 5:13-15** — the Captain of the LORD's host — Christological typology; cross-links to the Angel of the LORD concept node.
- **Joshua 24:15** — the signature verse itself.

### Cross-surface registration

- **Seed Promise** feature page — Joshua as the fulfillment of the Land component of the Gen 12 / Gen 15 promise.
- **Bronze Serpent** feature page — no direct link (the bronze serpent destruction happens in 2 Kgs 18, not Joshua).
- **Kings of Israel and Judah** feature page — Joshua as the pre-monarchy foundation that the later monarchy either honors or squanders.

---

## 2. Judges — `/book/judges`

### Identity

21 chapters. The post-conquest slide into cyclical apostasy. Twelve judges (by most counts — the number varies by inclusion criteria; Othniel, Ehud, Shamgar, Deborah, Gideon, Tola, Jair, Jephthah, Ibzan, Elon, Abdon, Samson, with Abimelech as anti-judge) delivering Israel from successive oppressions. The repeated framework: Israel does evil → God gives them to an oppressor → Israel cries out → God raises a deliverer → deliverance → peace → death of the judge → Israel does evil again. The book's thematic refrain: "In those days there was no king in Israel: every man did that which was right in his own eyes" (Jdg 17:6; 21:25). The long appendix (ch 17-21: Micah's idolatry, the Levite's concubine, the near-extinction of Benjamin) depicts moral collapse not chronologically but as the book's closing diagnosis.

### Signature verse

**Judges 21:25** — *"In those days there was no king in Israel: every man did that which was right in his own eyes."* (KJV)

### Bespoke depth-1 visual — `<JudgesCycleRing />`

**Layout:** Large circular ring diagram showing the fourfold cycle (sin → servitude → supplication → salvation), with the 12 judges positioned around an inner ring by the oppression they delivered from.

- **Outer ring:** Four quadrants labeled in rotational order — Apostasy (top, using a warm accent), Oppression (right, using a cool somber tone), Lament (bottom, using a muted purple), Deliverance (left, using the `--accent-historical` primary). A clockwise flow arrow overlays the quadrant boundaries.
- **Inner ring:** Twelve judge portraits rendered as symbolic glyphs (not faces — a tool or symbol per judge: Othniel a sword, Ehud a left-handed dagger, Shamgar an ox-goad, Deborah a palm tree, Gideon a fleece, Jephthah a vow scroll, Samson a jawbone, etc.). Each glyph color-coded to the oppressor they delivered from (Mesopotamian / Moabite / Philistine / Canaanite / Midianite / Ammonite / Philistine again).
- **Center of the ring:** The refrain, rendered as the visual's focal text: "Every man did that which was right in his own eyes."
- **Interactivity:** Clicking a judge glyph opens a side-panel with their cycle summary and chapter reference. Hovering a cycle quadrant highlights which judges' narratives span that phase.

The visual communicates the book's central insight at a glance: these are not random stories; they are instances of a pattern. The pattern repeats. And the repetition is the diagnosis.

### Framework sections (depth-2)

1. **The deuteronomic cycle.** The fourfold pattern as the book's structuring logic. Calvin on the theological necessity of the cycle (Commentary on Judges 2); Matthew Henry on the cycle as a parable of the human heart.
2. **Judges as proto-prophets.** Each judge as a figure who delivers *and* proclaims. The Spirit-empowered deliverance (Jdg 3:10, 6:34, 11:29, 14:6, 13:25). Line-drawing forward to Samuel as prophet-judge transition in 1 Sam.
3. **Gideon and Samson as contrasting types.** Gideon (Jdg 6-8) — the reluctant deliverer made bold; then the post-deliverance slide (the ephod of Jdg 8:27). Samson (Jdg 13-16) — the Nazirite whose personal undoing mirrors Israel's national undoing. Both save Israel; both expose Israel's condition.
4. **The appendix (Jdg 17-21) as diagnosis.** Micah's household idolatry + the Danite migration + the Levite's concubine + the Benjaminite civil war. Not chronologically late; thematically climactic. The refrain closes the book.

### Anchor-verse drilldowns (likely)

- **Judges 2:10-19** — the deuteronomic cycle programmatic statement.
- **Judges 6:12-16** — Gideon's call (mighty man of valor + who, me?).
- **Judges 21:25** — the closing refrain (the signature verse).

### Cross-surface registration

- **Types of Christ** (parking-lot, when shipped) — Gideon, Samson, Jephthah each carry typological potential.
- **Kings of Israel and Judah** — no direct king references, but the book's closing refrain sets up the monarchy's origin question.
- **Genealogies of Christ** — Judges 4-5 (Deborah) is the generation before Ruth; thematic continuity into Ruth's four-chapter interlude.

---

## 3. Ruth — `/book/ruth`

### Identity

4 chapters. A Moabite widow's loyalty to her Israelite mother-in-law during the period of the judges. Naomi's emptying and return; Ruth's commitment ("whither thou goest, I will go"); Boaz as kinsman-redeemer (*go'el*) claiming both field and widow at the Bethlehem gate; the genealogy to David in the closing verses. The book is chronologically set "in the days when the judges ruled" (Ruth 1:1) — the same period as Judges — but its tone is the opposite: private loyalty and redemptive initiative rather than cyclical collapse. Four chapters, four acts, chiastically arranged.

### Signature verse

**Ruth 1:16** — *"Whither thou goest, I will go; and where thou lodgest, I will lodge: thy people shall be my people, and thy God my God."* (KJV)

### Bespoke depth-1 visual — `<RuthChiasm />`

**Layout:** A four-act chiasm diagram with matched-pair arrows across a center fold.

- **Four-panel vertical stack:** Top panel = Ruth 1 (emptying — Naomi leaves Bethlehem full, returns empty, Ruth clings). Second panel = Ruth 2 (gleaning — Ruth in Boaz's field, providential encounter). Third panel = Ruth 3 (threshing floor — Ruth's bold approach, Boaz's pledge). Bottom panel = Ruth 4 (filling — the gate, the redemption, the child, the genealogy).
- **Chiastic arrows:** Curved arrows connect Ruth 1 ↔ Ruth 4 (emptying ↔ filling; Bethlehem departure ↔ Bethlehem restoration; famine-driven loss ↔ Boaz-supplied abundance). A second pair of arrows connects Ruth 2 ↔ Ruth 3 (Ruth's first approach at the field ↔ Ruth's bold approach at the threshing floor; Boaz's blessing on Ruth ↔ Ruth's pledge to Boaz).
- **Color keying:** The chiasm's outer pair (chs 1 & 4) uses `--accent-historical`; the inner pair (chs 2 & 3) uses `--accent-wisdom` as a subtle shift to mark the book's compositional sophistication.
- **Genealogy footer:** A minimalist genealogy ribbon beneath the chiasm — Perez → Hezron → Ram → Amminadab → Nahshon → Salmon → Boaz → Obed → Jesse → David. The ribbon extends forward as a ghost line into the Matthew 1 genealogy, indicating the cross-surface link to Genealogies of Christ.
- **Interactivity:** Clicking an act panel opens that chapter's full reader. Clicking a name in the genealogy ribbon opens the person node if one exists.

The visual communicates both the book's compositional elegance and its redemptive-historical payoff: Ruth is a short book because it is the hinge between Judges-era chaos and the Davidic line.

### Framework sections (depth-2)

1. **The kinsman-redeemer (*go'el*).** Legal background in Leviticus 25:25-55 and Deuteronomy 25:5-10 (levirate marriage). Boaz's dual role: redeemer of land + levirate husband. Christological typology: Christ as the one who redeems both inheritance and bride. Matthew Henry on Ruth 2-4; Spurgeon sermons on the kinsman-redeemer theme.
2. **Ruth the Moabite.** Deuteronomy 23:3 excludes Moabites to the tenth generation. Ruth's inclusion in the messianic line as the narrative's theological provocation. Rabbinic tradition (Ruth Rabbah) on the acceptance of converts. Matthew 1:5 naming Ruth as one of four women in the genealogy of Christ (with Tamar, Rahab, Bathsheba).
3. **Naomi's return and restoration.** The name-change question (Ruth 1:20 "call me Mara") + the book's closing reversal ("a restorer of thy life and a nourisher of thine old age," Ruth 4:15). Matthew Henry on Naomi as figure of the church emptied and filled.
4. **Ruth in the messianic genealogy.** The ten-name genealogy at Ruth 4:18-22 foreshadows Matthew 1. Deliberate tenth-generation placement of Ruth as a theological statement about the inclusion of Gentiles in the covenant people. Cross-link into Genealogies of Christ feature page.

### Anchor-verse drilldowns (likely)

- **Ruth 1:16-17** — the signature verse (+ the "entreat me not to leave thee" couplet).
- **Ruth 4:18-22** — the closing genealogy ending on David.

### Cross-surface registration

- **Genealogies of Christ** feature page — prominent. Ruth 4:18-22 + Matthew 1:5.
- **Kings of Israel and Judah** — David's great-grandmother; foundational for the Davidic monarchy framing.
- **Types of Christ** (parking-lot) — Boaz as kinsman-redeemer type.
- **Seed Promise** feature page — Ruth as a specific instance of the Gen 3:15 seed promise tracking through surprising genealogical paths.

---

## 4. 1 Samuel — `/book/1-samuel`

### Identity

31 chapters. The transition from judges to monarchy. Four movements: Samuel's rise (1-7 — Hannah's prayer, Samuel's call, the ark captured and returned, Samuel judging all Israel); the people demand a king (8); Saul's reign and initial promise and early failures (9-15); David's rise (16-31 — anointed but not yet reigning; Goliath; Jonathan's covenant; Saul's pursuit; the Philistine sanctuary; Saul's death at Gilboa). The book's central theological tension: human kingship as accommodation vs. as divine gift. God gives Israel what they want (a king like the nations) and also what they need (a man after his own heart).

### Signature verse

**1 Samuel 16:7** — *"The LORD seeth not as man seeth; for man looketh on the outward appearance, but the LORD looketh on the heart."* (KJV)

### Bespoke depth-1 visual — `<FirstSamuelArc />`

**Layout:** A four-movement horizontal arc showing Samuel → Saul → David as an interlocking handoff.

- **Four color-keyed bands across the top, left to right:** Band 1 (Samuel's rise, chs 1-7) uses `--accent-prophetic` as Samuel's prophet-judge role defines the movement. Band 2 (the demand for a king, ch 8) is a narrow transition band in a muted grey. Band 3 (Saul's reign, chs 9-15) uses a warm red-orange for the rising-then-falling arc of Saul. Band 4 (David's rise in Saul's shadow, chs 16-31) uses `--accent-historical` as the new royal-historical thread begins.
- **Overlay arcs:** Three figure-arcs traced across the band boundaries — Samuel's arc spans bands 1-3 and ends at ch 25 (Samuel's death); Saul's arc spans bands 3-4 and ends at ch 31 (Gilboa); David's arc begins in band 4 at ch 16 and extends forward as a ghost line into 2 Samuel. The arcs overlap at band boundaries, visually representing the prophetic-judicial-royal handoff.
- **Pivot markers:** Four annotated pivot points — 1 Sam 7 (Samuel's mediation at Mizpah), 1 Sam 8 (the demand for a king), 1 Sam 15 (Saul rejected), 1 Sam 16 (David anointed). Each pivot is hoverable and surfaces a 1-sentence summary.
- **Interactivity:** Clicking a band opens the first chapter of that movement. Clicking a pivot opens that specific chapter. Figure-arcs are not individually clickable (reserved for future character node linking).

The visual communicates the book's structure as three overlapping lives, not four discrete sections. Samuel hands to Saul; Saul is rejected; David emerges while Saul still reigns.

### Framework sections (depth-2)

1. **Hannah's song and the book's theological grammar (1 Sam 2:1-10).** The song anticipates the Magnificat (Luke 1:46-55); poor raised, mighty brought low, barren made fruitful, kings established. This is the theological key to the entire narrative. Matthew Henry on Hannah's song; Calvin on the providence argument.
2. **The demand for a king (1 Sam 8).** Ancient Near Eastern monarchy as the default political form; Israel's distinctive covenant-kingship framework in Deut 17:14-20; God's consent as accommodation + the enduring tension between "a king like all the nations" and "a king after God's own heart." Cross-link into Kings of Israel and Judah feature page (the framework section of that page on Deuteronomic king-covenant).
3. **Saul's rejection and the "man after God's own heart" (1 Sam 13, 15, 16).** The two rejections of Saul (presumptuous sacrifice at Gilgal; failure to destroy Amalek); the "he hath rejected thee from being king" verdict; the secret anointing of David. Debated material: what "after God's own heart" means — chosen-by-God vs. morally-superior-to-Saul readings. Framed by Pastor Marc's drawer.
4. **David in the wilderness (chs 19-30).** The long cave-and-wilderness period. Psalms composed in this period (per superscriptions: Pss 34, 52, 54, 56, 57, 59, 63, 142). Cross-link into Psalms book hub (ships Batch 21) for the superscription-anchored drilldowns.

### Anchor-verse drilldowns (likely)

- **1 Samuel 2:1-10** — Hannah's song.
- **1 Samuel 16:7** — the signature verse.
- **1 Samuel 17** — the Goliath chapter as chapter-spotlight (narrative rather than single-verse anchor).

### Cross-surface registration

- **Kings of Israel and Judah** feature page — prominent. Saul + David as the foundation of the United Monarchy.
- **Genealogies of Christ** — David's anointing.
- **Messianic Psalms** (Wave F shipped) — the superscription-anchored Psalms composed during David's flight.

---

## 5. 2 Samuel — `/book/2-samuel`

### Identity

24 chapters. David's reign in three movements: his rise to power over Israel (1-10 — the united monarchy consolidates, Jerusalem taken, ark brought up, Davidic covenant given); the fall (11-12 — Bathsheba and Uriah); the consequences (13-24 — Tamar's violation, Absalom's rebellion, Sheba's revolt, the census, the plague, the purchase of the threshing floor of Araunah). The Davidic covenant in chapter 7 is the theological summit of the book and a foundational OT text — a house forever, a throne forever, a kingdom forever. The consequences section reveals David's moral ambiguity and the judgment-within-grace dynamic that will mark the monarchy for the rest of its history.

### Signature verse

**2 Samuel 7:16** — *"And thine house and thy kingdom shall be established for ever before thee: thy throne shall be established for ever."* (KJV)

### Bespoke depth-1 visual — `<SecondSamuelTriptych />`

**Layout:** A three-panel triptych — Rise / Fall / Consequences — with the Davidic covenant (ch 7) rendered as a vertical spine down the center.

- **Left panel (chs 1-10, Rise):** Labeled "Rise." Uses `--accent-historical` at full strength. A timeline within the panel shows: lament for Saul → anointing at Hebron → capture of Jerusalem → ark brought up → Davidic covenant → Nathan's oracle → the Ammonite wars. Key moments as pinpoint markers.
- **Center panel (ch 7, The Davidic Covenant):** Labeled "Covenant." Rendered as a vertical spine, narrower than the flanking panels. Uses a deep royal-purple accent (one of the `globals.css` gradient palettes). The covenant's seven promises listed vertically: house, throne, kingdom, a son who builds the house, chastening with human rods, unbroken mercy, forever.
- **Right panel (chs 11-24, Consequences):** Labeled "Consequences." Uses a muted, desaturated version of the primary accent — visually quieter to communicate the moral weight. A timeline within the panel shows: Bathsheba → Nathan's confrontation → Amnon and Tamar → Absalom's rebellion → Sheba's revolt → the census and plague → Araunah's threshing floor (Mount Moriah / future temple site).
- **Vertical threads:** A thin ribbon labeled "grace" flows from the left panel through the central covenant spine and into the right panel — visually asserting that the consequences do not dissolve the covenant. A parallel ribbon labeled "judgment" traces the moral consequences in the right panel.
- **Interactivity:** Clicking a panel opens the first chapter of that section. Clicking the central spine opens 2 Samuel 7 directly.

The visual communicates the book's theological architecture: David's reign is not a simple rise, and not a simple fall, but a covenant held through both rise and fall.

### Framework sections (depth-2)

1. **The Davidic Covenant (2 Sam 7).** The covenant's structure and its forward reach — Psalm 89, Psalm 132, the messianic trajectory into the Gospels (Matt 1:1 "Jesus Christ, the son of David"). Cross-link into Covenants feature page (shipped Wave F) as the primary anchor.
2. **Jerusalem as the City of David.** Capture of the Jebusite stronghold (2 Sam 5); ark brought up (2 Sam 6); David's plan to build a temple and the deferral to Solomon (2 Sam 7 + 1 Chr 22). Temple-site theology: the threshing floor of Araunah (2 Sam 24:24) = Mount Moriah = temple site = Genesis 22 Akedah site. This identification is the basis for the Mount Moriah thread that runs through the Tabernacle feature page (shipped Wave F).
3. **The Bathsheba narrative and the problem of David.** Chapter-by-chapter on 2 Sam 11-12; Psalm 51 as David's response (cross-link to Psalms book hub when shipped); Matthew Henry on 2 Sam 11 as warning literature; the narrative's unflinching treatment as a hallmark of biblical historiography.
4. **Absalom's rebellion and the foreshadowing of kingdom division.** The north-south tensions in 2 Sam 19-20; Sheba's "we have no part in David" (2 Sam 20:1) as the exact phrase Jeroboam will echo in 1 Kgs 12:16. The unity of the kingdom is fragile in David's own lifetime.

### Anchor-verse drilldowns (likely)

- **2 Samuel 7:12-16** — the Davidic covenant (the signature verse range).
- **2 Samuel 23:1-7** — David's last words (the Rock of Israel, the everlasting covenant).
- **2 Samuel 24:24** — "neither will I offer burnt offerings unto the LORD my God of that which doth cost me nothing" (the purchase of the threshing floor).

### Cross-surface registration

- **Kings of Israel and Judah** feature page — David as the foundation figure.
- **Covenants** feature page (Wave F) — 2 Sam 7 as the Davidic covenant anchor.
- **Messianic Psalms** feature page — multiple Davidic Psalms anchor here.
- **Tabernacle** feature page (Wave F) — the Mount Moriah identification via Araunah.
- **Genealogies of Christ** — David's line continued through Solomon.

---

## 6. 1 Kings — `/book/1-kings`

### Identity

22 chapters. The book opens with David's final days and Solomon's accession; Solomon's wisdom and the temple construction (chs 1-11); the division of the kingdom under Rehoboam and Jeroboam (ch 12); parallel histories of the divided kingdom with Elijah's ministry dominating the second half (chs 13-22 — Elijah on Carmel, Ahab and Jezebel, Elijah's despair and the still small voice, Micaiah's vision). The book traces the promise of the Davidic covenant unfolding through Solomon's glory, then beginning to unravel as idolatry and political fragmentation take hold.

### Signature verse

**1 Kings 18:21** — *"And Elijah came unto all the people, and said, How long halt ye between two opinions? If the LORD be God, follow him: but if Baal, then follow him. And the people answered him not a word."* (KJV)

### Bespoke depth-1 visual — `<FirstKingsDivision />`

**Layout:** A two-phase vertical flow: Phase 1 (United monarchy, chs 1-11, Solomon) rendered as a single wide column; Phase 2 (Divided monarchy, chs 12-22) rendered as two parallel narrower columns (Israel / Judah) with interleaving prophet markers.

- **Phase 1 column (chs 1-11):** Wide, single-column layout. Key moments as stacked cards: Solomon's accession → Gibeon prayer and wisdom → the united kingdom's peak → temple construction → temple dedication (the Shekinah glory filling the house) → Queen of Sheba visit → Solomon's apostasy and the divine announcement of kingdom division. Background uses `--accent-historical` at full strength.
- **Division pivot (ch 12):** A stylized horizontal bar labeled "Division at Shechem" splits the layout. Rehoboam's refusal + the "to your tents, O Israel" moment + Jeroboam's northern coronation.
- **Phase 2 dual columns (chs 13-22):** Two parallel columns. Left column labeled "Israel (North)" lists the northern kings starting with Jeroboam. Right column labeled "Judah (South)" lists the southern kings starting with Rehoboam. Background uses `--accent-historical` at reduced opacity to visually signal the reduced glory.
- **Prophet markers:** Between the two columns, prophet markers sit as horizontal interrupts — Ahijah (the original division oracle), the man of God from Judah (ch 13), Jehu son of Hanani, Elijah (most prominent, dominating chs 17-22), Micaiah. Elijah's marker uses `--accent-prophetic` at full strength.
- **Interactivity:** Clicking a king-name opens the king-profile drilldown on the Kings of Israel and Judah feature page (pre-existing). Clicking a prophet marker opens the relevant chapter.

The visual communicates the book's two-phase structure — from glory to fracture — with prophetic voices cutting across the fracture.

### Framework sections (depth-2)

1. **Solomon's temple (1 Kgs 6-8).** Construction details; dimensions and materials; the temple as fulfillment of 2 Sam 7's promise of a son who builds the house; Solomon's dedication prayer (1 Kgs 8) as covenant-renewal document. Cross-link into Tabernacle feature page (shipped Wave F) — the temple as the expansion and monumentalization of the tabernacle pattern.
2. **The division of the kingdom (1 Kgs 11-12).** Solomon's three sins (1 Kgs 11:1-10 — many wives, foreign wives, idolatry) + the prophetic announcement through Ahijah (1 Kgs 11:29-39) + Rehoboam's failure at Shechem (1 Kgs 12) + Jeroboam's calves at Dan and Bethel (1 Kgs 12:26-33). The division is not a political accident; it is divine judgment with a long prophetic history behind it.
3. **Elijah's ministry (1 Kgs 17-19, 21).** The drought proclamation + Zarephath + the Carmel contest (the signature verse's context) + the flight to Horeb and the "still small voice" + the Naboth's vineyard confrontation. Elijah as the type of the prophet against the apostate crown. Cross-link into the Jesus-titles cluster for "Elijah shall come" typology (Matthew 17, Mark 9).
4. **The divided-kingdom pattern.** Each king introduced with a formulaic regnal summary (accession year, age, length of reign, mother's name for Judah, evaluation). Northern kings uniformly evaluated as evil; southern kings evaluated by their fidelity to David's pattern. Cross-link into Kings of Israel and Judah feature page — this framework section on 1 Kings is the hub-side anchor for the feature page.

### Anchor-verse drilldowns (likely)

- **1 Kings 8:22-53** — Solomon's dedication prayer.
- **1 Kings 18:21** — the signature verse (Elijah on Carmel).
- **1 Kings 19:11-13** — the still small voice at Horeb.

### Cross-surface registration

- **Kings of Israel and Judah** feature page — prominent and extensive. 1 Kings is the primary hub-side anchor for the feature page.
- **Tabernacle** feature page — Solomon's temple as the expansion of the tabernacle pattern.
- **Covenants** feature page — the Davidic covenant's continuation (and strain) through the divided kingdom.
- **Mazzaroth / Types of Christ** — parking-lot until those pages are revisited.

---

## 7. 2 Kings — `/book/2-kings`

### Identity

25 chapters. The continuation of the divided-kingdom narrative from Elijah's ascension through the northern exile (722 BC, Assyria) and the southern exile (586 BC, Babylon). Elisha's ministry dominates chs 1-13 (double portion of Elijah's spirit, the widow's oil, the Shunammite's son, Naaman the Syrian, the floating axe head, the siege of Samaria). The Assyrian crisis (chs 17-20) — the fall of Samaria, Hezekiah's reforms and deliverance from Sennacherib (the 185,000 dead), Isaiah's prophetic ministry intersecting. The Babylonian crisis (chs 21-25) — Manasseh's long and evil reign, Josiah's reforms and the Book of the Law rediscovered, Jehoiakim's rebellion, the fall of Jerusalem in three waves (605 / 597 / 586 BC), the burning of the temple, the Jehoiachin-released-from-prison coda (2 Kgs 25:27-30) as a Davidic-covenant whisper into the exile.

### Signature verse

**2 Kings 17:13** — *"Yet the LORD testified against Israel, and against Judah, by all the prophets, and by all the seers, saying, Turn ye from your evil ways, and keep my commandments and my statutes..."* (KJV)

### Bespoke depth-1 visual — `<SecondKingsExileTrajectory />`

**Layout:** A two-track timeline ribbon running left to right across the full width of the depth-1 region, with Israel (top) and Judah (bottom) tracks converging into their respective exile terminals.

- **Top track (Israel):** Begins at Jehu (2 Kgs 9-10) and ends at Hoshea and the fall of Samaria in 722 BC. The track uses `--accent-historical` transitioning progressively into a cooler desaturated tone as the track approaches Samaria's fall. Each northern king plotted along the track at approximate position by regnal year. The track terminates in a visual break with "722 BC — Assyrian exile" annotation.
- **Bottom track (Judah):** Begins at Joash (2 Kgs 11-12) and extends past Samaria's fall to Zedekiah and the fall of Jerusalem in 586 BC. The track uses `--accent-historical` transitioning into `--accent-apocalyptic` as the track approaches the fall. Each southern king plotted; reform kings (Joash, Hezekiah, Josiah) marked with a brighter outline.
- **Prophet overlays:** Vertical bands cutting across both tracks where a prophet's ministry spans. Elisha band early left. Jonah a small band at Jeroboam II. Amos / Hosea bands at Jeroboam II. Isaiah band at Hezekiah. Jeremiah band at Josiah / Jehoiakim / Zedekiah. Each prophet-name linkable to the corresponding book hub (Wave C shipped all of these).
- **Crisis markers:** Two stylized tear-markers along the Israel track (732 BC Tiglath-Pileser's deportation; 722 BC fall of Samaria). Three along the Judah track (605 BC first deportation; 597 BC second; 586 BC Jerusalem falls). Each marker is hoverable with a 1-sentence historical summary.
- **Coda marker:** At the far right, after the 586 BC Jerusalem-falls marker, a small hopeful marker for 2 Kgs 25:27-30 — Jehoiachin released from prison. Annotated "Davidic covenant not extinguished."
- **Interactivity:** Clicking a king plots opens the feature-page drilldown for that king. Clicking a prophet band opens the corresponding book hub. Clicking a crisis marker opens that chapter.

The visual communicates the book's narrative trajectory — two kingdoms on parallel but diverging arcs, both moving toward exile, with prophets trying to intervene.

### Framework sections (depth-2)

1. **Elisha's ministry (2 Kgs 1-13).** Double portion; the widow's oil; the Shunammite's son; Naaman the Syrian (cross-link into Luke 4:27 where Jesus cites Naaman); the floating axe head; the siege of Samaria; the death of Elisha and the post-mortem resurrection (2 Kgs 13:21). Elisha as type of Christ in the miracle clusters (bread multiplication, raising the dead, healing the Gentile).
2. **The fall of Samaria (2 Kgs 17).** The long chapter-17 sermon on why Israel fell — the enumerated sins (2 Kgs 17:7-18), the prophetic warnings repeatedly sent and rejected (the signature verse), the Samaritan origins from the Assyrian resettlement (2 Kgs 17:24-41; cross-link into Second Temple Jewish sects parking-lot and John 4 Samaritan woman). The fall is not a political accident; it is the enacted judgment of the covenant curses (Lev 26, Deut 28).
3. **Hezekiah and Sennacherib (2 Kgs 18-20).** The Assyrian crisis of 701 BC; Hezekiah's reforms (destroying the bronze serpent Moses made — cross-link into Bronze Serpent feature page as the counter-anchor); Isaiah's intervention; the 185,000 Assyrian dead outside Jerusalem; Hezekiah's healing and the backward shadow; the Babylonian envoys. Cross-link into Isaiah book hub (Wave C) and Bronze Serpent feature page (Wave F).
4. **Josiah's reforms and the fall of Jerusalem (2 Kgs 22-25).** The Book of the Law rediscovered in 622 BC; Josiah's Passover; the reform's inability to avert the judgment already pronounced; the three-wave Babylonian deportation; the burning of the temple; the Jehoiachin coda. Cross-link into Jeremiah book hub (Wave C) — Jeremiah's ministry spans the final decades.

### Anchor-verse drilldowns (likely)

- **2 Kings 2:11** — Elijah's ascension.
- **2 Kings 17:13** — the signature verse (plus the long ch-17 sermon).
- **2 Kings 25:27-30** — the Jehoiachin coda.

### Cross-surface registration

- **Kings of Israel and Judah** feature page — prominent and extensive.
- **Bronze Serpent** feature page — 2 Kgs 18:4 (Hezekiah destroys Nehushtan).
- **Isaiah Mini-Bible** feature page — cross-references to Hezekiah-Sennacherib narrative (Isa 36-39 = 2 Kgs 18-20 near-verbatim).
- **Jeremiah book hub** (Wave C) — Jeremiah's ministry during the fall.
- **Suffering Servant** feature page (Wave F) — the exile context that frames Isaiah 40-66 and its servant songs.

---

## Tier 2 books — uniform template reminders (not in scope of this briefs doc; in prompt Section C)

The remaining 5 books — 1 Chronicles, 2 Chronicles, Ezra, Nehemiah, Esther — follow the uniform Wave C Minor Prophets template. No per-book brief here. See `batch_20_ot_historical.md` Section C for the template and the 5 signature verses pinned per book.

---

## Commentary coverage expectations

Per OPERATING_RULES, Cowork does not do commentary ingestion in this batch; the render fallback handles it. Expected commentary state per book at ship:

- **Matthew Henry:** complete coverage (shipped Batch 4+5). Will render as default featured voice on all 12 book hubs via auto-rank fallback if no Pastor Marc curation exists.
- **JFB:** substantial coverage (shipped Batch 8.4). Second voice in the "Show other voices" expansion.
- **Calvin:** partial OT coverage (per Batch 8.0 pilot + 8.1+ extensions). Spot-check which of the 12 books have Calvin rows; note gaps in session record. Calvin's absence on a given chapter is not a blocker.
- **Spurgeon:** Psalms-only (not applicable to this batch).
- **Clarke / Barnes / Gill / Wesley NT / Geneva:** varying coverage per Batch 8.x ingestions. Auto-rank fallback handles ordering.

Any gap material to a student is parking-lot for a future commentary-completion batch; do not address in Batch 20.

---

## Aggregate stats (expected at Batch 20 close)

- 12 book hubs
- 249 chapter pages
- 249 chapter summaries in `draft` status
- ~15 anchor-verse drilldowns (Cowork judgment during execution)
- 7 bespoke depth-1 visual components
- 1 category landing
- 80-120 `featured_page_refs` rows
- ~45-60 `graph_edges` rows for anchor-verse drilldowns (≥3 outbound per anchor)
- 12 new book node files in vault with WikiLinks

---

*Authored 2026-04-23 for Batch 20 (Wave D.1 — OT Historical Mega-Batch). Consolidated format per Marcus preference for one source-info document per batch. Visual posture reflects the 2026-04-23 forward direction: no AI-rendered imagery on bespoke visuals; rainbow accent keying via `globals.css`; layered depth through structural data-graphics.*
