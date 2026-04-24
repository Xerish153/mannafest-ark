import type { BookGroupSlug } from "@/lib/bible/book-groups";

/**
 * Batch 7 — Category landing intro copy. Only /group/gospels is authored
 * at depth this batch (that's the Gospels mega-batch's scope). The other
 * nine groups receive a single-line fallback from the group's blurb so the
 * landing pages render without placeholder text until Wave 3 phases 3a-3d.
 */

export const GROUP_INTRO: Partial<Record<BookGroupSlug, string[]>> = {
  gospels: [
    "‘Gospel’ is a literary category, not a biography. Each of the four writers selects, arranges, and frames the events of Jesus' ministry with a distinctive theological purpose. The four stand together without apology — a symphonic argument rather than four duplicate chronicles.",
    "The Synoptics (Matthew, Mark, Luke) share a common narrative backbone: baptism, Galilean ministry, final week in Jerusalem. Each writer's distinctives stamp the material differently. Matthew is the Gospel of the King and the kingdom of heaven, argued through OT fulfillment formulas. Mark is the fastest, most breathless of the four — a narrative of the Servant in motion, hinged at Peter's confession. Luke is the orderly-account physician-historian, with the long travel narrative (9:51–19:27) holding most of the great parables.",
    "John stands apart. Written later, structured around seven signs and seven ‘I AM’ sayings, framed by a cosmic prologue and an epilogue by the Galilean lake, John's Gospel argues for belief by showing glory. The famous purpose statement (20:30–31) is the summary of the whole — ‘written, that ye might believe that Jesus is the Christ, the Son of God.’",
  ],
};

/**
 * One-line preview per book used in the category landing's book list. Only
 * Gospels are authored this batch; others fall back to null (preview
 * simply doesn't render).
 */
export const GROUP_BOOK_PREVIEW: Record<string, string> = {
  matthew: "The Gospel of the promised King; five discourses punctuate the narrative.",
  mark: "The Gospel of the servant in motion; the fastest of the four.",
  luke: "Luke's orderly account — from Bethlehem to Emmaus with a long travel narrative.",
  john: "Seven signs, seven ‘I AM’ sayings; the Word made flesh.",
  acts: "The Gospel's sequel — Jerusalem to Rome in four journeys.",
};
