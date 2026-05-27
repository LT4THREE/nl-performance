import { DomainNav } from "@/components/DomainNav";
import { KpiCard } from "@/components/KpiCard";
import { economyIndicators } from "@/data/indicators/economy";
import { fetchIndicatorSeries, summarize } from "@/lib/cbs";

export const revalidate = 21600;

export default async function EconomyPage() {
  const cards = await Promise.all(
    economyIndicators.map(async (indicator) => {
      try {
        const points = await fetchIndicatorSeries(indicator);
        const { latest, yoyDelta } = summarize(points);
        return { indicator, latest, yoyDelta };
      } catch {
        return { indicator, latest: null, yoyDelta: null };
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
        {cards.map(({ indicator, latest, yoyDelta }) => (
          <KpiCard
            key={indicator.id}
            indicator={indicator}
            latest={latest}
            yoyDelta={yoyDelta}
            href={`/economy/${indicator.id}`}
          />
        ))}
      </section>
    </div>
  );
}
