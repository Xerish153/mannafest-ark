"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * <OverrideEditor /> — client-side reorder UI for a verse's cross-references.
 *
 * Reorder model: an array of edges, ordered as the founder wants them to
 * appear on the public verse page. Moves mark the moved row as
 * founder_override=true and reassign display_rank to its new position
 * (1-based). "Reset to auto" flips founder_override=false; display_rank
 * keeps its last value (auto rows with no signal sort below any pins, per
 * resolveRankedList).
 *
 * On save: PATCH /api/admin/cross-references/[verseId] with the full
 * ordered list. Server-side validates super-admin, performs row-level
 * updates via service-role client.
 */

export type EditorEdge = {
  edge_id: number;
  display_rank: number | null;
  founder_override: boolean;
  direction: "outgoing" | "incoming";
  relationship_type: string;
  other_book_id: number;
  other_chapter: number;
  other_verse: number;
  other_book_name: string;
  other_book_abbr: string;
};

export default function OverrideEditor({
  verseNodeId,
  initial,
}: {
  verseNodeId: number;
  initial: EditorEdge[];
}) {
  const router = useRouter();
  const [rows, setRows] = useState<EditorEdge[]>(initial);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function moveUp(i: number) {
    if (i <= 0) return;
    const next = rows.slice();
    const [row] = next.splice(i, 1);
    next.splice(i - 1, 0, { ...row, founder_override: true });
    setRows(next);
    setDirty(true);
  }
  function moveDown(i: number) {
    if (i >= rows.length - 1) return;
    const next = rows.slice();
    const [row] = next.splice(i, 1);
    next.splice(i + 1, 0, { ...row, founder_override: true });
    setRows(next);
    setDirty(true);
  }
  function resetRow(i: number) {
    const next = rows.slice();
    next[i] = { ...next[i], founder_override: false };
    setRows(next);
    setDirty(true);
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        updates: rows.map((r, idx) => ({
          edge_id: r.edge_id,
          display_rank: idx + 1,
          founder_override: r.founder_override,
        })),
      };
      const res = await fetch(`/api/admin/cross-references/${verseNodeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`${res.status} ${res.statusText}${text ? `: ${text}` : ""}`);
      }
      setDirty(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <button
          type="button"
          onClick={save}
          disabled={!dirty || saving}
          className="px-4 py-2 text-sm font-semibold rounded bg-[#C9A227] text-[#08090C] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#8B6F1A] transition-colors"
        >
          {saving ? "Saving…" : "Save order"}
        </button>
        <span className="text-xs text-[#9CA3AF] font-[family-name:var(--font-inter)]">
          {dirty ? "Unsaved changes" : "No pending changes"}
        </span>
        {error && (
          <span className="text-xs text-red-400 font-[family-name:var(--font-inter)]">
            {error}
          </span>
        )}
      </div>

      <ol className="space-y-1 font-[family-name:var(--font-inter)]">
        {rows.map((r, i) => (
          <li
            key={r.edge_id}
            className="flex items-center gap-3 px-3 py-2 bg-[#08090C] border border-[#1E2028] rounded"
          >
            <span className="w-8 text-center text-[#6B7280] text-xs tabular-nums">
              {i + 1}
            </span>
            <span className="flex-1 min-w-0 truncate text-white text-sm">
              {r.other_book_name} {r.other_chapter}:{r.other_verse}
              <span className="ml-2 text-[10px] uppercase tracking-[0.2em] text-[#6B7280]">
                {r.direction === "outgoing" ? "→" : "←"} {r.relationship_type}
              </span>
            </span>
            {r.founder_override && (
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#C9A227]">
                Pinned
              </span>
            )}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => moveUp(i)}
                disabled={i === 0}
                className="w-7 h-7 text-xs rounded bg-[#0F1117] border border-[#1E2028] text-[#F0EDE8] hover:border-[#C9A227] disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Move up"
                title="Move up"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => moveDown(i)}
                disabled={i === rows.length - 1}
                className="w-7 h-7 text-xs rounded bg-[#0F1117] border border-[#1E2028] text-[#F0EDE8] hover:border-[#C9A227] disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Move down"
                title="Move down"
              >
                ▼
              </button>
              <button
                type="button"
                onClick={() => resetRow(i)}
                disabled={!r.founder_override}
                className="px-2 h-7 text-[10px] uppercase tracking-[0.15em] rounded bg-[#0F1117] border border-[#1E2028] text-[#9CA3AF] hover:border-[#C9A227] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                title="Reset to auto"
              >
                Reset
              </button>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
