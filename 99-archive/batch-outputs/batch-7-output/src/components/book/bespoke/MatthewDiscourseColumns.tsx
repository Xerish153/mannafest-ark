"use client";

import Link from "next/link";
import type { BookHubData } from "../types";

/**
 * Matthew's five discourses as vertical columns. Annotation thread along
 * the side tracks OT-fulfillment formula highlights.
 */

const DISCOURSES = [
  { n: 1, title: "Sermon on the Mount", chapters: "5–7", startChapter: 5, beats: ["Beatitudes", "Salt & light", "Law fulfilled", "Lord's Prayer"] },
  { n: 2, title: "Mission of the Twelve", chapters: "10", startChapter: 10, beats: ["Sent as sheep", "Cost of confession", "Family division"] },
  { n: 3, title: "Parables of the Kingdom", chapters: "13", startChapter: 13, beats: ["Sower", "Wheat & tares", "Mustard seed", "Leaven", "Treasure", "Pearl", "Net"] },
  { n: 4, title: "Community in the Kingdom", chapters: "18", startChapter: 18, beats: ["Greatness", "Offense", "Lost sheep", "Forgiveness 70×7"] },
  { n: 5, title: "Olivet Discourse", chapters: "24–25", startChapter: 24, beats: ["Signs", "Abomination", "Sheep & goats", "Parousia"] },
] as const;

const OT_FULFILLMENT_HIGHLIGHTS = [
  "Isa 7:14 — born of a virgin (1:22–23)",
  "Mic 5:2 — born in Bethlehem (2:5–6)",
  "Hos 11:1 — out of Egypt (2:15)",
  "Isa 9:1–2 — light in Galilee (4:14–16)",
  "Isa 53:4 — bore our infirmities (8:17)",
  "Zech 9:9 — riding on an ass (21:4–5)",
  "Zech 11:12–13 — thirty pieces (27:9–10)",
];

export default function MatthewDiscourseColumns({ data }: { data: BookHubData }) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-14 border-y border-[#1E2028]">
      <h2 className="text-center font-[family-name:var(--font-cinzel)] text-[#C9A227] text-xl tracking-[0.2em] uppercase mb-2">
        Five Discourses
      </h2>
      <p className="text-center text-[#9CA3AF] text-sm mb-10 font-[family-name:var(--font-inter)]">
        Matthew's narrative is punctuated by five long teaching blocks, each closed with the refrain
        <span className="text-[#F0EDE8] mx-1 italic">“when Jesus had finished these sayings.”</span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {DISCOURSES.map((d) => (
          <Link
            key={d.n}
            href={`/read/${data.meta.slug}/${d.startChapter}`}
            className="group rounded border border-[#1E2028] bg-[#0F1117] p-4 hover:border-[#C9A227] transition-colors"
          >
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-[#C9A227] font-[family-name:var(--font-cinzel)] text-2xl">
                {d.n}
              </span>
              <span className="text-[#6B7280] text-xs font-[family-name:var(--font-inter)]">
                {d.chapters}
              </span>
            </div>
            <h3 className="text-[#F0EDE8] text-sm font-semibold mb-3 group-hover:text-[#C9A227] transition-colors font-[family-name:var(--font-inter)]">
              {d.title}
            </h3>
            <ul className="space-y-1">
              {d.beats.map((b) => (
                <li key={b} className="text-[#9CA3AF] text-xs font-[family-name:var(--font-inter)]">
                  · {b}
                </li>
              ))}
            </ul>
          </Link>
        ))}
      </div>

      <aside className="mt-10 rounded border border-[#1E2028] bg-[#0F1117] p-5">
        <h3 className="text-[#C9A227] text-[0.7rem] tracking-[0.2em] uppercase mb-3 font-[family-name:var(--font-inter)]">
          Fulfillment thread — highlights
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
          {OT_FULFILLMENT_HIGHLIGHTS.map((f) => (
            <li key={f} className="text-[#9CA3AF] text-sm font-[family-name:var(--font-serif)]">
              {f}
            </li>
          ))}
        </ul>
      </aside>
    </section>
  );
}
