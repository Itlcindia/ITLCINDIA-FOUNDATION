import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const teamFile = path.resolve(process.cwd(), 'src/data/team_members.json');

function readTeam() {
  try {
    if (!fs.existsSync(teamFile)) return [];
    return JSON.parse(fs.readFileSync(teamFile, 'utf8'));
  } catch (err) {
    return [];
  }
}

function writeTeam(team: any[]) {
  fs.writeFileSync(teamFile, JSON.stringify(team, null, 2), 'utf8');
}

export async function GET() {
  const team = readTeam();
  return NextResponse.json({ success: true, team });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.name || !body.designation) {
      return NextResponse.json({ error: 'Name and designation required' }, { status: 400 });
    }

    const team = readTeam();
    const newMember = {
      id: 'team-' + Date.now(),
      name: body.name.trim(),
      designation: body.designation.trim(),
      image: body.image || '/pro/ab.png',
      bio: body.bio || '',
      social_links: body.social_links || {},
      sort_order: Number(body.sort_order) || team.length + 1,
      is_active: body.is_active !== undefined ? Boolean(body.is_active) : true,
    };

    team.push(newMember);
    writeTeam(team);

    return NextResponse.json({ success: true, member: newMember });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const team = readTeam();

    const idx = team.findIndex((t: any) => t.id === body.id);
    if (idx === -1) return NextResponse.json({ error: 'Member not found' }, { status: 404 });

    team[idx] = {
      ...team[idx],
      name: body.name || team[idx].name,
      designation: body.designation || team[idx].designation,
      image: body.image || team[idx].image,
      bio: body.bio !== undefined ? body.bio : team[idx].bio,
      sort_order: body.sort_order !== undefined ? Number(body.sort_order) : team[idx].sort_order,
      is_active: body.is_active !== undefined ? Boolean(body.is_active) : team[idx].is_active,
    };

    writeTeam(team);
    return NextResponse.json({ success: true, member: team[idx] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    let team = readTeam();
    team = team.filter((t: any) => t.id !== id);
    writeTeam(team);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
