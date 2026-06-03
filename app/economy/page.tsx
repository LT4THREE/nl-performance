import { DomainNav } from "@/components/DomainNav";
import { KpiCard } from "@/components/KpiCard";
import { PlannedNext } from "@/components/PlannedNext";
import { economyIndicators } from "@/data/indicators/economy";
import { fetchIndicatorWithTimestamp, summarize } from "@/lib/indicators";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 21600;

export const metadata = pageMetadata({
  title: "Dutch economy — live indicators from CBS and ECB",
  description:
    "Unemployment, inflation, government debt and the ECB policy rate — the live macro snapshot of the Netherlands, sourced from CBS and the ECB.",
  path: "/economy",
});

export default async function EconomyPage() {
  const cards = await Promise.all(
    economyIndicators.map(async (indicator) => {
      try {
        const { points, fetchedAt } = await fetchIndicatorWithTimestamp(indicator);
        const { latest, yoyDelta, yoyDeltaPct } = summarize(points, indicator.frequency);
        return { indicator, latest, yoyDelta, yoyDeltaPct, series: points, fetchedAt };
      } catch {
        return { indicator, latest: null, yoyDelta: null, yoyDeltaPct: null, series: [], fetchedAt: undefined };
      }
    }),
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 space-y-10">
      <DomainNav active="economy" />

      <header className="max-w-3xl space-y-3">
        <p className="text-sm text-[var(--color-muted)] uppercase tracking-wide">Domain</p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Economy</h1>
        <p className="text-[var(--color-muted)] leading-relaxed">
          Headline measures of the Dutch economy. All series are sourced directly from CBS open
          data and link back to the original table.
        </p>
      </header>

      <section className="grid sm:grid-cols-2 gap-4">
        {cards.map(({ indicator, latest, yoyDelta, yoyDeltaPct, series, fetchedAt }) => (
          <KpiCard
            key={indicator.id}
            indicator={indicator}
            latest={latest}
            yoyDelta={yoyDelta}
            yoyDeltaPct={yoyDeltaPct}
            series={series}
            fetchedAt={fetchedAt}
            href={`/economy/${indicator.id}`}
          />
        ))}
      </section>

      <PlannedNext domain="economy" />
    </div>
  );
}
