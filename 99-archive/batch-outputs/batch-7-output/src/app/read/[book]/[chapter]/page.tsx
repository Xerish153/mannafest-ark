import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { bookByAbbrOrSlug } from "@/lib/bible/book-slugs";
import { loadReaderBundle } from "@/components/reader/loadReaderBundle";
import ChapterReader from "@/components/reader/ChapterReader";
import TextualEvidencePanel from "@/components/evidence/TextualEvidencePanel";
import { textualEvidenceFor } from "@/components/evidence/content/registry";

/**
 * Batch 7 — new /read/:book/:chapter page. Replaces the Batch-1 client-side
 * chapter reader with the layered ChapterReader surface. Accepts both the
 * new slug form ("matthew") and the legacy abbreviation ("mat").
 *
 * When a textual-evidence entry exists for (book, chapter), the panel is
 * rendered server-side and passed as a prop so the reader can place it
 * per layer (sectioned: above the column; distraction-free: a link).
 */
export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ book: string; chapter: string }>;
  searchParams: Promise<{ t?: string }>;
}): Promise<Metadata> {
  const { book: bookKey, chapter: chapterStr } = await params;
  await searchParams;
  const meta = bookByAbbrOrSlug(bookKey);
  if (!meta) return { title: "Chapter Not Found — MannaFest" };
  const chapter = Number.parseInt(chapterStr, 10);
  if (!Number.isFinite(chapter)) return { title: `${meta.name} — MannaFest` };
  return {
    title: `${meta.name} ${chapter} — MannaFest`,
    description: `Read ${meta.name} ${chapter} in KJV, WEB, or ASV with cross-references and curated public-domain commentary.`,
    alternates: {
      canonical: `https://mannafest.faith/read/${meta.slug}/${chapter}`,
    },
  };
}

export default async function ChapterPage({
  params,
  searchParams,
}: {
  params: Promise<{ book: string; chapter: string }>;
  searchParams: Promise<{ t?: string }>;
}) {
  const { book: bookKey, chapter: chapterStr } = await params;
  const { t } = await searchParams;

  const meta = bookByAbbrOrSlug(bookKey);
  if (!meta) notFound();

  const chapter = Number.parseInt(chapterStr, 10);
  if (!Number.isFinite(chapter) || chapter < 1 || chapter > meta.chapterCount) {
    notFound();
  }

  const translation =
    t === "WEB" || t === "ASV" || t === "KJV" ? t : "KJV";

  const bundle = await loadReaderBundle(meta.slug, chapter, translation);
  if (!bundle) notFound();

  const evidenceData = textualEvidenceFor(meta.slug, chapter);
  const textualEvidence = evidenceData ? (
    <TextualEvidencePanel data={evidenceData} />
  ) : null;

  return <ChapterReader bundle={bundle} textualEvidence={textualEvidence} />;
}
