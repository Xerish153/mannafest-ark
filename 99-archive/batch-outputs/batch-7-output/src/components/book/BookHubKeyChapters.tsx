"use client";

import Link from "next/link";
import type { BookHubData } from "./types";

export default function BookHubKeyChapters({ data }: { data: BookHubData }) {
  if (data.keyChapters.length === 0) return null;
  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <h2 className="font-[family-name:var(--font-cinzel)] text-2xl text-[#C9A227] mb-6 text-center">
        If you only read a few chapters
      </h2>
      <ul className="divide-y divide-[#1E2028] border border-[#1E2028] rounded bg-[#0F1117]">
        {data.keyChapters.map((kc) => (
          <li key={kc.chapter}>
            <Link
              href={`/read/${data.meta.slug}/${kc.chapter}`}
              className="flex items-baseline gap-4 p-4 hover:bg-[#1E2028] transition-colors group"
            >
              <span className="font-[family-name:var(--font-cinzel)] text-[#C9A227] text-lg w-12 shrink-0">
                {kc.chapter}
              </span>
              <div className="min-w-0">
                <div className="text-[#F0EDE8] text-sm font-semibold group-hover:text-[#C9A227] transition-colors font-[family-name:var(--font-inter)]">
                  {kc.label}
                </div>
                {kc.blurb ? (
                  <div className="text-[#9CA3AF] text-sm mt-1 font-[family-name:var(--font-serif)]">
                    {kc.blurb}
                  </div>
                ) : null}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
