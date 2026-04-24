# Cowork Prompt — Chunk 2.1 + 2.4.A + v3 Addition: Complete Foundational Node-Type Schema Expansion

> **Paste this entire document into Cowork as the batch prompt.**
> **Queue this only after Chunk 1.3 (2D nebula migration) has merged to main.**
> **Estimated duration: 5–7 days of unattended Cowork work.**

---

## 0. Read First (Authoritative Context)

Before touching any code, read these files in full:

1. `STATUS.md`
2. `Vision_v2_Locked.md`
3. `MannaFest_Build_Plan_v3_Scripture_First.md`
4. The current repo in its entirety — especially `src/app/`, `src/components/`, Supabase migrations, and the existing node-and-edge data model

These documents are authoritative. If they conflict with this prompt, flag the conflict in your PR and stop. Do not proceed with a guess.

---

## 1. Non-Negotiable Rules (Apply To Every File You Touch)

1. **Single audience:** the student of the Bible who wants to learn. Every schema decision serves that student.
2. **Open-source data only.** No licensed content ingested or imported.
3. **Reputable sources only.** Wesley Huff-tier scholarship is the quality bar for any seed data you author.
4. **No AI-authored historical or theological claims.** Seed data summaries come from open-source scholarly material, with citations. If you cannot cite, do not write.
5. **Commentary is always attributed by author and tradition.** Never blended.
6. **Every edge has a written explanation.** No bare edges.
7. **No isolated nodes.** Every seeded node ships with a minimum of 3 outbound connections, each explained.
8. **The graph never navigates away** — clicks open the side panel, which this schema work must support.
9. **Jesus is the gravitational center.** Where a seed node has a Christological connection, wire it.
10. **Full-density pages.** No Beginner/Study/Deep gating. Density is managed by layout components, not by hiding data.
11. **Founder is the sole author of revelation notes.** Build the framework. Leave founder-commentary fields empty with the schema support in place.
12. **Scripture-first priority.** If you discover a desirable feature that isn't strictly required for this chunk, note it in `docs/parking-lot.md` and move on.
13. **Paginated Supabase queries only.** Every `SELECT` against a table that could return more than 100 rows must paginate. No "fetch all" endpoints.
14. **ISR on every new template page.** Default `revalidate: 3600`. No new page ships as a pure SSR route without an ISR override documented.

---

## 2. Goal

Add nine new first-class node types to the MannaFest schema and stack, with full Postgres migrations, TypeScript types, admin CRUD UI, template pages, graph integration, search integration, and seeded data. After this chunk merges, Phase 3 content chunks can begin without further schema work.

The nine node types are:

| # | Node type | Route prefix | Phase origin |
|---|---|---|---|
| 1 | Person | `/people/[slug]` | v2 Phase 2.1 |
| 2 | Place | `/places/[slug]` | v2 Phase 2.1 |
| 3 | Manuscript | `/manuscripts/[slug]` | v2 Phase 2.1 |
| 4 | Event | `/events/[slug]` | v2 Phase 2.1 |
| 5 | Feast | `/feasts/[slug]` | v2 Phase 2.4.A |
| 6 | Tabernacle Element | `/tabernacle/[slug]` | v2 Phase 2.4.A |
| 7 | Sacrifice Type | `/sacrifices/[slug]` | v2 Phase 2.4.A |
| 8 | Divine Name | `/names-of-god/[slug]` | v2 Phase 2.4.A |
| 9 | Book Collection | `/bible/[slug]` | v3 addition |

---

## 3. Workflow (Two Passes)

**Pass 1 — Blueprint (Day 1).**
Before writing any implementation code, produce `docs/schema-expansion-blueprint.md`. It must contain:

