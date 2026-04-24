# Batch 20 — Wave D.1 Blocker

**Authored:** 2026-04-23 (session start)
**Section:** A (Setup and verification — never completed)
**Book being processed:** n/a — halted before any writes

## Summary

Cowork cannot execute Batch 20 from this sandbox. The prompt's core operating assumptions — a working local git repo, github push credentials, writer-role Postgres access — are all absent here. Stopping before any writes per OPERATING_RULES §1 and the prompt's blocker protocol.

## Specific blockers

### 1. Git repo is structurally broken at the mount

- `/mnt/MannaFest/.git/HEAD` → `ref: refs/heads/main`, but `refs/heads/main` does not exist locally.
- `/mnt/MannaFest/.git/index` does not exist.
- `/mnt/MannaFest/.git/index.lock` exists as a stale lockfile from a prior crashed git process.
- `git status` reports "No commits yet" with every file untracked, including files that should be tracked at the Wave C merge commit.
- `git log origin/main --oneline -10` does succeed and shows `8fd0873 merge: Wave C recovery — book hubs + migration slug hygiene` at the tip, so the **remote-tracking ref for origin/main is intact**. Wave C is merged. The fault is local.

The sandbox user cannot delete the stale `.git/index.lock` — `rm .git/index.lock` returns `Operation not permitted`. Broader mount check confirms: the /mnt/* mounts allow creation of new files but fail on delete. Git rebuild from within this sandbox is therefore not possible. `git checkout -f origin/main` fails with the lock held.

### 2. No github credentials

`git fetch origin` returns `fatal: could not read Username for 'https://github.com'`. There is no configured credential helper, no SSH key, no PAT. Even if the local repo were healthy, a `git push -u origin feat/wave-D-ot-historical` would fail. The prompt's acceptance criteria ("branch preview deploy", "200 on every affected link") cannot be verified from here.

Marcus confirmed in chat he will push manually — that is fine for the push step, but it does not help the local-repo blocker above.

### 3. No writer-role Postgres access

`$COWORK_WRITER_DATABASE_URL` is not set in the sandbox environment. OPERATING_RULES §1.1 specifies all INSERTs (book_hubs, chapter_pages, chapter_summaries, featured_page_refs, graph_edges) go through `psql $COWORK_WRITER_DATABASE_URL` with the `cowork_writer` role. Without this URL the INSERT steps of Sections B / C / D cannot execute.

Supabase MCP tools are present (read-only use for `list_migrations`, `execute_sql` SELECT coverage queries, etc.), consistent with the Wave 12 posture memo ("MCP dev-only"). But writes through MCP are explicitly disallowed by the prompt and by standing policy.

## What I tried

- `ls -la /mnt/MannaFest/.git/` → confirmed missing index, stale lock, weird empty `.H.s303262374` SMB temp file
- `rm .git/index.lock` → Operation not permitted
- `git checkout -f origin/main` → fails on lock
- `git fetch origin` → no credentials
- `env | grep -iE "(cowork|writer|database|supabase)"` → only `CLAUDE_COWORK_*` vars, no writer URL
- Write-tests on all three mounts (MannaFest, MannaFest DEV, ark) → touch succeeds, rm fails (create-only)

## What I need from Marcus

Ordered by what's gating what:

1. **Repair the /mnt/MannaFest git state from your end.** On Windows: open a terminal in the actual repo, `git status`, clear the stale `.git/index.lock`, `git checkout main`, `git pull`, confirm clean working tree at the Wave C merge commit. Then `git checkout -b feat/wave-D-ot-historical` so the branch exists locally before Cowork touches anything. Alternatively push the empty branch up so it exists on origin too.
2. **Provide `$COWORK_WRITER_DATABASE_URL` to the sandbox.** Either export it in the shell the sandbox inherits, or drop it into a `.env` file the sandbox can source on startup. Without this the prompt's INSERT steps can't run.
3. **Decide whether the mount-permission issue (create-only, no delete) needs fixing separately.** It will bite Cowork later even if (1) and (2) are resolved — any git operation that touches an index or ref file mid-operation will break, and any file rename inside the repo will fail. Likely a Cowork mount config issue rather than a Windows NTFS issue.

## Scope-reality note (separate from blockers)

Independent of the above: Batch 20 as specified — 249 chapters + 12 hubs + 7 bespoke React components + 249 summary drafts + ~100 cross-surface refs + category landing + 15 anchor-verse drilldowns + ark sync — is multi-session work even under ideal conditions. Suggest splitting into D.1a (Tier 1 — 7 books, 151 chapters) and D.1b (Tier 2 + landing — 5 books, 98 chapters, landing), each as its own batch prompt with its own commit budget and session record. Your call.

## Resume protocol

When (1) and (2) above are resolved, a single line from you in chat ("Batch 20 unblocked, resume") is enough. Cowork re-runs Section A from the top (the verification is cheap) and continues to Section B.
