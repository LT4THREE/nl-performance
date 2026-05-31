import { DomainNav } from "@/components/DomainNav";
import { economyIndicators } from "@/data/indicators/economy";
import { housingIndicators } from "@/data/indicators/housing";
import { climateIndicators } from "@/data/indicators/climate";
import { socialIndicators } from "@/data/indicators/social";
import { educationIndicators } from "@/data/indicators/education";
import { getAllGoals } from "@/lib/goals";
import { fetchCbsTableInfo } from "@/lib/providers/cbs";
import { providerLabel, sourceCitationUrl, sourceIdentifier } from "@/lib/indicators";
import type { IndicatorDef } from "@/types";

export const revalidate = 86400;

type LiveSource = {
  indicator: IndicatorDef;
  title: string;
  period: string;
  frequency: string;
  status: string;
};

async function loadLiveSources(): Promise<LiveSource[]> {
  const all = [
    ...economyIndicators,
    ...housingIndicators,
    ...climateIndicators,
    ...socialIndicators,
    ...educationIndicators,
  ];
  const seen = new Map<string, LiveSource>();

  const results = await Promise.all(
    all.map(async (indicator): Promise<LiveSource> => {
      if (indicator.provider === "cbs") {
        try {
          const info = await fetchCbsTableInfo(indicator.cbsTable);
          return {
            indicator,
            title: info.Title ?? info.ShortTitle ?? indicator.cbsTable,
            period: info.Period ?? "—",
            frequency: info.Frequency ?? "—",
            status: info.ReasonDelivery ?? "Actief",
          };
        } catch {
          return {
            indicator,
            title: indicator.label,
            period: "—",
            frequency: "—",
            status: "Unavailable",
          };
        }
      }
      if (indicator.provider === "ecb") {
        return {
          indicator,
          title: "ECB Statistical Data Warehouse",
          period: "Live",
          frequency: indicator.seriesKey.startsWith("D")
            ? "Daily"
            : indicator.seriesKey.startsWith("M")
              ? "Monthly"
              : "—",
          status: "Active",
        };
      }
      return {
        indicator,
        title: `Eurostat ${indicator.dataset}`,
        period: "Live",
        frequency: "Annual or monthly",
        status: "Active",
      };
    }),
  );

  for (const r of results) {
    const key = sourceIdentifier(r.indicator) + r.indicator.id;
    if (!seen.has(key)) seen.set(key, r);
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
          Every number on this site is sourced. Below: the live series in use today, the
          government documents we extract goals from, and the institutional source map for
          each topic the platform tracks — with concrete commitments for what each integration
          will unlock next.
        </p>
      </header>

      <Section
        title="Live series in use"
        subtitle="Every series we currently call across all providers. CBS metadata is fetched live from the OData catalog; ECB and Eurostat series are described from configuration."
      >
        <div className="overflow-x-auto border border-[var(--color-border)] rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface)] text-left text-xs uppercase tracking-wide text-[var(--color-muted)]">
              <tr>
                <th className="px-4 py-3 font-medium">Provider</th>
                <th className="px-4 py-3 font-medium">Series / table</th>
                <th className="px-4 py-3 font-medium">Indicator</th>
                <th className="px-4 py-3 font-medium">Period</th>
                <th className="px-4 py-3 font-medium">Frequency</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {live.map((s) => (
                <tr
                  key={sourceIdentifier(s.indicator) + s.indicator.id}
                  className="border-t border-[var(--color-border)] align-top"
                >
                  <td className="px-4 py-3">
                    <ProviderBadge provider={s.indicator.provider} />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    <a
                      href={sourceCitationUrl(s.indicator)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-[var(--color-accent-strong)]"
                    >
                      {sourceIdentifier(s.indicator)}
                    </a>
                    <div className="text-[var(--color-muted)] mt-1 font-sans normal-case">
                      {s.title}
                    </div>
                  </td>
                  <td className="px-4 py-3">{s.indicator.shortLabel}</td>
                  <td className="px-4 py-3 text-[var(--color-muted)]">{s.period}</td>
                  <td className="px-4 py-3 text-[var(--color-muted)]">{s.frequency}</td>
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
        subtitle="The public documents the goals tracked on this site are extracted from."
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
        title="Source map by topic"
        subtitle="The canonical Dutch data architecture: who publishes what authoritative source for each topic. Built from the public 'golden stack' of Dutch open data and what each source genuinely offers as a machine-readable feed."
      >
        <div className="grid md:grid-cols-2 gap-4">
          {goldenStack.map((row) => (
            <article
              key={row.topic}
              className="rounded-xl border border-[var(--color-border)] p-4 space-y-3"
            >
              <header className="flex items-baseline justify-between gap-3">
                <h3 className="font-semibold">{row.topic}</h3>
                <StatusPill status={row.status} />
              </header>
              <p className="text-sm text-[var(--color-muted)] leading-snug">{row.summary}</p>
              <ul className="text-xs space-y-1">
                {row.sources.map((s) => (
                  <li key={s.name}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium underline hover:text-[var(--color-accent-strong)]"
                    >
                      {s.name}
                    </a>
                    <span className="text-[var(--color-muted)]"> — {s.role}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      <Section title="Licensing & reuse" subtitle="What you can do with the data shown here.">
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
            ; ECB and Eurostat publish under their own open-data terms (both permit reuse
            with attribution). Attribution is preserved on every chart.
          </li>
          <li>
            Goal source documents are public Dutch government materials, linked back to their
            original location.
          </li>
          <li>
            This site is an independent prototype. It is not affiliated with CBS, the ECB,
            Eurostat, the Dutch government, or any party.
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

function ProviderBadge({ provider }: { provider: IndicatorDef["provider"] }) {
  const cfg: Record<IndicatorDef["provider"], { label: string; classes: string }> = {
    cbs: { label: providerLabel("cbs"), classes: "bg-blue-50 text-blue-800" },
    ecb: { label: providerLabel("ecb"), classes: "bg-amber-50 text-amber-800" },
    eurostat: { label: providerLabel("eurostat"), classes: "bg-indigo-50 text-indigo-800" },
  };
  const c = cfg[provider];
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${c.classes}`}>
      {c.label}
    </span>
  );
}

type GoldenStackStatus = "live" | "partial" | "planned";

function StatusPill({ status }: { status: GoldenStackStatus }) {
  const cfg: Record<GoldenStackStatus, { label: string; classes: string }> = {
    live: {
      label: "Live",
      classes: "bg-[var(--color-success-soft)] text-[var(--color-success)]",
    },
    partial: {
      label: "Partial",
      classes: "bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)]",
    },
    planned: {
      label: "Planned",
      classes: "bg-[var(--color-surface-strong)] text-[var(--color-muted)]",
    },
  };
  const c = cfg[status];
  return (
    <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium ${c.classes}`}>
      {c.label}
    </span>
  );
}

type GoldenStackRow = {
  topic: string;
  status: GoldenStackStatus;
  summary: string;
  sources: { name: string; url: string; role: string }[];
};

const goldenStack: GoldenStackRow[] = [
  {
    topic: "Economy",
    status: "partial",
    summary:
      "CBS national accounts for actuals; CPB for forecasts and policy scoring. CPB Excel publications will be ingested for forward-looking goal tracking (1.5% GDP growth target).",
    sources: [
      { name: "CBS Nationale rekeningen", url: "https://www.cbs.nl/en-gb/our-services/open-data", role: "Quarterly GDP, public finances, productivity" },
      { name: "CPB", url: "https://www.cpb.nl/en", role: "MEV/CEP forecasts, budget analysis" },
    ],
  },
  {
    topic: "Labour Market",
    status: "live",
    summary: "Unemployment rate live from CBS 80590ned. Coming: participation rate, vacancy rate, real wage growth from the same CBS labour-account family.",
    sources: [
      { name: "CBS Arbeidsdeelname", url: "https://www.cbs.nl/en-gb/our-services/open-data", role: "Monthly unemployment, participation, hours worked" },
    ],
  },
  {
    topic: "Population & Migration",
    status: "live",
    summary: "Total population live from CBS 85496NED. Coming: net migration components, age structure / aging pressure, fertility — all from the same CBS demographic family.",
    sources: [
      { name: "CBS Bevolking", url: "https://www.cbs.nl/en-gb/our-services/open-data", role: "Population, migration, demographic pressure" },
    ],
  },
  {
    topic: "Housing",
    status: "live",
    summary: "Sales prices, transaction count and stock live from CBS 85773NED + 83704NED. Kadaster integration planned for raw transaction registers and BAG-based new-build completions.",
    sources: [
      { name: "CBS Wonen", url: "https://www.cbs.nl/en-gb/our-services/open-data", role: "Prices, transactions, stock (aggregated)" },
      { name: "Kadaster", url: "https://www.kadaster.nl/zakelijk/registraties", role: "Property register, BAG building register" },
    ],
  },
  {
    topic: "Health",
    status: "partial",
    summary: "Life expectancy & healthy life expectancy live from CBS 71950ned. RIVM integration planned for vaccination coverage, infectious disease and lifestyle indicators.",
    sources: [
      { name: "CBS Gezondheid", url: "https://www.cbs.nl/en-gb/our-services/open-data", role: "Life expectancy, perceived health" },
      { name: "RIVM", url: "https://www.rivm.nl/en", role: "Vaccination, disease surveillance, lifestyle" },
      { name: "NZa", url: "https://www.nza.nl/english", role: "Healthcare cost, capacity, waitlists" },
    ],
  },
  {
    topic: "Education",
    status: "partial",
    summary: "Government education spending (% GDP and absolute) live from CBS 80509ned. DUO open onderwijsdata planned for enrolment, attainment, dropout. OECD PISA for international benchmarks.",
    sources: [
      { name: "CBS Onderwijs", url: "https://www.cbs.nl/en-gb/our-services/open-data", role: "Spending, attainment, system metrics" },
      { name: "DUO Open Onderwijsdata", url: "https://duo.nl/open_onderwijsdata/", role: "Enrolment, schools, dropout, financing" },
      { name: "OECD PISA", url: "https://www.oecd.org/pisa/", role: "International benchmarks for student outcomes" },
    ],
  },
  {
    topic: "Climate",
    status: "partial",
    summary: "Greenhouse-gas emissions live via Eurostat env_air_gge (which republishes the Dutch national inventory). PBL Klimaat- en Energieverkenning and the Rijksoverheid Dashboard Klimaatbeleid are the next sources — both authoritative for projections vs the Klimaatwet targets.",
    sources: [
      { name: "Eurostat env_air_gge", url: "https://ec.europa.eu/eurostat/databrowser/view/env_air_gge", role: "Annual GHG emissions per sector (carries the NL national inventory)" },
      { name: "RIVM Emissieregistratie", url: "https://www.emissieregistratie.nl/", role: "Authoritative Dutch GHG and nitrogen inventory" },
      { name: "PBL KEV", url: "https://www.pbl.nl/onderwerpen/klimaat-en-energieverkenning", role: "Climate and energy projections" },
      { name: "Dashboard Klimaatbeleid", url: "https://klimaatdashboard.rijksoverheid.nl/", role: "Government's own climate-policy dashboard" },
    ],
  },
  {
    topic: "Sustainability",
    status: "planned",
    summary: "Beyond GHG: nitrogen deposition, biodiversity, circular economy, mobility transition. PBL is the canonical Dutch source for the wider sustainability picture.",
    sources: [
      { name: "PBL (Environmental Assessment Agency)", url: "https://www.pbl.nl/en", role: "Nitrogen, biodiversity, circular economy, mobility" },
      { name: "RIVM nitrogen", url: "https://www.rivm.nl/stikstof", role: "Authoritative nitrogen deposition figures" },
    ],
  },
  {
    topic: "Social Outcomes (Brede Welvaart)",
    status: "partial",
    summary: "Population, life expectancy and healthy life years live from CBS — these are the Monitor Brede Welvaart 'here and now' headline indicators. SCP integration planned for the wider well-being and social-cohesion dimensions.",
    sources: [
      { name: "CBS Monitor Brede Welvaart", url: "https://www.cbs.nl/en-gb/dossier/monitor-of-well-being", role: "Annual well-being inventory, ~150 indicators" },
      { name: "SCP", url: "https://www.scp.nl/english", role: "Quality of life, social cohesion, trust" },
    ],
  },
  {
    topic: "Government Performance",
    status: "partial",
    summary: "EMU debt as % of GDP and education spending live from CBS. Rijksfinanciën planned for ministry-level budget vs realisation; Algemene Rekenkamer for independent audits of policy effectiveness.",
    sources: [
      { name: "CBS Overheidsfinanciën", url: "https://www.cbs.nl/en-gb/our-services/open-data", role: "National accounts: revenue, expenditure, debt" },
      { name: "Rijksfinanciën", url: "https://www.rijksfinancien.nl/", role: "Ministry budgets, realisations, Miljoenennota" },
      { name: "Algemene Rekenkamer", url: "https://www.rekenkamer.nl/english", role: "Independent audits of policy outcomes" },
    ],
  },
  {
    topic: "Regional Statistics",
    status: "planned",
    summary: "Today the platform is national-only. CBS regional and municipal tables (Kerncijfers wijken en buurten, Regionale kerncijfers) will power per-province and per-municipality breakdowns once a region selector ships.",
    sources: [
      { name: "CBS Regionale Statistieken", url: "https://www.cbs.nl/en-gb/our-services/open-data", role: "Province, COROP, municipality, neighbourhood data" },
    ],
  },
];
