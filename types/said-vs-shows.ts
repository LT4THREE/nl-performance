import type { TopicId } from ".";

/**
 * A curated pairing of a specific government communication with a specific
 * measured outcome from the same time window. The point is to make the gap
 * — or agreement — between rhetoric and reality visible in a factual,
 * non-sarcastic way. Sourced entries only; the platform never invents
 * quotes.
 */
export type SaidVsShows = {
  id: string;
  topicIds: TopicId[];
  date: string; // ISO date the communication was published
  said: {
    /** Verbatim quote in original language (Dutch by default). */
    quote: string;
    /** Who said it (person + role + body). */
    attribution: string;
    /** Where the quote is published — press release, tweet, kamerbrief, speech. */
    sourceLabel: string;
    sourceUrl: string;
  };
  shows: {
    /** Plain-English description of what the data says for the same window. */
    finding: string;
    /** Indicator id(s) this cites. */
    indicatorIds: string[];
    /** Where the data came from. */
    dataSource: string;
    dataSourceUrl: string;
  };
  /** Neutral one-sentence framing: how do the two relate? */
  synthesis: string;
  /**
   * Set to true when the 'said' quotation, attribution, or source URL has
   * NOT been independently verified. UI shows a clear DEMO badge. The
   * 'shows' side (real CBS/ECB/Eurostat numbers) is always real.
   */
  isDemo?: boolean;
};
