import { NextResponse } from "next/server";
import {
  requireSuperAdmin,
  SuperAdminError,
} from "@/lib/auth/super-admin";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

/**
 * PATCH /api/admin/cross-references/[verseId]
 *
 * Accepts:
 *   { updates: Array<{ edge_id: number; display_rank: number; founder_override: boolean }> }
 *
 * The verseId path param is the graph_nodes.id of the verse whose
 * cross-references are being reordered. It is used only for permission
 * scoping and structured logging — the actual updates target graph_edges
 * rows by `edge_id`. Callers MUST have fetched the edges via
 * /admin/cross-references/[verseId] so they know which edges belong to
 * this verse; this endpoint does not re-verify per-row ownership (edges
 * touch two nodes, and the "ownership" model for overrides is the node
 * the founder is currently viewing — see ranking.ts).
 *
 * Super-admin gating via requireSuperAdmin() (server-only helper, uses
 * service-role to read profiles.is_admin even under RLS). Batch 4+5
 * established this pattern; this route reuses it verbatim.
 */

type Update = {
  edge_id: number;
  display_rank: number;
  founder_override: boolean;
};

function isValidUpdate(u: unknown): u is Update {
  if (!u || typeof u !== "object") return false;
  const o = u as Record<string, unknown>;
  return (
    typeof o.edge_id === "number" &&
    Number.isFinite(o.edge_id) &&
    typeof o.display_rank === "number" &&
    Number.isFinite(o.display_rank) &&
    typeof o.founder_override === "boolean"
  );
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ verseId: string }> },
) {
  try {
    await requireSuperAdmin();
  } catch (err) {
    if (err instanceof SuperAdminError) {
      return new Response(err.message, { status: err.status });
    }
    throw err;
  }

  const { verseId } = await params;
  const verseNodeId = parseInt(verseId, 10);
  if (!Number.isFinite(verseNodeId)) {
    return NextResponse.json({ error: "Invalid verseId" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body is not valid JSON" }, { status: 400 });
  }

  const bodyObj =
    body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const updatesRaw = bodyObj.updates;
  if (!Array.isArray(updatesRaw)) {
    return NextResponse.json(
      { error: "Body must have an 'updates' array" },
      { status: 400 },
    );
  }
  const updates: Update[] = [];
  for (const u of updatesRaw) {
    if (!isValidUpdate(u)) {
      return NextResponse.json(
        { error: "Each update requires { edge_id: number, display_rank: number, founder_override: boolean }" },
        { status: 400 },
      );
    }
    updates.push(u);
  }
  if (updates.length === 0) {
    return NextResponse.json({ updated: 0 });
  }
  if (updates.length > 1000) {
    return NextResponse.json({ error: "Too many updates (max 1000)" }, { status: 413 });
  }

  const admin = createSupabaseServiceClient();
  let updated = 0;
  for (const u of updates) {
    const { error } = await admin
      .from("graph_edges")
      .update({
        display_rank: u.display_rank,
        founder_override: u.founder_override,
      })
      .eq("id", u.edge_id);
    if (error) {
      return NextResponse.json(
        { error: `Update failed for edge ${u.edge_id}: ${error.message}`, updated },
        { status: 500 },
      );
    }
    updated += 1;
  }

  return NextResponse.json({ updated });
}
