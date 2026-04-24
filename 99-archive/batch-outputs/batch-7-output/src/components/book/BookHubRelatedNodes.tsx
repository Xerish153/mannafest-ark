"use client";

import Link from "next/link";
import type { BookHubData, RelatedNode } from "./types";

function groupBy(nodes: RelatedNode[]): Record<string, RelatedNode[]> {
  const out: Record<string, RelatedNode[]> = {};
  for (const n of nodes) {
    (out[n.type] ??= []).push(n);
  }
  return out;
}

export default function BookHubRelatedNodes({ data }: { data: BookHubData }) {
  if (data.relatedNodes.length === 0) return null;
  const groups = groupBy(data.relatedNodes);
  const order: RelatedNode["type"][] = [
    "person", "place", "theme", "concept", "prophecy", "topic",
  ];

  return (
    <section className="max-w-5xl mx-auto px-4 py-12 border-t border-[#1E2028]">
      <h2 className="font-[family-name:var(--font-cinzel)] text-xl text-[#C9A227] mb-6 text-center">
        Related
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {order
          .filter((t) => groups[t] && groups[t].length > 0)
          .map((t) => (
            <section key={t}>
              <h3 className="text-[#9CA3AF] text-[0.7rem] tracking-[0.2em] uppercase mb-2 font-[family-name:var(--font-inter)]">
                {labelFor(t)}
              </h3>
              <ul className="space-y-1.5">
                {groups[t].map((n) => (
                  <li key={`${n.type}-${n.id}`}>
                    <Link
                      href={n.href}
                      className="text-[#F0EDE8] text-sm hover:text-[#C9A227] transition-colors font-[family-name:var(--font-inter)]"
                    >
                      {n.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
      </div>
    </section>
  );
}

function labelFor(t: RelatedNode["type"]): string {
  switch (t) {
    case "person": return "People";
    case "place": return "Places";
    case "concept": return "Concepts";
    case "theme": return "Themes";
    case "prophecy": return "Prophecies";
    case "topic": return "Topics";
  }
}
