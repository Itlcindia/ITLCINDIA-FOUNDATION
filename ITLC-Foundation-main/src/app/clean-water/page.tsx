'use client';
import { DonateButton } from '@/components/ui/donate-button';

import React from 'react';
import { PageHero } from '@/components/layout/page-hero';
import {
  Droplets,
  Sparkles,
  Heart,
  CheckCircle2,
  ShieldCheck,
  Activity,
  TestTubes,
  Users,
  Smile,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useDonationModal } from '@/context/donation-modal-context';

export default function CleanWaterPage() {
  const { openDonationModal } = useDonationModal();

  const initiatives = [
    {
      title: 'Food-Grade Safe Water Storage Kits',
      description: 'Distributing 25-liter durable, covered food-grade containers with push-taps to eliminate hand-immersion bacterial contamination.',
      badge: 'Safe Storage',
      icon: <Droplets className="w-5 h-5 text-[#0f5b9e]" />,
    },
    {
      title: 'Community Water Filtration Points',
      description: 'Installing low-cost, electricity-free ceramic and bio-sand water filters in community learning centers and public health shelters.',
      badge: 'Water Purification',
      icon: <ShieldCheck className="w-5 h-5 text-[#168039]" />,
    },
    {
      title: 'Groundwater Quality Testing Camps',
      description: 'Testing hand pumps for total dissolved solids (TDS), excess iron, and microbial presence, alerting local panchayats to contaminated sources.',
      badge: 'Scientific Testing',
      icon: <TestTubes className="w-5 h-5 text-purple-700" />,
    },
    {
      title: 'WASH (Water & Hygiene) School Drives',
      description: 'Teaching children the scientific 6-step handwashing drill and appointing peer Swachhta Monitors across primary schools in UP.',
      badge: 'Hygiene Education',
      icon: <Activity className="w-5 h-5 text-rose-600" />,
    },
  ];

  return (
    <div className="bg-[#dff0e6] min-h-screen text-gray-900 pb-20">
      <PageHero
        title="Clean Water & Sanitation"
        subtitle="Ensuring access to safe drinking water, hygienic storage, and preventive public health education across vulnerable communities in Uttar Pradesh."
        imageUrl="/causes/clean_water_hero.jpg"
        imageHint="clean drinking water glass"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-16">
        
        {/* Intro Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-[#168039] font-bold text-xs md:text-sm tracking-widest uppercase block font-headline mb-1.5">
                PURE WATER IS LIFE —
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-headline leading-tight tracking-tight">
                <span className="text-[#0f5b9e]">Protecting Families from</span> <span className="text-[#168039]">Preventable Waterborne Illness</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Waterborne diseases like diarrhea, typhoid, and cholera drain hard-earned savings and force children out of school across semi-urban and rural Uttar Pradesh. By providing clean, covered storage containers, field water quality testing, and school hygiene education, ITLC Foundation tackles water contamination right at the household level.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#168039]" />
                  <span>3,500+ Families Impacted</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#168039]" />
                  <span>70% Fewer Water Illnesses</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#168039]" />
                  <span>25+ Hand Pumps Tested</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative h-72 sm:h-84 w-full rounded-2xl overflow-hidden shadow-md">
              <Image
                src="/causes/clean_water_hygiene.jpg"
                alt="Clean water community campaign"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 450px"
              />
            </div>
          </div>
        </section>

        {/* 4 Core Water Pillars */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[#168039] font-bold text-xs md:text-sm tracking-widest uppercase block font-headline mb-1">
              SAFE INFRASTRUCTURE —
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-headline tracking-tight">
              <span className="text-[#0f5b9e]">Our Clean Water</span> <span className="text-[#168039]">Initiatives</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Targeting storage safety, filtration infrastructure, and behavioral hygiene for lasting health.
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
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0f5b9e] border border-blue-200">
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
              <p className="text-3xl sm:text-4xl font-black text-emerald-300 font-headline">3,500+</p>
              <p className="text-xs text-white/80">Covered Water Units</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-emerald-300 font-headline">25+</p>
              <p className="text-xs text-white/80">Water Sources Tested</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-emerald-300 font-headline">70%</p>
              <p className="text-xs text-white/80">Reduction in Illnesses</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-emerald-300 font-headline">12,000+</p>
              <p className="text-xs text-white/80">Children Educated</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white rounded-3xl p-8 sm:p-10 border border-blue-100 text-center space-y-6 shadow-sm">
          <div className="max-w-xl mx-auto space-y-2">
            <span className="text-[#168039] font-bold text-xs md:text-sm tracking-widest uppercase block font-headline mb-1">
              IMPACT A HOUSEHOLD —
            </span>
            <h3 className="text-2xl font-black font-headline tracking-tight">
              <span className="text-[#0f5b9e]">Sponsor Clean Water</span> <span className="text-[#168039]">for a Family</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              ₹500 provides a 25-liter food-grade safe water storage drum with tap and hygiene soap pack to protect a rural family in Uttar Pradesh from water contamination.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <DonateButton
              size="lg"
              amount={500}
              label="Sponsor Clean Water Unit (₹500 - 80G Exempt)"
            />
            <Link
              href="/volunteer"
              className="px-8 py-3.5 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-sm transition-all"
            >
              Join Hygiene Drives
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
