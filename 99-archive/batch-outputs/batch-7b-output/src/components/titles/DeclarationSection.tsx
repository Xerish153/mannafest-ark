import ReactMarkdown from "react-markdown";
import type { JesusTitle, JesusTitleRef } from "@/lib/titles/types";
import TitleRefList from "./TitleRefList";

/**
 * <DeclarationSection /> — NT declaration body +
 * nt_declaration / nt_fulfillment / eschatological refs.
 * Hidden when nothing to render.
 */
export default function DeclarationSection({
  title,
  refs,
}: {
  title: JesusTitle;
  refs: JesusTitleRef[];
}) {
  const ntRefs = refs.filter(
    (r) =>
      r.ref_type === "nt_declaration" ||
      r.ref_type === "nt_fulfillment" ||
      r.ref_type === "eschatological",
  );
  if (!title.declaration_body && ntRefs.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="font-[family-name:var(--font-cinzel)] text-white text-2xl mb-2">
        Declaration — The New Testament
      </h2>
      <p className="text-[var(--text-muted)] text-sm mb-6 font-[family-name:var(--font-inter)]">
        How the apostolic writers use the title
      </p>
      {title.declaration_body && (
        <div className="prose prose-invert max-w-3xl text-[var(--text)] font-[family-name:var(--font-source-serif)]">
          <ReactMarkdown>{title.declaration_body}</ReactMarkdown>
        </div>
      )}
      <TitleRefList refs={ntRefs} />
    </section>
  );
}
