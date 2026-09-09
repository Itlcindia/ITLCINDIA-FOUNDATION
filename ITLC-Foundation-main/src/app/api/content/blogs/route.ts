import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src', 'data', 'blogs.json');

function getBlogsData(): any[] {
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    console.error('Error reading blogs.json:', err);
    return [];
  }
}

function saveBlogsData(data: any[]): void {
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
    const blogs = getBlogsData();

    if (slug) {
      const blog = blogs.find((b) => b.slug === slug);
      if (!blog) {
        return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, blog });
    }

    return NextResponse.json({ success: true, blogs });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const blogs = getBlogsData();

    // Required field validation
    if (!body.title || !body.title.trim()) {
      return NextResponse.json({ error: 'Blog title is required' }, { status: 400 });
    }

    const slug =
      body.slug && body.slug.trim()
        ? body.slug
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
        : body.title
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');

    const id = body.id || `blog-${Date.now()}`;
    const images = Array.isArray(body.images) && body.images.length > 0
      ? body.images
      : [body.image || '/pro/ab.png'];

    const newBlog = {
      id,
      slug,
      title: body.title.trim(),
      category: body.category || 'General',
      excerpt: body.excerpt || '',
      author: body.author || 'ITLC Foundation Editorial Team',
      date: body.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readTime: body.readTime || '5 min read',
      image: images[0] || '/pro/ab.png',
      images,
      tags: Array.isArray(body.tags) ? body.tags : (body.tags ? body.tags.split(',').map((t: string) => t.trim()) : ['Community', 'UP']),
      keyPoints: Array.isArray(body.keyPoints) ? body.keyPoints : (body.keyPoints ? body.keyPoints.split('\n').map((k: string) => k.trim()).filter(Boolean) : []),
      content: body.content || '',
      updatedAt: new Date().toISOString(),
    };

    const existingIndex = blogs.findIndex((b) => b.id === id || b.slug === slug);
    if (existingIndex >= 0) {
      blogs[existingIndex] = { ...blogs[existingIndex], ...newBlog };
    } else {
      blogs.unshift(newBlog);
    }

    saveBlogsData(blogs);
    return NextResponse.json({ success: true, blog: newBlog, message: 'Blog saved successfully' });
  } catch (err: any) {
    console.error('Error saving blog:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');

    if (!id && !slug) {
      return NextResponse.json({ error: 'id or slug is required to delete' }, { status: 400 });
    }

    const blogs = getBlogsData();
    const filtered = blogs.filter((b) => (id ? b.id !== id : b.slug !== slug));

    if (filtered.length === blogs.length) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    saveBlogsData(filtered);
    return NextResponse.json({ success: true, message: 'Blog deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
