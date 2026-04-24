import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { resolveBookAbbr, abbrToUrlSlug } from "@/lib/books";
import { GRAPH_ENABLED } from "@/lib/features/flags";

import AddNoteButton from "@/components/AddNoteButton";
import ShareVerseButton from "@/components/ShareVerseButton";
import HighlightButton from "@/components/HighlightButton";
import CompareTranslationsLauncher from "@/components/verses/CompareTranslationsLauncher";
import StudyTracker from "@/components/StudyTracker";
import AuthPrompt from "@/components/AuthPrompt";
import ReadingHistoryTracker from "@/components/ReadingHistoryTracker";
import VerseNotes from "@/components/VerseNotes";
import BreadcrumbOverride from "@/components/nav/BreadcrumbOverride";
import BookmarkButton from "@/components/account/BookmarkButton";
import VerseActionOverflow from "@/components/verses/VerseActionOverflow";
import CrossReferenceSection from "@/components/verses/CrossReferenceSection";
import FeaturedStudiesOnVerse from "@/components/verses/FeaturedStudiesOnVerse";
import OriginalLanguageTable from "@/components/verses/OriginalLanguageTable";

import VerseHeader from "./VerseHeader";
import CharactersInvolved from "./CharactersInvolved";
import Location from "./Location";
import TypologicalConnections from "./TypologicalConnections";
import PropheticConnections from "./PropheticConnections";
import ManuscriptAttestation from "./ManuscriptAttestation";
import CommentaryVoices from "./CommentaryVoices";
import ConnectedGraph from "./ConnectedGraph";
import { SectionSkeleton } from "./Section";
import { fetchVerseNodeId } from "./verse-data";

/**
 * Canonical verse page — Batch 5.5 redesign + Batch 6 additions.
 *
 * Inline above the fold:
 *   1. Verse text + KJV chip (VerseHeader)
 *   2. Commentary featured excerpt (CommentaryVoices — Doctrine A render,
 *      trim-at-render verified working as of Batch 6 entry audit)
 *   3. Featured studies on this verse (new in Batch 6) — returns null if
 *      no refs
 *   4. Cross-references top-5 + disclosure (Batch 5.5)
 *
 * Below the fold (collapsed):
 *   - Parallel translations / About this book (from VerseHeader)
 *   - Original language (biblehub-style table — Batch 6). Replaces the
 *     word-split fallback; returns null when the verse has no Strong's
 *     data so empty tables don't render.
 *   - Characters / Location / Typological / Prophetic / Manuscript —
 *     each returns null without data.
 *   - Connected graph — gated on NEXT_PUBLIC_GRAPH_ENABLED (Batch 6).
 *
 * Action bar: Bookmark + Add note + Highlight visible. Compare / Share in
 * the overflow menu. Graph-view menu item gates on GRAPH_ENABLED.
 *
 * "Your notes" textarea: collapsed affordance at the bottom.
 *
 * The old footer "Explore in graph view" CTA is gone — graph moved to the
 * action bar overflow (which itself is gated).
 */

