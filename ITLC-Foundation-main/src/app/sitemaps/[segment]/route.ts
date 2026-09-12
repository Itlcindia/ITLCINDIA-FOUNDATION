import { NextRequest, NextResponse } from 'next/server';
import { getSitemapEntries, buildSitemapXml } from '@/lib/sitemap-generator';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ segment: string }> }
) {
  const { segment } = await params;
  const cleanSegment = segment.toLowerCase();
  const allEntries = await getSitemapEntries();

  let filtered = allEntries;

  if (cleanSegment === 'pages-1.xml' || cleanSegment === 'pages.xml') {
    filtered = allEntries.filter((e) => e.category === 'core' || e.category === 'cause');
  } else if (cleanSegment === 'articles-1.xml' || cleanSegment === 'articles.xml' || cleanSegment === 'blogs.xml') {
    filtered = allEntries.filter((e) => e.category === 'blog');
  } else if (cleanSegment === 'documents-1.xml' || cleanSegment === 'documents.xml' || cleanSegment === 'legal.xml') {
    filtered = allEntries.filter((e) => e.category === 'legal');
  } else if (cleanSegment === 'events-1.xml' || cleanSegment === 'projects-1.xml' || cleanSegment === 'projects.xml') {
    filtered = allEntries.filter((e) => e.category === 'project');
  } else {
    return new NextResponse('Sitemap segment not found', { status: 404 });
  }

  const xmlContent = buildSitemapXml(filtered);

  return new NextResponse(xmlContent, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
