'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Heart,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Leaf,
  Users,
  Sprout,
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Globe,
  Award,
} from 'lucide-react';
import { useDonationModal } from '@/context/donation-modal-context';
import initialCmsData from '@/data/cms_data.json';
import { BlogPost, getAllBlogs } from '@/data/blog-posts';

const ICON_MAP: Record<string, any> = {
  BookOpen,
  Leaf,
  Users,
  Heart,
  Sprout,
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Globe,
  Award,
};

function getIcon(iconName: any, fallback: any = Heart) {
  if (!iconName) return fallback;
  if (typeof iconName === 'function') return iconName;
  return ICON_MAP[iconName] || fallback;
}

export default function Home() {
  const { openDonationModal } = useDonationModal();
  const [cms, setCms] = useState<any>(initialCmsData.home);
  const [blogs, setBlogs] = useState<BlogPost[]>(getAllBlogs());

  useEffect(() => {
    fetch('/api/content/blogs')
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (data && data.blogs && Array.isArray(data.blogs) && data.blogs.length > 0) {
          setBlogs(data.blogs);
        }
      })
      .catch((err) => {
        console.warn('Using local blog data:', err);
      });
  }, []);

  const featuredMain = blogs[0];
  const secondaryFeatured = (blogs.length > 1 ? blogs.slice(1, 5) : []).concat(blogs).slice(0, 4);

  useEffect(() => {
    fetch('/api/content/cms')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch CMS data');
        return res.json();
      })
      .then((data) => {
        if (data && data.home) {
          setCms(data.home);
        }
      })
      .catch((err) => {
        console.warn('Using local CMS state:', err);
      });
  }, []);

  const hero = cms?.hero || initialCmsData.home.hero;
  const features = cms?.features || initialCmsData.home.features;
  const stats = cms?.stats || initialCmsData.home.stats;
  const projects = cms?.projects || initialCmsData.home.projects;
  const cta = cms?.cta || initialCmsData.home.cta;
  const stories = cms?.stories || initialCmsData.home.stories;
  const latestUpdates = cms?.latestUpdates || (initialCmsData.home as any)?.latestUpdates;
  const mainCard = latestUpdates?.mainCard || (featuredMain ? {
    title: featuredMain.title,
    category: featuredMain.category,
    image: featuredMain.image,
    author: featuredMain.author || 'ITLC Editorial',
    date: featuredMain.date,
    link: `/blog/${featuredMain.slug}`,
  } : null);

  const subCards = (latestUpdates?.subCards && latestUpdates.subCards.length > 0)
    ? latestUpdates.subCards
    : secondaryFeatured.map((item, idx) => ({
        id: `fallback-sub-${idx}`,
        title: item.title,
        category: item.category,
        image: item.image,
        link: `/blog/${item.slug}`,
      }));

  return (
    <div className="flex flex-col w-full bg-[#dff0e6] text-gray-900 overflow-x-hidden">
      {/* ========================================================================= */}
      {/* SECTION 1: HERO SECTION (UNBOXED SECTION-COVERING HD PHOTOGRAPH)          */}
      {/* ========================================================================= */}
      <section
        id="top"
        className="relative w-full bg-[#dff0e6] bg-gradient-to-r from-[#daf0e3] via-[#e2f2e7] to-[#d8ece0] pt-10 pb-16 md:pt-14 md:pb-24 lg:pt-16 lg:pb-28 overflow-hidden min-h-[580px] lg:min-h-[640px] flex items-center"
      >
        {/* Subtle Organic Plant Seedling Watermark in Background */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
          <svg
            viewBox="0 0 500 500"
            className="absolute -left-10 top-1/2 -translate-y-1/2 w-[480px] h-[480px] opacity-[0.09] text-[#168039] fill-current"
          >
            <path d="M250,50 C270,120 330,160 410,180 C330,220 280,290 270,450 C250,450 240,320 180,260 C120,200 60,190 50,190 C130,170 190,130 210,50 Z" />
            <path d="M250,120 C220,180 160,210 100,220 C160,240 200,290 220,380 C240,300 280,250 350,230 C280,210 240,170 250,120 Z" opacity="0.6" />
          </svg>
        </div>

        {/* Right Side: Unboxed Section-Covering HD Photograph (NO Card/Box) */}
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[54%] xl:w-[50%] h-full pointer-events-none z-10">
          {/* Seamless Natural Photograph covering the right side of the section */}
          <div className="relative w-full h-full [mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.35)_10%,rgba(0,0,0,0.85)_22%,black_38%,black_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.35)_10%,rgba(0,0,0,0.85)_22%,black_38%,black_100%)]">
            <Image
              src={hero.image || '/ref/hero_boy_hd.jpg'}
              alt="Indian school boy holding green plant sapling in soil with smiling classmates - ITLC Foundation"
              fill
              priority
              sizes="55vw"
              className="object-cover object-left-center"
            />
          </div>

          {/* HD Embedded Vector Script: People Nature Progress Together (Top Right) */}
          <div className="absolute top-6 right-6 xl:top-8 xl:right-10 z-20 select-none text-right">
            <div className="font-cursive text-3xl xl:text-[44px] font-bold text-[#1b3b6f] leading-[1.02] tracking-wide -rotate-3 drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)]">
              People<br />
              Nature<br />
              Progress<br />
              Together
            </div>
          </div>

          {/* HD Embedded Vector Brush Stroke Badge: A Brighter Tomorrow Together. (Bottom Right) */}
          <div className="absolute bottom-12 right-6 xl:bottom-16 xl:right-10 z-20 select-none -rotate-6">
            <div className="relative">
              <svg
                viewBox="0 0 240 100"
                className="w-56 xl:w-64 h-auto drop-shadow-md fill-[#168039]"
              >
                <path d="M12,25 C45,18 110,12 215,8 C230,22 235,45 238,72 C205,82 140,88 35,95 C15,82 5,55 12,25 Z" />
                <path d="M5,35 C8,28 15,22 25,20 C80,15 170,12 230,10 C238,25 232,55 230,75 C180,82 90,88 20,92 C10,85 4,60 5,35 Z" opacity="0.9" />
                <path d="M2,45 C-1,48 4,55 10,50 Z" />
                <path d="M232,25 C239,22 237,32 235,35 Z" />
                <path d="M225,78 C235,82 230,88 222,86 Z" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-cursive text-xl xl:text-2xl font-bold text-white text-center leading-tight tracking-wide drop-shadow-sm px-4">
                <span>
                  A Brighter<br />
                  Tomorrow<br />
                  Together.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Content Layer */}
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Hero Copy & Actions */}
            <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center text-left py-4 lg:py-8 max-w-xl">
              {/* Green Eyebrow */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[#168039] font-bold text-xs md:text-sm tracking-widest uppercase font-headline">
                  {hero.eyebrow || hero.badge || 'A KINDER, BRIGHTER TOMORROW —'}
                </span>
                <span className="hidden sm:inline-block w-8 h-[2px] bg-[#168039]/50 rounded-full" />
              </div>

              {/* Exact 3-line Headline */}
              {hero.titleLine1 ? (
                <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight leading-[1.12] mb-6 font-headline">
                  <span className="text-[#0f5b9e] block">{hero.titleLine1}</span>
                  <span className="text-[#168039] block">{hero.titleLine2}</span>
                  <span className="text-[#0f5b9e] block">{hero.titleLine3}</span>
                </h1>
              ) : (
                <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight leading-[1.12] mb-6 font-headline">
                  <span className="text-[#0f5b9e] block">Empowering</span>
                  <span className="text-[#168039] block">Communities</span>
                  <span className="text-[#0f5b9e] block">Through Learning &amp; Care.</span>
                </h1>
              )}

              {/* Subtitle Paragraph */}
              <p className="text-gray-700 text-sm sm:text-base md:text-[17px] leading-relaxed mb-8">
                {hero.subtitle || hero.description || 'At ITLC Foundation, we work for a cleaner, greener, healthier and more equitable Uttar Pradesh. Together, we create opportunities, protect nature and build a brighter future for all.'}
              </p>

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                {/* Primary Button: Donate Now */}
                <button
                  type="button"
                  onClick={() => openDonationModal()}
                  className="bg-[#168039] hover:bg-[#137233] text-white rounded-full px-7 py-3.5 text-sm sm:text-base font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                >
                  <Heart className="w-4 h-4 fill-white text-white" />
                  <span>{hero.primaryBtnText || 'Donate Now'}</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </button>

                {/* Secondary Button: Learn More */}
                <Link
                  href={hero.secondaryBtnLink || '/about'}
                  className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 rounded-full px-7 py-3.5 text-sm sm:text-base font-semibold flex items-center gap-2 shadow-xs transition-all duration-200 cursor-pointer"
                >
                  <span>{hero.secondaryBtnText || 'Learn More'}</span>
                  <ArrowRight className="w-4 h-4 text-[#168039] ml-0.5" />
                </Link>
              </div>
            </div>

            {/* Mobile/Tablet Fallback Display (Unboxed) */}
            <div className="lg:hidden relative w-full h-[360px] sm:h-[460px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.85)_12%,black_25%,black_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.85)_12%,black_25%,black_100%)]">
              <Image
                src={hero.image || '/ref/hero_boy_hd.jpg'}
                alt="Indian school boy holding green plant sapling in soil with smiling classmates - ITLC Foundation"
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
              />
              {/* Mobile Embedded Script */}
              <div className="absolute top-4 right-4 z-20 text-right">
                <div className="font-cursive text-2xl sm:text-3xl font-bold text-[#1b3b6f] leading-tight -rotate-3 drop-shadow-sm">
                  People<br />Nature<br />Progress<br />Together
                </div>
              </div>
              {/* Mobile Brush Stroke Badge */}
              <div className="absolute bottom-4 right-2 z-20 -rotate-6">
                <div className="relative px-5 py-2.5 bg-[#168039] rounded-xl shadow-md text-white font-cursive text-lg font-bold text-center leading-tight">
                  A Brighter<br />Tomorrow<br />Together.
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Organic Bottom Curve Wave SVG Transition */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-10 pointer-events-none">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-full h-8 sm:h-12 md:h-16 lg:h-20 fill-[#dff0e6]"
          >
            <path d="M0,0 C200,90 450,110 700,50 C950,-10 1100,60 1200,80 L1200,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: FEATURE STRIP & QUOTE BOX (ICONS #168039 & LARGE)            */}
      {/* ========================================================================= */}
      <section className="w-full bg-[#dff0e6] bg-gradient-to-r from-[#daf0e3] via-[#e2f2e7] to-[#d8ece0] py-6 md:py-8 border-b border-[#c8e2d3]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left: Features with #168039 & Larger Icons */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
              {(features || []).map((item: any, idx: number) => {
                const IconComponent = getIcon(item.icon, idx === 0 ? BookOpen : idx === 1 ? Leaf : idx === 2 ? Users : Heart);
                return (
                  <div
                    key={item.id || item.title || item.label || idx}
                    className="flex items-center gap-3 p-2 rounded-xl"
                  >
                    {/* Larger circular container with #168039 icon */}
                    <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-white shadow-xs border border-[#c8e2d3] flex items-center justify-center shrink-0">
                      <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 text-[#168039] stroke-[2.3]" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">
                      {item.title || item.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Right: Quote Box */}
            <div className="lg:col-span-5">
              <div className="bg-white/80 border border-[#c8e2d3] rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-3 relative overflow-hidden shadow-xs">
                <div className="flex items-center gap-3">
                  <span className="text-4xl sm:text-5xl font-serif text-[#168039] select-none leading-none shrink-0 font-bold">
                    &ldquo;
                  </span>
                  <p className="font-bold text-sm sm:text-base text-[#168039] tracking-tight">
                    Small actions create big change.
                  </p>
                </div>
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0">
                  <Image
                    src="/ref/leaf_ornament.png"
                    alt="Leaf Ornament"
                    fill
                    sizes="56px"
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* LATEST UPDATES: EXACT BLOG HERO SECTION (1 LARGE + 2x2 GRID)              */}
      {/* ========================================================================= */}
      <section className="w-full bg-[#dff0e6] bg-gradient-to-r from-[#daf0e3] via-[#e2f2e7] to-[#d8ece0] py-12 md:py-16 border-b border-[#c8e2d3]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header with LATEST UPDATES Heading */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3">
            <div>
              <span className="text-[#168039] font-bold text-xs md:text-sm tracking-widest uppercase block font-headline mb-1">
                {latestUpdates?.eyebrow || 'LATEST UPDATES —'}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0f5b9e] tracking-tight font-headline">
                {latestUpdates?.heading || 'Latest Updates & Ground Stories'}
              </h2>
            </div>
            <Link
              href={latestUpdates?.viewAllLink || '/blog'}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#168039] hover:text-[#137233] transition-colors group cursor-pointer"
            >
              <span>{latestUpdates?.viewAllText || 'View All Stories'}</span>
              <ArrowRight className="w-4 h-4 text-[#168039] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* 1 Large + 4 Small Grid (Exact Blog Hero Layout) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-3">
            {/* Left Side: Large Featured Card (~50% width -> lg:col-span-6) */}
            {mainCard && (
              <Link
                href={mainCard.link || '/blog'}
                className="group relative block lg:col-span-6 h-[340px] sm:h-[420px] lg:h-[480px] rounded-[8px] overflow-hidden shadow-2xs border border-white/60 cursor-pointer"
              >
                <Image
                  src={mainCard.image || '/pro/tree.png'}
                  alt={mainCard.title || 'Latest Update'}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-103"
                />
                {/* Subtle dark gradient overlay for readable text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />

                {/* Content pinned near the lower portion */}
                <div className="absolute bottom-0 inset-x-0 p-5 sm:p-7 flex flex-col justify-end text-left">
                  {/* Category badge with small blue background */}
                  <span className="inline-block self-start bg-[#0f5b9e] text-white text-[11px] font-bold px-2.5 py-1 rounded-[4px] uppercase tracking-wider mb-2.5 shadow-2xs">
                    {mainCard.category || 'Focus Area'}
                  </span>

                  {/* Large White Title */}
                  <h3 className="text-xl sm:text-2xl lg:text-[26px] xl:text-3xl font-bold text-white leading-snug line-clamp-3 group-hover:text-blue-100 transition-colors mb-3 font-headline">
                    {mainCard.title}
                  </h3>

                  {/* Author avatar + author name + publication date */}
                  <div className="flex items-center gap-2.5 text-xs text-white/85">
                    <div className="w-6 h-6 rounded-full bg-[#0f5b9e] border border-white/50 flex items-center justify-center text-[10px] font-bold text-white shrink-0 shadow-2xs">
                      {mainCard.author ? mainCard.author.charAt(0) : 'I'}
                    </div>
                    <span className="font-medium truncate max-w-[220px]">
                      {mainCard.author || 'ITLC Editorial'}
                    </span>
                    <span className="text-white/40">&bull;</span>
                    <span className="text-white/75">{mainCard.date || 'Recent'}</span>
                  </div>
                </div>
              </Link>
            )}

            {/* Right Side: 2x2 Grid of Four Smaller Cards (~50% width -> lg:col-span-6) */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 h-auto lg:h-[480px]">
              {(subCards || []).slice(0, 4).map((item: any, idx: number) => (
                <Link
                  key={`home-feat-sub-${item.id || idx}`}
                  href={item.link || '/blog'}
                  className="group relative block h-[190px] sm:h-[200px] lg:h-[234px] rounded-[8px] overflow-hidden shadow-2xs border border-white/60 cursor-pointer"
                >
                  <Image
                    src={item.image || '/pro/ab.png'}
                    alt={item.title || 'Update'}
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
                    <h4 className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-2 group-hover:text-blue-100 transition-colors font-headline">
                      {item.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: KEY PROJECTS IN LUCKNOW (EDITORIAL MINIMALIST DESIGN)          */}
      {/* ========================================================================= */}
      <section id="projects" className="w-full bg-white py-14 md:py-20 scroll-mt-20 border-b border-gray-100">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header Matching Reference Image */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
            <div>
              <p className="text-xs sm:text-sm font-normal text-gray-500 mb-2 font-headline">
                Our projects
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight leading-tight font-headline">
                Our Key Projects in Lucknow
              </h2>
            </div>
            <div>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 bg-black hover:bg-neutral-800 text-white text-xs sm:text-sm font-medium px-4 py-2 sm:px-5 sm:py-2.5 rounded-[4px] transition-colors shrink-0 shadow-sm"
              >
                <span>View all</span>
                <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </Link>
            </div>
          </div>

          {/* Project Cards Grid Matching Reference Image Exactly */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {(projects || []).map((project: any, pIdx: number) => {
              return (
                <Link
                  key={project.id || pIdx}
                  href={project.link || '/projects'}
                  className="group relative h-[380px] sm:h-[440px] lg:h-[480px] w-full rounded-2xl sm:rounded-[20px] overflow-hidden bg-gray-100 block shadow-sm hover:shadow-xl transition-all duration-500 border border-black/5"
                >
                  {/* Full Card Cover Image */}
                  <Image
                    src={project.image || '/ref/project_education_hd.jpg'}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Floating White Overlay Card at Bottom */}
                  <div className="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4 bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-4 md:p-5 shadow-lg flex items-center justify-between gap-3 border border-black/5">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 truncate font-headline group-hover:text-black">
                        {project.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 truncate mt-0.5">
                        {project.description}
                      </p>
                    </div>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 bg-black group-hover:bg-[#168039] text-white flex items-center justify-center rounded-[4px] shrink-0 transition-colors duration-200 shadow-sm">
                      <ArrowUpRight className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: IMPACT STATISTICS STRIP (ICONS #168039 & LARGER)              */}
      {/* ========================================================================= */}
      <section className="w-full bg-[#dff0e6] bg-gradient-to-r from-[#daf0e3] via-[#e2f2e7] to-[#d8ece0] py-12 md:py-14 border-y border-[#c8e2d3]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0">
            {(stats || []).map((stat: any, idx: number) => {
              const StatIcon = getIcon(stat.icon || (idx === 0 ? Users : idx === 1 ? BookOpen : idx === 2 ? Sprout : Heart), Heart);
              const isLast = idx === (stats || []).length - 1;
              return (
                <div
                  key={stat.id || stat.label || idx}
                  className={'flex flex-col items-center text-center px-4 ' + (isLast ? '' : 'lg:border-r lg:border-[#c8e2d3]')}
                >
                  {/* Larger Circular Icon Badge with #168039 */}
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-white shadow-sm border border-[#c8e2d3] flex items-center justify-center mb-3.5">
                    <StatIcon className="w-9 h-9 sm:w-10 sm:h-10 text-[#168039] stroke-[2.2]" />
                  </div>
                  {/* Value */}
                  <span className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0f5b9e] tracking-tight leading-none mb-1 font-headline">
                    {stat.value}
                  </span>
                  {/* Label */}
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-700">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: BE A PART OF THE CHANGE (UNBOXED SECTION-COVERING HD LANDSCAPE)*/}
      {/* ========================================================================= */}
      <section
        id="get-involved"
        className="relative w-full bg-[#dff0e6] bg-gradient-to-r from-[#daf0e3] via-[#e2f2e7] to-[#d8ece0] py-14 md:py-20 lg:py-24 overflow-hidden scroll-mt-20 min-h-[460px] lg:min-h-[520px] flex items-center"
      >
        {/* Subtle Organic Plant Seedling Watermark in Background */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
          <svg
            viewBox="0 0 500 500"
            className="absolute left-1/4 top-1/2 -translate-y-1/2 w-[420px] h-[420px] opacity-[0.09] text-[#168039] fill-current"
          >
            <path d="M250,50 C270,120 330,160 410,180 C330,220 280,290 270,450 C250,450 240,320 180,260 C120,200 60,190 50,190 C130,170 190,130 210,50 Z" />
            <path d="M250,120 C220,180 160,210 100,220 C160,240 200,290 220,380 C240,300 280,250 350,230 C280,210 240,170 250,120 Z" opacity="0.6" />
          </svg>
        </div>

        {/* Right Side: Unboxed Section-Covering HD Landscape (NO Card/Box) */}
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[54%] xl:w-[50%] h-full pointer-events-none z-10">
          {/* Seamless Natural Landscape covering the right side of the section */}
          <div className="relative w-full h-full [mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.35)_10%,rgba(0,0,0,0.85)_22%,black_38%,black_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.35)_10%,rgba(0,0,0,0.85)_22%,black_38%,black_100%)]">
            <Image
              src={cta.image || '/ref/cta_lucknow_hd.jpg'}
              alt="Scenic Lucknow Gomti Riverfront with Heritage Architecture - ITLC Foundation"
              fill
              sizes="55vw"
              className="object-cover object-left-center"
            />
          </div>

          {/* HD Embedded Vector Script: Cleaner Greener Stronger Together (Top Right) */}
          <div className="absolute top-6 right-6 xl:top-8 xl:right-10 z-20 select-none text-right">
            <div className="font-cursive text-3xl xl:text-[42px] font-bold text-[#1b3b6f] leading-[1.02] tracking-wide -rotate-3 drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
              Cleaner<br />
              Greener<br />
              Stronger<br />
              Together
            </div>
          </div>
        </div>

        {/* Left Column Content */}
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center text-left py-2 max-w-xl">
              <span className="text-[#168039] font-bold text-xs md:text-sm tracking-widest uppercase mb-3 block font-headline">
                BE A PART OF THE CHANGE —
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold tracking-tight leading-[1.14] mb-4 font-headline">
                <span className="text-[#0f5b9e] block">Together for a</span>
                <span className="text-[#168039] block">Better Uttar Pradesh.</span>
              </h2>

              <p className="text-gray-700 text-sm sm:text-base md:text-[17px] leading-relaxed mb-8">
                {cta.subtitle || 'Your support helps us create stronger communities, protect nature and build lasting opportunities for future generations.'}
              </p>

              <div>
                <button
                  type="button"
                  onClick={() => openDonationModal()}
                  className="inline-flex bg-[#168039] hover:bg-[#137233] text-white rounded-full px-8 py-3.5 text-sm sm:text-base font-semibold items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                >
                  <Heart className="w-4 h-4 fill-white text-white" />
                  <span>{cta.btnText || 'Donate Now'}</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </div>

            {/* Mobile/Tablet Fallback Landscape (Unboxed) */}
            <div className="lg:hidden relative w-full h-[280px] sm:h-[360px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.85)_12%,black_25%,black_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.85)_12%,black_25%,black_100%)]">
              <Image
                src={cta.image || '/ref/cta_lucknow_hd.jpg'}
                alt="Scenic Lucknow Gomti Riverfront with Heritage Architecture - ITLC Foundation"
                fill
                sizes="100vw"
                className="object-cover object-center"
              />
              <div className="absolute top-3 right-4 z-20 text-right">
                <div className="font-cursive text-2xl sm:text-3xl font-bold text-[#1b3b6f] leading-tight -rotate-3 drop-shadow-sm">
                  Cleaner<br />Greener<br />Stronger<br />Together
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: STORIES FROM THE GROUND (FULL HDR PHOTO CARDS)                 */}
      {/* ========================================================================= */}
      <section className="w-full bg-[#dff0e6] bg-gradient-to-r from-[#daf0e3] via-[#e2f2e7] to-[#d8ece0] pt-6 pb-16 md:pb-24">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0f5b9e] tracking-tight font-headline">
              Stories from the Ground
            </h2>
            <Link
              href="/gallery"
              className="text-xs sm:text-sm font-semibold text-[#168039] hover:text-[#137233] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>View All Stories</span>
              <ArrowRight className="w-4 h-4 text-[#168039]" />
            </Link>
          </div>

          {/* Photo Cards Grid with Full HDR Images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {(stories || []).map((story: any, sIdx: number) => (
              <div
                key={story.id || sIdx}
                className="group relative rounded-2xl overflow-hidden shadow-xs hover:shadow-md border border-[#c8e2d3] bg-white transition-all duration-300 aspect-[16/11]"
              >
                <Image
                  src={story.image || '/ref/story_1_hd.jpg'}
                  alt={story.alt || 'ITLC Foundation Story'}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
