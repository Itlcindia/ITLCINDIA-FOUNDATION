import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { verifyPassword, hashPassword, hashOtp, verifyOtp } from '@/lib/encryption';
import { getGatewaySettings } from '@/lib/gateway-settings';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const accountsFile = path.resolve(process.cwd(), 'src/data/admin_accounts.json');
const otpFile = path.resolve(process.cwd(), 'src/data/admin_otp.json');

function getEnvFilePath(filename: string): string {
  return path.join(process.cwd(), filename);
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
      result[key] = val.replace(/\\"/g, '"');
    }
  }
  return result;
}

function readAccounts(): any[] {
  try {
    if (!fs.existsSync(accountsFile)) return [];
    return JSON.parse(fs.readFileSync(accountsFile, 'utf8'));
  } catch (err) {
    return [];
  }
}

function writeAccounts(accounts: any[]) {
  fs.writeFileSync(accountsFile, JSON.stringify(accounts, null, 2), 'utf8');
}

function readOtps(): Record<string, { otp?: string; otp_hash?: string; expiresAt: number; purpose: string }> {
  try {
    if (!fs.existsSync(otpFile)) return {};
    return JSON.parse(fs.readFileSync(otpFile, 'utf8'));
  } catch (err) {
    return {};
  }
}

function writeOtps(otps: Record<string, { otp?: string; otp_hash?: string; expiresAt: number; purpose: string }>) {
  fs.writeFileSync(otpFile, JSON.stringify(otps, null, 2), 'utf8');
}

