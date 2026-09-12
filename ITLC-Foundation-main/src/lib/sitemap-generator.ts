import fs from 'fs';
import path from 'path';
import { executeQuery, isDbConnected } from '@/lib/db';
import { BLOG_POSTS } from '@/data/blog-posts';

export interface SitemapEntry {
  url: string;
  lastModified: string;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  category: 'core' | 'cause' | 'project' | 'blog' | 'legal';
  title?: string;
}

export interface SitemapStats {
  baseUrl: string;
  sitemapUrl: string;
  totalUrls: number;
  corePagesCount: number;
  causesCount: number;
  projectsCount: number;
  blogsCount: number;
  legalCount: number;
  lastGenerated: string;
  healthStatus: 'healthy' | 'warning' | 'error';
  healthMessage: string;
  entries: SitemapEntry[];
}

/**
 * Return normalized canonical base URL
 */
export function getBaseUrl(): string {
  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://itlcfoundation.com';
  return rawUrl.trim().replace(/\/+$/, '');
}

/**
 * XML character escaping for sitemap compliance
 */
export function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

/**
 * Safely parse date to ISO 8601 UTC string
 */
function safeIsoDate(inputDate?: any): string {
  if (!inputDate) return new Date().toISOString();
  try {
    const d = new Date(inputDate);
    if (!isNaN(d.getTime())) {
      return d.toISOString();
    }
  } catch {}
  return new Date().toISOString();
}

/**
 * Generate complete list of public, published, indexable sitemap entries
 */
