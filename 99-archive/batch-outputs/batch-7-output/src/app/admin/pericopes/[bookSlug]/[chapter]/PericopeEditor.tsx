"use client";

import { useState } from "react";

type Section = {
  verse_start: number;
  verse_end: number;
  title: string | null;
};

/**
 * Batch 7 — super-admin pericope editor. Add / edit / delete / reorder
 * sections for a chapter. Saves the full set in one PATCH — the API deletes
 * and re-inserts the chapter's rows as a unit so display_order always
 * matches the in-memory order.
 */
export default function PericopeEditor({
  bookSlug,
  chapter,
  initialSections,
}: {
  bookSlug: string;
  chapter: number;
  initialSections: Section[];
}) {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const add = () => {
    const last = sections[sections.length - 1];
    const nextStart = last ? last.verse_end + 1 : 1;
    setSections([
      ...sections,
      { verse_start: nextStart, verse_end: nextStart, title: null },
    ]);
  };
  const update = (idx: number, patch: Partial<Section>) => {
    setSections(sections.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  };
  const remove = (idx: number) => {
    setSections(sections.filter((_, i) => i !== idx));
  };
  const move = (idx: number, delta: -1 | 1) => {
    const next = idx + delta;
    if (next < 0 || next >= sections.length) return;
    const copy = [...sections];
    const [s] = copy.splice(idx, 1);
    copy.splice(next, 0, s);
    setSections(copy);
  };

  const onSave = async () => {
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/pericopes/${bookSlug}/${chapter}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            sections: sections.map((s) => ({
              verse_start: s.verse_start,
              verse_end: s.verse_end,
              title: (s.title ?? "").trim() || null,
            })),
          }),
        },
      );
      if (!res.ok) {
        const j = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(j.error || `HTTP ${res.status}`);
      }
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <ol className="space-y-3 mb-4">
        {sections.map((s, idx) => (
          <li
            key={idx}
            className="rounded border border-[#1E2028] bg-[#0F1117] p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[#6B7280] text-xs font-[family-name:var(--font-inter)]">
                #{idx + 1}
              </span>
              <button
                type="button"
                onClick={() => move(idx, -1)}
                aria-label="Move up"
                disabled={idx === 0}
                className="text-[#9CA3AF] disabled:opacity-40 hover:text-[#F0EDE8] text-sm"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(idx, 1)}
                aria-label="Move down"
                disabled={idx === sections.length - 1}
                className="text-[#9CA3AF] disabled:opacity-40 hover:text-[#F0EDE8] text-sm"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => remove(idx)}
                className="ml-auto text-red-400/80 hover:text-red-400 text-xs font-[family-name:var(--font-inter)]"
              >
                Remove
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <label className="text-[#9CA3AF] text-xs font-[family-name:var(--font-inter)]">
                Verse start
                <input
                  type="number"
                  min={1}
                  value={s.verse_start}
                  onChange={(e) =>
                    update(idx, { verse_start: Number(e.target.value) })
                  }
                  className="mt-1 w-full bg-[#08090C] border border-[#1E2028] rounded px-2 py-1 text-[#F0EDE8] text-sm font-mono"
                />
              </label>
              <label className="text-[#9CA3AF] text-xs font-[family-name:var(--font-inter)]">
                Verse end
                <input
                  type="number"
                  min={s.verse_start}
                  value={s.verse_end}
                  onChange={(e) =>
                    update(idx, { verse_end: Number(e.target.value) })
                  }
                  className="mt-1 w-full bg-[#08090C] border border-[#1E2028] rounded px-2 py-1 text-[#F0EDE8] text-sm font-mono"
                />
              </label>
            </div>
            <label className="block text-[#9CA3AF] text-xs font-[family-name:var(--font-inter)]">
              Title (optional)
              <input
                type="text"
                value={s.title ?? ""}
                onChange={(e) => update(idx, { title: e.target.value })}
                placeholder="Section heading — leave empty for untitled block"
                className="mt-1 w-full bg-[#08090C] border border-[#1E2028] rounded px-2 py-1 text-[#F0EDE8] text-sm"
              />
            </label>
          </li>
        ))}
      </ol>

      <button
        type="button"
        onClick={add}
        className="mb-4 text-[#C9A227] text-sm border border-[#C9A227]/40 hover:border-[#C9A227] hover:bg-[#C9A227]/10 rounded px-3 py-1.5 font-[family-name:var(--font-inter)]"
      >
        + Add section
      </button>

      <div className="flex items-center gap-3 pt-4 border-t border-[#1E2028]">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="bg-[#C9A227] text-black px-5 py-2 rounded text-sm font-semibold disabled:opacity-50 font-[family-name:var(--font-inter)]"
        >
          {saving ? "Saving…" : "Save sections"}
        </button>
        {saved ? (
          <span className="text-[#C9A227] text-xs font-[family-name:var(--font-inter)]">
            Saved.
          </span>
        ) : null}
        {error ? (
          <span className="text-red-400 text-xs font-[family-name:var(--font-inter)]">
            {error}
          </span>
        ) : null}
      </div>
    </div>
  );
}
