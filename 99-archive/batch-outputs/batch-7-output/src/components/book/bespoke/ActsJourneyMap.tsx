"use client";

import Link from "next/link";
import type { BookHubData } from "../types";

/**
 * Acts — stylized journey map. Not cartographically exact; intended as an
 * iconic depiction of the three Pauline journeys + the voyage to Rome,
 * anchored to the Acts 1:8 program.
 */

type Stop = { name: string; chapter: number; note: string; color: string };

const JOURNEYS: Array<{ label: string; chapterRange: string; stops: Stop[]; color: string }> = [
  {
    label: "1st journey (Cyprus / Galatia)",
    chapterRange: "13–14",
    color: "#C9A227",
    stops: [
      { name: "Antioch (Syria)", chapter: 13, note: "Sent with Barnabas", color: "#C9A227" },
      { name: "Cyprus (Paphos)", chapter: 13, note: "Elymas", color: "#C9A227" },
      { name: "Pisidian Antioch", chapter: 13, note: "Sabbath sermon", color: "#C9A227" },
      { name: "Iconium · Lystra · Derbe", chapter: 14, note: "Stoned; returning", color: "#C9A227" },
    ],
  },
  {
    label: "2nd journey (Greece)",
    chapterRange: "15:36–18:22",
    color: "#8B6F1A",
    stops: [
      { name: "Troas — Macedonian vision", chapter: 16, note: "'Come over…'", color: "#8B6F1A" },
      { name: "Philippi", chapter: 16, note: "Lydia; jailer", color: "#8B6F1A" },
      { name: "Thessalonica · Berea", chapter: 17, note: "Turned upside down", color: "#8B6F1A" },
      { name: "Athens (Mars Hill)", chapter: 17, note: "Unknown God", color: "#8B6F1A" },
      { name: "Corinth", chapter: 18, note: "Eighteen months", color: "#8B6F1A" },
    ],
  },
  {
    label: "3rd journey (Ephesus)",
    chapterRange: "18:23–21:16",
    color: "#6B4F12",
    stops: [
      { name: "Ephesus", chapter: 19, note: "Two-year ministry", color: "#6B4F12" },
      { name: "Miletus — farewell", chapter: 20, note: "'Take heed to yourselves'", color: "#6B4F12" },
      { name: "Jerusalem — arrest", chapter: 21, note: "Bound for Rome via appeal", color: "#6B4F12" },
    ],
  },
  {
    label: "Voyage to Rome",
    chapterRange: "27–28",
    color: "#4A3510",
    stops: [
      { name: "Caesarea", chapter: 27, note: "Sailing", color: "#4A3510" },
      { name: "Crete (Fair Havens)", chapter: 27, note: "Storm warning", color: "#4A3510" },
      { name: "Malta (shipwreck)", chapter: 28, note: "Viper, healings", color: "#4A3510" },
      { name: "Rome", chapter: 28, note: "Two years, unhindered", color: "#4A3510" },
    ],
  },
];

export default function ActsJourneyMap({ data }: { data: BookHubData }) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-14 border-y border-[#1E2028]">
      <h2 className="text-center font-[family-name:var(--font-cinzel)] text-[#C9A227] text-xl tracking-[0.2em] uppercase mb-2">
        Acts 1:8 — Geographic Program
      </h2>
      <p className="text-center text-[#9CA3AF] text-sm mb-10 font-[family-name:var(--font-inter)]">
        Jerusalem → Judea &amp; Samaria → the ends of the earth. Four distinct
        journeys carry the witness across the Mediterranean.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-10">
        <ConcentricRing label="Jerusalem" chapterRange="1–7" meta={data.meta.slug} chapter={1} color="#C9A227" />
        <ConcentricRing label="Judea &amp; Samaria" chapterRange="8–12" meta={data.meta.slug} chapter={8} color="#8B6F1A" />
        <ConcentricRing label="Ends of the earth" chapterRange="13–28" meta={data.meta.slug} chapter={13} color="#6B4F12" />
      </div>

      <div className="space-y-5">
        {JOURNEYS.map((j) => (
          <div key={j.label}>
            <div className="flex items-baseline gap-3 mb-2">
              <span
                aria-hidden
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: j.color }}
              />
              <h3 className="text-[#F0EDE8] text-sm font-semibold font-[family-name:var(--font-inter)]">
                {j.label}
              </h3>
              <span className="text-[#6B7280] text-xs font-[family-name:var(--font-inter)]">
                {j.chapterRange}
              </span>
            </div>
            <ol className="flex flex-wrap gap-2 pl-6">
              {j.stops.map((s) => (
                <li key={`${j.label}-${s.name}`}>
                  <Link
                    href={`/read/${data.meta.slug}/${s.chapter}`}
                    className="inline-flex items-baseline gap-2 rounded border border-[#1E2028] bg-[#0F1117] px-3 py-1.5 hover:border-[#C9A227] transition-colors"
                  >
                    <span className="text-[#E5E7EB] text-xs font-semibold font-[family-name:var(--font-inter)]">
                      {s.name}
                    </span>
                    <span className="text-[#6B7280] text-[0.65rem] font-[family-name:var(--font-inter)]">
                      {s.note}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}

function ConcentricRing({
  label,
  chapterRange,
  meta,
  chapter,
  color,
}: {
  label: string;
  chapterRange: string;
  meta: string;
  chapter: number;
  color: string;
}) {
  return (
    <Link
      href={`/read/${meta}/${chapter}`}
      className="group rounded border border-[#1E2028] bg-[#0F1117] p-4 hover:border-[#C9A227] transition-colors"
    >
      <div className="flex items-baseline justify-between mb-2">
        <span
          aria-hidden
          className="inline-block w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="text-[#6B7280] text-xs font-[family-name:var(--font-inter)]">
          {chapterRange}
        </span>
      </div>
      <div
        className="text-[#F0EDE8] text-base font-semibold group-hover:text-[#C9A227] transition-colors font-[family-name:var(--font-inter)]"
        // Using dangerouslySetInnerHTML to render the &amp; entity cleanly.
        dangerouslySetInnerHTML={{ __html: label }}
      />
    </Link>
  );
}
