"use client";

import Link from "next/link";
import { useMemo } from "react";
import VerseLine from "./VerseLine";
import SectionCommentaryInline from "./SectionCommentaryInline";
import InlineCrossRefsCompact from "./InlineCrossRefsCompact";
import FeaturedStudiesCallout from "./FeaturedStudiesCallout";
import ChapterCommentarySidebar from "./ChapterCommentarySidebar";
import ChapterCommentaryBottomSheet from "./ChapterCommentaryBottomSheet";
import type {
  ReaderBundle,
  ReaderCommentary,
  ReaderCrossRef,
  ReaderFeaturedRef,
  ReaderPericope,
} from "./types";

/**
 * Sectioned layer: pericope-based sections with per-section commentary,
 * cross-refs, and featured-studies callouts. Chapter-scope commentary
 * renders in the right sidebar (desktop) or bottom sheet (mobile).
 */
export default function SectionedLayer({
  bundle,
  compressed,
}: {
  bundle: ReaderBundle;
  compressed: boolean;
}) {
  const bucketed = useMemo(
    () => bucketPerSection(bundle.pericopes, bundle.commentary, bundle.featured_refs),
    [bundle.pericopes, bundle.commentary, bundle.featured_refs],
  );

  const chapterCommentary = bundle.commentary.filter(
    (c) => c.verse_start <= 1 && (c.verse_end === null || c.verse_end >= 999),
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row gap-8">
      <div className="flex-1 min-w-0">
        {bundle.pericopes.map((pericope, idx) => (
          <SectionBlock
            key={`${pericope.verse_start}-${pericope.verse_end}`}
            pericope={pericope}
            verses={bundle.verses.filter(
              (v) =>
                v.verse_num >= pericope.verse_start &&
                v.verse_num <= pericope.verse_end,
            )}
            commentary={bucketed[idx]?.commentary ?? []}
            featured={bucketed[idx]?.featured ?? []}
            crossRefs={sectionCrossRefs(pericope, bundle.cross_refs_by_verse)}
            bookSlug={bundle.book.slug}
            chapter={bundle.book.chapter}
            compressed={compressed}
          />
        ))}

        <div className="pt-6 mt-6 border-t border-[#1E2028] flex items-center justify-between">
          {bundle.navigation.prev_chapter_url ? (
            <Link
              href={bundle.navigation.prev_chapter_url}
              className="text-[#9CA3AF] text-sm hover:text-[#F0EDE8] transition-colors font-[family-name:var(--font-inter)]"
            >
              ← Previous chapter
            </Link>
          ) : (
            <span />
          )}
          {bundle.navigation.next_chapter_url ? (
            <Link
              href={bundle.navigation.next_chapter_url}
              className="text-[#C9A227] text-sm hover:text-white transition-colors font-[family-name:var(--font-inter)]"
            >
              Continue reading →
            </Link>
          ) : bundle.navigation.end_of_gospels ? (
            <Link
              href="/group/gospels"
              className="text-[#6B7280] text-sm hover:text-white transition-colors font-[family-name:var(--font-inter)]"
            >
              End of Gospels — return to group
            </Link>
          ) : null}
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <ChapterCommentarySidebar commentary={chapterCommentary} />
      </div>

      {/* Mobile sheet */}
      <ChapterCommentaryBottomSheet commentary={chapterCommentary} />
    </div>
  );
}

function SectionBlock({
  pericope,
  verses,
  commentary,
  featured,
  crossRefs,
  bookSlug,
  chapter,
  compressed,
}: {
  pericope: ReaderPericope;
  verses: ReaderBundle["verses"];
  commentary: ReaderCommentary[];
  featured: ReaderFeaturedRef[];
  crossRefs: ReaderCrossRef[];
  bookSlug: string;
  chapter: number;
  compressed: boolean;
}) {
  const seeAllHref = `/verse/${bookSlug}/${chapter}/${pericope.verse_start}`;
  return (
    <section className="mb-10 pb-6 border-b border-[#1E2028] last:border-b-0">
      {pericope.title ? (
        <h2 className="text-[#F0EDE8] text-lg font-[family-name:var(--font-cinzel)] mb-3">
          {pericope.title}
          <span className="ml-3 text-[#6B7280] text-xs font-[family-name:var(--font-inter)]">
            {pericope.verse_start}
            {pericope.verse_end > pericope.verse_start ? `–${pericope.verse_end}` : ""}
          </span>
        </h2>
      ) : null}

      <FeaturedStudiesCallout refs={featured} />

      <div className="space-y-3 mb-4">
        {verses.map((v) => (
          <VerseLine
            key={v.verse_num}
            verse={v}
            bookSlug={bookSlug}
            chapter={chapter}
          />
        ))}
      </div>

      {!compressed &&
        commentary.map((c) => (
          <SectionCommentaryInline key={c.id} commentary={c} />
        ))}

      <InlineCrossRefsCompact refs={crossRefs} seeAllHref={seeAllHref} />
    </section>
  );
}

function bucketPerSection(
  pericopes: readonly ReaderPericope[],
  commentary: readonly ReaderCommentary[],
  featured: readonly ReaderFeaturedRef[],
): Array<{ commentary: ReaderCommentary[]; featured: ReaderFeaturedRef[] }> {
  return pericopes.map((p) => ({
    commentary: commentary.filter((c) => {
      const end = c.verse_end ?? c.verse_start;
      return c.verse_start <= p.verse_end && end >= p.verse_start && c.verse_start > 0;
    }),
    featured: featured.filter((f) => {
      const end = f.verse_end ?? f.verse_start;
      return f.verse_start <= p.verse_end && end >= p.verse_start;
    }),
  }));
}

function sectionCrossRefs(
  pericope: ReaderPericope,
  byVerse: Record<number, ReaderCrossRef[]>,
): ReaderCrossRef[] {
  const seen = new Set<number>();
  const out: ReaderCrossRef[] = [];
  for (let v = pericope.verse_start; v <= pericope.verse_end; v += 1) {
    const refs = byVerse[v] ?? [];
    for (const ref of refs) {
      if (seen.has(ref.node_id)) continue;
      seen.add(ref.node_id);
      out.push(ref);
      if (out.length >= 3) return out;
    }
  }
  return out;
}
