import "server-only";
import { headers } from "next/headers";
import type { ReaderBundle } from "./types";

/**
 * Server-side helper to load the reader bundle from the internal API route.
 * Called from the /read/:book/:chapter page during SSR so the ChapterReader
 * hydrates with content-visible HTML. For client-only re-fetches (e.g., a
 * translation switch), the ChapterNavigationBar pushes a new URL and Next
 * re-runs the server render.
 */
export async function loadReaderBundle(
  bookSlug: string,
  chapter: number,
  translation: "KJV" | "WEB" | "ASV" = "KJV",
): Promise<ReaderBundle | null> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "https";
  const base = `${proto}://${host}`;

  const res = await fetch(
    `${base}/api/reader/${bookSlug}/${chapter}?t=${translation}`,
    { next: { revalidate: 300 } },
  );
  if (!res.ok) return null;
  return (await res.json()) as ReaderBundle;
}
