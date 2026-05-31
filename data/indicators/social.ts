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
    higherIsBetter: true,
  },
  {
    provider: "cbs",
    id: "life-expectancy",
    domain: "social",
    label: "Life expectancy at birth",
    shortLabel: "Life expectancy",
    description:
      "Period life expectancy at birth, averaged across men and women. Source: CBS, annual.",
    cbsTable: "71950ned",
    filter:
      "Geslacht eq 'T001038' and LeeftijdOp31December eq '10010' and Marges eq 'MW00000' and substringof('JJ', Perioden)",
    valueField: "LevensverwachtingLV_1",
    periodField: "Perioden",
    unit: "count",
    higherIsBetter: true,
  },
  {
    provider: "cbs",
    id: "healthy-life-expectancy",
    domain: "social",
    label: "Healthy life expectancy",
    shortLabel: "Healthy life exp.",
    description:
      "Expected years of life in self-reported good health at birth. A core Monitor Brede Welvaart indicator. Source: CBS, annual.",
    cbsTable: "71950ned",
    filter:
      "Geslacht eq 'T001038' and LeeftijdOp31December eq '10010' and Marges eq 'MW00000' and substringof('JJ', Perioden)",
    valueField: "LVInAlsGoedErvarenGezondheid_2",
    periodField: "Perioden",
    unit: "count",
    higherIsBetter: true,
  },
];

export function findSocialIndicator(id: string): IndicatorDef | undefined {
  return socialIndicators.find((i) => i.id === id);
}
