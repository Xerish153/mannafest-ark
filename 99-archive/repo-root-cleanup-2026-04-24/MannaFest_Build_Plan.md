# MannaFest — Build Plan (Cowork Operating Doc)

> **Purpose.** Execute Vision v2 in large, reviewable chunks via Cowork. Pin alongside `STATUS.md` and `Vision_v2_Locked.md`. Update as chunks close.
>
> **Operating rule.** Cowork runs in big batches. Your job between batches is to review, not to nudge. If a batch is too big to review in ~30 minutes, it was scoped wrong.

---

## 1. Operating Philosophy

Three rules that make Cowork work for a project this size:

### Rule 1 — Blueprint before implement
Every implementation batch is preceded by a *blueprint batch*. The blueprint reads the codebase, maps the current state, produces a written spec, and stops. You review the blueprint. Then a separate implementation batch executes the blueprint.

This prevents the single worst failure mode: agents writing thousands of lines against a misread of what the code actually does.

### Rule 2 — One chunk = one reviewable unit
A chunk has:
- **One clear goal** (not three)
- **Defined inputs** (which files, which docs)
- **Defined deliverables** (what shows up at the end)
- **Acceptance criteria** (how you know it's done)
- **Out-of-scope list** (what the agent must not touch)

If a chunk is vaguer than that, stop and sharpen it before running.

### Rule 3 — Always pass the three pinned docs as context
Every Cowork prompt begins with:
> Read these first: `STATUS.md`, `Vision_v2_Locked.md`, `Build_Plan.md`. They are authoritative. Follow §12 of Vision v2 as non-negotiable rules.

Without this, drift is guaranteed.

---

## 2. The 12-Chunk Sequence

Organized into the three phases from Vision v2 §9. Each chunk is sized for a Cowork batch and has a review gate at the end.

### Phase 1 — Foundation

| # | Chunk | Type | Blocks | Est. review time |
|---|---|---|---|---|
| 1.1 | Nav audit + blueprint | Blueprint | — | 20 min |
| 1.2 | Nav implementation | Implementation | 1.1 | 30 min (click-through) |
| 1.3 | 2D nebula blueprint | Blueprint | 1.2 | 20 min |
| 1.4 | 2D nebula implementation | Implementation | 1.3 | 30 min |
| 1.5 | Homepage redesign | Implementation | 1.2 | 15 min |

### Phase 2 — Schema & Accounts

| # | Chunk | Type | Blocks | Est. review time |
|---|---|---|---|---|
| 2.1 | Node-type schemas (Person/Place/Manuscript/Event) | Blueprint + impl | 1.2 | 30 min |
| 2.2 | Super-admin panel | Implementation | 2.1 | 30 min |
| 2.3 | User account upgrades (history, ledger, bookmarks) | Implementation | 1.2 | 20 min |

### Phase 3 — Content (begins after Phases 1–2)

| # | Chunk | Type | Blocks | Est. review time |
|---|---|---|---|---|
| 3.1 | 40 character profiles (Guzik-verified, open-source only) | Content | 2.1 | 45 min (spot check) |
| 3.2 | 30 place profiles with maps | Content | 2.1 | 45 min |
| 3.3 | Manuscript entries (DSS, Sinaiticus, Vaticanus, Masoretic, Septuagint, Peshitta) | Content | 2.1 | 30 min |
| 3.4 | Feature pages (Isaiah Mini-Bible, Bronze Serpent, Suffering Servant, Seed Promise, Genealogies, Bible Codes) | Content | 2.1 + debated-content notice component | 60 min |

---

## 3. Chunk Specs

What each chunk's Cowork prompt should specify. Copy-paste structure.

### Chunk 1.1 — Nav audit + blueprint
- **Goal:** Produce a written spec for the nav overhaul. Do not write implementation code.
- **Inputs:** entire repo; Vision v2 §6.1.
- **Deliverables:**
  1. `docs/nav-audit.md` — current state: every file that defines/uses a header, every route that renders something nav-adjacent, every inconsistency.
  2. `docs/nav-blueprint.md` — target state: one persistent header component spec, menu overlay spec, breadcrumb component spec, route structure, file-by-file migration plan.
- **Out of scope:** writing any production code, modifying any files outside `docs/`.
- **Acceptance:** the blueprint is detailed enough that 1.2 can execute it without further design decisions.

### Chunk 1.2 — Nav implementation
- **Goal:** Execute `docs/nav-blueprint.md` exactly.
- **Deliverables:** single persistent header live on every page; menu overlay functional; breadcrumbs on every deep page; every route clean and deep-linkable; back button works.
- **Out of scope:** new features, design tweaks not in the blueprint, touching graph/homepage/content pages beyond what the nav change requires.
- **Acceptance:** click-through audit — every page has identical header, working menu, working breadcrumbs, clean URL.

### Chunk 1.3 — 2D nebula blueprint
- **Goal:** Produce a written spec for replacing `react-force-graph-3d` with `react-force-graph-2d`. No implementation.
- **Inputs:** current 3D graph code; Vision v2 §5.5 and §6.3; Obsidian's graph view as visual reference.
- **Deliverables:**
  1. `docs/graph-audit.md` — current 3D implementation mapped.
  2. `docs/graph-blueprint.md` — target: component structure, data flow, styling spec (node sizing, color by type, edge style, hover behavior, click behavior, filter panel, depth control), archival plan for 3D code.
- **Out of scope:** writing graph code.
- **Acceptance:** blueprint covers every interaction in §6.3.

### Chunk 1.4 — 2D nebula implementation
- **Goal:** Execute `docs/graph-blueprint.md`.
- **Deliverables:** working 2D graph using `react-force-graph-2d`; 3D code archived to a feature branch (not deleted); filters and hover/click behaviors match spec.
- **Acceptance:** load the graph, hover a node, click a node, filter by type, change depth. All behaviors match spec on a mid-range laptop.

### Chunk 1.5 — Homepage redesign
- **Goal:** Rebuild homepage per Vision v2 §6.2.
- **Deliverables:** search bar as primary centered affordance; Verse of the Day section showcasing features (mode toggle, graph hover, commentary expand); section-routing cards.
- **Out of scope:** dense content, marketing copy, About Me page (separate chunk).
- **Acceptance:** a new visitor can reach any pillar in one click.

### Chunk 2.1 — Node-type schemas
- **Goal:** Add Person, Place, Manuscript, Event as first-class node types.
- **Deliverables:** Postgres migrations; TypeScript types; admin CRUD UI; template page for each type; 5 seed instances per type.
- **Out of scope:** content population beyond seed.
- **Acceptance:** founder can create a new character in the admin UI and see its template page render.

### Chunk 2.2 — Super-admin panel
- **Goal:** Implement Vision v2 §8.2.
- **Deliverables:** role-based auth (super-admin flag in Supabase); in-app edit UI for every node and edge type; debated-content notice toggle; trail-insight framework (UI + DB schema for insights, but no authored content yet); analytics surface (search queries logged, page-view counts).
- **Acceptance:** founder can add/edit/delete any node or edge without touching the repo, and can toggle the debated-content notice on any page.

### Chunk 2.3 — User account upgrades
- **Goal:** Implement Vision v2 §8.1.
- **Deliverables:** history (chronological page list); ledger (saved nodes/trails/verses); bookmarks with tags; private notes on nodes; mode preference persisted per user.
- **Acceptance:** logged-in user can navigate the site for 10 minutes and then see their history, save a verse, bookmark it with a tag, and write a private note.

### Chunk 3.1–3.4 — Content batches
Each is structured the same:
- **Goal:** populate N instances of a node type.
- **Inputs:** Vision v2 §4 source rules — open-source only, Guzik-verified, Wesley Huff quality bar, AI synthesis only.
- **Deliverables:** N completed records with cited sources for every substantive claim.
- **Out of scope:** authoring revelation points; speculative claims not in sourced material.
- **Acceptance:** spot-check 5 random records. Every factual claim traces to an open-source, reputable citation.

---

## 4. Weekly Cadence

The Friday 20-minute ritual from STATUS.md, adapted for Cowork operation:

**Monday** — Pick the week's chunk. Write the Cowork prompt. Queue it. Start it running.

**Tue–Thu** — Your job is *not* MannaFest. Cowork is working. Do the other things in your life. Check that the batch is progressing, not babysit.

**Friday** — Review the chunk output. If it passed:
1. Update `STATUS.md` — move completed chunk, add any new parking-lot items, update health, update "what changed this update."
2. Queue next week's chunk.

If it didn't pass:
1. Don't rerun the whole thing. Diagnose what went wrong (prompt unclear? blueprint incomplete? codebase surprise?).
2. Write a sharper targeted prompt for the gap.
3. Queue for next week.

---

## 5. What NOT To Do

Failure modes that kill projects at this scale. Avoid them.

- **Don't run two chunks in parallel on the same area of the codebase.** Merge conflicts and inconsistent decisions result. Parallel-safe means *different areas*.
- **Don't skip blueprints to save time.** Every time you skip, you lose more time in rework than you saved.
- **Don't let content chunks (Phase 3) start before Phases 1–2 are solid.** Content built on a broken nav or missing schema is content that must be redone.
- **Don't update the vision doc in response to a single bad batch.** One bad batch is a prompt problem or a scope problem, not a vision problem.
- **Don't add new chunks to the sequence without closing old ones.** The sequence in §2 is the sequence. When you want to insert something new, note it in the parking lot and decide where it fits at the next Friday review.
- **Don't let `STATUS.md` and `Vision_v2_Locked.md` and this doc drift out of sync.** If Vision v2 changes, the chunk list here changes. If the chunk list changes, STATUS changes.

---

## 6. When to Deviate

This plan is a default, not a cage. Deviate when:

- You discover a structural issue that changes the architecture (rare — but real).
- A chunk turns out to be 3x the expected size and needs to split.
- A new opportunity appears (e.g., Enduring Word announces an API) that reshuffles priorities.
- You hit a block that makes a chunk impossible (licensing, library bug, Supabase limit).

When you deviate, write down *why* in a Decision Log entry (bottom of `STATUS.md`). Future-you will want to know.

---

## 7. First Action

Right now, before anything else:

1. Pin `STATUS.md`, `Vision_v2_Locked.md`, and this doc (`Build_Plan.md`) in the Claude Project.
2. Queue **Chunk 1.1 — Nav audit + blueprint** as this week's Cowork batch.
3. Close this doc. Go do something else. Cowork is on the clock.

The nav is the foundation. Everything else waits.
