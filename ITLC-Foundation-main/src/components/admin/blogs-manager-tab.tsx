'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  BookOpen, Plus, Edit, Trash2, ExternalLink, Loader2, Image as ImageIcon,
  Layers, Check, X, Calendar, Clock, Sparkles, AlertCircle, RefreshCw,
  Star, Globe, HelpCircle, FileText, User, ChevronDown, ChevronUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MediaGalleryModal } from '@/components/admin/media-gallery-modal';

interface BlogFaqItem {
  question: string;
  answer: string;
}

interface BlogItem {
  id?: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  author: string;
  authorRole?: string;
  date: string;
  readTime: string;
  image: string;
  images?: string[];
  tags: string[];
  keyPoints: string[];
  content: string;
  faqs?: BlogFaqItem[];
  metaTitle?: string;
  metaDescription?: string;
  status?: 'published' | 'draft';
  isFeatured?: boolean;
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
  const [formAuthorRole, setFormAuthorRole] = useState('Editorial & Field Team');
  const [formStatus, setFormStatus] = useState<'published' | 'draft'>('published');
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formMetaTitle, setFormMetaTitle] = useState('');
  const [formMetaDescription, setFormMetaDescription] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formReadTime, setFormReadTime] = useState('6 min read');
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formKeyPoints, setFormKeyPoints] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formImages, setFormImages] = useState<string[]>([]);
  const [formFaqs, setFormFaqs] = useState<BlogFaqItem[]>([]);

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

  const handleAddFaq = () => {
    setFormFaqs([...formFaqs, { question: '', answer: '' }]);
  };

  const handleRemoveFaq = (index: number) => {
    setFormFaqs(formFaqs.filter((_, idx) => idx !== index));
  };

  const handleFaqChange = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...formFaqs];
    updated[index] = { ...updated[index], [field]: value };
    setFormFaqs(updated);
  };

  const handleFillDefaultFaqs = () => {
    const cat = formCategory.toLowerCase();
    if (cat.includes('women')) {
      setFormFaqs([
        {
          question: 'How does ITLC Foundation support women in rural Uttar Pradesh?',
          answer: 'We provide free vocational training in tailoring and handicrafts, sewing machines, digital banking literacy, and help establish Self-Help Groups (SHGs) for sustained household earnings.'
        },
        {
          question: 'Are the vocational training courses free of cost for participants?',
          answer: 'Yes, all skill development workshops, toolkits, and certification programs are 100% free for underprivileged women and adolescent girls.'
        },
        {
          question: 'How are women connected to markets to sell their finished garments?',
          answer: 'Our ground teams link skilled artisans with local garment retailers, corporate uniform orders, and handicraft exhibitions to secure monthly earnings.'
        },
        {
          question: 'How can donors contribute or sponsor a woman’s training cycle?',
          answer: 'Donors can sponsor sewing toolkits or 6-month skill cycles through our Section 80G tax-exempt donation gateway.'
        }
      ]);
    } else if (cat.includes('animal')) {
      setFormFaqs([
        {
          question: 'How does ITLC Foundation care for injured street animals in Lucknow?',
          answer: 'We run community feeding routes, on-site wound dressings, anti-rabies vaccination drives, and partner with local veterinary clinics for emergency trauma.'
        },
        {
          question: 'What is the purpose of reflective safety collars on street animals?',
          answer: 'During dense winter fog in UP, high-grade reflective collars catch vehicle headlights, reducing nocturnal road accidents by more than 70%.'
        },
        {
          question: 'How can citizens report an injured stray in their neighborhood?',
          answer: 'You can alert our local volunteer coordinators via the ITLC Foundation helpline with GPS location details and photos for prompt rescue.'
        },
        {
          question: 'How are community feeding programs organized across the city?',
          answer: 'Volunteers prepare and distribute fresh rice, boiled lentils, and nutrient-rich broth at designated quiet feeding points every evening.'
        }
      ]);
    } else {
      setFormFaqs([
        {
          question: 'Why does ITLC Foundation prioritize native trees like Neem, Peepal, and Banyan?',
          answer: 'Native Indian tree species are drought-resilient, provide dense shade, emit abundant oxygen, and survive without depleting ground water tables.'
        },
        {
          question: 'What is the "Adopt-a-Tree" stewardship model?',
          answer: 'We map each planted sapling, equip local caretakers with water cans and tree guards, and perform bi-weekly maintenance patrol to ensure an 88%+ survival rate.'
        },
        {
          question: 'Are financial contributions eligible for Section 80G tax exemption?',
          answer: 'Yes, all donations qualify for a 50% tax deduction under Section 80G of the Indian Income Tax Act with immediate computerized receipts.'
        },
        {
          question: 'How can citizens volunteer in weekend community green drives?',
          answer: 'Anyone can register through our Volunteer portal to take part in tree planting, pit digging, and sapling distribution drives across Uttar Pradesh.'
        }
      ]);
    }
    toast({
      title: 'FAQs Pre-filled',
      description: `Loaded 4 suggested FAQs tailored to "${formCategory}".`,
    });
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormTitle('');
    setFormSlug('');
    setFormCategory('Environment Protection');
    setFormAuthor('ITLC Foundation');
    setFormAuthorRole('Editorial & Field Team');
    setFormStatus('published');
    setFormIsFeatured(false);
    setFormMetaTitle('');
    setFormMetaDescription('');
    setFormDate(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
    setFormReadTime('6 min read');
    setFormExcerpt('');
    setFormContent('');
    setFormKeyPoints('');
    setFormTags('Community, UP, NGO');
    setFormImages(['/pro/ab.png']);
    setFormFaqs([]);
    setIsModalOpen(true);
  };

  const openEditModal = (blog: BlogItem) => {
    setIsEditing(true);
    setEditingId(blog.id || blog.slug);
    setFormTitle(blog.title);
    setFormSlug(blog.slug);
    setFormCategory(blog.category || 'Environment Protection');
    setFormAuthor(blog.author || 'ITLC Foundation');
    setFormAuthorRole(blog.authorRole || 'Editorial & Field Team');
    setFormStatus(blog.status || 'published');
    setFormIsFeatured(Boolean(blog.isFeatured));
    setFormMetaTitle(blog.metaTitle || '');
    setFormMetaDescription(blog.metaDescription || '');
    setFormDate(blog.date || '');
    setFormReadTime(blog.readTime || '6 min read');
    setFormExcerpt(blog.excerpt || '');
    setFormContent(blog.content || '');
    setFormKeyPoints(Array.isArray(blog.keyPoints) ? blog.keyPoints.join('\n') : '');
    setFormTags(Array.isArray(blog.tags) ? blog.tags.join(', ') : '');
    const imgs = blog.images && blog.images.length > 0 ? blog.images : [blog.image || '/pro/ab.png'];
    setFormImages(imgs);
    setFormFaqs(Array.isArray(blog.faqs) && blog.faqs.length > 0 ? blog.faqs : []);
    setIsModalOpen(true);
  };

  const handleAddImage = (url: string) => {
    if (!formImages.includes(url)) {
      setFormImages([...formImages, url]);
      toast({
        title: 'Image Added',
        description: 'Selected photo added to article images.',
      });
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormImages(formImages.filter((_, idx) => idx !== indexToRemove));
    toast({
      title: 'Image Removed',
      description: 'Photo removed from article images.',
    });
  };

  const handleMakePrimary = (indexToMakePrimary: number) => {
    if (indexToMakePrimary === 0) return;
    const selected = formImages[indexToMakePrimary];
    const others = formImages.filter((_, idx) => idx !== indexToMakePrimary);
    setFormImages([selected, ...others]);
    toast({
      title: 'Primary Image Updated',
      description: 'Photo is now set as the main featured image.',
    });
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
        author: formAuthor.trim(),
        authorRole: formAuthorRole.trim(),
        status: formStatus,
        isFeatured: formIsFeatured,
        metaTitle: formMetaTitle.trim(),
        metaDescription: formMetaDescription.trim(),
        date: formDate,
        readTime: formReadTime,
        excerpt: formExcerpt,
        content: formContent,
        image: formImages[0],
        images: formImages,
        tags: formTags.split(',').map((t) => t.trim()).filter(Boolean),
        keyPoints: formKeyPoints.split('\n').map((k) => k.trim()).filter(Boolean),
        faqs: formFaqs.filter((f) => f.question.trim() && f.answer.trim()),
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
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                      <span className="bg-white/95 backdrop-blur-xs text-[10px] font-bold text-[#168039] px-2.5 py-0.5 rounded-full shadow-xs">
                        {blog.category}
                      </span>
                      {blog.isFeatured && (
                        <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-white" />
                          <span>Featured</span>
                        </span>
                      )}
                      {blog.status === 'draft' && (
                        <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                          Draft
                        </span>
                      )}
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
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 mb-1 flex-wrap">
                      <span>{blog.date}</span>
                      <span>&bull;</span>
                      <span>{blog.readTime}</span>
                      <span>&bull;</span>
                      <span className="text-gray-600 font-medium">
                        {blog.author} {blog.authorRole ? `(${blog.authorRole})` : ''}
                      </span>
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">
                      {blog.title}
                    </h4>
                  </div>

                  {/* Feature & FAQ Badges */}
                  <div className="flex items-center gap-2 flex-wrap text-[10px]">
                    {Array.isArray(blog.faqs) && blog.faqs.length > 0 && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-[#168039] font-bold border border-emerald-100 flex items-center gap-1">
                        <HelpCircle className="w-3 h-3" />
                        <span>{blog.faqs.length} Custom FAQs</span>
                      </span>
                    )}
                    {blog.metaTitle && (
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold border border-blue-100 flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        <span>SEO Configured</span>
                      </span>
                    )}
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

              {/* Status & Featured Article Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div>
                  <label className="block font-bold text-gray-700 mb-1 text-[11px]">Publication Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as 'published' | 'draft')}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:border-[#168039] bg-white font-medium text-xs"
                  >
                    <option value="published">🟢 Published (Live on website)</option>
                    <option value="draft">🟡 Draft (Hidden from visitors)</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 pt-1 sm:pt-6">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700 text-xs">
                    <input
                      type="checkbox"
                      checked={formIsFeatured}
                      onChange={(e) => setFormIsFeatured(e.target.checked)}
                      className="w-4 h-4 rounded text-[#168039] focus:ring-[#168039]"
                    />
                    <span className="flex items-center gap-1.5">
                      <Star className={`w-4 h-4 ${formIsFeatured ? 'text-amber-500 fill-amber-500' : 'text-gray-400'}`} />
                      <span>Featured Article (Spotlight on Hub Banner)</span>
                    </span>
                  </label>
                </div>
              </div>

              {/* Author, Role, Reading Time & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Author / Wing *</label>
                  <input
                    type="text"
                    required
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    placeholder="ITLC Editorial Wing"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:border-[#168039]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Author Role / Designation</label>
                  <input
                    type="text"
                    value={formAuthorRole}
                    onChange={(e) => setFormAuthorRole(e.target.value)}
                    placeholder="e.g. Field Coordinator"
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
              <div className="p-4 sm:p-5 bg-emerald-50/60 rounded-3xl border-2 border-emerald-200 space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-emerald-100">
                  <div>
                    <label className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                      <Layers className="w-4 h-4 text-[#168039]" />
                      <span>Article Images ({formImages.length} Selected)</span>
                    </label>
                    <p className="text-[11px] text-gray-600 mt-0.5">
                      Pehli photo blog ki main featured image hogi. Aap multiple photos add aur delete kar sakte hain.
                    </p>
                  </div>

                  {/* Add Image Button & Quick Selected Preview */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    {formImages.length > 0 && (
                      <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-emerald-200 shadow-2xs">
                        <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-emerald-300 bg-gray-100 shrink-0">
                          <Image src={formImages[0]} alt="Selected thumbnail" fill sizes="32px" className="object-cover" />
                        </div>
                        <span className="text-[10px] font-bold text-gray-700 hidden sm:inline truncate max-w-[100px]">
                          {formImages[0].split('/').pop()}
                        </span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsMediaPickerOpen(true)}
                      className="bg-[#168039] hover:bg-[#137233] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Add Image</span>
                    </button>
                  </div>
                </div>

                {/* Images Preview Grid with Guaranteed Height */}
                {formImages.length === 0 ? (
                  <div
                    onClick={() => setIsMediaPickerOpen(true)}
                    className="border-2 border-dashed border-emerald-300 hover:border-[#168039] bg-white rounded-2xl p-8 text-center cursor-pointer transition-all space-y-2 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-gray-800">Koi bhi image select nahi hai</p>
                    <p className="text-[11px] text-gray-500">
                      Yahan click karein ya upar <span className="font-bold text-[#168039]">&quot;+ Add Image&quot;</span> button daba kar gallery se photo chunein
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 pt-1">
                    {formImages.map((img, index) => {
                      const fileName = img.split('/').pop() || `Image ${index + 1}`;
                      const isPrimary = index === 0;
                      return (
                        <div
                          key={`${img}-${index}`}
                          className={`relative h-44 sm:h-48 w-full rounded-2xl overflow-hidden border-2 bg-slate-900 group shadow-sm flex flex-col justify-between transition-all ${
                            isPrimary
                              ? 'border-[#168039] ring-2 ring-[#168039]/40'
                              : 'border-gray-200 hover:border-emerald-400'
                          }`}
                        >
                          {/* Visible Image */}
                          <Image
                            src={img}
                            alt={`Article Image ${index + 1}`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover"
                          />

                          {/* Top Controls Bar */}
                          <div className="relative z-10 p-2.5 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent">
                            {isPrimary ? (
                              <span className="bg-[#168039] text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                <span>Main Featured</span>
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleMakePrimary(index)}
                                className="bg-white/90 hover:bg-[#168039] hover:text-white text-gray-800 text-[10px] font-bold px-2 py-1 rounded-lg backdrop-blur-xs transition-colors cursor-pointer shadow-xs"
                                title="Set as main featured image"
                              >
                                Set as Main
                              </button>
                            )}

                            {/* Prominent Delete Button */}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition-all cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                              title="Delete this image"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>

                          {/* Bottom File Name Bar */}
                          <div className="relative z-10 p-2.5 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between text-white text-[11px]">
                            <span className="truncate max-w-[180px] font-mono font-medium text-white" title={img}>
                              {fileName}
                            </span>
                            <span className="text-white/75 text-[10px] shrink-0 font-sans px-1.5 py-0.5 rounded bg-white/20">
                              #{index + 1}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
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

              {/* ======================================================== */}
              {/* FREQUENTLY ASKED QUESTIONS (FAQs) MANAGER                */}
              {/* ======================================================== */}
              <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="font-bold text-gray-900 flex items-center gap-1.5 text-xs">
                      <HelpCircle className="w-4 h-4 text-[#168039]" />
                      <span>Article FAQs Accordion ({formFaqs.length})</span>
                    </label>
                    <p className="text-[11px] text-gray-500">
                      These questions and answers appear in the accordion on the live blog page.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleFillDefaultFaqs}
                      className="text-[11px] font-bold text-[#168039] hover:bg-emerald-100 px-2.5 py-1 bg-emerald-50 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                    >
                      Pre-fill 4 FAQs
                    </button>
                    <button
                      type="button"
                      onClick={handleAddFaq}
                      className="bg-[#168039] hover:bg-[#137233] text-white px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add FAQ</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  {formFaqs.map((faq, index) => (
                    <div key={index} className="p-3 bg-white rounded-xl border border-gray-200 space-y-2 relative shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-700 text-[11px] flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-[#168039] text-white flex items-center justify-center text-[10px]">
                            {index + 1}
                          </span>
                          <span>FAQ Item #{index + 1}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFaq(index)}
                          className="text-red-500 hover:text-red-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                        placeholder="e.g. How does this project support rural families in UP?"
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium outline-none focus:border-[#168039]"
                      />
                      <textarea
                        rows={2}
                        value={faq.answer}
                        onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                        placeholder="Detailed answer shown when the reader opens this FAQ..."
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#168039]"
                      />
                    </div>
                  ))}
                  {formFaqs.length === 0 && (
                    <div className="text-center py-4 border border-dashed border-gray-300 rounded-xl text-gray-400 text-xs bg-white">
                      No custom FAQs added yet. Click &quot;Pre-fill 4 FAQs&quot; or &quot;Add FAQ&quot; above.
                    </div>
                  )}
                </div>
              </div>

              {/* ======================================================== */}
              {/* SEARCH ENGINE OPTIMIZATION (SEO METADATA)                */}
              {/* ======================================================== */}
              <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-3">
                <div>
                  <label className="font-bold text-gray-900 flex items-center gap-1.5 text-xs">
                    <Globe className="w-4 h-4 text-[#0f5b9e]" />
                    <span>Search Engine Optimization (SEO Metadata)</span>
                  </label>
                  <p className="text-[11px] text-gray-500">
                    Customize the page title and meta description seen on Google and social media.
                  </p>
                </div>
                <div className="space-y-2.5">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="font-bold text-gray-700 text-[11px]">SEO Meta Title</label>
                      <span className="text-[10px] text-gray-400">{formMetaTitle.length}/70 chars</span>
                    </div>
                    <input
                      type="text"
                      value={formMetaTitle}
                      onChange={(e) => setFormMetaTitle(e.target.value)}
                      placeholder="e.g. Empowering Rural Women in UP: Tailoring & Self-Help Groups | ITLC Foundation"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:border-[#168039] text-xs"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="font-bold text-gray-700 text-[11px]">SEO Meta Description</label>
                      <span className="text-[10px] text-gray-400">{formMetaDescription.length}/160 chars</span>
                    </div>
                    <textarea
                      rows={2}
                      value={formMetaDescription}
                      onChange={(e) => setFormMetaDescription(e.target.value)}
                      placeholder="e.g. Discover how ITLC Foundation helps women in rural Uttar Pradesh achieve financial freedom through free vocational skills and sewing toolkits."
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:border-[#168039] text-xs"
                    />
                  </div>
                </div>
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
