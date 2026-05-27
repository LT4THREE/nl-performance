import type { Goal } from "@/types";
import { formatNumber } from "@/lib/format";
import { progressPct } from "@/lib/goals";
import { ProgressBar } from "./ProgressBar";

const statusLabel: Record<Goal["status"], string> = {
  "on-track": "On track",
  behind: "Behind",
  met: "Met",
  missed: "Missed",
  unknown: "No data",
};

const statusPill: Record<Goal["status"], string> = {
  "on-track": "bg-[var(--color-success)] text-white",
  behind: "bg-[var(--color-warning)] text-white",
  met: "bg-[var(--color-success)] text-white",
  missed: "bg-[var(--color-danger)] text-white",
  unknown: "bg-[var(--color-surface)] text-[var(--color-muted)]",
};

export function GoalCard({ goal }: { goal: Goal }) {
  const pct = progressPct(goal);
  return (
    <article className="flex flex-col gap-4 p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] h-full">
      <header className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">
            {goal.level} · {goal.domain}
          </p>
          <h3 className="text-base font-semibold leading-tight">{goal.title}</h3>
        </div>
        <span
          className={`shrink-0 px-2 py-1 rounded-md text-xs font-medium ${statusPill[goal.status]}`}
        >
          {statusLabel[goal.status]}
        </span>
      </header>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs text-[var(--color-muted)]">Target</p>
          <p className="font-medium">
            {formatNumber(goal.target.value)} {goal.target.unit}
          </p>
          <p className="text-xs text-[var(--color-muted)]">by {goal.target.deadline.slice(0, 4)}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--color-muted)]">Current</p>
          <p className="font-medium">
            {goal.current
              ? `${formatNumber(goal.current.value)} ${goal.current.unit}`
              : "—"}
          </p>
          {goal.current && (
            <p className="text-xs text-[var(--color-muted)]">as of {goal.current.asOf.slice(0, 7)}</p>
          )}
        </div>
      </div>

      <ProgressBar pct={pct} status={goal.status} />

      <footer className="flex items-center justify-between text-xs text-[var(--color-muted)]">
        <span>{goal.source.document}</span>
        {goal.source.url && (
          <a
            href={goal.source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[var(--color-fg)]"
          >
            Source
          </a>
        )}
      </footer>

      {goal.notes && (
        <p className="text-xs italic text-[var(--color-muted)] leading-snug">{goal.notes}</p>
      )}
    </article>
  );
}
