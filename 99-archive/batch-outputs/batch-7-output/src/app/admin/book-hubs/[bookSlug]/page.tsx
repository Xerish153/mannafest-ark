import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { requireSuperAdmin, SuperAdminError } from "@/lib/auth/super-admin";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { bookBySlug } from "@/lib/bible/book-slugs";
import BookHubOverrideEditor from "./BookHubOverrideEditor";

export default async function AdminBookHubPage({
  params,
}: {
  params: Promise<{ bookSlug: string }>;
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

  const { bookSlug } = await params;
  const meta = bookBySlug(bookSlug);
  if (!meta) notFound();

  const service = createSupabaseServiceClient();
  const { data } = await service
    .from("book_hub_config")
    .select("signature_verse_id, intro_override, featured_commentary_id")
    .eq("book_slug", meta.slug)
    .maybeSingle();

  return (
    <div className="min-h-screen bg-[#08090C] text-[#F0EDE8]">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-6">
          <Link
            href="/admin"
            className="text-[#9CA3AF] text-sm hover:text-[#F0EDE8] transition-colors font-[family-name:var(--font-inter)]"
          >
            ← Back to admin
          </Link>
        </div>
        <h1 className="font-[family-name:var(--font-cinzel)] text-3xl mb-1">
          {meta.name} — hub overrides
        </h1>
        <p className="text-[#9CA3AF] text-xs mb-8 font-[family-name:var(--font-inter)]">
          book_slug: <code>{meta.slug}</code> · book_id: {meta.bookId}
        </p>
        <BookHubOverrideEditor
          bookSlug={meta.slug}
          initial={{
            signature_verse_id: data?.signature_verse_id ?? null,
            intro_override: data?.intro_override ?? "",
            featured_commentary_id: data?.featured_commentary_id ?? null,
          }}
        />
      </div>
    </div>
  );
}
