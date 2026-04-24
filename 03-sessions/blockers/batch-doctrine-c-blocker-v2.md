---
batch: Doctrine C — Founder Editorial Voice Everywhere (INLINE-WRITE EDITION)
attempt: v2 (inline-write strategy)
status: HALTED — pre-flight blockers
halted_at_step: before step 2 (Write), based on pre-flight inspection
date: 2026-04-21
supersedes: batch-doctrine-c-blocker.md (v1, staging-path NUL corruption)
---

# Doctrine C — Blocker v2

The v2 inline-write strategy was designed to bypass the NUL-padding corruption class that killed Doctrine C v1 on `/mnt/uploads`. Pre-flight inspection of the workspace shows **the inline-write strategy cannot succeed as specified either**, for four independent reasons. I stopped before the Write call to avoid leaving a partially-committed, partially-verified mess that would force a third recovery pass.

Each finding below is the actual observed value, per the batch's "write the actual observed value" blocker protocol.

## Finding 1 — Target path is read-only, Write tool cannot land there

The batch instructs (Step 2): *"Use your Write tool to write the content … to: `/sessions/festive-compassionate-mendel/mnt/uploads/MannaFest_Vision_v2_Locked.md`"*

Actual observed state of that path:

```
-r-x------ 2 festive-compassionate-mendel festive-compassionate-mendel 30298 Apr 21 12:23 /sessions/festive-compassionate-mendel/mnt/uploads/MannaFest_Vision_v2_Locked.md
```

Mode `-r-x`. Not writable. The Write tool will fail with a permission error, and per the batch's rules I must not fall back to `cp` / `cat >` / shell redirection.

Secondary observation — the file has hardlink count 2, but `find /sessions/.../mnt -inum 32651097298531229` returns no partner inode inside the visible mount, so the second link is somewhere outside the visible filesystem. Writing to `/mnt/uploads` would not be the right mutation even if it were permitted, because the repo's copy lives on a different inode (13792273859381220) on a different mount and would not be updated transitively.

**The canonical writable location for this file is `/sessions/festive-compassionate-mendel/mnt/MannaFest/MannaFest_Vision_v2_Locked.md`** (the code repo). The batch prompt almost certainly meant that path. A v3 batch should correct the Write target.

## Finding 2 — Inline content block in the prompt is markdown-rendered; heading `#` prefixes have been stripped before I see them

The batch relies on me copying the bytes between `=== VISION_V2_CONTENT_BEGIN ===` and `=== VISION_V2_CONTENT_END ===` into the Write tool. Those bytes are supposed to produce sha256 `6ee0b4ea6b417222791577ca244a58a8a4e18f333406656fd3efe6adbf0b12b5` and pass grep checks for `# MannaFest — Vision v2 (Locked Decisions)`, `### 4.3 Editorial notes & the Editor's Notes drawer (Doctrine C, 2026-04-21)`, and `#### 4.3.4 Where the drawer does not appear`.

What I actually see in the inline block (verbatim, ignoring the rest of the body):

- First line after the BEGIN marker: `MannaFest — Vision v2 (Locked Decisions)` — no leading `#`.
- Section 4.3 heading: `4.3 Editorial notes & the Editor's Notes drawer (Doctrine C, 2026-04-21)` — no leading `###`.
- Section 4.3.4 heading: `4.3.4 Where the drawer does not appear` — no leading `####`.
- Section 3 appears as a flat list of numbered lines ("# Decision Status 1 Single audience…") rather than as the pipe-delimited markdown table the content checks expect.
- Every other level-2/3/4 heading similarly lost its `#` prefix.

The heading-prefix hash characters were consumed by the rendering layer between the user's prompt and my view. The `####` in the *check instructions* (e.g. the line `grep for "#### 4.3.4 Where the drawer does not appear"`) survived because that `####` is inside a quoted-string context. The `####` on the actual heading line did not survive because at the start of a line it was interpreted as markdown.

Consequence: any Write using the inline block I can see will fail, at minimum:

- sha256 check — won't match `6ee0b4ea…`
- First-line check — will be `MannaFest — Vision v2 (Locked Decisions)`, not `# MannaFest — Vision v2 (Locked Decisions)`
- `#### 4.3.4 Where the drawer does not appear` grep — zero matches
- `### 4.3 Editorial notes & the Editor's Notes drawer (Doctrine C, 2026-04-21)` grep — zero matches

The NUL-padding corruption class was real, but the inline-write strategy has hit a *different* corruption class — rendering-layer heading collapse. A v3 batch needs a delivery channel that preserves leading `#` at line start (code fence, base64, attached file, or fenced HEREDOC-style marker).

## Finding 3 — Current disk content is the pre-Doctrine-C version; NUL padding is on the repo file, not the uploads file

Actual content on disk (verified via Python, not md5):

