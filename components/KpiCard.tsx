import Link from "next/link";
import type { DataPoint, IndicatorDef } from "@/types";
import { formatValue, formatDelta, formatPeriod } from "@/lib/format";
import { providerLabel, sourceIdentifier } from "@/lib/indicators";
import { Sparkline } from "./Sparkline";
import { ConfidenceBadge } from "./ConfidenceBadge";

export function KpiCard({
  indicator,
  latest,
  yoyDelta,
  yoyDeltaPct,
  series,
  fetchedAt,
  href,
}: {
  indicator: IndicatorDef;
  latest: DataPoint | null;
  yoyDelta: number | null;
  yoyDeltaPct?: number | null;
  series?: DataPoint[];
  fetchedAt?: string;
  href?: string;
}) {
  const isRelativeUnit = indicator.unit === "percent" || indicator.unit === "index";
  const display = isRelativeUnit ? yoyDelta : yoyDeltaPct ?? null;
  const trendClass = trendColor(display, indicator.higherIsBetter);
  const arrow = display === null ? "" : display > 0 ? "▲" : display < 0 ? "▼" : "•";

  const inner = (
    <article
      className={[
        "flex flex-col gap-3 p-5 rounded-xl h-full",
        "border border-[var(--color-border)] bg-[var(--color-bg)]",
        "transition-shadow transition-colors duration-150",
        href
          ? "group-hover:border-[var(--color-border-strong)] group-hover:shadow-[0_2px_8px_-2px_rgba(15,23,42,0.08)]"
          : "",
      ].join(" ")}
    >
      <header className="space-y-1.5">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-sm font-medium text-[var(--color-muted)]">{indicator.shortLabel}</h3>
          {latest && (
            <span className="text-xs text-[var(--color-muted)]">
              {formatPeriod(latest.date, indicator.frequency)}
            </span>
          )}
        </div>
        {indicator.confidence && (
          <ConfidenceBadge level={indicator.confidence} size="xs" showLabel={false} />
        )}
      </header>
      <div className="flex items-end justify-between gap-3">
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-3xl font-semibold tracking-tight text-[var(--color-fg)]">
            {latest ? formatValue(latest.value, indicator.unit) : "—"}
          </span>
          {display !== null ? (
            <span className={`text-sm font-medium ${trendClass}`}>
              {arrow} {formatDelta(display, indicator.unit)} YoY
            </span>
          ) : (
            <span className="text-sm font-medium text-[var(--color-muted)]">YoY n/a</span>
          )}
        </div>
        {series && series.length >= 2 && (
          <Sparkline data={series} />
        )}
      </div>
      <p className="text-sm text-[var(--color-muted)] leading-snug">
        {indicator.description.split(".")[0]}.
      </p>
      <CardFooter indicator={indicator} latest={latest} fetchedAt={fetchedAt} />
    </article>
  );

  if (!href) return inner;
  return (
    <Link href={href} className="group block rounded-xl">
      {inner}
    </Link>
  );
}

function CardFooter({
  indicator,
  latest,
  fetchedAt,
}: {
  indicator: IndicatorDef;
  latest: DataPoint | null;
  fetchedAt?: string;
}) {
  const observed = latest ? formatPeriod(latest.date, indicator.frequency) : "—";
  const fetched = fetchedAt ? new Date(fetchedAt).toISOString().slice(0, 16).replace("T", " ") : "—";
  return (
    <p className="text-[10px] text-[var(--color-muted)] leading-snug border-t border-[var(--color-border)] pt-2 mt-auto">
      Source: {providerLabel(indicator.provider)} {sourceIdentifier(indicator)} ·{" "}
      Observed {observed} · Fetched {fetched} UTC
    </p>
  );
}

function trendColor(delta: number | null, higherIsBetter: boolean): string {
  if (delta === null || delta === 0) return "text-[var(--color-muted)]";
  const positive = delta > 0;
  const good = positive === higherIsBetter;
  return good ? "text-[var(--color-success)]" : "text-[var(--color-danger)]";
}
