import type { IndicatorDef } from "@/types";

/** Economy domain indicators bound to current CBS OData tables. */
export const economyIndicators: IndicatorDef[] = [
  {
    id: "unemployment-rate",
    domain: "economy",
    label: "Unemployment rate (15–74)",
    shortLabel: "Unemployment",
    description:
      "Share of the labour force aged 15–74 who are without work and actively seeking work. Source: CBS, monthly.",
    cbsTable: "80590ned",
    filter:
      "Geslacht eq 'T001038' and Leeftijd eq '52052   ' and substringof('MM', Perioden)",
    valueField: "NietSeizoengecorrigeerd_7",
    periodField: "Perioden",
    unit: "percent",
    higherIsBetter: false,
  },
  {
    id: "inflation-rate",
    domain: "economy",
    label: "Inflation rate (CPI, year-on-year)",
    shortLabel: "Inflation",
    description:
      "Year-on-year change in the headline Consumer Price Index. Standard inflation measure, published monthly by CBS, series back to 1963.",
    cbsTable: "70936ned",
    filter: "substringof('MM', Perioden)",
    valueField: "JaarmutatieCPI_1",
    periodField: "Perioden",
    unit: "percent",
    higherIsBetter: false,
  },
  {
    id: "government-debt-gdp",
    domain: "economy",
    label: "Government debt (% of GDP)",
    shortLabel: "Government debt",
    description:
      "EMU consolidated gross debt of general government as a share of GDP. Annual values from CBS national accounts.",
    cbsTable: "85968NED",
    filter: "substringof('JJ', Perioden)",
    valueField: "OverheidsschuldEMU_15",
    periodField: "Perioden",
    unit: "percent",
    higherIsBetter: false,
  },
];

export function findEconomyIndicator(id: string): IndicatorDef | undefined {
  return economyIndicators.find((i) => i.id === id);
}
