import { DomainNav } from "@/components/DomainNav";
import { economyIndicators } from "@/data/indicators/economy";
import { housingIndicators } from "@/data/indicators/housing";
import { getAllGoals } from "@/lib/goals";
import { fetchTableInfo } from "@/lib/cbs";
import type { IndicatorDef } from "@/types";

export const revalidate = 86400; // 24h

type LiveSource = {
  indicator: IndicatorDef;
  title: string;
  period: string;
  frequency: string;
  modified: string;
  status: string;
};

async function loadLiveSources(): Promise<LiveSource[]> {
  const all = [...economyIndicators, ...housingIndicators];
  const seen = new Map<string, LiveSource>();
  const results = await Promise.all(
    all.map(async (indicator) => {
      try {
        const info = await fetchTableInfo(indicator.cbsTable);
        return {
          indicator,
          title: info.Title ?? info.ShortTitle ?? indicator.cbsTable,
          period: info.Period ?? "—",
          frequency: info.Frequency ?? "—",
          modified: info.Modified?.slice(0, 10) ?? "—",
          status: info.ReasonDelivery ?? "Actief",
        };
      } catch {
        return {
          indicator,
          title: indicator.label,
          period: "—",
          frequency: "—",
          modified: "—",
          status: "Unavailable",
        };
      }
    }),
  );
  // De-dup by CBS table (multiple indicators can share one table).
  for (const r of results) {
    if (!seen.has(r.indicator.cbsTable)) seen.set(r.indicator.cbsTable, r);
  }
  return Array.from(seen.values());
}

