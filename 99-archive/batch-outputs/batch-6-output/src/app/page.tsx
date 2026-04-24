import Link from "next/link";
import HomeHero from "@/components/home/HomeHero";
import FeatureGrid from "@/components/home/FeatureGrid";
import HomeDonate from "@/components/home/HomeDonate";
import VotdLayer1Card from "@/components/votd/VotdLayer1Card";
import { loadVotdToday } from "@/lib/votd/loader";

/**
 * Homepage — Batch 6 "layered" reshape.
 *
 * Doctrine D's layered framing: Verse of the Day earns the lead slot on
 * the homepage (Layer 1 — verse + reflection + "Read full study →" CTA).
 * The 4-tile grid sits below. Hero + donation footer + graph footer link
 * preserved from Batch 1.5 / 2.5.
 *
 * Structure, top to bottom:
 *   1. Hero           — wordmark + tagline + search
 *   2. VOTD Layer 1   — full-render VOTD + "Read full study →" to Layer 2
 *   3. Feature grid   — 4 tiles (Isaiah / Kings / Apologetics / Strong's)
 *   4. Mission blurb
 *   5. Donation row
 *   6. Footer (with muted graph under-construction link)
 */
// Re-render at most hourly so a newly-published VOTD reflection appears.
export const revalidate = 3600;

export default async function Home() {
  const votd = await loadVotdToday();

  return (
    <div className="min-h-screen bg-[#08090C] flex flex-col">
      <HomeHero />

      {votd ? <VotdLayer1Card data={votd} /> : null}

      <FeatureGrid />

      <section className="px-4 pb-20 sm:pb-24">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-[family-name:var(--font-cinzel)] text-[#F0EDE8] text-lg sm:text-xl leading-relaxed italic">
            MannaFest is built for the student of the Bible who wants to learn.
          </p>
          <p className="text-[#9CA3AF] text-sm sm:text-base leading-relaxed font-[family-name:var(--font-inter)] mt-4">
            Our mission is to present Scripture&rsquo;s data &mdash; manuscripts,
            prophecies, cross-references, archaeological anchors, linguistic roots,
            typological threads, commentary tradition &mdash; so clearly that the
            truth argues for itself. No polemics. No triumphalism. Just the data,
            interconnected, for anyone who wants to listen.
          </p>
          <div className="mt-6">
            <Link
              href="/about"
              className="inline-block text-[#C9A227] text-sm hover:underline font-[family-name:var(--font-inter)]"
            >
              More about MannaFest &rarr;
            </Link>
          </div>
        </div>
      </section>

      <HomeDonate />

      <footer className="bg-[#08090C] border-t border-[#1E2028] py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B7280] font-[family-name:var(--font-inter)]">
            <div>
              <span className="text-[#C9A227] font-[family-name:var(--font-cinzel)] tracking-widest mr-3">
                MANNAFEST
              </span>
              Free for every student of Scripture.
            </div>
            <nav className="flex items-center gap-5">
              <Link href="/study" className="hover:text-white transition-colors">Feature Pages</Link>
              <Link href="/apologetics" className="hover:text-white transition-colors">Apologetics</Link>
              <Link href="/about" className="hover:text-white transition-colors">About</Link>
              <Link href="/#support" className="hover:text-white transition-colors">Support</Link>
              <a
                href="https://github.com/Xerish153/MannaFest"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                GitHub
              </a>
            </nav>
          </div>
          <div className="text-center sm:text-right text-[11px] text-[#4B5563] font-[family-name:var(--font-inter)]">
            <Link href="/graph" className="hover:text-[#6B7280] transition-colors">
              Graph (under construction)
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
