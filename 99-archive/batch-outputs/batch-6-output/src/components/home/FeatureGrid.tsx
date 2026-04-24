"use client";

import FeatureTile from "./FeatureTile";

/**
 * Homepage feature grid — Batch 6 reshape.
 *
 * Now four tiles (2×2 desktop / stacked mobile). Verse of the Day is no
 * longer a peer tile — Batch 6 promotes it to the homepage lead per
 * Doctrine D layered framing (§4.7 + §6.2). <VotdLayer1Card /> renders
 * the VOTD above this grid on the home page.
 *
 * Previously (Batch 1.5 → Batch 5.5): five tiles with VerseOfDayTile as
 * the 5th. Batch 6 removes VerseOfDayTile from here; the component file
 * is left in the repo but unreferenced so a quick revert is possible.
 */
export default function FeatureGrid() {
  return (
    <section className="px-4 pb-20 sm:pb-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <div className="text-[#C9A227] text-[11px] tracking-[0.25em] uppercase mb-2 font-[family-name:var(--font-inter)]">
            Start exploring
          </div>
          <h2 className="font-[family-name:var(--font-cinzel)] text-white text-2xl sm:text-3xl">
            Four places worth starting.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          <FeatureTile
            href="/study/isaiah-mini-bible"
            title="Isaiah as Mini-Bible"
            subtitle="66 chapters mirror 66 books. The pattern is real."
            visual={<IsaiahMiniBibleVisual />}
          />
          <FeatureTile
            href="/characters/kings"
            title="Kings of Israel and Judah"
            subtitle="Two kingdoms, one God, forty kings."
            visual={<KingsVisual />}
          />
          <FeatureTile
            href="/apologetics"
            title="Apologetics"
            subtitle="Steelmanned arguments, sourced responses."
            visual={<ApologeticsVisual />}
          />
          <FeatureTile
            href="/concordance"
            title="Strong's Concordance"
            subtitle="Every Greek and Hebrew word. Traceable."
            visual={<ConcordanceVisual />}
          />
        </div>
      </div>
    </section>
  );
}

/* Tile visuals preserved from Batch 1.5 — exact same SVG bodies, no
   style changes in Batch 6. Renamed wrappers only so file diffs read
   cleanly as "removed 5th tile". */

function IsaiahMiniBibleVisual() {
  const arcs: Array<{ ly: number; ry: number }> = [
    { ly: 130, ry: 150 }, { ly: 155, ry: 130 }, { ly: 170, ry: 190 },
    { ly: 190, ry: 155 }, { ly: 205, ry: 210 }, { ly: 145, ry: 195 },
    { ly: 215, ry: 140 },
  ];
  const leftX = 110;
  const rightX = 290;
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full" role="img" aria-label="An open Bible with connections arcing from Old Testament to New Testament chapters">
      <path d="M 40 108 Q 120 96 195 108 L 200 232 Q 120 244 40 232 Z" fill="#C9A227" fillOpacity="0.08" stroke="#C9A227" strokeOpacity="0.25" strokeWidth="1" />
      <path d="M 205 108 Q 280 96 360 108 L 360 232 Q 280 244 200 232 Z" fill="#C9A227" fillOpacity="0.08" stroke="#C9A227" strokeOpacity="0.25" strokeWidth="1" />
      <path d="M 200 108 Q 198 170 200 232" stroke="#1E2028" strokeWidth="3" fill="none" strokeLinecap="round" />
      <g stroke="#F0EDE8" strokeOpacity="0.18" strokeWidth="1">
        <line x1="55" y1="118" x2="188" y2="118" /><line x1="55" y1="126" x2="180" y2="126" />
        <line x1="55" y1="134" x2="185" y2="134" /><line x1="55" y1="142" x2="175" y2="142" />
        <line x1="55" y1="150" x2="182" y2="150" /><line x1="212" y1="118" x2="345" y2="118" />
        <line x1="220" y1="126" x2="345" y2="126" /><line x1="215" y1="134" x2="345" y2="134" />
        <line x1="225" y1="142" x2="345" y2="142" /><line x1="218" y1="150" x2="345" y2="150" />
      </g>
      <g stroke="#C9A227" strokeOpacity="0.6" strokeWidth="1.25" fill="none">
        {arcs.map((a, i) => {
          const midX = (leftX + rightX) / 2;
          const lift = 55 + (i % 3) * 18;
          const minY = Math.min(a.ly, a.ry);
          const cpY = minY - lift;
          return (
            <path key={i} d={`M ${leftX} ${a.ly} Q ${midX} ${cpY} ${rightX} ${a.ry}`} strokeLinecap="round" />
          );
        })}
      </g>
      <g fill="#C9A227">
        {arcs.map((a, i) => (
          <g key={`dots-${i}`}>
            <circle cx={leftX} cy={a.ly} r="2" />
            <circle cx={rightX} cy={a.ry} r="2" />
          </g>
        ))}
      </g>
    </svg>
  );
}

