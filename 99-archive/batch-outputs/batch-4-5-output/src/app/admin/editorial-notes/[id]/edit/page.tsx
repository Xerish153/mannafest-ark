import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import type { EditorialNote } from "@/lib/supabase/schemas/editorial_notes";
import { EditorialNoteEditShell } from "./EditorialNoteEditShell";

/**
 * /admin/editorial-notes/[id]/edit — standalone editor surface.
 *
 * Loads the note via service-role (sees all statuses) and hands it to a
 * client shell that renders <EditorialNoteEditor /> outside the drawer.
 * Save returns to the list.
 */

type Params = { params: Promise<{ id: string }> };

export const metadata = { title: "Edit editor's note — MannaFest" };

export default async function EditEditorialNotePage({ params }: Params) {
  const { id } = await params;

  const { data } = await supabaseAdmin
    .from("editorial_notes")
    .select()
    .eq("id", id)
    .maybeSingle();
  const note = data as EditorialNote | null;

  if (!note) {
    return (
      <div className="text-[#E5E7EB] space-y-3">
        <p>Note not found.</p>
        <Link href="/admin/editorial-notes" className="text-[#C9A227] underline">
          Back to editorial notes
        </Link>
      </div>
    );
  }

  return (
    <div className="text-[#E5E7EB] space-y-4">
      <header className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-[#9CA3AF]">
            Editorial notes
          </div>
          <h1 className="text-xl font-serif">
            Edit note
            {note.title && <span className="text-[#9CA3AF]"> — {note.title}</span>}
          </h1>
          <div className="text-[11px] text-[#6B7280] mt-0.5">
            {note.surface_type} · {note.surface_id} · updated{" "}
            {new Date(note.updated_at).toLocaleString()}
          </div>
        </div>
        <Link
          href="/admin/editorial-notes"
          className="text-sm text-[#9CA3AF] hover:text-white"
        >
          ← Back
        </Link>
      </header>

      <EditorialNoteEditShell note={note} />
    </div>
  );
}
