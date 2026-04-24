"use client";

import { useEffect, useState, type ReactNode } from "react";
import ChapterNavigationBar from "./ChapterNavigationBar";
import ChapterSummaryBlock from "./ChapterSummaryBlock";
import DistractionFreeLayer from "./DistractionFreeLayer";
import SectionedLayer from "./SectionedLayer";
import { useReadingPreferences } from "@/hooks/useReadingPreferences";
import type { ReaderBundle } from "./types";

/**
 * Top-level reader orchestration. Takes the bundle from the server and
 * renders the chosen layer. The optional `textualEvidence` slot is used on
 * Mark 16 and John 21 (Phase 8 content); the chapter page passes the
 * rendered panel in, the reader places it per layer:
 *   - Sectioned: panel at top of the column, above the section list.
 *   - Distraction-free: a small "Textual notes available" link at the end
 *     (so focus-mode readers know richer evidence exists).
 */
export default function ChapterReader({
  bundle,
  textualEvidence,
}: {
  bundle: ReaderBundle;
  textualEvidence?: ReactNode;
}) {
  const { prefs, setPref } = useReadingPreferences();
  const [layer, setLayer] = useState<"distraction_free" | "sectioned">(
    prefs.reading_layer,
  );
  const [compressed, setCompressed] = useState<boolean>(prefs.commentary_compressed);

  useEffect(() => {
    setLayer(prefs.reading_layer);
    setCompressed(prefs.commentary_compressed);
  }, [prefs.reading_layer, prefs.commentary_compressed]);

  const onLayerChange = (next: "distraction_free" | "sectioned") => {
    setLayer(next);
    setPref("reading_layer", next);
  };
  const onCompressedChange = (next: boolean) => {
    setCompressed(next);
    setPref("commentary_compressed", next);
  };

  return (
    <div className="min-h-screen bg-[#08090C] pb-24">
      <ChapterNavigationBar
        bundle={bundle}
        layer={layer}
        compressed={compressed}
        onLayerChange={onLayerChange}
        onCompressedChange={onCompressedChange}
      />

      <div className="pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <header className="text-center mb-6">
            <h1 className="font-[family-name:var(--font-cinzel)] text-3xl sm:text-4xl text-white">
              {bundle.book.name} {bundle.book.chapter}
            </h1>
            <p className="text-[#6B7280] text-sm mt-1 font-[family-name:var(--font-inter)]">
              {bundle.verses.length} verses · {bundle.translation}
            </p>
          </header>

          <ChapterSummaryBlock bundle={bundle} />
        </div>

        {/* Sectioned layer places the evidence panel above sections. */}
        {layer === "sectioned" && textualEvidence ? (
          <div className="mb-4">{textualEvidence}</div>
        ) : null}

        {layer === "distraction_free" ? (
          <DistractionFreeLayer
            bundle={bundle}
            onRequestSectioned={() => onLayerChange("sectioned")}
            hasTextualEvidence={Boolean(textualEvidence)}
          />
        ) : (
          <SectionedLayer bundle={bundle} compressed={compressed} />
        )}
      </div>
    </div>
  );
}
