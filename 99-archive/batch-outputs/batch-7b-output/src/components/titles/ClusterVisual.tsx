import {
  CLUSTER_GROUP_LABELS,
  CLUSTER_GROUP_ORDER,
  type JesusTitle,
  type JesusTitleClusterGroup,
} from "@/lib/titles/types";
import TitleTileCard from "./TitleTileCard";

/**
 * <ClusterVisual /> — grouped-grid visual for /titles.
 *
 * Approach: each cluster_group is a labeled row. On mobile rows stack; on
 * desktop each row is a responsive 2–5 column grid based on how many
 * titles the group holds. Paper/ink palette, no external graphics.
 *
 * Titles with null cluster_group drift into a trailing "Other" row (rare —
 * expected only if admin adds a title without grouping).
 */
export default function ClusterVisual({ titles }: { titles: JesusTitle[] }) {
  const byGroup = new Map<
    Exclude<JesusTitleClusterGroup, null> | "other",
    JesusTitle[]
  >();
  for (const g of CLUSTER_GROUP_ORDER) byGroup.set(g, []);
  byGroup.set("other", []);
  for (const t of titles) {
    const key = (t.cluster_group ??
      "other") as Exclude<JesusTitleClusterGroup, null> | "other";
    if (!byGroup.has(key)) byGroup.set("other", [...(byGroup.get("other") ?? []), t]);
    else byGroup.get(key)!.push(t);
  }

  return (
    <div className="space-y-12">
      {[...CLUSTER_GROUP_ORDER, "other" as const].map((group) => {
        const items = byGroup.get(group) ?? [];
        if (items.length === 0) return null;
        const label =
          group === "other"
            ? "Other"
            : CLUSTER_GROUP_LABELS[group as Exclude<JesusTitleClusterGroup, null>];
        return (
          <section key={group}>
            <header className="flex items-baseline justify-between gap-4 mb-5 border-b border-[var(--border)] pb-2">
              <h2 className="font-[family-name:var(--font-cinzel)] text-white text-lg">
                {label}
              </h2>
              <span className="text-[var(--text-muted)] text-xs font-[family-name:var(--font-inter)]">
                {items.length} title{items.length === 1 ? "" : "s"}
              </span>
            </header>
            <div
              className={[
                "grid gap-4",
                items.length <= 2
                  ? "grid-cols-1 sm:grid-cols-2"
                  : items.length === 3
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
              ].join(" ")}
            >
              {items.map((t) => (
                <TitleTileCard key={t.id} title={t} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
