import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  bookByAbbrOrSlug,
  bookById,
  nextBookOf,
  prevBookOf,
  type BookMeta,
} from "@/lib/bible/book-slugs";
import {
  resolvePericopes,
  type FeaturedRefRow,
  type PericopeOverrideRow,
  type Pericope,
} from "@/lib/bible/pericopes";

/**
 * Batch 7 — GET /api/reader/:book/:chapter
 *
 * Returns the full bundle the chapter reader needs:
 *   - verses: Array<{ verse_num, text, translation }>
 *   - commentary: chapter-level commentaries (Doctrine A shape)
 *   - pericopes: ordered sections for the sectioned-layer reader
 *   - featured_refs: feature-page anchors in this chapter
 *   - summary: published chapter_summaries row (null if draft or absent)
 *   - cross_refs_by_verse: Record<verseNumber, CrossRef[]> (top 3 each)
 *   - book_metadata: slug, testament, prev/next chapter URLs,
 *     end_of_gospels flag (for Acts 28)
 *
 * Translation query param: ?t=KJV|WEB|ASV. Defaults to KJV.
 */

type VersesRow = { verse_num: number; text: string; id: number };
type CommentaryRow = {
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
  display_rank: number | null;
  tradition_tag: string | null;
};

type ReaderBundle = {
  book: {
    slug: string;
    name: string;
    abbreviation: string;
    testament: "OT" | "NT";
    chapter_count: number;
    chapter: number;
  };
  translation: "KJV" | "WEB" | "ASV";
  verses: Array<{ verse_num: number; text: string }>;
  commentary: CommentaryRow[];
  pericopes: Pericope[];
  featured_refs: FeaturedRefRow[];
  summary: { body: string; drafted_by: string | null } | null;
  cross_refs_by_verse: Record<
    number,
    Array<{
      node_id: number;
      label: string;
      book_slug: string;
      chapter: number;
      verse: number;
      preview: string | null;
    }>
  >;
  navigation: {
    prev_chapter_url: string | null;
    next_chapter_url: string | null;
    end_of_gospels: boolean;
    end_of_book: boolean;
  };
  signature_verse_node_id: number | null;
};

const TRANSLATION_IDS: Record<string, number> = { KJV: 1, ASV: 2, WEB: 3 };

function asTranslation(q: string | null): "KJV" | "WEB" | "ASV" {
  if (q === "WEB" || q === "ASV" || q === "KJV") return q;
  return "KJV";
}

