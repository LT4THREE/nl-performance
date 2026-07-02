import type { IndicatorDef } from "@/types";

/** Housing domain indicators bound to current CBS OData tables. */
export const housingIndicators: IndicatorDef[] = [
  {
    provider: "cbs",
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
    frequency: "monthly",
    higherIsBetter: false,
    topicIds: ["housing"],
    metricType: "outcome",
    confidence: "high",
    sourceType: "official_statistics",
    whyItMatters:
      "The average sale price is the most-cited proxy for housing affordability. Rising prices lock first-time buyers out of ownership.",
  },
  {
    provider: "cbs",
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
    frequency: "monthly",
    higherIsBetter: false,
    topicIds: ["housing"],
    metricType: "outcome",
    confidence: "high",
    sourceType: "official_statistics",
    whyItMatters:
      "Year-on-year price change tracks how quickly the housing ladder is pulling away from median incomes.",
  },
  {
    provider: "cbs",
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
    frequency: "monthly",
    higherIsBetter: true,
    topicIds: ["housing"],
    metricType: "outcome",
    confidence: "high",
    sourceType: "official_statistics",
    whyItMatters:
      "Transaction volume is a leading indicator of housing-market health — collapsing volumes typically precede price corrections.",
  },
  {
    provider: "cbs",
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
    frequency: "annual",
    higherIsBetter: true,
    topicIds: ["housing"],
    metricType: "outcome",
    confidence: "high",
    sourceType: "official_statistics",
    whyItMatters:
      "The size of the housing stock, and its year-on-year change, is the direct measure of whether the 100,000-a-year commitment is being met.",
  },
  {
    provider: "cbs",
    id: "new-dwellings-added",
    domain: "housing",
    label: "New dwellings added per year",
    shortLabel: "New dwellings",
    description:
      "Gross new dwellings added to the housing stock per year, including new construction and conversions. This is the number cited against the 2026 coalition commitment of ~100,000/year. Source: CBS 82235NED, annual back to 1921.",
    cbsTable: "82235NED",
    filter: "substringof('JJ', Perioden)",
    valueField: "Woningbouw_5",
    periodField: "Perioden",
    unit: "count",
    frequency: "annual",
    higherIsBetter: true,
    topicIds: ["housing"],
    metricType: "output",
    confidence: "high",
    sourceType: "official_statistics",
    whyItMatters:
      "This is the direct measurement of the housing supply the 2026 coalition committed to — 100,000/year by 2030. Gross additions include pure new-build plus conversions from non-housing (e.g. office-to-residential).",
  },
];

export function findHousingIndicator(id: string): IndicatorDef | undefined {
  return housingIndicators.find((i) => i.id === id);
}
