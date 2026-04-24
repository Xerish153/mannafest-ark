"use client";

import SectionCommentaryInline from "./SectionCommentaryInline";
import type { ReaderCommentary } from "./types";

/**
 * Desktop right sidebar rendering chapter-scope commentary. Shows the
 * featured (founder-curated) entry first; additional voices stack below
 * behind a "Show other voices" toggle.
 */
export default function ChapterCommentarySidebar({
  commentary,
}: {
  commentary: ReaderCommentary[];
}) {
  if (commentary.length === 0) return null;

  const featured = commentary.filter((c) => c.featured);
  const rest = commentary.filter((c) => !c.featured);

  return (
    <aside className="w-[18rem] shrink-0">
      <div className="sticky top-20 space-y-2">
        <h3 className="text-[#9CA3AF] text-[0.72rem] tracking-[0.2em] uppercase font-[family-name:var(--font-inter)]">
          Commentary on this chapter
        </h3>
        {featured.map((c) => (
          <SectionCommentaryInline key={c.id} commentary={c} />
        ))}
        {rest.length > 0 ? (
          <details className="group">
            <summary className="cursor-pointer list-none text-[#C9A227] text-xs hover:text-white transition-colors font-[family-name:var(--font-inter)]">
              Show {rest.length} other voice{rest.length === 1 ? "" : "s"} →
            </summary>
            <div className="mt-2 space-y-2">
              {rest.map((c) => (
                <SectionCommentaryInline key={c.id} commentary={c} />
              ))}
            </div>
          </details>
        ) : null}
      </div>
    </aside>
  );
}
