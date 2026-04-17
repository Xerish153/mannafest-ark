# File Routing Reference

When Marcus downloads files from a Claude.ai session, they land in `C:\Users\marcd\Downloads`. Their final destinations depend on type:

| File pattern | Destination |
|---|---|
| `CLAUDE.md` | `Ark\00-meta\CLAUDE.md` |
| `*-exemplars-*.json` (apocrypha, connections, scholars, etc.) | `MannaFest project root` (`C:\Users\marcd\Downloads\MannaFest\`) — these are import payloads for Claude Code or Cowork |
| `ark-session-log-*.md` | `Ark\03-sessions\` (overwrite or append based on date) |
| `*.sql` migration drafts | `MannaFest project supabase\migrations\` (after review) |
| Screenshots | `Ark\02-content\<topic>\screenshots\` |

## Conventions

- Session-dated files go in date-prefixed subfolders: `YYYY-MM-DD-<purpose>/`
- After import, archive payload JSONs to `Ark\99-archive\imports\` with date prefix
- Never leave files in Downloads after they've been routed — move, don't copy
