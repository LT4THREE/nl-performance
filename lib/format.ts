import type { IndicatorUnit } from "@/types";

const nl = "nl-NL";

export function formatNumber(value: number, opts?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(nl, opts).format(value);
}

export function formatValue(value: number, unit: IndicatorUnit): string {
  switch (unit) {
    case "percent":
      return `${formatNumber(value, { maximumFractionDigits: 1 })}%`;
    case "index":
      return formatNumber(value, { maximumFractionDigits: 1 });
    case "count":
      return formatNumber(value, { maximumFractionDigits: 0 });
    case "eurMillion":
      return `€${formatNumber(value, { maximumFractionDigits: 0 })} M`;
    case "eurBillion":
      return `€${formatNumber(value, { maximumFractionDigits: 1 })} B`;
    case "ktCO2eq":
      return `${formatNumber(value, { maximumFractionDigits: 0 })} kt CO₂eq`;
  }
}

export function formatDelta(delta: number, unit: IndicatorUnit): string {
  const sign = delta > 0 ? "+" : delta < 0 ? "" : "";
  if (unit === "percent" || unit === "index") {
    return `${sign}${formatNumber(delta, { maximumFractionDigits: 1 })} pt`;
  }
  return `${sign}${formatNumber(delta, { maximumFractionDigits: 1 })}%`;
}

export function formatPeriod(iso: string): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(nl, { month: "short", year: "numeric" }).format(d);
}

/**
 * Decode CBS "Perioden" codes into ISO start-of-period dates + labels.
 * Examples:
 *   "2024JJ00"   → annual 2024
 *   "2024MM03"   → March 2024
 *   "2024KW02"   → 2024 Q2
 */
export function decodeCbsPeriod(code: string): { iso: string; label: string } | null {
  const trimmed = code.trim();
  const yearStr = trimmed.slice(0, 4);
  const kind = trimmed.slice(4, 6);
  const num = parseInt(trimmed.slice(6, 8), 10);
  const year = parseInt(yearStr, 10);
  if (!Number.isFinite(year)) return null;

  if (kind === "JJ") {
    return { iso: `${year}-01-01`, label: String(year) };
  }
  if (kind === "MM" && Number.isFinite(num)) {
    const mm = String(num).padStart(2, "0");
    const label = new Intl.DateTimeFormat(nl, {
      month: "short",
      year: "numeric",
    }).format(new Date(`${year}-${mm}-01T00:00:00Z`));
    return { iso: `${year}-${mm}-01`, label };
  }
  if (kind === "KW" && Number.isFinite(num)) {
    const startMonth = String((num - 1) * 3 + 1).padStart(2, "0");
    return { iso: `${year}-${startMonth}-01`, label: `${year} Q${num}` };
  }
  return null;
}