- Complete field list for every node type (starting from §4 below — refine and finalize as you read the existing codebase).
- Postgres table names, column types, indexes, constraints, and foreign keys.
- Relationship map showing how these new types connect to the existing `verses`, `strongs_entries`, `cross_references`, `nodes`, `edges`, and `commentary` tables.
- Route file tree showing where new pages will live in `src/app/`.
- Admin UI tree showing every new form and list view.
- Graph integration plan — color per node type, size-by-connections rule, filter-panel additions.
- Seed-data plan — which seeds for which type, sources for each.
- Open questions section — anything ambiguous enough to stop for.

Stop and wait after Pass 1 if any open question in the blueprint is genuinely blocking. Otherwise proceed.

**Pass 2 — Implementation (Days 2–6).**
Execute the blueprint. One node type at a time. Merge to a `feat/schema-expansion` branch after each node type's migration + types + admin UI + template + seeds + tests are complete. Do not batch-merge at the end.

---

## 4. Per-Node-Type Specifications

For every type below, implement: (a) Postgres migration, (b) TypeScript type + zod schema in `src/lib/schemas/`, (c) admin CRUD UI at `/admin/[type]`, (d) public template page at the type's route prefix, (e) graph node class, (f) side-panel rendering, (g) search indexing, (h) at least 3 seeded instances with full field coverage and cited sources.

### 4.1 Person

**Purpose:** represent every named individual in Scripture as a first-class node.

**Fields:**
- `id` (uuid, PK)
- `slug` (text, unique, URL-safe)
- `canonical_name` (text, required) — the form used as display
- `alternate_names` (jsonb array of `{name, language, tradition, source}`)
- `strong_refs` (text array) — Strong's entries for the name (e.g., `H85` for Abraham)
- `tradition_of_origin` (enum: patriarch, judge, king, prophet, priest, nt_figure, apostle, other)
- `approximate_birth_year` (integer, BCE negative, CE positive, nullable)
- `approximate_death_year` (integer, nullable)
- `date_confidence` (enum: narrow, broad, contested, unknown)
- `tribe_affiliation` (slug reference, nullable)
- `priestly_line` (boolean, default false)
- `priestly_generation` (integer, nullable)
- `royal_line` (enum: solomonic, nathanic, none)
- `narrative_arc_summary` (text, rich markdown) — 150–400 words
- `first_appearance_passage` (verse reference)
- `key_passages` (many-to-many to verses)
- `theological_significance` (text, rich markdown) — 100–300 words
- `typological_role` (text, nullable) — Christological typology where present
- `sources` (jsonb array of citation objects)
- `debated_content_notice` (boolean + nullable `debated_content_text`)
- `created_at`, `updated_at`, `created_by`, `updated_by`

**Edges this type participates in (typed edges, existing graph structure):**
- `parent_of`, `spouse_of`, `sibling_of`, `adopted_parent_of` (lineage edges — schema only; visualization framework ships in Phase 2.7)
- `located_at` (to Place)
- `involves` (to Event — inverse)
- `typologically_prefigures` (to Divine Name or Jesus cluster node)
- `addressed_by` (to verses)
- `commentary_on` (inverse — from commentary to this person)

**Graph display:** color `#6366f1` (indigo). Size by outbound connection count, min 8px, max 24px.

**Seed instances (3 required, with full field coverage and citations):**
- Abraham
- Moses
- David

Source seeds from: Enduring Word references, ISBE (public domain), Easton's Bible Dictionary (public domain), Smith's Bible Dictionary (public domain), Anchor Yale Bible Dictionary entries where quotable, Wesley Huff's publicly available content where applicable. Every factual claim must cite.

---

### 4.2 Place

**Purpose:** represent every biblically significant location.

