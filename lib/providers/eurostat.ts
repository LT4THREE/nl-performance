import { z } from "zod";
import type { DataPoint, EurostatIndicator } from "@/types";

const EUROSTAT_BASE = "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data";

/**
 * Eurostat returns JSON-stat 2.0:
 *  - `value` is a sparse object mapping flat-index strings → number
 *  - `dimension.time.category.index` maps period label → flat-index of that period
 *  - `dimension.time.category.label` maps period code → human label
 *
 * For a single-geo, single-everything-else query the time dimension is the only
 * one with size > 1, so flat-index == time-index.
 */
const EurostatResponseSchema = z.object({
  value: z.record(z.string(), z.number().nullable()),
  dimension: z.object({
    time: z.object({
      category: z.object({
        index: z.record(z.string(), z.number()),
        label: z.record(z.string(), z.string()),
      }),
    }),
  }),
  label: z.string().optional(),
  updated: z.string().optional(),
});

export type EurostatMeta = {
  label: string;
  updated: string;
};

export async function fetchEurostatSeries(
  indicator: EurostatIndicator,
): Promise<DataPoint[]> {
  const url = buildEurostatUrl(indicator);
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error(`Eurostat ${indicator.dataset}: ${res.status}`);
  const parsed = EurostatResponseSchema.parse(await res.json());

  const reverseIndex = new Map<number, string>();
  for (const [periodCode, idx] of Object.entries(parsed.dimension.time.category.index)) {
    reverseIndex.set(idx, periodCode);
  }

  const points: DataPoint[] = [];
  for (const [flatIdxStr, raw] of Object.entries(parsed.value)) {
    if (raw === null) continue;
    const idx = Number(flatIdxStr);
    const periodCode = reverseIndex.get(idx);
    if (!periodCode) continue;
    const decoded = decodeEurostatPeriod(periodCode);
    if (!decoded) continue;
    points.push({ date: decoded.iso, value: raw, periodLabel: decoded.label });
  }
  points.sort((a, b) => a.date.localeCompare(b.date));

  if (indicator.baselineYear) {
    const baselinePoint = points.find((p) =>
      p.date.startsWith(String(indicator.baselineYear)),
    );
    if (baselinePoint && baselinePoint.value !== 0) {
      const baseline = baselinePoint.value;
      return points.map((p) => ({ ...p, value: (p.value / baseline) * 100 - 100 }));
    }
  }
  return points;
}

export async function fetchEurostatMeta(
  indicator: EurostatIndicator,
): Promise<EurostatMeta> {
  const url = buildEurostatUrl(indicator);
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error(`Eurostat ${indicator.dataset}: ${res.status}`);
  const parsed = EurostatResponseSchema.parse(await res.json());
  return {
    label: parsed.label ?? indicator.dataset,
    updated: parsed.updated ?? "",
  };
}

function buildEurostatUrl(indicator: EurostatIndicator): string {
  const params = new URLSearchParams();
  params.set("format", "JSON");
  params.set("lang", "EN");
  for (const [k, v] of Object.entries(indicator.dimensions)) {
    if (Array.isArray(v)) {
      for (const vv of v) params.append(k, vv);
    } else {
      params.set(k, v);
    }
  }
  return `${EUROSTAT_BASE}/${indicator.dataset}?${params.toString()}`;
}

function decodeEurostatPeriod(code: string): { iso: string; label: string } | null {
  if (/^\d{4}$/.test(code)) {
    return { iso: `${code}-01-01`, label: code };
  }
  const m = /^(\d{4})-?(\d{2})$/.exec(code);
  if (m) {
    const iso = `${m[1]}-${m[2]}-01`;
    const label = new Intl.DateTimeFormat("nl-NL", {
      month: "short",
      year: "numeric",
    }).format(new Date(`${iso}T00:00:00Z`));
    return { iso, label };
  }
  const q = /^(\d{4})-?Q([1-4])$/i.exec(code);
  if (q) {
    const month = String((Number(q[2]) - 1) * 3 + 1).padStart(2, "0");
    return { iso: `${q[1]}-${month}-01`, label: `${q[1]} Q${q[2]}` };
  }
  return null;
}
