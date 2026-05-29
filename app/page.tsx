import Link from "next/link";
import { DomainNav } from "@/components/DomainNav";
import { KpiCard } from "@/components/KpiCard";
import { economyIndicators } from "@/data/indicators/economy";
import { fetchIndicatorSeries, summarize } from "@/lib/cbs";

export const revalidate = 21600; // 6h

export default async function Home() {
  const featured = economyIndicators;
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
    <div className="mx-auto max-w-6xl px-6 py-10 space-y-12">
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
            className="px-4 py-2 rounded-md bg-[var(--color-fg)] text-[var(--color-bg)] text-sm font-medium hover:opacity-90"
          >
            Explore the economy
          </Link>
          <Link
            href="/goals"
            className="px-4 py-2 rounded-md border border-[var(--color-border)] text-sm font-medium hover:bg-[var(--color-surface)]"
          >
            Track government goals
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-semibold">Featured indicators</h2>
          <Link
            href="/economy"
            className="text-sm underline text-[var(--color-muted)] hover:text-[var(--color-fg)]"
          >
            All economy indicators →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {results.map(({ indicator, latest, yoyDelta, yoyDeltaPct }) => (
            <KpiCard
              key={indicator.id}
              indicator={indicator}
              latest={latest}
              yoyDelta={yoyDelta}
              yoyDeltaPct={yoyDeltaPct}
              href={`/economy/${indicator.id}`}
            />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Why this exists</h2>
        <p className="text-[var(--color-muted)] max-w-3xl leading-relaxed">
          Public information about how the Netherlands is doing — and how its governments are
          performing against their own commitments — is scattered across dozens of sources.
          This project brings the most important indicators together in one place, links every
          number to its primary source, and makes it easy to see where commitments are being
          met and where they are not.
        </p>
      </section>
    </div>
  );
}
