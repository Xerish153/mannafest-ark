#!/usr/bin/env python3
"""
John Wesley Notes on the Bible extractor.

Parses /MannaFest/wesley-data/notes.doc — this file is MS-Word-saved-as-HTML
with ThML-derived classes (`div1`..`div5`). Covers BOTH Testaments:
  - NT (1754 *Explanatory Notes Upon the New Testament*)
  - OT (1765-1766 *Explanatory Notes Upon the Old Testament*)

Navigation signals
------------------
  - `<h2 class="div2">` → book-level section header
    e.g. "NOTES ON THE GOSPEL ACCORDING TO ST. MATTHEW"
         "NOTES ON ST. PAUL'S EPISTLE TO THE ROMANS"
         "NOTES ON THE BOOK OF JONAH"
  - `<h3 class="div3">` → chapter-level section header
    Roman numerals like "I", "II", "III". Book-prefix sections
    ("ST. MATTHEW", "Introduction to Matthew") are skipped.

Strategy
--------
  1. Load notes.doc, parse with bs4/lxml.
  2. Find all elements with class=div2. Filter to those whose text starts
     with "NOTES" — that excludes PREFACE and Indexes.
  3. For each book-div2, map heading text → canonical book_id.
  4. Within the book's DOM range (from its div2 to the next div2), find
     all div3 Roman-numeral chapter headers in document order.
  5. For each chapter, collect all sibling content between its div3 and
     the next div3 (or end of book).
  6. Render to cleaned plain text.

Outputs
-------
  - JSON per book to /tmp/wesley-extracted/wesley_{book_id:02d}_{slug}.json
  - Summary on __main__.
"""
from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Iterator

from bs4 import BeautifulSoup, NavigableString, Tag

WESLEY_FILE = Path(
    "/sessions/zealous-wonderful-fermi/mnt/MannaFest/wesley-data/notes.doc"
)
OUT_DIR = Path("/sessions/zealous-wonderful-fermi/tmp/wesley-extracted")
OUT_DIR.mkdir(parents=True, exist_ok=True)

