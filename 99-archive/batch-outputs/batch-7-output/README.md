---
batch: batch-7-scripture-reader-gospels
status: ALL 10 PHASES COMPLETE IN SCRATCHPAD — ready for Marcus Windows-direct merge.
session: 2026-04-22 (Cowork)
scratchpad: _ark/batch-7-output/
---

# Batch 7 — Scripture Reader Pillar + Gospels Mega-Batch

Ten phases, committed independently into `_ark/batch-7-output/` mirroring
repo paths. Cowork sandbox git broken per known quirk — Marcus does the
Windows-direct robocopy + build + merge once at the end.

Four migrations already live in production Supabase (applied via MCP).
117 chapter-summary drafts already live in production (seeded via MCP).
All code is in the scratchpad awaiting the Windows-direct pass.

## Entry audit — 2026-04-22 (PASS)

Batch 6 state confirmed live on main:
- ✅ `votd_reflections` in prod (0 rows, awaits Pastor Marc)
- ✅ `featured_page_refs` in prod (71 rows — 24 Batch 6 seed + 47 Batch 7-B cross-surface)
- ✅ `src/lib/features/flags.ts` wired (`NEXT_PUBLIC_GRAPH_ENABLED`)
- ✅ Homepage reshaped with VOTD lead + 4-tile grid
- ✅ VOTD + verse-page components present
- ✅ Commentary trim-at-render working (Batch 6 false-positive confirmed)

Adjacent work in good shape: Batch 4+5 commentary extension + editorial_notes,
Batch 5.5 top-5 cross-refs, Batch 7-B jesus_titles (17 titles, 183 refs).

## Decisions made this session

1. **Migration numbering 059–062 (not 053–056).** 053 is shipped
   `seed_featured_page_refs.sql`. Used next-consecutive-after-shipped per
   Batch 7-B convention (057/058 last shipped). Deviation logged.

2. **Sandbox git broken → scratchpad pattern.** Same as Batch 6 / 7-B.
   Marcus robocopies `_ark/batch-7-output/src/**` and `supabase/**` into
   the code repo, runs `npm run build`, commits and merges.

3. **Supabase MCP for migrations + seed data; service-role for admin RPCs;
   anon + RLS for public reads.** Per the Wave-12 auto-memory decision.

4. **Gospel hubs are content-first, not config-first.** The five Gospel
   hubs render from static content in `src/components/book/gospel-content.ts`.
   `book_hub_config` is the optional admin override path (Phase 10 editor).

5. **Book slug registry is static, not FK'd.** `books` has no `slug` column,
   so `src/lib/bible/book-slugs.ts` maps all 66 books slug↔book_id↔abbreviation
   with chapter counts seeded from the audit.

6. **Textual evidence panels render server-side.** Mark 16 + John 21 content
   in `src/components/evidence/content/` (PD-sourced: Burgon 1871, Panin
   1934, Westcott, Godet, Bullinger, Augustine, Jerome, patristic). The
   chapter page conditionally passes the rendered panel as a prop to the
   client ChapterReader.

7. **117 chapter summaries seeded as drafts.** AI-synthesized from Matthew
   Henry, Calvin, Gill, Clarke, JFB, Barnes. All `status='draft'`,
   `drafted_by='ai'`. Public reader hides drafts — nothing leaks. Pastor
   Marc promotes to published through `/admin/chapter-summaries`.

