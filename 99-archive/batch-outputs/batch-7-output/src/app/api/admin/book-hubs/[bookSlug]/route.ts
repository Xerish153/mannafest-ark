import { NextResponse } from "next/server";
import { requireSuperAdmin, SuperAdminError } from "@/lib/auth/super-admin";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { bookBySlug } from "@/lib/bible/book-slugs";

/**
 * Batch 7 — PATCH /api/admin/book-hubs/[bookSlug]
 *
 * Upserts a book_hub_config row. Accepts a subset of
 * { signature_verse_id, intro_override, featured_commentary_id }.
 */

type Payload = {
  signature_verse_id?: number | null;
  intro_override?: string | null;
  featured_commentary_id?: string | null;
};

function isValidPayload(x: unknown): x is Payload {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  if (
    o.signature_verse_id !== undefined &&
    o.signature_verse_id !== null &&
    (typeof o.signature_verse_id !== "number" || !Number.isFinite(o.signature_verse_id))
  ) return false;
  if (
    o.intro_override !== undefined &&
    o.intro_override !== null &&
    typeof o.intro_override !== "string"
  ) return false;
  if (
    o.featured_commentary_id !== undefined &&
    o.featured_commentary_id !== null &&
    typeof o.featured_commentary_id !== "string"
  ) return false;
  return (
    o.signature_verse_id !== undefined ||
    o.intro_override !== undefined ||
    o.featured_commentary_id !== undefined
  );
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ bookSlug: string }> },
) {
  try {
    await requireSuperAdmin();
  } catch (err) {
    if (err instanceof SuperAdminError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    throw err;
  }

  const { bookSlug } = await params;
  const meta = bookBySlug(bookSlug);
  if (!meta) {
    return NextResponse.json({ error: `Unknown book: ${bookSlug}` }, { status: 404 });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!isValidPayload(payload)) {
    return NextResponse.json(
      {
        error:
          "Invalid payload. Expected subset of { signature_verse_id, intro_override, featured_commentary_id }.",
      },
      { status: 400 },
    );
  }

  const service = createSupabaseServiceClient();
  const patch = payload as Payload;

  const { data, error } = await service
    .from("book_hub_config")
    .upsert(
      { book_slug: meta.slug, ...patch },
      { onConflict: "book_slug" },
    )
    .select("id, book_slug, signature_verse_id, intro_override, featured_commentary_id, updated_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ hub: data });
}
