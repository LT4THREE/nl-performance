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

export type IndicatorUnit = "percent" | "index" | "count" | "eurMillion" | "eurBillion";

export type IndicatorDef = {
  id: string;
  domain: Domain;
  label: string;
  shortLabel: string;
  description: string;
  /** CBS OData table identifier */
  cbsTable: string;
  /** OData $filter clause restricting to the headline series */
  filter: string;
  /** Field on TypedDataSet that holds the headline value */
  valueField: string;
  /** Field that holds the Periods code (usually "Perioden") */
  periodField: string;
  unit: IndicatorUnit;
  /** Whether higher = better (drives trend color) */
  higherIsBetter: boolean;
  /** Optional source-table status note (e.g. "Discontinued — historical only") */
  note?: string;
};

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
