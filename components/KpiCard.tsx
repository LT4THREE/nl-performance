import Link from "next/link";
import type { DataPoint, IndicatorDef } from "@/types";
import { formatValue, formatDelta } from "@/lib/format";

export function KpiCard({
  indicator,
  latest,
  yoyDelta,
  yoyDeltaPct,
  href,
}: {
  indicator: IndicatorDef;
  latest: DataPoint | null;
  yoyDelta: number | null;
  yoyDeltaPct?: number | null;
  href?: string;
}) {
  // For percent/index units the headline delta is the absolute change in points.
  // For count/euro units we want the percent change (computed from the prior-year value).
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
      <header className="flex items-baseline justify-between gap-2">
        <h3 className="text-sm font-medium text-[var(--color-muted)]">{indicator.shortLabel}</h3>
        {latest && (
          <span className="text-xs text-[var(--color-muted)]">{latest.periodLabel}</span>
        )}
      </header>
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="text-3xl font-semibold tracking-tight text-[var(--color-fg)]">
          {latest ? formatValue(latest.value, indicator.unit) : "—"}
        </span>
        {display !== null && (
          <span className={`text-sm font-medium ${trendClass}`}>
            {arrow} {formatDelta(display, indicator.unit)} YoY
          </span>
        )}
      </div>
      <p className="text-sm text-[var(--color-muted)] leading-snug">
        {indicator.description.split(".")[0]}.
      </p>
    </article>
  );

  if (!href) return inner;
  return (
    <Link href={href} className="group block rounded-xl">
      {inner}
    </Link>
  );
}

function trendColor(delta: number | null, higherIsBetter: boolean): string {
  if (delta === null || delta === 0) return "text-[var(--color-muted)]";
  const positive = delta > 0;
  const good = positive === higherIsBetter;
  return good ? "text-[var(--color-success)]" : "text-[var(--color-danger)]";
}
