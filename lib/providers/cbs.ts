import { z } from "zod";
import { decodeCbsPeriod } from "@/lib/format";
import type { CbsIndicator, DataPoint } from "@/types";

const CBS_BASE = "https://opendata.cbs.nl/ODataApi/OData";

const CbsResponseSchema = z.object({
  value: z.array(z.record(z.string(), z.unknown())),
});

const TableInfoSchema = z.object({
  value: z
    .array(
      z.object({
        Title: z.string().optional(),
        ShortTitle: z.string().optional(),
        Identifier: z.string().optional(),
        Modified: z.string().optional(),
        Period: z.string().optional(),
        Frequency: z.string().optional(),
        ReasonDelivery: z.string().optional(),
      }),
    )
    .min(1),
});

export type CbsTableInfo = z.infer<typeof TableInfoSchema>["value"][number];

export async function fetchCbsTableInfo(tableId: string): Promise<CbsTableInfo> {
  const url = `${CBS_BASE}/${tableId}/TableInfos`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error(`CBS TableInfos ${tableId}: ${res.status}`);
  const parsed = TableInfoSchema.parse(await res.json());
  return parsed.value[0];
}

export async function fetchCbsSeries(indicator: CbsIndicator): Promise<DataPoint[]> {
  const selectFields = [indicator.periodField, indicator.valueField].join(",");
  const params = new URLSearchParams();
  params.set("$select", selectFields);
  params.set("$filter", indicator.filter);

  const url = `${CBS_BASE}/${indicator.cbsTable}/TypedDataSet?${params.toString()}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 21600 },
  });
  if (!res.ok) throw new Error(`CBS ${indicator.cbsTable}: ${res.status}`);
  const parsed = CbsResponseSchema.parse(await res.json());

  const points: DataPoint[] = [];
  for (const row of parsed.value) {
    const periodCode = row[indicator.periodField];
    const raw = row[indicator.valueField];
    if (typeof periodCode !== "string") continue;
    if (raw === null || raw === undefined) continue;
    const value = typeof raw === "number" ? raw : Number(raw);
    if (!Number.isFinite(value)) continue;
    const decoded = decodeCbsPeriod(periodCode);
    if (!decoded) continue;
    points.push({ date: decoded.iso, value, periodLabel: decoded.label });
  }
  points.sort((a, b) => a.date.localeCompare(b.date));
  return points;
}
