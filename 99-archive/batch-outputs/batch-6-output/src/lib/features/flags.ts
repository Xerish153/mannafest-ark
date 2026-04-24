/**
 * Feature flags — centralized, environment-driven, public (NEXT_PUBLIC_*)
 * so they work in both server and client components.
 *
 * Batch 6: graph UI is feature-flagged off on every non-admin surface. The
 * flag defaults to false; production sets NEXT_PUBLIC_GRAPH_ENABLED=false
 * in Vercel. /graph routes + admin routes are NOT gated (per Vision v2
 * §5.1 — graph stays accessible via the muted footer link and for
 * authoring/admin work during the exploratory period).
 *
 * Add future flags here as string-literal env reads — keep the pattern
 * boring. If you find yourself wanting a runtime DB-backed toggle, write a
 * proper feature-flags batch; don't extend this module.
 */

function readBool(env: string | undefined): boolean {
  return env === "true" || env === "1";
}

/**
 * True only when NEXT_PUBLIC_GRAPH_ENABLED is explicitly "true". Any other
 * value (undefined, "false", "", "0") returns false. The /graph routes
 * themselves remain accessible regardless — this flag is the gate on the
 * rest of the site's graph entry points (verse-page overflow menu, mini
 * graphs on person/place/theme pages, etc.).
 */
export const GRAPH_ENABLED: boolean = readBool(
  process.env.NEXT_PUBLIC_GRAPH_ENABLED,
);
