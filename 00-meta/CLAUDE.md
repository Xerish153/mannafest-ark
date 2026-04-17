# The Ark — Claude Operating Rules

This vault documents the **MannaFest** project (Supabase project `ufrmssiqjtqfywthgpte`).
It is **not** the Atrium. The Atrium is for Xerish (`becyawhjsibrbyzicqxt`) only — never reference it from this vault, never query the Xerish database from this vault.

The rules below exist to keep credit usage low. Follow them by default; deviate only when the user explicitly overrides.

---

## Default model

- **Haiku 4.5** (`claude-haiku-4-5-20251001`) for all routine vault operations: file reads, file writes, status updates, simple summarization, SQL execution, schema inspection, list management.
- **Sonnet 4.6** only for: theological synthesis, multi-paragraph content generation (apocrypha entries, connection explanations, character bios, scholar profiles), architectural decisions, and frontend code involving non-trivial logic (Three.js, performance tuning, state management).
- **Opus** only when the user explicitly says "deep think" or "use Opus." Otherwise never.

If a task could go either way, default to Haiku and ask the user before escalating.

---

## File operations

- **Read minimally.** Before reading a file, ask whether you actually need it. Use `grep` / `find` to locate the specific lines you need, then read only those lines.
- **Hard cap: 5 files per operation** without explicit user approval. If you think you need to read more, stop and ask.
- **Append, don't reformat.** When adding to `_inbox/`, append at the bottom. Don't rewrite or restructure existing notes.
- **No auto-frontmatter.** Don't add YAML frontmatter blocks unless the user explicitly asks for them.
- **Wikilinks over markdown links** for internal references: `[[02-content/connections/isaac-binding]]` not `[02-content/connections/isaac-binding](...)`
- **Filenames are kebab-case.** Session handoffs follow `YYYY-MM-DD-handoff-N.md`. ADRs follow `NNNN-short-description.md`.

---

## Schema reference discipline

Before running `execute_sql` against `ufrmssiqjtqfywthgpte`, check `01-architecture/tables.md` first. The table definitions, column types, and known data shapes are documented there. Querying `information_schema.columns` to discover something already documented is wasted credits.

If `01-architecture/tables.md` is out of date, update it after your query rather than re-discovering next session.

---

## Session workflow

**Starting a session:**
1. Read the **most recent** file in `03-sessions/` (use `ls -t` or equivalent).
2. Don't read older session files unless the user asks or you're searching for something specific.
3. Check `06-todos/active.md` for current priorities.

**Ending a session:**
1. Append a handoff to `03-sessions/YYYY-MM-DD-handoff-N.md` (increment N if multiple sessions same day).
2. Update `06-todos/active.md` if priorities shifted.
3. If a meaningful decision was made, write a one-page ADR in `05-decisions/`.

---

## Project ID discipline

This vault is for project **`ufrmssiqjtqfywthgpte`** (MannaFest) ONLY.
Never query, reference, or read the schema of `becyawhjsibrbyzicqxt` (Xerish) from operations rooted in this vault.
If the user asks for cross-project work, exit this vault context first.

---

## Cost hygiene

- For bulk content tasks, use prompt templates from `04-prompts/`. Don't re-derive prompts that already exist.
- If output exceeds ~4,000 tokens, ask the user if they want it split into batches before generating.
- Don't echo back large file contents in your replies — link to the file with a wikilink instead.
- When the user asks "what's in the vault?", answer from the folder structure (cheap) before reading individual files (expensive).
- Avoid speculative reads. "Let me check a few related files" is a credit drain. Ask which file matters.

---

## When uncertain

Ask one short question. Don't guess and don't pre-read three files to "have context" — that context costs more than the question.