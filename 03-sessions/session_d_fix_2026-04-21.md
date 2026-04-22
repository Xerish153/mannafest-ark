# Session — Batch D.FIX (Mobile UX Pass + Doctrine D Implementation)

**Date:** 2026-04-21
**Batch:** D.FIX
**Status:** Shipped to working tree. Awaiting Windows push / merge.
**Branch:** `feature/batch-d-fix-mobile-pass` (TO BE CREATED on Windows before push)
**Related:** [[batch-d-fix-blocker]] · [[Vision_v2_Locked]] · [[STATUS]] · [[BATCH_QUEUE]]

---

## Shape of the batch

Six fixes drawn from Marcus's mobile production audit, all addressed by Doctrine D or constituting plain bugs. UI and content only — zero Supabase schema changes, zero migrations, zero data ingestion. Worked exclusively under `src/`.

The batch opened with a halt + blocker file ([[batch-d-fix-blocker]]) because the prompt's stated routes (`/study/genesis`, `/study/els`) did not exist in the codebase and Fix 5's ELS data-sourcing could not be resolved without scope input from Marcus. Marcus resumed with expanded scope on Fix 5 (five matrices, no critique content, §4.5 not applied) and confirmed interpretations for Fixes 1 and 3. Execution followed verbatim.

---

## What shipped

### Fix 1 — Chapter grid repaired on `/read/[book]`

**Root cause:** PostgREST's 1000-row default cap. The previous query selected every verse (`select("chapter_num")`), ordered by `chapter_num`, and deduped in JS. Genesis has 1,533 KJV verses; the first 1000 cover chapters 1–34. Exodus 1,213 verses → first 1000 ≈ chapters 1–35. Both matched Marcus's mobile screenshots exactly.

**Fix:** Switched to a single-row max-chapter query. Batch 3.7's canonical audit proved all 66 books have contiguous chapters 1..N, so `max(chapter_num)` + `Array.from({ length: N })` is exact. Single row fetched, no cap to hit.

**Files:**
- `src/app/read/[book]/page.tsx` — query rewrite + new `loadBookAndChapters(bookAbbr)` helper + `BookRow` type (retired the `let book: any`).

### Fix 2 — Login / account access in the hamburger menu

**Approach:** Added an account affordance block above the existing section grid in `MenuOverlay`. Reused the canonical `useSupabaseSession()` hook (same one `AccountMenu.tsx` uses on desktop).

**Behavior:**
- Session loading → subtle animated skeleton.
- Logged out → "Log in" button (→ `/auth/signin`, which `/login` already redirects to) + "Create account" link (→ `/auth/signup`).
- Logged in → "My account" tile with the user's initial avatar and email (→ `/account`).
- Desktop `AccountMenu` untouched.

**Files:**
- `src/components/nav/MenuOverlay.tsx` — import `useSupabaseSession`, render the account block between top bar and section grid.

### Fix 3 — Doctrine D.2 placeholder pattern (Class 1 only)

**Infrastructure:**
- `src/hooks/useSuperAdmin.ts` — stub hook returning `false` for all users. TODO-commented to wire to Supabase `profiles.role` when the D-admin-schema batch lands. Stubbed as a hook (not a constant) so the upgrade is body-only.
- `src/components/EditorialSlot.tsx` — presentational component. Renders `null` for public users; "+ Add inline note" button for super-admin. Carries `id` and `hint` props for future editor-composer wiring.

**Replacements (13 Class-1 sites):**
| File | Lines before | After |
| --- | --- | --- |
| `src/app/study/seed-promise/page.tsx` | 1 placeholder | `EditorialSlot id="seed-promise-grammatical-singular"` |
| `src/app/study/tabernacle/page.tsx` | 2 placeholders | 2 × `EditorialSlot` (opening reflection + synthesis) |
| `src/app/study/suffering-servant/page.tsx` | 1 placeholder | `EditorialSlot id="suffering-servant-scroll-evidence"` |
| `src/app/study/messianic-psalms/page.tsx` | 2 placeholders | 2 × `EditorialSlot` (opening reflection + synthesis) |
| `src/app/study/genealogies/page.tsx` | 1 placeholder | `EditorialSlot id="genealogies-virgin-birth"` |
| `src/app/study/bronze-serpent/page.tsx` | 1 placeholder | `EditorialSlot id="bronze-serpent-opening-reflection"` |
| `src/app/verse/.../VerseHeader.tsx` | 1 placeholder | `EditorialSlot id={`book-context-${bookAbbr}`}` |
| `src/app/verse/.../OriginalLanguage.tsx` | 1 tech-status note | Deleted. HTML comment replaces. |
| `src/app/verse/.../CommentaryVoices.tsx` | 1 placeholder block | `EditorialSlot id={`commentary-founder-${bookName}-${chapterNum}`}` + meta text updated |
| `src/app/person/[slug]/page.tsx` | 1 placeholder | `EditorialSlot id={`person-biography-${person.slug}`}` |
| `src/app/about/page.tsx` | 4 placeholders | 3 × `EditorialSlot` + broken `mailto:[founder: add address here]` removed |
| `src/app/about/DonateSectionClient.tsx` | 1 placeholder | `EditorialSlot id="about-donate-copy"` |
| `src/app/study/bible-codes/page.tsx` | 1 placeholder | Handled in Fix 5's full rewrite (founder-commentary slot → `EditorialSlot`) |

