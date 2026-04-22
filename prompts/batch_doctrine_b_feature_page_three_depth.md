---
batch: doctrine-b-feature-page-three-depth
type: prompt
status: COMPLETE — {deploy timestamp pending Marcus's push to origin + Vercel deploy}
date_locked: 2026-04-21
branch: docs/doctrine-b-three-depth-structure
commit: ce89e79
---

# BATCH — Doctrine B: Feature Page Three-Depth Structure (docs-only, STAGING-PATH BYPASS)

WHY THIS VERSION Previous attempts failed because the mount of C:\Users\marcd\Downloads\MannaFest\MannaFest_Vision_v2_Locked.md is persistently stale in the Cowork sandbox (serves 26810 bytes, mtime 07:14, even after the on-disk file is verified at 30298 bytes with a newer mtime via PowerShell on Windows). Fresh Cowork sessions, re-uploads, and file deletion/re-placement all reproduce the same stale read. The vault mount at C:\Users\marcd\Documents\MannaFest\ark\ is reading fresh content correctly (confirmed via STATUS.md and BATCH_QUEUE.md reads). This batch routes the Vision v2 bytes through the vault mount to bypass the stuck Downloads mount.
READ FIRST

* STATUS.md
* OPERATING_RULES.md
* BATCH_QUEUE.md
* DO NOT read MannaFest_Vision_v2_Locked.md at the code-repo root. That file will be overwritten in step 2 before you read it.
CONSTRAINTS (non-negotiables — do not violate)

* Single audience: the student of the Bible who wants to learn. Judge every feature against "does this deepen a serious student's study?"
* Open-source data only. No licensed content. Guzik's Enduring Word is All Rights Reserved — do not ingest. Public-domain commentators only. Living authors (Missler, Brewer, Huff) cite only.
* No AI-authored historical or theological claims.
* Commentary is curated, not exhaustive. Featured excerpt ≤50 words, attributed, tradition-tagged. "Show other voices" expansion reveals the rest.
* Commentary always attributed; traditions never flattened.
* Debated content gets a page-level notice, not confidence badges.
* 2D graph only. Graph is exploratory, not a pillar. Do not build toward the graph until revival is unlocked in STATUS.
* Every node ships with ≥3 outgoing edges. Nodes with fewer stay in draft status.
* Full-density pages. No Beginner/Study/Deep gating on study-desk pages; feature pages use the three-depth structure in §7.
* KJV / WEB / ASV translations only.
* No audio of any kind. No pastor workspace. No audience-specific pages. No premium tier. No community editing.
* Founder is sole content author for revelation-note-style insight.
* "Shipped" means a production click-through of every affected link returns 200.
GOAL Land the Doctrine B amendment of Vision v2 in the code repo by copying the staged file into place, then record the session. Docs-only. No code, no Supabase, no routes touched.
SCOPE

* Files owned by this batch:
   * C:\Users\marcd\Downloads\MannaFest\MannaFest_Vision_v2_Locked.md (overwrite with staged copy)
   * _ark_staging\MannaFest_Vision_v2_Locked.md (source, deleted at end)
   * _ark\03-sessions\session_doctrine_b_2026-04-21.md (new)
   * _ark\prompts\batch_doctrine_b_feature_page_three_depth.md (new — copy of this prompt)
   * _ark\batch-doctrine-b-blocker.md (delete if exists — obsolete)
* Supabase tables: none
* Routes: none
WORK

1. CLEANUP. Delete the stale blocker file if present: Remove the file _ark\batch-doctrine-b-blocker.md (ignore error if missing).
2. VERIFY THE STAGED SOURCE. Read _ark_staging\MannaFest_Vision_v2_Locked.md and confirm:
   * File exists.
   * Size is exactly 30298 bytes on LF line endings, OR between 30298 and 30700 bytes if CRLF-normalized on Windows.
   * First line starts with "# MannaFest — Vision v2 (Locked Decisions)".
   * File contains the string "## 7. Dedicated Feature Pages — Three-Depth Structure".
   * File contains the string "## 12. Rules for Claude Code Agents".
   * File contains the string "## 13. Closing".
   * File ends with the line "This is the version that ships."
If any check fails, halt and tell Marcus exactly which check failed. Do not write a blocker file. Do not proceed.
3. COPY INTO PLACE. Copy _ark_staging\MannaFest_Vision_v2_Locked.md to C:\Users\marcd\Downloads\MannaFest\MannaFest_Vision_v2_Locked.md, overwriting the existing (stale) file. Use a full-content copy operation, not a mount-dependent symlink.
4. VERIFY THE WRITE. Do NOT re-read the canonical file path for verification (its mount is unreliable). Instead, confirm the copy wrote by checking the staged file's size is preserved and that the copy operation returned success.
5. DIFF-VERIFY THE AMENDMENTS. Read the staged copy (which matches what you just wrote) and confirm all of the following are present. This is the same checklist as the original prompt, run against the known-good bytes:
   * §3 row 25 is present, locking the feature-page three-depth structure (2026-04-21).
   * §5.2 clarifies that Beginner/Study/Deep applies to study-desk pages, not feature pages.
   * §6.5 contains the bullet "Feature pages are the exception — §7 governs."
   * §7 is fully rewritten with subsections 7.1 through 7.9.
   * §9 points at BATCH_QUEUE.md with the revised high-level shape.
   * §12 carries the bullet (verbatim): "Feature pages use the three-depth structure: Invitation / Framework / Evidence. Depth 1 style is topic-responsive but never delivers verse text or citation blocks. Routing is hybrid (main URL = depth 1+2, drilldowns = depth 3). See §7."
   * Header amendment log carries the 2026-04-21 Doctrine B entry.
If any check fails, halt and tell Marcus which one. Do not commit.
6. DELETE THE STAGING FILE. Remove _ark_staging\MannaFest_Vision_v2_Locked.md. If the _ark_staging\ directory is now empty, remove it too.
7. CREATE FEATURE BRANCH. Create docs/doctrine-b-three-depth-structure. Stage the single file change explicitly (no git add -A). Commit with message: docs: lock Doctrine B — feature page three-depth structure (Vision v2 §7)
8. ARK SYNC.
a. Write _ark\03-sessions\session_doctrine_b_2026-04-21.md:
   * One-paragraph summary: Doctrine B locked. Every feature page presents Invitation → Framework → Evidence. Depth 1 is topic-responsive (Tabernacle = floor plan, Exodus = map, Isaiah = correspondence grid); depth 2 uses diagram library components; depth 3 is where verses, commentary, citations, and opposing-view evidence live. Hybrid routing — main URL = depth 1+2, per-element drilldowns = depth 3. Isaiah Mini-Bible and Kings codified as exemplars, scheduled for light retrofit in Batch 7.5 after Batch 3. Bypass note: this session routed the Vision v2 bytes through _ark_staging\ because the Downloads\MannaFest\ mount was persistently stale across multiple sessions.
   * Numbered list of files changed in the repo: 1. MannaFest_Vision_v2_Locked.md
   * Numbered list of Supabase migrations: none (docs-only).
   * WikiLinks: [[batch_doctrine_b_feature_page_three_depth]], [[doctrine_session_a_commentary_curation]], [[MannaFest_Vision_v2_Locked]]
b. Write _ark\prompts\batch_doctrine_b_feature_page_three_depth.md:
   * Paste this full prompt verbatim.
   * Header status line: status: COMPLETE — {deploy timestamp when merge lands on main}
   * WikiLinks at the bottom: [[session_doctrine_b_2026-04-21]], [[MannaFest_Vision_v2_Locked]]
9. BUILD CHECK. Run lint / tsc / build locally in the code repo to confirm the doc change does not break the build pipeline.
10. MERGE TO MAIN. git checkout main git pull --ff-only origin main git merge --no-ff docs/doctrine-b-three-depth-structure -m "merge: Doctrine B — feature page three-depth structure" Do NOT push. Marcus pushes from Windows (sandbox has no GitHub credentials).
11. HANDOFF. After Marcus confirms the push and Vercel deploy, update the prompt file's status line with the real deploy timestamp. Report back with the merge commit SHA and the deploy timestamp. Remind Marcus that STATUS.md and BATCH_QUEUE.md are Claude Project-owned per OPERATING_RULES §9.3 and he re-uploads those manually.
DELIVERABLES

* Updated C:\Users\marcd\Downloads\MannaFest\MannaFest_Vision_v2_Locked.md on main (post-push)
* _ark_staging\MannaFest_Vision_v2_Locked.md removed
* New _ark\03-sessions\session_doctrine_b_2026-04-21.md with minimum 2 WikiLinks
* New _ark\prompts\batch_doctrine_b_feature_page_three_depth.md with minimum 2 WikiLinks and status line
* _ark\batch-doctrine-b-blocker.md removed
* Feature branch docs/doctrine-b-three-depth-structure preserved on origin for one week
ACCEPTANCE (click-through against production)

* Vercel deploy on main is green.
* No page on production renders differently (this batch touches no rendered content).
* Opening the file on main via GitHub shows §7 fully rewritten with subsections 7.1–7.9 and §12 carrying the Doctrine B bullet.
* Ark vault contains the two new files; both pass the §8.2 minimum-2-WikiLinks rule.
* Staging file is gone.
OUT OF SCOPE

* Any code change to feature pages themselves (Batch 7.5).
* Any schema change.
* Any route change.
* Any commentary-curation editor work (Batch 5).
* Any diagram-library work (Batch 3).
* STATUS.md, BATCH_QUEUE.md, OPERATING_RULES.md updates — Claude Project-owned per OPERATING_RULES §9.3.
IF YOU HIT A BLOCKER Write _ark\batch-doctrine-b-blocker-v2.md (note the -v2 suffix to distinguish from the obsolete v1 blocker). Include what step you were on, what you tried, what you expected, and what actually happened. Then halt. Do not improvise.

---

## WikiLinks

[[session_doctrine_b_2026-04-21]] · [[MannaFest_Vision_v2_Locked]]
