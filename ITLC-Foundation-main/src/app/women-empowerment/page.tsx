'use client';
import { DonateButton } from '@/components/ui/donate-button';

import React from 'react';
import { PageHero } from '@/components/layout/page-hero';
import {
  Sparkles,
  Heart,
  Award,
  CheckCircle2,
  Users,
  Smartphone,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useDonationModal } from '@/context/donation-modal-context';

export default function WomenEmpowermentPage() {
  const { openDonationModal } = useDonationModal();

  const initiatives = [
    {
      title: 'Vocational Sewing & Embroidery Centers',
      description: 'Hands-on 6-month training courses on modern industrial sewing machines, garment drafting, and authentic Lucknowi Chikankari handicraft.',
      badge: 'Livelihood Training',
      icon: <Award className="w-5 h-5 text-[#168039]" />,
    },
    {
      title: 'Digital Financial Literacy & Banking',
      description: 'Educating women on operating zero-balance Jan Dhan bank accounts, executing secure UPI payments, and guarding against financial fraud.',
      badge: 'Economic Autonomy',
      icon: <Smartphone className="w-5 h-5 text-[#0f5b9e]" />,
    },
    {
      title: 'Community Self-Help Groups (SHGs)',
      description: 'Fostering collective micro-savings, peer lending, and cooperative bulk garment orders from local schools and retail cloth merchants.',
      badge: 'Collective Leadership',
      icon: <Users className="w-5 h-5 text-purple-700]" />,
    },
    {
      title: 'Menstrual Health & Dignity Camps',
      description: 'Distributing affordable biodegradable sanitary napkins and conducting doctor-led workshops breaking long-standing social stigmas in rural hamlets.',
      badge: 'Healthcare & Dignity',
      icon: <ShieldCheck className="w-5 h-5 text-rose-600" />,
    },
  ];

  return (
    <div className="bg-[#dff0e6] min-h-screen text-gray-900 pb-20">
      <PageHero
        eyebrow="WOMEN EMPOWERMENT INITIATIVE —"
        title={
          <>
            <span>Self-Reliance &amp; Dignity for </span>
            <span className="text-[#168039]">Women in Uttar Pradesh</span>
          </>
        }
        subtitle="Empowering women in rural and semi-urban Uttar Pradesh through vocational skills, financial independence, and healthcare dignity."
        imageUrl="/causes/women_empowerment_hero.jpg"
        imageHint="women tailoring and learning"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-16">
        
        {/* Intro Mission */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-[#168039] font-bold text-xs md:text-sm tracking-widest uppercase block font-headline mb-1.5">
                ECONOMIC INDEPENDENCE —
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-headline leading-tight tracking-tight">
                <span className="text-[#0f5b9e]">When a Woman Earns,</span> <span className="text-[#168039]">Her Entire Community Rises</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                In peri-urban Lucknow and surrounding rural areas of Uttar Pradesh, systemic obstacles have long restricted women from accessing dignified livelihood opportunities. At ITLC Foundation, we believe sustainable social transformation begins when women gain the skills to earn, save, and make decisions for their households.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#168039]" />
                  <span>450+ Women Trained</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#168039]" />
                  <span>12 Self-Help Groups</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#168039]" />
                  <span>100% Direct Impact</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative h-72 sm:h-84 w-full rounded-2xl overflow-hidden shadow-md">
              <Image
                src="/causes/women_shg_workshop.jpg"
                alt="Women empowerment skill workshop"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 450px"
              />
            </div>
          </div>
        </section>

        {/* 4 Core Pillars */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[#168039] font-bold text-xs md:text-sm tracking-widest uppercase block font-headline mb-1">
              HOLISTIC DEVELOPMENT —
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-headline tracking-tight">
              <span className="text-[#0f5b9e]">Key Empowerment</span> <span className="text-[#168039]">Programs &amp; Drives</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Our holistic model combines practical skill training with financial and social empowerment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {initiatives.map((item) => (
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
              <p className="text-3xl sm:text-4xl font-black text-emerald-300 font-headline">450+</p>
              <p className="text-xs text-white/80">Women Certified</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-emerald-300 font-headline">₹8,500</p>
              <p className="text-xs text-white/80">Avg. Monthly Income</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-emerald-300 font-headline">12</p>
              <p className="text-xs text-white/80">SHG Collectives</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-emerald-300 font-headline">5,000+</p>
              <p className="text-xs text-white/80">Sanitary Kits Given</p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-white rounded-3xl p-8 sm:p-10 border border-emerald-100 text-center space-y-6 shadow-sm">
          <div className="max-w-xl mx-auto space-y-2">
            <h3 className="text-2xl font-black text-slate-900 font-headline">
              Sponsor a Woman&apos;s Vocational Training
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              A contribution of ₹1,500 funds sewing tools, fabric materials, and 1 month of professional vocational instruction for an underprivileged mother in UP.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <DonateButton
              size="lg"
              amount={1500}
              label="Sponsor Training (₹1,500 - 80G Exempt)"
            />
            <Link
              href="/volunteer"
              className="px-8 py-3.5 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-sm transition-all"
            >
              Volunteer as a Mentor
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
