import type { DataPoint, Frequency, IndicatorDef } from "@/types";
import { fetchCbsSeries } from "@/lib/providers/cbs";
import { fetchEcbSeries } from "@/lib/providers/ecb";
import { fetchEurostatSeries } from "@/lib/providers/eurostat";

export type SeriesFetch = {
  points: DataPoint[];
  /** ISO timestamp of when this fetch executed (subject to ISR cache). */
  fetchedAt: string;
};

export async function fetchIndicatorSeries(indicator: IndicatorDef): Promise<DataPoint[]> {
  switch (indicator.provider) {
    case "cbs":
      return fetchCbsSeries(indicator);
    case "ecb":
      return fetchEcbSeries(indicator);
    case "eurostat":
      return fetchEurostatSeries(indicator);
  }
}

/**
 * Same as fetchIndicatorSeries but also returns the timestamp the fetch
 * resolved. The timestamp is part of the ISR-cached payload, so it reflects
 * the most recent cache miss (= last refresh from origin), not the page-load
 * time of the visitor.
 */
export async function fetchIndicatorWithTimestamp(
  indicator: IndicatorDef,
): Promise<SeriesFetch> {
  const points = await fetchIndicatorSeries(indicator);
  return { points, fetchedAt: new Date().toISOString() };
}

/**
 * Strict year-on-year comparison: looks for the observation that is exactly
 *   monthly   → 12 months earlier (same day-of-month, year-1)
 *   quarterly → 4 quarters earlier
 *   annual    → 1 year earlier
 *   daily     → same day, year-1
 *
 * If that exact prior observation does not exist, returns null for both
 * deltas — callers render "YoY n/a" rather than substituting a near-neighbor.
 */
export function summarize(
  points: DataPoint[],
  frequency: Frequency,
): {
  latest: DataPoint | null;
  yoyDelta: number | null;
  yoyDeltaPct: number | null;
} {
  if (points.length === 0) return { latest: null, yoyDelta: null, yoyDeltaPct: null };
  const latest = points[points.length - 1];
  const priorIso = strictPriorIso(latest.date, frequency);
  if (!priorIso) return { latest, yoyDelta: null, yoyDeltaPct: null };

  // Index by date for exact lookup.
  const byDate = new Map(points.map((p) => [p.date, p]));
  const prior = byDate.get(priorIso);
  if (!prior) return { latest, yoyDelta: null, yoyDeltaPct: null };
  const yoyDelta = latest.value - prior.value;
  const yoyDeltaPct = prior.value !== 0 ? (yoyDelta / prior.value) * 100 : null;
  return { latest, yoyDelta, yoyDeltaPct };
}

/** Compute the ISO date that is exactly one period back, in the same period. */
function strictPriorIso(latestIso: string, frequency: Frequency): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(latestIso);
  if (!m) return null;
  const [yStr, moStr, dStr] = [m[1], m[2], m[3]];
  const y = Number(yStr);
  switch (frequency) {
    case "annual":
      return `${y - 1}-01-01`;
    case "quarterly":
      // Same start-of-quarter month
      return `${y - 1}-${moStr}-01`;
    case "monthly":
      return `${y - 1}-${moStr}-01`;
    case "daily":
      return `${y - 1}-${moStr}-${dStr}`;
  }
}

/** Display label for a provider, used in DataSource and Sources page. */
export function providerLabel(p: IndicatorDef["provider"]): string {
  switch (p) {
    case "cbs":
      return "CBS";
    case "ecb":
      return "ECB";
    case "eurostat":
      return "Eurostat";
  }
}

/** Build a canonical citation URL for an indicator's source. */
export function sourceCitationUrl(indicator: IndicatorDef): string {
  switch (indicator.provider) {
    case "cbs":
      return `https://opendata.cbs.nl/statline/#/CBS/nl/dataset/${indicator.cbsTable}/table`;
    case "ecb":
      return `https://data.ecb.europa.eu/data/datasets/${indicator.dataflow}`;
    case "eurostat":
      return `https://ec.europa.eu/eurostat/databrowser/view/${indicator.dataset}/default/table`;
  }
}

/** Short identifier for the underlying table/series, shown next to the link. */
export function sourceIdentifier(indicator: IndicatorDef): string {
  switch (indicator.provider) {
    case "cbs":
      return `table ${indicator.cbsTable}`;
    case "ecb":
      return `${indicator.dataflow} · ${indicator.seriesKey}`;
    case "eurostat":
      return indicator.dataset;
  }
}
