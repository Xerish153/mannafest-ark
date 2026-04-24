import { NextResponse } from "next/server";
import { requireSuperAdmin, SuperAdminError } from "@/lib/auth/super-admin";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { bookBySlug } from "@/lib/bible/book-slugs";

/**
 * Batch 7 — PATCH /api/admin/pericopes/[bookSlug]/[chapter]
 *
 * Replaces the full set of pericope_overrides rows for (book, chapter).
 * Payload: { sections: Array<{ verse_start, verse_end, title? }> }.
 * The route deletes existing rows and re-inserts in one transaction-ish
 * flow. display_order is assigned by array index.
 */

type Section = {
  verse_start: number;
  verse_end: number;
  title?: string | null;
};

type Payload = { sections: Section[] };

function isValidSection(s: unknown): s is Section {
  if (!s || typeof s !== "object") return false;
  const o = s as Record<string, unknown>;
  if (typeof o.verse_start !== "number" || o.verse_start < 1) return false;
  if (typeof o.verse_end !== "number" || o.verse_end < o.verse_start) return false;
  if (o.title !== undefined && o.title !== null && typeof o.title !== "string") return false;
  return true;
}

function isValidPayload(x: unknown): x is Payload {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  if (!Array.isArray(o.sections)) return false;
  return o.sections.every(isValidSection);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ bookSlug: string; chapter: string }> },
) {
  try {
    await requireSuperAdmin();
  } catch (err) {
    if (err instanceof SuperAdminError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    throw err;
  }

  const { bookSlug, chapter: chapterStr } = await params;
  const meta = bookBySlug(bookSlug);
  if (!meta) {
    return NextResponse.json({ error: `Unknown book: ${bookSlug}` }, { status: 404 });
  }
  const chapter = Number.parseInt(chapterStr, 10);
  if (!Number.isFinite(chapter) || chapter < 1 || chapter > meta.chapterCount) {
    return NextResponse.json(
      { error: `Chapter ${chapterStr} out of range` },
      { status: 400 },
    );
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!isValidPayload(payload)) {
    return NextResponse.json(
      { error: "Invalid payload. Expected { sections: [...] }." },
      { status: 400 },
    );
  }

  const service = createSupabaseServiceClient();

  // Delete-then-insert replaces the chapter's pericope set.
  const del = await service
    .from("pericope_overrides")
    .delete()
    .eq("book_id", meta.bookId)
    .eq("chapter", chapter);
  if (del.error) {
    return NextResponse.json({ error: del.error.message }, { status: 500 });
  }

  const sections = payload.sections;
  if (sections.length === 0) {
    return NextResponse.json({ sections: [] });
  }

  const rows = sections.map((s, idx) => ({
    book_id: meta.bookId,
    chapter,
    verse_start: s.verse_start,
    verse_end: s.verse_end,
    title: s.title ?? null,
    display_order: idx,
  }));

  const ins = await service
    .from("pericope_overrides")
    .insert(rows)
    .select("id, verse_start, verse_end, title, display_order");

  if (ins.error) {
    return NextResponse.json({ error: ins.error.message }, { status: 500 });
  }
  return NextResponse.json({ sections: ins.data });
}
