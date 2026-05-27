import Link from "next/link";
import { domains, enabledDomains } from "@/data/domains";

export function DomainNav({ active }: { active?: string }) {
  return (
    <nav className="flex flex-wrap gap-1 text-sm">
      <NavLink href="/" label="Home" active={active === "home"} />
      {domains.map((d) => {
        const enabled = enabledDomains.has(d.id);
        const href = enabled ? `/${d.id}` : undefined;
        return (
          <NavLink
            key={d.id}
            href={href}
            label={d.label}
            active={active === d.id}
            disabled={!enabled}
          />
        );
      })}
      <NavLink href="/goals" label="Goals" active={active === "goals"} />
      <NavLink href="/about" label="About" active={active === "about"} />
    </nav>
  );
}

function NavLink({
  href,
  label,
  active,
  disabled,
}: {
  href?: string;
  label: string;
  active?: boolean;
  disabled?: boolean;
}) {
  const base =
    "px-3 py-1.5 rounded-md transition-colors text-sm font-medium";
  if (disabled || !href) {
    return (
      <span
        className={`${base} text-[var(--color-muted)] cursor-not-allowed`}
        title="Coming soon"
        aria-disabled="true"
      >
        {label}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className={`${base} ${
        active
          ? "bg-[var(--color-fg)] text-[var(--color-bg)]"
          : "hover:bg-[var(--color-surface)]"
      }`}
      aria-current={active ? "page" : undefined}
    >
      {label}
    </Link>
  );
}
