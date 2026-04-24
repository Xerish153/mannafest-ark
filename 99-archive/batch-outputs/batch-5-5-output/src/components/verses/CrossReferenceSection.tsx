import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Cite } from "@/components/Cite";
import { resolveRankedList, DEFAULT_TOP_N } from "@/lib/cross-references/ranking";
import { abbrToUrlSlug } from "@/lib/books";

/**
 * <CrossReferenceSection /> — Batch 5.5 replacement for the 281-card wall.
 *
 * Renders the top-N cross-references for a verse inline (DEFAULT_TOP_N = 5),
 * with the remainder behind a "Show all N cross-references" disclosure.
 * Ranking uses graph_edges.display_rank + founder_override (migrations 049/050).
 *
 * Data shape note: cross-references in this project live on graph_edges
 * between graph_nodes of type='verse'. There is no dedicated cross_references
 * table; ranking columns were added to graph_edges in migration 049.
 *
 * The fetch unions outgoing + incoming edges (both directions are cross-refs
 * from the student's perspective) and dedupes by target verse — graph_edges
 * currently carries duplicates across source ingests which would otherwise
 * surface as "Genesis 15:1, Genesis 15:1, Genesis 15:1" in the top 5. Dedup
 * is keyed by (book_id, chapter_num, verse_num); the first (highest-ranked)
 * copy wins.
 */

type RankedVerseEdge = {
  /** graph_edges.id — stable key + admin PATCH target */
  edge_id: number;
  display_rank: number | null;
  founder_override: boolean;
  direction: "outgoing" | "incoming";
  relationship_type: string;
  /** The OTHER end — i.e. the cross-referenced verse, not the current page verse */
  book_id: number;
  chapter_num: number;
  verse_num: number;
  book_name: string;
  book_abbr: string;
};

async function fetchRankedVerseEdges(
  graphNodeId: number,
): Promise<RankedVerseEdge[]> {
  // Fetch outgoing and incoming in parallel. Each is bounded by the
  // PostgREST 1000-row cap; we explicitly cap at 500 each for defensible
  // worst-case behavior (Romans 8:31: 81 out + 291 in = 372 total; within cap).
  const [outRes, inRes] = await Promise.all([
    supabase
      .from("graph_edges")
      .select(
        `id, display_rank, founder_override, relationship_type,
         target:graph_nodes!graph_edges_target_node_id_fkey(id, type, book_id, chapter_num, verse_num)`,
      )
      .eq("source_node_id", graphNodeId)
      .order("founder_override", { ascending: false })
      .order("display_rank", { ascending: true, nullsFirst: false })
      .limit(500),
    supabase
      .from("graph_edges")
      .select(
        `id, display_rank, founder_override, relationship_type,
         source:graph_nodes!graph_edges_source_node_id_fkey(id, type, book_id, chapter_num, verse_num)`,
      )
      .eq("target_node_id", graphNodeId)
      .order("founder_override", { ascending: false })
      .order("display_rank", { ascending: true, nullsFirst: false })
      .limit(500),
  ]);

  // Collect distinct book_ids for a single books join.
  const raw: {
    edge_id: number;
    display_rank: number | null;
    founder_override: boolean;
    direction: "outgoing" | "incoming";
    relationship_type: string;
    other: { book_id: number | null; chapter_num: number | null; verse_num: number | null };
  }[] = [];

  for (const row of outRes.data ?? []) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const r = row as any;
    if (!r.target || r.target.type !== "verse") continue;
    raw.push({
      edge_id: r.id,
      display_rank: r.display_rank ?? null,
      founder_override: !!r.founder_override,
      direction: "outgoing",
      relationship_type: r.relationship_type ?? "cross_reference",
      other: {
        book_id: r.target.book_id ?? null,
        chapter_num: r.target.chapter_num ?? null,
        verse_num: r.target.verse_num ?? null,
      },
    });
  }
  for (const row of inRes.data ?? []) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const r = row as any;
    if (!r.source || r.source.type !== "verse") continue;
    raw.push({
      edge_id: r.id,
      display_rank: r.display_rank ?? null,
      founder_override: !!r.founder_override,
      direction: "incoming",
      relationship_type: r.relationship_type ?? "cross_reference",
      other: {
        book_id: r.source.book_id ?? null,
        chapter_num: r.source.chapter_num ?? null,
        verse_num: r.source.verse_num ?? null,
      },
    });
  }

  // Resolve book names in one round-trip.
  const bookIds = [
    ...new Set(
      raw
        .map((r) => r.other.book_id)
        .filter((id): id is number => id != null),
    ),
  ];
  const bookMap = new Map<number, { name: string; abbreviation: string }>();
  if (bookIds.length > 0) {
    const { data: books } = await supabase
      .from("books")
      .select("id, name, abbreviation")
      .in("id", bookIds);
    for (const b of books ?? []) {
      bookMap.set(b.id as number, {
        name: b.name as string,
        abbreviation: b.abbreviation as string,
      });
    }
  }

  const edges: RankedVerseEdge[] = [];
  for (const r of raw) {
    if (
      r.other.book_id == null ||
      r.other.chapter_num == null ||
      r.other.verse_num == null
    ) {
      continue;
    }
    const book = bookMap.get(r.other.book_id);
    if (!book) continue;
    edges.push({
      edge_id: r.edge_id,
      display_rank: r.display_rank,
      founder_override: r.founder_override,
      direction: r.direction,
      relationship_type: r.relationship_type,
      book_id: r.other.book_id,
      chapter_num: r.other.chapter_num,
      verse_num: r.other.verse_num,
      book_name: book.name,
      book_abbr: book.abbreviation,
    });
  }
  return edges;
}

