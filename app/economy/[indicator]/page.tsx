import Link from "next/link";
import { notFound } from "next/navigation";
import { DomainNav } from "@/components/DomainNav";
import { IndicatorChart } from "@/components/IndicatorChart";
import { DataSource } from "@/components/DataSource";
import { GoalCard } from "@/components/GoalCard";
import { RangeSelector } from "@/components/RangeSelector";
import { economyIndicators, findEconomyIndicator } from "@/data/indicators/economy";
import { fetchIndicatorSeries, summarize } from "@/lib/indicators";
import { fetchCbsTableInfo } from "@/lib/providers/cbs";
import { getGoalsForIndicator } from "@/lib/goals";
import { formatValue, formatDelta, formatPeriod } from "@/lib/format";
import { SchemaOrgDataset } from "@/components/SchemaOrgDataset";
import { filterByRange, normalizeRange } from "@/lib/range";
import { indicatorMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const revalidate = 21600;

export async function generateStaticParams() {
  return economyIndicators.map((i) => ({ indicator: i.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ indicator: string }>;
}): Promise<Metadata> {
  const { indicator: id } = await params;
  const indicator = findEconomyIndicator(id);
  if (!indicator) return { title: "Indicator not found" };
  try {
    const points = await fetchIndicatorSeries(indicator);
    const { latest, yoyDelta, yoyDeltaPct } = summarize(points, indicator.frequency);
    const isRelative = indicator.unit === "percent" || indicator.unit === "index";
    return indicatorMetadata(indicator, latest, isRelative ? yoyDelta : yoyDeltaPct, `/economy/${id}`);
  } catch {
    return indicatorMetadata(indicator, null, null, `/economy/${id}`);
  }
}

export default async function IndicatorPage({
  params,
  searchParams,
}: {
  params: Promise<{ indicator: string }>;
  searchParams: Promise<{ range?: string }>;
}) {
  const { indicator: id } = await params;
  const { range: rangeParam } = await searchParams;
  const range = normalizeRange(rangeParam);
  const indicator = findEconomyIndicator(id);
  if (!indicator) notFound();

  let points: Awaited<ReturnType<typeof fetchIndicatorSeries>> = [];
  let cbsTitle: string | undefined;
  let fetchError: string | null = null;
  try {
    points = await fetchIndicatorSeries(indicator);
    if (indicator.provider === "cbs") {
      const info = await fetchCbsTableInfo(indicator.cbsTable);
      cbsTitle = info.ShortTitle ?? info.Title;
    }
  } catch (e) {
    fetchError = e instanceof Error ? e.message : "Failed to load data.";
  }

  const { latest, yoyDelta, yoyDeltaPct } = summarize(points, indicator.frequency);
  const isRelativeUnit = indicator.unit === "percent" || indicator.unit === "index";
  const displayDelta = isRelativeUnit ? yoyDelta : yoyDeltaPct;
  const filtered = filterByRange(points, range);
  const relatedGoals = getGoalsForIndicator(indicator.id);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 space-y-10">
      <DomainNav active="economy" />

      <div className="text-sm text-[var(--color-muted)]">
        <Link href="/economy" className="underline hover:text-[var(--color-fg)]">
          ← Economy
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
              Latest ({formatPeriod(latest.date, indicator.frequency)})
            </p>
            <p className="text-5xl font-semibold tracking-tight mt-1">
              {formatValue(latest.value, indicator.unit)}
            </p>
          </div>
          {displayDelta !== null && (
            <div>
              <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">YoY change</p>
              <p
                className={`text-2xl font-medium mt-1 ${
                  displayDelta === 0
                    ? "text-[var(--color-muted)]"
                    : (displayDelta > 0) === indicator.higherIsBetter
                      ? "text-[var(--color-success)]"
                      : "text-[var(--color-danger)]"
                }`}
              >
                {formatDelta(displayDelta, indicator.unit)}
              </p>
            </div>
          )}
        </section>
      )}

      {points.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-lg font-semibold">History</h2>
            <RangeSelector active={range} />
          </div>
          <IndicatorChart data={filtered} unit={indicator.unit} />
          <DataSource indicator={indicator} label={cbsTitle} asOf={latest ? formatPeriod(latest.date, indicator.frequency) : undefined} />
          <SchemaOrgDataset indicator={indicator} points={points} cbsTitle={cbsTitle} />
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
