# Batch 8.5 — Commentary Render Trim Hot-Fix — Handoff

**Date:** 2026-04-22
**Wave:** A
**Batch spec:** apply Doctrine A §4.4 ≤50 word trim + "Read full passage" disclosure to every voice in the "Show other voices" expansion, not just the featured voice.
**Per batch prompt:** *Do not merge. Do not push. Marcus handles branch operations.*

---

## Why this handoff exists instead of a sandbox commit

The Cowork sandbox `.git` is in the documented-quirk state (STATUS.md quirks: "Cowork sandbox `.git/index` corruption"; `refs/heads/main` shows the "broken name" warning with a duplicate entry). The batch already instructs Cowork not to push or merge — so rather than produce a suspect commit object in the sandbox, the edits are left on disk and this manifest tells you exactly what to stage and commit Windows-side. Post-session ritual from OPERATING_RULES still applies.

---

## Windows-side branch + commit steps

```powershell
cd C:\Users\marcd\Downloads\MannaFest
# heal the sandbox-induced index state if needed
git reset --mixed HEAD
# branch off current main
git checkout main
git pull
git checkout -b feat/batch-8-5-commentary-trim

# stage exactly these files (file-explicit per OPERATING_RULES §1)
git add `
  src/components/commentary/truncate.ts `
  src/components/commentary/FeaturedExcerpt.tsx `
  src/components/commentary/CommentaryCard.tsx `
  src/components/commentary/CommentarySection.tsx `
  src/components/commentary/index.ts `
  src/components/commentary/__tests__/truncate.test.ts `
  src/components/votd/VotdCommentaryHighlights.tsx `
  "src/app/admin/commentary/[bookSlug]/[chapter]/CurationPanel.tsx" `
  MannaFest_Vision_v2_Locked.md

git commit -m "fix(commentary): trim all voices to <=50 words per Doctrine A §4.4"
```

Vault-side (session record + Vision amendment trace) commits separately to the `mannafest-ark` repo — see §Vault Commit below.

---

## Files changed

### New (2)

1. **`src/components/commentary/truncate.ts`** — pure-function helpers (`truncateWords` + `previewForVoice`). `truncateWords` preserves its original signature; `previewForVoice` is the new shared contract both card components call. Pure module (no `"use client"`) so server callers like `VotdCommentaryHighlights` stay safe.
2. **`src/components/commentary/__tests__/truncate.test.ts`** — node:test regression guard on `previewForVoice`. 11 cases, 0 new deps.

### Modified — commentary module (4)

3. **`src/components/commentary/FeaturedExcerpt.tsx`** — flipped from server component to `"use client"`. Props reduced from `{ entry, excerpt, truncated }` to `{ entry }`; component now owns trim + inline expand via `useState`. Replaced the anchor-link-to-`#voice-{id}` (which landed on nothing since the featured entry is excluded from the other-voices list) with an inline "Read full passage ↓" / "Hide full passage ↑" toggle. Re-exports `truncateWords` for callers on the legacy import path.
4. **`src/components/commentary/CommentaryCard.tsx`** — flipped to `"use client"`. Every non-featured voice now runs through `previewForVoice` and renders the same ≤50-word trim + inline expand disclosure as the featured voice. Passes `displayText` (not `commentary_text`) to `<Cite excerpt=... />`. This is the headline fix.
5. **`src/components/commentary/CommentarySection.tsx`** — removed the pre-computed `featuredBody` / `featuredIsTruncated`. Passes `entry` straight to `FeaturedExcerpt`; trim decisions now live in the client component so the featured and non-featured cards share one code path.
6. **`src/components/commentary/index.ts`** — re-exports `truncateWords` from `./truncate` (the pure module) instead of through the now-client `FeaturedExcerpt` boundary.

### Modified — external callers migrated off `./FeaturedExcerpt` (2)

7. **`src/components/votd/VotdCommentaryHighlights.tsx`** — server component; import path swap only (`FeaturedExcerpt` → `truncate`). No logic change.
8. **`src/app/admin/commentary/[bookSlug]/[chapter]/CurationPanel.tsx`** — client component; import path swap only. No logic change.

### Vision v2 amendment (1)

9. **`MannaFest_Vision_v2_Locked.md`** — §4.4 row 3 bullet expanded to explicitly state: *"Same attribution + tradition-tag treatment as the featured block, including the ≤50 word trim and 'Read full passage' disclosure — every voice in the expansion renders the same excerpt + expand mechanic as the featured voice at the top of the section. Full commentary_text dumps are prohibited on the public surface."* Amendment log entry added above the §1 header with a 2026-04-22 stamp.

---

## Verification

- `node --experimental-strip-types --test src/components/commentary/__tests__/truncate.test.ts` — **11/11 passing**.
- `npx tsc --noEmit` — zero errors in touched files (`src/components/commentary/*`, `src/components/votd/VotdCommentaryHighlights.tsx`, `src/app/admin/commentary/[bookSlug]/[chapter]/CurationPanel.tsx`). Pre-existing sandbox-mount corruption in `src/app/layout.tsx` and `src/app/page.tsx` (TS1127 NUL-byte artifacts) is unchanged and unrelated.
- `npx eslint <touched files>` — exit 0, no issues.

---

## Acceptance (for Marcus)

Exactly as spec'd in the batch prompt §ACCEPTANCE. The Supabase row-flip + preview verification sequence on `/verse/isaiah/53/5` remains the gate. If the featured voice regresses or a non-featured card shows full text, halt and paste the screenshot to chat.

Known gotcha this batch sidesteps: the prior "Read full passage ↓" anchor-link on the featured card pointed at `#voice-{featured.id}`, but the featured entry is filtered out of the "other voices" list — so the anchor landed on nothing. Batch 8.5 replaces both paths with an inline expand/collapse mechanic, which also fixes this pre-existing wart. If any older preview link to a `#voice-{id}` anchor exists in editorial notes, it will still work via the `id=` on each OtherVoicesDisclosure `<article>`.

---

## Vault commit (separate repo: `mannafest-ark`)

```powershell
cd C:\Users\marcd\Documents\MannaFest\ark
git add `
  03-sessions/session_8-5_2026-04-22.md `
  batch-8-5-output/HANDOFF.md
git commit -m "batch 8.5 — commentary render trim hot-fix (session + handoff)"
```

---

## Out of scope for this batch (confirmed untouched)

- No DB schema changes, no migrations.
- No ingestion scripts.
- No scholar / tradition / attribution changes.
- No Editor's Notes drawer (Doctrine C) edits.
- No homepage / hero / layout edits.
- No trim length tuning (remains 50 per Doctrine A).
- No curation editor work — that lives in Batch 8.9.
