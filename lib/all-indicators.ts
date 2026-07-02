import type { IndicatorDef, TopicId } from "@/types";
import { economyIndicators } from "@/data/indicators/economy";
import { housingIndicators } from "@/data/indicators/housing";
import { climateIndicators } from "@/data/indicators/climate";
import { socialIndicators } from "@/data/indicators/social";
import { educationIndicators } from "@/data/indicators/education";
import { healthIndicators } from "@/data/indicators/health";

/** All live indicators flattened, so topic pages can query by topicId. */
export const allIndicators: IndicatorDef[] = [
  ...economyIndicators,
  ...housingIndicators,
  ...climateIndicators,
  ...socialIndicators,
  ...educationIndicators,
  ...healthIndicators,
];

export function findIndicator(id: string): IndicatorDef | undefined {
  return allIndicators.find((i) => i.id === id);
}

export function indicatorsForTopic(topicId: TopicId): IndicatorDef[] {
  return allIndicators.filter((i) => i.topicIds?.includes(topicId));
}
