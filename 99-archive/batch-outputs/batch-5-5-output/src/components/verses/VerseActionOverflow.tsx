import type { ReactNode } from "react";
import Link from "next/link";

/**
 * <VerseActionOverflow /> — three-dot overflow menu for the verse-page
 * action bar.
 *
 * Batch 5.5 dedupes the action row: Bookmark/AddNote/Highlight stay in the
 * primary row; Compare translations / Share / Graph-view move here.
 *
 * Uses native <details>/<summary> — no JS required, no hydration cost. The
 * details element is `className="relative"` so the dropdown positions
 * against its own button rather than the parent flex row.
 *
 * Accepts arbitrary children so existing client-side action components
 * (CompareTranslationsLauncher, ShareVerseButton, etc.) can be rendered
 * inside without rewriting. Each child should render as a compact button
 * that fits in the dropdown column.
 *
 * Graph-view link is rendered inline so callers don't need to pass it
 * (every verse gets the same link target); the prompt specifies "View in
 * graph (beta)" as a muted label per Vision v2 §5.1 (graph demoted).
 */
export default function VerseActionOverflow({
  graphHref,
  children,
}: {
  graphHref: string;
  children?: ReactNode;
}) {
  return (
    <details className="relative group">
      <summary
        className="list-none cursor-pointer select-none inline-flex items-center justify-center w-10 h-10 rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--accent, #C9A227)] transition-colors"
        aria-label="More actions"
        title="More actions"
      >
        <span className="text-lg leading-none">⋯</span>
      </summary>
      <div
        className="absolute right-0 top-[calc(100%+4px)] min-w-[220px] bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-lg z-20 p-2 flex flex-col gap-1 font-[family-name:var(--font-inter)]"
        role="menu"
      >
        {children}
        <Link
          href={graphHref}
          className="px-3 py-2 text-sm text-[var(--text-muted)] hover:bg-[var(--bg)] hover:text-[var(--text)] rounded transition-colors"
          role="menuitem"
        >
          View in graph <span className="text-xs opacity-70">(beta)</span>
        </Link>
      </div>
    </details>
  );
}
