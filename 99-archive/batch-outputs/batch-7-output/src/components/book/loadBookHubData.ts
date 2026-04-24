import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { BookMeta } from "@/lib/bible/book-slugs";
import type {
  BookHubData,
  BookHubTier,
  BookStructure,
  KeyChapter,
  RelatedNode,
  StatStripEntry,
  ThemeCard,
} from "./types";
import {
  GOSPEL_HUB_CONTENT,
  defaultOutlineFor,
  defaultStatStrip,
  defaultTaglineFor,
  defaultThemesFor,
  defaultKeyChaptersFor,
} from "./gospel-content";

/**
 * Tier-1 books with bespoke content this batch.
 */
const TIER_ONE_BOOKS = new Set<string>([
  "matthew", "mark", "luke", "john", "acts",
]);

export async function loadBookHubData(meta: BookMeta): Promise<BookHubData> {
  const tier: BookHubTier = TIER_ONE_BOOKS.has(meta.slug) ? 1 : 2;
  const supabase = await createSupabaseServerClient();

  const [hubConfigRes, featuredRes, featuredCommentaryRes] = await Promise.all([
    supabase
      .from("book_hub_config")
      .select("signature_verse_id, intro_override, featured_commentary_id")
      .eq("book_slug", meta.slug)
      .maybeSingle(),
    supabase
      .from("featured_page_refs")
      .select(
        "featured_page_slug, featured_page_title, route_prefix, book_id, chapter, verse_start, verse_end",
      )
      .eq("book_id", meta.bookId)
      .order("chapter"),
    supabase
      .from("commentaries")
      .select(
        `id, author, source, commentary_text, featured_excerpt, featured,
         founder_curated, author_type, status, curator_note,
         verse_start, verse_end, scholar:scholars(display_rank, tradition_tag)`,
      )
      .eq("book_id", meta.bookId)
      .eq("chapter", 1)
      .eq("status", "published")
      .order("featured", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  // Signature verse resolution
  let signatureVerse: BookHubData["signatureVerse"] = null;
  const gospelContent = GOSPEL_HUB_CONTENT[meta.slug as keyof typeof GOSPEL_HUB_CONTENT];
  if (gospelContent?.signatureVerse) {
    const { book, chapter, verse_start, verse_end } = gospelContent.signatureVerse;
    const vs = await supabase
      .from("verses")
      .select("verse_num, text")
      .eq("book_id", book)
      .eq("chapter_num", chapter)
      .gte("verse_num", verse_start)
      .lte("verse_num", verse_end ?? verse_start)
      .eq("translation_id", 1)
      .order("verse_num");
    if (vs.data && vs.data.length > 0) {
      const text = vs.data.map((r) => r.text).join(" ");
      const range =
        verse_end && verse_end !== verse_start
          ? `${verse_start}–${verse_end}`
          : `${verse_start}`;
      signatureVerse = {
        label: `${meta.name} ${chapter}:${range}`,
        text,
      };
    }
  }

  const statStrip: StatStripEntry[] = gospelContent?.statStrip ?? defaultStatStrip(meta);
  const tagline: string = gospelContent?.tagline ?? defaultTaglineFor(meta);

  const themes: ThemeCard[] = gospelContent?.themes ?? defaultThemesFor(meta);
  const keyChapters: KeyChapter[] =
    gospelContent?.keyChapters ?? defaultKeyChaptersFor(meta);

  const structure: BookStructure =
    gospelContent?.structure ?? defaultOutlineFor(meta);

  const featured = (featuredRes.data ?? []).filter(
    (r) => r.book_id === meta.bookId,
  ) as BookHubData["featuredStudies"] extends readonly (infer T)[] ? T[] : never;

  const featuredCommentary = featuredCommentaryRes.data
    ? flattenCommentary(featuredCommentaryRes.data as never)
    : null;

  const relatedNodes: RelatedNode[] = gospelContent?.relatedNodes ?? [];

  return {
    tier,
    meta,
    signatureVerse,
    introOverride: hubConfigRes.data?.intro_override ?? null,
    hero: { tagline, statStrip },
    metadata: {
      author: gospelContent?.metadata?.author ?? null,
      date: gospelContent?.metadata?.date ?? null,
      audience: gospelContent?.metadata?.audience ?? null,
      canonicalPosition: `${meta.testament === "OT" ? "Old Testament" : "New Testament"} · Book ${meta.orderNum} of 66`,
    },
    structure,
    themes,
    keyChapters,
    featuredCommentary,
    featuredStudies: featured,
    relatedNodes,
    bespokeVisual:
      meta.slug === "matthew" ||
      meta.slug === "mark" ||
      meta.slug === "luke" ||
      meta.slug === "john" ||
      meta.slug === "acts"
        ? (meta.slug as BookHubData["bespokeVisual"])
        : null,
    chapterIndex: Array.from({ length: meta.chapterCount }, (_, i) => i + 1),
  };
}

function flattenCommentary(row: {
  id: string;
  author: string;
  source: string;
  commentary_text: string;
  featured_excerpt: string | null;
  featured: boolean;
  founder_curated: boolean;
  author_type: string;
  status: string;
  curator_note: string | null;
  verse_start: number;
  verse_end: number | null;
  scholar: { display_rank: number | null; tradition_tag: string | null } | null;
}): BookHubData["featuredCommentary"] {
  return {
    id: row.id,
    author: row.author,
    source: row.source,
    commentary_text: row.commentary_text,
    featured_excerpt: row.featured_excerpt,
    featured: row.featured,
    founder_curated: row.founder_curated,
    author_type: row.author_type,
    status: row.status,
    curator_note: row.curator_note,
    verse_start: row.verse_start,
    verse_end: row.verse_end,
    display_rank: row.scholar?.display_rank ?? null,
    tradition_tag: row.scholar?.tradition_tag ?? null,
  };
}
