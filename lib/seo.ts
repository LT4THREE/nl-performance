import type { Metadata } from "next";
import type { DataPoint, IndicatorDef } from "@/types";
import { formatValue, formatDelta } from "@/lib/format";

const SITE = "https://nl-performance-two.vercel.app";

/** Build a canonical URL for a path, used in OG and <link rel="canonical">. */
export function canonical(path: string): string {
  return `${SITE}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Per-indicator generateMetadata payload. */
export function indicatorMetadata(
  indicator: IndicatorDef,
  latest: DataPoint | null,
  yoyDeltaForDisplay: number | null,
  path: string,
): Metadata {
  const valueStr = latest ? formatValue(latest.value, indicator.unit) : null;
  const periodStr = latest?.periodLabel;
  const yoyStr =
    yoyDeltaForDisplay !== null
      ? `${yoyDeltaForDisplay > 0 ? "+" : ""}${formatDelta(yoyDeltaForDisplay, indicator.unit)} YoY`
      : null;

  const titleHead = valueStr && periodStr ? `${indicator.label} — ${valueStr} (${periodStr})` : indicator.label;
  const descParts: string[] = [];
  if (valueStr && periodStr) descParts.push(`Latest: ${valueStr} as of ${periodStr}.`);
  if (yoyStr) descParts.push(yoyStr.replace("YoY", "year-on-year change."));
  descParts.push(indicator.description);

  return {
    title: titleHead,
    description: descParts.join(" "),
    alternates: { canonical: canonical(path) },
    openGraph: {
      title: titleHead,
      description: descParts.join(" "),
      type: "article",
      url: canonical(path),
    },
    twitter: {
      card: "summary_large_image",
      title: titleHead,
      description: descParts.join(" "),
    },
  };
}

/** Static page metadata helper. */
export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: canonical(opts.path) },
    openGraph: {
      title: opts.title,
      description: opts.description,
      type: "website",
      url: canonical(opts.path),
    },
    twitter: {
      card: "summary",
      title: opts.title,
      description: opts.description,
    },
  };
}
