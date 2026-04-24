"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

/**
 * Batch 7 — Book-overlay provider. Mirrors the existing MenuProvider
 * pattern (open/close/toggle) for the "Read the Bible" overlay. Separate
 * context keeps it disentangled from the hamburger menu — both can be open
 * simultaneously and each has its own keyboard scope.
 */

type Ctx = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const BookOverlayContext = createContext<Ctx | null>(null);

export function BookOverlayProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  const value = useMemo<Ctx>(
    () => ({ isOpen, open, close, toggle }),
    [isOpen, open, close, toggle],
  );

  return (
    <BookOverlayContext.Provider value={value}>
      {children}
    </BookOverlayContext.Provider>
  );
}

export function useBookOverlay(): Ctx {
  const ctx = useContext(BookOverlayContext);
  if (!ctx) {
    throw new Error("useBookOverlay must be used within <BookOverlayProvider>");
  }
  return ctx;
}
