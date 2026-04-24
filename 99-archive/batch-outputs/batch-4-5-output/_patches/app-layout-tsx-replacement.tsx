// REPLACEMENT FOR: src/app/layout.tsx
//
// One change from current state: wrap {children} in
// <EditorialNotesDrawerProvider initialSuperAdmin={...}> so the drawer
// renders on eligible routes. Nothing else moves.
//
// `isSuperAdmin()` runs on every request — fast (two cookie-driven queries
// via supabase.auth.getUser + profiles.is_admin lookup with service-role
// client that bypasses RLS). Falling back to `false` for unauthenticated
// visitors is cheap.

import type { Metadata } from "next";
import { Source_Serif_4, Noto_Serif_Hebrew } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/nav/Providers";
import SiteHeader from "@/components/nav/SiteHeader";
import Breadcrumbs from "@/components/nav/Breadcrumbs";
import MenuOverlay from "@/components/nav/MenuOverlay";
import { EditorialNotesDrawerProvider } from "@/components/editorial-notes";
import { isSuperAdmin } from "@/lib/auth/super-admin";

const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const notoSerifHebrew = Noto_Serif_Hebrew({
  variable: "--font-hebrew",
  subsets: ["hebrew"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mannafest.faith"),
  title: {
    default: "MannaFest — The Second Brain of the Bible",
    template: "%s | MannaFest",
  },
  description:
    "The world's most interconnected Bible study platform. Explore 31,102 verses with cross-references, Strong's concordance, commentary, and a knowledge graph. Free for every believer.",
  keywords: [
    "Bible",
    "KJV",
    "Bible study",
    "Strong's Concordance",
    "cross-references",
    "biblical commentary",
    "Scripture",
    "King James Version",
  ],
  authors: [{ name: "MannaFest" }],
  creator: "MannaFest",
  openGraph: {
    title: "MannaFest — The Second Brain of the Bible",
    description:
      "The world's most interconnected Bible study platform. Explore every verse with cross-references, concordance, and commentary.",
    url: "https://mannafest.faith",
    siteName: "MannaFest",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MannaFest - The Second Brain of the Bible",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MannaFest — The Second Brain of the Bible",
    description: "The world's most interconnected Bible study platform.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://mannafest.faith",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialSuperAdmin = await isSuperAdmin();

  return (
    <html
      lang="en"
      className={`${sourceSerif.variable} ${notoSerifHebrew.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <EditorialNotesDrawerProvider initialSuperAdmin={initialSuperAdmin}>
            <SiteHeader />
            <Breadcrumbs />
            <main className="flex-1">{children}</main>
            <MenuOverlay />
          </EditorialNotesDrawerProvider>
        </Providers>
      </body>
    </html>
  );
}
