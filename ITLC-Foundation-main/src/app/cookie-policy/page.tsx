import React from 'react';
import { PageHero } from '@/components/layout/page-hero';
import { Cookie, ShieldCheck, Settings, Eye, ExternalLink, MapPin, Mail } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Cookie Policy | ITLC Foundation Lucknow',
  description: 'Official Cookie Policy of ITLC Foundation. Explaining how we use cookies, Google AdSense DART cookies, and analytics to optimize your experience.',
};

export default function CookiePolicyPage() {
  const lastUpdated = 'September 8, 2026';

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen">
      <PageHero
        title="Cookie Policy"
        subtitle="Learn how ITLC Foundation uses cookies and web technologies to ensure secure donations, fast loading, and transparent advertising compliance."
        imageUrl="/pro/ab.png"
        imageHint="cookies and security settings"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-10">
          
          <div className="border-b border-slate-100 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
            <span><strong>Effective Date:</strong> {lastUpdated}</span>
            <span><strong>Entity:</strong> ITLC Foundation (Lucknow, UP)</span>
          </div>

          {/* 1. What are Cookies */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5 font-headline">
              <Cookie className="w-6 h-6 text-[#168039]" />
              <span>1. What Are Cookies?</span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-slate-600">
              Cookies are small text files stored on your computer, tablet, or smartphone when you visit a website. They are widely used to make websites work more efficiently, maintain user preferences, support secure donation sessions, and provide analytical data to website owners.
            </p>
          </section>

          {/* 2. Categories of Cookies We Use */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5 font-headline">
              <Settings className="w-6 h-6 text-[#168039]" />
              <span>2. Categories of Cookies We Use</span>
            </h2>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h3 className="font-bold text-slate-900 text-sm">A. Strictly Necessary / Essential Cookies</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  These cookies are vital for the core operation of our platform, enabling secure navigation, CSRF protection, and facilitating donation gateway processing via Razorpay.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h3 className="font-bold text-slate-900 text-sm">B. Performance &amp; Analytical Cookies</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  These collect aggregated, anonymous data regarding how visitors navigate our pages (e.g. which blog articles are most read), helping us improve website performance and user experience.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h3 className="font-bold text-slate-900 text-sm">C. Advertising &amp; Google AdSense Cookies</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Third-party ad networks (such as Google AdSense) may place cookies (including the DoubleClick DART cookie) to deliver non-intrusive advertisements relevant to users&apos; browsing history across the web.
                </p>
              </div>
            </div>
          </section>

          {/* 3. Google AdSense & DART Cookies */}
          <section className="space-y-4 bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5 font-headline">
              <Eye className="w-6 h-6 text-[#168039]" />
              <span>3. Google AdSense &amp; Third-Party Disclosures</span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-slate-700">
              Google uses cookies to serve ads on our site based on prior visits. You can manage or disable personalized advertising by visiting:
            </p>
            <ul className="space-y-2 text-sm sm:text-base text-slate-700 list-disc list-inside pl-2">
              <li>
                <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-[#168039] font-semibold underline inline-flex items-center gap-1">
                  <span>Google Ads Settings</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-[#168039] font-semibold underline inline-flex items-center gap-1">
                  <span>Digital Advertising Alliance (aboutads.info)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>
          </section>

          {/* 4. How to Control and Delete Cookies */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5 font-headline">
              <ShieldCheck className="w-6 h-6 text-[#168039]" />
              <span>4. How to Manage Cookies in Your Browser</span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-slate-600">
              Most web browsers automatically accept cookies, but you can usually modify your browser settings to decline cookies if you prefer. Here is how you can manage cookies across major browsers:
            </p>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 list-disc list-inside pl-2">
              <li><strong>Google Chrome:</strong> Settings &gt; Privacy and security &gt; Third-party cookies.</li>
              <li><strong>Mozilla Firefox:</strong> Options &gt; Privacy &amp; Security &gt; Cookies and Site Data.</li>
              <li><strong>Apple Safari:</strong> Preferences &gt; Privacy &gt; Manage Website Data.</li>
              <li><strong>Microsoft Edge:</strong> Settings &gt; Cookies and site permissions &gt; Manage and delete cookies.</li>
            </ul>
          </section>

          {/* Contact */}
          <section className="border-t border-slate-200 pt-8 space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-headline">
              5. Contact Us
            </h2>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 text-slate-700">
              <p className="font-bold text-slate-900 text-sm">ITLC Foundation &ndash; Compliance Desk</p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#168039] shrink-0" />
                <span>G1/0049, Olive Wood Villa, Golf City, Lucknow, UP – 226030, India</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#168039] shrink-0" />
                <span>Email: <a href="mailto:info@itlcfoundation.org" className="text-[#168039] font-medium hover:underline">info@itlcfoundation.org</a></span>
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
