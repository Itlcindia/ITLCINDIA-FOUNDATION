import React from 'react';
import { PageHero } from '@/components/layout/page-hero';
import { BLOG_POSTS } from '@/data/blog-posts';
import Link from 'next/link';
import {
  Compass,
  FileText,
  Heart,
  BookOpen,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export const metadata = {
  title: 'HTML Sitemap | ITLC Foundation Lucknow',
  description: 'Complete directory and sitemap of all pages, causes, articles, and legal documents on the ITLC Foundation portal.',
};

export default function HtmlSitemapPage() {
  const mainPages = [
    { name: 'Home', href: '/', desc: 'Welcome portal, highlights, and live donation interface' },
    { name: 'About Us', href: '/about', desc: 'Our mission, vision, values, and organizational history' },
    { name: 'Our Projects', href: '/projects', desc: 'Active community campaigns across Uttar Pradesh' },
    { name: 'Our Services / Focus Areas', href: '/services', desc: 'Overview of all programmatic pillars' },
    { name: 'Photo Gallery', href: '/gallery', desc: 'Visual records of on-ground drives and relief events' },
    { name: 'Transparency & Trust', href: '/transparency', desc: 'NGO registration, 80G status, and governance' },
    { name: 'Contact Us', href: '/contact', desc: 'Headquarters in Lucknow, email, and inquiry form' },
  ];

  const causePages = [
    { name: 'Environment Welfare (Paryavaran Sanrakshan)', href: '/paryavaran-sanrakshan', desc: 'Tree plantation, clean air, and native biodiversity drives' },
    { name: 'Animal Protection & Rescue', href: '/animal-welfare', desc: 'Stray dog feeding, road safety collars, and veterinary aid' },
    { name: 'Women Empowerment', href: '/women-empowerment', desc: 'Vocational sewing, digital financial literacy, and SHGs' },
    { name: 'Education Support', href: '/education', desc: 'School kits, remedial coaching, and anti-dropout drives' },
    { name: 'Clean Water & Sanitation', href: '/clean-water', desc: 'Covered food-grade water drums, testing, and hygiene education' },
    { name: 'Social Welfare in UP', href: '/social-welfare', desc: 'Winter warmth blanket distributions and food relief' },
  ];

  const actionPages = [
    { name: 'Donate Online (Section 80G Tax Exempt)', href: '/donate', desc: 'Online donations via Razorpay with instant receipt download' },
    { name: 'Volunteer With Us', href: '/volunteer', desc: 'Join our volunteer network and make on-ground impact' },
  ];

  const legalPages = [
    { name: 'Privacy Policy', href: '/privacy-policy', desc: 'Data protection, Google AdSense, and cookie notices' },
    { name: 'Terms & Conditions', href: '/terms-and-conditions', desc: 'Website terms of usage, intellectual property, and jurisdiction' },
    { name: 'Disclaimer', href: '/disclaimer', desc: 'Non-profit disclaimer, Section 80G tax limits, and medical guidance' },
    { name: 'Cookie Policy', href: '/cookie-policy', desc: 'Types of cookies used, AdSense DART cookies, and browser controls' },
    { name: 'Donation & Refund Policy', href: '/refund-policy', desc: 'Guidelines on duplicate debit reversals and receipt terms' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 pb-20">
      <PageHero
        title="Website Sitemap"
        subtitle="Complete directory of all pages, focus areas, research insights, and compliance policies on itlcfoundation.org."
        imageUrl="/pro/ab.png"
        imageHint="directory map structure"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
        
        {/* Section 1: Main Pages */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
            <Compass className="w-5 h-5 text-[#168039]" />
            <h2 className="text-xl font-bold text-slate-900 font-headline">Main Navigation Pages</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mainPages.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="p-4 rounded-xl border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all group block"
              >
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-[#168039] flex items-center justify-between">
                  <span>{item.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 2: Core Focus Areas */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
            <BookOpen className="w-5 h-5 text-[#0f5b9e]" />
            <h2 className="text-xl font-bold text-slate-900 font-headline">Core Focus Areas &amp; Campaigns</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {causePages.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="p-4 rounded-xl border border-slate-100 hover:border-blue-300 hover:bg-blue-50/40 transition-all group block"
              >
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-[#0f5b9e] flex items-center justify-between">
                  <span>{item.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 3: Engagement */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
            <Heart className="w-5 h-5 text-rose-600" />
            <h2 className="text-xl font-bold text-slate-900 font-headline">Take Action &amp; Support</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {actionPages.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="p-4 rounded-xl border border-slate-100 hover:border-rose-300 hover:bg-rose-50/40 transition-all group block"
              >
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-rose-600 flex items-center justify-between">
                  <span>{item.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 4: Blog Articles Directory */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-bold text-slate-900 font-headline">Blog / Insights Articles</h2>
            </div>
            <Link href="/blog" className="text-xs font-bold text-[#168039] hover:underline">
              View Blog Hub &rarr;
            </Link>
          </div>
          <div className="space-y-3">
            {BLOG_POSTS.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="p-3.5 rounded-xl border border-slate-100 hover:border-amber-300 hover:bg-amber-50/30 transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 mr-2">
                    {post.category}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-[#168039]">
                    {post.title}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 shrink-0 font-mono">
                  {post.readTime}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 5: Legal & Trust Policies */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
            <ShieldCheck className="w-5 h-5 text-slate-700" />
            <h2 className="text-xl font-bold text-slate-900 font-headline">Legal, Trust &amp; AdSense Policies</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {legalPages.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="p-4 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all group block"
              >
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-[#168039] flex items-center justify-between">
                  <span>{item.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
