"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TraditionChip } from "@/components/Cite/TraditionChip";
import { truncateWords } from "@/components/commentary/FeaturedExcerpt";
import {
  FEATURED_EXCERPT_WORD_CAP,
  wordCount,
} from "@/lib/supabase/schemas/commentaries";

type Entry = {
  id: string;
  author: string;
  source: string;
  commentary_text: string;
  scholar_id: string;
  featured: boolean;
  featured_excerpt: string | null;
  founder_curated: boolean;
  author_type: "sourced" | "founder";
  status: "published" | "hidden";
  curator_note: string | null;
  verse_start: number;
  scholar: {
    id: string;
    slug: string;
    name: string;
    tradition_key: string | null;
    default_rank: number;
    is_founder: boolean;
  };
};

export type CurationPanelProps = {
  entries: Entry[];
  bookName: string;
  chapter: number;
};

export function CurationPanel({ entries }: CurationPanelProps) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [excerptDrafts, setExcerptDrafts] = useState<Record<string, string>>(
    () =>
      Object.fromEntries(
        entries.map((e) => [
          e.id,
          e.featured_excerpt ??
            truncateWords(e.commentary_text, FEATURED_EXCERPT_WORD_CAP),
        ]),
      ),
  );
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>(() =>
    Object.fromEntries(entries.map((e) => [e.id, e.curator_note ?? ""])),
  );

  async function patch(id: string, body: unknown) {
    setBusy(id);
    try {
      const res = await fetch(`/api/commentary/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) router.refresh();
      else window.alert(await res.text());
    } finally {
      setBusy(null);
    }
  }

  return (
    <ul className="space-y-4 list-none p-0">
      {entries.map((entry) => {
        const tradKey = entry.scholar.tradition_key ?? "academic";
        const currentExcerpt = excerptDrafts[entry.id] ?? "";
        const excerptWords = wordCount(currentExcerpt);
        const overCap = excerptWords > FEATURED_EXCERPT_WORD_CAP;
        return (
          <li
            key={entry.id}
            className={[
              "rounded border p-4",
              entry.status === "hidden"
                ? "border-dashed border-[#374151] opacity-60"
                : "border-[#1F2937]",
              entry.featured ? "ring-1 ring-[#C9A227]" : "",
            ].join(" ")}
          >
            <header className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-serif text-[#E5E7EB]">
                    {entry.scholar.name}
                  </span>
                  <TraditionChip tradition={tradKey} size="sm" />
                  {entry.featured && (
                    <span className="rounded bg-[#C9A227] px-1.5 py-0.5 text-[10px] font-medium text-[#08090C]">
                      FEATURED
                    </span>
                  )}
                  {entry.status === "hidden" && (
                    <span className="rounded bg-[#374151] px-1.5 py-0.5 text-[10px] text-[#E5E7EB]">
                      HIDDEN
                    </span>
                  )}
                  {entry.author_type === "founder" && (
                    <span className="rounded bg-[var(--tradition-editor)] px-1.5 py-0.5 text-[10px] font-medium text-white">
                      FOUNDER
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[#6B7280] mt-0.5">
                  verse_start={entry.verse_start} · rank={entry.scholar.default_rank} · {entry.source}
                </div>
              </div>
            </header>

            <details className="mb-3">
              <summary className="cursor-pointer text-[11px] text-[#9CA3AF] hover:text-white">
                Source body ({entry.commentary_text.length.toLocaleString()} chars)
              </summary>
              <pre className="mt-2 max-h-64 overflow-y-auto whitespace-pre-wrap rounded bg-[#0F1218] p-3 font-mono text-xs text-[#9CA3AF]">
                {entry.commentary_text}
              </pre>
            </details>

            <label className="block text-xs mb-3">
              <span className="block text-[#9CA3AF] mb-1">
                Featured excerpt (≤{FEATURED_EXCERPT_WORD_CAP} words). Current: {excerptWords}{" "}
                {overCap && (
                  <span className="text-[#F87171]">— exceeds cap</span>
                )}
              </span>
              <textarea
                rows={3}
                value={currentExcerpt}
                onChange={(e) =>
                  setExcerptDrafts((prev) => ({
                    ...prev,
                    [entry.id]: e.target.value,
                  }))
                }
                className="w-full rounded bg-[#0F1218] border border-[#1F2937] px-2 py-1.5 font-mono text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
              />
            </label>

            <label className="block text-xs mb-3">
              <span className="block text-[#9CA3AF] mb-1">Curator note (optional)</span>
              <textarea
                rows={2}
                value={noteDrafts[entry.id] ?? ""}
                onChange={(e) =>
                  setNoteDrafts((prev) => ({
                    ...prev,
                    [entry.id]: e.target.value,
                  }))
                }
                className="w-full rounded bg-[#0F1218] border border-[#1F2937] px-2 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
              />
            </label>

            <div className="flex flex-wrap items-center gap-2">
              {!entry.featured ? (
                <button
                  type="button"
                  disabled={busy === entry.id || overCap}
                  onClick={() =>
                    patch(entry.id, {
                      action: "feature",
                      payload: { featured_excerpt: currentExcerpt },
                    })
                  }
                  className="rounded bg-[#C9A227] px-3 py-1.5 text-xs font-medium text-[#08090C] disabled:opacity-50"
                >
                  Feature this
                </button>
              ) : (
                <button
                  type="button"
                  disabled={busy === entry.id}
                  onClick={() => patch(entry.id, { action: "unfeature" })}
                  className="rounded bg-[#374151] px-3 py-1.5 text-xs font-medium text-[#E5E7EB] disabled:opacity-50"
                >
                  Unfeature
                </button>
              )}

              <button
                type="button"
                disabled={busy === entry.id || overCap}
                onClick={() =>
                  patch(entry.id, {
                    action: "set_excerpt",
                    payload: { featured_excerpt: currentExcerpt },
                  })
                }
                className="rounded border border-[#1F2937] bg-[#0F1218] px-3 py-1.5 text-xs text-[#E5E7EB] disabled:opacity-50"
              >
                Save excerpt
              </button>

              <button
                type="button"
                disabled={busy === entry.id}
                onClick={() =>
                  patch(entry.id, {
                    action: "add_curator_note",
                    payload: { curator_note: noteDrafts[entry.id] ?? "" },
                  })
                }
                className="rounded border border-[#1F2937] bg-[#0F1218] px-3 py-1.5 text-xs text-[#E5E7EB] disabled:opacity-50"
              >
                Save note
              </button>

              <button
                type="button"
                disabled={busy === entry.id}
                onClick={() =>
                  patch(entry.id, {
                    action: "set_status",
                    payload: {
                      status: entry.status === "published" ? "hidden" : "published",
                    },
                  })
                }
                className="ml-auto rounded border border-[#1F2937] bg-[#0F1218] px-3 py-1.5 text-xs text-[#F87171] disabled:opacity-50"
              >
                {entry.status === "published" ? "Hide" : "Restore"}
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
