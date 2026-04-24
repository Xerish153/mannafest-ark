#!/usr/bin/env python3
"""
Calvin commentary extractor (v2).

Reads CCEL plain-text calcom*.txt files at /MannaFest/calvin-data/
Emits JSON: one record per (book, chapter) with cleaned commentary body.

Strategy:
  The authoritative chapter anchor is the FIRST "Book N:start-end" verse-range
  header for each new chapter number — more robust than "CHAPTER N." markers,
  which vary in format across volumes (CHAPTER 1 vs CHAPTER 1. vs PSALM 1) and
  are occasionally omitted (Calvin merged Gen 33+34 in CCEL's layout).

Within each chapter block:
  - Commentary prose begins after all verse-listing pairs (English + Latin).
  - Identified as the first paragraph >=5 lines that starts with "N. " or
    "Verse N." followed by English prose.
"""

import json
import re
import sys
from pathlib import Path

CALVIN_DIR = Path("/sessions/zealous-wonderful-fermi/mnt/MannaFest/calvin-data")
OUT_DIR = Path("/sessions/zealous-wonderful-fermi/tmp/calvin-extracted")
OUT_DIR.mkdir(parents=True, exist_ok=True)

# Volume → book mapping for STRAIGHT (single-book) volumes.
# Harmony volumes (calcom03-06, calcom31-33) and multi-book vols
# (calcom27-30, calcom41-43, calcom45) get handled separately.
STRAIGHT_VOLS = {
    "calcom01": {"book": "Genesis", "book_id": 1},
    "calcom02": {"book": "Genesis", "book_id": 1},
    "calcom07": {"book": "Joshua", "book_id": 6},
    "calcom08": {"book": "Psalms", "book_id": 19},
    "calcom09": {"book": "Psalms", "book_id": 19},
    "calcom10": {"book": "Psalms", "book_id": 19},
    "calcom11": {"book": "Psalms", "book_id": 19},
    "calcom12": {"book": "Psalms", "book_id": 19},
    "calcom13": {"book": "Isaiah", "book_id": 23},
    "calcom14": {"book": "Isaiah", "book_id": 23},
    "calcom15": {"book": "Isaiah", "book_id": 23},
    "calcom16": {"book": "Isaiah", "book_id": 23},
    "calcom17": {"book": "Jeremiah", "book_id": 24},
    "calcom18": {"book": "Jeremiah", "book_id": 24},
    "calcom19": {"book": "Jeremiah", "book_id": 24},
    "calcom20": {"book": "Jeremiah", "book_id": 24},
    # calcom21 = Jer + Lam tail; handle with per-header book detection
    "calcom22": {"book": "Ezekiel", "book_id": 26},
    "calcom23": {"book": "Ezekiel", "book_id": 26},
    "calcom24": {"book": "Daniel", "book_id": 27},
    "calcom25": {"book": "Daniel", "book_id": 27},
    "calcom26": {"book": "Hosea", "book_id": 28},
    "calcom34": {"book": "John", "book_id": 43},
    "calcom35": {"book": "John", "book_id": 43},
    "calcom36": {"book": "Acts", "book_id": 44},
    "calcom37": {"book": "Acts", "book_id": 44},
    "calcom38": {"book": "Romans", "book_id": 45},
    "calcom39": {"book": "1 Corinthians", "book_id": 46},
    # calcom40 (Corinthians Vol 2) actually holds 1 Cor 15-16 at its start
    # plus all of 2 Cor. Promoted to MULTI_BOOK_VOLS below.
    "calcom44": {"book": "Hebrews", "book_id": 58},
}

