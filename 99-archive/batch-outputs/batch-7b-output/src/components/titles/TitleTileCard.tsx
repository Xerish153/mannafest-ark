import Link from "next/link";
import type { JesusTitle } from "@/lib/titles/types";

/**
 * <TitleTileCard /> — single tile on the /titles cluster hub grid.
 */
export default function TitleTileCard({ title }: { title: JesusTitle }) {
  return (
    <Link
      href={`/title/${title.slug}`}
      className="group block bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5 h-full hover:border-[#C9A227] transition-colors"
    >
      <div className="flex flex-col gap-2 h-full">
        <h3 className="font-[family-name:var(--font-cinzel)] text-white text-base group-hover:text-[#C9A227] transition-colors">
          {title.name}
        </h3>
        {title.original_text && (
          <span className="font-[family-name:var(--font-sbl-biblit)] text-[#C9A227] text-lg">
            {title.original_text}
          </span>
        )}
        {title.summary && (
          <p className="text-[var(--text-muted)] text-xs font-[family-name:var(--font-inter)] line-clamp-3 mt-auto">
            {title.summary}
          </p>
        )}
      </div>
    </Link>
  );
}
