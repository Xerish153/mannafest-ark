"use client";

import Link from "next/link";
import { useState } from "react";
import { bookBySlug } from "@/lib/bible/book-slugs";
import type { BookGroup } from "@/lib/bible/book-groups";

/**
 * Mobile accordion rendering of a book group.
 * `defaultOpen=true` for Gospels so a mobile visitor lands in the open group.
 */
export default function BookGroupAccordion({
  group,
  defaultOpen = false,
  onNavigate,
}: {
  group: BookGroup;
  defaultOpen?: boolean;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="border-b border-[#1E2028]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between py-3 text-left font-[family-name:var(--font-inter)] focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
      >
        <span className="text-[#F0EDE8] text-base font-semibold">
          {group.label}
        </span>
        <span
          aria-hidden
          className={`text-[#6B7280] transition-transform ${open ? "rotate-90" : ""}`}
        >
          ›
        </span>
      </button>
      {open && (
        <div className="pb-4">
          <Link
            href={`/group/${group.slug}`}
            onClick={onNavigate}
            className="inline-block mb-3 text-[#C9A227] text-xs tracking-[0.2em] uppercase hover:text-white transition-colors"
          >
            View group →
          </Link>
          <ul className="space-y-2 pl-1">
            {group.books.map((slug) => {
              const meta = bookBySlug(slug);
              if (!meta) return null;
              return (
                <li key={slug}>
                  <Link
                    href={`/book/${slug}`}
                    onClick={onNavigate}
                    className="block text-[#9CA3AF] text-sm hover:text-[#F0EDE8] transition-colors"
                  >
                    {meta.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
