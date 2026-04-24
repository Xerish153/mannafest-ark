import type { PatristicCitation } from "./types";

export default function PatristicWitnessCard({
  citations,
}: {
  citations: PatristicCitation[];
}) {
  if (citations.length === 0) return null;
  return (
    <article className="rounded border border-[#1E2028] bg-[#0F1117] p-5">
      <h3 className="text-[#C9A227] text-xs tracking-[0.2em] uppercase mb-3 font-[family-name:var(--font-inter)]">
        Patristic witnesses
      </h3>
      <ol className="space-y-3">
        {citations.map((c) => (
          <li key={`${c.father}-${c.work}`} className="text-sm font-[family-name:var(--font-serif)]">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-[#F0EDE8] font-semibold font-[family-name:var(--font-inter)]">
                {c.father}
              </span>
              <span className="text-[#C9A227] text-xs font-[family-name:var(--font-inter)]">
                {c.date}
              </span>
            </div>
            <div className="text-[#9CA3AF] text-xs font-[family-name:var(--font-inter)]">
              {c.work}
              {c.locus ? <span className="ml-1">— {c.locus}</span> : null}
            </div>
            {c.quote ? (
              <blockquote className="mt-1 pl-3 border-l border-[#C9A227]/40 text-[#E5E7EB] italic">
                “{c.quote}”
              </blockquote>
            ) : null}
            {c.note ? (
              <p className="text-[#6B7280] text-xs mt-1 font-[family-name:var(--font-inter)]">
                {c.note}
              </p>
            ) : null}
          </li>
        ))}
      </ol>
    </article>
  );
}
