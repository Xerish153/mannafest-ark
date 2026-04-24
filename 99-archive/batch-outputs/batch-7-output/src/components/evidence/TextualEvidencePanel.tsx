import ManuscriptCensusCard from "./ManuscriptCensusCard";
import HeptaticAnalysisCard from "./HeptaticAnalysisCard";
import PatristicWitnessCard from "./PatristicWitnessCard";
import TheologicalIntegrationCard from "./TheologicalIntegrationCard";
import type { TextualEvidenceData } from "./types";

/**
 * Batch 7 — Textual-evidence panel. Renders at top of sectioned-layer
 * reader for Mark 16 + John 21 this batch; deep-linkable via
 * #textual-evidence.
 */
export default function TextualEvidencePanel({
  data,
}: {
  data: TextualEvidenceData;
}) {
  const anchor = data.anchorId ?? "textual-evidence";

  return (
    <section
      id={anchor}
      className="max-w-5xl mx-auto px-4 py-10 scroll-mt-24"
    >
      <header className="mb-6 border-b border-[#1E2028] pb-4">
        <div className="flex flex-wrap items-baseline gap-3 mb-2">
          <h2 className="font-[family-name:var(--font-cinzel)] text-2xl text-[#F0EDE8]">
            Textual evidence — {data.passageTitle}
          </h2>
          <VerdictBadge verdict={data.verdict} />
        </div>
        <p className="text-[#9CA3AF] text-sm leading-relaxed font-[family-name:var(--font-serif)]">
          {data.executiveSummary}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ManuscriptCensusCard data={data.manuscriptCensus} />
        {data.heptaticAnalysis ? (
          <HeptaticAnalysisCard data={data.heptaticAnalysis} />
        ) : null}
        {data.patristicWitnesses && data.patristicWitnesses.length > 0 ? (
          <PatristicWitnessCard citations={data.patristicWitnesses} />
        ) : null}
        <TheologicalIntegrationCard points={data.theologicalIntegration} />
      </div>

      <footer className="mt-8 pt-4 border-t border-[#1E2028]">
        <h3 className="text-[#9CA3AF] text-[0.68rem] tracking-[0.2em] uppercase mb-2 font-[family-name:var(--font-inter)]">
          Sources
        </h3>
        <ul className="text-sm text-[#9CA3AF] space-y-1 font-[family-name:var(--font-serif)]">
          {data.sources.map((s) => (
            <li key={`${s.author}-${s.title}-${s.year}`}>
              <span className="text-[#F0EDE8]">{s.author}</span>, <i>{s.title}</i>{" "}
              <span className="text-[#6B7280]">({s.year})</span>
              {s.note ? <span className="text-[#6B7280]"> — {s.note}</span> : null}
            </li>
          ))}
        </ul>
      </footer>
    </section>
  );
}

function VerdictBadge({ verdict }: { verdict: TextualEvidenceData["verdict"] }) {
  const style =
    verdict === "Authentic"
      ? "bg-[#C9A227]/20 text-[#C9A227] border-[#C9A227]/40"
      : verdict === "Disputed"
      ? "bg-[#8B6F1A]/20 text-[#C9A227] border-[#8B6F1A]/40"
      : "bg-[#1E2028] text-[#9CA3AF] border-[#1E2028]";
  return (
    <span
      className={`inline-block px-2 py-1 rounded text-[10px] uppercase tracking-[0.2em] border font-[family-name:var(--font-inter)] ${style}`}
    >
      Verdict: {verdict}
    </span>
  );
}
