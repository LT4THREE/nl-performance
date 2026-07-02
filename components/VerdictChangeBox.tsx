import type { Verdict } from "@/lib/verdict";
import { formatNumber } from "@/lib/format";

/**
 * A short, structured 'what needs to happen for the verdict to change'
 * box. Not partisan advice — reads the current numbers and states, in
 * neutral terms, what the observable data would need to look like for
 * the verdict to move.
 */
export function VerdictChangeBox({ verdict }: { verdict: Verdict }) {
  const requiredIncrease = Math.max(0, verdict.absoluteGap);
  const trendConditionMet = verdict.threeYearTrend === "improving";

  const conditions: {
    id: string;
    label: string;
    met: boolean;
    detail: string;
  }[] = [
    {
      id: "annual-output-rises",
      label: `Annual output rises by ~${formatNumber(requiredIncrease)} dwellings/year`,
      met: verdict.percentageGap <= 0,
      detail: `To close the gap on the ${formatNumber(verdict.targetValue)}/year public target, gross additions would need to rise from the current ${formatNumber(verdict.latestValue)} to the target — an increase of about ${verdict.percentageGap.toFixed(0)}% on the latest observation.`,
    },
    {
      id: "trend-reverses",
      label: "The three-year trend reverses from worsening to improving",
      met: trendConditionMet,
      detail: `Currently ${verdict.threeYearSeries.map((s) => `${s.year}: ${formatNumber(s.value)}`).join(" · ")} — direction: ${verdict.threeYearTrend}.`,
    },
    {
      id: "sustained-delivery",
      label: "The target is met (or nearly met) for multiple consecutive years",
      met: false,
      detail:
        "A single year at target would be a milestone; sustained delivery for at least three consecutive years is the threshold at which the trajectory is on plan through 2030.",
    },
    {
      id: "funding-visible",
      label: "Additional federal housing funding starts producing observable output",
      met: false,
      detail:
        "The most-cited federal funding line is scheduled to phase in from 2029 (see Inputs above). Its impact should first appear as rising permits, then rising completions with a 12–24 month lag.",
    },
  ];

  return (
    <section
      aria-labelledby="verdict-change-heading"
      className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden"
    >
      <header className="px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-surface-subtle)]">
        <h2
          id="verdict-change-heading"
          className="text-lg font-semibold text-[var(--color-fg)]"
        >
          What would change the verdict?
        </h2>
        <p className="text-xs text-[var(--color-fg-secondary)] mt-0.5">
          The observable conditions — not policy recommendations — under which the housing
          verdict would move from{" "}
          <strong className="text-[var(--color-fg-soft)]">{verdict.statusLabel}</strong>{" "}
          towards on-track.
        </p>
      </header>

      <ul className="divide-y divide-[var(--color-border)]">
        {conditions.map((c) => (
          <li key={c.id} className="px-6 py-4 flex items-start gap-4">
            <span
              className={`shrink-0 mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                c.met
                  ? "bg-[var(--color-improving-soft)] text-[var(--color-improving)]"
                  : "bg-[var(--color-neutral-soft)] text-[var(--color-neutral)]"
              }`}
              aria-hidden="true"
            >
              {c.met ? "✓" : "•"}
            </span>
            <div className="space-y-1">
              <p className="text-sm font-medium text-[var(--color-fg)] leading-snug">
                {c.label}
              </p>
              <p className="text-xs text-[var(--color-fg-secondary)] leading-relaxed">
                {c.detail}
              </p>
              <p className="text-[10px] uppercase tracking-wide font-semibold mt-1">
                <span
                  className={
                    c.met
                      ? "text-[var(--color-improving)]"
                      : "text-[var(--color-muted)]"
                  }
                >
                  {c.met ? "Currently met" : "Not currently met"}
                </span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
