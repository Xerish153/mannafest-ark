"use client";

import Link from "next/link";
import type { BookHubData } from "../types";

const SEVEN_SIGNS = [
  { n: 1, chapter: 2, label: "Water to wine — Cana" },
  { n: 2, chapter: 4, label: "Nobleman's son healed" },
  { n: 3, chapter: 5, label: "Lame man at Bethesda" },
  { n: 4, chapter: 6, label: "Feeding the five thousand" },
  { n: 5, chapter: 6, label: "Walking on the sea" },
  { n: 6, chapter: 9, label: "Blind man born sightless" },
  { n: 7, chapter: 11, label: "Lazarus raised from the dead" },
];

const SEVEN_I_AM = [
  { n: 1, chapter: 6, label: "The bread of life" },
  { n: 2, chapter: 8, label: "The light of the world" },
  { n: 3, chapter: 10, label: "The door" },
  { n: 4, chapter: 10, label: "The good shepherd" },
  { n: 5, chapter: 11, label: "The resurrection, and the life" },
  { n: 6, chapter: 14, label: "The way, the truth, and the life" },
  { n: 7, chapter: 15, label: "The true vine" },
];

export default function JohnPairedSevens({ data }: { data: BookHubData }) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-14 border-y border-[#1E2028]">
      <h2 className="text-center font-[family-name:var(--font-cinzel)] text-[#C9A227] text-xl tracking-[0.2em] uppercase mb-2">
        Seven Signs · Seven ‘I AM’
      </h2>
      <p className="text-center text-[#9CA3AF] text-sm mb-10 font-[family-name:var(--font-inter)]">
        John's architecture: seven signs demonstrating who Jesus is, seven 'I AM' sayings declaring it. Both feed into 20:30–31.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Column title="Seven Signs" items={SEVEN_SIGNS} slug={data.meta.slug} />
        <Column title="Seven ‘I AM’ sayings" items={SEVEN_I_AM} slug={data.meta.slug} />
      </div>

      <div className="mt-10 max-w-3xl mx-auto rounded border border-[#C9A227]/40 bg-[#0F1117] p-6 text-center">
        <p className="text-[#F0EDE8] text-lg leading-relaxed font-[family-name:var(--font-serif)] italic">
          “These are written, that ye might believe that Jesus is the Christ, the Son of God; and that believing ye might have life through his name.”
        </p>
        <p className="text-[#C9A227] text-xs tracking-[0.2em] uppercase mt-3 font-[family-name:var(--font-inter)]">
          John 20:30–31
        </p>
      </div>
    </section>
  );
}

function Column({
  title,
  items,
  slug,
}: {
  title: string;
  items: Array<{ n: number; chapter: number; label: string }>;
  slug: string;
}) {
  return (
    <div>
      <h3 className="text-[#F0EDE8] text-base font-semibold text-center mb-3 font-[family-name:var(--font-inter)]">
        {title}
      </h3>
      <ol className="space-y-2">
        {items.map((i) => (
          <li key={`${title}-${i.n}`}>
            <Link
              href={`/read/${slug}/${i.chapter}`}
              className="group flex items-baseline gap-3 rounded border border-[#1E2028] bg-[#0F1117] px-3 py-2 hover:border-[#C9A227] transition-colors"
            >
              <span className="text-[#C9A227] font-[family-name:var(--font-cinzel)] text-base shrink-0 w-6">
                {i.n}
              </span>
              <span className="flex-1 text-[#E5E7EB] text-sm group-hover:text-[#C9A227] transition-colors font-[family-name:var(--font-inter)]">
                {i.label}
              </span>
              <span className="text-[#6B7280] text-xs font-[family-name:var(--font-inter)]">
                Ch {i.chapter}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
