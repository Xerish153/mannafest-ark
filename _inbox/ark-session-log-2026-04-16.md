# Session 1 — 2026-04-16 — MannaFest planning + schema scaffolding

## Context
First planning session for the four-goal sprint: apocrypha sweep, prophecy normalization, connection explanations, and 3D nebula graph. Also added Goal 0: build the Ark vault itself (this file lives in it).

Project: `ufrmssiqjtqfywthgpte` (MannaFest). Atrium vault is for Xerish (`becyawhjsibrbyzicqxt`) only — zero crossover, ever.

## DB state verified at session start

| Table | Count | Notes |
|---|---|---|
| `messianic_prophecies` | 309 | Casing was inconsistent — normalized in Migration 3 |
| `prophecies` | 40 | Already lowercase, clean |
| `discovery_prompts` | 97 | ⚠️ Handoff said 497 — major gap, investigate |
| `biblical_characters` | 69 | Kings 48 ✅, Patriarchs 8, Apostles 4, Judges 3, Warriors 2, Other 4, Prophets 0 |
| `bible_patterns` | — | ⚠️ Table doesn't exist; handoff claimed 13 entries |
| `graph_nodes` | 32,503 | verses 31,107 / commentary 1,190 / themes 134 / prophecies 40 / persons 32 |
| `graph_edges` | 1,299,669 | cross_reference 1.29M / commentary 1,189 / prophecy_fulfillment 80 / thematic 73 / typology 16 |
| `typology_maps` | 154 | Only 16 propagated to graph_edges |
| `scholars` | 20 | Depth unverified |

## Decisions made
- **Vault naming locked.** MannaFest vault = the Ark. Xerish vault = the Atrium. No crossover. ADR 0001 records this.
- **Apocrypha scope: full sweep.** Deutero + pseudepigrapha + DSS intertestamental context.
- **Connection explanations: schema + 100+ entries deep seed**, FK'd to `graph_nodes.id` (not free-form refs).
- **3D graph: feature-flagged progressive enhancement.** 2D stays default. Mobile always 2D. Desktop 3D opt-in via env flag + user preference.
- **Prioritization: Option A** (all four goals, asymmetric depth) — since the work decomposes naturally into schema + exemplars + bulk batch templates.
- **Cost discipline: Haiku 4.5 default** for all routine work in Claude Code. Sonnet 4.6 only where flagged. Opus only on explicit "deep think."

## Schema landed this session (via Migration 1B)
1. `apocrypha_works` + `apocrypha_connections` + `intertestamental_period` (Migration: `create_apocrypha_tables`)
2. `connection_explanations` FK'd to `graph_nodes` (Migration: `create_connection_explanations`)
3. Prophecy normalization: `fulfillment_status` lowercased, `fulfillment_visual_indicator` added and populated, CHECK constraints added (Migration: `prophecy_status_normalization`)

## Content seeded this session (via Group 2)
- 5 apocrypha exemplars: 1 Maccabees, Sirach, Tobit, 1 Enoch, Community Rule (1QS)
- 7 apocrypha connections (1 Macc → John 10:22 / Matt 24:15; Sirach 24 → John 1; Sirach 51 → Matt 11:28-30; Tobit → Acts 10; 1 Enoch 1:9 → Jude 14-15; 1QS → 1 John)
- 10 connection explanations spanning typology / language / numerical / messianic-thread / chiasmus / quotation / allusion

## 3D graph plan (Group 3) ready to execute
- Prompt 3A [Sonnet 4.6]: feature-flagged Graph3D component, ConnectionPanel, initial render of core 169 edges
- Prompt 3B [Sonnet 4.6]: LOD + edge filtering for 1.3M edge set
- Prompt 3C [Haiku 4.5]: mobile fallback polish

## Bulk content templates (Group 4) staged in `04-prompts/sonnet/` — fire when ready
- 4A: ~25 remaining apocrypha works (Sonnet, batches of 5)
- 4B: 90 additional connection explanations to reach 100+ (Sonnet, batches of 10)
- 4C: 27 prophet bios (Sonnet, batches of 5) — side-quest

## Deferred / open questions
- **`discovery_prompts` 97 vs 497 gap** — likely failed batch import. Worth one Haiku session of investigation.
- **`bible_patterns` table missing entirely** — was it renamed? Never created? Quick Haiku check.
- **`typology_maps` (154) only 16 propagated to `graph_edges`** — there's a sync job missing somewhere. Worth one Haiku session to write the propagation SQL.
- **Apostles (4 of ~30), judges/warriors (5 of ~25), other characters (4 of ~15), prophets (0 of 27)** — the biblical_characters work is partly done (kings essentially complete) but several categories remain. Prompt 4C handles prophets; the rest is its own batch.

## Next session candidates
- Fire Prompt 4A (apocrypha bulk)
- Fire Prompt 4B (connection bulk, batched)
- Investigate the three deferred items above
- Begin scholars depth audit (we have 20 entries; quality unknown)
