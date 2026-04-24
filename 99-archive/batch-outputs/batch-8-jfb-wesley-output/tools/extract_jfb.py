#!/usr/bin/env python3
"""
Jamieson-Fausset-Brown (JFB) commentary extractor.

Parses the 66 JFB{NN}.htm files staged at /MannaFest/jfb-data/
(CCEL Public-Domain HTML distribution, 1871 *Commentary Critical and
Explanatory on the Whole Bible*).

Strategy
--------
Each JFB book file is standard HTML with:
  - `<A NAME="ChapterN"> </A>` anchor for every chapter
  - CENTER-wrapped `CHAPTER N` header immediately after
  - `<A NAME="Bk_N_V">` verse anchors (e.g., `Ge1_2`)
  - `<P>` blocks with `<B>` verse-quote prefixes introducing each comment
  - External `<A HREF="http://bible.gospelcom.net/...">` cross-refs that
    should be de-linked (text preserved, href dropped)

Extraction:
  1. For each JFB{NN}.htm, infer book_id from NN (01→1 Genesis, 66→66 Rev).
  2. Parse HTML with bs4.
  3. Split on ChapterN anchors. Take content between one Chapter anchor
     and the next (or end of <body>).
  4. Strip tags while preserving paragraph breaks; decode entities.
  5. Emit one record per chapter.

Outputs
-------
- JSON per book to /tmp/jfb-extracted/jfb_{book_id:02d}_{book_slug}.json
- Summary to stdout when run as __main__.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Iterable

from bs4 import BeautifulSoup, NavigableString, Tag

JFB_DIR = Path("/sessions/zealous-wonderful-fermi/mnt/MannaFest/jfb-data")
OUT_DIR = Path("/sessions/zealous-wonderful-fermi/tmp/jfb-extracted")
OUT_DIR.mkdir(parents=True, exist_ok=True)

# JFB file-number → (book_id, book_slug, max_chapters).
# Book_id matches MannaFest's public.books.id column (1..66 Protestant canon).
# max_chapters used for coverage warnings, not for gating extraction.
JFB_BOOKS: list[tuple[int, str, int]] = [
    (1, "genesis", 50), (2, "exodus", 40), (3, "leviticus", 27),
    (4, "numbers", 36), (5, "deuteronomy", 34), (6, "joshua", 24),
    (7, "judges", 21), (8, "ruth", 4), (9, "1-samuel", 31),
    (10, "2-samuel", 24), (11, "1-kings", 22), (12, "2-kings", 25),
    (13, "1-chronicles", 29), (14, "2-chronicles", 36),
    (15, "ezra", 10), (16, "nehemiah", 13), (17, "esther", 10),
    (18, "job", 42), (19, "psalms", 150), (20, "proverbs", 31),
    (21, "ecclesiastes", 12), (22, "song-of-solomon", 8),
    (23, "isaiah", 66), (24, "jeremiah", 52), (25, "lamentations", 5),
    (26, "ezekiel", 48), (27, "daniel", 12), (28, "hosea", 14),
    (29, "joel", 3), (30, "amos", 9), (31, "obadiah", 1),
    (32, "jonah", 4), (33, "micah", 7), (34, "nahum", 3),
    (35, "habakkuk", 3), (36, "zephaniah", 3), (37, "haggai", 2),
    (38, "zechariah", 14), (39, "malachi", 4),
    (40, "matthew", 28), (41, "mark", 16), (42, "luke", 24),
    (43, "john", 21), (44, "acts", 28), (45, "romans", 16),
    (46, "1-corinthians", 16), (47, "2-corinthians", 13),
    (48, "galatians", 6), (49, "ephesians", 6), (50, "philippians", 4),
    (51, "colossians", 4), (52, "1-thessalonians", 5),
    (53, "2-thessalonians", 3), (54, "1-timothy", 6),
    (55, "2-timothy", 4), (56, "titus", 3), (57, "philemon", 1),
    (58, "hebrews", 13), (59, "james", 5), (60, "1-peter", 5),
    (61, "2-peter", 3), (62, "1-john", 5), (63, "2-john", 1),
    (64, "3-john", 1), (65, "jude", 1), (66, "revelation", 22),
]

CHAPTER_ANCHOR_RE = re.compile(r'^Chapter(\d+)$')


def clean_text_node(node: Tag | NavigableString) -> str:
    """
    Convert a bs4 node subtree to cleaned plain text.
    Preserves paragraph breaks as \\n\\n, inline emphasis as plain text.
    Drops external cross-ref hyperlinks (keeps the visible reference text,
    drops the href) and drops footnote markers / navigation tables.
    """
    if isinstance(node, NavigableString):
        return str(node)

    if node.name in ("script", "style", "meta", "head"):
        return ""

    # Skip nav tables (top-of-page next/previous table)
    if node.name == "table":
        return "\n"

    # Skip the bare chapter-index CENTER block that lists all chapters as
    # bracketed numerals [[#]]
    if node.name == "center":
        txt = node.get_text(" ", strip=True)
        # chapter-index form is "[1] [2] ... [50]"
        if re.fullmatch(r'(?:\[?\d+\]?\s*){3,}', txt or ""):
            return ""
        # keep content, ensure line break after
        inner = " ".join(clean_text_node(c) for c in node.children)
        return inner + "\n"

    # Paragraph boundary
    if node.name == "p":
        inner = "".join(clean_text_node(c) for c in node.children)
        return "\n\n" + inner.strip() + "\n"

    if node.name == "br":
        return "\n"

    # Strip external cross-ref anchors but preserve their visible text
    if node.name == "a":
        return "".join(clean_text_node(c) for c in node.children)

    # Horizontal rule: hard separator
    if node.name == "hr":
        return "\n\n"

    # Treat font / b / i / em / sup as transparent
    return "".join(clean_text_node(c) for c in node.children)


def normalize_whitespace(s: str) -> str:
    # Decode lingering &nbsp; that bs4 may have normalized but some
    # CCEL files still have raw "\xa0"
    s = s.replace("\xa0", " ")
    # Collapse whitespace within lines
    lines = [re.sub(r'[ \t]+', ' ', ln).strip() for ln in s.split("\n")]
    s = "\n".join(lines)
    # Collapse 3+ newlines to 2
    s = re.sub(r'\n{3,}', '\n\n', s)
    return s.strip()


def iter_chapter_regions(soup: BeautifulSoup) -> Iterable[tuple[int, list]]:
    """
    Yield (chapter_number, list-of-sibling-nodes) pairs.
    Chapter boundaries are the `<A NAME="ChapterN"> </A>` anchors.
    Content belonging to a chapter runs from that anchor to the next
    chapter anchor or end-of-body.
    """
    body = soup.body or soup
    # Find all chapter anchors with ChapterN name
    anchors = []
    for a in body.find_all("a"):
        name = a.get("name") or a.get("NAME")
        if not name:
            continue
        m = CHAPTER_ANCHOR_RE.match(name)
        if m:
            anchors.append((int(m.group(1)), a))
    if not anchors:
        return

    # Build a flat walk of top-level body descendants so we can slice
    # by document-order position.
    all_top = list(body.descendants)
    anchor_positions = {id(a): i for i, a in enumerate(all_top)}

    # Use document-order pairing
    anchor_entries = [(chap, anchor_positions.get(id(a), -1))
                      for chap, a in anchors]
    anchor_entries = [e for e in anchor_entries if e[1] >= 0]
    anchor_entries.sort(key=lambda e: e[1])

    # For each chapter, collect body-level siblings between this anchor's
    # enclosing position and the next anchor's position.
    for idx, (chap, pos) in enumerate(anchor_entries):
        end_pos = (anchor_entries[idx + 1][1]
                   if idx + 1 < len(anchor_entries)
                   else len(all_top))
        nodes = all_top[pos:end_pos]
        yield chap, nodes


def extract_chapter_text(nodes: list) -> str:
    """Render a chapter's node list to cleaned plain text."""
    # Pick direct children that are Tags or significant strings. To
    # avoid double-processing, only render node subtrees whose PARENT
    # is a direct body child (so we don't re-render nested descendants).
    seen = set()
    chunks: list[str] = []
    for n in nodes:
        if isinstance(n, NavigableString):
            # include loose strings only if their ancestors not yet rendered
            if any(id(a) in seen for a in n.parents):
                continue
            chunks.append(str(n))
            continue
        if not isinstance(n, Tag):
            continue
        if any(id(a) in seen for a in n.parents):
            continue
        chunks.append(clean_text_node(n))
        seen.add(id(n))

    raw = "".join(chunks)
    return normalize_whitespace(raw)


