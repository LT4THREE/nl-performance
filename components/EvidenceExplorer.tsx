import type { Confidence, IndicatorDef, SourceType } from "@/types";
import { providerLabel, sourceCitationUrl, sourceIdentifier } from "@/lib/indicators";

const sourceTypeLabel: Record<SourceType, string> = {
  official_statistics: "Official statistics",
  audit: "Independent audit",
  ministry_report: "Ministry report",
  parliamentary_document: "Parliamentary document",
  international_dataset: "International dataset",
  government_communication: "Government communication",
  media: "Media",
  other: "Other",
};

const sourceTypeExplainer: Record<SourceType, string> = {
  official_statistics:
    "Independent statistical body. Not a political actor. Highest reliability tier.",
  audit:
    "Independent audit body (Rekenkamer, Ombudsman, inspectorates). High reliability.",
  ministry_report:
    "Published by a ministry. Authoritative on what government did, but not an independent measurement of outcomes.",
  parliamentary_document:
    "Tweede or Eerste Kamer document. Authoritative on legislative process.",
  international_dataset:
    "OECD, IMF, World Bank, or similar. High reliability for cross-country comparison.",
  government_communication:
    "Press release, social post, speech, or campaign-style update. NOT evidence of performance — treat as a claim to be verified.",
  media: "Journalism. Reliability varies with the outlet and the story.",
  other: "Source type not classified.",
};

const confidenceLabel: Record<Confidence, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

const confidenceExplainer: Record<Confidence, string> = {
  high:
    "Direct measurement from an authoritative independent body, standardised methodology, no known material data quality concerns.",
  medium:
    "Reliable source but with known caveats (e.g. compositional effects, sampling limitations, recent methodology change).",
  low:
    "Estimate, proxy, or indicator with substantial known limitations. Use with caution and cross-reference with related metrics.",
};

/**
 * Renders the deep-evidence section shown on indicator detail pages.
 * Only surfaces the fields the indicator actually carries — nothing is
 * synthesised or padded, so early metrics with sparse content stay short
 * and honest.
 */
export function EvidenceExplorer({ indicator }: { indicator: IndicatorDef }) {
  const hasAnyContent =
    indicator.methodology ||
    indicator.historicalContext ||
    indicator.revisionNotes ||
    (indicator.relatedLegislation && indicator.relatedLegislation.length > 0) ||
    indicator.confidence ||
    indicator.sourceType ||
    indicator.whyItMatters;

  if (!hasAnyContent) return null;

  return (
    <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
      <header className="px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-surface-subtle)]">
        <h2 className="text-lg font-semibold text-[var(--color-fg)]">Evidence</h2>
        <p className="text-xs text-[var(--color-fg-secondary)] mt-0.5">
          Methodology, context, and reliability — everything a journalist or policymaker
          would need to cite this number.
        </p>
      </header>

      <div className="divide-y divide-[var(--color-border)]">
        {indicator.whyItMatters && (
          <Row label="Why it matters">
            <p className="text-[var(--color-fg-soft)] leading-relaxed">{indicator.whyItMatters}</p>
          </Row>
        )}

        <Row label="Source & reliability">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {indicator.sourceType && (
                <Pill
                  label={sourceTypeLabel[indicator.sourceType]}
                  tone={indicator.sourceType === "government_communication" ? "warning" : "info"}
                />
              )}
              {indicator.confidence && (
                <Pill
                  label={`${confidenceLabel[indicator.confidence]} confidence`}
                  tone={
                    indicator.confidence === "high"
                      ? "success"
                      : indicator.confidence === "medium"
                        ? "info"
                        : "warning"
                  }
                />
              )}
              <span className="text-xs text-[var(--color-muted)]">
                {providerLabel(indicator.provider)} · {sourceIdentifier(indicator)}
              </span>
            </div>
            {indicator.sourceType && (
              <p className="text-sm text-[var(--color-fg-secondary)] leading-relaxed">
                {sourceTypeExplainer[indicator.sourceType]}
              </p>
            )}
            {indicator.confidence && (
              <p className="text-sm text-[var(--color-fg-secondary)] leading-relaxed">
                <strong>{confidenceLabel[indicator.confidence]} confidence:</strong>{" "}
                {confidenceExplainer[indicator.confidence]}
              </p>
            )}
            <a
              href={sourceCitationUrl(indicator)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm font-medium text-[var(--color-accent-strong)] hover:text-[var(--color-accent)]"
            >
              Open primary source →
            </a>
          </div>
        </Row>

        {indicator.methodology && (
          <Row label="Methodology">
            <p className="text-[var(--color-fg-soft)] leading-relaxed">
              {indicator.methodology}
            </p>
          </Row>
        )}

        {indicator.historicalContext && (
          <Row label="Historical context">
            <p className="text-[var(--color-fg-soft)] leading-relaxed">
              {indicator.historicalContext}
            </p>
          </Row>
        )}

        {indicator.revisionNotes && (
          <Row label="Publication revisions">
            <p className="text-[var(--color-fg-soft)] leading-relaxed">{indicator.revisionNotes}</p>
          </Row>
        )}

        {indicator.relatedLegislation && indicator.relatedLegislation.length > 0 && (
          <Row label="Related legislation">
            <ul className="space-y-3">
              {indicator.relatedLegislation.map((law) => (
                <li key={law.url} className="text-sm">
                  <a
                    href={law.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium underline text-[var(--color-fg)] hover:text-[var(--color-accent-strong)]"
                  >
                    {law.name}
                  </a>
                  <p className="text-[var(--color-fg-secondary)] mt-0.5 leading-relaxed">
                    {law.role}
                  </p>
                </li>
              ))}
            </ul>
          </Row>
        )}
      </div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="px-6 py-5 grid sm:grid-cols-[10rem_1fr] gap-3 sm:gap-6">
      <div className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)] pt-0.5">
        {label}
      </div>
      <div className="text-sm">{children}</div>
    </div>
  );
}

function Pill({
  label,
  tone,
}: {
  label: string;
  tone: "info" | "success" | "warning";
}) {
  const classes = {
    info: "bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)]",
    success: "bg-[var(--color-improving-soft)] text-[var(--color-improving)]",
    warning: "bg-[var(--color-watch-soft)] text-[var(--color-watch)]",
  }[tone];
  return (
    <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium ${classes}`}>
      {label}
    </span>
  );
}
