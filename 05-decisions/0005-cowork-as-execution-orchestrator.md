# ADR 0005 — Cowork as execution orchestrator

**Date:** 2026-04-16
**Status:** Accepted
**Decider:** Marcus Brown

## Context

MannaFest work has been split across three tool surfaces: Claude.ai (long-form chat, planning), Claude Code (local development on the Next.js repo), and Cowork (desktop automation). The question is how to divide responsibilities between them for sustainable execution.

## Decision

**Cowork is the execution orchestrator** for multi-phase sessions that need to coordinate (a) local filesystem changes to the Ark vault, (b) Supabase database operations via MCP, and (c) git commits. The model is:

1. **Planning and conversation:** Claude.ai. Long-context ideation, research, decision-making, and drafting of exemplar payloads (JSON) and master briefs.
2. **Ark vault curation and DB migrations/seeds:** Cowork. Multi-phase execution of the planning outputs against the Supabase project and the Ark vault. Each phase commits incrementally to git; final phase pushes.
3. **Next.js repo engineering:** Claude Code (or a Cowork session mounted on the repo). Feature-flag plumbing, component implementation, build/test cycles.

The division of labor is determined by *where the state lives* that needs to be changed: if it's the vault or DB, Cowork. If it's the repo, Claude Code.

## Consequences

- Each tool is used for what it does best. Claude.ai stays conversational; Cowork stays operational; Claude Code stays repo-resident.
- Cross-session continuity is maintained by explicit handoff documents (master briefs, session logs, ADRs in the Ark).
- Quality control: each session produces verifiable artifacts (commits, DB row counts, session log entries) that the next session can pick up.

## Session 1 evidence

This Cowork session (2026-04-16) executed an eight-phase master brief from Claude.ai against the Ark vault and Supabase project `ufrmssiqjtqfywthgpte`. It performed: file relocation, Obsidian vault initialization, schema verification, apocrypha + connection_explanations imports, prophecy audits, bulk content generation (22 apocrypha works, 55 connection explanations, 27 prophet bios, 7 intertestamental period entries), and per-phase git commits with clean logging. Cowork handled ~1 MB of diverse content edits and ~80 SQL operations against Supabase reliably in a single continuous session. The model works.

## Known constraint

The Ark vault is mounted via virtiofs/FUSE from the Windows host, and git lock files cannot be unlinked from Cowork's side (filesystem permission asymmetry). Workaround: Cowork operates against a copy of `.git` in its own writable sandbox (`/sessions/.../ark-git`) and references the work tree via `GIT_DIR`/`GIT_WORK_TREE` env vars. This gives clean commits. At session end, Marcus or a follow-up Cowork session can rsync the accumulated objects and refs back to the mount — or Marcus can re-clone from the pushed remote.
