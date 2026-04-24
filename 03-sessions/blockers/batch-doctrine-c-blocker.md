# Blocker — Batch Doctrine C (Founder Editorial Voice Everywhere)

**Date:** 2026-04-21 (late evening, second attempt)
**Session:** Cowork run of `batch_doctrine_c_founder_voice_everywhere.md`
**Halted at:** Step 3 (Diff-verify) after Step 2 (Copy into place) wrote NUL bytes to the canonical path.

## Summary

NUL-byte mount corruption — the same class of issue STATUS.md already documents for this exact filename — has spread from `C:\Users\marcd\Downloads\MannaFest\MannaFest_Vision_v2_Locked.md` to `/mnt/uploads/MannaFest_Vision_v2_Locked.md` mid-session. Cowork can no longer read the staged bytes from anywhere reachable in the sandbox, and cannot reliably write them either. No commit was made. No branch was created. Main is untouched. The on-disk file at the canonical path in the code repo may now be NUL-corrupt from both sandbox and Windows views; Marcus should restore with `git checkout HEAD -- MannaFest_Vision_v2_Locked.md` on Windows before retrying.

## What step I was on

Step 3 — diff-verify the Doctrine C amendments in the landed file after Step 2 copied the staged source into the code repo. Step 1 (verify staged source) passed against the first-session `Read`/`Grep` views of `/mnt/uploads/MannaFest_Vision_v2_Locked.md`; Step 2 `cp` completed without error.

## What I tried

1. **Verified staged source via `Read` and `Grep`** against `/mnt/uploads/MannaFest_Vision_v2_Locked.md`. All nine Step 1 checks passed (first line, last line, "Doctrine C (Founder Editorial Voice Everywhere)" in amendments log, §3 row 26, §4.3 heading, §4.3.1, §4.3.4, §12 bullet). Content was clearly correct at that point.
2. **Copied staged → canonical** with `cp /mnt/uploads/... /mnt/MannaFest/MannaFest_Vision_v2_Locked.md`. Exit 0. Sizes matched at 37680 bytes on both. md5sum returned identical hashes.
3. **Diff-verify via `Grep` of canonical path** — zero matches for every pattern (`Doctrine C`, `| 19 |`, `| 26 |`, `### 4.3`, etc.). Clearly wrong.
4. **`xxd` of canonical path** — 37680 bytes of `00`. All NUL.
5. **`cat` of canonical path** — `wc -c` 37680, `head -c 80 | xxd` all NUL.
6. **`Read` tool on canonical path** — reported "1 line," visually a long run of whitespace.
7. **md5sum sanity check** — `md5sum` returned `8f0a7c77e8c040c201d5183d0b94d2cd` for both `/uploads` and canonical. I initially took this as "byte-identical transfer succeeded." **It wasn't** — `python -c "hashlib.md5(b'\x00' * 37680).hexdigest()"` returns the exact same hash. Both files were 37680 NULs. The "matching md5" was a false positive.
8. **Re-read `/uploads`** with Python `read()`, `mmap`, `O_DIRECT`, and `posix_fadvise(POSIX_FADV_DONTNEED)`. All returned all-NUL for the first 80 / 200 / 4096 bytes. Every syscall path the sandbox exposes serves NULs for `/mnt/uploads/MannaFest_Vision_v2_Locked.md` now.
9. **`Read` tool with offset=100 on `/uploads`** — returned "the file exists but is shorter than the provided offset (100). The file has 1 lines." Confirming the upload mount is also returning the NUL-run as a single no-newline "line."
10. **Probed other paths** — small fresh writes to `/mnt/MannaFest/_mount_probe.txt` (17 bytes) and `/mnt/ark/_mount_probe.txt` (19 bytes) round-tripped cleanly via `cat`/`xxd`. The corruption is file-scoped to `MannaFest_Vision_v2_Locked.md`, not mount-wide.
11. **Healed `.git/HEAD`** (separately) — it had 33 trailing NULs at session start (`ref: refs/heads/main\n` + 32 `\0`). Rewrote to canonical 21 bytes. Git plumbing is fully healthy. `git log` confirms `main = 4e87873`.
12. **git hash-object on `/uploads`** — produced blob `495521e52e696ae5535c7b7b54b1d35102d61578`. `git cat-file blob` on it returned all whitespace (NULs rendered). This blob is **orphaned** — never added to a tree, never referenced from any ref, will be gc'd. It does NOT represent what the batch staged.

## What I expected

