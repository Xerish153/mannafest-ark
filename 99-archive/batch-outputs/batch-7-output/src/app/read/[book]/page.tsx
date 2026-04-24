import { redirect } from "next/navigation";
import { bookByAbbrOrSlug } from "@/lib/bible/book-slugs";

/**
 * Batch 7 — Book-level /read/:book route redirects to /read/:book/1.
 *
 * The old behaviour (chapter grid page) is retired — the book hub at
 * /book/:slug is the richer "overview" surface; /read is purely the
 * reader. Unrecognised book keys fall through to next/notFound.
 *
 * Accepts both the new slug form ("matthew") and the legacy
 * abbreviation form ("mat") so existing links keep working.
 */
export default async function ReadBookRedirect({
  params,
}: {
  params: Promise<{ book: string }>;
}) {
  const { book } = await params;
  const meta = bookByAbbrOrSlug(book);
  if (!meta) {
    redirect("/read");
  }
  redirect(`/read/${meta.slug}/1`);
}