type PageProps = {
  params: Promise<{ book: string; chapter: string; verse: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { book: bookSlug, chapter: chapterStr, verse: verseStr } = await params;
  const chapterNum = parseInt(chapterStr);
  const verseNum = parseInt(verseStr);

  const resolvedAbbr = resolveBookAbbr(bookSlug);
  if (!resolvedAbbr) return { title: "Verse Not Found — MannaFest" };

  const { data: bookData } = await supabase
    .from("books")
    .select("id, name")
    .eq("abbreviation", resolvedAbbr)
    .maybeSingle();
  if (!bookData) return { title: "Verse Not Found — MannaFest" };

  const { data: verseData } = await supabase
    .from("verses")
    .select("text")
    .eq("book_id", bookData.id)
    .eq("chapter_num", chapterNum)
    .eq("verse_num", verseNum)
    .limit(1)
    .maybeSingle();

  const verseText = verseData?.text ?? "";
  const bookName = bookData.name;
  const canonicalSlug = abbrToUrlSlug(resolvedAbbr);
  const canonicalUrl = `https://mannafest.faith/verse/${canonicalSlug}/${chapterNum}/${verseNum}`;

  return {
    title: `${bookName} ${chapterNum}:${verseNum} KJV — MannaFest`,
    description: `${bookName} ${chapterNum}:${verseNum} KJV: "${verseText.substring(0, 155)}${verseText.length > 155 ? "…" : ""}" — cross-references, original language, and commentary.`,
    openGraph: {
      title: `${bookName} ${chapterNum}:${verseNum} — MannaFest`,
      description: verseText.substring(0, 200),
      url: canonicalUrl,
      siteName: "MannaFest",
      type: "article",
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${bookName} ${chapterNum}:${verseNum} KJV`,
      description: verseText.substring(0, 200),
      images: ["/og-image.png"],
    },
    alternates: { canonical: canonicalUrl },
  };
}

function JsonLd({
  bookName, bookAbbr, chapter, verse, verseText,
}: {
  bookName: string; bookAbbr: string; chapter: number; verse: number; verseText: string;
}) {
  const baseUrl = "https://mannafest.faith";
  const verseUrl = `${baseUrl}/verse/${bookAbbr.toLowerCase()}/${chapter}/${verse}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": verseUrl,
      url: verseUrl,
      name: `${bookName} ${chapter}:${verse} KJV — MannaFest Bible Study`,
      description: verseText.substring(0, 160),
      isPartOf: {
        "@type": "WebSite", "@id": `${baseUrl}/#website`,
        url: baseUrl, name: "MannaFest",
      },
      breadcrumb: { "@id": `${verseUrl}#breadcrumb` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${verseUrl}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
        { "@type": "ListItem", position: 2, name: "Read", item: `${baseUrl}/read` },
        { "@type": "ListItem", position: 3, name: bookName, item: `${baseUrl}/read/${bookAbbr.toLowerCase()}` },
        { "@type": "ListItem", position: 4, name: `Chapter ${chapter}`, item: `${baseUrl}/read/${bookAbbr.toLowerCase()}/${chapter}` },
        { "@type": "ListItem", position: 5, name: `Verse ${verse}`, item: verseUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${bookName} ${chapter}:${verse} KJV`,
      text: verseText,
      inLanguage: "en",
      isPartOf: { "@type": "Book", name: "The Holy Bible (KJV)", author: "King James Version" },
      publisher: { "@type": "Organization", name: "MannaFest", url: baseUrl },
      mainEntityOfPage: { "@type": "WebPage", "@id": verseUrl },
    },
  ];
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  );
}

export default async function VersePage({ params }: PageProps) {
  const { book: bookSlug, chapter: chapterStr, verse: verseStr } = await params;
  const chapterNum = parseInt(chapterStr);
  const verseNum = parseInt(verseStr);
  if (!Number.isFinite(chapterNum) || !Number.isFinite(verseNum)) notFound();

  const resolvedAbbr = resolveBookAbbr(bookSlug);
  if (!resolvedAbbr) notFound();

  const { data: bookData } = await supabase
    .from("books")
    .select("id, name, abbreviation, testament")
    .eq("abbreviation", resolvedAbbr)
    .maybeSingle();
  if (!bookData) notFound();

  const { data: verseRow } = await supabase
    .from("verses")
    .select("id, text, translation_id, translations(abbreviation)")
    .eq("book_id", bookData.id)
    .eq("chapter_num", chapterNum)
    .eq("verse_num", verseNum)
    .limit(1)
    .maybeSingle();
  if (!verseRow) notFound();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const kjvText = (verseRow as any).text as string;
  const lowerAbbr = bookData.abbreviation.toLowerCase();
  const canonicalSlug = abbrToUrlSlug(bookData.abbreviation);

  const graphNodeId = await fetchVerseNodeId(bookData.id, chapterNum, verseNum);
  const graphHref = `/graph?verse=${encodeURIComponent(`${bookData.name} ${chapterNum}:${verseNum}`)}`;

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <ReadingHistoryTracker
        bookId={bookData.id}
        chapterNum={chapterNum}
        verseNum={verseNum}
      />
      <StudyTracker
        nodeType="verse"
        pageTitle={`${bookData.name} ${chapterNum}:${verseNum}`}
        path={`/verse/${canonicalSlug}/${chapterNum}/${verseNum}`}
        metadata={{
          book_id: bookData.id,
          book_abbreviation: bookData.abbreviation,
          chapter_num: chapterNum,
          verse_num: verseNum,
        }}
      />
      <JsonLd
        bookName={bookData.name}
        bookAbbr={bookData.abbreviation}
        chapter={chapterNum}
        verse={verseNum}
        verseText={kjvText}
      />
      <BreadcrumbOverride segment={canonicalSlug} label={bookData.name} />
      <BreadcrumbOverride segment={String(chapterNum)} label={`Chapter ${chapterNum}`} />
      <BreadcrumbOverride segment={String(verseNum)} label={`Verse ${verseNum}`} />

      <main className="pt-6 pb-16 px-4">
        <div className="max-w-4xl mx-auto">

          <VerseHeader
            bookId={bookData.id}
            bookName={bookData.name}
            bookAbbr={lowerAbbr}
            testament={bookData.testament}
            chapterNum={chapterNum}
            verseNum={verseNum}
            kjvText={kjvText}
          />

          {/* Action bar (compact, deduplicated; graph item flag-gated) */}
          <div className="mb-10 flex items-center gap-3 flex-wrap font-[family-name:var(--font-inter)]">
            <BookmarkButton
              pageUrl={`/verse/${canonicalSlug}/${chapterNum}/${verseNum}`}
              pageTitle={`${bookData.name} ${chapterNum}:${verseNum}`}
              nodeType="verse"
            />
            <AddNoteButton
              verseId={verseRow.id}
              bookName={bookData.name}
              chapter={chapterNum}
              verse={verseNum}
            />
            <HighlightButton
              verseId={verseRow.id}
              bookName={lowerAbbr}
              chapter={chapterNum}
              verse={verseNum}
            />
            <VerseActionOverflow graphHref={graphHref}>
              <CompareTranslationsLauncher
                book={bookData.name}
                chapter={chapterNum}
                verse={verseNum}
              />
              <ShareVerseButton
                bookName={bookData.name}
                chapter={chapterNum}
                verse={verseNum}
                verseText={kjvText}
              />
            </VerseActionOverflow>
          </div>
          <AuthPrompt redirectPath={`/verse/${canonicalSlug}/${chapterNum}/${verseNum}`} />

          {/* Commentary featured excerpt (inline, Doctrine A trim-at-render) */}
          <Suspense fallback={<SectionSkeleton title="Commentary voices" />}>
            <CommentaryVoices bookName={bookData.name} chapterNum={chapterNum} />
          </Suspense>

          {/* Featured studies on this verse — new in Batch 6. Renders
              nothing when no refs cover this verse. */}
          <Suspense fallback={<SectionSkeleton title="Featured studies" />}>
            <FeaturedStudiesOnVerse
              bookId={bookData.id}
              chapter={chapterNum}
              verseNum={verseNum}
            />
          </Suspense>

          {/* Cross-references top-5 + disclosure (Batch 5.5) */}
          <Suspense fallback={<SectionSkeleton title="Cross-references" />}>
            <CrossReferenceSection graphNodeId={graphNodeId} />
          </Suspense>

          {/* Below the fold: original-language table only when there's data. */}
          <Suspense fallback={<SectionSkeleton title="Original language" />}>
            <OriginalLanguageTable
              verseRowId={verseRow.id as number}
              testament={bookData.testament}
            />
          </Suspense>

          <Suspense fallback={<SectionSkeleton title="Characters involved" />}>
            <CharactersInvolved graphNodeId={graphNodeId} />
          </Suspense>

          <Suspense fallback={<SectionSkeleton title="Location" />}>
            <Location graphNodeId={graphNodeId} />
          </Suspense>

          <Suspense fallback={<SectionSkeleton title="Typological connections" />}>
            <TypologicalConnections
              graphNodeId={graphNodeId}
              bookName={bookData.name}
              chapterNum={chapterNum}
              verseNum={verseNum}
            />
          </Suspense>

          <Suspense fallback={<SectionSkeleton title="Prophetic connections" />}>
            <PropheticConnections
              graphNodeId={graphNodeId}
              bookId={bookData.id}
              chapterNum={chapterNum}
              verseNum={verseNum}
            />
          </Suspense>

          <Suspense fallback={<SectionSkeleton title="Manuscript attestation" />}>
            <ManuscriptAttestation graphNodeId={graphNodeId} />
          </Suspense>

          {/* ConnectedGraph — gates on GRAPH_ENABLED. Absent from the render
              tree entirely when graph is off; no skeleton flash either. */}
          {GRAPH_ENABLED && (
            <Suspense fallback={<SectionSkeleton title="Connected graph" />}>
              <ConnectedGraph
                graphNodeId={graphNodeId}
                centerLabel={`${bookData.name} ${chapterNum}:${verseNum}`}
                bookName={bookData.name}
                chapterNum={chapterNum}
                verseNum={verseNum}
              />
            </Suspense>
          )}

          <details className="mt-10 group">
            <summary className="list-none cursor-pointer select-none px-6 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg font-[family-name:var(--font-inter)] text-[var(--text)] text-sm hover:border-[var(--accent, #C9A227)] transition-colors flex items-center justify-between">
              <span>Your notes</span>
              <span className="text-[var(--text-muted)] text-xs group-open:rotate-180 transition-transform select-none">
                ▾
              </span>
            </summary>
            <div className="mt-4">
              <VerseNotes
                verseId={verseRow.id}
                bookName={bookData.name}
                chapter={chapterNum}
                verse={verseNum}
              />
            </div>
          </details>

          <div className="mt-10 pt-6 border-t border-[var(--border)] font-[family-name:var(--font-inter)]">
            <Link
              href={`/read/${lowerAbbr}/${chapterNum}`}
              className="inline-block px-6 py-3 bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] rounded font-semibold hover:border-[var(--accent, #C9A227)] transition-colors"
            >
              Continue reading chapter {chapterNum} →
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}
