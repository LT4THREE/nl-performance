export type Domain = "economy" | "social" | "housing" | "climate" | "education" | "health";

export type DomainMeta = {
  id: Domain;
  label: string;
  description: string;
};

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
};
