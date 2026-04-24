/**
 * Server-side Supabase clients for App Router server components and route handlers.
 *
 * - `createSupabaseServerClient()` — cookie-aware anon client. Reads the
 *   logged-in user's session from cookies. Use for server-component reads and
 *   for establishing the caller's identity inside route handlers. Obeys RLS.
 *
 * - `createSupabaseServiceClient()` — service-role client. Bypasses RLS.
 *   Used in route handlers AFTER `requireSuperAdmin()` has passed, so that
 *   super-admin writes to editorial_notes and curation updates to
 *   commentaries land without fighting the row-lockdown policies.
 *
 * Why two clients: the Doctrine C row-lockdown policies on editorial_notes
 * forbid authenticated-role writes. The only path to a write is a server
 * context running with the service-role key. The pattern is: identify the
 * caller via the cookie client, check is_admin, then perform the mutation
 * via the service client.
 */

import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Server components can't set cookies directly in Next 16;
            // auth refresh happens on the next request through middleware.
          }
        },
      },
    },
  );
}

export function createSupabaseServiceClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is required for privileged writes. " +
        "Set it in .env.local before running super-admin write paths.",
    );
  }
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
