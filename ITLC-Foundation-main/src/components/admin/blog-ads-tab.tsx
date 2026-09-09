'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Sparkles, Check, Loader2, Image as ImageIcon, Code, ExternalLink,
  Power, ShieldCheck, HelpCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MediaGalleryModal } from '@/components/admin/media-gallery-modal';

interface BlogAdsTabProps {
  cms: any;
  setCms: (val: any) => void;
  onSaveAll: () => Promise<void>;
}

export function BlogAdsTab({ cms, setCms, onSaveAll }: BlogAdsTabProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [activeMediaPickerSlot, setActiveMediaPickerSlot] = useState<string | null>(null);

  const ads = cms?.blogAds || {
    slot1: { id: 'slot-1', name: 'Top Header Banner', position: 'Above Article Content', enabled: true, type: 'code', code: '', bannerImage: '/pro/ab.png', bannerLink: '/donate' },
    slot2: { id: 'slot-2', name: 'In-Article Ad 1 (Mid-Top)', position: 'After Key Highlights', enabled: true, type: 'code', code: '', bannerImage: '/pro/1.png', bannerLink: '/volunteer' },
    slot3: { id: 'slot-3', name: 'In-Article Ad 2 (Mid-Deep)', position: 'Between Strategic Pillars', enabled: true, type: 'code', code: '', bannerImage: '/pro/2.png', bannerLink: '/projects' },
    slot4: { id: 'slot-4', name: 'Bottom Pre-Footer Banner', position: 'Before 80G Tax Donation Box', enabled: true, type: 'code', code: '', bannerImage: '/pro/3.png', bannerLink: '/donate' },
  };

  const updateSlot = (slotKey: string, field: string, value: any) => {
    const updated = { ...cms };
    if (!updated.blogAds) updated.blogAds = { ...ads };
    if (!updated.blogAds[slotKey]) updated.blogAds[slotKey] = { ...ads[slotKey] };
    updated.blogAds[slotKey][field] = value;
    setCms(updated);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveAll();
      toast({
        title: 'Ads Settings Saved',
        description: 'All 4 blog ad placements updated successfully.',
      });
    } catch (err: any) {
      toast({
        title: 'Save Failed',
        description: err.message || 'Could not save ad configurations.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const slotsList = [
    { key: 'slot1', label: '1. Top Header Banner (Ad Slot 1)', desc: 'Appears directly above article body, high visibility' },
    { key: 'slot2', label: '2. In-Article Ad 1 (Ad Slot 2)', desc: 'Native ad appearing right below the Key Highlights box' },
    { key: 'slot3', label: '3. In-Article Ad 2 (Ad Slot 3)', desc: 'Embedded midway through the article content' },
    { key: 'slot4', label: '4. Bottom Pre-Footer Banner (Ad Slot 4)', desc: 'Appears before the Section 80G tax donation box' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[#168039] font-bold text-xs uppercase tracking-widest block font-headline mb-1">
            MONETIZATION SYSTEM —
          </span>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#168039]" />
            <h3 className="text-lg font-bold font-headline tracking-tight">
              <span className="text-[#0f5b9e]">Blog Ads &amp; Monetization</span>{' '}
              <span className="text-[#168039]">Manager</span>
            </h3>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Turn individual ads ON/OFF across all articles. Paste Google AdSense script tags or display custom promotion banners.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#168039] hover:bg-[#137233] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          <span>Save Ad Settings</span>
        </button>
      </div>

      {/* 4 Ad Slots Configuration Cards */}
      <div className="space-y-5">
        {slotsList.map((item) => {
          const slot = ads[item.key] || {};
          const isEnabled = slot.enabled ?? true;
          const adType = slot.type || 'code';

          return (
            <div
              key={item.key}
              className={`bg-white rounded-3xl border transition-all p-6 sm:p-7 space-y-4 shadow-2xs ${
                isEnabled ? 'border-gray-200' : 'border-gray-200/60 opacity-70 bg-gray-50/50'
              }`}
            >
              {/* Slot Top Bar: Title & Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${isEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
                    <h4 className="font-bold text-gray-900 text-sm">{item.label}</h4>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>

                {/* On / Off Toggle Button */}
                <button
                  type="button"
                  onClick={() => updateSlot(item.key, 'enabled', !isEnabled)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                    isEnabled
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{isEnabled ? 'STATUS: ACTIVE (ON)' : 'STATUS: DISABLED (OFF)'}</span>
                </button>
              </div>

              {/* Slot Settings if Enabled */}
              {isEnabled && (
                <div className="space-y-4 text-xs pt-1">
                  {/* Ad Format Selector */}
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="font-bold text-gray-700">Ad Format:</span>
                    <label className="flex items-center gap-1.5 cursor-pointer font-medium text-gray-800">
                      <input
                        type="radio"
                        name={`type-${item.key}`}
                        checked={adType === 'code'}
                        onChange={() => updateSlot(item.key, 'type', 'code')}
                        className="text-[#168039] focus:ring-[#168039]"
                      />
                      <span>Google AdSense Script / HTML Code</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer font-medium text-gray-800">
                      <input
                        type="radio"
                        name={`type-${item.key}`}
                        checked={adType === 'banner'}
                        onChange={() => updateSlot(item.key, 'type', 'banner')}
                        className="text-[#168039] focus:ring-[#168039]"
                      />
                      <span>Custom Image Banner &amp; Link</span>
                    </label>
                  </div>

                  {adType === 'code' ? (
                    /* Google AdSense Code Editor */
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-gray-700 flex items-center gap-1.5">
                          <Code className="w-3.5 h-3.5 text-blue-600" />
                          <span>AdSense Script / Ad Unit HTML Snippet:</span>
                        </label>
                        <span className="text-[10px] text-gray-400 font-mono">Accepts &lt;ins&gt; or &lt;script&gt; tags</span>
                      </div>
                      <textarea
                        rows={4}
                        value={slot.code || ''}
                        onChange={(e) => updateSlot(item.key, 'code', e.target.value)}
                        placeholder={'<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-..." data-ad-slot="..." data-ad-format="auto"></ins>'}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-mono text-[11px] bg-gray-50 outline-none focus:border-[#168039] leading-relaxed"
                      />
                    </div>
                  ) : (
                    /* Custom Banner Image & Link */
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                      <div className="space-y-2">
                        <label className="font-bold text-gray-700 block">Banner Image:</label>
                        <div className="flex items-center gap-3">
                          <div className="relative w-24 h-14 rounded-xl overflow-hidden border border-gray-300 bg-white shrink-0">
                            <Image
                              src={slot.bannerImage || '/pro/ab.png'}
                              alt="Banner preview"
                              fill
                              sizes="96px"
                              className="object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => setActiveMediaPickerSlot(item.key)}
                            className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-xs font-bold text-gray-700 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>Select Image</span>
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="font-bold text-gray-700 block">Target Link / URL:</label>
                        <input
                          type="text"
                          value={slot.bannerLink || '/donate'}
                          onChange={(e) => updateSlot(item.key, 'bannerLink', e.target.value)}
                          placeholder="/donate or https://..."
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:border-[#168039] bg-white text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Media Picker Modal */}
      {activeMediaPickerSlot && (
        <MediaGalleryModal
          isOpen={true}
          onClose={() => setActiveMediaPickerSlot(null)}
          onSelect={(url) => {
            updateSlot(activeMediaPickerSlot, 'bannerImage', url);
            setActiveMediaPickerSlot(null);
          }}
        />
      )}
    </div>
  );
}
