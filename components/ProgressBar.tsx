import type { GoalStatus } from "@/types";

const statusBar: Record<GoalStatus, string> = {
  "on-track": "bg-[var(--color-success)]",
  behind: "bg-[var(--color-warning)]",
  met: "bg-[var(--color-success)]",
  missed: "bg-[var(--color-danger)]",
  unknown: "bg-[var(--color-muted)]",
};

export function ProgressBar({
  pct,
  status,
}: {
  pct: number | null;
  status: GoalStatus;
}) {
  const width = pct === null ? 0 : Math.max(0, Math.min(100, pct));
  return (
    <div className="w-full h-2 rounded-full bg-[var(--color-surface)] overflow-hidden">
      <div
        className={`h-full ${statusBar[status]} transition-all`}
        style={{ width: `${width}%` }}
        role="progressbar"
        aria-valuenow={Math.round(width)}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}
