import { NextResponse } from "next/server";
import { requireSuperAdmin, SuperAdminError } from "@/lib/auth/super-admin";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

/**
 * POST   /api/admin/titles/[slug]/refs           — create one ref
 * DELETE /api/admin/titles/[slug]/refs?id=N      — delete one ref
 * PATCH  /api/admin/titles/[slug]/refs           — update one ref (body includes {id,...})
 *
 * All super-admin gated.
 */

type CreatePayload = {
  ref_type: "ot_type" | "nt_declaration" | "nt_fulfillment" | "eschatological";
  book_id: number;
  chapter: number;
  verse_start: number;
  verse_end: number | null;
  note: string | null;
  display_order: number;
};

async function resolveTitleId(
  admin: ReturnType<typeof createSupabaseServiceClient>,
  slug: string,
): Promise<number | null> {
  const { data } = await admin
    .from("jesus_titles")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ((data as any)?.id as number | undefined) ?? null;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await requireSuperAdmin();
    const { slug } = await params;
    const body = (await req.json().catch(() => null)) as CreatePayload | null;
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "bad payload" }, { status: 400 });
    }
    const admin = createSupabaseServiceClient();
    const titleId = await resolveTitleId(admin, slug);
    if (titleId == null) {
      return NextResponse.json({ error: "title not found" }, { status: 404 });
    }
    const { data, error } = await admin
      .from("jesus_title_refs")
      .insert({ title_id: titleId, ...body })
      .select(
        "id, title_id, ref_type, book_id, chapter, verse_start, verse_end, note, display_order, created_at, book:books!jesus_title_refs_book_id_fkey(name, abbreviation)",
      )
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    if (e instanceof SuperAdminError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    throw e;
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await requireSuperAdmin();
    const { slug } = await params;
    const url = new URL(req.url);
    const idStr = url.searchParams.get("id");
    const id = idStr ? Number(idStr) : NaN;
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "bad id" }, { status: 400 });
    }
    const admin = createSupabaseServiceClient();
    const titleId = await resolveTitleId(admin, slug);
    if (titleId == null) {
      return NextResponse.json({ error: "title not found" }, { status: 404 });
    }
    const { error } = await admin
      .from("jesus_title_refs")
      .delete()
      .eq("id", id)
      .eq("title_id", titleId);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof SuperAdminError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    throw e;
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await requireSuperAdmin();
    const { slug } = await params;
    const body = (await req.json().catch(() => null)) as
      | (Partial<CreatePayload> & { id: number })
      | null;
    if (!body || typeof body.id !== "number") {
      return NextResponse.json({ error: "bad payload" }, { status: 400 });
    }
    const admin = createSupabaseServiceClient();
    const titleId = await resolveTitleId(admin, slug);
    if (titleId == null) {
      return NextResponse.json({ error: "title not found" }, { status: 404 });
    }
    const { id, ...patch } = body;
    const { data, error } = await admin
      .from("jesus_title_refs")
      .update(patch)
      .eq("id", id)
      .eq("title_id", titleId)
      .select()
      .maybeSingle();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (e) {
    if (e instanceof SuperAdminError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    throw e;
  }
}
