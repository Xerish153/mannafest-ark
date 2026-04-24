import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import type { EditorialNote } from "@/lib/supabase/schemas/editorial_notes";

/**
 * /admin/editorial-notes — global editorial-notes admin.
 *
 * Admin layout runs requireAdmin() upstream.
 *
 * Filters (all query-string driven, simple, no client state):
 *  - ?surface_type=route|node
 *  - ?status=published|draft|hidden
 *  - ?q=<search>
 *
 * Sorted by updated_at DESC. Each row: surface · title · status · updated.
 * Per-row actions: Edit, View on page (opens surface), Hide (POSTs).
 */

export const metadata = { title: "Editorial notes — MannaFest" };

type Search = Promise<{ surface_type?: string; status?: string; q?: string }>;

export default async function EditorialNotesAdminPage({
  searchParams,
}: {
  searchParams: Search;
}) {
  const params = await searchParams;
  const surfaceType = params.surface_type;
  const status = params.status;
  const q = params.q;

  let query = supabaseAdmin
    .from("editorial_notes")
    .select()
    .order("updated_at", { ascending: false })
    .limit(200);

  if (surfaceType === "route" || surfaceType === "node") {
    query = query.eq("surface_type", surfaceType);
  }
  if (status === "published" || status === "draft" || status === "hidden") {
    query = query.eq("status", status);
  }
  if (q && q.trim()) {
    const t = q.trim();
    query = query.or(`title.ilike.%${t}%,body_md.ilike.%${t}%`);
  }

  const { data } = await query;
  const notes = (data ?? []) as EditorialNote[];

  return (
    <div className="text-[#E5E7EB] space-y-6">
      <header>
        <h1 className="text-xl font-serif mb-2">Editorial notes</h1>
        <p className="text-sm text-[#9CA3AF]">
          Global list of editor&apos;s notes across every page. Filter by surface
          type, status, or a title/body search.
        </p>
      </header>

      <form
        action="/admin/editorial-notes"
        method="GET"
        className="flex flex-wrap items-center gap-2 rounded border border-[#1F2937] p-3"
      >
        <label className="text-sm">
          <span className="sr-only">Surface type</span>
          <select
            name="surface_type"
            defaultValue={surfaceType ?? ""}
            className="rounded bg-[#0F1218] border border-[#1F2937] px-2 py-1.5 text-sm"
          >
            <option value="">all surfaces</option>
            <option value="route">route</option>
            <option value="node">node</option>
          </select>
        </label>
        <label className="text-sm">
          <span className="sr-only">Status</span>
          <select
            name="status"
            defaultValue={status ?? ""}
            className="rounded bg-[#0F1218] border border-[#1F2937] px-2 py-1.5 text-sm"
          >
            <option value="">all statuses</option>
            <option value="published">published</option>
            <option value="draft">draft</option>
            <option value="hidden">hidden</option>
          </select>
        </label>
        <label className="text-sm flex-1 min-w-[200px]">
          <span className="sr-only">Search</span>
          <input
            name="q"
            defaultValue={q ?? ""}
            placeholder="search title + body…"
            className="w-full rounded bg-[#0F1218] border border-[#1F2937] px-2 py-1.5 text-sm"
          />
        </label>
        <button
          type="submit"
          className="rounded bg-[#C9A227] px-3 py-1.5 text-sm font-medium text-[#08090C]"
        >
          Filter
        </button>
      </form>

      {notes.length === 0 ? (
        <p className="text-sm text-[#9CA3AF]">No notes match these filters.</p>
      ) : (
        <ul className="divide-y divide-[#1F2937] border border-[#1F2937] rounded list-none p-0">
          {notes.map((n) => (
            <li key={n.id} className="flex items-start justify-between gap-3 px-3 py-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs uppercase tracking-wide text-[#9CA3AF]">
                    {n.surface_type}
                  </span>
                  <span className="font-mono text-xs text-[#C9A227] truncate">
                    {n.surface_id}
                  </span>
                  <span
                    className={[
                      "rounded px-1.5 py-0.5 text-[10px] font-medium",
                      n.status === "published"
                        ? "bg-[#1F2937] text-[#E5E7EB]"
                        : n.status === "draft"
                          ? "bg-[#374151] text-[#FCD34D]"
                          : "bg-[#374151] text-[#9CA3AF]",
                    ].join(" ")}
                  >
                    {n.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-sm mt-0.5">
                  {n.title || <em className="text-[#6B7280]">[untitled]</em>}
                </div>
                <div className="text-[11px] text-[#6B7280] mt-0.5">
                  updated {new Date(n.updated_at).toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/admin/editorial-notes/${n.id}/edit`}
                  className="rounded bg-[#C9A227] px-2 py-1 text-xs font-medium text-[#08090C]"
                >
                  Edit
                </Link>
                {n.surface_type === "route" && (
                  <Link
                    href={n.surface_id}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded border border-[#1F2937] bg-[#0F1218] px-2 py-1 text-xs text-[#E5E7EB]"
                  >
                    View page ↗
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
