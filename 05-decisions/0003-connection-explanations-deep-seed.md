# ADR 0003 — Connection explanations: deep seed

**Date:** 2026-04-16
**Status:** Accepted
**Decider:** Marcus Brown, executed in Cowork Session 1

## Context

The MannaFest graph has over 1.3M `graph_edges` rows — thin, mostly auto-generated cross-references with no narrative explanation. The 2D/3D graph UI surfaces these connections but users have no way to understand *why* two nodes are connected at theological depth. We need a second layer: deep, curated narrative explanations that can be read in a slide-in panel when a user clicks a connection.

## Decision

Create a `connection_explanations` table, FK'd to `graph_nodes.id` (not free-form references), with schema supporting:

- source and target node IDs, types, and human-readable references
- `connection_type` enumerated across: theme, typology, language, original-word, numerical, narrative-parallel, prophecy-fulfillment, symbolic, cross-reference, allusion, quotation, chiasmus, messianic-thread
- `connection_subtype` for finer categorization (e.g., "father-and-only-son sacrifice" for Genesis 22 / John 1:29 typology)
- `title` (evocative), `summary` (1-2 sentences for hover), `full_explanation` (3-5 paragraphs of theological/literary depth)
- `scholarly_notes` naming specific commentators (Spurgeon, Calvin, Edwards, Carson, Bauckham, Wright, Hays, Brown, Fitzmyer, Moo, Keener, Lane, Attridge, Ferguson, Keller, etc.)
- `hebrew_greek_analysis` JSONB populated when the method is linguistic
- `typological_pattern` populated when the method is typology
- `key_verses` JSONB, `confidence_level`, partial unique index on (source_node_id, target_node_id, connection_type)

Seed quality bar: every entry should look like a sermon outline from a careful exegete. No thin "see also" connections; every entry earns its place by surfacing something users cannot see by merely reading the two verses side-by-side.

## Target size

Target 100+ entries across the 13 connection types at an approximately 20-20-10-8-8-12-7 distribution (typology / language / numerical / messianic-thread / chiasmus / quotation-allusion / narrative-parallel).

## Consequences

- Provides a searchable, FK'd, narratively rich layer that will power the 3D graph's `ConnectionPanel`.
- Enables future features (study trail generation, themed tours, reading plans).
- Requires discipline to maintain quality bar as volume grows — better 100 excellent entries than 1000 mediocre.

## Status as of Cowork Session 1 (2026-04-16)

Inserted: 10 Phase-4 exemplars + 55 Phase-7B bulk entries = **65 total**, covering typology (20), language (12), numerical (8), messianic-thread (8), narrative-parallel (6), chiasmus (5), quotation (4), allusion (2). Short of 100+ target by ~35 entries. Gap logged in `06-todos/active.md` for follow-up.
