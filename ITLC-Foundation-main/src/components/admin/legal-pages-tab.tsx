'use client';

import React, { useState } from 'react';
import {
  ShieldCheck, Check, Loader2, FileText, ExternalLink, RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface LegalPagesTabProps {
  cms: any;
  setCms: (val: any) => void;
  onSaveAll: () => Promise<void>;
}

export function LegalPagesTab({ cms, setCms, onSaveAll }: LegalPagesTabProps) {
  const { toast } = useToast();
  const [activeSubTab, setActiveSubTab] = useState<'privacy' | 'terms' | 'disclaimer' | 'cookies' | 'refund'>('privacy');
  const [isSaving, setIsSaving] = useState(false);

  const legal = cms?.legalPages || {
    privacyPolicy: { title: 'Privacy Policy', lastUpdated: 'September 2026', contactEmail: 'grievance@itlcfoundation.org', summary: 'Data protection, Google AdSense DART cookies disclosure, and Section 80G donor record confidentiality.' },
    termsConditions: { title: 'Terms & Conditions', lastUpdated: 'September 2026', jurisdiction: 'Lucknow, Uttar Pradesh', summary: 'Governing terms of portal usage, non-commercial reproduction, 80G receipt eligibility, and donor compliance.' },
    disclaimer: { title: 'Legal & Tax Disclaimer', lastUpdated: 'September 2026', summary: 'Tax advice disclaimer regarding Section 80G deductions and advisory scope for medical or animal rescue.' },
    cookiePolicy: { title: 'Cookie Policy', lastUpdated: 'September 2026', summary: 'Detailed explanation of session cookies, AdSense cookies, and browser controls.' },
    refundPolicy: { title: 'Donation & Refund Policy', refundWindowDays: 7, summary: 'Standard 7-day reversal policy for inadvertent duplicate transactions, ensuring payment gateway compliance.' }
  };

  const updateField = (pageKey: string, field: string, value: any) => {
    const updated = { ...cms };
    if (!updated.legalPages) updated.legalPages = { ...legal };
    if (!updated.legalPages[pageKey]) updated.legalPages[pageKey] = { ...legal[pageKey] };
    updated.legalPages[pageKey][field] = value;
    setCms(updated);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveAll();
      toast({
        title: 'Policies Saved',
        description: 'Legal & compliance information updated successfully.',
      });
    } catch (err: any) {
      toast({
        title: 'Save Failed',
        description: err.message || 'Could not save policies.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'privacy', label: 'Privacy Policy', route: '/privacy-policy', key: 'privacyPolicy' },
    { id: 'terms', label: 'Terms & Conditions', route: '/terms-and-conditions', key: 'termsConditions' },
    { id: 'disclaimer', label: 'Legal Disclaimer', route: '/disclaimer', key: 'disclaimer' },
    { id: 'cookies', label: 'Cookie Policy', route: '/cookie-policy', key: 'cookiePolicy' },
    { id: 'refund', label: 'Refund Policy', route: '/refund-policy', key: 'refundPolicy' },
  ];

  const currentTabInfo = tabs.find((t) => t.id === activeSubTab)!;
  const currentPageData = legal[currentTabInfo.key] || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[#168039] font-bold text-xs uppercase tracking-widest block font-headline mb-1">
            POLICY &amp; GOVERNANCE —
          </span>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#168039]" />
            <h3 className="text-lg font-bold font-headline tracking-tight">
              <span className="text-[#0f5b9e]">Legal, Trust</span>{' '}
              <span className="text-[#168039]">&amp; AdSense Policy Pages</span>
            </h3>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Manage metadata, compliance statements, and contact details for all 5 trust and legal policy pages.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href={currentTabInfo.route}
            target="_blank"
            className="px-3 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 text-xs font-semibold text-gray-700 inline-flex items-center gap-1.5 transition-colors"
          >
            <span>View Live Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#168039] hover:bg-[#137233] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            <span>Save Policies</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs Selection */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeSubTab === tab.id
                ? 'bg-[#168039] text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Editor Card */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-2xs space-y-4 text-xs">
        <div>
          <label className="block font-bold text-gray-700 mb-1">Page Title</label>
          <input
            type="text"
            value={currentPageData.title || ''}
            onChange={(e) => updateField(currentTabInfo.key, 'title', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-bold text-sm outline-none focus:border-[#168039]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Last Updated Notice</label>
            <input
              type="text"
              value={currentPageData.lastUpdated || 'September 2026'}
              onChange={(e) => updateField(currentTabInfo.key, 'lastUpdated', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:border-[#168039]"
            />
          </div>

          {currentTabInfo.id === 'privacy' && (
            <div>
              <label className="block font-bold text-gray-700 mb-1">Grievance / Privacy Email</label>
              <input
                type="email"
                value={currentPageData.contactEmail || 'grievance@itlcfoundation.org'}
                onChange={(e) => updateField('privacyPolicy', 'contactEmail', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:border-[#168039]"
              />
            </div>
          )}

          {currentTabInfo.id === 'terms' && (
            <div>
              <label className="block font-bold text-gray-700 mb-1">Legal Jurisdiction</label>
              <input
                type="text"
                value={currentPageData.jurisdiction || 'Lucknow, Uttar Pradesh'}
                onChange={(e) => updateField('termsConditions', 'jurisdiction', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:border-[#168039]"
              />
            </div>
          )}

          {currentTabInfo.id === 'refund' && (
            <div>
              <label className="block font-bold text-gray-700 mb-1">Refund Claim Window (Days)</label>
              <input
                type="number"
                value={currentPageData.refundWindowDays || 7}
                onChange={(e) => updateField('refundPolicy', 'refundWindowDays', parseInt(e.target.value) || 7)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:border-[#168039]"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block font-bold text-gray-700 mb-1">Compliance Summary / Notice</label>
          <textarea
            rows={4}
            value={currentPageData.summary || ''}
            onChange={(e) => updateField(currentTabInfo.key, 'summary', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 outline-none focus:border-[#168039] leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
}
