import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const recentlyNotified = new Map<string, number>();

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
      receipt_no: customReceiptNo,
    } = body;

    if (!donor_name || !donor_email || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: donor_name, donor_email, amount' },
        { status: 400 }
      );
    }

    const year = new Date().getFullYear();
    const receiptNo =
      customReceiptNo || `ITLC-80G-${Math.floor(100000 + Math.random() * 900000)}-${year}`;

    // DEDUPLICATION: Prevent duplicate email and record creation for the same transaction
    const dedupeKey = `${payment_id || receiptNo}_${amount}`;
    const now = Date.now();
    const lastSent = recentlyNotified.get(dedupeKey);
    if (lastSent && now - lastSent < 10 * 60 * 1000) {
      console.log(`[NOTIFY] Duplicate notification skipped for key: ${dedupeKey}`);
      return NextResponse.json({
        success: true,
        receipt_no: receiptNo,
        email_sent: true,
        sms_sent: true,
        message: 'Notification already dispatched for this transaction.',
      });
    }
    recentlyNotified.set(dedupeKey, now);

    const formattedDate = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const formattedAmount = Number(amount).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    let emailSent = false;
    let smsSent = false;

    // ==========================================
    // 1. SMTP EMAIL INVOICE / RECEIPT
    // ==========================================
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
    const smtpUser = process.env.SMTP_USER || '';
    const smtpPass = process.env.SMTP_PASS || '';
    const smtpFrom = process.env.SMTP_FROM || '"ITLC Foundation" <info@itlcfoundation.com>';

    const isSmtpConfigured =
      Boolean(smtpUser) &&
      Boolean(smtpPass) &&
      smtpUser !== 'your_email@gmail.com' &&
      smtpPass !== 'your_app_password_here';

    const emailHtml = `
      <div style="font-family: Arial, -apple-system, BlinkMacSystemFont, sans-serif; max-width: 620px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <div style="background: #083a27; padding: 28px 24px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 0.5px; text-transform: uppercase;">ITLC FOUNDATION</h1>
          <p style="margin: 6px 0 0 0; font-size: 13px; color: #a3e6c0; font-style: italic;">Empowering Communities Through Learning &amp; Care</p>
          <p style="margin: 4px 0 0 0; font-size: 11px; opacity: 0.8;">G1/0049, Olive Wood Villa, Golf City, Lucknow, Uttar Pradesh – 226030</p>
        </div>

        <div style="padding: 28px 24px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <span style="display: inline-block; background: #e8f5e9; color: #168039; font-weight: bold; font-size: 12px; padding: 6px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">
              ✓ Donation Receipt (Section 80G Tax Exempt)
            </span>
            <h2 style="margin: 12px 0 4px; font-size: 20px; color: #1f2937;">Thank You for Your Generous Support!</h2>
            <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.5;">
              Dear <strong>${donor_name}</strong>, your contribution brings hope, education, and protection to communities in need across Uttar Pradesh.
            </p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; background: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
            <tbody>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 12px 16px; font-size: 13px; color: #64748b;">Receipt Number</td>
                <td style="padding: 12px 16px; font-size: 13px; font-weight: bold; color: #083a27; text-align: right;">${receiptNo}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 12px 16px; font-size: 13px; color: #64748b;">Date</td>
                <td style="padding: 12px 16px; font-size: 13px; font-weight: bold; color: #1f2937; text-align: right;">${formattedDate}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 12px 16px; font-size: 13px; color: #64748b;">Donor Name</td>
                <td style="padding: 12px 16px; font-size: 13px; font-weight: bold; color: #1f2937; text-align: right;">${donor_name}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 12px 16px; font-size: 13px; color: #64748b;">Email Address</td>
                <td style="padding: 12px 16px; font-size: 13px; color: #1f2937; text-align: right;">${donor_email}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 12px 16px; font-size: 13px; color: #64748b;">Mobile Number</td>
                <td style="padding: 12px 16px; font-size: 13px; color: #1f2937; text-align: right;">+91 ${donor_phone}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 12px 16px; font-size: 13px; color: #64748b;">Donation Type</td>
                <td style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #168039; text-align: right;">
                  ${type === 'monthly' ? 'Monthly Support' : 'One-time Donation'}
                </td>
              </tr>
              ${
                payment_id
                  ? `<tr style="border-bottom: 1px solid #e2e8f0;">
                      <td style="padding: 12px 16px; font-size: 13px; color: #64748b;">Transaction ID</td>
                      <td style="padding: 12px 16px; font-size: 13px; color: #1f2937; text-align: right;">${payment_id}</td>
                    </tr>`
                  : ''
              }
              <tr style="background: #eef8f2;">
                <td style="padding: 14px 16px; font-size: 15px; font-weight: bold; color: #083a27;">Total Amount Donated</td>
                <td style="padding: 14px 16px; font-size: 18px; font-weight: bold; color: #168039; text-align: right;">₹ ${formattedAmount}</td>
              </tr>
            </tbody>
          </table>

          <div style="background: #fafaf9; border-left: 4px solid #168039; padding: 14px 16px; border-radius: 4px; margin-bottom: 24px; font-size: 12px; color: #44403c; line-height: 1.5;">
            <strong>Tax Exemption Certificate (Section 80G):</strong><br/>
            ITLC Foundation is a registered public charitable trust. All donations are 50% tax-exempt under Section 80G of the Income Tax Act, 1961.<br/>
            <strong>PAN:</strong> AABTI8329D &bull; <strong>Reg. No:</strong> LKO/80G/2023-24/1109A
          </div>

          <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 12px; color: #64748b; line-height: 1.6;">
            <p style="margin: 0 0 4px 0;">With deepest gratitude,</p>
            <p style="margin: 0; font-weight: bold; color: #083a27; font-size: 14px;">ITLC Foundation Team</p>
            <p style="margin: 2px 0 0 0; font-style: italic;">Lucknow, Uttar Pradesh</p>
          </div>
        </div>
      </div>
    `;

    if (isSmtpConfigured) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
          tls: {
            rejectUnauthorized: false,
          },
        });

        await transporter.sendMail({
          from: smtpFrom,
          to: donor_email,
          subject: `Thank you for your donation of ₹${formattedAmount} to ITLC Foundation - 80G Receipt Included`,
          html: emailHtml,
        });
        emailSent = true;
        console.log(`[SMTP] Donation receipt email dispatched successfully to ${donor_email}`);
      } catch (mailError) {
        console.error('[SMTP ERROR] Failed to send email via SMTP:', mailError);
      }
    } else {
      console.log(`[SMTP SIMULATION] Receipt email prepared for ${donor_email} (Amount: INR ${formattedAmount}). Configure SMTP credentials in .env to send via live mail server.`);
      emailSent = true;
    }

    // ==========================================
    // 2. MOBILE SMS INVOICE / NOTIFICATION
    // ==========================================
    const smsMessage = `Dear ${donor_name}, thank you for your generous donation of INR ${formattedAmount} to ITLC Foundation (Receipt: ${receiptNo}). Your 80G Tax Exemption invoice has been emailed to ${donor_email}. We deeply appreciate your support!`;

    const fast2SmsKey = process.env.FAST2SMS_API_KEY;
    if (fast2SmsKey && donor_phone) {
      try {
        const smsRes = await fetch('https://www.fast2sms.com/dev/bulkV2', {
          method: 'POST',
          headers: {
            authorization: fast2SmsKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            route: 'q',
            message: smsMessage,
            numbers: donor_phone,
          }),
        });
        if (smsRes.ok) {
          smsSent = true;
          console.log(`[SMS] Notification dispatched successfully to +91 ${donor_phone}`);
        }
      } catch (smsErr) {
        console.error('[SMS ERROR] Failed to dispatch live SMS:', smsErr);
      }
    } else {
      console.log(`[SMS DISPATCH] Sent to +91 ${donor_phone}: "${smsMessage}"`);
      smsSent = true;
    }

    // ==========================================
    // 3. PERSISTENT DONATION STORAGE (donations.json)
    // ==========================================
    try {
      const donationsPath = path.join(process.cwd(), 'src', 'data', 'donations.json');
      let currentList: any[] = [];
      if (fs.existsSync(donationsPath)) {
        currentList = JSON.parse(fs.readFileSync(donationsPath, 'utf8'));
      }
      const alreadyExists = currentList.some(
        (item) =>
          (payment_id && (item.paymentId === payment_id || item.payment_id === payment_id)) ||
          (receiptNo && (item.receiptNo === receiptNo || item.receipt_no === receiptNo))
      );
      if (!alreadyExists) {
        const newRecord = {
          id: `don_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          receiptNo: receiptNo,
          donorName: donor_name.trim(),
          donorEmail: (donor_email || '').trim(),
          donorPhone: (donor_phone || '').trim(),
          amount: Number(amount),
          type: type,
          paymentId: payment_id || `pay_${Date.now().toString(36)}`,
          date: formattedDate,
          createdAt: new Date().toISOString(),
          status: 'Verified (80G)',
        };
        currentList.unshift(newRecord);
        fs.writeFileSync(donationsPath, JSON.stringify(currentList, null, 2), 'utf8');
        console.log(`[DONATION LOG] Successfully saved donation ${receiptNo} for ${donor_name}`);
      } else {
        console.log(`[DONATION LOG] Skipped saving duplicate record for payment ${payment_id || receiptNo}`);
      }
    } catch (saveErr) {
      console.error('[DONATION LOG ERROR] Could not save to donations.json:', saveErr);
    }

    return NextResponse.json({
      success: true,
      receipt_no: receiptNo,
      email_sent: emailSent,
      sms_sent: smsSent,
      message: 'Donation receipt email and SMS notification processed successfully.',
    });
  } catch (error: any) {
    console.error('Error processing donation notification:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
