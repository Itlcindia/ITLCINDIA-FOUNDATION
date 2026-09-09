'use client';

import React from 'react';
import { PageHero } from '@/components/layout/page-hero';
import {
  BookOpen,
  Sparkles,
  Heart,
  Award,
  CheckCircle2,
  GraduationCap,
  Backpack,
  Laptop,
  Smile,
  ArrowRight,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useDonationModal } from '@/context/donation-modal-context';

export default function EducationSupportPage() {
  const { openDonationModal } = useDonationModal();

  const programs = [
    {
      title: 'Shiksha Umeed School Kits',
      description: 'Equipping underprivileged children with high-quality school bags, notebooks, stationery sets, geometry boxes, and water bottles.',
      badge: 'Material Support',
      icon: <Backpack className="w-5 h-5 text-[#168039]" />,
    },
    {
      title: 'After-School Remedial Gyan Kendras',
      description: 'Daily 2-hour coaching sessions in slum clusters focusing on foundational Hindi, English reading, and mathematics for first-generation learners.',
      badge: 'Academic Coaching',
      icon: <GraduationCap className="w-5 h-5 text-[#0f5b9e]" />,
    },
    {
      title: 'Digital Tablets & Audio-Visual Learning',
      description: 'Introducing interactive learning apps and scientific video lessons that ignite curiosity and prepare children for modern digital literacy.',
      badge: 'Modern Technology',
      icon: <Laptop className="w-5 h-5 text-purple-700" />,
    },
    {
      title: 'Parent Counseling & Dropout Prevention',
      description: 'Regular community outreach convincing daily-wage parents to keep both boys and girls in regular formal schooling rather than child labor.',
      badge: 'Community Advocacy',
      icon: <Smile className="w-5 h-5 text-amber-600" />,
    },
  ];

  return (
    <div className="bg-[#dff0e6] min-h-screen text-gray-900 pb-20">
      <PageHero
        eyebrow="FOUNDATIONAL EDUCATION FOR ALL —"
        title={
          <>
            <span>Empowering Underprivileged Minds </span>
            <span className="text-[#168039]">Through Learning</span>
          </>
        }
        subtitle="Unlocking the potential of underprivileged and slum children in Lucknow and Uttar Pradesh through quality learning, school supplies, and mentorship."
        imageUrl="/ref/hero_boy_hd.jpg"
        imageHint="happy school boy studying"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-16">
        
        {/* Intro */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-[#168039] font-bold text-xs md:text-sm tracking-widest uppercase block font-headline mb-1.5">
                EDUCATION IS A RIGHT —
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-headline leading-tight tracking-tight">
                <span className="text-[#0f5b9e]">Breaking Poverty&apos;s Cycle</span> <span className="text-[#168039]">Through Quality Learning</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                In the informal settlements and daily-wage colonies across Lucknow, thousands of promising young children drop out simply because their families cannot afford basic notebooks, uniforms, or foundational after-school tutoring. ITLC Foundation bridges this gap by providing complete educational kits, loving volunteer mentors, and safe learning centers.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#168039]" />
                  <span>2,800+ Children Supported</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#168039]" />
                  <span>15 Remedial Centers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#168039]" />
                  <span>45% Dropout Reduction</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative h-72 sm:h-84 w-full rounded-2xl overflow-hidden shadow-md">
              <Image
                src="/ref/hero_boy_hd.jpg"
                alt="Underprivileged child with school bag"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 450px"
              />
            </div>
          </div>
        </section>

        {/* 4 Core Educational Programs */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[#168039] font-bold text-xs md:text-sm tracking-widest uppercase block font-headline mb-1">
              ACADEMIC INTERVENTIONS —
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-headline tracking-tight">
              <span className="text-[#0f5b9e]">Our Educational</span> <span className="text-[#168039]">Support Programs</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Targeting both material hurdles and foundational academic gaps to keep children enthusiastically in school.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programs.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    {item.icon}
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#168039] border border-emerald-200">
                    {item.badge}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-slate-900 font-headline">
                  {item.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Impact Numbers */}
        <section className="bg-gradient-to-r from-[#083a27] via-[#0d4f34] to-[#083a27] text-white rounded-3xl p-8 sm:p-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-emerald-300 font-headline">2,800+</p>
              <p className="text-xs text-white/80">Kits Distributed</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-emerald-300 font-headline">15</p>
              <p className="text-xs text-white/80">Active Gyan Kendras</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-emerald-300 font-headline">100%</p>
              <p className="text-xs text-white/80">Primary Pass Rate</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-emerald-300 font-headline">65+</p>
              <p className="text-xs text-white/80">Student Volunteers</p>
            </div>
          </div>
        </section>

        {/* Sponsorship CTA */}
        <section className="bg-white rounded-3xl p-8 sm:p-10 border border-emerald-100 text-center space-y-6 shadow-sm">
          <div className="max-w-xl mx-auto space-y-2">
            <span className="text-[#168039] font-bold text-xs md:text-sm tracking-widest uppercase block font-headline mb-1">
              EDUCATIONAL ADOPTION —
            </span>
            <h3 className="text-2xl font-black font-headline tracking-tight">
              <span className="text-[#0f5b9e]">Sponsor a Child&apos;s</span> <span className="text-[#168039]">Complete School Kit</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              ₹1,000 provides a backpack, full academic stationery set, notebook pack, geometry kit, and water bottle to keep a slum child in school for a full academic year.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => openDonationModal(1000)}
              className="px-8 py-3.5 rounded-full bg-[#168039] hover:bg-[#137233] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Sponsor a Student Kit (₹1,000 - 80G Exempt)</span>
            </button>
            <Link
              href="/volunteer"
              className="px-8 py-3.5 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-sm transition-all"
            >
              Volunteer as a Teacher
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
