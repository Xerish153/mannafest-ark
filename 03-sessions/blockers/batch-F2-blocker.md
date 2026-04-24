---
batch: F2 — Wave F Architectural + Contested (4 feature pages)
status: HALTED
halted_at: 2026-04-23
halted_by: Cowork (Full Write mode)
resolver: Claude (per OPERATING_RULES §6)
prompt: [[batch_F2_architectural_contested]] (not yet persisted to `_ark/prompts/` — flagged in ambient ambiguity §2 below)
precedent: [[batch-F1-blocker]] — same class of halt (missing source briefs), same resolution shape
---

# Batch F2 — HALT: two source briefs missing, plus one filename mismatch

Cowork inspected `_ark/source-briefs/` and hit the prompt's top blocker trigger before any code edits. **No branch work, no file edits, no Supabase calls, no vault commits beyond this blocker file.** Repo + ark are in the same state as the end of the F1 session.

## Blocker 1 (primary) — two of four F2 source briefs are absent

Prompt §READ FIRST item 3 requires these four briefs. Actual state:

| Brief expected in prompt           | Present? | Actual file                     |
|-------------------------------------|----------|---------------------------------|
| `_ark/source-briefs/trees.md`       | **MISSING** | —                           |
| `_ark/source-briefs/tabernacle.md`  | ✓        | `tabernacle.md`                 |
| `_ark/source-briefs/mazzaroth.md`   | **MISSING** | —                           |
| `_ark/source-briefs/creation-new-creation.md` | filename mismatch (see Blocker 2) | `creation-to-new-creation.md` |

Both missing briefs were flagged as *"deferred"* in `STATUS.md`'s April 22 Batch 3 decision-log entry: *"Pending: Taw / Trees / Mazzaroth source briefs missing (deferred)."* Taw was resolved in [[F1_addendum_01]]. Trees and Mazzaroth were never resolved — they come due now.

These are not optional pages for F2:

- **Trees** is the §7.2 worked example the vision locks (three-tree arc, ELS introduction subsection per §7.10). The ELS subsection alone requires source-citation specificity (Witztum-Rips-Rosenberg 1994 *Statistical Science*; McKay et al. rebuttal; Rambsel dating) that only a brief can lock.
- **Mazzaroth** is explicitly called out in the F2 prompt as *"the most interpretively contested page on the site"* with §4.5 both-sides discipline. Getting Bullinger / Seiss / Josephus / Midrash sourcing right per constellation without a brief is guesswork.

Authoring either page's framing mid-batch violates OPERATING_RULES §3's "no AI-authored theological or historical claims" non-negotiable.

**Recommended resolution: A — author both briefs in Claude, then resume.** Same path as F1 Taw. Each brief is ≈180–250 lines mirroring [[source-briefs/scarlet-thread]] and [[source-briefs/taw]] shape. Trees needs ELS-subsection sub-spec with named demonstration patterns + source citations; Mazzaroth needs per-constellation reading primacy (Bullinger vs. Seiss where they diverge) + critical-objection list.

**Alternative paths (less preferred):**

- **B — split F2 into F2a (Tabernacle + Creation) and F2b (Trees + Mazzaroth).** Ship F2a now using the extant briefs; hold F2b until Trees + Mazzaroth briefs land. Cost: breaks Wave F's single-push discipline (F1 + F2 + F3 accumulating on one branch). Also leaves the ELS introduction deferred, which the Vision §7.10 specifically scheduled for F2.
- **C — ship F2 with Trees and Mazzaroth stubs carrying "under construction" banners.** Not recommended; Marcus's graph-demotion pattern (memory `project_mannafest_graph_demotion.md`) established that under-construction content is footer-link-only, not live-route-with-banner.

## Blocker 2 (filename normalization, not a halt on its own) — `creation-new-creation.md` vs `creation-to-new-creation.md`

Prompt path: `_ark/source-briefs/creation-new-creation.md`
Actual file: `_ark/source-briefs/creation-to-new-creation.md`

Same class of mismatch as F1's `genealogies-of-christ` vs `genealogies`. F1 resolved via rename-in-resume; F2 can do the same, or the addendum can simply state which canonical name wins. Proposal: keep the existing `creation-to-new-creation.md` (it's more explicit), update the prompt reference in the addendum. Zero blocker risk on its own.

## Ambient ambiguities (flag for the resolver)

### §1 — feature branch continuity

F1 is code-complete and committed to (intended for) `feat/batch-F1-typology-threads`. The F2 prompt says branch `feat/batch-F2-architectural-contested`, but the prompt's DELIVERABLES section also says *"commit to the F1 branch (same Wave F branch accumulating all three batches), accumulate."* These disagree on branch name. Proposal: confirm in addendum — "one branch across Wave F, keep `feat/batch-F1-typology-threads` as the Wave branch, don't create a separate F2 branch." Matches the single-push discipline.

### §2 — F2 prompt not yet persisted to the vault

