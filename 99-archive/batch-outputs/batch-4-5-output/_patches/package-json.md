# package.json additions

Three new dependencies in `dependencies`:

```diff
   "dependencies": {
     "@supabase/ssr": "^0.10.2",
     "@supabase/supabase-js": "^2.103.0",
     "@types/d3": "^7.4.3",
     "@types/xml2js": "^0.4.14",
     "d3": "^7.9.0",
     "dotenv": "^17.4.2",
     "jszip": "^3.10.1",
     "next": "16.2.3",
     "react": "19.2.4",
     "react-dom": "19.2.4",
     "react-force-graph-2d": "^1.29.0",
+    "react-markdown": "^9.0.1",
+    "rehype-sanitize": "^6.0.0",
+    "remark-gfm": "^4.0.0",
     "xml2js": "^0.6.2"
   },
```

Pins chosen to be compatible with React 19 and Next 16. If npm complains,
try `pnpm add react-markdown@9 remark-gfm@4 rehype-sanitize@6` (the repo
currently uses npm per package-lock; switch only if needed).

## Install

```powershell
cd C:\Users\marcd\Downloads\MannaFest
npm install react-markdown@9 remark-gfm@4 rehype-sanitize@6
```

No new dev dependencies. Types are bundled with the runtime packages.
