"use client";

import Link from "next/link";
import type { ReaderFeaturedRef } from "./types";

/**
 * Inline feature-studies callout. When a featured_page_refs row matches a
 * verse range within a section, this card surfaces above the verse block.
 */
export default function FeaturedStudiesCallout({
  refs,
}: {
  refs: ReaderFeaturedRef[];
}) {
  if (refs.length === 0) return null;
  return (
    <div className="mb-4 rounded border border-[#1E2028] bg-[#0F1117] px-4 py-3">
      <p className="text-[#9CA3AF] text-[0.68rem] tracking-[0.2em] uppercase mb-2 font-[family-name:var(--font-inter)]">
        Featured studies
      </p>
      <ul className="flex flex-wrap gap-x-4 gap-y-1">
        {refs.map((r) => (
          <li key={`${r.featured_page_slug}-${r.verse_start}`}>
            <Link
              href={resolveFeatureHref(r.featured_page_slug)}
              className="text-[#C9A227] text-sm hover:text-white transition-colors font-[family-name:var(--font-inter)]"
            >
              {r.featured_page_title} →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function resolveFeatureHref(slug: string): string {
  // Title-cluster slugs (Batch 7-B) live under /title; everything else
  // under /featured per Doctrine D.7. The reader bundle loses the
  // route_prefix column during flattening; the registry of title slugs is
  // small and growing slowly — a short allowlist keeps this simple.
  const TITLE_SLUGS = new Set<string>([
    "christ-messiah", "lamb-of-god", "son-of-god", "son-of-man", "son-of-david",
    "logos", "suffering-servant", "second-adam", "great-high-priest",
    "immanuel", "good-shepherd", "alpha-and-omega", "i-am", "king-of-kings",
    "bridegroom", "root-of-david-lion-of-judah", "bright-morning-star",
  ]);
  if (TITLE_SLUGS.has(slug)) return `/title/${slug}`;
  return `/featured/${slug}`;
}
