'use client';

import React, { use, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Calendar,
  Sparkles,
  Heart,
  Users,
  CheckCircle2,
  ShieldCheck,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  Share2,
  Copy,
  Check,
  Clock,
  Layers,
  HelpCircle,
  Leaf,
  Target,
  Activity,
  BarChart3,
  ExternalLink,
} from 'lucide-react';
import { useDonationModal } from '@/context/donation-modal-context';
import { getProjectBySlug, getAllProjects, getRelatedProjects, Project } from '@/data/projects';
import { getAllBlogs, BlogPost } from '@/data/blog-posts';

function getYoutubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  try {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
  } catch (e) {
    return null;
  }
}

export default function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const initialProject = getProjectBySlug(slug);

  const [project, setProject] = useState<Project | undefined>(initialProject);
  const { openDonationModal } = useDonationModal();
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  // Lightbox state for project gallery
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }

    async function loadProject() {
      try {
        const res = await fetch(`/api/content/projects?slug=${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.project) {
            setProject(data.project);
          }
        }
      } catch (e) {
        console.warn('Using local project data:', e);
      }
    }
    loadProject();
  }, [slug]);

  if (!project) {
    notFound();
  }

  const relatedProjects = getRelatedProjects(project.slug, project.category, 3);
  const gallery = project.gallery && project.gallery.length > 0
    ? project.gallery
    : [{ image: project.featured_image, caption: project.title, alt: project.title }];

  // Find connected blog posts
  const allBlogs = getAllBlogs();
  const connectedBlogs: BlogPost[] = (project.related_blogs || [])
    .map((bSlug) => allBlogs.find((b) => b.slug === bSlug))
    .filter((b): b is BlogPost => Boolean(b));

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const embedUrl = getYoutubeEmbedUrl(project.video_url);

  // Markdown renderer for project description
  const renderMarkdown = (text: string) => {
    const lines = text.trim().split('\n');
    const elements: React.ReactNode[] = [];
    let currentList: string[] = [];

    const flushList = (key: string) => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={key} className="space-y-2.5 my-4 pl-4 list-disc text-slate-700">
            {currentList.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                <span dangerouslySetInnerHTML={{ __html: item }} />
              </li>
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      if (trimmed.startsWith('## ')) {
        flushList(`list-${index}`);
        elements.push(
          <h2 key={`h2-${index}`} className="text-xl sm:text-2xl font-black text-slate-900 mt-8 mb-4 font-headline tracking-tight border-b border-slate-100 pb-2">
            {trimmed.replace('## ', '')}
          </h2>
        );
        return;
      }

      if (trimmed.startsWith('### ')) {
        flushList(`list-${index}`);
        elements.push(
          <h3 key={`h3-${index}`} className="text-lg sm:text-xl font-bold text-slate-900 mt-6 mb-3 font-headline">
            {trimmed.replace('### ', '')}
          </h3>
        );
        return;
      }

      if (trimmed === '---') {
        flushList(`list-${index}`);
        elements.push(<hr key={`hr-${index}`} className="my-8 border-slate-200" />);
        return;
      }

      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const itemText = trimmed.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        currentList.push(itemText);
        return;
      }

      if (/^\d+\.\s/.test(trimmed)) {
        const itemText = trimmed.replace(/^\d+\.\s/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        currentList.push(itemText);
        return;
      }

      if (trimmed.length > 0) {
        flushList(`list-${index}`);
        const formatted = trimmed
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>');
        elements.push(
          <p key={`p-${index}`} className="text-slate-700 leading-relaxed text-sm sm:text-base my-3.5" dangerouslySetInnerHTML={{ __html: formatted }} />
        );
      }
    });

    flushList('list-final');
    return elements;
  };

  return (
    <div className="bg-[#f7faf8] min-h-screen text-slate-800 pb-20">
      
      {/* ========================================================================= */}
      {/* TOP BREADCRUMBS BAR                                                       */}
      {/* ========================================================================= */}
      <div className="bg-white border-b border-slate-200/80 sticky top-[72px] md:top-[80px] z-20">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#168039] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Projects &amp; Initiatives</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#168039] font-bold border border-emerald-200">
              {project.category}
            </span>
            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                project.status === 'Completed'
                  ? 'bg-blue-100 text-blue-800'
                  : project.status === 'Upcoming'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-emerald-100 text-[#168039]'
              }`}
            >
              {project.status}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. HERO SECTION (DYNAMIC SPLIT PRESENTATION)                              */}
      {/* ========================================================================= */}
      <section className="relative w-full bg-[#dff0e6] bg-gradient-to-r from-[#daf0e3] via-[#e2f2e7] to-[#d8ece0] py-12 md:py-20 border-b border-[#c8e2d3] overflow-hidden">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5">
              
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#168039] font-headline">
                <Leaf className="w-3.5 h-3.5 text-[#168039]" />
                <span>CATEGORY &bull; {project.category}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0f5b9e] font-headline tracking-tight leading-tight">
                {project.title}
              </h1>

              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-sans">
                {project.short_description}
              </p>

              {/* Location Pin */}
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600">
                <MapPin className="w-4 h-4 text-[#168039] shrink-0" />
                <span>{project.location || 'Lucknow, Uttar Pradesh'}</span>
              </div>

              {/* Dynamic CTAs (strictly admin controlled) */}
              {(project.enable_donation || project.enable_volunteer) && (
                <div className="pt-3 flex flex-wrap items-center gap-3.5">
                  {project.enable_donation && (
                    <button
                      type="button"
                      onClick={() => {
                        if (project.donation_url) {
                          window.location.href = project.donation_url;
                        } else {
                          openDonationModal();
                        }
                      }}
                      className="bg-[#168039] hover:bg-[#137233] text-white text-xs sm:text-sm font-bold px-6 py-3.5 rounded-xl shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Heart className="w-4 h-4 text-rose-300 fill-rose-300" />
                      <span>{project.donation_button_text || 'Donate Now'}</span>
                    </button>
                  )}

                  {project.enable_volunteer && (
                    <Link
                      href={project.volunteer_url || '/volunteer'}
                      className="bg-white hover:bg-emerald-50 text-[#083a27] border border-emerald-300 text-xs sm:text-sm font-bold px-6 py-3.5 rounded-xl shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Users className="w-4 h-4" />
                      <span>{project.volunteer_button_text || 'Become a Volunteer'}</span>
                    </Link>
                  )}
                </div>
              )}

            </div>

            {/* Right Large Hero Image */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-xl border-4 border-white/80 bg-slate-200 group">
                <Image
                  src={project.featured_image || '/pro/tree.png'}
                  alt={project.image_alt || project.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover transition-transform duration-700 group-hover:scale-103"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-medium bg-black/60 backdrop-blur-xs p-3 rounded-xl border border-white/20 truncate">
                  {project.image_alt || project.title}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* MAIN CONTAINER: 2-COLUMN ARTICLE & SIDEBAR                                */}
      {/* ========================================================================= */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Main Left Column */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* 6. WHY THIS PROJECT MATTERS (HIGHLIGHTED CALLOUT) */}
            {project.why_matters && (
              <div className="bg-gradient-to-br from-emerald-50/80 via-white to-blue-50/40 rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#168039]">
                  <Sparkles className="w-4 h-4 text-[#168039]" />
                  <span>Why This Project Matters</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-headline leading-snug">
                  Transforming vulnerable surroundings into resilient communities.
                </h3>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-sans">
                  {project.why_matters}
                </p>
              </div>
            )}

            {/* 5. ABOUT THE PROJECT (FULL RICH TEXT NARRATIVE) */}
            <article className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[#168039] font-bold text-xs uppercase tracking-widest block font-headline mb-1">
                  ABOUT THE PROJECT —
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-headline tracking-tight">
                  Creating lasting impact through collective action.
                </h2>
              </div>

              <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
                {renderMarkdown(project.description)}
              </div>
            </article>

            {/* 7. PROJECT OBJECTIVES (DYNAMIC NUMBERED LIST) */}
            {project.objectives && project.objectives.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#168039]">
                  <Target className="w-4 h-4 text-[#168039]" />
                  <span>PROJECT OBJECTIVES</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-headline tracking-tight">
                  Clear, Measurable Milestones
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {project.objectives.map((obj, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-[#f8faf9] border border-slate-200/70 flex items-start gap-3.5 hover:border-[#168039]/40 transition-colors"
                    >
                      <span className="w-8 h-8 rounded-xl bg-[#168039] text-white flex items-center justify-center text-xs font-black shrink-0 shadow-xs">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed pt-0.5">
                        {obj}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. WHAT WE DO (ACTIVITIES GRID) */}
            {project.activities && project.activities.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#168039]">
                  <Activity className="w-4 h-4 text-[#168039]" />
                  <span>WHAT WE DO</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-headline tracking-tight">
                  Core Field Operations &amp; Workstreams
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 pt-2">
                  {project.activities.map((act, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/60 flex items-center gap-3 group hover:bg-emerald-100/60 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-xl bg-white border border-emerald-200 flex items-center justify-center text-[#168039] shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                        {act}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 9. OUR IMPACT (VERIFIED STATS) */}
            {project.statistics && project.statistics.length > 0 && (
              <div className="bg-gradient-to-br from-[#0f5b9e] to-[#093c68] text-white rounded-3xl p-6 sm:p-10 shadow-md space-y-6">
                <div>
                  <span className="text-emerald-300 font-bold text-xs uppercase tracking-widest block mb-1">
                    OUR IMPACT —
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black font-headline tracking-tight">
                    Turning action into measurable impact.
                  </h3>
                  {project.impact_description && (
                    <p className="text-xs sm:text-sm text-white/80 mt-2 max-w-2xl leading-relaxed">
                      {project.impact_description}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  {project.statistics.map((st, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 text-center">
                      <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-300 font-headline block">
                        {st.number}
                      </span>
                      <span className="text-xs text-white/90 font-medium mt-1 block">
                        {st.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 10. PROJECT GALLERY & LIGHTBOX */}
            {gallery && gallery.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[#168039] font-bold text-xs uppercase tracking-widest block font-headline mb-1">
                      PROJECT GALLERY —
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-headline tracking-tight">
                      Moments from the Ground
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    {gallery.length} Photos &bull; Click to expand
                  </span>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-2">
                  {gallery.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setLightboxIndex(idx);
                        setLightboxOpen(true);
                      }}
                      className="group relative aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 focus:outline-none cursor-pointer"
                    >
                      <Image
                        src={item.image}
                        alt={item.alt || `Gallery image ${idx + 1}`}
                        fill
                        sizes="(max-width: 640px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-106"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <Layers className="w-5 h-5" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 11. PROJECT VIDEO (OPTIONAL YOUTUBE EMBED) */}
            {embedUrl && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5">
                <div>
                  <span className="text-[#168039] font-bold text-xs uppercase tracking-widest block font-headline mb-1">
                    PROJECT VIDEO —
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-headline tracking-tight">
                    Watch Ground Operations in Action
                  </h3>
                </div>

                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-md border border-slate-200">
                  <iframe
                    src={embedUrl}
                    title={project.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
              </div>
            )}

            {/* 12. PROJECT UPDATES (RELATED BLOG STORIES) */}
            {connectedBlogs.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[#168039] font-bold text-xs uppercase tracking-widest block font-headline mb-1">
                      PROJECT UPDATES —
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-headline tracking-tight">
                      Latest Stories from This Project
                    </h3>
                  </div>
                  <Link href="/blog" className="text-xs font-semibold text-[#0f5b9e] hover:underline">
                    View All Stories &rarr;
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {connectedBlogs.map((b) => (
                    <Link
                      key={b.slug}
                      href={`/blog/${b.slug}`}
                      className="group p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-[#168039] hover:bg-white transition-all flex gap-3.5 cursor-pointer"
                    >
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                        <Image src={b.image || '/pro/ab.png'} alt={b.title} fill sizes="80px" className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-[#0f5b9e] uppercase tracking-wider block mb-0.5">
                          {b.category}
                        </span>
                        <h4 className="font-bold text-xs text-slate-900 group-hover:text-[#168039] transition-colors line-clamp-2 leading-snug">
                          {b.title}
                        </h4>
                        <span className="text-[11px] text-[#168039] font-bold mt-1.5 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          <span>Read Story</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 13. HOW YOU CAN HELP (DUAL CTA CARDS) */}
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-slate-900 font-headline tracking-tight">
                You can be part of the change.
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* DONATE CARD */}
                {project.enable_donation && (
                  <div className="bg-gradient-to-br from-[#083a27] to-[#125c3a] text-white rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                        <Heart className="w-4 h-4 fill-rose-400 text-rose-400" />
                        <span>DONATE</span>
                      </div>
                      <h4 className="text-xl font-black font-headline">Support this project</h4>
                      <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                        Your financial contribution directly funds saplings, veterinary first aid kits, or school supplies in Uttar Pradesh under Section 80G tax exemption.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (project.donation_url) {
                          window.location.href = project.donation_url;
                        } else {
                          openDonationModal();
                        }
                      }}
                      className="bg-white hover:bg-emerald-50 text-[#083a27] font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span>{project.donation_button_text || 'Donate Now'}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* VOLUNTEER CARD */}
                {project.enable_volunteer && (
                  <div className="bg-gradient-to-br from-[#0f5b9e] to-[#0a4273] text-white rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                        <Users className="w-4 h-4 text-emerald-300" />
                        <span>VOLUNTEER</span>
                      </div>
                      <h4 className="text-xl font-black font-headline">Give your time</h4>
                      <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                        Join our passionate volunteer network on weekends to plant trees, feed community animals, or teach children across Lucknow.
                      </p>
                    </div>
                    <Link
                      href={project.volunteer_url || '/volunteer'}
                      className="bg-white hover:bg-blue-50 text-[#0f5b9e] font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span>{project.volunteer_button_text || 'Become a Volunteer'}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}

              </div>
            </div>

          </div>

          {/* Right Sidebar */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-28 self-start">
            
            {/* Project Overview Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-3">
                Project Overview
              </h4>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Category:</span>
                  <span className="font-bold text-[#0f5b9e]">{project.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold text-[#168039]">{project.status}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Location:</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[170px]">{project.location}</span>
                </div>
                {project.start_date && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Timeline:</span>
                    <span className="font-semibold text-slate-800">
                      {project.start_date} {project.end_date ? `to ${project.end_date}` : '(Ongoing)'}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Tax Benefit:</span>
                  <span className="font-bold text-emerald-700">Section 80G Exempt</span>
                </div>
              </div>

              {/* Share Strip */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5" /> Share:
                </span>
                <div className="flex items-center gap-1.5">
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${project.title} - Support this initiative on ITLC Foundation: ${currentUrl}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-emerald-100 text-[#168039] hover:bg-emerald-200 transition-colors text-xs font-bold"
                    title="Share on WhatsApp"
                  >
                    WA
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors text-xs"
                    title="Copy Page URL"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#168039]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick 80G Tax Donation Card */}
            <div className="bg-gradient-to-br from-[#083a27] to-[#125c3a] text-white rounded-3xl p-6 shadow-sm space-y-3.5">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Tax Exempt &bull; 80G</span>
              </div>
              <h4 className="text-base font-bold leading-snug">
                Every Rupee Makes a Direct Ground Difference
              </h4>
              <p className="text-xs text-white/80 leading-relaxed">
                Instant 80G certificate and donation receipts sent directly to your email upon contribution.
              </p>
              <button
                type="button"
                onClick={() => openDonationModal()}
                className="w-full bg-white hover:bg-emerald-50 text-[#083a27] text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                <span>Donate to ITLC Foundation</span>
              </button>
            </div>

          </aside>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 15. RELATED PROJECTS (EXPLORE MORE)                                       */}
      {/* ========================================================================= */}
      {relatedProjects.length > 0 && (
        <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-12 border-t border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
            <div>
              <span className="text-[#168039] font-bold text-xs uppercase tracking-widest block font-headline mb-1">
                EXPLORE MORE —
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-headline tracking-tight">
                More projects making a difference.
              </h3>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#168039] hover:text-[#137233] transition-colors group cursor-pointer"
            >
              <span>View All Projects</span>
              <ArrowRight className="w-4 h-4 text-[#168039] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProjects.map((p) => (
              <div
                key={p.id}
                className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-[#168039]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={p.featured_image || '/pro/tree.png'}
                      alt={p.title}
                      fill
                      sizes="350px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-[#0f5b9e] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs uppercase">
                      {p.category}
                    </span>
                  </div>
                  <div className="p-5 space-y-2">
                    <h4 className="font-bold text-base text-slate-900 group-hover:text-[#168039] transition-colors line-clamp-2 leading-snug font-headline">
                      {p.title}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {p.short_description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href={`/projects/${p.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#168039] group-hover:text-[#137233]"
                    >
                      <span>View Project</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                    <span className="text-[10px] font-bold text-slate-400">{p.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 16. FINAL FULL-WIDTH CTA                                                  */}
      {/* ========================================================================= */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-gradient-to-br from-[#083a27] via-[#0e5237] to-[#083a27] text-white rounded-3xl p-8 sm:p-14 text-center space-y-5 shadow-lg">
          <span className="inline-block text-emerald-300 font-bold text-xs uppercase tracking-widest font-headline">
            TOGETHER FOR A BETTER TOMORROW —
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-headline max-w-2xl mx-auto leading-tight">
            Let&apos;s create a greener, kinder and stronger Uttar Pradesh.
          </h2>
          <p className="text-xs sm:text-sm text-white/80 max-w-xl mx-auto leading-relaxed">
            Your support can help turn ideas into action and action into lasting impact.
          </p>
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={() => openDonationModal()}
              className="bg-white hover:bg-emerald-50 text-[#083a27] font-bold text-xs sm:text-sm px-7 py-3 rounded-full shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>Donate Now</span>
            </button>
            <Link
              href="/volunteer"
              className="border border-white/50 hover:bg-white/10 text-white font-medium text-xs sm:text-sm px-6 py-3 rounded-full transition-all inline-flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>Join as Volunteer</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* GALLERY FULL-SCREEN LIGHTBOX                                              */}
      {/* ========================================================================= */}
      {lightboxOpen && gallery.length > 0 && (
        <div className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={() => setLightboxIndex((lightboxIndex - 1 + gallery.length) % gallery.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10 cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={() => setLightboxIndex((lightboxIndex + 1) % gallery.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10 cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-4xl max-h-[85vh] w-full flex flex-col items-center justify-center">
            <div className="relative w-full h-[65vh] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={gallery[lightboxIndex].image}
                alt={gallery[lightboxIndex].alt || 'Gallery photo'}
                fill
                sizes="1200px"
                className="object-contain"
              />
            </div>
            {gallery[lightboxIndex].caption && (
              <p className="text-white/90 text-sm mt-4 text-center font-medium max-w-xl">
                {gallery[lightboxIndex].caption}
              </p>
            )}
            <span className="text-white/50 text-xs mt-2 font-mono">
              {lightboxIndex + 1} of {gallery.length}
            </span>
          </div>
        </div>
      )}

    </div>
  );
}
