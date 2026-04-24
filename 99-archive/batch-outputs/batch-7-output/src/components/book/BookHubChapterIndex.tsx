"use client";

import Link from "next/link";
import type { BookHubData } from "./types";

export default function BookHubChapterIndex({ data }: { data: BookHubData }) {
  return (
    <section className="max-w-5xl mx-auto px-4 py-12 border-t border-[#1E2028]">
      <h2 className="font-[family-name:var(--font-cinzel)] text-xl text-[#C9A227] mb-6 text-center">
        All {data.chapterIndex.length} chapters
      </h2>
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-14 gap-2">
        {data.chapterIndex.map((n) => (
          <Link
            key={n}
            href={`/read/${data.meta.slug}/${n}`}
            className="bg-[#0F1117] border border-[#1E2028] rounded p-2 text-center hover:border-[#C9A227] hover:bg-[#1E2028] transition-colors font-[family-name:var(--font-cinzel)] text-[#F0EDE8] text-sm"
          >
            {n}
          </Link>
        ))}
      </div>
    </section>
  );
}
