import Link from "next/link";
import VotdHero from "./VotdHero";
import type { VotdPayload } from "@/lib/votd/loader";

/**
 * <VotdLayer1Card /> — homepage wrapper (Doctrine D layered framing).
 * Renders the full VOTD hero + "Read full study →" CTA. No commentary
 * highlights, no connection points — those live on Layer 2.
 *
 * The homepage composes this in place of the old <VerseOfDayTile />. The
 * card takes the width of the hero's container; the tile grid below is
 * independent.
 */
export default function VotdLayer1Card({ data }: { data: VotdPayload }) {
  return (
    <section
      aria-labelledby="votd-home-title"
      className="px-4 pb-10 sm:pb-14"
    >
      <div className="max-w-4xl mx-auto">
        <h2
          id="votd-home-title"
          className="sr-only"
        >
          Verse of the Day
        </h2>
        <VotdHero data={data} />
        <div className="mt-5 text-center">
          <Link
            href="/verse-of-the-day"
            className="inline-block px-6 py-2.5 text-sm font-semibold rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--accent, #C9A227)] transition-colors font-[family-name:var(--font-inter)]"
          >
            Read full study →
          </Link>
        </div>
      </div>
    </section>
  );
}
