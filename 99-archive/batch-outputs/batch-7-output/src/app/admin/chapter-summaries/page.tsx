import Link from "next/link";
import { redirect } from "next/navigation";
import { requireSuperAdmin, SuperAdminError } from "@/lib/auth/super-admin";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { bookById } from "@/lib/bible/book-slugs";

/**
 * Batch 7 — Admin queue for chapter summaries.
 *
 * Prioritized ordering:
 *   (a) Mark 16 + John 21 first (textual-evidence anchors)
 *   (b) Founder-flagged key chapters (the KeyChapter lists from Phase 6
 *       hubs — hard-coded here to avoid a round-trip)
 *   (c) Canonical order (book_id, chapter)
 *
 * Published rows render in the public reader via ChapterSummaryBlock;
 * drafts never leak to public.
 */

const PRIORITY_KEY_CHAPTERS = new Set<string>([
  "41:16", // Mark 16
  "43:21", // John 21
  "40:1", "40:5", "40:13", "40:16", "40:24", "40:28", // Matthew key
  "41:1", "41:4", "41:8", "41:10", "41:14", // Mark key
  "42:1", "42:4", "42:10", "42:15", "42:19", "42:24", // Luke key
  "43:1", "43:3", "43:6", "43:11", "43:14", "43:17", "43:20", // John key
  "44:1", "44:2", "44:7", "44:9", "44:10", "44:15", "44:17", "44:20", "44:27", "44:28", // Acts key
]);

type Row = {
  id: number;
  book_id: number;
  chapter: number;
  body: string | null;
  status: "draft" | "published";
  drafted_by: string | null;
  updated_at: string;
};

function priorityOf(r: Row): number {
  const key = `${r.book_id}:${r.chapter}`;
  if (r.book_id === 41 && r.chapter === 16) return 0;
  if (r.book_id === 43 && r.chapter === 21) return 0;
  if (PRIORITY_KEY_CHAPTERS.has(key)) return 1;
  return 2;
}

export default async function AdminChapterSummariesPage() {
  try {
    await requireSuperAdmin();
  } catch (err) {
    if (err instanceof SuperAdminError) {
      if (err.status === 401) redirect("/auth/signin");
      redirect("/");
    }
    throw err;
  }

  const service = createSupabaseServiceClient();
  const { data, error } = await service
    .from("chapter_summaries")
    .select("id, book_id, chapter, body, status, drafted_by, updated_at")
    .order("book_id")
    .order("chapter");

  if (error) {
    return (
      <div className="min-h-screen bg-[#08090C] p-6">
        <p className="text-red-400">Error loading queue: {error.message}</p>
      </div>
    );
  }

  const rows = (data ?? []) as Row[];
  const sorted = [...rows].sort((a, b) => {
    const dp = priorityOf(a) - priorityOf(b);
    if (dp !== 0) return dp;
    if (a.book_id !== b.book_id) return a.book_id - b.book_id;
    return a.chapter - b.chapter;
  });

  const drafts = sorted.filter((r) => r.status === "draft");
  const published = sorted.filter((r) => r.status === "published");

  return (
    <div className="min-h-screen bg-[#08090C] text-[#F0EDE8]">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="font-[family-name:var(--font-cinzel)] text-3xl mb-2">
          Chapter summaries — review queue
        </h1>
        <p className="text-[#9CA3AF] text-sm mb-8 font-[family-name:var(--font-inter)]">
          {drafts.length} draft{drafts.length === 1 ? "" : "s"} ·{" "}
          {published.length} published
        </p>

        <Section title="Drafts — priority" rows={drafts} />
        <Section title="Published" rows={published} />
      </div>
    </div>
  );
}

function Section({ title, rows }: { title: string; rows: Row[] }) {
  if (rows.length === 0) return null;
  return (
    <section className="mb-10">
      <h2 className="text-[#C9A227] text-xs tracking-[0.2em] uppercase mb-3 font-[family-name:var(--font-inter)]">
        {title}
      </h2>
      <ul className="divide-y divide-[#1E2028] border border-[#1E2028] rounded bg-[#0F1117]">
        {rows.map((r) => {
          const book = bookById(r.book_id);
          const preview = (r.body ?? "").slice(0, 100);
          return (
            <li key={r.id}>
              <Link
                href={`/admin/chapter-summaries/${r.id}`}
                className="flex items-baseline gap-4 p-4 hover:bg-[#1E2028] transition-colors group"
              >
                <span className="font-[family-name:var(--font-cinzel)] text-[#C9A227] w-28 shrink-0">
                  {book?.name ?? `Book ${r.book_id}`} {r.chapter}
                </span>
                <span className="text-[#9CA3AF] text-sm min-w-0 truncate font-[family-name:var(--font-serif)]">
                  {preview || "— no body yet —"}
                </span>
                <span
                  className={[
                    "ml-auto text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border font-[family-name:var(--font-inter)]",
                    r.status === "published"
                      ? "text-[#C9A227] border-[#C9A227]/40"
                      : "text-[#9CA3AF] border-[#1E2028]",
                  ].join(" ")}
                >
                  {r.status}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
