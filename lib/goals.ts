import { z } from "zod";
import federalGoals from "@/data/goals/federal.json";
import type { Goal } from "@/types";

const GoalSchema: z.ZodType<Goal> = z.object({
  id: z.string(),
  title: z.string(),
  level: z.enum(["federal", "provincial", "municipal"]),
  domain: z.enum(["economy", "social", "housing", "climate", "education", "health"]),
  source: z.object({
    document: z.string(),
    url: z.string().url().optional(),
    page: z.number().int().optional(),
  }),
  target: z.object({
    value: z.number(),
    unit: z.string(),
    deadline: z.string(),
  }),
  current: z
    .object({
      value: z.number(),
      unit: z.string(),
      asOf: z.string(),
      sourceUrl: z.string().url().optional(),
    })
    .optional(),
  status: z.enum(["on-track", "behind", "met", "missed", "unknown"]),
  notes: z.string().optional(),
});

const GoalsSchema = z.array(GoalSchema);

export function getAllGoals(): Goal[] {
  return GoalsSchema.parse(federalGoals);
}

export function getGoalsByDomain(domain: Goal["domain"]): Goal[] {
  return getAllGoals().filter((g) => g.domain === domain);
}

export function progressPct(goal: Goal): number | null {
  if (!goal.current) return null;
  // Naive linear progress: current / target, clamped to [0, 100].
  // Works for "build N homes" type targets; less meaningful for percent-change
  // targets — UI should treat as illustrative.
  if (goal.target.value === 0) return null;
  const pct = (goal.current.value / goal.target.value) * 100;
  if (!Number.isFinite(pct)) return null;
  return Math.max(0, Math.min(100, pct));
}
