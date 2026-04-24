import type { Metadata } from "next";
import { notFound } from "next/navigation";
import VotdLayer2Page from "@/components/votd/VotdLayer2Page";
import { loadVotdToday } from "@/lib/votd/loader";

/**
 * /verse-of-the-day — today's Layer 2 VOTD page.
 *
 * Batch 6 scrap + rebuild. Replaces the pre-Doctrine-D page that queried
 * the legacy `verse_of_the_day` (day_of_year) table. The new page uses
 * `loadVotdToday()` which resolves via `votd_reflections` when a founder
 * reflection is published for today, else falls through to the canonical
 * day-of-year verse + scholar-quote fallback per Vision v2 §4.7.
 */

export const metadata: Metadata = {
  title: "Verse of the Day — MannaFest",
  description:
    "Today's verse with reflection, commentary highlights, and connection points — a jumping-off point for serious study.",
};

// Re-render at most hourly; the underlying date flips at midnight local.
export const revalidate = 3600;

export default async function VerseOfTheDayPage() {
  const data = await loadVotdToday();
  if (!data) notFound();
  return <VotdLayer2Page data={data} />;
}
