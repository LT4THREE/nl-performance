# CLAUDE.md — Working rules for NL Performance

This is a **civic accountability platform**: it tracks the Dutch government's own
public goals against official statistics. Its entire value proposition is factual
integrity. A single confidently fabricated quote, cabinet name, statute identifier,
or budget figure destroys the credibility of everything else on the site.

**Read this file before any change to content, seed data, or types that touch
factual claims.** For framework specifics, see also
[AGENTS.md](./AGENTS.md) — the Next.js version in this repo has breaking changes
from earlier versions, and you must consult `node_modules/next/dist/docs/` when
touching routing, caching, metadata, or fetching semantics.

---

## Factual integrity rules

These are non-negotiable. They override elegance, completeness, and demo appeal.

### 1. No factual claims from memory

**Never** write a factual claim (a statistic, a quote from a government document,
a law identifier, a date, a target number, a budget figure) directly into code,
content files, or seed data from memory. Every factual claim must come from one
of:

- **a.** A live API response fetched by the data pipeline
  (CBS OData, ECB SDW, Eurostat JSON-stat).
- **b.** A source document you fetched and read in this session
  (WebFetch of `rijksoverheid.nl`, `wetten.overheid.nl`,
  `kabinetsformatie2025.nl`, ministry annual reports, etc.), with the exact URL
  recorded next to the claim.
- **c.** The existing verified content registry — today this means an
  indicator config in `data/indicators/*.ts` that resolves live from a provider,
  or content already flagged verified in-repo. See "Content model conventions"
  below for how `isDemo` currently expresses this.

### 2. When you can't verify, mark it

If you cannot fetch and confirm a source in-session, mark the claim as
unverified and it must render with the existing Demo / pending-verification
visual treatment. An honest **"pending verification"** label is acceptable;
a confident fabrication is the single worst failure this project can have.

The concrete mechanism today: set `isDemo: true` on the entry. This is wired
through `CommitmentCard`, `SaidVsShowsCard`, and `InputEntryCard`, each of which
renders an amber DEMO badge with a hover explainer. If you introduce a new
content type that can carry unverified claims, extend it with the same flag and
render the same badge.

### 3. Quotes are verbatim

Quotes from government documents must be verbatim from the fetched source, in
the original Dutch, with an English gloss allowed alongside. **Never paraphrase
inside quotation marks.** Record:

- `sourceUrl`
- document title
- publication date
- the date you verified it

The current `SaidVsShows.said` shape carries `quote`, `attribution`,
`sourceLabel`, and `sourceUrl`. Publication date and verification date should
be added when you extract a new verified quote.

### 4. Law references need BWBR identifiers

Law references must include the BWBR identifier from `wetten.overheid.nl`,
verified by fetching that page in-session. If you cannot fetch the page, do
not invent a BWBR ID. Use the law's common name with an `(identifier pending
verification)` suffix and link to `https://wetten.overheid.nl/` (the root,
not a fabricated deep link).

Current examples of correctly-marked unverified law references live in
`data/indicators/housing.ts` under `relatedLegislation`.

### 5. Every metric carries provenance

Every metric shown on the site must carry:

- **provider** (`cbs` | `ecb` | `eurostat`)
- **table / series identifier** (`cbsTable` / `dataflow`+`seriesKey` / `dataset`)
- **field name** (`valueField` / `seriesKey` component / dimension config)
- **observation period** (derived from the response, rendered by
  `formatPeriod` in `lib/format.ts`)
- **fetch timestamp** (`fetchedAt` from `fetchIndicatorWithTimestamp` in
  `lib/indicators.ts`)
- **deep link to the source table** (via `sourceCitationUrl` in
  `lib/indicators.ts`)

This is already implemented for every CBS/ECB/Eurostat indicator. **Preserve
and extend the pattern.** Do not bypass it, do not render a metric on the site
that lacks any of these fields.

### 6. Derived numbers are computed in code

When computing derived numbers (gaps, percentages, trends), compute them in
code from the fetched data. **Never hardcode a derived number.**

