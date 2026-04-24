-- Calvin commentary INSERT — Haggai (batch 1, rows 1-2)
INSERT INTO commentaries (
  scholar_id, book_id, chapter, verse_start, verse_end,
  verse_reference, author, source, commentary_text,
  featured, founder_curated, author_type, status
) VALUES
((SELECT id FROM scholars WHERE slug = 'calvin'), 37, 1, 1, NULL, 'haggai-1', 'John Calvin', 'Commentaries', E'1. In the second year of Darius the king, in the sixth month, in the first day of the month, came the word of the LORD by Haggai the prophet unto Zerubbabel the son of Shealtiel, governor of Judah, and to Joshua the son of Josedech, the high priest, saying,

1. Anno secundo Darii regis, mense sexto, die primo mensis, datus fuit sermo Jehovae in manum Chaggai Prophetae ad Zerubbabel, filium Sealtiel, ducem Jehudah, et ad Jehosuah, filium Jehosadak, sacerdotem magnum, dicendo--

The Prophet mentions here the year, the month, and the day in which he began to rouse up the people from their sloth and idleness, by the command of God; for every one studied his own domestic interest, and had no concern for building the Temple.

This happened, he says, in the second year of Darius the king. Interpreters differ as to this time; for they do not agree as to the day or year in which the Babylonian captivity began. Some date the beginning of the seventy years at the ruin which happened under Jeconiah, before the erasing of the city, and the destruction of the Temple. It is, however, probable, that a considerable time had passed before Haggai began his office as a Prophet; for Babylon was taken twenty years, or little more, before the death of king Cyrus; his son Cambyses, who reigned eight years, succeeded him. The third king was Darius, the son of Hystaspes, whom the Jews will have to be the son of Ahasuerus by Esther; but no credit is due to their fancies; for they hazard any bold notion in matters unknown, and assert anything that may come to their brains or to their mouths; and thus they deal in fables, and for the most part without any semblance of truth. It may be sufficient for us to understand, that this Darius was the son of Hystaspes, who succeeded Cambyses, (for I omit the seven months of the Magi; for as they crept in by deceit, so shortly after they were destroyed;) and it is probable that Cambyses, who was the first-born son of Cyrus, had no male heir. Hence it was that his brother being slain by the consent of the nobles, the kingdom came to Darius. He, then, as we may learn from histories, was the third king of the Persians. Daniel says, in the fifth chapter, that the city of Babylon had been taken by Cyrus, but that Darius the Mede reigned there.

But between writers there is some disagreement on this point; though all say that Cyrus was king, yet Xenophon says, that Cyaxares was ever the first, so that Cyrus sustained only the character, as it were, of a regent. But Xenophon, as all who have any judgement, and are versed in history, well know, did not write a history, but fabled most boldly according to his own fancy; for he invents the tale that Cyrus was brought up by his maternal grandfather, Astyages.', false, false, 'sourced', 'published'),
((SELECT id FROM scholars WHERE slug = 'calvin'), 37, 2, 1, NULL, 'haggai-2', 'John Calvin', 'Commentaries', E'1. In the seventh month, in the one and twentieth day of the month, came the word of the Lord by the prophet Haggai, saying,

1. In septimo et vicesimo uno mensis (hoc est, septimo mense, vicesima prima die mensis) fuit sermo Iehovae in manu Chaggai Prophetae, dicendo.

2. Speak now to Zerubbabel the son of Shealtiel, governor of Judah, and to Joshua the son of Josedech, the high priest, and to the residue of the people, saying,

2. Dic nunc ad Zerubbabel, filium Sealtiel, ducem Jehudah, et ad Jehosuah, filium Jehosadak, sacerdotem magnum, et ad reliquias populi, dicendo.

3. Who is left among you that saw this house in her first glory? and how do ye see it now? is it not in your eyes in comparison of it as nothing?

3. Quis in vobis superstes (vel, residuus, ad verbum) qui viderit domum hanc in gloria sua priore, et quam vos videtis hanc nunc, annon prae illa sicut nihilum in oculis vestris?

4. Yet now be strong, O Zerubbabel, saith the LORD; and be strong, O Joshua, son of Josedech, the high priest; and be strong, all ye people of the land, saith the Lord, and work: for I am with you, saith the Lord of hosts:

4. Et nunc (vel, nunc tamen) fortis sis Zerubbabel, dicit Iehova, et fortis sis Jehosuah, fili Jehosadak, sacerdos magne, et fortis sis omnis populus terrae, dicit Iehova, et operamini, quia ego vobiscum, dicit Iehovah exercituum,

5. According to the word that I covenanted with you when ye came out of Egypt, so my spirit remaineth among you: fear ye not.

5. Secundum verbum quod pepigi vobiscum dum egressi estis ex Egypto; et spiritus meus stabit (vel, perseverabit) in medio vestri, ne timeatis.

The Prophet now states another reason why he had been sent by God, in order that he might obviate a temptation which might have hindered the work that was begun. We have seen that they were all stirred up by the celestial spirit to undertake the building of the Temple. But as Satan, by his many arts, attempts to turn back the godly from their course, so he had devised a reason by which the desire of the people might have been checked. Inasmuch as the old people, who had seen the splendor of the former temple, considered this temple no better than a cottage, all their zeal evaporated; for, as we have said, without a promise there will continue in men no ardor, no perseverance. Now we know what had been predicted by Ezekiel, and what all the other Prophets had testified, especially Isaiah, who had spoken highly of the excellency of the Church, and shown that it was to be superior to its ancient state. (Isaiah 33:21.) Besides, Ezekiel describes the form of the Temple, and states its dimensions.', false, false, 'sourced', 'published');
