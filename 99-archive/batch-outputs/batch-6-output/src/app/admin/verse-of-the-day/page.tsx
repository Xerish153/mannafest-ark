import Link from "next/link";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { formatIsoDate } from "@/lib/votd/canonical-verses";

/**
 * /admin/verse-of-the-day — 365-day calendar queue.
 *
 * Gating: admin layout runs requireAdmin() on every /admin/* request.
 *
 * Layout: a month-by-month calendar grid for the current year. Each day
 * shows one of three badges:
 *   - "published" (green dot): votd_reflections row with status=published
 *   - "draft" (muted dot): votd_reflections row with status=draft
 *   - "empty" (no dot): no row — the canonical day-of-year verse will
 *     render with a scholar-quote fallback
 *
 * Click any day → /admin/verse-of-the-day/[date] single-day editor.
 */

export const metadata = {
  title: "VOTD queue — MannaFest Admin",
  robots: { index: false, follow: false },
};

export default async function VotdQueuePage() {
  const admin = createSupabaseServiceClient();
  const year = new Date().getFullYear();
  const start = `${year}-01-01`;
  const end = `${year}-12-31`;

  const { data } = await admin
    .from("votd_reflections")
    .select("date, status")
    .gte("date", start)
    .lte("date", end);

  const statusByDate = new Map<string, "draft" | "published">();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const row of (data ?? []) as any[]) {
    statusByDate.set(row.date as string, row.status as "draft" | "published");
  }

  const months = buildYearMonths(year);
  const today = formatIsoDate(new Date());

  return (
    <div className="space-y-8">
      <header>
        <div className="text-[#C9A227] text-[11px] tracking-[0.2em] uppercase mb-2 font-[family-name:var(--font-inter)]">
          Verse of the Day queue
        </div>
        <h1 className="font-[family-name:var(--font-cinzel)] text-white text-3xl mb-1">
          {year}
        </h1>
        <p className="text-[#9CA3AF] text-sm font-[family-name:var(--font-inter)]">
          Click any day to queue a reflection. Empty days show the canonical
          day-of-year verse with a scholar-quote fallback on the public page.
        </p>
      </header>

      <section className="space-y-10">
        {months.map((m) => (
          <MonthGrid
            key={m.key}
            year={year}
            monthIndex={m.monthIndex}
            monthName={m.monthName}
            days={m.days}
            statusByDate={statusByDate}
            today={today}
          />
        ))}
      </section>
    </div>
  );
}

function MonthGrid({
  year,
  monthIndex,
  monthName,
  days,
  statusByDate,
  today,
}: {
  year: number;
  monthIndex: number;
  monthName: string;
  days: Array<Date | null>;
  statusByDate: Map<string, "draft" | "published">;
  today: string;
}) {
  return (
    <div>
      <h2 className="font-[family-name:var(--font-cinzel)] text-white text-lg mb-3">
        {monthName} {year}
      </h2>
      <div className="grid grid-cols-7 gap-1">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div
            key={`dow-${monthIndex}-${i}`}
            className="text-[10px] uppercase tracking-[0.2em] text-[#6B7280] text-center py-1 font-[family-name:var(--font-inter)]"
          >
            {d}
          </div>
        ))}
        {days.map((d, i) => {
          if (!d) {
            return (
              <div
                key={`pad-${monthIndex}-${i}`}
                className="h-14 rounded border border-transparent"
              />
            );
          }
          const iso = isoFromDate(d);
          const st = statusByDate.get(iso);
          const isToday = iso === today;
          return (
            <Link
              key={iso}
              href={`/admin/verse-of-the-day/${iso}`}
              className={[
                "h-14 rounded border px-2 py-1 flex flex-col items-start justify-between text-xs font-[family-name:var(--font-inter)] transition-colors",
                isToday
                  ? "border-[#C9A227] bg-[#0F1117]"
                  : "border-[#1E2028] bg-[#08090C] hover:border-[#C9A227]",
              ].join(" ")}
            >
              <span
                className={isToday ? "text-[#C9A227]" : "text-[#F0EDE8]"}
              >
                {d.getDate()}
              </span>
              {st === "published" ? (
                <span className="text-[10px] uppercase tracking-[0.15em] text-green-400">
                  published
                </span>
              ) : st === "draft" ? (
                <span className="text-[10px] uppercase tracking-[0.15em] text-[#9CA3AF]">
                  draft
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function isoFromDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function buildYearMonths(year: number) {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return monthNames.map((name, idx) => {
    const first = new Date(year, idx, 1);
    const startPad = first.getDay(); // 0 = Sunday
    const daysInMonth = new Date(year, idx + 1, 0).getDate();
    const days: Array<Date | null> = [];
    for (let p = 0; p < startPad; p += 1) days.push(null);
    for (let d = 1; d <= daysInMonth; d += 1) days.push(new Date(year, idx, d));
    return { key: `${year}-${idx}`, monthIndex: idx, monthName: name, days };
  });
}