def extract_book(jfb_num: int, book_id: int, book_slug: str,
                 expected_chapters: int) -> list[dict]:
    path = JFB_DIR / f"JFB{jfb_num:02d}.htm"
    if not path.exists():
        return []

    # JFB files use Windows-1252 / ISO-8859-1 in places; decode lenient.
    html = path.read_bytes().decode("utf-8", errors="replace")

    # bs4 with lxml for speed and robustness against malformed HTML.
    soup = BeautifulSoup(html, "lxml")

    # Fallback for single-chapter books (2 John / 3 John / Jude): JFB omits
    # the ChapterN anchor and uses `Introduction` + verse anchors only.
    # Treat the entire body after the Introduction anchor as chapter 1.
    body = soup.body or soup
    has_chapter_anchors = any(
        CHAPTER_ANCHOR_RE.match(
            (a.get("name") or a.get("NAME") or "")
        )
        for a in body.find_all("a")
    )
    if not has_chapter_anchors and expected_chapters == 1:
        # Start from the Introduction anchor (or first book-verse anchor) so
        # we skip the "Notice / public-domain" header + title block.
        start_anchor = None
        for a in body.find_all("a"):
            name = (a.get("name") or a.get("NAME") or "")
            if name == "Introduction" or re.match(
                r'^(2Jo|3Jo|Jude|Ob|Phm)\d*_?\d+$', name
            ):
                start_anchor = a
                break
        if start_anchor is None:
            return []
        # Walk descendants from the Introduction anchor forward
        all_top = list(body.descendants)
        try:
            start_idx = all_top.index(start_anchor)
        except ValueError:
            start_idx = 0
        nodes = all_top[start_idx:]
        body_text = extract_chapter_text(nodes)
        # Strip leading "INTRODUCTION" heading if present
        body_text = re.sub(r'^\s*INTRODUCTION\s*\n+', '', body_text,
                           count=1, flags=re.IGNORECASE)
        body_text = body_text.strip()
        return [{
            "book_id": book_id,
            "book_slug": book_slug,
            "chapter": 1,
            "body": body_text,
            "body_words": len(body_text.split()),
            "body_chars": len(body_text),
            "source_file": path.name,
        }]

    records = []
    for chap, nodes in iter_chapter_regions(soup):
        body_text = extract_chapter_text(nodes)
        # The first "paragraph" after a Chapter anchor is usually the
        # "CHAPTER N" centered heading which we want stripped; the
        # content follows. Strip a leading "CHAPTER N" line if present.
        body_text = re.sub(r'^\s*CHAPTER\s+\d+\s*\n+', '', body_text,
                           count=1, flags=re.IGNORECASE)
        # Also strip an initial verse-range header like "Ge 1:1-5" or
        # "Ps 23:1-6" if it sits at the top.
        body_text = re.sub(r'^\s*[1-3]?[A-Za-z]{2,3}\s+\d+:\d+(?:-\d+)?\s*\.?\s*\n+',
                           '', body_text, count=1)
        body_text = body_text.strip()
        records.append({
            "book_id": book_id,
            "book_slug": book_slug,
            "chapter": chap,
            "body": body_text,
            "body_words": len(body_text.split()),
            "body_chars": len(body_text),
            "source_file": path.name,
        })
    return records


