import { DomainNav } from "@/components/DomainNav";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10 space-y-10">
      <DomainNav active="about" />

      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">About</h1>
        <p className="text-[var(--color-muted)] leading-relaxed">
          NL Performance is an independent prototype that aims to bring together — in one place
          — the factual data describing how the Netherlands is doing, and the public goals that
          governments at every level have committed to.
        </p>
      </header>

      <Section title="Mission">
        <p>
          Public accountability requires a clear, side-by-side view of two things: what is
          actually happening, and what was promised. Today, that comparison is buried across
          dozens of websites, PDFs, and press releases. This project gathers both in one
          cockpit, sources every number, and makes performance against goals visible.
        </p>
      </Section>

      <Section title="Data sources">
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>CBS (Centraal Bureau voor de Statistiek)</strong> — factual indicators via
            the open OData API, released under CC-BY.
          </li>
          <li>
            <strong>Curated goals</strong> — extracted manually from coalition agreements
            (Hoofdlijnenakkoord), the Klimaatwet, Miljoenennota, and other public documents,
            with a source link on every entry.
          </li>
        </ul>
      </Section>

      <Section title="Methodology">
        <ul className="list-disc pl-6 space-y-1">
          <li>Indicators are fetched at request time and cached for 6 hours.</li>
          <li>
            Year-on-year deltas compare the latest observation to the closest observation
            ~12 months earlier.
          </li>
          <li>
            Goal progress is shown as current ÷ target. For non-linear targets (e.g.
            percent-change vs a baseline) this is illustrative only — read the source.
          </li>
          <li>
            Where a CBS table is marked discontinued, historical values are still displayed
            with a clear note.
          </li>
        </ul>
      </Section>

      <Section title="Limitations">
        <ul className="list-disc pl-6 space-y-1">
          <li>This is an early prototype: one domain (Economy), three seed goals.</li>
          <li>Provincial and municipal goals are not yet covered.</li>
          <li>Some seed goal values are illustrative and should be verified before citing.</li>
        </ul>
      </Section>

      <Section title="Roadmap">
        <ul className="list-disc pl-6 space-y-1">
          <li>Additional domains: Housing, Climate, Health, Education, Social.</li>
          <li>Coverage of provincial and municipal commitments.</li>
          <li>Dutch language toggle.</li>
          <li>Per-goal history tracking and audit log.</li>
        </ul>
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
