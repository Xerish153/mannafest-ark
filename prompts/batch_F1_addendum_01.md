---
addendum_for: [[batch_F1_typology_threads]]
resolves: [[batch-F1-blocker]]
authored: 2026-04-23
author: Claude (in-chat resolution, per OPERATING_RULES §6)
status: ACTIVE — Cowork may resume F1 after Marcus pastes `_ark/source-briefs/taw.md`
---

# Batch F1 — Addendum 01

**Purpose:** Resolve the four items surfaced in [[batch-F1-blocker]]. Hand this addendum to Cowork alongside the original `batch_F1_typology_threads.md` when resuming. No new branch — continue on `feat/batch-F1-typology-threads` where the blocker halt left off.

**Status:** Resolves blocker. Cowork may resume F1 after Marcus pastes `_ark/source-briefs/taw.md` (delivered separately in this session).

## Item 1 — Taw source brief

**Resolved.** Brief authored and delivered this session. Marcus pastes the content into `_ark/source-briefs/taw.md` before resuming. Cowork proceeds to the Taw page per the original F1 prompt §Page-1 once the file exists on disk.

The brief mirrors the shape and rigor of `scarlet-thread.md` and covers depth-1 visual spec, five depth-2 framework sections, four drilldowns, the verse list for cross-surface registration, commentary tradition priority, sourcing caveats (PD-only with specific citation guidance for Barnabas / Tertullian / Jerome / Rashi / Talmud Shabbat 55a), forward-links, editor's-notes placement, and a named set of contested points for honest surfacing.

## Item 2 — Migration slot renumber

**Resolved.** Use `070_feature_page_infrastructure.sql`, not 068.

Slot 068 is taken by the Jesus Multi-Catalog `jesus_resurrection_appearances` migration from Batch 9. Slot 069 is `jesus_apostolic_figures`. The original F1 prompt was drafted before Wave A's final migration slot accounting — the "or next sequential" hedge in the prompt applies directly here.

If Cowork finds additional slots taken in the 070–075 range at sandbox inspection time, continue sequentially upward. Document the actual slot used in the F1 session record.

## Item 3 — `/study/*` legacy page migration

**Resolved per Vision v2 §10 Doctrine D "Study Trails retired".**

The four slugs with existing `/study/*` content (Bronze Serpent, Genealogies, Seed Promise, Suffering Servant) are legacy trails from the pre-Doctrine-D structure. Vision §10 retired that section:

> Study Trails as a distinct site section is retired. Every existing trail is migrated to a Featured Page using the three-depth structure in §7 … Trails currently live at `/study/*` trail routes; migration targets are `/featured/*` routes. Redirects preserve inbound links.

### Execution rules for F1

1. **Do not lift-and-shift.** The old `/study/*` trails do not meet Doctrine B's depth-1 invitation rule (§7.3) and were written before the tradition-tag / Doctrine-A commentary spec. Build the new `/featured/*` pages fresh from the source briefs.
2. **Delete the old page files as part of this batch:** `src/app/study/bronze-serpent/page.tsx`, `src/app/study/genealogies/page.tsx`, `src/app/study/seed-promise/page.tsx`, `src/app/study/suffering-servant/page.tsx` (and any co-located layout / loading / component files that only serve those routes). If any shared component lives under `src/components/study/*` and is exclusively consumed by these four routes, delete it too. If it's shared with non-migrated `/study/*` routes (the other three legacy trails — tabernacle / isaiah-mini-bible / messianic-psalms / bible-codes stay at `/study/*` for now until their own F-wave batch ships), leave the shared component in place and only delete the route file.
3. **Add permanent redirects via `next.config.js` `redirects()` or an equivalent middleware rule.** Four redirects:
   - `/study/bronze-serpent` → `/featured/bronze-serpent` (permanent, 308)
   - `/study/genealogies` → `/featured/genealogies-of-christ` (permanent, 308 — note the slug rename)
   - `/study/seed-promise` → `/featured/seed-promise` (permanent, 308)
   - `/study/suffering-servant` → `/featured/suffering-servant` (permanent, 308)
4. **Check for inbound links to the old slugs in the codebase before deleting.** Grep for `/study/bronze-serpent`, `/study/genealogies`, `/study/seed-promise`, `/study/suffering-servant`. Any internal link referencing an old slug gets updated to the new `/featured/*` slug in the same commit. External inbound links are caught by the redirects.

### Out of scope for F1

Migration of the remaining `/study/*` pages (tabernacle, isaiah-mini-bible, messianic-psalms, bible-codes). Tabernacle and Messianic Psalms migrate in F2 and F3 respectively; Isaiah Mini-Bible's §7.7 light retrofit is Batch 18 per BATCH_QUEUE; bible-codes is the informal ELS page that gets absorbed into the Trees feature page's ELS subsection in F2.

## Item 4 — Scarlet Thread depth-1 visual — brief wins

**Resolved.** The source brief's depth-1 spec ("bento grid with scarlet ribbon connector, Yom Kippur tile 2× size, scarlet-to-white gradient") supersedes the F1 prompt's language ("eight-thread vertical visual").

Source briefs are authoritative on depth-1 visual spec, because briefs are authored with more context than the batch prompts that consume them. When brief and prompt disagree on visual specifics, default to the brief. When the brief is silent and the prompt specifies, follow the prompt.

**Implementation note:** the bento-grid visual will not use the F1 `<ThreadTimeline />` primitive directly. Cowork composes a page-specific bento layout using Batch 3 diagram-library primitives and Tailwind grid utilities, with the scarlet ribbon connector rendered as an SVG overlay. The Yoma 39b tile at 2× visual weight is the scarlet-thread page's equivalent of the "hinge moment" at depth 1 — the student's eye lands there first.

## Item 5 (informational — not a blocker) — BATCH_QUEUE drift

**Acknowledged.** The live `BATCH_QUEUE.md` still reflects the pre-Wave-F structure (pair-based 12F–17F). It should be reconciled to the F1 / F2 / F3 consolidation. Not a halt; fold into F1's ark sync session record as a note, and Marcus updates the Claude-Project-pinned BATCH_QUEUE after F1 merges. If the reconciliation is easier post-F3 (so the whole Wave F shows as a single structural repack in one update), defer to the post-F3 close-out. Either sequence is acceptable.

## Resume procedure

1. Marcus pastes `taw.md` content into `_ark/source-briefs/taw.md`.
2. Marcus hands this addendum (`F1_addendum_01.md`) to Cowork alongside the original F1 prompt.
3. Cowork verifies `_ark/source-briefs/taw.md` now exists.
4. Cowork resumes F1 from the preamble step (shared primitives first). No prior work to unwind — the halt was before any code edits.
5. When Cowork reaches the Scarlet Thread page, it defers to the brief's bento-grid spec.
6. When Cowork reaches the `/study/*` deletion + redirect step (for Bronze Serpent, Genealogies, Seed Promise, Suffering Servant), it applies Item 3's procedure.
7. Migration file is named `070_feature_page_infrastructure.sql` (or next sequential if 070 is also taken at inspection time).

---

Addendum written 2026-04-23

Authored in Claude in response to [[batch-F1-blocker]]. Applies Doctrine-C editorial discipline (in-chat resolution of interpretive questions before execution). Cowork does not improvise past the halt — it resumes with the specified addendum or not at all (OPERATING_RULES §6).
