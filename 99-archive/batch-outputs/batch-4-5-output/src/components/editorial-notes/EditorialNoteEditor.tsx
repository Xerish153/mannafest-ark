"use client";

import { useState } from "react";
import { MarkdownPreview } from "@/components/markdown/MarkdownPreview";
import type {
  EditorialNote,
  EditorialNoteStatus,
} from "@/lib/supabase/schemas/editorial_notes";
import { useEditorialNotesContext } from "./EditorialNotesDrawerProvider";

/**
 * <EditorialNoteEditor /> — split view: markdown textarea on the left
 * (or top on mobile), sanitized live preview on the right (or bottom).
 *
 * Modes:
 *  - `existing`: editing a saved note (PATCH). Renders a Delete button.
 *  - `mode='create'`: new note inside the drawer. POSTs with the current
 *    surface from context.
 *  - `mode='create-standalone'`: new note on /admin/editorial-notes/[id]/edit
 *    — out of scope for this component; admin standalone pages use the same
 *    editor but with props set explicitly.
 *
 * Save: POSTs or PATCHes; revision snapshot is created server-side when
 * body_md or title changes.
 * Save as draft: same but sets status='draft'.
 * Cancel: discards and returns to the parent (drawer card list or list page).
 */

export type EditorialNoteEditorProps = {
  existing?: EditorialNote;
  /** Only required for new-note POSTs. Inferred from context when not given. */
  surfaceType?: EditorialNote["surface_type"];
  surfaceId?: string;
  onSaved?: (noteId: string) => void;
  onClose: () => void;
};

export function EditorialNoteEditor({
  existing,
  surfaceType,
  surfaceId,
  onSaved,
  onClose,
}: EditorialNoteEditorProps) {
  const ctx = useEditorialNotesContext();
  const resolvedSurfaceType = surfaceType ?? ctx.surface?.type;
  const resolvedSurfaceId = surfaceId ?? ctx.surface?.id;

  const [title, setTitle] = useState(existing?.title ?? "");
  const [body, setBody] = useState(existing?.body_md ?? "");
  const [status, setStatus] = useState<EditorialNoteStatus>(
    existing?.status ?? "published",
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSave =
    body.trim().length > 0 && !busy && Boolean(resolvedSurfaceType && resolvedSurfaceId);

  async function submit(targetStatus: EditorialNoteStatus) {
    if (!canSave) return;
    setBusy(true);
    setError(null);
    try {
      const body_md = body;
      if (existing) {
        const res = await fetch(`/api/editorial-notes/${existing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title || null,
            body_md,
            status: targetStatus,
          }),
        });
        if (!res.ok) throw new Error(await res.text());
        const { note } = (await res.json()) as { note: EditorialNote };
        onSaved?.(note.id);
      } else {
        if (!resolvedSurfaceType || !resolvedSurfaceId) {
          throw new Error("Surface context missing — cannot create note.");
        }
        const res = await fetch(`/api/editorial-notes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            surface_type: resolvedSurfaceType,
            surface_id: resolvedSurfaceId,
            title: title || undefined,
            body_md,
            status: targetStatus === "hidden" ? "draft" : targetStatus,
          }),
        });
        if (!res.ok) throw new Error(await res.text());
        const { note } = (await res.json()) as { note: EditorialNote };
        onSaved?.(note.id);
      }
      await ctx.reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    if (!existing) return;
    if (!window.confirm("Hide this editor's note? It can be restored from the global admin.")) {
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/editorial-notes/${existing.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await ctx.reload();
        onClose();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      className="rounded-md border border-[var(--ink-100)] bg-white p-4 shadow-sm space-y-3"
      aria-label={existing ? "Edit editor's note" : "New editor's note"}
      data-editorial-note-editor="true"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <label className="flex-1 text-sm">
          <span className="sr-only">Title</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (optional)"
            maxLength={240}
            className="w-full rounded border border-[var(--ink-100)] bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </label>
        <label className="text-sm">
          <span className="sr-only">Status</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as EditorialNoteStatus)}
            className="rounded border border-[var(--ink-100)] bg-white px-2 py-1.5 text-sm"
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            {existing && <option value="hidden">Hidden</option>}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write in markdown…"
          rows={10}
          className="w-full min-h-[220px] rounded border border-[var(--ink-100)] bg-white px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          aria-label="Editor's note markdown body"
        />
        <div className="w-full min-h-[220px] rounded border border-[var(--ink-100)] bg-[var(--paper-50)] px-3 py-2 text-sm overflow-y-auto">
          <div className="mb-2 text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
            Preview
          </div>
          {body.trim() ? (
            <MarkdownPreview source={body} />
          ) : (
            <p className="text-sm text-[var(--text-muted)] italic">
              Preview appears here.
            </p>
          )}
        </div>
      </div>

      {error && (
        <p className="text-sm text-[var(--tradition-evangelical)]">{error}</p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => submit(status)}
          disabled={!canSave}
          className="rounded bg-[var(--ink-900)] px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          {existing ? "Save" : "Save & publish"}
        </button>
        <button
          type="button"
          onClick={() => submit("draft")}
          disabled={!canSave}
          className="rounded border border-[var(--ink-100)] bg-white px-3 py-1.5 text-sm text-[var(--ink-900)] disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          Save as draft
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={busy}
          className="rounded px-3 py-1.5 text-sm text-[var(--ink-900)] hover:underline disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          Cancel
        </button>
        {existing && (
          <button
            type="button"
            onClick={onDelete}
            disabled={busy}
            className="ml-auto rounded px-3 py-1.5 text-sm text-[var(--tradition-evangelical)] hover:underline disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            Delete
          </button>
        )}
      </div>
    </section>
  );
}

export default EditorialNoteEditor;
