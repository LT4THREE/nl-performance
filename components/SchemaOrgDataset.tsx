import type { DataPoint, IndicatorDef } from "@/types";
import { providerLabel, sourceCitationUrl, sourceIdentifier } from "@/lib/indicators";

/**
 * Inject a schema.org Dataset JSON-LD block describing the indicator series
 * shown on this page. Validates against Google's Rich Results test.
 */
export function SchemaOrgDataset({
  indicator,
  points,
  cbsTitle,
}: {
  indicator: IndicatorDef;
  points: DataPoint[];
  cbsTitle?: string;
}) {
  const first = points[0];
  const last = points[points.length - 1];
  const temporalCoverage =
    first && last ? `${first.date}/${last.date}` : undefined;

  const creator = providerLabel(indicator.provider);
  const license =
    indicator.provider === "cbs"
      ? "https://creativecommons.org/licenses/by/4.0/"
      : indicator.provider === "ecb"
        ? "https://www.ecb.europa.eu/services/disclaimer/html/index.en.html"
        : "https://commission.europa.eu/legal-notice_en";
  const contentUrl = sourceCitationUrl(indicator);
  const sourceId = sourceIdentifier(indicator);

  const payload = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: indicator.label,
    alternateName: cbsTitle,
    description: indicator.description,
    creator: { "@type": "Organization", name: creator },
    license,
    temporalCoverage,
    measurementTechnique: indicator.frequency,
    variableMeasured: {
      "@type": "PropertyValue",
      name: indicator.label,
      unitText: indicator.unit,
    },
    distribution: {
      "@type": "DataDownload",
      contentUrl,
      name: sourceId,
      encodingFormat: indicator.provider === "cbs" ? "application/atom+xml" : "application/json",
    },
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
