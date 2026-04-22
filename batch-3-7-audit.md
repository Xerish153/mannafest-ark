# Batch 3.7 — Bible Canonical Completeness Audit

**Date:** 2026-04-21
**Scope:** KJV, WEB, ASV verse tables in Supabase project `ufrmssiqjtqfywthgpte` (MannaFest).
**Reference:** `ark/reference/canonical-chapter-verse-counts.json` — 66 books, 1,189 chapters, 31,102 verses (Protestant KJV canonical).

## TL;DR

✅ **Zero gaps across all three translations.** Every book × chapter × verse in KJV, WEB, and ASV matches the canonical reference exactly. No repair needed. 3,567 chapter groups audited (1,189 × 3); every one passes all three checks (row_count = canonical, distinct_verse_count = canonical, max_verse_num = canonical). Step 5 (INSERT repair) is a no-op. Step 6 (UNIQUE constraint) remains worthwhile — flagged for Marcus in the checkpoint.

## Method

Single MCP `execute_sql` returning `(translation, book, chapter, row_count, distinct_verse_count, max_verse_num)` grouped by `(translation, book, chapter)`. Each chapter is checked three ways:

1. `row_count` = canonical verse count (no missing rows, no duplicates)
2. `distinct_verse_count` = canonical verse count (no duplicate verse numbers)
3. `max_verse_num` = canonical verse count (no gaps like 1,2,4,5 that still sum right)

A chapter that fails any of the three is listed under its book with the deltas.

## Global summary

| Translation | Rows | Books | Distinct chapters | Verses |
|---|---:|---:|---:|---:|
| KJV | 31,102 | 66 | 1,189 | 31,102 |
| WEB | 31,102 | 66 | 1,189 | 31,102 |
| ASV | 31,102 | 66 | 1,189 | 31,102 |

Expected per translation: 66 books, 1,189 chapters, 31,102 verses.

## KJV

✅ **Zero gaps.** Every book has the correct chapter count. Every chapter has the correct verse count with no missing or duplicate `verse_num` rows.

### Spot-checks (3 random chapters per book, verse counts verified)

| Book | Chapters spot-checked | Result |
|---|---|---|
| Genesis | 2:✓, 8:✓, 41:✓ | pass |
| Exodus | 15:✓, 16:✓, 18:✓ | pass |
| Leviticus | 4:✓, 5:✓, 24:✓ | pass |
| Numbers | 6:✓, 28:✓, 35:✓ | pass |
| Deuteronomy | 2:✓, 3:✓, 6:✓ | pass |
| Joshua | 7:✓, 8:✓, 17:✓ | pass |
| Judges | 1:✓, 18:✓, 20:✓ | pass |
| Ruth | 2:✓, 3:✓, 4:✓ | pass |
| 1 Samuel | 8:✓, 15:✓, 19:✓ | pass |
| 2 Samuel | 1:✓, 6:✓, 9:✓ | pass |
| 1 Kings | 9:✓, 11:✓, 14:✓ | pass |
| 2 Kings | 5:✓, 7:✓, 25:✓ | pass |
| 1 Chronicles | 3:✓, 4:✓, 11:✓ | pass |
| 2 Chronicles | 7:✓, 23:✓, 25:✓ | pass |
| Ezra | 1:✓, 5:✓, 6:✓ | pass |
| Nehemiah | 8:✓, 9:✓, 12:✓ | pass |
| Esther | 2:✓, 7:✓, 10:✓ | pass |
| Job | 19:✓, 36:✓, 41:✓ | pass |
| Psalms | 50:✓, 93:✓, 148:✓ | pass |
| Proverbs | 2:✓, 3:✓, 23:✓ | pass |
| Ecclesiastes | 4:✓, 5:✓, 11:✓ | pass |
| Song of Solomon | 2:✓, 7:✓, 8:✓ | pass |
| Isaiah | 13:✓, 36:✓, 49:✓ | pass |
| Jeremiah | 24:✓, 30:✓, 41:✓ | pass |
| Lamentations | 2:✓, 3:✓, 5:✓ | pass |
| Ezekiel | 14:✓, 18:✓, 43:✓ | pass |
| Daniel | 2:✓, 11:✓, 12:✓ | pass |
| Hosea | 3:✓, 10:✓, 11:✓ | pass |
| Joel | 1:✓, 2:✓, 3:✓ | pass |
| Amos | 3:✓, 7:✓, 8:✓ | pass |
| Obadiah | 1:✓ | pass |
| Jonah | 2:✓, 3:✓, 4:✓ | pass |
| Micah | 1:✓, 2:✓, 7:✓ | pass |
| Nahum | 1:✓, 2:✓, 3:✓ | pass |
| Habakkuk | 1:✓, 2:✓, 3:✓ | pass |
| Zephaniah | 1:✓, 2:✓, 3:✓ | pass |
| Haggai | 1:✓, 2:✓ | pass |
| Zechariah | 7:✓, 8:✓, 11:✓ | pass |
| Malachi | 1:✓, 2:✓, 4:✓ | pass |
| Matthew | 5:✓, 8:✓, 24:✓ | pass |
| Mark | 9:✓, 10:✓, 12:✓ | pass |
| Luke | 13:✓, 14:✓, 19:✓ | pass |
| John | 5:✓, 8:✓, 12:✓ | pass |
| Acts | 3:✓, 16:✓, 17:✓ | pass |
| Romans | 2:✓, 14:✓, 16:✓ | pass |
| 1 Corinthians | 3:✓, 5:✓, 11:✓ | pass |
| 2 Corinthians | 7:✓, 11:✓, 13:✓ | pass |
| Galatians | 1:✓, 4:✓, 5:✓ | pass |
| Ephesians | 4:✓, 5:✓, 6:✓ | pass |
| Philippians | 1:✓, 3:✓, 4:✓ | pass |
| Colossians | 1:✓, 2:✓, 3:✓ | pass |
| 1 Thessalonians | 1:✓, 2:✓, 3:✓ | pass |
| 2 Thessalonians | 1:✓, 2:✓, 3:✓ | pass |
| 1 Timothy | 1:✓, 2:✓, 3:✓ | pass |
| 2 Timothy | 1:✓, 2:✓, 3:✓ | pass |
| Titus | 1:✓, 2:✓, 3:✓ | pass |
| Philemon | 1:✓ | pass |
| Hebrews | 3:✓, 6:✓, 9:✓ | pass |
| James | 1:✓, 3:✓, 5:✓ | pass |
| 1 Peter | 1:✓, 3:✓, 4:✓ | pass |
| 2 Peter | 1:✓, 2:✓, 3:✓ | pass |
| 1 John | 1:✓, 2:✓, 4:✓ | pass |
| 2 John | 1:✓ | pass |
| 3 John | 1:✓ | pass |
| Jude | 1:✓ | pass |
| Revelation | 3:✓, 16:✓, 19:✓ | pass |

