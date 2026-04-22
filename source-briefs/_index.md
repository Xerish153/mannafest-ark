# Source Briefs — Index

This directory holds the locked, founder-approved source briefs that authoritatively spec MannaFest feature pages. Each brief is the canonical reference for its corresponding `/study/{slug}` page: hero copy, depth-1 / depth-2 / depth-3 structure, framework sections, drilldowns, sources allowlist, visual component requirements, cross-links, editorial posture, and out-of-scope boundaries.

Briefs land here **before** Cowork ships the page. The page implementation is judged against the brief, not the other way around.

---

## Convention

- **One brief per page.** File: `{slug}.md` matching the page's route segment.
- **Approved 2026-04-21** marker in each brief's footer signals founder lock. Earlier-dated briefs predate Doctrine D and may need a re-read.
- **Status field** at the top of each brief: `Locked for retrofit (Batch C.2 consumable)` means the brief is ready for code execution once the dependency stack (Batch 3 typography + diagram library, Wave 1 commentary infrastructure) is in place. See `_ark/batch-c2-blockers.md` for the current state of those dependencies.
- **Visual component requirements** sections in each brief enumerate the bespoke `src/components/diagrams/` components needed; common components (`<FeaturedCommentaryCard />`, `<TraditionTagChip />`, `<Cite />`, `<HebrewNameCard />`, `<ComparisonCard />`, `<PredictionPair />`, `<TalmudQuoteCard />`, `<RelatedPagesNote />`, `<HeroTagline />`, `<HeroSubtitle />`, `<ThreeStatStrip />`, `<DepthOneCard />`, `<DepthTwoFramework />`, `<DepthThreeStub />`, `<GreekTermCard />`) are the responsibility of Batch 3 and Wave 1.

---

## Batch C.2 inventory (14 briefs — all written 2026-04-22 to vault, code execution halted per `_ark/batch-c2-blockers.md`)

### Round 1 — Foundation

| # | Title | Slug | Route | Status |
|---|---|---|---|---|
| 1 | The Covenants | `the-covenants` | `/study/covenants` | Brief landed; new feature page; **code halted** |

### Round 2 — Typology spine

| # | Title | Slug | Route | Status |
|---|---|---|---|---|
| 2 | Typology of Christ | `typology-of-christ` | `/study/typology-of-christ` | Brief landed; promote from retired trail per Doctrine D.7; **code halted** (routing convention TBD per blocker §E) |
| 3 | Seed Promise | `seed-promise` | `/study/seed-promise` | Brief landed; existing 237-line page needs retrofit posture decision per blocker §C; **code halted** |
| 4 | The Scarlet Thread | `scarlet-thread` | `/study/scarlet-thread` | Brief landed; promote from retired trail per Doctrine D.7; **code halted** (routing convention TBD per blocker §E) |
| 5 | The Bronze Serpent | `bronze-serpent` | `/study/bronze-serpent` | Brief landed; existing 210-line page needs retrofit posture decision per blocker §C; **code halted** |
| 6 | The Suffering Servant | `suffering-servant` | `/study/suffering-servant` | Brief landed; **existing 375-line page** (brief mislabels "new"); needs blocker §C decision; **code halted** |

### Round 3 — Architectural

| # | Title | Slug | Route | Status |
|---|---|---|---|---|
| 7 | The Tabernacle | `tabernacle` | `/study/tabernacle` | Brief landed; **existing 702-line page** (brief mislabels "new"); needs blocker §C decision; **code halted** |
| 8 | Creation to New Creation | `creation-to-new-creation` | `/study/creation-to-new-creation` | Brief landed; new feature page; outside Vision §7.8 roster (blocker §A, §G); **code halted** |

### Round 4 — Devotional

| # | Title | Slug | Route | Status |
|---|---|---|---|---|
| 9 | Messianic Psalms | `messianic-psalms` | `/study/messianic-psalms` | Brief landed; **existing 810-line page** (brief mislabels "new"); needs blocker §C decision; **code halted** |
| 10 | Genealogies of Christ | `genealogies` | `/study/genealogies` (brief slug) ⚠ existing page lives at `/study/genealogies` | Brief landed; **slug conflict** per blocker §D; **code halted** |

### Round 5 — Tier 2

