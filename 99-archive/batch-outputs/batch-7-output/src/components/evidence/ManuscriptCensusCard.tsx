import type { ManuscriptCensusData } from "./types";

export default function ManuscriptCensusCard({ data }: { data: ManuscriptCensusData }) {
  return (
    <article className="rounded border border-[#1E2028] bg-[#0F1117] p-5">
      <h3 className="text-[#C9A227] text-xs tracking-[0.2em] uppercase mb-3 font-[family-name:var(--font-inter)]">
        Manuscript census
      </h3>
      <p className="text-[#E5E7EB] text-sm mb-4 leading-relaxed font-[family-name:var(--font-serif)]">
        {data.summary}
      </p>
      <ul className="space-y-2">
        {data.witnesses.map((w) => (
          <li
            key={w.name}
            className="flex items-start gap-3 text-sm font-[family-name:var(--font-inter)]"
          >
            <span
              className={[
                "inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold shrink-0 mt-0.5 uppercase tracking-wider",
                w.contains === "present"
                  ? "bg-[#C9A227]/20 text-[#C9A227] border border-[#C9A227]/40"
                  : w.contains === "absent"
                  ? "bg-[#1E2028] text-[#9CA3AF] border border-[#1E2028]"
                  : "bg-[#8B6F1A]/20 text-[#C9A227] border border-[#8B6F1A]/40",
              ].join(" ")}
            >
              {w.contains}
            </span>
            <div className="min-w-0">
              <div className="text-[#F0EDE8] font-semibold">
                {w.name}
                <span className="text-[#9CA3AF] text-xs font-normal ml-2">
                  ({w.date})
                </span>
              </div>
              {w.note ? (
                <p className="text-[#9CA3AF] text-xs mt-0.5 font-[family-name:var(--font-serif)]">
                  {w.note}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}
