# Session — 2026-04-23 — Batch 21 (Wave D.2) OT Wisdom Mega-Batch · Wave D closer

**Cowork session running Batch 21 — the closing sub-batch of Wave D.** Same sandbox-limited pattern as Batch 20 per the prompt's Sandbox Reality section: no local git, no `psql`, no `$COWORK_WRITER_DATABASE_URL`, no `sudo`. Staged-writes operational pattern. All file writes land in the working tree; DB mutations stage as migration files 082 + 083 for Marcus's SQL Editor apply.

**Branch that receives these files on Windows:** `feat/wave-D-ot-historical` (continues Batch 20's commit stack on the same wave branch, per prompt — do NOT create a new branch).

With Batch 21 shipped and merged, Wave D closes. The full 17-book Wave D delivers canonical 66-book coverage at minimum Tier 2 across the OT historical + OT wisdom spine. See §Wave D aggregate stats at the bottom.

## What landed in the working tree (Batch 21 only)

### New files

Source code:

- `src/components/book/ot-wisdom-content.ts` — [[OT_WISDOM_HUB_CONTENT]] Record for all 5 books. 2 Tier 1 (Job, Psalms) with full tagline / stat strip / signature verse ref / structure / themes / keyChapters / metadata / relatedNodes. 3 Tier 2 (Proverbs, Ecclesiastes, Song of Solomon) with lighter but complete content. Exports `OT_WISDOM_TIER_ONE_SLUGS` and `otWisdomContentFor()` helper. Shape-match with [[ot-historical-content]] / [[torah-content]] / [[prophets-content]].
- `src/components/book/ot-wisdom/JobDialogueStructure.tsx` — bespoke depth-1 for Job. Nine-phase stacked layout (prose frame → cycle 1 → cycle 2 → cycle 3-truncated → pivot hymn → defense → Elihu → YHWH whirlwind → repentance+epilogue). Gold YHWH-speech accent breaks the dialogical frame visually.
- `src/components/book/ot-wisdom/PsalmsFivefoldPsalter.tsx` — bespoke depth-1 for Psalms. Five stacked book-bands; 150 linked cells with author-color left-borders (David blue / Asaph amber / Korah green / Solomon gold / Moses violet / Heman + Ethan earth / anonymous subdued); messianic anchor outline (6 Pss); Torah-praise outline (3 Pss); signature Psalm 23 gold-emphasized; doxology markers per book.
- `supabase/migrations/082_seed_chapter_summaries_wave_d_ot_wisdom.sql` — 243 draft scaffold rows across the 5 Wisdom books. Mirrors 078 / 080 DO-loop pattern. Seven special-case scaffolds inside the loop: Pss 2 · 16 · 22 · 45 · 69 · 110 get messianic-anchor scaffolds flagging the Messianic Psalms feature page; Ps 119 gets an acrostic-structure scaffold naming the 22-section / 176-verse architecture. All 243 rows `status='draft'`, `drafted_by='cowork-batch-21'`.
- `supabase/migrations/083_seed_featured_page_refs_wave_d_ot_wisdom.sql` — 46 cross-surface rows. Messianic Psalms absorbs 13 reciprocal rows (6 anchor Pss + 7 contextual); Suffering Servant gets Ps 22; Passion Week gets Ps 118; Covenants gets Pss 2 + 132; Genealogies gets Ps 110. 8 reciprocal rows into 1 Samuel hub for David's flight-period Psalms (34, 52, 54, 56, 57, 59, 63, 142); 1 into 2 Samuel (Ps 51); 2 into 1 Kings (Solomonic Pss 72, 127); 1 into Deuteronomy (Mosaic Ps 90); 1 into 1 Chronicles (Asaph cluster opener). Job anchors (3), Prov 8 (1), Song (2) all forward-registered to parking-lot pages (Kinsman-Redeemer, Satan, Types-of-Christ, Christ-as-Wisdom, Marriage-and-Bride) — these rows resolve when the target pages ship.

Ark:

- `_ark/04-prompts/book-job.md` · `book-psalms.md` · `book-proverbs.md` · `book-ecclesiastes.md` · `book-song-of-solomon.md` — 5 book node files with ≥3 outbound WikiLinks each per Vision §6.1. Same placement convention as Batch 20.
- `_ark/03-sessions/session_batch_21_2026-04-23.md` — this file.

### Edited files (existing)

- `src/components/book/loadBookHubData.ts` — imports `OT_WISDOM_HUB_CONTENT` + `OT_WISDOM_TIER_ONE_SLUGS`; adds them to `TIER_ONE_BOOKS`; chains `otWisdomContent` into the hub-content lookup fall-through.
- `src/components/book/types.ts` — extends the `bespokeVisual` union with `"job" | "psalms"`.
- `src/components/book/bespoke/BespokeVisual.tsx` — imports the 2 new components; adds `// Wave D — OT Wisdom Tier 1 (Batch 21)` case-block to the switch.
- `src/lib/bible/book-groups.ts` — extends `BookGroupSlug` with `"ot-wisdom"`; adds a new `BOOK_GROUPS` entry (label "OT Wisdom", blurb "Dialogue, prayer, proverb, contemplation, and love poetry — the canon's wisdom corpus", books: job, psalms, proverbs, ecclesiastes, song-of-solomon in that canonical order with the two Tier 1 bespoke books at the top per prompt Section D).

## Messianic Psalms anchor inventory (per prompt §A.4)

Confirmed anchors by reading `src/components/featured/messianic-psalms/MessianicPsalmsArc.tsx`:

- **Primary anchors (6):** Pss 2, 16, 22, 45, 69, 110 — each with `/featured/messianic-psalms/ps-{n}` deep-link.
- **Contextual references (7):** Pss 8, 40, 41, 68, 72, 89, 118 — registered via migration 083 without deep-link (surface on the feature page's cluster rather than as standalone anchor cards).

All 13 Psalms get reciprocal `featured_page_refs` rows in migration 083. Psalms hub → Messianic Psalms feature page.

## Commentary coverage deferred verification

Since `psql` is unavailable, Spurgeon Treasury of David coverage on Pss 1–150 runs as a Windows-side deferred check. Marcus runs the following query after applying migration 082:

```sql
SELECT count(*)
FROM commentaries c
JOIN books b ON c.book_id = b.id
WHERE b.abbreviation = 'Psa'
  AND c.author ILIKE '%spurgeon%';
```

Expected: ~1,800+ rows across Pss 1–150 (3–15 rows per Psalm depending on Treasury section depth). If coverage is partial or absent, Doctrine A auto-rank fallback hands Psalms commentary to Matthew Henry (full Bible, shipped Batch 4+5); no blocker.

Additional coverage spot-checks for Windows-side verification (optional):

```sql
-- Calvin on Psalms (expected full — one of his major works)
SELECT count(*) FROM commentaries c
JOIN books b ON c.book_id = b.id
WHERE b.abbreviation = 'Psa' AND c.author ILIKE '%calvin%';

-- Matthew Henry on Job (expected full — complete Bible shipped Batch 4+5)
SELECT count(*) FROM commentaries c
JOIN books b ON c.book_id = b.id
WHERE b.abbreviation = 'Job' AND c.author ILIKE '%henry%';
```

## Windows-apply ordered sequence

1. **Sync branch state.** `cd` to the MannaFest repo; verify `feat/wave-D-ot-historical` is still the current branch and has Batch 20's commits. If Batch 20's code is not yet committed Windows-side, do that first per the Batch 20 session record's apply sequence, then resume here.
2. **Verify Batch 21 working-tree files.** `git status` should show the 6 new files (ot-wisdom-content.ts, 2 TSX files in ot-wisdom/, 2 migrations, 6 ark files under `_ark/04-prompts/` + `_ark/03-sessions/`) and 4 modifications (loadBookHubData, types, BespokeVisual, book-groups).
3. **Stage and commit the Batch 21 code files.** Suggested commit — code only:

   ```
   git add src/components/book/ot-wisdom-content.ts \
           src/components/book/ot-wisdom/ \
           src/components/book/loadBookHubData.ts \
           src/components/book/types.ts \
           src/components/book/bespoke/BespokeVisual.tsx \
           src/lib/bible/book-groups.ts
   git commit -m "feat(batch-21): Wave D.2 OT Wisdom — 5 book hubs (Job + Psalms bespoke + 3 Tier 2) + composite group landing"
   ```

4. **Apply migration 082 in SQL Editor as `service_role`.** Seeds 243 `chapter_summaries` rows across the 5 Wisdom books. Verify:

   ```sql
   SELECT count(*) FROM chapter_summaries WHERE drafted_by='cowork-batch-21';
   -- expected: 243
   ```

5. **Apply migration 083 in SQL Editor.** 46 cross-surface rows. Verify:

   ```sql
   SELECT count(*) FROM featured_page_refs
   WHERE note ILIKE '%messianic%' OR note ILIKE '%wisdom corpus%'
     OR note ILIKE '%davidic%' OR note ILIKE '%superscription%';
   -- expected: count > 15 after 083 applies
   ```

6. **Commit the migration files.** Second commit:

   ```
   git add supabase/migrations/082_seed_chapter_summaries_wave_d_ot_wisdom.sql \
           supabase/migrations/083_seed_featured_page_refs_wave_d_ot_wisdom.sql
   git commit -m "feat(batch-21): stage migrations 082 + 083 (chapter_summaries + featured_page_refs)"
   ```

7. **Run the deferred commentary-coverage spot checks** (optional, see above).
8. **Run local verification.** `npm run lint`, `npm run typecheck`, `npm run build`. The Psalms grid component has the largest TSX surface in Wave D (150 interactive cells); the dev build should still complete quickly (static generation).
9. **Preview click-through on the Vercel branch deploy.** Required: `/book/job`, `/book/psalms` (verify the 150-cell grid renders + hover tooltips work + anchor-Psalm outlines visible), `/book/proverbs`, `/book/ecclesiastes`, `/book/song-of-solomon`, `/group/ot-wisdom`. Spot-check 3–5 random Psalms via `/read/psalms/{n}` to confirm the reader still works (no reader changes in this batch — regression check). Verify the Messianic Psalms feature page shows the reciprocal Psalms-hub registrations in its related-book-hubs strip.
10. **Push + merge Wave D to main.** With Batch 21's commits on top of Batch 20's, `feat/wave-D-ot-historical` now carries the full 17-book Wave D. Push to origin, merge to main with `--no-ff` per OPERATING_RULES §1, and Vercel auto-deploys.
11. **Archive the wave branch.** Per §2 safety backstop: do not delete — leave it on origin for one week as rollback reference.

## What did NOT land (relative to the prompt's nominal scope)

- **No `chapter_pages` INSERTs.** Same rationale as Batch 20 — chapter resolution runs off `meta.chapterCount` + dynamic `/read/[book]/[chapter]`. Book-slugs has all 5 Wisdom books with correct chapter counts. No DB write required for reader routes.
- **No `graph_edges` INSERTs.** Same rationale as Batch 20 — no standalone anchor-verse drilldown pages; `featured_page_refs` carries the cross-surface discoverability load. Follow-on migration 084 trivial if desired later (anchor-verse candidates enumerated in the source briefs' "Anchor-verse candidates" sections per book).
- **No `/group/ot-wisdom/page.tsx` file.** Route is data-driven via `/group/[slug]` + `bookGroupBySlug()`; adding the composite to `book-groups.ts` was sufficient. Pattern matches Batch 20's `ot-historical` and Wave C's `prophets` / `nt-remainder`.
- **No author-ribbon click handler in the Psalms Psalter component.** Parking-lot for Wave E Hygiene or a later enhancement batch; the ribbon colors are visible as cell left-borders, but clicking a ribbon to filter by author is not implemented. The visual primitive ships; the secondary interaction is stubbed.
- **No `font-latin` or special verse-text rendering for the scripture-text class.** Mentioned in the source briefs' shared conventions but the existing hub layout handles signature-verse rendering through `BookHubHero.tsx`; no changes needed here.
- **No commits or pushes.** Per the Cowork-sandbox-quirk recovery directive — now explicit in the Batch 21 prompt's Sandbox Reality section and becoming the permanent operational pattern.

## Aggregate stats — Batch 21 only

- **Book hubs shipped:** 5 (2 Tier 1 bespoke + 3 Tier 2 uniform).
- **Bespoke depth-1 components shipped:** 2 (`JobDialogueStructure`, `PsalmsFivefoldPsalter`).
- **Chapter summaries staged (draft):** 243 across 5 books.
- **Cross-surface registrations staged:** 46 rows.
- **Category landings:** 1 (`/group/ot-wisdom`).
- **Vault book node files:** 5.
- **Code files created:** 3 (content + 2 visuals).
- **Code files edited:** 4 (loadBookHubData, types, BespokeVisual, book-groups).
- **Migrations staged (apply Windows-side):** 2 (082, 083).

## Wave D aggregate stats (at Wave D push)

Combining Batch 20 + Batch 21:

- **Books shipped:** 17 (12 historical + 5 wisdom).
- **Tiers:** 9 Tier 1 bespoke (7 + 2) + 8 Tier 2 uniform (5 + 3).
- **Chapter summaries staged:** 492 total across 17 books — 249 historical + 243 wisdom.
- **Cross-surface refs staged:** ~101 rows (55 from migration 081 + 46 from migration 083).
- **Bespoke depth-1 visual components:** 9 (7 from Batch 20 + 2 from Batch 21).
- **Category landing composites:** 2 (`ot-historical`, `ot-wisdom`).
- **Ark book node files:** 17 (12 + 5).
- **Staged migrations:** 4 (080, 081, 082, 083).
- **Canonical 66-book coverage at minimum Tier 2:** complete. Every book of the Protestant canon now has at least a uniform Tier 2 hub shipped.

## What this sets up

**Wave E** is the next and final content wave before Admin/Customization — per Master Plan §3:

- Apocrypha ingestion + 15 book hubs (Tier 2 uniform; Academic-tradition tag; `/apocrypha/*` route namespace per Doctrine D.8).
- Extra-biblical corpus — 1 Enoch + Jubilees under `/extra-biblical/*` (R.H. Charles 1913; explicit non-canonical header; Jude 1:14–15 surfaced as canonical intersection).
- Hygiene — lint cleanup, test coverage, performance audit, any Wave D / Wave C backlog.

Wave E prompts not yet authored. Marcus to begin Wave E planning after Wave D push + merge lands.

**Post-Wave E**, the Admin / Customization Wave begins — Pastor Marc editor surfaces, Verse-of-the-Day admin queue, user personalization (cowork_writer-scoped RPCs per [[project_mannafest_supabase_access]]), Doctrine-D admin-schema implementation. That wave is Marcus-driven and will lean less on Cowork batch execution.

## Sandbox-quirk note

Three environmental gaps continue to define Cowork's batch operational pattern, confirmed again this session and spelled out in the Batch 21 prompt's Sandbox Reality section:

1. `.git` state unrepairable from inside the sandbox (broken HEAD, stale `.git/index.lock` non-removable because the mount is create-only).
2. `psql` not installed; `sudo` locked; no mechanism to add it.
3. `$COWORK_WRITER_DATABASE_URL` not exposed to the sandbox environment.

OPERATING_RULES §1.1 envisions direct `psql` writes; the sandbox reality is that Cowork operates in a staged-writes pattern. This session's success — and Batch 20's before it — argues the staged-writes pattern is a complete and coherent alternative. An OPERATING_RULES amendment codifying "staged-migrations for DB writes" as the canonical path (with direct-psql as legacy aspiration) would bring the rules back in line with the practice.

Parking-lot for Marcus: consider whether the OPERATING_RULES §1.1 amendment should be a standalone docs batch after Wave D merges, or bundled into Wave E Hygiene.

## Related memory touches

None this session. The sandbox-quirk observation remains durable but still likely platform-fixable; holding off on a memory write. The "staged-writes pattern as canonical Cowork path" is a candidate memory once Marcus either confirms it permanently or fixes the sandbox — whichever comes first.

---

Authored 2026-04-23 for Batch 21 (Wave D.2 — OT Wisdom Mega-Batch; Wave D closer). Paired with `_ark/source-briefs/wave_d_batch_21_source_briefs.md` (source info) and the Batch 21 prompt in-chat. Continues the `feat/wave-D-ot-historical` branch Batch 20 opened; Marcus's single Wave D push + merge follows this close. Next wave: Wave E (Apocrypha + Extra-biblical + Hygiene).
