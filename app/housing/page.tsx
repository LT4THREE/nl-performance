import { DomainNav } from "@/components/DomainNav";
import { KpiCard } from "@/components/KpiCard";
import { housingIndicators } from "@/data/indicators/housing";
import { fetchIndicatorSeries, summarize } from "@/lib/cbs";

export const revalidate = 21600;

export default async function HousingPage() {
  const cards = await Promise.all(
    housingIndicators.map(async (indicator) => {
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
      <DomainNav active="housing" />

      <header className="max-w-3xl space-y-3">
        <p className="text-sm text-[var(--color-muted)] uppercase tracking-wide">Domain</p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Housing</h1>
        <p className="text-[var(--color-muted)] leading-relaxed">
          The 2026 coalition agreement makes the housing crisis its top priority — targeting
          ~100,000 net new homes per year, €1B in annual funding from 2029, and 30 designated
          new neighbourhoods or towns. The indicators below track supply, prices, and the
          transaction market.
        </p>
      </header>

      <section className="grid sm:grid-cols-2 gap-4">
        {cards.map(({ indicator, latest, yoyDelta }) => (
          <KpiCard
            key={indicator.id}
            indicator={indicator}
            latest={latest}
            yoyDelta={yoyDelta}
            href={`/housing/${indicator.id}`}
          />
        ))}
      </section>
    </div>
  );
}