**Out of scope (Marcus's strict reading):** Supabase-sourced placeholders in `src/app/concordance/[number]/page.tsx`, `src/app/authors/[slug]/page.tsx`, `src/app/authors/page.tsx`, `src/app/topics/[slug]/page.tsx`. Marcus's decision (verbatim): "their conditional fallback patterns are Doctrine D.2 compliant in behavior." Documented for reference — this is a scope call, not a bug.

**Noted for follow-up:** `src/app/authors/[slug]/page.tsx` renders `{PLACEHOLDER}` as literal visible text (lines 190, 206, 258) when the Supabase content is unfilled. That is leaked placeholder text to public users. Strict scope respected this session; a future batch may wish to revisit.

### Fix 5 — `/study/bible-codes` depth-1 rebuild (five ELS matrices)

**Font infrastructure:**
- `src/app/layout.tsx` — added `Noto_Serif_Hebrew` from `next/font/google` (weights 400–700, Hebrew subset). Exposed as `--font-hebrew`. Loaded once at root, every Hebrew-rendering surface can reach it.

**New component:**
- `src/components/diagrams/ELSMatrix.tsx` — single component, dispatches on `demo.kind` (`"heptadic" | "skip" | "genealogy" | "acrostic"`). Renders four matrix treatments: HeptadicGrid (numbered word grid), SkipGrid (1 or 5 columns), GenealogyColumn (10-row name chain + concatenated sentence), AcrosticStack (verse card per row + YHWH badge). Mobile-first (single-column at `<sm`, responsive at `sm:`/`lg:`).

**New content:**
- `src/content/els-demonstrations.ts` — 5 fully-populated demonstrations per Marcus's expanded brief:
  1. **Genesis 1:1 Heptadic Structure** — seven Hebrew words, gematria per word (913, 203, 86, 401, 395, 407, 296), total 2701 = 37 × 73; seven-based facts listed. Sources: Panin + Bullinger (both PD).
  2. **Torah 50-letter skip across the Pentateuch** — five-column layout (Gen/Exod/Lev/Num/Deut) with per-column anchor, skip value, direction, spells-what, Hebrew anchor. Captures Marcus's exact spec (Gen/Exod forward, Num/Deut backward, Lev center → YHWH at 7-skip). Source: Weissmandl + Missler.
  3. **Genesis 5 genealogy gospel message** — ten-name chain Adam → Noah, Hebrew + transliteration + meaning + sentence part, concatenated sentence beneath. Source: Missler.
  4. **Isaiah 53 Yeshua Shmi 20-letter skip** — single-column SkipGrid with Isaiah 53:10 anchor, backward direction, spells יֵשׁוּעַ שְׁמִי. Source: Rambsel (1996).
  5. **Esther hidden YHWH acrostics** — four-verse AcrosticStack (Esther 1:20, 5:4, 5:13, 7:7) with Hebrew, four-word chips, position (initial/final), direction. Source: Bullinger's Companion Bible (1922), Appendix 60 (PD).
  
  Each demo also carries `methodology` and `passageContext` prose for depth 3.

**Page rewrite:**
- `src/app/study/bible-codes/page.tsx` — complete rewrite per Marcus's expanded scope:
  - **Depth 1:** Five `<ELSMatrix />` instances, one per demonstration.
  - **Depth 2:** Three framework cards — "The pattern across Scripture", "Ruth 4:18–22 — the messianic genealogy", "Where else the pattern appears". All short-form, ≤2 sentences each. No critique.
  - **Depth 3:** `<details>`/`<summary>` drilldown per demo with methodology + passage context + source.
  - Further reading restricted to cited authors (Bullinger, Panin, Missler, Rambsel) — no McKay/Bar-Hillel, no Drosnin critique content (removed per Marcus's "no critique cards at any depth" direction).
  - Founder commentary section replaced with `<EditorialSlot />` per D.2.
  - Retained breadcrumb, JSON-LD, Explore-from-here block.

- `src/components/diagrams/index.ts` — `ELSMatrix` exported alongside existing diagram library.

### Fix 6 — Isaiah Mini-Bible expansion

**Added (three new sections, existing 66↔66 grid untouched):**

- **Depth-1 summary header + legend** (between hero and Mirror Diagram):
  - Two-sentence explainer of what the grid shows (prophecy-and-fulfillment, structural inflection, theological arc).
  - Four-chip legend: Topical Parallel (amber) / Prophecy → Fulfillment (emerald) / Structural Inflection (sky) / Theological Arc (violet).
  - New helper: `ConnectionChip`.

- **Depth-2 — Hebrew Bible Ordering Alignment** (after parallels list):
  - Two prose paragraphs on Isaiah's place in the Nevi'im and the internal bifurcation mirroring the canon's macro-structure.
  - Two-column visual: Hebrew canon (Torah · Nevi'im · Ketuvim) vs. Christian canon (Law · History · Wisdom · Prophets), with Isaiah highlighted in each.
  - Sources footer: Baba Bathra 14b, standard Tanakh editions.
  - New helper: `OrderingColumn`.

- **Depth-2 — One Isaiah or Two?** (after the Hebrew Bible Ordering section):
  - Four-part §4.5 steelman-then-respond structure:
    1. **Claim** — Duhm 1892 Deutero-Isaiah hypothesis.
    2. **Steelman** — strongest defense (Duhm's own argument; named scholarly extenders: Westermann, Whybray, Blenkinsopp).
    3. **Response** — John 12:38–41 attribution + 1QIsaᵃ continuous manuscript evidence.
    4. **Editorial note** — Pastor Marc card with a placeholder body and `<!-- PASTOR_MARC_NOTE_PLACEHOLDER: Two-Isaiahs -->` HTML comment. No fabricated founder voice; card structure / tradition tag / attribution in place awaiting Marcus.
  - New helper: `TwoIsaiahsCard`.

**Files:**
- `src/app/study/isaiah-mini-bible/IsaiahMiniBibleClient.tsx` — three sections added; dead imports (`Link`, `verseLink`) cleaned out while touching the file.

### Fix 4 — Mobile layout pass

- `src/app/study/seed-promise/page.tsx` — depth-1 rewrite:
  - Header lede collapsed from ~95-word paragraph with 2 inline `<Cite />` → 2 short sentences, no Cite at depth 1.
  - "The Grammatical Argument" card (150-word paragraph with 2 inline `<Cite />`) replaced with three concept cards (Genesis 3:15 / Galatians 3:16 / Revelation 12), each ≤2 short sentences, no Cite.
  - `EditorialSlot` preserved below the concept grid.
  - Mobile: `grid-cols-1 sm:grid-cols-3`, 16px base body, 18px concept labels, 16px card padding (`p-4 sm:p-5`).
  - New helper: `ConceptCard`.
- `src/app/study/bible-codes/page.tsx` — addressed by Fix 5's full rewrite. Each matrix card uses responsive grids (`grid-cols-1` at mobile → `sm:grid-cols-2 lg:grid-cols-4` at larger). All Hebrew text RTL-aligned with `dir="rtl"` and `lang="he"`.
- `src/app/study/isaiah-mini-bible/IsaiahMiniBibleClient.tsx` — Fix 6's new sections all use mobile-first grids (`grid-cols-1 md:grid-cols-2` for ordering, `grid-cols-1` for steelman cards). Legend chips wrap naturally. Existing Mirror Diagram `grid-cols-3` left in place — pre-existing, not regressed.

### Fix 7 — Integration check

- `npx tsc --noEmit` — **0 errors.**
- `npx eslint [22 touched files]` — **0 errors, 0 warnings** on every touched file.
- `npm run lint` (whole repo) — 217 pre-existing problems across untouched files (128 errors, 89 warnings). None introduced by this batch. STATUS.md notes the project carries accepted lint debt; out of scope to chase.
- `npm run build` — blocked by Cowork sandbox virtiofs/mmap limitation (Bus error, core dumped). Known issue per STATUS.md. Marcus runs the Windows build before push.

No new dependencies added.

---

## Out of scope (documented, not touched)

- Supabase-sourced `[founder: write here]` conditional fallbacks (concordance, authors, topics) — Marcus's strict reading.
- Supabase role schema and the real super-admin authoring UI — `useSuperAdmin()` stubbed to `false` as authorized.
- VOTD restructure (Wave 1 follow-on).
- Messianic Prophecies reframe (Wave 4 follow-on).
- Study Trails migration to Featured Pages.
- Apocrypha + extra-biblical ingestion.
- Existing Isaiah Mini-Bible Mirror Diagram (`grid-cols-3`) — pre-existing, not a regression, left as-is.
- `DonateSectionClient.tsx`'s Stripe-based donation block — memory notes MannaFest donation posture is Cash App + Venmo only, no Stripe. Stale file flagged for a separate batch; only the `[founder: …]` placeholder was touched this session.

---

## Files touched (flat list)

New:
- `src/hooks/useSuperAdmin.ts`
- `src/components/EditorialSlot.tsx`
- `src/components/diagrams/ELSMatrix.tsx`
- `src/content/els-demonstrations.ts`

Modified:
- `src/app/layout.tsx` (Hebrew font loader)
- `src/components/diagrams/index.ts` (ELSMatrix export)
- `src/components/nav/MenuOverlay.tsx` (account affordance)
- `src/app/read/[book]/page.tsx` (Fix 1 bug + `BookRow` typing)
- `src/app/study/bible-codes/page.tsx` (full Fix 5 rewrite)
- `src/app/study/seed-promise/page.tsx` (Fix 3 + Fix 4)
- `src/app/study/tabernacle/page.tsx` (Fix 3 × 2)
- `src/app/study/suffering-servant/page.tsx` (Fix 3)
- `src/app/study/messianic-psalms/page.tsx` (Fix 3 × 2)
- `src/app/study/genealogies/page.tsx` (Fix 3)
- `src/app/study/bronze-serpent/page.tsx` (Fix 3)
- `src/app/study/isaiah-mini-bible/IsaiahMiniBibleClient.tsx` (Fix 6)
- `src/app/verse/[book]/[chapter]/[verse]/VerseHeader.tsx` (Fix 3)
- `src/app/verse/[book]/[chapter]/[verse]/OriginalLanguage.tsx` (Fix 3)
- `src/app/verse/[book]/[chapter]/[verse]/CommentaryVoices.tsx` (Fix 3)
- `src/app/person/[slug]/page.tsx` (Fix 3)
- `src/app/about/page.tsx` (Fix 3 × 3 + broken mailto removed)
- `src/app/about/DonateSectionClient.tsx` (Fix 3)

Blocker file (authored pre-resume):
- `ark/batch-d-fix-blocker.md`

Ark updates (this session):
- `ark/03-sessions/session_d_fix_2026-04-21.md` (this file)
- `ark/STATUS.md` (decision log append)
- `ark/BATCH_QUEUE.md` (D.FIX → Shipped)

---

## Acceptance checklist — final state

Production click-through pending Windows push + Vercel deploy:

- [ ] `/read/genesis` → 50 chapter tiles (prompt's `/study/genesis` reinterpreted per blocker resolution)
- [ ] `/read/exodus` → 40 chapter tiles
- [ ] `/read/psalms` → 150 chapter tiles
- [ ] `/read/matthew` → 28 chapter tiles
- [ ] Hamburger menu on mobile shows "Log in" (logged out) and "My account" (logged in, with email shown)
- [ ] `/study/seed-promise` → no `[founder:...]` visible; depth-1 is concept cards, ≤2 scrolls at 375px, no horizontal overflow
- [ ] `/study/bible-codes` → depth 1 shows 5 ELSMatrix demonstrations with Hebrew text; depth 2 framework cards; depth 3 methodology drilldowns
- [ ] `/study/isaiah-mini-bible` → summary header + 4-chip legend at top, "Hebrew Bible Ordering Alignment" section at depth 2, "One Isaiah or Two?" section at depth 2 (four-part structure with Pastor Marc placeholder)
- [ ] All other feature pages with Fix-3 replacements render clean (no visible placeholder leak)
- [ ] Desktop regression: AccountMenu, site header, breadcrumbs unchanged

---

## Notes for future batches

1. **Per-letter highlighting in `ELSMatrix` skip columns** is a follow-on enhancement. The current component shows the anchor verse's first-line Hebrew and describes the skip pattern in prose; actually rendering every Nth character highlighted requires counting through the full letter stream of each book (available data: Masoretic Text JSON). Wave 3 or later, not blocking shipment.

2. **Authored ELS drilldown content.** The depth-3 `<details>` drilldowns render `demo.methodology` and `demo.passageContext` prose authored in `els-demonstrations.ts`. If Marcus wants founder-voice commentary layered on top of the source methodology, that is a separate authoring pass via the eventual Doctrine C Editor's Notes drawer — the content file already carries each demo's `id`, so wiring to an `editorial_notes` table later is one-field.

3. **`useSuperAdmin()`**  currently returns `false` for all users. When the D-admin-schema batch lands, the hook body needs to read `supabase.auth.getUser()` + a `profiles.role === 'super_admin'` lookup (or an `is_super_admin()` SQL function). 22 call sites flip on by that one change.

4. **Authors leaked placeholders.** `src/app/authors/[slug]/page.tsx` renders `{PLACEHOLDER}` as visible italic text to public users when the Supabase `scholars` row is unfilled (lines 190, 206, 258). Left untouched per Marcus's strict-reading decision; future D.FIX.2 or authors-polish batch may revisit.
