"use client";

import Link from "next/link";
import type { BookHubData } from "./types";

const TITLE_SLUGS = new Set<string>([
  "christ-messiah", "lamb-of-god", "son-of-god", "son-of-man", "son-of-david",
  "logos", "suffering-servant", "second-adam", "great-high-priest",
  "immanuel", "good-shepherd", "alpha-and-omega", "i-am", "king-of-kings",
  "bridegroom", "root-of-david-lion-of-judah", "bright-morning-star",
]);

function href(slug: string): string {
  return TITLE_SLUGS.has(slug) ? `/title/${slug}` : `/featured/${slug}`;
}

export default function BookHubFeaturedStudies({ data }: { data: BookHubData }) {
  if (data.featuredStudies.length === 0) return null;
  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <h2 className="font-[family-name:var(--font-cinzel)] text-xl text-[#C9A227] mb-4 text-center">
        Featured studies in this book
      </h2>
      <div className="flex flex-wrap gap-3 justify-center">
        {data.featuredStudies.map((s) => (
          <Link
            key={`${s.featured_page_slug}-${s.verse_start}`}
            href={href(s.featured_page_slug)}
            className="inline-flex items-center gap-2 rounded border border-[#1E2028] bg-[#0F1117] px-4 py-2 hover:border-[#C9A227] hover:bg-[#1E2028] transition-colors font-[family-name:var(--font-inter)]"
          >
            <span className="text-[#F0EDE8] text-sm">{s.featured_page_title}</span>
            <span className="text-[#9CA3AF] text-xs">
              {data.meta.abbreviation} {s.verse_start}
              {s.verse_end && s.verse_end > s.verse_start ? `–${s.verse_end}` : ""}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
