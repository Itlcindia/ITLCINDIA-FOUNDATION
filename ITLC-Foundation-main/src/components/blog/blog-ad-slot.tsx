'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

export interface AdSlotConfig {
  id?: string;
  name?: string;
  position?: string;
  enabled: boolean;
  type: 'code' | 'banner';
  code?: string;
  bannerImage?: string;
  bannerLink?: string;
}

interface BlogAdSlotProps {
  slotKey: string;
  config?: AdSlotConfig;
  className?: string;
}

export function BlogAdSlot({ slotKey, config, className = '' }: BlogAdSlotProps) {
  if (!config || !config.enabled) {
    return null;
  }

  return (
    <div className={`my-8 w-full ${className}`}>
      <div className="relative rounded-2xl border border-slate-200/80 bg-slate-50/80 overflow-hidden shadow-2xs">
        {/* Ad Badge */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-100/90 border-b border-slate-200/60 text-[10px] uppercase font-bold tracking-wider text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Advertisement &bull; {config.name || 'Sponsored'}
          </span>
          <span className="text-[9px] text-slate-400 font-mono">Ad Slot</span>
        </div>

        {/* Ad Content */}
        <div className="p-3 sm:p-4 flex items-center justify-center min-h-[90px]">
          {config.type === 'banner' && config.bannerImage ? (
            <Link
              href={config.bannerLink || '/donate'}
              target={config.bannerLink?.startsWith('http') ? '_blank' : '_self'}
              rel="noopener noreferrer"
              className="relative w-full block group overflow-hidden rounded-xl"
            >
              <div className="relative w-full h-44 sm:h-56">
                <Image
                  src={config.bannerImage}
                  alt={config.name || 'Sponsored Promotion'}
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-cover rounded-xl group-hover:scale-101 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4 rounded-xl">
                <span className="text-white text-xs font-bold flex items-center gap-1 group-hover:underline">
                  Support this campaign <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ) : (
            /* Code / AdSense snippet */
            <div className="w-full text-center">
              {config.code ? (
                <div
                  className="w-full overflow-x-auto text-center"
                  dangerouslySetInnerHTML={{ __html: config.code }}
                />
              ) : (
                <div className="py-6 px-4 text-center text-slate-400 text-xs">
                  <p className="font-semibold text-slate-600">Google AdSense Responsive Unit</p>
                  <p className="text-[11px] mt-1">Slot ID: {config.id || slotKey} &bull; Active &amp; Ready</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
