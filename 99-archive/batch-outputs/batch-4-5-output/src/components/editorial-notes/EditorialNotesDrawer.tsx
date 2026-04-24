"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useEditorialNotesContext } from "./EditorialNotesDrawerProvider";
import { EditorialNoteCard } from "./EditorialNoteCard";
import { AddEditorialNoteButton } from "./AddEditorialNoteButton";

/**
 * <EditorialNotesDrawer /> — the visible tab + expanded panel.
 *
 * Collapsed (default): a vertical tab pinned to the right edge, vertically
 * centered. Muted (~30% opacity, narrower) when no published notes exist;
 * full weight with editor-tradition color when populated.
 *
 * Expanded: slide-in panel on desktop (400px wide). Bottom sheet on mobile
 * (slide-up, 90vh max). Header + scrollable body + super-admin affordances
 * at the top when applicable.
 *
 * Close triggers: X button, ESC key, backdrop click.
 *
 * ARIA: role="dialog" aria-modal="false" (non-blocking panel). Focus moves
 * to the close button on open. Focus trap NOT required — users can still
 * interact with the page behind the panel.
 *
 * prefers-reduced-motion: fade in/out instead of slide animation.
 */
export function EditorialNotesDrawer() {
  const { notes, superAdmin, surface } = useEditorialNotesContext();
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const publishedCount = useMemo(
    () => notes.filter((n) => n.status === "published").length,
    [notes],
  );
  const populated = publishedCount > 0;

  // Close on ESC.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Move focus to the close button on open.
  useEffect(() => {
    if (open) closeButtonRef.current?.focus();
  }, [open]);

  if (!surface) return null;

  return (
    <>
      {/* Collapsed tab — always rendered so the founder can reach the empty
          state to author the first note. Muted when there are no published
          notes so it doesn't demand attention on a fresh page. */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="editorial-notes-drawer-panel"
        aria-label="Open editor's notes"
        className={[
          "fixed right-0 top-1/2 -translate-y-1/2 z-40",
          "flex items-center justify-center",
          "rounded-l-md shadow-sm",
          "transition-opacity motion-reduce:transition-none",
          populated
            ? "bg-[var(--tradition-editor)] text-white w-12 py-6 opacity-100"
            : "bg-[var(--ink-100)] text-[var(--ink-900)] w-8 py-5 opacity-30 hover:opacity-60",
        ].join(" ")}
        data-editorial-drawer-tab="true"
        data-populated={populated ? "true" : "false"}
      >
        <span
          className="text-[11px] font-medium tracking-wide"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          Editor&apos;s Notes{publishedCount > 0 ? ` (${publishedCount})` : ""}
        </span>
      </button>

      {open && (
        <>
          {/* Backdrop — transparent on desktop, dimmed on mobile. */}
          <button
            type="button"
            aria-label="Close editor's notes"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/0 sm:bg-black/0 motion-reduce:transition-none transition-opacity"
            tabIndex={-1}
          />

          {/* Panel. Desktop: right slide-in. Mobile: bottom sheet. */}
          <aside
            id="editorial-notes-drawer-panel"
            role="dialog"
            aria-modal="false"
            aria-label="Editor's Notes"
            className={[
              "fixed z-50 bg-[var(--paper-50)] text-[var(--ink-900)] shadow-xl",
              // Mobile: bottom sheet
              "inset-x-0 bottom-0 max-h-[90vh] rounded-t-lg",
              // Desktop: right panel
              "sm:inset-y-0 sm:right-0 sm:bottom-auto sm:top-0 sm:w-[400px] sm:max-h-none sm:rounded-none sm:rounded-l-lg",
              "flex flex-col",
              "motion-reduce:transition-none transition-transform",
            ].join(" ")}
            data-editorial-drawer-panel="true"
          >
            <header className="flex items-center justify-between border-b border-[var(--ink-100)] px-4 py-3 shrink-0">
              <div>
                <div className="text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
                  Founder commentary
                </div>
                <h2 className="font-serif text-lg font-semibold">
                  Editor&apos;s Notes
                </h2>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded p-2 text-[var(--ink-900)] hover:bg-[var(--ink-100)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                <span aria-hidden>×</span>
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {superAdmin && <AddEditorialNoteButton />}

              {notes.length === 0 && !superAdmin && (
                <p className="text-sm text-center text-[var(--text-muted)] py-8">
                  No editor&apos;s notes on this page yet.
                </p>
              )}

              {notes.length > 0 && (
                <ul className="space-y-4 list-none p-0">
                  {notes.map((note) => (
                    <li key={note.id}>
                      <EditorialNoteCard note={note} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        </>
      )}
    </>
  );
}

export default EditorialNotesDrawer;
