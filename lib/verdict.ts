import type { DataPoint } from "@/types";

/**
 * Computes the housing-verdict fields shown in the hero panel from the
 * live new-dwellings-added series and the widely-referenced 100k/year target.
 * Kept side-effect-free and returns null when the series is too short so
 * the caller can decide how to degrade the UI.
 */
export type Verdict = {
  status: "on-track" | "watch" | "off-track" | "unknown";
  statusLabel: string;
  targetValue: number;
  targetLabel: string;
  latestValue: number;
  latestPeriod: string;
  absoluteGap: number;
  percentageGap: number;
  threeYearTrend: "improving" | "worsening" | "stable" | "unknown";
  threeYearSeries: { year: string; value: number }[];
  lastUpdatedIso: string;
};

export function computeHousingVerdict(
  points: DataPoint[],
  target: number = 100000,
): Verdict | null {
  if (points.length === 0) return null;
  const latest = points[points.length - 1];
  const latestValue = latest.value;
  const latestPeriod = latest.date.slice(0, 4);
  const absoluteGap = target - latestValue;
  const percentageGap = (absoluteGap / target) * 100;

  // Grab the last 3 annual points if available.
  const last3 = points.slice(-3);
  const threeYearSeries = last3.map((p) => ({
    year: p.date.slice(0, 4),
    value: p.value,
  }));

  let threeYearTrend: Verdict["threeYearTrend"] = "unknown";
  if (last3.length === 3) {
    const [a, b, c] = last3.map((p) => p.value);
    if (c > b && b > a) threeYearTrend = "improving";
    else if (c < b && b < a) threeYearTrend = "worsening";
    else threeYearTrend = "stable";
  }

  let status: Verdict["status"] = "unknown";
  let statusLabel = "Unknown";
  if (percentageGap <= 5) {
    status = "on-track";
    statusLabel = "On track";
  } else if (percentageGap <= 15) {
    status = "watch";
    statusLabel = "Watch";
  } else {
    status = "off-track";
    statusLabel = "Off track";
  }

  return {
    status,
    statusLabel,
    targetValue: target,
    targetLabel: `${target.toLocaleString("en-US")} dwellings / year`,
    latestValue,
    latestPeriod,
    absoluteGap,
    percentageGap,
    threeYearTrend,
    threeYearSeries,
    lastUpdatedIso: latest.date,
  };
}
