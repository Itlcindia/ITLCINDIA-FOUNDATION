import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const donationsFilePath = path.join(process.cwd(), 'src', 'data', 'donations.json');

function saveDonationRecord(record: any) {
  try {
    let list: any[] = [];
    if (fs.existsSync(donationsFilePath)) {
      const data = fs.readFileSync(donationsFilePath, 'utf8');
      list = JSON.parse(data);
    }
    list.unshift(record);
    const dir = path.dirname(donationsFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(donationsFilePath, JSON.stringify(list, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving verified donation record:', err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      // Also allow alternative naming conventions
      order_id = razorpay_order_id,
      payment_id = razorpay_payment_id,
      signature = razorpay_signature,
      // Optional donation/metadata
      donor_name,
      donor_email,
      donor_phone,
      amount,
      type = 'one-time',
      notes,
    } = body;

    // Validate required fields
    if (!order_id || !payment_id || !signature) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: order_id, payment_id, and signature are required.',
        },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      console.error('RAZORPAY_KEY_SECRET is not configured in server environment');
      return NextResponse.json(
        { success: false, error: 'Server misconfiguration: missing RAZORPAY_KEY_SECRET' },
        { status: 500 }
      );
    }

    // Step 3 Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${order_id}|${payment_id}`)
      .digest('hex');

    const expectedBuf = Buffer.from(expectedSignature, 'utf-8');
    const actualBuf = Buffer.from(String(signature), 'utf-8');

    const isMatch =
      expectedBuf.length === actualBuf.length &&
      crypto.timingSafeEqual(expectedBuf, actualBuf);

    if (!isMatch) {
      console.warn('Payment verification failed: signature mismatch for order:', order_id);
      return NextResponse.json(
        {
          success: false,
          error: 'Payment verification failed: Signature mismatch. Payment marked as unverified.',
        },
        { status: 400 }
      );
    }

    // Payment is authentic and verified!
    const year = new Date().getFullYear();
    const receiptNo = `ITLC-80G-${Math.floor(100000 + Math.random() * 900000)}-${year}`;

    // If donor info is present, save the verified donation record
    if (amount || donor_name) {
      const donationRecord = {
        id: 'don_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
        donor_name: donor_name || 'Anonymous Supporter',
        donor_email: donor_email || '',
        donor_phone: donor_phone || '',
        amount: Number(amount) || 0,
        type: type || 'one-time',
        status: 'completed',
        payment_method: 'Razorpay Standard Checkout',
        payment_id,
        order_id,
        receipt_no: receiptNo,
        verified: true,
        createdAt: new Date().toISOString(),
        date: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
      };
      saveDonationRecord(donationRecord);
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      payment_id,
      order_id,
      receipt_no: receiptNo,
    });
  } catch (error: any) {
    console.error('Error in /api/verify-payment:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during verification' },
      { status: 500 }
    );
  }
}
