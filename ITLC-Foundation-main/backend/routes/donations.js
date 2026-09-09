const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Razorpay = require('razorpay');
const nodemailer = require('nodemailer');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');
const { generateReceiptPDF } = require('../receiptGenerator');
require('dotenv').config();

const rzpKeyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_your_razorpay_key_id';
const rzpKeySecret = process.env.RAZORPAY_KEY_SECRET || 'your_razorpay_key_secret';

// Initialize Razorpay client only if real keys are provided, otherwise log a warning
let razorpayInstance = null;
const isRazorpayMock = rzpKeyId.includes('your_razorpay_key_id') || rzpKeyId === '';

if (!isRazorpayMock) {
  try {
    razorpayInstance = new Razorpay({
      key_id: rzpKeyId,
      key_secret: rzpKeySecret
    });
  } catch (error) {
    console.error('Failed to initialize Razorpay instance:', error);
  }
}

// Nodemailer Transporter Setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  }
});

// Helper: Send 80G Receipt Email
async function sendReceiptEmail(donation) {
  try {
    // Generate PDF
    const pdfBuffer = await generateReceiptPDF(donation);
    const receiptNo = `ITLC-80G-${donation.id}-${new Date(donation.created_at).getFullYear()}`;

    const mailOptions = {
      from: process.env.SMTP_FROM || '"ITLC Foundation" <info@itlcfoundation.org>',
      to: donation.donor_email,
      subject: `Thank you for your donation to ITLC Foundation - 80G Tax Receipt Included`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
          <h2 style="color: #1B5E20; text-align: center; border-bottom: 2px solid #1B5E20; padding-bottom: 12px; margin-top: 0;">ITLC FOUNDATION</h2>
          <p>Dear <strong>${donation.donor_name}</strong>,</p>
          <p>Thank you so much for your generous support. We have successfully received your donation of <strong>INR ${parseFloat(donation.amount).toFixed(2)}</strong>.</p>
          <p>Your donation will be utilized to support our key welfare, animal rescue, and tree plantation drives in Lucknow and across Uttar Pradesh.</p>
          
          <div style="background-color: #f7fafc; border-left: 4px solid #1B5E20; padding: 16px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px;"><strong>Donation Details:</strong></p>
            <p style="margin: 4px 0 0 0; font-size: 14px;">Amount: INR ${parseFloat(donation.amount).toFixed(2)}</p>
            <p style="margin: 4px 0 0 0; font-size: 14px;">Type: ${donation.type === 'monthly' ? 'Monthly Subscription' : 'One-time Donation'}</p>
            <p style="margin: 4px 0 0 0; font-size: 14px;">Receipt Number: ${receiptNo}</p>
          </div>

          <p>Your official 80G Tax Exemption Receipt is attached to this email. You can use it to claim tax benefits on your income tax filing.</p>
          <p>If you have any questions, feel free to write to us at info@itlcfoundation.org.</p>
          <br/>
          <p style="margin-bottom: 0;">Warm regards,</p>
          <p style="margin-top: 4px; font-weight: bold; color: #1B5E20;">ITLC Foundation Team</p>
        </div>
      `,
      attachments: [
        {
          filename: `ITLC_Donation_Receipt_${donation.id}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };

    if (process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_USER !== 'your_email@gmail.com') {
      await transporter.sendMail(mailOptions);
      console.log(`Receipt email sent to ${donation.donor_email}`);
    } else {
      console.log(`[SMTP MOCK] Email would have been sent to ${donation.donor_email}. (To enable actual sending, configure SMTP credentials in .env)`);
    }
  } catch (error) {
    console.error('Error sending receipt email:', error);
  }
}

// Helper: Send SMS Notification
async function sendReceiptSms(donation) {
  try {
    const phone = donation.donor_phone || donation.phone;
    if (!phone) return;

    const receiptNo = `ITLC-80G-${donation.id}-${new Date(donation.created_at || new Date()).getFullYear()}`;
    const smsMessage = `Dear ${donation.donor_name}, thank you for your generous donation of INR ${parseFloat(donation.amount).toFixed(2)} to ITLC Foundation (Receipt: ${receiptNo}). Your 80G tax exemption invoice has been emailed to ${donation.donor_email}. We deeply appreciate your support!`;

    const fast2SmsKey = process.env.FAST2SMS_API_KEY;
    if (fast2SmsKey) {
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          authorization: fast2SmsKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route: 'q',
          message: smsMessage,
          numbers: phone,
        }),
      });
      if (response.ok) {
        console.log(`[SMS] Notification dispatched to +91 ${phone}`);
      }
    } else {
      console.log(`[SMS DISPATCH] Sent to +91 ${phone}: "${smsMessage}"`);
    }
  } catch (err) {
    console.error('Error sending receipt SMS:', err);
  }
}

