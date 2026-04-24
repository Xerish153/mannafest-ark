import { supabase } from "@/lib/supabase";
import { TraditionChip } from "@/components/Cite/TraditionChip";
import { truncateWords } from "@/components/commentary/FeaturedExcerpt";
import { FEATURED_EXCERPT_WORD_CAP } from "@/lib/supabase/schemas/commentaries";

/**
 * <VotdCommentaryHighlights /> — 1–3 short excerpts from the day's verse
 * chapter, rendered per Doctrine A (featured-excerpt shape). Each card
 * labeled "Chapter context" since current commentary is chapter-level —
 * the student sees clearly that the voice is commenting on the chapter,
 * not necessarily the specific verse.
 *
 * If the chapter has zero published commentary rows, this component
 * returns null so the Layer 2 page doesn't show an empty header.
 */

export default async function VotdCommentaryHighlights({
  bookId,
  chapter,
}: {
  bookId: number;
  chapter: number;
}) {
  const { data } = await supabase
    .from("commentaries")
    .select(
      `id, commentary_text, featured, featured_excerpt,
       scholar:scholars!commentaries_scholar_id_fkey(name, tradition_key, default_rank, is_founder)`,
    )
    .eq("book_id", bookId)
    .eq("chapter", chapter)
    .eq("status", "published")
    .limit(10);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows = (data ?? []) as any[];
  const attributed = rows.filter((r) => r?.scholar);
  if (attributed.length === 0) return null;

  // Pick up to 3: featured first, then by scholar default_rank ascending.
  const featured = attributed.find((r) => r.featured);
  const pool = attributed
    .filter((r) => r !== featured)
    .sort(
      (a, b) =>
        (a.scholar?.default_rank ?? 1000) - (b.scholar?.default_rank ?? 1000),
    );
  const picks = [featured, ...pool].filter(Boolean).slice(0, 3);

  return (
    <section aria-labelledby="votd-commentary-title" className="mt-10">
      <h2
        id="votd-commentary-title"
        className="font-[family-name:var(--font-cinzel)] text-[var(--text)] text-xl mb-1"
      >
        Commentary highlights
      </h2>
      <p className="text-[var(--text-muted)] text-xs mb-5 font-[family-name:var(--font-inter)]">
        Voices curated from the chapter. &ldquo;Chapter context&rdquo; reminds
        the reader the excerpt is on the surrounding passage, not only this verse.
      </p>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {picks.map((r) => {
          const body = r.featured_excerpt
            ? r.featured_excerpt
            : truncateWords(r.commentary_text, FEATURED_EXCERPT_WORD_CAP);
          return (
            <li
              key={r.id}
              className="rounded-lg border border-[var(--ink-100, var(--border))] bg-[var(--paper-50, var(--surface))] p-5 list-none"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] font-[family-name:var(--font-inter)]">
                    Chapter context
                  </div>
                  <div className="font-serif text-sm font-semibold text-[var(--ink-900, var(--text))] truncate">
                    {r.scholar.name}
                  </div>
                </div>
                <TraditionChip
                  tradition={r.scholar.tradition_key ?? "academic"}
                  size="sm"
                />
              </div>
              <blockquote className="font-serif text-[14px] leading-relaxed text-[var(--ink-900, var(--text))]">
                {body}
              </blockquote>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
