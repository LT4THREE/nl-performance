import type { Commitment, CommitmentType, GovernmentActionStatus } from "@/types";
import { formatNumber } from "@/lib/format";

const commitmentTypeLabel: Record<CommitmentType, string> = {
  coalition_agreement: "Coalition agreement",
  statutory_law: "Statutory law",
  election_manifesto: "Election manifesto",
  international_treaty: "International treaty",
  government_program: "Government program",
};

const actionStatusLabel: Record<GovernmentActionStatus, string> = {
  no_action: "No action yet",
  announced: "Announced",
  legislation_drafted: "Legislation drafted",
  legislation_passed: "Legislation passed",
  implementation_underway: "Implementation underway",
  delivered: "Delivered",
  abandoned: "Abandoned",
};

const outcomeStatusLabel: Record<Commitment["outcomeStatus"], string> = {
  "on-track": "On track",
  behind: "Behind",
  met: "Met",
  missed: "Missed",
  unknown: "No data",
};

const outcomePillClasses: Record<Commitment["outcomeStatus"], string> = {
  "on-track": "bg-[var(--color-improving-soft)] text-[var(--color-improving)]",
  behind: "bg-[var(--color-watch-soft)] text-[var(--color-watch)]",
  met: "bg-[var(--color-improving-soft)] text-[var(--color-improving)]",
  missed: "bg-[var(--color-worsening-soft)] text-[var(--color-worsening)]",
  unknown: "bg-[var(--color-neutral-soft)] text-[var(--color-neutral)]",
};

const actionPillClasses = "bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)]";

function DemoBadge() {
  return (
    <span
      className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide bg-[var(--color-watch-soft)] text-[var(--color-watch)] border border-[var(--color-watch)]/20"
      title="Political attribution / source URL not independently re-verified in this build. CBS/ECB/Eurostat measurements remain live."
    >
      Demo
    </span>
  );
}

export function CommitmentCard({ commitment }: { commitment: Commitment }) {
  const c = commitment;
  return (
    <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-4">
      <header className="space-y-2">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="text-xs uppercase tracking-wide text-[var(--color-muted)] font-medium">
            {commitmentTypeLabel[c.type]} · {c.yearMade}
          </span>
          <div className="flex items-center gap-2">
            {c.isDemo && <DemoBadge />}
            <span
              className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium ${outcomePillClasses[c.outcomeStatus]}`}
            >
              Outcome: {outcomeStatusLabel[c.outcomeStatus]}
            </span>
          </div>
        </div>
        <h3 className="text-base font-semibold text-[var(--color-fg)] leading-snug">
          {c.title}
        </h3>
        <p className="text-sm text-[var(--color-fg-secondary)] leading-relaxed italic">
          &ldquo;{c.exactPromiseText}&rdquo;
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs text-[var(--color-muted)]">Target</p>
          <p className="font-medium text-[var(--color-fg)]">
            {formatNumber(c.target.value)} {c.target.unit}
          </p>
          <p className="text-xs text-[var(--color-muted)]">by {c.target.deadline.slice(0, 4)}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--color-muted)]">Government action</p>
          <span
            className={`inline-block mt-0.5 px-2 py-0.5 rounded-md text-xs font-medium ${actionPillClasses}`}
          >
            {actionStatusLabel[c.governmentActionStatus]}
          </span>
        </div>
      </div>

      <footer className="pt-3 border-t border-[var(--color-border)] space-y-2">
        <p className="text-xs text-[var(--color-muted)]">
          <span className="font-medium text-[var(--color-fg-secondary)]">Owner:</span> {c.owner}
        </p>
        <p className="text-xs text-[var(--color-muted)]">
          <span className="font-medium text-[var(--color-fg-secondary)]">Source:</span>{" "}
          {c.source.url ? (
            <a
              href={c.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[var(--color-fg)]"
            >
              {c.source.document}
            </a>
          ) : (
            c.source.document
          )}
        </p>
        {c.notes && (
          <p className="text-xs italic text-[var(--color-muted)] leading-relaxed pt-1">
            {c.notes}
          </p>
        )}
      </footer>
    </article>
  );
}
