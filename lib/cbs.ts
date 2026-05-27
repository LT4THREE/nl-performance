import { z } from "zod";
import { decodeCbsPeriod } from "@/lib/format";
import type { DataPoint, IndicatorDef } from "@/types";

const CBS_BASE = "https://opendata.cbs.nl/ODataApi/OData";

const CbsResponseSchema = z.object({
  value: z.array(z.record(z.string(), z.unknown())),
});

const TableInfoSchema = z.object({
  value: z
    .array(
      z.object({
        Title: z.string().optional(),
        ShortTitle: z.string().optional(),
        Identifier: z.string().optional(),
        Modified: z.string().optional(),
        Period: z.string().optional(),
        Frequency: z.string().optional(),
        ReasonDelivery: z.string().optional(),
      }),
    )
    .min(1),
});

export type CbsTableInfo = z.infer<typeof TableInfoSchema>["value"][number];

/** Fetch table metadata: title, period coverage, last modified, etc. */
export async function fetchTableInfo(tableId: string): Promise<CbsTableInfo> {
  const url = `${CBS_BASE}/${tableId}/TableInfos`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 86400 }, // 24h
  });
  if (!res.ok) throw new Error(`CBS TableInfos ${tableId}: ${res.status}`);
  const json = await res.json();
  const parsed = TableInfoSchema.parse(json);
  return parsed.value[0];
}

/**
 * Fetch a series of observations for a given indicator.
 * Uses OData $filter and $select; returns sorted-by-date DataPoints.
 */
export async function fetchIndicatorSeries(indicator: IndicatorDef): Promise<DataPoint[]> {
  const selectFields = [indicator.periodField, indicator.valueField].join(",");
  const params = new URLSearchParams();
  params.set("$select", selectFields);
  params.set("$filter", indicator.filter);

  const url = `${CBS_BASE}/${indicator.cbsTable}/TypedDataSet?${params.toString()}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 21600 }, // 6h
  });
  if (!res.ok) throw new Error(`CBS ${indicator.cbsTable}: ${res.status}`);
  const json = await res.json();
  const parsed = CbsResponseSchema.parse(json);

  const points: DataPoint[] = [];
  for (const row of parsed.value) {
    const periodCode = row[indicator.periodField];
    const raw = row[indicator.valueField];
    if (typeof periodCode !== "string") continue;
    if (raw === null || raw === undefined) continue;
    const value = typeof raw === "number" ? raw : Number(raw);
    if (!Number.isFinite(value)) continue;
    const decoded = decodeCbsPeriod(periodCode);
    if (!decoded) continue;
    points.push({ date: decoded.iso, value, periodLabel: decoded.label });
  }

  points.sort((a, b) => a.date.localeCompare(b.date));
  return points;
}

/**
 * Convenience: latest point + YoY delta (current value minus value ~12 months earlier).
 */
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

  // Find a comparison point closest to one year earlier.
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
