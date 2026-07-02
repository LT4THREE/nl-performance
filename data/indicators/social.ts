import type { IndicatorDef } from "@/types";

/** Social domain indicators. */
export const socialIndicators: IndicatorDef[] = [
  {
    provider: "cbs",
    id: "total-population",
    domain: "social",
    label: "Total population",
    shortLabel: "Population",
    description:
      "Total resident population of the Netherlands at the start of each year. Source: CBS, annual since 1950.",
    cbsTable: "85496NED",
    filter: "substringof('JJ', Perioden)",
    valueField: "TotaleBevolking_1",
    periodField: "Perioden",
    unit: "count",
    frequency: "annual",
    higherIsBetter: true,
    topicIds: ["social-security-poverty"],
    metricType: "outcome",
    confidence: "high",
    sourceType: "official_statistics",
    whyItMatters:
      "Population growth (and its migration and natural components) drives the denominator of every per-capita metric on this site.",
  },
];

export function findSocialIndicator(id: string): IndicatorDef | undefined {
  return socialIndicators.find((i) => i.id === id);
}
