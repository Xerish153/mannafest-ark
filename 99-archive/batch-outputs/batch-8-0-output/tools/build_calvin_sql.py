#!/usr/bin/env python3
"""
Dedupe, validate, and generate SQL INSERT batches for Calvin commentary.

Reads all JSON files in /tmp/calvin-extracted/ (one per calcom volume).
Unions (book, chapter) pairs with first-volume-wins policy.
Filters impossible chapters (chapter > max_chapter for that book).
Emits:
  - coverage_report.md summary
  - sql/calvin_XXX_{book_slug}.sql INSERT batches (~50 rows each)
"""
import json
import re
from pathlib import Path

EXTRACTED = Path("/sessions/zealous-wonderful-fermi/tmp/calvin-extracted")
SQL_OUT = Path("/sessions/zealous-wonderful-fermi/tmp/calvin-sql")
SQL_OUT.mkdir(parents=True, exist_ok=True)

# Authoritative max-chapter per book, from Matthew Henry's full ingestion
MAX_CHAPTER = {
    "Genesis": 50, "Exodus": 40, "Leviticus": 27, "Numbers": 36,
    "Deuteronomy": 34, "Joshua": 24, "Psalms": 150,
    "Isaiah": 66, "Jeremiah": 52, "Lamentations": 5, "Ezekiel": 48,
    "Daniel": 12, "Hosea": 14, "Joel": 3, "Amos": 9, "Obadiah": 1,
    "Jonah": 4, "Micah": 7, "Nahum": 3, "Habakkuk": 3, "Zephaniah": 3,
    "Haggai": 2, "Zechariah": 14, "Malachi": 4,
    "Matthew": 28, "Mark": 16, "Luke": 24, "John": 21,
    "Acts": 28, "Romans": 16,
    "1 Corinthians": 16, "2 Corinthians": 13,
    "Galatians": 6, "Ephesians": 6, "Philippians": 4, "Colossians": 4,
    "1 Thessalonians": 5, "2 Thessalonians": 3,
    "1 Timothy": 6, "2 Timothy": 4, "Titus": 3, "Philemon": 1,
    "Hebrews": 13, "James": 5, "1 Peter": 5, "2 Peter": 3,
    "1 John": 5, "Jude": 1,
}

BOOK_ID = {
    "Genesis": 1, "Exodus": 2, "Leviticus": 3, "Numbers": 4, "Deuteronomy": 5,
    "Joshua": 6, "Psalms": 19,
    "Isaiah": 23, "Jeremiah": 24, "Lamentations": 25, "Ezekiel": 26,
    "Daniel": 27, "Hosea": 28, "Joel": 29, "Amos": 30, "Obadiah": 31,
    "Jonah": 32, "Micah": 33, "Nahum": 34, "Habakkuk": 35, "Zephaniah": 36,
    "Haggai": 37, "Zechariah": 38, "Malachi": 39,
    "Matthew": 40, "Mark": 41, "Luke": 42, "John": 43, "Acts": 44,
    "Romans": 45, "1 Corinthians": 46, "2 Corinthians": 47, "Galatians": 48,
    "Ephesians": 49, "Philippians": 50, "Colossians": 51,
    "1 Thessalonians": 52, "2 Thessalonians": 53,
    "1 Timothy": 54, "2 Timothy": 55, "Titus": 56, "Philemon": 57,
    "Hebrews": 58, "James": 59, "1 Peter": 60, "2 Peter": 61,
    "1 John": 62, "Jude": 65,
}

# Expected Calvin coverage per book (based on scope stated in batch 8.0 prompt)
CALVIN_EXPECTED = {
    "Genesis": (1, 50), "Exodus": (1, 40), "Leviticus": (1, 27),
    "Numbers": (1, 36), "Deuteronomy": (1, 34), "Joshua": (1, 24),
    "Psalms": (1, 150), "Isaiah": (1, 66), "Jeremiah": (1, 52),
    "Lamentations": (1, 5), "Ezekiel": (1, 20),  # Calvin died before ch 21
    "Daniel": (1, 12), "Hosea": (1, 14), "Joel": (1, 3), "Amos": (1, 9),
    "Obadiah": (1, 1), "Jonah": (1, 4), "Micah": (1, 7), "Nahum": (1, 3),
    "Habakkuk": (1, 3), "Zephaniah": (1, 3), "Haggai": (1, 2),
    "Zechariah": (1, 14), "Malachi": (1, 4),
    "Matthew": (1, 28), "Mark": (1, 16), "Luke": (1, 24),
    "John": (1, 21), "Acts": (1, 28), "Romans": (1, 16),
    "1 Corinthians": (1, 16), "2 Corinthians": (1, 13),
    "Galatians": (1, 6), "Ephesians": (1, 6), "Philippians": (1, 4),
    "Colossians": (1, 4), "1 Thessalonians": (1, 5),
    "2 Thessalonians": (1, 3), "1 Timothy": (1, 6), "2 Timothy": (1, 4),
    "Titus": (1, 3), "Philemon": (1, 1), "Hebrews": (1, 13),
    "James": (1, 5), "1 Peter": (1, 5), "2 Peter": (1, 3),
    "1 John": (1, 5), "Jude": (1, 1),
}


