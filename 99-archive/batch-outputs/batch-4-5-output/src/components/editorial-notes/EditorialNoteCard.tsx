"use client";

import { useState } from "react";
import { TraditionChip } from "@/components/Cite/TraditionChip";
import { MarkdownPreview } from "@/components/markdown/MarkdownPreview";
import type { EditorialNote } from "@/lib/supabase/schemas/editorial_notes";
import { useEditorialNotesContext } from "./EditorialNotesDrawerProvider";
import { EditorialNoteEditor } from "./EditorialNoteEditor";

export type EditorialNoteCardProps = {
  note: EditorialNote;
};

/**
 * One editorial note. Public view shows title (if any), markdown-rendered
 * body, attribution, date, and the Editor tradition chip.
 *
 * Super-admin view adds inline edit + soft-delete affordances. Draft-status
 * notes show with a dashed border + "DRAFT" badge, and are only visible to
 * super-admin (the API filters them out for everyone else).
 */
export function EditorialNoteCard({ note }: EditorialNoteCardProps) {
  const { superAdmin, reload } = useEditorialNotesContext();
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);

  const draft = note.status === "draft";
  const hidden = note.status === "hidden";

  if (editing) {
    return (
      <EditorialNoteEditor
        existing={note}
        onClose={() => setEditing(false)}
        onSaved={() => {
          setEditing(false);
          void reload();
        }}
      />
    );
  }

  const onDelete = async () => {
    if (busy) return;
    if (!window.confirm("Hide this editor's note? It can be restored from the global admin.")) {
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/editorial-notes/${note.id}`, {
        method: "DELETE",
      });
      if (res.ok) void reload();
    } finally {
      setBusy(false);
    }
  };

  return (
    <article
      className={[
        "rounded-md border bg-white p-4 shadow-sm",
        draft
          ? "border-dashed border-[var(--ink-300)]"
          : "border-[var(--ink-100)]",
        hidden ? "opacity-60" : "",
      ].join(" ")}
      data-editorial-note-card="true"
      data-note-status={note.status}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          {note.title && (
            <h3 className="font-serif text-base font-semibold text-[var(--ink-900)]">
              {note.title}
            </h3>
          )}
        </div>
        <TraditionChip tradition="editor" size="sm" />
      </div>

      <MarkdownPreview source={note.body_md} />

      <footer className="mt-3 flex items-center justify-between gap-2 text-xs text-[var(--text-muted)]">
        <div className="flex items-center gap-2 flex-wrap">
          <span>Pastor Marc — MannaFest</span>
          <span aria-hidden>·</span>
          <time dateTime={note.updated_at}>
            {new Date(note.updated_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </time>
          {draft && (
            <span className="ml-1 rounded bg-[var(--ink-100)] px-1.5 py-0.5 font-medium text-[var(--ink-900)]">
              DRAFT
            </span>
          )}
          {hidden && (
            <span className="ml-1 rounded bg-[var(--ink-100)] px-1.5 py-0.5 font-medium text-[var(--ink-900)]">
              HIDDEN
            </span>
          )}
        </div>
        {superAdmin && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="rounded px-2 py-1 text-[var(--accent)] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              aria-label="Edit editor's note"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={onDelete}
              disabled={busy}
              className="rounded px-2 py-1 text-[var(--ink-900)] hover:underline disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              aria-label="Hide editor's note"
            >
              Hide
            </button>
          </div>
        )}
      </footer>
    </article>
  );
}

export default EditorialNoteCard;
