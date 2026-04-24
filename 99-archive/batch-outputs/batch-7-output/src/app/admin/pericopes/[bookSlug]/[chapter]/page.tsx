import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { requireSuperAdmin, SuperAdminError } from "@/lib/auth/super-admin";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { bookBySlug } from "@/lib/bible/book-slugs";
import PericopeEditor from "./PericopeEditor";

export default async function AdminPericopeEditorPage({
  params,
}: {
  params: Promise<{ bookSlug: string; chapter: string }>;
}) {
  try {
    await requireSuperAdmin();
  } catch (err) {
    if (err instanceof SuperAdminError) {
      if (err.status === 401) redirect("/auth/signin");
      redirect("/");
    }
    throw err;
  }

  const { bookSlug, chapter: chapterStr } = await params;
  const meta = bookBySlug(bookSlug);
  if (!meta) notFound();
  const chapter = Number.parseInt(chapterStr, 10);
  if (!Number.isFinite(chapter) || chapter < 1 || chapter > meta.chapterCount) {
    notFound();
  }

  const service = createSupabaseServiceClient();
  const { data: rows } = await service
    .from("pericope_overrides")
    .select("id, verse_start, verse_end, title, display_order")
    .eq("book_id", meta.bookId)
    .eq("chapter", chapter)
    .order("display_order");

  return (
    <div className="min-h-screen bg-[#08090C] text-[#F0EDE8]">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-6">
          <Link
            href={`/read/${meta.slug}/${chapter}`}
            className="text-[#9CA3AF] text-sm hover:text-[#F0EDE8] transition-colors font-[family-name:var(--font-inter)]"
          >
            ← Open in reader
          </Link>
        </div>
        <h1 className="font-[family-name:var(--font-cinzel)] text-3xl mb-1">
          {meta.name} {chapter} — pericope sections
        </h1>
        <p className="text-[#9CA3AF] text-xs mb-8 font-[family-name:var(--font-inter)]">
          book_slug: <code>{meta.slug}</code> · book_id: {meta.bookId}
        </p>
        <PericopeEditor
          bookSlug={meta.slug}
          chapter={chapter}
          initialSections={(rows ?? []).map((r) => ({
            verse_start: r.verse_start,
            verse_end: r.verse_end,
            title: r.title,
          }))}
        />
      </div>
    </div>
  );
}
