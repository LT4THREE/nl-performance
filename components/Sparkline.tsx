import type { DataPoint } from "@/types";

type Props = {
  data: DataPoint[];
  width?: number;
  height?: number;
  /** Maximum number of points sampled into the sparkline. */
  maxPoints?: number;
  /** Anchor a 5-year window on the latest point unless overridden. */
  windowYears?: number;
};

/**
 * Server-rendered inline SVG sparkline. No client JS. Used in KpiCard.
 * Single accent stroke + a faint horizontal line at the series median.
 */
export function Sparkline({
  data,
  width = 120,
  height = 36,
  maxPoints = 60,
  windowYears = 5,
}: Props) {
  if (data.length < 2) return null;

  const latestDate = new Date(data[data.length - 1].date);
  const cutoff = new Date(
    Date.UTC(latestDate.getUTCFullYear() - windowYears, latestDate.getUTCMonth(), 1),
  );
  const cutoffIso = cutoff.toISOString().slice(0, 10);
  const windowed = data.filter((p) => p.date >= cutoffIso);
  const series = windowed.length >= 2 ? windowed : data;

  // Downsample to <= maxPoints by simple stride.
  const stride = Math.max(1, Math.ceil(series.length / maxPoints));
  const sampled = series.filter((_, i) => i % stride === 0);
  if (sampled[sampled.length - 1] !== series[series.length - 1]) {
    sampled.push(series[series.length - 1]);
  }

  const values = sampled.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const sorted = [...values].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];

  const padX = 1;
  const padY = 2;
  const w = width - 2 * padX;
  const h = height - 2 * padY;

  const x = (i: number) => padX + (i / Math.max(1, sampled.length - 1)) * w;
  const y = (v: number) => padY + h - ((v - min) / range) * h;
  const medianY = y(median);

  const d = sampled
    .map((p, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(p.value).toFixed(1)}`)
    .join(" ");

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Sparkline of ${sampled.length} observations`}
      className="shrink-0"
    >
      <line
        x1={padX}
        x2={width - padX}
        y1={medianY}
        y2={medianY}
        stroke="var(--color-border)"
        strokeDasharray="2 2"
        strokeWidth={0.5}
      />
      <path d={d} fill="none" stroke="var(--color-accent)" strokeWidth={1.5} />
    </svg>
  );
}
