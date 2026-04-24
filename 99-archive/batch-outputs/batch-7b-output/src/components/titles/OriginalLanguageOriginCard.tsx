import type { JesusTitle } from "@/lib/titles/types";

/**
 * <OriginalLanguageOriginCard /> — renders the Hebrew/Greek/Aramaic original
 * + transliteration + pronunciation in a dedicated card. Only rendered when
 * the title has original-language data. Null otherwise per "hide empty
 * sections; no placeholder text" rule.
 */
export default function OriginalLanguageOriginCard({
  title,
}: {
  title: JesusTitle;
}) {
  if (!title.original_text && !title.transliteration) return null;

  const languageLabel =
    title.original_language === "hebrew"
      ? "Hebrew"
      : title.original_language === "greek"
      ? "Greek"
      : title.original_language === "aramaic"
      ? "Aramaic"
      : null;

  return (
    <aside className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6 mb-10">
      {languageLabel && (
        <p className="text-[#C9A227] text-[11px] tracking-[0.2em] uppercase mb-3 font-[family-name:var(--font-inter)]">
          Original · {languageLabel}
        </p>
      )}
      <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:gap-6">
        {title.original_text && (
          <span className="font-[family-name:var(--font-sbl-biblit)] text-white text-3xl md:text-4xl">
            {title.original_text}
          </span>
        )}
        <div className="flex flex-col gap-1">
          {title.transliteration && (
            <span className="text-[var(--text)] text-base italic font-[family-name:var(--font-inter)]">
              {title.transliteration}
            </span>
          )}
          {title.pronunciation && (
            <span className="text-[var(--text-muted)] text-sm font-[family-name:var(--font-inter)]">
              {title.pronunciation}
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}
