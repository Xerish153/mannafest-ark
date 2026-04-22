# Batch Doctrine D — Checkpoint

**Date:** 2026-04-21
**DRAFT path:** `MannaFest/MannaFest_Vision_v2_Locked.DRAFT.md` (at the code repo root)
**Branch:** `feature/doctrine-d-vision-amendments` on the MannaFest repo — committed locally (sandbox has no GitHub creds). Awaiting Marcus's push from Windows, then diff review.
**File deltas:** Original `MannaFest_Vision_v2_Locked.md` = 494 lines. DRAFT = 564 lines. +70 lines net.

## Diff command for Marcus

```
cd MannaFest
git diff --no-index MannaFest_Vision_v2_Locked.md MannaFest_Vision_v2_Locked.DRAFT.md
```

Or, because the DRAFT is committed on the feature branch while the live file is untouched on that same branch, the equivalent view is:

```
git checkout feature/doctrine-d-vision-amendments
git diff --no-index MannaFest_Vision_v2_Locked.md MannaFest_Vision_v2_Locked.DRAFT.md
```

## 17 discrete changes applied

| # | Amendment | Section | Change |
|---|---|---|---|
| 1 | (all) | Header amendments log | New "Doctrine D" bullet added |
| 2 | D.3 | §3 row 27 | Messianic Prophecies tri-fold taxonomy |
| 3 | D.4 | §3 row 28 | Verse of the Day structure + super-admin queue |
| 4 | D.7 | §3 row 29 | Study Trails retired → Featured Pages |
| 5 | D.8 | §3 row 30 | Apocrypha (15 books, KJV 1611) under `/apocrypha/*` |
| 6 | D.8 | §3 row 31 | Extra-biblical (1 Enoch + Jubilees, R.H. Charles 1913) under `/extra-biblical/*` |
| 7 | D.1 | §4.2 | "Marcus Brown — MannaFest" → "Pastor Marc — MannaFest" + display-name parenthetical |
| 8 | D.1 | §4.3 | "Marcus Brown — MannaFest" → "Pastor Marc — MannaFest" |
| 9 | D.2 | §4.3.5 (new) | Empty-state rendering — no placeholder text to public users |
| 10 | D.3 | §4.6 (new) | Messianic Prophecies — framing and taxonomy |
| 11 | D.4 | §4.7 (new) | Verse of the Day — structure and super-admin queue |
| 12 | D.8 | §4.8 (new) | Apocrypha and extra-biblical texts (three-tier separation) |
| 13 | D.5 | §7.7 | Isaiah Mini-Bible — added-scope block (depth-1 summary header + Hebrew Bible ordering + Two-Isaiahs section) |
| 14 | D.6 | §7.10 (new) | ELS depth-1 invitation rule (special case) |
| 15 | D.7 | §10 | Non-goal bullet: Study Trails retired in favor of Featured Pages |
| 16 | D.7 | §11 | New retirement item: Study Trails migration to `/featured/*` routes |
| 17 | D.2 | §12 | New bullet: Editorial-note placeholders never render to public users |

## One scope question for Marcus

D.1 specifies the Pastor Marc attribution change "in §4.2 and §4.3" — literal scope. Row 23 of the §3 locked-decisions table (added originally by Doctrine A) also contains the string `"Marcus Brown — MannaFest"`:

```
| 23 | Founder-authored commentary notes styled identically to sourced voices, carrying the "Editor" tradition tag and "Marcus Brown — MannaFest" attribution. | Locked |
```

Because D.1's amendment language is strictly scoped to §4.2 and §4.3, row 23 was **left unchanged** in this draft. If you want row 23 to match the new attribution (probably yes, for internal consistency), the one-line fix is:

```diff
-| 23 | Founder-authored commentary notes styled identically to sourced voices, carrying the "Editor" tradition tag and "Marcus Brown — MannaFest" attribution. | Locked |
+| 23 | Founder-authored commentary notes styled identically to sourced voices, carrying the "Editor" tradition tag and "Pastor Marc — MannaFest" attribution. | Locked (amended 2026-04-21) |
```

Tell me in your approval message whether to include that tweak when I overwrite. If silent, I'll apply the literal scope (leave row 23 alone) at Step 5.

## A second minor observation (no action needed, just noting)

§5.4's node-type table lists **`Topic/trial`** (probably a typo for `Topic/trail`). D.7's amendment text says "remove or deprecate any 'Study Trails' node type if listed; if not listed, no change." The literal string "Study Trails" is not listed, so I left the table alone. If the `trial/trail` typo is worth fixing at the same time, say so — otherwise it stays as is.

## Nothing else moved

- No code files touched.
- No schema changes, no `supabase/migrations/` additions.
- `STATUS.md` and `BATCH_QUEUE.md` not yet updated (deferred to Step 6 per the batch prompt, after overwrite).
- No session record yet (Step 7 per the prompt, after Step 5 overwrite).

## Ready for approval — await Marcus diff review
