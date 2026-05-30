import type { DataPoint, IndicatorDef } from "@/types";
import { fetchCbsSeries } from "@/lib/providers/cbs";
import { fetchEcbSeries } from "@/lib/providers/ecb";
import { fetchEurostatSeries } from "@/lib/providers/eurostat";

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

/** Latest observation + a year-on-year absolute delta and percent delta. */
export function summarize(points: DataPoint[]): {
  latest: DataPoint | null;
  yoyDelta: number | null;
  yoyDeltaPct: number | null;
} {
  if (points.length === 0) return { latest: null, yoyDelta: null, yoyDeltaPct: null };
  const latest = points[points.length - 1];
  const latestDate = new Date(latest.date);
  const targetYear = latestDate.getUTCFullYear() - 1;
  const targetMonth = latestDate.getUTCMonth();

  let bestIdx = -1;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (let i = 0; i < points.length - 1; i++) {
    const d = new Date(points[i].date);
    if (d.getUTCFullYear() !== targetYear) continue;
    const distance = Math.abs(d.getUTCMonth() - targetMonth);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIdx = i;
    }
  }

  if (bestIdx < 0) return { latest, yoyDelta: null, yoyDeltaPct: null };
  const prior = points[bestIdx];
  const yoyDelta = latest.value - prior.value;
  const yoyDeltaPct = prior.value !== 0 ? (yoyDelta / prior.value) * 100 : null;
  return { latest, yoyDelta, yoyDeltaPct };
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
