import type { IndicatorDef } from "@/types";

/** Economy domain indicators. */
export const economyIndicators: IndicatorDef[] = [
  {
    provider: "cbs",
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
    provider: "cbs",
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
    provider: "cbs",
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
  {
    provider: "ecb",
    id: "ecb-deposit-rate",
    domain: "economy",
    label: "ECB deposit facility rate",
    shortLabel: "ECB rate",
    description:
      "The rate the Eurosystem pays banks on overnight deposits. Set by the ECB Governing Council and the dominant transmission channel for Dutch mortgage and savings rates. Source: ECB Data Portal, daily.",
    dataflow: "FM",
    seriesKey: "D.U2.EUR.4F.KR.DFR.LEV",
    unit: "percent",
    higherIsBetter: false,
  },
];

export function findEconomyIndicator(id: string): IndicatorDef | undefined {
  return economyIndicators.find((i) => i.id === id);
}
