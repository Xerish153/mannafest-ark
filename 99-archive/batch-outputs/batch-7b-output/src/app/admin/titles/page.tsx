import Link from "next/link";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

/**
 * /admin/titles — super-admin index listing all 17 Jesus titles.
 *
 * Gated via the admin layout's requireAdmin() call. Service-client read
 * bypasses RLS so both draft and published rows are visible here.
 */

export const metadata = {
  title: "Jesus Titles — MannaFest Admin",
  robots: { index: false, follow: false },
};

type Row = {
  id: number;
  slug: string;
  name: string;
  status: "draft" | "published";
  cluster_group: string | null;
  display_order: number;
};

export default async function AdminTitlesIndex() {
  const admin = createSupabaseServiceClient();
  const { data } = await admin
    .from("jesus_titles")
    .select("id, slug, name, status, cluster_group, display_order")
    .order("display_order", { ascending: true });
  const rows = (data ?? []) as unknown as Row[];

  return (
    <div className="space-y-8">
      <header>
        <div className="text-[#C9A227] text-[11px] tracking-[0.2em] uppercase mb-2 font-[family-name:var(--font-inter)]">
          Jesus Titles
        </div>
        <h1 className="font-[family-name:var(--font-cinzel)] text-white text-3xl mb-1">
          Titles of Christ
        </h1>
        <p className="text-[#9CA3AF] text-sm font-[family-name:var(--font-inter)]">
          {rows.length} title{rows.length === 1 ? "" : "s"} — click to edit.
        </p>
      </header>

      <ul className="divide-y divide-[#1E2028]">
        {rows.map((r) => (
          <li key={r.id} className="py-3">
            <Link
              href={`/admin/titles/${r.slug}`}
              className="flex items-baseline gap-4 hover:text-[#C9A227] transition-colors"
            >
              <span className="text-[#6B7280] text-xs w-8 shrink-0 font-[family-name:var(--font-inter)]">
                {r.display_order}
              </span>
              <span className="font-[family-name:var(--font-cinzel)] text-white flex-1">
                {r.name}
              </span>
              {r.cluster_group && (
                <span className="text-[#6B7280] text-xs font-[family-name:var(--font-inter)]">
                  {r.cluster_group}
                </span>
              )}
              <span
                className={[
                  "text-xs font-[family-name:var(--font-inter)] shrink-0",
                  r.status === "published"
                    ? "text-emerald-400"
                    : "text-amber-400",
                ].join(" ")}
              >
                {r.status}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
