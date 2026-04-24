import Link from "next/link";
import type { JesusTitleRef } from "@/lib/titles/types";

/**
 * Shared render for ref lists in OriginSection + DeclarationSection.
 * One row per ref; links to the verse page. Note appended when present.
 */
export default function TitleRefList({ refs }: { refs: JesusTitleRef[] }) {
  if (refs.length === 0) return null;
  return (
    <ul className="mt-6 space-y-2">
      {refs.map((r) => {
        const bookSlug = slugifyBook(r.book?.name ?? "");
        const href =
          r.verse_end && r.verse_end !== r.verse_start
            ? `/verse/${bookSlug}/${r.chapter}/${r.verse_start}`
            : `/verse/${bookSlug}/${r.chapter}/${r.verse_start}`;
        const refLabel = formatRefLabel(r);
        return (
          <li
            key={r.id}
            className="list-none flex flex-col gap-0.5 md:flex-row md:items-baseline md:gap-4"
          >
            <Link
              href={href}
              className="text-[#C9A227] hover:underline font-[family-name:var(--font-cinzel)] text-sm shrink-0"
            >
              {refLabel}
            </Link>
            {r.note && (
              <span className="text-[var(--text-muted)] text-sm font-[family-name:var(--font-source-serif)]">
                — {r.note}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function formatRefLabel(r: JesusTitleRef): string {
  const bookName = r.book?.name ?? "?";
  const range =
    r.verse_end && r.verse_end !== r.verse_start
      ? `${r.verse_start}–${r.verse_end}`
      : `${r.verse_start}`;
  return `${bookName} ${r.chapter}:${range}`;
}

function slugifyBook(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}