## WEB

✅ **Zero gaps.** Every book has the correct chapter count. Every chapter has the correct verse count with no missing or duplicate `verse_num` rows.

### Spot-checks (3 random chapters per book, verse counts verified)

| Book | Chapters spot-checked | Result |
|---|---|---|
| Genesis | 2:✓, 8:✓, 41:✓ | pass |
| Exodus | 15:✓, 16:✓, 18:✓ | pass |
| Leviticus | 4:✓, 5:✓, 24:✓ | pass |
| Numbers | 6:✓, 28:✓, 35:✓ | pass |
| Deuteronomy | 2:✓, 3:✓, 6:✓ | pass |
| Joshua | 7:✓, 8:✓, 17:✓ | pass |
| Judges | 1:✓, 18:✓, 20:✓ | pass |
| Ruth | 2:✓, 3:✓, 4:✓ | pass |
| 1 Samuel | 8:✓, 15:✓, 19:✓ | pass |
| 2 Samuel | 1:✓, 6:✓, 9:✓ | pass |
| 1 Kings | 9:✓, 11:✓, 14:✓ | pass |
| 2 Kings | 5:✓, 7:✓, 25:✓ | pass |
| 1 Chronicles | 3:✓, 4:✓, 11:✓ | pass |
| 2 Chronicles | 7:✓, 23:✓, 25:✓ | pass |
| Ezra | 1:✓, 5:✓, 6:✓ | pass |
| Nehemiah | 8:✓, 9:✓, 12:✓ | pass |
| Esther | 2:✓, 7:✓, 10:✓ | pass |
| Job | 19:✓, 36:✓, 41:✓ | pass |
| Psalms | 50:✓, 93:✓, 148:✓ | pass |
| Proverbs | 2:✓, 3:✓, 23:✓ | pass |
| Ecclesiastes | 4:✓, 5:✓, 11:✓ | pass |
| Song of Solomon | 2:✓, 7:✓, 8:✓ | pass |
| Isaiah | 13:✓, 36:✓, 49:✓ | pass |
| Jeremiah | 24:✓, 30:✓, 41:✓ | pass |
| Lamentations | 2:✓, 3:✓, 5:✓ | pass |
| Ezekiel | 14:✓, 18:✓, 43:✓ | pass |
| Daniel | 2:✓, 11:✓, 12:✓ | pass |
| Hosea | 3:✓, 10:✓, 11:✓ | pass |
| Joel | 1:✓, 2:✓, 3:✓ | pass |
| Amos | 3:✓, 7:✓, 8:✓ | pass |
| Obadiah | 1:✓ | pass |
| Jonah | 2:✓, 3:✓, 4:✓ | pass |
| Micah | 1:✓, 2:✓, 7:✓ | pass |
| Nahum | 1:✓, 2:✓, 3:✓ | pass |
| Habakkuk | 1:✓, 2:✓, 3:✓ | pass |
| Zephaniah | 1:✓, 2:✓, 3:✓ | pass |
| Haggai | 1:✓, 2:✓ | pass |
| Zechariah | 7:✓, 8:✓, 11:✓ | pass |
| Malachi | 1:✓, 2:✓, 4:✓ | pass |
| Matthew | 5:✓, 8:✓, 24:✓ | pass |
| Mark | 9:✓, 10:✓, 12:✓ | pass |
| Luke | 13:✓, 14:✓, 19:✓ | pass |
| John | 5:✓, 8:✓, 12:✓ | pass |
| Acts | 3:✓, 16:✓, 17:✓ | pass |
| Romans | 2:✓, 14:✓, 16:✓ | pass |
| 1 Corinthians | 3:✓, 5:✓, 11:✓ | pass |
| 2 Corinthians | 7:✓, 11:✓, 13:✓ | pass |
| Galatians | 1:✓, 4:✓, 5:✓ | pass |
| Ephesians | 4:✓, 5:✓, 6:✓ | pass |
| Philippians | 1:✓, 3:✓, 4:✓ | pass |
| Colossians | 1:✓, 2:✓, 3:✓ | pass |
| 1 Thessalonians | 1:✓, 2:✓, 3:✓ | pass |
| 2 Thessalonians | 1:✓, 2:✓, 3:✓ | pass |
| 1 Timothy | 1:✓, 2:✓, 3:✓ | pass |
| 2 Timothy | 1:✓, 2:✓, 3:✓ | pass |
| Titus | 1:✓, 2:✓, 3:✓ | pass |
| Philemon | 1:✓ | pass |
| Hebrews | 3:✓, 6:✓, 9:✓ | pass |
| James | 1:✓, 3:✓, 5:✓ | pass |
| 1 Peter | 1:✓, 3:✓, 4:✓ | pass |
| 2 Peter | 1:✓, 2:✓, 3:✓ | pass |
| 1 John | 1:✓, 2:✓, 4:✓ | pass |
| 2 John | 1:✓ | pass |
| 3 John | 1:✓ | pass |
| Jude | 1:✓ | pass |
| Revelation | 3:✓, 16:✓, 19:✓ | pass |

