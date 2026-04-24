# Batch 8.9 — HANDOFF

**Branch to push:** `feat/batch-8-9-commentary-completion`
**Merge-ready:** Yes (schema + render + admin + doctrine shipped; ingestion scaffolded)
**Production Supabase state:** migrations 059–062 APPLIED LIVE via MCP during the Cowork session (they are not staged — they're live). This is relevant: the feature branch contains the migration SQL files as a historical record, not as work-to-apply.

---

## 1. Cowork sandbox state

Cowork worked from `/sessions/.../mnt/MannaFest` with a broken git index (Cowork sandbox `.git/index` corruption — HEAD on a phantom `feat/batch-7-scripture-reader-g` branch with zero commits). All work is on-disk in the working directory. No commits were made from the sandbox.

Standard post-Cowork Windows ritual applies:

```powershell
cd C:\Users\marcd\Downloads\MannaFest
Remove-Item -Force .git\HEAD.lock, .git\index.lock -ErrorAction SilentlyContinue
git reset --mixed HEAD
git status
```

If `git status` shows a mountain of "modified" and "untracked" — that's expected; Cowork edited many files.

---

## 2. Branch + file-explicit staging

Create the feature branch from current main, then stage the files explicitly (§1 rule: no `git add -A`).

```powershell
git checkout main
git pull --ff-only origin main
git checkout -b feat/batch-8-9-commentary-completion
```

### Phase 1 — Render bug fixes

```powershell
git add `
  src/components/commentary/CommentaryCard.tsx `
  src/components/commentary/CommentarySection.tsx `
  src/components/commentary/FeaturedExcerpt.tsx `
  src/components/commentary/truncate.ts `
  src/components/votd/VotdCommentaryHighlights.tsx `
  src/components/votd/VotdLayer2Page.tsx `
  src/lib/commentary/structuralFormatter.ts `
  src/lib/commentary/__tests__/structuralFormatter.test.ts `
  src/lib/supabase/schemas/commentaries.ts

git commit -m "fix(commentary): repair five Doctrine A render leaks (Batch 8.9 Phase 1)"
```

### Phase 2 — Schema

```powershell
git add `
  supabase/migrations/059_commentary_body_html.sql `
  supabase/migrations/060_scholars_copyrighted_and_work.sql `
  supabase/migrations/061_commentary_architecture.sql

git commit -m "feat(commentary): chapter_commentary + pull_quotes tables + body_html + scholars.is_copyrighted (Batch 8.9 Phase 2)"
```

### Phase 3 — Guzik render

```powershell
git add `
  src/components/commentary/PullQuoteList.tsx `
  src/components/commentary/ChapterCommentaryGuzikView.tsx

git commit -m "feat(commentary): Guzik-format chapter commentary + unified PullQuoteCard (Batch 8.9 Phase 3)"
```

### Phase 4 — Admin UX

```powershell
git add `
  src/lib/pullQuotes/wordCount.ts `
  src/lib/pullQuotes/__tests__/wordCount.test.ts `
  src/lib/pullQuotes/ordering.ts `
  src/lib/pullQuotes/__tests__/ordering.test.ts `
  src/lib/pullQuotes/save.ts `
  "src/app/admin/commentary/[bookSlug]/[chapter]/verses/page.tsx" `
  "src/app/admin/commentary/[bookSlug]/[chapter]/verses/VerseGrid.tsx" `
  "src/app/admin/commentary/[bookSlug]/[chapter]/outline/page.tsx" `
  "src/app/admin/commentary/[bookSlug]/[chapter]/outline/OutlineBuilder.tsx"

git commit -m "feat(admin): per-verse curation drawer with candidate pool + manual input (Batch 8.9 Phase 4)"
```

### Phase 5 — Extraction script

```powershell
git add `
  scripts/commentary/extractPullQuotes.ts `
  scripts/commentary/__tests__/extractPullQuotes.test.ts

git commit -m "feat(commentary): pull-quote extraction heuristic across ingested corpora (Batch 8.9 Phase 5)"
```

### Phase 6 — Scholar seed

```powershell
git add supabase/migrations/062_seed_expanded_scholars.sql
git commit -m "feat(scholars): seed Missler, Lewis, Ravenhill, Prince, Hagin, Tozer, Pink, Brewer, Huff, Bruce, Wright (Batch 8.9 Phase 6)"
```

### Phase 7 — Ingestion scaffold

```powershell
git add `
  scripts/commentary/ingestCommentator.ts `
  scripts/commentary/sources/index.ts `
  scripts/commentary/sources/ccel.ts

git commit -m "feat(commentary): ingestion driver + CCEL source scaffold (Batch 8.9 Phase 7 — not run)"
```

### Phase 8 — Doctrine amendments

```powershell
git add MannaFest_Vision_v2_Locked.md
git commit -m "docs: Doctrine E — uniform 50-word attributed-quote rule across PD + copyrighted scholars (Batch 8.9 Phase 8)"
```

(Ark amendment to OPERATING_RULES.md §3 is a separate commit in the `mannafest-ark` repo, not this one. See §8 below.)

---

## 3. Push + merge + deploy

```powershell
git push -u origin feat/batch-8-9-commentary-completion --force-with-lease
git checkout main
git pull --ff-only origin main
git merge --no-ff feat/batch-8-9-commentary-completion `
  -m "merge: Batch 8.9 — commentary completion (schema + Guzik render + admin curation + 11 scholar seed + Doctrine E)"
git push origin main
```

Vercel auto-deploys. Wait ~2 min, then open the acceptance checklist.

---

## 4. Post-merge verification queries (Supabase SQL editor)

```sql
-- 1. All 4 migrations recorded
SELECT version FROM supabase_migrations.schema_migrations
WHERE version IN ('059','060','061','062')
ORDER BY version;

-- 2. New tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('pull_quotes','chapter_commentary','ingestion_failures');

-- 3. Copyrighted scholars populated
SELECT slug, tradition_key, default_rank, is_copyrighted, primary_work_title
FROM scholars WHERE is_copyrighted = TRUE ORDER BY default_rank ASC;

-- 4. Render-path sanity — no pull_quotes yet, that's expected
SELECT status, COUNT(*) FROM pull_quotes GROUP BY status;
```

---

## 5. Post-merge scripts to run (on Windows, with .env.local populated)

### Body-HTML backfill

No backfill runner ships in Batch 8.9 — this is the first-week follow-up. Quick-and-dirty one-liner Node script you can write in five minutes:

```typescript
// scripts/backfill-body-html.ts
import { createClient } from "@supabase/supabase-js";
import { structuralFormat } from "../src/lib/commentary/structuralFormatter";

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
const BATCH = 100;
let offset = 0;
while (true) {
  const { data } = await sb
    .from("commentaries")
    .select("id, commentary_text")
    .is("body_html", null)
    .order("id")
    .range(offset, offset + BATCH - 1);
  if (!data || data.length === 0) break;
  for (const row of data) {
    const html = structuralFormat(row.commentary_text);
    await sb.from("commentaries").update({ body_html: html }).eq("id", row.id);
  }
  offset += BATCH;
  console.log(`Backfilled ${offset}`);
}
```

Run once. Expected: 4,353 rows updated.

### Auto-draft extraction

```powershell
# Probe: run against Calvin on Genesis only (~50 rows)
npx tsx --env-file=.env.local scripts/commentary/extractPullQuotes.ts --scholar=calvin --book=genesis --dry-run

# Real run: all PD scholars, all books (~tens of thousands of auto_draft rows)
npx tsx --env-file=.env.local scripts/commentary/extractPullQuotes.ts --all
```

### Ingestion (when ready)

```powershell
# Dry-run to probe URL patterns:
npx tsx --env-file=.env.local scripts/commentary/ingestCommentator.ts --scholar=gill --book=genesis --dry-run

# Real run once per-source cleaners are in place (follow-up batch):
npx tsx --env-file=.env.local scripts/commentary/ingestCommentator.ts --missing
```

---

## 6. Acceptance checklist (production click-through)

Run these against production after Vercel deploy completes.

- [ ] `/verse/genesis/50/20` — Matthew Henry card ≤50 words, "Read full passage" bordered-pill visible, expand toggles body. With body_html null, expanded view is `whitespace-pre-wrap` raw text.
- [ ] `/verse/romans/8/28` — featured voice + "Show other voices" disclosure, every card ≤50 words, tradition chips rendered.
- [ ] `/verse-of-the-day` — highlights section shows up to 3 cards, never opens with "PSALM N" or "R O M A N S" artifacts. If no pull_quotes yet, fallback chain to featured_excerpt → truncated commentaries kicks in; the neutral empty-state renders only when every source is empty.
- [ ] `/read/genesis/1` — reader page: ChapterCommentaryGuzikView in the sidebar (after Marcus wires it into the reader layout). With no chapter_commentary row yet, shows "Curation pending on this chapter" empty-state.
- [ ] `/admin/commentary/genesis/1/verses` — super-admin only: verse grid loads, Edit on any verse opens a drawer with three sections. Manual scholar picker lists all scholars; selecting a copyrighted scholar shows the fair-use reminder.
- [ ] `/admin/commentary/genesis/1/outline` — intro note + JSON outline textareas load; Save persists via upsert.
- [ ] Word counter in manual form turns amber at 45 words, red at 51, disables Save when over cap.
- [ ] Promote-to-featured on any pull-quote clears the prior featured on that verse (the partial unique index would reject otherwise; save.ts handles the clear+set atomically).

---

## 7. Reader page wiring (deferred to first Pastor Marc session)

`ChapterCommentaryGuzikView.tsx` is written but not placed in `/read/[book]/[chapter]/page.tsx`. Ship in a follow-up micro-commit:

```tsx
// Inside /read/[book]/[chapter]/page.tsx (or equivalent reader layout):
import ChapterCommentaryGuzikView from "@/components/commentary/ChapterCommentaryGuzikView";

// ...

<aside className="hidden lg:block lg:w-[420px] lg:sticky lg:top-16 lg:self-start lg:overflow-y-auto">
  <ChapterCommentaryGuzikView bookSlug={bookSlug} chapter={chapter} />
</aside>
```

Mobile bottom-sheet placement is a separate follow-up — the component renders fine in any container.

---

## 8. Ark-side commits (separate repo)

```powershell
cd C:\Users\marcd\Documents\MannaFest\ark
git add OPERATING_RULES.md 03-sessions/session_8-9_2026-04-22.md batch-8-9-output/HANDOFF.md
git commit -m "doctrine: §3 uniform 50-word rule; session 8-9 + handoff"
git push origin mannafest-ark
```

---

## 9. What did NOT ship in Batch 8.9 (follow-up queue)

1. **Body-HTML backfill runner** — write + run the 20-line script in §5.
2. **Per-source cheerio cleaners** — `sources/biblehub.ts`, `sources/studylight.ts`, `sources/sacredtexts.ts`, `sources/archiveorg.ts`. Each needs a manual probe of a sample URL + cheerio selector for the commentary body div.
3. **Five remaining PD ingestions** — Spurgeon TOD (Psalms only), Gill, Clarke, Barnes, Geneva. Blocks on (2).
4. **dnd-kit reorder handles** — Up/Down buttons ship now; drag handles are a v2 polish. Needs `npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`.
5. **Reader-page wiring** — see §7. Small, self-contained.
6. **Structured outline builder UI** — JSON textarea ships now; a list-builder with add-section / add-verse-unit buttons is a v2 nicety.
7. **Preview-unsaved-changes link** from drawer footer — not shipped.

---

## 10. STATUS.md + BATCH_QUEUE.md

STATUS in the ark repo currently says "Ready for Batch 3" — stale by ~5 batches. Propose update after the merge to reflect: Batch 8.9 merged, Wave 1 Commentary + Editorial Infrastructure complete, Genesis curation reference pass (Batch 7) next.

Same for BATCH_QUEUE.md — move Batch 8.9 to the shipped archive, flag the follow-up items in §9 above.
