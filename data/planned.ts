import type { Domain } from "@/types";

/**
 * Per-domain shortlist of indicators we intend to ship next, surfaced on each
 * domain landing page so visitors see roadmap context without leaving the page.
 * Keep entries concrete: the metric we'd compute, plus the authoritative source.
 */
export const plannedNext: Record<Domain, { metric: string; source: string }[]> = {
  economy: [
    { metric: "Real GDP growth (quarterly)", source: "CBS Nationale rekeningen" },
    { metric: "10-year sovereign yield", source: "DNB" },
    { metric: "Real wage index", source: "CBS labour accounts" },
  ],
  housing: [
    { metric: "New-build completions per year", source: "Kadaster BAG" },
    { metric: "Rental price index", source: "CBS / Huurcommissie" },
    { metric: "Affordability ratio (price ÷ median income)", source: "CBS, derived" },
  ],
  climate: [
    { metric: "Renewable share of total energy use", source: "Eurostat / PBL KEV" },
    { metric: "Nitrogen deposition by sector", source: "RIVM" },
    { metric: "EV share of new car registrations", source: "RVO / RDW" },
  ],
  social: [
    { metric: "Income inequality (Gini coefficient)", source: "CBS" },
    { metric: "Net migration", source: "CBS" },
    { metric: "Trust in institutions", source: "SCP / CBS" },
  ],
  education: [
    { metric: "PISA scores vs OECD median", source: "OECD PISA" },
    { metric: "Early school leavers", source: "DUO / CBS" },
    { metric: "Higher-education enrolment", source: "DUO" },
  ],
  health: [
    { metric: "Mental-health waiting list times", source: "NZa" },
    { metric: "Vaccination coverage", source: "RIVM" },
    { metric: "Healthcare cost per capita", source: "CBS / NZa" },
  ],
};
