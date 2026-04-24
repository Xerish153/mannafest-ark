import type { BookGroup } from "@/lib/bible/book-groups";

export type CategoryBookCard = {
  slug: string;
  name: string;
  chapterCount: number;
  preview: string | null;
};

export type CategoryLandingData = {
  group: BookGroup;
  intro: string[]; // ordered paragraphs
  books: CategoryBookCard[];
};
