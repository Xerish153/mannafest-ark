import ReactMarkdown from "react-markdown";
import type { JesusTitle } from "@/lib/titles/types";

/**
 * <TheologicalMeaningSection /> — the weight the title carries.
 * Hidden when body is empty.
 */
export default function TheologicalMeaningSection({
  title,
}: {
  title: JesusTitle;
}) {
  if (!title.theological_meaning_body) return null;
  return (
    <section className="mb-12">
      <h2 className="font-[family-name:var(--font-cinzel)] text-white text-2xl mb-2">
        Theological Meaning
      </h2>
      <p className="text-[var(--text-muted)] text-sm mb-6 font-[family-name:var(--font-inter)]">
        Why the title matters — the weight it carries
      </p>
      <div className="prose prose-invert max-w-3xl text-[var(--text)] font-[family-name:var(--font-source-serif)]">
        <ReactMarkdown>{title.theological_meaning_body}</ReactMarkdown>
      </div>
    </section>
  );
}
