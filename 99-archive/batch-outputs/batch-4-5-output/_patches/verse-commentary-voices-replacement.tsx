// REPLACEMENT FOR: src/app/verse/[book]/[chapter]/[verse]/CommentaryVoices.tsx
//
// Drop-in. Same prop signature ({ bookName, chapterNum }) so no change
// needed in ./page.tsx or any other caller.
//
// Behavior change:
//  - Old: fetched commentaries directly, rendered each as a <Cite /> card.
//  - New: delegates to <CommentarySection />, which implements the Doctrine A
//         render spec (featured excerpt + "Show other voices (N)" disclosure).
//  - EditorialSlot stays in place as a super-admin "+ Add inline note"
//    stub. Full per-chapter founder-note authoring now lives on the
//    curation panel at /admin/commentary/[bookSlug]/[chapter] — the
//    EditorialSlot flip-on is a follow-up micro-batch.
//
// Meta label behavior: the Section header's meta is now a lightweight
// "voices" count derived from the same query CommentarySection does, to
// avoid double-fetching. We render meta optimistically — "curated" if any
// row is featured, else a count of published rows.

import { supabase } from "@/lib/supabase";
import CommentarySection from "@/components/commentary/CommentarySection";
import EditorialSlot from "@/components/EditorialSlot";
import Section from "./Section";

async function fetchVoiceSummary(bookId: number, chapterNum: number): Promise<{
  count: number;
  anyFeatured: boolean;
}> {
  const { data } = await supabase
    .from("commentaries")
    .select("id, featured")
    .eq("book_id", bookId)
    .eq("chapter", chapterNum)
    .eq("status", "published");
  const rows = data ?? [];
  return {
    count: rows.length,
    anyFeatured: rows.some((r) => (r as { featured: boolean }).featured),
  };
}

async function resolveBookId(bookName: string): Promise<number | null> {
  const { data } = await supabase
    .from("books")
    .select("id")
    .ilike("name", bookName)
    .maybeSingle();
  return (data as { id: number } | null)?.id ?? null;
}

export default async function CommentaryVoices({
  bookName,
  chapterNum,
}: {
  bookName: string;
  chapterNum: number;
}) {
  const bookId = await resolveBookId(bookName);
  if (!bookId) {
    // Keep Section rendering with empty-state rather than returning null,
    // so the eyebrow number "09" in the verse template stays stable.
    return (
      <Section
        id="commentary"
        title="Commentary voices"
        eyebrow="09"
        defaultOpen={false}
        meta="no voices yet"
      >
        <EditorialSlot
          id={`commentary-founder-${bookName}-${chapterNum}`}
          className="mb-2"
          hint={`Founder note on ${bookName} ${chapterNum}`}
        />
      </Section>
    );
  }

  const { count, anyFeatured } = await fetchVoiceSummary(bookId, chapterNum);
  const meta =
    count === 0
      ? "no voices yet"
      : anyFeatured
        ? `${count} voice${count === 1 ? "" : "s"} · curated`
        : `${count} voice${count === 1 ? "" : "s"}`;

  return (
    <Section
      id="commentary"
      title="Commentary voices"
      eyebrow="09"
      defaultOpen={count <= 3}
      meta={meta}
    >
      {/* Doctrine D.2 founder inline-note affordance. Public users see
          nothing; super-admin sees "+ Add inline note". The chapter-level
          curation surface at /admin/commentary/[bookSlug]/[chapter] is the
          full editor. */}
      <EditorialSlot
        id={`commentary-founder-${bookName}-${chapterNum}`}
        className="mb-4"
        hint={`Founder note on ${bookName} ${chapterNum}`}
      />

      {count > 0 ? (
        <CommentarySection bookId={bookId} chapter={chapterNum} />
      ) : (
        <p className="text-sm text-[var(--text-muted)]">
          No curated commentary voices yet for this chapter.
        </p>
      )}
    </Section>
  );
}
