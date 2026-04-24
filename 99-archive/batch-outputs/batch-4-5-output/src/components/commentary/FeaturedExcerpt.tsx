import Link from "next/link";
import { TraditionChip } from "@/components/Cite/TraditionChip";
import type { CommentaryWithScholar } from "@/lib/supabase/schemas/commentaries";

/**
 * Server utility: trim body text to the first N words. Preserves internal
 * punctuation; appends "…" when truncation happened. Defensive: treats any
 * sequence of whitespace as a word boundary so excerpts can't bypass the cap
 * via line breaks or tabs.
 */
export function truncateWords(text: string, cap: number): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= cap) return text.trim();
  return words.slice(0, cap).join(" ") + "…";
}

export type FeaturedExcerptProps = {
  entry: CommentaryWithScholar;
  excerpt: string;
  /** True when the displayed excerpt is a truncation of a longer source body. */
  truncated: boolean;
};

export function FeaturedExcerpt({
  entry,
  excerpt,
  truncated,
}: FeaturedExcerptProps) {
  const { scholar } = entry;
  const traditionKey = scholar.tradition_key ?? "academic";
  const anchor = `#voice-${entry.id}`;

  return (
    <figure
      className="rounded-lg border border-[var(--ink-100)] bg-[var(--paper-50)] p-5"
      data-featured-excerpt="true"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="text-[11px] uppercase tracking-wide text-[var(--text-muted)] mb-1">
            Featured voice
          </div>
          <div className="font-serif text-base font-semibold text-[var(--ink-900)]">
            {scholar.name}
            {scholar.is_founder && (
              <span className="ml-2 text-[11px] font-normal text-[var(--text-muted)]">
                (founder)
              </span>
            )}
          </div>
        </div>
        <TraditionChip tradition={traditionKey} size="md" />
      </div>

      <blockquote className="font-serif text-[15px] leading-relaxed text-[var(--ink-900)] whitespace-pre-wrap">
        {excerpt}
      </blockquote>

      {truncated && (
        <div className="mt-3 text-sm">
          <Link
            href={anchor}
            className="text-[var(--accent)] hover:underline"
            aria-label={`Read full passage from ${scholar.name}`}
          >
            Read full passage ↓
          </Link>
        </div>
      )}

      {entry.curator_note && (
        <p className="mt-3 text-xs italic text-[var(--text-muted)]">
          Editor&apos;s note: {entry.curator_note}
        </p>
      )}
    </figure>
  );
}
