-- Calvin commentary INSERT — Joel (batch 1, rows 1-3)
INSERT INTO commentaries (
  scholar_id, book_id, chapter, verse_start, verse_end,
  verse_reference, author, source, commentary_text,
  featured, founder_curated, author_type, status
) VALUES
((SELECT id FROM scholars WHERE slug = 'calvin'), 29, 1, 1, NULL, 'joel-1', 'John Calvin', 'Commentaries', E'1. The word of the Lord that came to Joel the son of Pethuel.

1. Verbum Jehovae quod fuit ad Joel, filium Pethuel.

2. Hear this, ye old men, and give ear, all ye inhabitants of the land. Hath this been in your days, or even in the days of your fathers?

2. Audite hoc senes, et auscultate omnes incolae terrae, an fuerit hoc diebus vestris, et si diebus patrum vestrorum.

3. Tell ye your children of it, and let your children tell their children, and their children another generation.

3. Super hoc filiis vestris narrate, et filii vestri filiis suis, et filii ipsorum generationi posterae.

4. That which the palmerworm hath left hath the locust eaten; and that which the locust hath left hath the cankerworm eaten; and that which the cankerworm hath the caterpiller eaten.

4. Residuum locustae comedit (est alia species) bruchus (ita ponamus, quoniam non possumus certo scire quaenam fuerint istae species) et residuum bruchi comedit locusta et residuum locustae comedit eruca (alii primo loco ponunt Erucam, est proprie chenille, et puto potius esse hoc posterius. Picardi vocant casee, quasi lysch: verisimile est deductum fuisse nomen illud vulgare ab Hebraeis, quia est fere idem: sed tamen ego non anxie sudo in istis nominibus, quia de sensu Prophetae satis constabit. Nunc venio ad inscriptionem libri.)

The word of Jehovah which came to Joel, the son of Pethuel. He names here his father; it is hence probable that he was a man well known and of some celebrity. But who this Pethuel was, all now are ignorant. And what the Hebrews hold as a general rule, that a prophet is designated, whenever his father''s name is added, appears to me frivolous; and we see how bold they are in devising such comments. When no reason for any thing appears to them, they invent some fable, and allege it as a divine truth. When, therefore, they are wont thus to trifle, I have no regard for what is held by them as a rule. But yet it is probable, that when the Prophets are mentioned as having sprung from this or that father, their fathers were men of some note.

Now what he declared by saying, that he delivered the word of the Lord, is worthy of being observed; for he shows that he claimed nothing for himself, as an individual, as though he wished to rule by his own judgment, and to subject others to his own fancies; but that he relates only what he had received from the Lord. And since the Prophets claimed no authority for themselves, except as far as they faithfully executed the office divinely committed to them, and delivered, as it were from hand to hand, what the Lord commanded, we may hence feel assured that no human doctrines ought to be admitted into the Church. Why? Because as much as men trust in themselves, so much they take away from the authority of God.', false, false, 'sourced', 'published'),
((SELECT id FROM scholars WHERE slug = 'calvin'), 29, 2, 1, NULL, 'joel-2', 'John Calvin', 'Commentaries', E'1. Blow ye the trumpet in Zion, and sound an alarm in my holy mountain: let all the inhabitants of the land tremble: for the day of the Lord cometh, for it is nigh at hand;

1. Clangite tuba in Sion, et clamate (alii vertunt, tantarizate: sed est generale verbum: clamate igitur, vel, clamorem odite) in monte sancto meo: contremiscant omnes incolae terrae, quia venit dies Jehovae, quia propinquus est.

2. A day of darkness and of gloominess, a day of clouds and of thick darkness, as the morning spread upon the mountains: a great people and a strong; there hath not been ever the like, neither shall be any more after it, even to the years of many generations.

2. Dies tenebrarum et caliginis, dies nubis et obscuritatis, sicut aurora expanditur super montes, populus magnus et robustus (vel, terribilis;) similis ei non fuit a seculo, et post eum, non addet (hoc est, non erit amplius) ad annos generationis et generationis (ego cogor uno contextu legere haec omnia; dicam postea suo loco rationem.)

3. A fire devoureth before them; and behind them a flame burneth: the land is as the garden of Eden before them, and behind them a desolate wilderness; yea, and nothing shall escape them.

3. Coram facie ejus (coram ipso) devorans ignis, et post eum exuret flamma: sicut hortus Eden terra coram ipso (ante faciem ejus ad verbum;) et post eum desertum solitudinis (vel, vastitatis;) adeoque evasio non erit ei.

4. The appearance of them is as the appearance of horses; and as horsemen, so shall they run.

4. Quasi aspectus equorum aspectus ejus, et tanquam equites current.

5. Like the noise of chariots on the tops of mountains shall they leap, like the noise of a flame of fire that devoureth the stubble, as a strong people set in battle array.

5. Sicut vocem quadrigarum (sic mrkvvt interpretes vertunt: postea dicam de hoc verbo,) super cacumina montium saltabunt, secundum vocem flammae ignis vorantis stipulam, quasi populus robustus (vel, terribilis) paratus ad proelium.

6. Before their face the people shall be much pained: all faces shall gather blackness.

6. A facie ejus pavebunt populi, omnes facies colligent nigredinem.

7. They shall run like mighty men; they shall climb the wall like men of war; and they shall march every one on his ways, and they shall not break their ranks:

7. Quasi gigantes (vel, fortes) discurrent, sicut viri proelii ascendent murum, et vir (hoc est, quisque in viis suis ambulabit, et non tardabunt gressus suos (alii, non inquirent de viis suis.)

8. Neither shall one thrust another; they shall walk every one in his path: and when they fall upon the sword, they shall not be wounded.

8. Vir fratrem suum (hoc est, quisque socium suum) non premet, quisque in viis suis ambulabit: usque in gladium cadent (hoc est, super gladium cadent) non vulnerabuntur (alii, non concupiscent.)

9.', false, false, 'sourced', 'published'),
((SELECT id FROM scholars WHERE slug = 'calvin'), 29, 3, 1, NULL, 'joel-3', 'John Calvin', 'Commentaries', E'1. For, behold, in those days, and in that time, when I shall bring again the captivity of Judah and Jerusalem,

1. Quia ecce, diebus illis et tempore illo, quo convertam captivitatem Jehudah et Jerusalem;

2 I will also gather all nations, and will bring them down into the valley of Jehoshaphat, and will plead with them there for my people and for my heritage Israel, whom they have scattered among the nations, and parted my land.

2 Et congregabo (tunc congregabo) omnes gentes, et descendere faciam in vallem Jesephat, et disceptabo illic cum ipsis super populo meo et super haereditate mea Israel, quia disperserunt inter gentes et partiti sunt terram meam (addemus et hunc etiam versum.)

3 And they have cast lots for my people; and have given a boy for an harlot, and sold a girl for wine, that they might drink.

3 Et super populo meo jecerunt sortem et posuerunt, puerum pro scorto (hoc est, addixerunt pro scorto) et pullam vendiderunt pro vino ut biberunt.

The Prophet confirms in these words what he had before taught respecting the restoration of the Church; for it was a thing difficult to be believed: when the body of the people was so mutilated, when their name was obliterated, when all power was abolished, when the worship of God also, together with the temple, was subverted, when there was no more any form of a kingdom, or even of any civil government, who could have thought that God had any concern for a people in such a wretched condition? It is then no wonder that the Prophet speaks so much at large of the restoration of the Church; he did so, that he might more fully confirm what would have otherwise been incredible.

He therefore says, Behold, in those days, and at that time, in which I shall restore the captivity of Judah and Jerusalem, I shall then make all Gentiles to come down into the valley of Jehoshaphat. And the Prophet says this, because the Jews were then hated by all people, and were the execration and the dregs of the whole world. As many nations as were under heaven, so many were the enemies of the Jews. A fall then inter despair was easy, when they saw the whole world incensed against them: "Though God may wish to redeem us, there are yet so many obstacles, that we must necessarily perish; not only the Assyrians are enraged against us, but we have found even greater hatred in our own neighbors." We, indeed, know that the Moabites, the Ammonites, the Syrians, the Sidonians, the Idumeans, the Philistines, and, in short, all in the surrounding countries, were very hostile to the Jews. Seeing then every access to their land was closed up to the Jews, it was difficult to entertain any hope of deliverance, though God encouraged them.', false, false, 'sourced', 'published');
