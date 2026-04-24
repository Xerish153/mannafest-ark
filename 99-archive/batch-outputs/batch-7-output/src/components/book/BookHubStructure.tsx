"use client";

import Link from "next/link";
import type { BookHubData } from "./types";

/**
 * Tier 1 books use the outline form with structured sections; tier 2 (and
 * any book without an outline authored) falls through to the dense
 * numbered chapter grid.
 */
export default function BookHubStructure({ data }: { data: BookHubData }) {
  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <h2 className="font-[family-name:var(--font-cinzel)] text-2xl text-[#C9A227] mb-6 text-center">
        Structure
      </h2>
      {data.structure.kind === "outline" ? (
        <ol className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.structure.sections.map((s, i) => (
            <li
              key={`${s.label}-${i}`}
              className="rounded border border-[#1E2028] bg-[#0F1117] p-5"
            >
              <Link
                href={`/read/${data.meta.slug}/${s.startChapter}`}
                className="group block"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[#F0EDE8] text-base font-semibold group-hover:text-[#C9A227] transition-colors font-[family-name:var(--font-inter)]">
                    {s.label}
                  </span>
                  <span className="text-[#9CA3AF] text-xs font-[family-name:var(--font-inter)]">
                    {s.chapters}
                  </span>
                </div>
                {s.blurb ? (
                  <p className="text-[#9CA3AF] text-sm mt-2 font-[family-name:var(--font-serif)]">
                    {s.blurb}
                  </p>
                ) : null}
              </Link>
            </li>
          ))}
        </ol>
      ) : (
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
          {data.structure.chapters.map((n) => (
            <Link
              key={n}
              href={`/read/${data.meta.slug}/${n}`}
              className="bg-[#0F1117] border border-[#1E2028] rounded p-3 text-center hover:border-[#C9A227] hover:bg-[#1E2028] transition-colors font-[family-name:var(--font-cinzel)] text-[#F0EDE8] text-base"
            >
              {n}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
