import { z } from "zod";
import type { Commitment, TopicId } from "@/types";
import housingCommitments from "@/data/commitments/housing.json";

const CommitmentSchema: z.ZodType<Commitment> = z.object({
  id: z.string(),
  title: z.string(),
  exactPromiseText: z.string(),
  type: z.enum([
    "coalition_agreement",
    "statutory_law",
    "election_manifesto",
    "international_treaty",
    "government_program",
  ]),
  level: z.enum(["federal", "provincial", "municipal"]),
  owner: z.string(),
  yearMade: z.number().int(),
  topicIds: z.array(
    z.enum([
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
    ]),
  ),
  source: z.object({
    document: z.string(),
    url: z.string().url().optional(),
    page: z.number().int().optional(),
  }),
  target: z.object({
    value: z.number(),
    unit: z.string(),
    deadline: z.string(),
  }),
  indicatorIds: z.array(z.string()),
  governmentActionStatus: z.enum([
    "no_action",
    "announced",
    "legislation_drafted",
    "legislation_passed",
    "implementation_underway",
    "delivered",
    "abandoned",
  ]),
  outcomeStatus: z.enum(["on-track", "behind", "met", "missed", "unknown"]),
  notes: z.string().optional(),
});

const CommitmentsSchema = z.array(CommitmentSchema);

/**
 * All curated commitments across the platform. Today: 3 housing
 * commitments. Grows as we curate other topic areas.
 */
export function getAllCommitments(): Commitment[] {
  return CommitmentsSchema.parse(housingCommitments);
}

export function getCommitmentsForTopic(topicId: TopicId): Commitment[] {
  return getAllCommitments().filter((c) => c.topicIds.includes(topicId));
}

export function getCommitmentsForIndicator(indicatorId: string): Commitment[] {
  return getAllCommitments().filter((c) => c.indicatorIds.includes(indicatorId));
}
