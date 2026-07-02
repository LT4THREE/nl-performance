import Link from "next/link";
import type { TopicMeta } from "@/types";

const statusMeta: Record<TopicMeta["status"], { label: string; classes: string }> = {
  live: {
    label: "Live",
    classes: "bg-[var(--color-improving-soft)] text-[var(--color-improving)]",
  },
  partial: {
    label: "Partial",
    classes: "bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)]",
  },
  planned: {
    label: "Planned",
    classes: "bg-[var(--color-neutral-soft)] text-[var(--color-neutral)]",
  },
};

export function TopicCard({
  topic,
  metricCount,
  goalCount,
}: {
  topic: TopicMeta;
  metricCount: number;
  goalCount: number;
}) {
  const s = statusMeta[topic.status];
  return (
    <Link
      href={`/topics/${topic.id}`}
      className="group block rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-colors hover:border-[var(--color-border-strong)] hover:shadow-[0_2px_8px_-2px_rgba(15,23,42,0.08)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-[var(--color-fg)] leading-tight">
            {topic.label}
          </h3>
          <p className="text-sm text-[var(--color-fg-secondary)] mt-1 leading-snug">
            {topic.tagline}
          </p>
        </div>
        <span
          className={`shrink-0 px-2 py-0.5 rounded-md text-xs font-medium ${s.classes}`}
        >
          {s.label}
        </span>
      </div>
      <div className="mt-4 flex items-center gap-4 text-xs text-[var(--color-muted)]">
        <span>
          <span className="font-medium text-[var(--color-fg-secondary)]">{metricCount}</span> metric{metricCount === 1 ? "" : "s"}
        </span>
        <span>
          <span className="font-medium text-[var(--color-fg-secondary)]">{goalCount}</span> goal{goalCount === 1 ? "" : "s"}
        </span>
      </div>
    </Link>
  );
}
