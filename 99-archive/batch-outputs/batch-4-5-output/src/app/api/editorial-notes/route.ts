import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import {
  requireSuperAdmin,
  SuperAdminError,
  isSuperAdmin,
} from "@/lib/auth/super-admin";
import type {
  EditorialNote,
  EditorialNoteCreate,
} from "@/lib/supabase/schemas/editorial_notes";

/**
 * GET /api/editorial-notes
 *   Query: ?surface_type=route|node&surface_id=<id>&q=<search>&include_all=1
 *
 * Public callers see only status='published'. Super-admin callers (verified
 * via requireSuperAdmin — no trust of the client-supplied include_all) see
 * drafts + hidden when include_all=1.
 *
 * Sorted by display_order ASC, created_at DESC for deterministic order.
 *
 * POST /api/editorial-notes
 *   Body: EditorialNoteCreate
 *
 * Creates a new note. Super-admin only. Does NOT insert a revision — first
 * revision is written on the first content-changing PATCH.
 */

export async function GET(req: Request) {
  const url = new URL(req.url);
  const surfaceType = url.searchParams.get("surface_type");
  const surfaceId = url.searchParams.get("surface_id");
  const q = url.searchParams.get("q");
  const requestedAll = url.searchParams.get("include_all") === "1";

  const callerIsAdmin = requestedAll ? await isSuperAdmin() : false;

  // Service-role client when super-admin wants all statuses — otherwise anon
  // obeys the RLS public-read-of-published policy.
  const client = callerIsAdmin ? createSupabaseServiceClient() : supabase;

  let query = client
    .from("editorial_notes")
    .select(
      "id, surface_type, surface_id, title, body_md, display_order, status, created_by, created_at, updated_at",
    )
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (surfaceType) query = query.eq("surface_type", surfaceType);
  if (surfaceId) query = query.eq("surface_id", surfaceId);
  if (q) {
    // Simple ILIKE across title + body. Good enough for admin search.
    query = query.or(`title.ilike.%${q}%,body_md.ilike.%${q}%`);
  }
  if (!callerIsAdmin) {
    query = query.eq("status", "published");
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ notes: (data ?? []) as EditorialNote[] });
}

export async function POST(req: Request) {
  let userId: string;
  try {
    ({ userId } = await requireSuperAdmin());
  } catch (err) {
    if (err instanceof SuperAdminError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    throw err;
  }

  const body = (await req.json().catch(() => null)) as
    | EditorialNoteCreate
    | null;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  if (body.surface_type !== "route" && body.surface_type !== "node") {
    return NextResponse.json({ error: "invalid surface_type" }, { status: 400 });
  }
  if (!body.surface_id || typeof body.surface_id !== "string") {
    return NextResponse.json({ error: "surface_id required" }, { status: 400 });
  }
  if (!body.body_md || typeof body.body_md !== "string") {
    return NextResponse.json({ error: "body_md required" }, { status: 400 });
  }
  const status = body.status === "draft" ? "draft" : "published";

  const admin = createSupabaseServiceClient();
  const { data, error } = await admin
    .from("editorial_notes")
    .insert({
      surface_type: body.surface_type,
      surface_id: body.surface_id,
      title: body.title ?? null,
      body_md: body.body_md,
      status,
      created_by: userId,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ note: data as EditorialNote }, { status: 201 });
}