## ASV

✅ **Zero gaps.** Every book has the correct chapter count. Every chapter has the correct verse count with no missing or duplicate `verse_num` rows.

### Spot-checks (3 random chapters per book, verse counts verified)

| Book | Chapters spot-checked | Result |
|---|---|---|
| Genesis | 2:✓, 8:✓, 41:✓ | pass |
| Exodus | 15:✓, 16:✓, 18:✓ | pass |
| Leviticus | 4:✓, 5:✓, 24:✓ | pass |
| Numbers | 6:✓, 28:✓, 35:✓ | pass |
| Deuteronomy | 2:✓, 3:✓, 6:✓ | pass |
| Joshua | 7:✓, 8:✓, 17:✓ | pass |
| Judges | 1:✓, 18:✓, 20:✓ | pass |
| Ruth | 2:✓, 3:✓, 4:✓ | pass |
| 1 Samuel | 8:✓, 15:✓, 19:✓ | pass |
| 2 Samuel | 1:✓, 6:✓, 9:✓ | pass |
| 1 Kings | 9:✓, 11:✓, 14:✓ | pass |
| 2 Kings | 5:✓, 7:✓, 25:✓ | pass |
| 1 Chronicles | 3:✓, 4:✓, 11:✓ | pass |
| 2 Chronicles | 7:✓, 23:✓, 25:✓ | pass |
| Ezra | 1:✓, 5:✓, 6:✓ | pass |
| Nehemiah | 8:✓, 9:✓, 12:✓ | pass |
| Esther | 2:✓, 7:✓, 10:✓ | pass |
| Job | 19:✓, 36:✓, 41:✓ | pass |
| Psalms | 50:✓, 93:✓, 148:✓ | pass |
| Proverbs | 2:✓, 3:✓, 23:✓ | pass |
| Ecclesiastes | 4:✓, 5:✓, 11:✓ | pass |
| Song of Solomon | 2:✓, 7:✓, 8:✓ | pass |
| Isaiah | 13:✓, 36:✓, 49:✓ | pass |
| Jeremiah | 24:✓, 30:✓, 41:✓ | pass |
| Lamentations | 2:✓, 3:✓, 5:✓ | pass |
| Ezekiel | 14:✓, 18:✓, 43:✓ | pass |
| Daniel | 2:✓, 11:✓, 12:✓ | pass |
| Hosea | 3:✓, 10:✓, 11:✓ | pass |
| Joel | 1:✓, 2:✓, 3:✓ | pass |
| Amos | 3:✓, 7:✓, 8:✓ | pass |
| Obadiah | 1:✓ | pass |
| Jonah | 2:✓, 3:✓, 4:✓ | pass |
| Micah | 1:✓, 2:✓, 7:✓ | pass |
| Nahum | 1:✓, 2:✓, 3:✓ | pass |
| Habakkuk | 1:✓, 2:✓, 3:✓ | pass |
| Zephaniah | 1:✓, 2:✓, 3:✓ | pass |
| Haggai | 1:✓, 2:✓ | pass |
| Zechariah | 7:✓, 8:✓, 11:✓ | pass |
| Malachi | 1:✓, 2:✓, 4:✓ | pass |
| Matthew | 5:✓, 8:✓, 24:✓ | pass |
| Mark | 9:✓, 10:✓, 12:✓ | pass |
| Luke | 13:✓, 14:✓, 19:✓ | pass |
| John | 5:✓, 8:✓, 12:✓ | pass |
| Acts | 3:✓, 16:✓, 17:✓ | pass |
| Romans | 2:✓, 14:✓, 16:✓ | pass |
| 1 Corinthians | 3:✓, 5:✓, 11:✓ | pass |
| 2 Corinthians | 7:✓, 11:✓, 13:✓ | pass |
| Galatians | 1:✓, 4:✓, 5:✓ | pass |
| Ephesians | 4:✓, 5:✓, 6:✓ | pass |
| Philippians | 1:✓, 3:✓, 4:✓ | pass |
| Colossians | 1:✓, 2:✓, 3:✓ | pass |
| 1 Thessalonians | 1:✓, 2:✓, 3:✓ | pass |
| 2 Thessalonians | 1:✓, 2:✓, 3:✓ | pass |
| 1 Timothy | 1:✓, 2:✓, 3:✓ | pass |
| 2 Timothy | 1:✓, 2:✓, 3:✓ | pass |
| Titus | 1:✓, 2:✓, 3:✓ | pass |
| Philemon | 1:✓ | pass |
| Hebrews | 3:✓, 6:✓, 9:✓ | pass |
| James | 1:✓, 3:✓, 5:✓ | pass |
| 1 Peter | 1:✓, 3:✓, 4:✓ | pass |
| 2 Peter | 1:✓, 2:✓, 3:✓ | pass |
| 1 John | 1:✓, 2:✓, 4:✓ | pass |
| 2 John | 1:✓ | pass |
| 3 John | 1:✓ | pass |
| Jude | 1:✓ | pass |
| Revelation | 3:✓, 16:✓, 19:✓ | pass |

