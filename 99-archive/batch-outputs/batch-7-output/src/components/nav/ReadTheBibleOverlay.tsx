"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useBookOverlay } from "./BookOverlayProvider";
import BookGroupColumn from "./BookGroupColumn";
import BookGroupAccordion from "./BookGroupAccordion";
import { BOOK_GROUPS } from "@/lib/bible/book-groups";

/**
 * Batch 7 — the Read the Bible overlay.
 *
 * Desktop: 10-column grid (one per book group). Group header → /group/:slug.
 * Book chip → /book/:slug.
 *
 * Mobile: accordion. Gospels open by default; others collapsed.
 *
 * Keyboard: Esc closes; focus trapped; body scroll locked while open;
 * first focusable element receives focus on open.
 */
export default function ReadTheBibleOverlay() {
  const { isOpen, close } = useBookOverlay();
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on pathname change (navigating via a link inside the overlay).
  useEffect(() => {
    if (isOpen) close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === "Tab" && overlayRef.current) {
        const focusables = overlayRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);

    const focusTimer = window.setTimeout(() => {
      const first = overlayRef.current?.querySelector<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      first?.focus();
    }, 10);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(focusTimer);
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Read the Bible"
      className="fixed inset-0 z-[60] bg-[#08090C]/98 backdrop-blur-sm overflow-y-auto animate-[fadeIn_180ms_ease-out]"
    >
      <div className="sticky top-0 h-14 bg-[#08090C] border-b border-[#1E2028] flex items-center justify-between px-4 sm:px-6">
        <span className="font-[family-name:var(--font-cinzel)] text-[#C9A227] text-sm tracking-widest">
          MANNAFEST · READ THE BIBLE
        </span>
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="w-10 h-10 flex items-center justify-center rounded hover:bg-[#1E2028] transition-colors text-[#F0EDE8] text-xl"
        >
          ×
        </button>
      </div>

      {/* Desktop — 10 columns */}
      <div className="hidden md:block max-w-[90rem] mx-auto px-6 lg:px-10 py-10">
        <div className="grid grid-cols-5 lg:grid-cols-10 gap-x-8 gap-y-10">
          {BOOK_GROUPS.map((group) => (
            <BookGroupColumn key={group.slug} group={group} onNavigate={close} />
          ))}
        </div>
      </div>

      {/* Mobile — accordion, Gospels open by default */}
      <div className="md:hidden max-w-xl mx-auto px-4 py-6">
        {BOOK_GROUPS.map((group) => (
          <BookGroupAccordion
            key={group.slug}
            group={group}
            defaultOpen={group.slug === "gospels"}
            onNavigate={close}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
