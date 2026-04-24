import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { bookBySlug } from "@/lib/bible/book-slugs";
import { BookHubLayout } from "@/components/book/BookHubLayout";
import { loadBookHubData } from "@/components/book/loadBookHubData";

/**
 * Batch 7 — Book hub route.
 *
 * Tier 1 hubs (Matthew/Mark/Luke/John/Acts this batch) ship with bespoke
 * depth-1 visuals. All other books render the same template at Tier 2
 * density (structured outline → dense chapter grid). The layout component
 * handles the density dial via its `tier` prop.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = bookBySlug(slug);
  if (!meta) return { title: "Book Not Found — MannaFest" };
  return {
    title: `${meta.name} — MannaFest`,
    description: `${meta.name} hub — overview, structure, themes, key chapters, and start-reading access. KJV/WEB/ASV.`,
    alternates: {
      canonical: `https://mannafest.faith/book/${meta.slug}`,
    },
  };
}

export default async function BookHubPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = bookBySlug(slug);
  if (!meta) notFound();

  const data = await loadBookHubData(meta);
  return <BookHubLayout data={data} />;
}
