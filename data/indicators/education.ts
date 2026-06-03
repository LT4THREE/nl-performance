import type { IndicatorDef } from "@/types";

/** Education domain indicators. */
export const educationIndicators: IndicatorDef[] = [
  {
    provider: "eurostat",
    id: "tertiary-attainment-25-64",
    domain: "education",
    label: "Tertiary educational attainment (ages 25–64)",
    shortLabel: "Tertiary %",
    description:
      "Share of the population aged 25–64 with completed tertiary education (ISCED levels 5–8 — short-cycle tertiary, bachelor, master, doctoral). Headline attainment measure used by Eurostat and the OECD. Series back to ~1995.",
    dataset: "edat_lfse_03",
    dimensions: {
      geo: "NL",
      sex: "T",
      age: "Y25-64",
      isced11: "ED5-8",
    },
    unit: "percent",
    frequency: "annual",
    higherIsBetter: true,
  },
  {
    provider: "cbs",
    id: "education-spending-gdp",
    domain: "education",
    label: "Government education spending (% of GDP)",
    shortLabel: "Education % GDP",
    description:
      "Total government expenditure on education and student subsidies as a share of GDP. Series back to 1900. Source: CBS, annual.",
    cbsTable: "80509ned",
    filter: "substringof('JJ', Perioden)",
    valueField: "TotaalOverheidsuitgavenAlsVanBbp_19",
    periodField: "Perioden",
    unit: "percent",
    frequency: "annual",
    higherIsBetter: true,
  },
  {
    provider: "cbs",
    id: "education-spending-total",
    domain: "education",
    label: "Total government education spending (€ million)",
    shortLabel: "Total ed. spending",
    description:
      "Total annual government expenditure on education and student subsidies in millions of euros. Source: CBS, annual.",
    cbsTable: "80509ned",
    filter: "substringof('JJ', Perioden)",
    valueField: "TotaalOverheidsuitgavenAanOnderwijs_2",
    periodField: "Perioden",
    unit: "eurMillion",
    frequency: "annual",
    higherIsBetter: true,
  },
];

export function findEducationIndicator(id: string): IndicatorDef | undefined {
  return educationIndicators.find((i) => i.id === id);
}
