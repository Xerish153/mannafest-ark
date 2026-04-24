import type { TextualEvidenceData } from "../types";

/**
 * Batch 7 — Mark 16:9–20 textual-evidence content.
 *
 * Every claim is traceable to a public-domain source. Defensive argumentation
 * is drawn primarily from John W. Burgon, *The Last Twelve Verses of the
 * Gospel According to S. Mark Vindicated Against Recent Critical Objectors*
 * (Oxford: James Parker, 1871). Heptatic data is drawn from Ivan Panin,
 * *The New Testament in the Original Greek* (1934). Patristic citations are
 * drawn from the PD translations in the Ante-Nicene / Nicene / Post-Nicene
 * Fathers series.
 *
 * Pastor Marc retains editorial authority; this page's Editor's Notes drawer
 * is left empty for his voice (Doctrine C).
 */
export const MARK_16_TEXTUAL_EVIDENCE: TextualEvidenceData = {
  passageTitle: "Mark 16:9–20",
  verdict: "Authentic",
  executiveSummary:
    "The longer ending of Mark is absent from Sinaiticus and Vaticanus but present in Alexandrinus, Ephraemi, Bezae, the Peshitta, the Old Latin, and in the vast Byzantine tradition. It is cited by Irenaeus around AD 180 — older than the two great uncials that omit it. A Greek narrative ending on γάρ (16:8) is grammatically unsustainable. The verdict summarized here follows Burgon's 1871 evidence trail.",
  manuscriptCensus: {
    summary:
      "The verses are present in the overwhelming majority of Greek manuscripts, in the early versions (Latin, Syriac, Coptic), and in lectionary tradition. Absent from only two major 4th-century uncials (Sinaiticus and Vaticanus) and in a handful of later witnesses.",
    witnesses: [
      { name: "Codex Sinaiticus (א)", date: "4th century", contains: "absent", note: "Ends at 16:8; blank column before Luke — scribal awareness of a disputed terminus." },
      { name: "Codex Vaticanus (B)", date: "4th century", contains: "absent", note: "Ends at 16:8; blank column before Luke." },
      { name: "Codex Alexandrinus (A)", date: "5th century", contains: "present" },
      { name: "Codex Ephraemi Rescriptus (C)", date: "5th century", contains: "present" },
      { name: "Codex Bezae (D)", date: "5th century", contains: "present" },
      { name: "Codex Washingtonianus (W)", date: "4th/5th century", contains: "present", note: "Contains the longer ending with a distinctive interpolation after 16:14 ('Freer Logion')." },
      { name: "Old Latin (k — Codex Bobbiensis)", date: "4th century", contains: "partial", note: "Has the shorter ending only; one of the few Latin witnesses to diverge." },
      { name: "Vulgate / later Latin tradition", date: "late 4th century onward", contains: "present" },
      { name: "Peshitta (Syriac)", date: "4th/5th century", contains: "present" },
      { name: "Byzantine majority", date: "9th–15th century", contains: "present", note: "Effectively universal in the tradition that produced the textus receptus." },
    ],
  },
  heptaticAnalysis: {
    source: "Panin, Numeric Greek New Testament (1934, PD)",
    items: [
      { label: "Greek words in the passage", value: "175 = 25 × 7" },
      { label: "Letters in the passage", value: "553 = 79 × 7" },
      { label: "Distinct vocabulary words", value: "98 = 14 × 7" },
      { label: "Words used elsewhere in Mark", value: "84 = 12 × 7" },
    ],
    note:
      "Panin's numeric patterns are not a proof text; they are a literary-statistical footnote. The density of sevens is harder to explain on the hypothesis of a later interpolation than on the hypothesis of a Markan original.",
  },
  patristicWitnesses: [
    {
      father: "Justin Martyr",
      date: "c. 150",
      work: "First Apology",
      locus: "45",
      note: "Language of 'going forth and preaching everywhere' echoes 16:20, predating the 4th-century uncials by nearly two centuries.",
    },
    {
      father: "Tatian",
      date: "c. 170",
      work: "Diatessaron",
      note: "The harmony incorporates the longer ending, implying its presence in the Greek text Tatian harmonized.",
    },
    {
      father: "Irenaeus",
      date: "c. 180",
      work: "Against Heresies",
      locus: "III.10.6",
      quote:
        "…in fine autem Evangelii ait Marcus: Et quidem Dominus Jesus, postquam locutus est eis, receptus est in cælos, et sedet ad dexteram Dei.",
      note: "Direct quotation of 16:19 — concrete evidence in the mid-second century, earlier than Sinaiticus and Vaticanus.",
    },
    {
      father: "Hippolytus of Rome",
      date: "c. 215",
      work: "Apostolic Tradition / On Charismata",
      note: "Cites 16:17–18 in discussions of spiritual gifts.",
    },
    {
      father: "Vincentius of Thibaris (at the Seventh Council of Carthage)",
      date: "256",
      work: "Sententiae Episcoporum",
      note: "Quotes 16:17 as Scripture in public conciliar deliberation.",
    },
  ],
  theologicalIntegration: [
    {
      heading: "A Gospel cannot end on γάρ",
      body: "If Mark intended to close at 16:8 the narrative would end with the Greek particle γάρ ('for'). No extant Greek composition of any length is known to close this way. The grammatical argument was already forceful in Burgon's day and has only tightened since.",
    },
    {
      heading: "Resurrection witness across the Gospels",
      body: "Matthew 28 and Luke 24 both narrate post-resurrection appearances, the commissioning of the disciples, and the ascension. A Gospel ending at Mark 16:8 would leave Mark uniquely silent on the events the other three evangelists treat as indispensable — a silence unaccountable on literary and theological grounds alike.",
    },
    {
      heading: "The Great Commission parallel",
      body: "16:15 (‘Go ye into all the world, and preach the gospel to every creature’) tracks Matt 28:19–20 and Luke 24:46–48. Rather than a scribe inventing a commission that already exists in two other Gospels, the natural reading is that Mark preserved the shared apostolic memory in his own voice.",
    },
    {
      heading: "Stylistic consistency",
      body: "Burgon catalogued the vocabulary and phrasing of 16:9–20 and showed that Markan fingerprints — καί in narrative sequence, πορεύομαι in the missionary sense — run through the pericope. The Freer Logion interpolation, by contrast, is stylistically unlike Mark and is rightly rejected.",
    },
  ],
  sources: [
    {
      author: "John W. Burgon",
      title:
        "The Last Twelve Verses of the Gospel According to S. Mark Vindicated",
      year: "1871",
      note: "72-page monograph cataloguing the manuscript and patristic evidence.",
    },
    {
      author: "Ivan Panin",
      title: "The New Testament in the Original Greek",
      year: "1934",
      note: "Source for the heptatic figures; public-domain Greek text.",
    },
    {
      author: "Frederick H. A. Scrivener",
      title: "A Plain Introduction to the Criticism of the New Testament",
      year: "1894",
      note: "Reference catalogue of Greek uncials, versions, and lectionaries.",
    },
    {
      author: "Irenaeus of Lyons",
      title: "Against Heresies (tr. Roberts & Rambaut)",
      year: "1867",
      note: "Ante-Nicene Fathers, vol. I, for the Latin text quoted above.",
    },
  ],
};
