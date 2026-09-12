import { NextRequest, NextResponse } from 'next/server';
import { getSitemapStats } from '@/lib/sitemap-generator';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stats = await getSitemapStats();
    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error: any) {
    console.error('[Admin Sitemap API Error]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate sitemap metrics' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Revalidate sitemap and robots paths in Next.js cache
    revalidatePath('/sitemap.xml');
    revalidatePath('/robots.txt');

    const freshStats = await getSitemapStats();
    return NextResponse.json({
      success: true,
      message: 'Sitemap cache revalidated successfully. All dynamic URLs are up-to-date.',
      stats: freshStats,
    });
  } catch (error: any) {
    console.error('[Admin Sitemap Revalidate Error]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to revalidate sitemap cache' },
      { status: 500 }
    );
  }
}
