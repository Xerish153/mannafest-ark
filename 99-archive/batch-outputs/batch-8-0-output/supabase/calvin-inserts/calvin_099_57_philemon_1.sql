-- Calvin commentary INSERT — Philemon (batch 1, rows 1-1)
INSERT INTO commentaries (
  scholar_id, book_id, chapter, verse_start, verse_end,
  verse_reference, author, source, commentary_text,
  featured, founder_curated, author_type, status
) VALUES
((SELECT id FROM scholars WHERE slug = 'calvin'), 57, 1, 1, NULL, 'philemon-1', 'John Calvin', 'Commentaries', E'1. A prisoner of Jesus Christ. In the same sense in which he elsewhere calls himself an Apostle of Christ, or a minister of Christ, he now calls himself "a prisoner of Christ;" because the chains by which he was bound on account of the gospel, were the ornaments or badges of that embassy which he exercised for Christ. Accordingly, he mentions them for the sake of strengthening his authority; not that he was afraid of being despised, (for Philemon undoubtedly had so great reverence and esteem for him, that there was no need of assuming any title,) but because he was about to plead the cause of a runaway slave, the principal part of which was entreaty for forgiveness.

To Philemon our friend and fellow-laborer. It is probable that this "Philemon" belonged to the order of pastors; for the title with which he adorns him, when he calls him fellow-laborer, is a title which he is not accustomed to bestow on a private individual.

2. And to Archippus our fellow-soldier. He next adds "Archippus," who appears also to have been a minister of the Church; at least, if he be the same person who is mentioned towards the conclusion of the Epistle to the Colossians, (Colossians 4:17,) which is not at all improbable; for the designation -- "fellow-soldier" -- which he bestows on this latter individual, belongs peculiarly to ministers. Although the condition of a soldier belongs to all Christians universally, yet because teachers may be regarded as standardbearers in the warfare, they ought to be ready more than all others to fight, and Satan usually gives them greater annoyance. It is also possible, that Archippus attended and shared in some contests which Paul maintained; and, indeed, this is the very word that Paul makes use of, whenever he mentions persecutions.

And to the Church which is in thy house. By employing these terms, he bestows the highest praise on the family of Philemon. And certainly it is no small praise of a householder, that he regulates his family in such a manner as to be an image of the Church, and to discharge also the duty of a pastor within the walls of his dwelling. Nor must we forget to mention that this good man had a wife of the same character; for she, too, not without reason, is commended by Paul.

4. I give thanks to my God. It deserves attention, that he at the same time prays for that very thing for which he "gives thanks." Even the most perfect, so long as they live in the world, never have so good ground for congratulation as not to need prayers, that God may grant to them, not only to persevere till the end, but likewise to make progress from day to day.

5. Hearing of thy love and faith. This praise, which he bestows on Philemon, includes briefly the whole perfection of a Christian man.', false, false, 'sourced', 'published');