export async function getSitemapEntries(): Promise<SitemapEntry[]> {
  const baseUrl = getBaseUrl();
  const currentDate = new Date().toISOString();
  const urlMap = new Map<string, SitemapEntry>();

  // Helper to add unique entry
  const addEntry = (entry: SitemapEntry) => {
    // Exclude disbarred / internal paths
    const urlLower = entry.url.toLowerCase();
    if (
      urlLower.includes('/admin') ||
      urlLower.includes('/api') ||
      urlLower.includes('/login') ||
      urlLower.includes('/dashboard') ||
      urlLower.includes('/checkout-test') ||
      urlLower.includes('/donation-success') ||
      urlLower.includes('?') ||
      urlLower.includes('#')
    ) {
      return;
    }
    urlMap.set(entry.url, entry);
  };

  // 1. CORE STATIC & CMS PAGES
  const corePages: { path: string; priority: number; changeFrequency: 'weekly' | 'monthly' | 'daily'; title: string }[] = [
    { path: '', priority: 1.0, changeFrequency: 'weekly', title: 'Home Page' },
    { path: '/about', priority: 0.9, changeFrequency: 'monthly', title: 'About ITLC Foundation' },
    { path: '/projects', priority: 0.9, changeFrequency: 'weekly', title: 'Our Projects & Drives' },
    { path: '/services', priority: 0.8, changeFrequency: 'monthly', title: 'Services & Focus Areas' },
    { path: '/gallery', priority: 0.8, changeFrequency: 'weekly', title: 'Photo Gallery & Impact' },
    { path: '/blog', priority: 0.9, changeFrequency: 'daily', title: 'Blog & Articles Directory' },
    { path: '/donate', priority: 0.9, changeFrequency: 'monthly', title: 'Donate Now (80G Tax Exempt)' },
    { path: '/volunteer', priority: 0.8, changeFrequency: 'monthly', title: 'Volunteer With Us' },
    { path: '/transparency', priority: 0.8, changeFrequency: 'monthly', title: 'Transparency & Governance' },
    { path: '/contact', priority: 0.7, changeFrequency: 'monthly', title: 'Contact Us' },
  ];

  for (const page of corePages) {
    addEntry({
      url: `${baseUrl}${page.path}`,
      lastModified: currentDate,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      category: 'core',
      title: page.title,
    });
  }

  // 2. 6 CAUSES & PROGRAM PAGES
  const causesPages: { path: string; title: string }[] = [
    { path: '/paryavaran-sanrakshan', title: 'Environment Protection (Paryavaran Sanrakshan)' },
    { path: '/animal-welfare', title: 'Stray Animal Welfare & Emergency Rescue' },
    { path: '/women-empowerment', title: 'Women Empowerment & Vocational Training' },
    { path: '/education', title: 'Child Education & Learning Support' },
    { path: '/clean-water', title: 'Clean Water & Community Sanitation' },
    { path: '/social-welfare', title: 'Community Social Welfare & Relief' },
  ];

  for (const cause of causesPages) {
    addEntry({
      url: `${baseUrl}${cause.path}`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
      category: 'cause',
      title: cause.title,
    });
  }

  // 3. LEGAL, COMPLIANCE & HTML DIRECTORY
  const legalPages: { path: string; title: string }[] = [
    { path: '/privacy-policy', title: 'Privacy Policy' },
    { path: '/terms-and-conditions', title: 'Terms & Conditions' },
    { path: '/disclaimer', title: 'Disclaimer' },
    { path: '/cookie-policy', title: 'Cookie Policy' },
    { path: '/refund-policy', title: 'Donation & Refund Policy' },
    { path: '/sitemap-page', title: 'HTML Website Sitemap' },
  ];

  for (const legal of legalPages) {
    addEntry({
      url: `${baseUrl}${legal.path}`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.5,
      category: 'legal',
      title: legal.title,
    });
  }

  // 4. DYNAMIC PROJECTS (Direct from MySQL or JSON fallback)
  let projectsLoaded = false;
  try {
    const dbConnected = await isDbConnected();
    if (dbConnected) {
      const dbRows = await executeQuery<{
        slug: string;
        title: string;
        publish_status: string;
        updated_at?: any;
        created_at?: any;
      }>(
        "SELECT slug, title, publish_status, updated_at, created_at FROM key_projects WHERE publish_status = 'published'"
      );

      if (dbRows && dbRows.length > 0) {
        projectsLoaded = true;
        for (const proj of dbRows) {
          if (proj.slug) {
            addEntry({
              url: `${baseUrl}/projects/${proj.slug}`,
              lastModified: safeIsoDate(proj.updated_at || proj.created_at),
              changeFrequency: 'weekly',
              priority: 0.8,
              category: 'project',
              title: proj.title || 'Project Detail',
            });
          }
        }
      }
    }
  } catch (dbErr) {
    // Continue to JSON fallback
  }

  if (!projectsLoaded) {
    try {
      const projectsJsonPath = path.join(process.cwd(), 'src', 'data', 'projects.json');
      if (fs.existsSync(projectsJsonPath)) {
        const fileContent = fs.readFileSync(projectsJsonPath, 'utf8');
        const projects = JSON.parse(fileContent);
        if (Array.isArray(projects)) {
          for (const proj of projects) {
            // Only include published projects
            if (proj.published && proj.slug) {
              addEntry({
                url: `${baseUrl}/projects/${proj.slug}`,
                lastModified: safeIsoDate(proj.updated_at || proj.updatedAt || proj.created_at),
                changeFrequency: 'weekly',
                priority: 0.8,
                category: 'project',
                title: proj.title || 'Project Detail',
              });
            }
          }
        }
      }
    } catch (fsErr) {
      console.error('[Sitemap] Error reading projects.json:', fsErr);
    }
  }

  // 5. DYNAMIC BLOGS & ARTICLES (Direct from MySQL or JSON fallback)
  let blogsLoaded = false;
  try {
    const dbConnected = await isDbConnected();
    if (dbConnected) {
      const dbBlogs = await executeQuery<{
        slug: string;
        title: string;
        status: string;
        seo_index?: number;
        published_at?: any;
        updated_at?: any;
        created_at?: any;
      }>(
        "SELECT slug, title, status, seo_index, published_at, updated_at, created_at FROM blogs WHERE status = 'published' AND (seo_index IS NULL OR seo_index = 1)"
      );

      if (dbBlogs && dbBlogs.length > 0) {
        blogsLoaded = true;
        for (const b of dbBlogs) {
          if (b.slug) {
            addEntry({
              url: `${baseUrl}/blog/${b.slug}`,
              lastModified: safeIsoDate(b.updated_at || b.published_at || b.created_at),
              changeFrequency: 'weekly',
              priority: 0.8,
              category: 'blog',
              title: b.title || 'Article Detail',
            });
          }
        }
      }
    }
  } catch (dbErr) {
    // Continue to JSON fallback
  }

  if (!blogsLoaded) {
    try {
      const blogsJsonPath = path.join(process.cwd(), 'src', 'data', 'blogs.json');
      if (fs.existsSync(blogsJsonPath)) {
        const fileContent = fs.readFileSync(blogsJsonPath, 'utf8');
        const blogs = JSON.parse(fileContent);
        if (Array.isArray(blogs)) {
          for (const b of blogs) {
            // Include only published, non-noindex blogs
            if (b.status === 'published' && !b.noindex && b.slug) {
              addEntry({
                url: `${baseUrl}/blog/${b.slug}`,
                lastModified: safeIsoDate(b.updatedAt || b.date),
                changeFrequency: 'weekly',
                priority: 0.8,
                category: 'blog',
                title: b.title || 'Article Detail',
              });
            }
          }
        }
      }
    } catch (fsErr) {
      console.error('[Sitemap] Error reading blogs.json:', fsErr);
    }

    // Also verify against statically defined BLOG_POSTS in case blogs.json is empty
    if (Array.isArray(BLOG_POSTS)) {
      for (const b of BLOG_POSTS) {
        if (b.slug && !urlMap.has(`${baseUrl}/blog/${b.slug}`)) {
          addEntry({
            url: `${baseUrl}/blog/${b.slug}`,
            lastModified: safeIsoDate(b.date),
            changeFrequency: 'weekly',
            priority: 0.8,
            category: 'blog',
            title: b.title || 'Article Detail',
          });
        }
      }
    }
  }

  return Array.from(urlMap.values());
}

