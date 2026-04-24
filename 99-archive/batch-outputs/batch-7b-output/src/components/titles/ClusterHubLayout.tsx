import EditorialSlot from "@/components/EditorialSlot";
import type { JesusTitle } from "@/lib/titles/types";
import ClusterVisual from "./ClusterVisual";

/**
 * <ClusterHubLayout /> — /titles cluster hub.
 *
 * Intro paragraph (40–60 words) is authored from PD sources and frames the
 * doctrine of Christ through his titles. The bespoke cluster visual is
 * <ClusterVisual />. Editor's Notes drawer integration lives at layout.tsx
 * level (site-wide) per Vision v2 §4.3.
 */
export default function ClusterHubLayout({
  titles,
}: {
  titles: JesusTitle[];
}) {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <header className="mb-12 max-w-3xl">
        <p className="text-[var(--text-muted)] text-[11px] tracking-[0.2em] uppercase mb-3 font-[family-name:var(--font-inter)]">
          Jesus Titles — the doctrine of Christ through his names
        </p>
        <h1 className="font-[family-name:var(--font-cinzel)] text-white text-4xl md:text-5xl mb-5">
          The names Scripture gives to Jesus
        </h1>
        <p className="text-[var(--text)] text-lg leading-relaxed font-[family-name:var(--font-source-serif)]">
          The names Scripture gives to Jesus are not decorative. Each title —
          Christ, Lamb of God, Son of David, Logos, Immanuel — opens a
          different door into the same person, and the whole counsel of God
          reads more clearly when the doors are read together. What follows is
          the cluster, grouped by the kind of weight each title carries.
        </p>
        <div className="mt-5">
          <EditorialSlot
            id="titles-hub-intro"
            hint="Reflection on which title was the first one that made Jesus feel real to you, and why"
          />
        </div>
      </header>

      <ClusterVisual titles={titles} />
    </main>
  );
}
