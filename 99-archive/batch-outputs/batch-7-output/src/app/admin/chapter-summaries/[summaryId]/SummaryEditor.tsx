"use client";

import { useState } from "react";

export default function SummaryEditor({
  summaryId,
  initialBody,
  initialStatus,
  initialDraftedBy,
}: {
  summaryId: number;
  initialBody: string;
  initialStatus: "draft" | "published";
  initialDraftedBy: string;
}) {
  const [body, setBody] = useState(initialBody);
  const [status, setStatus] = useState<"draft" | "published">(initialStatus);
  const [draftedBy, setDraftedBy] = useState(initialDraftedBy);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSave = async () => {
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const res = await fetch(`/api/admin/chapter-summaries/${summaryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          body: body.trim() || null,
          status,
          drafted_by: draftedBy.trim() || null,
        }),
      });
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

  const wordCount = body
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-[#9CA3AF] text-xs tracking-[0.2em] uppercase mb-2 font-[family-name:var(--font-inter)]">
          Body (markdown / plain text)
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={12}
          className="w-full bg-[#0F1117] border border-[#1E2028] rounded p-3 text-[#F0EDE8] text-sm leading-relaxed font-[family-name:var(--font-serif)] focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
        />
        <p className="mt-1 text-[#6B7280] text-xs font-[family-name:var(--font-inter)]">
          {wordCount} word{wordCount === 1 ? "" : "s"} · target 80–120
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="text-[#9CA3AF] text-sm font-[family-name:var(--font-inter)]">
          Status:
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "draft" | "published")}
            className="ml-2 bg-transparent text-[#F0EDE8] border border-[#1E2028] rounded px-2 py-1"
          >
            <option value="draft" className="bg-[#0F1117]">Draft</option>
            <option value="published" className="bg-[#0F1117]">Published</option>
          </select>
        </label>
        <label className="text-[#9CA3AF] text-sm font-[family-name:var(--font-inter)] flex items-center gap-2">
          drafted_by:
          <input
            type="text"
            value={draftedBy}
            onChange={(e) => setDraftedBy(e.target.value)}
            placeholder="ai, pastor_marc, ai+pastor_marc"
            className="bg-transparent text-[#F0EDE8] border border-[#1E2028] rounded px-2 py-1 text-xs"
          />
        </label>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-[#1E2028]">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="bg-[#C9A227] text-black px-5 py-2 rounded text-sm font-semibold disabled:opacity-50 font-[family-name:var(--font-inter)]"
        >
          {saving ? "Saving…" : "Save"}
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
