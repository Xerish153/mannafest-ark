---
batch: 1.5 — Homepage Launchpad + Donation Demotion
status: HALTED
halted_at: 2026-04-20
halted_by: Cowork (full-write session, Claude Opus 4.7)
resolver: Marcus (Windows-side git cleanup), then Claude for any follow-on
scope_of_this_session: no files written, no branch created, no commits, no pushes
---

# Batch 1.5 — HALT: local `MannaFest` git clone is corrupt

Cowork read the four READ-FIRST docs (`STATUS.md`, `OPERATING_RULES.md`, `BATCH_QUEUE.md`, `MannaFest_Vision_v2_Locked.md` — they live at `C:\Users\marcd\Documents\MannaFest\...`, not under `ark\`; the prompt's paths were off by one folder) and `batch_1-5_homepage_launchpad.md`, then inspected the repo. Before any edits, `git rev-parse HEAD` failed. **No branch was created, no files were edited, no commits were made, no pushes were attempted.** The repo is in the same state as when the batch started.

Halting per OPERATING_RULES §6. The state is too broken to reach the "delete HEAD.lock/index.lock and retry" path the prompt documents — it exceeds that guidance in three distinct ways.

---

## What I found

### 1. `.git/HEAD` is corrupt — null-byte padding

```
$ xxd .git/HEAD
00000000: 7265 663a 2072 6566 732f 6865 6164 732f  ref: refs/heads/
00000010: 6d61 696e 0a00 0000 0000 0000 0000 0000  main............
00000020: 0000 0000 00                             .....
```

The ref line itself is correct (`ref: refs/heads/main\n`) but 17 null bytes follow. `git rev-parse HEAD` → `fatal: Failed to resolve HEAD as a valid ref.`

This is the exact pattern the R1 session log documented as a Cowork-induced artifact during a `git stash drop` incident (ark/03-sessions/2026-04-19-batch-R1.md, "Cowork-side incidents" §2). R1 fixed HEAD once by clean-writing it, but it's re-corrupted now — either a second incident I didn't observe or the Windows-side copy never got a clean-write.

**Why not just fix it myself:** the R1 session log's precedent says this is fixable by a clean write (`printf 'ref: refs/heads/main\n' > .git/HEAD`). I could do that. But §2 and §3 below show the problem is deeper, and fixing only HEAD would leave me staring at an index with 1,900+ entries that include empty-blob shell-typo files. Partial fix = false confidence.

### 2. Three leftover `.lock` files from the R1 stash incident — never cleaned up

```
.git/objects/maintenance.lock
.git/refs/stash.lock
.git/refs/heads/repair/r1-production.lock   ← new since R1 session log
```

R1 session log explicitly flagged the first two and asked Marcus to `rm` them from Windows "before his next `git stash` operation." They're still here three days later. The third one (`repair/r1-production.lock`) is new and suggests the `repair/r1-production` ref lock was never released — likely the Windows-side merge of R1 into `main` was done in a way that left the feature-branch ref locked.

**The batch prompt authorizes deletion of `.git/HEAD.lock` / `.git/index.lock` only.** The three `.lock` files present are sibling-class but not the ones enumerated. I'm not going to extrapolate scope without an explicit OK, especially given the broader corruption.

### 3. The index tracks 1,931 entries, at least 14 of which are shell-typo empty-blob garbage files

```
$ git ls-files --stage | head -5
100644 e69de29bb2d1d6434b8b29ae775ad8c2e48c5391 0	'slug'
100644 e69de29bb2d1d6434b8b29ae775ad8c2e48c5391 0	'strongs_number'
100644 e69de29bb2d1d6434b8b29ae775ad8c2e48c5391 0	([])
100644 e69de29bb2d1d6434b8b29ae775ad8c2e48c5391 0	(d.source
100644 e69de29bb2d1d6434b8b29ae775ad8c2e48c5391 0	(d.target
```

`e69de29bb…` is git's canonical empty-blob SHA. These are 0-byte files that got created by shell-parsing accidents (e.g., an unquoted heredoc or a misredirected `xargs`) and then `git add`-ed — 14 of them are in the index, and another ~30+ sit on disk with names like `,`, `,+`, `,-`, `0)`, `100`, `155`, `155,+`, `([])`, `({,+`, `(null)`, `(d.source`, `(d.target`, `'slug'`, `'strongs_number'`. The working-tree listing at `ls -la MannaFest/ | grep "^- .* 0 "` shows them all.

Why this is a hard blocker for THIS batch specifically: if I branch off main, stage only the Batch 1.5 files with `git add src/...` (file-explicit per OPERATING_RULES §1 no-no-`-A`), and commit, the commit inherits the current index — which contains these 14 typo files staged for addition. My commit would ship those typos into `feature/homepage-launchpad` and, on merge, into `main`. That's a direct violation of the batch scope and a polluted merge.

### 4. Other detritus in `.git/`

- `.git/.MERGE_MSG.swp` (12KB) — orphan Vim swap file
- `.git/.corrupt955774717` (170KB) — looks like a backup of a previously-corrupt index (`DIRC` header, version 2). Windows git's fsmonitor/scheduled maintenance sometimes deposits these; it's harmless but a symptom
- No `.H.*` / `.il*` / `.ic*` / `.HL*` temp files at the moment — those got cleaned at some point since the R1 log mentioned a flurry of them

### 5. The prompt's documentation reference doesn't exist

The prompt says: *"If you hit a Windows lock file, the resolution is documented in ark/STATUS.md under 'Known quirks.' Delete and retry."*

`ark/STATUS.md` does not exist. The ark vault's "Status"-style file is at `MannaFest/STATUS.md` (the repo-root one), and it has no "Known quirks" section. The R1 session log at `ark/03-sessions/2026-04-19-batch-R1.md` is the only place the stash-lock/HEAD-corruption pattern is documented. Worth either (a) adding a "Known quirks" section to `MannaFest/STATUS.md` or (b) updating the reference in future prompts.

---

## What I did NOT do (confirmation nothing is damaged)

- No `git` write commands executed. Not `init`, not `reset`, not `add`, not `commit`, not `stash`, not `gc`, not `checkout`, not `branch`, not `clean`, not `fsck --rewrite`.
- No files created in the MannaFest repo.
- No lock files deleted.
- No edits to `.git/HEAD`, `.git/index`, or any ref.
- No Supabase calls.
- `git status` never completed successfully (it exited 128 before writing).

The only write this session is this blocker file at `ark/batch-1-5-blocker.md` and the task-list annotations in the Cowork harness. Neither touches the MannaFest repo.

---

## Proposed resolution (Marcus, on Windows)

Run these from `C:\Users\marcd\Documents\MannaFest` in PowerShell or Git Bash. All from Windows — do not run the cleanup from Cowork.

### Step 1 — Remove the three lock files

```powershell
Remove-Item .git\objects\maintenance.lock -ErrorAction SilentlyContinue
Remove-Item .git\refs\stash.lock -ErrorAction SilentlyContinue
Remove-Item .git\refs\heads\repair\r1-production.lock -ErrorAction SilentlyContinue
```

### Step 2 — Clean-write `.git/HEAD`

From Git Bash (safest — avoids PowerShell's default UTF-16 BOM):

```bash
printf 'ref: refs/heads/main\n' > .git/HEAD
git rev-parse HEAD    # should now print 96279cc0ce716bcab986cb210b5d78dd25e84d25
```

### Step 3 — Reset the index to match `main` (drops the 14 typo-file entries and every other drift)

```bash
git reset --mixed refs/heads/main
```

`--mixed` is the default: it resets the index to match HEAD (now `main` = 96279cc) without touching working-tree files. After this, the typo files will show up as `??` untracked instead of `A ` staged. That is the correct, safe state.

### Step 4 — Nuke the working-tree typo files

The easiest safe removal — list them first, eyeball the list, then delete:

```bash
git status --short | grep -E '^\?\? ' | grep -vE '^\?\? (src/|scripts/|public/|docs/|ark/|tests/|mhc-data/|sql/|node_modules/|\.next/|\.env|README)' > /tmp/typo-candidates.txt
less /tmp/typo-candidates.txt   # SANITY CHECK before deleting
```

If the list is all junk (single chars, `(null)`, `,`, `({,+`, etc.), delete them:

```bash
cut -c4- /tmp/typo-candidates.txt | xargs -d '\n' rm -v
```

(**Do not `git clean -fdx`** — that would also nuke `.env.local`, the `ark/` submount if any, and anything else `.gitignore` doesn't explicitly protect. The manual rm is safer.)

### Step 5 — Verify clean

```bash
git status --short               # should be empty, or only show files you intended to keep
git rev-parse HEAD               # 96279cc0ce716bcab986cb210b5d78dd25e84d25
git log --oneline -3             # R1 merge commit at HEAD, its parents below it
ls .git/*.lock .git/refs/*.lock 2>/dev/null   # empty
```

### Step 6 — Optional: clean up `.git/` cruft

```bash
Remove-Item .git\.MERGE_MSG.swp -ErrorAction SilentlyContinue
Remove-Item .git\.corrupt955774717 -ErrorAction SilentlyContinue
```

These won't affect git, but they're noise.

### Step 7 — Re-hand the batch to Cowork

Re-run Batch 1.5 in a fresh Cowork session with the same prompt. The batch itself is well-scoped and should take one session. Cowork will branch `feature/homepage-launchpad` off `main` (now a real, resolvable ref), implement the 5-section launchpad, and commit without pushing.

---

## Why I'm not fixing this myself

OPERATING_RULES §6: *"If a batch pauses — blocker, conflict, ambiguity — the resolution happens in Claude, not in Cowork."* Restated in the prompt: *"Do not guess."*

- Steps 1–2 alone are within the spirit of the prompt's "delete lock files and retry" clause — I would do them in isolation if that were the only issue.
- Step 3 (index reset) is a state-modifying git op that isn't listed in OPERATING_RULES §1's "Cowork does NOT" block, but it's also not explicitly authorized. The index has 1,900+ entries and resetting it wholesale without Marcus eyeballing the list first is exactly the kind of "Cowork improvising past a halt" that §6 prohibits.
- Step 4 (bulk `rm` of typo files) requires a human eyeball on the list before deletion — one of those names could be intentional (unlikely given the shapes, but not impossible). Not a Cowork call.

The combined effect is: this is a cleanup chore, not a batch task. One short Marcus-side session → Cowork re-runs 1.5 cleanly.

---

## Estimated time-to-unblock

- Marcus-side cleanup from Windows: **10–15 minutes**, including sanity-checking the typo-file list.
- Batch 1.5 re-run in Cowork: **one session** (~30–60 minutes of Cowork work), single commit on `feature/homepage-launchpad`.

No change needed to `batch_1-5_homepage_launchpad.md`. The prompt itself is sound; it just needs a clean repo to run against.

---

## Batch 1.5 readiness check (done — nothing blocked it except the git state)

For the record, I also did the cheap ahead-of-time checks so Batch 1.5 can start fast once unblocked:

- **Vision v2 §1/§2 mission blurb** for the About section — confirmed the prompt-quoted language matches Vision v2; usable verbatim.
- **Donation handles** — confirmed `@marc_brown11B` (Venmo) and `$MarcusBrownish` (Cash App) are already in `HomeDonate.tsx` on `main` (SHA 96279cc) per the R1 session log; no new env vars needed; just a redesign + relocation.
- **Existing `HomeDonate.tsx`** — exists in both HEAD tree and index; ready to be rewritten.
- **Existing `src/app/page.tsx`** — exists in HEAD at 96279cc with the R1 hero + cross-ref chip + `HomeDonate` layout; will be the starting point for the rewrite.
- **Memory posture still valid** — `project_mannafest_donations.md` (no Stripe, deep links only) still applies. `project_mannafest_next16_bundler.md` (Turbopack is the default; no `--turbopack` flag to worry about) still applies.
- **Routes I'll need to verify** for the 6 tiles on the next run: `/graph`, `/study/isaiah-mini-bible`, `/characters/kings`, `/apologetics`, `/strongs` (canonical path TBD — the batch prompt flags this), VotD permalink. I did not probe these this session because the repo wasn't in a state to branch from. These route checks happen at the top of the re-run session after the branch is cut.

---

## How to resume

When Steps 1–5 above succeed on Windows, ping Cowork with: *"Batch 1.5 repo cleanup done. Re-run `batch_1-5_homepage_launchpad.md`."* No amendment to the prompt needed.

If any of steps 1–5 fail or produce unexpected output, bring the output to Claude, not Cowork — per §6.
