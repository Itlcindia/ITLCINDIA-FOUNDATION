import React from 'react';
import { PageHero } from '@/components/layout/page-hero';
import { RefreshCw, FileText, AlertCircle, CheckCircle2, Clock, MapPin, Mail, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Donation & Refund Policy | ITLC Foundation Lucknow',
  description: 'Official Donation, Cancellation & Refund Policy of ITLC Foundation. Transparent guidelines on 80G tax exemptions, duplicate debit reversals, and donor support.',
};

export default function RefundPolicyPage() {
  const lastUpdated = 'September 8, 2026';

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen">
      <PageHero
        title="Donation & Refund Policy"
        subtitle="Transparent policies regarding voluntary contributions, 80G tax exemption certificates, and duplicate payment resolution."
        imageUrl="/pro/ab.png"
        imageHint="charity donation receipt transparency"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-10">
          
          <div className="border-b border-slate-100 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
            <span><strong>Effective Date:</strong> {lastUpdated}</span>
            <span><strong>Registered Office:</strong> Lucknow, Uttar Pradesh</span>
          </div>

          {/* 1. Principle of Charitable Giving */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5 font-headline">
              <FileText className="w-6 h-6 text-[#168039]" />
              <span>1. Nature of Charitable Contributions</span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-slate-600">
              ITLC Foundation is a registered non-profit organization operating in Uttar Pradesh. Voluntary donations received through our website (<Link href="/" className="text-[#168039] font-medium hover:underline">itlcfoundation.org</Link>) are immediately committed to on-ground humanitarian projects—such as daily stray animal feeding, distribution of school supplies to slum children, sapling procurement, and emergency winter relief.
            </p>
          </section>

          {/* 2. Refund Eligibility */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5 font-headline">
              <RefreshCw className="w-6 h-6 text-[#168039]" />
              <span>2. Technical Reversal &amp; Refund Window</span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-slate-600">
              Because donated funds are channeled into field work without delay, general voluntary donations are considered non-refundable. However, we acknowledge that technical anomalies may occur. A refund will be promptly entertained under the following specific circumstances:
            </p>
            <ul className="space-y-2 text-sm sm:text-base text-slate-600 list-disc list-inside pl-2">
              <li><strong>Duplicate Transaction:</strong> Due to a network lag or payment gateway timeout, your bank account was debited more than once for a single donation.</li>
              <li><strong>Erroneous Amount:</strong> An accidental extra digit was keyed into the amount field (e.g. ₹50,000 instead of ₹5,000) during checkout.</li>
              <li><strong>Unauthorized Transaction:</strong> Fraudulent or unauthorized usage of your card or UPI account (subject to preliminary banking review).</li>
            </ul>
          </section>

          {/* 3. Refund Claim Timeline */}
          <section className="space-y-4 bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5 font-headline">
              <Clock className="w-6 h-6 text-[#168039]" />
              <span>3. How to Request a Refund (7-Day Window)</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Donors must submit a written refund request within <strong>7 calendar days</strong> from the date of the transaction.
            </p>
            <div className="space-y-2 text-xs sm:text-sm text-slate-700">
              <p className="font-bold text-slate-900">Please email the following to <a href="mailto:donation@itlcfoundation.com" className="text-[#168039] underline">donation@itlcfoundation.com</a>:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Full Name of the Donor</li>
                <li>Registered Email Address &amp; Mobile Number</li>
                <li>Transaction ID / Razorpay Payment ID (e.g. <code>pay_...</code>)</li>
                <li>Date and exact amount debited</li>
                <li>Screenshot or official bank statement snippet showing the debit</li>
                <li>Clear reason for requesting the refund</li>
              </ul>
            </div>
          </section>

          {/* 4. Processing Time */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5 font-headline">
              <CheckCircle2 className="w-6 h-6 text-[#168039]" />
              <span>4. Refund Processing &amp; Settlement</span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-slate-600">
              Upon receiving your complete details, our finance desk will review the gateway logs with Razorpay within 2 business days. If verified, the refund will be credited directly back to the original funding source (credit card, debit card, or UPI VPA) within <strong>7 to 10 working days</strong>, subject to your bank&apos;s inter-bank settlement turnaround.
            </p>
            <p className="text-xs sm:text-sm text-slate-500 italic">
              <strong>Important Note:</strong> If an official Section 80G tax exemption receipt was issued for the transaction being refunded, the original receipt number will be formally invalidated in our records and reported as canceled in statutory Income Tax filings.
            </p>
          </section>

          {/* 5. Recurring Monthly Donations */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5 font-headline">
              <ShieldCheck className="w-6 h-6 text-[#168039]" />
              <span>5. Cancellation of Recurring Support</span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-slate-600">
              Donors who have set up recurring monthly contributions may cancel future debits at any point without penalty by emailing us at least 3 business days before the next scheduled billing date.
            </p>
          </section>

          {/* Contact */}
          <section className="border-t border-slate-200 pt-8 space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-headline">
              6. Donor Support Desk
            </h2>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 text-slate-700">
              <p className="font-bold text-slate-900 text-sm">ITLC Foundation &ndash; Accounts &amp; Donor Relations</p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#168039] shrink-0" />
                <span>G1/0049, Olive Wood Villa, Golf City, Lucknow, Uttar Pradesh – 226030, India</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#168039] shrink-0" />
                <span>Email: <a href="mailto:donation@itlcfoundation.com" className="text-[#168039] font-medium hover:underline">donation@itlcfoundation.com</a> / <a href="mailto:info@itlcfoundation.com" className="text-[#168039] font-medium hover:underline">info@itlcfoundation.com</a></span>
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
