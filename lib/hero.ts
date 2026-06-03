import { getAllGoals } from "@/lib/goals";
import { formatNumber } from "@/lib/format";
import type { Goal } from "@/types";

/**
 * Pick the goal with the largest gap between current and target, and render
 * a one-sentence hero subhead from its live data. Returns null when no goal
 * has both current and target values (subhead falls back to static copy).
 */
export function computeHeroDivergence(): { sentence: string; goal: Goal } | null {
  const goals = getAllGoals();
  type Scored = { goal: Goal; behindPct: number };
  const scored: Scored[] = [];

  for (const g of goals) {
    if (!g.current) continue;
    if (g.status === "met" || g.status === "missed") continue;
    const t = g.target.value;
    const c = g.current.value;
    if (t === 0) continue;
    // For both positive targets (e.g. 100,000 homes) and negative ones (e.g.
    // -55% vs 1990), behindPct measures how far c is from t as a percent of t,
    // expressed positively when c is on the "wrong" side of t.
    const progressRatio = Math.abs(c) / Math.abs(t);
    const sameSign = Math.sign(c) === Math.sign(t) || c === 0;
    if (!sameSign) continue;
    if (progressRatio >= 1) continue;
    scored.push({ goal: g, behindPct: (1 - progressRatio) * 100 });
  }

  if (scored.length === 0) return null;
  scored.sort((a, b) => b.behindPct - a.behindPct);
  const { goal, behindPct } = scored[0];
  const t = goal.target;
  const c = goal.current!;
  const yr = c.asOf.slice(0, 4);
  const targetStr = `${formatNumber(t.value, { maximumFractionDigits: 1 })} ${t.unit}`;
  const currentStr = `${formatNumber(c.value, { maximumFractionDigits: 1 })} ${c.unit}`;
  const behindStr = `${formatNumber(behindPct, { maximumFractionDigits: 0 })}% behind plan`;
  const sentence = `${capFirst(goal.title)}. ${yr} actual: ${currentStr} (target: ${targetStr}). ${behindStr}.`;
  return { sentence, goal };
}

function capFirst(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}
