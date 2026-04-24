# Batch 8.0 — Pickup instructions (Windows-direct)

Cowork applied migration 059 live to production Supabase. This folder
archives the migration file for the repo. **No application code changed.**
Phases 2–5 halted on a network-egress blocker — see `_ark/batch-8-0-blocker.md`.

## What to do on Windows

```powershell
cd C:\Users\marcd\Downloads\MannaFest
git checkout -b feat/batch-8-commentator-ingestion
copy <ark>\batch-8-output\supabase\migrations\059_scholars_attribution_columns.sql .\supabase\migrations\
git add supabase/migrations/059_scholars_attribution_columns.sql
git commit -m "feat(commentaries): Phase 1 — migration 059 + scholars attribution (Batch 8.0)"
```

Do **not** push. Do **not** merge. The feature branch stays open for
Batches 8.1–8.7 to add their ingestion commits on top of this one, per
the Batch 8.0 prompt's Wave A branch-persistence rule.

If Marcus prefers to abandon Batch 8 entirely and restart once the
egress issue is resolved, migration 059 is already applied to production
DB — it's additive and non-destructive, safe to leave in place. The
repo's `supabase/migrations/` folder can catch up when the next batch
lands.

## What's in the database right now

- `scholars.primary_work_title` column exists (TEXT, nullable)
- `scholars.primary_work_years` column exists (TEXT, nullable)
- All 9 PD commentator rows (Calvin, Spurgeon, Gill, Clarke, Barnes,
  JFB, Wesley NT, Geneva, Matthew Henry) have both columns populated
- No other data change

## What's NOT in the database

- Zero Calvin commentary rows. `commentaries` table unchanged.
- No other commentator ingestion.
