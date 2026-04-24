import { notFound } from "next/navigation";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import TitleEditor from "@/components/admin/TitleEditor";
import type { JesusTitle, JesusTitleRef } from "@/lib/titles/types";

export const metadata = {
  title: "Edit title — MannaFest Admin",
  robots: { index: false, follow: false },
};

export default async function AdminTitleEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const admin = createSupabaseServiceClient();

  const [{ data: titleRow }, { data: refs }] = await Promise.all([
    admin
      .from("jesus_titles")
      .select(
        "id, slug, name, original_language, original_text, transliteration, " +
          "pronunciation, summary, origin_body, declaration_body, " +
          "theological_meaning_body, display_order, cluster_group, status, " +
          "created_at, updated_at",
      )
      .eq("slug", slug)
      .maybeSingle(),
    admin
      .from("jesus_title_refs")
      .select(
        "id, title_id, ref_type, book_id, chapter, verse_start, verse_end, note, display_order, created_at, book:books!jesus_title_refs_book_id_fkey(name, abbreviation)",
      )
      .eq(
        "title_id",
        (
          await admin
            .from("jesus_titles")
            .select("id")
            .eq("slug", slug)
            .maybeSingle()
        ).data?.id ?? -1,
      )
      .order("ref_type")
      .order("display_order"),
  ]);

  if (!titleRow) notFound();

  return (
    <TitleEditor
      title={titleRow as unknown as JesusTitle}
      refs={(refs ?? []) as unknown as JesusTitleRef[]}
    />
  );
}
