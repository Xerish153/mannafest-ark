import "server-only";
import { supabase } from "@/lib/supabase";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import {
  canonicalVotdForDay,
  getDayOfYear,
  formatIsoDate,
  type CanonicalVerse,
} from "./canonical-verses";

/**
 * Unified VOTD loader. Resolves the render payload for a given date:
 *
 *   1. If `votd_reflections` has a published row for the date, use its
 *      verse_id + reflection body.
 *   2. Else fall back to the canonical day-of-year verse.
 *   3. Layer the reflection on top (body + "authored" true when present)
 *      OR a scholar-quote fallback (row-specified OR last-resort random
 *      PD commentary on the same chapter).
 *
 * This function is used by:
 *   - `/verse-of-the-day` server page (Layer 2)
 *   - `/verse-of-the-day/[date]` server page (historical permalinks)
 *   - `<VotdLayer1Card />` on the homepage (Layer 1)
 *   - `/api/votd` JSON endpoint
 */

export type VotdPayload = {
  date: string; // YYYY-MM-DD
  verse: {
    node_id: number; // graph_nodes.id
    book_id: number;
    book_name: string;
    book_abbr: string;
    chapter: number;
    verse: number;
    text: string;
    translation: string; // KJV by default
  };
  reflection: {
    body: string;
    authored_by: "Pastor Marc — MannaFest";
  } | null;
  fallback: {
    quote: string;
    scholar_name: string;
    tradition_key: string;
    source: "explicit" | "random_commentary";
  } | null;
};

/** Load VOTD payload for a specific date (default: today). */
export async function loadVotdForDate(
  isoDate: string,
): Promise<VotdPayload | null> {
  // Use service client for reads so RLS on votd_reflections (status=published
  // only) doesn't hide in-progress drafts from the admin page layer — the
  // public /verse-of-the-day page doesn't need this, but /admin uses the
  // same loader to preview. Anon client also works for published rows; the
  // service client is strictly more permissive.
  const admin = createSupabaseServiceClient();

  const { data: reflection } = await admin
    .from("votd_reflections")
    .select("verse_id, body, status, fallback_scholar_id, fallback_quote")
    .eq("date", isoDate)
    .maybeSingle();

  // Pick verse: reflection's verse_id wins; else canonical-day fallback.
  const canonical = canonicalVotdForDay(dayOfYearFromIso(isoDate));
  let verse: VotdPayload["verse"] | null = null;

  if (reflection?.verse_id) {
    verse = await fetchVerseByNodeId(reflection.verse_id as number);
  }
  if (!verse) {
    verse = await fetchVerseByBookChapterVerse(canonical);
  }
  if (!verse) return null;

  // Reflection body renders only when status='published' and body is set.
  const publishedBody =
    reflection?.status === "published" && reflection.body
      ? reflection.body
      : null;

  if (publishedBody) {
    return {
      date: isoDate,
      verse,
      reflection: {
        body: publishedBody,
        authored_by: "Pastor Marc — MannaFest",
      },
      fallback: null,
    };
  }

  // Fallback path: explicit fallback_scholar + fallback_quote, else random
  // PD commentary on the same chapter capped at 50 words.
  let fallback: VotdPayload["fallback"] = null;

  if (reflection?.fallback_quote && reflection?.fallback_scholar_id) {
    const { data: sch } = await admin
      .from("scholars")
      .select("name, tradition_key")
      .eq("id", reflection.fallback_scholar_id)
      .maybeSingle();
    if (sch) {
      fallback = {
        quote: trim50(reflection.fallback_quote as string),
        scholar_name: (sch.name as string) ?? "",
        tradition_key: (sch.tradition_key as string) ?? "academic",
        source: "explicit",
      };
    }
  }

  if (!fallback) {
    fallback = await pickRandomCommentaryFallback(verse.book_id, verse.chapter);
  }

  return {
    date: isoDate,
    verse,
    reflection: null,
    fallback,
  };
}

