import { NextResponse } from "next/server";
import { requireSuperAdmin, SuperAdminError } from "@/lib/auth/super-admin";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

/**
 * PATCH /api/admin/titles/[slug]
 *
 * Updates the jesus_titles row identified by slug. All fields optional;
 * only present fields mutate. Super-admin gated.
 */

type Payload = Partial<{
  name: string;
  original_language: "hebrew" | "greek" | "aramaic" | null;
  original_text: string | null;
  transliteration: string | null;
  pronunciation: string | null;
  summary: string | null;
  origin_body: string | null;
  declaration_body: string | null;
  theological_meaning_body: string | null;
  display_order: number;
  cluster_group:
    | "identity"
    | "sacrificial_office"
    | "cosmic"
    | "relational"
    | "royal"
    | "incarnational"
    | "i-am"
    | null;
  status: "draft" | "published";
}>;

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await requireSuperAdmin();
    const { slug } = await params;
    const body = (await req.json().catch(() => null)) as Payload | null;
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "bad payload" }, { status: 400 });
    }

    const admin = createSupabaseServiceClient();
    const { data, error } = await admin
      .from("jesus_titles")
      .update(body)
      .eq("slug", slug)
      .select()
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (e) {
    if (e instanceof SuperAdminError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    throw e;
  }
}