Concrete example: `lib/verdict.ts` `computeHousingVerdict()` computes the
absolute gap, percentage gap, and three-year trend direction from the live
`new-dwellings-added` series. The verdict hero renders those numbers only.
A hardcoded "20% behind" string somewhere in a component would be a
Rule 6 violation even if it happens to be arithmetically correct today.

---

## Content model conventions

*Verified against the codebase as of this file's creation.*

### Directory layout

```
app/                     — Next.js App Router routes (see "Route map" below)
components/              — All React components (both Server and Client)
data/
  domains.ts             — 6 legacy domains (economy, housing, climate,
                           social, education, health)
  topics.ts              — 15 canonical issue-area topics (housing,
                           cost-of-living, economy-work, healthcare,
                           education, immigration-asylum, crime-justice,
                           defence, climate-energy, agriculture-nitrogen,
                           infrastructure-transport, social-security-poverty,
                           public-finances, digital-government,
                           europe-foreign-affairs)
  planned.ts             — per-domain "planned next" indicator shortlist
  indicators/
    economy.ts           — economy-domain indicator configs
    housing.ts           — housing-domain indicator configs
    climate.ts
    social.ts
    education.ts
    health.ts
  goals/
    federal.json         — federal-level goals (Zod-validated at load)
  commitments/
    housing.json         — housing commitments (Zod-validated at load)
  said-vs-shows/
    housing.json         — Government-said vs Data-shows pairs
                           (Zod-validated at load)
  inputs/
    housing.ts           — housing input entries (federal funding, budget
                           lines) as a typed TS constant, not JSON
lib/
  providers/{cbs,ecb,eurostat}.ts   — one file per provider,
                                      each exporting a fetch<Provider>Series
  indicators.ts          — provider-dispatcher fetchIndicatorSeries,
                           fetchIndicatorWithTimestamp, summarize (strict YoY),
                           providerLabel, sourceCitationUrl, sourceIdentifier
  cbs.ts                 — thin back-compat shim for older imports
  cbs-labels.ts          — CBS Dutch enum → English translation
                           (ReasonDelivery, Frequency)
  all-indicators.ts      — flatten across the six domain registries;
                           findIndicator, indicatorsForTopic
  format.ts              — formatValue, formatDelta, formatPeriod,
                           formatNumber, decodeCbsPeriod
  goals.ts               — getAllGoals, getGoalsByDomain,
                           getGoalsForIndicator, filterGoals, progressPct.
                           Zod schema is defined here.
  commitments.ts         — getAllCommitments, getCommitmentsForTopic,
                           getCommitmentsForIndicator. Zod schema here.
  said-vs-shows.ts       — getSaidVsShowsForTopic. Zod schema here.
  hero.ts                — computeHeroDivergence (landing-page subhead)
  verdict.ts             — computeHousingVerdict (housing topic-page hero);
                           topic-specific for now
  range.ts               — chart date-range selector
  seo.ts                 — pageMetadata, indicatorMetadata, canonical
types/
  index.ts               — the union of all shared types
  said-vs-shows.ts       — SaidVsShows type only (isolated because it
                           imports TopicId from index.ts)
```

### How the verified / demo mechanism actually works today

The rules above talk about "verified" vs "unverified" as if it were a single
system. The current codebase implements it as `isDemo?: boolean` on **three**
content types:

| Type | File | Verified state | Unverified state |
|---|---|---|---|
| `Commitment` | `types/index.ts` | `isDemo` absent or false | `isDemo: true` |
| `SaidVsShows` | `types/said-vs-shows.ts` | `isDemo` absent or false | `isDemo: true` |
| `InputEntry` | `data/inputs/housing.ts` | `isDemo` absent or false | `isDemo: true` |

**Known asymmetry:** the `Goal` type in `types/index.ts` does **not** carry
`isDemo` today. Some goal entries in `data/goals/federal.json` describe their
own demo status inside the free-text `notes` field (see `housing-100k-2030`).
This is an inconsistency worth cleaning up: extend `Goal` with `isDemo?: boolean`
and render the same badge on `GoalCard`. Do this before adding new goals whose
provenance is unverified.

