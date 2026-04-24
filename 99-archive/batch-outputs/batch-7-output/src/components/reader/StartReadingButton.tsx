"use client";

import Link from "next/link";
import type { BookSlug } from "@/lib/bible/book-slugs";

/**
 * Batch 7 — the shared "Start Reading →" CTA. Routes to /read/:book/1 for
 * the book's first chapter. Used on book hubs and in the verse-page
 * overflow menu (for Gospel-range verses initially; broader coverage later).
 */
export default function StartReadingButton({
  bookSlug,
  variant = "primary",
  label = "Start Reading",
  className,
}: {
  bookSlug: BookSlug;
  variant?: "primary" | "ghost";
  label?: string;
  className?: string;
}) {
  const base =
    "inline-flex items-center gap-2 px-5 py-2.5 rounded text-sm font-semibold font-[family-name:var(--font-inter)] transition-colors focus:outline-none focus:ring-1 focus:ring-[#C9A227]";
  const themed =
    variant === "primary"
      ? "bg-[#C9A227] text-black hover:bg-[#E0B834]"
      : "text-[#C9A227] border border-[#C9A227]/40 hover:border-[#C9A227] hover:bg-[#C9A227]/10";

  return (
    <Link
      href={`/read/${bookSlug}/1`}
      className={[base, themed, className ?? ""].join(" ").trim()}
    >
      <span>{label}</span>
      <span aria-hidden>→</span>
    </Link>
  );
}
