import Link from "next/link";
import {
  loadRelatedTitlesInGroup,
  loadCrossFeaturePages,
} from "@/lib/titles/loader";
import type {
  JesusTitle,
  JesusTitleRef,
  JesusTitleClusterGroup,
} from "@/lib/titles/types";

/**
 * <TitleCrossLinks /> — cross-link grid at the bottom of a title page.
 * Two panels: related titles in the same cluster_group, and feature pages
 * whose verse anchors overlap with this title's refs.
 *
 * Empty panels are hidden rather than shown as placeholders.
 */
export default async function TitleCrossLinks({
  title,
  refs,
}: {
  title: JesusTitle;
  refs: JesusTitleRef[];
}) {
  const group = (title.cluster_group ?? "") as Exclude<
    JesusTitleClusterGroup,
    null
  > | "";

  const [related, features] = await Promise.all([
    group
      ? loadRelatedTitlesInGroup(group, title.slug)
      : Promise.resolve([] as JesusTitle[]),
    loadCrossFeaturePages(refs),
  ]);

  if (related.length === 0 && features.length === 0) return null;

  return (
    <section className="mt-16 border-t border-[var(--border)] pt-10">
      <h2 className="font-[family-name:var(--font-cinzel)] text-white text-xl mb-6">
        Follow the thread
      </h2>

      {related.length > 0 && (
        <div className="mb-10">
          <p className="text-[var(--text-muted)] text-[11px] tracking-[0.2em] uppercase mb-4 font-[family-name:var(--font-inter)]">
            Related titles
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {related.map((r) => (
              <li key={r.id} className="list-none">
                <Link
                  href={`/title/${r.slug}`}
                  className="block bg-[var(--surface)] border border-[var(--border)] rounded px-4 py-3 hover:border-[#C9A227] transition-colors"
                >
                  <div className="font-[family-name:var(--font-cinzel)] text-white text-sm">
                    {r.name}
                  </div>
                  {r.summary && (
                    <p className="mt-1 text-xs text-[var(--text-muted)] font-[family-name:var(--font-inter)] line-clamp-2">
                      {r.summary}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {features.length > 0 && (
        <div>
          <p className="text-[var(--text-muted)] text-[11px] tracking-[0.2em] uppercase mb-4 font-[family-name:var(--font-inter)]">
            Feature pages sharing this thread
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {features.map((f) => (
              <li key={f.slug} className="list-none">
                <Link
                  href={f.href}
                  className="block bg-[var(--surface)] border border-[var(--border)] rounded px-4 py-3 hover:border-[#C9A227] transition-colors"
                >
                  <div className="font-[family-name:var(--font-cinzel)] text-white text-sm">
                    {f.title}
                  </div>
                  {f.note && (
                    <p className="mt-1 text-xs text-[var(--text-muted)] font-[family-name:var(--font-inter)] line-clamp-2">
                      {f.note}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
