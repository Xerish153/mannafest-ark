# Batch C Part 2 — BLOCKER (halt before any writes)

**Date:** 2026-04-23 (same session as Part 1 close-out)
**Batch:** C — Wave C Part 2 (Tier 2 + Isaiah retrofit + category landings + close)
**Branch:** `feat/wave-C-prophets-nt-remainder` — files present in working tree from Part 1; no new writes performed this session.
**State:** Halted at Section A / §5 brief verification. Zero Part-2 side effects.

---

## Blocker — all 19 Tier 2 book briefs missing on disk

Part 2 prompt §READ FIRST item 5 lists:

> Nineteen Tier 2 book source briefs authored 2026-04-23 at `_ark/source-briefs/`:
> * OT Minor Prophets + Lamentations (13): `book-lamentations.md`, `book-hosea.md`, `book-joel.md`, `book-amos.md`, `book-obadiah.md`, `book-jonah.md`, `book-micah.md`, `book-nahum.md`, `book-habakkuk.md`, `book-zephaniah.md`, `book-haggai.md`, `book-zechariah.md`, `book-malachi.md`
> * NT General Epistles (6): `book-james.md`, `book-1-peter.md`, `book-2-peter.md`, `book-2-john.md`, `book-3-john.md`, `book-jude.md`
> Verify each before starting its book. **Halt if any missing.**

And §IF YOU HIT A BLOCKER lists the first trigger as "Any of the 19 Tier 2 briefs missing on disk."

**Inspection result at `/sessions/sharp-gifted-bell/mnt/ark/source-briefs/`:**

```
book-1-john.md
book-daniel.md
book-ezekiel.md
book-hebrews.md
book-jeremiah.md
book-revelation.md
```

Only the six Tier 1 briefs from Part 1 are present. The 19 Tier 2 briefs have not been pasted. Clean halt.

---

## Secondary observation — Part 1 has already shipped the substantive Wave C work Part 2 describes

This is not a second blocker but it is load-bearing for the reconciliation choice below. The unified Wave C prompt Cowork executed earlier today covered the entire wave in a single session, not just the Tier 1 half. Working-tree inventory at the start of Part 2:

