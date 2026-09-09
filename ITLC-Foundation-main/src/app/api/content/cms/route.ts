import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src', 'data', 'cms_data.json');

export async function GET() {
  try {
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'CMS file not found' }, { status: 404 });
    }
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const updated = await req.json();
    let currentData = {};
    if (fs.existsSync(filePath)) {
      currentData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    const merged = { ...currentData, ...updated };
    fs.writeFileSync(filePath, JSON.stringify(merged, null, 2), 'utf8');
    return NextResponse.json({ success: true, message: 'CMS content updated successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
