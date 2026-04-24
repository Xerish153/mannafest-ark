import { NextResponse } from "next/server";
import { loadVotdForDate, loadVotdToday } from "@/lib/votd/loader";

/**
 * GET /api/votd[?date=YYYY-MM-DD]
 *
 * Public VOTD JSON endpoint. Returns the same payload that /verse-of-the-day
 * server-renders. Useful for any client surface that wants to display a
 * VOTD card (widgets, future mobile clients, etc.) without re-implementing
 * the loader.
 */

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const payload =
    date && /^\d{4}-\d{2}-\d{2}$/.test(date)
      ? await loadVotdForDate(date)
      : await loadVotdToday();
  if (!payload) {
    return NextResponse.json({ error: "No VOTD for date" }, { status: 404 });
  }
  return NextResponse.json(payload);
}
