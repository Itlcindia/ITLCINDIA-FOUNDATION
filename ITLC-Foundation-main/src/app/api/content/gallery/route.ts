import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const cmsPath = path.join(process.cwd(), 'src', 'data', 'cms_data.json');
    if (fs.existsSync(cmsPath)) {
      const data = JSON.parse(fs.readFileSync(cmsPath, 'utf8'));
      const galleryList = Array.isArray(data.gallery)
        ? data.gallery
        : (data.gallery && Array.isArray(data.gallery.images) ? data.gallery.images : []);

      if (galleryList.length > 0) {
        const formatted = galleryList.map((img: any, index: number) => ({
          id: img.id || `gal-${index}`,
          image_url: img.image || img.image_url,
          description: img.title || img.description || 'ITLC Foundation Ground Activity',
          category: img.category || 'Events',
        }));
        return NextResponse.json(formatted);
      }
    }
    return NextResponse.json([]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
