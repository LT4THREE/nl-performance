import { DomainNav } from "@/components/DomainNav";
import { KpiCard } from "@/components/KpiCard";
import { climateIndicators } from "@/data/indicators/climate";
import { fetchIndicatorSeries, summarize } from "@/lib/indicators";

export const revalidate = 86400;

export default async function ClimatePage() {
  const cards = await Promise.all(
    climateIndicators.map(async (indicator) => {
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
      <DomainNav active="climate" />

      <header className="max-w-3xl space-y-3">
        <p className="text-sm text-[var(--color-muted)] uppercase tracking-wide">Domain</p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Climate</h1>
        <p className="text-[var(--color-muted)] leading-relaxed">
          The Klimaatwet commits the Netherlands to a <strong>−55%</strong> reduction in
          greenhouse-gas emissions versus the 1990 baseline by 2030, and net-zero by 2050. The
          2026 coalition agreement adds statutory nitrogen-reduction targets by 2035 for
          agriculture, industry, and mobility. Data sourced from Eurostat (which republishes
          the EU GHG inventory submitted by the Netherlands); RIVM/Emissieregistratie and PBL
          integrations are next.
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
            href={`/climate/${indicator.id}`}
          />
        ))}
      </section>
    </div>
  );
}