---

## Post-repair verification (2026-04-21, after migrations 043 + 044)

Re-ran the same integrity query against `public.verses` after migration 043 added the named UNIQUE constraint and 044 dropped it again (see Step 6 finding below). Results:

| Check | Value | Pass? |
|---|---:|:---:|
| Total rows (KJV + WEB + ASV) | 93,306 | ✓ (= 31,102 × 3) |
| Chapter groups | 3,567 | ✓ (= 1,189 × 3) |
| Chapter groups where `row_count ≠ distinct_verse_count` or `row_count ≠ max_verse_num` | 0 | ✓ |
| Duplicate `(translation_id, book_id, chapter_num, verse_num)` groups across all 5 translations (155,510 rows) | 0 | ✓ |

Zero drift from the pre-repair state. Every book × chapter × translation still matches the canonical reference exactly.

## Step 6 finding — UNIQUE constraint was already in place

Migration 043 added `verses_translation_book_chapter_verse_uniq` on `(translation_id, book_id, chapter_num, verse_num)`. A pg_constraint introspection immediately afterward showed a second row:

```
verses_translation_id_book_id_chapter_num_verse_num_key
  → UNIQUE (translation_id, book_id, chapter_num, verse_num)
```

That auto-generated name is Postgres's convention for `UNIQUE (...)` declared inline in `CREATE TABLE`, not via `ADD CONSTRAINT`. Meaning the original `verses` table already carried an equivalent UNIQUE constraint all along — Step 6 was effectively a no-op. Migration 044 dropped the redundant named constraint from 043. Net DB change from the pair: zero. Both migration files are preserved in `supabase/migrations/` to keep the history honest, each with a top-of-file comment explaining the round-trip.
