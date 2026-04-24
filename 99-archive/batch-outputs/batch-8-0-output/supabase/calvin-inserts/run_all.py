#!/usr/bin/env python3
"""
Apply the remaining Calvin commentary INSERT batches to production Supabase.

Pre-requisites:
  - Already applied via MCP during Cowork session:
      * migration 059_scholars_attribution_columns (version 20260423010104)
      * Calvin commentary rows: Genesis chapters 1-50 (50 rows, slug=calvin, book_id=1)
  - NOT yet applied: all other books (calvin_005_* through calvin_106_*)

This script applies all SQL files in this directory whose filename does NOT
begin with a Genesis-already-ingested prefix. Default behavior skips the
4 Genesis files already in the DB (calvin_001-004) so re-running is safe.

Usage (Windows PowerShell, from the MannaFest code repo root):

  # 1. Install psycopg if needed
  pip install psycopg[binary]

  # 2. Pull the DB connection string from Supabase dashboard
  #    (Settings > Database > Connection string, Session mode)
  $env:SUPABASE_DB_URL = "postgresql://postgres.<ref>:<password>@..."

  # 3. Dry-run to see what will execute
  python _ark/batch-8-0-output/supabase/calvin-inserts/run_all.py --dry-run

  # 4. Execute
  python _ark/batch-8-0-output/supabase/calvin-inserts/run_all.py

Alternative (no Python): apply each .sql file via the Supabase SQL editor
or via psql -f <file.sql>. Use file order — alphabetical matches book order.
"""
import argparse
import os
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent

# Files already applied during Cowork session — these should be SKIPPED
# to avoid duplicate inserts. Unique constraint will reject them anyway,
# but cleaner to skip explicitly.
SKIP_FILES = {
    "calvin_001_01_genesis_2.sql",  # Genesis chapters 11-20 (applied via mega_001)
    "calvin_002_01_genesis_3.sql",  # Genesis chapters 21-30 (applied via mega_001)
    "calvin_003_01_genesis_4.sql",  # Genesis chapters 31-40 (applied via mega_002)
    "calvin_004_01_genesis_5.sql",  # Genesis chapters 41-50 (applied via mega_002)
    "run_all.py",
    "README.md",
}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--db-url", default=os.environ.get("SUPABASE_DB_URL"))
    args = parser.parse_args()

    files = sorted(SCRIPT_DIR.glob("*.sql"))
    to_apply = [f for f in files if f.name not in SKIP_FILES]
    to_skip = [f for f in files if f.name in SKIP_FILES]

    print(f"SQL files in directory:        {len(files)}")
    print(f"To skip (already applied):     {len(to_skip)}")
    print(f"To apply:                      {len(to_apply)}")
    print()

    if args.dry_run:
        print("=== dry-run, not executing ===")
        for f in to_apply:
            print(f"  would run: {f.name}")
        return

    if not args.db_url:
        print("Error: set SUPABASE_DB_URL env var or pass --db-url",
              file=sys.stderr)
        sys.exit(1)

    try:
        import psycopg
    except ImportError:
        print("Error: run 'pip install psycopg[binary]' first", file=sys.stderr)
        sys.exit(1)

    total_rows = 0
    with psycopg.connect(args.db_url) as conn:
        for i, f in enumerate(to_apply, 1):
            sql = f.read_text()
            # Count INSERT rows by number of VALUES entries (each ends with
            # '),\n' or ');\n'). Rough but sufficient.
            row_count = sql.count("'John Calvin'")
            with conn.cursor() as cur:
                cur.execute(sql)
                conn.commit()
            total_rows += row_count
            print(f"[{i:3d}/{len(to_apply)}] {f.name}: +{row_count} rows")

    print(f"\nTotal inserted: {total_rows} rows")


if __name__ == "__main__":
    main()
