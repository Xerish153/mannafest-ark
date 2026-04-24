import type { HeptaticAnalysisData } from "./types";

export default function HeptaticAnalysisCard({ data }: { data: HeptaticAnalysisData }) {
  return (
    <article className="rounded border border-[#1E2028] bg-[#0F1117] p-5">
      <h3 className="text-[#C9A227] text-xs tracking-[0.2em] uppercase mb-3 font-[family-name:var(--font-inter)]">
        Heptatic analysis
      </h3>
      <div className="space-y-2 mb-3">
        {data.items.map((i) => (
          <div
            key={i.label}
            className="flex items-baseline justify-between gap-4 border-b border-[#1E2028]/60 pb-1 last:border-b-0 last:pb-0"
          >
            <span className="text-[#9CA3AF] text-sm font-[family-name:var(--font-serif)]">
              {i.label}
            </span>
            <span className="text-[#F0EDE8] text-sm font-mono">{i.value}</span>
          </div>
        ))}
      </div>
      {data.note ? (
        <p className="text-[#9CA3AF] text-xs leading-relaxed font-[family-name:var(--font-serif)]">
          {data.note}
        </p>
      ) : null}
      <p className="text-[#6B7280] text-[11px] mt-3 font-[family-name:var(--font-inter)] italic">
        Source: {data.source}
      </p>
    </article>
  );
}
