'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';
import { useDonationModal } from '@/context/donation-modal-context';

type PageHeroProps = {
  title: string | React.ReactNode;
  subtitle: string;
  imageUrl?: string;
  imageHint?: string;
  eyebrow?: string;
  children?: React.ReactNode;
};

export function PageHero({
  title,
  subtitle,
  imageUrl = '/ref/hero_boy_hd.jpg',
  imageHint = 'Indian school boy holding green plant sapling',
  eyebrow,
  children,
}: PageHeroProps) {
  const { openDonationModal } = useDonationModal();

  // Always prioritize the official home page hero image as requested
  const heroImage = '/ref/hero_boy_hd.jpg';

  return (
    <section className="relative w-full bg-[#dff0e6] bg-gradient-to-r from-[#daf0e3] via-[#e2f2e7] to-[#d8ece0] pt-10 pb-14 md:pt-14 md:pb-20 overflow-hidden min-h-[440px] lg:min-h-[500px] flex items-center border-b border-[#c8e2d3]">
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

      {/* Right Side: Unboxed Section-Covering HD Photograph (Exact Home Page Hero Image) */}
      <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[52%] xl:w-[48%] h-full pointer-events-none z-10">
        <div className="relative w-full h-full [mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.35)_10%,rgba(0,0,0,0.85)_22%,black_38%,black_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.35)_10%,rgba(0,0,0,0.85)_22%,black_38%,black_100%)]">
          <Image
            src={heroImage}
            alt={typeof title === 'string' ? title : 'ITLC Foundation Hero'}
            fill
            priority
            sizes="50vw"
            className="object-cover object-left-center"
            data-ai-hint={imageHint}
          />
        </div>
      </div>

      {/* Hero Content Layer */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col justify-center text-left py-4 max-w-2xl">
            {eyebrow && (
              <div className="flex items-center gap-2 mb-3.5">
                <span className="text-[#168039] font-bold text-xs md:text-sm tracking-widest uppercase font-headline">
                  {eyebrow}
                </span>
                <span className="hidden sm:inline-block w-8 h-[2px] bg-[#168039]/50 rounded-full" />
              </div>
            )}
            
            <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-extrabold tracking-tight leading-[1.14] mb-4 text-[#0f5b9e]">
              {title}
            </h1>
            
            <p className="text-gray-700 text-sm sm:text-base md:text-[17px] leading-relaxed mb-6 font-sans">
              {subtitle}
            </p>

            {children ? (
              <div>{children}</div>
            ) : (
              <div className="flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => openDonationModal()}
                  className="bg-[#168039] hover:bg-[#137233] text-white rounded-full px-7 py-3 text-sm sm:text-base font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                >
                  <Heart className="w-4 h-4 fill-white text-white" />
                  <span>Donate Now</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </button>
                <Link
                  href="/volunteer"
                  className="bg-white hover:bg-gray-50 text-gray-800 border border-[#c8e2d3] rounded-full px-6 py-3 text-sm sm:text-base font-semibold flex items-center gap-2 shadow-xs transition-all duration-200 cursor-pointer"
                >
                  <span>Join as Volunteer</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile/Tablet Fallback Display (Unboxed) */}
          <div className="lg:hidden relative w-full h-[260px] sm:h-[340px] overflow-hidden rounded-2xl [mask-image:linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.85)_12%,black_25%,black_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.85)_12%,black_25%,black_100%)]">
            <Image
              src={heroImage}
              alt={typeof title === 'string' ? title : 'ITLC Foundation Hero'}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
