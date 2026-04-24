"use client";

import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

/**
 * <MarkdownPreview /> — shared sanitized renderer for editorial notes.
 *
 * Used by:
 *  - <EditorialNoteCard /> for the public render of a note.
 *  - <EditorialNoteEditor /> for the live preview alongside the textarea.
 *
 * Safety posture:
 *  - Sanitized via rehype-sanitize's default schema. No raw HTML,
 *    no <script>, no <iframe>, no inline event handlers.
 *  - GFM features (tables, strikethrough, autolink) enabled via remark-gfm.
 *  - Internal links (starting with "/" or "#") render as Next.js <Link>;
 *    external links open in a new tab with noopener/noreferrer. The custom
 *    link renderer attaches className/target/rel as React props on its own
 *    output — it doesn't need those attributes to survive the sanitize
 *    pass, so the default schema is sufficient.
 *
 * Pastor Marc authors notes; a compromised author is out of scope. Sanitizing
 * anyway because notes pass through the DB, where future tooling / auth
 * changes could widen the authorship. Defense-in-depth.
 */

const components: Components = {
  a({ href, children, ...props }) {
    const url = String(href ?? "");
    const isInternal = url.startsWith("/") || url.startsWith("#");
    if (isInternal) {
      return (
        <Link href={url} className="text-[var(--accent)] hover:underline" {...(props as Record<string, unknown>)}>
          {children}
        </Link>
      );
    }
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[var(--accent)] hover:underline"
      >
        {children}
      </a>
    );
  },
  // Keep markdown blockquotes quiet and readable inside the drawer card.
  blockquote({ children }) {
    return (
      <blockquote className="border-l-2 border-[var(--ink-100)] pl-3 italic text-[var(--text-muted)]">
        {children}
      </blockquote>
    );
  },
};

export type MarkdownPreviewProps = {
  source: string;
  className?: string;
};

export function MarkdownPreview({ source, className }: MarkdownPreviewProps) {
  return (
    <div
      className={`prose prose-sm max-w-none font-serif text-[var(--ink-900)] [&>*:first-child]:mt-0 ${className ?? ""}`.trim()}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={components}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownPreview;
