import type { DomainMeta } from "@/types";

export const domains: DomainMeta[] = [
  { id: "economy", label: "Economy", description: "GDP, jobs, prices, public finances." },
  { id: "housing", label: "Housing", description: "Supply, prices, transactions, stock." },
  { id: "climate", label: "Climate", description: "Emissions, energy, sustainability." },
  { id: "social", label: "Social", description: "Population, inequality, well-being." },
  { id: "education", label: "Education", description: "Outcomes, attainment, spending." },
  { id: "health", label: "Health", description: "Outcomes, access, public health." },
];

export const enabledDomains = new Set<DomainMeta["id"]>(["economy", "housing"]);
