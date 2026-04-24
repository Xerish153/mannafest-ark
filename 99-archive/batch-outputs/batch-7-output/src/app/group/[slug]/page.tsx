import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { bookGroupBySlug } from "@/lib/bible/book-groups";
import CategoryLandingLayout from "@/components/group/CategoryLandingLayout";
import { loadCategoryLandingData } from "@/components/group/loadCategoryLandingData";

/**
 * Batch 7 — Category landing route. One per group. Light three-depth feel:
 * genre intro + book list + small flourishes per group.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const g = bookGroupBySlug(slug);
  if (!g) return { title: "Group Not Found — MannaFest" };
  return {
    title: `${g.label} — MannaFest`,
    description: g.blurb,
    alternates: {
      canonical: `https://mannafest.faith/group/${g.slug}`,
    },
  };
}

export default async function CategoryLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const group = bookGroupBySlug(slug);
  if (!group) notFound();

  const data = await loadCategoryLandingData(group);
  return <CategoryLandingLayout data={data} />;
}
