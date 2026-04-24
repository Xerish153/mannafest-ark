# Batch 3.5 — Blocker: auto-promote threshold

**Filed:** 2026-04-20, during Batch 3.5 Phase 1 execution.
**Blocks:** Applying the auto-promote pass for `is_significant_verse`. Everything else in items 1–5 shipped on `feature/graph-redesign-phase-1`.

## The conflict

The batch prompt's §2 auto-promote rule says:

> **Auto-promotion rule:** any verse that already has ≥5 outgoing edges auto-promotes to significant.

The batch prompt's §3 halt rule says:

> Target: 3,000–6,000 rows. If the count is >10,000 or <500, halt and report — the tiering logic has a bug or the data differs from what the design spec assumed.

The two rules collide on this repo's actual graph density. Applying the ≥5 rule to the current data produces a count far past the halt threshold:

| Threshold | Verses flagged | Projected `public_nodes` |
|---|---:|---:|
| ≥ 5 edges (prompt spec) | 28,645 | ~30,143 |
| ≥ 20 | 22,359 | ~23,857 |
| ≥ 50 |  9,938 | ~11,436 |
| ≥ 100|  1,942 | ~3,440 |

(Tier 2 content nodes contribute the other 1,498 to the total; 128 explicit significant verses are already flagged.)

## Why the data is denser than the spec assumed

`graph_nodes` has 32,605 rows and `graph_edges` has 1,302,311. Average outgoing edges per verse ≈ 40. Edge density came from the Batch 0/1 cross-reference seed pass — cheap, plentiful, and not curated. `≥5 outgoing` catches essentially every verse in the Bible.

The design intent of the auto-promote rule was to catch a few heavily-cross-referenced verses missed by the famous-list. Given the actual density, it catches almost all of them.

## What I shipped anyway (per the prompt's "halt only on blockers")

- Migration 037: `tier`, `is_significant_verse`, `is_key_word` columns + indexes
- Migration 038: tier populated by type (1,498 Tier 2, 31,107 Tier 4, rest 0)
- Migration 039: 128 explicit significant verses flagged (the full starter list, 0 misses)
- Migration 040: Strong's-number seed — no-op because 0 word/strongs/lemma nodes exist (0 matches, 40 misses logged in audit). This IS also the prompt's second blocker case ("Strong's numbers don't exist as separate nodes") — treating it as a log-and-continue per the item 2 text ("log misses, don't invent") and flagging here for visibility.
- Migration 041: `public_nodes` view now enforces tiering; count = **1,626** (above 500 halt threshold, below 3,000 target)
- Graph renderer overhaul: testament-tone colors, shape-per-type, tier + log sizing, settled physics (alpha-decay 0.03, velocity-decay 0.4, link strength 0.3, charge -30, pause on settle, reheat on interact), region-label backdrop
- Audit file: `ark/batch-3-5-audit.md`
- Session record: `ark/03-sessions/2026-04-20-batch-3-5.md`
- `STATUS.md` decision-log entry

`npx tsc --noEmit`: 0 errors. `npx eslint` on touched files: 0 errors. `npm run build` not run in the Cowork sandbox (known virtiofs/mmap limit — Marcus runs the build on Windows before pushing).

## What Marcus needs to decide

**Pick the auto-promote threshold.** Recommended: **≥100 outgoing edges**. That lands the total at ~3,440 (inside the 3,000–6,000 target), preserves the heavily-cross-referenced famous verses, and still feels like "meaningfully connected" under the current edge taxonomy.

Once the threshold is picked, the resolution is a single UPDATE against `graph_nodes`. No new migration needed — the column is already populated; we just widen the flag set. Example for ≥100:

```sql
UPDATE graph_nodes n
SET is_significant_verse = true
WHERE n.type = 'verse'
  AND n.is_significant_verse = false
  AND n.id IN (
    SELECT source_node_id
    FROM graph_edges
    GROUP BY source_node_id
    HAVING COUNT(*) >= 100
  );
```

After applying, re-count `public_nodes` and verify it lands in [3,000, 6,000]. Then the branch is ready to review.

## Secondary (related) items for Marcus

- **Strong's nodes.** 0 rows of type word/strongs/lemma exist. Tier 5 is empty. Either create those nodes in a future batch (ingesting from `strongs_entries`), or accept Tier 5 being dark until the key-Greek-and-Hebrew Batch content pass.
- **Chapter nodes.** 0 rows of type chapter exist. Tier 3 is empty. Design spec §5 anchors region labels to chapter centroids — Phase 1 falls back to "centroid of all visible book-associated nodes." Works but coarser.
- **Feature_page nodes.** 0 rows. Tier 1 is empty until Batch 11 writes feature pages.

None of these block Phase 1 acceptance — they're noted so Phase 2 / Batches 11/12 inherit them correctly.

## Resume instruction

Bring the chosen threshold to Claude. Claude applies the UPDATE, re-verifies count, updates the audit file, appends to the session record. Then the branch is ready for Marcus to push + merge.

## Operating-rules check

- [x] No DELETE against `graph_nodes` or `graph_edges`
- [x] No destructive Supabase operations
- [x] File-explicit git add only (plumbing workaround used — see session record)
- [x] No `npm run lint --fix` after commit
- [x] No push attempted
- [x] Non-negotiables honored: single audience, open-source, 2D, desktop-first, KJV/WEB/ASV, graph never navigates, ≥3-edge rule forward-looking
- [x] Halt protocol followed: blocker file written; Cowork does not improvise past the halt
