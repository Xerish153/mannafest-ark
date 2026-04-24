"use client";

import BookHubHero from "./BookHubHero";
import BookHubMetadata from "./BookHubMetadata";
import BookHubStructure from "./BookHubStructure";
import BookHubThemes from "./BookHubThemes";
import BookHubKeyChapters from "./BookHubKeyChapters";
import BookHubChapterIndex from "./BookHubChapterIndex";
import BookHubCommentary from "./BookHubCommentary";
import BookHubFeaturedStudies from "./BookHubFeaturedStudies";
import BookHubRelatedNodes from "./BookHubRelatedNodes";
import BespokeVisual from "./bespoke/BespokeVisual";
import TextualEvidenceAnchor from "./TextualEvidenceAnchor";
import type { BookHubData } from "./types";

/**
 * Batch 7 — the universal book hub template. Tier 1 Gospel books (Matthew,
 * Mark, Luke, John, Acts) get a bespoke depth-1 visual above Structure.
 * Mark + John also surface a TextualEvidenceAnchor that links to the
 * respective chapter's full panel.
 */
export function BookHubLayout({ data }: { data: BookHubData }) {
  return (
    <div className="min-h-screen bg-[#08090C]">
      <BookHubHero data={data} />

      {data.bespokeVisual ? (
        <BespokeVisual kind={data.bespokeVisual} data={data} />
      ) : null}

      <BookHubMetadata data={data} />

      <BookHubStructure data={data} />
      <BookHubThemes data={data} />
      <BookHubKeyChapters data={data} />

      {/* Textual-evidence anchor — Mark + John only (Phase 8 content). */}
      {(data.meta.slug === "mark" || data.meta.slug === "john") ? (
        <TextualEvidenceAnchor bookSlug={data.meta.slug} />
      ) : null}

      <BookHubCommentary data={data} />
      <BookHubFeaturedStudies data={data} />
      <BookHubRelatedNodes data={data} />
      <BookHubChapterIndex data={data} />
    </div>
  );
}
