'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  BookOpen, Plus, Edit, Trash2, ExternalLink, Loader2, Image as ImageIcon,
  Layers, Check, X, Calendar, Clock, Sparkles, AlertCircle, RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MediaGalleryModal } from '@/components/admin/media-gallery-modal';

interface BlogItem {
  id?: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  images?: string[];
  tags: string[];
  keyPoints: string[];
  content: string;
}

export function BlogsManagerTab() {
  const { toast } = useToast();
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formCategory, setFormCategory] = useState('Environment Protection');
  const [formAuthor, setFormAuthor] = useState('ITLC Foundation');
  const [formDate, setFormDate] = useState('');
  const [formReadTime, setFormReadTime] = useState('6 min read');
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formKeyPoints, setFormKeyPoints] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formImages, setFormImages] = useState<string[]>([]);

  // Media picker modal for adding images
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const categories = [
    'Environment Protection',
    'Animal Welfare',
    'Women Empowerment',
    'Education Support',
    'Clean Water & Sanitation',
    'Social Welfare',
  ];

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/content/blogs');
      const data = await res.json();
      if (data.blogs) {
        setBlogs(data.blogs);
      }
    } catch (err) {
      console.error('Failed to load blogs:', err);
      toast({
        title: 'Error',
        description: 'Failed to fetch blogs from server.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const openCreateModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormTitle('');
    setFormSlug('');
    setFormCategory('Environment Protection');
    setFormAuthor('ITLC Foundation');
    setFormDate(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
    setFormReadTime('6 min read');
    setFormExcerpt('');
    setFormContent('');
    setFormKeyPoints('');
    setFormTags('Community, UP, NGO');
    setFormImages(['/pro/ab.png']);
    setIsModalOpen(true);
  };

  const openEditModal = (blog: BlogItem) => {
    setIsEditing(true);
    setEditingId(blog.id || blog.slug);
    setFormTitle(blog.title);
    setFormSlug(blog.slug);
    setFormCategory(blog.category || 'Environment Protection');
    setFormAuthor(blog.author || 'ITLC Foundation');
    setFormDate(blog.date || '');
    setFormReadTime(blog.readTime || '6 min read');
    setFormExcerpt(blog.excerpt || '');
    setFormContent(blog.content || '');
    setFormKeyPoints(Array.isArray(blog.keyPoints) ? blog.keyPoints.join('\n') : '');
    setFormTags(Array.isArray(blog.tags) ? blog.tags.join(', ') : '');
    const imgs = blog.images && blog.images.length > 0 ? blog.images : [blog.image || '/pro/ab.png'];
    setFormImages(imgs);
    setIsModalOpen(true);
  };

  const handleAddImage = (url: string) => {
    if (!formImages.includes(url)) {
      setFormImages([...formImages, url]);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    if (formImages.length <= 1) {
      alert('At least one image is required for the blog post.');
      return;
    }
    setFormImages(formImages.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('Title is required');
      return;
    }
    if (formImages.length === 0) {
      alert('Please add at least one image');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        id: editingId,
        slug: formSlug.trim() || undefined,
        title: formTitle.trim(),
        category: formCategory,
        author: formAuthor,
        date: formDate,
        readTime: formReadTime,
        excerpt: formExcerpt,
        content: formContent,
        image: formImages[0],
        images: formImages,
        tags: formTags.split(',').map((t) => t.trim()).filter(Boolean),
        keyPoints: formKeyPoints.split('\n').map((k) => k.trim()).filter(Boolean),
      };

      const res = await fetch('/api/content/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        toast({
          title: 'Success',
          description: `Blog "${formTitle}" saved successfully!`,
        });
        setIsModalOpen(false);
        fetchBlogs();
      } else {
        alert(data.error || 'Failed to save blog');
      }
    } catch (err: any) {
      console.error('Error saving blog:', err);
      alert(err.message || 'Error saving blog');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (blog: BlogItem) => {
    if (!confirm(`Are you sure you want to permanently delete "${blog.title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/content/blogs?id=${blog.id || ''}&slug=${blog.slug}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        toast({
          title: 'Deleted',
          description: `Blog deleted successfully.`,
        });
        fetchBlogs();
      } else {
        alert(data.error || 'Failed to delete blog');
      }
    } catch (err: any) {
      alert(err.message || 'Error deleting blog');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[#168039] font-bold text-xs uppercase tracking-widest block font-headline mb-1">
            EDITORIAL ENGINE —
          </span>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#168039]" />
            <h3 className="text-lg font-bold font-headline tracking-tight">
              <span className="text-[#0f5b9e]">Blog &amp; Insights CMS</span>{' '}
              <span className="text-[#168039]">(Multi-Image)</span>
            </h3>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Create, edit, and delete dynamic blog articles. Manage multiple images, short summaries, and long content.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchBlogs}
            className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Refresh blogs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="bg-[#168039] hover:bg-[#137233] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Article</span>
          </button>
        </div>
      </div>

      {/* Blogs List */}
      {loading ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-gray-200 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#168039] mb-3" />
          <p className="text-xs font-medium">Loading articles...</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-gray-200 text-gray-500 space-y-3">
          <p className="text-sm font-semibold">No articles found.</p>
          <button
            type="button"
            onClick={openCreateModal}
            className="bg-[#168039] text-white px-4 py-2 rounded-xl text-xs font-bold"
          >
            Create your first article
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {blogs.map((blog) => {
            const images = blog.images && blog.images.length > 0 ? blog.images : [blog.image || '/pro/ab.png'];
            return (
              <div
                key={blog.slug}
                className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Image Strip preview */}
                  <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
                    <Image
                      src={images[0] || '/pro/ab.png'}
                      alt={blog.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs text-[10px] font-bold text-[#168039] px-2.5 py-0.5 rounded-full shadow-xs">
                      {blog.category}
                    </div>
                    {images.length > 1 && (
                      <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Layers className="w-3 h-3 text-emerald-400" />
                        <span>{images.length} Images</span>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Row if multiple images */}
                  {images.length > 1 && (
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                      {images.map((img, idx) => (
                        <div key={idx} className="relative w-10 h-7 rounded-md overflow-hidden shrink-0 border border-gray-200">
                          <Image src={img} alt={`Preview ${idx + 1}`} fill sizes="40px" className="object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Metadata & Title */}
                  <div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 mb-1">
                      <span>{blog.date}</span>
                      <span>&bull;</span>
                      <span>{blog.readTime}</span>
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">
                      {blog.title}
                    </h4>
                  </div>

                  {/* Short Summary (Excerpt) */}
                  <p className="text-xs text-gray-500 line-clamp-2 bg-gray-50 p-2 rounded-xl">
                    {blog.excerpt}
                  </p>
                </div>

                {/* Actions Bar */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <Link
                    href={`/blog/${blog.slug}`}
                    target="_blank"
                    className="text-[11px] text-gray-500 hover:text-[#168039] font-medium inline-flex items-center gap-1"
                  >
                    <span>View Live</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(blog)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 text-[#168039] hover:bg-emerald-100 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(blog)}
                      className="px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs transition-colors cursor-pointer"
                      title="Delete Article"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE / EDIT BLOG POST                                            */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#168039] flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">
                    {isEditing ? 'Edit Blog Article' : 'Create New Blog Article'}
                  </h3>
                  <p className="text-xs text-gray-500">Includes multi-image management &amp; short summary</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* Title & Slug */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Article Headline / Title *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => {
                    setFormTitle(e.target.value);
                    if (!isEditing && !formSlug) {
                      setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  placeholder="e.g. Empowering Rural Women: Tailoring & Livelihood in UP"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-bold text-sm outline-none focus:border-[#168039]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">URL Slug (Auto-generated)</label>
                  <input
                    type="text"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="empowering-rural-women-up"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:border-[#168039] font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Focus Area Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:border-[#168039] bg-white font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Author & Read time & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Author / Wing</label>
                  <input
                    type="text"
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    placeholder="ITLC Editorial Wing"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:border-[#168039]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Reading Time</label>
                  <input
                    type="text"
                    value={formReadTime}
                    onChange={(e) => setFormReadTime(e.target.value)}
                    placeholder="6 min read"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:border-[#168039]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Publish Date</label>
                  <input
                    type="text"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    placeholder="September 8, 2026"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:border-[#168039]"
                  />
                </div>
              </div>

              {/* Short Summary (Excerpt) */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Short Summary (Excerpt) *
                  <span className="font-normal text-gray-400 ml-1">Displayed on the blog card and under the title</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={formExcerpt}
                  onChange={(e) => setFormExcerpt(e.target.value)}
                  placeholder="Provide a concise 2-3 sentence overview of this article..."
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 outline-none focus:border-[#168039] leading-relaxed"
                />
              </div>

              {/* ======================================================== */}
              {/* MULTIPLE IMAGES MANAGER                                  */}
              {/* ======================================================== */}
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-bold text-gray-900 flex items-center gap-1.5 text-xs">
                      <Layers className="w-4 h-4 text-[#168039]" />
                      <span>Multiple Article Images ({formImages.length})</span>
                    </label>
                    <p className="text-[11px] text-gray-500">
                      Add multiple photos for this blog. First photo is the main featured image.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMediaPickerOpen(true)}
                    className="bg-[#168039] hover:bg-[#137233] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Image</span>
                  </button>
                </div>

                {/* Images Preview Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {formImages.map((img, index) => (
                    <div
                      key={index}
                      className="relative rounded-xl overflow-hidden border border-gray-200 bg-white group shadow-2xs aspect-video"
                    >
                      <Image src={img} alt={`Image ${index + 1}`} fill sizes="160px" className="object-cover" />
                      {index === 0 && (
                        <span className="absolute top-1 left-1 bg-[#168039] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          Primary
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md opacity-80 hover:opacity-100 shadow transition-opacity cursor-pointer"
                        title="Remove this image"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Takeaways / Bullet points */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Key Takeaways (One per line)
                </label>
                <textarea
                  rows={3}
                  value={formKeyPoints}
                  onChange={(e) => setFormKeyPoints(e.target.value)}
                  placeholder="Over 400 women trained&#10;88% enterprise success rate&#10;Weekly sewing camps conducted"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono text-[11px] outline-none focus:border-[#168039]"
                />
              </div>

              {/* Full Detailed Content (Markdown / Text) */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Detailed Article Content *
                  <span className="font-normal text-gray-400 ml-1">(Supports ## Headings, - Bullet points, --- Dividers)</span>
                </label>
                <textarea
                  rows={8}
                  required
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="## Main Section Title&#10;&#10;Write the detailed article body here..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-mono text-xs leading-relaxed outline-none focus:border-[#168039]"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Topics / Tags (Comma separated)</label>
                <input
                  type="text"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  placeholder="Women Empowerment, Skill Development, Lucknow, UP"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:border-[#168039]"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-[#168039] hover:bg-[#137233] text-white px-6 py-2.5 rounded-xl font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>{isEditing ? 'Update Article' : 'Publish Article'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Gallery Picker Modal */}
      <MediaGalleryModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={(url) => {
          handleAddImage(url);
          setIsMediaPickerOpen(false);
        }}
      />
    </div>
  );
}
