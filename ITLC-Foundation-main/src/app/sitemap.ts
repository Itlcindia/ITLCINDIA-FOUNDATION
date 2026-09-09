import { MetadataRoute } from 'next';
import { BLOG_POSTS } from '@/data/blog-posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://itlcfoundation.org';
  const currentDate = new Date().toISOString();

  // Core Static Pages
  const staticRoutes: { path: string; priority: number; changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' }[] = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/about', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/projects', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/services', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/paryavaran-sanrakshan', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/animal-welfare', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/women-empowerment', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/education', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/clean-water', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/social-welfare', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/gallery', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/blog', priority: 0.9, changeFrequency: 'daily' },
    { path: '/donate', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/volunteer', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/transparency', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/privacy-policy', priority: 0.5, changeFrequency: 'yearly' },
    { path: '/terms-and-conditions', priority: 0.5, changeFrequency: 'yearly' },
    { path: '/disclaimer', priority: 0.5, changeFrequency: 'yearly' },
    { path: '/cookie-policy', priority: 0.5, changeFrequency: 'yearly' },
    { path: '/refund-policy', priority: 0.5, changeFrequency: 'yearly' },
    { path: '/site-map', priority: 0.5, changeFrequency: 'monthly' },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${baseUrl}${r.path}`,
    lastModified: currentDate,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // Dynamic Blog Posts
  const blogEntries: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticEntries, ...blogEntries];
}
