import VotdHero from "./VotdHero";
import VotdCommentaryHighlights from "./VotdCommentaryHighlights";
import VotdConnections from "./VotdConnections";
import type { VotdPayload } from "@/lib/votd/loader";

/**
 * <VotdLayer2Page /> — dedicated /verse-of-the-day page body.
 *
 * Composition:
 *   1. <VotdHero /> — verse + reflection or scholar-quote fallback
 *   2. <VotdCommentaryHighlights /> — 1–3 chapter-context cards
 *   3. <VotdConnections /> — related verses + featured studies + themes
 *
 * The Editor's Notes drawer is attached at the app shell (layout.tsx)
 * and surfaces on this page per Vision v2 §4.3.4 (not excluded).
 */
export default function VotdLayer2Page({ data }: { data: VotdPayload }) {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <main className="pt-6 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-8">
            <div className="text-[var(--accent, #C9A227)] text-xs tracking-[0.2em] uppercase mb-3 font-[family-name:var(--font-inter)]">
              Verse of the Day
            </div>
            <h1 className="font-[family-name:var(--font-cinzel)] text-4xl text-[var(--text)]">
              A jumping-off point for study
            </h1>
            <p className="mt-3 text-[var(--text-muted)] text-sm max-w-lg mx-auto font-[family-name:var(--font-inter)]">
              One verse, one reflection, and the connections a serious student
              would want to read next.
            </p>
          </header>

          <VotdHero data={data} />
          <VotdCommentaryHighlights
            bookId={data.verse.book_id}
            chapter={data.verse.chapter}
          />
          <VotdConnections
            verseNodeId={data.verse.node_id}
            bookId={data.verse.book_id}
            chapter={data.verse.chapter}
            verseNum={data.verse.verse}
          />
        </div>
      </main>
    </div>
  );
}
