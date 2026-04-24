import Link from "next/link";
import { supabase } from "@/lib/supabase";

/**
 * <OriginalLanguageTable /> — biblehub-style interlinear for a verse.
 *
 * Renders a table: # / KJV gloss / Strong's link / original script /
 * transliteration / definition. Hides entirely when the verse has no
 * verse_strongs rows (which is most verses today — verse_strongs has ~250
 * rows across 231 verses as of Batch 6 entry audit). When it renders, it
 * sits behind a "Show original language" toggle so it doesn't eat
 * above-the-fold real estate.
 *
 * Hebrew script renders with font-[family-name:var(--font-hebrew)]
 * (Noto Serif Hebrew, loaded in layout.tsx) and dir="rtl". Greek uses
 * the default serif — Source Serif 4 has Greek glyph coverage and renders
 * polytonic correctly for the student's reading needs.
 *
 * This component REPLACES the prior OriginalLanguage.tsx wordsplit
 * fallback. Verses without Strong's data now render nothing — per
 * Doctrine D.2 (empty-state rendering), no placeholder text.
 */

type Row = {
  word_position: number;
  strongs_number: string;
  language: string | null;
  original_word: string | null;
  transliteration: string | null;
  definition: string | null;
  kjv_usage: string | null;
};

export default async function OriginalLanguageTable({
  verseRowId,
  testament,
}: {
  /** verses.id of the KJV verse row */
  verseRowId: number;
  testament: string;
}) {
  const { data: rows } = await supabase
    .from("verse_strongs")
    .select(
      `word_position, strongs_number,
       entry:strongs_entries!verse_strongs_strongs_number_fkey(language, original_word, transliteration, definition, kjv_usage)`,
    )
    .eq("verse_id", verseRowId)
    .order("word_position", { ascending: true });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (rows ?? []) as any[];

  // If the FK name above isn't exactly that, PostgREST returns entry: null.
  // Fall back to a separate lookup by strongs_number when the embedded
  // join is empty but verse_strongs rows exist.
  let records: Row[] = raw
    .filter((r) => r.entry)
    .map(
      (r): Row => ({
        word_position: r.word_position as number,
        strongs_number: r.strongs_number as string,
        language: (r.entry.language as string | null) ?? null,
        original_word: (r.entry.original_word as string | null) ?? null,
        transliteration: (r.entry.transliteration as string | null) ?? null,
        definition: (r.entry.definition as string | null) ?? null,
        kjv_usage: (r.entry.kjv_usage as string | null) ?? null,
      }),
    );

  if (records.length === 0 && raw.length > 0) {
    // Fallback: the join alias didn't resolve (FK name differs). Pull
    // strongs_entries rows by strongs_number in a second query.
    const numbers = [...new Set(raw.map((r) => r.strongs_number as string))];
    const { data: entries } = await supabase
      .from("strongs_entries")
      .select("strongs_number, language, original_word, transliteration, definition, kjv_usage")
      .in("strongs_number", numbers);
    const byNum = new Map<string, Row>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const e of (entries ?? []) as any[]) {
      byNum.set(e.strongs_number as string, {
        word_position: 0,
        strongs_number: e.strongs_number as string,
        language: (e.language as string | null) ?? null,
        original_word: (e.original_word as string | null) ?? null,
        transliteration: (e.transliteration as string | null) ?? null,
        definition: (e.definition as string | null) ?? null,
        kjv_usage: (e.kjv_usage as string | null) ?? null,
      });
    }
    records = raw
      .map((r): Row | null => {
        const base = byNum.get(r.strongs_number as string);
        return base
          ? { ...base, word_position: r.word_position as number }
          : null;
      })
      .filter((x): x is Row => x !== null);
  }

  if (records.length === 0) return null;

  const isHebrew = testament === "OT" || records.some((r) => r.language === "hebrew");

  return (
    <section id="original-language" className="mb-8">
      <details className="group bg-[var(--surface)] border border-[var(--border)] rounded-lg">
        <summary className="list-none cursor-pointer select-none px-6 py-4 flex items-center justify-between gap-4 hover:bg-[var(--bg)] transition-colors rounded-lg group-open:rounded-b-none group-open:border-b group-open:border-[var(--border)]">
          <div className="flex items-baseline gap-3">
            <h2 className="font-[family-name:var(--font-cinzel)] text-[var(--text)] text-lg">
              Original language
            </h2>
            <span className="text-[var(--text-muted)] text-xs font-[family-name:var(--font-inter)]">
              {records.length} {isHebrew ? "Hebrew" : "Greek"} word{records.length === 1 ? "" : "s"}
            </span>
          </div>
          <span className="text-[var(--text-muted)] text-sm group-open:rotate-180 transition-transform">
            ▾
          </span>
        </summary>
        <div className="px-4 py-4 overflow-x-auto">
          <table className="w-full text-sm font-[family-name:var(--font-inter)] border-collapse">
            <thead>
              <tr className="text-[10px] uppercase tracking-[0.15em] text-[var(--text-muted)]">
                <th className="text-left pl-2 pr-3 py-2 w-10">#</th>
                <th className="text-left px-3 py-2">KJV</th>
                <th className="text-left px-3 py-2">Strong&rsquo;s</th>
                <th className="text-left px-3 py-2">
                  {isHebrew ? "Hebrew" : "Greek"}
                </th>
                <th className="text-left px-3 py-2">Transliteration</th>
                <th className="text-left px-3 py-2">Definition</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr
                  key={`${r.strongs_number}-${r.word_position}-${i}`}
                  className="border-t border-[var(--border)] text-[var(--text)]"
                >
                  <td className="pl-2 pr-3 py-2 text-[var(--text-muted)] tabular-nums">
                    {r.word_position || i + 1}
                  </td>
                  <td className="px-3 py-2">
                    {r.kjv_usage ? stripTerminator(r.kjv_usage) : "—"}
                  </td>
                  <td className="px-3 py-2">
                    <Link
                      href={`/concordance?q=${encodeURIComponent(r.strongs_number)}`}
                      className="text-[var(--accent, #C9A227)] hover:underline font-mono text-xs"
                    >
                      {r.strongs_number}
                    </Link>
                  </td>
                  <td
                    className="px-3 py-2 text-base"
                    {...(isHebrew
                      ? {
                          dir: "rtl",
                          style: { fontFamily: "var(--font-hebrew), serif" },
                        }
                      : { style: { fontFamily: "var(--font-serif), serif" } })}
                  >
                    {r.original_word ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-[var(--text-muted)]">
                    {r.transliteration ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-[var(--text-muted)]">
                    {r.definition ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}

function stripTerminator(s: string): string {
  // Many kjv_usage values end with a period — cosmetic cleanup.
  return s.replace(/\.$/, "").trim();
}
