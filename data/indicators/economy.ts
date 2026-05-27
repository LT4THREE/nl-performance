import type { IndicatorDef } from "@/types";

/**
 * Economy domain indicators bound to CBS OData tables.
 *
 * Note: some tables are marked "Stopgezet" (discontinued) by CBS but retain
 * complete historical data. They are used here as placeholders; the registry
 * pattern makes swapping table IDs trivial when newer equivalents are
 * identified.
 */
export const economyIndicators: IndicatorDef[] = [
  {
    id: "unemployment-rate",
    domain: "economy",
    label: "Unemployment rate (15–74)",
    shortLabel: "Unemployment",
    description:
      "Share of the labour force aged 15–74 who are without work and actively seeking work. Source: CBS, monthly.",
    cbsTable: "80590ned",
    // Total (T001038), all ages (52052), monthly periods only (MM)
    filter:
      "Geslacht eq 'T001038' and Leeftijd eq '52052   ' and substringof('MM', Perioden)",
    valueField: "NietSeizoengecorrigeerd_7", // headline unemployment rate, not seasonally adjusted
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
      "Year-on-year change in the Consumer Price Index for all households. The standard inflation measure published monthly by CBS.",
    cbsTable: "83131NED",
    // 'All expenditures' aggregate, monthly observations
    filter: "Bestedingscategorieen eq 'T001112  ' and substringof('MM', Perioden)",
    valueField: "JaarmutatieCPI_5",
    periodField: "Perioden",
    unit: "percent",
    higherIsBetter: false,
    note: "CBS marked this table discontinued in 2025; values shown are final.",
  },
];

export function findEconomyIndicator(id: string): IndicatorDef | undefined {
  return economyIndicators.find((i) => i.id === id);
}
