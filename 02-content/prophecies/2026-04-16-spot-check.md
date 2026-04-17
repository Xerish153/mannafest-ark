# Visual indicator spot-check — 2026-04-16

Random 5-row sample from each `fulfillment_status` bucket, confirming `fulfillment_visual_indicator` matches the normalized status value. The `debated` bucket only contains 1 row total (id 381 — "Egypt's Desolation for 40 Years"), so only 1 sample shown there.

## fulfilled (gold-checkmark-glow)

| id | Title | OT ref | NT ref | Indicator |
|---|---|---|---|---|
| 312 | Cry of Abandonment | Psalm 22:1 | Matthew 27:46 | gold-checkmark-glow ✓ |
| 300 | Sold for Thirty Pieces of Silver | Zechariah 11:12 | Matthew 26:15 | gold-checkmark-glow ✓ |
| 346 | Highly Exalted | Isaiah 52:13 | Philippians 2:9 | gold-checkmark-glow ✓ |
| 536 | Fall of Samaria to Assyria | Hosea 13:16; Amos 3:11-12 | — | gold-checkmark-glow ✓ |
| 258 | Righteous and Just | Isaiah 11:4-5 | Acts 3:14 | gold-checkmark-glow ✓ |

## partially-fulfilled (amber-half-glow)

| id | Title | OT ref | NT ref | Indicator |
|---|---|---|---|---|
| 534 | Jerusalem Called the City of Truth | Zechariah 8:3-8 | — | amber-half-glow ✓ |
| 349 | Rules in the Midst of Enemies | Psalm 110:2 | 1 Corinthians 15:25 | amber-half-glow ✓ |
| 280 | Proclaims the Year of the Lord's Favor | Isaiah 61:2 | Luke 4:19 | amber-half-glow ✓ |
| 531 | Hebrew Language Preserved | Zephaniah 3:9 | — | amber-half-glow ✓ |
| 503 | Death Swallowed Up in Victory | Isaiah 25:8 | 1 Corinthians 15:54-55 | amber-half-glow ✓ |

## unfulfilled (sapphire-pending)

| id | Title | OT ref | NT ref | Indicator |
|---|---|---|---|---|
| 371 | Final Defeat of Satan | Genesis 3:15 | Revelation 20:10 | sapphire-pending ✓ |
| 363 | Satan Bound | Isaiah 24:21-22 | Revelation 20:2 | sapphire-pending ✓ |
| 361 | Knowledge of God Covers Earth | Isaiah 11:9 | Habakkuk 2:14 | sapphire-pending ✓ |
| 352 | Visible Return in the Clouds | Daniel 7:13 | Revelation 1:7 | sapphire-pending ✓ |
| 351 | Will Return for His People | Zechariah 14:4 | Acts 1:11 | sapphire-pending ✓ |

## debated (gray-question)

The `debated` bucket contains only 1 row total in `messianic_prophecies` (post-normalization).

| id | Title | OT ref | NT ref | Indicator |
|---|---|---|---|---|
| 381 | Egypt's Desolation for 40 Years | Ezekiel 29:11-12 | — | gray-question ✓ |

## Result

All 16 sampled rows have correct `fulfillment_visual_indicator` values for their normalized `fulfillment_status`. Migration 3 (`prophecy_status_normalization`) is verified intact. No remediation needed.
