/**
 * Backwards-compatible shim. All new code should import from
 * `@/lib/indicators` and `@/lib/providers/*`. This file re-exports the helpers
 * a few places already depend on.
 */
export {
  fetchCbsTableInfo as fetchTableInfo,
  fetchCbsSeries,
} from "@/lib/providers/cbs";
export type { CbsTableInfo } from "@/lib/providers/cbs";
export { fetchIndicatorSeries, summarize } from "@/lib/indicators";
