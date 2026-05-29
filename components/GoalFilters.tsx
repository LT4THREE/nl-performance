"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { Goal, GoalLevel, GoalStatus, Domain } from "@/types";

type Active = {
  level?: GoalLevel | "all";
  domain?: Domain | "all";
  status?: GoalStatus | "all";
};

const levels: { key: GoalLevel | "all"; label: string }[] = [
  { key: "all", label: "All levels" },
  { key: "federal", label: "Federal" },
  { key: "provincial", label: "Provincial" },
  { key: "municipal", label: "Municipal" },
];

const statuses: { key: GoalStatus | "all"; label: string }[] = [
  { key: "all", label: "All statuses" },
  { key: "on-track", label: "On track" },
  { key: "behind", label: "Behind" },
  { key: "met", label: "Met" },
  { key: "missed", label: "Missed" },
  { key: "unknown", label: "No data" },
];

export function GoalFilters({ availableDomains, active }: { availableDomains: Domain[]; active: Active }) {
  const pathname = usePathname();
  const params = useSearchParams();

  function buildHref(key: string, value: string): string {
    const next = new URLSearchParams(params?.toString() ?? "");
    if (value === "all") next.delete(key);
    else next.set(key, value);
    const q = next.toString();
    return q ? `${pathname}?${q}` : pathname;
  }

  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 text-sm">
      <FilterGroup
        label="Level"
        options={levels.map((l) => ({ key: l.key, label: l.label }))}
        activeKey={active.level ?? "all"}
        hrefFor={(k) => buildHref("level", k)}
      />
      <FilterGroup
        label="Domain"
        options={[
          { key: "all", label: "All domains" },
          ...availableDomains.map((d) => ({ key: d, label: d.charAt(0).toUpperCase() + d.slice(1) })),
        ]}
        activeKey={active.domain ?? "all"}
        hrefFor={(k) => buildHref("domain", k)}
      />
      <FilterGroup
        label="Status"
        options={statuses.map((s) => ({ key: s.key, label: s.label }))}
        activeKey={active.status ?? "all"}
        hrefFor={(k) => buildHref("status", k)}
      />
    </div>
  );
}

function FilterGroup({
  label,
  options,
  activeKey,
  hrefFor,
}: {
  label: string;
  options: { key: string; label: string }[];
  activeKey: string;
  hrefFor: (key: string) => string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs uppercase tracking-wide text-[var(--color-muted)] shrink-0">{label}</span>
      <div className="inline-flex flex-wrap gap-1 p-1 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
        {options.map((o) => {
          const isActive = o.key === activeKey;
          return (
            <Link
              key={o.key}
              href={hrefFor(o.key)}
              scroll={false}
              className={[
                "px-2.5 py-1 rounded-md text-xs font-medium transition-colors duration-150",
                isActive
                  ? "bg-[var(--color-bg)] text-[var(--color-fg)] shadow-sm border border-[var(--color-border)]"
                  : "text-[var(--color-muted)] hover:text-[var(--color-fg)]",
              ].join(" ")}
            >
              {o.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function filterGoals(
  goals: Goal[],
  active: Active,
): Goal[] {
  return goals.filter((g) => {
    if (active.level && active.level !== "all" && g.level !== active.level) return false;
    if (active.domain && active.domain !== "all" && g.domain !== active.domain) return false;
    if (active.status && active.status !== "all" && g.status !== active.status) return false;
    return true;
  });
}
