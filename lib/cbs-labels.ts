/**
 * Translate and split CBS Dutch enum tokens used in TableInfos.
 *
 * CBS returns ReasonDelivery (publication status) and Frequency as
 * CamelCase-concatenated tokens, e.g. "ActualiseringBijzonder" or "Permaand".
 * We split on capital-letter boundaries, translate each token, and join with
 * " · " so both the structure and the meaning are clear.
 */

const DICT: Record<string, string> = {
  Actualisering: "Updating",
  Bijzonder: "Special note",
  Stopgezet: "Discontinued",
  Actief: "Active",
  Revisie: "Revised",
  Nieuw: "New",
  Verbetering: "Improvement",
  Permaand: "Monthly",
  Perkwartaal: "Quarterly",
  Perjaar: "Annual",
  Perdriejaar: "Three-yearly",
  Pertweejaar: "Two-yearly",
  Eenmalig: "One-off",
  Onregelmatig: "Irregular",
};

/** Split a CamelCase-concatenated CBS enum into its component tokens. */
function splitCbsEnum(raw: string): string[] {
  if (!raw) return [];
  // Insert a space before each uppercase letter that follows a lowercase one,
  // then split on whitespace. Preserves the original casing.
  return raw
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Render a CBS enum value with both the original Dutch tokens and their
 * English translation, e.g. "Actualisering · Bijzonder (Updating · Special note)".
 * If we have no translation for a token, the Dutch is shown alone.
 */
export function formatCbsEnum(raw: string | undefined): string {
  if (!raw) return "—";
  const tokens = splitCbsEnum(raw);
  if (tokens.length === 0) return raw;
  const dutch = tokens.join(" · ");
  const translated = tokens.map((t) => DICT[t]).filter(Boolean);
  if (translated.length === tokens.length) {
    return `${dutch} (${translated.join(" · ")})`;
  }
  return dutch;
}

/** Lower-case classification used to pick the status pill color. */
export function cbsEnumKind(raw: string | undefined): "active" | "warning" | "neutral" {
  if (!raw) return "neutral";
  const t = raw.toLowerCase();
  if (t.includes("stopgezet")) return "warning";
  if (t.includes("actief") || t.includes("actualisering") || t.includes("nieuw"))
    return "active";
  return "neutral";
}
