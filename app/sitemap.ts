import type { MetadataRoute } from "next";
import { economyIndicators } from "@/data/indicators/economy";
import { housingIndicators } from "@/data/indicators/housing";
import { climateIndicators } from "@/data/indicators/climate";
import { socialIndicators } from "@/data/indicators/social";
import { educationIndicators } from "@/data/indicators/education";
import { healthIndicators } from "@/data/indicators/health";

const SITE = "https://nl-performance-two.vercel.app";

/**
 * Auto-generated sitemap. Includes every static page plus one entry per
 * indicator detail page derived from the live indicator registries — so
 * adding an indicator to data/indicators/*.ts wires it into the sitemap
 * without any further work.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE}/economy`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/housing`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/climate`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/social`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/education`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/health`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/goals`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/sources`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const indicatorPages: MetadataRoute.Sitemap = [
    ...economyIndicators.map((i) => ({ path: `/economy/${i.id}`, freq: "daily" as const })),
    ...housingIndicators.map((i) => ({ path: `/housing/${i.id}`, freq: "daily" as const })),
    ...climateIndicators.map((i) => ({ path: `/climate/${i.id}`, freq: "weekly" as const })),
    ...socialIndicators.map((i) => ({ path: `/social/${i.id}`, freq: "weekly" as const })),
    ...educationIndicators.map((i) => ({ path: `/education/${i.id}`, freq: "weekly" as const })),
    ...healthIndicators.map((i) => ({ path: `/health/${i.id}`, freq: "weekly" as const })),
  ].map(({ path, freq }) => ({
    url: `${SITE}${path}`,
    lastModified: now,
    changeFrequency: freq,
    priority: 0.7,
  }));

  return [...staticPages, ...indicatorPages];
}
