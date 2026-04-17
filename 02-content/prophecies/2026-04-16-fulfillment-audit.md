# Fulfilled prophecies missing supporting NT data — 2026-04-16

Rows in `messianic_prophecies` where `fulfillment_status = 'fulfilled'` but `nt_reference` is NULL or empty. These are mostly OT historical prophecies (Tyre, Babylon, Nineveh, Edom, Israel regathering, named kings, etc.) whose fulfillment is attested in extrabiblical history rather than the NT — so a NULL `nt_reference` is technically correct. Still, surfacing them here lets Marcus decide whether to (a) add an explanatory `nt_reference_note` column, (b) populate `nt_reference` with canonical NT/historical witness citations where applicable, or (c) leave as-is and treat "fulfilled-without-NT-reference" as a legitimate state.

Total: **44 rows**.

| id | Title | OT ref | NT ref | Fulfillment note (truncated) |
|---|---|---|---|---|
| 372 | Destruction of Tyre | Ezekiel 26:3-5 | — | Nebuchadnezzar besieged mainland Tyre for 13 years (586-573 BC). Alexander the Great later destroyed island Tyre in 332 BC… |
| 373 | Tyre Never Rebuilt | Ezekiel 26:14 | — | The original island city of Tyre was never rebuilt. Modern Sur (Lebanon) is nearby but not on the exact ancient site… |
| 374 | Tyre's Riches Thrown into the Sea | Ezekiel 26:12 | — | Alexander the Great used the rubble of mainland Tyre to build a causeway to the island city in 332 BC… |
| 375 | Babylon's Perpetual Desolation | Isaiah 13:19-20 | — | Ancient Babylon fell to Persia in 539 BC and gradually declined… |
| 376 | Babylon Conquered by Medes | Isaiah 13:17 | — | The Medo-Persian Empire under Cyrus conquered Babylon in 539 BC. The Medes were partners in this conquest. |
| 377 | Babylon's Gates Left Open | Isaiah 45:1 | — | According to Herodotus and the Cyrus Cylinder, Babylon's gates were left open during a festival… |
| 378 | Cyrus Named by Name | Isaiah 44:28 | — | Cyrus the Great conquered Babylon in 539 BC and issued the decree allowing Jews to return… |
| 379 | Babylon's Idols Carried Away | Isaiah 46:1-2 | — | When Persia conquered Babylon, the statues of Marduk and Nebo were indeed carried off… |
| 380 | Egypt No Longer Rules Nations | Ezekiel 29:15 | — | Since the Persian conquest (525 BC), Egypt has been ruled by Persians, Greeks, Romans, Arabs, Turks, British… |
| 382 | Nile Dried Up at Memphis | Isaiah 19:5-6 | — | The western branch of the Nile that fed Memphis has indeed dried up… |
| 383 | Edom's Perpetual Desolation | Ezekiel 35:9 | — | The Edomite civilization was conquered by the Nabataeans (4th century BC) and eventually disappeared… |
| 384 | Edom Conquered by Israel | Obadiah 1:18 | — | John Hyrcanus I conquered Edom (Idumea) around 125 BC and forcibly converted the population… |
| 385 | Nineveh's Destruction | Nahum 1:8 | — | In 612 BC, heavy rains caused the Tigris River to flood, destroying part of Nineveh's walls… |
| 386 | Nineveh Destroyed While Drunk | Nahum 1:10 | — | According to ancient historians (Diodorus Siculus), Nineveh fell during a festival… |
| 387 | Nineveh Never Rebuilt | Nahum 3:19 | — | Nineveh was never rebuilt after 612 BC. The ruins remained buried until rediscovered in the 19th century… |
| 388 | Israel Scattered Among Nations | Deuteronomy 28:64 | — | The Jewish diaspora following 70 AD and 135 AD spread Jews to every continent… |
| 389 | Israel Preserved as a People | Jeremiah 31:35-36 | — | Despite 2,000 years of diaspora, persecution, and attempted genocide, the Jewish people remain a distinct ethnic and religious group… |
| 390 | Israel Regathered to the Land | Isaiah 11:11-12 | — | The modern state of Israel was established in 1948. Jews have returned from over 100 countries… |
| 391 | Israel Reborn in One Day | Isaiah 66:8 | — | On May 14, 1948, Israel declared independence and was immediately recognized as a nation… |
| 392 | Hebrew Language Revived | Zephaniah 3:9 | — | Hebrew was revived as a spoken language by Eliezer Ben-Yehuda starting in the 1880s… |
| 393 | Desert Blooms in Israel | Isaiah 35:1-2 | — | Modern Israel has transformed desert into farmland through irrigation and technology… |
| 397 | Four World Empires | Daniel 2:31-45 | — | Babylon (gold), Medo-Persia (silver), Greece (bronze), and Rome (iron) appeared exactly in this sequence. |
| 398 | Greece Conquers Persia | Daniel 8:5-7 | — | Alexander the Great conquered the Persian Empire from 334-330 BC… |
| 399 | Greek Empire Divided Four Ways | Daniel 8:8, 21-22 | — | After Alexander died at 32 (323 BC), his empire was divided among four generals… |
| 400 | Antiochus Epiphanes Predicted | Daniel 8:9-12 | — | Antiochus IV Epiphanes (175-164 BC) arose from the Seleucid kingdom… |
| 401 | Philistia Destroyed | Zephaniah 2:4-5 | — | The Philistines disappeared as a people after the Babylonian and Persian periods… |
| 402 | Ammon and Moab Destroyed | Zephaniah 2:8-9 | — | Both peoples disappeared as distinct nations by the 2nd century BC… |
| 403 | Jews Sold as Slaves | Deuteronomy 28:68 | — | After the 70 AD and 135 AD revolts, thousands of Jewish slaves were shipped to Egypt… |
| 404 | Israel a Byword Among Nations | Deuteronomy 28:37 | — | Throughout history, Jews have faced unique hatred and persecution… |
| 405 | Sidon Remains but Diminished | Ezekiel 28:22-23 | — | Unlike Tyre, Sidon was never completely destroyed. It still exists today as Saida, Lebanon… |
| 406 | Petra Inhabited by Animals | Isaiah 34:13-15 | — | Petra was abandoned by the 7th century AD. When rediscovered in 1812, it was inhabited only by Bedouin and wild animals… |
| 407 | Josiah Predicted by Name | 1 Kings 13:2 | — | King Josiah (640-609 BC) fulfilled this prophecy made about 300 years earlier… |
| 408 | Samaria Falls to Assyria | Hosea 13:16 | — | Samaria fell to Assyria in 722 BC after a 3-year siege… |
| 410 | Ethiopia Brings Gifts to God | Isaiah 18:7 | — | The Ethiopian eunuch (Acts 8) was an early convert. Ethiopia became a Christian nation in the 4th century AD… |
| 509 | Tyre's Mainland Destruction by Nebuchadnezzar | Ezekiel 26:7-11 | — | Nebuchadnezzar besieged mainland Tyre for thirteen years (586-573 BC). Josephus cites Menander of Ephesus… |
| 510 | Tyre's Debris Cast Into the Sea | Ezekiel 26:12 | — | In 332 BC, Alexander the Great besieged island Tyre… Arrian and Quintus Curtius Rufus document the causeway in detail. |
| 511 | Mainland Tyre Becomes a Bare Rock | Ezekiel 26:4, 14 | — | The mainland site, called Palaetyrus, was stripped when Alexander used its materials for his causeway… |
| 512 | Babylon Falls to the Medes | Isaiah 13:17-19 | — | In 539 BC, Cyrus the Great led a Medo-Persian coalition against Babylon. Darius the Mede is named in Daniel 5:31… |
| 513 | Babylon's Stones Not Taken for Building | Jeremiah 51:26 | — | Ancient conquerors routinely dismantled conquered cities, yet Babylon's bricks and stones were largely left in place… |
| 514 | Babylon Becomes Haunt of Desert Creatures | Isaiah 13:20-22 | — | Layard and subsequent travelers document that the Babylon ruins were avoided by local Bedouins… |
| 515 | Cyrus Named by Isaiah | Isaiah 44:28; 45:1 | — | Cyrus the Great conquered Babylon in 539 BC and issued his famous decree in 538 BC… |
| 516 | Babylon's River Gates Left Open | Isaiah 45:1-2; Jer 51:30-32 | — | Herodotus and Xenophon record that Cyrus's engineers diverted the Euphrates… |
| 517 | Nineveh's Destruction by Flood and Fire | Nahum 1:8; 2:6; 3:13-15 | — | In 612 BC, a coalition of Medes, Babylonians, and Scythians besieged Nineveh… |
| 518 | Nineveh's Permanent Disappearance | Nahum 1:9, 3:19; Zeph 2:13-15 | — | Nineveh's destruction was so complete that its location was lost for over 2,400 years… |
| 519 | Egypt's Permanent Diminishment | Ezekiel 29:14-15; 30:13 | — | After Nectanebo II's defeat by Artaxerxes III in 343 BC, Egypt was ruled continuously by foreign dynasties… |
| 520 | Edom's Complete Desolation | Jer 49:17-18; Ezek 35:7-9; Oba 1:18 | — | The Edomites were displaced from their ancestral homeland by the Nabatean Arabs in the 6th century BC… |
| 521 | Petra's Eagle's Nest Fall | Obadiah 1:3-4; Jer 49:16 | — | Petra fell to Trajan in AD 106, was absorbed into the Roman Empire, and gradually depopulated… |
| 523 | Philistines Cease to Exist | Amos 1:8; Zeph 2:4-5; Zech 9:5-6 | — | The Philistines were defeated by Assyria, then absorbed by successive empires. By the time of the Maccabees, they had lost their distinct ethnic identity… |
| 524 | Ashkelon's Ruin and Shoreline Resettlement | Zephaniah 2:4-7 | — | Ashkelon was destroyed by the Mamluks in 1270 AD and remained uninhabited for nearly 700 years. In 1953, modern Ashkelon was founded… |
| 527 | Israel Preserved as a Distinct People | Jeremiah 31:35-37 | — | Despite 1,900 years of dispersion, attempted extermination, and cultural assimilation pressures, the Jewish people have retained distinct identity… |
| 528 | Israel's Regathering From Many Nations | Isa 11:11-12; Jer 31:8-10; Ezek 36:24 | — | The first regathering was the partial return under Cyrus. The 'second' began in the late 19th century… |
| 529 | Nation Born in a Day | Isaiah 66:8 | — | On May 14, 1948, at 4:00 PM, David Ben-Gurion read Israel's Declaration of Independence in Tel Aviv… |
| 530 | Desolate Land Becomes Like Eden | Ezek 36:34-35; Isa 35:1-2; Amos 9:14-15 | — | Mark Twain described Palestine in 1867 as 'a desolate country'. Since 1948, Israel has drained swamps, planted 240M+ trees… |
| 535 | Israel an International Burden | Zechariah 12:2-3 | — | Since 1948, Jerusalem's status has been continuously debated at the UN… |
| 536 | Fall of Samaria to Assyria | Hosea 13:16; Amos 3:11-12 | — | Assyria under Shalmaneser V besieged Samaria for three years; the city fell to Sargon II in 722 BC… |
| 537 | Judah's Babylonian Exile | Jer 25:11-12; 29:10 | — | The Babylonian exile is counted in various ways, all yielding ~70 years… |
| 538 | Northern Tribes Scattered and Lost | Hosea 8:8; 9:17 | — | After the 722 BC Assyrian conquest, the ten northern tribes were scattered and never returned as identifiable tribes… |
| 541 | Rabbah of the Ammonites to Be Destroyed | Ezekiel 25:5; Amos 1:14 | — | Ancient Rabbah was destroyed and for centuries lay in ruins, becoming pastureland for Bedouin camel herds… |
| 542 | Sidon Continues but Tyre Destroyed | Ezekiel 28:21-23 | — | Sidon has suffered repeatedly but has remained inhabited — unlike Tyre's mainland, which became a bare rock… |
| 543 | Bethel's Altar Desecrated by Named King Josiah | 1 Kings 13:2 | — | Josiah executed his famous religious reforms in 622 BC, nearly 310 years after the prophecy… |
| 544 | Ahab's Line Extinguished | 1 Kings 21:21-24 | — | Jehu's coup (c. 841 BC) systematically eliminated Ahab's descendants… |
| 545 | Jehu's Dynasty to Four Generations | 2 Kings 10:30; 15:12 | — | Jehu's dynasty ruled exactly four generations: Jehu → Jehoahaz → Jehoash → Jeroboam II → Zechariah… |
| 546 | Hezekiah's Life Extended 15 Years | 2 Kings 20:5-6; Isa 38:5 | — | Hezekiah's illness occurred around 701 BC. He died 15 years later, in approximately 686 BC, exactly as prophesied. |
| 547 | Assyria Will Not Enter Jerusalem | Isaiah 37:33-35 | — | In 701 BC, Sennacherib invaded Judah and destroyed 46 walled cities but Jerusalem was not captured… |
| 548 | The Medo-Persian Dual Empire | Daniel 8:3-4, 20 | — | The Medo-Persian Empire was a dual empire; the Medes were dominant initially, then Persia under Cyrus became dominant… |

## Observations

- Every single row above is an OT-history fulfillment (fall of empires, return of Jews, destruction of cities), not a NT-era messianic fulfillment. For these, `nt_reference = NULL` is arguably correct data, not a missing field. Consider adding a separate `historical_witness` or `extrabiblical_sources` column for Josephus, Herodotus, Arrian, archaeological citations.
- The 44-row count is roughly what one would expect: fulfilled prophecies with extensive `fulfillment_details` narration but no single canonical NT proof-text to cite.
- **Recommended action** (for Marcus, not auto-applied): split `fulfillment_status = 'fulfilled'` into `fulfilled-nt` (proof-text in NT) and `fulfilled-historical` (attested in secular history / archaeology) — or add a companion enum `fulfillment_witness_category` with values `nt_canonical`, `historical_extrabiblical`, `archaeological`, `continuing_state`.
