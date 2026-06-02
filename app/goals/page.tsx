import { DomainNav } from "@/components/DomainNav";
import { GoalCard } from "@/components/GoalCard";
import { GoalFilters } from "@/components/GoalFilters";
import { filterGoals, getAllGoals } from "@/lib/goals";
import type { Domain, GoalLevel, GoalStatus } from "@/types";

function normLevel(v: string | undefined): GoalLevel | "all" {
  if (v === "federal" || v === "provincial" || v === "municipal") return v;
  return "all";
}
function normDomain(v: string | undefined): Domain | "all" {
  const ok: Domain[] = ["economy", "social", "housing", "climate", "education", "health"];
  return (ok as string[]).includes(v ?? "") ? (v as Domain) : "all";
}
function normStatus(v: string | undefined): GoalStatus | "all" {
  const ok: GoalStatus[] = ["on-track", "behind", "met", "missed", "unknown"];
  return (ok as string[]).includes(v ?? "") ? (v as GoalStatus) : "all";
}

export default async function GoalsPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string; domain?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const active = {
    level: normLevel(sp.level),
    domain: normDomain(sp.domain),
    status: normStatus(sp.status),
  };
  const all = getAllGoals();
  const availableDomains = Array.from(new Set(all.map((g) => g.domain))).sort();
  const goals = filterGoals(all, active);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 space-y-8">
      <DomainNav active="goals" />

      <header className="max-w-3xl space-y-3">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Government goals</h1>
        <p className="text-[var(--color-muted)] leading-relaxed">
          Public commitments made by Dutch governments — the 2026 coalition agreement, the
          Klimaatwet, defense plans, education investment — tracked against their stated
          targets. Filter by level, domain, or status.
        </p>
      </header>

      <GoalFilters availableDomains={availableDomains} active={active} />

      <Legend />

      <section>
        {goals.length === 0 ? (
          <p className="text-sm text-[var(--color-muted)] italic">
            No goals match the current filters.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.map((g) => (
              <GoalCard key={g.id} goal={g} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Legend() {
  const items: { color: string; label: string }[] = [
    { color: "bg-[var(--color-success)]", label: "On track / Met" },
    { color: "bg-[var(--color-warning)]", label: "Behind" },
    { color: "bg-[var(--color-danger)]", label: "Missed" },
    { color: "bg-[var(--color-muted)]", label: "No data" },
  ];
  return (
    <ul className="flex flex-wrap gap-4 text-xs text-[var(--color-muted)]">
      {items.map((i) => (
        <li key={i.label} className="flex items-center gap-2">
          <span className={`inline-block w-3 h-3 rounded-full ${i.color}`} />
          {i.label}
        </li>
      ))}
    </ul>
  );
}
