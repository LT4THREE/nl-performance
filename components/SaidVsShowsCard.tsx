import type { SaidVsShows } from "@/types/said-vs-shows";

/**
 * Renders a single "Government said" vs "Data shows" pairing.
 *
 * Tone rules (per the product principles):
 *   - factual
 *   - not sarcastic, not accusatory
 *   - both sides get equal visual weight
 *   - synthesis is neutral: describes the relationship, doesn't judge it
 *
 * Layout (per item 8):
 *   left column   — statement / promise
 *   right column  — measured reality
 *   bottom band   — neutral interpretation
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
        {/* LEFT — Government said */}
        <div className="p-6 space-y-3">
          <header className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)]">
              <span
                aria-hidden="true"
                className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]"
              />
              Government said
            </span>
            <span className="text-xs text-[var(--color-muted)]">· {date}</span>
            {item.isDemo && (
              <span
                className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-[var(--color-watch-soft)] text-[var(--color-watch)]"
                title="Attribution and verbatim wording not independently re-verified. The 'Data shows' side is real CBS data."
              >
                Demo
              </span>
            )}
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

        {/* RIGHT — Data shows */}
        <div className="p-6 space-y-3 bg-[var(--color-surface-subtle)]">
          <header className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide bg-[var(--color-improving-soft)] text-[var(--color-improving)]">
              <span
                aria-hidden="true"
                className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-improving)]"
              />
              Data shows
            </span>
            <span className="text-xs text-[var(--color-muted)]">Live official statistics</span>
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

      {/* BOTTOM band — neutral interpretation */}
      <footer className="border-t border-[var(--color-border)] px-6 py-4 bg-[var(--color-bg)]">
        <div className="flex items-start gap-3">
          <span className="text-[10px] uppercase tracking-wide font-semibold text-[var(--color-muted)] pt-1 shrink-0">
            Neutral reading
          </span>
          <p className="text-sm text-[var(--color-fg-soft)] leading-relaxed">
            {item.synthesis}
          </p>
        </div>
      </footer>
    </article>
  );
}
