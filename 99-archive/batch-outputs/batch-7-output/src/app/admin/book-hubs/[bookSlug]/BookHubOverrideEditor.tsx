"use client";

import { useState } from "react";

/**
 * Batch 7 — super-admin book-hub override editor.
 *
 * signature_verse_id is input as a raw graph_nodes.id (integer). A richer
 * verse-picker widget is a Phase 10+ polish concern; the integer input is
 * the "works today" shape (matches Batch 6 VOTD editor's initial scaffold).
 */
export default function BookHubOverrideEditor({
  bookSlug,
  initial,
}: {
  bookSlug: string;
  initial: {
    signature_verse_id: number | null;
    intro_override: string;
    featured_commentary_id: string | null;
  };
}) {
  const [signatureVerseId, setSignatureVerseId] = useState<string>(
    initial.signature_verse_id != null ? String(initial.signature_verse_id) : "",
  );
  const [introOverride, setIntroOverride] = useState(initial.intro_override ?? "");
  const [featuredCommentaryId, setFeaturedCommentaryId] = useState(
    initial.featured_commentary_id ?? "",
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSave = async () => {
    setSaving(true);
    setSaved(false);
    setError(null);

    const parsedSvId = signatureVerseId.trim()
      ? Number.parseInt(signatureVerseId, 10)
      : null;
    if (signatureVerseId.trim() && (!Number.isFinite(parsedSvId) || (parsedSvId ?? 0) < 1)) {
      setError("Signature verse ID must be a positive integer or empty.");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`/api/admin/book-hubs/${bookSlug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          signature_verse_id: parsedSvId,
          intro_override: introOverride.trim() || null,
          featured_commentary_id: featuredCommentaryId.trim() || null,
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

  return (
    <div className="space-y-5">
      <Row label="signature_verse_id (graph_nodes.id)">
        <input
          type="text"
          inputMode="numeric"
          value={signatureVerseId}
          onChange={(e) => setSignatureVerseId(e.target.value)}
          placeholder="e.g., 17430"
          className="w-full bg-[#0F1117] border border-[#1E2028] rounded px-3 py-2 text-[#F0EDE8] text-sm font-mono focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
        />
        <p className="text-[#6B7280] text-xs mt-1 font-[family-name:var(--font-inter)]">
          Override the book's hero signature verse. Leave empty to use the
          default (e.g., Matt 28:18–20 for Matthew).
        </p>
      </Row>

      <Row label="intro_override (markdown or plain text)">
        <textarea
          value={introOverride}
          onChange={(e) => setIntroOverride(e.target.value)}
          rows={6}
          placeholder="Optional — replaces the default book-hub intro paragraph."
          className="w-full bg-[#0F1117] border border-[#1E2028] rounded p-3 text-[#F0EDE8] text-sm leading-relaxed font-[family-name:var(--font-serif)] focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
        />
      </Row>

      <Row label="featured_commentary_id (commentaries.id — UUID)">
        <input
          type="text"
          value={featuredCommentaryId}
          onChange={(e) => setFeaturedCommentaryId(e.target.value)}
          placeholder="Optional — overrides chapter 1's default featured commentary."
          className="w-full bg-[#0F1117] border border-[#1E2028] rounded px-3 py-2 text-[#F0EDE8] text-sm font-mono focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
        />
      </Row>

      <div className="flex items-center gap-3 pt-4 border-t border-[#1E2028]">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="bg-[#C9A227] text-black px-5 py-2 rounded text-sm font-semibold disabled:opacity-50 font-[family-name:var(--font-inter)]"
        >
          {saving ? "Saving…" : "Save overrides"}
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

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[#9CA3AF] text-xs tracking-[0.2em] uppercase mb-2 font-[family-name:var(--font-inter)]">
        {label}
      </label>
      {children}
    </div>
  );
}