# Book name recognition — match distinctive keywords against h2 text.
# Order matters: more specific patterns first (e.g. "1 KINGS" before "KINGS").
BOOK_PATTERNS: list[tuple[re.Pattern, int, str]] = [
    # NT
    (re.compile(r'\bMATTHEW\b', re.I), 40, "matthew"),
    (re.compile(r'\bMARK\b', re.I), 41, "mark"),
    (re.compile(r'\bLUKE\b', re.I), 42, "luke"),
    (re.compile(r'\bJOHN\b.*GOSPEL|GOSPEL.*JOHN', re.I), 43, "john"),
    (re.compile(r'\bACTS\b', re.I), 44, "acts"),
    (re.compile(r'\bROMANS\b', re.I), 45, "romans"),
    (re.compile(r'\bFIRST EPISTLE\b.*CORINTH', re.I), 46, "1-corinthians"),
    (re.compile(r'\bSECOND EPISTLE\b.*CORINTH', re.I), 47, "2-corinthians"),
    (re.compile(r'\bGALATIANS\b', re.I), 48, "galatians"),
    (re.compile(r'\bEPHESIANS\b', re.I), 49, "ephesians"),
    (re.compile(r'\bPHILIPPIANS\b', re.I), 50, "philippians"),
    (re.compile(r'\bCOLOSSIANS\b', re.I), 51, "colossians"),
    (re.compile(r'\bFIRST EPISTLE\b.*THESSAL', re.I), 52, "1-thessalonians"),
    (re.compile(r'\bSECOND EPISTLE\b.*THESSAL', re.I), 53, "2-thessalonians"),
    (re.compile(r'\bFIRST EPISTLE\b.*TIMOTHY', re.I), 54, "1-timothy"),
    (re.compile(r'\bSECOND EPISTLE\b.*TIMOTHY', re.I), 55, "2-timothy"),
    (re.compile(r'\bTITUS\b', re.I), 56, "titus"),
    (re.compile(r'\bPHILEMON\b', re.I), 57, "philemon"),
    (re.compile(r'\bHEBREWS\b', re.I), 58, "hebrews"),
    (re.compile(r'\bJAMES\b', re.I), 59, "james"),
    (re.compile(r'\bFIRST EPISTLE\b.*PETER', re.I), 60, "1-peter"),
    (re.compile(r'\bSECOND EPISTLE\b.*PETER', re.I), 61, "2-peter"),
    (re.compile(r'\bFIRST EPISTLE\b.*JOHN\b|JOHN\'?S FIRST', re.I),
     62, "1-john"),
    (re.compile(r'\bSECOND EPISTLE\b.*JOHN\b|JOHN\'?S SECOND', re.I),
     63, "2-john"),
    (re.compile(r'\bTHIRD EPISTLE\b.*JOHN\b|JOHN\'?S THIRD', re.I),
     64, "3-john"),
    (re.compile(r'\bJUDE\b', re.I), 65, "jude"),
    (re.compile(r'\bREVELATION\b', re.I), 66, "revelation"),
    # OT
    (re.compile(r'\bGENESIS\b', re.I), 1, "genesis"),
    (re.compile(r'\bEXODUS\b', re.I), 2, "exodus"),
    (re.compile(r'\bLEVITICUS\b', re.I), 3, "leviticus"),
    (re.compile(r'\bNUMBERS\b', re.I), 4, "numbers"),
    (re.compile(r'\bDEUTERONOMY\b', re.I), 5, "deuteronomy"),
    (re.compile(r'\bJOSHUA\b', re.I), 6, "joshua"),
    (re.compile(r'\bJUDGES\b', re.I), 7, "judges"),
    (re.compile(r'\bRUTH\b', re.I), 8, "ruth"),
    (re.compile(r'\bFIRST.*SAMUEL|1 SAMUEL', re.I), 9, "1-samuel"),
    (re.compile(r'\bSECOND.*SAMUEL|2 SAMUEL', re.I), 10, "2-samuel"),
    (re.compile(r'\bFIRST.*KINGS|1 KINGS', re.I), 11, "1-kings"),
    (re.compile(r'\bSECOND.*KINGS|2 KINGS', re.I), 12, "2-kings"),
    (re.compile(r'\bFIRST.*CHRONICLES|1 CHRONICLES', re.I),
     13, "1-chronicles"),
    (re.compile(r'\bSECOND.*CHRONICLES|2 CHRONICLES', re.I),
     14, "2-chronicles"),
    (re.compile(r'\bEZRA\b', re.I), 15, "ezra"),
    (re.compile(r'\bNEHEMIAH\b', re.I), 16, "nehemiah"),
    (re.compile(r'\bESTHER\b', re.I), 17, "esther"),
    (re.compile(r'\bJOB\b', re.I), 18, "job"),
    (re.compile(r'\bPSALMS?\b', re.I), 19, "psalms"),
    (re.compile(r'\bPROVERBS\b', re.I), 20, "proverbs"),
    (re.compile(r'\bECCLESIASTES\b', re.I), 21, "ecclesiastes"),
    (re.compile(r'\bSONG\b.*SOLOMON|SOLOMON.*SONG|CANTICLES', re.I),
     22, "song-of-solomon"),
    (re.compile(r'\bISAIAH\b', re.I), 23, "isaiah"),
    # LAMENTATIONS must precede JEREMIAH in this list because Wesley's
    # Lamentations h2 reads "NOTES ON THE LAMENTATIONS OF JEREMIAH" and
    # would otherwise be captured by the JEREMIAH pattern first.
    (re.compile(r'\bLAMENTATIONS\b', re.I), 25, "lamentations"),
    (re.compile(r'\bJEREMIAH\b', re.I), 24, "jeremiah"),
    (re.compile(r'\bEZEKIEL\b', re.I), 26, "ezekiel"),
    (re.compile(r'\bDANIEL\b', re.I), 27, "daniel"),
    (re.compile(r'\bHOSEA\b', re.I), 28, "hosea"),
    (re.compile(r'\bJOEL\b', re.I), 29, "joel"),
    (re.compile(r'\bAMOS\b', re.I), 30, "amos"),
    (re.compile(r'\bOBADIAH\b', re.I), 31, "obadiah"),
    (re.compile(r'\bJONAH\b', re.I), 32, "jonah"),
    (re.compile(r'\bMICAH\b', re.I), 33, "micah"),
    (re.compile(r'\bNAHUM\b', re.I), 34, "nahum"),
    (re.compile(r'\bHABAKKUK\b', re.I), 35, "habakkuk"),
    (re.compile(r'\bZEPHANIAH\b', re.I), 36, "zephaniah"),
    (re.compile(r'\bHAGGAI\b', re.I), 37, "haggai"),
    (re.compile(r'\bZECHARIAH\b', re.I), 38, "zechariah"),
    (re.compile(r'\bMALACHI\b', re.I), 39, "malachi"),
]

