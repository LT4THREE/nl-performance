import Link from "next/link";
import { domains, enabledDomains } from "@/data/domains";

export function DomainNav({ active }: { active?: string }) {
  return (
    <nav className="flex flex-wrap gap-1 text-sm" aria-label="Primary">
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
      <NavLink href="/sources" label="Sources" active={active === "sources"} />
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
    "px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150";
  if (disabled || !href) {
    return (
      <span
        className={`${base} text-[var(--color-muted)]/70 cursor-not-allowed`}
        title="Coming soon"
        aria-disabled="true"
      >
        {label}
      </span>
    );
  }
  if (active) {
    return (
      <Link
        href={href}
        className={`${base} bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)]`}
        aria-current="page"
      >
        {label}
      </Link>
    );
  }
  return (
    <Link
      href={href}
      className={`${base} text-[var(--color-fg-soft)] hover:bg-[var(--color-surface)] hover:text-[var(--color-fg)]`}
    >
      {label}
    </Link>
  );
}
