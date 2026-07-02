export type Domain = "economy" | "social" | "housing" | "climate" | "education" | "health";

export type DomainMeta = {
  id: Domain;
  label: string;
  description: string;
};

/**
 * Topics are the primary information architecture: how citizens think about
 * government performance. Each topic maps to one or more ministries and owns
 * a set of metrics (outcome / output / input).
 */
export type TopicId =
  | "housing"
  | "cost-of-living"
  | "economy-work"
  | "healthcare"
  | "education"
  | "immigration-asylum"
  | "crime-justice"
  | "defence"
  | "climate-energy"
  | "agriculture-nitrogen"
  | "infrastructure-transport"
  | "social-security-poverty"
  | "public-finances"
  | "digital-government"
  | "europe-foreign-affairs";

export type TopicMeta = {
  id: TopicId;
  label: string;
  shortLabel?: string;
  tagline: string;
  description: string;
  /** Related Dutch government bodies (ministries and independent agencies). */
  ministries: string[];
  /** IDs of indicators that appear on this topic. */
  indicatorIds: string[];
  /** IDs of goals that appear on this topic. */
  goalIds: string[];
  /** Existing domain(s) whose registries currently supply data for this topic. */
  legacyDomains: Domain[];
  /**
   * Editorial status: does the topic have live data today, or is it a
   * placeholder awaiting integration? Governs the "Data integration planned"
   * empty state.
   */
  status: "live" | "partial" | "planned";
};

/**
 * A metric's role in the outcome / output / input model. Governments often
 * claim success via inputs (money in) and outputs (things delivered);
 * citizens care about outcomes (what actually changed in society).
 */
export type MetricType = "outcome" | "output" | "input";

/**
 * Source reliability tier used on Evidence Explorer displays.
 *   official_statistics    — CBS, Eurostat, OECD, ECB (independent statistical bodies)
 *   audit                  — Rekenkamer, Ombudsman, inspectorates
 *   ministry_report        — jaarverslagen, policy progress letters
 *   parliamentary_document — Tweede Kamer / Eerste Kamer documents
 *   international_dataset  — World Bank / IMF / NATO / UN
 *   government_communication — press releases, social posts, speeches (NOT evidence)
 *   media                  — journalism
 *   other
 */
export type SourceType =
  | "official_statistics"
  | "audit"
  | "ministry_report"
  | "parliamentary_document"
  | "international_dataset"
  | "government_communication"
  | "media"
  | "other";

/** Analyst confidence in the metric — displayed as a small badge. */
export type Confidence = "high" | "medium" | "low";

export type DataPoint = {
  /** ISO date string at the start of the period (e.g. "2024-01-01") */
  date: string;
  /** Numeric observation */
  value: number;
  /** Human label for the period (e.g. "Jan 2024", "2024 Q1") */
  periodLabel: string;
};

export type IndicatorUnit = "percent" | "index" | "count" | "eurMillion" | "eurBillion" | "ktCO2eq";

export type Frequency = "monthly" | "quarterly" | "annual" | "daily";

export type Provider = "cbs" | "ecb" | "eurostat";

/** Shared metadata across every provider. */
type IndicatorBase = {
  id: string;
  domain: Domain;
  label: string;
  shortLabel: string;
  description: string;
  unit: IndicatorUnit;
  /** Native publication frequency. Used by formatPeriod and strict YoY. */
  frequency: Frequency;
  higherIsBetter: boolean;
  /** Optional inline caveat shown above the chart. */
  note?: string;
};

/** A CBS OData table-backed indicator. */
export type CbsIndicator = IndicatorBase & {
  provider: "cbs";
  cbsTable: string;
  /** OData $filter clause restricting to the headline series. */
  filter: string;
  /** Field on TypedDataSet that holds the headline value. */
  valueField: string;
  /** Field that holds the Periods code (usually "Perioden"). */
  periodField: string;
};

/** An ECB SDMX series-backed indicator. */
export type EcbIndicator = IndicatorBase & {
  provider: "ecb";
  /** SDMX dataflow id, e.g. "FM" (financial market). */
  dataflow: string;
  /** Full series key with dimensions, e.g. "D.U2.EUR.4F.KR.DFR.LEV". */
  seriesKey: string;
};

/** A Eurostat JSON-stat dataset-backed indicator. */
export type EurostatIndicator = IndicatorBase & {
  provider: "eurostat";
  /** Eurostat dataset code, e.g. "prc_hicp_manr". */
  dataset: string;
  /** Dimension filters as query-string entries (excluding 'time'). */
  dimensions: Record<string, string | string[]>;
  /** Display the value as a derived index relative to the value in this year. */
  baselineYear?: number;
};

export type IndicatorDef = CbsIndicator | EcbIndicator | EurostatIndicator;

export type GoalLevel = "federal" | "provincial" | "municipal";
export type GoalStatus = "on-track" | "behind" | "met" | "missed" | "unknown";

export type Goal = {
  id: string;
  title: string;
  level: GoalLevel;
  domain: Domain;
  source: {
    document: string;
    url?: string;
    page?: number;
  };
  target: {
    value: number;
    unit: string;
    deadline: string; // ISO date
  };
  current?: {
    value: number;
    unit: string;
    asOf: string; // ISO date
    sourceUrl?: string;
  };
  status: GoalStatus;
  notes?: string;
  /**
   * Indicator IDs whose measurement is the direct metric of this goal.
   * When present, the goal is only shown as 'Related' on those indicator
   * detail pages — not on every indicator in the same domain. Omit or
   * leave empty when no live indicator exists yet; the goal still appears
   * on /goals regardless.
   */
  indicatorIds?: string[];
};