def main() -> None:
    all_records: list[dict] = []
    by_book: dict[str, int] = {}
    missing: list[str] = []

    for jfb_num, book_slug, expected in JFB_BOOKS:
        recs = extract_book(jfb_num, jfb_num, book_slug, expected)
        if not recs:
            missing.append(f"JFB{jfb_num:02d}.htm ({book_slug})")
            continue
        by_book[book_slug] = len(recs)

        out_path = OUT_DIR / f"jfb_{jfb_num:02d}_{book_slug}.json"
        with open(out_path, "w") as fh:
            json.dump(recs, fh, indent=2)

        all_records.extend(recs)

        if len(recs) != expected:
            print(f"  [warn] {book_slug}: extracted {len(recs)} chapters, "
                  f"expected {expected}")

    total_chars = sum(r["body_chars"] for r in all_records)
    print(f"\nExtracted {len(all_records)} chapters across {len(by_book)} "
          f"books, total {total_chars:,} characters.")
    if missing:
        print(f"Missing source files: {missing}")

    # Flags for outliers
    short = [r for r in all_records if r["body_chars"] < 200]
    long_ = [r for r in all_records if r["body_chars"] > 100_000]
    if short:
        print(f"[flag] {len(short)} chapters shorter than 200 chars:")
        for r in short[:10]:
            print(f"    {r['book_slug']} {r['chapter']}: "
                  f"{r['body_chars']} chars")
    if long_:
        print(f"[flag] {len(long_)} chapters longer than 100k chars:")
        for r in long_[:10]:
            print(f"    {r['book_slug']} {r['chapter']}: "
                  f"{r['body_chars']} chars")


if __name__ == "__main__":
    main()
