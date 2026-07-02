import type { Confidence } from "@/types";

/**
 * Structured input entries for the Housing topic — federal funding
 * commitments, budget lines, legislative levers. These are NOT metrics
 * measured from CBS/ECB/Eurostat. Each entry is either:
 *   - sourced (isDemo: false, real URL to an authoritative document)
 *   - or a placeholder (isDemo: true, no fabricated URL)
 *
 * The UI marks demo entries clearly per the item-10 rule. Real live
 * spending data can be substituted once we wire up Rijksfinanciën or
 * ministry annual reports.
 */
export type InputEntry = {
  id: string;
  title: string;
  value?: string;
  unit?: string;
  timeframe?: string;
  description: string;
  sourceLabel?: string;
  sourceUrl?: string;
  confidence: Confidence | "none";
  isDemo?: boolean;
};

export const housingInputs: InputEntry[] = [
  {
    id: "federal-housing-funding-2029",
    title: "Federal housing funding commitment",
    value: "1",
    unit: "€ billion / year (starts 2029)",
    timeframe: "2029 – 2030",
    description:
      "The most-cited federal funding line associated with the ~100,000/year housing target: roughly €1 billion per year in additional federal spending, phased in from 2029. Not currently visible in live spending data because it has not yet started.",
    sourceLabel:
      "Public coalition-programme reference (specific document URL pending verification)",
    confidence: "none",
    isDemo: true,
  },
  {
    id: "woningbouwimpuls",
    title: "Woningbouwimpuls (housing acceleration subsidy)",
    description:
      "Multi-round federal subsidy programme co-funding local housing plans (regional co-financing to unlock stalled projects). Specific per-round budgets and total commitment across the current programme period pending verification against Rijksoverheid documentation.",
    sourceLabel: "Rijksoverheid Woningbouwimpuls programme page (URL pending verification)",
    confidence: "none",
    isDemo: true,
  },
  {
    id: "new-neighbourhood-sites-designated",
    title: "Designated large-scale new-neighbourhood sites",
    description:
      "The set of designated large-scale sites where the federal government intends to concentrate additional housing production. The number of sites and their locations are pending publication of the current Nota Ruimte / grootschalige woningbouwlocaties list.",
    sourceLabel: "Nota Ruimte / national spatial-planning documentation (pending)",
    confidence: "none",
    isDemo: true,
  },
];
