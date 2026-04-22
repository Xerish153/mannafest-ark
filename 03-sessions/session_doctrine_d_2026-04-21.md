# Session — 2026-04-21 — Doctrine D (Consolidated Vision Amendments)

**Cowork session running Doctrine D.** Docs-only batch. Eight coordinated amendments applied to [[Vision_v2_Locked]] in a single pass, halted at Step 4 for Marcus's `git diff --no-index` review, then resumed on approval to overwrite and close out.

## Order of work

1. Read [[STATUS]], [[OPERATING_RULES]], [[BATCH_QUEUE]], and the full `MannaFest_Vision_v2_Locked.md` from the code repo root. Confirmed no drift since the Batch 3.7 close-out that landed earlier this session.

2. **Step 1 — Create DRAFT.** Copied live Vision v2 to `MannaFest_Vision_v2_Locked.DRAFT.md` at the code repo root so the pre-amendment text stayed diff-able against the post-amendment draft. Mount-staleness mitigation as specified by the batch prompt.

3. **Step 2 — Apply the eight amendments** to the DRAFT via targeted `Edit` tool calls. Every amendment applied cleanly against the existing doctrine — no conflicts hit the blocker pipeline. Changes:
   - **D.1 Pastor Marc attribution.** Two string replacements — §4.2 "Founder-authored notes" bullet and §4.3 "Editorial notes are authored only by the founder" bullet — `"Marcus Brown — MannaFest"` → `"Pastor Marc — MannaFest"`. §4.2 also gained the parenthetical "(the founder's super-admin display name site-wide)" to codify the display-name-equals-attribution identity the amendment establishes.
   - **D.2 Empty-state rendering.** §4.3.5 new subsection + §12 new bullet. Public users see nothing where notes don't exist; super-admin sees affordances.
   - **D.3 Messianic Prophecies tri-fold taxonomy.** §4.6 new subsection + §3 row 27. Retires any fulfillment-percentage meter in favor of Fulfilled in First Coming / Awaiting Second Coming / Progressively Fulfilled.
   - **D.4 Verse of the Day spec.** §4.7 new subsection + §3 row 28. VOTD reframed as a jumping-off point: Verse → Reflection → Commentary highlights → Connection points. Pastor Marc authors reflections in advance through `/admin/verse-of-the-day` queue; scholar-quote fallback kicks in on days without a founder reflection. Schema adds `votd_reflections` table (spec only — implementation is its own batch).
   - **D.5 Isaiah Mini-Bible added scope.** §7.7 "Isaiah as Mini-Bible" block gains an "Added scope (Doctrine D, 2026-04-21)" sub-block with three elements: depth-1 summary header, Hebrew Bible ordering argument at depth 2, and Two-Isaiahs section at depth 2 anchored in Jesus' John 12:38–41 citation of both Isaiah 53:1 and Isaiah 6:10 as from a single prophet.
   - **D.6 ELS depth-1 invitation rule.** §7.10 new subsection. Data-first page: visual demos of ≥3 ELS findings, source-data captions, no paragraph-length scholarly defense at depth 1, scholarly debate lives at depth 2/3. Kings of Israel and Judah named as the mobile/layout exemplar.
   - **D.7 Study Trails retirement.** §3 row 29 + §10 non-goal bullet + §11 retirement item. `/study/*` trail routes retire; content migrates to `/featured/*` Featured Pages with redirects preserving inbound links.
   - **D.8 Apocrypha + extra-biblical scope.** §4.8 new subsection + §3 rows 30 and 31. Three-tier separation: Tier 1 canonical 66 (default surface, no label), Tier 2 Apocrypha (15 books, KJV 1611, `/apocrypha/*`, Academic tradition chip), Tier 3 extra-biblical (1 Enoch + Jubilees, R.H. Charles 1913, `/extra-biblical/*`, explicit non-canonical header, Jude 1:14–15 surfaced as reason for inclusion).
   - **Amendments log.** New bullet added at the top of the document under `> **Amendments:**`.

4. **Step 3 — Grep verification.** Confirmed all added sections (§4.3.5, §4.6, §4.7, §4.8, §7.10) present, all added §3 rows (27–31) present, both D.1 attribution replacements landed in §4.2 and §4.3, §10 non-goal and §11 retirement items landed, §12 bullet landed. File grew from 494 lines (live) to 564 lines (DRAFT). +70 net.