# Chapter-number parsers.
# Roman numerals for most OT/NT books: I, II, ..., LII (Jeremiah has 52).
# Arabic numerals for Psalms (1-150) where Wesley's file uses plain digits.
ROMAN_RE = re.compile(r'^[IVXLCDM]+$', re.IGNORECASE)
ARABIC_RE = re.compile(r'^\d{1,3}$')
# Single-chapter books (Obadiah, 2-John, 3-John, Jude, Philemon) that use
# "Commentary on {Book}" div3 instead of I/II markers.
SINGLE_CHAPTER_DIV3_RE = re.compile(
    r'^\s*Commentary on (Obadiah|Philemon|2 John|3 John|Jude)\s*$',
    re.IGNORECASE,
)


def roman_to_int(r: str) -> int:
    r = r.upper()
    vals = {"I": 1, "V": 5, "X": 10, "L": 50, "C": 100, "D": 500, "M": 1000}
    total, prev = 0, 0
    for ch in reversed(r):
        v = vals.get(ch, 0)
        if v < prev:
            total -= v
        else:
            total += v
        prev = v
    return total


def book_id_for_h2(text: str) -> tuple[int, str] | None:
    """Map a div2 heading to (book_id, slug) using pattern matching.

    First matching pattern wins; the pattern list is ordered such that
    NT comes before OT (file layout) and more specific patterns (e.g.
    "FIRST EPISTLE ... CORINTHIANS") come before generic ones.
    """
    for pat, bid, slug in BOOK_PATTERNS:
        if pat.search(text):
            return bid, slug
    return None


def clean_node_text(node) -> str:
    """Recursively render a bs4 node to plain text, preserving paragraph
    breaks, dropping link hrefs, stripping style/script/head."""
    if isinstance(node, NavigableString):
        return str(node)
    if not isinstance(node, Tag):
        return ""
    if node.name in ("script", "style", "meta", "head"):
        return ""
    # Skip nested headers (chapter / book markers already consumed above)
    if node.name in ("h1", "h2", "h3", "h4", "h5", "h6"):
        return ""
    # Paragraph boundary
    if node.name == "p":
        inner = "".join(clean_node_text(c) for c in node.children)
        return "\n\n" + inner.strip() + "\n"
    if node.name == "br":
        return "\n"
    # Preserve italic / bold as plain text
    return "".join(clean_node_text(c) for c in node.children)


def normalize(s: str) -> str:
    s = s.replace("\xa0", " ")
    lines = [re.sub(r'[ \t]+', ' ', ln).strip() for ln in s.split("\n")]
    s = "\n".join(lines)
    s = re.sub(r'\n{3,}', '\n\n', s)
    return s.strip()


def iter_following_nodes(start_tag: Tag) -> Iterator[Tag]:
    """Yield all following-sibling elements (and sibling-descendants)
    in document order until we run out."""
    cur = start_tag.find_next()
    while cur is not None:
        yield cur
        cur = cur.find_next()


def is_div(tag, cls: str) -> bool:
    if not isinstance(tag, Tag):
        return False
    classes = tag.get("class", []) or []
    if isinstance(classes, str):
        classes = classes.split()
    return cls in classes


