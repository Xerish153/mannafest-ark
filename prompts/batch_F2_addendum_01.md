---
addendum_for: [[batch_F2_architectural_contested]]
resolves: [[batch-F2-blocker]]
authored: 2026-04-23
author: Claude (in-chat resolution, per OPERATING_RULES §6)
status: RESOLVED — Cowork resumed F2 and shipped 2026-04-23. See [[session_F2_2026-04-23]].
---

# Batch F2 — Addendum 01

**Purpose:** Resolve the six items surfaced in [[batch-F2-blocker]]. Applied 2026-04-23.

## Item 1 — Branch name

**Resolved:** Continue on `feat/batch-F1-typology-threads` (the Wave F branch). No rename.

The F2 prompt header's separate branch name was an inconsistency from drafting. The DELIVERABLES section's instruction — "commit to the F1 branch (same Wave F branch accumulating all three batches)" — is the correct policy. F2 commits land on the Wave F branch; F3 continues; Marcus pushes Wave F as a single push after F3 closes.

## Item 2 — Source-brief filename correction

**Resolved:** Use `_ark/source-briefs/creation-to-new-creation.md` (canonical). F2 prompt's `creation-new-creation.md` reference is corrected here rather than by renaming the on-disk file.

## Item 3 — F2 prompt vault persistence

**Resolved:** During F2's ark-sync step, Cowork persisted:

- `_ark/prompts/batch_F1_typology_threads.md` (already on disk from F1)
- `_ark/prompts/batch_F1_addendum_01.md` (renamed from `F1_addendum_01.md` for naming consistency)
- `_ark/prompts/batch_F2_architectural_contested.md` (persisted this session)
- `_ark/prompts/batch_F2_addendum_01.md` (this file)

F3 prompt and addenda will follow the same naming pattern at F3 close-out.

## Item 4 — Migration slot correction

**Resolved:** F2 used slots 073 and 074.

- `073_seed_feature_pages_F2.sql` — 4 feature_pages rows + 23 sections + 37 drilldowns
- `074_seed_featured_page_refs_F2.sql` — ~78 featured_page_refs rows

F1 consumed 070 (schema) + 071 (F1 feature-page seeds) + 072 (F1 featured_page_refs seeds). F2's 073 + 074 are the next sequential slots.

## Item 5 — Trees ELS citation specifics

**Resolved via pinned citations in the Trees source brief §3.5 and §7. Implementation:**

Three ELS patterns rendered at depth 2 in `ELSIntroduction.tsx`, each with inline source caption:

1. **Torah YHWH skip-49 pattern** — cited as Witztum, Rips, Rosenberg, *Statistical Science* 9(3): 429–438 (1994). Academic citation.
2. **Genesis 1:1 prime-number numerical structures** — cited as Ivan Panin, *Bible Numerics* (early 20th c., PD). Panin 1855–1942 — work is public domain.
3. **"Torah" skip-50 in Genesis / Exodus / Numbers / Deuteronomy** — cited as Panin + ELS replications in the Witztum-Rips-Rosenberg tradition.

Counter-voice rendered as one-sentence card: McKay, Bar-Natan, Bar-Hillel, Kalai — *Statistical Science* 14(2) (1999) — "Solving the Bible Code Puzzle." Surface, do not adjudicate.

**Rambsel (1996) and Satinover (1997) Isaiah 53 "Yeshua" ELS findings deliberately NOT rendered** — still under copyright (Rambsel d. 2007, US copyright until ~2077). Reproduction risk is real. The `els-introduction` drilldown may carry ≤15-word pointer citations only.

## Item 6 — Mazzaroth Albumazar scholarly voice

**Resolved:** Primary scholarly voice for the Albumazar-transmission critique is **Danny Faulkner**, "Is the Gospel in the Stars?" *Answers Research Journal* / *Journal of Creation* (2015). Living creationist astronomer (PhD Indiana 1989, AiG). Cite only, paraphrase — no direct quotes.

Supporting PD-citable sources:

- William D. Olcott, *Star Lore of All Ages* (1911, PD) — neutral transmission-chain survey.
- Bullinger's own footnotes in *The Witness of the Stars* — primary-source evidence of Albumazar dependency, verifiable by any reader.

## Resume procedure — retrospective

1. ✅ Marcus pasted the two briefs into `_ark/source-briefs/trees.md` and `_ark/source-briefs/mazzaroth.md`.
2. ✅ Marcus handed the addendum to Cowork alongside the F2 prompt.
3. ✅ Cowork verified both brief files exist on disk.
4. ✅ Cowork resumed F2 on the F1 branch.
5. ✅ Trees ELS subsection renders the three pinned patterns.
6. ✅ Mazzaroth critical-objections drilldown paraphrases Faulkner (no direct quote).
7. ✅ Migration slots 073 and 074 used.
8. ✅ F2 prompt + addendum persisted to `_ark/prompts/` during F2 ark-sync.

## Blocker recap

F1 and F2 both halted on the same class of issue: source briefs deferred since April 22 per STATUS.md, with the batch prompts explicitly triggering halt when any brief was missing. Both halts resolved cleanly via addendum + brief authoring.

Deferred-brief queue is now empty for Wave F. F3's six briefs (Names, Covenants, Messianic Psalms, Armor, Fruit, Seven Churches) should already exist from Batch C.2's 14-brief pass — verify before F3 fires.

Addendum written 2026-04-23. Resolution shipped same day per [[session_F2_2026-04-23]].
