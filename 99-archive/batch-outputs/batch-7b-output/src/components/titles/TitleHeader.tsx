import type { JesusTitle } from "@/lib/titles/types";

/**
 * <TitleHeader /> — top of /title/[slug].
 * Displays the title name, optional original-language chip, and summary.
 */
export default function TitleHeader({ title }: { title: JesusTitle }) {
  return (
    <header className="mb-10">
      {title.cluster_group && (
        <p className="text-[var(--text-muted)] text-[11px] tracking-[0.2em] uppercase mb-3 font-[family-name:var(--font-inter)]">
          Title of Christ — {title.cluster_group.replace(/-|_/g, " ")}
        </p>
      )}
      <h1 className="font-[family-name:var(--font-cinzel)] text-white text-4xl md:text-5xl mb-4">
        {title.name}
      </h1>
      {title.original_text && (
        <div className="mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-[family-name:var(--font-sbl-biblit)] text-[#C9A227] text-2xl md:text-3xl">
            {title.original_text}
          </span>
          {title.transliteration && (
            <span className="text-[var(--text-muted)] text-sm italic font-[family-name:var(--font-inter)]">
              {title.transliteration}
            </span>
          )}
          {title.pronunciation && (
            <span className="text-[#6B7280] text-xs font-[family-name:var(--font-inter)]">
              · {title.pronunciation}
            </span>
          )}
        </div>
      )}
      {title.summary && (
        <p className="text-[var(--text)] text-lg leading-relaxed max-w-3xl font-[family-name:var(--font-source-serif)]">
          {title.summary}
        </p>
      )}
    </header>
  );
}
