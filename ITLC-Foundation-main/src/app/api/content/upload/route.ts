import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsFolder = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsFolder)) {
      fs.mkdirSync(uploadsFolder, { recursive: true });
    }

    const srcUploadsFolder = path.join(process.cwd(), 'src', 'images', 'uploads');
    if (!fs.existsSync(srcUploadsFolder)) {
      fs.mkdirSync(srcUploadsFolder, { recursive: true });
    }

    // Clean original name
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
    const uniqueFilename = `${Date.now()}-${sanitizedName}`;
    const destinationPath = path.join(uploadsFolder, uniqueFilename);
    const srcDestinationPath = path.join(srcUploadsFolder, uniqueFilename);

    fs.writeFileSync(destinationPath, buffer);
    fs.writeFileSync(srcDestinationPath, buffer);

    const publicUrl = `/uploads/${uniqueFilename}`;
    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: uniqueFilename,
      size: file.size,
      message: 'File uploaded successfully'
    });
  } catch (err: any) {
    console.error('File upload error:', err);
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}
