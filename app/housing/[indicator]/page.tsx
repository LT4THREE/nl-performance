import Link from "next/link";
import { notFound } from "next/navigation";
import { DomainNav } from "@/components/DomainNav";
import { IndicatorChart } from "@/components/IndicatorChart";
import { DataSource } from "@/components/DataSource";
import { GoalCard } from "@/components/GoalCard";
import { housingIndicators, findHousingIndicator } from "@/data/indicators/housing";
import { fetchIndicatorSeries, fetchTableInfo, summarize } from "@/lib/cbs";
import { getGoalsByDomain } from "@/lib/goals";
import { formatValue, formatDelta } from "@/lib/format";

export const revalidate = 21600;

export async function generateStaticParams() {
  return housingIndicators.map((i) => ({ indicator: i.id }));
}

export default async function HousingIndicatorPage({
  params,
}: {
  params: Promise<{ indicator: string }>;
}) {
  const { indicator: id } = await params;
  const indicator = findHousingIndicator(id);
  if (!indicator) notFound();

  let points: Awaited<ReturnType<typeof fetchIndicatorSeries>> = [];
  let info: Awaited<ReturnType<typeof fetchTableInfo>> | null = null;
  let fetchError: string | null = null;
  try {
    [points, info] = await Promise.all([
      fetchIndicatorSeries(indicator),
      fetchTableInfo(indicator.cbsTable),
    ]);
  } catch (e) {
    fetchError = e instanceof Error ? e.message : "Failed to load data.";
  }

  const { latest, yoyDelta } = summarize(points);
  const relatedGoals = getGoalsByDomain(indicator.domain);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 space-y-10">
      <DomainNav active="housing" />

      <div className="text-sm text-[var(--color-muted)]">
        <Link href="/housing" className="underline hover:text-[var(--color-fg)]">
          ← Housing
        </Link>
      </div>

      <header className="max-w-3xl space-y-3">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">{indicator.label}</h1>
        <p className="text-[var(--color-muted)] leading-relaxed">{indicator.description}</p>
        {indicator.note && (
          <p className="text-xs italic text-[var(--color-warning)]">{indicator.note}</p>
        )}
      </header>

      {fetchError && (
        <div className="p-4 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-sm">
          Could not load data from CBS right now. ({fetchError})
        </div>
      )}

      {latest && (
        <section className="flex flex-wrap items-baseline gap-6 border-b border-[var(--color-border)] pb-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">
              Latest ({latest.periodLabel})
            </p>
            <p className="text-5xl font-semibold tracking-tight mt-1">
              {formatValue(latest.value, indicator.unit)}
            </p>
          </div>
          {yoyDelta !== null && (
            <div>
              <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">YoY change</p>
              <p
                className={`text-2xl font-medium mt-1 ${
                  yoyDelta === 0
                    ? "text-[var(--color-muted)]"
                    : (yoyDelta > 0) === indicator.higherIsBetter
                      ? "text-[var(--color-success)]"
                      : "text-[var(--color-danger)]"
                }`}
              >
                {formatDelta(yoyDelta, indicator.unit)}
              </p>
            </div>
          )}
        </section>
      )}

      {points.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">History</h2>
          <IndicatorChart data={points} unit={indicator.unit} />
          <DataSource
            tableId={indicator.cbsTable}
            label={info?.ShortTitle ?? info?.Title}
            asOf={latest?.periodLabel}
          />
        </section>
      )}

      {relatedGoals.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Related government goals</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {relatedGoals.map((g) => (
              <GoalCard key={g.id} goal={g} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
