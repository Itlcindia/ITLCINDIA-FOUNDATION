import React from 'react';
import { PageHero } from '@/components/layout/page-hero';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | ITLC Foundation Lucknow',
  description: 'Official Privacy Policy of ITLC Foundation. Learn how we protect your data, privacy rights, and adhere to Google AdSense and Section 80G compliance standards.',
};

export default function PrivacyPolicyPage() {
  const lastUpdated = 'September 8, 2026';

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen">
      <PageHero
        title="Privacy Policy"
        subtitle="Your privacy and trust are paramount to ITLC Foundation. Understand how your personal information is protected and utilized."
        imageUrl="/pro/ab.png"
        imageHint="security and privacy"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-10">
          
          {/* Top Notice */}
          <div className="border-b border-slate-100 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
            <span><strong>Effective Date:</strong> {lastUpdated}</span>
            <span><strong>Governing Entity:</strong> ITLC Foundation (Lucknow, UP)</span>
          </div>

          {/* Intro */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5 font-headline">
              <ShieldCheck className="w-6 h-6 text-[#168039]" />
              <span>1. Introduction &amp; Commitment to Privacy</span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-slate-600">
              ITLC Foundation (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) is a non-profit non-governmental organization registered in Lucknow, Uttar Pradesh, India. We are committed to safeguarding the privacy of our website visitors, donors, volunteers, and beneficiaries. This Privacy Policy outlines how we collect, handle, store, and disclose information gathered through our website (<Link href="/" className="text-[#168039] font-medium hover:underline">itlcfoundation.org</Link>) in compliance with applicable Indian laws including the Information Technology Act, 2000, and Google AdSense partner guidelines.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5 font-headline">
              <Eye className="w-6 h-6 text-[#168039]" />
              <span>2. Information We Collect</span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-slate-600">
              We may collect and process the following categories of information:
            </p>
            <ul className="space-y-2.5 text-sm sm:text-base text-slate-600 list-disc list-inside pl-2">
              <li><strong className="text-slate-800">Donor Information:</strong> Full name, email address, telephone/WhatsApp number, postal address, and PAN/identity details required strictly for issuing tax-deductible receipts under Section 80G of the Indian Income Tax Act.</li>
              <li><strong className="text-slate-800">Volunteer Application Data:</strong> Educational background, skills, city of residence, age, and areas of interest (e.g. tree plantation, animal welfare, child education).</li>
              <li><strong className="text-slate-800">Transactional Data:</strong> Payment transaction identifiers, donation timestamps, and transaction status provided by our authorized payment gateway (Razorpay). <em>Note: We do not store credit/debit card numbers, CVVs, or netbanking passwords on our servers.</em></li>
              <li><strong className="text-slate-800">Automated Technical Logs:</strong> IP address, browser type, operating system, device specifications, and page interaction metrics collected via web analytics.</li>
            </ul>
          </section>

          {/* Google AdSense & Advertising */}
          <section className="space-y-4 bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5 font-headline">
              <Lock className="w-6 h-6 text-[#168039]" />
              <span>3. Google AdSense &amp; Third-Party Advertising Disclosure</span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-slate-700">
              In order to raise awareness for social causes and support our educational drives, our website may display advertisements served by Google AdSense and certified third-party vendor networks. Please take note of the following:
            </p>
            <ul className="space-y-2 text-sm sm:text-base text-slate-700 list-disc list-inside pl-2">
              <li>Google, as a third-party vendor, uses cookies to serve advertisements on our site.</li>
              <li>Google&apos;s use of advertising cookies (such as the DoubleClick DART cookie) enables it and its partners to serve ads to our users based on their visits to our website and/or other websites across the Internet.</li>
              <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-[#168039] font-semibold underline">Google Ads Settings</a> or by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-[#168039] font-semibold underline">aboutads.info</a>.</li>
              <li>Third-party ad servers or ad networks use technology in their respective advertisements and links that appear on our website, which are sent directly to your browser. They automatically receive your IP address when this occurs.</li>
            </ul>
          </section>

          {/* Cookies Policy */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5 font-headline">
              <FileText className="w-6 h-6 text-[#168039]" />
              <span>4. Cookies and Web Beacons</span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-slate-600">
              Our website uses standard &ldquo;cookies&rdquo; to store information regarding visitor preferences, optimize web performance, record user-specific information on which pages the visitor accesses or visits, and customize content. You have the choice to accept or decline cookies through your individual browser settings. Disabling cookies may affect the usability of certain dynamic features such as donation receipt downloads.
            </p>
          </section>

          {/* Razorpay & Payment Processing */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5 font-headline">
              <CheckCircle2 className="w-6 h-6 text-[#168039]" />
              <span>5. Payment Gateway &amp; Financial Security</span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-slate-600">
              All financial donations are processed through PCI-DSS Level 1 compliant payment gateways (Razorpay). All communications between your browser, our servers, and payment gateways are secured using 256-bit Secure Socket Layer (SSL/TLS) encryption. ITLC Foundation does not sell, rent, or lease donor lists or sensitive financial information to any commercial entities.
            </p>
          </section>

          {/* Section 80G Tax Exemption Privacy */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-headline">
              6. Section 80G Compliance &amp; Government Reporting
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-slate-600">
              Under the provisions of the Income Tax Act, 1961, charitable organizations registered under Section 80G are mandated to file annual statements of donations (Form 10BD) with the Income Tax Department of India. Consequently, donor PAN, donation amount, and address provided during donation may be shared with statutory government authorities exclusively for tax exemption reconciliation.
            </p>
          </section>

          {/* Data Protection & Rights */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-headline">
              7. Your Data Protection Rights
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-slate-600">
              You are entitled to the following rights regarding your personal data:
            </p>
            <ul className="space-y-2 text-sm sm:text-base text-slate-600 list-disc list-inside pl-2">
              <li>The right to request copies of your personal data maintained in our records.</li>
              <li>The right to request rectification of inaccurate or incomplete information.</li>
              <li>The right to unsubscribe from our newsletter, volunteer updates, or email notices at any time.</li>
            </ul>
          </section>

          {/* Grievance & Contact */}
          <section className="border-t border-slate-200 pt-8 space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-headline">
              8. Grievance Officer &amp; Contact Information
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              If you have questions, concerns, or grievances concerning this Privacy Policy or our data management practices, please reach out to our Grievance Officer:
            </p>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 text-slate-700">
              <p className="font-bold text-slate-900 text-sm">ITLC Foundation &ndash; Privacy &amp; Legal Desk</p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#168039] shrink-0" />
                <span>G1/0049, Olive Wood Villa, Golf City, Lucknow, Uttar Pradesh – 226030, India</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#168039] shrink-0" />
                <span>Email: <a href="mailto:info@itlcfoundation.org" className="text-[#168039] font-medium hover:underline">info@itlcfoundation.org</a> / <a href="mailto:donation@itlcfoundation.com" className="text-[#168039] font-medium hover:underline">donation@itlcfoundation.com</a></span>
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
