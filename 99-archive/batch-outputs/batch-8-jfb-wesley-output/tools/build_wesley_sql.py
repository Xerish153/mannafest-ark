#!/usr/bin/env python3
"""
Generate SQL INSERT batches for Wesley commentary ingestion.

Reads per-book JSON from extract_wesley.py and emits 10-row INSERT statements.

Wesley's `source` column is testament-specific (the single `primary_work_title`
stored on `scholars` is a summary label — `'Notes on the Bible'` — but the
per-row `source` points at the actual work that contains that chapter's
commentary):
  - NT chapters (book_id >= 40): `'Explanatory Notes Upon the New Testament'`
  - OT chapters (book_id < 40):  `'Notes on the Old Testament'`

Hardcoded from pre-flight MCP read (2026-04-22):
  scholar_id 'wesley' = 620d504d-0a76-41f1-a87f-9b26cfab02de
"""
from __future__ import annotations

import json
from pathlib import Path

import extract_wesley  # local sibling module

EXTRACTED = Path("/sessions/zealous-wonderful-fermi/tmp/wesley-extracted")
SQL_OUT = Path("/sessions/zealous-wonderful-fermi/tmp/wesley-sql")
SQL_OUT.mkdir(parents=True, exist_ok=True)

SCHOLAR_ID_WESLEY = "620d504d-0a76-41f1-a87f-9b26cfab02de"
AUTHOR = "John Wesley"
SOURCE_NT = "Explanatory Notes Upon the New Testament"
SOURCE_OT = "Notes on the Old Testament"
BATCH_SIZE = 10


def sql_escape(s: str) -> str:
    s = s.replace("\\", "\\\\").replace("'", "''")
    s = s.replace("\x00", "")
    return s


def ensure_extracted() -> None:
    if any(EXTRACTED.glob("wesley_*.json")):
        return
    print("No extracted JSON found — running extract_wesley.py …")
    extract_wesley.main()


def load_all_records() -> list[dict]:
    ensure_extracted()
    records: list[dict] = []
    for jf in sorted(EXTRACTED.glob("wesley_*.json")):
        records.extend(json.load(open(jf)))
    return records


def source_for(book_id: int) -> str:
    return SOURCE_NT if book_id >= 40 else SOURCE_OT


def emit_batches(records: list[dict]) -> int:
    for old in SQL_OUT.glob("*.sql"):
        try:
            old.unlink()
        except PermissionError:
            pass

    by_book: dict[tuple[int, str], list[dict]] = {}
    for r in records:
        key = (r["book_id"], r["book_slug"])
        by_book.setdefault(key, []).append(r)

    seq = 0
    for (book_id, book_slug), chapters in sorted(by_book.items()):
        chapters.sort(key=lambda r: r["chapter"])
        src = source_for(book_id)
        for i in range(0, len(chapters), BATCH_SIZE):
            batch = chapters[i:i + BATCH_SIZE]
            lo, hi = batch[0]["chapter"], batch[-1]["chapter"]
            fname = (f"{seq:03d}_wesley_{book_id:02d}_{book_slug}"
                     f"_{lo}_{hi}.sql")
            values = []
            for r in batch:
                v_ref = f"{book_slug}-{r['chapter']}"
                body = sql_escape(r["body"])
                values.append(
                    f"('{SCHOLAR_ID_WESLEY}'::uuid, {book_id}, "
                    f"{r['chapter']}, 1, NULL, "
                    f"'{v_ref}', '{AUTHOR}', '{src}', "
                    f"E'{body}', "
                    f"false, false, 'sourced', 'published')"
                )
            sql = (
                f"-- Wesley INSERT — {book_slug} ch {lo}-{hi} "
                f"({len(batch)} rows, testament={'NT' if book_id >= 40 else 'OT'})\n"
                "INSERT INTO commentaries (\n"
                "  scholar_id, book_id, chapter, verse_start, verse_end,\n"
                "  verse_reference, author, source, commentary_text,\n"
                "  featured, founder_curated, author_type, status\n"
                ") VALUES\n"
                + ",\n".join(values) + ";\n"
            )
            (SQL_OUT / fname).write_text(sql)
            seq += 1
    return seq


def main() -> None:
    records = load_all_records()
    n_files = emit_batches(records)
    nt = sum(1 for r in records if r["book_id"] >= 40)
    ot = sum(1 for r in records if r["book_id"] < 40)
    total_chars = sum(r["body_chars"] for r in records)
    print(f"Emitted {n_files} SQL batch files to {SQL_OUT}")
    print(f"Total rows: {len(records)} ({nt} NT + {ot} OT)")
    print(f"Total body chars: {total_chars:,}")


if __name__ == "__main__":
    main()