**Fields:**
- `id` (uuid, PK)
- `slug` (text, unique)
- `canonical_name` (text, required)
- `alternate_names` (jsonb array — biblical variations, modern names, multiple transliterations)
- `latitude` (decimal)
- `longitude` (decimal)
- `region` (enum: galilee, judea, samaria, transjordan, mesopotamia, egypt, sinai, arabia, asia_minor, greece, italy, other)
- `modern_country` (text)
- `modern_location_description` (text) — "near modern-day Hebron in the West Bank"
- `elevation_meters` (integer, nullable)
- `place_type` (enum: city, village, mountain, river, sea, region, country, site, structure)
- `first_biblical_mention` (verse reference)
- `archaeological_notes` (text, rich markdown, nullable)
- `key_biblical_events` (many-to-many to Event)
- `theological_significance` (text, rich markdown)
- `typological_significance` (text, nullable)
- `map_marker_style` (enum: settlement, mountain, water, region, site) — used by the map surface
- `sources` (jsonb array)
- `debated_content_notice` (boolean + text)
- standard audit fields

**Edges:**
- `located_at` (inverse — from Person, Event)
- `attested_by` (to Manuscript, where relevant)
- `archaeological_evidence_for` (to Event)

**Graph display:** color `#10b981` (emerald).

**Seed instances:**
- Jerusalem
- Bethlehem
- Mount Sinai

---

### 4.3 Manuscript

**Purpose:** represent the textual witnesses to Scripture.

**Fields:**
- `id` (uuid, PK)
- `slug` (text, unique)
- `canonical_name` (text, required) — "Codex Sinaiticus"
- `sigla` (text, nullable) — "ℵ" or "01"
- `alternate_names` (jsonb array)
- `language` (enum: hebrew, aramaic, greek, syriac, latin, coptic, ethiopic, other)
- `script` (text, nullable) — "Greek uncial," "Hebrew square script"
- `date_range_start` (integer, BCE negative, CE positive)
- `date_range_end` (integer)
- `date_confidence` (enum: narrow, broad, contested)
- `date_debate_notes` (text, nullable)
- `discovery_year` (integer, nullable)
- `discovery_location` (text, nullable)
- `current_location` (text) — "British Library" / "Vatican Library"
- `contents_summary` (text, rich markdown) — which books, which portions, state of completeness
- `textual_family` (enum: alexandrian, byzantine, western, caesarean, proto_masoretic, septuagintal, samaritan, vulgate, peshitta, targumic, dead_sea, other)
- `significance` (text, rich markdown)
- `attested_passages` (many-to-many to verses)
- `image_urls` (text array, pointing to Supabase storage buckets — licensing field per image)
- `image_licenses` (jsonb array, parallel to image_urls)
- `sources` (jsonb array)
- `debated_content_notice` (boolean + text)
- audit fields

**Edges:**
- `attested_by` (inverse — from verses)
- `associated_with_event` (e.g., DSS discovery)

**Graph display:** color `#f59e0b` (amber).

**Seed instances:**
- Great Isaiah Scroll (1QIsaᵃ)
- Codex Sinaiticus
- Masoretic Text (Leningrad Codex as the canonical representative)

---

### 4.4 Event

**Purpose:** represent biblically recorded events as discrete nodes.

**Fields:**
- `id` (uuid, PK)
- `slug` (text, unique)
- `canonical_name` (text, required)
- `event_type` (enum: battle, covenant, miracle, journey, sermon, death, resurrection, vision, prophecy_delivered, prophecy_fulfilled, theophany, exodus, conquest, exile, return, birth, marriage, anointing, martyrdom, trial, healing, teaching, other)
- `approximate_date_year` (integer, nullable)
- `date_confidence` (enum)
- `biblical_passages` (many-to-many to verses)
- `locations` (many-to-many to Place)
- `persons_involved` (many-to-many to Person)
- `narrative_summary` (text, rich markdown)
- `theological_significance` (text, rich markdown)
- `typological_significance` (text, nullable)
- `sources` (jsonb array)
- `debated_content_notice` (boolean + text)
- audit fields

**Edges:**
- `involves` (to Person)
- `located_at` (to Place)
- `attested_by` (to Manuscript, where specific manuscript witnesses matter)
- `fulfills` (to a prophecy node, if applicable)
- `typologically_prefigures` / `typologically_fulfilled_by`