/** Convenience: load today's VOTD in local time. */
export async function loadVotdToday(): Promise<VotdPayload | null> {
  return loadVotdForDate(formatIsoDate(new Date()));
}

function dayOfYearFromIso(isoDate: string): number {
  const [y, m, d] = isoDate.split("-").map(Number);
  return getDayOfYear(new Date(y, (m ?? 1) - 1, d ?? 1));
}

function trim50(text: string): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= 50) return text.trim();
  return words.slice(0, 50).join(" ") + "…";
}

async function fetchVerseByNodeId(
  nodeId: number,
): Promise<VotdPayload["verse"] | null> {
  const { data: node } = await supabase
    .from("graph_nodes")
    .select("id, type, book_id, chapter_num, verse_num")
    .eq("id", nodeId)
    .maybeSingle();
  if (!node || node.type !== "verse") return null;
  if (node.book_id == null || node.chapter_num == null || node.verse_num == null) return null;
  return await hydrateVerse(
    node.id as number,
    node.book_id as number,
    node.chapter_num as number,
    node.verse_num as number,
  );
}

async function fetchVerseByBookChapterVerse(
  v: CanonicalVerse,
): Promise<VotdPayload["verse"] | null> {
  const { data: book } = await supabase
    .from("books")
    .select("id")
    .ilike("abbreviation", v.book_abbr)
    .maybeSingle();
  if (!book) return null;
  const { data: node } = await supabase
    .from("graph_nodes")
    .select("id")
    .eq("type", "verse")
    .eq("book_id", book.id)
    .eq("chapter_num", v.chapter)
    .eq("verse_num", v.verse)
    .maybeSingle();
  if (!node) return null;
  return await hydrateVerse(node.id as number, book.id as number, v.chapter, v.verse);
}

async function hydrateVerse(
  nodeId: number,
  bookId: number,
  chapter: number,
  verse: number,
): Promise<VotdPayload["verse"] | null> {
  const [{ data: bookRow }, { data: verseRow }] = await Promise.all([
    supabase.from("books").select("id, name, abbreviation").eq("id", bookId).maybeSingle(),
    supabase
      .from("verses")
      .select("text, translations(abbreviation)")
      .eq("book_id", bookId)
      .eq("chapter_num", chapter)
      .eq("verse_num", verse)
      .limit(3),
  ]);
  if (!bookRow) return null;

  // Prefer KJV, else first row (WEB/ASV).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows = (verseRow ?? []) as any[];
  const kjv = rows.find((r) => r?.translations?.abbreviation === "KJV");
  const chosen = kjv ?? rows[0];
  if (!chosen) return null;

  return {
    node_id: nodeId,
    book_id: bookId,
    book_name: bookRow.name as string,
    book_abbr: bookRow.abbreviation as string,
    chapter,
    verse,
    text: chosen.text as string,
    translation: (chosen.translations?.abbreviation as string) ?? "KJV",
  };
}

async function pickRandomCommentaryFallback(
  bookId: number,
  chapter: number,
): Promise<VotdPayload["fallback"]> {
  const { data } = await supabase
    .from("commentaries")
    .select(
      `commentary_text,
       scholar:scholars!commentaries_scholar_id_fkey(name, tradition_key, is_founder)`,
    )
    .eq("book_id", bookId)
    .eq("chapter", chapter)
    .eq("status", "published")
    .limit(10);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows = (data ?? []) as any[];
  const candidates = rows.filter(
    (r) => r?.scholar && !r.scholar.is_founder && typeof r.commentary_text === "string",
  );
  if (candidates.length === 0) return null;

  // Stable-ish pick: deterministic per chapter so re-renders don't shuffle.
  const pick = candidates[Math.floor(chapter * 7919) % candidates.length];
  return {
    quote: trim50(pick.commentary_text as string),
    scholar_name: pick.scholar.name as string,
    tradition_key: (pick.scholar.tradition_key as string) ?? "academic",
    source: "random_commentary",
  };
}
