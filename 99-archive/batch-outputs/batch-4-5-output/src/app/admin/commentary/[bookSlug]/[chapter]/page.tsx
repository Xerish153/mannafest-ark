import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { CurationPanel } from "./CurationPanel";

/**
 * /admin/commentary/[bookSlug]/[chapter] — per-chapter curation panel.
 *
 * Server component: fetches commentary rows (including hidden) joined with
 * scholars. Passes to <CurationPanel /> which is the client-side action
 * surface (Feature / Set excerpt / Add note / Hide / Add founder note).
 *
 * bookSlug is the slug used elsewhere in the app (bookName.toLowerCase()
 * .replace(/\s+/g, "-")) — e.g. "genesis", "1-samuel". Looked up against
 * books.name with slug reversal; we don't hardcode a separate slug column.
 */

type Params = { params: Promise<{ bookSlug: string; chapter: string }> };

async function resolveBookId(slug: string): Promise<{ id: number; name: string } | null> {
  // Normalize: "1-samuel" -> "1 Samuel"; "genesis" -> "Genesis"
  const guess = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  const { data } = await supabaseAdmin
    .from("books")
    .select("id, name")
    .ilike("name", guess)
    .maybeSingle();
  if (data) return data as { id: number; name: string };
  // Fallback — try exact lowercase match against a space-normalized name.
  const { data: fuzzy } = await supabaseAdmin
    .from("books")
    .select("id, name")
    .ilike("name", slug.replace(/-/g, " "));
  if (fuzzy && fuzzy.length > 0) {
    return fuzzy[0] as { id: number; name: string };
  }
  return null;
}

type CurationRow = {
  id: string;
  verse_reference: string;
  chapter: number;
  verse_start: number;
  author: string;
  source: string;
  commentary_text: string;
  scholar_id: string;
  featured: boolean;
  featured_excerpt: string | null;
  founder_curated: boolean;
  author_type: "sourced" | "founder";
  status: "published" | "hidden";
  curator_note: string | null;
  scholar: {
    id: string;
    slug: string;
    name: string;
    tradition_key: string | null;
    default_rank: number;
    is_founder: boolean;
  } | null;
};

export default async function CommentaryChapterAdminPage({ params }: Params) {
  const { bookSlug, chapter } = await params;
  const chapterNum = Number.parseInt(chapter, 10);
  if (!Number.isFinite(chapterNum) || chapterNum <= 0) {
    return (
      <div className="text-[#E5E7EB]">
        <p>Invalid chapter.</p>
        <Link href="/admin/commentary" className="text-[#C9A227] underline">
          Back to commentary admin
        </Link>
      </div>
    );
  }

  const book = await resolveBookId(bookSlug);
  if (!book) {
    return (
      <div className="text-[#E5E7EB] space-y-3">
        <p>Could not resolve book slug &quot;{bookSlug}&quot;.</p>
        <Link href="/admin/commentary" className="text-[#C9A227] underline">
          Back to commentary admin
        </Link>
      </div>
    );
  }

  const { data } = await supabaseAdmin
    .from("commentaries")
    .select(
      `id, verse_reference, chapter, verse_start, author, source, commentary_text,
       scholar_id, featured, featured_excerpt, founder_curated, author_type, status,
       curator_note,
       scholar:scholars!commentaries_scholar_id_fkey(id, slug, name, tradition_key, default_rank, is_founder)`,
    )
    .eq("book_id", book.id)
    .eq("chapter", chapterNum)
    .order("verse_start", { ascending: true });

  const rows = ((data ?? []) as unknown as CurationRow[]).filter(
    (r) => r.scholar !== null,
  );

  return (
    <div className="text-[#E5E7EB] space-y-6">
      <header className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-[#9CA3AF]">
            Commentary curation
          </div>
          <h1 className="text-xl font-serif">
            {book.name} {chapterNum}
          </h1>
        </div>
        <Link
          href="/admin/commentary"
          className="text-sm text-[#9CA3AF] hover:text-white"
        >
          ← Back
        </Link>
      </header>

      {rows.length === 0 ? (
        <p className="text-sm text-[#9CA3AF]">
          No commentary entries for {book.name} {chapterNum}. Use &ldquo;Add founder
          note as Pastor Marc&rdquo; below to author one.
        </p>
      ) : (
        <CurationPanel
          entries={rows.map((r) => ({ ...r, scholar: r.scholar! }))}
          bookName={book.name}
          chapter={chapterNum}
        />
      )}
    </div>
  );
}
