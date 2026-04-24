# Patch — `src/components/nav/SiteHeader.tsx`

Adds a "Read the Bible" pill button next to the existing "Menu" button. Pill opens the `ReadTheBibleOverlay` via `useBookOverlay()`.

## Changes

1. Import `useBookOverlay` from `./BookOverlayProvider`.
2. In the default (non-auth) render branch, insert a new `<button>` immediately before the existing `Menu` button in the right cluster.

Add this import at the top alongside the existing imports:

```ts
import { useBookOverlay } from "./BookOverlayProvider";
```

Inside the component, next to `const { toggle: toggleMenu } = useMenu();`, add:

```ts
const { toggle: toggleBookOverlay } = useBookOverlay();
```

Then in the right cluster (where the existing `<button>` opens the menu), insert this new button **before** the Menu button (so the DOM order reads Read → Menu → Account):

```tsx
<button
  type="button"
  onClick={toggleBookOverlay}
  aria-label="Open Read the Bible overlay"
  aria-haspopup="dialog"
  className="flex items-center gap-1.5 px-2 h-8 rounded text-sm text-[#F0EDE8] hover:bg-[#1E2028] transition-colors focus:outline-none focus:ring-1 focus:ring-[#C9A227] font-[family-name:var(--font-inter)]"
>
  <svg
    aria-hidden
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
    />
  </svg>
  <span className="hidden sm:inline">Read the Bible</span>
</button>
```

The existing Menu button and AccountMenu remain unchanged.

## Why a new button, not a MenuOverlay entry

The prompt spec is explicit: a dedicated overlay separate from the hamburger menu, keyed by a persistent "Read the Bible" entry in the header. Two reasons to follow the spec:

1. The Read-the-Bible overlay has a 10-column layout and distinct keyboard scope; wiring it into the existing MenuOverlay would conflate two different UX shapes.
2. The hamburger menu (`MenuOverlay`) is a general site index; the book overlay is a navigational shortcut into Scripture content. Different tasks, different doors.
