import Link from "next/link";
import { DomainNav } from "@/components/DomainNav";
import { TopicCard } from "@/components/TopicCard";
import { topics } from "@/data/topics";
import { indicatorsForTopic } from "@/lib/all-indicators";
import { getAllGoals } from "@/lib/goals";
import { computeHeroDivergence } from "@/lib/hero";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 21600;

export const metadata = pageMetadata({
  title: "Government performance, measured",
  description:
    "A neutral evidence platform tracking Dutch government goals, public outcomes, election promises, and policy delivery. Data from CBS, ECB, Eurostat, RIVM and other independent sources.",
  path: "/",
});

export default function Home() {
  const goals = getAllGoals();
  const divergence = computeHeroDivergence();

  const goalCountByTopic = new Map<string, number>();
  for (const t of topics) {
    goalCountByTopic.set(t.id, goals.filter((g) => t.goalIds.includes(g.id)).length);
  }
  const liveTopics = topics.filter((t) => t.status === "live");

  const liveIndicatorTotal = topics.reduce(
    (sum, t) => sum + indicatorsForTopic(t.id).length,
    0,
  );
  const trackedGoalTotal = goals.length;
  const liveTopicTotal = liveTopics.length;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 space-y-16">
      <DomainNav active="home" />

      {/* Hero */}
      <section className="max-w-3xl space-y-5">
        <p className="text-sm text-[var(--color-muted)] uppercase tracking-wide">
          Netherlands · civic evidence platform
        </p>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.1] text-[var(--color-fg)]">
          Government performance, measured.
        </h1>
        <p className="text-lg text-[var(--color-fg-secondary)] leading-relaxed">
          A neutral evidence platform tracking Dutch government goals, public outcomes,
          election promises, and policy delivery — organised by the issue areas citizens
          actually think in, sourced from independent institutions, and cross-referenced with
          what governments have publicly committed to.
        </p>

        {divergence && (
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 mt-4">
            <p className="text-xs uppercase tracking-wide text-[var(--color-muted)] font-medium">
              Most divergent goal right now
            </p>
            <p className="mt-2 text-[var(--color-fg)] leading-relaxed">
              {divergence.sentence}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/topics"
            className="px-4 py-2 rounded-md bg-[var(--color-accent)] text-[var(--color-accent-fg)] text-sm font-medium hover:bg-[var(--color-accent-strong)] transition-colors"
          >
            Explore issue areas
          </Link>
          <Link
            href="/goals"
            className="px-4 py-2 rounded-md border border-[var(--color-border-strong)] text-[var(--color-fg-soft)] text-sm font-medium hover:bg-[var(--color-surface-subtle)] transition-colors"
          >
            Track government goals
          </Link>
        </div>
      </section>

      {/* Coverage strip */}
      <section
        aria-label="Coverage summary"
        className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <p className="text-sm text-[var(--color-fg-secondary)] leading-snug max-w-2xl">
          Tracking{" "}
          <strong className="text-[var(--color-fg)]">{liveTopicTotal}</strong> live issue
          areas across{" "}
          <strong className="text-[var(--color-fg)]">{liveIndicatorTotal}</strong> live
          indicators sourced from CBS, ECB and Eurostat, with{" "}
          <strong className="text-[var(--color-fg)]">{trackedGoalTotal}</strong> federal
          commitments tracked against them.
        </p>
        <Link
          href="/sources"
          className="text-sm font-medium text-[var(--color-accent-strong)] hover:text-[var(--color-accent)] transition-colors shrink-0"
        >
          See every source →
        </Link>
      </section>

      {/* Issue areas grid */}
      <section className="space-y-5">
        <header className="flex items-baseline justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-2xl font-semibold text-[var(--color-fg)]">Issue areas</h2>
            <p className="text-sm text-[var(--color-fg-secondary)] mt-1">
              The 15 public topics tracked, grouped by data-integration status.
            </p>
          </div>
          <Link
            href="/topics"
            className="text-sm text-[var(--color-fg-secondary)] hover:text-[var(--color-fg)] underline"
          >
            All topics →
          </Link>
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

      {/* Positioning */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Why this exists</h2>
          <p className="text-[var(--color-fg-secondary)] leading-relaxed">
            The information needed to hold Dutch governments accountable is public — it&apos;s
            just scattered across CBS tables, ministerial websites, RIVM reports, coalition
            agreements, and hundreds of PDFs. This platform brings the most important
            evidence together in one place, links every number to its primary source, and
            makes government performance against stated goals visible at a glance.
          </p>
        </div>
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">What this is not</h2>
          <p className="text-[var(--color-fg-secondary)] leading-relaxed">
            Not partisan. Not an activist project. Not a scorecard for or against any party.
            Official statistics are shown separately from government communication. The
            platform does not decide whether a policy is good or bad — it tracks whether
            stated goals, measurable outcomes, and public commitments are moving in the same
            direction.
          </p>
        </div>
      </section>
    </div>
  );
}