8. **Cross-book navigation + end-of-Gospels handling.** Acts 28's
   `next_chapter_url` is null and `navigation.end_of_gospels=true`; the
   reader renders "End of Gospels — return to group" instead of chaining
   to Romans (Romans hub doesn't exist this batch).

9. **Featured-studies callout routing allowlist.** `FeaturedStudiesCallout`
   and `BookHubFeaturedStudies` classify slugs via a small allowlist of
   known `/title/*` slugs; everything else falls to `/featured/*`. This
   matches Batch 7-B's route_prefix convention and survives the removal
   of `route_prefix` in the reader bundle.

## Production Supabase state changes (applied via MCP)

| Migration | Table | Rows at ship |
|---|---|---|
| 059 | `chapter_summaries` | 117 (draft) |
| 060 | `pericope_overrides` | 0 (Pastor Marc fills as needed) |
| 061 | `book_hub_config` | 0 (defaults render without overrides) |
| 062 | `user_preferences` | 0 (populates as users toggle) |

Advisor check after migrations: only pre-existing advisors remain. No new
RLS-without-policy or function-search-path issues introduced.

## Phase-by-phase deliverables

### Phase 1 — Schemas & user preferences infrastructure ✅

Migrations 059–062 applied. Files:
- `supabase/migrations/059_chapter_summaries.sql`
- `supabase/migrations/060_pericope_overrides.sql`
- `supabase/migrations/061_book_hub_config.sql`
- `supabase/migrations/062_user_preferences.sql`
- `src/app/api/user-preferences/route.ts` — GET + PATCH, 401 for anon
- `src/hooks/useReadingPreferences.ts` — server-first + localStorage fallback

### Phase 2 — "Read the Bible" nav overlay + routing scaffolds ✅

- `src/lib/bible/book-slugs.ts` — all 66 books slug registry
- `src/lib/bible/book-groups.ts` — 10-group taxonomy
- `src/components/nav/BookOverlayProvider.tsx`
- `src/components/nav/ReadTheBibleOverlay.tsx`
- `src/components/nav/BookGroupColumn.tsx` (desktop)
- `src/components/nav/BookGroupAccordion.tsx` (mobile; Gospels open by default)
- `src/components/reader/StartReadingButton.tsx`
- `src/app/read/[book]/page.tsx` (redirect to `/read/:book/1`, accepts legacy abbr)
- `src/app/book/[slug]/page.tsx` (shell loads BookHubLayout)
- `src/app/group/[slug]/page.tsx` (shell loads CategoryLandingLayout)
- **Patches** (apply by hand): `patches/SiteHeader.patch.md`, `patches/layout.patch.md`
  — add a "Read the Bible" pill to the header and mount `<BookOverlayProvider>` + `<ReadTheBibleOverlay />` in layout.

### Phase 3 — Chapter reader with three layers ✅

13 files:
- `src/lib/bible/pericopes.ts` (resolution fallback chain)
- `src/lib/bible/truncate.ts` (50-word cap helper)
- `src/app/api/reader/[book]/[chapter]/route.ts` (bundle endpoint)
- `src/components/reader/types.ts`
- `src/components/reader/VerseLine.tsx`
- `src/components/reader/ChapterSummaryBlock.tsx`
- `src/components/reader/InlineCrossRefsCompact.tsx`
- `src/components/reader/FeaturedStudiesCallout.tsx`
- `src/components/reader/SectionCommentaryInline.tsx`
- `src/components/reader/ChapterCommentarySidebar.tsx`
- `src/components/reader/ChapterCommentaryBottomSheet.tsx`
- `src/components/reader/DistractionFreeLayer.tsx`
- `src/components/reader/SectionedLayer.tsx`
- `src/components/reader/ChapterNavigationBar.tsx`
- `src/components/reader/ChapterReader.tsx`
- `src/components/reader/loadReaderBundle.ts`
- `src/app/read/[book]/[chapter]/page.tsx` (replaces legacy client reader)
- `src/app/read/[book]/[chapter]/layout.tsx`

### Phase 4 — Book hub template ✅

- `src/components/book/types.ts`
- `src/components/book/BookHubHero.tsx`
- `src/components/book/BookHubMetadata.tsx`
- `src/components/book/BookHubStructure.tsx` (outline / grid via tier)
- `src/components/book/BookHubThemes.tsx`
- `src/components/book/BookHubKeyChapters.tsx`
- `src/components/book/BookHubChapterIndex.tsx`
- `src/components/book/BookHubCommentary.tsx`
- `src/components/book/BookHubFeaturedStudies.tsx`
- `src/components/book/BookHubRelatedNodes.tsx`
- `src/components/book/BookHubLayout.tsx`
- `src/components/book/TextualEvidenceAnchor.tsx`
- `src/components/book/loadBookHubData.ts`

### Phase 5 — Category landing template ✅

- `src/components/group/types.ts`
- `src/components/group/CategoryLandingLayout.tsx`
- `src/components/group/CategoryLandingBookList.tsx`
- `src/components/group/loadCategoryLandingData.ts`
- `src/components/group/intro-copy.ts` — `/group/gospels` intro authored;
  other 9 groups fall through to their blurb (Wave-3 phases 3a–3d author theirs)

### Phase 6 — Five Gospel book hubs with bespoke depth-1 visuals ✅

- `src/components/book/gospel-content.ts` — all Gospel hub content (tagline,
  stat strip, signature verse refs, structure outlines, themes, key chapters,
  metadata)
- `src/components/book/bespoke/BespokeVisual.tsx` — dispatcher
- `src/components/book/bespoke/MatthewDiscourseColumns.tsx` — 5 discourse
  columns + OT-fulfillment thread
- `src/components/book/bespoke/MarkTwoPanelArc.tsx` — arc hinged at 8:27
- `src/components/book/bespoke/LukeJourneyRibbon.tsx` — Bethlehem→Emmaus
- `src/components/book/bespoke/JohnPairedSevens.tsx` — 7 signs + 7 'I AM'
- `src/components/book/bespoke/ActsJourneyMap.tsx` — Acts 1:8 concentric
  rings + 4 colored journey threads (1st, 2nd, 3rd, Rome)

### Phase 7 — 117 chapter pages live ✅

Automatic via Phase 3's ChapterReader. KJV verse coverage confirmed
complete for all 117 Gospel chapters (audit query before build):
Mat 28 / Mrk 16 / Luk 24 / Jhn 21 / Act 28. Cross-book navigation wired;
Acts 28 ends with the "End of Gospels" marker rather than chaining
forward (Romans hub is Batch 14 scope).

### Phase 8 — Textual evidence panels for Mark 16 + John 21 ✅

- `src/components/evidence/types.ts`
- `src/components/evidence/ManuscriptCensusCard.tsx`
- `src/components/evidence/HeptaticAnalysisCard.tsx`
- `src/components/evidence/PatristicWitnessCard.tsx`
- `src/components/evidence/TheologicalIntegrationCard.tsx`
- `src/components/evidence/TextualEvidencePanel.tsx`
- `src/components/evidence/content/mark16.ts` — sourced from Burgon 1871,
  Panin 1934, Irenaeus, Justin Martyr, Tatian, Hippolytus, Vincentius,
  Scrivener 1894
- `src/components/evidence/content/john21.ts` — sourced from Westcott 1880,
  Godet 1886, Bullinger 1895, Augustine (tr. Rettig 1888), Jerome, Panin 1934
- `src/components/evidence/content/registry.ts` — keyed by `bookSlug:chapter`

Reader integration:
- Chapter page conditionally passes `<TextualEvidencePanel />` as a prop
  to the client `<ChapterReader />`.
- In sectioned layer: panel renders above the section column.
- In distraction-free layer: small "Textual notes available — switch to
  sectioned" link at chapter end.
- Mark + John book hubs carry a `<TextualEvidenceAnchor />` deep-linking
  to the chapter reader's `#textual-evidence` anchor.

### Phase 9 — 117 chapter summary AI-draft queue ✅

- `src/app/api/admin/chapter-summaries/[summaryId]/route.ts` (PATCH)
- `src/app/admin/chapter-summaries/page.tsx` (prioritized queue — Mark 16
  and John 21 float to the top, then key chapters, then canonical order)
- `src/app/admin/chapter-summaries/[summaryId]/page.tsx` (single-row editor)
- `src/app/admin/chapter-summaries/[summaryId]/SummaryEditor.tsx` (client
  form with word-count display)
- `supabase/seeds/batch-7-chapter-summaries-draft.sql` — placeholder file
  recording the shape; the actual 117 rows were inserted via MCP
  execute_sql on 2026-04-22.

Seed attribution: every row has `drafted_by='ai'` and is synthesized from
Matthew Henry, Calvin, Gill, Clarke, JFB, and Barnes. Quality varies; that
is by design — Pastor Marc is the editor.

### Phase 10 — Admin surfaces + integration polish ✅

- `src/app/api/admin/book-hubs/[bookSlug]/route.ts` (PATCH, upsert)
- `src/app/api/admin/pericopes/[bookSlug]/[chapter]/route.ts` (PATCH,
  delete-then-insert the chapter's rows)
- `src/app/admin/book-hubs/[bookSlug]/page.tsx`
- `src/app/admin/book-hubs/[bookSlug]/BookHubOverrideEditor.tsx`
- `src/app/admin/pericopes/[bookSlug]/[chapter]/page.tsx`
- `src/app/admin/pericopes/[bookSlug]/[chapter]/PericopeEditor.tsx`

Integration preserved:
- `NEXT_PUBLIC_GRAPH_ENABLED=false` gating untouched; no graph UI leaks
  onto reader pages, book hubs, or category landings.
- Batch 6 homepage + VOTD layers untouched.
- Batch 5.5 top-5 cross-refs untouched.
- Verse-page featured-studies + interlinear untouched.

## Marcus's Windows-direct apply order

1. `git checkout -b feat/batch-7-scripture-reader-gospels`
2. Robocopy `_ark/batch-7-output/src/**` → `Downloads/MannaFest/src/`
3. Robocopy `_ark/batch-7-output/supabase/migrations/**` and
   `_ark/batch-7-output/supabase/seeds/**` →
   `Downloads/MannaFest/supabase/`
4. Apply patches by hand:
   - `_ark/batch-7-output/patches/SiteHeader.patch.md`
   - `_ark/batch-7-output/patches/layout.patch.md`
5. `git clean -fd` if robocopy leaves stray files.
6. `npm run build` — confirm tsc + compilation green.
7. File-explicit `git add` the changed files (avoid `-A`).
8. Commit once with a single message summarizing all 10 phases
   (branch stays open through the production click-through).
9. Merge to main with `--no-ff` when the acceptance click-through passes.
10. Vercel auto-deploys.

No Vercel env changes required. No new deps.

## Acceptance click-through (post-merge)

1. `/read/matthew/1` — 200; distraction-free default for anonymous; verse
   text; prev/next works.
2. `/read/mark/8` — toggle to sectioned; chapter commentary appears in the
   right sidebar (desktop) or bottom-sheet (mobile).
3. `/read/luke/15` — prodigal son; verify layer toggle persists.
4. `/read/john/3` — verify cross-refs + Bronze-Serpent featured callout if
   seeded.
5. `/read/acts/17` — Mars Hill; layer toggle persists.
6. `/read/mark/16` — **Textual Evidence** panel renders prominently in
   sectioned mode. Manuscript census shows Alexandrinus/Ephraemi/Bezae
   present, Sinaiticus/Vaticanus absent, Irenaeus c. 180 patristic witness;
   heptatic 175/553/98; Greek-γάρ-ending argument; verdict Authentic.
7. `/read/john/21` — panel renders; manuscript universal attestation;
   153-fish analysis; Peter's restoration; verdict Authentic.
8. Evidence panels also accessible from `/book/mark` and `/book/john`
   anchor sections.
9. `/book/matthew` — discourse-column depth-1; signature Matt 28:18–20 at
   hero scale; Start Reading → `/read/matthew/1`.
10. `/book/mark` — two-panel arc; signature Mark 10:45; Mark 16 anchor.
11. `/book/luke` — journey ribbon; signature Luke 19:10.
12. `/book/john` — paired-sevens; signature John 20:30–31; John 21 anchor.
13. `/book/acts` — journey map; signature Acts 1:8; three journeys
    visually distinguished.
14. `/group/gospels` — genre intro; five book cards.
15. "Read the Bible" pill in the header opens the overlay; desktop 10
    columns; Gospels column lists the five Gospels; mobile accordion opens
    Gospels by default; group header → `/group/gospels`.
16. `/admin/chapter-summaries` — 117 drafts, prioritized (Mark 16 and John
    21 first).
17. `/admin/chapter-summaries/[id]` — Pastor Marc edits body, toggles
    status to published, saves; public reader renders it.
18. `/admin/book-hubs/matthew` — super-admin override surface works.
19. `/admin/pericopes/matthew/5` — add/edit/reorder sections for Sermon on
    the Mount.

Batch 6 preserved:
20. Homepage VOTD lead + 4-tile grid still works.
21. `/verse-of-the-day` still works.
22. `/verse/romans/8/31` still works with top-5 cross-refs + biblehub
    interlinear + commentary trim + no graph UI.

Feature flag:
23. No graph UI leaks on any reader / book hub / category landing /
    admin surface. Only the muted footer link to `/graph` remains.

## Ark sync

- Session record: `_ark/03-sessions/session_7_2026-04-22.md`
- Prompt file: `_ark/04-prompts/batch_7_scripture_reader_gospels.md` (status flip)
- Node files: `_ark/nodes/books/Matthew.md`, `Mark.md`, `Luke.md`, `John.md`, `Acts.md`

## WikiLinks

- [[batch_7_scripture_reader_gospels]]
- [[session_7_2026-04-22]]
- [[ChapterReader]] · [[BookHubLayout]] · [[TextualEvidencePanel]] · [[ReadTheBibleOverlay]]
- [[Matthew]] · [[Mark]] · [[Luke]] · [[John]] · [[Acts]]
- [[chapter_summaries]] · [[pericope_overrides]] · [[book_hub_config]] · [[user_preferences]]
- [[session_6_2026-04-22]] (predecessor)
- [[session_7b_2_2026-04-22]] (adjacent)
