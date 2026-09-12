'use client';

import Link from 'next/link';
import { Home, Compass, AlertCircle } from 'lucide-react';
import { DonateButton } from '@/components/ui/donate-button';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-[#f7faf8]">
      <div className="max-w-xl w-full text-center space-y-6 bg-white p-8 sm:p-12 rounded-3xl border border-gray-200 shadow-sm">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 text-[#168039] mb-2">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#168039] bg-emerald-50 px-3 py-1 rounded-full">
            404 Error
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
            The page you are looking for may have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#168039] hover:bg-[#137233] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Go to Homepage</span>
          </Link>

          <DonateButton size="sm" label="Donate Now" />

          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Projects</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
