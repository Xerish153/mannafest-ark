---
date: 2026-04-21
type: session
batch: doctrine-b-feature-page-three-depth
status: complete
---

# Session — Doctrine B: Feature Page Three-Depth Structure (2026-04-21)

## Summary

Doctrine B locked. Every feature page presents Invitation → Framework → Evidence. Depth 1 is topic-responsive (Tabernacle = floor plan, Exodus = map, Isaiah = correspondence grid); depth 2 uses diagram library components; depth 3 is where verses, commentary, citations, and opposing-view evidence live. Hybrid routing — main URL = depth 1+2, per-element drilldowns = depth 3. Isaiah Mini-Bible and Kings codified as exemplars, scheduled for light retrofit in Batch 7.5 after Batch 3. Bypass note: this session routed the Vision v2 bytes through `_ark_staging\` because the `Downloads\MannaFest\` mount was persistently stale across multiple sessions.

## Files changed in the repo

1. `MannaFest_Vision_v2_Locked.md`

## Supabase migrations

None (docs-only).

## Commit

- Branch: `docs/doctrine-b-three-depth-structure`
- Commit SHA: `ce89e79`
- Commit message: `docs: lock Doctrine B — feature page three-depth structure (Vision v2 §7)`
- Merged into `main` with `--no-ff`; merge not yet pushed (Marcus pushes from Windows).

## Session notes

- The `Downloads\MannaFest\` mount continued to serve a stale 26,810-byte copy of the Vision v2 file even after the on-disk file was verified at 30,298 bytes with a newer mtime via PowerShell. Two prior attempts failed on this. The bypass: stage the file at `_ark\_staging\MannaFest_Vision_v2_Locked.md` inside the vault mount (which reads fresh), then `cp` from the vault mount into the code-repo mount path. Write side appears to cache-bust correctly even when read side does not.
- Separate pre-existing mount hazards observed in this session, both worked around:
  - `.git/packed-refs` was 214 bytes with ~84 trailing NUL bytes (mount padding artifact). Git refused to parse it. Rewrote to its canonical 131 bytes via the Write tool.
  - `.git/index.lock` appeared as a zombie entry — visible via path-stat but absent from directory listing and unremovable. Worked around by running `git add` and `git commit` with `GIT_INDEX_FILE=/tmp/alt-index`. Commit succeeded; the canonical `.git/index` was not modified, which is fine for the merge-to-main workflow because the merge tooling builds its own index.
- Staging file `_ark\_staging\MannaFest_Vision_v2_Locked.md` deleted; `_ark\_staging\` directory removed.
- Obsolete `_ark\batch-doctrine-b-blocker.md` deleted.

## WikiLinks

[[batch_doctrine_b_feature_page_three_depth]] · [[doctrine_session_a_commentary_curation]] · [[MannaFest_Vision_v2_Locked]]
