import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';
import { getPool, isDbConnected } from '@/lib/db';

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
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.warn('Could not write to blogs.json fallback:', err);
  }
}

// ----------------------------------------------------------------------
// MySQL Database Operations (Permanent Storage on Hostinger)
// ----------------------------------------------------------------------

let tablesEnsured = false;
async function ensureBlogsTables(pool: any) {
  if (tablesEnsured) return;
  try {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS \`blog_categories\` (
        \`id\` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        \`name\` VARCHAR(100) NOT NULL,
        \`slug\` VARCHAR(120) NOT NULL UNIQUE,
        \`description\` TEXT DEFAULT NULL,
        \`is_active\` TINYINT(1) NOT NULL DEFAULT 1,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS \`blogs\` (
        \`id\` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        \`category_id\` INT UNSIGNED DEFAULT NULL,
        \`slug\` VARCHAR(255) NOT NULL UNIQUE,
        \`title\` VARCHAR(255) NOT NULL,
        \`excerpt\` TEXT NOT NULL,
        \`author\` VARCHAR(100) DEFAULT NULL,
        \`image_url\` VARCHAR(500) NOT NULL,
        \`images_json\` JSON DEFAULT NULL,
        \`content_image_url\` VARCHAR(500) DEFAULT NULL,
        \`content\` LONGTEXT NOT NULL,
        \`tags_json\` JSON DEFAULT NULL,
        \`key_points_json\` JSON DEFAULT NULL,
        \`read_time\` VARCHAR(50) DEFAULT '6 min read',
        \`design_style\` VARCHAR(50) DEFAULT 'default',
        \`meta_title\` VARCHAR(255) DEFAULT NULL,
        \`meta_description\` VARCHAR(320) DEFAULT NULL,
        \`meta_keywords\` TEXT DEFAULT NULL,
        \`canonical_url\` VARCHAR(500) DEFAULT NULL,
        \`og_title\` VARCHAR(255) DEFAULT NULL,
        \`og_description\` TEXT DEFAULT NULL,
        \`og_image_url\` VARCHAR(500) DEFAULT NULL,
        \`seo_index\` TINYINT(1) NOT NULL DEFAULT 1,
        \`status\` ENUM('draft', 'scheduled', 'published', 'archived') NOT NULL DEFAULT 'published',
        \`is_featured\` TINYINT(1) NOT NULL DEFAULT 0,
        \`scheduled_at\` DATETIME DEFAULT NULL,
        \`published_at\` DATETIME DEFAULT NULL,
        \`created_by\` INT UNSIGNED DEFAULT NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (\`category_id\`) REFERENCES \`blog_categories\`(\`id\`) ON DELETE SET NULL,
        INDEX \`idx_blog_status\` (\`status\`, \`published_at\`),
        INDEX \`idx_blog_category\` (\`category_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS \`blog_faqs\` (
        \`id\` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        \`blog_id\` BIGINT UNSIGNED NOT NULL,
        \`question\` TEXT NOT NULL,
        \`answer\` TEXT NOT NULL,
        \`sort_order\` INT NOT NULL DEFAULT 0,
        \`is_active\` TINYINT(1) NOT NULL DEFAULT 1,
        FOREIGN KEY (\`blog_id\`) REFERENCES \`blogs\`(\`id\`) ON DELETE CASCADE,
        INDEX \`idx_blog_faq\` (\`blog_id\`, \`is_active\`, \`sort_order\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    tablesEnsured = true;
  } catch (err: any) {
    console.warn('[DB Blogs] Table ensure note:', err?.message || err);
  }
}

let seeded = false;
async function seedBlogsIfEmpty(pool: any) {
  if (seeded) return;
  try {
    const [countRows]: any = await pool.execute('SELECT COUNT(*) as cnt FROM blogs');
    if (countRows && countRows[0]?.cnt > 0) {
      seeded = true;
      return;
    }

    const jsonBlogs = getBlogsData();
    if (!Array.isArray(jsonBlogs) || jsonBlogs.length === 0) {
      seeded = true;
      return;
    }

    console.log(`[DB Blogs] Auto-seeding ${jsonBlogs.length} initial blogs into MySQL database...`);
    for (const b of jsonBlogs) {
      await saveBlogToDb(pool, b);
    }
    seeded = true;
    console.log('[DB Blogs] Auto-seeding complete!');
  } catch (err) {
    console.warn('[DB Blogs] Seeding warning:', err);
  }
}

async function saveBlogToDb(pool: any, blog: any): Promise<number | null> {
  let categoryId: number | null = null;
  const catName = (blog.category || 'General').trim();
  const catSlug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'general';

  try {
    await pool.execute(
      'INSERT INTO blog_categories (name, slug) VALUES (?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name)',
      [catName, catSlug]
    );
    const [catRows]: any = await pool.execute('SELECT id FROM blog_categories WHERE slug = ? LIMIT 1', [catSlug]);
    if (catRows && catRows[0]) categoryId = catRows[0].id;
  } catch (e) {
    console.warn('[DB Blogs] Category mapping warning:', e);
  }

  const status = blog.status === 'draft' ? 'draft' : 'published';
  const isFeatured = blog.isFeatured ? 1 : 0;
  const tagsJson = JSON.stringify(Array.isArray(blog.tags) ? blog.tags : ['Community', 'UP']);
  const keyPointsJson = JSON.stringify(Array.isArray(blog.keyPoints) ? blog.keyPoints : []);
  const images = Array.isArray(blog.images) && blog.images.length > 0 ? blog.images : [blog.image || '/pro/ab.png'];
  const imagesJson = JSON.stringify(images);
  const mainImage = images[0] || '/pro/ab.png';
  const parsedDate = blog.date ? new Date(blog.date) : new Date();
  const publishedAt = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;

  const sql = `
    INSERT INTO blogs (
      category_id, slug, title, excerpt, author, image_url, images_json,
      content_image_url, content, tags_json, key_points_json, read_time,
      design_style, meta_title, meta_description, status, is_featured, published_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      category_id = VALUES(category_id),
      title = VALUES(title),
      excerpt = VALUES(excerpt),
      author = VALUES(author),
      image_url = VALUES(image_url),
      images_json = VALUES(images_json),
      content_image_url = VALUES(content_image_url),
      content = VALUES(content),
      tags_json = VALUES(tags_json),
      key_points_json = VALUES(key_points_json),
      read_time = VALUES(read_time),
      design_style = VALUES(design_style),
      meta_title = VALUES(meta_title),
      meta_description = VALUES(meta_description),
      status = VALUES(status),
      is_featured = VALUES(is_featured),
      published_at = VALUES(published_at),
      updated_at = CURRENT_TIMESTAMP
  `;

  const params = [
    categoryId,
    blog.slug,
    blog.title,
    blog.excerpt || '',
    blog.author || 'ITLC Foundation',
    mainImage,
    imagesJson,
    blog.contentImage || '',
    blog.content || '',
    tagsJson,
    keyPointsJson,
    blog.readTime || '6 min read',
    blog.authorRole || '',
    blog.metaTitle || '',
    blog.metaDescription || '',
    status,
    isFeatured,
    publishedAt,
  ];

  await pool.execute(sql, params);

  const [blogRows]: any = await pool.execute('SELECT id FROM blogs WHERE slug = ? LIMIT 1', [blog.slug]);
  const blogId = blogRows && blogRows[0] ? blogRows[0].id : null;

  if (blogId && Array.isArray(blog.faqs)) {
    try {
      await pool.execute('DELETE FROM blog_faqs WHERE blog_id = ?', [blogId]);
      for (let i = 0; i < blog.faqs.length; i++) {
        const f = blog.faqs[i];
        if (f && f.question && String(f.question).trim()) {
          await pool.execute(
            'INSERT INTO blog_faqs (blog_id, question, answer, sort_order, is_active) VALUES (?, ?, ?, ?, 1)',
            [blogId, String(f.question).trim(), String(f.answer || '').trim(), i]
          );
        }
      }
    } catch (faqErr) {
      console.warn('[DB Blogs] FAQ insert error:', faqErr);
    }
  }

  return blogId;
}

async function getBlogsFromDb(pool: any, slug?: string): Promise<any[] | null> {
  try {
    let sql = `
      SELECT b.*, c.name as category_name
      FROM blogs b
      LEFT JOIN blog_categories c ON b.category_id = c.id
    `;
    const params: any[] = [];
    if (slug) {
      sql += ' WHERE b.slug = ? LIMIT 1';
      params.push(slug);
    } else {
      sql += ' ORDER BY b.id DESC';
    }

    const [rows]: any = await pool.execute(sql, params);
    if (!rows || rows.length === 0) {
      return slug ? null : [];
    }

    const blogIds = rows.map((r: any) => r.id);
    const faqsByBlog: Record<number, any[]> = {};
    if (blogIds.length > 0) {
      const placeholders = blogIds.map(() => '?').join(',');
      const [faqRows]: any = await pool.execute(
        `SELECT blog_id, question, answer FROM blog_faqs WHERE blog_id IN (${placeholders}) AND is_active = 1 ORDER BY sort_order ASC`,
        blogIds
      );
      if (faqRows) {
        faqRows.forEach((f: any) => {
          if (!faqsByBlog[f.blog_id]) faqsByBlog[f.blog_id] = [];
          faqsByBlog[f.blog_id].push({ question: f.question, answer: f.answer });
        });
      }
    }

    return rows.map((r: any) => {
      let images: string[] = [];
      try {
        images = typeof r.images_json === 'string' ? JSON.parse(r.images_json) : (r.images_json || []);
      } catch (e) {}

      let tags: string[] = [];
      try {
        tags = typeof r.tags_json === 'string' ? JSON.parse(r.tags_json) : (r.tags_json || []);
      } catch (e) {}

      let keyPoints: string[] = [];
      try {
        keyPoints = typeof r.key_points_json === 'string' ? JSON.parse(r.key_points_json) : (r.key_points_json || []);
      } catch (e) {}

      const dateObj = r.published_at ? new Date(r.published_at) : new Date(r.created_at);
      const dateStr = !isNaN(dateObj.getTime())
        ? dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : 'September 12, 2026';

      return {
        id: `blog-${r.id}`,
        slug: r.slug,
        title: r.title,
        category: r.category_name || 'General',
        excerpt: r.excerpt,
        author: r.author || 'ITLC Foundation',
        authorRole: r.design_style || 'Editorial & Field Team',
        date: dateStr,
        readTime: r.read_time || '6 min read',
        image: r.image_url || '/pro/ab.png',
        images: images.length > 0 ? images : [r.image_url || '/pro/ab.png'],
        contentImage: r.content_image_url || '',
        tags,
        keyPoints,
        content: r.content,
        faqs: faqsByBlog[r.id] || [],
        metaTitle: r.meta_title || '',
        metaDescription: r.meta_description || '',
        status: r.status,
        isFeatured: Boolean(r.is_featured),
        updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
      };
    });
  } catch (err) {
    console.error('[DB Blogs] Error querying MySQL:', err);
    return null;
  }
}

async function deleteBlogFromDb(pool: any, idOrSlug: string): Promise<boolean> {
  try {
    const isNum = !isNaN(Number(idOrSlug.replace(/^blog-/, '')));
    if (isNum) {
      const numId = Number(idOrSlug.replace(/^blog-/, ''));
      await pool.execute('DELETE FROM blogs WHERE id = ?', [numId]);
    } else {
      await pool.execute('DELETE FROM blogs WHERE slug = ?', [idOrSlug]);
    }
    return true;
  } catch (err) {
    console.error('[DB Blogs] Error deleting from MySQL:', err);
    return false;
  }
}

// ----------------------------------------------------------------------
// Route Handlers (GET, POST, DELETE)
// ----------------------------------------------------------------------

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    const connected = await isDbConnected();
    if (connected) {
      const pool = getPool();
      await ensureBlogsTables(pool);
      await seedBlogsIfEmpty(pool);

      const dbBlogs = await getBlogsFromDb(pool, slug || undefined);
      if (dbBlogs !== null) {
        if (slug) {
          if (dbBlogs.length === 0) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
          }
          return NextResponse.json({ success: true, blog: dbBlogs[0] });
        }
        return NextResponse.json({ success: true, blogs: dbBlogs });
      }
    }

    // JSON fallback (offline local PC or DB failure)
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
      authorRole: body.authorRole ? String(body.authorRole).trim() : '',
      date: body.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readTime: body.readTime || '5 min read',
      image: images[0] || '/pro/ab.png',
      images,
      contentImage: body.contentImage ? String(body.contentImage).trim() : '',
      tags: Array.isArray(body.tags) ? body.tags : (body.tags ? body.tags.split(',').map((t: string) => t.trim()) : ['Community', 'UP']),
      keyPoints: Array.isArray(body.keyPoints) ? body.keyPoints : (body.keyPoints ? body.keyPoints.split('\n').map((k: string) => k.trim()).filter(Boolean) : []),
      content: body.content || '',
      faqs: Array.isArray(body.faqs)
        ? body.faqs
            .filter((f: any) => f && (typeof f.question === 'string' && f.question.trim()))
            .map((f: any) => ({
              question: String(f.question).trim(),
              answer: String(f.answer || '').trim(),
            }))
        : [],
      metaTitle: body.metaTitle ? String(body.metaTitle).trim() : '',
      metaDescription: body.metaDescription ? String(body.metaDescription).trim() : '',
      status: body.status === 'draft' ? 'draft' : 'published',
      isFeatured: Boolean(body.isFeatured),
      updatedAt: new Date().toISOString(),
    };

    // 1. Update fallback JSON file
    const blogs = getBlogsData();
    const existingIndex = blogs.findIndex((b) => b.id === id || b.slug === slug);
    if (existingIndex >= 0) {
      blogs[existingIndex] = { ...blogs[existingIndex], ...newBlog };
    } else {
      blogs.unshift(newBlog);
    }
    saveBlogsData(blogs);

    // 2. Save permanently to MySQL database if available
    const connected = await isDbConnected();
    if (connected) {
      const pool = getPool();
      await ensureBlogsTables(pool);
      await saveBlogToDb(pool, newBlog);
    }

    try { revalidatePath('/sitemap.xml'); } catch (e) {}
    try { revalidatePath('/blog'); } catch (e) {}
    try { revalidatePath(`/blog/${slug}`); } catch (e) {}

    return NextResponse.json({ success: true, blog: newBlog, message: 'Blog saved permanently to database!' });
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

    // 1. Delete from fallback JSON file
    const blogs = getBlogsData();
    const filtered = blogs.filter((b) => (id ? b.id !== id : b.slug !== slug));
    saveBlogsData(filtered);

    // 2. Delete permanently from MySQL database if available
    const connected = await isDbConnected();
    if (connected) {
      const pool = getPool();
      await deleteBlogFromDb(pool, id || slug || '');
    }

    try { revalidatePath('/sitemap.xml'); } catch (e) {}
    try { revalidatePath('/blog'); } catch (e) {}

    return NextResponse.json({ success: true, message: 'Blog deleted successfully from database' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
