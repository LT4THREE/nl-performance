import Link from "next/link";

/**
 * Primary navigation. Renamed from the old domain-first structure to a
 * topic-first structure. Kept the `DomainNav` filename + export so the
 * dozen pages that import it don't need to change in this commit — the
 * component itself has been reworked.
 */
export function DomainNav({ active }: { active?: string }) {
  return (
    <nav className="flex flex-wrap gap-1 text-sm" aria-label="Primary">
      <NavLink href="/" label="Home" active={active === "home"} />
      <NavLink href="/topics" label="Topics" active={active === "topics"} />
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
}: {
  href: string;
  label: string;
  active?: boolean;
}) {
  const base = "px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150";
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
      className={`${base} text-[var(--color-fg-soft)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-fg)]`}
    >
      {label}
    </Link>
  );
}
