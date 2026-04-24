"use client";

import Link from "next/link";
import type { BookHubData } from "../types";

/**
 * Mark's two-panel arc, split at Peter's confession (8:27).
 */

const BEFORE = [
  { chapter: 1, title: "Baptism and authority" },
  { chapter: 2, title: "Sabbath controversies" },
  { chapter: 4, title: "Parables and the stilling" },
  { chapter: 5, title: "Legion, Jairus's daughter" },
  { chapter: 6, title: "Five thousand fed" },
  { chapter: 8, title: "Who say ye that I am?" },
];

const AFTER = [
  { chapter: 9, title: "Transfiguration; second passion saying" },
  { chapter: 10, title: "Ransom for many (10:45)" },
  { chapter: 11, title: "Triumphal entry; temple cleansed" },
  { chapter: 14, title: "Gethsemane; arrest" },
  { chapter: 15, title: "Trial; crucifixion; centurion's confession" },
  { chapter: 16, title: "Empty tomb; textual evidence" },
];

export default function MarkTwoPanelArc({ data }: { data: BookHubData }) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-14 border-y border-[#1E2028]">
      <h2 className="text-center font-[family-name:var(--font-cinzel)] text-[#C9A227] text-xl tracking-[0.2em] uppercase mb-2">
        The Servant's Arc
      </h2>
      <p className="text-center text-[#9CA3AF] text-sm mb-10 font-[family-name:var(--font-inter)]">
        Two panels. The narrative hinges at Peter's confession in 8:27, where
        the Servant revealed begins walking toward the cross.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        <Panel label="Servant revealed" chapterRange="1–8" items={BEFORE} slug={data.meta.slug} side="left" />
        <Panel label="Servant suffers" chapterRange="9–16" items={AFTER} slug={data.meta.slug} side="right" />

        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px bg-[#C9A227]/40" aria-hidden />
      </div>

      <div className="mt-6 flex justify-center">
        <div className="inline-flex items-center gap-3 rounded border border-[#C9A227]/40 bg-[#0F1117] px-4 py-2 text-[#C9A227] text-sm font-[family-name:var(--font-inter)]">
          8:27 — Peter's confession
        </div>
      </div>

      <p className="mt-8 text-center text-[#6B7280] text-xs font-[family-name:var(--font-inter)]">
        'Immediately' (euthys) pulses roughly 40× through the narrative — motion without interlude.
      </p>
    </section>
  );
}

function Panel({
  label,
  chapterRange,
  items,
  slug,
  side,
}: {
  label: string;
  chapterRange: string;
  items: Array<{ chapter: number; title: string }>;
  slug: string;
  side: "left" | "right";
}) {
  return (
    <div className={side === "right" ? "md:pl-8" : "md:pr-8"}>
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="text-[#F0EDE8] text-lg font-[family-name:var(--font-cinzel)]">
          {label}
        </h3>
        <span className="text-[#6B7280] text-xs font-[family-name:var(--font-inter)]">
          {chapterRange}
        </span>
      </div>
      <ol className="space-y-2">
        {items.map((i) => (
          <li key={i.chapter}>
            <Link
              href={`/read/${slug}/${i.chapter}`}
              className="group flex items-baseline gap-3 rounded border border-[#1E2028] bg-[#0F1117] px-3 py-2 hover:border-[#C9A227] transition-colors"
            >
              <span className="text-[#C9A227] font-[family-name:var(--font-cinzel)] text-base shrink-0 w-6">
                {i.chapter}
              </span>
              <span className="text-[#E5E7EB] text-sm group-hover:text-[#C9A227] transition-colors font-[family-name:var(--font-inter)]">
                {i.title}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