**Graph display:** color `#ef4444` (red).

**Seed instances:**
- The Exodus from Egypt
- The Crucifixion of Christ
- The Resurrection of Christ

---

### 4.5 Feast

**Purpose:** represent the biblical festivals as first-class nodes.

**Fields:**
- `id` (uuid, PK)
- `slug` (text, unique)
- `canonical_name` (text, required) — English + parenthetical Hebrew
- `hebrew_name` (text) — Hebrew script
- `hebrew_transliteration` (text)
- `english_alternate_names` (text array) — "Feast of Unleavened Bread," "Pesach," etc.
- `biblical_calendar_month` (enum: nisan, iyar, sivan, tammuz, av, elul, tishri, cheshvan, kislev, tevet, shevat, adar, adar_ii, various)
- `biblical_calendar_date_range` (text) — "14th–21st of Nisan"
- `source_passages` (many-to-many to verses, with primary citation field noted)
- `category` (enum: spring_feast, fall_feast, rabbinic_feast)
- `pilgrimage_feast` (boolean) — the three pilgrimage feasts (Passover, Pentecost, Tabernacles) where every male was required in Jerusalem
- `historical_practice` (text, rich markdown)
- `second_temple_practice` (text, rich markdown, nullable)
- `modern_jewish_practice` (text, rich markdown)
- `christological_fulfillment` (text, rich markdown)
- `fulfillment_status` (enum: first_coming, second_coming, ongoing, partial)
- `key_nt_passages` (many-to-many to verses — where NT references this feast)
- `sources` (jsonb array)
- `debated_content_notice` (boolean + text)
- audit fields

**Edges:**
- `commemorates` (to Event)
- `typologically_fulfilled_by` (to Jesus cluster node or NT event)
- `involves` (to Tabernacle Element, Sacrifice Type)

**Graph display:** color `#d946ef` (fuchsia).

**Seed instances:**
- Passover (Pesach)
- Pentecost (Shavuot)
- Day of Atonement (Yom Kippur)

---

### 4.6 Tabernacle Element

**Purpose:** represent each piece of the Tabernacle as a typologically-loaded node.

**Fields:**
- `id` (uuid, PK)
- `slug` (text, unique)
- `canonical_name` (text, required) — English + Hebrew parenthetical
- `hebrew_name` (text)
- `hebrew_transliteration` (text)
- `source_passages` (many-to-many to verses — primarily Exodus 25–31, 35–40)
- `location_in_tabernacle` (enum: outer_court, holy_place, holy_of_holies, exterior, structural)
- `dimensions` (jsonb) — structured `{length, width, height, unit: "cubits"}`, nullable
- `materials` (text array) — "acacia wood," "pure gold," "bronze"
- `function` (text, rich markdown)
- `who_interacted_with_it` (enum array: common_people, levites, priests, high_priest, high_priest_once_yearly)
- `ritual_use` (text, rich markdown)
- `christological_typology` (text, rich markdown)
- `hebrews_references` (many-to-many to verses in Hebrews)
- `sources` (jsonb array)
- audit fields

**Edges:**
- `involves` (from Sacrifice Type — e.g., the bronze altar involves the burnt offering)
- `typologically_fulfilled_by` (to Jesus cluster node)
- `part_of` (to a parent Tabernacle-Element, e.g., Mercy Seat `part_of` Ark of the Covenant)

**Graph display:** color `#eab308` (yellow).

**Seed instances:**
- Ark of the Covenant
- Mercy Seat (Kapporet)
- Bronze Altar (Altar of Burnt Offering)

---

### 4.7 Sacrifice Type

**Purpose:** represent each Levitical offering type with full procedural and typological detail.

