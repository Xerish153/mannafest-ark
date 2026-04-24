# Wave D Batch 21 — Consolidated Source Briefs (2 Tier 1 OT Wisdom Books)

**Covers:** Job (Tier 1), Psalms (Tier 1).
**Pairs with:** `batch_21_ot_wisdom.md` (Cowork prompt).
**Authored:** 2026-04-23.
**Tier 2 books** (Proverbs, Ecclesiastes, Song of Solomon) — template-driven inline in prompt Section C; no per-book brief.
**Visual posture:** No AI-rendered imagery. Structural data-graphics keyed off `globals.css` accent tokens. Batch 3 diagram primitives first; extend only where necessary.

---

## Shared conventions (Wisdom corpus)

**Accent color per book:**

| Book | Primary | Secondary | Rationale |
|---|---|---|---|
| Job | `--accent-wisdom` | YHWH-speech gold (custom bright accent in the visual) | Dialogical wisdom with a divine-voice resolution that breaks the dialogical frame |
| Psalms | `--accent-wisdom` | `--accent-prophetic` (messianic Pss) + `--accent-law` (Torah-praise Pss) | Liturgical and devotional poetry with strong prophetic and Torah-centered strands |
| Proverbs | `--accent-wisdom` | — | Gnomic wisdom proper |
| Ecclesiastes | `--accent-wisdom` | muted grey for the *hevel* passages | The book's thematic gravity pulls into contemplation-under-shadow |
| Song of Solomon | `--accent-wisdom` | warm rose/red accent for the love-poetry register | The Puritan allegorical reading reads warmth into even the literal surface |

**Signature-verse rendering.** Per Batch 20 precedent: the signature verse displays in the hero with `.scripture-text` class and primary-accent border. One instance of extended verse text per hub; all other verse display happens in depth-3 reader routes.

**Stat strip.** One row, four stats. Chapters / Timespan or Period / Major figures or Structural feature / Cross-references count.

**Commentary spotlight.** Doctrine A: one featured excerpt ≤50 words + "Show other voices" disclosure.
- Job: Matthew Henry expected as default featured voice (complete Bible shipped Batch 4+5).
- Psalms: Spurgeon's Treasury of David as the default featured voice across all 150 Psalms (shipped Batch 8.1).
- Auto-rank fallback handles any gaps.

**Editor's Notes drawer.** Reduced visual weight at ship. Empty by design.

---

## 1. Job — `/book/job`

### Identity

