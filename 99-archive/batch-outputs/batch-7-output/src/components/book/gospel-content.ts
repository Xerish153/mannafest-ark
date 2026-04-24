/**
 * Batch 7 — Gospel hub content. Stat strips, taglines, themes, structure,
 * key chapters, signature verse anchors, related nodes. Each field honors
 * Doctrine A / B / C / D: descriptive not prescriptive, PD sources cited,
 * no AI-authored theological claims.
 */

import type { BookMeta } from "@/lib/bible/book-slugs";
import type {
  BookStructure,
  KeyChapter,
  RelatedNode,
  StatStripEntry,
  ThemeCard,
} from "./types";

type SignatureVerseRef = {
  book: number;
  chapter: number;
  verse_start: number;
  verse_end?: number | null;
};

type GospelHubContent = {
  tagline: string;
  statStrip: StatStripEntry[];
  signatureVerse: SignatureVerseRef;
  structure: BookStructure;
  themes: ThemeCard[];
  keyChapters: KeyChapter[];
  metadata: {
    author: string;
    date: string;
    audience: string;
  };
  relatedNodes: RelatedNode[];
};

export const GOSPEL_HUB_CONTENT: Record<string, GospelHubContent> = {
  matthew: {
    tagline:
      "The Gospel of the promised King. Five discourses punctuate the narrative; roughly sixty-five Old Testament citations bind the story to the prophets.",
    statStrip: [
      { value: "28", label: "Chapters" },
      { value: "5", label: "Discourses" },
      { value: "~65", label: "OT citations" },
    ],
    signatureVerse: { book: 40, chapter: 28, verse_start: 18, verse_end: 20 },
    structure: {
      kind: "outline",
      sections: [
        { label: "Prologue — genealogy, birth, preparation", chapters: "1–4", startChapter: 1 },
        { label: "Sermon on the Mount", chapters: "5–7", startChapter: 5, blurb: "Discourse 1 — the kingdom's ethic." },
        { label: "Mission of the Twelve", chapters: "10", startChapter: 10, blurb: "Discourse 2 — sending and cost." },
        { label: "Parables of the Kingdom", chapters: "13", startChapter: 13, blurb: "Discourse 3 — hidden then revealed." },
        { label: "Community in the Kingdom", chapters: "18", startChapter: 18, blurb: "Discourse 4 — greatness, forgiveness." },
        { label: "Olivet Discourse", chapters: "24–25", startChapter: 24, blurb: "Discourse 5 — end of the age." },
        { label: "Passion and resurrection", chapters: "26–28", startChapter: 26 },
      ],
    },
    themes: [
      { id: "mt-kingdom", title: "Kingdom of Heaven", body: "Matthew's distinctive phrase across 32+ occurrences, framing Jesus as the heaven-sent King." },
      { id: "mt-messiah", title: "Davidic Messiah", body: "Son of David, born King of the Jews (Matt 1:1; 2:2; 21:9); the genealogy is argument, not ornament." },
      { id: "mt-fulfillment", title: "Fulfillment of Prophecy", body: "The recurring 'that it might be fulfilled' formula binds the story to Isaiah, Hosea, Zechariah, and Psalms." },
      { id: "mt-ecclesiology", title: "Church Ecclesiology", body: "Matthew alone uses ekklesia in the Gospels (16:18; 18:17) — discipline, authority, and the gates of hell." },
      { id: "mt-discipleship", title: "Discipleship", body: "The Sermon on the Mount and the Great Commission frame the volume: what disciples of the King look like and what they are sent to do." },
    ],
    keyChapters: [
      { chapter: 1, label: "Genealogy and birth", blurb: "Fourteen generations × three; son of David, son of Abraham." },
      { chapter: 5, label: "Sermon on the Mount (part 1)", blurb: "Beatitudes; salt and light; the law fulfilled, not abolished." },
      { chapter: 13, label: "Parables of the Kingdom", blurb: "Sower, wheat and tares, mustard seed, leaven, treasure, pearl, net." },
      { chapter: 16, label: "Peter's confession", blurb: "'Thou art the Christ' — followed by the first passion prediction." },
      { chapter: 24, label: "Olivet Discourse", blurb: "Signs, the abomination of desolation, the coming of the Son of Man." },
      { chapter: 28, label: "Resurrection and commission", blurb: "'All authority … all nations … I am with you always.'" },
    ],
    metadata: {
      author: "Matthew (Levi), a former tax collector called by Jesus",
      date: "c. AD 50–60",
      audience: "Jewish Christians; argued from the Hebrew Scriptures",
    },
    relatedNodes: [],
  },

  mark: {
    tagline:
      "The Gospel of the servant in motion. The narrative hinges at Peter's confession (8:27). Before: the Servant revealed. After: the Servant suffers.",
    statStrip: [
      { value: "16", label: "Chapters" },
      { value: "~40", label: "‘Immediately’" },
      { value: "Fastest", label: "Gospel" },
    ],
    signatureVerse: { book: 41, chapter: 10, verse_start: 45 },
    structure: {
      kind: "outline",
      sections: [
        { label: "The Servant revealed", chapters: "1–8", startChapter: 1, blurb: "Baptism, miracles, growing opposition, disciples struggling to see." },
        { label: "Hinge — Peter's confession", chapters: "8:27–9:1", startChapter: 8, blurb: "'Thou art the Christ' and the first passion prediction." },
        { label: "The Servant suffers", chapters: "9–16", startChapter: 9, blurb: "Three passion predictions; Jerusalem; cross; empty tomb." },
      ],
    },
    themes: [
      { id: "mk-servant", title: "Suffering Servant", body: "The ransom logion in 10:45 draws Isaiah 53 into the narrative's backbone." },
      { id: "mk-discipleship", title: "Discipleship and failure", body: "The Twelve repeatedly misunderstand; Mark refuses to polish their portrait." },
      { id: "mk-action", title: "Action arc", body: "Euthys ('immediately') pulses through the narrative; no interludes, no speeches." },
      { id: "mk-messianic-secret", title: "The Messianic secret", body: "'Tell no one' — the repeated silencing binds Jesus' identity to his cross." },
    ],
    keyChapters: [
      { chapter: 1, label: "Prologue and baptism", blurb: "The good news of Jesus Christ, the Son of God — opens with Isaiah." },
      { chapter: 4, label: "Parables and the calming", blurb: "Sower, lamp, growing seed, mustard seed; stilling the storm." },
      { chapter: 8, label: "Peter's confession", blurb: "Narrative hinge — from revelation to passion." },
      { chapter: 10, label: "The ransom saying", blurb: "'…to give his life a ransom for many' (10:45)." },
      { chapter: 14, label: "Passion begins", blurb: "Anointing, Supper, Gethsemane, arrest, trial." },
      { chapter: 16, label: "Resurrection (with textual evidence)", blurb: "Empty tomb; longer ending (16:9–20) — see the textual panel." },
    ],
    metadata: {
      author: "John Mark, companion of Peter (Acts 12:12; 1 Pet 5:13)",
      date: "c. AD 50–65",
      audience: "Roman Christians; Latinisms and explained Aramaic",
    },
    relatedNodes: [],
  },

  luke: {
    tagline:
      "Luke's 'orderly account' (1:3) follows Jesus from Bethlehem through the long travel narrative to Jerusalem and the Emmaus road.",
    statStrip: [
      { value: "24", label: "Chapters" },
      { value: "Orderly", label: "Account" },
      { value: "Most", label: "Women, prayer, poor" },
    ],
    signatureVerse: { book: 42, chapter: 19, verse_start: 10 },
    structure: {
      kind: "outline",
      sections: [
        { label: "Infancy narratives", chapters: "1–2", startChapter: 1, blurb: "Gabriel; Magnificat; Benedictus; Nunc dimittis; temple." },
        { label: "Galilean ministry", chapters: "3:1–9:50", startChapter: 3, blurb: "Baptism, wilderness, Nazareth manifesto, calling, parables." },
        { label: "Travel narrative", chapters: "9:51–19:27", startChapter: 10, blurb: "Luke's long road to Jerusalem — the parables of teaching." },
        { label: "Jerusalem — passion and resurrection", chapters: "19:28–24", startChapter: 19 },
      ],
    },
    themes: [
      { id: "lk-universality", title: "Universality of the gospel", body: "Genealogy back to Adam (3:38); seventy sent (10:1); Samaritans and foreigners lifted up." },
      { id: "lk-prayer", title: "Prayer", body: "Jesus at prayer at every turning point; the Lord's Prayer (11); the persistent widow (18)." },
      { id: "lk-spirit", title: "The Holy Spirit", body: "The Spirit drives the narrative from 1:15 forward — a Lukan spine into Acts." },
      { id: "lk-women", title: "Women as witnesses", body: "Mary, Elizabeth, Anna, the women of 8:1–3, the women at the tomb." },
      { id: "lk-poor", title: "The poor and the outcast", body: "Zacchaeus, the prodigal, the Good Samaritan, Lazarus at the gate." },
    ],
    keyChapters: [
      { chapter: 1, label: "Infancy narratives", blurb: "Annunciation, Visitation, Magnificat, Benedictus." },
      { chapter: 4, label: "Nazareth manifesto", blurb: "Isaiah 61 read; 'Today is this scripture fulfilled.'" },
      { chapter: 10, label: "Good Samaritan; the Seventy", blurb: "The great parable of neighbour-love." },
      { chapter: 15, label: "Three parables of seeking", blurb: "Lost sheep, lost coin, lost son." },
      { chapter: 19, label: "Zacchaeus and triumphal entry", blurb: "'The Son of man is come to seek and to save.'" },
      { chapter: 24, label: "Resurrection and Emmaus", blurb: "'Then opened he their understanding.'" },
    ],
    metadata: {
      author: "Luke, beloved physician (Col 4:14), travel-companion of Paul",
      date: "c. AD 60–62",
      audience: "Theophilus and the broader Gentile church",
    },
    relatedNodes: [],
  },

  john: {
    tagline:
      "The Gospel of sevens and signs. Seven signs, seven 'I AM' sayings, a prologue and an epilogue — written 'that ye might believe' (20:31).",
    statStrip: [
      { value: "21", label: "Chapters" },
      { value: "7", label: "Signs" },
      { value: "7", label: "‘I AM’ sayings" },
    ],
    signatureVerse: { book: 43, chapter: 20, verse_start: 30, verse_end: 31 },
    structure: {
      kind: "outline",
      sections: [
        { label: "Prologue", chapters: "1:1–18", startChapter: 1, blurb: "'In the beginning was the Word.'" },
        { label: "Book of Signs", chapters: "1:19–12", startChapter: 2, blurb: "Seven signs; 'I AM' begins." },
        { label: "Book of Glory", chapters: "13–20", startChapter: 13, blurb: "Upper room; high-priestly prayer; passion; resurrection." },
        { label: "Epilogue", chapters: "21", startChapter: 21, blurb: "By the sea; Peter restored; textual-evidence panel." },
      ],
    },
    themes: [
      { id: "jn-incarnation", title: "Incarnation", body: "'The Word became flesh' (1:14) — logos theology drawn from both Jewish wisdom and Greek usage." },
      { id: "jn-belief", title: "Belief and eternal life", body: "Pisteuo occurs 98+ times; 3:16 binds believing to having life." },
      { id: "jn-iam", title: "‘I AM’ sayings", body: "Seven predicated ('bread of life', 'good shepherd', …) against the backdrop of the unpredicated 'before Abraham was, I am' (8:58)." },
      { id: "jn-love", title: "The love command", body: "'A new commandment I give unto you' (13:34) — love as the disciple's mark." },
      { id: "jn-witness", title: "Witness", body: "The Baptist, the works, the Father, the Scriptures, the Spirit — layered testimonies." },
    ],
    keyChapters: [
      { chapter: 1, label: "Prologue", blurb: "Word, light, glory, Lamb of God." },
      { chapter: 3, label: "Nicodemus", blurb: "Born again; the bronze-serpent typology; 3:16." },
      { chapter: 6, label: "Bread of Life", blurb: "Feeding the 5,000; the first predicated 'I AM'." },
      { chapter: 11, label: "Lazarus raised", blurb: "'I am the resurrection, and the life.'" },
      { chapter: 14, label: "Upper-room discourse begins", blurb: "'I am the way, the truth, and the life.'" },
      { chapter: 17, label: "High-priestly prayer", blurb: "Jesus prays for himself, for the Twelve, for those to come." },
      { chapter: 20, label: "Resurrection appearances", blurb: "Mary Magdalene, Thomas, the purpose statement." },
      { chapter: 21, label: "Epilogue (with textual evidence)", blurb: "The 153 fish; Peter restored; the beloved disciple's testimony." },
    ],
    metadata: {
      author: "John the Apostle (2nd-century patristic attribution + internal claims)",
      date: "c. AD 85–95",
      audience: "Believers across the Asian churches; a summary Gospel",
    },
    relatedNodes: [],
  },

  acts: {
    tagline:
      "The Gospel's sequel. Jerusalem → Judea and Samaria → the ends of the earth. Three missionary journeys and the voyage to Rome.",
    statStrip: [
      { value: "28", label: "Chapters" },
      { value: "3", label: "Paul's journeys" },
      { value: "1:8", label: "Program" },
    ],
    signatureVerse: { book: 44, chapter: 1, verse_start: 8 },
    structure: {
      kind: "outline",
      sections: [
        { label: "Jerusalem", chapters: "1–7", startChapter: 1, blurb: "Ascension, Pentecost, early church, Stephen." },
        { label: "Judea and Samaria", chapters: "8–12", startChapter: 8, blurb: "Philip, Saul's conversion, Cornelius, Antioch." },
        { label: "Unto the uttermost part of the earth", chapters: "13–28", startChapter: 13, blurb: "Three missionary journeys and the voyage to Rome." },
      ],
    },
    themes: [
      { id: "ac-spirit", title: "Holy Spirit poured out", body: "Pentecost (2), Samaritans (8), Cornelius (10), Ephesus (19) — four outpourings mark four horizons." },
      { id: "ac-witness", title: "Witness", body: "The risen Christ's witnesses carry the word from the temple to Caesar's household." },
      { id: "ac-growth", title: "Church growth", body: "Luke's summary statements (2:47; 6:7; 9:31; 12:24; 16:5; 19:20) pulse growth across the narrative." },
      { id: "ac-gentiles", title: "Gentile inclusion", body: "Cornelius, the Jerusalem Council (15), Galatia, Macedonia — the 'no difference' argument." },
      { id: "ac-providence", title: "Divine providence in expansion", body: "Storms, shipwrecks, imprisonments — Luke reads them as the gospel's chosen paths." },
    ],
    keyChapters: [
      { chapter: 1, label: "Ascension and program", blurb: "Acts 1:8 sets the geography of the book." },
      { chapter: 2, label: "Pentecost", blurb: "The Spirit poured out; Peter preaches Joel and Ps 16." },
      { chapter: 7, label: "Stephen's defense", blurb: "Salvation history retold before martyrdom." },
      { chapter: 9, label: "Saul's conversion", blurb: "On the Damascus road — 'Why persecutest thou me?'" },
      { chapter: 10, label: "Cornelius", blurb: "'God is no respecter of persons' — the Gentile door opens." },
      { chapter: 15, label: "Jerusalem Council", blurb: "The gospel defended; the circumcision question settled." },
      { chapter: 17, label: "Mars Hill", blurb: "Paul among the Athenian philosophers." },
      { chapter: 20, label: "Miletus farewell", blurb: "'I take you to record this day.'" },
      { chapter: 27, label: "Shipwreck", blurb: "Euroclydon; 276 souls saved." },
      { chapter: 28, label: "Rome", blurb: "'Preaching the kingdom of God … no man forbidding him.'" },
    ],
    metadata: {
      author: "Luke, companion of Paul — the 'we' passages begin in 16:10",
      date: "c. AD 62",
      audience: "Theophilus; the broader church to Caesar's household",
    },
    relatedNodes: [],
  },
};

// ── Fallbacks for tier-2 hubs (non-Gospel books this batch) ─────────────

export function defaultTaglineFor(meta: BookMeta): string {
  return `${meta.name} — ${meta.genre ?? "Scripture"}${meta.testament === "OT" ? ", Old Testament" : ", New Testament"}.`;
}

export function defaultStatStrip(meta: BookMeta): StatStripEntry[] {
  return [
    { value: String(meta.chapterCount), label: "Chapters" },
    { value: meta.testament === "OT" ? "OT" : "NT", label: "Testament" },
    { value: meta.genre ?? "—", label: "Genre" },
  ];
}

export function defaultOutlineFor(meta: BookMeta): BookStructure {
  return {
    kind: "grid",
    chapters: Array.from({ length: meta.chapterCount }, (_, i) => i + 1),
  };
}

export function defaultThemesFor(_: BookMeta): ThemeCard[] {
  return [];
}

export function defaultKeyChaptersFor(_: BookMeta): KeyChapter[] {
  return [];
}