- `/mnt/MannaFest/MannaFest_Vision_v2_Locked.md`: 37680 bytes on disk. First 30298 bytes are valid content ending with `This is the version that ships.\n`. Last 7382 bytes are `\x00` padding beginning at byte offset 30298. sha256 of the *full* 37680-byte file: `8f9faf28bf0c802586bddcc31956727c6c2a3ba781e65b122d04dc55d5c530d7`. sha256 of the *first 30298 bytes* (content only): `f32958e398810ce1af85b927f4940e35afb81cc92e2471f43787a93382c2e467`.
- `/mnt/uploads/MannaFest_Vision_v2_Locked.md`: 30298 bytes, no NUL padding, sha256 `f32958e398810ce1af85b927f4940e35afb81cc92e2471f43787a93382c2e467`. **Byte-identical to the repo file's first 30298 bytes.**

Both copies are pre-Doctrine-C. Grep counts in both:

- `Editor's Notes drawer`: 0 (spec requires 14)
- `Founder editorial voice is first-class`: 0 (spec requires 2)
- `Doctrine C`: 0
- `#### 4.3.4 Where the drawer does not appear`: 0
- `### 4.3 Editorial notes`: 0
- `## 13. Closing`: 1 (consistent with the locked v2 structure — only §13 survived both iterations)

This changes the interpretation of the batch's "Size: 37680 bytes" claim. The real intended content is ~30298 bytes *plus* the Doctrine C amendments — which the batch describes as rewriting §4.3, adding §3 row 26, adding a §12 bullet, and adding an amendment line to the header. That's additive — the new content will be **larger** than 30298 bytes, but not necessarily exactly 37680. The 37680 figure almost certainly measured a previously-corrupted copy (30298 content + 7382 NUL pad) and was written into the spec as if it were the intended content size. Any v3 verification spec needs to reground its size and sha256 targets on the real intended bytes, not on historical corruption artifacts.

## Finding 4 — Git index in `/mnt/MannaFest` is corrupt

`git status` in the repo returns:

```
error: index uses �~g8 extension, which we do not understand
fatal: index file corrupt
```

This blocks Step 4 (feature branch, explicit-file stage, commit) regardless of whether the file content is right. Recovery will require `rm .git/index && git reset` or equivalent index rebuild. The v1 blocker's mention of "git plumbing: hash-object / write-tree / commit-tree" is the right fallback but cannot be exercised while the index is unreadable.

## Why I skipped Step 1 (delete of `batch-doctrine-c-blocker.md`)

The batch's Step 1 is *"Delete `_ark\batch-doctrine-c-blocker.md`. Ignore error if missing."* That deletion is only appropriate if this batch succeeds. This batch is halting at pre-flight, so the v1 blocker remains load-bearing history — the v1 mount-path observations are still true and will be needed for the v3 design. The v1 file is preserved. This v2 file is additive.

## Proposed shape of a v3 batch

Not executed — just sketched so the v3 author has a starting point.

1. **Change the Write target** from `/mnt/uploads/…` to `/mnt/MannaFest/MannaFest_Vision_v2_Locked.md` (the repo file, which is writable).
2. **Change the delivery channel for the Vision v2 bytes** to one that preserves leading `#` at the start of a line. Options, in preference order:
   - Attach the file as an upload and instruct Claude to `cp` (yes, back to `cp`, but *only after* verifying with `cmp` / `sha256` that source and destination are not both NUL-padded on the chosen mount — the corruption class is now known to affect `/mnt/uploads`, not every file, so a non-`MannaFest_Vision_v2_Locked.md` staging filename may dodge it).
   - Deliver the bytes base64-encoded inside the prompt and decode with Python inside the Bash tool.
   - Deliver the bytes inside a fenced code block with an explicit language tag (`\`\`\`markdown` … `\`\`\``) which survives rendering because the fence suppresses markdown interpretation.
3. **Reground the verification spec** on the real intended file size and a sha256 computed from a locally-built canonical copy, not on corruption-inflated numbers.
4. **Rebuild the git index** in `/mnt/MannaFest` as step zero: `rm .git/index && git reset HEAD -- .`. Then proceed with the file write and the feature-branch flow.
5. **Keep content verification in content-space, not byte-space** — the content-check grep list (exact-count checks for `Editor's Notes drawer`, `Founder editorial voice is first-class`, `#### 4.3.4`, `### 4.3 Editorial notes`, `## 13. Closing`) is the right tool for this job and does not require a sha256 at all. Drop the sha256 check; keep the grep checks; fail loudly if any count is off by one.

## Files touched by this batch attempt

Only one:

1. `_ark/batch-doctrine-c-blocker-v2.md` (this file, new)

No files deleted. No git operations run. No Vision v2 bytes written to disk on any mount. Nothing needs to be rolled back.
