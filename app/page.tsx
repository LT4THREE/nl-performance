import Link from "next/link";
import { DomainNav } from "@/components/DomainNav";
import { KpiCard } from "@/components/KpiCard";
import { economyIndicators } from "@/data/indicators/economy";
import { housingIndicators } from "@/data/indicators/housing";
import { fetchIndicatorSeries, summarize } from "@/lib/cbs";

export const revalidate = 21600;

export default async function Home() {
  // Curated featured set: one each from unemployment, inflation, house prices,
  // government debt. Designed to read as a one-glance snapshot of "how is NL doing".
  const featured = [
    economyIndicators.find((i) => i.id === "unemployment-rate"),
    economyIndicators.find((i) => i.id === "inflation-rate"),
    housingIndicators.find((i) => i.id === "average-house-price"),
    economyIndicators.find((i) => i.id === "government-debt-gdp"),
  ].filter((x): x is NonNullable<typeof x> => Boolean(x));

  const results = await Promise.all(
    featured.map(async (indicator) => {
      try {
        const points = await fetchIndicatorSeries(indicator);
        const { latest, yoyDelta, yoyDeltaPct } = summarize(points);
        return { indicator, latest, yoyDelta, yoyDeltaPct };
      } catch {
        return { indicator, latest: null, yoyDelta: null, yoyDeltaPct: null };
      }
    }),
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 space-y-14">
      <DomainNav active="home" />

      <section className="max-w-3xl space-y-4">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-tight">
          How is the Netherlands performing?
        </h1>
        <p className="text-lg text-[var(--color-muted)] leading-relaxed">
          A single, transparent view of factual indicators about the country alongside the
          public goals that federal, provincial, and municipal governments have committed to —
          and how they are actually delivering against them.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/economy"
            className="px-4 py-2 rounded-md bg-[var(--color-accent)] text-[var(--color-accent-fg)] text-sm font-medium hover:bg-[var(--color-accent-strong)] transition-colors"
          >
            Explore the data
          </Link>
          <Link
            href="/goals"
            className="px-4 py-2 rounded-md border border-[var(--color-border)] text-[var(--color-fg-soft)] text-sm font-medium hover:bg-[var(--color-surface)] transition-colors"
          >
            Track government goals
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <h2 className="text-xl font-semibold">Snapshot</h2>
          <p className="text-xs text-[var(--color-muted)]">
            Latest observations from CBS, refreshed every 6 hours
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {results.map(({ indicator, latest, yoyDelta, yoyDeltaPct }) => (
            <KpiCard
              key={indicator.id}
              indicator={indicator}
              latest={latest}
              yoyDelta={yoyDelta}
              yoyDeltaPct={yoyDeltaPct}
              href={`/${indicator.domain}/${indicator.id}`}
            />
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Why this exists</h2>
          <p className="text-[var(--color-muted)] leading-relaxed">
            Information about how the Netherlands is doing — and how its governments are
            delivering on their own commitments — is scattered across CBS tables, ministry
            websites, RIVM reports, coalition agreements, and dozens of PDFs. This project
            brings the most important indicators together in one place, links every number to
            its primary source, and makes performance against stated goals visible at a glance.
          </p>
        </div>
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">What you can do</h2>
          <ul className="text-[var(--color-muted)] leading-relaxed space-y-1 list-disc pl-5">
            <li>
              Browse <Link href="/economy" className="underline hover:text-[var(--color-fg)]">economic</Link> and{" "}
              <Link href="/housing" className="underline hover:text-[var(--color-fg)]">housing</Link> indicators
              with full historical context.
            </li>
            <li>
              See live progress against <Link href="/goals" className="underline hover:text-[var(--color-fg)]">government goals</Link> — the
              2026 coalition agreement, the Klimaatwet, defense and education plans.
            </li>
            <li>
              Check the <Link href="/sources" className="underline hover:text-[var(--color-fg)]">data sources</Link> behind every number.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