def book_slug(book: str) -> str:
    """For verse_reference column, matches Henry's format: 'genesis-1'."""
    s = book.lower()
    # "1 Corinthians" → "1-corinthians"
    s = re.sub(r'\s+', '-', s)
    return s


def sql_escape(s: str) -> str:
    return s.replace("'", "''")


def main():
    # Load all extractions — preserve input order so first-volume-wins works
    all_records = []
    vol_files = sorted(EXTRACTED.glob("calcom*.json"))
    for vf in vol_files:
        data = json.load(open(vf))
        all_records.extend(data)

    # Dedupe: first-occurrence wins
    seen = set()
    chosen = []
    rejected_impossible = []
    rejected_dup = 0
    for r in all_records:
        key = (r["book"], r["chapter"])
        if r["book"] not in MAX_CHAPTER:
            continue
        if r["chapter"] > MAX_CHAPTER[r["book"]] or r["chapter"] < 1:
            rejected_impossible.append(r)
            continue
        if key in seen:
            rejected_dup += 1
            continue
        seen.add(key)
        chosen.append(r)

    # Group by book
    by_book: dict[str, list[dict]] = {}
    for r in chosen:
        by_book.setdefault(r["book"], []).append(r)
    for book in by_book:
        by_book[book].sort(key=lambda r: r["chapter"])

    # Coverage report
    report_lines = [
        "# Calvin Ingestion Coverage Report\n",
        f"Total unique (book, chapter) pairs: **{len(chosen)}**",
        f"Duplicates rejected (first-volume-wins dedupe): {rejected_dup}",
        f"Impossible-chapter rejections: {len(rejected_impossible)}\n",
        "## Per-book coverage vs. Calvin's documented scope\n",
        "| Book | Expected | Got | Gap | Extra (Calvin didn't cover?) |",
        "|------|----------|-----|-----|------------------------------|",
    ]
    total_expected = 0
    total_got = 0
    for book in sorted(CALVIN_EXPECTED.keys(),
                       key=lambda b: BOOK_ID.get(b, 99)):
        exp_start, exp_end = CALVIN_EXPECTED[book]
        expected = set(range(exp_start, exp_end + 1))
        got = {r["chapter"] for r in by_book.get(book, [])}
        gap = sorted(expected - got)
        extra = sorted(got - expected)
        report_lines.append(
            f"| {book} | {len(expected)} | {len(got)} | "
            f"{gap if gap else '—'} | {extra if extra else '—'} |"
        )
        total_expected += len(expected)
        total_got += len(got & expected)

    report_lines.append(f"\n**Total expected: {total_expected}**")
    report_lines.append(f"**Total covered (intersection): {total_got}** "
                        f"({100 * total_got / total_expected:.1f}%)")
    if rejected_impossible:
        report_lines.append("\n## Impossible-chapter rejections\n")
        for r in rejected_impossible:
            report_lines.append(
                f"- {r['book']} {r['chapter']} (source {r['source_volume']}) — "
                f"max is {MAX_CHAPTER.get(r['book'], '?')}"
            )

    (SQL_OUT / "coverage_report.md").write_text("\n".join(report_lines))
    print("\n".join(report_lines))

    # Emit SQL INSERT batches per book, ~50 rows per file
    # Format mirrors Henry: verse_reference='book-chapter', verse_start=1,
    # verse_end=NULL, source='Commentaries' (short, mirrors Henry's
    # 'Complete Commentary' per batch-8-0-blocker §Non-blocker #2).
    CALVIN_ID_SQL = "(SELECT id FROM scholars WHERE slug = 'calvin')"
    file_idx = 0
    for book in sorted(by_book.keys(), key=lambda b: BOOK_ID.get(b, 99)):
        records = by_book[book]
        slug_prefix = f"{BOOK_ID[book]:02d}_{book_slug(book)}"
        values = []
        for r in records:
            v_ref = f"{book_slug(book)}-{r['chapter']}"
            body = sql_escape(r["body"])
            author = "John Calvin"
            source = "Commentaries"  # mirror Henry's short form
            values.append(
                f"({CALVIN_ID_SQL}, {BOOK_ID[book]}, {r['chapter']}, 1, NULL, "
                f"'{v_ref}', '{author}', '{source}', "
                f"E'{body}', "  # E'...' for escape-string so \n works if any
                f"false, false, 'sourced', 'published')"
            )
        # Split into batches of 10 (keeps each SQL file well under 30KB
        # so it fits comfortably in a single MCP execute_sql call)
        batch_size = 10
        for i in range(0, len(values), batch_size):
            batch = values[i:i + batch_size]
            sql_path = SQL_OUT / f"calvin_{file_idx:03d}_{slug_prefix}_{i // batch_size + 1}.sql"
            sql = (
                f"-- Calvin commentary INSERT — {book} "
                f"(batch {i // batch_size + 1}, rows {i + 1}-{i + len(batch)})\n"
                f"INSERT INTO commentaries (\n"
                f"  scholar_id, book_id, chapter, verse_start, verse_end,\n"
                f"  verse_reference, author, source, commentary_text,\n"
                f"  featured, founder_curated, author_type, status\n"
                f") VALUES\n"
                + ",\n".join(batch) + ";\n"
            )
            sql_path.write_text(sql)
            file_idx += 1

    print(f"\nGenerated {file_idx} SQL batch files at {SQL_OUT}")


if __name__ == "__main__":
    main()
