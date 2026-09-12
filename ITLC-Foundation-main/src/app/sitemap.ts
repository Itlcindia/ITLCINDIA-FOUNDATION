import { MetadataRoute } from 'next';
import { getSitemapEntries } from '@/lib/sitemap-generator';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour with on-demand revalidation

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await getSitemapEntries();

  return entries.map((entry) => ({
    url: entry.url,
    lastModified: entry.lastModified,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