| # | Title | Slug | Route | Status |
|---|---|---|---|---|
| 11 | Names of God | `names-of-god` | `/study/names-of-god` | Brief landed; new feature page; outside Vision §7.8 roster (blocker §A, §G); **code halted** |
| 12 | The Armor of God | `armor-of-god` | `/study/armor-of-god` | Brief landed; new feature page; outside Vision §7.8 roster (blocker §A, §G); **code halted** |
| 13 | The Fruit of the Spirit | `fruit-of-the-spirit` | `/study/fruit-of-the-spirit` | Brief landed; new feature page; outside Vision §7.8 roster (blocker §A, §G); **code halted** |
| 14 | The Seven Churches of Revelation | `seven-churches` | `/study/seven-churches` | Brief landed; new feature page; outside Vision §7.8 roster (blocker §A, §G); **code halted** |

---

## Read order if studying the cluster

The briefs cross-link heavily. A coherent reading order:

1. **the-covenants** — sets the structural category (covenant as blood-bond) every other brief leans on
2. **seed-promise** — narrows the messianic line; sets the "narrowing" pattern Suffering Servant references in §2.5
3. **scarlet-thread** — establishes blood continuity and introduces the Yom Kippur evidence Tabernacle §2.5 references
4. **bronze-serpent** — short, dense; demonstrates how a single typology can carry a feature page
5. **suffering-servant** — introduces ManuscriptHero pattern and pre-Rashi Jewish tradition framework
6. **tabernacle** — architectural typology; introduces the cube continuity that Creation to New Creation §2.3 references
7. **creation-to-new-creation** — the spatial arc; ties the whole canonical narrative together
8. **typology-of-christ** — the hub that delegates to all the typology-tagged feature pages above
9. **messianic-psalms** — six-psalm life-of-Christ arc; references the Hallel and Melchizedek priesthood
10. **genealogies** — the historical execution of the messianic line; references Tamar and Rahab from Scarlet Thread
11. **names-of-god** — the divine self-disclosure timeline; capstone is "I AM" applied to Christ
12. **armor-of-god** — God's wardrobe lent to His people; references the *magen* shield from Names of God
13. **fruit-of-the-spirit** — the Spirit-formed character of New Covenant believers; references Galatians' inclusion theme
14. **seven-churches** — the risen Christ walking among His congregations; references Names of God and Tabernacle's cube continuity

---

## Pending dependencies before any of these briefs can ship as code

See `_ark/batch-c2-blockers.md` for the full halt rationale. In summary:

- **Batch 3** must ship typography + 66-book accent palette + 10 tradition-tag colors + diagram library + the 14 common components named in every brief's "Visual component requirements" → "Existing components reused" subsection.
- **Wave 1** (Batches 4–6) must ship the commentary schema (`featured_excerpt`, `display_rank`, `tradition_tag`, `status`), the super-admin curation editor at `/admin/commentary`, and the public-domain commentator ingestion expansion (Calvin, Spurgeon's *Treasury of David* especially for Messianic Psalms, Owen, Hodge, Gurnall, Gill, Clarke, JFB, Wesley NT, Geneva marginalia, Bullinger, Seiss, Westcott, Delitzsch, Pink, Kelly).
- **Marcus must rule** on:
  - **A.** Sequence (park C.2 vs scoped run vs roster reshape)
  - **B.** Vision §7.7 "light retrofit" rule applicability
  - **C.** Existing-page disposition (rewrite vs extend in place) for seed-promise, bronze-serpent, suffering-servant, tabernacle, messianic-psalms, genealogies
  - **D.** Slug conflict on `/study/genealogies` ↔ `/study/genealogies`
  - **E.** Routing convention for retired-trail promotions (`/study/*` vs Doctrine D.7's `/featured/*`)
  - **F.** Wave 1 commentary backing — block C.2 on Wave 1 or accept inline-render debt
  - **G.** Vision §7.8 roster amendment for the 8 C.2-only pages (Covenants, Scarlet Thread as feature, Tabernacle as feature, Creation to New Creation, Messianic Psalms as feature, Names of God, Armor of God, Fruit of the Spirit, Seven Churches)

Once A–G are resolved, the briefs in this directory are immediately consumable by Cowork. No content rework needed — only the dependency stack and the routing/disposition decisions.

---

*Index last updated: 2026-04-22.*
