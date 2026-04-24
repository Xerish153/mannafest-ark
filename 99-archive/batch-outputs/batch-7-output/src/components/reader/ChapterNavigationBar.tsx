"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReaderBundle, ReaderTranslation } from "./types";

/**
 * Reader chrome: prev/next chapter + jump-to-chapter dropdown + translation
 * switcher + layer toggle + commentary compress toggle.
 *
 * Translation changes re-navigate via ?t= so the server re-fetches fresh
 * verse bodies. Layer + compress toggles are pref-driven (the ChapterReader
 * owns those and passes their handlers down).
 */
export default function ChapterNavigationBar({
  bundle,
  layer,
  compressed,
  onLayerChange,
  onCompressedChange,
}: {
  bundle: ReaderBundle;
  layer: "distraction_free" | "sectioned";
  compressed: boolean;
  onLayerChange: (next: "distraction_free" | "sectioned") => void;
  onCompressedChange: (next: boolean) => void;
}) {
  const router = useRouter();

  const onTranslation = (t: ReaderTranslation) => {
    const url = new URL(window.location.href);
    url.searchParams.set("t", t);
    router.push(url.pathname + url.search + url.hash);
  };

  const chapterOptions = Array.from(
    { length: bundle.book.chapter_count },
    (_, i) => i + 1,
  );

  return (
    <div className="sticky top-14 z-30 bg-[#08090C]/95 backdrop-blur border-b border-[#1E2028]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-11 flex items-center gap-3">
        {/* Prev */}
        <div className="w-24">
          {bundle.navigation.prev_chapter_url ? (
            <Link
              href={bundle.navigation.prev_chapter_url}
              className="text-[#9CA3AF] text-sm hover:text-white transition-colors font-[family-name:var(--font-inter)]"
            >
              ← Prev
            </Link>
          ) : null}
        </div>

        {/* Book + chapter dropdown */}
        <div className="flex-1 flex items-center gap-2">
          <Link
            href={`/book/${bundle.book.slug}`}
            className="text-[#F0EDE8] text-sm font-semibold hover:text-[#C9A227] transition-colors font-[family-name:var(--font-inter)]"
          >
            {bundle.book.name}
          </Link>
          <select
            aria-label="Jump to chapter"
            value={bundle.book.chapter}
            onChange={(e) => {
              const n = Number(e.target.value);
              if (Number.isFinite(n) && n >= 1) {
                router.push(`/read/${bundle.book.slug}/${n}`);
              }
            }}
            className="bg-transparent text-[#F0EDE8] text-sm border border-[#1E2028] rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#C9A227] font-[family-name:var(--font-inter)]"
          >
            {chapterOptions.map((c) => (
              <option key={c} value={c} className="bg-[#0F1117]">
                Ch {c}
              </option>
            ))}
          </select>
        </div>

        {/* Layer toggle */}
        <div className="hidden sm:flex items-center gap-1 border border-[#1E2028] rounded">
          <button
            type="button"
            onClick={() => onLayerChange("distraction_free")}
            aria-pressed={layer === "distraction_free"}
            className={`px-2.5 py-1 text-xs font-[family-name:var(--font-inter)] transition-colors ${
              layer === "distraction_free"
                ? "text-black bg-[#C9A227]"
                : "text-[#9CA3AF] hover:text-[#F0EDE8]"
            }`}
          >
            Focus
          </button>
          <button
            type="button"
            onClick={() => onLayerChange("sectioned")}
            aria-pressed={layer === "sectioned"}
            className={`px-2.5 py-1 text-xs font-[family-name:var(--font-inter)] transition-colors ${
              layer === "sectioned"
                ? "text-black bg-[#C9A227]"
                : "text-[#9CA3AF] hover:text-[#F0EDE8]"
            }`}
          >
            Sectioned
          </button>
        </div>

        {/* Commentary compress toggle (sectioned only) */}
        {layer === "sectioned" ? (
          <button
            type="button"
            onClick={() => onCompressedChange(!compressed)}
            className="hidden sm:inline-block text-[#9CA3AF] text-xs hover:text-[#F0EDE8] transition-colors font-[family-name:var(--font-inter)]"
          >
            {compressed ? "Expand commentary" : "Compress commentary"}
          </button>
        ) : null}

        {/* Translation */}
        <select
          aria-label="Translation"
          value={bundle.translation}
          onChange={(e) => onTranslation(e.target.value as ReaderTranslation)}
          className="bg-transparent text-[#F0EDE8] text-xs border border-[#1E2028] rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#C9A227] font-[family-name:var(--font-inter)]"
        >
          <option value="KJV" className="bg-[#0F1117]">KJV</option>
          <option value="WEB" className="bg-[#0F1117]">WEB</option>
          <option value="ASV" className="bg-[#0F1117]">ASV</option>
        </select>

        {/* Next */}
        <div className="w-24 text-right">
          {bundle.navigation.next_chapter_url ? (
            <Link
              href={bundle.navigation.next_chapter_url}
              className="text-[#9CA3AF] text-sm hover:text-white transition-colors font-[family-name:var(--font-inter)]"
            >
              Next →
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
