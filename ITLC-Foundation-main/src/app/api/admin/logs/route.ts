import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const logsFile = path.resolve(process.cwd(), 'src/data/activity_logs.json');

function readLogs() {
  try {
    if (!fs.existsSync(logsFile)) return [];
    return JSON.parse(fs.readFileSync(logsFile, 'utf8'));
  } catch (err) {
    return [];
  }
}

function writeLogs(logs: any[]) {
  fs.writeFileSync(logsFile, JSON.stringify(logs, null, 2), 'utf8');
}

export async function GET() {
  const logs = readLogs();
  return NextResponse.json({ success: true, logs });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const logs = readLogs();

    const newLog = {
      id: 'log-' + Date.now(),
      admin_username: body.admin_username || 'admin',
      role: body.role || 'super_admin',
      action: body.action || 'GENERAL_ACTION',
      entity_type: body.entity_type || 'System',
      entity_title: body.entity_title || '',
      ip_address: req.headers.get('x-forwarded-for') || '127.0.0.1',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    logs.unshift(newLog); // prepend latest
    if (logs.length > 200) logs.length = 200; // keep last 200
    writeLogs(logs);

    return NextResponse.json({ success: true, log: newLog });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
