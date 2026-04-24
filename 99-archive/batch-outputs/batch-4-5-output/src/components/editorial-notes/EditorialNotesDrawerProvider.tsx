"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import {
  isDrawerExcludedRoute,
  type EditorialNote,
  type SurfaceType,
} from "@/lib/supabase/schemas/editorial_notes";
import { EditorialNotesDrawer } from "./EditorialNotesDrawer";

/**
 * <EditorialNotesDrawerProvider /> — app-shell wrapper.
 *
 * Lives in src/app/layout.tsx just inside <Providers>. Determines the current
 * editorial surface from pathname (route-typed by default; node-typed when a
 * node page registers itself via useRegisterEditorialSurface).
 *
 * Renders nothing extra on excluded routes (homepage, /search, /admin,
 * /account, /about, /graph, verse pages — per Vision v2 §4.3.4).
 *
 * Super-admin state is passed in from the server layout so the drawer can
 * decide client-side whether to show affordances without an extra fetch on
 * mount.
 */

type Surface = {
  type: SurfaceType;
  id: string;
};

type EditorialNotesContextValue = {
  surface: Surface | null;
  setNodeSurface: (surfaceId: string | null) => void;
  superAdmin: boolean;
  notes: EditorialNote[];
  isLoading: boolean;
  reload: () => Promise<void>;
};

const EditorialNotesContext = createContext<EditorialNotesContextValue | null>(
  null,
);

export function useEditorialNotesContext(): EditorialNotesContextValue {
  const ctx = useContext(EditorialNotesContext);
  if (!ctx) {
    throw new Error(
      "useEditorialNotesContext must be used inside EditorialNotesDrawerProvider",
    );
  }
  return ctx;
}

/**
 * Hook for pages that address editorial notes by node UUID (character, place,
 * concept, number nodes) rather than by pathname. Call inside the page's
 * client component (or inside a small ClientBoundary wrapper) with the node's
 * UUID. The hook clears the node surface on unmount so switching pages
 * doesn't leak the previous node's notes.
 */
export function useRegisterEditorialSurface(nodeId: string | null): void {
  const ctx = useContext(EditorialNotesContext);
  useEffect(() => {
    if (!ctx) return;
    ctx.setNodeSurface(nodeId);
    return () => ctx.setNodeSurface(null);
  }, [ctx, nodeId]);
}

export type EditorialNotesDrawerProviderProps = {
  initialSuperAdmin: boolean;
  children: ReactNode;
};

export function EditorialNotesDrawerProvider({
  initialSuperAdmin,
  children,
}: EditorialNotesDrawerProviderProps) {
  const pathname = usePathname() ?? "/";
  const [nodeSurfaceId, setNodeSurfaceId] = useState<string | null>(null);
  const [notes, setNotes] = useState<EditorialNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const excluded = isDrawerExcludedRoute(pathname);

  const surface: Surface | null = useMemo(() => {
    if (excluded) return null;
    if (nodeSurfaceId) return { type: "node", id: nodeSurfaceId };
    return { type: "route", id: pathname };
  }, [excluded, nodeSurfaceId, pathname]);

  const load = useCallback(async () => {
    if (!surface) {
      setNotes([]);
      return;
    }
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        surface_type: surface.type,
        surface_id: surface.id,
      });
      if (initialSuperAdmin) params.set("include_all", "1");
      const res = await fetch(`/api/editorial-notes?${params.toString()}`, {
        cache: "no-store",
      });
      if (!res.ok) {
        setNotes([]);
        return;
      }
      const payload = (await res.json()) as { notes?: EditorialNote[] };
      setNotes(payload.notes ?? []);
    } catch {
      setNotes([]);
    } finally {
      setIsLoading(false);
    }
  }, [surface, initialSuperAdmin]);

  useEffect(() => {
    void load();
  }, [load]);

  const value = useMemo<EditorialNotesContextValue>(
    () => ({
      surface,
      setNodeSurface: setNodeSurfaceId,
      superAdmin: initialSuperAdmin,
      notes,
      isLoading,
      reload: load,
    }),
    [surface, initialSuperAdmin, notes, isLoading, load],
  );

  return (
    <EditorialNotesContext.Provider value={value}>
      {children}
      {!excluded && surface && <EditorialNotesDrawer />}
    </EditorialNotesContext.Provider>
  );
}

export default EditorialNotesDrawerProvider;
