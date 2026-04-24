"use client";

import Link from "next/link";
import type { ReaderVerse } from "./types";

/**
 * One verse rendered in the reader. The verse number is a tap target that
 * routes to the full verse page (Layer 3 drill-down). The anchor id is
 * `v{n}` so deep links like /read/matthew/5#v3 scroll correctly.
 */
export default function VerseLine({
  verse,
  bookSlug,
  chapter,
}: {
  verse: ReaderVerse;
  bookSlug: string;
  chapter: number;
}) {
  return (
    <p
      id={`v${verse.verse_num}`}
      className="text-[#F0EDE8] text-[1.05rem] leading-[1.75] font-[family-name:var(--font-serif)] scroll-mt-20"
    >
      <Link
        href={`/verse/${bookSlug}/${chapter}/${verse.verse_num}`}
        prefetch={false}
        className="inline-block align-top mr-1.5 text-xs font-semibold text-[#C9A227] hover:text-white transition-colors"
        title={`Open verse ${verse.verse_num} in full-study view`}
      >
        {verse.verse_num}
      </Link>
      <span>{verse.text}</span>
    </p>
  );
}
