import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

function getEnvFilePath(filename: string): string {
  return path.join(process.cwd(), filename);
}

function cleanFromHeader(fromStr: string, defaultUser: string): string {
  if (!fromStr) {
    return defaultUser ? '"ITLC Foundation" <' + defaultUser + '>' : '"ITLC Foundation" <donation@itlcfoundation.com>';
  }
  let cleaned = fromStr.replace(/\\"/g, '"').trim();
  if (cleaned.startsWith('"') && cleaned.endsWith('"') && cleaned.includes('<')) {
    cleaned = cleaned.slice(1, -1).trim();
  }
  const match = cleaned.match(/^(?:"?([^"]*)"?\s*)?<([^>]+)>$/);
  if (match) {
    const name = (match[1] || 'ITLC Foundation').trim();
    const address = match[2].trim();
    return '"' + name + '" <' + address + '>';
  }
  return cleaned;
}

function parseEnvFile(filePath: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (!fs.existsSync(filePath)) return result;
  
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      val = val.replace(/\\"/g, '"');
      result[key] = val;
    }
  }
  return result;
}

function updateEnvFile(filePath: string, updates: Record<string, string>) {
  let content = '';
  if (fs.existsSync(filePath)) {
    content = fs.readFileSync(filePath, 'utf8');
  }

  const lines = content ? content.split(/\r?\n/) : [];
  const handledKeys = new Set<string>();
  const updatedLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      updatedLines.push(line);
      continue;
    }
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      if (key in updates) {
        handledKeys.add(key);
        const val = updates[key];
        updatedLines.push(key + '=' + val);
        continue;
      }
    }
    updatedLines.push(line);
  }

  for (const [key, val] of Object.entries(updates)) {
    if (!handledKeys.has(key)) {
      updatedLines.push(key + '=' + val);
    }
  }

  fs.writeFileSync(filePath, updatedLines.join('\n'), 'utf8');
}

