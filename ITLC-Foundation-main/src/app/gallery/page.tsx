'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardFooter } from '@/components/ui/card';
import { PageHero } from '@/components/layout/page-hero';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Filter, Eye, Layers } from 'lucide-react';
import { initialCmsData } from '@/lib/fallback-cms';

const galleryCategories = [
  { id: 'all', name: 'All Photos' },
  { id: 'plantation', name: 'Plantation' },
  { id: 'animal', name: 'Animal Care' },
  { id: 'women', name: 'Women Empowerment' },
  { id: 'education', name: 'Education Support' },
  { id: 'water', name: 'Clean Water & Sanitation' },
  { id: 'social', name: 'Social Welfare' },
  { id: 'events', name: 'Events & Drives' },
];

export default function GalleryPage() {
  const initialList = (
    Array.isArray(initialCmsData.gallery) ? initialCmsData.gallery : []
  ).map((img: any, index: number) => ({
    id: img.id || `gal-${index}`,
    image_url: img.image || img.image_url,
    description: img.title || 'ITLC Foundation Ground Activity',
    category: img.category || 'Events',
  }));

  const [galleryImages, setGalleryImages] = useState<any[]>(initialList);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<any | null>(null);

  useEffect(() => {
    fetch('/api/content/gallery')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setGalleryImages(data);
        }
      })
      .catch((err) => {
        console.warn('Using local gallery cache:', err);
      });
  }, []);

  const filtered =
    selectedCategory === 'all'
      ? galleryImages
      : galleryImages.filter((img) => {
          const catLower = (img.category || '').toLowerCase();
          if (selectedCategory === 'plantation') return catLower.includes('plant') || catLower.includes('tree') || catLower.includes('environment');
          if (selectedCategory === 'animal') return catLower.includes('animal');
          if (selectedCategory === 'women') return catLower.includes('women');
          if (selectedCategory === 'education') return catLower.includes('edu');
          if (selectedCategory === 'water') return catLower.includes('water');
          if (selectedCategory === 'social') return catLower.includes('social') || catLower.includes('welfare') || catLower.includes('community');
          if (selectedCategory === 'events') return catLower.includes('event');
          return catLower === selectedCategory;
        });

  return (
    <div className="bg-[#dff0e6] min-h-screen pb-24 text-gray-900">
      <PageHero
        eyebrow="GROUND VISUAL ARCHIVE —"
        title={
          <>
            <span>Moments of Impact Across </span>
            <span className="text-[#168039]">Uttar Pradesh</span>
          </>
        }
        subtitle="Hamari activities ki real photos aur video highlights jisme aap dekh sakte hain kaise aapka support ground level par real change la raha hai."
        imageUrl="/pro/ab.png"
        imageHint="community social impact gallery"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-8">
        
        {/* Category Filter Chips */}
        <div className="flex items-center justify-center">
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl">
            {galleryCategories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                    isActive
                      ? 'bg-[#168039] text-white shadow-sm ring-2 ring-emerald-300'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Counter Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 text-xs text-slate-500">
          <span className="flex items-center gap-1.5 font-semibold text-slate-700">
            <Layers className="w-4 h-4 text-[#168039]" />
            <span>Showing {filtered.length} Photographs</span>
          </span>
          <span className="text-[11px] text-slate-400">Click any image to enlarge</span>
        </div>

        {/* Photo Grid (Masonry-like layout) */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
          {filtered.map((image) => (
            <div
              key={image.id}
              onClick={() => setSelectedImage(image)}
              className="break-inside-avoid rounded-2xl overflow-hidden bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-300 group cursor-pointer relative"
            >
              <div className="relative w-full aspect-auto overflow-hidden bg-slate-100">
                <img
                  src={image.image_url}
                  alt={image.description}
                  loading="lazy"
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-104"
                />
                
                {/* Category Badge */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[10px] font-bold text-[#168039] px-2.5 py-0.5 rounded-full shadow-xs">
                  {image.category}
                </div>

                {/* Enlarge Overlay Hint */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="w-10 h-10 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                    <Eye className="w-5 h-5 text-[#168039]" />
                  </span>
                </div>
              </div>

              {/* Caption */}
              <div className="p-3.5 bg-white border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-800 leading-snug line-clamp-2 group-hover:text-[#168039] transition-colors">
                  {image.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox / Enlarged Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 cursor-zoom-out"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-white/20 cursor-default"
            >
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center shadow transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative w-full max-h-[70vh] flex items-center justify-center bg-black/95">
                <img
                  src={selectedImage.image_url}
                  alt={selectedImage.description}
                  className="max-h-[70vh] w-auto object-contain mx-auto"
                />
              </div>

              <div className="p-5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#168039] border border-emerald-200 inline-block mb-1">
                    {selectedImage.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                    {selectedImage.description}
                  </h3>
                </div>
                <a
                  href={selectedImage.image_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#168039] hover:underline shrink-0"
                >
                  View Full Image &rarr;
                </a>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
