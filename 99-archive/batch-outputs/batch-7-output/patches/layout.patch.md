# Patch — `src/app/layout.tsx`

Wire the `BookOverlayProvider` + mount `ReadTheBibleOverlay` in the root layout. Parallel to the existing `MenuOverlay` mount — the two overlays are independent.

## Changes

1. New imports:

```ts
import { BookOverlayProvider } from "@/components/nav/BookOverlayProvider";
import ReadTheBibleOverlay from "@/components/nav/ReadTheBibleOverlay";
```

2. Wrap the contents currently inside `<EditorialNotesDrawerProvider>` with `<BookOverlayProvider>`, and add the overlay mount alongside `<MenuOverlay />`.

Before:

```tsx
<Providers>
  <EditorialNotesDrawerProvider initialSuperAdmin={initialSuperAdmin}>
    <SiteHeader />
    <Breadcrumbs />
    <main className="flex-1">{children}</main>
    <MenuOverlay />
  </EditorialNotesDrawerProvider>
</Providers>
```

After:

```tsx
<Providers>
  <EditorialNotesDrawerProvider initialSuperAdmin={initialSuperAdmin}>
    <BookOverlayProvider>
      <SiteHeader />
      <Breadcrumbs />
      <main className="flex-1">{children}</main>
      <MenuOverlay />
      <ReadTheBibleOverlay />
    </BookOverlayProvider>
  </EditorialNotesDrawerProvider>
</Providers>
```

No other changes to this file.