**Live-metric confidence is separate from demo status.** Every `IndicatorDef`
carries an optional `confidence: "high" | "medium" | "low"` field
(`types/index.ts`, `IndicatorBase`). The `ConfidenceBadge` component
(`components/ConfidenceBadge.tsx`) also supports a `"none"` variant for content
that has no live measurement. Confidence describes the reliability of a live
data series; `isDemo` describes the reliability of a political framing around
that data.

### Route map

Verified from `app/` layout:

```
/                              — app/page.tsx (landing)
/about                         — app/about/page.tsx
/goals                         — app/goals/page.tsx (with error.tsx)
/sources                       — app/sources/page.tsx
/topics                        — app/topics/page.tsx  (15-topic index)
/topics/[slug]                 — app/topics/[slug]/page.tsx
                                 (topic detail; slug = TopicId)
/{domain}                      — app/{domain}/page.tsx for domain in
                                 {economy, housing, climate, social,
                                 education, health}. Legacy per-domain
                                 landings; primary IA is /topics/*.
/{domain}/[indicator]          — app/{domain}/[indicator]/page.tsx
                                 Indicator deep-dives; still the canonical
                                 URL for individual metrics.
/sitemap.xml                   — app/sitemap.ts
/robots.txt                    — app/robots.ts
```

Topic → indicator wiring is via `TopicMeta.indicatorIds` in `data/topics.ts`,
cross-referenced through `lib/all-indicators.ts` `indicatorsForTopic()`.
Indicator detail pages under `/{domain}/[indicator]` also render an
Evidence Explorer (`components/EvidenceExplorer.tsx`) when the indicator
carries the extended evidence fields (`methodology`, `historicalContext`,
`revisionNotes`, `relatedLegislation`).

### Adding a new indicator (checklist)

1. **Probe the provider first.** For CBS OData, run
   `curl 'https://opendata.cbs.nl/ODataApi/OData/{table}/TypedDataSet?$top=2'`
   and verify the exact field name for the value column and the exact filter
   for the dimension slice you want. **Never guess a field name.**
2. Add an entry to `data/indicators/{domain}.ts`. Set `provider`, the
   provider-specific fields, `unit`, `frequency`, `higherIsBetter`,
   `topicIds`, `metricType`, `displayGroup`, `confidence`, `sourceType`,
   `whyItMatters`. Add `methodology` and `historicalContext` from
   documentation or from what the field itself shows.
3. Cross-reference from `data/topics.ts` (`TopicMeta.indicatorIds`) so it
   surfaces on the topic page.
4. If the indicator is the target of a goal or commitment, add its `id` to
   the corresponding `Goal.indicatorIds` or `Commitment.indicatorIds` array
   so `getGoalsForIndicator` / `getCommitmentsForIndicator` links back
   correctly.
5. `npm run build` and `npm run lint` before commit. One commit per
   indicator.

### Adding a new commitment or SaidVsShows entry

1. Fetch the source document. Record the exact URL, publication date, and
   verification date.
2. If the source is a coalition programme, ministerial letter (kamerbrief),
   Miljoenennota, or similar official document, quote verbatim in the
   original Dutch. English gloss goes outside the quotation marks.
3. Add the entry to `data/commitments/{topic}.json` or
   `data/said-vs-shows/{topic}.json` and cross-reference the linked indicator
   IDs.
4. If the source cannot be re-verified in this session, set `isDemo: true`
   and reframe the language to avoid specific unverifiable claims (see the
   current housing entries as examples).
5. `lib/commitments.ts` / `lib/said-vs-shows.ts` Zod-validate the JSON on
   load — a schema error at build time is the fail-safe.

---

## Engineering conventions

*Verified against `package.json`, `next.config.ts`, `tsconfig.json`, and the
source tree as of this file's creation.*

### Stack

- **Framework:** Next.js **16.2.6** (App Router). This is a breaking-change
  version — do not write App Router code from memory. Consult
  `node_modules/next/dist/docs/01-app/` before touching routing, caching,
  metadata, or fetching semantics. See [AGENTS.md](./AGENTS.md).