function KingsVisual() {
  const israel = [
    { x: 30, w: 55 }, { x: 95, w: 30 }, { x: 135, w: 40 },
    { x: 185, w: 70 }, { x: 265, w: 35 }, { x: 310, w: 55 },
  ];
  const judah = [
    { x: 40, w: 40 }, { x: 90, w: 70 }, { x: 170, w: 35 },
    { x: 215, w: 50 }, { x: 275, w: 40 }, { x: 325, w: 35 },
  ];
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full" aria-hidden>
      <text x="20" y="85" fontFamily="var(--font-inter), sans-serif" fontSize="10" fill="#6B7280" letterSpacing="2">ISRAEL</text>
      <text x="20" y="225" fontFamily="var(--font-inter), sans-serif" fontSize="10" fill="#6B7280" letterSpacing="2">JUDAH</text>
      <g>{israel.map((r, i) => (<rect key={`i${i}`} x={r.x} y={100} width={r.w} height={22} rx={2} fill="#C9A227" fillOpacity={0.55 + (i % 3) * 0.15} />))}</g>
      <g>{judah.map((r, i) => (<rect key={`j${i}`} x={r.x} y={180} width={r.w} height={22} rx={2} fill="#F0EDE8" fillOpacity={0.45 + (i % 3) * 0.15} />))}</g>
      <line x1="20" y1="150" x2="380" y2="150" stroke="#1E2028" strokeWidth="1" />
    </svg>
  );
}

function ApologeticsVisual() {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full" aria-hidden>
      <g>
        <rect x="110" y="60" width="90" height="90" rx="6" fill="#C9A227" fillOpacity="0.85" />
        <rect x="200" y="60" width="90" height="90" rx="6" fill="#F0EDE8" fillOpacity="0.65" />
        <rect x="110" y="150" width="90" height="90" rx="6" fill="#F0EDE8" fillOpacity="0.5" />
        <rect x="200" y="150" width="90" height="90" rx="6" fill="#C9A227" fillOpacity="0.55" />
        <circle cx="200" cy="150" r="24" fill="#08090C" stroke="#C9A227" strokeWidth="2" />
      </g>
      <g fontFamily="var(--font-inter), sans-serif" fontSize="9" fill="#08090C" textAnchor="middle" fontWeight="600" letterSpacing="1">
        <text x="155" y="108">SCIENCE</text><text x="245" y="108" fill="#08090C">MORAL</text>
        <text x="155" y="198">MATH</text><text x="245" y="198">HISTORY</text>
      </g>
    </svg>
  );
}

function ConcordanceVisual() {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full" aria-hidden>
      <text x="120" y="215" fontFamily="'Times New Roman', serif" fontSize="200" fill="#C9A227" fillOpacity="0.9">א</text>
      <text x="220" y="215" fontFamily="var(--font-cinzel), serif" fontSize="170" fontWeight="700" fill="#F0EDE8" fillOpacity="0.8">Α</text>
      <text x="200" y="265" textAnchor="middle" fontFamily="var(--font-inter), sans-serif" fontSize="10" fill="#6B7280" letterSpacing="2">HEBREW · GREEK</text>
    </svg>
  );
}
