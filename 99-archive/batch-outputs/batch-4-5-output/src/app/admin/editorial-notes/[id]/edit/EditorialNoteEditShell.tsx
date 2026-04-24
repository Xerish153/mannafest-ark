"use client";

import { useRouter } from "next/navigation";
import { EditorialNoteEditor } from "@/components/editorial-notes/EditorialNoteEditor";
import type { EditorialNote } from "@/lib/supabase/schemas/editorial_notes";

/**
 * Client shell for the standalone /admin/editorial-notes/[id]/edit page.
 *
 * EditorialNoteEditor calls useEditorialNotesContext(); that context is
 * provided by EditorialNotesDrawerProvider which wraps every route in
 * src/app/layout.tsx (the drawer itself is hidden on /admin/* but the
 * provider still runs). So the context call resolves cleanly. We pass
 * surfaceType + surfaceId explicitly from the existing note so the
 * editor doesn't need to look them up through context.
 *
 * On save or cancel, navigate back to the list.
 */

export function EditorialNoteEditShell({ note }: { note: EditorialNote }) {
  const router = useRouter();

  return (
    <EditorialNoteEditor
      existing={note}
      surfaceType={note.surface_type}
      surfaceId={note.surface_id}
      onSaved={() => router.push("/admin/editorial-notes")}
      onClose={() => router.push("/admin/editorial-notes")}
    />
  );
}

export default EditorialNoteEditShell;