**Fields:**
- `id` (uuid, PK)
- `slug` (text, unique)
- `canonical_name` (text, required) — English + Hebrew
- `hebrew_name` (text)
- `hebrew_transliteration` (text)
- `source_passages` (many-to-many to verses — primarily Leviticus 1–7, 16)
- `category` (enum: sweet_savor, non_sweet_savor, general) — Leviticus 1–3 vs. 4–5 distinction
- `voluntariness` (enum: voluntary, mandatory, circumstantial)
- `what_was_offered` (text array) — "bull," "lamb without blemish," "turtledoves or young pigeons"
- `acceptable_substitutes` (text) — the graduated offerings for the poor
- `blood_theology` (text, rich markdown)
- `who_could_offer` (enum array: any_israelite, priest_only, high_priest_only, nazirite, congregation)
- `procedure_steps` (jsonb array of structured steps)
- `portion_division` (jsonb) — `{to_god: "entire", to_priest: "none", to_offerer: "none"}` for burnt; varies by type
- `sin_vs_impurity_distinction` (text, rich markdown, nullable) — relevant for sin offering
- `christological_fulfillment` (text, rich markdown)
- `hebrews_references` (many-to-many to verses in Hebrews)
- `sources` (jsonb array)
- audit fields

**Edges:**
- `involves` (to Tabernacle Element)
- `typologically_fulfilled_by` (to Jesus cluster node)
- `part_of` (to a Feast, where the sacrifice is part of a feast's ritual)

**Graph display:** color `#dc2626` (dark red — distinct from Event's red; consider using a different shape too).

**Seed instances:**
- Burnt Offering (Olah)
- Sin Offering (Chatat)
- Day of Atonement sacrifice (the two goats ritual)

---

### 4.8 Divine Name

**Purpose:** represent each Hebrew name of God as a first-class theological node.

**Fields:**
- `id` (uuid, PK)
- `slug` (text, unique)
- `canonical_form` (text, required) — "YHWH" or "El Shaddai"
- `hebrew_script` (text) — original Hebrew
- `hebrew_transliteration` (text)
- `pronunciation_guide` (text)
- `meaning` (text, rich markdown)
- `first_mention_passage` (verse reference)
- `approximate_usage_count` (integer)
- `parent_name` (slug reference, nullable) — for compound names like Jehovah-Jireh, points to YHWH
- `compound_name_element` (text, nullable) — "Jireh (provides)" for Jehovah-Jireh
- `theological_significance` (text, rich markdown)
- `connection_to_christ` (text, rich markdown, nullable) — especially important for YHWH (the I AM statements)
- `key_passages` (many-to-many to verses)
- `strong_ref` (text)
- `sources` (jsonb array)
- audit fields

**Edges:**
- `etymologically_related_to` (to other Divine Names or Words)
- `typologically_fulfilled_by` (to Jesus cluster node — for I AM, specifically)
- `addressed_by` (to verses where name is used)

**Graph display:** color `#7c3aed` (violet).

**Seed instances:**
- YHWH (the Tetragrammaton)
- Elohim
- El Shaddai

---

### 4.9 Book Collection

**Purpose:** represent the groupings of biblical books as first-class navigational nodes. New in v3.

**Fields:**
- `id` (uuid, PK)
- `slug` (text, unique)
- `canonical_name` (text, required) — "The Torah / Pentateuch"
- `alternate_names` (text array) — "The Law," "The Books of Moses," "The Five Books"
- `tradition` (enum: christian_protestant, christian_catholic, christian_orthodox, hebrew_tanakh)
- `route` (text) — `/bible/torah`
- `member_book_slugs` (text array) — references to existing book entities; order matters (canonical ordering preserved)
- `collection_description` (text, rich markdown)
- `literary_genres` (text array) — "narrative," "law," "poetry," "prophecy," "apocalyptic," "epistle," "gospel," "history"
- `theological_contribution` (text, rich markdown)
- `chronological_placement` (text, rich markdown) — when, in biblical chronology, do these books sit or describe
- `key_connections_across_books` (text, rich markdown)
- `featured_pages_drawing_from` (many-to-many to featured pages, nullable for now)
- `display_order` (integer) — for the `/bible` collection hub listing
- `sources` (jsonb array)
- audit fields

**Edges:**
- `contains` (to book entities)
- `connected_to` (to other Collections — e.g., Major Prophets and Minor Prophets are related)

**Graph display:** color `#0ea5e9` (sky blue). Larger default size than book nodes (collections are parent nodes).

**Seed instances (collection hub must ship with all 12 collections populated, not just 3):**
1. The Torah / Pentateuch (`/bible/torah`)
2. Historical Books (`/bible/historical`)
3. Wisdom & Poetical Books (`/bible/wisdom`)
4. Major Prophets (`/bible/major-prophets`)
5. Minor Prophets (`/bible/minor-prophets`)
6. The Gospels (`/bible/gospels`)
7. Acts (`/bible/acts`)
8. Pauline Epistles (`/bible/pauline`)
9. General Epistles (`/bible/general-epistles`)
10. Apocalyptic / Revelation (`/bible/revelation`)
11. Apocrypha / Deuterocanon (`/bible/apocrypha`)
12. Hebrew Bible / Tanakh (`/bible/tanakh`) — alternative ordering view

Each collection gets a full `collection_description` paragraph, theological contribution paragraph, and cross-links to its member books (even if the book hubs themselves don't exist yet — leave placeholder routes that will resolve once book hubs ship in Phase 3B).

---

## 5. Cross-Cutting Implementation Requirements

These apply to every node type above.

### 5.1 Database

- One Postgres migration file per node type, in `supabase/migrations/`. Naming: `YYYYMMDDHHMMSS_create_[type]_nodes.sql`.
- Every table has `created_at`, `updated_at`, `created_by`, `updated_by` columns.
- Every table has RLS (Row Level Security) policies: public read, super-admin write.
- Every table has appropriate indexes — especially on `slug`, on foreign key columns, and on frequently-filtered enums.
- Every foreign-key relationship has `ON DELETE` behavior defined intentionally (usually `RESTRICT` for content integrity).
- Where a node type has a `slug` field, enforce: lowercase, hyphen-separated, URL-safe, unique, max 80 chars.
- Every new node type gets a trigger that creates a matching entry in the existing `nodes` table (the unified graph-node table), so the graph can query across all types uniformly. If the `nodes` table doesn't yet generalize to these new types, extend it — do not fork the data model.

### 5.2 TypeScript + Zod

- Every node type has a zod schema in `src/lib/schemas/[type].ts`.
- TypeScript types derive from zod schemas (`z.infer<>`).
- Admin forms validate against the zod schema client-side and server-side.

### 5.3 Admin CRUD UI

- Route: `/admin/[type]`.
- List view with pagination (20 per page default), search by name, filter by enums.
- Create form with all fields, grouped sensibly, with inline validation.
- Edit form identical to create form, pre-populated.
- Delete with confirmation modal. Soft-delete if the existing data model supports it; hard-delete if not.
- Only super-admins (existing Supabase role) can access `/admin/*`. Enforce server-side.

### 5.4 Public Template Pages

- Route: per node type prefix above.
- ISR enabled with `revalidate: 3600`.
- Full-density page (all fields visible or one click away via collapsibles/tabs/accordions — NOT hidden by user-level gating).
- Breadcrumbs on every page using the existing `BreadcrumbsProvider`.
- Side-panel-openable from the graph (`openSidePanel(nodeId)` integrates with existing nav state).
- Sources list at the bottom of every page, using the Phase 2.5.B `<Citation>` component if it ships in parallel; if not yet shipped, render sources as a simple numbered list and leave a migration TODO in `docs/parking-lot.md`.
- Debated-content notice banner at the top of the page when the field is set.

### 5.5 Graph Integration

- Every new node type appears in the 2D graph (`/graph`, post-1.3).
- Each type has its defined color (specified per §4 above) and a distinct visual treatment (shape, outline, or icon overlay).
- Filter panel gets a new checkbox per type — users can show/hide by type.
- Node size is a function of outbound connection count, with type-specific min/max bounds documented in the blueprint.
- Clicking a node of any type opens the side panel with that node's summary and connections — never navigates away.

### 5.6 Search Integration

- Every new node type is indexed in the global search (`/search`).
- Results display node type as a badge next to the name.
- Filter by type on the results page.
- Search uses Postgres full-text search on `canonical_name`, `alternate_names`, and `slug` at minimum; add more fields per type where reasonable.

### 5.7 Side Panel

- The existing graph side panel (specified in Vision v2 §6.3 and v3 §0) renders every new node type.
- Side panel content per type: name + type badge, 2–3 sentence summary (derive from a short-form field or truncate `narrative_summary` / `theological_significance`), connections list with edge type + one-line explanation of each connection, "Go to full page →" button.

### 5.8 Seed Data

- Minimum 3 seed instances per node type (5 for Book Collection — all 12 are required).
- Every seed instance has every required field populated.
- Every seed instance has minimum 3 outbound edges with written explanations.
- Every substantive claim in a seed instance is cited. Open-source sources only.
- Seeds live in `supabase/seeds/[type].seed.ts` and run as part of a seed migration.

### 5.9 Route Naming — Verify Against Existing Conventions

Before implementing, check that the proposed route prefixes don't collide with existing routes. If there's a collision:

- Flag it in the blueprint.
- Propose an alternative that preserves the same semantic clarity.
- Wait for founder confirmation before proceeding.

### 5.10 Image Handling

For Manuscript and (later) Tabernacle Element, images are a sensitive area:

- Images must be open-source licensed (public domain, CC-BY, CC0).
- Store licensing metadata alongside each image URL.
- Host images in Supabase Storage, not in `/public` or Vercel's build output.
- For this chunk, seed data may reference zero images — the infrastructure must exist, but image ingestion is a later pass. Leave the fields present but empty, with a clear TODO.

### 5.11 Performance

- Every list endpoint paginates. No unbounded fetches.
- Every detail page is ISR with `revalidate: 3600`.
- Graph queries for the new types use viewport-based loading (compatible with the existing graph framework from Chunk 1.3).
- Bundle impact: run the Vercel bundle analyzer after each type's implementation and ensure no single dependency adds more than 5 MB compressed to the function bundle.

---

## 6. Out of Scope (Do Not Build)

- Beginner / Study / Deep mode toggles (removed in v14 amendment — do not re-introduce).
- 3D graph surfaces (deprecated in v13).
- Revelation-note or trail-insight authoring UIs (founder-only, separate chunk).
- Full content population — this chunk seeds 3 instances per type; Phase 3 chunks populate further.
- Commentary ingestion (different chunk).
- Image ingestion for manuscripts (infrastructure only this pass).
- Lineage visualization component (that's Phase 2.7 — the lineage edges exist as schema, but the visualization comes later).
- Family tree UI (Phase 2.7).
- Compare mode (Phase 2.5.A — separate chunk).
- Citation viewer component (Phase 2.5.B — if shipped in parallel, use it; if not, placeholder and TODO).
- Any featured page content — featured pages are Phase 3.
- Mobile-first styling passes — desktop-first is the mandate.

If a feature seems desirable but is on this list: add it to `docs/parking-lot.md` and do not build it.

---

## 7. Acceptance Criteria

The chunk is done when all of the following are verifiable:

1. **Database.** Nine new Postgres tables exist in Supabase. Every table has RLS, indexes, FKs, audit columns. Every seed instance loads cleanly.
2. **Types.** Nine zod schemas exist. TypeScript compiles without errors. Admin forms validate server-side and client-side against the same schemas.
3. **Admin UI.** Each type has a working list view, create form, edit form, delete with confirmation, at `/admin/[type]`. Super-admin role check works.
4. **Template pages.** Each type has a public template page at its route prefix. Seed instances render correctly. ISR is configured. Breadcrumbs work. Side panel opens. Debated-content notice renders when set.
5. **Graph.** Every new node type appears in the 2D graph at `/graph`. Filter checkboxes work. Colors are distinct. Side-panel click behavior is consistent with existing nodes.
6. **Search.** Global search at `/search` returns seeded instances for every type. Type filters work.
7. **Side panel.** Every type renders in the side panel with name, type badge, summary, connections list with explanations, go-to-full-page button.
8. **Seeds.** Three+ seeds per type (twelve for Book Collection). Every seed has minimum 3 outbound explained edges. Every substantive claim cites an open-source source.
9. **Performance.** Verse pages still load in under 1.5s first-load. Graph viewport loads under 2s. No single function response exceeds 1 MB. Bundle size has not grown past function limits.
10. **Tests.** Unit tests for each zod schema. Integration tests for each admin CRUD flow. E2E test covering: navigate from homepage → graph → click a seeded Person node → side panel opens → click "Go to full page" → Person template page renders correctly.
11. **Documentation.** `docs/schema-expansion-blueprint.md` (Pass 1 output) is committed. `docs/schema-expansion-decisions.md` is committed listing any decisions made during implementation that weren't in the blueprint. Parking-lot items added to `docs/parking-lot.md` where relevant.
12. **PR.** Single PR on branch `feat/schema-expansion` targeting `main`. PR description links to this prompt, summarizes what was implemented, lists all nine new routes, attaches screenshots of each seeded instance's template page.

---

## 8. PR and Branch Strategy

- Branch: `feat/schema-expansion` off current `main`.
- Commit discipline: one commit per node type's core work (migration + types + admin UI + template + graph integration + seeds), with sub-commits for tests and polish as needed.
- Incremental pushes throughout the batch — do not wait until the end.
- PR description includes: link to this prompt document, summary table of the nine types, screenshot of one seeded instance per type on its template page, a graph screenshot showing filter-panel entries for all nine types, any open questions that came up.
- Do not merge. Leave the PR open for founder review at the end of the batch.

---

## 9. Questions Worth Stopping For

Most decisions in this prompt are resolved. The following would justify stopping and asking the founder:

1. A route collision that has no clean alternative (§5.9).
2. An existing schema structure (`nodes`, `edges`, `commentary`) that cannot be extended without refactoring beyond this chunk's scope.
3. A licensing question on a seed source you cannot independently verify as open-source.
4. A founder-only authoring decision that isn't covered by "leave field present, leave content empty" (e.g., if you encounter a field that reasonably requires founder voice, do not author it — flag it).
5. A performance regression that cannot be resolved within the chunk without an architectural change.

For everything else: apply this prompt's specifications, note the decision in `docs/schema-expansion-decisions.md`, and proceed.

---

## 10. Estimated Duration

- Pass 1 (Blueprint): 1 day
- Pass 2 (Implementation): 4–6 days, roughly 0.5 day per type plus cross-cutting work
- Tests + PR cleanup: 1 day
- **Total: 5–7 days of Cowork walk-away time.**

When the PR is ready for review, add a comment on the PR: "Schema expansion complete. Ready for founder review." The founder will review on the next Friday.

---

## 11. Final Reminder

After this chunk merges, Phase 3 content can begin — character profiles (Phase 3E.1) can be authored, place profiles (3E.2) can ship, manuscripts can populate (3E.3), feasts can be featured (3C.1), tabernacle can be documented (3C.2), sacrifices can be treated (3C.3), divine names can be surfaced (3C.8), book collections route correctly, and the scripture spine (Phase 3B) can begin. This chunk unblocks roughly 30 subsequent chunks.

Build it right. The student of the Bible who wants to learn is on the other side of this work.
