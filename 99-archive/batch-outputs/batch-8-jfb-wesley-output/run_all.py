#!/usr/bin/env python3
"""
Windows-direct applier for Calvin, JFB, and Wesley commentary batches.

Extends Batch 8.0's run_all.py with a `--commentator` flag so the three
staged ingestions can be applied independently or together. Applies the
per-scholar UPDATE (primary_work_title / primary_work_years / tradition
correction) as the first idempotent statement before running INSERTs.

Usage
-----

  pip install "psycopg[binary]"
  # Supabase Dashboard → Settings → Database → Connection string (Session mode)
  $env:SUPABASE_DB_URL = "postgresql://postgres.<ref>:<pwd>@<host>:6543/postgres"

  # Preview
  python run_all.py --commentator jfb --dry-run
  python run_all.py --commentator wesley --dry-run

  # Apply (idempotent — safe to re-run, skips already-inserted rows)
  python run_all.py --commentator jfb
  python run_all.py --commentator wesley

  # Or apply all staged + calvin leftovers in one go
  python run_all.py --commentator all

  # Test run — only apply the first N batch files
  python run_all.py --commentator jfb --limit 5

Idempotency
-----------
Before INSERTing, the script queries the `commentaries` table for already
present (scholar_id, book_id, chapter) rows and drops each INSERT whose
(book_id, chapter) combination is already in the DB for that scholar.
A second guard: each INSERT batch uses Postgres `ON CONFLICT DO NOTHING`
isn't available here because there's no unique constraint, so the skip
list is the primary defense; run the `--dry-run` first.
"""
from __future__ import annotations

import argparse
import os
import re
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent

CALVIN_DIR = SCRIPT_DIR.parent / "batch-8-0-output" / "supabase" / "calvin-inserts"
JFB_DIR = SCRIPT_DIR / "supabase" / "jfb-inserts"
WESLEY_DIR = SCRIPT_DIR / "supabase" / "wesley-inserts"

CALVIN_SLUG = "calvin"
JFB_SLUG = "jfb"
WESLEY_SLUG = "wesley"

# Scholar metadata corrections (idempotent UPDATE statements).
# Applied as the FIRST operation for each commentator — reflects prompt spec
# + corrections noted during pre-flight MCP reads.
SCHOLAR_UPDATES: dict[str, str] = {
    CALVIN_SLUG: """
        UPDATE scholars SET
            primary_work_title = 'Commentaries (Calvin Translation Society edition)',
            primary_work_years = '1843-1855'
        WHERE slug = 'calvin';
    """,
    JFB_SLUG: """
        UPDATE scholars SET
            tradition = 'Evangelical',
            primary_work_title = 'Commentary Critical and Explanatory on the Whole Bible',
            primary_work_years = '1871'
        WHERE slug = 'jfb';
    """,
    WESLEY_SLUG: """
        UPDATE scholars SET
            tradition = 'Evangelical',
            primary_work_title = 'Notes on the Bible',
            primary_work_years = '1754-1766'
        WHERE slug = 'wesley';
    """,
}

# Files that are informational, not runnable SQL
SKIP_FILENAMES = {"run_all.py", "README.md", "coverage_report.md"}

# Calvin pre-applied set from 8.0 session — these files exist in the
# calvin-inserts dir but represent rows already in prod:
CALVIN_PRE_APPLIED = {
    "calvin_001_01_genesis_2.sql",
    "calvin_002_01_genesis_3.sql",
    "calvin_003_01_genesis_4.sql",
    "calvin_004_01_genesis_5.sql",
}


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser()
    p.add_argument("--commentator",
                   choices=["calvin", "jfb", "wesley", "all"],
                   required=True)
    p.add_argument("--db-url", default=os.environ.get("SUPABASE_DB_URL"),
                   help="Postgres connection string; defaults to "
                        "$SUPABASE_DB_URL")
    p.add_argument("--dry-run", action="store_true",
                   help="Preview: do not execute any statement")
    p.add_argument("--limit", type=int, default=None,
                   help="Apply only the first N batch files (after skipping)")
    return p.parse_args()


def pg_connect(db_url: str):
    try:
        import psycopg
    except ImportError:
        print("Error: pip install 'psycopg[binary]' first", file=sys.stderr)
        sys.exit(2)
    return psycopg.connect(db_url)


def sql_files_for(slug: str) -> list[Path]:
    """Return the ordered list of SQL batch files for a commentator,
    excluding non-SQL helpers and Calvin's already-applied set."""
    if slug == CALVIN_SLUG:
        files = sorted(p for p in CALVIN_DIR.glob("*.sql")
                       if p.name not in CALVIN_PRE_APPLIED
                       and p.name not in SKIP_FILENAMES)
    elif slug == JFB_SLUG:
        files = sorted(p for p in JFB_DIR.glob("*.sql"))
    elif slug == WESLEY_SLUG:
        files = sorted(p for p in WESLEY_DIR.glob("*.sql"))
    else:
        return []
    return files


