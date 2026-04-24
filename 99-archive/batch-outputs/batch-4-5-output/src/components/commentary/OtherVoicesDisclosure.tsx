"use client";

import { useState } from "react";
import type { CommentaryWithScholar } from "@/lib/supabase/schemas/commentaries";
import { CommentaryCard } from "./CommentaryCard";

export type OtherVoicesDisclosureProps = {
  voices: CommentaryWithScholar[];
};

/**
 * "Show other voices (N)" disclosure. Hidden entirely if the voices array is
 * empty — the parent <CommentarySection /> guards against that, but we double-
 * check here to keep the component safely reusable.
 *
 * Behavior:
 *  - Default: collapsed. Button reads "Show other voices (N)".
 *  - Click: expands into a sorted list of cards. Button toggles to "Hide other voices".
 *  - Cards are ordered by scholar.default_rank ASC (Calvin before Spurgeon before
 *    Matthew Henry, etc.). Stable on slug for equal ranks so the order is
 *    deterministic across reloads.
 */
export function OtherVoicesDisclosure({ voices }: OtherVoicesDisclosureProps) {
  const [open, setOpen] = useState(false);
  if (voices.length === 0) return null;

  const sorted = [...voices].sort((a, b) => {
    const rankDiff = a.scholar.default_rank - b.scholar.default_rank;
    if (rankDiff !== 0) return rankDiff;
    return a.scholar.slug.localeCompare(b.scholar.slug);
  });

  return (
    <section
      data-other-voices="true"
      aria-label="Additional commentary voices"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 text-sm text-[var(--accent)] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
        aria-expanded={open}
        aria-controls="commentary-other-voices-list"
      >
        {open ? "Hide other voices" : `Show other voices (${voices.length})`}
      </button>

      {open && (
        <ul
          id="commentary-other-voices-list"
          className="mt-4 space-y-4 list-none p-0"
        >
          {sorted.map((entry) => (
            <li key={entry.id}>
              <CommentaryCard entry={entry} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