/**
 * Render valid XML string from entries array
 */
export function buildSitemapXml(entries: SitemapEntry[]): string {
  const xmlNodes = entries
    .map(
      (entry) => `  <url>
    <loc>${escapeXml(entry.url)}</loc>
    <lastmod>${entry.lastModified}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlNodes}
</urlset>`;
}

/**
 * Render sitemap index XML if URLs exceed 50,000 or 50MB
 */
export function buildSitemapIndexXml(subSitemaps: { loc: string; lastmod: string }[]): string {
  const nodes = subSitemaps
    .map(
      (s) => `  <sitemap>
    <loc>${escapeXml(s.loc)}</loc>
    <lastmod>${s.lastmod}</lastmod>
  </sitemap>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${nodes}
</sitemapindex>`;
}

/**
 * Collect sitemap metrics and health info for the Admin Panel
 */
export async function getSitemapStats(): Promise<SitemapStats> {
  const baseUrl = getBaseUrl();
  const entries = await getSitemapEntries();

  let corePagesCount = 0;
  let causesCount = 0;
  let projectsCount = 0;
  let blogsCount = 0;
  let legalCount = 0;

  for (const item of entries) {
    if (item.category === 'core') corePagesCount++;
    else if (item.category === 'cause') causesCount++;
    else if (item.category === 'project') projectsCount++;
    else if (item.category === 'blog') blogsCount++;
    else if (item.category === 'legal') legalCount++;
  }

  const isHealthy = entries.length >= 15;

  return {
    baseUrl,
    sitemapUrl: `${baseUrl}/sitemap.xml`,
    totalUrls: entries.length,
    corePagesCount,
    causesCount,
    projectsCount,
    blogsCount,
    legalCount,
    lastGenerated: new Date().toISOString(),
    healthStatus: isHealthy ? 'healthy' : 'warning',
    healthMessage: isHealthy
      ? `All ${entries.length} URLs generated successfully with canonical HTTPS links.`
      : `Sitemap generated with ${entries.length} URLs. Verify that blogs and projects are published.`,
    entries,
  };
}
