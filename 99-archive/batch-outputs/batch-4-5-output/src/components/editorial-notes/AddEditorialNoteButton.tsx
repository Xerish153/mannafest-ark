"use client";

import { useState } from "react";
import { EditorialNoteEditor } from "./EditorialNoteEditor";
import { useEditorialNotesContext } from "./EditorialNotesDrawerProvider";

/**
 * "+ Add editor's note" — super-admin-only. Toggle that expands inline into
 * a new EditorialNoteEditor inside the drawer body. POST on save uses the
 * current surface from context.
 */
export function AddEditorialNoteButton() {
  const [open, setOpen] = useState(false);
  const { surface } = useEditorialNotesContext();

  if (!surface) return null;

  if (open) {
    return (
      <EditorialNoteEditor
        onClose={() => setOpen(false)}
        onSaved={() => setOpen(false)}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="w-full rounded-md border border-dashed border-[var(--ink-300)] bg-[var(--paper-50)] px-3 py-2 text-sm text-[var(--ink-900)] hover:bg-[var(--ink-100)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      data-add-editorial-note="true"
    >
      + Add editor&apos;s note
    </button>
  );
}

export default AddEditorialNoteButton;
