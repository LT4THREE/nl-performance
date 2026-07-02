import type { InputEntry } from "@/data/inputs/housing";
import { ConfidenceBadge } from "./ConfidenceBadge";

export function InputEntryCard({ entry }: { entry: InputEntry }) {
  return (
    <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-3">
      <header className="space-y-2">
        <div className="flex items-baseline justify-between gap-2 flex-wrap">
          <h3 className="text-sm font-semibold text-[var(--color-fg)] leading-snug">
            {entry.title}
          </h3>
          <div className="flex items-center gap-2 shrink-0">
            {entry.isDemo && (
              <span
                className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-[var(--color-watch-soft)] text-[var(--color-watch)]"
                title="Structured placeholder — pending real source integration. See methodology."
              >
                Demo
              </span>
            )}
            <ConfidenceBadge level={entry.confidence} size="xs" />
          </div>
        </div>
        {entry.value && (
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-2xl font-semibold text-[var(--color-fg)] tracking-tight">
              {entry.value}
            </span>
            {entry.unit && (
              <span className="text-xs text-[var(--color-fg-secondary)]">{entry.unit}</span>
            )}
            {entry.timeframe && (
              <span className="text-xs text-[var(--color-muted)] ml-auto">
                {entry.timeframe}
              </span>
            )}
          </div>
        )}
      </header>

      <p className="text-sm text-[var(--color-fg-secondary)] leading-relaxed">
        {entry.description}
      </p>

      {entry.sourceLabel && (
        <footer className="pt-3 border-t border-[var(--color-border)]">
          <p className="text-xs text-[var(--color-muted)]">
            <span className="font-medium text-[var(--color-fg-secondary)]">Source:</span>{" "}
            {entry.sourceUrl ? (
              <a
                href={entry.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[var(--color-fg)]"
              >
                {entry.sourceLabel}
              </a>
            ) : (
              entry.sourceLabel
            )}
          </p>
        </footer>
      )}
    </article>
  );
}
