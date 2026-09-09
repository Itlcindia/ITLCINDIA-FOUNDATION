import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const contactFile = path.resolve(process.cwd(), 'src/data/contact_inquiries.json');

function readInquiries() {
  try {
    if (!fs.existsSync(contactFile)) return [];
    return JSON.parse(fs.readFileSync(contactFile, 'utf8'));
  } catch (err) {
    return [];
  }
}

function writeInquiries(items: any[]) {
  fs.writeFileSync(contactFile, JSON.stringify(items, null, 2), 'utf8');
}

export async function GET() {
  const inquiries = readInquiries();
  return NextResponse.json({ success: true, inquiries });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 });
    }

    const inquiries = readInquiries();
    const newInquiry = {
      id: 'inq-' + Date.now(),
      name: body.name.trim(),
      email: body.email.trim(),
      phone: body.phone ? body.phone.trim() : '',
      subject: body.subject ? body.subject.trim() : 'General Inquiry',
      message: body.message.trim(),
      status: 'new',
      admin_notes: '',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    inquiries.unshift(newInquiry);
    writeInquiries(inquiries);

    return NextResponse.json({ success: true, inquiry: newInquiry });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const inquiries = readInquiries();

    const index = inquiries.findIndex((i: any) => i.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    inquiries[index] = {
      ...inquiries[index],
      status: body.status || inquiries[index].status,
      admin_notes: body.admin_notes !== undefined ? body.admin_notes : inquiries[index].admin_notes,
      updated_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    writeInquiries(inquiries);
    return NextResponse.json({ success: true, inquiry: inquiries[index] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    let inquiries = readInquiries();
    inquiries = inquiries.filter((i: any) => i.id !== id);
    writeInquiries(inquiries);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
