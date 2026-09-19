import Footer from "@/app/_components/footer";
import { HOME_OG_IMAGE_URL } from "@/lib/constants";
import cn from "classnames";
import type { Metadata } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

import "./globals.css";

// Variable files + `optional` so reloads do not swap fallback glyphs after paint.
const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "optional",
  adjustFontFallback: true,
});

const body = Work_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "optional",
  adjustFontFallback: true,
});

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Mason Veilleux | Data engineer, economist, writer",
  description:
    "A cozy corner of the internet for data engineer and economist Mason Veilleux — exploring analytics systems, macroeconomics, and thoughtful research.",
  metadataBase: new URL("https://masonveilleux.com"),
  openGraph: {
    title: "Mason Veilleux",
    description:
      "Data engineer, economist, and writer building warm software and research for public systems.",
    images: [HOME_OG_IMAGE_URL],
  },
  manifest: "/favicon/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/mason-avatar.webp", type: "image/webp" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon/apple-touch-icon.png",
  },
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4ede4",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(display.variable, body.variable, body.className)}
    >
      <body className="bg-[var(--sand)] text-[var(--ink)] antialiased">
        <div className="min-h-screen">
          {children}
        </div>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
