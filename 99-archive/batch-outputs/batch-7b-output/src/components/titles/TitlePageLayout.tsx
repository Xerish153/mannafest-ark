import EditorialSlot from "@/components/EditorialSlot";
import type { JesusTitleWithRefs } from "@/lib/titles/types";
import TitleHeader from "./TitleHeader";
import OriginalLanguageOriginCard from "./OriginalLanguageOriginCard";
import OriginSection from "./OriginSection";
import DeclarationSection from "./DeclarationSection";
import TheologicalMeaningSection from "./TheologicalMeaningSection";
import TitleCommentarySection from "./TitleCommentarySection";
import TitleCrossLinks from "./TitleCrossLinks";

/**
 * <TitlePageLayout /> — uniform profile template applied to all 17 title
 * pages. Depth comes from content density, not from bespoke per-title
 * depth-1 visuals.
 *
 * Empty sections hide completely — no placeholder text, no "under
 * construction" language (per batch constraints).
 */
export default function TitlePageLayout({
  data,
}: {
  data: JesusTitleWithRefs;
}) {
  return (
    <article className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <TitleHeader title={data} />
      <OriginalLanguageOriginCard title={data} />

      <OriginSection title={data} refs={data.refs} />

      <div className="mb-6">
        <EditorialSlot
          id={`title-${data.slug}-between-origin-declaration`}
          hint={`Inline editor's note between Origin and Declaration for ${data.name}`}
        />
      </div>

      <DeclarationSection title={data} refs={data.refs} />

      <TheologicalMeaningSection title={data} />

      <TitleCommentarySection refs={data.refs} />

      <TitleCrossLinks title={data} refs={data.refs} />
    </article>
  );
}
