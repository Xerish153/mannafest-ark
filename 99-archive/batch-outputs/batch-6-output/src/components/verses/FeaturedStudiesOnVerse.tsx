import Link from "next/link";
import { supabase } from "@/lib/supabase";

/**
 * <FeaturedStudiesOnVerse /> — card cluster on the verse page listing
 * shipped feature pages that reference this verse via `featured_page_refs`.
 *
 * Placement on the verse page: below commentary (<CommentaryVoices />),
 * above <CrossReferenceSection /> — per Batch 6 §3.4. Returns null when
 * no refs cover this verse — no empty-state shell.
 *
 * A ref row's range is [verse_start, COALESCE(verse_end, verse_start)].
 * Multiple rows for the same slug collapse to one card; the first hit's
 * note wins.
 */

export default async function FeaturedStudiesOnVerse({
  bookId,
  chapter,
  verseNum,
}: {
  bookId: number;
  chapter: number;
  verseNum: number;
}) {
  // Query rows in the chapter; filter range client-side (PostgREST can't
  // express `verseNum BETWEEN verse_start AND COALESCE(verse_end, verse_start)`
  // in a single filter without RPC).
  const { data } = await supabase
    .from("featured_page_refs")
    .select(
      "featured_page_slug, featured_page_title, route_prefix, verse_start, verse_end, note",
    )
    .eq("book_id", bookId)
    .eq("chapter", chapter);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows = (data ?? []) as any[];
  const hits = rows.filter((r) => {
    const start = r.verse_start as number;
    const end = (r.verse_end as number | null) ?? start;
    return verseNum >= start && verseNum <= end;
  });
  if (hits.length === 0) return null;

  const bySlug = new Map<string, {
    slug: string;
    title: string;
    href: string;
    note: string | null;
  }>();
  for (const r of hits) {
    if (bySlug.has(r.featured_page_slug)) continue;
    bySlug.set(r.featured_page_slug, {
      slug: r.featured_page_slug,
      title: r.featured_page_title,
      href: `${r.route_prefix ?? "/study"}/${r.featured_page_slug}`,
      note: (r.note as string | null) ?? null,
    });
  }
  const cards = [...bySlug.values()];

  return (
    <section
      id="featured-studies"
      className="mb-8"
      aria-labelledby="featured-studies-title"
    >
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg">
        <div className="px-6 py-4 border-b border-[var(--border)] flex items-baseline justify-between gap-4">
          <h2
            id="featured-studies-title"
            className="font-[family-name:var(--font-cinzel)] text-[var(--text)] text-lg"
          >
            Featured studies on this verse
          </h2>
          <span className="text-[var(--text-muted)] text-xs font-[family-name:var(--font-inter)]">
            {cards.length} stud{cards.length === 1 ? "y" : "ies"}
          </span>
        </div>
        <div className="px-6 py-5">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {cards.map((c) => (
              <li key={c.slug} className="list-none">
                <Link
                  href={c.href}
                  className="block bg-[var(--bg)] border border-[var(--border)] rounded px-4 py-3 hover:border-[var(--accent, #C9A227)] transition-colors"
                >
                  <div className="font-[family-name:var(--font-cinzel)] text-[var(--text)] text-sm">
                    {c.title}
                  </div>
                  {c.note && (
                    <p className="mt-1 text-xs text-[var(--text-muted)] font-[family-name:var(--font-inter)]">
                      {c.note}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
