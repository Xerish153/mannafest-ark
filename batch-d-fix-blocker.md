# Batch D.FIX — Blocker Report

**Filed:** 2026-04-21
**Batch:** D.FIX (Mobile UX Pass + Doctrine D Implementation)
**Status:** HALTED before any code changes. No commits. No file edits. Ark writes only (this file).
**Triggered by:** OPERATING_RULES §6 + batch prompt "IF YOU HIT A BLOCKER" clause.

Six fixes were specified. During the ground-truth investigation (no edits made) three of the six surfaced a blocker or ambiguity that cannot be resolved without a scope clarification from Marcus. The other three are executable as written. Rather than partial-land, halt cleanly per rule §6 so the amended prompt can cover everything.

---

## Blocker 1 — Fix 1 — Route mismatch (`/study/genesis` is not a real route)

### Problem

Prompt states:
> "Marcus's mobile screenshot of `/study/genesis` shows 34 chapters in the chapter grid."
> "Verification: `/study/genesis` renders exactly 50 chapter tiles."
> "Spot-check 5 more books: Psalms (150), Matthew (28), John (21), Revelation (22), 1 Samuel (31)"

Ground truth:
- `src/app/study/` contains only feature-page slugs (`bible-codes`, `seed-promise`, `bronze-serpent`, `genealogies`, `isaiah-mini-bible`, `messianic-psalms`, `suffering-servant`, `tabernacle`). **There is no `[book]` dynamic segment under `/study/`.** A hit on `/study/genesis` returns 404.
- The chapter grid lives at `src/app/read/[book]/page.tsx`. The actual production URL for the Genesis chapter grid is `https://mannafest.faith/read/genesis`, not `/study/genesis`.
- No `next.config.ts` rewrite or redirect maps `/study/:book` → `/read/:book`.

### Root cause of the actual chapter-count bug (confirmed on read)

The bug in `src/app/read/[book]/page.tsx` is real and clean:

```tsx
// lines 62-76
const { data: verses } = await supabase
  .from("verses")
  .select("chapter_num")
  .eq("book_id", book.id)
  .eq("translation_id", 1)
  .order("chapter_num");

chapters = Array.from(
  new Set(verses?.map((v) => v.chapter_num) || [])
).sort((a, b) => a - b);
```

PostgREST's Supabase client caps unrestricted queries at **1000 rows by default**. Genesis has 1,533 KJV verses; the first 1000 (ordered by `chapter_num`) cover chapters 1–34 (Gen 1 has 31 verses, cumulatively reaching ~1000 at the Gen 34 boundary). Exodus has 1,213 verses; first 1000 reaches ~chapter 35. **The 34/35 screenshot matches this limit exactly.** Books with ≤1000 verses (most NT books, shorter OT books) render correctly.

Batch 3.7's canonical audit confirmed zero gaps in the `verses` table across all 66 books / 1,189 chapters / 31,102 verses. The UI is the bug, not the data.

### Proposed resolutions

**Option A (recommended) — Path interpretation + code fix.** Treat prompt's `/study/genesis` as Marcus-shorthand for the actual chapter-grid route `/read/genesis`. Fix the bug in `src/app/read/[book]/page.tsx` by switching from "fetch all verses, dedupe chapter_num" to "fetch max chapter_num, generate 1..N". Single-row query, zero risk of the 1000-limit bite. Verification URLs become `/read/genesis`, `/read/exodus`, `/read/psalms`, `/read/matthew`, `/read/john`, `/read/revelation`, `/read/1sa`.

Fix shape:
```tsx
const { data: topVerse } = await supabase
  .from("verses")
  .select("chapter_num")
  .eq("book_id", book.id)
  .eq("translation_id", 1)
  .order("chapter_num", { ascending: false })
  .limit(1)
  .single();

const maxChapter = topVerse?.chapter_num ?? 0;
chapters = Array.from({ length: maxChapter }, (_, i) => i + 1);
```

Assumes contiguous chapters 1..N, which Batch 3.7's audit confirmed for every book.

**Option B — Path interpretation + range-based fix.** Same interpretation, but bypass the 1000-row limit with `.range(0, 9999)` on the existing query. Works, but wasteful (Psalms 2,461-verse scan just to dedupe to 150 chapters).

**Option C — Create `/study/[book]` route (reject).** Would duplicate `/read/[book]`, violate the singular-routes principle in the non-negotiables, and the AGENTS.md `routes.md` convention. No.

**Tradeoff:** Option A is strictly smaller and faster than B. Both produce identical output given the 3.7 audit. Recommend A.

### What I need from Marcus

Confirm **Option A**: fix the bug at `src/app/read/[book]/page.tsx`, and amend the acceptance checklist's URLs from `/study/genesis` → `/read/genesis` (and siblings). Or pick B, or tell me why C.

---

## Blocker 2 — Fix 3 — Supabase-sourced placeholders out of scope?

### Problem

