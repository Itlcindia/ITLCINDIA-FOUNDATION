'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, Check, Loader2, Globe, Shield, RefreshCw, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ImageUploadField } from '@/components/admin/image-upload-field';

interface WebsiteInfoTabProps {
  cms: any;
  setCms: (cms: any) => void;
  onSaveAll: (updatedState?: any) => Promise<void>;
}

export function WebsiteInfoTab({ cms, setCms, onSaveAll }: WebsiteInfoTabProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // Fallback defaults
  const site = cms?.site || {
    name: 'ITLC Foundation',
    tagline: 'Empowering Communities Through Learning & Care.',
    logo: '/ref/logo.png',
    favicon: '/favicon.ico',
    phone: '+91 94150 00000',
    email: 'info@itlcfoundation.com',
    address: 'G1/0049, Olive Wood Villa, Golf City, Lucknow, Uttar Pradesh – 226030',
  };

  const handleFieldChange = (field: string, value: any) => {
    const updated = { ...cms };
    if (!updated.site) updated.site = { ...site };
    if (!updated.contact) updated.contact = { ...(cms?.contact || {}) };
    if (!updated.footer) updated.footer = { ...(cms?.footer || {}) };

    updated.site[field] = value;

    if (field === 'email') {
      updated.contact.email = value;
      updated.footer.email = value;
    } else if (field === 'phone') {
      updated.contact.phone = value;
    } else if (field === 'address') {
      updated.contact.address = value;
      updated.footer.address = value;
    } else if (field === 'tagline') {
      updated.footer.subTagline = value;
    }

    setCms(updated);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      const updated = { ...cms };
      if (!updated.site) updated.site = { ...site };
      if (!updated.contact) updated.contact = { ...(cms?.contact || {}) };
      if (!updated.footer) updated.footer = { ...(cms?.footer || {}) };

      // Ensure full sync on save
      const currentEmail = updated.site.email || site.email;
      const currentPhone = updated.site.phone || site.phone;
      const currentAddress = updated.site.address || site.address;

      updated.site.email = currentEmail;
      updated.contact.email = currentEmail;
      updated.footer.email = currentEmail;

      updated.site.phone = currentPhone;
      updated.contact.phone = currentPhone;

      updated.site.address = currentAddress;
      updated.contact.address = currentAddress;
      updated.footer.address = currentAddress;

      setCms(updated);
      await onSaveAll(updated);
      toast({
        title: 'Branding Saved',
        description: 'Website Logo, Favicon, and Organization Details updated successfully!',
      });
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: err.message || 'Could not save branding details.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[#168039] font-bold text-xs uppercase tracking-widest block font-headline mb-1">
            BRAND ASSETS &amp; IDENTITY —
          </span>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#168039]" />
            <h3 className="text-lg font-bold font-headline tracking-tight">
              <span className="text-[#0f5b9e]">Website Info &amp; Branding</span>{' '}
              <span className="text-[#168039]">(Logo &amp; Favicon)</span>
            </h3>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Update your primary foundation logo, browser tab favicon icon, website tagline, and official office details.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#168039] hover:bg-[#137233] text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2 self-start sm:self-auto"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          <span>Save Branding Details</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* ========================================================================= */}
        {/* 1. LOGO & FAVICON VISUAL MANAGEMENT SECTION                               */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Main Logo Card */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs space-y-4 flex flex-col justify-between">
            <div>
              <div className="border-b border-gray-100 pb-3 mb-4">
                <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#168039]" /> Primary Website Logo
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Displayed in Header Navigation Bar, Footer, and Official 80G Receipts.
                </p>
              </div>

              <ImageUploadField
                label="Upload Logo (PNG, SVG, or JPG)"
                hint="Recommended: Transparent background PNG (square or circular)"
                value={site.logo || '/ref/logo.png'}
                onChange={(url) => handleFieldChange('logo', url)}
                aspect="square"
              />
            </div>

            {/* Live Header Simulation */}
            <div className="pt-4 border-t border-gray-100">
              <span className="text-[11px] font-bold text-gray-400 block mb-2 uppercase tracking-wider">
                Live Header Bar Preview
              </span>
              <div className="bg-white border border-slate-200 p-3 rounded-2xl flex items-center justify-between shadow-xs">
                <div className="relative h-12 w-auto flex items-center shrink-0">
                  <Image
                    src={site.logo || '/ref/logo.png'}
                    alt="Logo Preview"
                    width={140}
                    height={48}
                    className="h-11 w-auto object-contain"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#0f5b9e]">
                  <span className="hidden sm:inline">Home</span>
                  <span className="hidden sm:inline">About</span>
                  <span className="bg-[#168039] text-white text-[10px] px-2.5 py-1 rounded-full">Donate</span>
                </div>
              </div>
            </div>
          </div>

          {/* Favicon Card */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs space-y-4 flex flex-col justify-between">
            <div>
              <div className="border-b border-gray-100 pb-3 mb-4">
                <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#168039]" /> Browser Tab Favicon Icon
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Appears in browser tabs, bookmarks, and mobile shortcut icons.
                </p>
              </div>

              <ImageUploadField
                label="Upload Favicon (.ico or .png)"
                hint="Recommended: 32x32px or 64x64px square icon"
                value={site.favicon || '/favicon.ico'}
                onChange={(url) => handleFieldChange('favicon', url)}
                aspect="square"
              />
            </div>

            {/* Live Browser Tab Simulation */}
            <div className="pt-4 border-t border-gray-100">
              <span className="text-[11px] font-bold text-gray-400 block mb-2 uppercase tracking-wider">
                Live Browser Tab Mockup
              </span>
              <div className="bg-gray-200 p-2.5 rounded-2xl">
                <div className="bg-white rounded-xl px-3 py-2 flex items-center justify-between shadow-xs max-w-xs border border-gray-300">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="relative w-4 h-4 shrink-0 rounded overflow-hidden">
                      <Image
                        src={site.favicon || site.logo || '/favicon.ico'}
                        alt="Favicon"
                        fill
                        sizes="16px"
                        className="object-contain"
                      />
                    </div>
                    <span className="text-xs font-semibold text-gray-800 truncate">
                      {site.name || 'ITLC Foundation'} - Official Portal
                    </span>
                  </div>
                  <X className="w-3.5 h-3.5 text-gray-400 shrink-0 ml-2" />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 2. GENERAL ORGANIZATION DETAILS                                           */}
        {/* ========================================================================= */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-2xs space-y-5">
          <div className="border-b border-gray-100 pb-3">
            <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#168039]" /> Organization Information &amp; Contact
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              General details used across the website metadata, footers, and correspondence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Organization Legal Name *</label>
              <input
                type="text"
                required
                value={site.name || ''}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                placeholder="ITLC Foundation"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-bold text-sm outline-none focus:border-[#168039]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Official Helpline / Phone Number</label>
              <input
                type="text"
                value={site.phone || ''}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                placeholder="+91 94150 00000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 outline-none focus:border-[#168039]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-gray-700 mb-1">Website Tagline / Mission Motto</label>
              <input
                type="text"
                value={site.tagline || ''}
                onChange={(e) => handleFieldChange('tagline', e.target.value)}
                placeholder="Empowering Communities Through Learning & Care."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 outline-none focus:border-[#168039]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Official Email Address</label>
              <input
                type="email"
                value={site.email || ''}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                placeholder="info@itlcfoundation.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 outline-none focus:border-[#168039]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Registered Headquarters Address</label>
              <input
                type="text"
                value={site.address || ''}
                onChange={(e) => handleFieldChange('address', e.target.value)}
                placeholder="G1/0049, Olive Wood Villa, Golf City, Lucknow..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 outline-none focus:border-[#168039]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-[#168039] hover:bg-[#137233] text-white px-7 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              <span>Save All Branding &amp; Info Changes</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
