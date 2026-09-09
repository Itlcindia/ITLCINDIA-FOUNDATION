import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src', 'data', 'projects.json');

function getProjectsData(): any[] {
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    console.error('Error reading projects.json:', err);
    return [];
  }
}

function saveProjectsData(data: any[]): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    const featured = searchParams.get('featured');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const includeDrafts = searchParams.get('includeDrafts') === 'true';

    let projects = getProjectsData();

    if (slug) {
      const project = projects.find((p) => p.slug === slug);
      if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, project });
    }

    // Filter by published unless admin requested drafts
    if (!includeDrafts) {
      projects = projects.filter((p) => p.published);
    }

    if (featured === 'true') {
      projects = projects.filter((p) => p.is_featured);
    }

    if (category && category !== 'All') {
      projects = projects.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase()
      );
    }

    if (status && status !== 'All') {
      projects = projects.filter(
        (p) => p.status?.toLowerCase() === status.toLowerCase()
      );
    }

    // Sort by display_order ascending, then created_at descending
    projects.sort((a, b) => {
      const orderA = a.display_order ?? 999;
      const orderB = b.display_order ?? 999;
      if (orderA !== orderB) return orderA - orderB;
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    });

    return NextResponse.json({ success: true, projects });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const projects = getProjectsData();

    if (!body.title || !body.title.trim()) {
      return NextResponse.json({ error: 'Project title is required' }, { status: 400 });
    }

    let slug =
      body.slug && body.slug.trim()
        ? body.slug
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        : body.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

    if (!slug) {
      slug = 'project-' + Date.now();
    }

    // Ensure slug is unique
    let finalSlug = slug;
    let counter = 1;
    while (projects.some((p) => p.slug === finalSlug)) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    const newProject = {
      id: body.id || `proj-${Date.now()}`,
      slug: finalSlug,
      title: body.title.trim(),
      category: body.category || 'General',
      goal: Number(body.goal) || 0,
      raised: Number(body.raised) || 0,
      short_description: body.short_description || '',
      description: body.description || '',
      why_matters: body.why_matters || '',
      status: body.status || 'Ongoing',
      start_date: body.start_date || new Date().toISOString().split('T')[0],
      end_date: body.end_date || '',
      location: body.location || 'Lucknow, Uttar Pradesh',
      city: body.city || 'Lucknow',
      state: body.state || 'Uttar Pradesh',
      country: body.country || 'India',
      featured_image: body.featured_image || '/pro/tree.png',
      image_alt: body.image_alt || body.title.trim(),
      objectives: Array.isArray(body.objectives) ? body.objectives : [],
      activities: Array.isArray(body.activities) ? body.activities : [],
      impact_description: body.impact_description || '',
      statistics: Array.isArray(body.statistics) ? body.statistics : [],
      gallery: Array.isArray(body.gallery) ? body.gallery : [],
      video_url: body.video_url || '',
      related_blogs: Array.isArray(body.related_blogs) ? body.related_blogs : [],
      enable_donation: body.enable_donation !== false,
      donation_button_text: body.donation_button_text || 'Donate Now',
      donation_url: body.donation_url || '',
      enable_volunteer: body.enable_volunteer !== false,
      volunteer_button_text: body.volunteer_button_text || 'Become a Volunteer',
      volunteer_url: body.volunteer_url || '/volunteer',
      meta_title: body.meta_title || `${body.title} | ITLC Foundation`,
      meta_description: body.meta_description || body.short_description || '',
      focus_keyword: body.focus_keyword || '',
      canonical_url: body.canonical_url || `https://itlc.foundation/projects/${finalSlug}`,
      og_title: body.og_title || body.title.trim(),
      og_description: body.og_description || body.short_description || '',
      og_image: body.og_image || body.featured_image || '/pro/tree.png',
      is_featured: Boolean(body.is_featured),
      display_order: Number(body.display_order) || projects.length + 1,
      published: body.published !== false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    projects.push(newProject);
    saveProjectsData(projects);

    return NextResponse.json({ success: true, project: newProject });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const projects = getProjectsData();

    const id = body.id;
    if (!id) {
      return NextResponse.json({ error: 'Project id is required' }, { status: 400 });
    }

    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Sanitize slug if changed
    let slug = body.slug;
    if (slug) {
      slug = slug
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      const duplicate = projects.find((p) => p.slug === slug && p.id !== id);
      if (duplicate) {
        return NextResponse.json({ error: 'Project slug is already in use by another project' }, { status: 400 });
      }
    } else {
      slug = projects[index].slug;
    }

    projects[index] = {
      ...projects[index],
      ...body,
      slug,
      updated_at: new Date().toISOString(),
    };

    saveProjectsData(projects);
    return NextResponse.json({ success: true, project: projects[index] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    let projects = getProjectsData();
    const beforeCount = projects.length;
    projects = projects.filter((p) => p.id !== id);

    if (projects.length === beforeCount) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    saveProjectsData(projects);
    return NextResponse.json({ success: true, message: 'Project deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
