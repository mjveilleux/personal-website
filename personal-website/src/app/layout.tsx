import Footer from "@/app/_components/footer";
import { TopNav } from "@/app/_components/top-nav";
import { HOME_OG_IMAGE_URL } from "@/lib/constants";
import cn from "classnames";
import type { Metadata } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"

import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const body = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

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
    icon: "/favicon/mason-avatar.webp",
    shortcut: "/favicon/mason-avatar.webp",
    apple: "/favicon/mason-avatar.webp",
  },
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
};

export const viewport = {
  themeColor: "#f4ede4",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          body.className,
          display.variable,
          body.variable,
          "bg-[var(--sand)] text-[var(--ink)] antialiased",
        )}
      >
        <div className="min-h-screen hyggeligt-shell">
          <TopNav />
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
