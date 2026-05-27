import Link from "next/link";
import type { DataPoint, IndicatorDef } from "@/types";
import { formatValue, formatDelta } from "@/lib/format";

export function KpiCard({
  indicator,
  latest,
  yoyDelta,
  href,
}: {
  indicator: IndicatorDef;
  latest: DataPoint | null;
  yoyDelta: number | null;
  href?: string;
}) {
  const trendClass = trendColor(yoyDelta, indicator.higherIsBetter);
  const arrow = yoyDelta === null ? "" : yoyDelta > 0 ? "▲" : yoyDelta < 0 ? "▼" : "•";

  const inner = (
    <article className="flex flex-col gap-3 p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] hover:border-[var(--color-fg)] transition-colors h-full">
      <header className="flex items-baseline justify-between gap-2">
        <h3 className="text-sm font-medium text-[var(--color-muted)]">
          {indicator.shortLabel}
        </h3>
        {latest && (
          <span className="text-xs text-[var(--color-muted)]">{latest.periodLabel}</span>
        )}
      </header>
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-semibold tracking-tight">
          {latest ? formatValue(latest.value, indicator.unit) : "—"}
        </span>
        {yoyDelta !== null && (
          <span className={`text-sm font-medium ${trendClass}`}>
            {arrow} {formatDelta(yoyDelta, indicator.unit)} YoY
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
    <Link href={href} className="block focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] rounded-xl">
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
