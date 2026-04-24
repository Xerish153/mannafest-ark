# Batch C Part 2 — Wave C Tier 2 + Isaiah Retrofit + Category Landings + Close

**Owner:** Cowork (Full Write mode)
**Branch:** `feat/wave-C-prophets-nt-remainder` (continue from Part 1 — do NOT create a new branch)
**Wave:** C — Part 2 of 2 (closes Wave C)
**Blocks on:** Part 1 (Wave C Tier 1) complete on the same branch. Verify at Section A.
**Unblocks:** Wave C push. After Part 2 closes, Marcus pushes the accumulated Wave C branch.

---

## READ FIRST

1. `STATUS.md`, `OPERATING_RULES.md`, `BATCH_QUEUE.md`.
2. `MannaFest_Vision_v2_Locked.md` — §5.4 node roster, §6.2 book hub pattern, §4.2–§4.4 Doctrine A commentary, §7.7 Isaiah light retrofit spec (applies directly to this batch), §7.9 opposing views, §10 Doctrine D.
3. **Batch 10 Pauline + Batch 11 Torah shipped output in production** — Tier 2 uniform template pattern reference. Pauline's lesser-known epistles (Philemon, Titus) are the clearest precedent for Tier 2 treatment even though they shipped at proportional T1 weight.
4. **Wave C Part 1 (Tier 1 book hubs) shipped on this same branch.** Six book hubs live at `/book/{jeremiah,ezekiel,daniel,hebrews,1-john,revelation}` with bespoke depth-1 visuals + framework sections. If any of the six is missing at Section A verification, halt.
5. Nineteen Tier 2 book source briefs authored 2026-04-23 at `_ark/source-briefs/`:
   - OT Minor Prophets + Lamentations (13): `book-lamentations.md`, `book-hosea.md`, `book-joel.md`, `book-amos.md`, `book-obadiah.md`, `book-jonah.md`, `book-micah.md`, `book-nahum.md`, `book-habakkuk.md`, `book-zephaniah.md`, `book-haggai.md`, `book-zechariah.md`, `book-malachi.md`
   - NT General Epistles (6): `book-james.md`, `book-1-peter.md`, `book-2-peter.md`, `book-2-john.md`, `book-3-john.md`, `book-jude.md`
   - Verify each before starting its book. Halt if any missing.
6. `_ark/prompts/batch_F1_addendum_01.md`, `batch_F2_addendum_01.md`, `batch_C_addendum_01.md` — lessons carry: branch continuity, vault persistence, sandbox origin/main bypass when mount is stale.

---

## CONSTRAINTS (verbatim from OPERATING_RULES §3)

- Single audience: the student of the Bible who wants to learn. Judge every feature against "does this deepen a serious student's study?"
- Open-source data only. No licensed content. The Wesley Huff scholarship quality bar applies.
- Guzik's Enduring Word is NOT CC-BY. Do not ingest Enduring Word content. Public-domain commentators only: Calvin, Matthew Henry, Spurgeon (Treasury of David for Psalms), Gill, Clarke, Barnes, Jamieson/Fausset/Brown, Wesley NT notes, Geneva Bible marginal notes, Owen, Chrysostom, Augustine, Bullinger, Seiss.
- Living authors (Missler, Brewer, Huff) — cite only, never reproduce text.
- No AI-authored historical or theological claims. AI synthesizes cited human sources only. Chapter summaries are AI-drafted but land at `status='draft'` and never render publicly until Pastor Marc reviews.
- Commentary is curated, not exhaustive. Featured excerpt ≤50 words, attributed, tradition-tagged. Founder-authored notes styled identically to sourced voices with "Editor" tradition tag.
- Commentary always attributed. Tradition of origin visible. Traditions never flattened.
- Debated content gets a page-level notice, not confidence badges.
- 2D graph only. Graph is exploratory, not a pillar.
- Every node ships with ≥3 outgoing edges.
- Full-density pages. No Beginner/Study/Deep gating.
- Singular routes per `routes.md`.
- KJV / WEB / ASV translations only.
- No audio. No pastor workspace. No audience-specific pages. No premium tier. No community editing.
- Founder is sole content author for revelation-note-style insight.
- "Shipped" means production click-through returns 200.
- Cowork commits before session end. Uncommitted changes on main at handoff is a protocol failure.

---

## GOAL

Close Wave C by shipping the 19 Tier 2 book hubs (uniform template, no bespoke visuals), the Isaiah Mini-Bible light retrofit per Vision §7.7, the two category landings, and the Wave C capstone session record. Part 1 (Tier 1) already shipped on this branch; Part 2 completes the wave.

---

## SCOPE

