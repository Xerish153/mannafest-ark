import { NextResponse } from "next/server";
import { requireSuperAdmin, SuperAdminError } from "@/lib/auth/super-admin";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

/**
 * Batch 7 — PATCH /api/admin/chapter-summaries/[summaryId]
 *
 * Upserts body + status + drafted_by for a chapter_summaries row. Super-
 * admin gated. Writes via service-role client to bypass the RLS lockdown.
 */

type Payload = {
  body?: string | null;
  status?: "draft" | "published";
  drafted_by?: string | null;
};

function isValidPayload(x: unknown): x is Payload {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  if (
    o.body !== undefined &&
    o.body !== null &&
    typeof o.body !== "string"
  ) return false;
  if (
    o.status !== undefined &&
    o.status !== "draft" &&
    o.status !== "published"
  ) return false;
  if (
    o.drafted_by !== undefined &&
    o.drafted_by !== null &&
    typeof o.drafted_by !== "string"
  ) return false;
  return o.body !== undefined || o.status !== undefined || o.drafted_by !== undefined;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ summaryId: string }> },
) {
  try {
    await requireSuperAdmin();
  } catch (err) {
    if (err instanceof SuperAdminError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    throw err;
  }

  const { summaryId } = await params;
  const id = Number.parseInt(summaryId, 10);
  if (!Number.isFinite(id) || id < 1) {
    return NextResponse.json({ error: "Invalid summaryId" }, { status: 400 });
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
          "Invalid payload. Expected subset of { body, status, drafted_by }.",
      },
      { status: 400 },
    );
  }

  const service = createSupabaseServiceClient();
  const patch = payload as Payload;

  const { data, error } = await service
    .from("chapter_summaries")
    .update(patch)
    .eq("id", id)
    .select("id, book_id, chapter, body, status, drafted_by, updated_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ summary: data });
}
