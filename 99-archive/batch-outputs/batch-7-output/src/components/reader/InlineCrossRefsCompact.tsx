"use client";

import Link from "next/link";
import type { ReaderCrossRef } from "./types";

/**
 * Compact cross-refs surfaced beneath the per-section commentary card.
 * Top 3 across the section's verses, with a "See all →" into the verse
 * page for the section's first verse.
 */
export default function InlineCrossRefsCompact({
  refs,
  seeAllHref,
}: {
  refs: ReaderCrossRef[];
  seeAllHref: string;
}) {
  if (refs.length === 0) return null;

  return (
    <div className="mt-3">
      <p className="text-[#9CA3AF] text-[0.68rem] tracking-[0.2em] uppercase mb-2 font-[family-name:var(--font-inter)]">
        Cross-references
      </p>
      <ul className="space-y-1.5">
        {refs.slice(0, 3).map((r) => (
          <li key={r.node_id}>
            <Link
              href={`/verse/${r.book_slug}/${r.chapter}/${r.verse}`}
              className="group flex items-baseline gap-2 text-sm font-[family-name:var(--font-inter)]"
            >
              <span className="text-[#C9A227] group-hover:text-white transition-colors shrink-0">
                {r.label}
              </span>
              {r.preview ? (
                <span className="text-[#6B7280] text-xs truncate">
                  — {r.preview}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href={seeAllHref}
        className="inline-block mt-2 text-[#C9A227] text-xs hover:text-white transition-colors font-[family-name:var(--font-inter)]"
      >
        See all →
      </Link>
    </div>
  );
}
