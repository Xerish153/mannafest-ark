import { Cite } from "@/components/Cite";
import type { CommentaryWithScholar } from "@/lib/supabase/schemas/commentaries";

export type CommentaryCardProps = {
  entry: CommentaryWithScholar;
};

/**
 * A single non-featured commentary voice. Renders through the canonical
 * <Cite kind="commentary" /> component so the visual treatment stays
 * consistent with the rest of the site. Editor-tradition entries are cards
 * like any other — no flattening, no special visual treatment (Doctrine A).
 *
 * Anchor: the enclosing <li> carries an `id` via the anchor prop so the
 * FeaturedExcerpt's "Read full passage ↓" link jumps straight to the
 * featured voice's expanded card.
 */
export function CommentaryCard({ entry }: CommentaryCardProps) {
  const { scholar, commentary_text, curator_note } = entry;
  const traditionKey = scholar.tradition_key ?? "academic";
  return (
    <article
      id={`voice-${entry.id}`}
      data-commentary-card="true"
      className="scroll-mt-24"
    >
      <Cite
        kind="commentary"
        display="block"
        size="sm"
        author={scholar.name}
        tradition={traditionKey}
        work={entry.source ?? "Commentary"}
        excerpt={commentary_text}
      />
      {curator_note && (
        <p className="mt-2 pl-4 text-xs italic text-[var(--text-muted)] border-l-2 border-[var(--ink-100)]">
          Editor&apos;s note: {curator_note}
        </p>
      )}
    </article>
  );
}
