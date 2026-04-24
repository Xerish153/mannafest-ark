import ReactMarkdown from "react-markdown";
import type { JesusTitle, JesusTitleRef } from "@/lib/titles/types";
import TitleRefList from "./TitleRefList";

/**
 * <OriginSection /> — OT origin body + ot_type refs.
 * Hidden entirely when there is no body AND no refs (no placeholder text).
 */
export default function OriginSection({
  title,
  refs,
}: {
  title: JesusTitle;
  refs: JesusTitleRef[];
}) {
  const otRefs = refs.filter((r) => r.ref_type === "ot_type");
  if (!title.origin_body && otRefs.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="font-[family-name:var(--font-cinzel)] text-white text-2xl mb-2">
        Origin — The Old Testament
      </h2>
      <p className="text-[var(--text-muted)] text-sm mb-6 font-[family-name:var(--font-inter)]">
        The shape of the title before it was spoken over Jesus
      </p>
      {title.origin_body && (
        <div className="prose prose-invert max-w-3xl text-[var(--text)] font-[family-name:var(--font-source-serif)]">
          <ReactMarkdown>{title.origin_body}</ReactMarkdown>
        </div>
      )}
      <TitleRefList refs={otRefs} />
    </section>
  );
}
