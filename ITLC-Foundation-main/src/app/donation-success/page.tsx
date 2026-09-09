'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Heart, ArrowLeft, Download, ShieldCheck, Sparkles } from 'lucide-react';

function DonationSuccessContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('payment_id') || searchParams.get('razorpay_payment_id') || '';
  const receiptNo = searchParams.get('receipt_no') || searchParams.get('receiptNo') || `ITLC-80G-${new Date().getFullYear()}`;
  const amount = searchParams.get('amount') || '';
  const donorName = searchParams.get('donor_name') || searchParams.get('donorName') || 'Supporter';

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#eef8f2] via-white to-[#eef8f2]/40">
      <div className="max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-100 text-center space-y-6 animate-in fade-in duration-300">
        
        {/* Animated Celebration Icons */}
        <div className="space-y-2">
          <div className="text-4xl select-none animate-bounce">
            🙏 ❤️ 🎉
          </div>
          <div className="inline-flex items-center gap-1.5 bg-emerald-100/80 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-[#168039]" />
            Payment Successful
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#083a27] font-headline">
            Thanks for your support!
          </h1>
          <p className="text-sm font-semibold text-emerald-700">
            Aapka chhota sa sahyog kisi ki zindagi badal sakta hai 🌿
          </p>
        </div>

        {/* Hero Illustration / Photo */}
        <div className="relative w-full h-44 rounded-2xl overflow-hidden shadow-inner border border-emerald-100 bg-emerald-50">
          <Image
            src="/ref/hero_boy_hd.jpg"
            alt="Child with plant - ITLC Foundation"
            fill
            sizes="500px"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
            <span className="font-cursive text-lg font-bold drop-shadow">
              Together for Humanity
            </span>
            <span className="bg-emerald-600/90 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Section 80G Certified
            </span>
          </div>
        </div>

        {/* Message */}
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
          Dear <strong className="text-gray-900">{donorName}</strong>, your generous contribution has been successfully received. A 50% Tax Exemption receipt under Section 80G has been registered in our records.
        </p>

        {/* Payment Summary Box */}
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 text-left space-y-2 text-xs">
          <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
            <span className="font-semibold text-emerald-900">Receipt No:</span>
            <span className="font-mono font-bold text-[#083a27] bg-white px-2 py-0.5 rounded border border-emerald-200">
              {receiptNo}
            </span>
          </div>
          {amount && (
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Amount Donated:</span>
              <span className="font-bold text-[#168039] text-sm">₹{Number(amount).toLocaleString('en-IN')}</span>
            </div>
          )}
          {paymentId && (
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Transaction ID:</span>
              <span className="font-mono text-gray-700">{paymentId}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Tax Exemption:</span>
            <span className="font-semibold text-emerald-800">50% under Section 80G</span>
          </div>
        </div>

        {/* 80G Exemption Badge */}
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl p-3 text-[11px] text-left">
          <ShieldCheck className="w-5 h-5 text-[#168039] shrink-0" />
          <span>
            ITLC Foundation is a registered public charitable trust in Uttar Pradesh. All contributions are 50% tax-exempt under Section 80G of the Income Tax Act.
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-[#168039] hover:bg-[#137233] text-white py-3 px-5 rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
          <Link
            href="/#about"
            className="inline-flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 py-3 px-5 rounded-2xl font-semibold text-sm transition-all"
          >
            <Heart className="w-4 h-4 text-emerald-600" />
            <span>Our Impact</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function DonationSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
      </div>
    }>
      <DonationSuccessContent />
    </Suspense>
  );
}
