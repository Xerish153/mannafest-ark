/**
 * Batch 7 — layout shell for /read/:book/:chapter. The ChapterReader owns
 * its own chrome (ChapterNavigationBar is the in-content sticky bar), so
 * this layout just passes children through. Exists only to override any
 * parent layout chrome that would compete with the reader's focus mode.
 */
export default function ReadChapterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
