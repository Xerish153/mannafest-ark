# Batch 20 — Wave D.1: OT Historical Mega-Batch (249 chapters, 12 book hubs)

**Owner:** Cowork (Full Write mode, scoped writes via `cowork_writer` role per OPERATING_RULES §1.1)
**Branch:** `feat/wave-D-ot-historical` (fresh wave branch, started from `main` after Wave C push merged)
**Wave:** D — OT Historical + OT Wisdom (this is sub-batch 1 of 2; Batch 21 Wisdom follows on the same wave branch)
**Blocks on:** Wave C pushed and merged to `main`. Verify `git log origin/main --oneline -10` shows the Wave C merge commit before starting.
**Unblocks:** Batch 21 (OT Wisdom), which Cowork will run on the same wave branch before Marcus's Wave D push.

With Wave C shipped, canonical OT coverage runs Torah (Batch 11) + Isaiah + Major/Minor Prophets (Wave C) + the Wave F feature pages that anchor into OT. Wave D closes the OT historical spine (Joshua through Esther) and the OT wisdom corpus (Job, Psalms, Proverbs, Ecclesiastes, Song of Songs). After Wave D merges, canonical 66-book coverage at minimum Tier 2 = complete. That is the significance of this batch.

Scope sits at **249 chapters + 12 book hubs + 249 AI-drafted chapter summaries + 1 category landing + cross-surface backfill against the Kings of Israel and Judah feature page**. Comparable in scale to Batch 11 Torah (187 ch) and Wave C (250 ch). Pattern is established from Batches 10 / 11 / 7 / Wave C. Volume is the challenge, not novelty.

---

## READ FIRST

1. `STATUS.md`, `OPERATING_RULES.md`, `BATCH_QUEUE.md`, `MannaFest_Vision_v2_Locked.md`.
2. Production references (the templates — walk these before starting):
   - Book hub Tier 1 (proportional bespoke visual): any of the Pauline 13 at `/book/romans` through `/book/philemon`, or Torah 5 at `/book/genesis` through `/book/deuteronomy`, or Wave C 3 at `/book/jeremiah` / `/book/ezekiel` / `/book/daniel`.
   - Book hub Tier 2 (uniform treatment): Wave C's Minor Prophets at `/book/hosea` through `/book/malachi`.
   - Chapter reader three-layer: any `/read/:book/:chapter` route from shipped books.
3. **Consolidated source-info document for this batch:** `_ark/source-briefs/wave_d_batch_20_source_briefs.md` — this single file holds everything the 7 Tier 1 books need (identity, depth-1 visual spec, framework sections, signature verse, cross-surface registration targets). Verify present before starting. Tier 2 books (5) are template-driven per Section C below; no per-book brief required.
4. Kings of Israel and Judah feature page at `/featured/kings-of-israel-and-judah` is load-bearing for this batch. 1 Sam / 2 Sam / 1 Kgs / 2 Kgs / 1 Chr / 2 Chr book hubs all cross-link into it prominently. Walk the feature page before starting 1 Samuel so you know what you're registering against.

---

## CONSTRAINTS (verbatim from OPERATING_RULES §3)

- Single audience: the student of the Bible who wants to learn. Judge every feature against "does this deepen a serious student's study?"
- Open-source data only. No licensed content. The Wesley Huff scholarship quality bar applies.
- Guzik's Enduring Word is All Rights Reserved; do not ingest Enduring Word content under any circumstance. Format inspiration (outline structure, pull-quote presentation) is fine — format is not copyrightable.
- Public-domain commentators for full-text ingestion: Calvin, Matthew Henry, Spurgeon (Treasury of David for Psalms), Gill, Clarke, Barnes, Jamieson/Fausset/Brown, Wesley NT notes, Geneva Bible marginal notes, Owen, Chrysostom, Augustine, Bullinger, Seiss.
- Modern and copyrighted authors (Missler, Lewis, Ravenhill, Prince, Hagin, Tozer, Pink, Brewer, Huff, Bruce, Wright, etc.) — ≤50-word attributed quotes permitted under U.S. fair use for non-profit educational religious purpose. Paraphrase preferred when it serves equally well. No extended reproduction.
- No AI-authored historical or theological claims. AI synthesizes cited human sources only.
- Commentary always attributed. Tradition of origin visible. Traditions never flattened.
- Debated content gets a page-level notice, not confidence badges.
- 2D graph only. Desktop-first. Graph click opens a side panel. Every node ships with ≥3 outgoing edges.
- Full-density pages. No Beginner/Study/Deep gating. Density managed by tabs, accordions, and collapsibles.
- Singular routes per `routes.md`. KJV / WEB / ASV translations only.
- No audio. No pastor workspace. No audience-specific pages. No premium tier. No community editing.
- Founder is sole content author for revelation-note-style insight. Build the framework; don't author the founder's voice.
- "Shipped" means a production click-through of every affected link returns 200.

