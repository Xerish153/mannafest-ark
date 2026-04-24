"use client";

import SectionCommentaryInline from "@/components/reader/SectionCommentaryInline";
import type { BookHubData } from "./types";

export default function BookHubCommentary({ data }: { data: BookHubData }) {
  if (!data.featuredCommentary) return null;
  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <h2 className="font-[family-name:var(--font-cinzel)] text-2xl text-[#C9A227] mb-4 text-center">
        Featured commentary
      </h2>
      <SectionCommentaryInline commentary={data.featuredCommentary} />
    </section>
  );
}
