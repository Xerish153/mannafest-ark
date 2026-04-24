"use client";

import CategoryLandingBookList from "./CategoryLandingBookList";
import type { CategoryLandingData } from "./types";

export default function CategoryLandingLayout({
  data,
}: {
  data: CategoryLandingData;
}) {
  return (
    <div className="min-h-screen bg-[#08090C]">
      <header className="text-center pt-14 pb-8 px-4">
        <p className="text-[#C9A227] text-xs tracking-[0.3em] uppercase mb-3 font-[family-name:var(--font-inter)]">
          Group
        </p>
        <h1 className="font-[family-name:var(--font-cinzel)] text-4xl sm:text-5xl text-white mb-4">
          {data.group.label}
        </h1>
        <p className="text-[#9CA3AF] text-sm font-[family-name:var(--font-inter)]">
          {data.group.books.length} book{data.group.books.length === 1 ? "" : "s"}
        </p>
      </header>

      <article className="max-w-3xl mx-auto px-4 py-8">
        {data.intro.map((p, i) => (
          <p
            key={i}
            className="text-[#E5E7EB] text-base leading-relaxed mb-5 font-[family-name:var(--font-serif)]"
          >
            {p}
          </p>
        ))}
      </article>

      <CategoryLandingBookList data={data} />
    </div>
  );
}