- **React:** 19.2.4
- **TypeScript:** 5.x, `strict: true`, `moduleResolution: "bundler"`, path
  alias `@/*` → repo root (`tsconfig.json`).
- **Styling:** Tailwind CSS v4 (`@tailwindcss/postcss ^4`, `tailwindcss ^4`).
  Design tokens are defined in `app/globals.css` under a single `@theme` block
  and consumed as CSS variables (`var(--color-fg)`, etc.).
- **Charts:** Recharts (`^3.8.1`) for interactive charts;
  hand-rolled SSR SVG for small charts (`Sparkline`, `TargetLineMiniChart`)
  where no client JS is desirable.
- **Validation:** Zod (`^4.4.3`) — every content JSON file is validated at
  the loader in `lib/{goals,commitments,said-vs-shows}.ts`.
- **Linting:** ESLint 9 with `eslint-config-next` 16.2.6 — run `npm run lint`.
- **Node scripts:** `next.config.ts` currently has no custom config beyond
  the type import.

### Data fetching pattern

- All provider fetches live in `lib/providers/{cbs,ecb,eurostat}.ts`. Each
  exports a `fetch<Provider>Series(indicator) → Promise<DataPoint[]>`
  function that:
  1. Builds the provider's URL from the indicator config.
  2. Calls the platform `fetch` with a `next: { revalidate: N }` option
     (CBS series 21600s / 6h; CBS TableInfos 86400s / 24h; ECB 21600s;
     Eurostat 86400s).
  3. Zod-validates the response shape.
  4. Decodes provider-specific period codes into ISO dates
     (`decodeCbsPeriod` in `lib/format.ts`; provider-specific decoders live
     inline for ECB and Eurostat).
  5. Returns `DataPoint[]` sorted ascending by ISO date.
- Server Components import `fetchIndicatorSeries` or
  `fetchIndicatorWithTimestamp` from `lib/indicators.ts`. **Do not** call the
  provider files directly from a page — the dispatcher exists so pages
  don't need to know the provider.
- Pages render as Server Components by default. Only mark a component
  `"use client"` when it needs `useState`, `useEffect`, event handlers, or
  the Next.js navigation hooks (`useSearchParams`, `usePathname`). A prior
  regression (`/goals` HTTP 500) was caused by exporting a non-component
  function from a `"use client"` module and importing it into a Server
  Component. **Non-component values must live in `lib/`, not in
  `components/*` that carries `"use client"`.**

### Route rendering strategy

Per the last `npm run build` output:

- `/`, `/about`, `/sources`, `/robots.txt`, `/sitemap.xml`, and the per-domain
  index pages (`/economy`, `/housing`, ...) are static (`○`) with ISR
  revalidation windows set in the route file.
- `/topics/[slug]` is SSG (`●`) via `generateStaticParams` over the 15
  `TopicId` values.
- `/goals` and the indicator detail routes (`/{domain}/[indicator]`) are
  dynamic (`ƒ`) — they read `searchParams`.
- New topic pages should generate all 15 slugs via
  `generateStaticParams()`.

### Deployment

- Vercel (production URL: `https://nl-performance-two.vercel.app`).
- Auto-deploys from `main`. No manual deploy step.
- No `vercel.json` in the repo — Vercel infers Next.js.
- No test suite is currently wired up. `npm run build` + `npm run lint` are
  the only automated checks. Add tests before landing revision-history or
  any feature that mutates state.

### Session discipline

Established over the past sessions and honored by every recent change:

- **One commit per item** in a work list. No batching unrelated changes.
- `npm run build` **and** `npm run lint` both pass before every commit.
- Print before/after for any number the change moves so the reviewer can
  audit.
- Halt at hard gates (build/lint failure two attempts in; a diagnostic
  hypothesis contradicted by a probe; a CBS field name that cannot be
  verified via `/DataProperties` + `/TypedDataSet`). Ask, don't guess.
