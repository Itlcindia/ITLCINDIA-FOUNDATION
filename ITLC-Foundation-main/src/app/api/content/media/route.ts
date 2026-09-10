import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface MediaItem {
  url: string;
  name: string;
  folder: string;
  size?: number;
  mtime?: number;
}

export async function GET() {
  try {
    const mediaList: MediaItem[] = [];
    const publicDir = path.join(process.cwd(), 'public');

    const foldersToScan = ['uploads', 'ref', 'gal', 'pro', 'causes'];
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
              let size = 0;
              let mtime = 0;
              try {
                const stat = fs.statSync(path.join(folderPath, file));
                size = stat.size;
                mtime = stat.mtimeMs;
              } catch (e) {}

              mediaList.push({
                url,
                name: file,
                folder: folder,
                size,
                mtime,
              });
            }
          }
        }
      }
    }

    // Also include root images if present
    const rootImages = ['logo.png', 'logo-full.png', 'qr.png', 'vs.jpg'];
    for (const rImg of rootImages) {
      const rPath = path.join(publicDir, rImg);
      if (fs.existsSync(rPath) && !seenUrls.has(`/${rImg}`)) {
        seenUrls.add(`/${rImg}`);
        let size = 0;
        let mtime = 0;
        try {
          const stat = fs.statSync(rPath);
          size = stat.size;
          mtime = stat.mtimeMs;
        } catch (e) {}

        mediaList.push({
          url: `/${rImg}`,
          name: rImg,
          folder: 'root',
          size,
          mtime,
        });
      }
    }

    // Sort: newest uploads / modified first
    mediaList.sort((a, b) => (b.mtime || 0) - (a.mtime || 0));

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

    // Sanitize path and prevent directory traversal
    const safeUrl = url.replace(/^\/+/, '');
    if (safeUrl.includes('..') || path.isAbsolute(safeUrl)) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 400 });
    }

    // Protect core system branding assets
    const protectedFiles = [
      'logo.png',
      'logo-full.png',
      'logo-icon.png',
      'favicon.ico',
      'favicon.png',
      'apple-icon.png',
      'qr.png',
    ];
    const filename = path.basename(safeUrl).toLowerCase();
    if (protectedFiles.includes(filename) && safeUrl.startsWith('root')) {
      return NextResponse.json({ error: 'Core system assets cannot be deleted' }, { status: 403 });
    }

    // Allowed directories for media deletion: uploads, gal, pro, ref, causes
    const allowedPrefixes = ['uploads/', 'gal/', 'pro/', 'ref/', 'causes/'];
    const isAllowed =
      allowedPrefixes.some((prefix) => safeUrl.startsWith(prefix)) ||
      safeUrl.startsWith('vs.jpg');

    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Cannot delete files outside media directories' },
        { status: 403 }
      );
    }

    const targetPath = path.join(process.cwd(), 'public', safeUrl);
    let deleted = false;

    if (fs.existsSync(targetPath)) {
      fs.unlinkSync(targetPath);
      deleted = true;
    }

    // Also mirror delete from src/images if it exists
    const srcImagesPath = path.join(process.cwd(), 'src', 'images', safeUrl);
    if (fs.existsSync(srcImagesPath)) {
      try {
        fs.unlinkSync(srcImagesPath);
        deleted = true;
      } catch (e) {}
    }

    if (deleted) {
      return NextResponse.json({ success: true, message: 'Media file deleted successfully' });
    }

    return NextResponse.json({ error: 'File not found on server' }, { status: 404 });
  } catch (err: any) {
    console.error('DELETE media error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { oldUrl, newName } = body;

    if (!oldUrl || !newName) {
      return NextResponse.json({ error: 'oldUrl and newName are required' }, { status: 400 });
    }

    const safeOldUrl = oldUrl.replace(/^\/+/, '');
    if (safeOldUrl.includes('..') || path.isAbsolute(safeOldUrl)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    const oldPath = path.join(process.cwd(), 'public', safeOldUrl);
    if (!fs.existsSync(oldPath)) {
      return NextResponse.json({ error: 'Original file not found' }, { status: 404 });
    }

    const dir = path.dirname(safeOldUrl);
    const ext = path.extname(safeOldUrl);
    const sanitizedBase = newName.trim().replace(/[^a-zA-Z0-9_\-\.]/g, '_');
    const finalFilename = sanitizedBase.endsWith(ext) ? sanitizedBase : `${sanitizedBase}${ext}`;
    const newPath = path.join(process.cwd(), 'public', dir, finalFilename);

    fs.renameSync(oldPath, newPath);

    // Also mirror rename in src/images if present
    const srcOldPath = path.join(process.cwd(), 'src', 'images', safeOldUrl);
    const srcNewPath = path.join(process.cwd(), 'src', 'images', dir, finalFilename);
    if (fs.existsSync(srcOldPath)) {
      try {
        fs.renameSync(srcOldPath, srcNewPath);
      } catch (e) {}
    }

    const newUrl = `/${dir}/${finalFilename}`.replace(/^\/\.\//, '/');
    return NextResponse.json({
      success: true,
      newUrl,
      name: finalFilename,
      message: 'File renamed successfully',
    });
  } catch (err: any) {
    console.error('PUT media error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

