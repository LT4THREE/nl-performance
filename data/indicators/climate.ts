import type { IndicatorDef } from "@/types";

/** Climate domain indicators. */
export const climateIndicators: IndicatorDef[] = [
  {
    provider: "eurostat",
    id: "ghg-emissions-vs-1990",
    domain: "climate",
    label: "Greenhouse-gas emissions (% vs 1990)",
    shortLabel: "Emissions vs 1990",
    description:
      "Total Dutch greenhouse-gas emissions expressed as a percent deviation from the 1990 baseline (excluding LULUCF and memo items). The Klimaatwet target is −55% by 2030. Source: Eurostat env_air_gge, annual.",
    dataset: "env_air_gge",
    dimensions: {
      geo: "NL",
      src_crf: "TOTXMEMO",
      airpol: "GHG",
      unit: "THS_T",
    },
    baselineYear: 1990,
    unit: "percent",
    frequency: "annual",
    higherIsBetter: false,
  },
  {
    provider: "eurostat",
    id: "ghg-emissions-total",
    domain: "climate",
    label: "Total greenhouse-gas emissions (kt CO₂eq)",
    shortLabel: "Total emissions",
    description:
      "Total Dutch greenhouse-gas emissions in thousand tonnes of CO₂ equivalent, all sectors excluding LULUCF and memo items. Source: Eurostat env_air_gge, annual.",
    dataset: "env_air_gge",
    dimensions: {
      geo: "NL",
      src_crf: "TOTXMEMO",
      airpol: "GHG",
      unit: "THS_T",
    },
    unit: "ktCO2eq",
    frequency: "annual",
    higherIsBetter: false,
  },
];

export function findClimateIndicator(id: string): IndicatorDef | undefined {
  return climateIndicators.find((i) => i.id === id);
}
