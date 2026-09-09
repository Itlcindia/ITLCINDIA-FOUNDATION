import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const mediaList: { url: string; name: string; folder: string }[] = [];
    const publicDir = path.join(process.cwd(), 'public');

    const foldersToScan = ['uploads', 'ref', 'gal', 'pro'];
    const srcImagesDir = path.join(process.cwd(), 'src', 'images');

    // Auto-sync: if any file was added to src/images, ensure it exists in public
    if (fs.existsSync(srcImagesDir)) {
      for (const folder of foldersToScan) {
        const sPath = path.join(srcImagesDir, folder);
        const pPath = path.join(publicDir, folder);
        if (fs.existsSync(sPath)) {
          if (!fs.existsSync(pPath)) fs.mkdirSync(pPath, { recursive: true });
          const srcFiles = fs.readdirSync(sPath);
          for (const file of srcFiles) {
            const srcFile = path.join(sPath, file);
            const pubFile = path.join(pPath, file);
            if (!fs.existsSync(pubFile) && fs.statSync(srcFile).isFile()) {
              try { fs.copyFileSync(srcFile, pubFile); } catch (e) {}
            }
          }
        }
      }
    }

    const seenUrls = new Set<string>();

    for (const folder of foldersToScan) {
      const folderPath = path.join(publicDir, folder);
      if (fs.existsSync(folderPath)) {
        const files = fs.readdirSync(folderPath);
        for (const file of files) {
          const ext = path.extname(file).toLowerCase();
          if (['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'].includes(ext)) {
            const url = `/${folder}/${file}`;
            if (!seenUrls.has(url)) {
              seenUrls.add(url);
              mediaList.push({
                url,
                name: file,
                folder: folder
              });
            }
          }
        }
      }
    }

    // Also include root images if present
    const rootImages = ['logo.png', 'logo-full.png', 'qr.png', 'vs.jpg'];
    for (const rImg of rootImages) {
      if (fs.existsSync(path.join(publicDir, rImg)) && !seenUrls.has(`/${rImg}`)) {
        seenUrls.add(`/${rImg}`);
        mediaList.push({
          url: `/${rImg}`,
          name: rImg,
          folder: 'root'
        });
      }
    }

    // Sort: newest uploads first
    mediaList.reverse();

    return NextResponse.json({ success: true, media: mediaList });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');
    if (!url) {
      return NextResponse.json({ error: 'Media URL is required' }, { status: 400 });
    }

    // Only allow deleting files inside public/uploads or test files, prevent directory traversal
    const safeUrl = url.replace(/^\/+/, '');
    if (safeUrl.includes('..') || !safeUrl.startsWith('uploads/')) {
      return NextResponse.json({ error: 'Only uploaded media can be deleted' }, { status: 403 });
    }

    const targetPath = path.join(process.cwd(), 'public', safeUrl);
    if (fs.existsSync(targetPath)) {
      fs.unlinkSync(targetPath);
      return NextResponse.json({ success: true, message: 'Media file deleted successfully' });
    }

    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

