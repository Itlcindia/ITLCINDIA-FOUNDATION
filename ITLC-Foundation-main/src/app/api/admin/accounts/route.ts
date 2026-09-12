import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { hashPassword } from '@/lib/encryption';

const accountsFile = path.resolve(process.cwd(), 'src/data/admin_accounts.json');

function readAccounts() {
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

export async function GET() {
  const accounts = readAccounts();
  const sanitized = accounts.map(({ password, password_hash, ...rest }: any) => rest);
  return NextResponse.json({ success: true, accounts: sanitized });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const accounts = readAccounts();

    if (!body.username || !body.email || !body.role) {
      return NextResponse.json({ error: 'Username, email and role are required' }, { status: 400 });
    }

    const existing = accounts.find((a: any) => a.username.toLowerCase() === body.username.toLowerCase());
    if (existing) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
    }

    const initialPassword = body.password ? String(body.password) : 'admin123';

    const newAdmin = {
      id: 'admin-' + Date.now(),
      username: body.username.trim(),
      email: body.email.trim(),
      role: body.role,
      is_active: body.is_active !== undefined ? Boolean(body.is_active) : true,
      password_hash: hashPassword(initialPassword),
      last_login_at: null,
      last_login_ip: null,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    accounts.push(newAdmin);
    writeAccounts(accounts);

    const { password_hash, ...safeAdmin } = newAdmin;
    return NextResponse.json({ success: true, admin: safeAdmin });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    let accounts = readAccounts();

    const index = accounts.findIndex((a: any) => a.id === body.id || a.username === body.username);
    if (index === -1) {
      return NextResponse.json({ error: 'Admin account not found' }, { status: 404 });
    }

    accounts[index] = {
      ...accounts[index],
      role: body.role || accounts[index].role,
      is_active: body.is_active !== undefined ? Boolean(body.is_active) : accounts[index].is_active,
      email: body.email || accounts[index].email,
      updated_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    if (body.password) {
      accounts[index].password_hash = hashPassword(body.password);
      delete accounts[index].password;
    }

    writeAccounts(accounts);
    const { password_hash, password, ...safeAdmin } = accounts[index];
    return NextResponse.json({ success: true, admin: safeAdmin });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const username = searchParams.get('username');

    if (!id && !username) {
      return NextResponse.json({ error: 'ID or username required' }, { status: 400 });
    }

    if (username === 'admin') {
      return NextResponse.json({ error: 'Primary SuperAdmin account cannot be deleted' }, { status: 403 });
    }

    let accounts = readAccounts();
    accounts = accounts.filter((a: any) => a.id !== id && a.username !== username);
    writeAccounts(accounts);

    return NextResponse.json({ success: true, message: 'Account deleted' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
