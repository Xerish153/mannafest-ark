import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { canonicalVotdForDay, getDayOfYear } from "@/lib/votd/canonical-verses";
import ReflectionEditor, { type ScholarOption } from "./ReflectionEditor";

/**
 * /admin/verse-of-the-day/[date] — single-day editor.
 *
 * Loads the existing votd_reflections row (if any), resolves the default
 * verse (either the row's verse_id or the canonical day-of-year verse),
 * and hands both to <ReflectionEditor /> which persists via PATCH
 * /api/admin/votd/[date].
 */

type PageProps = {
  params: Promise<{ date: string }>;
};

function isIsoDate(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

export const metadata = {
  title: "VOTD editor — MannaFest Admin",
  robots: { index: false, follow: false },
};

export default async function VotdDayEditorPage({ params }: PageProps) {
  const { date } = await params;
  if (!isIsoDate(date)) notFound();

  const admin = createSupabaseServiceClient();

  const { data: existing } = await admin
    .from("votd_reflections")
    .select("verse_id, body, status, fallback_scholar_id, fallback_quote")
    .eq("date", date)
    .maybeSingle();

  // Resolve default verse node id: existing row's verse_id, else canonical
  // day-of-year.
  let verseNodeId: number | null = null;
  let verseLabel = "";

  if (existing?.verse_id) {
    verseNodeId = existing.verse_id as number;
    const label = await resolveNodeLabel(verseNodeId);
    verseLabel = label;
  } else {
    const [y, m, d] = date.split("-").map(Number);
    const doy = getDayOfYear(new Date(y, (m ?? 1) - 1, d ?? 1));
    const canonical = canonicalVotdForDay(doy);
    const { data: bk } = await admin
      .from("books")
      .select("id, name")
      .ilike("abbreviation", canonical.book_abbr)
      .maybeSingle();
    if (bk) {
      const { data: node } = await admin
        .from("graph_nodes")
        .select("id")
        .eq("type", "verse")
        .eq("book_id", bk.id)
        .eq("chapter_num", canonical.chapter)
        .eq("verse_num", canonical.verse)
        .maybeSingle();
      if (node) {
        verseNodeId = node.id as number;
        verseLabel = `${bk.name} ${canonical.chapter}:${canonical.verse}`;
      }
    }
  }

  // Load scholars dropdown options (sorted by default_rank ASC).
  const { data: scholars } = await admin
    .from("scholars")
    .select("id, name, tradition_key, default_rank")
    .order("default_rank", { ascending: true })
    .limit(50);

  const scholarOptions: ScholarOption[] = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...((scholars ?? []) as any[]).map((s) => ({
      id: s.id as string,
      name: s.name as string,
      tradition_key: (s.tradition_key as string) ?? "academic",
    })),
  ];

  return (
    <div className="space-y-6">
      <header>
        <div className="flex items-center gap-3 mb-2">
          <Link
            href="/admin/verse-of-the-day"
            className="text-[#9CA3AF] text-xs hover:text-white font-[family-name:var(--font-inter)]"
          >
            ← Back to queue
          </Link>
        </div>
        <div className="text-[#C9A227] text-[11px] tracking-[0.2em] uppercase mb-2 font-[family-name:var(--font-inter)]">
          Verse of the Day
        </div>
        <h1 className="font-[family-name:var(--font-cinzel)] text-white text-3xl mb-1">
          {formatFriendlyDate(date)}
        </h1>
        <p className="text-[#9CA3AF] text-sm font-[family-name:var(--font-inter)]">
          Default verse: <strong className="text-white">{verseLabel || "unresolved"}</strong>.
          Override below if desired, author the reflection, set status, save.
        </p>
      </header>

      <ReflectionEditor
        date={date}
        initialVerseNodeId={verseNodeId}
        initialVerseLabel={verseLabel}
        initialBody={(existing?.body as string | null) ?? ""}
        initialStatus={
          (existing?.status as "draft" | "published" | undefined) ?? "draft"
        }
        initialFallbackScholarId={
          (existing?.fallback_scholar_id as string | null) ?? null
        }
        initialFallbackQuote={
          (existing?.fallback_quote as string | null) ?? ""
        }
        scholars={scholarOptions}
      />
    </div>
  );
}

async function resolveNodeLabel(nodeId: number): Promise<string> {
  const admin = createSupabaseServiceClient();
  const { data: node } = await admin
    .from("graph_nodes")
    .select("book_id, chapter_num, verse_num")
    .eq("id", nodeId)
    .maybeSingle();
  if (!node) return "";
  const { data: book } = await admin
    .from("books")
    .select("name")
    .eq("id", node.book_id)
    .maybeSingle();
  if (!book) return "";
  return `${book.name} ${node.chapter_num}:${node.verse_num}`;
}

function formatFriendlyDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  return dt.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
