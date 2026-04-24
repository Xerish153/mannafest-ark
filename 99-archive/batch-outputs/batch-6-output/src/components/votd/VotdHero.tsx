import Link from "next/link";
import type { VotdPayload } from "@/lib/votd/loader";
import { TraditionChip } from "@/components/Cite/TraditionChip";
import { abbrToUrlSlug } from "@/lib/books";

/**
 * <VotdHero /> — renders the core VOTD card: verse + reflection OR
 * fallback quote. Used identically on homepage (Layer 1) and on the
 * dedicated /verse-of-the-day page (Layer 2). The wrapper components add
 * the surrounding CTA and supplementary sections.
 *
 * Reflection rendering: markdown supported per Vision v2 §4.3.1 so Pastor
 * Marc can cross-link inside reflections. This component renders the body
 * with a simple paragraph treatment; internal cross-links (e.g.,
 * `[Isaiah 53](/verse/isa/53/1)`) render as anchor tags without additional
 * markdown parsing. Full markdown rendering can arrive in a later batch —
 * this keeps the component server-only + zero-JS.
 */

export default function VotdHero({ data }: { data: VotdPayload }) {
  const { verse, reflection, fallback } = data;
  const verseHref = `/verse/${abbrToUrlSlug(verse.book_abbr)}/${verse.chapter}/${verse.verse}`;

  return (
    <article className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 md:p-12">
      {/* Date + translation chip */}
      <div className="text-center mb-6">
        <span className="text-[var(--text-muted)] text-xs tracking-[0.2em] uppercase font-[family-name:var(--font-inter)]">
          {formatFriendlyDate(data.date)} · Verse of the Day
        </span>
      </div>

      {/* Verse text */}
      <blockquote className="text-center mb-6">
        <p className="font-serif text-2xl md:text-3xl text-[var(--ink-900, var(--text))] leading-relaxed">
          {verse.text}
        </p>
      </blockquote>

      {/* Verse reference + translation */}
      <div className="text-center mb-8 flex items-center justify-center gap-3">
        <Link
          href={verseHref}
          className="text-[var(--accent, #C9A227)] font-[family-name:var(--font-cinzel)] hover:underline text-lg"
        >
          {verse.book_name} {verse.chapter}:{verse.verse}
        </Link>
        <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] px-2 py-0.5 border border-[var(--border)] rounded">
          {verse.translation}
        </span>
      </div>

      {/* Reflection OR scholar-quote fallback */}
      {reflection ? (
        <div className="border-t border-[var(--border)] pt-8 mt-6">
          <div className="text-center mb-4 text-[var(--accent, #C9A227)] text-xs uppercase tracking-[0.2em] font-[family-name:var(--font-inter)]">
            Reflection
          </div>
          <div
            className="font-serif text-base md:text-[17px] leading-relaxed text-[var(--text)] max-w-prose mx-auto whitespace-pre-wrap"
            data-votd-reflection="true"
          >
            {reflection.body}
          </div>
          <p className="mt-6 text-center text-xs text-[var(--text-muted)] font-[family-name:var(--font-inter)]">
            — {reflection.authored_by}
          </p>
        </div>
      ) : fallback ? (
        <div className="border-t border-[var(--border)] pt-8 mt-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-[var(--text-muted)] text-xs uppercase tracking-[0.2em] font-[family-name:var(--font-inter)]">
              Scholar&rsquo;s note
            </span>
            <TraditionChip tradition={fallback.tradition_key} size="sm" />
          </div>
          <blockquote className="font-serif text-[15px] md:text-base leading-relaxed text-[var(--text)] italic max-w-prose mx-auto text-center">
            &ldquo;{fallback.quote}&rdquo;
          </blockquote>
          <p className="mt-4 text-center text-xs text-[var(--text-muted)] font-[family-name:var(--font-inter)]">
            — {fallback.scholar_name}
          </p>
        </div>
      ) : null}
    </article>
  );
}

function formatFriendlyDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  return dt.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}
