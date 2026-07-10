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
    displayGroup: "affordability",
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
        name: "Wet betaalbare huur (BWBR identifier pending verification)",
        url: "https://wetten.overheid.nl/",
        role: "Mid-market rent regulation; affects the buy-vs-rent choice, indirectly shaping owner-occupied demand. Specific BWBR identifier and enactment date not independently re-verified in this build.",
      },
      {
        name: "Wet inkomstenbelasting 2001 (hypotheekrenteaftrek)",
        url: "https://wetten.overheid.nl/",
        role: "The mortgage-interest deduction, a long-standing structural driver of Dutch house prices; treatment has been adjusted over the 2020s. Specific BWBR identifier not independently re-verified in this build.",
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
    displayGroup: "affordability",
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
    displayGroup: "market-activity",
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
    displayGroup: "supply",
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
    displayGroup: "supply",
    confidence: "high",
    sourceType: "official_statistics",
    whyItMatters:
      "This is the direct measurement of the housing supply the 100,000/year public target refers to. Gross additions include pure new-build plus conversions from non-housing (e.g. office-to-residential).",
    methodology:
      "Sum of (a) new-build dwellings completed (Nieuwbouw) and (b) 'other additions' (OverigeToevoeging) — mostly conversions from non-residential buildings. Reported by CBS from BAG registrations, published annually. Demolitions (Sloop) and correction items are tracked separately in the same table.",
    historicalContext:
      "Since 2015, gross additions have averaged around 75,000/year, peaking near 90,000 in 2022-2023 and falling back to 79,910 in 2025 as high interest rates slowed construction starts. Each recent public 100,000/year target has been set roughly 20-25% above the observed pace.",
    relatedLegislation: [
      {
        name: "Wet regie volkshuisvesting (identifier pending verification)",
        url: "https://wetten.overheid.nl/",
        role: "Discussed as the statutory backbone giving national government authority to direct provincial and municipal housing targets. Specific BWBR identifier and current enacted status have not been independently re-verified in this build.",
      },
    ],
  },
  {
    provider: "cbs",
    id: "pure-new-build",
    domain: "housing",
    label: "Pure new-build dwellings per year",
    shortLabel: "Pure new-build",
    description:
      "New-build dwellings (excluding conversions from non-residential buildings) added to the Dutch housing stock per year. This is the narrower construction-only measure that sits inside the wider gross-additions figure. Source: CBS 82235NED, annual back to 1921.",
    cbsTable: "82235NED",
    filter: "substringof('JJ', Perioden)",
    valueField: "Nieuwbouw_2",
    periodField: "Perioden",
    unit: "count",
    frequency: "annual",
    higherIsBetter: true,
    topicIds: ["housing"],
    metricType: "output",
    displayGroup: "supply",
    confidence: "high",
    sourceType: "official_statistics",
    whyItMatters:
      "Pure new-build isolates the actual construction pipeline from conversion effects. When gross additions rise but pure new-build falls, growth is coming from re-purposing existing buildings rather than laying new foundations.",
    methodology:
      "The Nieuwbouw field in CBS 82235NED: dwellings entered into the BAG for the first time from newly-constructed residential buildings. Excludes 'other additions' (OverigeToevoeging_3), which mostly capture office-to-residential and other conversions and are counted separately in the same table.",
    historicalContext:
      "Pure new-build has been consistently below gross additions by roughly 8,000-15,000 dwellings/year. In 2025 the gap was 79,910 gross vs 69,189 pure new-build — the 10,721 difference is dominated by conversions of non-residential buildings.",
  },
  {
    provider: "cbs",
    id: "dwellings-demolished",
    domain: "housing",
    label: "Dwellings demolished per year",
    shortLabel: "Demolitions",
    description:
      "Total dwellings removed from the Dutch housing stock through demolition per year. Subtracts from gross additions to give the net change in stock. Source: CBS 82235NED, annual back to 1921.",
    cbsTable: "82235NED",
    filter: "substringof('JJ', Perioden)",
    valueField: "Sloop_6",
    periodField: "Perioden",
    unit: "count",
    frequency: "annual",
    higherIsBetter: false,
    topicIds: ["housing"],
    metricType: "outcome",
    displayGroup: "supply",
    confidence: "high",
    sourceType: "official_statistics",
    whyItMatters:
      "The 100,000/year public target is typically stated against gross additions, but the net effect on the housing stock is gross additions minus demolitions. Ignoring demolitions overstates supply growth.",
    methodology:
      "The Sloop field in CBS 82235NED: dwellings removed from the BAG through demolition. Excludes conversions from residential to non-residential use, which are counted as OverigeOnttrekking_4 (other withdrawals) in the same table.",
    historicalContext:
      "Annual demolitions have hovered around 9,000-12,000 dwellings/year in recent years. In 2025: 9,551; 2024: 11,814; 2023: 9,337. Combined with the recent decline in gross additions, this means net stock growth has fallen from ~78,500 in 2023 to ~70,400 in 2024 to ~70,300 in 2025.",
  },
  {
    provider: "cbs",
    id: "net-new-dwellings",
    domain: "housing",
    label: "Net new dwellings per year",
    shortLabel: "Net new dwellings",
    description:
      "Net change in the Dutch housing stock per year, after subtracting demolitions and applying CBS's own correction items. This is the number to watch if the target is interpreted as 'net homes added' rather than gross production. Source: CBS 82235NED (SaldoVoorraad_8), annual back to 1921.",
    cbsTable: "82235NED",
    filter: "substringof('JJ', Perioden)",
    valueField: "SaldoVoorraad_8",
    periodField: "Perioden",
    unit: "count",
    frequency: "annual",
    higherIsBetter: true,
    topicIds: ["housing"],
    metricType: "outcome",
    displayGroup: "supply",
    confidence: "high",
    sourceType: "official_statistics",
    whyItMatters:
      "Different actors state the 100,000/year public target in different ways — sometimes as gross production, sometimes as net additions. This is CBS's own net figure and answers the question 'how much did the housing stock actually grow last year?' directly.",
    methodology:
      "The SaldoVoorraad field in CBS 82235NED = Nieuwbouw + OverigeToevoeging − Sloop − OverigeOnttrekking + Correctie. Same as adding gross-additions and subtracting demolitions plus other withdrawals plus any statistical corrections. Equal to the start-of-year stock minus prior end-of-year stock.",
    historicalContext:
      "Net additions have run below gross additions by roughly 10-12k dwellings/year, dominated by demolitions. Recent values: 2023: 78,819; 2024: 70,420; 2025: 70,359. The 2023→2024 step-down is significant — largely a jump in demolitions from 9.3k to 11.8k.",
  },
  {
    provider: "cbs",
    id: "house-price-index",
    domain: "housing",
    label: "Existing-home price index (2020 = 100)",
    shortLabel: "Price index",
    description:
      "The CBS/Kadaster Prijsindex Bestaande Koopwoningen (PBK) — a hedonic (composition-controlled) index of Dutch existing-home sale prices, rebased to 2020 = 100. Better than the average sale price for tracking price movement because it filters out changes in the mix of homes sold each month.",
    cbsTable: "85773NED",
    filter: "substringof('MM', Perioden)",
    valueField: "PrijsindexVerkoopprijzen_1",
    periodField: "Perioden",
    unit: "index",
    frequency: "monthly",
    higherIsBetter: false,
    topicIds: ["housing"],
    metricType: "outcome",
    displayGroup: "affordability",
    confidence: "high",
    sourceType: "official_statistics",
    whyItMatters:
      "The average sale price moves with the mix of homes sold that month; the price index does not. This is the affordability signal the DNB and international bodies (ECB, OECD) cite for the Netherlands. A value of 155 means existing homes cost 55% more than in the 2020 base period.",
    methodology:
      "Hedonic quality-adjusted price index. Each transaction is weighted using observed characteristics (surface area, region, dwelling type, year built) so month-to-month change reflects pure price movement rather than compositional differences. Published jointly by CBS and Kadaster from the same Kadaster transaction register that feeds the average-sale-price series.",
    historicalContext:
      "The index roughly doubled between 2013 (below 80) and 2022 (above 155), then dropped ~7% into the 2023 trough as mortgage rates jumped, before resuming growth from mid-2023. Where 2000 = 60 on the same base, the doubling since the mid-2010s dominates the whole 25-year series.",
  },
];

export function findHousingIndicator(id: string): IndicatorDef | undefined {
  return housingIndicators.find((i) => i.id === id);
}
