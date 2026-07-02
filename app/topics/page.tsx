import { DomainNav } from "@/components/DomainNav";
import { TopicCard } from "@/components/TopicCard";
import { topics } from "@/data/topics";
import { pageMetadata } from "@/lib/seo";
import { indicatorsForTopic } from "@/lib/all-indicators";
import { getAllGoals } from "@/lib/goals";

export const metadata = pageMetadata({
  title: "Issue areas — 15 public topics tracked",
  description:
    "Government performance measured across the 15 public issue areas Dutch citizens actually care about: housing, healthcare, immigration, defence, climate, and more — each mapped to the ministries that own it.",
  path: "/topics",
});

export default function TopicsIndex() {
  const goals = getAllGoals();
  const goalCountByTopic = new Map<string, number>();
  for (const t of topics) {
    goalCountByTopic.set(t.id, goals.filter((g) => t.goalIds.includes(g.id)).length);
  }

  const live = topics.filter((t) => t.status === "live");
  const partial = topics.filter((t) => t.status === "partial");
  const planned = topics.filter((t) => t.status === "planned");

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 space-y-12">
      <DomainNav active="topics" />

      <header className="max-w-3xl space-y-3">
        <p className="text-sm text-[var(--color-muted)] uppercase tracking-wide">
          Issue areas
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          15 public topics, tracked
        </h1>
        <p className="text-[var(--color-fg-secondary)] leading-relaxed">
          Government performance organised by the issue areas citizens actually think in — not
          by which ministry owns which file cabinet. Each topic maps to the relevant
          ministries, its own set of outcome, output, and input metrics, and any live
          government goals that measure the same thing.
        </p>
      </header>

      <TopicSection
        title="Live topics"
        subtitle="At least one live indicator sourced from CBS, ECB, or Eurostat."
        topics={live}
        goalCountByTopic={goalCountByTopic}
      />

      <TopicSection
        title="Partial coverage"
        subtitle="A goal is tracked, but no live outcome indicator yet."
        topics={partial}
        goalCountByTopic={goalCountByTopic}
      />

      <TopicSection
        title="Planned"
        subtitle="Data integration planned — the priority sources are named on each topic page."
        topics={planned}
        goalCountByTopic={goalCountByTopic}
      />
    </div>
  );
}

function TopicSection({
  title,
  subtitle,
  topics,
  goalCountByTopic,
}: {
  title: string;
  subtitle: string;
  topics: typeof import("@/data/topics").topics;
  goalCountByTopic: Map<string, number>;
}) {
  if (topics.length === 0) return null;
  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-[var(--color-fg-secondary)] mt-0.5">{subtitle}</p>
      </header>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map((t) => (
          <TopicCard
            key={t.id}
            topic={t}
            metricCount={indicatorsForTopic(t.id).length}
            goalCount={goalCountByTopic.get(t.id) ?? 0}
          />
        ))}
      </div>
    </section>
  );
}