5. **Step 4 — Halt + checkpoint.** Wrote [[batch-doctrine-d-checkpoint]] with the 17-change table, diff command, and two scope questions flagged for Marcus:
   - Whether §3 row 23 (which also contains `"Marcus Brown — MannaFest"`) should be updated for internal consistency — D.1's amendment language literally scoped to §4.2 and §4.3 only.
   - Whether the `Topic/trial` typo in §5.4 should be fixed at the same time — D.7 says "if not listed, no change" and `"Study Trails"` is not the literal string in the table.
   Committed the DRAFT on MannaFest `feature/doctrine-d-vision-amendments` at `32e1b83`; committed the checkpoint on ark `feature/doctrine-d-vision-amendments` at `919d03c`. Reported to Marcus and stopped.

6. **Marcus approved with "Proceed with overwrite"** and did not answer either scope question. Per the checkpoint's stated default ("If silent, I'll apply the literal scope"), resumed at Step 5 with row 23 and §5.4 unchanged.

7. **Step 5 — Overwrite.** Copied the DRAFT contents over the live `MannaFest_Vision_v2_Locked.md`. `rm` of the DRAFT failed under the virtiofs mount (known Cowork limitation), so `mv` it out of the way to `.DRAFT.removed.md` and truncated to 0 bytes. Committed on the same feature branch with exactly the message `docs: Doctrine D consolidated amendments (D.1-D.8)` — commit `8594820`. The commit shows `2 files changed, 72 insertions(+), 566 deletions(-)` because git records the DRAFT removal alongside the live-file update; net working-tree growth of the Vision file is +70 lines, same as the DRAFT delta. A 0-byte `.DRAFT.removed.md` remains untracked on the repo root; Marcus can delete it from Windows.

8. **Step 6 — STATUS and BATCH_QUEUE updates.** Decision-log entry appended to `ark/STATUS.md` with the commits and the two resolved scope questions named explicitly so the log reads honestly. `BATCH_QUEUE.md` gains the shipped entry under the Shipped archive, plus a new "Doctrine D follow-on work — queued, prompts not yet authored" subsection surfacing the four downstream work streams (VOTD schema, Messianic Prophecies reframe, Study Trails migration, Apocrypha + extra-biblical ingestion) at their natural wave-slot without authoring the full prompts. Both files are gitignored as "live trackers" per the April 20 vault reconciliation commit, so the updates exist on disk but don't land in git history.

9. **Step 7 — Session record.** This file.

## What shipped to production

Nothing shipped to production. Docs-only batch. No code files touched, no schema changes, no Supabase writes, no `supabase/migrations/` additions. Live Vision v2 changes land on `main` only after Marcus pushes the feature branch from Windows and merges.

## Decisions captured

- **D.1–D.8 all applied as specified.** No conflicts hit the blocker pipeline; the batch ran straight through.
- **§3 row 23 left unchanged.** Literal scope of D.1 did not cover §3. Flagged for Marcus in the checkpoint; Marcus's silence on approval resolved to the literal-scope default. If this feels wrong later, the one-line fix is in the checkpoint.
- **§5.4 `Topic/trial` typo left unchanged.** D.7's "if not listed, no change" language applied literally. Same silence → literal-scope resolution.

## Two files Marcus touches on Windows

1. `cd MannaFest && git push -u origin feature/doctrine-d-vision-amendments` — then merge into `main` with `--no-ff`. The two commits on the branch are `32e1b83` (DRAFT for review) and `8594820` (overwrite). After merge, `MannaFest_Vision_v2_Locked.md` on main carries the eight amendments.
2. Delete `.DRAFT.removed.md` from the repo root on Windows — the 0-byte remnant of the virtiofs rm failure.

Separately in the vault: `cd ark && git push -u origin feature/doctrine-d-vision-amendments` pushes the checkpoint commit (`919d03c`). The session record + STATUS + BATCH_QUEUE updates are the second vault commit landing in this session (SHA set in the close-out).

## Wikilinks

[[Vision_v2_Locked]] · [[STATUS]] · [[BATCH_QUEUE]] · [[OPERATING_RULES]] · [[batch-doctrine-d-checkpoint]] · [[session_3.7_2026-04-21]] (sibling same-day batch) · [[doctrine_session_a_commentary_curation]] (Doctrine A, the amendment D.1 modifies) · [[session_doctrine_b_2026-04-21]] (Doctrine B, §7 structure D.5 and D.6 build on)
