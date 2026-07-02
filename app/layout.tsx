import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nl-performance-two.vercel.app"),
  title: {
    default: "NL Performance — Track the Netherlands' goals vs. actuals",
    template: "%s · NL Performance",
  },
  description:
    "Live, sourced indicators from CBS, ECB and Eurostat, tracked against the public goals federal, provincial and municipal governments have committed to.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-2 focus:rounded-md focus:bg-[var(--color-accent)] focus:text-[var(--color-accent-fg)] focus:text-sm focus:font-medium"
        >
          Skip to content
        </a>
        <header className="border-b border-[var(--color-border)]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full bg-[var(--color-accent)]"
                aria-hidden="true"
              />
              NL Performance
            </Link>
            <p className="text-xs text-[var(--color-muted)] hidden sm:block">
              Government performance, measured
            </p>
          </div>
        </header>
        <main id="main" className="flex-1">
          {children}
        </main>
        <footer className="border-t border-[var(--color-border)] mt-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 text-xs text-[var(--color-muted)] flex flex-col sm:flex-row gap-3 sm:justify-between">
            <p>
              Data: CBS, ECB, Eurostat (under their respective open-data licences). This site
              is an independent evidence platform, not affiliated with the Dutch government or
              any political party.
            </p>
            <p>
              <Link href="/about" className="underline hover:text-[var(--color-fg)]">
                About &amp; methodology
              </Link>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
