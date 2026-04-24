/**
 * Super-admin role enforcement — server-side only.
 *
 * Today: `profiles.is_admin = true` is the gate. Pastor Marc's profile row
 * (id 9c6f1921-…, email contact@xerish.com / marcus.d.brown@protonmail.com)
 * is currently the only is_admin=true row.
 *
 * Future: when migration 024_super_admin_schema.sql applies to production
 * (it's in the repo but unapplied as of Batch 4+5), flip the select to
 * `role` and compare to 'super_admin'. That change is one line here.
 *
 * Paired with the existing `src/lib/admin/requireAdmin.ts` which redirects
 * non-admins for /admin/* server pages. This helper is the API-route
 * counterpart — it THROWS with a proper HTTP status so routes return
 * 401/403 instead of redirecting.
 *
 * Uses the service-role client for the profile lookup so RLS on profiles
 * cannot lock the admin out of reading their own flag.
 *
 * This module is NEVER imported from a client component — "server-only"
 * keeps the boundary explicit.
 */

import "server-only";

import {
  createSupabaseServerClient,
  createSupabaseServiceClient,
} from "@/lib/supabase/server";

export class SuperAdminError extends Error {
  status: 401 | 403;
  constructor(message: string, status: 401 | 403) {
    super(message);
    this.name = "SuperAdminError";
    this.status = status;
  }
}

/**
 * Throws SuperAdminError(401) if unauthenticated.
 * Throws SuperAdminError(403) if not super-admin.
 * Returns { userId } on success.
 *
 * API route usage:
 *
 *   try {
 *     const { userId } = await requireSuperAdmin();
 *     // ... perform write with service-role client
 *   } catch (err) {
 *     if (err instanceof SuperAdminError) {
 *       return new Response(err.message, { status: err.status });
 *     }
 *     throw err;
 *   }
 */
export async function requireSuperAdmin(): Promise<{ userId: string }> {
  const anon = await createSupabaseServerClient();
  const {
    data: { user },
  } = await anon.auth.getUser();

  if (!user) {
    throw new SuperAdminError("Unauthorized", 401);
  }

  // Service-role bypasses RLS so the admin's own profile row is always
  // readable. Matches the pattern used by src/lib/admin/requireAdmin.ts.
  const admin = createSupabaseServiceClient();
  const { data: profile, error } = await admin
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw new SuperAdminError("Forbidden", 403);
  }
  if (!profile?.is_admin) {
    throw new SuperAdminError("Forbidden", 403);
  }

  return { userId: user.id };
}

/**
 * Non-throwing variant for client-aware server components that want to
 * conditionally render super-admin affordances without tripping error
 * boundaries. Never use this as the sole gate on a mutation.
 *
 * Note: safe to call from the app shell (layout.tsx) — an unauthenticated
 * call returns false cleanly rather than throwing.
 */
export async function isSuperAdmin(): Promise<boolean> {
  try {
    await requireSuperAdmin();
    return true;
  } catch {
    return false;
  }
}