function chapterUrl(slug: string, chapter: number): string {
  return `/read/${slug}/${chapter}`;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ book: string; chapter: string }> },
) {
  const { book: bookKey, chapter: chapterStr } = await params;
  const meta = bookByAbbrOrSlug(bookKey);
  if (!meta) {
    return NextResponse.json(
      { error: `Unknown book: ${bookKey}` },
      { status: 404 },
    );
  }
  const chapter = Number.parseInt(chapterStr, 10);
  if (!Number.isFinite(chapter) || chapter < 1 || chapter > meta.chapterCount) {
    return NextResponse.json(
      { error: `Chapter ${chapterStr} out of range for ${meta.name}` },
      { status: 404 },
    );
  }

  const url = new URL(req.url);
  const translation = asTranslation(url.searchParams.get("t"));
  const translationId = TRANSLATION_IDS[translation];

  const supabase = await createSupabaseServerClient();

  // ── Parallel fetch: verses, chapter commentary, pericope overrides,
  //    featured refs, chapter summary, book hub config.
  const [
    versesRes,
    commentaryRes,
    overridesRes,
    featuredRes,
    summaryRes,
    hubConfigRes,
  ] = await Promise.all([
    supabase
      .from("verses")
      .select("id, verse_num, text")
      .eq("book_id", meta.bookId)
      .eq("chapter_num", chapter)
      .eq("translation_id", translationId)
      .order("verse_num"),
    supabase
      .from("commentaries")
      .select(
        `id, author, source, commentary_text, featured_excerpt, featured,
         founder_curated, author_type, status, curator_note,
         verse_start, verse_end,
         scholar:scholars(display_rank, tradition_tag)`,
      )
      .eq("book_id", meta.bookId)
      .eq("chapter", chapter)
      .eq("status", "published")
      .order("featured", { ascending: false }),
    supabase
      .from("pericope_overrides")
      .select("verse_start, verse_end, title, display_order")
      .eq("book_id", meta.bookId)
      .eq("chapter", chapter)
      .order("display_order"),
    supabase
      .from("featured_page_refs")
      .select(
        "verse_start, verse_end, featured_page_slug, featured_page_title, route_prefix",
      )
      .eq("book_id", meta.bookId)
      .eq("chapter", chapter)
      .order("verse_start"),
    supabase
      .from("chapter_summaries")
      .select("body, drafted_by, status")
      .eq("book_id", meta.bookId)
      .eq("chapter", chapter)
      .eq("status", "published")
      .maybeSingle(),
    supabase
      .from("book_hub_config")
      .select("signature_verse_id")
      .eq("book_slug", meta.slug)
      .maybeSingle(),
  ]);

  const verses = (versesRes.data ?? []) as VersesRow[];
  const lastVerse = verses.length > 0 ? verses[verses.length - 1].verse_num : 1;

  const commentary: CommentaryRow[] = (
    (commentaryRes.data as unknown as Array<
      Omit<CommentaryRow, "display_rank" | "tradition_tag"> & {
        scholar: { display_rank: number | null; tradition_tag: string | null } | null;
      }
    >) ?? []
  ).map((c) => ({
    id: c.id,
    author: c.author,
    source: c.source,
    commentary_text: c.commentary_text,
    featured_excerpt: c.featured_excerpt,
    featured: c.featured,
    founder_curated: c.founder_curated,
    author_type: c.author_type,
    status: c.status,
    curator_note: c.curator_note,
    verse_start: c.verse_start,
    verse_end: c.verse_end,
    display_rank: c.scholar?.display_rank ?? null,
    tradition_tag: c.scholar?.tradition_tag ?? null,
  }));

  const overrides: PericopeOverrideRow[] = (overridesRes.data ?? []) as PericopeOverrideRow[];
  const featured_refs = ((featuredRes.data ?? []) as Array<
    FeaturedRefRow & { route_prefix?: string }
  >).map((r) => ({
    verse_start: r.verse_start,
    verse_end: r.verse_end,
    featured_page_slug: r.featured_page_slug,
    featured_page_title: r.featured_page_title,
  })) as FeaturedRefRow[];

  const pericopes = resolvePericopes(overrides, featured_refs, lastVerse);

  const summary =
    summaryRes.data && typeof summaryRes.data.body === "string" && summaryRes.data.body
      ? { body: summaryRes.data.body, drafted_by: summaryRes.data.drafted_by ?? null }
      : null;

  // ── Cross-refs per verse via graph_edges (top 3 per verse).
  const crossRefsByVerse = await loadCrossRefsByVerse(
    supabase,
    meta,
    chapter,
    lastVerse,
    translationId,
  );

  // ── Navigation
  const isLastChapter = chapter === meta.chapterCount;
  const isFirstChapter = chapter === 1;
  const nextBook = isLastChapter ? nextBookOf(meta) : null;
  const prevBook = isFirstChapter ? prevBookOf(meta) : null;

  let prev_chapter_url: string | null = null;
  if (!isFirstChapter) {
    prev_chapter_url = chapterUrl(meta.slug, chapter - 1);
  } else if (prevBook) {
    prev_chapter_url = chapterUrl(prevBook.slug, prevBook.chapterCount);
  }

  let next_chapter_url: string | null = null;
  const isEndOfGospels = meta.slug === "acts" && isLastChapter;
  if (!isLastChapter) {
    next_chapter_url = chapterUrl(meta.slug, chapter + 1);
  } else if (nextBook && !isEndOfGospels) {
    next_chapter_url = chapterUrl(nextBook.slug, 1);
  }

  const bundle: ReaderBundle = {
    book: {
      slug: meta.slug,
      name: meta.name,
      abbreviation: meta.abbreviation,
      testament: meta.testament,
      chapter_count: meta.chapterCount,
      chapter,
    },
    translation,
    verses: verses.map((v) => ({ verse_num: v.verse_num, text: v.text })),
    commentary,
    pericopes,
    featured_refs,
    summary,
    cross_refs_by_verse: crossRefsByVerse,
    navigation: {
      prev_chapter_url,
      next_chapter_url,
      end_of_gospels: isEndOfGospels,
      end_of_book: isLastChapter,
    },
    signature_verse_node_id: hubConfigRes.data?.signature_verse_id ?? null,
  };

  return NextResponse.json(bundle, {
    headers: {
      // Light caching — reader content is stable; published-commentary and
      // summary changes flow through the standard revalidation on next load.
      "Cache-Control": "public, max-age=60, s-maxage=300",
    },
  });
}

type SupabaseClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