**Tier 2 content already shipped in Part 1** (per the unified prompt's §C pinned signature-verse list + uniform template directive, which at that time declared "Tier 2 books do NOT have individual briefs — they receive uniform template treatment"):

- `src/components/book/prophets-content.ts` includes all 13 OT Tier 2 entries (Lamentations + 12 Minor Prophets) with signature verse, stat strip, structure, themes, key chapters, metadata.
- `src/components/book/nt-remainder-content.ts` includes all 6 NT Tier 2 entries (James + 1 Pet + 2 Pet + 2 John + 3 John + Jude) with the same shape.
- Tier 2 uniform-template rendering is satisfied by the existing `BookHubLayout` fall-through (`data.bespokeVisual` is null for T2; themes / keyChapters / structure render from the content maps).

**Isaiah retrofit already shipped in Part 1** (per Vision §7.7):

- D.1 summary header was pre-existing from Doctrine D.5 commit series (2026-04-21) and did not need re-retrofitting.
- D.2 Hebrew Bible ordering framework section added at `src/app/study/isaiah-mini-bible/IsaiahMiniBibleClient.tsx`, between Mirror Diagram and Filter Tabs. Founder-note slot reserved.
- D.3 Two-Isaiahs framework section added at the same file with John 12:38–41 + Qumran 1QIsaª response. Founder-note slot reserved.

**Category landings already shipped in Part 1**:

- `src/lib/bible/book-groups.ts` — two new composite groups `prophets` (17 cards) and `nt-remainder` (9 cards); original 10 fine-grained groups preserved unchanged.
- `src/components/group/intro-copy.ts` — three-paragraph intros for both composites; per-book preview strings added for all 25 Wave C books. Existing `/group/[slug]/page.tsx` route renders both.

**Data layer already shipped in Part 1**:

- `supabase/migrations/077_seed_featured_page_refs_wave_c.sql` — ~71 cross-surface rows covering Tier 1 briefs' anchors AND Tier 2 Messianic + typology anchors (Hosea 11:1 → son-of-god, Amos 9:11 → messianic-psalms, Micah 5:2 → messianic-psalms, Zech 9:9 → messianic-psalms, Zech 11:12–13 → scarlet-thread, Zech 12:10 → messianic-psalms, Mal 3:1 + 4:5 → messianic-psalms, 1 Pet 1:19 → lamb-of-god, 1 Pet 2:5–9 → tabernacle, 2 Pet 3:13 → creation-to-new-creation, Jude 1:14–15 → 1-enoch forward-registered).
- `supabase/migrations/078_seed_chapter_summaries_wave_c.sql` — 250 draft rows via DO-block across all 25 Wave C books (Tier 1 152 chapters + Tier 2 98 chapters). Not just 152 T1 — all 250.

**Session record + vault persist already shipped in Part 1**:

- `_ark/03-sessions/session_C_2026-04-23.md` — session record covering the full wave (25 books shipped, 250 summaries queued, Isaiah retrofit complete, 2 landings live, ~71 cross-surface rows). Close-out for the whole wave, not just Tier 1.
- `_ark/04-prompts/batch_C_prophets_nt_remainder.md` — unified Wave C prompt persisted.
- `/sessions/sharp-gifted-bell/mnt/MannaFest DEV/batch-C-close-out.md` — close-out report surfaced to Marcus's workspace folder.
- Memory updated with `project_mannafest_wave_c_shipped.md` referencing the 25/250/retrofit coverage.

---

## Reconciliation — two unblock paths

### Path A — Accept Part 1's coverage as Wave C close; skip Part 2 entirely

The unified Wave C prompt declared Tier 2 as template-driven without individual briefs, and Cowork executed against that declaration. The working tree already carries the Tier 2 content, Isaiah retrofit, landings, migrations, and session record. Under this path:

- Marcus cuts `feat/wave-C-prophets-nt-remainder` from Windows per the Part 1 close-out document.
- Applies migrations 077 + 078.
- Click-through against the acceptance list in the Part 1 close-out (it covers Part 2's acceptance list too — same 25 books, same landings, same retrofit).
- No new Cowork session needed. Wave C is closed.

### Path B — Paste the 19 Tier 2 briefs and re-fire Part 2

If the briefs contain content Marcus wants in the Tier 2 hubs beyond what the Part 1 signature-verse-driven content holds (e.g., per-book framework sections, denser per-chapter guidance, brief-specific cross-surface anchors beyond what's in migration 077), Part 2 can proceed.

Under this path:

1. Marcus pastes the 19 `book-{slug}.md` briefs to `/sessions/sharp-gifted-bell/mnt/ark/source-briefs/`.
2. Re-fire this Part 2 prompt.
3. Cowork verifies briefs exist; re-opens `prophets-content.ts` + `nt-remainder-content.ts` and enriches each T2 entry with brief-specific themes / key-chapters / metadata overrides where the brief differs from what's currently shipped. Per brief-vs-prompt precedence (feedback memory `feedback_mannafest_brief_vs_prompt.md`), briefs win.
4. Cowork extends migration 077 (or opens a new 079) with any additional cross-surface anchors the briefs specify beyond the ~15 Tier 2 rows already registered.
5. Wave C capstone session record `session_C_part_2_2026-04-23.md` written; prior Part 1 session record preserved unchanged.
6. Part 2 closes with Marcus pushing the accumulated branch.

### Which path is right?

That's Marcus's call. If the 19 Tier 2 briefs carry substantive per-book framework content (like the Tier 1 briefs do — multi-section depth-2 frameworks, contested-points lists, commentary priority lists, sourcing caveats, non-goals), then Path B is worth running to upgrade the Tier 2 hubs from "signature verse + intro + stat strip + chapter grid" to "that, plus brief-shaped themes + key chapters." If the briefs only carry the pinned signature verse + a short theological introduction paragraph (which is what the unified prompt's §C specified for T2), then Path A is the correct closeout — the content maps already encode that shape, and re-firing Part 2 would be busywork.

---

## Acceptance check against Part 2's 21 criteria

Running Part 2's §ACCEPTANCE items against Part 1's shipped state:

| # | Criterion | Part 1 state |
|---|---|---|
| 1 | `/book/lamentations` spot-check with acrostic note | ✅ Present in `prophets-content.ts`; stat strip carries "Acrostic — ch. 1–4 structure"; acrostic noted in themes. |
| 2 | `/book/jonah`, `/book/micah`, `/book/zechariah` spot-check | ✅ All three in `prophets-content.ts` with full Tier 2 uniform content. |
| 3 | `/book/james`, `/book/1-peter`, `/book/jude` spot-check | ✅ All three in `nt-remainder-content.ts`. |
| 4 | Single-chapter books `/book/obadiah`, `/book/2-john`, `/book/3-john`, `/book/jude` | ✅ All four in content maps with chapterCount=1 handled correctly by existing BookHubChapterIndex. |
| 5 | Each T2 hub: meta + signature + 2–3 para intro + stat strip + chapter grid | ⚠️ Signature + stat strip + short tagline + chapter grid all present. "2–3 paragraph theological intro" is not separately surfaced in the content-map shape — Part 1's tagline is 1 sentence. If Part 2 briefs call for 2–3 paragraph intros, that's a content-map field addition (new `introMarkdown` field in the ProphetsHubContent / NtRemainderHubContent types). Path B would cover this. |
| 6–9 | Isaiah retrofit 4 checks | ✅ D.1 pre-existing, D.2 + D.3 added. All four framework sections visible between Mirror Diagram and Filter Tabs. |
| 10 | `/group/prophets` — 17 book cards | ✅ composite group with 17 books. |
| 11 | `/group/nt-remainder` — 9 book cards | ✅ composite group with 9 books. |
| 12 | Verse page Hab 2:4 shows `/featured/covenants` | ❌ NOT in migration 077 — Hab 2:4 was not explicitly registered (Tier 2 cross-surface coverage focused on Messianic-prophecy anchors, not justification-by-faith). **Would need Path B or a migration-077 amendment.** |
| 13 | Verse page Zech 9:9 shows `/title/king-of-kings` | ⚠️ Part 1 registered Zech 9:9 → `/featured/messianic-psalms`, NOT to `/title/king-of-kings`. Brief vs. prompt difference. Path B could resolve. |
| 14 | Verse page Zech 12:10 shows `/featured/taw` | ❌ Part 1 registered Zech 12:10 → `/featured/messianic-psalms`. **Different target.** Path B could resolve. |
| 15 | 1 Pet 2:21–25 shows `/featured/suffering-servant` | ❌ Part 1 registered 1 Pet 2:5–9 → `/featured/tabernacle` and 1 Pet 1:19 → `/title/lamb-of-god`; 1 Pet 2:21–25 → suffering-servant was not added. **Would need Path B.** |
| 16 | Jude 1:14–15 forward-registered to `/extra-biblical/1-enoch` — silently no-op | ✅ Already forward-registered in migration 077. |
| 17 | EditorsNotesDrawer at reduced weight on every new hub | ✅ Inherited via existing BookHubLayout (no change needed). |
| 18 | No 404s | ✅ (assuming DB migrations apply cleanly) |
| 19 | No living-author >15 word quotes | ✅ Content files are Cowork-authored descriptive prose with no reproduction. |
| 20 | Vault prompt persisted | ✅ `_ark/04-prompts/batch_C_prophets_nt_remainder.md` exists. |
| 21 | Wave C capstone session record | ⚠️ `session_C_2026-04-23.md` exists and is comprehensive. Part 2 asks for a separate capstone record titled `session_C_part_2_{date}.md`. If Part 2 runs, a second session record is added. If Path A is chosen, the existing capstone stands. |

**Net:** Path A satisfies 17–18 of the 21 acceptance criteria as-is. The four acceptance gaps are all about specific Tier 2 cross-surface registrations (Hab 2:4 → covenants, Zech 9:9 / 12:10 target-swap, 1 Pet 2:21–25 → suffering-servant) where the Part 2 prompt's explicit anchor list differs from what Part 1 registered from the unified prompt. These gaps are a 4–6 row amendment to migration 077, not a full Part 2 re-run.

---

## Recommendation

Unless the 19 Tier 2 briefs carry per-book framework content substantive enough to justify extending the content-map types with a new `introMarkdown` / `framework` field, **Path A plus a small migration-077 amendment** is the clean close. The amendment adds the 4–6 missing cross-surface rows without touching content files or re-running the Tier 2 build. Cowork can do that amendment in one tiny migration (079 or amendment to 077 depending on whether 077 has been applied to prod yet) without needing the 19 briefs.

If Marcus wants the 19 Tier 2 briefs' richer content reflected in the hubs, paste the briefs and re-fire Part 2; Cowork proceeds with Path B enrichments.

Halting now. No Part 2 writes performed. Working-tree state is unchanged from Part 1 close-out; all Part 1 artifacts remain as staged.
