"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSupabaseSession } from "@/hooks/useSupabaseSession";

/**
 * Batch 7 — Reader preferences hook.
 *
 * Resolution order per `user_preferences` migration spec:
 *   1. Account preference (logged-in user, persisted in `user_preferences`)
 *   2. localStorage fallback under `mannafest:prefs` (anon users)
 *   3. Hard defaults (distraction_free / KJV / commentary_compressed=true)
 *
 * The returned `setPref(key, value)` updates the correct store automatically
 * — server for logged-in users, localStorage for anon — and optimistically
 * updates local state so the reader reflects the change immediately.
 *
 * Mirror of the same shape as the /api/user-preferences route's
 * UserPreferences type so the two surfaces round-trip.
 */

export type ReadingLayer = "distraction_free" | "sectioned";
export type PreferredTranslation = "KJV" | "WEB" | "ASV";

export type ReadingPreferences = {
  reading_layer: ReadingLayer;
  preferred_translation: PreferredTranslation;
  commentary_compressed: boolean;
};

export const DEFAULT_READING_PREFERENCES: ReadingPreferences = {
  reading_layer: "distraction_free",
  preferred_translation: "KJV",
  commentary_compressed: true,
};

const LOCAL_STORAGE_KEY = "mannafest:prefs";

function isReadingLayer(v: unknown): v is ReadingLayer {
  return v === "distraction_free" || v === "sectioned";
}

function isPreferredTranslation(v: unknown): v is PreferredTranslation {
  return v === "KJV" || v === "WEB" || v === "ASV";
}

function readLocalPrefs(): ReadingPreferences {
  if (typeof window === "undefined") return { ...DEFAULT_READING_PREFERENCES };
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_READING_PREFERENCES };
    const parsed = JSON.parse(raw) as Partial<ReadingPreferences>;
    return {
      reading_layer: isReadingLayer(parsed.reading_layer)
        ? parsed.reading_layer
        : DEFAULT_READING_PREFERENCES.reading_layer,
      preferred_translation: isPreferredTranslation(parsed.preferred_translation)
        ? parsed.preferred_translation
        : DEFAULT_READING_PREFERENCES.preferred_translation,
      commentary_compressed:
        typeof parsed.commentary_compressed === "boolean"
          ? parsed.commentary_compressed
          : DEFAULT_READING_PREFERENCES.commentary_compressed,
    };
  } catch {
    return { ...DEFAULT_READING_PREFERENCES };
  }
}

function writeLocalPrefs(prefs: ReadingPreferences): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Quota exceeded / private browsing / storage disabled — swallow.
    // Reader still renders correctly; prefs just won't persist.
  }
}

type HookValue = {
  prefs: ReadingPreferences;
  loading: boolean;
  setPref: <K extends keyof ReadingPreferences>(
    key: K,
    value: ReadingPreferences[K],
  ) => void;
};

export function useReadingPreferences(): HookValue {
  const { user, loading: authLoading } = useSupabaseSession();
  const [prefs, setPrefs] = useState<ReadingPreferences>(DEFAULT_READING_PREFERENCES);
  const [loading, setLoading] = useState(true);
  // Track whether we've completed the initial hydration so setPref doesn't
  // overwrite server state with stale defaults on the first render.
  const hydratedRef = useRef(false);

  // Initial hydration: server if logged-in, localStorage if anon.
  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;

    (async () => {
      if (user) {
        try {
          const res = await fetch("/api/user-preferences", {
            method: "GET",
            credentials: "include",
          });
          if (res.ok) {
            const body = (await res.json()) as { preferences: ReadingPreferences };
            if (!cancelled) {
              setPrefs(body.preferences);
              hydratedRef.current = true;
              setLoading(false);
              return;
            }
          }
        } catch {
          // Network failure — fall through to localStorage.
        }
      }
      if (!cancelled) {
        setPrefs(readLocalPrefs());
        hydratedRef.current = true;
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  const setPref = useCallback<HookValue["setPref"]>(
    (key, value) => {
      // Optimistic local update.
      setPrefs((prev) => {
        const next = { ...prev, [key]: value };
        if (!hydratedRef.current) return next;

        if (user) {
          // Fire-and-forget server update. If it fails we accept the drift;
          // the next hydration will reconcile.
          void fetch("/api/user-preferences", {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ [key]: value }),
          }).catch(() => {
            /* non-blocking */
          });
        } else {
          writeLocalPrefs(next);
        }
        return next;
      });
    },
    [user],
  );

  return { prefs, loading, setPref };
}
