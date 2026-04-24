"use client";

import Link from "next/link";
import { BOOKS, bookBySlug } from "@/lib/bible/book-slugs";
import type { BookGroup } from "@/lib/bible/book-groups";

/**
 * Desktop column in the Read the Bible overlay.
 * Header is a link to /group/:slug; chips link to /book/:slug.
 */
export default function BookGroupColumn({
  group,
  onNavigate,
}: {
  group: BookGroup;
  onNavigate: () => void;
}) {
  return (
    <section className="min-w-0">
      <Link
        href={`/group/${group.slug}`}
        onClick={onNavigate}
        className="block mb-3 text-[#C9A227] text-xs tracking-[0.2em] uppercase hover:text-white transition-colors font-[family-name:var(--font-inter)]"
      >
        {group.label} →
      </Link>
      <ul className="space-y-1.5">
        {group.books.map((slug) => {
          const meta = bookBySlug(slug);
          if (!meta) return null;
          return (
            <li key={slug}>
              <Link
                href={`/book/${slug}`}
                onClick={onNavigate}
                className="block text-[#9CA3AF] text-sm hover:text-[#F0EDE8] transition-colors font-[family-name:var(--font-inter)]"
              >
                {meta.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// Re-export so a type-import from the overlay has a single source.
export { BOOKS };
