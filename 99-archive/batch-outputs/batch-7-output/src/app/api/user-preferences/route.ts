import { NextResponse } from "next/server";
import {
  createSupabaseServerClient,
  createSupabaseServiceClient,
} from "@/lib/supabase/server";

/**
 * Batch 7 — User reading preferences API.
 *
 * GET /api/user-preferences
 *   - Logged-in user: returns their row (creates a defaults row if none exists).
 *   - Anonymous: returns 401 so the hook falls back to localStorage.
 *
 * PATCH /api/user-preferences
 *   - Logged-in user: upserts a subset of preferences for the caller.
 *   - Anonymous: returns 401 so the hook writes to localStorage instead.
 *
 * This is a personalization RPC: identity comes from the cookie client
 * (RLS-obeying), writes happen via the service client (bypass RLS) but are
 * gated to the caller's own row. Anon users never reach Supabase for reader
 * preferences — they mirror the same shape in `mannafest:prefs` localStorage.
 */

export type ReadingLayer = "distraction_free" | "sectioned";
export type PreferredTranslation = "KJV" | "WEB" | "ASV";

export type UserPreferences = {
  reading_layer: ReadingLayer;
  preferred_translation: PreferredTranslation;
  commentary_compressed: boolean;
};

export const DEFAULT_READING_PREFERENCES: UserPreferences = {
  reading_layer: "distraction_free",
  preferred_translation: "KJV",
  commentary_compressed: true,
};

type PatchPayload = Partial<UserPreferences>;

function isReadingLayer(v: unknown): v is ReadingLayer {
  return v === "distraction_free" || v === "sectioned";
}

function isPreferredTranslation(v: unknown): v is PreferredTranslation {
  return v === "KJV" || v === "WEB" || v === "ASV";
}

function isValidPatchPayload(x: unknown): x is PatchPayload {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  if (o.reading_layer !== undefined && !isReadingLayer(o.reading_layer)) return false;
  if (
    o.preferred_translation !== undefined &&
    !isPreferredTranslation(o.preferred_translation)
  ) {
    return false;
  }
  if (
    o.commentary_compressed !== undefined &&
    typeof o.commentary_compressed !== "boolean"
  ) {
    return false;
  }
  // At least one field must be present
  return (
    o.reading_layer !== undefined ||
    o.preferred_translation !== undefined ||
    o.commentary_compressed !== undefined
  );
}

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Not authenticated — use localStorage fallback." },
      { status: 401 },
    );
  }

  // RLS self-read policy will only return the caller's row.
  const { data, error } = await supabase
    .from("user_preferences")
    .select("reading_layer, preferred_translation, commentary_compressed")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const prefs: UserPreferences = data
    ? {
        reading_layer: data.reading_layer as ReadingLayer,
        preferred_translation: data.preferred_translation as PreferredTranslation,
        commentary_compressed: data.commentary_compressed,
      }
    : { ...DEFAULT_READING_PREFERENCES };

  return NextResponse.json({ preferences: prefs });
}

export async function PATCH(req: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Not authenticated — use localStorage fallback." },
      { status: 401 },
    );
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!isValidPatchPayload(payload)) {
    return NextResponse.json(
      {
        error:
          "Invalid payload. Expected partial { reading_layer, preferred_translation, commentary_compressed }.",
      },
      { status: 400 },
    );
  }

  // Service client bypasses RLS; we explicitly gate writes to the caller's row.
  const service = createSupabaseServiceClient();
  const patch = payload as PatchPayload;

  const { data, error } = await service
    .from("user_preferences")
    .upsert(
      {
        user_id: user.id,
        ...patch,
      },
      { onConflict: "user_id" },
    )
    .select("reading_layer, preferred_translation, commentary_compressed")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    preferences: {
      reading_layer: data.reading_layer as ReadingLayer,
      preferred_translation: data.preferred_translation as PreferredTranslation,
      commentary_compressed: data.commentary_compressed,
    },
  });
}