export async function GET() {
  try {
    const envLocal = parseEnvFile(getEnvFilePath('.env.local'));
    const envBase = parseEnvFile(getEnvFilePath('.env'));

    const smtpHost = envLocal.SMTP_HOST || envBase.SMTP_HOST || process.env.SMTP_HOST || 'smtp.hostinger.com';
    const smtpPort = envLocal.SMTP_PORT || envBase.SMTP_PORT || process.env.SMTP_PORT || '465';
    const smtpUser = envLocal.SMTP_USER || envBase.SMTP_USER || process.env.SMTP_USER || 'donation@itlcfoundation.com';
    const smtpPass = envLocal.SMTP_PASS || envBase.SMTP_PASS || process.env.SMTP_PASS || '';
    const rawSmtpFrom = envLocal.SMTP_FROM || envBase.SMTP_FROM || process.env.SMTP_FROM || '';
    const smtpFrom = cleanFromHeader(rawSmtpFrom, smtpUser);

    const razorpayKeyId = envLocal.RAZORPAY_KEY_ID || envBase.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
    const razorpayKeySecret = envLocal.RAZORPAY_KEY_SECRET || envBase.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET || '';
    const fast2smsApiKey = envLocal.FAST2SMS_API_KEY || envBase.FAST2SMS_API_KEY || process.env.FAST2SMS_API_KEY || '';

    return NextResponse.json({
      success: true,
      settings: {
        smtpHost,
        smtpPort,
        smtpUser,
        smtpPass,
        smtpFrom,
        razorpayKeyId,
        razorpayKeySecret,
        fast2smsApiKey,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      smtpHost,
      smtpPort,
      smtpUser,
      smtpPass,
      smtpFrom,
      razorpayKeyId,
      razorpayKeySecret,
      fast2smsApiKey,
    } = body;

    const updates: Record<string, string> = {};
    if (smtpHost !== undefined) updates.SMTP_HOST = smtpHost.trim();
    if (smtpPort !== undefined) updates.SMTP_PORT = String(smtpPort).trim();
    if (smtpUser !== undefined) updates.SMTP_USER = smtpUser.trim();
    if (smtpPass !== undefined) updates.SMTP_PASS = smtpPass.trim();
    if (smtpFrom !== undefined) {
      const cleanedFrom = cleanFromHeader(smtpFrom, smtpUser || 'donation@itlcfoundation.com');
      updates.SMTP_FROM = cleanedFrom;
    }
    if (razorpayKeyId !== undefined) {
      updates.RAZORPAY_KEY_ID = razorpayKeyId.trim();
      updates.NEXT_PUBLIC_RAZORPAY_KEY_ID = razorpayKeyId.trim();
    }
    if (razorpayKeySecret !== undefined) updates.RAZORPAY_KEY_SECRET = razorpayKeySecret.trim();
    if (fast2smsApiKey !== undefined) updates.FAST2SMS_API_KEY = fast2smsApiKey.trim();

    for (const [k, v] of Object.entries(updates)) {
      process.env[k] = v;
    }

    const localEnvPath = getEnvFilePath('.env.local');
    const baseEnvPath = getEnvFilePath('.env');

    updateEnvFile(localEnvPath, updates);
    updateEnvFile(baseEnvPath, updates);

    return NextResponse.json({
      success: true,
      message: 'Environment settings (SMTP & Razorpay) updated successfully in .env.local and runtime.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, toEmail, smtpHost, smtpPort, smtpUser, smtpPass, smtpFrom } = body;

    if (action === 'test_smtp') {
      if (!toEmail || !toEmail.trim()) {
        return NextResponse.json(
          { success: false, error: 'Please enter a recipient email address to send the test email.' },
          { status: 400 }
        );
      }
      const recipient = toEmail.trim();
      const host = smtpHost || process.env.SMTP_HOST || 'smtp.hostinger.com';
      const port = parseInt(smtpPort || process.env.SMTP_PORT || '465', 10);
      const user = smtpUser || process.env.SMTP_USER || 'donation@itlcfoundation.com';
      const pass = smtpPass || process.env.SMTP_PASS || '';
      const from = cleanFromHeader(smtpFrom || process.env.SMTP_FROM || '', user);

      if (!user || !pass) {
        return NextResponse.json(
          { success: false, error: 'SMTP Username and Password must be provided to send a test email.' },
          { status: 400 }
        );
      }

      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
          user,
          pass,
        },
        connectionTimeout: 15000,
        greetingTimeout: 10000,
      });

      const info = await transporter.sendMail({
        from,
        to: recipient,
        subject: '[Live Test] ITLC Foundation SMTP Mail Server Test Verification',
        html: '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">' +
          '<div style="background: #083a27; padding: 20px; text-align: center; border-radius: 8px; margin-bottom: 20px;">' +
          '<h2 style="color: #ffffff; margin: 0; font-size: 20px;">ITLC FOUNDATION</h2>' +
          '<p style="color: #a3e6c0; margin: 5px 0 0 0; font-size: 12px;">Automated Mail Server Status Check</p>' +
          '</div>' +
          '<div style="padding: 10px 0;">' +
          '<span style="background: #e8f5e9; color: #168039; font-weight: bold; font-size: 12px; padding: 4px 12px; border-radius: 16px;">✓ SMTP Connection Live & Verified</span>' +
          '<h3 style="color: #1f2937; margin: 16px 0 8px 0;">Hostinger Mail Server Connected Successfully!</h3>' +
          '<p style="color: #4b5563; font-size: 14px; line-height: 1.6;">This test confirms that your SMTP credentials configured in the Admin Panel are functioning perfectly. Real-time donation receipts and 80G tax exemption invoices will be delivered reliably from <strong>' + from + '</strong>.</p>' +
          '<div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-top: 16px; font-size: 13px; color: #334155;">' +
          '<div><strong>Host:</strong> ' + host + '</div>' +
          '<div><strong>Port:</strong> ' + port + ' (SSL/TLS: ' + (port === 465 ? 'Yes' : 'STARTTLS') + ')</div>' +
          '<div><strong>Sender Account:</strong> ' + user + '</div>' +
          '<div><strong>Recipient:</strong> ' + recipient + '</div>' +
          '<div><strong>Timestamp:</strong> ' + new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST</div>' +
          '</div>' +
          '</div>' +
          '<div style="text-align: center; margin-top: 24px; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 12px;">' +
          'ITLC Foundation Admin System &bull; G1/0049, Olive Wood Villa, Golf City, Lucknow, UP – 226030' +
          '</div>' +
          '</div>',
      });

      return NextResponse.json({
        success: true,
        messageId: info.messageId,
        message: 'Live test email dispatched successfully to ' + recipient + '!',
      });
    }

    return NextResponse.json({ error: 'Invalid action requested' }, { status: 400 });
  } catch (error: any) {
    console.error('Settings test action error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to execute settings test' },
      { status: 500 }
    );
  }
}
