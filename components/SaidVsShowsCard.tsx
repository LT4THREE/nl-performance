import type { SaidVsShows } from "@/types/said-vs-shows";

/**
 * Renders a single "Government said" vs "Data shows" pairing.
 *
 * Tone rules (per the product principles):
 *   - factual
 *   - not sarcastic, not accusatory
 *   - both sides get equal visual weight
 *   - synthesis is neutral: describes the relationship, doesn't judge it
 */
export function SaidVsShowsCard({ item }: { item: SaidVsShows }) {
  const date = new Date(item.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--color-border)]">
        {/* SAID */}
        <div className="p-6 space-y-3">
          <header className="flex items-baseline gap-2">
            <span className="text-xs uppercase tracking-wide font-semibold text-[var(--color-fg-secondary)]">
              Government said
            </span>
            <span className="text-xs text-[var(--color-muted)]">· {date}</span>
          </header>
          <blockquote className="text-[var(--color-fg)] leading-relaxed italic text-[15px]">
            &ldquo;{item.said.quote}&rdquo;
          </blockquote>
          <p className="text-xs text-[var(--color-fg-secondary)] leading-snug">
            <span className="font-medium">{item.said.attribution}</span>
          </p>
          <a
            href={item.said.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-xs font-medium text-[var(--color-accent-strong)] hover:text-[var(--color-accent)]"
          >
            {item.said.sourceLabel} →
          </a>
        </div>

        {/* SHOWS */}
        <div className="p-6 space-y-3 bg-[var(--color-surface-subtle)]">
          <header>
            <span className="text-xs uppercase tracking-wide font-semibold text-[var(--color-fg-secondary)]">
              Data shows
            </span>
          </header>
          <p className="text-[var(--color-fg)] leading-relaxed text-[15px]">
            {item.shows.finding}
          </p>
          <p className="text-xs text-[var(--color-fg-secondary)] leading-snug">
            <span className="font-medium">Source:</span> {item.shows.dataSource}
          </p>
          <a
            href={item.shows.dataSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-xs font-medium text-[var(--color-accent-strong)] hover:text-[var(--color-accent)]"
          >
            Open the underlying data →
          </a>
        </div>
      </div>

      <footer className="border-t border-[var(--color-border)] px-6 py-4 bg-[var(--color-bg)]">
        <p className="text-sm text-[var(--color-fg-soft)] leading-relaxed">
          <span className="text-xs uppercase tracking-wide font-semibold text-[var(--color-muted)] mr-2">
            Reading
          </span>
          {item.synthesis}
        </p>
      </footer>
    </article>
  );
}
