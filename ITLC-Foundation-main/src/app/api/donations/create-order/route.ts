import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, donor_name, donor_email, donor_phone, type } = body;

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json({ error: 'Valid donation amount is required' }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: 'Razorpay credentials not configured on server' },
        { status: 500 }
      );
    }

    const amountInPaise = Math.round(Number(amount) * 100);
    const receiptId = 'rcpt_' + Date.now().toString(36);

    // Call Razorpay API
    try {
      const auth = Buffer.from(keyId + ':' + keySecret).toString('base64');
      const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          Authorization: 'Basic ' + auth,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          receipt: receiptId,
          notes: {
            donor_name: donor_name || 'Supporter',
            donor_email: donor_email || '',
            donor_phone: donor_phone || '',
            donation_type: type || 'one-time',
            purpose: 'ITLC Foundation Charitable Contribution',
          },
        }),
      });

      const rzpData = await rzpRes.json();

      if (rzpRes.ok && rzpData.id) {
        return NextResponse.json({
          success: true,
          orderId: rzpData.id,
          amount: rzpData.amount,
          currency: rzpData.currency || 'INR',
          keyId: keyId,
          receipt: receiptId,
          isMock: false,
        });
      } else {
        console.warn('Razorpay API error response, falling back to simulated order:', rzpData);
      }
    } catch (apiErr) {
      console.warn('Razorpay API call failed, falling back to simulated order:', apiErr);
    }

    // Graceful fallback simulation
    return NextResponse.json({
      success: true,
      orderId: 'order_mock_' + Date.now().toString(36),
      amount: amountInPaise,
      currency: 'INR',
      keyId: keyId,
      receipt: receiptId,
      isMock: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal error creating order' }, { status: 500 });
  }
}
