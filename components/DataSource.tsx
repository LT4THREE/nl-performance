export function DataSource({
  tableId,
  label,
  asOf,
}: {
  tableId: string;
  label?: string;
  asOf?: string;
}) {
  const href = `https://opendata.cbs.nl/statline/#/CBS/nl/dataset/${tableId}/table`;
  return (
    <p className="text-xs text-[var(--color-muted)]">
      Source:{" "}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-[var(--color-fg)]"
      >
        CBS table {tableId}
        {label ? ` — ${label}` : ""}
      </a>
      {asOf ? ` · last observation ${asOf}` : ""}
    </p>
  );
}
