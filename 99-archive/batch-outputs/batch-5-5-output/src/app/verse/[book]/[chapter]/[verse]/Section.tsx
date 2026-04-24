import type { ReactNode } from "react";

/**
 * Verse-page-scoped collapsible section wrapper.
 *
 * Batch 5.5 changes:
 *  - Numbered section eyebrows (01A, 01B, 02, etc.) REMOVED from verse pages.
 *    Plain titles only. The `eyebrow` prop is still accepted for back-compat
 *    with existing callers, but it is not rendered. Callers may drop the prop
 *    at their leisure — no call-site change is required for this batch.
 *  - Palette flipped to paper/ink tokens (Batch 3 foundation). Dark hex
 *    literals replaced with CSS custom properties that resolve to the warm
 *    paper palette on the verse route. The eyebrow-less section is the
 *    visible chrome this batch flips; deeper section internals remain on
 *    legacy tokens until the dedicated theme-flip batch (parking lot 3.6).
 *
 * Numbered headers are preserved on book hubs + feature pages (those use
 * their own wrappers — this file is scoped to the verse route via its
 * location in `src/app/verse/[book]/[chapter]/[verse]/`).
 */
export default function Section({
  id,
  title,
  eyebrow: _eyebrow,
  defaultOpen = true,
  meta,
  children,
}: {
  id: string;
  title: string;
  /** Accepted for back-compat; no longer rendered on verse pages. */
  eyebrow?: string;
  defaultOpen?: boolean;
  meta?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mb-8">
      <details
        open={defaultOpen}
        className="group bg-[var(--surface)] border border-[var(--border)] rounded-lg"
      >
        <summary className="list-none cursor-pointer select-none px-6 py-4 flex items-center justify-between gap-4 hover:bg-[var(--bg)] transition-colors rounded-lg group-open:rounded-b-none group-open:border-b group-open:border-[var(--border)]">
          <div className="flex items-baseline gap-3 min-w-0">
            <h2 className="font-[family-name:var(--font-cinzel)] text-[var(--text)] text-lg truncate">
              {title}
            </h2>
            {meta && (
              <span className="text-[var(--text-muted)] text-xs font-[family-name:var(--font-inter)] shrink-0">
                {meta}
              </span>
            )}
          </div>
          <span className="text-[var(--text-muted)] text-sm group-open:rotate-180 transition-transform select-none">
            ▾
          </span>
        </summary>
        <div className="px-6 py-5">{children}</div>
      </details>
    </section>
  );
}

export function SectionSkeleton({ title }: { title: string }) {
  return (
    <section className="mb-8">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg">
        <div className="px-6 py-4 flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-cinzel)] text-[var(--text-muted)] text-lg">
            {title}
          </h2>
          <span className="text-[var(--text-muted)] text-xs font-[family-name:var(--font-inter)] opacity-70">
            loading…
          </span>
        </div>
      </div>
    </section>
  );
}
