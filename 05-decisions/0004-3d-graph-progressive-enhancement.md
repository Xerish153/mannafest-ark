# ADR 0004 — 3D graph: progressive enhancement

**Date:** 2026-04-16
**Status:** Accepted
**Decider:** Marcus Brown

## Context

The MannaFest explore page currently uses a 2D graph component. Desktop users would benefit from a richer 3D nebula-style visualization (particle trails, bloom, depth) that communicates the graph's connective density viscerally. Mobile users, however, need the 2D version — the 3D version would be too performance-heavy on mobile and too hard to navigate on small screens.

Additionally, the graph has 1,299,669 edges total. Any naive load would crash browsers. Initial render must be constrained to core typology/prophecy_fulfillment/thematic edges (~169 total), with progressive loading of commentary (~1,189) and cross-reference (~1.29M, paginated to focus-node neighborhood) as users request.

## Decision

Implement the 3D graph as **feature-flagged progressive enhancement**:

1. **Feature flag:** `NEXT_PUBLIC_GRAPH_3D_ENABLED` env var gates the 3D code path entirely. Default off in production until stability proven.
2. **Desktop detection:** `useMediaQuery('(min-width: 1024px)')` determines eligibility.
3. **User preference:** stored in `localStorage` under `mannafest:graph-mode` — user can toggle 2D/3D.
4. **Mobile always 2D:** even with flag on, mobile viewport forces 2D.
5. **Progressive edge loading:** `/api/graph/edges?layer=core|commentary|crossref&focus_node_id=N&limit=500` — default initial fetch is `layer=core`.
6. **LOD thresholds:** <500 nodes → labels always; 500-2000 → labels on hover; >2000 → no labels.
7. **ConnectionPanel:** slides in on link click; reads `connection_explanations` table by (source, target, type).

## Consequences

- Safe rollout: if 3D breaks, flag defaults to off and 2D continues to work.
- Mobile is protected from performance disasters.
- Users can opt out of 3D per-session.
- Cross-reference edges (the 1.29M) load only when user focuses a specific node — preserving performance.

## Status as of Cowork Session 1 (2026-04-16)

**Deferred.** Phase 6 of the master brief (3D graph implementation in the Next.js repo) was explicitly skipped in this Cowork session because the repo is mounted separately. A follow-up Cowork session with the repo mounted will execute Phase 6 per the brief. The schema dependencies (`connection_explanations` table and seeded entries) that Phase 6 would consume are in place.