export default async function SourcesPage() {
  const live = await loadLiveSources();
  const goals = getAllGoals();
  const goalSourceDocs = Array.from(
    new Map(goals.map((g) => [g.source.url ?? g.source.document, g.source])).values(),
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 space-y-12">
      <DomainNav active="sources" />

      <header className="max-w-3xl space-y-3">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Sources</h1>
        <p className="text-[var(--color-muted)] leading-relaxed">
          Every number on this site is sourced. This page lists the open-data tables we
          currently query, the government documents we extract goals from, and the broader
          ecosystem of Dutch and international institutions we plan to integrate as the
          platform grows. All CBS data is reused under the CC-BY licence.
        </p>
      </header>

      <Section
        title="Live data tables in use"
        subtitle="Every CBS OData table we currently call, with its native title, period coverage, publication frequency, and last-modified date — fetched from CBS at build time."
      >
        <div className="overflow-x-auto border border-[var(--color-border)] rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface)] text-left text-xs uppercase tracking-wide text-[var(--color-muted)]">
              <tr>
                <th className="px-4 py-3 font-medium">CBS table</th>
                <th className="px-4 py-3 font-medium">Indicator</th>
                <th className="px-4 py-3 font-medium">Period</th>
                <th className="px-4 py-3 font-medium">Frequency</th>
                <th className="px-4 py-3 font-medium">Last modified</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {live.map((s) => (
                <tr
                  key={s.indicator.cbsTable}
                  className="border-t border-[var(--color-border)] align-top"
                >
                  <td className="px-4 py-3 font-mono text-xs">
                    <a
                      href={`https://opendata.cbs.nl/statline/#/CBS/nl/dataset/${s.indicator.cbsTable}/table`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-[var(--color-accent-strong)]"
                    >
                      {s.indicator.cbsTable}
                    </a>
                    <div className="text-[var(--color-muted)] mt-1 font-sans normal-case">
                      {s.title}
                    </div>
                  </td>
                  <td className="px-4 py-3">{s.indicator.shortLabel}</td>
                  <td className="px-4 py-3 text-[var(--color-muted)]">{s.period}</td>
                  <td className="px-4 py-3 text-[var(--color-muted)]">{s.frequency}</td>
                  <td className="px-4 py-3 text-[var(--color-muted)]">{s.modified}</td>
                  <td className="px-4 py-3">
                    <span
                      className={[
                        "inline-block px-2 py-0.5 rounded-md text-xs font-medium",
                        s.status.toLowerCase().includes("stopgezet")
                          ? "bg-[var(--color-warning-soft)] text-[var(--color-warning)]"
                          : "bg-[var(--color-success-soft)] text-[var(--color-success)]",
                      ].join(" ")}
                    >
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        title="Goal source documents"
        subtitle="The public documents that the goals tracked on this site are extracted from."
      >
        <ul className="space-y-2">
          {goalSourceDocs.map((s) => (
            <li key={s.url ?? s.document} className="text-sm">
              {s.url ? (
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-[var(--color-accent-strong)]"
                >
                  {s.document}
                </a>
              ) : (
                s.document
              )}
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title="Data partner ecosystem"
        subtitle="The institutions whose data we use today or plan to integrate. The Dutch open-data ecosystem is unusually rich, and a credible accountability cockpit eventually needs to draw from all of them."
      >
        <div className="grid md:grid-cols-2 gap-4">
          {partners.map((g) => (
            <article
              key={g.title}
              className="rounded-xl border border-[var(--color-border)] p-4 space-y-2"
            >
              <h3 className="font-semibold text-[var(--color-fg)]">{g.title}</h3>
              <ul className="space-y-2 text-sm">
                {g.items.map((p) => (
                  <li key={p.name}>
                    <div className="flex flex-wrap items-baseline gap-2">
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium underline hover:text-[var(--color-accent-strong)]"
                      >
                        {p.name}
                      </a>
                      <span
                        className={[
                          "inline-block px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide",
                          p.status === "in-use"
                            ? "bg-[var(--color-success-soft)] text-[var(--color-success)]"
                            : "bg-[var(--color-surface-strong)] text-[var(--color-muted)]",
                        ].join(" ")}
                      >
                        {p.status === "in-use" ? "In use" : "Planned"}
                      </span>
                    </div>
                    <p className="text-[var(--color-muted)] mt-0.5">{p.scope}</p>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      <Section
        title="Licensing & reuse"
        subtitle="What you can do with the data shown here."
      >
        <ul className="list-disc pl-5 text-sm text-[var(--color-muted)] space-y-1">
          <li>
            CBS data is published under{" "}
            <a
              href="https://www.cbs.nl/en-gb/about-us/website/copyright"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[var(--color-fg)]"
            >
              CC-BY 4.0
            </a>
            ; attribution is preserved on every chart.
          </li>
          <li>
            Goal source documents are public Dutch government materials, linked back to their
            original location.
          </li>
          <li>
            This site is an independent prototype. It is not affiliated with CBS, the Dutch
            government, or any party.
          </li>
        </ul>
      </Section>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <h2 className="text-xl font-semibold">{title}</h2>
        {subtitle && (
          <p className="text-sm text-[var(--color-muted)] leading-relaxed max-w-3xl">
            {subtitle}
          </p>
        )}
      </header>
      {children}
    </section>
  );
}

type Status = "in-use" | "planned";
type Partner = { name: string; url: string; scope: string; status: Status };
type PartnerGroup = { title: string; items: Partner[] };

const partners: PartnerGroup[] = [
  {
    title: "Statistical & monetary",
    items: [
      {
        name: "CBS (Statistics Netherlands)",
        url: "https://www.cbs.nl/en-gb/our-services/open-data",
        scope:
          "Primary source for economic, labour, housing, demographic, and most domain statistics. ~5,000 open data tables via OData.",
        status: "in-use",
      },
      {
        name: "DNB (Dutch Central Bank)",
        url: "https://www.dnb.nl/en/statistics/",
        scope:
          "Interest rates, mortgage rates, financial stability, banking sector indicators, payment statistics.",
        status: "planned",
      },
      {
        name: "Kadaster",
        url: "https://www.kadaster.nl/zakelijk/registraties",
        scope:
          "Land registry: housing transactions, property prices, land use. Underpins CBS housing tables.",
        status: "planned",
      },
    ],
  },
  {
    title: "Forecasting & policy analysis",
    items: [
      {
        name: "CPB (Bureau for Economic Policy Analysis)",
        url: "https://www.cpb.nl/en",
        scope:
          "Macroeconomic forecasts (MEV/CEP), budget analysis, election platform costing. Critical for forward-looking goal tracking.",
        status: "planned",
      },
      {
        name: "PBL (Environmental Assessment Agency)",
        url: "https://www.pbl.nl/en",
        scope:
          "Climate and Energy Outlook (KEV), nature, biodiversity, mobility. Authoritative on climate-target progress.",
        status: "planned",
      },
      {
        name: "SCP (Social and Cultural Planning Office)",
        url: "https://www.scp.nl/english",
        scope:
          "Well-being, social cohesion, quality of life. The natural source for the Social domain.",
        status: "planned",
      },
      {
        name: "WRR (Scientific Council for Government Policy)",
        url: "https://english.wrr.nl/",
        scope: "Long-horizon policy analysis on strategic challenges (AI, security, aging, energy).",
        status: "planned",
      },
    ],
  },
  {
    title: "Public health & environment",
    items: [
      {
        name: "RIVM (National Institute for Public Health)",
        url: "https://www.rivm.nl/en",
        scope:
          "Greenhouse-gas emissions (Emissieregistratie), nitrogen deposition, vaccination, infectious disease, air quality.",
        status: "planned",
      },
      {
        name: "NZa (Dutch Healthcare Authority)",
        url: "https://www.nza.nl/english",
        scope: "Healthcare cost, capacity, waiting lists, insurance market regulation.",
        status: "planned",
      },
    ],
  },
  {
    title: "Oversight & accountability",
    items: [
      {
        name: "Algemene Rekenkamer (Court of Audit)",
        url: "https://www.rekenkamer.nl/english",
        scope:
          "Independent audits of ministerial budgets and policy effectiveness. Direct evidence for goal-vs-reality.",
        status: "planned",
      },
      {
        name: "Nationale Ombudsman",
        url: "https://www.nationaleombudsman.nl/over-de-ombudsman/english",
        scope: "Citizen complaints, government service quality.",
        status: "planned",
      },
      {
        name: "Rijksoverheid open data",
        url: "https://data.overheid.nl/",
        scope:
          "Federated open-data portal across all ministries and many municipalities. ~25,000 datasets.",
        status: "planned",
      },
    ],
  },
  {
    title: "International benchmarks",
    items: [
      {
        name: "Eurostat",
        url: "https://ec.europa.eu/eurostat",
        scope: "Harmonised EU statistics — critical for NL vs Eurozone comparisons.",
        status: "planned",
      },
      {
        name: "OECD",
        url: "https://data.oecd.org/",
        scope: "Cross-country indicators: productivity, education (PISA), well-being.",
        status: "planned",
      },
      {
        name: "NATO",
        url: "https://www.nato.int/cps/en/natohq/topics_49198.htm",
        scope: "Defense spending, capability targets. Anchors the 3.5%-of-GDP goal.",
        status: "planned",
      },
      {
        name: "IMF / World Bank / ECB",
        url: "https://data.imf.org/",
        scope: "Fiscal, monetary, development comparators.",
        status: "planned",
      },
    ],
  },
];
