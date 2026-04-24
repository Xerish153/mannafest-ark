import { notFound } from "next/navigation";
import Link from "next/link";
import {
  createSupabaseServerClient,
  createSupabaseServiceClient,
} from "@/lib/supabase/server";
import { resolveRankedList } from "@/lib/cross-references/ranking";
import { abbrToUrlSlug } from "@/lib/books";
import OverrideEditor, { type EditorEdge } from "./OverrideEditor";

/**
 * Super-admin override surface for a verse's cross-references.
 *
 * Route: /admin/cross-references/[verseId] where verseId is a graph_nodes.id
 * (bigint). That is the authoritative cross-reference identity in this
 * project — see the Batch 5.5 entry audit note: cross-references are
 * graph_edges between graph_nodes of type='verse'; there is no dedicated
 * cross_references table.
 *
 * Gating: /admin/layout.tsx already runs requireAdmin() on every /admin/*
 * request, which redirects non-admins to /. This page is therefore safe to
 * render without re-gating; the PATCH endpoint enforces its own gate via
 * requireSuperAdmin() server-side.
 *
 * Reorder UX: explicit move-up / move-down / pin / reset buttons. Drag-to-
 * reorder is preferred per the prompt but "not required" — buttons ship
 * faster and work on mobile + keyboard without extra libraries.
 */

type PageProps = {
  params: Promise<{ verseId: string }>;
};

export const metadata = {
  title: "Cross-reference overrides — MannaFest Admin",
  robots: { index: false, follow: false },
};

