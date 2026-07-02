import { z } from "zod";
import type { SaidVsShows } from "@/types/said-vs-shows";
import type { TopicId } from "@/types";
import housing from "@/data/said-vs-shows/housing.json";

const TopicIdSchema = z.enum([
  "housing",
  "cost-of-living",
  "economy-work",
  "healthcare",
  "education",
  "immigration-asylum",
  "crime-justice",
  "defence",
  "climate-energy",
  "agriculture-nitrogen",
  "infrastructure-transport",
  "social-security-poverty",
  "public-finances",
  "digital-government",
  "europe-foreign-affairs",
]);

const SaidVsShowsSchema: z.ZodType<SaidVsShows> = z.object({
  id: z.string(),
  topicIds: z.array(TopicIdSchema),
  date: z.string(),
  said: z.object({
    quote: z.string(),
    attribution: z.string(),
    sourceLabel: z.string(),
    sourceUrl: z.string().url(),
  }),
  shows: z.object({
    finding: z.string(),
    indicatorIds: z.array(z.string()),
    dataSource: z.string(),
    dataSourceUrl: z.string().url(),
  }),
  synthesis: z.string(),
});

const AllSchema = z.array(SaidVsShowsSchema);

export function getAllSaidVsShows(): SaidVsShows[] {
  return AllSchema.parse(housing);
}

export function getSaidVsShowsForTopic(topicId: TopicId): SaidVsShows[] {
  return getAllSaidVsShows().filter((s) => s.topicIds.includes(topicId));
}
