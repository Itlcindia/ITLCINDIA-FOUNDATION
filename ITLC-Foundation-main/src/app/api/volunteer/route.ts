import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

const volunteersFilePath = path.join(process.cwd(), 'src', 'data', 'volunteers.json');

function saveVolunteer(record: any) {
  try {
    let list: any[] = [];
    if (fs.existsSync(volunteersFilePath)) {
      const data = fs.readFileSync(volunteersFilePath, 'utf8');
      list = JSON.parse(data);
    }
    list.unshift(record);
    const dir = path.dirname(volunteersFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(volunteersFilePath, JSON.stringify(list, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving volunteer to volunteers.json:', err);
  }
}

export async function GET() {
  try {
    if (!fs.existsSync(volunteersFilePath)) {
      return NextResponse.json({ success: true, volunteers: [], total: 0 });
    }
    const data = fs.readFileSync(volunteersFilePath, 'utf8');
    const list = JSON.parse(data);
    return NextResponse.json({ success: true, volunteers: list, total: list.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      fullName,
      email,
      phone,
      city = 'Lucknow',
      age,
      causeArea = 'All / General Support',
      availability = 'Weekends',
      message = '',
    } = body;

    // Validation
    if (!fullName || fullName.trim().length < 2) {
      return NextResponse.json(
        { error: 'Please enter a valid full name (at least 2 characters)' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    if (!phone || phone.trim().length < 8) {
      return NextResponse.json(
        { error: 'Please enter a valid phone or WhatsApp number' },
        { status: 400 }
      );
    }

    const applicationRecord = {
      id: 'vol_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      city: city.trim(),
      age: age ? Number(age) : null,
      causeArea,
      availability,
      message: message.trim(),
      status: 'pending',
      appliedAt: new Date().toISOString(),
      appliedDate: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };

    saveVolunteer(applicationRecord);

    // Send acknowledgment email via Hostinger SMTP (non-blocking)
    const smtpHost = process.env.SMTP_HOST || 'smtp.hostinger.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
    const smtpUser = process.env.SMTP_USER || 'donation@itlcfoundation.com';
    const smtpPass = process.env.SMTP_PASS || 'Itlc@1000';
    const smtpFrom = process.env.SMTP_FROM || '"ITLC Foundation" <donation@itlcfoundation.com>';

    if (smtpUser && smtpPass && smtpUser !== 'your_email@gmail.com') {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: { user: smtpUser, pass: smtpPass },
          connectionTimeout: 8000,
        });

        const mailOptions = {
          from: smtpFrom,
          to: email.trim(),
          subject: 'Welcome to the ITLC Foundation Volunteer Community! 🌿🤝',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
              <div style="background: #083a27; padding: 24px; text-align: center; color: #ffffff;">
                <h1 style="margin: 0; font-size: 22px; text-transform: uppercase;">ITLC FOUNDATION</h1>
                <p style="margin: 4px 0 0 0; font-size: 12px; color: #a7f3d0;">Empowering Communities Through Learning & Care</p>
              </div>
              <div style="padding: 28px 24px; color: #1e293b; line-height: 1.6;">
                <h2 style="font-size: 18px; color: #083a27; margin-top: 0;">Dear ${fullName.trim()},</h2>
                <p>Thank you for offering your time, passion, and skills to volunteer with <strong>ITLC Foundation</strong>! We are thrilled to welcome you to our on-ground movement in Uttar Pradesh.</p>
                
                <div style="background: #f8fafc; border-left: 4px solid #168039; padding: 14px 18px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                  <p style="margin: 0 0 6px 0; font-weight: bold; color: #0f172a;">Application Summary:</p>
                  <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #334155;">
                    <li><strong>Cause Area:</strong> ${causeArea}</li>
                    <li><strong>Preferred Availability:</strong> ${availability}</li>
                    <li><strong>Location:</strong> ${city}</li>
                    <li><strong>Application ID:</strong> ${applicationRecord.id}</li>
                  </ul>
                </div>

                <p>Our volunteer coordination team in Lucknow will review your profile and connect with you via WhatsApp or Email before our upcoming on-ground drive.</p>
                <p style="margin-bottom: 0;">Together, let us build a greener, kinder, and stronger Uttar Pradesh.</p>
                
                <p style="margin-top: 24px;">Warm regards,<br/><strong>Volunteer Relations Team</strong><br/>ITLC Foundation Lucknow</p>
              </div>
              <div style="background: #f1f5f9; padding: 14px 24px; text-align: center; font-size: 11px; color: #64748b;">
                G1/0049, Olive Wood Villa, Golf City, Lucknow, UP – 226030 | info@itlcfoundation.org
              </div>
            </div>
          `,
        };

        // Fire and don't block response
        transporter.sendMail(mailOptions).catch((err) => {
          console.warn('Volunteer acknowledgment email dispatch error:', err);
        });
      } catch (mailErr) {
        console.warn('SMTP connection failed for volunteer dispatch:', mailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Your volunteer application has been received successfully!',
      volunteerId: applicationRecord.id,
    });
  } catch (error: any) {
    console.error('Error processing volunteer application:', error);
    return NextResponse.json(
      { error: 'Internal server error processing application' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, notes } = body;
    if (!id) {
      return NextResponse.json({ error: 'Volunteer ID is required' }, { status: 400 });
    }

    if (!fs.existsSync(volunteersFilePath)) {
      return NextResponse.json({ error: 'Volunteer not found' }, { status: 404 });
    }

    const list = JSON.parse(fs.readFileSync(volunteersFilePath, 'utf8'));
    const index = list.findIndex((v: any) => v.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Volunteer not found' }, { status: 404 });
    }

    list[index] = {
      ...list[index],
      status: status || list[index].status,
      notes: notes !== undefined ? notes : list[index].notes,
      updatedAt: new Date().toISOString(),
    };

    fs.writeFileSync(volunteersFilePath, JSON.stringify(list, null, 2), 'utf8');
    return NextResponse.json({ success: true, volunteer: list[index] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Volunteer ID is required' }, { status: 400 });
    }

    if (!fs.existsSync(volunteersFilePath)) {
      return NextResponse.json({ error: 'Volunteer not found' }, { status: 404 });
    }

    let list = JSON.parse(fs.readFileSync(volunteersFilePath, 'utf8'));
    const beforeCount = list.length;
    list = list.filter((v: any) => v.id !== id);

    if (list.length === beforeCount) {
      return NextResponse.json({ error: 'Volunteer not found' }, { status: 404 });
    }

    fs.writeFileSync(volunteersFilePath, JSON.stringify(list, null, 2), 'utf8');
    return NextResponse.json({ success: true, message: 'Volunteer application deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

