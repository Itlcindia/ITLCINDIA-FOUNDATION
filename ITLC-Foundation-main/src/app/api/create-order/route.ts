import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { amount, currency = 'INR', receipt, notes } = body;

    // Validate amount
    const parsedAmount = Number(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount < 100) {
      return NextResponse.json(
        { error: 'Amount must be at least 100 paise (1 INR)' },
        { status: 400 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: 'Razorpay credentials not configured on server' },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const receiptId = receipt || `rcpt_${Date.now().toString(36)}`;

    try {
      const order = await razorpay.orders.create({
        amount: Math.round(parsedAmount),
        currency: currency || 'INR',
        receipt: receiptId,
        notes: notes || {},
      });

      return NextResponse.json({
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: keyId,
        receipt: order.receipt,
      });
    } catch (apiError: any) {
      console.error('Razorpay order creation API error:', apiError);

      if (apiError?.statusCode === 401 || apiError?.error?.code === 'BAD_REQUEST_ERROR' && apiError?.error?.description?.includes('auth')) {
        return NextResponse.json(
          { error: 'Razorpay authentication failed' },
          { status: 401 }
        );
      }

      return NextResponse.json(
        {
          error: apiError?.error?.description || apiError?.message || 'Failed to create Razorpay order',
        },
        { status: apiError?.statusCode && apiError.statusCode >= 400 && apiError.statusCode < 600 ? apiError.statusCode : 500 }
      );
    }
  } catch (error: any) {
    console.error('Unexpected error in /api/create-order:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
