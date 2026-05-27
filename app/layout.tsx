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
  title: "NL Performance — Government accountability cockpit",
  description:
    "A central cockpit for tracking the Netherlands' factual indicators and how the government performs against its stated goals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <header className="border-b border-[var(--color-border)]">
          <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between gap-6">
            <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[var(--color-accent)]" />
              NL Performance
            </Link>
            <p className="text-xs text-[var(--color-muted)] hidden sm:block">
              Tracking the Netherlands · prototype
            </p>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-[var(--color-border)] mt-16">
          <div className="mx-auto max-w-6xl px-6 py-8 text-xs text-[var(--color-muted)] flex flex-col sm:flex-row gap-3 sm:justify-between">
            <p>
              Data: Centraal Bureau voor de Statistiek (CBS), under CC-BY. This site is an
              independent prototype, not affiliated with the Dutch government.
            </p>
            <p>
              <Link href="/about" className="underline hover:text-[var(--color-fg)]">
                About & methodology
              </Link>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