### Routes
- `/book/{slug}` for 19 new Tier 2 book hubs (Lamentations, 12 Minor Prophets, 6 General Epistles)
- `/read/{slug}/{chapter}` for 98 new chapter pages
- `/group/prophets` category landing (17 book cards: Isaiah + 3 MP T1 + Lamentations T2 + 12 MP T2)
- `/group/nt-remainder` category landing (9 book cards: Heb T1 + 6 T2 + 1 John T1 + Rev T1)
- `/isaiah-mini-bible` — three subsections added per §7.7 (no rebuild)

### Chapter counts
- Lamentations (5)
- Hosea (14), Joel (3), Amos (9), Obadiah (1), Jonah (4), Micah (7), Nahum (3), Habakkuk (3), Zephaniah (3), Haggai (2), Zechariah (14), Malachi (4) = 67 Minor Prophets total
- James (5), 1 Peter (5), 2 Peter (3), 2 John (1), 3 John (1), Jude (1) = 16 General Epistles total
- **Total: 88 chapter pages + 10 remaining = 98 chapters** (actual Lam 5 + MP 67 + Gen Epistles 16 + any retrofit count = 88; verify in briefs)

Counting correction: Lam 5 + MP 67 + GenEp 16 = 88. 98 was approximate. Use exact counts from briefs.

### Tables
- `books` — 19 new rows
- `chapters` — 88 new rows
- `chapter_summaries` — 88 rows at `status='draft'`
- `featured_page_refs` — cross-surface registrations per brief

### Migration
Slot **077** or next sequential. Part 1 consumed 076 (or similar). Confirm at sandbox inspection.

### Components
**Reuse (do not rebuild):** Part 1's Tier 1 book hub components; Batch 7 reader infrastructure; Doctrine A commentary components; `<EditorsNotesDrawer />`; `<FeaturedStudiesOnVerse />`; `<Cite />`. Batch 10/11 Tier 2 uniform template shell — check `src/components/book/tier-2/` or equivalent; if it doesn't exist as a standalone component, extract a minimal one from the Pauline Philemon / Torah precedent.

**Build:** zero new bespoke visuals. Tier 2 is template-driven by design.

---

## WORK

### Section A — Verify Part 1 state

A.1 Confirm six Tier 1 book hubs from Part 1 are live on this branch:
- `/book/jeremiah`, `/book/ezekiel`, `/book/daniel`, `/book/hebrews`, `/book/1-john`, `/book/revelation`

A.2 Confirm 152 Tier 1 chapter pages present.

A.3 Confirm Part 1's 250-row commit pattern against current `books` and `chapters` table state (should be 6 new books + 152 new chapters from Part 1).

A.4 If Part 1's scope is absent or partial, halt with `batch-C-part-2-blocker.md` naming what's missing.

A.5 **Sandbox origin/main bypass** (per C-01 addendum) — if `git log origin/main` shows a broken or "No commits yet" state, treat as documented Cowork per-path mount staleness (STATUS.md known quirks). Windows-side Wave F merge is ground truth. Proceed on trust. If sandbox is fundamentally broken (cannot create files, tool errors every invocation), escalate with blocker.

### Section B — Tier 2 book hubs (19 books, uniform template)

For each of 19 Tier 2 books, consult its source brief at `_ark/source-briefs/book-{slug}.md` and follow it. Each Tier 2 hub carries:

