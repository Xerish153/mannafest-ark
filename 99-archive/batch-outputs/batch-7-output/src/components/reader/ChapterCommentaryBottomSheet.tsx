"use client";

import { useState } from "react";
import SectionCommentaryInline from "./SectionCommentaryInline";
import type { ReaderCommentary } from "./types";

/**
 * Mobile bottom sheet rendering chapter-scope commentary.
 * Collapsed by default (single button at the bottom of the viewport);
 * expands to a scrollable panel.
 */
export default function ChapterCommentaryBottomSheet({
  commentary,
}: {
  commentary: ReaderCommentary[];
}) {
  const [open, setOpen] = useState(false);
  if (commentary.length === 0) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 rounded-full bg-[#C9A227] text-black px-5 py-2 text-sm font-semibold font-[family-name:var(--font-inter)] shadow-lg md:hidden"
      >
        Commentary ({commentary.length})
      </button>
      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Chapter commentary"
          className="fixed inset-0 z-50 md:hidden bg-[#08090C]/98 backdrop-blur-sm overflow-y-auto"
        >
          <div className="sticky top-0 h-12 bg-[#08090C] border-b border-[#1E2028] flex items-center justify-between px-4">
            <span className="text-[#C9A227] text-xs tracking-[0.2em] uppercase font-[family-name:var(--font-inter)]">
              Commentary
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="text-[#F0EDE8] text-xl px-2"
            >
              ×
            </button>
          </div>
          <div className="px-4 py-6 space-y-2">
            {commentary.map((c) => (
              <SectionCommentaryInline key={c.id} commentary={c} />
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}
