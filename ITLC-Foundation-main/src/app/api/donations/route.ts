import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const donationsFilePath = path.join(process.cwd(), 'src', 'data', 'donations.json');

function readDonations(): any[] {
  try {
    if (!fs.existsSync(donationsFilePath)) {
      return [];
    }
    const data = fs.readFileSync(donationsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading donations.json:', err);
    return [];
  }
}

function writeDonations(donations: any[]) {
  const dir = path.dirname(donationsFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(donationsFilePath, JSON.stringify(donations, null, 2), 'utf8');
}

export async function GET() {
  try {
    const list = readDonations();
    // Sort latest first
    const sorted = [...list].sort((a, b) => {
      const timeA = new Date(a.createdAt || a.date || 0).getTime();
      const timeB = new Date(b.createdAt || b.date || 0).getTime();
      return timeB - timeA;
    });

    const totalRaised = sorted.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const oneTimeCount = sorted.filter(d => (d.type || '').toLowerCase().includes('one')).length;
    const monthlyCount = sorted.filter(d => (d.type || '').toLowerCase().includes('month')).length;

    return NextResponse.json({
      success: true,
      totalRaised,
      totalDonations: sorted.length,
      oneTimeCount,
      monthlyCount,
      donations: sorted,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      donor_name,
      donor_email,
      donor_phone,
      amount,
      type = 'one-time',
      payment_id,
      receipt_no,
      status = 'Verified (80G)',
    } = body;

    if (!donor_name || !amount) {
      return NextResponse.json({ error: 'Donor name and amount are required' }, { status: 400 });
    }

    const list = readDonations();
    const newRecord = {
      id: `don_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      receiptNo: receipt_no || `ITLC-80G-${Math.floor(100000 + Math.random() * 900000)}-${new Date().getFullYear()}`,
      donorName: donor_name.trim(),
      donorEmail: (donor_email || '').trim(),
      donorPhone: (donor_phone || '').trim(),
      amount: Number(amount),
      type: type,
      paymentId: payment_id || `pay_${Date.now().toString(36)}`,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      createdAt: new Date().toISOString(),
      status: status,
    };

    list.unshift(newRecord);
    writeDonations(list);

    return NextResponse.json({ success: true, donation: newRecord });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing donation id' }, { status: 400 });
    }

    let list = readDonations();
    list = list.filter(d => d.id !== id);
    writeDonations(list);

    return NextResponse.json({ success: true, message: 'Donation record deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
