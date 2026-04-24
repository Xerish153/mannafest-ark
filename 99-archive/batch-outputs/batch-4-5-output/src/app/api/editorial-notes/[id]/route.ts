import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import {
  requireSuperAdmin,
  SuperAdminError,
} from "@/lib/auth/super-admin";
import type {
  EditorialNote,
  EditorialNoteUpdate,
} from "@/lib/supabase/schemas/editorial_notes";

/**
 * GET    /api/editorial-notes/[id]  — super-admin only; returns any status.
 * PATCH  /api/editorial-notes/[id]  — super-admin only. Snapshots previous
 *   title+body_md into editorial_notes_revisions before updating, IFF body_md
 *   or title actually changed. Skips revision insert on metadata-only edits
 *   (status, display_order) to keep the revision log meaningful.
 * DELETE /api/editorial-notes/[id]  — soft delete (status='hidden').
 *   Hard deletes are out of scope for this batch.
 */

type Params = { params: Promise<{ id: string }> };

async function withSuperAdmin<T>(
  handler: (userId: string) => Promise<T>,
): Promise<T | Response> {
  try {
    const { userId } = await requireSuperAdmin();
    return await handler(userId);
  } catch (err) {
    if (err instanceof SuperAdminError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    throw err;
  }
}

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const result = await withSuperAdmin(async () => {
    const admin = createSupabaseServiceClient();
    const { data, error } = await admin
      .from("editorial_notes")
      .select()
      .eq("id", id)
      .maybeSingle();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }
    return NextResponse.json({ note: data as EditorialNote });
  });
  return result instanceof Response ? result : (result as Response);
}

export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params;
  const result = await withSuperAdmin(async (userId) => {
    const body = (await req.json().catch(() => null)) as
      | EditorialNoteUpdate
      | null;
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "invalid body" }, { status: 400 });
    }

    const admin = createSupabaseServiceClient();
    const { data: prev, error: loadErr } = await admin
      .from("editorial_notes")
      .select()
      .eq("id", id)
      .maybeSingle();

    if (loadErr) {
      return NextResponse.json({ error: loadErr.message }, { status: 500 });
    }
    if (!prev) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    const willTitleChange = body.title !== undefined && body.title !== prev.title;
    const willBodyChange =
      body.body_md !== undefined && body.body_md !== prev.body_md;
    const shouldSnapshot = willTitleChange || willBodyChange;

    if (shouldSnapshot) {
      const { error: revErr } = await admin
        .from("editorial_notes_revisions")
        .insert({
          note_id: prev.id,
          title: prev.title,
          body_md: prev.body_md,
          saved_by: userId,
        });
      if (revErr) {
        return NextResponse.json({ error: revErr.message }, { status: 500 });
      }
    }

    const patch: Record<string, unknown> = {};
    if (body.title !== undefined) patch.title = body.title;
    if (body.body_md !== undefined) patch.body_md = body.body_md;
    if (body.status !== undefined) patch.status = body.status;
    if (body.display_order !== undefined) patch.display_order = body.display_order;

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ note: prev as EditorialNote });
    }

    const { data: updated, error } = await admin
      .from("editorial_notes")
      .update(patch)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ note: updated as EditorialNote });
  });
  return result instanceof Response ? result : (result as Response);
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  const result = await withSuperAdmin(async () => {
    const admin = createSupabaseServiceClient();
    const { data, error } = await admin
      .from("editorial_notes")
      .update({ status: "hidden" })
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }
    return NextResponse.json({ note: data as EditorialNote });
  });
  return result instanceof Response ? result : (result as Response);
}