# Multi-book volumes: header text says exactly which book each chapter maps to.
# Listed for documentation; extraction is driven by per-header book detection.
MULTI_BOOK_VOLS = {
    "calcom21": ["Jeremiah", "Lamentations"],
    "calcom27": ["Joel", "Amos", "Obadiah"],
    "calcom28": ["Jonah", "Micah", "Nahum"],
    "calcom29": ["Habakkuk", "Zephaniah", "Haggai"],
    "calcom30": ["Zechariah", "Malachi"],
    # calcom40: Corinthians Vol 2. Begins with 1 Cor 15-16 (overflow from
    # Vol 1 = calcom39 which ended at ch 14), then covers all of 2 Cor.
    "calcom40": ["1 Corinthians", "2 Corinthians"],
    "calcom41": ["Galatians", "Ephesians"],
    "calcom42": ["Philippians", "Colossians",
                 "1 Thessalonians", "2 Thessalonians"],
    "calcom43": ["1 Timothy", "2 Timothy", "Titus", "Philemon"],
    "calcom45": ["James", "1 Peter", "2 Peter", "1 John", "Jude"],
}

# Books with only one chapter use a verse-only header form:
#   "Philemon 1-7", "Jude 1-2"  (no chapter number)
# Handled by a separate regex that assigns chapter=1 implicitly.
SINGLE_CHAPTER_BOOKS = {"Philemon", "Jude", "2 John", "3 John", "Obadiah"}

HARMONY_LAW_VOLS = ["calcom03", "calcom04", "calcom05", "calcom06"]  # Ex-Deut
HARMONY_GOSPEL_VOLS = ["calcom31", "calcom32", "calcom33"]  # Matt/Mark/Luke

BOOK_ID = {
    "Genesis": 1, "Exodus": 2, "Leviticus": 3, "Numbers": 4, "Deuteronomy": 5,
    "Joshua": 6,
    "Psalms": 19, "Psalm": 19,
    "Isaiah": 23, "Jeremiah": 24, "Lamentations": 25,
    "Ezekiel": 26, "Daniel": 27,
    "Hosea": 28, "Joel": 29, "Amos": 30, "Obadiah": 31, "Jonah": 32,
    "Micah": 33, "Nahum": 34, "Habakkuk": 35, "Zephaniah": 36,
    "Haggai": 37, "Zechariah": 38, "Malachi": 39,
    "Matthew": 40, "Mark": 41, "Luke": 42, "John": 43,
    "Acts": 44, "Romans": 45,
    "1 Corinthians": 46, "2 Corinthians": 47,
    "Galatians": 48, "Ephesians": 49, "Philippians": 50,
    "Colossians": 51, "1 Thessalonians": 52, "2 Thessalonians": 53,
    "1 Timothy": 54, "2 Timothy": 55, "Titus": 56, "Philemon": 57,
    "Hebrews": 58, "James": 59,
    "1 Peter": 60, "2 Peter": 61, "1 John": 62, "Jude": 65,
}

# Verse-range header. Formats seen in calcom*.txt:
#   Genesis 1:1-31                  (most common)
#   Psalm 1:1-2                     (Psalm singular)
#   Hebrews Chapter 3:1-6           (Hebrews inserts "Chapter")
#   1 Corinthians 1:1-9             (book names with leading digit)
#   2 Thessalonians 1:1-4
# Book names can have leading digit ("1 Corinthians") and multiple words
# ("Song of Solomon"). The optional "Chapter" keyword lives between book
# name and chapter number.
VERSE_RANGE_RE = re.compile(
    r'^(?P<indent>\s*)'
    r'(?P<book>(?:[1-3]\s)?[A-Z][a-z]+(?:\s[A-Z][a-z]+)*)'
    r'(?:\s+Chapter)?\s+'
    r'(?P<chap>\d+):(?P<vstart>\d+)(?:-(?P<vend>\d+))?\s*$',
    re.MULTILINE,
)

# Verse-only header for single-chapter books: "Philemon 1-7", "Jude 1-2"
SINGLE_CH_RE = re.compile(
    r'^(?P<indent>\s*)'
    r'(?P<book>Philemon|Jude|2 John|3 John|Obadiah)'
    r'\s+(?P<vstart>\d+)(?:-(?P<vend>\d+))?\s*$',
    re.MULTILINE,
)

FOOTNOTE_RE = re.compile(r'\[\d+\]')


def load_file(path: Path) -> str:
    with open(path, "rb") as f:
        raw = f.read()
    try:
        return raw.decode("utf-8")
    except UnicodeDecodeError:
        return raw.decode("latin-1")


