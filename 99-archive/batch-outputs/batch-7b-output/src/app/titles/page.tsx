import type { Metadata } from "next";
import ClusterHubLayout from "@/components/titles/ClusterHubLayout";
import { loadPublishedTitles } from "@/lib/titles/loader";

export const metadata: Metadata = {
  title: "Titles of Christ — MannaFest",
  description:
    "The names Scripture gives to Jesus — Christ, Lamb of God, Son of David, Logos, Immanuel, and more. The doctrine of Christ through his titles.",
};

export default async function TitlesHub() {
  const titles = await loadPublishedTitles();
  return <ClusterHubLayout titles={titles} />;
}
