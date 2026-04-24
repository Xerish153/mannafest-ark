import { NextResponse } from "next/server";

/**
 * GET /admin/commentary/go?book=<slug>&chapter=<n>
 *
 * Small redirect helper used by the admin/commentary landing page form.
 * Keeps the landing page a server component without needing client-side
 * router wiring for a trivial form submit.
 *
 * Also serves as the non-JS fallback: the form action posts here, and
 * this route redirects the user to the actual curation panel.
 *
 * The admin gate runs at the layout level (src/app/admin/layout.tsx calls
 * requireAdmin()), so a non-admin hitting this URL is redirected to "/"
 * before reaching this handler.
 */

function sanitizeSlug(input: string | null): string | null {
  if (!input) return null;
  const trimmed = input.trim().toLowerCase();
  if (!/^[a-z0-9-]{1,48}$/.test(trimmed)) return null;
  return trimmed;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const book = sanitizeSlug(url.searchParams.get("book"));
  const chapterRaw = url.searchParams.get("chapter");
  const chapter = chapterRaw ? Number.parseInt(chapterRaw, 10) : NaN;

  if (!book || !Number.isFinite(chapter) || chapter <= 0) {
    return NextResponse.redirect(new URL("/admin/commentary", req.url));
  }

  return NextResponse.redirect(
    new URL(`/admin/commentary/${book}/${chapter}`, req.url),
  );
}
