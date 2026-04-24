import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import {
  requireSuperAdmin,
  SuperAdminError,
} from "@/lib/auth/super-admin";
import {
  FEATURED_EXCERPT_WORD_CAP,
  wordCount,
  type CommentaryPatchAction,
  type CommentaryStatus,
} from "@/lib/supabase/schemas/commentaries";

/**
 * PATCH /api/commentary/[id] — super-admin curation actions.
 *
 * Body shape: CommentaryPatchAction (discriminated by `action`).
 *
 * Actions:
 *  - feature       { featured_excerpt }  — feature this entry; unfeature any
 *                                          other entries on the same
 *                                          (book_id, chapter, verse_start).
 *                                          Marks founder_curated=true.
 *  - unfeature                           — clear featured flag. Keep excerpt
 *                                          text on the row (so a later refeature
 *                                          keeps the curator's prior trimming).
 *  - set_excerpt   { featured_excerpt }  — update excerpt without touching the
 *                                          featured flag.
 *  - add_curator_note { curator_note }   — set the curator-note sidecar.
 *  - set_status    { status }            — published | hidden.
 *
 * Every action is server-gated by requireSuperAdmin() against profiles.is_admin.
 * Writes execute on the service-role client (bypasses RLS).
 */

const WORD_CAP = FEATURED_EXCERPT_WORD_CAP;

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "missing id" }, { status: 400 });
  }

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
    | CommentaryPatchAction
    | null;
  if (!body || typeof body !== "object" || !("action" in body)) {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const admin = createSupabaseServiceClient();

  // Load the target row once so we can look up locus for unfeature-others.
  const { data: target, error: loadErr } = await admin
    .from("commentaries")
    .select("id, book_id, chapter, verse_start")
    .eq("id", id)
    .maybeSingle();

  if (loadErr || !target) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const now = new Date().toISOString();

  switch (body.action) {
    case "feature": {
      const excerpt = body.payload.featured_excerpt ?? "";
      if (wordCount(excerpt) > WORD_CAP) {
        return NextResponse.json(
          {
            error: `featured_excerpt exceeds ${WORD_CAP}-word cap`,
            count: wordCount(excerpt),
          },
          { status: 400 },
        );
      }
      // Unfeature other entries at the same locus.
      await admin
        .from("commentaries")
        .update({ featured: false })
        .eq("book_id", target.book_id)
        .eq("chapter", target.chapter)
        .eq("verse_start", target.verse_start)
        .neq("id", id);

      const { data, error } = await admin
        .from("commentaries")
        .update({
          featured: true,
          featured_excerpt: excerpt,
          founder_curated: true,
          curated_by: userId,
          curated_at: now,
        })
        .eq("id", id)
        .select()
        .maybeSingle();
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ entry: data });
    }

    case "unfeature": {
      const { data, error } = await admin
        .from("commentaries")
        .update({
          featured: false,
          curated_by: userId,
          curated_at: now,
        })
        .eq("id", id)
        .select()
        .maybeSingle();
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ entry: data });
    }

    case "set_excerpt": {
      const excerpt = body.payload.featured_excerpt ?? "";
      if (wordCount(excerpt) > WORD_CAP) {
        return NextResponse.json(
          {
            error: `featured_excerpt exceeds ${WORD_CAP}-word cap`,
            count: wordCount(excerpt),
          },
          { status: 400 },
        );
      }
      const { data, error } = await admin
        .from("commentaries")
        .update({
          featured_excerpt: excerpt,
          curated_by: userId,
          curated_at: now,
        })
        .eq("id", id)
        .select()
        .maybeSingle();
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ entry: data });
    }

    case "add_curator_note": {
      const note = body.payload.curator_note ?? "";
      const { data, error } = await admin
        .from("commentaries")
        .update({
          curator_note: note || null,
          curated_by: userId,
          curated_at: now,
        })
        .eq("id", id)
        .select()
        .maybeSingle();
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ entry: data });
    }

    case "set_status": {
      const status = body.payload.status as CommentaryStatus;
      if (status !== "published" && status !== "hidden") {
        return NextResponse.json({ error: "invalid status" }, { status: 400 });
      }
      const { data, error } = await admin
        .from("commentaries")
        .update({
          status,
          curated_by: userId,
          curated_at: now,
        })
        .eq("id", id)
        .select()
        .maybeSingle();
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ entry: data });
    }

    default: {
      return NextResponse.json({ error: "unknown action" }, { status: 400 });
    }
  }
}
