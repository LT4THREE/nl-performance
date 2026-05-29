import type { DataPoint } from "@/types";

export type RangeKey = "1y" | "5y" | "10y" | "all";

export const RANGES: { key: RangeKey; label: string }[] = [
  { key: "1y", label: "1Y" },
  { key: "5y", label: "5Y" },
  { key: "10y", label: "10Y" },
  { key: "all", label: "All" },
];

const DEFAULT_RANGE: RangeKey = "10y";

export function normalizeRange(raw: string | undefined): RangeKey {
  if (raw === "1y" || raw === "5y" || raw === "10y" || raw === "all") return raw;
  return DEFAULT_RANGE;
}

export function filterByRange(points: DataPoint[], range: RangeKey): DataPoint[] {
  if (range === "all" || points.length === 0) return points;
  const years = range === "1y" ? 1 : range === "5y" ? 5 : 10;
  // Anchor cutoff to the latest point's date rather than "now" so we keep
  // a meaningful window even when the most recent observation is months old.
  const latest = new Date(points[points.length - 1].date);
  const cutoff = new Date(
    Date.UTC(latest.getUTCFullYear() - years, latest.getUTCMonth(), 1),
  );
  const cutoffIso = cutoff.toISOString().slice(0, 10);
  return points.filter((p) => p.date >= cutoffIso);
}