- `cp` copies real Doctrine C bytes into `/mnt/MannaFest/MannaFest_Vision_v2_Locked.md`.
- Re-reads return real content.
- Diff-verify passes, feature branch gets committed, merge to main succeeds.

## What actually happened

- The `/mnt/uploads/MannaFest_Vision_v2_Locked.md` mount became NUL-serving some time between the initial verification reads and the post-copy re-reads.
- Every subsequent read of both paths returns 37680 NULs.
- The `cp` almost certainly wrote 37680 NULs to disk at the canonical path (sandbox view and probably Windows view too).
- `md5sum`-matches-so-copy-worked was a false signal — both endpoints were equally zeroed.
- I have no reachable source of the real Doctrine C bytes. The `Read` snapshots from earlier in the session are partial (lines 1–30, 55–75, 321–400, 407–494) and not a reliable basis for reconstructing a 494-line file.

## Why this is a hard halt

- Cannot read the staged content → cannot commit it.
- Proceeding would commit 37680 NUL bytes to `main` under the Doctrine C merge commit. That is strictly worse than halting.
- This is within the failure mode STATUS.md §"Cowork per-path mount staleness" already names for this exact filename. It's not a new class of bug.

## Collateral damage / state on Windows

- `/mnt/MannaFest/MannaFest_Vision_v2_Locked.md` (= `C:\Users\marcd\Downloads\MannaFest\MannaFest_Vision_v2_Locked.md`) was overwritten by `cp` during Step 2. From the sandbox view it is 37680 NULs. Whether Windows sees NULs or still sees the pre-session 30298-byte blob is mount-dependent and Marcus needs to check directly.
- **Marcus, on Windows, before doing anything else:** `git -C C:\Users\marcd\Downloads\MannaFest checkout HEAD -- MannaFest_Vision_v2_Locked.md`. That rewrites the working tree from blob `494df8d0ec3b85af603b9e5f595fbdfdeed33f55` (the pre-Doctrine-C, post-Doctrine-B version at HEAD = `4e87873`). Then `git status` should be clean.
- `/mnt/MannaFest/_mount_probe.txt` (17 bytes, content `probe 1776798017`) was left behind — sandbox `rm`/`unlink` both returned EPERM on it. Marcus should delete it on Windows: `Remove-Item C:\Users\marcd\Downloads\MannaFest\_mount_probe.txt`.
- `.git/HEAD` was healed from NUL-padded to canonical `ref: refs/heads/main\n`. This is a repair, not damage.
- Orphan blob `495521e52e696ae5535c7b7b54b1d35102d61578` sits in `.git/objects/49/5521e52e696ae5535c7b7b54b1d35102d61578`. Unreferenced; `git gc` clears it. Safe to ignore.
- No feature branch was created. No commit was authored. No merge happened. Main is exactly `4e87873` (Repo cleanup) where this session started. No force-pushes, no ref updates.

## Recommended path forward

The staging-path bypass in STATUS.md points at the vault mount (`_ark\_staging\{filename}`) as the read-fresh source, precisely because `/mnt/uploads` and the code-repo canonical path have both exhibited this NUL corruption before. This attempt routed through `/mnt/uploads` instead and hit the same quirk on that mount.

For the next attempt, one of these should work reliably:

1. **Vault-mount staging (per STATUS resolution pattern).** Place `MannaFest_Vision_v2_Locked.md` at `C:\Users\marcd\Documents\MannaFest\ark\_ark_staging\MannaFest_Vision_v2_Locked.md` **on Windows**, then start a **fresh** Cowork session (mounts snapshot at session start — per STATUS "If a Cowork batch requires a freshly-uploaded file, start a new Cowork session first"). The batch is already written to route through that path. This is the documented-working pattern.
2. **Inline the Doctrine C delta in the batch prompt itself.** Skip the file-mount round entirely — paste the full new `MannaFest_Vision_v2_Locked.md` contents into the batch prompt as a heredoc Cowork writes via the `Write` tool (no cp, no staging file). `Write` goes through a different write path than shell `cp` and has not shown this corruption mode.
3. **Commit from Windows.** If the file is small enough to paste, Marcus does the commit directly on Windows and Cowork's role on this batch is only ark sync + merge. But at 37k bytes this is marginal.

Option 2 is probably the fastest safe path given how persistently this specific filename has been corrupted on mount.

## Nothing else to do here

Per batch prompt: halted. Did not improvise past this point.

**WikiLinks:** [[batch_doctrine_c_founder_voice_everywhere]], [[MannaFest_Vision_v2_Locked]], [[doctrine_session_b_feature_page_three_depth]]
