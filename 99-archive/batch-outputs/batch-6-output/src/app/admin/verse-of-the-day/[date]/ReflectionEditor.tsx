"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

/**
 * <ReflectionEditor /> — client editor for a single-day VOTD.
 *
 * Keeps state local (verse node id, reflection body, status, fallback
 * scholar + quote); on Save, PATCHes /api/admin/votd/[date]. The parent
 * server page re-fetches after the router.refresh() call.
 *
 * Verse picker: for now an integer input for graph_nodes.id — Pastor
 * Marc can look up the id in his scratch notes. A richer search-by-verse
 * picker is a future polish pass; the prompt allows this minimal form.
 * The header on the server page displays the currently-resolved label so
 * he knows what the ID maps to.
 */

export type ScholarOption = {
  id: string;
  name: string;
  tradition_key: string;
};

export default function ReflectionEditor({
  date,
  initialVerseNodeId,
  initialVerseLabel,
  initialBody,
  initialStatus,
  initialFallbackScholarId,
  initialFallbackQuote,
  scholars,
}: {
  date: string;
  initialVerseNodeId: number | null;
  initialVerseLabel: string;
  initialBody: string;
  initialStatus: "draft" | "published";
  initialFallbackScholarId: string | null;
  initialFallbackQuote: string;
  scholars: ScholarOption[];
}) {
  const router = useRouter();
  const [verseNodeId, setVerseNodeId] = useState<number | null>(initialVerseNodeId);
  const [body, setBody] = useState(initialBody);
  const [status, setStatus] = useState<"draft" | "published">(initialStatus);
  const [fallbackScholarId, setFallbackScholarId] = useState<string | null>(initialFallbackScholarId);
  const [fallbackQuote, setFallbackQuote] = useState(initialFallbackQuote);
  const [saving, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function save() {
    setError(null);
    setSaved(false);
    if (verseNodeId == null || !Number.isFinite(verseNodeId)) {
      setError("A valid verse node id is required.");
      return;
    }
    const payload = {
      verse_id: verseNodeId,
      body: body.trim() || null,
      status,
      fallback_scholar_id: fallbackScholarId,
      fallback_quote: fallbackQuote.trim() || null,
    };
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/votd/${date}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`${res.status} ${res.statusText}${text ? `: ${text}` : ""}`);
        }
        setSaved(true);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Save failed");
      }
    });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
      className="bg-[#0F1117] border border-[#1E2028] rounded-lg p-6 space-y-6 font-[family-name:var(--font-inter)]"
    >
      <div>
        <label className="block text-xs uppercase tracking-[0.2em] text-[#9CA3AF] mb-2">
          Verse node id
        </label>
        <input
          type="number"
          value={verseNodeId ?? ""}
          onChange={(e) => {
            const v = e.target.value === "" ? null : parseInt(e.target.value, 10);
            setVerseNodeId(Number.isFinite(v as number) ? (v as number) : null);
          }}
          className="w-full px-3 py-2 rounded bg-[#08090C] border border-[#1E2028] text-white text-sm font-mono"
        />
        {initialVerseLabel && (
          <p className="mt-2 text-xs text-[#6B7280]">
            Current default: {initialVerseLabel}
          </p>
        )}
      </div>

      <div>
        <label className="block text-xs uppercase tracking-[0.2em] text-[#9CA3AF] mb-2">
          Reflection (markdown)
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={10}
          className="w-full px-3 py-2 rounded bg-[#08090C] border border-[#1E2028] text-white text-sm font-[family-name:var(--font-source-serif-4),serif]"
          placeholder={`A short paragraph in the editor's voice. Internal links welcome — [Isaiah 53](/verse/isa/53/1).`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-[#9CA3AF] mb-2">
            Fallback scholar (optional)
          </label>
          <select
            value={fallbackScholarId ?? ""}
            onChange={(e) => setFallbackScholarId(e.target.value || null)}
            className="w-full px-3 py-2 rounded bg-[#08090C] border border-[#1E2028] text-white text-sm"
          >
            <option value="">— none (auto-pick if no reflection) —</option>
            {scholars.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.tradition_key})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-[#9CA3AF] mb-2">
            Fallback quote (optional)
          </label>
          <textarea
            value={fallbackQuote}
            onChange={(e) => setFallbackQuote(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 rounded bg-[#08090C] border border-[#1E2028] text-white text-sm"
            placeholder="≤50 words from the selected scholar"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setStatus("draft")}
            className={[
              "px-3 py-1.5 rounded text-xs uppercase tracking-[0.15em] border",
              status === "draft"
                ? "border-[#C9A227] bg-[#C9A227]/10 text-[#C9A227]"
                : "border-[#1E2028] bg-[#08090C] text-[#9CA3AF] hover:border-[#C9A227]",
            ].join(" ")}
          >
            Draft
          </button>
          <button
            type="button"
            onClick={() => setStatus("published")}
            className={[
              "px-3 py-1.5 rounded text-xs uppercase tracking-[0.15em] border",
              status === "published"
                ? "border-green-400 bg-green-400/10 text-green-400"
                : "border-[#1E2028] bg-[#08090C] text-[#9CA3AF] hover:border-green-400",
            ].join(" ")}
          >
            Published
          </button>
        </div>
        <div className="flex-1" />
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 text-sm font-semibold rounded bg-[#C9A227] text-[#08090C] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#8B6F1A] transition-colors"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        {saved && !error && (
          <span className="text-xs text-green-400">Saved</span>
        )}
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>
    </form>
  );
}
