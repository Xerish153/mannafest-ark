"use client";

import type { ReaderBundle } from "./types";

/**
 * Summary block at the top of the chapter reader. Hidden entirely when no
 * published chapter_summaries row exists (Doctrine D.2 — no placeholder).
 *
 * When a signature verse is set via book_hub_config and happens to fall in
 * this chapter, the signature verse renders at hero scale above the
 * summary paragraph. Today the reader surfaces the summary copy only — the
 * signature verse hero at chapter level is a Phase 10 polish concern.
 */
export default function ChapterSummaryBlock({
  bundle,
}: {
  bundle: ReaderBundle;
}) {
  if (!bundle.summary) return null;

  return (
    <section className="mb-10 border-l-2 border-[#C9A227]/40 pl-4 py-2">
      <p className="text-[#9CA3AF] text-[0.72rem] tracking-[0.2em] uppercase mb-2 font-[family-name:var(--font-inter)]">
        Chapter summary
      </p>
      <p className="text-[#F0EDE8] text-base leading-relaxed font-[family-name:var(--font-serif)] italic">
        {bundle.summary.body}
      </p>
      {bundle.summary.drafted_by ? (
        <p className="text-[#6B7280] text-xs mt-3 font-[family-name:var(--font-inter)]">
          {formatDraftedBy(bundle.summary.drafted_by)}
        </p>
      ) : null}
    </section>
  );
}

function formatDraftedBy(raw: string): string {
  if (raw === "pastor_marc") return "— Pastor Marc";
  if (raw === "ai")
    return "Drafted from Matthew Henry, Calvin, Gill, Clarke, JFB, and Barnes.";
  if (raw.includes("pastor_marc"))
    return "— Pastor Marc (edited from PD commentators)";
  return raw;
}