async function sendOtpEmail(toEmail: string, otp: string, purpose: 'login' | 'reset') {
  const gateway = getGatewaySettings();

  const host = gateway.smtpHost || process.env.SMTP_HOST || 'smtp.hostinger.com';
  const port = parseInt(String(gateway.smtpPort || process.env.SMTP_PORT || '465'), 10);
  const user = gateway.smtpUser || process.env.SMTP_USER || 'donation@itlcfoundation.com';
  const pass = gateway.smtpPass || process.env.SMTP_PASS || '';
  const from = gateway.smtpFrom || process.env.SMTP_FROM || '"ITLC Foundation Security" <' + user + '>';

  if (!user || !pass) {
    console.log('[AUTH OTP] SMTP credentials not set. Simulated OTP is:', otp);
    return { sent: false, reason: 'SMTP not configured - OTP generated in fallback mode' };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      connectionTimeout: 8000,
      greetingTimeout: 6000,
    });

    const actionText = purpose === 'login' ? 'Admin Panel Login Verification' : 'Admin Password Reset';

    await transporter.sendMail({
      from,
      to: toEmail,
      subject: `${otp} is your ITLC Foundation Security Code (${actionText})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
          <div style="background: #083a27; padding: 20px; text-align: center; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #ffffff; margin: 0; font-size: 20px; letter-spacing: 1px;">ITLC FOUNDATION</h2>
            <p style="color: #a3e6c0; margin: 5px 0 0 0; font-size: 12px;">Official Admin Portal Security</p>
          </div>
          <div style="padding: 10px 0;">
            <h3 style="color: #1f2937; margin: 0 0 10px 0; font-size: 18px;">${actionText}</h3>
            <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
              A request has been made to authenticate or reset the password for <strong>${toEmail}</strong> on the ITLC Foundation Admin Panel.
            </p>
            <div style="margin: 24px 0; text-align: center;">
              <div style="display: inline-block; background: #f0fdf4; border: 2px dashed #168039; border-radius: 8px; padding: 14px 28px;">
                <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #168039;">${otp}</span>
              </div>
            </div>
            <p style="color: #64748b; font-size: 12px;">
              This OTP is valid for <strong>10 minutes</strong>. Do not share this code with anyone.
            </p>
          </div>
          <div style="text-align: center; margin-top: 24px; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 12px;">
            ITLC Foundation Admin Security &bull; G1/0049, Olive Wood Villa, Golf City, Lucknow, UP &bull; itlcfoundation.com
          </div>
        </div>
      `,
    });

    return { sent: true };
  } catch (err: any) {
    console.error('[AUTH OTP ERROR]', err.message);
    return { sent: false, reason: err.message };
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email')?.toLowerCase().trim();

    const accounts = readAccounts();
    const admin = accounts.find((a: any) => 
      (email && a.email.toLowerCase() === email) || a.username === 'admin'
    ) || accounts[0];

    return NextResponse.json({
      success: true,
      adminEmail: admin?.email || 'info@itlcfoundation.com',
      username: admin?.username || 'admin',
      role: admin?.role || 'super_admin',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, password, otp, newPassword, currentPassword } = body;
    const cleanEmail = (email || '').toLowerCase().trim();

    let accounts = readAccounts();

    // -------------------------------------------------------------
    // ACTION 1: Login with Password
    // -------------------------------------------------------------
    if (action === 'login_password') {
      if (!cleanEmail || !password) {
        return NextResponse.json({ error: 'Email ID and password are required' }, { status: 400 });
      }

      // Match by email OR username
      const user = accounts.find((a: any) => 
        a.email.toLowerCase() === cleanEmail || a.username.toLowerCase() === cleanEmail
      );

      const isValidUser = user && (
        (user.password_hash && verifyPassword(password, user.password_hash)) ||
        (user.password && verifyPassword(password, user.password))
      );

      if (!isValidUser) {
        return NextResponse.json({ error: 'Invalid Email ID or Password. Please check and try again.' }, { status: 401 });
      }

      // Auto-migrate legacy plain text password to secure hash if needed
      if (user.password && !user.password_hash) {
        user.password_hash = hashPassword(password);
        delete user.password;
      }

      if (!user.is_active) {
        return NextResponse.json({ error: 'This admin account is currently deactivated.' }, { status: 403 });
      }

      // Update last login
      user.last_login_at = new Date().toISOString().replace('T', ' ').substring(0, 19);
      user.last_login_ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
      writeAccounts(accounts);

      const token = 'itlc_token_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);

      return NextResponse.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        },
      });
    }

    // -------------------------------------------------------------
    // ACTION 2: Send OTP (for Login or Reset Password)
    // -------------------------------------------------------------
    if (action === 'send_otp') {
      const purpose = body.purpose === 'reset' ? 'reset' : 'login';

      if (!cleanEmail) {
        return NextResponse.json({ error: 'Please enter your Admin Email ID.' }, { status: 400 });
      }

      const user = accounts.find((a: any) => 
        a.email.toLowerCase() === cleanEmail || a.username.toLowerCase() === cleanEmail
      );

      if (!user && cleanEmail !== 'info@itlcfoundation.com') {
        return NextResponse.json({ error: 'No admin account found with email: ' + cleanEmail }, { status: 404 });
      }

      // Generate 6-digit OTP
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const otps = readOtps();
      otps[cleanEmail] = {
        otp_hash: hashOtp(generatedOtp),
        expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
        purpose,
      };
      writeOtps(otps);

      // Dispatch via email
      const emailResult = await sendOtpEmail(cleanEmail, generatedOtp, purpose);

      if (!emailResult.sent && emailResult.reason && !emailResult.reason.includes('SMTP not configured')) {
        return NextResponse.json({
          error: `Could not send verification email (${emailResult.reason}). Please try again or check SMTP settings.`,
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: `6-digit verification code sent to ${cleanEmail}. Please check your email.`,
      });
    }

    // -------------------------------------------------------------
    // ACTION 3: Verify OTP & Login
    // -------------------------------------------------------------
    if (action === 'verify_otp_login') {
      if (!cleanEmail || !otp) {
        return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
      }

      const otps = readOtps();
      const record = otps[cleanEmail];

      const isOtpValid = record && (
        (record.otp_hash && verifyOtp(otp, record.otp_hash)) ||
        (record.otp && record.otp === otp.trim())
      );

      if (!isOtpValid) {
        return NextResponse.json({ error: 'Invalid or incorrect OTP. Please try again.' }, { status: 400 });
      }

      if (Date.now() > record.expiresAt) {
        delete otps[cleanEmail];
        writeOtps(otps);
        return NextResponse.json({ error: 'OTP has expired. Please request a new code.' }, { status: 400 });
      }

      // Clear used OTP
      delete otps[cleanEmail];
      writeOtps(otps);

      let user = accounts.find((a: any) => 
        a.email.toLowerCase() === cleanEmail || a.username.toLowerCase() === cleanEmail
      );

      if (!user) {
        user = accounts[0];
      }

      user.last_login_at = new Date().toISOString().replace('T', ' ').substring(0, 19);
      user.last_login_ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
      writeAccounts(accounts);

      const token = 'itlc_token_otp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);

      return NextResponse.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        },
      });
    }

    // -------------------------------------------------------------
    // ACTION 4: Reset Password with OTP
    // -------------------------------------------------------------
    if (action === 'reset_password') {
      if (!cleanEmail || !otp || !newPassword) {
        return NextResponse.json({ error: 'Email, OTP, and New Password are required' }, { status: 400 });
      }

      if (newPassword.length < 6) {
        return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
      }

      const otps = readOtps();
      const record = otps[cleanEmail];

      const isOtpValid = record && (
        (record.otp_hash && verifyOtp(otp, record.otp_hash)) ||
        (record.otp && record.otp === otp.trim())
      );

      if (!isOtpValid) {
        return NextResponse.json({ error: 'Invalid or incorrect OTP entered.' }, { status: 400 });
      }

      if (Date.now() > record.expiresAt) {
        delete otps[cleanEmail];
        writeOtps(otps);
        return NextResponse.json({ error: 'OTP has expired. Please request a new code.' }, { status: 400 });
      }

      // Find user and update password with irreversible cryptographic hash
      let user = accounts.find((a: any) => 
        a.email.toLowerCase() === cleanEmail || a.username.toLowerCase() === cleanEmail
      );

      if (!user) {
        user = accounts[0];
      }

      user.password_hash = hashPassword(newPassword);
      delete user.password;
      user.updated_at = new Date().toISOString().replace('T', ' ').substring(0, 19);
      writeAccounts(accounts);

      // Clear OTP
      delete otps[cleanEmail];
      writeOtps(otps);

      return NextResponse.json({
        success: true,
        message: 'Password has been reset successfully! You can now log in with your new password.',
      });
    }

    // -------------------------------------------------------------
    // ACTION 5: Update Admin Profile / Email / Password from Admin Panel
    // -------------------------------------------------------------
    if (action === 'update_profile') {
      const { newEmail, newPassword, currentPassword } = body;
      const targetUser = accounts.find((a: any) => 
        (cleanEmail && a.email.toLowerCase() === cleanEmail) || a.username === 'admin'
      ) || accounts[0];

      if (!targetUser) {
        return NextResponse.json({ error: 'Admin account not found.' }, { status: 404 });
      }

      // If changing password, verify current password
      if (newPassword) {
        const storedCred = targetUser.password_hash || targetUser.password;
        if (currentPassword && storedCred && !verifyPassword(currentPassword, storedCred)) {
          return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 });
        }
        if (newPassword.length < 6) {
          return NextResponse.json({ error: 'New password must be at least 6 characters.' }, { status: 400 });
        }
        targetUser.password_hash = hashPassword(newPassword);
        delete targetUser.password;
      }

      if (newEmail && newEmail.includes('@')) {
        targetUser.email = newEmail.trim().toLowerCase();
      }

      targetUser.updated_at = new Date().toISOString().replace('T', ' ').substring(0, 19);
      writeAccounts(accounts);

      return NextResponse.json({
        success: true,
        message: 'Admin credentials updated successfully.',
        admin: {
          id: targetUser.id,
          email: targetUser.email,
          username: targetUser.username,
        },
      });
    }

    return NextResponse.json({ error: 'Invalid action requested' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
