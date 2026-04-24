"use client";

import Link from "next/link";

/**
 * Batch 7 — anchor link on Mark + John book hubs that deep-links to the
 * chapter reader where the full TextualEvidencePanel renders.
 */
export default function TextualEvidenceAnchor({
  bookSlug,
}: {
  bookSlug: "mark" | "john";
}) {
  const target =
    bookSlug === "mark"
      ? { href: "/read/mark/16#textual-evidence", chapter: 16, name: "Mark 16:9–20" }
      : { href: "/read/john/21#textual-evidence", chapter: 21, name: "John 21" };

  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <div className="rounded border border-[#1E2028] bg-[#0F1117] p-6">
        <p className="text-[#9CA3AF] text-[0.68rem] tracking-[0.2em] uppercase mb-2 font-[family-name:var(--font-inter)]">
          Textual evidence
        </p>
        <h3 className="text-[#F0EDE8] text-lg font-semibold mb-2 font-[family-name:var(--font-inter)]">
          {bookSlug === "mark"
            ? "On the longer ending of Mark (16:9–20)"
            : "On the integrity of John 21"}
        </h3>
        <p className="text-[#9CA3AF] text-sm leading-relaxed mb-4 font-[family-name:var(--font-serif)]">
          Manuscript census, patristic witnesses, heptatic analysis, and a
          theological integration argument — read the full textual-evidence
          panel in the chapter reader.
        </p>
        <Link
          href={target.href}
          className="text-[#C9A227] text-sm hover:text-white transition-colors font-[family-name:var(--font-inter)]"
        >
          Open the {target.name} panel →
        </Link>
      </div>
    </section>
  );
}