Fix 3 says to zero out every `[founder: write here]` placeholder visible to public users. Investigation surfaces **17 occurrences** across 19 files. Three classes:

**Class 1 — Hardcoded strings in TSX files** (straightforward):
- `src/app/study/seed-promise/page.tsx:133`
- `src/app/study/bible-codes/page.tsx:442`
- `src/app/study/tabernacle/page.tsx:550, 658`
- `src/app/study/suffering-servant/page.tsx:249`
- `src/app/study/messianic-psalms/page.tsx:621, 766`
- `src/app/study/genealogies/page.tsx:135`
- `src/app/study/bronze-serpent/page.tsx:131`
- `src/app/verse/[book]/[chapter]/[verse]/VerseHeader.tsx:108`
- `src/app/verse/[book]/[chapter]/[verse]/OriginalLanguage.tsx:50-52`
- `src/app/verse/[book]/[chapter]/[verse]/CommentaryVoices.tsx:82`
- `src/app/person/[slug]/page.tsx:105`
- `src/app/about/page.tsx:46-48, 87-88, 135, 138`
- `src/app/about/DonateSectionClient.tsx:17-18`

These are clearly in Doctrine D.2 scope — replace with "render nothing for public, affordance for super-admin" pattern, stub `useSuperAdmin()` returning `false` until the admin schema batch lands. Executable.

**Class 2 — Supabase-fetched content with existing fallback pattern** (ambiguous scope):
- `src/app/concordance/[number]/page.tsx:222-224` — checks `entry.theological_significance.trim() === "[founder: write here]"` and renders an alternate muted state
- `src/app/authors/[slug]/page.tsx:51-53` — defines `isPlaceholder(s)` and skips rendering on hit
- `src/app/authors/page.tsx:100` — conditional styling when `a.one_line_description === "[founder: write here]"`
- `src/app/topics/[slug]/page.tsx:36` — `const PLACEHOLDER = "[founder: write here]"` constant

In each of these, the code **already does not render the raw `[founder: write here]` string to public users** — it renders an alternate muted fallback ("Theological significance not yet recorded," etc.). So are these in Fix 3's scope?

Two readings:
- (a) **Strict:** "zero `[founder:...]` placeholders visible to public users" — already satisfied for these files; they fall out of scope. The current fallback is compliant.
- (b) **Doctrine-literal:** Doctrine D.2 says empty editorial slots must render *nothing* for public users (not even an alternate muted fallback). Under this reading, the existing "not yet recorded" fallbacks also need to collapse to null + optional admin affordance.

**Class 3 — Configuration-style placeholder constants** (same ambiguity as Class 2): `PLACEHOLDER`, `isPlaceholder()` helpers in `topics/[slug]` and `authors/[slug]`. Keep? Rewire to the new affordance?

### Proposed resolutions