def find_chapter_boundaries(text: str, allowed_books: set[str]) -> list[dict]:
    """
    Find the FIRST verse-range header for each new (book, chapter) pair.
    Returns list of {book, chapter, offset} sorted by offset.
    """
    seen = set()
    boundaries = []
    # Collect ALL matches first; pick best boundary per (book, chapter) below.
    candidates: dict[tuple[str, int], list[dict]] = {}
    for m in VERSE_RANGE_RE.finditer(text):
        book = m.group("book").strip()
        if book.endswith(" Chapter"):
            book = book[:-len(" Chapter")]
        book_norm = "Psalms" if book == "Psalm" else book
        if book_norm not in allowed_books:
            continue
        chap = int(m.group("chap"))
        vstart = int(m.group("vstart"))
        vend = int(m.group("vend")) if m.group("vend") else vstart
        line_start = text.rfind("\n", 0, m.start()) + 1
        candidates.setdefault((book_norm, chap), []).append({
            "book": book_norm,
            "book_id": BOOK_ID[book_norm],
            "chapter": chap,
            "vstart": vstart,
            "vend": vend,
            "offset": line_start,
        })

    # Pick best candidate per (book, chapter):
    #   Prefer ones where vstart=1 (chapter-opening listings) — preface citations
    #   often don't start at verse 1. Among vstart=1 candidates, pick the one
    #   with the largest vend (chapter headers cover the whole first listing
    #   block; citations like "Genesis 1:1-6" in a preface cover only a snippet).
    #   Fallback: earliest offset.
    for key, cands in candidates.items():
        v1 = [c for c in cands if c["vstart"] == 1]
        pool = v1 if v1 else cands
        chosen = max(pool, key=lambda c: (c["vend"], -c["offset"]))
        boundaries.append({
            "book": chosen["book"],
            "book_id": chosen["book_id"],
            "chapter": chosen["chapter"],
            "offset": chosen["offset"],
        })
        seen.add(key)

    # Second pass: single-chapter books with verse-only headers
    for m in SINGLE_CH_RE.finditer(text):
        book = m.group("book")
        if book not in allowed_books:
            continue
        key = (book, 1)
        if key in seen:
            continue
        seen.add(key)
        line_start = text.rfind("\n", 0, m.start()) + 1
        boundaries.append({
            "book": book,
            "book_id": BOOK_ID[book],
            "chapter": 1,
            "offset": line_start,
        })

    boundaries.sort(key=lambda b: b["offset"])
    return boundaries


def find_commentary_start(block: str) -> int | None:
    """
    Find where verse-listings end and Calvin's commentary prose begins.

    Verse-listing paragraphs come in English+Latin pairs sharing the same
    verse number. Commentary paragraphs stand alone — the next paragraph
    either has a different verse number or doesn't start with "N.".
    """
    parts = re.split(r'\n\s*\n', block)
    for i, para in enumerate(parts):
        lines = [ln for ln in para.split("\n") if ln.strip()]
        if len(lines) < 4:
            continue
        first_line = lines[0].lstrip()
        # Period after verse number is optional: "1." (most vols) vs "1" (calcom45)
        m = re.match(r'^(\d+)\.?\s+', first_line) or re.match(
            r'^Verse\s+(\d+)', first_line)
        if not m:
            continue
        this_verse = int(m.group(1))
        # Peek at the NEXT non-trivial paragraph. If it ALSO starts with
        # "{this_verse}." then we're looking at the English/Latin pair in
        # the verse-listing block, not commentary.
        next_verse_match = None
        for j in range(i + 1, min(i + 4, len(parts))):
            next_lines = [ln for ln in parts[j].split("\n") if ln.strip()]
            if not next_lines:
                continue
            nfirst = next_lines[0].lstrip()
            nm = re.match(r'^(\d+)\.\s+', nfirst)
            if nm:
                next_verse_match = int(nm.group(1))
                break
        if next_verse_match == this_verse:
            # verse listing pair (English + Latin both start with same number)
            continue
        # Commentary signals: substantial length (≥60 words) AND English prose
        words = sum(len(ln.split()) for ln in lines)
        if words < 60:
            continue
        rest = " ".join(lines[1:]).lower() if len(lines) > 1 else first_line.lower()
        english_markers = (
            " the ", " and ", " that ", " which ", " this ",
            " from ", " with ", " what ", " when ", " where ",
            " moses ", " christ ", " god ", " for ", " is ",
            " was ", " has ", " him ", " his ", " shall ",
        )
        if any(marker in rest for marker in english_markers):
            return block.find(para)
    return None


