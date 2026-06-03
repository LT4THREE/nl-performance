import { DomainNav } from "@/components/DomainNav";
import { KpiCard } from "@/components/KpiCard";
import { PlannedNext } from "@/components/PlannedNext";
import { healthIndicators } from "@/data/indicators/health";
import { fetchIndicatorSeries, summarize } from "@/lib/indicators";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 86400;

export const metadata = pageMetadata({
  title: "Dutch health — longevity, outcomes, public health",
  description:
    "Life expectancy and healthy life expectancy of the Netherlands, sourced from CBS. NZa wait-times and RIVM vaccination coverage planned next.",
  path: "/health",
});

export default async function HealthPage() {
  const cards = await Promise.all(
    healthIndicators.map(async (indicator) => {
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
    <div className="mx-auto max-w-6xl px-6 py-10 space-y-10">
      <DomainNav active="health" />

      <header className="max-w-3xl space-y-3">
        <p className="text-sm text-[var(--color-muted)] uppercase tracking-wide">Domain</p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Health</h1>
        <p className="text-[var(--color-muted)] leading-relaxed">
          Life expectancy and the share of those years spent in self-reported good health are
          the headline outcomes of the entire health system. NZa data on healthcare wait
          times, capacity and cost, plus RIVM vaccination coverage and disease surveillance,
          come next.
        </p>
      </header>

      <section className="grid sm:grid-cols-2 gap-4">
        {cards.map(({ indicator, latest, yoyDelta, yoyDeltaPct }) => (
          <KpiCard
            key={indicator.id}
            indicator={indicator}
            latest={latest}
            yoyDelta={yoyDelta}
            yoyDeltaPct={yoyDeltaPct}
            href={`/health/${indicator.id}`}
          />
        ))}
      </section>

      <PlannedNext domain="health" />
    </div>
  );
}
