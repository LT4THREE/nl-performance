import { DomainNav } from "@/components/DomainNav";
import { KpiCard } from "@/components/KpiCard";
import { PlannedNext } from "@/components/PlannedNext";
import { socialIndicators } from "@/data/indicators/social";
import { fetchIndicatorWithTimestamp, summarize } from "@/lib/indicators";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 86400;

export const metadata = pageMetadata({
  title: "Social indicators — population, longevity, healthy life years",
  description:
    "Total population, life expectancy at birth and healthy life expectancy of the Netherlands — the 'here and now' Monitor Brede Welvaart headline indicators, sourced from CBS.",
  path: "/social",
});

export default async function SocialPage() {
  const cards = await Promise.all(
    socialIndicators.map(async (indicator) => {
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
      <DomainNav active="social" />

      <header className="max-w-3xl space-y-3">
        <p className="text-sm text-[var(--color-muted)] uppercase tracking-wide">Domain</p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Social</h1>
        <p className="text-[var(--color-muted)] leading-relaxed">
          Population and the broader well-being of Dutch society. Income inequality and the
          components of net migration come next, alongside SCP well-being indicators. Life
          expectancy and healthy life expectancy now live under <a href="/health" className="underline hover:text-[var(--color-fg)]">Health</a>.
        </p>
      </header>

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(({ indicator, latest, yoyDelta, yoyDeltaPct, series, fetchedAt }) => (
          <KpiCard
            key={indicator.id}
            indicator={indicator}
            latest={latest}
            yoyDelta={yoyDelta}
            yoyDeltaPct={yoyDeltaPct}
            series={series}
            fetchedAt={fetchedAt}
            href={`/social/${indicator.id}`}
          />
        ))}
      </section>

      <PlannedNext domain="social" />
    </div>
  );
}