- Book meta (title, testament, author, date, audience, chapter count)
- Signature verse (pinned in each brief)
- Short 2–3 paragraph theological introduction (AI-drafted from the brief's §4 Hub introduction guidance, `status='draft'` per chapter summary flow — Pastor Marc reviews)
- Stat strip (same shape as Tier 1 but without bespoke visual)
- Chapter navigation grid
- **No bespoke depth-1 visual** — Tier 2 hubs share the template
- **No framework sections at depth 2** — Tier 2 skips framework

**Books to ship, in canonical order:**

OT (13): `lamentations`, `hosea`, `joel`, `amos`, `obadiah`, `jonah`, `micah`, `nahum`, `habakkuk`, `zephaniah`, `haggai`, `zechariah`, `malachi`

NT (6): `james`, `1-peter`, `2-peter`, `2-john`, `3-john`, `jude`

For each: book row + chapter rows + chapter summaries draft + cross-surface registrations per brief.

### Section C — Isaiah Mini-Bible light retrofit (per Vision §7.7)

Three additions to the existing `/isaiah-mini-bible` page. Do NOT rebuild.

C.1 **Depth-1 summary header** — 2–3 sentence summary at page top explaining what kinds of connections the 66↔66 grid shows: not just topical parallels, but prophecy-to-fulfillment, structural correspondence (e.g., Isaiah 40 ↔ Matthew, "new beginning"), theological arc.

C.2 **Hebrew Bible ordering framework section at depth 2** — new framework section showing Isaiah's Nevi'im-ordering inflection point aligns with the book's internal 1–39 / 40–66 bifurcation.

C.3 **Two-Isaiahs framework section at depth 2** — new framework section with Deutero-Isaiah hypothesis steelmanned per §4.5, followed by John 12:38–41 internal-evidence response (Jesus quotes Isa 6:10 and Isa 53:1 in immediate succession, attributing both to one prophet Isaiah). Editorial note slot reserved per §4.3 (drawer empty at ship, populates later).

No drilldowns added in this retrofit. Existing Isaiah drilldowns preserved unchanged.

### Section D — Category landings

D.1 `/group/prophets` — card grid: Isaiah (cross-link, not rebuilt) + 3 Major Prophets T1 (Jer, Ezek, Dan) + Lamentations T2 + 12 Minor Prophets T2 = 17 cards. Short intro paragraph framing prophecy in the canon (sourced from PD commentary, not AI-generated).

D.2 `/group/nt-remainder` — card grid: Hebrews T1 + James T2 + 1 Pet T2 + 2 Pet T2 + 1 John T1 + 2 John T2 + 3 John T2 + Jude T2 + Revelation T1 = 9 cards. Short intro paragraph framing non-Pauline NT letters + the apocalypse.

### Section E — Cross-surface registration

Per each Tier 2 brief, register anchor verses to `featured_page_refs`. Expected high-volume registrations per brief:

- **Hosea:** Hos 6:6 → future Attributes-of-God hub (parking-lot); Hos 11:1 → `/title/son-of-god` (Matt 2:15 fulfillment)
- **Joel:** Joel 2:28–32 → `/featured/covenants/new` (Pentecost-anticipation via Acts 2); future Holy Spirit hub
- **Amos:** Amos 9:11–12 → future Davidic-covenant treatment (cited Acts 15:16–17)
- **Jonah:** Jonah 1:17 → `/title/son-of-man` (Matt 12:40 "sign of Jonah")
- **Micah:** Mic 5:2 → future Messianic Prophecies hub (Bethlehem prophecy); Mic 6:8
- **Hab:** Hab 2:4 → `/featured/covenants/new` (Rom 1:17 / Gal 3:11 / Heb 10:38 — the NT's most-quoted OT verse on justification)
- **Zech:** Zech 9:9 → `/title/king-of-kings` (triumphal-entry fulfillment); Zech 12:10 → `/featured/taw/the-cross-as-taw` (pierced-one)
- **Mal:** Mal 3:1, 4:5–6 → `/title/good-shepherd` / future Elijah-typology treatment
- **James:** James 2:14–26 → future faith-and-works treatment
- **1 Pet:** 1 Pet 2:9 → future people-of-God treatment; 1 Pet 2:21–25 → `/featured/suffering-servant`
- **2 Pet:** 2 Pet 3:10–13 → `/featured/creation-to-new-creation/heavens-and-earth-bracket`
- **Jude:** Jude 1:14–15 → forward-register to `/extra-biblical/1-enoch` for Wave E (silently no-op until Wave E ships)

Expected total cross-surface registrations for Part 2: 40–80 rows.

### Section F — Finishing work

F.1 **Ark sync per §8.3.** Session record at `_ark/03-sessions/session_C_part_2_{date}.md` with paragraph summary, aggregate stats (19 Tier 2 hubs + 88 chapters + 88 summaries + Isaiah retrofit + 2 landings), WikiLinks to all 19 briefs + the retrofit subsections + category landings.

F.2 **Vault prompt persistence.** Persist `batch_C_part_2_tier_2_and_close.md` + any Part 2 addenda to `_ark/prompts/`. Update any stale WikiLinks.

F.3 **Wave C close-out session record** — this is the Wave C capstone. Aggregate stats: 25 books (6 T1 Part 1 + 19 T2 Part 2), 250 chapters (152 + 98), 250 summaries queued (152 + 88 — verify actual counts), Isaiah retrofit, 2 category landings, ~100+ cross-surface registrations across both parts. WikiLinks span both Part 1 and Part 2 session records.

F.4 **Living-author discipline audit** — final grep across Wave C for any Missler / Brewer / Huff / Walvoord / Ryrie / MacArthur / Grudem quote >15 words. Paraphrase; cite only.

F.5 **Close-out report for Marcus** — single-paragraph summary, aggregate stats for the full wave, production-walk URLs for all 25 new book hubs + 2 category landings + retrofitted Isaiah page + sample chapter pages + F2.5/F3/whatever Wave C forward-registered that will resolve post-Wave-E. Forward-register Wave C push as Marcus's next action.

F.6 **STATUS.md + BATCH_QUEUE.md updates (Marcus's responsibility).** Not Cowork.

---

## DELIVERABLES

- 19 Tier 2 book hubs live
- 88 chapter pages live
- 88 chapter summaries at `status='draft'`
- Isaiah Mini-Bible three-subsection retrofit live on existing page
- Two category landings live
- 40–80 cross-surface refs registered
- Ark sync artifacts including Wave C capstone session record
- Vault prompt persistence complete
- **Marcus pushes Wave C after Part 2 closes.** Cowork does NOT push.

---

## ACCEPTANCE

Production click-through by Marcus (after push):

**Tier 2 hubs (19):**
1. Spot-check `/book/lamentations` (acrostic note on hub)
2. Spot-check `/book/jonah`, `/book/micah`, `/book/zechariah` (3 Minor Prophets)
3. Spot-check `/book/james`, `/book/1-peter`, `/book/jude` (3 NT)
4. Spot-check the single-chapter books `/book/obadiah`, `/book/2-john`, `/book/3-john`, `/book/jude` — confirm uniform template handles chapter count = 1 cleanly
5. Each Tier 2 hub: meta + signature + 2–3 paragraph intro + stat strip + chapter grid

**Isaiah retrofit:**
6. `/isaiah-mini-bible` loads unchanged in its main 66↔66 grid + existing drilldowns
7. New depth-1 summary header visible at page top
8. New Hebrew-Bible-ordering framework section visible at depth 2
9. New Two-Isaiahs framework section visible at depth 2 with John 12:38–41 response and editorial-note slot reserved

**Category landings:**
10. `/group/prophets` — 17 book cards
11. `/group/nt-remainder` — 9 book cards

**Cross-surface:**
12. Verse page for Hab 2:4 shows `/featured/covenants` in Featured Studies
13. Verse page for Zech 9:9 shows `/title/king-of-kings`
14. Verse page for Zech 12:10 shows `/featured/taw`
15. Verse page for 1 Pet 2:21–25 shows `/featured/suffering-servant`
16. Verse page for Jude 1:14–15 does NOT yet show `/extra-biblical/1-enoch` (Wave E not shipped — forward-registration silently no-op)

**Site-wide:**
17. Editor's Notes drawer at reduced weight on every new Tier 2 hub + chapter page
18. No 404s anywhere in Wave C Part 2 route tree
19. No living-author direct-quote >15 words across Wave C
20. Vault prompt persisted
21. Wave C capstone session record present

---

## OUT OF SCOPE

- Wave D (OT Historical + OT Wisdom)
- Wave E (Apocrypha + Hygiene)
- Chapter summary publishing (Pastor Marc's queue task, not Cowork)
- Any adjudication on contested eschatology in prophetic books (Zech 12–14 millennial readings, Dan prophecy chains — site presents interpretive schools, doesn't adjudicate; Pastor Marc's drawer takes positions)
- Any Tier 2 promotion to Tier 1
- `<FeaturedStudiesOnVerse />` slug-dedupe fix (Batch 23 Hygiene)
- Graph revival
- STATUS.md / BATCH_QUEUE.md live-tracker updates (Marcus's manual task)

---

## IF YOU HIT A BLOCKER

Write `_ark/batch-C-part-2-blocker.md` per protocol. Specific triggers:

- Any of the 19 Tier 2 briefs missing on disk
- Part 1 (Tier 1) state absent or partial at Section A verification
- Migration slot conflict at 077 — use next sequential, document (not a halt)
- Any Zechariah 12–14 or Jude 1:14–15 treatment that would require adjudicating among interpretive schools — halt and request addendum
- Any living-author reproduction risk exceeding 15 words
- Sandbox origin/main catastrophically broken (not just stale) — escalate per C-01 addendum

---

## Wave C capstone note

Part 2 closes Wave C. After the Wave C push:
- 25 canonical books shipped in this wave (6 T1 + 19 T2)
- Isaiah Mini-Bible retrofit live
- Canonical 66-book coverage: 66 – 12 OT Historical – 5 OT Wisdom – 5 retrofit-only Isaiah = 44 books live at minimum Tier 2. Wave D closes the remaining 17.
- Next wave: Wave D (OT Historical Batch 20 + OT Wisdom Batch 21) — after Wave D, canonical 66 complete at minimum T2
- Wave E: Apocrypha + Extra-biblical + Hygiene

---

*Wave C Part 2 prompt authored 2026-04-23. Consumes 19 Tier 2 briefs authored same session. Predicated on Part 1 Tier 1 shipping first on the same branch. Includes sandbox-origin/main-bypass language from C-01 addendum.*
