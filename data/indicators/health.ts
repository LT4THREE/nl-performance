import type { IndicatorDef } from "@/types";

/** Health domain indicators. */
export const healthIndicators: IndicatorDef[] = [
  {
    provider: "cbs",
    id: "life-expectancy",
    domain: "health",
    label: "Life expectancy at birth",
    shortLabel: "Life expectancy",
    description:
      "Period life expectancy at birth, averaged across men and women. The headline outcome of the entire health system. Source: CBS, annual.",
    cbsTable: "71950ned",
    filter:
      "Geslacht eq 'T001038' and LeeftijdOp31December eq '10010' and Marges eq 'MW00000' and substringof('JJ', Perioden)",
    valueField: "LevensverwachtingLV_1",
    periodField: "Perioden",
    unit: "count",
    frequency: "annual",
    higherIsBetter: true,
  },
  {
    provider: "cbs",
    id: "healthy-life-expectancy",
    domain: "health",
    label: "Healthy life expectancy",
    shortLabel: "Healthy life exp.",
    description:
      "Expected years of life in self-reported good health at birth. The gap between this and total life expectancy quantifies years spent in poor health. Core Monitor Brede Welvaart indicator. Source: CBS, annual.",
    cbsTable: "71950ned",
    filter:
      "Geslacht eq 'T001038' and LeeftijdOp31December eq '10010' and Marges eq 'MW00000' and substringof('JJ', Perioden)",
    valueField: "LVInAlsGoedErvarenGezondheid_2",
    periodField: "Perioden",
    unit: "count",
    frequency: "annual",
    higherIsBetter: true,
  },
];

export function findHealthIndicator(id: string): IndicatorDef | undefined {
  return healthIndicators.find((i) => i.id === id);
}