export default async function CrossRefAdminPage({ params }: PageProps) {
  const { verseId: verseIdStr } = await params;
  const verseNodeId = parseInt(verseIdStr, 10);
  if (!Number.isFinite(verseNodeId)) notFound();

  // Service-role client for reads — bypasses RLS, and the /admin/layout
  // requireAdmin() gate has already authorized the user.
  const admin = createSupabaseServiceClient();

  const { data: verseNode } = await admin
    .from("graph_nodes")
    .select("id, type, book_id, chapter_num, verse_num")
    .eq("id", verseNodeId)
    .maybeSingle();
  if (!verseNode || verseNode.type !== "verse") notFound();

  const { data: book } = await admin
    .from("books")
    .select("id, name, abbreviation")
    .eq("id", verseNode.book_id)
    .maybeSingle();
  if (!book) notFound();

  // Fetch outgoing and incoming verse edges with current ranking state.
  const [outRes, inRes] = await Promise.all([
    admin
      .from("graph_edges")
      .select(
        `id, display_rank, founder_override, relationship_type, weight,
         target:graph_nodes!graph_edges_target_node_id_fkey(id, type, book_id, chapter_num, verse_num)`,
      )
      .eq("source_node_id", verseNodeId)
      .limit(500),
    admin
      .from("graph_edges")
      .select(
        `id, display_rank, founder_override, relationship_type, weight,
         source:graph_nodes!graph_edges_source_node_id_fkey(id, type, book_id, chapter_num, verse_num)`,
      )
      .eq("target_node_id", verseNodeId)
      .limit(500),
  ]);

  // Normalize to EditorEdge shape and resolve book names in one query.
  type Raw = {
    edge_id: number;
    display_rank: number | null;
    founder_override: boolean;
    direction: "outgoing" | "incoming";
    relationship_type: string;
    other_book_id: number;
    other_chapter: number;
    other_verse: number;
  };
  const raws: Raw[] = [];
  for (const row of outRes.data ?? []) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const r = row as any;
    if (!r.target || r.target.type !== "verse") continue;
    if (r.target.book_id == null || r.target.chapter_num == null || r.target.verse_num == null) continue;
    raws.push({
      edge_id: r.id,
      display_rank: r.display_rank ?? null,
      founder_override: !!r.founder_override,
      direction: "outgoing",
      relationship_type: r.relationship_type ?? "cross_reference",
      other_book_id: r.target.book_id,
      other_chapter: r.target.chapter_num,
      other_verse: r.target.verse_num,
    });
  }
  for (const row of inRes.data ?? []) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const r = row as any;
    if (!r.source || r.source.type !== "verse") continue;
    if (r.source.book_id == null || r.source.chapter_num == null || r.source.verse_num == null) continue;
    raws.push({
      edge_id: r.id,
      display_rank: r.display_rank ?? null,
      founder_override: !!r.founder_override,
      direction: "incoming",
      relationship_type: r.relationship_type ?? "cross_reference",
      other_book_id: r.source.book_id,
      other_chapter: r.source.chapter_num,
      other_verse: r.source.verse_num,
    });
  }

  const otherBookIds = [...new Set(raws.map((r) => r.other_book_id))];
  const bookMap = new Map<number, { name: string; abbreviation: string }>();
  if (otherBookIds.length > 0) {
    const { data: books } = await admin
      .from("books")
      .select("id, name, abbreviation")
      .in("id", otherBookIds);
    for (const b of books ?? []) {
      bookMap.set(b.id as number, {
        name: b.name as string,
        abbreviation: b.abbreviation as string,
      });
    }
  }

  const edges: EditorEdge[] = raws
    .map((r): EditorEdge | null => {
      const bk = bookMap.get(r.other_book_id);
      if (!bk) return null;
      return {
        edge_id: r.edge_id,
        display_rank: r.display_rank,
        founder_override: r.founder_override,
        direction: r.direction,
        relationship_type: r.relationship_type,
        other_book_id: r.other_book_id,
        other_chapter: r.other_chapter,
        other_verse: r.other_verse,
        other_book_name: bk.name,
        other_book_abbr: bk.abbreviation,
      };
    })
    .filter((e): e is EditorEdge => e !== null);

  // Dedupe by target verse — keep the highest-ranked copy to mirror what
  // the public verse page shows. Duplicate edges in graph_edges (known data
  // issue surfaced during Batch 5.5 entry audit) would otherwise clutter
  // the admin view.
  const deduped: EditorEdge[] = [];
  const seen = new Set<string>();
  for (const e of resolveRankedList(edges)) {
    const key = `${e.other_book_id}-${e.other_chapter}-${e.other_verse}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(e);
  }

  const publicSlug = abbrToUrlSlug(book.abbreviation);
  const publicHref = `/verse/${publicSlug}/${verseNode.chapter_num}/${verseNode.verse_num}`;

  return (
    <div className="space-y-6">
      <header>
        <div className="text-[#C9A227] text-[11px] tracking-[0.2em] uppercase mb-2 font-[family-name:var(--font-inter)]">
          Cross-reference overrides
        </div>
        <h1 className="font-[family-name:var(--font-cinzel)] text-white text-3xl mb-1">
          {book.name} {verseNode.chapter_num}:{verseNode.verse_num}
        </h1>
        <p className="text-[#9CA3AF] text-sm font-[family-name:var(--font-inter)]">
          {deduped.length} unique cross-reference{deduped.length === 1 ? "" : "s"}.{" "}
          <Link href={publicHref} className="text-[#C9A227] hover:underline">
            View on the public verse page →
          </Link>
        </p>
      </header>

      <div className="bg-[#0F1117] border border-[#1E2028] rounded-lg p-6">
        <h2 className="font-[family-name:var(--font-cinzel)] text-white text-lg mb-1">
          Reorder &amp; pin
        </h2>
        <p className="text-[#9CA3AF] text-xs mb-4 font-[family-name:var(--font-inter)]">
          Move rows up or down to change the top-5 order on the public verse page.
          Moved rows are automatically flagged as founder-pinned. &ldquo;Reset to auto&rdquo;
          unpins a row and leaves its rank as-is &mdash; future moves of other rows
          will push it down below any new pins.
        </p>

        <OverrideEditor verseNodeId={verseNodeId} initial={deduped} />
      </div>
    </div>
  );
}
