// Batch 7-B — Jesus Titles Cluster loaders.
//
// Server-side fetch helpers for /titles and /title/[slug] pages.
// Public reads only — admin mutation flows use API routes, not this file.
//
// Pattern matches the Batch 6 VOTD loader: supabase client from @/lib/supabase,
// null returns on missing rows, caller renders 404 or empty-state as
// appropriate.

import { supabase } from "@/lib/supabase";
import type { JesusTitle, JesusTitleRef, JesusTitleWithRefs } from "./types";

/** All published titles, ordered by display_order. For /titles hub. */
export async function loadPublishedTitles(): Promise<JesusTitle[]> {
  const { data, error } = await supabase
    .from("jesus_titles")
    .select(
      "id, slug, name, original_language, original_text, transliteration, " +
        "pronunciation, summary, origin_body, declaration_body, " +
        "theological_meaning_body, display_order, cluster_group, status, " +
        "created_at, updated_at",
    )
    .eq("status", "published")
    .order("display_order", { ascending: true });
  if (error) {
    console.error("[titles/loader] loadPublishedTitles:", error.message);
    return [];
  }
  return (data ?? []) as unknown as JesusTitle[];
}

/** Single title by slug, published only. */
export async function loadTitleBySlug(
  slug: string,
): Promise<JesusTitleWithRefs | null> {
  const { data: titleRow, error: titleErr } = await supabase
    .from("jesus_titles")
    .select(
      "id, slug, name, original_language, original_text, transliteration, " +
        "pronunciation, summary, origin_body, declaration_body, " +
        "theological_meaning_body, display_order, cluster_group, status, " +
        "created_at, updated_at",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (titleErr) {
    console.error("[titles/loader] loadTitleBySlug title:", titleErr.message);
    return null;
  }
  if (!titleRow) return null;

  const { data: refs, error: refsErr } = await supabase
    .from("jesus_title_refs")
    .select(
      "id, title_id, ref_type, book_id, chapter, verse_start, verse_end, " +
        "note, display_order, created_at, " +
        "book:books!jesus_title_refs_book_id_fkey(name, abbreviation)",
    )
    .eq("title_id", (titleRow as unknown as JesusTitle).id)
    .order("ref_type", { ascending: true })
    .order("display_order", { ascending: true });

  if (refsErr) {
    console.error("[titles/loader] loadTitleBySlug refs:", refsErr.message);
  }

  return {
    ...(titleRow as unknown as JesusTitle),
    refs: (refs ?? []) as unknown as JesusTitleRef[],
  };
}

/** Related titles within the same cluster_group (excluding self). */
export async function loadRelatedTitlesInGroup(
  group: string,
  excludeSlug: string,
): Promise<JesusTitle[]> {
  const { data, error } = await supabase
    .from("jesus_titles")
    .select("id, slug, name, summary, cluster_group, display_order, status")
    .eq("cluster_group", group)
    .eq("status", "published")
    .neq("slug", excludeSlug)
    .order("display_order", { ascending: true });
  if (error) return [];
  return (data ?? []) as unknown as JesusTitle[];
}

/**
 * Feature pages that share scripture anchors with the given title's refs.
 * Returns a distinct list of { slug, title, route_prefix } cards.
 */
export async function loadCrossFeaturePages(
  refs: JesusTitleRef[],
): Promise<
  Array<{ slug: string; title: string; href: string; note: string | null }>
> {
  if (refs.length === 0) return [];
  const anchors = refs.map((r) => ({
    book_id: r.book_id,
    chapter: r.chapter,
    verse: r.verse_start,
  }));

  const { data, error } = await supabase
    .from("featured_page_refs")
    .select(
      "featured_page_slug, featured_page_title, route_prefix, book_id, chapter, verse_start, verse_end, note",
    )
    .in(
      "book_id",
      anchors.map((a) => a.book_id),
    );

  if (error || !data) return [];

  const unique = new Map<
    string,
    { slug: string; title: string; href: string; note: string | null }
  >();
  for (const row of data as unknown as Array<{
    featured_page_slug: string;
    featured_page_title: string;
    route_prefix: string | null;
    book_id: number;
    chapter: number;
    verse_start: number;
    verse_end: number | null;
    note: string | null;
  }>) {
    const matches = anchors.some(
      (a) =>
        a.book_id === row.book_id &&
        a.chapter === row.chapter &&
        a.verse >= row.verse_start &&
        a.verse <= (row.verse_end ?? row.verse_start),
    );
    if (!matches) continue;
    if (unique.has(row.featured_page_slug)) continue;
    unique.set(row.featured_page_slug, {
      slug: row.featured_page_slug,
      title: row.featured_page_title,
      href: `${row.route_prefix ?? "/study"}/${row.featured_page_slug}`,
      note: row.note,
    });
  }
  return [...unique.values()];
}
