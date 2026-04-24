# Source Brief — Messianic Psalms

**Target route:** `/featured/messianic-psalms`
**Wave:** 2b #13
**Walk status:** Walk-complete (confirm against Pastor Marc's walk; brief authored 2026-04-23 per F3 preemptive-brief pass)
**Primitives used:** bespoke `<MessianicPsalmsDepth1 />` composing `<ClusterFeature />` from F3 preamble
**Migrates from:** `/study/messianic-psalms` — existing legacy trail, per F1-01 §Item-3 migration rules applies here (fresh build + delete old + 308 redirect)

---

## 1. Page identity

"All things must be fulfilled, which were written in the law of Moses, and in the prophets, and in the psalms, concerning me." Luke 24:44. The Psalms are not Jesus' inheritance only as devotional literature. They are — by Jesus' own testimony after the resurrection — prophetic material bearing on his specific life and work.

The NT writers use the Psalms to explain the gospel. Acts 2 opens Pentecost by interpreting Ps 16. Acts 4 reads Ps 2 over the opposition to the apostles. Matthew, Mark, Luke, and John each weave Ps 22 through the crucifixion narrative. Hebrews reads Ps 110 as the controlling passage on Christ's priesthood. Paul in Rom 15 cites Ps 69 on Christ's rejection. The New Testament does not invent this reading; the NT inherits it.

This page picks six psalms that — taken together — trace Christ's life from enthronement to session. Each psalm gets its own drilldown with the NT citations that anchor its messianic reading. Ps 22 and Ps 110 are spotlighted as the load-bearing two: Ps 22 because its verse-by-verse correspondence with the crucifixion narrative is among the most remarkable intertextual phenomena in Scripture, and Ps 110 because it is the most-quoted Old Testament chapter in the New Testament.

Tradition-primary: Charles Spurgeon's *Treasury of David* (1870–1885, PD). Spurgeon covered all 150 psalms over fifteen years, assembled quotations from prior commentators (Calvin, Henry, Gill, many others), and added his own exposition. For Messianic Psalms, *Treasury of David* is the single richest PD source.

Per Vision §4.6, every psalm on this page is labeled with the tri-fold taxonomy: **Fulfilled in First Coming**, **Awaiting Second Coming**, or **Progressively Fulfilled**.

---

## 2. Depth 1 visual spec

**Component:** bespoke `<MessianicPsalmsDepth1 />` composing `<ClusterFeature />`.

**Layout:** six-psalm life-of-Christ arc. A horizontal arc (curved or life-stage-organized) showing the progression:

- **Ps 2** — Enthronement ("Thou art my Son; this day have I begotten thee")
- **Ps 16** — Resurrection ("thou wilt not leave my soul in hell")
- **Ps 22** — Crucifixion ("My God, my God, why hast thou forsaken me") — **spotlighted, 2× visual weight**
- **Ps 45** — Bridegroom / royal wedding ("Thy throne, O God, is for ever and ever")
- **Ps 69** — Rejection ("they gave me also gall for my meat; and in my thirst they gave me vinegar to drink")
- **Ps 110** — Ascension and session ("Sit thou at my right hand, until I make thine enemies thy footstool") — **spotlighted, 2× visual weight**

Each entry clickable into its drilldown. Each carries its tri-fold taxonomy chip inline (Fulfilled in First Coming / Awaiting Second Coming / Progressively Fulfilled) so the taxonomy is legible at depth 1.

No verse text at depth 1 beyond each psalm's title tag (≤12 words).

**Ten-second test:** "Six psalms, life-of-Christ progression. Two are spotlighted (Ps 22 crucifixion, Ps 110 session). Click any for the NT anchor citations."

---

## 3. Depth 2 framework sections

### Section 1 — Christ's own hermeneutic (Luke 24:44)

- **Luke 24:44** — "these are the words which I spake unto you, while I was yet with you, that all things must be fulfilled, which were written in the law of Moses, and in the prophets, and in the psalms, concerning me."
- **Luke 24:27** — the parallel on the road to Emmaus: "beginning at Moses and all the prophets, he expounded unto them in all the scriptures the things concerning himself."
- The NT's reading of the Psalms as prophetic-of-Christ is not a Christian imposition; it is the Risen Christ's own hermeneutic transmitted to his disciples.
- The site's frame: the messianic reading of these six psalms is apostolic, not post-apostolic.

### Section 2 — Ps 22 as the cry from the cross

- Each verse of Ps 22 echoed in the crucifixion narrative:
  - Ps 22:1 → Matt 27:46 / Mark 15:34 (the forsaking cry)
  - Ps 22:7–8 → Matt 27:39–43 (mocking, head-shaking, "he trusted in God")
  - Ps 22:16 → Luke 23:33 / John 19:37 (hands and feet pierced — Hebrew reading debated; LXX "they pierced")
  - Ps 22:18 → John 19:23–24 (garments parted, casting lots)
  - Ps 22:31 → Luke 23:46 / John 19:30 ("he hath done this" / "it is finished")
- The crucifixion narrative is not narrating a story that happens to echo Ps 22. The Evangelists are showing that Jesus' crucifixion was the scene Ps 22 described a thousand years prior.
- **Textual note: Ps 22:16.** The Masoretic Hebrew reads *ka'ari* ("like a lion") at the pierced-hands-and-feet position; the Septuagint reads *ōryxan* ("they pierced"). The Dead Sea Scrolls (5/6HevPs) support a verbal form compatible with "pierced." Surface honestly — this is one of the sharpest OT / LXX / DSS textual-critical questions, and the messianic reading depends on it. Pastor Marc editorial slot available here.

### Section 3 — Ps 110 as the NT's most-quoted psalm

- Ps 110:1 is cited or alluded to more than 20 times across the NT.
- **Matt 22:41–46** — Jesus uses Ps 110:1 to stump the Pharisees: how is David's son also David's Lord?
- **Acts 2:34–36** — Peter's Pentecost sermon climaxes with Ps 110.
- **Heb 1:13** — angelic subordination argued from Ps 110.
- **Heb 5–7** — the Melchizedek-priesthood argument rests on Ps 110:4.
- The "session at the right hand" motif throughout the NT (Rom 8:34, Eph 1:20, Col 3:1, 1 Pet 3:22) traces to Ps 110.
- Ps 110 is load-bearing for christology (Jesus as David's Lord), ecclesiology (priestly mediation), and eschatology (until footstool).

### Section 4 — Tri-fold taxonomy per Vision §4.6

Each of the six psalms labeled:

- **Ps 2** — Progressively Fulfilled. Begotten-Son language inaugurated at Jesus' baptism / resurrection (Acts 13:33); the worldwide inheritance awaits consummation.
- **Ps 16** — Fulfilled in First Coming. Resurrection of the "Holy One" from Sheol — fulfilled at Easter per Acts 2 and Acts 13.
- **Ps 22** — Fulfilled in First Coming. Crucifixion scene.
- **Ps 45** — Progressively Fulfilled. Royal-wedding / Bridegroom inaugurated in Christ's first coming (John 3:29, Eph 5:25–32); marriage-supper awaiting second (Rev 19:7–9).
- **Ps 69** — Fulfilled in First Coming. Rejection, vinegar-and-gall, zeal-for-house.
- **Ps 110** — Progressively Fulfilled. Session inaugurated at ascension; full enemies-footstool subjugation awaiting second coming.

Note: zero "Awaiting Second Coming" only. All six have either first-coming fulfillment or progressive fulfillment with second-coming consummation. This is a compositional feature of the six chosen, not a site-claim about the full Psalter.

### Section 5 — Spurgeon's Treasury of David as primary commentary source

- Charles Haddon Spurgeon (1834–1892). *Treasury of David* in seven volumes, written over fifteen years. PD.
- For each psalm: Spurgeon's own exposition, then a "Hints to Preachers" section, then Spurgeon's selection of quotations from earlier commentators.
- The site treats Spurgeon as Puritan-tradition featured voice across these six psalm drilldowns per Doctrine A. "Show other voices" expands to reveal Calvin, Henry, Gill (also PD) in each drilldown.

### Section 6 — Other significant messianic psalms (parking-lot)

Brief mention only at depth 2 (one sentence per psalm, no drilldown on this page):

- Ps 8 (Son of Man — Heb 2:6–9)
- Ps 40 (obedient sacrifice — Heb 10:5–10)
- Ps 72 (messianic king / nations)
- Ps 89 (Davidic covenant failure and promise)
- Ps 118 (cornerstone — Matt 21:42)
- Ps 132 (the oath to David)

Parking-lot for Wave 7+ expansion; the six chosen are the page's scope.

---

## 4. Depth 3 drilldowns (6 psalms)

Each drilldown carries:
- **Full psalm text** (KJV default + translation switcher)
- **NT anchor citations in full** (the verses that cite this psalm messianically, with Gospel + Epistle parallels)
- **Spurgeon-featured commentary** (Doctrine A: ≤50-word excerpt from *Treasury of David*, tradition chip "Puritan")
- **Show other voices** expansion: Calvin (Reformed, PD), Henry (Puritan, PD), Gill (Evangelical, PD)
- **Tri-fold taxonomy chip** prominent (Fulfilled in First / Awaiting Second / Progressively Fulfilled)

1. **`ps-2`** — Full Ps 2 text. NT anchors: Acts 4:25–26 (prayer of the early church using Ps 2 over their opposition), Acts 13:33 (Paul's Antioch sermon — "this day have I begotten thee" applied to the resurrection), Heb 1:5, Heb 5:5, Rev 2:27, 12:5, 19:15. Taxonomy: Progressively Fulfilled.

2. **`ps-16`** — Full Ps 16 text. NT anchors: Acts 2:25–28 (Peter's Pentecost sermon citing vv. 8–11), Acts 13:35 (Paul citing v. 10 at Antioch). The verse-10 argument: David died and was buried (therefore Ps 16 cannot be about David); the resurrection of Christ fulfills the "not suffer thine Holy One to see corruption" claim. Taxonomy: Fulfilled in First Coming.

3. **`ps-22`** — Full Ps 22 text. NT anchors: Matt 27:35, 27:39–43, 27:46; Mark 15:24, 15:29–32, 15:34; Luke 23:33–46; John 19:23–24, 19:28–30, 19:37. Textual note on v. 16 (ka'ari / pierced). Editor's Notes drawer eligible with Pastor Marc slot. Taxonomy: Fulfilled in First Coming.

4. **`ps-45`** — Full Ps 45 text. NT anchors: Heb 1:8–9 (the Father addressing the Son: "Thy throne, O God, is for ever and ever"). Bridegroom typology forward-links to Eph 5:25–32 and Rev 19:7–9. Taxonomy: Progressively Fulfilled.

5. **`ps-69`** — Full Ps 69 text. NT anchors: John 2:17 ("the zeal of thine house hath eaten me up" — the temple cleansing), John 15:25 ("hated me without a cause"), Rom 15:3 ("the reproaches of them that reproached thee fell on me"), Matt 27:34, 27:48 (vinegar and gall), Acts 1:20 (imprecation applied to Judas — Ps 69:25). Taxonomy: Fulfilled in First Coming. Contested: the imprecatory verses of Ps 69 (22–28) — how to read an imprecation as messianic. Surface honestly; Spurgeon's Treasury has sober exposition.

6. **`ps-110`** — Full Ps 110 text. NT anchors: Matt 22:41–46 / Mark 12:35–37 / Luke 20:41–44 (Jesus' own Ps 110 argument), Acts 2:34–36, Rom 8:34, 1 Cor 15:25, Eph 1:20–22, Col 3:1, Heb 1:3, 1:13, 5:5–6, 5:10, 6:20, 7:15–17, 7:21, 8:1, 10:12–13, 12:2, 1 Pet 3:22. Longest NT-citation list on this page. Taxonomy: Progressively Fulfilled.

---

## 5. Verse list (cross-surface registration)

- Ps 2 (entire chapter)
- Ps 16 (entire chapter, especially vv. 8–11)
- Ps 22 (entire chapter)
- Ps 45 (entire chapter)
- Ps 69 (entire chapter)
- Ps 110 (entire chapter)
- Luke 24:27 · 24:44
- Matt 22:41–46 · 27:34 · 27:35 · 27:39–43 · 27:46
- Mark 12:35–37 · 15:24 · 15:29–32 · 15:34
- Luke 20:41–44 · 23:33–46
- John 2:17 · 15:25 · 19:23–24 · 19:28–30 · 19:37
- Acts 1:20 · 2:25–28 · 2:34–36 · 4:25–26 · 13:33 · 13:35
- Rom 8:34 · 15:3
- 1 Cor 15:25
- Eph 1:20–22 · 5:25–32
- Col 3:1
- Heb 1:3 · 1:5 · 1:8–9 · 1:13 · 2:6–9 · 5:5–6 · 5:10 · 6:20 · 7:15–17 · 7:21 · 8:1 · 10:5–10 · 10:12–13 · 12:2
- 1 Pet 3:22
- Rev 2:27 · 12:5 · 19:7–9 · 19:15

Every verse → `featured_page_refs` row to `/featured/messianic-psalms`.

**Note:** Ps 22 also cross-registers to `/featured/scarlet-thread` (Batch F1, via the crimson worm of Ps 22:6). Dual registration expected and correct; the `<FeaturedStudiesOnVerse />` component renders both feature pages in the Ps 22 verse page's Featured Studies cluster.

---

## 6. Commentary tradition priority

- **Patristic** — Augustine on Psalms (PD NPNF), Chrysostom on NT citations
- **Reformed** — Calvin on the Psalms (PD)
- **Puritan** — **Spurgeon, *Treasury of David* (PD)** — primary featured voice for this page's Doctrine A render
- **Evangelical** — Gill on each psalm (PD); Henry (PD)
- **Jewish tradition** — only where messianic reading is disputed (e.g., Ps 22:16 ka'ari); Rashi and Ibn Ezra citations via PD-safe translations
- **Editor** — Pastor Marc on Ps 22 drilldown (ka'ari textual note) and Ps 110 drilldown (the "David's Son and David's Lord" climax)

---

## 7. Sourcing caveats

- **Spurgeon, *Treasury of David*:** PD. Published 1870–1885. The site's primary commentary source for this page. Excerpt per Doctrine A (≤50 words featured, full text in "Show full passage" disclosure).
- **Calvin on the Psalms:** PD (Calvin d. 1564). Use Beveridge or Pringle translation (both PD).
- **Henry's *Commentary on the Whole Bible*:** PD.
- **Gill's *Exposition of the Old Testament*:** PD (Gill d. 1771).
- **Rashi on Psalms:** PD-legal translations (Rosenberg, JPS PD-safe).
- **Ibn Ezra on Psalms:** PD-legal translations only.
- **Dead Sea Scrolls Psalms (4QPs, 5/6HevPs):** cite metadata + key variants (e.g., Ps 22:16 reading); do not reproduce manuscript images (licensing care).
- **LXX Psalms (= LXX Ps 21 for Hebrew Ps 22):** Brenton 1851 PD translation. Useful for the Ps 22:16 ōryxan reading.
- **No living-author reproduction.** Bruce Waltke, John Goldingay, and other contemporary Psalms scholars — cite only, ≤15 words, if referenced at all. Prefer Spurgeon / Calvin / Henry / Gill who are all PD and cover everything this page needs.

---

## 8. Forward-links and cross-refs

- `ps-22` drilldown → `/featured/scarlet-thread/crimson-worm-psalm-22` (Batch F1). Bidirectional — Scarlet Thread treats the *tola'at shani* (crimson worm) imagery of 22:6; Messianic Psalms treats the full psalm as the crucifixion preview.
- `ps-22` drilldown → `/featured/suffering-servant` (Batch F1). Thematically adjacent — both present Christ's passion preview from different OT books. Cross-reference, not overlap.
- `ps-110` drilldown → `/featured/covenants/davidic` drilldown (Batch F3). The Davidic covenant's session-at-the-right-hand consummation. Bidirectional.
- `ps-110` drilldown → `/featured/names-of-god/el-elyon` drilldown indirectly via Melchizedek (Ps 110:4; Gen 14:18–22; Heb 7). Loose cross-reference.
- `ps-45` drilldown → `/featured/creation-to-new-creation` eschatological-marriage theme. Loose cross-reference.

---

## 9. Editor's Notes slot placement

- **Primary:** Ps 22 drilldown, specifically the v. 16 ka'ari textual note. This is the single most interpretively consequential textual-critical question in the messianic reading; Pastor Marc's voice on how to hold the Masoretic / LXX / DSS evidence is load-bearing.
- **Secondary:** Ps 110 drilldown, the "David's Son and David's Lord" theological climax (the christological implication of Jesus' own Ps 110 argument).
- **Tertiary (optional):** Ps 69 drilldown's imprecatory verses treatment — if Pastor Marc wants to frame how a Christian reads imprecatory psalms as messianic without adopting their posture personally.
- **Drawer tab:** reduced weight at ship; Ps 22 + Ps 110 primary editorial priorities post-ship.

---

## 10. Known contested points

1. **Ps 22:16 textual reading.** Masoretic *ka'ari* ("like a lion"); LXX *ōryxan* ("they pierced"); DSS 5/6HevPs fragmentary but supports a verbal form closer to LXX. The messianic reading of pierced-hands-and-feet depends on the textual-critical question. Surface fully; this is the page's most delicate exegetical moment.

2. **Ps 2 "begotten"** — whether "this day have I begotten thee" refers to eternal generation (Nicene tradition), incarnation (classical Reformed), baptism, or resurrection (Acts 13:33). Contested in the Trinitarian debates; surface as a tradition-differentiated question.

3. **Ps 45 addressee.** "Thy throne, O God, is for ever and ever" — addressed to the Davidic king, but Heb 1:8 applies it to the Son as demonstration of his deity. Whether Ps 45 was written expecting a divine human king or was retrospectively read Christologically — contested. Heb 1:8's citation settles the NT reading; the OT reading is debated.

4. **Imprecatory psalms as messianic.** Ps 69:22–28 calls for judgment on the psalmist's enemies. Acts 1:20 applies Ps 69:25 to Judas. How a Christian reads imprecation in a messianic psalm — contested pastoral-theology question. Section 2 Ps 69 drilldown surfaces; Pastor Marc editorial slot available.

5. **"Progressively Fulfilled" taxonomy consistency.** The page labels Ps 2, Ps 45, Ps 110 as Progressively Fulfilled because each has inaugurated-but-not-consummated elements. If Pastor Marc prefers a different taxonomy for any of these (e.g., Ps 110 as Fulfilled in First Coming because the session *has* begun), override.

6. **Six psalms vs. broader selection.** The parking-lot psalms in Section 6 (Ps 8, 40, 72, 89, 118, 132) all have strong NT messianic citations. The six-chosen is editorial, not exhaustive.

---

## 11. Non-goals

- No site-endorsement of a specific Ps 22:16 textual reading as certain. Surface the evidence; pastor editorial note holds.
- No resolution of the "eternal generation" question via Ps 2 exposition.
- No AI-generated psalm commentary. Spurgeon + Calvin + Henry + Gill are more than sufficient.
- No licensed translation from the BHS / LXX / DSS beyond ≤15-word metadata clips.
- No exhaustive messianic-psalm catalog — six is scope; expansion is parking-lot.
- No imprecation endorsement. The imprecatory psalms surfaced pastorally, not prescriptively.
- No modern critical-scholarship digest on Psalms composition (dating, Davidic authorship questions). The page's authorship claims follow the traditional tradition; critical alternatives are noted where relevant but not centered.

---

## 12. Review checklist (Pastor Marc, before F3 fires)

- [ ] **Six-psalm selection:** Ps 2, 16, 22, 45, 69, 110. Alternative: add Ps 8 (Heb 2:6–9) or Ps 40 (Heb 10:5–10); swap out Ps 69 for Ps 118 (cornerstone).
- [ ] **Spotlight pair:** Ps 22 + Ps 110. Alternative: spotlight Ps 22 alone; or spotlight Ps 2 + Ps 22 + Ps 110 (three).
- [ ] **Taxonomy labels:** Fulfilled (Ps 16, 22, 69) vs. Progressively Fulfilled (Ps 2, 45, 110). Alternative: Ps 110 labeled as Fulfilled.
- [ ] **Ps 22:16 textual-note placement:** depth 2 Section 2 + drilldown note + Pastor Marc editorial slot. Alternative: depth-3 footnote only, skip depth-2 treatment.
- [ ] **Primary editorial note locations:** Ps 22 ka'ari note + Ps 110 christology. If Pastor Marc wants different primary slots, flag.
- [ ] **`/study/messianic-psalms` migration:** per F1-01 rules — fresh build + delete `/study/messianic-psalms/page.tsx` + 308 redirect `/study/messianic-psalms` → `/featured/messianic-psalms`. Confirm.

---

*Brief authored 2026-04-23 as preemptive F3 measure. Six-psalm selection editorial per Christ's-life-arc organization; Spurgeon Treasury of David load-bearing PD source; tri-fold taxonomy applied per Vision §4.6; Ps 22:16 textual-critical note flagged as editorial priority. Pastor Marc reviews before paste.*
