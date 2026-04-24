import { NextResponse } from "next/server";
import { requireSuperAdmin, SuperAdminError } from "@/lib/auth/super-admin";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

/**
 * PATCH /api/admin/votd/[date]
 *
 * Upserts a `votd_reflections` row for the given date. Super-admin gated.
 *
 * Body:
 *   {
 *     verse_id: number,           // graph_nodes.id of the verse node
 *     body: string | null,        // markdown reflection body (null for draft placeholders)
 *     status: 'draft' | 'published',
 *     fallback_scholar_id?: string | null,
 *     fallback_quote?: string | null,
 *   }
 */

type Payload = {
  verse_id: number;
  body: string | null;
  status: "draft" | "published";
  fallback_scholar_id?: string | null;
  fallback_quote?: string | null;
};

function isIsoDate(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

function isValidPayload(x: unknown): x is Payload {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  if (typeof o.verse_id !== "number" || !Number.isFinite(o.verse_id)) return false;
  if (o.body !== null && typeof o.body !== "string") return false;
  if (o.status !== "draft" && o.status !== "published") return false;
  if (
    o.fallback_scholar_id !== undefined &&
    o.fallback_scholar_id !== null &&
    typeof o.fallback_scholar_id !== "string"
  ) {
    return false;
  }
  if (
    o.fallback_quote !== undefined &&
    o.fallback_quote !== null &&
    typeof o.fallback_quote !== "string"
  ) {
    return false;
  }
  return true;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ date: string }> },
) {
  try {
    await requireSuperAdmin();
  } catch (err) {
    if (err instanceof SuperAdminError) {
      return new Response(err.message, { status: err.status });
    }
    throw err;
  }

  const { date } = await params;
  if (!isIsoDate(date)) {
    return NextResponse.json({ error: "Invalid date (expected YYYY-MM-DD)" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body is not valid JSON" }, { status: 400 });
  }
  if (!isValidPayload(body)) {
    return NextResponse.json(
      { error: "Body must include { verse_id, body, status } and optional fallback_* fields" },
      { status: 400 },
    );
  }

  const admin = createSupabaseServiceClient();
  const row = {
    date,
    verse_id: body.verse_id,
    body: body.body,
    status: body.status,
    fallback_scholar_id: body.fallback_scholar_id ?? null,
    fallback_quote: body.fallback_quote ?? null,
  };

  const { error } = await admin
    .from("votd_reflections")
    .upsert(row, { onConflict: "date" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, date });
}
