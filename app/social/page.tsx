import { DomainNav } from "@/components/DomainNav";
import { KpiCard } from "@/components/KpiCard";
import { socialIndicators } from "@/data/indicators/social";
import { fetchIndicatorSeries, summarize } from "@/lib/indicators";

export const revalidate = 86400;

export default async function SocialPage() {
  const cards = await Promise.all(
    socialIndicators.map(async (indicator) => {
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
      <DomainNav active="social" />

      <header className="max-w-3xl space-y-3">
        <p className="text-sm text-[var(--color-muted)] uppercase tracking-wide">Domain</p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Social</h1>
        <p className="text-[var(--color-muted)] leading-relaxed">
          Population, longevity, and well-being. The headline measures here line up with the
          'here-and-now' dimension of the CBS Monitor Brede Welvaart — total population, life
          expectancy, and years lived in self-reported good health. Inequality and
          household-income indicators come next, alongside SCP well-being data.
        </p>
      </header>

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(({ indicator, latest, yoyDelta, yoyDeltaPct }) => (
          <KpiCard
            key={indicator.id}
            indicator={indicator}
            latest={latest}
            yoyDelta={yoyDelta}
            yoyDeltaPct={yoyDeltaPct}
            href={`/social/${indicator.id}`}
          />
        ))}
      </section>
    </div>
  );
}
