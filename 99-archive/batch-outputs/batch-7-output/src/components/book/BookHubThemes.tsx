"use client";

import type { BookHubData } from "./types";

export default function BookHubThemes({ data }: { data: BookHubData }) {
  if (data.themes.length === 0) return null;
  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <h2 className="font-[family-name:var(--font-cinzel)] text-2xl text-[#C9A227] mb-6 text-center">
        Themes
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.themes.map((t) => (
          <article
            key={t.id}
            className="rounded border border-[#1E2028] bg-[#0F1117] p-5"
          >
            <h3 className="text-[#F0EDE8] font-semibold mb-2 font-[family-name:var(--font-inter)]">
              {t.title}
            </h3>
            <p className="text-[#9CA3AF] text-sm leading-relaxed font-[family-name:var(--font-serif)]">
              {t.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
