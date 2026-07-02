import type { Verdict } from "@/lib/verdict";
import type { IndicatorDef } from "@/types";
import { formatNumber } from "@/lib/format";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { TargetLineMiniChart } from "./TargetLineMiniChart";
import { providerLabel, sourceCitationUrl, sourceIdentifier } from "@/lib/indicators";

const statusTone: Record<Verdict["status"], string> = {
  "on-track": "bg-[var(--color-improving-soft)] text-[var(--color-improving)] border-[var(--color-improving)]/20",
  watch: "bg-[var(--color-watch-soft)] text-[var(--color-watch)] border-[var(--color-watch)]/20",
  "off-track": "bg-[var(--color-worsening-soft)] text-[var(--color-worsening)] border-[var(--color-worsening)]/20",
  unknown: "bg-[var(--color-neutral-soft)] text-[var(--color-neutral)] border-[var(--color-neutral)]/20",
};

const trendLabel: Record<Verdict["threeYearTrend"], string> = {
  improving: "▲ Improving",
  worsening: "▼ Worsening",
  stable: "— Stable",
  unknown: "— Unknown",
};

const trendTone: Record<Verdict["threeYearTrend"], string> = {
  improving: "text-[var(--color-improving)]",
  worsening: "text-[var(--color-worsening)]",
  stable: "text-[var(--color-fg-secondary)]",
  unknown: "text-[var(--color-muted)]",
};

/**
 * The dominant panel at the top of the housing topic page. Answers, at a
 * glance: what is being tracked, what is the target, what is the actual,
 * how big is the gap, which direction is it trending, and how much should
 * a reader trust the number.
 */
export function VerdictHero({
  verdict,
  indicator,
}: {
  verdict: Verdict;
  indicator: IndicatorDef;
}) {
  return (
    <section
      aria-labelledby="verdict-hero-heading"
      className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden"
    >
      {/* Top row: title + status pill */}
      <header className="px-6 sm:px-8 py-5 border-b border-[var(--color-border)] bg-[var(--color-surface-subtle)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-[var(--color-muted)] font-medium">
            Housing verdict
          </p>
          <h2
            id="verdict-hero-heading"
            className="text-lg sm:text-xl font-semibold text-[var(--color-fg)] mt-0.5"
          >
            New dwellings added vs the {verdict.targetLabel} public target
          </h2>
        </div>
        <span
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm font-semibold ${statusTone[verdict.status]}`}
          role="status"
        >
          {verdict.statusLabel}
        </span>
      </header>

      {/* Middle: the numbers */}
      <div className="px-6 sm:px-8 py-6 grid gap-x-6 gap-y-5 sm:grid-cols-3">
        <Cell label="Target">
          <span className="text-2xl font-semibold text-[var(--color-fg)] tracking-tight">
            {formatNumber(verdict.targetValue)}
          </span>
          <span className="text-xs text-[var(--color-fg-secondary)] block mt-0.5">
            dwellings / year
          </span>
        </Cell>
        <Cell label={`Latest actual (${verdict.latestPeriod})`}>
          <span className="text-2xl font-semibold text-[var(--color-fg)] tracking-tight">
            {formatNumber(verdict.latestValue)}
          </span>
          <span className="text-xs text-[var(--color-fg-secondary)] block mt-0.5">
            gross dwellings added
          </span>
        </Cell>
        <Cell label="Gap">
          <span className="text-2xl font-semibold text-[var(--color-worsening)] tracking-tight">
            −{formatNumber(verdict.absoluteGap)}
          </span>
          <span className="text-xs text-[var(--color-fg-secondary)] block mt-0.5">
            −{verdict.percentageGap.toFixed(1)}% of target
          </span>
        </Cell>

        {/* Chart cell spans full width on mobile, 2 cols on sm+ */}
        <div className="sm:col-span-2">
          <p className="text-xs uppercase tracking-wide text-[var(--color-muted)] font-medium mb-2">
            Three-year trend vs target
          </p>
          <TargetLineMiniChart
            series={verdict.threeYearSeries}
            target={verdict.targetValue}
          />
          <p className={`text-xs font-medium mt-2 ${trendTone[verdict.threeYearTrend]}`}>
            {trendLabel[verdict.threeYearTrend]} over the last three years
          </p>
        </div>

        <Cell label="Confidence & source">
          <div className="space-y-2">
            {indicator.confidence && (
              <ConfidenceBadge level={indicator.confidence} size="sm" />
            )}
            <p className="text-xs text-[var(--color-fg-secondary)] leading-snug">
              {providerLabel(indicator.provider)} · {sourceIdentifier(indicator)}
            </p>
            <a
              href={sourceCitationUrl(indicator)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-xs font-medium text-[var(--color-accent-strong)] hover:text-[var(--color-accent)]"
            >
              Open source →
            </a>
          </div>
        </Cell>
      </div>

      {/* Bottom: methodology + last-updated */}
      <footer className="px-6 sm:px-8 py-4 border-t border-[var(--color-border)] bg-[var(--color-bg)] text-xs text-[var(--color-fg-secondary)] space-y-2">
        <p>
          <strong className="text-[var(--color-fg-soft)]">On the target: </strong>
          The 100,000/year figure is the widely-referenced Dutch public housing target used
          across recent coalition programmes. Specific verbatim commitment text and current
          programme URL are demo/pending verification in this build; the CBS measurement
          above is live.
        </p>
        <p>
          <strong className="text-[var(--color-fg-soft)]">On the metric: </strong>
          <em>Woningbouw_5</em> in CBS table{" "}
          <a
            href="https://opendata.cbs.nl/statline/#/CBS/nl/dataset/82235NED/table"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[var(--color-fg)]"
          >
            82235NED
          </a>{" "}
          — gross new dwellings added per year (new construction + conversions). This is a
          slightly wider count than pure net-new build (which is <em>Nieuwbouw_2</em> in the
          same table); the shared reference target is stated against the wider Woningbouw
          measure. Demolitions (<em>Sloop_6</em>) are tracked separately.
        </p>
        <p>
          <strong className="text-[var(--color-fg-soft)]">Last observation: </strong>
          {verdict.latestPeriod} · fetched from CBS at build/refresh time.
        </p>
      </footer>
    </section>
  );
}

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-[var(--color-muted)] font-medium">
        {label}
      </p>
      <div className="mt-1">{children}</div>
    </div>
  );
}
