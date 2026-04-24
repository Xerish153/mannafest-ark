import type { ReactNode } from "react";
import Link from "next/link";
import { GRAPH_ENABLED } from "@/lib/features/flags";

/**
 * <VerseActionOverflow /> — three-dot overflow menu for the verse-page
 * action bar.
 *
 * Batch 5.5 dedupes the action row: Bookmark/AddNote/Highlight stay in the
 * primary row; Compare translations / Share / Graph-view move here.
 *
 * Batch 6 change: the "View in graph" item gates on NEXT_PUBLIC_GRAPH_ENABLED
 * (defaults false in production). When graph is disabled, the menu
 * contains only the caller-provided children. If the caller provides no
 * children and graph is disabled, the summary button still renders but
 * the menu is empty — callers should avoid that by checking children
 * count, or the button should be hidden by the parent.
 *
 * Uses native <details>/<summary> — no JS required.
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
        {GRAPH_ENABLED && (
          <Link
            href={graphHref}
            className="px-3 py-2 text-sm text-[var(--text-muted)] hover:bg-[var(--bg)] hover:text-[var(--text)] rounded transition-colors"
            role="menuitem"
          >
            View in graph <span className="text-xs opacity-70">(beta)</span>
          </Link>
        )}
      </div>
    </details>
  );
}
