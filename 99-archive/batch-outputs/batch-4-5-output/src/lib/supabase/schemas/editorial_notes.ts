/**
 * Editorial Notes schema (Batch 4+5 — new).
 *
 * Migration 048 introduces editorial_notes + editorial_notes_revisions.
 * Notes are founder-authored markdown blocks that render in the Editor's
 * Notes drawer on eligible page surfaces (Doctrine C §4.3).
 *
 * `surface_type='route'` with `surface_id=pathname` for route-addressed pages.
 * `surface_type='node'` with `surface_id=<node-uuid>` for character/place/
 *   concept/number nodes (node tables vary; no FK — app-level integrity).
 */

export type SurfaceType = "node" | "route";
export type EditorialNoteStatus = "published" | "draft" | "hidden";

export type EditorialNote = {
  id: string;
  surface_type: SurfaceType;
  surface_id: string;
  title: string | null;
  body_md: string;
  display_order: number;
  status: EditorialNoteStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type EditorialNoteRevision = {
  id: string;
  note_id: string;
  title: string | null;
  body_md: string;
  saved_at: string;
  saved_by: string;
};

/** POST /api/editorial-notes body. */
export type EditorialNoteCreate = {
  surface_type: SurfaceType;
  surface_id: string;
  title?: string;
  body_md: string;
  status?: Exclude<EditorialNoteStatus, "hidden">;
};

/** PATCH /api/editorial-notes/[id] body — all fields optional, only supplied changes. */
export type EditorialNoteUpdate = {
  title?: string | null;
  body_md?: string;
  status?: EditorialNoteStatus;
  display_order?: number;
};

/**
 * Exclusion list for the drawer. Matches Vision v2 §4.3.4.
 * Returning true means "drawer MUST NOT render on this pathname."
 *
 * Verse pages: current route pattern is `/verse/[book]/[chapter]/[verse]`.
 * If routing changes (e.g. `/study/[book]/[chapter]` with inline verses), the
 * pattern here moves with it.
 */
export function isDrawerExcludedRoute(pathname: string): boolean {
  if (pathname === "/") return true;
  if (pathname.startsWith("/search")) return true;
  if (pathname.startsWith("/admin")) return true;
  if (pathname.startsWith("/account")) return true;
  if (pathname.startsWith("/login")) return true;
  if (pathname.startsWith("/signup")) return true;
  if (pathname.startsWith("/auth")) return true;
  if (pathname.startsWith("/about")) return true;
  if (pathname.startsWith("/graph")) return true;
  if (pathname.startsWith("/profile")) return true;
  if (pathname.startsWith("/dashboard")) return true;
  // Verse pages: /verse/<book>/<chapter>/<verse>
  if (/^\/verse\/[^/]+\/[^/]+\/[^/]+/.test(pathname)) return true;
  return false;
}
