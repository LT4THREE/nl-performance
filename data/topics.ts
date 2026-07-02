import type { TopicMeta } from "@/types";

/**
 * The 15 public issue areas used as the primary information architecture.
 *
 * indicatorIds are cross-references into data/indicators/*; goalIds cross-
 * reference data/goals/federal.json. legacyDomains links back to the
 * existing /economy /housing /climate /social /education /health pages so
 * old URLs keep working through the migration.
 */
export const topics: TopicMeta[] = [
  {
    id: "housing",
    label: "Housing",
    tagline: "Supply, affordability, and the 100,000-a-year commitment",
    description:
      "Homes built, prices, transactions, and stock. Tracked against the 2026 coalition target of ~100,000 net new homes per year and €1B/year of federal housing spending from 2029.",
    ministries: [
      "Ministerie van Volkshuisvesting en Ruimtelijke Ordening",
      "Ministerie van BZK",
      "Municipalities",
      "Provinces",
    ],
    indicatorIds: [
      "new-dwellings-added",
      "average-house-price",
      "house-price-yoy",
      "homes-sold",
      "housing-stock",
    ],
    goalIds: ["housing-100k-2030"],
    legacyDomains: ["housing"],
    status: "live",
  },
  {
    id: "cost-of-living",
    label: "Cost of living",
    tagline: "Inflation, purchasing power, and interest rates",
    description:
      "How much things cost and how far a euro goes. Consumer prices, ECB rates, and (planned) real wage growth and purchasing-power indicators from CBS and CPB.",
    ministries: [
      "Ministerie van Financiën",
      "Ministerie van SZW",
      "Ministerie van EZ",
      "De Nederlandsche Bank (DNB)",
    ],
    indicatorIds: ["inflation-rate", "ecb-deposit-rate"],
    goalIds: [],
    legacyDomains: ["economy"],
    status: "live",
  },
  {
    id: "economy-work",
    label: "Economy & work",
    tagline: "Jobs, growth, and the labour market",
    description:
      "Unemployment, participation, and (planned) GDP growth against the 2026 coalition's 1.5%/year target. Real wages and productivity to follow.",
    ministries: [
      "Ministerie van EZ",
      "Ministerie van SZW",
      "Ministerie van Financiën",
    ],
    indicatorIds: ["unemployment-rate"],
    goalIds: ["gdp-growth-1p5pct"],
    legacyDomains: ["economy"],
    status: "live",
  },
  {
    id: "healthcare",
    label: "Healthcare",
    tagline: "Longevity, access, quality of care",
    description:
      "Life expectancy and healthy life expectancy are the headline outcomes of the entire system. NZa wait times, RIVM vaccination coverage and public-health surveillance planned next.",
    ministries: [
      "Ministerie van VWS",
      "RIVM",
      "Nederlandse Zorgautoriteit (NZa)",
      "Inspectie Gezondheidszorg en Jeugd (IGJ)",
    ],
    indicatorIds: ["life-expectancy", "healthy-life-expectancy"],
    goalIds: [],
    legacyDomains: ["health"],
    status: "live",
  },
  {
    id: "education",
    label: "Education",
    tagline: "Spending, attainment, international standing",
    description:
      "Public spending on education and tertiary attainment vs peers. Tracked against the 2026 coalition €1.5B additional structural investment. OECD PISA scores and DUO enrolment data planned.",
    ministries: [
      "Ministerie van OCW",
      "DUO",
      "Inspectie van het Onderwijs",
    ],
    indicatorIds: [
      "tertiary-attainment-25-64",
      "education-spending-gdp",
      "education-spending-total",
    ],
    goalIds: ["education-investment-1p5b"],
    legacyDomains: ["education"],
    status: "live",
  },
  {
    id: "immigration-asylum",
    label: "Immigration & asylum",
    tagline: "Asylum processing, migration flows, integration",
    description:
      "Data integration planned. Priority sources: IND (asylum applications and processing times), COA (reception capacity), CBS (net migration and demographics).",
    ministries: [
      "Ministerie van Asiel en Migratie",
      "IND",
      "COA",
    ],
    indicatorIds: [],
    goalIds: [],
    legacyDomains: [],
    status: "planned",
  },
  {
    id: "crime-justice",
    label: "Crime & justice",
    tagline: "Safety, prosecution, and the courts",
    description:
      "Data integration planned. Priority sources: CBS crime statistics (registered offences and victimisation), Politie, WODC (research on crime and justice), CJIB, Openbaar Ministerie.",
    ministries: [
      "Ministerie van Justitie en Veiligheid",
      "Politie",
      "Openbaar Ministerie",
      "Inspectie Justitie en Veiligheid",
    ],
    indicatorIds: [],
    goalIds: [],
    legacyDomains: [],
    status: "planned",
  },
  {
    id: "defence",
    label: "Defence",
    tagline: "Spending, capability, NATO alignment",
    description:
      "Tracked against the 2026 coalition target of 3.5% of GDP by 2030. Live indicator wiring planned; today the goal shows on /goals with the current 2.05% figure sourced from NATO's 2024 estimate.",
    ministries: [
      "Ministerie van Defensie",
      "NATO (benchmark)",
    ],
    indicatorIds: [],
    goalIds: ["defense-3p5pct-nato"],
    legacyDomains: [],
    status: "partial",
  },
  {
    id: "climate-energy",
    label: "Climate & energy",
    tagline: "Emissions, energy transition, the Klimaatwet",
    description:
      "Greenhouse-gas emissions vs the 1990 baseline, tracked against the Klimaatwet −55% target for 2030. RIVM Emissieregistratie, PBL KEV and the Dashboard Klimaatbeleid come next.",
    ministries: [
      "Ministerie van Klimaat en Groene Groei",
      "RIVM",
      "PBL",
    ],
    indicatorIds: ["ghg-emissions-vs-1990", "ghg-emissions-total"],
    goalIds: ["climate-55-2030"],
    legacyDomains: ["climate"],
    status: "live",
  },
  {
    id: "agriculture-nitrogen",
    label: "Agriculture & nitrogen",
    tagline: "Statutory nitrogen reduction by 2035",
    description:
      "The 2026 coalition confirms statutory nitrogen-reduction targets by 2035: 42–46% agriculture, 50% industry, 50% mobility. Live tracking requires the RIVM Aerius/nitrogen inventory — planned.",
    ministries: [
      "Ministerie van Landbouw, Natuur en Visserij (LNV)",
      "RIVM",
      "PBL",
    ],
    indicatorIds: [],
    goalIds: ["nitrogen-reduction-2035"],
    legacyDomains: [],
    status: "partial",
  },
  {
    id: "infrastructure-transport",
    label: "Infrastructure & transport",
    tagline: "Roads, rail, water, digital",
    description:
      "Data integration planned. Priority sources: Rijkswaterstaat (roads, waterways), CBS mobility statistics, KiM (Kennisinstituut voor Mobiliteitsbeleid), NS/ProRail reliability.",
    ministries: [
      "Ministerie van I&W",
      "Rijkswaterstaat",
      "ProRail",
    ],
    indicatorIds: [],
    goalIds: [],
    legacyDomains: [],
    status: "planned",
  },
  {
    id: "social-security-poverty",
    label: "Social security & poverty",
    tagline: "Benefits, inequality, financial vulnerability",
    description:
      "Data integration planned. Priority sources: CBS income and poverty statistics, UWV (labour market and benefits), SCP (well-being and inequality), Nibud (household finances).",
    ministries: [
      "Ministerie van SZW",
      "UWV",
      "SCP",
    ],
    indicatorIds: [],
    goalIds: [],
    legacyDomains: ["social"],
    status: "planned",
  },
  {
    id: "public-finances",
    label: "Public finances",
    tagline: "Debt, deficit, spending, taxation",
    description:
      "Government debt as a share of GDP is live from CBS national accounts. Ministry-level budget vs realisation from Rijksfinanciën and audits from the Algemene Rekenkamer come next.",
    ministries: [
      "Ministerie van Financiën",
      "Algemene Rekenkamer",
    ],
    indicatorIds: ["government-debt-gdp"],
    goalIds: [],
    legacyDomains: ["economy"],
    status: "live",
  },
  {
    id: "digital-government",
    label: "Digital government",
    tagline: "Digital services, cybersecurity, AI",
    description:
      "Data integration planned. Priority sources: Autoriteit Persoonsgegevens (privacy incidents), Nationaal Cyber Security Centrum (NCSC), CBS digital-economy statistics, Logius (identity services uptake).",
    ministries: [
      "Ministerie van BZK",
      "Autoriteit Persoonsgegevens",
      "NCSC",
    ],
    indicatorIds: [],
    goalIds: [],
    legacyDomains: [],
    status: "planned",
  },
  {
    id: "europe-foreign-affairs",
    label: "Europe & foreign affairs",
    tagline: "EU commitments, development aid, trade",
    description:
      "Data integration planned. Priority sources: European Commission, Eurostat, OECD DAC (development aid), CBS trade statistics.",
    ministries: [
      "Ministerie van Buitenlandse Zaken",
      "European Commission",
      "OECD",
    ],
    indicatorIds: [],
    goalIds: [],
    legacyDomains: [],
    status: "planned",
  },
];

export function findTopic(id: string): TopicMeta | undefined {
  return topics.find((t) => t.id === id);
}

export const liveTopics = topics.filter((t) => t.status !== "planned");
