"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { RANGES, type RangeKey } from "@/lib/range";

export function RangeSelector({ active }: { active: RangeKey }) {
  const pathname = usePathname();
  const params = useSearchParams();

  function hrefFor(key: RangeKey): string {
    const next = new URLSearchParams(params?.toString() ?? "");
    if (key === "10y") next.delete("range");
    else next.set("range", key);
    const q = next.toString();
    return q ? `${pathname}?${q}` : pathname;
  }

  return (
    <div
      role="tablist"
      aria-label="Time range"
      className="inline-flex p-1 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-xs"
    >
      {RANGES.map((r) => {
        const isActive = r.key === active;
        return (
          <Link
            key={r.key}
            href={hrefFor(r.key)}
            scroll={false}
            role="tab"
            aria-selected={isActive}
            className={[
              "px-3 py-1 rounded-md font-medium transition-colors duration-150",
              isActive
                ? "bg-[var(--color-bg)] text-[var(--color-fg)] shadow-sm border border-[var(--color-border)]"
                : "text-[var(--color-muted)] hover:text-[var(--color-fg)]",
            ].join(" ")}
          >
            {r.label}
          </Link>
        );
      })}
    </div>
  );
}
