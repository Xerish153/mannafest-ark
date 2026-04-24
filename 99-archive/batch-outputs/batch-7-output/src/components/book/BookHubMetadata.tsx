"use client";

import type { BookHubData } from "./types";

export default function BookHubMetadata({ data }: { data: BookHubData }) {
  const rows: Array<[string, string | null]> = [
    ["Author", data.metadata.author],
    ["Date", data.metadata.date],
    ["Audience", data.metadata.audience],
    ["Position", data.metadata.canonicalPosition],
  ];
  return (
    <section className="max-w-3xl mx-auto px-4 py-8 border-y border-[#1E2028]">
      <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3 text-sm font-[family-name:var(--font-inter)]">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className="text-[#9CA3AF] text-[0.65rem] tracking-[0.2em] uppercase">
              {k}
            </dt>
            <dd className="text-[#F0EDE8] mt-1">{v ?? "—"}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