async function loadCrossRefsByVerse(
  supabase: SupabaseClient,
  meta: BookMeta,
  chapter: number,
  lastVerse: number,
  translationId: number,
): Promise<ReaderBundle["cross_refs_by_verse"]> {
  // Resolve verse nodes in this chapter.
  const { data: nodes } = await supabase
    .from("graph_nodes")
    .select("id, verse_num")
    .eq("type", "verse")
    .eq("book_id", meta.bookId)
    .eq("chapter_num", chapter);

  const verseNodes = (nodes ?? []) as Array<{ id: number; verse_num: number }>;
  if (verseNodes.length === 0) return {};

  const nodeIds = verseNodes.map((n) => n.id);

  // Fetch cross-reference edges where either endpoint is a verse node in
  // this chapter. PostgREST caps unrestricted queries; we pull a generous
  // band and bucket by the source verse number.
  const { data: edges } = await supabase
    .from("graph_edges")
    .select(
      `id, source_node_id, target_node_id, display_rank,
       source:graph_nodes!graph_edges_source_node_id_fkey(id, type, label, book_id, chapter_num, verse_num),
       target:graph_nodes!graph_edges_target_node_id_fkey(id, type, label, book_id, chapter_num, verse_num)`,
    )
    .eq("relationship_type", "cross_reference")
    .or(
      `source_node_id.in.(${nodeIds.join(",")}),target_node_id.in.(${nodeIds.join(",")})`,
    )
    .order("display_rank", { ascending: true, nullsFirst: false })
    .limit(Math.max(30, lastVerse * 6));

  const rows =
    (edges as unknown as Array<{
      source_node_id: number;
      target_node_id: number;
      display_rank: number | null;
      source: {
        id: number;
        type: string;
        label: string | null;
        book_id: number | null;
        chapter_num: number | null;
        verse_num: number | null;
      } | null;
      target: {
        id: number;
        type: string;
        label: string | null;
        book_id: number | null;
        chapter_num: number | null;
        verse_num: number | null;
      } | null;
    }>) ?? [];

  // Bucket by the verse in the current chapter, keeping the "other" side.
  const bucket: Record<number, ReaderBundle["cross_refs_by_verse"][number]> = {};
  const inChapterNodeSet = new Set(nodeIds);

  for (const row of rows) {
    const sourceInChapter = inChapterNodeSet.has(row.source_node_id);
    const self = sourceInChapter ? row.source : row.target;
    const other = sourceInChapter ? row.target : row.source;
    if (!self || self.verse_num == null) continue;
    if (!other || other.type !== "verse" || other.book_id == null) continue;

    const otherBookMeta = bookById(other.book_id);
    if (!otherBookMeta) continue;

    const arr = (bucket[self.verse_num] ??= []);
    if (arr.length >= 3) continue;
    arr.push({
      node_id: other.id,
      label:
        other.label ??
        `${otherBookMeta.name} ${other.chapter_num ?? "?"}:${other.verse_num ?? "?"}`,
      book_slug: otherBookMeta.slug,
      chapter: other.chapter_num ?? 0,
      verse: other.verse_num ?? 0,
      preview: null,
    });
  }

  // Resolve verse-text previews in one pass for the referenced targets.
  const previewKeys = Object.values(bucket).flat().map((r) => ({
    book_id: bookByAbbrOrSlug(r.book_slug)?.bookId ?? 0,
    chapter_num: r.chapter,
    verse_num: r.verse,
  }));
  if (previewKeys.length > 0) {
    // Build a small set of verse ids via in-query for performance.
    // We fetch a superset matching any of the (book, chapter) pairs, then
    // filter verse_num in memory.
    const pairs = Array.from(
      new Set(previewKeys.map((k) => `${k.book_id}:${k.chapter_num}`)),
    ).map((s) => s.split(":").map(Number)) as Array<[number, number]>;

    const previewRows: Array<{ book_id: number; chapter_num: number; verse_num: number; text: string }> = [];
    await Promise.all(
      pairs.map(async ([bookId, ch]) => {
        const { data } = await supabase
          .from("verses")
          .select("book_id, chapter_num, verse_num, text")
          .eq("book_id", bookId)
          .eq("chapter_num", ch)
          .eq("translation_id", translationId);
        if (data) previewRows.push(...(data as typeof previewRows));
      }),
    );
    const previewMap = new Map(
      previewRows.map((r) => [
        `${r.book_id}:${r.chapter_num}:${r.verse_num}`,
        r.text,
      ]),
    );
    for (const v of Object.values(bucket)) {
      for (const ref of v) {
        const key = `${bookByAbbrOrSlug(ref.book_slug)?.bookId}:${ref.chapter}:${ref.verse}`;
        ref.preview = previewMap.get(key) ?? null;
      }
    }
  }

  return bucket;
}
