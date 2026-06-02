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

/**
 * Apply the three goal filters used on /goals. Lives in lib/ so server
 * components can call it directly — moving it into components/GoalFilters.tsx
 * (which is "use client") triggered a Next.js boundary error on import.
 */
export function filterGoals(
  goals: Goal[],
  active: {
    level?: Goal["level"] | "all";
    domain?: Goal["domain"] | "all";
    status?: Goal["status"] | "all";
  },
): Goal[] {
  return goals.filter((g) => {
    if (active.level && active.level !== "all" && g.level !== active.level) return false;
    if (active.domain && active.domain !== "all" && g.domain !== active.domain) return false;
    if (active.status && active.status !== "all" && g.status !== active.status) return false;
    return true;
  });
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
