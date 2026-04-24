"use client";

import Link from "next/link";
import VerseLine from "./VerseLine";
import type { ReaderBundle } from "./types";

/**
 * Distraction-free layer: just verse text, a centered column, minimal
 * chrome. Commentary-available hint at the end if the chapter has
 * commentary or featured refs. When a textual-evidence panel exists for
 * the chapter (Mark 16 / John 21), an extra line at the end prompts the
 * reader to switch to sectioned mode to see it.
 */
export default function DistractionFreeLayer({
  bundle,
  onRequestSectioned,
  hasTextualEvidence,
}: {
  bundle: ReaderBundle;
  onRequestSectioned: () => void;
  hasTextualEvidence?: boolean;
}) {
  const hasRicher =
    bundle.commentary.length > 0 ||
    bundle.featured_refs.length > 0 ||
    Boolean(hasTextualEvidence);
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      <div className="space-y-3 pt-2 pb-6">
        {bundle.verses.map((v) => (
          <VerseLine
            key={v.verse_num}
            verse={v}
            bookSlug={bundle.book.slug}
            chapter={bundle.book.chapter}
          />
        ))}
      </div>

      <div className="pt-6 mt-4 border-t border-[#1E2028] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          {bundle.navigation.next_chapter_url ? (
            <Link
              href={bundle.navigation.next_chapter_url}
              className="inline-flex items-center gap-2 text-[#C9A227] text-sm hover:text-white transition-colors font-[family-name:var(--font-inter)]"
            >
              Continue reading →
            </Link>
          ) : bundle.navigation.end_of_gospels ? (
            <Link
              href="/group/gospels"
              className="inline-flex items-center gap-2 text-[#6B7280] text-sm hover:text-white transition-colors font-[family-name:var(--font-inter)]"
            >
              End of Gospels — return to group
            </Link>
          ) : null}
        </div>
        <div className="flex flex-col sm:items-end gap-1">
          {hasRicher ? (
            <button
              type="button"
              onClick={onRequestSectioned}
              className="text-[#9CA3AF] text-sm hover:text-[#F0EDE8] transition-colors font-[family-name:var(--font-inter)] text-left sm:text-right"
            >
              Commentary available — switch to sectioned
            </button>
          ) : null}
          {hasTextualEvidence ? (
            <button
              type="button"
              onClick={onRequestSectioned}
              className="text-[#C9A227] text-sm hover:text-white transition-colors font-[family-name:var(--font-inter)] text-left sm:text-right"
            >
              Textual notes available — switch to sectioned
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