def extract_all() -> list[dict]:
    text = WESLEY_FILE.read_bytes().decode("utf-8", errors="replace")
    soup = BeautifulSoup(text, "lxml")

    # Find all div2 headings in doc order
    all_div2 = [t for t in soup.find_all(True)
                if is_div(t, "div2")]

    # Keep only the book-level div2s (those starting with "NOTES")
    book_headers: list[tuple[Tag, int, str]] = []
    for h in all_div2:
        txt = h.get_text(" ", strip=True)
        if not txt.upper().startswith("NOTES"):
            continue
        mapped = book_id_for_h2(txt)
        if not mapped:
            print(f"  [warn] unmapped div2: {txt[:80]!r}")
            continue
        book_headers.append((h, mapped[0], mapped[1]))

    # Build a fast positional index so we can bound each book to the
    # next book-header (or next non-book div2, e.g. the Indexes section)
    # whichever comes first.
    all_div2_positions = {id(h): i for i, h in enumerate(all_div2)}

    records: list[dict] = []
    dedup: set[tuple[int, int]] = set()
    for i, (h, book_id, slug) in enumerate(book_headers):
        start_pos = all_div2_positions[id(h)]
        # End bound: next div2 of any kind
        if start_pos + 1 < len(all_div2):
            end_marker = all_div2[start_pos + 1]
        else:
            end_marker = None

        # Find all div3 chapter markers between h and end_marker.
        # Wesley uses three formats:
        #   Roman numerals: I, II, ..., LII  (most OT/NT books)
        #   Arabic numerals: 1, 2, ..., 150  (Psalms only)
        #   "Commentary on {Book}"           (single-chapter Obadiah/Phm/
        #                                     Jude/2-John/3-John fallback)
        current = h.find_next()
        chapter_tags: list[tuple[int, Tag]] = []
        while current is not None and current is not end_marker:
            if is_div(current, "div3"):
                ctxt = current.get_text(" ", strip=True)
                ch_num: int | None = None
                if ROMAN_RE.fullmatch(ctxt):
                    try:
                        ch_num = roman_to_int(ctxt)
                    except Exception:
                        ch_num = None
                elif ARABIC_RE.fullmatch(ctxt):
                    ch_num = int(ctxt)
                elif SINGLE_CHAPTER_DIV3_RE.match(ctxt):
                    ch_num = 1
                if ch_num is not None and 1 <= ch_num <= 200:
                    chapter_tags.append((ch_num, current))
                # Otherwise it's "Introduction to ..." or book title —
                # skipped silently.
            current = current.find_next()

        # Collect text for each chapter — from its div3 to the next
        # div3 or book boundary.
        for j, (ch_num, ch_tag) in enumerate(chapter_tags):
            if j + 1 < len(chapter_tags):
                ch_end = chapter_tags[j + 1][1]
            else:
                ch_end = end_marker
            chunks: list[str] = []
            cur = ch_tag.find_next()
            while cur is not None and cur is not ch_end:
                # Avoid reprocessing nested tags: only take "interesting"
                # container tags, skip div2/div3/div4 headers
                if is_div(cur, "div2") or is_div(cur, "div3"):
                    break
                if cur.name in ("p",):
                    chunks.append(clean_node_text(cur))
                cur = cur.find_next()

            raw = "".join(chunks)
            body = normalize(raw)
            # Skip empty chapters
            if not body or len(body) < 10:
                continue
            key = (book_id, ch_num)
            if key in dedup:
                continue
            dedup.add(key)
            records.append({
                "book_id": book_id,
                "book_slug": slug,
                "chapter": ch_num,
                "body": body,
                "body_chars": len(body),
                "body_words": len(body.split()),
            })

    return records


def main() -> None:
    records = extract_all()
    # Group by book for file output
    by_book: dict[tuple[int, str], list[dict]] = {}
    for r in records:
        key = (r["book_id"], r["book_slug"])
        by_book.setdefault(key, []).append(r)

    for (book_id, slug), recs in sorted(by_book.items()):
        recs.sort(key=lambda x: x["chapter"])
        out = OUT_DIR / f"wesley_{book_id:02d}_{slug}.json"
        out.write_text(json.dumps(recs, indent=2))

    nt_count = sum(1 for r in records if r["book_id"] >= 40)
    ot_count = sum(1 for r in records if r["book_id"] < 40)
    total_chars = sum(r["body_chars"] for r in records)
    print(f"Extracted {len(records)} chapters across {len(by_book)} books "
          f"({nt_count} NT, {ot_count} OT), total {total_chars:,} chars.")

    short = [r for r in records if r["body_chars"] < 200]
    if short:
        print(f"[flag] {len(short)} chapters shorter than 200 chars:")
        for r in short[:10]:
            print(f"    {r['book_slug']} {r['chapter']}: "
                  f"{r['body_chars']} chars")


if __name__ == "__main__":
    main()
