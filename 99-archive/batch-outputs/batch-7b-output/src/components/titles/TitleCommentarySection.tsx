import CommentarySection from "@/components/commentary/CommentarySection";
import type { JesusTitleRef } from "@/lib/titles/types";

/**
 * <TitleCommentarySection /> — Doctrine A commentary filtered to the
 * title's primary NT declaration verse. Reuses the shipped
 * <CommentarySection /> from Batch 4+5 so Doctrine A render-spec (featured
 * excerpt ≤50 words + "Show other voices" disclosure) applies uniformly.
 *
 * Picks the first nt_declaration ref as the anchor. If no nt_declaration
 * refs exist, falls back to the first ref of any type. If no refs at all,
 * renders nothing.
 */
export default function TitleCommentarySection({
  refs,
}: {
  refs: JesusTitleRef[];
}) {
  const anchor =
    refs.find((r) => r.ref_type === "nt_declaration") ?? refs[0];
  if (!anchor) return null;

  return (
    <section className="mb-12">
      <h2 className="font-[family-name:var(--font-cinzel)] text-white text-2xl mb-2">
        What the commentators say
      </h2>
      <p className="text-[var(--text-muted)] text-sm mb-6 font-[family-name:var(--font-inter)]">
        Doctrine A — curated voices on the anchor verse
      </p>
      <CommentarySection
        bookId={anchor.book_id}
        chapter={anchor.chapter}
        verseStart={anchor.verse_start}
      />
    </section>
  );
}
