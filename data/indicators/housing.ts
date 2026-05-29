import type { IndicatorDef } from "@/types";

/** Housing domain indicators bound to current CBS OData tables. */
export const housingIndicators: IndicatorDef[] = [
  {
    id: "average-house-price",
    domain: "housing",
    label: "Average sale price (existing homes)",
    shortLabel: "Avg house price",
    description:
      "Average sale price of existing owner-occupied homes sold in the Netherlands. Source: CBS / Kadaster, monthly.",
    cbsTable: "85773NED",
    filter: "substringof('MM', Perioden)",
    valueField: "GemiddeldeVerkoopprijs_7",
    periodField: "Perioden",
    unit: "count",
    higherIsBetter: false,
  },
  {
    id: "house-price-yoy",
    domain: "housing",
    label: "House price change (year-on-year)",
    shortLabel: "Price change YoY",
    description:
      "Year-on-year percentage change in the price index of existing owner-occupied homes (2020 = 100). Monthly.",
    cbsTable: "85773NED",
    filter: "substringof('MM', Perioden)",
    valueField: "OntwikkelingTOVEenJaarEerder_3",
    periodField: "Perioden",
    unit: "percent",
    higherIsBetter: false,
  },
  {
    id: "homes-sold",
    domain: "housing",
    label: "Existing homes sold (monthly)",
    shortLabel: "Homes sold",
    description:
      "Number of existing owner-occupied homes sold per month, registered by Kadaster.",
    cbsTable: "85773NED",
    filter: "substringof('MM', Perioden)",
    valueField: "VerkochteWoningen_4",
    periodField: "Perioden",
    unit: "count",
    higherIsBetter: true,
  },
  {
    id: "housing-stock",
    domain: "housing",
    label: "Total housing stock (start of year)",
    shortLabel: "Housing stock",
    description:
      "Total number of dwellings in the Netherlands at the start of each year. The 2026 coalition agreement targets ~100,000 net additions per year — reflected in the year-on-year change of this series.",
    cbsTable: "83704NED",
    filter:
      "Woningtype eq 'T001100' and Oppervlakteklasse eq 'T001116' and RegioS eq 'NL01  ' and substringof('JJ', Perioden)",
    valueField: "BeginstandWoningvoorraad_1",
    periodField: "Perioden",
    unit: "count",
    higherIsBetter: true,
  },
];

export function findHousingIndicator(id: string): IndicatorDef | undefined {
  return housingIndicators.find((i) => i.id === id);
}