**Option A (recommended) — Strict reading.** Treat Class 1 as in scope; skip Class 2 and Class 3 as compliant (they already don't surface the placeholder). Grep output post-batch will still show hits for Class 2/3 source code but `rg` on production HTML would return zero. Fastest path, smallest blast radius.

**Option B — Doctrine-literal sweep.** Also rewire Class 2 and Class 3 to the D.2 pattern (render nothing + admin "+ Add" affordance). Touches commerce-light pages (authors index, concordance detail) outside the original page audit. Higher risk of regression. Requires a design call on whether muted "not recorded" text is acceptable as the non-authed fallback.

### What I need from Marcus

Confirm Option A (Class 1 only) or B (full sweep). Verse-page placeholders (`VerseHeader.tsx`, `OriginalLanguage.tsx`, `CommentaryVoices.tsx`) and about-page placeholders are both Class 1 and therefore in scope either way — just confirming the boundary at Class 2/3.

---

## Blocker 3 — Fix 5 — ELS Hebrew text + skip-position data sourcing (HARD)

### Problem

Fix 5 depth-1 rebuild requires three matrix demonstrations:

1. "Torah YHWH 50-letter skip — Genesis 1, showing the skip sequence of Hebrew characters spelling YHWH at every 50th letter."
2. "Isaiah 53 Yeshua 20-letter skip — the classic ELS demonstration."
3. "Genesis 1:1 prime-number analysis (Haralick / Panin) — numerical grid showing the seven-based numerical patterns."

Each matrix requires:
- Actual Hebrew characters (sequence of 50+ unicode Hebrew codepoints for #1 and #2)
- Actual highlight indices (the specific character positions where YHWH / Yeshua appear when skipping 50 / 20)
- Accurate numerical counts for #3 (gematria sums, word counts, letter counts divisible by 7)

This is factual-claim data. The constraint block applies:
> "No AI-authored historical or theological claims. AI synthesizes cited human sources only. Every substantive claim traces to a cited source."

I cannot fabricate Hebrew text nor calculate skip positions without a verified source text + a verified reference implementation. Doing so risks publishing inaccurate ELS demonstrations that misrepresent the scholarly record Marcus is trying to steelman.

The repo has no Hebrew text dataset. No Westminster Leningrad Codex, no Codex Aleppo, no Sefaria JSON import. `layout.tsx` loads only `Source_Serif_4` (latin subset). Hebrew font rendering is not wired up (prompt authorizes adding Noto Serif Hebrew — that part is fine).

### Proposed resolutions

**Option A (recommended) — Build framework, mark data as placeholder.** Ship the full `<ELSMatrix />` component, the font addition, the depth-2 restructure (moving prose to cited cards), the depth-3 preservation, and the content file `src/content/els-demonstrations.ts`. Populate the content file with `// TODO:` comments naming the exact data needed and a single short Hebrew sample (drawn from a cited public-domain source I name, e.g., Genesis 1:1 from the Leningrad Codex via Sefaria CC-BY-SA dataset, six words, no ELS claim). Depth-1 renders one working matrix (Gen 1:1 gematria — I can source the classical Bullinger / Panin numerical facts safely) plus two placeholder cards that say "Demonstration pending source import — [citation target]."

Matches the same pattern Fix 6 uses for the Pastor Marc note. Preserves scholarship bar. Ships depth-1 with real content (not vaporware), just not all three slots filled.

**Option B — Pause Fix 5 depth-1; ship depth-2/3 restructure only.** Move the scholarly prose from depth 1 → depth 2 per prompt spec. Leave depth 1 with a "Demonstrations coming — data curation in progress" notice and no matrices. Then a follow-up batch sources the Hebrew text and the specific ELS claims from Witztum-Rips-Rosenberg 1994 and Haralick's papers, populates the content file, and fills the depth-1 grid.

**Option C — Marcus provides source-verified data now.** Marcus hands over (a) a Hebrew text source URL/citation he trusts, and (b) the specific skip findings he wants demonstrated (pattern name + skip value + highlight positions as indices, OR the source table he wants me to transcribe verbatim). I then build with that data in-hand.

### What I need from Marcus

Pick A, B, or C. Under A I ship most of Fix 5 with one real matrix + two placeholders. Under B I ship the restructure only, Fix 5 depth-1 lands in a follow-up. Under C I need the data.

---

## Minor / non-blocking observations (documented for the amended prompt)

**ELS page route.** Prompt says `/study/els`; actual route is `/study/bible-codes` (confirmed: metadata title `"Bible Codes / ELS — MannaFest"`). Executable either way — I use `/study/bible-codes`. Amend the acceptance checklist URL.

**No existing super-admin hook.** No `useIsAdmin` / `useSuperAdmin` / `isAdmin` pattern anywhere in `src/`. Prompt authorizes stubbing — I'd add `src/hooks/useSuperAdmin.ts` returning `false` with a `// TODO: wire to Supabase role once D-admin-schema batch lands` comment. No blocker.

**Auth state pattern.** `src/hooks/useSupabaseSession.ts` exists and is used by `AccountMenu.tsx`. This is the canonical pattern to reuse in the hamburger menu for Fix 2. No blocker.

**Hebrew font.** Currently zero Hebrew fonts loaded. Prompt explicitly authorizes adding one — I'd add `Noto Serif Hebrew` to the existing `next/font/google` block in `src/app/layout.tsx` with a `--font-hebrew` variable. No blocker.

**Kings of Israel and Judah reference.** Exists at `src/app/characters/kings/page.tsx` with a `KingsTimelineClient` component. Usable as the mobile layout reference for Fix 4.

**Batch size.** All six fixes + integration check + session record is on the larger end of a single-batch scope. If the amended prompt keeps everything in one batch that is workable; if Marcus prefers to split off Fix 5 (the hardest) into D.FIX.2, that's cleaner.

---

## Recommended amended prompt (short form)

If Marcus approves the recommended options above, the smallest amendment to the original Batch D.FIX that unblocks execution is:

1. **Fix 1:** Replace `/study/{book}` with `/read/{book}` in the problem statement and acceptance URLs. Name the root cause as the PostgREST 1000-row default limit. Specify max-chapter query as the fix shape.
2. **Fix 3:** Restrict scope to Class 1 (hardcoded placeholders in TSX). Class 2/3 out of scope (already rendering fallback).
3. **Fix 5:** Pick A, B, or C for depth-1 data. If A, authorize the one-working-matrix + two-placeholder-cards shape and name the Gen 1:1 gematria source (Bullinger, *Number in Scripture* or Panin's tables — both public domain).
4. **Fix 5:** Change URL from `/study/els` → `/study/bible-codes`.
5. **Fix 2, 4, 6, 7, session record:** no change.

With those five clarifications I can execute end-to-end without further halts.

---

## No work done under this halt

- Zero file edits to `src/` (read-only)
- Zero migrations applied
- Zero commits or pushes
- Zero ark writes beyond this file
- No feature branch created
- `STATUS.md` not updated — awaiting batch resume or cancellation

Feature branch `feature/batch-d-fix-mobile-pass` NOT created; will be created on resume.
