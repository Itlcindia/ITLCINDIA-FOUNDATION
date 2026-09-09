const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

// Setup multer for image uploads
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|gif|svg/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images (jpg, png, webp, gif, svg) are allowed!'));
  }
});

// Image Upload Endpoint
router.post('/upload', authMiddleware, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// 1. NAVBAR LINKS
router.get('/navbar', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM navbar_links ORDER BY sort_order ASC');
    // Group parent and children
    const parents = rows.filter(item => item.parent_id === null);
    const result = parents.map(parent => {
      const children = rows.filter(item => item.parent_id === parent.id);
      return {
        id: parent.id,
        label: parent.label,
        href: parent.href,
        sort_order: parent.sort_order,
        page_title: parent.page_title,
        page_content: parent.page_content,
        page_image_url: parent.page_image_url,
        page_image_hint: parent.page_image_hint,
        children: children.length > 0 ? children.map(c => ({ 
          id: c.id, 
          label: c.label, 
          href: c.href, 
          sort_order: c.sort_order,
          page_title: c.page_title,
          page_content: c.page_content,
          page_image_url: c.page_image_url,
          page_image_hint: c.page_image_hint
        })) : undefined
      };
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/navbar', authMiddleware, async (req, res) => {
  const { label, href, parent_id, sort_order, page_title, page_content, page_image_url, page_image_hint } = req.body;
  if (!label || !href) {
    return res.status(400).json({ error: 'Label and href are required' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO navbar_links (label, href, parent_id, sort_order, page_title, page_content, page_image_url, page_image_hint) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [label, href, parent_id || null, sort_order || 0, page_title || '', page_content || '', page_image_url || '', page_image_hint || '']
    );
    res.status(201).json({ message: 'Navbar link created', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/navbar/:id', authMiddleware, async (req, res) => {
  const { label, href, parent_id, sort_order, page_title, page_content, page_image_url, page_image_hint } = req.body;
  try {
    await pool.query(
      'UPDATE navbar_links SET label = ?, href = ?, parent_id = ?, sort_order = ?, page_title = ?, page_content = ?, page_image_url = ?, page_image_hint = ? WHERE id = ?',
      [label, href, parent_id || null, sort_order || 0, page_title || '', page_content || '', page_image_url || '', page_image_hint || '', req.params.id]
    );
    res.json({ message: 'Navbar link updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/navbar/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM navbar_links WHERE id = ?', [req.params.id]);
    res.json({ message: 'Navbar link deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 2. HERO SECTION
router.get('/hero', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM hero_content ORDER BY id DESC LIMIT 1');
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Hero content not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/hero', authMiddleware, async (req, res) => {
  const { heading, paragraph, image_url } = req.body;
  if (!heading || !paragraph || !image_url) {
    return res.status(400).json({ error: 'Heading, paragraph, and image URL are required' });
  }
  try {
    // Check if hero content exists, if not insert, else update
    const [rows] = await pool.query('SELECT id FROM hero_content LIMIT 1');
    if (rows.length === 0) {
      await pool.query(
        'INSERT INTO hero_content (heading, paragraph, image_url) VALUES (?, ?, ?)',
        [heading, paragraph, image_url]
      );
    } else {
      await pool.query(
        'UPDATE hero_content SET heading = ?, paragraph = ?, image_url = ? WHERE id = ?',
        [heading, paragraph, image_url, rows[0].id]
      );
    }
    res.json({ message: 'Hero content updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 3. KEY PROJECTS
router.get('/projects', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM key_projects ORDER BY sort_order ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/projects', authMiddleware, async (req, res) => {
  const { title, category, description, image_url, image_hint, progress, status, is_main, sort_order } = req.body;
  if (!title || !category || !description || !image_url) {
    return res.status(400).json({ error: 'Title, category, description, and image URL are required' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO key_projects (title, category, description, image_url, image_hint, progress, status, is_main, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, category, description, image_url, image_hint || '', progress || 0, status || 'Ongoing', is_main ? 1 : 0, sort_order || 0]
    );
    res.status(201).json({ message: 'Project created', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/projects/:id', authMiddleware, async (req, res) => {
  const { title, category, description, image_url, image_hint, progress, status, is_main, sort_order } = req.body;
  try {
    await pool.query(
      'UPDATE key_projects SET title = ?, category = ?, description = ?, image_url = ?, image_hint = ?, progress = ?, status = ?, is_main = ?, sort_order = ? WHERE id = ?',
      [title, category, description, image_url, image_hint || '', progress || 0, status || 'Ongoing', is_main ? 1 : 0, sort_order || 0, req.params.id]
    );
    res.json({ message: 'Project updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/projects/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM key_projects WHERE id = ?', [req.params.id]);
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 4. FAQs
router.get('/faqs', async (req, res) => {
  const { page } = req.query; // optional filter by page ('home' or 'donate')
  try {
    let sql = 'SELECT * FROM faq_items';
    const params = [];
    if (page) {
      sql += ' WHERE page = ?';
      params.push(page);
    }
    sql += ' ORDER BY sort_order ASC';
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/faqs', authMiddleware, async (req, res) => {
  const { question, answer, page, sort_order } = req.body;
  if (!question || !answer) {
    return res.status(400).json({ error: 'Question and answer are required' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO faq_items (question, answer, page, sort_order) VALUES (?, ?, ?, ?)',
      [question, answer, page || 'home', sort_order || 0]
    );
    res.status(201).json({ message: 'FAQ created', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/faqs/:id', authMiddleware, async (req, res) => {
  const { question, answer, page, sort_order } = req.body;
  try {
    await pool.query(
      'UPDATE faq_items SET question = ?, answer = ?, page = ?, sort_order = ? WHERE id = ?',
      [question, answer, page || 'home', sort_order || 0, req.params.id]
    );
    res.json({ message: 'FAQ updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/faqs/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM faq_items WHERE id = ?', [req.params.id]);
    res.json({ message: 'FAQ deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 5. MOMENTS OF IMPACT (GALLERY PREVIEW)
router.get('/gallery', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM moments_of_impact ORDER BY sort_order ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/gallery', authMiddleware, async (req, res) => {
  const { image_url, description, category, image_hint, sort_order } = req.body;
  if (!image_url || !description) {
    return res.status(400).json({ error: 'Image URL and description are required' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO moments_of_impact (image_url, description, category, image_hint, sort_order) VALUES (?, ?, ?, ?, ?)',
      [image_url, description, category || 'Events', image_hint || '', sort_order || 0]
    );
    res.status(201).json({ message: 'Gallery moment created', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/gallery/:id', authMiddleware, async (req, res) => {
  const { image_url, description, category, image_hint, sort_order } = req.body;
  try {
    await pool.query(
      'UPDATE moments_of_impact SET image_url = ?, description = ?, category = ?, image_hint = ?, sort_order = ? WHERE id = ?',
      [image_url, description, category || 'Events', image_hint || '', sort_order || 0, req.params.id]
    );
    res.json({ message: 'Gallery moment updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/gallery/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM moments_of_impact WHERE id = ?', [req.params.id]);
    res.json({ message: 'Gallery moment deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 6. BLOGS / ARTICLES PREVIEW
router.get('/blogs', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM blogs ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/blogs', authMiddleware, async (req, res) => {
  const { title, excerpt, category, image_url, image_hint } = req.body;
  if (!title || !excerpt || !category || !image_url) {
    return res.status(400).json({ error: 'Title, excerpt, category, and image URL are required' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO blogs (title, excerpt, category, image_url, image_hint) VALUES (?, ?, ?, ?, ?)',
      [title, excerpt, category, image_url, image_hint || '']
    );
    res.status(201).json({ message: 'Blog article created', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/blogs/:id', authMiddleware, async (req, res) => {
  const { title, excerpt, category, image_url, image_hint } = req.body;
  try {
    await pool.query(
      'UPDATE blogs SET title = ?, excerpt = ?, category = ?, image_url = ?, image_hint = ? WHERE id = ?',
      [title, excerpt, category, image_url, image_hint || '', req.params.id]
    );
    res.json({ message: 'Blog article updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/blogs/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM blogs WHERE id = ?', [req.params.id]);
    res.json({ message: 'Blog article deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 7. FOOTER
router.get('/footer', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM footer_content ORDER BY id DESC LIMIT 1');
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Footer content not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/footer', authMiddleware, async (req, res) => {
  const { cta_heading, cta_subheading, about_text, facebook_url, twitter_url, instagram_url, linkedin_url, contact_email, contact_address } = req.body;
  if (!cta_heading || !cta_subheading || !about_text || !contact_email || !contact_address) {
    return res.status(400).json({ error: 'Required fields: cta_heading, cta_subheading, about_text, contact_email, contact_address' });
  }
  try {
    const [rows] = await pool.query('SELECT id FROM footer_content LIMIT 1');
    if (rows.length === 0) {
      await pool.query(
        'INSERT INTO footer_content (cta_heading, cta_subheading, about_text, facebook_url, twitter_url, instagram_url, linkedin_url, contact_email, contact_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [cta_heading, cta_subheading, about_text, facebook_url || '#', twitter_url || '#', instagram_url || '#', linkedin_url || '#', contact_email, contact_address]
      );
    } else {
      await pool.query(
        'UPDATE footer_content SET cta_heading = ?, cta_subheading = ?, about_text = ?, facebook_url = ?, twitter_url = ?, instagram_url = ?, linkedin_url = ?, contact_email = ?, contact_address = ? WHERE id = ?',
        [cta_heading, cta_subheading, about_text, facebook_url || '#', twitter_url || '#', instagram_url || '#', linkedin_url || '#', contact_email, contact_address, rows[0].id]
      );
    }
    res.json({ message: 'Footer content updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 8. DONATE PAGE DYNAMIC CONTENT
router.get('/donate-content', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM donate_page_content WHERE id = 1');
    if (rows.length === 0) {
      return res.json({
        main_heading: 'Make a Difference in Lucknow Today',
        main_subheading: 'Your support is crucial for our social welfare mission in Uttar Pradesh.',
        side_image_url: '/pro/c.png',
        qr_title: 'Scan to Support Our NGO',
        qr_description: 'Quickly donate to our Lucknow projects via any UPI App',
        qr_image_url: '/qr.png',
        transparency_text: 'Hum har donation ka proper utilization record maintain karte hain aur donors ko updates provide karte hain. Your trust is our biggest asset. As a top NGO in Lucknow, transparency is our priority.'
      });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/donate-content', authMiddleware, async (req, res) => {
  const { main_heading, main_subheading, side_image_url, qr_title, qr_description, qr_image_url, transparency_text } = req.body;
  try {
    const [rows] = await pool.query('SELECT id FROM donate_page_content WHERE id = 1');
    if (rows.length === 0) {
      await pool.query(
        'INSERT INTO donate_page_content (id, main_heading, main_subheading, side_image_url, qr_title, qr_description, qr_image_url, transparency_text) VALUES (1, ?, ?, ?, ?, ?, ?, ?)',
        [main_heading, main_subheading, side_image_url, qr_title, qr_description, qr_image_url, transparency_text]
      );
    } else {
      await pool.query(
        'UPDATE donate_page_content SET main_heading = ?, main_subheading = ?, side_image_url = ?, qr_title = ?, qr_description = ?, qr_image_url = ?, transparency_text = ? WHERE id = 1',
        [main_heading, main_subheading, side_image_url, qr_title, qr_description, qr_image_url, transparency_text]
      );
    }
    res.json({ message: 'Donate content updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