/** Dedupe by target verse — keep the highest-ranked (first after resolveRankedList). */
function dedupByVerse(edges: RankedVerseEdge[]): RankedVerseEdge[] {
  const seen = new Set<string>();
  const kept: RankedVerseEdge[] = [];
  for (const e of edges) {
    const key = `${e.book_id}-${e.chapter_num}-${e.verse_num}`;
    if (seen.has(key)) continue;
    seen.add(key);
    kept.push(e);
  }
  return kept;
}

export default async function CrossReferenceSection({
  graphNodeId,
}: {
  graphNodeId: number | null;
}) {
  if (graphNodeId == null) return null;

  const rawEdges = await fetchRankedVerseEdges(graphNodeId);
  if (rawEdges.length === 0) return null;

  const ranked = resolveRankedList(rawEdges);
  const unique = dedupByVerse(ranked);

  const shown = unique.slice(0, DEFAULT_TOP_N);
  const rest = unique.slice(DEFAULT_TOP_N);
  const totalCount = unique.length;

  return (
    <section id="cross-references" className="mb-8">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg">
        <div className="px-6 py-4 border-b border-[var(--border)] flex items-baseline justify-between gap-4">
          <h2 className="font-[family-name:var(--font-cinzel)] text-[var(--text)] text-lg">
            Cross-references
          </h2>
          <span className="text-[var(--text-muted)] text-xs font-[family-name:var(--font-inter)]">
            {totalCount} verse{totalCount === 1 ? "" : "s"}
          </span>
        </div>
        <div className="px-6 py-5">
          <ul className="space-y-2">
            {shown.map((e) => (
              <CrossRefCard key={`top-${e.edge_id}`} edge={e} />
            ))}
          </ul>

          {rest.length > 0 && (
            <details className="mt-5 group">
              <summary className="cursor-pointer select-none text-sm text-[var(--accent, #C9A227)] hover:underline font-[family-name:var(--font-inter)] list-none">
                Show all {totalCount} cross-references{" "}
                <span className="inline-block group-open:rotate-180 transition-transform text-xs">
                  ▾
                </span>
              </summary>
              <ul className="mt-4 space-y-2">
                {rest.map((e) => (
                  <CrossRefCard key={`rest-${e.edge_id}`} edge={e} />
                ))}
              </ul>
            </details>
          )}
        </div>
      </div>
    </section>
  );
}

function CrossRefCard({ edge }: { edge: RankedVerseEdge }) {
  const slug = abbrToUrlSlug(edge.book_abbr);
  const href = `/verse/${slug}/${edge.chapter_num}/${edge.verse_num}`;
  return (
    <li className="bg-[var(--bg)] border border-[var(--border)] rounded px-3 py-2 list-none hover:border-[var(--accent, #C9A227)] transition-colors">
      <Link href={href} className="flex items-baseline gap-3">
        <Cite
          kind="scripture"
          book={edge.book_name}
          chapter={edge.chapter_num}
          verse={edge.verse_num}
        />
        {edge.founder_override && (
          <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--accent, #C9A227)] font-[family-name:var(--font-inter)]">
            Pinned
          </span>
        )}
      </Link>
    </li>
  );
}
