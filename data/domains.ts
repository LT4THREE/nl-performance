import type { DomainMeta } from "@/types";

export const domains: DomainMeta[] = [
  { id: "economy", label: "Economy", description: "GDP, jobs, prices, public finances." },
  { id: "housing", label: "Housing", description: "Supply, prices, transactions, stock." },
  { id: "climate", label: "Climate", description: "Emissions, energy, sustainability." },
  { id: "social", label: "Social", description: "Population, well-being." },
  { id: "education", label: "Education", description: "Spending, outcomes, attainment." },
  { id: "health", label: "Health", description: "Longevity, outcomes, public health." },
];

export const enabledDomains = new Set<DomainMeta["id"]>([
  "economy",
  "housing",
  "climate",
  "social",
  "education",
  "health",
]);
