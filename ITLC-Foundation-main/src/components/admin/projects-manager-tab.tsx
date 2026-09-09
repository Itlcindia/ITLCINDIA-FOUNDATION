'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  FolderKanban, Plus, Edit, Trash2, ExternalLink, Loader2, Image as ImageIcon,
  Check, X, Calendar, Sparkles, Search, Copy, MapPin, Eye,
  ArrowRight, Video, FileText, Heart, Users, Tag, ChevronDown, RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ImageUploadField } from '@/components/admin/image-upload-field';
import { MediaGalleryModal } from '@/components/admin/media-gallery-modal';
import { Project, ProjectStat, ProjectGalleryItem } from '@/data/projects';

const CATEGORIES = [
  'Environment',
  'Animal Welfare',
  'Women Empowerment',
  'Education',
  'Clean Water',
  'Social Welfare',
  'Community Development',
];

const STATUSES: Array<'Upcoming' | 'Ongoing' | 'Completed'> = [
  'Ongoing',
  'Completed',
  'Upcoming',
];

export function ProjectsManagerTab() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Available blogs for relationship
  const [availableBlogs, setAvailableBlogs] = useState<Array<{ slug: string; title: string; category: string }>>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [formCategory, setFormCategory] = useState('Environment');
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formWhyMatters, setFormWhyMatters] = useState('');
  const [formStatus, setFormStatus] = useState<'Upcoming' | 'Ongoing' | 'Completed'>('Ongoing');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [formLocation, setFormLocation] = useState('Lucknow, Uttar Pradesh');
  const [formCity, setFormCity] = useState('Lucknow');
  const [formState, setFormState] = useState('Uttar Pradesh');
  const [formCountry, setFormCountry] = useState('India');
  const [formFeaturedImage, setFormFeaturedImage] = useState('/pro/tree.png');
  const [formImageAlt, setFormImageAlt] = useState('');

  // Repeaters
  const [formObjectives, setFormObjectives] = useState<string[]>([]);
  const [formActivities, setFormActivities] = useState<string[]>([]);
  const [formStats, setFormStats] = useState<ProjectStat[]>([]);
  const [formGallery, setFormGallery] = useState<ProjectGalleryItem[]>([]);
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [formRelatedBlogs, setFormRelatedBlogs] = useState<string[]>([]);

  // Donation & Volunteer settings
  const [formEnableDonation, setFormEnableDonation] = useState(true);
  const [formDonationText, setFormDonationText] = useState('Donate Now');
  const [formDonationUrl, setFormDonationUrl] = useState('');
  const [formEnableVolunteer, setFormEnableVolunteer] = useState(true);
  const [formVolunteerText, setFormVolunteerText] = useState('Become a Volunteer');
  const [formVolunteerUrl, setFormVolunteerUrl] = useState('/volunteer');

  // SEO
  const [formMetaTitle, setFormMetaTitle] = useState('');
  const [formMetaDesc, setFormMetaDesc] = useState('');
  const [formFocusKeyword, setFormFocusKeyword] = useState('');
  const [formCanonicalUrl, setFormCanonicalUrl] = useState('');
  const [formOgImage, setFormOgImage] = useState('');

  // Publish
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formDisplayOrder, setFormDisplayOrder] = useState(1);
  const [formPublished, setFormPublished] = useState(true);

  // Media Picker modal for gallery
  const [isGalleryMediaOpen, setIsGalleryMediaOpen] = useState(false);

  // Active form section tab in modal
  const [formTab, setFormTab] = useState<'basic' | 'narrative' | 'repeaters' | 'media' | 'cta' | 'seo'>('basic');

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/content/projects?includeDrafts=true');
      const data = await res.json();
      if (data.projects) {
        setProjects(data.projects);
      }
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error loading projects', description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/content/blogs');
      const data = await res.json();
      if (data.blogs && Array.isArray(data.blogs)) {
        setAvailableBlogs(data.blogs.map((b: any) => ({ slug: b.slug, title: b.title, category: b.category })));
      }
    } catch (e) {
      console.warn('Failed to load blogs for selection:', e);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchBlogs();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setIsSlugManual(false);

    setFormTitle('');
    setFormSlug('');
    setFormCategory('Environment');
    setFormShortDesc('');
    setFormDesc('');
    setFormWhyMatters('');
    setFormStatus('Ongoing');
    setFormStartDate(new Date().toISOString().split('T')[0]);
    setFormEndDate('');
    setFormLocation('Lucknow, Uttar Pradesh');
    setFormCity('Lucknow');
    setFormState('Uttar Pradesh');
    setFormCountry('India');
    setFormFeaturedImage('/pro/tree.png');
    setFormImageAlt('');

    setFormObjectives([
      'Increase local community participation in ground initiatives.',
      'Deliver measurable social and environmental outcomes.',
      'Mobilize student and youth volunteers across adopted clusters.',
      'Ensure long-term project sustainability and transparent impact reporting.'
    ]);
    setFormActivities([
      'Community Awareness Campaigns',
      'Direct Field Operations & Distribution',
      'Volunteer Mobilization & Training'
    ]);
    setFormStats([
      { number: '1,000+', label: 'Beneficiaries Reached' },
      { number: '10+', label: 'Community Drives' }
    ]);
    setFormGallery([]);
    setFormVideoUrl('');
    setFormRelatedBlogs([]);

    setFormEnableDonation(true);
    setFormDonationText('Donate Now');
    setFormDonationUrl('');
    setFormEnableVolunteer(true);
    setFormVolunteerText('Become a Volunteer');
    setFormVolunteerUrl('/volunteer');

    setFormMetaTitle('');
    setFormMetaDesc('');
    setFormFocusKeyword('');
    setFormCanonicalUrl('');
    setFormOgImage('/pro/tree.png');

    setFormIsFeatured(false);
    setFormDisplayOrder(projects.length + 1);
    setFormPublished(true);

    setFormTab('basic');
    setIsModalOpen(true);
  };

  const openEditModal = (p: Project) => {
    setIsEditing(true);
    setEditingId(p.id);
    setIsSlugManual(true);

    setFormTitle(p.title || '');
    setFormSlug(p.slug || '');
    setFormCategory(p.category || 'Environment');
    setFormShortDesc(p.short_description || '');
    setFormDesc(p.description || '');
    setFormWhyMatters(p.why_matters || '');
    setFormStatus(p.status || 'Ongoing');
    setFormStartDate(p.start_date || '');
    setFormEndDate(p.end_date || '');
    setFormLocation(p.location || 'Lucknow, Uttar Pradesh');
    setFormCity(p.city || 'Lucknow');
    setFormState(p.state || 'Uttar Pradesh');
    setFormCountry(p.country || 'India');
    setFormFeaturedImage(p.featured_image || '/pro/tree.png');
    setFormImageAlt(p.image_alt || '');

    setFormObjectives(Array.isArray(p.objectives) ? [...p.objectives] : []);
    setFormActivities(Array.isArray(p.activities) ? [...p.activities] : []);
    setFormStats(Array.isArray(p.statistics) ? JSON.parse(JSON.stringify(p.statistics)) : []);
    setFormGallery(Array.isArray(p.gallery) ? JSON.parse(JSON.stringify(p.gallery)) : []);
    setFormVideoUrl(p.video_url || '');
    setFormRelatedBlogs(Array.isArray(p.related_blogs) ? [...p.related_blogs] : []);

    setFormEnableDonation(p.enable_donation !== false);
    setFormDonationText(p.donation_button_text || 'Donate Now');
    setFormDonationUrl(p.donation_url || '');
    setFormEnableVolunteer(p.enable_volunteer !== false);
    setFormVolunteerText(p.volunteer_button_text || 'Become a Volunteer');
    setFormVolunteerUrl(p.volunteer_url || '/volunteer');

    setFormMetaTitle(p.meta_title || '');
    setFormMetaDesc(p.meta_description || '');
    setFormFocusKeyword(p.focus_keyword || '');
    setFormCanonicalUrl(p.canonical_url || '');
    setFormOgImage(p.og_image || p.featured_image || '');

    setFormIsFeatured(Boolean(p.is_featured));
    setFormDisplayOrder(p.display_order ?? 1);
    setFormPublished(p.published !== false);

    setFormTab('basic');
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setFormTitle(val);
    if (!isSlugManual) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormSlug(generated);
      setFormMetaTitle(`${val} | ITLC Foundation`);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      toast({ variant: 'destructive', title: 'Missing Title', description: 'Please enter a project title.' });
      return;
    }

    setIsSaving(true);
    const payload = {
      ...(isEditing && editingId ? { id: editingId } : {}),
      title: formTitle.trim(),
      slug: formSlug.trim(),
      category: formCategory,
      short_description: formShortDesc,
      description: formDesc,
      why_matters: formWhyMatters,
      status: formStatus,
      start_date: formStartDate,
      end_date: formEndDate,
      location: formLocation,
      city: formCity,
      state: formState,
      country: formCountry,
      featured_image: formFeaturedImage,
      image_alt: formImageAlt || formTitle.trim(),
      objectives: formObjectives.filter((o) => o.trim().length > 0),
      activities: formActivities.filter((a) => a.trim().length > 0),
      statistics: formStats.filter((s) => s.number.trim().length > 0 && s.label.trim().length > 0),
      gallery: formGallery,
      video_url: formVideoUrl.trim(),
      related_blogs: formRelatedBlogs,
      enable_donation: formEnableDonation,
      donation_button_text: formDonationText,
      donation_url: formDonationUrl.trim(),
      enable_volunteer: formEnableVolunteer,
      volunteer_button_text: formVolunteerText,
      volunteer_url: formVolunteerUrl.trim(),
      meta_title: formMetaTitle.trim() || `${formTitle} | ITLC Foundation`,
      meta_description: formMetaDesc.trim() || formShortDesc,
      focus_keyword: formFocusKeyword.trim(),
      canonical_url: formCanonicalUrl.trim() || `https://itlc.foundation/projects/${formSlug}`,
      og_title: formTitle.trim(),
      og_description: formShortDesc,
      og_image: formOgImage || formFeaturedImage,
      is_featured: formIsFeatured,
      display_order: Number(formDisplayOrder) || 1,
      published: formPublished,
    };

    try {
      const res = await fetch('/api/content/projects', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toast({
          title: isEditing ? 'Project Updated' : 'Project Created',
          description: `"${formTitle}" has been successfully saved.`,
        });
        setIsModalOpen(false);
        fetchProjects();
      } else {
        throw new Error(data.error || 'Failed to save project');
      }
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Save Failed', description: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/content/projects?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Project Deleted', description: `"${title}" was removed.` });
        fetchProjects();
      } else {
        throw new Error(data.error || 'Delete failed');
      }
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    }
  };

  const handleToggleFeatured = async (p: Project) => {
    try {
      const res = await fetch('/api/content/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: p.id, is_featured: !p.is_featured }),
      });
      const data = await res.json();
      if (data.success) {
        toast({
          title: !p.is_featured ? 'Marked as Featured' : 'Removed from Featured',
          description: `"${p.title}" featured status updated.`,
        });
        fetchProjects();
      }
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    }
  };

  const handleTogglePublished = async (p: Project) => {
    try {
      const res = await fetch('/api/content/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: p.id, published: !p.published }),
      });
      const data = await res.json();
      if (data.success) {
        toast({
          title: !p.published ? 'Published Live' : 'Moved to Drafts',
          description: `"${p.title}" is now ${!p.published ? 'public' : 'hidden from public view'}.`,
        });
        fetchProjects();
      }
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    }
  };

  const handleDuplicate = (p: Project) => {
    setIsEditing(false);
    setEditingId(null);
    setIsSlugManual(false);

    setFormTitle(`${p.title} (Copy)`);
    setFormSlug(`${p.slug}-copy`);
    setFormCategory(p.category);
    setFormShortDesc(p.short_description);
    setFormDesc(p.description);
    setFormWhyMatters(p.why_matters);
    setFormStatus(p.status);
    setFormStartDate(new Date().toISOString().split('T')[0]);
    setFormEndDate(p.end_date || '');
    setFormLocation(p.location);
    setFormCity(p.city || 'Lucknow');
    setFormState(p.state || 'Uttar Pradesh');
    setFormCountry(p.country || 'India');
    setFormFeaturedImage(p.featured_image);
    setFormImageAlt(p.image_alt || '');

    setFormObjectives(Array.isArray(p.objectives) ? [...p.objectives] : []);
    setFormActivities(Array.isArray(p.activities) ? [...p.activities] : []);
    setFormStats(Array.isArray(p.statistics) ? JSON.parse(JSON.stringify(p.statistics)) : []);
    setFormGallery(Array.isArray(p.gallery) ? JSON.parse(JSON.stringify(p.gallery)) : []);
    setFormVideoUrl(p.video_url || '');
    setFormRelatedBlogs(Array.isArray(p.related_blogs) ? [...p.related_blogs] : []);

    setFormEnableDonation(p.enable_donation !== false);
    setFormDonationText(p.donation_button_text || 'Donate Now');
    setFormDonationUrl(p.donation_url || '');
    setFormEnableVolunteer(p.enable_volunteer !== false);
    setFormVolunteerText(p.volunteer_button_text || 'Become a Volunteer');
    setFormVolunteerUrl(p.volunteer_url || '/volunteer');

    setFormMetaTitle(`${p.title} (Copy) | ITLC Foundation`);
    setFormMetaDesc(p.meta_description || p.short_description);
    setFormFocusKeyword(p.focus_keyword || '');
    setFormCanonicalUrl(`https://itlc.foundation/projects/${p.slug}-copy`);
    setFormOgImage(p.og_image || p.featured_image);

    setFormIsFeatured(false);
    setFormDisplayOrder(projects.length + 1);
    setFormPublished(false); // Default to draft for duplicated item

    setFormTab('basic');
    setIsModalOpen(true);
  };

  // Filtered projects
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesStatus = selectedStatus === 'All' || p.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchesSearch && matchesCat && matchesStatus;
  });

  const featuredCount = projects.filter((p) => p.is_featured).length;
  const publishedCount = projects.filter((p) => p.published).length;
  const draftCount = projects.length - publishedCount;

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Action Bar */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
          <div>
            <span className="text-[#168039] font-bold text-xs uppercase tracking-widest block font-headline mb-1">
              FIELD OPERATIONS —
            </span>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-50 text-[#168039]">
                <FolderKanban className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-bold font-headline tracking-tight">
                <span className="text-[#0f5b9e]">Projects Management</span>{' '}
                <span className="text-[#168039]">(Field Campaigns)</span>
              </h3>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Create, publish, and manage humanitarian and environmental projects with full dynamic detail pages, galleries, verified stats, and SEO.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchProjects}
              className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              title="Refresh Projects"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={openAddModal}
              className="bg-[#168039] hover:bg-[#137233] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add New Project</span>
            </button>
          </div>
        </div>

        {/* Overview Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Total Projects</span>
            <span className="text-xl font-black text-gray-900 mt-0.5 block">{projects.length}</span>
          </div>
          <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Published Live</span>
            <span className="text-xl font-black text-[#168039] mt-0.5 block">{publishedCount}</span>
          </div>
          <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block">Featured on Home/Top</span>
            <span className="text-xl font-black text-[#0f5b9e] mt-0.5 block">{featuredCount}</span>
          </div>
          <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">Drafts / Hidden</span>
            <span className="text-xl font-black text-amber-700 mt-0.5 block">{draftCount}</span>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-1">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, category, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-[#168039] bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 outline-none bg-white"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 outline-none bg-white"
            >
              <option value="All">All Statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Projects Table / List */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#168039]" />
            <span className="text-xs">Loading projects database...</span>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FolderKanban className="w-10 h-10 text-gray-300 mx-auto" />
            <h4 className="font-bold text-gray-700 text-sm">No Projects Found</h4>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              No projects match your search or filter criteria. Click &ldquo;+ Add New Project&rdquo; to create one.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Project</th>
                  <th className="py-3.5 px-3">Category</th>
                  <th className="py-3.5 px-3">Location</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-3 text-center">Featured</th>
                  <th className="py-3.5 px-3 text-center">Published</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                    
                    {/* Project Title & Thumbnail */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-11 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                          <Image
                            src={p.featured_image || '/pro/tree.png'}
                            alt={p.title}
                            fill
                            sizes="60px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 max-w-xs sm:max-w-sm">
                          <h4 className="font-bold text-gray-900 truncate">{p.title}</h4>
                          <span className="text-[10px] text-gray-400 truncate block font-mono">
                            /projects/{p.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3">
                      <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#0f5b9e]/10 text-[#0f5b9e] border border-[#0f5b9e]/20">
                        {p.category}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="py-3 px-3 text-gray-600">
                      <div className="flex items-center gap-1 text-[11px]">
                        <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                        <span className="truncate max-w-[130px]">{p.location || 'Lucknow, UP'}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          p.status === 'Completed'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : p.status === 'Upcoming'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-emerald-50 text-[#168039] border border-emerald-200'
                        }`}
                      >
                        {p.status || 'Ongoing'}
                      </span>
                    </td>

                    {/* 1-Click Featured Toggle */}
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(p)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          p.is_featured
                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                        title={p.is_featured ? 'Click to unfeature' : 'Click to feature on top'}
                      >
                        {p.is_featured ? '★ Featured' : '☆ Normal'}
                      </button>
                    </td>

                    {/* 1-Click Published Toggle */}
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleTogglePublished(p)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          p.published
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                        title={p.published ? 'Click to unpublish' : 'Click to publish live'}
                      >
                        {p.published ? 'Published' : 'Draft'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/projects/${p.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-gray-600 hover:text-[#0f5b9e] hover:bg-blue-50 border border-gray-200 transition-colors"
                          title="View Live Page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg text-gray-700 hover:text-[#168039] hover:bg-emerald-50 border border-gray-200 transition-colors cursor-pointer"
                          title="Edit Project"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicate(p)}
                          className="p-1.5 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-purple-50 border border-gray-200 transition-colors cursor-pointer"
                          title="Duplicate Project"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id, p.title)}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 border border-red-200 transition-colors cursor-pointer"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* COMPREHENSIVE ADD / EDIT PROJECT MODAL                                    */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/65 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 my-auto flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50 shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-emerald-100 text-[#168039]">
                  <FolderKanban className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">
                    {isEditing ? 'Edit Project' : 'Create New Project'}
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Configure public details, gallery, impact stats, SEO, and donation settings.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Sub-Tabs */}
            <div className="border-b border-gray-200 bg-white px-5 pt-2 flex flex-wrap gap-1 shrink-0 overflow-x-auto">
              {[
                { id: 'basic', label: '1. Basic Info' },
                { id: 'narrative', label: '2. Story & Why it Matters' },
                { id: 'repeaters', label: '3. Objectives, Activities & Stats' },
                { id: 'media', label: '4. Gallery, Video & Blogs' },
                { id: 'cta', label: '5. Donate & Volunteer CTAs' },
                { id: 'seo', label: '6. SEO & Publish' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFormTab(tab.id as any)}
                  className={`px-3 py-2 border-b-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    formTab === tab.id
                      ? 'border-[#168039] text-[#168039]'
                      : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* TAB 1: BASIC INFO */}
              {formTab === 'basic' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formTitle}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="e.g. Tree Plantation & Green Lucknow Initiative"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold outline-none focus:border-[#168039]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Project Slug (URL Path) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formSlug}
                        onChange={(e) => {
                          setIsSlugManual(true);
                          setFormSlug(e.target.value);
                        }}
                        placeholder="e.g. tree-plantation-green-lucknow"
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-mono outline-none focus:border-[#168039]"
                      />
                      <span className="text-[10px] text-gray-400 mt-1 block">
                        Page URL: /projects/{formSlug || 'project-slug'}
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Category *
                      </label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-semibold outline-none focus:border-[#168039] bg-white"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Status *
                      </label>
                      <select
                        value={formStatus}
                        onChange={(e) => setFormStatus(e.target.value as any)}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-semibold outline-none focus:border-[#168039] bg-white"
                      >
                        {STATUSES.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Location String
                      </label>
                      <input
                        type="text"
                        value={formLocation}
                        onChange={(e) => setFormLocation(e.target.value)}
                        placeholder="e.g. Lucknow, Uttar Pradesh"
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#168039]"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2 md:col-span-2">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">City</label>
                        <input
                          type="text"
                          value={formCity}
                          onChange={(e) => setFormCity(e.target.value)}
                          placeholder="Lucknow"
                          className="w-full px-3 py-1.5 rounded-xl border border-gray-300 text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">State</label>
                        <input
                          type="text"
                          value={formState}
                          onChange={(e) => setFormState(e.target.value)}
                          placeholder="Uttar Pradesh"
                          className="w-full px-3 py-1.5 rounded-xl border border-gray-300 text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Country</label>
                        <input
                          type="text"
                          value={formCountry}
                          onChange={(e) => setFormCountry(e.target.value)}
                          placeholder="India"
                          className="w-full px-3 py-1.5 rounded-xl border border-gray-300 text-xs outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={formStartDate}
                        onChange={(e) => setFormStartDate(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Target End Date</label>
                      <input
                        type="date"
                        value={formEndDate}
                        onChange={(e) => setFormEndDate(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Short Summary / Excerpt * (Displayed on Cards &amp; Meta)
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={formShortDesc}
                        onChange={(e) => setFormShortDesc(e.target.value)}
                        placeholder="Brief 1-2 sentence overview of the project and its goals..."
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#168039]"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <ImageUploadField
                        label="Featured Cover Image * (Upload or Pick from Library)"
                        value={formFeaturedImage}
                        onChange={(url) => setFormFeaturedImage(url)}
                        aspect="video"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Featured Image Alt Text
                      </label>
                      <input
                        type="text"
                        value={formImageAlt}
                        onChange={(e) => setFormImageAlt(e.target.value)}
                        placeholder="e.g. Community members planting trees in Lucknow"
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: NARRATIVE & WHY IT MATTERS */}
              {formTab === 'narrative' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Why This Project Matters * (Highlighted Callout Section)
                    </label>
                    <textarea
                      rows={3}
                      value={formWhyMatters}
                      onChange={(e) => setFormWhyMatters(e.target.value)}
                      placeholder="Explain the environmental or humanitarian urgency that makes this initiative critical..."
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#168039]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-gray-700">
                        Full Project Narrative &amp; Description (Supports Markdown)
                      </label>
                      <span className="text-[10px] text-gray-400">Supports ## H2, ### H3, - bullets, **bold**</span>
                    </div>
                    <textarea
                      rows={12}
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      placeholder="## Heading...&#10;&#10;Detailed explanation of the project context, methodology, ground execution, and community participation..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-mono outline-none focus:border-[#168039] leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: REPEATERS (OBJECTIVES, ACTIVITIES, STATS) */}
              {formTab === 'repeaters' && (
                <div className="space-y-6">
                  
                  {/* Objectives Repeater */}
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                          Project Objectives (01, 02, 03...)
                        </h4>
                        <p className="text-[11px] text-gray-500">Core milestone goals displayed as numbered list on detail page.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormObjectives([...formObjectives, ''])}
                        className="px-3 py-1 rounded-lg bg-[#168039] text-white text-xs font-bold hover:bg-[#137233] flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Objective
                      </button>
                    </div>

                    <div className="space-y-2">
                      {formObjectives.map((obj, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-gray-200 text-gray-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <input
                            type="text"
                            value={obj}
                            onChange={(e) => {
                              const updated = [...formObjectives];
                              updated[idx] = e.target.value;
                              setFormObjectives(updated);
                            }}
                            placeholder="e.g. Plant 50,000 native saplings with 85%+ survival rate"
                            className="flex-1 px-3 py-1.5 rounded-xl border border-gray-300 text-xs outline-none bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => setFormObjectives(formObjectives.filter((_, i) => i !== idx))}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Activities Repeater */}
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                          What We Do / Activities
                        </h4>
                        <p className="text-[11px] text-gray-500">Action items displayed as visual cards in activity section.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormActivities([...formActivities, ''])}
                        className="px-3 py-1 rounded-lg bg-[#168039] text-white text-xs font-bold hover:bg-[#137233] flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Activity
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {formActivities.map((act, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={act}
                            onChange={(e) => {
                              const updated = [...formActivities];
                              updated[idx] = e.target.value;
                              setFormActivities(updated);
                            }}
                            placeholder="e.g. Tree Plantation Drives"
                            className="flex-1 px-3 py-1.5 rounded-xl border border-gray-300 text-xs outline-none bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => setFormActivities(formActivities.filter((_, i) => i !== idx))}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Impact Statistics Repeater */}
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                          Our Impact (Verified Statistics)
                        </h4>
                        <p className="text-[11px] text-gray-500">Verified numbers like &ldquo;5,000+ Trees Planted&rdquo;.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormStats([...formStats, { number: '', label: '' }])}
                        className="px-3 py-1 rounded-lg bg-[#168039] text-white text-xs font-bold hover:bg-[#137233] flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Statistic
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {formStats.map((st, idx) => (
                        <div key={idx} className="p-3 bg-white rounded-xl border border-gray-200 space-y-2 relative">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-gray-400">Stat #{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => setFormStats(formStats.filter((_, i) => i !== idx))}
                              className="text-red-500 hover:text-red-700 text-xs cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={st.number}
                              onChange={(e) => {
                                const updated = [...formStats];
                                updated[idx].number = e.target.value;
                                setFormStats(updated);
                              }}
                              placeholder="e.g. 5,000+"
                              className="px-2.5 py-1 rounded-lg border border-gray-300 text-xs font-bold outline-none"
                            />
                            <input
                              type="text"
                              value={st.label}
                              onChange={(e) => {
                                const updated = [...formStats];
                                updated[idx].label = e.target.value;
                                setFormStats(updated);
                              }}
                              placeholder="e.g. Trees Planted"
                              className="px-2.5 py-1 rounded-lg border border-gray-300 text-xs outline-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 4: MEDIA (GALLERY, VIDEO & BLOGS) */}
              {formTab === 'media' && (
                <div className="space-y-6">
                  
                  {/* Gallery */}
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                          Project Photo Gallery ({formGallery.length} photos)
                        </h4>
                        <p className="text-[11px] text-gray-500">Add ground photos with captions for the lightbox gallery.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsGalleryMediaOpen(true)}
                        className="px-3 py-1.5 rounded-lg bg-[#168039] text-white text-xs font-bold hover:bg-[#137233] flex items-center gap-1.5 cursor-pointer"
                      >
                        <ImageIcon className="w-3.5 h-3.5" /> Pick from Media Library
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {formGallery.map((item, idx) => (
                        <div key={idx} className="p-3 bg-white rounded-xl border border-gray-200 flex gap-3 items-start">
                          <div className="relative w-20 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                            <Image src={item.image} alt={item.alt || ''} fill sizes="80px" className="object-cover" />
                          </div>
                          <div className="flex-1 space-y-1.5 min-w-0">
                            <input
                              type="text"
                              value={item.caption || ''}
                              onChange={(e) => {
                                const updated = [...formGallery];
                                updated[idx].caption = e.target.value;
                                setFormGallery(updated);
                              }}
                              placeholder="Image Caption..."
                              className="w-full px-2 py-1 rounded border border-gray-200 text-[11px] outline-none"
                            />
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] text-gray-400 font-mono truncate max-w-[120px]">{item.image}</span>
                              <button
                                type="button"
                                onClick={() => setFormGallery(formGallery.filter((_, i) => i !== idx))}
                                className="text-red-500 hover:text-red-700 text-[10px] font-semibold cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* YouTube Video URL */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Project YouTube Video URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={formVideoUrl}
                      onChange={(e) => setFormVideoUrl(e.target.value)}
                      placeholder="e.g. https://www.youtube.com/watch?v=..."
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#168039]"
                    />
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      If left empty, the video section is automatically hidden on the page.
                    </span>
                  </div>

                  {/* Related Blogs Connection */}
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                    <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                      Connect Published Blog Stories
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Select published blog articles to feature under &ldquo;Project Updates&rdquo;.
                    </p>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {availableBlogs.map((b) => {
                        const isSelected = formRelatedBlogs.includes(b.slug);
                        return (
                          <label
                            key={b.slug}
                            className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-50/70 border-emerald-300 text-[#168039]'
                                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormRelatedBlogs([...formRelatedBlogs, b.slug]);
                                } else {
                                  setFormRelatedBlogs(formRelatedBlogs.filter((s) => s !== b.slug));
                                }
                              }}
                              className="rounded text-[#168039] focus:ring-[#168039]"
                            />
                            <div className="min-w-0 flex-1">
                              <span className="font-bold text-xs block truncate">{b.title}</span>
                              <span className="text-[10px] text-gray-400">{b.category} &bull; /blog/{b.slug}</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 5: DONATE & VOLUNTEER CTAS */}
              {formTab === 'cta' && (
                <div className="space-y-5">
                  {/* Donation CTA */}
                  <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-[#168039]" />
                        <h4 className="text-xs font-bold text-[#168039] uppercase tracking-wider">
                          Project Donation CTA
                        </h4>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formEnableDonation}
                          onChange={(e) => setFormEnableDonation(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#168039]"></div>
                        <span className="ml-2 text-xs font-bold text-gray-700">
                          {formEnableDonation ? 'Enabled (ON)' : 'Disabled (OFF)'}
                        </span>
                      </label>
                    </div>

                    {formEnableDonation && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Button Text</label>
                          <input
                            type="text"
                            value={formDonationText}
                            onChange={(e) => setFormDonationText(e.target.value)}
                            placeholder="e.g. Donate Now"
                            className="w-full px-3 py-1.5 rounded-xl border border-gray-300 text-xs outline-none bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            Custom Donation URL (Leave empty for default 80G modal)
                          </label>
                          <input
                            type="text"
                            value={formDonationUrl}
                            onChange={(e) => setFormDonationUrl(e.target.value)}
                            placeholder="e.g. /donate or leave empty"
                            className="w-full px-3 py-1.5 rounded-xl border border-gray-300 text-xs outline-none bg-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Volunteer CTA */}
                  <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#0f5b9e]" />
                        <h4 className="text-xs font-bold text-[#0f5b9e] uppercase tracking-wider">
                          Project Volunteer CTA
                        </h4>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formEnableVolunteer}
                          onChange={(e) => setFormEnableVolunteer(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0f5b9e]"></div>
                        <span className="ml-2 text-xs font-bold text-gray-700">
                          {formEnableVolunteer ? 'Enabled (ON)' : 'Disabled (OFF)'}
                        </span>
                      </label>
                    </div>

                    {formEnableVolunteer && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Button Text</label>
                          <input
                            type="text"
                            value={formVolunteerText}
                            onChange={(e) => setFormVolunteerText(e.target.value)}
                            placeholder="e.g. Become a Volunteer"
                            className="w-full px-3 py-1.5 rounded-xl border border-gray-300 text-xs outline-none bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Volunteer URL</label>
                          <input
                            type="text"
                            value={formVolunteerUrl}
                            onChange={(e) => setFormVolunteerUrl(e.target.value)}
                            placeholder="/volunteer"
                            className="w-full px-3 py-1.5 rounded-xl border border-gray-300 text-xs outline-none bg-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 6: SEO & PUBLISH */}
              {formTab === 'seo' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 mb-1">Meta Title *</label>
                      <input
                        type="text"
                        value={formMetaTitle}
                        onChange={(e) => setFormMetaTitle(e.target.value)}
                        placeholder="e.g. Tree Plantation Project in Lucknow | ITLC Foundation"
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#168039]"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 mb-1">Meta Description *</label>
                      <textarea
                        rows={2}
                        value={formMetaDesc}
                        onChange={(e) => setFormMetaDesc(e.target.value)}
                        placeholder="e.g. Learn about ITLC Foundation's tree plantation initiative in Lucknow..."
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#168039]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Focus Keyword</label>
                      <input
                        type="text"
                        value={formFocusKeyword}
                        onChange={(e) => setFormFocusKeyword(e.target.value)}
                        placeholder="e.g. Tree Plantation Lucknow NGO"
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Canonical URL</label>
                      <input
                        type="text"
                        value={formCanonicalUrl}
                        onChange={(e) => setFormCanonicalUrl(e.target.value)}
                        placeholder="https://itlc.foundation/projects/slug"
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none"
                      />
                    </div>

                    <div className="md:col-span-2 pt-2 border-t border-gray-100">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">
                        Publish &amp; Showcase Settings
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        
                        {/* Published toggle */}
                        <div className="p-3 rounded-xl border border-gray-200 flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold block text-gray-900">Publish State</span>
                            <span className="text-[10px] text-gray-400">
                              {formPublished ? 'Visible to public' : 'Saved as Draft'}
                            </span>
                          </div>
                          <input
                            type="checkbox"
                            checked={formPublished}
                            onChange={(e) => setFormPublished(e.target.checked)}
                            className="h-4 w-4 rounded text-[#168039] focus:ring-[#168039]"
                          />
                        </div>

                        {/* Featured toggle */}
                        <div className="p-3 rounded-xl border border-gray-200 flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold block text-gray-900">Featured Project</span>
                            <span className="text-[10px] text-gray-400">Showcase in top section</span>
                          </div>
                          <input
                            type="checkbox"
                            checked={formIsFeatured}
                            onChange={(e) => setFormIsFeatured(e.target.checked)}
                            className="h-4 w-4 rounded text-[#0f5b9e] focus:ring-[#0f5b9e]"
                          />
                        </div>

                        {/* Display order */}
                        <div className="p-3 rounded-xl border border-gray-200">
                          <label className="text-xs font-bold block text-gray-900 mb-1">Display Order</label>
                          <input
                            type="number"
                            value={formDisplayOrder}
                            onChange={(e) => setFormDisplayOrder(Number(e.target.value))}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-xs outline-none"
                          />
                        </div>

                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50 -mx-6 -mb-6 mt-6 shrink-0 rounded-b-3xl">
                <div className="text-[11px] text-gray-400">
                  {isEditing ? `Editing ID: ${editingId}` : 'New Project Record'}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-[#168039] hover:bg-[#137233] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{isSaving ? 'Saving...' : isEditing ? 'Update Project' : 'Create & Publish Project'}</span>
                  </button>
                </div>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Media Picker Modal for Gallery Photos */}
      <MediaGalleryModal
        isOpen={isGalleryMediaOpen}
        onClose={() => setIsGalleryMediaOpen(false)}
        onSelect={(url) => {
          setFormGallery([
            ...formGallery,
            { image: url, caption: '', alt: formTitle, order: formGallery.length + 1 },
          ]);
          setIsGalleryMediaOpen(false);
        }}
      />

    </div>
  );
}
