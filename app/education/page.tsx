import { DomainNav } from "@/components/DomainNav";
import { KpiCard } from "@/components/KpiCard";
import { educationIndicators } from "@/data/indicators/education";
import { fetchIndicatorSeries, summarize } from "@/lib/indicators";

export const revalidate = 86400;

export default async function EducationPage() {
  const cards = await Promise.all(
    educationIndicators.map(async (indicator) => {
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
      <DomainNav active="education" />

      <header className="max-w-3xl space-y-3">
        <p className="text-sm text-[var(--color-muted)] uppercase tracking-wide">Domain</p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Education</h1>
        <p className="text-[var(--color-muted)] leading-relaxed">
          Government spending on education — both as a share of GDP and in absolute euros — is
          the live measure of how seriously stated education goals are funded. Attainment and
          quality indicators (DUO enrolment, OECD PISA) come next, sitting alongside the 2026
          coalition's €1.5B additional structural investment commitment.
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
            href={`/education/${indicator.id}`}
          />
        ))}
      </section>
    </div>
  );
}