Like F1's original prompt, the F2 batch prompt was pasted into chat rather than dropped into `_ark/prompts/`. The blocker above uses `[[batch_F2_architectural_contested]]` as the expected vault filename. When the addendum lands, the prompt should be persisted the same way I persisted F1's (`_ark/prompts/batch_F1_typology_threads.md` + `_ark/prompts/F1_addendum_01.md`) so WikiLinks resolve across sessions.

### §3 — migration slot numbering

F1 consumed slots 070 (schema), 071 (feature_pages seed), 072 (featured_page_refs seed). F2's prompt says *"No schema changes expected (F1 established the schema)"* — so F2 only needs a `073_seed_feature_pages_F2.sql` + `074_seed_featured_page_refs_F2.sql` (or one combined migration). No collision risk; flagging only so the addendum can confirm "use 073 for the F2 seed."

### §4 — Trees ELS subsection source-citation pre-work

The F2 prompt enumerates three required ELS demonstration patterns (Torah YHWH skip-sequence, Isaiah 53 ELS grid, Genesis 1:1 prime-number patterns) with specific source-citation discipline. One concern worth noting for the brief authoring:

- **Genesis 1:1 prime-number patterns** — the classic "7 words × 28 letters × 37 prime" observations trace to various sources (Panin 1923, later popularized by Missler). Panin is PD; Missler is living-author cite-only. The brief should name the specific Panin or equivalent PD work rather than leave "original publication for the prime-number patterns" unresolved.
- **Isaiah 53 ELS** — the Rambsel work is in print and contemporary; Rambsel is living-author (Yacov Rambsel, d. 2007 — check whether his works are PD by date-of-death jurisdiction). The prompt's aside *"cite Rambsel's PD-adjacent status carefully; prefer Witztum-Rips-Rosenberg for Isaiah too where their work covered it"* reads correctly as hedge — Rambsel isn't clearly PD yet, so Witztum-Rips-Rosenberg is the safer citation if they covered Isa 53. The brief should pin this down or trigger the ELS-source-unresolvable blocker explicitly.

These are authoring concerns for the Trees brief itself, not for Cowork. Flagging so the Claude authoring session anticipates them.

### §5 — Mazzaroth Albumazar dependency

The F2 prompt's Mazzaroth depth-2 §5 explicitly requires surfacing *"the late-source dependencies of Bullinger's/Seiss's readings on Albumazar's Sphera Barbarica (medieval Islamic astronomy, not ancient Hebrew tradition)."* This is the page's most load-bearing critical objection. The brief should pin:

- whether the Albumazar critique is surfaced as Bullinger's and Seiss's own acknowledgment (internal concession) or as a modern critical-scholarship objection brought from outside
- what scholarly voice supplies the critique (Edward Hitchcock 1850s? More recent critical readers?)

Without that pinned, Cowork will have to decide mid-batch, which is exactly the improvise-past-halt pattern OPERATING_RULES §6 forbids.

## What I did before halting

1. Read the F2 prompt.
2. Listed `_ark/source-briefs/` — immediately confirmed trees + mazzaroth missing, noticed creation filename mismatch.
3. Wrote this blocker.

No edits outside this file. No branch creation. No Supabase calls. F1's completed work at the end of the last session is unchanged.

## Resume procedure

Resolution addendum should cover:

1. **Trees source brief** — author in Claude, mirror scarlet-thread.md shape + add §7.10 ELS-subsection spec with pinned source citations per ambient §4.
2. **Mazzaroth source brief** — author in Claude, mirror scarlet-thread.md shape + pin per-constellation primacy (Bullinger vs. Seiss) + name the Albumazar-dependency critique owner per ambient §5.
3. **Creation filename** — keep `creation-to-new-creation.md` as canonical; update prompt path in addendum.
4. **Branch name** — confirm Wave F continues on `feat/batch-F1-typology-threads` (single branch across F1 + F2 + F3 per the prompt's own DELIVERABLES language).
5. **Migration slots** — use `073_seed_feature_pages_F2.sql` + `074_seed_featured_page_refs_F2.sql` (or one combined migration).
6. **Optional** — persist the F2 prompt to `_ark/prompts/batch_F2_architectural_contested.md` + the addendum to `_ark/prompts/F2_addendum_01.md` as part of F2's resume, matching the F1 hygiene pattern.

Estimated time-to-green once addendum lands: two to three Cowork sessions for F2 (similar to F1). This batch is interpretively heavier (§4.5 both-sides discipline on Mazzaroth, §7.10 ELS subsection, Project 314 Mercy Seat handling) so even with briefs in hand the content discipline is the rate-limiter, not the code.

## WikiLinks

- [[batch_F2_architectural_contested]] — governing batch prompt (not yet persisted to `_ark/prompts/`)
- [[batch-F1-blocker]] — format precedent + same halt class
- [[F1_addendum_01]] — resolution precedent (authored the missing Taw brief in Claude, Cowork resumed)
- [[session_F1_2026-04-23]] — preceding session, establishes Wave F branch state
- [[STATUS]] · [[OPERATING_RULES]] · [[BATCH_QUEUE]]
- [[source-briefs/tabernacle]] · [[source-briefs/creation-to-new-creation]] — the two F2 briefs that DO exist
