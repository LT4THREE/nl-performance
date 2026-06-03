import type { Domain } from "@/types";
import { plannedNext } from "@/data/planned";

export function PlannedNext({ domain }: { domain: Domain }) {
  const items = plannedNext[domain];
  if (!items?.length) return null;
  return (
    <aside className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)]">
        Planned next
      </h2>
      <ul className="mt-3 space-y-1.5 text-sm">
        {items.map((it) => (
          <li key={it.metric} className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-medium text-[var(--color-fg)]">{it.metric}</span>
            <span className="text-xs text-[var(--color-muted)]">— {it.source}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
