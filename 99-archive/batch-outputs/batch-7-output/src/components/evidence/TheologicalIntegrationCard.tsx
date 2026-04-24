import type { IntegrationPoint } from "./types";

export default function TheologicalIntegrationCard({
  points,
}: {
  points: IntegrationPoint[];
}) {
  if (points.length === 0) return null;
  return (
    <article className="rounded border border-[#1E2028] bg-[#0F1117] p-5">
      <h3 className="text-[#C9A227] text-xs tracking-[0.2em] uppercase mb-3 font-[family-name:var(--font-inter)]">
        Theological integration
      </h3>
      <ul className="space-y-3">
        {points.map((p) => (
          <li key={p.heading}>
            <h4 className="text-[#F0EDE8] text-sm font-semibold mb-1 font-[family-name:var(--font-inter)]">
              {p.heading}
            </h4>
            <p className="text-[#9CA3AF] text-sm leading-relaxed font-[family-name:var(--font-serif)]">
              {p.body}
            </p>
          </li>
        ))}
      </ul>
    </article>
  );
}
