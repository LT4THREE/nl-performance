import type { IndicatorDef } from "@/types";

/** Education domain indicators. */
export const educationIndicators: IndicatorDef[] = [
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
    higherIsBetter: true,
  },
];

export function findEducationIndicator(id: string): IndicatorDef | undefined {
  return educationIndicators.find((i) => i.id === id);
}