42 chapters. The canonical wisdom-literature interrogation of undeserved suffering. Structure: prose prologue (chs 1-2, the heavenly court and Job's calamity) → three cycles of dialogue between Job and his three friends, Eliphaz, Bildad, Zophar (chs 3-27) → Job's hymn to wisdom (ch 28, structurally pivotal) → Job's closing defense (chs 29-31) → Elihu's four speeches (chs 32-37, a late intervention from a younger voice) → YHWH's speeches from the whirlwind (chs 38-41) → Job's double response of repentance (40:3-5 + 42:1-6) → prose epilogue (42:7-17, Job's restoration and the condemnation of the three friends' theology).

Job is theologically unsettling because it refuses easy resolution. The three friends articulate the rigid retribution theology of Deuteronomic historiography — if you suffer, you sinned — and the book as a whole condemns that theology (42:7 "ye have not spoken of me the thing that is right, as my servant Job hath"). YHWH's speeches do not answer Job's question (why does the righteous suffer?); they relativize the question by showing the vastness of divine governance. The book's resolution is not an answer but a theophany.

Traditional dating places Job in the patriarchal period (no mention of Mosaic Law, priestly sacrifice offered by Job himself as family head, age-markers matching Abraham's era, the *qesitah* currency unit matching Gen 33:19). Critical dating scatters across the post-exilic to late pre-exilic period. Frame per §7.9, Pastor Marc's drawer carries the position.

### Signature verse

**Job 19:25-26** — *"For I know that my redeemer liveth, and that he shall stand at the latter day upon the earth: And though after my skin worms destroy this body, yet in my flesh shall I see God."* (KJV)

This is the book's hinge. In the midst of the dialogue's deepest despair (chs 16-19), Job's faith reaches past the friends' false theology to a coming redeemer. The Hebrew *goel* — kinsman-redeemer. The verse is load-bearing for the future Kinsman-Redeemer feature page (Master Plan §5.7) and for Christological typology.

### Bespoke depth-1 visual — `<JobDialogueStructure />`

**Layout:** A rectangular prose-prologue-and-epilogue frame enclosing a three-cycle column structure, with Elihu's speeches as an interrupt band and YHWH's speeches rendered as a dominant top-down burst.

- **Outer frame:** Two thin horizontal prose bands at top (chs 1-2) and bottom (ch 42:7-17), both using `--accent-wisdom` at low opacity. The prose bands carry the labels "Prose Prologue — Heavenly Court" (top) and "Prose Epilogue — Restoration" (bottom).
- **Central dialogue region:** Three vertical column triads, each representing one cycle of the dialogue. Per cycle: Job's speech column (wider, left-of-center) + three narrower columns for Eliphaz, Bildad, Zophar.
  - Cycle 1: chs 3-14. Job's opening complaint (ch 3) + Eliphaz (4-5) + Job (6-7) + Bildad (8) + Job (9-10) + Zophar (11) + Job (12-14).
  - Cycle 2: chs 15-21. Eliphaz (15) + Job (16-17) + Bildad (18) + Job (19) + Zophar (20) + Job (21).
  - Cycle 3: chs 22-27. Eliphaz (22) + Job (23-24) + Bildad (25) + Job (26-27). Third cycle is truncated — Zophar doesn't speak again; the pattern breaks. This is a deliberate narrative signal that the dialogue has exhausted itself.
  - Job's columns use `--accent-wisdom` at full strength. Friends' columns use a cooler desaturated tone to signal their rigid retribution theology.
- **Job's hymn to wisdom (ch 28):** Pivotal. Rendered as a narrow horizontal band between cycles 3 and Job's closing defense. Labeled with Job 28:28 — *"the fear of the Lord, that is wisdom"* — the book's own wisdom-literature self-identification.
- **Job's closing defense (chs 29-31):** Single wider column, right side. Job's last word before Elihu.
- **Elihu interrupt (chs 32-37):** A band cutting across the layout with a distinct accent (neutral tan/brown). Labeled "Elihu — a younger voice." Visually positioned between Job's defense and the whirlwind.
- **YHWH speeches (chs 38-41):** A dominant top-down burst from above, using bright gold as the signature accent. The burst visually overrides the dialogue columns, communicating the theophany's resolution. Sub-labels: "First speech — creation and cosmos" (38-39), "Second speech — Behemoth and Leviathan" (40:15-41:34).
- **Job's repentance markers:** Two small pin-markers at 40:3-5 ("Behold, I am vile") and 42:1-6 ("I have heard of thee by the hearing of the ear: but now mine eye seeth thee"). Position them along the border between the whirlwind burst and the epilogue band.
- **Interactivity:** Clicking any speech column opens the relevant chapter range in the reader. Clicking the whirlwind burst opens ch 38 directly. Clicking the hymn-to-wisdom band opens ch 28. Elihu band opens ch 32.

The visual communicates the book's architecture at a glance: enclosed frame (narrative), three cycles (dialogue's exhaustion), Elihu interrupt (unresolved intervention), whirlwind burst (divine theophany that breaks the frame), twofold repentance, restoration.

### Framework sections (depth-2)

1. **The prologue's heavenly court (Job 1-2).** The accuser (*ha-satan*) in the divine council; YHWH's permission of Job's suffering; the two tests (possessions + body); Job's integrity under both ("shall we receive good at the hand of God, and shall we not receive evil?" 2:10). Contrast with the friends' retribution theology. Cross-link into the future Satan-profile page (Master Plan §5.7).
2. **The dialogue's theological collapse.** The three friends articulate a rigid Deuteronomic retribution theology: suffering entails sin. Job refuses to accept the diagnosis because he knows his own innocence. The dialogue's structural feature — cycles that exhaust and truncate — is itself the theological argument. Retribution theology cannot answer the question of the righteous sufferer. Matthew Henry on the friends as "miserable comforters" (Job 16:2); Calvin on the limits of moral logic in his sermons on Job.
3. **The *goel* and the redeemer (Job 19:25-27).** Hebrew *goel* as kinsman-redeemer (Lev 25, Ruth). Job's faith in a future redeemer rising on the earth. Christian readings take this Christologically (Calvin, Matthew Henry); Jewish readings more restrainedly. Framed per §7.9 — the Christological reading is defensible but contested; Pastor Marc's drawer takes the position. Cross-link into Kinsman-Redeemer feature page (parking-lot) and Types-of-Christ (parking-lot).
4. **The whirlwind theophany and the book's resolution.** YHWH does not answer the question Job asks; YHWH reorients Job by displaying the vastness of divine governance (creation, cosmos, Behemoth, Leviathan). Job's response: twofold repentance. The book's resolution is theophanic, not argumentative. This is the book's distinctive contribution to the Bible's wisdom corpus. Gregory the Great's *Moralia* on Job (patristic anchor) is a landmark reading, cited with attribution; substantive ingestion requires a confirmed PD-status check.

### Anchor-verse candidates (no standalone drilldown pages this batch; `featured_page_refs` carries cross-surface load)

- **Job 1:21** — "Naked came I out of my mother's womb" (the book's integrity refrain).
- **Job 19:25-27** — signature passage.
- **Job 38:1-3** — YHWH speaks from the whirlwind (theophany opener).
- **Job 42:5-6** — "now mine eye seeth thee" (theophany resolution).

### Cross-surface registration

- **Kinsman Redeemer** feature page (parking-lot) — Job 19:25-27. Forward-register.
- **Types of Christ** feature page (parking-lot) — Job as typological sufferer. Forward-register.
- **Satan profile** (parking-lot, Master Plan §5.7) — Job 1-2 heavenly court. Forward-register.
- No current live feature page anchors; Job's cross-surface load is minimal until parking-lot pages ship. Register reciprocally when those pages are built.

---

## 2. Psalms — `/book/psalms`

### Identity

150 chapters. The canon's single largest book and the Bible's longest continuous liturgical-devotional corpus. Attributed authorship spans David (73 Psalms, plus Ps 2 and 95 cited Davidic in the NT), Asaph (12: Pss 50, 73-83), Sons of Korah (11: Pss 42, 44-49, 84-85, 87-88), Solomon (2: Pss 72, 127), Moses (1: Ps 90), Heman (1: Ps 88), Ethan (1: Ps 89), anonymous (~50). Composed across roughly a millennium — from Moses (c. 1400 BC if Mosaic Ps 90) through the post-exilic period (Ps 126 "when the Lord turned again the captivity of Zion").

**Fivefold Psalter structure** — the Psalms are edited into five books, each closing with a doxology that explicitly marks the book boundary:

- **Book I** (Pss 1-41) — Davidic dominance. Doxology: 41:13.
- **Book II** (Pss 42-72) — mixed Davidic and Korahite. Doxology: 72:18-20, with the programmatic "the prayers of David the son of Jesse are ended."
- **Book III** (Pss 73-89) — Asaph dominance. Doxology: 89:52. Book III ends with the Davidic-covenant crisis in Ps 89 — "how long, LORD? wilt thou hide thyself for ever?"
- **Book IV** (Pss 90-106) — YHWH-reigns theology as response to Book III's crisis. Doxology: 106:48.
- **Book V** (Pss 107-150) — mixed, concluding with the Hallel (113-118), the Great Hallel (136), the Songs of Ascents (120-134), and the fivefold doxology at the Psalter's close (146-150, each opening and closing with "Hallelujah"). Doxology: 150 as a whole.

The fivefold structure is widely observed as a deliberate parallel to the Pentateuch — the Psalter as "a Torah of David" (Midrash Tehillim 1:2). The Psalter's opening pair (Pss 1-2) functions as an intentional introduction: Ps 1 on Torah-delight, Ps 2 on messianic enthronement — wisdom-and-messiah bookends that orient the entire collection.

**Genre taxonomy** (Gunkel's categories, still the default analytical framework): laments (individual + communal), hymns of praise, thanksgiving Psalms, royal Psalms, wisdom Psalms, imprecatory Psalms, historical Psalms, penitential Psalms (7 traditional: 6, 32, 38, 51, 102, 130, 143), enthronement Psalms.

**Messianic throughline.** Six Psalms dominate the feature-page-anchored messianic corpus: Pss 2 (enthroned Son), 16 (incorruption), 22 (crucifixion), 45 (royal wedding), 69 (suffering), 110 (priest-king). The feature page is live at `/featured/messianic-psalms` and anchors extensively into Psalms. Additional Psalms carry messianic touch-points: 8, 40, 41, 68, 72, 89, 118.

### Signature verse

**Psalm 23:1** — *"The LORD is my shepherd; I shall not want."* (KJV)

Deliberately chosen over the alternatives (Ps 1:1, Ps 19:1, Ps 100:1, Ps 121:1). Ps 23 is the single most-recognized Psalm in the English-speaking Christian world; it serves the single-audience "student of the Bible who wants to learn" better as the door into the Psalter than Ps 1 serves as a structural opener. Ps 1's Torah-delight theme is addressed in the framework section on Ps 1-2 as intentional introduction.

### Bespoke depth-1 visual — `<PsalmsFivefoldPsalter />`

**Layout:** Five stacked horizontal book-bands, each sized proportionally by Psalm count, with layered overlays.

- **Five book-bands (top to bottom):**
  - Book I (Pss 1-41): 41 cells wide.
  - Book II (Pss 42-72): 31 cells wide.
  - Book III (Pss 73-89): 17 cells wide.
  - Book IV (Pss 90-106): 17 cells wide.
  - Book V (Pss 107-150): 44 cells wide.
  - Each band labeled with its book number, Psalm range, doxology reference, and a 2-3 word thematic descriptor ("Davidic core," "Davidic + Korahite," "Covenant crisis," "YHWH reigns," "Hallel + Hallelujah").
  - Each band uses `--accent-wisdom` at base, with band opacity graduated from higher (Book I) to varied shades distinguishing the five books.
- **Cell grid:** Each Psalm is one cell. Cells are interactive: hovering surfaces a tooltip with the Psalm number, its canonical title/ascription (if any), and its primary genre. Clicking opens the Psalm's chapter reader.
- **Author ribbon overlay:** Thin color-coded ribbons running horizontally through the bands, keyed to attributed authorship:
  - David — deep blue ribbon (dominates Book I, strong in Book II, scattered in IV-V).
  - Asaph — amber ribbon (dominates Book III at Pss 73-83).
  - Sons of Korah — green ribbon (Pss 42, 44-49, 84-85, 87-88).
  - Moses — violet ribbon (Ps 90 only, a single cell highlight).
  - Solomon — gold ribbon (Pss 72, 127).
  - Anonymous — no ribbon, bare cell.
- **Genre glyph overlay:** Small icons in each cell corner keyed to primary genre. Lament glyph, thanksgiving glyph, praise-hymn glyph, royal glyph, wisdom glyph, imprecatory glyph, historical glyph.
- **Messianic anchor highlights:** The six primary messianic Psalms (2, 16, 22, 45, 69, 110) render with a bright `--accent-prophetic` outline and a small cross-link glyph. Clicking the glyph opens `/featured/messianic-psalms` at that anchor Psalm's section.
- **Torah-praise highlights:** Pss 1, 19, 119 render with a `--accent-law` outline. These are the Psalter's Torah-praise anchors.
- **Doxology markers:** Vertical pin-markers at the band boundaries (41:13, 72:18-20, 89:52, 106:48, and Ps 150 as the final doxology). Hovering surfaces the doxology text.
- **Special-cluster markers:** The Songs of Ascents (Pss 120-134) render with a subtle terraced visual effect within Book V to communicate the "going up to Jerusalem" thematic. The Hallel (Pss 113-118) and the Great Hallel (Ps 136) get subtle band-internal framing.
- **Interactivity:** Primary interaction is cell-click to open the Psalm. Secondary interactions: author-ribbon click opens an author-focused filter view (parking-lot for Batch 21; stub to no-op, ship the visual primitive for future activation); messianic-glyph click opens the Messianic Psalms feature page.

The visual communicates the Psalter's architecture — fivefold structure, authorship distribution, genre diversity, messianic throughline, Torah-praise bookends, liturgical clusters — at a single glance. No other visual in MannaFest carries this much structural information because no other book carries this much structural information.

### Framework sections (depth-2) — 6 sections (one more than typical; Psalms warrants it)

1. **The fivefold structure as "Torah of David."** The doxology-bookended five-book edition. The intentional parallel to the Pentateuch (Midrash Tehillim). How the five books have distinct theological centers of gravity — Book I's Davidic voice, Book III's covenant crisis, Book IV's YHWH-reigns response. Matthew Henry on the Psalter's editorial architecture (introduction to his Psalms commentary); Spurgeon's Treasury of David preface on the fivefold structure.
2. **Authorship and attribution.** David as primary but not sole. The Asaph corpus. The Sons of Korah. Moses (Ps 90). Solomon (Pss 72, 127). The anonymous Psalms. What Davidic superscription means for historical placement, especially for Pss 3-7, 34, 51-64 where the superscriptions tie Psalms to specific narrative moments in 1-2 Samuel (cross-link reciprocally with 1 Samuel and 2 Samuel book hubs shipped Batch 20).
3. **Genre and form.** The six primary genres (lament / hymn / thanksgiving / royal / wisdom / imprecatory). What each genre's formal markers are. Why the lament is the most common (more than 60 Psalms). The theological significance of imprecatory Psalms (the hardest subset for modern readers — named and framed, not adjudicated; Pastor Marc's drawer carries the position on Christian use of imprecatory language).
4. **Pss 1 and 2 as intentional introduction.** Ps 1 on Torah-delight opens. Ps 2 on messianic enthronement follows. The pair functions as a wisdom-and-messiah frame for the whole Psalter. Jewish tradition (Acts 13:33 cites Ps 2 as "the first Psalm" in some manuscript traditions, a textual detail pointing to their intentional pairing). Cross-link into Messianic Psalms feature page (Ps 2 is an anchor psalm there).
5. **The messianic throughline.** The six primary messianic Psalms + contextual cluster. How the NT Gospels and Epistles appropriate these Psalms. Jesus quoting Ps 22 on the cross; Peter citing Ps 16 at Pentecost (Acts 2:25-28); Hebrews appropriating Ps 110 as the theological spine of its priest-king argument. Cross-link prominently into Messianic Psalms feature page; the Psalms hub is the reciprocal anchor.
6. **The Psalter in Christian liturgy and devotion.** The monastic use (the full Psalter weekly); the Reformation's metrical Psalter tradition (Geneva Psalter, Scottish Psalter); Spurgeon's extended devotional engagement (Treasury of David, 3,000+ pages, the featured-voice corpus for this book). Note that Spurgeon took 20 years to write Treasury of David and described it as the work of his life — a framing Pastor Marc may want to surface in an editorial note.

### Anchor-verse / anchor-Psalm candidates

- **Psalm 1** — Torah-delight (the Psalter's invitation).
- **Psalm 2** — Messianic anchor (rage of the nations, enthroned Son, kiss the Son).
- **Psalm 22** — Messianic crucifixion (Jesus' cry + pierced hands/feet + casting lots).
- **Psalm 23** — signature verse (the Shepherd).
- **Psalm 51** — penitential anchor (David + Bathsheba; reciprocal to 2 Samuel book hub).
- **Psalm 89** — Davidic-covenant crisis (Book III's closing lament).
- **Psalm 90** — Moses' prayer ("teach us to number our days").
- **Psalm 110** — Melchizedekian priesthood (David calls messiah Lord; foundational for Hebrews).
- **Psalm 119** — the Torah-praise acrostic (22 sections × 8 verses = 176; the Psalter's longest chapter).
- **Psalm 150** — the closing Hallelujah.

No standalone drilldown pages this batch. Cross-surface load handled via `featured_page_refs` per prompt Section B.2.

### Cross-surface registration

Substantial. See prompt Section B.2 for the full list. Key anchors:
- **Messianic Psalms** feature page (Wave F) — ~13 rows.
- **Suffering Servant** feature page (Wave F) — Ps 22 as anchor.
- **Covenants** feature page (Wave F) — Pss 2, 132 as Davidic-covenant anchors.
- **Passion Week** cluster (Batch 9 / Wave A) — Ps 118 Hosanna.
- **1 Samuel book hub** (Batch 20) — David's flight-period Psalms (34, 52, 54, 56, 57, 59, 63, 142).
- **2 Samuel book hub** (Batch 20) — Ps 51 (David + Bathsheba).
- **1 Kings book hub** (Batch 20) — Solomonic Pss 72, 127.
- **Genealogies of Christ** feature page (Wave F) — Ps 110 (Matt 22:41-46).
- **Numbers/Deuteronomy book hubs** (Batch 11) — Ps 90 (Moses).

---

## Tier 2 books — template-driven (see prompt Section C)

Proverbs, Ecclesiastes, and Song of Solomon use the uniform Tier 2 template. Signature verses and framework outlines are pinned in the prompt. No per-book brief here.

Key reminders:
- **Proverbs 8** (wisdom personified) is a typological anchor for future Christ-as-Wisdom content — forward-register `featured_page_refs`.
- **Ecclesiastes 12:13-14** is the book's theological payoff and the hub's signature verse.
- **Song of Solomon** carries §7.9 load (literal / allegorical / typological interpretive debate). Pastor Marc's drawer takes a position; do not adjudicate in the prose. Spurgeon's sermons on Song of Solomon are the expected featured voice; note the Puritan-allegorical tradition while making the literal reading equally visible.

---

## Commentary coverage expectations

- **Matthew Henry** — complete Bible, shipped Batch 4+5. Default for Job, Proverbs, Ecclesiastes. Secondary across the board.
- **Spurgeon's Treasury of David** — all 150 Psalms, shipped Batch 8.1. **The featured voice for Psalms.** Also extensive sermon material on Song of Solomon (different corpus, not Treasury).
- **Calvin** — sample-check coverage on Job and Psalms via the working-tree coverage query if possible; report in session record. Commentary on Psalms is one of Calvin's major works; coverage expected but verify.
- **JFB** — shipped Batch 8.4. Secondary voice.
- **Clarke / Barnes / Gill** — varying coverage; auto-rank fallback orders.

Any gap is parking-lot for a future commentary-completion batch. Do not address in Batch 21.

---

## Aggregate stats (expected at Batch 21 close)

- 5 book hubs (2 Tier 1 bespoke, 3 Tier 2 uniform).
- 243 chapter summaries in `draft` status.
- ~45-60 `featured_page_refs` rows across both migrations 082 + 083.
- 2 new bespoke visual components (`JobDialogueStructure`, `PsalmsFivefoldPsalter`).
- 5 new book node files in vault.
- 1 `ot-wisdom` composite added to `book-groups.ts`.
- 2 staged migrations for Marcus's SQL Editor.

## Wave D close aggregate stats (at Wave D push)

- 17 books (12 historical + 5 wisdom).
- 492 chapter summaries.
- ~100-115 `featured_page_refs` rows.
- 9 bespoke visual components (7 + 2).
- 17 book node files.
- 2 category-landing composites (`ot-historical`, `ot-wisdom`).
- 4 staged migrations (080, 081, 082, 083).
- Canonical 66-book coverage at minimum Tier 2 = complete.

---

*Authored 2026-04-23 for Batch 21 (Wave D.2 — OT Wisdom Mega-Batch, Wave D closer). Consolidated format per Marcus preference. Visual posture reflects the 2026-04-23 forward direction locked during Batch 20 authoring. Cowork runs Batch 21 on the same `feat/wave-D-ot-historical` wave branch opened by Batch 20; Marcus pushes and merges Wave D as a single operation after Batch 21 closes.*
