"use client";

import StartReadingButton from "@/components/reader/StartReadingButton";
import type { BookHubData } from "./types";

export default function BookHubHero({ data }: { data: BookHubData }) {
  return (
    <header className="text-center pt-14 pb-10 px-4">
      <p className="text-[#C9A227] text-xs tracking-[0.3em] uppercase mb-3 font-[family-name:var(--font-inter)]">
        {data.meta.testament === "OT" ? "Old Testament" : "New Testament"}
        {data.meta.orderNum ? ` · Book ${data.meta.orderNum} of 66` : ""}
      </p>
      <h1 className="font-[family-name:var(--font-cinzel)] text-4xl sm:text-5xl text-white mb-4">
        {data.meta.name}
      </h1>
      <p className="text-[#E5E7EB] text-lg leading-relaxed max-w-2xl mx-auto font-[family-name:var(--font-serif)] italic">
        {data.hero.tagline}
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
        {data.hero.statStrip.map((s) => (
          <div key={s.label} className="text-center">
            <div className="font-[family-name:var(--font-cinzel)] text-[#C9A227] text-2xl">
              {s.value}
            </div>
            <div className="text-[#9CA3AF] text-[0.7rem] tracking-[0.2em] uppercase font-[family-name:var(--font-inter)]">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {data.signatureVerse ? (
        <blockquote className="mt-10 max-w-2xl mx-auto border-l-2 border-[#C9A227] pl-6 text-left">
          <p className="text-[#F0EDE8] text-lg sm:text-xl leading-relaxed font-[family-name:var(--font-serif)]">
            “{data.signatureVerse.text}”
          </p>
          <footer className="text-[#C9A227] text-sm mt-3 font-[family-name:var(--font-inter)]">
            — {data.signatureVerse.label}
          </footer>
        </blockquote>
      ) : null}

      <div className="mt-10">
        <StartReadingButton bookSlug={data.meta.slug} />
      </div>
    </header>
  );
}
