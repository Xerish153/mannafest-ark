import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * /admin/commentary — landing page.
 *
 * Admin layout already runs requireAdmin() upstream; non-admins are
 * redirected to "/" before this renders. No duplicate gate here.
 *
 * Content:
 *  - Client-side search input (book + chapter → redirects to per-chapter page).
 *  - Recently curated list (rows with curated_at NOT NULL, sorted desc).
 */

export const metadata = { title: "Commentary curation — MannaFest" };

type RecentRow = {
  id: string;
  verse_reference: string;
  book_id: number | null;
  chapter: number;
  featured: boolean;
  featured_excerpt: string | null;
  curated_at: string | null;
  author: string;
};

async function fetchRecent(): Promise<RecentRow[]> {
  const { data } = await supabaseAdmin
    .from("commentaries")
    .select(
      "id, verse_reference, book_id, chapter, featured, featured_excerpt, curated_at, author",
    )
    .not("curated_at", "is", null)
    .order("curated_at", { ascending: false })
    .limit(30);
  return (data ?? []) as RecentRow[];
}

export default async function CommentaryAdminPage() {
  const recent = await fetchRecent();

  return (
    <div className="text-[#E5E7EB] space-y-8">
      <header>
        <h1 className="text-xl font-serif mb-2">Commentary curation</h1>
        <p className="text-sm text-[#9CA3AF]">
          Feature a single voice per chapter, trim excerpts to ≤50 words, add
          curator notes, and prune entries. Commentary is per chapter today;
          per-verse founder notes enter as author_type=&lsquo;founder&rsquo; rows with a
          specific verse_start.
        </p>
      </header>

      <section aria-label="Jump to a chapter" className="rounded border border-[#1F2937] p-4">
        <form action="/admin/commentary/go" method="GET" className="flex flex-wrap items-center gap-2">
          <label className="text-sm">
            <span className="sr-only">Book slug</span>
            <input
              name="book"
              placeholder="book (e.g. genesis)"
              required
              className="w-56 rounded bg-[#0F1218] border border-[#1F2937] px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
            />
          </label>
          <label className="text-sm">
            <span className="sr-only">Chapter</span>
            <input
              name="chapter"
              type="number"
              min={1}
              placeholder="chapter"
              required
              className="w-28 rounded bg-[#0F1218] border border-[#1F2937] px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
            />
          </label>
          <button
            type="submit"
            className="rounded bg-[#C9A227] px-3 py-1.5 text-sm font-medium text-[#08090C] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Open curation panel
          </button>
        </form>
      </section>

      <section aria-label="Recently curated">
        <h2 className="text-sm uppercase tracking-widest text-[#9CA3AF] mb-3">
          Recently curated
        </h2>
        {recent.length === 0 ? (
          <p className="text-sm text-[#9CA3AF]">
            No curation activity yet. Use the form above to open a chapter.
          </p>
        ) : (
          <ul className="divide-y divide-[#1F2937] border border-[#1F2937] rounded">
            {recent.map((r) => {
              const slug = r.verse_reference.replace(/-\d+$/, "");
              return (
                <li key={r.id}>
                  <Link
                    href={`/admin/commentary/${slug}/${r.chapter}`}
                    className="flex items-center justify-between gap-3 px-3 py-2 text-sm hover:bg-[#0F1218]"
                  >
                    <span>
                      <span className="font-mono text-[#C9A227]">{r.verse_reference}</span>
                      <span className="ml-2 text-[#9CA3AF]">{r.author}</span>
                      {r.featured && (
                        <span className="ml-2 rounded bg-[#1F2937] px-1.5 py-0.5 text-[10px] text-[#E5E7EB]">
                          FEATURED
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-[#6B7280]">
                      {r.curated_at
                        ? new Date(r.curated_at).toLocaleString()
                        : ""}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
