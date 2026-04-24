"use client";

import Link from "next/link";
import type { CategoryLandingData } from "./types";

export default function CategoryLandingBookList({
  data,
}: {
  data: CategoryLandingData;
}) {
  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.books.map((b) => (
          <Link
            key={b.slug}
            href={`/book/${b.slug}`}
            className="group rounded border border-[#1E2028] bg-[#0F1117] p-5 hover:border-[#C9A227] transition-colors"
          >
            <div className="flex items-baseline justify-between mb-2">
              <h3 className="text-[#F0EDE8] text-lg font-semibold group-hover:text-[#C9A227] transition-colors font-[family-name:var(--font-cinzel)]">
                {b.name}
              </h3>
              <span className="text-[#6B7280] text-xs font-[family-name:var(--font-inter)]">
                {b.chapterCount} ch
              </span>
            </div>
            {b.preview ? (
              <p className="text-[#9CA3AF] text-sm leading-relaxed font-[family-name:var(--font-serif)]">
                {b.preview}
              </p>
            ) : null}
          </Link>
        ))}
      </div>
    </section>
  );
}
