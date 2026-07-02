/**
 * Compact SSR SVG chart: 3–5 annual observations plotted against a
 * horizontal target line. No client JS. Filled in properly in item 3.
 */
export function TargetLineMiniChart({
  series,
  target,
}: {
  series: { year: string; value: number }[];
  target: number;
}) {
  if (series.length === 0) return null;

  const width = 400;
  const height = 90;
  const padX = 40;
  const padTop = 8;
  const padBottom = 22;

  const yMin = 0;
  const yMax = Math.max(target * 1.05, ...series.map((s) => s.value));
  const yRange = yMax - yMin;

  const usableW = width - padX * 2;
  const usableH = height - padTop - padBottom;

  const stepX = usableW / Math.max(1, series.length - 1);
  const x = (i: number) => padX + i * stepX;
  const y = (v: number) => padTop + usableH - ((v - yMin) / yRange) * usableH;

  const targetY = y(target);
  const path = series
    .map((s, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(s.value).toFixed(1)}`)
    .join(" ");

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        role="img"
        aria-label={`New dwellings ${series.map((s) => s.year + ": " + s.value.toLocaleString()).join(", ")}. Target line at ${target.toLocaleString()}.`}
      >
        {/* Target line */}
        <line
          x1={padX}
          x2={width - padX}
          y1={targetY}
          y2={targetY}
          stroke="var(--color-worsening)"
          strokeWidth={1}
          strokeDasharray="4 3"
        />
        <text
          x={width - padX}
          y={targetY - 4}
          textAnchor="end"
          fontSize={10}
          fill="var(--color-worsening)"
          fontWeight={600}
        >
          Target {target.toLocaleString()}
        </text>

        {/* Series line */}
        <path
          d={path}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={1.75}
          strokeLinejoin="round"
        />

        {/* Points */}
        {series.map((s, i) => (
          <g key={s.year}>
            <circle cx={x(i)} cy={y(s.value)} r={3} fill="var(--color-accent)" />
            <text
              x={x(i)}
              y={y(s.value) - 8}
              textAnchor="middle"
              fontSize={10}
              fill="var(--color-fg)"
              fontWeight={600}
            >
              {s.value.toLocaleString("en-US")}
            </text>
            <text
              x={x(i)}
              y={height - 6}
              textAnchor="middle"
              fontSize={10}
              fill="var(--color-muted)"
            >
              {s.year}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
