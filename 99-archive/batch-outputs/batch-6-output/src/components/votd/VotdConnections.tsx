import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { resolveRankedList, DEFAULT_TOP_N } from "@/lib/cross-references/ranking";
import { abbrToUrlSlug } from "@/lib/books";

/**
 * <VotdConnections /> — Layer 2 card cluster for the dedicated VOTD page.
 *
 * Three panels:
 *   1. Related verses — top-N ranked graph_edges from the verse's node,
 *      using Batch 5.5's resolveRankedList pattern.
 *   2. Featured pages — rows from `featured_page_refs` that cover this
 *      verse.
 *   3. Related themes — character/place/concept/event nodes linked to
 *      the verse via graph_edges (type != 'verse').
 *
 * Any panel with zero data is hidden entirely — no empty-state cards.
 */

export default async function VotdConnections({
  verseNodeId,
  bookId,
  chapter,
  verseNum,
}: {
  verseNodeId: number;
  bookId: number;
  chapter: number;
  verseNum: number;
}) {
  const [related, features, themes] = await Promise.all([
    fetchRelatedVerses(verseNodeId),
    fetchFeaturedPages(bookId, chapter, verseNum),
    fetchRelatedThemes(verseNodeId),
  ]);

  if (related.length === 0 && features.length === 0 && themes.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="votd-connections-title" className="mt-10">
      <h2
        id="votd-connections-title"
        className="font-[family-name:var(--font-cinzel)] text-[var(--text)] text-xl mb-5"
      >
        Connection points
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {related.length > 0 && (
          <Panel title="Related verses">
            <ul className="space-y-2">
              {related.map((r) => (
                <li key={r.key} className="list-none">
                  <Link
                    href={r.href}
                    className="block text-sm text-[var(--text)] hover:text-[var(--accent, #C9A227)] transition-colors font-[family-name:var(--font-inter)]"
                  >
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>
        )}
        {features.length > 0 && (
          <Panel title="Featured studies">
            <ul className="space-y-2">
              {features.map((f) => (
                <li key={f.slug} className="list-none">
                  <Link
                    href={f.href}
                    className="block text-sm text-[var(--text)] hover:text-[var(--accent, #C9A227)] transition-colors font-[family-name:var(--font-inter)]"
                  >
                    {f.title}
                    {f.note && (
                      <span className="block mt-0.5 text-xs text-[var(--text-muted)]">
                        {f.note}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>
        )}
        {themes.length > 0 && (
          <Panel title="Themes &amp; people">
            <ul className="space-y-2">
              {themes.map((t) => (
                <li key={t.key} className="list-none">
                  <Link
                    href={t.href}
                    className="block text-sm text-[var(--text)] hover:text-[var(--accent, #C9A227)] transition-colors font-[family-name:var(--font-inter)]"
                  >
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] mr-2">
                      {t.type}
                    </span>
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>
        )}
      </div>
    </section>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5">
      <h3 className="text-[var(--accent, #C9A227)] text-[11px] uppercase tracking-[0.2em] mb-3 font-[family-name:var(--font-inter)]">
        {title}
      </h3>
      {children}
    </div>
  );
}

type RelatedLink = { key: string; href: string; label: string };

async function fetchRelatedVerses(
  verseNodeId: number,
): Promise<RelatedLink[]> {
  const [{ data: outRows }, { data: inRows }] = await Promise.all([
    supabase
      .from("graph_edges")
      .select(
        `id, display_rank, founder_override,
         target:graph_nodes!graph_edges_target_node_id_fkey(id, type, book_id, chapter_num, verse_num)`,
      )
      .eq("source_node_id", verseNodeId)
      .limit(200),
    supabase
      .from("graph_edges")
      .select(
        `id, display_rank, founder_override,
         source:graph_nodes!graph_edges_source_node_id_fkey(id, type, book_id, chapter_num, verse_num)`,
      )
      .eq("target_node_id", verseNodeId)
      .limit(200),
  ]);

  type Raw = {
    id: number;
    display_rank: number | null;
    founder_override: boolean;
    book_id: number;
    chapter_num: number;
    verse_num: number;
  };
  const raws: Raw[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const r of (outRows ?? []) as any[]) {
    if (r?.target?.type === "verse" && r.target.book_id && r.target.chapter_num && r.target.verse_num) {
      raws.push({
        id: r.id,
        display_rank: r.display_rank ?? null,
        founder_override: !!r.founder_override,
        book_id: r.target.book_id,
        chapter_num: r.target.chapter_num,
        verse_num: r.target.verse_num,
      });
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const r of (inRows ?? []) as any[]) {
    if (r?.source?.type === "verse" && r.source.book_id && r.source.chapter_num && r.source.verse_num) {
      raws.push({
        id: r.id,
        display_rank: r.display_rank ?? null,
        founder_override: !!r.founder_override,
        book_id: r.source.book_id,
        chapter_num: r.source.chapter_num,
        verse_num: r.source.verse_num,
      });
    }
  }

  const ranked = resolveRankedList(raws);
  // Dedupe by target verse
  const seen = new Set<string>();
  const unique: Raw[] = [];
  for (const r of ranked) {
    const key = `${r.book_id}-${r.chapter_num}-${r.verse_num}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(r);
    if (unique.length >= DEFAULT_TOP_N) break;
  }
  if (unique.length === 0) return [];

  const bookIds = [...new Set(unique.map((r) => r.book_id))];
  const { data: books } = await supabase
    .from("books")
    .select("id, name, abbreviation")
    .in("id", bookIds);
  const bmap = new Map<number, { name: string; abbr: string }>();
  for (const b of books ?? []) {
    bmap.set(b.id as number, {
      name: b.name as string,
      abbr: b.abbreviation as string,
    });
  }

  return unique
    .map((r): RelatedLink | null => {
      const bk = bmap.get(r.book_id);
      if (!bk) return null;
      return {
        key: `${r.id}-${r.book_id}-${r.chapter_num}-${r.verse_num}`,
        href: `/verse/${abbrToUrlSlug(bk.abbr)}/${r.chapter_num}/${r.verse_num}`,
        label: `${bk.name} ${r.chapter_num}:${r.verse_num}`,
      };
    })
    .filter((x): x is RelatedLink => x !== null);
}

type FeatureLink = {
  slug: string;
  title: string;
  href: string;
  note: string | null;
};

async function fetchFeaturedPages(
  bookId: number,
  chapter: number,
  verseNum: number,
): Promise<FeatureLink[]> {
  const { data } = await supabase
    .from("featured_page_refs")
    .select("featured_page_slug, featured_page_title, route_prefix, verse_start, verse_end, note")
    .eq("book_id", bookId)
    .eq("chapter", chapter);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows = (data ?? []) as any[];
  // Keep rows whose range covers verseNum
  const hits = rows.filter((r) => {
    const start = r.verse_start as number;
    const end = (r.verse_end as number | null) ?? start;
    return verseNum >= start && verseNum <= end;
  });
  // Dedupe by slug; keep the first hit
  const seen = new Set<string>();
  const out: FeatureLink[] = [];
  for (const r of hits) {
    if (seen.has(r.featured_page_slug)) continue;
    seen.add(r.featured_page_slug);
    out.push({
      slug: r.featured_page_slug,
      title: r.featured_page_title,
      href: `${r.route_prefix ?? "/study"}/${r.featured_page_slug}`,
      note: (r.note as string | null) ?? null,
    });
  }
  return out;
}

type ThemeLink = { key: string; type: string; label: string; href: string };

async function fetchRelatedThemes(verseNodeId: number): Promise<ThemeLink[]> {
  const [{ data: outRows }, { data: inRows }] = await Promise.all([
    supabase
      .from("graph_edges")
      .select(
        `id,
         target:graph_nodes!graph_edges_target_node_id_fkey(id, type, label, metadata)`,
      )
      .eq("source_node_id", verseNodeId)
      .limit(100),
    supabase
      .from("graph_edges")
      .select(
        `id,
         source:graph_nodes!graph_edges_source_node_id_fkey(id, type, label, metadata)`,
      )
      .eq("target_node_id", verseNodeId)
      .limit(100),
  ]);

  const out: ThemeLink[] = [];
  const seen = new Set<string>();
  const consider = (
    n:
      | {
          id: number;
          type: string;
          label: string;
          metadata: Record<string, unknown> | null;
        }
      | null
      | undefined,
  ) => {
    if (!n || n.type === "verse") return;
    if (seen.has(`${n.type}-${n.id}`)) return;
    seen.add(`${n.type}-${n.id}`);
    const href = hrefForNode(n);
    if (!href) return;
    out.push({
      key: `${n.type}-${n.id}`,
      type: n.type,
      label: n.label,
      href,
    });
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const r of (outRows ?? []) as any[]) consider(r?.target);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const r of (inRows ?? []) as any[]) consider(r?.source);
  return out.slice(0, 6);
}

function hrefForNode(n: {
  type: string;
  label: string;
  metadata: Record<string, unknown> | null;
}): string | null {
  const slug =
    typeof n.metadata?.slug === "string" ? (n.metadata.slug as string) : null;
  switch (n.type) {
    case "person":
      return slug ? `/person/${slug}` : null;
    case "place":
      return slug ? `/place/${slug}` : null;
    case "concept":
      return slug ? `/concept/${slug}` : null;
    case "event":
      return slug ? `/event/${slug}` : null;
    case "manuscript":
      return slug ? `/manuscript/${slug}` : null;
    case "prophecy":
      return slug ? `/prophecies/${slug}` : null;
    default:
      return null;
  }
}
