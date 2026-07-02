import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DomainNav } from "@/components/DomainNav";
import { KpiCard } from "@/components/KpiCard";
import { GoalCard } from "@/components/GoalCard";
import { CommitmentCard } from "@/components/CommitmentCard";
import { SaidVsShowsCard } from "@/components/SaidVsShowsCard";
import { VerdictHero } from "@/components/VerdictHero";
import { VerdictChangeBox } from "@/components/VerdictChangeBox";
import { topics, findTopic } from "@/data/topics";
import { indicatorsForTopic } from "@/lib/all-indicators";
import { fetchIndicatorWithTimestamp, summarize } from "@/lib/indicators";
import { getAllGoals } from "@/lib/goals";
import { getCommitmentsForTopic } from "@/lib/commitments";
import { getSaidVsShowsForTopic } from "@/lib/said-vs-shows";
import { computeHousingVerdict } from "@/lib/verdict";
import { housingInputs } from "@/data/inputs/housing";
import { InputEntryCard } from "@/components/InputEntryCard";
import { pageMetadata } from "@/lib/seo";
import type { IndicatorDef, MetricType } from "@/types";

type DisplayGroup = NonNullable<IndicatorDef["displayGroup"]>;

const DISPLAY_GROUPS: {
  key: DisplayGroup;
  title: string;
  subtitle: string;
}[] = [
  {
    key: "supply",
    title: "Supply",
    subtitle: "New dwellings added, total stock. The core of the housing question.",
  },
  {
    key: "affordability",
    title: "Affordability",
    subtitle: "Prices and price growth. What buyers face today.",
  },
  {
    key: "market-activity",
    title: "Market activity",
    subtitle: "Transaction volume. Leading indicator of market health.",
  },
  {
    key: "government-delivery",
    title: "Government delivery",
    subtitle: "What the state has actually delivered against its own commitments.",
  },
  {
    key: "inputs",
    title: "Inputs & spending",
    subtitle:
      "Money and legislation committed. Note: inputs are not outcomes; governments often claim success here.",
  },
];

export const revalidate = 21600;

