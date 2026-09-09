'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { PageHero } from '@/components/layout/page-hero';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Calendar,
  Sparkles,
  Heart,
  Users,
  CheckCircle2,
  Filter,
  Layers,
  Leaf,
  ShieldCheck,
} from 'lucide-react';
import { useDonationModal } from '@/context/donation-modal-context';
import { getAllProjects, Project } from '@/data/projects';

const CATEGORIES = [
  'All',
  'Environment',
  'Animal Welfare',
  'Women Empowerment',
  'Education',
  'Clean Water',
  'Social Welfare',
];

const STATUSES = ['All', 'Ongoing', 'Completed', 'Upcoming'];

export default function ProjectsPage() {
  const { openDonationModal } = useDonationModal();
  const [projects, setProjects] = useState<Project[]>(getAllProjects().filter((p) => p.published));
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  useEffect(() => {
    // Fetch dynamic project data
    async function loadProjects() {
      try {
        const res = await fetch('/api/content/projects');
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.projects) && data.projects.length > 0) {
            setProjects(data.projects);
          }
        }
      } catch (e) {
        console.warn('Using local projects dataset:', e);
      }
    }
    loadProjects();
  }, []);

  // Filter projects
  const featuredProjects = projects.filter((p) => p.is_featured);

  const filteredProjects = projects.filter((p) => {
    const matchesCat =
      selectedCategory === 'All' ||
      p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesStatus =
      selectedStatus === 'All' ||
      p.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchesCat && matchesStatus;
  });

  return (
    <div className="bg-[#dff0e6] min-h-screen text-gray-900">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (MATCHING HOME PAGE HERO BACKGROUND & IMAGE)              */}
      {/* ========================================================================= */}
      <PageHero
        eyebrow="OUR PROJECTS &amp; INITIATIVES —"
        title={
          <>
            <span>Creating Meaningful Change, </span>
            <span className="text-[#168039]">One Project at a Time.</span>
          </>
        }
        subtitle="From protecting the environment and caring for animals to empowering women and supporting education, our projects turn compassion into meaningful action across Lucknow and Uttar Pradesh."
      >
        <div className="pt-2 flex flex-wrap items-center gap-3.5">
          <a
            href="#featured-projects"
            className="bg-[#168039] hover:bg-[#137233] text-white text-xs sm:text-sm font-bold px-6 py-3.5 rounded-full shadow-md transition-all inline-flex items-center gap-2 cursor-pointer group"
          >
            <span>Explore Projects</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
          <button
            type="button"
            onClick={() => openDonationModal()}
            className="bg-white hover:bg-emerald-50 text-[#083a27] border border-[#c8e2d3] text-xs sm:text-sm font-bold px-6 py-3.5 rounded-full shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>Support Our Mission</span>
          </button>
        </div>
      </PageHero>

      {/* ========================================================================= */}
      {/* 2. FEATURED PROJECTS SECTION (DYNAMIC)                                    */}
      {/* ========================================================================= */}
      {featuredProjects.length > 0 && (
        <section id="featured-projects" className="py-14 md:py-20 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-3 border-b border-slate-200/80 pb-6">
            <div>
              <span className="text-[#168039] font-bold text-xs md:text-sm tracking-widest uppercase block font-headline mb-1.5 sm:mb-2">
                FEATURED PROJECTS —
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-headline">
                <span className="text-[#0f5b9e]">Projects That Create Impact</span> <span className="text-[#168039]">Where It Matters Most.</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
                Explore our initiatives focused on environmental protection, animal welfare, education, women empowerment, clean water and community development.
              </p>
            </div>
            <a
              href="#all-projects"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#168039] hover:text-[#137233] transition-colors group cursor-pointer shrink-0"
            >
              <span>View All Projects</span>
              <ArrowRight className="w-4 h-4 text-[#168039] group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Featured Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {featuredProjects.map((p, idx) => (
              <div
                key={p.id}
                className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-[#168039]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Card Image */}
                  <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={p.featured_image || '/pro/tree.png'}
                      alt={p.image_alt || p.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    {/* Top Badges */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                      <span className="bg-[#0f5b9e] text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-md">
                        {p.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-md shadow-xs backdrop-blur-xs ${
                          p.status === 'Completed'
                            ? 'bg-blue-600/90 text-white'
                            : p.status === 'Upcoming'
                            ? 'bg-purple-600/90 text-white'
                            : 'bg-[#168039]/90 text-white'
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>

                    {/* Project Number badge */}
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white/90 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                      Project {String(idx + 1).padStart(2, '0')}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 sm:p-6 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-[#168039]" />
                      <span className="truncate">{p.location || 'Lucknow, UP'}</span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-[#168039] transition-colors leading-snug line-clamp-2 font-headline">
                      {p.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {p.short_description}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-5 sm:p-6 pt-0">
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href={`/projects/${p.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#168039] group-hover:text-[#137233] transition-colors"
                    >
                      <span>View Project</span>
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>

                    {p.statistics && p.statistics.length > 0 && (
                      <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                        {p.statistics[0].number} {p.statistics[0].label}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </section>
      )}

      {/* ========================================================================= */}
      {/* 3. ALL PROJECTS CATALOG & FILTERS                                         */}
      {/* ========================================================================= */}
      <section id="all-projects" className="py-12 md:py-16 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-[#168039] font-bold text-xs md:text-sm tracking-widest uppercase block font-headline mb-1.5 sm:mb-2">
              PROJECT DIRECTORY —
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-headline">
              <span className="text-[#0f5b9e]">All Field Projects &amp;</span> <span className="text-[#168039]">Community Drives</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Showing {filteredProjects.length} of {projects.length} initiatives
            </p>
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 text-xs">
            {STATUSES.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedStatus === st
                    ? 'bg-[#168039] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#0f5b9e] text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-[#0f5b9e] hover:text-[#0f5b9e]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dynamic Project Cards Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-3">
            <Leaf className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800 text-base">No Projects Found</h4>
            <p className="text-xs text-slate-500">
              No initiatives currently match your selected filters. Please select &ldquo;All&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSelectedStatus('All');
              }}
              className="text-xs font-bold text-[#168039] underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredProjects.map((p, idx) => (
              <div
                key={p.id}
                className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-[#168039]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Card Image */}
                  <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={p.featured_image || '/pro/tree.png'}
                      alt={p.image_alt || p.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    {/* Category & Status */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                      <span className="bg-[#0f5b9e] text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-md">
                        {p.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs ${
                          p.status === 'Completed'
                            ? 'bg-blue-600 text-white'
                            : p.status === 'Upcoming'
                            ? 'bg-purple-600 text-white'
                            : 'bg-[#168039] text-white'
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white/90 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                      Project {String(idx + 1).padStart(2, '0')}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 sm:p-6 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-[#168039]" />
                      <span className="truncate">{p.location || 'Lucknow, UP'}</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#168039] transition-colors leading-snug line-clamp-2 font-headline">
                      {p.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {p.short_description}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-5 sm:p-6 pt-0">
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href={`/projects/${p.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#168039] group-hover:text-[#137233] transition-colors"
                    >
                      <span>View Project</span>
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>

                    {p.statistics && p.statistics.length > 0 && (
                      <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                        {p.statistics[0].number} {p.statistics[0].label}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </section>

      {/* ========================================================================= */}
      {/* 4. FINAL CALL TO ACTION                                                   */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-br from-[#083a27] via-[#0e5237] to-[#083a27] text-white py-16 md:py-24">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-block text-emerald-300 font-bold text-xs md:text-sm uppercase tracking-widest font-headline">
            TOGETHER FOR A BETTER TOMORROW —
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-headline max-w-3xl mx-auto leading-tight">
            <span>Let&apos;s create a greener, </span>
            <span className="text-emerald-300">kinder and stronger Uttar Pradesh.</span>
          </h2>
          <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
            Your support can help turn ideas into action and action into lasting impact. Sponsor a project or volunteer with our field team today.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => openDonationModal()}
              className="bg-white hover:bg-emerald-50 text-[#083a27] font-bold text-xs sm:text-sm px-8 py-3.5 rounded-full shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>Donate Now (80G Tax Exemption)</span>
            </button>
            <Link
              href="/volunteer"
              className="border border-white/50 hover:bg-white/10 text-white font-medium text-xs sm:text-sm px-7 py-3.5 rounded-full transition-all inline-flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>Join as Volunteer</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
