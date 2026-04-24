import "server-only";
import { bookBySlug } from "@/lib/bible/book-slugs";
import type { BookGroup } from "@/lib/bible/book-groups";
import type { CategoryBookCard, CategoryLandingData } from "./types";
import { GROUP_INTRO, GROUP_BOOK_PREVIEW } from "./intro-copy";

export async function loadCategoryLandingData(
  group: BookGroup,
): Promise<CategoryLandingData> {
  const books: CategoryBookCard[] = group.books
    .map((slug) => {
      const m = bookBySlug(slug);
      if (!m) return null;
      return {
        slug: m.slug,
        name: m.name,
        chapterCount: m.chapterCount,
        preview: GROUP_BOOK_PREVIEW[m.slug] ?? null,
      };
    })
    .filter((b): b is CategoryBookCard => b !== null);

  const intro = GROUP_INTRO[group.slug] ?? [group.blurb];

  return { group, intro, books };
}