def existing_rows(conn, slug: str) -> set[tuple[int, int]]:
    """Return {(book_id, chapter)} for rows already in commentaries for
    the given scholar slug."""
    with conn.cursor() as cur:
        cur.execute(
            "SELECT c.book_id, c.chapter "
            "FROM commentaries c JOIN scholars s ON s.id = c.scholar_id "
            "WHERE s.slug = %s",
            (slug,),
        )
        return set(cur.fetchall())


# Parser for INSERT VALUES row: we only need the (book_id, chapter) pair
# to decide whether to skip. Each row looks like:
#   ('<uuid>'::uuid, <book_id>, <chapter>, 1, NULL, ...)
ROW_KEY_RE = re.compile(
    r"\(\s*'[^']+'\s*::uuid\s*,\s*(\d+)\s*,\s*(\d+)\s*,",
)


def strip_already_present(sql: str, skip_set: set[tuple[int, int]]
                          ) -> tuple[str, int, int]:
    """Remove INSERT rows whose (book_id, chapter) is already in skip_set.
    Returns (filtered_sql, kept_rows, skipped_rows)."""
    # Split on ",\n(" which separates VALUES rows, preserving the leading
    # "INSERT INTO ... VALUES\n" header and trailing semicolon.
    header_match = re.match(r"(.*?VALUES\s*\n)(.*)", sql, re.DOTALL)
    if not header_match:
        return sql, 0, 0
    header = header_match.group(1)
    body = header_match.group(2).rstrip()
    # Strip trailing semicolon
    if body.endswith(";"):
        body = body[:-1]
    # Rows are separated by `,\n` at the tuple boundary
    rows = []
    depth = 0
    start = 0
    for i, ch in enumerate(body):
        if ch == "(":
            if depth == 0:
                start = i
            depth += 1
        elif ch == ")":
            depth -= 1
            if depth == 0:
                rows.append(body[start:i + 1])
    kept_rows = []
    skipped = 0
    for row in rows:
        m = ROW_KEY_RE.match(row)
        if m:
            key = (int(m.group(1)), int(m.group(2)))
            if key in skip_set:
                skipped += 1
                continue
        kept_rows.append(row)
    if not kept_rows:
        return "", 0, skipped
    filtered_sql = header + ",\n".join(kept_rows) + ";\n"
    return filtered_sql, len(kept_rows), skipped


def apply_for(slug: str, args, conn) -> None:
    files = sql_files_for(slug)
    if args.limit is not None:
        files = files[:args.limit]

    print(f"\n=== {slug} ===")
    print(f"  SQL batch files to consider: {len(files)}")

    if not files:
        return

    # UPDATE scholar row first (idempotent)
    update_sql = SCHOLAR_UPDATES[slug]
    if args.dry_run:
        print("  [dry-run] would run scholar UPDATE:")
        for line in update_sql.strip().splitlines():
            print(f"    {line.strip()}")
    else:
        with conn.cursor() as cur:
            cur.execute(update_sql)
        conn.commit()
        print("  scholar UPDATE applied")

    # Build skip-list of rows already in DB
    if args.dry_run:
        skip_set = set()  # can't query without connection; assume empty
    else:
        skip_set = existing_rows(conn, slug)
    print(f"  already-present rows in DB for {slug}: {len(skip_set)}")

    total_kept = 0
    total_skipped = 0
    batches_executed = 0
    for i, path in enumerate(files, 1):
        raw_sql = path.read_text()
        filtered_sql, kept, skipped = strip_already_present(
            raw_sql, skip_set
        )
        total_kept += kept
        total_skipped += skipped
        if not filtered_sql:
            print(f"  [{i:3d}/{len(files)}] {path.name}: "
                  f"all {skipped} rows already present, skipping file")
            continue
        if args.dry_run:
            print(f"  [{i:3d}/{len(files)}] {path.name}: "
                  f"would apply {kept} rows (skip {skipped})")
        else:
            with conn.cursor() as cur:
                cur.execute(filtered_sql)
            conn.commit()
            batches_executed += 1
            print(f"  [{i:3d}/{len(files)}] {path.name}: "
                  f"+{kept} rows (skipped {skipped})")

    print(f"  summary: kept={total_kept}, skipped={total_skipped}, "
          f"batches_executed={batches_executed}")


def main() -> None:
    args = parse_args()

    if args.dry_run:
        conn = None
        print("=== DRY RUN — no database connection ===")
    else:
        if not args.db_url:
            print("Error: set $SUPABASE_DB_URL or pass --db-url",
                  file=sys.stderr)
            sys.exit(2)
        conn = pg_connect(args.db_url)

    targets = (
        [CALVIN_SLUG, JFB_SLUG, WESLEY_SLUG]
        if args.commentator == "all"
        else [args.commentator]
    )
    for slug in targets:
        apply_for(slug, args, conn)

    if conn:
        conn.close()

    print("\ndone.")


if __name__ == "__main__":
    main()