---

## VISUAL DIRECTION (applies to all bespoke depth-1 visuals in this batch)

**Forward posture, locked 2026-04-23.** Bespoke visuals on book hubs (and on all future feature pages) use Claude's structural-graphics strengths, not image generation.

- **No AI-generated imagery on depth-1 visuals.** No illustrated portraits, painted scenes, rendered figures. If a book's visual previously leaned on a rendered illustration (e.g., a "weeping prophet portrait"), replace it with a structural diagram or data visualization instead.
- **Color is load-bearing.** Use the Batch 3 palette actively. Each book's bespoke visual keys off one or two canonical-section accent colors from `globals.css` (`--accent-law`, `--accent-historical`, `--accent-wisdom`, `--accent-prophetic`, `--accent-apocalyptic`, etc.). For the historical books, `--accent-historical` is primary; secondary accents come from the section the book's content most echoes (e.g., Judges' cyclical apostasy uses `--accent-prophetic` as a secondary for the prophet-vacuum theme).
- **Layered depth communicated through structure.** Depth-1 visuals should communicate the book's architecture at a glance — cycles, arcs, chiasms, timelines, ring structures, map-based event plots, column comparisons. Use the Batch 3 diagram primitives: `<CircleDiagram />`, `<ThreadTimeline />`, `<RibbonTimeline />`, `<ClusterFeature />`, `<RaysFromGlyph />`, `<AnnotatedFigure />`, `<InteractiveMap />`. Extend with new primitives only where an existing one cannot carry the visual (document any new primitive in the session record).
- **Charts, diagrams, and data-graphics over illustration.** A timeline of Israel's kings with prophet overlays reads as data; a SVG map of the conquest with numbered campaigns reads as data; a cyclical ring with the 12 judges reads as data. All of these communicate more than any rendered scene and sit natively inside the site's visual language.
- **Per-book visual specs in the source-briefs document are primary reference.** The visual called out for each Tier 1 book in `wave_d_batch_20_source_briefs.md` is already authored to this standard. Follow it.

This applies to book hubs in Wave D. It is also the posture for all future feature-page builds. Feature-page retrofits for pages currently relying on rendered illustration are not in scope for this batch — Marcus addresses those separately.

---

## GOAL

Ship the full OT historical corpus (Joshua through Esther, 12 books, 249 chapters) at the quality bar established by Batches 10 and 11, with the 7 Tier 1 books carrying bespoke depth-1 visuals keyed to their architecture and the 5 Tier 2 books carrying the uniform template. Every chapter reachable via the three-layer reader. Every chapter carrying an AI-drafted summary in Pastor Marc's review queue. Cross-surface registration into Kings of Israel and Judah complete for all six relevant books.

---

## SCOPE

**New routes (28):**
- 7 Tier 1 book hubs: `/book/joshua`, `/book/judges`, `/book/ruth`, `/book/1-samuel`, `/book/2-samuel`, `/book/1-kings`, `/book/2-kings`
- 5 Tier 2 book hubs: `/book/1-chronicles`, `/book/2-chronicles`, `/book/ezra`, `/book/nehemiah`, `/book/esther`
- 1 category landing: `/group/ot-historical`
- 249 chapter reader pages under `/read/:book/:chapter` for all 12 books
- ~15 anchor-verse drilldowns where a book's signature verse or narrative pivot warrants its own focused surface (e.g., Josh 1:8, Josh 24:15, Jdg 21:25, Ruth 1:16, 1 Sam 17 as chapter-spotlight, 2 Sam 7:12-16 Davidic covenant, 1 Kgs 18 Carmel contest, 2 Kgs 2:11 Elijah ascension, Ezra 7:10, Neh 8:8, Esth 4:14). Cowork judges which anchors warrant dedicated drilldowns during execution; use the source-briefs document for the Tier 1 candidates.

**Tables touched (all via `psql` + `cowork_writer` per OPERATING_RULES §1.1 — no DDL in this batch):**
- `book_hubs` — INSERT 12 rows
- `book_sections` — INSERT grouping rows for the 12 books under `group='ot-historical'`
- `chapter_pages` — INSERT 249 rows
- `chapter_summaries` — INSERT 249 rows with `status='draft'`
- `featured_page_refs` — INSERT cross-surface registrations (estimated 80-120 rows; concentrated on 1-2 Sam / 1-2 Kgs / 1-2 Chr anchoring into Kings of Israel and Judah, plus Ruth anchoring into the Genealogies of Christ feature page, plus Joshua anchoring into Seed Promise / Bronze Serpent where the conquest intersects typology already shipped)
- `graph_edges` — INSERT bidirectional edges for signature verses (≥3 outgoing per anchor-verse drilldown per Vision §6.1)

**Migrations:** None anticipated. If schema extension is required (e.g., new column on `book_hubs` for historical-period metadata), Cowork writes the migration file to `supabase/migrations/NNN_description.sql`, commits it, halts, and asks Marcus to apply via SQL Editor before resuming. Migration slots 077+ are available (Wave F consumed 070-076, Wave C consumed 077-0?? — check `list_migrations` via MCP before claiming a slot).

**Files touched:**
- `src/app/book/[book]/page.tsx` dynamic route — extend with the 12 book slugs
- `src/app/read/[book]/[chapter]/page.tsx` — 249 new chapter resolutions
- `src/app/group/ot-historical/page.tsx` — new category landing
- `src/components/books/` — 7 new bespoke depth-1 visual components (one per Tier 1 book, named `<JoshuaConquestMap />`, `<JudgesCycleRing />`, `<RuthChiasm />`, `<FirstSamuelArc />`, `<SecondSamuelTriptych />`, `<FirstKingsDivision />`, `<SecondKingsExileTrajectory />`)
- `src/lib/bible/book-sections.ts` — extend the 66→10 mapping (historical books already stubbed; verify)
- `_ark/03-sessions/session_batch_20_{date}.md` — new session record
- `_ark/02-features/books/` — 12 new book node files with WikiLinks (one per book, minimum 3 outbound links each per Vision §6.1 / OPERATING_RULES §3)

---

## WORK

### Section A — Setup and verification (first steps, no writes yet)

1. **Branch.** `git checkout -b feat/wave-D-ot-historical` from `main`. Verify `git log origin/main --oneline -5` shows the Wave C merge before branching. If not, halt and notify Marcus — Wave D cannot start before Wave C merges.
2. **Source briefs verify.** Confirm `_ark/source-briefs/wave_d_batch_20_source_briefs.md` exists and covers all 7 Tier 1 books. If missing or incomplete, halt per blocker protocol (`_ark/batch-20-blocker.md`).
3. **Kings feature page walk.** `curl` or fetch `/featured/kings-of-israel-and-judah` and identify the king-entry anchor points that 1-2 Sam / 1-2 Kgs / 1-2 Chr book hubs will cross-link into. Note the `featured_page_refs` surface keys in the session record.
4. **Migration slot check.** Via MCP `list_migrations`, confirm highest applied slot and claim the next available if this batch needs DDL. Expectation: no new migrations. Document the check either way.
5. **Spurgeon / Henry / JFB coverage check.** Via MCP `execute_sql`, run coverage SELECTs for Matthew Henry (all 12 books — expect full coverage since Henry complete Bible shipped Batch 4+5), JFB (all 12), Calvin (expect partial — sample-check 3 books; note gaps in session record), Spurgeon Psalm-only (N/A for this batch — documented). No ingestion work in Batch 20; any commentary gaps are parking-lot for a future commentary-completion batch.

### Section B — Tier 1 book hubs (7 books, bespoke visuals)

For each Tier 1 book in this order: **Joshua → Judges → Ruth → 1 Samuel → 2 Samuel → 1 Kings → 2 Kings**.

For each book, follow this sub-sequence:

1. Read the book's section in `wave_d_batch_20_source_briefs.md` end-to-end before writing code.
2. Build the bespoke depth-1 visual component in `src/components/books/`. Use the Batch 3 diagram primitives first; extend only when necessary. Color-key per the section's accent assignment.
3. Build the book hub page at `/book/:book` following the Pauline / Torah Tier 1 template. Required sections:
   - Hero with signature verse displayed, stat strip (chapter count, timespan, theme count, cross-references count).
   - Depth-1 bespoke visual (the component from step 2).
   - Depth-2 framework sections per the source brief (typically 3-5 framework sections per book — see source-briefs doc).
   - Chapter index linking to all chapters of the book.
   - Commentary spotlight (Doctrine A render — featured voice + "Show other voices" disclosure).
   - Editor's Notes drawer at reduced weight (empty at ship; Pastor Marc populates over time).
   - Cross-surface block — "See also" cards linking to Kings of Israel and Judah feature page (for 1-2 Sam / 1-2 Kgs), Genealogies of Christ (for Ruth), Seed Promise / Bronze Serpent (for Joshua), etc., per the source brief.
4. INSERT the `book_hubs` row via `psql` + `cowork_writer`.
5. INSERT the book's `chapter_pages` rows for all chapters (24 for Joshua, 21 for Judges, 4 for Ruth, 31 for 1 Sam, 24 for 2 Sam, 22 for 1 Kgs, 25 for 2 Kgs).
6. Generate AI-drafted chapter summaries (≤180 words per summary, synthesizing Matthew Henry + JFB per chapter; if other PD commentators are available for a given chapter via the coverage check in step A.5, blend in sourced material). Every summary marked `status='draft'`. INSERT via `psql`.
7. Register any anchor-verse drilldowns required per the source brief.
8. INSERT `featured_page_refs` rows for cross-surface registration (anchor verses in the book that surface into feature pages).
9. INSERT `graph_edges` rows ensuring each anchor-verse drilldown has ≥3 outbound edges.
10. **Checkpoint commit** after each Tier 1 book. Commit message pattern: `feat(batch-20): ship /book/:book Tier 1 hub + chapter pages + summaries`.

### Section C — Tier 2 book hubs (5 books, uniform template)

For each Tier 2 book in this order: **1 Chronicles → 2 Chronicles → Ezra → Nehemiah → Esther**.

Uniform template (no per-book bespoke visual; follow the Minor Prophets pattern from Wave C):

1. Book hub with hero + signature verse + stat strip + standard `<BookOverview />` diagram (from Batch 3 library — generic book-shape diagram that adapts via props to the book's structure). Signature verses per book:
   - 1 Chronicles — 1 Chr 29:11 (Davidic doxology)
   - 2 Chronicles — 2 Chr 7:14 (national repentance formula)
   - Ezra — Ezra 7:10 (Ezra's threefold commitment)
   - Nehemiah — Neh 8:8 (the reading of the Law)
   - Esther — Esth 4:14 ("for such a time as this")
2. Framework sections (3 per book, standard outline):
   - Historical setting + date + audience
   - Literary structure
   - Theological contribution + canonical role
3. Chapter index linking to all chapters.
4. Commentary spotlight (Doctrine A render — featured voice with tradition chip).
5. Editor's Notes drawer at reduced weight.
6. Cross-surface block (1-2 Chr link prominently to Kings of Israel and Judah; Esther links to no feature page currently; Ezra + Nehemiah link to each other as paired post-exilic narrative).
7. INSERT book hub row, chapter pages, chapter summaries, cross-surface refs per Tier 1 process.
8. **Checkpoint commit** after each Tier 2 book.

### Section D — Category landing

1. Build `/group/ot-historical` category landing. Pattern matches `/group/gospels`, `/group/pauline-epistles`, `/group/torah`, `/group/prophets`, `/group/nt-remainder`.
2. 12 book cards in canonical order, Tier 1 cards visually distinguished from Tier 2.
3. Introductory paragraph explaining the OT Historical corpus as the post-conquest narrative arc from entry into the Land through the exile and return.
4. Cross-link prominently to the Kings of Israel and Judah feature page.
5. INSERT any required registry rows.
6. Checkpoint commit.

### Section E — Verification, ark sync, close-out

1. `npm run lint` — confirm no new errors introduced by Batch 20 files (pre-existing errors documented in Wave E hygiene backlog; do not touch).
2. `npm run typecheck` — green.
3. `npm run build` — green locally (skip `npm run dev` per Windows Turbopack hang known quirk).
4. MCP-driven coverage SELECTs to confirm all 249 chapter_pages present, all 12 book_hubs present, all 249 chapter_summaries in `draft` status.
5. Spot-check 5 random chapter pages in production preview (Vercel branch deploy) — routes resolve, Doctrine A commentary renders, Editor's Notes drawer renders at reduced weight.
6. Ark sync per OPERATING_RULES §8.3:
   - Session record at `_ark/03-sessions/session_batch_20_{date}.md` with paragraph summary, files changed, migrations run (if any), aggregate stats (chapter count, summary count, cross-surface refs), WikiLinks to all 12 book node files and the category landing.
   - 12 new book node files in `_ark/02-features/books/` (one per book, ≥3 outbound WikiLinks each).
   - Forward-register Batch 21 Wisdom as the next action (Cowork continues on same wave branch; Marcus pushes at Wave D close, not between sub-batches).
7. Push feature branch to origin. **Do not merge to main.** Batch 21 continues on the same branch; Marcus's merge-and-push happens after Batch 21.
8. Report to Marcus in chat: single-paragraph close-out with stats, production preview URL, and a handoff note confirming the wave branch is ready for Batch 21.

---

## DELIVERABLES

- 12 book hubs live on the wave branch at `/book/joshua` through `/book/esther`.
- 249 chapter pages reachable.
- 249 AI-drafted chapter summaries inserted with `status='draft'`.
- 7 bespoke depth-1 visual components shipped in `src/components/books/`.
- 1 category landing at `/group/ot-historical`.
- Cross-surface refs registered (80-120 rows estimated).
- Graph edges for anchor-verse drilldowns, ≥3 outbound per anchor.
- Session record + 12 book node files in vault.
- Commit history showing checkpoint commits per book (12+ commits total).

---

## ACCEPTANCE

- All 12 `/book/:book` routes return 200 on the branch preview deploy.
- All 249 `/read/:book/:chapter` routes return 200.
- `/group/ot-historical` returns 200, all 12 book cards link correctly.
- Kings of Israel and Judah feature page shows the expected new cross-surface registrations in its "Related book hubs" strip.
- Running the MCP coverage SELECT returns 249 chapter rows and 12 hub rows.
- Editor's Notes drawer renders at reduced weight on all 12 book hubs + all anchor-verse drilldowns.
- No new lint errors introduced. No new type errors introduced. Build green.
- No uncommitted work on the branch at session end (per OPERATING_RULES §1 — Wave F recovery rule).

---

## OUT OF SCOPE

- Batch 21 OT Wisdom (separate prompt, continues on same wave branch after Batch 20 closes).
- Commentary ingestion for any gap books (parking-lot for a future commentary-completion batch).
- Any work on featured pages. Wave F is shipped; no retrofits or additions in Wave D.
- Character profile retrofits (Samuel, David, Solomon, Elijah, Elisha, etc. — 83 seeded characters remain sparse; parking-lot).
- Any graph UI work. Graph remains exploratory per Vision §5.1.
- Apocrypha or extra-biblical content (Wave E).
- Pastor Marc editorial-note authoring (founder-led, not Cowork).
- Chapter-summary review / publishing (founder-led).
- Isaiah Mini-Bible retrofit (already shipped in Wave C).

---

## IF YOU HIT A BLOCKER

Write `ark/batch-20-blocker.md` with:
- Section identifier (A / B / C / D / E)
- Book being processed (if applicable)
- Specific blocker (file / schema / dependency / source-brief gap / coverage gap)
- What you tried
- What you need from Marcus (chat clarification, schema change, source content, etc.)

Halt. Do not guess. Do not improvise scope. Marcus brings the blocker to Claude, Claude writes an addendum, Cowork resumes.

Protocol failures to avoid, learned the hard way:
- **Do not end the session with uncommitted changes on main** (Wave F 2026-04-23). Checkpoint commits on the feature branch are required. Wave branch accumulates commits across Batch 20 + 21; Marcus pushes at wave close.
- **Do not force-push or rewrite history.**
- **Do not delete files outside batch scope.**
- **Do not run writes through MCP.** All INSERTs go through `psql $COWORK_WRITER_DATABASE_URL`. Reads stay on MCP.
- **Do not run DDL against production.** Migration files only, handed to Marcus for SQL Editor application.

---

*Batch 20 prompt authored 2026-04-23. First prompt of Wave D. Pairs with `wave_d_batch_20_source_briefs.md` consolidated source-info document. Batch 21 Wisdom prompt follows; runs on same wave branch; Marcus pushes at Wave D close.*
