'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PageHero } from '@/components/layout/page-hero';
import { 
  Calendar, 
  Clock, 
  ChevronRight, 
  ArrowRight,
  Sparkles,
  X,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BlogPost, getAllBlogs } from '@/data/blog-posts';

export default function BlogListingPage() {
  const [posts, setPosts] = useState<BlogPost[]>(getAllBlogs());
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [showAllSection, setShowAllSection] = useState(false);

  // Sync with dynamic CMS API if blogs were edited in Admin
  useEffect(() => {
    async function loadBlogs() {
      try {
        const res = await fetch('/api/content/blogs');
        const data = await res.json();
        if (data.blogs && Array.isArray(data.blogs) && data.blogs.length > 0) {
          setPosts(data.blogs);
        }
      } catch (err) {
        console.error('Failed to fetch dynamic blogs, using fallback:', err);
      }
    }
    loadBlogs();
  }, []);

  // Dynamically extract all unique tags from available posts
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach((p) => {
      if (Array.isArray(p.tags)) {
        p.tags.forEach((t) => tagSet.add(t.trim()));
      }
    });
    return Array.from(tagSet);
  }, [posts]);

  // Handle tag click
  const handleTagClick = (tag: string) => {
    if (activeTag?.toLowerCase() === tag.toLowerCase()) {
      setActiveTag(null);
    } else {
      setActiveTag(tag);
      setShowAllSection(true);
    }
  };

  // Scroll to all posts section
  const handleViewAllClick = () => {
    setShowAllSection(true);
    setActiveTag(null);
    setTimeout(() => {
      const el = document.getElementById('all-posts-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  // Filter out drafts for public visitors
  const publicPosts = useMemo(() => {
    return posts.filter((p) => p.status !== 'draft');
  }, [posts]);

  // Mapping posts for sections: prioritize isFeatured post for hero banner
  const featuredMain = useMemo(() => {
    return publicPosts.find((p) => p.isFeatured) || publicPosts[0] || posts[0];
  }, [publicPosts, posts]);

  const secondaryFeatured = useMemo(() => {
    const list = publicPosts.filter((p) => p.slug !== featuredMain?.slug);
    return (list.length > 0 ? list : publicPosts).slice(0, 4);
  }, [publicPosts, featuredMain]);

  // Trending (4 cards)
  const trendingPosts = useMemo(() => {
    return (publicPosts.length >= 4 
      ? [publicPosts[1], publicPosts[0], publicPosts[2], publicPosts[3]] 
      : [...publicPosts, ...publicPosts]).slice(0, 4);
  }, [publicPosts]);

  // Editor Pick (approx 6 posts: 3 in row 1, 3 in row 2)
  const editorPickPosts = useMemo(() => {
    return (publicPosts.length >= 6
      ? [publicPosts[3], publicPosts[4], publicPosts[5], publicPosts[0], publicPosts[1], publicPosts[2]]
      : [...publicPosts, ...publicPosts]).slice(0, 6);
  }, [publicPosts]);

  // Filtered posts for Tag or All Posts view
  const filteredPosts = activeTag
    ? publicPosts.filter((p) => p.tags && p.tags.some((t) => t.toLowerCase() === activeTag.toLowerCase()))
    : publicPosts;

  return (
    <div className="bg-[#dff0e6] text-gray-900 min-h-screen pb-16">
      <PageHero
        eyebrow="LATEST INSIGHTS &amp; GROUND VOICES —"
        title={
          <>
            <span>Stories of Impact &amp; </span>
            <span className="text-[#168039]">Grassroots Change</span>
          </>
        }
        subtitle="Explore ground reports, inspiring transformations, and research insights on environment, welfare, and community development across Uttar Pradesh."
      />
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-7 sm:space-y-9">

        {/* ========================================================================= */}
        {/* 1. FEATURED BLOG / HERO SECTION (Large card + 2x2 Grid)                   */}
        {/* ========================================================================= */}
        <section aria-label="Featured Stories">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-3">
            
            {/* Left Side: Large Featured Card (~50% width -> lg:col-span-6) */}
            {featuredMain && (
              <Link
                href={`/blog/${featuredMain.slug}`}
                className="group relative block lg:col-span-6 h-[340px] sm:h-[420px] lg:h-[480px] rounded-[8px] overflow-hidden shadow-2xs border border-slate-200/60 cursor-pointer"
              >
                <Image
                  src={featuredMain.image || '/pro/tree.png'}
                  alt={featuredMain.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-103"
                />
                {/* Subtle dark gradient overlay for readable text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />

                {/* Content pinned near the lower portion */}
                <div className="absolute bottom-0 inset-x-0 p-5 sm:p-7 flex flex-col justify-end text-left">
                  {/* Category & Featured badge */}
                  <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                    <span className="inline-block bg-[#0f5b9e] text-white text-[11px] font-bold px-2.5 py-1 rounded-[4px] uppercase tracking-wider shadow-2xs">
                      {featuredMain.category}
                    </span>
                    {featuredMain.isFeatured && (
                      <span className="inline-block bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-[4px] uppercase tracking-wider shadow-2xs">
                        ★ Featured Story
                      </span>
                    )}
                  </div>

                  {/* Large White Title */}
                  <h1 className="text-xl sm:text-2xl lg:text-[26px] xl:text-3xl font-bold text-white leading-snug line-clamp-3 group-hover:text-blue-100 transition-colors mb-3">
                    {featuredMain.title}
                  </h1>

                  {/* Author avatar + author name + publication date */}
                  <div className="flex items-center gap-2.5 text-xs text-white/85">
                    <div className="w-6 h-6 rounded-full bg-[#0f5b9e] border border-white/50 flex items-center justify-center text-[10px] font-bold text-white shrink-0 shadow-2xs">
                      {featuredMain.author ? featuredMain.author.charAt(0) : 'I'}
                    </div>
                    <span className="font-medium truncate max-w-[220px]">
                      {featuredMain.author || 'ITLC Editorial'}
                      {featuredMain.authorRole ? ` (${featuredMain.authorRole})` : ''}
                    </span>
                    <span className="text-white/40">&bull;</span>
                    <span className="text-white/75">{featuredMain.date}</span>
                  </div>
                </div>
              </Link>
            )}

            {/* Right Side: 2x2 Grid of Four Smaller Cards (~50% width -> lg:col-span-6) */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 h-auto lg:h-[480px]">
              {secondaryFeatured.map((item, idx) => (
                <Link
                  key={`feat-sub-${item.slug}-${idx}`}
                  href={`/blog/${item.slug}`}
                  className="group relative block h-[190px] sm:h-[200px] lg:h-[234px] rounded-[8px] overflow-hidden shadow-2xs border border-slate-200/60 cursor-pointer"
                >
                  <Image
                    src={item.image || '/pro/ab.png'}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-103"
                  />
                  {/* Subtle dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

                  {/* Content pinned to lower portion */}
                  <div className="absolute bottom-0 inset-x-0 p-3.5 sm:p-4 flex flex-col justify-end text-left">
                    {/* Small category badge */}
                    <span className="inline-block self-start bg-[#0f5b9e] text-white text-[10px] font-bold px-2 py-0.5 rounded-[4px] uppercase tracking-wider mb-1.5 shadow-2xs">
                      {item.category}
                    </span>

                    {/* Short white blog title */}
                    <h2 className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-2 group-hover:text-blue-100 transition-colors">
                      {item.title}
                    </h2>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. SEARCH TAGS BAR                                                        */}
        {/* ========================================================================= */}
        <section aria-label="Search Tags">
          <div className="w-full bg-white border border-slate-200/80 rounded-xl shadow-2xs py-2.5 sm:py-3 px-4 sm:px-6">
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar justify-start md:justify-center">
              <span className="text-xs sm:text-sm font-bold text-slate-700 shrink-0 whitespace-nowrap">
                Most Search Tags:
              </span>
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {allTags.slice(0, 9).map((tag) => {
                  const isActive = activeTag?.toLowerCase() === tag.toLowerCase();
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagClick(tag)}
                      className={cn(
                        'text-xs px-2.5 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap font-medium',
                        isActive
                          ? 'bg-[#0f5b9e] text-white font-bold shadow-2xs'
                          : 'text-slate-600 hover:text-[#0f5b9e] hover:bg-slate-100/80'
                      )}
                    >
                      #{tag}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Active Tag Filter Status Banner (Visible if user filtered by tag) */}
        {activeTag && (
          <div className="flex items-center justify-between bg-blue-50/70 border border-blue-100 rounded-xl p-3.5 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#0f5b9e]">Filtered by:</span>
              <span className="bg-[#0f5b9e] text-white px-2 py-0.5 rounded font-bold">#{activeTag}</span>
              <span className="text-slate-500">({filteredPosts.length} posts found)</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTag(null)}
              className="text-xs font-semibold text-slate-600 hover:text-red-600 flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Filter</span>
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. TRENDING SECTION                                                       */}
        {/* ========================================================================= */}
        <section aria-label="Trending Posts">
          {/* Heading Aligned Left + View All Post Button Aligned Right */}
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 mb-5">
            <div>
              <span className="text-[#168039] font-bold text-xs tracking-widest uppercase block font-headline mb-1">
                TRENDING NOW —
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight font-headline">
                <span className="text-[#0f5b9e]">Popular Ground</span> <span className="text-[#168039]">Stories</span>
              </h2>
            </div>
            <button
              type="button"
              onClick={handleViewAllClick}
              className="text-xs font-semibold text-[#168039] hover:underline flex items-center gap-0.5 cursor-pointer transition-colors"
            >
              <span>View All Posts</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 4 Equal-width Blog Cards in 1 Row on Desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {trendingPosts.map((post, idx) => (
              <Link
                key={`trending-${post.slug}-${idx}`}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-[8px] overflow-hidden border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all flex flex-col cursor-pointer"
              >
                {/* Large Image with Consistent Aspect Ratio */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  <Image
                    src={post.image || '/pro/ab.png'}
                    alt={post.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-104"
                  />
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Category Badge with Blue Background */}
                    <span className="inline-block self-start bg-[#0f5b9e] text-white text-[10px] font-bold px-2 py-0.5 rounded-[4px] uppercase tracking-wider mb-2 shadow-2xs">
                      {post.category}
                    </span>

                    {/* Blog Title */}
                    <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 group-hover:text-[#0f5b9e] transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h3>
                  </div>

                  <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. EDITOR PICK SECTION                                                    */}
        {/* ========================================================================= */}
        <section aria-label="Editor Picks" className="pb-8 sm:pb-12">
          {/* Heading Aligned Left + View All Post Button Aligned Right */}
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 mb-5">
            <div>
              <span className="text-[#168039] font-bold text-xs tracking-widest uppercase block font-headline mb-1">
                CURATED PICKS —
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight font-headline">
                <span className="text-[#0f5b9e]">Editor&apos;s Featured</span> <span className="text-[#168039]">Selections</span>
              </h2>
            </div>
            <button
              type="button"
              onClick={handleViewAllClick}
              className="text-xs font-semibold text-[#168039] hover:underline flex items-center gap-0.5 cursor-pointer transition-colors"
            >
              <span>View All Posts</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Compact Horizontal Cards: 3 Columns on Desktop (3 items row 1, 3 items row 2) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {editorPickPosts.map((post, idx) => (
              <Link
                key={`editor-${post.slug}-${idx}`}
                href={`/blog/${post.slug}`}
                className="group bg-white border border-slate-200/80 rounded-xl p-3 flex items-center gap-3.5 hover:border-slate-300 hover:shadow-2xs transition-all cursor-pointer"
              >
                {/* Small Thumbnail on Left: Approximately 55-70px */}
                <div className="relative w-16 h-16 sm:w-[68px] sm:h-[68px] rounded-[6px] overflow-hidden shrink-0 bg-slate-100">
                  <Image
                    src={post.image || '/pro/ab.png'}
                    alt={post.title}
                    fill
                    sizes="68px"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-106"
                  />
                </div>

                {/* Content on Right */}
                <div className="flex-1 min-w-0">
                  {/* Category Label */}
                  <span className="text-[10px] font-bold text-[#0f5b9e] uppercase tracking-wider block mb-0.5 truncate">
                    {post.category}
                  </span>

                  {/* Bold but Small Blog Title */}
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#0f5b9e] transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Light Gray Date */}
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    {post.date}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* EXPANDABLE ALL POSTS / ARCHIVE VIEW (Triggered by "View All Post" or Tag) */}
        {/* ========================================================================= */}
        {showAllSection && (
          <section id="all-posts-section" aria-label="All Published Stories" className="pt-6 border-t border-slate-200 pb-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[#168039] font-bold text-xs tracking-widest uppercase block font-headline mb-1">
                  GROUND DISPATCHES —
                </span>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight font-headline">
                  {activeTag ? (
                    <>
                      <span className="text-[#0f5b9e]">Stories Tagged with</span> <span className="text-[#168039]">#{activeTag}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-[#0f5b9e]">All Published Articles &amp;</span> <span className="text-[#168039]">Field Reports</span>
                    </>
                  )}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Browse all {filteredPosts.length} published awareness drives and research reports.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAllSection(false);
                  setActiveTag(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-xs font-semibold text-[#0f5b9e] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Back to Top Highlights</span>
              </button>
            </div>

            {/* Grid of full cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <div
                  key={`all-${post.slug}`}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs flex flex-col justify-between group hover:border-slate-300 transition-all"
                >
                  <div>
                    <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                      <Image
                        src={post.image || '/pro/ab.png'}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-103 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-[#0f5b9e] text-white text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider shadow-xs">
                        {post.category}
                      </span>
                    </div>

                    <div className="p-5 space-y-2.5">
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span>{post.date}</span>
                        <span>&bull;</span>
                        <span>{post.readTime}</span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900 leading-snug group-hover:text-[#0f5b9e] transition-colors line-clamp-2">
                        <Link href={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h4>

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#0f5b9e] hover:underline"
                    >
                      <span>Read Full Story</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
