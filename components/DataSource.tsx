import type { IndicatorDef } from "@/types";
import { providerLabel, sourceCitationUrl, sourceIdentifier } from "@/lib/indicators";

export function DataSource({
  indicator,
  label,
  asOf,
}: {
  indicator: IndicatorDef;
  label?: string;
  asOf?: string;
}) {
  const href = sourceCitationUrl(indicator);
  return (
    <p className="text-xs text-[var(--color-muted)]">
      Source:{" "}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-[var(--color-fg)]"
      >
        {providerLabel(indicator.provider)} · {sourceIdentifier(indicator)}
        {label ? ` — ${label}` : ""}
      </a>
      {asOf ? ` · last observation ${asOf}` : ""}
    </p>
  );
}
