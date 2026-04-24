import { notFound } from "next/navigation";
import type { Metadata } from "next";
import TitlePageLayout from "@/components/titles/TitlePageLayout";
import { loadTitleBySlug } from "@/lib/titles/loader";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await loadTitleBySlug(slug);
  if (!data) return { title: "Title — MannaFest" };
  return {
    title: `${data.name} — MannaFest`,
    description: data.summary ?? undefined,
  };
}

export default async function TitlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await loadTitleBySlug(slug);
  if (!data) notFound();
  return <TitlePageLayout data={data} />;
}