export function generateStaticParams() {
  return topics.map((t) => ({ slug: t.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const topic = findTopic(slug);
  if (!topic) return { title: "Topic not found" };
  return pageMetadata({
    title: `${topic.label} — ${topic.tagline}`,
    description: topic.description,
    path: `/topics/${slug}`,
  });
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = findTopic(slug);
  if (!topic) notFound();

  const inds = indicatorsForTopic(topic.id);
  const goals = getAllGoals().filter((g) => topic.goalIds.includes(g.id));
  const commitments = getCommitmentsForTopic(topic.id);
  const saidVsShows = getSaidVsShowsForTopic(topic.id);

  const rows = await Promise.all(
    inds.map(async (indicator) => {
      try {
        const { points, fetchedAt } = await fetchIndicatorWithTimestamp(indicator);
        const { latest, yoyDelta, yoyDeltaPct } = summarize(points, indicator.frequency);
        return { indicator, latest, yoyDelta, yoyDeltaPct, series: points, fetchedAt };
      } catch {
        return { indicator, latest: null, yoyDelta: null, yoyDeltaPct: null, series: [], fetchedAt: undefined };
      }
    }),
  );

  const byType: Record<MetricType, typeof rows> = {
    outcome: rows.filter((r) => r.indicator.metricType === "outcome"),
    output: rows.filter((r) => r.indicator.metricType === "output"),
    input: rows.filter((r) => r.indicator.metricType === "input"),
  };
  const uncategorised = rows.filter((r) => !r.indicator.metricType);

  const hasDisplayGroups = rows.some((r) => r.indicator.displayGroup);
  const byDisplayGroup: Record<DisplayGroup, typeof rows> = {
    supply: rows.filter((r) => r.indicator.displayGroup === "supply"),
    affordability: rows.filter((r) => r.indicator.displayGroup === "affordability"),
    "market-activity": rows.filter((r) => r.indicator.displayGroup === "market-activity"),
    "government-delivery": rows.filter(
      (r) => r.indicator.displayGroup === "government-delivery",
    ),
    inputs: rows.filter((r) => r.indicator.displayGroup === "inputs"),
  };
  const ungrouped = rows.filter((r) => !r.indicator.displayGroup);

  // Housing-specific verdict hero: derives status/gap/trend from the live
  // new-dwellings-added series and the 100k target. Only rendered on the
  // housing topic today; other topics can add their own verdict later.
  const heroRow =
    topic.id === "housing"
      ? rows.find((r) => r.indicator.id === "new-dwellings-added")
      : undefined;
  const verdict =
    heroRow && heroRow.series.length > 0
      ? computeHousingVerdict(heroRow.series, 100000)
      : null;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10 space-y-10 sm:space-y-12">
      <DomainNav active="topics" />

      <div className="text-sm text-[var(--color-muted)]">
        <Link href="/topics" className="underline hover:text-[var(--color-fg)]">
          ← All topics
        </Link>
      </div>

      <header className="max-w-3xl space-y-3">
        <p className="text-sm text-[var(--color-muted)] uppercase tracking-wide">Issue area</p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">{topic.label}</h1>
        <p className="text-lg text-[var(--color-fg-secondary)] leading-relaxed">
          {topic.tagline}
        </p>
        <p className="text-[var(--color-fg-secondary)] leading-relaxed">
          {topic.description}
        </p>
      </header>

      {verdict && heroRow && (
        <VerdictHero verdict={verdict} indicator={heroRow.indicator} />
      )}

      <section aria-label="Topic context" className="grid md:grid-cols-2 gap-4 sm:gap-6">
        <FactBlock
          heading="Ministries and bodies"
          body={
            <ul className="text-sm text-[var(--color-fg-secondary)] space-y-1 list-disc pl-5">
              {topic.ministries.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          }
        />
        <FactBlock
          heading="What we track"
          body={
            <p className="text-sm text-[var(--color-fg-secondary)] leading-relaxed">
              This platform separates <strong>outcomes</strong> (what changed in society),{" "}
              <strong>outputs</strong> (what the government delivered), and{" "}
              <strong>inputs</strong> (what the government spent or committed). Governments
              usually claim success on inputs; citizens care about outcomes.
            </p>
          }
        />
      </section>

      {rows.length === 0 && goals.length === 0 && (
        <EmptyStateSection topic={topic} />
      )}

      {hasDisplayGroups ? (
        <>
          {DISPLAY_GROUPS.map((g) => (
            <MetricSection
              key={g.key}
              title={g.title}
              subtitle={g.subtitle}
              rows={byDisplayGroup[g.key]}
            />
          ))}
          {ungrouped.length > 0 && (
            <MetricSection
              title="Other metrics"
              subtitle="Not yet classified into a display group."
              rows={ungrouped}
            />
          )}
        </>
      ) : (
        <>
          <MetricSection
            title="Outcomes"
            subtitle="What actually changed in Dutch society."
            rows={byType.outcome}
          />
          <MetricSection
            title="Outputs"
            subtitle="What government delivered."
            rows={byType.output}
          />
          <MetricSection
            title="Inputs"
            subtitle="What government put in (money, staffing, legislation). Note: not a measure of success on its own."
            rows={byType.input}
          />
          {uncategorised.length > 0 && (
            <MetricSection
              title="Other metrics"
              subtitle="Not yet classified as outcome / output / input."
              rows={uncategorised}
            />
          )}
        </>
      )}

      {topic.id === "housing" && (
        <section aria-labelledby="inputs-heading" className="space-y-3">
          <header>
            <h2 id="inputs-heading" className="text-xl font-semibold">
              Inputs &amp; spending
            </h2>
            <p className="text-sm text-[var(--color-fg-secondary)] mt-0.5">
              Money and legislation the state has committed to housing supply. Inputs are not
              outcomes — the verdict panel above shows whether they are producing results.
              Live budget-line integration (Rijksfinanciën, ministry annual reports) is
              pending; entries marked <em>Demo</em> below are structured placeholders showing
              the intended shape.
            </p>
          </header>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {housingInputs.map((entry) => (
              <InputEntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        </section>
      )}

      {saidVsShows.length > 0 && (
        <section aria-labelledby="said-vs-shows-heading" className="space-y-3">
          <header>
            <h2 id="said-vs-shows-heading" className="text-xl font-semibold">
              Government said · Data shows
            </h2>
            <p className="text-sm text-[var(--color-fg-secondary)] mt-0.5">
              A curated pairing of a specific government statement with the measured outcome
              from the same time window. Factual, sourced, non-sarcastic.
            </p>
          </header>
          <div className="space-y-4">
            {saidVsShows.map((item) => (
              <SaidVsShowsCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {verdict && <VerdictChangeBox verdict={verdict} />}

      {commitments.length > 0 && (
        <section aria-labelledby="commitments-heading" className="space-y-3">
          <header>
            <h2 id="commitments-heading" className="text-xl font-semibold">
              Government commitments
            </h2>
            <p className="text-sm text-[var(--color-fg-secondary)] mt-0.5">
              Public commitments — coalition agreements, statutory laws, international
              obligations. Each shows the promise text, target, delivery status, and outcome
              status separately.
            </p>
          </header>
          <div className="grid sm:grid-cols-2 gap-4">
            {commitments.map((c) => (
              <CommitmentCard key={c.id} commitment={c} />
            ))}
          </div>
        </section>
      )}

      {goals.length > 0 && commitments.length === 0 && (
        <section aria-labelledby="goals-heading" className="space-y-3">
          <header>
            <h2 id="goals-heading" className="text-xl font-semibold">
              Government goals
            </h2>
            <p className="text-sm text-[var(--color-fg-secondary)] mt-0.5">
              Public goals tracked against this topic. Richer commitment cards will replace
              these as we curate them per topic.
            </p>
          </header>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.map((g) => (
              <GoalCard key={g.id} goal={g} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function FactBlock({ heading, body }: { heading: string; body: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-2">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)]">
        {heading}
      </h3>
      {body}
    </div>
  );
}

function MetricSection({
  title,
  subtitle,
  rows,
}: {
  title: string;
  subtitle: string;
  rows: {
    indicator: IndicatorDef;
    latest: Awaited<ReturnType<typeof summarize>>["latest"];
    yoyDelta: number | null;
    yoyDeltaPct: number | null;
    series: Awaited<ReturnType<typeof fetchIndicatorWithTimestamp>>["points"];
    fetchedAt: string | undefined;
  }[];
}) {
  if (rows.length === 0) return null;
  const headingId = `metrics-${title.toLowerCase()}`;
  return (
    <section aria-labelledby={headingId} className="space-y-3">
      <header>
        <h2 id={headingId} className="text-xl font-semibold">
          {title}
        </h2>
        <p className="text-sm text-[var(--color-fg-secondary)] mt-0.5">{subtitle}</p>
      </header>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rows.map(({ indicator, latest, yoyDelta, yoyDeltaPct, series, fetchedAt }) => (
          <KpiCard
            key={indicator.id}
            indicator={indicator}
            latest={latest}
            yoyDelta={yoyDelta}
            yoyDeltaPct={yoyDeltaPct}
            series={series}
            fetchedAt={fetchedAt}
            href={`/${indicator.domain}/${indicator.id}`}
          />
        ))}
      </div>
    </section>
  );
}

function EmptyStateSection({
  topic,
}: {
  topic: ReturnType<typeof findTopic> & object;
}) {
  return (
    <section className="rounded-xl border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface-subtle)] p-8 text-center space-y-3">
      <h2 className="text-lg font-semibold">Data integration planned</h2>
      <p className="text-sm text-[var(--color-fg-secondary)] max-w-xl mx-auto leading-relaxed">
        No live outcome indicators for <strong>{topic.label}</strong> yet. Priority sources are
        listed in the description above and on the{" "}
        <Link href="/sources" className="underline hover:text-[var(--color-fg)]">
          /sources
        </Link>{" "}
        page.
      </p>
    </section>
  );
}
