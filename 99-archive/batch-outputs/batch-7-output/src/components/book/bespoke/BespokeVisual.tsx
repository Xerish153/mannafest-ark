"use client";

import MatthewDiscourseColumns from "./MatthewDiscourseColumns";
import MarkTwoPanelArc from "./MarkTwoPanelArc";
import LukeJourneyRibbon from "./LukeJourneyRibbon";
import JohnPairedSevens from "./JohnPairedSevens";
import ActsJourneyMap from "./ActsJourneyMap";
import type { BookHubData } from "../types";

/**
 * Dispatch to the per-Gospel bespoke depth-1 visual.
 */
export default function BespokeVisual({
  kind,
  data,
}: {
  kind: NonNullable<BookHubData["bespokeVisual"]>;
  data: BookHubData;
}) {
  switch (kind) {
    case "matthew":
      return <MatthewDiscourseColumns data={data} />;
    case "mark":
      return <MarkTwoPanelArc data={data} />;
    case "luke":
      return <LukeJourneyRibbon data={data} />;
    case "john":
      return <JohnPairedSevens data={data} />;
    case "acts":
      return <ActsJourneyMap data={data} />;
    default:
      return null;
  }
}
