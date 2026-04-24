#!/usr/bin/env python3
"""
Generate SQL INSERT batches for JFB commentary ingestion.

Reads per-book JSON extracted by `extract_jfb.py` and emits 10-row INSERT
statements sized to fit a single Supabase `execute_sql` call.

Runs the extraction implicitly if the JSON cache is missing, so this is a
one-command build: `python build_jfb_sql.py`.

JFB schema mapping
------------------
- scholar_id  → hardcoded from pre-flight MCP read (verified 2026-04-22):
                   jfb = 6d360491-df42-43ef-881e-b7413dcfd878
- book_id     → 1..66 Protestant canon (matches public.books.id)
- chapter     → 1..N per book
- verse_reference → '{book_slug}-{chapter}' (matches Henry + Calvin pattern)
- verse_start → 1 (chapter-level row)
- verse_end   → NULL
- author      → 'Jamieson, Fausset & Brown'
- source      → 'Commentary Critical and Explanatory'
- author_type → 'sourced'
- status      → 'published'
- featured + founder_curated → false (curation is Batch 8.9's job)

Body sizing
-----------
No truncation. JFB is concise-by-design (~2000 words per chapter) and sits
comfortably inside Matthew Henry's existing precedent (bodies up to 50k
chars). Render layer handles 50-word featured-excerpt trim.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

import extract_jfb  # local sibling module

EXTRACTED = Path("/sessions/zealous-wonderful-fermi/tmp/jfb-extracted")
SQL_OUT = Path("/sessions/zealous-wonderful-fermi/tmp/jfb-sql")
SQL_OUT.mkdir(parents=True, exist_ok=True)

SCHOLAR_ID_JFB = "6d360491-df42-43ef-881e-b7413dcfd878"
AUTHOR = "Jamieson, Fausset & Brown"
SOURCE = "Commentary Critical and Explanatory"
BATCH_SIZE = 10


def sql_escape(s: str) -> str:
    """Escape for Postgres E'...' string literal.
    E-strings treat \\ and ' as special; encode both."""
    s = s.replace("\\", "\\\\").replace("'", "''")
    # Strip NULs just in case (would break pg string literals)
    s = s.replace("\x00", "")
    return s


def ensure_extracted() -> None:
    """Run extractor if no JSON files present."""
    if any(EXTRACTED.glob("jfb_*.json")):
        return
    print("No extracted JSON found — running extract_jfb.py …")
    extract_jfb.main()


def load_all_records() -> list[dict]:
    ensure_extracted()
    all_records: list[dict] = []
    for jf in sorted(EXTRACTED.glob("jfb_*.json")):
        all_records.extend(json.load(open(jf)))
    return all_records


def emit_batches(records: list[dict]) -> int:
    """Emit SQL batch files. Returns the number of files written."""
    # Clean slate
    for old in SQL_OUT.glob("*.sql"):
        try:
            old.unlink()
        except PermissionError:
            pass  # scratchpad mount may be read-only for delete

    # Group by book, then chunk within each book
    by_book: dict[tuple[int, str], list[dict]] = {}
    for r in records:
        key = (r["book_id"], r["book_slug"])
        by_book.setdefault(key, []).append(r)

    seq = 0
    for (book_id, book_slug), chapters in sorted(by_book.items()):
        chapters.sort(key=lambda r: r["chapter"])
        for i in range(0, len(chapters), BATCH_SIZE):
            batch = chapters[i:i + BATCH_SIZE]
            lo = batch[0]["chapter"]
            hi = batch[-1]["chapter"]
            slug_safe = book_slug.replace(" ", "-")
            fname = (f"{seq:03d}_jfb_{book_id:02d}_{slug_safe}"
                     f"_{lo}_{hi}.sql")
            values = []
            for r in batch:
                v_ref = f"{book_slug}-{r['chapter']}"
                body = sql_escape(r["body"])
                values.append(
                    f"('{SCHOLAR_ID_JFB}'::uuid, {book_id}, "
                    f"{r['chapter']}, 1, NULL, "
                    f"'{v_ref}', '{AUTHOR}', '{SOURCE}', "
                    f"E'{body}', "
                    f"false, false, 'sourced', 'published')"
                )
            sql = (
                f"-- JFB INSERT — {book_slug} ch {lo}-{hi} "
                f"({len(batch)} rows)\n"
                "INSERT INTO commentaries (\n"
                "  scholar_id, book_id, chapter, verse_start, verse_end,\n"
                "  verse_reference, author, source, commentary_text,\n"
                "  featured, founder_curated, author_type, status\n"
                ") VALUES\n"
                + ",\n".join(values)
                + ";\n"
            )
            (SQL_OUT / fname).write_text(sql)
            seq += 1
    return seq


def main() -> None:
    records = load_all_records()
    total_rows = len(records)
    total_chars = sum(r["body_chars"] for r in records)

    n_files = emit_batches(records)
    print(f"Emitted {n_files} SQL batch files to {SQL_OUT}")
    print(f"Total rows: {total_rows}  |  total body chars: {total_chars:,}")

    # Coverage summary by book
    by_book: dict[str, int] = {}
    for r in records:
        by_book[r["book_slug"]] = by_book.get(r["book_slug"], 0) + 1
    missing_books = [slug for (_, slug, _) in extract_jfb.JFB_BOOKS
                     if slug not in by_book]
    if missing_books:
        print(f"[warn] missing books: {missing_books}")


if __name__ == "__main__":
    main()