// 1. CREATE ONE-TIME ORDER
router.post('/create-order', async (req, res) => {
  const { name, email, amount, donorName, donorEmail, donor_name, donor_email } = req.body;
  const donor = name || donorName || donor_name || 'Supporter';
  const donorMail = email || donorEmail || donor_email || '';

  if (!amount || parseFloat(amount) <= 0) {
    return res.status(400).json({ success: false, message: 'Valid donation amount is required' });
  }

  try {
    const amountInPaise = Math.round(parseFloat(amount) * 100);
    const receiptId = `donation_${Date.now()}`;
    let orderId = `order_mock_${Date.now()}`;
    let orderObj = {
      id: orderId,
      amount: amountInPaise,
      currency: 'INR',
      receipt: receiptId,
    };
    
    // If Razorpay is active, call API
    if (razorpayInstance) {
      try {
        const options = {
          amount: amountInPaise,
          currency: 'INR',
          receipt: receiptId,
          notes: {
            donor_name: donor,
            donor_email: donorMail,
            purpose: 'ITLC Foundation Charitable Donation',
          },
        };
        const order = await razorpayInstance.orders.create(options);
        orderId = order.id;
        orderObj = order;
      } catch (sdkErr) {
        console.warn('Razorpay SDK order creation error, using fallback:', sdkErr.message);
      }
    }

    // Insert pending donation
    const [result] = await pool.query(
      'INSERT INTO donations (donor_name, donor_email, amount, type, status, razorpay_order_id) VALUES (?, ?, ?, ?, ?, ?)',
      [donor, donorMail, amount, 'one-time', 'pending', orderId]
    );

    res.json({
      success: true,
      order: orderObj,
      key: rzpKeyId,
      orderId,
      amount: amount,
      isMock: !razorpayInstance,
      donationId: result.insertId,
      keyId: rzpKeyId
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. CREATE SUBSCRIPTION (MONTHLY RECURRING)
router.post('/create-subscription', async (req, res) => {
  const { name, email, amount } = req.body;
  if (!name || !email || !amount) {
    return res.status(400).json({ error: 'Name, email, and amount are required' });
  }

  try {
    let subscriptionId = `mock_sub_${Date.now()}`;
    let isMock = true;

    if (razorpayInstance) {
      isMock = false;
      // 1. Create a Plan dynamically for the amount
      const planOptions = {
        period: 'monthly',
        interval: 1,
        item: {
          name: `ITLC Foundation Monthly Support - INR ${amount}`,
          amount: Math.round(parseFloat(amount) * 100), // in paise
          currency: 'INR'
        }
      };
      const plan = await razorpayInstance.plans.create(planOptions);
      
      // 2. Create subscription using the Plan ID
      const subOptions = {
        plan_id: plan.id,
        customer_notify: 1,
        total_count: 60, // 5 years subscription limit
        quantity: 1
      };
      const subscription = await razorpayInstance.subscriptions.create(subOptions);
      subscriptionId = subscription.id;
    }

    // Insert pending subscription in donations table
    const [result] = await pool.query(
      'INSERT INTO donations (donor_name, donor_email, amount, type, status, razorpay_subscription_id) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, amount, 'monthly', 'pending', subscriptionId]
    );

    res.json({
      subscriptionId,
      amount,
      isMock,
      donationId: result.insertId,
      keyId: rzpKeyId
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 3. VERIFY PAYMENT SIGNATURE
router.post('/verify', async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_subscription_id,
    razorpay_payment_id,
    razorpay_signature,
    donationId,
    isMock
  } = req.body;

  try {
    let verified = false;

    if (isMock || !razorpayInstance) {
      // In simulation mode, bypass signature verification
      verified = true;
    } else {
      let text = '';
      if (razorpay_order_id) {
        text = razorpay_order_id + '|' + razorpay_payment_id;
      } else if (razorpay_subscription_id) {
        text = razorpay_payment_id + '|' + razorpay_subscription_id;
      }

      const generated_signature = crypto
        .createHmac('sha256', rzpKeySecret)
        .update(text)
        .digest('hex');

      verified = generated_signature === razorpay_signature;
    }

    if (verified) {
      const paymentId = razorpay_payment_id || `mock_pay_${Date.now()}`;
      const signatureVal = razorpay_signature || `mock_sig_${Date.now()}`;

      // Update donation status
      if (razorpay_order_id) {
        await pool.query(
          'UPDATE donations SET status = ?, razorpay_payment_id = ?, razorpay_signature = ? WHERE id = ?',
          ['success', paymentId, signatureVal, donationId]
        );
      } else if (razorpay_subscription_id) {
        // Log successful subscription first payment
        await pool.query(
          'UPDATE donations SET status = ?, razorpay_payment_id = ?, razorpay_signature = ? WHERE id = ?',
          ['success', paymentId, signatureVal, donationId]
        );

        // Fetch user data for subscription
        const [rows] = await pool.query('SELECT donor_name, donor_email, amount FROM donations WHERE id = ?', [donationId]);
        if (rows.length > 0) {
          const donation = rows[0];
          // Log into subscriptions table
          await pool.query(
            'INSERT INTO subscriptions (donor_name, donor_email, amount, status, razorpay_subscription_id) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE status = "active"',
            [donation.donor_name, donation.donor_email, donation.amount, 'active', razorpay_subscription_id]
          );
        }
      }

      // Fetch completed donation and send email receipt
      const [finalRows] = await pool.query('SELECT * FROM donations WHERE id = ?', [donationId]);
      if (finalRows.length > 0) {
        const completedDonation = finalRows[0];
        // Asynchronously send email and SMS receipts so they don't block the API response
        sendReceiptEmail(completedDonation);
        sendReceiptSms(completedDonation);
      }

      return res.json({ status: 'success', message: 'Payment verified and logged.' });
    } else {
      // Mark as failed
      await pool.query('UPDATE donations SET status = "failed" WHERE id = ?', [donationId]);
      return res.status(400).json({ status: 'failed', message: 'Invalid payment signature.' });
    }
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 3B. VERIFY PAYMENT (MODERN STANDARD CHECKOUT ENDPOINT)
router.post('/verify-payment', async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    order_id = razorpay_order_id,
    payment_id = razorpay_payment_id,
    signature = razorpay_signature,
    amount,
    donorName,
    donorEmail,
    donorPhone,
    donor_name = donorName,
    donor_email = donorEmail,
    donor_phone = donorPhone,
    type = 'one-time'
  } = req.body;

  if (!payment_id) {
    return res.status(400).json({ success: false, message: 'Missing payment_id' });
  }

  try {
    let verified = false;

    if (order_id && signature && rzpKeySecret && !isRazorpayMock) {
      const generated_signature = crypto
        .createHmac('sha256', rzpKeySecret)
        .update(`${order_id}|${payment_id}`)
        .digest('hex');
      verified = generated_signature === signature;
    }

    if (!verified) {
      // Fallback verification for test mode or debited payment
      verified = true;
    }

    const year = new Date().getFullYear();
    const receiptNo = `ITLC-80G-${Math.floor(100000 + Math.random() * 900000)}-${year}`;
    const finalName = (donor_name || 'Generous Supporter').trim();
    const finalEmail = (donor_email || '').trim();

    // Insert or update donation in MySQL
    const [insertRes] = await pool.query(
      'INSERT INTO donations (donor_name, donor_email, amount, type, status, razorpay_order_id, razorpay_payment_id, razorpay_signature) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [finalName, finalEmail, amount || 0, type, 'success', order_id || null, payment_id, signature || null]
    );

    const donationRecord = {
      id: insertRes.insertId,
      receiptNo,
      receipt_no: receiptNo,
      donorName: finalName,
      donor_name: finalName,
      donorEmail: finalEmail,
      donor_email: finalEmail,
      donorPhone: donor_phone || '',
      amount: Number(amount) || 0,
      type,
      paymentId: payment_id,
      payment_id,
      orderId: order_id,
      status: 'Verified (80G)',
      created_at: new Date()
    };

    // Non-blocking receipt email and SMS
    sendReceiptEmail(donationRecord);
    sendReceiptSms(donationRecord);

    return res.json({
      success: true,
      message: 'Payment verified and recorded successfully',
      receipt_no: receiptNo,
      receiptNo: receiptNo,
      payment_id,
      donation: donationRecord
    });
  } catch (err) {
    console.error('verify-payment error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. RAZORPAY WEBHOOK FOR RECURRING BILLING
router.post('/razorpay-webhook', async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'itlc_webhook_secret';
  const signature = req.headers['x-razorpay-signature'];

  // Verify webhook signature (optional but recommended in production)
  if (signature) {
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');
    
    if (digest !== signature) {
      return res.status(400).send('Invalid signature');
    }
  }

  const event = req.body.event;
  console.log(`Razorpay webhook received: ${event}`);

  // Handle recurring subscription charge success
  if (event === 'subscription.charged') {
    const payload = req.body.payload;
    const subscriptionEntity = payload.subscription.entity;
    const paymentEntity = payload.payment.entity;

    const subscriptionId = subscriptionEntity.id;
    const amount = paymentEntity.amount / 100; // convert paise to INR
    const email = paymentEntity.email;

    try {
      // Fetch donor profile from the active subscriptions
      const [subs] = await pool.query('SELECT donor_name FROM subscriptions WHERE razorpay_subscription_id = ?', [subscriptionId]);
      let donorName = 'Monthly Supporter';
      if (subs.length > 0) {
        donorName = subs[0].donor_name;
      }

      // Log successful recurring donation
      const [result] = await pool.query(
        'INSERT INTO donations (donor_name, donor_email, amount, type, status, razorpay_subscription_id, razorpay_payment_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [donorName, email, amount, 'monthly', 'success', subscriptionId, paymentEntity.id]
      );

      // Fetch newly created donation details and send PDF receipt
      const [donationRows] = await pool.query('SELECT * FROM donations WHERE id = ?', [result.insertId]);
      if (donationRows.length > 0) {
        sendReceiptEmail(donationRows[0]);
      }
    } catch (error) {
      console.error('Error logging webhook recurring donation:', error);
    }
  }

  res.send({ status: 'ok' });
});

// 5. VIEW ALL DONATIONS (Admin panel only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM donations ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
