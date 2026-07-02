import type { Confidence } from "@/types";

/**
 * Compact reliability badge shown on cards and commitments. Four tones
 * matching the civic palette:
 *   high    — emerald (independent official statistics, no material caveats)
 *   medium  — accent (reliable source with known caveats)
 *   low     — amber (estimate/proxy with substantial limitations)
 *   none    — slate (no live measurement — commitment / placeholder / demo)
 */
export type ConfidenceLevel = Confidence | "none";

const label: Record<ConfidenceLevel, string> = {
  high: "High confidence",
  medium: "Medium confidence",
  low: "Low confidence",
  none: "No live metric",
};

const tone: Record<ConfidenceLevel, string> = {
  high: "bg-[var(--color-improving-soft)] text-[var(--color-improving)]",
  medium: "bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)]",
  low: "bg-[var(--color-watch-soft)] text-[var(--color-watch)]",
  none: "bg-[var(--color-neutral-soft)] text-[var(--color-neutral)]",
};

const dot: Record<ConfidenceLevel, string> = {
  high: "bg-[var(--color-improving)]",
  medium: "bg-[var(--color-accent)]",
  low: "bg-[var(--color-watch)]",
  none: "bg-[var(--color-neutral)]",
};

const explainer: Record<ConfidenceLevel, string> = {
  high: "Direct measurement from an authoritative independent statistical body; no material data-quality concerns.",
  medium: "Reliable source with known caveats (e.g. compositional effects, sampling limits, recent methodology change).",
  low: "Estimate or proxy with substantial known limitations; cross-reference with related metrics.",
  none: "No live measurement — commitment, target, or placeholder pending data integration.",
};

/**
 * The full compact badge, e.g. rendered next to a metric title.
 */
export function ConfidenceBadge({
  level,
  size = "sm",
  showLabel = true,
}: {
  level: ConfidenceLevel;
  size?: "xs" | "sm";
  showLabel?: boolean;
}) {
  const sizeClasses =
    size === "xs" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-xs";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md font-medium ${tone[level]} ${sizeClasses}`}
      title={explainer[level]}
    >
      <span
        aria-hidden="true"
        className={`inline-block w-1.5 h-1.5 rounded-full ${dot[level]}`}
      />
      {showLabel ? label[level] : label[level].split(" ")[0]}
    </span>
  );
}

/** Long-form row (used inside the EvidenceExplorer). */
export function ConfidenceExplainerRow({ level }: { level: ConfidenceLevel }) {
  return (
    <div className="flex items-start gap-3">
      <ConfidenceBadge level={level} />
      <p className="text-sm text-[var(--color-fg-secondary)] leading-relaxed">
        {explainer[level]}
      </p>
    </div>
  );
}
