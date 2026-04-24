"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { JesusTitle, JesusTitleRef } from "@/lib/titles/types";

/**
 * <TitleEditor /> — super-admin editor for a single jesus_titles row.
 *
 * Client component. All mutations go through PATCH /api/admin/titles/[slug]
 * and POST/DELETE/PATCH /api/admin/titles/[slug]/refs (gated via
 * requireSuperAdmin in the route handlers).
 *
 * Intentionally utilitarian — rich-text editing lives in the markdown
 * body field as raw markdown. A future pass can add a markdown preview
 * tab or live split-view; shipping utility first.
 */
export default function TitleEditor({
  title,
  refs,
}: {
  title: JesusTitle;
  refs: JesusTitleRef[];
}) {
  const router = useRouter();
  const [form, setForm] = useState(title);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const save = () => {
    startTransition(async () => {
      setMessage(null);
      const res = await fetch(`/api/admin/titles/${title.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          original_language: form.original_language,
          original_text: form.original_text,
          transliteration: form.transliteration,
          pronunciation: form.pronunciation,
          summary: form.summary,
          origin_body: form.origin_body,
          declaration_body: form.declaration_body,
          theological_meaning_body: form.theological_meaning_body,
          display_order: form.display_order,
          cluster_group: form.cluster_group,
          status: form.status,
        }),
      });
      if (res.ok) {
        setMessage("Saved.");
        router.refresh();
      } else {
        const text = await res.text().catch(() => "");
        setMessage(`Save failed: ${res.status} ${text}`);
      }
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <header>
        <div className="text-[#C9A227] text-[11px] tracking-[0.2em] uppercase mb-2 font-[family-name:var(--font-inter)]">
          Edit title
        </div>
        <h1 className="font-[family-name:var(--font-cinzel)] text-white text-3xl mb-1">
          {title.name}
        </h1>
        <p className="text-[#6B7280] text-xs font-[family-name:var(--font-inter)]">
          slug: {title.slug}
        </p>
      </header>

      <Field label="Name">
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full bg-[#0B0D12] border border-[#1E2028] rounded px-3 py-2 text-white"
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Original language">
          <select
            value={form.original_language ?? ""}
            onChange={(e) =>
              setForm({
                ...form,
                original_language:
                  (e.target.value || null) as JesusTitle["original_language"],
              })
            }
            className="w-full bg-[#0B0D12] border border-[#1E2028] rounded px-3 py-2 text-white"
          >
            <option value="">(none)</option>
            <option value="hebrew">hebrew</option>
            <option value="greek">greek</option>
            <option value="aramaic">aramaic</option>
          </select>
        </Field>
        <Field label="Cluster group">
          <select
            value={form.cluster_group ?? ""}
            onChange={(e) =>
              setForm({
                ...form,
                cluster_group:
                  (e.target.value || null) as JesusTitle["cluster_group"],
              })
            }
            className="w-full bg-[#0B0D12] border border-[#1E2028] rounded px-3 py-2 text-white"
          >
            <option value="">(none)</option>
            <option value="identity">identity</option>
            <option value="sacrificial_office">sacrificial_office</option>
            <option value="cosmic">cosmic</option>
            <option value="relational">relational</option>
            <option value="royal">royal</option>
            <option value="incarnational">incarnational</option>
            <option value="i-am">i-am</option>
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="Original text">
          <input
            type="text"
            value={form.original_text ?? ""}
            onChange={(e) =>
              setForm({ ...form, original_text: e.target.value || null })
            }
            className="w-full bg-[#0B0D12] border border-[#1E2028] rounded px-3 py-2 text-white"
          />
        </Field>
        <Field label="Transliteration">
          <input
            type="text"
            value={form.transliteration ?? ""}
            onChange={(e) =>
              setForm({ ...form, transliteration: e.target.value || null })
            }
            className="w-full bg-[#0B0D12] border border-[#1E2028] rounded px-3 py-2 text-white"
          />
        </Field>
        <Field label="Pronunciation">
          <input
            type="text"
            value={form.pronunciation ?? ""}
            onChange={(e) =>
              setForm({ ...form, pronunciation: e.target.value || null })
            }
            className="w-full bg-[#0B0D12] border border-[#1E2028] rounded px-3 py-2 text-white"
          />
        </Field>
      </div>

      <Field label="Summary">
        <textarea
          value={form.summary ?? ""}
          onChange={(e) =>
            setForm({ ...form, summary: e.target.value || null })
          }
          rows={3}
          className="w-full bg-[#0B0D12] border border-[#1E2028] rounded px-3 py-2 text-white"
        />
      </Field>

      <MarkdownField
        label="Origin body (OT)"
        value={form.origin_body}
        onChange={(v) => setForm({ ...form, origin_body: v })}
      />
      <MarkdownField
        label="Declaration body (NT)"
        value={form.declaration_body}
        onChange={(v) => setForm({ ...form, declaration_body: v })}
      />
      <MarkdownField
        label="Theological meaning body"
        value={form.theological_meaning_body}
        onChange={(v) => setForm({ ...form, theological_meaning_body: v })}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Display order">
          <input
            type="number"
            value={form.display_order}
            onChange={(e) =>
              setForm({ ...form, display_order: Number(e.target.value) })
            }
            className="w-full bg-[#0B0D12] border border-[#1E2028] rounded px-3 py-2 text-white"
          />
        </Field>
        <Field label="Status">
          <select
            value={form.status}
            onChange={(e) =>
              setForm({
                ...form,
                status: e.target.value as JesusTitle["status"],
              })
            }
            className="w-full bg-[#0B0D12] border border-[#1E2028] rounded px-3 py-2 text-white"
          >
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
        </Field>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={isPending}
          onClick={save}
          className="bg-[#C9A227] text-[#0B0D12] px-4 py-2 rounded text-sm font-[family-name:var(--font-inter)] disabled:opacity-50"
        >
          {isPending ? "Saving…" : "Save"}
        </button>
        {message && (
          <span className="text-[var(--text-muted)] text-xs font-[family-name:var(--font-inter)]">
            {message}
          </span>
        )}
      </div>

      <RefsEditor titleSlug={title.slug} initialRefs={refs} />
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[#6B7280] text-[11px] tracking-[0.2em] uppercase mb-1 block font-[family-name:var(--font-inter)]">
        {label}
      </span>
      {children}
    </label>
  );
}

function MarkdownField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  return (
    <Field label={label}>
      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        rows={12}
        className="w-full bg-[#0B0D12] border border-[#1E2028] rounded px-3 py-2 text-white font-mono text-sm"
      />
    </Field>
  );
}

/** Minimal refs editor. CRUD is done via API routes; this is intentionally
 * basic — add / edit one row / delete one row. Reorder via display_order
 * numeric field. */
function RefsEditor({
  titleSlug,
  initialRefs,
}: {
  titleSlug: string;
  initialRefs: JesusTitleRef[];
}) {
  const router = useRouter();
  const [refs, setRefs] = useState(initialRefs);
  const [draft, setDraft] = useState<{
    ref_type: JesusTitleRef["ref_type"];
    book_id: number;
    chapter: number;
    verse_start: number;
    verse_end: number | null;
    note: string | null;
    display_order: number;
  }>({
    ref_type: "nt_declaration",
    book_id: 43,
    chapter: 1,
    verse_start: 1,
    verse_end: null,
    note: null,
    display_order: 0,
  });
  const [busy, setBusy] = useState(false);

  const addRef = async () => {
    setBusy(true);
    const res = await fetch(`/api/admin/titles/${titleSlug}/refs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    if (res.ok) {
      const row = (await res.json()) as JesusTitleRef;
      setRefs([...refs, row]);
      router.refresh();
    }
    setBusy(false);
  };

  const deleteRef = async (id: number) => {
    setBusy(true);
    const res = await fetch(`/api/admin/titles/${titleSlug}/refs?id=${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setRefs(refs.filter((r) => r.id !== id));
      router.refresh();
    }
    setBusy(false);
  };

  return (
    <section className="pt-6 border-t border-[#1E2028]">
      <h2 className="font-[family-name:var(--font-cinzel)] text-white text-xl mb-3">
        Scripture refs
      </h2>

      <ul className="divide-y divide-[#1E2028] mb-6">
        {refs.map((r) => (
          <li
            key={r.id}
            className="py-2 flex items-baseline gap-3 text-sm font-[family-name:var(--font-inter)]"
          >
            <span className="text-[#6B7280] w-10 shrink-0">{r.display_order}</span>
            <span className="text-[#C9A227] w-32 shrink-0">{r.ref_type}</span>
            <span className="text-white w-40 shrink-0">
              {r.book?.name ?? `book#${r.book_id}`} {r.chapter}:{r.verse_start}
              {r.verse_end && r.verse_end !== r.verse_start
                ? `–${r.verse_end}`
                : ""}
            </span>
            <span className="text-[#9CA3AF] flex-1">{r.note}</span>
            <button
              type="button"
              disabled={busy}
              onClick={() => deleteRef(r.id)}
              className="text-red-400 hover:text-red-300 text-xs"
            >
              delete
            </button>
          </li>
        ))}
      </ul>

      <div className="bg-[#0B0D12] border border-[#1E2028] rounded p-4 space-y-3">
        <p className="text-[#6B7280] text-[11px] tracking-[0.2em] uppercase font-[family-name:var(--font-inter)]">
          Add ref
        </p>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-2 text-sm">
          <select
            value={draft.ref_type}
            onChange={(e) =>
              setDraft({
                ...draft,
                ref_type: e.target.value as JesusTitleRef["ref_type"],
              })
            }
            className="bg-[#0B0D12] border border-[#1E2028] rounded px-2 py-1 text-white"
          >
            <option value="ot_type">ot_type</option>
            <option value="nt_declaration">nt_declaration</option>
            <option value="nt_fulfillment">nt_fulfillment</option>
            <option value="eschatological">eschatological</option>
          </select>
          <input
            type="number"
            placeholder="book_id"
            value={draft.book_id}
            onChange={(e) =>
              setDraft({ ...draft, book_id: Number(e.target.value) })
            }
            className="bg-[#0B0D12] border border-[#1E2028] rounded px-2 py-1 text-white"
          />
          <input
            type="number"
            placeholder="ch"
            value={draft.chapter}
            onChange={(e) =>
              setDraft({ ...draft, chapter: Number(e.target.value) })
            }
            className="bg-[#0B0D12] border border-[#1E2028] rounded px-2 py-1 text-white"
          />
          <input
            type="number"
            placeholder="v start"
            value={draft.verse_start}
            onChange={(e) =>
              setDraft({ ...draft, verse_start: Number(e.target.value) })
            }
            className="bg-[#0B0D12] border border-[#1E2028] rounded px-2 py-1 text-white"
          />
          <input
            type="number"
            placeholder="v end"
            value={draft.verse_end ?? ""}
            onChange={(e) =>
              setDraft({
                ...draft,
                verse_end: e.target.value ? Number(e.target.value) : null,
              })
            }
            className="bg-[#0B0D12] border border-[#1E2028] rounded px-2 py-1 text-white"
          />
          <input
            type="number"
            placeholder="order"
            value={draft.display_order}
            onChange={(e) =>
              setDraft({ ...draft, display_order: Number(e.target.value) })
            }
            className="bg-[#0B0D12] border border-[#1E2028] rounded px-2 py-1 text-white"
          />
        </div>
        <input
          type="text"
          placeholder="note"
          value={draft.note ?? ""}
          onChange={(e) => setDraft({ ...draft, note: e.target.value || null })}
          className="w-full bg-[#0B0D12] border border-[#1E2028] rounded px-2 py-1 text-white text-sm"
        />
        <button
          type="button"
          disabled={busy}
          onClick={addRef}
          className="bg-[#C9A227] text-[#0B0D12] px-3 py-1 rounded text-xs font-[family-name:var(--font-inter)] disabled:opacity-50"
        >
          Add
        </button>
      </div>
    </section>
  );
}
