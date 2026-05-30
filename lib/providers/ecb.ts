import { z } from "zod";
import type { DataPoint, EcbIndicator } from "@/types";

const ECB_BASE = "https://data-api.ecb.europa.eu/service/data";

/**
 * ECB SDMX-JSON shape (subset). The structure block carries a mapping from
 * observation index → time period. Each series object's `observations` field
 * maps that same index → [value, ...attrs].
 */
const EcbResponseSchema = z.object({
  dataSets: z
    .array(
      z.object({
        series: z.record(
          z.string(),
          z.object({
            observations: z.record(z.string(), z.array(z.unknown())),
          }),
        ),
      }),
    )
    .min(1),
  structure: z.object({
    dimensions: z.object({
      observation: z
        .array(
          z.object({
            id: z.string(),
            values: z.array(z.object({ id: z.string(), name: z.string().optional() })),
          }),
        )
        .min(1),
    }),
  }),
});

export async function fetchEcbSeries(indicator: EcbIndicator): Promise<DataPoint[]> {
  const url = `${ECB_BASE}/${indicator.dataflow}/${indicator.seriesKey}?format=jsondata`;
  const res = await fetch(url, {
    headers: { Accept: "application/vnd.sdmx.data+json;version=1.0.0-wd" },
    next: { revalidate: 21600 },
  });
  if (!res.ok) throw new Error(`ECB ${indicator.seriesKey}: ${res.status}`);
  const parsed = EcbResponseSchema.parse(await res.json());

  const timeDim = parsed.structure.dimensions.observation.find((d) => d.id === "TIME_PERIOD");
  if (!timeDim) throw new Error("ECB response missing TIME_PERIOD dimension");
  const timeIndex = timeDim.values.map((v) => v.id);

  // Take the first (and usually only) series in the response.
  const firstSeries = Object.values(parsed.dataSets[0].series)[0];
  if (!firstSeries) return [];

  const freq = indicator.seriesKey.split(".")[0]; // D / M / Q / A

  const points: DataPoint[] = [];
  for (const [obsIdxStr, obsArr] of Object.entries(firstSeries.observations)) {
    const idx = Number(obsIdxStr);
    const periodId = timeIndex[idx];
    const rawValue = obsArr[0];
    if (rawValue === null || rawValue === undefined) continue;
    const value = typeof rawValue === "number" ? rawValue : Number(rawValue);
    if (!Number.isFinite(value)) continue;
    const decoded = decodeEcbPeriod(periodId, freq);
    if (!decoded) continue;
    points.push({ date: decoded.iso, value, periodLabel: decoded.label });
  }
  points.sort((a, b) => a.date.localeCompare(b.date));
  return points;
}

/**
 * ECB period strings:
 *   "2024-12-31" for daily
 *   "2024-12"    for monthly
 *   "2024-Q4"    for quarterly
 *   "2024"       for annual
 */
function decodeEcbPeriod(p: string, freq: string): { iso: string; label: string } | null {
  if (!p) return null;
  if (freq === "D") {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(p)) return null;
    const d = new Date(`${p}T00:00:00Z`);
    const label = new Intl.DateTimeFormat("nl-NL", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(d);
    return { iso: p, label };
  }
  if (freq === "M") {
    const m = /^(\d{4})-(\d{2})$/.exec(p);
    if (!m) return null;
    const iso = `${m[1]}-${m[2]}-01`;
    const label = new Intl.DateTimeFormat("nl-NL", { month: "short", year: "numeric" }).format(
      new Date(`${iso}T00:00:00Z`),
    );
    return { iso, label };
  }
  if (freq === "Q") {
    const m = /^(\d{4})-Q([1-4])$/.exec(p);
    if (!m) return null;
    const month = String((Number(m[2]) - 1) * 3 + 1).padStart(2, "0");
    return { iso: `${m[1]}-${month}-01`, label: `${m[1]} Q${m[2]}` };
  }
  if (freq === "A") {
    if (!/^\d{4}$/.test(p)) return null;
    return { iso: `${p}-01-01`, label: p };
  }
  return null;
}
