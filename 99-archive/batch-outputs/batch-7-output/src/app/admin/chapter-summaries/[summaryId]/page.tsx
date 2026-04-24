import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { requireSuperAdmin, SuperAdminError } from "@/lib/auth/super-admin";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { bookById } from "@/lib/bible/book-slugs";
import SummaryEditor from "./SummaryEditor";

export default async function AdminChapterSummaryEditorPage({
  params,
}: {
  params: Promise<{ summaryId: string }>;
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

  const { summaryId } = await params;
  const id = Number.parseInt(summaryId, 10);
  if (!Number.isFinite(id)) notFound();

  const service = createSupabaseServiceClient();
  const { data, error } = await service
    .from("chapter_summaries")
    .select("id, book_id, chapter, body, status, drafted_by, updated_at")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) notFound();

  const book = bookById(data.book_id);

  return (
    <div className="min-h-screen bg-[#08090C] text-[#F0EDE8]">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-6">
          <Link
            href="/admin/chapter-summaries"
            className="text-[#9CA3AF] text-sm hover:text-[#F0EDE8] transition-colors font-[family-name:var(--font-inter)]"
          >
            ← Back to queue
          </Link>
        </div>
        <h1 className="font-[family-name:var(--font-cinzel)] text-3xl mb-1">
          {book?.name ?? `Book ${data.book_id}`} {data.chapter}
        </h1>
        <p className="text-[#9CA3AF] text-xs mb-8 font-[family-name:var(--font-inter)]">
          Chapter summary · current status:{" "}
          <span className="uppercase tracking-wider text-[#C9A227]">
            {data.status}
          </span>{" "}
          · drafted_by: {data.drafted_by ?? "—"}
        </p>
        <SummaryEditor
          summaryId={data.id}
          initialBody={data.body ?? ""}
          initialStatus={data.status as "draft" | "published"}
          initialDraftedBy={data.drafted_by ?? ""}
        />
      </div>
    </div>
  );
}
