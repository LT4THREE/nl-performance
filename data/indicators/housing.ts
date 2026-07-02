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
    methodology:
      "Simple monthly mean of the transacted sale price of existing owner-occupied dwellings registered by Kadaster (the Dutch land registry). Excludes new-build (kavelverkoop and turnkey new construction are captured in a separate series). Not adjusted for composition, size, region, or quality of the units sold, so month-to-month variation can partly reflect mix changes rather than pure price movement.",
    historicalContext:
      "Dutch house prices roughly doubled between 2013 and 2022, driven by low interest rates, structural undersupply, and mortgage-tax deductibility. The 2022-2023 correction was the first meaningful decline since the 2013 trough; prices have resumed growth from mid-2023 onward.",
    revisionNotes:
      "Kadaster occasionally back-revises early months when transaction registrations arrive late. Revisions are typically <1% on the most recent 2-3 months and negligible beyond that.",
    relatedLegislation: [
      {
        name: "Wet betaalbare huur",
        url: "https://wetten.overheid.nl/BWBR0050203/",
        role: "Regulates mid-market rent caps (huurpuntenstelsel) from 1 July 2024; affects the buy-vs-rent choice, indirectly shaping owner-occupied demand.",
      },
      {
        name: "Wet inkomstenbelasting 2001 (hypotheekrenteaftrek)",
        url: "https://wetten.overheid.nl/BWBR0011353/",
        role: "The mortgage-interest deduction, a long-standing structural driver of Dutch house prices; being phased down over the 2020s.",
      },
    ],
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
    methodology:
      "Year-on-year change in the CBS/Kadaster PBK (Prijsindex Bestaande Koopwoningen), an hedonic price index that controls for changes in the mix of homes sold each month using observed characteristics (surface area, region, dwelling type, year built). This is the price-change measure the DNB and international organisations cite for the Netherlands.",
    historicalContext:
      "YoY house-price inflation peaked at over 20% in early 2022 before turning negative in mid-2023 (-6% in the trough). Growth resumed in 2024 as mortgage rates stabilised and supply remained constrained.",
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
    methodology:
      "Count of existing-dwelling transactions registered by Kadaster in each month, credited to the month the transfer deed was signed. Excludes new-build. Some seasonality: transactions are typically 15-20% higher in H2 than H1.",
    historicalContext:
      "Volumes collapsed by roughly a third between the 2021 peak (~250,000 transactions/year) and 2023 (~180,000) as rates rose, then partially recovered in 2024-2025 as buyers adjusted expectations.",
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
    methodology:
      "Total dwellings registered in the BAG (Basisregistratie Adressen en Gebouwen) at the start of each calendar year. A dwelling is any legally distinct residential unit — houses, apartments, converted spaces. Excludes non-residential buildings; conversions to residential (office-to-residential) count as additions.",
    historicalContext:
      "The Dutch housing stock has grown from ~7.4M in 2012 to over 8.3M in 2026 — average ~65,000 net additions per year, below every recent political target. The gap between the stock trajectory and the 100k/year target compounds every year it is missed.",
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
    methodology:
      "Sum of (a) new-build dwellings completed (Nieuwbouw) and (b) 'other additions' (OverigeToevoeging) — mostly conversions from non-residential buildings. Reported by CBS from BAG registrations, published annually. Demolitions (Sloop) and correction items are tracked separately in the same table.",
    historicalContext:
      "Since 2015, gross additions have averaged around 75,000/year, peaking near 90,000 in 2022-2023 and falling back to 82,204 in 2024 as high interest rates slowed construction starts. Each successive political commitment (Rutte-IV 100k/yr, then 2026 D66/VVD/CDA 100k/yr) has been set roughly 20-25% above the observed pace.",
    relatedLegislation: [
      {
        name: "Wet regie volkshuisvesting",
        url: "https://wetten.overheid.nl/BWBR0050206/",
        role: "The 2024 law giving the Minister of Volkshuisvesting authority to direct provinces and municipalities on new-build targets and land use. Underpins the enforceability of the 100k/year commitment.",
      },
    ],
  },
];

export function findHousingIndicator(id: string): IndicatorDef | undefined {
  return housingIndicators.find((i) => i.id === id);
}
