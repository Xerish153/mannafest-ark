"use client";

import { useState } from "react";
import { truncateWords, FEATURED_EXCERPT_WORD_CAP } from "@/lib/bible/truncate";
import type { ReaderCommentary } from "./types";

/**
 * Per-section commentary card — Enduring Word aesthetic.
 * Compact card with attribution + tradition chip + "Read full passage"
 * disclosure when the excerpt exceeds the 50-word cap (Doctrine A).
 */
export default function SectionCommentaryInline({
  commentary,
}: {
  commentary: ReaderCommentary;
}) {
  const [expanded, setExpanded] = useState(false);
  const body = commentary.featured_excerpt ?? commentary.commentary_text;
  const trim = truncateWords(body, FEATURED_EXCERPT_WORD_CAP);
  const showDisclosure = trim.truncated && !expanded;

  return (
    <article className="rounded border border-[#1E2028] bg-[#0F1117] p-4 my-4">
      <header className="flex flex-wrap items-center gap-2 mb-2">
        <span className="text-[#F0EDE8] text-sm font-semibold font-[family-name:var(--font-inter)]">
          {commentary.author}
        </span>
        {commentary.tradition_tag ? (
          <span className="text-[10px] uppercase tracking-wider text-[#8B6F1A] border border-[#1E2028] rounded px-1.5 py-0.5 font-[family-name:var(--font-inter)]">
            {commentary.tradition_tag}
          </span>
        ) : null}
        {commentary.founder_curated ? (
          <span className="text-[10px] uppercase tracking-wider text-[#C9A227] font-[family-name:var(--font-inter)]">
            Founder curated
          </span>
        ) : null}
      </header>
      <p className="text-[#E5E7EB] text-[0.95rem] leading-relaxed font-[family-name:var(--font-serif)]">
        {expanded ? commentary.commentary_text : trim.text}
      </p>
      {showDisclosure ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-2 text-[#C9A227] text-xs hover:text-white transition-colors font-[family-name:var(--font-inter)]"
        >
          Read full passage ↓
        </button>
      ) : null}
      {commentary.source ? (
        <p className="mt-2 text-[#6B7280] text-[11px] font-[family-name:var(--font-inter)]">
          — {commentary.source}
        </p>
      ) : null}
    </article>
  );
}
