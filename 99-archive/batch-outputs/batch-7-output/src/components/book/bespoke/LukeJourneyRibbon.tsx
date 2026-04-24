"use client";

import Link from "next/link";
import type { BookHubData } from "../types";

const WAYPOINTS = [
  { label: "Bethlehem", chapter: 2, ref: "Luk 2" },
  { label: "Nazareth", chapter: 4, ref: "Luk 4" },
  { label: "Galilee", chapter: 5, ref: "Luk 5" },
  { label: "Travel narrative", chapter: 10, ref: "9:51–19:27" },
  { label: "Jerusalem", chapter: 19, ref: "19:28–23" },
  { label: "Emmaus coda", chapter: 24, ref: "Luk 24" },
];

export default function LukeJourneyRibbon({ data }: { data: BookHubData }) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-14 border-y border-[#1E2028]">
      <h2 className="text-center font-[family-name:var(--font-cinzel)] text-[#C9A227] text-xl tracking-[0.2em] uppercase mb-2">
        Luke's Journey Ribbon
      </h2>
      <p className="text-center text-[#9CA3AF] text-sm mb-10 font-[family-name:var(--font-inter)]">
        Bethlehem to Emmaus — Luke 9:51 is the pivot:
        <span className="text-[#F0EDE8] italic mx-1">“he stedfastly set his face to go to Jerusalem.”</span>
      </p>

      <ol className="relative flex flex-col md:flex-row items-stretch gap-4 md:gap-0 md:items-center">
        {/* Ribbon line */}
        <div
          aria-hidden
          className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 bg-gradient-to-r from-[#C9A227]/20 via-[#C9A227] to-[#C9A227]/20"
        />
        {WAYPOINTS.map((w, idx) => (
          <li
            key={w.label}
            className={`relative flex-1 ${idx < WAYPOINTS.length - 1 ? "md:pr-4" : ""}`}
          >
            <Link
              href={`/read/${data.meta.slug}/${w.chapter}`}
              className="group block rounded border border-[#1E2028] bg-[#0F1117] p-3 text-center hover:border-[#C9A227] transition-colors relative z-10"
            >
              <div className="text-[#C9A227] text-xs tracking-[0.2em] uppercase mb-1 font-[family-name:var(--font-inter)]">
                {w.ref}
              </div>
              <div className="text-[#F0EDE8] text-sm font-semibold group-hover:text-[#C9A227] transition-colors font-[family-name:var(--font-inter)]">
                {w.label}
              </div>
            </Link>
          </li>
        ))}
      </ol>

      <p className="mt-8 text-center text-[#6B7280] text-xs font-[family-name:var(--font-inter)]">
        Luke's travel narrative (9:51–19:27) is nearly a third of the Gospel — most of the great parables are in it.
      </p>
    </section>
  );
}
