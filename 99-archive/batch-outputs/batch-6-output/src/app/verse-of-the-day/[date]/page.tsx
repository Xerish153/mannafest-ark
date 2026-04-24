import Link from "next/link";
import type { Metadata } from "next";
import VotdLayer2Page from "@/components/votd/VotdLayer2Page";
import { loadVotdForDate } from "@/lib/votd/loader";

/**
 * /verse-of-the-day/[date] — historical permalink.
 *
 * Valid `date` is ISO YYYY-MM-DD. Dates outside that shape 404. Dates in
 * the future (or with no resolvable verse) show a soft "no VOTD" notice
 * with a link back to today's — rather than a hard 404, so share links
 * that get forwarded stay usable.
 */

type PageProps = {
  params: Promise<{ date: string }>;
};

function isIsoDate(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { date } = await params;
  return {
    title: isIsoDate(date)
      ? `Verse of the Day — ${date} — MannaFest`
      : "Verse of the Day — MannaFest",
    robots: { index: false, follow: true },
  };
}

export default async function HistoricalVotdPage({ params }: PageProps) {
  const { date } = await params;

  if (!isIsoDate(date)) {
    return <NoVotd date={date} reason="invalid" />;
  }

  const data = await loadVotdForDate(date);
  if (!data) {
    return <NoVotd date={date} reason="none" />;
  }
  return <VotdLayer2Page data={data} />;
}

function NoVotd({
  date,
  reason,
}: {
  date: string;
  reason: "invalid" | "none";
}) {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <main className="pt-12 pb-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-[family-name:var(--font-cinzel)] text-3xl text-[var(--text)] mb-4">
            No Verse of the Day for this date
          </h1>
          <p className="text-[var(--text-muted)] text-sm mb-8 font-[family-name:var(--font-inter)]">
            {reason === "invalid"
              ? `"${date}" isn't a valid date (expected YYYY-MM-DD).`
              : `No VOTD has been queued for ${date} yet.`}
          </p>
          <Link
            href="/verse-of-the-day"
            className="inline-block px-6 py-3 text-sm font-semibold rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--accent, #C9A227)] transition-colors font-[family-name:var(--font-inter)]"
          >
            Today&rsquo;s VOTD →
          </Link>
        </div>
      </main>
    </div>
  );
}