def clean_commentary(body: str) -> str:
    body = FOOTNOTE_RE.sub("", body)
    body = re.sub(r'\n{3,}', '\n\n', body)
    lines = [ln.lstrip() for ln in body.split("\n")]
    body = "\n".join(lines)
    paragraphs = re.split(r'\n\s*\n', body)
    paragraphs = [" ".join(p.split()) for p in paragraphs]
    paragraphs = [p for p in paragraphs if len(p) > 20]
    body = "\n\n".join(paragraphs)
    return body.strip()


def truncate_words(text: str, max_words: int) -> str:
    words = text.split()
    if len(words) <= max_words:
        return text
    # Try to end at a sentence boundary within the last ~40 words
    cutoff_char = len(" ".join(words[:max_words]))
    last_period = text.rfind(". ", 0, cutoff_char + 20)
    if last_period > len(" ".join(words[:max_words - 40])):
        return text[:last_period + 1]
    return " ".join(words[:max_words])


def extract_volume(vol_slug: str, allowed_books: set[str]) -> list[dict]:
    path = CALVIN_DIR / f"{vol_slug}.txt"
    text = load_file(path)
    boundaries = find_chapter_boundaries(text, allowed_books)
    records = []
    for i, b in enumerate(boundaries):
        end = boundaries[i + 1]["offset"] if i + 1 < len(boundaries) else len(text)
        raw_block = text[b["offset"]:end]
        comm_start = find_commentary_start(raw_block)
        body_raw = raw_block[comm_start:] if comm_start is not None else raw_block
        body = clean_commentary(body_raw)
        body = truncate_words(body, max_words=500)
        records.append({
            "book": b["book"],
            "book_id": b["book_id"],
            "chapter": b["chapter"],
            "source_volume": vol_slug,
            "body": body,
            "body_words": len(body.split()),
            "body_chars": len(body),
        })
    return records


def main():
    vol_slug = sys.argv[1] if len(sys.argv) > 1 else "calcom01"

    if vol_slug in STRAIGHT_VOLS:
        allowed = {STRAIGHT_VOLS[vol_slug]["book"]}
    elif vol_slug in MULTI_BOOK_VOLS:
        allowed = set(MULTI_BOOK_VOLS[vol_slug])
    elif vol_slug in HARMONY_LAW_VOLS:
        allowed = {"Exodus", "Leviticus", "Numbers", "Deuteronomy"}
    elif vol_slug in HARMONY_GOSPEL_VOLS:
        allowed = {"Matthew", "Mark", "Luke"}
    else:
        print(f"No mapping for {vol_slug}", file=sys.stderr)
        sys.exit(1)

    records = extract_volume(vol_slug, allowed)
    out_path = OUT_DIR / f"{vol_slug}.json"
    with open(out_path, "w") as f:
        json.dump(records, f, indent=2)

    # Summary
    by_book: dict[str, list[int]] = {}
    for r in records:
        by_book.setdefault(r["book"], []).append(r["chapter"])
    print(f"{vol_slug}: {len(records)} chapter records → {out_path}")
    for book, chaps in by_book.items():
        chaps = sorted(chaps)
        print(f"  {book}: chapters {min(chaps)}-{max(chaps)} ({len(chaps)} total)")
    if records:
        avg_words = sum(r["body_words"] for r in records) / len(records)
        print(f"  avg body: {avg_words:.0f} words")
        preview = records[0]["body"][:180].replace("\n", " ")
        print(f"  first preview: {preview}...")


if __name__ == "__main__":
    main()
