import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { getGatewaySettings } from '@/lib/gateway-settings';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { amount, donorName, donorEmail, donorPhone, donor_name, donor_email, donor_phone, type } = body;

    const numericAmount = Number(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid donation amount. Please enter an amount greater than 0.',
        },
        { status: 400 }
      );
    }

    // Retrieve keys from persistent store first, then fallback to environment
    const settings = getGatewaySettings();
    const keyId = (settings.razorpayKeyId || process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '').trim();
    const keySecret = (settings.razorpayKeySecret || process.env.RAZORPAY_KEY_SECRET || '').trim();

    if (!keyId || !keySecret || keyId.includes('your_razorpay') || keySecret.includes('your_razorpay')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Razorpay Gateway is not configured. Please enter your active Razorpay Key ID and Key Secret in Admin Settings.',
        },
        { status: 503 }
      );
    }

    const amountInPaise = Math.round(numericAmount * 100);
    const receipt = `donation_${Date.now()}`;

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    try {
      const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt,
        notes: {
          donor_name: donorName || donor_name || 'Supporter',
          donor_email: donorEmail || donor_email || '',
          donor_phone: donorPhone || donor_phone || '',
          donation_type: type || 'one-time',
          purpose: 'ITLC Foundation Charitable Donation',
        },
      });

      return NextResponse.json({
        success: true,
        order: {
          id: order.id,
          amount: order.amount,
          currency: order.currency || 'INR',
          receipt: order.receipt || receipt,
          status: order.status || 'created',
        },
        key: keyId,
        order_id: order.id,
        amount: order.amount,
        currency: order.currency || 'INR',
      });
    } catch (sdkError: any) {
      console.error('Razorpay SDK order creation error:', sdkError?.error || sdkError?.message || sdkError);
      const errorDesc =
        sdkError?.error?.description ||
        sdkError?.message ||
        'Razorpay authentication error. Please verify your Razorpay API Keys in Admin Settings.';

      return NextResponse.json(
        {
          success: false,
          message: errorDesc,
          error: sdkError?.error?.code || 'AUTHENTICATION_FAILED',
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Unexpected error in /api/donation/create-order:', error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Unable to create payment order',
      },
      { status: 500 }
    );
  }
}
