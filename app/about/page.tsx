import Link from "next/link";
import { DomainNav } from "@/components/DomainNav";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10 space-y-12">
      <DomainNav active="about" />

      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">About</h1>
        <p className="text-[var(--color-muted)] leading-relaxed">
          NL Performance is an independent prototype that brings together — in one cockpit —
          the factual data describing how the Netherlands is doing and the public goals that
          governments at every level have committed to.
        </p>
      </header>

      <Section title="The thesis">
        <p>
          Public accountability requires two things displayed side by side: <em>what is
          actually happening</em>, and <em>what was promised</em>. Today, that comparison is
          buried across CBS tables, ministerial websites, RIVM reports, coalition agreements,
          court-of-audit reviews, and dozens of PDFs. We bring both together, source every
          number, and make divergence visible.
        </p>
      </Section>

      <Section title="Methodology">
        <ul className="list-disc pl-6 space-y-1.5">
          <li>
            Factual indicators come from authoritative open-data APIs — primarily CBS today;
            DNB, CPB, PBL, RIVM, SCP, NATO, Eurostat and OECD are planned. See{" "}
            <Link href="/sources" className="underline hover:text-[var(--color-fg)]">
              /sources
            </Link>{" "}
            for the full list.
          </li>
          <li>Indicators are fetched at request time and cached for 6 hours.</li>
          <li>
            Year-on-year deltas compare the latest observation to the closest observation
            ~12 months earlier; for count and currency units the headline change is the
            percent change of that pair.
          </li>
          <li>
            Goal progress is shown as <code>current ÷ target</code>. For non-linear targets
            (e.g. percent-change vs a baseline) this is illustrative — read the source.
          </li>
          <li>
            Where a CBS table is marked discontinued, historical values are still displayed
            with a clear note and we are actively migrating to current equivalents.
          </li>
          <li>
            All historical revisions follow the publisher — we do not adjust their data.
          </li>
        </ul>
      </Section>

      <Section title="Domain coverage by ministry">
        <p>
          Each Dutch ministry owns a mandate that maps to one of our domains. This table is
          how we think about future expansion — what's live today, what's next, and which
          primary data source feeds it.
        </p>
        <div className="overflow-x-auto border border-[var(--color-border)] rounded-xl mt-4">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface)] text-left text-xs uppercase tracking-wide text-[var(--color-muted)]">
              <tr>
                <th className="px-4 py-3 font-medium">Ministry</th>
                <th className="px-4 py-3 font-medium">Domain</th>
                <th className="px-4 py-3 font-medium">Primary source</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {ministryCoverage.map((m) => (
                <tr key={m.ministry} className="border-t border-[var(--color-border)] align-top">
                  <td className="px-4 py-3 font-medium">{m.ministry}</td>
                  <td className="px-4 py-3">{m.domain}</td>
                  <td className="px-4 py-3 text-[var(--color-muted)]">{m.primarySource}</td>
                  <td className="px-4 py-3">
                    <StatusPill status={m.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Indicator backlog">
        <p>
          Beyond what is live, here are the indicators we plan to add next. Selection is
          guided by Economics 101 anchors, the structural shifts of the 2020s, and what the
          2026 coalition agreement actually commits to.
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          {indicatorBacklog.map((group) => (
            <article
              key={group.title}
              className="rounded-xl border border-[var(--color-border)] p-4 space-y-2"
            >
              <h3 className="font-semibold">{group.title}</h3>
              <ul className="list-disc pl-5 text-sm text-[var(--color-muted)] space-y-1">
                {group.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      <Section title="Limitations">
        <ul className="list-disc pl-6 space-y-1.5">
          <li>This is an early prototype: two domains live (Economy, Housing).</li>
          <li>
            Provincial and municipal goals are not yet covered; multiple federal goals are
            tracked without a live counterpart yet (see{" "}
            <Link href="/goals" className="underline hover:text-[var(--color-fg)]">/goals</Link>).
          </li>
          <li>
            Some illustrative seed values are flagged on individual goal cards and will be
            replaced with sourced figures.
          </li>
          <li>
            We do not yet present uncertainty bands or revision history on indicators.
          </li>
        </ul>
      </Section>

      <Section title="Get in touch">
        <p>
          Suggestions, indicator requests, or sourcing corrections welcome — open an issue on{" "}
          <a
            href="https://github.com/LT4THREE/nl-performance"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[var(--color-fg)]"
          >
            the repository
          </a>
          .
        </p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="text-[var(--color-muted)] leading-relaxed space-y-2">{children}</div>
    </section>
  );
}

type Status = "live" | "next" | "later";

function StatusPill({ status }: { status: Status }) {
  const cfg: Record<Status, { label: string; classes: string }> = {
    live: {
      label: "Live",
      classes: "bg-[var(--color-success-soft)] text-[var(--color-success)]",
    },
    next: {
      label: "Next",
      classes: "bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)]",
    },
    later: {
      label: "Later",
      classes: "bg-[var(--color-surface-strong)] text-[var(--color-muted)]",
    },
  };
  const { label, classes } = cfg[status];
  return (
    <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium ${classes}`}>
      {label}
    </span>
  );
}

const ministryCoverage: {
  ministry: string;
  domain: string;
  primarySource: string;
  status: Status;
}[] = [
  { ministry: "Financiën", domain: "Economy / public finances", primarySource: "CBS, CPB, Rijksbegroting", status: "live" },
  { ministry: "Economische Zaken (EZ)", domain: "Economy / business climate", primarySource: "CBS, CPB", status: "live" },
  { ministry: "Sociale Zaken & Werkgelegenheid (SZW)", domain: "Economy / labour market", primarySource: "CBS, UWV", status: "live" },
  { ministry: "Binnenlandse Zaken (BZK)", domain: "Housing & public administration", primarySource: "CBS, Kadaster", status: "live" },
  { ministry: "Volkshuisvesting (separate housing portfolio, 2026)", domain: "Housing", primarySource: "CBS, Kadaster, BZK", status: "live" },
  { ministry: "Klimaat & Groene Groei (KGG)", domain: "Climate / energy", primarySource: "RIVM, PBL, CBS", status: "next" },
  { ministry: "Infrastructuur & Waterstaat (I&W)", domain: "Climate / mobility / water", primarySource: "RIVM, PBL, RWS, CBS", status: "next" },
  { ministry: "Landbouw, Natuur & Visserij (LNV)", domain: "Climate / agriculture", primarySource: "RIVM, CBS, PBL", status: "next" },
  { ministry: "Onderwijs, Cultuur & Wetenschap (OCW)", domain: "Education", primarySource: "CBS, DUO, OECD PISA", status: "next" },
  { ministry: "Volksgezondheid, Welzijn & Sport (VWS)", domain: "Health", primarySource: "CBS, RIVM, NZa", status: "next" },
  { ministry: "Justitie & Veiligheid (JenV)", domain: "Social / security", primarySource: "CBS, Politie, WODC", status: "later" },
  { ministry: "Defensie", domain: "Defense", primarySource: "Defensienota, NATO, CBS", status: "later" },
  { ministry: "Buitenlandse Zaken (BZ)", domain: "International / trade", primarySource: "CBS, Eurostat, OECD", status: "later" },
  { ministry: "Asiel & Migratie (2026)", domain: "Social / migration", primarySource: "CBS, IND", status: "later" },
];

const indicatorBacklog: { title: string; items: string[] }[] = [
  {
    title: "Economy & finance",
    items: [
      "Real GDP growth (quarterly, volume index)",
      "Labour productivity per hour",
      "Real wage index",
      "Current-account balance (% of GDP)",
      "10-year sovereign yield (DNB)",
      "ECB policy rate vs Dutch mortgage rate (DNB)",
    ],
  },
  {
    title: "Housing",
    items: [
      "Net additions to housing stock per year (CBS 83704NED, derived)",
      "New-build completions (BAG-Kadaster)",
      "Rental price index (CBS / Huurcommissie)",
      "Affordability ratio (median price ÷ median income)",
    ],
  },
  {
    title: "Climate & energy",
    items: [
      "Greenhouse-gas emissions vs 1990 (RIVM Emissieregistratie)",
      "Renewable share of energy use (CBS, PBL KEV)",
      "Nitrogen deposition by sector (RIVM)",
      "Electric-vehicle share of new registrations (RVO)",
    ],
  },
  {
    title: "Social, health, education",
    items: [
      "Healthy life expectancy (CBS)",
      "Mental-health waitlist times (NZa)",
      "Income inequality — Gini coefficient (CBS)",
      "PISA performance vs OECD median (OECD)",
      "Net migration & asylum trends (CBS, IND)",
    ],
  },
];
