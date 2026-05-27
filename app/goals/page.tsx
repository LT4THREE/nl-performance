import { DomainNav } from "@/components/DomainNav";
import { GoalCard } from "@/components/GoalCard";
import { getAllGoals } from "@/lib/goals";

export default function GoalsPage() {
  const goals = getAllGoals();

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 space-y-10">
      <DomainNav active="goals" />

      <header className="max-w-3xl space-y-3">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Government goals</h1>
        <p className="text-[var(--color-muted)] leading-relaxed">
          Public commitments made by Dutch governments — coalition agreements, climate
          legislation, defence plans, and more — tracked against their stated targets. Seed
          set; will expand to cover provincial and municipal commitments next.
        </p>
      </header>

      <Legend />

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.map((g) => (
          <GoalCard key={g.id} goal={g} />
        ))}
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
