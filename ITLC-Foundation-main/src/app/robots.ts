import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/sitemap-generator';

export const dynamic = 'force-dynamic';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/login/',
          '/dashboard/',
          '/checkout-test',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
