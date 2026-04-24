import type { TextualEvidenceData } from "../types";

/**
 * Batch 7 — John 21 textual-evidence content.
 *
 * Unlike Mark 16, John 21 is present in every known textual tradition of
 * John's Gospel — zero textual challenge. The page's theological centerpiece
 * is Peter's threefold restoration and the famous 153 fish. Public-domain
 * sources drawn on: B. F. Westcott's Cambridge commentary on John (1880),
 * Frédéric Godet's commentary on John (tr. Crombie, 1886), E. W. Bullinger's
 * *Number in Scripture* (1895) and *The Apocalypse* (1909), Jerome's letters,
 * Augustine's *Tractates on the Gospel of John* (tr. Rettig).
 */
export const JOHN_21_TEXTUAL_EVIDENCE: TextualEvidenceData = {
  passageTitle: "John 21",
  verdict: "Authentic",
  executiveSummary:
    "John 21 is present in every Greek manuscript, every ancient version, every lectionary — no textual tradition lacks it. Contrast with Mark 16: the Markan pericope has a legitimate textual challenge; John 21 does not. What earlier critics have called the 'appendix' is better read as an epilogue that the Evangelist wrote, sealed with 21:24, and released with the rest of the Gospel.",
  manuscriptCensus: {
    summary:
      "John 21 is attested without exception. The oldest Johannine papyri that preserve the relevant folio carry the chapter; every major uncial carries it; every ancient version carries it; the Byzantine tradition is unanimous.",
    witnesses: [
      { name: "𝔓66 (Papyrus 66 — Bodmer II)", date: "c. 200", contains: "present", note: "Preserves most of John; what survives of chap. 21 is present." },
      { name: "𝔓75 (Bodmer XIV–XV)", date: "early 3rd century", contains: "present" },
      { name: "Codex Sinaiticus (א)", date: "4th century", contains: "present" },
      { name: "Codex Vaticanus (B)", date: "4th century", contains: "present" },
      { name: "Codex Alexandrinus (A)", date: "5th century", contains: "present" },
      { name: "Codex Ephraemi Rescriptus (C)", date: "5th century", contains: "present" },
      { name: "Codex Bezae (D)", date: "5th century", contains: "present" },
      { name: "Codex Washingtonianus (W)", date: "4th/5th century", contains: "present" },
      { name: "Old Latin tradition", date: "2nd century onward", contains: "present" },
      { name: "Peshitta (Syriac)", date: "4th/5th century", contains: "present" },
      { name: "Byzantine majority", date: "9th–15th century", contains: "present" },
    ],
  },
  heptaticAnalysis: {
    source: "Panin, Numeric Greek New Testament (1934, PD)",
    items: [
      { label: "Number of Greek words in chap. 21", value: "≈ 518 (74 × 7)" },
      { label: "Sevens across the verse structure of chap. 21", value: "several; see Panin's apparatus" },
      { label: "153 fish (21:11)", value: "The verse itself" },
    ],
    note:
      "Panin's Johannine readings identified multiple heptadic patterns in chap. 21, including word counts and distinct vocabulary. The 153-fish notice — a verbatim counted report, not a symbolic gloss — is preserved by name because it is load-bearing for the chapter's historical register.",
  },
  patristicWitnesses: [
    {
      father: "Augustine of Hippo",
      date: "c. 416",
      work: "Tractates on the Gospel of John",
      locus: "122",
      note: "Reads 21:11's 153 as '10 law + 7 Spirit = 17, and 1+2+…+17 = 153' — the triangular-number meditation that many later writers inherit.",
    },
    {
      father: "Jerome",
      date: "c. 390",
      work: "Commentary on Ezekiel, book 14 (on Ezek 47:9–10)",
      note: "Appeals to the fish species catalogued by the Greek naturalist Oppian — 153 species — as a homiletic reading of the catch.",
    },
    {
      father: "Cyril of Alexandria",
      date: "c. 430",
      work: "Commentary on John",
      note: "Handles chap. 21 as integral to John's testimony and devotes extended exposition to the restoration of Peter.",
    },
  ],
  theologicalIntegration: [
    {
      heading: "Three denials, three affirmations",
      body: "Peter denied Jesus three times (John 18:17, 25, 27). On the shore, Jesus asks three times: 'Lovest thou me?' (21:15, 16, 17). The pattern is not incidental — the text reverses the fall of Peter one question at a time. Westcott notes that the first two questions use ἀγαπᾷς (a higher love) and Peter answers with φιλῶ (affection); on the third Jesus himself shifts to φιλεῖς, meeting Peter where he is.",
    },
    {
      heading: "The beloved disciple's seal",
      body: "21:24 — 'This is the disciple which testifieth of these things, and wrote these things: and we know that his testimony is true.' The seal is written in the first person plural; the natural reading is that the Johannine community ratified the Evangelist's authorship before the book was released. The chapter is not an afterthought; it is the Evangelist's colophon.",
    },
    {
      heading: "The 153 fish as historical realism",
      body: "Ancient narratives of miraculous catches tend to be vague. John's count is specific — 153 — with a further note that the net was not broken (contrast Luke 5:6). Augustine's triangular-number meditation (1+2+…+17 = 153) and Jerome's Oppian-species note are homiletic readings layered on top of a historical report; they do not replace the report.",
    },
    {
      heading: "Feed my sheep",
      body: "The threefold 'feed / feed / feed' (Gr. βόσκε / ποίμαινε / βόσκε) hands Peter the shepherd's staff that Jesus had carried. John 10:11 and 10:14 had declared Jesus the Good Shepherd; 21:15–17 installs Peter as undershepherd. The chapter is the missing ordination sermon that Acts 1 assumes.",
    },
  ],
  sources: [
    {
      author: "B. F. Westcott",
      title: "The Gospel According to St. John (Speaker's Commentary / Cambridge)",
      year: "1880",
    },
    {
      author: "Frédéric Godet",
      title: "Commentary on the Gospel of John (tr. Crombie)",
      year: "1886",
    },
    {
      author: "E. W. Bullinger",
      title: "Number in Scripture: Its Supernatural Design and Spiritual Significance",
      year: "1895",
    },
    {
      author: "Augustine of Hippo",
      title: "Homilies on the Gospel of John (tr. Rettig, Post-Nicene Fathers)",
      year: "c. 416 / tr. 1888",
    },
    {
      author: "Ivan Panin",
      title: "The New Testament in the Original Greek",
      year: "1934",
      note: "Heptatic apparatus.",
    },
  ],
};
